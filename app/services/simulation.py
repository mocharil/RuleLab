import asyncio, math, re
from app.config import settings
from app.models import StakeholderOutput
from app.services import ai, retrieval, legal

DOMAIN_STAKEHOLDERS = {
    'labor': [
        ('Serikat Buruh & Pekerja Pabrik', 'Perlindungan upah layak, jaminan kepastian kerja tetap PKWTT, dan keselamatan kerja K3.'),
        ('Asosiasi Pengusaha (APINDO) & Manufaktur', 'Kepastian beban operasional, fleksibilitas jam kerja, dan kelangsungan daya saing usaha.'),
        ('Pelaku Usaha Mikro & Kecil (UMKM)', 'Kemampuan modal terbatas, beban kepatuhan administratif, dan fleksibilitas aturan pengupahan.'),
        ('Pengawas Ketenagakerjaan Dinas', 'Kapasitas inspeksi lapangan, kejelasan norma kerja, dan efektivitas mediasi hubungan industrial.')
    ],
    'maritime': [
        ('Nelayan Tradisional Skala Kecil', 'Perlindungan wilayah tangkap pesisir dari kapal besar, kemudahan BBM bersubsidi, dan keselamatan melaut.'),
        ('Pengusaha Kapal Tangkap & Industri Perikanan', 'Kepastian kuota penangkapan terukur, efisiensi perizinan berlayar (SPB), dan kelancaran ekspor.'),
        ('Pembudidaya Tambak Pesisir & Pengolah Hasil Laut', 'Kepastian sempadan pantai, pasokan air bersih pesisir, dan fasilitas cold storage terjangkau.'),
        ('Pengawas Perikanan & Konservasi Sumber Daya Laut', 'Pencegahan overfishing, kepatuhan e-logbook tangkapan, dan perlindungan terumbu karang.')
    ],
    'environment': [
        ('Petani Sekitar Hutan & Masyarakat Hukum Adat', 'Akses legal kelola perhutanan sosial, kepastian batas lahan adat, dan pencegahan kriminalisasi.'),
        ('Pengelola Operasional Industri & Tambang', 'Kejelasan baku mutu lingkungan, kepastian prosedur AMDAL, dan investasi teknologi bersih.'),
        ('Koalisi Pemerhati Lingkungan Hidup', 'Pencegahan degradasi ekologis, transparansi kajian dampak lingkungan, dan sanksi tegas bagi pencemar.'),
        ('Pengawas Lingkungan Hidup & Polisi Kehutanan', 'Kapasitas patroli pengawasan, instrumen penindakan hukum perusakan hutan, dan pemulihan sungai.')
    ],
    'health': [
        ('Pasien & Peserta Jaminan Kesehatan Nasional', 'Kemudahan alur rujukan berjenjang, antrean faskes tertib, dan ketersediaan obat rutin tanpa iur biaya.'),
        ('Tenaga Medis & Faskes Layanan Primer', 'Kelengkapan alat diagnostik dasar, logistik obat esensial tepat waktu, dan insentif di daerah terpencil.'),
        ('Direksi Rumah Sakit & Fasilitas Rujukan', 'Kecukupan tarif paket Ina-CBGs dengan biaya riil operasional dan kepastian likuiditas klaim.'),
        ('Verifikator Penjaminan & Pengamat Kebijakan Kesehatan', 'Pencegahan fraud medis, standarisasi pedoman klinis, dan keberlanjutan solvabilitas dana kesehatan.')
    ],
    'digital_service': [
        ('Warga dengan Hambatan Akses & Pedesaan', 'Hambatan jaringan internet, perangkat minim, literasi digital rendah, dan kebutuhan loket fisik.'),
        ('Penyandang Disabilitas & Aksesibilitas', 'Standar aksesibilitas antarmuka (WCAG), akomodasi layak, kemandirian, dan perlindungan privasi data.'),
        ('Petugas Loket & Front-Office Pelayanan', 'Kapasitas pendampingan tatap muka, rasio beban kerja antrean, dan petunjuk teknis yang jelas.'),
        ('Pengelola Anggaran & Keuangan Publik', 'Kelayakan belanja lisensi infrastruktur TI, alokasi dana pendampingan luring, dan efisiensi APBD.')
    ],
    'governance': [
        ('Masyarakat Umum & Konsumen Layanan', 'Kemudahan pemenuhan hak administrasi, transparansi prosedur, dan kepastian durasi pelayanan.'),
        ('Pelaku Usaha & Dunia Usaha Lokal', 'Penyederhanaan regulasi, kepastian izin berusaha, dan pencegahan beban kepatuhan berulang.'),
        ('Aparatur Pelaksana Teknis di Lapangan', 'Kejelasan petunjuk operasional teknis, mitigasi risiko kesalahan administrasi, dan kesiapan fasilitas.'),
        ('Pengawas Kepatuhan & Akuntabilitas Publik', 'Kepatuhan hierarki peraturan perundang-undangan, asas keterbukaan, dan mitigasi maladministrasi.')
    ]
}

DEFAULT_STAKEHOLDERS = DOMAIN_STAKEHOLDERS['digital_service']
PERSONAS = DEFAULT_STAKEHOLDERS

def get_stakeholders_for_draft(draft: dict) -> list[tuple[str, str]]:
    from app.services import social
    domain = social.detect_domain(draft)
    return DOMAIN_STAKEHOLDERS.get(domain, DEFAULT_STAKEHOLDERS)

def quantitative(assumptions, assistance):
    n = assumptions['population']
    p = assumptions['digital_access_pct'] / 100
    q = assumptions['assisted_success_pct'] / 100 if assistance else 0
    digital = n * p
    assisted = n * (1 - p) * q
    served = digital + assisted
    return {
        'served': round(served),
        'unserved': round(n - served),
        'access_pct': round(served / n * 100, 1),
        'assisted': round(assisted),
        'cost': round(digital * assumptions['digital_cost'] + assisted * assumptions['assisted_cost']),
        'staff_days': round(assisted / assumptions['staff_capacity'], 1),
        'formula': 'digital = N × p; assisted = N × (1 − p) × q; served = digital + assisted; cost = digital × C_d + assisted × C_a'
    }

def has_assistance(text):
    return bool(re.search(r'\b(pendampingan|tatap muka|kanal alternatif|bantuan langsung|insentif|subsidi|kemitraan|afirmasi)\b', text.lower())) and not bool(re.search(r'(tanpa|tidak menyediakan|dilarang).{0,35}(pendampingan|tatap muka|kanal alternatif|bantuan langsung|insentif|subsidi|kemitraan)', text.lower()))

async def simulate(draft, alternative_text, assumptions):
    current = '\n'.join(a['text'] for a in draft['articles'])
    assist_a = has_assistance(current)
    assist_b = has_assistance(alternative_text)
    evidence = await retrieval.context(current + ' ' + alternative_text, 10)
    allowed = {e['id'] for e in evidence}
    stakeholders = get_stakeholders_for_draft(draft)

    async def stakeholder(name, description):
        if settings.provider == 'demo':
            return {
                'stakeholder': name,
                'benefits': ['Alternatif B membuka akses dan akomodasi perlindungan bagi kelompok terdampak.' if assist_b else 'Naskah memuat kepastian alur baku namun membutuhkan ruang mitigasi lapangan.'],
                'risks': [description, 'Kualitas pelaksanaan memerlukan verifikasi kesiapan sarana dan personil lapangan.'],
                'mitigations': ['Uji keterlaksanaan bersama perwakilan pemangku kepentingan.', 'Tetapkan standar operasional prosedur dan mekanisme pengaduan.'],
                'evidence_ids': [e['id'] for e in evidence[:2]],
                'questions_to_validate': ['Bagaimana kesiapan unit pelaksana di wilayah sasaran?', 'Apakah alokasi sarana dan anggaran pendukung sudah mencukupi?']
            }
        output, _ = await ai.generate(
            'Bandingkan dampak alternatif A dan B dari sudut persona ini. Jangan menghasilkan statistik populasi atau mengklaim mewakili masyarakat. Tunjukkan manfaat, risiko, mitigasi dan kebutuhan validasi lapangan.',
            {'stakeholder': name, 'description': description, 'A': current, 'B': alternative_text,
             'assumptions': assumptions, 'evidence': retrieval.evidence_payload(evidence),
             'legal_context': legal.context(draft['regulation_type'], evidence)}, StakeholderOutput)
        output['stakeholder'] = name
        if any(id not in allowed for id in output['evidence_ids']):
            raise ai.AIError('Sumber persona di luar evidence. Hasil ditolak.')
        return output

    tasks = [asyncio.create_task(stakeholder(n, d)) for n, d in stakeholders]
    try:
        perspectives = await asyncio.gather(*tasks)
    except BaseException:
        for task in tasks:
            task.cancel()
        await asyncio.gather(*tasks, return_exceptions=True)
        raise

    a = quantitative(assumptions, assist_a)
    b = quantitative(assumptions, assist_b)
    sensitivity = []
    for delta in [-10, 0, 10]:
        changed = {**assumptions, 'digital_access_pct': max(0, min(100, assumptions['digital_access_pct'] + delta))}
        sensitivity.append({
            'digital_access_pct': changed['digital_access_pct'],
            'A': quantitative(changed, assist_a)['access_pct'],
            'B': quantitative(changed, assist_b)['access_pct']
        })

    return {
        'provider': {'mode': 'demo' if settings.provider == 'demo' else 'live', 'provider': settings.provider, 'model': None if settings.provider == 'demo' else settings.model},
        'assumptions': assumptions,
        'alternative_text': alternative_text,
        'A': a,
        'B': b,
        'assistance_detection': {'A': assist_a, 'B': assist_b, 'method': 'keyword_heuristic_needs_review'},
        'delta': {'served': b['served'] - a['served'], 'cost': b['cost'] - a['cost'], 'access_points': round(b['access_pct'] - a['access_pct'], 1)},
        'stakeholders': perspectives,
        'sensitivity': sensitivity,
        'evidence': evidence,
        'limitations': [
            'Angka dihitung dari asumsi input pengguna, bukan statistik masyarakat atau prediksi Gemini.',
            'Persona pemangku kepentingan tidak menggantikan konsultasi publik langsung.',
            'Model biaya hanya menghitung layanan variabel, belum mencakup biaya tetap atau investasi modal awal.',
            'Deteksi kanal bantuan berbasis kata kunci, perlu dicek pengguna.',
            'Ini simulasi skenario kebijakan, bukan engine populasi terkalibrasi.'
        ]
    }
