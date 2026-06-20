import { signal, computed } from '@preact/signals';
import { supabase } from '../lib/supabase';
import { t } from '../lib/i18n';

export const user = signal(null);
export const authLoading = signal(true);
export const isAdmin = signal(false);

export const isSignedIn = computed(() => user.value !== null);
export const showAuthModal = signal(false);

async function checkAdmin(userId) {
  if (!userId) { isAdmin.value = false; return; }
  const { data } = await supabase.from('admins').select('user_id').eq('user_id', userId).maybeSingle();
  isAdmin.value = !!data;
}

const AUTH_STASH_KEY = 'dn_auth_redirect';

// Pick up an auth payload stashed by the service worker (background.js) after a
// magic-link redirect. Tokens are passed via chrome.storage instead of in the
// URL, so they never appear in the page URL/history and aren't blocked by
// content/privacy blockers (ERR_BLOCKED_BY_CLIENT).
async function consumeAuthRedirect() {
  const storage = globalThis.chrome?.storage?.local;
  if (!storage) return;

  let payload;
  try {
    const stored = await storage.get(AUTH_STASH_KEY);
    payload = stored?.[AUTH_STASH_KEY];
    if (!payload) return;
    await storage.remove(AUTH_STASH_KEY);
  } catch {
    return;
  }

  try {
    if (payload.kind === 'hash') {
      const params = new URLSearchParams(payload.value);
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      if (access_token && refresh_token) {
        await supabase.auth.setSession({ access_token, refresh_token });
      } else {
        const err = params.get('error_description') || params.get('error');
        if (err) console.error('Auth redirect error:', err);
      }
    } else if (payload.kind === 'query') {
      const code = new URLSearchParams(payload.value).get('code');
      if (code) await supabase.auth.exchangeCodeForSession(code);
    }
  } catch (e) {
    console.error('Failed to establish session from auth redirect:', e);
  }
}

export async function initAuth() {
  await consumeAuthRedirect();
  const { data: { session } } = await supabase.auth.getSession();
  user.value = session?.user || null;
  authLoading.value = false;
  checkAdmin(user.value?.id);

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null;
    checkAdmin(user.value?.id);
  });
}

export async function signInWithMagicLink(email) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: supabaseUrl },
  });
  if (error) {
    console.error('Failed to send magic link:', error);
    if (error.status === 429) {
      return { error: t('auth.tooMany') };
    }
    return { error: t('auth.failed') };
  }
  return { ok: true };
}

export async function signOut() {
  await supabase.auth.signOut();
  user.value = null;
}
