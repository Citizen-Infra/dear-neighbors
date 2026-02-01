import { useEffect, useState } from 'preact/hooks';
import { initAuth } from './store/auth';
import { loadNeighborhoods, activeNeighborhoodId } from './store/neighborhoods';
import { loadTopics, activeTopicIds, allTopicsActive } from './store/topics';
import { loadLinks } from './store/links';
import { loadSessions } from './store/sessions';
import { TopBar } from './components/TopBar';
import { LinksFeed } from './components/LinksFeed';
import { SessionsPanel } from './components/SessionsPanel';
import './styles/layout.css';

export function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
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
    const neighborhoodId = activeNeighborhoodId.value;
    const topicIds = allTopicsActive.value ? [] : activeTopicIds.value;

    loadLinks({ neighborhoodId, topicIds });
    loadSessions({ neighborhoodId, topicIds });
  }, [ready, activeNeighborhoodId.value, activeTopicIds.value]);

  if (!ready) {
    return (
      <div class="loading-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div class="app">
      <TopBar />
      <main class="dashboard">
        <section class="dashboard-links">
          <LinksFeed />
        </section>
        <section class="dashboard-sessions">
          <SessionsPanel />
        </section>
      </main>
    </div>
  );
}
