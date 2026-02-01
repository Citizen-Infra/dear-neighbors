import { useState, useRef, useEffect } from 'preact/hooks';
import { neighborhoods, activeNeighborhood, setActiveNeighborhood } from '../store/neighborhoods';
import { topics, activeTopicIds, toggleTopic, clearTopicFilters, allTopicsActive } from '../store/topics';
import { user, isSignedIn, signOut } from '../store/auth';
import { AuthModal } from './AuthModal';
import '../styles/topbar.css';

export function TopBar() {
  const [showNeighborhoodDropdown, setShowNeighborhoodDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const neighborhoodRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (neighborhoodRef.current && !neighborhoodRef.current.contains(e.target)) {
        setShowNeighborhoodDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = activeNeighborhood.value;

  return (
    <header class="topbar">
      <div class="topbar-inner">
        <div class="topbar-brand">
          <h1 class="topbar-title">Dear Neighbors</h1>
        </div>

        <div class="topbar-center">
          <div class="neighborhood-selector" ref={neighborhoodRef}>
            <button
              class="neighborhood-button"
              onClick={() => setShowNeighborhoodDropdown(!showNeighborhoodDropdown)}
            >
              {current ? current.name : 'Select neighborhood'}
              <span class="dropdown-arrow">&#9662;</span>
            </button>
            {showNeighborhoodDropdown && (
              <div class="neighborhood-dropdown">
                {neighborhoods.value.map((n) => (
                  <button
                    key={n.id}
                    class={`neighborhood-option ${n.id === current?.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveNeighborhood(n.id);
                      setShowNeighborhoodDropdown(false);
                    }}
                  >
                    <span class="neighborhood-type">{n.type === 'city' ? 'City' : 'MZ'}</span>
                    {n.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div class="topic-chips">
            <button
              class={`topic-chip ${allTopicsActive.value ? 'active' : ''}`}
              onClick={clearTopicFilters}
            >
              All
            </button>
            {topics.value.map((t) => (
              <button
                key={t.id}
                class={`topic-chip ${activeTopicIds.value.includes(t.id) ? 'active' : ''}`}
                onClick={() => toggleTopic(t.id)}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <div class="topbar-auth">
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
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button class="sign-in-button" onClick={() => setShowAuthModal(true)}>
              Sign in
            </button>
          )}
        </div>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </header>
  );
}
