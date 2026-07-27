export const BREW_METHODS = {
  coffee: [
    {
      id: 'pour_over',
      name: 'Pour-Over (V60 / Chemex)',
      category: 'coffee',
      featured: false,
      heroImage: './coffee_setup.jpg',
      ratio: 15, // 1:15 ratio (1g coffee to 15ml water)
      defaultCupMl: 240,
      tempC: 94,
      tempF: 201,
      grind: 'Medium-Fine',
      micron: '400 - 600 µm',
      description: 'Highlighting bright acidity, delicate floral notes, and crystal-clear body through controlled spiral pouring.',
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
      phases: [
        { name: 'Filter Rinse & Reservoir Fill', durationSec: 30, waterMultiplier: 0, instruction: 'Pre-rinse paper filter with hot water. Fill reservoir with cold filtered water.' },
        { name: 'Showerhead Brew Cycle', durationSec: 180, waterMultiplier: 1.0, instruction: 'Start brew cycle. Ensure grounds bed is evenly saturated by showerhead.' },
        { name: 'Thermal Carafe Hold', durationSec: 60, waterMultiplier: 1.0, instruction: 'Brew complete. Remove carafe immediately to prevent hotplate scorching.' }
      ]
    },
    {
      id: 'espresso',
      name: 'Espresso (Manual/Semi-Auto)',
      category: 'coffee',
      featured: false,
      heroImage: './coffee_setup.jpg',
      ratio: 2, // 1:2 yield ratio (18g in -> 36g out)
      defaultCupMl: 36,
      tempC: 93,
      tempF: 200,
      grind: 'Extra Fine',
      micron: '200 - 300 µm',
      description: 'Concentrated high-pressure extraction yielding rich crema, heavy body, and intense flavor balance.',
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
      heroImage: './coffee_setup.jpg',
      ratio: 13,
      defaultCupMl: 220,
      tempC: 88,
      tempF: 190,
      grind: 'Medium-Fine',
      micron: '450 - 550 µm',
      description: 'Versatile hybrid immersion and pressure extraction delivering sweet, clean, low-acidity coffee.',
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
      phases: [
        { name: 'Boiling Rinse', durationSec: 15, waterMultiplier: 1.0, instruction: 'Flash rinse to hydrate herbs/fermented leaves; discard liquid.' },
        { name: 'Deep Infusion', durationSec: 300, waterMultiplier: 1.0, instruction: 'Steep 5 minutes with boiling water for full extraction.' }
      ]
    }
  ]
};

export const TERROIR_ATLAS = {
  coffee: [
    {
      id: 'ethiopia',
      country: 'Ethiopia',
      flag: '🇪🇹',
      regions: 'Yirgacheffe, Sidama, Guji, Harar',
      altitude: '1,800 - 2,200 meters',
      soilType: 'Iron-Rich Volcanic Nitisols & Deep Forest Organic Humus',
      climate: 'Subtropical highland with extreme diurnal temperature swings (25°C days / 8°C nights)',
      genetics: 'Indigenous Wild Heirloom Arabica Landraces (Kurume, Dega, Wolisho)',
      processing: 'Fully Washed (citric clarity) & Natural Sun-Dried on Raised African Beds (intense berry sweetness)',
      flavorNotes: ['Jasmine Floral', 'Bergamot Citrus', 'Wild Blueberry', 'Peach Nectar', 'Tea-like Body'],
      acidProfile: 'High Citric & Floral Phosphoric Acidity',
      agronomyDeepDive: 'Extreme altitude slows cherry maturation to over 9 months. Cold mountain nights cause coffee trees to store dense sugars and complex organic acids inside the seed. Combined with iron-rich volcanic soils and thousands of uncatalogued wild heirloom varieties, Ethiopian coffees yield unmatched floral bergamot density and tea-like elegance.',
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
      id: 'colombia',
      country: 'Colombia',
      flag: '🇨🇴',
      regions: 'Huila, Nariño, Antioquia, Tolima',
      altitude: '1,500 - 2,100 meters',
      soilType: 'Andean Volcanic Ash Soils (Andisols) rich in Potassium & Phosphorus',
      climate: 'Equatorial mountain microclimates with dual harvesting seasons (Mitaca harvest)',
      genetics: 'Caturra, Castillo, Colombia, Pink Bourbon, Geisha',
      processing: 'Traditional Fully Washed with 18-36 hour tank fermentation',
      flavorNotes: ['Milk Chocolate', 'Caramel', 'Red Apple Acidity', 'Toasted Pecan', 'Silky Body'],
      acidProfile: 'Medium-High Malic & Tartaric Acidity',
      agronomyDeepDive: 'Cultivated along the high ridges of the Andes cordilleras. The porous volcanic ash soils (Andisols) provide exceptional moisture retention and high potassium content, fostering sucrose development. This yields Colombia’s trademark harmony of creamy chocolate body with crisp red apple malic acidity.',
      roastPairing: 'Medium Roast',
      recommendedMethod: 'Automatic Drip Maker & French Press',
      sourcedBrands: [
        { name: 'Blue Bottle Coffee', offering: 'Single Origin Colombia Tres Santos', note: 'Huila washed Caturra with sweet brown sugar, toasted almond, and red apple acidity.' },
        { name: 'Stumptown Coffee Roasters', offering: 'Colombia El Jordan & San Augustin', note: 'Nariño high-grown lot featuring milk chocolate sweetness and crisp cherry finish.' },
        { name: 'Intelligentsia Coffee', offering: 'Colombia Tres Santos / La Mota', note: 'Washed Pink Bourbon cultivar with delicate pink grapefruit and panela sweetness.' },
        { name: 'La Colombe Coffee Roasters', offering: 'Colombia Corsica & Nariño Reserve', note: 'Smooth medium roast with cocoa nib, dried plum, and velvety mouthfeel.' },
        { name: "Peet's Coffee", offering: 'Colombia San Sebastian Single Origin', note: 'Classic Huila profile with deep milk chocolate, toasted walnut, and balanced body.' }
      ]
    },
    {
      id: 'kenya',
      country: 'Kenya',
      flag: '🇰🇪',
      regions: 'Nyeri, Kirinyaga, Mount Kenya, Murang’a',
      altitude: '1,700 - 2,100 meters',
      soilType: 'Deep Red Volcanic Clay Soils (Rhodic Nitisols) rich in Phosphoric Acid',
      climate: 'Bimodal rainfall pattern with distinct hot sun and cool mountain mist cycles',
      genetics: 'SL-28, SL-34 (Scott Laboratories selections), Ruiru 11, Batian',
      processing: 'Kenyan 72-Hour Double Washed Process with soaking stage',
      flavorNotes: ['Blackcurrant', 'Juicy Grapefruit', 'Complex Winey Acidity', 'Cane Sugar', 'Tomato Leaf'],
      acidProfile: 'Pungent Phosphoric & Tartaric Acidity',
      agronomyDeepDive: 'Kenya’s red volcanic clay soils are packed with accessible phosphoric acid. The legendary SL-28 and SL-34 Bourbon cultivars combined with the 72-hour double washing process (where beans are fermented, washed, and soaked overnight under clean water) create Kenya’s world-famous sparkling blackcurrant flavor, juicy grapefruit acidity, and winey complexity.',
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
      id: 'guatemala',
      country: 'Guatemala',
      flag: '🇬🇹',
      regions: 'Antigua, Huehuetenango, Atitlán, Fraijanes',
      altitude: '1,500 - 2,000 meters',
      soilType: 'Active Volcanic Ash (Pumice) from Fuego & Acatenango volcanoes',
      climate: 'Microclimates created by mountain barrier walls and warm Pacific air currents',
      genetics: 'Bourbon, Caturra, Catuai, Pache, Typica',
      processing: 'Fully Washed with patio sun drying',
      flavorNotes: ['Dark Cocoa', 'Roasted Hazelnut', 'Orange Zest', 'Spicy Cinnamon', 'Smoky Cocoa'],
      acidProfile: 'Balanced Citric & Malic Acidity',
      agronomyDeepDive: 'In Antigua, three surrounding volcanoes continuously deposit mineral-rich pumice ash into the soil. The pumice retains optimal humidity in dry months. Combined with cool night air from high mountain ranges, Guatemalan beans develop a dense cell structure resulting in bittersweet chocolate depth, hazelnut sweetness, and a pleasant orange zest bite.',
      roastPairing: 'Medium to Dark Roast',
      recommendedMethod: 'French Press & Drip Coffee Maker',
      sourcedBrands: [
        { name: 'Intelligentsia Coffee', offering: 'Guatemala Los Inmortales & Flecha de Oro', note: 'Antigua Bourbon with dark chocolate fudge, toasted hazelnut, and orange blossom.' },
        { name: "Peet's Coffee", offering: 'Guatemala San Sebastián Antigua', note: 'High volcanic elevation profile with rich bittersweet cocoa, spicy cinnamon, and heavy body.' },
        { name: 'Stumptown Coffee Roasters', offering: 'Guatemala El Injerto & Bella Vista', note: 'Huehuetenango washed Caturra with sweet milk chocolate and crisp clementine.' },
        { name: 'Starbucks Reserve', offering: 'Guatemala Antigua Single Origin', note: 'Classic volcanic ash profile featuring cocoa nibs, warm spice, and citrus finish.' }
      ]
    },
    {
      id: 'costa_rica',
      country: 'Costa Rica',
      flag: '🇨🇷',
      regions: 'Tarrazú, Central Valley, West Valley, Orosi',
      altitude: '1,400 - 1,900 meters',
      soilType: 'Enriched Volcanic Loam with high organic content',
      climate: 'Pacific & Atlantic climate influences with strict wet/dry seasonality',
      genetics: 'Caturra, Villa Sarchi, Geisha, SL-28',
      processing: 'Pioneering Honey Process (Yellow, Red, Black Honey) & Washed',
      flavorNotes: ['Wild Honey', 'Crisp Green Apple', 'White Floral', 'Stone Fruit', 'Clean Body'],
      acidProfile: 'Refined Citric & Apple Malic Acidity',
      agronomyDeepDive: 'Costa Rica is the birthplace of micro-mill innovation and Honey Processing. In Honey processing, precise percentages of sweet fruit mucilage are left on the parchment bean while sun-drying on raised beds. The sugars naturally ferment into the bean, yielding clean fruit sweetness, honeyed mouthfeel, and green apple clarity.',
      roastPairing: 'Medium Roast',
      recommendedMethod: 'Pour-Over & AeroPress',
      sourcedBrands: [
        { name: 'Blue Bottle Coffee', offering: 'Costa Rica Hermosa Honey Process', note: 'Red Honey processed micro-lot with wildflower honey, nectarine, and silky texture.' },
        { name: 'Counter Culture Coffee', offering: 'Costa Rica Perla del Café', note: 'Yellow Honey Villa Sarchi with golden delicious apple and honeyed sweetness.' },
        { name: 'Verve Coffee Roasters', offering: 'Costa Rica Las Lajas Honey', note: 'Black Honey pioneer estate with intense stone fruit, cherry, and raw sugar syrup.' },
        { name: 'Ritual Coffee Roasters', offering: 'Costa Rica La Minita Tarrazú', note: 'Famous estate washed lot with immaculate balance, green apple, and sweet cream.' }
      ]
    },
    {
      id: 'indonesia',
      country: 'Indonesia',
      flag: '🇮🇩',
      regions: 'Sumatra (Gayo Highlands/Mandheling), Java, Toraja Sulawesi',
      altitude: '1,100 - 1,600 meters',
      soilType: 'Volcanic Tropical Humus with clay subsoil',
      climate: 'Equatorial tropical rainforest with year-round high humidity & heavy rainfall',
      genetics: 'Ateng, Tim Tim, Bergendal, Line S795 (Arabica Hybrids)',
      processing: 'Traditional Wet-Hulled (Giling Basah) Process',
      flavorNotes: ['Earthy Cedar', 'Dark Chocolate', 'Pipe Tobacco', 'Low Acidity', 'Syrupy Heavy Body'],
      acidProfile: 'Low Acidity with Heavy Lipids',
      agronomyDeepDive: 'Indonesia’s iconic Giling Basah (wet-hulling) technique was created to overcome equatorial humidity. Smallholders hull the parchment off the bean at 30-50% moisture (rather than 10-12%). The bare green beans dry exposed directly to humid air, undergoing unique microbial action that mutes acidity and imparts heavy cedar, dark cocoa, pipe tobacco, and dense syrupy mouthfeel.',
      roastPairing: 'Medium-Dark to Dark Roast',
      recommendedMethod: 'French Press (Immersion)',
      sourcedBrands: [
        { name: "Peet's Coffee", offering: 'Sumatra Reserve Single Origin & Major Dickason\'s', note: 'Classic Giling Basah profile with deep herbal cedar, dark cocoa, and thick syrupy body.' },
        { name: 'La Colombe Coffee Roasters', offering: 'Sumatra Mandheling Single Origin', note: 'Dark roast Gayo lot featuring pipe tobacco, dark chocolate truffle, and zero harshness.' },
        { name: 'Starbucks Reserve', offering: 'Sumatra Aged Single Origin', note: 'Aged 3-5 years in Singapore warehouses to develop deep rustic spice and wood notes.' },
        { name: 'Stumptown Coffee Roasters', offering: 'Sumatra Bies Penantan', note: 'Organic Gayo Highlands washed & wet-hulled hybrid with cedar, grapefruit rind, and cacao.' }
      ]
    }
  ],
  tea: [
    {
      id: 'china',
      country: 'China',
      flag: '🇨🇳',
      regions: 'Fujian (Wuyi Mountains/Anxi), Zhejiang (West Lake), Yunnan',
      famousTeas: ['Longjing (Dragonwell Green)', 'Da Hong Pao (Wuyi Cliff Oolong)', 'Pu-erh (Shou & Sheng)', 'Lapsang Souchong'],
      soilType: 'Granite Rock Mineral Soil (Wuyi Rocks) & Red Forest Clay',
      botanicals: 'Camellia sinensis var. sinensis (Small Leaf Bush)',
      processing: 'Pan-firing (Green), Charcoal Roasting (Oolong), Microbial Fermentation (Pu-erh)',
      flavorNotes: ['Roasted Chestnut', 'Orchid Floral', 'Rock Mineral (Yan Yun)', 'Earthy Dark Chocolate'],
      steepStyle: 'Gongfu High-Leaf Ratio & Western Infusion',
      recommendedMethod: 'Oolong & Green Tea Tracks',
      sourcedBrands: [
        { name: 'Vahdam Teas', offering: 'Imperial Chinese Loose Leaf Collection', note: 'Authentic West Lake Longjing and Yunnan Black tea selections.' },
        { name: 'Mei Leaf Tea House', offering: 'Imperial Longjing & Wuyi Cliff Oolongs', note: 'Direct-farm sourced competition grade Wuyi Rock Da Hong Pao with heavy Yan Yun mineral notes.' },
        { name: 'Harney & Sons', offering: 'Dragon Pearl Jasmine & Imperial Pu-erh', note: 'Hand-rolled jasmine tea pearls and aged cooked Pu-erh tea cakes.' },
        { name: 'The Tao of Tea', offering: 'Organic Dragonwell & Yunnan Golden Tip', note: 'Pan-fired Hangzhou green tea with rich toasted chestnut and sweet finish.' }
      ],
      terroirOverview: 'The birthplace of tea culture. In Fujian’s Wuyi Mountains, tea bushes grow directly out of granite rock cliffs. The roots absorb rich rock minerals, producing the famous "Yan Yun" (Rock Rhythm)—a combination of floral orchid aroma, roasted mineral depth, and lingering throat sweetness.'
    },
    {
      id: 'japan',
      country: 'Japan',
      flag: '🇯🇵',
      regions: 'Shizuoka, Uji (Kyoto), Kagoshima, Yame',
      famousTeas: ['Sencha', 'Gyokuro (Shaded Green)', 'Matcha (Stone-Ground)', 'Hojicha (Roasted)'],
      soilType: 'Volcanic Ash Soil (Kuroboku) rich in organic matter',
      botanicals: 'Yabukita, Saemidori, Okumidori Cultivars',
      processing: 'Deep Steam Process (Fukamushi) & Bamboo Net Canopy Shading (Kabuse)',
      flavorNotes: ['Rich Umami', 'Steamed Spinach', 'Marine Sea Breeze', 'Sweet Grassy Finish'],
      steepStyle: 'Steam Processed Whole Leaf (Low Temp 70-80°C)',
      recommendedMethod: 'Specialty Green Tea Track (78°C)',
      sourcedBrands: [
        { name: 'Ippodo Tea Co. (Kyoto since 1717)', offering: 'Sayaka & Ummon Ceremonial Matcha, Gyokuro Kanro', note: '300-year-old Kyoto teahouse supplying stone-ground ceremonial matcha rich in umami.' },
        { name: 'Harney & Sons', offering: 'Japanese Sencha & Genmaicha', note: 'Steamed Shizuoka green tea blended with roasted toasted brown rice.' },
        { name: 'Rishi Tea & Botanicals', offering: 'Organic Teahouse Matcha & Sencha Fukuoka', note: 'First harvest ceremonial matcha from Kagoshima volcanic soils.' },
        { name: 'Encha Organic Matcha', offering: 'Uji First Harvest Ceremonial Matcha', note: 'Shaded Uji matcha with deep emerald color, zero bitterness, and creamy umami.' }
      ],
      terroirOverview: 'Japanese teas are steam-processed within hours of picking to halt oxidation. For Gyokuro and Matcha, tea bushes are shaded with black bamboo nets for 20-30 days before harvest. Shading blocks sunlight, preventing the conversion of L-theanine amino acids into bitter catechins, generating Japan’s iconic savory umami and sweet marine sea breeze flavor.'
    },
    {
      id: 'india',
      country: 'India',
      flag: '🇮🇳',
      regions: 'Darjeeling (Himalayan Foothills), Assam (Brahmaputra Valley), Nilgiri',
      famousTeas: ['First Flush Darjeeling ("Champagne of Teas")', 'Bold Assam CTC & Orthodox', 'Nilgiri Frost Tea'],
      soilType: 'Himalayan Silt & Fertile Alluvial River Plain Soils',
      botanicals: 'Camellia sinensis var. assamica (Large Leaf Tree)',
      processing: 'Orthodox Full Leaf Oxidation & Heavy CTC Rolling',
      flavorNotes: ['Muscatel Grape', 'Crisp Stone Fruit', 'Bold Malty Cocoa', 'Citrus Astringency'],
      steepStyle: 'Orthodox Full Leaf Steeping (96°C)',
      recommendedMethod: 'Full-Leaf Black Tea Track (96°C)',
      sourcedBrands: [
        { name: 'Vahdam Teas (New Delhi)', offering: 'First Flush Darjeeling & Imperial Assam', note: 'Direct-from-estate Himalayan first harvest Darjeeling featuring muscatel grape clarity.' },
        { name: 'Twinings of London', offering: 'Darjeeling & English Breakfast Assam', note: 'Classic British blend sourcing malty Assam leaves from the Brahmaputra valley.' },
        { name: 'Harney & Sons', offering: 'Darjeeling First Flush & Assam Superior', note: 'Spring harvest Himalayan Darjeeling with peach, muscatel grape, and crisp finish.' },
        { name: 'Fortnum & Mason (London)', offering: 'Darjeeling Broken Orange Pekoe & Assam', note: 'Iconic Piccadilly tea house offering high-grade Himalayan single estate flushes.' }
      ],
      terroirOverview: 'In Darjeeling, tea bushes cling to steep Himalayan slopes at up to 2,000 meters. The cool mountain air and intense UV light create the coveted "Muscatel" flavor—a natural aroma reminiscent of muscat grapes and stone fruit. Down in tropical Assam, hot river plains yield bold, malty teas ideal with milk.'
    },
    {
      id: 'taiwan',
      country: 'Taiwan',
      flag: '🇹🇼',
      regions: 'Nantou, Alishan High Mountain, Dong Ding, Shan Lin Xi',
      famousTeas: ['High Mountain Oolong (Gaoshan)', 'Oriental Beauty (Dongfang Meiren)', 'Dong Ding Oolong'],
      soilType: 'High-Altitude Slate & Sandstone Mountain Soil',
      botanicals: 'Qingxin Oolong, Jin Xuan (Milk Oolong), Ruby 18',
      processing: 'Tightly Hand-Rolled Ball Oolong & Charcoal Baking',
      flavorNotes: ['Creamy Butter', 'White Peach', 'Wild Honey', 'Lingering Throat Resonance (Hui Gan)'],
      steepStyle: 'Hand-Rolled Gongfu Infusion (88°C)',
      recommendedMethod: 'Oolong Tea Track (88°C)',
      sourcedBrands: [
        { name: 'Ten Ren Tea Co. (Taipei)', offering: 'High Mountain Alishan Oolong & King’s Tea', note: 'Taipei’s premier tea master sourcing tightly rolled Alishan leaves with floral butter aroma.' },
        { name: 'Mei Leaf Tea House', offering: 'Alishan Cream & High Mountain Floral Oolongs', note: 'Jin Xuan cultivar oolong offering natural creamy butter and lilac floral notes.' },
        { name: 'The Tao of Tea', offering: 'Formosa Oolong & Amber Dong Ding', note: 'Traditional charcoal-roasted Taiwanese oolong with honey and toasted warm amber notes.' },
        { name: 'Rishi Tea & Botanicals', offering: 'Organic Ruby 18 & Formosa Dong Ding', note: 'Famous Taiwanese Wild Red Tea cultivar boasting cinnamon and mint aroma.' }
      ],
      terroirOverview: 'Taiwan’s High Mountain (Gaoshan) oolongs grow above 1,000 meters in perpetual mountain mist. Heavy fog limits sunlight, making leaf cell walls thick and soft. Hand-rolled into tight green spheres, these leaves release legendary aromas of creamy butter, white peach, and a sweet throat resonance ("Hui Gan") that lasts for hours.'
    },
    {
      id: 'sri_lanka',
      country: 'Sri Lanka (Ceylon)',
      flag: '🇱🇰',
      regions: 'Nuwara Eliya, Uva, Dimbula, Kandy',
      famousTeas: ['Ceylon High Grown Black Tea', 'Uva Seasonal Flush', 'Silver Tips White Tea'],
      soilType: 'Monsoonal Tropical Mountain Loam',
      botanicals: 'High-Grown Orthodox Camellia Sinensis',
      processing: 'Orthodox Wither, Roll, Ferment, and Fire',
      flavorNotes: ['Crisp Lemon Zest', 'Eucalyptus', 'Golden Liqueur', 'Refreshing Crisp Finish'],
      steepStyle: 'High Elevation Whole Leaf (96°C)',
      recommendedMethod: 'Black & White Tea Tracks',
      sourcedBrands: [
        { name: 'Dilmah Ceylon Tea (Sri Lanka)', offering: 'Single Origin Pure Ceylon Nuwara Eliya', note: 'Sri Lanka’s family-owned single origin tea maker offering high-grown bright citrus tea.' },
        { name: 'Twinings of London', offering: 'Pure Ceylon Single Origin', note: 'Golden copper liqueur with refreshing lemon zest astringency.' },
        { name: 'Harney & Sons', offering: 'Ceylon OP & Nuwara Eliya High Grown', note: 'High altitude Central Province black tea with crisp eucalyptus and golden liquor.' },
        { name: 'Fortnum & Mason (London)', offering: 'Royal Blend Ceylon Black', note: 'Classic blend of high-grown Ceylon and malty Assam created for King Edward VII.' }
      ],
      terroirOverview: 'Ceylon teas grown in Nuwara Eliya (above 1,800 meters) benefit from dry, cool mountain winds that sweep across the valleys during monsoons. This causes the tea bush to produce high levels of aromatic essential oils, yielding Ceylon’s famous golden copper liqueur and crisp lemon zest finish.'
    }
  ]
};

export const MASTERCLASSES = [
  {
    id: 'mc_pourover',
    title: 'Pour-Over Concentric Pouring & V60 Technique',
    method: 'Pour-Over',
    duration: '4:15',
    thumbnail: './coffee_setup.jpg',
    embedId: '1oB1oDrDkHM',
    description: 'Learn how spiral pour rate, bed height, and water turbulence dictate extraction clarity in V60 and Chemex drippers.',
    keyTakeaways: [
      'Pour gently in center-outward concentric spirals',
      'Never hit the paper walls directly to prevent water bypass',
      'Maintain steady thermal mass during bloom'
    ]
  },
  {
    id: 'mc_frenchpress',
    title: 'Ultimate French Press: Crust Breaking & Silt Skimming',
    method: 'French Press',
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
    id: 'mc_drip',
    title: 'Maximizing Your Home Drip Coffee Machine',
    method: 'Automatic Drip',
    duration: '3:45',
    thumbnail: './drip_brewer.jpg',
    embedId: '8d-9Y2S92v0',
    description: 'Simple tweaks to get cafe-quality batch brew from standard home electric coffee makers.',
    keyTakeaways: [
      'Pre-rinse paper filters to eliminate papery taste',
      'Level coffee bed evenly before starting',
      'Use filtered water with 120-150 ppm mineral content'
    ]
  },
  {
    id: 'mc_gongfu',
    title: 'Gongfu Tea Washing & Flash Infusions',
    method: 'Fine Tea',
    duration: '4:50',
    thumbnail: './tea_ceremony.jpg',
    embedId: 'L6N463xM4R4',
    description: 'Understand leaf awakening, gaiwan handling, temperature drop, and timing multi-steep oolongs.',
    keyTakeaways: [
      'Rinse leaves for 5-10s to open rolled tea balls',
      'Pour water down gaiwan rim to avoid burning delicate leaves',
      'Increase steep time by 5-10 seconds per subsequent infusion'
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
