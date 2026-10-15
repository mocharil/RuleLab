import re
from app import store
from app.config import settings
from app.models import AnalysisOutput, DraftInput
from app.services import ai,retrieval,legal
from app.services.ingestion import HIERARCHY

LIMITATIONS=['Sample corpus is limited; it is not the whole of Indonesian law.',
 'Original texts and amendments are not consolidated; effective status and court rulings are not fully verified.',
 'Findings are potential conflicts for expert review. An empty result does not prove the draft is conflict-free.']

def anchors(doc_id,numbers):
 doc=next((d for d in store.regulations() if d['id']==doc_id),None)
 return [store.article(a['id']) for a in doc['articles'] if a['number'] in numbers] if doc else []

def relation(draft_type,source_type):
 left=HIERARCHY.get(draft_type);right=HIERARCHY.get(source_type)
 if left is None or right is None:return 'Authority/delegation needs review; not ranked automatically'
 if left>right:return 'The source ranks higher than the draft'
 if left==right:return 'Equal rank; lex specialis and effective dates need review'
 return 'The source has a lower rank; review the effect of amendments/delegation'

def demo_findings(draft,evidence):
 findings=[]
 def add(a,title,reason,ids,revised,counter,severity='high',category='implementation_risk'):
  allowed={e['id'] for e in evidence}
  refs=[e['id'] for e in ids if e['id'] in allowed]
  if refs and any((HIERARCHY.get(draft['regulation_type']) or 0)>(e['hierarchy_rank'] or 99) for e in ids):category='potential_vertical_conflict'
  findings.append({'article_number':a['number'],'category':category,'severity':severity,'title':title,
   'reasoning':reason,'evidence_ids':refs,'counterargument':counter,'proposed_text':revised,
   'review_questions':['Does this provision apply to the same service and groups?','Are there related exceptions, delegations, amendments or court rulings?']})
  findings[-1]['legal_rule_ids']=['hierarchy','conflict_test','version_integrity']
  findings[-1]['legal_checks']={'temporal':'Source status not verified','scope':'Public service pattern; concrete scope needs review',
    'authority':'Initial rank comparison; delegation not verified','exceptions':'Exceptions need review',
    'alternative_interpretation':counter}
 for a in draft['articles']:
  t=a['text'].lower()
  digital_only=bool(re.search(r'\b(hanya|semata-mata)\b.{0,90}\b(digital|aplikasi|elektronik|daring)\b',t))
  assisted=bool(re.search(r'\b(pendampingan|tatap muka|kanal alternatif|bantuan langsung)\b',t)) and not re.search(r'(tidak|tanpa|dilarang).{0,35}(pendampingan|tatap muka|kanal alternatif|bantuan langsung)',t)
  if digital_only and not assisted:
   add(a,'Service access may exclude certain groups',
    'A single channel must be tested against equal rights, non-discrimination, ease of access and facilities for vulnerable groups. The sources do not automatically prohibit digitalization.',
    anchors('uu-25-2009',{'4','29'})+anchors('uu-8-2016',{'19'}),
    '(1) Permohonan dapat diajukan melalui aplikasi digital atau kanal pendampingan yang disediakan penyelenggara.\n(2) Penyelenggara menyediakan akomodasi yang layak bagi pemohon yang mengalami hambatan akses.\n(3) Tata cara dan standar layanan ditetapkan setelah melibatkan masyarakat dan pihak terkait.',
    'A digital service can still comply if effective accommodation and an adequate authority basis are in place.')
  if re.search(r'pengaduan.{0,100}(tidak perlu|tidak wajib|tidak akan|dilarang).{0,45}(ditanggapi|ditindaklanjuti|diterima|direspons)',t):
   add(a,'The right to a response to complaints must be protected',
    'A blanket exemption from responding may conflict with public rights and the duty to manage complaints.',
    anchors('uu-25-2009',{'18','36','44'}),
    'Penyelenggara menyediakan sarana pengaduan yang mudah diakses, menugaskan petugas yang kompeten, serta menerima, menanggapi, dan menindaklanjuti pengaduan sesuai batas waktu dan tata cara dalam peraturan perundang-undangan.',
    'Complaints outside the agency’s authority or incomplete complaints may need a different procedure, with notice to the complainant.')
  if 'tanpa masa transisi' in t:
   add(a,'Implementation readiness has not been considered',
    'Immediate enforcement may add operational burden. The transition period needs readiness data, not a number assumed by AI.',[],
    'Pelaksanaan dilakukan secara bertahap berdasarkan evaluasi kesiapan sarana, petugas, dan akses masyarakat. Jadwal transisi ditetapkan setelah konsultasi dengan pihak terkait.',
    'Immediate enforcement may be appropriate if infrastructure and service capacity are already in place.','medium')
 return {'summary':f'{len(findings)} initial findings from the demo rule check. All articles were checked against the patterns the demo supports; coverage is limited.', 'findings':findings,'limitations':LIMITATIONS}

def validate_evidence(output,evidence,draft):
 allowed={e['id'] for e in evidence};numbers={a['number'] for a in draft['articles']}
 for f in output['findings']:
  if f['article_number'] not in numbers:raise ai.AIError('The AI referenced a draft article number that does not exist.')
  if any(id not in allowed for id in f['evidence_ids']):raise ai.AIError('The AI referenced a source outside the evidence. Result rejected.')
  if f['category'].startswith('potential_') and not f['evidence_ids']:
   f['category']='coverage_gap';f['review_questions'].append('No legal basis is available in the evidence; further search is needed.')
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
    'output_requirements':'Untuk potensi konflik isi legal_rule_ids dari pedoman, evidence_quotes berupa kutipan persis sumber, norm_collision (two overlapping norms dan tak dapat dipenuhi bersama), serta legal_checks temporal/scope/authority/exceptions/alternative_interpretation. Jangan menyatakan pembatalan final.'},AnalysisOutput)
  output['limitations']=list(dict.fromkeys(output['limitations']+LIMITATIONS))
 if settings.provider=='demo':
  output=validate_evidence(output,evidence,draft)
  for f in output['findings']:
   try:legal.validate_finding(f,evidence,draft['regulation_type'],legal_context['as_of_date'])
   except ValueError as exc:raise ai.AIError(str(exc)) from exc
 else:
  # Live: a finding whose citations fail verification is dropped on its own instead of discarding the whole run.
  kept,rejected=[],0
  for f in output['findings']:
   try:
    validate_evidence({'findings':[f]},evidence,draft)
    legal.validate_finding(f,evidence,draft['regulation_type'],legal_context['as_of_date'],live=True)
    kept.append(f)
   except (ai.AIError,ValueError):rejected+=1
  output['findings']=kept
  output['rejected_findings']=rejected
  if rejected:output['limitations']=list(dict.fromkeys(output['limitations']+[f'{rejected} AI finding(s) were rejected automatically because their citations or quotes could not be verified against the source text.']))
 for f in output['findings']:
  f['original_text']=next(a['text'] for a in draft['articles'] if a['number']==f['article_number'])
  f['evidence']=[{**e,'hierarchy_relation':relation(draft['regulation_type'],e['regulation_type'])} for e in evidence if e['id'] in f['evidence_ids']]
 return {**output,'legal_context':legal_context,'provider':provider,'evidence':evidence,'coverage':{'draft_articles':len(draft['articles']),'retrieved_articles':len(evidence),'corpus_regulations':len(store.regulations()),'current_law_verified':False}}

def default_preamble(title: str, reg_type: str) -> str:
 from app.services.drafting import build,TemplateRequest
 return build(TemplateRequest(title=title,regulation_type=reg_type))['draft']['preamble']

async def generate_draft(brief,regulation_type):
 evidence=await retrieval.context(brief)
 if settings.provider=='demo':
  title_clean = brief[:100].strip() or 'Layanan Publik Digital yang Inklusif'
  payload={'title':title_clean,'regulation_type':regulation_type,'scope':brief,
   'preamble':default_preamble(title_clean, regulation_type),
   'articles':[{'number':'1','text':'Layanan dalam rancangan ini adalah layanan administrasi publik yang termasuk dalam kewenangan penyelenggara.'},
    {'number':'2','text':'(1) Penyelenggara menyediakan layanan melalui kanal digital dan kanal pendampingan.\n(2) Pemohon yang mengalami hambatan akses memperoleh bantuan dan akomodasi yang layak.'},
    {'number':'3','text':'Standar pelayanan disusun dengan melibatkan masyarakat dan pihak terkait serta memperhatikan kemampuan penyelenggara dan kondisi lingkungan.'},
    {'number':'4','text':'Penyelenggara menyediakan sarana pengaduan, memberi tanggapan, dan menindaklanjuti pengaduan sesuai peraturan perundang-undangan.'},
    {'number':'5','text':'Pelaksanaan layanan dilakukan bertahap berdasarkan evaluasi kesiapan, dengan pemantauan dampak dan evaluasi berkala.'}]}
  provider={'mode':'demo','provider':'template','model':None}
 else:
  payload,provider=await ai.generate(
   'Buat rancangan awal 5 sampai 8 pasal berdasarkan brief dan sumber yang tersedia. regulation_type harus sama dengan permintaan. Wajib susun bagian pembukaan (preamble) sesuai format baku Lampiran II UU 12/2011: diawali DENGAN RAHMAT TUHAN YANG MAHA ESA, frasa jabatan pembentuk peraturan, konsiderans Menimbang (butir a, b, c), dasar hukum Mengingat (angka 1, 2), klausul Dengan Persetujuan Bersama (jika UU/Perda), dan diktum MEMUTUSKAN: Menetapkan:. Batang tubuh memuat pasal dengan nomor ayat bertanda kurung (1), (2) dan rincian huruf a., b., c.',
   {'brief':brief,'regulation_type':regulation_type,'evidence':retrieval.evidence_payload(evidence),'legal_context':legal.context(regulation_type,evidence)},DraftInput)
  payload['regulation_type']=regulation_type
 return {'draft':DraftInput.model_validate(payload).model_dump(),'provider':provider,'evidence':evidence}
