"""Stakeholder graph + crowd network: determinism, bounds, and dynamics invariants (no AI provider needed)."""
import json
from app.services import network, social

DRAFT = {'title': 'Upah dan jam kerja buruh', 'articles': [
    {'number': '1', 'text': 'Upah lembur dan biaya sanksi bagi pengusaha. Petugas pengawas berwenang.'},
    {'number': '2', 'text': 'Prosedur mediasi perselisihan dan definisi pekerja.'}]}

def run(size=120, rounds=4, scenario='A', stance=None):
    personas = social.get_personas_for_draft(DRAFT, 16)
    crowd = network.Crowd(personas, size, 'seed')
    st = crowd.new_scenario(scenario)
    for r in range(1, rounds + 1):
        crowd.step(st, r, {p['id']: (stance if stance is not None else network.STANCE_SCORE[['support', 'concern', 'conditional', 'uncertain'][i % 4]]) for i, p in enumerate(personas)})
    return personas, crowd, st

def test_graph_has_typed_entities_and_resolvable_relations():
    personas = social.get_personas_for_draft(DRAFT, 8)
    g = network.build_graph(DRAFT, 'alt', [], personas)
    ids = {e['id'] for e in g['entities']}
    assert {e['type'] for e in g['entities']} >= {'policy', 'article', 'stakeholder', 'issue'}
    assert all(r['source'] in ids and r['target'] in ids for r in g['relations'])
    assert any(r['type'] == 'impacts' for r in g['relations'])

def test_crowd_is_deterministic_and_bounded():
    _, c1, s1 = run(); _, c2, s2 = run()
    assert s1.history == s2.history and c1.edges == c2.edges
    assert len(c1.nodes) == 16 + 120
    assert all(-1 <= v <= 1 for h in s1.history for v in h)
    assert all(len(h) == 4 for h in s1.history)

def test_crowd_follows_core_signal():
    _, crowd, st = run(stance=.75)
    assert st.rounds[-1]['mean'] > .5 and st.rounds[-1]['oppose'] == 0
    _, crowd, st = run(stance=-.65)
    assert st.rounds[-1]['mean'] < -.4 and st.rounds[-1]['support'] == 0

def test_export_is_json_serializable_with_communities_and_influencers():
    personas, crowd, st = run()
    g = network.build_graph(DRAFT, 'alt', [], personas)
    out = crowd.export(g, {'A': st})
    json.dumps(out)
    sc = out['scenarios']['A']
    assert len(sc['communities']) > 1 and sc['influencers'] and len(sc['community_of']) == len(crowd.nodes)
    assert all(a < len(crowd.nodes) and b < len(crowd.nodes) for a, b in out['crowd']['edges'])

def test_merge_extraction_drops_unresolvable_relations():
    personas = social.get_personas_for_draft(DRAFT, 8)
    g = network.build_graph(DRAFT, 'alt', [], personas)
    ex = network.GraphExtraction(entities=[network.GEntity(name='Labour Ministry', type='institution', description='National labour regulator')],
                                 relations=[network.GRelation(source='Labour Ministry', target=personas[0]['role'], type='regulates', description='Sets wage floors'),
                                            network.GRelation(source='Ghost', target='Labour Ministry', type='funds', description='Unknown source')])
    g = network.merge_extraction(g, ex, personas)
    assert g['extraction'] == 'rules+llm' and any(e['label'] == 'Labour Ministry' for e in g['entities'])
    assert sum(1 for r in g['relations'] if r['type'] == 'regulates') == 1 and not any(r['type'] == 'funds' for r in g['relations'])
