/* ============================================================
   PERCEPTIVITY — product engine.
   Router + view renderers + Shape mode + rationale drawer.
   One file, shared state. Black / white / dots.
   ============================================================ */
(function(){
const A = window.APP;
const $  = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const el = (tag,cls,html)=>{ const e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; };
const CHECK = '<svg viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.2 2.4L8.5 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CROSS = '<svg viewBox="0 0 10 10" fill="none"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';

/* ---------- shared atmosphere + custom cursor ---------- */
document.body.insertAdjacentHTML('afterbegin','<div class="atmos-bg"></div><div class="atmos-stars"></div>');
(function cursor(){
  if (matchMedia('(hover:none)').matches) return;
  const dot=el('div','cursor-dot'), ring=el('div','cursor-ring');
  document.body.append(dot,ring);
  let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my,shown=false;
  addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`;if(!shown){shown=true;dot.style.opacity=ring.style.opacity=1;}},{passive:true});
  addEventListener('mouseleave',()=>{dot.style.opacity=ring.style.opacity=0;shown=false;});
  (function follow(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;requestAnimationFrame(follow);})();
  const hot='a,button,.btn,.btn-sm,.chip,input,textarea,select,[role=button],.heat-cell,.g-node,.camp,.gapc,.seg,.rec-head,.lsg';
  addEventListener('mouseover',e=>{if(e.target.closest(hot))ring.classList.add('hot');});
  addEventListener('mouseout', e=>{if(e.target.closest(hot))ring.classList.remove('hot');});
})();

/* ============================================================
   ROUTER
   ============================================================ */
const rendered = {};
function go(view){
  $$('.nav-item').forEach(n=>n.classList.toggle('on', n.dataset.view===view));
  $$('.view').forEach(v=>v.classList.toggle('on', v.dataset.view===view));
  if(!rendered[view]){ (RENDER[view]||(()=>{}))(); rendered[view]=true; }
  document.querySelector('.main').scrollTo?.({top:0,behavior:'smooth'});
  window.scrollTo({top:0,behavior:'smooth'});
  location.hash = '#'+view;
}
$$('.nav-item,[data-view]').forEach(b=>{ if(b.dataset.view) b.addEventListener('click',()=>go(b.dataset.view)); });

/* rationale drawer */
function openWhy(key){
  const map={home:'The board number',graph:'The brand graph',diagnose:'Diagnosis',prove:'Prove',learn:'System of record'};
  $('#whyTitle').textContent = map[key]||'Rationale';
  $('#whyBody').textContent = A.rationale[key]||'';
  $('#why').classList.add('on'); $('#whyScrim').classList.add('on');
}
function closeWhy(){ $('#why').classList.remove('on'); $('#whyScrim').classList.remove('on'); }
$('#whyClose').addEventListener('click',closeWhy);
$('#whyScrim').addEventListener('click',closeWhy);
function whyBtn(key){ return `<button class="why-btn" data-why="${key}">Why this works</button>`; }
document.addEventListener('click',e=>{ const w=e.target.closest('[data-why]'); if(w) openWhy(w.dataset.why); });

/* small helpers */
function vhead(kicker,title,lede,whyKey,extra){
  return `<div class="vh">
    <div><div class="kicker-row"><span class="kicker">${kicker}</span></div>
      <h1>${title}</h1>${lede?`<p class="lede">${lede}</p>`:''}</div>
    <div class="vh-right">${extra||''}${whyKey?whyBtn(whyKey):''}</div>
  </div>`;
}

/* ============================================================
   D · HOME — the board number
   ============================================================ */
function boardTrendSVG(){
  const b=A.board, W=520,H=120,pad=8;
  const all=[...b.series, b.forecast[1], b.forecast[2]]; // 10 pts
  const lo=35, hi=56, N=all.length;
  const X=i=>pad+(i/(N-1))*(W-pad*2);
  const Y=v=>H-pad-((v-lo)/(hi-lo))*(H-pad*2);
  const aPts=b.series.map((v,i)=>[X(i),Y(v)]);
  const aPath=aPts.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  // forecast points: join from last actual (index7) through index8,9
  const fIdx=[7,8,9], fVal=[b.series[7], b.forecast[1], b.forecast[2]];
  const fPts=fIdx.map((ix,k)=>[X(ix),Y(fVal[k])]);
  const fPath=fPts.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  // band over forecast region
  const band=b.forecastBand; // [[lo,hi]x3] at idx 7,8,9
  const up=fIdx.map((ix,k)=>[X(ix),Y(band[k][1])]);
  const dn=fIdx.map((ix,k)=>[X(ix),Y(band[k][0])]);
  const bandPath=`M${up.map(p=>p.join(',')).join(' L')} L${dn.slice().reverse().map(p=>p.join(',')).join(' L')} Z`;
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
    <path d="${bandPath}" fill="rgba(255,255,255,.07)"/>
    <path d="${aPath}" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${fPath}" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.6" stroke-dasharray="3 4" stroke-linecap="round"/>
    ${aPts.map(p=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="2.2" fill="#fff"/>`).join('')}
    <circle cx="${fPts[2][0].toFixed(1)}" cy="${fPts[2][1].toFixed(1)}" r="2.6" fill="none" stroke="#fff" stroke-width="1.4"/>
  </svg>`;
}
RENDER_home();
function RENDER_home(){
  const b=A.board, delta=b.value-b.baseline;
  const tiles=A.tiles.map(t=>{
    const arrow=t.dir==='up'?'▲':'▼';
    return `<div class="tile"><span class="tk">${t.k}</span>
      <div class="tv">${t.v}<small>${t.unit}</small></div>
      <span class="tsub">${t.sub}</span>
      <span class="td">${arrow} from ${t.base}${t.unit} · 8w</span></div>`;
  }).join('');

  const camps=A.campaigns.map(c=>`<button class="camp" data-camp="${c.gap}">
    <span class="cs"><span class="dot"></span>${c.stage}</span>
    <span class="ct">${c.title}</span>
    <span class="cl">${c.lift}</span></button>`).join('');

  // heatmap
  let rows='',grid='';
  A.ENGINES.forEach(e=>{
    rows+=`<div class="heat-rl">${e}</div>`;
    A.heatmap[e].forEach((v,ti)=>{
      grid+=`<div class="heat-cell" style="background:rgba(255,255,255,${(0.05+v*0.8).toFixed(3)})"><span class="tip">${e} · ${A.topics[ti]} · ${Math.round(v*100)}%</span></div>`;
    });
  });
  const cols=A.topics.map(t=>`<div>${t}</div>`).join('');
  const maxS=Math.max(...A.answerShare.map(s=>s.v));
  const share=A.answerShare.map(s=>`<div class="share-row${s.me?' me':''}">
    <span class="nm">${s.name}${s.me?' · you':''}</span>
    <div class="bar" style="--w:${(s.v/maxS*100).toFixed(0)}%"></div>
    <span class="pct">${s.v}%</span></div>`).join('');

  $('#view-home').innerHTML =
    vhead('Sense · the operating picture','Home', 'The always-on picture. One number for the board; the detail beneath it for you.', 'home')+
    `<div class="board">
      <div class="board-hero">
        <div class="board-top">
          <div><span class="mono">${b.label} · the board number</span></div>
          <span class="pill live">Live</span>
        </div>
        <div class="board-num">${b.value}<small>${b.unit}</small></div>
        <div class="board-delta">▲ ${delta} pts over 8 weeks · forecast ${b.forecast[2]} in 3w</div>
        <div class="board-trend">${boardTrendSVG()}</div>
        <div class="board-axis"><span>8 weeks ago</span><span>now</span><span>forecast →</span></div>
        <div class="board-note">${b.note} Forecast band is 80% confidence — direction and uncertainty, not a vanity spike.</div>
      </div>
      <div class="tiles">${tiles}</div>
    </div>

    <div class="mod" style="margin-bottom:22px">
      <div class="mod-head"><div><span class="kicker">Launched from gaps</span><h3 style="margin-top:10px">Active campaigns</h3></div>
        <span class="mono">${A.campaigns.length} running · one system</span></div>
      <div class="camp-strip">${camps}</div>
      <div class="mod-foot">Each campaign was launched from a diagnosed gap in Shape. It writes its result back here and into the system of record.</div>
    </div>

    <div class="grid-2">
      <div class="mod">
        <div class="mod-head"><div><span class="kicker">Sense</span><h3 style="margin-top:10px">Visibility heatmap</h3></div><span class="mono">7 engines × 6 topics</span></div>
        <div class="heat-wrap"><div class="heat-rows">${rows}</div><div><div class="heat-grid">${grid}</div><div class="heat-cols">${cols}</div></div></div>
        <div class="mod-foot">Illustrative demo data. Cell strength = VinFast presence in answers for that topic on that engine.</div>
      </div>
      <div class="mod">
        <div class="mod-head"><div><span class="kicker">Share of voice</span><h3 style="margin-top:10px">Answer share vs rivals</h3></div><span class="mono">Category answers</span></div>
        <div class="share-list">${share}</div>
        <div class="mod-foot">Illustrative demo data. A new entrant punching above its footprint — the gaps are where the next points sit.</div>
      </div>
    </div>`;

  $$('#view-home [data-camp]').forEach(c=>c.addEventListener('click',()=>{ go('diagnose'); setTimeout(()=>openShape(c.dataset.camp),120); }));
}

/* ============================================================
   E · BRAND GRAPH
   ============================================================ */
const RENDER={};
RENDER.graph=function(){
  const g=A.graph, W=760,H=560;
  const pos=id=>{ const n=g.nodes.find(x=>x.id===id); return [n.x/100*W, n.y/100*H]; };
  const edges=g.edges.map(([a,b])=>{ const p1=pos(a),p2=pos(b); return `<line class="g-edge" data-a="${a}" data-b="${b}" x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}"/>`; }).join('');
  const nodes=g.nodes.map(n=>{
    const [x,y]=[n.x/100*W,n.y/100*H];
    const r=n.type==='brand'?13:(n.type==='attribute'?8:6);
    const dy=n.type==='brand'?-22:(y<60?-15:22);
    return `<g class="g-node ${n.state} ${n.type}" data-id="${n.id}" transform="translate(${x},${y})">
      <circle class="ring" r="${r+5}"></circle>
      <circle class="core" r="${r}"></circle>
      <text y="${dy}">${n.label}</text></g>`;
  }).join('');

  $('#view-graph').innerHTML =
    vhead('Map · visualise the brand','Brand graph', 'Every model, attribute, claim and source shaping VinFast in AI — one living object. Select a node to see the claim, the engines repeating it, and the source feeding it.', 'graph',`<span class="pill live">Live</span>`)+
    `<div class="graph-grid">
      <div class="graph-stage">
        <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">${edges}${nodes}</svg>
        <div class="graph-legend">
          <span><i class="g"></i> Grounded</span>
          <span><i class="d"></i> Drifting</span>
          <span><i class="x"></i> Gap</span>
        </div>
      </div>
      <div class="mod"><div class="gd" id="gDetail"></div></div>
    </div>`;

  const svg=$('#view-graph svg');
  function select(id){
    $$('.g-node',svg).forEach(n=>n.classList.toggle('sel', n.dataset.id===id));
    $$('.g-edge',svg).forEach(e=>e.classList.toggle('hot', e.dataset.a===id||e.dataset.b===id));
    paintDetail(id);
  }
  $$('.g-node',svg).forEach(n=>n.addEventListener('click',()=>select(n.dataset.id)));
  function paintDetail(id){
    const n=A.graph.nodes.find(x=>x.id===id);
    const d=A.graph.detail[id];
    const det=$('#gDetail');
    if(!d){ det.innerHTML=`<div class="gd-head"><div><div class="gd-name">${n.label}</div><div class="gd-type">${n.type} · ${n.state}</div></div></div><p class="muted" style="color:var(--muted);font-size:14px;line-height:1.6">A leaf in the graph. Select an attribute node to see its grounded claim, the engines repeating it, and the source feeding it.</p>`; return; }
    const stateWord={grounded:'Grounded',drift:'Drifting',gap:'Gap'}[n.state];
    const gapCTA = (n.state==='gap'||n.state==='drift') ? `<div class="gd-cta"><button class="btn-sm primary" data-fix="${nodeToGap(id)}">Shape this gap →</button></div>` : '';
    det.innerHTML=`
      <div class="gd-head">
        <div><div class="gd-name">${n.label}</div><div class="gd-type">${d.type}</div></div>
        <span class="pill ${n.state==='gap'?'road':'live'}">${stateWord}</span>
      </div>
      <div class="gd-stats">
        <div class="gd-stat"><div class="k">Grounded</div><div class="v">${d.grounded}</div></div>
        <div class="gd-stat"><div class="k">Engines</div><div class="v">${d.engines}<small style="font-size:.5em;color:var(--muted)"> /7</small></div></div>
      </div>
      <div class="gd-block"><div class="gd-lab">The claim AI makes</div><p>${d.claim}</p></div>
      <div class="gd-block"><div class="gd-lab">Repeated by</div><p class="muted">${d.repeated}</p></div>
      <div class="gd-block"><div class="gd-lab">${d.source}</div>
        <div class="gd-facts">${d.facts.map(f=>`<div class="gd-fact">${f}</div>`).join('')}</div></div>
      ${gapCTA}`;
    det.querySelector('[data-fix]')?.addEventListener('click',e=>openShape(e.target.dataset.fix));
  }
  select('brand');
};
function nodeToGap(nodeId){ const g=A.gaps.find(x=>x.node===nodeId); return g?g.id:'g_service'; }

/* ============================================================
   F · DIAGNOSE
   ============================================================ */
RENDER.diagnose=function(){
  const list=A.gaps.map(g=>`<div class="gapc">
    <div class="rank">${String(g.rank).padStart(2,'0')}</div>
    <div class="gmain">
      <div class="gtitle">${g.title}</div>
      <div class="gdetail">${g.detail}</div>
      <div class="gmeta">
        <span>Node · <b>${g.node}</b></span>
        <span>Seen in · <b>${g.engines.join(' · ')}</b></span>
        <span>Query share · <b>${g.queryShare}</b></span>
        <span>Segment · <b>${g.segment}</b></span>
        <span>Confidence · <b>${g.conf}</b> · Effort <b>${g.effort}</b></span>
      </div>
    </div>
    <div class="gright">
      <div class="glift">+${g.lift}<small>pp forecast lift</small></div>
      <button class="btn-sm primary" data-fix="${g.id}">Shape this gap →</button>
    </div>
  </div>`).join('');

  $('#view-diagnose').innerHTML =
    vhead('Diagnose · where to shape next','Diagnosis', 'Ranked perception gaps, ordered by leverage. Every gap is a launch point — Shape opens pre-loaded with the node, the audience and the forecast.', 'diagnose',`<span class="pill live">Live</span>`)+
    `<div class="gaps-list">${list}</div>
     <div class="mod-foot" style="margin-top:20px">Illustrative demo data. Forecast lift in percentage points of category answer share, before any spend.</div>`;

  $$('#view-diagnose [data-fix]').forEach(b=>b.addEventListener('click',()=>openShape(b.dataset.fix)));
};

/* ============================================================
   G–H · SHAPE MODE — gap → audience → brief → review gate → live
   ============================================================ */
const STAGES=['Gap','Audience','Brief','Review','Live'];
let curGap=null, curStage=0, gateState={};
function buildSRail(){
  $('#srail').innerHTML = STAGES.map((s,i)=>`
    <button class="sstep ${i===curStage?'on':''} ${i<curStage?'done':''}" data-s="${i}">
      <div class="stop"><span class="stick">${CHECK}</span><span class="snum">0${i+1}</span></div>
      <span class="slbl">${s}</span>
      <div class="sbar"></div>
    </button>`).join('');
  $$('#srail .sstep').forEach(b=>b.addEventListener('click',()=>gotoStage(+b.dataset.s)));
}
function gotoStage(i){ curStage=i; buildSRail(); paintStage(); $('#shapeBody').scrollTo?.({top:0,behavior:'smooth'}); }
function openShape(gapId){
  curGap=A.gaps.find(g=>g.id===gapId)||A.gaps[0];
  curStage=0; gateState={};
  $('#shapeGap').textContent=curGap.title;
  buildSRail(); paintStage();
  $('#shape').classList.add('on'); document.body.style.overflow='hidden';
}
$('#shapeClose').addEventListener('click',()=>{ $('#shape').classList.remove('on'); document.body.style.overflow=''; });

function navRow(){
  const prev = curStage>0 ? `<button class="btn-sm ghost" data-nav="prev">← ${STAGES[curStage-1]}</button>`:'<span></span>';
  const next = curStage<STAGES.length-1 ? `<button class="btn-sm primary" data-nav="next">Continue · ${STAGES[curStage+1]} →</button>`:`<button class="btn-sm primary" data-nav="done">Back to dashboard →</button>`;
  return `<div class="gate-actions" style="margin-top:30px;border-top:1px dashed var(--line);padding-top:22px">
    <span class="gate-verdict">The loop is re-enterable — jump to any stage from the rail above.</span>
    <div class="gate-btns">${prev}${next}</div></div>`;
}
function wireNav(){
  $$('#shapeBody [data-nav]').forEach(b=>b.addEventListener('click',()=>{
    if(b.dataset.nav==='prev') gotoStage(curStage-1);
    else if(b.dataset.nav==='next') gotoStage(curStage+1);
    else { $('#shape').classList.remove('on'); document.body.style.overflow=''; go('prove'); }
  }));
}

function paintStage(){
  const body=$('#shapeBody');
  if(curStage===0) body.innerHTML=stageGap();
  else if(curStage===1) body.innerHTML=stageAudience();
  else if(curStage===2) body.innerHTML=stageBrief();
  else if(curStage===3) body.innerHTML=stageReview();
  else body.innerHTML=stageLive();
  postPaint();
  wireNav();
}

function ctxCards(){
  return `<div class="ctx-cards">
    <div class="ctx-card"><div class="k">Carried from diagnosis · gap node</div><div class="v"><b>${curGap.node}</b> · seen in ${curGap.engines.join(', ')}</div></div>
    <div class="ctx-card"><div class="k">Carried from dashboard · audience</div><div class="v">${curGap.segment}</div></div>
    <div class="ctx-card"><div class="k">Forecast · before spend</div><div class="v"><b>+${curGap.lift}pp</b> · ${curGap.conf} confidence</div></div>
  </div>`;
}
function stageGap(){
  return `<div class="shape-pane on">
    <div class="spane-head"><div class="k">Stage 01 · the entry point is the gap</div>
      <h2>${curGap.title}</h2>
      <p>${curGap.detail}</p></div>
    ${ctxCards()}
    <div class="mod"><div class="mod-head"><div><span class="kicker">Why start here</span><h3 style="margin-top:10px">No blank page</h3></div></div>
      <p style="color:var(--muted);font-size:14.5px;line-height:1.7;max-width:72ch">You did not start from "define an audience." You started from the highest-leverage perception gap, with the node, the audience and the forecast already loaded. Market = <b style="color:var(--ink)">${curGap.market}</b>. Buyers raise this in <b style="color:var(--ink)">${curGap.queryShare}</b> of VinFast queries.</p>
    </div>
    ${navRow()}
  </div>`;
}
function stageAudience(){
  const a=A.audience;
  const segs=a.segments.map((s,i)=>`<div class="seg ${s.on?'':'off'}" data-seg="${i}">
    <div class="seg-top"><div><div class="seg-name">${s.name}</div><div class="seg-meta">Reach ${s.reach} · fit ${s.fit}%</div></div>
      <button class="seg-tog">${s.on?'● Included':'Include'}</button></div>
    <div class="seg-note">${s.note}</div>
    <div class="seg-fit"><span class="fl">Segment fit</span><div class="bar" style="--w:${s.fit}%"></div><span class="fv">${s.fit}%</span></div>
  </div>`).join('');
  const demo=a.demographics.map(d=>`<div class="ctx-card"><div class="k">${d.k}</div><div class="v">${d.v}</div></div>`).join('');
  return `<div class="shape-pane on">
    <div class="spane-head"><div class="k">Stage 02 · audience carried in</div>
      <h2>Target audience</h2>
      <p>The persona model came in from the dashboard — you are tuning it, not defining it from scratch. Toggling a segment recomputes downstream reach and the held-out test design.</p></div>
    <div class="ctx-cards" style="grid-template-columns:repeat(4,1fr)">${demo}</div>
    <div class="mod"><div class="mod-head"><div><span class="kicker">Persona segments · India</span><h3 style="margin-top:10px">Who this campaign speaks to</h3></div><span class="mono" id="segReach">Reach · ${a.reach}</span></div>
      <div class="seg-list">${segs}</div>
      <div class="mod-foot">Segments modelled on Indian demographics + psychographics. Live capability.</div></div>
    ${navRow()}
  </div>`;
}
function stageBrief(){
  return `<div class="shape-pane on">
    <div class="spane-head"><div class="k">Stage 03 · the brief</div>
      <h2>Campaign brief</h2>
      <p>Generated from the gap and the graph node, editable by you. This brief drives every draft and is attached to the experiment and the system of record.</p></div>
    <div class="brief-grid">
      <div class="brief-field"><div class="bk">Objective</div><textarea rows="3">Close the ${curGap.node} gap: get ${curGap.engines.join(' & ')} and peers to describe VinFast's coverage accurately, grounded to our source of truth.</textarea></div>
      <div class="brief-field"><div class="bk">Primary metric</div><div class="bv">Answer share on ${curGap.node} prompts</div>
        <div class="bk" style="margin-top:16px">Forecast lift</div><div class="bv"><b style="font-family:var(--fontDisplay);font-size:20px">+${curGap.lift}pp</b> · ${curGap.conf} confidence</div></div>
      <div class="brief-field"><div class="bk">Message · must stay on-brand</div><textarea rows="3">Confident, plain, no superlatives. Lead with verifiable coverage and access. Counter the "unproven / lease-only" framing with grounded facts, never spin.</textarea></div>
      <div class="brief-field"><div class="bk">Tracks to draft</div><div class="bv">Owned page + schema · Earned placement · Generative creative <span class="pill road" style="margin-left:6px">Roadmap</span></div>
        <div class="bk" style="margin-top:16px">Languages</div><div class="bv">English · Hindi · Tamil</div></div>
    </div>
    ${navRow()}
  </div>`;
}
function stageReview(){
  const drafts=A.drafts.map((d,i)=>{
    const st=gateState[d.id]||'pending';
    const checks=d.checks.map(c=>`<div class="gcheck ${c.ok?'ok':'no'}"><span class="gi">${c.ok?CHECK:CROSS}</span><span class="gk">${c.k}</span><span class="gn">${c.note}</span></div>`).join('');
    const allOk=d.checks.every(c=>c.ok);
    let actions;
    if(st==='approved') actions=`<span class="draft-status">${CHECK} Approved · live next scan</span>`;
    else if(st==='rejected') actions=`<span class="draft-status" style="color:var(--muted)">Rejected · returned to draft</span>`;
    else actions=`<div class="gate-btns">
      <button class="btn-sm ghost" data-reject="${d.id}">Reject</button>
      <button class="btn-sm primary" data-approve="${d.id}" ${allOk?'':'data-warn="1"'}>${allOk?'Approve & publish':'Approve with flag'}</button></div>`;
    const verdict = allOk?'All checks pass — grounded and on-brand.':'One check failed — human decision required.';
    return `<div class="draftc ${i===0?'hero':''} ${st==='approved'?'approved':''} ${st==='rejected'?'rejected':''}" data-draft="${d.id}">
      <div class="draft-head"><div><div class="dt">${d.title}</div><div class="dc">${d.track} · ${d.channel}</div></div>
        <span class="pill ${d.live?'live':'road'}">${d.live?'Live track':'Roadmap'}</span></div>
      <div class="draft-body">
        <p class="dbody">${d.body}</p>
        <div class="gate">
          <div class="gate-lab">Brand-guideline + graph-grounding review gate</div>
          <div class="gate-checks">${checks}</div>
          <div class="gate-actions"><span class="gate-verdict"><b>${verdict}</b> Grounds node · <b>${d.groundsNode}</b></span>${actions}</div>
        </div>
      </div>
    </div>`;
  }).join('');
  return `<div class="shape-pane on">
    <div class="spane-head"><div class="k">Stage 04 · the hero · human-in-the-loop</div>
      <h2>Review gate</h2>
      <p>Nothing ships lights-out. Every draft — owned, earned, or generative — is checked for on-brand voice and grounding-to-graph, then a human approves or rejects. This controlled-quality gate is the differentiation, not the content generation.</p></div>
    <div class="draft-list">${drafts}</div>
    ${navRow()}
  </div>`;
}
function stageLive(){
  const approved=A.drafts.filter(d=>gateState[d.id]==='approved');
  const list = approved.length? approved.map(d=>`<div class="ctx-card"><div class="k">Shipped · grounds ${d.groundsNode}</div><div class="v"><b>${d.title}</b></div></div>`).join('')
    : `<div class="ctx-card"><div class="k">Nothing approved yet</div><div class="v">Go back to the review gate and approve at least one draft to ship it.</div></div>`;
  return `<div class="shape-pane on">
    <div class="spane-head"><div class="k">Stage 05 · live</div>
      <h2>Shipped to the answer layer</h2>
      <p>Approved work goes live and is re-scanned across all seven engines. The result writes back to the dashboard and into the system of record — and a held-out experiment is already defined to attribute the lift.</p></div>
    <div class="ctx-cards" style="grid-template-columns:1fr 1fr">${list}</div>
    <div class="mod" style="margin-top:6px"><div class="mod-head"><div><span class="kicker">Next · Prove</span><h3 style="margin-top:10px">Attribution is already designed</h3></div></div>
      <p style="color:var(--muted);font-size:14.5px;line-height:1.7;max-width:72ch">Because the experiment was defined before the spend, lift will be measured against a held-out control — not asserted. Continue to Prove to see the test and, once a cycle completes, predicted vs actual with confidence bands.</p></div>
    ${navRow()}
  </div>`;
}
function postPaint(){
  // audience toggles
  $$('#shapeBody .seg').forEach(s=>{
    s.querySelector('.seg-tog').addEventListener('click',()=>{
      s.classList.toggle('off');
      s.querySelector('.seg-tog').textContent = s.classList.contains('off')?'Include':'● Included';
    });
  });
  // gate actions
  $$('#shapeBody [data-approve]').forEach(b=>b.addEventListener('click',()=>{ gateState[b.dataset.approve]='approved'; paintStage(); }));
  $$('#shapeBody [data-reject]').forEach(b=>b.addEventListener('click',()=>{ gateState[b.dataset.reject]='rejected'; paintStage(); }));
}

/* ============================================================
   I/J · PROVE — experiment + measurement
   ============================================================ */
RENDER.prove=function(){
  const e=A.experiment, m=A.measure;
  const guards=e.guardrails.map(g=>`<span class="g">${g}</span>`).join('');
  // band viz
  const bandViz=(()=>{
    const W=320,H=54,pad=6, lo=0, hi=6;
    const X=v=>pad+((v-lo)/(hi-lo))*(W-pad*2);
    const [bl,bh]=m.headline.band;
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="width:100%;height:100%">
      <line x1="${pad}" y1="${H/2}" x2="${W-pad}" y2="${H/2}" stroke="rgba(255,255,255,.12)" stroke-width="1"/>
      <rect x="${X(bl)}" y="${H/2-9}" width="${X(bh)-X(bl)}" height="18" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.3)" stroke-dasharray="3 3"/>
      <line x1="${X(m.headline.predicted)}" y1="${H/2-14}" x2="${X(m.headline.predicted)}" y2="${H/2+14}" stroke="rgba(255,255,255,.5)" stroke-width="1.4" stroke-dasharray="2 3"/>
      <circle cx="${X(m.headline.actual)}" cy="${H/2}" r="5" fill="#fff"/>
      <text x="${X(m.headline.actual)}" y="${H/2-18}" fill="#fff" font-family="var(--fontMono)" font-size="9" text-anchor="middle">actual</text>
      <text x="${X(m.headline.predicted)}" y="${H/2+26}" fill="rgba(255,255,255,.6)" font-family="var(--fontMono)" font-size="9" text-anchor="middle">predicted</text>
    </svg>`;
  })();
  const maxAfter=Math.max(...m.perEngine.map(p=>p.after));
  const engines=m.perEngine.map(p=>`<div class="eng-row"><span class="en">${p.engine}</span>
    <div class="eng-bars"><div class="eng-track"></div><div class="eng-before" style="--b:${(p.before/maxAfter*100).toFixed(0)}%"></div><div class="eng-after" style="--a:${(p.after/maxAfter*100).toFixed(0)}%"></div></div></div>`).join('');
  const tMax=Math.max(m.tvc.treatment,m.tvc.control);
  const segs=m.segments.map(s=>`<div class="sr"><span class="srn">${s.name}</span><span class="srr">${s.reach} reached</span><span class="srd">${s.delta}</span></div>`).join('');

  $('#view-prove').innerHTML =
    vhead('Prove · attribute &amp; A/B test','Prove', 'Designed before the spend, measured against a held-out control. Predicted vs actual with confidence bands — lift attributed, never asserted.', 'prove',`<span class="pill live">Live</span>`)+
    `<div class="prove-grid">
      <div class="exp">
        <div class="mod-head"><div><span class="kicker">Experiment · defined before going live</span><h3 style="margin-top:10px">${e.name}</h3></div><span class="pill live">A/B held-out</span></div>
        <p class="exp-hyp">${e.hypothesis}</p>
        <div class="exp-arms">
          <div class="arm"><div class="at"><span class="dot"></span>${e.treatment.label}</div><div class="ad">${e.treatment.desc}</div><div class="ar">${e.treatment.reach}</div></div>
          <div class="arm control"><div class="at">${e.control.label}</div><div class="ad">${e.control.desc}</div><div class="ar">${e.control.reach}</div></div>
        </div>
        <div class="exp-meta">
          <div class="em"><div class="k">Design</div><div class="v">${e.design}</div></div>
          <div class="em"><div class="k">Primary metric</div><div class="v">${e.primary}</div></div>
          <div class="em"><div class="k">Duration</div><div class="v">${e.duration}</div></div>
        </div>
        <div class="exp-meta" style="grid-template-columns:1fr;margin-top:16px"><div class="em"><div class="k">Guardrails</div><div class="guard">${guards}</div></div></div>
      </div>

      <div class="meas-top">
        <div class="mod">
          <div class="mod-head"><div><span class="kicker">Measurement · ${m.headline.metric}</span><h3 style="margin-top:10px">Predicted vs actual</h3></div></div>
          <div class="pva-hero">
            <div class="pva-big">
              <div class="blk pred"><div class="k">Predicted</div><div class="v">+${m.headline.predicted}<small>${m.headline.unit}</small></div></div>
              <div class="blk"><div class="k">Actual</div><div class="v">+${m.headline.actual}<small>${m.headline.unit}</small></div></div>
            </div>
            <div class="band-viz">${bandViz}</div>
            <div class="pva-band">80% confidence band <b>+${m.headline.band[0]} to +${m.headline.band[1]}${m.headline.unit}</b></div>
          </div>
          <div style="margin-top:22px"><span class="kicker">Treatment vs held-out control</span>
            <div class="tvc" style="margin-top:14px">
              <div class="tvc-row t"><span class="l">Treatment</span><div class="bar" style="--w:${(m.tvc.treatment/tMax*100).toFixed(0)}%"></div><span class="v">+${m.tvc.treatment}pp</span></div>
              <div class="tvc-row c"><span class="l">Control</span><div class="bar" style="--w:${(m.tvc.control/tMax*100).toFixed(0)}%"></div><span class="v">+${m.tvc.control}pp</span></div>
            </div>
            <div class="mod-foot" style="border-top:none;padding-top:10px">${m.tvc.note}</div>
          </div>
        </div>
        <div class="mod">
          <div class="mod-head"><div><span class="kicker">Re-scan · 7 engines</span><h3 style="margin-top:10px">Answer share · before → after</h3></div></div>
          <div class="eng-list">${engines}</div>
          <div style="margin-top:22px"><span class="kicker">Segment reach attributed</span>
            <div class="seg-reach" style="margin-top:14px">${segs}</div></div>
          <div class="mod-foot">${m.caveat}</div>
        </div>
      </div>
    </div>`;
};

/* ============================================================
   K · LEARN — system of record
   ============================================================ */
RENDER.learn=function(){
  const recs=A.record.map(r=>`<div class="recc" data-rec="${r.id}" data-text="${(r.title+' '+r.topic+' '+r.gap+' '+r.learning).toLowerCase()}">
    <div class="rec-head">
      <span class="rec-q">${r.quarter}</span>
      <div><div class="rec-t">${r.title}<span class="topic">${r.topic}</span></div></div>
      <div class="rec-right">
        <div class="rec-conf"><div class="cv">${r.confidence}</div><div class="ck">Model conf.</div></div>
        <span class="rec-status">${r.status}</span>
        <span class="rec-chev">▾</span>
      </div>
    </div>
    <div class="rec-detail">
      <div class="rec-grid">
        <div class="rec-cell"><div class="rk">The gap</div><div class="rv">${r.gap}</div></div>
        <div class="rec-cell"><div class="rk">Brief</div><div class="rv">${r.brief}</div></div>
        <div class="rec-cell"><div class="rk">Held-out control</div><div class="rv">${r.control}</div></div>
        <div class="rec-cell"><div class="rk">Result</div><div class="rv">${r.result}</div></div>
        <div class="rec-cell" style="grid-column:1/-1"><div class="rk">Learning</div><div class="rv learn">${r.learning}</div></div>
      </div>
      <div class="rec-pva">
        <div class="pv pred"><div class="k">Predicted</div><div class="v">+${r.predicted}pp</div></div>
        <div class="pv"><div class="k">Actual</div><div class="v">${r.actual!=null?'+'+r.actual+'pp':'—'}</div></div>
        <div class="pv"><div class="k">Cycle confidence</div><div class="v">${r.confidence}/100</div></div>
      </div>
    </div>
  </div>`).join('');

  const suggest=['pricing claims','service network','what moved safety','resale trust'].map(s=>`<button class="lsg" data-q="${s}">${s}</button>`).join('');

  $('#view-learn').innerHTML =
    vhead('Learn · the copilot\u2019s memory','System of record', 'Every past cycle — brief, experiment, control, result, learning — kept and searchable. Model confidence rises as cycles accumulate.', 'learn',`<span class="pill live">Live</span>`)+
    `<div class="learn-search"><span class="si"></span><input id="recSearch" placeholder="Ask the record — e.g. what moved answer-share for pricing claims last quarter?"></div>
     <div class="learn-suggest">${suggest}</div>
     <div class="rec-list">${recs}</div>
     <div class="mod-foot" style="margin-top:20px">Illustrative demo data. Predicted vs actual logged per cycle; confidence is the model's self-rated certainty for that topic.</div>`;

  $$('#view-learn .rec-head').forEach(h=>h.addEventListener('click',()=>h.parentElement.classList.toggle('open')));
  const search=$('#recSearch');
  function filter(q){ q=q.toLowerCase().trim(); $$('#view-learn .recc').forEach(c=>c.classList.toggle('hide', q && !c.dataset.text.includes(q.split(' ').filter(w=>w.length>3)[0]||q))); }
  search.addEventListener('input',()=>filter(search.value));
  $$('#view-learn .lsg').forEach(b=>b.addEventListener('click',()=>{ search.value=b.dataset.q; filter(b.dataset.q); }));
};

/* ============================================================
   INTEGRATIONS
   ============================================================ */
RENDER.integrations=function(){
  const groups=A.integrations.map(g=>{
    const conn=g.items.filter(i=>i.status==='Connected').length;
    const cards=g.items.map(i=>`<div class="int-card"><div class="top"><h5>${i.name}</h5><span class="pill ${i.status==='Connected'?'live':''}">${i.status==='Connected'?'Connected':'Available'}</span></div><p>${i.desc}</p></div>`).join('');
    return `<div class="int-grp"><div class="int-grp-h"><h4>${g.group}</h4><span class="mono">${conn}/${g.items.length} connected</span></div><div class="int-grid">${cards}</div></div>`;
  }).join('');
  $('#view-integrations').innerHTML =
    vhead('Shared · controlled execution','Integrations','Where Shape\u2019s approved actions land. Connected once, used across every pillar — owned, earned and source-of-truth.', null,`<span class="pill live">Live</span>`)+
    `<div class="int-groups">${groups}</div>
     <div class="mod-foot" style="margin-top:20px">Sample connections. Production includes role-based access, SSO and audit logs.</div>`;
};

/* ---------- boot ---------- */
const start=(location.hash||'#home').replace('#','');
if(document.querySelector(`.view[data-view="${start}"]`)) go(start); else go('home');
})();
