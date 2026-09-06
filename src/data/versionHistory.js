// Complete Version & Release Notes History for The Brew App

export const VERSION_HISTORY = [
  {
    version: "1.4.4",
    releaseDate: "2026-09-06",
    title: "Laboratory-Verified Commercial Bottled Water Guide & SCA Classification",
    summary: "Integrated an authentic, laboratory-verified commercial bottled water database into the Coffee Water Chemistry Lab. Includes real mineral ion analyses (TDS, Ca²⁺, Mg²⁺, Na⁺, K⁺, HCO₃⁻, SiO₂, GH, KH, pH) from certified water reports, real-time grocery brand search, SCA compliance ratings, and dilution/remineralization guides.",
    highlights: [
      {
        type: "feature",
        badge: "Verified Lab Data",
        title: "Authentic Bottled Water Mineral Database",
        description: "Incorporated laboratory-tested mineral reports for globally available bottled waters (Crystal Geyser Weed CA, Volvic Puy de Dôme, Evian French Alps, Acqua Panna Tuscany, Fiji Natural Artesian, Poland Spring Maine, Tesco Ashbeck UK, Third Wave Water, and Smartwater) with zero fabricated numbers."
      },
      {
        type: "feature",
        badge: "SCA Standards",
        title: "SCA Suitability Badging & Practical Barista Tips",
        description: "Each bottled water is evaluated against SCA brewing standards: Specialty Gold Standards (Crystal Geyser, Volvic, Ashbeck), Soft / Nordic Light styles (Poland Spring, Fiji), Requires 50/50 Dilution (Evian), RO Blank Canvas (Smartwater), and Palate Cleanser Only (San Pellegrino)."
      },
      {
        type: "enhancement",
        badge: "Dual-Tab Lab",
        title: "Tabbed Water Chemistry Lab & Filter Chips",
        description: "Upgraded the Water Chemistry Lab modal with seamless tab switching between '💧 Bottled Water Guide' and '🔬 Mineral Recipes & Scaler', featuring brand/country search, category filtering chips, and expandable chemical ion cards."
      },
      {
        type: "enhancement",
        badge: "SEO Guide",
        title: "Prerendered Comprehensive Water Chemistry Article",
        description: "Updated the prerendered guide at /guides/coffee-water-chemistry with a dedicated commercial bottled water evaluation section detailing hardness vs alkalinity tradeoffs."
      }
    ]
  },
  {
    version: "1.4.3",
    releaseDate: "2026-09-06",
    title: "Active Extraction Instruction Voice Guidance & On-Demand Audio",
    summary: "As the mechanical clock ticks, the timer now speaks the full Active Extraction Instruction aloud. Includes 54 pre-rendered neural studio voice recordings and a dedicated Listen button on the instruction card.",
    highlights: [
      {
        type: "feature",
        badge: "Spoken Instructions",
        title: "Active Extraction Instruction Spoken As Timer Ticks",
        description: "Countdown now announces the phase name, time, and complete Active Extraction Instruction (e.g. 'Bloom Phase, 45 seconds. Saturate grounds evenly with 3x coffee weight in circular motion. Let coffee bloom and de-gas.') while the mechanical clock continues clicking in rhythm."
      },
      {
        type: "feature",
        badge: "54 Studio Tracks",
        title: "54 Neural British Voice Clips for Every Method",
        description: "Synthesized 54 studio audio files using Microsoft Edge Neural Voice (en-GB-SoniaNeural) covering all 18 coffee and tea methods with exact extraction instructions and fallback Web Speech API synthesis."
      },
      {
        type: "enhancement",
        badge: "Listen On-Demand",
        title: "Dedicated Listen Button on Instruction Card",
        description: "Added a tactile '[ 🔊 Listen ]' button directly inside the Active Extraction Instruction box so users can replay or hear the instruction at any time during extraction."
      },
      {
        type: "enhancement",
        badge: "Audio Memory",
        title: "Escapement Tick Audio Instance Optimization",
        description: "Optimized HTML5 clockwork tick sound instances with a singleton audio element to prevent memory churn during long steep and immersion countdowns."
      }
    ]
  },
  {
    version: "1.4.2",
    releaseDate: "2026-09-06",
    title: "Mechanical Clockwork Ticking, Studio Audio Voice & Dual Mute Controls",
    summary: "Introduced authentic mechanical clockwork escapement ticking every second, tactile switch clicks on all controls, studio British female voice guidance for all 48 coffee/tea extraction phases, and dual prominent mute buttons.",
    highlights: [
      {
        type: "feature",
        badge: "Clockwork Tick",
        title: "Per-Second Mechanical Clock Ticking",
        description: "Countdown now plays an authentic mechanical clockwork tick every second (alternating 2600Hz/1950Hz escapement pallet clicks with 360Hz/300Hz body resonance) for true physical barista timer sound."
      },
      {
        type: "feature",
        badge: "Studio Voice",
        title: "Pre-Rendered British Female Voice Guidance",
        description: "All 48 coffee and tea phases now feature pre-rendered studio voice guidance ('Bloom Phase, 45 seconds', 'First Pulse Pour, 45 seconds', etc.) ensuring loud, reliable audio on both desktop and mobile devices."
      },
      {
        type: "enhancement",
        badge: "Mute Controls",
        title: "Dual Prominent Mute Buttons",
        description: "Placed an eye-catching glowing Speaker/Mute toggle directly beneath the Timer Ready box, plus a 4th dedicated mute button in the main timer controls row for immediate one-tap muting."
      },
      {
        type: "enhancement",
        badge: "Tactile Feedback",
        title: "Mechanical Switch Click Sounds",
        description: "All button presses (Start, Pause, Resume, Skip, Reset, Mute) and dial clicks now trigger an authentic tactile micro-switch contact snap."
      }
    ]
  },
  {
    version: "1.4.1",
    releaseDate: "2026-09-06",
    title: "Mobile Audio Unlock & Precision Wall-Clock Timer Overhaul",
    summary: "Resolved mobile browser timer freezing and speech synthesis delays with persistent AudioContext singleton, asynchronous voice guidance, touch gesture unlocking, and drift-free wall-clock timestamp tracking.",
    highlights: [
      {
        type: "fix",
        badge: "Timer Precision",
        title: "Instant Countdown Start & Zero Freezing",
        description: "Starting the timer immediately initiates the active countdown without waiting for browser speech engines, preventing the 2.2-second pause and mobile cancellation lockouts."
      },
      {
        type: "fix",
        badge: "Mobile Audio",
        title: "Web Audio Singleton & Touch Gesture Unlock",
        description: "Replaced per-chime context instantiation with a shared AudioContext singleton unlocked on first touch/tap, eliminating iOS Safari / Android Chrome 6-context limits and autoplay blocks."
      },
      {
        type: "fix",
        badge: "Sleep Resilience",
        title: "Wall-Clock Target Tracking & Wake-up Recovery",
        description: "Replaced naive setInterval ticks with absolute Date.now() timestamp difference calculations, guaranteeing exact remaining seconds even after phone screen dimming or tab switching."
      },
      {
        type: "enhancement",
        badge: "Mobile UX",
        title: "Smooth Mobile Step Navigation",
        description: "Added automatic smooth scroll-to-top on step transitions to keep the guided extraction view squarely in focus on all mobile viewports."
      }
    ]
  },
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
