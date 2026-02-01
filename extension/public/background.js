// Auth redirect interceptor
// Chrome blocks redirects to chrome-extension:// URLs from external sites.
// This service worker watches for Supabase auth callbacks and navigates
// the tab to the extension page with the auth tokens intact.

const SUPABASE_HOST = 'eeidclmhfkndimghdyuq.supabase.co';
const EXTENSION_PAGE = 'src/newtab.html';

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!changeInfo.url) return;

  let url;
  try {
    url = new URL(changeInfo.url);
  } catch {
    return;
  }

  if (url.hostname !== SUPABASE_HOST) return;

  // Implicit flow: #access_token=...
  if (url.hash && url.hash.includes('access_token=')) {
    const extensionUrl = chrome.runtime.getURL(EXTENSION_PAGE) + url.hash;
    chrome.tabs.update(tabId, { url: extensionUrl });
    return;
  }

  // Error redirect: #error=...
  if (url.hash && url.hash.includes('error=')) {
    const extensionUrl = chrome.runtime.getURL(EXTENSION_PAGE) + url.hash;
    chrome.tabs.update(tabId, { url: extensionUrl });
    return;
  }

  // PKCE flow: ?code=...
  if (url.searchParams.has('code')) {
    const extensionUrl = chrome.runtime.getURL(EXTENSION_PAGE) + '?' + url.searchParams.toString();
    chrome.tabs.update(tabId, { url: extensionUrl });
    return;
  }
});
