# Perceptivity — Claude Design Pack

## 1. Brand intent

Perceptivity is an AI perception company for the answer-engine age.

The brand should feel like:

- **Interstellar atmosphere**: mist, gravitational glow, deep silence, vast intelligence.
- **Nothing / Polestar minimalism**: sharp forms, monochrome discipline, no decorative clutter.
- **Agentic intelligence**: sensing, simulating, diagnosing, acting.
- **Organic perception**: a peacock plume, an eye, a black-hole singularity, and a citation graph — all reduced into a simple visual system.

The emotional target:

> “This company sees the invisible layer where AI forms belief.”

---

## 2. Visual principles

### Principle A — Perception, not dashboard
Do not make the website look like a SaaS analytics dashboard first. Make it feel like an operating system for a hidden cognitive layer.

### Principle B — Mist before metrics
Use atmospheric visuals before UI panels. The user should first feel that AI perception is invisible, fluid, and alive. Then show measurement.

### Principle C — One luminous intelligence
Every graphic should orbit around a central perceptive object: eye, plume, singularity, answer graph, or signal core.

### Principle D — Sharp typography, soft matter
Use sharp, compressed, high-confidence typography. Pair it with soft gradients, mist, glass, and animated diffusion.

---

## 3. Color system

```css
:root{
  --void:#010109;
  --space:#070713;
  --deep-violet:#151126;
  --violet:#9B83C5;
  --film-amber:#D99A6C;
  --dust:#E0C7AE;
  --ink:#F5E6D7;
  --cold-teal:#8AC7C2;
  --blue-grey:#A4BBC8;
  --muted:#C0AFC6;
  --line:rgba(245,230,215,.13);
  --glass:rgba(245,230,215,.055);
}
```

### Usage
- Background: `--void`, `--space`, `--deep-violet`
- Primary text: `--ink`
- Secondary text: `--muted`
- Accent 1: `--film-amber`
- Accent 2: `--cold-teal`
- Atmospheric secondary: `--violet`, `--dust`

---

## 4. Typography

Recommended web fonts:
- Display: `Inter Tight`, `Geist`, `Suisse Intl Condensed`, or `Avenir Next Condensed`
- Body: `Inter`, `Geist`, `Avenir Next`
- Data labels: `JetBrains Mono`, `IBM Plex Mono`

### Type rules
- Hero headlines: huge, tight, cinematic.
- Body copy: restrained, airy, editorial.
- Data labels: small uppercase mono, high letter spacing.
- Avoid generic rounded startup typography.

---

## 5. Core graphics

The pack includes 8 visual modules:

1. `mist-peacock-hero.svg`
2. `singularity-mark.svg`
3. `answer-graph-field.svg`
4. `source-constellation-map.svg`
5. `agentic-loop-rings.svg`
6. `vernacular-wave-field.svg`
7. `perception-plume-animated.svg`
8. `horizon-scan-divider.svg`

Each graphic can be used independently as a background, card visual, section divider, or motion layer.

---

## 6. Animation language

Motion should be slow, confident, and intelligent.

### Approved animations
- Mist drift
- Slow parallax
- Scanline sweep
- Plume breathing
- Citation nodes pulsing
- Ring precession
- Answer graph reveal
- Source constellation drift

### Avoid
- Bouncy startup motion
- Excessive neon
- Crypto-style particle overload
- Fast glitch effects
- Busy dashboards above the fold

---

## 7. Claude website prompt

Use this prompt inside Claude / Claude Artifacts:

> Build a dark, cinematic website for Perceptivity, an AI perception OS for AEO/GEO. Use the design pack assets and CSS classes. The site should feel like Interstellar meets Nothing/Polestar: deep space black, warm film amber, dust beige, cold teal, mist, singularity, peacock plume, and answer graph visuals. The story should move from invisible AI belief → measurement → diagnosis → simulation → action. Avoid generic SaaS dashboard aesthetics. Use huge sharp typography, atmospheric image sections, glass panels, and slow scroll-triggered animations.

---

## 8. Page structure recommendation

1. **Hero**  
   Use `mist-peacock-hero.svg` full bleed with dark gradient overlay. Headline:  
   “See how AI sees your brand.”

2. **The shift**  
   Editorial text block:  
   “Search was a page. AI is a belief system.”

3. **System loop**  
   Four steps: Sense → Simulate → Strike → Learn.

4. **Visual proof**  
   Use answer graph and source constellation cards.

5. **India wedge**  
   Vernacular / Hinglish / regional answer-engine visibility.

6. **Execution OS**  
   Workflow cards: detect, diagnose, assign, publish, measure.

7. **Closing**  
   “Don’t optimize for blue links. Optimize for belief.”

---

## 9. CSS import

```html
<link rel="stylesheet" href="./animations/perceptivity-claude-pack.css">
<script src="./animations/perceptivity-claude-pack.js"></script>
```

---

## 10. Component classes

```html
<div class="pc-hero-bg"></div>
<div class="pc-mist-layer"></div>
<div class="pc-scan-divider"></div>
<div class="pc-graphic-card pc-graph-card"></div>
<div class="pc-graphic-card pc-constellation-card"></div>
<div class="pc-plume-orb"></div>
<div class="pc-agentic-rings"></div>
<div class="pc-reveal">...</div>
```
