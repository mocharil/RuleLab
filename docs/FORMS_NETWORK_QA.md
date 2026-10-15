# Template hukum dan network simulasi · QA

Tanggal: 13 Oktober 2026. Perubahan ini melanjutkan paket perbaikan UI hackathon pada branch `codex/hackathon-ux-polish`.

## Hasil implementasi

- Katalog 15 jenis umum, tautan sumber resmi, form identitas sesuai jenis, preview, checklist dan Create dari input terakhir.
- Pembedaan UU/Perppu, Perda/Perkada, peraturan DPRD, serta Perdes/Perkades. Naskah perubahan Pasal I/II; naskah baru dapat memuat Bab, ketentuan peralihan, penjelasan dan lampiran.
- Semua field format disimpan dalam payload/version JSON SQLite, sehingga database lama tidak memerlukan migrasi tabel. DOCX menyertakan heading, Bab, penutup, penjelasan dan lampiran.
- Agen 8/16/24/32; putaran 2–5; default 24/4. Estimasi respons tampil sebelum menjalankan job. Opsi tercatat dalam request/job/run.
- Persona tambahan mempunyai profil/tujuan dan ID tersendiri. Network enam kelompok isu memakai persona dan balasan tercatat, bukan node dekoratif.
- Pencarian nama/peran, filter isu/lapisan, zoom/reset/pan, fullscreen, inspector opini tepat per putaran, A/B dan replay.
- Perbaikan selector SVG agar ikon dropdown tidak terkena ukuran canvas; toolbar network tidak menimpa filter; dialog fullscreen tetap di dalam viewport; pencarian mempertahankan fokus selama polling; repaint ditunda saat dropdown network terbuka.
- Dropdown menampilkan nama peraturan yang mudah dibaca sambil mempertahankan kode API.

## Verifikasi

| Pemeriksaan | Hasil |
|---|---|
| `.venv/bin/python -m pytest tests -q` | 148 lolos, 1 gagal checksum baseline |
| `npm run frontend:build` | TypeScript dan bundle produksi lolos |
| `npm run frontend:test` | 11 tes komponen lolos |
| `RULELAB_PYTHON=.venv/bin/python npm run test:dom` | 56 pemeriksaan lolos |
| `RULELAB_PYTHON=.venv/bin/python npm run test:browser` | 33 kelompok alur lolos |
| `RULELAB_PYTHON=.venv/bin/python npm run test:demo` | 16 kelompok alur seluruh menu dan layout 360–1440px lolos |
| `RULELAB_PYTHON=.venv/bin/python npm run test:forms-network` | 5 kelompok alur builder/network lolos; screenshot aktual |

Tes backend menjalankan kedua bentuk untuk seluruh 15 jenis, memeriksa output DOCX, pembedaan persetujuan dan media pengundangan, semua ukuran pool, validasi opsi, 320 respons, balasan valid dan isolasi A/B. Adapter live tiruan membuktikan concurrency ≤ 3 dan konteks ≤ 96 komentar; fixture Vertex menguji kontrak REST/schema/auth dengan default 192 respons. Ini tidak membuktikan akses Gemini/Vertex pada akun Google nyata.

Tes browser khusus membuat Perda kota dengan empat Bab, menyunting region dan metadata, menyimpan dan mengunduh DOCX. Simulasi 32 × 5 menghasilkan 160 komentar/node opini per skenario, dengan 32 persona, enam cluster serta balasan. Tes menekan kontrol filter, pencarian, zoom/reset, fullscreen, pemilihan opini dan replay; membuat Perppu perubahan Pasal I/II; memeriksa layout 360/390/768/1440px dan asisten editor. Tidak ada JavaScript page error pada alur tersebut.

## Masalah sumber yang sudah ada

`tests/test_data_ai.py::test_corpus_integrity` tetap gagal untuk metadata/raw UU 25/2009, sama seperti upstream awal dan paket sebelumnya. Nilai metadata `60e640cd8305768c7ea81c50a84eb6b79d16e8e7575ceaf0e265fce0b9b23931` berbeda dari file raw `244cbe9a0ae056d21e71b7ac83f43cb11a89de6ebda0f613f8e95778dc992100`. Provenance tidak ditulis ulang untuk menyembunyikan kegagalan.

## Cakupan hukum dan operasional

Pemetaan serta sumber ada pada [LEGAL_FORMS_RESEARCH.md](LEGAL_FORMS_RESEARCH.md). Template merupakan scaffold dengan placeholder yang masih perlu diisi; 15 jenis bukan inventaris semua variasi tata naskah lembaga. Peraturan Bersama Kepala Desa memerlukan form multi-desa dan belum tersedia. Korpus analisis tetap enam dokumen, belum terkonsolidasi.

Default live membutuhkan 192 panggilan persona + planner; maksimum 320 + planner. Batas concurrency mengikuti konfigurasi server. Pembatalan, timeout, idempotency, versi snapshot dan hasil parsial mengikuti runtime yang sudah ada. Jalankan satu proses Uvicorn seperti sebelumnya. Mode demo dan seluruh replay tidak memanggil LLM.

Screenshot terbaru: `screenshots/forms-network/`. Paket menyertakan bundle frontend, sumber, riset dan skrip tes. Tidak menyertakan credential, `.env`, database kerja, venv atau node_modules.
