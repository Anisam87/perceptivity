# Claude Design brief — Perceptivity (tryperceptivity.com)

## Read this first
This is a **targeted change brief for an existing, working site**, not a redesign.
Do **not** rebuild the site from scratch. Do **not** invent a new visual language.
Preserve the current brand, structure, the **B2A ("Business to Agent")** frame, and the
**Sense → Simulate → Act → Learn** loop. Make only the changes specified below, plus the
copy/visual fixes listed. Anything not mentioned, leave as-is.

---

## Non-negotiable brand lock (do not drift)
This is the **public Perceptivity brand**: cinematic, "Interstellar, but usable," dark.
Do **not** apply a warm/ivory/boardroom/editorial-serif skin — that skin is reserved for
enterprise (Asian Paints) surfaces and must never appear on the public site.

- **Colours (use these exact tokens, no substitutions):**
  - Void black `#010109`
  - Cream ink `#F5E6D7`
  - Film amber `#D99A6C`
  - Teal `#8AC7C2`
  - Violet `#9B83C5`
  - Plus peach + dust beige as accents
  - Signal/error red only for risk states
- **Type:** Inter Tight for display (huge, tight tracking, ~0.8 leading); Inter for body;
  JetBrains Mono, uppercase, for data labels. No serif display faces.
- **Signatures:** cream→peach→violet→teal gradient headlines; radial glows + starfield;
  glass rounded/pill panels; eye logo + lowercase wordmark; motion = scan / pulse / reveal.

---

## Change 1 — Hero headline & subhead (HIGHEST priority)
The current hero is a statement — *"Be the brand ChatGPT recommends."* — which is aspirational,
gain-framed, and narrowed to one engine. Replace it with a **loss-framed question the CMO cannot
answer**, which the "Request a category scan" CTA then resolves. (Question heroes usually
underperform; the exception is when the product is the answer to the question — which is the case here.)

- **Headline (use this, or an alternate below):**
  *"When your buyers ask AI what to buy, is the answer your brand — or your competitor's?"*
- **Alternates:**
  - Cinematic / on-brand: *"What is AI telling your buyers when you're not in the room?"*
  - Punchy / demo-forward: *"Ask AI what to buy in your category. Are you the answer?"*
- **Subhead:**
  *"Across ChatGPT, Gemini, Perplexity, Google AI Overviews and India's retail-AI surfaces,
  Perceptivity shows you the answer AI gives — then helps you change it."*
- Do **not** name only one engine in the headline; the pitch is seven engines plus retail AI.
- Keep present tense; render the loss/turn on a gradient line (cream→peach→violet→teal).
- The hero question must pair directly with the **Request a category scan** CTA: pose the
  unanswerable question, then offer the way to answer it.

## Change 2 — Primary CTA: "Request a category scan" (HIGH priority)
Replace every primary **"Book a demo"** CTA with **"Request a category scan."**
- Keep "Book a demo" only as a secondary/text link if needed.
- Add friction-reducing microcopy under the hero CTA:
  *"No generic demo. We scan your brand and named rivals before the call."*
- The pre-call scan is the strongest commercial asset on the site; the CTA must point at it.
- Update the demo/onboarding page title to **"Request your AI Perception Scan"** and the
  submit-success state to: *"Scan request received. We'll prepare a preliminary read on your
  brand and category."*

## Change 3 — India Answer Graph as a centerpiece (HIGH priority)
The current "India answer layer" section is too thin (engine pills + one paragraph). Rebuild it
into the most distinctive section on the site, because it is the real moat.
- Show **one buyer intent rendered as different AI answers** across: English, Hinglish, Hindi,
  Tamil, Bangla, Marathi; plus a voice-style query; plus Tier-1 vs Tier-2 city.
- Show that **the recommended brand and the brand risk change by layer.**
- Subcopy: *"Global AI-visibility tools see the English web. Indian demand is multilingual,
  regional, voice-led and increasingly retail-native."*
- Visual: extend the existing starfield/answer-graph metaphor — language/region/surface as
  layers that split the graph. Stay on-brand; do not introduce a new chart style.

## Change 4 — Add retail-AI surfaces (MODERATE-HIGH priority)
Add **Amazon Rufus, Flipkart assistant, Blinkit/Eternal AI** as tracked surfaces alongside the
seven engines — ideally inside the India Answer Graph section as a "retail-native" layer.
Make clear these are answer surfaces where Indian buyers convert, and where global tools don't look.

## Change 5 — Insert a "Diagnose" beat (MODERATE / optional)
Between Sense and Simulate, surface a short **Diagnose** beat answering *why AI says what it says*:
source graph, citation graph, claim conflicts, language/city differences. Do **not** rename or
remove the existing four stages — Diagnose is an explanatory beat under/after Sense, and the loop
remains **Sense → Simulate → Act → Learn**. (If it bloats the page, fold it into the Sense stage copy instead.)

## Change 6 — Mobile-first (HIGH priority — most traffic is on phones)
Treat the **phone (~360–390px) as the primary design surface**; desktop is the adaptation, not the
other way round. Audience skews Indian mid-tier Android on variable networks, so this is a
conversion and performance issue, not a polish pass. Build and verify mobile before desktop.

- **Type:** fluid sizing with `clamp()` so the huge Inter Tight display scales down hard on small
  screens without clipping; relax the ~0.8 leading slightly on mobile so lines don't collide.
  Body text and all form inputs ≥16px to prevent iOS zoom-on-focus.
- **No horizontal scroll, ever.** Remove fixed widths; guard against `overflow-x`. Everything
  reflows to a single column on phones.
- **Wide data visuals** (7×6 visibility heatmap, share-of-voice, the India Answer Graph language
  layers, the action-plan table): give them **mobile-specific layouts** — stack, or make them
  horizontally swipeable with a visible affordance, or render a simplified mobile view. Do not
  just shrink the desktop chart until it's illegible.
- **Performance budget:** on mobile, reduce or disable the heaviest effects — starfield density,
  multiple radial glows, parallax, large `backdrop-filter` blur (provide a solid/low-blur fallback).
  Respect `prefers-reduced-motion`. Lazy-load below-the-fold sections and heavy visuals. Target a
  fast first load on a throttled mid-range Android, not on a desktop.
- **CTA reachability:** the page is long; add a **sticky bottom "Request a category scan" bar** on
  mobile so the primary action is always thumb-reachable. Tap targets ≥44px.
- **Navigation:** proper mobile nav (hamburger or condensed), not a desktop bar crammed into 390px.
- **Forms (demo/onboarding):** single column, correct input types (email keyboard, etc.), large
  tap targets, no zoom-on-focus, clear submit state.
- **Verify** at 360px, 390px and 414px widths, and in both orientations, before returning.

---

## Honesty fixes (apply throughout — these are mandatory)
- Every illustrative/synthetic metric (e.g. the dashboard 58/100, citation counts, prediction-error
  figures, "campaigns measured") must be **visibly labelled** as *worked-example / simulation*.
  No headline number may read as a verified production result.
- Replace **"infosec reviews passed with ease"** with a factual, modest statement
  (e.g. "enterprise infosec review-ready"). Keep the honest **"SOC 2 Type II in progress"** framing.
- **No fabricated proof, no fake testimonials, no invented logos.** If a proof point isn't real,
  either omit it or label it illustrative.
- **Cite sources** for any external stat (engine usage numbers, market data) inline or in a footer.
  Mark anything unverified as **"Source: TBD — verify."** Never invent a citation.

---

## Focus discipline (do not dilute)
- Lead category playbooks with **Auto & EV** and **Paints & home improvement** — these are the
  real go-to-market targets. Beauty / FMCG / BFSI / real estate may appear as "also applies,"
  not as co-equal flagship cards. Avoid a "we do every category" spread; it reads as unfocused.
- Each playbook card: example buyer prompt → what AI may recommend today → what can go wrong →
  what Perceptivity controls. Concrete prompts, not abstractions.

## Preserve explicitly (do not overwrite)
- The **B2A / "Business to Agent"** section and frame — it is the sharpest asset on the site.
- The **compounding loop** narrative — **Learn** stays a first-class stage; do not fold it into
  "Control." The "sharper each quarter" story is the retention/moat argument.
- The honest FAQ (real-query explanation, global-vs-India answer, data safety).

## Length / quality bar
- The site is already long. Do **not** add net sections beyond the India Answer Graph rebuild and
  the retail-AI layer. Where you add, cut elsewhere. A CMO must grasp the value in ~10 seconds and
  reach a scan request within ~90 seconds.
- Fast and accessible, with no heavy gimmicks. Mobile is the primary surface — see Change 6.

## Output
Edit the existing HTML/CSS/JS in place. Return the updated files, a short changelog of what moved,
and nothing that breaks the current brand tokens or the B2A / loop spine.
