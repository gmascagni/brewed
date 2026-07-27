export const BREW_METHODS = {
  coffee: [
    {
      id: 'pour_over',
      name: 'Pour-Over (V60 / Chemex)',
      category: 'coffee',
      featured: false,
      heroImage: './pour_over_hero.jpg',
      ratio: 15, // 1:15 ratio (1g coffee to 15ml water)
      defaultCupMl: 240,
      tempC: 94,
      tempF: 201,
      grind: 'Medium-Fine',
      micron: '400 - 600 µm',
      description: 'Highlighting bright acidity, delicate floral notes, and crystal-clear body through controlled spiral pouring.',
      preferredCoffeeTypes: 'Light to Medium-Light Roasts. Washed Ethiopian Yirgacheffe, Kenyan SL-28, and Guatemalan Antigua for bright citric, floral, and bergamot notes.',
      phases: [
        { name: 'Bloom Phase', durationSec: 45, waterMultiplier: 3, instruction: 'Pour 3x coffee weight in circular motion. Let coffee expand and off-gas CO2.' },
        { name: 'Main Concentric Pour', durationSec: 60, waterMultiplier: 0.6, instruction: 'Slow concentric pour from center outward. Keep water level steady.' },
        { name: 'Final Center Pour & Drawdown', durationSec: 75, waterMultiplier: 1.0, instruction: 'Gently top up remaining water in center. Allow full bed drawdown.' }
      ]
    },
    {
      id: 'french_press',
      name: 'French Press (Immersion)',
      category: 'coffee',
      featured: false,
      heroImage: './french_press.jpg',
      ratio: 13, // 1:13 ratio
      defaultCupMl: 250,
      tempC: 96,
      tempF: 205,
      grind: 'Coarse / Medium-Coarse',
      micron: '800 - 1000 µm',
      description: 'Rich, full-bodied immersion brew using the James Hoffmann no-press skimming technique for a silt-free cup.',
      preferredCoffeeTypes: 'Medium-Dark to Dark Roasts. Sumatran Giling Basah, Brazilian Yellow Bourbon, and Colombian Huila for heavy chocolate, cedar, and syrupy body.',
      phases: [
        { name: 'Full Immersion Steep', durationSec: 240, waterMultiplier: 1.0, instruction: 'Pour all water aggressively over grounds. Place lid on top to retain heat.' },
        { name: 'Stir & Crust Skim', durationSec: 30, waterMultiplier: 1.0, instruction: 'Gently stir crust. Skim top foam and floating bits with two spoons.' },
        { name: 'Sediment Settle Rest', durationSec: 300, waterMultiplier: 1.0, instruction: 'Insert plunger without pressing down. Rest 5 mins to let fine silt settle.' }
      ]
    },
    {
      id: 'drip_brewer',
      name: 'Automatic Drip Coffee Maker',
      category: 'coffee',
      featured: false,
      heroImage: './drip_brewer.jpg',
      ratio: 16, // 1:16 ratio
      defaultCupMl: 240,
      tempC: 93,
      tempF: 199,
      grind: 'Medium',
      micron: '600 - 750 µm',
      description: 'The golden ratio optimization for home electric batch brewers. Maximize extraction clarity and consistency.',
      preferredCoffeeTypes: 'Medium Roasts. Colombian Nariño, Costa Rican Tarrazú, and Central American blends for balanced milk chocolate, caramel, and clean sweetness.',
      phases: [
        { name: 'Filter Rinse & Reservoir Fill', durationSec: 30, waterMultiplier: 0, instruction: 'Pre-rinse paper filter with hot water. Fill reservoir with cold filtered water.' },
        { name: 'Showerhead Brew Cycle', durationSec: 180, waterMultiplier: 1.0, instruction: 'Start brew cycle. Ensure grounds bed is evenly saturated by showerhead.' },
        { name: 'Thermal Carafe Hold', durationSec: 60, waterMultiplier: 1.0, instruction: 'Brew complete. Remove carafe immediately to prevent hotplate scorching.' }
      ]
    },
    {
      id: 'moka_pot',
      name: 'Moka Pot (Stovetop Espresso)',
      category: 'coffee',
      featured: false,
      heroImage: './moka_pot_hero.jpg',
      ratio: 10, // 1:10 ratio
      defaultCupMl: 120,
      tempC: 95,
      tempF: 203,
      grind: 'Fine / Medium-Fine',
      micron: '350 - 500 µm',
      description: 'Rich, concentrated stovetop extraction using steam expansion to yield intense, full-bodied coffee with velvet crema.',
      preferredCoffeeTypes: 'Medium to Medium-Dark Roasts. Italian Roast blends, Santos Brazil, and Colombian Huila for dark cocoa, toasted walnut, and syrupy strength.',
      phases: [
        { name: 'Water Reservoir Fill & Basket Prep', durationSec: 30, waterMultiplier: 1.0, instruction: 'Fill lower chamber with boiling water to safety valve. Level grounds in funnel without packing tightly.' },
        { name: 'Stovetop Low Heat Heating', durationSec: 180, waterMultiplier: 1.0, instruction: 'Place on medium-low heat with lid open. Steam pressure forces water upward through basket.' },
        { name: 'Crema Sputter & Cold Towel Stop', durationSec: 45, waterMultiplier: 1.0, instruction: 'When honey-gold stream turns pale and begins sputtering, remove from burner immediately and wrap base in cold wet towel.' }
      ]
    },
    {
      id: 'espresso',
      name: 'Espresso (Manual/Semi-Auto)',
      category: 'coffee',
      featured: false,
      heroImage: './espresso_hero.jpg',
      ratio: 2, // 1:2 yield ratio (18g in -> 36g out)
      defaultCupMl: 36,
      tempC: 93,
      tempF: 200,
      grind: 'Extra Fine',
      micron: '200 - 300 µm',
      description: 'Concentrated high-pressure extraction yielding rich crema, heavy body, and intense flavor balance.',
      preferredCoffeeTypes: 'Medium-Dark & Espresso Blends. Brazilian Bourbon & Central American blends for thick hazelnut crema, baker’s chocolate, and sweet caramel notes.',
      phases: [
        { name: 'Pre-Infusion', durationSec: 8, waterMultiplier: 0.5, instruction: 'Gentle low pressure saturation to prevent puck channeling.' },
        { name: 'Main Pressure Extraction', durationSec: 25, waterMultiplier: 1.0, instruction: 'Full 9-bar pressure extraction aiming for 1:2 yield ratio.' }
      ]
    },
    {
      id: 'aeropress',
      name: 'AeroPress (Inverted Method)',
      category: 'coffee',
      featured: false,
      heroImage: './aeropress_hero.jpg',
      ratio: 13,
      defaultCupMl: 220,
      tempC: 88,
      tempF: 190,
      grind: 'Medium-Fine',
      micron: '450 - 550 µm',
      description: 'Versatile hybrid immersion and pressure extraction delivering sweet, clean, low-acidity coffee.',
      preferredCoffeeTypes: 'Light to Medium Roasts. Costa Rican Honey Process, Ethiopian Sidama, and Pink Bourbon for stone fruit, floral, and raw honey sweetness.',
      phases: [
        { name: 'Steep & Agitate', durationSec: 60, waterMultiplier: 1.0, instruction: 'Pour hot water, stir vigorously 10 times, let steep inverted.' },
        { name: 'Cap & Flip Rest', durationSec: 30, waterMultiplier: 1.0, instruction: 'Attach filter cap, carefully flip onto sturdy mug.' },
        { name: 'Gentle Plunge', durationSec: 30, waterMultiplier: 1.0, instruction: 'Apply steady downward pressure until subtle hiss sound.' }
      ]
    }
  ],
  tea: [
    {
      id: 'green_tea',
      name: 'Specialty Green Tea (Dragonwell / Sencha)',
      category: 'tea',
      featured: false,
      heroImage: './tea_ceremony.jpg',
      ratio: 50, // 1g per 50ml water
      defaultCupMl: 200,
      tempC: 78,
      tempF: 172,
      leafGrade: 'Whole Leaf',
      description: 'Delicate low-temp steeping to preserve fresh umami, sweet grassy aromas, and avoid bitter tannins.',
      preferredCoffeeTypes: 'Japanese Sencha & Gyokuro, Chinese West Lake Longjing. Steamed & pan-fired green leaves high in L-theanine amino acids.',
      phases: [
        { name: 'Vessel Preheat', durationSec: 15, waterMultiplier: 0, instruction: 'Warm teapot or glass with warm water, then discard water.' },
        { name: '1st Steeping Infusion', durationSec: 120, waterMultiplier: 1.0, instruction: 'Pour 78°C water gently over leaves. Do not agitate.' },
        { name: 'Decant & 2nd Infusion Prep', durationSec: 90, waterMultiplier: 1.0, instruction: 'Pour completely into server. Leaves ready for 2nd steep.' }
      ]
    },
    {
      id: 'white_tea',
      name: 'White Tea (Silver Needle / White Peony)',
      category: 'tea',
      featured: false,
      heroImage: './tea_kettle.jpg',
      ratio: 60, // 1g per 60ml water
      defaultCupMl: 240,
      tempC: 83,
      tempF: 181,
      leafGrade: 'Buds & Young Leaves',
      description: 'Subtle, sweet, and velvety texture with notes of honeysuckle and soft melon.',
      preferredCoffeeTypes: 'Fujian Silver Needle (Bai Hao Yin Zhen) & White Peony. Whole unoxidized buds rich in delicate melon and honeysuckle floral oils.',
      phases: [
        { name: 'Vessel Preheat', durationSec: 15, waterMultiplier: 0, instruction: 'Warm ceramic teapot with warm water.' },
        { name: 'Long Floral Infusion', durationSec: 180, waterMultiplier: 1.0, instruction: 'Steep untouched at 83°C to unlock delicate essential oils.' },
        { name: 'Decant', durationSec: 30, waterMultiplier: 1.0, instruction: 'Strain fully to prevent over-steeping the leaves.' }
      ]
    },
    {
      id: 'oolong_tea',
      name: 'Oolong Tea (Gongfu Style)',
      category: 'tea',
      featured: false,
      heroImage: './tea_ceremony.jpg',
      ratio: 30, // 1g per 30ml water
      defaultCupMl: 150,
      tempC: 88,
      tempF: 190,
      leafGrade: 'Tightly Rolled Leaf',
      description: 'High-leaf ratio Gongfu steeping revealing evolving layers of orchid florals and roasted honey over multiple infusions.',
      preferredCoffeeTypes: 'Taiwanese High Mountain Alishan, Wuyi Rock Da Hong Pao, Dong Ding Oolong. Hand-rolled oolongs releasing floral butter, lilac, and rock mineral depth.',
      phases: [
        { name: 'Leaf Wash Rinse', durationSec: 10, waterMultiplier: 1.0, instruction: 'Quick 10-second flash pour to wake rolled leaves; discard liquid.' },
        { name: '1st Infusion', durationSec: 45, waterMultiplier: 1.0, instruction: 'Steep 45 seconds at 88°C for rich aroma peak.' },
        { name: '2nd Infusion', durationSec: 60, waterMultiplier: 1.0, instruction: 'Add 15s to steep time. Full floral body unfolding.' }
      ]
    },
    {
      id: 'black_tea',
      name: 'Full-Leaf Black Tea (Darjeeling / Assam)',
      category: 'tea',
      featured: false,
      heroImage: './tea_kettle.jpg',
      ratio: 50, // 1g per 50ml water
      defaultCupMl: 250,
      tempC: 96,
      tempF: 205,
      leafGrade: 'Orthodox Black Leaf',
      description: 'Bold, comforting malt aromas, crisp stone fruit notes, and rich amber liqueur.',
      preferredCoffeeTypes: 'Himalayan First Flush Darjeeling & Brahmaputra Valley Assam. Orthodox whole black leaf offering muscatel grape clarity and rich malty cocoa.',
      phases: [
        { name: 'Warm Teapot', durationSec: 20, waterMultiplier: 0, instruction: 'Rinse teapot with near-boiling water.' },
        { name: 'Full Extraction Steep', durationSec: 240, waterMultiplier: 1.0, instruction: 'Steep at 96°C for 4 minutes for robust body without harshness.' },
        { name: 'Serve & Rest', durationSec: 30, waterMultiplier: 1.0, instruction: 'Remove infuser basket completely.' }
      ]
    },
    {
      id: 'herbal_puerh',
      name: 'Pu-erh / Herbal Infusions (Chamomile / Peppermint / Aged Tea)',
      category: 'tea',
      featured: false,
      heroImage: './tea_ceremony.jpg',
      ratio: 40, // 1g per 40ml water
      defaultCupMl: 250,
      tempC: 98,
      tempF: 208,
      leafGrade: 'Botanicals / Compressed Cakes',
      description: 'Deep, grounding earthiness or soothing caffeine-free botanical infusions.',
      preferredCoffeeTypes: 'Yunnan Aged Cooked Pu-erh (Shou), Chamomile, Peppermint. Deeply fermented tea cakes and whole organic botanicals.',
      phases: [
        { name: 'Boiling Rinse', durationSec: 15, waterMultiplier: 1.0, instruction: 'Flash rinse to hydrate herbs/fermented leaves; discard liquid.' },
        { name: 'Deep Infusion', durationSec: 300, waterMultiplier: 1.0, instruction: 'Steep 5 minutes with boiling water for full extraction.' }
      ]
    }
  ]
};

export const GRIND_VISUAL_GUIDE = [
  {
    id: 'extra_fine',
    name: 'Extra Fine',
    micron: '200 - 300 µm',
    image: './extra_fine_grind.jpg',
    textureComparison: 'Powdered Sugar / Flour',
    visualDensity: 'Ultra-Dense Fine Dust',
    suitableMethods: ['Espresso (9-Bar)', 'Turkish Ibrik'],
    burrSettingTip: 'Setting 1 - 3 on most home burr grinders (Baratza Encore / Fellow Ode Gen 2 with SSP burrs).',
    sensoryImpact: 'High pressure surface area for rapid 25s extraction and rich hazelnut crema.'
  },
  {
    id: 'fine',
    name: 'Fine',
    micron: '350 - 500 µm',
    image: './fine_grind.jpg',
    textureComparison: 'Table Salt',
    visualDensity: 'Granular Table Salt Grains',
    suitableMethods: ['Moka Pot (Stovetop)', 'AeroPress Short Brew'],
    burrSettingTip: 'Setting 4 - 8 on home burr grinders.',
    sensoryImpact: 'Ideal for stovetop steam pressure, creating rich cocoa body without funneled channeling.'
  },
  {
    id: 'medium_fine',
    name: 'Medium-Fine',
    micron: '400 - 600 µm',
    image: './medium_fine_grind.jpg',
    textureComparison: 'Fine Beach Sand / Kosher Salt',
    visualDensity: 'Gritty Fine Sand Grains',
    suitableMethods: ['Pour-Over (V60)', 'Chemex Paper Filter', 'AeroPress Standard'],
    burrSettingTip: 'Setting 9 - 14 on home burr grinders.',
    sensoryImpact: 'Balances paper filter drawdown flow rate with high citric acidity & floral clarity.'
  },
  {
    id: 'medium',
    name: 'Medium',
    micron: '600 - 750 µm',
    image: './medium_grind.jpg',
    textureComparison: 'Coarse Sand / Ground Black Pepper',
    visualDensity: 'Distinct Uniform Sand Grains',
    suitableMethods: ['Automatic Drip Maker', 'Siphon Brewer'],
    burrSettingTip: 'Setting 15 - 20 on home burr grinders.',
    sensoryImpact: 'Optimized for showerhead batch brewing, preventing papery over-extraction.'
  },
  {
    id: 'medium_coarse',
    name: 'Medium-Coarse',
    micron: '750 - 900 µm',
    image: './medium_coarse_grind.jpg',
    textureComparison: 'Coarse Sea Salt',
    visualDensity: 'Visible Coarse Rock Grains',
    suitableMethods: ['Chemex Thick Filter', 'Clever Coffee Dripper'],
    burrSettingTip: 'Setting 21 - 26 on home burr grinders.',
    sensoryImpact: 'Ensures steady flow through heavy paper filters without clogging or stalling.'
  },
  {
    id: 'coarse',
    name: 'Coarse',
    micron: '800 - 1000 µm',
    image: './coarse_grind.jpg',
    textureComparison: 'Cracked Black Pepper / Potting Soil',
    visualDensity: 'Large Chunks & Flakes',
    suitableMethods: ['French Press Immersion', 'Cold Brew Steep (16-24h)'],
    burrSettingTip: 'Setting 27 - 35 on home burr grinders.',
    sensoryImpact: 'Allows long 4+ minute immersion without fine silt slipping past metal mesh filters.'
  }
];

export const COFFEE_BELT_OVERVIEW = {
  title: 'The Coffee Belt',
  description: 'Coffee beans grow worldwide in a tropical zone called the "Coffee Belt," positioned between the Tropics of Cancer (23.5° N) and Capricorn (23.5° S).',
  macroRegions: [
    {
      name: 'Latin America',
      leader: 'Led by Brazil & Colombia',
      characteristics: 'Nutty, chocolatey, smooth low-acidity to high-grown mild Arabica with balanced fruit, caramel, and volcanic soil brightness.'
    },
    {
      name: 'Africa & Middle East',
      leader: 'Led by Ethiopia, Kenya & Yemen',
      characteristics: 'Historic birthplace of Arabica yielding complex wine-like, floral bergamot, savory tomato-like, and wild earthy profiles.'
    },
    {
      name: 'Asia & Pacific',
      leader: 'Led by Vietnam, Indonesia & India',
      characteristics: 'Top Robusta producer Vietnam, heavy-bodied earthy Sumatran wet-hulled beans, and monsoon-shaded low-acid Indian cups.'
    }
  ]
};

export const BOTANICAL_COMPARISON = {
  title: 'Arabica vs. Robusta Beans',
  description: 'Understanding the genetics, chemical composition, and sensory differences between Arabica and Robusta coffee species.',
  arabica: {
    name: 'Arabica (Coffea arabica)',
    share: '60 - 70% of Global Production',
    elevation: '1,200 - 2,200 meters',
    chromosomes: '44 Chromosomes (Tetraploid)',
    caffeine: '1.2% Caffeine content',
    sugarsLipids: '60% More Lipids & Natural Sugars',
    flavorProfile: 'Sweet, floral, fruit-forward acidity, complex aromatics, smooth body.'
  },
  robusta: {
    name: 'Robusta (Coffea canephora)',
    share: '30 - 40% of Global Production',
    elevation: '0 - 800 meters',
    chromosomes: '22 Chromosomes (Diploid)',
    caffeine: '2.7% Caffeine content (Double Strength)',
    sugarsLipids: 'High Chlorogenic Antioxidants, Lower Sugars',
    flavorProfile: 'Strong, dark, bitter chocolate, woody, heavy crema, high body strength.'
  }
};

export const TERROIR_ATLAS = {
  coffee: [
    {
      id: 'brazil',
      country: 'Brazil',
      flag: '🇧🇷',
      macroRegion: 'Latin America (World’s #1 Producer)',
      regions: 'Sul de Minas, Cerrado Mineiro, Mogiana',
      altitude: '800 - 1,200 meters',
      soilType: 'Clay Loam & Terra Rossa Soils',
      climate: 'Stable tropical plateau climate with warm sunny drying weather',
      genetics: 'Bourbon, Mundo Novo, Catuai, Icatu',
      processing: 'Natural Sun-Dried & Pulped Natural (Honey)',
      flavorNotes: ['Nutty Hazelnut', 'Milk Chocolate', 'Sweet Caramel', 'Low Acidity', 'Smooth Creamy Body'],
      acidProfile: 'Low Mellow Citric Acidity',
      agronomyDeepDive: 'Brazil is the world’s largest coffee producer. Grown on rolling plateau hills, dry sunny harvests allow cherries to dry naturally on trees and patios. The seed absorbs sweet fruit mucilage, imparting Brazil’s signature chocolate-hazelnut sweetness, low acidity, and creamy body.',
      roastPairing: 'Medium to Medium-Dark Roast',
      recommendedMethod: 'Automatic Drip, Moka Pot & Espresso',
      sourcedBrands: [
        { name: "Peet's Coffee", offering: 'Brazil Minas Naturais & Major Dickason Blend', note: 'Sun-dried natural with sweet hazelnut, milk chocolate, and smooth finish.' },
        { name: 'Stumptown Coffee Roasters', offering: 'Brazil Fazenda Rainha Yellow Bourbon', note: 'Pulped natural with roasted peanut butter, caramel, and chocolate sweetness.' },
        { name: 'La Colombe Coffee Roasters', offering: 'Brazil Bleu Single Origin', note: 'Creamy medium roast with cocoa nibs, toasted almond, and low acidity.' }
      ]
    },
    {
      id: 'colombia',
      country: 'Colombia',
      flag: '🇨🇴',
      macroRegion: 'Latin America (Famous High-Grown Arabica)',
      regions: 'Huila, Nariño, Antioquia, Tolima',
      altitude: '1,500 - 2,100 meters',
      soilType: 'Andean Volcanic Ash Soils (Andisols) rich in Potassium & Phosphorus',
      climate: 'Equatorial mountain microclimates with dual harvesting seasons (Mitaca harvest)',
      genetics: 'Caturra, Castillo, Colombia, Pink Bourbon, Geisha',
      processing: 'Traditional Fully Washed with 18-36 hour tank fermentation',
      flavorNotes: ['Milk Chocolate', 'Caramel', 'Red Apple Acidity', 'Toasted Pecan', 'Silky Body'],
      acidProfile: 'Medium-High Malic & Tartaric Acidity',
      agronomyDeepDive: 'Famous for high-grown, mild Arabica beans with balanced fruit and caramel notes. Cultivated along high ridges of the Andes cordilleras. Porous volcanic ash soils foster sucrose development, yielding Colombia’s trademark harmony of creamy chocolate body with crisp apple acidity.',
      roastPairing: 'Medium Roast',
      recommendedMethod: 'Automatic Drip Maker, Moka Pot & French Press',
      sourcedBrands: [
        { name: 'Blue Bottle Coffee', offering: 'Single Origin Colombia Tres Santos', note: 'Huila washed Caturra with sweet brown sugar, toasted almond, and red apple acidity.' },
        { name: 'Stumptown Coffee Roasters', offering: 'Colombia El Jordan & San Augustin', note: 'Nariño high-grown lot featuring milk chocolate sweetness and crisp cherry finish.' },
        { name: 'Intelligentsia Coffee', offering: 'Colombia Tres Santos / La Mota', note: 'Washed Pink Bourbon cultivar with delicate pink grapefruit and panela sweetness.' },
        { name: 'La Colombe Coffee Roasters', offering: 'Colombia Corsica & Nariño Reserve', note: 'Smooth medium roast with cocoa nib, dried plum, and velvety mouthfeel.' },
        { name: "Peet's Coffee", offering: 'Colombia San Sebastian Single Origin', note: 'Classic Huila profile with deep milk chocolate, toasted walnut, and balanced body.' }
      ]
    },
    {
      id: 'central_america',
      country: 'Central America (Honduras, Guatemala, Costa Rica)',
      flag: '🇭🇳',
      macroRegion: 'Latin America (Volcanic Soil & Bright Acidity)',
      regions: 'Antigua (Guatemala), Tarrazú (Costa Rica), Copán (Honduras)',
      altitude: '1,400 - 2,000 meters',
      soilType: 'Active Volcanic Pumice Ash & Volcanic Loam',
      climate: 'Shaded volcanic slopes with cool mountain air currents',
      genetics: 'Bourbon, Caturra, Catuai, Pache, Villa Sarchi',
      processing: 'Fully Washed & Honey Processed',
      flavorNotes: ['Bright Citric Acidity', 'Crisp Orange Zest', 'Bittersweet Cocoa', 'Wild Honey', 'Spicy Cinnamon'],
      acidProfile: 'Bright Sparkling Citric Acidity',
      agronomyDeepDive: 'Central America is noted for bright acidity, crisp citrus notes, and rich volcanic-soil profiles. Volcanoes continuously deposit mineral-rich pumice ash. Combined with cool night air, Guatemalan, Honduran, and Costa Rican beans develop dense cell structure yielding bittersweet chocolate depth and orange zest bite.',
      roastPairing: 'Medium Roast',
      recommendedMethod: 'Pour-Over (V60) & French Press',
      sourcedBrands: [
        { name: 'Intelligentsia Coffee', offering: 'Guatemala Los Inmortales & Honduras Santa Barbara', note: 'Antigua Bourbon with dark chocolate fudge, toasted hazelnut, and orange blossom.' },
        { name: "Peet's Coffee", offering: 'Guatemala San Sebastián Antigua', note: 'High volcanic elevation profile with rich bittersweet cocoa, spicy cinnamon, and heavy body.' },
        { name: 'Blue Bottle Coffee', offering: 'Costa Rica Hermosa Honey Process', note: 'Red Honey processed micro-lot with wildflower honey, nectarine, and silky texture.' },
        { name: 'Verve Coffee Roasters', offering: 'Honduras San Vicente & Costa Rica Honey', note: 'Vibrant clementine acidity, dried apricot, and raw honey sweetness.' }
      ]
    },
    {
      id: 'ethiopia',
      country: 'Ethiopia',
      flag: '🇪🇹',
      macroRegion: 'Africa & Middle East (Birthplace of Arabica)',
      regions: 'Yirgacheffe, Sidama, Guji, Harar',
      altitude: '1,800 - 2,200 meters',
      soilType: 'Iron-Rich Volcanic Nitisols & Deep Forest Organic Humus',
      climate: 'Subtropical highland with extreme diurnal temperature swings (25°C days / 8°C nights)',
      genetics: 'Indigenous Wild Heirloom Arabica Landraces (Kurume, Dega, Wolisho)',
      processing: 'Fully Washed (citric clarity) & Natural Sun-Dried on Raised African Beds (berry fruitiness)',
      flavorNotes: ['Jasmine Floral', 'Bergamot Citrus', 'Wild Blueberry', 'Peach Nectar', 'Tea-like Body'],
      acidProfile: 'High Citric & Floral Phosphoric Acidity',
      agronomyDeepDive: 'The historic birthplace of Arabica coffee, yielding complex, wine-like, floral, and bright berry flavors. Extreme altitude slows cherry maturation to over 9 months. Cold mountain nights cause coffee trees to store dense sugars and complex organic acids, producing unmatched bergamot density and tea-like elegance.',
      roastPairing: 'Light to Medium-Light Roast (Nordic / Modern Specialty)',
      recommendedMethod: 'Pour-Over (V60 / Chemex)',
      sourcedBrands: [
        { name: 'Counter Culture Coffee', offering: 'Apollo & Single Origin Ethiopia Yirgacheffe', note: 'Clean washed lot featuring sparkling Meyer lemon, jasmine floral aroma, and bergamot finish.' },
        { name: 'Stumptown Coffee Roasters', offering: 'Ethiopia Mordecofe & Duromina', note: 'Washed Yirgacheffe with peach tea clarity and delicate floral honeysuckle finish.' },
        { name: 'Blue Bottle Coffee', offering: 'Single Origin Ethiopia Guji & Three Africas', note: 'Sun-dried natural processed Guji with intense wild blueberry jam sweetness and syrupy body.' },
        { name: 'Onyx Coffee Lab', offering: 'Ethiopia Tropical Weather & Worka Sakaro', note: 'Anaerobic & double-fermented heirloom cherries boasting candied papaya and jasmine.' },
        { name: 'Intelligentsia Coffee', offering: 'Organic Ethiopia Kurimi', note: 'Clean washed Sidama with crisp citric acidity, nectarine, and floral bergamot.' }
      ]
    },
    {
      id: 'kenya',
      country: 'Kenya',
      flag: '🇰🇪',
      macroRegion: 'Africa & Middle East (Savory & Vibrant Citrus)',
      regions: 'Nyeri, Kirinyaga, Mount Kenya, Murang’a',
      altitude: '1,700 - 2,100 meters',
      soilType: 'Deep Red Volcanic Clay Soils (Rhodic Nitisols) rich in Phosphoric Acid',
      climate: 'Bimodal rainfall pattern with distinct hot sun and cool mountain mist cycles',
      genetics: 'SL-28, SL-34 (Scott Laboratories selections), Ruiru 11, Batian',
      processing: 'Kenyan 72-Hour Double Washed Process with soaking stage',
      flavorNotes: ['Blackcurrant', 'Juicy Grapefruit', 'Savory Tomato-like Note', 'Complex Winey Acidity', 'Cane Sugar'],
      acidProfile: 'Pungent Phosphoric & Tartaric Acidity',
      agronomyDeepDive: 'Renowned for savory, tomato-like, and vibrant citrus-heavy flavor profiles. Kenya’s red volcanic clay soils are packed with accessible phosphoric acid. The legendary SL-28 and SL-34 Bourbon cultivars combined with 72-hour double washing create Kenya’s world-famous sparkling blackcurrant flavor and winey complexity.',
      roastPairing: 'Light to Medium-Light Roast',
      recommendedMethod: 'Pour-Over (Chemex / V60)',
      sourcedBrands: [
        { name: 'Onyx Coffee Lab', offering: 'Kenya Gakuyu-ini & Nyeri Hill AA', note: 'Double-washed SL-28 with exploding blackcurrant, ruby red grapefruit, and cane sugar.' },
        { name: 'Square Mile Coffee Roasters', offering: 'Kenya AA Karatu & Kiandu', note: 'London roaster classic with juicy blackberry, savory tomato leaf, and sparkling acidity.' },
        { name: 'Counter Culture Coffee', offering: 'Kenya Baragwi & Kabingara', note: 'Bright Nyeri lot with red currant, tart cherry, and complex winey structure.' },
        { name: 'George Howell Coffee', offering: 'Kenya Mamuto AA Single Origin', note: 'Ultra-clean single estate Kenya with dense blackcurrant jam and grapefruit zest.' }
      ]
    },
    {
      id: 'yemen',
      country: 'Yemen',
      flag: '🇾🇪',
      macroRegion: 'Africa & Middle East (Historic Ancient Mocha)',
      regions: 'Bani Mattar, Haraaz, Dhamar',
      altitude: '1,800 - 2,400 meters',
      soilType: 'Dry Arid Terraced Mountain Soil',
      climate: 'Arid high-mountain climate with extreme water scarcity',
      genetics: 'Ancient Mocha Heirloom Landraces (Udaini, Dawairi, Jaadi)',
      processing: 'Traditional Dry Natural Sun-Drying on stone rooftops',
      flavorNotes: ['Deep Earthy Cedar', 'Wild Cardamom Spice', 'Dark Bittersweet Cocoa', 'Dried Fig', 'Winey Depth'],
      acidProfile: 'Pungent Rustic Malic Acidity',
      agronomyDeepDive: 'Yemen is the historic producer of deep, earthy, and wild-tasting traditional coffees. Grown on ancient stone mountain terraces built over 1,000 years ago, severe water scarcity forces trees to concentrate deep spice, dried fruit, cardamom, and dark chocolate flavor notes into tiny, dense seeds.',
      roastPairing: 'Medium Roast',
      recommendedMethod: 'Moka Pot, French Press & Turkish Brew',
      sourcedBrands: [
        { name: 'George Howell Coffee', offering: 'Yemen Haraaz Red Mahal Aqeeq', note: 'Historic terraced lot featuring wild dried fig, cardamom spice, and bittersweet cocoa.' },
        { name: 'Equator Coffees', offering: 'Yemen Mocha Matari', note: 'Traditional dry natural with deep earthiness, dark chocolate, and rustic winey body.' },
        { name: 'Portola Coffee Roasters', offering: 'Yemen Bani Mattar Single Origin', note: 'Exotic ancient landrace with clove, dried date, and complex pungent acidity.' }
      ]
    },
    {
      id: 'vietnam',
      country: 'Vietnam',
      flag: '🇻🇳',
      macroRegion: 'Asia & Pacific (Top Global Robusta Producer)',
      regions: 'Central Highlands (Buôn Ma Thuột, Đắk Lắk, Lâm Đồng)',
      altitude: '500 - 1,000 meters',
      soilType: 'Basaltic Volcanic Red Soils',
      climate: 'Tropical monsoon climate with high heat and wet season humidity',
      genetics: 'Coffea canephora (High-Caffeine Robusta Cultivars)',
      processing: 'Natural Sun-Dried & Mechanical Drying',
      flavorNotes: ['Strong Dark Chocolate', 'Roasted Walnut', 'Woody Cedar', 'Heavy Crema', 'Bold Bitter Strength'],
      acidProfile: 'Very Low Acidity',
      agronomyDeepDive: 'Vietnam is the top global producer of Robusta beans, providing a strong, dark, and bitter profile. Grown in the volcanic red soils of the Central Highlands, Vietnam’s high-caffeine Robusta beans produce heavy crema, bold chocolate body, and woody strength—the backbone of traditional Vietnamese Phin iced coffee.',
      roastPairing: 'Dark Roast',
      recommendedMethod: 'Moka Pot & Vietnamese Phin Filter',
      sourcedBrands: [
        { name: 'Nguyen Coffee Supply', offering: 'Loyal 100% Robusta & Grit Blend', note: 'Brooklyn roaster pioneering specialty Vietnamese Robusta with hazelnut, scotch, and thick crema.' },
        { name: 'Copper Cow Coffee', offering: 'Vietnamese Classic Pour-Over', note: 'Sourced directly from Đà Lạt farmers with dark chocolate and roasted nut strength.' }
      ]
    },
    {
      id: 'indonesia',
      country: 'Indonesia (Sumatra, Java)',
      flag: '🇮🇩',
      macroRegion: 'Asia & Pacific (Heavy-Bodied Earthy Profiles)',
      regions: 'Sumatra (Gayo Highlands/Mandheling), Java, Toraja Sulawesi',
      altitude: '1,100 - 1,600 meters',
      soilType: 'Volcanic Tropical Humus with clay subsoil',
      climate: 'Equatorial tropical rainforest with year-round high humidity & heavy rainfall',
      genetics: 'Ateng, Tim Tim, Bergendal, Line S795 (Arabica Hybrids)',
      processing: 'Traditional Wet-Hulled (Giling Basah) Process',
      flavorNotes: ['Earthy Cedar', 'Dark Cocoa', 'Pipe Tobacco', 'Low Acidity', 'Syrupy Heavy Body'],
      acidProfile: 'Low Acidity with Heavy Lipids',
      agronomyDeepDive: 'Famous for heavy-bodied, low-acidity, earthy, and spicy profiles. Indonesia’s iconic Giling Basah (wet-hulling) technique hulls parchment at 30-50% moisture. The green beans dry exposed directly to humid tropical air, undergoing unique microbial action that mutes acidity and imparts heavy cedar, cocoa, and dense syrupy mouthfeel.',
      roastPairing: 'Medium-Dark to Dark Roast',
      recommendedMethod: 'French Press & Moka Pot',
      sourcedBrands: [
        { name: "Peet's Coffee", offering: 'Sumatra Reserve Single Origin & Major Dickason\'s', note: 'Classic Giling Basah profile with deep herbal cedar, dark cocoa, and thick syrupy body.' },
        { name: 'La Colombe Coffee Roasters', offering: 'Sumatra Mandheling Single Origin', note: 'Dark roast Gayo lot featuring pipe tobacco, dark chocolate truffle, and zero harshness.' },
        { name: 'Starbucks Reserve', offering: 'Sumatra Aged Single Origin', note: 'Aged 3-5 years in Singapore warehouses to develop deep rustic spice and wood notes.' },
        { name: 'Stumptown Coffee Roasters', offering: 'Sumatra Bies Penantan', note: 'Organic Gayo Highlands washed & wet-hulled hybrid with cedar, grapefruit rind, and cacao.' }
      ]
    },
    {
      id: 'india',
      country: 'India',
      flag: '🇮🇳',
      macroRegion: 'Asia & Pacific (Monsoon-Shaded Low Acid Cups)',
      regions: 'Baba Budangiri (Karnataka), Coorg, Nilgiri Hills',
      altitude: '1,000 - 1,500 meters',
      soilType: 'Rich Forest Loam with Spice Plantation Intercropping',
      climate: 'Monsoon climate with shaded forest canopy microclimates',
      genetics: 'S795, Selection 9, Kent Arabica',
      processing: 'Monsooned Process (Monsooned Malabar) & Washed',
      flavorNotes: ['Mild Low Acid', 'Warm Cardamom', 'Sweet Nutmeg', 'Malty Cocoa', 'Velvety Body'],
      acidProfile: 'Ultra-Low Acidity',
      agronomyDeepDive: 'India’s coffee is grown under monsoon shades (intercropped with cardamom, pepper, and cinnamon), offering mild and low-acid cups. In Monsooned Malabar processing, dry beans are exposed to humid monsoon winds for 3-4 months, expanding the beans and turning them golden while reducing acidity to near zero.',
      roastPairing: 'Medium Roast',
      recommendedMethod: 'Moka Pot & French Press',
      sourcedBrands: [
        { name: 'Blue Tokai Coffee Roasters', offering: 'India Monsooned Malabar & Attikan Estate', note: 'India’s leading specialty roaster with mild cocoa, warm nutmeg, and velvety low acidity.' },
        { name: 'Josuma Coffee', offering: 'Super Malabar Monsooned Arabica', note: 'Specialty Monsooned Malabar with rich crema, baker’s chocolate, and sweet spice finish.' }
      ]
    }
  ]
};

export const MASTERCLASSES = [
  // Moka Pot Videos (methodId: 'moka_pot')
  {
    id: 'mc_mokapot_bialetti',
    methodId: 'moka_pot',
    method: 'Moka Pot',
    title: 'Mastering the Stovetop Moka Pot (Bialetti Technique & Water Preheat)',
    duration: '5:15',
    thumbnail: './moka_pot_hero.jpg',
    embedId: 'ry9z3bNbu8E',
    description: 'Learn how preheating water in the lower chamber and stopping extraction with a cold towel prevents metallic burnt bitterness in Moka Pot coffee.',
    keyTakeaways: [
      'Fill lower chamber with boiling water to prevent overheating coffee grounds',
      'Do not tamp grounds tightly in funnel basket',
      'Wrap base in cold wet towel immediately when sputtering begins'
    ]
  },
  {
    id: 'mc_mokapot_beans',
    methodId: 'moka_pot',
    method: 'Moka Pot',
    title: 'Preferred Coffee Beans & Fine-Medium Grind for Moka Pot',
    duration: '4:20',
    thumbnail: './moka_pot_hero.jpg',
    embedId: 'ry9z3bNbu8E',
    description: 'Why medium-dark Italian roasts, Brazilian Yellow Bourbon, and 350-500 µm table salt grinds produce rich crema and syrupy espresso-like body.',
    keyTakeaways: [
      'Grind slightly coarser than espresso (table salt texture)',
      'Choose low-acidity beans rich in dark chocolate & toasted hazelnut notes'
    ]
  },

  // French Press Videos (methodId: 'french_press')
  {
    id: 'mc_frenchpress_hoffmann',
    methodId: 'french_press',
    method: 'French Press',
    title: 'Ultimate French Press: Crust Breaking & Silt Skimming',
    duration: '5:30',
    thumbnail: './french_press.jpg',
    embedId: 'st571DYYTR8',
    description: 'Master the James Hoffmann immersion technique: 4-minute steep, gently breaking the crust, and skimming foam for a crystal-clean body.',
    keyTakeaways: [
      'Stir top crust gently after 4 minutes',
      'Skim floating crema and white foam with two spoons',
      'Rest 5 additional minutes without pressing down'
    ]
  },
  {
    id: 'mc_frenchpress_roasts',
    methodId: 'french_press',
    method: 'French Press',
    title: 'Preferred Coffee Beans & Roasts for French Press',
    duration: '4:12',
    thumbnail: './french_press.jpg',
    embedId: 'T1U1XfF0EFA',
    description: 'Learn why heavy-bodied Sumatran Giling Basah, Brazilian Yellow Bourbon, and medium-dark roasts shine best in immersion brewing.',
    keyTakeaways: [
      'Choose low-acidity beans rich in natural oils and cocoa depth',
      'Coarse grind size prevents metal mesh clogging',
      'Pairs best with dark chocolate & toasted nut profiles'
    ]
  },

  // Pour-Over Videos (methodId: 'pour_over')
  {
    id: 'mc_pourover_v60',
    methodId: 'pour_over',
    method: 'Pour-Over',
    title: 'Pour-Over Concentric Pouring & V60 Technique',
    duration: '4:15',
    thumbnail: './pour_over_hero.jpg',
    embedId: '1oB1oDrDkHM',
    description: 'Learn how spiral pour rate, bed height, and water turbulence dictate extraction clarity in V60 and Chemex drippers.',
    keyTakeaways: [
      'Pour gently in center-outward concentric spirals',
      'Never hit paper walls directly to prevent water bypass',
      'Maintain steady thermal mass during bloom'
    ]
  },
  {
    id: 'mc_pourover_beans',
    methodId: 'pour_over',
    method: 'Pour-Over',
    title: 'Preferred Single-Origin Beans for Pour-Over Clarity',
    duration: '5:04',
    thumbnail: './pour_over_hero.jpg',
    embedId: 'JgV6qL0Fi6E',
    description: 'Discover why high-altitude washed Ethiopian Yirgacheffe and Kenyan SL-28 excel under paper filter filtration.',
    keyTakeaways: [
      'Highlight sparkling citric acidity and jasmine bergamot florals',
      'Paper filter captures oils for tea-like body clarity',
      'Ideal for light to medium-light Nordic specialty roasts'
    ]
  },

  // Drip Coffee Maker Videos (methodId: 'drip_brewer')
  {
    id: 'mc_drip_home',
    methodId: 'drip_brewer',
    method: 'Automatic Drip',
    title: 'Maximizing Your Home Drip Coffee Machine',
    duration: '3:45',
    thumbnail: './drip_brewer.jpg',
    embedId: '8d-9Y2S92v0',
    description: 'Simple tweaks to get cafe-quality batch brew from standard home electric coffee makers.',
    keyTakeaways: [
      'Pre-rinse paper filters to eliminate papery taste',
      'Level coffee bed evenly before starting brew cycle',
      'Use filtered water with 120-150 ppm mineral content'
    ]
  },

  // Espresso Videos (methodId: 'espresso')
  {
    id: 'mc_espresso_prep',
    methodId: 'espresso',
    method: 'Espresso',
    title: 'Espresso Puck Prep, WDT & 9-Bar Extraction',
    duration: '6:20',
    thumbnail: './espresso_hero.jpg',
    embedId: '1U_4OqUo_pE',
    description: 'Master WDT needle distribution, level tamping, and dialing-in 1:2 extraction yields.',
    keyTakeaways: [
      'Eliminate puck clumps with WDT needle distribution',
      'Tamp level with 30 lbs of firm pressure',
      'Aim for 1:2 yield ratio in 25-30 seconds'
    ]
  },

  // AeroPress Videos (methodId: 'aeropress')
  {
    id: 'mc_aeropress_inverted',
    methodId: 'aeropress',
    method: 'AeroPress',
    title: 'Inverted AeroPress Champion Technique',
    duration: '4:40',
    thumbnail: './aeropress_hero.jpg',
    embedId: 'j6VlT_jUVPc',
    description: 'The inverted steep and gentle press method for sweet, zero-acidity cups.',
    keyTakeaways: [
      'Steep inverted for 60 seconds with 10 vigorous stirs',
      'Attach filter cap and flip carefully onto sturdy mug',
      'Plunge slowly over 30 seconds until subtle hiss'
    ]
  },

  // Green Tea Videos (methodId: 'green_tea')
  {
    id: 'mc_green_steeping',
    methodId: 'green_tea',
    method: 'Green Tea',
    title: 'Specialty Green Tea & Sencha Steeping Masterclass',
    duration: '4:10',
    thumbnail: './tea_ceremony.jpg',
    embedId: 'XpZ1ZpQ4pQE',
    description: 'Low-temperature 78°C steeping to preserve sweet grassy umami and avoid bitter tannin extraction.',
    keyTakeaways: [
      'Never use boiling water on green tea leaves',
      'Steep for 2 minutes untouched',
      'Decant completely between infusions'
    ]
  },

  // White Tea Videos (methodId: 'white_tea')
  {
    id: 'mc_white_needle',
    methodId: 'white_tea',
    method: 'White Tea',
    title: 'White Tea & Silver Needle Steeping Masterclass',
    duration: '4:25',
    thumbnail: './tea_kettle.jpg',
    embedId: 'XpZ1ZpQ4pQE',
    description: 'Unlocking honeysuckle floral essential oils in Fujian Silver Needle (Bai Hao Yin Zhen) leaves.',
    keyTakeaways: [
      'Steep at 83°C for 3 minutes without leaf agitation',
      'Whole unoxidized buds release delicate melon sweetness'
    ]
  },

  // Oolong Tea Videos (methodId: 'oolong_tea')
  {
    id: 'mc_gongfu_oolong',
    methodId: 'oolong_tea',
    method: 'Oolong Tea',
    title: 'Gongfu Oolong Tea Washing & Flash Infusions',
    duration: '4:50',
    thumbnail: './tea_ceremony.jpg',
    embedId: 'L6N463xM4R4',
    description: 'Understand leaf awakening, gaiwan handling, temperature drop, and timing multi-steep oolongs.',
    keyTakeaways: [
      'Rinse leaves for 5-10s to open rolled tea balls',
      'Pour water down gaiwan rim to avoid burning delicate leaves',
      'Increase steep time by 5-10 seconds per subsequent infusion'
    ]
  },

  // Black Tea Videos (methodId: 'black_tea')
  {
    id: 'mc_black_darjeeling',
    methodId: 'black_tea',
    method: 'Black Tea',
    title: 'Full-Leaf Black Tea & Himalayan Darjeeling Masterclass',
    duration: '4:45',
    thumbnail: './tea_kettle.jpg',
    embedId: 'XpZ1ZpQ4pQE',
    description: 'Steeping Himalayan First Flush Darjeeling for muscatel grape clarity and Assam for malty cocoa body.',
    keyTakeaways: [
      'Steep Orthodox black tea leaves at 96°C for 4 minutes',
      'Preheat ceramic teapot to retain high steeping thermal mass'
    ]
  },

  // Herbal & Pu-erh Videos (methodId: 'herbal_puerh')
  {
    id: 'mc_puerh_herbal',
    methodId: 'herbal_puerh',
    method: 'Herbal & Pu-erh',
    title: 'Aged Pu-erh Tea Cake Washing & Botanical Infusions',
    duration: '5:10',
    thumbnail: './tea_ceremony.jpg',
    embedId: 'L6N463xM4R4',
    description: 'Flash boiling rinse for compressed Yunnan Pu-erh tea cakes and long botanical chamomile steepings.',
    keyTakeaways: [
      'Boiling 98°C flash rinse to hydrate compressed tea cakes',
      'Steep 5 full minutes for deep earthy and botanical extraction'
    ]
  }
];

export const TROUBLESHOOTING_GUIDE = {
  coffee: [
    {
      id: 'sour',
      symptom: 'Sour, Sharp, or Hollow Taste',
      cause: 'Under-Extraction (Water dissolved sweet caramel compounds too quickly without completing balanced extraction)',
      remedies: [
        'Grind Setting: Adjust 1-2 notches FINER to increase surface area',
        'Water Temp: Increase water temperature by +2°C to +3°C',
        'Brew Time: Extend bloom phase or pour slower',
        'Ratio: Increase water volume slightly or decrease dry coffee dose'
      ]
    },
    {
      id: 'bitter',
      symptom: 'Bitter, Harsh, or Dry (Astringent) Finish',
      cause: 'Over-Extraction (Water pulled bitter plant fibers and heavy tannins out of coffee bed)',
      remedies: [
        'Grind Setting: Adjust 1-2 notches COARSER to decrease contact time',
        'Water Temp: Lower water temperature by -2°C to -4°C',
        'Agitation: Reduce heavy stirring or aggressive pour rate',
        'Steep Time: Shorten total brew time'
      ]
    },
    {
      id: 'flat',
      symptom: 'Flat, Dull, or Muted Flavor Profile',
      cause: 'Stale Coffee Beans (21+ days post-roast), Papery Filter Taste, or Off-Gas Loss',
      remedies: [
        'Coffee Freshness: Use beans 7-21 days post-roast date',
        'Filter Rinse: Always pre-rinse paper filters with boiling water before adding coffee grounds',
        'Water Quality: Check water filtration (target TDS 120-150 ppm)'
      ]
    },
    {
      id: 'weak',
      symptom: 'Weak, Watery, or Thin Body',
      cause: 'Low Coffee-to-Water Ratio or Severe Bed Channeling',
      remedies: [
        'Ratio Target: Adjust ratio closer (e.g. shift from 1:17 to 1:15)',
        'Bed Distribution: Tap side of dripper/basket to level coffee bed evenly before pouring',
        'Bypass Prevention: Avoid pouring directly onto paper filter edges'
      ]
    }
  ],
  tea: [
    {
      id: 'bitter',
      symptom: 'Bitter, Harsh, or Astringent Infusion',
      cause: 'Over-Steeping or Water Temperature Too High (Scalding delicate green or white tea leaves)',
      remedies: [
        'Water Temp: Drop water temperature (e.g. use 75°C - 80°C for Green tea; 83°C for White tea)',
        'Steep Time: Reduce steep time by 30 - 60 seconds',
        'Leaf Decanting: Strain liquid completely away from leaves between infusions to stop steeping'
      ]
    },
    {
      id: 'sour',
      symptom: 'Sour, Grassy, or Weak Floral Notes',
      cause: 'Under-Steeping or Water Temperature Too Cold (Failing to unlock complex essential oils)',
      remedies: [
        'Water Temp: Increase water temperature by +3°C to +5°C',
        'Steep Time: Extend steeping duration by 45 - 60 seconds',
        'Leaf Expansion: Give rolled leaves a 10s hot water flash rinse to help them uncurl'
      ]
    },
    {
      id: 'flat',
      symptom: 'Flat, Dull, or Metallic Tea Liqueur',
      cause: 'Stale Loose Tea Leaves, Poor Water Filtration, or Stagnant Tap Water',
      remedies: [
        'Leaf Freshness: Store loose tea in airtight, opaque tins away from light and humidity',
        'Fresh Boiling: Always use fresh cold water; do not re-boil stagnant water multiple times',
        'Water Hardness: Use filtered water to prevent mineral cloudiness'
      ]
    },
    {
      id: 'weak',
      symptom: 'Weak, Thin, or Flavorless Cup',
      cause: 'Low Leaf-to-Water Ratio or Cold Vessel Steeping',
      remedies: [
        'Leaf Quantity: Add +1g of tea leaves or reduce water volume',
        'Vessel Preheat: Warm teapot, gaiwan, or ceramic mug with hot water before steeping',
        'Whole Leaf Room: Use a spacious infuser basket so leaves can fully expand'
      ]
    }
  ]
};
