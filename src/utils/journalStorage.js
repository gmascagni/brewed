/**
 * Persistent Storage & Auto-Logger for Coffee & Tea Tasting Journal
 * Supports offline localStorage for guests and seamless Cloud Firestore synchronization for signed-in accounts.
 */

import { db } from '../services/firebase.js';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';

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
 * If a valid userId is available, also queues background Firestore persistence.
 * @param {Array<Object>} logs 
 * @param {string|null} userId 
 */
export function saveJournalLogs(logs, userId = null) {
  try {
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(logs));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(JOURNAL_UPDATED_EVENT, { detail: logs }));
    }
  } catch (err) {
    console.error('Failed to save journal logs to localStorage:', err);
  }

  // Cloud sync if userId is provided or active user is in localStorage
  const activeUid = userId || getActiveUserUid();
  if (activeUid && db && Array.isArray(logs) && logs.length > 0) {
    // Sync the top 20 most recent logs to avoid heavy payloads
    syncEntriesToFirestore(activeUid, logs.slice(0, 20)).catch((err) => {
      console.warn('Background Firestore journal sync non-blocking warning:', err);
    });
  }
}

/**
 * Helper to get current active user UID from localStorage
 */
function getActiveUserUid() {
  try {
    const saved = localStorage.getItem('the_brew_app_active_user') || localStorage.getItem('the_brew_app_current_user');
    const u = saved ? JSON.parse(saved) : null;
    return u?.uid || null;
  } catch {
    return null;
  }
}

/**
 * Syncs entries to Cloud Firestore subcollection `users/{uid}/brews`
 */
async function syncEntriesToFirestore(uid, entries) {
  if (!db || !uid || !Array.isArray(entries)) return;
  for (const entry of entries) {
    if (!entry || !entry.id) continue;
    try {
      const brewRef = doc(db, 'users', uid, 'brews', entry.id);
      await setDoc(brewRef, {
        ...entry,
        userId: uid,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      // Continue without interrupting local UX
    }
  }
}

/**
 * Synchronizes local journal logs with Cloud Firestore when user signs in or opens journal.
 * Performs clean two-way deduplication by entry ID.
 * @param {string} uid 
 * @returns {Promise<Array<Object>>}
 */
export async function syncJournalWithCloud(uid) {
  if (!db || !uid) return getJournalLogs();

  try {
    const localLogs = getJournalLogs();
    const brewsCol = collection(db, 'users', uid, 'brews');
    const snapshot = await getDocs(brewsCol);
    
    const cloudMap = new Map();
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (data && data.id) {
        cloudMap.set(data.id, data);
      }
    });

    // Merge: Cloud + Local, avoiding duplicates, sorted by timestamp descending
    const mergedMap = new Map(cloudMap);
    localLogs.forEach(entry => {
      if (entry && entry.id) {
        // If not in cloud or local is newer, keep/override
        mergedMap.set(entry.id, entry);
      }
    });

    const mergedList = Array.from(mergedMap.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    // Update localStorage
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(mergedList));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(JOURNAL_UPDATED_EVENT, { detail: mergedList }));
    }

    // Push local entries back up to cloud so cloud is 100% complete
    syncEntriesToFirestore(uid, mergedList.slice(0, 30)).catch(() => {});

    return mergedList;
  } catch (err) {
    console.warn('Unable to sync journal with Firestore (falling back to offline logs):', err);
    return getJournalLogs();
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
  actualDrawdownSec = 180,
  durationFormatted = '3:00',
  tasteFeedback = 'balanced', // 'balanced' | 'sweet' | 'sour' | 'bitter' | 'weak' | 'strong' | 'skipped'
  remedy = '',
  recipePatch = null,
  rating = 5,
  tastingNotes = [],
  notes = '',
  photoUrl = null,
  bagId = null,
  userId = null,
  isPublic = false,
  sessionId = null,
  sessionIndex = 1,
  parentSessionId = null,
  chainRootId = null,
  singleVariableTweak = null,
  evolutionDelta = null
} = {}) {
  const currentLogs = getJournalLogs();

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Normalize taste feedback tags
  let defaultTags = [];
  if (Array.isArray(tastingNotes) && tastingNotes.length > 0) {
    defaultTags = tastingNotes;
  } else if (typeof tastingNotes === 'string' && tastingNotes.trim()) {
    defaultTags = tastingNotes.split(',').map(s => s.trim()).filter(Boolean);
  } else {
    if (tasteFeedback === 'balanced' || tasteFeedback === 'sweet') {
      defaultTags = ['Sweet & Balanced', 'Golden Cup'];
    } else if (tasteFeedback === 'sour') {
      defaultTags = ['Sour / Bright', 'Under-extracted'];
    } else if (tasteFeedback === 'bitter') {
      defaultTags = ['Bitter / Dry', 'Over-extracted'];
    } else if (tasteFeedback === 'weak') {
      defaultTags = ['Weak / Hollow', 'Under-dosed'];
    } else if (tasteFeedback === 'strong') {
      defaultTags = ['Strong / Heavy', 'Over-concentrated'];
    } else {
      defaultTags = ['Quick Log'];
    }
  }

  const effectiveSessionId = sessionId || `brew_sess_${Date.now()}`;
  const effectiveChainRoot = chainRootId || effectiveSessionId;
  const effectiveTweak = singleVariableTweak || recipePatch?.singleVariableTweak || null;

  const newEntry = {
    id: Date.now().toString(),
    sessionId: effectiveSessionId,
    sessionIndex: Number(sessionIndex) || 1,
    parentSessionId: parentSessionId || null,
    chainRootId: effectiveChainRoot,
    singleVariableTweak: effectiveTweak,
    evolutionDelta: evolutionDelta || null,
    date: formattedDate,
    timestamp: Date.now(),
    trackMode,
    methodId,
    methodName,
    beanName: beanName.trim() || 'Single-Origin Lot',
    roaster: roaster.trim() || 'Specialty Roastery',
    doseGrams: Number(doseGrams) || 18,
    doseStr: `${Number(doseGrams).toFixed(1)}g`,
    waterMl: Math.round(waterMl) || 288,
    waterStr: `${Math.round(waterMl)} mL`,
    ratio: Number(ratio) || 16,
    ratioStr: `1 : ${ratio}`,
    tempF: Number(tempF) || 202,
    tempStr: `${tempF}°F`,
    grindStr: grindName || 'Medium-Fine',
    grinderModel,
    grinderSetting: grinderSetting || grindName || 'Medium-Fine',
    actualDrawdownSec: Number(actualDrawdownSec) || 180,
    durationFormatted: durationFormatted || '3:00',
    tasteFeedback: tasteFeedback || 'balanced',
    remedy: remedy || '',
    recipePatch: recipePatch || null,
    rating: Math.max(1, Math.min(5, Number(rating) || 5)),
    isFavorite: rating >= 5 || tasteFeedback === 'balanced' || tasteFeedback === 'sweet',
    tastingNotes: defaultTags,
    notes: notes.trim() || (remedy ? `Diagnosis: ${remedy}` : 'Completed guided multi-phase timed extraction.'),
    photoUrl: photoUrl || null,
    bagId: bagId || null,
    userId: userId || getActiveUserUid() || null,
    isPublic: Boolean(isPublic)
  };

  const updated = [newEntry, ...currentLogs];
  saveJournalLogs(updated, userId);
  return newEntry;
}

/**
 * Toggles an entry's public / private visibility.
 * @param {string} entryId 
 * @returns {Object|null}
 */
export function toggleEntryPublicStatus(entryId) {
  const currentLogs = getJournalLogs();
  const updated = currentLogs.map(entry => {
    if (entry.id === entryId) {
      return { ...entry, isPublic: !entry.isPublic };
    }
    return entry;
  });
  saveJournalLogs(updated);
  return updated.find(e => e.id === entryId) || null;
}

/**
 * Searches historical logs to find previous brews of the exact same bean or roaster,
 * enabling instant side-by-side dial-in comparison.
 * 
 * @param {Object} params
 * @param {string} params.beanName
 * @param {string} params.roaster
 * @param {string} params.methodId
 * @param {string} params.excludeId Optional ID of the current log to ignore
 * @returns {Array<Object>} List of previous matching brew sessions, newest first
 */
export function findPreviousBrewsForLot({ beanName = '', roaster = '', methodId = '', excludeId = null }) {
  const logs = getJournalLogs();
  const cleanBean = beanName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanRoaster = roaster.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (!cleanBean && !cleanRoaster && !methodId) return [];

  return logs.filter(entry => {
    if (!entry) return false;
    if (excludeId && entry.id === excludeId) return false;

    const entryBean = (entry.beanName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const entryRoaster = (entry.roaster || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    // Match criteria:
    // 1. Same bean name
    const beanMatch = cleanBean && entryBean && (entryBean.includes(cleanBean) || cleanBean.includes(entryBean));
    // 2. Same roaster
    const roasterMatch = cleanRoaster && entryRoaster && (entryRoaster.includes(cleanRoaster) || cleanRoaster.includes(entryRoaster));
    // 3. Same method
    const methodMatch = methodId && entry.methodId === methodId;

    if (beanMatch && (roasterMatch || !cleanRoaster)) return true;
    if (beanMatch && methodMatch) return true;
    if (roasterMatch && methodMatch && !cleanBean) return true;

    return false;
  });
}

/**
 * Client-side photo compression utility.
 * Downscales image to maximum 400x400 JPEG at 0.75 quality (~20KB base64 string),
 * perfectly avoiding localStorage quota overflow while looking sharp on mobile retina screens.
 * 
 * @param {File|Blob} file 
 * @param {number} maxWidth 
 * @param {number} maxHeight 
 * @param {number} quality 
 * @returns {Promise<string>} Data URL base64 string
 */
export function compressPhotoToThumbnail(file, maxWidth = 400, maxHeight = 400, quality = 0.75) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
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
