/* ============================================================
   PERCEPTIVITY — shared adaptive theme engine.
   Load in <head> (synchronous) on every page:
     <link rel="stylesheet" href="theme-adaptive.css">
     <script src="theme.js"></script>

   Phase 1 (runs immediately, before paint): resolve dark/light and
   stamp <html data-theme> so there is no flash.
   Phase 2 (on DOMContentLoaded): build the floating toggle and wire
   the cross-fade dissolve between themes.

   Mode pref ('auto' | 'light' | 'dark') persists in localStorage.
   'auto' follows the visitor's local clock: 06:00–18:59 → light, else dark.
   ============================================================ */
(function(){
  var root = document.documentElement;
  var KEY = 'perc-theme-mode';
  var DAY_START = 6, DAY_END = 19;           // [06:00, 19:00) → light

  function clockTheme(){
    var h = new Date().getHours();
    return (h >= DAY_START && h < DAY_END) ? 'light' : 'dark';
  }
  function resolve(mode){
    return (mode === 'light' || mode === 'dark') ? mode : clockTheme();
  }
  function readMode(){
    try { return localStorage.getItem(KEY) || 'auto'; } catch(e){ return 'auto'; }
  }

  // ---- Phase 1: pre-paint ----
  var mode = readMode();
  root.dataset.theme = resolve(mode);
  root.dataset.themeMode = mode;

  // expose for any page that wants to react to theme
  window.PerceptivityTheme = {
    get: function(){ return root.dataset.theme; },
    mode: function(){ return root.dataset.themeMode; }
  };

  // ---- Phase 2: toggle + dissolve ----
  function build(){
    if (document.querySelector('.theme-toggle')) return;

    var ICON_SUN = '<svg class="tt-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.4v2.6M12 19v2.6M4.4 4.4l1.9 1.9M17.7 17.7l1.9 1.9M2.4 12h2.6M19 12h2.6M4.4 19.6l1.9-1.9M17.7 6.3l1.9-1.9"/></svg>';
    var ICON_MOON = '<svg class="tt-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4 6.6 6.6 0 1 0 20 14.5z"/></svg>';

    // full-screen dissolve veil (must live on body)
    var veil = document.createElement('div');
    veil.className = 'theme-veil';
    document.body.appendChild(veil);

    var btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Switch colour theme');
    btn.innerHTML =
      '<span class="tt-icon">' + ICON_SUN + ICON_MOON + '</span>' +
      '<span class="tt-label"><span class="tt-mode"></span> theme</span>';
    // mount into the injected footer's link cluster; fall back gracefully
    var host = document.querySelector('.foot .foot-l') ||
               document.querySelector('.foot') || document.body;
    host.appendChild(btn);
    var modeEl = btn.querySelector('.tt-mode');

    function label(m){
      var theme = resolve(m);
      modeEl.textContent = (m === 'auto') ? ('auto · ' + theme) : m;
    }

    function set(m){ try{ localStorage.setItem(KEY, m); }catch(e){} }

    // apply instantly (no animation) — used on init
    function applyInstant(m){
      root.dataset.theme = resolve(m);
      root.dataset.themeMode = m;
      label(m);
    }

    // apply with a fade-through dissolve
    var busy = false;
    function applyAnimated(m){
      if (busy) return;
      var nextTheme = resolve(m);
      if (nextTheme === root.dataset.theme){    // mode changed but look is same
        root.dataset.themeMode = m; label(m); set(m); return;
      }
      busy = true;
      // veil colour = the theme we are arriving at
      veil.style.background = (nextTheme === 'light') ? '#F4ECE0' : '#070713';
      root.classList.add('theme-transition');   // soft colour tween underneath
      veil.classList.add('show');                // fade veil IN (covers page)

      setTimeout(function(){
        root.dataset.theme = nextTheme;          // swap while hidden
        root.dataset.themeMode = m;
        label(m); set(m);
        veil.classList.remove('show');           // fade veil OUT → reveal new theme
        setTimeout(function(){
          root.classList.remove('theme-transition');
          busy = false;
        }, 420);
      }, 260);
    }

    // init label from pre-paint state
    mode = root.dataset.themeMode || 'auto';
    label(mode);

    var ORDER = ['auto','light','dark'];
    btn.addEventListener('click', function(){
      mode = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
      applyAnimated(mode);
    });

    // while in auto, re-check the clock each minute so the page flips
    // gracefully if the visitor crosses the dawn/dusk boundary live
    setInterval(function(){
      if ((root.dataset.themeMode || 'auto') === 'auto'){
        if (clockTheme() !== root.dataset.theme){ mode = 'auto'; applyAnimated('auto'); }
      }
    }, 60000);
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
