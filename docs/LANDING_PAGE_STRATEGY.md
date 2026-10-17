# Strategi Landing Page RuleLab — "Simple, elegant, hidup"

Status: **diimplementasikan** (lihat §12). Bagian 1–10 adalah strategi awal.

## 1. Kondisi sekarang dan masalahnya

| Aspek | Kondisi sekarang | Dampak |
|---|---|---|
| Ukuran | `landing.html` 950 baris, `landing.css` 3.187 baris, `landing.js` 628 baris (vanilla JS) | Sulit dirawat; efek dibuat manual satu per satu |
| Struktur | 7 section padat: hero, trust, koleksi, fitur (3 widget interaktif), agen (konsol), cara kerja, penutup | Terlalu banyak teks per layar; pesan utama tenggelam |
| Visual | Gambar statis + tiga widget tiruan yang kini berlabel "Illustrative preview" | Terasa seperti mockup, bukan produk nyata |
| Gerak | Animasi CSS/JS buatan sendiri, tidak konsisten | Kurang halus; belum menghormati `prefers-reduced-motion` di semua tempat |
| Video | Tidak ada | Pengunjung harus membaca untuk memahami alur produk |
| Angka | Sebagian klaim ditulis langsung di HTML | Risiko tidak sinkron dengan data (mis. 838 vs "12,000+") |

**Tujuan baru:** dalam 10 detik pengunjung paham *apa* RuleLab, *untuk siapa*, dan *mengapa bisa dipercaya*; dalam 60 detik ia melihat ketiga tahap (Draft → Verify → Test impact) bekerja; semua fitur tetap tersampaikan, tetapi satu ide per layar.

## 2. Prinsip desain (mengacu pada gaya amman.co.id)

> Catatan: halaman amman.co.id tidak dapat diakses pada sesi penyusunan dokumen ini. Prinsip di bawah adalah pola situs korporat "simple but elegant" yang Anda rujuk; cocokkan dulu dengan situsnya sebelum desain visual difinalkan.

1. **Hero layar penuh dengan video tanpa teks berlebih.** Video ambient sebagai latar, satu headline besar, satu kalimat pendukung, dua tombol.
2. **Satu pesan per layar.** Setiap section memiliki satu judul, satu kalimat, dan satu visual utama. Detail dipindah ke workspace atau user guide.
3. **Whitespace yang lega.** Jarak antar-section 120–160 px di desktop; lebar teks maksimal sekitar 60 karakter.
4. **Tipografi besar dan sedikit warna.** Headline 56–88 px dengan tracking rapat; palet netral (putih, abu, hitam pekat) dengan merah RuleLab hanya sebagai aksen.
5. **Angka sebagai cerita.** Statistik besar yang menghitung naik saat terlihat, diambil langsung dari data aplikasi.
6. **Gerak yang tenang.** Fade/blur-in saat scroll, tidak ada efek yang berkedip atau bergerak terus tanpa alasan. Maksimal satu efek "berat" per viewport.
7. **Jujur.** Semua yang ilustratif diberi label; persona sintetis tidak pernah disebut opini publik.

## 3. Arsitektur teknis

Frontend sudah memakai React 19, Tailwind CSS 4, `motion` 12, dan shadcn (`components.json`, style `new-york`). MagicUI didistribusikan lewat registry shadcn, sehingga bisa dipasang tanpa mengubah stack.

```
frontend/src/
  landing/
    landing-entry.tsx        # entry Vite baru -> app/static/framework/landing.js + landing.css
    sections/*.tsx           # satu file per section (Hero, Problem, Numbers, Workflow, Features, Trust, Honesty, Closing)
    data.ts                  # fetch /api/public/collection (angka live), fallback aman bila gagal
  components/magicui/*.tsx   # komponen MagicUI yang dipasang via shadcn CLI
app/static/landing.html      # shell tipis: <head>, meta SEO, konten teks statis (fallback tanpa JS), <div id="landing-root">
```

- **Instalasi komponen:** `npx shadcn@latest add "https://magicui.design/r/<nama-komponen>"` dari folder `frontend/` (verifikasi format URL registry saat implementasi; beberapa komponen butuh dependensi tambahan, mis. `cobe` untuk Globe).
- **Build:** tambahkan entry kedua di `vite.config.ts` (mode multi-entry) agar workspace (`framework.js`) dan landing (`landing.js`) dibangun terpisah; landing tidak ikut memuat kode workspace.
- **SEO dan tanpa JS:** teks setiap section tetap ditulis di `landing.html` sebagai HTML statis; React meng-*hydrate* bagian interaktif. Halaman tetap terbaca jika JS gagal.
- **Data live, tanpa hardcode:** jumlah regulasi, artikel, provinsi, dan tipe peraturan diambil dari `GET /api/public/collection` (endpoint publik yang sudah ada). Jika gagal, tampilkan teks netral ("Indonesia's legal collection") dan bukan angka karangan.
- **Kode lama:** `landing.css`, `landing.js`, dan widget tiruan dihapus setelah halaman baru lulus QA; `landing-collection.js` (peta) dipertahankan atau dipindah ke komponen React bila diperlukan.

## 4. Struktur halaman baru

Urutan dirancang sebagai satu cerita: masalah → solusi → bukti → cara kerja → kepercayaan → ajakan.

| # | Section | Pesan (copy, English) | Visual utama | Komponen MagicUI |
|---|---|---|---|---|
| 0 | Navbar | Logo · Product · How it works · Trust · GitHub · **Open workspace** | Transparan di atas video, menjadi solid putih + blur saat di-scroll | `Scroll Progress` (garis tipis merah di atas) |
| 1 | Hero | **"Laws that fit together — and fit the people they serve."** Sub: "An AI workspace to draft, verify and test Indonesian regulations before they reach a citizen." | Video ambient layar penuh (lihat §5) dengan gradient gelap di bawah teks | `Blur Fade` / `Text Animate` (headline), `Shimmer Button` (Open workspace), `Hero Video Dialog` (Watch the 3-min demo → YouTube) |
| 2 | Masalah | **"One sentence can lock people out."** Kutip pasal "Applications may only be submitted through a digital app." | Tiga ilustrasi warga (aset `demo/video/assets/citizen-*`) berubah dari *locked* ke *served* saat di-scroll | `Highlighter` (menyorot frasa "only"), `Blur Fade` bertahap |
| 3 | Angka | **"Grounded in Indonesia's legal collection."** | 4 angka besar: regulasi, artikel, provinsi, jenis peraturan (live dari API) + pita nama peraturan nyata yang bergulir pelan | `Number Ticker`, `Marquee` (nama/nomor peraturan dari API) |
| 4 | Cara kerja | **Draft → Verify → Test impact** | *Sticky scroll storytelling*: kiri teks 3 langkah, kanan bingkai browser memutar klip pendek per langkah (lihat §5) | `Safari` (bingkai browser), `Animated Beam` (menghubungkan 3 langkah), `Blur Fade` |
| 5 | Fitur | **"Everything a drafter needs, in one workspace."** | Bento grid 6 kartu: Source-cited legal library · Citation guard · Version history & audit · Regulation map 38 provinsi · Persona & crowd simulation · DOCX export | `Bento Grid`, `Magic Card` (sorotan mengikuti kursor), `Border Beam` pada kartu Citation guard, `Animated List` (contoh event audit), `Orbiting Circles` atau `Particles` untuk kartu simulasi |
| 6 | Kepercayaan | **"Every claim has a source."** Sub: rejected citations, SHA-256 provenance, human review | Diagram arsitektur bergerak: Gemini ↔ Elasticsearch ↔ Cloud SQL ↔ Cloud Storage ↔ Cloud Run | `Animated Beam` (aliran data), `Terminal` (contoh log validator, diberi label "sample") |
| 7 | Kejujuran | **"Prepare public consultation — don't replace it."** | Kalimat MK tentang partisipasi bermakna (didengar, dipertimbangkan, mendapat penjelasan) + roadmap: practitioner validation, real public-input module | `Blur Fade`, `Dot Pattern` sebagai latar halus |
| 8 | Penutup + footer | **"Draft your next regulation with evidence."** | Latar grid tipis; tombol besar; footer: Team RuleLab, GitHub, Built with Gemini · Google Cloud, link user guide | `Retro Grid` atau `Flickering Grid`, `Interactive Hover Button` |

**Dihapus dari halaman lama:** editor mockup, persona simulator, dan konsol agen tiruan. Perannya digantikan klip video nyata dari aplikasi (section 4) yang lebih meyakinkan dan tidak perlu label "illustrative".

## 5. Rencana video

Semua video dibuat dari pipeline yang sudah ada (`demo/video`: komposer HTML frame-deterministik + Playwright + ffmpeg), sehingga gaya visualnya sama dengan video submission.

| Aset | Isi | Spesifikasi |
|---|---|---|
| **Hero ambient loop** | 12–15 detik, tanpa teks dan tanpa suara: dokumen peraturan → sorotan pasal → jaringan sumber hukum → persona → kembali ke dokumen (loop mulus) | 1920×1080 dan potongan 1080×1350 untuk mobile; WebM (VP9) + MP4 (H.264) fallback; target < 3 MB; `muted autoplay loop playsinline`; poster JPG untuk LCP |
| **3 klip langkah** | Draft (brief → draft), Verify (temuan + sumber + citation guard), Test impact (A/B + jaringan persona) | 6–8 detik per klip, 1280×800 di dalam bingkai `Safari`; diputar hanya saat terlihat (IntersectionObserver), dijeda saat keluar |
| **Demo lengkap** | Video submission 2:57 (`rulelab-demo-v3.mp4`) | Di-hosting di YouTube; dibuka lewat `Hero Video Dialog`; tidak dimuat sebelum diklik |

Produksi: tambahkan mode "ambient" di `demo/video` (tanpa VO/subtitle, kamera lebih lambat, transisi loop), dan perintah render per-scene untuk klip langkah. Opsional: rekaman layar aplikasi live di produksi untuk klip langkah agar 100% nyata.

## 6. Sistem visual

- **Warna:** `--ink #0B0B0C`, `--paper #FFFFFF`, `--mist #F4F4F5`, `--line #E4E4E7`, aksen `--rulelab-red #C8102E`; hijau/kuning hanya untuk status (support/conditional). Mode gelap hanya untuk hero dan section kepercayaan.
- **Tipografi:** pertahankan font sans yang dipakai app (`--sans`); headline 56–88 px, `letter-spacing: -0.04em`; body 18–20 px; label/eyebrow huruf kapital 12 px tracking lebar; angka memakai `tabular-nums`.
- **Grid:** kontainer maks 1200 px, 12 kolom; gutter mobile 16 px (sesuai pedoman artifact/mobile).
- **Gerak:** durasi 400–700 ms, easing `easeOut`; delay bertahap 60–80 ms; semua efek mati bila `prefers-reduced-motion: reduce` (video diganti poster, ticker langsung ke angka akhir, marquee berhenti).
- **Ikon:** lucide (sudah dipakai), garis 1.5–2 px.

## 7. Prinsip konten

1. Bahasa Inggris, kalimat pendek; istilah hukum Indonesia (Pasal, UU, PP) tetap asli.
2. Satu fitur = satu kalimat + satu visual. Detail teknis masuk user guide.
3. Tidak ada angka atau klaim yang ditulis manual: angka dari API, klaim kinerja hanya yang terverifikasi.
4. Semua contoh/ilustrasi diberi label; persona selalu disebut *synthetic*.
5. Setiap section punya tautan "dalam" ke bagian workspace yang relevan (mis. `/workspace?view=social`).

## 8. Anggaran performa dan aksesibilitas

| Metrik | Target |
|---|---|
| LCP (4G, mobile) | < 2,5 s — poster hero di-preload, video dimuat setelahnya |
| CLS | < 0,05 — semua media punya dimensi tetap |
| JS landing (gzip) | < 120 KB; komponen berat (Globe/Particles) di-*lazy load* |
| Total transfer awal | < 1,5 MB tanpa video |
| Lighthouse | Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95 |
| Aksesibilitas | Kontras AA, fokus keyboard terlihat, video punya label dan tombol jeda, teks alternatif untuk semua visual |

## 9. Tahapan implementasi

| Fase | Pekerjaan | Estimasi |
|---|---|---|
| 1. Fondasi | Entry Vite `landing`, shell HTML baru dengan konten statis, token desain, pasang komponen MagicUI terpilih | 0,5 hari |
| 2. Video | Mode ambient + render hero loop dan 3 klip, encode WebM/MP4 + poster | 0,5–1 hari |
| 3. Section | Hero, Masalah, Angka (API live), Cara kerja (sticky + klip), Fitur (bento), Kepercayaan, Kejujuran, Penutup | 1,5–2 hari |
| 4. QA | Responsif (360/768/1280/1920), reduced-motion, Lighthouse, uji browser yang ada (`scripts/browser_*.cjs`) diperbarui, cek dark/light | 0,5 hari |
| 5. Rilis | Hapus kode landing lama, deploy ke Cloud Run, perbarui screenshot deck | 0,25 hari |

**Kriteria selesai:** pesan utama terbaca dalam 10 detik pertama (uji dengan 3 orang awam); semua angka berasal dari API; tidak ada widget tiruan tanpa label; target performa di §8 tercapai; uji browser lulus.

## 10. Risiko dan mitigasi

| Risiko | Mitigasi |
|---|---|
| Efek MagicUI berlebihan membuat halaman "ramai" | Batas satu efek berat per viewport; review desain per section |
| Video memperlambat halaman | Poster + lazy load + WebM kecil; video tidak dimuat di koneksi hemat data (`navigator.connection.saveData`) |
| Angka "12,000+" di video tidak sama dengan data live | Landing selalu menampilkan angka live; perbarui video/deck setelah scraping selesai |
| Komponen MagicUI butuh versi Tailwind/motion tertentu | Uji pemasangan di branch; kunci versi di `package.json` |
| Hydration gagal | Konten statis tetap tampil; tes "no-JS" ditambahkan ke QA |

## 11. Keputusan yang dibutuhkan dari Anda

1. Headline utama: setuju dengan "Laws that fit together — and fit the people they serve." (sama dengan penutup video), atau ingin versi lain?
2. Klip langkah: dirender dari pipeline motion graphics (konsisten dengan video) atau rekaman layar aplikasi live (lebih otentik)?
3. Hero gelap (sinematik, seperti video) atau terang (lebih "korporat bersih")?
4. Apakah peta 38 provinsi tetap tampil di landing, atau cukup di bento grid dan workspace?

## 12. Keputusan dan implementasi (16 Oktober 2026)

**Keputusan:** headline "Regulations that hold up — in law and in people’s lives." · klip berupa motion graphics layar aplikasi versi lebih dinamis · hero terang · peta 38 provinsi tetap tampil.

| Bagian | Implementasi |
|---|---|
| Build | `frontend/vite.landing.config.ts` → `app/static/landing-app/landing.{js,css}`; `npm run build` membangun workspace lalu landing. CSS workspace memakai `source(none)` agar kelas landing tidak bocor ke workspace. |
| Halaman | `app/static/landing.html` (shell + fallback statis + section `#koleksi`), `frontend/src/landing/{main,sections,data}.tsx`, `landing.css` |
| Gaya | Tailwind tanpa preflight; `design.css` dimuat di layer `legacy` (dibutuhkan peta), reset hanya di root React |
| MagicUI | BlurFade, TextAnimate, ShimmerButton, HeroVideoDialog (diubah ke `<video>` lokal karena CSP), Highlighter, Marquee, AnimatedBeam, BentoGrid/BentoCard, MagicCard, BorderBeam (diperbaiki untuk Tailwind 4.0), AnimatedList, OrbitingCircles, Terminal, DotPattern, ScrollProgress, InteractiveHoverButton, AnimatedShinyText |
| Data | Angka dan pita jenis/topik diambil dari `/api/public/collection`; tidak ada angka yang ditulis tangan |
| Video | `demo/video` mendapat opsi `NOSUBS`/`FROM`/`TO`/`OUT`; satu render (50,5–161,1 s) dipotong menjadi `hero-loop.mp4` (montase 21 s, 1 MB), `step-draft/verify/impact.mp4` (2× lebih cepat, ±0,6 MB), plus `rulelab-demo.mp4` 720p (6,3 MB, dimuat saat diklik) di `app/static/landing/` |
| Label jujur | "Motion graphics … with sample data", chip "Example"/"Sample log" pada isi contoh, persona selalu disebut synthetic |

**Hasil uji:** tanpa error JS; tanpa scroll horizontal di 390 px; tes peta `browser_collection.cjs` (bagian landing) lulus; `dom_workspace_ux.cjs` 56 lulus; tes komponen 13 lulus; `tsc` bersih.

**Catatan terbuka:** bundle JS landing 162 KB gzip (target §8: 120 KB) — kandidat pengurangan: lazy-load Terminal/AnimatedList/OrbitingCircles di bawah lipatan. Overflow navigasi sidebar workspace di 360 px dan pemeriksaan jumlah baris dashboard di `browser_collection.cjs` adalah masalah workspace yang sudah ada sebelumnya.
