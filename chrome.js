/* Perceptivity — shared chrome: atmosphere, nav, footer, observers. */

(function(){
  // ---- atmosphere ----
  const atmos = `
    <div class="atmos-bg"></div>
    <div class="atmos-stars"></div>
    <div class="atmos-grain" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.92" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .8 0"/></filter><rect width="100%" height="100%" filter="url(#g)"/></svg>
    </div>`;
  document.body.insertAdjacentHTML('afterbegin', atmos);

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
          ${link('index.html#platform','Platform')}
          ${link('index.html#industries','Industries')}
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
        <a href="index.html#platform">Platform</a>
        <a href="index.html#resources">Resources</a>
        <a href="index.html#industries">Industries</a>
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
