/* Perceptivity — editorial shared chrome: grain, nav, footer, reveal. */
(function(){
  // ---- grain overlay ----
  document.body.insertAdjacentHTML('afterbegin', '<div class="grain" aria-hidden="true"></div>');

  // ---- wordmark ----
  const MARK = `<svg class="nav-mark" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10.2" stroke="currentColor" stroke-width="1.3" opacity=".5"/>
    <circle cx="12" cy="12" r="3.4" fill="currentColor"/>
    <path d="M12 1.8 V5 M12 19 V22.2 M1.8 12 H5 M19 12 H22.2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity=".7"/>
  </svg>`;
  window.PCV_MARK = MARK;

  // ---- nav ----
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const link = (href, label) => `<a class="nav-link" href="${href}">${label}</a>`;
  const hasDarkHero = !!document.querySelector('.hero');

  const nav = `
    <nav class="nav${hasDarkHero ? ' on-void-nav' : ''}" id="nav">
      <a class="nav-brand" href="index.html" aria-label="Perceptivity home">
        ${MARK}<span>Perceptivity</span>
      </a>
      <div class="nav-links">
        ${link('index.html#simulate','Simulate')}
        ${link('index.html#author','Author the answer')}
        ${link('index.html#india','India layer')}
        ${link('index.html#loop','How it works')}
        ${link('index.html#resources','Briefing')}
      </div>
      <div class="nav-actions">
        <a class="nav-link ghost-link" href="onboarding.html">Get started</a>
        <a class="btn primary sm" href="demo.html">Book a demo <span class="arrow">→</span></a>
      </div>
    </nav>`;
  document.body.insertAdjacentHTML('afterbegin', nav);

  const navEl = document.getElementById('nav');

  // nav state: on dark hero pages stay on-void until scrolled past hero
  function navState(){
    const y = window.scrollY;
    if (hasDarkHero){
      const hero = document.querySelector('.hero');
      const past = y > (hero.offsetHeight - 80);
      navEl.classList.toggle('on-void-nav', !past);
      navEl.classList.toggle('scrolled', past);
    } else {
      navEl.classList.toggle('scrolled', y > 8);
    }
  }
  navState();
  window.addEventListener('scroll', navState, { passive:true });

  // ---- footer ----
  const foot = `
    <footer class="foot">
      <div class="wrap">
        <div class="foot-main">
          <div class="foot-brand">${MARK}<span>Perceptivity</span></div>
          <p class="foot-tag">The answer-engine platform for India's category leaders. Sense what AI says, simulate what will change it, and prove the lift.</p>
        </div>
        <div class="foot-col">
          <h5>Platform</h5>
          <a href="index.html#simulate">Simulate</a>
          <a href="index.html#author">Author the answer</a>
          <a href="index.html#india">India answer layer</a>
          <a href="index.html#loop">How it works</a>
        </div>
        <div class="foot-col">
          <h5>Company</h5>
          <a href="index.html#operators">Operators</a>
          <a href="index.html#security">Enterprise &amp; security</a>
          <a href="index.html#resources">CMO briefing</a>
          <a href="demo.html">Book a demo</a>
        </div>
        <div class="foot-col">
          <h5>Get started</h5>
          <a href="demo.html">Book a demo</a>
          <a href="onboarding.html">Start onboarding</a>
          <a href="index.html#faq">FAQ</a>
        </div>
      </div>
      <div class="foot-base">
        <span>© 2026 Perceptivity · India-first AEO / GEO</span>
        <span>Engine-coverage figures from public sources · worked examples are illustrative; brand names shown for context only</span>
      </div>
    </footer>`;
  document.body.insertAdjacentHTML('beforeend', foot);

  // ---- reveal (rect-based; robust where IntersectionObserver is throttled) ----
  const reveals = () => document.querySelectorAll('.reveal:not(.in)');
  function checkReveals(){
    const h = window.innerHeight || 800;
    reveals().forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < h * 0.92 && r.bottom > 0) el.classList.add('in');
    });
  }
  let ticking = false;
  function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(()=>{ checkReveals(); ticking = false; }); } }
  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', onScroll, { passive:true });
  // initial passes (load + a couple of frames + a safety net)
  requestAnimationFrame(()=>{ checkReveals(); requestAnimationFrame(checkReveals); });
  window.addEventListener('load', checkReveals);
  setTimeout(checkReveals, 400);
  setTimeout(()=> document.querySelectorAll('.reveal:not(.in)').forEach(el=>el.classList.add('in')), 2600);
})();
