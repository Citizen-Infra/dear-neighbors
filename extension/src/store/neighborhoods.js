import { signal, computed } from '@preact/signals';
import { supabase } from '../lib/supabase';

export const neighborhoods = signal([]);
export const activeNeighborhoodId = signal(
  localStorage.getItem('dn_neighborhood') || null
);

export const activeNeighborhood = computed(() =>
  neighborhoods.value.find((n) => n.id === activeNeighborhoodId.value) || null
);

export async function loadNeighborhoods() {
  const { data, error } = await supabase
    .from('neighborhoods')
    .select('*')
    .order('type')
    .order('name');

  if (error) {
    console.error('Failed to load neighborhoods:', error);
    return;
  }

  neighborhoods.value = data;

  // Default to city-level if no preference set
  if (!activeNeighborhoodId.value && data.length > 0) {
    const city = data.find((n) => n.type === 'city');
    if (city) {
      setActiveNeighborhood(city.id);
    }
  }
}

export function setActiveNeighborhood(id) {
  activeNeighborhoodId.value = id;
  localStorage.setItem('dn_neighborhood', id);
}
