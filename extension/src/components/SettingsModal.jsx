import {
  neighborhoods, activeNeighborhoodId, selectedCountryId, selectedCityId,
  countries, citiesForCountry, neighborhoodsForCity,
  setSelectedCountry, setSelectedCity, setActiveNeighborhood,
} from '../store/neighborhoods';
import { topics, activeTopicIds, toggleTopic, clearTopicFilters, allTopicsActive } from '../store/topics';
import { showSessions, setShowSessions } from '../store/sessions';
import { theme, setTheme } from '../store/theme';
import '../styles/settings-modal.css';

export function SettingsModal({ onClose }) {
  return (
    <div class="modal-overlay" onClick={onClose}>
      <div class="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div class="settings-header">
          <h3 class="settings-title">Settings</h3>
          <button class="settings-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <section class="settings-section">
          <h4 class="settings-section-title">Location</h4>

          <label class="settings-label">Country</label>
          <select
            class="location-select"
            value={selectedCountryId.value || ''}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">Select country...</option>
            {countries.value.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {selectedCountryId.value && (
            <>
              <label class="settings-label">City</label>
              <select
                class="location-select"
                value={selectedCityId.value || ''}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">Select city...</option>
                {citiesForCountry.value.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </>
          )}

          {selectedCityId.value && (
            <>
              <label class="settings-label">Neighborhood</label>
              <div class="neighborhood-list">
                <button
                  class={`neighborhood-item ${activeNeighborhoodId.value === selectedCityId.value ? 'active' : ''}`}
                  onClick={() => setActiveNeighborhood(selectedCityId.value)}
                >
                  <span class="neighborhood-name">All neighborhoods</span>
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
            <h4 class="settings-section-title">Topics</h4>
            {!allTopicsActive.value && (
              <button class="settings-clear-topics" onClick={clearTopicFilters}>
                Clear all
              </button>
            )}
          </div>
          <div class="topic-grid">
            {topics.value.map((t) => (
              <button
                key={t.id}
                class={`topic-grid-chip ${activeTopicIds.value.includes(t.id) ? 'active' : ''}`}
                onClick={() => toggleTopic(t.id)}
              >
                {t.name}
              </button>
            ))}
          </div>
          {allTopicsActive.value && (
            <p class="settings-hint">All topics shown. Tap to filter.</p>
          )}
        </section>

        <section class="settings-section">
          <h4 class="settings-section-title">Theme</h4>
          <div class="theme-picker">
            {['light', 'dark', 'system'].map((val) => (
              <button
                key={val}
                class={`topic-grid-chip ${theme.value === val ? 'active' : ''}`}
                onClick={() => setTheme(val)}
              >
                {val.charAt(0).toUpperCase() + val.slice(1)}
              </button>
            ))}
          </div>
        </section>

        <section class="settings-section">
          <label class="settings-toggle-row">
            <span class="settings-toggle-label">Harmonica Sessions</span>
            <input
              type="checkbox"
              class="settings-toggle-checkbox"
              checked={showSessions.value}
              onChange={(e) => setShowSessions(e.target.checked)}
            />
          </label>
          <p class="settings-hint">Show the sessions panel alongside links.</p>
        </section>
      </div>
    </div>
  );
}
