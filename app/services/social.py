"""Five synthetic citizens, synchronous rounds, and traceable public reactions.

Each round observes only completed previous rounds of the same scenario.
Nothing here estimates public sentiment or invents population statistics.
"""
import asyncio
from typing import Literal
from pydantic import BaseModel, Field
from app.config import settings
from app.services import ai, legal, retrieval, simulation

PERSONAS = [
    {'id': 'sari', 'name': 'Sari', 'background': 'Warga pedesaan; akses internet dan perangkat terbatas.', 'goal': 'Mendapat pelayanan tanpa hambatan akses.'},
    {'id': 'nadia', 'name': 'Nadia', 'background': 'Warga penyandang disabilitas yang menggunakan pembaca layar.', 'goal': 'Pelayanan mandiri, aksesibel, dan menjaga privasi.'},
    {'id': 'bima', 'name': 'Bima', 'background': 'Petugas layanan dengan kapasitas pendampingan terbatas.', 'goal': 'Pelayanan lancar dengan kapasitas kerja yang realistis.'},
    {'id': 'raka', 'name': 'Raka', 'background': 'Pelaku UMKM yang mengurus perizinan.', 'goal': 'Prosedur cepat, jelas, dan biaya terjangkau.'},
    {'id': 'dewi', 'name': 'Dewi', 'background': 'Pengelola anggaran operasional layanan.', 'goal': 'Pembiayaan layak dan pelaksanaan yang dapat dievaluasi.'},
]

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

def demo_reaction(persona, scenario, round_number, text, previous):
    # Local templates stay explicitly demo; they react to the actual input.
    assistance = simulation.has_assistance(text)
    pid = persona['id']
    issue = {'sari':'access','nadia':'accessibility','bima':'capacity','raka':'clarity','dewi':'cost'}[pid]
    stance = 'conditional' if assistance or pid in {'raka','dewi'} else 'concern'
    quoted = text[:170]
    comments = {
        'sari': 'Adanya bantuan langsung dapat membantu saya. Bagaimana jadwal dan lokasinya?' if assistance else 'Bagaimana warga tanpa internet bisa memenuhi ketentuan ini? Saya membutuhkan jalur bantuan yang jelas.',
        'nadia': 'Kanal bantuan belum memastikan kemandirian. Apakah prosedur dan aplikasi ini aksesibel dengan pembaca layar?',
        'bima': 'Pendampingan memerlukan jadwal, pelatihan dan petugas khusus. Kapasitasnya perlu dihitung sebelum pelaksanaan.',
        'raka': 'Saya mendukung layanan yang lebih cepat, dengan syarat biaya dan langkah pengurusannya jelas.',
        'dewi': 'Kebutuhan petugas dan fasilitas harus memiliki pembiayaan. Saya meminta uji coba dan evaluasi anggaran.',
    }
    # One previous-round target, never a fabricated contemporary reply.
    targets = [c for c in previous if c['persona_id'] != pid]
    target = targets[(round_number + next(i for i,p in enumerate(PERSONAS) if p['id']==pid)) % len(targets)] if targets else None
    prefix = f"Menanggapi {target['name']}: " if target else ''
    return {'stance':stance,'comment':prefix+comments[pid],
            'rationale': f"Tujuan persona: {persona['goal']} Ketentuan yang dibaca: {quoted}. Ini penalaran template demo yang perlu diuji pada pengguna nyata.",
            'issue':issue,'proposal':f"Uji rancangan bersama kelompok terkait {issue} dan tetapkan prosedur tindak lanjut.",
            'reply_to':target['id'] if target else None,'evidence_ids':[]}

async def simulate(draft, alternative, assumptions, evidence, emit):
    texts = {'A':'\n\n'.join('Pasal '+a['number']+'\n'+a['text'] for a in draft['articles']), 'B':alternative}
    allowed = {e['id'] for e in evidence}
    scenarios = {}
    provider = {'mode':'demo' if settings.provider=='demo' else 'live', 'provider':settings.provider,
                'model':None if settings.provider=='demo' else settings.model}
    for scenario, text in texts.items():
        transcript = []
        for round_number in range(1,4):
            previous = list(transcript)
            emit('coordinator','gather_opinions','running',{'scenario':scenario,'round':round_number})
            async def react(persona):
                cid = f"{scenario}-{round_number}-{persona['id']}"
                emit(persona['id'],'social_reaction','running',{'scenario':scenario,'round':round_number,'persona':persona})
                try:
                    if settings.provider=='demo':
                        # Yield to cancellation without fake latency or progress.
                        await asyncio.sleep(0)
                        output = Reaction.model_validate(demo_reaction(persona,scenario,round_number,text,previous)).model_dump()
                    else:
                        output, metadata = await asyncio.wait_for(ai.generate(
                            'Perankan persona sintetis ini dalam forum tentang rancangan peraturan. Tulis komentar publik dan alasan singkat yang dapat ditinjau, bukan proses berpikir internal. '
                            'Nilai teks yang diberikan tanpa menganggap topiknya selalu digital. Sikap boleh tetap sama atau berubah setelah membaca komentar sebelumnya. '
                            'Putaran pertama reply_to=null; putaran berikutnya WAJIB menanggapi tepat satu komentar agen lain dari previous_comments. '
                            'Pilih issue yang paling relevan. Jangan menciptakan data demografis, opini orang nyata, atau mengklaim mewakili populasi. '
                            'Sumber hukum adalah konteks, bukan bukti bahwa masyarakat pasti bereaksi demikian. evidence_ids boleh kosong.',
                            {'persona':persona,'scenario':scenario,'round':round_number,'regulation_text':text,
                             'assumptions':assumptions,'previous_comments':previous,
                             'evidence':retrieval.evidence_payload(evidence),
                             'legal_context':legal.context(draft['regulation_type'],evidence)},Reaction),
                            timeout=settings.agent_step_timeout)
                        output = Reaction.model_validate(output).model_dump()
                    if any(e not in allowed for e in output['evidence_ids']):
                        raise ai.AIError('Sumber opini di luar evidence.')
                    targets = {c['id'] for c in previous if c['persona_id'] != persona['id']}
                    if (round_number==1 and output['reply_to'] is not None) or (round_number>1 and output['reply_to'] not in targets):
                        raise ai.AIError('Balasan opini tidak menunjuk komentar sebelumnya dari agen lain.')
                    comment = {**output,'id':cid,'persona_id':persona['id'],'name':persona['name'],
                               'scenario':scenario,'round':round_number}
                    emit(persona['id'],'social_reaction','completed',{'comment':comment})
                    return comment
                except BaseException as exc:
                    emit(persona['id'],'social_reaction','cancelled' if isinstance(exc,asyncio.CancelledError) else 'failed',
                         {'scenario':scenario,'round':round_number,'persona':persona,'error_type':type(exc).__name__})
                    raise
            tasks = [asyncio.create_task(react(p)) for p in PERSONAS]
            try:
                comments = await asyncio.gather(*tasks)
            except BaseException:
                for task in tasks: task.cancel()
                await asyncio.gather(*tasks,return_exceptions=True)
                raise
            transcript.extend(comments)
            emit('coordinator','gather_opinions','completed',
                 {'scenario':scenario,'round':round_number,'summary':aggregate(transcript)})
        scenarios[scenario] = {'text':text,'comments':transcript,'summary':aggregate(transcript),
                               'metrics':simulation.quantitative(assumptions,simulation.has_assistance(text))}
    return {'provider':provider,'personas':PERSONAS,'scenarios':scenarios,'assumptions':assumptions,
            'evidence':evidence,'rounds':3,'calls_planned':30,
            'limitations':['Lima persona sintetis bukan sampel atau survei masyarakat.',
                           'Sikap dihitung dari komentar terakhir tiap agen; bukan persentase opini publik.',
                           'Angka layanan dan biaya memakai model asumsi terpisah, bukan hasil komentar agen.',
                           'Balasan membaca putaran sebelumnya; tidak ada kalibrasi perilaku masyarakat nyata.',
                           'Sumber hukum adalah konteks dan belum diverifikasi sebagai hukum terkonsolidasi.']}
