// Crowd network panel: force layout on canvas, per-round stance replay, influencers and communities.
// Pure rendering of a saved run (`payload.network`); replay never calls AI.
const E=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const W=900,H=560;
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const NEG=hex('#c0392b'),MID=hex('#b8bfc9'),POS=hex('#1f9d6b');
const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
export const stanceColor=s=>{const c=s<0?mix(MID,NEG,Math.min(1,-s/.8)):mix(MID,POS,Math.min(1,s/.8));return 'rgb('+c.join(',')+')';};
const stanceWord=s=>s>.2?'supports':s<-.2?'opposes':'neutral';
const ACTION={like:'liked',repost:'reposted',reply:'disputed',follow:'followed',unfollow:'unfollowed',post:'posted'};
let st={key:null,round:null,node:null,community:null,playing:false,timer:null,layouts:{},hits:[],scenario:'A'};

function rng(seed){let s=seed>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;return s/4294967296;};}
function hashSeed(t){let h=2166136261;for(const ch of t){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}

function layout(net,scenario){
  const key=net.seed+scenario;if(st.layouts[key])return st.layouts[key];
  const sc=net.scenarios[scenario],nodes=net.crowd.nodes,n=nodes.length,r=rng(hashSeed(key));
  const comms=Math.max(1,...sc.community_of)+1,cx=[],cy=[];
  for(let c=0;c<comms;c++){const a=2*Math.PI*c/comms;cx.push(W/2+Math.cos(a)*W*.27);cy.push(H/2+Math.sin(a)*H*.27);}
  const x=new Float32Array(n),y=new Float32Array(n),vx=new Float32Array(n),vy=new Float32Array(n);
  for(let i=0;i<n;i++){const c=Math.max(0,sc.community_of[i]);x[i]=cx[c]+(r()-.5)*120;y[i]=cy[c]+(r()-.5)*120;}
  const edges=net.crowd.edges;
  for(let it=0;it<160;it++){
    const cool=1-it/160;vx.fill(0);vy.fill(0);
    for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){let dx=x[i]-x[j],dy=y[i]-y[j],d2=dx*dx+dy*dy+.5;if(d2>9000)continue;const f=380/d2;dx*=f;dy*=f;vx[i]+=dx;vy[i]+=dy;vx[j]-=dx;vy[j]-=dy;}
    for(const [a,b] of edges){const dx=x[b]-x[a],dy=y[b]-y[a],d=Math.sqrt(dx*dx+dy*dy)+.1,f=(d-34)*.012;vx[a]+=dx/d*f;vy[a]+=dy/d*f;vx[b]-=dx/d*f;vy[b]-=dy/d*f;}
    for(let i=0;i<n;i++){const c=Math.max(0,sc.community_of[i]),g=nodes[i].core?.09:.06;vx[i]+=(cx[c]-x[i])*g;vy[i]+=(cy[c]-y[i])*g;
      x[i]=Math.min(W-14,Math.max(14,x[i]+Math.max(-8,Math.min(8,vx[i]))*cool));y[i]=Math.min(H-14,Math.max(14,y[i]+Math.max(-8,Math.min(8,vy[i]))*cool));}
  }
  return st.layouts[key]={x,y};
}

function spark(values,color){
  if(values.length<2)return '';
  const lo=Math.min(...values,-.01),hi=Math.max(...values,.01),pts=values.map((v,i)=>(i/(values.length-1)*100).toFixed(1)+','+(28-(v-lo)/(hi-lo||1)*26).toFixed(1)).join(' ');
  return '<svg class="crowd-spark" viewBox="0 0 100 30" preserveAspectRatio="none"><polyline points="'+pts+'" fill="none" stroke="'+color+'" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>';
}

function bar(r,total){
  const p=v=>(v/total*100).toFixed(1);
  return '<div class="crowd-bar" role="img" aria-label="'+r.oppose+' oppose, '+r.neutral+' neutral, '+r.support+' support"><i style="width:'+p(r.oppose)+'%;background:#c0392b"></i><i style="width:'+p(r.neutral)+'%;background:#b8bfc9"></i><i style="width:'+p(r.support)+'%;background:#1f9d6b"></i></div>';
}

function draw(canvas,net,scenario){
  const sc=net.scenarios[scenario],nodes=net.crowd.nodes,pos=layout(net,scenario),ri=st.round-1,ctx=canvas.getContext('2d');
  if(!ctx)return;  // no 2D canvas (e.g. headless DOM tests)
  const dpr=window.devicePixelRatio||1;
  if(canvas.width!==W*dpr){canvas.width=W*dpr;canvas.height=H*dpr;}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
  const sel=st.node,neighbors=new Set();
  if(sel!==null)for(const [a,b] of net.crowd.edges){if(a===sel)neighbors.add(b);if(b===sel)neighbors.add(a);}
  ctx.lineWidth=.6;
  for(const [a,b] of net.crowd.edges){
    const hot=sel!==null&&(a===sel||b===sel);
    if(sel!==null&&!hot&&net.crowd.edges.length>500)continue;
    ctx.strokeStyle=hot?'rgba(205,82,113,.75)':'rgba(120,130,150,.10)';ctx.lineWidth=hot?1.4:.6;
    ctx.beginPath();ctx.moveTo(pos.x[a],pos.y[a]);ctx.lineTo(pos.x[b],pos.y[b]);ctx.stroke();
  }
  st.hits=[];
  const order=nodes.map((_,i)=>i).sort((a,b)=>(nodes[a].core?1:0)-(nodes[b].core?1:0));
  for(const i of order){
    const nd=nodes[i],s=sc.stance[i][Math.min(ri,sc.stance[i].length-1)],core=nd.core;
    const rad=core?9:2.6+nd.influence*5;
    const dim=st.community!==null&&sc.community_of[i]!==st.community;
    ctx.globalAlpha=dim?.15:1;ctx.fillStyle=stanceColor(s);
    ctx.beginPath();ctx.arc(pos.x[i],pos.y[i],rad,0,7);ctx.fill();
    if(core||i===sel){ctx.lineWidth=i===sel?3:1.5;ctx.strokeStyle=i===sel?'#1b2433':'rgba(27,36,51,.55)';ctx.stroke();}
    else if(neighbors.has(i)){ctx.lineWidth=1.5;ctx.strokeStyle='rgba(205,82,113,.9)';ctx.stroke();}
    ctx.globalAlpha=1;
    if(core){ctx.fillStyle='#1b2433';ctx.font='600 10px system-ui,sans-serif';ctx.textAlign='center';ctx.fillText(nd.name,pos.x[i],pos.y[i]-13);}
    st.hits.push([i,pos.x[i],pos.y[i],Math.max(rad,6)]);
  }
}

function detail(net,scenario){
  const nd=net.crowd.nodes[st.node],sc=net.scenarios[scenario],hist=sc.stance[st.node];
  const act=sc.interactions.filter(a=>a.actor===nd.id||a.target===nd.id).slice(-6);
  const name=id=>net.crowd.nodes.find(n=>n.id===id)?.name||id;
  return '<h4>'+E(nd.name)+(nd.core?' <span class="tag">AI core persona</span>':' <span class="tag">crowd agent</span>')+'</h4><p class="micro">'+E(nd.role)+'</p>'+
   '<div class="crowd-kv"><span>Followers <b>'+sc.followers[st.node]+'</b></span><span>Community <b>'+(sc.community_of[st.node]+1)+'</b></span>'+(nd.core?'':'<span>Activity <b>'+Math.round(nd.activity*100)+'%</b></span><span>Openness <b>'+Math.round(nd.openness*100)+'%</b></span>')+'</div>'+
   '<h4>Stance journey</h4><div class="crowd-journey">'+hist.map((s,i)=>'<span style="background:'+stanceColor(s)+'" title="Round '+(i+1)+': '+s+'">'+(i+1)+'</span>').join('')+'</div><p class="micro">Currently '+stanceWord(hist[Math.min(st.round-1,hist.length-1)])+'.</p>'+
   (act.length?'<h4>Recent interactions</h4>'+act.map(a=>'<p class="micro">R'+a.round+' · '+E(name(a.actor))+' '+(ACTION[a.action]||a.action)+' '+E(name(a.target))+'</p>').join(''):'');
}

export function mountCrowd(el,net,scenario,events=[]){
  if(!el)return;
  if(!net){
    const last=events.filter(e=>e.tool==='crowd_diffusion').at(-1),spawn=events.find(e=>e.tool==='spawn_crowd');
    el.innerHTML='<div class="panel-head"><h3>Crowd network</h3><span class="tag">'+(spawn?'diffusing':'waiting')+'</span></div><div class="panel-body"><p class="micro">'+(spawn?spawn.detail.agents+' agents spawned ('+spawn.detail.core+' AI core + '+(spawn.detail.agents-spawn.detail.core)+' crowd) · '+spawn.detail.follow_edges+' follow edges.'+(last?' Round '+last.detail.round+' · mean stance '+last.detail.stats.mean:''):'The crowd network appears once the run has built the knowledge graph. Select a crowd size above before starting.')+'</p></div>';
    return;
  }
  const key=net.seed;if(st.key!==key){clearInterval(st.timer);st={...st,key,round:null,node:null,community:null,playing:false,timer:null};}
  st.scenario=scenario;
  const sc=net.scenarios[scenario],rounds=sc.rounds.length;
  if(!st.round||st.round>rounds)st.round=rounds;
  const r=sc.rounds[st.round-1],total=net.crowd.nodes.length-net.crowd.core||1;
  const cmp=net.comparison;
  el.innerHTML='<div class="panel-head"><h3>Crowd network · '+net.crowd.nodes.length+' agents</h3><span class="tag">'+net.crowd.core+' AI core + '+net.crowd.size+' crowd</span></div>'+
   '<div class="panel-body crowd-body"><div class="crowd-main"><div class="crowd-controls"><button class="btn" id="crowd-play" type="button">'+(st.playing?'Ⅱ Pause':'▶ Replay rounds')+'</button><label>Round <input id="crowd-round" type="range" min="1" max="'+rounds+'" value="'+st.round+'" aria-label="Crowd round"> <b>'+st.round+' / '+rounds+'</b></label>'+
   '<span class="crowd-legend"><i style="background:#c0392b"></i>oppose<i style="background:#b8bfc9"></i>neutral<i style="background:#1f9d6b"></i>support</span></div>'+
   '<canvas id="crowd-canvas" role="img" aria-label="Crowd follow network colored by stance" width="'+W+'" height="'+H+'"></canvas>'+
   '<p class="micro">Node colour = stance, size = influence, outlined = AI core persona. Click a node to trace its followers and stance journey; click a community to isolate it.</p></div>'+
   '<aside class="crowd-side"><h4>Scenario '+scenario+' · round '+st.round+'</h4>'+bar(r,total)+'<div class="crowd-kv"><span>Support <b>'+r.support+'</b></span><span>Neutral <b>'+r.neutral+'</b></span><span>Oppose <b>'+r.oppose+'</b></span></div>'+
   '<div class="crowd-trend"><div><small>Mean stance</small>'+spark(sc.rounds.map(x=>x.mean),'#2f6fb0')+'<b>'+r.mean+'</b></div><div><small>Polarization</small>'+spark(sc.rounds.map(x=>x.polarization),'#c58a1a')+'<b>'+r.polarization+'</b></div></div>'+
   '<p class="micro">Echo-chamber index '+r.echo_chamber+' · actions: '+Object.entries(r.actions).map(([k,v])=>k+' '+v).join(', ')+'</p>'+
   (cmp?'<div class="crowd-compare"><b>A → B</b> mean stance '+(cmp.mean_delta>=0?'+':'')+cmp.mean_delta+' · support '+(cmp.support_delta>=0?'+':'')+cmp.support_delta+' · oppose '+(cmp.oppose_delta>=0?'+':'')+cmp.oppose_delta+'</div>':'')+
   '<h4>Top influencers</h4>'+sc.influencers.slice(0,6).map(f=>{const i=net.crowd.nodes.findIndex(n=>n.id===f.id);return '<button class="crowd-row" type="button" data-crowd-node="'+i+'"><i style="background:'+stanceColor(f.stance)+'"></i><span>'+E(f.name)+(f.core?' ★':'')+'</span><small>'+f.followers+' followers</small></button>';}).join('')+
   '<h4>Communities</h4>'+sc.communities.slice(0,6).map(c=>'<button class="crowd-row '+(st.community===c.id?'on':'')+'" type="button" data-crowd-community="'+c.id+'"><i style="background:'+stanceColor(c.mean_stance)+'"></i><span>#'+(c.id+1)+' · '+E(c.dominant_cluster)+'</span><small>'+c.size+' agents</small></button>').join('')+
   (sc.bridges.length?'<h4>Bridge accounts</h4><p class="micro">'+sc.bridges.map(b=>E(b.name)+' ('+b.cross_community_followers+')').join(', ')+'</p>':'')+
   '<div class="crowd-detail" id="crowd-detail">'+(st.node!==null?detail(net,scenario):'<p class="micro">No node selected.</p>')+'</div></aside></div>'+
   '<div class="panel-body">'+net.limitations.map(l=>'<p class="micro">'+E(l)+'</p>').join('')+'</div>';
  const canvas=el.querySelector('#crowd-canvas');draw(canvas,net,scenario);
  const redraw=()=>mountCrowd(el,net,scenario,events);
  el.querySelector('#crowd-round').onchange=e=>{st.round=Number(e.target.value);redraw();};
  el.querySelector('#crowd-play').onclick=()=>{
    clearInterval(st.timer);
    if(st.playing){st.playing=false;redraw();return;}
    st.playing=true;st.round=1;redraw();
    st.timer=setInterval(()=>{if(st.round>=rounds){clearInterval(st.timer);st.playing=false;redraw();return;}st.round++;redraw();},1100);
  };
  canvas.onclick=e=>{
    const b=canvas.getBoundingClientRect(),x=(e.clientX-b.left)*W/b.width,y=(e.clientY-b.top)*H/b.height;
    let best=null,bd=1e9;for(const [i,px,py,rad] of st.hits){const d=Math.hypot(px-x,py-y);if(d<=rad+4&&d<bd){bd=d;best=i;}}
    st.node=best;redraw();
  };
  el.querySelectorAll('[data-crowd-node]').forEach(b=>b.onclick=()=>{st.node=Number(b.dataset.crowdNode);redraw();});
  el.querySelectorAll('[data-crowd-community]').forEach(b=>b.onclick=()=>{const c=Number(b.dataset.crowdCommunity);st.community=st.community===c?null:c;redraw();});
}
