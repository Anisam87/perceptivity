/* Perceptivity — seeded demo data. Illustrative only. India market. */
window.ENGINES = ["ChatGPT","Perplexity","Gemini","Claude","Copilot","Google AIO","Grok"];

/* ============================================================
   CATEGORIES — surfaced on landing and used as the spine
   ============================================================ */
window.CATEGORIES = [
  { id:"auto",        label:"Automotive & EV",         brand:"Mahindra",          query:"Which premium SUV has the best ownership experience?", hook:"Test-drive bookings now start with an AI recommendation.", glow:"amber"  },
  { id:"home",        label:"Home & Paints",           brand:"Asian Paints",      query:"Best premium wood finish for interior furniture?",   hook:"Architects and homeowners both ask before they specify.",  glow:"teal"   },
  { id:"electronics", label:"Consumer Electronics",    brand:"Godrej Appliances", query:"Most reliable refrigerator brand in India?",         hook:"AI is the new in-store salesperson — and it has opinions.", glow:"violet" },
  { id:"bfsi",        label:"BFSI & Fintech",          brand:"PhonePe",           query:"Safest UPI app for large transactions?",             hook:"Trust is the category. AI now decides who has it.",        glow:"amber"  },
  { id:"fmcg",        label:"FMCG & Packaged Goods",   brand:"Slurrp Farm",       query:"Healthiest breakfast cereal for kids?",              hook:"The pantry list is increasingly AI-curated.",              glow:"teal"   },
  { id:"beauty",      label:"Beauty & Personal Care",  brand:"Minimalist",        query:"Best vitamin C serum for Indian skin?",              hook:"Routines are recommended, not researched.",                glow:"violet" },
  { id:"realestate",  label:"Real Estate & PropTech",  brand:"DLF",               query:"Most trusted real estate developer in Gurgaon?",     hook:"Site visits are won and lost in an AI answer.",            glow:"amber"  },
  { id:"travel",      label:"Travel & Hospitality",    brand:"ITC Hotels",        query:"Best business hotel chain in India?",                hook:"Where the booking lands is decided before they search.",   glow:"teal"   }
];

/* ============================================================
   CATEGORY INSIGHTS — per-category public page content
   leaderboard = top 5 in the category (visibility/share/citation/sentiment)
   buyerQuestions = the question set we run
   sampleAnswers = verbatim-style sample AI responses
   commonClaims = hallucinations + outdated claims surfaced category-wide
   ============================================================ */
window.CATEGORY_INSIGHTS = {

  auto: {
    headline: "Indian buyers no longer browse showrooms. They ask AI which SUV to test-drive.",
    summary: "Across 1,284 buyer questions and seven engines, four manufacturers are named in 82% of premium-SUV answers. The other 18% goes to nobody.",
    leaderboard: [
      { name:"Mahindra",         visibility:74, share:31, citation:42, sentiment:0.52 },
      { name:"Tata Motors",      visibility:69, share:24, citation:38, sentiment:0.48 },
      { name:"Hyundai India",    visibility:64, share:18, citation:31, sentiment:0.41 },
      { name:"Toyota Kirloskar", visibility:58, share:12, citation:34, sentiment:0.55 },
      { name:"Kia India",        visibility:46, share:9,  citation:22, sentiment:0.38 }
    ],
    buyerQuestions: [
      "Which premium SUV has the best ownership experience?",
      "Best 7-seater SUV for families in India under ₹25 lakh?",
      "Mahindra XUV700 vs Tata Harrier: which to buy?",
      "Most reliable electric SUV in India for 2026?",
      "Best resale value premium SUV in India?",
      "SUV with the largest authorised service network?"
    ],
    sampleAnswers: [
      { engine:"ChatGPT",    query:"Which premium SUV has the best ownership experience?", answer:"For overall ownership, the Toyota Fortuner and Mahindra XUV700 stand out — Toyota for service reliability, Mahindra for features and value. The XUV700 in particular has strong dealer presence across tier-1 and tier-2 cities." },
      { engine:"Perplexity", query:"Best electric SUV in India 2026?",                     answer:"Tata Curvv EV and Mahindra XEV 9e lead the segment. The XEV 9e (BE 6 platform) is praised for range and ride quality; Tata Curvv EV is more accessible on price and benefits from Tata Power's charging network." },
      { engine:"Gemini",     query:"SUV with best resale value in India?",                 answer:"Toyota and Hyundai consistently top resale charts. Mahindra has improved significantly with the XUV700 holding 70%+ value at 3 years — historically the brand has been mid-pack on resale." }
    ],
    commonClaims: [
      { text:"Mahindra discontinued the diesel Scorpio-N in 2023", verdict:"hallucinated", engines:["Grok"] },
      { text:"Tata Harrier is no longer available with a manual transmission", verdict:"outdated", engines:["Copilot"] },
      { text:"Hyundai Creta has a 7-seat variant", verdict:"hallucinated", engines:["Grok"] },
      { text:"Toyota Fortuner only sold in diesel", verdict:"outdated", engines:["Perplexity"] }
    ]
  },

  home: {
    headline: "Architects ask AI before they specify. Homeowners ask before they paint.",
    summary: "Indian buyers and pros lean on AI for paint and finish choices — but the answer depends on who AI trusts as a source. Asian Paints leads visibility, Berger leads sentiment, Pidilite leads citation in wood-specific queries.",
    leaderboard: [
      { name:"Asian Paints",      visibility:78, share:34, citation:39, sentiment:0.42 },
      { name:"Berger Paints",     visibility:62, share:22, citation:31, sentiment:0.51 },
      { name:"Kansai Nerolac",    visibility:54, share:14, citation:24, sentiment:0.36 },
      { name:"Pidilite",          visibility:48, share:11, citation:43, sentiment:0.45 },
      { name:"Sherwin-Williams",  visibility:32, share:7,  citation:18, sentiment:0.40 }
    ],
    buyerQuestions: [
      "Best premium wood finish for interior furniture?",
      "Most durable exterior paint for Indian monsoon conditions?",
      "Eco-friendly low-VOC paint brands in India?",
      "Asian Paints Royale vs Berger Silk: which to choose?",
      "Best wood polish for teak furniture?",
      "Recommended primer for fresh plaster walls?"
    ],
    sampleAnswers: [
      { engine:"ChatGPT",    query:"Best premium wood finish for interior furniture?",   answer:"Asian Paints Royale Wood Tech and Pidilite's Woodtech range are the most recommended. For high-end teak or rosewood, Sherwin-Williams Mizzle delivers a hand-finished look — but it's harder to source outside metros." },
      { engine:"Perplexity", query:"Best paint for Indian monsoon exteriors?",            answer:"Asian Paints Apex Ultima Protek and Berger WeatherCoat Long Life are most cited for monsoon-grade waterproofing in coastal and high-humidity regions like Mumbai, Chennai, and Kerala." },
      { engine:"Gemini",     query:"Eco-friendly paint brands in India?",                  answer:"Asian Paints Royale Atmos (claims air-purifying properties) and Berger Breathe Easy lead the low-VOC category. Nippon Paint India also offers a no-VOC interior line." }
    ],
    commonClaims: [
      { text:"Asian Paints discontinued the Royale Atmos line", verdict:"hallucinated", engines:["Grok"] },
      { text:"Berger Paints does not make exterior weatherproof paint", verdict:"hallucinated", engines:["Copilot"] },
      { text:"Pidilite only makes adhesives, not finishes", verdict:"outdated", engines:["Perplexity"] },
      { text:"Kansai Nerolac is a domestic-only brand", verdict:"outdated", engines:["Grok"] }
    ]
  },

  electronics: {
    headline: "AI is the new in-store salesperson. And it has strong opinions about refrigerators.",
    summary: "When buyers ask 'which refrigerator should I buy?', AI now does the shortlisting. LG and Samsung dominate visibility; Godrej and Whirlpool win on warranty trust and Indian-context relevance.",
    leaderboard: [
      { name:"LG India",          visibility:81, share:32, citation:38, sentiment:0.54 },
      { name:"Samsung India",     visibility:76, share:28, citation:35, sentiment:0.49 },
      { name:"Whirlpool India",   visibility:58, share:13, citation:26, sentiment:0.41 },
      { name:"Godrej Appliances", visibility:54, share:14, citation:24, sentiment:0.46 },
      { name:"Haier India",       visibility:47, share:8,  citation:21, sentiment:0.38 }
    ],
    buyerQuestions: [
      "Most reliable refrigerator brand in India?",
      "Best double-door refrigerator under ₹40,000?",
      "LG vs Samsung: which side-by-side fridge to buy?",
      "Energy-efficient inverter refrigerator for Indian climate?",
      "Best refrigerator service network in tier-2 cities?",
      "Refrigerator with longest compressor warranty?"
    ],
    sampleAnswers: [
      { engine:"ChatGPT",    query:"Most reliable refrigerator brand in India?",       answer:"LG and Samsung dominate the reliability conversation, both offering 10-year compressor warranties. Whirlpool and Godrej are strong on after-sales support, particularly outside metros." },
      { engine:"Perplexity", query:"Best double-door fridge under ₹40,000?",            answer:"LG's GL-S292RPZX and Samsung's RT28C3032CR are most frequently recommended at this price. Both have inverter compressors and 1-year comprehensive warranty." },
      { engine:"Gemini",     query:"Refrigerator for Indian power conditions?",         answer:"Godrej Eon Vibe and Whirlpool Intellifresh both have wide voltage tolerance designed for fluctuating Indian supply — a useful spec often missing from imported model recommendations." }
    ],
    commonClaims: [
      { text:"Godrej no longer manufactures refrigerators in India", verdict:"hallucinated", engines:["Grok"] },
      { text:"LG's 10-year warranty applies to the entire fridge, not just the compressor", verdict:"outdated", engines:["Copilot"] },
      { text:"Samsung Convertible refrigerators are not available below ₹50,000", verdict:"outdated", engines:["Perplexity"] }
    ]
  },

  bfsi: {
    headline: "When a buyer asks 'is this app safe?', AI now answers for them.",
    summary: "PhonePe and Google Pay split the UPI conversation. Paytm leads citation density (most-quoted news sources). Trust signals — RBI compliance, encryption — vary wildly by engine.",
    leaderboard: [
      { name:"PhonePe",     visibility:82, share:38, citation:34, sentiment:0.48 },
      { name:"Google Pay",  visibility:79, share:32, citation:31, sentiment:0.51 },
      { name:"Paytm",       visibility:64, share:14, citation:46, sentiment:0.21 },
      { name:"Amazon Pay",  visibility:46, share:8,  citation:24, sentiment:0.44 },
      { name:"BHIM",        visibility:38, share:5,  citation:18, sentiment:0.39 }
    ],
    buyerQuestions: [
      "Safest UPI app for large transactions?",
      "What are the daily UPI limits per app?",
      "PhonePe vs Google Pay for merchant payments?",
      "Which UPI app has the fastest refund process?",
      "Is Paytm safe after the RBI restrictions?",
      "Best UPI app for international transactions?"
    ],
    sampleAnswers: [
      { engine:"ChatGPT",    query:"Safest UPI app for large transactions?",      answer:"PhonePe and Google Pay are both NPCI-compliant and use end-to-end encryption with device binding. PhonePe processes the largest UPI volume in India, which means more mature fraud detection at the network level." },
      { engine:"Perplexity", query:"Daily UPI transaction limits per app?",        answer:"The NPCI cap is ₹1 lakh per day for most use cases, though bank-specific limits vary. PhonePe and Google Pay both honour this; some banks allow higher merchant payments." },
      { engine:"Gemini",     query:"Is Paytm safe after the RBI restrictions?",    answer:"Paytm UPI services were restored via Axis Bank partnership in 2024, but the brand association with the earlier Paytm Payments Bank restrictions still affects buyer trust." }
    ],
    commonClaims: [
      { text:"Paytm Payments Bank is fully operational again", verdict:"hallucinated", engines:["Grok"] },
      { text:"PhonePe charges a transaction fee on UPI payments", verdict:"hallucinated", engines:["Copilot"] },
      { text:"UPI daily limit is ₹2 lakh", verdict:"outdated", engines:["Perplexity"] },
      { text:"Amazon Pay does not support UPI to bank account transfers", verdict:"outdated", engines:["Grok"] }
    ]
  },

  fmcg: {
    headline: "Parents Google less. They ask an AI what to put in the lunchbox.",
    summary: "Kellogg's still dominates raw visibility, but Indian D2C brands (Slurrp Farm, Soulful) win the 'healthy for kids' niche when AI is asked about sugar content, millet, or no-additive options.",
    leaderboard: [
      { name:"Kellogg's India", visibility:84, share:36, citation:32, sentiment:0.38 },
      { name:"Bagrry's",        visibility:62, share:18, citation:28, sentiment:0.52 },
      { name:"Slurrp Farm",     visibility:54, share:15, citation:22, sentiment:0.61 },
      { name:"Soulful",         visibility:46, share:12, citation:19, sentiment:0.55 },
      { name:"Nestlé (Nestum)", visibility:58, share:14, citation:25, sentiment:0.32 }
    ],
    buyerQuestions: [
      "Healthiest breakfast cereal for kids?",
      "Sugar-free breakfast options for Indian kids?",
      "Best millet-based cereals for toddlers?",
      "Kellogg's Chocos vs Bagrry's Crunchy Muesli: which is healthier?",
      "Breakfast for picky eater kids aged 3-6?",
      "Are 'no added sugar' cereals actually low in sugar?"
    ],
    sampleAnswers: [
      { engine:"ChatGPT",    query:"Healthiest breakfast cereal for kids?",                  answer:"Slurrp Farm's millet-based ranges and Bagrry's no-added-sugar muesli are most commonly recommended. Mainstream brands like Kellogg's Chocos have high added sugar; their 'Special K' line is lower but is positioned for adults." },
      { engine:"Perplexity", query:"Sugar-free breakfast options for Indian kids?",            answer:"Slurrp Farm dosa mix, Soulful millet flakes, and Bagrry's Diabetic Care muesli are most frequently cited. Most mainstream kids' cereals contain 8-15g of added sugar per serving." },
      { engine:"Gemini",     query:"Best millet-based cereals for toddlers?",                  answer:"Slurrp Farm's Little Millet Dosa Mix and Mighty Puffs are designed for the 2-6 age group. Both are FSSAI certified and use ragi, jowar, and bajra." }
    ],
    commonClaims: [
      { text:"Kellogg's Chocos is marketed as 'low sugar'", verdict:"hallucinated", engines:["Grok"] },
      { text:"Slurrp Farm products contain added refined sugar", verdict:"hallucinated", engines:["Copilot"] },
      { text:"Soulful is owned by Tata Consumer Products", verdict:"outdated", engines:["Perplexity"] }
    ]
  },

  beauty: {
    headline: "Skincare routines are no longer researched. They're recommended.",
    summary: "Vitamin C serum is one of the most-asked beauty queries on AI engines. Minimalist owns 'science-backed' framing; Mamaearth wins 'natural'; The Derma Co dominates 'dermatologist-recommended' adjacencies.",
    leaderboard: [
      { name:"Minimalist",     visibility:76, share:34, citation:31, sentiment:0.62 },
      { name:"The Derma Co",   visibility:71, share:28, citation:34, sentiment:0.58 },
      { name:"Plum Goodness",  visibility:58, share:15, citation:22, sentiment:0.49 },
      { name:"Mamaearth",      visibility:81, share:18, citation:36, sentiment:0.38 },
      { name:"mCaffeine",      visibility:42, share:5,  citation:14, sentiment:0.41 }
    ],
    buyerQuestions: [
      "Best vitamin C serum for Indian skin?",
      "Vitamin C serum for sensitive or acne-prone skin?",
      "Minimalist vs The Derma Co vitamin C: which works better?",
      "When to apply vitamin C serum in a routine?",
      "Affordable vitamin C alternatives to The Ordinary?",
      "Vitamin C concentration safe for daily use?"
    ],
    sampleAnswers: [
      { engine:"ChatGPT",    query:"Best vitamin C serum for Indian skin?",          answer:"Minimalist Vitamin C 16% and The Derma Co 10% Vitamin C are most often recommended for Indian skin tones — Minimalist for those who tolerate higher concentrations, The Derma Co for sensitive starters." },
      { engine:"Perplexity", query:"Vitamin C serum for acne-prone skin?",            answer:"The Derma Co 10% Vitamin C and Plum 15% Vitamin C are typically suggested. Minimalist's lower-percentage 10% formula is also a frequent starting point. Avoid combining with niacinamide in the same routine." },
      { engine:"Gemini",     query:"Vitamin C concentration safe for daily use?",     answer:"10-15% L-ascorbic acid is the daily-use sweet spot for most skin types. Minimalist 16% is the highest commonly recommended in India; beginners are usually pointed to 10% formulations from The Derma Co or Plum." }
    ],
    commonClaims: [
      { text:"Minimalist was acquired by HUL", verdict:"hallucinated", engines:["Grok"] },
      { text:"The Derma Co only makes acne products, not vitamin C", verdict:"hallucinated", engines:["Copilot"] },
      { text:"Plum Goodness is no longer available online", verdict:"hallucinated", engines:["Grok"] },
      { text:"Mamaearth's vitamin C serum was reformulated in 2022", verdict:"outdated", engines:["Perplexity"] }
    ]
  },

  realestate: {
    headline: "A site visit is now decided in an AI answer.",
    summary: "Gurgaon premium developers are heavily searched. DLF leads visibility (legacy brand equity); M3M leads share (volume of recent launches); Godrej leads sentiment (timely delivery reputation).",
    leaderboard: [
      { name:"DLF",              visibility:84, share:28, citation:42, sentiment:0.48 },
      { name:"M3M India",        visibility:71, share:32, citation:24, sentiment:0.36 },
      { name:"Godrej Properties",visibility:68, share:18, citation:31, sentiment:0.62 },
      { name:"Sobha Limited",    visibility:54, share:12, citation:26, sentiment:0.58 },
      { name:"Tata Housing",     visibility:51, share:9,  citation:28, sentiment:0.55 }
    ],
    buyerQuestions: [
      "Most trusted real estate developer in Gurgaon?",
      "Best luxury apartments in Golf Course Road area?",
      "DLF vs M3M: which has better resale value?",
      "Real estate developers with timely delivery record?",
      "Best ready-to-move premium projects in Gurgaon?",
      "Gated communities with strong rental yields?"
    ],
    sampleAnswers: [
      { engine:"ChatGPT",    query:"Most trusted real estate developer in Gurgaon?",  answer:"DLF and Godrej Properties are consistently cited for trust and delivery. DLF's brand equity is the strongest historically; Godrej is praised for transparent timelines on recent launches." },
      { engine:"Perplexity", query:"Best ready-to-move luxury homes in Gurgaon?",      answer:"DLF The Camellias, DLF Magnolias, and Tata Primanti are top-cited ready-to-move premium options. DLF dominates the resale luxury market on Golf Course Road." },
      { engine:"Gemini",     query:"Resale value DLF vs M3M?",                          answer:"DLF apartments generally hold and appreciate better in established sectors (Phase 1-5). M3M sees stronger appreciation in newer micro-markets (Sector 65, 79) but is more volatile." }
    ],
    commonClaims: [
      { text:"DLF has paused all new launches in Gurgaon", verdict:"hallucinated", engines:["Grok"] },
      { text:"M3M is part of the DLF group", verdict:"hallucinated", engines:["Copilot"] },
      { text:"Godrej Properties only operates in Mumbai", verdict:"hallucinated", engines:["Grok"] },
      { text:"Sobha Limited is based out of Bengaluru only", verdict:"outdated", engines:["Perplexity"] }
    ]
  },

  travel: {
    headline: "Travel managers don't shortlist. They ask an AI.",
    summary: "For business hotels in India, Taj leads brand recall but ITC leads on 'best for business' specifically — its meeting-room and loyalty story shows up in AI answers more often than Taj's. Marriott wins on city coverage.",
    leaderboard: [
      { name:"Taj Hotels",       visibility:88, share:31, citation:42, sentiment:0.58 },
      { name:"ITC Hotels",       visibility:74, share:28, citation:38, sentiment:0.61 },
      { name:"Oberoi Hotels",    visibility:69, share:16, citation:34, sentiment:0.71 },
      { name:"Marriott India",   visibility:72, share:18, citation:31, sentiment:0.48 },
      { name:"Hilton India",     visibility:52, share:7,  citation:24, sentiment:0.44 }
    ],
    buyerQuestions: [
      "Best business hotel chain in India?",
      "Hotel loyalty program with the best India coverage?",
      "ITC vs Taj for executive meetings in Delhi?",
      "Best airport-adjacent business hotels in Bengaluru?",
      "Hotels with full-floor executive lounges in India?",
      "Most reliable corporate booking experience in India?"
    ],
    sampleAnswers: [
      { engine:"ChatGPT",    query:"Best business hotel chain in India?",                answer:"ITC Hotels and Taj Hotels are both regularly cited. ITC has a particularly strong reputation for business travellers — sustainable luxury positioning, executive-club access, and consistent meeting infrastructure across cities." },
      { engine:"Perplexity", query:"Best hotel for executive meetings in Delhi?",         answer:"ITC Maurya and The Taj Mahal Hotel (Mansingh Road) are top-cited for executive meetings in Delhi. ITC Maurya is particularly noted for its boardroom-grade meeting infrastructure." },
      { engine:"Gemini",     query:"Loyalty program for India business travel?",          answer:"Marriott Bonvoy has the widest India footprint. For domestic business travellers focused on Taj and Oberoi, IHCL Club Tata Neu Privé and Oberoi One both offer competitive returns." }
    ],
    commonClaims: [
      { text:"ITC Hotels exited the luxury segment in 2024", verdict:"hallucinated", engines:["Grok"] },
      { text:"Taj Hotels and Vivanta have separate loyalty programs", verdict:"outdated", engines:["Copilot"] },
      { text:"Oberoi Hotels are not available outside metros", verdict:"hallucinated", engines:["Grok"] },
      { text:"Marriott does not have a property in Hyderabad", verdict:"hallucinated", engines:["Perplexity"] }
    ]
  }
};

/* ============================================================
   DEMO BRAND DATA — only `auto` is full (worked example).
   Used by onboarding/scan and the brand-specific dashboard.
   ============================================================ */
window.DEMO = {
  auto: {
    brand:"Mahindra",
    competitors:["Tata Motors","Hyundai India","Toyota Kirloskar"],
    markets:["India","Metros"],
    queriesRun:1284,
    kpis:{ visibility:58, answerShare:31, citation:22, sentiment:0.34 },
    answerShare:[
      {name:"Mahindra", v:31, me:true},
      {name:"Tata Motors", v:24},
      {name:"Hyundai India", v:18},
      {name:"Toyota Kirloskar", v:12},
      {name:"Long tail", v:15}
    ],
    topics:["Reliability","Ownership cost","Resale value","Family-friendly","Tech & features","Service network"],
    heatmap:{
      "ChatGPT":   [0.78, 0.62, 0.34, 0.41, 0.71, 0.84],
      "Perplexity":[0.65, 0.55, 0.28, 0.36, 0.62, 0.70],
      "Gemini":    [0.72, 0.58, 0.40, 0.48, 0.68, 0.81],
      "Claude":    [0.59, 0.51, 0.32, 0.38, 0.60, 0.66],
      "Copilot":   [0.54, 0.46, 0.24, 0.30, 0.55, 0.60],
      "Google AIO":[0.68, 0.60, 0.36, 0.44, 0.66, 0.78],
      "Grok":      [0.42, 0.35, 0.18, 0.22, 0.40, 0.48]
    },
    claims:[
      {text:"Strong service network across major Indian cities", verdict:"positive", engines:["ChatGPT","Gemini"]},
      {text:"XUV700 praised for premium interior and ride quality", verdict:"positive", engines:["ChatGPT","Perplexity","Claude"]},
      {text:"Resale value lags Toyota and Hyundai in the segment", verdict:"outdated", engines:["Perplexity"]},
      {text:"Limited fast-charging partnerships for the XUV.e9", verdict:"outdated", engines:["Copilot","Gemini"]},
      {text:"Discontinued the diesel Scorpio-N in 2023", verdict:"hallucinated", engines:["Grok"]}
    ],
    drift8w:[52,49,53,51,55,54,57,58],
    gaps:[
      "Buyers asking about resale value never hear Mahindra mentioned",
      "Absent from 'best for families' answers — a high-intent buyer segment",
      "Two engines are quoting last year's pricing on the XUV700"
    ],
    simulate:[
      {action:"Publish a category reliability comparison", lift:2.4, conf:"Med",  effort:"M"},
      {action:"Win citation in a tier-1 industry publication", lift:3.8, conf:"High", effort:"L"},
      {action:"Correct outdated claim about the Scorpio-N variant", lift:0.9, conf:"High", effort:"S"},
      {action:"Refresh XUV700 product page and FAQ schema", lift:1.1, conf:"High", effort:"S"}
    ],
    queue:[
      {action:"Knowledge graph & entity fix", type:"Software", impact:82, owner:"Perceptivity", status:"In progress", cost:"$$", lift:2.1, conf:"High"},
      {action:"Comparison landing-page rewrite", type:"Partner", impact:72, owner:"Content agency", status:"Backlog", cost:"$$$", lift:2.4, conf:"Med"},
      {action:"Tier-1 trade publication placement", type:"Partner", impact:64, owner:"PR agency", status:"Backlog", cost:"$$$", lift:3.8, conf:"High"},
      {action:"Review-site response & cleanup", type:"Brand team", impact:56, owner:"Brand team", status:"Shipped", cost:"$", lift:1.4, conf:"Med"}
    ],
    learn:[
      {
        query:"Which premium SUV has the best ownership experience?",
        before:"Mahindra not mentioned in any of the seven engines.",
        after:"Named in 4 of 6 engines. Service trust now a positive signal; resale story still needs work.",
        delta:"+11pp answer share"
      },
      {
        query:"Best premium SUV for families in India?",
        before:"Only a long-tail mention in one engine.",
        after:"Now named in ChatGPT, Gemini and Google AIO. Family-friendly messaging consistent across answers.",
        delta:"+7pp answer share"
      }
    ]
  }
};

/* ============================================================
   GROUND TRUTH — the brand source-of-truth layer.
   Feed canonical inputs; AI stops guessing and starts quoting you.
   Shared by the homepage interactive and the dashboard "Brand truth" tab.
   ============================================================ */
window.GROUND_TRUTH = {
  auto: {
    query: "Is the Mahindra XUV700 a good buy in 2026?",
    /* the five canonical inputs a brand feeds in */
    sources: [
      { id:"guidelines", group:"Brand guidelines & messaging", facts:18, synced:"2 days ago",  status:"synced",
        note:"Voice, naming and approved messaging framework." },
      { id:"narrative",  group:"Narratives & positioning",     facts:9,  synced:"2 days ago",  status:"synced",
        note:"Reliability and India's widest SUV service network." },
      { id:"pricing",    group:"Live SKU & pricing",           facts:42, synced:"11 min ago",  status:"drift",
        note:"Ex-showroom prices and variants, synced from your PIM." },
      { id:"claims",     group:"Approved facts & claims",       facts:31, synced:"1 day ago",   status:"synced",
        note:"Legal-approved, vetted claims library." },
      { id:"specs",      group:"Spec sheets & technical docs",  facts:64, synced:"4 days ago",  status:"review",
        note:"Powertrain, safety, dimensions and ADAS." }
    ],
    /* the AI answer, composed of segments — each grounded by one source.
       `right` = what AI says when grounded in your truth.
       `wrong` = what AI guesses without it (stale / hallucinated / rival-framed). */
    answer: [
      { id:"lead",    groundedBy:"narrative",
        right:"The Mahindra XUV700 is a strong pick in 2026 — widely recommended for families and backed by one of India's largest SUV service networks.",
        wrong:"The XUV700 is decent, though many buyers now lean toward the Tata Harrier for a more modern package." },
      { id:"price",   groundedBy:"pricing",
        right:"It runs from ₹14.49 lakh to about ₹26.99 lakh ex-showroom (current, May 2026).",
        wrong:"It starts at around ₹12.5 lakh ex-showroom." },
      { id:"scorpio", groundedBy:"claims",
        right:"Both petrol and diesel powertrains remain on sale across the range.",
        wrong:"Note that Mahindra discontinued the diesel Scorpio-N back in 2023." },
      { id:"safety",  groundedBy:"specs",
        right:"It carries a 5-star Global NCAP rating with Level-2 ADAS (AdrenoX).",
        wrong:"Safety tech is fairly basic for the segment." },
      { id:"close",   groundedBy:"guidelines",
        right:"Overall, a confident recommendation for buyers who prioritise safety, space and service reach.",
        wrong:"Overall, worth a look if you can find a good deal somewhere." }
    ]
  }
};

/* ============================================================
   INTEGRATIONS — module shown in the brand-specific dashboard
   ============================================================ */
window.INTEGRATIONS = [
  { id:"jira",      group:"Workflow",    name:"Jira",          desc:"Action queue items become tickets in the right squad's board.",            status:"Connected",    accent:"teal"   },
  { id:"asana",     group:"Workflow",    name:"Asana",         desc:"Owners and due dates sync automatically when actions are queued.",         status:"Available",    accent:"teal"   },
  { id:"hubspot",   group:"CRM",         name:"HubSpot",       desc:"Tie AI-influenced visibility back to pipeline value created.",             status:"Connected",    accent:"amber"  },
  { id:"salesforce",group:"CRM",         name:"Salesforce",    desc:"Attribute new MQLs and SQLs to specific perception actions.",              status:"Available",    accent:"amber"  },
  { id:"webflow",   group:"Web / CMS",   name:"Webflow",       desc:"Push schema and copy fixes to the marketing site in one click.",           status:"Connected",    accent:"violet" },
  { id:"wordpress", group:"Web / CMS",   name:"WordPress",     desc:"Sync content updates and FAQ schema to brand-owned editorial.",            status:"Available",    accent:"violet" },
  { id:"ga4",       group:"Analytics",   name:"GA4",           desc:"Correlate visibility lift with organic and AI-referred sessions.",          status:"Connected",    accent:"teal"   },
  { id:"adobe",     group:"Analytics",   name:"Adobe Analytics", desc:"Map AI-driven inbound to existing brand measurement frameworks.",        status:"Available",    accent:"teal"   },
  { id:"partners",  group:"Partner network", name:"PR & content partners", desc:"15 vetted Indian agencies — PR, content, schema, review repair.", status:"Connected", accent:"amber"  }
];

/* ============================================================
   USER + state — persisted across pages
   ============================================================ */
window.PCV = {
  get(){ try { return JSON.parse(localStorage.getItem('pcv')||'{}'); } catch(e){ return {}; } },
  set(o){ try { localStorage.setItem('pcv', JSON.stringify({...this.get(), ...o})); } catch(e){} },
  clear(){ try { localStorage.removeItem('pcv'); } catch(e){} }
};
