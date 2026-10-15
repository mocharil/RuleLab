# Aktivitas terpadu dan konsistensi visual

Riwayat & review dan Operasi agen digabung menjadi satu menu **Aktivitas**. Hasil, review manusia dan proses agen bekerja pada rancangan yang sama sehingga pengguna dapat berpindah di dalam satu konteks.

| Menu utama | Isi |
| --- | --- |
| Ringkasan | Rancangan, sumber dan pekerjaan yang menunggu review |
| Studio kebijakan | Rancang naskah, Periksa sumber, Uji dampak |
| Dashboard data | Jumlah koleksi, peta distribusi dan antrean sumber |
| Pustaka hukum | Koleksi dokumen, Cari isi pasal, pembaca dan asisten |
| Aktivitas | Hasil & review, Proses agen |

## Perilaku dan visual

- Satu sidebar dan satu tujuan menu cepat; kata riwayat/hasil membuka Hasil & review, kata agen/eksekusi/trace membuka Proses agen. Sidebar melanjutkan tab terakhir dalam sesi.
- URL kanonis `view=activity&tab=results|agents`. URL lama `view=history` dan `view=agents` tetap diterima. Draft tetap terikat pada parameter `draft`.
- Menu aktif tetap terlihat pada navigasi horizontal ponsel.
- Tab memakai role tablist/tab/tabpanel, roving tabindex, ArrowLeft/Right/Home/End dan pemulihan fokus setelah perpindahan.
- Header hijau lembut, ilustrasi naskah/jejaring, ikon Lucide lokal, kartu ringkasan dan tampilan kosong mengikuti komponen bersama. Dekorasi tidak mewakili hasil atau angka tambahan.
- Empat angka berasal dari API: jumlah hasil pada rancangan, hasil menunggu review, hasil dengan catatan, dan eksekusi aktif. Total eksekusi tercatat ditampilkan sebagai keterangan.
- Polling memperbarui trace, status eksekusi, kartu ringkasan dan daftar hasil setelah proses selesai. Pembaruan tidak merender ulang form alternatif atau asumsi.
- Cakupan tugas, alternatif B, asumsi serta filter hasil dipertahankan saat berpindah tab dalam sesi. Reload memulihkan tujuan tab, rancangan dan hasil tersimpan, bukan input skenario yang belum disimpan.
- Hasil agen membuka modal rincian yang sama dengan hasil historis. Catatan reviewer dan versi naskah tetap tersedia.
- Viewer dapat meninjau dan menyegarkan trace; menulis catatan review dan menjalankan agen tetap dibatasi. API tetap menjadi penegak otorisasi.

## Verifikasi

Semua verifikasi berikut dijalankan pada database sementara dengan provider **demo** dan retrieval SQLite. Tidak mengklaim pengujian Gemini live.

| Pemeriksaan | Hasil |
| --- | --- |
| Build TypeScript/Vite | Lulus |
| Komponen React | 11 tes lulus |
| Aktivitas dengan Chromium dan CSP produksi | 4 kelompok lulus: routing/persistensi, job legal nyata/review/versi, navigasi/responsif, viewer |
| Perjalanan demo browser | 17 kelompok lulus, termasuk dropdown, DOCX, impor, pustaka, network, panduan dan semua menu pada 360/390/768/1024/1440 px |
| Regresi DOM workspace | 55 pemeriksaan lulus |
| Screenshot seluruh menu | 22 screenshot dengan CSP produksi, tanpa page error dan tanpa overflow pada 390/1440 px |
| Syntax JavaScript dan git diff whitespace | Lulus |

Screenshot Aktivitas dengan hasil demo nyata berada di `screenshots/activity/`. Screenshot seluruh menu berada di `screenshots/workspace-visual/`. Screenshot desktop Hasil & review, desktop Proses agen dan kedua tampilan mobile diperiksa secara visual; warna, header, grid kartu dan kontrol konsisten dengan workspace lainnya.

Perintah khusus: `RULELAB_PYTHON=.venv/bin/python npm run test:activity`.

Tidak ada perubahan backend pada tahap ini. Pemeriksaan backend penuh tidak diulang; ketidakcocokan checksum metadata UU 25/2009 yang sudah tercatat pada tahap sebelumnya belum diubah. Penggabungan ini tidak menambah dokumen sumber atau data daerah.
