import {NETWORK,CLUSTERS,layoutNetwork,opinionPosition,sourcePositions} from '/static/network-layout.js';
import {icon,enhanceVisualSurface} from '/static/design.js';
import {mountCrowd} from '/static/crowd-network.js';
import {mountKnowledgeGraph} from '/static/kg-graph.js';
// Live events and recorded replay share one renderer. Replay never calls AI.
const E=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={support:'Support',concern:'Concern',conditional:'Conditional',uncertain:'Undecided'};
const issues={access:'Access',accessibility:'Accessibility',capacity:'Capacity',cost:'Cost',clarity:'Clarity',other:'Other'};

const active=s=>['queued','running','cancelling'].includes(s);
const STANCE_ORDER=['support','conditional','concern','uncertain'];
const clock2=ms=>{const s=Math.max(0,Math.round(ms/1000));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};

// Progress of a running forum job, derived from its recorded events (no extra requests).
function runProgress(job){
  const ev=job.events||[],done=t=>ev.some(e=>e.tool===t&&e.status==='completed'),opts=job.social_options||{};
  const total=Math.max(1,(opts.persona_count||8)*(opts.rounds||3)*2);
  const responses=ev.filter(e=>e.tool==='social_reaction'&&['completed','failed'].includes(e.status)).length;
  const last=ev.filter(e=>e.tool!=='social_reaction').at(-1),gather=ev.filter(e=>e.tool==='gather_opinions'&&e.status==='running').at(-1);
  let pct=2+(done('snapshot_draft')?2:0)+(done('plan_workflow')?4:0)+(done('search_sources')?6:0)+(done('build_graph')?6:0);
  pct=Math.min(97,Math.round(pct+(responses?72*Math.min(1,responses/total):0)+(done('validate_results')?10:0)));
  const stage=job.status==='queued'?0:!done('plan_workflow')?1:!done('search_sources')?2:!done('build_graph')?3:responses<total?4:5;
  let label='Starting the run…';
  if(job.status==='cancelling')label='Cancelling after the current step…';
  else if(job.status==='running'){
    if(!done('plan_workflow'))label='The coordinator is planning the public test…';
    else if(!done('search_sources'))label='Retrieving legal context for A and B…';
    else if(!done('build_graph'))label='Building the stakeholder knowledge graph…';
    else if(responses<total)label=(gather?'Round '+gather.detail.round+' · Draft '+gather.detail.scenario+' · ':'')+responses+' of '+total+' persona responses';
    else label='Spreading opinions through the crowd and validating results…';
  }else if(job.status==='queued')label='Queued: waiting for a free worker…';
  void last;
  return {pct,stage,label,responses,total};
}
const PROGRESS_STEPS=['Queued','Plan','Sources','Knowledge graph','Persona rounds','Crowd & checks'];
function progressHTML(job,state){
  const p=runProgress(job),role=state.status.principal?.role,canCancel=!['viewer','reviewer'].includes(role)&&(role==='admin'||state.status.principal?.id===job.owner);
  return '<section class="social-progress" role="group" aria-label="Forum run progress"><div class="sp-head"><div><b>Running the public forum</b><span class="sp-label" role="status" aria-live="polite">'+E(p.label)+'</span></div><div class="sp-side"><span class="sp-time" data-elapsed="'+E(job.created_at)+'">Elapsed '+clock2(Date.now()-Date.parse(job.created_at))+'</span>'+
    (job.status==='cancelling'?'':'<button type="button" class="btn" data-action="cancel-agent" data-job="'+E(job.id)+'" '+(canCancel?'':'disabled title="Only the run owner or an admin can cancel"')+'>Cancel run</button>')+'</div></div>'+
    '<div class="sp-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+p.pct+'" aria-label="Forum run progress"><i style="width:'+p.pct+'%"></i></div>'+
    '<ol class="sp-steps">'+PROGRESS_STEPS.map((t,i)=>'<li class="'+(i<p.stage?'done':i===p.stage?'now':'')+'">'+E(t)+'</li>').join('')+'</ol></section>';
}
function issuesHTML(latest,personas){
  const roleOf=id=>personas.find(p=>p.id===id)?.role||'Synthetic persona';
  const rows=Object.values(latest),groups=Object.entries(issues).map(([k,label])=>({k,label,items:rows.filter(c=>c.issue===k)})).filter(g=>g.items.length)
    .sort((a,b)=>(a.k==='other')-(b.k==='other')||b.items.length-a.items.length);
  const card=g=>{
    const mix=STANCE_ORDER.map(s=>[s,g.items.filter(c=>c.stance===s).length]).filter(([,n])=>n);
    return '<article class="issue-card"><header><h4>'+E(g.label)+'</h4><span class="issue-count">'+g.items.length+(g.items.length===1?' agent':' agents')+'</span></header>'+
      '<div class="issue-mix" role="img" aria-label="'+E(mix.map(([s,n])=>n+' '+labels[s].toLowerCase()).join(', '))+'">'+mix.map(([s,n])=>'<i class="'+s+'" style="flex:'+n+'"></i>').join('')+'</div>'+
      '<p class="issue-mix-legend">'+mix.map(([s,n])=>'<span class="'+s+'">'+n+' '+labels[s].toLowerCase()+'</span>').join('')+'</p>'+
      '<ul class="issue-list">'+g.items.map(c=>{const long=(c.proposal||'').length>230;return '<li class="issue-item '+E(c.stance)+'"><div class="issue-who"><span class="social-avatar">'+E(c.name.slice(0,2).toUpperCase())+'</span><div><b>'+E(c.name)+'</b><small>'+E(roleOf(c.persona_id))+'</small></div><span class="social-tag '+E(c.stance)+'">'+labels[c.stance]+'</span></div>'+
        '<p class="issue-text'+(long?' clamp':'')+'">'+(c.proposal?E(c.proposal):'No proposal recorded.')+'</p><div class="issue-actions">'+(long?'<button type="button" class="text-button" data-expand aria-expanded="false">Show more</button>':'')+'<button type="button" class="text-button" data-comment="'+E(c.id)+'" data-to-detail>View original comment</button></div></li>';}).join('')+'</ul></article>';
  };
  return '<section class="panel social-summary"><div class="panel-head"><div><h3>Issues &amp; mitigation proposals</h3><p class="micro">Latest proposal from each persona, grouped by issue.</p></div><span class="tag">'+groups.length+(groups.length===1?' issue':' issues')+' · '+rows.length+' proposals</span></div>'+
    (groups.length?'<div class="issue-board">'+groups.map(card).join('')+'</div>':'<p class="social-placeholder">Proposals appear as personas respond.</p>')+'</section>';
}
let stageView=null,graphZoom=1,panX=0,panY=0,lastSignature='',state,root,jobId,scenario='A',selected=null,selectedComment=null,selectedSource=null,selectedDraft=false,cursor=null,playing=false,speed=1,clock,networkQuery='',networkIssue='all',networkLayer='all';

// Opening the forum from elsewhere (e.g. the Draft insights rail) can pick the network view first.
export function setGraphView(view){stageView=view;}
export function socialShell(options={persona_count:24,rounds:4,crowd_size:100},context=''){
  return `<div class="social-shell"><div class="social-launch forum-bar"><div class="forum-bar-title"><b>AI persona public forum</b><small>Synthetic stakeholders react to A and B; the crowd spreads their views.</small>${context?`<span class="forum-context">${context}</span>`:''}</div><div class="social-configuration"><label for="social-persona-count">Agents<select id="social-persona-count">${[8,16,24,32].map(n=>`<option value="${n}" ${n===options.persona_count?'selected':''}>${n} agents</option>`).join('')}</select></label><label for="social-round-count">Rounds<select id="social-round-count">${[2,3,4,5].map(n=>`<option value="${n}" ${n===options.rounds?'selected':''}>${n} rounds</option>`).join('')}</select></label><label for="social-crowd-size">Crowd<select id="social-crowd-size">${[0,50,100,200,500].map(n=>`<option value="${n}" ${n===(options.crowd_size??100)?'selected':''}>${n?n+' crowd agents':'No crowd'}</option>`).join('')}</select></label><div class="forum-cost" title="Live mode makes this many persona calls, plus the planner and graph extraction. The crowd spreads opinions with rule-based diffusion and adds no AI calls."><strong>${options.persona_count*options.rounds*2} A/B responses</strong><span>${options.crowd_size??100} crowd agents add no AI calls</span></div></div><div class="actions"><button class="btn primary" data-action="start-agent" data-intent="social">${icon('network')}Collect public opinions</button><button class="btn" data-action="refresh-agents" aria-label="Refresh forum results" title="Refresh">${icon('refresh')}</button></div></div><div id="social-live"></div></div>`;
}

export function updateSocial(s){
  state=s;const nextRoot=document.querySelector('#social-live');
  if(!nextRoot){clearTimeout(clock);playing=false;root=null;return;}
  const socialJobs=s.jobs.filter(j=>j.intent==='social'||j.plan?.workflow==='social');
  const nextJob=socialJobs[0];const nextId=nextJob?.id;
  if(nextId!==jobId){clearTimeout(clock);playing=false;cursor=null;scenario='A';selected=null;selectedComment=null;selectedSource=null;selectedDraft=false;graphZoom=1;panX=0;panY=0;jobId=nextId;}
  const signature=JSON.stringify([nextId,nextJob?.events.length,nextJob?.status,s.dirty,s.runs.length,s.draft?.revision,nextJob?.stale]);
  const unchanged=root===nextRoot&&signature===lastSignature;
  if(root===nextRoot&&nextRoot.querySelector('.rl-select-trigger[aria-expanded="true"]'))return;
  lastSignature=signature;
  root=nextRoot;root.onclick=click;
  root.onchange=e=>{if(e.target.id==='social-speed'){speed=Number(e.target.value);if(playing)schedule();}if(e.target.id==='network-issue'){networkIssue=e.target.value;filterNetwork();}if(e.target.id==='network-layer'){networkLayer=e.target.value;filterNetwork();}};root.oninput=e=>{if(e.target.id==='network-search'){networkQuery=e.target.value;filterNetwork();}};
  if(!unchanged)paint();
}

function current(){
  const job=state.jobs.find(j=>j.id===jobId);
  const run=state.runs.find(r=>r.id===job?.result?.social_run_id);
  const events=(job?.events||[]).filter(e=>['social_reaction','gather_opinions'].includes(e.tool)&&(e.detail.comment?.scenario||e.detail.scenario)===scenario);
  const visible=cursor===null?events:events.slice(0,cursor);
  const comments=visible.filter(e=>e.tool==='social_reaction'&&e.status==='completed').map(e=>e.detail.comment).filter(c=>c.scenario===scenario);
  const latest=Object.fromEntries(comments.map(c=>[c.persona_id,c]));
  const defaultPersonas = state.socialPreview || state.draft?.personas || state.status.social_personas || [];
  const discoveredPersonas = Object.values(Object.fromEntries(events.filter(e=>e.detail.persona).map(e=>[e.detail.persona.id,e.detail.persona])));
  const personas=run?.payload.personas || (discoveredPersonas.length ? discoveredPersonas : defaultPersonas);
  const pending=Object.values(Object.fromEntries(visible.filter(e=>e.tool==='social_reaction'&&e.detail.scenario===scenario).map(e=>[e.agent,e]))).filter(e=>e.status==='running');
  const trulyPending=pending.filter(e=>!visible.some(v=>v.status==='completed'&&v.detail.comment?.id===scenario+'-'+e.detail.round+'-'+e.agent)&&!visible.some(v=>['failed','cancelled'].includes(v.status)&&v.agent===e.agent&&v.detail.scenario===scenario&&v.detail.round===e.detail.round));
  return {job,run,events,visible,comments,latest,personas,pending:trulyPending};
}

function paint(){
  if(!root?.isConnected)return;
  const focusedSearch=document.activeElement?.id==='network-search';
  const searchRange=focusedSearch?[document.activeElement.selectionStart,document.activeElement.selectionEnd]:null;
  const d=current(),{job,run,events,comments,latest,personas,pending}=d;
  if(!job){
    const configured=personas.length ? personas : (state.socialPreview || state.draft?.personas || state.status.social_personas || []);
    root.innerHTML=`<div class="social-empty"><div class="social-empty-copy"><span class="tag">Not run yet</span><h3>Who is affected by this document?</h3><p>Run a public opinion simulation. The system detects the document’s sector and prepares ${state.socialConfig?.persona_count||24} affected personas with the number of rounds you choose.</p><p class="micro">${state.status.provider==='demo'?'Demo mode uses smart local response templates.':'Personas respond through live AI calls.'} Synthetic reactions are a policy-testing instrument, not a statistical survey.</p></div><div class="social-preview">${configured.map(p=>`<div class="preview-persona"><span class="social-avatar">${E(p.name.slice(0,2).toUpperCase())}</span><div><b>${E(p.name)}</b><span class="preview-role">${E(p.role||'')}</span><span>${E(p.background)}</span></div></div>`).join('')}<p class="micro">${configured.length} Personas configured for this document · No opinions yet</p></div></div>`;
    enhanceVisualSurface(root,{view:'social'});
    return;
  }

  const live=active(job.status),animating=playing||(live&&cursor===null),mode=job.plan?.provider?.mode||state.status.provider;
  root.classList.toggle('social-paused',!animating);
  const lastGather=d.visible.filter(e=>e.tool==='gather_opinions').at(-1);
  root.classList.toggle('social-gathering',animating&&lastGather?.status==='running');
  const phase=job.events.at(-1)?.tool;
  const preparation=live&&!comments.length&&!pending.length?'<div class="social-typing">'+(phase==='search_sources'?'Retrieving legal context for A and B…':phase==='plan_workflow'?'The coordinator is planning the public test…':'Preparing opinion rounds '+personas.length+' persona…')+'</div>':'';
  const scenarioText=run?.payload.scenarios[scenario]?.text;
  const totalRounds=run?.payload.rounds||job.social_options?.rounds||state.socialConfig?.rounds||4;
  const round=Math.max(1,...comments.map(c=>c.round),...pending.map(e=>e.detail.round));
  const counts=Object.keys(labels).map(k=>'<div><strong>'+Object.values(latest).filter(c=>c.stance===k).length+'</strong><span>'+labels[k]+'</span></div>').join('');
  
  const selectedPersona=personas.find(p=>p.id===selected)||personas[0];
  if(!selected&&selectedPersona)selected=selectedPersona.id;
  const opinion=comments.find(c=>c.id===selectedComment)||latest[selectedPersona?.id];
  const repliedOpinion=comments.find(c=>c.id===opinion?.reply_to);
  const contextSources=(run?.payload.evidence||[]).slice(0,6);

  const positions=layoutNetwork(personas);
  const contextPositions=sourcePositions(contextSources.length);
  const contextNodes=contextSources.map((e,i)=>{
    const [x,y]=contextPositions[i]||[110+i*120,790];
    return '<path class="social-context-edge" d="M550 395 Q'+x+' 620 '+x+' '+y+'"/><g class="social-law-node '+(selectedSource===e.id?'selected':'')+'" data-source="'+E(e.id)+'" role="button" tabindex="0" aria-label="'+E(e.regulation_label+' Pasal '+e.number)+'"><circle class="node-hit" cx="'+x+'" cy="'+y+'" r="20"/><circle cx="'+x+'" cy="'+y+'" r="7"/><text x="'+x+'" y="'+(y+21)+'" text-anchor="middle">'+E(e.regulation_label)+'</text><text x="'+x+'" y="'+(y+34)+'" text-anchor="middle">Pasal '+E(e.number)+'</text></g>';
  }).join('');

  const nidx=Object.fromEntries(personas.map((p,i)=>[p.id,i]));
  const opinionNodes=comments.map(c=>{
    const i=nidx[c.persona_id];
    if(i===undefined||!positions[i])return '';
    const [px,py]=positions[i];
    const [x,y]=opinionPosition([px,py],c.round,totalRounds);
    return '<path class="social-opinion-edge" d="M'+px+' '+py+' Q'+x+' '+py+' '+x+' '+y+'"/><g class="social-opinion-node '+(selectedComment===c.id?'selected':'')+'" data-comment="'+E(c.id)+'" data-person-id="'+E(c.persona_id)+'" data-issue="'+E(personas[i]?.cluster||personas[i]?.issue||'other')+'" role="button" tabindex="0" aria-label="Opinion '+E(c.name)+' rounds '+c.round+'"><title>'+E(c.comment)+'</title><circle class="node-hit" cx="'+x+'" cy="'+y+'" r="20"/><circle cx="'+x+'" cy="'+y+'" r="9"/><text x="'+x+'" y="'+(y+3)+'" text-anchor="middle">'+c.round+'</text></g>';
  }).join('');

  const links=Object.values(Object.fromEntries(comments.filter(c=>c.reply_to).map(c=>[c.persona_id+':'+comments.find(x=>x.id===c.reply_to)?.persona_id,c]))).map(c=>{
    const target=comments.find(x=>x.id===c.reply_to);
    if(!target)return '';
    const from=positions[nidx[c.persona_id]],to=positions[nidx[target.persona_id]];
    if(!from||!to)return '';
    const recent=comments.at(-1)?.id===c.id;
    return '<path data-from="'+E(c.persona_id)+'" data-to="'+E(target.persona_id)+'" class="social-edge '+(recent&&animating?'moving':'')+'" d="M'+from.join(' ')+' Q550 375 '+to.join(' ')+'" marker-end="url(#social-arrow)"><title>'+E(c.name+' replying to '+target.name+' · '+c.id)+'</title></path>';
  }).join('');

  const nodes=personas.map((p,i)=>{
    const pos=positions[i]||[NETWORK.cx,NETWORK.cy],op=latest[p.id],busy=pending.some(e=>e.agent===p.id);
    return '<g class="social-node '+E(op?.stance||'uncertain')+' '+(busy?'thinking':'')+' '+(selected===p.id&&!selectedDraft&&!selectedSource?'selected':'')+'" data-person="'+E(p.id)+'" data-issue="'+E(p.cluster||p.issue||'other')+'" role="button" tabindex="0" aria-label="'+E(p.name)+'"><circle class="halo" cx="'+pos[0]+'" cy="'+pos[1]+'" r="31"/><circle cx="'+pos[0]+'" cy="'+pos[1]+'" r="24"/><text x="'+pos[0]+'" y="'+(pos[1]+5)+'" text-anchor="middle" class="initial">'+E(p.name.slice(0,2).toUpperCase())+'</text><text x="'+pos[0]+'" y="'+(pos[1]+58)+'" text-anchor="middle">'+E(p.name)+'</text><text class="node-status" x="'+pos[0]+'" y="'+(pos[1]+74)+'" text-anchor="middle">'+(busy?'Composing opinion…':op?labels[op.stance]:'Waiting')+'</text></g>';
  }).join('');

  const feed=comments.slice().reverse().map(c=>{
    const target=comments.find(x=>x.id===c.reply_to);
    const pMeta=personas.find(p=>p.id===c.persona_id);
    return '<article class="social-post '+(animating&&comments.at(-1)?.id===c.id?'arriving':'')+'"><div class="social-person"><span class="social-avatar">'+E(c.name.slice(0,2).toUpperCase())+'</span><div><b>'+E(c.name)+'</b><small>'+E(pMeta?.role||'Synthetic persona')+' · Round '+c.round+'</small></div><span class="social-tag '+E(c.stance)+'">'+labels[c.stance]+'</span></div>'+(target?'<div class="social-reply">↳ Replying to '+E(target.name)+' · '+E(target.comment.slice(0,100))+'…</div>':'')+'<p>'+E(c.comment)+'</p><button class="text-button" data-comment="'+E(c.id)+'">Reasoning & proposal ↗</button></article>';
  }).join('');

  const graph=run?.payload.network?.graph,crowdNet=run?.payload.network;
  const view=stageView||(graph?'kg':'persona');
  const graphTabs=[['kg','Knowledge graph',graph?graph.entities.length+' entities · '+graph.relations.length+' relations':'After the run'],['crowd','Crowd network',crowdNet?crowdNet.crowd.nodes.length+' agents':'After the run'],['persona','Persona network',personas.length+' agents · live']].map(([id,title,sub])=>'<button type="button" role="tab" id="graph-tab-'+id+'" data-graph-view="'+id+'" aria-selected="'+(view===id)+'" aria-controls="graph-pane-'+id+'" tabindex="'+(view===id?'0':'-1')+'"><b>'+title+'</b><small>'+E(sub)+'</small></button>').join('');
  const graphNote=view==='kg'?'Entities and relations from the draft, its sources and the stakeholders'+(graph?.extraction==='rules+llm'?' · AI-extracted':''):view==='crowd'?'How opinions spread through a simulated follow network':'Who replied to whom, round by round';
  const traceSource=opinion?.evidence_ids.map(id=>run?.payload.evidence.find(e=>e.id===id)).filter(Boolean)||[];

  root.innerHTML='<div class="social-toolbar"><div class="social-switch"><button data-scenario="A" aria-pressed="'+(scenario==='A')+'">A · Initial draft</button><button data-scenario="B" aria-pressed="'+(scenario==='B')+'">B · Alternative</button></div><span class="pill">'+E(({queued:'Queued',running:'Running',cancelling:'Cancelling',cancelled:'Cancelled',completed:'Done',failed:'Failed',interrupted:'Interrupted'})[job.status]||job.status)+' · '+(mode==='demo'?'Template demo':'AI live')+'</span><span class="micro">'+(cursor===null?'Recorded activity':'Recorded replay')+' · '+comments.length+'/'+(personas.length*totalRounds)+' responses '+scenario+'</span>'+(live?'<button class="btn" id="social-freeze">'+(cursor===null?'Ⅱ Pause visual':'▶ Follow live')+'</button><button class="btn" data-action="cancel-agent" data-job="'+E(job.id)+'" '+(state.status.principal?.role==='admin'||state.status.principal?.id===job.owner?'':'disabled')+'>Cancel</button>':'')+'</div>'+
  (job.stale||state.dirty||job.revision!==state.draft?.revision?'<div class="note">Results bound to draft v'+job.revision+'. The draft has changed; run again for the latest version.</div>':'')+
  (job.status==='failed'||job.status==='interrupted'||job.status==='cancelled'?'<div class="note">'+E(job.error||'Run stopped. Partial opinions can still be reviewed.')+'</div>':'')+
  (live?progressHTML(job,state):'')+
  '<section class="panel graph-stage" aria-label="Network views"><div class="graph-stage-head"><div class="graph-tabs" role="tablist" aria-label="Network view">'+graphTabs+'</div><span class="micro graph-stage-note">'+graphNote+'</span></div>'+
  '<div class="graph-pane" id="graph-pane-kg" role="tabpanel" aria-labelledby="graph-tab-kg" '+(view==='kg'?'':'hidden')+'><div id="kg-root"></div></div>'+
  '<div class="graph-pane" id="graph-pane-crowd" role="tabpanel" aria-labelledby="graph-tab-crowd" '+(view==='crowd'?'':'hidden')+'><section class="crowd-panel" id="crowd-root"></section></div>'+
  '<div class="graph-pane" id="graph-pane-persona" role="tabpanel" aria-labelledby="graph-tab-persona" '+(view==='persona'?'':'hidden')+'><div class="social-grid">'+
  '<section class="panel social-network"><div class="panel-head"><h3>Policy network</h3><span class="micro">'+personas.length+' persona · '+contextSources.length+' sources · Round '+round+'</span></div><div class="network-controls"><input id="network-search" type="search" value="'+E(networkQuery)+'" placeholder="Search agent name or role…" aria-label="Search agents in the network"><select id="network-issue" aria-label="Filter network issue"><option value="all">All issues</option>'+CLUSTERS.map(c=>'<option value="'+c.id+'" '+(networkIssue===c.id?'selected':'')+'>'+E(c.label)+'</option>').join('')+'</select><select id="network-layer" aria-label="Network layer"><option value="all" '+(networkLayer==='all'?'selected':'')+'>All nodes</option><option value="connections" '+(networkLayer==='connections'?'selected':'')+'>Agents & replies</option></select></div><div class="social-maptools"><span id="network-visible-count"></span><button data-network-expand aria-label="Expand network">'+icon('focus')+'</button><button data-zoom="in" aria-label="Zoom in network">'+icon('zoomIn')+'</button><button data-zoom="out" aria-label="Zoom out network">'+icon('zoomOut')+'</button><button data-zoom="reset" aria-label="Reset network">'+icon('focus')+'</button></div><svg viewBox="0 0 1100 850" aria-label="Agent reply network"><defs><radialGradient id="social-sphere" cx="28%" cy="22%" r="85%"><stop offset="0" stop-color="#ffe2ed"/><stop offset=".3" stop-color="#cd5271"/><stop offset="1" stop-color="#8e1737"/></radialGradient><radialGradient id="social-sphere-soft" cx="27%" cy="20%" r="90%"><stop offset="0" stop-color="#fff"/><stop offset=".38" stop-color="#f0bccd"/><stop offset="1" stop-color="#bd627f"/></radialGradient><radialGradient id="social-sphere-gray" cx="25%" cy="18%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#c1c9d7"/></radialGradient><marker id="social-arrow" viewBox="0 0 10 10" refX="27" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0 10 5 0 10" fill="#c68e9f"/></marker></defs>'+CLUSTERS.map(c=>'<g class="network-cluster"><circle cx="'+c.x+'" cy="'+c.y+'" r="145" style="--cluster-color:'+c.color+'"/><text x="'+c.x+'" y="'+(c.y-135)+'" text-anchor="middle">'+E(c.label)+'</text></g>').join('')+contextNodes+opinionNodes+links+'<g class="social-draft-node '+(selectedDraft?'selected':'')+'" data-draft="true" role="button" tabindex="0" aria-label="View draft '+scenario+'"><circle cx="550" cy="375" r="44" class="social-center"/><text x="550" y="371" text-anchor="middle" class="social-center-text">§</text><text x="550" y="390" text-anchor="middle" class="social-center-caption">DRAFT '+scenario+'</text></g>'+nodes+'</svg><div class="social-legend">Click a persona for its latest opinion · Click satellites 1–'+totalRounds+' for opinions per round · Small nodes below: RAG sources.</div><div class="social-replay"><button class="btn" id="social-play" '+(live?'disabled':'')+'>'+(playing?'Ⅱ Pause':'▶ Replay')+'</button><button class="btn" id="social-latest">Latest result</button><label>Speed <select id="social-speed"><option value="1" '+(speed===1?'selected':'')+'>1×</option><option value="2" '+(speed===2?'selected':'')+'>2×</option><option value="4" '+(speed===4?'selected':'')+'>4×</option></select></label></div><div class="social-rounds">'+Array.from({length:totalRounds},(_,i)=>i+1).map(r=>'<button data-social-round="'+r+'" aria-pressed="'+(round===r)+'">0'+r+' · '+['Reaction','Discussion','Reflection','Mitigation','Evaluation'][r-1]+'</button>').join('')+'</div></section>'+
  '<section class="panel social-inspector"><div class="panel-head"><h3>Persona opinion details</h3></div><div class="panel-body">'+(selectedPersona?'<div class="social-person"><span class="social-avatar">'+E(selectedPersona.name.slice(0,2).toUpperCase())+'</span><div><b>'+E(selectedPersona.name)+'</b><span class="preview-role">'+E(selectedPersona.role||'')+'</span></div></div><h4>Persona profile & context</h4><p>'+E(selectedPersona.background)+'</p><h4>Primary goal</h4><p>'+E(selectedPersona.goal)+'</p>':'<p>Personas appear when the run starts.</p>')+(opinion?'<h4>Opinion · Round '+opinion.round+'</h4><div class="quote social-selected-opinion" data-opinion-id="'+E(opinion.id)+'">'+E(opinion.comment)+'</div><p class="micro">'+E(opinion.id)+' · '+labels[opinion.stance]+'</p>'+(repliedOpinion?'<div class="social-reply">↳ Replying to <button class="text-button" data-comment="'+E(repliedOpinion.id)+'">'+E(repliedOpinion.name)+' · Round '+repliedOpinion.round+'</button><br>'+E(repliedOpinion.comment.slice(0,160))+'…</div>':'')+'<h4>Reviewable reasoning</h4><p>'+E(opinion.rationale)+'</p><h4>Proposal</h4><div class="quote">'+E(opinion.proposal)+'</div><h4>Stance progression</h4><div class="social-attitudes">'+comments.filter(c=>c.persona_id===selectedPersona.id).map(c=>'<span class="social-tag '+E(c.stance)+'">'+c.round+' · '+labels[c.stance]+'</span>').join(' → ')+'</div><h4>Legal context references</h4>'+traceSource.map(e=>'<details class="source-details"><summary>'+E(e.regulation_label)+' · Article '+E(e.number)+'</summary><p>'+E(e.text)+'</p><small>'+E(e.id)+'</small></details>').join('')+(!traceSource.length?'<p class="micro">'+(opinion.evidence_ids.length?'Context source IDs: '+E(opinion.evidence_ids.join(', '))+'. Quotes are available after the run finishes. ':'This comment has no legal reference. ')+ ' Reactions are persona inferences, not facts about society.</p>':'<p class="micro">Legal context, not empirical evidence of public attitudes.</p>'):'<p class="micro">Reasoning and proposals appear once the response is complete.</p>')+'</div></section></div></div></section>'+
  '<div class="social-counts">'+counts+'</div><p class="micro">Latest stance of agents that responded, not a distribution of public opinion.</p>'+
  (scenarioText?'<details class="social-draft"><summary>Draft '+scenario+' read by agents · v'+job.revision+'</summary><pre>'+E(scenarioText)+'</pre></details>':'')+
  '<div class="social-grid social-below">'+
  '<section class="panel social-feed"><div class="panel-head"><h3>Persona conversation ('+personas.length+' agents)</h3><span class="tag">'+comments.length+' opinions</span></div><div class="social-feed-body" aria-live="off">'+preparation+(pending.length?'<div class="social-typing">'+E(pending.map(e=>e.detail.persona.name).join(', '))+' is responding <span>● ● ●</span></div>':'')+(feed||'<p class="social-placeholder">Waiting for completed responses. No substitute comments are produced when the provider fails.</p>')+'</div></section>'+
  issuesHTML(latest,personas)+'</div>'+
  (run?'<details class="social-data"><summary>Data used & A/B comparison</summary><table><thead><tr><th>Persona</th><th>Final opinion A</th><th>Final opinion B</th></tr></thead><tbody>'+run.payload.personas.map(p=>'<tr><td>'+E(p.name)+' ('+E(p.role||'')+')</td>'+['A','B'].map(k=>'<td>'+labels[run.payload.scenarios[k].comments.filter(c=>c.persona_id===p.id).at(-1)?.stance||'uncertain']+'</td>').join('')+'</tr>').join('')+'</tbody></table><p class="micro">RAG: '+run.payload.evidence.length+' articles/blocks. Assumptions: '+E(JSON.stringify(run.payload.assumptions))+'.</p><div class="social-metrics">'+['A','B'].map(k=>'<div><b>'+k+' · Separate assumption model</b><p>'+run.payload.scenarios[k].metrics.access_pct+'% access · Rp '+new Intl.NumberFormat('id-ID').format(run.payload.scenarios[k].metrics.cost)+'</p><small>Not a number derived from agent opinions.</small></div>').join('')+'</div>'+run.payload.limitations.map(l=>'<p class="micro">'+E(l)+'</p>').join('')+'</details>':'')+
  '<p class="micro social-footnote">'+personas.length+' personas and '+totalRounds+' rounds per scenario ('+(personas.length*totalRounds*2)+' total responses). Replay plays back saved events without new AI calls.</p>';

  const svg=root.querySelector('.social-network > svg');
  const updateViewport=()=>svg?.setAttribute('viewBox',(NETWORK.cx-NETWORK.width/(2*graphZoom)+panX)+' '+(NETWORK.height/2-NETWORK.height/(2*graphZoom)+panY)+' '+(NETWORK.width/graphZoom)+' '+(NETWORK.height/graphZoom));
  updateViewport();filterNetwork();refreshExpandedNetwork();keepElapsedTicking();
  if(focusedSearch){const search=root.querySelector('#network-search');search?.focus({preventScroll:true});if(searchRange)search?.setSelectionRange(...searchRange);}

  attachNetworkPan(svg);
  const sourceSelected=run?.payload.evidence.find(e=>e.id===selectedSource);
  if(sourceSelected){
    const official=sourceSelected.source?.url||'';const url=/^https?:\/\//i.test(official)?official:'#';
    root.querySelector('.social-inspector .panel-head h3').textContent='Legal context / RAG';
    root.querySelector('.social-inspector .panel-body').innerHTML='<div class="eyebrow">RETRIEVED SOURCE</div><h3>'+E(sourceSelected.regulation_label)+' · Article '+E(sourceSelected.number)+'</h3><p class="micro">Source snapshot retrieved for context. Not evidence of public opinion.</p><div class="quote">'+E(sourceSelected.text)+'</div><h4>Provenance</h4><p>'+E(sourceSelected.id)+'</p><p>Page '+E((sourceSelected.pages||[]).join(', ')||'HTML')+'</p><a href="'+E(url)+'" target="_blank" rel="noopener">Official source ↗</a><p class="micro">SHA256 '+E(sourceSelected.source?.sha256||'')+'</p><p class="micro">Original and amended versions may be separate. Consolidated legal status needs verification.</p>';
  }
  if(selectedDraft){
    root.querySelector('.social-inspector .panel-head h3').textContent='Draft '+scenario+' · Snapshot v'+job.revision;
    root.querySelector('.social-inspector .panel-body').innerHTML='<div class="eyebrow">POLICY UNDER REVIEW</div><h3>Draft '+scenario+'</h3><p class="micro">Agents read the full scenario text '+scenario+' this. Not enacted.</p><div class="quote social-draft-quote">'+E(scenarioText||'Snapshot text is available after the run finishes.')+'</div>';
  }
  enhanceVisualSurface(root,{view:'social'});
  mountCrowd(root.querySelector('#crowd-root'),run?.payload.network,scenario,(job?.events||[]).filter(e=>['build_graph','spawn_crowd','crowd_diffusion'].includes(e.tool)));
  const kgRoot=root.querySelector('#kg-root');
  if(graph)mountKnowledgeGraph(kgRoot,{graph,key:run.id,stances:Object.fromEntries(Object.values(latest).map(c=>['stakeholder:'+c.persona_id,c.stance])),onAction:(kind,entity)=>{
    if(kind==='persona'){selected=entity.id.replace('stakeholder:','');selectedSource=null;selectedDraft=false;selectedComment=null;stageView='persona';paint();root.querySelector('.social-inspector')?.scrollIntoView({block:'nearest',behavior:'smooth'});}
    if(kind==='article')document.dispatchEvent(new CustomEvent('rulelab:open-article',{detail:{number:entity.id.replace('article:','')}}));
  }});
  else if(kgRoot)kgRoot.innerHTML='<div class="kg-pending"><h3>The knowledge graph appears when the run finishes</h3><p class="micro">'+(live?'The coordinator is building it from the draft, its legal sources and the stakeholders.':'This run did not build one. Choose a crowd size above zero before collecting opinions.')+'</p></div>';
  root.querySelectorAll('[data-person],[data-source],[data-draft],.social-opinion-node').forEach(el=>el.onkeydown=e=>{
    if(e.key==='Enter'||e.key===' '){
      e.preventDefault();
      const selector=el.dataset.person?'[data-person="'+el.dataset.person+'"]':el.dataset.source?'[data-source="'+el.dataset.source+'"]':el.dataset.comment?'.social-opinion-node[data-comment="'+el.dataset.comment+'"]':'[data-draft]';
      click({target:el});root.querySelector(selector)?.focus();
    }
  });
}

// Elapsed time of a running forum job ticks without repainting the page.
let elapsedTimer=null;
function keepElapsedTicking(){
  if(elapsedTimer||!document.querySelector('[data-elapsed]'))return;
  elapsedTimer=setInterval(()=>{const nodes=document.querySelectorAll('[data-elapsed]');if(!nodes.length){clearInterval(elapsedTimer);elapsedTimer=null;return;}nodes.forEach(el=>{el.textContent='Elapsed '+clock2(Date.now()-Date.parse(el.dataset.elapsed));});},1000);
}
function click(e){
  const more=e.target.closest('[data-expand]');
  if(more){const item=more.closest('.issue-item'),open=item.classList.toggle('open');more.textContent=open?'Show less':'Show more';more.setAttribute('aria-expanded',String(open));return;}
  const tab=e.target.closest('[data-graph-view]');
  if(tab){stageView=tab.dataset.graphView;paint();root.querySelector('#graph-tab-'+stageView)?.focus({preventScroll:true});return;}
  const el=e.target.closest('[data-network-expand],[data-network-close],[data-person],[data-source],[data-draft],[data-zoom],[data-scenario],[data-comment],[data-social-round],#social-play,#social-latest,#social-freeze');
  if(!el||el.disabled)return;
  const d=current();
  if(el.hasAttribute('data-network-close')){document.querySelector('#network-dialog')?.close();return;}
  if(el.hasAttribute('data-network-expand')){openExpandedNetwork();return;}
  if(el.dataset.zoom){
    graphZoom=el.dataset.zoom==='in'?Math.min(2.5,graphZoom+.25):el.dataset.zoom==='out'?Math.max(.75,graphZoom-.25):1;
    if(el.dataset.zoom==='reset'){panX=0;panY=0;}
  }
  if(el.dataset.draft){selectedDraft=true;selectedSource=null;selectedComment=null;}
  if(el.dataset.source){selectedSource=el.dataset.source;selectedDraft=false;}
  if(el.dataset.person){selected=el.dataset.person;selectedSource=null;selectedDraft=false;selectedComment=null;}
  if(el.dataset.comment){const c=d.comments.find(c=>c.id===el.dataset.comment);if(c){selected=c.persona_id;selectedSource=null;selectedDraft=false;selectedComment=c.id;}}
  if(el.dataset.scenario){scenario=el.dataset.scenario;selectedSource=null;selectedDraft=false;selectedComment=null;cursor=null;playing=false;clearTimeout(clock);}
  if(el.dataset.socialRound){clearTimeout(clock);playing=false;const r=Number(el.dataset.socialRound);cursor=d.events.reduce((last,e,i)=>e.tool==='gather_opinions'&&e.status==='completed'&&e.detail.scenario===scenario&&e.detail.round===r?i+1:last,0);}
  if(el.id==='social-freeze'){cursor=cursor===null?d.events.length:null;playing=false;clearTimeout(clock);}
  if(el.id==='social-latest'){cursor=null;playing=false;clearTimeout(clock);}
  if(el.id==='social-play'){playing=!playing;if(playing){if(cursor===null||cursor>=d.events.length){cursor=d.events.findIndex(e=>e.detail.scenario===scenario);if(cursor<0)cursor=0;}schedule();}else clearTimeout(clock);}
  if(el.hasAttribute('data-to-detail'))stageView='persona';  // the opinion detail lives in the persona network view
  paint();
  if(el.hasAttribute('data-to-detail'))root.querySelector('.social-inspector')?.scrollIntoView({block:'center',behavior:'smooth'});
  if(el.matches('[data-person],[data-source],[data-comment],[data-draft]')&&document.querySelector('#network-dialog')?.open){document.querySelector('#network-dialog').close();root.querySelector('.social-inspector')?.scrollIntoView({block:'nearest',behavior:'smooth'});}
}

function schedule(){
  clearTimeout(clock);
  clock=setTimeout(()=>{
    if(!root?.isConnected){playing=false;return;}
    const d=current();
    cursor=Math.min((cursor||0)+1,d.events.length);
    if(cursor>=d.events.length)playing=false;
    paint();
    if(playing)schedule();
  },900/speed);
}

function filterNetwork(){
 if(!root)return;
 const d=current(),query=networkQuery.trim().toLocaleLowerCase();
 const visible=new Set(d.personas.filter(p=>(networkIssue==='all'||(p.cluster||p.issue||'other')===networkIssue)&&(!query||[p.name,p.role,p.background].join(' ').toLocaleLowerCase().includes(query))).map(p=>p.id));
 root.querySelectorAll('.social-node,.social-opinion-node').forEach(node=>{
  const id=node.dataset.person||node.dataset.personId;
  node.classList.toggle('network-muted',!visible.has(id));
  node.classList.toggle('network-selected',id===selected);
  if(node.classList.contains('social-opinion-node'))node.style.display=networkLayer==='connections'?'none':'';
 });
 root.querySelectorAll('.social-edge').forEach(edge=>edge.classList.toggle('network-muted',!visible.has(edge.dataset.from)||!visible.has(edge.dataset.to)));
 root.querySelectorAll('.social-opinion-edge').forEach(edge=>edge.style.display=networkLayer==='connections'?'none':'');
 const count=root.querySelector('#network-visible-count');if(count)count.textContent=visible.size+' / '+d.personas.length+' agents';
}
function networkDialog(){
 let dialog=document.querySelector('#network-dialog');
 if(!dialog){
  dialog=document.createElement('dialog');dialog.id='network-dialog';dialog.className='social-network';dialog.setAttribute('aria-labelledby','network-dialog-title');document.body.append(dialog);
  dialog.addEventListener('close',()=>dialog.replaceChildren());
  dialog.addEventListener('click',click);
  dialog.addEventListener('keydown',event=>{const node=event.target.closest('g[role=button]');if(node&&['Enter',' '].includes(event.key)){event.preventDefault();click({target:node});}});
 }
 return dialog;
}
function refreshExpandedNetwork(){
 const dialog=document.querySelector('#network-dialog');
 if(!dialog?.open)return;
 const svg=root.querySelector('.social-network > svg');if(!svg)return;
 dialog.innerHTML='<div class="network-dialog-header"><div><span class="eyebrow">SYNTHETIC PERSONA NETWORK</span><h2 id="network-dialog-title">Policy network · '+current().personas.length+' agents</h2></div><div class="actions"><button class="btn" data-zoom="in" aria-label="Zoom in network">'+icon('zoomIn')+'</button><button class="btn" data-zoom="out" aria-label="Zoom out network">'+icon('zoomOut')+'</button><button class="btn" data-zoom="reset">Reset</button><button class="btn" data-network-close aria-label="Close network">Close</button></div></div><p class="micro">Click an agent or opinion node to read its reasoning in the inspector.</p>'+svg.outerHTML;
 attachNetworkPan(dialog.querySelector('svg'));
}
function openExpandedNetwork(){const dialog=networkDialog();dialog.showModal();refreshExpandedNetwork();dialog.querySelector('[data-network-close]')?.focus();}

function attachNetworkPan(svg){
 if(!svg)return;let drag;
 svg.onpointerdown=event=>{if(event.button!==0||event.target.closest('[data-person],[data-source],[data-comment],[data-draft]'))return;drag={x:event.clientX,y:event.clientY,px:panX,py:panY};svg.setPointerCapture(event.pointerId);};
 svg.onpointermove=event=>{if(!drag)return;const scale=NETWORK.width/(svg.getBoundingClientRect().width*graphZoom);panX=Math.max(-700,Math.min(700,drag.px-(event.clientX-drag.x)*scale));panY=Math.max(-550,Math.min(550,drag.py-(event.clientY-drag.y)*scale));const box=(NETWORK.cx-NETWORK.width/(2*graphZoom)+panX)+' '+(NETWORK.height/2-NETWORK.height/(2*graphZoom)+panY)+' '+(NETWORK.width/graphZoom)+' '+(NETWORK.height/graphZoom);for(const field of [svg,root.querySelector('.social-network > svg')])field?.setAttribute('viewBox',box);};
 svg.onpointerup=()=>{drag=null;};svg.onpointercancel=()=>{drag=null;};
}
