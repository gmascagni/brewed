/**
 * Closed-Loop Recipe Adjustment & Dial-In Engine
 * 
 * Analyzes post-brew drawdown time and sensory taste feedback (Sour vs Sweet vs Bitter),
 * diagnoses extraction physics (under-extracted, over-extracted, channeled mud clog),
 * and generates exact quantitative next-brew tweaks (grinder clicks, water temp, ratio).
 */

import { getGrinderProfile, getGrinderSetting, getSavedGrinderId } from '../data/grinderProfiles.js';

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

  // Flow classification
  let flowSpeed = 'optimal';
  if (actualDrawdownSec < minSec - 20) {
    flowSpeed = 'fast';
  } else if (actualDrawdownSec > maxSec + 25) {
    flowSpeed = 'slow';
  }

  const activeGrinder = getGrinderProfile(grinderId || getSavedGrinderId());
  const grinderName = activeGrinder?.name || 'Your Grinder';

  let diagnosisTitle = '';
  let diagnosisDetail = '';
  let grindRecommendation = 'Keep current grind';
  let grindShiftSteps = 0; // Negative = finer, Positive = coarser
  let targetTempF = currentTempF;
  let targetRatio = currentRatio;
  let summaryHeadline = '';
  let statusBadge = 'optimal';

  if (tasteProfile === 'sweet') {
    statusBadge = 'golden_cup';
    diagnosisTitle = 'Golden Cup Extraction Locked In!';
    diagnosisDetail = `Drawdown of ${durationFormatted} fell perfectly within the ${idealStr} window. Ratio, flow rate, and dissolved solubles are in optimal balance.`;
    summaryHeadline = `Drawdown was ${durationFormatted} and sweet & balanced. Golden Cup locked in! Saved to your Dial-In journal.`;
  } else if (flowSpeed === 'slow' && tasteProfile === 'bitter') {
    // 1. Slow + Bitter: Classic Over-Extraction
    statusBadge = 'over_extracted';
    grindShiftSteps = 2; // 2 clicks coarser
    targetTempF = Math.max(195, currentTempF - 3);
    diagnosisTitle = 'Over-Extracted (Bed Stalled / High Tannins)';
    diagnosisDetail = `Water was in contact with grounds for ${durationFormatted} (target: ${idealStr}). Slow water drainage dissolved harsh astringent tannins and bitter compounds.`;
    grindRecommendation = `Grind 2 clicks coarser on ${grinderName}`;
    summaryHeadline = `Drawdown was ${durationFormatted} and bitter. Try grinding 2 clicks coarser or dropping water to ${targetTempF}°F.`;
  } else if (flowSpeed === 'slow' && tasteProfile === 'sour') {
    // 2. Slow + Sour: Channeled Mud Clog! (Classic Barista Trap)
    statusBadge = 'channeled_clog';
    grindShiftSteps = 2; // Coarser to stop fines clogging
    targetTempF = Math.min(210, currentTempF + 1);
    diagnosisTitle = 'Channeled Mud Clog (Fines Migration)';
    diagnosisDetail = `Counter-intuitive extraction trap: Grounds were ground too fine, creating a dense mud bed that clogged filter pores. Water was forced into narrow side channels, leaving the center bed dry and under-extracted!`;
    grindRecommendation = `Grind 2 clicks COARSER on ${grinderName} to open flow channels`;
    summaryHeadline = `Drawdown was ${durationFormatted} and sour (channeled mud). Don't grind finer—grind 2 clicks coarser to restore flow!`;
  } else if (flowSpeed === 'fast' && tasteProfile === 'sour') {
    // 3. Fast + Sour: Classic Under-Extraction
    statusBadge = 'under_extracted';
    grindShiftSteps = -2; // 2 clicks finer
    targetTempF = Math.min(210, currentTempF + 3);
    diagnosisTitle = 'Under-Extracted (Fast Drainage / Hollow Acidity)';
    diagnosisDetail = `Water drained in only ${durationFormatted} (target: ${idealStr}). Water rushed through before sweet core solubles and sugars could dissolve.`;
    grindRecommendation = `Grind 2 clicks finer on ${grinderName}`;
    summaryHeadline = `Drawdown was ${durationFormatted} and sour/weak. Try grinding 2 clicks finer and raising water to ${targetTempF}°F.`;
  } else if (flowSpeed === 'fast' && tasteProfile === 'bitter') {
    // 4. Fast + Bitter: Rapid Channeling Hole
    statusBadge = 'channeling';
    grindShiftSteps = -1;
    targetTempF = Math.max(198, currentTempF - 2);
    diagnosisTitle = 'High-Speed Channeling';
    diagnosisDetail = `Water drained quickly (${durationFormatted}) yet tastes bitter. A hard stream of water carved a hole through the coffee bed, burning that narrow path.`;
    grindRecommendation = `Grind 1 click finer & pour closer to bed with low kettle spout`;
    summaryHeadline = `Drawdown was ${durationFormatted} and bitter (channeling). Lower kettle spout height and grind 1 click finer.`;
  } else if (flowSpeed === 'optimal' && tasteProfile === 'bitter') {
    // 5. Optimal Flow + Bitter: Water Too Hot or Over-Agitated
    statusBadge = 'too_hot';
    targetTempF = Math.max(195, currentTempF - 3);
    targetRatio = Math.max(15, Number((currentRatio - 0.5).toFixed(1)));
    diagnosisTitle = 'Thermal Over-Extraction';
    diagnosisDetail = `Flow time of ${durationFormatted} was ideal (${idealStr}), but water temperature was too aggressive for this roast level.`;
    grindRecommendation = `Maintain current grind, reduce water temperature`;
    summaryHeadline = `Drawdown was ${durationFormatted} (target flow) but bitter. Keep your grind setting and drop water to ${targetTempF}°F.`;
  } else if (flowSpeed === 'optimal' && tasteProfile === 'sour') {
    // 6. Optimal Flow + Sour: Water Under-Temperature
    statusBadge = 'too_cool';
    targetTempF = Math.min(210, currentTempF + 3);
    diagnosisTitle = 'Thermal Under-Extraction';
    diagnosisDetail = `Flow time of ${durationFormatted} was ideal, but water lacked the thermal energy required to dissolve complex sweet sugars from dense beans.`;
    grindRecommendation = `Maintain current grind, increase water temperature`;
    summaryHeadline = `Drawdown was ${durationFormatted} (target flow) but sour. Keep your grind setting and increase water to ${targetTempF}°F.`;
  } else {
    // Fallback
    diagnosisTitle = 'Standard Extraction Feedback';
    diagnosisDetail = `Recorded ${durationFormatted} drawdown time for this brew.`;
    summaryHeadline = `Drawdown recorded at ${durationFormatted}.`;
  }

  // Compute exact shifted grind setting on user's active grinder
  const grindCategories = ['extra_fine', 'fine', 'medium_fine', 'medium', 'medium_coarse', 'coarse'];
  let targetCategoryIdx = 2; // default medium_fine
  if (grindShiftSteps > 0) {
    targetCategoryIdx = Math.min(grindCategories.length - 1, targetCategoryIdx + 1);
  } else if (grindShiftSteps < 0) {
    targetCategoryIdx = Math.max(0, targetCategoryIdx - 1);
  }
  const targetCategory = grindCategories[targetCategoryIdx];
  const targetGrindObj = getGrinderSetting(grinderId || getSavedGrinderId(), targetCategory);

  const ratioShift = Number((targetRatio - currentRatio).toFixed(1));
  const tempShiftF = targetTempF - currentTempF;

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
    recommendationText: summaryHeadline,
    summaryHeadline,
    grindRecommendation,
    grindShiftSteps,
    currentTempF,
    targetTempF,
    currentRatio,
    targetRatio,
    grinderName,
    recipePatch: {
      tempF: targetTempF,
      tempC: Math.round(((targetTempF - 32) * 5) / 9),
      tempShiftF,
      recommendedRatio: targetRatio,
      ratio: targetRatio,
      ratioShift,
      grindShift: grindShiftSteps,
      grindSetting: targetGrindObj.setting,
      grinderName: targetGrindObj.grinderName
    }
  };
}
