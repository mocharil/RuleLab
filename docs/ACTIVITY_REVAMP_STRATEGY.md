# Strategi Revamp Activity — "satu jejak keputusan yang bisa diaudit"

Dokumen strategi; implementasi dan hasil audit ada di §10. Dasar analisis (17 Oktober 2026): demo lokal terisolasi dengan data nyata dari tiga run tim agen (*legal*, *full*, *social*) → 4 hasil tersimpan (2 cek sumber, 1 simulasi, 1 forum publik), diperiksa di 1440 px dan 390 px; kode `history()`, `mountActivity()`, `activitySummary()`, `actions['run-detail']`, `review`, `versions` di `app.js`, `agents.js`, serta `store.runs/review_run/history` dan `/api/audit` di backend.

## 1. Kondisi sekarang

| Ukuran | Desktop 1440 px | Mobile 390 px |
|---|---|---|
| Daftar hasil mulai | ±710 px (di bawah hero, baris draft, 4 KPI, 2 kartu tab, filter) | ±880 px |
| Tinggi tab *Agent runs* (1 run social terakhir) | **4.459 px** | **5.891 px** |
| Baris jejak eksekusi untuk 1 run social | 34 langkah, 26 di antaranya "Persona response" identik; 417 event | sama |
| *Execution history* (daftar run) | di bawah jejak, ±4.000 px | ±5.500 px |

Urutan isi: hero "Activity" + ilustrasi + *View draft versions* → baris draft aktif → 4 KPI (*Saved results, Awaiting review, With notes, Active runs*) → 2 kartu tab besar (*Results & review* / *Agent runs*) → filter (All/Checks/Simulation/Public forum) → daftar hasil → panduan lipat "A decision trail you can audit".

Tab *Agent runs*: 5 kartu peran agen (dekoratif) → formulir *Execution brief* (cakupan, Alternative B, 6 asumsi — sama dengan Test impact) → jejak eksekusi run terakhir → *Execution history* → panduan lipat.

Tidak ada error JavaScript atau overflow; semua tombol berfungsi.

### Masalah yang terlihat

| # | Masalah | Bukti |
|---|---|---|
| 1 | **Baris hasil tidak menyebut hasilnya** | Setiap baris hanya "Source check · v1 · tanggal · demo · Needs review" + tombol *View results* / *Review*. Untuk tahu "3 temuan, 2 tinggi" atau "B = A 70 %" harus membuka dialog satu per satu. |
| 2 | **Hasil terpisah dari run yang membuatnya** | "Saved results 4" di tab pertama, "3 runs recorded" di tab kedua; tidak terlihat bahwa run *full* menghasilkan cek sumber + simulasi. Dua tab untuk satu konsep. |
| 3 | **Semua detail di dialog** | *View results*, *Review*, *View draft versions*, dan jejak run masing-masing membuka dialog; tidak bisa membaca hasil sambil menulis catatan review. |
| 4 | **Review tanpa jejak** | `review_run` menimpa status & catatan; tidak menyimpan siapa dan kapan. Catatan lama hilang saat diubah. Halaman ini berjudul *Traceable decisions*, tetapi keputusan reviewer justru tidak terlacak (hanya baris generik di `/api/audit`). |
| 5 | **Versi draft tidak terhubung** | Dialog versi berisi `<details>` teks penuh per versi; tidak ada perbandingan antar versi, dan tidak terlihat hasil mana yang memakai versi mana. |
| 6 | **Jejak run terlalu panjang** | 26 baris "Persona response" berulang; daftar run ada di bawah jejak (±4.000 px). |
| 7 | **Formulir run menduplikasi Policy Studio** | *Execution brief* berisi Alternative B + 6 asumsi yang sama dengan *Test impact*; mudah tidak sinkron dengan yang sedang diedit di Studio. |
| 8 | **Kerangka memakan layar pertama** | Hero + ilustrasi, 4 KPI besar, 2 kartu tab besar, dan panduan lipat — pola yang sudah dihapus di Overview, Data dashboard, dan Legal library. |
| 9 | **Ringkasan dialog simulasi dangkal** | Hanya A vs B (akses %, dilayani, biaya) tanpa selisih; tidak ada tautan untuk membuka hasil itu di Policy Studio. |
| 10 | **KPI membingungkan** | "Active runs 0 · 3 runs recorded", "With notes 0 · Documented decisions" — tidak bisa diklik untuk memfilter. |

## 2. Tujuan

1. **Satu jejak** — run agen, hasil, versi draft, dan keputusan review dalam satu timeline.
2. **Hasil terbaca tanpa membuka dialog** — setiap baris menyebut hasil utamanya.
3. **Review di samping bukti** — baca hasil dan tulis keputusan di satu panel; setiap keputusan tercatat siapa/kapan dan tidak menimpa yang lama.
4. **Versi bisa dibandingkan** — perbedaan teks antar versi dan hasil yang memakai tiap versi.
5. **Selaras dengan menu lain** — header ringkas, master–detail (pola Verify & Legal library), tanpa ilustrasi atau panduan lipat.

## 3. Prinsip

- **Antrian review di depan.** Default menampilkan yang perlu diputuskan; yang sudah direview tetap ada di timeline.
- **Bukti tidak dirangkum ulang** — detail memakai tampilan hasil yang sudah ada (temuan, forum + graf, simulasi), hanya dipindah dari dialog ke panel.
- **Run agen adalah konteks, bukan halaman sendiri.** Jejaknya diringkas (langkah berulang digabung) dan bisa dibuka penuh.
- **Tidak ada keputusan otomatis.** Agen dan review tetap tidak mengubah draft.

## 4. Tata letak baru

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Activity · Layanan Publik Digital yang Inklusif v3      [Export report] [Run team ▾]│
│ (Needs review 4) (Reviewed 0) (Outdated 1) (All 7)   Type: All ▾                   │
├──────────────────────────────────┬──────────────────────────────────────────────┤
│ VERSION 3 · 17 Oct 18.34         │ Source check · v3 · demo            Needs review│
│ ▸ Agent run full · Done · 6 steps│ 3 findings · 2 high · 23 sources               │
│   ● Source check  3 findings·2 high│ ─────────────────────────────────────────────│
│   ● Impact sim.   B +0 pp · Rp 0 │ [temuan, kutipan sumber, proposal…]            │
│ ● Public forum  B: 8 support     │                                               │
│ VERSION 2 · 16 Oct  (diff +3 −1) │ REVIEW DECISION                                │
│   ● Source check  Reviewed ✓     │ (Needs review | Reviewed with notes)          │
│ VERSION 1 · created              │ [notes…]                          [Save]       │
│                                  │ History: <reviewer> · reviewer · 17 Oct — "…" │
│                                  │ [Open in Policy Studio]                        │
└──────────────────────────────────┴──────────────────────────────────────────────┘
```

### 4.1 Header
- Judul + draft aktif (nama, versi, status simpan) + aksi **Export report** (endpoint `report` yang sudah ada) dan **Run agent team**. Hero, ilustrasi, 4 KPI besar, 2 kartu tab, dan panduan lipat dihapus.
- **Chip status sebagai filter** (menggantikan KPI): *Needs review*, *Reviewed*, *Outdated* (versi draft sudah berubah), *All*; plus filter jenis (cek sumber / simulasi / forum). Default: *Needs review* bila ada, selain itu *All*.

### 4.2 Timeline (kiri)
- Dikelompokkan per **versi draft** (terbaru di atas). Kepala versi: nomor, waktu, ringkasan perubahan (+/− pasal) — klik membuka diff di panel.
- **Run agen** sebagai grup yang memuat hasil yang dibuatnya (dari `job.result`); hasil dari Policy Studio berdiri sendiri. Run yang sedang berjalan tampil paling atas dengan langkah aktif.
- Setiap hasil menyebut **hasil utamanya**:
  - Cek sumber: "3 findings · 2 high"
  - Simulasi: "B vs A: akses +x pp · biaya ±Rp"
  - Forum: "B: n support · n conditional · n concern"
  - plus status review dan tanda *Outdated* bila versinya sudah lama.
- Keyboard: J/K atau ↑/↓ memilih item (pola Verify).

### 4.3 Panel detail (kanan)
- **Hasil**: tampilan yang sekarang ada di dialog dipindah ke panel (temuan + sumber; forum + graf pengetahuan; simulasi A/B dengan selisih dan stakeholder).
- **Keputusan review** di bawah hasil: status (segmented), catatan, *Save*; **riwayat keputusan** (siapa, peran, kapan, catatan). Viewer melihat tanpa bisa menyimpan.
- **Open in Policy Studio** (Verify / Test impact / forum) untuk hasil dari versi saat ini.
- **Run agen**: rencana koordinator, output yang dihasilkan, jejak dengan langkah berulang digabung ("Persona response × 26"), *All events* tetap tersedia, *Cancel* bila berjalan.
- **Versi**: diff kata terhadap versi sebelumnya (memakai `wordDiff`/`diffHTML` dari Studio) dan daftar hasil yang memakai versi itu.

### 4.4 Run agent team
- Tombol header membuka lembar samping: cakupan (legal / impact / full / social) + Alternative B dan asumsi **diambil dari Test impact** (bisa disunting di lembar). Kartu peran agen menjadi baris kecil di lembar ini. Run baru langsung muncul di timeline dan terpilih.

## 5. Mobile
- Chip filter di atas; timeline → ketuk → detail layar penuh dengan tombol kembali (pola Verify/Library). Review di bawah hasil; lembar *Run agent team* sebagai lembar bawah.

## 6. Data dan teknis
- **Riwayat review (backend)**: tabel baru `run_reviews(id, run_id, status, notes, reviewer, role, created_at)`; `POST /api/runs/{id}/review` menambah baris (bukan menimpa) dan tetap memperbarui `runs.review_status/notes` sebagai status terkini; `GET /api/drafts/{id}/runs` menyertakan `reviews`. SQLite & PostgreSQL. Review lama yang sudah ada tetap tampil sebagai status terkini tanpa riwayat.
- Ringkasan hasil dihitung di front-end dari `payload` yang sudah dikirim (tidak ada endpoint baru). Versi memakai `GET /api/drafts/{id}/history` (sudah ada), dimuat saat Activity dibuka.
- Pemetaan hasil → run dari `job.result` (`analysis_run_id`, `simulation_run_id`, `social_run_id`).
- URL: `?view=activity&item=run:<id>|job:<id>|version:<n>&status=…`; alias lama `tab=agents` → membuka run agen terbaru.
- Dialog `run-detail` dan `inspect-job` hanya dipakai di Activity, jadi dihapus setelah isinya pindah ke panel.

## 7. Implementasi bertahap

| Fase | Isi | Estimasi |
|---|---|---|
| 1. Kerangka | Header ringkas, chip filter, hapus hero/KPI/kartu tab/panduan; satu halaman tanpa tab | 0,5 hari |
| 2. Timeline + detail | Pengelompokan per versi & run, ringkasan per hasil, panel detail (pindahkan isi dialog), keyboard, URL | 1 hari |
| 3. Review terlacak | Tabel `run_reviews` + API + tes backend; form review & riwayat di panel | 0,5–1 hari |
| 4. Versi & run agen | Diff versi, jejak ringkas, lembar *Run agent team* yang mengambil input Test impact | 1 hari |
| 5. QA | Audit klik & alur (demo lokal, run agen nyata), 360–1440 px, viewer/reviewer, tes browser/DOM/backend, panduan pengguna | 0,5 hari |

**Kriteria selesai**
- Setiap hasil menyebut hasil utamanya di timeline; detail terbuka tanpa dialog.
- Hasil dari run agen tampil di bawah run tersebut; versi draft bisa dibandingkan.
- Setiap keputusan review tersimpan dengan reviewer & waktu, tanpa menimpa yang lama.
- Run agen bisa dimulai, dipantau, dan dibatalkan dari Activity.
- Audit klik & alur lulus; tanpa overflow; tes proyek lulus.

## 8. Risiko

| Risiko | Mitigasi |
|---|---|
| Migrasi tabel di Cloud SQL produksi | `CREATE TABLE IF NOT EXISTS` di `initialize()` (pola yang sudah dipakai); tidak mengubah tabel `runs` |
| Jejak run besar (417 event) memperlambat panel | Ringkas per agen+alat; event penuh dimuat saat *All events* dibuka |
| Tes lama merujuk `.activity-tabs`, `.history-row`, `#activity-tab-*`, `.activity-job` | Perbarui `browser_activity.cjs`, `browser_smoke.cjs`, `dom_workspace_ux.cjs` dalam fase yang sama |
| Input run agen berbeda dengan Test impact | Lembar mengambil nilai Test impact saat dibuka dan menyebut sumbernya |

## 9. Keputusan yang dibutuhkan

1. **Satu timeline master–detail** (run, hasil, versi, review) menggantikan dua tab *Results & review* / *Agent runs*? — rekomendasi: **ya**.
2. **Riwayat review di backend** (siapa/kapan, tidak menimpa; tabel baru `run_reviews`)? — rekomendasi: **ya**.
3. **Formulir run agen jadi lembar samping** yang mengambil Alternative B & asumsi dari Test impact? — rekomendasi: **ya**.
4. **Urutan pengerjaan**: semua fase, atau mulai dari Fase 1–2?

Keputusan (17 Oktober 2026): 1 ya, 2 ya, 3 ya, 4 semua fase.

## 10. Implementasi dan audit (17 Oktober 2026)

**Perubahan**
- **Backend:**
  - Tabel baru `run_reviews(id, run_id, status, notes, reviewer, role, created_at)` di SQLite dan PostgreSQL (`CREATE TABLE IF NOT EXISTS`, tabel `runs` tidak diubah).
  - `POST /api/runs/{id}/review` menambah satu baris keputusan dengan reviewer dan peran dari token, lalu memperbarui status terkini di `runs`.
  - `GET /api/drafts/{id}/runs` dan `get_run` menyertakan `reviews` (terbaru di atas). Keputusan lama tanpa riwayat tampil sebagai "reviewer not recorded".
- **Frontend** (`activity.js` dan `activity.css` baru; `agents.js` dihapus):
  - **Kerangka:** header ringkas (judul, pemilih draft, versi, jumlah hasil/run, *Review report*, *Run agent team*). Hero, ilustrasi, 4 KPI, 2 kartu tab, dan panduan lipat dihapus.
  - **Filter:** chip *Needs review / Reviewed / Outdated / All* dengan jumlah, ditambah filter *Type*. Default *Needs review* bila ada.
  - **Timeline:** dikelompokkan per versi draft. Run agen memuat hasil yang dibuatnya; hasil dari Policy Studio berdiri sendiri. Setiap baris menyebut hasil utamanya, status review, dan tanda *Outdated*. J/K atau ↑/↓ berpindah item.
  - **Detail tanpa dialog:**
    - Cek sumber: temuan diurutkan per tingkat, dengan proposal dan rujukan.
    - Simulasi: A, B, dan selisih; asumsi; stakeholder; teks B.
    - Forum: ringkasan sikap A/B, graf pengetahuan, tab skenario, filter ronde.
    - Run agen: rencana, hasil, jejak yang diringkas ("Persona response × n"), *All events* yang baru diserialisasi saat dibuka, *Cancel*.
    - Versi: diff kata terhadap versi sebelumnya, serta run dan hasil pada versi itu.
  - **Review:** kartu keputusan di atas hasil (status, catatan, *Save decision*) dengan *Decision history*. Viewer hanya bisa membaca.
  - **Run agent team:** lembar samping (bawah di mobile) dengan cakupan legal/impact/full/forum. Alternative B dan asumsi diambil dari Test impact, dan perubahannya kembali ke sana. B yang identik dengan draft ditolak.
  - **Integrasi:**
    - *Review in Activity* di Verify sources dan Test impact membuka hasil itu di Activity.
    - *Draft versions* di menu Studio membuka versi saat ini.
    - *Open in Verify sources / Test impact / the forum* muncul pada hasil terbaru per jenis.
  - **URL:** `status`, `type`, dan `item` tersimpan. `view=history`, `view=agents`, dan `tab=agents` tetap berfungsi; dua yang terakhir membuka run agen terbaru.
  - **Mobile:** timeline → detail layar penuh dengan tombol *Timeline*.
- **Dihapus:**
  - Dialog hasil (`run-detail`), dialog review, dialog versi, dan `inspect-job`.
  - Dua tab Activity, `agents.js`, dan panduan lipat Activity.
  - ±256 selector CSS lama (±23 KB).

**Bug yang ditemukan dan diperbaiki saat audit**
- Input radio review melebar ke 1.184 px karena gaya `input` global, sehingga halaman overflow horizontal.
- Di mobile, pemilih draft membuat grid lebih lebar dari layar (`min-width` grid).
- Escape tidak menutup lembar run karena kontrol select membatalkan event-nya, sehingga `cancel` dialog tidak terpicu. Kini ditangani di fase capture, kecuali saat daftar pilihan terbuka.
- Lembar run terpotong topbar dan nav bawah: posisi `fixed` terjebak transform animasi `#main`, dan z-index-nya kalah oleh stacking context `#main`. Lembar kini berupa `<dialog>` modal di top layer, sehingga fokus terkunci dan backdrop serta Escape menutupnya.
- Panel Scenario B forum ikut tampil karena `display:grid` mengalahkan atribut `hidden`.
- Pilihan default di filter *Needs review* jatuh ke run agen (status *Done*); kini memilih hasil.
- Hitungan langkah jejak dobel karena event mulai dan selesai sama-sama dihitung.
- Tombol *Review report* tetap nonaktif setelah run agen selesai sampai halaman dimuat ulang.
- Tombol "Reviewer notes" di Verify sources dan Test impact masih memanggil dialog yang sudah dihapus; kini menjadi *Review in Activity*.

**Audit end-to-end**: 32 dari 32 pemeriksaan lolos (demo lokal terisolasi, run agen nyata), mencakup:
- Keadaan kosong; rute lama `history`/`agents`/`tab=agents`.
- Lembar run: cakupan, Escape/backdrop, B identik ditolak.
- Run legal dan full dari lembar: run terpilih, jejak live, hasil bersarang, tombol report aktif. Input B dan asumsi terbawa ke Test impact.
- Default *Needs review*; detail simulasi.
- Review: catatan pendek ditolak di kolom; dua keputusan tersimpan berurutan, dengan reviewer.
- Filter status/jenis di URL; edit draft → *Outdated* + versi baru; diff versi.
- Tautan hasil ↔ run; J/K dan ↑/↓; deep link, reload, Back/Forward.
- Run forum: graf, tab skenario, filter ronde, *Open the forum*.
- *Draft versions* dari Studio; Quick menu "agents"; unduh report.
- 360/390/768/1024/1440 px tanpa overflow (timeline, detail, lembar).
- Viewer hanya baca; ganti draft; tanpa error JS.

**Tes yang diperbarui**:
- `tests/test_activity.py` (baru): riwayat review bertambah dengan reviewer dan peran; viewer ditolak.
- `scripts/browser_activity.cjs` ditulis ulang.
- `browser_smoke.cjs`, `browser_demo.cjs`, `dom_workspace_ux.cjs` dan `capture_ui.cjs` mengikuti timeline, review inline, versi dan lembar run. Server tes kini juga mengosongkan `DATABASE_URL` dan `RULELAB_SOURCES_BUCKET`.

**Hasil akhir:**
- pytest (activity, enterprise, workflow, collection, library, overview): 44 lolos.
- DOM: 57 lolos.
- `browser_activity`, `browser_smoke`, `browser_demo`, `browser_library`, `browser_collection`: lolos.
- Audit Activity 32/32, Policy Studio 90/90, Legal library 52/52, Data dashboard 62/62.

Panduan pengguna (§2, §8, §9, checklist) ikut diperbarui.

