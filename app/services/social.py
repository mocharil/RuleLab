"""Domain-tailored synthetic citizens, synchronous rounds, and traceable public reactions.

Each round observes only completed previous rounds of the same scenario.
Personas adjust dynamically according to the regulation domain (Labor, Maritime,
Environment, Health, Digital Service, Governance, etc.).
Nothing here estimates public sentiment or invents population statistics.
"""
from app.models import SocialOptions, Assumptions
import asyncio, re
from typing import Literal
from pydantic import BaseModel, Field
from app.config import settings
from app.services import ai, legal, retrieval, simulation, network

DOMAIN_PERSONAS = {
    'labor': [
        {'id': 'hartono_apindo', 'name': 'Hartono', 'role': 'Employers’ Association (APINDO)', 'background': 'Owner of a labour-intensive manufacturer with 1,200 workers.', 'goal': 'Predictable operating costs, flexible working hours and business continuity.', 'issue': 'cost', 'domain': 'labor'},
        {'id': 'wahyu_buruh', 'name': 'Wahyu', 'role': 'Factory Workers’ Union', 'background': 'Industrial machine operator with 8 years of service and a union officer.', 'goal': 'Decent wages, permanent employment status (PKWTT), severance guarantees and occupational safety.', 'issue': 'capacity', 'domain': 'labor'},
        {'id': 'hendra_umkm', 'name': 'Hendra', 'role': 'Retail MSME Owner', 'background': 'Owner of a wholesale shop and repair service with 7 employees.', 'goal': 'Flexible wage rules suited to micro-business scale without heavy criminal sanctions.', 'issue': 'cost', 'domain': 'labor'},
        {'id': 'ratna_freelance', 'name': 'Ratna', 'role': 'Freelancer & Gig Partner', 'background': 'Freelance creative worker and ride-hailing partner with variable income.', 'goal': 'Work-accident social security and clear partnership clauses.', 'issue': 'access', 'domain': 'labor'},
        {'id': 'dimas_freshgrad', 'name': 'Dimas', 'role': 'Job Seeker / Vocational Graduate', 'background': 'New vocational polytechnic graduate looking for a first formal job.', 'goal': 'An open job market without age or experience discrimination.', 'issue': 'access', 'domain': 'labor'},
        {'id': 'maya_hrd', 'name': 'Maya', 'role': 'Industrial Relations / HR Practitioner', 'background': 'HR manager at a national logistics and warehousing company.', 'goal': 'Measured bipartite procedures, clear layoff rules and fast mediation.', 'issue': 'clarity', 'domain': 'labor'},
        {'id': 'agus_pengawas', 'name': 'Agus', 'role': 'Government Labour Inspector', 'background': 'Manpower agency officer who supervises company compliance with labour standards.', 'goal': 'Labour standards that are realistic to supervise and backed by firm enforcement tools.', 'issue': 'capacity', 'domain': 'labor'},
        {'id': 'siti_konsumen', 'name': 'Siti', 'role': 'General public / consumer', 'background': 'Homemaker who manages the family’s basic-needs budget.', 'goal': 'Stable prices for basic needs so higher production costs do not trigger inflation.', 'issue': 'cost', 'domain': 'labor'}
    ],
    'maritime': [
        {'id': 'rusli_nelayan', 'name': 'Pak Rusli', 'role': 'Traditional Coastal Fisher', 'background': 'Fisher with an outboard boat under 5 GT using hand lines.', 'goal': 'Protection of traditional fishing zones from large vessels and easy access to subsidized diesel.', 'issue': 'access', 'domain': 'maritime'},
        {'id': 'edward_kapal', 'name': 'Edward', 'role': 'Fishing Fleet & Industry Owner', 'background': 'Owner of six 30 GT fishing vessels licensed under measured fishing.', 'goal': 'Fast sailing permits (SPB), certain catch quotas and smooth export logistics.', 'issue': 'cost', 'domain': 'maritime'},
        {'id': 'bu_nur_pedagang', 'name': 'Bu Nur', 'role': 'Wet-Market Fish Trader', 'background': 'Wholesale fresh-fish trader at a local landing pier.', 'goal': 'Stable daily catch supply and affordable cold storage.', 'issue': 'capacity', 'domain': 'maritime'},
        {'id': 'iwan_petambak', 'name': 'Iwan', 'role': 'Coastal Pond Farmer', 'background': 'Shrimp and milkfish farmer in a coastal river estuary.', 'goal': 'Clear shoreline boundaries, clean waste-free seawater and certified fry.', 'issue': 'clarity', 'domain': 'maritime'},
        {'id': 'dr_fajar_konservasi', 'name': 'Dr. Fajar', 'role': 'Oceanography & Conservation Researcher', 'background': 'Marine biologist from a reef research and conservation advocacy institute.', 'goal': 'Protection of Marine Conservation Areas from overfishing and destructive fishing gear.', 'issue': 'capacity', 'domain': 'maritime'},
        {'id': 'kapten_trio_syahbandar', 'name': 'Kapten Trio', 'role': 'Fishing Port Harbourmaster', 'background': 'Shipping safety and fish landing inspection officer at the port.', 'goal': 'Compliance with catch e-logbook reporting and crew operational safety.', 'issue': 'clarity', 'domain': 'maritime'},
        {'id': 'arifin_tokoh_adat', 'name': 'Arifin', 'role': 'Coastal Customary Leader & Panglima Laot', 'background': 'Leader of a coastal customary institution guarding local marine conservation wisdom.', 'goal': 'Recognition of customary sea rights and protection of customary areas from outside vessels.', 'issue': 'accessibility', 'domain': 'maritime'},
        {'id': 'linda_pengolah', 'name': 'Linda', 'role': 'Seafood-processing MSME', 'background': 'Home-scale maker of fish crackers, shrimp paste and shredded fish.', 'goal': 'Hygienic quality fish supplies and easy BPOM/health office distribution certification.', 'issue': 'cost', 'domain': 'maritime'}
    ],
    'environment': [
        {'id': 'darman_petani_hutan', 'name': 'Pak Darman', 'role': 'Social Forestry Farmer', 'background': 'Agroforestry farmer on the edge of a production forest.', 'goal': 'Legal access to manage community forest land and rights certainty without criminalization.', 'issue': 'access', 'domain': 'environment'},
        {'id': 'irwan_industri', 'name': 'Irwan', 'role': 'Industrial Environmental Compliance Manager', 'background': 'In charge of wastewater treatment and emissions at a mining/manufacturing plant.', 'goal': 'Measurable emission and waste standards and a transition period to retrofit clean technology.', 'issue': 'cost', 'domain': 'environment'},
        {'id': 'nadira_walhi', 'name': 'Nadira', 'role': 'Environmental Rights Advocacy Coalition', 'background': 'Environmental law researcher at a nature-protection civil society organization.', 'goal': 'Strict environmental impact assessment (AMDAL) duties, transparent ecological audits and firm sanctions for polluters.', 'issue': 'clarity', 'domain': 'environment'},
        {'id': 'widya_warga_sungai', 'name': 'Bu Widya', 'role': 'Riverbank resident', 'background': 'Downstream resident who relies on river water for bathing and washing.', 'goal': 'River water free of hazardous waste and guaranteed compensation for ecosystem restoration.', 'issue': 'accessibility', 'domain': 'environment'},
        {'id': 'teguh_polhut', 'name': 'Teguh', 'role': 'Forest Ranger & Extension Officer', 'background': 'Field patrol officer protecting nature reserves and national parks.', 'goal': 'Adequate patrol equipment and firm authority to act against illegal encroachment.', 'issue': 'capacity', 'domain': 'environment'},
        {'id': 'joko_bank_sampah', 'name': 'Joko', 'role': 'Waste Bank & Recycling Manager', 'background': 'Founder of community waste management and a regency-level circular economy.', 'goal': 'Mandatory waste separation at source and real incentives for the recycling industry.', 'issue': 'cost', 'domain': 'environment'},
        {'id': 'melati_masyarakat_adat', 'name': 'Melati', 'role': 'Elder of a Forest Customary Law Community', 'background': 'Woman customary leader guarding a protected forest and ancestral ecological wisdom.', 'goal': 'Legal recognition of customary forests and protection of living space from concessions.', 'issue': 'access', 'domain': 'environment'},
        {'id': 'bambang_bappeda', 'name': 'Bambang', 'role': 'Regional Spatial Planner (Bappeda)', 'background': 'Technical officer for regency/city spatial plan (RTRW) consistency.', 'goal': 'Compliance with water catchment zones, riverbanks and disaster mitigation.', 'issue': 'clarity', 'domain': 'environment'}
    ],
    'health': [
        {'id': 'tuti_pasien', 'name': 'Bu Tuti', 'role': 'Chronic Patient (BPJS)', 'background': 'Elderly patient on routine referral therapy for hypertension and diabetes at a regional hospital.', 'goal': 'Easy referral system, orderly health facility queues and routine medicines without co-payments.', 'issue': 'access', 'domain': 'health'},
        {'id': 'dr_andre_puskesmas', 'name': 'dr. Andre', 'role': 'Head Doctor of a Remote Health Centre', 'background': 'General practitioner running a primary care facility on an outer island.', 'goal': 'Basic diagnostic equipment, timely essential medicine logistics and work incentives.', 'issue': 'capacity', 'domain': 'health'},
        {'id': 'dr_harlan_direktur_rs', 'name': 'dr. Harlan', 'role': 'Director of a Class B referral hospital', 'background': 'Head of a 250-bed referral hospital with an emergency unit.', 'goal': 'Ina-CBGs claim rates matching real medical costs and reliable disbursement liquidity.', 'issue': 'cost', 'domain': 'health'},
        {'id': 'sinta_apoteker', 'name': 'apt. Sinta', 'role': 'Pharmacist & Independent Pharmacy Owner', 'background': 'Pharmacist managing a general prescription pharmacy in a sub-district.', 'goal': 'Reasonable maximum retail price rules and easy permits for pharmacy facilities.', 'issue': 'clarity', 'domain': 'health'},
        {'id': 'surya_bpjs', 'name': 'Surya', 'role': 'Health Insurance Claims Verifier', 'background': 'Compliance auditor for national health insurance benefits.', 'goal': 'Standardized clinical guidelines to prevent medical fraud and keep funding sustainable.', 'issue': 'clarity', 'domain': 'health'},
        {'id': 'rina_posyandu', 'name': 'Rina', 'role': 'Posyandu & Child Nutrition Volunteer', 'background': 'Volunteer driving stunting prevention and child immunization programmes.', 'goal': 'Sustained operational support for posyandu health posts and an easy village data entry system.', 'issue': 'capacity', 'domain': 'health'},
        {'id': 'agus_pekerja_mandiri', 'name': 'Agus', 'role': 'Self-paying Informal Worker', 'background': 'Self-employed welding workshop owner with irregular monthly income.', 'goal': 'Proportionate health insurance contributions without heavy late-payment penalties.', 'issue': 'cost', 'domain': 'health'},
        {'id': 'yudha_pengamat', 'name': 'Yudha', 'role': 'Medical Service Policy Researcher', 'background': 'Public health academic studying inclusive access to medical care.', 'goal': 'Even distribution of medical facilities and protected service quality for vulnerable groups.', 'issue': 'accessibility', 'domain': 'health'}
    ],
    'digital_service': [
        {'id': 'sari_desa', 'name': 'Sari', 'role': 'Rural resident with limited access (remote area)', 'background': 'Rural resident with unstable mobile signal and a basic phone.', 'goal': 'An offline/in-person assistance channel without denying residents’ administrative rights.', 'issue': 'access', 'domain': 'digital_service'},
        {'id': 'nadia_disabilitas', 'name': 'Nadia', 'role': 'Blind citizen', 'background': 'Smartphone user with a screen reader and a braille keyboard.', 'goal': 'Digital portal accessibility to WCAG standards and guaranteed data privacy without leaks.', 'issue': 'accessibility', 'domain': 'digital_service'},
        {'id': 'bima_loket', 'name': 'Bima', 'role': 'One-stop service counter officer', 'background': 'One-stop integrated service officer at the sub-district office.', 'goal': 'A measured workload, allocated hours for assisting residents, and realistic queue-handling SOPs.', 'issue': 'capacity', 'domain': 'digital_service'},
        {'id': 'raka_umkm', 'name': 'Raka', 'role': 'Independent MSME Owner', 'background': 'Young entrepreneur starting a food stall who often handles distribution permits and business IDs (NIB).', 'goal': 'Fast one-stop integrated licensing (OSS), free of illegal fees, with transparent official costs.', 'issue': 'clarity', 'domain': 'digital_service'},
        {'id': 'dewi_anggaran', 'name': 'Dewi', 'role': 'Regional finance budget officer', 'background': 'Agency spending planner at the Regional Financial Management Agency.', 'goal': 'Efficient IT licence spending and a secured budget line for operational assistance.', 'issue': 'cost', 'domain': 'digital_service'},
        {'id': 'faisal_security', 'name': 'Faisal', 'role': 'Cybersecurity & Data Privacy Practitioner', 'background': 'Consultant on personal data protection and government electronic system resilience.', 'goal': 'Encryption of population data, prevention of data leaks and readiness for the Personal Data Protection Law (PDP).', 'issue': 'clarity', 'domain': 'digital_service'},
        {'id': 'subroto_lansia', 'name': 'Pak Subroto', 'role': 'Retired / elderly resident', 'background': 'A 69-year-old senior who struggles to complete biometric face verification alone.', 'goal': 'A direct assistance lane that is friendly to the elderly, with simple instructions.', 'issue': 'accessibility', 'domain': 'digital_service'},
        {'id': 'anita_ombudsman', 'name': 'Anita', 'role': 'Ombudsman & Public Service Supervisor', 'background': 'Monitors whether public service providers comply with propriety and non-discrimination principles.', 'goal': 'A guaranteed public complaints channel that must be answered, and prevention of service maladministration.', 'issue': 'access', 'domain': 'digital_service'}
    ],
    'governance': [
        {'id': 'hendro_warga_kota', 'name': 'Hendro', 'role': 'Urban resident / private-sector employee', 'background': 'City resident demanding transparent regulation and efficient government bureaucracy.', 'goal': 'Transparent service procedures, free of illegal fees, with a guaranteed completion time.', 'issue': 'clarity', 'domain': 'governance'},
        {'id': 'nurul_pelaku_usaha', 'name': 'Nurul', 'role': 'Local Entrepreneur', 'background': 'Local service business owner handling regional licensing compliance.', 'goal': 'A proportionate regulatory compliance burden without layered requirements across agencies.', 'issue': 'cost', 'domain': 'governance'},
        {'id': 'salim_tokoh_desa', 'name': 'Pak Salim', 'role': 'Rural community leader', 'background': 'Hamlet head representing the aspirations of the rural community.', 'goal': 'A policy that can realistically be implemented in regions with limited facilities.', 'issue': 'access', 'domain': 'governance'},
        {'id': 'tiara_mahasiswa', 'name': 'Tiara', 'role': 'Student / Critical Young Generation', 'background': 'Student activist studying information openness and meaningful participation rights.', 'goal': 'Meaningful public involvement and open policy documents before enactment.', 'issue': 'access', 'domain': 'governance'},
        {'id': 'widodo_asn', 'name': 'Widodo', 'role': 'Technical Implementing Officer / Civil Servant', 'background': 'Civil servant carrying out technical instructions in an implementing unit.', 'goal': 'Clear operating guidance so there is no risk of multiple interpretations or administrative errors.', 'issue': 'clarity', 'domain': 'governance'},
        {'id': 'dr_kartika_akademisi', 'name': 'Dr. Kartika', 'role': 'Constitutional Law & Public Policy Expert', 'background': 'Law faculty lecturer studying the legal hierarchy and the principle of legality.', 'goal': 'Draft compliance with higher-ranking regulations and the openness of the academic paper.', 'issue': 'clarity', 'domain': 'governance'},
        {'id': 'bambang_inspektorat', 'name': 'Bambang', 'role': 'Internal Inspectorate Auditor', 'background': 'Supervisor of agency performance accountability and financial governance.', 'goal': 'Closing gaps for abuse of authority and compliance with budget efficiency principles.', 'issue': 'capacity', 'domain': 'governance'},
        {'id': 'dina_inklusif', 'name': 'Dina', 'role': 'Advocate for the Rights of Vulnerable Groups', 'background': 'Activist supporting women, the elderly and persons with disabilities.', 'goal': 'Equal treatment, non-discrimination and reasonable accommodation in public policy.', 'issue': 'accessibility', 'domain': 'governance'}
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

    # Whole-word matching: substrings such as "ikan" in "diberikan" must not pick the maritime domain.
    has = lambda w, s: re.search(r'(?<![a-z0-9])' + re.escape(w) + r'(?![a-z0-9])', s) is not None
    for domain, keywords in (('labor', labor_kw), ('maritime', maritime_kw), ('environment', env_kw),
                             ('health', health_kw), ('digital_service', digital_kw)):
        for w in keywords:
            if has(w, title): scores[domain] += 5
            if has(w, text): scores[domain] += 1

    best_domain = max(scores, key=scores.get)
    if scores[best_domain] > 0:
        return best_domain
    return 'governance'

def get_personas_for_draft(draft: dict | None = None, count: int = 24) -> list[dict]:
    domain = detect_domain(draft)
    from app.services.persona_pool import expand
    if count not in {8,16,24,32}:raise ValueError('The number of personas must be 8, 16, 24 or 32.')
    return expand(DOMAIN_PERSONAS.get(domain,DOMAIN_PERSONAS['digital_service']),domain,count)

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
            'A': 'This provision must consider business continuity. Fixed costs and rigid working-hour rules can burden labour-intensive industries.',
            'B': 'An alternative scheme with a transition period and bipartite adjustment is more realistic for the investment climate and factory operations.'
        },
        'wahyu_buruh': {
            'A': 'We reject provisions that loosen overtime limits and reduce wage protection. Workers’ normative rights must not be compromised.',
            'B': 'This alternative gives more certainty on employment status and targeted occupational safety. We support it provided field supervision is tightened.'
        },
        'hendra_umkm': {
            'A': 'MSMEs do not have the capital of large corporations. Do not hold our wage standards and administrative obligations to the same level as big industry.',
            'B': 'Relief and assistance for micro businesses in this text is a great relief for our business continuity.'
        },
        'ratna_freelance': {
            'A': 'Freelance partnership status often has no work-accident protection or proper rest hours.',
            'B': 'The social security clause and clear partner rights in alternative B open the protection we have long needed.'
        },
        'dimas_freshgrad': {
            'A': 'The job market needs regulation that opens new vacancies, not stricter entry requirements with irrelevant experience limits.',
            'B': 'Certified apprenticeships and hiring incentives for first-time workers in this alternative really help young people find jobs.'
        },
        'maya_hrd': {
            'A': 'The industrial dispute settlement mechanism in this draft is still open to interpretation and may prolong court disputes.',
            'B': 'A simplified bipartite mediation flow and firm deadlines give legal certainty to both management and workers.'
        },
        'agus_pengawas': {
            'A': 'Labour inspectors are very few. Standards drafted without a workable sanctions mechanism will be hard to enforce.',
            'B': 'Digital reporting tools and integrated compliance audits will make it easier for the agency to monitor company compliance objectively.'
        },
        'siti_konsumen': {
            'A': 'Higher industry costs may be passed on to consumers as higher prices for daily necessities.',
            'B': 'The balance of cost and productivity in alternative B should keep consumer product prices stable.'
        }
    },
    'maritime': {
        'rusli_nelayan': {
            'A': 'As a small fisher with an outboard boat, our fishing zones are squeezed by big trawlers and subsidized diesel is hard to get.',
            'B': 'The 0–4 nautical mile protection zone and easy diesel quota access for traditional fishers in this alternative really protect our livelihoods.'
        },
        'edward_kapal': {
            'A': 'The measured catch quota system must not create red tape for sailing permits (SPB) at the port.',
            'B': 'One-stop licensing at the port and clear industry quota allocation in alternative B give our fleet operational certainty.'
        },
        'bu_nur_pedagang': {
            'A': 'Unstable fresh fish supply and few cold storage facilities make fish spoil quickly and market prices unpredictable.',
            'B': 'Shared cold storage at the fish auction pier will secure supply and keep market prices stable.'
        },
        'iwan_petambak': {
            'A': 'Coastal industrial waste and uncertain shoreline boundaries threaten the future of our shrimp and milkfish ponds.',
            'B': 'Environmentally friendly pond zoning and seawater quality protection in this text secure local farmers’ investments.'
        },
        'dr_fajar_konservasi': {
            'A': 'Overexploitation and reef-destroying gear must be firmly banned with no loopholes for the sake of the sea’s sustainability.',
            'B': 'Stronger Marine Conservation Area status and ecosystem restoration sanctions in alternative B reflect a commitment to sustainable oceans.'
        },
        'kapten_trio_syahbandar': {
            'A': 'Many vessels operate without seaworthiness checks and are reluctant to fill in electronic catch logbooks consistently.',
            'B': 'VMS-based monitoring and mandatory electronic logbooks in this alternative raise maritime safety standards.'
        },
        'arifin_tokoh_adat': {
            'A': 'Local customary sea law such as Panglima Laot or Sasi is often ignored by fishing vessels from outside the region.',
            'B': 'Official recognition of customary sea rights and coastal customary sanctions in this draft respects the long-standing sovereignty of indigenous communities.'
        },
        'linda_pengolah': {
            'A': 'Our home-made fish crackers and seafood products are held back by uncertain hygienic raw-material supply and expensive certification.',
            'B': 'Free certification for micro processors and a guaranteed local fish supply in alternative B support the coastal economy.'
        }
    },
    'digital_service': {
        'sari_desa': {
            'A': 'How can rural residents without stable internet access their public service rights if everything must be digital?',
            'B': 'An offline assistance option and help counter at the village office in alternative B make sure we are not left out.'
        },
        'nadia_disabilitas': {
            'A': 'Government apps often cannot be read by screen readers and lack alternative text. Our right to independence is ignored.',
            'B': 'Mandatory WCAG compliance and reasonable accommodation in alternative B guarantee disability-friendly services.'
        },
        'bima_loket': {
            'A': 'Counter officers face a surge of confused applicants without workload guidance or time allocated for assistance.',
            'B': 'The ratio of assisting staff and the rotation schedule for integrated services in alternative B create a realistic workload.'
        },
        'raka_umkm': {
            'A': 'Business licensing is still split across many regional apps and often asks for the same physical documents again and again.',
            'B': 'One-stop integration with automatic verification and a guaranteed permit issuance time in alternative B speeds up our business.'
        },
        'dewi_anggaran': {
            'A': 'Spending on servers and app licences balloons without evaluating real benefits for residents.',
            'B': 'A shared cloud-computing financing model and measured assistance allocation in alternative B keep fiscal efficiency.'
        },
        'faisal_security': {
            'A': 'Storing digital population data without standard encryption and regular security audits risks personal data leaks.',
            'B': 'The PDP Law compliance clause and mandatory regular security audits in alternative B guarantee protection of residents’ data.'
        },
        'subroto_lansia': {
            'A': 'For us elderly people, on-screen instructions are confusing and easy to mis-tap. We need face-to-face service.',
            'B': 'A dedicated service lane for the elderly with friendly assisting staff makes us feel protected by the state.'
        },
        'anita_ombudsman': {
            'A': 'Removing conventional counters without ready infrastructure is maladministration that denies public service.',
            'B': 'The duty to provide an active complaints channel and public satisfaction surveys in alternative B strengthens agency accountability.'
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
        if scenario == 'B' or assistance:
            raw_comment = f"As {persona['name']} ({persona.get('role', 'representative')}), I support this alternative because it provides certainty on {issue} and fairer accommodation."
        else:
            raw_comment = f"As {persona['name']}, I have critical notes on this initial draft. The articles need to consider the real barriers related to {issue} on the ground."

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

    rationale = f"Consideration from {persona['name']} ({persona.get('role', 'stakeholder')}): {persona['goal']} Main issue: {issue}. Opinion aligned with the Scenario {scenario} text."
    proposal = f"Draft technical guidelines that guarantee certainty on {issue} and evaluate implementation regularly."

    return {
        'stance': stance,
        'comment': full_comment,
        'rationale': rationale,
        'issue': issue,
        'proposal': proposal,
        'reply_to': target['id'] if target else None,
        'evidence_ids': []
    }

async def simulate(draft, alternative, assumptions, evidence, emit, options=None):
    options=SocialOptions.model_validate(options or {}).model_dump()
    assumptions=Assumptions.model_validate(assumptions).model_dump()
    texts = {'A': '\n\n'.join('Pasal ' + a['number'] + '\n' + a['text'] for a in draft['articles']), 'B': alternative}
    allowed = {e['id'] for e in evidence}
    scenarios = {}
    provider = {'mode': 'demo' if settings.provider == 'demo' else 'live', 'provider': settings.provider,
                'model': None if settings.provider == 'demo' else settings.model}
    personas = get_personas_for_draft(draft, options['persona_count'])
    domain = detect_domain(draft)
    capacity=asyncio.Semaphore(settings.ai_concurrency)
    async def generate_with(task,data,model):
        async with capacity:
            return await asyncio.wait_for(ai.generate(task,data,model),timeout=settings.agent_step_timeout)
    async def generate_persona(task,data):
        return await generate_with(task,data,Reaction)

    crowd = graph = None
    states = {}
    if options['crowd_size']:
        emit('coordinator', 'build_graph', 'running', {})
        graph = network.build_graph(draft, alternative, evidence, personas)
        if settings.provider != 'demo':
            try:
                extraction, _ = await generate_with(
                    'Extract the stakeholder knowledge graph of this draft regulation: institutions, groups, instruments, places and key concepts, '
                    'and how they relate (regulates, funds, affects, opposes, supports, depends_on, enforces). Use only entities that the text or sources mention '
                    'or that the listed stakeholders clearly interact with. Names of stakeholders must match the stakeholders list exactly when you relate to them. Write in English.',
                    {'regulation_text': texts['A'][:6000], 'alternative_text': alternative[:3000], 'stakeholders': [p['role'] or p['name'] for p in personas],
                     'evidence': retrieval.evidence_payload(evidence)}, network.GraphExtraction)
                graph = network.merge_extraction(graph, network.GraphExtraction.model_validate(extraction), personas)
            except Exception as exc:
                graph['notes'].append(f'LLM graph enrichment skipped ({type(exc).__name__}); rule-based graph kept.')
        emit('coordinator', 'build_graph', 'completed', {'entities': len(graph['entities']), 'relations': len(graph['relations']), 'extraction': graph['extraction']})
        crowd = network.Crowd(personas, options['crowd_size'], draft.get('id', '') + draft.get('title', '') + ','.join(p['id'] for p in personas))
        emit('coordinator', 'spawn_crowd', 'completed', {'agents': len(crowd.nodes), 'core': crowd.k, 'follow_edges': len(crowd.edges)})

    for scenario, text in texts.items():
        transcript = []
        crowd_state = crowd.new_scenario(scenario) if crowd else None
        for round_number in range(1, options['rounds']+1):
            previous = list(transcript)
            emit('coordinator', 'gather_opinions', 'running', {'scenario': scenario, 'round': round_number})
            async def react(persona):
                cid = f"{scenario}-{round_number}-{persona['id']}"
                emit(persona['id'], 'social_reaction', 'running', {'scenario': scenario, 'round': round_number, 'persona': persona})
                try:
                    if settings.provider == 'demo':
                        await asyncio.sleep(0)
                        output = Reaction.model_validate(demo_reaction(persona, scenario, round_number, text, previous[-96:], personas)).model_dump()
                    else:
                        prompt_task = (
                            f"Play this synthetic persona in a public regulation test forum on the topic {domain}. "
                            "Write a public comment and a short reviewable rationale, not an internal thought process. "
                            f"Identity: {persona['name']}, Role: {persona.get('role', 'Public')}, Background: {persona['background']}, Goal: {persona['goal']}. "
                            "Assess the text according to the persona’s professional interests and background. The stance may stay the same or evolve after reading previous comments. Write the comment, rationale and proposal in English. "
                            "Round one: reply_to=null; later rounds MUST reply to exactly one other agent’s comment from previous_comments. "
                            "Pick the most relevant issue. Do not invent demographic data or claim to represent the whole population. "
                            "Legal sources are supporting context, not empirical evidence of public attitudes. evidence_ids may be empty."
                        )
                        output, metadata = await generate_persona(
                            prompt_task,
                            {'persona': persona, 'scenario': scenario, 'round': round_number, 'regulation_text': text,
                             'assumptions': assumptions, 'previous_comments': [{**c,'comment':c['comment'][:700],'rationale':c['rationale'][:400],'proposal':c['proposal'][:400]} for c in previous[-96:]],
                             'evidence': retrieval.evidence_payload(evidence),
                             'legal_context': legal.context(draft['regulation_type'], evidence)})
                        output = Reaction.model_validate(output).model_dump()
                    if any(e not in allowed for e in output['evidence_ids']):
                        raise ai.AIError('Opinion source outside the evidence.')
                    targets = {c['id'] for c in previous[-96:] if c['persona_id'] != persona['id']}
                    if (round_number == 1 and output['reply_to'] is not None) or (round_number > 1 and output['reply_to'] not in targets):
                        raise ai.AIError('The opinion reply does not point to a previous comment from another agent.')
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
            if crowd:
                stats = crowd.step(crowd_state, round_number, {c['persona_id']: network.STANCE_SCORE[c['stance']] for c in comments})
                emit('coordinator', 'crowd_diffusion', 'completed', {'scenario': scenario, 'round': round_number, 'stats': stats})
            emit('coordinator', 'gather_opinions', 'completed',
                 {'scenario': scenario, 'round': round_number, 'summary': aggregate(transcript)})
        if crowd: states[scenario] = crowd_state
        scenarios[scenario] = {'text': text, 'comments': transcript, 'summary': aggregate(transcript),
                               'metrics': simulation.quantitative(assumptions, simulation.has_assistance(text))}
    net = crowd.export(graph, states) if crowd else None
    return {'provider': provider, 'domain': domain, 'personas': personas, 'scenarios': scenarios, 'network': net, 'assumptions': assumptions,
            'evidence': evidence, 'rounds': options['rounds'], 'options':options, 'calls_planned': len(personas)*2*options['rounds'],
            'limitations': [f'{len(personas)} synthetic personas tailored to the regulation topic ({domain}), not a statistical sample of society.',
                           'Stance is computed from each agent’s latest comment; it is not a percentage of public opinion.',
                           'Service and cost numbers use a separate assumption model, not agent comments.',
                           'Replies read the previous round; there is no calibration to real public behaviour.',
                           'Legal sources are context and are not verified as consolidated law.']}
