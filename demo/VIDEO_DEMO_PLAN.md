# RuleLab — Video Demo Submission (AI Builder Cup)

**Output:** `demo/video/out/rulelab-demo-final.mp4` · 1920×1080 · 30 fps · **3:02** · English VO + burned-in subtitles · audio -14 LUFS (YouTube)
**Team:** RuleLab · **Repo:** https://github.com/mocharil/RuleLab · **Upload:** YouTube (Public/Unlisted, bukan Private)

---

## 1. Keputusan

| Item | Keputusan |
| :--- | :--- |
| Bahasa | English (semua materi wajib English) |
| Voice-over | AI voice (Microsoft Edge neural TTS, `en-US-AndrewMultilingualNeural`) |
| Gaya visual | Mengacu video referensi (*tessel*): latar abu terang, tipografi besar tebal, aksen satu titik merah, UI miring 3D, zoom kamera ala Screen Studio, transisi blur cepat |
| Isi layar | **Replika UI RuleLab dengan data & alur simulasi** (sesuai arahan), bukan rekaman layar live |
| Durasi | 3:02 (aturan: 3–4 menit; lebih dari 4 menit kena penalti) |
| Ilustrasi | 7 ilustrasi 3D clay di `video/assets/` (hook, problem, close) |

## 2. Pemetaan ke kriteria juri

| Kriteria | Bobot | Ditunjukkan di |
| :--- | :-: | :--- |
| Technical Merit & Gen AI | 40% | Brief → draft oleh Gemini (schema-valid JSON), pipeline agen (hybrid retrieval atas 25.310 pasal, 4 specialist agents, citation guard), 32 persona AI × 5 putaran, knowledge graph + difusi opini ke 200 agen crowd |
| Problem Alignment & Impact | 25% | Hook "one sentence locks people out", A/B 70% → 94% (+600 warga terlayani), biaya & beban petugas |
| Innovation & Creativity | 25% | Kutipan diverifikasi ke sumber + SHA256, kutipan palsu ditolak, forum persona sintetis |
| UX & Solution Design | 10% | Alur 3 tahap Studio (bar dokumen + stepper), Verify master–detail dengan diff kata, human-in-the-loop (apply → v3, keputusan review di Activity), ekspor DOCX |

## 3. Adegan (timecode mengikuti `video/timeline.js`)

| # | Adegan | Waktu | Isi |
| :-: | :--- | :--- | :--- |
| 1 | Hook | 0:00–0:17 | Titik merah → diketik "Applications may only be submitted through a digital app." → mundur menjadi halaman PP → 3 kartu warga → **Locked out.** |
| 2 | Problem | 0:17–0:34 | Grid regulasi 3D + garis konflik "They don't fit." → *By hand. For weeks.* → chatbot mengarang Pasal 87(4) → keluhan naik setelah disahkan |
| 3 | Reveal | 0:34–0:51 | Latar hitam, logo RuleLab, "Built on Gemini", pill 01 Draft · 02 Verify · 03 Test impact |
| 4 | Draft | 0:51–1:14 | Prompt brief → Policy Studio (bar dokumen + stepper, outline, naskah, rail Insights) → Gemini menyusun PP (15 jenis, konsiderans, dasar hukum, 6 pasal, sumber) → Pasal 2 dipilih di outline dan diubah jadi *digital only* → Save version → v2 |
| 5 | Verify | 1:14–1:49 | "Check every clause." → pipeline agen (838 regulasi · 25.310 pasal) → Verify sources master–detail: 3 temuan, diff kata draft vs usulan, sumber UU 25/2009 Psl 29 & UU 8/2016 Psl 19 + SHA256, kutipan di luar bukti ditolak → Apply proposal → v3 |
| 6 | Impact | 1:49–2:30 | "Test it on people." → Test impact 3 langkah (Alternative B, asumsi, compare): A 70% vs B 94%, +600 orang, Rp35M → 65M, 15 staff-days → forum: **knowledge graph** (49 entitas) tumbuh, persona yang bicara memancarkan riak dua lompatan → **rembetan ke 200 agen crowd** node demi node (riak tiap node, kilatan di jalur penularan, gelombang per ronde) → agen berkumpul per isu, stance A vs B |
| 7 | Outcome | 2:30–2:38 | Dua dokumen DOCX + Activity: timeline per versi (run agen → hasil), keputusan review dengan riwayat |
| 8 | Platform | 2:38–2:46 | Legal library (hasil · pembaca · asisten berkutipan) + Data dashboard (838 · 25.310 · 21/38 provinsi, peta 38 provinsi) |
| 9 | Close | 2:46–3:02 | Gembok warga terbuka → "Laws that fit." / "People included." → logo, Team RuleLab, GitHub, Gemini · Google Cloud |

Naskah VO lengkap: `video/script.json`.

## 4. Catatan kejujuran (penting untuk juri)

- Layar di video adalah **replika** UI RuleLab (tampilan per 17 Oktober 2026) dengan **angka simulasi** (70%→94%, 320 respons, stance %, jam aktivitas). Rumus A/B konsisten (2.500 × 70% + 750 × 80% = 2.350).
- Angka korpus memakai data live: **838 regulasi · 25.310 pasal/blok**; narasi Verify berbunyi "more than twenty-five thousand official articles". Peta Data dashboard mewarnai 21 dari 38 provinsi sesuai jumlah dokumen per provinsi (snapshot `GET /api/data/overview`).
- Graf forum mengikuti tampilan aplikasi (knowledge graph → crowd network); difusi crowd di video dihitung deterministik dari jaringan follow sederhana untuk visualisasi, sama seperti difusi berbasis aturan di aplikasi (tanpa panggilan AI).
- Kutipan pasal UU 25/2009 Pasal 29 dan UU 8/2016 Pasal 19 serta SHA256-nya diambil dari korpus asli di `data/enriched/`.
- Persona diberi label *"Synthetic personas: not a survey"*.
- Juri tetap akan menguji prototype langsung, jadi alur yang ditampilkan sebaiknya berjalan di aplikasi live (lihat §6).

## 5. Render ulang

```bash
cd demo/video
python tts.py            # VO per kalimat + timeline.js (butuh: pip install edge-tts)
python tts.py --reuse    # hanya kalimat yang berubah disintesis ulang; sisanya memakai mp3 & timing lama
node render.cjs --stills 10,60,120   # cek frame -> out/stills
node render.cjs          # semua frame -> out/video.mp4 (PW=<path playwright> bila tidak terpasang lokal)
python audio.py          # musik + SFX + ducking VO -> out/mix.wav (butuh numpy)
ffmpeg -i out/mix.wav -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k out/mix.m4a
ffmpeg -i out/video.mp4 -i out/mix.m4a -c:v copy -c:a copy -shortest -movflags +faststart out/rulelab-demo-final.mp4
# klip landing (tanpa subtitle): bagian produk 50,5–165,8 s
NOSUBS=1 FROM=50.5 TO=165.8 OUT=landing-nosubs.mp4 node render.cjs
```

Preview interaktif: buka `demo/video/index.html` di browser (tombol Play, scrub, lompat adegan).
Ubah teks VO di `script.json` → jalankan `tts.py` → durasi & sinkronisasi animasi menyesuaikan otomatis (animasi dikunci ke kata VO).

## 6. Temuan saat uji live (di luar video)

- **Diperbaiki:** "Brief → draft" di Vertex gagal HTTP 400 karena `maxItems: 100` pada schema array; `app/services/ai.py` kini membuang `maxItems > 20` di schema Vertex (Pydantic tetap memvalidasi). 21 tes readiness lulus.
- **Belum diperbaiki (keputusan Anda):** analisis live sering gagal total (3/3 percobaan) karena satu temuan dengan `legal_rule_id`/kutipan tidak valid membuat seluruh hasil ditolak, ditambah timeout 90 detik. Opsi: tolak per temuan, bukan per run, dan naikkan `RULELAB_AI_TIMEOUT`.
- Aturan lomba: prototype wajib di-deploy di **Cloud Run/Firebase** (sudah: Cloud Run asia-southeast2); UI aplikasi sudah berbahasa Inggris.

## 7. Checklist sebelum upload

- [ ] Tonton penuh sekali dengan suara dan sekali tanpa suara (subtitle cukup jelas)
- [ ] Durasi 3:00–3:59 ✔ (3:02)
- [ ] Upload YouTube: judul "RuleLab — AI Workspace for Indonesian Lawmaking | Team RuleLab | AI Builder Cup", visibilitas Public/Unlisted
- [ ] Buka link di jendela incognito
- [ ] Tempel link di slide 14 deck submission
