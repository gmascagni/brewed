/**
 * Resolves a public asset path against Vite's base URL.
 * Handles root base ('/') in development and custom subpaths (e.g. '/brewed/')
 * in production on GitHub Pages or custom hosting.
 *
 * @param {string} path - The relative or absolute path (e.g., '/images/gear/v60_ceramic_dripper.jpg')
 * @returns {string} Fully resolved asset URL
 */
export function getAssetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
}
