// Activity — one decision trail per draft: versions, agent runs, their results and review decisions.
// Timeline on the left, the selected item on the right (see docs/ACTIVITY_REVAMP_STRATEGY.md).
import {icon} from '/static/design.js';
import {articlesText,diffHTML,wordDiff,assumptionInputs,defaultAssumptions,sameText} from '/static/studio.js';

export const ACTIVE=['queued','running','cancelling'];
const KINDS={analysis:'Source check',simulation:'Impact simulation',social:'Public forum'};
const KIND_PLURAL={all:'All types',analysis:'Source checks',simulation:'Impact simulations',social:'Public forums'};
const KIND_ICON={analysis:'shield',simulation:'chart',social:'network'};
export const STATUS_FILTERS=[['needs','Needs review'],['reviewed','Reviewed'],['outdated','Outdated'],['all','All']];
const JOB_STATES={queued:'Queued',running:'Running',cancelling:'Cancelling',cancelled:'Cancelled',completed:'Done',failed:'Failed',interrupted:'Interrupted'};
const SCOPES={full:['Legal review + impact simulation','Source check of the draft, then an A/B impact comparison.'],legal:['Legal review','Source check of the draft against the collection.'],impact:['Impact simulation','A/B comparison with your assumptions and stakeholder perspectives.'],social:['Public forum','Synthetic personas react to A and B; a crowd spreads their views.']};
const AGENTS={coordinator:'Coordinator',research:'Legal researcher',legal_reviewer:'Legal reviewer',impact_analyst:'Impact analyst',quality_reviewer:'Validator'};
const TOOLS={social_reaction:'Persona response',gather_opinions:'Collect opinions',build_graph:'Build knowledge graph',spawn_crowd:'Spawn crowd agents',crowd_diffusion:'Crowd diffusion',snapshot_draft:'Draft snapshot',plan_workflow:'Plan workflow',search_sources:'Search sources',review_legal:'Legal review',simulate_impact:'Simulate impact',validate_results:'Validate results',failure:'Record failure',stop:'Stop run',cancel_requested:'Cancel requested',recovery:'Server recovery'};
const OUTPUT_KEYS={analysis_run_id:'analysis',simulation_run_id:'simulation',social_run_id:'social'};

const when=value=>new Date(value).toLocaleString('en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
const time=value=>new Date(value).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
const plural=(n,word)=>`${n} ${word}${n===1?'':'s'}`;
const signed=(n,format=String)=>(n>0?'+':n<0?'−':'±')+format(Math.abs(n));

// ---- Model -------------------------------------------------------------------------------------

const MATCH={needs:(r)=>r.review_status==='needs_review',reviewed:(r)=>r.review_status!=='needs_review',outdated:(r,current)=>r.revision!==current,all:()=>true};

/** Timeline grouped by draft version (newest first). Agent runs hold the results they produced. */
export function activityModel(S){
 const a=S.activity,current=S.draft.revision,jobOf=new Map();
 for(const job of S.jobs)for(const id of Object.values(job.result||{}))jobOf.set(id,job);
 const counts=Object.fromEntries(STATUS_FILTERS.map(([key])=>[key,S.runs.filter(r=>MATCH[key](r,current)).length]));
 const status=a.status||(counts.needs?'needs':'all'),unfiltered=status==='all'&&a.kind==='all';
 const visible=r=>MATCH[status](r,current)&&(a.kind==='all'||r.kind===a.kind);
 const groups=new Map(),group=n=>{if(!groups.has(n))groups.set(n,{revision:n,version:(a.versions||[]).find(v=>v.revision===n),entries:[]});return groups.get(n);};
 if(unfiltered){group(current);(a.versions||[]).forEach(v=>group(v.revision));}
 for(const job of S.jobs){
  const runs=S.runs.filter(r=>jobOf.get(r.id)===job&&visible(r));
  if(runs.length||ACTIVE.includes(job.status)||unfiltered)group(job.revision).entries.push({type:'job',job,runs,at:job.created_at});
 }
 for(const run of S.runs)if(!jobOf.has(run.id)&&visible(run))group(run.revision).entries.push({type:'run',run,at:run.created_at});
 const ordered=[...groups.values()].sort((x,y)=>y.revision-x.revision);
 ordered.forEach(g=>g.entries.sort((x,y)=>(ACTIVE.includes(y.job?.status)-ACTIVE.includes(x.job?.status))||y.at.localeCompare(x.at)));
 const keys=[];
 for(const g of ordered){if(unfiltered)keys.push('version:'+g.revision);for(const e of g.entries){if(e.type==='job'){keys.push('job:'+e.job.id);e.runs.forEach(r=>keys.push('run:'+r.id));}else keys.push('run:'+e.run.id);}}
 const exists=key=>{const [type,id]=String(key||'').split(':');return type==='run'?S.runs.some(r=>r.id===id):type==='job'?S.jobs.some(j=>j.id===id):type==='version'?Number(id)>=1&&Number(id)<=current:false;};
 let selected=a.item==='job:latest'?(S.jobs[0]?'job:'+S.jobs[0].id:null):a.item;
 if(!exists(selected))selected=keys.find(k=>k.startsWith('run:'))||keys.find(k=>!k.startsWith('version:'))||keys[0]||null;
 return {status,counts,groups:ordered,keys,selected,jobOf,current,empty:!S.runs.length&&!S.jobs.length};
}

function runSummary(r,fmt,rup){
 const p=r.payload;
 if(r.kind==='analysis'){const n=p.findings.length,high=p.findings.filter(f=>f.severity==='high').length;return n?plural(n,'finding')+(high?` · ${high} high`:''):'No findings';}
 if(r.kind==='simulation'){const cost=p.delta?.cost||0;return `Access ${p.A.access_pct}% → ${p.B.access_pct}%`+(cost?` · cost ${signed(cost,rup)}`:'');}
 if(r.kind==='social'){const g=p.scenarios?.B?.summary?.stance_groups||{},c=k=>(g[k]||[]).length;return `B: ${c('support')} support · ${c('conditional')} conditional · ${c('concern')} concern`;}
 return '';
}

function versionChanges(version,previous){
 if(!version)return '';
 if(!previous)return 'First version';
 const before=new Map(previous.payload.articles.map(a=>[a.number,a.text])),after=new Map(version.payload.articles.map(a=>[a.number,a.text]));
 const added=[...after.keys()].filter(k=>!before.has(k)).length,removed=[...before.keys()].filter(k=>!after.has(k)).length,changed=[...after.keys()].filter(k=>before.has(k)&&!sameText(before.get(k),after.get(k))).length;
 const parts=[changed&&plural(changed,'article')+' changed',added&&added+' added',removed&&removed+' removed'].filter(Boolean);
 return parts.length?parts.join(' · '):sameText(articlesText(previous.payload.articles),articlesText(version.payload.articles))?'Metadata only':'Text changed';
}

// ---- Page --------------------------------------------------------------------------------------

/** Counts shown next to the draft; repainted while agent runs progress. */
export const countsText=S=>`${plural(S.runs.length,'result')} · ${plural(S.jobs.length,'agent run')}`;
export const chipsHTML=m=>STATUS_FILTERS.map(([key,title])=>`<button type="button" class="act-chip" data-action="activity-status" data-status="${key}" aria-pressed="${m.status===key}">${title}<span>${m.counts[key]}</span></button>`).join('');

export function activityPage(S,ctx){
 const {E}=ctx,m=activityModel(S),d=S.draft;
 return `<div class="act ${S.activity.detail?'show-detail':''} ${m.empty?'is-empty':''}">
 <header class="act-head">
  <div class="act-title"><h1>Activity</h1><p class="act-sub"><select id="draft-select" class="act-draft-select" aria-label="Select draft">${S.drafts.map(x=>`<option value="${E(x.id)}" ${x.id===d.id?'selected':''}>${E(x.title)}</option>`).join('')}</select><span>Version ${d.revision} · <span id="act-counts">${countsText(S)}</span></span></p></div>
  <div class="act-head-actions"><button type="button" class="btn" data-action="report" ${S.runs.some(r=>r.kind==='analysis')?'':'disabled title="Run a source check first"'}>${icon('download')}Review report</button><button type="button" class="btn primary" data-action="activity-sheet">${icon('network')}Run agent team</button></div>
 </header>
 <div class="act-bar"><div class="act-chips" role="group" aria-label="Filter by review status">${chipsHTML(m)}</div><label class="act-kind" for="activity-kind"><span>Type</span><select id="activity-kind">${Object.entries(KIND_PLURAL).map(([key,title])=>`<option value="${key}" ${S.activity.kind===key?'selected':''}>${title}</option>`).join('')}</select></label></div>
 <div class="act-grid">
  <nav class="act-timeline" id="activity-timeline" aria-label="Activity timeline">${timelineHTML(S,ctx,m)}</nav>
  <section class="act-detail" id="activity-detail" tabindex="-1" aria-label="Selected item">${detailHTML(S,ctx,m)}</section>
 </div>
 ${S.activity.sheet?sheetHTML(S,ctx):''}
</div>`;
}

export function timelineHTML(S,ctx,m=activityModel(S)){
 const {E,fmt,rup}=ctx,selected=m.selected;
 if(m.empty)return `<div class="act-empty"><b>The decision trail starts with a single check.</b><p>Results from Policy Studio and the agent team appear here with their draft version and review decisions.</p><div><button type="button" class="btn" data-action="back-editor">${icon('back')}Open Policy Studio</button><button type="button" class="btn" data-action="activity-sheet">${icon('network')}Run agent team</button></div></div>`;
 if(!m.keys.length){const label=STATUS_FILTERS.find(([key])=>key===m.status)[1].toLowerCase();return `<div class="act-empty"><b>No ${S.activity.kind==='all'?'results':KIND_PLURAL[S.activity.kind].toLowerCase()} ${m.status==='all'?'yet':'are '+label}.</b><p>${m.status==='needs'?'Every result on this draft has a review decision.':'Choose another filter to see the rest of the trail.'}</p><div><button type="button" class="btn" data-action="activity-status" data-status="all" data-kind="all">Show everything</button></div></div>`;}
 const current=key=>key===selected?'aria-current="true"':'';
 const runItem=r=>`<button type="button" class="act-item" data-action="activity-open" data-item="run:${E(r.id)}" ${current('run:'+r.id)}><span class="act-icon kind-${E(r.kind)}">${icon(KIND_ICON[r.kind]||'file',15)}</span><span class="act-copy"><b>${KINDS[r.kind]||E(r.kind)}</b><span class="act-summary">${E(runSummary(r,fmt,rup))}</span><small>${when(r.created_at)} · ${E(r.payload.provider?.mode||'')}</small></span><span class="act-flags"><span class="act-flag ${r.review_status==='needs_review'?'needs':'done'}">${r.review_status==='needs_review'?'Needs review':'Reviewed'}</span>${r.revision!==m.current?'<span class="act-flag old">Outdated</span>':''}</span></button>`;
 const jobItem=e=>{const job=e.job,active=ACTIVE.includes(job.status);return `<div class="act-job ${active?'is-active':''}"><button type="button" class="act-item act-item-job" data-action="activity-open" data-item="job:${E(job.id)}" ${current('job:'+job.id)}><span class="act-icon kind-job">${icon(active?'refresh':'network',15)}</span><span class="act-copy"><b>Agent run · ${E((SCOPES[job.intent]||[job.intent])[0])}</b><small>${when(job.created_at)} · ${E(job.owner)}</small></span><span class="act-flags"><span class="status-badge ${E(job.status)}">${E(JOB_STATES[job.status]||job.status)}</span></span></button>${e.runs.length?`<div class="act-children">${e.runs.map(runItem).join('')}</div>`:''}</div>`;};
 return m.groups.map((g,i)=>{
  const previous=m.groups[i+1]?.version||(S.activity.versions||[]).find(v=>v.revision===g.revision-1);
  const head=m.status==='all'&&S.activity.kind==='all'?`<button type="button" class="act-version-head" data-action="activity-open" data-item="version:${g.revision}" ${current('version:'+g.revision)}><b>Version ${g.revision}${g.revision===m.current?' <span class="act-flag done">Current</span>':''}</b><small>${g.version?when(g.version.created_at)+' · '+E(versionChanges(g.version,previous)):''}</small></button>`:`<div class="act-version-head is-static"><b>Version ${g.revision}${g.revision===m.current?' <span class="act-flag done">Current</span>':''}</b></div>`;
  return `<section class="act-version" aria-label="Version ${g.revision}">${head}${g.entries.length?g.entries.map(e=>e.type==='job'?jobItem(e):runItem(e.run)).join(''):'<p class="act-none">No results on this version.</p>'}</section>`;
 }).join('');
}

export function detailHTML(S,ctx,m=activityModel(S)){
 const [type,id]=String(m.selected||'').split(':');
 const back=`<button type="button" class="btn act-back" data-action="activity-back">${icon('back')}Timeline</button>`;
 if(type==='run'){const r=S.runs.find(x=>x.id===id);return back+runDetail(S,ctx,m,r);}
 if(type==='job'){const job=S.jobs.find(x=>x.id===id);return back+jobDetail(S,ctx,m,job);}
 if(type==='version')return back+versionDetail(S,ctx,m,Number(id));
 return m.empty?'<div class="act-detail-empty"><p>Select an item in the timeline to see its result, trace or changes.</p></div>':'';
}

// ---- Result detail -----------------------------------------------------------------------------

function runDetail(S,ctx,m,r){
 const {E,fmt,rup}=ctx,p=r.payload,job=m.jobOf.get(r.id),outdated=r.revision!==m.current;
 // Policy Studio shows the latest result of each kind, so only that one can be opened there.
 const latest=!outdated&&S.runs.find(x=>x.kind===r.kind)===r;
 const studio={analysis:['Open in Verify sources','analysis'],simulation:['Open in Test impact','simulation'],social:['Open the forum','social']}[r.kind];
 return `<header class="act-detail-head"><div><span class="act-eyebrow">${icon(KIND_ICON[r.kind]||'file',14)}${KINDS[r.kind]||E(r.kind)} · Version ${r.revision}</span><h2>${E(runSummary(r,fmt,rup))}</h2><p class="act-meta">${when(r.created_at)} · ${p.provider?.mode==='live'?'Gemini · '+E(p.provider.model||''):'Demo rules'} · ${job?`<button type="button" class="act-link" data-action="activity-open" data-item="job:${E(job.id)}">from agent run ${E(job.id.slice(0,8))}</button>`:'from Policy Studio'}</p></div>${latest?`<button type="button" class="btn" data-action="activity-studio" data-stage="${studio[1]}">${icon('arrow')}${studio[0]}</button>`:''}</header>
 ${outdated?`<div class="act-note warn">${icon('attention',15)}<span>This result is for version ${r.revision}; the draft is now version ${m.current}. Run it again in Policy Studio before relying on it.</span></div>`:''}
 ${reviewHTML(S,ctx,r)}
 <div class="act-body">${r.kind==='analysis'?analysisBody(ctx,r):r.kind==='simulation'?simulationBody(ctx,r):r.kind==='social'?socialBody(ctx,r,m):''}</div>`;
}

function reviewHTML(S,ctx,r){
 const {E}=ctx,role=S.status.principal?.role,locked=role==='viewer';
 const history=r.reviews||[];
 const legacy=!history.length&&r.review_notes?`<li><div><b>${r.review_status==='needs_review'?'Needs review':'Reviewed with notes'}</b><small>Earlier decision · reviewer not recorded</small></div><p>${E(r.review_notes)}</p></li>`:'';
 return `<section class="act-review" aria-labelledby="act-review-title"><div class="act-review-head"><h3 id="act-review-title">Review decision</h3><span class="act-flag ${r.review_status==='needs_review'?'needs':'done'}">${r.review_status==='needs_review'?'Needs review':'Reviewed with notes'}</span></div>
 <div class="act-seg" role="radiogroup" aria-label="Review status">${[['needs_review','Still needs review'],['reviewed_with_notes','Reviewed with notes']].map(([value,title])=>`<label><input type="radio" name="review-status" value="${value}" ${r.review_status===value?'checked':''} ${locked?'disabled':''}><span>${title}</span></label>`).join('')}</div>
 <label class="act-sr" for="review-notes">Notes</label><textarea id="review-notes" rows="3" placeholder="What did you verify, and what still needs follow-up?" ${locked?'disabled':''}>${E(r.review_notes||'')}</textarea>
 <div class="act-review-foot"><p>Recorded with your name and time. It does not decide legal validity.</p><button type="button" class="btn primary" data-action="save-review" data-run="${E(r.id)}" ${locked?'disabled title="Viewers cannot record review decisions"':''}>${icon('save')}Save decision</button></div>
 ${history.length||legacy?`<details class="act-review-history" ${history.length>1?'':'open'}><summary>Decision history (${history.length||1})</summary><ol>${history.map(v=>`<li><div><b>${v.status==='needs_review'?'Needs review':'Reviewed with notes'}</b><small>${E(v.reviewer)} · ${E(v.role)} · ${when(v.created_at)}</small></div><p>${E(v.notes)}</p></li>`).join('')}${legacy}</ol></details>`:''}
 </section>`;
}

const SEVERITY={high:'High',medium:'Medium',low:'Low'};
function analysisBody(ctx,r){
 const {E,source,limitations}=ctx,p=r.payload,order={high:0,medium:1,low:2};
 const findings=[...p.findings].sort((x,y)=>(order[x.severity]??3)-(order[y.severity]??3));
 return `<p class="act-lead">${E(p.summary)}</p>${p.coverage?`<p class="act-meta">${plural(p.coverage.draft_articles,'draft article')} checked against ${plural(p.coverage.retrieved_articles,'source article')}.</p>`:''}
 <div class="act-findings">${findings.map(f=>`<article class="act-finding sev-${E(f.severity)}"><header><span class="act-sev">${SEVERITY[f.severity]||E(f.severity)}</span><b>Pasal ${E(f.article_number)} · ${E(f.title)}</b></header><p>${E(f.reasoning)}</p>${f.proposed_text?`<div class="act-proposal"><small>Drafting proposal</small><div class="quote">${E(f.proposed_text)}</div></div>`:''}${f.evidence?.length?`<details><summary>Legal references (${f.evidence.length})</summary>${f.evidence.map(source).join('')}</details>`:''}</article>`).join('')||'<p class="act-none">No findings were raised.</p>'}</div>
 <details class="act-limits"><summary>Limits of this check</summary>${limitations(p.limitations||[])}</details>`;
}

const ASSUMPTION_LABELS={population:['Applicants','people'],digital_access_pct:['Digital access','%'],assisted_success_pct:['Assisted success','%'],digital_cost:['Digital cost','Rp/case'],assisted_cost:['Assisted cost','Rp/case'],staff_capacity:['Staff capacity','applicants/day']};
function simulationBody(ctx,r){
 const {E,fmt,rup,limitations}=ctx,p=r.payload,d=p.delta||{};
 const card=k=>`<div class="act-ab"><small>Alternative ${k}${k==='A'?' · draft':''}</small><strong>${p[k].access_pct}%</strong><span>${fmt(p[k].served)} served · ${fmt(p[k].unserved)} unserved</span><span>${rup(p[k].cost)}${p[k].staff_days?` · ${fmt(p[k].staff_days)} staff days`:''}</span></div>`;
 return `<div class="act-ab-grid">${card('A')}${card('B')}<div class="act-ab delta"><small>B vs A</small><strong>${signed(Number(d.access_points||0),n=>fmt(n))} pp</strong><span>${signed(d.served||0,fmt)} served</span><span>cost ${signed(d.cost||0,rup)}</span></div></div>
 <p class="act-meta">Model output from the assumptions below, not public statistics.</p>
 <dl class="act-assumptions">${Object.entries(p.assumptions||{}).map(([key,value])=>`<div><dt>${E(ASSUMPTION_LABELS[key]?.[0]||key)}</dt><dd>${fmt(value)} ${E(ASSUMPTION_LABELS[key]?.[1]||'')}</dd></div>`).join('')}</dl>
 <h3 class="act-h3">Stakeholders</h3>${(p.stakeholders||[]).map(x=>`<details class="act-stakeholder"><summary>${E(x.stakeholder)}</summary>${x.benefits?.length?'<small>Benefits</small>'+limitations(x.benefits):''}${x.risks?.length?'<small>Risks</small>'+limitations(x.risks):''}${x.mitigations?.length?'<small>Mitigations</small>'+limitations(x.mitigations):''}</details>`).join('')}
 <details class="act-limits"><summary>Alternative B text</summary><div class="quote">${E(p.alternative_text||'')}</div></details>
 <details class="act-limits"><summary>Limits of this simulation</summary>${limitations(p.limitations||[])}</details>`;
}

const STANCES={concern:'Concern',conditional:'Conditional',support:'Support',uncertain:'Undecided'};
function socialBody(ctx,r,m){
 const {E,limitations}=ctx,p=r.payload,personas=new Map((p.personas||[]).map(x=>[x.id,x]));
 const scenario=k=>p.scenarios?.[k]?.comments||[],rounds=Math.max(0,...['A','B'].flatMap(k=>scenario(k).map(c=>Number(c.round)||0)));
 const tally=k=>{const g=p.scenarios?.[k]?.summary?.stance_groups||{};return Object.keys(STANCES).filter(s=>(g[s]||[]).length).map(s=>`<span class="act-stance ${s}">${(g[s]||[]).length} ${STANCES[s].toLowerCase()}</span>`).join('');};
 const panel=(k,active)=>`<div class="act-forum-panel" data-forum-scenario="${k}" ${active?'':'hidden'}><div class="act-rounds" role="group" aria-label="Round"><button type="button" data-forum-round="all" aria-pressed="true">All (${scenario(k).length})</button>${Array.from({length:rounds},(_,i)=>i+1).map(n=>`<button type="button" data-forum-round="${n}" aria-pressed="false">Round ${n}</button>`).join('')}</div><ol class="act-comments">${scenario(k).map(c=>{const who=personas.get(c.persona_id);return `<li data-round="${c.round}"><header><b>${E(c.name)}</b><small>${E(who?.role||'Synthetic persona')} · round ${c.round}</small><span class="act-stance ${E(c.stance)}">${E(STANCES[c.stance]||c.stance)}</span></header><p>${E(c.comment)}</p>${c.proposal?`<p class="act-meta"><b>Proposal:</b> ${E(c.proposal)}</p>`:''}</li>`;}).join('')}</ol></div>`;
 const net=p.network?.comparison;
 return `<p class="act-note">${icon('users',15)}<span>${plural((p.personas||[]).length,'synthetic persona')} · ${plural(rounds,'round')}${p.network?.crowd?.size?` · ${fmt0(p.network.crowd.size)} crowd agents`:''}. AI inferences, not a survey of real public opinion.</span></p>
 <div class="act-ab-grid two"><div class="act-ab"><small>Scenario A · draft</small><div class="act-stances">${tally('A')}</div></div><div class="act-ab"><small>Scenario B · alternative</small><div class="act-stances">${tally('B')}</div>${net?`<span>Crowd: ${signed(net.support_delta,String)} supporters vs A</span>`:''}</div></div>
 ${p.network?.graph?`<h3 class="act-h3">Stakeholder knowledge graph</h3><p class="act-meta">${p.network.graph.entities.length} entities · ${p.network.graph.relations.length} relations. Click a node for its relations.</p><div id="activity-kg" class="act-kg"></div>`:''}
 <h3 class="act-h3">Persona responses</h3><div class="act-scenarios" role="group" aria-label="Scenario">${['A','B'].map((k,i)=>`<button type="button" data-forum-tab="${k}" aria-pressed="${i===0}">Scenario ${k}</button>`).join('')}</div>${panel('A',true)}${panel('B',false)}
 <details class="act-limits"><summary>Limits of this simulation</summary>${limitations(p.limitations||[])}</details>`;
}
const fmt0=n=>new Intl.NumberFormat('en-GB').format(n);

// ---- Agent run detail --------------------------------------------------------------------------

/** Steps grouped by agent and tool; persona responses (one agent per persona) fold into one step.
 *  Each call logs a start and an end event, so the count is the number of calls that ended. */
function traceSteps(events){
 const steps=new Map(),ended=e=>!ACTIVE.includes(e.status);
 for(const event of events){
  const key=event.tool==='social_reaction'?'social_reaction':event.agent+':'+event.tool,step=steps.get(key);
  if(step){step.last=event;step.count+=ended(event);step.agents.add(event.agent);}else steps.set(key,{first:event,last:event,count:Number(ended(event)),agents:new Set([event.agent])});
 }
 return [...steps.values()];
}

function jobDetail(S,ctx,m,job){
 const {E,fmt,rup}=ctx,active=ACTIVE.includes(job.status),role=S.status.principal?.role;
 const canCancel=active&&!['viewer','reviewer'].includes(role)&&(role==='admin'||S.status.principal?.id===job.owner);
 const outputs=Object.entries(job.result||{}).filter(([key])=>OUTPUT_KEYS[key]).map(([,id])=>S.runs.find(r=>r.id===id)).filter(Boolean);
 const steps=traceSteps(job.events||[]),last=job.events?.at(-1);
 const duration=last?Math.max(0,Math.round((new Date(last.created_at)-new Date(job.created_at))/1000)):0;
 return `<header class="act-detail-head"><div><span class="act-eyebrow">${icon('network',14)}Agent run · Version ${job.revision}</span><h2>${E((SCOPES[job.intent]||[job.intent])[0])} <span class="status-badge ${E(job.status)}">${E(JOB_STATES[job.status]||job.status)}</span></h2><p class="act-meta">${when(job.created_at)}${duration?` · ${duration<60?duration+' s':Math.round(duration/60)+' min'}`:''} · ${E(job.owner)} · ${E(job.id.slice(0,12))}</p></div>${active?`<button type="button" class="btn" data-action="cancel-agent" data-job="${E(job.id)}" ${canCancel?'':'disabled title="Only the run owner or an admin can cancel"'}>${icon('close')}Cancel run</button>`:`<button type="button" class="btn" data-action="refresh-agents">${icon('refresh')}Refresh</button>`}</header>
 ${job.revision!==m.current?`<div class="act-note">${icon('clock',15)}<span>Ran on version ${job.revision}. The draft has changed since; the run keeps its snapshot.</span></div>`:''}
 ${job.error?`<div class="act-note error">${icon('attention',15)}<span>${E(job.error)}</span></div>`:''}
 ${job.plan?.rationale?`<div class="act-plan"><small>Coordinator plan · ${job.plan.provider?.mode==='demo'?'deterministic, demo mode':'from '+E(job.plan.provider?.model||'the model')}</small><p>${E(job.plan.rationale)}</p></div>`:''}
 <h3 class="act-h3">Results</h3>${outputs.length?`<div class="act-outputs">${outputs.map(r=>`<button type="button" class="act-item" data-action="activity-open" data-item="run:${E(r.id)}"><span class="act-icon kind-${E(r.kind)}">${icon(KIND_ICON[r.kind]||'file',15)}</span><span class="act-copy"><b>${KINDS[r.kind]}</b><span class="act-summary">${E(runSummary(r,fmt,rup))}</span></span><span class="act-flags"><span class="act-flag ${r.review_status==='needs_review'?'needs':'done'}">${r.review_status==='needs_review'?'Needs review':'Reviewed'}</span></span></button>`).join('')}</div>`:`<p class="act-none">${active?'Results appear when the run finishes.':'This run produced no results.'}</p>`}
 <h3 class="act-h3">Trace · ${plural(steps.length,'step')}</h3>
 <ol class="act-trace">${steps.map(s=>{const e=s.last,d=e.detail||{};return `<li class="${E(e.status)}"><div><b>${E(TOOLS[e.tool]||e.tool)}${s.count>1?` <span class="act-count">× ${s.count}</span>`:''}</b><small>${s.agents.size>1?plural(s.agents.size,'persona'):E(AGENTS[e.agent]||e.agent)} · ${time(e.created_at)}</small>${[d.count!==undefined&&plural(d.count,'source article'),d.findings!==undefined&&plural(d.findings,'finding'),d.stakeholder_count&&plural(d.stakeholder_count,'perspective')].filter(Boolean).map(x=>`<span class="act-chip-mini">${x}</span>`).join('')}${d.source_ids?.length?`<details><summary>Retrieved source IDs</summary><ul>${d.source_ids.map(id=>`<li>${E(id)}</li>`).join('')}</ul></details>`:''}</div><span class="act-step-state">${E(JOB_STATES[e.status]||e.status)}</span></li>`;}).join('')}</ol>
 <details class="act-limits act-events" data-job="${E(job.id)}"><summary>All events (${(job.events||[]).length})</summary><pre></pre></details>
 <p class="act-meta">Results are bound to the version snapshot. Agents never change the draft or enact law.</p>`;
}

// ---- Version detail ----------------------------------------------------------------------------

function versionDetail(S,ctx,m,revision){
 const {E}=ctx,versions=S.activity.versions;
 if(!versions)return '<div class="act-detail-empty"><p>Loading versions…</p></div>';
 const version=versions.find(v=>v.revision===revision),previous=versions.find(v=>v.revision===revision-1);
 if(!version)return '<div class="act-detail-empty"><p>This version is not available.</p></div>';
 const before=previous?articlesText(previous.payload.articles):'',after=articlesText(version.payload.articles),diff=previous?wordDiff(before,after):null;
 const results=S.runs.filter(r=>r.revision===revision),jobs=S.jobs.filter(j=>j.revision===revision);
 return `<header class="act-detail-head"><div><span class="act-eyebrow">${icon('clock',14)}Version ${revision}${revision===m.current?' · current':''}</span><h2>${E(version.payload.title)}</h2><p class="act-meta">${when(version.created_at)} · ${plural(version.payload.articles.length,'article')} · ${E(versionChanges(version,previous))}</p></div>${revision===m.current?`<button type="button" class="btn" data-action="back-editor">${icon('pen')}Edit in Policy Studio</button>`:''}</header>
 <h3 class="act-h3">${previous?`Changes from version ${revision-1}${diff?` <span class="act-diff-count"><ins>+${diff.added}</ins> <del>−${diff.removed}</del> words</span>`:''}`:'First version'}</h3>
 ${previous?(sameText(before,after)?'<p class="act-none">Article text is unchanged; only the title or other fields differ.</p>':`<div class="act-diff ps-diff">${diffHTML(before,after,E)}</div>`):`<div class="act-diff">${E(after)}</div>`}
 <h3 class="act-h3">Activity on this version</h3>${results.length||jobs.length?`<div class="act-outputs">${jobs.map(j=>`<button type="button" class="act-item" data-action="activity-open" data-item="job:${E(j.id)}"><span class="act-icon kind-job">${icon('network',15)}</span><span class="act-copy"><b>Agent run · ${E((SCOPES[j.intent]||[j.intent])[0])}</b><small>${when(j.created_at)}</small></span><span class="act-flags"><span class="status-badge ${E(j.status)}">${E(JOB_STATES[j.status]||j.status)}</span></span></button>`).join('')}${results.map(r=>`<button type="button" class="act-item" data-action="activity-open" data-item="run:${E(r.id)}"><span class="act-icon kind-${E(r.kind)}">${icon(KIND_ICON[r.kind]||'file',15)}</span><span class="act-copy"><b>${KINDS[r.kind]}</b><span class="act-summary">${E(runSummary(r,ctx.fmt,ctx.rup))}</span></span><span class="act-flags"><span class="act-flag ${r.review_status==='needs_review'?'needs':'done'}">${r.review_status==='needs_review'?'Needs review':'Reviewed'}</span></span></button>`).join('')}</div>`:'<p class="act-none">No checks or simulations ran on this version.</p>'}
 ${previous?`<details class="act-limits"><summary>Full text of version ${revision}</summary><div class="act-diff">${E(after)}</div></details>`:''}`;
}

// ---- Run agent team sheet ----------------------------------------------------------------------

export function sheetHTML(S,ctx){
 const {E}=ctx,intent=SCOPES[S.agentIntent]?S.agentIntent:'full',draft=articlesText(S.draft.articles),alternative=S.alt||draft;
 const assumptions=S.simAss||S.runs.find(r=>r.kind==='simulation')?.payload.assumptions||defaultAssumptions,c=S.socialConfig;
 return `<dialog class="act-sheet" data-intent="${intent}" aria-labelledby="act-sheet-title">
 <header><div><h2 id="act-sheet-title">Run agent team</h2><p>${E(S.draft.title)} · version ${S.draft.revision}. Agents work on a snapshot and never change the draft.</p></div><button type="button" class="btn act-sheet-close" data-action="activity-sheet-close" aria-label="Close">${icon('close')}</button></header>
 <div class="act-sheet-body">
  <label for="agent-intent">Task scope</label><select id="agent-intent">${Object.entries(SCOPES).map(([key,[title]])=>`<option value="${key}" ${key===intent?'selected':''}>${title}</option>`).join('')}</select>
  <p class="act-scope-help">${Object.entries(SCOPES).map(([key,[,help]])=>`<span data-scope="${key}">${help}</span>`).join('')}</p>
  <div class="act-sheet-b"><label for="agent-alternative">Alternative B</label><p class="act-source">${S.alt&&!sameText(S.alt,draft)?'From Test impact. Edits here also update Test impact.':'Copy of the current draft. Change it to describe alternative B.'}</p><textarea id="agent-alternative" rows="7">${E(alternative)}</textarea></div>
  <div class="act-sheet-assumptions"><h3>Assumptions</h3><div class="inline-assumptions">${assumptionInputs(assumptions)}</div></div>
  <div class="act-sheet-forum"><h3>Forum size</h3><p>${c.persona_count} personas · ${c.rounds} rounds · ${c.crowd_size?c.crowd_size+' crowd agents':'no crowd'}. Change it in Test impact → Public forum.</p></div>
  <h3>Team</h3><ol class="act-team">${Object.values(AGENTS).map(name=>`<li>${E(name)}</li>`).join('')}</ol>
 </div>
 <footer><button type="button" class="btn" data-action="activity-sheet-close">Cancel</button><button type="button" class="btn primary" data-action="start-agent">${icon('play')}Start run</button></footer>
</dialog>`;
}
