// handles fetching menu json with fallback and cache-busting

// culmenu-fetch.js
import exampleMenu from './cul-main-menu.json';
import exampleMenuUrl from './cul-main-menu.json?url';

export async function fetchCULmenu(url) {
  const runtimeUrl = url || exampleMenuUrl;

  try {
    const res = await fetch(addCacheBusting(runtimeUrl), {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000) // fail fast
    });

    if (!res.ok) throw new Error('Menu fetch failed');
    return await res.json();

  } catch (err) {
    console.warn(
      '[CUL Menu] Remote menu unavailable, using bundled example.',
      err
    );
    return exampleMenu;
  }
}

function addCacheBusting(url) {
  if (url.includes('?')) return url;
  return `${url}?v=${__VERSION__}`;
}

