import { useEffect, useState } from 'preact/hooks';
import { initAuth } from './store/auth';
import { loadNeighborhoods, filterNeighborhoodIds, locationConfigured } from './store/neighborhoods';
import { loadTopics, activeTopicIds, allTopicsActive } from './store/topics';
import { loadLinks } from './store/links';
import { loadSessions, showSessions } from './store/sessions';
import { initTheme } from './store/theme';
import { TopBar } from './components/TopBar';
import { LinksFeed } from './components/LinksFeed';
import { SessionsPanel } from './components/SessionsPanel';
import './styles/layout.css';

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

    if (neighborhoodIds.length === 0) return;

    loadLinks({ neighborhoodIds, topicIds });
    loadSessions({ neighborhoodIds, topicIds });
  }, [ready, filterNeighborhoodIds.value, activeTopicIds.value]);

  if (!ready) {
    return (
      <div class="loading-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!locationConfigured.value) {
    return (
      <div class="app">
        <TopBar />
        <main class="dashboard dashboard--full">
          <div class="welcome-prompt">
            <h2>Welcome to Dear Neighbors</h2>
            <p>Open Settings (gear icon) to pick your country and city to get started.</p>
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
