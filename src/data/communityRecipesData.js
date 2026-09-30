// Curated Master Recipes & Signature Extraction Protocols
// Verified standard techniques from recognized champions, educators, and traditions.
// Covers all major brewing methods: V60, Kalita, Chemex, AeroPress, French Press, Moka Pot, Espresso, Cold Brew.

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
    waterTempF: 205,
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
    id: 'rec_kalita_185_pulse',
    title: 'Kalita Wave 185 Triple-Pulse Flat-Bed Protocol',
    technique: 'Japanese Flat-Bottom Calibration',
    badge: 'Artisan Classic',
    methodId: 'classic_pour_over',
    methodName: 'Flat-Bottom Pour Over (Kalita)',
    trackMode: 'coffee',
    beanName: 'Colombia Huila Pink Bourbon / Medium-Light',
    roasterName: 'Single-Origin Recommendation',
    ratio: 16.0,
    dryDoseGrams: 20.0,
    waterAmountMl: 320.0,
    waterTempC: 94,
    waterTempF: 202,
    grindSetting: 'Medium (650–750 µm)',
    totalTimeSec: 195,
    description: 'Flat geometry with 3-hole restriction restricts channeling and maximizes caramel sweetness and round body.',
    steps: [
      { order: 1, durationSec: 40, waterMl: 60, action: 'Saturate all grounds evenly with 60g bloom water' },
      { order: 2, durationSec: 35, waterMl: 160, action: 'First pulse: Gentle center-to-edge spiral to 160g' },
      { order: 3, durationSec: 35, waterMl: 240, action: 'Second pulse: Steady center pour maintaining slurry level to 240g' },
      { order: 4, durationSec: 35, waterMl: 320, action: 'Final pulse: Top off to 320g with gentle rinse of edges' },
      { order: 5, durationSec: 50, waterMl: 320, action: 'Drawdown to clean, level coffee bed' }
    ]
  },
  {
    id: 'rec_chemex_continuous',
    title: 'Chemex 6-Cup Single-Pour Sweetness Protocol',
    technique: 'Bonded Filter Clarity Method',
    badge: 'Clarity Favorite',
    methodId: 'chemex',
    methodName: 'Chemex Glass Brewer',
    trackMode: 'coffee',
    beanName: 'Kenya Nyeri Peaberry / Light Roast',
    roasterName: 'High-Altitude Washed Lot',
    ratio: 16.7,
    dryDoseGrams: 30.0,
    waterAmountMl: 500.0,
    waterTempC: 95,
    waterTempF: 203,
    grindSetting: 'Medium-Coarse (750–900 µm)',
    totalTimeSec: 255,
    description: 'Heavy laboratory-grade bonded filter paper removes all oils and cafestol, highlighting sparkling acidity and blackcurrant notes.',
    steps: [
      { order: 1, durationSec: 45, waterMl: 90, action: 'Rinse heavy filter thoroughly, discard water, bloom with 90g' },
      { order: 2, durationSec: 60, waterMl: 300, action: 'Controlled center-outward spiral pour to 300g without touching paper' },
      { order: 3, durationSec: 60, waterMl: 500, action: 'Continuous gentle center pour to 500g, light decanter swirl' },
      { order: 4, durationSec: 90, waterMl: 500, action: 'Allow gravity drawdown through thick paper matrix' }
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
    waterTempF: 194,
    grindSetting: 'Medium-Fine (500–600 µm)',
    totalTimeSec: 150,
    description: 'Inverted orientation ensures full immersion without preliminary bypass dripping, delivering high extraction yield with bright juicy acidity.',
    steps: [
      { order: 1, durationSec: 30, waterMl: 60, action: 'Inverted Setup: Add grounds, pour bloom water, stir 10 seconds' },
      { order: 2, durationSec: 30, waterMl: 224, action: 'Pour remaining water to 224g, attach rinsed filter cap' },
      { order: 3, durationSec: 45, waterMl: 224, action: 'Carefully flip onto decanter and begin steady 30-second press' },
      { order: 4, durationSec: 30, waterMl: 224, action: 'Stop press at hiss to avoid harsh late-stage fines' }
    ]
  },
  {
    id: 'rec_aeropress_bypass',
    title: 'AeroPress Short Concentrate & Bypass Americano',
    technique: 'High-Strength Clean Dilution',
    badge: 'Daily Driver',
    methodId: 'aeropress',
    methodName: 'AeroPress',
    trackMode: 'coffee',
    beanName: 'Central American Natural or Washed',
    roasterName: 'Medium Roast',
    ratio: 15.0,
    dryDoseGrams: 18.0,
    waterAmountMl: 270.0,
    waterTempC: 88,
    waterTempF: 190,
    grindSetting: 'Fine (400–500 µm)',
    totalTimeSec: 105,
    description: 'Brews a rich 120g core concentrate with lower water temperature to suppress bitter compounds, then bypasses with 150g hot water.',
    steps: [
      { order: 1, durationSec: 30, waterMl: 120, action: 'Add 18g fine coffee, pour 120g water at 88°C, paddle stir 15 times' },
      { order: 2, durationSec: 30, waterMl: 120, action: 'Insert plunger to lock vacuum; steep until 1:00' },
      { order: 3, durationSec: 30, waterMl: 120, action: 'Gently press concentrate into cup until soft hiss' },
      { order: 4, durationSec: 15, waterMl: 270, action: 'Bypass Dilution: Add 150g clean hot water to the cup and stir' }
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
    waterTempF: 208,
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
    id: 'rec_moka_bialetti',
    title: 'Pre-Heated Moka Pot Sweet Italian Extraction',
    technique: 'Low-Thermal Degradation Protocol',
    badge: 'Stovetop Master',
    methodId: 'moka_pot',
    methodName: 'Bialetti Moka Pot',
    trackMode: 'coffee',
    beanName: 'Brazil Cerrado / Medium-Dark Roast',
    roasterName: 'Chocolate & Hazelnut Profile',
    ratio: 10.0,
    dryDoseGrams: 16.0,
    waterAmountMl: 160.0,
    waterTempC: 98,
    waterTempF: 208,
    grindSetting: 'Fine (350–450 µm)',
    totalTimeSec: 180,
    description: 'Filling the base with pre-boiled water prevents scorching the dry coffee grounds while heating on the stove.',
    steps: [
      { order: 1, durationSec: 30, waterMl: 160, action: 'Fill boiler with pre-heated water to safety valve; level basket (no tamp)' },
      { order: 2, durationSec: 90, waterMl: 160, action: 'Assemble with towel; place on low flame with lid open' },
      { order: 3, durationSec: 40, waterMl: 160, action: 'When golden honey stream flows, reduce heat to minimum' },
      { order: 4, durationSec: 20, waterMl: 160, action: 'As sputtering begins, quench base with cold water to stop extraction' }
    ]
  },
  {
    id: 'rec_espresso_classic',
    title: 'Italian SCA 1:2 Golden Ratio Espresso Shot',
    technique: '9-Bar Specialty Espresso Standard',
    badge: 'Espresso Core',
    methodId: 'espresso',
    methodName: 'Espresso (9-Bar)',
    trackMode: 'coffee',
    beanName: 'Modern Espresso Blend / Medium Roast',
    roasterName: 'Dense High-Grown Lot',
    ratio: 2.0,
    dryDoseGrams: 18.0,
    waterAmountMl: 36.0,
    waterTempC: 93,
    waterTempF: 200,
    grindSetting: 'Extra-Fine (200–300 µm)',
    totalTimeSec: 30,
    description: 'Precision double shot with 6-second pre-infusion and steady 9-bar pressure producing thick crema with balanced sweetness and syrupy body.',
    steps: [
      { order: 1, durationSec: 6, waterMl: 6, action: 'Puck prep: WDT distribution, 25lb level tamp, initiate pre-infusion' },
      { order: 2, durationSec: 14, waterMl: 22, action: 'First drops emerge; steady 9-bar extraction with deep tiger striping' },
      { order: 3, durationSec: 10, waterMl: 36, action: 'Cut pump at 36g liquid yield (28–30s total extraction time)' }
    ]
  },
  {
    id: 'rec_cold_brew_toddy',
    title: '18-Hour Slow Ambient Cold Brew Concentrate',
    technique: 'Low-Acid Toddy Cold Immersion',
    badge: 'Summer Staple',
    methodId: 'cold_brew',
    methodName: 'Cold Brew',
    trackMode: 'coffee',
    beanName: 'Latin American Chocolate & Nut Profile',
    roasterName: 'Medium to Dark Roast',
    ratio: 8.0,
    dryDoseGrams: 100.0,
    waterAmountMl: 800.0,
    waterTempC: 20,
    waterTempF: 68,
    grindSetting: 'Coarse (900–1100 µm)',
    totalTimeSec: 64800,
    description: 'Gentle 18-hour room-temperature steep yielding zero bitter chlorogenic quinic acids, perfect for iced dilution or milk drinks.',
    steps: [
      { order: 1, durationSec: 120, waterMl: 800, action: 'Combine 100g coarse coffee with 800g filtered room-temp water in jar' },
      { order: 2, durationSec: 60, waterMl: 800, action: 'Stir thoroughly to saturate grounds; seal and steep for 18 hours' },
      { order: 3, durationSec: 300, waterMl: 800, action: 'Filter through double paper filter into decanter; store cold up to 2 weeks' }
    ]
  }
];

// Backward-compatible alias for existing imports
export const COMMUNITY_RECIPES = CURATED_MASTER_RECIPES;
