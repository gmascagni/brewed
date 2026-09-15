/**
 * Comprehensive Specialty Coffee Grinder Calibration Profiles & Setting Translator
 * 
 * Maps micron-calibrated grind sizes (200µm – 1000µm) to exact physical dial numbers,
 * click counts, and sector marks for the world's most popular home and barista grinders.
 */

export const GRINDER_PROFILES = [
  {
    id: 'generic_stepped',
    name: 'Generic / Stepped Grinder (1–10)',
    brand: 'Universal / Other',
    burrType: 'Conical or Flat Burrs (Standard 1–10 Scale)',
    description: 'Universal 1–10 dial with 0.5 step divisions for unlisted electric and manual burr grinders.',
    calibrationTip: 'Use this standard 1–10 baseline; adjust ±0.5 step if your drawdown flow is too fast or slow.',
    settings: {
      extra_fine: {
        setting: '1.0 – 1.5',
        subtext: 'Finest setting without burr rub',
        micronRange: '200 – 300 µm'
      },
      fine: {
        setting: '2.0 – 3.0',
        subtext: 'Fine table-salt texture',
        micronRange: '350 – 500 µm'
      },
      medium_fine: {
        setting: '3.5 – 5.0',
        subtext: 'Single-cup pour-over sweet spot',
        micronRange: '400 – 600 µm'
      },
      medium: {
        setting: '5.5 – 6.5',
        subtext: 'Balanced automatic drip / batch',
        micronRange: '600 – 750 µm'
      },
      medium_coarse: {
        setting: '7.0 – 8.0',
        subtext: 'Coarse sea salt texture',
        micronRange: '750 – 900 µm'
      },
      coarse: {
        setting: '8.5 – 10.0',
        subtext: 'Coarse cracked pepper for immersion',
        micronRange: '800 – 1000 µm'
      }
    }
  },
  {
    id: 'fellow_ode_gen2',
    name: 'Fellow Ode (Gen 2 Burrs)',
    brand: 'Fellow',
    burrType: '64mm Stainless Steel Flat Burrs',
    description: 'Specialized single-dose brew grinder with 31 distinct 1/3-step micro clicks on a 1.0 to 11.0 dial.',
    calibrationTip: 'Calibrate at burr chirp: 1 full click past chirp is true 1.0. Engineered exclusively for filter methods.',
    settings: {
      extra_fine: {
        setting: 'N/A (Filter Only)',
        subtext: 'Not suitable for 9-bar espresso',
        micronRange: '200 – 300 µm'
      },
      fine: {
        setting: '2.0 – 3.1',
        subtext: 'Moka & AeroPress short concentrate',
        micronRange: '350 – 500 µm'
      },
      medium_fine: {
        setting: '4.0 – 5.2',
        subtext: 'V60, Kalita 155, Origami Dripper',
        micronRange: '400 – 600 µm'
      },
      medium: {
        setting: '6.0 – 7.1',
        subtext: 'Batch Drip, Moccamaster, Clever',
        micronRange: '600 – 750 µm'
      },
      medium_coarse: {
        setting: '8.0 – 9.0',
        subtext: 'Chemex 6–8 cup thick filter',
        micronRange: '750 – 900 µm'
      },
      coarse: {
        setting: '9.2 – 11.0',
        subtext: 'French Press & 20h Cold Brew',
        micronRange: '800 – 1000 µm'
      }
    }
  },
  {
    id: 'baratza_encore',
    name: 'Baratza Encore (Classic)',
    brand: 'Baratza',
    burrType: '40mm M3 Hardened Steel Conical Burrs',
    description: 'The industry benchmark 40-step home grinder (~25µm particle shift per click).',
    calibrationTip: 'Individual factory calibration varies by window notch; #14–15 is typical V60 baseline.',
    settings: {
      extra_fine: {
        setting: '#5 – #8',
        subtext: 'Dense fine espresso baseline',
        micronRange: '200 – 300 µm'
      },
      fine: {
        setting: '#9 – #12',
        subtext: 'Stovetop Moka & AeroPress',
        micronRange: '350 – 500 µm'
      },
      medium_fine: {
        setting: '#13 – #16',
        subtext: 'V60 sweet spot (most units #14)',
        micronRange: '400 – 600 µm'
      },
      medium: {
        setting: '#18 – #22',
        subtext: 'Automatic Drip & Flat-Bed Kalita',
        micronRange: '600 – 750 µm'
      },
      medium_coarse: {
        setting: '#23 – #27',
        subtext: 'Chemex bonded paper filter',
        micronRange: '750 – 900 µm'
      },
      coarse: {
        setting: '#28 – #34',
        subtext: 'French press & metal mesh immersion',
        micronRange: '800 – 1000 µm'
      }
    }
  },
  {
    id: 'baratza_encore_esp',
    name: 'Baratza Encore ESP',
    brand: 'Baratza',
    burrType: '40mm M2 Precision Conical Burrs',
    description: 'Dual-range interface: steps 1–20 offer 20µm micro-steps; steps 21–40 offer macro steps for filter.',
    calibrationTip: 'Steps 1–20 are fine-resolution for espresso/moka; switch to 21+ for pour-overs.',
    settings: {
      extra_fine: {
        setting: '#12 – #16',
        subtext: 'Micro-step 9-bar espresso',
        micronRange: '200 – 300 µm'
      },
      fine: {
        setting: '#18 – #21',
        subtext: 'Moka Pot & Fellow Prismo',
        micronRange: '350 – 500 µm'
      },
      medium_fine: {
        setting: '#23 – #26',
        subtext: 'V60 & single-cup pour overs',
        micronRange: '400 – 600 µm'
      },
      medium: {
        setting: '#27 – #30',
        subtext: 'Batch Brew, Moccamaster, Siphon',
        micronRange: '600 – 750 µm'
      },
      medium_coarse: {
        setting: '#31 – #34',
        subtext: 'Chemex 6–10 Cup',
        micronRange: '750 – 900 µm'
      },
      coarse: {
        setting: '#35 – #39',
        subtext: 'French Press & Cold Brew',
        micronRange: '800 – 1000 µm'
      }
    }
  },
  {
    id: 'comandante_c40',
    name: 'Comandante C40 MK3 / MK4',
    brand: 'Comandante',
    burrType: 'High-Nitrogen Steel Nitro Blade Conical',
    description: 'World-championship manual hand grinder with 12 clicks per 360° turn (~30µm per click).',
    calibrationTip: 'Count clicks from "true zero" (where the handle no longer swings freely under its own weight).',
    settings: {
      extra_fine: {
        setting: '9 – 13 clicks',
        subtext: 'Espresso (use Red Clix for 18–26)',
        micronRange: '200 – 300 µm'
      },
      fine: {
        setting: '14 – 18 clicks',
        subtext: 'Moka Pot & inverted AeroPress',
        micronRange: '350 – 500 µm'
      },
      medium_fine: {
        setting: '20 – 25 clicks',
        subtext: 'V60 golden cup standard (22–24 clicks)',
        micronRange: '400 – 600 µm'
      },
      medium: {
        setting: '26 – 29 clicks',
        subtext: 'Kalita Wave & small batch brew',
        micronRange: '600 – 750 µm'
      },
      medium_coarse: {
        setting: '30 – 34 clicks',
        subtext: 'Chemex thick bonded filter',
        micronRange: '750 – 900 µm'
      },
      coarse: {
        setting: '35 – 40 clicks',
        subtext: 'French Press & Cold Brew',
        micronRange: '800 – 1000 µm'
      }
    }
  },
  {
    id: 'timemore_c2_c3',
    name: 'Timemore Chestnut C2 / C3',
    brand: 'Timemore',
    burrType: 'Precision Stainless Steel Conical Burrs',
    description: 'Popular compact hand grinder with internal indexed click wheel (numbered from closed).',
    calibrationTip: 'Turn wheel fully clockwise until snug (0 clicks). Never grind below 6 clicks to protect burr teeth.',
    settings: {
      extra_fine: {
        setting: '7 – 9 clicks',
        subtext: 'Fine espresso / Turkish Ibrik',
        micronRange: '200 – 300 µm'
      },
      fine: {
        setting: '10 – 12 clicks',
        subtext: 'Moka Pot & intense AeroPress',
        micronRange: '350 – 500 µm'
      },
      medium_fine: {
        setting: '13 – 16 clicks',
        subtext: 'V60 pour over sweet spot (14–15 clicks)',
        micronRange: '400 – 600 µm'
      },
      medium: {
        setting: '17 – 20 clicks',
        subtext: 'Clever Dripper & Kalita Wave',
        micronRange: '600 – 750 µm'
      },
      medium_coarse: {
        setting: '21 – 24 clicks',
        subtext: 'Chemex multi-pour filter',
        micronRange: '750 – 900 µm'
      },
      coarse: {
        setting: '25 – 28 clicks',
        subtext: 'French Press & Toddy cold brew',
        micronRange: '800 – 1000 µm'
      }
    }
  },
  {
    id: '1zpresso_k_ultra',
    name: '1Zpresso K-Ultra / K-Max',
    brand: '1Zpresso',
    burrType: '48mm Stainless Steel K-Burr',
    description: 'External adjustment ring with 100 clicks per rotation (precise 20µm per click movement).',
    calibrationTip: 'Zero point is fully closed. Read as: [Whole Number].[Click Digit] (e.g., 7.5 = 75 clicks).',
    settings: {
      extra_fine: {
        setting: '3.0 – 4.0',
        subtext: '30–40 clicks (9-bar espresso)',
        micronRange: '200 – 300 µm'
      },
      fine: {
        setting: '4.5 – 5.8',
        subtext: '45–58 clicks (Moka & AeroPress)',
        micronRange: '350 – 500 µm'
      },
      medium_fine: {
        setting: '6.5 – 7.8',
        subtext: '65–78 clicks (V60 & Kalita)',
        micronRange: '400 – 600 µm'
      },
      medium: {
        setting: '8.0 – 8.8',
        subtext: '80–88 clicks (Batch Brewer & Siphon)',
        micronRange: '600 – 750 µm'
      },
      medium_coarse: {
        setting: '9.0 – 9.8',
        subtext: '90–98 clicks (Chemex)',
        micronRange: '750 – 900 µm'
      },
      coarse: {
        setting: '10.0 – 11.0',
        subtext: '100–110 clicks (French Press)',
        micronRange: '800 – 1000 µm'
      }
    }
  },
  {
    id: 'fellow_ode_gen1',
    name: 'Fellow Ode (Gen 1 Stock)',
    brand: 'Fellow',
    burrType: '64mm Stainless Steel Flat Burrs',
    description: 'Original Ode Gen 1 with coarser burr geometry calibrated for clarity and clean filter cups.',
    calibrationTip: 'Ode Gen 1 runs coarser than Gen 2; use 1.0 to 2.0 for single-cup V60 brews.',
    settings: {
      extra_fine: {
        setting: 'N/A (Filter Only)',
        subtext: 'Not suitable for espresso',
        micronRange: '200 – 300 µm'
      },
      fine: {
        setting: '1.0 – 1.1',
        subtext: 'AeroPress concentrate',
        micronRange: '350 – 500 µm'
      },
      medium_fine: {
        setting: '1.2 – 2.2',
        subtext: 'V60 single-cup (1.2 to 2.0)',
        micronRange: '400 – 600 µm'
      },
      medium: {
        setting: '3.0 – 4.1',
        subtext: 'Kalita Wave & Drip Maker',
        micronRange: '600 – 750 µm'
      },
      medium_coarse: {
        setting: '5.0 – 6.2',
        subtext: 'Chemex Glass Brewer',
        micronRange: '750 – 900 µm'
      },
      coarse: {
        setting: '7.0 – 9.0',
        subtext: 'French Press & Cold Brew',
        micronRange: '800 – 1000 µm'
      }
    }
  },
  {
    id: 'wilfa_svart',
    name: 'Wilfa Svart Aroma',
    brand: 'Wilfa',
    burrType: 'Steel Conical Burrs (Hopper-Ring Adjust)',
    description: 'Nordic filter icon with method-labeled sectors: Moka, Aeropress, Filter, French Press.',
    calibrationTip: 'Rotate bean hopper to line up mark with silver indicator line.',
    settings: {
      extra_fine: {
        setting: 'N/A (Filter Only)',
        subtext: 'Not suitable for espresso',
        micronRange: '200 – 300 µm'
      },
      fine: {
        setting: 'Moka (dot 2–3)',
        subtext: 'Moka sector middle dots',
        micronRange: '350 – 500 µm'
      },
      medium_fine: {
        setting: 'Aeropress to Filter',
        subtext: 'Between Aero dot 3 and Filter dot 1',
        micronRange: '400 – 600 µm'
      },
      medium: {
        setting: 'Filter (dot 2–3)',
        subtext: 'Automatic Drip & Kalita',
        micronRange: '600 – 750 µm'
      },
      medium_coarse: {
        setting: 'Filter dot 5 – French dot 1',
        subtext: 'Chemex 6–8 cup',
        micronRange: '750 – 900 µm'
      },
      coarse: {
        setting: 'French Press (dot 3–5)',
        subtext: 'Coarse immersion steep',
        micronRange: '800 – 1000 µm'
      }
    }
  }
];

export const STORAGE_KEY_GRINDER_MODEL = 'the_brew_app_grinder_model';
export const DEFAULT_GRINDER_ID = 'generic_stepped';

/**
 * Retrieves the saved grinder model ID or defaults to the generic stepped grinder.
 * @returns {string}
 */
export function getSavedGrinderId() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_GRINDER_MODEL);
    if (saved && GRINDER_PROFILES.some(g => g.id === saved)) {
      return saved;
    }
  } catch {}
  return DEFAULT_GRINDER_ID;
}

/**
 * Persists the user's preferred grinder model.
 * @param {string} grinderId
 */
export function saveGrinderId(grinderId) {
  try {
    localStorage.setItem(STORAGE_KEY_GRINDER_MODEL, grinderId);
  } catch {}
}

/**
 * Returns the profile matching the given ID or falls back to the default profile.
 * @param {string} grinderId
 * @returns {Object}
 */
export function getGrinderProfile(grinderId) {
  return GRINDER_PROFILES.find(g => g.id === grinderId) || GRINDER_PROFILES[0];
}

/**
 * Returns the specific setting recommendation for a grinder model and grind category.
 * @param {string} grinderId
 * @param {string} grindId ('extra_fine' | 'fine' | 'medium_fine' | 'medium' | 'medium_coarse' | 'coarse')
 * @returns {Object}
 */
export function getGrinderSetting(grinderId, grindId) {
  const profile = getGrinderProfile(grinderId);
  const settingData = profile?.settings?.[grindId] || {
    setting: 'See Grinder Manual',
    subtext: 'Standard Burr Range',
    micronRange: '400 – 600 µm'
  };

  return {
    ...settingData,
    grinderName: profile.name,
    grinderBrand: profile.brand,
    calibrationTip: profile.calibrationTip
  };
}
