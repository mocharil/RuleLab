"""Source-backed legal context and deterministic checks; no automatic legal verdict."""
from copy import deepcopy
from datetime import date
from functools import lru_cache
import json
import re
from app.config import ROOT
from app.services.ingestion import HIERARCHY

@lru_cache(maxsize=1)
def rulebook():
    return json.loads((ROOT/'data/legal/rulebook.json').read_text())

def system_guide():
    pack = rulebook()
    return '\nPEDOMAN LEGAL '+pack['version']+'\n'+pack['coverage_note']+'\n'+'\n'.join(
        '['+r['id']+'; '+r['classification']+'] '+r['instruction']+
        (' Source: '+r['source']['locator']+' '+r['source']['url'] if r['source'] else '')
        for r in pack['rules'])

def change_candidates():
    path=ROOT/'data/legal/change_candidates.json'
    return json.loads(path.read_text()) if path.exists() else []

def context(draft_type, evidence, as_of=None):
    when=as_of or date.today().isoformat()
    relevant={e['regulation_id'] for e in evidence}
    return {
        'rulebook_version':rulebook()['version'], 'as_of_date':when,
        'current_law_verified':False,
        'draft_hierarchy_rank':HIERARCHY.get(draft_type),
        'authority_check_required':draft_type not in HIERARCHY,
        'source_versions':[{'evidence_id':e['id'],'regulation_id':e['regulation_id'],
          'version_kind':e['version_kind'],'promulgated_on':e.get('promulgated_on'),
          'temporal_status':'not_yet_promulgated' if e.get('promulgated_on') and e['promulgated_on']>when else 'effective_status_unverified',
          'may_support_as_of':not(e.get('promulgated_on') and e['promulgated_on']>when)} for e in evidence],
        'pending_changes':[c for c in change_candidates() if c['target_regulation_id'] in relevant or c['source_regulation_id'] in relevant],
        'checklist':['date and version','subject/object/region','authority and delegation',
                     'definitions and references','exceptions and transitional provisions','two overlapping norms',
                     'alternative interpretation','Constitutional/Supreme Court rulings and source limits'],
        'notice':'Amendment candidates are not a consolidation. Provisions may be changed by documents/rulings that are not available yet.'}

def normalize(text):
    return re.sub(r'\s+',' ',text).strip()

def validate_finding(finding, evidence, draft_type, as_of, live=False):
    """Reject fabricated citations; downgrade unsupported conflict classifications."""
    sources={e['id']:e for e in evidence}
    allowed={r['id'] for r in rulebook()['rules']}
    if any(r not in allowed for r in finding.get('legal_rule_ids',[])):
        raise ValueError('The AI referenced a legal_rule_id that does not exist.')
    for quote in finding.get('evidence_quotes',[]):
        source=sources.get(quote['evidence_id'])
        if not source or quote['evidence_id'] not in finding['evidence_ids']:
            raise ValueError('The quote does not refer to the finding’s evidence.')
        if not normalize(quote['quote']) or normalize(quote['quote']) not in normalize(source['text']):
            raise ValueError('The AI quote does not match the source text. Result rejected.')
    warnings=[]
    cited=[sources[i] for i in finding['evidence_ids'] if i in sources]
    usable=[e for e in cited if not e.get('promulgated_on') or e['promulgated_on']<=as_of]
    if len(usable)!=len(cited):warnings.append('Sources dated after the analysis date cannot prove a conflict on that date.')
    if finding['category']=='potential_vertical_conflict':
        rank=HIERARCHY.get(draft_type)
        if rank is None or not any(e.get('hierarchy_rank') and e['hierarchy_rank']<rank for e in usable):
            finding['category']='coverage_gap'
            warnings.append('A vertical conflict is not supported by a higher-ranking source; review authority/delegation.')
    if finding['category']=='potential_horizontal_conflict':
        rank=HIERARCHY.get(draft_type)
        if rank is None or not any(e.get('hierarchy_rank')==rank for e in usable):
            finding['category']='coverage_gap';warnings.append('Equal rank not proven.')
    if live and finding['category'].startswith('potential_'):
        quoted={q['evidence_id'] for q in finding.get('evidence_quotes',[])}
        checks=finding.get('legal_checks',{})
        checks_complete=all(checks.get(k) and checks[k]!='not verified' for k in ('temporal','scope','authority','exceptions','alternative_interpretation'))
        qualified=usable
        if finding['category']=='potential_vertical_conflict':
            qualified=[e for e in usable if e.get('hierarchy_rank') and e['hierarchy_rank']<HIERARCHY.get(draft_type,0)]
        elif finding['category']=='potential_horizontal_conflict':
            qualified=[e for e in usable if e.get('hierarchy_rank')==HIERARCHY.get(draft_type)]
        if not finding.get('legal_rule_ids') or not any(e['id'] in quoted for e in qualified) or not finding.get('norm_collision') or not checks_complete:
            finding['category']='coverage_gap'
            warnings.append('Conflict test incomplete: needs a guideline, a source quote at the right level/time, two overlapping norms, and five context checks.')
    finding['validation']={'verdict':'potential_only' if finding['category'].startswith('potential_') else 'requires_review',
      'source_quotes_checked':len(finding.get('evidence_quotes',[])), 'current_law_verified':False,
      'checks':finding.get('legal_checks',{}), 'warnings':warnings}
    finding['review_questions']=list(dict.fromkeys(finding['review_questions']+warnings+[
        'Have the source version and effective status as of '+as_of+' verified, including amendments and court rulings?']))
    return finding

def apply_reviewed_change(snapshot, event, as_of):
    """Explicit reviewed event only. A reconstructed text is not certified current law.

    Snapshot: {regulation_id, regulation_type, units: {pasal/ayat: {text,status}}}.
    Callers must supply independently reviewed effective date and exact source quote.
    Unsupported phrase/omnibus/court operations stay pending, never guessed.
    """
    if event.get('review_status')!='reviewed' or not event.get('source_quote') or not event.get('source_url'):
        raise ValueError('The operation needs explicit review and a source.')
    if event.get('target_regulation_id')!=snapshot['regulation_id']:
        raise ValueError('Different target regulation.')
    if not event.get('effective_from'):
        raise ValueError('The operation’s effective date is not verified.')
    source_rank=HIERARCHY.get(event.get('source_regulation_type'))
    target_rank=HIERARCHY.get(snapshot['regulation_type'])
    if source_rank is None or target_rank is None or source_rank>target_rank:
        raise ValueError('Authority to amend/repeal not proven.')
    if date.fromisoformat(event['effective_from'])>date.fromisoformat(as_of):return deepcopy(snapshot)
    result=deepcopy(snapshot);op=event['operation'];unit=event.get('unit_id');units=result['units']
    if any(h['id']==event['id'] for h in result.get('history',[])):raise ValueError('Operation already applied.')
    if result.get('history') and event['effective_from']<result['history'][-1]['effective_from']:
        raise ValueError('Operations must be applied in order of effective date.')
    if op in ('replace_unit','delete_unit') and unit not in units:raise ValueError('Target unit not found.')
    if op=='insert_unit' and unit in units:raise ValueError('The inserted unit already exists; its number cannot be reused.')
    if op=='repeal_regulation':
        target=HIERARCHY.get(snapshot['regulation_type']);source=HIERARCHY.get(event.get('source_regulation_type'))
        if source is None or target is None or source>target:raise ValueError('Authority to repeal not proven.')
        result['status']='repealed'
        for value in units.values():value['status']='repealed'
    elif op=='delete_unit':
        for key in list(units):
            if key==unit or key.startswith(unit+'/'):units[key]={'text':'Dihapus.','status':'deleted','event_id':event['id']}
    elif op in ('replace_unit','insert_unit'):
        if not event.get('replacement_text'):raise ValueError('Amendment text not available yet.')
        if any(k.startswith(unit+'/') for k in units):raise ValueError('The unit has sub-units; restructure all sub-units through a dedicated review.')
        units[unit]={'text':event['replacement_text'],'status':'reconstructed','event_id':event['id']}
    else:raise ValueError('Operation not supported yet; needs a dedicated review.')
    result['current_law_verified']=False
    result.setdefault('history',[]).append(deepcopy(event))
    return result
