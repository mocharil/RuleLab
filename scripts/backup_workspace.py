"""Online SQLite backup. Run on the host with the configured RULELAB_DB.

With PostgreSQL (Cloud SQL) use the managed backups instead:  gcloud sql backups create --instance rulelab-db
"""
import argparse
from pathlib import Path
import sqlite3
import sys
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from app import store

def backup(destination):
    if store.is_postgres():raise SystemExit('DATABASE_URL is set: back up Cloud SQL with `gcloud sql backups create --instance <name>` (automated daily backups are enabled).')
    path=Path(destination).resolve()
    if path.exists(): raise ValueError('Destination already exists; choose a new backup filename.')
    path.parent.mkdir(parents=True,exist_ok=True)
    source=store.connect()
    target=sqlite3.connect(path)
    try:
        source.backup(target)
        if target.execute('PRAGMA integrity_check').fetchone()[0]!='ok':
            raise ValueError('Backup integrity check failed.')
        path.chmod(0o600)
    finally:
        target.close();source.close()
    return path

if __name__=='__main__':
    parser=argparse.ArgumentParser(description='Create an online workspace database backup.')
    parser.add_argument('destination')
    print(backup(parser.parse_args().destination))
