export const BREW_METHODS = {
  coffee: [
    {
      id: 'classic_pour_over',
      name: 'Flat-Bottom Pour Over (Kalita)',
      category: 'coffee',
      featured: true,
      heroImage: '/pourover_technique_thumb.jpg',
      ratio: 16, // 1:16 ratio (1g coffee to 16ml water)
      defaultCupMl: 240,
      tempC: 93,
      tempF: 200,
      grind: 'Medium',
      micron: '550 - 700 µm',
      description: 'Flat-bed geometry with 3-hole restricted drainage for uniform extraction, rich sweetness, and forgiving brew dynamics.',
      preferredCoffeeTypes: 'Medium & Light-Medium Roasts. Central American, Colombian, and balanced washed coffees for caramel, milk chocolate, and ripe stone fruit sweetness.',
      phases: [
        { name: 'Bloom Phase', durationSec: 45, waterMultiplier: 3, instruction: 'Saturate grounds evenly with 3x coffee weight in circular motion. Let coffee bloom and de-gas.' },
        { name: 'First Pulse Pour', durationSec: 45, waterMultiplier: 0.5, instruction: 'Pour in gentle spirals from center outward to raise the slurry level evenly.' },
        { name: 'Second Pulse Pour', durationSec: 45, waterMultiplier: 0.8, instruction: 'Pour second pulse in steady circles, maintaining consistent slurry temperature.' },
        { name: 'Final Drawdown', durationSec: 60, waterMultiplier: 1.0, instruction: 'Top up final water in center. Allow even flat-bed drawdown.' }
      ]
    },
    {
      id: 'pour_over',
      name: 'Hario V60 Dripper',
      category: 'coffee',
      featured: false,
      heroImage: '/pour_over_hero.jpg',
      ratio: 16, // 1:16 Golden Ratio (1g coffee to 16ml water)
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
      id: 'chemex',
      name: 'Chemex Glass Brewer',
      category: 'coffee',
      featured: false,
      heroImage: '/chemex_hero.jpg',
      ratio: 16, // 1:16 ratio
      defaultCupMl: 250,
      tempC: 94,
      tempF: 201,
      grind: 'Medium-Coarse',
      micron: '650 - 800 µm',
      description: 'Ultra-clean, elegant pour over extraction utilizing thick bonded paper filters to filter out all sediment and bitter oils for exceptional clarity.',
      preferredCoffeeTypes: 'Light to Medium Roasts. Washed Ethiopian, Kenyan, and Costa Rican single-origin beans for crisp fruit acidity and sweet floral finish.',
      phases: [
        { name: 'Bloom Phase', durationSec: 45, waterMultiplier: 3, instruction: 'Saturate grounds with 3x coffee weight. Allow heavy bloom for 45 seconds.' },
        { name: 'Slow Spiral Pulse Pour', durationSec: 90, waterMultiplier: 0.7, instruction: 'Pour in slow steady spirals avoiding the outer glass filter rim.' },
        { name: 'Final Drawdown & Filter Lift', durationSec: 105, waterMultiplier: 1.0, instruction: 'Allow complete drawdown through thick paper filter. Lift filter and discard.' }
      ]
    },
    {
      id: 'french_press',
      name: 'French Press (Immersion)',
      category: 'coffee',
      featured: false,
      heroImage: '/french_press.jpg',
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
      heroImage: '/drip_brewer.jpg',
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
      heroImage: '/moka_pot_hero.jpg',
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
      heroImage: '/espresso_hero.jpg',
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
      heroImage: '/aeropress_hero.jpg',
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
  ]
};

export const GRIND_VISUAL_GUIDE = [
  {
    id: 'extra_fine',
    name: 'Extra Fine',
    micron: '200 - 300 µm',
    image: '/extra_fine_grind.jpg',
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
    image: '/fine_grind.jpg',
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
    image: '/medium_fine_grind.jpg',
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
    image: '/medium_grind.jpg',
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
    image: '/medium_coarse_grind.jpg',
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
    image: '/coarse_grind.jpg',
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
      id: 'guatemala',
      country: 'Guatemala',
      flag: '🇬🇹',
      macroRegion: 'Central America (Volcanic Pumice & Cocoa)',
      regions: 'Antigua Valley, Huehuetenango, Atitlán, Fraijanes',
      altitude: '1,500 - 2,000 meters',
      soilType: 'Active Volcanic Pumice Ash & Mineral-Rich Loam',
      climate: 'Cool mountain shade surrounded by three active volcanoes (Agua, Fuego, Acatenango)',
      genetics: 'Bourbon, Caturra, Catuai, Typica, Pache',
      processing: 'Traditional Fully Washed with clear mountain spring water',
      flavorNotes: ['Bittersweet Cocoa', 'Crisp Orange Zest', 'Toasted Hazelnut', 'Spicy Cinnamon', 'Panela Sugar'],
      acidProfile: 'Crisp Sparkling Citric Acidity',
      agronomyDeepDive: 'Guatemala’s Antigua and Huehuetenango regions are world-famous for dense volcanic-soil coffees. Dense pumice ash from nearby active volcanoes retains moisture during dry spells, while cool night air at 1,800+ meters slows cherry ripening to yield complex bittersweet chocolate and orange zest notes.',
      roastPairing: 'Medium Roast',
      recommendedMethod: 'Pour-Over (V60 / Chemex) & French Press',
      sourcedBrands: [
        { name: 'Intelligentsia Coffee', offering: 'Guatemala Los Inmortales Antigua', note: 'Antigua Bourbon with dark chocolate fudge, toasted hazelnut, and orange blossom.' },
        { name: "Peet's Coffee", offering: 'Guatemala San Sebastián Antigua', note: 'High volcanic elevation profile with rich bittersweet cocoa, spicy cinnamon, and heavy body.' },
        { name: 'Stumptown Coffee Roasters', offering: 'Guatemala El Injerto & Bella Vista', note: 'Washed Caturra boasting red apple acidity, milk chocolate, and velvety sweetness.' }
      ]
    },
    {
      id: 'costa_rica',
      country: 'Costa Rica',
      flag: '🇨🇷',
      macroRegion: 'Central America (Pioneering Honey Process)',
      regions: 'Tarrazú Valley, Central Valley, West Valley, Orosi',
      altitude: '1,400 - 1,900 meters',
      soilType: 'Acidic Volcanic Ash & Rich Tropical Soil',
      climate: 'Distinct wet and dry seasons with high mountain sunshine',
      genetics: 'Caturra, Catuai, Villa Sarchi, Geisha, SL-28',
      processing: 'Red & Yellow Honey Process, Micro-Mill Washed',
      flavorNotes: ['Wildflower Honey', 'White Peach', 'Nectarine', 'Crisp Red Apple', 'Silky Body'],
      acidProfile: 'Vibrant Malic & Citric Acidity',
      agronomyDeepDive: 'Costa Rica’s Tarrazú Valley is a global pioneer in specialty micro-mills and Honey processing. By leaving sticky fruit mucilage on the seed while drying on raised African beds, Costa Rican coffees develop intense honeysuckle sweetness, delicate peach acidity, and a silky smooth mouthfeel.',
      roastPairing: 'Light-Medium Roast',
      recommendedMethod: 'Pour-Over (V60) & AeroPress',
      sourcedBrands: [
        { name: 'Blue Bottle Coffee', offering: 'Costa Rica Hermosa Honey Process', note: 'Red Honey processed micro-lot with wildflower honey, nectarine, and silky texture.' },
        { name: 'Verve Coffee Roasters', offering: 'Costa Rica Las Lajas Yellow Honey', note: 'Vibrant clementine acidity, dried apricot, and raw honey sweetness.' },
        { name: 'Counter Culture Coffee', offering: 'Costa Rica Perla del Café', note: 'Clean Tarrazú lot with red apple, Meyer lemon, and brown sugar finish.' }
      ]
    },
    {
      id: 'honduras',
      country: 'Honduras',
      flag: '🇭🇳',
      macroRegion: 'Central America (High Mountain Organic Crops)',
      regions: 'Copán, Santa Bárbara, Montecillos, Opalaca',
      altitude: '1,400 - 1,850 meters',
      soilType: 'Clay Loam & High Mountain Pine Forest Soil',
      climate: 'Humid mountain microclimates with dense cloud forest fog',
      genetics: 'Parainema, Caturra, Catuai, Bourbon, Pacas',
      processing: 'Fully Washed & Natural Sun-Dried',
      flavorNotes: ['Dark Chocolate Fudge', 'Red Plum', 'Brown Sugar', 'Cinnamon Spice', 'Creamy Body'],
      acidProfile: 'Smooth Balanced Citric Acidity',
      agronomyDeepDive: 'Honduras is Central America’s top coffee exporter by volume, with Santa Bárbara and Copán yielding competition-grade microlots. Grown in high cloud forest soils, Honduran Parainema and Caturra cultivars produce deep brown sugar sweetness, plum acidity, and rich cocoa body.',
      roastPairing: 'Medium Roast',
      recommendedMethod: 'Automatic Drip, Moka Pot & French Press',
      sourcedBrands: [
        { name: 'Onyx Coffee Lab', offering: 'Honduras Santa Bárbara & San Vicente', note: 'Washed Pacas with rich brown sugar, dark plum, and creamy milk chocolate.' },
        { name: 'Intelligentsia Coffee', offering: 'Honduras Santa Lucia Single Origin', note: 'High elevation lot with sweet red cherry, toasted pecan, and silky finish.' }
      ]
    },
    {
      id: 'el_salvador',
      country: 'El Salvador',
      flag: '🇸🇻',
      macroRegion: 'Central America (Heirloom Pacamara & Bourbon)',
      regions: 'Apaneca-Ilamatepec Mountain Range, Santa Ana Volcano',
      altitude: '1,350 - 1,800 meters',
      soilType: 'Rich Volcanic Pumice & Dark Humus Soil',
      climate: 'Pacific mountain breeze with cool tropical nights',
      genetics: 'Pacamara (Maragogype x Pacas hybrid), Red Bourbon, Orange Bourbon',
      processing: 'Traditional Fully Washed & Sun-Dried Naturals',
      flavorNotes: ['Sweet Cane Sugar', 'Juicy Red Cherry', 'Baker’s Chocolate', 'Toasted Almond', 'Full Creamy Body'],
      acidProfile: 'Juicy Tartaric Acidity',
      agronomyDeepDive: 'El Salvador is famous for preserving historic 100% heirloom Red Bourbon and giant Pacamara cultivars. Cultivated along the volcanic slopes of Santa Ana, Pacamara’s oversized seeds yield complex tropical fruitiness, buttery body, and baker’s chocolate richness.',
      roastPairing: 'Medium Roast',
      recommendedMethod: 'French Press, Moka Pot & Pour-Over',
      sourcedBrands: [
        { name: 'Stumptown Coffee Roasters', offering: 'El Salvador Santa Ana Bourbon', note: 'Heirloom Red Bourbon with sweet cane sugar, juicy cherry, and baker’s chocolate.' },
        { name: 'Verve Coffee Roasters', offering: 'El Salvador Los Pirineos Pacamara', note: 'Famous Santa Ana estate with tropical papaya, red plum, and creamy body.' }
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
  // --- COFFEE MASTERCLASSES (track: 'coffee') ---
  {
    id: 'mc_classic_pourover_v60',
    track: 'coffee',
    methodId: 'classic_pour_over',
    method: 'Classic Pour Over',
    title: 'James Hoffmann: The Ultimate Pour Over Technique',
    duration: '13:42',
    thumbnail: 'https://img.youtube.com/vi/AI4ynXzkSQo/hqdefault.jpg',
    embedId: 'AI4ynXzkSQo',
    description: 'The world-famous standard pour-over technique by James Hoffmann for clean, sweet, and repeatable cup extraction.',
    keyTakeaways: [
      'Pour 3x coffee weight for a 45-second bloom degassing phase',
      'Keep kettle spout low to prevent excessive bed turbulence',
      'Gentle swirl after bloom and final pour creates a flat bed'
    ]
  },
  {
    id: 'mc_classic_pourover_beans',
    track: 'coffee',
    methodId: 'classic_pour_over',
    method: 'Classic Pour Over',
    title: "A Beginner's Guide To Buying Coffee Beans",
    duration: '11:20',
    thumbnail: 'https://img.youtube.com/vi/O9YnLFrM7Fs/hqdefault.jpg',
    embedId: 'O9YnLFrM7Fs',
    description: 'James Hoffmann breaks down coffee bean labels, roast profiles, terroir origins, and freshness dates.',
    keyTakeaways: [
      'Always look for a roast date within 2-4 weeks of brewing',
      'Washed process yields sparkling floral & citrus acidity',
      'Light to medium roasts preserve delicate origin character'
    ]
  },
  {
    id: 'mc_pourover_v60_better',
    track: 'coffee',
    methodId: 'pour_over',
    method: 'Hario V60 Dripper',
    title: 'James Hoffmann: A Better 1-Cup V60 Technique',
    duration: '9:18',
    thumbnail: 'https://img.youtube.com/vi/1oB1oDrDkHM/hqdefault.jpg',
    embedId: '1oB1oDrDkHM',
    description: 'James Hoffmann demonstrates his refined single-cup V60 technique using a 5-pour structure to maximize sweetness and clarity.',
    keyTakeaways: [
      'Pour gently in center-outward concentric spirals',
      '5-pour structure prevents excessive bypass in smaller 1-cup doses',
      'Maintain water temperature and gentle swirl after final pour'
    ]
  },
  {
    id: 'mc_pourover_v60_ultimate',
    track: 'coffee',
    methodId: 'pour_over',
    method: 'Hario V60 Dripper',
    title: 'James Hoffmann: The Ultimate V60 Technique (SCA 1:16 Ratio)',
    duration: '13:42',
    thumbnail: 'https://img.youtube.com/vi/AI4ynXzkSQo/hqdefault.jpg',
    embedId: 'AI4ynXzkSQo',
    description: 'The benchmark 2-cup V60 technique by James Hoffmann, targeting 18%-22% extraction yield.',
    keyTakeaways: [
      '1:16 ratio equals 60 grams of coffee per 1 Liter of water',
      'Maintain steady thermal mass during bloom',
      'Gentle swirl ensures a level bed with zero high-and-dry grounds'
    ]
  },
  {
    id: 'mc_pourover_beans',
    track: 'coffee',
    methodId: 'pour_over',
    method: 'Hario V60 Dripper',
    title: "A Beginner's Guide To Buying Coffee Beans",
    duration: '11:20',
    thumbnail: 'https://img.youtube.com/vi/O9YnLFrM7Fs/hqdefault.jpg',
    embedId: 'O9YnLFrM7Fs',
    description: 'Choosing single origins, understanding roast levels, and picking the right coffees for conical paper filtration.',
    keyTakeaways: [
      'Highlight sparkling citric acidity and jasmine bergamot florals',
      'Paper filter captures oils for crystalline cup clarity',
      'Single origins from Ethiopia, Kenya, and Colombia excel in V60'
    ]
  },
  {
    id: 'mc_chemex_hoffmann',
    track: 'coffee',
    methodId: 'chemex',
    method: 'Chemex Glass Brewer',
    title: 'James Hoffmann: The Chemex',
    duration: '10:45',
    thumbnail: 'https://img.youtube.com/vi/ikt-X5x7yoc/hqdefault.jpg',
    embedId: 'ikt-X5x7yoc',
    description: 'James Hoffmann explores the Chemex hourglass brewer, specialized bonded paper filters, and how grind size dictates drawdown time.',
    keyTakeaways: [
      'Chemex bonded filters are 20-30% thicker than standard pour over paper',
      'Coarser grind size is required to prevent flow stall',
      'Keep the 3-fold filter side facing the spout for air venting'
    ]
  },
  {
    id: 'mc_chemex_beans',
    track: 'coffee',
    methodId: 'chemex',
    method: 'Chemex Glass Brewer',
    title: "A Beginner's Guide To Buying Coffee Beans",
    duration: '11:20',
    thumbnail: 'https://img.youtube.com/vi/O9YnLFrM7Fs/hqdefault.jpg',
    embedId: 'O9YnLFrM7Fs',
    description: 'Selecting beans with delicate aromatic florals and bright fruit notes that shine through heavy Chemex filtration.',
    keyTakeaways: [
      'Washed Ethiopian and Kenyan coffees produce sparkling cups',
      'Light-medium roasts prevent heavy bitter sediment in large batches',
      'Look for roast dates within 2 to 4 weeks of brewing'
    ]
  },
  {
    id: 'mc_frenchpress_hoffmann',
    track: 'coffee',
    methodId: 'french_press',
    method: 'French Press',
    title: 'James Hoffmann: The Ultimate French Press Technique',
    duration: '5:30',
    thumbnail: 'https://img.youtube.com/vi/st571DYYTR8/hqdefault.jpg',
    embedId: 'st571DYYTR8',
    description: 'Master the James Hoffmann immersion technique: 4-minute steep, gently breaking the crust, and skimming foam for a crystal-clean body.',
    keyTakeaways: [
      'Stir top crust gently after 4 minutes',
      'Skim floating crema and white foam with two spoons',
      'Rest 5 additional minutes without pressing down'
    ]
  },
  {
    id: 'mc_frenchpress_beans',
    track: 'coffee',
    methodId: 'french_press',
    method: 'French Press',
    title: "A Beginner's Guide To Buying Coffee Beans",
    duration: '11:20',
    thumbnail: 'https://img.youtube.com/vi/O9YnLFrM7Fs/hqdefault.jpg',
    embedId: 'O9YnLFrM7Fs',
    description: 'Learn why heavy-bodied Sumatran, Brazilian, and medium-dark roasts shine best in immersion brewing.',
    keyTakeaways: [
      'Choose low-acidity beans rich in natural oils and cocoa depth',
      'Coarse grind size prevents metal mesh clogging',
      'Pairs best with dark chocolate & toasted nut profiles'
    ]
  },
  {
    id: 'mc_moka_pot_hoffmann',
    track: 'coffee',
    methodId: 'moka_pot',
    method: 'Moka Pot',
    title: 'James Hoffmann: The Ultimate Moka Pot Technique',
    duration: '10:30',
    thumbnail: 'https://img.youtube.com/vi/BfDLoIvb0w4/hqdefault.jpg',
    embedId: 'BfDLoIvb0w4',
    description: 'Master the stovetop Moka Pot with pre-heated water, low heat, and cooling the base to eliminate bitter metallic taste.',
    keyTakeaways: [
      'Start with boiling water in the lower chamber to avoid roasting grounds',
      'Brew on lowest heat to maintain slow, gentle flow',
      'Run base under cold water immediately when sputtering begins'
    ]
  },
  {
    id: 'mc_moka_pot_beans',
    track: 'coffee',
    methodId: 'moka_pot',
    method: 'Moka Pot',
    title: "A Beginner's Guide To Buying Coffee Beans",
    duration: '11:20',
    thumbnail: 'https://img.youtube.com/vi/O9YnLFrM7Fs/hqdefault.jpg',
    embedId: 'O9YnLFrM7Fs',
    description: 'Choosing roast profiles and processing methods that deliver rich chocolate and caramel notes in stovetop extraction.',
    keyTakeaways: [
      'Medium to medium-dark roasts produce rich crema and chocolate body',
      'Natural Brazilian and Central American coffees excel under pressure',
      'Avoid ultra-dark roasts to prevent ash/burnt off-notes'
    ]
  },
  {
    id: 'mc_aeropress_hoffmann',
    track: 'coffee',
    methodId: 'aeropress',
    method: 'AeroPress',
    title: 'James Hoffmann: The Ultimate AeroPress Technique',
    duration: '13:15',
    thumbnail: 'https://img.youtube.com/vi/j6VlT_jUVPc/hqdefault.jpg',
    embedId: 'j6VlT_jUVPc',
    description: 'The standard technique by James Hoffmann for clean, sweet, and highly reproducible AeroPress extraction.',
    keyTakeaways: [
      'Use 11g of medium-fine coffee to 200g of boiling water',
      'Insert plunger slightly to create a vacuum seal and stop dripping',
      'Gently swirl at 2:00, then press gently for 30 seconds at 2:30'
    ]
  },
  {
    id: 'mc_aeropress_beans',
    track: 'coffee',
    methodId: 'aeropress',
    method: 'AeroPress',
    title: "A Beginner's Guide To Buying Coffee Beans",
    duration: '11:20',
    thumbnail: 'https://img.youtube.com/vi/O9YnLFrM7Fs/hqdefault.jpg',
    embedId: 'O9YnLFrM7Fs',
    description: 'Choosing the right coffee beans and roast profiles for rapid immersion-pressure brewing.',
    keyTakeaways: [
      'Versatile across all roast levels from light Nordic to dark roasts',
      'Paper filter eliminates all silt while extracting floral sweetness',
      'Experiment with single-origin natural coffees for juicy berry notes'
    ]
  },
  {
    id: 'mc_espresso_dialin',
    track: 'coffee',
    methodId: 'espresso',
    method: 'Espresso',
    title: 'James Hoffmann: How I Dial-In Espresso',
    duration: '12:10',
    thumbnail: 'https://img.youtube.com/vi/lFwJF-_SUr0/hqdefault.jpg',
    embedId: 'lFwJF-_SUr0',
    description: 'Master dose, grind adjustments, puck distribution, and dialing-in 1:2 extraction yields.',
    keyTakeaways: [
      'Keep dose locked and adjust grind size to hit target shot time',
      'Eliminate puck clumps with WDT needle distribution',
      'Aim for 1:2 yield ratio in 25-30 seconds'
    ]
  },
  {
    id: 'mc_espresso_beans',
    track: 'coffee',
    methodId: 'espresso',
    method: 'Espresso',
    title: "A Beginner's Guide To Buying Coffee Beans",
    duration: '11:20',
    thumbnail: 'https://img.youtube.com/vi/O9YnLFrM7Fs/hqdefault.jpg',
    embedId: 'O9YnLFrM7Fs',
    description: 'Choosing espresso blends and single origins that produce thick syrupy crema without harsh sourness.',
    keyTakeaways: [
      'Medium roasts balance sweetness, body, and acidity in 9-bar extraction',
      'Look for roast dates between 10-30 days for optimal CO2 degassing',
      'Chocolate, caramel, and berry notes shine through espresso machines'
    ]
  },
  {
    id: 'mc_coldbrew_hoffmann',
    track: 'coffee',
    methodId: 'cold_brew',
    method: 'Cold Brew',
    title: 'James Hoffmann: Everything I Learned About Cold Brew Coffee',
    duration: '14:20',
    thumbnail: 'https://img.youtube.com/vi/AB0QLjroFss/hqdefault.jpg',
    embedId: 'AB0QLjroFss',
    description: 'Everything you need to know about cold water extraction, brewing variables, and taste comparisons.',
    keyTakeaways: [
      'Use 1:8 coarse coffee-to-water ratio for cold brew concentrate',
      'Steep at room temp for 12-16 hours for optimal solubility',
      'Filter thoroughly through paper or cloth to remove fine silt'
    ]
  },
  {
    id: 'mc_coldbrew_beans',
    track: 'coffee',
    methodId: 'cold_brew',
    method: 'Cold Brew',
    title: "A Beginner's Guide To Buying Coffee Beans",
    duration: '11:20',
    thumbnail: 'https://img.youtube.com/vi/O9YnLFrM7Fs/hqdefault.jpg',
    embedId: 'O9YnLFrM7Fs',
    description: 'Choosing origins and roast levels that produce ultra-smooth, low-acidity cold brew concentrate.',
    keyTakeaways: [
      'Natural processed Central/South American coffees add rich chocolate and sweet fruit',
      'Dark roasts create bold smoky iced coffee bases',
      'Always grind coarse right before steeping'
    ]
  },
  {
    id: 'mc_siphon_hoffmann',
    track: 'coffee',
    methodId: 'siphon',
    method: 'Siphon Coffee Maker',
    title: 'James Hoffmann: The Coffee Siphon (Vacuum Pot)',
    duration: '11:50',
    thumbnail: 'https://img.youtube.com/vi/mvmRtPGR4C4/hqdefault.jpg',
    embedId: 'mvmRtPGR4C4',
    description: 'Vapor pressure dynamics, temperature stability, and cloth filter filtration in vacuum coffee makers.',
    keyTakeaways: [
      'Vapor pressure forces water into upper chamber at steady temperature',
      'Stir grounds gently to achieve full immersion without disturbing cloth filter',
      'Vacuum draws brewed coffee down through cloth for crystal clarity'
    ]
  },
  {
    id: 'mc_siphon_beans',
    track: 'coffee',
    methodId: 'siphon',
    method: 'Siphon Coffee Maker',
    title: "A Beginner's Guide To Buying Coffee Beans",
    duration: '11:20',
    thumbnail: 'https://img.youtube.com/vi/O9YnLFrM7Fs/hqdefault.jpg',
    embedId: 'O9YnLFrM7Fs',
    description: 'Selecting delicate floral single origins that benefit from high extraction temperatures and cloth filtration.',
    keyTakeaways: [
      'Washed Ethiopian Yirgacheffe and Geisha varieties excel under vacuum brewing',
      'Cloth filter lets aromatic oils through while stopping all fine grit',
      'Use fresh light-roasted specialty coffees for tea-like complexity'
    ]
  },
  {
    id: 'mc_drip_avoidbad',
    track: 'coffee',
    methodId: 'drip_brewer',
    method: 'Automatic Drip',
    title: 'James Hoffmann: How To Avoid A Bad Brew',
    duration: '11:45',
    thumbnail: 'https://img.youtube.com/vi/mMwscUNKbPk/hqdefault.jpg',
    embedId: 'mMwscUNKbPk',
    description: 'Mastering extraction balance, avoiding channeling, and getting cafe-quality batch brew from standard home electric coffee makers.',
    keyTakeaways: [
      'Pre-rinse paper filters to eliminate papery taste',
      'Level coffee bed evenly before starting brew cycle',
      'Use filtered water with 120-150 ppm mineral content'
    ]
  },
  {
    id: 'mc_drip_beans',
    track: 'coffee',
    methodId: 'drip_brewer',
    method: 'Automatic Drip',
    title: "A Beginner's Guide To Buying Coffee Beans",
    duration: '11:20',
    thumbnail: 'https://img.youtube.com/vi/O9YnLFrM7Fs/hqdefault.jpg',
    embedId: 'O9YnLFrM7Fs',
    description: 'Choosing crowd-pleasing medium roasts and single origins for smooth morning batch brewing.',
    keyTakeaways: [
      'Medium roasts with caramel, toffee, and milk chocolate notes work best',
      'Look for roast dates within 2-4 weeks',
      'Grind medium to match machine basket geometry'
    ]
  },

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
  ]
};

