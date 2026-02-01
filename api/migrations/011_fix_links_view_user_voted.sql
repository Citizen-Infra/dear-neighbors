-- Recreate links_with_votes view to include user_voted flag
-- Returns true when the current user has voted on a link, false otherwise
-- (anonymous users get false since auth.uid() is null)
create or replace view links_with_votes as
select
  l.id,
  l.url,
  l.title,
  l.description,
  l.submitted_by,
  l.neighborhood_id,
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
