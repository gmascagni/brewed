// Gamification Badges & Achievements Data

export const BADGES_DATA = [
  {
    id: 'first_brew',
    slug: 'first_brew',
    name: 'First Extraction',
    description: 'Logged your very first brew in The Brew App.',
    category: 'milestone',
    icon: '☕',
    criteriaType: 'brew_count',
    threshold: 1
  },
  {
    id: 'golden_ratio_master',
    slug: 'golden_ratio_master',
    name: 'Golden Ratio Master',
    description: 'Brewed using the exact SCA 1:16 Golden Cup Standard.',
    category: 'mastery',
    icon: '✨',
    criteriaType: 'ratio_mastery',
    threshold: 16
  },
  {
    id: 'streak_3_days',
    slug: 'streak_3_days',
    name: '3-Day Brew Streak',
    description: 'Brewed coffee or tea for 3 consecutive days.',
    category: 'streak',
    icon: '🔥',
    criteriaType: 'streak_days',
    threshold: 3
  },
  {
    id: 'streak_7_days',
    slug: 'streak_7_days',
    name: '7-Day Ritual',
    description: 'Maintained a 7-day uninterrupted daily brewing ritual.',
    category: 'streak',
    icon: '⚡',
    criteriaType: 'streak_days',
    threshold: 7
  },
  {
    id: 'pour_over_aficionado',
    slug: 'pour_over_aficionado',
    name: 'Pour Over Aficionado',
    description: 'Mastered V60 concentric spiral pouring and logged 5 pour-overs.',
    category: 'method',
    icon: '🌊',
    criteriaType: 'method_brews',
    threshold: 5
  },
  {
    id: 'french_press:expert',
    slug: 'french_press_expert',
    name: 'Immersion Master',
    description: 'Mastered 4-minute crust skimming in the French Press.',
    category: 'method',
    icon: '🏺',
    criteriaType: 'method_brews',
    threshold: 5
  },
  {
    id: 'terroir_explorer',
    slug: 'terroir_explorer',
    name: 'Terroir Atlas Explorer',
    description: 'Explored single-origin coffee or tea varieties across 5 growing nations.',
    category: 'knowledge',
    icon: '🌍',
    criteriaType: 'origin_count',
    threshold: 5
  },
  {
    id: 'recipe_creator',
    slug: 'recipe_creator',
    name: 'Master Alchemist',
    description: 'Designed and saved a custom recipe in your Personal Recipe Studio.',
    category: 'creator',
    icon: '📜',
    criteriaType: 'recipe_count',
    threshold: 1
  }
];
