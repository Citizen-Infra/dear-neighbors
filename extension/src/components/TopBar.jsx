import { useState, useRef, useEffect } from 'preact/hooks';
import { activeNeighborhood, neighborhoods, selectedCityId, selectedCountryId } from '../store/neighborhoods';
import { activeTopicIds, allTopicsActive } from '../store/topics';
import { user, isSignedIn, showAuthModal, signOut } from '../store/auth';
import { t } from '../lib/i18n';
import { AuthModal } from './AuthModal';
import { SettingsModal } from './SettingsModal';
import { EnvBadges } from './EnvBadges';
import '../styles/topbar.css';

export function TopBar() {
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const neighborhood = activeNeighborhood.value;
  const topicCount = activeTopicIds.value.length;

  // Build breadcrumb from hierarchy
  let neighborhoodLabel = t('topbar.chooseLocation');
  if (neighborhood) {
    const all = neighborhoods.value;
    if (neighborhood.type === 'neighborhood') {
      const city = all.find((n) => n.id === neighborhood.parent_id);
      neighborhoodLabel = city ? `${city.name} / ${neighborhood.name}` : neighborhood.name;
    } else if (neighborhood.type === 'city') {
      const country = all.find((n) => n.id === neighborhood.parent_id);
      neighborhoodLabel = country ? `${country.name} / ${neighborhood.name}` : neighborhood.name;
    } else {
      neighborhoodLabel = neighborhood.name;
    }
  }
  const topicLabel = allTopicsActive.value
    ? t('topbar.allTopics')
    : t('topbar.topicCount', { count: topicCount, s: topicCount !== 1 ? 's' : '' });

  return (
    <header class="topbar">
      <div class="topbar-inner">
        <div class="topbar-brand">
          <h1 class="topbar-title">{t('topbar.title')}</h1>
        </div>

        <button class="topbar-filter-summary" onClick={() => setShowSettings(true)}>
          {neighborhoodLabel}
          <span class="topbar-filter-dot" />
          {topicLabel}
        </button>

        <div class="topbar-actions">
          <EnvBadges />
          <button
            class="topbar-gear"
            onClick={() => setShowSettings(true)}
            aria-label="Settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>

          {isSignedIn.value ? (
            <div class="user-menu-wrapper" ref={userMenuRef}>
              <button
                class="user-avatar"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {user.value.email[0].toUpperCase()}
              </button>
              {showUserMenu && (
                <div class="user-dropdown">
                  <div class="user-email">{user.value.email}</div>
                  <button class="user-dropdown-item" onClick={signOut}>
                    {t('topbar.signOut')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button class="sign-in-button" onClick={() => showAuthModal.value = true}>
              {t('topbar.signIn')}
            </button>
          )}
        </div>
      </div>

      {showAuthModal.value && <AuthModal onClose={() => showAuthModal.value = false} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </header>
  );
}
