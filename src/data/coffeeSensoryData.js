/**
 * Authentic Specialty Coffee Sensory Profiles
 * Curated single-origin micro-lots with SCA cupping scores, harvest provenance,
 * and 5-axis flavor radar coordinates (Acidity, Sweetness, Body, Floral, Finish).
 */
export const CURATED_SINGLE_ORIGINS = [
  {
    id: 'bean_worka_sakaro',
    beanName: 'Worka Sakaro Natural',
    roaster: 'Methodical Coffee',
    origin: 'Gedeb, Yirgacheffe, Ethiopia',
    elevation: '2,000 – 2,200 MASL',
    varietal: 'Indigenous Heirloom',
    processing: 'Natural / Sun-Dried',
    roastLevel: 'Light',
    cuppingScore: 89.5,
    tastingNotes: ['Peach Nectar', 'Jasmine Blossom', 'Bergamot', 'Wild Honey'],
    shopUrl: 'https://methodicalcoffee.com/collections/coffee',
    flavorRadar: {
      acidity: 92,
      sweetness: 90,
      body: 74,
      floral: 95,
      finish: 88
    },
    recommendedExtraction: {
      method: 'pour_over',
      ratio: 16.0,
      grind: 'Medium-Fine',
      tempF: 204,
      waterGrams: 320,
      dryDoseGrams: 20.0
    },
    notes: 'Sun-dried on raised African beds for 21 days. Exceptional floral clarity with bright peach acidity and crystalline sweetness.'
  },
  {
    id: 'bean_geometry',
    beanName: 'Geometry Blend',
    roaster: 'Onyx Coffee Lab',
    origin: 'Huila, Colombia & Yirgacheffe, Ethiopia',
    elevation: '1,900 – 2,100 MASL',
    varietal: 'Caturra, Castillo, Heirloom',
    processing: 'Washed / Honey',
    roastLevel: 'Light-Medium',
    cuppingScore: 88.5,
    tastingNotes: ['Sweet Berries', 'Black Tea', 'Honey', 'Silky Cocoa'],
    shopUrl: 'https://onyxcoffeelab.com/products/geometry',
    flavorRadar: {
      acidity: 84,
      sweetness: 92,
      body: 82,
      floral: 86,
      finish: 85
    },
    recommendedExtraction: {
      method: 'pour_over',
      ratio: 15.5,
      grind: 'Medium-Fine',
      tempF: 202,
      waterGrams: 310,
      dryDoseGrams: 20.0
    },
    notes: 'A harmonized modern blend combining the brightness of washed Ethiopian lots with the round, chocolate-caramel sweetness of Huila Colombia.'
  },
  {
    id: 'bean_the_future',
    beanName: 'The Future: Cinnamon Anaerobic',
    roaster: 'Black & White Coffee Roasters',
    origin: 'Piendamo, Cauca, Colombia',
    elevation: '1,950 MASL',
    varietal: 'Castillo',
    processing: 'Anaerobic Thermal Shock',
    roastLevel: 'Light',
    cuppingScore: 91.0,
    tastingNotes: ['Cinnamon Bun', 'Baked Apple', 'Brown Sugar', 'Cider Ferment'],
    shopUrl: 'https://www.blackwhiteroasters.com/collections/all-coffee',
    flavorRadar: {
      acidity: 88,
      sweetness: 96,
      body: 88,
      floral: 78,
      finish: 92
    },
    recommendedExtraction: {
      method: 'aeropress',
      ratio: 14.5,
      grind: 'Medium',
      tempF: 198,
      waterGrams: 220,
      dryDoseGrams: 15.0
    },
    notes: 'Experimental thermal shock fermentation by producer Jairo Arcila with whole cinnamon quills in the fermentation tank.'
  },
  {
    id: 'bean_el_jardin',
    beanName: 'El Jardín Pink Bourbon',
    roaster: 'Methodical Coffee',
    origin: 'San Adolfo, Huila, Colombia',
    elevation: '1,750 MASL',
    varietal: 'Pink Bourbon',
    processing: 'Washed Extended Ferment',
    roastLevel: 'Light',
    cuppingScore: 89.0,
    tastingNotes: ['Pink Grapefruit', 'Guava', 'Raw Cane Sugar', 'White Tea'],
    shopUrl: 'https://methodicalcoffee.com/collections/coffee',
    flavorRadar: {
      acidity: 94,
      sweetness: 86,
      body: 76,
      floral: 88,
      finish: 86
    },
    recommendedExtraction: {
      method: 'pour_over',
      ratio: 16.5,
      grind: 'Medium-Fine',
      tempF: 205,
      waterGrams: 330,
      dryDoseGrams: 20.0
    },
    notes: 'Rare Pink Bourbon mutation cultivated by Rodrigo Sanchez with distinct tropical fruit aromatics and delicate floral complexity.'
  }
];
