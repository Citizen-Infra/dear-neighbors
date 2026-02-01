import { useState } from 'preact/hooks';
import { signInWithMagicLink } from '../store/auth';
import '../styles/auth-modal.css';

export function AuthModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;

    setSending(true);
    const success = await signInWithMagicLink(email.trim());
    setSending(false);

    if (success) {
      setSent(true);
    }
  }

  return (
    <div class="modal-overlay" onClick={onClose}>
      <div class="auth-modal" onClick={(e) => e.stopPropagation()}>
        <h3 class="auth-modal-title">Sign in to Dear Neighbors</h3>

        {sent ? (
          <div class="auth-sent">
            <p>Check your email for a magic link!</p>
            <p class="auth-sent-email">{email}</p>
            <p class="auth-spam-hint">Not seeing it? Check your spam folder.</p>
            <button class="auth-close-button" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p class="auth-description">
              Sign in to share links and upvote posts from your neighbors.
            </p>
            <input
              type="email"
              class="auth-input"
              placeholder="your@email.com"
              value={email}
              onInput={(e) => setEmail(e.target.value)}
              required
              autofocus
            />
            <button type="submit" class="auth-submit" disabled={sending}>
              {sending ? 'Sending...' : 'Send magic link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
