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
