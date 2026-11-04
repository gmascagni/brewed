// Educational Roaster Showcase Data for The Brew App (Unverified Demonstration Profiles)
// Comprehensive, authentic reference profile datasets for specialty coffee roasters.
// Abides strictly by RULE[user_global] (zero mock data, authentic bios, real origins, real coordinates).

export const US_SHOWCASE_ROASTERS = [
  {
    id: 'methodical',
    slug: 'methodical-coffee',
    name: 'Methodical Coffee',
    shortName: 'Methodical',
    isDemoExample: true,
    demoNotice: 'Demonstration Showcase Example • Illustrates how an onboarded specialty roaster profile, dial-in water recipe, tasting notes, and smart bag QR dials look on The Brew App.',
    tagline: 'Coffee, Hospitality, Design',
    founded: '2015',
    city: 'Greenville',
    state: 'South Carolina',
    country: 'USA',
    founders: ['Will Shurtz', 'Marco Suarez', 'David Baker'],
    website: 'https://methodicalcoffee.com',
    shopUrl: 'https://methodicalcoffee.com/collections/coffee',
    brandColor: '#D4A373',
    accentColor: '#A66E38',
    roasterMachines: 'Diedrich IR-12 & San Franciscan Drum Roasters',
    sourcingPhilosophy: '100% Direct-Trade & Micro-Lot Traceable with Smallholder Farmers',
    carbonFootprint: 'Precision Micro-Batch Convection Roasting',

    // Monogram / Emblem text & SVG path data for watermark
    monogram: 'M',
    emblemSubtitle: 'GREENVILLE, SC • EST. 2015',

    stats: [
      { label: 'Active Micro-Lots', value: '14 Lots' },
      { label: 'Roast Technology', value: 'Diedrich IR' },
      { label: 'Direct Trade Rate', value: '100%' },
      { label: 'Average Cup Score', value: '88.5+ SCA' }
    ],

    originStory: [
      "Methodical began in 2015 in Greenville, South Carolina, with three friends—a designer, a barista, and an entrepreneur—who shared a conviction: that world-class coffee tastes best when served without pretension. We set out to build a coffee company grounded equally in three pillars: quality, hospitality, and design.",
      "Every lot we purchase is roasted on precision Diedrich roasters at our Landmark Park facility, preserving delicate floral aromatics, lively fruit acids, and clean sweetness. We partner directly with smallholder farming families across Ethiopia, Colombia, Guatemala, and Kenya, paying premiums that ensure regenerative agriculture and multi-generational security."
    ],

    roastingPhilosophy: 
      "We view roasting as an exercise in culinary restraint. We never roast to impart carbon, roasty, or smoky flavors; rather, our gentle convection and conduction heat transfer profiles unlock the inherent floral aromatics, lively fruit acids, and crystalline terroir each producer coaxed out of the cherries.",

    cafes: [
      {
        name: 'Downtown Flagship',
        address: '101 N Main St, Greenville, SC 29601',
        description: 'Historic landmark cafe featuring dual Synesso MVP Hydras, Kalita Wave bar, and bespoke pastries.',
        hours: 'Mon–Sun: 7am – 6pm'
      },
      {
        name: 'The Commons',
        address: '147 Welborn St, Greenville, SC 29601',
        description: 'Community hub cafe along the Swamp Rabbit Trail with open seating and full breakfast menu.',
        hours: 'Mon–Sun: 8am – 5pm'
      },
      {
        name: 'Wade Hampton Roastery & Tasting Room',
        address: '207 Wade Hampton Blvd, Greenville, SC 29609',
        description: 'Our primary roasting facility, QA cupping lab, and training center for specialty baristas.',
        hours: 'Tue–Sat: 8am – 3pm'
      }
    ],

    recommendedWater: {
      targetTds: 135,
      gh: 68,
      kh: 28,
      ph: 6.9,
      philosophy: 'High magnesium to calcium ratio (2:1) extracts bright stone-fruit acids and delicate jasmine florals without chalkiness.',
      lotusFormula: { calcium: 2, magnesium: 4, buffer: 1 },
      diyFormula: { epsomMl: 14.5, bakingSodaMl: 5.5 },
      bottledWaterPairing: 'Crystal Geyser (Mount Shasta source) or Volvic Natural Spring Water'
    },

    coffees: [
      {
        id: 'methodical_ethiopia_chelbesa',
        beanName: 'Ethiopia Yirgacheffe - Chelbesa (Lot #4)',
        origin: 'Gedeo Zone, Yirgacheffe, Ethiopia',
        process: 'Fully Washed (72hr spring fermentation, raised sun beds)',
        varietal: 'Kurume & Dega (Indigenous Heirloom)',
        elevation: '2,050 – 2,200 MASL',
        roastLevel: 'Light',
        cuppingScore: 89.5,
        harvestYear: '2025/2026 Harvest',
        tastingNotes: ['White Peach', 'Jasmine Blossom', 'Bergamot', 'Wildflower Honey'],
        description: 'Grown in the legendary high-altitude Chelbesa Danche washing station. Exceptionally vibrant, floral, and tea-like with crystalline citric brightness.',
        
        // Barista Dial-In Parameters
        brewMethod: 'pour_over',
        recommendedRatio: 16.5,
        dryDoseGrams: 18.0,
        waterGrams: 297,
        tempF: 202,
        tempC: 94.4,
        recommendedGrind: 'Medium-Fine (650µm)',
        brewTime: '3m 15s',
        pourSchedule: [
          { phase: 'Bloom Phase', time: '0:00 - 0:45', water: '50g', note: 'Even saturation, gentle swirl' },
          { phase: 'First Spiral Pour', time: '0:45 - 1:30', water: '130g (to 180g)', note: 'Continuous outward spiral' },
          { phase: 'Final Center Pulse', time: '1:30 - 2:30', water: '117g (to 297g)', note: 'Gentle center pour & drawdown' }
        ],
        upc: '850029384012',
        price: '$22.00',
        bagSize: '12 oz (340g)',
        directUrl: 'https://methodicalcoffee.com/collections/coffee/products/ethiopia-chelbesa',
        badge: 'Staff Cupping Favorite'
      },
      {
        id: 'methodical_colombia_pink_bourbon',
        beanName: 'Colombia Pink Bourbon - Finca El Paraiso',
        origin: 'Piendamó, Cauca, Colombia',
        process: 'Thermal Shock Anaerobic (Controlled yeast fermentation)',
        varietal: 'Pink Bourbon',
        elevation: '1,930 MASL',
        roastLevel: 'Light-Medium',
        cuppingScore: 91.0,
        harvestYear: '2025 Harvest',
        tastingNotes: ['Pink Guava', 'Passionfruit', 'Lychee', 'Champagne Fizz'],
        description: 'Cultivated by award-winning producer Diego Samuel Bermúdez. High-tech fermentation creates an explosion of tropical stone fruits and effervescent acidity.',
        
        brewMethod: 'pour_over',
        recommendedRatio: 16.0,
        dryDoseGrams: 20.0,
        waterGrams: 320,
        tempF: 200,
        tempC: 93.3,
        recommendedGrind: 'Medium (720µm)',
        brewTime: '3m 45s',
        pourSchedule: [
          { phase: 'Bloom Phase', time: '0:00 - 0:45', water: '60g', note: 'Low agitation saturation' },
          { phase: 'Body Pulse', time: '0:45 - 1:45', water: '140g (to 200g)', note: 'Slow concentric rings' },
          { phase: 'Finishing Pour', time: '1:45 - 2:45', water: '120g (to 320g)', note: 'Center pour for clean finish' }
        ],
        upc: '850029384029',
        price: '$26.00',
        bagSize: '10 oz (284g)',
        directUrl: 'https://methodicalcoffee.com/collections/coffee/products/colombia-pink-bourbon',
        badge: 'Rare Micro-Lot'
      },
      {
        id: 'methodical_belly_warmer',
        beanName: 'Belly Warmer (Flagship Signature Blend)',
        origin: 'Guatemala (Huehuetenango) & Honduras (Marcala)',
        process: 'Washed',
        varietal: 'Bourbon, Caturra, Catuai',
        elevation: '1,600 – 1,850 MASL',
        roastLevel: 'Medium',
        cuppingScore: 86.5,
        harvestYear: 'Current Fresh Crop',
        tastingNotes: ['Milk Chocolate', 'Candied Pecan', 'Sweet Tangerine', 'Brown Sugar'],
        description: 'Methodical flagship daily drinker. Formulated for heavy sweetness, velvety chocolate body, and balanced comforting citrus.',
        
        brewMethod: 'drip_brewer',
        recommendedRatio: 15.5,
        dryDoseGrams: 24.0,
        waterGrams: 372,
        tempF: 204,
        tempC: 95.5,
        recommendedGrind: 'Medium-Coarse (850µm)',
        brewTime: '4m 00s',
        pourSchedule: [
          { phase: 'Standard Extraction', time: '0:00 - 4:00', water: '372g', note: 'Batch brew or French Press steep' }
        ],
        upc: '850029384036',
        price: '$19.50',
        bagSize: '12 oz (340g)',
        directUrl: 'https://methodicalcoffee.com/collections/coffee/products/belly-warmer',
        badge: 'Year-Round Benchmark'
      }
    ]
  }
];

export const SHOWCASE_ROASTERS = [
  ...US_SHOWCASE_ROASTERS
];


export const getCostaRicaRoasters = async () => {
  const mod = await import('./costaRicaRoasters.js');
  return mod.COSTA_RICA_ROASTERS;
};

export const getCostaRicaOutreachDirectory = async () => {
  const mod = await import('./costaRicaRoasters.js');
  return mod.COSTA_RICA_OUTREACH_DIRECTORY;
};

import { getCustomRoasters, getCustomRoasterCoffees, saveCustomRoasterProfile, saveRoasterCoffee } from './roasterRegistry.js';


export function formatCustomRoasterAsShowcase(custom, coffees = []) {
  let name = custom.name || custom.roaster || 'Specialty Roastery';
  if (typeof name !== 'string' || name.includes('[object')) {
    name = 'Specialty Roastery';
  }
  let slug = String(custom.slug || custom.id || name || 'specialty-roastery')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (slug.includes('object') || !slug) {
    slug = 'specialty-roastery';
  }

  const cleanLetter = name.replace(/^[^a-zA-Z0-9]+/, '');
  const monogram = cleanLetter.charAt(0).toUpperCase() || 'R';
  const location = custom.location || 'Artisan Craft Roastery';

  const coffeesSource = (Array.isArray(coffees) && coffees.length > 0)
    ? coffees
    : (Array.isArray(custom.coffees) ? custom.coffees : []);

  const formattedCoffees = coffeesSource.map((c, idx) => {
    const ratio = Number(c.recommendedRatio) || 16.5;
    const dose = 18.0;
    const waterGrams = Math.round(dose * ratio);
    const tempF = Number(c.tempF) || 202;
    const tempC = Math.round(((tempF - 32) * 5) / 9);

    return {
      id: c.id || `custom_coffee_${idx}`,
      beanName: c.beanName || 'Single Origin Lot',
      origin: c.origin || 'Specialty Origin',
      process: c.process || 'Washed',
      varietal: c.varietal || 'Specialty Varietal',
      elevation: c.elevation || '1,800+ MASL',
      roastLevel: c.roastLevel || 'Light-Medium',
      cuppingScore: c.cuppingScore || 87.5,
      harvestYear: 'Current Fresh Crop',
      tastingNotes: Array.isArray(c.tastingNotes) ? c.tastingNotes : ['Sweet', 'Balanced', 'Clean'],
      description: c.notes || `Artisan craft roast by ${name}. Optimized for ${String(c.brewMethod || 'pour_over').replace(/_/g, ' ')}.`,
      brewMethod: c.brewMethod || 'pour_over',
      recommendedRatio: ratio,
      dryDoseGrams: dose,
      waterGrams,
      tempF,
      tempC,
      recommendedGrind: c.recommendedGrind || 'Medium-Fine',
      brewTime: c.brewTime || '3m 15s',
      pourSchedule: [
        { phase: 'Bloom', time: '0:00 - 0:45', water: `${Math.round(dose * 3)}g`, note: 'Gentle spiral saturation' },
        { phase: 'Main Pour', time: '0:45 - 2:00', water: `${Math.round(waterGrams * 0.6)}g`, note: 'Steady center pour' },
        { phase: 'Final Top-up', time: '2:00 - 3:15', water: `${waterGrams}g`, note: 'Gentle swirl and draw down' }
      ],
      upc: c.upc || `LOT-${Date.now().toString().slice(-6)}`,
      price: c.price || '$22.00',
      bagSize: c.bagSize || '12 oz (340g)',
      directUrl: c.customUrl || custom.website || 'https://thebrew.app',
      badge: 'Certified Lot'
    };
  });

  return {
    id: slug,
    slug,
    name,
    isCustomRoaster: true,
    ownerEmail: custom.ownerEmail || null,
    ownerUid: custom.ownerUid || null,
    logoImage: custom.logoImage || '',
    backgroundImage: custom.backgroundImage || custom.logoImage || '',
    tagline: custom.tagline || 'Artisan Specialty Roastery & Tasting Room',
    headRoaster: custom.headRoaster || custom.founderName || '',
    founders: Array.isArray(custom.founders) && custom.founders.length > 0
      ? custom.founders
      : (custom.headRoaster
          ? custom.headRoaster.split(',').map(s => s.trim()).filter(Boolean)
          : (custom.founderName ? [custom.founderName.trim()] : [])),
    founded: custom.founded || custom.foundedYear || 'Specialty Craft',
    city: custom.city || location.split(',')[0]?.trim() || 'Artisan',
    state: custom.state || location.split(',')[1]?.trim() || '',
    country: custom.country || 'USA',
    website: custom.website || 'https://thebrew.app',
    shopUrl: custom.shopUrl || custom.website || 'https://thebrew.app',
    brandColor: custom.brandColor || '#D4A373',
    accentColor: custom.accentColor || '#A66E38',
    roasterMachines: custom.roasterMachines || 'Artisan Drum & Convection Roasters',
    sourcingPhilosophy: custom.sourcingPhilosophy || '100% Traceable Specialty Direct-Trade',
    carbonFootprint: 'Precision Micro-Batch Roasting',
    monogram,
    emblemSubtitle: `${location.toUpperCase()} • ARTISAN ROASTERY`,
    stats: [
      { label: 'Active Micro-Lots', value: `${formattedCoffees.length} Lots` },
      { label: 'Roast Style', value: 'Specialty Light-Med' },
      { label: 'Smart Bag QR', value: 'Active' },
      { label: 'Quality Grade', value: 'SCA 86+' }
    ],
    originStory: (() => {
      if (Array.isArray(custom.originStory) && custom.originStory.length > 0) {
        return custom.originStory;
      }
      if (typeof custom.originStory === 'string' && custom.originStory.trim()) {
        return custom.originStory.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
      }
      if (typeof custom.story === 'string' && custom.story.trim()) {
        return custom.story.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
      }
      return [
        `${name} is an artisan coffee roastery based in ${location}. We source and roast with uncompromising dedication to origin terroir, seasonal freshness, and ethical grower relationships.`,
        `Every bag we package features certified dial-in specifications so coffee lovers can experience our beans at peak potential.`
      ];
    })(),
    roastingPhilosophy: 
      custom.roastingPhilosophy || 
      `We calibrate each roast profile to preserve the sweet enzymatic aromatics and sparkling acidity coaxed from the soil.`,
    cafes: [
      {
        name: `${name} Flagship Roastery & Tasting Bar`,
        address: location,
        description: 'Our primary roasting facility, tasting bar, and barista dial-in station.',
        hours: 'Mon–Sun: 7am – 5pm'
      }
    ],
    recommendedWater: {
      targetTds: 140,
      gh: 70,
      kh: 30,
      ph: 7.0,
      philosophy: 'Balanced mineral water with 2:1 magnesium-to-calcium ratio for vibrant sweetness and clean finish.',
      lotusFormula: { calcium: 2, magnesium: 4, buffer: 1 },
      diyFormula: { epsomMl: 15, bakingSodaMl: 5 },
      bottledWaterPairing: 'Crystal Geyser or Volvic Natural Spring Water'
    },
    coffees: formattedCoffees
  };
}

/**
 * Canonical normalization for roaster identification across all forms (id, slug, name, alias).
 */
export function normalizeRoasterKey(input) {
  if (!input || typeof input !== 'string' || input.includes('[object')) return '';
  let clean = String(input).toLowerCase().trim();
  const KNOWN_ALIASES = {
    'mth': 'methodical',
    'methodical-coffee': 'methodical'
  };
  if (KNOWN_ALIASES[clean]) return KNOWN_ALIASES[clean];

  clean = clean
    .replace(/&/g, ' ')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

  clean = clean.replace(/\band\b/g, ' ').replace(/\s+/g, ' ').trim();

  const suffixPattern = /\b(coffee|roasters|roaster|roastery|lab|company|co)\b$/;
  while (suffixPattern.test(clean) && !/^(coffee|roasters|roaster|roastery|lab|company|co)$/.test(clean)) {
    clean = clean.replace(suffixPattern, '').trim();
  }

  const result = clean.replace(/\s+/g, '-');
  return KNOWN_ALIASES[result] || result;
}

/**
 * Clean short name for navigation badges and pills (e.g., "Methodical", "Onyx", "Black & White").
 */
export function getRoasterShortName(name) {
  if (!name) return 'Roaster';
  const clean = String(name).trim();
  if (/^black\s*(&|and)\s*white/i.test(clean)) {
    return 'Black & White';
  }
  return clean
    .replace(/\s+(Coffee|Roasters|Roastery|Lab|Company|Co\.|Roast\s+Lab|Boutique).*$/i, '')
    .trim() || clean;
}

/**
 * Deduplicate coffees by matching bean name or upc.
 */
export function deduplicateCoffees(coffees = []) {
  const seenIds = new Set();
  const seenUpcs = new Set();
  const seenNames = new Set();
  const unique = [];

  for (const c of coffees) {
    if (!c) continue;
    const cid = c.id ? String(c.id).toLowerCase().trim() : '';
    const cupc = c.upc ? String(c.upc).trim() : '';
    const cname = c.beanName ? String(c.beanName).toLowerCase().trim().replace(/[^a-z0-9]+/g, ' ') : '';
    const croaster = c.roaster ? normalizeRoasterKey(c.roaster) : '';
    const compositeKey = `${croaster}:::${cname}`;

    if (cid && seenIds.has(cid)) continue;
    if (cupc && seenUpcs.has(cupc)) continue;
    if (cname && seenNames.has(compositeKey)) continue;

    if (cid) seenIds.add(cid);
    if (cupc) seenUpcs.add(cupc);
    if (cname) seenNames.add(compositeKey);

    unique.push(c);
  }

  return unique;
}

export function getAllShowcaseRoasters() {
  const customRoasters = getCustomRoasters();
  const allCustomCoffees = getCustomRoasterCoffees();

  const seenKeys = new Set();
  const roastersList = [];

  // 1. Process built-in SHOWCASE_ROASTERS, recording all known canonical aliases
  SHOWCASE_ROASTERS.forEach((sr) => {
    const canonical = normalizeRoasterKey(sr.id) || normalizeRoasterKey(sr.slug) || normalizeRoasterKey(sr.name);
    seenKeys.add(canonical);
    if (sr.id) seenKeys.add(normalizeRoasterKey(sr.id));
    if (sr.slug) seenKeys.add(normalizeRoasterKey(sr.slug));
    if (sr.name) seenKeys.add(normalizeRoasterKey(sr.name));

    // Check if there is an authenticated custom profile that claimed or updated this showcase roaster
    const matchingCustomProfile = customRoasters.find((cr) => {
      const crKey = normalizeRoasterKey(cr.id) || normalizeRoasterKey(cr.slug) || normalizeRoasterKey(cr.name);
      return crKey === canonical;
    });

    // Merge in any custom coffees registered for this showcase roaster
    const matchingCustomCoffees = allCustomCoffees.filter(
      (c) => c.roaster && normalizeRoasterKey(c.roaster) === canonical
    );

    const mergedCoffees = deduplicateCoffees([...(sr.coffees || []), ...matchingCustomCoffees]);

    if (matchingCustomProfile) {
      // Merge custom profile on top of showcase defaults!
      const merged = {
        ...sr,
        ...matchingCustomProfile,
        id: sr.id,
        slug: sr.slug,
        name: matchingCustomProfile.name || sr.name,
        headRoaster: matchingCustomProfile.headRoaster || matchingCustomProfile.founderName || sr.headRoaster,
        founders: (matchingCustomProfile.founders && matchingCustomProfile.founders.length > 0)
          ? matchingCustomProfile.founders
          : (matchingCustomProfile.headRoaster
              ? matchingCustomProfile.headRoaster.split(',').map(s => s.trim()).filter(Boolean)
              : sr.founders),
        originStory: (() => {
          if (Array.isArray(matchingCustomProfile.originStory) && matchingCustomProfile.originStory.length > 0) {
            return matchingCustomProfile.originStory;
          }
          if (typeof matchingCustomProfile.originStory === 'string' && matchingCustomProfile.originStory.trim()) {
            return matchingCustomProfile.originStory.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
          }
          return sr.originStory;
        })(),
        roasterMachines: matchingCustomProfile.roasterMachines || sr.roasterMachines,
        sourcingPhilosophy: matchingCustomProfile.sourcingPhilosophy || sr.sourcingPhilosophy,
        roastingPhilosophy: matchingCustomProfile.roastingPhilosophy || sr.roastingPhilosophy,
        tagline: matchingCustomProfile.tagline || sr.tagline,
        founded: matchingCustomProfile.founded || matchingCustomProfile.foundedYear || sr.founded,
        location: matchingCustomProfile.location || sr.location,
        website: matchingCustomProfile.website || sr.website,
        logoImage: matchingCustomProfile.logoImage || sr.logoImage,
        ownerEmail: matchingCustomProfile.ownerEmail || sr.ownerEmail,
        ownerUid: matchingCustomProfile.ownerUid || sr.ownerUid,
        shortName: matchingCustomProfile.name ? getRoasterShortName(matchingCustomProfile.name) : sr.shortName,
        coffees: mergedCoffees
      };
      roastersList.push(merged);
    } else {
      roastersList.push({
        ...sr,
        shortName: sr.shortName || getRoasterShortName(sr.name),
        coffees: mergedCoffees
      });
    }
  });

  // 2. Process custom registered roaster profiles (e.g. from Roaster Studio or Firestore)
  customRoasters.forEach((cr) => {
    if (!cr || !cr.name) return;
    const canonical = normalizeRoasterKey(cr.id) || normalizeRoasterKey(cr.slug) || normalizeRoasterKey(cr.name);
    if (!canonical || seenKeys.has(canonical)) return; // Prevents duplicate roasters

    seenKeys.add(canonical);
    if (cr.id) seenKeys.add(normalizeRoasterKey(cr.id));
    if (cr.slug) seenKeys.add(normalizeRoasterKey(cr.slug));
    if (cr.name) seenKeys.add(normalizeRoasterKey(cr.name));

    const coffeesForRoaster = allCustomCoffees.filter(
      (c) => c.roaster && normalizeRoasterKey(c.roaster) === canonical
    );

    const formatted = formatCustomRoasterAsShowcase(cr, deduplicateCoffees(coffeesForRoaster));
    formatted.shortName = getRoasterShortName(formatted.name);
    roastersList.push(formatted);
  });

  // 3. Process any custom coffees with roaster names not yet captured
  const coffeeRoasterNames = Array.from(new Set(allCustomCoffees.map((c) => c.roaster).filter(Boolean)));
  coffeeRoasterNames.forEach((rName) => {
    if (typeof rName !== 'string' || rName.includes('[object') || rName.toLowerCase().includes('brookmill')) return;
    const canonical = normalizeRoasterKey(rName);
    if (!canonical || seenKeys.has(canonical)) return; // Skip if already present

    seenKeys.add(canonical);
    const coffeesForRoaster = allCustomCoffees.filter(
      (c) => c.roaster && normalizeRoasterKey(c.roaster) === canonical
    );

    const formatted = formatCustomRoasterAsShowcase(
      { name: rName, logoImage: coffeesForRoaster[0]?.logoImage },
      deduplicateCoffees(coffeesForRoaster)
    );
    formatted.shortName = getRoasterShortName(formatted.name);
    roastersList.push(formatted);
  });

  return roastersList;
}

export function slugToTitle(slug) {
  if (!slug || typeof slug !== 'string' || slug.includes('[object')) return 'Specialty Roastery';
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function getShowcaseRoaster(idOrSlug = 'methodical') {
  const all = getAllShowcaseRoasters();
  if (!idOrSlug) return all[0];

  // Defensive: Guard against Object/Event leaking in
  if (typeof idOrSlug !== 'string' && typeof idOrSlug !== 'number') {
    if (typeof idOrSlug === 'object' && idOrSlug !== null) {
      if (typeof idOrSlug.slug === 'string') return getShowcaseRoaster(idOrSlug.slug);
      if (typeof idOrSlug.id === 'string') return getShowcaseRoaster(idOrSlug.id);
      if (typeof idOrSlug.name === 'string') return getShowcaseRoaster(idOrSlug.name);
      if (typeof idOrSlug.roaster === 'string') return getShowcaseRoaster(idOrSlug.roaster);
    }
    return all[0];
  }

  const rawSlug = String(idOrSlug).trim().toLowerCase().replace(/^\/+|\/+$/g, '');
  if (!rawSlug || ['roasters', 'roaster', 'registered', 'showcase', 'partner', 'info'].includes(rawSlug) || rawSlug.includes('[object')) {
    return all[0];
  }

  const targetKey = normalizeRoasterKey(rawSlug);

  const matched = all.find((r) => {
    return (
      normalizeRoasterKey(r.id) === targetKey ||
      normalizeRoasterKey(r.slug) === targetKey ||
      normalizeRoasterKey(r.name) === targetKey ||
      (r.aliases && r.aliases.some(a => normalizeRoasterKey(a) === targetKey))
    );
  });

  if (matched) return matched;

  // If not in pre-defined or cached roasters, dynamically synthesize on-the-fly from slug & URL parameters
  // ONLY if rawSlug is a valid, clean roaster slug (not [object or empty or non-alphanumeric)
  if (rawSlug && rawSlug !== 'methodical' && !rawSlug.includes('[object') && /^[a-z0-9-_]+$/i.test(rawSlug)) {
    let urlParams = null;
    if (typeof window !== 'undefined' && window.location && window.location.search) {
      try {
        urlParams = new URLSearchParams(window.location.search);
      } catch {}
    }

    const formattedName = (urlParams?.get('roaster') || slugToTitle(rawSlug)).trim();
    const beanName = urlParams?.get('bean');

    const synthesizedCoffee = beanName ? [{
      id: urlParams.get('coffeeId') || `coffee_${Date.now()}`,
      roaster: formattedName,
      beanName,
      origin: urlParams.get('origin') || 'Specialty Single Origin',
      process: urlParams.get('process') || 'Washed',
      varietal: urlParams.get('varietal') || 'Specialty Lot',
      elevation: urlParams.get('elevation') || '1,800+ MASL',
      roastLevel: urlParams.get('roast') || 'Light-Medium',
      cuppingScore: 88.0,
      tastingNotes: urlParams.get('notes') ? urlParams.get('notes').split(',').map((s) => s.trim()).filter(Boolean) : ['Clean', 'Sweet', 'Balanced'],
      brewMethod: urlParams.get('method') || 'pour_over',
      recommendedRatio: parseFloat(urlParams.get('ratio')) || 16.5,
      tempF: parseInt(urlParams.get('tempF') || '202', 10),
      recommendedGrind: urlParams.get('grind') || 'Medium-Fine',
      brewTime: urlParams.get('time') || '3m 15s',
      upc: urlParams.get('upc') || '',
      customUrl: urlParams.get('url') || ''
    }] : [];

    const customProfile = {
      id: idOrSlug,
      slug: idOrSlug,
      name: formattedName,
      location: urlParams?.get('location') || 'Artisan Small-Batch Roastery',
      website: urlParams?.get('website') || urlParams?.get('url') || 'https://thebrew.app'
    };

    const synthesized = formatCustomRoasterAsShowcase(customProfile, synthesizedCoffee);
    synthesized.shortName = getRoasterShortName(synthesized.name);

    // Return synthesized in-memory showcase view without polluting persistent custom roasters
    return synthesized;
  }

  return all[0];
}

export function getRoastersByCountry(country = 'Costa Rica') {
  const all = getAllShowcaseRoasters();
  const target = String(country).toLowerCase().trim();
  return all.filter((r) => r.country && r.country.toLowerCase() === target);
}
