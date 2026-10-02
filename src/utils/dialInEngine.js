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
