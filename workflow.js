/* ============================================================
   workflow.js — VinFast 4-stage walkthrough
   Auth guard → stages: Audience · Knowledge Graph · Content · Measure
   ============================================================ */
(function () {
  // ---- AUTH GUARD ----
  var authed = false;
  try { authed = !!(PCV.get().auth) || sessionStorage.getItem('pcv_auth') === '1'; } catch (e) {}
  if (!authed) { location.replace('login.html'); return; }

  var V = window.VINFAST;
  var ENGINES = window.ENGINES || ["ChatGPT","Perplexity","Gemini","Claude","Copilot","Google AIO","Grok"];

  // ====================================================================
  // STAGE NAVIGATION
  // ====================================================================
  var TOTAL = 4;
  var current = 0;
  var maxReached = 0;
  var railBtns = [].slice.call(document.querySelectorAll('.stage-btn'));
  var panes = [].slice.call(document.querySelectorAll('.pane[data-stage]'));

  function go(n) {
    n = Math.max(0, Math.min(TOTAL - 1, n));
    if (n === 0 && current === TOTAL - 1) { maxReached = 0; } // restart cycle
    current = n;
    maxReached = Math.max(maxReached, n);
    railBtns.forEach(function (b, i) {
      b.classList.toggle('on', i === n);
      b.classList.toggle('done', i < maxReached && i !== n);
    });
    panes.forEach(function (p) { p.classList.toggle('on', +p.dataset.stage === n); });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (n === 1) ensureGraph();
    if (n === 3) ensureMeasure();
  }
  railBtns.forEach(function (b) { b.addEventListener('click', function () { go(+b.dataset.stage); }); });
  document.querySelectorAll('[data-go]').forEach(function (b) {
    b.addEventListener('click', function () { go(+b.dataset.go); });
  });
  var so = document.getElementById('signOut');
  if (so) so.addEventListener('click', function () {
    try { PCV.set({ auth: false }); sessionStorage.removeItem('pcv_auth'); } catch (e) {}
    location.href = 'login.html';
  });

  // ====================================================================
  // STAGE 1 — TARGET AUDIENCE
  // ====================================================================
  var A = V.audience;

  // demographics
  (function () {
    var d = A.demographics;
    var rows = [
      ['Age', d.age.label],
      ['Household income', d.income.label],
      ['Geography', d.geos.join(' · ')],
      ['Life stage', d.lifestage.join(' · ')]
    ];
    var el = document.getElementById('demoList');
    rows.forEach(function (r) {
      var div = document.createElement('div');
      div.className = 'demo-row';
      div.innerHTML = '<span class="k">' + r[0] + '</span><span class="val">' + r[1] + '</span>';
      el.appendChild(div);
    });
    var g = document.createElement('div');
    g.className = 'demo-row';
    g.innerHTML = '<span class="k">Gender skew</span>' +
      '<span class="gender-bar"><i class="m" style="width:' + d.gender.m + '%"></i><i class="f" style="width:' + d.gender.f + '%"></i></span>';
    el.appendChild(g);
  })();

  // psychographic dials
  var psyEl = document.getElementById('psyList');
  A.psychographics.forEach(function (p) {
    var row = document.createElement('div');
    row.className = 'psy-row';
    row.innerHTML =
      '<div class="psy-top"><div><div class="psy-lbl">' + p.label + '</div>' +
      '<div class="psy-note">' + p.note + '</div></div><div class="psy-val" data-v="' + p.id + '">' + p.val + '</div></div>' +
      '<input class="range" type="range" min="0" max="100" value="' + p.val + '" data-id="' + p.id + '" />';
    psyEl.appendChild(row);
  });
  psyEl.addEventListener('input', function (e) {
    var inp = e.target.closest('.range'); if (!inp) return;
    var id = inp.dataset.id, val = +inp.value;
    var dim = A.psychographics.filter(function (x) { return x.id === id; })[0];
    if (dim) dim.val = val;
    var vEl = psyEl.querySelector('.psy-val[data-v="' + id + '"]');
    if (vEl) vEl.textContent = val;
    recomputeAudience();
  });

  // segments
  var segState = {};
  A.segments.forEach(function (s) { segState[s.id] = true; });
  function segMatch(s) {
    var num = 0, den = 0;
    A.psychographics.forEach(function (p) {
      var w = s.drivers[p.id] || 0;
      num += w * p.val; den += w;
    });
    return den ? Math.round(num / den) : 0;
  }
  function renderSegments() {
    var el = document.getElementById('segList');
    el.innerHTML = '';
    A.segments.forEach(function (s) {
      var on = segState[s.id];
      var match = segMatch(s);
      var div = document.createElement('div');
      div.className = 'seg' + (on ? '' : ' off');
      div.dataset.id = s.id;
      div.innerHTML =
        '<div class="seg-top"><div><div class="seg-name">' + s.name + '</div>' +
        '<div class="seg-meta">' + s.share + '% of base · ' + s.age + ' · ' + s.income + ' · ' + s.geo + '</div></div>' +
        '<button class="seg-toggle" data-toggle="' + s.id + '">' + (on ? '● Targeting' : '○ Excluded') + '</button></div>' +
        '<div class="seg-note">' + s.note + '</div>' +
        '<div class="seg-match"><span class="ml">Audience fit</span><div class="bar" style="--w:' + match + '%"></div><span class="mv">' + match + '%</span></div>' +
        '<div class="seg-signals">' + s.signals.map(function (x) { return '<span class="sig">' + x + '</span>'; }).join('') + '</div>';
      el.appendChild(div);
    });
  }
  document.getElementById('segList').addEventListener('click', function (e) {
    var b = e.target.closest('[data-toggle]'); if (!b) return;
    var id = b.dataset.toggle;
    segState[id] = !segState[id];
    renderSegments(); recomputeAudience();
  });

  function recomputeAudience() {
    var reach = 0, count = 0;
    A.segments.forEach(function (s) {
      if (!segState[s.id]) return;
      count++;
      var match = segMatch(s);
      reach += A.addressable * (s.share / 100) * (0.5 + 0.5 * match / 100);
    });
    var r = reach.toFixed(1);
    document.getElementById('reachNum').innerHTML = r + '<small>M intenders</small>';
    document.getElementById('audReachTag').textContent = 'Addressable · ' + r + ' M';
    document.getElementById('segCountTag').textContent = count + ' of ' + A.segments.length + ' segments';
    // refresh match bars without full re-render flicker
    document.querySelectorAll('#segList .seg').forEach(function (segEl) {
      var s = A.segments.filter(function (x) { return x.id === segEl.dataset.id; })[0];
      if (!s) return;
      var m = segMatch(s);
      var bar = segEl.querySelector('.seg-match .bar');
      var mv = segEl.querySelector('.seg-match .mv');
      if (bar) bar.style.setProperty('--w', m + '%');
      if (mv) mv.textContent = m + '%';
    });
  }
  renderSegments();
  recomputeAudience();

  // ====================================================================
  // STAGE 2 — KNOWLEDGE GRAPH
  // ====================================================================
  var graphBuilt = false;
  var selNode = 'vinfast';
  function nodeById(id) { return V.graph.nodes.filter(function (n) { return n.id === id; })[0]; }

  function ensureGraph() {
    if (graphBuilt) return; graphBuilt = true;
    drawGraph();
    renderKGStats();
    renderKGDetail('vinfast');
  }
  function drawGraph() {
    var svg = document.getElementById('kgSvg');
    var nodes = V.graph.nodes;
    var pos = {}; nodes.forEach(function (n) { pos[n.id] = n; });
    var parts = [];
    // edges
    V.graph.edges.forEach(function (e) {
      var a = pos[e[0]], b = pos[e[1]]; if (!a || !b) return;
      parts.push('<line class="edge" data-a="' + e[0] + '" data-b="' + e[1] + '" x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '"/>');
    });
    // nodes
    nodes.forEach(function (n) {
      var labelY = n.y + n.r + 16;
      var cls = 'node ' + n.status + (n.type === 'brand' ? ' brand' : '') + (n.id === selNode ? ' sel' : '');
      parts.push(
        '<g class="' + cls + '" data-id="' + n.id + '">' +
        '<circle class="ring" cx="' + n.x + '" cy="' + n.y + '" r="' + n.r + '"/>' +
        '<circle class="core" cx="' + n.x + '" cy="' + n.y + '" r="' + (n.type === 'brand' ? 8 : 4) + '"/>' +
        '<text x="' + n.x + '" y="' + (n.type === 'brand' ? n.y + 5 : labelY) + '">' + n.label + '</text>' +
        '</g>'
      );
    });
    svg.innerHTML = parts.join('');
    svg.querySelectorAll('.node').forEach(function (g) {
      g.addEventListener('click', function () { selectNode(g.dataset.id); });
    });
    highlightEdges(selNode);
  }
  function highlightEdges(id) {
    document.querySelectorAll('#kgSvg .edge').forEach(function (ed) {
      ed.classList.toggle('hot', ed.dataset.a === id || ed.dataset.b === id);
    });
  }
  function selectNode(id) {
    selNode = id;
    document.querySelectorAll('#kgSvg .node').forEach(function (g) {
      g.classList.toggle('sel', g.dataset.id === id);
    });
    highlightEdges(id);
    renderKGDetail(id);
  }
  function renderKGDetail(id) {
    var n = nodeById(id); if (!n) return;
    var typeLabel = { brand: 'Brand · root entity', model: 'Model · product', attr: 'Attribute · claim' }[n.type] || n.type;
    var statusLabel = { grounded: 'Grounded', drift: 'Drifting', gap: 'Gap' }[n.status];
    var badge = n.status === 'grounded' ? 'pos' : (n.status === 'drift' ? 'warn' : 'neg');
    var el = document.getElementById('kgDetail');
    el.innerHTML =
      '<div class="kg-d-head"><div><div class="kg-d-name">' + n.label + '</div><div class="kg-d-type">' + typeLabel + '</div></div>' +
      '<span class="badge ' + badge + '">' + statusLabel + '</span></div>' +
      '<div class="kg-d-stats">' +
      '<div class="kg-d-stat"><div class="k">Confidence</div><div class="v">' + n.conf + '<span style="font-size:.5em;color:var(--muted)">/100</span></div></div>' +
      '<div class="kg-d-stat"><div class="k">Grounded facts</div><div class="v">' + n.facts + '</div></div>' +
      '</div>' +
      '<div class="mono" style="margin-top:4px">What AI knows</div>' +
      '<div class="kg-facts">' + n.detail.map(function (d) { return '<div class="kg-fact">' + d + '</div>'; }).join('') + '</div>';
  }
  function renderKGStats() {
    var nodes = V.graph.nodes;
    var g = nodes.filter(function (n) { return n.status === 'grounded'; }).length;
    var d = nodes.filter(function (n) { return n.status === 'drift'; }).length;
    var x = nodes.filter(function (n) { return n.status === 'gap'; }).length;
    var avg = Math.round(nodes.reduce(function (s, n) { return s + n.conf; }, 0) / nodes.length);
    document.getElementById('kgGround').innerHTML = avg + '<small>%</small>';
    document.getElementById('kgG').textContent = g;
    document.getElementById('kgD').textContent = d;
    document.getElementById('kgX').textContent = x;
  }

  var grounded = false;
  document.getElementById('groundBtn').addEventListener('click', function () {
    if (grounded) return; grounded = true;
    V.graph.nodes.forEach(function (n) {
      if (n.status !== 'grounded') {
        n.status = 'grounded';
        n.conf = Math.min(96, n.conf + (n.conf < 50 ? 42 : 28));
        n.facts += 3;
      }
    });
    drawGraph();
    renderKGStats();
    renderKGDetail(selNode);
    var b = this;
    b.textContent = '✓ Truth pushed';
    b.classList.remove('primary');
    b.style.borderColor = 'rgba(255,255,255,.6)';
    document.getElementById('kgGroundDelta').textContent = '▲ all nodes grounded';
  });

  // ====================================================================
  // STAGE 3 — CONTENT CREATION
  // ====================================================================
  (function () {
    var strip = document.getElementById('partnerStrip');
    V.partners.forEach(function (p) {
      var connected = p.status === 'Connected';
      var div = document.createElement('div');
      div.className = 'partner' + (connected ? ' connected' : '');
      div.innerHTML =
        '<div class="pn"><span class="pname">' + p.name + '</span>' +
        '<span class="badge ' + (connected ? 'pos' : '') + '">' + (connected ? '● Connected' : 'Available') + '</span></div>' +
        '<div class="prole">' + p.role + '</div>';
      strip.appendChild(div);
    });
  })();

  var STAGES = ['Brief', 'Drafting', 'Review', 'Live'];
  function renderContent() {
    var el = document.getElementById('contentList');
    el.innerHTML = '';
    V.content.forEach(function (c, i) {
      var si = STAGES.indexOf(c.status);
      var track = STAGES.map(function (st, k) {
        var cls = k < si ? 'done' : (k === si ? 'cur' : '');
        return '<div class="cc-stage ' + cls + '"><span class="sd"></span><span class="sl">' + st + '</span></div>';
      }).join('');
      var isLive = c.status === 'Live';
      var div = document.createElement('div');
      div.className = 'cc';
      div.innerHTML =
        '<div class="cc-top"><div><div class="cc-title">' + c.title + '</div><div class="cc-fmt">' + c.fmt + ' · ' + c.channel + '</div></div>' +
        '<span class="badge ' + (isLive ? 'pos' : '') + '">' + (isLive ? '● Live' : c.status) + '</span></div>' +
        '<div class="cc-meta">' +
        '<div class="m"><div class="mk">Partner engine</div><div class="mv">' + c.partner + '</div></div>' +
        '<div class="m"><div class="mk">Target segment</div><div class="mv">' + c.segment + '</div></div>' +
        '<div class="m"><div class="mk">Grounds</div><div class="mv">' + c.grounds + '</div></div>' +
        '<div class="m"><div class="mk">Closes gap</div><div class="mv">' + c.closes + '</div></div>' +
        '<div class="m"><div class="mk">Forecast lift</div><div class="mv lift">+' + c.lift.toFixed(1) + 'pp</div></div>' +
        '</div>' +
        '<div class="cc-track">' + track + '</div>' +
        '<div class="cc-foot"><span class="mono" style="color:var(--faint)">Brief #' + (i + 1) + ' · routed automatically</span>' +
        (isLive ? '<span class="cc-adv live">✓ Live &amp; measured</span>'
                : '<button class="cc-adv" data-adv="' + i + '">Advance → ' + STAGES[si + 1] + '</button>') +
        '</div>';
      el.appendChild(div);
    });
    updateContentTag();
  }
  function updateContentTag() {
    var live = V.content.filter(function (c) { return c.status === 'Live'; }).length;
    var flight = V.content.length - live;
    document.getElementById('contentTag').textContent = live + ' live · ' + flight + ' in flight';
  }
  document.getElementById('contentList').addEventListener('click', function (e) {
    var b = e.target.closest('[data-adv]'); if (!b) return;
    var c = V.content[+b.dataset.adv];
    var si = STAGES.indexOf(c.status);
    if (si < STAGES.length - 1) { c.status = STAGES[si + 1]; renderContent(); }
  });
  renderContent();

  // ====================================================================
  // STAGE 4 — MEASUREMENT
  // ====================================================================
  var measureBuilt = false;
  function ensureMeasure() {
    if (measureBuilt) return; measureBuilt = true;
    var M = V.measure;

    // KPIs
    var kEl = document.getElementById('measKpis');
    M.kpis.forEach(function (k) {
      var before = k.unit === '' ? k.before.toFixed(2) : k.before;
      var after = k.unit === '' ? k.after.toFixed(2) : k.after;
      var delta = k.unit === '' ? '+' + (k.after - k.before).toFixed(2) : '+' + (k.after - k.before) + k.unit;
      var div = document.createElement('div');
      div.className = 'glass kpi-c';
      div.innerHTML = '<span class="mono">' + k.k + '</span>' +
        '<div class="v">' + after + '<small>' + (k.unit || '') + '</small></div>' +
        '<span class="delta"><span class="dot"></span> ' + delta + ' · from ' + before + (k.unit || '') + '</span>';
      kEl.appendChild(div);
    });

    // engine lift (before/after bars)
    var maxAfter = Math.max.apply(null, M.engineLift.map(function (e) { return e.after; }));
    var elf = document.getElementById('engineLift');
    M.engineLift.forEach(function (e) {
      var row = document.createElement('div');
      row.className = 'ba-row';
      row.innerHTML =
        '<span class="en">' + e.engine + '</span>' +
        '<div class="ba-bars">' +
        '<div class="ba-bar before"><i style="width:0%" data-w="' + (e.before / maxAfter * 100) + '"></i><span class="tag">' + e.before + '% before</span></div>' +
        '<div class="ba-bar after"><i style="width:0%" data-w="' + (e.after / maxAfter * 100) + '"></i><span class="tag" style="color:#000">' + e.after + '% after</span></div>' +
        '</div>';
      elf.appendChild(row);
    });

    // segment reach
    var sr = document.getElementById('segReach');
    M.segmentReach.forEach(function (s) {
      var div = document.createElement('div');
      div.className = 'rr';
      div.innerHTML = '<div><div class="rn">' + s.seg + '</div><div class="rsub">' + s.conv + '% est. conversion to enquiry</div></div>' +
        '<div class="rv">' + s.reach.toFixed(2) + '<small>M</small></div>';
      sr.appendChild(div);
    });

    // predicted vs actual
    var maxPVA = Math.max.apply(null, M.predVsActual.map(function (p) { return Math.max(p.pred, p.actual); })) + 0.4;
    var pvaEl = document.getElementById('pva');
    M.predVsActual.forEach(function (p) {
      var beat = p.actual >= p.pred;
      var div = document.createElement('div');
      div.className = 'pva-row';
      div.innerHTML =
        '<div class="pn">' + p.action + '</div>' +
        '<div class="pva-bars"><div class="pva-track"><div class="pred" style="width:' + (p.pred / maxPVA * 100) + '%"></div><div class="act" style="width:0%" data-w="' + (p.actual / maxPVA * 100) + '"></div></div>' +
        '<span class="pva-val">pred +' + p.pred.toFixed(1) + ' · <b>actual +' + p.actual.toFixed(1) + 'pp</b> ' + (beat ? '▲ beat' : '▼ under') + '</span></div>';
      pvaEl.appendChild(div);
    });

    drawSpark(M.drift10w);

    // animate bars in
    requestAnimationFrame(function () {
      setTimeout(function () {
        document.querySelectorAll('#engineLift .ba-bar i').forEach(function (i) { i.style.width = i.dataset.w + '%'; });
        document.querySelectorAll('#pva .act').forEach(function (i) { i.style.width = i.dataset.w + '%'; });
      }, 60);
    });
  }
  function drawSpark(series) {
    var w = 320, h = 64, pad = 5;
    var mn = Math.min.apply(null, series) - 1, mx = Math.max.apply(null, series) + 1;
    var xs = series.map(function (_, i) { return pad + i / (series.length - 1) * (w - pad * 2); });
    var ys = series.map(function (v) { return h - pad - (v - mn) / (mx - mn) * (h - pad * 2); });
    var line = xs.map(function (x, i) { return (i ? 'L' : 'M') + x.toFixed(1) + ',' + ys[i].toFixed(1); }).join(' ');
    var area = line + ' L' + xs[xs.length - 1].toFixed(1) + ',' + h + ' L' + xs[0].toFixed(1) + ',' + h + ' Z';
    document.getElementById('spark').innerHTML =
      '<defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#fff" stop-opacity=".25"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>' +
      '<path d="' + area + '" fill="url(#sg)"/>' +
      '<path d="' + line + '" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      xs.map(function (x, i) { return '<circle cx="' + x.toFixed(1) + '" cy="' + ys[i].toFixed(1) + '" r="2" fill="#fff"/>'; }).join('');
  }

})();
