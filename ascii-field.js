/* Perceptivity — animated ASCII code-rain field for dark sections.
   Renders a faint monospace character grid that's brightest at the top
   and fades into the gradient. Subtle drift: cells flicker + a slow wave. */
(function(){
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    // still paint a static field, just no animation
    var REDUCE = true;
  }
  var GLYPHS = '@#S80X+=$ '.split('');
  // weight toward sparser glyphs/space for the airy look
  var POOL = '@@##SS88001XX++==      '.split('');

  function mount(host){
    if (host.querySelector('.ascii-field')) return;
    var cv = document.createElement('canvas');
    cv.className = 'ascii-field';
    cv.setAttribute('aria-hidden','true');
    host.insertBefore(cv, host.firstChild);
    var ctx = cv.getContext('2d');
    var W=0, H=0, cols=0, rows=0, cw=0, ch=0, dpr=1, grid=[];
    var FS = 15;            // font size in css px
    var t = 0;

    function build(){
      dpr = Math.min(window.devicePixelRatio||1, 2);
      W = host.clientWidth; H = host.clientHeight;
      cv.width = W*dpr; cv.height = H*dpr;
      cv.style.width = W+'px'; cv.style.height = H+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
      ctx.font = FS+'px "JetBrains Mono", ui-monospace, monospace';
      ctx.textBaseline = 'top';
      cw = FS*0.92; ch = FS*1.5;
      cols = Math.ceil(W/cw)+1; rows = Math.ceil(H/ch)+1;
      grid = new Array(cols*rows);
      for (var i=0;i<grid.length;i++){
        grid[i] = { c: POOL[(Math.random()*POOL.length)|0], p: Math.random() };
      }
    }

    function draw(){
      ctx.clearRect(0,0,W,H);
      var maxRow = rows; // fade computed per row
      for (var y=0;y<rows;y++){
        // vertical falloff: bright near top, gone by ~58% of host height
        var vy = (y*ch)/H;
        var fade = Math.max(0, 1 - vy/0.62);
        fade = fade*fade; // ease
        if (fade <= 0.001) continue;
        for (var x=0;x<cols;x++){
          var g = grid[y*cols+x];
          var ch0 = g.c;
          if (ch0 === ' ') continue;
          // slow wave shimmer + per-cell phase
          var wave = 0.5 + 0.5*Math.sin(t*0.6 + x*0.25 - y*0.18 + g.p*6.283);
          var a = fade * (0.10 + 0.22*wave) * 0.9;
          ctx.fillStyle = 'rgba(150,196,255,'+a.toFixed(3)+')';
          ctx.fillText(ch0, x*cw, y*ch);
        }
      }
    }

    var raf=null, last=0;
    function loop(ts){
      if (!last) last = ts;
      var dt = (ts-last)/1000; last = ts;
      t += dt;
      // occasionally flip a few cells for the "rain" twinkle
      var flips = Math.max(2, (cols*rows*0.012)|0);
      for (var k=0;k<flips;k++){
        var idx = (Math.random()*grid.length)|0;
        if (grid[idx]) grid[idx].c = POOL[(Math.random()*POOL.length)|0];
      }
      draw();
      raf = requestAnimationFrame(loop);
    }

    var ro = ('ResizeObserver' in window) ? new ResizeObserver(function(){ build(); draw(); }) : null;
    function start(){
      build(); draw();
      if (REDUCE) return;
      if (raf) cancelAnimationFrame(raf);
      last = 0; raf = requestAnimationFrame(loop);
    }
    if (ro) ro.observe(host);
    window.addEventListener('resize', function(){ build(); draw(); }, {passive:true});
    start();
  }

  function init(){
    document.querySelectorAll('.hero, .final-cta').forEach(mount);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
