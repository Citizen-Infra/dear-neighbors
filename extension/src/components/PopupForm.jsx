import { useState, useEffect } from 'preact/hooks';
import { supabase } from '../lib/supabase';

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
        setTitle(tabResult.title || '');
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
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim() });
    setSendingLink(false);
    if (error) {
      setError(error.message);
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
    return <div class="popup-loading">Loading...</div>;
  }

  if (success) {
    return (
      <div class="popup-success">
        <span class="popup-checkmark">&#10003;</span>
        <p>Shared with neighbors!</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div class="popup-auth">
        <h2 class="popup-title">Dear Neighbors</h2>
        {magicLinkSent ? (
          <div class="popup-magic-sent">
            <p>Check your email for a magic link!</p>
            <p class="popup-magic-email">{email}</p>
          </div>
        ) : (
          <form onSubmit={handleSignIn}>
            <p class="popup-auth-desc">Sign in to share links with your neighbors.</p>
            <input
              type="email"
              class="popup-input"
              placeholder="your@email.com"
              value={email}
              onInput={(e) => setEmail(e.target.value)}
              required
              autofocus
            />
            <button type="submit" class="popup-submit" disabled={sendingLink}>
              {sendingLink ? 'Sending...' : 'Send magic link'}
            </button>
          </form>
        )}
        {error && <p class="popup-error">{error}</p>}
      </div>
    );
  }

  return (
    <div class="popup-form">
      <h2 class="popup-title">Share with Neighbors</h2>
      <form onSubmit={handleSubmit}>
        <div class="popup-field">
          <label>URL</label>
          <input
            type="url"
            class="popup-input"
            value={url}
            onInput={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <div class="popup-field">
          <label>Title</label>
          <input
            type="text"
            class="popup-input"
            value={title}
            onInput={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div class="popup-field">
          <label>Description <span class="popup-optional">(optional)</span></label>
          <textarea
            class="popup-input popup-textarea"
            value={description}
            onInput={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Why is this relevant?"
          />
        </div>
        <div class="popup-field">
          <label>Country</label>
          <select
            class="popup-input popup-select"
            value={countryId}
            onChange={(e) => handleCountryChange(e.target.value)}
            required
          >
            <option value="">Select country...</option>
            {countriesList.map((n) => (
              <option key={n.id} value={n.id}>{n.name}</option>
            ))}
          </select>
        </div>
        {countryId && (
          <div class="popup-field">
            <label>City</label>
            <select
              class="popup-input popup-select"
              value={cityId}
              onChange={(e) => handleCityChange(e.target.value)}
              required
            >
              <option value="">Select city...</option>
              {citiesList.map((n) => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </select>
          </div>
        )}
        {cityId && (
          <div class="popup-field">
            <label>Neighborhood</label>
            <select
              class="popup-input popup-select"
              value={neighborhoodId}
              onChange={(e) => setNeighborhoodId(e.target.value)}
              required
            >
              <option value={cityId}>All neighborhoods</option>
              {mzList.map((n) => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </select>
          </div>
        )}
        <div class="popup-field">
          <label>Topics</label>
          <div class="popup-topics">
            {topics.map((t) => (
              <button
                key={t.id}
                type="button"
                class={`popup-topic-chip ${selectedTopics.includes(t.id) ? 'active' : ''}`}
                onClick={() => toggleTopic(t.id)}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
        {error && <p class="popup-error">{error}</p>}
        <button type="submit" class="popup-submit" disabled={submitting}>
          {submitting ? 'Sharing...' : 'Share'}
        </button>
      </form>
    </div>
  );
}
