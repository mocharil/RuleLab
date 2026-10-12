import re
from app import store
from app.config import settings
from app.models import AnalysisOutput, DraftInput
from app.services import ai,retrieval,legal
from app.services.ingestion import HIERARCHY

LIMITATIONS=['Corpus contoh terbatas, bukan keseluruhan hukum Indonesia.',
 'Naskah asli dan perubahan belum dikonsolidasi; status berlaku serta putusan pengadilan belum diverifikasi menyeluruh.',
 'Temuan adalah potensi konflik yang perlu ditinjau ahli. Hasil kosong tidak membuktikan rancangan bebas konflik.']

def anchors(doc_id,numbers):
 doc=next((d for d in store.regulations() if d['id']==doc_id),None)
 return [store.article(a['id']) for a in doc['articles'] if a['number'] in numbers] if doc else []

def relation(draft_type,source_type):
 left=HIERARCHY.get(draft_type);right=HIERARCHY.get(source_type)
 if left is None or right is None:return 'Kewenangan/delegasi perlu ditinjau, tidak diberi peringkat otomatis'
 if left>right:return 'Sumber memiliki kedudukan lebih tinggi daripada rancangan'
 if left==right:return 'Kedudukan setara; lex specialis dan waktu berlaku perlu ditinjau'
 return 'Sumber memiliki kedudukan lebih rendah; tinjau dampak perubahan/delegasi'

def demo_findings(draft,evidence):
 findings=[]
 def add(a,title,reason,ids,revised,counter,severity='high',category='implementation_risk'):
  allowed={e['id'] for e in evidence}
  refs=[e['id'] for e in ids if e['id'] in allowed]
  if refs and any((HIERARCHY.get(draft['regulation_type']) or 0)>(e['hierarchy_rank'] or 99) for e in ids):category='potential_vertical_conflict'
  findings.append({'article_number':a['number'],'category':category,'severity':severity,'title':title,
   'reasoning':reason,'evidence_ids':refs,'counterargument':counter,'proposed_text':revised,
   'review_questions':['Apakah ketentuan ini berlaku pada layanan dan kelompok yang sama?','Apakah ada pengecualian, delegasi, perubahan, atau putusan terkait?']})
  findings[-1]['legal_rule_ids']=['hierarchy','conflict_test','version_integrity']
  findings[-1]['legal_checks']={'temporal':'Status sumber belum diverifikasi','scope':'Pola layanan publik; ruang lingkup konkret perlu review',
    'authority':'Perbandingan tingkat awal; delegasi belum diverifikasi','exceptions':'Pengecualian perlu review',
    'alternative_interpretation':counter}
 for a in draft['articles']:
  t=a['text'].lower()
  digital_only=bool(re.search(r'\b(hanya|semata-mata)\b.{0,90}\b(digital|aplikasi|elektronik|daring)\b',t))
  assisted=bool(re.search(r'\b(pendampingan|tatap muka|kanal alternatif|bantuan langsung)\b',t)) and not re.search(r'(tidak|tanpa|dilarang).{0,35}(pendampingan|tatap muka|kanal alternatif|bantuan langsung)',t)
  if digital_only and not assisted:
   add(a,'Akses layanan berpotensi membatasi kelompok tertentu',
    'Kanal tunggal perlu diuji terhadap asas kesamaan hak, perlakuan tidak diskriminatif, kemudahan, dan fasilitas kelompok rentan. Sumber tidak secara otomatis melarang digitalisasi.',
    anchors('uu-25-2009',{'4','29'})+anchors('uu-8-2016',{'19'}),
    '(1) Permohonan dapat diajukan melalui aplikasi digital atau kanal pendampingan yang disediakan penyelenggara.\n(2) Penyelenggara menyediakan akomodasi yang layak bagi pemohon yang mengalami hambatan akses.\n(3) Tata cara dan standar layanan ditetapkan setelah melibatkan masyarakat dan pihak terkait.',
    'Layanan digital dapat tetap sesuai apabila tersedia akomodasi efektif dan dasar kewenangan yang memadai.')
  if re.search(r'pengaduan.{0,100}(tidak perlu|tidak wajib|tidak akan|dilarang).{0,45}(ditanggapi|ditindaklanjuti|diterima|direspons)',t):
   add(a,'Hak mendapatkan tanggapan pengaduan perlu dilindungi',
    'Pengecualian tanggapan secara menyeluruh berpotensi bertentangan dengan hak masyarakat dan kewajiban pengelolaan pengaduan.',
    anchors('uu-25-2009',{'18','36','44'}),
    'Penyelenggara menyediakan sarana pengaduan yang mudah diakses, menugaskan petugas yang kompeten, serta menerima, menanggapi, dan menindaklanjuti pengaduan sesuai batas waktu dan tata cara dalam peraturan perundang-undangan.',
    'Pengaduan di luar kewenangan atau tidak lengkap dapat memerlukan prosedur berbeda, dengan pemberitahuan kepada pengadu.')
  if 'tanpa masa transisi' in t:
   add(a,'Kesiapan pelaksanaan belum dipertimbangkan',
    'Pemberlakuan langsung dapat menambah beban operasional. Durasi transisi memerlukan data kesiapan, bukan angka yang diasumsikan AI.',[],
    'Pelaksanaan dilakukan secara bertahap berdasarkan evaluasi kesiapan sarana, petugas, dan akses masyarakat. Jadwal transisi ditetapkan setelah konsultasi dengan pihak terkait.',
    'Pemberlakuan langsung mungkin tepat bila infrastruktur dan kapasitas layanan sudah tersedia.','medium')
 return {'summary':f'{len(findings)} temuan awal dari pemeriksaan aturan demo. Seluruh pasal ditinjau terhadap pola yang didukung demo; cakupannya terbatas.', 'findings':findings,'limitations':LIMITATIONS}

def validate_evidence(output,evidence,draft):
 allowed={e['id'] for e in evidence};numbers={a['number'] for a in draft['articles']}
 for f in output['findings']:
  if f['article_number'] not in numbers:raise ai.AIError('AI merujuk nomor pasal rancangan yang tidak ada.')
  if any(id not in allowed for id in f['evidence_ids']):raise ai.AIError('AI merujuk sumber di luar evidence. Hasil ditolak.')
  if f['category'].startswith('potential_') and not f['evidence_ids']:
   f['category']='coverage_gap';f['review_questions'].append('Dasar hukum belum tersedia dalam evidence, perlu pencarian tambahan.')
 return output

async def analyze(draft,evidence_override=None,as_of=None):
 query=' '.join(a['text'] for a in draft['articles'])
 evidence=evidence_override if evidence_override is not None else await retrieval.context(query)
 if evidence_override is None:
  for e in anchors('uu-25-2009',{'4','18','29','36','44'})+anchors('uu-8-2016',{'19'}):
   if not any(x['id']==e['id'] for x in evidence):evidence.append(e)
 legal_context=legal.context(draft['regulation_type'],evidence,as_of)
 if settings.provider=='demo':
  output=demo_findings(draft,evidence);provider={'mode':'demo','provider':'deterministic_rules','model':None}
 else:
  output,provider=await ai.generate('Tinjau SETIAP pasal dan hubungan antar-pasal rancangan. Laporkan potensi konflik, ambiguitas, dan risiko pelaksanaan beserta usulan teks. evidence_ids harus cocok persis. Masukkan kontra-argumen dan pertanyaan review. Jangan menganggap semua sumber berlaku saat ini.',
   {'draft':draft,'evidence':retrieval.evidence_payload(evidence),'legal_context':legal_context,
    'output_requirements':'Untuk potensi konflik isi legal_rule_ids dari pedoman, evidence_quotes berupa kutipan persis sumber, norm_collision (dua norma yang beririsan dan tak dapat dipenuhi bersama), serta legal_checks temporal/scope/authority/exceptions/alternative_interpretation. Jangan menyatakan pembatalan final.'},AnalysisOutput)
  output['limitations']=list(dict.fromkeys(output['limitations']+LIMITATIONS))
 output=validate_evidence(output,evidence,draft)
 for f in output['findings']:
  try:legal.validate_finding(f,evidence,draft['regulation_type'],legal_context['as_of_date'],live=settings.provider!='demo')
  except ValueError as exc:raise ai.AIError(str(exc)) from exc
  f['original_text']=next(a['text'] for a in draft['articles'] if a['number']==f['article_number'])
  f['evidence']=[{**e,'hierarchy_relation':relation(draft['regulation_type'],e['regulation_type'])} for e in evidence if e['id'] in f['evidence_ids']]
 return {**output,'legal_context':legal_context,'provider':provider,'evidence':evidence,'coverage':{'draft_articles':len(draft['articles']),'retrieved_articles':len(evidence),'corpus_regulations':len(store.regulations()),'current_law_verified':False}}

async def generate_draft(brief,regulation_type):
 evidence=await retrieval.context(brief)
 if settings.provider=='demo':
  payload={'title':brief[:100],'regulation_type':regulation_type,'scope':brief,
   'preamble':'Rancangan awal simulasi. Landasan filosofis, sosiologis, yuridis serta kewenangan perlu dilengkapi melalui review.',
   'articles':[{'number':'1','text':'Layanan dalam rancangan ini adalah layanan administrasi publik yang termasuk dalam kewenangan penyelenggara.'},
    {'number':'2','text':'(1) Penyelenggara menyediakan layanan melalui kanal digital dan kanal pendampingan.\n(2) Pemohon yang mengalami hambatan akses memperoleh bantuan dan akomodasi yang layak.'},
    {'number':'3','text':'Standar pelayanan disusun dengan melibatkan masyarakat dan pihak terkait serta memperhatikan kemampuan penyelenggara dan kondisi lingkungan.'},
    {'number':'4','text':'Penyelenggara menyediakan sarana pengaduan, memberi tanggapan, dan menindaklanjuti pengaduan sesuai peraturan perundang-undangan.'},
    {'number':'5','text':'Pelaksanaan layanan dilakukan bertahap berdasarkan evaluasi kesiapan, dengan pemantauan dampak dan evaluasi berkala.'}]}
  provider={'mode':'demo','provider':'template','model':None}
 else:
  payload,provider=await ai.generate('Buat rancangan awal 5 sampai 8 pasal berdasarkan brief dan sumber yang tersedia. regulation_type harus sama dengan permintaan. Jangan mengarang nomor regulasi, tanggal pengesahan, atau pejabat. Isi preamble dengan catatan aspek yang masih perlu dilengkapi.',
   {'brief':brief,'regulation_type':regulation_type,'evidence':retrieval.evidence_payload(evidence),'legal_context':legal.context(regulation_type,evidence)},DraftInput)
  payload['regulation_type']=regulation_type
 return {'draft':DraftInput.model_validate(payload).model_dump(),'provider':provider,'evidence':evidence}
