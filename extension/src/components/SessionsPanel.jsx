import { activeSessions, upcomingSessions, completedSessions, sessionsLoading } from '../store/sessions';
import { t } from '../lib/i18n';
import '../styles/sessions.css';

export function SessionsPanel() {
  if (sessionsLoading.value) {
    return (
      <div class="sessions-panel">
        <h2 class="section-title">{t('sessions.title')}</h2>
        <div class="sessions-empty">{t('sessions.loading')}</div>
      </div>
    );
  }

  const active = activeSessions.value;
  const upcoming = upcomingSessions.value;
  const completed = completedSessions.value;
  const hasAny = active.length + upcoming.length + completed.length > 0;

  return (
    <div class="sessions-panel">
      <h2 class="section-title">{t('sessions.title')}</h2>

      {!hasAny ? (
        <div class="sessions-empty">
          {t('sessions.empty')}
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <SessionGroup title={t('sessions.happeningNow')} sessions={active} status="active" />
          )}
          {upcoming.length > 0 && (
            <SessionGroup title={t('sessions.comingUp')} sessions={upcoming} status="upcoming" />
          )}
          {completed.length > 0 && (
            <SessionGroup title={t('sessions.recentlyCompleted')} sessions={completed} status="completed" />
          )}
        </>
      )}
    </div>
  );
}

function SessionGroup({ title, sessions, status }) {
  return (
    <div class="session-group">
      <h3 class={`session-group-title status-${status}`}>{title}</h3>
      <div class="session-list">
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} status={status} />
        ))}
      </div>
    </div>
  );
}

const SOURCE_LABELS = {
  luma: 'Luma',
  telegram: 'Telegram',
  session: 'Session',
};

function SessionCard({ session, status }) {
  const timeStr = session.starts_at
    ? new Date(session.starts_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const href = session.source === 'session'
    ? `https://harmonica.chat/session/${session.harmonica_session_id}`
    : session.url;

  const sourceLabel = SOURCE_LABELS[session.source] || session.source;

  return (
    <a
      class={`session-card status-${status}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div class="session-card-header">
        <div class="session-card-meta">
          <span class={`session-status-badge status-${status}`}>
            {status === 'active' ? t('sessions.live') : status === 'upcoming' ? t('sessions.upcoming') : t('sessions.done')}
          </span>
          {session.source && session.source !== 'session' && (
            <span class={`session-source-badge source-${session.source}`}>{sourceLabel}</span>
          )}
        </div>
        {timeStr && <span class="session-time">{timeStr}</span>}
      </div>
      <h4 class="session-title">{session.title}</h4>
      {session.description && (
        <p class="session-description">{session.description}</p>
      )}
      {session.location && (
        <p class="session-location">{session.location}</p>
      )}
      {session.topic_names?.length > 0 && (
        <div class="session-tags">
          {session.topic_names.map((name) => (
            <span key={name} class="session-tag">{name}</span>
          ))}
        </div>
      )}
    </a>
  );
}
