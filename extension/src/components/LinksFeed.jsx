import { useState } from 'preact/hooks';
import { links, linksLoading, linksHasMore, linksPage, loadLinks, toggleVote, deleteLink } from '../store/links';
import { filterNeighborhoodIds } from '../store/neighborhoods';
import { activeTopicIds, allTopicsActive } from '../store/topics';
import { user, isSignedIn, isAdmin } from '../store/auth';
import { SubmitLinkForm } from './SubmitLinkForm';
import '../styles/links.css';

export function LinksFeed() {
  const [sort, setSort] = useState('hot');
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  function handleSort(newSort) {
    setSort(newSort);
    loadLinks({
      neighborhoodIds: filterNeighborhoodIds.value,
      topicIds: allTopicsActive.value ? [] : activeTopicIds.value,
      sort: newSort,
    });
  }

  function handleLoadMore() {
    loadLinks({
      neighborhoodIds: filterNeighborhoodIds.value,
      topicIds: allTopicsActive.value ? [] : activeTopicIds.value,
      sort,
      page: linksPage.value + 1,
      append: true,
    });
  }

  async function handleVote(linkId) {
    if (!isSignedIn.value) return;
    await toggleVote(linkId);
    // Reload to get updated counts
    loadLinks({
      neighborhoodIds: filterNeighborhoodIds.value,
      topicIds: allTopicsActive.value ? [] : activeTopicIds.value,
      sort,
    });
  }

  async function handleDelete(linkId) {
    const ok = await deleteLink(linkId);
    if (ok) {
      loadLinks({
        neighborhoodIds: filterNeighborhoodIds.value,
        topicIds: allTopicsActive.value ? [] : activeTopicIds.value,
        sort,
      });
    }
  }

  return (
    <div class="links-feed">
      <div class="links-header">
        <h2 class="section-title">Community Links</h2>
        <div class="links-controls">
          <div class="sort-tabs">
            <button
              class={`sort-tab ${sort === 'hot' ? 'active' : ''}`}
              onClick={() => handleSort('hot')}
            >
              Hot
            </button>
            <button
              class={`sort-tab ${sort === 'new' ? 'active' : ''}`}
              onClick={() => handleSort('new')}
            >
              New
            </button>
          </div>
          <button
            class="submit-link-button"
            onClick={() => {
              if (!isSignedIn.value) return;
              setShowSubmitForm(!showSubmitForm);
            }}
            title={isSignedIn.value ? 'Share a link' : 'Sign in to share links'}
          >
            + Share a link
          </button>
        </div>
      </div>

      {showSubmitForm && (
        <SubmitLinkForm onClose={() => setShowSubmitForm(false)} onSubmitted={() => {
          setShowSubmitForm(false);
          loadLinks({
            neighborhoodIds: filterNeighborhoodIds.value,
            topicIds: allTopicsActive.value ? [] : activeTopicIds.value,
            sort,
          });
        }} />
      )}

      {linksLoading.value && links.value.length === 0 ? (
        <div class="links-empty">Loading links...</div>
      ) : links.value.length === 0 ? (
        <div class="links-empty">
          No links shared yet. Be the first to share something with your neighbors!
        </div>
      ) : (
        <div class="links-list">
          {links.value.map((link) => (
            <LinkCard key={link.id} link={link} onVote={handleVote} onDelete={handleDelete} />
          ))}
          {linksHasMore.value && (
            <button class="load-more" onClick={handleLoadMore} disabled={linksLoading.value}>
              {linksLoading.value ? 'Loading...' : 'Load more'}
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
          class={`vote-button ${link.user_voted ? 'voted' : ''}`}
          onClick={() => onVote(link.id)}
          title={isSignedIn.value ? 'Upvote' : 'Sign in to vote'}
        >
          &#9650;
        </button>
        <span class="vote-count">{link.vote_count || 0}</span>
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
