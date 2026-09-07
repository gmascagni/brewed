// Seed initial verified roasters and coffees to Cloud Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { SHOWCASE_ROASTERS } from '../src/data/roasterShowcaseData.js';

const firebaseConfig = {
  apiKey: "AIzaSyCd8SH02GSmhtAu9rNOPRdnOdv-LK99LL8",
  authDomain: "thebrewapp-live.firebaseapp.com",
  projectId: "thebrewapp-live",
  storageBucket: "thebrewapp-live.firebasestorage.app",
  messagingSenderId: "99852741602",
  appId: "1:99852741602:web:6d18def26d37362ac9a7bb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log('🚀 Starting Cloud Firestore seed for thebrewapp-live...');
  let roasterCount = 0;
  let coffeeCount = 0;

  for (const roaster of SHOWCASE_ROASTERS) {
    const roasterSlug = roaster.slug || roaster.id;
    const roasterDoc = {
      id: roaster.id,
      slug: roasterSlug,
      name: roaster.name,
      tagline: roaster.tagline || '',
      founded: roaster.founded || '',
      city: roaster.city || '',
      state: roaster.state || '',
      country: roaster.country || 'USA',
      founders: roaster.founders || [],
      website: roaster.website || '',
      shopUrl: roaster.shopUrl || '',
      recommendedWater: roaster.recommendedWater || null,
      updatedAt: new Date().toISOString()
    };

    console.log(`Uploading roaster: ${roaster.name} (${roasterSlug})`);
    await setDoc(doc(db, 'roasters', roasterSlug), roasterDoc, { merge: true });
    roasterCount++;

    if (Array.isArray(roaster.coffees)) {
      for (const coffee of roaster.coffees) {
        const coffeeId = coffee.id || `coffee_${Date.now()}`;
        const coffeeDoc = {
          ...coffee,
          id: coffeeId,
          roaster: roaster.name,
          roasterSlug: roasterSlug,
          updatedAt: new Date().toISOString()
        };

        console.log(`  -> Uploading coffee: ${coffee.beanName} (UPC: ${coffee.upc || 'N/A'})`);
        // Save by primary coffee ID
        await setDoc(doc(db, 'coffees', coffeeId), coffeeDoc, { merge: true });
        // If UPC exists, also save or alias so lookup by UPC is a direct O(1) document get
        if (coffee.upc) {
          await setDoc(doc(db, 'coffees', `upc_${coffee.upc}`), coffeeDoc, { merge: true });
        }
        coffeeCount++;
      }
    }
  }

  console.log(`\n🎉 Seed Complete! Uploaded ${roasterCount} roasters and ${coffeeCount} coffees to Cloud Firestore.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
