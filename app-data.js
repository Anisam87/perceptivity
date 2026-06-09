/* ============================================================
   PERCEPTIVITY — unified product data (worked example: VinFast)
   Auto & EV · India · Metros + Tier-1. Illustrative only.
   Every figure is labelled in-product. Black / white / dots.
   ============================================================ */

window.APP = (function(){

  const ENGINES = ["ChatGPT","Perplexity","Gemini","Claude","Copilot","Google AIO","Meta AI"];

  /* ---- the one number the CMO takes to the board ---- */
  const board = {
    label: "Share of Model",
    value: 47,           // 0–100 composite
    baseline: 38,        // 8 weeks ago
    series: [38,37,40,39,42,44,45,47],     // 8-week actual
    forecast: [47,49,51],                  // next 3 weeks (point)
    forecastBand: [[45,49],[46,52],[47,55]], // low/high
    unit: "/100",
    note: "Composite of visibility, answer share, citation presence and sentiment, weighted by buyer-question volume."
  };

  /* ---- supporting tiles (each with unit + baseline) ---- */
  const tiles = [
    { k:"Visibility",        v:52, unit:"/100", base:44, dir:"up",   sub:"named in any answer" },
    { k:"Answer share",      v:19, unit:"%",    base:14, dir:"up",   sub:"of category answers" },
    { k:"Citation presence", v:16, unit:"%",    base:18, dir:"down", sub:"answers citing your sources" },
    { k:"Sentiment",         v:"+0.21", unit:"", base:"+0.12", dir:"up", sub:"net tone, −1 to +1" }
  ];

  const topics = ["Range & charging","Price & value","Service network","Safety & ADAS","Reliability","Made-in-India"];

  /* engine × topic presence, 0–1 */
  const heatmap = {
    "ChatGPT":   [0.58, 0.44, 0.22, 0.40, 0.31, 0.52],
    "Perplexity":[0.49, 0.38, 0.18, 0.34, 0.28, 0.41],
    "Gemini":    [0.61, 0.47, 0.25, 0.44, 0.34, 0.55],
    "Claude":    [0.46, 0.36, 0.20, 0.30, 0.26, 0.38],
    "Copilot":   [0.40, 0.30, 0.14, 0.24, 0.20, 0.33],
    "Google AIO":[0.54, 0.41, 0.21, 0.38, 0.30, 0.48],
    "Meta AI":   [0.33, 0.24, 0.10, 0.18, 0.15, 0.27]
  };

  const answerShare = [
    { name:"Tata Motors",   v:29 },
    { name:"Mahindra",      v:22 },
    { name:"MG (JSW)",      v:15 },
    { name:"VinFast",       v:19, me:true },
    { name:"Hyundai",       v:9 },
    { name:"Long tail",     v:6 }
  ];

  /* ---- claims AI repeats — with Hinglish / Indic-script variants ---- */
  const claims = [
    { text:"Backed by a global EV maker with a Tamil Nadu plant under construction", verdict:"positive",
      engines:["ChatGPT","Gemini"], lang:"en" },
    { text:"VF7 ka ride quality premium hai, lekin service network abhi chhota hai", verdict:"positive",
      engines:["Meta AI"], lang:"Hinglish", gloss:"VF7's ride quality is premium, but the service network is still small." },
    { text:"VinFast India mein abhi unproven brand hai — resale uncertain", verdict:"outdated",
      engines:["Perplexity","Copilot"], lang:"Hinglish", gloss:"VinFast is still an unproven brand in India — resale uncertain." },
    { text:"வின்ஃபாஸ்ட் கார்களுக்கு இந்தியாவில் சார்ஜிங் வசதி இல்லை", verdict:"hallucinated",
      engines:["Gemini"], lang:"Tamil", gloss:"VinFast cars have no charging support in India. (False — uses standard CCS2 + partner network.)" },
    { text:"Only available on lease, not for outright purchase in India", verdict:"hallucinated",
      engines:["Grok","Copilot"], lang:"en" }
  ];

  /* ============================================================
     E · BRAND KNOWLEDGE GRAPH  (explorable)
     state: grounded | drift | gap
     ============================================================ */
  const graph = {
    brand: "VinFast",
    nodes: [
      { id:"brand",   type:"brand", label:"VinFast", x:50, y:50, state:"grounded" },

      // attributes
      { id:"range",   type:"attribute", label:"Range & charging", x:24, y:24, state:"grounded" },
      { id:"price",   type:"attribute", label:"Price & value",    x:50, y:16, state:"drift" },
      { id:"service", type:"attribute", label:"Service network",  x:78, y:26, state:"gap" },
      { id:"safety",  type:"attribute", label:"Safety & ADAS",    x:84, y:55, state:"grounded" },
      { id:"resale",  type:"attribute", label:"Resale & trust",   x:72, y:80, state:"gap" },
      { id:"madein",  type:"attribute", label:"Made-in-India",    x:30, y:78, state:"drift" },
      { id:"reliab",  type:"attribute", label:"Reliability",      x:16, y:54, state:"drift" },

      // claims / sources (leaf)
      { id:"c_plant", type:"claim",  label:"TN plant", x:14, y:88, state:"grounded" },
      { id:"c_lease", type:"claim",  label:'"lease only"', x:88, y:84, state:"gap" },
      { id:"s_pim",   type:"source", label:"PIM / pricing", x:62, y:8, state:"drift" },
      { id:"s_press", type:"source", label:"Indian press", x:6, y:38, state:"drift" }
    ],
    edges: [
      ["brand","range"],["brand","price"],["brand","service"],["brand","safety"],
      ["brand","resale"],["brand","madein"],["brand","reliab"],
      ["madein","c_plant"],["resale","c_lease"],["price","s_pim"],["reliab","s_press"]
    ],
    detail: {
      brand: { type:"Brand entity", grounded:"94%", engines:7,
        claim:"VinFast — Vietnamese EV maker entering India with the VF6 and VF7.",
        repeated:"Recognised as a brand entity by all 7 engines.",
        source:"Verified · brand guidelines + Wikipedia + press", facts:["VF6 and VF7 confirmed for India","Plant in Thoothukudi, Tamil Nadu","Global cumulative deliveries cited"] },
      range: { type:"Attribute · grounded", grounded:"88%", engines:6,
        claim:"VF7 offers up to ~450 km range (claimed), CCS2 fast charging.",
        repeated:"ChatGPT, Gemini, Google AIO, Perplexity, Claude, Copilot",
        source:"Grounded by · Spec sheets (synced 3 days ago)", facts:["Up to ~450 km claimed range","CCS2 standard + partner DC network","Heat-pump variant noted by 3 engines"] },
      price: { type:"Attribute · drifting", grounded:"61%", engines:4,
        claim:"Engines quote a launch price band that is now stale.",
        repeated:"Perplexity and Copilot cite pre-launch estimate; ChatGPT cites range.",
        source:"Drift · PIM updated 18 min ago, not yet re-scanned", facts:["Two engines quote an outdated estimate","Live ex-showroom band synced from PIM","Re-scan will re-ground on next cycle"] },
      service: { type:"Attribute · gap", grounded:"22%", engines:1,
        claim:"Almost no engine can describe the service / charging footprint.",
        repeated:"Only Meta AI mentions it — and calls it 'small'.",
        source:"Gap · no canonical source feeding this node", facts:["No service-network fact in any source","Buyers ask about it in 31% of VinFast queries","Highest-leverage gap to close"] },
      safety: { type:"Attribute · grounded", grounded:"90%", engines:6,
        claim:"5-star rated, Level-2 ADAS on higher trims.",
        repeated:"6 of 7 engines repeat the safety story accurately.",
        source:"Grounded by · Approved claims library", facts:["5-star crash rating cited","Level-2 ADAS on Plus trim","Consistent across engines"] },
      resale: { type:"Attribute · gap", grounded:"18%", engines:1,
        claim:"'Unproven resale' framing repeated; no counter-evidence grounded.",
        repeated:"Perplexity, Copilot frame resale as a risk.",
        source:"Gap · buy-back programme not in any source", facts:["Buy-back / assured-value scheme not grounded","Rival resale stories dominate the answer","Trust is the category — this is the moat"] },
      madein: { type:"Attribute · drifting", grounded:"57%", engines:4,
        claim:"Made-in-India story partially landed; plant status sometimes stale.",
        repeated:"4 engines mention the TN plant; 1 calls it 'planned' only.",
        source:"Drift · press citations lag the build timeline", facts:["Thoothukudi plant phase-1 live","One engine still says 'planned'","Localisation % not yet grounded"] },
      reliab: { type:"Attribute · drifting", grounded:"54%", engines:3,
        claim:"Reliability under-described; long-term India data is thin.",
        repeated:"Mostly inferred from global reviews, not India.",
        source:"Drift · India press coverage sparse", facts:["Global reviews cited as proxy","Few India long-term reviews exist","Owner stories not yet surfaced"] }
    }
  };

  /* ============================================================
     F · DIAGNOSIS — ranked perception gaps
     Each launches the Shape engine pre-loaded.
     ============================================================ */
  const gaps = [
    { id:"g_service", rank:1, title:"Buyers can't tell if VinFast can service their car",
      detail:"Service-network and charging-access questions appear in 31% of VinFast queries. Almost no engine can answer — the node is a gap with no canonical source.",
      node:"service", lift:4.6, conf:"High", effort:"M",
      segment:"Metro early-adopters · Tier-1 considerers", market:"India Metros + Tier-1",
      engines:["Meta AI"], queryShare:"31%" },
    { id:"g_resale", rank:2, title:"'Unproven resale' is repeated as fact on your own turf",
      detail:"Two engines frame VinFast resale as a risk with no counter-evidence. The buy-back / assured-value programme isn't grounded anywhere the models read.",
      node:"resale", lift:3.4, conf:"Med", effort:"M",
      segment:"First-time EV buyers", market:"India Metros", engines:["Perplexity","Copilot"], queryShare:"22%" },
    { id:"g_price", rank:3, title:"Two engines quote last quarter's price",
      detail:"PIM pricing updated 18 minutes ago but Perplexity and Copilot still cite a pre-launch estimate. A re-scan after a grounding push should clear this.",
      node:"price", lift:1.8, conf:"High", effort:"S",
      segment:"Value-led considerers", market:"India Tier-1 + Tier-2", engines:["Perplexity","Copilot"], queryShare:"17%" },
    { id:"g_lease", rank:4, title:"A false 'lease-only' claim is spreading",
      detail:"Two engines state VinFast is lease-only in India. Outright purchase is available. This is a hallucination, not drift — it needs a correction at source.",
      node:"c_lease", lift:1.2, conf:"High", effort:"S",
      segment:"All buyers", market:"India", engines:["Grok","Copilot"], queryShare:"9%" }
  ];

  /* ============================================================
     AUDIENCE — carried into Shape from the dashboard
     ============================================================ */
  const audience = {
    label:"Metro EV early-adopters",
    reach:"4.2M",
    demographics:[
      { k:"Age", v:"28–44" },
      { k:"Income", v:"₹18L+ household" },
      { k:"Geography", v:"Metros + Tier-1" },
      { k:"Languages", v:"English · Hindi · Tamil" }
    ],
    segments:[
      { name:"First-EV switchers", reach:"2.1M", fit:78, on:true, note:"Moving from a premium ICE SUV; range and service anxiety dominate." },
      { name:"Tech-forward enthusiasts", reach:"1.3M", fit:71, on:true, note:"Care about ADAS, software, OTA — already shortlisting EVs." },
      { name:"Fleet & corporate", reach:"0.8M", fit:54, on:false, note:"Total-cost and uptime led; longer cycle, lower volume." }
    ]
  };

  /* ============================================================
     G–H · SHAPE — gap → brief → draft → REVIEW GATE → live
     Three execution tracks. Review gate is the hero.
     ============================================================ */
  const drafts = [
    { id:"d_owned", track:"Owned page + schema", live:true, channel:"Webflow · FAQ schema",
      title:"VinFast India service & charging — coverage map + FAQ",
      body:"Authorised service centres across 14 cities, mobile-service radius, and CCS2 + partner DC charging access — published as a structured FAQ the models can read.",
      onbrand:true, grounded:true, groundsNode:"service",
      checks:[
        { k:"On-brand voice", ok:true, note:"Matches approved tone — confident, plain, no superlatives." },
        { k:"Grounded to graph", ok:true, note:"Every claim traces to the synced service-coverage source." },
        { k:"Legal / claims", ok:true, note:"Coverage numbers from approved facts library." }
      ] },
    { id:"d_earned", track:"Earned placement", live:false, channel:"Partner · Indian auto press",
      title:"Long-term ownership explainer with a tier-1 Indian auto publication",
      body:"A grounded ownership + service explainer placed with a publication the models already cite — closing the 'unproven in India' framing with real coverage.",
      onbrand:true, grounded:true, groundsNode:"resale",
      checks:[
        { k:"On-brand voice", ok:true, note:"Editorial, third-party — brand guidelines applied to supplied facts." },
        { k:"Grounded to graph", ok:true, note:"Buy-back programme + coverage facts attached." },
        { k:"Legal / claims", ok:false, note:"Assured-value figure pending legal sign-off before pitch." }
      ] },
    { id:"d_gen", track:"Generative creative", live:false, channel:"Roadmap · human-gated",
      title:"Service-coverage social cutdowns (3 variants, Hindi + Tamil)",
      body:"Draft social creative generated against the brand kit. Autonomous publishing is not enabled — every asset routes through this gate before anything ships.",
      onbrand:false, grounded:true, groundsNode:"service",
      checks:[
        { k:"On-brand voice", ok:false, note:"Variant B drifts off the approved palette of claims — reject or revise." },
        { k:"Grounded to graph", ok:true, note:"Coverage facts correct across all three variants." },
        { k:"Legal / claims", ok:true, note:"No unapproved claims detected." }
      ] }
  ];

  /* ============================================================
     I · EXPERIMENT — explicit A/B / held-out test object
     ============================================================ */
  const experiment = {
    name:"Service-gap close · VF service & charging FAQ",
    hypothesis:"Grounding the service-network node lifts answer share on service & charging queries without cannibalising other topics.",
    design:"Held-out prompt set as control. Treatment = service queries after the owned-page + schema goes live. Geography and segment held constant.",
    primary:"Answer share on service & charging prompts",
    treatment:{ label:"Treatment", desc:"42 service / charging prompts", reach:"Metros + Tier-1" },
    control:{ label:"Held-out control", desc:"38 matched prompts, withheld from the push", reach:"Same segments, same engines" },
    duration:"2 scan cycles (≈ 2 weeks)",
    guardrails:["No drop on price or safety topics","Sentiment net tone must not fall","Citation presence flat or up"]
  };

  /* ============================================================
     J · MEASUREMENT — predicted vs actual, confidence bands,
     treatment vs control, segment reach. Honest uncertainty.
     ============================================================ */
  const measure = {
    headline:{ predicted:4.6, actual:3.9, band:[2.7,5.1], unit:"pp", metric:"Answer share · service & charging" },
    perEngine:[
      { engine:"ChatGPT",    before:22, after:41 },
      { engine:"Gemini",     before:25, after:44 },
      { engine:"Google AIO", before:21, after:38 },
      { engine:"Perplexity", before:18, after:29 },
      { engine:"Claude",     before:20, after:31 },
      { engine:"Copilot",    before:14, after:22 },
      { engine:"Meta AI",    before:10, after:19 }
    ],
    tvc:{ treatment:3.9, control:0.6, note:"Control moved +0.6pp on its own (market drift). Net attributable lift ≈ +3.3pp." },
    segments:[
      { name:"First-EV switchers", reach:"2.1M", delta:"+4.4pp" },
      { name:"Tech-forward enthusiasts", reach:"1.3M", delta:"+2.9pp" }
    ],
    caveat:"Bands are 80% confidence. Lift is attributable to the treatment vs the held-out control — not a clean single-cause claim. One cycle of data."
  };

  /* ============================================================
     K · SYSTEM OF RECORD — every past cycle, searchable
     ============================================================ */
  const record = [
    { id:"r1", quarter:"Q2 FY26", title:"Safety & ADAS grounding", topic:"Safety", status:"Closed",
      gap:"Engines under-described VF7 safety and ADAS.",
      brief:"Push approved 5-star + Level-2 ADAS facts; earned review placement.",
      control:"34 held-out safety prompts", result:"+5.1pp answer share · 6/7 engines",
      learning:"Approved-claims grounding moves safety topics fast; earned placement compounds it.",
      confidence:71, predicted:4.8, actual:5.1 },
    { id:"r2", quarter:"Q2 FY26", title:"Range & charging accuracy", topic:"Range & charging", status:"Closed",
      gap:"Range numbers inconsistent across engines.",
      brief:"Sync spec sheets to graph; FAQ schema on owned range page.",
      control:"29 held-out range prompts", result:"+3.7pp answer share · range now grounded",
      learning:"Spec-sheet sync alone re-grounds factual nodes; schema speeds the re-scan.",
      confidence:74, predicted:3.4, actual:3.7 },
    { id:"r3", quarter:"Q3 FY26", title:"Made-in-India / plant story", topic:"Made-in-India", status:"Measuring",
      gap:"Plant described as 'planned' by some engines.",
      brief:"Press grounding + owned newsroom update on plant phase-1.",
      control:"22 held-out prompts", result:"In measurement — cycle 1 of 2",
      learning:"Pending — press citations lag; watching re-scan cadence.",
      confidence:68, predicted:2.6, actual:null },
    { id:"r4", quarter:"Q3 FY26", title:"Service & charging gap", topic:"Service network", status:"Live",
      gap:"Service-network node empty; buyers can't tell if VF can service their car.",
      brief:"Owned coverage map + FAQ schema; earned ownership explainer.",
      control:"38 held-out prompts", result:"Just shipped — see Prove",
      learning:"Tracking. First gap closed entirely from an empty node.",
      confidence:76, predicted:4.6, actual:3.9 }
  ];

  /* active campaigns strip (home) — derived from record + live work */
  const campaigns = [
    { id:"c_service", title:"Service & charging gap", stage:"Live · measuring", lift:"+3.9pp", node:"service", gap:"g_service" },
    { id:"c_resale",  title:"Resale-trust counter-story", stage:"Shape · review gate", lift:"fcast +3.4pp", node:"resale", gap:"g_resale" },
    { id:"c_price",   title:"Price re-grounding", stage:"Diagnose · queued", lift:"fcast +1.8pp", node:"price", gap:"g_price" }
  ];

  const integrations = [
    { group:"Owned / CMS", items:[
      { name:"Webflow", desc:"Push FAQ schema & copy to owned pages.", status:"Connected" },
      { name:"Contentful", desc:"Sync structured facts to the answer layer.", status:"Available" } ]},
    { group:"Source of truth", items:[
      { name:"PIM (Akeneo)", desc:"Live SKU, pricing & variants.", status:"Connected" },
      { name:"DAM", desc:"Approved assets & brand kit for drafts.", status:"Connected" } ]},
    { group:"Earned / partner", items:[
      { name:"Indian PR network", desc:"12 vetted publications the models cite.", status:"Connected" },
      { name:"Review repair", desc:"Coordinated response on review sources.", status:"Available" } ]},
    { group:"Workflow", items:[
      { name:"Jira", desc:"Shape actions become squad tickets.", status:"Connected" },
      { name:"Slack", desc:"Review-gate approvals routed to brand leads.", status:"Connected" } ]}
  ];

  /* ============================================================
     CREATIVE STUDIO — visual ads generated from brand imagery,
     grounded to the gap. The "Create" stage of the loop.
     ============================================================ */
  const creative = {
    brief:{
      objective:"Make VinFast's India service + charging footprint unmissable — to buyers and to the models that answer them.",
      mustSay:[
        "Authorised service in 14 cities",
        "Mobile service + 24×7 roadside assist",
        "CCS2 + partner DC fast-charging",
        "Outright purchase — no lease lock-in"
      ],
      kit:"VinFast red + chrome · VINFAST wordmark · confident, plain, no superlatives"
    },
    variants:[
      { id:"cr_display", format:"Display", spec:"1200 × 900", channel:"Google Demand Gen",
        img:"assets/ads/vf7-highway.png", lang:"en",
        kicker:"VINFAST VF7",
        headline:"Service in 14 cities.\nCharge anywhere.",
        sub:"Authorised centres, mobile service and CCS2 fast-charging across India.",
        cta:"Find your nearest centre",
        onbrand:true, grounded:true, groundsNode:"service" },
      { id:"cr_social", format:"Social", spec:"1 : 1", channel:"Meta Advantage+",
        img:"assets/ads/vf6-city.png", lang:"Hinglish",
        kicker:"VINFAST VF6",
        headline:"Service ab 14\ncities mein.",
        sub:"Ghar pe mobile service. Highway pe 24×7 roadside assist.",
        cta:"Book a test drive",
        onbrand:true, grounded:true, groundsNode:"service" },
      { id:"cr_story", format:"Story", spec:"9 : 16", channel:"Shorts / Reels",
        img:"assets/ads/vf7-highway.png", lang:"en",
        kicker:"OWN THE ROAD",
        headline:"14 cities.\nZero range anxiety.",
        sub:"VF7 · CCS2 fast-charge · 5-min roadside SLA",
        cta:"Explore the VF7",
        onbrand:false, grounded:true, groundsNode:"service",
        flag:"\u201CZero range anxiety\u201D is not in the approved claims library — revise or route to legal." }
    ]
  };

  /* ============================================================
     PUBLISH — channel push for approved creative
     ============================================================ */
  const channels = [
    { id:"owned",  name:"Owned page + FAQ schema", kind:"Owned · grounds the model", reach:"models read it",
      budget:"—", creative:"cr_display", live:true, must:true,
      note:"The grounding move. Publishes structured service facts the engines parse on the next scan." },
    { id:"google", name:"Google Demand Gen", kind:"Paid · in-market EV", reach:"3.1M", budget:"\u20B98.0L",
      creative:"cr_display", live:false,
      note:"In-market auto + EV-intent audiences, Metros + Tier-1." },
    { id:"meta",   name:"Meta Advantage+", kind:"Paid social", reach:"2.4M", budget:"\u20B96.5L",
      creative:"cr_social", live:false,
      note:"Hinglish creative to first-EV switchers and tech-forward enthusiasts." },
    { id:"earned", name:"Auto-press explainer", kind:"Earned · vetted partner", reach:"1.2M", budget:"\u20B93.0L",
      creative:null, live:false, queued:true,
      note:"Ownership + service explainer placed with a publication the models cite." }
  ];

  /* per-channel measured delivery (Measure stage inside Shape) */
  const channelResult = [
    { id:"owned",  name:"Owned page + schema", metric:"Re-grounded service node", value:"22% → 71%", sub:"engines describing coverage" },
    { id:"google", name:"Google Demand Gen", metric:"Centre-finder sessions", value:"18,400", sub:"\u20B943 cost / session" },
    { id:"meta",   name:"Meta Advantage+", metric:"Test-drive bookings", value:"612", sub:"\u20B91,062 cost / booking" }
  ];

  /* ============================================================
     A–C · INSTANT-AHA — one real-feeling answer, then the reveal
     ============================================================ */
  const aha = {
    query:"Best electric SUV under ₹25 lakh in India?",
    hinglishQuery:"₹25 lakh ke andar best electric SUV kaunsi hai?",
    answers:[
      { engine:"ChatGPT", lang:"en",
        text:"For under ₹25 lakh, the <b>Tata Curvv EV</b> and <b>Mahindra BE 6</b> are the strongest picks — Tata for its charging network, Mahindra for range and cabin. <b>MG Windsor EV</b> is worth a look on price.",
        omits:true, rival:"Tata Curvv EV" },
      { engine:"Perplexity", lang:"en",
        text:"Top options are the <b>Mahindra BE 6</b>, <b>Tata Curvv EV</b>, and <b>Hyundai Creta Electric</b>. VinFast has entered India but is still <b>unproven</b>, and resale is uncertain.",
        omits:false, rival:"Mahindra BE 6", stale:true },
      { engine:"Meta AI", lang:"Hinglish",
        text:"Is budget mein <b>Tata</b> aur <b>Mahindra</b> sabse safe choice hain. VinFast ka ride premium hai par <b>service network abhi chhota</b> hai.",
        gloss:"In this budget Tata and Mahindra are the safest choices. VinFast's ride is premium but the service network is still small.",
        omits:false, rival:"Tata", stale:true },
      { engine:"Gemini", lang:"en",
        text:"Consider the <b>Tata Curvv EV</b>, <b>Mahindra BE 6</b> and <b>MG Windsor</b>. (Some sources also list VinFast as <b>lease-only</b> in India.)",
        omits:false, rival:"Tata Curvv EV", false:true }
    ],
    verdict:"In the answer your buyers actually see, a rival is named first, your resale is called 'unproven', and one engine invents a 'lease-only' rule. You never get a report. You just lose the deal."
  };

  /* ---- per-screen rationale (UX / conversion) ---- */
  const rationale = {
    home:"The CMO consumes one number; the operator consumes the picture beneath it. Share of Model is the single board metric — trend plus a forecast band so the executive sees direction and honest uncertainty, not a vanity spike. Everything else is secondary and labelled with units and baselines so nothing reads as a clean single-cause claim. The active-campaigns strip ties the glanceable home to live work launched from gaps, proving this is one system, not a static report.",
    graph:"Visualising the brand is the product's spine. Nodes carry state — grounded (solid), drifting (faded), gap (dashed) — so the operator reads the health of their perception at a glance and knows exactly where truth is leaking. Selecting a node reveals the claim, which engines repeat it, and the source feeding it, turning an abstract 'AI says things about us' anxiety into a specific, fixable object. Drift flags the moment brand truth changes, syncing to PIM/DAM/brand docs.",
    diagnose:"Diagnosis ranks gaps by leverage, not noise, and every gap is a launch point — 'Shape this gap' carries the node, the audience and the forecast straight into the campaign engine. This removes the blank-page problem: the operator never starts from 'define audience', they start from the highest-value perception gap with context already loaded.",
    shape:"Execution is deliberately not lights-out. The hero of this screen is the review gate: every draft — generative, owned-page, or earned — is checked for on-brand voice and grounding-to-graph, then a human approves or rejects. That controlled-quality, grounded gate is the differentiator, not the content generation. Autonomous publishing is shown as roadmap and human-gated, so the design tells the truth about what is live today.",
    prove:"Attribution is only credible if the test is designed before the spend. The experiment is an explicit object — a held-out control set of prompts, with the treatment and guardrails named up front. Measurement then shows predicted vs actual with confidence bands and a treatment-vs-control delta, so lift is attributable rather than asserted. Uncertainty is shown honestly; there is no single-cause claim.",
    learn:"The system of record makes the copilot's memory tangible. Every past cycle keeps its brief, experiment, control, result and learning, and model confidence rises as cycles accumulate. The operator can query it — 'what moved answer-share for pricing claims last quarter?' — so each quarter compounds instead of resetting. This is constant learning made searchable."
  };

  return {
    ENGINES, board, tiles, topics, heatmap, answerShare, claims,
    graph, gaps, audience, drafts, experiment, measure, record, campaigns,
    integrations, creative, channels, channelResult, aha, rationale
  };
})();
