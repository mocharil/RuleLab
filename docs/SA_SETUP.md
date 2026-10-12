# SA JSON, Gemini/Vertex dan RAG

## Jalur cepat

Ikuti [QUICKSTART](../QUICKSTART.md). `scripts/setup_vertex.py` memeriksa struktur service-account JSON, URI token Google dan RSA private key, mengambil project ID, lalu memperbarui `.env` secara atomik sambil mempertahankan konfigurasi lain. JSON tetap di lokasi lokal pilihan Anda. Server membaca key, meng-cache OAuth token, dan memperbaruinya setelah kedaluwarsa. Ubah konfigurasi saat server berhenti, lalu restart.

Konfigurasi default: `AI_PROVIDER=vertex`, `GOOGLE_CLOUD_LOCATION=global`, `GEMINI_MODEL=gemini-3.8-flash`, `SEARCH_BACKEND=sqlite`. Model dapat diganti dengan model structured-output yang tersedia pada akun. Embeddings Elasticsearch memakai `EMBEDDING_LOCATION=us-central1`, `gemini-embedding-001`, dimensi 768; region ini terpisah dari region generasi.

## Persiapan project Google Cloud

- Aktifkan billing pada project tujuan dan API `aiplatform.googleapis.com`.
- Berikan SA izin memanggil model, misalnya role **Vertex AI User** (`roles/aiplatform.user`) pada project tujuan. Permission inferensi adalah `aiplatform.endpoints.predict`.
- Pastikan project mempunyai akses model dan kuota. Jika organisasi melarang pembuatan key, alternatif ADC tersedia melalui konfigurasi server; launcher SA ditujukan untuk development lokal.
- Gunakan file JSON bertipe `service_account`, bukan OAuth client JSON. Jangan menyimpan kredensial pada static assets atau mengunggahnya melalui aplikasi.

Dokumentasi resmi yang diperiksa 12 Oktober 2026:

- [Quickstart dan prasyarat](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/start)
- [IAM model](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/access-control)
- [Model dan lokasi](https://docs.cloud.google.com/gemini-enterprise-agent-platform/resources/locations)
- [REST inference dan structured output](https://docs.cloud.google.com/gemini-enterprise-agent-platform/reference/models/inference)
- [Text embeddings](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/embeddings/get-text-embeddings)

Untuk project atau model lain:

```bash
.venv/bin/python scripts/setup_vertex.py --credentials "/lokasi/key.json" --project "project-tujuan" --model "model-tersedia" --location global
```

Pengaturan integrasi menampilkan status lokal terpisah dari hasil uji live. Membuka status tidak memanggil LLM. Tombol **Uji koneksi Gemini** mengirim satu permintaan structured output; Elasticsearch aktif menambahkan validasi indeks dan query embedding. Hasil hanya berlaku untuk konfigurasi/kredensial/corpus yang diuji, dan hilang setelah restart. Mode demo tidak pernah diberi status akses live.

## Pemecahan masalah

| Masalah | Tindakan |
| --- | --- |
| JSON/key tidak valid | Gunakan key service-account JSON yang lengkap; periksa lokasi file dan izin baca. |
| Authentication / 401 | Periksa key belum dicabut, waktu sistem, dan konfigurasi path; restart server. |
| IAM / 403 | Beri izin pada project tujuan dan pastikan policy organisasi mengizinkan pemanggilan model. |
| API belum aktif | Aktifkan Vertex API pada project tujuan. |
| Billing belum aktif | Aktifkan billing dan periksa status project. |
| Model / 404 | Periksa nama model, lokasi, ketersediaan akun; ubah model/lokasi lalu restart. |
| Kuota / 429 | Periksa kuota; kurangi `RULELAB_AI_CONCURRENCY` (default 5), coba lagi setelah jeda. |
| Timeout / koneksi | Periksa konektivitas ke Google; `RULELAB_AI_TIMEOUT` default 90 detik (10–600). |
| Output model tidak sesuai | Coba ulang atau ganti model structured-output; output parsial tidak diterapkan ke draft. |
| Indeks ES tidak cocok | Gunakan indeks baru lalu jalankan `scripts/index_elasticsearch.py`; dimensi/model/corpus harus sama. |

Kesalahan cloud ditampilkan dalam pesan terkontrol tanpa body mentah Google atau private key. Provider live yang gagal tidak berpindah diam-diam ke demo. Sibling task dibatalkan jika simulasi gagal; hasil parsial dan status kegagalan tetap dapat diperiksa pada trace agen.

## Elasticsearch dan Docker

`--elastic` pada launcher macOS/Linux hanya mengelola ES lokal tanpa kredensial di localhost:9200. Konfigurasi remote kustom tidak ditimpa. Untuk remote, isi `ELASTICSEARCH_URL`, auth dan nama indeks pada `.env`, lalu jalankan `scripts/index_elasticsearch.py` sebelum memilih `SEARCH_BACKEND=elasticsearch`.

Index builder memakai cache embedding dengan checksum seluruh teks + provider/model/project/region/dimensi. Teks panjang dibagi lalu vektor digabungkan; tidak dipotong diam-diam. Metadata indeks mencatat checksum corpus sehingga indeks usang ditolak saat probe. Builder menolak dimensi yang berbeda dan dokumen berlebih; pilih nama indeks baru untuk membangun ulang tanpa menghapus data lama.

Docker aplikasi tersedia lewat `compose.vertex.yaml`: jalankan setup SA dulu, kemudian `docker compose -f compose.yaml -f compose.vertex.yaml up --build`. File SA di-bind read-only. Path dan izin baca file untuk UID container perlu sesuai host. Docker/Windows/native cloud belum diuji pada lingkungan pengembangan ini; launcher lokal dan kontrak adapter diuji sebagaimana [TEST_REPORT](TEST_REPORT.md).

## Batas deployment

Konfigurasi tanpa login adalah untuk demo lokal, bind 127.0.0.1. Jangan expose ke internet tanpa konfigurasi autentikasi dan operasional yang dijelaskan pada [ENTERPRISE_OPERATIONS](ENTERPRISE_OPERATIONS.md). Gunakan satu worker untuk job workspace SQLite. Aplikasi ini belum merupakan deployment HA multi-tenant.
