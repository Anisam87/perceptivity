/* Perceptivity — shared chrome: atmosphere, nav, footer, observers. */

(function(){
  // ---- atmosphere ----
  const atmos = `
    <div class="atmos-bg"></div>
    <canvas class="atmos-ascii" aria-hidden="true"></canvas>
    <div class="atmos-stars"></div>
    <div class="atmos-grain" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.92" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .8 0"/></filter><rect width="100%" height="100%" filter="url(#g)"/></svg>
    </div>`;
  document.body.insertAdjacentHTML('afterbegin', atmos);

  // ---- ascii data field ----------------------------------------------------
  // A fixed field of monospace glyphs whose density traces a structured-noise
  // map: a hot core up top fading through amber into the void. Reads as data
  // condensing into signal. Animated: the noise drifts downward like streaming
  // data, a slow brightness wave travels through it, and the core breathes.
  // Throttled to ~18fps, same alpha envelope + mask + left-dip → legible.
  (function(){
    const canvas = document.querySelector('.atmos-ascii');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    const RAMP = ' .,:;~=+xX* cso8#SØ@';   // sparse → dense
    const N = RAMP.length - 1;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // value-noise (hash + bilinear smoothstep) → soft organic clusters
    function hash(x, y){
      const n = Math.sin(x * 127.11 + y * 311.7) * 43758.5453;
      return n - Math.floor(n);
    }
    function vn(x, y){
      const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
      const u = xf*xf*(3-2*xf), v = yf*yf*(3-2*yf);
      const a = hash(xi,yi), b = hash(xi+1,yi), c = hash(xi,yi+1), d = hash(xi+1,yi+1);
      return a*(1-u)*(1-v) + b*u*(1-v) + c*(1-u)*v + d*u*v;
    }
    function fbm(x, y){
      return 0.58*vn(x,y) + 0.28*vn(x*2.13+9.1, y*2.13+4.7) + 0.14*vn(x*4.37+19, y*4.37+11);
    }

    const CW = 9.4, CH = 13.2, FS = 12.5;
    let W = 0, H = 0, cols = 0, rows = 0, light = false;

    function size(){
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = FS + "px 'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace";
      ctx.textBaseline = 'top';
      cols = Math.ceil(W / CW); rows = Math.ceil(H / CH);
      light = document.documentElement.dataset.theme === 'light';
    }

    function draw(t){
      ctx.clearRect(0, 0, W, H);
      // streaming flow + a breathing core
      const flow = t * 0.32;                       // noise scrolls down slowly
      const coreX = 0.74 + 0.018 * Math.sin(t * 0.45);
      const coreY = 0.17 + 0.022 * Math.sin(t * 0.63 + 1.3);
      const corePulse = 1.06 + 0.10 * Math.sin(t * 0.9);

      for (let r = 0; r < rows; r++){
        const ny = r / rows;
        const vert = Math.max(0, 1.12 - ny * 1.55);
        // a soft brightness band slowly traveling down the field
        const wave = 0.9 + 0.16 * Math.sin(t * 1.1 - r * 0.05);
        for (let c = 0; c < cols; c++){
          const nx = c / cols;
          const dx = (nx - coreX), dy = (ny - coreY);
          const core = Math.exp(-((dx*dx) / 0.085 + (dy*dy) / 0.032));
          const base = Math.max(vert, core * corePulse);
          if (base < 0.04) continue;
          const noise = fbm(c * 0.085, r * 0.13 + flow);
          let inten = base * (0.40 + 0.72 * noise) * wave;
          // gentle left dip so hero copy stays clean
          inten *= 0.74 + 0.26 * Math.min(1, nx * 1.7);
          if (inten < 0.05) continue;
          if (inten > 1) inten = 1;

          const gi = Math.round(inten * N);
          const glyph = RAMP[gi];
          if (glyph === ' ') continue;

          const x = c * CW, y = r * CH;
          if (light){
            ctx.fillStyle = 'rgba(44,64,100,' + (inten * 0.32).toFixed(3) + ')';
          } else {
            // cool signal-blue, kept close to the background so it reads as a
            // quiet texture rather than a bright overlay
            const ti = Math.pow(inten, 1.7);
            const rr = Math.round(86 + (150 - 86) * ti);
            const gg = Math.round(132 + (196 - 132) * ti);
            const bb = Math.round(190 + (255 - 190) * ti);
            ctx.fillStyle = 'rgba(' + rr + ',' + gg + ',' + bb + ',' + (0.12 + inten * 0.40).toFixed(3) + ')';
          }
          ctx.fillText(glyph, x, y);
        }
      }
    }

    let raf = 0, last = -1e9, running = false;
    const SPEED = 0.10;                 // time units per second of wall-clock
    function loop(now){
      raf = requestAnimationFrame(loop);
      if (now - last < 52) return;      // throttle → ~18fps
      last = now;
      draw(now * 0.001 * SPEED * 10);   // scale to comfortable drift
    }
    function start(){ if (!running && !reduce){ running = true; last = -1e9; raf = requestAnimationFrame(loop); } }
    function stop(){ running = false; cancelAnimationFrame(raf); }

    function boot(){ size(); draw(0); start(); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot);
    else boot();

    let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { size(); draw(performance.now() * 0.001 * SPEED * 10); }, 160); });
    new MutationObserver(() => { size(); draw(performance.now() * 0.001 * SPEED * 10); })
      .observe(document.documentElement, { attributes:true, attributeFilter:['data-theme'] });
    document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); });
  })();

  // ---- eye logo (svg) ----
  window.eyeLogoSVG = `
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M2 17 C 8 8, 24 8, 30 17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none" opacity=".85"/>
      <circle cx="16" cy="17" r="4.2" fill="currentColor"/>
      <circle cx="14.6" cy="15.6" r="1.1" fill="var(--void)" opacity=".9"/>
      <path d="M5 22 C 11 25, 21 25, 27 22" stroke="currentColor" stroke-width="1" stroke-linecap="round" fill="none" opacity=".35"/>
    </svg>`;

  // ---- nav ----
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const link = (href, label) => {
    const active = href.toLowerCase() === here ? ' active' : '';
    return `<a class="nav-link${active}" href="${href}">${label}</a>`;
  };

  const nav = `
    <div class="nav-wrap">
      <nav class="nav">
        <a class="brand" href="index.html" aria-label="Perceptivity home">
          <span class="eye-mark" style="color:var(--ink)">${window.eyeLogoSVG}</span>
          <span class="brand-word">perceptivity</span>
        </a>
        <div class="nav-links">
          ${link('index.html#simulate','Platform')}
          ${link('how-it-works.html','How it works')}
          ${link('index.html#resources','Resources')}
          ${link('company.html','Company')}
        </div>
        <div class="nav-actions">
          <a class="btn ghost" href="onboarding.html">Get started</a>
          <a class="btn primary" href="demo.html">Book a demo <span class="arrow">→</span></a>
        </div>
      </nav>
    </div>`;
  document.body.insertAdjacentHTML('afterbegin', nav);

  // ---- footer ----
  const foot = `
    <footer class="foot">
      <div class="foot-l">
        <span>© 2026 Perceptivity</span>
        <a href="index.html#simulate">Platform</a>
        <a href="how-it-works.html">How it works</a>
        <a href="index.html#resources">Resources</a>
        <a href="dashboard.html">Sample dashboard</a>
        <a href="company.html">Company</a>
        <a href="demo.html">Book a demo</a>
      </div>
      <div>Enterprise marketing for the generative internet · AEO / GEO / agentic commerce</div>
    </footer>`;
  document.body.insertAdjacentHTML('beforeend', foot);

  // ---- reveal observer ----
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }});
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  // rect-based fallback (IntersectionObserver is throttled in some embeds)
  function checkReveals(){
    const h = window.innerHeight || 800;
    document.querySelectorAll('.reveal:not(.in)').forEach(el=>{
      const r = el.getBoundingClientRect();
      if (r.top < h * 0.92 && r.bottom > 0){ el.classList.add('in'); io.unobserve(el); }
    });
  }
  let rTick = false;
  window.addEventListener('scroll', ()=>{ if(!rTick){ rTick=true; requestAnimationFrame(()=>{ checkReveals(); rTick=false; }); } }, { passive:true });
  requestAnimationFrame(()=>{ checkReveals(); requestAnimationFrame(checkReveals); });
  window.addEventListener('load', checkReveals);
  setTimeout(checkReveals, 400);
  setTimeout(()=> document.querySelectorAll('.reveal:not(.in)').forEach(el=>el.classList.add('in')), 2600);

  // ---- letter-in for [data-letter-in] elements ----
  document.querySelectorAll('[data-letter-in]').forEach(el=>{
    const text = el.textContent;
    el.textContent = '';
    [...text].forEach((ch, i)=>{
      const s = document.createElement('span');
      s.className = 'letter';
      s.textContent = ch === ' ' ? '\u00A0' : ch;
      s.style.transitionDelay = (i*20) + 'ms';
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
