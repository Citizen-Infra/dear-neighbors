import { signal, computed } from '@preact/signals';
import { supabase } from '../lib/supabase';

export const neighborhoods = signal([]);

export const selectedCountryId = signal(
  localStorage.getItem('dn_country') || null
);
export const selectedCityId = signal(
  localStorage.getItem('dn_city') || null
);
export const activeNeighborhoodId = signal(
  localStorage.getItem('dn_neighborhood') || null
);

export const activeNeighborhood = computed(() =>
  neighborhoods.value.find((n) => n.id === activeNeighborhoodId.value) || null
);

export const countries = computed(() =>
  neighborhoods.value.filter((n) => n.type === 'country')
);

export const citiesForCountry = computed(() =>
  neighborhoods.value.filter(
    (n) => n.type === 'city' && n.parent_id === selectedCountryId.value
  )
);

export const neighborhoodsForCity = computed(() =>
  neighborhoods.value.filter(
    (n) => n.type === 'neighborhood' && n.parent_id === selectedCityId.value
  )
);

export const locationConfigured = computed(() =>
  Boolean(selectedCountryId.value && selectedCityId.value)
);

// BFS: collect all descendant IDs from a starting node
export const filterNeighborhoodIds = computed(() => {
  const startId = activeNeighborhoodId.value;
  if (!startId) return [];

  const all = neighborhoods.value;
  const ids = [startId];
  const queue = [startId];

  while (queue.length > 0) {
    const current = queue.shift();
    for (const n of all) {
      if (n.parent_id === current && !ids.includes(n.id)) {
        ids.push(n.id);
        queue.push(n.id);
      }
    }
  }

  return ids;
});

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

  // Existing-user migration: if dn_neighborhood is set but country/city aren't,
  // walk the parent chain to auto-populate them
  const savedNeighborhood = localStorage.getItem('dn_neighborhood');
  const savedCountry = localStorage.getItem('dn_country');
  const savedCity = localStorage.getItem('dn_city');

  if (savedNeighborhood && !savedCountry && !savedCity) {
    let node = data.find((n) => n.id === savedNeighborhood);
    let cityId = null;
    let countryId = null;

    while (node) {
      if (node.type === 'city') cityId = node.id;
      if (node.type === 'country') countryId = node.id;
      node = node.parent_id ? data.find((n) => n.id === node.parent_id) : null;
    }

    if (countryId) {
      selectedCountryId.value = countryId;
      localStorage.setItem('dn_country', countryId);
    }
    if (cityId) {
      selectedCityId.value = cityId;
      localStorage.setItem('dn_city', cityId);
    }
    return;
  }

  // Default: if nothing is configured and data exists, pick first country/city
  if (!selectedCountryId.value && !selectedCityId.value && !activeNeighborhoodId.value && data.length > 0) {
    const country = data.find((n) => n.type === 'country');
    if (country) {
      setSelectedCountry(country.id);
      const city = data.find((n) => n.type === 'city' && n.parent_id === country.id);
      if (city) {
        setSelectedCity(city.id);
      }
    }
  }
}

export function setSelectedCountry(id) {
  selectedCountryId.value = id;
  localStorage.setItem('dn_country', id);
  // Reset city and neighborhood
  selectedCityId.value = null;
  localStorage.removeItem('dn_city');
  activeNeighborhoodId.value = null;
  localStorage.removeItem('dn_neighborhood');
}

export function setSelectedCity(id) {
  selectedCityId.value = id;
  localStorage.setItem('dn_city', id);
  // Auto-set activeNeighborhood to city (= "all neighborhoods")
  activeNeighborhoodId.value = id;
  localStorage.setItem('dn_neighborhood', id);
}

export function setActiveNeighborhood(id) {
  activeNeighborhoodId.value = id;
  localStorage.setItem('dn_neighborhood', id);
}
