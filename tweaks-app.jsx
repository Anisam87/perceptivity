/* Perceptivity — Tweaks app (mounts only the panel; page stays vanilla).
   Writes to :root[data-serif|data-canvas|data-accent], which editorial.css hooks.
   Lazy-loads the alternate serif families on demand. */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "serif": "newsreader",
  "canvas": "paper",
  "accent": "signal"
}/*EDITMODE-END*/;

const FONT_LINKS = {
  spectral: "https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;1,400&display=swap",
  bodoni:   "https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..600;1,6..96,400&display=swap"
};
function ensureFont(serif){
  if (!FONT_LINKS[serif] || document.getElementById('font-'+serif)) return;
  const l = document.createElement('link');
  l.id = 'font-'+serif; l.rel = 'stylesheet'; l.href = FONT_LINKS[serif];
  document.head.appendChild(l);
}

function applyTweaks(t){
  const r = document.documentElement;
  // serif
  ensureFont(t.serif);
  if (t.serif === 'newsreader') r.removeAttribute('data-serif'); else r.setAttribute('data-serif', t.serif);
  // canvas
  if (t.canvas === 'paper') r.removeAttribute('data-canvas'); else r.setAttribute('data-canvas', t.canvas);
  // accent
  if (t.accent === 'signal') r.removeAttribute('data-accent'); else r.setAttribute('data-accent', t.accent);
}

function TweaksApp(){
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(()=>{ applyTweaks(t); }, [t.serif, t.canvas, t.accent]);
  return (
    React.createElement(TweaksPanel, { title: "Tweaks" },
      React.createElement(TweakSection, { label: "Display serif" }),
      React.createElement(TweakRadio, {
        label: "Typeface", value: t.serif,
        options: [
          { value:'newsreader', label:'Newsreader' },
          { value:'spectral',   label:'Spectral' },
          { value:'bodoni',     label:'Bodoni' }
        ],
        onChange: v => setTweak('serif', v)
      }),
      React.createElement(TweakSection, { label: "Canvas" }),
      React.createElement(TweakRadio, {
        label: "Paper tone", value: t.canvas,
        options: [ { value:'paper', label:'Slate' }, { value:'bone', label:'Bone' } ],
        onChange: v => setTweak('canvas', v)
      }),
      React.createElement(TweakSection, { label: "Accent" }),
      React.createElement(TweakRadio, {
        label: "Accent colour", value: t.accent,
        options: [
          { value:'signal', label:'Signal' },
          { value:'azure',  label:'Azure' },
          { value:'slate',  label:'Slate' }
        ],
        onChange: v => setTweak('accent', v)
      })
    )
  );
}

(function mount(){
  const host = document.createElement('div');
  host.id = 'tweaks-root';
  document.body.appendChild(host);
  ReactDOM.createRoot(host).render(React.createElement(TweaksApp));
})();
