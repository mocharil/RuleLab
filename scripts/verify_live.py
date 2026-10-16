"""Opt-in provider test. --full uses a temporary DB and public example inputs."""
import argparse,asyncio,json,sys,time,tempfile
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from fastapi.testclient import TestClient
from app.config import ROOT,settings
from app import store,security
from app.main import app
from app.services import readiness


def verify_full(timeout=600):
    checks=[]
    admin=next((row['token'] for row in security.credentials() if row['role']=='admin'),settings.api_token)
    headers={'Authorization':'Bearer '+admin} if admin else {}
    with TestClient(app,headers=headers) as client:
        def checked(label,method,route,**kwargs):
            started=time.monotonic();response=client.request(method,route,**kwargs)
            if response.status_code>=400:
                detail=response.json().get('detail','Permintaan gagal.')
                raise RuntimeError(label+': '+str(detail))
            checks.append({'feature':label,'seconds':round(time.monotonic()-started,2),'status':'passed'})
            return response
        probe=checked('Koneksi structured output dan retrieval','POST','/api/readiness/probe',json={}).json()
        if not probe['ready']:raise RuntimeError(probe['detail'])
        generated=checked('Generasi draft','POST','/api/generate',json={'brief':'Rancang pelayanan administrasi digital yang inklusif, dengan kanal pendampingan, akomodasi disabilitas dan tanggapan pengaduan.','regulation_type':'PP'}).json()
        assert generated['provider']['mode']=='live' and generated['draft']['regulation_type']=='PP'
        sample=json.loads((ROOT/'app/samples/sample_draft.json').read_text())
        draft=checked('Impor JSON draft','POST','/api/import',json={'filename':'verification.json','content_base64':__import__('base64').b64encode(json.dumps(sample).encode()).decode()}).json()
        draft=checked('Edit dan simpan versi','PUT','/api/drafts/'+draft['id'],json={**draft,'title':'Verifikasi layanan publik digital','expected_revision':draft['revision']}).json()
        analyzed=checked('Review legal live','POST','/api/drafts/'+draft['id']+'/analyze',json={'as_of_date':time.strftime('%Y-%m-%d')}).json()
        assert analyzed['payload']['provider']['mode']=='live'
        checked('Catatan reviewer','POST','/api/runs/'+analyzed['id']+'/review',json={'status':'reviewed_with_notes','notes':'Verifikasi integrasi dengan data publik; penilaian substantif masih perlu reviewer hukum.'})
        checked('Cari pasal','GET','/api/search',params={'q':'pelayanan akses disabilitas'})
        comparison=checked('Bandingkan sumber live','POST','/api/compare',json={'left_id':'pp-96-2012','right_id':'uu-25-2009','left_article':'4','right_article':'4'}).json()
        assert comparison['provider']['mode']=='live'
        chat=checked('Bot galeri bersumber','POST','/api/gallery/chat',json={'question':'Jelaskan Pasal 4 UU 25/2009 untuk pemula.'}).json()
        assert chat['provider']['mode']=='live' and chat['status']=='answered' and chat['sources']
        alternative='Pasal 1\nPelayanan disediakan melalui kanal digital dan kanal pendampingan.\n\nPasal 2\nPenyelenggara menyediakan akomodasi yang layak dan menanggapi pengaduan.'
        assumptions={'population':1000,'digital_access_pct':70,'assisted_success_pct':80,'digital_cost':20000,'assisted_cost':50000,'staff_capacity':40}
        impact=checked('Simulasi dampak live','POST','/api/drafts/'+draft['id']+'/simulate',json={'alternative_text':alternative,'assumptions':assumptions}).json()
        assert impact['payload']['provider']['mode']=='live' and len(impact['payload']['stakeholders'])==4
        for intent in ['full','social']:
            job=checked('Mulai job '+intent,'POST','/api/drafts/'+draft['id']+'/agent-jobs',json={'intent':intent,'expected_revision':draft['revision'],'alternative_text':alternative,'assumptions':assumptions},headers={'Idempotency-Key':'verification-'+intent}).json()
            deadline=time.monotonic()+timeout
            while job['status'] in {'queued','running','cancelling'} and time.monotonic()<deadline:
                time.sleep(.5)
                response=client.get('/api/agent-jobs/'+job['id']);response.raise_for_status();job=response.json()
            if job['status']!='completed':
                if job['status'] in {'queued','running','cancelling'}:client.post('/api/agent-jobs/'+job['id']+'/cancel',json={})
                raise RuntimeError('Job '+intent+': '+(job['error'] or 'Melewati batas waktu verifikasi.'))
            checks.append({'feature':'Eksekusi job '+intent,'status':'passed','events':len(job['events'])})
            if intent=='social':
                reactions=[event for event in job['events'] if event['tool']=='social_reaction' and event['status']=='completed']
                assert len(reactions)==job['social_options']['persona_count']*job['social_options']['rounds']*2
        report=checked('Ekspor laporan DOCX','GET','/api/drafts/'+draft['id']+'/export',params={'format':'report'})
        assert report.content.startswith(b'PK')
        imported=checked('Impor DOCX round trip','POST','/api/import',json={'filename':'verification.docx','content_base64':__import__('base64').b64encode(checked('Ekspor draft DOCX','GET','/api/drafts/'+draft['id']+'/export').content).decode()}).json()
        assert imported['articles']==draft['articles']
        checked('Riwayat hasil','GET','/api/drafts/'+draft['id']+'/runs')
        checked('Riwayat versi','GET','/api/drafts/'+draft['id']+'/history')
    return checks


def main():
    parser=argparse.ArgumentParser(description='Verifikasi kredensial dan alur Gemini/Vertex live.')
    parser.add_argument('--full',action='store_true',help='Jalankan semua fitur termasuk 30 opini persona. Memakai sekitar 45 panggilan generasi plus embeddings bila Elasticsearch aktif.')
    parser.add_argument('--timeout',type=int,default=600)
    args=parser.parse_args()
    if settings.provider=='demo':parser.exit(1,'Konfigurasi Gemini/Vertex dahulu. Test ini tidak menggunakan mode demo.\n')
    original=settings.db_path
    with tempfile.TemporaryDirectory(prefix='rulelab-live-') as temporary:
        settings.db_path=Path(temporary)/'verification.sqlite3'
        try:
            store.initialize()
            if args.full:report={'passed':True,'provider':settings.provider,'model':settings.model,'checks':verify_full(args.timeout)}
            else:
                result=asyncio.run(readiness.probe())
                report={'passed':result['ready'],'provider':settings.provider,'model':settings.model,'result':result}
            folder=ROOT/'artifacts';folder.mkdir(exist_ok=True)
            (folder/'live-verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
            print(json.dumps(report,ensure_ascii=False,indent=2))
            return 0 if report['passed'] else 1
        except Exception as exc:
            print('Verifikasi belum selesai: '+str(exc));return 1
        finally:settings.db_path=original

if __name__=='__main__':raise SystemExit(main())
