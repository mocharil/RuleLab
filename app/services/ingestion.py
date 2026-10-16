"""Loss-aware PDF/HTML extraction. Original bytes and page text remain authoritative."""
from __future__ import annotations
import hashlib
import json
import re
from pathlib import Path
import fitz
from bs4 import BeautifulSoup

HIERARCHY = {'UUD': 1, 'TAP_MPR': 2, 'UU': 3, 'PERPPU': 3, 'PP': 4, 'PERPRES': 5, 'PERDA_PROV': 6, 'PERDA_KAB': 7}
TOPICS = {
 'akses_layanan': ['pelayanan', 'akses', 'fasilitas', 'kemudahan', 'keterjangkauan'],
 'disabilitas': ['disabilitas', 'rentan', 'aksesibilitas', 'akomodasi'],
 'partisipasi': ['masyarakat', 'partisipasi', 'mengikutsertakan', 'musyawarah'],
 'pengaduan': ['pengaduan', 'keluhan', 'ombudsman'],
 'informasi': ['informasi', 'elektronik', 'manual', 'keterbukaan'],
 'pembentukan_regulasi': ['perundang-undangan', 'rancangan', 'pengundangan', 'harmonisasi'],
 'biaya': ['biaya', 'tarif', 'anggaran'],
 'data_pribadi': ['data pribadi', 'kerahasiaan', 'identitas'],
}

def sha256(data: bytes) -> str:
 return hashlib.sha256(data).hexdigest()

def clean_line(line: str) -> str:
 s = line.strip().replace('\u00ad', '').replace('\x02', '').replace('\u201c', '"').replace('\u201d', '"')
 if re.fullmatch(r'(?:www\..*|\d{4},\s*No\..*|-?\s*\d+\s*-?|SK\s*No.*)', s):
  return ''
 return s

def enrich(text: str) -> dict:
 lower = text.lower()
 return {'method': 'deterministic_rules_v1', 'review_status': 'unreviewed',
  'topics': [k for k, words in TOPICS.items() if any(w in lower for w in words)],
  'norm_types': [label for label, pat in [('obligation', r'\b(wajib|harus|berkewajiban)\b'), ('prohibition', r'\b(dilarang|tidak boleh)\b'), ('permission', r'\b(dapat|berhak)\b')] if re.search(pat, lower)],
  'actors': [a for a in ['masyarakat', 'penyelenggara', 'pemerintah', 'menteri', 'penyandang disabilitas', 'pelaksana', 'presiden'] if a in lower],
  'references': list(dict.fromkeys(re.findall(r'Pasal\s+\d+[A-Z]?(?:\s+ayat\s*\(\d+\))?', text))),
  'extractive_preview': text[:240],
  'exceptions_detected': bool(re.search(r'\b(kecuali|dalam hal|sepanjang)\b', lower))}

def extract_file(path: Path) -> dict:
 data = path.read_bytes()
 pages = []
 if data.lstrip().startswith(b'%PDF'):
  with fitz.open(stream=data, filetype='pdf') as pdf:
   for i, page in enumerate(pdf):
    pages.append({'page': i+1, 'text': page.get_text(sort=True), 'extraction_method': 'pdf_text',
     'needs_ocr': len(page.get_text().strip()) < 80})
  method = 'pymupdf_text'
 else:
  soup = BeautifulSoup(data, 'html.parser')
  for node in soup(['script', 'style']): node.decompose()
  pages = [{'page': None, 'text': soup.get_text('\n', strip=True), 'extraction_method': 'html_text', 'needs_ocr': False}]
  method = 'beautifulsoup_html'
 return {'schema_version': '1.0', 'file': path.name, 'sha256': sha256(data),
  'extraction_method': method, 'pages': pages, 'page_count': len(pages),
  'quality': {'ocr_needed_pages': [p['page'] for p in pages if p['needs_ocr']], 'human_verified': False}}

def structure(meta: dict, extracted: dict, retrieved_at: str, raw_filename: str, actual_url: str) -> dict:
 lines = []
 for page in extracted['pages']:
  for line in page['text'].splitlines():
   cleaned = clean_line(line)
   if cleaned: lines.append((cleaned, page['page']))
 # Strict single-line heading avoids treating wrapped inline references as articles.
 heading = re.compile(r'^Pasal[ \t]+(\d+[A-Z]?|I|II)[ \t]*$')
 articles = []
 current = None
 chapter = None
 section = None
 seen = set()
 for idx, (line, page) in enumerate(lines):
  if articles and (re.match(r'^(?:PENJELASAN|Disahkan di|Ditetapkan di)\b', line)): break
  if re.match(r'^BAB [IVXLCDM]+$', line):
   chapter = line
   if idx+1 < len(lines): chapter += ' ' + lines[idx+1][0]
   current = None
  if re.match(r'^Bagian\s+\w+$', line):
   section = line
   current = None
  match = heading.match(line)
  if match:
   number = match.group(1)
   if number in seen:
    # Repeated headings often belong to explanations. Preserve raw pages, don't replace body.
    current = None
    continue
   seen.add(number)
   current = {'number': number, 'chapter': chapter, 'section': section, 'lines': [], 'pages': [page] if page else []}
   articles.append(current)
  elif current:
   # Headings for the next chapter do not belong to the preceding article.
   if line.startswith(('BAB ', 'Bagian ')): continue
   current['lines'].append(line)
   if page and page not in current['pages']: current['pages'].append(page)
 version_id = meta['id'] + '@' + extracted['sha256'][:12]
 structured = []
 for article in articles:
  # Remove signing block from final article, retain source text separately.
  raw_text = '\n'.join(article.pop('lines'))
  if article['number'] == str(meta.get('expected_articles')) or article['number'] == 'II':
   raw_text = re.split(r'\bAgar\s+setiap\s+orang\s+mengetahuinya', raw_text)[0]
  # Single spaces are safe normalization; raw page text is unchanged.
  text = re.sub(r'\s+', ' ', raw_text).strip()
  article_id = f"{version_id}/pasal/{article['number']}"
  paragraphs = []
  # Numbered definitions are classified separately from ayat in Pasal 1.
  matches = list(re.finditer(r'(?m)^\((\d+[a-z]?)\)[ \t]*(.*)', raw_text))
  for j, m in enumerate(matches):
   end = matches[j+1].start() if j+1 < len(matches) else len(raw_text)
   paragraphs.append({'number': m.group(1), 'kind': 'definition_or_ayat' if article['number']=='1' else 'ayat',
    'text': re.sub(r'\s+', ' ', raw_text[m.start():end]).strip()})
  letters = [{'letter': m.group(1), 'text': re.sub(r'\s+', ' ', m.group(2)).strip()} for m in re.finditer(r'(?ms)^([a-z])\.\s*(.*?)(?=^[a-z]\.\s|\Z)', raw_text)]
  structured.append({**article, 'id': article_id, 'text': text, 'paragraphs': paragraphs, 'letters': letters,
   'enrichment': enrich(text), 'legal_status': 'not_consolidated' if meta['version_kind'] != 'original' else 'original_snapshot_status_unverified',
   'target_regulation_id': meta.get('amends', [None])[0] if meta.get('amends') else None,
   'source': {'url': actual_url, 'raw_file': f'raw/{raw_filename}', 'sha256': extracted['sha256'], 'pages': article['pages']}})
 expected = meta.get('expected_articles')
 numeric = [a['number'] for a in structured if a['number'].isdigit()]
 missing = [str(n) for n in range(1, (expected or 0)+1) if str(n) not in numeric]
 return {'schema_version': '1.0', 'id': meta['id'], 'version_id': version_id,
  'metadata': {**meta, 'hierarchy_rank': HIERARCHY.get(meta['type']), 'jurisdiction': 'Indonesia', 'language': 'id',
   'dates_method': 'curated_from_source', 'status_as_of': None,
   'status_note': 'Original text snapshot, not the consolidated law in force. Amendments and court rulings are not fully verified.'},
  'provenance': {'source_url': actual_url, 'source_page': meta['source_page'], 'retrieved_at': retrieved_at,
   'sha256': extracted['sha256'], 'raw_file': f'raw/{raw_filename}', 'extracted_file': f"extracted/{meta['id']}.json"},
  'quality': {**extracted['quality'], 'article_count': len(structured), 'expected_articles': expected,
   'missing_article_numbers': missing, 'body_complete_by_number': bool(expected) and not missing,
   'limitations': ['OCR has not been run on pages without text.', 'Enrichment berbasis aturan, belum divalidasi ahli.', 'Annexes/explanations are stored separately when available.']},
  'articles': structured}

def write_json(path: Path, obj: object) -> None:
 path.parent.mkdir(parents=True, exist_ok=True)
 path.write_text(json.dumps(obj, ensure_ascii=False, indent=2), encoding='utf-8')
