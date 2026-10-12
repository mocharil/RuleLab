import asyncio,math,re
from app.config import settings
from app.models import StakeholderOutput
from app.services import ai,retrieval,legal

PERSONAS=[('Warga dengan akses internet terbatas','Hambatan jaringan, perangkat, literasi digital dan perjalanan.'),
 ('Penyandang disabilitas','Aksesibilitas, akomodasi, kemandirian dan privasi.'),
 ('Petugas layanan','Kapasitas pendampingan, pelatihan, antrean dan keluhan.'),
 ('Pengelola anggaran','Biaya layanan, kesiapan sarana dan evaluasi manfaat.')]

def quantitative(assumptions,assistance):
 n=assumptions['population'];p=assumptions['digital_access_pct']/100;q=assumptions['assisted_success_pct']/100 if assistance else 0
 digital=n*p;assisted=n*(1-p)*q;served=digital+assisted
 return {'served':round(served),'unserved':round(n-served),'access_pct':round(served/n*100,1),'assisted':round(assisted),
  'cost':round(digital*assumptions['digital_cost']+assisted*assumptions['assisted_cost']),
  'staff_days':round(assisted/assumptions['staff_capacity'],1),
  'formula':'digital = N × p; assisted = N × (1 − p) × q; served = digital + assisted; cost = digital × C_d + assisted × C_a'}

def has_assistance(text):
 return bool(re.search(r'\b(pendampingan|tatap muka|kanal alternatif|bantuan langsung)\b',text.lower())) and not bool(re.search(r'(tanpa|tidak menyediakan|dilarang).{0,35}(pendampingan|tatap muka|kanal alternatif|bantuan langsung)',text.lower()))

async def simulate(draft,alternative_text,assumptions):
 current='\n'.join(a['text'] for a in draft['articles']);assist_a=has_assistance(current);assist_b=has_assistance(alternative_text)
 evidence=await retrieval.context(current+' '+alternative_text,10)
 allowed={e['id'] for e in evidence}
 async def stakeholder(name,description):
  if settings.provider=='demo':
   return {'stakeholder':name,'benefits':['Kanal bantuan dapat membuka akses bagi pemohon yang mengalami hambatan.' if assist_b else 'Alur digital berpotensi mengurangi kebutuhan perjalanan bagi pengguna yang mampu mengaksesnya.'],
    'risks':[description,'Kualitas pelaksanaan belum dapat dinilai tanpa data lapangan.'],
    'mitigations':['Uji aksesibilitas bersama pengguna nyata.','Tetapkan kapasitas petugas dan prosedur eskalasi.'],
    'evidence_ids':[e['id'] for e in evidence[:2]],'questions_to_validate':['Bagaimana kebutuhan kelompok ini di wilayah sasaran?','Apakah fasilitas dan anggaran pendukung sudah tersedia?']}
  output,_=await ai.generate('Bandingkan dampak alternatif A dan B dari sudut persona ini. Jangan menghasilkan statistik populasi atau mengklaim mewakili masyarakat. Tunjukkan manfaat, risiko, mitigasi dan kebutuhan validasi lapangan.',
   {'stakeholder':name,'description':description,'A':current,'B':alternative_text,'assumptions':assumptions,'evidence':retrieval.evidence_payload(evidence),'legal_context':legal.context(draft['regulation_type'],evidence)},StakeholderOutput)
  output['stakeholder']=name
  if any(id not in allowed for id in output['evidence_ids']):raise ai.AIError('Sumber persona di luar evidence. Hasil ditolak.')
  return output
 # Independent perspectives, not a calibrated agent-based population simulation.
 tasks=[asyncio.create_task(stakeholder(n,d)) for n,d in PERSONAS]
 try:perspectives=await asyncio.gather(*tasks)
 except BaseException:
  for task in tasks:task.cancel()
  await asyncio.gather(*tasks,return_exceptions=True)
  raise
 a=quantitative(assumptions,assist_a);b=quantitative(assumptions,assist_b)
 sensitivity=[]
 for delta in [-10,0,10]:
  changed={**assumptions,'digital_access_pct':max(0,min(100,assumptions['digital_access_pct']+delta))}
  sensitivity.append({'digital_access_pct':changed['digital_access_pct'],'A':quantitative(changed,assist_a)['access_pct'],'B':quantitative(changed,assist_b)['access_pct']})
 return {'provider':{'mode':'demo' if settings.provider=='demo' else 'live','provider':settings.provider,'model':None if settings.provider=='demo' else settings.model},
  'assumptions':assumptions,'alternative_text':alternative_text,'A':a,'B':b,
  'assistance_detection':{'A':assist_a,'B':assist_b,'method':'keyword_heuristic_needs_review'},
  'delta':{'served':b['served']-a['served'],'cost':b['cost']-a['cost'],'access_points':round(b['access_pct']-a['access_pct'],1)},
  'stakeholders':perspectives,'sensitivity':sensitivity,'evidence':evidence,
  'limitations':['Angka dihitung dari asumsi input pengguna, bukan statistik masyarakat atau prediksi Gemini.',
   'Persona sintetis tidak menggantikan konsultasi masyarakat.', 'Model biaya hanya menghitung layanan berhasil, belum mencakup biaya tetap, kegagalan, antrean atau waktu tunggu.',
   'Deteksi kanal bantuan berbasis kata kunci, perlu dicek pengguna.', 'Ini simulasi skenario sederhana, bukan engine MiroFish atau model populasi terkalibrasi.']}
