/**
 * Grind Settings Resolution Utility
 * Translates verbal grind descriptions, micron ranges, or brew method IDs
 * into canonical grind visual identifiers.
 */
export function resolveGrindId(grindStr, methodId) {
  if (grindStr) {
    const s = String(grindStr).toLowerCase();
    if (s.includes('extra fine') || s.includes('extra-fine') || s.includes('turkish')) return 'extra_fine';
    if (s.includes('medium-coarse') || s.includes('medium coarse') || s.includes('coarse / medium-coarse')) return 'medium_coarse';
    if (s.includes('medium-fine') || s.includes('medium fine') || s.includes('fine / medium-fine')) return 'medium_fine';
    if (s.includes('extra coarse') || s.includes('extra-coarse') || s.includes('coarse')) return 'coarse';
    if (s.includes('fine')) return 'fine';
    if (s.includes('medium')) return 'medium';
  }
  if (methodId) {
    if (methodId === 'espresso') return 'extra_fine';
    if (methodId === 'moka_pot') return 'fine';
    if (methodId === 'pour_over' || methodId === 'aeropress') return 'medium_fine';
    if (methodId === 'chemex') return 'medium_coarse';
    if (methodId === 'classic_pour_over' || methodId === 'drip_brewer') return 'medium';
    if (methodId === 'french_press' || methodId === 'cold_brew') return 'coarse';
  }
  return 'medium_fine';
}
