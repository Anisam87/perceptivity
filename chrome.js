/* Perceptivity — shared chrome: dot atmosphere, nav, footer, cursor, observers.
   Black / white / dots only. */

(function(){
  // ---- atmosphere (pure dot field; no colour, no ascii) ----
  const atmos = `
    <div class="atmos-bg"></div>
    <div class="atmos-stars"></div>`;
  document.body.insertAdjacentHTML('afterbegin', atmos);

  // mark is CSS-drawn now; keep the global empty so any old reference is inert
  window.eyeLogoSVG = '';

  // ---- nav: single minimal line — logo left, links centre, orb right ----
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const link = (href, label) => {
    const base = href.split('#')[0].toLowerCase();
    const active = base === here ? ' active' : '';
    return `<a class="nav-link${active}" href="${href}">${label}</a>`;
  };

  const nav = `
    <div class="nav-wrap">
      <nav class="nav">
        <a class="brand" href="index.html" aria-label="Perceptivity home">
          <span class="eye-mark"></span>
          <span class="brand-word">Perceptivity</span>
        </a>
        <div class="nav-links">
          ${link('index.html#how','How it works')}
          ${link('index.html#method','Method')}
          ${link('company.html','Company')}
          ${link('demo.html','Contact')}
        </div>
        <div class="nav-actions">
          <a class="nav-link" href="login.html">Sign in</a>
          <a class="btn ghost" href="onboarding.html">Get started</a>
          <span class="orb-small" aria-hidden="true"></span>
        </div>
      </nav>
    </div>`;
  document.body.insertAdjacentHTML('afterbegin', nav);

  // ---- footer: minimal mono line ----
  const foot = `
    <footer class="foot">
      <div class="foot-l">
        <span>Perceptivity</span>
        <a href="index.html#how">How it works</a>
        <a href="company.html">Company</a>
        <a href="demo.html">Contact</a>
        <a href="login.html">Sign in</a>
      </div>
      <div>Black / White / Dots</div>
    </footer>`;
  document.body.insertAdjacentHTML('beforeend', foot);

  // ---- custom cursor: tiny dot + slow perception ring (inertia) ----
  (function(){
    if (matchMedia('(hover:none)').matches) return;
    const dot = document.createElement('div'); dot.className = 'cursor-dot';
    const ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.append(dot, ring);
    let mx = innerWidth/2, my = innerHeight/2, rx = mx, ry = my, shown = false;
    addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
      if (!shown){ shown = true; dot.style.opacity = ring.style.opacity = 1; }
    }, {passive:true});
    addEventListener('mouseleave', () => { dot.style.opacity = ring.style.opacity = 0; shown = false; });
    function follow(){
      rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;   // inertia
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(follow);
    }
    follow();
    const hot = 'a,button,.btn,.chip,input,textarea,select,[role=button],label';
    addEventListener('mouseover', e => { if (e.target.closest(hot)) ring.classList.add('hot'); });
    addEventListener('mouseout',  e => { if (e.target.closest(hot)) ring.classList.remove('hot'); });
  })();

  // ---- reveal observer (+ rect fallback so content never stays hidden) ----
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }});
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  function checkReveals(){
    const h = window.innerHeight || 800;
    document.querySelectorAll('.reveal:not(.in)').forEach(el=>{
      const r = el.getBoundingClientRect();
      if (r.top < h * 0.94 && r.bottom > 0){ el.classList.add('in'); io.unobserve(el); }
    });
  }
  let rTick = false;
  window.addEventListener('scroll', ()=>{ if(!rTick){ rTick=true; requestAnimationFrame(()=>{ checkReveals(); rTick=false; }); } }, { passive:true });
  requestAnimationFrame(()=>{ checkReveals(); requestAnimationFrame(checkReveals); });
  window.addEventListener('load', checkReveals);
  setTimeout(checkReveals, 400);
  setTimeout(()=> document.querySelectorAll('.reveal:not(.in)').forEach(el=>el.classList.add('in')), 2600);

  // ---- subtle parallax on any [data-parallax] dot layer ----
  const plx = [...document.querySelectorAll('[data-parallax]')];
  if (plx.length){
    addEventListener('scroll', ()=>{
      const y = scrollY;
      plx.forEach(el=>{ const k = parseFloat(el.dataset.parallax) || .05; el.style.transform = `translateY(${y*k}px)`; });
    }, {passive:true});
  }

  // ---- letter-in for [data-letter-in] elements ----
  document.querySelectorAll('[data-letter-in]').forEach(el=>{
    const text = el.textContent;
    el.textContent = '';
    [...text].forEach((ch, i)=>{
      const s = document.createElement('span');
      s.className = 'letter';
      s.textContent = ch === ' ' ? '\u00A0' : ch;
      s.style.transitionDelay = (i*24) + 'ms';
      el.appendChild(s);
    });
    const lio = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){
        el.querySelectorAll('.letter').forEach(l=>l.classList.add('in'));
        lio.disconnect();
      }});
    }, { threshold: 0.4 });
    lio.observe(el);
  });
})();
