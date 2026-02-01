import { signal } from '@preact/signals';
import { supabase } from '../lib/supabase';

export const links = signal([]);
export const linksLoading = signal(false);
export const linksPage = signal(1);
export const linksHasMore = signal(true);

const PAGE_SIZE = 20;

export async function loadLinks({ neighborhoodIds = [], topicIds = [], sort = 'hot', page = 1, append = false }) {
  linksLoading.value = true;

  let query = supabase
    .from('links_with_votes')
    .select('*');

  if (neighborhoodIds.length > 0) {
    query = query.in('neighborhood_id', neighborhoodIds);
  }

  if (topicIds.length > 0) {
    query = query.contains('topic_ids', topicIds);
  }

  if (sort === 'new') {
    query = query.order('created_at', { ascending: false });
  } else {
    query = query.order('hot_score', { ascending: false });
  }

  query = query.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  const { data, error } = await query;

  if (error) {
    console.error('Failed to load links:', error);
    linksLoading.value = false;
    return;
  }

  if (append) {
    links.value = [...links.value, ...data];
  } else {
    links.value = data;
  }

  linksPage.value = page;
  linksHasMore.value = data.length === PAGE_SIZE;
  linksLoading.value = false;
}

export async function submitLink({ url, title, description, neighborhoodId, topicIds }) {
  const { data, error } = await supabase
    .from('links')
    .insert({ url, title, description, neighborhood_id: neighborhoodId })
    .select()
    .single();

  if (error) {
    console.error('Failed to submit link:', error);
    return null;
  }

  // Insert topic associations
  if (topicIds.length > 0) {
    await supabase.from('link_topics').insert(
      topicIds.map((topicId) => ({ link_id: data.id, topic_id: topicId }))
    );
  }

  return data;
}

export async function toggleVote(linkId) {
  const { data: existing } = await supabase
    .from('link_votes')
    .select('link_id')
    .eq('link_id', linkId)
    .maybeSingle();

  if (existing) {
    await supabase.from('link_votes').delete().eq('link_id', linkId);
  } else {
    await supabase.from('link_votes').insert({ link_id: linkId });
  }
}
