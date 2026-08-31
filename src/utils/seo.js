// SEO and JSON-LD Structured Data Utilities for The Brew App

export function getMethodJsonLd(method) {
  if (!method) return null;
  const totalSec = (method.phases || []).reduce((acc, p) => acc + (p.durationSec || 0), 0);
  const minutes = Math.ceil(totalSec / 60) || 3;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to Brew ${method.name} - The Art of Extraction`,
    "description": method.description || `Step-by-step extraction guide, precision water ratio, and phases for ${method.name}.`,
    "totalTime": `PT${minutes}M`,
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
        "name": "Burr Grinder & Precision Scale"
      },
      {
        "@type": "HowToTool",
        "name": "Variable Temperature Gooseneck Kettle"
      }
    ],
    "step": (method.phases || []).map((phase, idx) => ({
      "@type": "HowToStep",
      "position": idx + 1,
      "name": phase.name,
      "text": phase.instruction
    }))
  };
}

export function updatePageSeo(title, description, canonicalUrl, ogImage) {
  if (typeof document === 'undefined') return;

  // Title
  document.title = title ? `${title} | The Brew App` : 'The Brew App: The Art of Extraction | Precision Coffee & Tea Guide';

  // Description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && description) {
    metaDesc.setAttribute('content', description);
  }

  // Canonical
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical && canonicalUrl) {
    canonical.setAttribute('href', canonicalUrl);
  }

  // Open Graph Title & Description
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle && title) {
    ogTitle.setAttribute('content', `${title} | The Brew App`);
  }
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc && description) {
    ogDesc.setAttribute('content', description);
  }

  // Inject / Update JSON-LD Script tag
  let script = document.getElementById('json-ld-structured-data');
  return script;
}
