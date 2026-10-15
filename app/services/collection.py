"""Collection inventory and private source intake, independent from user drafts."""
from __future__ import annotations

import base64
import hashlib
import io
import json
import re
import uuid
import zipfile
from functools import lru_cache
from pathlib import Path
from typing import Literal
from urllib.parse import urlsplit

import fitz
from docx import Document
from pydantic import BaseModel, Field, model_validator

from app import store
from app.config import ROOT
from app.models import RegType

NATIONAL = {'UU', 'PERPPU', 'PP', 'PERPRES', 'PERMEN', 'PER_LEMBAGA'}
GEO_FILE = ROOT / 'app/static/geo/indonesia-provinces.geojson'


@lru_cache(maxsize=1)
def provinces():
    data = json.loads(GEO_FILE.read_text())
    return sorted([f['properties'] for f in data['features']], key=lambda p: p['name'])


def initialize():
    with store.db() as connection:
        connection.execute('''CREATE TABLE IF NOT EXISTS source_intake(
            id TEXT PRIMARY KEY, payload TEXT NOT NULL, content TEXT NOT NULL,
            fingerprint TEXT UNIQUE NOT NULL, created_at TEXT NOT NULL)''')


class IntakeRequest(BaseModel):
    channel: Literal['upload', 'jdih']
    title: str = Field(min_length=3, max_length=300)
    regulation_type: RegType
    number: str = Field(min_length=1, max_length=40)
    year: int = Field(ge=1945, le=2100)
    province_id: str = Field(default='', max_length=2)
    district: str = Field(default='', max_length=100)
    scope: Literal['national', 'province', 'district', 'unknown'] = 'unknown'
    source_url: str = Field(default='', max_length=2000)
    filename: str = Field(default='', max_length=200)
    content_base64: str = Field(default='', max_length=14000000)

    @model_validator(mode='after')
    def validate_identity(self):
        if self.province_id and self.province_id not in {p['id'] for p in provinces()}:
            raise ValueError('Province not recognized.')
        if self.regulation_type not in NATIONAL and not self.province_id:
            raise ValueError('Choose the issuing province for a regional/village source.')
        if self.scope in {'province', 'district'} and not self.province_id:
            raise ValueError('Regional coverage needs a province.')
        if self.scope == 'district' and not self.district.strip():
            raise ValueError('Enter the regency/city name for that coverage.')
        if self.channel == 'jdih' or self.source_url:
            url = urlsplit(self.source_url)
            host = (url.hostname or '').lower()
            if url.scheme != 'https' or not host.endswith('.go.id') or url.username or url.password or url.port not in {None, 443}:
                raise ValueError('Use an HTTPS URL on a .go.id government site without credentials.')
        if self.channel == 'upload' and (not self.filename or not self.content_base64):
            raise ValueError('Choose a source file to upload.')
        if self.channel == 'jdih' and self.content_base64:
            raise ValueError('JDIH links and file uploads use separate paths.')
        return self


def extract_upload(filename, data):
    suffix = Path(filename).suffix.lower()
    if len(data) > 10 * 1024 * 1024:
        raise ValueError('Maximum file size is 10 MB.')
    if suffix == '.pdf':
        with fitz.open(stream=data, filetype='pdf') as pdf:
            if len(pdf) > 150:
                raise ValueError('PDF maximum 150 pages.')
            pages = [page.get_text() for page in pdf]
        return '\n'.join(pages)[:300000], any(len(page.strip()) < 80 for page in pages)
    if suffix == '.docx':
        with zipfile.ZipFile(io.BytesIO(data)) as archive:
            if sum(item.file_size for item in archive.infolist()) > 30 * 1024 * 1024:
                raise ValueError('DOCX is too large after extraction.')
        return '\n'.join(p.text for p in Document(io.BytesIO(data)).paragraphs)[:300000], False
    if suffix == '.txt':
        return data.decode('utf-8-sig')[:300000], False
    if suffix == '.json':
        doc = json.loads(data)
        if not isinstance(doc, dict) or not isinstance(doc.get('articles'), list):
            raise ValueError('A source JSON needs a list of articles.')
        return '\n\n'.join('Pasal '+str(a['number'])+'\n'+str(a['text']) for a in doc['articles'])[:300000], False
    raise ValueError('Use PDF, DOCX, TXT or JSON with articles.')


def add_intake(request: IntakeRequest):
    text, needs_ocr, encoded, digest = '', False, '', ''
    filename = Path(request.filename.replace('\\', '/')).name
    if request.channel == 'upload':
        try:
            data = base64.b64decode(request.content_base64, validate=True)
            text, needs_ocr = extract_upload(filename, data)
        except (ValueError, UnicodeError, zipfile.BadZipFile, KeyError, TypeError, RuntimeError) as exc:
            raise ValueError('The file could not be read: '+str(exc)) from exc
        digest = hashlib.sha256(data).hexdigest()
        encoded = base64.b64encode(data).decode()
    # No arbitrary server fetch. JDIH links are a real, persisted acquisition queue.
    fingerprint = 'upload:'+digest if digest else 'jdih:'+request.source_url.strip()
    with store.db() as connection:
        existing = connection.execute('SELECT id FROM source_intake WHERE fingerprint=?', (fingerprint,)).fetchone()
        if existing:
            return {'item': get_intake(existing['id']), 'duplicate': True}
        identity = request.model_dump(exclude={'content_base64'})
        identity['filename'] = filename
        item = {**identity, 'id': uuid.uuid4().hex, 'created_at': store.now(), 'sha256': digest,
                'status': 'link_pending' if request.channel == 'jdih' else 'needs_ocr' if needs_ocr else 'needs_review',
                'article_count': len(re.findall(r'(?m)^\s*Pasal\s+(?:\d+[A-Z]?|I|II)\s*$', text)),
                'preview': text[:3500], 'text_available': bool(text.strip())}
        connection.execute('INSERT INTO source_intake VALUES (?,?,?,?,?)',
                           (item['id'], json.dumps(item, ensure_ascii=False), encoded, fingerprint, item['created_at']))
    return {'item': item, 'duplicate': False}


def get_intake(item_id):
    with store.db() as connection:
        row = connection.execute('SELECT payload FROM source_intake WHERE id=?', (item_id,)).fetchone()
    if not row:
        raise KeyError('Queued source not found.')
    return json.loads(row['payload'])


def intake_items():
    with store.db() as connection:
        return [json.loads(r['payload']) for r in connection.execute('SELECT payload FROM source_intake ORDER BY created_at DESC')]


@lru_cache(maxsize=128)
def file_digest(path, size, modified):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def document_inventory():
    # Return metadata and counts without loading all article bodies into Python.
    with store.db() as connection:
        rows = connection.execute("SELECT json_remove(payload,'$.articles') AS doc, json_array_length(json_extract(payload,'$.articles')) AS count FROM regulations").fetchall()
        topics = connection.execute("SELECT a.regulation_id,t.value AS topic FROM articles a,json_each(a.payload,'$.enrichment.topics') t GROUP BY a.regulation_id,t.value").fetchall()
    doc_topics = {}
    for row in topics:
        doc_topics.setdefault(row['regulation_id'], []).append(row['topic'])
    documents = []
    known = {p['id'] for p in provinces()}
    for row in rows:
        d = json.loads(row['doc']);m = d['metadata'];g = m.get('geography', {})
        province = str(g.get('province_id', ''))
        province = province if province in known else ''
        national = m['type'] in NATIONAL
        scope = g.get('scope', 'national' if national and m.get('jurisdiction') == 'Indonesia' else 'unknown')
        source = d['provenance'];valid = None
        raw = (ROOT/'data'/source.get('raw_file', '')).resolve()
        if raw.is_relative_to((ROOT/'data/raw').resolve()) and raw.is_file():
            stat = raw.stat();valid = file_digest(str(raw), stat.st_size, stat.st_mtime_ns) == source.get('sha256')
        documents.append({'id': d['id'], 'title': m['title'], 'regulation_type': m['type'], 'number': str(m['number']),
                          'year': m['year'], 'version_id': d['version_id'], 'version_kind': m['version_kind'],
                          'issuer_level': 'national' if national else 'province' if province else 'unknown',
                          'province_id': province, 'district': g.get('district', ''), 'scope': scope,
                          'scope_provinces': [str(x) for x in g.get('scope_provinces', [province] if province and scope in {'province', 'district'} else []) if str(x) in known],
                          'mentioned_provinces': [str(x) for x in g.get('mentioned_provinces', []) if str(x) in known],
                          'articles': row['count'] or 0, 'topics': doc_topics.get(d['id'], []),
                          'needs_ocr': bool(d['quality'].get('ocr_needed_pages')), 'human_verified': bool(d['quality'].get('human_verified')),
                          'checksum_valid': valid, 'source_url': source.get('source_url', ''), 'retrieved_at': source.get('retrieved_at', '')})
    return documents


def overview(kind='', start=None, end=None, mode='issuer', include_private=True):
    docs = [d for d in document_inventory() if (not kind or d['regulation_type'] == kind)
            and (start is None or d['year'] >= start) and (end is None or d['year'] <= end)]
    regions = {p['id']: {**p, 'count': 0, 'districts': {}} for p in provinces()}
    national = unknown = 0
    for d in docs:
        ids = [d['province_id']] if mode == 'issuer' and d['issuer_level']=='province' and d['province_id'] else d['scope_provinces'] if mode == 'scope' else d['mentioned_provinces'] if mode == 'mentions' else []
        is_national = mode == 'issuer' and d['issuer_level'] == 'national' or mode == 'scope' and d['scope'] == 'national'
        if is_national:
            national += 1
        elif not ids:
            unknown += 1
        for region_id in set(ids):
            r = regions[region_id];r['count'] += 1
            if d['district']:
                r['districts'][d['district']] = r['districts'].get(d['district'], 0)+1
    type_counts = {}
    topic_counts = {}
    identities = set()
    for d in docs:
        identities.add((d['regulation_type'], d['number'], d['year'], d['province_id'], d['district']))
        type_counts[d['regulation_type']] = type_counts.get(d['regulation_type'], 0)+1
        for t in d['topics']:
            topic_counts[t] = topic_counts.get(t, 0)+1
    result = {'mode': mode, 'provinces': list(regions.values()), 'types': type_counts, 'topics': topic_counts,
              'summary': {'unique_regulations': len(identities), 'documents': len(docs), 'articles': sum(d['articles'] for d in docs),
                          'national': national, 'unknown_region': unknown, 'mapped_provinces': sum(r['count'] > 0 for r in regions.values()),
                          'province_total': len(regions), 'needs_ocr': sum(d['needs_ocr'] for d in docs),
                          'human_verified': sum(d['human_verified'] for d in docs), 'checksum_issues': sum(d['checksum_valid'] is False for d in docs)},
              'latest_retrieval': max((d['retrieved_at'] for d in docs), default=None),
              'geometry_source': json.loads((ROOT/'app/static/geo/source.json').read_text())}
    if include_private:
        result.update(documents=docs, intake=intake_items())
    return result
