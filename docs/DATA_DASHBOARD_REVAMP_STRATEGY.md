# Strategi Revamp Data Dashboard — "dari inventaris ke peta pengetahuan hukum"

Dokumen strategi; implementasi dan hasil audit ada di §10. Dasar analisis (17 Oktober 2026): audit read-only produksi (Cloud Run, 838 regulasi, 25.310 pasal/blok, provider Gemini) di 1440 px dan 390 px, klik semua kontrol yang tidak menulis data, waktu muat API, serta kode `app/static/collection-ui.js`, `collection.css`, `collection-visual.css`, dan `app/services/collection.py`.

## 1. Kondisi sekarang

| Ukuran | Desktop 1440 px | Mobile 390 px |
|---|---|---|
| Tinggi halaman | 3.800 px | 5.919 px |
| Peta mulai terlihat | ±880 px (layar kedua) | ±1.100 px |
| Daftar dokumen mulai | 2.204 px | 3.596 px |
| Kontrol interaktif | 40 | 40 |
| `GET /api/data/overview` | 2,2 detik · 524 KB (semua dokumen dikirim) | sama |
| Peta siap | ±3,7 detik | ±3,6 detik |

Urutan isi: header "Data dashboard" (judul + 2 tombol) → kartu hero kedua "Legal sources, seen more clearly" dengan ilustrasi → 4 statistik → filter (jenis, makna sebaran, tahun) → peta + panel wilayah → daftar 15 jenis regulasi → chip topik → strip kualitas → daftar dokumen (5 pertama) → panel antrean sumber (unggah/JDIH) → panduan lipat.

Semua kontrol merespons dan tidak ada error JavaScript atau overflow horizontal.

### Masalah yang terlihat

| # | Masalah | Bukti |
|---|---|---|
| 1 | **Angka menyesatkan sesaat** | Number ticker hanya beranimasi saat masuk viewport. Tangkapan layar menunjukkan "791 / 784 / 23.540 / 19 / 35" padahal datanya 838 / 838 / 25.310 / 21 / 38, dan "National 237–240 documents" padahal 658. Untuk dashboard data, angka yang sempat salah merusak kepercayaan. |
| 2 | **Dua hero, satu layar habis** | Header halaman + kartu "Indonesia regulation atlas" dengan ilustrasi memakai ±470 px sebelum data pertama; peta baru di layar kedua. |
| 3 | **Peta kurang informatif** | 658 dari 838 dokumen (79%) adalah nasional dan tidak tampil di peta; 17 dari 38 provinsi kosong tanpa penjelasan kesenjangan; di mobile peta Indonesia sangat kecil (±330×140 px). |
| 4 | **Dokumen hanya 5 pertama** | "Showing the first 5 documents. Narrow the filters" — tidak ada pencarian, urutan, atau halaman; 838 dokumen tidak bisa dijelajahi dari dashboard. |
| 5 | **API berat** | Setiap perubahan filter mengunduh ulang 524 KB berisi semua dokumen; makin berat seiring scraper menambah data. |
| 6 | **Insight penting tidak ada** | Tidak ada sebaran tahun (791 dari 838 dokumen terbit 2023–2026), kesegaran data (pengambilan terakhir 16 Okt, +66 dokumen hari itu), asal sumber (837 peraturan.go.id, 1 JDIH), atau proporsi perubahan (140 amandemen). |
| 7 | **Antrean sumber mendominasi bagian bawah** | Panel unggah/JDIH ±600 px meski antrean kosong; "Upload source" muncul 3× (header, kartu, alur); "Import my draft" (fitur draft) ikut di sini. |
| 8 | **Daftar jenis memuat baris nol** | 15 jenis ditampilkan, 4 bernilai 0. |
| 9 | **Istilah campur** | Topik "Informasi", "Partisipasi" tidak diterjemahkan, sementara yang lain berbahasa Inggris; makna sebaran ("Issuing region / Regulated coverage / Mentioned region") butuh penjelasan yang kini ada di catatan kecil di bawah peta. |
| 10 | **Panduan lipat di bawah halaman** | Pola yang sudah dihapus di Overview dan Policy Studio. |

## 2. Tujuan

1. **Angka yang bisa dipercaya sejak detik pertama.** Tidak ada nilai sementara; setiap angka bisa ditelusuri ke dokumennya.
2. **Jawab tiga pertanyaan dalam satu layar:** *Apa yang kita punya? Seberapa segar? Di mana celahnya?*
3. **Jelajahi seluruh koleksi** dari dashboard: cari, saring, urutkan, buka di Legal library.
4. **Cepat walau data terus bertambah:** ringkasan kecil, daftar dokumen dipaginasi di server.
5. **Selaras dengan Overview dan Policy Studio:** satu header ringkas, kartu dan tipografi yang sama, tanpa ilustrasi dekoratif yang memakan ruang.

## 3. Prinsip

- **Data dulu, dekorasi seperlunya.** Peta dan angka adalah konten utama.
- **Selalu sebut penyebut.** "21 dari 38 provinsi", "45 dari 838 perlu OCR", bukan angka lepas.
- **Nasional bukan "tidak di peta".** Dokumen nasional punya tempat visual sendiri, bukan hanya teks kecil.
- **Klik apa pun membawa ke dokumen.** Batang jenis, tahun, topik, provinsi → daftar dokumen yang tersaring.
- **Antrean terpisah dari koleksi.** Jelas mana yang sudah dipakai analisis, mana yang belum.

## 4. Tata letak baru

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Data dashboard                     Updated 16 Oct · 838 docs   [Add source ▾] │ header ringkas
│ [Overview] [Explore documents] [Data quality] [Source queue (0)]             │ tab
├──────────────────────────────────────────────────────────────────────────────┤
│ 838 regulations │ 25.310 articles │ 21/38 provinces │ 140 amendments │ 45 OCR │ KPI (tanpa animasi menyesatkan)
├───────────────────────────────────────────────┬──────────────────────────────┤
│  PETA  [Issuing ▾] [Type ▾] [2005–2026 ▬▬●]   │ NATIONAL 658 (79%)  ▇▇▇▇▇▇▇▇ │
│   choropleth + label jumlah provinsi teratas  │ Jawa Tengah 44 ▇▇▇           │
│   klik provinsi → panel kanan                 │ Jawa Barat 40  ▇▇▇           │
│                                               │ … 17 provinsi tanpa dokumen › │
├────────────────────────┬──────────────────────┴──────────────────────────────┤
│ Terbit per tahun ▁▁▂▅█▅▃ │ Jenis (tanpa baris nol)   │ Topik (terjemahan seragam)│
└────────────────────────┴───────────────────────────┴──────────────────────────┘
```

### 4.1 Tab Overview
- **Header ringkas**: judul, kesegaran data ("Updated 16 Oct 2026 · +66 docs that day"), dan satu tombol **Add source** (menu: Upload file / Add JDIH link). Kartu hero kedua dan ilustrasinya dihapus.
- **KPI strip** (5 angka dengan penyebut), angka final langsung tampil; animasi hitung hanya sekali dan singkat (≤600 ms) atau dimatikan untuk reduced motion.
- **Peta + panel peringkat**: peta lebih besar (lebar penuh kolom kiri, tinggi ±460 px desktop); label jumlah pada provinsi teratas; panel kanan menampilkan blok **Nasional** sebagai batang sendiri, lalu peringkat provinsi, lalu tautan **"17 provinces without documents"** (daftar celah). Klik provinsi → panel menampilkan kabupaten/kota + 5 dokumen teratas + "See all in Explore".
- **Filter dalam satu baris** di atas peta: makna sebaran (dengan tooltip penjelasan singkat), jenis, rentang tahun (slider 2 ujung).
- **Tiga grafik kecil**: sebaran tahun terbit (histogram yang bisa diklik), jenis regulasi (tanpa baris nol, dikelompokkan Nasional/Daerah), topik (label seragam bahasa Inggris).

### 4.2 Tab Explore documents
- Tabel penuh dengan **pencarian** (judul/nomor), **filter** yang sama dengan Overview (tersinkron), **urutan** (terbaru diambil, tahun, jumlah pasal), **paginasi server** 25 per halaman.
- Kolom: jenis + nomor/tahun, judul, wilayah, pasal, versi (asli/perubahan), status (teks tersedia / perlu OCR / ditinjau manusia), tanggal diambil.
- Klik baris → buka di Legal library (perilaku sekarang).

### 4.3 Tab Data quality
- Kartu: teks tersedia (793/838), perlu OCR (45), ditinjau manusia (0), checksum bermasalah (0), tanpa wilayah (0), amandemen (140), asal sumber (peraturan.go.id 837 · JDIH 1).
- Linimasa pengambilan per hari (13–16 Okt) agar pertumbuhan scraper terlihat.
- Setiap kartu bisa diklik → Explore dengan filter status itu.

### 4.4 Tab Source queue
- Panel unggah/JDIH sekarang pindah ke sini (dengan jumlah di label tab). Alur "Incoming → Recorded → Needs review" dan daftar antrean tetap. "Import my draft" dihapus dari halaman ini (sudah ada di Policy Studio → More dan Overview).

## 5. Mobile
- Header + tab menjadi baris geser; KPI 2 kolom.
- Peta: tinggi minimum 260 px, zoom awal ke Indonesia barat–tengah tidak dipaksa; panel peringkat di bawah peta; klik provinsi membuka lembar bawah.
- Explore: kartu per dokumen, bukan tabel.
- Target: KPI terlihat di layar pertama, peta ≤ 1 scroll.

## 6. Data dan teknis
- **API dipecah**:
  - `GET /api/data/overview` hanya ringkasan: KPI, provinsi, jenis, topik, sebaran tahun, kesegaran, asal sumber, tanpa daftar dokumen; perkiraan <30 KB.
  - Endpoint baru `GET /api/data/documents?q=&kind=&province=&mode=&start=&end=&status=&sort=&page=`, berisi dokumen terpaginasi dengan total.
- Sebaran tahun, asal sumber (host `source_url`), dan pengambilan per hari dihitung dari metadata yang sudah ada (`year`, `provenance.source_url`, `retrieved_at`); tidak ada data dummy.
- Peta tetap d3 + GeoJSON BIG yang sama; **landing page memakai komponen peta yang sama** (`mountCollection(..., {publicOnly:true})`), jadi perubahan peta diuji di landing juga.
- Number ticker: render nilai final di HTML; animasi opsional hanya untuk KPI di layar pertama.
- URL menyimpan tab, filter, provinsi, halaman (seperti sekarang untuk filter).

## 7. Implementasi bertahap

| Fase | Isi | Estimasi |
|---|---|---|
| 1. Kerangka & angka | Header ringkas, tab, KPI tanpa angka sementara, hapus hero kedua & panduan lipat | 0,5 hari |
| 2. Overview | Peta lebih besar + panel peringkat + celah provinsi, filter satu baris + rentang tahun, 3 grafik | 1–1,5 hari |
| 3. API + Explore | Ringkasan ringan, endpoint dokumen terpaginasi, tabel/kartu dengan cari-saring-urut | 1 hari |
| 4. Quality & Queue | Tab kualitas dengan linimasa pengambilan, antrean dipindah, istilah topik diseragamkan | 0,5–1 hari |
| 5. QA | Audit klik & alur (seperti Studio), 360–1440 px, landing map, tes browser/DOM/backend | 0,5 hari |

**Kriteria selesai**
- Tidak ada angka sementara yang salah di layar mana pun.
- KPI dan peta terlihat di layar pertama desktop; di mobile KPI di layar pertama.
- Seluruh 838 dokumen bisa dicari dan dibuka dari dashboard.
- `GET /api/data/overview` < 50 KB; perubahan filter < 1 detik pada data produksi.
- Audit klik & alur lulus; tanpa overflow; landing map tetap berfungsi.

## 8. Risiko

| Risiko | Mitigasi |
|---|---|
| Landing page berbagi komponen peta | Ubah lewat opsi `publicOnly`, uji landing di setiap fase |
| Endpoint ringkasan dipakai landing (`/api/public/collection`) | Pertahankan bentuk respons publik; tambahkan field, jangan hapus |
| Tes lama merujuk `.collection-*` | Pertahankan kelas utama bila memungkinkan; perbarui tes dalam fase yang sama |
| Data terus bertambah | Paginasi server dan ringkasan tanpa daftar dokumen |

## 9. Keputusan yang dibutuhkan

1. **Struktur tab** (Overview · Explore documents · Data quality · Source queue) menggantikan satu halaman panjang? — rekomendasi: **ya**.
2. **Explore documents** dengan pencarian + paginasi server (endpoint baru)? — rekomendasi: **ya**.
3. **Number ticker**: tampilkan angka final langsung (tanpa animasi), atau animasi singkat sekali hanya di KPI atas? — rekomendasi: **angka final langsung**, animasi singkat hanya di KPI atas.
4. **Urutan pengerjaan**: semua fase, atau mulai dari Fase 1–2 (dampak visual terbesar untuk demo)?

Keputusan (17 Oktober 2026): 1 ya, 2 ya, 3 ya (angka final, animasi singkat hanya di KPI atas), 4 semua fase.

## 10. Implementasi dan audit (17 Oktober 2026)

**Perubahan**
- **Backend** (`app/services/collection.py`, `app/main.py`):
  - `GET /api/data/overview` tidak lagi mengirim daftar dokumen. Responsnya kini memuat sebaran tahun, pengambilan per hari, situs sumber, jumlah amandemen, dan teks tersedia.
  - Endpoint baru `GET /api/data/documents` dengan cari, filter (wilayah mengikuti makna sebaran, status, topik, situs, hari), urutan, dan paginasi (5–100 per halaman).
  - Inventaris dokumen di-cache sampai jumlah atau ukuran korpus berubah. Di PostgreSQL, `octet_length` dibaca dari header TOAST.
- **Frontend:**
  - Modul baru `app/static/data-dashboard.js` dan `data-dashboard.css`: header dengan info kesegaran data, tombol **Add source** (menu), dan empat tab (Overview, Explore documents, Data quality, Source queue). KPI menampilkan angka final; animasi hitung 450 ms hanya sekali dan dilewati bila *reduced motion* aktif.
  - **Overview:** peta dengan panel peringkat (baris Nasional, 10 provinsi teratas, daftar provinsi tanpa dokumen) dan detail wilayah (kabupaten/kota, 5 dokumen terbaru, "See all in Explore"). Grafik tahun, jenis (Nasional / Daerah & desa, tanpa baris nol), dan topik yang bisa diklik.
  - **Explore documents:** chip filter aktif dan baris dokumen yang membuka Legal library.
  - **Data quality:** enam kartu dengan penyebut, pengambilan per hari, dan situs sumber. Setiap angka membuka daftarnya.
  - **Source queue:** antrean dengan badge jumlah di tab.
  - Tab, filter, wilayah, pencarian, urutan, dan halaman tersimpan di URL.
  - `collection-ui.js` kini hanya berisi peta landing publik (angka final, tanpa ticker), form sumber, dan helper peta bersama. Tautan landing membawa wilayah terpilih ke dashboard.
- **Dihapus:**
  - Hero kedua beserta ilustrasinya.
  - Panduan lipat di bawah halaman.
  - "Import my draft" di halaman data.
  - `renderCollectionStats` dan `renderNumberTicker` dari bundle framework.
  - ±100 selector CSS mati.
  - Penanda artwork landing yang sudah tidak dipakai.

**Bug yang ditemukan dan diperbaiki saat audit**
- Filter drill-down menumpuk: topik yang dipilih sebelumnya ikut aktif saat membuka kartu "Needs OCR", sehingga jumlah daftar tidak sama dengan angka yang diklik. Kini drill-down saling mengganti, sementara jenis, tahun, dan makna sebaran tetap.
- Saat dokumen wilayah selesai dimuat, panel wilayah diganti seluruhnya sehingga dropdown "Region" yang sedang dibuka ikut hilang. Kini hanya daftar dokumennya yang diperbarui.
- Baris "National" di panel peringkat ambruk karena item grid ber-`overflow: hidden` di dalam panel bertinggi maksimum.

**Audit end-to-end**: 62 dari 62 pemeriksaan lolos, mencakup:
- Ukuran dan kecepatan API.
- KPI bernilai final, peta 38 provinsi di layar pertama, baris Nasional, dan daftar celah.
- Provinsi → detail → Explore, URL dan reload.
- Clear all, paginasi, pencarian "96 2012", filter status, dan urut judul.
- Baris → Legal library.
- Grafik tahun, jenis, dan topik.
- Kartu kualitas, hari pengambilan, menu Add source (keyboard), unggah → antrean → lapisan peta → pratinjau, dan tab dengan tombol panah.
- Tanpa panduan lipat, 4 tab × 5 lebar layar tanpa overflow, KPI di layar pertama mobile.
- Landing (38 provinsi, angka final, tautan membawa provinsi) tanpa error JS.

**Tes yang diperbarui**:
- `tests/test_collection.py`: 2 tes baru, ringkasan ringan dan endpoint dokumen.
- `scripts/browser_collection.cjs`: tab, menu Add source, antrean di tab sendiri, `.dd-row`. Server tes kini juga mengosongkan `DATABASE_URL` dan `RULELAB_SOURCES_BUCKET`.
- `scripts/dom_workspace_ux.cjs`: modul `data-dashboard`.
- Tes komponen: tes `renderCollectionStats` dihapus bersama fungsinya.

Panduan pengguna (§3) dan `docs/DATA_DASHBOARD.md` ikut diperbarui.
