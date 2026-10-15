# Visual koleksi dan sumber

Pembaruan 13 Oktober 2026 menambahkan ikon dan ilustrasi pada landing, dashboard data, peta, daftar dokumen, filter topik, status sumber, empty state, serta formulir unggahan/JDIH. Kartu aksi sumber mempertahankan handler dan kontrol yang sama.

## Implementasi

- Ikon berasal dari Lucide 0.468.0 yang terpasang, disertakan lokal dengan lisensi ISC. `scripts/build_icons.mjs` meregenerasi 48 ikon native yang digunakan aplikasi.
- Ilustrasi tumpukan dokumen dibuat dengan CSS dan ikon SVG, diberi `aria-hidden`. Tombol peta tetap mempunyai label aksesibel.
- Peta memakai geometri dan statistik koleksi yang sudah tersedia. Grid koordinat mengikuti proyeksi dan zoom; kompas merupakan penanda orientasi dekoratif. Tidak ada titik atau distribusi data buatan.
- Aksen crimson, biru, violet dan hijau mengikuti identitas antarmuka. Kartu unggahan/JDIH memiliki hover ringan yang dinonaktifkan pada reduced motion.
- Stylesheet baru `app/static/collection-visual.css` dibagikan oleh landing dan workspace tanpa langkah build tambahan.

## Verifikasi

- Browser koleksi: 3 kelompok alur lolos dengan CSP aktif, tanpa error JavaScript. Memeriksa angka nyata, 38 provinsi, filter, keyboard, zoom/reset, navigasi, ekstraksi/unduh sumber, antrean JDIH, pemetaan wilayah, persistensi URL dan pemisahan statistik publik.
- Browser demo: 16 kelompok alur lolos, termasuk dropdown, seluruh menu, ekspor/impor, network, command menu, mobile/tablet dan reduced motion.
- Integrasi DOM: 56 pemeriksaan lolos.
- Syntax modul JavaScript dan `git diff --check` lolos.
- Tampilan koleksi diperiksa pada 360, 390, 768 dan 1440 piksel; screenshot desktop dan ponsel tersedia di `screenshots/collection/`, termasuk `source-channels.png`.

Pembaruan ini tidak mengubah backend, model data, hasil analisis hukum atau koneksi provider AI. Pengujian cloud live tidak dijalankan dalam tahap visual ini.
