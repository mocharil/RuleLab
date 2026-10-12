# RuleLab 0.7: forum netizen sintetis

## Demo tanpa login

Jalankan start.sh dengan AI_PROVIDER=demo. Buka workspace, pilih **Forum netizen AI** atau tab **Netizen** di editor. Siapkan teks alternatif B, kemudian klik **Kumpulkan opini agen**. Tidak membutuhkan SSO atau kredensial LLM untuk mode demo.

Lima persona: Sari (akses internet terbatas), Nadia (pengguna pembaca layar), Bima (petugas), Raka (UMKM), Dewi (anggaran). Persona adalah konfigurasi sintetis di app/services/social.py, bukan profil orang nyata atau sampel representatif.

## Eksekusi

- POST /api/drafts/{id}/agent-jobs dengan intent=social memakai snapshot, expected_revision, alternatif B, Assumptions, dan Idempotency-Key yang sama dengan job lain.
- Koordinator membuat rencana terbatas. Retrieval mengambil maksimal 12 pasal/blok untuk teks A dan B.
- Tiga putaran per skenario, A lalu B. Lima agen bekerja paralel pada setiap putaran. Skenario tidak saling berbagi transcript.
- Setiap agen membaca semua komentar yang selesai pada putaran sebelumnya dari skenario yang sama. Putaran pertama tidak membalas. Putaran berikutnya wajib membalas ID komentar agen lain yang benar-benar tersedia.
- Live: 30 panggilan respons persona ditambah satu panggilan planner. Semua memakai adapter Gemini/Vertex dan pedoman legal yang sudah tersedia. Timeout per panggilan mengikuti RULELAB_AGENT_STEP_TIMEOUT. Kegagalan tidak diganti template demo; saudara tugas dibatalkan dan opini parsial tetap tersedia pada event ledger.
- Demo: template lokal yang secara eksplisit ditandai. Tidak ada delay buatan untuk memberi kesan panggilan LLM.
- Validasi Pydantic, stance/issue terbatas, evidence IDs allowlist, reply IDs transcript sebelumnya. Referensi hukum hanya konteks, bukan bukti empiris opini masyarakat.
- Ringkasan deterministik mengelompokkan komentar terakhir tiap persona menurut sikap dan isu, menyimpan ID komentar asal. Ini bukan pemungutan suara, sentiment estimator populasi, atau konsensus publik.
- Hasil lengkap tersimpan sebagai run kind=social. Semua opini, status, ringkasan, kegagalan dan pembatalan tersimpan di agent_events. Reload dapat memuat ulang; restart menandai proses yang belum selesai interrupted, tanpa retry biaya otomatis.

## Visual dinamis

Polling aktivitas 1,2 detik; node berdenyut ketika event running belum memiliki event selesai. Feed menampilkan komentar yang selesai, konteks balasan, dan alasan/usulan yang dapat ditinjau. Garis berarah dibangun dari reply_to yang valid. Garis aktif bergerak pada balasan terbaru; tidak ada garis fiktif yang diperlakukan sebagai hubungan empiris.

Klik node atau komentar untuk menelusuri persona, opini, perjalanan sikap dan sumber yang dirujuk. Sumber lengkap tersedia ketika run selesai. Panel editor tidak mengganti input draft yang belum disimpan saat polling.

**Jeda visual** membekukan event yang ditampilkan, bukan membatalkan pekerjaan server. **Batalkan** menghentikan tugas server. **Replay** memutar event tersimpan, dengan kecepatan 1×/2×/4×, jeda dan navigasi per putaran. Replay tidak memanggil AI. Preferensi reduced motion menonaktifkan animasi.

**Data & A/B** menampilkan sikap akhir tiap persona, jumlah evidence dan asumsi input. Model akses dan biaya tetap memakai rumus quantitative sebelumnya, terpisah dari percakapan. Data populasi riil dan perilaku tidak dikalibrasi. Model ini terutama contoh layanan publik digital, bukan model dampak kuantitatif universal bagi semua peraturan.

## Batas operasional

Tetap satu proses Uvicorn dan satu workspace SQLite. Pembatas job, role, origin, body size, audit, timeout, cancel dan snapshot menggunakan kontrol yang sudah ada. Akun, SSO dan multi-tenant tidak diperlukan untuk demo ini.

Kredensial live belum digunakan dalam validasi ini. Kontrak konteks antar putaran, isolasi A/B, kegagalan, invalid source/reply, timeout dan cancellation diuji dengan adapter tiruan. Untuk live, set AI_PROVIDER=vertex dan GOOGLE_APPLICATION_CREDENTIALS pada server atau AI_PROVIDER=gemini dengan API key, lalu pilih GEMINI_MODEL yang tersedia pada akun/proyek Anda.

## Screenshot

screenshots/v0.7 berisi screenshot aplikasi yang berjalan dalam mode demo, bukan mockup. social-gathering-replay.png merekonstruksi status agen dari event tersimpan; bukan screenshot panggilan Gemini live. social-A-discussion.png dan social-B-mitigation.png memperlihatkan transcript skenario yang berbeda.


## Red/white explorer design (0.7.1)

The simulation retains the red/white brand. Persona nodes open their latest opinion; numbered satellites open the exact completed opinion for that round. The center opens the scenario snapshot, and legal nodes open actual retrieved text and provenance. Zoom/pan/reset, replay and live-event motion are preserved. The reference video informs graph interaction only; none of its assets or example statistics are embedded. See DESIGN_PROMPT.md. Latest screenshots: screenshots/v0.7.1.
