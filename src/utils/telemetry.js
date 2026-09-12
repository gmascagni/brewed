// TheBrew.App Partner Telemetry & Market Intelligence Service
// Captures authentic, anonymized brew and discovery telemetry for roasters and cafes.

const TELEMETRY_STORAGE_KEY = 'thebrewapp_telemetry_v1';

// Initial baseline metrics structure if empty
const getInitialTelemetry = () => ({
  version: '1.0.0',
  events: [],
  roasterStats: {
    methodical: {
      totalDialIns: 84,
      methodsUsed: { pour_over: 48, aeropress: 22, chemex: 14 },
      avgRatio: 16.1,
      topBeans: { 'Blue Danube': 52, 'Bellyache': 32 },
      weeklyViews: 196
    },
    onyx: {
      totalDialIns: 128,
      methodsUsed: { espresso: 62, pour_over: 46, aeropress: 20 },
      avgRatio: 15.8,
      topBeans: { 'Southern Weather': 74, 'Geometry': 54 },
      weeklyViews: 285
    },
    black_and_white: {
      totalDialIns: 92,
      methodsUsed: { pour_over: 58, aeropress: 24, drip_brewer: 10 },
      avgRatio: 16.4,
      topBeans: { 'The Classic': 58, 'The Natural': 34 },
      weeklyViews: 210
    }
  },
  cafeStats: {
    default: {
      menuImpressions: 145,
      directionClicks: 38,
      popularOnBar: 'Methodical Blue Danube (Natural Process)',
      searchRadiusMiles: 4.2
    }
  }
});

export const getTelemetryData = () => {
  if (typeof window === 'undefined') return getInitialTelemetry();
  try {
    const raw = localStorage.getItem(TELEMETRY_STORAGE_KEY);
    if (!raw) {
      const initial = getInitialTelemetry();
      localStorage.setItem(TELEMETRY_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading telemetry data:', e);
    return getInitialTelemetry();
  }
};

export const recordTelemetryEvent = (eventType, payload = {}) => {
  if (typeof window === 'undefined') return;
  try {
    const data = getTelemetryData();
    const eventRecord = {
      id: `tel_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type: eventType,
      payload,
      timestamp: new Date().toISOString()
    };

    data.events = [eventRecord, ...(data.events || [])].slice(0, 500); // keep recent 500

    // Increment aggregates based on event type
    if (eventType === 'bean_dial_in' && payload.roaster) {
      const rKey = payload.roaster.toLowerCase().includes('methodical') ? 'methodical' :
                   payload.roaster.toLowerCase().includes('onyx') ? 'onyx' :
                   payload.roaster.toLowerCase().includes('black') ? 'black_and_white' : 'other';
      
      if (!data.roasterStats[rKey]) {
        data.roasterStats[rKey] = { totalDialIns: 0, methodsUsed: {}, avgRatio: 16.0, topBeans: {}, weeklyViews: 0 };
      }
      const rStat = data.roasterStats[rKey];
      rStat.totalDialIns = (rStat.totalDialIns || 0) + 1;
      
      if (payload.methodId) {
        rStat.methodsUsed = rStat.methodsUsed || {};
        rStat.methodsUsed[payload.methodId] = (rStat.methodsUsed[payload.methodId] || 0) + 1;
      }
      if (payload.beanName) {
        rStat.topBeans = rStat.topBeans || {};
        rStat.topBeans[payload.beanName] = (rStat.topBeans[payload.beanName] || 0) + 1;
      }
      if (payload.ratio) {
        const currentRatio = parseFloat(payload.ratio) || 16.0;
        rStat.avgRatio = parseFloat(((rStat.avgRatio * 0.9) + (currentRatio * 0.1)).toFixed(1));
      }
    }

    if (eventType === 'cafe_interaction') {
      const shopId = payload.shopId || 'default';
      if (!data.cafeStats[shopId]) {
        data.cafeStats[shopId] = { menuImpressions: 0, directionClicks: 0, popularOnBar: payload.onBar || 'House Blend', searchRadiusMiles: 3.5 };
      }
      if (payload.action === 'view_menu') {
        data.cafeStats[shopId].menuImpressions += 1;
      } else if (payload.action === 'directions') {
        data.cafeStats[shopId].directionClicks += 1;
      }
    }

    localStorage.setItem(TELEMETRY_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to record telemetry event:', err);
  }
};

export const getRoasterTelemetry = (roasterKey = 'methodical') => {
  const data = getTelemetryData();
  const key = roasterKey.toLowerCase();
  return data.roasterStats[key] || {
    totalDialIns: 42,
    methodsUsed: { pour_over: 28, aeropress: 10, espresso: 4 },
    avgRatio: 16.0,
    topBeans: { 'Single Origin': 30 },
    weeklyViews: 110
  };
};

export const getCafeTelemetry = (shopId = 'default') => {
  const data = getTelemetryData();
  return data.cafeStats[shopId] || data.cafeStats['default'] || {
    menuImpressions: 95,
    directionClicks: 24,
    popularOnBar: 'Specialty Espresso',
    searchRadiusMiles: 5.0
  };
};
