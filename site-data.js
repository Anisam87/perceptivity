/* ============================================================
   PERCEPTIVITY — editorial homepage data
   Worked examples use REAL Indian brands for context, shown
   ILLUSTRATIVELY. Every number is a labelled model output or a
   bracketed [PLACEHOLDER] to be replaced with a real result.
   No claim here is a statement of fact about any brand.
   ============================================================ */

window.SITE = {
  engines: ["ChatGPT","Perplexity","Gemini","Claude","Copilot","Google AIO","Grok"],

  /* ---- HERO "type your brand" reveal ----
     Category: premium SUVs, India. The recorded answer names real
     rivals; the brand the user types is slotted as a secondary
     mention. No live API call — clearly labelled illustrative. */
  hero: {
    rival: "Tata Harrier",
    engine: "ChatGPT",
    segments: [
      { t:"For a premium SUV in India in 2026, most buyers are pointed first to the ", k:"plain" },
      { t:"Toyota Fortuner and Tata Harrier", k:"rival" },
      { t:" — cited for resale value and ride quality. ", k:"plain" },
      { t:"{BRAND}", k:"you" },
      { t:" gets a brief mention as a value alternative, but rarely as the lead recommendation, and two engines still quote last year's pricing.", k:"plain" }
    ],
    cites: ["cardekho.com", "team-bhp.in", "autocarindia.com", "reddit.com/r/CarsIndia"]
  },

  /* ---- SIMULATE wedge ---- */
  simulate: {
    campaign: "Publish a category reliability comparison + correct two outdated XUV700 pricing claims",
    window: 12,
    predictedNet: 3.2,           // pp answer share — MODEL OUTPUT
    measuredNet: 2.9,            // pp — MODEL OUTPUT (worked example)
    perEngine: [
      { nm:"ChatGPT",    p:4.1, m:3.8 },
      { nm:"Perplexity", p:2.8, m:2.6 },
      { nm:"Google AIO", p:1.9, m:2.3 },
      { nm:"Gemini",     p:1.1, m:0.9 },
      { nm:"Claude",     p:0.7, m:0.8 },
      { nm:"Grok",       p:0.3, m:0.1 }
    ]
  },

  /* ---- AUTHOR THE ANSWER showpiece ----
     Real worked example: the Mahindra XUV700. */
  author: {
    brand: "Mahindra XUV700",
    query: "Is the Mahindra XUV700 a good buy in 2026?",
    engine: "ChatGPT",
    sources: [
      { id:"guidelines", group:"Brand guidelines & messaging", facts:18, synced:"2 days ago",  status:"synced" },
      { id:"narrative",  group:"Narratives & positioning",     facts:9,  synced:"2 days ago",  status:"synced" },
      { id:"pricing",    group:"Live SKU & pricing",           facts:42, synced:"11 min ago",  status:"drift"  },
      { id:"claims",     group:"Approved facts & claims",       facts:31, synced:"1 day ago",   status:"synced" },
      { id:"specs",      group:"Spec sheets & technical docs",  facts:64, synced:"4 days ago",  status:"review" }
    ],
    answer: [
      { groundedBy:"narrative",
        right:"The Mahindra XUV700 is a strong pick in 2026 — widely recommended for families and backed by one of India's largest SUV service networks.",
        wrong:"The XUV700 is decent, though many buyers now lean toward the Tata Harrier for a more modern package." },
      { groundedBy:"pricing",
        right:"It runs from ₹14.49 lakh to about ₹26.99 lakh ex-showroom (current, May 2026).",
        wrong:"It starts at around ₹12.5 lakh ex-showroom." },
      { groundedBy:"claims",
        right:"Both petrol and diesel powertrains remain on sale across the range.",
        wrong:"Note that Mahindra discontinued the diesel Scorpio-N back in 2023." },
      { groundedBy:"specs",
        right:"It carries a 5-star Global NCAP rating with Level-2 ADAS (AdrenoX).",
        wrong:"Safety tech is fairly basic for the segment." },
      { groundedBy:"guidelines",
        right:"Overall, a confident recommendation for buyers who prioritise safety, space and service reach.",
        wrong:"Overall, worth a look if you can find a good deal somewhere." }
    ]
  },

  /* ---- INDIA answer layer + retail-AI surfaces (the moat) ----
     Vernacular graph stays on the SUV worked example; retail
     surfaces use the real categories that actually transact there. */
  india: {
    vernacular: [
      { lang:"Hinglish",  q:"Sabse acchi premium SUV kaun si hai?",          share:34 },
      { lang:"हिन्दी",      q:"सबसे भरोसेमंद एसयूवी कौन सी है?",                    share:22 },
      { lang:"தமிழ்",      q:"குடும்பத்திற்கு சிறந்த SUV எது?",                   share:14 },
      { lang:"বাংলা",      q:"সেরা প্রিমিয়াম SUV কোনটি?",                        share:11 },
      { lang:"मराठी",      q:"कुटुंबासाठी सर्वोत्तम एसयूव्ही कोणती?",              share:9  }
    ],
    retail: [
      { surface:"Amazon Rufus",  ctx:"In-cart shopping assistant",
        snippet:"Asked for a reliable refrigerator, Rufus compares LG and Samsung first — Godrej surfaces only once warranty is mentioned." },
      { surface:"Flipkart AI",   ctx:"Search & PDP assistant",
        snippet:"For a vitamin C serum, the assistant surfaces Minimalist and The Derma Co by rating and delivery speed — not by brand spend." },
      { surface:"Blinkit",       ctx:"Quick-commerce discovery",
        snippet:"Asked for a healthy kids' breakfast, Blinkit suggests Slurrp Farm and Bagrry's — a 10-minute surface no AEO tool tracks." }
    ]
  },

  /* ---- the loop ---- */
  loop: [
    { k:"Sense",    d:"See how every answer engine describes you — daily, across languages and surfaces." },
    { k:"Simulate", d:"Forecast the visibility lift of a campaign before you commit a rupee.", diff:true },
    { k:"Act",      d:"Route each move to software, a vetted partner, or your team — by predicted impact." },
    { k:"Learn",    d:"Measure predicted vs actual. Every cycle sharpens the next forecast." }
  ],

  /* ---- enterprise & security (honest, dated) ---- */
  security: [
    { k:"SOC 2 Type II", v:"In progress", note:"Audit underway · target Q4 2026", status:"warn" },
    { k:"SSO / SAML",    v:"Available",   note:"Okta, Azure AD, Google Workspace", status:"pos" },
    { k:"Tenant isolation", v:"Per-customer", note:"Your data stays in your own tenant", status:"pos" },
    { k:"Audit logs",    v:"Full",        note:"Every action and export is logged", status:"pos" }
  ]
};
