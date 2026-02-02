import { useState, useEffect, useRef } from 'preact/hooks';
import { submitLink } from '../store/links';
import { activeNeighborhoodId } from '../store/neighborhoods';
import { topics } from '../store/topics';
import { t } from '../lib/i18n';
import { detectLanguage } from '../lib/detect-language';
import '../styles/submit-form.css';
import '../styles/language.css';

export function SubmitLinkForm({ onClose, onSubmitted }) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [language, setLanguage] = useState('en');
  const [submitting, setSubmitting] = useState(false);
  const [fetching, setFetching] = useState(false);
  const titleTouched = useRef(false);
  const descTouched = useRef(false);
  const languageTouched = useRef(false);

  useEffect(() => {
    if (!url.trim()) return;
    try { new URL(url); } catch { return; }

    setFetching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(url);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        let fetchedTitle = '';
        let fetchedDesc = '';

        if (!titleTouched.current) {
          const ogTitle = doc.querySelector('meta[property="og:title"]')?.content;
          const pageTitle = doc.querySelector('title')?.textContent;
          const found = ogTitle || pageTitle;
          if (found) {
            fetchedTitle = found.trim();
            setTitle(fetchedTitle);
          }
        }

        if (!descTouched.current) {
          const ogDesc = doc.querySelector('meta[property="og:description"]')?.content;
          const metaDesc = doc.querySelector('meta[name="description"]')?.content;
          const found = ogDesc || metaDesc;
          if (found) {
            fetchedDesc = found.trim();
            setDescription(fetchedDesc);
          }
        }

        if (!languageTouched.current) {
          const detected = detectLanguage(fetchedTitle + ' ' + fetchedDesc);
          setLanguage(detected);
        }
      } catch {
        // silent — CORS, offline, etc.
      } finally {
        setFetching(false);
      }
    }, 500);

    return () => { clearTimeout(timer); setFetching(false); };
  }, [url]);

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
      language,
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
          placeholder={t('submit.url')}
          value={url}
          onInput={(e) => setUrl(e.target.value)}
          required
          autofocus
        />
        {fetching && <span class="url-fetching-hint">{t('submit.fetching')}</span>}
      </div>
      <div class="submit-form-field">
        <input
          type="text"
          placeholder={t('submit.title')}
          value={title}
          onInput={(e) => { titleTouched.current = true; setTitle(e.target.value); }}
          required
        />
      </div>
      <div class="submit-form-field">
        <textarea
          placeholder={t('submit.description')}
          value={description}
          onInput={(e) => { descTouched.current = true; setDescription(e.target.value); }}
          rows={2}
        />
      </div>
      <div class="submit-form-topics">
        {topics.value.map((tp) => (
          <button
            key={tp.id}
            type="button"
            class={`topic-chip ${selectedTopics.includes(tp.id) ? 'active' : ''}`}
            onClick={() => toggleFormTopic(tp.id)}
          >
            {tp.name}
          </button>
        ))}
      </div>
      <div class="submit-form-field">
        <label class="settings-label">{t('submit.language')}</label>
        <div class="lang-switch lang-switch--compact">
          <button
            type="button"
            class={`lang-switch-option ${language === 'en' ? 'active' : ''}`}
            onClick={() => { languageTouched.current = true; setLanguage('en'); }}
          >
            <span class="lang-glyph">A</span>
            English
          </button>
          <button
            type="button"
            class={`lang-switch-option ${language === 'sr' ? 'active' : ''}`}
            onClick={() => { languageTouched.current = true; setLanguage('sr'); }}
          >
            <span class="lang-glyph">{'\u0416'}</span>
            Srpski
          </button>
        </div>
      </div>
      <div class="submit-form-actions">
        <button type="button" class="cancel-button" onClick={onClose}>
          {t('submit.cancel')}
        </button>
        <button type="submit" class="submit-button" disabled={submitting}>
          {submitting ? t('submit.sharing') : t('submit.share')}
        </button>
      </div>
    </form>
  );
}
