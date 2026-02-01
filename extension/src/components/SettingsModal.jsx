import { neighborhoods, activeNeighborhood, setActiveNeighborhood } from '../store/neighborhoods';
import { topics, activeTopicIds, toggleTopic, clearTopicFilters, allTopicsActive } from '../store/topics';
import { showSessions, setShowSessions } from '../store/sessions';
import { theme, setTheme } from '../store/theme';
import '../styles/settings-modal.css';

export function SettingsModal({ onClose }) {
  const current = activeNeighborhood.value;

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
          <h4 class="settings-section-title">Neighborhood</h4>
          <div class="neighborhood-list">
            {neighborhoods.value.map((n) => (
              <button
                key={n.id}
                class={`neighborhood-item ${n.id === current?.id ? 'active' : ''}`}
                onClick={() => setActiveNeighborhood(n.id)}
              >
                <span class="neighborhood-type-badge">{n.type === 'city' ? 'City' : 'MZ'}</span>
                <span class="neighborhood-name">{n.name}</span>
                {n.id === current?.id && <span class="neighborhood-check">&#10003;</span>}
              </button>
            ))}
          </div>
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
