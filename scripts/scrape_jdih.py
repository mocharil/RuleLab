"""Automated JDIH Scraper + LLM Extractor (Vertex AI gemini-3.8-flash via gemini_sa.json).

Checks which regulations on JDIH (https://peraturan.go.id) and in the local JDIH intake queue
are not yet in RuleLab, downloads their official PDFs, extracts & structures metadata,
geography, and articles using Gemini 3.8 Flash, and automatically ingests them into
data/raw, data/extracted, data/enriched, data/sources.json, data/corpus.json, and SQLite.
"""
from __future__ import annotations

import argparse
import asyncio
import base64
import hashlib
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Literal

import fitz
from bs4 import BeautifulSoup
from pydantic import BaseModel, Field

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app import store
from app.config import settings
from app.models import RegType
from app.services import ai, collection
from app.services.ingestion import (
    HIERARCHY,
    TOPICS,
    clean_line,
    enrich as deterministic_enrich,
    extract_file,
    sha256,
    structure as deterministic_structure,
    write_json,
)

DATA = ROOT / 'data'
DEFAULT_SA_PATH = ROOT / 'gemini_sa.json'
DEFAULT_MODEL = 'gemini-3.8-flash'
JDIH_BASE = 'https://peraturan.go.id'
DEFAULT_CATEGORIES = ['perda', 'uu', 'pp', 'perpres', 'permen']

EXTENDED_HIERARCHY = {
    **HIERARCHY,
    'PERMEN': 5,
    'PER_LEMBAGA': 5,
    'PERDPRD_PROV': 6,
    'PERGUB': 6,
    'PERDPRD_KAB': 7,
    'PERBUP': 7,
    'PERWALI': 7,
    'PERDES': 8,
    'PERKADES': 8,
}

VALID_TOPICS = list(TOPICS.keys())
VALID_NORM_TYPES = ['obligation', 'prohibition', 'permission']


# ---------------------------------------------------------------------------
# Pydantic Schemas for Gemini 3.8 Flash Structured Output
# ---------------------------------------------------------------------------

class GeographySchema(BaseModel):
    province_id: str = Field(
        default='',
        description='Kode 2 digit provinsi BPS/BIG (misal "33" untuk Jawa Tengah, "" jika nasional).',
    )
    district: str = Field(
        default='',
        description='Nama resmi Kabupaten/Kota (misal "Kabupaten Rembang" atau "Kota Depok", "" jika provinsi/nasional).',
    )
    scope: Literal['national', 'province', 'district'] = Field(
        default='national',
        description='Cakupan keberlakuan: national, province, atau district.',
    )
    scope_provinces: list[str] = Field(
        default_factory=list,
        description='Daftar kode 2 digit provinsi yang menjadi cakupan keberlakuan.',
    )
    mentioned_provinces: list[str] = Field(
        default_factory=list,
        description='Daftar kode 2 digit provinsi yang disebutkan di dalam naskah.',
    )


class MetadataExtractionSchema(BaseModel):
    id: str = Field(
        description='Slug unik huruf kecil dengan tanda hubung, misal: uu-3-2026, pp-20-2026, perda-rembang-1-2026, perwali-depok-7-2025.'
    )
    type: RegType = Field(
        description='Jenis peraturan: UU, PP, PERPRES, PERDA_PROV, PERDA_KAB, PERMEN, PERPPU, PERGUB, PERBUP, PERWALI, PER_LEMBAGA, PERDES, PERKADES, PERDPRD_PROV, PERDPRD_KAB.'
    )
    number: str = Field(description='Nomor peraturan, misal "1" atau "5".')
    year: int = Field(description='Tahun peraturan (4 digit), misal 2026.')
    title: str = Field(
        description='Judul substansi peraturan (Title Case) setelah kata "TENTANG", tanpa mengulang "Peraturan ... Nomor ... Tahun ... Tentang".'
    )
    promulgated_on: str = Field(
        description='Tanggal penetapan/pengundangan dalam format YYYY-MM-DD (misal "2026-01-19").'
    )
    expected_articles: int = Field(
        ge=1,
        description='Jumlah total pasal dalam batang tubuh peraturan (angka pasal terakhir).',
    )
    version_kind: Literal['original', 'amendment', 'original_amended'] = Field(
        default='original',
        description='original jika peraturan baru, amendment jika peraturan perubahan.',
    )
    amends: list[str] = Field(
        default_factory=list,
        description='Daftar ID regulasi di korpus yang diubah oleh peraturan ini (kosong jika tidak ada).',
    )
    implements: list[str] = Field(
        default_factory=list,
        description='Daftar ID regulasi di korpus yang dilaksanakan oleh peraturan ini (kosong jika tidak ada).',
    )
    geography: GeographySchema


class ExtractedArticleItem(BaseModel):
    number: str = Field(description='Nomor pasal tanpa kata Pasal, misal "1", "2", "2A", "I", "II".')
    chapter: str = Field(default='', description='Judul BAB jika ada, misal "BAB I KETENTUAN UMUM".')
    section: str = Field(default='', description='Judul Bagian jika ada, misal "Bagian Kesatu Umum".')
    text: str = Field(description='Teks lengkap isi pasal beserta seluruh ayat dan huruf di dalamnya.')
    pages: list[int] = Field(default_factory=list, description='Nomor halaman PDF tempat pasal ini berada.')


class ArticleBatchExtractionSchema(BaseModel):
    articles: list[ExtractedArticleItem]


class ArticleEnrichmentItem(BaseModel):
    number: str = Field(description='Nomor pasal.')
    topics: list[str] = Field(
        default_factory=list,
        description='Topik yang relevan dari daftar: akses_layanan, disabilitas, partisipasi, pengaduan, informasi, pembentukan_regulasi, biaya, data_pribadi.',
    )
    norm_types: list[str] = Field(
        default_factory=list,
        description='Jenis norma dari daftar: obligation, prohibition, permission.',
    )
    actors: list[str] = Field(
        default_factory=list,
        description='Aktor hukum yang disebut dalam pasal (misal masyarakat, pemerintah, menteri, bupati, walikota, penyelenggara, penyandang disabilitas).',
    )
    exceptions_detected: bool = Field(
        default=False,
        description='True jika pasal memuat pengecualian atau kondisi bersyarat (kecuali, dalam hal, sepanjang).',
    )


class BatchEnrichmentSchema(BaseModel):
    enrichments: list[ArticleEnrichmentItem]


# ---------------------------------------------------------------------------
# Vertex AI Configuration & Multimodal Caller
# ---------------------------------------------------------------------------

def configure_llm(sa_path: Path = DEFAULT_SA_PATH, model: str = DEFAULT_MODEL, location: str = 'global'):
    """Force RuleLab AI service to use gemini_sa.json and gemini-3.8-flash on Vertex AI."""
    sa_resolved = sa_path.resolve()
    if not sa_resolved.exists():
        raise FileNotFoundError(f'File Service Account tidak ditemukan: {sa_resolved}')
    info = json.loads(sa_resolved.read_text(encoding='utf-8'))
    project_id = info.get('project_id', 'paper-ds-production')

    os.environ['AI_PROVIDER'] = 'vertex'
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = str(sa_resolved)
    os.environ['GOOGLE_CLOUD_PROJECT'] = project_id
    os.environ['GOOGLE_CLOUD_LOCATION'] = location
    os.environ['GEMINI_MODEL'] = model

    settings.provider = 'vertex'
    settings.credentials_path = str(sa_resolved)
    settings.project = project_id
    settings.location = location
    settings.model = model
    ai.reset_auth_cache()
    return {'project': project_id, 'model': model, 'location': location, 'sa_path': str(sa_resolved)}


async def call_gemini_structured(
    prompt: str,
    schema: type[BaseModel],
    *,
    pdf_bytes: bytes | None = None,
    max_output_tokens: int = 16384,
) -> dict:
    """Call Vertex AI Gemini 3.8 Flash with optional PDF inlineData and strict responseSchema."""
    url, headers = await ai.endpoint(model=settings.model)
    parts = []
    if pdf_bytes:
        parts.append({
            'inlineData': {
                'mimeType': 'application/pdf',
                'data': base64.b64encode(pdf_bytes).decode('ascii'),
            }
        })
    parts.append({'text': prompt})

    payload = {
        'systemInstruction': {
            'parts': [{
                'text': (
                    'Anda adalah sistem ekstraksi hukum JDIH Indonesia yang presisi. '
                    'Ekstrak data faktual sesuai dokumen PDF dan metadata JDIH yang diberikan. '
                    'Kembalikan HANYA JSON valid yang mematuhi responseSchema.'
                )
            }]
        },
        'contents': [{'role': 'user', 'parts': parts}],
        'generationConfig': {
            'temperature': 0.1,
            'maxOutputTokens': max_output_tokens,
            'responseMimeType': 'application/json',
            'responseSchema': ai.vertex_schema(schema),
        },
    }
    response = await ai.post_json(url, headers, payload)
    candidate = response['candidates'][0]
    text = ''.join(p.get('text', '') for p in candidate['content']['parts'] if not p.get('thought'))
    parsed = schema.model_validate_json(text)
    return parsed.model_dump()


def slice_pdf_pages(raw_pdf: bytes, page_indices: list[int]) -> bytes:
    """Extract a subset of 0-based page indices into a compact PDF for multimodal LLM input."""
    with fitz.open(stream=raw_pdf, filetype='pdf') as src:
        total = len(src)
        valid = sorted({i for i in page_indices if 0 <= i < total})
        if not valid:
            return b''
        dst = fitz.open()
        for idx in valid:
            dst.insert_pdf(src, from_page=idx, to_page=idx)
        return dst.tobytes()


# ---------------------------------------------------------------------------
# JDIH Network Fetching & Discovery
# ---------------------------------------------------------------------------

def fetch_bytes(url: str, timeout: int = 60) -> tuple[bytes, str]:
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme != 'https' or not parsed.hostname or not parsed.hostname.endswith('.go.id'):
        raise ValueError(f'Hanya host resmi HTTPS .go.id yang diizinkan: {url}')
    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': 'RuleLabResearch/1.0 (Automated JDIH Legal Corpus Ingestion)',
            'Accept': 'text/html,application/xhtml+xml,application/pdf,*/*;q=0.8',
        },
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        final_url = resp.url
        final_parsed = urllib.parse.urlparse(final_url)
        if not final_parsed.hostname or not final_parsed.hostname.endswith('.go.id'):
            raise ValueError(f'Redirect keluar dari host .go.id: {final_url}')
        data = resp.read(25 * 1024 * 1024 + 1)
        if len(data) > 25 * 1024 * 1024:
            raise ValueError('Ukuran file melebihi batas 25MB')
        return data, final_url


def normalize_url(url: str) -> str:
    if not url:
        return ''
    p = urllib.parse.urlsplit(url.strip())
    return urllib.parse.urlunsplit((p.scheme.lower(), p.netloc.lower(), p.path.rstrip('/'), p.query, ''))


def load_existing_registry() -> dict:
    """Collect all existing regulation IDs, URLs, raw files, SHA256 hashes, and identities."""
    sources_path = DATA / 'sources.json'
    sources = json.loads(sources_path.read_text(encoding='utf-8')) if sources_path.exists() else []

    ids = set()
    urls = set()
    raw_files = set()
    sha256_set = set()
    identities = set()

    for s in sources:
        ids.add(s['id'])
        if s.get('source_page'):
            urls.add(normalize_url(s['source_page']))
        for u in s.get('urls', []):
            urls.add(normalize_url(u))
            raw_files.add(urllib.parse.unquote(urllib.parse.urlparse(u).path.rsplit('/', 1)[-1]))
        g = s.get('geography', {})
        identities.add((
            str(s.get('type', '')).upper(),
            str(s.get('number', '')).strip(),
            int(s.get('year', 0) or 0),
            str(g.get('province_id', '')).strip(),
            str(g.get('district', '')).strip().lower(),
        ))

    for enriched_file in (DATA / 'enriched').glob('*.json'):
        try:
            doc = json.loads(enriched_file.read_text(encoding='utf-8'))
            ids.add(doc['id'])
            prov = doc.get('provenance', {})
            if prov.get('source_page'):
                urls.add(normalize_url(prov['source_page']))
            if prov.get('source_url'):
                urls.add(normalize_url(prov['source_url']))
            if prov.get('sha256'):
                sha256_set.add(prov['sha256'])
            if prov.get('raw_file'):
                raw_files.add(Path(prov['raw_file']).name)
            m = doc.get('metadata', {})
            g = m.get('geography', {})
            identities.add((
                str(m.get('type', '')).upper(),
                str(m.get('number', '')).strip(),
                int(m.get('year', 0) or 0),
                str(g.get('province_id', '')).strip(),
                str(g.get('district', '')).strip().lower(),
            ))
        except Exception:
            pass

    return {
        'sources': sources,
        'ids': ids,
        'urls': urls,
        'raw_files': raw_files,
        'sha256': sha256_set,
        'identities': identities,
    }


def get_pending_intake_urls() -> list[dict]:
    """Read any pending JDIH links queued in SQLite source_intake."""
    store.initialize()
    collection.initialize()
    pending = []
    with store.db() as conn:
        rows = conn.execute('SELECT id, payload FROM source_intake ORDER BY created_at ASC').fetchall()
    for row in rows:
        item = json.loads(row['payload'])
        if item.get('channel') == 'jdih' and item.get('status') == 'link_pending' and item.get('source_url'):
            pending.append(item)
    return pending


def discover_jdih_urls(
    categories: list[str],
    pages_per_category: int = 1,
    start_page: int = 1,
    search_query: str = '',
    extra_urls: list[str] | None = None,
) -> list[str]:
    """Scrape regulation detail URLs from https://peraturan.go.id."""
    discovered = []
    seen = set()

    def add_url(u: str):
        norm = normalize_url(u)
        if norm and norm not in seen:
            seen.add(norm)
            discovered.append(norm)

    for u in (extra_urls or []):
        if u.startswith('/'):
            u = JDIH_BASE + u
        add_url(u)

    end_page = max(start_page, start_page + pages_per_category - 1)

    if search_query:
        for page in range(start_page, end_page + 1):
            q = urllib.parse.quote_plus(search_query)
            list_url = f'{JDIH_BASE}/cariglobal?PeraturanSearch%5Bidglobal%5D={q}&page={page}'
            try:
                html_bytes, _ = fetch_bytes(list_url)
                soup = BeautifulSoup(html_bytes.decode('utf-8', errors='ignore'), 'html.parser')
                for a in soup.find_all('a', href=True):
                    href = a['href'].strip()
                    if href.startswith('/id/') and href != '/id/#':
                        add_url(JDIH_BASE + href)
                time.sleep(0.5)
            except Exception as exc:
                print(f'  [WARN] Gagal membuka pencarian JDIH {list_url}: {exc}')

    for cat in categories:
        cat_clean = cat.strip().lstrip('/')
        if not cat_clean:
            continue
        for page in range(start_page, end_page + 1):
            list_url = f'{JDIH_BASE}/{cat_clean}' if page == 1 else f'{JDIH_BASE}/{cat_clean}?page={page}'
            try:
                html_bytes, _ = fetch_bytes(list_url)
                soup = BeautifulSoup(html_bytes.decode('utf-8', errors='ignore'), 'html.parser')
                count_before = len(discovered)
                for a in soup.find_all('a', href=True):
                    href = a['href'].strip()
                    if href.startswith('/id/') and href != '/id/#':
                        add_url(JDIH_BASE + href)
                print(f'  [JDIH /{cat_clean} hal {page}] Ditemukan {len(discovered) - count_before} tautan peraturan.')
                time.sleep(0.5)
            except Exception as exc:
                print(f'  [WARN] Gagal membuka halaman kategori {list_url}: {exc}')

    return discovered


def parse_jdih_detail_page(html_bytes: bytes, page_url: str) -> dict:
    """Extract metadata table, relationships, and PDF links from a peraturan.go.id detail page."""
    soup = BeautifulSoup(html_bytes.decode('utf-8', errors='ignore'), 'html.parser')
    h1 = soup.find('h1')
    heading = h1.get_text(' ', strip=True) if h1 else ''

    table_meta = {}
    for tr in soup.find_all('tr'):
        th = tr.find('th')
        td = tr.find('td')
        if th and td:
            key = th.get_text(' ', strip=True)
            val = td.get_text(' ', strip=True)
            if key:
                table_meta[key] = val

    pdf_urls = []
    for a in soup.find_all('a', href=True):
        href = a['href'].strip()
        if '.pdf' in href.lower():
            full_pdf = urllib.parse.urljoin(page_url, href)
            if full_pdf not in pdf_urls:
                pdf_urls.append(full_pdf)

    relations = {}
    reviews_section = soup.find('section', id='reviews')
    if reviews_section:
        relations_text = reviews_section.get_text('\n', strip=True)
        relations['raw_relations'] = relations_text[:2000]
        linked_slugs = [
            a['href'].strip()
            for a in reviews_section.find_all('a', href=True)
            if a['href'].strip().startswith('/id/')
        ]
        relations['linked_slugs'] = linked_slugs

    return {
        'page_url': page_url,
        'heading': heading,
        'table': table_meta,
        'pdf_urls': pdf_urls,
        'relations': relations,
    }


# ---------------------------------------------------------------------------
# LLM Extraction & Structuring Pipeline
# ---------------------------------------------------------------------------

def build_province_reference() -> str:
    provs = collection.provinces()
    return ', '.join(f'{p["id"]}={p["name"]}' for p in provs)


async def extract_regulation_with_llm(
    detail: dict,
    raw_pdf: bytes,
    raw_filename: str,
    pdf_url: str,
    extracted_pages: dict,
    existing_ids: set[str],
) -> tuple[dict, dict]:
    """Use Gemini 3.8 Flash to extract metadata, geography, and articles from the PDF + JDIH page."""
    total_pages = extracted_pages['page_count']
    all_page_texts = [p['text'] for p in extracted_pages['pages']]
    full_text = '\n'.join(all_page_texts)

    # Find highest Pasal number mentioned as heading for hint
    pasal_headings = re.findall(r'(?m)^\s*Pasal[ \t]+(\d+[A-Z]?|I|II)[ \t]*$', full_text)
    numeric_pasals = [int(x) for x in pasal_headings if x.isdigit()]
    max_pasal_hint = max(numeric_pasals) if numeric_pasals else max(len(pasal_headings), 1)

    # Slice first 4 pages and last 2 pages of PDF for multimodal inspection
    sample_indices = list(range(min(4, total_pages))) + list(range(max(0, total_pages - 2), total_pages))
    sample_pdf_bytes = slice_pdf_pages(raw_pdf, sample_indices)

    province_ref = build_province_reference()
    existing_corpus_sample = sorted(existing_ids)[:60]

    meta_prompt = f"""Analisis dokumen peraturan resmi dan metadata JDIH berikut, lalu ekstrak metadata terstruktur sesuai schema.

DAFTAR KODE PROVINSI RESMI (gunakan HANYA kode 2 digit dari daftar ini untuk province_id, scope_provinces, mentioned_provinces):
{province_ref}

DAFTAR ID REGULASI YANG SUDAH ADA DI KORPUS (untuk pengisian amends / implements bila peraturan ini mengubah atau melaksanakan regulasi tersebut):
{json.dumps(existing_corpus_sample, ensure_ascii=False)}

ATURAN PENTING:
1. Periksa sampul/kepala naskah PDF untuk menentukan `type` yang sebenarnya:
   - Jika naskah adalah PERATURAN BUPATI -> `PERBUP`
   - Jika naskah adalah PERATURAN WALI KOTA / WALIKOTA -> `PERWALI`
   - Jika naskah adalah PERATURAN GUBERNUR -> `PERGUB`
   - Jika naskah adalah PERATURAN DAERAH PROVINSI -> `PERDA_PROV`
   - Jika naskah adalah PERATURAN DAERAH KABUPATEN/KOTA -> `PERDA_KAB`
   - Jika naskah adalah PERATURAN MENTERI -> `PERMEN`
   - Jika naskah adalah PERATURAN BADAN/LEMBAGA -> `PER_LEMBAGA`
   - Jika naskah adalah UNDANG-UNDANG -> `UU`, PERATURAN PEMERINTAH -> `PP`, PERATURAN PRESIDEN -> `PERPRES`, PERPPU -> `PERPPU`.
2. Format `id`:
   - Gunakan format ringkas huruf kecil: `<jenis>-<daerah/kementerian>-<nomor>-<tahun>` atau `<jenis>-<nomor>-<tahun>` untuk UU/PP/PERPRES.
   - Contoh: `uu-3-2026`, `pp-20-2026`, `perpres-12-2026`, `perda-rembang-1-2026`, `perbup-rembang-1-2026`, `perwali-depok-7-2025`.
3. `title`:
   - Tuliskan judul substansi setelah kata "TENTANG" dalam Title Case bahasa Indonesia yang rapi (tanpa menulis ulang "Peraturan Daerah ... Nomor ... Tahun ... Tentang").
4. `geography`:
   - Untuk regulasi nasional (UU, PP, PERPRES, PERMEN, PERPPU, PER_LEMBAGA): `province_id` = `""`, `district` = `""`, `scope` = `"national"`, `scope_provinces` = `[]`.
   - Untuk regulasi provinsi (PERDA_PROV, PERGUB): isi `province_id` (2 digit), `district` = `""`, `scope` = `"province"`, `scope_provinces` = `[province_id]`.
   - Untuk regulasi kabupaten/kota (PERDA_KAB, PERBUP, PERWALI): isi `province_id` (2 digit provinsi induknya!), `district` = `"Kabupaten ..."` atau `"Kota ..."`, `scope` = `"district"`, `scope_provinces` = `[province_id]`.
5. `expected_articles`:
   - Isi dengan jumlah total pasal dalam batang tubuh (petunjuk deteksi awal teks: sekitar {max_pasal_hint} pasal).

DATA HALAMAN JDIH:
{json.dumps(detail, ensure_ascii=False, indent=2)}

CUPLIKAN TEKS AWAL DAN AKHIR PDF:
--- AWAL DOKUMEN ---
{full_text[:6000]}
--- AKHIR DOKUMEN ---
{full_text[-4000:]}
"""

    llm_meta = await call_gemini_structured(
        meta_prompt,
        MetadataExtractionSchema,
        pdf_bytes=sample_pdf_bytes if len(sample_pdf_bytes) < 8 * 1024 * 1024 else None,
    )

    # Normalize & validate LLM metadata
    reg_id = re.sub(r'[^a-z0-9-]+', '-', llm_meta['id'].lower()).strip('-')
    if not reg_id:
        reg_id = f"{llm_meta['type'].lower().replace('_', '-')}-{llm_meta['number']}-{llm_meta['year']}"

    known_provs = {p['id'] for p in collection.provinces()}
    geo = llm_meta['geography']
    prov_id = geo['province_id'] if geo['province_id'] in known_provs else ''
    scope_provs = [p for p in geo['scope_provinces'] if p in known_provs]
    mentioned_provs = [p for p in geo['mentioned_provinces'] if p in known_provs]
    if prov_id and prov_id not in scope_provs and geo['scope'] in ('province', 'district'):
        scope_provs.append(prov_id)
    if prov_id and prov_id not in mentioned_provs:
        mentioned_provs.append(prov_id)

    num_val: int | str = int(llm_meta['number']) if str(llm_meta['number']).isdigit() else str(llm_meta['number'])

    source_meta = {
        'id': reg_id,
        'type': llm_meta['type'],
        'number': num_val,
        'year': int(llm_meta['year']),
        'title': llm_meta['title'].strip(),
        'promulgated_on': llm_meta['promulgated_on'],
        'expected_articles': int(llm_meta['expected_articles']),
        'source_page': detail['page_url'],
        'urls': [pdf_url],
        'amends': [x for x in llm_meta['amends'] if x in existing_ids],
        'version_kind': llm_meta['version_kind'],
    }
    if llm_meta.get('implements'):
        valid_impl = [x for x in llm_meta['implements'] if x in existing_ids]
        if valid_impl:
            source_meta['implements'] = valid_impl
    if len(detail.get('pdf_urls', [])) > 1:
        source_meta['attachments'] = detail['pdf_urls'][1:]
    if prov_id or geo.get('district') or scope_provs or mentioned_provs:
        source_meta['geography'] = {
            'province_id': prov_id,
            'district': geo.get('district', '').strip(),
            'scope': geo.get('scope', 'district' if geo.get('district') else 'province' if prov_id else 'national'),
            'scope_provinces': scope_provs,
            'mentioned_provinces': mentioned_provs,
        }

    # Try deterministic article extraction first
    now_iso = datetime.now(timezone.utc).isoformat()
    doc = deterministic_structure(source_meta, extracted_pages, now_iso, raw_filename, pdf_url)
    doc['metadata']['hierarchy_rank'] = EXTENDED_HIERARCHY.get(source_meta['type'], 7)
    doc['metadata']['dates_method'] = 'llm_extracted_gemini_3_8_flash'

    # If deterministic regex found 0 articles or missed many articles (e.g. scanned PDF or non-standard Pasal layout),
    # use Gemini 3.8 Flash multimodal PDF extraction to extract the articles directly!
    expected_count = source_meta.get('expected_articles') or 1
    if len(doc['articles']) == 0 or (len(doc['articles']) < expected_count * 0.5 and total_pages <= 80):
        print(f'    [LLM OCR/Pasal] Ekstraksi deterministik menghasilkan {len(doc["articles"])}/{expected_count} pasal; menjalankan ekstraksi Pasal penuh via {settings.model}...')
        llm_articles = await extract_articles_via_llm(raw_pdf, extracted_pages)
        if llm_articles:
            doc = build_structured_doc_from_llm_articles(
                source_meta,
                extracted_pages,
                llm_articles,
                now_iso,
                raw_filename,
                pdf_url,
            )

    # Update expected_articles if actual extracted articles are complete and consistent
    if doc['articles']:
        numeric = [int(a['number']) for a in doc['articles'] if a['number'].isdigit()]
        if numeric and len(numeric) == max(numeric):
            expected_actual = max(numeric)
            source_meta['expected_articles'] = expected_actual
            doc['metadata']['expected_articles'] = expected_actual
            doc['quality']['expected_articles'] = expected_actual
            doc['quality']['missing_article_numbers'] = []
            doc['quality']['body_complete_by_number'] = True

        # Enrich articles with Gemini 3.8 Flash in batches
        await enrich_articles_via_llm(doc['articles'], source_meta['title'])

    return source_meta, doc


async def extract_articles_via_llm(raw_pdf: bytes, extracted_pages: dict) -> list[dict]:
    """Extract Pasal articles directly from PDF batches using Gemini 3.8 Flash multimodal input."""
    total_pages = extracted_pages['page_count']
    batch_size = 10
    collected: dict[str, dict] = {}

    for start_idx in range(0, total_pages, batch_size):
        indices = list(range(start_idx, min(start_idx + batch_size, total_pages)))
        batch_pdf = slice_pdf_pages(raw_pdf, indices)
        page_text_hint = '\n'.join(
            f"--- HALAMAN {p['page']} ---\n{p['text']}"
            for p in extracted_pages['pages'][start_idx : start_idx + batch_size]
        )
        prompt = f"""Ekstrak seluruh Pasal dari halaman {indices[0] + 1} sampai {indices[-1] + 1} pada dokumen PDF peraturan ini.
Nomor halaman asli adalah {indices[0] + 1} s.d. {indices[-1] + 1}.
Jangan menyertakan bagian Penjelasan di akhir dokumen sebagai Pasal baru.
Jangan menyertakan watermark seperti www.peraturan.go.id.

TEKS PENDAMPING HALAMAN:
{page_text_hint[:15000]}
"""
        try:
            result = await call_gemini_structured(
                prompt,
                ArticleBatchExtractionSchema,
                pdf_bytes=batch_pdf if len(batch_pdf) < 9 * 1024 * 1024 else None,
                max_output_tokens=16384,
            )
            for item in result.get('articles', []):
                num = str(item['number']).strip()
                num = re.sub(r'^Pasal\s+', '', num, flags=re.IGNORECASE).strip()
                if not num or not item.get('text', '').strip():
                    continue
                if num not in collected:
                    collected[num] = {
                        'number': num,
                        'chapter': item.get('chapter') or None,
                        'section': item.get('section') or None,
                        'text': re.sub(r'\s+', ' ', item['text']).strip(),
                        'pages': [p for p in item.get('pages', []) if isinstance(p, int) and 1 <= p <= total_pages] or [indices[0] + 1],
                    }
        except Exception as exc:
            print(f'    [WARN] Gagal ekstraksi batch halaman {indices[0]+1}-{indices[-1]+1}: {exc}')

    return list(collected.values())


def build_structured_doc_from_llm_articles(
    meta: dict,
    extracted: dict,
    llm_articles: list[dict],
    retrieved_at: str,
    raw_filename: str,
    actual_url: str,
) -> dict:
    """Build a RuleLab-compliant enriched document from LLM-extracted articles."""
    version_id = meta['id'] + '@' + extracted['sha256'][:12]
    structured = []
    for item in llm_articles:
        raw_text = item['text'].replace('www.peraturan.go.id', '').strip()
        if not raw_text:
            continue
        article_id = f"{version_id}/pasal/{item['number']}"
        paragraphs = []
        matches = list(re.finditer(r'\((\d+[a-z]?)\)\s*([^(]+)', raw_text))
        for m in matches:
            paragraphs.append({
                'number': m.group(1),
                'kind': 'definition_or_ayat' if item['number'] == '1' else 'ayat',
                'text': f"({m.group(1)}) {re.sub(r'\\s+', ' ', m.group(2)).strip()}",
            })
        structured.append({
            'number': item['number'],
            'chapter': item.get('chapter'),
            'section': item.get('section'),
            'pages': item.get('pages', [1]),
            'id': article_id,
            'text': raw_text,
            'paragraphs': paragraphs,
            'letters': [],
            'enrichment': deterministic_enrich(raw_text),
            'legal_status': 'not_consolidated' if meta['version_kind'] != 'original' else 'original_snapshot_status_unverified',
            'target_regulation_id': meta.get('amends', [None])[0] if meta.get('amends') else None,
            'source': {
                'url': actual_url,
                'raw_file': f'raw/{raw_filename}',
                'sha256': extracted['sha256'],
                'pages': item.get('pages', [1]),
            },
        })

    expected = meta.get('expected_articles') or len(structured)
    numeric = [a['number'] for a in structured if a['number'].isdigit()]
    missing = [str(n) for n in range(1, expected + 1) if str(n) not in numeric]
    return {
        'schema_version': '1.0',
        'id': meta['id'],
        'version_id': version_id,
        'metadata': {
            **meta,
            'hierarchy_rank': EXTENDED_HIERARCHY.get(meta['type'], 7),
            'jurisdiction': 'Indonesia',
            'language': 'id',
            'dates_method': 'llm_extracted_gemini_3_8_flash',
            'status_as_of': None,
            'status_note': 'Snapshot naskah asli diekstrak dengan bantuan Gemini 3.8 Flash, bukan konsolidasi hukum berlaku.',
        },
        'provenance': {
            'source_url': actual_url,
            'source_page': meta['source_page'],
            'retrieved_at': retrieved_at,
            'sha256': extracted['sha256'],
            'raw_file': f'raw/{raw_filename}',
            'extracted_file': f"extracted/{meta['id']}.json",
        },
        'quality': {
            **extracted['quality'],
            'article_count': len(structured),
            'expected_articles': expected,
            'missing_article_numbers': missing,
            'body_complete_by_number': bool(expected) and not missing,
            'limitations': [
                'Ekstraksi dan pengayaan dibantu oleh LLM gemini-3.8-flash.',
                'Lampiran/penjelasan disimpan terpisah bila tersedia.',
            ],
        },
        'articles': structured,
    }


async def enrich_articles_via_llm(articles: list[dict], reg_title: str):
    """Use Gemini 3.8 Flash to enrich article topics, norm_types, actors, and exceptions."""
    batch_size = 25
    for i in range(0, len(articles), batch_size):
        batch = articles[i : i + batch_size]
        compact_input = [
            {'number': a['number'], 'text': a['text'][:1200]}
            for a in batch
        ]
        prompt = f"""Klasifikasikan setiap pasal berikut dari peraturan "{reg_title}".
Pilih `topics` HANYA dari: {VALID_TOPICS}
Pilih `norm_types` HANYA dari: {VALID_NORM_TYPES}
Identifikasi `actors` (misal masyarakat, pemerintah, pemerintah daerah, menteri, bupati, walikota, penyelenggara, pelaksana, penyandang disabilitas).
Tentukan `exceptions_detected` (true jika ada pengecualian/syarat khusus).

DAFTAR PASAL:
{json.dumps(compact_input, ensure_ascii=False)}
"""
        try:
            res = await call_gemini_structured(prompt, BatchEnrichmentSchema, max_output_tokens=8192)
            by_num = {item['number']: item for item in res.get('enrichments', [])}
            for a in batch:
                base_enr = a.get('enrichment') or deterministic_enrich(a['text'])
                llm_enr = by_num.get(a['number'])
                if llm_enr:
                    merged_topics = list(dict.fromkeys(
                        base_enr.get('topics', []) + [t for t in llm_enr.get('topics', []) if t in VALID_TOPICS]
                    ))
                    merged_norms = list(dict.fromkeys(
                        base_enr.get('norm_types', []) + [n for n in llm_enr.get('norm_types', []) if n in VALID_NORM_TYPES]
                    ))
                    merged_actors = list(dict.fromkeys(
                        base_enr.get('actors', []) + [act.lower().strip() for act in llm_enr.get('actors', []) if act.strip()]
                    ))
                    a['enrichment'] = {
                        'method': 'gemini_3_8_flash+deterministic_v1',
                        'review_status': 'unreviewed',
                        'topics': merged_topics,
                        'norm_types': merged_norms,
                        'actors': merged_actors[:10],
                        'references': base_enr.get('references', []),
                        'extractive_preview': a['text'][:240],
                        'exceptions_detected': bool(base_enr.get('exceptions_detected') or llm_enr.get('exceptions_detected')),
                    }
        except Exception as exc:
            print(f'    [WARN] Pengayaan LLM batch pasal {i+1}-{i+len(batch)} dilewati (menggunakan aturan deterministik): {exc}')


# ---------------------------------------------------------------------------
# Persistence & Database Sync
# ---------------------------------------------------------------------------

def save_and_sync_corpus(new_sources: list[dict], new_docs: list[dict], processed_intake_ids: list[tuple[str, dict]]):
    """Persist sources.json, manifest.json, corpus.json, and sync into SQLite database."""
    sources_path = DATA / 'sources.json'
    existing_sources = json.loads(sources_path.read_text(encoding='utf-8')) if sources_path.exists() else []
    by_id = {s['id']: s for s in existing_sources}
    for s in new_sources:
        by_id[s['id']] = s
    write_json(sources_path, list(by_id.values()))

    # Rebuild corpus.json from all data/enriched/*.json
    corpus_docs = [
        json.loads(p.read_text(encoding='utf-8'))
        for p in sorted((DATA / 'enriched').glob('*.json'))
    ]
    write_json(DATA / 'corpus.json', {'schema_version': '1.0', 'documents': corpus_docs})

    # Update manifest.json
    manifest_path = DATA / 'manifest.json'
    manifest_docs = []
    for d in corpus_docs:
        manifest_docs.append({
            'id': d['id'],
            'status': 'ok',
            'source_url': d['provenance']['source_url'],
            'raw_file': Path(d['provenance']['raw_file']).name,
            'sha256': d['provenance']['sha256'],
            'article_count': len(d['articles']),
            'quality': d['quality'],
            'retrieved_at': d['provenance']['retrieved_at'],
            'cache_used': True,
            'attachments': [],
            'attempt_errors': [],
        })
    write_json(
        manifest_path,
        {'generated_at': datetime.now(timezone.utc).isoformat(), 'documents': manifest_docs},
    )

    # Sync SQLite database (regulations, articles, FTS5 article_search, corpus_sha)
    store.initialize()

    # Mark any processed JDIH intake items in source_intake as ingested
    if processed_intake_ids:
        with store.db() as conn:
            for intake_id, doc in processed_intake_ids:
                row = conn.execute('SELECT payload FROM source_intake WHERE id=?', (intake_id,)).fetchone()
                if row:
                    item = json.loads(row['payload'])
                    full_preview = '\n\n'.join(f"Pasal {a['number']}\n{a['text']}" for a in doc['articles'][:5])[:3500]
                    item.update({
                        'status': 'ingested',
                        'sha256': doc['provenance']['sha256'],
                        'article_count': len(doc['articles']),
                        'preview': full_preview,
                        'text_available': True,
                        'corpus_id': doc['id'],
                    })
                    conn.execute(
                        'UPDATE source_intake SET payload=? WHERE id=?',
                        (json.dumps(item, ensure_ascii=False), intake_id),
                    )


# ---------------------------------------------------------------------------
# Main Runner
# ---------------------------------------------------------------------------

async def run_pipeline(
    *,
    categories: list[str],
    pages: int = 1,
    start_page: int = 1,
    limit: int = 5,
    query: str = '',
    urls: list[str] | None = None,
    sa_path: Path = DEFAULT_SA_PATH,
    model: str = DEFAULT_MODEL,
    dry_run: bool = False,
) -> dict:
    llm_cfg = configure_llm(sa_path=sa_path, model=model)
    print('=' * 72)
    print('RuleLab JDIH Scraper & LLM Extractor')
    print(f"  Provider : Vertex AI ({llm_cfg['project']} / {llm_cfg['location']})")
    print(f"  Model    : {llm_cfg['model']}")
    print(f"  SA Key   : {llm_cfg['sa_path']}")
    print('=' * 72)

    registry = load_existing_registry()
    print(f"[INFO] Korpus saat ini memiliki {len(registry['ids'])} regulasi terdaftar.")

    # 1. Check pending JDIH links from UI queue (source_intake)
    pending_intake = get_pending_intake_urls()
    intake_by_url = {normalize_url(item['source_url']): item for item in pending_intake}
    if pending_intake:
        print(f'[INFO] Ditemukan {len(pending_intake)} tautan JDIH pada antrean UI (source_intake).')

    # 2. Discover regulation URLs from JDIH
    candidate_urls = [normalize_url(item['source_url']) for item in pending_intake]
    scraped_urls = discover_jdih_urls(
        categories=categories,
        pages_per_category=pages,
        start_page=start_page,
        search_query=query,
        extra_urls=urls,
    )
    for u in scraped_urls:
        if u not in candidate_urls:
            candidate_urls.append(u)

    # 3. Check which regulations are already in RuleLab vs missing
    missing_urls = []
    skipped_urls = []
    for u in candidate_urls:
        if u in registry['urls']:
            skipped_urls.append(u)
            print(f'  [SUDAH ADA] {u}')
        else:
            missing_urls.append(u)
            print(f'  [BELUM ADA] {u}')

    print('-' * 72)
    print(f'Total diperiksa: {len(candidate_urls)} | Sudah ada: {len(skipped_urls)} | Belum ada: {len(missing_urls)}')
    if dry_run:
        print('[DRY-RUN] Selesai memeriksa tanpa mengunduh.')
        return {'checked': len(candidate_urls), 'skipped': len(skipped_urls), 'missing': len(missing_urls), 'ingested': []}

    if not missing_urls:
        print('[INFO] Semua peraturan yang ditemukan sudah ada di dalam database RuleLab.')
        return {'checked': len(candidate_urls), 'skipped': len(skipped_urls), 'missing': 0, 'ingested': []}

    target_count = len(missing_urls) if limit <= 0 else min(limit, len(missing_urls))
    print(f'[PROSES] Mengunduh & mengekstrak hingga {target_count} peraturan baru menggunakan {model}...')
    print('[INFO] Setiap peraturan yang selesai langsung otomatis disimpan ke database (aman dihentikan kapan saja dengan Ctrl+C).')
    print('-' * 72)

    new_sources = []
    new_docs = []
    failures = []

    try:
        for idx, url in enumerate(missing_urls, 1):
            if limit > 0 and len(new_docs) >= limit:
                break
            print(f'\n[{len(new_docs) + 1}/{target_count}] Memproses (kandidat #{idx}): {url}')
            try:
                time.sleep(1)
                body, final_url = fetch_bytes(url)

                # Determine if URL is a direct PDF or a JDIH detail HTML page
                if b'%PDF' in body[:1024] or final_url.lower().endswith('.pdf'):
                    pdf_url = final_url
                    raw_pdf = body
                    detail = {
                        'page_url': url,
                        'heading': Path(urllib.parse.urlparse(final_url).path).stem,
                        'table': {},
                        'pdf_urls': [final_url],
                        'relations': {},
                    }
                else:
                    detail = parse_jdih_detail_page(body, final_url)
                    if not detail['pdf_urls']:
                        raise ValueError('Halaman JDIH tidak memiliki tautan file PDF peraturan.')
                    pdf_url = detail['pdf_urls'][0]
                    if normalize_url(pdf_url) in registry['urls']:
                        print(f'  -> [SKIP] File PDF sudah ada di korpus: {pdf_url}')
                        continue
                    print(f'  -> Mengunduh PDF: {pdf_url}')
                    time.sleep(1)
                    raw_pdf, pdf_url = fetch_bytes(pdf_url)
                    if b'%PDF' not in raw_pdf[:1024]:
                        raise ValueError('File yang diunduh bukan PDF valid.')

                pdf_offset = raw_pdf.find(b'%PDF')
                if 0 < pdf_offset < 1024:
                    raw_pdf = raw_pdf[pdf_offset:]

                file_hash = sha256(raw_pdf)
                if file_hash in registry['sha256']:
                    print(f'  -> [SKIP] PDF dengan SHA256 {file_hash[:12]} sudah ada di korpus.')
                    continue

                raw_filename = urllib.parse.unquote(urllib.parse.urlparse(pdf_url).path.rsplit('/', 1)[-1])
                raw_filename = re.sub(r'[<>:"/\\|?*]+', '_', raw_filename)
                if not raw_filename.lower().endswith('.pdf'):
                    raw_filename += '.pdf'

                raw_path = DATA / 'raw' / raw_filename
                raw_path.parent.mkdir(parents=True, exist_ok=True)
                existed_before = raw_path.exists()
                raw_path.write_bytes(raw_pdf)

                try:
                    extracted_pages = extract_file(raw_path)
                    print(f'  -> Diekstrak {extracted_pages["page_count"]} halaman PDF. Mengirim ke LLM ({model})...')

                    source_meta, structured_doc = await extract_regulation_with_llm(
                        detail=detail,
                        raw_pdf=raw_pdf,
                        raw_filename=raw_filename,
                        pdf_url=pdf_url,
                        extracted_pages=extracted_pages,
                        existing_ids=registry['ids'],
                    )

                    # Check identity deduplication
                    g = source_meta.get('geography', {})
                    identity = (
                        str(source_meta['type']).upper(),
                        str(source_meta['number']).strip(),
                        int(source_meta['year']),
                        str(g.get('province_id', '')).strip(),
                        str(g.get('district', '')).strip().lower(),
                    )
                    if identity in registry['identities'] or source_meta['id'] in registry['ids']:
                        print(f"  -> [SKIP] Regulasi {source_meta['id']} ({identity}) sudah terdaftar di korpus.")
                        if not existed_before and raw_path.exists():
                            raw_path.unlink(missing_ok=True)
                        continue

                    if not structured_doc['articles']:
                        raise ValueError('Tidak ada pasal yang berhasil diekstrak dari dokumen.')
                except Exception:
                    if not existed_before and raw_path.exists():
                        raw_path.unlink(missing_ok=True)
                    raise

                # Save extracted & enriched JSON files
                write_json(DATA / 'extracted' / f"{source_meta['id']}.json", extracted_pages)
                write_json(DATA / 'enriched' / f"{source_meta['id']}.json", structured_doc)

                # Register in memory so subsequent items in the same run know about it
                registry['ids'].add(source_meta['id'])
                registry['urls'].add(normalize_url(url))
                registry['urls'].add(normalize_url(pdf_url))
                registry['sha256'].add(file_hash)
                registry['identities'].add(identity)

                new_sources.append(source_meta)
                new_docs.append(structured_doc)
                single_intake = []
                if normalize_url(url) in intake_by_url:
                    single_intake.append((intake_by_url[normalize_url(url)]['id'], structured_doc))

                # Immediately persist and sync to SQLite so progress is never lost
                save_and_sync_corpus([source_meta], [structured_doc], single_intake)

                print(
                    f"  -> [SUKSES & TERSIMPAN] ID: {source_meta['id']} | Jenis: {source_meta['type']} No. {source_meta['number']}/{source_meta['year']} "
                    f"| Judul: {source_meta['title']} | Pasal: {len(structured_doc['articles'])}"
                )
            except Exception as exc:
                print(f'  -> [GAGAL] {url}: {type(exc).__name__}: {exc}')
                failures.append({'url': url, 'error': f'{type(exc).__name__}: {exc}'})
    except KeyboardInterrupt:
        print('\n\n[DIHENTIKAN PENGGUNA] Proses dihentikan dengan Ctrl+C. Semua peraturan yang sudah selesai tetap aman tersimpan di database!')

    print('=' * 72)
    print(f'[SELESAI] Total {len(new_docs)} peraturan baru berhasil masuk ke korpus dan database SQLite!')
    return {
        'checked': len(candidate_urls),
        'skipped': len(skipped_urls),
        'missing': len(missing_urls),
        'ingested': [d['id'] for d in new_docs],
        'failures': failures,
    }


def main():
    parser = argparse.ArgumentParser(
        description='Scrape peraturan dari JDIH (peraturan.go.id), cek yang belum ada, unduh & ekstrak dengan LLM gemini-3.8-flash.'
    )
    parser.add_argument(
        '--categories',
        nargs='*',
        default=DEFAULT_CATEGORIES,
        help='Kategori JDIH yang akan di-scrape (default: perda uu pp perpres permen; bisa ditambah perppu perban).',
    )
    parser.add_argument(
        '--pages',
        type=int,
        default=1,
        help='Jumlah halaman per kategori yang diperiksa (default: 1).',
    )
    parser.add_argument(
        '--start-page',
        type=int,
        default=1,
        help='Halaman awal pada tiap kategori (default: 1).',
    )
    parser.add_argument(
        '--limit',
        type=int,
        default=3,
        help='Batas maksimal peraturan baru yang diunduh & diekstrak per eksekusi (default: 3, gunakan 0 untuk semua tanpa batas).',
    )
    parser.add_argument(
        '--query',
        default='',
        help='Kata kunci pencarian global pada JDIH (opsional).',
    )
    parser.add_argument(
        '--url',
        nargs='*',
        default=[],
        help='Satu atau beberapa URL halaman/PDF JDIH spesifik untuk langsung diproses.',
    )
    parser.add_argument(
        '--sa',
        default=str(DEFAULT_SA_PATH),
        help='Path ke file JSON Service Account Google Cloud (default: gemini_sa.json).',
    )
    parser.add_argument(
        '--model',
        default=DEFAULT_MODEL,
        help='Nama model Gemini di Vertex AI (default: gemini-3.8-flash).',
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Hanya cek peraturan mana yang sudah ada dan belum ada tanpa mengunduh/ekstrak.',
    )
    args = parser.parse_args()
    try:
        result = asyncio.run(
            run_pipeline(
                categories=args.categories,
                pages=args.pages,
                start_page=args.start_page,
                limit=args.limit,
                query=args.query,
                urls=args.url,
                sa_path=Path(args.sa),
                model=args.model,
                dry_run=args.dry_run,
            )
        )
        return 0 if not result.get('failures') or result.get('ingested') else 1
    except KeyboardInterrupt:
        print('\n[DIHENTIKAN] Proses dihentikan oleh pengguna.')
        return 0


if __name__ == '__main__':
    raise SystemExit(main())
