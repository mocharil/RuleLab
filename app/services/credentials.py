"""Read only local credential metadata; never expose the key or file contents."""
import json
from pathlib import Path

class CredentialError(ValueError):
    pass


def service_account_info(path, *, validate_key=False):
    file = Path(path).expanduser().resolve()
    if not file.is_file():
        raise CredentialError('File SA JSON tidak ditemukan. Periksa path yang dipakai server.')
    if file.stat().st_size > 128_000:
        raise CredentialError('File SA JSON terlalu besar atau formatnya tidak sesuai.')
    try:
        data = json.loads(file.read_text(encoding='utf-8'))
    except (OSError, UnicodeError, ValueError) as exc:
        raise CredentialError('File SA harus berupa JSON yang dapat dibaca.') from exc
    if not isinstance(data, dict) or data.get('type') != 'service_account':
        raise CredentialError('Gunakan key JSON bertipe service_account, bukan OAuth client JSON.')
    if not all(isinstance(data.get(key), str) and data[key].strip() for key in ('project_id', 'client_email', 'private_key', 'token_uri')):
        raise CredentialError('SA JSON belum memuat project_id, client_email, private_key dan token_uri lengkap.')
    if data['token_uri'] not in {'https://oauth2.googleapis.com/token', 'https://accounts.google.com/o/oauth2/token'}:
        raise CredentialError('token_uri SA harus menggunakan endpoint OAuth resmi Google.')
    if validate_key:
        try:
            from google.oauth2.service_account import Credentials
            Credentials.from_service_account_info(data, scopes=['https://www.googleapis.com/auth/cloud-platform'])
        except Exception as exc:
            raise CredentialError('Private key SA tidak dapat dibaca. Unduh ulang key JSON resmi.') from exc
    return {'project_id': data['project_id'], 'client_email': data['client_email'], 'path': file}
