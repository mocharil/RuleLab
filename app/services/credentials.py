"""Read only local credential metadata; never expose the key or file contents."""
import json
from pathlib import Path

class CredentialError(ValueError):
    pass


def service_account_info(path, *, validate_key=False):
    file = Path(path).expanduser().resolve()
    if not file.is_file():
        raise CredentialError('SA JSON file not found. Check the path used by the server.')
    if file.stat().st_size > 128_000:
        raise CredentialError('The SA JSON file is too large or has the wrong format.')
    try:
        data = json.loads(file.read_text(encoding='utf-8'))
    except (OSError, UnicodeError, ValueError) as exc:
        raise CredentialError('The SA file must be readable JSON.') from exc
    if not isinstance(data, dict) or data.get('type') != 'service_account':
        raise CredentialError('Use a service_account JSON key, not an OAuth client JSON.')
    if not all(isinstance(data.get(key), str) and data[key].strip() for key in ('project_id', 'client_email', 'private_key', 'token_uri')):
        raise CredentialError('The SA JSON is missing project_id, client_email, private_key or token_uri.')
    if data['token_uri'] not in {'https://oauth2.googleapis.com/token', 'https://accounts.google.com/o/oauth2/token'}:
        raise CredentialError('The SA token_uri must use Google’s official OAuth endpoint.')
    if validate_key:
        try:
            from google.oauth2.service_account import Credentials
            Credentials.from_service_account_info(data, scopes=['https://www.googleapis.com/auth/cloud-platform'])
        except Exception as exc:
            raise CredentialError('The SA private key cannot be read. Download the official JSON key again.') from exc
    return {'project_id': data['project_id'], 'client_email': data['client_email'], 'path': file}
