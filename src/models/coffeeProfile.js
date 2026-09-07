/**
 * The Brew App — Canonical CoffeeProfile Domain Entity
 * 
 * Standardizes coffee bean representation across all subsystems:
 * - Camera Barcode/QR Scanner
 * - B2B Roaster Onboarding & Studio
 * - Verified Specialty Roaster Catalog
 * - Multi-Phase Brewing Timer
 * - Water Chemistry Lab
 * - Brew Cellar & Journal
 * - Community Hub
 */

export function createCoffeeProfile(input = {}) {
  const roaster = (input.roaster || input.brand || input.brand_owner || 'Specialty Coffee Roaster').trim();
  const beanName = (input.beanName || input.product_name || input.name || 'Single Origin Lot').trim();
  const origin = (input.origin || input.origins || input.countries || 'Specialty Origin').trim();
  const elevation = (input.elevation || '1,800+ MASL').trim();
  const process = (input.process || 'Washed').trim();
  const roastLevel = (input.roastLevel || 'Light-Medium').trim();

  // Parse tasting notes to clean array
  let tastingNotes = [];
  if (Array.isArray(input.tastingNotes)) {
    tastingNotes = input.tastingNotes.map(n => String(n).trim()).filter(Boolean);
  } else if (typeof input.tastingNotes === 'string') {
    tastingNotes = input.tastingNotes.split(',').map(n => n.trim()).filter(Boolean);
  }
  if (tastingNotes.length === 0) {
    tastingNotes = ['Artisan Roast', 'Balanced Body', 'Clean Finish'];
  }

  // Extraction parameters
  const ratio = Number(input.recommendedRatio || input.ratio || 16.5);
  let tempF = Number(input.tempF || (input.tempC ? Math.round((input.tempC * 9) / 5 + 32) : 202));
  if (isNaN(tempF) || tempF < 160 || tempF > 212) tempF = 202;
  const tempC = Math.round(((tempF - 32) * 5) / 9);

  const grind = (input.recommendedGrind || input.grind || 'Medium-Fine').trim();
  const method = (input.brewMethod || input.method || 'pour_over').trim();
  const brewTime = (input.brewTime || '3m 15s').trim();
  const bloomTime = (input.bloomTime || '45s').trim();

  // Identifiers & Packaging
  const upc = (input.upc || input.barcode || input.code || `LOT-${Date.now().toString().slice(-6)}`).trim();
  const customUrl = (input.customUrl || '').trim();
  const id = input.id || `coffee_${slugify(roaster + '_' + beanName + '_' + upc)}`;

  const notes = (input.notes || input.description || `Specialty lot from ${roaster}. Terroir: ${origin} (${process}).`).trim();

  return {
    id,
    roaster,
    location: (input.location || 'Artisan Small Batch').trim(),
    website: (input.website || '').trim(),
    beanName,
    origin,
    elevation,
    process,
    roastLevel,
    tastingNotes,
    extraction: {
      ratio,
      tempF,
      tempC,
      grind,
      method,
      brewTime,
      bloomTime,
      waterPpm: input.waterPpm || '60-80 ppm TDS (soft mineralized water)'
    },
    packaging: {
      upc,
      customUrl,
      isCertified: Boolean(input.isCertified ?? true)
    },
    notes,
    meta: {
      source: input.meta?.source || (input.isOffMatch ? 'open_food_facts' : 'app_registry'),
      createdAt: input.meta?.createdAt || new Date().toISOString()
    },
    // Flattened getters for backwards compatibility
    recommendedRatio: ratio,
    recommendedGrind: grind,
    tempF,
    tempC,
    brewMethod: method,
    upc
  };
}

export function slugify(str = '') {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}
