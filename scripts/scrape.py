"""Reproducible, rate-limited official-source crawl; no login or anti-bot bypass."""
import argparse
import json
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.services.ingestion import extract_file, structure, write_json
from bs4 import BeautifulSoup
ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'data'


def fetch(url):
 parsed = urllib.parse.urlparse(url)
 if parsed.scheme != 'https' or not parsed.hostname or not parsed.hostname.endswith('.go.id'):
  raise ValueError('Only HTTPS official .go.id hosts are allowed')
 request = urllib.request.Request(url, headers={'User-Agent': 'RuleLabResearch/0.1 (public legal corpus; single request at a time)'})
 with urllib.request.urlopen(request, timeout=60) as response:
  final = urllib.parse.urlparse(response.url)
  if not final.hostname.endswith('.go.id'): raise ValueError('Redirect outside official host')
  data = response.read(20*1024*1024+1)
  if len(data)>20*1024*1024: raise ValueError('Source exceeds 20MB')
  return data


def run(offline=False, selected=None, refresh=False):
 manifest = []
 for meta in json.loads((DATA/'sources.json').read_text()):
  if selected and meta['id'] not in selected: continue
  failures = []
  success = None
  for url in meta['urls']:
   name = urllib.parse.unquote(urllib.parse.urlparse(url).path.rsplit('/',1)[1])
   raw = DATA/'raw'/name
   cached = raw.exists()
   if offline and not cached: continue
   try:
    if not cached or (refresh and not offline):
     time.sleep(1)
     body = fetch(url)
     if url.lower().endswith('.pdf') and not body.startswith(b'%PDF'):
      raise ValueError('Expected PDF, received HTML/error page')
     if not body.startswith(b'%PDF'):
      soup=BeautifulSoup(body,'html.parser')
      if 'Pasal' not in soup.get_text(): raise ValueError('Not a legal full-text page')
     if cached and raw.read_bytes()!=body:
      import hashlib,zipfile
      old_hash=hashlib.sha256(raw.read_bytes()).hexdigest()
      archive=DATA/'archive'/meta['id']/(old_hash+'.zip')
      archive.parent.mkdir(parents=True,exist_ok=True)
      with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
       z.write(raw,'raw/'+raw.name)
       for stage in ['extracted','enriched']:
        previous=DATA/stage/f"{meta['id']}.json"
        if previous.exists():z.write(previous,stage+'/'+previous.name)
     raw.write_bytes(body)
    extracted = extract_file(raw)
    now = datetime.fromtimestamp(raw.stat().st_mtime, timezone.utc).isoformat()
    doc = structure(meta, extracted, now, name, url)
    if not doc['articles']: raise ValueError('No articles extracted')
    write_json(DATA/'extracted'/f"{meta['id']}.json", extracted)
    write_json(DATA/'enriched'/f"{meta['id']}.json", doc)
    success = {'id':meta['id'],'status':'ok','source_url':url,'raw_file':name,'sha256':doc['provenance']['sha256'],
      'article_count':len(doc['articles']),'quality':doc['quality'],'retrieved_at':now,'cache_used':cached}
    print(meta['id'],len(doc['articles']),'articles',flush=True)
    break
   except Exception as exc:
    failures.append({'url':url,'error':type(exc).__name__+': '+str(exc)})
  attachments=[]
  for url in meta.get('attachments',[]):
   name=urllib.parse.unquote(url.rsplit('/',1)[1]);path=DATA/'raw'/name
   try:
    if not path.exists() and not offline:
     time.sleep(1);body=fetch(url)
     if not body.startswith(b'%PDF'):raise ValueError('Not a PDF')
     path.write_bytes(body)
    if path.exists():
     extracted=extract_file(path);write_json(DATA/'extracted'/f'{name}.json',extracted)
     attachments.append({'url':url,'raw_file':name,'sha256':extracted['sha256'],'pages':extracted['page_count'],'ocr_needed_pages':extracted['quality']['ocr_needed_pages']})
    else:attachments.append({'url':url,'raw_file':name,'status':'not_downloaded'})
   except Exception as exc:failures.append({'url':url,'error':str(exc)})
  manifest.append({**(success or {'id':meta['id'],'status':'failed'}),'attachments':attachments,'attempt_errors':failures})
 write_json(DATA/'manifest.json', {'generated_at':datetime.now(timezone.utc).isoformat(),'documents':manifest})
 corpus = [json.loads(p.read_text()) for p in sorted((DATA/'enriched').glob('*.json'))]
 write_json(DATA/'corpus.json', {'schema_version':'1.0','documents':corpus})
 if all((DATA/'enriched'/f'{rid}.json').exists() for rid in ('uu-15-2019','uu-13-2022')):
  from scripts.extract_changes import extract
  extract()
 if any(d['status']=='failed' for d in manifest):return 1
 return 0

if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--offline',action='store_true');p.add_argument('--only',nargs='*');p.add_argument('--refresh',action='store_true');a=p.parse_args()
 raise SystemExit(run(a.offline,a.only,a.refresh))
