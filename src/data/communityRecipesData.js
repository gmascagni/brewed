// Curated Master Recipes & Signature Extraction Protocols
// Verified standard techniques from recognized champions, educators, and traditions.

export const CURATED_MASTER_RECIPES = [
  {
    id: 'rec_v60_yirgacheffe',
    title: 'SCA Benchmark 5-Pour Conical Extraction',
    technique: 'Specialty Coffee Association Protocol',
    badge: 'SCA Benchmark',
    methodId: 'pour_over',
    methodName: 'Hario V60 Dripper',
    trackMode: 'coffee',
    beanName: 'Ethiopia Yirgacheffe Washed / Light Roast',
    roasterName: 'Single-Origin Recommendation',
    ratio: 16.6,
    dryDoseGrams: 15.0,
    waterAmountMl: 250.0,
    waterTempC: 96,
    grindSetting: 'Medium-Fine (600–700 µm)',
    totalTimeSec: 180,
    description: 'Precision multi-pour extraction optimizing sweetness, clarity, and delicate floral bergamot notes with zero astringency.',
    steps: [
      { order: 1, durationSec: 45, waterMl: 50, action: 'Bloom Pour (3x dose) & Gentle Swirl' },
      { order: 2, durationSec: 15, waterMl: 100, action: 'First Concentric Spiral Pour' },
      { order: 3, durationSec: 20, waterMl: 150, action: 'Second Spiral Pour to Maintain Slurry Temp' },
      { order: 4, durationSec: 20, waterMl: 200, action: 'Third Spiral Pour to Agitate Grounds' },
      { order: 5, durationSec: 20, waterMl: 250, action: 'Final Center Pour & Leveling Swirl' },
      { order: 6, durationSec: 60, waterMl: 250, action: 'Even Drawdown onto Flat Bed' }
    ]
  },
  {
    id: 'rec_fp_hoffmann',
    title: 'The Ultimate French Press Immersion Technique',
    technique: 'James Hoffmann World Champion Protocol',
    badge: 'Champion Technique',
    methodId: 'french_press',
    methodName: 'French Press',
    trackMode: 'coffee',
    beanName: 'Guatemala / Colombia Medium Roast',
    roasterName: 'Washed or Natural Specialty Lot',
    ratio: 15.0,
    dryDoseGrams: 30.0,
    waterAmountMl: 450.0,
    waterTempC: 98,
    grindSetting: 'Medium-Coarse (800–1000 µm)',
    totalTimeSec: 540,
    description: 'Zero-press settling method. Breaking the crust at 4 minutes and skimming surface foam creates a clean, sediment-free cup with rich body.',
    steps: [
      { order: 1, durationSec: 240, waterMl: 450, action: 'Full Rapid Water Pour & 4-Minute Unstirred Steep' },
      { order: 2, durationSec: 30, waterMl: 450, action: 'Gently Break Crust with Spoon & Skim Floating Foam' },
      { order: 3, durationSec: 270, waterMl: 450, action: 'Rest 5 Minutes (Particles Settle; Do Not Plunge to Bottom)' }
    ]
  },
  {
    id: 'rec_gaiwan_alishan',
    title: 'Traditional High Mountain Gongfu Multi-Steep',
    technique: 'Taiwanese Gongfu Cha Heritage Protocol',
    badge: 'Heritage Protocol',
    methodId: 'oolong_tea',
    methodName: 'Gongfu Oolong Gaiwan',
    trackMode: 'tea',
    beanName: 'High Mountain Alishan Rolled Oolong',
    roasterName: 'Hand-Harvested High Elevation Spring Pluck',
    ratio: 20.0,
    dryDoseGrams: 7.5,
    waterAmountMl: 150.0,
    waterTempC: 92,
    grindSetting: 'Whole Tightly Rolled Pearls',
    totalTimeSec: 240,
    description: 'High leaf-to-water ratio unlocking rich orchid honey sweetness, buttery mouthfeel, and deep mineral aftertaste across progressive infusions.',
    steps: [
      { order: 1, durationSec: 10, waterMl: 150, action: 'Flash Rinse & Awaken Leaves (Discard Rinse)' },
      { order: 2, durationSec: 20, waterMl: 150, action: '1st Steep: Floral Aromatics & Creamy Body' },
      { order: 3, durationSec: 25, waterMl: 150, action: '2nd Steep: Honey Nectar & Orchid Notes' },
      { order: 4, durationSec: 35, waterMl: 150, action: '3rd Steep: Lingering Sweet Finish & Mineral Tone' }
    ]
  },
  {
    id: 'rec_aeropress_inverted',
    title: 'World AeroPress Inverted Bloom Method',
    technique: 'Competition Inverted Protocol',
    badge: 'Competition Favorite',
    methodId: 'aeropress',
    methodName: 'AeroPress',
    trackMode: 'coffee',
    beanName: 'Kenya / Ethiopia Washed Single Origin',
    roasterName: 'Light to Medium-Light Roast',
    ratio: 14.0,
    dryDoseGrams: 16.0,
    waterAmountMl: 224.0,
    waterTempC: 90,
    grindSetting: 'Medium-Fine (500–600 µm)',
    totalTimeSec: 150,
    description: 'Inverted orientation ensures full immersion without preliminary bypass dripping, delivering high extraction yield with bright juicy acidity.',
    steps: [
      { order: 1, durationSec: 30, waterMl: 60, action: 'Inverted Setup: Add grounds, pour bloom water, stir 10 seconds' },
      { order: 2, durationSec: 30, waterMl: 224, action: 'Pour remaining water to 224g, attach rinsed filter cap' },
      { order: 3, durationSec: 45, waterMl: 224, action: 'Carefully flip onto decanter and begin steady 30-second press' },
      { order: 4, durationSec: 30, waterMl: 224, action: 'Stop press at hiss to avoid harsh late-stage fines' }
    ]
  }
];

// Backward-compatible alias for existing imports
export const COMMUNITY_RECIPES = CURATED_MASTER_RECIPES;
