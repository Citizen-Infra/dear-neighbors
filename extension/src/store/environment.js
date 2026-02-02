import { signal } from '@preact/signals';

export const cityAqi = signal(null);
export const cityUv = signal(null);
export const envLoading = signal(false);

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function cityKey(cityName, countryName) {
  return `${cityName}_${countryName}`.toLowerCase().replace(/\s+/g, '_');
}

async function geocodeCity(cityName, countryName) {
  const key = `dn_geo_${cityKey(cityName, countryName)}`;
  const cached = localStorage.getItem(key);
  if (cached) return JSON.parse(cached);

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=5`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;

    // Prefer result matching the country name
    const match = data.results.find(
      (r) => r.country && r.country.toLowerCase() === countryName.toLowerCase()
    ) || data.results[0];

    const coords = { latitude: match.latitude, longitude: match.longitude };
    localStorage.setItem(key, JSON.stringify(coords));
    return coords;
  } catch (e) {
    console.error('Geocoding failed:', e);
    return null;
  }
}

async function fetchAirQuality(lat, lon) {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,uv_index`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.current) return null;
    return {
      aqi: data.current.european_aqi ?? null,
      uv: data.current.uv_index ?? null,
    };
  } catch (e) {
    console.error('Air quality fetch failed:', e);
    return null;
  }
}

export async function loadEnvironmentData(cityName, countryName) {
  if (!cityName || !countryName) return;

  const cKey = cityKey(cityName, countryName);
  const cacheKey = `dn_env_${cKey}`;

  // Check cache — use stale data immediately, refresh in background if expired
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const parsed = JSON.parse(cached);
    cityAqi.value = parsed.aqi;
    cityUv.value = parsed.uv;
    if (Date.now() - parsed.timestamp < CACHE_TTL) return;
  }

  envLoading.value = true;

  const coords = await geocodeCity(cityName, countryName);
  if (!coords) {
    envLoading.value = false;
    return;
  }

  const result = await fetchAirQuality(coords.latitude, coords.longitude);
  envLoading.value = false;

  if (result) {
    cityAqi.value = result.aqi;
    cityUv.value = result.uv;
    localStorage.setItem(cacheKey, JSON.stringify({
      aqi: result.aqi,
      uv: result.uv,
      timestamp: Date.now(),
    }));
  }
}
