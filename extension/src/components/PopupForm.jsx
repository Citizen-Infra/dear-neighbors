import { useState, useEffect } from 'preact/hooks';
import { supabase } from '../lib/supabase';
import { t } from '../lib/i18n';
import { detectLanguage } from '../lib/detect-language';

export function PopupForm() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [allNeighborhoods, setAllNeighborhoods] = useState([]);
  const [topics, setTopics] = useState([]);

  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [countryId, setCountryId] = useState(
    localStorage.getItem('dn_country') || ''
  );
  const [cityId, setCityId] = useState(
    localStorage.getItem('dn_city') || ''
  );
  const [neighborhoodId, setNeighborhoodId] = useState(
    localStorage.getItem('dn_neighborhood') || ''
  );
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [language, setLanguage] = useState(
    localStorage.getItem('dn_ui_language') || 'en'
  );

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Auth: magic link
  const [email, setEmail] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [sendingLink, setSendingLink] = useState(false);

  // Derived lists
  const countriesList = allNeighborhoods.filter((n) => n.type === 'country');
  const citiesList = allNeighborhoods.filter(
    (n) => n.type === 'city' && n.parent_id === countryId
  );
  const mzList = allNeighborhoods.filter(
    (n) => n.type === 'neighborhood' && n.parent_id === cityId
  );

  useEffect(() => {
    (async () => {
      const [authResult, tabResult, neighborhoodsResult, topicsResult] = await Promise.all([
        supabase.auth.getSession(),
        new Promise((resolve) => {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            resolve(tabs[0] || null);
          });
        }),
        supabase.from('neighborhoods').select('*').order('type').order('name'),
        supabase.from('topics').select('*').order('name'),
      ]);

      setUser(authResult.data.session?.user || null);

      if (tabResult) {
        setUrl(tabResult.url || '');
        const tabTitle = tabResult.title || '';
        setTitle(tabTitle);
        const detected = detectLanguage(tabTitle);
        setLanguage(detected);
      }

      if (neighborhoodsResult.data) {
        setAllNeighborhoods(neighborhoodsResult.data);
        // Default: if no preference, pick first country/city
        if (!countryId && neighborhoodsResult.data.length > 0) {
          const country = neighborhoodsResult.data.find((n) => n.type === 'country');
          if (country) {
            setCountryId(country.id);
            const city = neighborhoodsResult.data.find(
              (n) => n.type === 'city' && n.parent_id === country.id
            );
            if (city) {
              setCityId(city.id);
              setNeighborhoodId(city.id);
            }
          }
        }
      }

      if (topicsResult.data) {
        setTopics(topicsResult.data);
      }

      setLoading(false);
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  function handleCountryChange(id) {
    setCountryId(id);
    setCityId('');
    setNeighborhoodId('');
  }

  function handleCityChange(id) {
    setCityId(id);
    setNeighborhoodId(id); // default to "all neighborhoods" = city
  }

  function toggleTopic(id) {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  async function handleSignIn(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setSendingLink(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim() });
    setSendingLink(false);
    if (error) {
      setError(error.status === 429
        ? t('auth.tooMany')
        : error.message);
    } else {
      setMagicLinkSent(true);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim() || !title.trim() || !neighborhoodId) return;

    setSubmitting(true);
    setError(null);

    const { data, error: insertError } = await supabase
      .from('links')
      .insert({
        url: url.trim(),
        title: title.trim(),
        description: description.trim() || null,
        neighborhood_id: neighborhoodId,
        submitted_by: user.id,
        language,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    if (selectedTopics.length > 0) {
      await supabase.from('link_topics').insert(
        selectedTopics.map((topicId) => ({ link_id: data.id, topic_id: topicId }))
      );
    }

    setSubmitting(false);
    setSuccess(true);

    setTimeout(() => window.close(), 1500);
  }

  if (loading) {
    return <div class="popup-loading">{t('popup.loading')}</div>;
  }

  if (success) {
    return (
      <div class="popup-success">
        <span class="popup-checkmark">&#10003;</span>
        <p>{t('popup.success')}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div class="popup-auth">
        <h2 class="popup-title">{t('popup.title')}</h2>
        {magicLinkSent ? (
          <div class="popup-magic-sent">
            <p>{t('popup.checkEmail')}</p>
            <p class="popup-magic-email">{email}</p>
            <p class="popup-spam-hint">{t('popup.spamHint')}</p>
          </div>
        ) : (
          <form onSubmit={handleSignIn}>
            <p class="popup-auth-desc">{t('popup.signInDesc')}</p>
            <input
              type="email"
              class="popup-input"
              placeholder={t('auth.placeholder')}
              value={email}
              onInput={(e) => setEmail(e.target.value)}
              required
              autofocus
            />
            <button type="submit" class="popup-submit" disabled={sendingLink}>
              {sendingLink ? t('popup.sending') : t('popup.send')}
            </button>
          </form>
        )}
        {error && <p class="popup-error">{error}</p>}
      </div>
    );
  }

  return (
    <div class="popup-form">
      <h2 class="popup-title">{t('popup.shareTitle')}</h2>
      <form onSubmit={handleSubmit}>
        <div class="popup-field">
          <label>{t('popup.url')}</label>
          <input
            type="url"
            class="popup-input"
            value={url}
            onInput={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <div class="popup-field">
          <label>{t('popup.titleField')}</label>
          <input
            type="text"
            class="popup-input"
            value={title}
            onInput={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div class="popup-field">
          <label>{t('popup.descriptionField')} <span class="popup-optional">{t('popup.optional')}</span></label>
          <textarea
            class="popup-input popup-textarea"
            value={description}
            onInput={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder={t('popup.descPlaceholder')}
          />
        </div>
        <div class="popup-field">
          <label>{t('popup.country')}</label>
          <select
            class="popup-input popup-select"
            value={countryId}
            onChange={(e) => handleCountryChange(e.target.value)}
            required
          >
            <option value="">{t('popup.selectCountry')}</option>
            {countriesList.map((n) => (
              <option key={n.id} value={n.id}>{n.name}</option>
            ))}
          </select>
        </div>
        {countryId && (
          <div class="popup-field">
            <label>{t('popup.city')}</label>
            <select
              class="popup-input popup-select"
              value={cityId}
              onChange={(e) => handleCityChange(e.target.value)}
              required
            >
              <option value="">{t('popup.selectCity')}</option>
              {citiesList.map((n) => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </select>
          </div>
        )}
        {cityId && (
          <div class="popup-field">
            <label>{t('popup.neighborhood')}</label>
            <select
              class="popup-input popup-select"
              value={neighborhoodId}
              onChange={(e) => setNeighborhoodId(e.target.value)}
              required
            >
              <option value={cityId}>{t('popup.allNeighborhoods')}</option>
              {mzList.map((n) => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </select>
          </div>
        )}
        <div class="popup-field">
          <label>{t('popup.topics')}</label>
          <div class="popup-topics">
            {topics.map((tp) => (
              <button
                key={tp.id}
                type="button"
                class={`popup-topic-chip ${selectedTopics.includes(tp.id) ? 'active' : ''}`}
                onClick={() => toggleTopic(tp.id)}
              >
                {tp.name}
              </button>
            ))}
          </div>
        </div>
        <div class="popup-field">
          <label>{t('popup.language')}</label>
          <div class="popup-topics">
            <button
              type="button"
              class={`popup-topic-chip ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              English
            </button>
            <button
              type="button"
              class={`popup-topic-chip ${language === 'sr' ? 'active' : ''}`}
              onClick={() => setLanguage('sr')}
            >
              Srpski
            </button>
          </div>
        </div>
        {error && <p class="popup-error">{error}</p>}
        <button type="submit" class="popup-submit" disabled={submitting}>
          {submitting ? t('popup.sharing') : t('popup.share')}
        </button>
      </form>
    </div>
  );
}
