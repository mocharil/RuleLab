"""Check local configuration, optionally perform one explicit provider probe."""
import argparse,asyncio,json,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from app import store
from app.services import readiness


def main():
    parser=argparse.ArgumentParser(description='Periksa kesiapan RuleLab.')
    parser.add_argument('--live',action='store_true',help='Kirim satu permintaan uji Gemini; Elasticsearch juga membuat query embedding bila diaktifkan.')
    parser.add_argument('--json',action='store_true')
    args=parser.parse_args()
    try:
        store.initialize()
        result=asyncio.run(readiness.probe()) if args.live else readiness.inspect()
    except Exception:
        result={'ready':False,'detail':'Konfigurasi/database tidak dapat dimuat. Periksa .env dan folder data.'}
    if args.json:print(json.dumps(result,ensure_ascii=False,indent=2))
    elif args.live:
        print(('SIAP' if result['ready'] else 'BELUM SIAP')+': '+result['detail'])
        for step in result.get('steps',[]):print('  OK '+step['label'])
    else:
        for check in result.get('checks',[]):print(f"{check['status'].upper():7} {check['label']}: {check['detail']}")
        print('Local ready:',result.get('local_ready',False))
        print('Jalankan --live untuk menguji kredensial/model/kuota. Uji ini memakai layanan provider.')
    return 0 if result.get('ready',result.get('local_ready',False)) else 1

if __name__=='__main__':raise SystemExit(main())
