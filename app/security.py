"""Named API credentials and roles for one controlled workspace."""
import json
import secrets
from app.config import settings

ROLES = {'admin', 'editor', 'reviewer', 'viewer'}

def credentials():
    try:
        rows = json.loads(settings.access_keys or '[]')
    except (ValueError, TypeError) as exc:
        raise ValueError('RULELAB_ACCESS_KEYS harus berupa JSON array.') from exc
    if not isinstance(rows, list):
        raise ValueError('RULELAB_ACCESS_KEYS harus berupa JSON array.')
    ids, tokens = set(), set()
    for row in rows:
        if not isinstance(row, dict) or set(row) != {'id', 'role', 'token'}:
            raise ValueError('Access key memerlukan id, role, dan token.')
        if not isinstance(row['id'], str) or not row['id'] or len(row['id']) > 100:
            raise ValueError('ID access key tidak valid.')
        if row['role'] not in ROLES or not isinstance(row['token'], str) or len(row['token']) < 32:
            raise ValueError('Role tidak valid atau token kurang dari 32 karakter.')
        if row['id'] in ids or row['token'] in tokens:
            raise ValueError('ID dan token harus unik.')
        ids.add(row['id']); tokens.add(row['token'])
    return rows

def validate_deployment():
    keys = credentials()
    if settings.provider not in {'demo','gemini','vertex'} or settings.search_backend not in {'sqlite','elasticsearch'}:
        raise ValueError('AI_PROVIDER atau SEARCH_BACKEND tidak valid.')
    if not 10 <= settings.ai_timeout <= 600 or not 1 <= settings.ai_concurrency <= 16 or not 1 <= settings.embedding_dimensions <= 3072:
        raise ValueError('Timeout, concurrency atau dimensi embedding di luar batas.')
    if not 1 <= settings.max_agent_jobs <= 32 or not 1 <= settings.agent_step_timeout <= 900:
        raise ValueError('Kapasitas atau timeout agent di luar batas yang didukung.')
    if settings.deployment_mode not in {'development', 'production'}:
        raise ValueError('RULELAB_DEPLOYMENT_MODE tidak valid.')
    if settings.deployment_mode == 'production':
        if not keys or not any(k['role'] == 'admin' for k in keys):
            raise ValueError('Production memerlukan named access keys dan role admin.')
        origins = settings.allowed_origins.split(',') if settings.allowed_origins else []
        if not origins or any(not x.strip().startswith('https://') for x in origins):
            raise ValueError('Production memerlukan RULELAB_ALLOWED_ORIGINS HTTPS eksplisit.')

def authenticate(header):
    token = header.removeprefix('Bearer ')
    keys = credentials()
    for key in keys:
        if secrets.compare_digest(token, key['token']):
            return {'id': key['id'], 'role': key['role']}
    if keys:
        return None
    if settings.api_token:
        return {'id': 'shared-key', 'role': 'admin'} if secrets.compare_digest(token, settings.api_token) else None
    return {'id': 'local-developer', 'role': 'admin'}

def permitted(principal, method, path):
    if principal['role'] == 'admin' or method in {'GET', 'HEAD', 'OPTIONS'}:
        return True
    if path=='/api/readiness/probe':return False
    if path=='/api/gallery/chat':return True
    if path.endswith('/review') and path.startswith('/api/runs/'):
        return principal['role'] in {'editor', 'reviewer'}
    return principal['role'] == 'editor'
