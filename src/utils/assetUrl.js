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
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }

  // Determine actual runtime base:
  // If the browser URL path starts with /brewed (e.g. GitHub Pages without custom domain), use /brewed/
  // Otherwise (e.g. custom domain thebrew.app or localhost dev server), use root /
  let base = '/';
  if (typeof window !== 'undefined') {
    if (window.location.pathname.startsWith('/brewed')) {
      base = '/brewed/';
    } else {
      base = '/';
    }
  } else {
    base = import.meta.env.BASE_URL || '/';
  }

  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
}
