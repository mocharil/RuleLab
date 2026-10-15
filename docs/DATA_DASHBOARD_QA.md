# Dashboard data & landing map · hasil QA

Tanggal: 13 Oktober 2026. Menyambung template hukum, network besar dan perbaikan hackathon sebelumnya.

| Pemeriksaan | Hasil |
|---|---|
| `pytest tests -q` | 164 lolos, 1 gagal checksum sumber yang sudah ada pada baseline |
| `npm run frontend:build` | TypeScript dan build produksi lolos |
| `npm run frontend:test` | 11 tes komponen lolos |
| `npm run test:dom` | 56 pemeriksaan interaksi lama lolos |
| `npm run test:demo` | 16 kelompok alur seluruh menu lama dan layout lolos |
| `npm run test:collection` | 3 kelompok alur baru lolos; tidak ada JavaScript page error |

Tes koleksi memeriksa hitungan korpus aktual, enam dokumen nasional tidak disebar ke provinsi, perbedaan penerbit/cakupan/lokasi disebut, beberapa snapshot dihitung satu identitas, PDF scan ditandai perlu OCR, file rusak ditolak, duplikasi unggahan/tautan, persistensi, unduh bytes asli, URL pemerintah dan role/auth. Statistik publik tidak mengungkap judul atau isi antrean upload.

Browser memeriksa 38 polygon provinsi dari data BIG, bounds proyeksi sesuai Indonesia, keyboard, filter jenis, kategori belum terpetakan, zoom/reset, perpindahan landing ke dashboard, pembukaan dokumen dalam galeri, unggah/ekstrak/unduh sumber, pendaftaran JDIH tanpa fetch, sebaran antrean dan daftar kabupaten/kota, serta reload pilihan wilayah/lapisan. Landing dan dashboard diperiksa pada 360/390/768/1440px. Halaman landing juga diuji pada context tanpa bypass CSP: modul dan aset peta lokal berjalan.

Screenshot aktual: `screenshots/collection/`. Gambar antrean menggunakan sumber TXT dan tautan yang dimasukkan oleh skrip pengujian; bukan klaim bahwa peraturan daerah contoh tersebut telah ditemukan atau disahkan.

Satu kegagalan lama: `tests/test_data_ai.py::test_corpus_integrity`, hash file raw UU 25/2009 berbeda dari metadata, seperti paket sebelumnya. Dashboard kini juga memperlihatkan jumlah masalah checksum ini. Metadata provenance tidak ditulis ulang untuk menutupi ketidakcocokan.

Antrean upload/JDIH belum masuk korpus AI. Crawler otomatis, OCR otomatis, persetujuan sumber dan indexing merupakan tahap berikutnya, sebagaimana dijelaskan di UI dan [DATA_DASHBOARD.md](DATA_DASHBOARD.md). Google live dan pengambilan dokumen JDIH otomatis tidak diuji atau diklaim berjalan.
