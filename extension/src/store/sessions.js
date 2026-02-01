import { signal, computed } from '@preact/signals';
import { supabase } from '../lib/supabase';

export const sessions = signal([]);
export const sessionsLoading = signal(false);
export const showSessions = signal(localStorage.getItem('dn_show_sessions') === 'true');

export function setShowSessions(val) {
  showSessions.value = val;
  localStorage.setItem('dn_show_sessions', String(val));
}

export const activeSessions = computed(() =>
  sessions.value.filter((s) => s.status === 'active')
);

export const upcomingSessions = computed(() =>
  sessions.value.filter((s) => s.status === 'upcoming')
);

export const completedSessions = computed(() =>
  sessions.value.filter((s) => s.status === 'completed')
);

export async function loadSessions({ neighborhoodId, topicIds = [] }) {
  sessionsLoading.value = true;

  let query = supabase
    .from('sessions_with_topics')
    .select('*');

  if (neighborhoodId) {
    query = query.eq('neighborhood_id', neighborhoodId);
  }

  if (topicIds.length > 0) {
    query = query.contains('topic_ids', topicIds);
  }

  query = query.order('starts_at', { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error('Failed to load sessions:', error);
    sessionsLoading.value = false;
    return;
  }

  sessions.value = data;
  sessionsLoading.value = false;
}
