/* @ds-bundle: {"format":3,"namespace":"PerceptivityDesignSystem_733687","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"Kicker","sourcePath":"components/identity/Kicker.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"8aceadbcc5d8","components/buttons/IconButton.jsx":"ebb8fc783412","components/identity/Kicker.jsx":"ab19968381d1"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.PerceptivityDesignSystem_733687 = window.PerceptivityDesignSystem_733687 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Injects a component's CSS once per document. */
function useStyles(id, css) {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
const CSS = `
.pcv-btn {
  --_h: 50px;
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  height: var(--_h); padding: 0 26px;
  font-family: var(--font-mono); font-size: 10.5px; font-weight: 400;
  text-transform: uppercase; letter-spacing: .26em; line-height: 1;
  border-radius: var(--radius-pill);
  border: 1px solid var(--hairline-strong);
  background: transparent; color: var(--ink);
  cursor: pointer; text-decoration: none; white-space: nowrap;
  transition: opacity var(--dur-hover) var(--ease), border-color var(--dur-hover) var(--ease), background var(--dur-hover) var(--ease);
}
.pcv-btn:hover { opacity: var(--hover-dim); border-color: var(--ink); }
.pcv-btn:focus-visible { outline: none; border-color: var(--ink); box-shadow: 0 0 0 1px var(--ink); }
.pcv-btn--primary { background: var(--ink); color: #000; border-color: var(--ink); }
.pcv-btn--primary:hover { opacity: var(--hover-dim); }
.pcv-btn--ghost { border-color: transparent; padding-inline: 8px; }
.pcv-btn--ghost:hover { border-color: transparent; }
.pcv-btn--sm { --_h: 40px; padding: 0 18px; letter-spacing: .22em; }
.pcv-btn--lg { --_h: 56px; padding: 0 34px; }
.pcv-btn[disabled], .pcv-btn[aria-disabled="true"] { opacity: .34; pointer-events: none; }
.pcv-btn__arrow { display: inline-block; transition: transform var(--dur-hover) var(--ease); }
.pcv-btn:hover .pcv-btn__arrow { transform: translateX(5px); }
`;

/**
 * Perceptivity outline-pill button. Hover dims + brightens the border;
 * never moves. Optional arrow nudges right on hover.
 */
function Button({
  variant = 'outline',
  // 'outline' | 'primary' | 'ghost'
  size = 'md',
  // 'sm' | 'md' | 'lg'
  arrow = false,
  href,
  disabled = false,
  className = '',
  children,
  ...rest
}) {
  useStyles('pcv-btn-styles', CSS);
  const cls = ['pcv-btn', variant !== 'outline' && `pcv-btn--${variant}`, size !== 'md' && `pcv-btn--${size}`, className].filter(Boolean).join(' ');
  const content = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, children), arrow && /*#__PURE__*/React.createElement("span", {
    className: "pcv-btn__arrow",
    "aria-hidden": "true"
  }, "\u2192"));
  if (href && !disabled) {
    return /*#__PURE__*/React.createElement("a", _extends({
      className: cls,
      href: href
    }, rest), content);
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    disabled: disabled,
    "aria-disabled": disabled || undefined
  }, rest), content);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function useStyles(id, css) {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
const CSS = `
.pcv-iconbtn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 48px; height: 48px; padding: 0;
  border-radius: var(--radius-circle);
  border: 1px solid var(--hairline-strong);
  background: transparent; color: var(--ink);
  cursor: pointer;
  transition: opacity var(--dur-hover) var(--ease), border-color var(--dur-hover) var(--ease);
}
.pcv-iconbtn:hover { opacity: var(--hover-dim); border-color: var(--ink); }
.pcv-iconbtn:focus-visible { outline: none; border-color: var(--ink); box-shadow: 0 0 0 1px var(--ink); }
.pcv-iconbtn--sm { width: 38px; height: 38px; }
.pcv-iconbtn--lg { width: 56px; height: 56px; }
.pcv-iconbtn--square { border-radius: var(--radius); }
.pcv-iconbtn[disabled] { opacity: .34; pointer-events: none; }
.pcv-iconbtn svg { width: 18px; height: 18px; stroke-width: 1.4; }
`;

/**
 * Circular hairline icon button. Pass a single icon node (e.g. a Lucide
 * <svg> with strokeWidth ~1.4 to match the hairline aesthetic).
 */
function IconButton({
  size = 'md',
  // 'sm' | 'md' | 'lg'
  shape = 'circle',
  // 'circle' | 'square'
  label,
  // accessible label
  className = '',
  children,
  ...rest
}) {
  useStyles('pcv-iconbtn-styles', CSS);
  const cls = ['pcv-iconbtn', size !== 'md' && `pcv-iconbtn--${size}`, shape === 'square' && 'pcv-iconbtn--square', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    "aria-label": label
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/identity/Kicker.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function useStyles(id, css) {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
const CSS = `
.pcv-kicker {
  display: inline-flex; align-items: center; gap: 12px;
  font-family: var(--font-mono); font-size: var(--text-kicker);
  text-transform: uppercase; letter-spacing: var(--tracking-kicker);
  line-height: 1; color: var(--ink-faint);
}
.pcv-kicker__dot {
  width: 5px; height: 5px; border-radius: 50%; flex: none;
  background: var(--ink); box-shadow: var(--glow-dot);
}
.pcv-kicker__index { color: var(--ink-muted); }
`;

/**
 * Eyebrow label: a glowing 5px dot followed by mono caps text. The signature
 * Perceptivity eyebrow. Optionally lead with a section index.
 */
function Kicker({
  index,
  accent,
  className = '',
  children,
  ...rest
}) {
  useStyles('pcv-kicker-styles', CSS);
  const dotStyle = accent ? {
    background: accent,
    boxShadow: `0 0 6px ${accent}`
  } : undefined;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ['pcv-kicker', className].filter(Boolean).join(' ')
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "pcv-kicker__dot",
    style: dotStyle,
    "aria-hidden": "true"
  }), index && /*#__PURE__*/React.createElement("span", {
    className: "pcv-kicker__index"
  }, index), /*#__PURE__*/React.createElement("span", null, children));
}
Object.assign(__ds_scope, { Kicker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/identity/Kicker.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Kicker = __ds_scope.Kicker;

})();
