import { useState } from 'preact/hooks';
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
import { user, isSignedIn, signInWithMagicLink, signOut } from '../store/auth';
import '../styles/settings-modal.css';
import '../styles/language.css';
import '../styles/auth-modal.css';

export function SettingsModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  async function handleAuthSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;

    setError(null);
    setSending(true);
    const result = await signInWithMagicLink(email.trim());
    setSending(false);

    if (result.ok) {
      setSent(true);
    } else {
      setError(result.error);
    }
  }

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
          <h4 class="settings-section-title">{t('settings.account')}</h4>

          {isSignedIn.value ? (
            <div class="auth-inline">
              <p class="auth-inline-status">
                {t('settings.signedInAs')} <strong>{user.value.email}</strong>
              </p>
              <button class="auth-inline-signout" onClick={signOut}>
                {t('topbar.signOut')}
              </button>
            </div>
          ) : sent ? (
            <div class="auth-inline">
              <div class="auth-sent">
                <p>{t('auth.checkEmail')}</p>
                <p class="auth-sent-email">{email}</p>
                <p class="auth-spam-hint">{t('auth.spamHint')}</p>
              </div>
            </div>
          ) : (
            <div class="auth-inline">
              <p class="auth-description">{t('auth.description')}</p>
              <form onSubmit={handleAuthSubmit}>
                <input
                  type="email"
                  class="auth-input"
                  placeholder={t('auth.placeholder')}
                  value={email}
                  onInput={(e) => setEmail(e.target.value)}
                  required
                />
                {error && <p class="auth-error">{error}</p>}
                <button type="submit" class="auth-submit" disabled={sending}>
                  {sending ? t('auth.sending') : t('auth.send')}
                </button>
              </form>
            </div>
          )}
        </section>

        <section class="settings-section">
          <h4 class="settings-section-title">{t('settings.interfaceLanguage')}</h4>
          <div class="lang-switch">
            <button
              class={`lang-switch-option ${uiLanguage.value === 'en' ? 'active' : ''}`}
              onClick={() => setUiLanguage('en')}
            >
              <span class="lang-flag">{'\uD83C\uDDEC\uD83C\uDDE7'}</span>
              English
            </button>
            <button
              class={`lang-switch-option ${uiLanguage.value === 'sr' ? 'active' : ''}`}
              onClick={() => setUiLanguage('sr')}
            >
              <span class="lang-flag">{'\uD83C\uDDF7\uD83C\uDDF8'}</span>
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
            <label class="settings-toggle-switch">
              <input
                type="checkbox"
                checked={showSessions.value}
                onChange={(e) => setShowSessions(e.target.checked)}
              />
              <span class="settings-toggle-track" />
            </label>
          </label>
          <p class="settings-hint">{t('settings.participationHint')}</p>
        </section>

        <section class="settings-section">
          <label class="settings-toggle-row">
            <span class="settings-toggle-label">{t('settings.contentFilter')}</span>
            <label class="settings-toggle-switch">
              <input
                type="checkbox"
                checked={contentLanguageFilter.value}
                onChange={(e) => setContentLanguageFilter(e.target.checked)}
              />
              <span class="settings-toggle-track" />
            </label>
          </label>
          <p class="settings-hint">{t('settings.contentFilterHint')}</p>
        </section>

        <footer class="settings-about">
          Built by <a href="https://github.com/Citizen-Infra" target="_blank" rel="noopener">Citizen Infra</a>
        </footer>

      </div>
    </div>
  );
}
