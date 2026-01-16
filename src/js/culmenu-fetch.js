import culmenuFallback from './cul-main-menu.json';

export async function fetchCULmenu(url) {
  const cacheBustedUrl = addCacheBusting(url);

  try {
    const res = await fetch(cacheBustedUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error('Menu fetch failed');
    return await res.json();
  } catch (err) {
    console.warn('[CUL Menu] Using fallback menu JSON.', err);
    return culmenuFallback;
  }
}

function addCacheBusting(url) {
  // version-based if already present, otherwise timestamp
  if (url.includes('?')) return url;
  return `${url}?v=${__VERSION__}`;
}

