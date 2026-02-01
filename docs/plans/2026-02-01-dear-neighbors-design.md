# Dear Neighbors — Design Document

## Overview

A Chrome new-tab extension that shows a neighborhood dashboard with community-curated news links and relevant Harmonica deliberation sessions, powered by a Neighborhood API built on Supabase.

**Two deliverables:**
1. **Neighborhood API** — Supabase backend (Postgres + Edge Functions + Auth)
2. **Dear Neighbors extension** — Preact new-tab page consuming the API

**Repo:** `Citizen-Infra/dear-neighbors` on GitHub

## Architecture

```
dear-neighbors/
├── api/              # Supabase migrations, edge functions, seed data
├── extension/        # Chrome extension (Preact + Vite)
│   ├── public/       # manifest.json, background.js, icons
│   └── src/          # Preact app
└── docs/             # Design docs
```

**Data flow:**
- Extension loads → fetches from Neighborhood API (news links, sessions, user preferences)
- Harmonica sessions synced into the API periodically via edge function cron
- Users browse anonymously by default. Signing in (Supabase auth) unlocks submitting links and upvoting
- User preferences (city, topics) stored in Supabase if signed in, localStorage if anonymous

## Tech Stack

- **Extension:** Preact + @preact/signals, Vite, custom CSS (no framework)
- **Backend:** Supabase (Postgres, Edge Functions, Auth, RLS)
- **Auth:** Supabase Auth with email magic link

## Database Schema

### `neighborhoods`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| name | text | e.g. "Novi Sad", "Liman", "Grbavica" |
| type | text | city / mesna_zajednica / block |
| parent_id | uuid | self-referential for hierarchy |
| created_at | timestamptz | |

### `topics`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| name | text | e.g. "Urban Planning", "Environment" |
| slug | text | URL-friendly |
| created_at | timestamptz | |

### `links`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| url | text | |
| title | text | |
| description | text | nullable |
| submitted_by | uuid | nullable (anonymous submissions via edge function) |
| neighborhood_id | uuid FK | |
| created_at | timestamptz | |

### `link_topics` (junction)
| Column | Type |
|--------|------|
| link_id | uuid FK |
| topic_id | uuid FK |

### `link_votes`
| Column | Type | Notes |
|--------|------|-------|
| link_id | uuid FK | composite PK |
| user_id | uuid FK | composite PK |
| created_at | timestamptz | |

### `sessions`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| harmonica_session_id | text | external ID |
| title | text | |
| description | text | nullable |
| status | text | upcoming / active / completed |
| neighborhood_id | uuid FK | |
| starts_at | timestamptz | |
| synced_at | timestamptz | |

### `session_topics` (junction)
| Column | Type |
|--------|------|
| session_id | uuid FK |
| topic_id | uuid FK |

### `user_preferences`
| Column | Type | Notes |
|--------|------|-------|
| user_id | uuid PK | references auth.users |
| neighborhood_ids | uuid[] | array |
| topic_ids | uuid[] | array |
| updated_at | timestamptz | |

### Row-Level Security
- All tables readable by anon role
- `links`, `link_votes`, `user_preferences` writable by authenticated users
- `sessions` writable only by service role (sync function)

## API — Edge Functions

### `GET /links`
- Params: `neighborhood_id`, `topic_ids`, `page`, `limit`, `sort` (hot/new)
- Hot ranking: votes + time decay
- Returns links with vote counts, topic tags, submitter display name
- Public (anon key)

### `POST /links`
- Body: `url`, `title`, `description`, `neighborhood_id`, `topic_ids`
- Auth required
- Auto-fetches title/description from URL if not provided

### `POST /links/:id/vote`
- Toggle upvote (insert or delete)
- Auth required

### `GET /sessions`
- Params: `neighborhood_id`, `topic_ids`, `status`
- Returns sessions grouped by status
- Public (anon key)

### `POST /sync-sessions` (service role only)
- Cron: every 30 min
- Fetches from Harmonica API, upserts into sessions table

## Extension UI Layout

### Top Bar
- "Dear Neighbors" branding (left)
- Current neighborhood + dropdown to change (center)
- Sign in / user avatar (right)
- Topic filter chips — toggleable pills

### Left Zone (~60%) — Community Links
- Sorted by hot-ranking (votes + recency)
- Card: title, domain, time ago, vote count, topic tags, submitter
- Upvote button (prompts sign-in if anonymous)
- "Share a link" button → inline form
- Pagination or infinite scroll

### Right Zone (~40%) — Harmonica Sessions
- Grouped: "Happening Now", "Coming Up", "Recently Completed"
- Card: title, topic tags, neighborhood, time/date, participant count, status badge
- Click opens session on Harmonica

### Anonymous vs Signed-in
- **Anonymous:** Everything visible. Upvote/submit show "sign in to contribute" tooltip. Defaults to city-level, all topics.
- **Signed-in:** Filtered by saved preferences. Can submit and vote. Settings dropdown from avatar.

## Build Sequence

### Phase 1 — API Foundation
- Set up Supabase project
- Apply migrations (tables, RLS, indexes)
- Seed neighborhoods + topics for Novi Sad
- Deploy GET /links and GET /sessions edge functions
- Seed sample data for development

### Phase 2 — Extension Shell
- Scaffold extension (Vite + Preact, manifest.json, new tab override)
- Top bar with neighborhood selector and topic chips
- Dashboard layout (two-zone grid)
- Fetch and display links + sessions from API
- Anonymous browsing fully working

### Phase 3 — Contribution Features
- Supabase Auth integration (magic link in extension)
- Submit link form with URL auto-fetch
- Upvote toggle
- User preferences (save neighborhood + topic selections)

### Phase 4 — Harmonica Sync
- sync-sessions edge function
- Cron schedule
- Session status badges and grouping
