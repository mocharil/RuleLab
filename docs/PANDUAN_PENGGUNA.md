# Panduan penggunaan RuleLab 1.3

RuleLab membantu Anda membaca sumber hukum Indonesia, menyusun rancangan, memeriksa potensi konflik, dan mengeksplorasi dampaknya. Panduan ini mencakup lima menu utama serta skenario tes sebelum demo hackathon.

## 1. Jalankan aplikasi

Ekstrak paket, buka terminal pada folder `rulelab`, gunakan Python 3.11+ (3.12 disarankan), lalu jalankan:

Windows:

```bat
start.bat "C:\kredensial\service-account.json"
```

macOS/Linux:

```bash
chmod +x start.sh
./start.sh --sa "/lokasi/service-account.json"
```

Buka http://127.0.0.1:8000/workspace. Project ID diambil dari JSON. Pilih **Pengaturan integrasi → Uji koneksi Gemini**. Pemeriksaan lokal saja belum memastikan akses cloud. SA memerlukan izin Vertex, API aktif, billing, kuota dan akses model. Penanganan masalah: `docs/SA_SETUP.md`.

Tanpa SA, `./start.sh --demo` menjalankan demo lokal. Windows: isi `AI_PROVIDER=demo` di `.env`, lalu jalankan `start.bat` tanpa argumen. Demo tidak memanggil LLM dan selalu diberi label. Setelah setup, peluncuran berikutnya cukup `start.bat` atau `./start.sh`.

Data awal sudah tersedia: enam regulasi, 406 pasal/blok, naskah asli, hasil ekstraksi, JSON enriched dan pedoman legal. Corpus merupakan contoh, bukan seluruh hukum Indonesia. SQLite RAG langsung aktif; Elasticsearch hybrid opsional dijelaskan pada `QUICKSTART.md`.

## 2. Orientasi workspace

| Menu | Kegunaan |
| --- | --- |
| Ringkasan | Pilih rancangan, buat atau generate draft, lihat antrean review dan sumber. |
| Studio kebijakan | Satu alur Rancang naskah → Periksa sumber → Uji dampak, termasuk forum persona dan tinjauan terpadu. |
| Dashboard data | Jumlah koleksi, peta wilayah, filter jenis/tahun dan antrean unggahan/JDIH. |
| Pustaka hukum | Cari dokumen atau isi pasal, baca sumber, tanyakan ke asisten, dan bandingkan dua pasal. |
| Aktivitas | Tab Hasil & review untuk hasil/versi/catatan; tab Proses agen untuk brief dan jejak eksekusi. |

**Studio kebijakan** menggabungkan Editor, Pemeriksaan konflik dan Simulasi. Pilih tahap pada tiga kartu di atas area kerja. Perubahan naskah disimpan sebelum berpindah; jika penyimpanan gagal, Anda tetap berada di tahap Rancang dengan input yang sama. Label tahap memperlihatkan versi naskah dan hasil tersimpan, termasuk hasil lama setelah naskah berubah. Gunakan tahap Uji dampak untuk proyeksi A/B, forum persona atau tinjauan terpadu.

URL utama adalah `http://127.0.0.1:8000/workspace?view=studio`. Tahap tersimpan pada parameter `stage`; tautan lama Editor/Analisis/Simulasi tetap membuka tahap yang sesuai. Sidebar Studio melanjutkan tahap terakhir yang Anda buka. Menu cepat tetap mengenali kata “editor”, “analisis”, “simulasi” dan “netizen”.

**Aktivitas** menyatukan Riwayat & review dan Operasi agen. Pilih tab Hasil & review atau Proses agen; kartu ringkasan memperlihatkan jumlah hasil tersimpan, kebutuhan review, catatan dan proses aktif. Angka mengikuti rancangan terpilih dan diperbarui ketika proses agen selesai. Cakupan tugas, alternatif B, asumsi dan filter tetap tersedia saat berpindah tab dalam sesi. URL `view=activity&tab=results` atau `tab=agents` dapat dibuka kembali; tautan lama tetap bekerja. Sidebar melanjutkan tab terakhir.

Lipat sidebar lewat ikon di kiri atas. **Menu cepat** atau Ctrl+K / Cmd+K membantu navigasi. Tombol **?** pada header membuka panduan interaktif untuk menu aktif. **Panduan pengguna** membuka dokumen ini di tab baru. Perpindahan menu menyimpan perubahan draft; tombol Simpan mencatat versi secara eksplisit.

## Dashboard data dan peta koleksi

Buka **Dashboard data** pada sidebar atau melalui peta di landing page. Pilih jenis, tahun dan makna distribusi: wilayah penerbit, cakupan pengaturan atau wilayah disebut. Peraturan nasional ditampilkan terpisah; wilayah tanpa data tetap mempunyai angka nol. Pilih provinsi lewat peta/dropdown, lalu kabupaten/kota dari daftar bila metadata tersedia. Klik dokumen untuk membukanya di Pustaka hukum.

**Unggah sumber** menyimpan PDF/DOCX/TXT/JSON untuk pemeriksaan, menampilkan cuplikan ekstraksi dan menyediakan unduh file. **Tambah tautan JDIH** mencatat URL pemerintah ke antrean pengambilan; tautan belum otomatis diunduh. Pilih lapisan **Antrean sumber** untuk melihat sebarannya. Antrean belum masuk korpus analisis dan tidak tampil pada statistik publik. **Impor rancangan saya** membuka alur editor. Detail cakupan: `docs/DATA_DASHBOARD.md`.

## 3. Pustaka hukum dan asisten belajar

Gunakan tab **Koleksi dokumen** untuk mencari judul/nomor/tahun dan membaca naskah. Tab **Cari isi pasal** menelusuri frasa pada seluruh sumber. Hasil pasal mempunyai tombol **Baca dalam dokumen** dan **Tanyakan pasal ini**. Tombol **Bandingkan pasal** tersedia pada header kedua tab. Dokumen, pertanyaan dan percakapan tetap tersedia saat berpindah tab.

Tautan lama `view=gallery` dan `view=corpus` tetap membuka Pustaka hukum; URL aktif menggunakan `view=library`. Dokumen/pasal terpilih tercatat pada URL sehingga bisa dibuka kembali setelah reload.

1. Buka **Pustaka hukum** pada sidebar, atau http://127.0.0.1:8000/workspace?view=library.
2. Cari judul, nomor/tahun seperti `UU 25 tahun 2009`, atau pilih jenis UU/PP.
3. Klik kartu dokumen. Reader menampilkan judul, tanggal pengundangan, versi sumber, pasal/blok hasil ekstraksi dan kebutuhan OCR. Dokumen yang dipilih menjadi konteks bot.
4. Pilih **Baca pasal / blok**, misalnya Pasal 4. Baca kutipan hasil ekstraksi. **Naskah asli** mengunduh sumber; **JSON enriched** mengunduh metadata, pasal dan provenance; **Halaman sumber** membuka situs asal.
5. Klik **Tanyakan pasal ini** untuk mengisi pertanyaan, lalu **Tanyakan**. Saran pertanyaan juga mengisi input terlebih dahulu, sehingga Anda dapat menyesuaikannya sebelum model dipanggil.
6. Bot live menjelaskan dalam bahasa sederhana. Tiap bagian jawaban memiliki kutipan. Buka **Kutipan → Buka konteks pasal** untuk membaca teks lengkap, nomor halaman dan SHA256; periksa tautan sumber resmi.
7. Pilih **Seluruh koleksi** untuk pertanyaan topik umum. Penyebutan nomor/tahun peraturan secara eksplisit diprioritaskan atas pilihan konteks dokumen.
8. Gunakan pertanyaan lanjutan atau tulis sendiri. Setelah jawaban tentang satu peraturan berhasil, konteks bot diarahkan ke peraturan itu untuk membantu follow-up.

Contoh pertanyaan:

- `UU 25 tahun 2009 apa sih? Jelaskan untuk pemula.`
- `Apa maksud Pasal 4 pada UU 25/2009?`
- `Jelaskan Pasal 19 UU 8 tahun 2016 dengan bahasa sederhana.`
- `Apa arti pelayanan publik dalam dokumen ini?`
- `Hak atau kewajiban apa yang disebut dalam kutipan ini?`
- `UU 10 tahun 2018 apa sih?`

Contoh terakhir menguji batas corpus: **UU 10/2018 belum tersedia dalam dataset awal**. Bot memberi pesan dokumen belum tersedia dan tidak mengarang isi atau menyatakan bahwa peraturan tersebut tidak ada. Tambahkan sumber terverifikasi melalui pipeline ingestion untuk memperluas koleksi.

Pada mode demo, bot hanya menunjukkan cuplikan sumber dengan label **Demo · cuplikan**. Penjelasan dinamis dan analogi membutuhkan Gemini live. Model menggunakan pedoman legal Indonesia yang sama dengan fitur review; setiap ID sumber dan teks kutipan diperiksa server. Pemeriksaan kutipan memastikan teksnya cocok, bukan sertifikasi interpretasi hukumnya.

Riwayat percakapan berada di memori sesi halaman: tetap ada saat berganti menu, hilang saat reload/tutup halaman, dan dapat dihapus dengan **Hapus percakapan**. Maksimal 20 giliran ditampilkan; maksimal tiga giliran sebelumnya dikirim sebagai konteks percakapan ke model. Pasal hasil retrieval tetap menjadi sumber hukumnya. Pertanyaan dan cuplikan sumber dikirim ke provider saat mode live; jangan memasukkan informasi sensitif yang tidak diperlukan.

Jika model gagal, pertanyaan tetap tersimpan di input; **Coba lagi** mengembalikannya untuk diedit, lalu tekan **Tanyakan**. Tidak ada perpindahan otomatis dari live ke hasil demo. Pertanyaan dibatasi 3–2.500 karakter. Membaca/filter dokumen tidak memanggil model; pertanyaan live memakai kuota/billing provider, dan Elasticsearch menambahkan query embeddings.

## 4. Susun rancangan di editor

1. Dari Ringkasan pilih **Rancangan baru**. Pilih satu dari 15 jenis, naskah baru atau perubahan, isi identitas serta landasan dan klik **Preview naskah**. Tinjau bentuknya, lalu **Buat rancangan**. **Generate** menerima brief untuk draft awal berbantuan AI.
2. Isi judul, jenis, ruang lingkup dan konsiderans. Tulis setiap ketentuan pada pasal terpisah; nomor pasal harus unik.
3. Gunakan daftar pasal untuk berpindah dan edit Bab/Pasal. Naskah perubahan tetap mempunyai Pasal I/II; edit norma pengganti di dalam Pasal I. Buka **Identitas, penutup, penjelasan & lampiran** untuk melengkapi format, lalu **Simpan**. Bagian ini ikut diekspor ke DOCX.
4. Buka tab asisten **Review**, **Sumber**, **Simulasi**, **Netizen** atau **Agen** tanpa meninggalkan editor.
5. Mode **Fokus menulis** menyembunyikan asisten sementara. Input tidak hilang ketika sidebar dilipat atau tab asisten diganti.

Impor menerima TXT, JSON DraftInput, DOCX atau PDF berteks sampai 10 MB. Pada TXT/DOCX, heading `Pasal 1` berada pada baris tersendiri. PDF scan membutuhkan OCR sebelum diimpor. Rancangan pengguna terpisah dari corpus sumber: impor draft tidak otomatis menambah dokumen ke Pustaka hukum.

## 5. Review potensi konflik

Buka **Studio kebijakan → Periksa sumber**, atau gunakan tab Review pada asisten rancangan. Sesuaikan tanggal analisis bila ingin memeriksa batas waktu sumber.

Tinjau alasan temuan, teks rancangan, usulan perubahan, kutipan, hierarki, pemeriksaan legal dan interpretasi alternatif. Buka sumber sebelum mengambil keputusan. **Terapkan usulan** membuat versi baru; hasil dari versi lama tidak dapat diterapkan sampai pemeriksaan ulang dilakukan. Gunakan catatan reviewer untuk menyimpan verifikasi dan tindak lanjut.

Hasil kosong tidak membuktikan draft bebas konflik. Hubungan UU/PP adalah titik awal pemeriksaan; kewenangan, delegasi, ruang lingkup, pengecualian, perubahan dan waktu berlaku tetap harus dipertimbangkan. RuleLab tidak menetapkan pembatalan peraturan.

## 6. Simulasi dampak A/B

A menggunakan draft tersimpan. Tulis alternatif B dan isi jumlah pemohon, akses digital, keberhasilan bantuan, biaya layanan serta kapasitas petugas. Klik **Jalankan simulasi** dari asisten rancangan atau **Studio kebijakan → Uji dampak**.

Angka akses dan biaya dihitung dari asumsi input; narasi stakeholder berasal dari provider yang aktif. Periksa sensitivitas dan asumsi tersimpan sebelum membandingkan hasil. Input awal adalah contoh, bukan data survei Indonesia. Jika draft diubah, jalankan kembali simulasi agar hasil sesuai versi terbaru.

## 7. Forum netizen dan network

Siapkan alternatif B dan jalankan **Kumpulkan opini agen** di tab Netizen/editor atau Forum netizen AI.

Pilih 8, 16, 24 atau 32 agen dan 2–5 putaran sebelum menjalankan dua skenario A/B. Default 24 agen × 4 putaran menghasilkan 192 respons; maksimum 32 × 5 menghasilkan 320. Profil sintetis mengikuti sektor naskah. Persona dapat menanggapi komentar yang tersedia dari putaran sebelumnya pada skenario yang sama. Gunakan pencarian nama/peran, filter isu/lapisan, zoom, fullscreen dan replay untuk menelusuri network.

- Klik node persona untuk opini terbaru.
- Klik node opini putaran 1/2/3 untuk komentar tepat pada putaran tersebut.
- Klik node sumber hukum untuk kutipan dan provenance.
- Klik node tengah untuk snapshot rancangan.
- Pilih A/B, filter putaran, pan/zoom atau reset tampilan.
- Replay memperagakan urutan yang telah dicatat; replay tidak memanggil LLM baru. Jeda replay bukan pembatalan job server.

Pendapat ini sintetis, bukan komentar netizen nyata atau prediksi statistik opini publik. Demo memakai template; live menggunakan Gemini. Proses social memakai jumlah agen × putaran × dua skenario panggilan persona, ditambah planner, sehingga dapat lebih lama daripada review tunggal.

## 8. Aktivitas dan ekspor

**Pustaka hukum:** buka tab Cari isi pasal untuk mencari frasa, buka naskah/JSON, lalu pilih dua pasal pada **Bandingkan pasal**. Mode live menambahkan analisis AI; demo hanya perbandingan sumber dan hubungan hierarki awal.

**Aktivitas → Proses agen:** pilih cakupan yang diperlukan, isi pembanding/asumsi, mulai job dan buka trace tool. Status queued/running/completed/failed/cancelled disimpan pada workspace. Pembatalan tersedia sesuai izin/pemilik. Agen menyusun hasil review, bukan otomatis menerapkan revisi naskah.

**Aktivitas → Hasil & review:** hasil terikat pada versi saat dijalankan. Filter jenis proses, buka rincian, tambah catatan reviewer dan lihat versi naskah. Label versi lama berarti draft sudah berubah.

**Ekspor DOCX:** draft DOCX berisi rancangan tersimpan. Laporan DOCX berisi hasil review/simulasi yang tersedia serta batasannya. Periksa dokumen hasil ekspor sebelum digunakan. Ekspor bukan penerbitan UU resmi.

## 9. Checklist tes Anda

Gunakan mode demo terlebih dahulu untuk memeriksa alur, lalu ulangi dengan Gemini live setelah uji koneksi berhasil.

| Tes | Langkah | Hasil yang diharapkan |
| --- | --- | --- |
| Koleksi | Buka Pustaka hukum | Enam dokumen dan jumlah 406 pasal/blok pada paket awal. |
| Filter | Pilih PP | Satu PP pada dataset awal. |
| Reader | Pilih UU 25/2009, Pasal 4 | Teks pasal dan akses naskah asli/JSON tampil. |
| Bot dikenal | Tanya arti UU 25/2009 | Demo: cuplikan; live: penjelasan dengan kutipan. |
| Bot follow-up | Tanya maksud Pasal 4 | Sumber menunjuk pasal pada konteks yang dipilih. |
| Corpus terbatas | Tanya UU 10/2018 | Dokumen belum tersedia, tanpa kutipan karangan. |
| Pasal tidak ada | Tanya Pasal 999 UU 25/2009 | Konteks belum cukup, tidak diganti pasal lain. |
| Jejak sumber | Buka konteks kutipan | Teks lengkap, halaman dan SHA256 tersedia. |
| Percakapan | Pindah menu lalu kembali | Percakapan tetap ada; Hapus percakapan mengosongkannya. |
| Draft | Edit satu pasal, simpan | Versi tersimpan bertambah dan riwayat dapat dibuka. |
| Review | Periksa, edit draft, coba usulan lama | Usulan lama dinonaktifkan sampai diperiksa ulang. |
| A/B | Ubah asumsi dan jalankan simulasi | Angka mengikuti asumsi tersimpan; label tidak menyebut data empiris. |
| Netizen | Jalankan job social, pilih A/B | Jumlah agen × putaran respons per skenario, node opini dapat diklik. |
| Ekspor | Ekspor draft dan laporan DOCX | File dapat dibuka; draft dapat diimpor kembali. |

Kesalahan validasi ditampilkan di dekat field yang perlu diperbaiki. Pesan menetap sampai input tersebut diubah; nilai yang Anda tulis tetap tersimpan.

Jika menemukan masalah, catat menu, urutan langkah, mode demo/live, pesan error, dan versi aplikasi. Sertakan screenshot tanpa key/credential bila perlu. Jangan membagikan SA JSON.

## 10. Verifikasi teknis opsional

```bash
python3 -m pytest -q
npm --prefix frontend install
npm --prefix frontend test
npm run test:dom
```

Tes frontend membutuhkan Node.js/npm; menjalankan aplikasi biasa tidak membutuhkannya. Untuk screenshot lokal, pasang dependency root dan browser terlebih dahulu:

```bash
npm install
npx playwright install chromium
npm run screenshots
```

Output tersimpan di `screenshots/v1.3`. Skrip memakai database demo terpisah, tidak memerlukan SA dan tidak menggantikan uji cloud. Screenshot historis bukan tampilan versi sekarang. Rendering browser versi terbaru belum diverifikasi pada lingkungan pembuatan paket; regresi DOM tidak menguji layout CSS.

Uji live opsional dan berbayar:

```bash
.venv/bin/python scripts/doctor.py --live
.venv/bin/python scripts/verify_live.py --full
```

Di Windows, ganti `.venv/bin/python` dengan `.venv\Scripts\python`. `--full` memakai contoh publik/database sementara dan sekitar 45 panggilan generasi, termasuk bot galeri, ditambah embeddings jika ES aktif. Hasil ditulis ke `artifacts/live-verification.json`.
