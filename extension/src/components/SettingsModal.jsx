import {
  neighborhoods, activeNeighborhoodId, selectedCountryId, selectedCityId,
  countries, citiesForCountry, neighborhoodsForCity,
  setSelectedCountry, setSelectedCity, setActiveNeighborhood,
} from '../store/neighborhoods';
import { topics, activeTopicIds, toggleTopic, clearTopicFilters, allTopicsActive } from '../store/topics';
import { showSessions, setShowSessions } from '../store/sessions';
import { theme, setTheme } from '../store/theme';
import { uiLanguage, setUiLanguage, t } from '../lib/i18n';
import { contentLanguageFilter, setContentLanguageFilter } from '../store/language';
import '../styles/settings-modal.css';

export function SettingsModal({ onClose }) {
  return (
    <div class="modal-overlay" onClick={onClose}>
      <div class="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div class="settings-header">
          <h3 class="settings-title">{t('settings.title')}</h3>
          <button class="settings-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <section class="settings-section">
          <h4 class="settings-section-title">{t('settings.interfaceLanguage')}</h4>
          <div class="theme-picker">
            <button
              class={`topic-grid-chip ${uiLanguage.value === 'en' ? 'active' : ''}`}
              onClick={() => setUiLanguage('en')}
            >
              English
            </button>
            <button
              class={`topic-grid-chip ${uiLanguage.value === 'sr' ? 'active' : ''}`}
              onClick={() => setUiLanguage('sr')}
            >
              Srpski
            </button>
          </div>
        </section>

        <section class="settings-section">
          <h4 class="settings-section-title">{t('settings.location')}</h4>

          <label class="settings-label">{t('settings.country')}</label>
          <select
            class="location-select"
            value={selectedCountryId.value || ''}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">{t('settings.selectCountry')}</option>
            {countries.value.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {selectedCountryId.value && (
            <>
              <label class="settings-label">{t('settings.city')}</label>
              <select
                class="location-select"
                value={selectedCityId.value || ''}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">{t('settings.selectCity')}</option>
                {citiesForCountry.value.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </>
          )}

          {selectedCityId.value && (
            <>
              <label class="settings-label">{t('settings.neighborhood')}</label>
              <div class="neighborhood-list">
                <button
                  class={`neighborhood-item ${activeNeighborhoodId.value === selectedCityId.value ? 'active' : ''}`}
                  onClick={() => setActiveNeighborhood(selectedCityId.value)}
                >
                  <span class="neighborhood-name">{t('settings.allNeighborhoods')}</span>
                  {activeNeighborhoodId.value === selectedCityId.value && (
                    <span class="neighborhood-check">&#10003;</span>
                  )}
                </button>
                {neighborhoodsForCity.value.map((n) => (
                  <button
                    key={n.id}
                    class={`neighborhood-item ${n.id === activeNeighborhoodId.value ? 'active' : ''}`}
                    onClick={() => setActiveNeighborhood(n.id)}
                  >
                    <span class="neighborhood-name">{n.name}</span>
                    {n.id === activeNeighborhoodId.value && (
                      <span class="neighborhood-check">&#10003;</span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </section>

        <section class="settings-section">
          <div class="settings-section-header">
            <h4 class="settings-section-title">{t('settings.topics')}</h4>
            {!allTopicsActive.value && (
              <button class="settings-clear-topics" onClick={clearTopicFilters}>
                {t('settings.clearAll')}
              </button>
            )}
          </div>
          <div class="topic-grid">
            {topics.value.map((tp) => (
              <button
                key={tp.id}
                class={`topic-grid-chip ${activeTopicIds.value.includes(tp.id) ? 'active' : ''}`}
                onClick={() => toggleTopic(tp.id)}
              >
                {tp.name}
              </button>
            ))}
          </div>
          {allTopicsActive.value && (
            <p class="settings-hint">{t('settings.allTopicsHint')}</p>
          )}
        </section>

        <section class="settings-section">
          <h4 class="settings-section-title">{t('settings.theme')}</h4>
          <div class="theme-picker">
            {['light', 'dark', 'system'].map((val) => (
              <button
                key={val}
                class={`topic-grid-chip ${theme.value === val ? 'active' : ''}`}
                onClick={() => setTheme(val)}
              >
                {t(`settings.${val}`)}
              </button>
            ))}
          </div>
        </section>

        <section class="settings-section">
          <label class="settings-toggle-row">
            <span class="settings-toggle-label">{t('settings.participation')}</span>
            <input
              type="checkbox"
              class="settings-toggle-checkbox"
              checked={showSessions.value}
              onChange={(e) => setShowSessions(e.target.checked)}
            />
          </label>
          <p class="settings-hint">{t('settings.participationHint')}</p>
        </section>

        <section class="settings-section">
          <label class="settings-toggle-row">
            <span class="settings-toggle-label">{t('settings.contentFilter')}</span>
            <input
              type="checkbox"
              class="settings-toggle-checkbox"
              checked={contentLanguageFilter.value}
              onChange={(e) => setContentLanguageFilter(e.target.checked)}
            />
          </label>
          <p class="settings-hint">{t('settings.contentFilterHint')}</p>
        </section>
      </div>
    </div>
  );
}
