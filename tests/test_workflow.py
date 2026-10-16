import base64,io
from docx import Document

def test_full_workflow(client):
 status=client.get('/api/status').json();assert status['regulations']>=26;assert status['articles']>=1300
 draft=client.get('/api/drafts').json()[0];id=draft['id']
 result=client.post(f'/api/drafts/{id}/analyze');assert result.status_code==200
 run=result.json();findings=run['payload']['findings'];assert len(findings)==3
 vertical=[f for f in findings if f['category']=='potential_vertical_conflict'];assert len(vertical)==2
 for f in vertical:
  assert f['evidence']
  assert all(e['source']['sha256'] and e['text'] for e in f['evidence'])
 review=client.post('/api/runs/'+run['id']+'/review',json={'status':'reviewed_with_notes','notes':'Sumber dikonfirmasi, perlu konsultasi masyarakat.'})
 assert review.status_code==200
 alternative='Pasal 1\nLayanan melalui aplikasi digital dan kanal pendampingan.\n\nPasal 2\nPetugas menyediakan bantuan langsung.'
 sim=client.post(f'/api/drafts/{id}/simulate',json={'alternative_text':alternative}).json()
 assert sim['payload']['A']['access_pct']==70
 assert sim['payload']['B']['access_pct']==94
 assert sim['payload']['delta']['served']==240
 assert len(sim['payload']['stakeholders'])==4
 revised=client.post(f'/api/drafts/{id}/apply-revision',json={'run_id':run['id'],'finding_index':0,'expected_revision':draft['revision']})
 assert revised.status_code==200;assert revised.json()['revision']==2
 # Stale analysis must never rewrite a newer draft.
 stale=client.post(f'/api/drafts/{id}/apply-revision',json={'run_id':run['id'],'finding_index':1,'expected_revision':2})
 assert stale.status_code==409
 rerun=client.post(f'/api/drafts/{id}/analyze').json()
 assert not any(f['article_number']=='2' and 'akses' in f['title'].lower() for f in rerun['payload']['findings'])
 history=client.get(f'/api/drafts/{id}/history').json();assert [h['revision'] for h in history]==[2,1]
 for fmt in ['docx','report']:
  export=client.get(f'/api/drafts/{id}/export?format={fmt}');assert export.status_code==200
  document=Document(io.BytesIO(export.content));texts=[p.text for p in document.paragraphs]
  assert 'Pasal 2' in texts;assert any('kanal pendampingan' in t for t in texts)
  if fmt=='report':assert 'RuleLab review annex' in texts
 js=client.get(f'/api/drafts/{id}/export?format=json').json();assert js['revision']==2

def test_conflict_optimistic_save(client):
 d=client.get('/api/drafts').json()[0];payload={**d,'expected_revision':1,'title':'Draft baru'}
 assert client.put('/api/drafts/'+d['id'],json=payload).status_code==200
 assert client.put('/api/drafts/'+d['id'],json=payload).status_code==409

def test_search_compare_provenance(client):
 hits=client.get('/api/search',params={'q':'pengaduan tanggapan masyarakat'}).json()['results'];assert hits
 assert all(h['source']['sha256'] for h in hits)
 r=client.post('/api/compare',json={'left_id':'pp-96-2012','right_id':'uu-25-2009','left_article':'7','right_article':'4'})
 assert r.status_code==200;assert 'ranks higher' in r.json()['hierarchy_relation']
 assert r.json()['provider']['mode']=='demo'
 doc=client.get('/api/corpus/uu-25-2009').json();assert len(doc['articles'])==62;assert doc['provenance']['source_url'].startswith('https://jdih.kemenkeu')
 assert client.get('/api/corpus/pp-96-2012/raw').content.startswith(b'%PDF')

def test_generation_import_validation(client):
 generated=client.post('/api/generate',json={'brief':'Layanan publik yang inklusif bagi semua warga','regulation_type':'PP'})
 assert generated.status_code==200;assert len(generated.json()['draft']['articles'])==5
 text='Catatan draft\nPasal 1\nPemohon berhak menerima bantuan.\n\nPasal 2\nPetugas wajib menerima pengaduan.'
 imported=client.post('/api/import',json={'filename':'draft.txt','content_base64':base64.b64encode(text.encode()).decode()})
 assert imported.status_code==200;assert len(imported.json()['articles'])==2
 d=imported.json();docx=client.get('/api/drafts/'+d['id']+'/export').content
 roundtrip=client.post('/api/import',json={'filename':'draft.docx','content_base64':base64.b64encode(docx).decode()})
 assert roundtrip.status_code==200;assert len(roundtrip.json()['articles'])==2
 assert client.post('/api/import',json={'filename':'x.txt','content_base64':'BAD!!'}).status_code==400
 assert client.post('/api/drafts',json={'title':'Test','articles':[{'number':'1','text':'a'},{'number':'1','text':'b'}]}).status_code==422
 assert client.post('/api/drafts/'+d['id']+'/simulate',json={'alternative_text':text,'assumptions':{'digital_access_pct':130}}).status_code==422

def test_auth_and_origin(client,monkeypatch):
 from app.config import settings
 monkeypatch.setattr(settings,'api_token','test-token')
 assert client.get('/api/health').status_code==200
 assert client.get('/api/drafts').status_code==401
 assert client.get('/api/drafts',headers={'Authorization':'Bearer test-token'}).status_code==200
 assert client.post('/api/generate',headers={'Authorization':'Bearer test-token','Origin':'https://evil.example'},json={'brief':'Layanan publik aman'}).status_code==403

def test_no_cross_draft_revision(client):
 d=client.get('/api/drafts').json()[0];run=client.post('/api/drafts/'+d['id']+'/analyze').json()
 other=client.post('/api/drafts',json={'title':'Draft lain','articles':[{'number':'1','text':'Isi draft lain.'}]}).json()
 assert client.post('/api/drafts/'+other['id']+'/apply-revision',json={'run_id':run['id'],'finding_index':0,'expected_revision':1}).status_code==400
