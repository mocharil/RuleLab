"""Named API credentials and roles for one controlled workspace."""
import json
import secrets
from app.config import settings

ROLES = {'admin', 'editor', 'reviewer', 'viewer'}

def credentials():
    try:
        rows = json.loads(settings.access_keys or '[]')
    except (ValueError, TypeError) as exc:
        raise ValueError('RULELAB_ACCESS_KEYS must be a JSON array.') from exc
    if not isinstance(rows, list):
        raise ValueError('RULELAB_ACCESS_KEYS must be a JSON array.')
    ids, tokens = set(), set()
    for row in rows:
        if not isinstance(row, dict) or set(row) != {'id', 'role', 'token'}:
            raise ValueError('An access key needs an id, role and token.')
        if not isinstance(row['id'], str) or not row['id'] or len(row['id']) > 100:
            raise ValueError('Invalid access key ID.')
        if row['role'] not in ROLES or not isinstance(row['token'], str) or len(row['token']) < 32:
            raise ValueError('Invalid role or token shorter than 32 characters.')
        if row['id'] in ids or row['token'] in tokens:
            raise ValueError('IDs and tokens must be unique.')
        ids.add(row['id']); tokens.add(row['token'])
    return rows

def validate_deployment():
    keys = credentials()
    if settings.provider not in {'demo','gemini','vertex'} or settings.search_backend not in {'sqlite','elasticsearch'}:
        raise ValueError('Invalid AI_PROVIDER or SEARCH_BACKEND.')
    if not 10 <= settings.ai_timeout <= 600 or not 1 <= settings.ai_concurrency <= 16 or not 1 <= settings.embedding_dimensions <= 3072:
        raise ValueError('Timeout, concurrency or embedding dimensions out of range.')
    if not 1 <= settings.max_agent_jobs <= 32 or not 1 <= settings.agent_step_timeout <= 900:
        raise ValueError('Agent capacity or timeout outside the supported range.')
    if settings.deployment_mode not in {'development', 'production'}:
        raise ValueError('Invalid RULELAB_DEPLOYMENT_MODE.')
    if settings.deployment_mode == 'production':
        if settings.provider == 'demo':
            raise ValueError('Production must use a live provider (AI_PROVIDER=gemini or vertex); demo templates are for local development only.')
        if not keys or not any(k['role'] == 'admin' for k in keys):
            raise ValueError('Production requires named access keys with an admin role.')
        origins = settings.allowed_origins.split(',') if settings.allowed_origins else []
        if not origins or any(not x.strip().startswith('https://') for x in origins):
            raise ValueError('Production requires explicit HTTPS RULELAB_ALLOWED_ORIGINS.')

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
    if path in {'/api/gallery/chat','/api/drafting/preview'}:return True
    if path.endswith('/review') and path.startswith('/api/runs/'):
        return principal['role'] in {'editor', 'reviewer'}
    return principal['role'] == 'editor'
