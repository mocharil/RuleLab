# Forum netizen sintetis · konfigurasi network

## Demo tanpa login

Jalankan start.sh dengan AI_PROVIDER=demo. Buka workspace, pilih **Simulasi dampak & publik → Forum netizen** atau tab **Netizen** di editor. Siapkan teks alternatif B, kemudian klik **Kumpulkan opini agen**. Tidak membutuhkan SSO atau kredensial LLM untuk mode demo.

Pilih 8/16/24/32 agen dan 2–5 putaran. Default 24 × 4 × 2 = 192 respons; maksimum 32 × 5 × 2 = 320. Delapan profil dasar per sektor diperluas dengan delapan peran sektoral dan enam belas peran lintas sektor. Setiap profil mempunyai ID, kondisi dan tujuan berbeda. Konfigurasi berada di app/services/social.py dan persona_pool.py; bukan profil orang nyata atau sampel representatif.

## Eksekusi

- POST /api/drafts/{id}/agent-jobs dengan intent=social memakai snapshot, expected_revision, alternatif B, Assumptions, social_options={persona_count:24,rounds:4}, dan Idempotency-Key yang sama dengan job lain.
- Koordinator membuat rencana terbatas. Retrieval mengambil maksimal 12 pasal/blok untuk teks A dan B.
- Jumlah putaran mengikuti social_options, A lalu B. Agen bekerja paralel dengan batas AI_CONCURRENCY pada setiap putaran. Skenario tidak saling berbagi transcript.
- Setiap agen membaca maksimal 96 komentar yang selesai, dengan teks konteks dibatasi panjangnya, pada putaran sebelumnya dari skenario yang sama. Putaran pertama tidak membalas. Putaran berikutnya wajib membalas ID komentar agen lain yang benar-benar tersedia.
- Live: jumlah agen × putaran × dua skenario panggilan respons persona, ditambah satu panggilan planner. Semua memakai adapter Gemini/Vertex dan pedoman legal yang sudah tersedia. Timeout per panggilan mengikuti RULELAB_AGENT_STEP_TIMEOUT. Kegagalan tidak diganti template demo; saudara tugas dibatalkan dan opini parsial tetap tersedia pada event ledger.
- Demo: template lokal yang secara eksplisit ditandai. Tidak ada delay buatan untuk memberi kesan panggilan LLM.
- Validasi Pydantic, stance/issue terbatas, evidence IDs allowlist, reply IDs transcript sebelumnya. Referensi hukum hanya konteks, bukan bukti empiris opini masyarakat.
- Ringkasan deterministik mengelompokkan komentar terakhir tiap persona menurut sikap dan isu, menyimpan ID komentar asal. Ini bukan pemungutan suara, sentiment estimator populasi, atau konsensus publik.
- Hasil lengkap tersimpan sebagai run kind=social. Semua opini, status, ringkasan, kegagalan dan pembatalan tersimpan di agent_events. Reload dapat memuat ulang; restart menandai proses yang belum selesai interrupted, tanpa retry biaya otomatis.

## Visual dinamis

Polling aktivitas 1,2 detik; node berdenyut ketika event running belum memiliki event selesai. Feed menampilkan komentar yang selesai, konteks balasan, dan alasan/usulan yang dapat ditinjau. Garis berarah dibangun dari reply_to yang valid. Garis aktif bergerak pada balasan terbaru; tidak ada garis fiktif yang diperlakukan sebagai hubungan empiris.

Network dikelompokkan pada enam isu dengan posisi stabil. Cari nama/peran, filter isu, pilih lapisan agen/balasan atau seluruh node opini, lalu gunakan zoom/pan/reset dan fullscreen. Klik node atau komentar untuk menelusuri persona, opini, perjalanan sikap dan sumber yang dirujuk. Sumber lengkap tersedia ketika run selesai. Panel editor tidak mengganti input draft yang belum disimpan saat polling.

**Jeda visual** membekukan event yang ditampilkan, bukan membatalkan pekerjaan server. **Batalkan** menghentikan tugas server. **Replay** memutar event tersimpan, dengan kecepatan 1×/2×/4×, jeda dan navigasi per putaran. Replay tidak memanggil AI. Preferensi reduced motion menonaktifkan animasi.

**Data & A/B** menampilkan sikap akhir tiap persona, jumlah evidence dan asumsi input. Model akses dan biaya tetap memakai rumus quantitative sebelumnya, terpisah dari percakapan. Data populasi riil dan perilaku tidak dikalibrasi. Model ini terutama contoh layanan publik digital, bukan model dampak kuantitatif universal bagi semua peraturan.

## Batas operasional

Tetap satu proses Uvicorn dan satu workspace SQLite. Pembatas job, role, origin, body size, audit, timeout, cancel dan snapshot menggunakan kontrol yang sudah ada. Akun, SSO dan multi-tenant tidak diperlukan untuk demo ini.

Kredensial live belum digunakan dalam validasi ini. Kontrak konteks antar putaran, isolasi A/B, kegagalan, invalid source/reply, timeout dan cancellation diuji dengan adapter tiruan. Untuk live, set AI_PROVIDER=vertex dan GOOGLE_APPLICATION_CREDENTIALS pada server atau AI_PROVIDER=gemini dengan API key, lalu pilih GEMINI_MODEL yang tersedia pada akun/proyek Anda.

## Screenshot

screenshots/forms-network berisi screenshot builder dan network terbaru. screenshots/v0.7 berisi screenshot historis aplikasi yang berjalan dalam mode demo, bukan mockup. social-gathering-replay.png merekonstruksi status agen dari event tersimpan; bukan screenshot panggilan Gemini live. social-A-discussion.png dan social-B-mitigation.png memperlihatkan transcript skenario yang berbeda.


## Red/white explorer design (0.7.1)

The simulation retains the red/white brand. Persona nodes open their latest opinion; numbered satellites open the exact completed opinion for that round. The center opens the scenario snapshot, and legal nodes open actual retrieved text and provenance. Zoom/pan/reset, replay and live-event motion are preserved. The reference video informs graph interaction only; none of its assets or example statistics are embedded. See DESIGN_PROMPT.md. Latest screenshots: screenshots/v0.7.1.
