# Studio kebijakan terpadu

Catatan tahap berikutnya: navigasi terbaru memiliki lima menu dengan Aktivitas terpadu. Lihat [ACTIVITY_MERGE_QA.md](ACTIVITY_MERGE_QA.md). Catatan di bawah mendokumentasikan pengujian pada tahap ini.


Editor, Pemeriksaan konflik dan Simulasi digabung menjadi satu menu karena ketiganya bekerja pada satu rancangan dan versi naskah yang sama. Tahap tetap jelas: **Rancang naskah → Periksa sumber → Uji dampak**. Asisten inline tetap tersedia ketika menulis; pemeriksaan dan simulasi lengkap dapat dibuka melalui kartu tahap.

Workspace sekarang memiliki enam menu utama:

| Menu | Tujuan |
| --- | --- |
| Ringkasan | Memilih pekerjaan dan melanjutkan rancangan |
| Studio kebijakan | Menyusun satu naskah, meninjau sumber dan mengevaluasi skenario |
| Dashboard data | Memahami ukuran/distribusi koleksi dan antrean sumber |
| Pustaka hukum | Menemukan dan membaca sumber, bertanya, serta membandingkan pasal |
| Riwayat & review | Menelusuri versi, hasil dan catatan keputusan |
| Operasi agen | Memantau brief, eksekusi, trace dan job yang berjalan |

Empat menu terakhir tetap terpisah karena tujuan, konteks data dan kontrolnya berbeda dari alur menyusun satu rancangan. Menyatukannya ke area penulisan akan menambah kepadatan dan menyulitkan pengguna menemukan pekerjaan pengelolaan atau pemantauan.

## Perilaku

- Sidebar dan menu cepat menyediakan satu entri Studio. Kata editor, analisis, simulasi dan netizen tetap dapat ditemukan; menu cepat membuka tahap/subtab yang sesuai.
- URL kanonis menggunakan `view=studio&stage=editor|analysis|simulation`. `view=editor`, `analysis`, `simulation` dan `social` tetap membuka tahap yang sesuai; subtab forum memakai `sub=social`.
- Kartu tahap menunjukkan draft belum disimpan, versi naskah, jumlah temuan dan versi proyeksi berdasarkan data tersimpan. Hasil yang tertinggal setelah revisi diberi label hasil lama.
- Perpindahan dari editor menyimpan perubahan sebelum membuka tahap lain. Kegagalan simpan mempertahankan input dan tahap, serta memungkinkan retry. Memilih tahap yang sama tidak membuat entri history duplikat.
- Teks alternatif, asumsi, tab asisten dan tab forum/tinjauan dipertahankan dalam sesi. Reload memulihkan rancangan/tahap/subtab dari URL; input alternatif yang belum dijalankan tidak diklaim persisten setelah reload.
- Tombol Back/Forward, navigasi keyboard dan fokus tahap bekerja. Viewer dapat menelusuri tahap, sementara penulisan dan tindakan menjalankan review/simulasi tetap dinonaktifkan.

## Verifikasi 13 Oktober 2026

- 4 kelompok browser Studio lolos dengan CSP produksi aktif: entri menu/alias URL, autosave/fokus, review/simulasi pada versi yang tepat, state asumsi, Back/Forward/reload, gagal simpan/retry, hasil lama, command menu, viewer dan layout.
- 17 kelompok alur browser demo lolos, termasuk dropdown, review, simulasi/forum, impor/ekspor, riwayat, semua tahap, menu lain dan reduced motion.
- 55 pemeriksaan DOM, 11 tes komponen dan build produksi TypeScript/React lolos.
- Tampilan diperiksa pada 360, 390, 768, 1024 dan 1440 piksel. Capture desktop/mobile seluruh workspace menghasilkan 22 layar dengan CSP aktif tanpa error JavaScript atau overflow halaman.
- Syntax JavaScript/CSS dan `git diff --check` lolos.

Screenshot tahap berada di `screenshots/studio/`; pratinjau seluruh workspace di `screenshots/workspace-visual/`.

```bash
RULELAB_PYTHON=.venv/bin/python npm run test:studio
RULELAB_PYTHON=.venv/bin/python npm run test:demo
RULELAB_PYTHON=.venv/bin/python npm run test:dom
npm run frontend:test
npm run frontend:build
```

Backend, korpus dan model simulasi tidak diubah. Hasil uji menggunakan mode demo lokal; koneksi cloud live dan akurasi interpretasi hukum tidak dinilai pada penggabungan navigasi.
