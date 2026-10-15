# RuleLab

Workspace lokal untuk menyusun rancangan regulasi Indonesia, meninjau potensi konflik dengan sumber, mengeksplorasi dampak, dan mengekspor DOCX. Backend FastAPI; frontend React islands + modul JavaScript/CSS; database kanonis SQLite; Elasticsearch BM25 + vector sebagai pilihan RAG; Gemini API atau Vertex AI menggunakan service account/ADC.

## Aktivitas: hasil, review dan proses agen

Riwayat & review dan Operasi agen kini berada pada satu menu **Aktivitas**, dengan tab **Hasil & review** serta **Proses agen**. Kartu ringkasan memperlihatkan hasil tersimpan, hasil menunggu review, hasil dengan catatan, dan proses aktif pada rancangan terpilih. Jejak agen dan hasilnya saling terhubung; angka diperbarui saat proses selesai. Pilihan cakupan, alternatif B, asumsi dan filter tetap tersedia saat berpindah tab dalam sesi.

Header, ikon Lucide lokal, ilustrasi naskah, kartu status dan tampilan kosong mengikuti desain menu lainnya. URL `view=activity&tab=results|agents` mendukung reload dan Back/Forward; tautan `history`/`agents` tetap diterima. Verifikasi: [ACTIVITY_MERGE_QA.md](docs/ACTIVITY_MERGE_QA.md). Uji: `RULELAB_PYTHON=.venv/bin/python npm run test:activity`.

## Studio kebijakan: satu alur merancang dan mengevaluasi

Editor, Pemeriksaan konflik dan Simulasi kini menjadi satu menu **Studio kebijakan** dengan tahap **Rancang naskah**, **Periksa sumber**, dan **Uji dampak**. Proyeksi A/B, forum persona dan tinjauan terpadu tetap tersedia di Uji dampak. Sidebar melanjutkan tahap terakhir; menu cepat mengarahkan istilah lama ke tahap yang sesuai. Perubahan draft disimpan sebelum berpindah dan kegagalan menyimpan mempertahankan input serta tahap.

Workspace memiliki lima menu utama: Ringkasan, Studio kebijakan, Dashboard data, Pustaka hukum, dan Aktivitas. Aktivitas menyatukan hasil/review dengan pemantauan proses agen. URL Studio menggunakan `view=studio&stage=editor|analysis|simulation`; URL lama tetap bekerja. Verifikasi: [STUDIO_MERGE_QA.md](docs/STUDIO_MERGE_QA.md). Uji khusus: `RULELAB_PYTHON=.venv/bin/python npm run test:studio`.

## Pustaka hukum terpadu

Galeri dokumen dan Pustaka regulasi kini menjadi satu menu **Pustaka hukum**. Tab **Koleksi dokumen** menyediakan filter judul/jenis, pembaca, asisten, naskah asli dan JSON. Tab **Cari isi pasal** menelusuri frasa dalam seluruh koleksi, dengan pintasan membuka konteks naskah atau bertanya ke asisten. Perbandingan dua pasal tersedia pada header. Sidebar dan menu cepat memiliki satu tujuan sumber; tautan lama tetap diarahkan ke tab yang sesuai.

Pilihan dokumen/pasal dapat dipulihkan dari URL. State pembaca, filter, pertanyaan, hasil pencarian dan percakapan dipertahankan saat berpindah tab dalam sesi. Uji khusus dengan `RULELAB_PYTHON=.venv/bin/python npm run test:library`. Detail: [LIBRARY_MERGE_QA.md](docs/LIBRARY_MERGE_QA.md).

## Tampilan seragam seluruh workspace

Lima menu utama memakai header, ikon, kartu, jarak dan bentuk komponen yang sama. Ilustrasi naskah dan jejaring mengikuti fungsi menu; statistik, judul panel, tampilan kosong dan dialog memakai penanda visual dari Lucide lokal. Crimson menjadi warna aksi utama, dengan aksen biru, violet dan hijau. Navigasi dan isi halaman kini memakai keluarga ikon yang sama. Dekorasi disederhanakan pada ponsel dan gerak mengikuti reduced motion.

Panduan pengguna juga mengikuti gaya ini, dengan daftar isi yang mencakup Data & Peta. Verifikasi dan screenshot: [WORKSPACE_VISUAL_QA.md](docs/WORKSPACE_VISUAL_QA.md). Ambil ulang 22 screenshot aplikasi aktual dengan `RULELAB_PYTHON=.venv/bin/python node scripts/capture_visual_polish.cjs`.

## Dashboard koleksi & peta Indonesia

Landing page kini mempunyai peta interaktif dengan geometri 38 provinsi dari BIG. Menu **Dashboard data** memperlihatkan jumlah peraturan unik, dokumen/versi, pasal, distribusi jenis/topik, wilayah penerbit/cakupan/lokasi disebut dan kelengkapan sumber. Filter jenis, tahun dan wilayah dapat dipakai lewat peta atau dropdown; pemilihan dokumen membuka Pustaka hukum. Angka awal mengikuti koleksi nyata: enam peraturan nasional, 406 pasal/blok, tanpa koleksi daerah.

Unggahan sumber diekstrak dan disimpan dalam antrean; tautan JDIH dicatat sebagai menunggu pengambilan. File dapat ditinjau dan diunduh ulang; duplikasi diperiksa. Antrean dipisahkan dari korpus analisis dan tidak ditampilkan pada statistik publik. Crawler JDIH, OCR otomatis dan publikasi sumber ke korpus belum dijalankan pada tahap ini. Rancangan layar, perjalanan pengguna, kontrak metadata dan batas tahap: [DATA_DASHBOARD.md](docs/DATA_DASHBOARD.md).

Uji alur baru dengan `RULELAB_PYTHON=.venv/bin/python npm run test:collection`. Screenshot aktual tersedia pada `screenshots/collection/`.

Landing dan dashboard kini memakai ikon Lucide lokal, ilustrasi tumpukan naskah, warna lembut untuk statistik, grid koordinat dan kompas pada peta. Jenis peraturan, topik, dokumen dan status sumber memiliki penanda visual; jalur unggahan/JDIH dibuat sebagai kartu aksi. Elemen dekoratif tidak menambahkan angka atau lokasi baru. Detail validasi: [VISUAL_POLISH_QA.md](docs/VISUAL_POLISH_QA.md).

## Pembuat naskah terpandu & network lebih besar

**Rancangan baru** membuka katalog 15 jenis umum berdasarkan sumber resmi, form identitas yang mengikuti jenis peraturan, preview kerangka, dan checklist. Naskah baru memakai Bab/Pasal; naskah perubahan memakai Pasal I/II. Identitas, penutup, penjelasan dan lampiran tersimpan serta ikut diekspor ke DOCX. Landasan sektoral yang belum diisi tetap berupa placeholder. Pemetaan bentuk dan batas cakupan: [LEGAL_FORMS_RESEARCH.md](docs/LEGAL_FORMS_RESEARCH.md).

Forum menawarkan **8/16/24/32 agen** dan **2–5 putaran** untuk dua skenario. Default 24 agen × 4 putaran = 192 respons; maksimum 32 × 5 = 320. Network menampilkan enam kelompok isu, balasan yang tercatat, pencarian peran/nama, filter isu/lapisan, zoom/pan, fullscreen, dan replay. Persona adalah peran sintetis dengan profil berbeda, bukan responden survei. Mode live membatasi concurrency dan konteks percakapan; replay tidak memanggil AI ulang.

Jalankan `RULELAB_PYTHON=.venv/bin/python npm run test:forms-network` untuk memeriksa builder, ekspor, seluruh respons 32 agen, kontrol network dan layout 360–1440px. Hasil verifikasi terbaru: [FORMS_NETWORK_QA.md](docs/FORMS_NETWORK_QA.md).

## Perbaikan demo hackathon

Dropdown kini konsisten, dapat dicari dan dipakai lewat keyboard, termasuk pada dialog. Handler klik tidak lagi merender ulang halaman saat pengguna memilih field; dialog tertutup tidak menutupi tombol lain. Semua menu mendapat perbaikan spacing, kontrol, fokus dan tampilan mobile/tablet. Simulasi dapat dijalankan dari seluruh subtab; tinjauan terpadu memakai hasil tersimpan dan tidak mengarang angka atau sentimen sebelum proses dijalankan.

Pilihan draft tersimpan pada URL, reload serta Back/Forward mengikuti konteks, dan Ctrl/Cmd+S menyimpan naskah. Alur browser end-to-end baru tersedia lewat `npm run test:demo`, dengan screenshot aktual dan pemeriksaan layout 360–1440px. Detail perubahan, hasil tes, dan satu kegagalan checksum sumber yang sudah ada pada baseline: [HACKATHON_UX_QA.md](docs/HACKATHON_UX_QA.md).

## Paket 1.3: penyempurnaan UI dengan TasteSkill

Menerapkan [TasteSkill Redesign Skill](https://github.com/Leonxlnx/taste-skill/blob/main/skills/redesign-skill/SKILL.md) pada stack yang sudah ada: React, Radix, Tailwind, Motion dan modul native. Identitas merah putih, logo, rute dan sembilan menu dipertahankan.

Teks dan kontrol diperbesar, sidebar memiliki area scroll navigasi sendiri, dashboard menampilkan cuplikan rancangan aktif dari data nyata dan statistik tanpa kotak berulang, serta alur kerja dibuat sebagai daftar yang lebih ringan. Editor, galeri, sumber, chat dan social inspector memakai ukuran baca yang lebih jelas. Loading memakai skeleton dokumen dan progress indeterminate. Error validasi menetap di dekat field dengan aria-invalid/describedby sampai input diperbaiki; error workflow lain dapat ditutup.

Landing memakai halaman sumber asli UU 12/2011 dan tata letak fitur asimetris. Cuplikan produk ilustratif lama dihapus. Ikon native berasal dari data resmi Lucide versi yang sudah terpasang, dengan lisensi dan script regenerasi. Tipografi Manrope dipertahankan; Cormorant digunakan untuk judul naskah. Light theme tetap eksplisit sesuai arahan merah putih.

Validasi 1.3: **104 tes backend, 57 pemeriksaan DOM, 11 tes komponen, build produksi dan parser CSS/syntax lolos**. Kontras token utama 4,81–14,67:1; bukan audit aksesibilitas lengkap. Browser gagal startup, sehingga screenshot/layout terkini dan Lighthouse belum terverifikasi. Alur SA/Gemini dan dataset tetap tersedia. Lihat [audit dan perubahan UI](docs/TASTE_UI_AUDIT.md) serta [laporan tes](docs/TEST_REPORT.md).

## Riwayat paket 1.2: galeri dan bot edukasi hukum

Menu **Galeri dokumen** menampilkan enam regulasi publik dengan pencarian judul/nomor/tahun, filter jenis, reader pasal, naskah asli dan JSON enriched. Panel bot menjelaskan dokumen dengan bahasa sederhana dan kutipan bersumber. Tombol kutipan membuka konteks pasal lengkap, halaman dan SHA256. Nomor/tahun yang disebut eksplisit diprioritaskan atas pilihan konteks; dokumen/pasal yang tidak tersedia tidak dijelaskan dengan sumber lain.

Bot live memakai Gemini/Vertex dan pedoman legal yang sama dengan review; ID sumber dan teks kutipan diverifikasi server. Mode demo hanya menampilkan cuplikan asli dan dilabeli. Pertanyaan dan cuplikan dikirim ke provider saat live; riwayat percakapan hanya disimpan dalam memori sesi halaman. Pembuktian kutipan bukan sertifikasi kebenaran interpretasi hukum.

**Panduan pengguna** tersedia pada sidebar dan `http://127.0.0.1:8000/guide`, dapat diunduh sebagai Markdown, dan disertakan pada [docs/PANDUAN_PENGGUNA.md](docs/PANDUAN_PENGGUNA.md). Panduan mencakup sembilan menu, setup SA, alur demo/live dan checklist tes untuk Anda.

Validasi 1.2: **104 tes backend, 53 cek integrasi DOM dan 11 tes komponen lolos**, build React produksi serta syntax Python/JS/CSS. Kontrak bot Vertex diuji lewat fixture REST/auth. Google live dan rendering/screenshot browser terkini tetap belum diverifikasi di lingkungan ini. `scripts/verify_live.py --full` kini juga menguji bot; `npm run screenshots` mencakup galeri/reader/chat.

## Riwayat paket 1.1: setup SA dan alur Gemini siap dikonfigurasi

Mulai dari [QUICKSTART.md](QUICKSTART.md): Windows `start.bat "C:\kredensial\service-account.json"`; macOS/Linux `./start.sh --sa "/lokasi/service-account.json"`. Project dibaca otomatis dari JSON. Buka `http://127.0.0.1:8000/workspace`, lalu **Pengaturan integrasi → Uji koneksi Gemini**. Private key hanya dibaca di server lokal. Tanpa SSO untuk demo.

Paket menyertakan UI produksi, scraping publik/raw sources, JSON extracted/enriched, legal rulebook, draft/editor, review bersumber, simulasi dampak A/B, 30 reaksi persona sintetis dengan network opini, agent jobs/trace, dan ekspor DOCX. SQLite RAG langsung tersedia; opsi `--elastic` menyiapkan Elasticsearch lokal dan embeddings dengan Docker. Instalasi memakai `requirements.lock`.

Perbaikan 1.1: setup SA tervalidasi dan konfigurasi atomik, cache/refresh OAuth, Vertex responseSchema, region embeddings terpisah, batas concurrency/retry/timeout, diagnostik tanpa secret, readiness lokal versus uji live, validasi indeks dan cache embeddings, serta runner verifikasi cloud end-to-end. Panduan izin, billing, model dan error: [SA_SETUP.md](docs/SA_SETUP.md).

Validasi 1.1: **84 tes backend, 11 tes komponen, dan 38 cek integrasi DOM**. Alur Vertex end-to-end diuji memakai fixture REST/auth, bukan kredensial Google nyata. Uji cloud nyata dilakukan setelah SA tersedia; Windows, Docker/ES nyata dan screenshot browser versi terkini belum terverifikasi. Lihat [TEST_REPORT](docs/TEST_REPORT.md).

## Riwayat tampilan 1.0

Seluruh landing dan delapan menu menggunakan satu sistem desain baru: putih, neutral canvas, crimson untuk aksi penting, Manrope untuk antarmuka dan Cormorant Garamond untuk judul naskah. Layout berfokus pada pekerjaan dan sumber, dengan dekorasi yang dikurangi.

- Sidebar putih, pengelompokan menu, preferensi lipat; mobile memakai navigasi horizontal yang dapat digeser untuk seluruh menu.
- Dashboard berisi daftar rancangan, antrean review, jumlah sumber dan aktivitas dari data API.
- Editor memiliki mode fokus menulis, indikator pasal aktif, dan asisten review/simulasi/sumber/netizen/agen pada layar yang sama.
- Forum menampilkan network, transcript dan inspector opini/kutipan. Preview persona berasal dari konfigurasi backend; opini hanya tampil setelah proses dijalankan.
- Pustaka regulasi berbentuk daftar dokumen; riwayat dan trace agen dibuat lebih mudah dibaca.
- Command menu, panduan, empty/error/loading states konsisten dan reduced motion didukung.

Backend, Gemini/Vertex, JSON hasil scraping, RAG dan DOCX tetap tersedia. Tidak ada login/SSO baru. Bundle React + TypeScript + Tailwind + Radix + Motion disertakan, sehingga runtime tidak memerlukan npm atau CDN.

Validasi: **60 tes backend, 11 tes komponen dan 35 cek integrasi DOM lolos**, serta build produksi, parser CSS dan cek syntax. Verifikasi visual browser/screenshot versi 1.0 belum selesai karena browser tidak dapat berjalan pada lingkungan ini. Screenshot historis dalam paket tidak mewakili remake.

Dokumentasi: [sistem desain](docs/DESIGN_SYSTEM.md), [prompt desain](docs/DESIGN_PROMPT.md), [framework dan screenshot lokal](docs/COMPONENT_FRAMEWORK.md).

## Riwayat 0.8: navigasi, panduan, dan detail visual

- Sidebar desktop dapat dilipat menjadi ikon dan menyimpan pilihannya.
- Panduan cepat dan interaktif tersedia di delapan menu; buka tombol **?** pada header.
- Sorotan kontrol, navigasi langkah, fokus keyboard, dan tombol tutup/Escape.
- Transisi sidebar, perpindahan menu, hover, tab dan focus pasal lebih halus.
- Input draft tetap utuh ketika melipat sidebar atau membuka panduan; reduced motion didukung.

Validasi terbaru: **60 tes backend + 17 tes interaksi DOM lolos**. Tes browser visual versi 0.8 belum berjalan karena pembatasan startup browser pada lingkungan eksekusi. Skrip tes browser lengkap disertakan. Lihat [Workspace UX](docs/WORKSPACE_UX.md).

## Baru di 0.7.1: simulasi merah putih dengan node opini

Forum netizen sintetis dengan lima persona, tiga putaran interaksi untuk setiap rancangan A/B, node bercahaya, garis balasan, pengumpulan opini, konteks hukum RAG, zoom/pan, dan replay 1×/2×/4×. Tersedia di menu **Forum netizen AI** dan tab **Netizen** pada editor. Seluruh dashboard simulasi mempertahankan palet merah putih. Node persona membuka opini terbaru, satelit 1/2/3 membuka opini tepat pada putaran tersebut, dan node pusat membuka snapshot rancangan. Referensi policy dashboard hanya memandu interaksi graph, bukan mengganti identitas warna.

Demo hackathon langsung berjalan tanpa login/SSO dengan AI_PROVIDER=demo. Untuk persona Gemini/Vertex, gunakan konfigurasi server yang sama dengan fitur legal sebelumnya. Percakapan live membutuhkan 30 panggilan persona ditambah satu planner; mode demo memakai template lokal yang ditandai. Replay tidak membuat panggilan LLM baru. Lihat [panduan simulasi](docs/SOCIAL_SIMULATION.md).

Validasi 0.7.1: **60 tes backend** dan **56 pemeriksaan browser** (33 regresi + 23 simulasi sosial). Screenshot aplikasi yang berjalan tersedia di screenshots/v0.7.1. Kredensial live belum digunakan; kontrak Gemini, konteks putaran, sumber/balasan tidak valid, timeout dan pembatalan diuji melalui adapter tiruan. Opini sintetis bukan survei atau prediksi publik.

## Jalankan di Mac/Linux

Python 3.11 atau lebih baru. Dari folder ini:

```bash
./start.sh
```

Buka http://localhost:8000. Script membuat virtual environment, menginstal dependency, menyalin `.env.example` bila diperlukan, lalu menjalankan server. UI tidak memerlukan npm, bundler, CDN, atau koneksi internet. Install pertama memerlukan internet untuk dependency Python. Dataset sudah disertakan; tidak perlu scraping ulang untuk menjalankan demo.

Alternatif manual dan Windows:

```bash
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements.lock
cp .env.example .env
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Windows: gunakan `python`, `.venv\Scripts\activate`, dan `copy .env.example .env`.

## Yang sudah berfungsi

1. Membuat beberapa draft, mengedit judul, jenis, ruang lingkup, konsiderans, dan pasal.
2. Menyimpan versi immutable dengan optimistic locking; menyimpan riwayat analisis dan catatan review.
3. Menghasilkan draft dari brief. Demo menggunakan template layanan publik; Gemini menghasilkan isi dinamis berdasarkan evidence.
4. Memeriksa seluruh draft; menampilkan teks asal, potensi masalah, sumber, hierarki, kontra-argumen, pertanyaan review, serta usulan revisi.
5. Menerapkan satu usulan sebagai versi baru. Hasil lama tidak boleh menerapkan revisi ke versi baru.
6. Membandingkan dua pasal regulasi nyata. Demo hanya perbandingan sumber; analisis AI aktif di mode live.
7. Simulasi A/B: model akses dan biaya dari asumsi, sensitivitas ±10 poin, serta empat perspektif stakeholder.
8. Menerapkan teks alternatif B setelah ditinjau, kemudian memeriksa ulang.
9. Pencarian pasal, browsing corpus, download dokumen sumber dan JSON enriched.
10. Impor TXT, JSON DraftInput, DOCX, PDF berteks; ekspor draft DOCX, laporan review DOCX, atau JSON.

## Mode demo dan mode live

Default `AI_PROVIDER=demo` memakai aturan deterministik dan template. Tidak ada panggilan LLM. Semua hasil UI diberi label demo. Mode ini berguna untuk demonstrasi alur dan pengujian tanpa credential.

Gemini API key:

```dotenv
AI_PROVIDER=gemini
GEMINI_API_KEY=your-key
GEMINI_MODEL=your-available-model
SEARCH_BACKEND=sqlite
```

Gunakan model Gemini text yang tersedia pada akun Anda dan mendukung structured output. `.env.example` memuat default model dari dokumentasi yang diperiksa saat pembuatan, tetapi ketersediaan akun dan Vertex dapat berbeda. Model dapat diubah tanpa mengubah kode.

Vertex AI dengan SA JSON:

```dotenv
AI_PROVIDER=vertex
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=global
GEMINI_MODEL=your-available-vertex-model
SEARCH_BACKEND=sqlite
```

Aktifkan Vertex AI API dan beri service account izin yang sesuai, misalnya Vertex AI User. Letakkan SA JSON di luar repository. ADC juga didukung. Credential tetap di backend; UI hanya memperlihatkan provider/model. Tidak ada fallback diam-diam ke demo jika Gemini gagal. HTTP error, respons terpotong, output di luar schema, dan ID sumber yang tidak dikenal ditolak.

Restart server setelah mengubah `.env`. Uji nyata dengan credential milik Anda:

```bash
python3 scripts/verify_live.py
```

Script ini melakukan panggilan berbayar sesuai penggunaan provider. Mode live belum diuji menggunakan credential nyata pada paket ini. Pengujian kontrak memakai respons mock dan tidak membuktikan akses/kuota model akun Anda.

## Elasticsearch RAG

SQLite FTS5/BM25 sudah berfungsi lokal. Untuk Elasticsearch hybrid, dengan Docker dan RAM memadai:

```bash
docker compose --profile elastic up -d elasticsearch
```

Set provider Gemini/Vertex aktif untuk embeddings, kemudian:

```bash
python3 scripts/index_elasticsearch.py
```

Indexer membuat dense-vector mapping, mengisi pasal dan embedding, serta menyimpan cache embedding agar bisa dilanjutkan setelah terhenti. Sesudah selesai:

```dotenv
SEARCH_BACKEND=elasticsearch
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_INDEX=rulelab-clauses
EMBEDDING_MODEL=gemini-embedding-001
EMBEDDING_DIMENSIONS=768
```

Restart aplikasi. Retrieval menjalankan BM25 dan kNN, lalu menggabungkan ranking melalui reciprocal rank fusion (RRF) di aplikasi. Ini tidak membutuhkan fitur RRF berlisensi di server. Dukungan token API key, basic auth, dan CA tersedia melalui `.env`.

Contoh Docker Elasticsearch mematikan security khusus untuk localhost. Untuk layanan remote gunakan TLS dan authentication. Jika model/dimensi embedding berubah, gunakan nama indeks baru. Jika corpus berubah, lakukan reindex dan hapus indeks lama agar versi lama tidak ikut retrieval. Pengujian koneksi Elasticsearch nyata belum dilakukan di lingkungan pembuatan ini.

## Dataset yang disertakan

| Dokumen | Isi yang diindeks |
| --- | --- |
| UU 25/2009 Pelayanan Publik | 62 pasal dari HTML resmi Kemenkeu |
| PP 96/2012 Pelaksanaan UU Pelayanan Publik | 51 pasal dari PDF resmi Ditjen PP |
| UU 8/2016 Penyandang Disabilitas | 153 pasal dari PDF resmi Ditjen PP |
| UU 12/2011 Pembentukan Peraturan Perundang-undangan | 104 pasal naskah awal |
| UU 15/2019 Perubahan UU 12/2011 | 18 blok pasal termasuk Pasal I/II dan ketentuan pengganti |
| UU 13/2022 Perubahan Kedua UU 12/2011 | 18 blok pasal termasuk Pasal I/II dan ketentuan pengganti |

Total 406 pasal/blok. Angka pada UU perubahan bukan jumlah pasal mandiri, karena memuat penggantian pasal peraturan lain. Naskah awal, perubahan, dan lampiran tidak dicampur menjadi konsolidasi.

- `data/sources.json`: daftar sumber, metadata curated, jenis, nomor, tahun, tanggal, serta hubungan amends/implements.
- `data/raw/`: byte PDF/HTML asli dan attachment yang berhasil diambil.
- `data/extracted/`: text per halaman, SHA256, extraction method, dan halaman yang memerlukan OCR.
- `data/enriched/`: JSON per regulasi berisi pasal, paragraf/ayat yang terdeteksi, huruf, topik, aktor, jenis norma, rujukan, asal dokumen, halaman, dan review status.
- `data/corpus.json`: gabungan JSON enriched untuk seed DB.
- `data/manifest.json`: hasil ingest, sumber aktual, kualitas dan kesalahan pengambilan.

Enrichment saat ini berbasis aturan deterministik, bukan hasil Gemini yang diklaim telah divalidasi. Teks asli tidak diganti dengan ringkasan. Definisi bernomor Pasal 1 ditandai `definition_or_ayat`, agar tidak dipastikan sebagai ayat sebelum review.

**Masalah sumber yang ditemukan:** PDF resmi UU 25/2009 halaman 30 berlabel “Pasal 4” untuk bagian antara Pasal 47 dan 49. PDF tetap disimpan tanpa koreksi; canonical extraction memakai HTML resmi Kemenkeu yang memuat Pasal 48. Catatan ada pada `metadata.source_issues`.

**Batas ekstraksi:** UU 13/2022 mempunyai halaman lampiran scan tanpa text layer, ditandai `ocr_needed_pages`. Paket mempertahankan dokumen, tetapi tidak mengklaim sudah mengekstrak isi halaman scan tersebut. Parser menghentikan body sebelum signing/explanations agar contoh pasal dalam lampiran tidak dianggap sebagai norma mandiri. Blok perubahan masih perlu review batas penggantian dan ketentuan instruksi perubahan.

## Scraping dan pengembangan dataset

```bash
python3 scripts/scrape.py --offline
python3 scripts/scrape.py
python3 scripts/scrape.py --refresh
```

Offline mereproduksi JSON dari dokumen yang disertakan. Online mengambil sumber yang belum di-cache; `--refresh` mengunduh ulang dan mengarsipkan raw/JSON lama jika byte sumber berubah. Arsip berisi snapshot data, bukan konsolidasi legal. Scraper hanya HTTPS `.go.id`, maksimum 20MB/file, request berurutan dengan jeda. Tambahkan regulasi pada `sources.json` dengan metadata dan URL fulltext resmi, lalu jalankan scraper. Setelah corpus berubah, restart backend agar seed dan FTS diperbarui. Jalankan indexer ulang untuk Elasticsearch.

Scraper bukan crawler seluruh web, tidak mengambil konten di balik login atau melakukan bypass proteksi. Sumber yang gagal/HTML error tidak dimasukkan sebagai PDF. Timestamp unduh dan hash disimpan. Status berlaku belum diverifikasi melalui semua perubahan, pencabutan, dan putusan pengadilan.

## Pengujian

```bash
python3 -m pytest -q
```

Lihat `docs/TEST_REPORT.md` untuk cakupan dan keterbatasan aktual. Browser test tersedia pada `scripts/browser_smoke.cjs`. Opsional: `npm install`, `npx playwright install chromium`, lalu `npm run test:browser`. Browser test menjalankan server demo sementara dan database terpisah, sehingga tidak mengubah data workspace Anda. Dokumentasi API interaktif: http://localhost:8000/docs. JSON schema draft, output analisis, dan input simulasi ada di `docs/`.

## Batas MVP dan kelanjutan

- SQLite mempermudah run lokal. Untuk produksi multi-instance, pindahkan canonical storage ke PostgreSQL; skema dan boundary adapter dijelaskan dalam `docs/ARCHITECTURE.md`.
- Konflik hukum tidak diputuskan dari hierarki semata. Semua temuan perlu ruang lingkup, delegasi, pengecualian, versi, dan review ahli. Tidak ada sertifikasi “bebas konflik”.
- Simulasi berupa skenario akses/biaya dan perspektif sintetis, bukan MiroFish terintegrasi atau prediksi dampak masyarakat yang terkalibrasi. Persona bukan pengganti konsultasi publik.
- Ekspor adalah draft dan laporan pendukung, belum memastikan seluruh teknik penyusunan Lampiran II atau naskah akademik lengkap.
- Sebelum penggunaan organisasi: authentication/roles, review workflow, audit identitas reviewer, background jobs, OCR tervalidasi, konsolidasi temporal, corpus lebih luas, dan evaluation set berlabel ahli.
- Container dapat dijalankan di Cloud Run, tetapi SQLite membutuhkan strategi penyimpanan durable yang berbeda untuk deployment multi-instance. Paket ini belum dideploy ke cloud.

Demo 3 menit: buka seed layanan publik → periksa → jelaskan masalah kanal digital dan pengaduan → tampilkan sumber → simulasi 70% vs 94% dari asumsi contoh → tinjau revisi → ekspor DOCX. Angka tersebut adalah hasil model asumsi, bukan data warga Indonesia.


## Pembaruan 0.2 — konteks legal Indonesia

24 aturan terkurasi disimpan di `data/legal/rulebook.json`, dengan klasifikasi norma/teknik penyusunan/protokol aplikasi, sumber, locator dan SHA256. Ringkasan manusia ada di `docs/LEGAL_GUIDE.md`. Basis yang dibaca: UU 12/2011, UU 15/2019, UU 13/2022; ini bukan sertifikasi kelengkapan hukum per tanggal hari ini.

- Tombol **Pedoman legal** menampilkan aturan beserta sumber dan 35 kandidat instruksi perubahan.
- Gemini/Vertex menerima pedoman melalui system instruction pada analisis, generate draft, serta simulasi. Ini context engineering, bukan fine-tuning.
- RAG menambahkan blok perubahan terkait, versi dasar, dan Pasal II perubahan. Contoh UU 12/2011 Pasal 96 membawa ketentuan pengganti UU 13/2022 Pasal 96. Sistem tidak menggabungkan blok-blok itu menjadi teks berlaku secara otomatis.
- Analisis dapat memakai tanggal pilihan: `POST /api/drafts/{id}/analyze` dengan `{"as_of_date":"2022-06-15"}`. Sumber setelah tanggal itu tidak memenuhi syarat dukungan konflik. Pengundangan sebelum tanggal analisis tetap **tidak membuktikan** sumber belum dicabut, sudah berlaku, atau bebas putusan.
- Temuan LLM memakai `legal_rule_ids`, `evidence_quotes`, `norm_collision`, dan `legal_checks` (waktu, ruang lingkup, kewenangan, pengecualian, interpretasi alternatif). Kutipan palsu atau ID pedoman yang tidak ada ditolak. Dukungan tingkat/waktu atau pemeriksaan yang kurang lengkap menurunkan kategori konflik menjadi `coverage_gap`.
- Peringkat Permen tidak dipaksakan. Analisisnya memerlukan kewenangan/delegasi Pasal 8, bukan sekadar perbandingan angka.
- Laporan DOCX menyertakan versi pedoman, tanggal analisis, aturan yang digunakan dan peringatan validator.

API baca: `GET /api/legal/guide` dan `GET /api/legal/changes`.

### Perubahan dan konsolidasi yang bisa dilanjutkan

`scripts/extract_changes.py` mengambil instruksi terbatas dari PDF asli menjadi `data/legal/change_candidates.json`: kutipan instruksi, halaman, SHA256, jenis kandidat operasi, target pasal/ayat, dan referensi blok pengganti. Semua berstatus **pending**, tanggal berlaku terverifikasi kosong, `auto_apply=false`. Rerun scraping juga memperbarui kandidat. Parser belum lengkap untuk frasa, pencabutan, omnibus, penjelasan, lampiran scan, dan putusan.

`app/services/legal.py:apply_reviewed_change` merupakan fondasi mesin versi untuk unit yang sudah dinormalisasi (contoh `49/2`). Ini helper pengembangan, belum workflow konsolidasi/review lengkap di UI. Ia hanya menerima event yang diberi review eksplisit, sumber, target dan tanggal berlaku; memeriksa tingkat sumber dan urutan waktu; mempertahankan unit lain; menyimpan tombstone serta history. Tidak melakukan pencabutan berantai, tidak menerima operasi putusan/frasa yang belum didukung, dan tidak memberi cap hukum terkini. Penggantian unit yang masih memiliki subunit memerlukan penyusunan ulang melalui review khusus.

Pipeline lanjutan: scraping → ekstraksi instruksi kandidat → review target/unit/tanggal/teks → event immutable → replay versi pada tanggal analisis → retrieval versi yang telah ditinjau → verifikasi ketercakupan putusan/perubahan. Jangan menjalankan kandidat pending sebagai event reviewed.

```bash
python3 scripts/build_legal_guide.py
python3 scripts/extract_changes.py
python3 -m pytest -q
```

Builder pedoman menolak pengikatan ulang ke hash sumber yang berubah sampai ringkasan dan versi direview. Tambahkan uji gold standard dengan perancang/ahli hukum untuk mengukur false positive/negative. Tes saat ini memverifikasi aturan deterministik dan kontrak prompt, bukan peningkatan akurasi Gemini yang sudah diukur.


> Bagian desain 0.3–0.5 berikut adalah riwayat versi. Tampilan aktif 1.0 mengikuti sistem desain baru pada bagian awal dan docs/DESIGN_SYSTEM.md.

## Riwayat desain 0.3 — desain merah-putih

Seluruh antarmuka memakai desain putih dengan aksen crimson, panel lembut, sudut membulat dan navigasi frosted glass. Manrope digunakan untuk antarmuka, wordmark HTML dan teks pasal; Cormorant Garamond untuk judul besar. Font disertakan lokal dengan lisensi SIL Open Font License, sehingga tidak perlu koneksi ke Google Fonts saat memakai aplikasi.

- Logo baru: `app/static/brand/rulelab-logo-manrope-v2.png` (PNG transparan). Wordmark raster adalah hasil desain generatif; wordmark di antarmuka dirender dengan font Manrope asli.
- Tema aktif: `app/static/design.css`, stylesheet tunggal untuk workspace dan landing. Token warna, tipografi dan radius didefinisikan di `:root`.
- Ponsel memakai navigasi bawah, ikon SVG, safe-area padding, dan toast di atas navigasi. Tablet dan desktop memakai sidebar.
- Konten utama berbahasa Indonesia, fokus keyboard terlihat, serta dukungan reduced motion.
- Pedoman legal, Gemini/Vertex, Elasticsearch, versi draft, simulasi, impor dan ekspor DOCX menggunakan alur yang sama.

Panduan desain dan prompt pengembangan selanjutnya: `docs/DESIGN_SYSTEM.md`. Jalankan aplikasi dengan `./start.sh`, lalu buka `http://127.0.0.1:8000`.


## Riwayat desain 0.4 — visual seluruh menu dan loading

`/` membuka landing page; `/workspace` membuka ringkasan dengan lima pintasan. Gunakan `/workspace?view=editor` (atau `analysis`, `simulation`, `corpus`, `history`) untuk membuka menu langsung. Jalankan dengan `./start.sh`.

- Hero dokumen 3D merah-putih pada landing dan ringkasan; setiap menu memiliki ilustrasi SVG sesuai fungsi. Ilustrasi dekoratif tidak mewakili data atau hasil analisis.
- Skeleton saat data awal dimuat, dialog dokumen yang dipindai untuk operasi lambat, dan indikator proses tanpa persentase buatan. Dialog muncul setelah 180 ms untuk menghindari kedipan pada operasi cepat.
- Pencarian, analisis, simulasi, generasi, impor, ekspor, penyimpanan dan penerapan revisi memakai pengaman operasi tunggal. Formulir diblokir sementara dan aktif kembali pada sukses atau gagal. Kata kunci pencarian dipertahankan ketika gagal.
- Timeout browser: 45 detik untuk GET dan 180 detik untuk operasi lain. Timeout tidak membatalkan pekerjaan server; periksa riwayat sebelum mengulangi tindakan yang menulis data.
- Reduced motion mematikan animasi; fokus keyboard dipulihkan setelah proses selesai.

Implementasi saat ini: `app/static/ui.js`, `design.css`, `landing.html` dan komponen React. Validasi terbaru: 104 tes backend, 11 tes komponen dan 57 cek integrasi DOM; browser visual belum dapat dijalankan. Detail: `docs/TEST_REPORT.md`.


## Riwayat desain 0.5: editor dengan simulasi dan review terpadu

Editor memiliki panel asisten dengan tab **Simulasi**, **Review**, dan **Sumber**. Simulasi dan pemeriksaan dapat dijalankan tanpa pindah menu. Perubahan draft disimpan terlebih dahulu; hasil terikat pada versi yang tersimpan. Editor mempertahankan alternatif dan asumsi selama berpindah tab. Input skenario tidak dianggap sebagai perubahan teks draft.

- Simulasi inline menampilkan akses A/B, biaya, perubahan pemohon terlayani, perspektif pemangku kepentingan, mitigasi, sensitivitas, asumsi hasil dan batasan. Alternatif yang diterapkan adalah teks yang sudah disimulasikan dan ditinjau dalam dialog.
- Review inline menampilkan temuan, kutipan sumber, usulan pasal, validasi legal dan interpretasi alternatif. Mengubah draft menandai hasil lama dan menonaktifkan penerapan. Kegagalan simulasi mempertahankan teks dan asumsi untuk dicoba ulang.
- Tombol **Uji dampak** di header membuka panel asisten pada ponsel. Daftar pasal menyediakan pintasan menuju bagian naskah. Di desktop, panel asisten tetap terlihat dan dapat di-scroll terpisah.
- Analisis: filter tingkat temuan. Pustaka: ringkasan corpus, halaman OCR, kartu sumber dan filter jenis peraturan. Riwayat: ringkasan review, timeline, filter analisis/simulasi dan dialog hasil historis. Menu simulasi lengkap tetap tersedia untuk tinjauan lebih luas.
- Modul bersama `app/static/studio.js` menyediakan kontrol asumsi dan panel editor; `studio.css` menyediakan desain seluruh workspace. Tidak ada layanan backend baru atau angka dampak empiris yang ditambahkan.

Jalankan `./start.sh`, lalu buka `http://127.0.0.1:8000/workspace?view=editor`.

Validasi 0.5: **39 tes backend dan 29 pemeriksaan browser lolos**. Screenshot aktual desktop/ponsel tersedia di `screenshots/v0.5/`. Gemini/Vertex langsung masih memerlukan konfigurasi kredensial dan pengujian lokal.


## Pembaruan 0.6: enterprise workspace dan agent operations

Workspace menggunakan sidebar charcoal, aksen merah, tipografi Manrope untuk antarmuka dan struktur panel yang lebih ringkas. Editor tetap memiliki simulasi/review inline, kini ditambah tab Agents. Agent operations menyediakan brief eksekusi, lima peran spesialis, trace tool, bukti sumber, hasil dan riwayat job.

Backend agent menyimpan snapshot, rencana, peristiwa tool, hasil parsial, error dan status. Workflow dibatasi ke legal/impact/full; planner Gemini/Vertex tidak boleh memperluas cakupan. Mode demo tetap deterministik. Job memerlukan Idempotency-Key, membatasi satu job aktif per draft, mendukung pembatalan/timeout, dan menandai interupsi saat restart. Tidak ada penerapan revisi otomatis.

Named access keys mendukung admin/editor/reviewer/viewer, audit metadata, serta production startup dengan HTTPS origin allowlist. Mode development tanpa key tetap untuk localhost. Lihat **docs/ENTERPRISE_OPERATIONS.md** sebelum deployment: implementasi saat ini satu workspace, satu worker, satu instance, SQLite durable; belum SSO/multi-tenant/HA.

Validasi: **52 tes backend dan 33 pemeriksaan browser lolos**. Screenshot aktual terdapat di `screenshots/v0.6`. Kredensial live Gemini/Vertex, deployment production dan kualitas judgment legal belum diuji langsung.

Prompt desain merah putih yang dapat dipakai melanjutkan pengembangan: docs/DESIGN_PROMPT.md.
"# RuleLab" 
