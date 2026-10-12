"""Extract instructions as pending candidates, never auto-apply legal changes."""
import bisect
import json
import re
from pathlib import Path
import fitz

ROOT=Path(__file__).resolve().parents[1]
def extract():
    events=[]
    for rid in ('uu-15-2019','uu-13-2022'):
        doc=json.loads((ROOT/'data/enriched'/f'{rid}.json').read_text())
        pages=[re.sub(r'\s+',' ',p.get_text()).strip() for p in fitz.open(ROOT/'data'/doc['provenance']['raw_file'])]
        offsets=[];text=''
        for page in pages:offsets.append(len(text));text+=page+' '
        # Explanation and annex examples cannot become operative changes.
        end=re.search(r'Pasal II\s+Undang-Undang ini',text)
        body=text[:end.start()] if end else ''
        pattern=r'(?<!\w)(\d+)\.\s+((?:Ketentuan|Di antara|Penjelasan|Setelah)\b.{0,2200}?(?:berbunyi sebagai berikut:|berbunyi sebagai berikut\s*:|tercantum dalam penjelasan(?: pasal demi pasal)?\.))'
        for match in re.finditer(pattern,body):
            quote=match.group(0);instruction=match.group(2)
            operation='requires_manual_interpretation';numbers=[];ayat=[]
            m=re.match(r'Ketentuan Pasal (\d+[A-Z]?) diubah sehingga',instruction)
            if m:operation='replace_article';numbers=[m.group(1)]
            m=re.match(r'Ketentuan ayat (.+?) Pasal (\d+[A-Z]?) diubah sehingga',instruction)
            if m:operation='replace_paragraph';numbers=[m.group(2)];ayat=re.findall(r'\((\d+[a-z]?)\)',m.group(1))
            if instruction.startswith('Di antara Pasal') and 'yakni' in instruction:
                operation='insert_article';numbers=re.findall(r'Pasal (\d+[A-Z]?)',instruction.split('yakni',1)[1])
            if instruction.startswith('Di antara ayat'):
                operation='insert_paragraph' if 'serta ketentuan' not in instruction else 'compound_change'
                numbers=re.findall(r'Pasal (\d+[A-Z]?)',instruction)
                ayat=re.findall(r'ayat \((\d+[a-z]?)\)',instruction.split('yakni',1)[-1])
            if instruction.startswith('Penjelasan'):operation='change_explanation'
            if 'tetap, Penjelasan' in instruction:
                operation='change_explanation';numbers=re.findall(r'Pasal (\d+[A-Z]?)',instruction)
            events.append({'id':rid+'/instruction/'+match.group(1),'source_regulation_id':rid,
              'source_regulation_type':doc['metadata']['type'],'target_regulation_id':'uu-12-2011',
              'instruction_number':match.group(1),'operation':operation,
              'target_articles':list(dict.fromkeys(numbers)),'target_paragraphs':ayat,
              'source_quote':quote,'source_url':doc['provenance']['source_url'],
              'source_sha256':doc['provenance']['sha256'],
              'pages':list(range(bisect.bisect_right(offsets,match.start()),bisect.bisect_right(offsets,match.end()-1)+1)),
              'replacement_evidence_ids':[a['id'] for a in doc['articles'] if a['number'] in numbers],
              'effective_date_candidate':doc['metadata']['promulgated_on'],
              'effective_from':None,'review_status':'pending','auto_apply':False,
              'method':'limited_regex_from_original_pdf',
              'limitations':['Instruksi belum direview; target ayat/teks pengganti/tanggal perlu verifikasi.',
                'Parser tidak lengkap untuk perubahan frasa, lampiran scan, penghapusan, pencabutan, omnibus, atau putusan.']})
    (ROOT/'data/legal/change_candidates.json').write_text(json.dumps(events,ensure_ascii=False,indent=2)+'\n')
    print(f'{len(events)} pending change instructions; none applied.')
if __name__=='__main__':extract()
