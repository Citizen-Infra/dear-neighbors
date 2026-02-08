import { signal, computed } from '@preact/signals';
import { supabase } from '../lib/supabase';
import { neighborhoods, selectedCityId } from './neighborhoods';

const EVENTS_API = 'https://scenius-digest.vercel.app/api/events';

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

function getEventStatus(startsAt, endsAt) {
  if (!startsAt) return 'upcoming';
  const now = new Date();
  const start = new Date(startsAt);
  const end = endsAt ? new Date(endsAt) : new Date(start.getTime() + 2 * 60 * 60 * 1000);
  if (now >= start && now <= end) return 'active';
  if (now < start) return 'upcoming';
  return 'completed';
}

function getCitySlug() {
  const cityId = selectedCityId.value;
  if (!cityId) return null;
  const city = neighborhoods.value.find((n) => n.id === cityId);
  if (!city) return null;
  return city.name.toLowerCase().replace(/\s+/g, '-');
}

export async function loadSessions({ neighborhoodIds = [], topicIds = [], language = null }) {
  sessionsLoading.value = true;

  try {
    const results = [];

    // Fetch events from scenius-digest /api/events by city
    const citySlug = getCitySlug();
    if (citySlug) {
      try {
        const res = await fetch(`${EVENTS_API}?city=${citySlug}`);
        if (res.ok) {
          const data = await res.json();
          for (const event of data.events || []) {
            results.push({
              ...event,
              status: getEventStatus(event.starts_at, event.ends_at),
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch events:', err);
      }
    }

    // Fetch Supabase sessions (Harmonica, filtered by neighborhood)
    let query = supabase
      .from('sessions_with_topics')
      .select('*');

    if (neighborhoodIds.length > 0) {
      query = query.in('neighborhood_id', neighborhoodIds);
    }

    if (topicIds.length > 0) {
      query = query.contains('topic_ids', topicIds);
    }

    if (language) {
      query = query.eq('language', language);
    }

    query = query.order('starts_at', { ascending: true });

    const { data, error } = await query;

    if (!error && data) {
      results.push(...data.map((s) => ({ ...s, source: 'session' })));
    }

    // Deduplicate by URL
    const seen = new Set();
    const deduped = [];
    for (const item of results) {
      const key = item.url || item.id;
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(item);
      }
    }

    // Sort by starts_at ascending, nulls last
    deduped.sort((a, b) => {
      const aTime = a.starts_at ? new Date(a.starts_at).getTime() : Infinity;
      const bTime = b.starts_at ? new Date(b.starts_at).getTime() : Infinity;
      return aTime - bTime;
    });

    sessions.value = deduped;
  } catch (err) {
    console.error('Failed to load sessions:', err);
  }

  sessionsLoading.value = false;
}
