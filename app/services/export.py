from io import BytesIO
from docx import Document
from docx.shared import Cm,Pt,RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH


def export_docx(draft,runs,report=False):
 document=Document();s=document.sections[0];s.top_margin=Cm(2.5);s.bottom_margin=Cm(2.5);s.left_margin=Cm(3);s.right_margin=Cm(2.5)
 style=document.styles['Normal'];style.font.name='Times New Roman';style.font.size=Pt(12);style.paragraph_format.space_after=Pt(7)
 header=s.header.paragraphs[0];header.text='RULELAB  /  DRAF UNTUK REVIEW';header.style='Caption'
 p=document.add_paragraph('RANCANGAN '+draft['regulation_type']);p.alignment=WD_ALIGN_PARAGRAPH.CENTER;p.runs[0].bold=True
 p=document.add_paragraph(draft['title'].upper());p.alignment=WD_ALIGN_PARAGRAPH.CENTER;p.runs[0].bold=True
 document.add_paragraph(f"Versi rancangan {draft['revision']} • Belum disahkan • Perlu review ahli hukum",style='Caption')
 if draft.get('preamble'):document.add_paragraph(draft['preamble'])
 document.add_paragraph('Ruang lingkup: '+draft.get('scope',''))
 for a in draft['articles']:
  h=document.add_paragraph('Pasal '+a['number']);h.alignment=WD_ALIGN_PARAGRAPH.CENTER;h.runs[0].bold=True
  for line in a['text'].splitlines():
   if line.strip():document.add_paragraph(line.strip())
 if report:
  document.add_page_break();document.add_heading('Lampiran review RuleLab',0)
  document.add_paragraph('Laporan AI pendukung review, bukan penetapan keabsahan hukum. Hanya analisis pada versi rancangan ini yang dilampirkan.')
  for run in runs:
   if run['revision']!=draft['revision']:continue
   p=run['payload'];document.add_heading('Analisis konflik' if run['kind']=='analysis' else 'Forum netizen sintetis' if run['kind']=='social' else 'Simulasi dampak',1)
   document.add_paragraph(f"Provider: {p['provider']['provider']} | Mode: {p['provider']['mode']} | Review: {run['review_status']}")
   if run.get('review_notes'):document.add_paragraph('Catatan reviewer: '+run['review_notes'])
   if run['kind']=='analysis':
    document.add_paragraph(p['summary'])
    if p.get('legal_context'):
     ctx=p['legal_context'];document.add_paragraph('Pedoman: '+ctx['rulebook_version']+' | Tanggal analisis: '+ctx['as_of_date'])
     document.add_paragraph(ctx['notice'])
    for f in p['findings']:
     document.add_heading('Pasal '+f['article_number']+': '+f['title'],2);document.add_paragraph(f['reasoning'])
     document.add_paragraph('Interpretasi alternatif: '+f['counterargument'])
     document.add_paragraph('Aturan pedoman: '+', '.join(f.get('legal_rule_ids',[])))
     for warning in f.get('validation',{}).get('warnings',[]):document.add_paragraph('Validasi: '+warning)
     for e in f['evidence']:
      document.add_paragraph(e['regulation_label']+' Pasal '+e['number']+' | '+e['source']['url']+' | Halaman '+', '.join(map(str,e['pages'])))
     document.add_paragraph('Usulan: '+f['proposed_text'])
   elif run['kind']=='social':
    document.add_paragraph('Asumsi: '+str(p['assumptions']))
    for scenario in ['A','B']:
     document.add_heading('Skenario '+scenario,2)
     for comment in p['scenarios'][scenario]['comments']:
      document.add_paragraph(comment['name']+' | Putaran '+str(comment['round'])+' | '+comment['stance'])
      document.add_paragraph(comment['comment'])
      document.add_paragraph('Alasan: '+comment['rationale'])
      document.add_paragraph('Balasan: '+str(comment['reply_to']))
      document.add_paragraph('Usulan: '+comment['proposal'])
   else:
    document.add_paragraph('Asumsi: '+str(p['assumptions']));document.add_paragraph('Hasil A: '+str(p['A']));document.add_paragraph('Hasil B: '+str(p['B']))
    for person in p['stakeholders']:
     document.add_heading(person['stakeholder'],2)
     for risk in person['risks']:document.add_paragraph(risk,style='List Bullet')
   for limitation in p['limitations']:document.add_paragraph(limitation,style='List Bullet')
 footer=s.footer.paragraphs[0];footer.text='Rancangan untuk pembahasan. Tidak mempunyai status peraturan yang disahkan.';footer.style='Caption'
 stream=BytesIO();document.save(stream);return stream.getvalue()
