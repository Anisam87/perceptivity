/* ============================================================
   VINFAST — simulated workflow dataset (auto / EV, India)
   Illustrative only. Plausible figures, not official numbers.
   Powers login → workflow.html across four stages:
     1 Target Audience   2 Knowledge Graph
     3 Content (3rd-party) 4 Measurement
   ============================================================ */
window.VINFAST = {
  brand: "VinFast",
  category: "Automotive & EV",
  market: "India · Metros + Tier-1",
  query: "Which affordable electric SUV should I buy in India?",
  lineup: ["VF 3", "VF 6", "VF 7", "VF 8", "VF 9"],

  /* ----------------------------------------------------------
     STAGE 1 — TARGET AUDIENCE (demographic + psychographic)
     ---------------------------------------------------------- */
  audience: {
    addressable: 4.2,            // million in-market EV intenders (base)
    demographics: {
      age:      { min: 26, max: 45, label: "26 – 45" },
      income:   { floor: 18, label: "₹18L+ household" },
      geos:     ["Metros", "Tier-1 cities"],
      lifestage:["First EV", "Second car", "Upgrade from ICE"],
      gender:   { m: 64, f: 36 }
    },
    // psychographic dials — user fine-tunes these (0–100 weight)
    psychographics: [
      { id: "sustain", label: "Sustainability",   val: 78, note: "Buys the EV story, not just the car." },
      { id: "tech",    label: "Tech-forward",      val: 84, note: "Wants connected cabin, OTA, ADAS." },
      { id: "status",  label: "Status & design",   val: 66, note: "Pininfarina lines, badge value." },
      { id: "value",   label: "Value-seeking",     val: 61, note: "Total cost of ownership matters." },
      { id: "range",   label: "Range confidence",  val: 73, note: "Charging access is the deal-breaker." },
      { id: "family",  label: "Family & safety",   val: 52, note: "Space, 5-star, school-run ready." }
    ],
    // segments scored against the dials — match recomputes as dials move
    segments: [
      { id: "pioneer", name: "Metro EV Pioneer", share: 34,
        age: "30–40", income: "₹35L+", geo: "Bengaluru · Delhi · Mumbai",
        note: "Tech & sustainability-led early adopters. Second household car.",
        drivers: { sustain: .9, tech: 1, status: .8, value: .4, range: .7, family: .4 },
        signals: ["Searches 'VF 7 vs Creta EV'", "Active on EV owner forums", "Solar / smart-home owner"] },
      { id: "family", name: "Upgrading Family Pragmatist", share: 28,
        age: "35–45", income: "₹22L+", geo: "Pune · Hyderabad · Chennai",
        note: "Moving off ICE. Running cost, space and safety decide it.",
        drivers: { sustain: .5, tech: .6, status: .5, value: 1, range: .8, family: 1 },
        signals: ["Asks about 7-seater EVs", "Compares service network", "Reads NCAP ratings"] },
      { id: "fleet", name: "Green Fleet / Corporate ESG", share: 21,
        age: "Fleet desk", income: "B2B", geo: "Pan-metro corporates",
        note: "TCO + ESG targets. Buys in volume on subscription terms.",
        drivers: { sustain: 1, tech: .5, status: .3, value: 1, range: .9, family: .3 },
        signals: ["RFP for EV fleet", "Battery-subscription interest", "Scope-3 reporting pressure"] },
      { id: "firstcar", name: "Young Urban First-Car", share: 17,
        age: "26–32", income: "₹18L+", geo: "Tier-1 metros",
        note: "VF 3 buyer. Design and affordability over everything.",
        drivers: { sustain: .6, tech: .8, status: .9, value: .9, range: .5, family: .2 },
        signals: ["Reels-driven discovery", "Low down-payment queries", "City-only range is fine"] }
    ]
  },

  /* ----------------------------------------------------------
     STAGE 2 — BRAND KNOWLEDGE GRAPH
     positions are on a 1000 × 560 viewBox
     status: grounded | drift | gap
     ---------------------------------------------------------- */
  graph: {
    nodes: [
      { id: "vinfast", label: "VinFast", type: "brand", x: 500, y: 280, r: 46,
        status: "grounded", conf: 91, facts: 38,
        detail: ["Vietnamese global EV maker, India entry 2025.", "Positioning: affordable premium EV.", "Voice & naming framework synced."] },

      // models
      { id: "vf3", label: "VF 3", type: "model", x: 196, y: 96, r: 30,
        status: "gap", conf: 41, facts: 6,
        detail: ["Mini urban EV. Design-led, low entry price.", "AI rarely names VF 3 in 'first car' answers.", "Spec sheet not yet grounded."] },
      { id: "vf6", label: "VF 6", type: "model", x: 168, y: 252, r: 32,
        status: "drift", conf: 63, facts: 11,
        detail: ["B-segment SUV. Core volume model for India.", "Two engines quote pre-launch pricing.", "FAQ schema missing on product page."] },
      { id: "vf7", label: "VF 7", type: "model", x: 214, y: 420, r: 34,
        status: "grounded", conf: 80, facts: 14,
        detail: ["C-segment SUV — primary Creta-EV rival.", "Named in 3 of 7 engines for 'affordable electric SUV'.", "Range & ADAS facts grounded."] },
      { id: "vf8", label: "VF 8", type: "model", x: 470, y: 470, r: 30,
        status: "drift", conf: 58, facts: 12,
        detail: ["D-segment SUV, Pininfarina design.", "Battery-subscription terms misstated by Grok.", "Awaiting India price confirmation."] },
      { id: "vf9", label: "VF 9", type: "model", x: 716, y: 432, r: 28,
        status: "gap", conf: 38, facts: 7,
        detail: ["Full-size 6/7-seater flagship.", "Absent from 'family 7-seater EV' answers.", "Third-row + safety story not surfaced."] },

      // attributes
      { id: "design", label: "Pininfarina design", type: "attr", x: 470, y: 96, r: 26,
        status: "grounded", conf: 86, facts: 5,
        detail: ["Design DNA by Pininfarina (VF 8 / VF 9).", "Strong positive sentiment signal.", "Underused in mid-funnel answers."] },
      { id: "battery", label: "Battery subscription", type: "attr", x: 760, y: 150, r: 30,
        status: "drift", conf: 54, facts: 9,
        detail: ["Buy car, subscribe to battery — lowers entry price.", "Most-misunderstood VinFast fact in AI answers.", "Needs a canonical explainer + FAQ."] },
      { id: "warranty", label: "10-yr battery warranty", type: "attr", x: 836, y: 300, r: 26,
        status: "grounded", conf: 82, facts: 4,
        detail: ["Industry-leading 10-year / 200,000 km warranty.", "Trust signal — quote it more often.", "Grounded in approved claims library."] },
      { id: "charging", label: "V-GREEN charging", type: "attr", x: 690, y: 300, r: 26,
        status: "gap", conf: 44, facts: 6,
        detail: ["Charging network roll-out via V-GREEN partners.", "Range-anxiety answers don't mention it.", "Partnership coverage data not synced."] },
      { id: "plant", label: "Tamil Nadu plant", type: "attr", x: 360, y: 392, r: 24,
        status: "grounded", conf: 79, facts: 5,
        detail: ["Thoothukudi (TN) assembly — 'Make in India'.", "Localisation lowers cost & duty exposure.", "Supports value + jobs narrative."] },
      { id: "adas", label: "Smart cabin + ADAS", type: "attr", x: 612, y: 466, r: 24,
        status: "drift", conf: 60, facts: 8,
        detail: ["Connected cabin, OTA updates, Level-2 ADAS.", "Feature list inconsistent across engines.", "Map to spec sheet for grounding."] }
    ],
    edges: [
      ["vinfast","vf3"],["vinfast","vf6"],["vinfast","vf7"],["vinfast","vf8"],["vinfast","vf9"],
      ["vinfast","design"],["vinfast","battery"],["vinfast","warranty"],["vinfast","charging"],
      ["vinfast","plant"],["vinfast","adas"],
      ["vf8","design"],["vf9","design"],["vf6","battery"],["vf7","adas"],["vf7","charging"],
      ["vf9","adas"],["vf6","plant"],["battery","warranty"]
    ]
  },

  /* ----------------------------------------------------------
     STAGE 3 — CONTENT CREATION (3rd-party orchestration)
     status: Brief | Drafting | Review | Live
     ---------------------------------------------------------- */
  partners: [
    { id: "omni",     name: "Google Omni",        role: "Generative creative + Performance Max", status: "Connected" },
    { id: "webflow",  name: "Webflow",            role: "Schema + FAQ on owned pages",            status: "Connected" },
    { id: "jasper",   name: "Jasper",             role: "Long-form drafting at scale",            status: "Connected" },
    { id: "pr",       name: "PR partner network", role: "Tier-1 editorial placement",             status: "Connected" },
    { id: "yt",       name: "YouTube / creators", role: "Ownership & range explainers",           status: "Available" },
    { id: "kg",       name: "Perceptivity KG push", role: "Entity correction across engines",     status: "Connected" }
  ],
  content: [
    { id: "c1", title: "VF 7 vs Creta EV — interactive comparison + PMax creative",
      partner: "Google Omni", channel: "Performance Max · YouTube · Display",
      segment: "Metro EV Pioneer", grounds: "VF 7", closes: "Absent from 'affordable electric SUV' answers",
      lift: 3.6, status: "Drafting", fmt: "Comparison hub + 6 creatives" },
    { id: "c2", title: "Battery subscription, explained — canonical FAQ + schema",
      partner: "Webflow", channel: "Owned product page",
      segment: "Green Fleet / Corporate ESG", grounds: "Battery subscription", closes: "Most-misunderstood fact in AI answers",
      lift: 2.9, status: "Review", fmt: "FAQ schema + explainer" },
    { id: "c3", title: "VF 9 — the 7-seater EV family guide",
      partner: "Jasper", channel: "Owned editorial + syndication",
      segment: "Upgrading Family Pragmatist", grounds: "VF 9", closes: "Missing from 'family 7-seater EV' answers",
      lift: 2.4, status: "Brief", fmt: "Long-form guide" },
    { id: "c4", title: "Tier-1 publication review — '10-year warranty changes EV math'",
      partner: "PR partner network", channel: "Earned · auto vertical",
      segment: "Upgrading Family Pragmatist", grounds: "10-yr battery warranty", closes: "Low citation in trusted sources",
      lift: 4.1, status: "Brief", fmt: "Editorial placement" },
    { id: "c5", title: "Pininfarina design story — short-form social",
      partner: "Google Omni", channel: "Demand Gen · Reels · Shorts",
      segment: "Young Urban First-Car", grounds: "Pininfarina design", closes: "Design DNA underused mid-funnel",
      lift: 1.8, status: "Drafting", fmt: "9 short videos" },
    { id: "c6", title: "Live SKU + spec entity correction across 7 engines",
      partner: "Perceptivity KG push", channel: "Answer layer",
      segment: "All segments", grounds: "VF 6 · Smart cabin + ADAS", closes: "Engines quoting pre-launch pricing",
      lift: 2.2, status: "Live", fmt: "Entity + price fix" }
  ],

  /* ----------------------------------------------------------
     STAGE 4 — MEASUREMENT (closed loop)
     ---------------------------------------------------------- */
  measure: {
    kpis: [
      { k: "Answer share", before: 9,  after: 23, unit: "%",   note: "EV-SUV category answers" },
      { k: "Visibility",   before: 31, after: 54, unit: "/100",note: "7 engines × 6 topics" },
      { k: "Citation",     before: 12, after: 27, unit: "%",   note: "Quoted in trusted sources" },
      { k: "Sentiment",    before: 0.22, after: 0.46, unit: "", note: "Net of answer tone" }
    ],
    engineLift: [
      { engine: "ChatGPT",    before: 14, after: 31 },
      { engine: "Perplexity", before: 11, after: 27 },
      { engine: "Gemini",     before: 12, after: 29 },
      { engine: "Claude",     before: 8,  after: 19 },
      { engine: "Copilot",    before: 7,  after: 18 },
      { engine: "Google AIO", before: 13, after: 30 },
      { engine: "Grok",       before: 5,  after: 14 }
    ],
    segmentReach: [
      { seg: "Metro EV Pioneer",            reach: 1.42, conv: 3.1 },
      { seg: "Upgrading Family Pragmatist", reach: 1.08, conv: 2.4 },
      { seg: "Green Fleet / Corporate ESG", reach: 0.62, conv: 4.8 },
      { seg: "Young Urban First-Car",       reach: 0.71, conv: 1.9 }
    ],
    predVsActual: [
      { action: "VF 7 vs Creta EV comparison (Google Omni)", pred: 3.6, actual: 3.9 },
      { action: "Battery subscription FAQ (Webflow)",         pred: 2.9, actual: 2.6 },
      { action: "Entity + price correction (KG push)",        pred: 2.2, actual: 2.5 },
      { action: "Pininfarina design social (Google Omni)",    pred: 1.8, actual: 2.1 }
    ],
    drift10w: [9, 9, 11, 12, 14, 16, 18, 20, 22, 23]
  }
};
