export const AMAZON_AFFILIATE_TAG = 'thebrewapp13-20';

export const PRODUCT_CATEGORIES = {
  coffee: [
    { id: 'all', label: 'All Coffee Gear' },
    { id: 'method_kit', label: 'Coffee Kits' },
    { id: 'grinders_scales', label: 'Grinders & Scales' },
    { id: 'water_kettles', label: 'Water & Kettles' },
    { id: 'beans', label: 'Whole Bean Coffees' },
    { id: 'top_rated', label: 'Top Rated ⭐ 4.9+' }
  ],
  tea: [
    { id: 'all', label: 'All Tea Gear' },
    { id: 'method_kit', label: 'Steeping Kits' },
    { id: 'water_kettles', label: 'Kettles & Teaware' },
    { id: 'top_rated', label: 'Top Rated ⭐ 4.9+' }
  ]
};

export const PRODUCT_TIERS = [
  { id: 'all', label: 'All Price Tiers' },
  { id: 'best', label: '👑 Best (Enthusiast)', shortLabel: 'Best' },
  { id: 'good', label: '⭐ Good (Barista Choice)', shortLabel: 'Good' },
  { id: 'budget', label: '💡 Budget (Best Value)', shortLabel: 'Budget' }
];

// Tiered equipment recommendations by brew method
export const METHOD_TIERED_PRODUCTS = {
  pour_over: {
    best: 'origami_dripper_m',
    good: 'v60_dripper_kit',
    budget: 'v60_plastic_dripper'
  },
  classic_pour_over: {
    best: 'origami_dripper_m',
    good: 'v60_dripper_kit',
    budget: 'v60_plastic_dripper'
  },
  french_press: {
    best: 'fellow_clara_french_press',
    good: 'bodum_french_press',
    budget: 'mueller_french_press'
  },
  aeropress: {
    best: 'aeropress_clear',
    good: 'aeropress_original',
    budget: 'aeropress_go'
  },
  chemex: {
    best: 'chemex_8cup',
    good: 'chemex_8cup',
    budget: 'bodum_pour_over_cork'
  },
  moka_pot: {
    best: 'bialetti_venus_stainless',
    good: 'bialetti_moka_express',
    budget: 'primula_stovetop_moka'
  },
  cold_brew: {
    best: 'fellow_clara_french_press',
    good: 'bodum_french_press',
    budget: 'mueller_french_press'
  },
  drip_brewer: {
    best: 'fellow_ode_gen2',
    good: 'baratza_encore',
    budget: 'timemore_c2_grinder'
  },
  espresso: {
    best: 'onyx_southern_weather',
    good: 'lavazza_super_crema',
    budget: 'lavazza_super_crema'
  }
};

export const PRODUCTS_DATA = [
  // ==========================================
  // 1. COFFEE STORE PRODUCTS (track: 'coffee')
  // ==========================================

  // --- POUR OVER / DRIPPERS ---
  {
    id: 'origami_dripper_m',
    name: 'Origami Ceramic Dripper M (Made in Mino, Japan)',
    track: 'coffee',
    category: 'method_kit',
    methodIds: ['pour_over', 'classic_pour_over'],
    tier: 'best',
    badge: '👑 Enthusiast Pick',
    rating: 4.9,
    reviewsCount: 1240,
    priceRange: '$46 - $52',
    topRated: true,
    asin: 'B07Z2Y44R5',
    amazonUrl: `https://www.amazon.com/dp/B07Z2Y44R5/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/origami_dripper.jpg',
    description: '20 vertical grooved ribs crafted from Mino porcelain in Japan. Accepts both V60 cone and Kalita wave filters for ultimate flow rate versatility.',
    whyWeRecommend: 'The choice of World Brewers Cup champions for its surgical thermal stability and vibrant floral acidity.'
  },
  {
    id: 'v60_dripper_kit',
    name: 'Hario V60 Ceramic Coffee Dripper Starter Set',
    track: 'coffee',
    category: 'method_kit',
    methodIds: ['pour_over', 'classic_pour_over'],
    tier: 'good',
    badge: '⭐ Barista Choice',
    rating: 4.9,
    reviewsCount: 3420,
    priceRange: '$24 - $28',
    topRated: true,
    asin: 'B002VUSWGQ',
    amazonUrl: `https://www.amazon.com/dp/B002VUSWGQ/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/v60_ceramic_dripper.jpg',
    description: 'The iconic 60-degree spiral ribbed ceramic pour-over cone for maximum flow rate control and pristine citric clarity.',
    whyWeRecommend: 'The universal benchmark for specialty pour-over extraction with unrivaled clarity.'
  },
  {
    id: 'v60_plastic_dripper',
    name: 'Hario V60 Plastic Coffee Dripper Size 02 (Clear)',
    track: 'coffee',
    category: 'method_kit',
    methodIds: ['pour_over', 'classic_pour_over'],
    tier: 'budget',
    badge: '💡 Best Value',
    rating: 4.8,
    reviewsCount: 14200,
    priceRange: '$10 - $13',
    asin: 'B000P4D5HG',
    amazonUrl: `https://www.amazon.com/dp/B000P4D5HG/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/v60_plastic_dripper.jpg',
    description: 'BPA-free high-grade resin dripper. Superior thermal efficiency compared to ceramic because it does not absorb heat from the brew water bed.',
    whyWeRecommend: 'Professional baristas often prefer plastic V60 over ceramic for higher brew slurry temperatures and incredible affordability.'
  },
  {
    id: 'v60_paper_filters',
    name: 'Hario V60 Paper Filters Size 02 100 Count',
    track: 'coffee',
    category: 'method_kit',
    methodIds: ['pour_over', 'classic_pour_over'],
    tier: 'budget',
    badge: 'Essential Filters',
    rating: 4.8,
    reviewsCount: 8900,
    priceRange: '$9 - $12',
    asin: 'B001U7EOYA',
    amazonUrl: `https://www.amazon.com/dp/B001U7EOYA/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/v60_paper_filters.jpg',
    description: 'High-density Japanese oxygen-bleached tabbed paper filters that trap sediment and oils for a tea-like body.',
    whyWeRecommend: 'Pristine paper composition with zero papery taste after a quick hot rinse.'
  },

  // --- CHEMEX ---
  {
    id: 'chemex_8cup',
    name: 'Chemex Classic 8 Cup Glass Pour Over Coffeemaker',
    track: 'coffee',
    category: 'method_kit',
    methodIds: ['chemex'],
    tier: 'good',
    badge: 'Design Icon',
    rating: 4.8,
    reviewsCount: 5120,
    priceRange: '$48 - $54',
    asin: 'B000I1WP7W',
    amazonUrl: `https://www.amazon.com/dp/B000I1WP7W/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/chemex_8cup.jpg',
    description: 'Non-porous Borosilicate glass carafe with polished wood collar and leather tie. Uses heavy Chemex bond filters.',
    whyWeRecommend: 'Museum of Modern Art permanent collection design delivering pure, sparkling cups.'
  },
  {
    id: 'bodum_pour_over_cork',
    name: 'Bodum 34 oz Pour Over Coffee Maker with Permanent Filter',
    track: 'coffee',
    category: 'method_kit',
    methodIds: ['chemex', 'pour_over'],
    tier: 'budget',
    badge: '💡 Zero-Waste Value',
    rating: 4.6,
    reviewsCount: 28400,
    priceRange: '$22 - $26',
    asin: 'B00LOCYKIQ',
    amazonUrl: `https://www.amazon.com/dp/B00LOCYKIQ/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/bodum_pour_over.jpg',
    description: 'Borosilicate glass hourglass carafe featuring a reusable stainless steel fine mesh filter cone and natural cork band.',
    whyWeRecommend: 'Eliminates recurring paper filter costs while delivering Chemex-style aesthetics on a budget.'
  },

  // --- FRENCH PRESS ---
  {
    id: 'fellow_clara_french_press',
    name: 'Fellow Clara Matte Black Insulated French Press 24 oz',
    track: 'coffee',
    category: 'method_kit',
    methodIds: ['french_press', 'cold_brew'],
    tier: 'best',
    badge: '👑 Insulated Flagship',
    rating: 4.8,
    reviewsCount: 980,
    priceRange: '$99 - $110',
    topRated: true,
    asin: 'B09JGG8M93',
    amazonUrl: `https://www.amazon.com/dp/B09JGG8M93/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/fellow_clara.jpg',
    description: 'Double-wall vacuum insulated stainless steel with non-stick interior coating, ultra-fine directional mesh filter, and ratio fill lines.',
    whyWeRecommend: 'Keeps brew water at consistent 200°F extraction temperature for 4+ minutes with zero sludge.'
  },
  {
    id: 'bodum_french_press',
    name: 'Bodum Chambord French Press Coffee Maker 34 oz',
    track: 'coffee',
    category: 'method_kit',
    methodIds: ['french_press', 'cold_brew'],
    tier: 'good',
    badge: '⭐ Immersion Classic',
    rating: 4.7,
    reviewsCount: 12450,
    priceRange: '$35 - $42',
    asin: 'B00008XEWG',
    amazonUrl: `https://www.amazon.com/dp/B00008XEWG/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/bodum_french_press.jpg',
    description: 'Heat-resistant borosilicate glass with stainless steel frame and 3-part mesh plunger for heavy chocolate body.',
    whyWeRecommend: 'The quintessential French Press recognized globally for comforting full-bodied brews.'
  },
  {
    id: 'mueller_french_press',
    name: 'Mueller Stainless Steel Double-Insulated French Press 34 oz',
    track: 'coffee',
    category: 'method_kit',
    methodIds: ['french_press', 'cold_brew'],
    tier: 'budget',
    badge: '💡 Unbreakable Value',
    rating: 4.7,
    reviewsCount: 42100,
    priceRange: '$24 - $28',
    asin: 'B00MMQOZ1U',
    amazonUrl: `https://www.amazon.com/dp/B00MMQOZ1U/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/mueller_french_press.jpg',
    description: 'Heavy gauge 304 18/10 stainless steel double wall construction. Drop-proof, rust-proof, and retains heat 60 minutes longer than glass.',
    whyWeRecommend: 'Unbreakable everyday workhorse that never shatters on stone countertops.'
  },

  // --- AEROPRESS ---
  {
    id: 'aeropress_clear',
    name: 'AeroPress Clear Shatterproof Tritan Coffee Press',
    track: 'coffee',
    category: 'method_kit',
    methodIds: ['aeropress'],
    tier: 'best',
    badge: '👑 Crystal Clear',
    rating: 4.9,
    reviewsCount: 4300,
    priceRange: '$49 - $54',
    topRated: true,
    asin: 'B0C1L9Z9T4',
    amazonUrl: `https://www.amazon.com/dp/B0C1L9Z9T4/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/aeropress_clear.jpg',
    description: 'Crystal-clear shatterproof Tritan construction allowing full visual observation of the brew bed turbulence and extraction.',
    whyWeRecommend: 'Spectacular countertop aesthetics with all the durability and versatility of the AeroPress.'
  },
  {
    id: 'aeropress_original',
    name: 'AeroPress Original Coffee and Espresso Maker',
    track: 'coffee',
    category: 'method_kit',
    methodIds: ['aeropress'],
    tier: 'good',
    badge: '⭐ Swiss Army Knife',
    rating: 4.9,
    reviewsCount: 18900,
    priceRange: '$39 - $44',
    topRated: true,
    asin: 'B0047BIWSK',
    amazonUrl: `https://www.amazon.com/dp/B0047BIWSK/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/aeropress_original.jpg',
    description: 'Patented air-pressure immersion technology brewing zero-bitterness coffee in under 2 minutes.',
    whyWeRecommend: 'Virtually indestructible BPA-free polypropylene with the easiest cleanup in coffee.'
  },
  {
    id: 'aeropress_go',
    name: 'AeroPress Go Portable Travel Coffee Press',
    track: 'coffee',
    category: 'method_kit',
    methodIds: ['aeropress'],
    tier: 'budget',
    badge: '💡 Compact Travel',
    rating: 4.8,
    reviewsCount: 9200,
    priceRange: '$39 - $44',
    asin: 'B07YVL8SF3',
    amazonUrl: `https://www.amazon.com/dp/B07YVL8SF3/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/aeropress_go.jpg',
    description: 'Packs neatly inside its own 15 oz microwave-safe drinking mug with silicone travel lid. Includes 350 micro-filters.',
    whyWeRecommend: 'Complete all-in-one travel coffee kit for offices, dorms, camping, and road trips.'
  },

  // --- MOKA POT ---
  {
    id: 'bialetti_venus_stainless',
    name: 'Bialetti Venus Stainless Steel Induction Moka Pot 6 Cup',
    track: 'coffee',
    category: 'method_kit',
    methodIds: ['moka_pot'],
    tier: 'best',
    badge: '👑 Induction Ready',
    rating: 4.7,
    reviewsCount: 16800,
    priceRange: '$48 - $54',
    asin: 'B0855BL9L5',
    amazonUrl: `https://www.amazon.com/dp/B0855BL9L5/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/bialetti_venus.jpg',
    description: 'Heavy 18/10 stainless steel construction compatible with all stovetops including magnetic induction, gas, and ceramic.',
    whyWeRecommend: 'Premium rust-free stainless steel with modern lines, dishwasher-safe maintenance, and induction support.'
  },
  {
    id: 'bialetti_moka_express',
    name: 'Bialetti Moka Express Stovetop Espresso Maker 6 Cup',
    track: 'coffee',
    category: 'method_kit',
    methodIds: ['moka_pot'],
    tier: 'good',
    badge: '⭐ Italian Legend',
    rating: 4.7,
    reviewsCount: 21500,
    priceRange: '$38 - $45',
    asin: 'B0000CF3Q6',
    amazonUrl: `https://www.amazon.com/dp/B0000CF3Q6/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/bialetti_moka_express.jpg',
    description: 'Octagonal food-grade aluminum body made in Italy. Generates 1.5 bar steam pressure for syrupy crema-rich coffee.',
    whyWeRecommend: 'The authentic Italian stovetop classic produced since 1933.'
  },
  {
    id: 'primula_stovetop_moka',
    name: 'Primula Aluminum Stovetop 6-Cup Espresso Maker',
    track: 'coffee',
    category: 'method_kit',
    methodIds: ['moka_pot'],
    tier: 'budget',
    badge: '💡 Affordable Stovetop',
    rating: 4.6,
    reviewsCount: 19800,
    priceRange: '$18 - $22',
    asin: 'B001J1L558',
    amazonUrl: `https://www.amazon.com/dp/B001J1L558/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/primula_moka.jpg',
    description: 'Cast aluminum design with flip-top lid, temperature-resistant silicone knob and handle, and safety release valve.',
    whyWeRecommend: 'Direct, honest stovetop espresso concentrate for lattes and iced americanos under $20.'
  },

  // --- BURR GRINDERS ---
  {
    id: 'fellow_ode_gen2',
    name: 'Fellow Ode Gen 2 Electric Brew Burr Grinder (64mm Burrs)',
    track: 'coffee',
    category: 'grinders_scales',
    methodIds: ['pour_over', 'french_press', 'chemex', 'aeropress', 'drip_brewer', 'cold_brew'],
    tier: 'best',
    badge: '👑 Flagship Flat Burr',
    rating: 4.7,
    reviewsCount: 2400,
    priceRange: '$345 - $365',
    topRated: true,
    asin: 'B0B8L8CLL2',
    amazonUrl: `https://www.amazon.com/dp/B0B8L8CLL2/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/fellow_ode_gen2.jpg',
    description: 'Professional 64mm stainless steel flat burrs, anti-static ionizer technology, auto-stop sensor, and 31 precise grind settings.',
    whyWeRecommend: 'Unmatched sweetness and unimodal particle distribution for filter coffee clarity.'
  },
  {
    id: 'baratza_encore',
    name: 'Baratza Encore Conical Burr Coffee Grinder',
    track: 'coffee',
    category: 'grinders_scales',
    methodIds: ['pour_over', 'french_press', 'drip_brewer', 'moka_pot', 'aeropress', 'chemex', 'cold_brew'],
    tier: 'good',
    badge: '⭐ The Gold Standard',
    rating: 4.7,
    reviewsCount: 9400,
    priceRange: '$149 - $169',
    asin: 'B007F183LK',
    amazonUrl: `https://www.amazon.com/dp/B007F183LK/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/baratza_encore.jpg',
    description: '40 individual coarseness settings from 250 to 1200 microns. 40mm alloy steel burrs engineered in Europe.',
    whyWeRecommend: 'The undisputed gold standard home grinder recommended by every specialty roaster.'
  },
  {
    id: 'timemore_c2_grinder',
    name: 'Timemore Chestnut C2 Manual Hand Burr Coffee Grinder',
    track: 'coffee',
    category: 'grinders_scales',
    methodIds: ['pour_over', 'french_press', 'aeropress', 'moka_pot', 'chemex'],
    tier: 'budget',
    badge: '💡 Top Value Burr',
    rating: 4.7,
    reviewsCount: 8800,
    priceRange: '$52 - $59',
    asin: 'B083328KC8',
    amazonUrl: `https://www.amazon.com/dp/B083328KC8/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/timemore_c2.jpg',
    description: 'CNC stainless steel conical burrs with dual bearing stabilization and textured aluminum unibody for smooth 30-second grinding.',
    whyWeRecommend: 'Crushes electric grinders at twice its price with uniform particle size and zero motor heat.'
  },

  // --- PRECISION SCALES ---
  {
    id: 'acaia_pearl_scale',
    name: 'Acaia Pearl Digital Coffee Scale (0.1g / Real-Time Flow Rate)',
    track: 'coffee',
    category: 'grinders_scales',
    methodIds: ['pour_over', 'french_press', 'chemex', 'aeropress', 'espresso'],
    tier: 'best',
    badge: '👑 Competition Grade',
    rating: 4.8,
    reviewsCount: 1450,
    priceRange: '$145 - $155',
    topRated: true,
    asin: 'B07N8MBD9Q',
    amazonUrl: `https://www.amazon.com/dp/B07N8MBD9Q/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/acaia_pearl.jpg',
    description: '20ms ultra-fast response time, laboratory-grade 0.1g sensitivity, real-time flow rate indicator bar, and Bluetooth app connectivity.',
    whyWeRecommend: 'The official scale of World Barista Championship competitors.'
  },
  {
    id: 'timemore_black_mirror',
    name: 'Timemore Black Mirror Basic 2.0 Digital Coffee Scale with Timer',
    track: 'coffee',
    category: 'grinders_scales',
    methodIds: ['pour_over', 'french_press', 'drip_brewer', 'moka_pot', 'espresso', 'aeropress', 'chemex'],
    tier: 'good',
    badge: '⭐ Barista Precision',
    rating: 4.7,
    reviewsCount: 3100,
    priceRange: '$52 - $59',
    asin: 'B0CKYV8WRC',
    amazonUrl: `https://www.amazon.com/dp/B0CKYV8WRC/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/timemore_black_mirror.jpg',
    description: 'Ultra-fast 0.1g precision sensor with auto-starting brew timer, hidden LED display, and USB-C rechargeable battery.',
    whyWeRecommend: 'Everything a home barista needs: responsive flow tracking, auto-timer, and silicone spill pad.'
  },
  {
    id: 'greater_goods_scale',
    name: 'Greater Goods Digital Coffee Scale with Built-In Timer (0.1g)',
    track: 'coffee',
    category: 'grinders_scales',
    methodIds: ['pour_over', 'french_press', 'aeropress', 'chemex', 'moka_pot'],
    tier: 'budget',
    badge: '💡 Budget Essential',
    rating: 4.6,
    reviewsCount: 11200,
    priceRange: '$17 - $21',
    asin: 'B08P12D554',
    amazonUrl: `https://www.amazon.com/dp/B08P12D554/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/greater_goods_scale.jpg',
    description: 'High-contrast backlit LCD screen, integrated stopwatch timer, 0.1g accuracy up to 3kg, and heat-resistant silicone protector.',
    whyWeRecommend: 'Exceptional budget precision for under $20 that proves you do not need to spend triple digits to measure your dose.'
  },

  // --- GOOSENECK KETTLES ---
  {
    id: 'fellow_stagg_ekg',
    name: 'Fellow Stagg EKG Electric Gooseneck Kettle 0.9L',
    track: 'coffee',
    category: 'water_kettles',
    methodIds: ['pour_over', 'french_press', 'drip_brewer', 'aeropress', 'chemex'],
    tier: 'best',
    badge: '👑 Pro PID Control',
    rating: 4.8,
    reviewsCount: 7800,
    priceRange: '$165 - $195',
    asin: 'B077JBQZPX',
    amazonUrl: `https://www.amazon.com/dp/B077JBQZPX/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/fellow_stagg_ekg.jpg',
    description: 'PID degree-by-degree temperature control (135°F - 212°F) with precision counterbalanced gooseneck pour spout and 60-min hold.',
    whyWeRecommend: 'The pour spout provides effortless, smooth laminar water flow control with zero dripping.'
  },
  {
    id: 'bonavita_variable_kettle',
    name: 'Bonavita 1.0L Variable Temperature Electric Gooseneck Kettle',
    track: 'coffee',
    category: 'water_kettles',
    methodIds: ['pour_over', 'french_press', 'chemex', 'aeropress'],
    tier: 'good',
    badge: '⭐ Workhorse Precision',
    rating: 4.6,
    reviewsCount: 6500,
    priceRange: '$89 - $99',
    asin: 'B005YR0F40',
    amazonUrl: `https://www.amazon.com/dp/B005YR0F40/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/bonavita_kettle.jpg',
    description: '1000-watt quick heater with 1-degree temperature setting adjustments, 60-minute heat-and-hold mode, and commercial-grade stainless steel.',
    whyWeRecommend: 'Proven specialty cafe workhorse that lasts for years of daily brewing.'
  },
  {
    id: 'bodum_melior_kettle',
    name: 'Bodum Melior Electric Gooseneck Water Kettle 27 oz',
    track: 'coffee',
    category: 'water_kettles',
    methodIds: ['pour_over', 'french_press', 'chemex', 'aeropress'],
    tier: 'budget',
    badge: '💡 Entry Electric',
    rating: 4.6,
    reviewsCount: 8900,
    priceRange: '$36 - $42',
    asin: 'B07G28NDW8',
    amazonUrl: `https://www.amazon.com/dp/B07G28NDW8/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/bodum_melior_kettle.jpg',
    description: 'Slim curved gooseneck spout for steady water release, matte stainless steel body, non-slip natural cork handle and steam knob.',
    whyWeRecommend: 'Gives beginners proper slow gooseneck pouring control at an entry-level price.'
  },

  // --- WATER MINERALS ---
  {
    id: 'third_wave_water',
    name: 'Third Wave Water Coffee Mineral Packets 12 Pack',
    track: 'coffee',
    category: 'water_kettles',
    methodIds: ['pour_over', 'french_press', 'drip_brewer', 'moka_pot', 'espresso', 'aeropress', 'chemex'],
    tier: 'good',
    badge: '⭐ SCA Mineral Profile',
    rating: 4.8,
    reviewsCount: 1650,
    priceRange: '$15 - $18',
    asin: 'B07732KPT8',
    amazonUrl: `https://www.amazon.com/dp/B07732KPT8/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/third_wave_water.jpg',
    description: 'Remineralizes distilled or RO water with exact magnesium, calcium, and sodium ratios to eliminate papery sourness.',
    whyWeRecommend: 'Instant SCA benchmark water profile: 1 packet into 1 gallon of distilled water.'
  },

  // --- WHOLE BEAN COFFEES ---
  {
    id: 'onyx_southern_weather',
    name: 'Onyx Coffee Lab Southern Weather Whole Bean Coffee 10 oz',
    track: 'coffee',
    category: 'beans',
    methodIds: ['pour_over', 'french_press', 'aeropress', 'espresso', 'chemex'],
    tier: 'best',
    badge: '👑 Artisan Roast',
    rating: 4.9,
    reviewsCount: 1850,
    priceRange: '$21 - $24',
    topRated: true,
    asin: 'B07V275817',
    amazonUrl: `https://www.amazon.com/dp/B07V275817/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/onyx_southern_weather.jpg',
    description: 'Flagship blend from US Roaster Champions Onyx. Notes of milk chocolate, plum, candied walnuts, and citrus sweetness.',
    whyWeRecommend: 'Benchmark roast profile with 100% transparent single-lot farm sourcing.'
  },
  {
    id: 'stumptown_hair_bender',
    name: 'Stumptown Coffee Roasters Hair Bender Whole Bean 12 oz',
    track: 'coffee',
    category: 'beans',
    methodIds: ['pour_over', 'french_press', 'aeropress', 'espresso'],
    tier: 'good',
    badge: '⭐ Specialty Legend',
    rating: 4.9,
    reviewsCount: 3420,
    priceRange: '$16 - $19',
    topRated: true,
    asin: 'B07QHDMQGH',
    amazonUrl: `https://www.amazon.com/dp/B07QHDMQGH/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/stumptown_hair_bender.jpg',
    description: 'The cup that started a movement. A complex, rich blend of Latin America, Africa, and Indonesia featuring sweet cherry, dark chocolate, and toffee.',
    whyWeRecommend: 'Consistently balanced extraction profile with rich crema.'
  },
  {
    id: 'lavazza_super_crema',
    name: 'Lavazza Super Crema Whole Bean Coffee Blend 2.2 lb',
    track: 'coffee',
    category: 'beans',
    methodIds: ['espresso', 'moka_pot', 'french_press', 'pour_over'],
    tier: 'budget',
    badge: '💡 Value Crema King',
    rating: 4.8,
    reviewsCount: 38900,
    priceRange: '$22 - $26',
    topRated: true,
    asin: 'B000SDKDM4',
    amazonUrl: `https://www.amazon.com/dp/B000SDKDM4/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/lavazza_super_crema.jpg',
    description: 'Medium espresso roast crafted in Italy. A velvet harmonic blend of washed and natural beans with notes of hazelnut, roasted almond, and brown sugar.',
    whyWeRecommend: 'Exceptional price-per-pound value delivering dense persistent crema for milk drinks.'
  },

  // ==========================================
  // 2. TEA STORE PRODUCTS (track: 'tea')
  // ==========================================
  {
    id: 'hario_chacha_kyusu',
    name: "Hario Chacha Kyusu 'Maru' Glass Teapot 700ml",
    track: 'tea',
    category: 'method_kit',
    methodIds: ['green_tea', 'black_tea', 'oolong_tea', 'white_tea', 'herbal_infusion'],
    tier: 'good',
    badge: '⭐ Artisan Glass',
    rating: 4.8,
    reviewsCount: 8200,
    priceRange: '$18 - $24',
    topRated: true,
    asin: 'B0006HINDI',
    amazonUrl: `https://www.amazon.com/dp/B0006HINDI/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/hario_chacha_kyusu.jpg',
    description: 'Heat-resistant Japanese borosilicate glass teapot with wide stainless steel mesh strainer for full loose leaf expansion and crystal-clear liquor.',
    whyWeRecommend: 'Clear viewing of whole leaf unfurling with easy rinsability.'
  },
  {
    id: 'gongfu_travel_ceramic_set',
    name: 'Ceramic Gongfu Portable Teapot with Strainer & 3 Cups',
    track: 'tea',
    category: 'method_kit',
    methodIds: ['green_tea', 'black_tea', 'oolong_tea', 'white_tea'],
    tier: 'budget',
    badge: '💡 Gongfu Value',
    rating: 4.7,
    reviewsCount: 1950,
    priceRange: '$24 - $29',
    asin: 'B07Y85G69Q',
    amazonUrl: `https://www.amazon.com/dp/B07Y85G69Q/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/gongfu_travel_set.jpg',
    description: 'Chinese Gongfu quick Gaiwan pot with wooden heat-shield grip, built-in ceramic strainer holes, and custom zippered protective travel case.',
    whyWeRecommend: 'Allows traditional high leaf-to-water ratio steeping anywhere on a budget.'
  },
  {
    id: 'cast_iron_tetsubin_teapot',
    name: 'Japanese Cast Iron Tetsubin Teapot with Stainless Infuser 800ml',
    track: 'tea',
    category: 'method_kit',
    methodIds: ['black_tea', 'oolong_tea'],
    tier: 'best',
    badge: '👑 Thermal Mass',
    rating: 4.8,
    reviewsCount: 4100,
    priceRange: '$38 - $46',
    topRated: true,
    asin: 'B001F0R5W2',
    amazonUrl: `https://www.amazon.com/dp/B001F0R5W2/?tag=${AMAZON_AFFILIATE_TAG}`,
    image: '/images/gear/cast_iron_teapot.jpg',
    description: 'Traditional hobnail black cast iron exterior with food-grade porcelain enamel interior lining for high thermal mass retention during dark tea infusions.',
    whyWeRecommend: 'Keeps water temperature hot through multiple long steeps of aged oolong or pu-erh.'
  }
];
