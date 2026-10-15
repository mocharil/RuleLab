# RuleLab — Video Demo Submission (AI Builder Cup)

**Output:** `demo/video/out/rulelab-demo-final.mp4` · 1920×1080 · 30 fps · **3:27** · English VO + burned-in subtitles · audio -14 LUFS (YouTube)
**Team:** RuleLab · **Repo:** https://github.com/mocharil/RuleLab · **Upload:** YouTube (Public/Unlisted, bukan Private)

---

## 1. Keputusan

| Item | Keputusan |
| :--- | :--- |
| Bahasa | English (semua materi wajib English) |
| Voice-over | AI voice (Microsoft Edge neural TTS, `en-US-AndrewMultilingualNeural`) |
| Gaya visual | Mengacu video referensi (*tessel*): latar abu terang, tipografi besar tebal, aksen satu titik merah, UI miring 3D, zoom kamera ala Screen Studio, transisi blur cepat |
| Isi layar | **Replika UI RuleLab dengan data & alur simulasi** (sesuai arahan), bukan rekaman layar live |
| Durasi | 3:27 (aturan: 3–4 menit; lebih dari 4 menit kena penalti) |
| Ilustrasi | 7 ilustrasi 3D clay di `video/assets/` (hook, problem, close) |

## 2. Pemetaan ke kriteria juri

| Kriteria | Bobot | Ditunjukkan di |
| :--- | :-: | :--- |
| Technical Merit & Gen AI | 40% | Brief → draft oleh Gemini (schema-valid JSON), pipeline agen (hybrid retrieval, 4 specialist agents, citation guard), 32 persona AI × 5 putaran |
| Problem Alignment & Impact | 25% | Hook "one sentence locks people out", A/B 70% → 94% (+600 warga terlayani), biaya & beban petugas |
| Innovation & Creativity | 25% | Kutipan diverifikasi ke sumber + SHA256, kutipan palsu ditolak, forum persona sintetis |
| UX & Solution Design | 10% | Alur 3 tahap Studio, human-in-the-loop (catatan reviewer, apply → v3), ekspor DOCX, audit trail |

## 3. Adegan (timecode mengikuti `video/timeline.js`)

| # | Adegan | Waktu | Isi |
| :-: | :--- | :--- | :--- |
| 1 | Hook | 0:00–0:21 | Titik merah → diketik "Applications may only be submitted through a digital app." → mundur menjadi halaman PP → 3 kartu warga → **Locked out.** |
| 2 | Problem | 0:21–0:42 | Grid regulasi 3D + garis konflik "They don't fit." → *By hand. For weeks.* → chatbot mengarang Pasal 87(4) → keluhan naik setelah disahkan |
| 3 | Reveal | 0:42–0:57 | Latar hitam, logo RuleLab, "Built on Gemini", pill 01 Draft · 02 Verify · 03 Test impact |
| 4 | Draft | 0:57–1:26 | Prompt brief → Gemini menyusun naskah PP (15 jenis, konsiderans, dasar hukum, 6 pasal, sumber) → zoom Pasal 2 diubah jadi *digital only* → Ctrl+S → v2 |
| 5 | Verify | 1:26–2:08 | "Check every clause." → pipeline agen (12.000+ regulasi) → 3 temuan → bukti UU 25/2009 Psl 29 & UU 8/2016 Psl 19 + SHA256 → kutipan palsu ditolak → reviewer menerapkan usulan → v3 |
| 6 | Impact | 2:08–2:48 | "Test it on people." → asumsi → A 70% vs B 94%, +600 orang, Rp35M → 65M, 15 staff-days → network 32 persona, 6 klaster isu, kutipan persona, stance A vs B |
| 7 | Outcome | 2:48–2:59 | Dua dokumen DOCX + audit trail 7 langkah |
| 8 | Platform | 2:59–3:10 | Asisten Pustaka Hukum berkutipan + peta 38 provinsi |
| 9 | Close | 3:10–3:25 | Gembok warga terbuka → "Laws that fit." / "People included." → logo, Team RuleLab, GitHub, Gemini · Google Cloud |

Naskah VO lengkap: `video/script.json`.

## 4. Catatan kejujuran (penting untuk juri)

- Layar di video adalah **replika** UI RuleLab dengan **angka simulasi** (70%→94%, 320 respons, stance %, jam audit). Korpus ditulis **12.000+ regulasi** sesuai target scraping JDIH yang sedang berjalan saat penjurian. Rumus A/B konsisten (2.500 × 70% + 750 × 80% = 2.350).
- Kutipan pasal UU 25/2009 Pasal 29 dan UU 8/2016 Pasal 19 serta SHA256-nya diambil dari korpus asli di `data/enriched/`.
- Persona diberi label *"Synthetic personas: not a survey"*.
- Juri tetap akan menguji prototype langsung, jadi alur yang ditampilkan sebaiknya berjalan di aplikasi live (lihat §6).

## 5. Render ulang

```bash
cd demo/video
python tts.py            # VO per kalimat + timeline.js (butuh: pip install edge-tts)
node render.cjs --stills 10,60,120   # cek frame -> out/stills
node render.cjs          # semua frame -> out/video.mp4 (PW=<path playwright> bila tidak terpasang lokal)
python audio.py          # musik + SFX + ducking VO -> out/mix.wav (butuh numpy)
ffmpeg -i out/mix.wav -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k out/mix.m4a
ffmpeg -i out/video.mp4 -i out/mix.m4a -c:v copy -c:a copy -shortest -movflags +faststart out/rulelab-demo-final.mp4
```

Preview interaktif: buka `demo/video/index.html` di browser (tombol Play, scrub, lompat adegan).
Ubah teks VO di `script.json` → jalankan `tts.py` → durasi & sinkronisasi animasi menyesuaikan otomatis (animasi dikunci ke kata VO).

## 6. Temuan saat uji live (di luar video)

- **Diperbaiki:** "Brief → draft" di Vertex gagal HTTP 400 karena `maxItems: 100` pada schema array; `app/services/ai.py` kini membuang `maxItems > 20` di schema Vertex (Pydantic tetap memvalidasi). 21 tes readiness lulus.
- **Belum diperbaiki (keputusan Anda):** analisis live sering gagal total (3/3 percobaan) karena satu temuan dengan `legal_rule_id`/kutipan tidak valid membuat seluruh hasil ditolak, ditambah timeout 90 detik. Opsi: tolak per temuan, bukan per run, dan naikkan `RULELAB_AI_TIMEOUT`.
- Aturan lomba: prototype wajib di-deploy di **Cloud Run/Firebase**; UI aplikasi masih berbahasa Indonesia, padahal materi wajib English.

## 7. Checklist sebelum upload

- [ ] Tonton penuh sekali dengan suara dan sekali tanpa suara (subtitle cukup jelas)
- [ ] Durasi 3:00–3:59 ✔ (3:27)
- [ ] Upload YouTube: judul "RuleLab — AI Workspace for Indonesian Lawmaking | Team RuleLab | AI Builder Cup", visibilitas Public/Unlisted
- [ ] Buka link di jendela incognito
- [ ] Tempel link di slide 14 deck submission
