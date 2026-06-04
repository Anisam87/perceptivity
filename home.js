/* Perceptivity — homepage interactions & section builders.
   Two earned interactions: hero brand-probe reveal, and the
   author-the-answer toggle. Plus terminal data builders. */
(function(){
  const S = window.SITE; if (!S) return;
  const $ = (s, r=document) => r.querySelector(s);
  const el = (t, c, h) => { const n=document.createElement(t); if(c)n.className=c; if(h!=null)n.innerHTML=h; return n; };

  /* ============================================================
     1 · HERO — "type your brand" reveal
     ============================================================ */
  (function(){
    const form = $('#probeForm'); if (!form) return;
    const input = $('#probeInput');
    const out = $('#probeAnswer');
    let busy = false;

    function run(){
      if (busy) return;
      const brand = (input.value.trim() || 'Your brand').slice(0, 40);
      busy = true;
      out.innerHTML = '';
      const status = el('div','probe-status','<span class="blink"></span> Querying ' + S.hero.engine + ' · live answer engine…');
      out.appendChild(status);

      setTimeout(()=>{
        out.innerHTML = '';
        const card = el('div','probe-ans-card');
        const head = el('div','probe-ans-head',
          '<span class="eng"><span class="dot"></span>'+S.hero.engine+' · recorded answer</span>'+
          '<span class="mono" style="color:var(--cream-3)">Illustrative</span>');
        const body = el('div','probe-ans-body');
        card.appendChild(head); card.appendChild(body);
        out.appendChild(card);

        // build segments with the typed brand slotted in
        const segs = S.hero.segments.map(s => {
          if (s.k === 'you') return { t: brand, k:'you' };
          return s;
        });
        // type-reveal word by word
        let si = 0, wi = 0, words = [];
        function nextWord(){
          if (si >= segs.length){ // citations
            const cites = el('div','probe-cites');
            S.hero.cites.forEach((c,i)=> cites.appendChild(el('span','probe-cite','<span class="n">['+(i+1)+']</span> '+c)));
            cites.style.opacity = 0; card.appendChild(cites);
            requestAnimationFrame(()=>{ cites.style.transition='opacity .5s'; cites.style.opacity=1; });
            busy = false;
            return;
          }
          const seg = segs[si];
          if (!words.length) words = seg.t.split(/(\s+)/);
          if (wi < words.length){
            const span = document.createElement('span');
            if (seg.k === 'rival') span.className = 'rival';
            else if (seg.k === 'you') span.className = 'you';
            span.textContent = words[wi];
            body.appendChild(span);
            wi++;
            setTimeout(nextWord, /\S/.test(words[wi-1]) ? 26 : 8);
          } else { si++; wi=0; words=[]; nextWord(); }
        }
        nextWord();
      }, 900);
    }

    form.addEventListener('submit', e => { e.preventDefault(); run(); });
    // run once on load with placeholder so the section is never empty
    window.addEventListener('load', ()=> setTimeout(run, 600));
  })();

  /* ============================================================
     2 · AUTHOR THE ANSWER — toggle your truth on/off
     ============================================================ */
  (function(){
    const a = S.author;
    const list = $('#authSources'); const ans = $('#authAnswer'); if (!list || !ans) return;
    $('#authQuery').textContent = '“' + a.query + '”';

    const state = {}; a.sources.forEach(s => state[s.id] = true);
    const stLabel = { synced:'Synced', drift:'Price drift', review:'In review' };
    const stTag = { synced:'pos', drift:'neg', review:'amber' };

    a.sources.forEach(s => {
      const btn = el('button','auth-src on');
      btn.setAttribute('aria-pressed','true');
      btn.innerHTML =
        '<span class="auth-tick"><svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.6l3 3L10 1.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>'+
        '<span class="auth-src-main"><span class="g">'+s.group+'</span>'+
        '<span class="n">'+s.facts+' facts · synced '+s.synced+'</span></span>'+
        '<span class="tag '+stTag[s.status]+'"><span class="dot"></span>'+stLabel[s.status]+'</span>';
      btn.addEventListener('click', ()=>{
        state[s.id] = !state[s.id];
        btn.classList.toggle('on', state[s.id]);
        btn.setAttribute('aria-pressed', String(state[s.id]));
        render();
      });
      list.appendChild(btn);
    });

    function render(){
      ans.innerHTML = '';
      a.answer.forEach(seg => {
        const grounded = state[seg.groundedBy];
        const span = el('span', 'auth-seg ' + (grounded ? 'on' : 'off'));
        span.textContent = (grounded ? seg.right : seg.wrong) + ' ';
        ans.appendChild(span);
      });
      const on = a.sources.filter(s => state[s.id]).length;
      const total = a.sources.length;
      const acc = Math.round(on/total*100);
      $('#authCount').textContent = on + ' / ' + total + ' synced';
      $('#authErr').textContent = (total - on);
      const accEl = $('#authAcc');
      accEl.textContent = 'Accuracy ' + acc + '%';
      accEl.className = 'auth-acc ' + (acc === 100 ? 'good' : acc >= 60 ? 'mid' : 'bad');
    }
    render();
  })();

  /* ============================================================
     3 · SIMULATE — forecast → measured vs predicted
     ============================================================ */
  (function(){
    const wrap = $('#simBars'); if (!wrap) return;
    const sim = S.simulate;
    const maxP = Math.max(...sim.perEngine.map(r => Math.max(r.p, r.m)));
    sim.perEngine.forEach(r => {
      const row = el('div','bar-row');
      row.innerHTML =
        '<span class="nm">'+r.nm+'</span>'+
        '<span class="track">'+
          '<span class="fill amber" style="width:'+(r.p/maxP*100)+'%"></span>'+
          '<span class="sim-actual" style="left:'+(r.m/maxP*100)+'%"></span>'+
        '</span>'+
        '<span class="val">+'+r.p.toFixed(1)+'pp</span>';
      wrap.appendChild(row);
    });
    $('#simPred').textContent = '+' + sim.predictedNet.toFixed(1) + 'pp';
    $('#simMeas').textContent = '+' + sim.measuredNet.toFixed(1) + 'pp';
    $('#simErr').textContent = Math.abs(sim.predictedNet - sim.measuredNet).toFixed(1) + 'pp';
    $('#simWindow').textContent = sim.window + ' days';
  })();

  /* ============================================================
     4 · INDIA — vernacular share + retail surfaces
     ============================================================ */
  (function(){
    const wrap = $('#vernBars'); if (wrap){
      const max = Math.max(...S.india.vernacular.map(v=>v.share));
      S.india.vernacular.forEach(v => {
        const row = el('div','vern-row');
        row.innerHTML =
          '<span class="vlang">'+v.lang+'</span>'+
          '<span class="vq">'+v.q+'</span>'+
          '<span class="track"><span class="fill violet" style="width:'+(v.share/max*100)+'%"></span></span>'+
          '<span class="val">'+v.share+'%</span>';
        wrap.appendChild(row);
      });
    }
    const rwrap = $('#retailCards');
    if (rwrap){
      S.india.retail.forEach(r => {
        const c = el('div','retail-card');
        c.innerHTML =
          '<div class="rc-head"><span class="rc-name">'+r.surface+'</span><span class="mono">'+r.ctx+'</span></div>'+
          '<p class="rc-snip">“'+r.snippet+'”</p>'+
          '<div class="rc-foot"><span class="tag amber"><span class="dot"></span>Tracked by Perceptivity</span><span class="mono" style="color:var(--ink-4)">No competitor tracks this</span></div>';
        rwrap.appendChild(c);
      });
    }
  })();

  /* ============================================================
     5 · SECURITY table
     ============================================================ */
  (function(){
    const wrap = $('#secRows'); if (!wrap) return;
    S.security.forEach(s => {
      const row = el('tr');
      row.innerHTML =
        '<td class="lead">'+s.k+'</td>'+
        '<td><span class="tag '+s.status+'"><span class="dot"></span>'+s.v+'</span></td>'+
        '<td>'+s.note+'</td>';
      wrap.appendChild(row);
    });
  })();
})();
