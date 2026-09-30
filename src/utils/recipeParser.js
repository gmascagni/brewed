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
import { getRegisteredCoffees } from '../data/roasterRegistry.js';
import { getBloomScalingMetrics } from './bloomScaling.js';

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
  
  const bloomMetrics = getBloomScalingMetrics(dose);
  const bloomWater = parseInt(data.bloom_water, 10) || bloomMetrics.targetWaterGrams;
  const bloomTimeSec = parseInt(data.bloom_time_sec, 10) || bloomMetrics.durationSec;
  
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
      instruction: `Saturate grounds evenly with ${bloomWater}g water (${bloomMetrics.waterRangeStr}). Let coffee bloom and de-gas for ${bloomTimeSec}s.`
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
    id: data.id || `recipe_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    isBagRecipe: true,
    roaster,
    roasterSlug: data.roasterSlug || (typeof roaster === 'string' ? roaster.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 'specialty-roaster'),
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

        // B. Direct query parameters (supports both standard and ultra-compact single-letter keys)
        if (params.has('coffee') || params.has('roaster') || params.has('bean') || params.has('b') || params.has('r') || params.has('c')) {
          let pathRoaster = null;
          if (raw.includes('/roasters/')) {
            const slugPart = raw.split('/roasters/')[1].split(/[?#]/)[0];
            if (slugPart && !['showcase', 'partner', 'info', 'registered', 'roasters', 'roaster'].includes(slugPart.toLowerCase())) {
              pathRoaster = slugPart.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            }
          }

          // If 'c' (coffeeId / slug / upc) is present, attempt catalog lookup first
          const coffeeIdQuery = params.get('c') || params.get('coffeeId');
          if (coffeeIdQuery) {
            const cleanQuery = coffeeIdQuery.toLowerCase().replace(/[^a-z0-9]/g, '');
            const registeredList = getAllAvailableCoffees();
            const match = registeredList.find(b => {
              if (!b) return false;
              const cleanId = (b.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
              const cleanUpc = (b.upc || '').toLowerCase().replace(/[^a-z0-9]/g, '');
              const cleanName = (b.beanName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
              return (cleanId && (cleanId === cleanQuery || cleanId.includes(cleanQuery) || cleanQuery.includes(cleanId)))
                  || (cleanUpc && cleanUpc === cleanQuery)
                  || (cleanName && (cleanName === cleanQuery || cleanQuery.includes(cleanName) || cleanName.includes(cleanQuery)));
            });
            if (match) {
              return formatMatchedCoffeeRecipe(match);
            }
          }

          const queryData = {
            v: parseInt(params.get('v') || '1', 10),
            roaster: params.get('roasterName') || params.get('roaster') || params.get('r') || pathRoaster || 'Specialty Roaster',
            roasterSlug: params.get('roaster') || params.get('roasterSlug') || (pathRoaster ? pathRoaster.toLowerCase().replace(/[^a-z0-9]+/g, '-') : null),
            coffee: params.get('coffee') || params.get('bean') || params.get('b'),
            roast: params.get('roast'),
            brewer: params.get('brewer') || params.get('method') || params.get('m'),
            ratio: parseFloat(params.get('ratio') || params.get('x')),
            dose: parseFloat(params.get('dose') || params.get('coffee_grams')),
            water: parseFloat(params.get('water') || params.get('water_grams')),
            temp_f: parseInt(params.get('temp_f') || params.get('tempF') || params.get('t') || '205', 10),
            grind: params.get('grind') || params.get('g'),
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

  // 3. Check for path /r/<id> matching verified or registered catalog
  if (raw.includes('/r/')) {
    const slug = raw.split('/r/')[1].split(/[?#]/)[0].toLowerCase().trim();
    if (slug) {
      const cleanSlug = slug.replace(/[^a-z0-9]/g, '');
      const allCoffees = getAllAvailableCoffees();
      const match = allCoffees.find(b => {
        if (!b) return false;
        const cleanId = (b.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanUpc = (b.upc || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanName = (b.beanName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        
        const idMatch = cleanId && (cleanId === cleanSlug || cleanId.includes(cleanSlug) || cleanSlug.includes(cleanId));
        const upcMatch = cleanUpc && (cleanUpc === cleanSlug);
        const nameMatch = cleanName && (cleanName === cleanSlug || cleanSlug.includes(cleanName) || cleanName.includes(cleanSlug));
        return idMatch || upcMatch || nameMatch;
      });
      if (match) {
        return formatMatchedCoffeeRecipe(match);
      }
    }
  }

  return null;
}

/**
 * Retrieve all registered, showcase, and verified catalog coffees
 */
export function getAllAvailableCoffees() {
  return getRegisteredCoffees ? getRegisteredCoffees(VERIFIED_BEAN_CATALOG) : VERIFIED_BEAN_CATALOG;
}

/**
 * Normalizes a matched catalog coffee into authentic dial-in parameters
 */
export function formatMatchedCoffeeRecipe(match) {
  if (!match) return null;

  const ratio = parseFloat(match.recommendedRatio) || 16.0;
  const dose = parseFloat(match.dryDoseGrams) || 18.8;
  const water = parseFloat(match.waterGrams) || Math.round(dose * ratio);

  let totalTimeSec = 210;
  if (match.totalTimeSec) {
    totalTimeSec = parseInt(match.totalTimeSec, 10);
  } else if (match.brewTime) {
    const mMatch = String(match.brewTime).match(/(\d+)\s*m(?:in)?\s*(\d*)\s*s?/i);
    if (mMatch) {
      totalTimeSec = parseInt(mMatch[1], 10) * 60 + (mMatch[2] ? parseInt(mMatch[2], 10) : 0);
    }
  }

  let bloomWater = 60;
  let bloomTimeSec = 45;
  if (match.bloomWater) {
    bloomWater = parseInt(match.bloomWater, 10);
  } else if (match.pourSchedule?.[0]?.water) {
    const bwMatch = String(match.pourSchedule[0].water).match(/(\d+)/);
    if (bwMatch) bloomWater = parseInt(bwMatch[1], 10);
  }
  if (match.bloomTimeSec) {
    bloomTimeSec = parseInt(match.bloomTimeSec, 10);
  } else if (match.pourSchedule?.[0]?.time) {
    const btMatch = String(match.pourSchedule[0].time).match(/0:00\s*-\s*0:(\d+)/);
    if (btMatch) bloomTimeSec = parseInt(btMatch[1], 10);
  }

  return normalizeRecipeBean({
    id: match.id,
    roaster: match.roaster,
    coffee: match.beanName,
    roast: match.roastLevel,
    brewer: match.brewMethod,
    ratio: ratio,
    dose: dose,
    water: water,
    temp_f: match.tempF,
    temp_c: match.tempC,
    grind: match.recommendedGrind,
    total_time_sec: totalTimeSec,
    bloom_water: bloomWater,
    bloom_time_sec: bloomTimeSec,
    notes: match.notes || match.description,
    tasting_notes: match.tastingNotes,
    origin: match.origin,
    process: match.process,
    elevation: match.elevation
  });
}

/**
 * Parses free text (Instagram captions, YouTube descriptions, recipe blogs, forum posts)
 * or external URLs into structured recipe objects with step timelines.
 */
export function parseFreeTextRecipe(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') return null;
  const text = rawInput.trim();
  if (!text) return null;

  const methodNames = {
    pour_over: 'Hario V60 Dripper',
    classic_pour_over: 'Flat-Bottom Pour Over (Kalita)',
    chemex: 'Chemex Glass Brewer',
    aeropress: 'AeroPress',
    french_press: 'French Press',
    moka_pot: 'Bialetti Moka Pot',
    espresso: 'Espresso (9-Bar)',
    cold_brew: 'Cold Brew',
    drip_brewer: 'Batch Precision Brewer'
  };

  // 1. Check if input is a URL
  let sourceUrl = null;
  if (/^https?:\/\//i.test(text)) {
    sourceUrl = text;
    // Check if it's a thebrew.app link with ?recipe= or ?r= or /r/
    const parsedFromUrl = parseRecipePayload(text);
    if (parsedFromUrl) {
      return {
        ...parsedFromUrl,
        sourceUrl
      };
    }
    // YouTube link check
    if (/youtube\.com|youtu\.be/i.test(text)) {
      return {
        id: `imported_yt_${Date.now()}`,
        title: 'Imported YouTube Brew Guide',
        technique: 'YouTube Video Recipe',
        badge: 'Imported Video',
        methodId: 'pour_over',
        methodName: 'Hario V60 Dripper',
        trackMode: 'coffee',
        beanName: 'Creator Roast Recommendation',
        roasterName: 'YouTube Creator',
        ratio: 16.6,
        dryDoseGrams: 15.0,
        waterAmountMl: 250.0,
        waterTempC: 96,
        waterTempF: 205,
        grindSetting: 'Medium-Fine',
        totalTimeSec: 180,
        description: `Imported from YouTube video: ${text}`,
        sourceUrl: text,
        isCustom: true,
        steps: [
          { order: 1, durationSec: 45, waterMl: 50, action: 'Bloom Pour & Swirl (3x dose)' },
          { order: 2, durationSec: 45, waterMl: 150, action: 'First Main Pour in Gentle Concentric Spirals' },
          { order: 3, durationSec: 45, waterMl: 250, action: 'Final Center Pour & Leveling Swirl' },
          { order: 4, durationSec: 45, waterMl: 250, action: 'Drawdown to Flat Coffee Bed' }
        ]
      };
    }
    // Instagram link check
    if (/instagram\.com/i.test(text)) {
      return {
        id: `imported_ig_${Date.now()}`,
        title: 'Imported Instagram Recipe Post',
        technique: 'Social Media Recipe Protocol',
        badge: 'Imported Social',
        methodId: 'pour_over',
        methodName: 'Hario V60 Dripper',
        trackMode: 'coffee',
        beanName: 'Artisan Roast Selection',
        roasterName: 'Instagram Creator',
        ratio: 16.0,
        dryDoseGrams: 18.0,
        waterAmountMl: 288.0,
        waterTempC: 94,
        waterTempF: 202,
        grindSetting: 'Medium-Fine',
        totalTimeSec: 195,
        description: `Imported from Instagram post: ${text}`,
        sourceUrl: text,
        isCustom: true,
        steps: [
          { order: 1, durationSec: 45, waterMl: 60, action: 'Bloom Pour (3x coffee weight)' },
          { order: 2, durationSec: 60, waterMl: 180, action: 'Second Continuous Spiral Pour' },
          { order: 3, durationSec: 90, waterMl: 288, action: 'Final Pour to Target & Complete Drawdown' }
        ]
      };
    }
  }

  // 2. Parse unstructured free text
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const fullLower = text.toLowerCase();

  // Method detection
  let methodId = 'pour_over';
  if (fullLower.includes('kalita') || fullLower.includes('flat bottom') || fullLower.includes('flat-bottom') || fullLower.includes('wave')) {
    methodId = 'classic_pour_over';
  } else if (fullLower.includes('chemex')) {
    methodId = 'chemex';
  } else if (fullLower.includes('aeropress') || fullLower.includes('aero press')) {
    methodId = 'aeropress';
  } else if (fullLower.includes('french press') || fullLower.includes('french-press') || fullLower.includes('cafetiere') || fullLower.includes('plunger')) {
    methodId = 'french_press';
  } else if (fullLower.includes('moka') || fullLower.includes('bialetti') || fullLower.includes('stovetop')) {
    methodId = 'moka_pot';
  } else if (fullLower.includes('espresso')) {
    methodId = 'espresso';
  } else if (fullLower.includes('cold brew') || fullLower.includes('cold-brew') || fullLower.includes('toddy')) {
    methodId = 'cold_brew';
  } else if (fullLower.includes('drip') || fullLower.includes('moccamaster') || fullLower.includes('batch')) {
    methodId = 'drip_brewer';
  }

  // Dose extraction
  let dryDoseGrams = null;
  const doseMatch = text.match(/(?:dose|coffee|beans|grounds)?\s*[:=-]?\s*(\d+(?:\.\d+)?)\s*(?:g|grams?|gr)\b/i);
  if (doseMatch) {
    const val = parseFloat(doseMatch[1]);
    if (val >= 5 && val <= 120) dryDoseGrams = val;
  }
  if (!dryDoseGrams) {
    dryDoseGrams = methodId === 'espresso' ? 18.0 : methodId === 'french_press' ? 30.0 : methodId === 'chemex' ? 30.0 : 15.0;
  }

  // Water extraction
  let waterAmountMl = null;
  const waterMatch = text.match(/(?:water|yield|liquid|total\s*water)?\s*[:=-]?\s*(\d+(?:\.\d+)?)\s*(?:ml|g|grams?)\b/i);
  if (waterMatch) {
    const val = parseFloat(waterMatch[1]);
    if (val > dryDoseGrams && val <= 2500) waterAmountMl = val;
  }

  // Ratio extraction
  let ratio = null;
  const ratioMatch = text.match(/1\s*[:/]\s*(\d+(?:\.\d+)?)/i);
  if (ratioMatch) {
    const rVal = parseFloat(ratioMatch[1]);
    if (rVal >= 1.5 && rVal <= 25) ratio = rVal;
  }

  if (!ratio && waterAmountMl && dryDoseGrams) {
    ratio = Number((waterAmountMl / dryDoseGrams).toFixed(1));
  } else if (!waterAmountMl && ratio && dryDoseGrams) {
    waterAmountMl = Math.round(dryDoseGrams * ratio);
  } else if (!ratio && !waterAmountMl) {
    ratio = methodId === 'espresso' ? 2.0 : methodId === 'aeropress' ? 14.0 : 16.0;
    waterAmountMl = Math.round(dryDoseGrams * ratio);
  }

  // Water temperature extraction
  let waterTempC = 95;
  let waterTempF = 203;
  const tempFMatch = text.match(/(\d{3})\s*(?:°\s*f|f|deg\s*f)\b/i);
  const tempCMatch = text.match(/(\d{2})\s*(?:°\s*c|c|deg\s*c)\b/i);

  if (tempFMatch) {
    waterTempF = parseInt(tempFMatch[1], 10);
    waterTempC = Math.round(((waterTempF - 32) * 5) / 9);
  } else if (tempCMatch) {
    waterTempC = parseInt(tempCMatch[1], 10);
    waterTempF = Math.round((waterTempC * 9) / 5 + 32);
  } else if (fullLower.includes('boiling') || fullLower.includes('100c') || fullLower.includes('212f')) {
    waterTempC = 99;
    waterTempF = 210;
  } else if (fullLower.includes('off the boil')) {
    waterTempC = 96;
    waterTempF = 205;
  }

  // Grind setting extraction
  let grindSetting = 'Medium-Fine';
  const grindMatch = text.match(/(?:grind|setting)?\s*[:=-]?\s*([a-zA-Z0-9\s#\-–.,]+(?:clicks?|setting|burr|coarse|fine|medium|micron|µm))/i);
  if (grindMatch && grindMatch[1].length < 40) {
    grindSetting = grindMatch[1].trim();
  } else {
    if (fullLower.includes('extra fine') || methodId === 'espresso') grindSetting = 'Extra-Fine (200–300 µm)';
    else if (fullLower.includes('fine') || methodId === 'moka_pot') grindSetting = 'Fine (350–450 µm)';
    else if (fullLower.includes('medium-coarse') || methodId === 'chemex') grindSetting = 'Medium-Coarse (750–900 µm)';
    else if (fullLower.includes('coarse') || methodId === 'french_press' || methodId === 'cold_brew') grindSetting = 'Coarse (850–1000 µm)';
    else if (fullLower.includes('medium')) grindSetting = 'Medium (600–700 µm)';
    else grindSetting = 'Medium-Fine (500–650 µm)';
  }

  // Title extraction (First line or header)
  let title = lines[0] || 'Imported Coffee Recipe';
  if (title.length > 50 || title.includes('http') || title.match(/^[\d:.-]+/)) {
    title = `${methodNames[methodId] || 'Pour Over'} Artisan Recipe`;
  }

  // Structured Steps Extraction
  const steps = [];
  let lastTimeSec = 0;

  for (const line of lines) {
    const timeMatch = line.match(/^(\d+):(\d{2})\s*[-–:]?\s*(.*)/i);
    const numStepMatch = line.match(/^(?:step\s*)?(\d+)[.:)]\s*(.*)/i);

    if (timeMatch) {
      const min = parseInt(timeMatch[1], 10);
      const sec = parseInt(timeMatch[2], 10);
      const targetSec = min * 60 + sec;
      const durationSec = Math.max(15, targetSec - lastTimeSec);
      lastTimeSec = targetSec;
      const act = timeMatch[3].trim();
      const waterInStepMatch = act.match(/(\d+)\s*(?:g|ml)\b/i);
      const waterMl = waterInStepMatch ? parseInt(waterInStepMatch[1], 10) : Math.round(waterAmountMl * (steps.length + 1) / 3);

      steps.push({
        order: steps.length + 1,
        durationSec,
        waterMl,
        action: act || `Pour to ${waterMl}g`
      });
    } else if (numStepMatch && steps.length < 7) {
      const act = numStepMatch[2].trim();
      const waterInStepMatch = act.match(/(\d+)\s*(?:g|ml)\b/i);
      const waterMl = waterInStepMatch ? parseInt(waterInStepMatch[1], 10) : Math.round(waterAmountMl * (steps.length + 1) / 3);
      steps.push({
        order: steps.length + 1,
        durationSec: 45,
        waterMl,
        action: act || `Step ${steps.length + 1}`
      });
    }
  }

  // If no granular steps could be extracted from unstructured text, generate authentic scaled steps
  if (steps.length === 0) {
    const bloomWater = Math.round(dryDoseGrams * 3);
    const pour1 = Math.round(waterAmountMl * 0.6);
    steps.push(
      { order: 1, durationSec: 45, waterMl: bloomWater, action: `Bloom with ${bloomWater}g water; let de-gas for 45s` },
      { order: 2, durationSec: 60, waterMl: pour1, action: `First main pour in concentric circles to ${pour1}g` },
      { order: 3, durationSec: 45, waterMl: waterAmountMl, action: `Final pour to ${waterAmountMl}g; gentle swirl for flat bed` },
      { order: 4, durationSec: 45, waterMl: waterAmountMl, action: 'Even drawdown to finish' }
    );
  }

  const totalTimeSec = steps.reduce((sum, s) => sum + (s.durationSec || 0), 0) || 195;

  return {
    id: `imported_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    title,
    technique: 'Parsed Custom Recipe',
    badge: 'Imported Recipe',
    methodId,
    methodName: methodNames[methodId] || 'Pour Over',
    trackMode: 'coffee',
    beanName: 'Imported Coffee Selection',
    roasterName: 'Custom Roaster',
    ratio,
    dryDoseGrams,
    waterAmountMl,
    waterTempC,
    waterTempF,
    grindSetting,
    totalTimeSec,
    description: text.slice(0, 160) + (text.length > 160 ? '...' : ''),
    sourceUrl,
    isCustom: true,
    steps
  };
}

/**
 * Serializes a recipe into an authentic shareable link
 */
export function encodeRecipeToShareUrl(recipe) {
  if (!recipe) return typeof window !== 'undefined' ? window.location.origin : 'https://thebrew.app';
  const compact = {
    v: 1,
    title: recipe.title,
    method: recipe.methodId,
    methodName: recipe.methodName,
    dose: recipe.dryDoseGrams,
    water: recipe.waterAmountMl,
    ratio: recipe.ratio,
    tempF: recipe.waterTempF || Math.round((recipe.waterTempC * 9) / 5 + 32),
    grind: recipe.grindSetting,
    time: recipe.totalTimeSec,
    desc: recipe.description,
    steps: recipe.steps
  };
  try {
    const jsonStr = JSON.stringify(compact);
    const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://thebrew.app';
    return `${origin}/recipes?recipe=${b64}`;
  } catch (e) {
    console.warn('Failed to encode recipe:', e);
    return typeof window !== 'undefined' ? window.location.origin : 'https://thebrew.app';
  }
}

/**
 * Decodes a base64 or JSON recipe payload from URL query string
 */
export function decodeRecipeFromSharePayload(payload) {
  if (!payload) return null;
  try {
    let jsonStr = payload;
    if (!payload.startsWith('{')) {
      jsonStr = decodeURIComponent(escape(atob(payload)));
    }
    const data = JSON.parse(jsonStr);
    return {
      id: `shared_rec_${Date.now()}`,
      title: data.title || 'Shared Artisan Recipe',
      technique: 'Community Shared Protocol',
      badge: 'Community Recipe',
      methodId: data.method || 'pour_over',
      methodName: data.methodName || 'Pour Over',
      trackMode: 'coffee',
      beanName: 'Shared Coffee Selection',
      roasterName: 'Barista Community',
      ratio: data.ratio || 16.0,
      dryDoseGrams: data.dose || 15.0,
      waterAmountMl: data.water || 250,
      waterTempF: data.tempF || 202,
      waterTempC: Math.round(((data.tempF || 202) - 32) * 5 / 9),
      grindSetting: data.grind || 'Medium-Fine',
      totalTimeSec: data.time || 180,
      description: data.desc || 'Shared community brew recipe.',
      isCustom: true,
      steps: data.steps || []
    };
  } catch (e) {
    console.warn('Failed to decode share payload:', e);
    return null;
  }
}

