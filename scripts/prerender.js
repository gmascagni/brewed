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
