/**
 * Brew Session Manager
 * 
 * Unifies Coffee -> Recipe -> Brew -> Taste -> Recommendation -> Brew Again
 * into a single cohesive, persistent feedback loop.
 * 
 * Adheres strictly to the Barista Golden Rule:
 * "Change ONLY one variable at a time when dialing in."
 */

import { getSavedGrinderId, getGrinderProfile, getGrinderSetting } from '../data/grinderProfiles.js';

export const ACTIVE_SESSION_STORAGE_KEY = 'the_brew_app_active_session_v1';
export const SESSION_UPDATED_EVENT = 'the_brew_app_session_updated';
export const TRIGGER_ASSESSMENT_EVENT = 'the_brew_app_trigger_assessment';
export const OPEN_JOURNAL_EVENT = 'the_brew_app_open_journal';

/**
 * Retrieves the currently active brew session from localStorage, if any.
 * @returns {Object|null}
 */
export function getActiveBrewSession() {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Failed to get active brew session:', err);
    return null;
  }
}

/**
 * Persists the active brew session to localStorage and emits an update event.
 * @param {Object} session 
 */
export function saveActiveBrewSession(session) {
  try {
    if (!session) {
      localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
    } else {
      localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, JSON.stringify(session));
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(SESSION_UPDATED_EVENT, { detail: session }));
    }
  } catch (err) {
    console.error('Failed to save active brew session:', err);
  }
}

/**
 * Clears the active brew session (e.g. after complete reset or starting unrelated brew).
 */
export function clearActiveBrewSession() {
  saveActiveBrewSession(null);
}

/**
 * Intelligently shifts a grind setting string by N steps finer or coarser.
 * Handles "22 clicks", "#14", "4.5", or descriptive strings like "Medium-Fine".
 * 
 * @param {string} currentGrind 
 * @param {number} stepDelta Negative = finer, Positive = coarser
 * @param {string} grinderId Active grinder model ID
 * @returns {string} Shifted grind setting string
 */
export function shiftGrindSetting(currentGrind = 'Medium-Fine', stepDelta = -2, grinderId = 'generic_stepped') {
  if (!stepDelta) return currentGrind;
  const str = String(currentGrind || '').trim();

  // Pattern 1: Click based (e.g. "22 clicks", "22 Clicks", "22")
  const clickMatch = str.match(/^(\d+)(?:\s*(?:clicks?|clix))?$/i);
  if (clickMatch) {
    const currentClicks = parseInt(clickMatch[1], 10);
    const newClicks = Math.max(1, currentClicks + stepDelta);
    return `${newClicks} clicks`;
  }

  // Pattern 2: Hash based (e.g. "#14", "# 14")
  const hashMatch = str.match(/^#\s*(\d+)$/);
  if (hashMatch) {
    const currentStep = parseInt(hashMatch[1], 10);
    const newStep = Math.max(1, currentStep + stepDelta);
    return `#${newStep}`;
  }

  // Pattern 3: Decimal dial (e.g. "4.5", "4.0", "5.2")
  const decimalMatch = str.match(/^(\d+(?:\.\d+)?)$/);
  if (decimalMatch) {
    const currentVal = parseFloat(decimalMatch[1]);
    const shiftAmt = stepDelta * 0.5;
    const newVal = Math.max(1.0, Math.min(10.0, Number((currentVal + shiftAmt).toFixed(1))));
    return `${newVal}`;
  }

  // Pattern 4: Descriptive Category mapping
  const categories = ['extra_fine', 'fine', 'medium_fine', 'medium', 'medium_coarse', 'coarse'];
  const categoryLabels = {
    extra_fine: 'Extra Fine',
    fine: 'Fine',
    medium_fine: 'Medium-Fine',
    medium: 'Medium',
    medium_coarse: 'Medium-Coarse',
    coarse: 'Coarse'
  };

  const normalized = str.toLowerCase().replace(/[^a-z]/g, '_');
  let currentIdx = categories.findIndex(c => normalized.includes(c) || c.includes(normalized));
  if (currentIdx === -1) currentIdx = 2; // Default to medium_fine

  let targetIdx = currentIdx + (stepDelta < 0 ? -1 : 1);
  targetIdx = Math.max(0, Math.min(categories.length - 1, targetIdx));
  const targetCategory = categories[targetIdx];

  // Try to lookup grinder profile if available
  const profileSetting = getGrinderSetting(grinderId || getSavedGrinderId(), targetCategory);
  if (profileSetting && profileSetting.setting && profileSetting.setting !== 'N/A') {
    return profileSetting.setting;
  }

  return categoryLabels[targetCategory] || 'Medium-Fine';
}

/**
 * Initializes or resolves a persistent brew session before starting extraction.
 * 
 * @param {Object} params
 * @param {Object} params.coffee Coffee bean info (beanName, roaster, bagId)
 * @param {Object} params.equipment Equipment info (methodId, methodName, grinderId, grinderName, grinderSetting)
 * @param {Object} params.recipe Target recipe (doseGrams, waterMl, ratio, tempF, tempC, grindSetting)
 * @param {Object|null} params.parentEntry If this brew is an iteration from a previous brew
 * @param {Object|null} params.appliedRecommendation The recommendation being tested
 * @returns {Object} Active session object
 */
export function startOrGetActiveBrewSession({
  coffee = {},
  equipment = {},
  recipe = {},
  parentEntry = null,
  appliedRecommendation = null
} = {}) {
  const existing = getActiveBrewSession();

  // If existing session matches current bean and hasn't been completed, return it
  if (existing && !existing.isCompleted) {
    const isSameBean = (existing.coffee?.beanName || '').toLowerCase() === (coffee.beanName || '').toLowerCase();
    if (isSameBean) {
      return existing;
    }
  }

  const beanName = coffee.beanName || 'Single-Origin Coffee';
  const roaster = coffee.roaster || 'Specialty Roastery';
  const sessionIndex = parentEntry ? ((parentEntry.sessionIndex || 1) + 1) : 1;
  const parentSessionId = parentEntry ? (parentEntry.sessionId || parentEntry.id) : null;
  const chainRootId = parentEntry ? (parentEntry.chainRootId || parentEntry.sessionId || parentEntry.id) : null;

  const sessionId = `brew_sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newSession = {
    sessionId,
    sessionIndex,
    parentSessionId,
    chainRootId: chainRootId || sessionId,
    createdAt: Date.now(),
    coffee: {
      beanName,
      roaster,
      bagId: coffee.bagId || null
    },
    equipment: {
      methodId: equipment.methodId || 'pour_over',
      methodName: equipment.methodName || 'Pour Over',
      grinderId: equipment.grinderId || getSavedGrinderId(),
      grinderName: equipment.grinderName || getGrinderProfile(equipment.grinderId || getSavedGrinderId())?.name || 'Grinder',
      grinderSetting: equipment.grinderSetting || recipe.grindSetting || 'Medium-Fine'
    },
    recipe: {
      doseGrams: Number(recipe.doseGrams) || 18,
      waterMl: Math.round(recipe.waterMl) || 288,
      ratio: Number(recipe.ratio) || 16,
      tempF: Number(recipe.tempF) || 202,
      tempC: Number(recipe.tempC) || Math.round(((Number(recipe.tempF || 202) - 32) * 5) / 9),
      grindSetting: recipe.grindSetting || 'Medium-Fine'
    },
    appliedRecommendation: appliedRecommendation || null,
    isCompleted: false
  };

  saveActiveBrewSession(newSession);
  return newSession;
}

/**
 * Creates the next iteration session (Brew #2, Brew #3, etc.) with the single-variable recommendation applied.
 * All other variables are strictly locked in place.
 *
 * @param {Object} completedEntry - A **journal log entry** (as returned by `logBrewSession`).
 *   Numeric fields may be stored as formatted strings (e.g. doseStr='18.0g', ratioStr='1 : 16',
 *   tempStr='202°F', waterStr='288 mL', grindStr='22 clicks'). This function handles both
 *   numeric (.doseGrams, .ratio, .tempF, .waterMl) and their string fallbacks.
 * @param {Object|null} singleVariableTweak - The single variable recommendation from dialInEngine.
 * @returns {Object} Newly primed active session for the next brew.
 */
export function createNextIterationSession(completedEntry, singleVariableTweak) {
  if (!completedEntry) return null;

  const nextIndex = (completedEntry.sessionIndex || 1) + 1;
  const chainRootId = completedEntry.chainRootId || completedEntry.sessionId || completedEntry.id;
  const parentSessionId = completedEntry.sessionId || completedEntry.id;

  // Read numeric fields, falling back to their formatted string counterparts
  const currentDose = Number(completedEntry.doseGrams)
    || parseFloat(completedEntry.doseStr)
    || 18;
  let nextRatio = Number(completedEntry.ratio)
    || parseFloat(String(completedEntry.ratioStr || '').replace('1 :', '').trim())
    || 16;
  // Always use .tempF directly — parseInt('94°C') returns 94 which is wrong for metric users
  let nextTempF = Number(completedEntry.tempF) || 202;
  let nextGrind = completedEntry.grinderSetting
    || completedEntry.grindStr
    || 'Medium-Fine';
  let nextWater = Math.round(completedEntry.waterMl)
    || parseFloat(String(completedEntry.waterStr || '').replace(/[^0-9.]/g, ''))
    || Math.round(currentDose * nextRatio);

  // Apply ONLY the single recommended variable; lock all others
  if (singleVariableTweak) {
    if (singleVariableTweak.variable === 'grind' && singleVariableTweak.targetGrindSetting) {
      nextGrind = singleVariableTweak.targetGrindSetting;
    } else if (singleVariableTweak.variable === 'temp' && singleVariableTweak.targetTempF) {
      nextTempF = singleVariableTweak.targetTempF;
    } else if (singleVariableTweak.variable === 'ratio' && singleVariableTweak.targetRatio) {
      nextRatio = singleVariableTweak.targetRatio;
      nextWater = Math.round(currentDose * nextRatio);
    }
    // variable === 'none' → Golden Cup: all variables remain locked as-is
  }

  const nextSessionId = `brew_sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const nextSession = {
    sessionId: nextSessionId,
    sessionIndex: nextIndex,
    parentSessionId,
    chainRootId: chainRootId || nextSessionId,
    createdAt: Date.now(),
    coffee: {
      beanName: completedEntry.beanName,
      roaster: completedEntry.roaster,
      bagId: completedEntry.bagId || null
    },
    equipment: {
      methodId: completedEntry.methodId,
      methodName: completedEntry.methodName,
      // Persist grinderId so next iteration uses the correct grinder profile calculations
      grinderId: completedEntry.grinderId || getSavedGrinderId(),
      grinderName: completedEntry.grinderModel || completedEntry.grinderName || 'Grinder',
      grinderSetting: nextGrind
    },
    recipe: {
      doseGrams: currentDose,
      waterMl: nextWater,
      ratio: nextRatio,
      tempF: nextTempF,
      tempC: Math.round(((nextTempF - 32) * 5) / 9),
      grindSetting: nextGrind
    },
    appliedRecommendation: singleVariableTweak || null,
    isCompleted: false
  };

  saveActiveBrewSession(nextSession);
  return nextSession;
}

/**
 * Calculates whether the current brew improved upon its parent session.
 * 
 * @param {Object} currentEntry Current completed brew session
 * @param {Object} parentEntry Previous brew session
 * @returns {Object} Evolution comparison delta
 */
export function calculateSessionEvolution(currentEntry, parentEntry) {
  if (!parentEntry || !currentEntry) return null;

  const currentRating = Number(currentEntry.rating) || 3;
  const parentRating = Number(parentEntry.rating) || 3;
  const ratingDelta = Number((currentRating - parentRating).toFixed(1));

  const isImprovement = ratingDelta > 0 || 
    (ratingDelta === 0 && (currentEntry.tasteFeedback === 'balanced' || currentEntry.tasteFeedback === 'sweet') && parentEntry.tasteFeedback !== 'balanced');

  const variableChanged = currentEntry.appliedRecommendation?.variable || 'parameter';
  let variableLabel = 'Recipe';
  if (variableChanged === 'grind') variableLabel = 'Grind adjustment';
  else if (variableChanged === 'temp') variableLabel = 'Temperature tweak';
  else if (variableChanged === 'ratio') variableLabel = 'Ratio adjustment';

  let summary = '';
  if (isImprovement) {
    summary = `${variableLabel} improved the brew (${parentRating}/5★ → ${currentRating}/5★).`;
    if (currentEntry.tasteFeedback === 'balanced' || currentEntry.tasteFeedback === 'sweet') {
      summary += ' Sweetness and acidity are now in balance!';
    }
  } else if (ratingDelta < 0) {
    summary = `${variableLabel} moved away from ideal cup (${parentRating}/5★ → ${currentRating}/5★). Adjust back toward parent setting.`;
  } else {
    summary = `${variableLabel} held rating steady at ${currentRating}/5★.`;
  }

  return {
    isImprovement,
    ratingDelta,
    summary,
    parentRating,
    currentRating,
    parentTaste: parentEntry.tasteFeedback || 'Logged',
    currentTaste: currentEntry.tasteFeedback || 'Logged',
    parentTime: parentEntry.durationFormatted || '3:00',
    currentTime: currentEntry.durationFormatted || '3:00',
    parentGrind: parentEntry.grinderSetting || parentEntry.grindStr || 'Medium-Fine',
    currentGrind: currentEntry.grinderSetting || currentEntry.grindStr || 'Medium-Fine',
    parentRatio: parentEntry.ratio || 16,
    currentRatio: currentEntry.ratio || 16,
    parentTempF: parentEntry.tempF || 202,
    currentTempF: currentEntry.tempF || 202,
    variableChanged
  };
}
