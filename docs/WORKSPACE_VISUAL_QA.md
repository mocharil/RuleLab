# Penyempurnaan visual seluruh workspace

Catatan tahap berikutnya: navigasi terbaru memiliki lima menu dengan Aktivitas terpadu. Lihat [ACTIVITY_MERGE_QA.md](ACTIVITY_MERGE_QA.md). Catatan di bawah mendokumentasikan pengujian pada tahap ini.


> Laporan tahap sebelumnya. Navigasi terbaru memiliki enam menu utama setelah penggabungan Studio kebijakan; lihat [STUDIO_MERGE_QA.md](STUDIO_MERGE_QA.md).

Pembaruan 13 Oktober 2026 menyatukan komponen visual sembilan menu, seluruh tab Simulasi, panel asisten Editor, serta dialog integrasi dan panduan pengguna. Aksi utama mempertahankan crimson; aksen kontekstual memakai biru, violet dan hijau. Ikon berasal dari Lucide lokal 0.468.0, dengan lisensi yang sudah disertakan.

| Menu | Visual dan komponen |
| --- | --- |
| Ringkasan | Hero naskah, empat statistik berikon, cuplikan draft nyata, kartu alur, review tanpa indikator perhatian buatan |
| Dashboard data | Header, ikon statistik, ilustrasi naskah, geometri peta, unggahan dan JDIH |
| Editor | Header naskah, panel pembukaan, tab asisten, fokus pasal, tampilan sebelum hasil tersedia |
| Pemeriksaan konflik | Ilustrasi pemeriksaan sumber, statistik temuan, panel dan status review |
| Simulasi dampak & publik | Ilustrasi perbandingan/jejaring, asumsi, statistik sintesis, panel percakapan/network/inspector, ikon zoom |
| Galeri dokumen | Ilustrasi belajar, sampul peraturan, panel asisten, reader dan hasil pencarian kosong |
| Pustaka regulasi | Ilustrasi sumber, statistik koleksi, kartu dokumen dan kontrol pencarian |
| Riwayat & review | Ilustrasi waktu/reviewer, statistik review dan penanda timeline |
| Operasi agen | Ilustrasi jejaring, lima kartu peran, brief, aktivitas dan tampilan sebelum proses |

`app/static/design.js` menyediakan badge, ilustrasi dan pengayaan visual bersama untuk modul native. `frontend/src/components/workspace.tsx` memakai struktur komponen yang sama pada React. `workspace-visual.css` memusatkan warna, ukuran, radius, responsivitas dan override terarah untuk aturan CSS lama. Ikon dekoratif serta ilustrasi diberi `aria-hidden` dan tidak menerima pointer. Label tombol, penanganan aksi, API dan angka hasil dipertahankan.

## Verifikasi

- Build produksi React/TypeScript dan 11 tes komponen lolos.
- 56 pemeriksaan DOM lolos: penyimpanan, validasi, menu, sumber, hasil dan percakapan.
- 17 kelompok alur browser demo lolos. Mencakup dropdown/keyboard/fokus, semua menu, review, ekspor/impor, simulasi, network, history, command menu dan reduced motion.
- Layout diperiksa pada 360, 390, 768, 1024 dan 1440 piksel. CSS flex lama yang membuat hero Ringkasan meluber sudah diperbaiki dan diuji ulang.
- 3 kelompok alur koleksi lolos: geometri/statistik, filter, ekstraksi/unduh unggahan, antrean JDIH, pemetaan, persistensi dan pemisahan data publik.
- Sembilan tampilan workspace dan panduan dirender dengan CSP produksi aktif. Seluruh 11 tautan daftar isi panduan memiliki target yang sesuai, termasuk Data & Peta.
- Capture akhir menghasilkan 22 layar pada 390/1440 piksel, tanpa error JavaScript atau overflow halaman. Screenshot awal/hasil proses berada pada `screenshots/workspace-visual/`.
- Syntax modul JavaScript dan `git diff --check` lolos.

## Menjalankan pemeriksaan

```bash
npm run frontend:build
npm run frontend:test
RULELAB_PYTHON=.venv/bin/python npm run test:dom
RULELAB_PYTHON=.venv/bin/python npm run test:demo
RULELAB_PYTHON=.venv/bin/python npm run test:collection
RULELAB_PYTHON=.venv/bin/python node scripts/capture_visual_polish.cjs
```

Runner browser menggunakan database demo sementara. Pengujian ini memverifikasi UI dan alur lokal; koneksi cloud live dan akurasi penilaian hukum tidak dinilai pada pembaruan visual. Backend tidak diubah pada tahap ini.
