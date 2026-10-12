# RuleLab 1.3 — mulai dengan SA JSON

Python 3.11+ diperlukan; 3.12 disarankan. Internet diperlukan saat pemasangan dependency dan penggunaan Gemini. Frontend produksi, enam regulasi publik, JSON extracted/enriched, dan rulebook legal sudah disertakan. Tidak perlu npm, scraping ulang, atau login SSO untuk menjalankan aplikasi.

1. Ekstrak ZIP lalu buka terminal pada folder `rulelab`.
2. Jalankan salah satu perintah berikut dengan lokasi SA JSON Anda.

**Windows (Command Prompt):**

```bat
start.bat "C:\kredensial\service-account.json"
```

**macOS/Linux:**

```bash
chmod +x start.sh
./start.sh --sa "/lokasi/service-account.json"
```

3. Buka **http://127.0.0.1:8000/workspace**, pilih **Pengaturan integrasi → Uji koneksi Gemini**. Setelah berhasil, buat draft, jalankan review/simulasi dari editor, lalu ekspor DOCX. Menu Galeri dokumen menyediakan reader dan bot edukasi. Panduan seluruh menu tersedia melalui tombol Panduan pengguna atau `docs/PANDUAN_PENGGUNA.md`.

Project ID dibaca dari JSON. Skrip memvalidasi key secara lokal dan menyimpan konfigurasi `.env`; isi private key tidak disalin ke konfigurasi maupun frontend. Jangan masukkan SA JSON ke chat, git, atau folder web publik. Saat menjalankan berikutnya, cukup `start.bat` atau `./start.sh` tanpa argumen.

SA harus mempunyai akses Vertex pada project tujuan; API `aiplatform.googleapis.com`, billing, kuota, dan model harus tersedia. Panduan lengkap dan pemecahan error: [SA_SETUP.md](docs/SA_SETUP.md). SA JSON saja belum membuktikan izin akses cloud; tombol uji menjalankan satu permintaan model berbayar.

## Elasticsearch opsional

RAG bawaan menggunakan SQLite FTS5/BM25. Semua fitur AI bisa berjalan dengan Gemini + SQLite. Untuk RAG hybrid BM25/vector melalui Elasticsearch lokal, pasang Docker Compose dan gunakan:

```bash
./start.sh --sa "/lokasi/service-account.json" --elastic
```

Perintah ini menjalankan Elasticsearch lokal, membuat embeddings corpus, memvalidasi indeks dan baru mengaktifkan konfigurasi Elasticsearch setelah berhasil. Embeddings memakai billing project. Jalankan berikutnya tanpa `--elastic`; container perlu tetap aktif. Di Windows, setelah `start.bat` melakukan setup SA, hentikan server dengan Ctrl+C, lalu gunakan terminal baru:

```bat
docker compose --profile elastic up -d elasticsearch
.venv\Scripts\python scripts\enable_elasticsearch.py
start.bat
```

## Verifikasi lanjutan

```bash
.venv/bin/python scripts/doctor.py --live
.venv/bin/python scripts/verify_live.py --full
```

Windows: ganti `.venv/bin/python` dengan `.venv\Scripts\python`. `--full` memakai database sementara dan contoh publik, sekitar 45 panggilan generasi ditambah embeddings jika Elasticsearch aktif; hasil dicatat pada `artifacts/live-verification.json`. Ini opsional dan berbayar. Untuk demo tanpa cloud: `./start.sh --demo`; di Windows gunakan `AI_PROVIDER=demo` pada `.env` lalu `start.bat` tanpa SA.

Simulasi netizen memakai persona sintetis, bukan opini masyarakat yang dikumpulkan. Corpus adalah contoh sumber dengan provenance; status konsolidasi, revisi dan putusan yang belum terverifikasi ditandai untuk pemeriksaan manusia. Penilaian AI merupakan bahan review, bukan penetapan sah/tidak sah peraturan.
