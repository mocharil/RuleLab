import asyncio, math, re
from app.config import settings
from app.models import StakeholderOutput
from app.services import ai, retrieval, legal

DOMAIN_STAKEHOLDERS = {
    'labor': [
        ('Factory Unions & Workers', 'Decent wage protection, permanent employment (PKWTT) and occupational safety.'),
        ('Employers’ Association (APINDO) & Manufacturing', 'Predictable operating costs, flexible working hours and continued competitiveness.'),
        ('Micro & Small Businesses (MSMEs)', 'Limited capital, administrative compliance burden and flexible wage rules.'),
        ('Government Labour Inspectors', 'Field inspection capacity, clear labour standards and effective industrial mediation.')
    ],
    'maritime': [
        ('Small-scale Traditional Fishers', 'Protection of coastal fishing zones from large vessels, access to subsidized fuel and safety at sea.'),
        ('Fishing Fleet & Fisheries Industry', 'Certain measured catch quotas, efficient sailing permits (SPB) and smooth exports.'),
        ('Coastal Pond Farmers & Seafood Processors', 'Clear shoreline boundaries, clean coastal water and affordable cold storage.'),
        ('Fisheries & Marine Resource Conservation Supervisors', 'Preventing overfishing, catch e-logbook compliance and coral reef protection.')
    ],
    'environment': [
        ('Forest-Edge Farmers & Customary Law Communities', 'Legal access to manage social forestry, certainty of customary land boundaries and preventing criminalization.'),
        ('Industrial & Mining Operators', 'Clear environmental standards, certain AMDAL procedures and clean technology investment.'),
        ('Environmental Watchdog Coalition', 'Preventing ecological degradation, transparent environmental impact studies and firm sanctions for polluters.'),
        ('Environmental Supervisors & Forest Rangers', 'Patrol capacity, enforcement tools against forest destruction and river restoration.')
    ],
    'health': [
        ('Patients & National Health Insurance Members', 'Easy tiered referrals, orderly health facility queues and routine medicines without co-payments.'),
        ('Medical Staff & Primary Care Facilities', 'Basic diagnostic equipment, timely essential medicine logistics and incentives in remote areas.'),
        ('Hospital Directors & Referral Facilities', 'Ina-CBGs package rates that cover real operating costs and reliable claim liquidity.'),
        ('Insurance Verifiers & Health Policy Observers', 'Preventing medical fraud, standard clinical guidelines and sustainable health fund solvency.')
    ],
    'digital_service': [
        ('Residents with Access Barriers & Rural Communities', 'Internet network barriers, few devices, low digital literacy and the need for a physical counter.'),
        ('Persons with Disabilities & Accessibility', 'Interface accessibility standards (WCAG), reasonable accommodation, independence and data privacy protection.'),
        ('Counter & Front-Office Service Officers', 'Capacity for in-person assistance, queue workload ratios and clear technical guidance.'),
        ('Public Budget & Finance Officers', 'Feasibility of IT infrastructure licence spending, funding for offline assistance, and regional budget efficiency.')
    ],
    'governance': [
        ('General Public & Service Users', 'Easy fulfilment of administrative rights, transparent procedures and certainty of service duration.'),
        ('Local Businesses', 'Simpler regulation, business licensing certainty and preventing repeated compliance burdens.'),
        ('Field Technical Officers', 'Clear technical operating guidance, mitigation of administrative errors and facility readiness.'),
        ('Compliance & Public Accountability Supervisors', 'Compliance with the legal hierarchy, the openness principle and maladministration mitigation.')
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
                'benefits': ['Alternative B opens access and protective accommodation for affected groups.' if assist_b else 'The text sets a clear standard flow but needs room for field mitigation.'],
                'risks': [description, 'Implementation quality needs verification of facility and field staff readiness.'],
                'mitigations': ['Test feasibility together with stakeholder representatives.', 'Set standard operating procedures and a complaints mechanism.'],
                'evidence_ids': [e['id'] for e in evidence[:2]],
                'questions_to_validate': ['How ready are the implementing units in the target region?', 'Are the supporting facilities and budget adequate?']
            }
        output, _ = await ai.generate(
            'Compare the impact of alternatives A and B from this persona’s point of view. Do not produce population statistics or claim to represent society. Show benefits, risks, mitigations and the field validation needed. Write in English.',
            {'stakeholder': name, 'description': description, 'A': current, 'B': alternative_text,
             'assumptions': assumptions, 'evidence': retrieval.evidence_payload(evidence),
             'legal_context': legal.context(draft['regulation_type'], evidence)}, StakeholderOutput)
        output['stakeholder'] = name
        if any(id not in allowed for id in output['evidence_ids']):
            raise ai.AIError('Persona source outside the evidence. Result rejected.')
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
            'Numbers are computed from the user’s input assumptions, not public statistics or Gemini predictions.',
            'Stakeholder personas do not replace direct public consultation.',
            'The cost model only counts variable service costs; it excludes fixed costs and initial capital investment.',
            'Assistance-channel detection is keyword-based and needs user checking.',
            'This is a policy scenario simulation, not a calibrated population engine.'
        ]
    }
