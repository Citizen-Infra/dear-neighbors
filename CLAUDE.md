# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Dear Neighbors** — Chrome extension that replaces the new tab page with a neighborhood dashboard. Community-curated local news links + participation opportunities (Harmonica sessions, Polis conversations, etc.). Part of the Citizen Infrastructure ecosystem (NSRT).

## Commands

```bash
cd extension && npm run build   # Production build → dist/
cd extension && npm run dev     # Vite dev server
```

After building, reload at `chrome://extensions` (Developer mode, Load unpacked → `extension/dist/`).

No linting or test framework configured — code quality is via review.

### Releasing

Bump version in `extension/public/manifest.json`, commit, tag `v*`, push tag. GitHub Actions (`package.yml`) builds `.dmg` (macOS) and `.zip` (Windows/Linux), attaches both to the GitHub Release.

```bash
./scripts/package-dmg.sh             # Local: build + create .dmg
./scripts/package-zip.sh             # Local: build + create .zip
./scripts/package-dmg.sh --skip-build  # Use existing dist/
```

### Migrations

SQL migrations in `api/migrations/` applied via MCP tool (`mcp__supabase__apply_migration`, project `eeidclmhfkndimghdyuq`).

## Architecture

### Two parts

1. **Neighborhood API** (`api/`) — Supabase backend (Postgres + Edge Functions + Auth + RLS)
2. **Chrome Extension** (`extension/`) — Preact new-tab page consuming the API

### Extension stack

- **Preact + @preact/signals** — reactive UI, no prop drilling
- **Vite** — build tool, `base: ''` for Chrome extension relative paths
- **@supabase/supabase-js** — API client
- **Custom CSS** — variables in `src/styles/variables.css`, dark mode via `[data-theme="dark"]`

### Two entry points

The extension has two Vite entry points (`vite.config.js` → `rollupOptions.input`):
- `src/newtab.html` → new tab dashboard (App component with full store)
- `src/popup.html` → browser action popup (PopupForm with its own local state + direct Supabase calls)

The popup is **self-contained** — it has its own auth UI, location selectors, and fetches data directly from Supabase. It does not share signals with the new tab page; it reads `dn_country`/`dn_city`/`dn_neighborhood` from localStorage. When modifying link submission logic, both `PopupForm.jsx` and `SubmitLinkForm.jsx` may need parallel changes.

### Service worker

`public/background.js` — static file (no build deps), copied as-is to `dist/`. Handles magic link auth: Chrome blocks external sites from redirecting to `chrome-extension://` URLs, so the service worker watches `chrome.tabs.onUpdated`, detects the Supabase URL with auth tokens, and navigates the tab to `newtab.html` with tokens preserved.

### State management

Signals-based stores in `src/store/`:
- `neighborhoods.js` — **hierarchical location**: country → city → neighborhood → block. Three persisted signals (`dn_country`, `dn_city`, `dn_neighborhood`). `filterNeighborhoodIds` does BFS to collect all descendant IDs for querying. Cascading setters reset children when parent changes. Existing-user migration walks parent chain to infer country/city from a saved neighborhood.
- `topics.js` — interest categories, multi-select filter persisted to localStorage
- `links.js` — community links with pagination, voting, hot-ranking. Queries use `.in('neighborhood_id', ids)` for multi-neighborhood filtering.
- `sessions.js` — participation opportunities grouped by status (active/upcoming/completed). Same `.in()` pattern.
- `auth.js` — Supabase auth state (magic link sign-in), `isAdmin` signal checked against `admins` table
- `theme.js` — light/dark/system theme

### Database

Supabase Postgres with RLS. Schema in `api/migrations/`:
- `neighborhoods` — hierarchical: country → city → neighborhood → block (type CHECK constraint). ~111 countries, ~340 cities seeded. Novi Sad and Krasnodar have neighborhood rows; other cities can be expanded with data-only migrations.
- `topics` — interest categories (10 seeded)
- `links` + `link_topics` + `link_votes` — community-curated links with hot scoring. `submitted_by` defaults to `auth.uid()`. `link_topics` and `link_votes` cascade on link delete.
- `admins` — users who can delete any link. RLS delete policy on `links` allows submitter OR admin.
- `sessions` + `session_topics` — participation opportunities (Harmonica, Polis, etc.)
- `user_preferences` — saved filters for signed-in users
- Views: `links_with_votes` (hot_score + `user_voted` flag via `auth.uid()`), `sessions_with_topics`

### UI layout

- **Top bar:** Branding, breadcrumb location label (e.g. "Novi Sad / Liman"), topic count, settings gear, auth
- **Settings modal:** Cascading Country → City → Neighborhood selection, topic chips, theme picker, participation toggle
- **Left column (~60%):** Community links feed (hot/new sort, voting, submit form)
- **Right column (~40%):** Participation opportunities panel (live/upcoming/completed)
- **Welcome state:** When no location configured, shows prompt to open settings

## Key Constraints

- `base: ''` in vite.config.js — Chrome extensions need relative paths
- Supabase env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` must be set at build time — Vite inlines them. Locally via `.env.local`, in CI via GitHub Actions secrets. Without them the extension shows a white page (`supabaseUrl is required`)
- `host_permissions: ["<all_urls>"]` in manifest.json — required for SubmitLinkForm's cross-origin URL metadata fetch
- Anonymous users can browse; sign-in (magic link) required to submit/vote
- Neighborhood queries use `.in()` with arrays of IDs (BFS descendants), not single `.eq()`
- Supabase RLS scoping: queries touching user-specific data (e.g. `link_votes`) must include `.eq('user_id', userId)` — the DB uses `auth.uid()` in RLS policies and view definitions, but client-side queries still need explicit user scoping
- Adding neighborhoods for new cities is a data-only migration — no code changes needed

## Related Projects

- **NSRT** (`../nsrt/`) — parent project, Novi Sad community tools
- **Harmonica** (`../harmonica-web-app/`) — deliberation sessions source
- **Tab Hoarder** (`../tab-hoarder/`) — sibling Chrome extension, pattern reference
