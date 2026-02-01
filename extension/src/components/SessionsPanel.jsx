import { activeSessions, upcomingSessions, completedSessions, sessionsLoading } from '../store/sessions';
import '../styles/sessions.css';

export function SessionsPanel() {
  if (sessionsLoading.value) {
    return (
      <div class="sessions-panel">
        <h2 class="section-title">Harmonica Sessions</h2>
        <div class="sessions-empty">Loading sessions...</div>
      </div>
    );
  }

  const active = activeSessions.value;
  const upcoming = upcomingSessions.value;
  const completed = completedSessions.value;
  const hasAny = active.length + upcoming.length + completed.length > 0;

  return (
    <div class="sessions-panel">
      <h2 class="section-title">Harmonica Sessions</h2>

      {!hasAny ? (
        <div class="sessions-empty">
          No sessions found for this neighborhood and topics.
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <SessionGroup title="Happening Now" sessions={active} status="active" />
          )}
          {upcoming.length > 0 && (
            <SessionGroup title="Coming Up" sessions={upcoming} status="upcoming" />
          )}
          {completed.length > 0 && (
            <SessionGroup title="Recently Completed" sessions={completed} status="completed" />
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

function SessionCard({ session, status }) {
  const timeStr = session.starts_at
    ? new Date(session.starts_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <a
      class={`session-card status-${status}`}
      href={`https://harmonica.chat/session/${session.harmonica_session_id}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div class="session-card-header">
        <span class={`session-status-badge status-${status}`}>
          {status === 'active' ? 'Live' : status === 'upcoming' ? 'Upcoming' : 'Done'}
        </span>
        {timeStr && <span class="session-time">{timeStr}</span>}
      </div>
      <h4 class="session-title">{session.title}</h4>
      {session.description && (
        <p class="session-description">{session.description}</p>
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
