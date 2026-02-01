import { signal, computed } from '@preact/signals';
import { supabase } from '../lib/supabase';

export const topics = signal([]);
export const activeTopicIds = signal(
  JSON.parse(localStorage.getItem('dn_topics') || '[]')
);

export const activeTopics = computed(() => {
  const ids = activeTopicIds.value;
  if (ids.length === 0) return topics.value; // all topics when none selected
  return topics.value.filter((t) => ids.includes(t.id));
});

// Whether "all topics" mode is active (nothing explicitly selected)
export const allTopicsActive = computed(() => activeTopicIds.value.length === 0);

export async function loadTopics() {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .order('name');

  if (error) {
    console.error('Failed to load topics:', error);
    return;
  }

  topics.value = data;
}

export function toggleTopic(id) {
  const current = activeTopicIds.value;
  const next = current.includes(id)
    ? current.filter((t) => t !== id)
    : [...current, id];

  activeTopicIds.value = next;
  localStorage.setItem('dn_topics', JSON.stringify(next));
}

export function clearTopicFilters() {
  activeTopicIds.value = [];
  localStorage.setItem('dn_topics', '[]');
}
