// Auth redirect interceptor
// Chrome blocks redirects to chrome-extension:// URLs from external sites, so
// this service worker watches for Supabase auth callbacks and forwards the
// session to the extension page.
//
// The auth payload is stashed in chrome.storage and the tab is navigated to a
// CLEAN extension URL (no token in the URL). This keeps tokens out of the page
// URL/history and avoids content/privacy blockers that match token params in
// the URL (which surfaced as ERR_BLOCKED_BY_CLIENT on the redirect).

const SUPABASE_HOST = 'eeidclmhfkndimghdyuq.supabase.co';
const EXTENSION_PAGE = 'src/newtab.html';
const AUTH_STASH_KEY = 'dn_auth_redirect';

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (!changeInfo.url) return;

  let url;
  try {
    url = new URL(changeInfo.url);
  } catch {
    return;
  }

  if (url.hostname !== SUPABASE_HOST) return;

  let payload = null;
  if (url.hash && (url.hash.includes('access_token=') || url.hash.includes('error='))) {
    // Implicit flow (#access_token=...) or error (#error=...)
    payload = { kind: 'hash', value: url.hash.replace(/^#/, '') };
  } else if (url.searchParams.has('code')) {
    // PKCE flow (?code=...)
    payload = { kind: 'query', value: url.searchParams.toString() };
  }

  if (!payload) return;

  // Stash the payload out-of-band, then navigate to a clean extension URL.
  chrome.storage.local.set({ [AUTH_STASH_KEY]: payload }, () => {
    chrome.tabs.update(tabId, { url: chrome.runtime.getURL(EXTENSION_PAGE) });
  });
});
