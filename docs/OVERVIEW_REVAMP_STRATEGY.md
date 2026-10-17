# Strategi Revamp Menu Overview — "fresh dan mudah dioperasikan"

Status: **diimplementasikan** (lihat §13). Bagian 1–12 adalah strategi awal. Dasar analisis: screenshot Overview saat ini (desktop 1440 px dan mobile 390 px, mode demo, satu draft contoh) dan kode `frontend/src/components/workspace.tsx` (`HomeWorkspace`).

## 1. Kondisi sekarang

Urutan blok di Overview hari ini (tinggi halaman: 1.900 px di desktop, 3.570 px di mobile):

1. Banner "Regulation desk" dengan ilustrasi dekoratif + tombol *Import document* dan *New draft*.
2. Empat kartu metrik: Draft (1), Regulation sources (838), Results on the document (0), Agents running (0).
3. Kartu "Active draft": cuplikan Pasal 1 + *Continue drafting* + *Learn from documents*.
4. "Your drafts" (tabel) berdampingan dengan "Needs attention" (angka besar 0).
5. "Continue your workflow": tiga kartu besar Draft → Review → Test impact.
6. Bar provenance: jumlah sumber, status provider, tautan data & library.
7. Panel lipat "Start from the policy goal".

### Masalah yang terlihat

| # | Masalah | Bukti |
|---|---|---|
| 1 | **Informasi berulang** | Jumlah regulasi tampil 3× (chip topbar, kartu metrik, bar provenance); status demo/provider 2×; ajakan "lanjutkan draft" 3× (*Continue drafting*, kartu workflow 01, tombol *Open*) |
| 2 | **Angka nol mendominasi** | Dua dari empat metrik dan blok "Needs attention" berisi 0 dengan tipografi terbesar di layar; pengguna baru melihat halaman "kosong" |
| 3 | **Tidak tahu status draft** | Overview tidak menunjukkan draft aktif sudah sampai mana (sudah dicek sumber? ada temuan yang belum direview? hasil uji dampak usang karena versi baru?) |
| 4 | **Tidak ada "langkah berikutnya" yang jelas** | Lima tombol utama bersaing (Import, New draft, Continue drafting, Start from a brief, Review results) tanpa prioritas |
| 5 | **Daftar draft miskin informasi** | Hanya judul, jenis, dan versi; tanpa tanggal ubah, tahap, atau temuan — dan data run/job hanya dimuat untuk draft terpilih |
| 6 | **Aktivitas tak terlihat** | Riwayat agen dan audit hanya ada di menu Activity |
| 7 | **Mobile** | Konten melebar ke samping (chip topbar terpotong, `scrollWidth` > lebar layar), navigasi sidebar menjadi strip horizontal yang meluber, halaman sangat panjang |
| 8 | **Ruang terbuang** | Banner + ilustrasi dan tiga kartu workflow memakan ±45% layar pertama tanpa data |

## 2. Tujuan

1. **Satu klik untuk melanjutkan pekerjaan** — draft terakhir + tahap berikutnya selalu di atas.
2. **Status yang bisa dipindai dalam 5 detik** — setiap draft menunjukkan tahapnya (Draft → Verify → Test impact) dan apa yang menunggu keputusan.
3. **Satu tempat untuk tiap informasi** — tidak ada angka atau tombol yang diulang.
4. **Terasa segar dan konsisten dengan landing baru** — terang, lega, aksen merah RuleLab, gerak halus (bukan dekorasi).
5. **Nyaman di mobile** — satu kolom, prioritas jelas, tanpa scroll horizontal.

## 3. Prinsip desain

- **Tindakan dulu, statistik kemudian.** Angka hanya tampil jika membantu keputusan; nol diganti status kalimat ("All clear").
- **Status selalu terikat versi.** Setiap hasil menyebut versi draft yang dipakainya; hasil dari versi lama ditandai *outdated* (sesuai prinsip produk: hasil lama tidak boleh menimpa versi baru).
- **Progressive disclosure.** Detail (temuan, persona, sumber) tetap di Policy Studio/Activity; Overview hanya ringkasan + tautan dalam.
- **Kosong itu panduan.** Pengguna baru (hanya draft contoh) mendapat checklist singkat, bukan dasbor kosong.
- **Hormati peran.** Viewer/reviewer tidak melihat tombol membuat draft; reviewer melihat antrean review di posisi teratas.

## 4. Tata letak baru

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Good afternoon.                                   [ ⌘K Search ]  [+ New ▾]  │  1 · Header ringkas
│ 3 drafts · 2 results need review                                (brief/blank/import)
├───────────────────────────────────────────────┬──────────────────────────────┤
│ CONTINUE WHERE YOU LEFT OFF                    │ NEEDS YOUR ATTENTION     (2) │
│ Layanan Publik Digital yang Inklusif   PP · v3 │ ● 3 findings awaiting review │  2 · Lanjutkan
│ edited 12 min ago                              │   Draft v3 · Source check  → │  3 · Kotak masuk
│                                                │ ◐ Public forum running 60%   │
│  ● Draft ──────── ● Verify ──────── ○ Impact   │   Round 2 of 4             → │
│   v3 saved        3 findings, 1 open  not run  │ ⚠ Impact test is outdated    │
│                                                │   ran on v2, draft is v3   → │
│ Next step:  [ Review 3 findings → ]            │                              │
│             Run impact test · Open editor      │ (empty: “All clear ✓”)       │
├───────────────────────────────────────────────┴──────────────────────────────┤
│ YOUR DRAFTS                    [ search… ] [ All · Needs review · Outdated ] │
│ Title                         Type   Stage            Updated        Version │  4 · Daftar draft
│ Layanan Publik Digital …      PP     ●●○ 1 to review  12 min ago      v3   → │
│ Perlindungan Upah …           Perda  ●○○              yesterday       v1   → │
├───────────────────────────────────────────────┬──────────────────────────────┤
│ RECENT ACTIVITY                                │ QUICK START                  │
│ 10:42 Source check finished · 3 findings       │ ✎ Draft from a brief         │  5 · Aktivitas
│ 10:31 Article 2 edited → v3                    │ ⇪ Import a document          │  6 · Mulai cepat
│ 09:58 Public forum started · 16 personas       │ ⌕ Ask the legal library      │
│ View all activity →                            │ ⌖ Explore the regulation map │
├───────────────────────────────────────────────┴──────────────────────────────┤
│ Collection: 838 regulations · 25,310 articles · Gemini (live)   Data & map → │  7 · Footer ringkas
└──────────────────────────────────────────────────────────────────────────────┘
```

### Detail per blok

| # | Blok | Isi dan perilaku | Menggantikan |
|---|---|---|---|
| 1 | **Header** | Sapaan sesuai waktu + satu kalimat status ("3 drafts · 2 results need review"). Tombol **New ▾** (split): *Draft from a brief* (default), *Blank from template*, *Import document*. Pemicu ⌘K terlihat. | Banner + ilustrasi, dua tombol terpisah |
| 2 | **Continue where you left off** | Draft yang terakhir diubah: judul, jenis, versi, waktu ubah. **Stepper 3 tahap** dengan status nyata: Draft (versi tersimpan / ada perubahan belum disimpan), Verify (belum dicek / berjalan / N temuan, M terbuka / *outdated*), Test impact (belum / A/B selesai / forum berjalan / *outdated*). Satu tombol **Next step** dihitung otomatis (aturan di §5) + dua tautan sekunder. | Kartu Active draft + tiga kartu workflow + 2 metrik |
| 3 | **Needs your attention** | Daftar yang bisa diklik, diurutkan menurut urgensi: hasil menunggu review, job berjalan (progres live), job gagal/terinterupsi, hasil *outdated*, perubahan belum disimpan. Kosong → "All clear" kecil. | Blok angka 0 + metrik "Agents running" |
| 4 | **Your drafts** | Tabel ringkas: judul, jenis, **mini-stepper tahap**, badge "N to review"/"Outdated", waktu ubah relatif, versi. Pencarian + filter chip (*All · Needs review · Outdated · Running*). Klik baris = buka di Policy Studio pada tahap yang relevan. Mobile: kartu bertumpuk. | Tabel 3 kolom |
| 5 | **Recent activity** | 5 peristiwa terakhir lintas draft (revisi tersimpan, job selesai/gagal, review diputuskan, ekspor). Tautan "View all activity". | Tidak ada (hanya di menu Activity) |
| 6 | **Quick start** | Empat aksi ringkas dengan ikon; disembunyikan untuk viewer. | Panel "Start from the policy goal" + bar provenance (sebagian) |
| 7 | **Footer ringkas** | Satu baris: ukuran koleksi (live), provider (Gemini live / Demo), tautan Data & map. Chip yang sama di topbar dihapus atau topbar hanya menampilkan provider. | Metrik "Regulation sources", bar provenance, chip duplikat |

**Pengguna baru** (hanya draft contoh, belum pernah menjalankan pengecekan): blok 2 diganti kartu **Get started** dengan checklist 4 langkah yang tercentang otomatis dari data — *Open the sample draft* · *Run a source check* · *Test the impact* · *Create your own draft from a brief* — dan bisa ditutup.

## 5. Aturan "Next step"

Dihitung dari data draft aktif, urutan pertama yang cocok menang:

| Kondisi | Tombol utama |
|---|---|
| Ada perubahan belum disimpan | **Save draft** |
| Job sedang berjalan | **View progress** (ke panel agen) |
| Ada temuan yang belum direview pada versi saat ini | **Review N findings** |
| Belum pernah dicek, atau pengecekan terakhir dari versi lama | **Run source check on vN** |
| Pengecekan beres, uji dampak belum ada atau *outdated* | **Test the impact** |
| Semua tahap terbaru selesai | **Export to Word** (+ tautan *Run public forum*) |

## 6. Data yang dibutuhkan

Saat ini front-end hanya memuat `runs` dan `jobs` untuk draft terpilih, sehingga status per draft tidak bisa ditampilkan. Usulan satu endpoint baca yang ringan:

```
GET /api/overview
{
  "drafts": [{ "id", "title", "regulation_type", "revision", "updated_at",
               "analysis": { "revision", "findings", "open", "review_status" } | null,
               "impact":   { "revision", "kind": "simulation" | "social" } | null,
               "active_job": { "intent", "status", "progress" } | null }],
  "attention": [{ "kind", "draft_id", "label", "detail", "href" }],
  "activity":  [{ "at", "draft_id", "label" }]           // 10 terakhir
}
```

- Dihitung di backend dari tabel `drafts`, `runs`, `agent_jobs`, `agent_events`, dan `audit_events` yang sudah ada (SQLite dan PostgreSQL); tidak ada tabel baru.
- Satu query per tabel, dibatasi (mis. 50 draft terakhir), aman dipanggil saat Overview dibuka dan setiap kali polling job selesai.
- Menghormati peran: reviewer/viewer mendapat daftar yang sama tanpa aksi tulis.

## 7. Sistem visual dan gerak

- Ikuti bahasa visual landing baru: latar putih, kartu `border` tipis + radius 20–24 px, tipografi Manrope tegas, aksen merah hanya untuk aksi utama dan status yang butuh perhatian; hijau untuk selesai, kuning untuk *outdated*.
- **Stepper** sebagai elemen identitas Overview (titik + garis, terisi sesuai tahap).
- Gerak (komponen MagicUI yang sudah ada di repo, ringan): `BlurFade` saat blok pertama tampil, `NumberTicker` hanya di header ringkas, `BorderBeam` tipis di kartu "Continue" ketika ada job berjalan, `AnimatedList` untuk aktivitas baru. Semua mati di `prefers-reduced-motion`.
- Dihapus: ilustrasi dekoratif banner, kartu metrik bernilai nol, kartu workflow besar.

## 8. Mobile

- Urutan satu kolom: Header → Continue (stepper vertikal) → Attention → Quick start (grid 2×2) → Drafts (kartu) → Activity.
- Perbaiki overflow yang ada: chip topbar dipindah ke menu/disembunyikan di < 640 px; navigasi sidebar menjadi bottom bar 5 ikon atau drawer, bukan strip yang meluber.
- Target: tanpa scroll horizontal di 360/390/768 px; tinggi halaman pengguna baru < 2.200 px.

## 9. Aksesibilitas

- Stepper dibaca sebagai daftar berurutan dengan status teks ("Verify: 3 findings, 1 open").
- Semua kartu yang bisa diklik adalah tautan/tombol nyata dengan label jelas; urutan fokus mengikuti urutan visual.
- Pembaruan job berjalan diumumkan lewat `aria-live="polite"` sekali per perubahan status, bukan per persen.

## 10. Implementasi

| Fase | Pekerjaan | Estimasi |
|---|---|---|
| 1. Data | Endpoint `GET /api/overview` + tes (SQLite & PostgreSQL) | 0,5 hari |
| 2. Komponen | `OverviewHeader`, `ContinueCard` + `StageStepper` + aturan Next step, `AttentionList`, `DraftTable` (search/filter), `ActivityFeed`, `QuickStart`, `GetStarted` — semua di `frontend/src/components/overview/` | 1–1,5 hari |
| 3. Integrasi | Ganti `HomeWorkspace`; hubungkan aksi ke handler yang sudah ada di `app.js` (`data-action`, `data-view`); polling job yang sudah ada memicu refresh ringkasan | 0,5 hari |
| 4. Mobile & topbar | Perbaikan overflow topbar dan navigasi | 0,5 hari |
| 5. QA | Perbarui tes yang merujuk elemen lama (`.home-banner` di 4 skrip browser, `.workspace-path` di `browser_smoke.cjs`), tes komponen baru, screenshot 360/390/768/1440, reduced-motion | 0,5 hari |

**Kriteria selesai**
- Draft terakhir bisa dilanjutkan dalam 1 klik dari Overview; tombol Next step benar untuk keenam kondisi di §5 (diuji).
- Tidak ada angka/informasi yang muncul lebih dari sekali di layar.
- Tahap setiap draft terlihat di daftar tanpa membuka draft.
- Tanpa scroll horizontal di 360–768 px; tes browser dan komponen lulus.

## 11. Risiko

| Risiko | Mitigasi |
|---|---|
| Endpoint ringkasan lambat dengan banyak draft | Batasi 50 draft terbaru + indeks yang sudah ada (`runs_draft_idx`); paginasi bila perlu |
| Status "outdated" membingungkan | Selalu tampilkan versi asal dan versi sekarang ("ran on v2, draft is v3") + tombol perbaiki langsung |
| Perubahan topbar/sidebar berdampak ke halaman lain | Kerjakan sebagai fase terpisah dengan screenshot regresi semua view |
| Aplikasi saat ini gagal memulai tanpa draft sama sekali | Pertahankan draft contoh untuk sekarang; kartu Get started menangani kondisi "hanya contoh" |

## 12. Keputusan yang dibutuhkan

1. Navigasi mobile: **bottom bar 5 ikon** atau **drawer** (tombol menu)?
2. Header: pakai sapaan ("Good afternoon") atau judul netral ("Overview")?
3. Apakah topbar tetap menampilkan ukuran koleksi, atau cukup di footer Overview dan Data dashboard?
4. Checklist "Get started" untuk pengguna baru: diaktifkan?

## 13. Keputusan, implementasi, dan audit (16 Oktober 2026)

**Keputusan:** navigasi mobile = bottom bar 5 tab (dipilih karena kelima menu selalu terlihat dan terjangkau ibu jari) · header dengan sapaan · ukuran koleksi tetap di chip topbar desktop (tidak diulang di Overview, disembunyikan di mobile) · tanpa checklist "Get started".

| Bagian | File |
|---|---|
| Endpoint ringkasan | `app/services/overview.py`, `GET /api/overview`, tes `tests/test_overview.py` |
| Komponen | `frontend/src/components/overview.tsx` (header, Continue + stepper + Next step, Needs your attention, Your drafts dengan cari/filter, Recent activity, Quick start); tipe di `state.ts` |
| Integrasi | `app.js`: `loadOverview()` (dipanggil saat Overview dirender dan saat job selesai), aksi `open-draft-at` dan `export-draft` |
| Gaya | `app/static/overview.css` (kelas `ov-*` + bottom bar mobile); panduan Overview di `workspace-ux.js` menunjuk elemen baru |
| Dihapus | `HomeHero`, `BentoStats`, `HomeWorkspace` lama; panel lipat panduan di Overview (panduan tetap lewat tombol ?) |

**Audit end-to-end** (`overview_audit2.cjs` + `overview_flows2.cjs`, data contoh 3 draft, 27 skenario — semuanya lulus): sapaan + status; Continue = draft terakhir diubah; Search membuka command menu; New ▾ membuka tiga alur; menu menutup saat fokus keluar; item perhatian membuka draft dan tahap yang benar; Next step membuka tahap yang tepat; filter dan pencarian; draft baru dari brief muncul sebagai Continue dan di aktivitas; perubahan judul di editor tercermin; tur bantuan menyorot blok Overview; mobile tanpa scroll horizontal, 5 tab satu baris, tab bernavigasi, kartu terakhir tidak tertutup; tanpa error JS.

**Bug yang ditemukan dan diperbaiki selama audit:** tombol Search melempar error (`e.target.matches`) dan tidak membuka menu; item perhatian meluber keluar kartu; panduan/tur bantuan Overview menunjuk selektor lama sehingga tidak menyorot apa pun; kode jenis peraturan tampil mentah; overflow mobile (chip topbar dan strip navigasi); Quick start berisi 5 kotak.

**Temuan di luar Overview (belum diubah):** form Guided draft dan Brief baru divalidasi oleh server (respons 422, pesan muncul sebagai toast, field tidak difokuskan); modal Import hanya punya tombol ✕ tanpa Cancel dan menampilkan toast "Extracting…" sebelum validasi file; `browser_smoke.cjs` gagal di perbandingan Legal library karena korpus yang terus bertambah membuat dokumen default tidak punya Pasal 4.
