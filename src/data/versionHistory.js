// Complete Version & Release Notes History for The Brew App

export const VERSION_HISTORY = [
  {
    version: "1.4.0",
    releaseDate: "2026-09-06",
    title: "Acoustic Mechanical Bell Chime & Voice-Guided Timer",
    summary: "Complete overhaul of the multi-phase extraction timer featuring physical bell harmonics, pre-countdown spoken announcements, dedicated audio mute controls, and clickable timer controls.",
    highlights: [
      {
        type: "feature",
        badge: "Timer Chime",
        title: "Physical Mechanical Bell Strike",
        description: "Replaced flat synthesizer beeps with an acoustic brass bell model (striker impact click + C6 1046.5 Hz fundamental with 6 harmonic metallic overtones and shimmering exponential decay)."
      },
      {
        type: "feature",
        badge: "Voice Guidance",
        title: "Pre-Countdown Spoken Phase Announcements",
        description: "Web Speech API announces phase name and duration out loud (e.g. 'Bloom Phase, 45 seconds') before the countdown begins, complete with live visual speaking status."
      },
      {
        type: "feature",
        badge: "Audio Controls",
        title: "Speaker / Mute Toggle Button",
        description: "Dedicated toggle positioned directly below the 'Timer Ready' status box for quick one-tap muting without altering device volume."
      },
      {
        type: "enhancement",
        badge: "Interactive Timer",
        title: "Clickable Clock Face",
        description: "The entire circular countdown ring and digital clock is now a responsive clickable trigger to start, chime, or pause extraction."
      },
      {
        type: "feature",
        badge: "Build System",
        title: "Built-in Version Control & Release Changelog",
        description: "Automated build metadata stamps git commit hashes, timestamps, and feature release notes into every production bundle."
      }
    ]
  },
  {
    version: "1.3.0",
    releaseDate: "2026-09-06",
    title: "Coffee Water Chemistry Lab & Prerendered SEO Hub",
    summary: "Precision mineral recipe calculator and static prerendered educational guide engineered for organic search capture.",
    highlights: [
      {
        type: "feature",
        badge: "Water Lab",
        title: "Interactive Mineral Dosage Calculator",
        description: "Dynamic calculation of TDS (PPM), General Hardness (GH), and Carbonate Hardness (KH) across customizable container sizes (1L, 1 Gal, 5 Gal)."
      },
      {
        type: "feature",
        badge: "Formulations",
        title: "Lotus Drops & DIY Mineral Concentrates",
        description: "Drop counts for Lotus Coffee Water minerals alongside gram weights for food-grade Epsom Salt (MgSO4) and Baking Soda (NaHCO3)."
      },
      {
        type: "enhancement",
        badge: "SEO Hub",
        title: "Static Prerendered Guide (/guides/coffee-water-chemistry)",
        description: "Full static prerendering equipped with Article, HowTo, and FAQPage JSON-LD schemas for high-intent search queries."
      }
    ]
  },
  {
    version: "1.2.0",
    releaseDate: "2026-09-06",
    title: "Native Camera Barcode & QR Scanner",
    summary: "Instant coffee bean bag ingestion using device hardware cameras and curated specialty roaster presets.",
    highlights: [
      {
        type: "feature",
        badge: "Scanner",
        title: "Hardware Camera Integration",
        description: "Real-time camera viewfinder using Web BarcodeDetector API for instant UPC/EAN and QR code recognition."
      },
      {
        type: "feature",
        badge: "Database",
        title: "Curated Specialty Roaster SKUs",
        description: "Pre-seeded catalog for Onyx Coffee Lab, Sey Coffee, Proud Mary, Counter Culture, and Stumptown."
      },
      {
        type: "enhancement",
        badge: "1-Tap Ingestion",
        title: "Dial-in Station & Cellar Sync",
        description: "One tap loads recommended ratios and grind sizes into the dial-in station or saves bean parameters to the Brew Journal."
      }
    ]
  },
  {
    version: "1.1.0",
    releaseDate: "2026-09-06",
    title: "World Coffee & Tea News Hardening",
    summary: "Eliminated unescaped HTML entities in syndicated news feeds and implemented defensive entity decoding.",
    highlights: [
      {
        type: "fix",
        badge: "Data Integrity",
        title: "RSS Feed Entity Sanitization",
        description: "Stripped non-breaking spaces (&nbsp;, &#160;), smart quotes, and publisher delimiters during data syndication."
      },
      {
        type: "enhancement",
        badge: "UI Security",
        title: "Defensive Frontend Sanitization",
        description: "Added sanitizeNewsText() inside WorldNewsSection to guarantee clean typography."
      }
    ]
  },
  {
    version: "1.0.0",
    releaseDate: "2026-09-05",
    title: "Foundational Release: Dial-in Station & 18 Extraction Methods",
    summary: "Comprehensive specialty coffee and fine tea brewing workstation.",
    highlights: [
      {
        type: "feature",
        badge: "Brew Methods",
        title: "18 Prerendered Extraction Methods",
        description: "Precise parameters for V60, Chemex, AeroPress, French Press, Espresso, Moka Pot, and ceremonial teas."
      },
      {
        type: "feature",
        badge: "Dial-In",
        title: "Golden Ratio & Brew Journal",
        description: "Interactive brew calculator, extraction notes, and local persistent brew logging."
      }
    ]
  }
];

export const CURRENT_VERSION = VERSION_HISTORY[0];
