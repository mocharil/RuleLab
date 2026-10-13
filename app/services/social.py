"""Domain-tailored synthetic citizens, synchronous rounds, and traceable public reactions.

Each round observes only completed previous rounds of the same scenario.
Personas adjust dynamically according to the regulation domain (Labor, Maritime,
Environment, Health, Digital Service, Governance, etc.).
Nothing here estimates public sentiment or invents population statistics.
"""
import asyncio, re
from typing import Literal
from pydantic import BaseModel, Field
from app.config import settings
from app.services import ai, legal, retrieval, simulation

DOMAIN_PERSONAS = {
    'labor': [
        {'id': 'hartono_apindo', 'name': 'Hartono', 'role': 'Asosiasi Pengusaha (APINDO)', 'background': 'Pemilik industri manufaktur padat karya dengan 1.200 pekerja.', 'goal': 'Menjaga kepastian beban operasional, fleksibilitas jam kerja, dan kelangsungan usaha.', 'issue': 'cost', 'domain': 'labor'},
        {'id': 'wahyu_buruh', 'name': 'Wahyu', 'role': 'Serikat Buruh Pabrik', 'background': 'Operator mesin industri masa kerja 8 tahun dan pengurus serikat pekerja.', 'goal': 'Upah layak, kepastian status kerja tetap (PKWTT), jaminan pesangon, dan K3.', 'issue': 'capacity', 'domain': 'labor'},
        {'id': 'hendra_umkm', 'name': 'Hendra', 'role': 'Pelaku UMKM Retail', 'background': 'Pemilik toko grosir dan jasa servis dengan 7 orang karyawan.', 'goal': 'Aturan pengupahan yang fleksibel sesuai skala usaha mikro tanpa sanksi pidana berat.', 'issue': 'cost', 'domain': 'labor'},
        {'id': 'ratna_freelance', 'name': 'Ratna', 'role': 'Pekerja Lepas & Mitra Gig', 'background': 'Pekerja kreatif lepas dan mitra pengemudi daring dengan pendapatan dinamis.', 'goal': 'Perlindungan jaminan sosial kecelakaan kerja dan kejelasan klausul kemitraan.', 'issue': 'access', 'domain': 'labor'},
        {'id': 'dimas_freshgrad', 'name': 'Dimas', 'role': 'Pencari Kerja / Vokasi', 'background': 'Lulusan baru politeknik vokasi yang mencari lowongan kerja formal pertama.', 'goal': 'Pasar kerja yang terbuka tanpa diskriminasi syarat usia atau pengalaman.', 'issue': 'access', 'domain': 'labor'},
        {'id': 'maya_hrd', 'name': 'Maya', 'role': 'Praktisi Hubungan Industrial / HRD', 'background': 'Manajer SDM perusahaan logistik dan pergudangan nasional.', 'goal': 'Prosedur bipartit yang terukur, kepastian aturan PHK, dan mediasi yang cepat.', 'issue': 'clarity', 'domain': 'labor'},
        {'id': 'agus_pengawas', 'name': 'Agus', 'role': 'Pengawas Ketenagakerjaan Dinas', 'background': 'Aparatur dinas tenaga kerja pengawas kepatuhan norma kerja perusahaan.', 'goal': 'Norma kerja yang realistis untuk diawasi dan didukung instrumen penindakan tegas.', 'issue': 'capacity', 'domain': 'labor'},
        {'id': 'siti_konsumen', 'name': 'Siti', 'role': 'Masyarakat Umum / Konsumen', 'background': 'Ibu rumah tangga pengelola belanja kebutuhan pokok keluarga.', 'goal': 'Stabilitas harga kebutuhan pokok agar kenaikan ongkos produksi tidak memicu inflasi.', 'issue': 'cost', 'domain': 'labor'}
    ],
    'maritime': [
        {'id': 'rusli_nelayan', 'name': 'Pak Rusli', 'role': 'Nelayan Tradisional Pesisir', 'background': 'Nelayan perahu motor tempel di bawah 5 GT alat tangkap pancing ulur.', 'goal': 'Perlindungan zona tangkap tradisional dari kapal besar dan kemudahan solar subsidi.', 'issue': 'access', 'domain': 'maritime'},
        {'id': 'edward_kapal', 'name': 'Edward', 'role': 'Pengusaha Kapal Tangkap & Industri', 'background': 'Pemilik armada 6 kapal penangkap ikan 30 GT berizin penangkapan terukur.', 'goal': 'Perizinan berlayar (SPB) cepat, kepastian kuota tangkap, dan logistik ekspor lancar.', 'issue': 'cost', 'domain': 'maritime'},
        {'id': 'bu_nur_pedagang', 'name': 'Bu Nur', 'role': 'Pedagang Ikan Pasar Basah', 'background': 'Pedagang grosir ikan segar di dermaga pendaratan ikan lokal.', 'goal': 'Pasokan tangkapan harian stabil dan fasilitas pendingin (cold storage) terjangkau.', 'issue': 'capacity', 'domain': 'maritime'},
        {'id': 'iwan_petambak', 'name': 'Iwan', 'role': 'Pembudidaya Tambak Pesisir', 'background': 'Petambak udang vaname dan bandeng di kawasan muara sungai pesisir.', 'goal': 'Kepastian sempadan pantai, pasokan air laut bersih bebas limbah, dan sertifikasi bibit.', 'issue': 'clarity', 'domain': 'maritime'},
        {'id': 'dr_fajar_konservasi', 'name': 'Dr. Fajar', 'role': 'Peneliti Oseanografi & Konservasi', 'background': 'Ahli biologi laut dari lembaga riset dan advokasi pelestarian terumbu karang.', 'goal': 'Perlindungan Kawasan Konservasi Perairan (KKP) dari overfishing dan alat tangkap perusak.', 'issue': 'capacity', 'domain': 'maritime'},
        {'id': 'kapten_trio_syahbandar', 'name': 'Kapten Trio', 'role': 'Syahbandar Pelabuhan Perikanan', 'background': 'Petugas keselamatan pelayaran dan inspeksi pendaratan ikan pelabuhan.', 'goal': 'Kepatuhan pelaporan e-logbook tangkapan dan keselamatan operasional awak kapal.', 'issue': 'clarity', 'domain': 'maritime'},
        {'id': 'arifin_tokoh_adat', 'name': 'Arifin', 'role': 'Tokoh Adat Pesisir & Panglima Laot', 'background': 'Pemimpin lembaga adat pesisir pengawal kearifan lokal konservasi laut.', 'goal': 'Pengakuan hak ulayat laut dan perlindungan wilayah adat dari eksploitasi kapal luar.', 'issue': 'accessibility', 'domain': 'maritime'},
        {'id': 'linda_pengolah', 'name': 'Linda', 'role': 'Pelaku UMKM Olahan Hasil Laut', 'background': 'Pengrajin kerupuk ikan, terasi, dan abon ikan skala rumah tangga.', 'goal': 'Bahan baku ikan higienis bermutu dan kemudahan sertifikasi izin edar BPOM/Dinkes.', 'issue': 'cost', 'domain': 'maritime'}
    ],
    'environment': [
        {'id': 'darman_petani_hutan', 'name': 'Pak Darman', 'role': 'Petani Perhutanan Sosial', 'background': 'Petani penggarap agroforestri di perbatasan kawasan hutan produksi.', 'goal': 'Akses legal kelola lahan hutan kemasyarakatan dan kepastian hak tanpa kriminalisasi.', 'issue': 'access', 'domain': 'environment'},
        {'id': 'irwan_industri', 'name': 'Irwan', 'role': 'Manajer Kepatuhan Lingkungan Industri', 'background': 'Penanggung jawab IPAL dan emisi pabrik pengolahan bahan tambang/manufaktur.', 'goal': 'Baku mutu emisi dan limbah yang terukur serta masa transisi retrofit teknologi bersih.', 'issue': 'cost', 'domain': 'environment'},
        {'id': 'nadira_walhi', 'name': 'Nadira', 'role': 'Koalisi Advokasi Hak Lingkungan', 'background': 'Peneliti hukum lingkungan dari organisasi masyarakat sipil perlindungan alam.', 'goal': 'Kewajiban AMDAL yang ketat, transparansi audit ekologis, dan sanksi tegas pencemar.', 'issue': 'clarity', 'domain': 'environment'},
        {'id': 'widya_warga_sungai', 'name': 'Bu Widya', 'role': 'Warga Bantaran Aliran Sungai', 'background': 'Warga permukiman hilir yang mengandalkan air sungai untuk kebutuhan mandi cuci.', 'goal': 'Air sungai bebas limbah beracun B3 dan kepastian ganti rugi pemulihan ekosistem.', 'issue': 'accessibility', 'domain': 'environment'},
        {'id': 'teguh_polhut', 'name': 'Teguh', 'role': 'Polisi Kehutanan & Penyuluh', 'background': 'Petugas patroli lapangan perlindungan kawasan suaka alam dan taman nasional.', 'goal': 'Dukungan sarana patroli memadai dan kewenangan penindakan perambahan liar yang tegas.', 'issue': 'capacity', 'domain': 'environment'},
        {'id': 'joko_bank_sampah', 'name': 'Joko', 'role': 'Pengelola Bank Sampah & Daur Ulang', 'background': 'Inisiator pengelolaan sampah komunitas dan ekonomi sirkular tingkat kabupaten.', 'goal': 'Kewajiban pemilahan sampah dari hulu dan insentif nyata bagi industri daur ulang.', 'issue': 'cost', 'domain': 'environment'},
        {'id': 'melati_masyarakat_adat', 'name': 'Melati', 'role': 'Tetua Masyarakat Hukum Adat Hutan', 'background': 'Tokoh adat perempuan penjaga hutan larangan dan kearifan ekologi leluhur.', 'goal': 'Penetapan legal hutan adat ulayat dan perlindungan wilayah hidup dari konsesi.', 'issue': 'access', 'domain': 'environment'},
        {'id': 'bambang_bappeda', 'name': 'Bambang', 'role': 'Perencana Tata Ruang Daerah (Bappeda)', 'background': 'Pejabat teknis keselarasan rencana tata ruang wilayah (RTRW) kabupaten/kota.', 'goal': 'Kepatuhan penetapan zona resapan air, sempadan sungai, dan mitigasi bencana.', 'issue': 'clarity', 'domain': 'environment'}
    ],
    'health': [
        {'id': 'tuti_pasien', 'name': 'Bu Tuti', 'role': 'Pasien Penyakit Kronis BPJS', 'background': 'Pasien lansia dengan terapi rujukan rutin hipertensi dan diabetes di RSUD.', 'goal': 'Kemudahan sistem rujukan, antrean faskes tertib, dan ketersediaan obat rutin tanpa iur bayar.', 'issue': 'access', 'domain': 'health'},
        {'id': 'dr_andre_puskesmas', 'name': 'dr. Andre', 'role': 'Dokter Kepala Puskesmas 3T', 'background': 'Dokter umum penanggung jawab faskes tingkat pertama di pulau terluar.', 'goal': 'Kelengkapan sarana diagnostik dasar, logistik obat esensial tepat waktu, dan insentif kerja.', 'issue': 'capacity', 'domain': 'health'},
        {'id': 'dr_harlan_direktur_rs', 'name': 'dr. Harlan', 'role': 'Direktur RS Rujukan Kelas B', 'background': 'Pimpinan rumah sakit rujukan dengan 250 tempat tidur dan unit gawat darurat.', 'goal': 'Tarif klaim paket Ina-CBGs sesuai biaya riil medis dan kepastian likuiditas pencairan.', 'issue': 'cost', 'domain': 'health'},
        {'id': 'sinta_apoteker', 'name': 'apt. Sinta', 'role': 'Apoteker & Pengelola Apotek Mandiri', 'background': 'Tenaga kefarmasian pengelola apotek pelayanan resep umum di kecamatan.', 'goal': 'Regulasi harga eceran tertinggi (HET) yang wajar dan kemudahan izin sarana farmasi.', 'issue': 'clarity', 'domain': 'health'},
        {'id': 'surya_bpjs', 'name': 'Surya', 'role': 'Verifikator Klaim Jaminan Kesehatan', 'background': 'Auditor kepatuhan penjaminan manfaat jaminan kesehatan nasional.', 'goal': 'Standarisasi pedoman klinis untuk mencegah fraud medis dan menjaga kesinambungan dana.', 'issue': 'clarity', 'domain': 'health'},
        {'id': 'rina_posyandu', 'name': 'Rina', 'role': 'Kader Posyandu & Gizi Balita', 'background': 'Kader sukarelawan penggerak program pencegahan stunting dan imunisasi balita.', 'goal': 'Dukungan operasional posyandu berkesinambungan dan kemudahan sistem input data desa.', 'issue': 'capacity', 'domain': 'health'},
        {'id': 'agus_pekerja_mandiri', 'name': 'Agus', 'role': 'Peserta Mandiri Pekerja Informal', 'background': 'Pekerja mandiri bengkel las dengan pendapatan bulanan tidak menentu.', 'goal': 'Besaran iuran jaminan kesehatan proporsional tanpa sanksi denda keterlambatan berat.', 'issue': 'cost', 'domain': 'health'},
        {'id': 'yudha_pengamat', 'name': 'Yudha', 'role': 'Peneliti Kebijakan Pelayanan Medis', 'background': 'Akademisi kesehatan masyarakat pengkaji pemerataan akses medis inklusif.', 'goal': 'Pemerataan sebaran fasilitas medis dan perlindungan mutu layanan kelompok rentan.', 'issue': 'accessibility', 'domain': 'health'}
    ],
    'digital_service': [
        {'id': 'sari_desa', 'name': 'Sari', 'role': 'Warga Pedesaan Akses Terbatas (3T)', 'background': 'Warga pedesaan dengan sinyal seluler tidak stabil dan perangkat telepon sederhana.', 'goal': 'Ketersediaan kanal bantuan luring/tatap muka tanpa penolakan hak administrasi masyarakat.', 'issue': 'access', 'domain': 'digital_service'},
        {'id': 'nadia_disabilitas', 'name': 'Nadia', 'role': 'Penyandang Disabilitas Tunanetra', 'background': 'Pengguna smartphone dengan fitur pembaca layar (screen reader) dan keyboard braille.', 'goal': 'Aksesibilitas portal digital sesuai standar WCAG dan jaminan privasi data tanpa kebocoran.', 'issue': 'accessibility', 'domain': 'digital_service'},
        {'id': 'bima_loket', 'name': 'Bima', 'role': 'Petugas Loket Layanan Terpadu', 'background': 'Aparatur pelayanan terpadu satu pintu di kantor kecamatan.', 'goal': 'Kapasitas kerja yang terukur, alokasi jam pendampingan warga, dan SOP penanganan antrean yang realistis.', 'issue': 'capacity', 'domain': 'digital_service'},
        {'id': 'raka_umkm', 'name': 'Raka', 'role': 'Pelaku Usaha UMKM Mandiri', 'background': 'Wirausaha muda perintis kedai makanan yang sering mengurus izin edar dan NIB.', 'goal': 'Prosedur perizinan satu pintu terpadu (OSS) yang cepat, bebas pungli, dan biaya resmi transparan.', 'issue': 'clarity', 'domain': 'digital_service'},
        {'id': 'dewi_anggaran', 'name': 'Dewi', 'role': 'Pengelola Anggaran Keuangan Daerah', 'background': 'Perencana anggaran belanja instansi pada Badan Pengelola Keuangan Daerah.', 'goal': 'Efisiensi belanja lisensi sistem teknologi informasi dan kepastian pos anggaran bantuan operasional.', 'issue': 'cost', 'domain': 'digital_service'},
        {'id': 'faisal_security', 'name': 'Faisal', 'role': 'Praktisi Keamanan Siber & Privasi Data', 'background': 'Konsultan perlindungan data pribadi dan ketahanan sistem elektronik pemerintah.', 'goal': 'Kepatuhan enkripsi data kependudukan, pencegahan kebocoran data, dan kesiapan UU Perlindungan Data Pribadi (PDP).', 'issue': 'clarity', 'domain': 'digital_service'},
        {'id': 'subroto_lansia', 'name': 'Pak Subroto', 'role': 'Warga Pensiunan / Lanjut Usia', 'background': 'Warga senior berusia 69 tahun yang kesulitan melakukan verifikasi wajah biometrik mandiri.', 'goal': 'Tersedianya jalur pendampingan langsung yang ramah lansia dengan bahasa petunjuk yang sederhana.', 'issue': 'accessibility', 'domain': 'digital_service'},
        {'id': 'anita_ombudsman', 'name': 'Anita', 'role': 'Ombudsman & Pengawas Pelayanan Publik', 'background': 'Pemerhati kepatuhan penyelenggara layanan publik terhadap asas kepatutan dan non-diskriminasi.', 'goal': 'Jaminan saluran pengaduan masyarakat yang wajib ditanggapi dan pencegahan maladministrasi layanan.', 'issue': 'access', 'domain': 'digital_service'}
    ],
    'governance': [
        {'id': 'hendro_warga_kota', 'name': 'Hendro', 'role': 'Warga Perkotaan / Karyawan Swasta', 'background': 'Warga kota yang menuntut transparansi regulasi dan efisiensi birokrasi pemerintahan.', 'goal': 'Prosedur pelayanan yang transparan, bebas dari pungutan liar, dan kepastian durasi penyelesaian.', 'issue': 'clarity', 'domain': 'governance'},
        {'id': 'nurul_pelaku_usaha', 'name': 'Nurul', 'role': 'Pelaku Wirausaha Lokal', 'background': 'Pengusaha jasa lokal yang mengurus kepatuhan perizinan tingkat daerah.', 'goal': 'Beban kepatuhan regulasi yang proporsional tanpa persyaratan berlapis antar-dinas.', 'issue': 'cost', 'domain': 'governance'},
        {'id': 'salim_tokoh_desa', 'name': 'Pak Salim', 'role': 'Tokoh Masyarakat Pedesaan', 'background': 'Kepala dusun yang mewakili aspirasi warga komunitas pedesaan.', 'goal': 'Kebijakan yang dapat diimplementasikan secara realistis di wilayah dengan fasilitas terbatas.', 'issue': 'access', 'domain': 'governance'},
        {'id': 'tiara_mahasiswa', 'name': 'Tiara', 'role': 'Mahasiswa / Generasi Muda Kritis', 'background': 'Aktivis mahasiswa pengkaji keterbukaan informasi dan hak partisipasi bermakna.', 'goal': 'Pelibatan publik yang substantif dan keterbukaan dokumen kebijakan sebelum disahkan.', 'issue': 'access', 'domain': 'governance'},
        {'id': 'widodo_asn', 'name': 'Widodo', 'role': 'Pejabat Pelaksana Teknis / ASN', 'background': 'Aparatur birokrasi yang menjalankan instruksi teknis di unit pelaksana.', 'goal': 'Petunjuk operasional yang jelas agar tidak menimbulkan risiko multitafsir atau kesalahan administrasi.', 'issue': 'clarity', 'domain': 'governance'},
        {'id': 'dr_kartika_akademisi', 'name': 'Dr. Kartika', 'role': 'Pakar Hukum Tata Negara & Kebijakan Publik', 'background': 'Dosen fakultas hukum pengkaji hierarki perundang-undangan dan asas legalitas.', 'goal': 'Kepatuhan rancangan terhadap peraturan yang lebih tinggi dan asas keterbukaan naskah akademik.', 'issue': 'clarity', 'domain': 'governance'},
        {'id': 'bambang_inspektorat', 'name': 'Bambang', 'role': 'Auditor Inspektorat Pengawas Internal', 'background': 'Pengawas akuntabilitas kinerja dan tata kelola keuangan instansi.', 'goal': 'Mitigasi celah penyalahgunaan wewenang dan kepatuhan terhadap prinsip efisiensi anggaran.', 'issue': 'capacity', 'domain': 'governance'},
        {'id': 'dina_inklusif', 'name': 'Dina', 'role': 'Advokat Perlindungan Hak Kelompok Rentan', 'background': 'Aktivis pendamping kelompok perempuan, lansia, dan penyandang disabilitas.', 'goal': 'Prinsip kesetaraan perlakuan, non-diskriminasi, dan akomodasi yang layak dalam kebijakan publik.', 'issue': 'accessibility', 'domain': 'governance'}
    ]
}

DEFAULT_PERSONAS = DOMAIN_PERSONAS['digital_service']
PERSONAS = DEFAULT_PERSONAS

def detect_domain(draft: dict | None) -> str:
    if not draft:
        return 'digital_service'
    text = (draft.get('title', '') + ' ' + draft.get('scope', '') + ' ' + draft.get('preamble', '') + ' ' +
            ' '.join(a.get('text', '') for a in draft.get('articles', []))).lower()
    title = draft.get('title', '').lower()

    scores = {k: 0 for k in ['labor', 'maritime', 'environment', 'health', 'digital_service', 'governance']}

    labor_kw = ['buruh', 'tenaga kerja', 'pekerja', 'upah', 'pesangon', 'phk', 'serikat', 'pkwt', 'pkwtt', 'outsourcing', 'lembur', 'ketenagakerjaan', 'k3', 'apindo', 'umr', 'ump', 'umk']
    maritime_kw = ['laut', 'kelautan', 'nelayan', 'ikan', 'perikanan', 'tangkap', 'kapal', 'maritim', 'pesisir', 'pantai', 'tambak', 'wppnri', 'syahbandar', 'cold storage', 'psdkp']
    env_kw = ['lingkungan', 'amdal', 'hutan', 'kehutanan', 'limbah', 'emisi', 'polusi', 'karbon', 'tambang', 'sampah', 'b3', 'sungai', 'perhutanan sosial', 'baku mutu']
    health_kw = ['kesehatan', 'rumah sakit', 'puskesmas', 'bpjs', 'obat', 'farmasi', 'medis', 'dokter', 'perawat', 'nakes', 'pasien', 'faskes', 'klinik', 'stunting', 'gizi']
    digital_kw = ['digital', 'aplikasi', 'elektronik', 'online', 'internet', 'spbe', 'portal', 'dukcapil', 'sistem informasi', 'data pribadi', 'pdp', 'screen reader']

    for w in labor_kw:
        if w in title: scores['labor'] += 5
        if w in text: scores['labor'] += 1
    for w in maritime_kw:
        if w in title: scores['maritime'] += 5
        if w in text: scores['maritime'] += 1
    for w in env_kw:
        if w in title: scores['environment'] += 5
        if w in text: scores['environment'] += 1
    for w in health_kw:
        if w in title: scores['health'] += 5
        if w in text: scores['health'] += 1
    for w in digital_kw:
        if w in title: scores['digital_service'] += 5
        if w in text: scores['digital_service'] += 1

    best_domain = max(scores, key=scores.get)
    if scores[best_domain] > 0:
        return best_domain
    return 'governance'

def get_personas_for_draft(draft: dict | None = None) -> list[dict]:
    domain = detect_domain(draft)
    return DOMAIN_PERSONAS.get(domain, DOMAIN_PERSONAS['digital_service'])

class Reaction(BaseModel):
    stance: Literal['support', 'concern', 'conditional', 'uncertain']
    comment: str = Field(min_length=10, max_length=1200)
    rationale: str = Field(min_length=10, max_length=1200)
    issue: Literal['access', 'accessibility', 'capacity', 'cost', 'clarity', 'other']
    proposal: str = Field(min_length=5, max_length=800)
    reply_to: str | None = None
    evidence_ids: list[str] = Field(default_factory=list, max_length=4)

def aggregate(comments):
    """Count latest opinions, not votes or a representative survey."""
    latest = {c['persona_id']: c for c in comments}
    groups = {s: [] for s in ['support', 'concern', 'conditional', 'uncertain']}
    issues = {}
    for c in latest.values():
        groups[c['stance']].append(c['id'])
        issues.setdefault(c['issue'], []).append(c['id'])
    return {'stance_groups': groups, 'issues': issues, 'latest_comment_ids': [c['id'] for c in latest.values()]}

DEMO_COMMENTS = {
    'labor': {
        'hartono_apindo': {
            'A': 'Ketentuan ini harus memperhitungkan kelangsungan dunia usaha. Beban biaya tetap dan aturan jam kerja yang kaku dapat membebani industri padat karya.',
            'B': 'Skema alternatif dengan masa transisi dan penyesuaian bipartit lebih realistis untuk menjaga iklim investasi dan kepastian operasional pabrik.'
        },
        'wahyu_buruh': {
            'A': 'Kami menolak ketentuan yang melonggarkan batas lembur dan mengurangi jaminan perlindungan upah. Hak normatif pekerja tidak boleh dikompromikan.',
            'B': 'Alternatif ini memberikan kepastian status kerja dan perlindungan K3 yang lebih terarah. Kami mendukung dengan syarat pengawasan di lapangan diperketat.'
        },
        'hendra_umkm': {
            'A': 'UMKM tidak memiliki modal seperti korporasi besar. Jangan samakan standar pengupahan dan kewajiban administrasi kami dengan industri besar.',
            'B': 'Pemberian relaksasi dan pendampingan bagi usaha mikro pada naskah ini sangat melegakan bagi kelangsungan usaha kami.'
        },
        'ratna_freelance': {
            'A': 'Status kemitraan pekerja lepas sering kali tidak memiliki jaminan perlindungan kecelakaan kerja maupun jam istirahat yang layak.',
            'B': 'Klausul jaminan sosial dan kejelasan hak mitra pada alternatif B membuka akses perlindungan yang selama ini kami butuhkan.'
        },
        'dimas_freshgrad': {
            'A': 'Pasar tenaga kerja membutuhkan regulasi yang membuka lowongan kerja baru, bukan mempersulit syarat masuk dengan pembatasan pengalaman yang tidak relevan.',
            'B': 'Program magang bersertifikat dan insentif penerimaan pekerja pemula pada alternatif ini sangat membantu generasi muda mencari kerja.'
        },
        'maya_hrd': {
            'A': 'Mekanisme penyelesaian perselisihan hubungan industrial dalam draf ini masih multitafsir dan berisiko memperpanjang sengketa di pengadilan.',
            'B': 'Alur mediasi bipartit yang disederhanakan dan batas waktu yang tegas memberikan kepastian hukum bagi manajemen maupun pekerja.'
        },
        'agus_pengawas': {
            'A': 'Jumlah personel pengawas dinas sangat terbatas. Standar norma yang dirumuskan tanpa mekanisme sanksi yang aplikatif akan sulit ditegakkan.',
            'B': 'Adanya instrumen pelaporan digital dan audit kepatuhan terpadu akan mempermudah dinas memantau kepatuhan perusahaan secara objektif.'
        },
        'siti_konsumen': {
            'A': 'Kenaikan beban biaya industri dikhawatirkan diteruskan ke konsumen dalam bentuk kenaikan harga barang kebutuhan harian.',
            'B': 'Keseimbangan biaya dan produktivitas pada alternatif B diharapkan menjaga stabilitas harga produk konsumsi di pasaran.'
        }
    },
    'maritime': {
        'rusli_nelayan': {
            'A': 'Sebagai nelayan kecil dengan perahu motor tempel, zona tangkap kami terdesak oleh kapal trawl besar dan solar subsidi sulit didapat.',
            'B': 'Zona perlindungan 0-4 mil laut dan kemudahan akses kuota solar bagi nelayan tradisional pada alternatif ini sangat melindungi hidup kami.'
        },
        'edward_kapal': {
            'A': 'Sistem kuota penangkapan terukur jangan sampai memicu birokrasi berbelit pada Surat Persetujuan Berlayar (SPB) di pelabuhan.',
            'B': 'Layanan perizinan satu atap di pelabuhan dan kejelasan pembagian kuota industri pada alternatif B memberikan kepastian operasional armada kami.'
        },
        'bu_nur_pedagang': {
            'A': 'Fluktuasi pasokan ikan segar dan minimnya fasilitas pendingin membuat ikan cepat busuk dan harga di pasar tidak menentu.',
            'B': 'Penyediaan cold storage bersama di dermaga pelelangan ikan akan menjamin ketersediaan pasokan dan menjaga kestabilan harga pasar.'
        },
        'iwan_petambak': {
            'A': 'Limbah industri pesisir dan ketidakpastian sempadan pantai mengancam keberlanjutan tambak udang dan bandeng kami.',
            'B': 'Penetapan zonasi tambak ramah lingkungan dan proteksi kualitas air laut pada naskah ini menjamin kepastian investasi petambak lokal.'
        },
        'dr_fajar_konservasi': {
            'A': 'Eksploitasi berlebih dan alat tangkap perusak terumbu karang harus dilarang tegas tanpa celah kompromi demi keberlanjutan laut.',
            'B': 'Penguatan status Kawasan Konservasi Perairan dan sanksi pemulihan ekosistem pada alternatif B mencerminkan komitmen kelautan lestari.'
        },
        'kapten_trio_syahbandar': {
            'A': 'Banyak kapal beroperasi tanpa memenuhi uji kelaikan laut dan enggan mengisi e-logbook tangkapan secara disiplin.',
            'B': 'Integrasi sistem pengawasan berbasis VMS dan kewajiban logbook elektronik pada alternatif ini meningkatkan standar keselamatan pelayaran.'
        },
        'arifin_tokoh_adat': {
            'A': 'Kearifan lokal hukum adat laut seperti Panglima Laot atau Sasi sering kali diabaikan oleh kapal penangkap ikan dari luar wilayah.',
            'B': 'Pengakuan resmi terhadap hak ulayat laut dan sanksi adat pesisir pada draf ini menghormati kedaulatan masyarakat adat turun-temurun.'
        },
        'linda_pengolah': {
            'A': 'Usaha kerupuk dan olahan ikan rumahan kami terkendala kepastian pasokan bahan baku higienis dan biaya sertifikasi yang mahal.',
            'B': 'Fasilitas sertifikasi gratis bagi pengolah mikro dan jaminan pasokan ikan lokal pada alternatif B mendukung pertumbuhan ekonomi pesisir.'
        }
    },
    'digital_service': {
        'sari_desa': {
            'A': 'Bagaimana warga pedesaan tanpa jaringan internet stabil bisa mengakses hak pelayanan publik jika semua diwajibkan digital?',
            'B': 'Adanya opsi bantuan luring dan loket pendampingan di kantor desa pada alternatif B memastikan kami tidak terpinggirkan.'
        },
        'nadia_disabilitas': {
            'A': 'Aplikasi pemerintah sering tidak terbaca screen reader dan minim fitur teks alternatif. Hak kemandirian kami terabaikan.',
            'B': 'Kewajiban kepatuhan standar WCAG dan akomodasi yang layak pada alternatif B menjamin layanan yang ramah disabilitas.'
        },
        'bima_loket': {
            'A': 'Petugas loket menghadapi lonjakan pemohon yang bingung tanpa adanya pedoman beban kerja dan alokasi waktu pendampingan.',
            'B': 'Pengaturan rasio petugas pendamping dan jadwal rotasi layanan terpadu pada alternatif B menciptakan kapasitas kerja yang realistis.'
        },
        'raka_umkm': {
            'A': 'Proses perizinan usaha masih terpecah di berbagai aplikasi daerah dan sering meminta dokumen fisik yang sama berulang kali.',
            'B': 'Integrasi satu pintu dengan verifikasi otomatis dan kepastian durasi penerbitan izin pada alternatif B mempercepat usaha kami.'
        },
        'dewi_anggaran': {
            'A': 'Belanja pengadaan server dan lisensi aplikasi membengkak tanpa adanya evaluasi rasio manfaat nyata bagi warga masyarakat.',
            'B': 'Model pembiayaan bersama berbasis komputasi awan dan alokasi pendampingan terukur pada alternatif B menjaga efisiensi fiskal.'
        },
        'faisal_security': {
            'A': 'Penyimpanan data kependudukan digital tanpa enkripsi standar dan audit keamanan berkala rentan terhadap kebocoran data pribadi.',
            'B': 'Klausul kepatuhan UU PDP dan kewajiban audit keamanan berkala pada alternatif B memberikan jaminan perlindungan data masyarakat.'
        },
        'subroto_lansia': {
            'A': 'Bagi kami para lansia, instruksi di layar gawai sangat membingungkan dan rawan salah tekan. Kami membutuhkan pelayanan tatap muka.',
            'B': 'Penyediaan jalur pelayanan khusus lansia dengan petugas pendamping yang ramah membuat kami merasa diayomi oleh negara.'
        },
        'anita_ombudsman': {
            'A': 'Penghapusan loket konvensional tanpa kesiapan infrastruktur merupakan bentuk maladministrasi penolakan pelayanan publik.',
            'B': 'Kewajiban menyediakan kanal pengaduan aktif dan survei kepuasan masyarakat pada alternatif B memperkuat akuntabilitas instansi.'
        }
    }
}

def demo_reaction(persona, scenario, round_number, text, previous, personas=None):
    if personas is None:
        personas = DEFAULT_PERSONAS
    assistance = simulation.has_assistance(text)
    pid = persona['id']
    domain = persona.get('domain', 'digital_service')
    issue = persona.get('issue', 'access')
    
    # Domain-aware comment lookup or intelligent fallback
    domain_comments = DEMO_COMMENTS.get(domain, DEMO_COMMENTS['digital_service'])
    persona_comments = domain_comments.get(pid, None)

    if persona_comments:
        raw_comment = persona_comments['B'] if (scenario == 'B' or assistance) else persona_comments['A']
    else:
        quoted = text[:150]
        if scenario == 'B' or assistance:
            raw_comment = f"Sebagai {persona['name']} ({persona.get('role', 'perwakilan')}), saya mendukung ketentuan alternatif ini karena memuat kepastian {issue} dan akomodasi yang lebih berkeadilan."
        else:
            raw_comment = f"Sebagai {persona['name']}, saya memiliki catatan kritis terhadap draf awal ini. Ketentuan pasal perlu mempertimbangkan hambatan nyata terkait {issue} di lapangan."

    stance = 'support' if (scenario == 'B' and pid in {'wahyu_buruh', 'sari_desa', 'rusli_nelayan', 'nadia_disabilitas'}) else \
             'conditional' if (assistance or scenario == 'B' or persona.get('issue') in {'cost', 'clarity'}) else 'concern'

    targets = [c for c in previous if c['persona_id'] != pid]
    target = None
    if targets:
        try:
            p_idx = next(i for i, p in enumerate(personas) if p['id'] == pid)
        except StopIteration:
            p_idx = 0
        target = targets[(round_number + p_idx) % len(targets)]

    prefix = f"Menanggapi {target['name']}: " if target else ''
    full_comment = prefix + raw_comment

    rationale = f"Pertimbangan {persona['name']} ({persona.get('role', 'stakeholder')}): {persona['goal']} Isu utama: {issue}. Pendapat diselaraskan dengan naskah Skenario {scenario}."
    proposal = f"Rumuskan pedoman teknis yang menjamin kepastian {issue} dan lakukan evaluasi pelaksanaan secara berkala."

    return {
        'stance': stance,
        'comment': full_comment,
        'rationale': rationale,
        'issue': issue,
        'proposal': proposal,
        'reply_to': target['id'] if target else None,
        'evidence_ids': []
    }

async def simulate(draft, alternative, assumptions, evidence, emit):
    texts = {'A': '\n\n'.join('Pasal ' + a['number'] + '\n' + a['text'] for a in draft['articles']), 'B': alternative}
    allowed = {e['id'] for e in evidence}
    scenarios = {}
    provider = {'mode': 'demo' if settings.provider == 'demo' else 'live', 'provider': settings.provider,
                'model': None if settings.provider == 'demo' else settings.model}
    personas = get_personas_for_draft(draft)
    domain = detect_domain(draft)

    for scenario, text in texts.items():
        transcript = []
        for round_number in range(1, 4):
            previous = list(transcript)
            emit('coordinator', 'gather_opinions', 'running', {'scenario': scenario, 'round': round_number})
            async def react(persona):
                cid = f"{scenario}-{round_number}-{persona['id']}"
                emit(persona['id'], 'social_reaction', 'running', {'scenario': scenario, 'round': round_number, 'persona': persona})
                try:
                    if settings.provider == 'demo':
                        await asyncio.sleep(0)
                        output = Reaction.model_validate(demo_reaction(persona, scenario, round_number, text, previous, personas)).model_dump()
                    else:
                        prompt_task = (
                            f"Perankan persona sintetis ini dalam forum uji publik regulasi tentang topik {domain}. "
                            "Tulis komentar publik dan alasan singkat yang dapat ditinjau, bukan proses berpikir internal. "
                            f"Identitas: {persona['name']}, Peran: {persona.get('role', 'Masyarakat')}, Latar Belakang: {persona['background']}, Tujuan: {persona['goal']}. "
                            "Nilai teks yang diberikan sesuai kepentingan profesi dan latar belakang persona. Sikap boleh tetap sama atau berkembang setelah membaca komentar sebelumnya. "
                            "Putaran pertama reply_to=null; putaran berikutnya WAJIB menanggapi tepat satu komentar agen lain dari previous_comments. "
                            "Pilih issue yang paling relevan. Jangan menciptakan data demografis fiktif atau mengklaim mewakili seluruh populasi. "
                            "Sumber hukum adalah konteks pendukung, bukan bukti empiris sikap masyarakat. evidence_ids boleh kosong."
                        )
                        output, metadata = await asyncio.wait_for(ai.generate(
                            prompt_task,
                            {'persona': persona, 'scenario': scenario, 'round': round_number, 'regulation_text': text,
                             'assumptions': assumptions, 'previous_comments': previous,
                             'evidence': retrieval.evidence_payload(evidence),
                             'legal_context': legal.context(draft['regulation_type'], evidence)}, Reaction),
                            timeout=settings.agent_step_timeout)
                        output = Reaction.model_validate(output).model_dump()
                    if any(e not in allowed for e in output['evidence_ids']):
                        raise ai.AIError('Sumber opini di luar evidence.')
                    targets = {c['id'] for c in previous if c['persona_id'] != persona['id']}
                    if (round_number == 1 and output['reply_to'] is not None) or (round_number > 1 and output['reply_to'] not in targets):
                        raise ai.AIError('Balasan opini tidak menunjuk komentar sebelumnya dari agen lain.')
                    comment = {**output, 'id': cid, 'persona_id': persona['id'], 'name': persona['name'],
                               'scenario': scenario, 'round': round_number}
                    emit(persona['id'], 'social_reaction', 'completed', {'comment': comment})
                    return comment
                except BaseException as exc:
                    emit(persona['id'], 'social_reaction', 'cancelled' if isinstance(exc, asyncio.CancelledError) else 'failed',
                         {'scenario': scenario, 'round': round_number, 'persona': persona, 'error_type': type(exc).__name__})
                    raise
            tasks = [asyncio.create_task(react(p)) for p in personas]
            try:
                comments = await asyncio.gather(*tasks)
            except BaseException:
                for task in tasks: task.cancel()
                await asyncio.gather(*tasks, return_exceptions=True)
                raise
            transcript.extend(comments)
            emit('coordinator', 'gather_opinions', 'completed',
                 {'scenario': scenario, 'round': round_number, 'summary': aggregate(transcript)})
        scenarios[scenario] = {'text': text, 'comments': transcript, 'summary': aggregate(transcript),
                               'metrics': simulation.quantitative(assumptions, simulation.has_assistance(text))}
    return {'provider': provider, 'domain': domain, 'personas': personas, 'scenarios': scenarios, 'assumptions': assumptions,
            'evidence': evidence, 'rounds': 3, 'calls_planned': len(personas) * 2 * 3,
            'limitations': [f'{len(personas)} persona sintetis disesuaikan dengan topik regulasi ({domain}), bukan sampel statistik masyarakat.',
                           'Sikap dihitung dari komentar terakhir tiap agen; bukan persentase opini publik.',
                           'Angka layanan dan biaya memakai model asumsi terpisah, bukan hasil komentar agen.',
                           'Balasan membaca putaran sebelumnya; tidak ada kalibrasi perilaku masyarakat nyata.',
                           'Sumber hukum adalah konteks dan belum diverifikasi sebagai hukum terkonsolidasi.']}
