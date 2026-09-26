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
  limit,
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
 * Register a new specialty roaster account with email and password via Firebase Auth
 */
export async function registerRoasterAccount({ email, password, roasterName, displayName }) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanRoasterName = String(roasterName || '').trim();
  const cleanDisplayName = String(displayName || cleanRoasterName || cleanEmail.split('@')[0]).trim();
  const slug = cleanRoasterName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    throw new Error('Please enter a valid email address.');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }
  if (!cleanRoasterName) {
    throw new Error('Please enter your Roastery / Brand Name.');
  }

  if (!auth) {
    throw new Error('Firebase Authentication is unavailable.');
  }

  let firebaseUid = null;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    if (userCredential?.user) {
      firebaseUid = userCredential.user.uid;
      await updateProfile(userCredential.user, {
        displayName: cleanDisplayName
      }).catch(() => {});
    }
  } catch (authErr) {
    if (authErr.code === 'auth/email-already-in-use') {
      try {
        const signinCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        if (signinCred?.user) {
          firebaseUid = signinCred.user.uid;
        }
      } catch {
        const existingAccErr = new Error('An account already exists for this email address. Please switch to "Sign In" and enter your password.');
        existingAccErr.code = 'auth/email-already-in-use';
        throw existingAccErr;
      }
    } else {
      throw authErr;
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
    avatar: '/avatar_roast_beans.jpg',
    createdAt: new Date().toISOString()
  };

  // Sync brand profile to Cloud Firestore roasters collection
  if (db) {
    try {
      await setDoc(doc(db, 'roasters', slug), {
        id: slug,
        slug,
        name: cleanRoasterName,
        displayName: cleanDisplayName,
        ownerEmail: cleanEmail,
        ownerUid: firebaseUid,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // Save email -> roaster mapping for fast cross-device lookups
      await setDoc(doc(db, 'roaster_accounts', cleanEmail), {
        uid: firebaseUid,
        email: cleanEmail,
        roasterName: cleanRoasterName,
        roasterSlug: slug,
        displayName: cleanDisplayName,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore roaster profile sync warning:', e);
    }
  }

  return userProfile;
}

/**
 * Sign in an existing roaster with email and password via Firebase Auth
 */
export async function signInRoasterAccount({ email, password }) {
  const cleanEmail = String(email || '').trim().toLowerCase();

  if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    throw new Error('Please enter a valid email address.');
  }
  if (!password) {
    throw new Error('Please enter your account password.');
  }

  if (!auth) {
    throw new Error('Firebase Authentication is unavailable.');
  }

  // Authenticate directly against Firebase Auth
  const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
  const firebaseUid = cred?.user?.uid;
  const displayName = cred?.user?.displayName;

  // Retrieve roastery profile from Firestore
  let roasterData = null;
  if (db) {
    try {
      const snap = await getDoc(doc(db, 'roaster_accounts', cleanEmail));
      if (snap.exists()) {
        roasterData = snap.data();
      } else {
        const querySnap = await getDocs(
          query(collection(db, 'roasters'), where('ownerEmail', '==', cleanEmail), limit(1))
        );
        if (!querySnap.empty) {
          roasterData = querySnap.docs[0].data();
        }
      }
    } catch (e) {
      console.warn('Firestore roaster profile fetch warning:', e);
    }
  }

  const roasterName = roasterData?.roasterName || roasterData?.name || displayName || cleanEmail.split('@')[0];
  const slug = roasterData?.roasterSlug || roasterData?.slug || roasterName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  return {
    uid: firebaseUid,
    email: cleanEmail,
    username: `@${cleanEmail.split('@')[0]}`,
    displayName: displayName || roasterName,
    role: 'roaster',
    roasterName,
    roasterSlug: slug,
    isVerifiedRoaster: true,
    avatar: roasterData?.logo || roasterData?.logoImage || '/avatar_roast_beans.jpg'
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

/**
 * Observer for Firebase Auth state changes
 */
export function onRoasterAuthStateChanged(callback) {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
}
