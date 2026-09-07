// Firebase Modular Client Initialization for The Brew App
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  enableIndexedDbPersistence
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCd8SH02GSmhtAu9rNOPRdnOdv-LK99LL8",
  authDomain: "thebrewapp-live.firebaseapp.com",
  projectId: "thebrewapp-live",
  storageBucket: "thebrewapp-live.firebasestorage.app",
  messagingSenderId: "99852741602",
  appId: "1:99852741602:web:6d18def26d37362ac9a7bb"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Enable offline IndexedDB persistence if in browser environment
if (typeof window !== 'undefined') {
  try {
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time.
        console.info('Firestore persistence disabled: multiple tabs open');
      } else if (err.code === 'unimplemented') {
        // Browser does not support IndexedDB persistence
        console.info('Firestore persistence is not supported by this browser');
      }
    });
  } catch (e) {
    // Graceful fallback for prerender / SSR
  }
}
