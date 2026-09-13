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
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

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
export const auth = typeof window !== 'undefined' ? getAuth(app) : null;

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

/**
 * Register a new verified roaster using email and password
 */
const LOCAL_ROASTER_KEY = 'the_brew_app_roaster_accounts';

function getLocalRoasterAccounts() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(LOCAL_ROASTER_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveLocalRoasterAccount(email, account) {
  if (typeof window === 'undefined') return;
  try {
    const list = getLocalRoasterAccounts();
    list[email.toLowerCase()] = account;
    localStorage.setItem(LOCAL_ROASTER_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Unable to persist local roaster account:', e);
  }
}

/**
 * Register a new specialty roaster account with email and password
 */
export async function registerRoasterAccount({ email, password, roasterName, displayName }) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanRoasterName = String(roasterName || '').trim();
  const cleanDisplayName = String(displayName || cleanRoasterName || cleanEmail.split('@')[0]).trim();
  const slug = cleanRoasterName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  let firebaseUid = `roaster_${Date.now()}`;

  if (auth && password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      if (userCredential?.user) {
        firebaseUid = userCredential.user.uid;
        await updateProfile(userCredential.user, {
          displayName: cleanDisplayName
        }).catch(() => {});
      }
    } catch (authErr) {
      // If user already exists in Firebase Auth, attempt sign-in
      if (authErr.code === 'auth/email-already-in-use') {
        try {
          const signinCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
          if (signinCred?.user) {
            firebaseUid = signinCred.user.uid;
          }
        } catch (signInErr) {
          console.warn('Firebase roaster sign-in fallback:', signInErr);
        }
      } else if (
        authErr.code === 'auth/configuration-not-found' ||
        authErr.code === 'auth/operation-not-allowed' ||
        authErr.code === 'auth/network-request-failed' ||
        authErr.code === 'auth/invalid-api-key' ||
        authErr.code === 'auth/project-not-found'
      ) {
        // Fallback to local verified roaster device storage if cloud auth is unconfigured or offline
        console.warn('Firebase Auth offline/unconfigured; falling back to local roaster account:', authErr.code);
      } else {
        throw authErr;
      }
    }
  }

  const userProfile = {
    uid: firebaseUid,
    email: cleanEmail,
    username: `@${cleanEmail.split('@')[0]}`,
    displayName: cleanDisplayName,
    role: 'roaster',
    roasterName: cleanRoasterName,
    roasterSlug: slug,
    isVerifiedRoaster: true,
    avatar: '/avatar_roast_master_emblem.jpg',
    createdAt: new Date().toISOString()
  };

  // Persist to local verified roaster storage
  saveLocalRoasterAccount(cleanEmail, {
    uid: firebaseUid,
    email: cleanEmail,
    roasterName: cleanRoasterName,
    roasterSlug: slug,
    displayName: cleanDisplayName,
    passwordHash: typeof btoa !== 'undefined' ? btoa(password) : password,
    updatedAt: new Date().toISOString()
  });

  // Sync to Cloud Firestore roasters collection
  if (db) {
    try {
      await setDoc(doc(db, 'roaster_accounts', cleanEmail), {
        uid: firebaseUid,
        email: cleanEmail,
        roasterName: cleanRoasterName,
        roasterSlug: slug,
        displayName: cleanDisplayName,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore roaster account sync:', e);
    }
  }

  return userProfile;
}

/**
 * Sign in an existing roaster with email and password
 */
export async function signInRoasterAccount({ email, password }) {
  const cleanEmail = String(email || '').trim().toLowerCase();

  let firebaseUid = null;
  let displayName = null;

  if (auth && password) {
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
      if (cred?.user) {
        firebaseUid = cred.user.uid;
        displayName = cred.user.displayName;
      }
    } catch (authErr) {
      if (
        authErr.code === 'auth/configuration-not-found' ||
        authErr.code === 'auth/operation-not-allowed' ||
        authErr.code === 'auth/network-request-failed' ||
        authErr.code === 'auth/invalid-api-key' ||
        authErr.code === 'auth/project-not-found'
      ) {
        console.warn('Firebase Auth offline/unconfigured; verifying against local roaster store:', authErr.code);
      } else {
        throw authErr;
      }
    }
  }

  // Verify against local roaster storage if available
  const localAccounts = getLocalRoasterAccounts();
  const localAcc = localAccounts[cleanEmail];
  if (localAcc && localAcc.passwordHash && typeof btoa !== 'undefined') {
    if (localAcc.passwordHash !== btoa(password)) {
      const wrongPassErr = new Error('Invalid roaster password.');
      wrongPassErr.code = 'auth/wrong-password';
      throw wrongPassErr;
    }
  }

  // Fetch roaster details from Firestore if available
  let roasterData = null;
  if (db) {
    try {
      const snap = await getDoc(doc(db, 'roaster_accounts', cleanEmail));
      if (snap.exists()) {
        roasterData = snap.data();
      }
    } catch (e) {
      console.warn('Firestore roaster account fetch:', e);
    }
  }

  const roasterName = roasterData?.roasterName || localAcc?.roasterName || displayName || cleanEmail.split('@')[0];
  const slug = roasterData?.roasterSlug || localAcc?.roasterSlug || roasterName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  return {
    uid: firebaseUid || roasterData?.uid || localAcc?.uid || `roaster_${Date.now()}`,
    email: cleanEmail,
    username: `@${cleanEmail.split('@')[0]}`,
    displayName: displayName || localAcc?.displayName || roasterName,
    role: 'roaster',
    roasterName,
    roasterSlug: slug,
    isVerifiedRoaster: true,
    avatar: '/avatar_roast_master_emblem.jpg'
  };
}

/**
 * Sign out current authenticated roaster
 */
export async function signOutRoasterAccount() {
  if (auth) {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Error during signOut:', err);
    }
  }
}
