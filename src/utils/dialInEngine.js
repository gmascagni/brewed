/**
 * Closed-Loop Recipe Adjustment & Dial-In Engine
 * 
 * Analyzes post-brew drawdown time and sensory taste feedback (Sour vs Sweet vs Bitter),
 * diagnoses extraction physics (under-extracted, over-extracted, channeled mud clog),
 * and generates exact quantitative next-brew tweaks (grinder clicks, water temp, ratio).
 */

import { getGrinderProfile, getGrinderSetting, getSavedGrinderId } from '../data/grinderProfiles.js';
import { shiftGrindSetting } from './brewSessionManager.js';

export const METHOD_DRAWDOWN_TARGETS = {
  pour_over: {
    name: 'Hario V60 / Cone Dripper',
    minSec: 165, // 2:45
    maxSec: 210, // 3:30
    idealStr: '2:45 – 3:30'
  },
  classic_pour_over: {
    name: 'Kalita Wave / Flat Bottom',
    minSec: 165, // 2:45
    maxSec: 195, // 3:15
    idealStr: '2:45 – 3:15'
  },
  chemex: {
    name: 'Chemex 6–8 Cup',
    minSec: 225, // 3:45
    maxSec: 270, // 4:30
    idealStr: '3:45 – 4:30'
  },
  aeropress: {
    name: 'AeroPress',
    minSec: 90,  // 1:30
    maxSec: 120, // 2:00
    idealStr: '1:30 – 2:00'
  },
  french_press: {
    name: 'French Press',
    minSec: 240, // 4:00
    maxSec: 270, // 4:30
    idealStr: '4:00 – 4:30'
  },
  moka_pot: {
    name: 'Moka Pot',
    minSec: 120, // 2:00
    maxSec: 180, // 3:00
    idealStr: '2:00 – 3:00'
  },
  drip_brewer: {
    name: 'Automatic Drip Brewer',
    minSec: 240, // 4:00
    maxSec: 360, // 6:00
    idealStr: '4:00 – 6:00'
  }
};

/**
 * Formats seconds into MM:SS format
 * @param {number} sec 
 * @returns {string}
 */
export function formatSecondsToMmSs(sec) {
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${rem < 10 ? '0' : ''}${rem}`;
}

/**
 * Calculates quantitative next-brew tweaks from drawdown duration and taste profile.
 * 
 * @param {Object} params
 * @param {string} params.methodId Brew method ID (e.g. 'pour_over')
 * @param {number} params.actualDrawdownSec Total brew / drawdown duration in seconds
 * @param {string} params.tasteProfile 'sour' | 'sweet' | 'bitter' | 'skipped'
 * @param {number} params.currentTempF Water temperature in °F used for this brew
 * @param {number} params.currentRatio Brew ratio (e.g. 16)
 * @param {string} params.currentGrindSetting Active grinder physical dial setting
 * @param {string} params.grinderId User's active grinder model ID
 * @returns {Object} Quantitative diagnosis and next-brew tweaks
 */
export function calculateClosedLoopDialIn({
  methodId = 'pour_over',
  actualDrawdownSec = 195,
  tasteProfile = 'sweet',
  currentTempF = 204,
  currentRatio = 16,
  currentGrindSetting = '4.5',
  grinderId = 'generic_stepped'
}) {
  const target = METHOD_DRAWDOWN_TARGETS[methodId] || METHOD_DRAWDOWN_TARGETS.pour_over;
  const { minSec, maxSec, idealStr } = target;

  const durationFormatted = formatSecondsToMmSs(actualDrawdownSec);

  // Flow classification with ±toleranceSec buffer to prevent false-positive recommendations
  // for brews that are only marginally outside the ideal window (±10s default).
  const toleranceSec = target.toleranceSec ?? 10;
  let flowSpeed = 'optimal';
  if (actualDrawdownSec < minSec - toleranceSec) {
    flowSpeed = 'fast';
  } else if (actualDrawdownSec > maxSec + toleranceSec) {
    flowSpeed = 'slow';
  }

  const activeGrinder = getGrinderProfile(grinderId || getSavedGrinderId());
  const grinderName = activeGrinder?.name || 'Your Grinder';

  let diagnosisTitle = '';
  let diagnosisDetail = '';
  let shortAnalysis = '';
  let grindShiftSteps = 0; // Negative = finer, Positive = coarser
  let targetTempF = currentTempF;
  let targetRatio = currentRatio;
  let singleVariable = 'none'; // 'grind' | 'temp' | 'ratio' | 'none'
  let singleActionLabel = 'Keep current recipe';
  let statusBadge = 'optimal';

  if (tasteProfile === 'sweet' || tasteProfile === 'balanced') {
    statusBadge = 'golden_cup';
    singleVariable = 'none';
    singleActionLabel = 'Lock in recipe';
    diagnosisTitle = 'Golden Cup Extraction Locked In!';
    shortAnalysis = `Drawdown of ${durationFormatted} landed within the ideal ${idealStr} window. Sweetness, acidity, and body are in golden balance.`;
    diagnosisDetail = `Drawdown of ${durationFormatted} fell within the ${idealStr} window. Ratio, flow rate, and dissolved solubles are in optimal balance.`;
  } else if (tasteProfile === 'weak') {
    // 1. Weak / Watery -> Ratio is the single variable to adjust
    statusBadge = 'under_concentrated';
    singleVariable = 'ratio';
    singleActionLabel = 'Tighten brew ratio';
    targetRatio = Math.max(14, Number((currentRatio - 1.0).toFixed(1)));
    diagnosisTitle = 'Under-Concentrated (Low TDS / Watery)';
    shortAnalysis = `Drawdown resulted in low dissolved strength (watery/hollow cup). Increasing dry coffee dose relative to water will extract richer body.`;
    diagnosisDetail = `The cup lacks body, depth, and flavor intensity. Increasing dry coffee dose relative to water will extract richer solubles.`;
  } else if (tasteProfile === 'strong') {
    // 2. Strong / Heavy -> Ratio is the single variable to adjust
    statusBadge = 'over_concentrated';
    singleVariable = 'ratio';
    singleActionLabel = 'Widen brew ratio';
    targetRatio = Math.min(18, Number((currentRatio + 1.0).toFixed(1)));
    diagnosisTitle = 'Over-Concentrated (Heavy / Low Clarity)';
    shortAnalysis = `Cup is overly concentrated with high TDS muting delicate floral and fruit notes. Widening the brew ratio opens up clarity.`;
    diagnosisDetail = `The cup is overly intense, syrupy, or muddy with low floral/fruit clarity. Opening the brew ratio provides more water solvent for crisp note separation.`;
  } else if (flowSpeed === 'slow' && tasteProfile === 'bitter') {
    // 3. Slow + Bitter -> Grind is the single variable (coarser)
    statusBadge = 'over_extracted';
    singleVariable = 'grind';
    singleActionLabel = 'Grind coarser';
    grindShiftSteps = 2; // 2 clicks coarser
    diagnosisTitle = 'Over-Extracted (Bed Stalled / High Tannins)';
    shortAnalysis = `Water was in contact with grounds for ${durationFormatted} (target: ${idealStr}). Slow water drainage dissolved harsh astringent tannins and bitter compounds.`;
    diagnosisDetail = shortAnalysis;
  } else if (flowSpeed === 'slow' && tasteProfile === 'sour') {
    // 4. Slow + Sour -> Channeled Mud Clog! Grind is the single variable (coarser)
    statusBadge = 'channeled_clog';
    singleVariable = 'grind';
    singleActionLabel = 'Grind coarser (unclog fines)';
    grindShiftSteps = 2; // Coarser to stop fines clogging
    diagnosisTitle = 'Channeled Mud Clog (Fines Migration)';
    shortAnalysis = `Counter-intuitive barista trap: grounds were too fine, creating a mud bed that clogged filter pores and forced water down side channels while center remained dry and sour.`;
    diagnosisDetail = shortAnalysis;
  } else if (flowSpeed === 'fast' && tasteProfile === 'sour') {
    // 5. Fast + Sour -> Grind is the single variable (finer)
    statusBadge = 'under_extracted';
    singleVariable = 'grind';
    singleActionLabel = 'Grind finer';
    grindShiftSteps = -2; // 2 clicks finer
    diagnosisTitle = 'Under-Extracted (Fast Drainage / Hollow Acidity)';
    shortAnalysis = `Water drained in only ${durationFormatted} (target: ${idealStr}). Water rushed through before sweet core solubles and sugars could dissolve, leaving sharp acidity.`;
    diagnosisDetail = shortAnalysis;
  } else if (flowSpeed === 'fast' && tasteProfile === 'bitter') {
    // 6. Fast + Bitter -> Rapid Channeling Hole (grind finer + gentle pour)
    statusBadge = 'channeling';
    singleVariable = 'grind';
    singleActionLabel = 'Grind 1 click finer';
    grindShiftSteps = -1;
    diagnosisTitle = 'High-Speed Channeling';
    shortAnalysis = `Water drained quickly (${durationFormatted}) yet tastes bitter. A hard water stream carved a hole through the coffee bed, scorching that narrow path.`;
    diagnosisDetail = shortAnalysis;
  } else if (flowSpeed === 'optimal' && tasteProfile === 'bitter') {
    // 7. Optimal Flow + Bitter -> Water Temp is the single variable (drop temp)
    statusBadge = 'too_hot';
    singleVariable = 'temp';
    singleActionLabel = 'Lower water temperature';
    targetTempF = Math.max(195, currentTempF - 3);
    diagnosisTitle = 'Thermal Over-Extraction';
    shortAnalysis = `Flow time of ${durationFormatted} was ideal (${idealStr}), but water temperature extracted harsh astringency. Keeping grind and dropping temp will restore sweetness.`;
    diagnosisDetail = shortAnalysis;
  } else if (flowSpeed === 'optimal' && tasteProfile === 'sour') {
    // 8. Optimal Flow + Sour -> Water Temp is the single variable (raise temp)
    statusBadge = 'too_cool';
    singleVariable = 'temp';
    singleActionLabel = 'Increase water temperature';
    targetTempF = Math.min(210, currentTempF + 3);
    diagnosisTitle = 'Thermal Under-Extraction';
    shortAnalysis = `Flow time of ${durationFormatted} was ideal (${idealStr}), but water lacked the thermal energy required to dissolve complex sweet sugars from dense beans.`;
    diagnosisDetail = shortAnalysis;
  } else {
    // Fallback
    diagnosisTitle = 'Standard Extraction Feedback';
    shortAnalysis = `Recorded ${durationFormatted} drawdown time for this brew.`;
    diagnosisDetail = shortAnalysis;
  }

  // Calculate shifted grind setting
  const targetGrindSetting = shiftGrindSetting(currentGrindSetting, grindShiftSteps, grinderId || getSavedGrinderId());

  // Build the single-variable tweak object
  let singleSummary = '';
  let fromValue = '';
  let toValue = '';
  let lockedVariables = [];

  const tempC = Math.round(((targetTempF - 32) * 5) / 9);
  const currentTempC = Math.round(((currentTempF - 32) * 5) / 9);

  if (singleVariable === 'grind') {
    fromValue = currentGrindSetting || '22 clicks';
    toValue = targetGrindSetting;
    singleSummary = `${singleActionLabel}: ${fromValue} → ${toValue}. Keep dose, water, and temp locked.`;
    lockedVariables = [
      `Dose & Water: Locked`,
      `Temp: ${currentTempC}°C (${currentTempF}°F)`,
      `Ratio: 1:${currentRatio}`
    ];
  } else if (singleVariable === 'temp') {
    fromValue = `${currentTempC}°C (${currentTempF}°F)`;
    toValue = `${tempC}°C (${targetTempF}°F)`;
    singleSummary = `${singleActionLabel}: ${fromValue} → ${toValue}. Keep grind (${currentGrindSetting}) and ratio locked.`;
    lockedVariables = [
      `Grind: ${currentGrindSetting}`,
      `Dose & Water: Locked`,
      `Ratio: 1:${currentRatio}`
    ];
  } else if (singleVariable === 'ratio') {
    fromValue = `1:${currentRatio}`;
    toValue = `1:${targetRatio}`;
    singleSummary = `${singleActionLabel}: ${fromValue} → ${toValue}. Keep grind (${currentGrindSetting}) and temp locked.`;
    lockedVariables = [
      `Grind: ${currentGrindSetting}`,
      `Temp: ${currentTempC}°C (${currentTempF}°F)`,
      `Dose: Locked`
    ];
  } else {
    fromValue = currentGrindSetting;
    toValue = currentGrindSetting;
    singleSummary = `Golden Cup locked in! Replicate current settings for your next brew.`;
    lockedVariables = ['All parameters locked'];
  }

  const ratioShift = Number((targetRatio - currentRatio).toFixed(1));
  const tempShiftF = targetTempF - currentTempF;

  const singleVariableTweak = {
    variable: singleVariable,
    actionLabel: singleActionLabel,
    summary: singleSummary,
    fromValue,
    toValue,
    targetGrindSetting: singleVariable === 'grind' ? targetGrindSetting : currentGrindSetting,
    targetTempF,
    targetTempC: tempC,
    targetRatio,
    lockedVariables
  };

  return {
    methodId,
    methodName: target.name,
    actualDrawdownSec,
    durationFormatted,
    targetWindowStr: idealStr,
    flowSpeed,
    tasteProfile,
    statusBadge,
    diagnosisType: statusBadge,
    headline: diagnosisTitle,
    diagnosisTitle,
    diagnosisDetail,
    shortAnalysis,
    recommendationText: singleSummary,
    summaryHeadline: singleSummary,
    grindRecommendation: singleActionLabel,
    grindShiftSteps,
    currentTempF,
    targetTempF,
    currentRatio,
    targetRatio,
    grinderName,
    singleVariableTweak,
    recipePatch: {
      tempF: targetTempF,
      tempC,
      tempShiftF,
      recommendedRatio: targetRatio,
      ratio: targetRatio,
      ratioShift,
      grindShift: grindShiftSteps,
      grindSetting: targetGrindSetting,
      grinderName,
      singleVariableTweak
    }
  };
}

/**
 * Quick-tap natural language symptom prompts for the AI Barista Co-Pilot
 */
export const AI_SYMPTOM_PRESETS = [
  {
    id: 'stalled_dry',
    label: '🛑 Water pooled & stalled; tastes dry/astringent',
    text: 'Water pooled on top and stalled near the end of the drawdown. The spent bed looks muddy on top and the cup tastes dry and astringent on my tongue.'
  },
  {
    id: 'crater_sour',
    label: '🕳️ Deep crater in bed + grounds on walls; sour & thin',
    text: 'There is a deep crater in the center of the coffee bed with lots of grounds stuck high up on the filter walls. It drained fast and tastes sour and watery.'
  },
  {
    id: 'no_bloom',
    label: '🫧 Bloom barely bubbled & drained super fast',
    text: 'During the bloom phase the grounds barely bubbled or expanded at all, and the water rushed straight through in under 2 minutes. Tastes flat and hollow.'
  },
  {
    id: 'sour_bitter_both',
    label: '⚡ Tastes both sour AND bitter at the same time',
    text: 'My cup tastes confusing—simultaneously sharp/sour up front and harsh/bitter in the finish. I poured pretty aggressively.'
  },
  {
    id: 'muted_heavy',
    label: '🪨 Tastes heavy & muddy; missing floral/fruit notes',
    text: 'The coffee tastes heavy, syrupy, and muted. I cannot taste any of the floral or fruit notes listed on the bag.'
  },
  {
    id: 'baked_flat',
    label: '🌾 Tastes papery, flat, or grain-like with zero sweetness',
    text: 'The cup has no brightness or sweetness—it tastes papery, flat, and slightly grain-like even though my drawdown time looked normal.'
  }
];

/**
 * Natural-Language AI Barista Co-Pilot Diagnostic Engine
 * Analyzes a user's free-text description of their brew behavior, coffee bed appearance,
 * and cup taste alongside live brew telemetry to generate a 3-part prescription:
 * (1) Extraction Physics Root Cause, (2) Pouring & Technique Adjustment, (3) 1-Click Recipe Patch.
 */
export function analyzeUserBrewDescription({
  description = '',
  methodId = 'pour_over',
  actualDrawdownSec = 195,
  currentTempF = 202,
  currentRatio = 16,
  currentGrindSetting = 'Medium-Fine',
  grinderId = 'generic_stepped',
  beanInfo = null
}) {
  const raw = String(description || '').trim();
  const text = raw.toLowerCase();
  const target = METHOD_DRAWDOWN_TARGETS[methodId] || METHOD_DRAWDOWN_TARGETS.pour_over;
  const activeGrinder = getGrinderProfile(grinderId || getSavedGrinderId());
  const grinderName = activeGrinder?.name || 'Your Grinder';
  const beanName = beanInfo?.beanName || beanInfo?.name || 'your coffee';
  const roastLevel = String(beanInfo?.roastLevel || beanInfo?.roast || 'Medium-Light');

  // Pattern detection flags
  const hasStallOrMud = /stall|clog|pool|slow|mud|sludge|choke|drip|forever|stuck/.test(text);
  const hasCraterOrWalls = /crater|hole|wall|high\s*an\s*dry|funnel|cone|side|uneven\s*bed|channel/.test(text);
  const hasNoBloomOrFlat = /no\s*bloom|barely\s*bubbl|didn't\s*bloom|flat|stale|no\s*gas|old\s*bean/.test(text);
  const hasSourAndBitter = /(sour.*bitter|bitter.*sour|both\s*sour|confus|sharp.*harsh|astringent.*sour)/.test(text);
  const hasSourOrThin = /sour|acid|lemon|vinegar|sharp|tart|under|watery|thin|weak|fast|rush|gush/.test(text);
  const hasBitterOrDry = /bitter|dry|astringent|harsh|burnt|ash|tannin|over|roasty|char/.test(text);
  const hasMutedOrHeavy = /muted|heavy|syrup|muddy|no\s*clarity|can't\s*taste|missing\s*note|dull|thick/.test(text);
  const hasPaperyOrBaked = /paper|cardboard|grain|baked|cereal|straw|hay|hollow/.test(text);

  let headline = 'Precision Extraction Diagnosis';
  let statusBadge = 'ai_diagnosed';
  let tasteProfile = 'balanced';
  let detectedSignals = [];
  let physicsExplanation = '';
  let techniquePrescription = [];
  let grindShiftSteps = 0;
  let targetTempF = currentTempF;
  let targetRatio = currentRatio;
  let singleVariable = 'grind';
  let singleActionLabel = 'Adjust Grind Setting';

  if (hasSourAndBitter) {
    headline = 'Severe Bypass Channeling (Simultaneous Under- & Over-Extraction)';
    statusBadge = 'channeling';
    tasteProfile = 'bitter';
    detectedSignals = ['Localized Jet Channeling', 'Uneven Bed Saturation', 'Mixed Sour + Bitter Solubles'];
    physicsExplanation = `When a cup tastes both sour AND bitter at the same time, water found a path of least resistance (a channel) through the coffee bed. Along that narrow fissure, water flowed rapidly and over-extracted harsh bitter tannins, while leaving surrounding pockets of ${beanName} under-extracted and sour.`;
    techniquePrescription = [
      'Ensure every gram of dry coffee is evenly wet during the first 15 seconds of the Bloom—gently swirl the brewer (the Rao Spin) so no dry clumps remain.',
      'Pour slower (~5–6 g/sec) in tight concentric circles from the center outward, never pouring directly onto the paper filter walls.',
      'After your final pour, give one gentle circular swirl to level the coffee bed into a flat pancake.'
    ];
    grindShiftSteps = 1; // 1 click coarser to reduce bed resistance and channeling
    singleVariable = 'grind';
    singleActionLabel = 'Grind 1 click coarser + gentle swirl';
  } else if (hasStallOrMud) {
    headline = 'Micro-Fines Filter Migration & Bed Stall';
    statusBadge = 'channeled_clog';
    tasteProfile = hasSourOrThin && !hasBitterOrDry ? 'sour' : 'bitter';
    detectedSignals = ['Filter Pore Blinding (Fines)', 'Stalled Drawdown', 'Extended Contact Time'];
    physicsExplanation = `High agitation or an overly fine grind generated microscopic coffee dust ("fines") that washed down to the bottom of the paper filter and sealed its pores. Water pooled on top of ${beanName}, extending contact time and extracting dry, puckering polyphenols.`;
    techniquePrescription = [
      'Lower your kettle spout closer to the slurry surface (1.5–2 inches) so the water stream gently enters without stirring up fines.',
      'Avoid aggressive swirling or stirring after the middle pours—only do one gentle swirl right after the bloom.',
      'If brewing a dense Ethiopian or decaf lot (which naturally shatter into more fines), coarsen your grind by 2 clicks.'
    ];
    grindShiftSteps = 2; // 2 clicks coarser
    singleVariable = 'grind';
    singleActionLabel = 'Grind 2 clicks coarser (unclog fines)';
  } else if (hasCraterOrWalls) {
    headline = 'Center-Hole Crater & High-Wall Water Bypass';
    statusBadge = 'under_extracted';
    tasteProfile = 'sour';
    detectedSignals = ['Cratered Spend Bed', 'High-Wall Grounds Bypass', 'Low Extraction Yield'];
    physicsExplanation = `Pouring primarily in the dead center or pouring too fast drilled a hole through the middle of the coffee bed and pushed grounds high onto the filter walls. Those stranded wall grounds stopped participating in extraction early, leaving the cup thin and sour.`;
    techniquePrescription = [
      'Spiral your pour outward to within 1 cm of the filter wall so rising water lifts and integrates the outer grounds.',
      'At the end of your final pour, wash down any grounds clinging to the upper paper with a gentle perimeter ring pour, followed by a gentle 1-second swirl.',
      'Aim for a completely flat, level bed at the end of drawdown.'
    ];
    grindShiftSteps = -1; // 1 click finer
    singleVariable = 'grind';
    singleActionLabel = 'Grind 1 click finer + level bed swirl';
  } else if (hasNoBloomOrFlat) {
    headline = 'Low CO₂ Degassing / Rapid Pre-Infusion Drainage';
    statusBadge = 'under_extracted';
    tasteProfile = 'weak';
    detectedSignals = ['Low CO₂ Bloom Expansion', 'Low Bed Resistance', 'Fast Soluble Washout'];
    physicsExplanation = `Minimal bubbling during the bloom means the roasted beans have already degassed most of their CO₂ (or are ground too coarse). Without escaping CO₂ gas bubbles to create hydraulic resistance, water rushes straight through the bed before sweet sugars can dissolve.`;
    techniquePrescription = [
      'Grind 2 clicks finer to restore hydraulic resistance in the coffee bed.',
      'Use a smaller, gentler bloom pour (2.5× dry dose weight) and swirl immediately so water coats every particle.',
      'Break your main pour into 2–3 smaller pulse pours rather than one large continuous flood.'
    ];
    grindShiftSteps = -2; // 2 clicks finer
    singleVariable = 'grind';
    singleActionLabel = 'Grind 2 clicks finer + pulse pour';
  } else if (hasPaperyOrBaked) {
    headline = 'Cellulose Filter Taste or Low Thermal Energy (Flat/Papery)';
    statusBadge = 'too_cool';
    tasteProfile = 'sour';
    detectedSignals = ['Papery / Cellulose Note', 'Suppressed Caramelization', 'Thermal Drop'];
    physicsExplanation = `A papery or grain-like taste comes from two primary sources: (1) un-rinsed paper filter cellulose leaching into the brew, or (2) brewing water dropping below 194°F (or a stalled RoR "baked" roast), which fails to extract sweet Maillard melanoidins.`;
    techniquePrescription = [
      'Thoroughly rinse your paper filter with 150–200 mL of hot water before adding coffee grounds (and dump the rinse water).',
      `Increase your kettle temperature by +3°F (up to ${Math.min(210, currentTempF + 3)}°F) and keep the lid on the kettle between pours.`,
      'Pre-warm your brewer and server so thermal mass does not steal heat from the slurry.'
    ];
    targetTempF = Math.min(210, currentTempF + 3);
    singleVariable = 'temp';
    singleActionLabel = `Raise water temp to ${targetTempF}°F + hot filter rinse`;
  } else if (hasMutedOrHeavy) {
    headline = 'High TDS Concentration Masking Delicate Aromatics';
    statusBadge = 'over_concentrated';
    tasteProfile = 'strong';
    detectedSignals = ['High TDS Concentration', 'Muted Floral/Fruit Clarity', 'Heavy Mouthfeel'];
    physicsExplanation = `When a specialty coffee tastes heavy or syrupy with muted origin notes, the dissolved solids concentration (TDS) is too high—your palate cannot separate individual aromatic compounds when they are packed too densely.`;
    techniquePrescription = [
      `Open up your brew ratio from 1:${currentRatio} to 1:${Math.min(18, Number((currentRatio + 1).toFixed(1)))} (adding ~15–20 mL more water for the same coffee dose).`,
      'Let the cup cool to 135–140°F (57–60°C) before evaluating—retronasal fruit and floral perception peaks as coffee cools toward body temperature.'
    ];
    targetRatio = Math.min(18, Number((currentRatio + 1.0).toFixed(1)));
    singleVariable = 'ratio';
    singleActionLabel = `Widen ratio to 1:${targetRatio} for note separation`;
  } else if (hasBitterOrDry) {
    const isSlow = actualDrawdownSec > target.maxSec + 10;
    headline = isSlow ? 'Over-Extraction from Slow Drawdown & Excess Contact Time' : 'Thermal & Agitation Over-Extraction';
    statusBadge = isSlow ? 'over_extracted' : 'too_hot';
    tasteProfile = 'bitter';
    detectedSignals = isSlow
      ? ['Extended Drawdown Time', 'Late-Stage Tannin Extraction', 'Fine Particle Resistance']
      : ['High Thermal Energy', 'Astringent Finish', 'Cellulose Breakdown'];
    physicsExplanation = isSlow
      ? `Your drawdown (${formatSecondsToMmSs(actualDrawdownSec)}) exceeded the ${target.idealStr} sweet spot for ${target.name}. Once soluble sugars finish extracting around 20% yield, extended water contact pulls out bitter chlorogenic acid lactones and dry wood tannins.`
      : `Your drawdown time (${formatSecondsToMmSs(actualDrawdownSec)}) was on target, meaning water temperature (${currentTempF}°F) or pour agitation was too aggressive for this ${roastLevel} roast, pulling harsh late-stage compounds.`;
    techniquePrescription = isSlow
      ? [
          'Coarsen your grinder by 2 clicks to speed up flow rate by ~15–25 seconds.',
          'Pour in a slower, gentler center stream during the final phase so you do not agitate the settling bed.'
        ]
      : [
          `Drop your kettle temperature by 3°F (from ${currentTempF}°F to ${Math.max(192, currentTempF - 3)}°F) to calm down bitter compound solubility.`,
          'Pull the brewer off the carafe 5 seconds earlier if the final drips look pale and watery.'
        ];
    if (isSlow) {
      grindShiftSteps = 2;
      singleVariable = 'grind';
      singleActionLabel = 'Grind 2 clicks coarser';
    } else {
      targetTempF = Math.max(192, currentTempF - 3);
      singleVariable = 'temp';
      singleActionLabel = `Lower water temp to ${targetTempF}°F`;
    }
  } else if (hasSourOrThin) {
    const isFast = actualDrawdownSec < target.minSec - 10;
    headline = isFast ? 'Under-Extraction from Rapid Drawdown (Low Contact Time)' : 'Under-Extracted Core Sugars';
    statusBadge = 'under_extracted';
    tasteProfile = 'sour';
    detectedSignals = isFast
      ? ['Rapid Water Drainage', 'Coarse Grind Permeability', 'Unbalanced Organic Acids']
      : ['Incomplete Sugar Dissolution', 'Low Thermal/Surface Extraction'];
    physicsExplanation = `Organic acids (citric, malic) dissolve first in the initial 60 seconds of brewing, whereas Maillard sugars and caramel sweetness dissolve second. Because extraction stopped early, the natural acids in ${beanName} lack the sweet foundation needed to balance them.`;
    techniquePrescription = [
      'Adjust your grinder 2 clicks finer to expose more bean surface area and slow the flow rate into the sweet spot.',
      'Extend your bloom to a full 45 seconds with a gentle swirl so water penetrates the dense inner cell matrix.',
      `Keep water temperature hot (${Math.max(currentTempF, 203)}°F) throughout the pour.`
    ];
    grindShiftSteps = -2;
    singleVariable = 'grind';
    singleActionLabel = 'Grind 2 clicks finer';
  } else {
    // Balanced or general observation
    headline = 'Balanced Extraction Telemetry & Fine-Tuning';
    statusBadge = 'golden_cup';
    tasteProfile = 'sweet';
    detectedSignals = ['Balanced Flow Dynamics', 'Even Slurry Extraction'];
    physicsExplanation = `Based on your notes and a ${formatSecondsToMmSs(actualDrawdownSec)} drawdown on ${target.name} (target: ${target.idealStr}), your extraction is sitting in a healthy window. To push sweetness even further on ${beanName}, focus on bed flatness and pouring consistency.`;
    techniquePrescription = [
      'Maintain a steady vertical stream from your gooseneck kettle so the water enters the slurry silently without splashing.',
      'Taste the cup at three temperatures (Hot ~155°F, Warm ~135°F, Cool ~115°F) to experience how acidity opens into sweetness.'
    ];
    singleVariable = 'none';
    singleActionLabel = 'Lock in current recipe';
  }

  const targetGrindSetting = shiftGrindSetting(currentGrindSetting, grindShiftSteps, grinderId || getSavedGrinderId());
  const tempC = Math.round(((targetTempF - 32) * 5) / 9);
  const currentTempC = Math.round(((currentTempF - 32) * 5) / 9);

  let fromValue = currentGrindSetting;
  let toValue = targetGrindSetting;
  let singleSummary = '';
  let lockedVariables = [];

  if (singleVariable === 'grind') {
    fromValue = currentGrindSetting || 'Medium-Fine';
    toValue = targetGrindSetting;
    singleSummary = `${singleActionLabel}: ${fromValue} → ${toValue}. Keep dose, water, and temp (${currentTempF}°F) locked.`;
    lockedVariables = [`Dose & Water: Locked`, `Temp: ${currentTempC}°C (${currentTempF}°F)`, `Ratio: 1:${currentRatio}`];
  } else if (singleVariable === 'temp') {
    fromValue = `${currentTempC}°C (${currentTempF}°F)`;
    toValue = `${tempC}°C (${targetTempF}°F)`;
    singleSummary = `${singleActionLabel}: ${fromValue} → ${toValue}. Keep grind (${currentGrindSetting}) and ratio locked.`;
    lockedVariables = [`Grind: ${currentGrindSetting}`, `Dose & Water: Locked`, `Ratio: 1:${currentRatio}`];
  } else if (singleVariable === 'ratio') {
    fromValue = `1:${currentRatio}`;
    toValue = `1:${targetRatio}`;
    singleSummary = `${singleActionLabel}: ${fromValue} → ${toValue}. Keep grind (${currentGrindSetting}) and temp locked.`;
    lockedVariables = [`Grind: ${currentGrindSetting}`, `Temp: ${currentTempC}°C (${currentTempF}°F)`, `Dose: Locked`];
  } else {
    singleSummary = `Golden Cup locked in! Keep ${currentGrindSetting}, ${currentTempF}°F, and 1:${currentRatio}.`;
    lockedVariables = ['All parameters locked'];
  }

  const singleVariableTweak = {
    variable: singleVariable,
    actionLabel: singleActionLabel,
    summary: singleSummary,
    fromValue,
    toValue,
    targetGrindSetting: singleVariable === 'grind' ? targetGrindSetting : currentGrindSetting,
    targetTempF,
    targetTempC: tempC,
    targetRatio,
    lockedVariables
  };

  return {
    headline,
    statusBadge,
    tasteProfile,
    detectedSignals,
    physicsExplanation,
    techniquePrescription,
    singleSummary,
    singleVariableTweak,
    recipePatch: {
      tempF: targetTempF,
      tempC,
      tempShiftF: targetTempF - currentTempF,
      recommendedRatio: targetRatio,
      ratio: targetRatio,
      ratioShift: Number((targetRatio - currentRatio).toFixed(1)),
      grindShift: grindShiftSteps,
      grindSetting: singleVariable === 'grind' ? targetGrindSetting : currentGrindSetting,
      grinderName,
      singleVariableTweak
    }
  };
}

