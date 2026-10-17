# Dashboard data, peta landing page, dan perjalanan pengguna

## Pengalaman yang tersedia

Landing page memperlihatkan peta Indonesia, ringkasan koleksi aktual, jenis peraturan, rentang tahun, serta pilihan makna distribusi. Tombol menuju dashboard membawa konteks filter dan wilayah yang dipilih. Dashboard tersedia di sidebar dan Menu cepat. Tab, filter, wilayah, pencarian, urutan dan halaman dicatat pada URL, sehingga bertahan saat kembali dari galeri dan saat reload.

Dashboard mempunyai empat tab (rancangan: `docs/DATA_DASHBOARD_REVAMP_STRATEGY.md`):

| Tab | Isi |
|---|---|
| Overview | Lima KPI dengan angka final (peraturan, pasal/blok, provinsi, nasional, perlu OCR); filter makna distribusi, jenis, tahun dan lapisan peta; peta provinsi; panel peringkat (nasional sebagai baris sendiri, provinsi teratas, daftar provinsi tanpa dokumen); grafik tahun terbit, jenis dan topik yang bisa diklik |
| Explore documents | Seluruh dokumen dengan pencarian (judul, nomor, tahun, kabupaten/kota), filter yang sama, status, urutan dan paginasi server 25 per halaman; klik baris membuka dokumen di galeri |
| Data quality | Teks tersedia, perlu OCR, ditinjau manusia, perubahan, masalah checksum, tanpa wilayah; pengambilan per hari dan situs sumber; setiap angka membuka daftar dokumennya |
| Source queue | Unggah file, daftarkan tautan JDIH, status dan daftar antrean |

Alur pembaca: **landing/peta → jenis atau wilayah → dashboard → dokumen dalam galeri → pasal dan bot penjelasan → editor/simulasi yang sudah tersedia**. Dashboard bersifat global terhadap koleksi dan tidak memakai konteks rancangan aktif sebagai ukuran koleksi.

Alur pengelola: **dashboard → Add source (unggah file atau tautan JDIH) → identitas/wilayah/cakupan → tab Source queue → cuplikan/unduh file**. Impor rancangan pengguna ada di Overview dan Policy Studio (More → Import draft), karena sumber hukum dan rancangan pengguna mempunyai tujuan yang berbeda.

## Angka dan makna peta

| Elemen | Definisi |
|---|---|
| Peraturan unik | Identitas jenis, nomor, tahun, provinsi dan kabupaten/kota; beberapa snapshot identitas yang sama dihitung satu kali |
| Dokumen/versi | Jumlah snapshot dalam korpus yang cocok dengan filter; peraturan perubahan mempunyai identitas sendiri |
| Pasal/blok | Panjang daftar hasil ekstraksi setiap dokumen, bukan jumlah seluruh pasal dalam hukum Indonesia |
| Provinsi dalam koleksi | Provinsi dengan setidaknya satu dokumen sesuai makna distribusi yang dipilih |
| Wilayah penerbit | Penerbit nasional dihitung dalam kategori nasional; penerbit daerah memakai metadata provinsi |
| Cakupan pengaturan | Memakai metadata cakupan dan daftar provinsi; satu dokumen dapat mencakup beberapa wilayah |
| Wilayah disebut | Memakai daftar lokasi yang telah dicatat dalam metadata; tidak menyimpulkan cakupan berlaku atau dampak |
| Belum terpetakan | Dokumen yang tidak mempunyai metadata wilayah untuk dimensi tersebut; tetap dapat dijelajahi |
| Distribusi jenis | Jumlah dokumen per jenis. Klik jenis untuk menyaring koleksi |
| Topik | Topik hasil enrichment berbasis aturan; satu dokumen dapat mempunyai lebih dari satu topik |
| Kesiapan | Ketersediaan teks, flag pemeriksaan manusia, dan kecocokan checksum raw dengan metadata |

Koleksi awal: **6 peraturan nasional, 6 dokumen, 406 pasal/blok, 0 provinsi dengan koleksi daerah**. Peta tidak mengalokasikan keenam peraturan nasional ke setiap provinsi. Daerah dengan nol dokumen tidak diartikan tidak memiliki peraturan. Statistik berubah ketika korpus yang tersedia berubah.

Pilih provinsi melalui peta atau dropdown yang bisa dicari pada workspace. Data kabupaten/kota ditampilkan sebagai daftar dari metadata, bukan batas polygon kabupaten/kota. Pilihan lapisan **Antrean sumber** memperlihatkan lokasi sumber yang didaftarkan secara terpisah dari koleksi korpus.

## Dua jalur penambahan sumber

| Jalur | Perilaku saat ini | Status |
|---|---|---|
| Unggah PDF/DOCX/TXT/JSON | File tersimpan pada SQLite, teks diekstrak dengan batas ukuran, heading pasal dihitung, SHA256 dicatat, file dapat diunduh ulang | Perlu pemeriksaan / Perlu OCR |
| Daftarkan URL JDIH | URL HTTPS situs pemerintah `.go.id` dan identitas sumber dicatat pada antrean | Menunggu pengambilan |

File maksimal 10 MB, PDF maksimal 150 halaman, DOCX dibatasi ukuran setelah ekstraksi. JSON unggahan memerlukan `articles` dengan `number` dan `text`. PDF dengan halaman tanpa teks cukup ditandai perlu OCR; OCR belum dijalankan otomatis. Identitas jenis, nomor, tahun, wilayah dan cakupan diisi pengguna dari naskah, belum disimpulkan otomatis sebagai metadata terverifikasi.

Duplikasi unggahan menggunakan SHA256 bytes; duplikasi tautan menggunakan URL yang sama. Antrean bertahan setelah reload/restart. Cuplikan dan identitas di-escape pada UI. Statistik publik di landing page tidak menyertakan antrean atau metadata unggahan. API antrean mengikuti role/auth workspace; viewer/reviewer tidak dapat menambahkan sumber.

## Batas tahap ini

Pengambilan otomatis dari JDIH, crawler massal, OCR, persetujuan/publikasi sumber ke korpus, serta pembaruan indeks Elasticsearch merupakan tahap berikutnya. Mendaftarkan sumber **belum** menambahkan dokumen ke galeri, pencarian hukum atau konteks AI. Dashboard dan form menyatakan batas ini. Tidak ada fetch server ke URL JDIH arbitrer pada tahap ini.

Korpus awal masih mempunyai satu ketidakcocokan checksum sumber UU 25/2009 yang telah ada pada baseline; dashboard menampilkannya sebagai data yang perlu diperiksa. Flag human_verified seluruh sumber awal masih false. Ketersediaan teks bukan verifikasi status berlaku atau keabsahan hukum.

## Peta dan sumber geometri

Geometri berasal dari layanan publik **Badan Informasi Geospasial**, [STIG/Batas_Provinsi, layer 0](https://geoservices.big.go.id/gis/rest/services/STIG/Batas_Provinsi/MapServer/0), diambil 13 Oktober 2026. Hasil query berisi 38 provinsi, kode KDPPUM dan nama WADMPR, EPSG:4326. Query meminta `maxAllowableOffset=0.015`; aset tampilan memakai koordinat 2D dibulatkan empat desimal.

Aset dilayani dari aplikasi sendiri agar demo tidak bergantung pada tile/API eksternal. D3 7.9.0 memproyeksikan geometri dengan geoMercator/geoPath; winding dinormalisasi per polygon agar pulau-pulau tidak menjadi komplemen dunia pada proyeksi spherical. Peta merupakan tampilan koleksi, bukan peta untuk penetapan batas administratif.

`app/static/geo/source.json` menyimpan asal, tanggal, pengolahan dan hash. `app/static/vendor/D3_LICENSE` menyertakan lisensi pustaka. Nama/kode provinsi mengikuti snapshot geometri, bukan label yang dibuat sendiri.

## API dan integrasi metadata

- `GET /api/public/collection`: agregat korpus untuk landing page, tanpa auth dan tanpa antrean/dokumen privat.
- `GET /api/data/overview`: agregat ringan (KPI, provinsi, jenis, topik, sebaran tahun, pengambilan per hari, situs sumber, status kualitas) dan antrean; tanpa daftar dokumen; memakai auth workspace.
- Filter `kind`, `start`, `end`, `mode=issuer|scope|mentions`. Sebaran tahun tetap memuat semua tahun jenis terpilih agar filter tahun bisa diperlebar lagi.
- `GET /api/data/documents`: daftar dokumen terpaginasi (`page`, `size` 5–100) dengan `q`, filter di atas, `province` (`national`, `unmapped` atau kode provinsi, mengikuti `mode`), `district`, `status` (`text`, `ocr`, `verified`, `unverified`, `amendment`, `checksum`), `topic`, `host`, `day` dan `sort` (`retrieved`, `year`, `articles`, `title`). Inventaris dokumen di-cache sampai jumlah atau ukuran korpus berubah.
- `POST /api/data/intake`: unggah/daftarkan satu sumber; response memberi flag duplicate dan item tercatat.
- `GET /api/data/intake/{id}`: identitas, status dan cuplikan.
- `GET /api/data/intake/{id}/raw`: unduh file upload yang tersimpan; tautan tanpa file menghasilkan 404.

Metadata geography pada dokumen korpus dapat berbentuk:

```json
{
  "province_id": "32",
  "district": "Kota Bandung",
  "scope": "province",
  "scope_provinces": ["32", "33"],
  "mentioned_provinces": ["51"]
}
```

Contoh ini menjelaskan kontrak data, bukan isi peraturan tertentu. Scope tidak disimpulkan dari kata lokasi. Jenis peraturan nasional tetap mempunyai penerbit nasional ketika metadata cakupannya menunjuk wilayah tertentu.
