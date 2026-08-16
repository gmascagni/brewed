export const BREW_METHODS = {
  coffee: [
    {
      id: 'classic_pour_over',
      name: 'Classic Pour Over',
      category: 'coffee',
      featured: true,
      heroImage: './pour_over_hero.jpg',
      ratio: 16, // 1:16 ratio (1g coffee to 16ml water)
      defaultCupMl: 240,
      tempC: 93,
      tempF: 200,
      grind: 'Medium-Fine',
      micron: '450 - 650 µm',
      description: 'Universal pour-over extraction method suitable for all standard cone, wedge, and flat-bottom drippers. Delivers clean, balanced acidity and rich aromatic clarity.',
      preferredCoffeeTypes: 'Light to Medium Roasts. Central American, Colombian, and East African single-origin coffees.',
      phases: [
        { name: 'Bloom Phase', durationSec: 45, waterMultiplier: 3, instruction: 'Pour 3x coffee weight in circular motion. Let coffee bloom and de-gas.' },
        { name: 'Pulse Pouring', durationSec: 60, waterMultiplier: 0.6, instruction: 'Pour in steady spiral pulses to keep water level consistent.' },
        { name: 'Final Drawdown', durationSec: 75, waterMultiplier: 1.0, instruction: 'Top up remaining water and allow complete bed drawdown.' }
      ]
    },
    {
      id: 'pour_over',
      name: 'Hario V60 Dripper',
      category: 'coffee',
      featured: false,
      heroImage: './pour_over_hero.jpg',
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
      heroImage: './chemex_hero.jpg',
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
      id: 'darjeeling_tea',
      name: 'Himalayan Darjeeling Tea (The Champagne of Teas)',
      category: 'tea',
      featured: true,
      heroImage: './tea_kettle.jpg',
      ratio: 50, // 1g per 50ml water
      defaultCupMl: 240,
      tempC: 88,
      tempF: 190,
      leafGrade: 'FTGFOP1 Whole Leaf',
      description: 'Grown in high-altitude misty Himalayan ridges. Renowned for delicate muscatel grape clarity, peach notes, and crisp amber finish.',
      preferredCoffeeTypes: 'First & Second Flush Himalayan Darjeeling (West Bengal, India). High altitude garden lots yielding muscatel, floral, and stone fruit elegance.',
      phases: [
        { name: 'Vessel Preheat', durationSec: 15, waterMultiplier: 0, instruction: 'Rinse porcelain or glass teapot with warm water to maintain steep temperature.' },
        { name: 'Aromatic Himalayan Steep', durationSec: 180, waterMultiplier: 1.0, instruction: 'Pour 88°C water over leaves. Steep 3 minutes for peak muscatel grape bouquet.' },
        { name: 'Decant & Serve', durationSec: 30, waterMultiplier: 1.0, instruction: 'Strain completely into teacup to stop extraction.' }
      ]
    },
    {
      id: 'chai_masala',
      name: 'Masala Chai (Spiced Assam & Botanical Infusion)',
      category: 'tea',
      featured: true,
      heroImage: './tea_ceremony.jpg',
      ratio: 25, // 1g tea/spice per 25ml liquid
      defaultCupMl: 250,
      tempC: 98,
      tempF: 208,
      leafGrade: 'CTC Assam Black Tea & Whole Cracked Spices',
      description: 'Robust, comforting Indian spiced tea simmered with green cardamom, Ceylon cinnamon, organic ginger root, cloves, and black pepper.',
      preferredCoffeeTypes: 'Brahmaputra Valley Assam CTC with green cardamom, Ceylon cinnamon bark, organic ginger root, and star anise.',
      phases: [
        { name: 'Spice & Leaf Decoction Simmer', durationSec: 240, waterMultiplier: 1.0, instruction: 'Boil crushed spices and tea leaves in water for 4 minutes to extract essential oils.' },
        { name: 'Milk & Sweetener Rest', durationSec: 120, waterMultiplier: 1.0, instruction: 'Add milk and unrefined cane sugar (Panela/Jaggery); bring to gentle froth.' },
        { name: 'Fine Mesh Strain', durationSec: 30, waterMultiplier: 1.0, instruction: 'Pour through fine sieve into mug.' }
      ]
    },
    {
      id: 'english_breakfast',
      name: 'English Breakfast Tea (Malty Assam & Ceylon Blend)',
      category: 'tea',
      featured: true,
      heroImage: './tea_kettle.jpg',
      ratio: 50, // 1g per 50ml water
      defaultCupMl: 250,
      tempC: 96,
      tempF: 205,
      leafGrade: 'Orthodox Broken Orange Pekoe',
      description: 'Classic rich, full-bodied morning black tea blend combining Assam malty strength, Ceylon crispness, and Kenyan amber depth.',
      preferredCoffeeTypes: 'High-grown Assam, Sri Lankan Ceylon Dimbula, and Rift Valley Kenyan Orthodox leaves offering malty cocoa and toast notes.',
      phases: [
        { name: 'Teapot Warm', durationSec: 15, waterMultiplier: 0, instruction: 'Rinse teapot with near-boiling water.' },
        { name: 'Full Extraction Steep', durationSec: 240, waterMultiplier: 1.0, instruction: 'Steep at 96°C for 4 minutes for robust body without harshness.' },
        { name: 'Serve & Rest', durationSec: 30, waterMultiplier: 1.0, instruction: 'Remove infuser basket completely.' }
      ]
    },
    {
      id: 'earl_grey',
      name: 'Earl Grey Tea (Italian Bergamot Oil Infused)',
      category: 'tea',
      featured: true,
      heroImage: './tea_ceremony.jpg',
      ratio: 50, // 1g per 50ml water
      defaultCupMl: 240,
      tempC: 95,
      tempF: 203,
      leafGrade: 'Full-Leaf Black & Cold-Pressed Bergamot Oil',
      description: 'Aromatic black tea infused with natural cold-pressed oil of Italian bergamot citrus. Fragrant floral citrus aroma balanced with malty cocoa depth.',
      preferredCoffeeTypes: 'Calabrian organic bergamot oil blended with Orthodox Ceylon and Assam estate black teas.',
      phases: [
        { name: 'Vessel Warm', durationSec: 15, waterMultiplier: 0, instruction: 'Rinse ceramic teapot with hot water.' },
        { name: 'Aromatic Citrus Steep', durationSec: 210, waterMultiplier: 1.0, instruction: 'Steep untouched at 95°C for 3.5 minutes to release citrus aromatics.' },
        { name: 'Decant', durationSec: 30, waterMultiplier: 1.0, instruction: 'Separate tea leaves from liqueur.' }
      ]
    },
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
      leafGrade: 'Whole Leaf (Steamed / Pan-Fired)',
      description: 'Delicate low-temp steeping to preserve fresh umami, sweet grassy aromas, and high L-theanine amino acids without bitter tannins.',
      preferredCoffeeTypes: 'Japanese Sencha & Gyokuro, Chinese West Lake Longjing. Steamed & pan-fired green leaves high in L-theanine amino acids.',
      phases: [
        { name: 'Vessel Preheat', durationSec: 15, waterMultiplier: 0, instruction: 'Warm teapot or glass with warm water, then discard water.' },
        { name: '1st Steeping Infusion', durationSec: 120, waterMultiplier: 1.0, instruction: 'Pour 78°C water gently over leaves. Do not agitate.' },
        { name: 'Decant & 2nd Infusion Prep', durationSec: 90, waterMultiplier: 1.0, instruction: 'Pour completely into server. Leaves ready for 2nd steep.' }
      ]
    },
    {
      id: 'matcha_tea',
      name: 'Japanese Ceremonial Matcha (Usucha Whisk)',
      category: 'tea',
      featured: true,
      heroImage: './tea_ceremony.jpg',
      ratio: 35, // 2g matcha per 70ml water
      defaultCupMl: 100,
      tempC: 80,
      tempF: 176,
      leafGrade: 'Micro-Milled Ceremonial Tencha Powder',
      description: 'Vibrant jade-green stone-ground powdered tea whisked in a Chawan bowl into a creamy micro-foam. Rich in umami sweetness, chlorophyll, and antioxidants.',
      preferredCoffeeTypes: 'Uji & Yame First-Harvest Ceremonial Grade Tencha leaves ground on traditional granite stone mills.',
      phases: [
        { name: 'Sift & Warm Bowl', durationSec: 20, waterMultiplier: 0, instruction: 'Sift 2g matcha powder through fine mesh into warm Chawan bowl.' },
        { name: 'Water Add & Bloom', durationSec: 15, waterMultiplier: 1.0, instruction: 'Pour 70mL of 80°C water gently down side of bowl.' },
        { name: 'Chasen Bamboo Whisk', durationSec: 45, waterMultiplier: 1.0, instruction: 'Whisk rapidly in a zig-zag "W" motion using bamboo Chasen until rich froth forms.' }
      ]
    },
    {
      id: 'oolong_tea',
      name: 'Oolong Tea (Gongfu Hand-Rolled)',
      category: 'tea',
      featured: false,
      heroImage: './tea_ceremony.jpg',
      ratio: 30, // 1g per 30ml water
      defaultCupMl: 150,
      tempC: 88,
      tempF: 190,
      leafGrade: 'Tightly Rolled Leaf',
      description: 'High-leaf ratio Gongfu steeping revealing evolving layers of orchid florals, toasted honey, lilac, and rock mineral depth over 5+ infusions.',
      preferredCoffeeTypes: 'Taiwanese High Mountain Alishan, Wuyi Rock Da Hong Pao, Dong Ding Oolong. Hand-rolled oolongs releasing floral butter, lilac, and rock mineral depth.',
      phases: [
        { name: 'Leaf Wash Rinse', durationSec: 10, waterMultiplier: 1.0, instruction: 'Quick 10-second flash pour to wake rolled leaves; discard liquid.' },
        { name: '1st Infusion', durationSec: 45, waterMultiplier: 1.0, instruction: 'Steep 45 seconds at 88°C for rich aroma peak.' },
        { name: '2nd Infusion', durationSec: 60, waterMultiplier: 1.0, instruction: 'Add 15s to steep time. Full floral body unfolding.' }
      ]
    },
    {
      id: 'ceylon_tea',
      name: 'Ceylon High-Grown Tea (Sri Lankan Black Tea)',
      category: 'tea',
      featured: false,
      heroImage: './tea_kettle.jpg',
      ratio: 50, // 1g per 50ml water
      defaultCupMl: 240,
      tempC: 95,
      tempF: 203,
      leafGrade: 'Orthodox High-Grown Ceylon BOP',
      description: 'Cultivated in the misty Nuwara Eliya and Dimbula mountain peaks of Sri Lanka. Crisp citrus notes, golden copper color, and brisk invigorating finish.',
      preferredCoffeeTypes: 'Single-estate Nuwara Eliya & Uva Ceylon black teas with citrus zest, woodsy cedar, and crisp brisk tannin.',
      phases: [
        { name: 'Vessel Warm', durationSec: 15, waterMultiplier: 0, instruction: 'Rinse teapot with hot water.' },
        { name: 'Brisk Mountain Steep', durationSec: 210, waterMultiplier: 1.0, instruction: 'Steep at 95°C for 3.5 minutes for bright citrus acidity.' },
        { name: 'Decant & Serve', durationSec: 30, waterMultiplier: 1.0, instruction: 'Strain completely into cup.' }
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
      leafGrade: 'Unoxidized Buds & Young Leaves',
      description: 'Subtle, sweet, and velvety texture with notes of honeysuckle and soft melon. Hand-harvested spring buds with silver downy hairs.',
      preferredCoffeeTypes: 'Fujian Silver Needle (Bai Hao Yin Zhen) & White Peony. Whole unoxidized buds rich in delicate melon and honeysuckle floral oils.',
      phases: [
        { name: 'Vessel Preheat', durationSec: 15, waterMultiplier: 0, instruction: 'Warm ceramic teapot with warm water.' },
        { name: 'Long Floral Infusion', durationSec: 180, waterMultiplier: 1.0, instruction: 'Steep untouched at 83°C to unlock delicate essential oils.' },
        { name: 'Decant', durationSec: 30, waterMultiplier: 1.0, instruction: 'Strain fully to prevent over-steeping the leaves.' }
      ]
    },
    {
      id: 'turmeric_tea',
      name: 'Golden Turmeric Botanical Tea (Herbal Infusion)',
      category: 'tea',
      featured: true,
      heroImage: './tea_ceremony.jpg',
      ratio: 40, // 1g botanicals per 40ml water
      defaultCupMl: 250,
      tempC: 98,
      tempF: 208,
      leafGrade: 'Crushed Organic Turmeric Root & Botanicals',
      description: 'Caffeine-free wellness infusion combining golden turmeric root, ginger, lemongrass, black pepper (for curcumin absorption), and raw honey.',
      preferredCoffeeTypes: 'Organic Alleppey Turmeric root, ginger root, lemongrass, black pepper, and cinnamon bark.',
      phases: [
        { name: 'Botanical Hydration', durationSec: 15, waterMultiplier: 0, instruction: 'Place crushed turmeric and botanicals into infuser.' },
        { name: 'Deep Botanical Steep', durationSec: 300, waterMultiplier: 1.0, instruction: 'Steep 5 minutes with boiling 98°C water for rich golden extraction.' },
        { name: 'Honey & Citrus Stir', durationSec: 30, waterMultiplier: 1.0, instruction: 'Stir in raw honey and squeeze of fresh lemon.' }
      ]
    }
  ],
  beer: [
    {
      id: 'hazy_ipa',
      name: 'New England Hazy DIPA (Juicy Hop Bomb)',
      category: 'beer',
      featured: true,
      heroImage: './beer_hazy_dipa_hero.jpg',
      ratio: 1.35,
      defaultCupMl: 473,
      tempC: 66,
      tempF: 151,
      servingTempF: '44°F - 48°F (7°C - 9°C)',
      abvRange: '8.0% - 8.5% ABV',
      ibuRange: '50 - 65 IBU',
      srmColor: '4 - 6 SRM (Hazy Golden Straw)',
      glassware: 'Tulip Glass or Nonic Pint',
      leafGrade: 'Citra, Mosaic & Galaxy Double Dry-Hopped',
      description: 'Juicy, tropical, and pillowy mouthfeel loaded with mango, passionfruit, and guava aromatics. Flaked oats and wheat create a velvety body with low perception bitterness.',
      preferredCoffeeTypes: 'US Pacific Northwest Citra, Mosaic, El Dorado, and Australian Galaxy hops paired with Maris Otter & Flaked Oats.',
      phases: [
        { name: 'Saccharification Mash Rest', durationSec: 3600, waterMultiplier: 1.0, instruction: 'Mash in at 151°F (66°C) for 60 minutes to convert starches into fermentable sugars.' },
        { name: 'Lauter & Hop Boil (60 Min)', durationSec: 3600, waterMultiplier: 1.0, instruction: 'Boil wort for 60 mins. Add bittering hops @ 60m and aroma hops @ 15m.' },
        { name: 'Flameout Whirlpool Steep', durationSec: 1200, waterMultiplier: 1.0, instruction: 'Cool to 175°F (80°C) and whirlpool hops for 20 minutes for massive fruit oils without bitterness.' },
        { name: 'Chill & Yeast Pitch', durationSec: 600, waterMultiplier: 1.0, instruction: 'Chill wort rapidly to 66°F (19°C) and pitch London Ale III / Verdant IPA yeast.' }
      ]
    },
    {
      id: 'imperial_stout',
      name: 'Imperial Stout (Bourbon Barrel & Dark Cocoa)',
      category: 'beer',
      featured: true,
      heroImage: './beer_stout_hero.jpg',
      ratio: 1.25,
      defaultCupMl: 355,
      tempC: 68,
      tempF: 154,
      servingTempF: '52°F - 58°F (11°C - 14°C)',
      abvRange: '10.5% - 13.0% ABV',
      ibuRange: '65 - 85 IBU',
      srmColor: '40+ SRM (Jet Black Pitch)',
      glassware: 'Snifter or Oversized Glencairn',
      leafGrade: 'Roasted Barley, Chocolate Malt & Bourbon Oak Chips',
      description: 'Opaque black, viscous body brimming with dark chocolate fudge, espresso beans, toasted vanilla, and warming bourbon alcohol complexity.',
      preferredCoffeeTypes: 'Heavy roasted barley, Black Patent, Chocolate Rye, and Carafa Special III with East Kent Goldings hops.',
      phases: [
        { name: 'High Temp Mash Rest', durationSec: 3600, waterMultiplier: 1.0, instruction: 'Mash thick at 154°F (68°C) for high dextrins and unfermentable body sweetness.' },
        { name: 'Vigorous Wort Boil (90 Min)', durationSec: 5400, waterMultiplier: 1.0, instruction: 'Boil for 90 minutes to concentrate sugars and develop rich Maillard melanoidins.' },
        { name: 'Flameout & Rest', durationSec: 900, waterMultiplier: 1.0, instruction: 'Whirlpool additions and cool wort for high-gravity yeast strain pitch.' }
      ]
    },
    {
      id: 'west_coast_ipa',
      name: 'West Coast IPA (Piney Resin & Crisp Bitterness)',
      category: 'beer',
      featured: false,
      heroImage: './beer_west_coast_hero.jpg',
      ratio: 1.35,
      defaultCupMl: 473,
      tempC: 65,
      tempF: 149,
      servingTempF: '42°F - 46°F (5°C - 8°C)',
      abvRange: '6.8% - 7.5% ABV',
      ibuRange: '65 - 80 IBU',
      srmColor: '6 - 8 SRM (Deep Amber Gold)',
      glassware: 'IPA Glass or West Coast Shaker Pint',
      leafGrade: 'Centennial, Simcoe, Cascade & Chinook Hops',
      description: 'Crystal-clear golden-amber pour with assertive pine resin, grapefruit peel, and damp forest floor bitterness finishing bone-dry.',
      preferredCoffeeTypes: 'Classic C-Hops (Cascade, Centennial, Columbus, Chinook) paired with 2-Row Pale Malt and Crystal 40L.',
      phases: [
        { name: 'Dry Mash Rest', durationSec: 3600, waterMultiplier: 1.0, instruction: 'Mash low at 149°F (65°C) for maximum fermentability and crisp dry finish.' },
        { name: 'Vigorous Hop Boil (60 Min)', durationSec: 3600, waterMultiplier: 1.0, instruction: 'Boil 60 minutes with bittering, 30m, 15m, and 0m hop additions.' },
        { name: 'Whirlpool & Chill', durationSec: 900, waterMultiplier: 1.0, instruction: 'Whirlpool piney hops and chill rapidly to 65°F (18°C) for US-05 Chico yeast pitch.' }
      ]
    },
    {
      id: 'german_pilsner',
      name: 'German Pilsner (Crisp Noble Saaz & Hallertau)',
      category: 'beer',
      featured: true,
      heroImage: './beer_pilsner_hero.jpg',
      ratio: 1.40,
      defaultCupMl: 500,
      tempC: 64,
      tempF: 148,
      servingTempF: '38°F - 42°F (3°C - 5°C)',
      abvRange: '4.8% - 5.2% ABV',
      ibuRange: '32 - 40 IBU',
      srmColor: '2 - 4 SRM (Brilliant Pale Straw)',
      glassware: 'Tall Pilsner Flute or Dimpled Stein',
      leafGrade: '100% German Weyermann Pilsner Malt & Saaz Hops',
      description: 'Brilliant straw-gold lager topped with thick snowy foam. Crackery malt sweetness balanced by snappy, floral, spicy Noble hop bite.',
      preferredCoffeeTypes: 'German Barke Pilsner Malt, Hallertauer Mittelfrüh, and Czech Saaz Noble hops.',
      phases: [
        { name: 'Step Mash Rest', durationSec: 3600, waterMultiplier: 1.0, instruction: 'Mash at 148°F (64°C) for crisp attenuation.' },
        { name: 'Boil & Noble Hops (90 Min)', durationSec: 5400, waterMultiplier: 1.0, instruction: 'Boil 90 minutes to drive off DMS. Add Noble hops at 60m and 15m.' },
        { name: 'Cold Lager Ferment', durationSec: 600, waterMultiplier: 1.0, instruction: 'Chill to 50°F (10°C) and pitch Bavarian Lager yeast for 4-week cold lagering.' }
      ]
    },
    {
      id: 'belgian_saison',
      name: 'Belgian Saison (Spicy Peppery Farmhouse Ale)',
      category: 'beer',
      featured: false,
      heroImage: './tea_ceremony.jpg',
      ratio: 1.35,
      defaultCupMl: 375,
      tempC: 65,
      tempF: 149,
      servingTempF: '45°F - 50°F (7°C - 10°C)',
      abvRange: '6.2% - 6.8% ABV',
      ibuRange: '25 - 35 IBU',
      srmColor: '4 - 7 SRM (Hazy Sunburst Yellow)',
      glassware: 'Stemmed Chalice or Tulip Glass',
      leafGrade: 'Pilsner Malt, Wheat, Styrian Goldings & French Saison Yeast',
      description: 'Effervescent, dry farmhouse ale with complex peppery spice, clove, white pear, and earthy herbal notes driven by warm Belgian yeast.',
      preferredCoffeeTypes: 'Belgian Pilsner malt, Torrified Wheat, East Kent Goldings, and French Saison yeast strain.',
      phases: [
        { name: 'Attenuative Mash Rest', durationSec: 3600, waterMultiplier: 1.0, instruction: 'Mash low at 149°F (65°C) to ensure bone-dry fermentability.' },
        { name: 'Boil & Spice Addition (60 Min)', durationSec: 3600, waterMultiplier: 1.0, instruction: 'Boil 60 minutes. Add bittering hops and optional crushed coriander @ 10m.' },
        { name: 'Warm Yeast Pitch', durationSec: 600, waterMultiplier: 1.0, instruction: 'Pitch yeast at 72°F (22°C) and allow free rise up to 80°F (27°C) for spicy esters.' }
      ]
    },
    {
      id: 'sour_gose',
      name: 'German Gose & Sour Ale (Tart Salted Coriander)',
      category: 'beer',
      featured: false,
      heroImage: './chemex_hero.jpg',
      ratio: 1.35,
      defaultCupMl: 473,
      tempC: 66,
      tempF: 150,
      servingTempF: '40°F - 45°F (4°C - 7°C)',
      abvRange: '4.2% - 4.8% ABV',
      ibuRange: '8 - 12 IBU',
      srmColor: '3 - 5 SRM (Pale Cloudy Gold)',
      glassware: 'Stange or Goblet',
      leafGrade: 'Lactobacillus Sour Kettle, Sea Salt & Cracked Coriander',
      description: 'Refreshing wheat sour ale featuring a crisp lactic lemon tartness, subtle pink Himalayan sea salt mineral balance, and herbal coriander.',
      preferredCoffeeTypes: 'Unmalted Wheat, Pilsner Malt, Lactobacillus Plantarum souring culture, and Indian coriander.',
      phases: [
        { name: 'Mash & Kettle Sour Rest', durationSec: 3600, waterMultiplier: 1.0, instruction: 'Mash at 150°F (66°C). Cool to 100°F (38°C) and pitch Lactobacillus for 24h kettle souring.' },
        { name: 'Boil with Salt & Coriander', durationSec: 3600, waterMultiplier: 1.0, instruction: 'Boil 60 minutes. Add sea salt and cracked coriander @ 10 minutes.' },
        { name: 'Chill & Ferment', durationSec: 600, waterMultiplier: 1.0, instruction: 'Chill wort to 68°F (20°C) and pitch clean German ale yeast.' }
      ]
    },
    {
      id: 'hefeweizen',
      name: 'Bavarian Hefeweizen (Banana & Clove Wheat Ale)',
      category: 'beer',
      featured: true,
      heroImage: './drip_brewer_hero.jpg',
      ratio: 1.40,
      defaultCupMl: 500,
      tempC: 66,
      tempF: 151,
      servingTempF: '42°F - 46°F (5°C - 8°C)',
      abvRange: '5.0% - 5.4% ABV',
      ibuRange: '10 - 15 IBU',
      srmColor: '4 - 8 SRM (Cloudy Amber Straw)',
      glassware: 'Tall Weizen Glass',
      leafGrade: '50%+ German Malted Wheat & Weihenstephan Yeast',
      description: 'Unfiltered cloudy gold wheat beer featuring signature aromas of ripe banana esters, clove, nutmeg, and fluffy wheat bread crust.',
      preferredCoffeeTypes: 'Bavarian Dark Wheat, Pilsner Malt, Hallertauer Hersbrucker hops, and Weihenstephan WLP300 yeast.',
      phases: [
        { name: 'Ferulic Acid & Saccharification Rest', durationSec: 3600, waterMultiplier: 1.0, instruction: 'Mash at 113°F (45°C) for 15m for ferulic acid clove precursor, then 151°F (66°C) for 45m.' },
        { name: 'Gentle Hop Boil (60 Min)', durationSec: 3600, waterMultiplier: 1.0, instruction: 'Boil 60 mins with low IBU Hallertau noble hops @ 60m.' },
        { name: 'Ferment Unfiltered', durationSec: 600, waterMultiplier: 1.0, instruction: 'Chill to 64°F (18°C) for balanced banana-clove ester ratio.' }
      ]
    },
    {
      id: 'amber_ale',
      name: 'American Amber Ale (Toasted Caramel & Cascade)',
      category: 'beer',
      featured: false,
      heroImage: './french_press.jpg',
      ratio: 1.35,
      defaultCupMl: 473,
      tempC: 67,
      tempF: 152,
      servingTempF: '45°F - 50°F (7°C - 10°C)',
      abvRange: '5.5% - 6.2% ABV',
      ibuRange: '30 - 40 IBU',
      srmColor: '11 - 16 SRM (Coppery Amber Red)',
      glassware: 'Nonic Pint or English Ale Glass',
      leafGrade: 'Crystal 60L Caramel Malt & Cascade Hops',
      description: 'Harmonious balance of toasted caramel sweetness, biscuit malt, and classic American citrus Cascade hop aromatics with a clean amber finish.',
      preferredCoffeeTypes: 'American 2-Row, Crystal 60L, Munich Malt, and Cascade / Willamette hops.',
      phases: [
        { name: 'Mash Rest', durationSec: 3600, waterMultiplier: 1.0, instruction: 'Mash at 152°F (67°C) for medium body and caramel sweetness.' },
        { name: 'Boil (60 Min)', durationSec: 3600, waterMultiplier: 1.0, instruction: 'Boil 60 minutes with Cascade additions @ 60m, 15m, and 5m.' },
        { name: 'Chill & Ferment', durationSec: 600, waterMultiplier: 1.0, instruction: 'Chill to 67°F (19°C) and pitch California Ale yeast.' }
      ]
    },
    {
      id: 'porter',
      name: 'Robust Porter (Dark Chocolate & Roasted Malt)',
      category: 'beer',
      featured: false,
      heroImage: './espresso_hero.jpg',
      ratio: 1.30,
      defaultCupMl: 473,
      tempC: 67,
      tempF: 153,
      servingTempF: '48°F - 54°F (9°C - 12°C)',
      abvRange: '5.8% - 6.5% ABV',
      ibuRange: '35 - 45 IBU',
      srmColor: '25 - 35 SRM (Deep Dark Ruby Black)',
      glassware: 'Nonic Pint or English Tankard',
      leafGrade: 'Chocolate Malt, Black Patent & Fuggle Hops',
      description: 'Dark ruby-black ale offering layers of baker’s cocoa, dark toasted bread, mild espresso roastiness, and earthy English hop undertones.',
      preferredCoffeeTypes: 'Pale Ale Malt, Chocolate Malt, Caramel 80L, Black Patent, and Fuggle / Willamette hops.',
      phases: [
        { name: 'Full Body Mash Rest', durationSec: 3600, waterMultiplier: 1.0, instruction: 'Mash at 153°F (67°C) for velvety mouthfeel.' },
        { name: 'Boil (60 Min)', durationSec: 3600, waterMultiplier: 1.0, instruction: 'Boil 60 minutes with bittering hops @ 60m and aroma hops @ 15m.' },
        { name: 'Ferment', durationSec: 600, waterMultiplier: 1.0, instruction: 'Chill to 66°F (19°C) and pitch English Ale yeast.' }
      ]
    },
    {
      id: 'belgian_tripel',
      name: 'Belgian Tripel (Golden Strong Abbey Ale)',
      category: 'beer',
      featured: true,
      heroImage: './tea_ceremony.jpg',
      ratio: 1.35,
      defaultCupMl: 330,
      tempC: 65,
      tempF: 149,
      servingTempF: '46°F - 52°F (8°C - 11°C)',
      abvRange: '8.5% - 9.5% ABV',
      ibuRange: '30 - 40 IBU',
      srmColor: '4 - 7 SRM (Glowing Golden Yellow)',
      glassware: 'Trappist Goblet or Chalice',
      leafGrade: 'Belgian Pilsner Malt, Clear Candi Sugar & Saaz Hops',
      description: 'Complex, glowing golden abbey ale with deceptively smooth strength. Notes of spicy clove, fruity banana esters, honeyed candi sugar, and dry warming alcohol.',
      preferredCoffeeTypes: 'Belgian Pilsner Malt, Belgian Clear Candi Sugar, Styrian Goldings, Saaz, and Westmalle Trappist yeast.',
      phases: [
        { name: 'Highly Attenuative Mash', durationSec: 3600, waterMultiplier: 1.0, instruction: 'Mash low at 149°F (65°C) to maximize fermentable sugars.' },
        { name: 'Boil with Candi Sugar (90 Min)', durationSec: 5400, waterMultiplier: 1.0, instruction: 'Boil 90 minutes. Add clear Belgian Candi sugar @ 15m to boost ABV while keeping body light.' },
        { name: 'Trappist Fermentation', durationSec: 600, waterMultiplier: 1.0, instruction: 'Chill to 68°F (20°C) and pitch Belgian Abbey yeast, letting temperature rise to 76°F (24°C).' }
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
  ],
  tea: [
    {
      id: 'fujian_china',
      country: 'Fujian Province, China',
      flag: '🇨🇳',
      macroRegion: 'East Asia (Birthplace of White & Oolong Tea)',
      regions: 'Fuding, Zhenghe, Anxi County, Wuyi Mountains',
      altitude: '600 - 1,400 meters',
      soilType: 'Red Acidic Volcanic Clay & Rocky Granite Scree',
      climate: 'Humid subtropical mist with heavy mountain dew cycles',
      genetics: 'Fuding Da Bai, Zhenghe Da Bai, Anxi Tieguanyin Cultivars',
      processing: 'Sun-Withered White Tea & Semi-Oxidized Rolled Oolong',
      flavorNotes: ['Honeysuckle Floral', 'Fresh Melon', 'Orchid Blossom', 'Chestnut Sweetness', 'Velvety Body'],
      acidProfile: 'Subtle Sweet L-Theanine Amino Acids',
      agronomyDeepDive: 'Fujian is the historic birthplace of white tea and Gongfu oolong. Cool ocean mountain mists and iron-rich acidic soils encourage tea buds to develop dense silver trichome hairs packed with L-theanine and floral essential oils.',
      roastPairing: 'Light Sun-Withered to Medium Charcoal Roast',
      recommendedMethod: 'Specialty Green & White Tea (83°C)',
      famousTeas: ['Silver Needle White Tea', 'Iron Goddess of Mercy (Tieguanyin)'],
      steepStyle: '80°C - 88°C Gongfu Steeping',
      sourcedBrands: [
        { name: 'Ippodo Tea Co.', offering: 'Fuding Silver Needle & Imperial Jasmine', note: 'Hand-picked spring buds with honeysuckle nectar, fresh melon, and velvety clarity.' },
        { name: 'In Pursuit of Tea', offering: 'Anxi Master Grade Autumn Tieguanyin', note: 'Traditional charcoal-roasted oolong with orchid aromatics and lingering sweet aftertaste.' },
        { name: 'Verdant Tea', offering: 'Zhenghe First Flush White Peony (Bai Mu Dan)', note: 'Sun-dried whole buds and leaves releasing wild honey, apricot, and soft floral finish.' }
      ]
    },
    {
      id: 'uji_japan',
      country: 'Uji, Kyoto, Japan',
      flag: '🇯🇵',
      macroRegion: 'East Asia (Shaded Gyokuro & Matcha Terroir)',
      regions: 'Uji, Kyotanabe, Shirakawa, Wazuka Valley',
      altitude: '200 - 600 meters',
      soilType: 'Rich Alluvial River Basin Soil along the Uji River',
      climate: 'Cool damp morning fog with high temperature swings between day & night',
      genetics: 'Yabukita, Gokou, Samidori, Asahi Camellia sinensis Cultivars',
      processing: '20-Day Tana Rice-Straw Shading, Steaming (Aracha), & Stone Milling',
      flavorNotes: ['Deep Seaweed Umami', 'Sweet Buttered Edamame', 'Fresh Steamed Spinach', 'Zero Tannin Bitterness'],
      acidProfile: 'High Glutamic Acid & Umami Sweetness',
      agronomyDeepDive: 'Uji is Japan’s most revered tea terroir. Rice-straw shading mats (Tana) block 90% of sunlight for 20 days prior to spring harvest, preventing L-theanine amino acids from converting into astringent tannins and creating thick savory umami.',
      roastPairing: 'Deep Steamed (Fukamushi) Green Tea',
      recommendedMethod: 'Specialty Green Tea (75°C - 78°C)',
      famousTeas: ['Uji Ceremonial Matcha', 'Gyokuro Shadow Green Tea'],
      steepStyle: '60°C - 78°C Low-Temp Steeping',
      sourcedBrands: [
        { name: 'Ippodo Tea Co. Kyoto', offering: 'Uji Ceremonial Ummon Matcha & Kan-no-shiro', note: 'Kyoto stone-ground spring matcha with rich jade froth, brothy umami, and zero bitterness.' },
        { name: 'Kettl Tea', offering: 'Wazuka Gokou Gyokuro Single Cultivar', note: 'Shaded 21 days with buttered edamame sweetness, oceanic breeze, and deep green liqueur.' },
        { name: 'Den’s Tea', offering: 'Deep-Steamed Uji Sencha Extra Fine', note: 'Rich emerald green tea with sweet grassy notes and soothing savory mouthfeel.' }
      ]
    },
    {
      id: 'wuyi_china',
      country: 'Wuyi Mountains, China',
      flag: '🇨🇳',
      macroRegion: 'East Asia (UNESCO Rock Oolong & Lapsang Souchong)',
      regions: 'Wuyishan National Park, Zhengyan Inner Rock Escarpments',
      altitude: '700 - 1,200 meters',
      soilType: 'Red Conglomerate Sandstone & Weathered Volcanic Mineral Scree',
      climate: 'Sheltered gorge microclimates with perpetual mountain springs',
      genetics: 'Da Hong Pao, Rou Gui, Shui Xian, Lapsang Small Bush Cultivars',
      processing: 'Pine-Smoked Black Tea & Multi-Stage Charcoal Pit Roasting',
      flavorNotes: ['Mineral Rock Yan Yun', 'Roasted Honey', 'Smoky Pine Tar', 'Dried Longan Fruit', 'Spiced Cinnamon'],
      acidProfile: 'Mineral-Rich Tannin Structure',
      agronomyDeepDive: 'High in UNESCO-protected red sandstone gorges, Wuyi rock teas (Yancha) absorb volcanic minerals from cliff springs. Roasted over bamboo charcoal pits for up to 24 hours, they yield legendary "Yan Yun" (Rock Rhyme) depth.',
      roastPairing: 'Heavy Charcoal Fire Roasted',
      recommendedMethod: 'Oolong Tea Gongfu Style (88°C - 95°C)',
      famousTeas: ['Da Hong Pao (Big Red Robe)', 'Smoky Lapsang Souchong'],
      steepStyle: '90°C - 95°C Boiling Flash Infusion',
      sourcedBrands: [
        { name: 'Red Blossom Tea Company', offering: 'Zhengyan Master Da Hong Pao Rock Oolong', note: 'Cliff-grown hand-roasted Yancha with stone mineral depth, roasted peach, and Yan Yun finish.' },
        { name: 'Song Tea & Ceramics', offering: 'Wuyi Cliffside Rou Gui (Cinnamon Oolong)', note: 'Intense spicy cinnamon aroma, toasted walnut, and persistent sweet throat resonance.' },
        { name: 'Mei Leaf', offering: 'Traditional Pine-Smoked Lapsang Souchong', note: 'Smoked over wild Horsetail pine wood with dried longan fruit, sweet pipe resin, and malt.' }
      ]
    },
    {
      id: 'darjeeling_india',
      country: 'Darjeeling, India',
      flag: '🇮🇳',
      macroRegion: 'South Asia (Champagne of Teas)',
      regions: 'Himalayan Foothills, Kurseong Valley, Mirik, Kalimpong',
      altitude: '1,200 - 2,000 meters',
      soilType: 'Porous Mountain Loam rich in Organic Forest Leaf Residue',
      climate: 'Chilly Himalayan mist currents with high ultraviolet sunlight radiation',
      genetics: 'Sinensis & China Hybrid High-Altitude Bush Selections',
      processing: 'Lightly Oxidized 1st Flush & Rich Muscatel 2nd Flush Harvests',
      flavorNotes: ['Muscatel Grape', 'Crisp Peach Skin', 'Wildflower Honey', 'Brilliant Amber Liqueur', 'Citrus Zest'],
      acidProfile: 'Crisp Sparkling Malic Acidity',
      agronomyDeepDive: 'Perched on high Himalayan slopes facing Mt. Kanchenjunga, high UV light and mountain chill slow leaf growth. 1st Flush spring harvests produce pale green cups with sparkling muscatel grape clarity.',
      roastPairing: 'Un-roasted Orthodox Whole Leaf',
      recommendedMethod: 'Full-Leaf Black Tea (95°C)',
      famousTeas: ['Darjeeling 1st Flush Spring Harvest', 'Darjeeling 2nd Flush Muscatel'],
      steepStyle: '88°C - 96°C 4-Minute Steep',
      sourcedBrands: [
        { name: 'Vahdam India Direct', offering: 'Darjeeling Summer 2nd Flush Arya Estate', note: 'Single estate muscatel black tea with notes of ripe passionfruit, wild honey, and amber clarity.' },
        { name: 'Fortnum & Mason London', offering: 'Famous Darjeeling Jungpana Estate 1st Flush', note: 'Iconic London tea merchant lot with delicate peach blossom, white grape, and crisp astringency.' },
        { name: 'Harney & Sons', offering: 'Darjeeling Superfine Tippy Golden Flowery Orange Pekoe', note: 'Classic Himalayan tea with muscatel grape body, floral aroma, and smooth finish.' }
      ]
    },
    {
      id: 'yunnan_china',
      country: 'Yunnan Province, China',
      flag: '🇨🇳',
      macroRegion: 'East Asia (Ancient Wild Tea Trees & Aged Pu-erh)',
      regions: 'Xishuangbanna, Menghai, Lincang, Pu’er City',
      altitude: '1,400 - 2,200 meters',
      soilType: 'Deep Tropical Forest Humus & Red Clay',
      climate: 'Subtropical monsoon jungle with 800-year-old ancient wild tea trees (Gushu)',
      genetics: 'Camellia sinensis var. assamica (Large-Leaf Broad Cultivars)',
      processing: 'Sun-Dried Sheng Raw Pu-erh & Pile-Fermented Shou Ripe Pu-erh Cakes',
      flavorNotes: ['Damp Forest Floor', 'Rich Sweet Molasses', 'Camphor & Pipe Tobacco', 'Aged Plum', 'Dark Bittersweet Cocoa'],
      acidProfile: 'Deep Earthy Low-Acidity Microbial Ferment',
      agronomyDeepDive: 'Yunnan is home to 1,000-year-old wild tea trees. Leaves harvested from large-leaf Daye cultivars are compressed into tea cakes and aged for decades to develop deep earthiness, camphor, and dark cocoa sweetness.',
      roastPairing: 'Wet Pile Microbial Post-Fermented',
      recommendedMethod: 'Pu-erh & Herbal Infusions (98°C)',
      famousTeas: ['Aged Shou Ripe Pu-erh Tea Cakes', 'Wild Spring Sheng Raw Pu-erh'],
      steepStyle: '98°C Boiling Rinse & Multi-Steep',
      sourcedBrands: [
        { name: 'Yunnan Sourcing', offering: 'Menghai 10-Year Aged Shou Ripe Pu-erh Cake', note: 'Smooth post-fermented tea cake with sweet damp earth, camphor wood, and dark chocolate liqueur.' },
        { name: 'White2Tea', offering: 'Ancient Tree Spring Sheng Raw Pu-erh (Gushu)', note: 'Hand-panned wild large leaf tea boasting stone fruit nectar, powerful Cha Qi energy, and honeysuckle.' },
        { name: 'Global Tea Hut', offering: 'Lincang Wild Large-Leaf Dian Hong Black Tea', note: 'Golden tipped jungle black tea with rich malt, sweet yam, and floral cocoa complexity.' }
      ]
    }
  ],
  beer: [
    {
      id: 'yakima_valley',
      country: 'USA (Pacific Northwest)',
      flag: '🇺🇸',
      macroRegion: 'Yakima Valley, Washington (Hop Capital of America)',
      regions: 'Moxee Valley, Lower Yakima, Benton City',
      altitude: '200 - 400 meters',
      soilType: 'Volcanic Silt Loam & Glacial Wash',
      climate: 'Arid desert climate with 300+ sunny days, irrigated by Cascade snowmelt',
      genetics: 'Citra (HBC 394), Mosaic (HBC 369), Simcoe, Cascade, Amarillo',
      processing: 'Pelletized T-90, Cryo Hops & Fresh Hop Kiln Drying',
      flavorNotes: ['Juicy Mango', 'Passionfruit', 'Damp Pine Resin', 'Grapefruit Zest', 'Sweet Papaya'],
      acidProfile: 'High Alpha Acids (11% - 15%) & Rich Essential Oils',
      agronomyDeepDive: 'Yakima Valley produces over 75% of total US hop harvests. Intense desert sunshine combined with Cascade volcanic soil produces world-renowned aroma hops bursting with thiols, myrcene, and tropical citrus oils that define American IPAs.',
      roastPairing: 'Light Pilsner & Pale Malt Grain Bills',
      recommendedMethod: 'New England Hazy IPA & West Coast IPA',
      sourcedBrands: [
        { name: 'Yakima Chief Hops (YCH)', offering: 'Cryo Hops Citra & Mosaic Blend', note: 'Concentrated lupulin powder delivering explosive mango, guava, and pine aromatics.' },
        { name: 'Haas Hop Breeding', offering: 'Sabro & Citra Microlots', note: 'Coconut cream, tangerine zest, and tropical fruit complexity.' }
      ]
    },
    {
      id: 'hallertau_germany',
      country: 'Germany (Bavaria)',
      flag: '🇩🇪',
      macroRegion: 'Hallertau, Bavaria (World’s Largest Continuous Hop Region)',
      regions: 'Mainburg, Wolnzach, Nandlstadt',
      altitude: '350 - 500 meters',
      soilType: 'Rich Loess & Sandy Clay Loam',
      climate: 'Moderate continental Bavarian climate with abundant summer rain',
      genetics: 'Hallertauer Mittelfrüh, Hersbrucker, Tradition, Tettnang',
      processing: 'Whole Leaf Kiln Drying & Gentle Air Curing',
      flavorNotes: ['Herbal Chamomile', 'Spicy Black Pepper', 'Floral Blossom', 'Woodsy Cedar', 'Subtle Earth'],
      acidProfile: 'Low Alpha Acids (3.5% - 5.5%), High Humulene & Caryophyllene Oils',
      agronomyDeepDive: 'Hallertau has cultivated hops for over 1,200 years. The moist Bavarian soil and mild summer climate yield classic "Noble" hops characterized by soft, elegant spicy florals, herbal chamomile, and refined bitterness without harsh astringency.',
      roastPairing: 'Weyermann German Barke Pilsner & Vienna Malt',
      recommendedMethod: 'German Pilsner, Hefeweizen & Oktoberfest Lager',
      sourcedBrands: [
        { name: 'Weyermann Malting & Hop Reserve', offering: 'Hallertauer Mittelfrüh Noble Hops', note: 'Classic German lager hop offering refined herbal spice, floral jasmine, and crisp balance.' }
      ]
    },
    {
      id: 'saaz_czech',
      country: 'Czech Republic (Bohemia)',
      flag: '🇨🇿',
      macroRegion: 'Žatec (Saaz) Hop Region, Bohemia',
      regions: 'Žatec, Louny, Rakovník',
      altitude: '200 - 300 meters',
      soilType: 'Red Permian Iron-Rich Clay Soils (Červenka)',
      climate: 'Sheltered by Ore Mountains with mild rain shadows',
      genetics: 'Žatecký Poloraný Červeňák (Classic Bohemian Saaz)',
      processing: 'Traditional Low-Temperature Kiln Drying',
      flavorNotes: ['Spicy Noble Pepper', 'Woodsy Pine', 'Fresh Herbal Thyme', 'Earthy Clay', 'Subtle Floral'],
      acidProfile: 'Delicate Alpha Acid (2.5% - 4.0%), High Farnesene Oil',
      agronomyDeepDive: 'Famous as the backbone of original Bohemian Pilsner lagers since 1842. Grown in Žatec’s red iron-rich clay soils, Saaz hops impart a unique spicy, herbal, and earthy aroma with a soft, clean bitterness.',
      roastPairing: 'Bohemian Floor-Malted Pilsner Malt',
      recommendedMethod: 'Bohemian Pilsner & Belgian Abbey Ales',
      sourcedBrands: [
        { name: 'Bohemian Hop Growers Guild', offering: 'Certified Saaz Noble Microlot', note: 'Delicate herbal spice, earthy pepper, and soft floral finish.' }
      ]
    }
  ]
};

export const MASTERCLASSES = [
  // --- COFFEE MASTERCLASSES (track: 'coffee') ---
  {
    id: 'mc_mokapot_bialetti',
    track: 'coffee',
    methodId: 'moka_pot',
    method: 'Moka Pot',
    title: 'Mastering the Stovetop Moka Pot (Bialetti Technique & Water Preheat)',
    duration: '5:15',
    thumbnail: './moka_pot_hero.jpg',
    embedId: 'vFcS01wMSxM',
    description: 'Learn how preheating water in the lower chamber and stopping extraction with a cold towel prevents metallic burnt bitterness in Moka Pot coffee.',
    keyTakeaways: [
      'Fill lower chamber with boiling water to prevent overheating coffee grounds',
      'Do not tamp grounds tightly in funnel basket',
      'Wrap base in cold wet towel immediately when sputtering begins'
    ]
  },
  {
    id: 'mc_mokapot_beans',
    track: 'coffee',
    methodId: 'moka_pot',
    method: 'Moka Pot',
    title: 'Preferred Coffee Beans & Fine-Medium Grind for Moka Pot',
    duration: '4:20',
    thumbnail: './moka_pot_hero.jpg',
    embedId: 'vFcS01wMSxM',
    description: 'Why medium-dark Italian roasts, Brazilian Yellow Bourbon, and 350-500 µm table salt grinds produce rich crema and syrupy espresso-like body.',
    keyTakeaways: [
      'Grind slightly coarser than espresso (table salt texture)',
      'Choose low-acidity beans rich in dark chocolate & toasted hazelnut notes'
    ]
  },
  {
    id: 'mc_chemex_technique',
    track: 'coffee',
    methodId: 'chemex',
    method: 'Chemex Glass Brewer',
    title: 'Mastering the Chemex Glass Brewer & Bonded Filters',
    duration: '5:30',
    thumbnail: './chemex_hero.jpg',
    embedId: '1oB1oDrDkHM',
    description: 'Learn how thick bonded paper filters and slow pulse pouring yield ultra-clean, sediment-free specialty coffee.',
    keyTakeaways: [
      'Use 3-fold thick side facing the spout to prevent air channel blockages',
      'Medium-Coarse grind size (650-800 µm) prevents filter clogging',
      'Rinse filter thoroughly with hot water before adding coffee grounds'
    ]
  },
  {
    id: 'mc_chemex_beans',
    track: 'coffee',
    methodId: 'chemex',
    method: 'Chemex Glass Brewer',
    title: 'Best Coffee Beans & Ratios for Chemex Clarity',
    duration: '4:45',
    thumbnail: './chemex_hero.jpg',
    embedId: 'AI4ynXzkSQo',
    description: 'Why light roast washed Ethiopian and Kenyan beans shine in Chemex with 1:16 ratio for floral notes.',
    keyTakeaways: [
      'Ideal for light washed roasts with delicate floral & fruit notes',
      'Thick paper filter removes bitter oils for pristine clarity'
    ]
  },
  {
    id: 'mc_classic_pourover_technique',
    track: 'coffee',
    methodId: 'classic_pour_over',
    method: 'Classic Pour Over',
    title: 'Mastering the Classic Pour Over (Universal Cone & Flat-Bottom Drippers)',
    duration: '4:30',
    thumbnail: './pourover_technique_thumb.jpg',
    embedId: 'AI4ynXzkSQo',
    description: 'Universal step-by-step masterclass covering bloom degassing, spiral pulse pouring, and maintaining a flat coffee bed across all pour-over drippers.',
    keyTakeaways: [
      'Pour 3x coffee weight for a 45-second bloom degassing phase',
      'Keep kettle spout low to prevent excessive agitation and clogging',
      'Maintain steady water bed level with 5g/sec spiral pulse pours'
    ]
  },
  {
    id: 'mc_classic_pourover_beans',
    track: 'coffee',
    methodId: 'classic_pour_over',
    method: 'Classic Pour Over',
    title: 'Best Coffee Beans & SCA 1:16 Golden Ratios for Pour Over',
    duration: '5:10',
    thumbnail: './golden_ratio_thumb.jpg',
    embedId: '1oB1oDrDkHM',
    description: 'Learn why the 1:16 ratio and medium-fine grind size produce sparkling acidity and rich floral sweetness in pour-over brewing.',
    keyTakeaways: [
      '1:16 ratio equals 60 grams of coffee per 1 Liter of water',
      'Ideal for washed Ethiopian, Guatemalan, and Colombian single origins',
      'Prevents sour under-extraction and bitter over-extraction'
    ]
  },
  {
    id: 'mc_pourover_v60',
    track: 'coffee',
    methodId: 'pour_over',
    method: 'Hario V60 Dripper',
    title: 'Hario V60 Concentric Pouring Technique',
    duration: '4:15',
    thumbnail: './pourover_technique_thumb.jpg',
    embedId: 'AI4ynXzkSQo',
    description: 'Learn how spiral pour rate, bed height, and water turbulence dictate extraction clarity in Hario V60 conical drippers.',
    keyTakeaways: [
      'Pour gently in center-outward concentric spirals',
      'Never hit paper walls directly to prevent water bypass',
      'Maintain steady thermal mass during bloom'
    ]
  },
  {
    id: 'mc_pourover_beans',
    track: 'coffee',
    methodId: 'pour_over',
    method: 'Hario V60 Dripper',
    title: 'Preferred Single-Origin Beans for Hario V60 Clarity',
    duration: '5:04',
    thumbnail: './pourover_beans_thumb.jpg',
    embedId: '1oB1oDrDkHM',
    description: 'Discover why high-altitude washed Ethiopian Yirgacheffe and Kenyan SL-28 excel under paper filter filtration.',
    keyTakeaways: [
      'Highlight sparkling citric acidity and jasmine bergamot florals',
      'Paper filter captures oils for tea-like body clarity',
      'Ideal for light to medium-light Nordic specialty roasts'
    ]
  },
  {
    id: 'mc_golden_ratio',
    track: 'coffee',
    methodId: 'pour_over',
    method: 'Hario V60 Dripper',
    title: 'The Golden Ratio of Coffee Brewing (1:16 & SCA Golden Cup Standard)',
    duration: '5:10',
    thumbnail: './golden_ratio_thumb.jpg',
    embedId: '1oB1oDrDkHM',
    description: 'Learn why the 1:16 coffee-to-water ratio is called the Golden Ratio by World Barista Champions and how it targets 18%-22% extraction yield.',
    keyTakeaways: [
      '1:16 ratio equals 60 grams of coffee per 1 Liter of water (~2 tbsp per 6 fl oz)',
      'Targets ideal 18% to 22% soluble extraction yield benchmark',
      'Prevents sour under-extraction (<18%) and bitter over-extraction (>22%)'
    ]
  },
  {
    id: 'mc_frenchpress_hoffmann',
    track: 'coffee',
    methodId: 'french_press',
    method: 'French Press',
    title: 'Ultimate French Press: Crust Breaking & Silt Skimming',
    duration: '5:30',
    thumbnail: './french_press_hero.jpg',
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
    track: 'coffee',
    methodId: 'french_press',
    method: 'French Press',
    title: 'French Press Bean Selection, Grind & Common Mistakes',
    duration: '4:15',
    thumbnail: './french_press_hero.jpg',
    embedId: 'VFj3Y6lC9D4',
    description: 'Learn why heavy-bodied Sumatran Giling Basah, Brazilian Yellow Bourbon, and medium-dark roasts shine best in immersion brewing, and how to avoid bitter over-extraction.',
    keyTakeaways: [
      'Choose low-acidity beans rich in natural oils and cocoa depth',
      'Coarse grind size prevents metal mesh clogging',
      'Pairs best with dark chocolate & toasted nut profiles'
    ]
  },
  {
    id: 'mc_frenchpress_coldbrew',
    track: 'coffee',
    methodId: 'french_press',
    method: 'French Press',
    title: 'French Press Cold Brew & Concentrated Iced Immersion',
    duration: '4:45',
    thumbnail: './french_press_hero.jpg',
    embedId: '4W2p0i3W_K0',
    description: 'Turn your French Press into an overnight 12-hour cold brew steep chamber to produce a smooth, chocolatey, low-acidity concentrate.',
    keyTakeaways: [
      'Use 1:8 coarse coffee-to-water ratio for cold brew concentrate',
      'Steep at room temp for 12-16 hours before depressing plunger',
      'Serve over ice with milk or cold foam'
    ]
  },
  {
    id: 'mc_drip_home',
    track: 'coffee',
    methodId: 'drip_brewer',
    method: 'Automatic Drip',
    title: 'Maximizing Your Home Drip Coffee Machine',
    duration: '3:45',
    thumbnail: './drip_brewer_hero.jpg',
    embedId: '8d-9Y2S92v0',
    description: 'Simple tweaks to get cafe-quality batch brew from standard home electric coffee makers.',
    keyTakeaways: [
      'Pre-rinse paper filters to eliminate papery taste',
      'Level coffee bed evenly before starting brew cycle',
      'Use filtered water with 120-150 ppm mineral content'
    ]
  },
  {
    id: 'mc_espresso_prep',
    track: 'coffee',
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
  {
    id: 'mc_aeropress_inverted',
    track: 'coffee',
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

  // --- TEA MASTERCLASSES (track: 'tea') ---
  {
    id: 'mc_darjeeling_tea',
    track: 'tea',
    methodId: 'darjeeling_tea',
    method: 'Himalayan Darjeeling',
    title: 'Mastering Himalayan Darjeeling First & Second Flush',
    duration: '4:45',
    thumbnail: './tea_kettle.jpg',
    embedId: '1oB1oDrDkHM',
    description: 'Learn how high-altitude 88°C steeping unlocks muscatel grape clarity and peach notes without harsh astringency.',
    keyTakeaways: [
      'Steep at 88°C (190°F) for 3 minutes for peak muscatel bouquet',
      'Use 1:50 ratio (1g tea per 50ml water) in porcelain or glass',
      'Preheat vessel to maintain steady water temperature'
    ]
  },
  {
    id: 'mc_chai_masala',
    track: 'tea',
    methodId: 'chai_masala',
    method: 'Masala Chai',
    title: 'Authentic Indian Masala Chai Decoction & Spiced Milk Brew',
    duration: '5:15',
    thumbnail: './tea_ceremony.jpg',
    embedId: '4r-rQ0Q9jH4',
    description: 'Simmering whole cardamom, Ceylon cinnamon, ginger root, and Assam black tea with milk and unrefined cane sugar.',
    keyTakeaways: [
      'Crush whole cardamom, cinnamon bark, and ginger root before simmering',
      'Boil spices & Assam CTC tea for 4 minutes to extract essential oils',
      'Add milk and Panela sugar, bring to gentle froth and strain'
    ]
  },
  {
    id: 'mc_english_breakfast',
    track: 'tea',
    methodId: 'english_breakfast',
    method: 'English Breakfast',
    title: 'English Breakfast Tea Steeping & Malty Blend Perfection',
    duration: '4:10',
    thumbnail: './tea_kettle.jpg',
    embedId: '8d-9Y2S92v0',
    description: 'How to steep robust Assam, Ceylon, and Kenyan black tea blends at 96°C for malty cocoa depth.',
    keyTakeaways: [
      'Steep Orthodox black tea at 96°C for 4 minutes',
      'Pairs perfectly with a splash of warm milk',
      'Remove leaves completely to prevent bitter tannin build-up'
    ]
  },
  {
    id: 'mc_earl_grey',
    track: 'tea',
    methodId: 'earl_grey',
    method: 'Earl Grey',
    title: 'Earl Grey Bergamot Essential Oil Extraction & Citrus Notes',
    duration: '4:20',
    thumbnail: './tea_ceremony.jpg',
    embedId: 'AI4ynXzkSQo',
    description: 'Steeping Calabrian bergamot-infused black tea at 95°C for fragrant citrus bouquet.',
    keyTakeaways: [
      'Steep at 95°C for 3.5 minutes without agitating leaves',
      'Natural cold-pressed bergamot oil releases sweet citrus aromatics',
      'Great black tea base for London Fog lattes'
    ]
  },
  {
    id: 'mc_green_steeping',
    track: 'tea',
    methodId: 'green_tea',
    method: 'Green Tea',
    title: 'Specialty Green Tea & Sencha Steeping Masterclass',
    duration: '4:10',
    thumbnail: './tea_ceremony.jpg',
    embedId: '4r-rQ0Q9jH4',
    description: 'Low-temperature 78°C steeping to preserve sweet grassy umami and avoid bitter tannin extraction.',
    keyTakeaways: [
      'Never use boiling water on green tea leaves (78°C is ideal)',
      'Steep for 2 minutes untouched in glass or Tokoname teapot',
      'Decant completely between infusions for multiple steeps'
    ]
  },
  {
    id: 'mc_matcha_tea',
    track: 'tea',
    methodId: 'matcha_tea',
    method: 'Ceremonial Matcha',
    title: 'Japanese Ceremonial Matcha Whisking Technique (Usucha)',
    duration: '4:50',
    thumbnail: './tea_ceremony.jpg',
    embedId: '1U_4OqUo_pE',
    description: 'Sifting ceremonial tencha powder and whisking with a bamboo Chasen into rich, creamy micro-foam.',
    keyTakeaways: [
      'Sift 2g matcha powder through fine sieve to eliminate clumps',
      'Whisk in rapid "W" motion using bamboo Chasen for 45 seconds',
      'Use 80°C water for smooth umami sweetness without bitterness'
    ]
  },
  {
    id: 'mc_gongfu_oolong',
    track: 'tea',
    methodId: 'oolong_tea',
    method: 'Oolong Tea',
    title: 'Gongfu Oolong Tea Washing & Flash Infusions',
    duration: '4:50',
    thumbnail: './tea_ceremony.jpg',
    embedId: 'j6VlT_jUVPc',
    description: 'Understand leaf awakening, gaiwan handling, temperature drop, and timing multi-steep oolongs.',
    keyTakeaways: [
      'Rinse leaves for 5-10s to open rolled tea balls',
      'Pour water down gaiwan rim to avoid burning delicate leaves',
      'Increase steep time by 5-10 seconds per subsequent infusion'
    ]
  },
  {
    id: 'mc_ceylon_tea',
    track: 'tea',
    methodId: 'ceylon_tea',
    method: 'Ceylon Tea',
    title: 'Sri Lankan High-Grown Ceylon Tea Steeping Masterclass',
    duration: '4:15',
    thumbnail: './tea_kettle.jpg',
    embedId: 'AI4ynXzkSQo',
    description: 'Unlocking bright clementine acidity and golden copper color from Nuwara Eliya Ceylon black tea.',
    keyTakeaways: [
      'Steep high-grown Ceylon leaves at 95°C for 3.5 minutes',
      'Bright citrus acidity with woodsy cedar finish',
      'Excellent served hot or iced with lemon'
    ]
  },
  {
    id: 'mc_white_needle',
    track: 'tea',
    methodId: 'white_tea',
    method: 'White Tea',
    title: 'White Tea & Silver Needle Steeping Masterclass',
    duration: '4:25',
    thumbnail: './tea_kettle.jpg',
    embedId: '1oB1oDrDkHM',
    description: 'Unlocking honeysuckle floral essential oils in Fujian Silver Needle (Bai Hao Yin Zhen) leaves.',
    keyTakeaways: [
      'Steep at 83°C for 3 minutes without leaf agitation',
      'Whole unoxidized buds release delicate melon sweetness',
      'Lowest caffeine content among camellia sinensis teas'
    ]
  },
  {
    id: 'mc_turmeric_tea',
    track: 'tea',
    methodId: 'turmeric_tea',
    method: 'Golden Turmeric',
    title: 'Golden Turmeric Botanical Herbal Decoction & Wellness Brew',
    duration: '5:10',
    thumbnail: './tea_ceremony.jpg',
    embedId: '4W2p0i3W_K0',
    description: 'Boiling organic turmeric root, ginger, lemongrass, and black pepper for maximum curcumin bioavailability.',
    keyTakeaways: [
      'Steep botanicals at 98°C for 5 full minutes',
      'Black pepper enhances curcumin absorption by 2000%',
      'Stir in raw honey and fresh lemon squeeze before serving'
    ]
  },

  // --- BEER MASTERCLASSES (track: 'beer') ---
  {
    id: 'mc_hazy_ipa',
    track: 'beer',
    methodId: 'hazy_ipa',
    method: 'New England Hazy DIPA',
    title: 'Brewing New England Hazy IPAs: Double Dry-Hopping & Hop Whirlpool',
    duration: '6:15',
    thumbnail: './beer_hazy_dipa_hero.jpg',
    embedId: '4lxKaf_MeSQ',
    description: 'Learn how whirlpool hop additions at 175°F (80°C) and active fermentation biotransformation dry-hopping maximize tropical mango & passionfruit hop oils without bitter astringency.',
    keyTakeaways: [
      'Whirlpool hops at 175°F (80°C) for 20 mins to extract essential oils without bittering',
      'Double dry-hop during active fermentation for biotransformation sweetness',
      'Flaked oats & wheat create a pillowy, velvety mouthfeel'
    ]
  },
  {
    id: 'mc_imperial_stout',
    track: 'beer',
    methodId: 'imperial_stout',
    method: 'Imperial Stout',
    title: 'High-Gravity Imperial Stout Mashing & Bourbon Barrel Aging',
    duration: '7:10',
    thumbnail: './beer_stout_hero.jpg',
    embedId: 'p6peZsbrGYY',
    description: 'Mastering high-density saccharification mashing at 154°F (68°C), 90-minute wort boiling for Maillard melanoidins, and oak bourbon barrel conditioning.',
    keyTakeaways: [
      'Mash thick at 154°F (68°C) for high unfermentable body sweetness',
      'Boil for 90 minutes to concentrate wort sugars and develop deep Maillard complexity',
      'Pitch high-gravity yeast strain with pure oxygen aeration'
    ]
  },
  {
    id: 'mc_west_coast_ipa',
    track: 'beer',
    methodId: 'west_coast_ipa',
    method: 'West Coast IPA',
    title: 'West Coast IPA Brewing: Piney Resin Bittering & Crisp Attenuation',
    duration: '5:45',
    thumbnail: './beer_west_coast_hero.jpg',
    embedId: 'kYJzH1eL1eU',
    description: 'Low-temp mashing at 149°F (65°C) for dry attenuation, 60-minute C-hop boil additions (Cascade, Simcoe, Centennial), and closed CO2 transfer.',
    keyTakeaways: [
      'Mash at 149°F (65°C) for maximum fermentability and crisp dry finish',
      'Layer bittering @ 60m, flavor @ 15m, and piney aroma @ flameout',
      'Use closed transfers to prevent oxygen exposure and cardboard off-flavors'
    ]
  },
  {
    id: 'mc_german_pilsner',
    track: 'beer',
    methodId: 'german_pilsner',
    method: 'German Pilsner',
    title: 'Authentic German Pilsner Lagering & Noble Saaz Hop Boiling',
    duration: '6:30',
    thumbnail: './beer_pilsner_hero.jpg',
    embedId: 'e_eOaF0tM5w',
    description: 'Step mashing German Barke Pilsner malt, 90-minute boil to drive off DMS, cold fermentation at 50°F (10°C), and 4-week cold lagering.',
    keyTakeaways: [
      'Boil 90 minutes uncovered to completely eliminate DMS cooked corn off-flavor',
      'Ferment cold at 50°F (10°C) with Bavarian lager yeast strain',
      'Lager cold at 34°F (1°C) for 4 weeks for brilliant clarity and snappy bite'
    ]
  },
  {
    id: 'mc_saison',
    track: 'beer',
    methodId: 'saison',
    method: 'Belgian Saison',
    title: 'Brewing Farmhouse Belgian Saison: High Temp Fermentation & Pepper Esters',
    duration: '5:40',
    thumbnail: './beer_hazy_dipa_hero.jpg',
    embedId: '9jP0X_9gW1w',
    description: 'High temperature fermentation up to 85°F (29°C) with French Saison yeast strains yielding spicy peppery phenols and dry champagne finish.',
    keyTakeaways: [
      'Allow fermentation temp to free-rise to 80°F-85°F for spicy pepper esters',
      'Mash low at 148°F (64°C) for 85%+ dry attenuation',
      'Crisp rustic dry finish with floral Saaz Noble hops'
    ]
  },
  {
    id: 'mc_sour_gose',
    track: 'beer',
    methodId: 'sour_gose',
    method: 'Sour Gose',
    title: 'Kettle Sour Gose: Lactobacillus Acidification & Salt Coriander Boiling',
    duration: '6:10',
    thumbnail: './beer_pilsner_hero.jpg',
    embedId: '9g0H290L0aI',
    description: 'Kettle souring wort with Lactobacillus to pH 3.4, boiling with crushed Indian coriander seeds and pink Himalayan sea salt.',
    keyTakeaways: [
      'Sour un-hopped wort with Lactobacillus at 100°F (38°C) for 24-48 hours',
      'Boil sour wort with coriander and sea salt for tart refreshing mouthfeel',
      'Ferment with clean German ale yeast strain'
    ]
  },
  {
    id: 'mc_hefeweizen',
    track: 'beer',
    methodId: 'hefeweizen',
    method: 'Bavarian Hefeweizen',
    title: 'Bavarian Hefeweizen Mashing: Ferulic Acid Rest & Clove Banana Esters',
    duration: '5:50',
    thumbnail: './beer_pilsner_hero.jpg',
    embedId: '8TvDaypgU5o',
    description: 'Performing a 113°F (45°C) ferulic acid rest to generate 4-vinyl guaiacol clove aroma precursors, followed by open fermentation.',
    keyTakeaways: [
      'Rest mash at 113°F (45°C) for 15 mins for ferulic acid clove precursor',
      'Ferment at 64°F (18°C) with Weihenstephan yeast for balanced banana-clove ratio',
      'Serve unfiltered with natural yeast suspension in tall Weizen glass'
    ]
  },
  {
    id: 'mc_amber_ale',
    track: 'beer',
    methodId: 'amber_ale',
    method: 'American Amber Ale',
    title: 'American Amber Ale: Crystal Caramel Malt & Cascade Hop Balance',
    duration: '5:15',
    thumbnail: './beer_west_coast_hero.jpg',
    embedId: 'Gk74-p_t82Y',
    description: 'Blending 2-Row pale malt with Crystal 60L and Munich malt to achieve deep ruby-amber color and toasted caramel biscuit flavor.',
    keyTakeaways: [
      'Mash at 152°F (67°C) for medium body and caramel sweetness',
      'Layer Cascade hops at 60m, 15m, and 5m for classic citrus resin',
      'Clean crisp California ale yeast fermentation'
    ]
  },
  {
    id: 'mc_porter',
    track: 'beer',
    methodId: 'porter',
    method: 'Robust Porter',
    title: 'Robust Porter: Roasted Barley Mash & Dark Chocolate Depth',
    duration: '6:00',
    thumbnail: './beer_stout_hero.jpg',
    embedId: 'p6peZsbrGYY',
    description: 'Mashing chocolate malt, Black Patent, and Carafa III to extract layers of baker’s cocoa, dark espresso, and toasted bread.',
    keyTakeaways: [
      'Mash at 153°F (67°C) for velvety mouthfeel',
      'Add roasted grains late in mash or vorlauf to prevent harsh astringency',
      'Earthy Fuggle and Willamette hop additions'
    ]
  },
  {
    id: 'mc_belgian_tripel',
    track: 'beer',
    methodId: 'belgian_tripel',
    method: 'Belgian Tripel',
    title: 'Trappist Belgian Tripel: Candi Sugar Boiling & High ABV Attenuation',
    duration: '6:45',
    thumbnail: './beer_hazy_dipa_hero.jpg',
    embedId: 'kYJzH1eL1eU',
    description: 'Boiling Belgian Pilsner malt with clear candi sugar to achieve glowing golden color, high 9.0% ABV, and dry effervescent body.',
    keyTakeaways: [
      'Mash low at 149°F (65°C) for high fermentability',
      'Add clear Belgian Candi sugar during boil to boost ABV without heavy body',
      'Ferment warm with Trappist Westmalle yeast for banana clove alcohol warmness'
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
  ],
  beer: [
    {
      id: 'dms',
      symptom: 'Cooked Corn or Canned Tomato Off-Flavor (DMS)',
      cause: 'S-Methylmethionine (SMM) precursor in Pilsner malt not boiled off or slow wort cooling',
      remedies: [
        'Boil Duration: Extend wort boil to 90 minutes uncovered to vaporize DMS',
        'Rapid Chill: Use an immersion/counterflow wort chiller to drop temp below 140°F (60°C) immediately',
        'Uncovered Kettle: Never place kettle lid on during active boil'
      ]
    },
    {
      id: 'diacetyl',
      symptom: 'Movie Theater Butter, Butterscotch, or Slick Mouthfeel',
      cause: 'Diacetyl ester precursor not absorbed by yeast due to premature fermentation cold-crashing',
      remedies: [
        'Diacetyl Rest: Raise fermentation temperature by +3°F to +5°F for 48 hours at end of primary fermentation',
        'Yeast Health: Pitch adequate healthy yeast cells and aerate wort with pure oxygen',
        'Conditioning: Allow 2 extra days before transferring to keg or bottles'
      ]
    },
    {
      id: 'acetaldehyde',
      symptom: 'Green Apple, Latex Paint, or Raw Cider Bite',
      cause: 'Acetaldehyde intermediate compound before conversion into ethanol by yeast',
      remedies: [
        'Fermentation Time: Give yeast extra time to re-absorb acetaldehyde before packaging',
        'Yeast Strain: Ensure healthy yeast pitch rate (avoid under-pitching expired yeast packets)'
      ]
    },
    {
      id: 'oxidation',
      symptom: 'Wet Cardboard, Stale Paper, or Muted Hop Aromatics',
      cause: 'Oxygen exposure post-fermentation during keg transfer or bottling (Hot Side / Cold Side aeration)',
      remedies: [
        'Closed Transfer: Flush kegs with CO2 before transferring fermented beer',
        'Dry Hop Purge: Flush dry hop additions with CO2 to eliminate trapped air',
        'Cold Storage: Store packaged IPA & hoppy beer in cold fridge (38°F / 3°C)'
      ]
    }
  ]
};
