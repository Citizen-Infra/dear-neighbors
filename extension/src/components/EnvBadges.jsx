import { cityAqi, cityUv } from '../store/environment';
import { t } from '../lib/i18n';
import '../styles/env-badges.css';

function aqiColor(value) {
  if (value <= 20) return 'var(--env-green)';
  if (value <= 40) return 'var(--env-yellow)';
  if (value <= 60) return 'var(--env-yellow)';
  if (value <= 80) return 'var(--env-orange)';
  if (value <= 100) return 'var(--env-orange)';
  return 'var(--env-red)';
}

function aqiLabel(value) {
  if (value <= 20) return t('env.aqi.good');
  if (value <= 40) return t('env.aqi.fair');
  if (value <= 60) return t('env.aqi.moderate');
  if (value <= 80) return t('env.aqi.poor');
  if (value <= 100) return t('env.aqi.poor');
  return t('env.aqi.veryPoor');
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

  if (aqi == null && uv == null) return null;

  return (
    <div class="env-badges">
      {aqi != null && (
        <span class="env-badge" title={`${t('env.aqi')}: ${aqiLabel(aqi)}`}>
          <span class="env-dot" style={{ background: aqiColor(aqi) }} />
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
