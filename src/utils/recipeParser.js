/**
 * Recipe QR & URL Parser for TheBrew.App
 * 
 * Supports:
 * 1. Raw JSON string embedded in QR code (Schema v1)
 * 2. URL with ?recipe=... (raw JSON, URI-encoded, or base64)
 * 3. URL with query parameters (?roaster=...&coffee=...&brewer=...)
 * 4. URL path /r/<id> matching verified catalog beans
 */

import { VERIFIED_BEAN_CATALOG } from '../data/verifiedBeans.js';

/**
 * Normalizes brewer name string to matching method ID
 */
export function normalizeBrewer(brewerStr) {
  if (!brewerStr || typeof brewerStr !== 'string') return 'pour_over';
  const clean = brewerStr.toLowerCase().replace(/[\s_-]+/g, '');

  if (clean.includes('pourover') || clean.includes('v60') || clean.includes('hario')) {
    return 'pour_over';
  }
  if (clean.includes('kalita') || clean.includes('flatbottom')) {
    return 'classic_pour_over';
  }
  if (clean.includes('frenchpress') || clean.includes('press') || clean.includes('plunger')) {
    return 'french_press';
  }
  if (clean.includes('aeropress')) {
    return 'aeropress';
  }
  if (clean.includes('chemex')) {
    return 'chemex';
  }
  if (clean.includes('mokapot') || clean.includes('moka') || clean.includes('stovetop')) {
    return 'moka_pot';
  }
  if (clean.includes('coldbrew')) {
    return 'cold_brew';
  }
  if (clean.includes('drip') || clean.includes('batch') || clean.includes('machine')) {
    return 'drip_brewer';
  }
  if (clean.includes('espresso')) {
    return 'espresso';
  }

  return 'pour_over';
}

/**
 * Extracts friendly tasting notes from roaster notes text
 */
export function extractTastingNotes(notesStr) {
  if (!notesStr || typeof notesStr !== 'string') return ['Balanced Profile'];
  
  // Take first sentence or clause
  const firstPart = notesStr.split(/[.;!]/)[0].trim();
  // Split on commas or 'and'
  const items = firstPart
    .split(/,|\band\b/i)
    .map(s => s.trim())
    .filter(s => s.length > 2 && s.length < 30 && !s.toLowerCase().includes('recommended') && !s.toLowerCase().includes('bloom') && !s.toLowerCase().includes('seconds'));
  
  if (items.length === 0) {
    return ['Artisan Roast', 'Balanced Profile'];
  }

  // Capitalize words
  return items.slice(0, 4).map(item => {
    return item
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  });
}

/**
 * Normalizes raw JSON payload or URL parameters into a standardized Bean/Recipe object
 */
export function normalizeRecipeBean(data) {
  if (!data || typeof data !== 'object') return null;

  const roaster = data.roaster || 'Specialty Roaster';
  const coffee = data.coffee || data.beanName || data.bean || 'Bag Micro-Lot';
  const brewMethod = normalizeBrewer(data.brewer || data.method);
  
  const ratio = parseFloat(data.ratio) || (data.water && data.dose ? Number((parseFloat(data.water) / parseFloat(data.dose)).toFixed(1)) : 16.0);
  const dose = parseFloat(data.dose || data.coffee_grams || data.dryDoseGrams) || 18.8;
  const water = parseFloat(data.water || data.water_grams || data.waterGrams) || Math.round(dose * ratio);
  
  const tempF = parseInt(data.temp_f || data.tempF || '205', 10);
  const tempC = data.temp_c ? parseInt(data.temp_c, 10) : Math.round(((tempF - 32) * 5) / 9);
  
  const grind = data.grind || 'Medium-Fine';
  const totalTimeSec = parseInt(data.total_time_sec || data.timeSec || '210', 10);
  const bloomWater = parseInt(data.bloom_water || '60', 10);
  const bloomTimeSec = parseInt(data.bloom_time_sec || '45', 10);
  
  const rawNotes = data.notes || `${coffee} dialed in for ${String(brewMethod || 'pour_over').replace(/_/g, ' ')}.`;
  const tastingNotes = Array.isArray(data.tasting_notes || data.tastingNotes) 
    ? (data.tasting_notes || data.tastingNotes)
    : extractTastingNotes(rawNotes);

  const roast = data.roast 
    ? (data.roast.charAt(0).toUpperCase() + data.roast.slice(1) + (data.roast.toLowerCase().includes('roast') ? '' : ' Roast'))
    : 'Medium Roast';

  // Construct customized brew phases matching roaster specifications
  const remainingSec = Math.max(60, totalTimeSec - bloomTimeSec);
  const mainPourSec = Math.floor(remainingSec * 0.55);
  const drawdownSec = remainingSec - mainPourSec;

  const customPhases = [
    {
      name: 'Bloom Phase',
      durationSec: bloomTimeSec,
      waterGrams: bloomWater,
      waterMultiplier: Number((bloomWater / dose).toFixed(1)),
      instruction: `Saturate grounds evenly with ${bloomWater}g water in circular motion. Let coffee bloom and de-gas for ${bloomTimeSec}s.`
    },
    {
      name: 'Main Pour',
      durationSec: mainPourSec,
      waterGrams: Math.round(water * 0.8),
      waterMultiplier: 0.8,
      instruction: 'Pour in steady concentric spirals from center outward. Maintain gentle, consistent water flow.'
    },
    {
      name: 'Final Drawdown',
      durationSec: drawdownSec,
      waterGrams: water,
      waterMultiplier: 1.0,
      instruction: `Gently top up remaining water to ${water}g. Allow complete, flat-bed drawdown for high sweetness and clarity.`
    }
  ];

  return {
    id: `recipe_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    isBagRecipe: true,
    roaster,
    beanName: coffee,
    roastLevel: roast,
    brewMethod,
    recommendedRatio: ratio,
    dryDoseGrams: dose,
    waterGrams: water,
    tempF,
    tempC,
    recommendedGrind: grind,
    totalTimeSec,
    bloomWater,
    bloomTimeSec,
    notes: rawNotes,
    tastingNotes,
    customPhases,
    origin: data.origin || `${roaster} Selection`,
    process: data.process || 'Specialty Process',
    elevation: data.elevation || '1,800+ MASL'
  };
}

/**
 * Parses raw input from QR scanner or URL
 * Supports:
 * - Raw JSON string
 * - ?recipe=... (JSON, URL encoded, or Base64)
 * - /r/<id> route matching verified roaster catalog
 * - Generic query parameters
 */
export function parseRecipePayload(input) {
  if (!input) return null;
  const raw = typeof input === 'string' ? input.trim() : '';
  if (!raw) return null;

  // 1. Direct JSON string (from QR scanner)
  if (raw.startsWith('{') && raw.endsWith('}')) {
    try {
      const obj = JSON.parse(raw);
      if (obj && (obj.coffee || obj.roaster || obj.brewer || obj.ratio || obj.dose || obj.water)) {
        return normalizeRecipeBean(obj);
      }
    } catch {}
  }

  // 2. Check for URL with recipe parameter or query string
  if (raw.includes('?') || raw.includes('#') || raw.startsWith('http') || raw.includes('recipe=')) {
    try {
      let queryStr = '';
      if (raw.includes('?')) {
        queryStr = raw.split('?')[1].split('#')[0];
      } else if (raw.includes('#') && raw.includes('=')) {
        queryStr = raw.split('#')[1];
      }

      if (queryStr) {
        const params = new URLSearchParams(queryStr);

        // A. ?recipe= JSON or Base64
        if (params.has('recipe')) {
          const recipeParam = params.get('recipe').trim();

          // Try raw JSON
          if (recipeParam.startsWith('{') && recipeParam.endsWith('}')) {
            try {
              const obj = JSON.parse(recipeParam);
              return normalizeRecipeBean(obj);
            } catch {}
          }

          // Try URL-decoded JSON
          try {
            const decoded = decodeURIComponent(recipeParam);
            if (decoded.startsWith('{') && decoded.endsWith('}')) {
              const obj = JSON.parse(decoded);
              return normalizeRecipeBean(obj);
            }
          } catch {}

          // Try Base64-decoded JSON
          try {
            const b64Decoded = atob(recipeParam);
            if (b64Decoded.startsWith('{') && b64Decoded.endsWith('}')) {
              const obj = JSON.parse(b64Decoded);
              return normalizeRecipeBean(obj);
            }
          } catch {}
        }

        // B. Direct query parameters
        if (params.has('coffee') || params.has('roaster') || params.has('bean')) {
          let pathRoaster = null;
          if (raw.includes('/roasters/')) {
            const slugPart = raw.split('/roasters/')[1].split(/[?#]/)[0];
            if (slugPart && !['showcase', 'partner', 'info', 'registered', 'roasters', 'roaster'].includes(slugPart.toLowerCase())) {
              pathRoaster = slugPart.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            }
          }

          const queryData = {
            v: parseInt(params.get('v') || '1', 10),
            roaster: params.get('roaster') || pathRoaster || 'Specialty Roaster',
            coffee: params.get('coffee') || params.get('bean'),
            roast: params.get('roast'),
            brewer: params.get('brewer') || params.get('method'),
            ratio: parseFloat(params.get('ratio')),
            dose: parseFloat(params.get('dose') || params.get('coffee_grams')),
            water: parseFloat(params.get('water') || params.get('water_grams')),
            temp_f: parseInt(params.get('temp_f') || params.get('tempF') || '205', 10),
            grind: params.get('grind'),
            total_time_sec: parseInt(params.get('total_time_sec') || params.get('time_sec') || '210', 10),
            bloom_water: parseInt(params.get('bloom_water') || '60', 10),
            bloom_time_sec: parseInt(params.get('bloom_time_sec') || '45', 10),
            origin: params.get('origin'),
            process: params.get('process'),
            elevation: params.get('elevation'),
            notes: params.get('notes')
          };
          return normalizeRecipeBean(queryData);
        }
      }
    } catch (e) {
      console.warn('Error parsing recipe query string:', e);
    }
  }

  // 3. Check for path /r/<id> matching verified catalog
  if (raw.includes('/r/')) {
    const slug = raw.split('/r/')[1].split(/[?#]/)[0].toLowerCase().trim();
    if (slug) {
      const match = VERIFIED_BEAN_CATALOG.find(b => {
        const idMatch = b && b.id && slug ? (b.id.toLowerCase().includes(slug) || slug.includes(b.id.toLowerCase())) : false;
        const nameMatch = b && b.beanName && slug ? b.beanName.toLowerCase().replace(/[\s_-]+/g, '').includes(slug.replace(/[\s_-]+/g, '')) : false;
        return idMatch || nameMatch;
      });
      if (match) {
        return normalizeRecipeBean({
          roaster: match.roaster,
          coffee: match.beanName,
          roast: match.roastLevel,
          brewer: match.brewMethod,
          ratio: match.recommendedRatio,
          dose: 18.8,
          water: Math.round(18.8 * match.recommendedRatio),
          temp_f: match.tempF,
          grind: match.recommendedGrind,
          total_time_sec: 210,
          bloom_water: 60,
          bloom_time_sec: 45,
          notes: match.notes,
          tasting_notes: match.tastingNotes,
          origin: match.origin,
          process: match.process,
          elevation: match.elevation
        });
      }
    }
  }

  return null;
}
