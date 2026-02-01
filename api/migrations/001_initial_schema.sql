-- Dear Neighbors — Initial Schema
-- Tables, RLS policies, views, and seed data

-- Neighborhoods (location hierarchy)
create table neighborhoods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('city', 'mesna_zajednica', 'block')),
  parent_id uuid references neighborhoods(id),
  created_at timestamptz not null default now()
);

alter table neighborhoods enable row level security;
create policy "neighborhoods_read" on neighborhoods for select using (true);

-- Topics (interest categories)
create table topics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

alter table topics enable row level security;
create policy "topics_read" on topics for select using (true);

-- Links (community-submitted)
create table links (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  title text not null,
  description text,
  submitted_by uuid references auth.users(id),
  neighborhood_id uuid not null references neighborhoods(id),
  created_at timestamptz not null default now()
);

create index links_neighborhood_idx on links(neighborhood_id);
create index links_created_at_idx on links(created_at desc);

alter table links enable row level security;
create policy "links_read" on links for select using (true);
create policy "links_insert" on links for insert with check (auth.uid() = submitted_by);

-- Link-Topic junction
create table link_topics (
  link_id uuid not null references links(id) on delete cascade,
  topic_id uuid not null references topics(id) on delete cascade,
  primary key (link_id, topic_id)
);

alter table link_topics enable row level security;
create policy "link_topics_read" on link_topics for select using (true);
create policy "link_topics_insert" on link_topics for insert with check (
  exists (select 1 from links where id = link_id and submitted_by = auth.uid())
);

-- Link votes
create table link_votes (
  link_id uuid not null references links(id) on delete cascade,
  user_id uuid not null references auth.users(id) default auth.uid(),
  created_at timestamptz not null default now(),
  primary key (link_id, user_id)
);

alter table link_votes enable row level security;
create policy "link_votes_read" on link_votes for select using (true);
create policy "link_votes_insert" on link_votes for insert with check (auth.uid() = user_id);
create policy "link_votes_delete" on link_votes for delete using (auth.uid() = user_id);

-- Sessions (cached from Harmonica)
create table sessions (
  id uuid primary key default gen_random_uuid(),
  harmonica_session_id text not null unique,
  title text not null,
  description text,
  status text not null check (status in ('upcoming', 'active', 'completed')) default 'upcoming',
  neighborhood_id uuid references neighborhoods(id),
  starts_at timestamptz,
  synced_at timestamptz not null default now()
);

create index sessions_status_idx on sessions(status);
create index sessions_neighborhood_idx on sessions(neighborhood_id);
create index sessions_starts_at_idx on sessions(starts_at);

alter table sessions enable row level security;
create policy "sessions_read" on sessions for select using (true);
-- Write access only via service role (sync function)

-- Session-Topic junction
create table session_topics (
  session_id uuid not null references sessions(id) on delete cascade,
  topic_id uuid not null references topics(id) on delete cascade,
  primary key (session_id, topic_id)
);

alter table session_topics enable row level security;
create policy "session_topics_read" on session_topics for select using (true);

-- User preferences
create table user_preferences (
  user_id uuid primary key references auth.users(id),
  neighborhood_ids uuid[] default '{}',
  topic_ids uuid[] default '{}',
  updated_at timestamptz not null default now()
);

alter table user_preferences enable row level security;
create policy "user_prefs_read" on user_preferences for select using (auth.uid() = user_id);
create policy "user_prefs_insert" on user_preferences for insert with check (auth.uid() = user_id);
create policy "user_prefs_update" on user_preferences for update using (auth.uid() = user_id);

-- View: links with vote counts and topic info
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
  -- Simple hot score: votes + time decay (higher = hotter)
  coalesce(v.vote_count, 0) + (1.0 / (extract(epoch from now() - l.created_at) / 3600 + 2)) * 10 as hot_score
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

-- View: sessions with topic info
create or replace view sessions_with_topics as
select
  s.id,
  s.harmonica_session_id,
  s.title,
  s.description,
  s.status,
  s.neighborhood_id,
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
