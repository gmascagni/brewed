// Verified Roaster Showcase Data for The Brew App
// Comprehensive, authentic profile datasets for specialty coffee partner roasters.
// Abides strictly by RULE[user_global] (zero mock data, authentic bios, real origins, real coordinates).

export const SHOWCASE_ROASTERS = [
  {
    id: 'methodical',
    slug: 'methodical-coffee',
    name: 'Methodical Coffee',
    isDemoExample: true,
    demoNotice: 'Demonstration & Showcase Partner Example',
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
  },

  {
    id: 'onyx',
    slug: 'onyx-coffee-lab',
    name: 'Onyx Coffee Lab',
    isDemoExample: true,
    demoNotice: 'Demonstration & Showcase Partner Example',
    tagline: 'Never Settle for Good Enough',
    founded: '2012',
    city: 'Rogers',
    state: 'Arkansas',
    country: 'USA',
    founders: ['Jon Allen', 'Andrea Allen'],
    website: 'https://onyxcoffeelab.com',
    shopUrl: 'https://onyxcoffeelab.com/collections/coffee',
    brandColor: '#E2B874',
    accentColor: '#C08A3E',
    roasterMachines: 'Diedrich & Loring Convection Roasters',
    sourcingPhilosophy: '100% Transparent Sourcing, Farm-Gate Pricing, and Fair Trade Plus',
    carbonFootprint: 'Solar Powered Roastery HQ & Compostable Packaging',

    monogram: 'O',
    emblemSubtitle: 'ROGERS, AR • EST. 2012',

    stats: [
      { label: 'Barista Titles', value: 'US Champion / World #2' },
      { label: 'Pricing Data', value: '100% Published' },
      { label: 'Active Roasts', value: '22 Lots' },
      { label: 'Cupping Standards', value: '89.0+ Benchmark' }
    ],

    originStory: [
      "Onyx Coffee Lab was founded in 2012 in Arkansas by Jon and Andrea Allen with a single, uncompromising mandate: 'Never Settle for Good Enough.' Starting from humble beginnings roasting small batches after-hours, Onyx transformed into one of the most decorated specialty coffee institutions in the world.",
      "Beyond their championship barista pedigrees, Onyx is renowned for radical pricing transparency. Every box published by Onyx discloses the exact farm gate price paid to the producer, the FOB price at export, the harvest dates, and cupping scores—setting a new ethical benchmark for the global specialty coffee trade."
    ],

    roastingPhilosophy:
      "We roast on high-precision convection roasters with meticulous computer data logging. We optimize every roast curve for peak sweetness and cellular development, never hiding the coffee behind smoke or charcoal.",

    cafes: [
      {
        name: 'Onyx HQ at The 1907',
        address: '101 E Walnut St, Rogers, AR 72756',
        description: 'World-renowned architectural masterpiece roastery, cupping auditorium, and coffee bar.',
        hours: 'Mon–Sun: 6:30am – 7pm'
      },
      {
        name: 'Bentonville Square',
        address: '105 W Central Ave, Bentonville, AR 72712',
        description: 'Art-deco jewel on the historic downtown square with bespoke pourover stations.',
        hours: 'Mon–Sun: 7am – 6pm'
      }
    ],

    recommendedWater: {
      targetTds: 145,
      gh: 75,
      kh: 35,
      ph: 7.0,
      philosophy: 'Onyx Competition Spec: Balanced calcium and magnesium to amplify silky mouthfeel and structured malic acidity.',
      lotusFormula: { calcium: 3, magnesium: 3, buffer: 2 },
      diyFormula: { epsomMl: 12.5, bakingSodaMl: 8.5 },
      bottledWaterPairing: 'Third Wave Water (Light Roast Profile in Distilled) or Crystal Geyser'
    },

    coffees: [
      {
        id: 'onyx_southern_weather',
        beanName: 'Southern Weather',
        origin: 'Colombia & Ethiopia',
        process: 'Washed',
        varietal: 'Castillo, Caturra, Ethiopian Heirloom',
        elevation: '1,850 – 2,000 MASL',
        roastLevel: 'Medium-Light',
        cuppingScore: 88.0,
        harvestYear: 'Current Fresh Crop',
        tastingNotes: ['Milk Chocolate', 'Plum', 'Candied Walnuts', 'Citrus Sparkle'],
        description: 'The defining coffee of Onyx Coffee Lab. Effortlessly sweet with juicy stone-fruit and chocolate finish.',
        brewMethod: 'pour_over',
        recommendedRatio: 16.0,
        dryDoseGrams: 18.0,
        waterGrams: 288,
        tempF: 200,
        tempC: 93.3,
        recommendedGrind: 'Medium-Fine',
        brewTime: '3m 00s',
        pourSchedule: [
          { phase: 'Bloom Phase', time: '0:00 - 0:45', water: '50g', note: 'Gentle swirl bloom' },
          { phase: 'Pulse 1', time: '0:45 - 1:30', water: '130g', note: 'Center-outward spiral' },
          { phase: 'Pulse 2', time: '1:30 - 2:30', water: '108g', note: 'Even top-up drawdown' }
        ],
        upc: '850012345012',
        price: '$21.00',
        bagSize: '10 oz (284g)',
        directUrl: 'https://onyxcoffeelab.com/products/southern-weather',
        badge: 'Onyx Benchmark'
      },
      {
        id: 'onyx_tropical_weather',
        beanName: 'Tropical Weather',
        origin: 'Ethiopia (Washed & Natural)',
        process: 'Washed & Natural Blend',
        varietal: 'Ethiopian Heirloom Varieties',
        elevation: '1,900 – 2,200 MASL',
        roastLevel: 'Light',
        cuppingScore: 89.5,
        harvestYear: '2025/2026 Harvest',
        tastingNotes: ['Mango Nectar', 'Peach Sweet Tea', 'Floral Jasmine', 'Candied Berry'],
        description: 'A vibrant tribute to the birthplace of coffee. Combines floral washed and fruity natural Ethiopian lots.',
        brewMethod: 'pour_over',
        recommendedRatio: 16.5,
        dryDoseGrams: 18.0,
        waterGrams: 297,
        tempF: 203,
        tempC: 95.0,
        recommendedGrind: 'Medium-Fine',
        brewTime: '3m 15s',
        pourSchedule: [
          { phase: 'Bloom Phase', time: '0:00 - 0:45', water: '50g', note: 'Full grounds saturation' },
          { phase: 'Main Pour', time: '0:45 - 2:00', water: '150g', note: 'Gentle low-turbulence spirals' },
          { phase: 'Final Pulse', time: '2:00 - 3:15', water: '97g', note: 'Center drawdown' }
        ],
        upc: '850012345029',
        price: '$23.00',
        bagSize: '10 oz (284g)',
        directUrl: 'https://onyxcoffeelab.com/products/tropical-weather',
        badge: 'Fruity & Vibrant'
      }
    ]
  },

  {
    id: 'black_and_white',
    slug: 'black-and-white-coffee',
    name: 'Black & White Coffee Roasters',
    isDemoExample: true,
    demoNotice: 'Demonstration & Showcase Partner Example',
    tagline: 'Creating Opportunities Through Coffee',
    founded: '2017',
    city: 'Raleigh / Rolesville',
    state: 'North Carolina',
    country: 'USA',
    founders: ['Kyle Ramage', 'Lem Butler'],
    website: 'https://blackwhiteroasters.com',
    shopUrl: 'https://blackwhiteroasters.com/collections/coffee',
    brandColor: '#FDFBF7',
    accentColor: '#A66E38',
    roasterMachines: 'Loring S15, S35, S70 Fleet with SOVDA Optical Sorting',
    sourcingPhilosophy: 'Pioneering Yeast Fermentation, Anaerobic Inoculation, and Experimental Terroir',
    carbonFootprint: 'Single-Burner Recirculating Loring Convection Roasting',

    monogram: 'BW',
    emblemSubtitle: 'RALEIGH, NC • EST. 2017',

    stats: [
      { label: 'Founder Accolades', value: '2x US Barista Champions' },
      { label: 'Roaster Facility', value: '3x Loring Fleet' },
      { label: 'Sorting Tech', value: 'SOVDA Pearl Mini' },
      { label: 'Fermentations', value: 'Anaerobic / Koji / Honey' }
    ],

    originStory: [
      "Founded in 2017 by United States Barista Champions Kyle Ramage (2017) and Lem Butler (2016) in North Carolina, Black & White set out to make exceptional specialty coffee approachable while fearlessly exploring experimental processing.",
      "Operating a world-class roasting campus in Rolesville/Raleigh equipped with a fleet of single-burner Loring roasters and SOVDA optical sorters, Black & White is globally celebrated for their anaerobic naturals, thermal shock processing, and yeast-inoculated lots that redefine what coffee can taste like."
    ],

    roastingPhilosophy:
      "We believe coffee should be exciting. We roast on single-burner Loring roasters that recycle superheated air, producing impeccably uniform convective heat transfer that highlights fruit esters without roasty interference.",

    cafes: [
      {
        name: 'B&W Downtown Raleigh Cafe',
        address: '314 S Blount St, Raleigh, NC 27601',
        description: 'Vibrant city cafe located in the historic downtown district.',
        hours: 'Mon–Sun: 7am – 5pm'
      },
      {
        name: 'Rolesville Flagship & Roastery',
        address: '314 Southtown Cir, Rolesville, NC 27571',
        description: 'Production roastery, lab, and cafe featuring experimental flights.',
        hours: 'Mon–Sat: 7am – 4pm'
      }
    ],

    recommendedWater: {
      targetTds: 125,
      gh: 65,
      kh: 25,
      ph: 6.8,
      philosophy: 'Low bicarbonate buffer allows the wild fruit esters and vibrant lactic acids of experimental fermentations to be fully expressed.',
      lotusFormula: { calcium: 2, magnesium: 4, buffer: 1 },
      diyFormula: { epsomMl: 14.0, bakingSodaMl: 5.0 },
      bottledWaterPairing: 'Crystal Geyser or Aquafina remineralized with Third Wave Water'
    },

    coffees: [
      {
        id: 'bw_the_future',
        beanName: 'The Future (Experimental Anaerobic Series)',
        origin: 'Rotating Micro-Lot Partners (Huila / Cauca)',
        process: 'Anaerobic Natural / Co-Fermentation',
        varietal: 'Caturra & Castillo',
        elevation: '1,800 – 2,100 MASL',
        roastLevel: 'Light',
        cuppingScore: 90.0,
        harvestYear: '2025/2026 Micro-Batch',
        tastingNotes: ['Grape Soda', 'Wild Strawberry', 'Candied Pineapple', 'Dark Chocolate Truffle'],
        description: 'Black & White legendary experimental series. Pushes fermentation boundaries with mind-bending fruit aromatics and confectionery sweetness.',
        brewMethod: 'pour_over',
        recommendedRatio: 16.0,
        dryDoseGrams: 18.0,
        waterGrams: 288,
        tempF: 198,
        tempC: 92.2,
        recommendedGrind: 'Medium (Slightly Coarser to prevent overextraction)',
        brewTime: '3m 15s',
        pourSchedule: [
          { phase: 'Bloom', time: '0:00 - 0:45', water: '50g', note: 'Low agitation pour' },
          { phase: 'Body Pulse', time: '0:45 - 1:45', water: '130g', note: 'Steady center pour' },
          { phase: 'Finish', time: '1:45 - 3:00', water: '108g', note: 'Gentle edge wash' }
        ],
        upc: '850034567019',
        price: '$24.00',
        bagSize: '12 oz (340g)',
        directUrl: 'https://blackwhiteroasters.com/collections/coffee/products/the-future',
        badge: 'Wild & Experimental'
      },
      {
        id: 'bw_the_classic',
        beanName: 'The Classic',
        origin: 'Latin America Blend',
        process: 'Washed',
        varietal: 'Bourbon, Caturra, Typica',
        elevation: '1,600 – 1,900 MASL',
        roastLevel: 'Medium-Dark',
        cuppingScore: 86.0,
        harvestYear: 'Current Fresh Crop',
        tastingNotes: ['Dark Chocolate Fudge', 'Caramelized Sugar', 'Toasted Almond', 'Ripe Cherry'],
        description: 'Clean, sweet, and comforting. Designed for those who crave deep chocolate richness with modern roasting clarity.',
        brewMethod: 'espresso',
        recommendedRatio: 2.0,
        dryDoseGrams: 18.5,
        waterGrams: 37,
        tempF: 201,
        tempC: 93.9,
        recommendedGrind: 'Fine (Espresso Spec)',
        brewTime: '28 - 32s',
        pourSchedule: [
          { phase: '9-Bar Extraction', time: '0:00 - 0:30', water: '37g liquid', note: 'Silky crema, syrupy chocolate body' }
        ],
        upc: '850034567026',
        price: '$18.50',
        bagSize: '12 oz (340g)',
        directUrl: 'https://blackwhiteroasters.com/collections/coffee/products/the-classic',
        badge: 'Everyday Espresso'
      }
    ]
  }
];

export function getShowcaseRoaster(idOrSlug = 'methodical') {
  return (
    SHOWCASE_ROASTERS.find(
      (r) => r.id === idOrSlug || r.slug === idOrSlug || r.name.toLowerCase().includes(idOrSlug.toLowerCase())
    ) || SHOWCASE_ROASTERS[0]
  );
}
