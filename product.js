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
   SHAPE (nav home) — the campaign engine: hosts the loop
   ============================================================ */
const LOOP=['Listen','Create','Review','Publish','Measure'];
const LOOP_DESC=['what AI says','grounded ads','human gate','channels','lift'];
RENDER.shape=function(){
  const spine=LOOP.map((s,i)=>`<div class="loopnode"><span class="dotc"></span><span class="ld">${s}</span><span class="ll">${LOOP_DESC[i]}</span></div>`).join('');
  const stageMap={ c_service:4, c_resale:2, c_price:0 };
  const camps=A.campaigns.map(c=>{
    const si=stageMap[c.id]!=null?stageMap[c.id]:0;
    const prog=LOOP.map((s,i)=>`<span class="cl-node ${i<=si?'on':''}"></span>`).join('');
    return `<button class="camp" data-open="${c.gap}" data-stage="${si}">
      <span class="cs"><span class="dot"></span>${c.stage}</span>
      <span class="ct">${c.title}</span>
      <div class="camp-loop">${prog}</div>
      <span class="cl">${c.lift} · at ${LOOP[si]}</span>
    </button>`;
  }).join('');
  const gaps=A.gaps.map(g=>`<div class="gap-row">
    <div class="gr-main"><div class="gr-t">${g.title}</div><div class="gr-m">Node <b>${g.node}</b> · +${g.lift}pp forecast · ${g.conf} confidence · ${g.queryShare} of queries</div></div>
    <button class="btn-sm primary" data-open="${g.id}" data-stage="0">Shape this gap →</button></div>`).join('');

  $('#view-shape').innerHTML =
    vhead('Shape · the campaign engine','Shape', 'The execution loop, always launched from a diagnosed gap — never a parallel site. Listen to what AI says, create grounded creative, gate it, publish, and measure the lift. One re-enterable system.', 'shape',`<span class="pill live">Live</span>`)+
    `<div class="mod" style="margin-bottom:22px">
      <div class="mod-head"><div><span class="kicker">The loop</span><h3 style="margin-top:10px">Listen → Create → Review → Publish → Measure</h3></div>
        <span class="pill road">Autonomous publishing · roadmap</span></div>
      <div class="loopline">${spine}</div>
      <div class="mod-foot">Every campaign runs this spine. The human review gate sits between Create and Publish — controlled quality, grounded to the graph.</div>
    </div>

    <div class="mod" style="margin-bottom:22px">
      <div class="mod-head"><div><span class="kicker">In flight</span><h3 style="margin-top:10px">Active campaigns</h3></div><span class="mono">${A.campaigns.length} running · writes back to the dashboard</span></div>
      <div class="camp-strip">${camps}</div>
      <div class="mod-foot">Open any campaign to re-enter the loop at its current stage.</div>
    </div>

    <div class="mod">
      <div class="mod-head"><div><span class="kicker">Start new · from a diagnosed gap</span><h3 style="margin-top:10px">Launch a campaign</h3></div><button class="why-btn" data-goto="diagnose">All gaps in Diagnose →</button></div>
      <div class="gap-rows">${gaps}</div>
    </div>`;

  $$('#view-shape [data-open]').forEach(b=>b.addEventListener('click',()=>openShape(b.dataset.open, +b.dataset.stage||0)));
  $$('#view-shape [data-goto]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.goto)));
};


/* ============================================================
   G–H · SHAPE MODE — the execution loop
   LISTEN → CREATE → REVIEW → PUBLISH → MEASURE
   ============================================================ */
const STAGES=['Listen','Create','Review','Publish','Measure'];
let curGap=null, curStage=0, gateState={}, pubState={}, creativeEdits={}, published=false;

const HEARD = {
  service:[
    { q:"VinFast service centre near me?", lang:"en" },
    { q:"VinFast ka service network India mein kaisa hai?", lang:"Hinglish" },
    { q:"Can I charge a VinFast on a Mumbai–Pune road trip?", lang:"en" },
    { q:"VinFast roadside assistance milti hai kya?", lang:"Hinglish" }
  ],
  resale:[
    { q:"VinFast resale value after 3 years in India?", lang:"en" },
    { q:"VinFast lena safe hai ya resale problem hogi?", lang:"Hinglish" }
  ],
  price:[
    { q:"VinFast VF7 on-road price in India 2026?", lang:"en" },
    { q:"VF7 ki latest ex-showroom price kya hai?", lang:"Hinglish" }
  ],
  c_lease:[
    { q:"Can I buy a VinFast outright in India or only lease?", lang:"en" }
  ]
};

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
function openShape(gapId, startStage){
  curGap=A.gaps.find(g=>g.id===gapId)||A.gaps[0];
  curStage=startStage||0; gateState={}; creativeEdits={}; published=false;
  pubState={ owned:true, google:true, meta:true, earned:false };
  $('#shapeGap').textContent=curGap.title;
  buildSRail(); paintStage();
  $('#shape').classList.add('on'); document.body.style.overflow='hidden';
}
$('#shapeClose').addEventListener('click',()=>{ $('#shape').classList.remove('on'); document.body.style.overflow=''; });

function navRow(extra){
  const prev = curStage>0 ? `<button class="btn-sm ghost" data-nav="prev">← ${STAGES[curStage-1]}</button>`:'<span></span>';
  const next = curStage<STAGES.length-1 ? `<button class="btn-sm primary" data-nav="next">Continue · ${STAGES[curStage+1]} →</button>`:`<button class="btn-sm primary" data-nav="done">Open full attribution in Prove →</button>`;
  return `<div class="gate-actions" style="margin-top:30px;border-top:1px dashed var(--line);padding-top:22px">
    <span class="gate-verdict">${extra||'The loop is re-enterable — jump to any stage from the rail above.'}</span>
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
  if(curStage===0) body.innerHTML=stageListen();
  else if(curStage===1) body.innerHTML=stageCreate();
  else if(curStage===2) body.innerHTML=stageReview();
  else if(curStage===3) body.innerHTML=stagePublish();
  else body.innerHTML=stageMeasure();
  postPaint();
  wireNav();
}

/* ---- shared creative helpers ---- */
function adClass(v){ return v.format==='Display'?'display':(v.format==='Social'?'social':'story'); }
function adImgSrc(v){ const I=window.ADIMG||{}; return (v.img||'').indexOf('vf6')>=0 ? I.vf6 : I.vf7; }
function headlineOf(v){ return creativeEdits[v.id] != null ? creativeEdits[v.id] : v.headline; }
function adInner(v, editable, withBody){
  const body = (withBody===false) ? '' : `
    <div class="ad-body">
      <div class="ad-h"${editable?' contenteditable="true" spellcheck="false"':''} data-cr="${v.id}">${headlineOf(v)}</div>
      <div class="ad-sub">${v.sub}</div>
      <span class="ad-cta">${v.cta} →</span>
    </div>`;
  return `<div class="ad-img" style="background-image:url('${adImgSrc(v)}')"></div>
    <div class="ad-scrim"></div>
    <img class="ad-logo" src="${(window.ADIMG||{}).logo||''}" alt="VinFast">
    <div class="ad-kick">${v.kicker}</div>${body}`;
}
function variantById(id){ return A.creative.variants.find(v=>v.id===id); }

/* ---- 01 LISTEN ---- */
function stageListen(){
  const a=A.audience;
  const heard=(HEARD[curGap.node]||HEARD.service).map(h=>`<div class="seg" style="padding:14px 16px">
    <div class="seg-top"><div class="seg-name" style="font-family:var(--fontBody);font-weight:400;font-size:14.5px">"${h.q}"</div>
    <span class="seg-meta" style="margin:0">${h.lang}</span></div></div>`).join('');
  const segs=a.segments.map((s,i)=>`<div class="seg ${s.on?'':'off'}" data-seg="${i}">
    <div class="seg-top"><div><div class="seg-name">${s.name}</div><div class="seg-meta">Reach ${s.reach} · fit ${s.fit}%</div></div>
      <button class="seg-tog">${s.on?'● Included':'Include'}</button></div>
    <div class="seg-note">${s.note}</div>
    <div class="seg-fit"><span class="fl">Segment fit</span><div class="bar" style="--w:${s.fit}%"></div><span class="fv">${s.fit}%</span></div>
  </div>`).join('');
  return `<div class="shape-pane on">
    <div class="spane-head"><div class="k">Stage 01 · listen · the entry point is the gap</div>
      <h2>${curGap.title}</h2>
      <p>${curGap.detail} You did not start from a blank brief — the gap node, the audience and the forecast are carried in from the dashboard.</p></div>
    <div class="ctx-cards">
      <div class="ctx-card"><div class="k">Gap node · from the graph</div><div class="v"><b>${curGap.node}</b> · seen in ${curGap.engines.join(', ')}</div></div>
      <div class="ctx-card"><div class="k">Audience · from the dashboard</div><div class="v">${curGap.segment}</div></div>
      <div class="ctx-card"><div class="k">Forecast · before spend</div><div class="v"><b>+${curGap.lift}pp</b> · ${curGap.conf} confidence</div></div>
    </div>
    <div class="grid-2" style="margin-top:0">
      <div class="mod"><div class="mod-head"><div><span class="kicker">What we heard</span><h3 style="margin-top:10px">Buyer questions feeding this gap</h3></div><span class="mono">${curGap.queryShare} of queries</span></div>
        <div class="seg-list">${heard}</div>
        <div class="mod-foot">Real buyer prompts across the seven engines — in the languages your market actually uses.</div></div>
      <div class="mod"><div class="mod-head"><div><span class="kicker">Persona · carried in</span><h3 style="margin-top:10px">Who we speak to</h3></div><span class="mono">Reach ${a.reach}</span></div>
        <div class="seg-list">${segs}</div>
        <div class="mod-foot">Tune segments here — reach and the held-out test recompute downstream.</div></div>
    </div>
    ${navRow()}
  </div>`;
}

/* ---- 02 CREATE (the studio) ---- */
function stageCreate(){
  const c=A.creative;
  const facts=c.brief.mustSay.map(f=>`<div class="sb-fact"><span class="gi">${CHECK}</span>${f}</div>`).join('');
  const variants=c.variants.map(v=>{
    const flagged=!!v.flag;
    return `<div class="crc ${flagged?'flagged':''}">
      <div class="crc-top"><span class="crc-fmt">${v.format} <span>· ${v.spec}</span></span><span class="crc-chan">${v.channel}</span></div>
      <div class="ad ${adClass(v)}">${adInner(v, true, true)}</div>
      <div class="crc-foot">
        <span class="crc-chk ${v.onbrand?'ok':'no'}"><span class="d">${v.onbrand?CHECK:CROSS}</span>On-brand</span>
        <span class="crc-chk ${v.grounded?'ok':'no'}"><span class="d">${v.grounded?CHECK:CROSS}</span>Grounded</span>
        <span class="crc-edit">${v.lang} · headline editable ↑</span>
      </div>
      ${flagged?`<div class="crc-flag">⚠ ${v.flag}</div>`:''}
    </div>`;
  }).join('');
  return `<div class="shape-pane on">
    <div class="spane-head"><div class="k">Stage 02 · create · the creative studio</div>
      <h2>Generate the creative</h2>
      <p>Visual ads built against the brand kit and grounded to the gap — VinFast imagery, approved facts, in-language. Edit any headline inline. Nothing publishes from here; every asset routes through the review gate next.</p></div>
    <div class="studio">
      <div class="studio-brief">
        <div class="sb-k">Generated from · grounded brief</div>
        <div class="sb-obj">${c.brief.objective}</div>
        <div class="sb-div"></div>
        <div class="sb-k">Must say · from approved facts</div>
        <div class="sb-facts">${facts}</div>
        <div class="sb-div"></div>
        <div class="sb-k">Brand kit</div>
        <div class="sb-kit">${c.brief.kit}</div>
        <button class="regen" id="regenBtn"><span class="sp"></span> Regenerate variants</button>
      </div>
      <div class="studio-variants">${variants}</div>
    </div>
    ${navRow('Three variants generated · 1 flagged for a claim that isn\u2019t grounded.')}
  </div>`;
}

/* ---- 03 REVIEW (gate on the creatives) ---- */
function stageReview(){
  const cards=A.creative.variants.map((v,i)=>{
    const st=gateState[v.id]||'pending';
    const checks=[
      { k:'On-brand voice', ok:v.onbrand, note:v.onbrand?'Matches approved tone and palette of claims.':'Headline uses a claim outside the approved library.' },
      { k:'Grounded to graph', ok:v.grounded, note:'Every stated fact traces to the synced service-coverage source.' },
      { k:'Format & spec', ok:true, note:`${v.format} · ${v.spec} · ${v.channel}.` }
    ];
    const allOk=checks.every(x=>x.ok);
    let actions;
    if(st==='approved') actions=`<span class="draft-status">${CHECK} Approved for publish</span>`;
    else if(st==='rejected') actions=`<span class="draft-status" style="color:var(--muted)">Rejected · back to studio</span>`;
    else actions=`<div class="gate-btns">
      <button class="btn-sm ghost" data-reject="${v.id}">Reject</button>
      <button class="btn-sm primary" data-approve="${v.id}">${allOk?'Approve creative':'Approve with flag'}</button></div>`;
    return `<div class="draftc ${i===0?'hero':''} ${st==='approved'?'approved':''} ${st==='rejected'?'rejected':''}">
      <div class="draft-head" style="align-items:center;gap:20px">
        <div style="width:128px;flex:0 0 auto"><div class="ad ${adClass(v)}">${adInner(v,false,false)}</div></div>
        <div style="flex:1;min-width:0"><div class="dt">${headlineOf(v).replace(/\n/g,' ')}</div><div class="dc">${v.format} · ${v.channel}</div></div>
        <span class="pill ${v.flag?'road':'live'}">${v.flag?'Needs a call':'Clean'}</span>
      </div>
      <div class="draft-body">
        <div class="gate">
          <div class="gate-lab">Brand-guideline + graph-grounding review gate</div>
          <div class="gate-checks">${checks.map(x=>`<div class="gcheck ${x.ok?'ok':'no'}"><span class="gi">${x.ok?CHECK:CROSS}</span><span class="gk">${x.k}</span><span class="gn">${x.note}</span></div>`).join('')}</div>
          <div class="gate-actions"><span class="gate-verdict"><b>${allOk?'All checks pass.':'One check needs a human decision.'}</b> Grounds node · <b>${v.groundsNode}</b></span>${actions}</div>
        </div>
      </div>
    </div>`;
  }).join('');
  const nApproved=A.creative.variants.filter(v=>gateState[v.id]==='approved').length;
  return `<div class="shape-pane on">
    <div class="spane-head"><div class="k">Stage 03 · review · the hero · human-in-the-loop</div>
      <h2>Review gate</h2>
      <p>Nothing ships lights-out. Each creative is checked for on-brand voice and grounding-to-graph, then a human approves or rejects. This controlled-quality, grounded gate is the differentiation — not the generation.</p></div>
    <div class="draft-list">${cards}</div>
    ${navRow(nApproved?`${nApproved} creative${nApproved>1?'s':''} approved — ready to publish.`:'Approve at least one creative to publish.')}
  </div>`;
}

/* ---- 04 PUBLISH ---- */
function stagePublish(){
  const approvedIds=A.creative.variants.filter(v=>gateState[v.id]==='approved').map(v=>v.id);
  if(!approvedIds.length){
    return `<div class="shape-pane on">
      <div class="spane-head"><div class="k">Stage 04 · publish</div><h2>Publish approved creative</h2></div>
      <div class="mod"><p style="color:var(--muted);font-size:14.5px;line-height:1.7">No creative is approved yet. Step back to the review gate and approve at least one creative — only approved, grounded assets can be published.</p></div>
      ${navRow()}
    </div>`;
  }
  const chans=A.channels.map(ch=>{
    const hasCreative = !ch.creative || approvedIds.includes(ch.creative);
    const on = ch.must || (pubState[ch.id] && hasCreative);
    const cv = ch.creative ? variantById(ch.creative) : null;
    const thumb = cv ? `style="background-image:url('${adImgSrc(cv)}')"` : '';
    let right;
    if(ch.must) right=`<span class="pub-locked">Always on</span>`;
    else if(!hasCreative) right=`<span class="pub-tog" style="opacity:.5">Creative not approved</span>`;
    else right=`<button class="pub-tog" data-pub="${ch.id}">${on?(ch.queued?'● Scheduled':'● Selected'):(ch.queued?'Queue':'Add')}</button>`;
    return `<div class="pubc ${on?'':'off'} ${ch.must?'must':''}">
      <div class="pub-thumb ${cv?'':'none'}" ${thumb}></div>
      <div class="pub-main">
        <div class="pub-name">${ch.name}</div>
        <div class="pub-kind">${ch.kind}</div>
        <div class="pub-note">${ch.note}</div>
        <div class="pub-meta">${ch.reach!=='—'?`<span>Reach · <b>${ch.reach}</b></span>`:''}${ch.budget!=='—'?`<span>Budget · <b>${ch.budget}</b></span>`:''}<span>Creative · <b>${cv?cv.format:'partner-produced'}</b></span></div>
      </div>
      <div class="pub-right">${right}</div>
    </div>`;
  }).join('');
  const liveCount = A.channels.filter(ch=>ch.must || (pubState[ch.id] && (!ch.creative||approvedIds.includes(ch.creative)))).length;
  const totalBudget = A.channels.filter(ch=>!ch.must && pubState[ch.id] && ch.budget!=='—').reduce((s,ch)=>s+parseFloat(ch.budget.replace(/[^\d.]/g,'')),0);
  const summary = published
    ? `<div class="pub-summary"><span class="ps-l">${CHECK} <b>Published to ${liveCount} channels</b> · owned page re-grounds the model on the next scan · paid live in minutes</span><button class="btn-sm primary" data-nav="next">See the lift · Measure →</button></div>`
    : `<div class="pub-summary"><span class="ps-l">Publishing to <b>${liveCount} channels</b> · paid budget <b>₹${totalBudget.toFixed(1)}L</b> · the owned + schema push is the grounding move</span><button class="btn-sm primary" id="publishBtn">Publish to ${liveCount} channels →</button></div>`;
  return `<div class="shape-pane on">
    <div class="spane-head"><div class="k">Stage 04 · publish · controlled distribution</div>
      <h2>Publish to channels</h2>
      <p>Approved creative is pushed where it works — owned, paid and earned. The owned page + FAQ schema is the grounding move that changes what the models say; paid and earned amplify it to your segments.</p></div>
    <div class="pub-list">${chans}</div>
    ${summary}
    ${navRow()}
  </div>`;
}

/* ---- 05 MEASURE (closes the loop inside Shape) ---- */
function stageMeasure(){
  const m=A.measure;
  const chres=A.channelResult.map(c=>`<div class="cr"><div class="crn">${c.name}</div><div class="crv">${c.value}</div><div class="crm">${c.metric} · ${c.sub}</div></div>`).join('');
  return `<div class="shape-pane on">
    <div class="spane-head"><div class="k">Stage 05 · measure · the loop closes</div>
      <h2>What it moved</h2>
      <p>Re-scanned across seven engines and measured against the held-out control defined before launch. Predicted vs actual, with honest uncertainty — then it writes back to the dashboard and the system of record.</p></div>
    <div class="meas-top">
      <div class="mod">
        <div class="mod-head"><div><span class="kicker">${m.headline.metric}</span><h3 style="margin-top:10px">Predicted vs actual</h3></div></div>
        <div class="pva-big">
          <div class="blk pred"><div class="k">Predicted</div><div class="v">+${m.headline.predicted}<small>${m.headline.unit}</small></div></div>
          <div class="blk"><div class="k">Actual</div><div class="v">+${m.headline.actual}<small>${m.headline.unit}</small></div></div>
          <div class="blk"><div class="k">Net vs control</div><div class="v">+${(m.tvc.treatment-m.tvc.control).toFixed(1)}<small>${m.headline.unit}</small></div></div>
        </div>
        <div class="pva-band" style="margin-top:14px">80% confidence band <b>+${m.headline.band[0]} to +${m.headline.band[1]}${m.headline.unit}</b> · ${m.tvc.note}</div>
      </div>
      <div class="mod">
        <div class="mod-head"><div><span class="kicker">Per channel · delivery</span><h3 style="margin-top:10px">Where the lift came from</h3></div></div>
        <div class="chres">${chres}</div>
        <div class="mod-foot">Owned + schema re-grounded the node; paid amplified reach. Illustrative demo data.</div>
      </div>
    </div>
    <div class="mod" style="margin-top:22px"><div class="mod-head"><div><span class="kicker">Writes back</span><h3 style="margin-top:10px">The loop is one system</h3></div></div>
      <p style="color:var(--muted);font-size:14.5px;line-height:1.7;max-width:74ch">This result updates Share of Model on the dashboard, re-grounds the <b style="color:var(--ink)">${curGap.node}</b> node in the brand graph, and logs the full cycle — brief, creative, control, result — into the system of record so confidence rises next quarter.</p></div>
    ${navRow('Listen → Create → Review → Publish → Measure — one re-enterable loop.')}
  </div>`;
}

function postPaint(){
  // segment toggles
  $$('#shapeBody .seg[data-seg]').forEach(s=>{
    const t=s.querySelector('.seg-tog'); if(!t) return;
    t.addEventListener('click',()=>{ s.classList.toggle('off'); t.textContent = s.classList.contains('off')?'Include':'● Included'; });
  });
  // editable headlines
  $$('#shapeBody .ad-h[contenteditable]').forEach(h=>{
    h.addEventListener('input',()=>{ creativeEdits[h.dataset.cr] = h.innerText; });
  });
  // regenerate
  const rb=$('#regenBtn');
  if(rb) rb.addEventListener('click',()=>{ const o=rb.innerHTML; rb.innerHTML='<span class="sp"></span> Generating…'; rb.style.opacity='.6'; setTimeout(()=>{ rb.innerHTML=o; rb.style.opacity=''; },820); });
  // review gate
  $$('#shapeBody [data-approve]').forEach(b=>b.addEventListener('click',()=>{ gateState[b.dataset.approve]='approved'; paintStage(); }));
  $$('#shapeBody [data-reject]').forEach(b=>b.addEventListener('click',()=>{ gateState[b.dataset.reject]='rejected'; paintStage(); }));
  // publish toggles + publish
  $$('#shapeBody [data-pub]').forEach(b=>b.addEventListener('click',()=>{ pubState[b.dataset.pub]=!pubState[b.dataset.pub]; paintStage(); }));
  const pb=$('#publishBtn');
  if(pb) pb.addEventListener('click',()=>{ published=true; paintStage(); });
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
