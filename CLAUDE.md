# CLAUDE.md

## Project Overview

**Dear Neighbors** — Chrome extension that replaces the new tab page with a neighborhood dashboard. Community-curated local news links + Harmonica deliberation sessions. Part of the Citizen Infrastructure ecosystem (NSRT).

## Commands

```bash
# Extension
cd extension && npm run build   # Production build → dist/
cd extension && npm run dev     # Vite dev server
```

After building, reload at `chrome://extensions` (Developer mode, Load unpacked → `extension/dist/`).

## Architecture

### Two parts

1. **Neighborhood API** (`api/`) — Supabase backend (Postgres + Edge Functions + Auth + RLS)
2. **Chrome Extension** (`extension/`) — Preact new-tab page consuming the API

### Extension stack

- **Preact + @preact/signals** — reactive UI, no prop drilling
- **Vite** — build tool, `base: ''` for Chrome extension relative paths
- **@supabase/supabase-js** — API client
- **Custom CSS** — variables in `src/styles/variables.css`, dark mode via `prefers-color-scheme`

### Service worker

`public/background.js` — static file (no build deps), copied as-is to `dist/`. Handles magic link auth: Chrome blocks external sites from redirecting to `chrome-extension://` URLs, so the magic link redirects to the Supabase project URL instead. The service worker watches `chrome.tabs.onUpdated`, detects the Supabase URL with auth tokens (`#access_token=`, `?code=`, `#error=`), and navigates the tab to the extension's `newtab.html` with tokens preserved. Supabase JS client auto-detects tokens from the URL hash on page load.

### State management

Signals-based stores in `src/store/`:
- `neighborhoods.js` — location hierarchy, active neighborhood persisted to localStorage
- `topics.js` — interest categories, active topic filters persisted to localStorage
- `links.js` — community links with pagination, voting, hot-ranking
- `sessions.js` — Harmonica sessions grouped by status (active/upcoming/completed)
- `auth.js` — Supabase auth state (magic link sign-in)

### Database

Supabase Postgres with RLS. Schema in `api/migrations/`:
- `neighborhoods` — hierarchical (city → mesna_zajednica → block)
- `topics` — interest categories
- `links` + `link_topics` + `link_votes` — community-curated links
- `sessions` + `session_topics` — cached Harmonica sessions
- `user_preferences` — saved filters for signed-in users
- Views: `links_with_votes`, `sessions_with_topics`

### UI layout

Dashboard with fixed top bar + two-column grid:
- **Top bar:** Branding, neighborhood selector, topic chips, auth
- **Left (~60%):** Community links feed (hot/new sort, voting, submit form)
- **Right (~40%):** Harmonica sessions panel (live/upcoming/completed groups)

## Key Constraints

- `base: ''` in vite.config.js — Chrome extensions need relative paths
- Supabase env vars via `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Anonymous users can browse; sign-in (magic link) required to submit/vote
- Sessions synced from Harmonica API via service-role edge function (cron)

## Related Projects

- **NSRT** (`../nsrt/`) — parent project, Novi Sad community tools
- **Harmonica** (`../harmonica-web-app/`) — deliberation sessions source
- **Tab Hoarder** (`../tab-hoarder/`) — sibling Chrome extension, pattern reference
