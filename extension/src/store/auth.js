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

export async function initAuth() {
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
