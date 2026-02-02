import { useEffect, useState } from 'preact/hooks';
import { signal } from '@preact/signals';
import { initAuth } from './store/auth';
import { loadNeighborhoods, filterNeighborhoodIds, locationConfigured } from './store/neighborhoods';
import { loadTopics, activeTopicIds, allTopicsActive } from './store/topics';
import { loadLinks } from './store/links';
import { loadSessions, showSessions } from './store/sessions';
import { initTheme } from './store/theme';
import { uiLanguage, t } from './lib/i18n';
import { contentLanguageFilter } from './store/language';
import { TopBar } from './components/TopBar';
import { LinksFeed } from './components/LinksFeed';
import { SessionsPanel } from './components/SessionsPanel';
import { OnboardingModal } from './components/OnboardingModal';
import './styles/layout.css';

const onboarded = signal(localStorage.getItem('dn_onboarded') === 'true');

export function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initTheme();
    (async () => {
      await Promise.all([
        initAuth(),
        loadNeighborhoods(),
        loadTopics(),
      ]);
      setReady(true);
    })();
  }, []);

  // Reload data when filters change
  useEffect(() => {
    if (!ready) return;
    const neighborhoodIds = filterNeighborhoodIds.value;
    const topicIds = allTopicsActive.value ? [] : activeTopicIds.value;
    const language = contentLanguageFilter.value ? uiLanguage.value : null;

    if (neighborhoodIds.length === 0) return;

    loadLinks({ neighborhoodIds, topicIds, language });
    loadSessions({ neighborhoodIds, topicIds, language });
  }, [ready, filterNeighborhoodIds.value, activeTopicIds.value, contentLanguageFilter.value, uiLanguage.value]);

  if (!ready) {
    return (
      <div class="loading-screen">
        <p>{t('welcome.loading')}</p>
      </div>
    );
  }

  if (!locationConfigured.value && !onboarded.value) {
    return (
      <OnboardingModal onComplete={() => { onboarded.value = true; }} />
    );
  }

  if (!locationConfigured.value) {
    return (
      <div class="app">
        <TopBar />
        <main class="dashboard dashboard--full">
          <div class="welcome-prompt">
            <h2>{t('welcome.title')}</h2>
            <p>{t('welcome.description')}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div class="app">
      <TopBar />
      <main class={`dashboard${showSessions.value ? '' : ' dashboard--full'}`}>
        <section class="dashboard-links">
          <LinksFeed />
        </section>
        {showSessions.value && (
          <section class="dashboard-sessions">
            <SessionsPanel />
          </section>
        )}
      </main>
    </div>
  );
}
