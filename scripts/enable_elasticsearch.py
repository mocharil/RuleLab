"""Build the configured local index, then enable it only after successful checks."""
import asyncio,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from app.config import ROOT,settings
from scripts.index_elasticsearch import main as build_index
from scripts.setup_vertex import write_environment
from app.services.readiness import validate_elastic_index

async def main():
    if settings.provider=='demo':raise SystemExit('Elasticsearch vector RAG memerlukan Gemini/Vertex. Konfigurasi SA dahulu.')
    # --elastic on start.sh deliberately selects the local Docker Elasticsearch service.
    settings.elastic_url='http://localhost:9200'
    from app.services.retrieval import elastic_client
    healthy=False
    for attempt in range(40):
        try:
            async with elastic_client() as client:
                response=await client.get('/_cluster/health',timeout=3,params={'wait_for_status':'yellow','timeout':'1s'})
                healthy=response.is_success and response.json().get('status') in {'green','yellow'}
        except Exception:pass
        if healthy:break
        await asyncio.sleep(1)
    if not healthy:raise SystemExit('Elasticsearch belum sehat. Periksa docker compose --profile elastic logs elasticsearch.')
    print('Membangun embedding corpus; pemakaian model mengikuti billing project.',flush=True)
    await build_index()
    await validate_elastic_index()
    write_environment({'SEARCH_BACKEND':'elasticsearch','ELASTICSEARCH_URL':settings.elastic_url},ROOT/'.env')
    print('RAG Elasticsearch diaktifkan setelah indeks berhasil diverifikasi.')

if __name__=='__main__':asyncio.run(main())
