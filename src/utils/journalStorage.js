/**
 * Persistent Storage & Auto-Logger for Coffee & Tea Tasting Journal
 */

export const JOURNAL_STORAGE_KEY = 'the_brew_app_journal_v1';
export const JOURNAL_UPDATED_EVENT = 'the_brew_app_journal_updated';

/**
 * Loads all saved journal entries from localStorage.
 * @returns {Array<Object>}
 */
export function getJournalLogs() {
  try {
    const raw = localStorage.getItem(JOURNAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to load journal logs:', err);
    return [];
  }
}

/**
 * Saves journal logs to localStorage and emits an update event.
 * @param {Array<Object>} logs 
 */
export function saveJournalLogs(logs) {
  try {
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(logs));
    window.dispatchEvent(new CustomEvent(JOURNAL_UPDATED_EVENT, { detail: logs }));
  } catch (err) {
    console.error('Failed to save journal logs:', err);
  }
}

/**
 * Directly records a completed brew session into the journal with dial-in parameters and taste feedback.
 * @param {Object} session
 * @returns {Object} the newly created entry
 */
export function logBrewSession({
  trackMode = 'coffee',
  methodId = 'pour_over',
  methodName = 'Hario V60 Dripper',
  beanName = 'Single-Origin Coffee',
  roaster = 'Artisan Roaster',
  doseGrams = 18,
  waterMl = 288,
  ratio = 16,
  tempF = 202,
  grindName = 'Medium-Fine',
  grinderModel = 'Generic Stepped (1–10)',
  grinderSetting = '4.0',
  tasteFeedback = 'sweet', // 'sweet' | 'sour' | 'bitter' | 'skipped'
  remedy = '',
  rating = 5,
  elapsedSec = 180
} = {}) {
  const currentLogs = getJournalLogs();

  const newEntry = {
    id: Date.now().toString(),
    date: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    timestamp: Date.now(),
    trackMode,
    methodId,
    methodName,
    beanName: beanName.trim() || 'Single-Origin Lot',
    roaster: roaster.trim() || 'Specialty Roastery',
    doseStr: `${Number(doseGrams).toFixed(1)}g`,
    waterStr: `${Math.round(waterMl)} mL`,
    ratioStr: `1 : ${ratio}`,
    tempStr: `${tempF}°F`,
    grindStr: grindName,
    grinderModel,
    grinderSetting,
    tasteFeedback,
    remedy,
    rating: tasteFeedback === 'sweet' ? 5 : tasteFeedback === 'skipped' ? 4 : 3,
    isFavorite: tasteFeedback === 'sweet',
    tastingNotes: tasteFeedback === 'sweet'
      ? ['Sweet & Balanced', 'Golden Cup']
      : tasteFeedback === 'sour'
      ? ['Sour / Under-extracted', 'Bright Acidity']
      : tasteFeedback === 'bitter'
      ? ['Bitter / Over-extracted', 'Heavy Body']
      : ['Quick Log'],
    notes: remedy ? `Diagnosis: ${remedy}` : 'Completed guided multi-phase timed extraction.'
  };

  const updated = [newEntry, ...currentLogs];
  saveJournalLogs(updated);
  return newEntry;
}

/**
 * Returns the most recent N brew sessions.
 * @param {number} limit 
 * @returns {Array<Object>}
 */
export function getRecentBrews(limit = 3) {
  const logs = getJournalLogs();
  return logs.slice(0, limit);
}
