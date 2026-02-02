import { cityAqi, cityUv, aqiScale } from '../store/environment';
import { t } from '../lib/i18n';
import '../styles/env-badges.css';

// European AQI: 0–20 good, 20–40 fair, 40–60 moderate, 60–80 poor, 80–100 very poor, 100+ hazardous
function euAqiColor(value) {
  if (value <= 20) return 'var(--env-green)';
  if (value <= 40) return 'var(--env-yellow)';
  if (value <= 60) return 'var(--env-yellow)';
  if (value <= 80) return 'var(--env-orange)';
  if (value <= 100) return 'var(--env-orange)';
  return 'var(--env-red)';
}

function euAqiLabel(value) {
  if (value <= 20) return t('env.aqi.good');
  if (value <= 40) return t('env.aqi.fair');
  if (value <= 60) return t('env.aqi.moderate');
  if (value <= 80) return t('env.aqi.poor');
  if (value <= 100) return t('env.aqi.poor');
  return t('env.aqi.veryPoor');
}

// US AQI: 0–50 good, 51–100 moderate, 101–150 unhealthy (sensitive), 151–200 unhealthy, 201+ very unhealthy
function usAqiColor(value) {
  if (value <= 50) return 'var(--env-green)';
  if (value <= 100) return 'var(--env-yellow)';
  if (value <= 150) return 'var(--env-orange)';
  return 'var(--env-red)';
}

function usAqiLabel(value) {
  if (value <= 50) return t('env.aqi.good');
  if (value <= 100) return t('env.aqi.moderate');
  if (value <= 150) return t('env.aqi.poor');
  return t('env.aqi.veryPoor');
}

function aqiColor(value, scale) {
  return scale === 'us' ? usAqiColor(value) : euAqiColor(value);
}

function aqiLabel(value, scale) {
  return scale === 'us' ? usAqiLabel(value) : euAqiLabel(value);
}

function uvColor(value) {
  if (value <= 2) return 'var(--env-green)';
  if (value <= 5) return 'var(--env-yellow)';
  if (value <= 7) return 'var(--env-orange)';
  if (value <= 10) return 'var(--env-red)';
  return 'var(--env-red)';
}

function uvLabel(value) {
  if (value <= 2) return t('env.uv.low');
  if (value <= 5) return t('env.uv.moderate');
  if (value <= 7) return t('env.uv.high');
  if (value <= 10) return t('env.uv.veryHigh');
  return t('env.uv.extreme');
}

export function EnvBadges() {
  const aqi = cityAqi.value;
  const uv = cityUv.value;
  const scale = aqiScale.value;

  if (aqi == null && uv == null) return null;

  return (
    <div class="env-badges">
      {aqi != null && (
        <span class="env-badge" title={`${t('env.aqi')}: ${aqiLabel(aqi, scale)}`}>
          <span class="env-dot" style={{ background: aqiColor(aqi, scale) }} />
          <span class="env-label">{t('env.aqi')}</span>
          <span class="env-value">{Math.round(aqi)}</span>
        </span>
      )}
      {uv != null && (
        <span class="env-badge" title={`${t('env.uv')}: ${uvLabel(uv)}`}>
          <span class="env-dot" style={{ background: uvColor(uv) }} />
          <span class="env-label">{t('env.uv')}</span>
          <span class="env-value">{Math.round(uv * 10) / 10}</span>
        </span>
      )}
    </div>
  );
}
