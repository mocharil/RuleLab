"""Configure Vertex from a local SA path, preserving unrelated environment keys."""
import argparse
import json
import os
import re
import sys
import tempfile
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from dotenv import dotenv_values
from app.config import ROOT
from app.services.credentials import service_account_info, CredentialError


def write_config(credentials, env_path=None, project=None, model=None, location=None):
    info = service_account_info(credentials, validate_key=True)
    target = Path(env_path or ROOT / '.env').resolve()
    values = dotenv_values(target) if target.exists() else {}
    changes = {
        'AI_PROVIDER': 'vertex',
        'GOOGLE_APPLICATION_CREDENTIALS': str(info['path']),
        'GOOGLE_CLOUD_PROJECT': project or info['project_id'],
        'GOOGLE_CLOUD_LOCATION': location or values.get('GOOGLE_CLOUD_LOCATION') or 'global',
        'GEMINI_MODEL': model or values.get('GEMINI_MODEL') or 'gemini-3.8-flash',
        'EMBEDDING_LOCATION': values.get('EMBEDDING_LOCATION') or 'us-central1',
    }
    for key in ('GOOGLE_CLOUD_PROJECT', 'GOOGLE_CLOUD_LOCATION', 'GEMINI_MODEL', 'EMBEDDING_LOCATION'):
        if not re.fullmatch(r'[a-zA-Z0-9_.:-]+', changes[key]):
            raise CredentialError(f'{key} tidak valid.')
    write_environment(changes,target)
    return {'provider': 'vertex', 'project': changes['GOOGLE_CLOUD_PROJECT'], 'model': changes['GEMINI_MODEL'], 'location': changes['GOOGLE_CLOUD_LOCATION']}


def write_environment(changes,target):
    target=Path(target).resolve()
    text = target.read_text() if target.exists() else (ROOT / '.env.example').read_text()
    lines, remaining = [], dict(changes)
    for line in text.splitlines():
        match = re.match(r'^\s*(?:export\s+)?([A-Z][A-Z0-9_]*)\s*=', line)
        if match and match[1] in changes:
            if match[1] in remaining:
                lines.append(match[1] + '=' + json.dumps(remaining.pop(match[1]), ensure_ascii=False))
        else:
            lines.append(line)
    lines.extend(key + '=' + json.dumps(value, ensure_ascii=False) for key, value in remaining.items())
    target.parent.mkdir(parents=True, exist_ok=True)
    fd, name = tempfile.mkstemp(dir=target.parent, prefix='.rulelab-env-')
    try:
        with os.fdopen(fd, 'w', encoding='utf-8') as output:
            output.write('\n'.join(lines) + '\n')
        os.chmod(name, 0o600)
        os.replace(name, target)
    finally:
        Path(name).unlink(missing_ok=True)


def main():
    parser = argparse.ArgumentParser(description='Hubungkan RuleLab ke Vertex menggunakan SA JSON lokal.')
    parser.add_argument('--credentials', required=True)
    parser.add_argument('--project', help='Opsional untuk memakai project berbeda dari project_id SA.')
    parser.add_argument('--model')
    parser.add_argument('--location')
    args = parser.parse_args()
    try:
        result = write_config(args.credentials, project=args.project, model=args.model, location=args.location)
    except CredentialError as exc:
        parser.exit(1, str(exc) + '\n')
    print('Konfigurasi tersimpan. ' + json.dumps(result, ensure_ascii=False))
    print('Jalankan ./start.sh. Uji koneksi melalui Pengaturan integrasi; restart server setelah mengganti konfigurasi.')


if __name__ == '__main__':
    main()
