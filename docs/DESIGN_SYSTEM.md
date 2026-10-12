# RuleLab 1.0: sistem desain workspace

Tujuan desain: membuat pekerjaan legal mudah dibaca, ditelusuri, dan dilanjutkan. Identitas putih dan merah tetap digunakan, dengan ruang kerja yang tenang dan layout khusus untuk setiap tugas.

## Token utama

| Token | Nilai | Penggunaan |
|---|---|---|
| Accent | #B42338 | Aksi utama dan pilihan aktif |
| Accent hover | #941C2E | Hover aksi utama |
| Accent soft | #FCF0F2 | Latar navigasi aktif |
| Surface | #FFFFFF | Naskah dan panel |
| Canvas | #F7F8FA | Latar workspace |
| Ink | #25272A | Teks utama |
| Muted | #6E7279 | Penjelasan dan label |
| Subtle | #70757E | Metadata sekunder |
| Border | #E6E8EC | Struktur dan pembatas |
| Radius | 5–12px | Kontrol hingga panel |
| Sidebar | 246px / 72px | Navigasi desktop / terlipat |

Kontras token teks di atas terhadap putih: ink 14.98:1, muted 4.83:1, subtle 4.63:1, tombol merah dengan teks putih 6.49:1. Ini pemeriksaan token utama, bukan audit aksesibilitas lengkap untuk semua elemen.

Manrope menjadi font antarmuka dan isi pasal. Cormorant Garamond digunakan pada judul naskah dan aksen editorial landing. Heading workspace memakai Manrope, 25–30px. Isi pasal desktop 13px dengan line height 2.05, mobile 16px. Font disertakan lokal bersama lisensi.

## Tata letak

- Landing: pengantar editorial, ilustrasi alur review yang diberi label, bagian fitur dan cara kerja. Ilustrasi tidak menyatakan hasil analisis aktual.
- Ringkasan: jumlah data nyata, daftar rancangan, antrean review naskah terpilih, tiga pintu masuk alur kerja.
- Editor: permukaan naskah dengan daftar pasal, toolbar, indikator versi/simpan, asisten lima tab. Mode fokus menyembunyikan asisten tanpa menulis ulang input.
- Pemeriksaan: tanggal konteks, ringkasan cakupan, filter temuan, rancangan/usulan berdampingan, sumber dan interpretasi alternatif.
- Dampak: asumsi terpisah dari hasil A/B, akses dan biaya, mitigasi, sensitivitas dan batasan.
- Forum: peta percakapan, transcript, inspector opini/sumber, putaran A/B dan replay. Desktop lebar tiga kolom; ukuran menengah menempatkan transcript di bawah; mobile satu kolom. Panel editor menggunakan variasi compact.
- Pustaka: daftar dokumen, pencarian sumber, provenance dan akses JSON/naskah asli. Tidak ada ilustrasi berulang per dokumen.
- Riwayat: ringkasan status review, filter jenis hasil, timeline dan dialog reviewer.
- Agen: tim ringkas, brief eksekusi, langkah tool yang tercatat dan keluaran yang bisa dibuka.

Desktop memakai sidebar putih yang dapat dilipat. Mobile memakai navigasi horizontal yang dapat digeser, sehingga seluruh tujuh menu tetap tersedia. Ringkasan berada pada tombol terpisah di header mobile. Panduan menu tersedia melalui tombol bantuan dan disclosure pada akhir halaman.

## Interaksi

Perubahan warna dan border 150–220ms; perpindahan konten 200ms. Tidak ada glow, shimmer, glass blur, gradien besar atau beam dekoratif pada workspace. Network memperlihatkan edge balasan dari data yang tersimpan. Gerakan pada node bekerja hanya ketika respons tertunda atau replay aktif. Semua efek menghormati reduced motion.

Loading mengikuti permintaan nyata, dengan skeleton dan progress indeterminate. Tidak ada persentase kemajuan atau komentar AI pengganti. Error mempertahankan input dan menyediakan tindakan ulang. Status risiko disertai label teks.

## Source of truth

`app/static/design.css` adalah stylesheet tampilan untuk workspace dan landing. `frontend/src/styles.css` hanya memasukkan utility Tailwind tanpa preflight. Sidebar, dashboard dan command menu menggunakan React/Radix. Modul legal, form editor dan graph tetap menggunakan handler yang telah ada.

Bundle lokal berada di `app/static/framework`. Naskah dan data hukum berada pada backend yang sama. Jangan menambahkan stylesheet lama ke index karena akan menumpuk desain historis.
