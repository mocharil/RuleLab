# Pustaka hukum terpadu

Catatan tahap berikutnya: navigasi terbaru memiliki lima menu dengan Aktivitas terpadu. Lihat [ACTIVITY_MERGE_QA.md](ACTIVITY_MERGE_QA.md). Catatan di bawah mendokumentasikan pengujian pada tahap ini.


> Laporan tahap sebelumnya. Navigasi terbaru memiliki enam menu utama setelah penggabungan Studio kebijakan; lihat [STUDIO_MERGE_QA.md](STUDIO_MERGE_QA.md).

Galeri dokumen dan Pustaka regulasi digabung menjadi satu tujuan pada sidebar serta menu cepat. Workspace sekarang memiliki delapan menu utama. Halaman Pustaka hukum memakai header, warna dan ilustrasi bersama yang sudah digunakan aplikasi.

| Bagian | Kemampuan |
| --- | --- |
| Koleksi dokumen | Cari judul/nomor/tahun, filter jenis, pagination 12 dokumen, pembaca pasal, metadata/jejak sumber, seluruh pasal, unduhan sumber dan JSON, asisten dengan kutipan |
| Cari isi pasal | Cari frasa pada seluruh korpus, pintasan topik, kutipan sumber, buka hasil di pembaca, tanyakan pasal ke asisten |
| Header | Bandingkan dua pasal dan buka panduan dari kedua tab |

URL kanonis adalah `/workspace?view=library`; tab pencarian memakai `tab=passages`. `view=gallery` membuka koleksi dokumen, sedangkan `view=corpus` membuka pencarian pasal. Tautan lama tetap bekerja dan URL aktif dinormalisasi. Parameter `doc` dan `article` memulihkan konteks pembaca saat reload atau Back/Forward.

State pembaca, filter, pertanyaan, hasil pencarian dan percakapan dipertahankan saat berpindah tab dalam sesi halaman. Percakapan tidak disimpan di URL atau dianggap persisten setelah reload. Hasil pencarian menyimpan kata kunci yang benar-benar berhasil dicari; kegagalan query baru tidak mengganti label hasil lama. Perbandingan dimulai dari dokumen/pasal yang sedang dibaca bila tersedia.

## Verifikasi 13 Oktober 2026

- 4 kelompok uji khusus Pustaka hukum lolos dengan CSP produksi aktif: satu entri navigasi/alias URL, tab keyboard dan fokus, konteks pasal yang tepat, Back/Forward/reload, kegagalan pencarian, chat, perbandingan dan unduhan.
- Kedua tab diperiksa pada 360, 390, 768 dan 1440 piksel, tanpa overflow halaman. Fixture terisolasi berisi 13 rekaman menguji pagination tanpa mengubah korpus aplikasi.
- 17 kelompok alur browser demo, 3 kelompok koleksi/peta, 55 pemeriksaan DOM dan 11 tes komponen lolos. Jumlah pemeriksaan tur DOM berkurang satu karena kedua menu kini memakai satu tur Pustaka hukum.
- Build produksi React/TypeScript, syntax JavaScript/CSS dan `git diff --check` lolos.
- Capture seluruh workspace menghasilkan 22 layar desktop/mobile. Screenshot khusus ada di `screenshots/library/`; seluruh workspace di `screenshots/workspace-visual/`.

```bash
RULELAB_PYTHON=.venv/bin/python npm run test:library
RULELAB_PYTHON=.venv/bin/python npm run test:demo
RULELAB_PYTHON=.venv/bin/python npm run test:dom
RULELAB_PYTHON=.venv/bin/python npm run test:collection
npm run frontend:test
npm run frontend:build
```

Backend dan data sumber tidak diubah. Pengujian menggunakan demo lokal; akses cloud live dan kualitas interpretasi hukum tidak dinilai oleh uji penggabungan menu.
