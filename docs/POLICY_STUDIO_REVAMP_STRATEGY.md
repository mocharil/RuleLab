# Strategi Revamp Policy Studio — "fokus pada naskah, satu alur yang jelas"

Dokumen strategi; implementasi dan hasil audit ada di §11. Dasar analisis (17 Oktober 2026): screenshot ketiga tahap (Draft, Verify sources, Test impact) di desktop 1440 px dan mobile 390 px dengan draft contoh yang sudah dicek dan disimulasikan, audit klik semua kontrol per tahap, dan kode `app/static/app.js` (`editor`, `analysis`, `simulation`) + `studio.js`.

## 1. Kondisi sekarang

| Tahap | Tinggi halaman (desktop / mobile) | Kontrol | Isi utama |
|---|---|---|---|
| Draft | 2.905 / 4.642 px | 31 | Banner "Policy Studio" + 4 tombol, baris dokumen, 3 kartu tahap, pemilih dokumen, naskah formal (pembukaan, pasal), panel asisten 5 tab di kanan |
| Verify sources | 3.444 / 4.831 px | 35 | Banner + Re-check/DOCX Report, baris dokumen, kartu tahap, tanggal analisis, 3 metrik, filter, kartu temuan panjang (draft vs usulan, sumber, validasi), batasan, catatan reviewer |
| Test impact | 4.980 / 9.896 px | 13+ | Banner + 3 tombol, baris dokumen, kartu tahap, 3 sub-tab (A/B, forum persona, unified review), asumsi, naskah B, hasil A/B, 24 kartu persona, manfaat/risiko per pemangku kepentingan, tabel sensitivitas, rumus |

Semua tombol merespons dan tidak ada error JavaScript, tetapi ada masalah alur dan beban visual yang jelas.

### Masalah yang terlihat

| # | Masalah | Bukti |
|---|---|---|
| 1 | **Kerangka memakan layar pertama** | Banner judul "Policy Studio" + ilustrasi diulang di tiap tahap, ditambah baris dokumen dan kartu tahap; konten mulai di ±y=480 px (desktop) dan ±1.000 px (mobile) |
| 2 | **Judul draft muncul 4×** di tahap Draft | Baris dokumen, pemilih dokumen, judul naskah, pill versi |
| 3 | **Aksi ganda** | *Save* di banner dan *Save document* di bawah; *Run simulation* di banner dan *Compare scenarios* di bawah; *Edit document* dan kartu tahap Draft; *Continue to simulation* dan kartu tahap Test impact; *Review & apply B* di atas dan di bawah |
| 4 | **Panel asisten di tahap Draft menduplikasi Test impact** | Tab Simulation menampilkan perbandingan A/B "70% vs 70%, 0 access points" ketika alternatif B belum diisi — membingungkan dan tidak bermakna |
| 5 | **Focus mode tersimpan diam-diam** | Setelah sekali diklik, panel asisten tersembunyi di setiap kunjungan berikutnya (tersimpan di browser) tanpa penanda yang jelas |
| 6 | **Perbandingan A/B kosong** | Alternatif B otomatis disalin dari draft; hasil "+0" ditampilkan seolah-olah analisis |
| 7 | **Temuan sulit dipindai** | Kartu temuan menumpuk vertikal (draft vs usulan, 3 sumber, validasi, interpretasi); setelah satu usulan diterapkan, usulan lain tidak bisa diterapkan tetapi alasannya hanya terlihat sebagai tombol yang tidak merespons |
| 8 | **Test impact terlalu panjang** | Hampir 5.000 px desktop / 9.900 px mobile; 24 kartu persona, rincian manfaat/risiko, sensitivitas dan rumus tampil sekaligus |
| 9 | **Istilah tidak konsisten** | Kartu "Verify sources", breadcrumb "Policy Studio · Check", judul view "Conflict check" |
| 10 | **Mobile** | Tiga tahap dapat dipakai (tidak ada overflow, bottom bar bekerja), tetapi pekerjaan sebenarnya baru terlihat setelah dua layar scroll |

## 2. Tujuan

1. **Naskah selalu di pusat.** Pengguna melihat dan menyunting pasal dalam layar pertama di setiap tahap.
2. **Satu tempat untuk tiap aksi.** Tidak ada tombol yang berulang; aksi utama tiap tahap jelas.
3. **Bukti di samping pasal.** Temuan dan sumber muncul di dekat pasal yang dibahas, bukan di halaman terpisah yang panjang.
4. **Uji dampak yang bermakna.** Perbandingan baru dijalankan jika alternatif B benar-benar berbeda; hasil diringkas dulu, detail bisa dibuka.
5. **Selaras dengan Overview baru.** Stepper tahap, status versi, dan bahasa visual yang sama.

## 3. Prinsip

- **Kerangka tipis, konten tebal.** Satu bar dokumen ringkas menggantikan banner + baris dokumen + kartu tahap.
- **Konteks per pasal.** Pilih pasal → lihat temuan, sumber, dan usulannya.
- **Versi selalu terlihat.** Setiap hasil menyebut versi asalnya; hasil dari versi lama ditandai *outdated* dengan tombol perbaikan langsung (konsisten dengan Overview).
- **Ringkas dulu, rinci saat diminta.** Ringkasan di atas; detail (persona, sensitivitas, rumus) dalam panel yang bisa dibuka.
- **Aman.** Tidak ada perubahan perilaku hukum: hasil lama tetap tidak bisa menimpa versi baru, reviewer tetap memutuskan.

## 4. Kerangka baru (berlaku di ketiga tahap)

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ ‹ Layanan Publik Digital yang Inklusif ▾   PP · v3 · ● Saved     [Primary] ⋯   │  bar dokumen (sticky)
│   ● Draft ─────── ◉ Verify sources (3) ─────── ○ Test impact                  │  stepper = navigasi tahap
├───────────────────────────────────────────────────────────────────────────────┤
│                         konten tahap (lihat §5)                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

- **Judul** bisa diklik untuk mengganti draft (menggantikan pemilih dokumen) dan disunting di tempat.
- **Status simpan** satu-satunya: *Saved* / *Unsaved changes* / *Saving…*; `Ctrl+S` menyimpan.
- **Tombol utama kontekstual**: Draft → *Save version*; Verify → *Re-check v3* (atau *Check sources* bila belum); Test impact → *Compare A/B* (nonaktif sampai B berbeda dari A).
- **Menu ⋯**: Import, Export DOCX, Review report (DOCX), Focus mode, Legal guidelines.
- **Stepper** memakai komponen dan status yang sama dengan Overview (done/active/outdated/running) dan menggantikan tiga kartu tahap + tombol "Continue to…".
- Banner judul, ilustrasi, dan panel lipat panduan di bawah halaman dihapus; panduan tetap lewat tombol **?**.

## 5. Per tahap

### 5.1 Draft

```
┌──────────────┬──────────────────────────────────────┬──────────────────────────┐
│ OUTLINE      │ PERATURAN PEMERINTAH …               │ ARTICLE 2 · INSIGHTS     │
│ Opening      │ Menimbang · Mengingat (collapsible)  │ ⚠ High · Service access  │
│ Pasal 1  ●   │                                      │   may exclude groups     │
│ Pasal 2  ▲2  │ Pasal 2                              │   UU 25/2009 Art. 29 ›   │
│ Pasal 3  ▲1  │ (1) Permohonan hanya dapat …         │ [Apply proposal] [Open]  │
│ Pasal 4  ▲1  │ (2) …                                │                          │
│ + Add article│                                      │ Related sources (3) ›    │
│ Closing      │                                      │ Ask the library ›        │
└──────────────┴──────────────────────────────────────┴──────────────────────────┘
```

- **Outline kiri**: struktur naskah (pembukaan, pasal, penutup) dengan titik status per pasal dari hasil Verify (jumlah temuan, warna tingkat). Klik → lompat ke pasal; seret untuk urutan (opsional, fase berikut).
- **Editor tengah**: naskah formal seperti sekarang, satu kolom, tanpa duplikasi judul. Bagian pembukaan/penutup bisa dilipat.
- **Rail Insights kanan** (menggantikan panel asisten 5 tab): kontekstual untuk pasal yang sedang disunting — temuan untuk pasal itu, sumber terkait, usulan revisi (bisa diterapkan bila hasilnya untuk versi ini), dan tautan "Ask the library". Simulasi dan forum persona **dipindah sepenuhnya ke Test impact**.
- **Focus mode** tetap ada (menu ⋯), tetapi tampil sebagai chip "Focus mode · Exit" di bar dokumen agar tidak tersembunyi.

### 5.2 Verify sources

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ Checked v3 · as of 17 Oct 2026 · 29 sources · 3 findings (2 high, 1 medium)   │  ringkasan satu baris
├───────────────────────────┬───────────────────────────────────────────────────┤
│ ● High  Pasal 2           │ Service access may exclude certain groups         │
│   Service access may …    │ DRAFT v3            → PROPOSED                    │
│ ● High  Pasal 3           │ (1) … hanya dapat …   (1) … atau kanal pendamping │  diff berwarna
│ ● Med   Pasal 4           │ Sources: UU 25/2009 Art. 29 ✓ · UU 8/2016 Art. 19 │
│                           │ Why it matters · Alternative reading (collapsible)│
│ [All 3][High 2][Med 1]    │ [Apply to draft]  [Mark reviewed…]  ‹ prev  next ›│
└───────────────────────────┴───────────────────────────────────────────────────┘
```

- **Master–detail**: daftar temuan ringkas di kiri, detail di kanan (mobile: daftar → detail layar penuh dengan tombol kembali). Navigasi `J/K` atau prev/next.
- **Diff berwarna** draft vs usulan, bukan dua kotak teks berdampingan.
- **Setelah menerapkan satu usulan**: banner jelas "Draft is now v4 — re-check to apply the remaining 2 proposals" + tombol *Re-check v4*; tombol Apply lain dinonaktifkan **dengan alasan tertulis** (menggantikan tombol yang tampak tidak merespons).
- **Keputusan reviewer** per hasil tetap (catatan wajib) tetapi dipindah ke tombol "Mark reviewed…" di bar detail.
- Tanggal analisis dan batasan review dipindah ke ringkasan (tooltip/tautan), bukan blok terpisah.

### 5.3 Test impact

Alur terpandu tiga langkah dalam satu layar, hasil diringkas dulu:

1. **Alternative B** — editor naskah B dengan **diff terhadap A**. Tombol *Start from applied proposals* mengisi B dari usulan Verify; *Compare A/B* nonaktif dengan pesan "Alternative B is identical to the draft" sampai ada perbedaan (mengatasi hasil "+0").
2. **Assumptions** — panel ringkas (6 angka) dengan label sumber angka; tidak lagi menempel di samping seluruh halaman.
3. **Results** — kartu utama A vs B (dilayani, tidak terlayani, biaya, beban staf, selisih), satu grafik batang kecil, dan peringatan *outdated* bila draft berubah.

Sub-bagian di bawah hasil, masing-masing **bisa dibuka**: *Stakeholder benefits & risks*, *Sensitivity ±10 pts* (tabel + rumus), *Public forum* (forum persona + crowd network yang sudah ada), *Unified review*. Forum persona tetap job terpisah dengan progres live seperti sekarang.

## 6. Mobile

- Bar dokumen ringkas + stepper horizontal sticky di atas; tombol utama di ujung kanan.
- Draft: outline menjadi lembar bawah (*Outline* chip), Insights menjadi lembar bawah per pasal.
- Verify: daftar temuan → detail layar penuh.
- Test impact: tiga langkah bertumpuk; sub-bagian tertutup default.
- Target: konten pertama terlihat ≤ 200 px dari atas; tanpa scroll horizontal di 360/390/768/1024 px.

## 7. Data dan teknis

- **Tidak ada endpoint baru yang wajib.** Temuan sudah memuat nomor pasal (`article_number`) untuk titik status di outline dan rail Insights; diff dihitung di front-end; status tahap memakai `/api/overview` yang sudah ada.
- *Start from applied proposals* disusun di front-end dari `proposed_text` per temuan (tetap diperiksa pengguna sebelum dibandingkan).
- Komponen dibangun sebagai island React di `frontend/src/components/studio/` (DocumentBar, StageStepper — dipakai bersama Overview, Outline, InsightsRail, FindingsList/Detail, DiffView, ImpactSteps), bertahap menggantikan HTML string di `app.js`. Semua aksi tetap lewat jembatan `data-action` yang ada (`save`, `analyze`, `apply`, `simulate`, `start-agent`, `export`, `report`, `review`) agar perilaku dan validasi server tidak berubah.
- **Kompatibilitas tes**: skrip browser dan DOM merujuk `#workflow-stage-*`, `.finding`, `[data-action=apply]`, `.studio-tabs`, `#draft-title`, `#legal-date`, `#alternative`, `#ass-*`. ID dan nama aksi dipertahankan bila memungkinkan; sisanya diperbarui bersama implementasi (seperti pada Overview).

## 8. Implementasi bertahap

| Fase | Isi | Estimasi |
|---|---|---|
| 1. Kerangka | Bar dokumen sticky + stepper bersama + menu ⋯; hapus banner, baris dokumen, kartu tahap, aksi ganda; istilah konsisten | 1 hari |
| 2. Verify | Master–detail, diff, banner pasca-apply, keputusan reviewer | 1–1,5 hari |
| 3. Draft | Outline dengan status, rail Insights per pasal, Focus mode yang terlihat | 1–1,5 hari |
| 4. Test impact | Alur 3 langkah, diff B vs A, *Start from applied proposals*, ringkasan hasil, sub-bagian lipat | 1–1,5 hari |
| 5. QA | Audit klik + alur per tahap (seperti Overview), mobile 360–1440, tes browser/DOM/komponen, reduced motion | 0,5–1 hari |

Total ±5–6 hari kerja. Setiap fase bisa di-deploy sendiri.

**Kriteria selesai**
- Di ketiga tahap, naskah atau temuan pertama terlihat tanpa scroll (desktop) dan ≤ 200 px dari atas (mobile).
- Tidak ada aksi yang muncul dua kali di layar.
- Perbandingan A/B tidak bisa dijalankan dengan B identik dengan A.
- Setelah usulan diterapkan, alasan usulan lain tidak bisa diterapkan selalu tertulis.
- Audit klik dan alur end-to-end lulus; tanpa scroll horizontal; tes proyek lulus.

## 9. Risiko

| Risiko | Mitigasi |
|---|---|
| Perubahan besar pada layar paling sering dipakai | Bertahap per fase, perilaku server tidak diubah, tes alur sebelum tiap deploy |
| Rail Insights terlalu padat di layar 1024–1280 px | Rail bisa dilipat; di bawah 1180 px menjadi lembar samping |
| Prefill B dari usulan menimbulkan teks yang tidak koheren | Selalu tampil sebagai diff yang harus ditinjau; tidak pernah langsung dibandingkan |
| Tes lama merujuk struktur lama | Pertahankan ID/aksi utama; perbarui tes dalam fase yang sama |

## 10. Keputusan yang dibutuhkan

1. **Panel asisten di tahap Draft** diganti rail *Insights per pasal* (simulasi dan forum hanya di Test impact)? — rekomendasi: **ya**.
2. **Verify sources** memakai tata letak master–detail? — rekomendasi: **ya**.
3. **Prefill alternatif B** dari usulan Verify (*Start from applied proposals*)? — rekomendasi: **ya**.
4. **Urutan pengerjaan**: mulai dari Kerangka + Verify (dampak terbesar untuk demo), atau langsung semua fase?

Keputusan (17 Oktober 2026): 1 ya, 2 ya, 3 ya, 4 semua fase.

## 11. Implementasi dan audit (17 Oktober 2026)

**Catatan teknis.** Berbeda dari §7, revamp dibangun di renderer HTML yang sudah ada (`app/static/app.js`), bukan island React baru. Alasannya, ketiga tahap bergantung pada jembatan `data-action`, validasi galat per field, kunci peran, dan alur simpan-sebelum-pindah yang sudah teruji. Menulis ulang ke React akan menggandakan logika itu tanpa manfaat bagi pengguna. Gaya baru ada di `app/static/studio.css`; fungsi murni (diff kata, `sameText`, prefill B) ada di `app/static/studio.js`.

**Yang berubah**

| Fase | Hasil |
|---|---|
| Kerangka | Bar dokumen sticky (`.ps-bar`): pemilih draft sebagai judul, jenis, jumlah pasal, status simpan, satu tombol utama per tahap, menu **More** (Import, Export DOCX, Review report, Draft versions, New draft from a brief, Focus mode, Legal guidelines; navigasi panah/Escape). Stepper `#workflow-stage-*` dengan status done/older/todo. Banner judul, kartu konteks dokumen, kartu tahap, tombol ganda, dan panduan lipat di bawah halaman dihapus; `h1` tersembunyi tetap ada untuk pembaca layar. Istilah konsisten: Draft · Verify sources · Test impact (breadcrumb, stepper, Activity). |
| Verify | Ringkasan satu baris (versi, tanggal, sumber, temuan per tingkat, status review + Reviewer notes). Master–detail dengan filter, J/K, panah, dan prev/next. Diff kata draft → usulan. Banner "Draft is now vN — re-check to apply the remaining N proposals". Tombol Apply nonaktif dengan alasan tertulis; usulan yang sudah masuk draft ditandai "Already in the draft". Batasan dan konteks hukum dalam satu panel lipat. Di mobile: daftar → detail layar penuh dengan tombol kembali. |
| Draft | Outline kiri (pembukaan, pasal + jumlah temuan berwarna per tingkat, penutup, Add article). Naskah di tengah; pembukaan dan penutup bisa dilipat. Rail **Insights** kanan mengikuti pasal yang sedang disunting: temuan, diff usulan, Apply, Open in Verify, sumber terkait, Ask the library, Check/Re-check; bila pasal itu bersih, rail menunjuk pasal lain yang punya temuan. Focus mode lewat menu More dengan chip "Focus mode · Exit" yang terlihat. Di mobile Insights menjadi lembar bawah. |
| Test impact | Tiga langkah: (1) Alternative B dengan diff langsung terhadap A, **Start from Verify proposals**, dan **Reset to draft A**; (2) enam asumsi; (3) hasil A/B + delta, dengan *Stakeholder benefits & risks* dan *Sensitivity ±10 points & formula* tertutup default. **Compare A/B** nonaktif selama B identik dengan A (juga ditolak di sisi aksi). B diisi dari hasil perbandingan terakhir bila versinya masih sama. |
| Data | `defaultAlt()` (teks Pasal 2 hardcode) dan daftar persona cadangan hardcode (Sari, Nadia, Bima, Raka, Dewi) dihapus. Modal hasil forum di Activity tidak lagi memakai peta persona hardcode; jumlah persona dan ronde dibaca dari payload. |
| Pembersihan | Panel asisten (`studioPanel`), `agentPanel`, mode `social-compact`, aksi `studio-tab` / `open-studio` / `go-sim` / `go-social`, dan 209 selector CSS mati (±960 baris) dihapus. |

**Ukuran halaman** (draft contoh yang sudah dicek dan disimulasikan)

| Tahap | Sebelum (desktop / mobile) | Sesudah (desktop / mobile) |
|---|---|---|
| Draft | 2.905 / 4.642 px | 1.761 / 2.158 px |
| Verify sources | 3.444 / 4.831 px | 1.291 / 1.243 px |
| Test impact | 4.980 / 9.896 px | 2.092 / 4.085 px |

**Audit end-to-end**: 90 dari 90 pemeriksaan lulus. Cakupannya kerangka, menu More (termasuk keyboard), alur Draft (rail, outline, simpan, Ctrl+S, apply, focus mode, add/remove, Ask the library), Verify (master–detail, J/K, pager, filter, apply → banner, re-check dengan tanggal, reviewer notes), Test impact (B identik terkunci, prefill dari usulan, reset, diff langsung, compare, sub-tab forum/unified, apply B), panduan **?**, tanpa overflow horizontal di 360/390/768/1024/1440 px, lembar Insights dan daftar → detail di mobile, serta tanpa error JavaScript.

**Bug yang ditemukan dan diperbaiki saat audit**
- Animasi masuk `#main` menyisakan `transform`, sehingga elemen `position: fixed` (tombol dan lembar Insights) ikut terkurung di dalam `#main`. Di studio, animasinya kini hanya fade.
- Pasal awal rail tidak memilih pasal yang punya temuan, karena `null >= 0` bernilai benar di JavaScript.
- Ringkasan bagian Opening melebar di layar 390 px.
- Diff kata berselang-seling per kata sehingga sulit dibaca. Kini perubahan yang berdekatan digabung menjadi satu frasa dihapus dan satu frasa ditambah.
- "1 findings" di stepper.

**Tes yang diperbarui**: `scripts/browser_demo.cjs`, `browser_smoke.cjs`, `browser_studio.cjs`, `browser_social.cjs`, `browser_drafting_network.cjs`, `dom_workspace_ux.cjs`, `capture_ui.cjs`. Semuanya beralih dari selector lama (`.page-heading`, `#tab-*`, `.studio-*`) ke bar, rail, dan langkah baru. Simulasi di editor kini diuji di tahap Test impact. Panduan pengguna (`docs/USER_GUIDE.md` → `app/static/guide.html`) ikut diperbarui.

**Hasil tes**

| Tes | Hasil |
|---|---|
| `browser_studio` | Lolos, termasuk peran viewer |
| `browser_demo` | Lolos (17 kelompok, termasuk CSP produksi) |
| `browser_smoke` | Lolos penuh. Sebelumnya tes ini berhenti di langkah pembandingan library karena urutan korpus berubah; asersi lama di bagian berikutnya (navigasi mobile, menu history, filter PP, label riwayat) ikut diperbarui. |
| `browser_drafting_network` | Lolos |
| `dom_workspace_ux` | 57 pemeriksaan lolos |
| Komponen | 14 tes lolos |
| Backend | 173 lolos; `test_corpus_integrity` gagal karena ada pasal kosong dari data scraping (sudah diketahui, di luar revamp) |
| `browser_social` | Masih gagal di baris 19, sebelum langkah studio. Tes ini mengharapkan forum 5 persona × 3 ronde, sedangkan default sekarang 24 × 4. Kerusakan ini sudah ada sebelum revamp. |

## 12. Knowledge graph gaya MiroFish (17 Oktober 2026)

**Masalah.** Jaringan sebenarnya sudah dirender, tetapi tidak terlihat. Letaknya di sub-tab forum, ±1.100 px (graf persona) dan ±2.800 px (crowd network) dari atas, di bawah banner, judul, dan form konfigurasi. Knowledge graph hasil ekstraksi (di produksi 31 entitas dan 62 relasi) hanya tampil sebagai daftar chip di panel lipat paling bawah.

**Perubahan**
- Modul baru `app/static/kg-graph.js` dengan graf force-directed (d3):
  - Warna per tipe entitas, cincin sikap persona, dan label relasi yang bisa dinyalakan.
  - Zoom, pan, drag node, pencarian, legend yang bisa difilter, dan layar penuh.
  - Panel detail yang menampilkan relasi dan bisa dinavigasi.
  - Kanvas potret di layar sempit.
- **Forum:** panel jaringan utama dengan tiga tampilan, yaitu Knowledge graph (default setelah run selesai), Crowd network, dan Persona network. Bagian atas diringkas: konteks A/B dan pengaturan run digabung dalam satu bar. Feed percakapan serta isu dan mitigasi dipindah ke bawah panel.
- **Navigasi silang:** node stakeholder membuka opini persona; node pasal membuka pasal itu di Draft.
- **Draft:** rail Insights menampilkan "Stakeholder map" untuk pasal yang sedang disunting. Klik node membuka graf penuh dengan entitas itu terpilih.
- **Activity:** detail run forum menampilkan knowledge graph yang sama.
- Daftar relasi lama di panel crowd, banner konteks, dan CSS mode compact dihapus.

**Audit**: 24 dari 24 pemeriksaan alur graf lolos, mencakup:
- Tab dan klik node, navigasi relasi, label, filter tipe, pencarian, dan zoom.
- Stakeholder → persona, pasal → Draft, mini-graf → graf penuh, dan modal Activity.
- Tampilan 390/768/1024 px tanpa overflow, tanpa error JS.

`browser_drafting_network`, `browser_demo`, `dom_workspace_ux`, dan `capture_ui` diperbarui agar membuka tab Persona network sebelum berinteraksi dengan graf persona.
