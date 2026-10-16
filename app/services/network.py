"""Stakeholder knowledge graph + crowd social network (MiroFish/OASIS-inspired).

Stage 1  build_graph    : entities and relations extracted from the draft, sources and personas
                          (rule-based always; optional LLM enrichment in live mode).
Stage 2  Crowd          : spawns hundreds of lightweight agents from the AI persona archetypes
                          and wires a follow network (homophily, hubs, bridges).
Stage 3  Crowd.step     : one synchronous round of opinion diffusion per scenario
                          (feed recommendation, bounded confidence, backfire, follow/unfollow).
Stage 4  Crowd.export   : influence (PageRank), communities, bridges, echo-chamber index.

Core personas speak through the AI provider; crowd agents follow transparent opinion-dynamics
rules seeded by what the core personas actually said. The crowd is NOT a population sample.
"""
import hashlib, math, random, re
from collections import Counter, defaultdict
from typing import Literal
from pydantic import BaseModel, Field

STANCE_SCORE = {'support': .75, 'conditional': .25, 'uncertain': 0., 'concern': -.65}
ISSUE_WORDS = {
    'cost': ['biaya', 'tarif', 'anggaran', 'pembiayaan', 'pungutan', 'denda', 'sanksi', 'cost', 'fee', 'budget', 'price', 'wage', 'upah'],
    'access': ['akses', 'layanan', 'pelayanan', 'jangkauan', 'persyaratan', 'access', 'service', 'eligib'],
    'accessibility': ['disabilitas', 'aksesibilitas', 'ramah', 'akomodasi', 'accessib', 'disab'],
    'capacity': ['kapasitas', 'petugas', 'sarana', 'prasarana', 'pengawas', 'capacity', 'staff', 'infrastructure', 'inspect'],
    'clarity': ['definisi', 'prosedur', 'mekanisme', 'kewenangan', 'pengertian', 'definition', 'procedure', 'authority'],
}
TENSION = {frozenset(p) for p in [('cost', 'access'), ('cost', 'accessibility'), ('cost', 'capacity'), ('capacity', 'access')]}
FIRST = ['Budi', 'Sari', 'Agus', 'Dewi', 'Rizki', 'Wulan', 'Eko', 'Ayu', 'Dedi', 'Lina', 'Hadi', 'Mega', 'Fajar', 'Nina', 'Yudi', 'Tari', 'Andi', 'Rina',
         'Bayu', 'Citra', 'Doni', 'Fitri', 'Gilang', 'Hana', 'Irfan', 'Juwita', 'Kevin', 'Laras', 'Miko', 'Novi', 'Oki', 'Putri', 'Qori', 'Rangga', 'Sinta',
         'Tomi', 'Umi', 'Vino', 'Wati', 'Yoga', 'Zahra', 'Arif', 'Bella', 'Candra', 'Dian', 'Erlin', 'Ferry', 'Gita', 'Hendra', 'Indah']
VARIANTS = ['member', 'local resident', 'volunteer', 'observer', 'practitioner']
GROUP_PALETTE = ['#cd5271', '#2f6fb0', '#2e8b6a', '#c58a1a', '#7a5ab0', '#1f8a9c', '#b5543c', '#5b6b7a']

class GEntity(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    type: Literal['institution', 'group', 'concept', 'instrument', 'place']
    description: str = Field(min_length=5, max_length=240)

class GRelation(BaseModel):
    source: str = Field(min_length=2, max_length=80)
    target: str = Field(min_length=2, max_length=80)
    type: Literal['regulates', 'funds', 'affects', 'opposes', 'supports', 'depends_on', 'enforces']
    description: str = Field(min_length=5, max_length=240)

class GraphExtraction(BaseModel):
    entities: list[GEntity] = Field(max_length=14)
    relations: list[GRelation] = Field(max_length=20)

def slug(text):
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')[:40] or 'x'

def clamp(v, lo=-1., hi=1.):
    return max(lo, min(hi, v))

def issues_in(text):
    low = text.lower()
    return {issue: sum(low.count(w) for w in words) for issue, words in ISSUE_WORDS.items() if any(w in low for w in words)}

def build_graph(draft, alternative, evidence, personas):
    """Deterministic stakeholder knowledge graph from the draft, retrieved sources and personas."""
    entities, relations = [], []
    policy = {'id': 'policy', 'type': 'policy', 'label': (draft.get('title') or 'Draft regulation')[:90], 'description': 'Policy under review'}
    entities.append(policy)
    articles = draft.get('articles', [])
    for a in articles[:10]:
        entities.append({'id': 'article:' + a['number'], 'type': 'article', 'label': 'Article ' + a['number'], 'description': a['text'][:160]})
        relations.append({'source': 'article:' + a['number'], 'target': 'policy', 'type': 'part_of', 'weight': 1})
    sources = []
    for e in evidence[:8]:
        label = e.get('regulation_label', 'Source')
        sid = 'source:' + slug(label) + ':' + str(e.get('number', ''))
        if any(x['id'] == sid for x in entities): continue
        entities.append({'id': sid, 'type': 'source', 'label': f"{label} Art. {e.get('number', '')}", 'description': (e.get('text') or '')[:160]})
        relations.append({'source': sid, 'target': 'policy', 'type': 'grounds', 'weight': 1})
        sources.append(sid)
    for issue in sorted({p.get('issue', 'other') for p in personas}):
        entities.append({'id': 'issue:' + issue, 'type': 'issue', 'label': issue.capitalize(), 'description': 'Cross-cutting concern'})
    for p in personas:
        entities.append({'id': 'stakeholder:' + p['id'], 'type': 'stakeholder', 'label': p['name'], 'cluster': p.get('cluster', p.get('issue', 'other')),
                         'description': f"{p.get('role', '')}: {p.get('goal', '')}"[:200]})
        relations.append({'source': 'stakeholder:' + p['id'], 'target': 'issue:' + p.get('issue', 'other'), 'type': 'concerned_with', 'weight': 1})
        relations.append({'source': 'policy', 'target': 'stakeholder:' + p['id'], 'type': 'affects', 'weight': 1})
    # Article -> stakeholder: which provisions touch which persona's concern
    persona_issue_words = {p['id']: p.get('issue', 'other') for p in personas}
    for a in articles[:10]:
        found = issues_in(a['text'] + ' ' + alternative[:600])
        scored = []
        for p in personas:
            overlap = found.get(persona_issue_words[p['id']], 0) + sum(1 for w in re.findall(r'[a-z]{5,}', (p.get('goal', '') + ' ' + p.get('role', '')).lower()) if w in a['text'].lower())
            if overlap: scored.append((overlap, p['id']))
        for overlap, pid in sorted(scored, reverse=True)[:2]:
            relations.append({'source': 'article:' + a['number'], 'target': 'stakeholder:' + pid, 'type': 'impacts', 'weight': overlap})
    # Stakeholder <-> stakeholder: shared concern or structural tension
    for i, p in enumerate(personas):
        for q in personas[i + 1:]:
            a, b = p.get('issue', 'other'), q.get('issue', 'other')
            if a == b: relations.append({'source': 'stakeholder:' + p['id'], 'target': 'stakeholder:' + q['id'], 'type': 'shares_concern', 'weight': 1})
            elif frozenset((a, b)) in TENSION: relations.append({'source': 'stakeholder:' + p['id'], 'target': 'stakeholder:' + q['id'], 'type': 'tension', 'weight': 1})
    return {'entities': entities, 'relations': relations, 'extraction': 'rules', 'notes': []}

def merge_extraction(graph, extraction, personas):
    """Add LLM-extracted institutions/instruments/relations; every relation must resolve to a known entity."""
    names = {e['label'].lower(): e['id'] for e in graph['entities']}
    for p in personas: names.setdefault(p.get('role', p['name']).lower(), 'stakeholder:' + p['id'])
    for e in extraction.entities:
        if e.name.lower() in names: continue
        eid = 'x:' + slug(e.name)
        graph['entities'].append({'id': eid, 'type': e.type, 'label': e.name, 'description': e.description})
        names[e.name.lower()] = eid
    kept = 0
    for r in extraction.relations:
        s, t = names.get(r.source.lower()), names.get(r.target.lower())
        if s and t and s != t:
            graph['relations'].append({'source': s, 'target': t, 'type': r.type, 'weight': 1, 'description': r.description}); kept += 1
    graph['extraction'] = 'rules+llm'
    graph['notes'].append(f'LLM added {len(extraction.entities)} entities and {kept}/{len(extraction.relations)} resolvable relations.')
    return graph

class Scenario:
    """Mutable per-scenario state (stances, follow sets, logs)."""
    def __init__(self, name, follows, n):
        self.name, self.follows = name, [set(f) for f in follows]
        self.cur = [0.] * n
        self.history = [[] for _ in range(n)]
        self.engage = [0.] * n
        self.rounds, self.interactions, self.rewired = [], [], []

class Crowd:
    def __init__(self, personas, size, seed_text):
        self.personas, self.k, self.size = personas, len(personas), size
        self.seed = hashlib.sha256(seed_text.encode()).hexdigest()[:12]
        rng = random.Random(self.seed)
        self.nodes = []
        for i, p in enumerate(personas):
            self.nodes.append({'id': p['id'], 'name': p['name'], 'role': p.get('role', ''), 'archetype': p['id'], 'cluster': p.get('cluster', p.get('issue', 'other')),
                               'core': True, 'activity': 1., 'influence': 1., 'openness': .55, 'stubborn': .55})
        weights = [1.] * self.k
        for j in range(size):
            parent = rng.choices(range(self.k), weights)[0]
            p = personas[parent]
            name = f"{FIRST[rng.randrange(len(FIRST))]} {chr(65 + rng.randrange(26))}."
            self.nodes.append({'id': f'c{j + 1:03d}', 'name': name, 'role': f"{p.get('role', 'Stakeholder')} · {VARIANTS[rng.randrange(len(VARIANTS))]}",
                               'archetype': p['id'], 'cluster': p.get('cluster', p.get('issue', 'other')), 'core': False,
                               'activity': round(.15 + .8 * rng.random() ** 1.5, 2),
                               'influence': round(min(1., .08 + .9 * (rng.paretovariate(2.2) - 1) / 4), 2),
                               'openness': round(.15 + .8 * rng.random(), 2), 'stubborn': round(.3 + .5 * rng.random(), 2)})
        self.index = {n['id']: i for i, n in enumerate(self.nodes)}
        self.follows = self._wire(rng)
        self.edges = [[i, j] for i, fs in enumerate(self.follows) for j in sorted(fs)]

    def _wire(self, rng):
        n = len(self.nodes); k = self.k
        follows = [set() for _ in range(n)]
        by_arch = defaultdict(list); by_cluster = defaultdict(list)
        for i in range(k, n):
            by_arch[self.nodes[i]['archetype']].append(i); by_cluster[self.nodes[i]['cluster']].append(i)
        crowd_ids = list(range(k, n))
        infl = [self.nodes[i]['influence'] for i in crowd_ids]
        def pick(pool, m, exclude):
            pool = [x for x in pool if x not in exclude]
            if not pool: return []
            w = [self.nodes[x]['influence'] + .02 for x in pool]
            out = set()
            for _ in range(m * 3):
                out.add(rng.choices(pool, w)[0])
                if len(out) >= m: break
            return list(out)
        for i in crowd_ids:
            nd = self.nodes[i]; parent = self.index[nd['archetype']]
            if rng.random() < .85: follows[i].add(parent)
            follows[i].update(pick(by_arch[nd['archetype']], rng.randint(3, 5), {i}))     # same archetype (homophily)
            if rng.random() < .5: follows[i].update(pick(by_cluster[nd['cluster']], 1, {i}))   # same issue cluster
            if rng.random() < .3: follows[i].update(pick(crowd_ids, 1, {i}))                    # cross-cluster bridges
            if rng.random() < .15: follows[i].add(rng.randrange(k))                         # follows another core voice
        for i in range(k):  # core personas follow tension / shared-concern peers
            ordered = sorted(range(k), key=lambda j: (self.nodes[j]['cluster'] == self.nodes[i]['cluster'], rng.random()), reverse=True)
            follows[i].update([j for j in ordered if j != i][:3])
        return follows

    def new_scenario(self, name):
        return Scenario(name, self.follows, len(self.nodes))

    def step(self, st, r, core):
        """One synchronous round. `core` maps persona id -> stance score from that round's real comments."""
        rng = random.Random(f'{self.seed}:{st.name}:{r}')
        n, k = len(self.nodes), self.k
        prev = st.cur[:]; new = prev[:]
        for i in range(k): new[i] = core.get(self.nodes[i]['id'], prev[i])
        actions = Counter(); log = []
        if r == 1:
            for i in range(k, n):
                nd = self.nodes[i]; parent = self.index[nd['archetype']]
                new[i] = clamp(new[parent] + rng.gauss(0, .28))
                actions['follow'] += 1
                if len(log) < 40 and rng.random() < .3: log.append({'round': r, 'actor': nd['id'], 'action': 'follow', 'target': nd['archetype'], 'before': None, 'after': round(new[i], 2)})
            st.engage = [self.nodes[i]['influence'] for i in range(n)]
        else:
            trending = sorted(range(n), key=lambda x: st.engage[x], reverse=True)[:3]
            engage = [0.] * n
            for i in range(k, n):
                nd = self.nodes[i]
                if rng.random() > nd['activity']: actions['idle'] += 1; continue
                feed = [(j, self.nodes[j]['influence'] * (2.5 if j < k else 1.)) for j in st.follows[i]]
                if rng.random() < .15:
                    j = rng.randrange(n)
                    if j != i and j not in st.follows[i]: feed.append((j, .6 * self.nodes[j]['influence'] + .1))
                feed += [(t, .5) for t in trending if t != i and t not in st.follows[i]]
                thr = .5 + .9 * nd['openness']
                acc, rej = [], []
                for j, w in feed:
                    d = prev[j] - prev[i]
                    (acc if abs(d) <= thr else rej).append((j, w, d))
                if acc:
                    tw = sum(w for _, w, _ in acc); m = sum(w * prev[j] for j, w, _ in acc) / tw
                    mu = .15 + .35 * (1 - nd['stubborn'])
                    new[i] = clamp(prev[i] + mu * (m - prev[i]))
                    j = max(acc, key=lambda x: x[1])[0]
                    act = 'repost' if abs(new[i]) > .6 and rng.random() < .4 else 'like'
                    actions[act] += 1; engage[j] += 1.2 if act == 'repost' else 1.
                    if len(log) < 60 and (act == 'repost' or rng.random() < .15): log.append({'round': r, 'actor': nd['id'], 'action': act, 'target': self.nodes[j]['id'], 'before': round(prev[i], 2), 'after': round(new[i], 2)})
                if rej:
                    j, w, d = max(rej, key=lambda x: x[1])
                    if rng.random() < .45:
                        new[i] = clamp(new[i] - .04 * (1 if d > 0 else -1))
                        actions['reply'] += 1; engage[j] += 1.5
                        if len(log) < 60: log.append({'round': r, 'actor': nd['id'], 'action': 'reply', 'target': self.nodes[j]['id'], 'before': round(prev[i], 2), 'after': round(new[i], 2)})
                    if j in st.follows[i] and rng.random() < .25:
                        st.follows[i].discard(j); actions['unfollow'] += 1
                        cands = [c for c in rng.sample(range(n), min(14, n)) if c != i and c not in st.follows[i]]
                        if cands:
                            best = min(cands, key=lambda c: abs(prev[c] - new[i])); st.follows[i].add(best); actions['follow'] += 1
                            st.rewired.append({'round': r, 'actor': nd['id'], 'unfollow': self.nodes[j]['id'], 'follow': self.nodes[best]['id']})
                if not acc and not rej:
                    actions['post'] += 1; engage[i] += 1.
                elif rng.random() < .2:
                    actions['post'] += 1; engage[i] += .7
            st.engage = engage
        st.cur = new
        for i in range(n): st.history[i].append(round(new[i], 2))
        stats = self._stats(st, r, actions)
        st.rounds.append(stats)
        st.interactions.extend(log)
        return stats

    def _stats(self, st, r, actions):
        cs = st.cur[self.k:] or st.cur
        mean = sum(cs) / len(cs); var = sum((x - mean) ** 2 for x in cs) / len(cs)
        by_cluster = defaultdict(list)
        for i in range(self.k, len(self.nodes)): by_cluster[self.nodes[i]['cluster']].append(st.cur[i])
        sim, cnt = 0., 0
        for i, fs in enumerate(st.follows):
            for j in fs: sim += 1 - abs(st.cur[i] - st.cur[j]) / 2; cnt += 1
        homophily = sim / cnt if cnt else 0
        rnd = random.Random(self.seed + 'echo'); base = 0.
        for _ in range(400):
            a, b = rnd.randrange(len(st.cur)), rnd.randrange(len(st.cur)); base += 1 - abs(st.cur[a] - st.cur[b]) / 2
        return {'round': r, 'mean': round(mean, 3), 'polarization': round(math.sqrt(var), 3),
                'support': sum(1 for x in cs if x > .2), 'neutral': sum(1 for x in cs if -.2 <= x <= .2), 'oppose': sum(1 for x in cs if x < -.2),
                'by_cluster': {c: round(sum(v) / len(v), 3) for c, v in by_cluster.items()},
                'actions': dict(actions), 'echo_chamber': round(homophily - base / 400, 3)}

    def _pagerank(self, st):
        n = len(self.nodes); rank = [1 / n] * n; out = [len(f) or 1 for f in st.follows]
        for _ in range(25):
            nxt = [.15 / n] * n
            for i, fs in enumerate(st.follows):
                share = .85 * rank[i] / out[i]
                for j in fs: nxt[j] += share
            rank = nxt
        return rank

    def _communities(self, st):
        n = len(self.nodes); adj = [set() for _ in range(n)]
        for i, fs in enumerate(st.follows):
            for j in fs: adj[i].add(j); adj[j].add(i)
        label = list(range(n)); rng = random.Random(self.seed + 'lp')
        order = list(range(n))
        for _ in range(12):
            rng.shuffle(order); changed = False
            for i in order:
                if not adj[i]: continue
                c = Counter(label[j] for j in adj[i]); top = max(c.values())
                best = min(l for l, v in c.items() if v == top)
                if best != label[i]: label[i] = best; changed = True
            if not changed: break
        groups = defaultdict(list)
        for i, l in enumerate(label): groups[l].append(i)
        return label, sorted(groups.values(), key=len, reverse=True)

    def export_scenario(self, st):
        rank = self._pagerank(st); label, groups = self._communities(st)
        top = sorted(range(len(self.nodes)), key=lambda i: rank[i], reverse=True)[:8]
        followers = Counter(j for fs in st.follows for j in fs)
        influencers = [{'id': self.nodes[i]['id'], 'name': self.nodes[i]['name'], 'core': self.nodes[i]['core'], 'rank': round(rank[i] * len(self.nodes), 2),
                        'followers': followers[i], 'stance': st.cur[i]} for i in top]
        comm = []
        gid = {}
        for g_index, g in enumerate(groups[:8]):
            for i in g: gid[i] = g_index
            clusters = Counter(self.nodes[i]['cluster'] for i in g)
            comm.append({'id': g_index, 'size': len(g), 'mean_stance': round(sum(st.cur[i] for i in g) / len(g), 3),
                         'dominant_cluster': clusters.most_common(1)[0][0], 'core_members': [self.nodes[i]['name'] for i in g if self.nodes[i]['core']][:4]})
        bridges = Counter()
        for i, fs in enumerate(st.follows):
            for j in fs:
                if label[i] != label[j]: bridges[j] += 1
        bridge_list = [{'id': self.nodes[i]['id'], 'name': self.nodes[i]['name'], 'cross_community_followers': c} for i, c in bridges.most_common(5)]
        first, last = st.rounds[0], st.rounds[-1]
        return {'rounds': st.rounds, 'stance': st.history, 'interactions': st.interactions[:240], 'rewired': st.rewired[:120],
                'influencers': influencers, 'communities': comm, 'bridges': bridge_list,
                'community_of': [gid.get(i, -1) for i in range(len(self.nodes))], 'followers': [followers[i] for i in range(len(self.nodes))],
                'summary': {'mean_shift': round(last['mean'] - first['mean'], 3), 'polarization_shift': round(last['polarization'] - first['polarization'], 3),
                            'support_final': last['support'], 'oppose_final': last['oppose'], 'echo_chamber': last['echo_chamber'],
                            'edges_final': sum(len(f) for f in st.follows)}}

    def export(self, graph, states):
        scenarios = {name: self.export_scenario(st) for name, st in states.items()}
        comparison = None
        if 'A' in scenarios and 'B' in scenarios:
            a, b = scenarios['A']['rounds'][-1], scenarios['B']['rounds'][-1]
            comparison = {'mean_delta': round(b['mean'] - a['mean'], 3), 'support_delta': b['support'] - a['support'], 'oppose_delta': b['oppose'] - a['oppose'],
                          'polarization_delta': round(b['polarization'] - a['polarization'], 3)}
        return {'graph': graph, 'seed': self.seed,
                'crowd': {'size': self.size, 'core': self.k, 'edges': self.edges,
                          'nodes': [{k: v for k, v in n.items()} for n in self.nodes]},
                'scenarios': scenarios, 'comparison': comparison,
                'limitations': [f'{self.size} crowd agents follow transparent opinion-dynamics rules (feed recommendation, bounded confidence, backfire, follow/unfollow); they do not call the AI provider.',
                                'Crowd stances start from what the AI core personas actually said, plus noise; they are not survey data and not a population sample.',
                                'Influence, communities and echo-chamber values describe this synthetic network only.']}
