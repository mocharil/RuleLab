# Strategi Revamp Legal Library — "cari, baca, pahami dalam satu layar"

Dokumen strategi; implementasi dan hasil audit ada di §10. Dasar analisis (17 Oktober 2026): audit read-only produksi (Cloud Run, 838 regulasi, 25.310 pasal/blok, Gemini) di 1440 px dan 390 px — memuat koleksi, membuka dokumen, membaca pasal, dan mencari pasal. Chat dan Compare tidak dijalankan di produksi karena memanggil model; keduanya dinilai dari kode (`app/static/gallery.js`, `library()`/`passageLibrary()` di `app.js`, `app/services/library_chat.py`, `retrieval.py`).

## 1. Kondisi sekarang

| Ukuran | Desktop 1440 px | Mobile 390 px |
|---|---|---|
| Tinggi halaman (koleksi) | 2.478 px | 4.612 px |
| Tinggi setelah membuka dokumen | 3.148 px | 5.770 px |
| Daftar koleksi mulai | 602 px | 829 px |
| Pembaca dokumen mulai | **1.969 px** (di bawah 12 kartu) | **3.144 px** |
| Asisten (chat) | kolom kanan, 602 px | 4.618 px (di bawah pembaca) |
| `GET /api/corpus` (dimuat saat **setiap** workspace dibuka) | 357 ms · **1,26 MB** · 838 dokumen | sama |
| Pencarian pasal `GET /api/search` | 2,7 detik · 12 hasil tetap | sama |

Urutan isi: hero "Legal library" + ilustrasi + 2 tombol → baris draft aktif ("Layanan Publik Digital… · Edit document") → tab *Document collection* / *Search articles* → strip angka → kartu koleksi (12 per halaman, 70 halaman) → pembaca (di bawah kartu) → panduan lipat; asisten di kolom kanan.

Tidak ada error JavaScript atau overflow; semua kontrol baca merespons.

### Masalah yang terlihat

| # | Masalah | Bukti |
|---|---|---|
| 1 | **Pembaca jauh dari daftar** | Klik kartu → pembaca muncul ±1.400 px di bawahnya; untuk memilih dokumen lain harus menggulir kembali ke atas. Di mobile pembaca ada di bawah 12 kartu dan pager. |
| 2 | **Kerangka memakan layar pertama** | Hero + ilustrasi, baris draft aktif (tidak relevan untuk membaca hukum), tab, dan strip angka: konten baru mulai ±600 px. |
| 3 | **Dua kotak cari terpisah** | Tab *Document collection* mencari judul/nomor di browser; tab *Search articles* mencari isi pasal di server. Pengguna harus tahu bedanya. |
| 4 | **Hasil pencarian pasal tidak informatif** | Setiap hasil hanya label "PP 96/2012 · Article 42" yang dilipat — tanpa judul peraturan, cuplikan, atau sorotan kata; maksimal 12 hasil, tanpa "lebih banyak". |
| 5 | **Urutan koleksi tidak berguna** | Halaman pertama menampilkan PERPPU 2005–2022 (urutan internal); 70 halaman tanpa urutan terbaru/relevansi. |
| 6 | **Memuat seluruh korpus ke browser** | 1,26 MB metadata 838 dokumen diunduh setiap kali workspace dibuka (untuk kartu, pilihan konteks chat, dan Compare) — makin berat setiap kali scraper menambah data. |
| 7 | **Navigasi di dalam dokumen lemah** | Hanya dropdown "Pasal" + panah; tidak ada daftar isi, cari-di-dokumen, atau kutipan siap salin. "All articles" membuka dialog terpisah. |
| 8 | **Konteks chat 839 pilihan** | Dropdown "Chat context" berisi semua dokumen; konteks sebenarnya sudah otomatis mengikuti dokumen yang dibuka. |
| 9 | **Istilah & angka tidak konsisten** | "838 documents in the collection" vs "838 official regulations"; "25310" tanpa pemisah ribuan; "690 pages need OCR" vs dashboard "45 documents need OCR". |
| 10 | **Compare terpisah dari bacaan** | Dialog dengan dua dropdown 838 dokumen; tidak bisa memulai dari pasal yang sedang dibaca. |
| 11 | **Panduan lipat di bawah halaman** | Pola yang sudah dihapus di menu lain. |

## 2. Tujuan

1. **Satu layar untuk cari → baca → tanya.** Daftar, pembaca, dan asisten berdampingan; memilih dokumen tidak memindahkan halaman.
2. **Satu kotak cari** untuk dokumen dan isi pasal, dengan hasil yang langsung bisa dinilai (judul, cuplikan, sorotan).
3. **Cepat walau korpus terus bertambah:** daftar dan pencarian di server, tidak ada unduhan 1,26 MB saat membuka workspace.
4. **Pembaca yang layak untuk teks hukum:** daftar isi pasal, cari-di-dokumen, kutipan siap salin, navigasi keyboard.
5. **Selaras dengan menu lain:** header ringkas, tanpa ilustrasi dekoratif atau panduan lipat, angka konsisten.

## 3. Prinsip

- **Dokumen di tengah.** Daftar dan asisten membantu; teks hukum adalah konten utama.
- **Setiap hasil menunjukkan alasannya** (cuplikan dengan kata yang cocok).
- **Konteks terlihat, bukan dipilih dari 839 opsi.** Asisten menyebut dokumen/pasal yang dipakai sebagai konteks dan bisa diperluas ke seluruh koleksi dengan satu klik.
- **Sumber selalu dapat diverifikasi:** halaman PDF, SHA256, tautan resmi, mode berdampingan dengan file asli tetap ada.

## 4. Tata letak baru

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Legal library   838 regulations · 25.310 articles · original snapshots       │
│ [🔍 Search regulations or article text…        ] (Documents | Articles) [Compare]│
├─────────────────────┬──────────────────────────────────────┬─────────────────┤
│ RESULTS  Type ▾ Sort▾│ UU 25/2009 · Pelayanan Publik       │ ASSISTANT        │
│ ● UU 25/2009        │ Pasal 4 of 64  ‹ ›   [Find in doc]   │ Context: UU 25/  │
│   Pelayanan Publik  │ ┌ Contents ┐  (1) Penyelenggaraan…   │ 2009 · Pasal 4 ×│
│ ○ PP 96/2012        │ │ Pasal 1  │  a. kepentingan umum;   │ “Apa maksud…”   │
│   Pelaksanaan…      │ │ Pasal 4 ●│                         │ [answer + quote]│
│ ○ Perda Kab. 5/2024 │ └──────────┘  [Ask] [Copy citation]  │                 │
│ … Load more         │  Formatted | Split | Original PDF    │ [message…] Send │
└─────────────────────┴──────────────────────────────────────┴─────────────────┘
```

### 4.1 Header & pencarian
- Judul + satu baris angka (format ribuan konsisten) + satu kotak cari dengan pilihan **Documents / Articles** dan tombol **Compare**. Hero, ilustrasi, baris draft aktif, tab lama, dan panduan lipat dihapus.
- *Documents*: cari judul, nomor, tahun, wilayah (server, berbagi endpoint dengan Data dashboard); filter jenis & tahun; urut **Terbaru / Relevansi / Judul**.
- *Articles*: pencarian isi pasal; setiap hasil menampilkan jenis/nomor/tahun, **judul peraturan**, **cuplikan dengan sorotan kata**, dan halaman; tombol **Load more**.

### 4.2 Pembaca (tengah)
- Kepala dokumen ringkas (jenis/nomor/tahun, judul, status versi, tanggal diundangkan, OCR) — status & provenance di panel lipat.
- **Daftar isi pasal** (bisa dilipat) dengan pencarian di dalam dokumen; posisi "Pasal 4 dari 64"; ←/→ untuk pasal sebelum/sesudah.
- Teks pasal terformat (ayat, huruf, angka, istilah terdefinisi — formatter yang ada) dengan sorotan kata dari pencarian.
- Aksi per pasal: **Ask about this article**, **Copy citation** ("Pasal 4 UU 25/2009 tentang Pelayanan Publik"), **Compare with…**, dan mode **Formatted / Split / Original** yang sudah ada.

### 4.3 Asisten (kanan)
- Rail yang bisa dilipat (perilaku sekarang dipertahankan). Dropdown 839 opsi diganti **chip konteks** ("UU 25/2009 · Pasal 4 ×"); × = seluruh koleksi.
- Transkrip, kutipan terverifikasi, follow-up, batasan — tetap; tombol "Open article context" membuka pasal itu di pembaca tengah (bukan dialog).

### 4.4 Compare
- Dimulai dari pasal yang sedang dibaca (sumber A terisi otomatis); sumber B dipilih lewat kotak cari dokumen + pasal; hasil tampil di pembaca sebagai mode **Compare** berdampingan dengan relasi hirarki dan temuan (demo: hirarki & teks; live: analisis Gemini — perilaku server tidak berubah).

## 5. Mobile
- Kotak cari + pilihan Documents/Articles di atas; daftar hasil → ketuk → pembaca layar penuh dengan tombol kembali (pola Verify sources).
- Daftar isi sebagai lembar bawah; asisten sebagai lembar bawah (pola Insights).
- Target: hasil pertama terlihat di layar pertama; pembaca terbuka tanpa menggulir melewati daftar.

## 6. Data dan teknis
- **Berhenti memuat `/api/corpus` saat startup.** Daftar dokumen memakai `GET /api/data/documents` (sudah ada: cari, jenis, tahun, urut, paginasi) — ditambah urutan relevansi dan field `title` cukup. Angka header dari `/api/status`. Pilihan Compare & konteks chat memakai pencarian server.
- **Pencarian pasal** `GET /api/search`: tambah `offset` untuk *Load more* dan sertakan judul peraturan; cuplikan & sorotan dihitung di front-end dari teks pasal yang sudah dikembalikan.
- Dokumen tetap dimuat per buka (`GET /api/corpus/{id}`, 80–170 KB).
- URL menyimpan mode cari, kueri, dokumen, pasal, mode baca (sebagian sudah ada).
- Tidak ada perubahan pada `library_chat` (verifikasi kutipan, batas riwayat) maupun `compare` di server.

## 7. Implementasi bertahap

| Fase | Isi | Estimasi |
|---|---|---|
| 1. Kerangka & data | Header ringkas, hapus hero/baris draft/tab lama/panduan; daftar dokumen dari server; berhenti memuat `/api/corpus` saat startup (perbarui Compare, konteks chat, pill korpus) | 1 hari |
| 2. Tata letak 3 kolom | Daftar | pembaca | asisten; memilih dokumen tidak menggulir; mobile list → reader → sheet | 1 hari |
| 3. Pencarian terpadu | Documents/Articles dalam satu kotak, hasil pasal dengan judul + cuplikan + sorotan + Load more | 0,5–1 hari |
| 4. Pembaca & asisten | Daftar isi + cari-di-dokumen, ←/→, copy citation, chip konteks, Compare dari pasal | 1 hari |
| 5. QA | Audit klik & alur (demo lokal termasuk chat & compare), 360–1440 px, tes browser/DOM/backend | 0,5 hari |

**Kriteria selesai**
- Memilih dokumen membuka pembaca di layar yang sama (desktop) atau layar penuh (mobile) tanpa menggulir melewati daftar.
- Startup workspace tidak lagi mengunduh `/api/corpus`.
- Setiap hasil pencarian pasal menampilkan judul peraturan dan cuplikan yang menyorot kata yang dicari.
- Chat, kutipan, mode Original/Split, unduhan sumber, dan Compare tetap berfungsi.
- Audit klik & alur lulus; tanpa overflow; tes proyek lulus.

## 8. Risiko

| Risiko | Mitigasi |
|---|---|
| Banyak bagian app memakai `S.corpus` (Compare, konteks chat, restore dokumen dari URL, pill) | Inventaris pemakaian di fase 1; ganti satu per satu dengan endpoint server; tes Compare & reload |
| Elasticsearch lambat (2,7 detik) | Tampilkan status "Searching…" dan hasil bertahap; optimasi indeks di luar cakupan revamp UI |
| Tes lama merujuk `.gallery-card`, `#gallery-search`, `.library-tabs`, `#search-q` | Pertahankan ID kunci bila memungkinkan; perbarui tes dalam fase yang sama |

## 9. Keputusan yang dibutuhkan

1. **Tata letak 3 kolom** (daftar | pembaca | asisten) menggantikan kartu bertumpuk di atas pembaca? — rekomendasi: **ya**.
2. **Satu kotak cari** dengan pilihan Documents / Articles menggantikan dua tab? — rekomendasi: **ya**.
3. **Berhenti memuat seluruh korpus saat startup** (daftar & pilihan dari server)? — rekomendasi: **ya**.
4. **Urutan pengerjaan**: semua fase, atau mulai dari Fase 1–2?

Keputusan (17 Oktober 2026): 1 ya, 2 ya, 3 ya, 4 semua fase.

## 10. Implementasi dan audit (17 Oktober 2026)

**Perubahan**
- **Backend:**
  - `GET /api/data/documents` kini menerima `sort=relevance` (nomor/tahun yang cocok persis dan kata judul diutamakan) dan mengabaikan kata *nomor/no/tahun* serta garis miring (`25/2009`).
  - Endpoint baru `GET /api/corpus/index` berisi daftar ringkas id/label/judul/jumlah pasal untuk pemilih Compare.
  - `GET /api/search` menyertakan `regulation_title` dan menerima `limit` sampai 60.
  - `GET /api/corpus` tetap tersedia sebagai API, tetapi tidak lagi dipanggil saat startup.
- **Frontend** (`gallery.js` ditulis ulang, `library.css` baru):
  - **Kerangka:** header ringkas dan satu kotak cari dengan tombol Documents/Articles (ID lama `#library-tab-*`, `#search-q`, `#search-form` dipertahankan). Hero, baris draft aktif, tab lama, dan panduan lipat dihapus.
  - **Kolom hasil:**
    - Dokumen dari server, 20 per halaman dengan *Load more*. Filter jenis dan urutan *Newest / Best match / Title*; best match otomatis saat ada kueri.
    - Hasil pasal menampilkan judul peraturan, cuplikan dengan sorotan kata, dan tombol Ask; *Load more* sampai 60.
  - **Pembaca:**
    - Navigasi: posisi "n of N", panah dan tombol ←/→, daftar isi dengan pencarian di dalam dokumen (menutup otomatis setelah pasal dipilih).
    - Kata yang dicari ikut disorot di pembaca. Mode Formatted / Side by side / Original tetap tersedia.
    - Tombol *Copy citation* dan *Compare with…* (sumber A = pasal yang sedang dibaca).
    - Unduhan file asli dan JSON, tautan sumber resmi, serta jejak provenance.
  - **Asisten:** chip konteks (dokumen terbuka ×, atau *Use UU …*) menggantikan dropdown 839 opsi. Kutipan "Open in reader" membuka pasal di pembaca, bukan di dialog.
  - **Responsif:** di ≤1100 px asisten menjadi panel melayang dengan tombol *Ask the assistant*; di mobile daftar → pembaca dengan tombol *Results*, dan asisten sebagai lembar bawah.
  - **URL:** mode, kueri, dokumen, dan pasal tersimpan di URL (reload menjalankan ulang pencarian pasal).
- **Dihapus:**
  - Kartu galeri, pagination 12 kartu, dan dialog "All articles" (aksi `law`).
  - `corpusOverview`, pemuatan `/api/corpus` saat startup, dan `S.corpus`.
  - ±160 selector CSS galeri lama.

**Bug yang ditemukan dan diperbaiki saat audit**
- Panel daftar isi tetap terbuka setelah pasal dipilih dan menutupi tombol *Compare with…*. Kini panel menutup otomatis.
- Kueri pencarian belum tersimpan di URL.
- Kolom pembaca terlalu sempit di 1440 px. Kolom hasil dan asisten dipersempit (280/300 px) dan padding ayat diringankan, sehingga baris teks sekitar 60 karakter.
- Dropdown *Type* tergantikan saat daftar selesai dimuat, sehingga pilihan yang sedang dibuka hilang. Kini hanya daftar (`[data-lib-list]`) yang digambar ulang.
- Satu kotak cari dipakai kedua mode: kueri pasal terbawa ke mode Documents. Ini perilaku yang disengaja, dan tes kini mengosongkan kotak cari sebelum memfilter jenis.
- **Performa:** cache inventaris dokumen selalu meleset karena kuncinya memakai ukuran dan waktu file SQLite/WAL, yang berubah saat checkpoint walau tidak ada tulisan. Kunci baru adalah `COUNT(*)` + `SUM(octet_length(payload))` untuk SQLite maupun PostgreSQL (±2 ms), dengan batas umur 300 detik. `/api/data/documents` saat cache hangat turun dari ±450 ms ke ±7 ms, dan `overview()` ke ±12 ms.

**Audit end-to-end**: 52 dari 52 pemeriksaan lolos (demo lokal, termasuk chat dan Compare), mencakup:
- Startup tanpa `/api/corpus`, daftar dari server, *Load more*.
- Pencarian "UU 25 tahun 2009" → UU 25/2009 di urutan pertama.
- Dokumen terbuka tanpa menggulir; posisi dan daftar isi; ←/→; cari di dokumen.
- Copy citation, side by side, Ask, jawaban dengan kutipan, kutipan → pembaca.
- Chip konteks, Compare dari pasal, unduhan.
- Mode Articles mempertahankan pembaca dan chat; hasil dengan sorotan, *Load more*, sorotan di pembaca.
- Back/Forward/reload, lipat asisten, tur bantuan.
- 2 mode × 5 lebar layar tanpa overflow; mobile daftar → pembaca → lembar asisten → kembali.
- Baris Data dashboard → pembaca; tanpa error JS.

**Tes yang diperbarui**:
- `tests/test_library.py` (baru, 3 tes).
- `scripts/browser_library.cjs`: hasil server, Compare dari header, paginasi server tanpa unduhan korpus. Server tes kini juga mengosongkan `DATABASE_URL` dan `RULELAB_SOURCES_BUCKET`.
- `scripts/dom_workspace_ux.cjs`, `browser_demo.cjs` (kutipan kini dicek membuka pembaca, bukan dialog), `browser_smoke.cjs`.

**Hasil akhir:**
- pytest `test_collection` + `test_overview` + `test_library`: 24 lolos.
- DOM: 57 lolos.
- `browser_library`, `browser_demo`, `browser_smoke`, `browser_collection`: lolos.
- Audit library: 52/52. Audit Data dashboard: 62/62.

Panduan pengguna (§4) ikut diperbarui.
