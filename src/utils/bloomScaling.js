/**
 * Bloom Phase Scaling Variables & Metrics
 * 
 * Implements the coffee extraction industry standard: The Two Scaling Variables
 * - Small Dose (12–15g): Bloom Water Weight 35–45g (2.5–3×), Bloom Time 30–40 seconds
 * - Standard Dose (20–30g): Bloom Water Weight 60–90g (2.5–3×), Bloom Time 40–45 seconds
 * - Large Dose (45–60g+): Bloom Water Weight 135–180g (2.5–3×), Bloom Time 45–60+ seconds
 */

export const BLOOM_SCALING_TABLE = [
  {
    tier: 'small',
    label: 'Small Dose',
    doseRange: '12–15g',
    waterWeightRange: '35–45g',
    waterRatio: '2.5–3×',
    waterWeightLabel: '35–45g (2.5–3×)',
    bloomTimeRange: '30–40 seconds',
    timeSecMin: 30,
    timeSecMax: 40,
    defaultTimeSec: 35
  },
  {
    tier: 'standard',
    label: 'Standard Dose',
    doseRange: '20–30g',
    waterWeightRange: '60–90g',
    waterRatio: '2.5–3×',
    waterWeightLabel: '60–90g (2.5–3×)',
    bloomTimeRange: '40–45 seconds',
    timeSecMin: 40,
    timeSecMax: 45,
    defaultTimeSec: 45
  },
  {
    tier: 'large',
    label: 'Large Dose',
    doseRange: '45–60g+',
    waterWeightRange: '135–180g',
    waterRatio: '2.5–3×',
    waterWeightLabel: '135–180g (2.5–3×)',
    bloomTimeRange: '45–60+ seconds',
    timeSecMin: 45,
    timeSecMax: 60,
    defaultTimeSec: 60
  }
];

/**
 * Dynamically computes precise bloom metrics for any dry coffee dose in grams.
 * 
 * @param {number} doseGrams - Ground coffee dry weight in grams (default 18)
 * @returns {object} Computed scaling variables and display metadata
 */
export function getBloomScalingMetrics(doseGrams = 18) {
  const dose = Math.max(8, Number(doseGrams) || 18);

  let tierConfig = BLOOM_SCALING_TABLE[1]; // default standard
  let durationSec = 45;

  if (dose < 18) {
    tierConfig = BLOOM_SCALING_TABLE[0]; // small (12–15g)
    if (dose <= 13) {
      durationSec = 30;
    } else if (dose <= 15) {
      durationSec = 35;
    } else {
      durationSec = 40;
    }
  } else if (dose < 40) {
    tierConfig = BLOOM_SCALING_TABLE[1]; // standard (20–30g)
    if (dose <= 24) {
      durationSec = 40;
    } else {
      durationSec = 45;
    }
  } else {
    tierConfig = BLOOM_SCALING_TABLE[2]; // large (45–60g+)
    if (dose < 50) {
      durationSec = 50;
    } else if (dose < 60) {
      durationSec = 55;
    } else {
      durationSec = 60;
    }
  }

  const minWaterGrams = Math.round(dose * 2.5);
  const maxWaterGrams = Math.round(dose * 3.0);
  const targetWaterGrams = maxWaterGrams; // Golden bloom target 3.0x

  return {
    dose,
    tier: tierConfig.tier,
    tierName: tierConfig.label,
    doseRange: tierConfig.doseRange,
    targetWaterGrams,
    minWaterGrams,
    maxWaterGrams,
    waterWeightRange: tierConfig.waterWeightRange,
    waterRatio: tierConfig.waterRatio,
    waterWeightLabel: tierConfig.waterWeightLabel,
    waterRangeStr: `${minWaterGrams}–${maxWaterGrams}g (2.5–3×)`,
    durationSec,
    bloomTimeRange: tierConfig.bloomTimeRange,
    timeSecMin: tierConfig.timeSecMin,
    timeSecMax: tierConfig.timeSecMax,
    instruction: `Saturate grounds evenly with ${targetWaterGrams}g water (${minWaterGrams}–${maxWaterGrams}g, 2.5–3× dose). Let coffee bloom and de-gas for ${durationSec}s.`
  };
}
