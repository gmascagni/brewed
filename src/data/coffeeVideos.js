/**
 * The Brew App • Master Video Academy & Coffee Tube Registry
 * Authentic curated video masterclasses from world barista champions,
 * specialty roasteries, and extraction scientists.
 */

export const VIDEO_CATEGORIES = [
  { id: 'all', label: 'All Masterclasses', icon: 'Sparkles' },
  { id: 'pour_over', label: 'Pour-Over & Drippers', icon: 'Coffee' },
  { id: 'espresso', label: 'Espresso & Latte Art', icon: 'Flame' },
  { id: 'immersion', label: 'AeroPress & Immersion', icon: 'Droplets' },
  { id: 'roaster_spotlight', label: 'Roaster Tours & Sourcing', icon: 'Store' },
  { id: 'water_science', label: 'Water Lab & Chemistry', icon: 'FlaskConical' },
  { id: 'gear_lab', label: 'Grinders & Gear Teardowns', icon: 'Sliders' }
];

export const COFFEE_VIDEOS = [
  {
    id: 'hoffmann-ultimate-v60',
    youtubeId: '1oB1oDrDkHM',
    title: 'The Ultimate V60 Technique (Step-by-Step)',
    creator: 'James Hoffmann',
    creatorBadge: 'World Barista Champion',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    category: 'pour_over',
    methodId: 'pour_over',
    duration: '13:42',
    views: '5.2M',
    featured: true,
    description: 'The definitive single-cup V60 masterclass focusing on high-temperature slurry retention, gentle agitation, and a flat drawdown bed.',
    recipeSync: {
      methodName: 'Pour-Over (V60)',
      methodId: 'pour_over',
      ratio: 16.67,
      doseGrams: 15.0,
      totalWaterMl: 250,
      waterTempF: 208,
      waterTempC: 98,
      grindSetting: 'Medium-Fine (Burr 14-16)',
      notes: '5-phase pour: 50g bloom (45s), swirl, pour to 150g by 1:15, pour to 250g by 1:45, gentle stir, swirl, drawdown.',
      phases: [
        { name: 'Bloom Phase', durationSec: 45, instruction: 'Pour 50g water (2-3x coffee weight). Swirl brewer gently to wet all grinds evenly.' },
        { name: 'First Main Pour', durationSec: 30, instruction: 'Pour steadily in concentric circles up to 150g total weight by 1:15.' },
        { name: 'Second Final Pour', durationSec: 30, instruction: 'Pour gently up to 250g total weight by 1:45.' },
        { name: 'Swirl & Drawdown', durationSec: 75, instruction: 'Give one clockwise and one counter-clockwise stir, gentle swirl, and let drawdown through a flat bed.' }
      ]
    }
  },
  {
    id: 'lance-1-pour-v60',
    youtubeId: 'R8jB3i9f50s',
    title: 'The Ultimate 1-Pour V60 Recipe for Maximum Sweetness',
    creator: 'Lance Hedrick',
    creatorBadge: '2x World Latte Art Champion',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    category: 'pour_over',
    methodId: 'pour_over',
    duration: '16:04',
    views: '1.4M',
    featured: true,
    description: 'A revolutionary low-agitation pour-over technique minimizing fines migration and channeling, resulting in extraordinary clarity and sweetness.',
    recipeSync: {
      methodName: 'Pour-Over (V60)',
      methodId: 'pour_over',
      ratio: 16.0,
      doseGrams: 15.0,
      totalWaterMl: 240,
      waterTempF: 204,
      waterTempC: 95.5,
      grindSetting: 'Medium-Coarse (Burr 18-20)',
      notes: 'Extended bloom with circular agitation, followed by a single slow center spiral pour straight to total volume.',
      phases: [
        { name: 'Extended Saturation Bloom', durationSec: 60, instruction: 'Pour 50g water and perform a deep swirl to fully saturate all grounds for 60 seconds.' },
        { name: 'Continuous Low Flow Pour', durationSec: 60, instruction: 'Pour gently at 4g/sec in tight concentric rings until hitting full 240g weight.' },
        { name: 'Natural Gravity Drawdown', durationSec: 60, instruction: 'Allow water to drain completely without tapping or agitating the bed.' }
      ]
    }
  },
  {
    id: 'hoffmann-ultimate-aeropress',
    youtubeId: 'j6VlT55QBoc',
    title: 'The Ultimate AeroPress Technique',
    creator: 'James Hoffmann',
    creatorBadge: 'World Barista Champion',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    category: 'immersion',
    methodId: 'aeropress',
    duration: '11:15',
    views: '3.8M',
    featured: false,
    description: 'The standard inverted vs upright myth debunked. An upright, low-effort immersion technique delivering a clean, sweet cup every single time.',
    recipeSync: {
      methodName: 'AeroPress (Upright)',
      methodId: 'aeropress',
      ratio: 18.18,
      doseGrams: 11.0,
      totalWaterMl: 200,
      waterTempF: 200,
      waterTempC: 93,
      grindSetting: 'Fine to Medium-Fine (Burr 10-12)',
      notes: 'Standard upright position, boiling water straight on grounds, insert plunger to create vacuum, steep 2 mins, swirl, wait 30s, press gently.',
      phases: [
        { name: 'Upright Immersion Infusion', durationSec: 30, instruction: 'Pour 200g boiling water directly onto 11g fine coffee grinds. Insert plunger 1cm to form vacuum seal.' },
        { name: 'Static Steep', durationSec: 90, instruction: 'Leave brewer untouched for a total of 2 minutes to steep gently.' },
        { name: 'Crust Break Swirl', durationSec: 30, instruction: 'Remove plunger, gently swirl the AeroPress to settle grounds, and wait 30 seconds for crust to drop.' },
        { name: 'Gentle Plunge', durationSec: 30, instruction: 'Press gently for 30 seconds until hissing sound begins, then stop immediately.' }
      ]
    }
  },
  {
    id: 'hoffmann-ultimate-french-press',
    youtubeId: 'st571DYYTR8',
    title: 'The Ultimate French Press Technique (No Sludge)',
    creator: 'James Hoffmann',
    creatorBadge: 'World Barista Champion',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    category: 'immersion',
    methodId: 'french_press',
    duration: '14:28',
    views: '6.9M',
    featured: true,
    description: 'Eliminate gritty silt and bitter overextraction. The cupping-inspired French Press method that produces silky, crystalline immersion coffee.',
    recipeSync: {
      methodName: 'French Press (Clean Cupping Method)',
      methodId: 'french_press',
      ratio: 16.67,
      doseGrams: 30.0,
      totalWaterMl: 500,
      waterTempF: 212,
      waterTempC: 100,
      grindSetting: 'Medium (Finer than traditional coarse)',
      notes: 'Pour water, steep 4 mins, stir crust, scoop foam with two spoons, wait 5+ mins for grinds to sink, insert plunger but DO NOT press down.',
      phases: [
        { name: 'Initial Immersion Steep', durationSec: 240, instruction: 'Pour 500g boiling water over 30g medium grinds. Leave open and unplunged for 4 minutes.' },
        { name: 'Break Crust & Skim Sludge', durationSec: 60, instruction: 'Stir surface grounds with a spoon. Use two soup spoons to skim off remaining white foam and floating chaff.' },
        { name: 'Gravity Sedimentation', durationSec: 300, instruction: 'Wait 5 minutes undisturbed for all coffee particles to drop to the bottom.' },
        { name: 'Filter Without Pressing', durationSec: 30, instruction: 'Insert plunger only at the liquid surface to act as a sieve. Pour gently into warm cups without plunging down.' }
      ]
    }
  },
  {
    id: 'lance-dial-in-espresso',
    youtubeId: 'fuC4jM_5kK0',
    title: 'How to Dial In Espresso from Scratch (Puck Prep & Yield)',
    creator: 'Lance Hedrick',
    creatorBadge: '2x World Latte Art Champion',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    category: 'espresso',
    methodId: 'espresso',
    duration: '22:18',
    views: '1.1M',
    featured: false,
    description: 'Master dose, yield, grind adjustment, and the flavor compass (sour vs bitter) to pull cafe-quality 9-bar espresso at home.',
    recipeSync: {
      methodName: 'Espresso (Specialty 1:2)',
      methodId: 'espresso',
      ratio: 2.0,
      doseGrams: 18.0,
      totalWaterMl: 36,
      waterTempF: 200,
      waterTempC: 93.3,
      grindSetting: 'Fine Espresso Burr Micro-steps',
      notes: '18g dry in, 36g liquid out in 27-30 seconds with 9 bars pump pressure and 0.4mm WDT needle distribution.',
      phases: [
        { name: 'Pre-Infusion & Saturation', durationSec: 6, instruction: 'Low-pressure 2-3 bar pre-infusion to saturate coffee puck without channeling.' },
        { name: 'Full 9-Bar Extraction', durationSec: 22, instruction: 'Ramp to 9 bars. Steady blonde stream yielding 36g liquid mass.' },
        { name: 'Cutoff & Crema Settling', durationSec: 4, instruction: 'Cut pump at 36g. Swirl espresso before tasting to integrate crema and liquid layers.' }
      ]
    }
  },
  {
    id: 'methodical-chemex-masterclass',
    youtubeId: 'wI_V3lQf_gQ',
    title: 'How to Brew the Perfect Chemex: Professional Barista Guide',
    creator: 'Methodical Coffee',
    creatorBadge: 'Artisan Roastery Partner',
    creatorAvatar: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=120&q=80',
    category: 'pour_over',
    methodId: 'chemex',
    duration: '8:45',
    views: '420K',
    featured: false,
    description: 'Head roaster and green buyer explain why Chemex thick bonded fiber filters produce ultra-clean tea-like brightness and how to manage drawdown times.',
    recipeSync: {
      methodName: 'Chemex (3-Cup Bonded Filter)',
      methodId: 'chemex',
      ratio: 16.0,
      doseGrams: 30.0,
      totalWaterMl: 480,
      waterTempF: 205,
      waterTempC: 96,
      grindSetting: 'Medium-Coarse (Kosher salt texture)',
      notes: 'Thick 3-ply filter requires coarse grind to prevent clogging. Gentle pulsed pours maintain thermal mass.',
      phases: [
        { name: 'Thorough Paper Rinse', durationSec: 30, instruction: 'Rinse heavy bonded Chemex filter with hot water to wash away wood pulp taste. Discard rinse water.' },
        { name: 'Bloom Saturation', durationSec: 45, instruction: 'Pour 90g water (3x coffee weight). Allow heavy gas release for 45 seconds.' },
        { name: 'Pulse Pour 1', durationSec: 60, instruction: 'Pour steadily in concentric spirals up to 280g total weight.' },
        { name: 'Pulse Pour 2 & Drawdown', durationSec: 105, instruction: 'Pour up to final 480g weight. Gently swirl once. Allow gravity drawdown through bonded paper.' }
      ]
    }
  },
  {
    id: 'onyx-coffee-lab-sourcing',
    youtubeId: 'aP7pYJpE40k',
    title: 'Inside Onyx Coffee Lab: Terroir, Processing & Roasting Philosophy',
    creator: 'Onyx Coffee Lab',
    creatorBadge: 'US Barista & Roaster Champions',
    creatorAvatar: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=120&q=80',
    category: 'roaster_spotlight',
    methodId: 'pour_over',
    duration: '18:32',
    views: '350K',
    featured: true,
    description: 'Go behind the scenes at Onyx Coffee Lab in Rogers, Arkansas. Learn how anaerobic natural ferments and terroir alter extraction solubility.',
    recipeSync: {
      methodName: 'Kalita Wave Flat Bed',
      methodId: 'pour_over',
      ratio: 15.5,
      doseGrams: 20.0,
      totalWaterMl: 310,
      waterTempF: 208,
      waterTempC: 97.7,
      grindSetting: 'Medium (Burr 15)',
      notes: 'Optimized for high-elevation anaerobic Geisha and natural processed micro-lots with vibrant fruity aromatics.',
      phases: [
        { name: 'Flash Bloom', durationSec: 30, instruction: 'Pour 60g water vigorously to wet all grounds quickly.' },
        { name: 'Center Spiral Pour', durationSec: 60, instruction: 'Pour slowly up to 180g maintaining 1cm water level above coffee bed.' },
        { name: 'Final Wave Pour', durationSec: 60, instruction: 'Pour to 310g total weight with gentle circular flow.' }
      ]
    }
  },
  {
    id: 'hoffmann-water-for-coffee',
    youtubeId: 'g8J44n0e_r4',
    title: 'Water for Coffee: What Actually Matters (Magnesium, Calcium & Buffer)',
    creator: 'James Hoffmann',
    creatorBadge: 'World Barista Champion',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    category: 'water_science',
    methodId: 'pour_over',
    duration: '15:50',
    views: '1.9M',
    featured: false,
    description: 'Understand how General Hardness (GH) pulls fruity acids and Alkalinity (KH) acts as a buffer. Why tap water can ruin a $30 Gesha bean.',
    recipeSync: {
      methodName: 'SCA Standard Water Pairing',
      methodId: 'pour_over',
      ratio: 16.0,
      doseGrams: 18.0,
      totalWaterMl: 288,
      waterTempF: 202,
      waterTempC: 94.4,
      grindSetting: 'Medium-Fine',
      notes: 'Optimal water: 68 ppm GH (Magnesium/Calcium), 40 ppm KH (Alkalinity buffer), pH 7.0.',
      phases: [
        { name: 'Mineral Water Bloom', durationSec: 45, instruction: 'Pour 50g remineralized water (Lotus Drops or Third Wave Water) to unlock floral volatile compounds.' },
        { name: 'Primary Sweetness Pour', durationSec: 45, instruction: 'Pour up to 180g water to extract organic fruit acids.' },
        { name: 'Body & Finish Pour', durationSec: 60, instruction: 'Pour to 288g. Mineral balance maintains lingering sweetness without chalky bitterness.' }
      ]
    }
  },
  {
    id: 'morgan-latte-art-basics',
    youtubeId: 'sN4oM7W1e9k',
    title: 'How to Steam Milk & Pour Your First Latte Art Heart',
    creator: 'Morgan Drinks Coffee',
    creatorBadge: 'World Barista Competitor',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    category: 'espresso',
    methodId: 'espresso',
    duration: '10:22',
    views: '2.8M',
    featured: false,
    description: 'Learn the sound of stretching milk, finding the vortex, texturing silky microfoam, and the physics of the canvas pour.',
    recipeSync: {
      methodName: 'Latte / Flat White Espresso Base',
      methodId: 'espresso',
      ratio: 2.0,
      doseGrams: 18.0,
      totalWaterMl: 36,
      waterTempF: 200,
      waterTempC: 93.3,
      grindSetting: 'Espresso Fine',
      notes: 'Pull a sweet, balanced 36g double shot into a rounded 6oz ceramic cup for maximum milk integration.',
      phases: [
        { name: 'Pull Foundation Espresso Double', durationSec: 28, instruction: 'Extract 18g coffee into 36g espresso liquid with thick, tiger-striped crema.' },
        { name: 'Milk Aeration / Stretch', durationSec: 5, instruction: 'Submerge steam wand tip 2mm below surface. Listen for gentle paper-tearing sound until milk reaches room temp.' },
        { name: 'Vortex Rolling & Texture', durationSec: 15, instruction: 'Submerge wand deeper and tilt pitcher to create a rapid whirlpool vortex until pitcher reaches 140°F (60°C).' },
        { name: 'Canvas & Heart Draw-Through', durationSec: 15, instruction: 'Pour high to build base canvas, drop pitcher spout close to surface to form circle, then lift and cut through.' }
      ]
    }
  },
  {
    id: 'european-coffee-trip-cupping',
    youtubeId: 'c1u2i3p4k5g',
    title: 'How to Cup Coffee Like a Professional Q-Grader',
    creator: 'European Coffee Trip',
    creatorBadge: 'Specialty Coffee Media',
    creatorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
    category: 'roaster_spotlight',
    methodId: 'french_press',
    duration: '12:05',
    views: '890K',
    featured: false,
    description: 'Learn the international SCA cupping standard. Experience aroma, fragrance, acidity, body, and slurp coffee to aerosolize notes across your palate.',
    recipeSync: {
      methodName: 'SCA Protocol Cupping Bowl',
      methodId: 'french_press',
      ratio: 18.18,
      doseGrams: 11.0,
      totalWaterMl: 200,
      waterTempF: 200,
      waterTempC: 93.3,
      grindSetting: 'Medium-Coarse (70% passing 20-mesh sieve)',
      notes: '11g freshly ground coffee in 200mL clean boiling water. Dry fragrance evaluation, 4 min steep, break crust, 10 min cool down.',
      phases: [
        { name: 'Dry Fragrance Assessment', durationSec: 60, instruction: 'Shake dry grounds in cupping bowl and inhale deeply to assess dry varietal notes.' },
        { name: 'Direct Water Pour & Wet Aroma', durationSec: 240, instruction: 'Pour 200mL water vigorously. Allow coffee to steep untouched for 4:00.' },
        { name: 'Break the Crust (3 Pushes)', durationSec: 60, instruction: 'Use cupping spoon to push surface grinds back 3 times while smelling rising steam.' },
        { name: 'Aerosolized Palate Slurp', durationSec: 180, instruction: 'Skim surface foam. When brew cools to 130°F (55°C), slurp briskly to vaporize coffee over palate receptors.' }
      ]
    }
  }
];
