/**
 * AI Coffee Bag Label Scanner & Smart Recipe Generator
 * 
 * Performs client-side Optical Character Recognition (OCR) via Tesseract.js,
 * extracts authentic coffee bag parameters (roaster, origin, process, altitude, roast, varietal),
 * and generates scientific golden extraction recipes tailored to bean density and processing method.
 */

import { getSavedGrinderId, getGrinderSetting } from '../data/grinderProfiles.js';

// Common specialty coffee roasters dictionary for precise matching
const KNOWN_ROASTERS = [
  'Methodical Coffee',
  'Onyx Coffee Lab',
  'Black & White Coffee Roasters',
  'Sey Coffee',
  'Proud Mary Coffee',
  'Counter Culture Coffee',
  'Stumptown Coffee Roasters',
  'Heart Coffee Roasters',
  'Metric Coffee',
  'Devocion',
  'East Pole Coffee Co.',
  'Bellwood Coffee',
  'Spiller Park Coffee',
  'Chrome Yellow Trading Co.',
  'PERC Coffee',
  'Brash Coffee Roasters',
  'Sweet Bloom Coffee Roasters',
  'Verve Coffee Roasters',
  'Intelligentsia Coffee',
  'Blue Bottle Coffee',
  'Ritual Coffee Roasters',
  'Sightglass Coffee',
  'Saint Frank Coffee',
  'Passenger Coffee',
  'Coava Coffee Roasters',
  'Milstead & Co.',
  'Espresso Vivace',
  'Prufrock Coffee',
  'Glitch Coffee & Roasters',
  'Tim Wendelboe',
  'Coffee Collective',
  'La Cabra'
];

// Origin countries and their flagship regions
const ORIGIN_COUNTRIES = [
  { country: 'Ethiopia', regions: ['Yirgacheffe', 'Guji', 'Sidama', 'Kochere', 'Gedeb', 'Uraga', 'Limu', 'Bona', 'Worka', 'Hambela'] },
  { country: 'Colombia', regions: ['Huila', 'Nariño', 'Cauca', 'Tolima', 'Antioquia', 'Quindío', 'Santander', 'Cundinamarca', 'Valle del Cauca'] },
  { country: 'Kenya', regions: ['Nyeri', 'Kirinyaga', 'Kiambu', 'Embu', 'Murang\'a', 'Machakos'] },
  { country: 'Guatemala', regions: ['Antigua', 'Huehuetenango', 'Cobán', 'Fraijanes', 'Atitlán', 'Acatenango', 'San Marcos'] },
  { country: 'Costa Rica', regions: ['Tarrazú', 'West Valley', 'Central Valley', 'Brunca', 'Orosi', 'Tres Ríos'] },
  { country: 'Panama', regions: ['Boquete', 'Volcán', 'Renacimiento', 'Chiriquí'] },
  { country: 'Rwanda', regions: ['Nyamagabe', 'Huye', 'Gicumbi', 'Karongi', 'Rutsiro'] },
  { country: 'Burundi', regions: ['Kayanza', 'Ngozi', 'Muyinga', 'Gitega'] },
  { country: 'Indonesia', regions: ['Sumatra', 'Java', 'Bali', 'Flores', 'Sulawesi', 'Aceh', 'Gayo'] },
  { country: 'Brazil', regions: ['Sul de Minas', 'Cerrado Mineiro', 'Mogiana', 'Espírito Santo', 'Caparaó'] },
  { country: 'Honduras', regions: ['Marcala', 'Copán', 'Comayagua', 'Opalaca', 'El Paraíso'] },
  { country: 'Peru', regions: ['Cajamarca', 'Cusco', 'Junín', 'San Martín', 'Amazonas'] },
  { country: 'Mexico', regions: ['Chiapas', 'Oaxaca', 'Veracruz', 'Puebla'] },
  { country: 'El Salvador', regions: ['Santa Ana', 'Apaneca-Ilamatepec', 'Chalatenango', 'Alotepec-Metapán'] },
  { country: 'Ecuador', regions: ['Loja', 'Pichincha', 'Zamora-Chinchipe', 'Galápagos'] }
];

// Varietals dictionary
const KNOWN_VARIETALS = [
  'Pink Bourbon',
  'Geisha',
  'Gesha',
  'SL28',
  'SL34',
  'SL-28',
  'SL-34',
  'Bourbon',
  'Caturra',
  'Castillo',
  'Typica',
  'Pacamara',
  'Ethiopian Heirloom',
  'Heirloom',
  'Wush Wush',
  'Sidra',
  'Chiroso',
  'Maragogipe',
  'Pacas',
  'Catuai',
  'Java',
  'Sudan Rume',
  'Yellow Bourbon',
  'Red Bourbon',
  'Kenia',
  'Tabi',
  'Colombia'
];

// Recognized sensory descriptors
const FLAVOR_LEXICON = [
  'Jasmine', 'Bergamot', 'Peach', 'Apricot', 'Nectarine', 'Strawberry', 'Blueberry',
  'Raspberry', 'Blackcurrant', 'Mango', 'Passion Fruit', 'Papaya', 'Pineapple',
  'Lemon', 'Lime', 'Grapefruit', 'Tangerine', 'Orange', 'Mandarin', 'Earl Grey',
  'Black Tea', 'Honey', 'Cane Sugar', 'Panela', 'Brown Sugar', 'Caramel', 'Toffee',
  'Vanilla', 'Dark Chocolate', 'Milk Chocolate', 'Cacao Nibs', 'Hazelnut', 'Almond',
  'Floral', 'Stone Fruit', 'Tropical Fruit', 'Red Apple', 'Green Apple', 'Plum',
  'Fig', 'Cherry', 'Grape', 'Watermelon', 'Guava', 'Lychee', 'Lemongrass', 'Lavender'
];

/**
 * Pre-processes an HTML canvas image to maximize OCR text contrast:
 * Converts to high-contrast monochrome/grayscale and applies adaptive stretch.
 * @param {HTMLCanvasElement} canvas 
 * @returns {HTMLCanvasElement}
 */
export function preprocessCanvasForOcr(canvas) {
  const w = canvas.width;
  const h = canvas.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return canvas;

  try {
    const imgData = ctx.getImageData(0, 0, w, h);
    const d = imgData.data;

    for (let i = 0; i < d.length; i += 4) {
      // Perceptual luminance calculation
      const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      // High-contrast curve for label typography
      const enhanced = lum < 120 ? Math.max(0, lum * 0.6) : Math.min(255, lum * 1.3);
      d[i] = enhanced;
      d[i + 1] = enhanced;
      d[i + 2] = enhanced;
    }
    ctx.putImageData(imgData, 0, 0);
  } catch (e) {
    console.warn('Canvas pre-processing skipped:', e);
  }
  return canvas;
}

/**
 * Executes real on-device OCR using Tesseract.js with live progress tracking.
 * @param {HTMLCanvasElement|string} imageSource Canvas element or data URL
 * @param {Function} onProgress Callback receiving percentage 0-100
 * @returns {Promise<string>} Recognized plain text
 */
export async function performBagOcr(imageSource, onProgress = null) {
  try {
    const { createWorker } = await import('tesseract.js');
    const worker = await createWorker('eng', 1, {
      logger: (m) => {
        if (m && m.status === 'recognizing text' && onProgress) {
          const pct = Math.round((m.progress || 0) * 100);
          onProgress(pct);
        }
      }
    });

    const res = await worker.recognize(imageSource);
    await worker.terminate();

    return res?.data?.text || '';
  } catch (err) {
    console.error('Tesseract OCR execution error:', err);
    throw new Error(`On-device OCR failed: ${err.message || 'Unable to analyze image'}`);
  }
}

/**
 * Analyzes raw OCR text from a coffee bag label and extracts structured coffee attributes.
 * @param {string} rawText 
 * @returns {Object} Structured coffee metadata
 */
export function parseCoffeeBagLabel(rawText = '') {
  if (!rawText || typeof rawText !== 'string') {
    return {
      roaster: 'Specialty Roaster',
      beanName: 'Single-Origin Coffee',
      origin: 'Single-Origin',
      region: '',
      process: 'washed',
      processLabel: 'Washed / Wet Processed',
      elevation: 'Unspecified',
      elevationMeters: 1700,
      roastLevel: 'Light',
      varietal: '',
      tastingNotes: ['Artisan Roast', 'Balanced Profile'],
      rawText: ''
    };
  }

  const cleanText = rawText.replace(/\r\n/g, '\n').trim();
  const lowerText = cleanText.toLowerCase();

  // 1. Roaster Extraction
  let matchedRoaster = '';
  for (const r of KNOWN_ROASTERS) {
    if (lowerText.includes(r.toLowerCase())) {
      matchedRoaster = r;
      break;
    }
  }

  if (!matchedRoaster) {
    // Heuristic: Check for lines containing "Roasters", "Coffee Roasting", "Coffee Lab", etc.
    const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);
    const roasterLine = lines.find(l => 
      /coffee\s+(roasters|roasting|lab|co\.|company)/i.test(l) && l.length < 50
    );
    if (roasterLine) {
      matchedRoaster = roasterLine.replace(/[^a-zA-Z0-9\s&']/g, '').trim();
    } else {
      matchedRoaster = 'Specialty Roaster';
    }
  }

  // 2. Origin & Region Extraction
  let matchedCountry = '';
  let matchedRegion = '';

  for (const item of ORIGIN_COUNTRIES) {
    if (lowerText.includes(item.country.toLowerCase())) {
      matchedCountry = item.country;
      // Look for regions within this country
      for (const reg of item.regions) {
        if (lowerText.includes(reg.toLowerCase())) {
          matchedRegion = reg;
          break;
        }
      }
      break;
    }
  }

  // If country was not found directly, check if a prominent region name is present
  if (!matchedCountry) {
    for (const item of ORIGIN_COUNTRIES) {
      for (const reg of item.regions) {
        if (lowerText.includes(reg.toLowerCase())) {
          matchedCountry = item.country;
          matchedRegion = reg;
          break;
        }
      }
      if (matchedCountry) break;
    }
  }

  // 3. Process Extraction (Critical for brewing science)
  let processType = 'washed';
  let processLabel = 'Washed';

  if (
    lowerText.includes('anaerobic') ||
    lowerText.includes('carbonic') ||
    lowerText.includes('thermal shock') ||
    lowerText.includes('co-ferment') ||
    lowerText.includes('extended fermentation') ||
    lowerText.includes('yeast') ||
    lowerText.includes('koji')
  ) {
    processType = 'anaerobic';
    if (lowerText.includes('thermal shock')) {
      processLabel = 'Thermal Shock Anaerobic';
    } else if (lowerText.includes('carbonic')) {
      processLabel = 'Carbonic Maceration';
    } else if (lowerText.includes('co-ferment')) {
      processLabel = 'Fruit Co-Ferment';
    } else if (lowerText.includes('natural')) {
      processLabel = 'Anaerobic Natural';
    } else {
      processLabel = 'Anaerobic Fermentation';
    }
  } else if (
    lowerText.includes('honey') ||
    lowerText.includes('pulped natural')
  ) {
    processType = 'honey';
    if (lowerText.includes('black honey')) processLabel = 'Black Honey';
    else if (lowerText.includes('yellow honey')) processLabel = 'Yellow Honey';
    else if (lowerText.includes('red honey')) processLabel = 'Red Honey';
    else processLabel = 'Honey Processed';
  } else if (
    lowerText.includes('natural') ||
    lowerText.includes('dry process') ||
    lowerText.includes('sun dried')
  ) {
    processType = 'natural';
    processLabel = 'Natural / Dry Processed';
  } else if (
    lowerText.includes('washed') ||
    lowerText.includes('wet process')
  ) {
    processType = 'washed';
    processLabel = lowerText.includes('fully washed') ? 'Fully Washed' : 'Washed';
  }

  // 4. Altitude / Elevation Extraction
  let elevationStr = '1,800m';
  let elevationMeters = 1800;

  const altitudeRegex = /(\d{1,2}[,.]?\d{3})\s*(?:-\s*(\d{1,2}[,.]?\d{3}))?\s*(?:m\b|masl|m\.a\.s\.l|meters)/i;
  const altMatch = cleanText.match(altitudeRegex);

  if (altMatch) {
    elevationStr = altMatch[0].trim();
    const cleanNum = parseInt(altMatch[1].replace(/[,.]/g, ''), 10);
    if (!isNaN(cleanNum) && cleanNum > 500 && cleanNum < 3500) {
      elevationMeters = cleanNum;
    }
  } else {
    // Check feet pattern (e.g. 5,800 ft)
    const feetRegex = /(\d{1,2}[,.]?\d{3})\s*(?:ft|feet)/i;
    const feetMatch = cleanText.match(feetRegex);
    if (feetMatch) {
      elevationStr = feetMatch[0].trim();
      const feetNum = parseInt(feetMatch[1].replace(/[,.]/g, ''), 10);
      if (!isNaN(feetNum)) {
        elevationMeters = Math.round(feetNum * 0.3048);
      }
    }
  }

  // 5. Varietal Extraction
  let matchedVarietal = '';
  for (const v of KNOWN_VARIETALS) {
    if (lowerText.includes(v.toLowerCase())) {
      matchedVarietal = v;
      break;
    }
  }

  // 6. Roast Level Extraction
  let roastLevel = 'Light';
  if (lowerText.includes('dark roast') || lowerText.includes('french roast')) {
    roastLevel = 'Dark';
  } else if (lowerText.includes('medium-dark') || lowerText.includes('medium dark')) {
    roastLevel = 'Medium-Dark';
  } else if (lowerText.includes('medium roast') || lowerText.includes('medium')) {
    roastLevel = 'Medium';
  } else if (lowerText.includes('nordic') || lowerText.includes('cinnamon') || lowerText.includes('ultra light')) {
    roastLevel = 'Nordic Light';
  } else if (lowerText.includes('medium-light') || lowerText.includes('light-medium')) {
    roastLevel = 'Medium-Light';
  }

  // 7. Tasting Notes Extraction
  const detectedNotes = [];
  for (const note of FLAVOR_LEXICON) {
    const noteLower = note.toLowerCase();
    const regex = new RegExp(`\\b${noteLower}\\b`, 'i');
    if (regex.test(lowerText) && !detectedNotes.includes(note)) {
      detectedNotes.push(note);
      if (detectedNotes.length >= 4) break;
    }
  }

  const finalNotes = detectedNotes.length > 0 
    ? detectedNotes 
    : [processLabel, matchedCountry || 'Single-Origin'];

  // Bean Name Derivation
  let beanName = '';
  if (matchedRegion && matchedCountry) {
    beanName = `${matchedCountry} ${matchedRegion}`;
  } else if (matchedCountry) {
    beanName = `${matchedCountry} ${matchedVarietal || 'Lot'}`;
  } else {
    beanName = matchedVarietal ? `${matchedVarietal} Lot` : 'Specialty Micro-Lot';
  }

  return {
    roaster: matchedRoaster,
    beanName,
    origin: matchedCountry || 'Specialty Single-Origin',
    region: matchedRegion,
    process: processType,
    processLabel,
    elevation: elevationStr,
    elevationMeters,
    roastLevel,
    varietal: matchedVarietal,
    tastingNotes: finalNotes,
    rawText: cleanText
  };
}

/**
 * Generates an extraction recipe strictly grounded in coffee physics and bean density:
 * 
 * - Dense Washed High-Altitude (>1800m): High temp (208°F–210°F), open ratio (1:16.5) to dissolve sweet core.
 * - Funky Anaerobic / Thermal Shock: Lower temp (198°F–200°F), tighter ratio (1:15.5) to avoid harsh fermented funk.
 * - Standard Natural: Balanced temp (202°F–204°F), 1:15.8.
 * - Dark Roast: Cooler temp (195°F), 1:15.0 to suppress bitter pyrolytic ash.
 * 
 * @param {Object} metadata Output from parseCoffeeBagLabel
 * @param {string} grinderId Active user grinder model ID
 * @returns {Object} Target brew recipe
 */
export function generateTargetBrewRecipe(metadata, grinderId = 'generic_stepped') {
  const { process, elevationMeters, roastLevel, origin, processLabel } = metadata;

  let ratio = 16.0;
  let tempF = 204;
  let grindCategory = 'medium_fine';
  let extractionPhilosophy = '';
  let pourAgitation = 'Moderate';

  const isHighAltitude = (elevationMeters && elevationMeters >= 1800) || origin === 'Ethiopia' || origin === 'Kenya';

  if (process === 'anaerobic') {
    // Anaerobic Natural / Thermal Shock / Experimental Fermentation
    ratio = 15.5;
    tempF = 198;
    grindCategory = 'medium'; // Slightly coarser because fermentation produces brittle beans & fines
    pourAgitation = 'Gentle / Low Agitation';
    extractionPhilosophy = `Funky ${processLabel} lots are rich in delicate tropical fruit esters and volatile organic acids. A cooler water temperature (198°F / 92°C) and tighter 1:15.5 ratio preserve sparkling aromatics without extracting harsh boozy bitterness or drying astringency.`;
  } else if (process === 'washed' && isHighAltitude) {
    // Dense High-Altitude Washed (Ethiopia, Kenya, High Colombia/Guatemala)
    ratio = 16.5;
    tempF = 208;
    grindCategory = 'medium_fine';
    pourAgitation = 'High Agitation Concentric';
    extractionPhilosophy = `Dense, high-elevation washed beans require near-boiling water (208°F / 98°C) to penetrate rigid cellular structures. An elongated 1:16.5 ratio unlocks floral jasmine, sparkling citric acidity, and crystalline cup clarity.`;
  } else if (process === 'natural') {
    // Standard Natural Process
    ratio = 15.8;
    tempF = 202;
    grindCategory = 'medium';
    pourAgitation = 'Steady Center Pour';
    extractionPhilosophy = `Natural sundried coffees carry sweet fruit mucilage that contributes heavier body. 202°F (94°C) water balances jammy berry sweetness while a medium grind prevents chaff and fines from stalling the drawdown flow.`;
  } else if (process === 'honey') {
    // Honey Process
    ratio = 16.0;
    tempF = 204;
    grindCategory = 'medium_fine';
    pourAgitation = 'Gentle Spirals';
    extractionPhilosophy = `Honey coffees balance stone fruit acidity with rich caramel sweetness. 204°F (95°C) water at 1:16.0 delivers optimal balance between crisp malic acidity and silky honey-like body.`;
  } else if (roastLevel === 'Dark' || roastLevel === 'Medium-Dark') {
    // Darker Roasts
    ratio = 15.0;
    tempF = 195;
    grindCategory = 'medium_coarse';
    pourAgitation = 'Gentle Center Pour';
    extractionPhilosophy = `Darker roasts feature fragile, porous bean structures. A gentle 195°F (90°C) temperature and coarser grind prevent over-extracting harsh pyrolytic bitterness and smokiness.`;
  } else {
    // Standard Specialty Light/Medium Washed
    ratio = 16.0;
    tempF = 205;
    grindCategory = 'medium_fine';
    pourAgitation = 'Concentric Spirals';
    extractionPhilosophy = `Clean washed specialty profile: 205°F water at a golden 1:16.0 ratio provides balanced extraction of sweet complex sugars and refreshing acidity.`;
  }

  const doseGrams = 18.0;
  const waterGrams = Math.round(doseGrams * ratio);
  const tempC = Math.round(((tempF - 32) * 5) / 9);

  // Translate to physical dial setting on user's active grinder
  const activeGrinderId = grinderId || getSavedGrinderId();
  const grinderSettingObj = getGrinderSetting(activeGrinderId, grindCategory);

  return {
    ...metadata,
    id: metadata.id || `ocr_${(metadata.origin || 'origin').toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`,
    provenanceTier: 'ai_vision',
    recommendedRatio: ratio,
    dryDoseGrams: doseGrams,
    waterGrams: waterGrams,
    tempF,
    tempC,
    grindCategory,
    recommendedGrind: `${grinderSettingObj.setting} (${grinderSettingObj.grinderName})`,
    grinderModel: grinderSettingObj.grinderName,
    grinderSetting: grinderSettingObj.setting,
    pourAgitation,
    extractionPhilosophy,
    brewMethod: 'pour_over',
    isAiExtracted: true,
    extraction: {
      method: 'pour_over',
      ratio,
      tempF,
      tempC,
      grind: `${grinderSettingObj.setting} (${grinderSettingObj.grinderName})`
    }
  };
}
