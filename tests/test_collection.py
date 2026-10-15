import base64
import json

import pytest
import fitz
from app import store
from app.config import settings
from app.services import collection


def upload(**overrides):
    return {'channel':'upload','title':'Pengelolaan Perikanan Daerah','regulation_type':'PERDA_KAB','number':'3','year':2026,
            'province_id':'32','district':'Kota Bandung','scope':'district','filename':'sumber.txt',
            'content_base64':base64.b64encode(b'Pasal 1\nPelayanan tersedia bagi masyarakat.\n\nPasal 2\nPemerintah menyediakan informasi.').decode(),**overrides}


def test_inventory_uses_actual_counts_and_never_distributes_national_documents(client):
    total_docs=len(store.regulations())
    result=client.get('/api/data/overview').json()
    summary=result['summary']
    assert summary['documents']==total_docs and summary['unique_regulations']==total_docs and summary['articles']>=1311
    assert summary['national']>=14 and summary['mapped_provinces']>=11
    assert len(result['provinces'])==38 and sum(p['count'] for p in result['provinces'])==total_docs-summary['national']
    assert sum(result['types'].values())==total_docs
    assert summary['human_verified']==0 and summary['checksum_issues']==0
    pp=client.get('/api/public/collection?kind=PP&start=2012&end=2012').json()
    assert pp['summary']['documents']==1
    assert client.get('/api/public/collection?start=2026&end=2020').status_code==400


def test_region_dimensions_are_explicit_and_do_not_infer_scope_from_mentions(client):
    base_issuer=client.get('/api/data/overview').json()
    base_scope=client.get('/api/data/overview?mode=scope').json()
    base_mentions=client.get('/api/data/overview?mode=mentions').json()
    def count(result,region):return next(p['count'] for p in result['provinces'] if p['id']==region)
    b_i32,b_i33,b_i51=count(base_issuer,'32'),count(base_issuer,'33'),count(base_issuer,'51')
    b_s32,b_s33,b_s51=count(base_scope,'32'),count(base_scope,'33'),count(base_scope,'51')
    b_m51,b_m32=count(base_mentions,'51'),count(base_mentions,'32')
    base_districts=next(p for p in base_issuer['provinces'] if p['id']=='32')['districts']
    with store.db() as db:
        document=json.loads(db.execute("SELECT payload FROM regulations WHERE id='pp-96-2012'").fetchone()['payload'])
        document['metadata']['geography']={'province_id':'32','district':'Kota Bandung','scope':'province','scope_provinces':['32','33'],'mentioned_provinces':['51']}
        document['metadata']['type']='PERDA_KAB'
        db.execute('UPDATE regulations SET payload=? WHERE id=?',(json.dumps(document),document['id']))
    issuer=client.get('/api/data/overview').json()
    scope=client.get('/api/data/overview?mode=scope').json()
    mentions=client.get('/api/data/overview?mode=mentions').json()
    assert count(issuer,'32')==b_i32+1 and count(issuer,'33')==b_i33 and count(issuer,'51')==b_i51
    assert count(scope,'32')==b_s32+1 and count(scope,'33')==b_s33+1 and count(scope,'51')==b_s51
    assert count(mentions,'51')==b_m51+1 and count(mentions,'32')==b_m32
    districts_32=next(p for p in issuer['provinces'] if p['id']=='32')['districts']
    # The corpus grows with JDIH ingestion, so compare against the baseline instead of absolute counts.
    assert districts_32.get('Kabupaten Sumedang')==base_districts.get('Kabupaten Sumedang') and districts_32.get('Kota Bandung',0)==base_districts.get('Kota Bandung',0)+1


def test_upload_extracts_persists_deduplicates_and_keeps_intake_out_of_analysis(client):
    total_docs=len(store.regulations())
    response=client.post('/api/data/intake',json=upload())
    assert response.status_code==201
    item=response.json()['item']
    assert item['status']=='needs_review' and item['article_count']==2 and item['text_available']
    assert len(item['sha256'])==64
    duplicate=client.post('/api/data/intake',json=upload(title='Salinan sumber')).json()
    assert duplicate['duplicate'] and duplicate['item']['id']==item['id']
    assert client.get('/api/data/intake/'+item['id']).json()['title']=='Pengelolaan Perikanan Daerah'
    raw=client.get('/api/data/intake/'+item['id']+'/raw')
    assert raw.content==base64.b64decode(upload()['content_base64'])
    dashboard=client.get('/api/data/overview').json()
    assert len(dashboard['intake'])==1 and dashboard['summary']['documents']==total_docs
    assert len(client.get('/api/corpus').json())==total_docs
    public=client.get('/api/public/collection').json()
    assert 'intake' not in public and 'documents' not in public
    assert 'Pengelolaan Perikanan Daerah' not in json.dumps(public)


def test_jdih_links_are_queued_without_fetch_and_deduplicated(client):
    data={k:v for k,v in upload().items() if k not in {'filename','content_base64'}}
    data.update(channel='jdih',source_url='https://jdih.bandung.go.id/dokumen/perda.pdf')
    first=client.post('/api/data/intake',json=data).json()
    item=first['item']
    assert item['status']=='link_pending' and not item['text_available'] and item['article_count']==0
    assert client.post('/api/data/intake',json=data).json()['duplicate']
    assert client.get('/api/data/intake/'+item['id']+'/raw').status_code==404


@pytest.mark.parametrize('bad',[
    {'province_id':'99'}, {'province_id':''}, {'scope':'district','district':''},
    {'channel':'jdih','content_base64':'','source_url':'http://jdih.example.go.id/a'},
    {'channel':'jdih','content_base64':'','source_url':'https://127.0.0.1/a'},
    {'channel':'jdih','content_base64':'','source_url':'https://example.com/a'},
    {'channel':'jdih','content_base64':'','source_url':'https://user:password@jdih.example.go.id/a'},
])
def test_invalid_intake_identity_or_source_is_rejected(client,bad):
    assert client.post('/api/data/intake',json=upload(**bad)).status_code==422


def test_public_landing_stats_work_without_token_but_private_queue_is_protected(client,monkeypatch):
    token='unit-test-admin-token-with-at-least-32-characters'
    viewer='unit-test-viewer-token-with-at-least-32-characters'
    monkeypatch.setattr(settings,'access_keys',json.dumps([{'id':'admin','role':'admin','token':token},{'id':'viewer','role':'viewer','token':viewer}]))
    assert client.get('/api/public/collection').status_code==200
    assert client.get('/api/data/overview').status_code==401
    assert client.post('/api/data/intake',json=upload(),headers={'Authorization':'Bearer '+viewer}).status_code==403
    assert client.get('/api/data/overview',headers={'Authorization':'Bearer '+viewer}).status_code==200


def test_unique_regulations_count_multiple_snapshots_once(client):
    base_count=len(store.regulations())
    with store.db() as db:
        document=json.loads(db.execute("SELECT payload FROM regulations WHERE id='pp-96-2012'").fetchone()['payload'])
        document['id']='copy-pp';document['version_id']='copy-pp@another-version'
        db.execute('INSERT INTO regulations VALUES (?,?)',(document['id'],json.dumps(document)))
    result=client.get('/api/data/overview').json()['summary']
    assert result['documents']==base_count+1 and result['unique_regulations']==base_count


def test_national_issuer_is_not_reassigned_to_its_regional_scope(client):
    base_i=client.get('/api/data/overview?kind=PP').json()['summary']
    base_s=client.get('/api/data/overview?kind=PP&mode=scope').json()['summary']
    with store.db() as db:
        doc=json.loads(db.execute("SELECT payload FROM regulations WHERE id='pp-96-2012'").fetchone()['payload'])
        doc['metadata']['geography']={'province_id':'32','scope':'province','scope_provinces':['32']}
        db.execute('UPDATE regulations SET payload=? WHERE id=?',(json.dumps(doc),doc['id']))
    issuer=client.get('/api/data/overview?kind=PP').json()
    scope=client.get('/api/data/overview?kind=PP&mode=scope').json()
    # Counts follow the growing corpus: compare with the baseline, not absolute numbers.
    assert issuer['summary']['national']==base_i['national'] and issuer['summary']['mapped_provinces']==base_i['mapped_provinces']
    assert scope['summary']['national']==base_s['national']-1 and scope['summary']['mapped_provinces']==base_s['mapped_provinces']+1


def test_scanned_pdf_is_stored_with_explicit_ocr_status(client):
    with fitz.open() as pdf:
        pdf.new_page();raw=pdf.tobytes()
    response=client.post('/api/data/intake',json=upload(filename='scan.pdf',content_base64=base64.b64encode(raw).decode()))
    assert response.status_code==201
    item=response.json()['item']
    assert item['status']=='needs_ocr' and not item['text_available'] and item['article_count']==0


def test_unreadable_upload_is_rejected_without_creating_an_intake_record(client):
    response=client.post('/api/data/intake',json=upload(filename='bad.pdf',content_base64=base64.b64encode(b'not a PDF').decode()))
    assert response.status_code==400
    assert client.get('/api/data/overview').json()['intake']==[]
