/**
 * The Brew App — IndexedDB High-Capacity Binary Storage
 * Safely persists larger binary assets (high-res brew photos, OCR camera crops) 
 * outside of the tight 5MB browser localStorage quota.
 */

const DB_NAME = 'the_brew_app_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'brew_photos';

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Stores a photo (Data URL or Blob) indexed by brew ID.
 * @param {string} id - Unique log entry ID
 * @param {string|Blob} dataUrlOrBlob - Photo data
 */
export async function savePhotoToIndexedDb(id, dataUrlOrBlob) {
  if (!id || !dataUrlOrBlob) return null;
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ id, data: dataUrlOrBlob, updatedAt: Date.now() });

      req.onsuccess = () => resolve(id);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB write warning:', err);
    return null;
  }
}

/**
 * Retrieves a photo from IndexedDB by brew ID.
 * @param {string} id 
 * @returns {Promise<string|null>}
 */
export async function getPhotoFromIndexedDb(id) {
  if (!id) return null;
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);

      req.onsuccess = () => {
        resolve(req.result ? req.result.data : null);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB read warning:', err);
    return null;
  }
}

/**
 * Deletes a photo from IndexedDB by brew ID.
 * @param {string} id 
 */
export async function deletePhotoFromIndexedDb(id) {
  if (!id) return;
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB delete warning:', err);
  }
}
