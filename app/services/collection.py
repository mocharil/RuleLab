"""Collection inventory and private source intake, independent from user drafts."""
from __future__ import annotations

import base64
import hashlib
import io
import json
import re
import time
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
from app.services import sources
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


_inventory = {'key': None, 'documents': [], 'built': 0.0}
INVENTORY_MAX_AGE = 300  # seconds; raw-file checksums are re-read at least this often


def _inventory_key(connection):
    """Cheap change signature for the regulations table: row count and total payload bytes.

    octet_length reads the stored size without parsing the JSON (PostgreSQL: from the TOAST header;
    SQLite >= 3.43: from the record header). Older SQLite falls back to LENGTH.
    """
    try:
        row = connection.execute('SELECT COUNT(*) AS n, SUM(octet_length(payload)) AS size FROM regulations').fetchone()
    except Exception:
        row = connection.execute('SELECT COUNT(*) AS n, SUM(LENGTH(payload)) AS size FROM regulations').fetchone()
    return (row['n'], row['size'])


def document_inventory():
    # Return metadata and counts without loading all article bodies into Python; reuse it until the corpus changes.
    with store.db() as connection:
        key = _inventory_key(connection)
    if _inventory['key'] == key and time.monotonic() - _inventory['built'] < INVENTORY_MAX_AGE:
        return _inventory['documents']
    with store.db() as connection:
        if store.is_postgres():
            rows = connection.execute("SELECT (payload::jsonb - 'articles')::text AS doc, jsonb_array_length(payload::jsonb->'articles') AS count FROM regulations").fetchall()
            topics = connection.execute("SELECT a.regulation_id,t AS topic FROM articles a, jsonb_array_elements_text(a.payload::jsonb #> '{enrichment,topics}') t GROUP BY a.regulation_id,t").fetchall()
        else:
            rows = connection.execute("SELECT json_remove(payload,'$.articles') AS doc, json_array_length(json_extract(payload,'$.articles')) AS count FROM regulations").fetchall()
            topics = connection.execute("SELECT a.regulation_id,t.value AS topic FROM articles a,json_each(a.payload,'$.enrichment.topics') t GROUP BY a.regulation_id,t.value").fetchall()
    doc_topics = {}
    for row in topics:
        doc_topics.setdefault(row['regulation_id'], []).append(row['topic'])
    checksums = sources.checksums()
    documents = []
    known = {p['id'] for p in provinces()}
    for row in rows:
        d = json.loads(row['doc']);m = d['metadata'];g = m.get('geography', {})
        province = str(g.get('province_id', ''))
        province = province if province in known else ''
        national = m['type'] in NATIONAL
        scope = g.get('scope', 'national' if national and m.get('jurisdiction') == 'Indonesia' else 'unknown')
        source = d['provenance'];valid = None
        actual = checksums.get(source.get('raw_file', ''))
        if actual:
            valid = actual == source.get('sha256')
        documents.append({'id': d['id'], 'title': m['title'], 'regulation_type': m['type'], 'number': str(m['number']),
                          'year': m['year'], 'version_id': d['version_id'], 'version_kind': m['version_kind'],
                          'issuer_level': 'national' if national else 'province' if province else 'unknown',
                          'province_id': province, 'district': g.get('district', ''), 'scope': scope,
                          'scope_provinces': [str(x) for x in g.get('scope_provinces', [province] if province and scope in {'province', 'district'} else []) if str(x) in known],
                          'mentioned_provinces': [str(x) for x in g.get('mentioned_provinces', []) if str(x) in known],
                          'articles': row['count'] or 0, 'topics': doc_topics.get(d['id'], []),
                          'needs_ocr': bool(d['quality'].get('ocr_needed_pages')), 'human_verified': bool(d['quality'].get('human_verified')),
                          'checksum_valid': valid, 'source_url': source.get('source_url', ''), 'retrieved_at': source.get('retrieved_at', '')})
    _inventory.update(key=key, documents=documents, built=time.monotonic())
    return documents


def _host(url):
    return (urlsplit(url).hostname or 'unknown').removeprefix('www.')


def overview(kind='', start=None, end=None, mode='issuer', include_private=True):
    inventory = document_inventory()
    of_kind = [d for d in inventory if not kind or d['regulation_type'] == kind]
    docs = [d for d in of_kind if (start is None or d['year'] >= start) and (end is None or d['year'] <= end)]
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
    years, days, hosts = {}, {}, {}
    for d in of_kind:  # the year chart keeps every year of the selected type so a year filter can be widened again
        years[d['year']] = years.get(d['year'], 0)+1
    for d in docs:
        if d['retrieved_at']:
            day = d['retrieved_at'][:10]; days[day] = days.get(day, 0)+1
        host = _host(d['source_url']); hosts[host] = hosts.get(host, 0)+1
    result = {'mode': mode, 'provinces': list(regions.values()), 'types': type_counts, 'topics': topic_counts,
              'years': {str(y): n for y, n in sorted(years.items())},
              'retrieval_days': [{'date': day, 'count': n} for day, n in sorted(days.items())],
              'sources': [{'host': h, 'count': n} for h, n in sorted(hosts.items(), key=lambda x: -x[1])],
              'summary': {'unique_regulations': len(identities), 'documents': len(docs), 'articles': sum(d['articles'] for d in docs),
                          'national': national, 'unknown_region': unknown, 'mapped_provinces': sum(r['count'] > 0 for r in regions.values()),
                          'province_total': len(regions), 'needs_ocr': sum(d['needs_ocr'] for d in docs),
                          'human_verified': sum(d['human_verified'] for d in docs), 'checksum_issues': sum(d['checksum_valid'] is False for d in docs),
                          'amendments': sum(d['version_kind'] != 'original' for d in docs), 'text_available': sum(not d['needs_ocr'] for d in docs)},
              'latest_retrieval': max((d['retrieved_at'] for d in docs), default=None),
              'geometry_source': json.loads((ROOT/'app/static/geo/source.json').read_text())}
    if include_private:
        result.update(intake=intake_items())
    return result


def _in_region(d, mode, province, district=''):
    # Same region semantics as the map: '' = every document, 'national', 'unmapped', or a province id.
    if not province:
        return True
    if province == 'national':
        return d['issuer_level'] == 'national' if mode == 'issuer' else d['scope'] == 'national' if mode == 'scope' else False
    if province == 'unmapped':
        hit = d['issuer_level'] == 'unknown' if mode == 'issuer' else d['scope'] == 'unknown' if mode == 'scope' else not d['mentioned_provinces']
    else:
        hit = (d['issuer_level'] == 'province' and d['province_id'] == province) if mode == 'issuer' else province in d['scope_provinces'] if mode == 'scope' else province in d['mentioned_provinces']
    return hit and (not district or d['district'] == district)


STATUS = {'text': lambda d: not d['needs_ocr'], 'ocr': lambda d: d['needs_ocr'], 'verified': lambda d: d['human_verified'],
          'unverified': lambda d: not d['human_verified'], 'amendment': lambda d: d['version_kind'] != 'original',
          'checksum': lambda d: d['checksum_valid'] is False}
STOPWORDS = {'nomor', 'no', 'no.', 'tahun', 'thn'}
SORTS = {'retrieved': (lambda d: d['retrieved_at'] or '', True), 'year': (lambda d: (d['year'], d['retrieved_at'] or ''), True),
         'articles': (lambda d: d['articles'], True), 'title': (lambda d: d['title'].lower(), False)}


def documents_page(q='', kind='', start=None, end=None, mode='issuer', province='', district='', status='', topic='', host='',
                   day='', sort='retrieved', page=1, size=25):
    words = [w for w in q.lower().replace('/', ' ').split() if w and w not in STOPWORDS]
    def matches(d):
        text = ' '.join([d['title'], d['regulation_type'], d['number'], str(d['year']), d['district']]).lower()
        return all(w in text for w in words)
    docs = [d for d in document_inventory() if (not kind or d['regulation_type'] == kind)
            and (start is None or d['year'] >= start) and (end is None or d['year'] <= end)
            and _in_region(d, mode, province, district) and (not status or STATUS[status](d))
            and (not topic or topic in d['topics']) and (not host or _host(d['source_url']) == host)
            and (not day or (d['retrieved_at'] or '').startswith(day)) and matches(d)]
    if sort == 'relevance':
        # Exact number/year hits and title words rank first; newer documents break ties.
        def score(d):
            title = set(re.findall(r'\w+', d['title'].lower()))
            return (sum(2 for w in words if w in (d['number'].lower(), str(d['year']))) + sum(1 for w in words if w in title), d['year'])
        docs = sorted(docs, key=score, reverse=True)
    else:
        key, reverse = SORTS[sort]
        docs = sorted(docs, key=key, reverse=reverse)
    pages = max(1, -(-len(docs)//size))
    page = min(max(1, page), pages)
    items = [{k: d[k] for k in ('id', 'title', 'regulation_type', 'number', 'year', 'version_kind', 'issuer_level', 'province_id', 'district',
                                 'articles', 'needs_ocr', 'human_verified', 'checksum_valid', 'retrieved_at', 'topics')}
             for d in docs[(page-1)*size:page*size]]
    return {'total': len(docs), 'page': page, 'pages': pages, 'size': size, 'items': items}


def document_index():
    # A small id/label list for pickers (Compare); the full metadata stays on the server.
    return [{'id': d['id'], 'label': f"{d['regulation_type']} {d['number']}/{d['year']}", 'title': d['title'][:90], 'articles': d['articles']}
            for d in sorted(document_inventory(), key=lambda d: (d['regulation_type'], -d['year'], d['number']))]


def titles():
    return {d['id']: d['title'] for d in document_inventory()}
