import { useState } from 'preact/hooks';
import { links, linksLoading, linksHasMore, linksPage, loadLinks, toggleVote, deleteLink } from '../store/links';
import { filterNeighborhoodIds } from '../store/neighborhoods';
import { activeTopicIds, allTopicsActive } from '../store/topics';
import { user, isSignedIn, isAdmin, showAuthModal } from '../store/auth';
import { uiLanguage, t } from '../lib/i18n';
import { contentLanguageFilter } from '../store/language';
import { SubmitLinkForm } from './SubmitLinkForm';
import '../styles/links.css';

export function LinksFeed() {
  const [sort, setSort] = useState('hot');
  const [topRange, setTopRange] = useState('all');
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  function handleSort(newSort, range) {
    setSort(newSort);
    const r = range ?? topRange;
    if (newSort === 'top') setTopRange(r);
    loadLinks({
      neighborhoodIds: filterNeighborhoodIds.value,
      topicIds: allTopicsActive.value ? [] : activeTopicIds.value,
      sort: newSort,
      topRange: newSort === 'top' ? r : undefined,
      language: contentLanguageFilter.value ? uiLanguage.value : null,
    });
  }

  function reloadOpts(overrides = {}) {
    return {
      neighborhoodIds: filterNeighborhoodIds.value,
      topicIds: allTopicsActive.value ? [] : activeTopicIds.value,
      sort,
      topRange: sort === 'top' ? topRange : undefined,
      language: contentLanguageFilter.value ? uiLanguage.value : null,
      ...overrides,
    };
  }

  function handleLoadMore() {
    loadLinks(reloadOpts({ page: linksPage.value + 1, append: true }));
  }

  async function handleVote(linkId) {
    if (!isSignedIn.value) { showAuthModal.value = true; return; }
    await toggleVote(linkId);
    loadLinks(reloadOpts());
  }

  async function handleDelete(linkId) {
    const ok = await deleteLink(linkId);
    if (ok) loadLinks(reloadOpts());
  }

  return (
    <div class="links-feed">
      <div class="links-header">
        <h2 class="section-title">{t('links.title')}</h2>
        <div class="links-controls">
          <div class="sort-tabs">
            <button
              class={`sort-tab ${sort === 'hot' ? 'active' : ''}`}
              onClick={() => handleSort('hot')}
            >
              {t('links.hot')}
            </button>
            <button
              class={`sort-tab ${sort === 'top' ? 'active' : ''}`}
              onClick={() => handleSort('top')}
            >
              {t('links.top')}
            </button>
            <button
              class={`sort-tab ${sort === 'new' ? 'active' : ''}`}
              onClick={() => handleSort('new')}
            >
              {t('links.new')}
            </button>
          </div>
          {sort === 'top' && (
            <div class="top-range-tabs">
              {[['week', t('links.week')], ['year', t('links.year')], ['all', t('links.all')]].map(([val, label]) => (
                <button
                  key={val}
                  class={`top-range-tab ${topRange === val ? 'active' : ''}`}
                  onClick={() => handleSort('top', val)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          <button
            class="submit-link-button"
            onClick={() => {
              if (!isSignedIn.value) { showAuthModal.value = true; return; }
              setShowSubmitForm(!showSubmitForm);
            }}
            title={isSignedIn.value ? t('links.share') : t('topbar.signIn')}
          >
            {t('links.share')}
          </button>
        </div>
      </div>

      {showSubmitForm && (
        <SubmitLinkForm onClose={() => setShowSubmitForm(false)} onSubmitted={() => {
          setShowSubmitForm(false);
          loadLinks(reloadOpts());
        }} />
      )}

      {linksLoading.value && links.value.length === 0 ? (
        <div class="links-empty">{t('links.loading')}</div>
      ) : links.value.length === 0 ? (
        <div class="links-empty">
          {t('links.empty')}
        </div>
      ) : (
        <div class="links-list">
          {links.value.map((link) => (
            <LinkCard key={link.id} link={link} onVote={handleVote} onDelete={handleDelete} />
          ))}
          {linksHasMore.value && (
            <button class="load-more" onClick={handleLoadMore} disabled={linksLoading.value}>
              {linksLoading.value ? t('links.loadingMore') : t('links.loadMore')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function LinkCard({ link, onVote, onDelete }) {
  const domain = getDomain(link.url);
  const timeAgo = getTimeAgo(link.created_at);
  const canDelete = isAdmin.value || (user.value && link.submitted_by === user.value.id);

  return (
    <article class="link-card">
      <div class="link-vote">
        <button
          class={`vote-button upvote ${link.user_voted ? 'voted' : ''}`}
          onClick={() => !link.user_voted && onVote(link.id)}
          title={!isSignedIn.value ? t('topbar.signIn') : link.user_voted ? 'Already voted' : 'Upvote'}
          disabled={link.user_voted}
        >
          &#9650;
        </button>
        <span class="vote-count">{link.vote_count || 0}</span>
        <button
          class={`vote-button downvote ${link.user_voted ? '' : 'hidden'}`}
          onClick={() => link.user_voted && onVote(link.id)}
          title="Remove vote"
        >
          &#9660;
        </button>
      </div>
      <div class="link-content">
        <a class="link-title" href={link.url} target="_blank" rel="noopener noreferrer">
          {link.title}
        </a>
        <span class="link-domain">{domain}</span>
        {link.description && <p class="link-description">{link.description}</p>}
        <div class="link-meta">
          <span class="link-time">{timeAgo}</span>
          {link.submitter_name && (
            <span class="link-author">by {link.submitter_name}</span>
          )}
          {link.topic_names?.length > 0 && (
            <div class="link-tags">
              {link.topic_names.map((name) => (
                <span key={name} class="link-tag">{name}</span>
              ))}
            </div>
          )}
          {canDelete && (
            <button class="link-delete" onClick={() => onDelete(link.id)} title="Delete link">
              &times;
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function getDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

function getTimeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}
