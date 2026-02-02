-- Drop existing views first (required because new column changes column order)
drop view if exists links_with_votes;
drop view if exists sessions_with_topics;

-- Add language column to links and sessions tables
alter table links add column language text not null default 'en' check (language in ('en', 'sr'));
alter table sessions add column language text not null default 'en' check (language in ('en', 'sr'));

create index idx_links_language on links (language);
create index idx_sessions_language on sessions (language);

-- Recreate links_with_votes view to include language
create or replace view links_with_votes as
select
  l.id,
  l.url,
  l.title,
  l.description,
  l.submitted_by,
  l.neighborhood_id,
  l.language,
  l.created_at,
  coalesce(v.vote_count, 0) as vote_count,
  coalesce(t.topic_ids, '{}') as topic_ids,
  coalesce(t.topic_names, '{}') as topic_names,
  coalesce(v.vote_count, 0) + (1.0 / (extract(epoch from now() - l.created_at) / 3600 + 2)) * 10 as hot_score,
  exists(select 1 from link_votes lv where lv.link_id = l.id and lv.user_id = auth.uid()) as user_voted
from links l
left join lateral (
  select count(*) as vote_count from link_votes where link_id = l.id
) v on true
left join lateral (
  select
    array_agg(lt.topic_id) as topic_ids,
    array_agg(tp.name) as topic_names
  from link_topics lt
  join topics tp on tp.id = lt.topic_id
  where lt.link_id = l.id
) t on true;

-- Recreate sessions_with_topics view to include language
create or replace view sessions_with_topics as
select
  s.id,
  s.harmonica_session_id,
  s.title,
  s.description,
  s.status,
  s.neighborhood_id,
  s.language,
  s.starts_at,
  s.synced_at,
  coalesce(t.topic_ids, '{}') as topic_ids,
  coalesce(t.topic_names, '{}') as topic_names
from sessions s
left join lateral (
  select
    array_agg(st.topic_id) as topic_ids,
    array_agg(tp.name) as topic_names
  from session_topics st
  join topics tp on tp.id = st.topic_id
  where st.session_id = s.id
) t on true;
