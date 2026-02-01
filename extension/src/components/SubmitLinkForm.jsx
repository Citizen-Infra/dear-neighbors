import { useState } from 'preact/hooks';
import { submitLink } from '../store/links';
import { activeNeighborhoodId } from '../store/neighborhoods';
import { topics } from '../store/topics';
import '../styles/submit-form.css';

export function SubmitLinkForm({ onClose, onSubmitted }) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  function toggleFormTopic(id) {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim() || !title.trim()) return;

    setSubmitting(true);
    const result = await submitLink({
      url: url.trim(),
      title: title.trim(),
      description: description.trim() || null,
      neighborhoodId: activeNeighborhoodId.value,
      topicIds: selectedTopics,
    });
    setSubmitting(false);

    if (result) {
      onSubmitted();
    }
  }

  return (
    <form class="submit-form" onSubmit={handleSubmit}>
      <div class="submit-form-field">
        <input
          type="url"
          placeholder="URL"
          value={url}
          onInput={(e) => setUrl(e.target.value)}
          required
          autofocus
        />
      </div>
      <div class="submit-form-field">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onInput={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div class="submit-form-field">
        <textarea
          placeholder="Description (optional)"
          value={description}
          onInput={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>
      <div class="submit-form-topics">
        {topics.value.map((t) => (
          <button
            key={t.id}
            type="button"
            class={`topic-chip ${selectedTopics.includes(t.id) ? 'active' : ''}`}
            onClick={() => toggleFormTopic(t.id)}
          >
            {t.name}
          </button>
        ))}
      </div>
      <div class="submit-form-actions">
        <button type="button" class="cancel-button" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" class="submit-button" disabled={submitting}>
          {submitting ? 'Sharing...' : 'Share'}
        </button>
      </div>
    </form>
  );
}
