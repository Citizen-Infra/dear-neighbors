# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Dear Neighbors** — Chrome extension that replaces the new tab page with a neighborhood dashboard. Community-curated local news links + participation opportunities (Harmonica sessions, Polis conversations, etc.). Part of the Citizen Infrastructure ecosystem (NSRT).

## Skills

Always use the `frontend-design` skill for visual/UI tasks: icons, component design, styling, layout changes.

## Commands

```bash
cd extension && npm run build   # Production build → dist/
cd extension && npm run dev     # Vite dev server
```

After building, reload at `chrome://extensions` (Developer mode, Load unpacked → `extension/dist/`).

No linting or test framework configured — code quality is via review.

### Releasing

Bump version in both `extension/public/manifest.json` and `extension/package.json`, commit, tag `v*`, push tag. GitHub Actions (`package.yml`) builds a `.zip` and attaches it to the GitHub Release. Update `CHANGELOG.md` with the new version's changes.

```bash
./scripts/package-zip.sh             # Local: build + create .zip
./scripts/package-zip.sh --skip-build  # Use existing dist/
```

**Two distribution channels:** GitHub releases can be frequent (every commit batch). Chrome Web Store uploads are cumulative — upload when there's a meaningful set of changes. CWS listing assets are in `cws/`. CWS auto-updates for users; manifest version must increase with each upload.

### Icons

SVG source at `extension/public/icons/icon.svg`. Generate PNGs: `npx sharp-cli -i icon.svg -o icon-{size}.png resize {size} {size}` for 16, 48, 128.

### Edge Functions

`fetch-url-metadata` — server-side URL metadata extraction (title, description) used by SubmitLinkForm. Deployed via `mcp__supabase__deploy_edge_function`. No JWT required (anon key sufficient).

### Migrations

SQL migrations in `api/migrations/` applied via MCP tool (`mcp__supabase__apply_migration`, project `eeidclmhfkndimghdyuq`).

### CWS Assets

`cws/` (gitignored, local only) — Chrome Web Store listing materials: `listing.md` (description, privacy declaration), promo images (440x280 + 1400x560 in SVG/PNG), `screenshots.md` (capture guide).

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
- `sessions.js` — participation opportunities grouped by status (active/upcoming/completed). Fetches from scenius-digest `/api/events?city={slug}` + Supabase `sessions_with_topics` (neighborhood-filtered). Deduplicates by URL.
- `auth.js` — Supabase auth state (magic link sign-in), `isAdmin` signal checked against `admins` table. `showAuthModal` signal is watched by TopBar; when set to true (e.g. by vote/share buttons), it opens the SettingsModal which contains the inline auth form.
- `environment.js` — AQI and UV index from Open-Meteo APIs, displayed as badges in TopBar
- `language.js` — `contentLanguageFilter` signal, filters link content by interface language
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

- **Top bar:** Branding, breadcrumb location label (e.g. "Novi Sad / Liman"), topic count, settings gear
- **Settings modal:** Account (inline auth form or signed-in state), cascading Country → City → Neighborhood selection, topic chips, theme picker, participation toggle
- **Onboarding modal:** 3-step wizard for new users — Location → Language → Account (optional sign-in)
- **Left column (~60%):** Community links feed (Hot/Top/New sort, voting with upvote/unvote arrows, submit form). Top sort has Week/Year/All time range picker.
- **Right column (~40%):** Participation opportunities panel (live/upcoming/completed)
- **Welcome state:** When no location configured, shows prompt to open settings

## Key Constraints

- `base: ''` in vite.config.js — Chrome extensions need relative paths
- Supabase env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` must be set at build time — Vite inlines them. Locally via `.env.local`, in CI via GitHub Actions secrets. Without them the extension shows a white page (`supabaseUrl is required`)
- `host_permissions` in manifest.json — scoped to Supabase project URL (covers DB + edge functions), Open-Meteo APIs (AQI/UV badges), and scenius-digest API (events). URL metadata fetching is done server-side via the `fetch-url-metadata` edge function
- Anonymous users can browse; sign-in (magic link) required to submit/vote. Auth-gated actions should set `showAuthModal.value = true` (which opens the settings modal) rather than silently failing.
- Supabase free tier rate-limits magic link emails (~3-4/hour/user). The auth UI handles 429 errors with a user-facing message.
- Neighborhood queries use `.in()` with arrays of IDs (BFS descendants), not single `.eq()`
- Supabase RLS scoping: queries touching user-specific data (e.g. `link_votes`) must include `.eq('user_id', userId)` — the DB uses `auth.uid()` in RLS policies and view definitions, but client-side queries still need explicit user scoping
- Adding neighborhoods for new cities is a data-only migration — no code changes needed
- `auth-modal.css` defines `.modal-overlay` used by both SettingsModal and other overlays — don't remove shared classes when refactoring

## Related Projects

- **NSRT** (`../nsrt/`) — parent project, Novi Sad community tools
- **Scenius Digest** (`../scenius-digest/`) — events data source (`/api/events?city=`)
- **Harmonica** (`../harmonica-web-app/`) — deliberation sessions source
- **Tab Hoarder** (`../tab-hoarder/`) — sibling Chrome extension, pattern reference
