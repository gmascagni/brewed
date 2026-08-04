// Community Shared Brew Recipes Data

export const COMMUNITY_RECIPES = [
  {
    id: 'rec_v60_yirgacheffe',
    title: 'High-Altitude Yirgacheffe Jasmine Pour Over',
    author: '@barista_clara',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    methodId: 'pour_over',
    methodName: 'Pour-Over (V60)',
    trackMode: 'coffee',
    beanName: 'Ethiopia Yirgacheffe Washed',
    roasterName: 'Onyx Coffee Lab',
    ratio: 16.6,
    dryDoseGrams: 15.0,
    waterAmountMl: 250.0,
    waterTempC: 96,
    grindSetting: 'Medium-Fine (Baratza #12 / Ode #3)',
    totalTimeSec: 180,
    description: 'Crisp bergamot, tea-like body, and peach sweetness. Uses center-spiral pour with 45-second bloom.',
    rating: 4.9,
    reviewsCount: 38,
    savesCount: 340,
    isPopular: true,
    steps: [
      { order: 1, durationSec: 45, waterMl: 50, action: 'Bloom Pour & Gentle Swirl' },
      { order: 2, durationSec: 15, waterMl: 100, action: 'Concentric Spiral Pour' },
      { order: 3, durationSec: 20, waterMl: 150, action: 'Second Spiral Pour' },
      { order: 4, durationSec: 20, waterMl: 200, action: 'Third Spiral Pour' },
      { order: 5, durationSec: 20, waterMl: 250, action: 'Final Center Pour & Swirl' },
      { order: 6, durationSec: 60, waterMl: 250, action: 'Drawdown & Flat Bed' }
    ]
  },
  {
    id: 'rec_fp_hoffmann',
    title: 'James Hoffmann Ultimate French Press Method',
    author: '@coffee_guru',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    methodId: 'french_press',
    methodName: 'French Press',
    trackMode: 'coffee',
    beanName: 'Guatemala Huehuetenango Medium Roast',
    roasterName: 'Blue Bottle Coffee',
    ratio: 15.0,
    dryDoseGrams: 30.0,
    waterAmountMl: 450.0,
    waterTempC: 98,
    grindSetting: 'Medium-Coarse (Baratza #24 / Ode #8)',
    totalTimeSec: 540,
    description: 'Zero-press immersion steep. Stir crust at 4 min, skim foam, and let settle for 5 minutes for zero sediment.',
    rating: 5.0,
    reviewsCount: 92,
    savesCount: 520,
    isPopular: true,
    steps: [
      { order: 1, durationSec: 240, waterMl: 450, action: 'Full Water Pour & 4 Minute Steep' },
      { order: 2, durationSec: 30, waterMl: 450, action: 'Stir Top Crust & Skim Floating Foam' },
      { order: 3, durationSec: 270, waterMl: 450, action: 'Rest 5 Minutes (Do Not Plunge)' }
    ]
  },
  {
    id: 'rec_gaiwan_alishan',
    title: 'Gongfu High Mountain Alishan Oolong 7-Steep Cycle',
    author: '@tea_master_lin',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    methodId: 'oolong_tea',
    methodName: 'Gongfu Oolong Gaiwan',
    trackMode: 'tea',
    beanName: 'High Mountain Alishan Oolong',
    roasterName: 'Taiwan Tea Crafts',
    ratio: 20.0,
    dryDoseGrams: 7.5,
    waterAmountMl: 150.0,
    waterTempC: 92,
    grindSetting: 'Tightly Rolled Tea Pearls',
    totalTimeSec: 240,
    description: 'Orchid floral aroma and buttery cream mouthfeel across 7 progressive steepings in porcelain Gaiwan.',
    rating: 4.9,
    reviewsCount: 24,
    savesCount: 180,
    isPopular: true,
    steps: [
      { order: 1, durationSec: 10, waterMl: 150, action: 'Flash Rinse & Awaken Leaf' },
      { order: 2, durationSec: 20, waterMl: 150, action: '1st Steep: Creamy Orchid' },
      { order: 3, durationSec: 25, waterMl: 150, action: '2nd Steep: Honey Nectar' },
      { order: 4, durationSec: 35, waterMl: 150, action: '3rd Steep: Smooth Minerals' }
    ]
  }
];
