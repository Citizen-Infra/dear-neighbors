import { signal, computed } from '@preact/signals';
import { supabase } from '../lib/supabase';

export const user = signal(null);
export const authLoading = signal(true);

export const isSignedIn = computed(() => user.value !== null);

export async function initAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  user.value = session?.user || null;
  authLoading.value = false;

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null;
  });
}

export async function signInWithMagicLink(email) {
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) {
    console.error('Failed to send magic link:', error);
    return false;
  }
  return true;
}

export async function signOut() {
  await supabase.auth.signOut();
  user.value = null;
}
