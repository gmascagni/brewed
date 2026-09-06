import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BREW_METHODS } from '../src/data/brewData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

if (!fs.existsSync(distDir)) {
  console.error('dist directory does not exist! Please run vite build first.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// Copy 404.html for GitHub Pages SPA routing fallback
fs.writeFileSync(path.join(distDir, '404.html'), templateHtml);
fs.writeFileSync(path.join(rootDir, '404.html'), templateHtml);

const allMethods = [...(BREW_METHODS.coffee || []), ...(BREW_METHODS.tea || [])];

console.log(`Prerendering ${allMethods.length} method pages for search crawlers & social link previews...`);

allMethods.forEach((method) => {
  const methodDir = path.join(distDir, 'methods', method.id);
  fs.mkdirSync(methodDir, { recursive: true });

  const rootMethodDir = path.join(rootDir, 'methods', method.id);
  fs.mkdirSync(rootMethodDir, { recursive: true });

  const pageTitle = `How to Brew ${method.name} - The Art of Extraction | The Brew App`;
  const pageDescription = method.description || `Step-by-step extraction guide, precision water ratio, temperature, and phases for ${method.name}.`;
  const canonicalUrl = `https://thebrew.app/methods/${method.id}`;
  const totalSec = (method.phases || []).reduce((acc, p) => acc + (p.durationSec || 0), 0);
  const totalMinutes = Math.ceil(totalSec / 60) || 3;

  // Generate Schema.org HowTo JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to Brew ${method.name}`,
    "description": pageDescription,
    "totalTime": `PT${totalMinutes}M`,
    "supply": [
      {
        "@type": "HowToSupply",
        "name": method.category === 'tea' ? "Specialty Loose Leaf Tea" : "Specialty Single-Origin Coffee"
      },
      {
        "@type": "HowToSupply",
        "name": `Hot Water (${method.tempF || 200}°F / ${method.tempC || 93}°C)`
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": method.name
      },
      {
        "@type": "HowToTool",
        "name": "Precision Gram Scale & Multi-Phase Timer"
      }
    ],
    "step": (method.phases || []).map((phase, idx) => ({
      "@type": "HowToStep",
      "position": idx + 1,
      "name": phase.name,
      "text": phase.instruction
    }))
  };

  // Generate initial crawler-readable static HTML content
  const phasesListHtml = (method.phases || []).map((p, i) => `
    <li style="margin-bottom: 12px;">
      <strong>Phase ${i + 1}: ${p.name}</strong> (${p.durationSec}s) — ${p.instruction}
    </li>
  `).join('');

  const initialServerContent = `
    <div style="max-width: 800px; margin: 40px auto; padding: 24px; font-family: sans-serif; color: #F8F5F1; background-color: #14110E; border-radius: 24px; border: 1px solid rgba(212, 140, 70, 0.4);">
      <header style="margin-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px;">
        <span style="font-size: 11px; font-family: monospace; text-transform: uppercase; color: #D48C46; font-weight: bold; letter-spacing: 0.15em;">
          The Brew App • ${method.category === 'tea' ? 'Specialty Tea Guide' : 'Specialty Coffee Guide'}
        </span>
        <h1 style="font-family: serif; font-size: 32px; font-weight: bold; margin: 8px 0; color: #F8F5F1;">
          ${method.name}
        </h1>
        <p style="font-size: 14px; color: #D4D4D8; line-height: 1.6;">
          ${method.description}
        </p>
      </header>

      <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px;">
        <div style="background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="font-size: 10px; text-transform: uppercase; color: #A1A1AA; font-family: monospace;">Extraction Ratio</div>
          <div style="font-size: 18px; font-weight: bold; color: #D48C46; font-family: monospace;">1 : ${method.ratio}</div>
        </div>
        <div style="background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="font-size: 10px; text-transform: uppercase; color: #A1A1AA; font-family: monospace;">Target Water Temp</div>
          <div style="font-size: 18px; font-weight: bold; color: #67E8F9; font-family: monospace;">${method.tempF}°F (${method.tempC}°C)</div>
        </div>
        ${method.grind ? `
        <div style="background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="font-size: 10px; text-transform: uppercase; color: #A1A1AA; font-family: monospace;">Grind Texture</div>
          <div style="font-size: 18px; font-weight: bold; color: #D48C46; font-family: monospace;">${method.grind}</div>
        </div>
        ` : ''}
      </section>

      <section style="margin-bottom: 24px;">
        <h2 style="font-family: serif; font-size: 20px; font-weight: bold; margin-bottom: 12px; color: #F8F5F1;">
          Step-by-Step Extraction Phases
        </h2>
        <ol style="padding-left: 20px; font-size: 13px; line-height: 1.6; color: #E4E4E7;">
          ${phasesListHtml}
        </ol>
      </section>

      <footer style="font-size: 11px; color: #A1A1AA; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px;">
        Interactive precision ratio scaling, live multi-phase timer, and masterclass videos available in The Brew App.
      </footer>
    </div>
  `;

  // Inject meta tags and initial content into template HTML
  let customHtml = templateHtml;

  // Title replacement
  customHtml = customHtml.replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`);

  // Description replacement
  customHtml = customHtml.replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${pageDescription}" />`);

  // Canonical replacement
  customHtml = customHtml.replace(/<link rel="canonical" href=".*?" \/>/i, `<link rel="canonical" href="${canonicalUrl}" />`);

  // OG Title & Desc replacement
  customHtml = customHtml.replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${pageTitle}" />`);
  customHtml = customHtml.replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${pageDescription}" />`);
  customHtml = customHtml.replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${canonicalUrl}" />`);

  // Twitter replacement
  customHtml = customHtml.replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${pageTitle}" />`);
  customHtml = customHtml.replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${pageDescription}" />`);
  customHtml = customHtml.replace(/<meta name="twitter:url" content=".*?" \/>/i, `<meta name="twitter:url" content="${canonicalUrl}" />`);

  // Inject JSON-LD
  const jsonLdScriptTag = `<script id="json-ld-structured-data" type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
  customHtml = customHtml.replace('</head>', `  ${jsonLdScriptTag}\n  </head>`);

  // Inject readable initial HTML into #root
  customHtml = customHtml.replace('<div id="root"></div>', `<div id="root">${initialServerContent}</div>`);

  fs.writeFileSync(path.join(methodDir, 'index.html'), customHtml);
  fs.writeFileSync(path.join(rootMethodDir, 'index.html'), customHtml);
});

console.log('✓ Successfully prerendered all method pages with complete JSON-LD and crawler-readable markup!');

// ----------------------------------------------------
// Prerender Guides: /guides/coffee-water-chemistry
// ----------------------------------------------------
console.log('Prerendering /guides/coffee-water-chemistry guide page...');

const guideDistDir = path.join(distDir, 'guides', 'coffee-water-chemistry');
fs.mkdirSync(guideDistDir, { recursive: true });
const guideRootDir = path.join(rootDir, 'guides', 'coffee-water-chemistry');
fs.mkdirSync(guideRootDir, { recursive: true });

const waterGuideTitle = 'Coffee Water Chemistry & Extraction Yield Guide | The Brew App';
const waterGuideDesc = 'Master coffee water chemistry: SCA water specs, Lotus drop recipes, DIY mineral recipes (GH & KH), and extraction yield optimization for specialty coffee.';
const waterGuideUrl = 'https://thebrew.app/guides/coffee-water-chemistry';

const waterGuideJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Coffee Water Chemistry & Extraction Yield Guide",
      "description": waterGuideDesc,
      "url": waterGuideUrl,
      "inLanguage": "en-US",
      "publisher": {
        "@type": "Organization",
        "name": "The Brew App",
        "url": "https://thebrew.app"
      }
    },
    {
      "@type": "HowTo",
      "name": "How to Formulate Specialty Coffee Brewing Water",
      "description": "Step-by-step guide to remineralizing zero-TDS (distilled or reverse osmosis) water for optimal extraction using Lotus drops or DIY mineral salts.",
      "totalTime": "PT5M",
      "supply": [
        { "@type": "HowToSupply", "name": "Distilled or Reverse Osmosis Water (1 Gallon or 1 Liter)" },
        { "@type": "HowToSupply", "name": "Lotus Water Drops (Mg, Ca, Buffer) or Food-Grade Epsom Salt & Baking Soda" }
      ],
      "tool": [
        { "@type": "HowToTool", "name": "Digital TDS Pen (0-999 PPM)" },
        { "@type": "HowToTool", "name": "Precision 0.01g Scale or Dropper" }
      ],
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Start with Zero-Baseline Water",
          "text": "Procure steam-distilled water or deionized reverse osmosis (RO) water with a measured TDS between 0 and 5 ppm."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Dose General Hardness (GH) Cations",
          "text": "Add Magnesium (Epsom salt or Lotus Magnesium) to extract volatile fruit and floral flavor acids, followed by Calcium to coat the palate and round out chocolate sweetness."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Dose Carbonate Hardness (KH) Buffer",
          "text": "Add Potassium Bicarbonate or Sodium Bicarbonate (baking soda) at 35-45 ppm CaCO3 equivalent to prevent harsh, sour vinegary extraction while keeping lively acidity intact."
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Verify TDS & Shake Thoroughly",
          "text": "Shake the jug vigorously for 30 seconds and test with your calibrated TDS meter to ensure 120-150 ppm total dissolved solids before brewing."
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the ideal TDS for specialty coffee?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Specialty Coffee Association (SCA) recommends a target Total Dissolved Solids (TDS) of 150 ppm (acceptable range: 75 to 250 ppm) with zero chlorine and a neutral pH of 7.0."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between GH and KH in coffee water?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "General Hardness (GH) measures dissolved calcium and magnesium ions which bind to flavor compounds and pull them from coffee grounds. Carbonate Hardness (KH or Alkalinity) measures bicarbonate ions which act as a chemical buffer to neutralize acids."
          }
        },
        {
          "@type": "Question",
          "name": "Why shouldn't I brew with pure distilled or RO water?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Water with 0 TDS lacks the mineral ions (calcium and magnesium) needed to bond with the aromatic coffee compounds, resulting in flat, sour, hollow, and drastically underextracted coffee."
          }
        }
      ]
    }
  ]
};

const waterGuideContent = `
  <div style="max-width: 860px; margin: 40px auto; padding: 32px 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #F8F5F1; background-color: #14110E; border-radius: 24px; border: 1px solid rgba(212, 140, 70, 0.4); line-height: 1.6;">
    <header style="margin-bottom: 32px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px;">
      <span style="font-size: 11px; font-family: monospace; text-transform: uppercase; color: #D48C46; font-weight: bold; letter-spacing: 0.15em;">
        The Brew App • Advanced Water Science
      </span>
      <h1 style="font-family: serif; font-size: 36px; font-weight: bold; margin: 12px 0; color: #F8F5F1;">
        Coffee Water Chemistry & Extraction Yield Guide
      </h1>
      <p style="font-size: 16px; color: #D4D4D8;">
        Your brewed cup is 98.5% water. Discover how magnesium, calcium, and bicarbonate alkalinity dictate your extraction yield, cup clarity, and brightness.
      </p>
    </header>

    <section style="margin-bottom: 32px;">
      <h2 style="font-family: serif; font-size: 22px; font-weight: bold; color: #F8F5F1; margin-bottom: 12px;">
        1. The SCA Water Standard Target Specification
      </h2>
      <p style="font-size: 14px; color: #D4D4D8; margin-bottom: 16px;">
        The Specialty Coffee Association defines exact physical and chemical metrics required to extract balanced solubles from roast coffee beans without corrosion or scale buildup.
      </p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
        <div style="background: rgba(255,255,255,0.05); padding: 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="font-size: 11px; text-transform: uppercase; color: #A1A1AA; font-family: monospace;">Target TDS</div>
          <div style="font-size: 20px; font-weight: bold; color: #D48C46; font-family: monospace;">150 PPM</div>
          <div style="font-size: 11px; color: #71717A;">Range: 75 – 250 PPM</div>
        </div>
        <div style="background: rgba(255,255,255,0.05); padding: 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="font-size: 11px; text-transform: uppercase; color: #A1A1AA; font-family: monospace;">General Hardness (GH)</div>
          <div style="font-size: 20px; font-weight: bold; color: #67E8F9; font-family: monospace;">68 PPM</div>
          <div style="font-size: 11px; color: #71717A;">CaCO3 equivalent (50-175)</div>
        </div>
        <div style="background: rgba(255,255,255,0.05); padding: 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="font-size: 11px; text-transform: uppercase; color: #A1A1AA; font-family: monospace;">Alkalinity (KH)</div>
          <div style="font-size: 20px; font-weight: bold; color: #34D399; font-family: monospace;">40 PPM</div>
          <div style="font-size: 11px; color: #71717A;">Buffer CaCO3 (target 40)</div>
        </div>
        <div style="background: rgba(255,255,255,0.05); padding: 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="font-size: 11px; text-transform: uppercase; color: #A1A1AA; font-family: monospace;">Target pH</div>
          <div style="font-size: 20px; font-weight: bold; color: #F8F5F1; font-family: monospace;">7.0</div>
          <div style="font-size: 11px; color: #71717A;">Range: 6.5 – 7.5</div>
        </div>
      </div>
    </section>

    <section style="margin-bottom: 32px;">
      <h2 style="font-family: serif; font-size: 22px; font-weight: bold; color: #F8F5F1; margin-bottom: 12px;">
        2. Mineral Breakdown: What Each Ion Does
      </h2>
      <ul style="padding-left: 20px; font-size: 14px; color: #E4E4E7; line-height: 1.8;">
        <li><strong style="color: #67E8F9;">Magnesium (Mg²⁺):</strong> Has high charge density that bonds aggressively with oxygen-rich organic acids and aroma volatiles. Crucial for pulling crisp floral and citrus notes in washed African lots.</li>
        <li><strong style="color: #D48C46;">Calcium (Ca²⁺):</strong> Bonds moderately with heavier aromatic compounds, emphasizing body, creamy mouthfeel, and chocolate/caramel sweetness.</li>
        <li><strong style="color: #34D399;">Bicarbonate Buffer (HCO₃⁻):</strong> Neutralizes excess hydrogen ions. Too little buffer makes the cup sour and harsh; too much buffer flattens acidity and makes coffee taste dull and chalky.</li>
      </ul>
    </section>

    <section style="margin-bottom: 32px;">
      <h2 style="font-family: serif; font-size: 22px; font-weight: bold; color: #F8F5F1; margin-bottom: 12px;">
        3. Formulated Water Recipes
      </h2>
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: 12px; border-left: 4px solid #67E8F9;">
          <h3 style="font-size: 16px; font-weight: bold; color: #F8F5F1; margin: 0 0 6px 0;">Light Roast Brightness (Filter / V60)</h3>
          <p style="font-size: 13px; color: #D4D4D8; margin: 0 0 8px 0;">Optimized for delicate washed Ethiopians, Kenyans, and Geishas with high fruit clarity.</p>
          <div style="font-family: monospace; font-size: 12px; color: #67E8F9;">Lotus Drops (per 1L): 4 drops Magnesium • 1 drop Calcium • 1 drop Bicarbonate • 0 drops Potassium</div>
        </div>
        <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: 12px; border-left: 4px solid #D48C46;">
          <h3 style="font-size: 16px; font-weight: bold; color: #F8F5F1; margin: 0 0 6px 0;">Balanced Daily Cup (SCA Benchmark)</h3>
          <p style="font-size: 13px; color: #D4D4D8; margin: 0 0 8px 0;">All-rounder profile suited for medium roasts, South American washed coffees, and blends.</p>
          <div style="font-family: monospace; font-size: 12px; color: #D48C46;">Lotus Drops (per 1L): 3 drops Magnesium • 2 drops Calcium • 2 drops Bicarbonate • 1 drop Potassium</div>
        </div>
        <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: 12px; border-left: 4px solid #F59E0B;">
          <h3 style="font-size: 16px; font-weight: bold; color: #F8F5F1; margin: 0 0 6px 0;">Sweet & Heavy Espresso (High Extraction)</h3>
          <p style="font-size: 13px; color: #D4D4D8; margin: 0 0 8px 0;">High buffer and high calcium for thick crema, muted sharp bitterness, and prolonged finish.</p>
          <div style="font-family: monospace; font-size: 12px; color: #F59E0B;">Lotus Drops (per 1L): 2 drops Magnesium • 4 drops Calcium • 3 drops Bicarbonate • 1 drop Potassium</div>
        </div>
      </div>
    </section>

    <footer style="font-size: 12px; color: #A1A1AA; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px; text-align: center;">
      Use the interactive <strong>Water Lab</strong> inside <a href="https://thebrew.app" style="color: #D48C46; text-decoration: underline;">The Brew App</a> to calculate exact drop counts and DIY mineral grams for any container size.
    </footer>
  </div>
`;

let waterHtml = templateHtml;
waterHtml = waterHtml.replace(/<title>.*?<\/title>/i, `<title>${waterGuideTitle}</title>`);
waterHtml = waterHtml.replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${waterGuideDesc}" />`);
waterHtml = waterHtml.replace(/<link rel="canonical" href=".*?" \/>/i, `<link rel="canonical" href="${waterGuideUrl}" />`);
waterHtml = waterHtml.replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${waterGuideTitle}" />`);
waterHtml = waterHtml.replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${waterGuideDesc}" />`);
waterHtml = waterHtml.replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${waterGuideUrl}" />`);
waterHtml = waterHtml.replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${waterGuideTitle}" />`);
waterHtml = waterHtml.replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${waterGuideDesc}" />`);
waterHtml = waterHtml.replace(/<meta name="twitter:url" content=".*?" \/>/i, `<meta name="twitter:url" content="${waterGuideUrl}" />`);

const waterJsonLdTag = `<script id="json-ld-structured-data" type="application/ld+json">${JSON.stringify(waterGuideJsonLd)}</script>`;
waterHtml = waterHtml.replace('</head>', `  ${waterJsonLdTag}\n  </head>`);
waterHtml = waterHtml.replace('<div id="root"></div>', `<div id="root">${waterGuideContent}</div>`);

fs.writeFileSync(path.join(guideDistDir, 'index.html'), waterHtml);
fs.writeFileSync(path.join(guideRootDir, 'index.html'), waterHtml);

console.log('✓ Successfully prerendered /guides/coffee-water-chemistry with Article, HowTo, and FAQPage schemas!');

