# Dear Neighbors

[![Package](https://github.com/Citizen-Infra/dear-neighbors/actions/workflows/package.yml/badge.svg)](https://github.com/Citizen-Infra/dear-neighbors/actions/workflows/package.yml)

Chrome extension that replaces the new tab page with a neighborhood dashboard. Community-curated local news links and participation opportunities (deliberation sessions, conversations, community meetings) scoped to your city and neighborhood.

Part of the [NSRT](https://github.com/Citizen-Infra) (Novi Sad Relational Tech) citizen infrastructure ecosystem.

<img width="2520" height="1584" alt="image" src="https://github.com/user-attachments/assets/dc56cc56-bbcb-4496-9831-5c41b8c8551d" />

## How it works

- **Pick your location** — Country → City → Neighborhood (or "all neighborhoods")
- **Browse community links** — Sorted by hot score or newest, filtered by topics
- **Share links** — Submit relevant local news, events, and resources via the new tab page or browser popup
- **Vote** — Upvote links that matter to your neighborhood
- **Participate** — See live, upcoming, and completed participation opportunities (Harmonica sessions, Polis conversations, etc.)

## Setup

```bash
cd extension
npm install
npm run build
```

Load the extension at `chrome://extensions` → Developer mode → Load unpacked → select `extension/dist/`. Then pin the extension in Chrome's toolbar (puzzle icon → pin Dear Neighbors) to access the quick share popup.

Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables (see `.env.example` or set in your shell).

## Architecture

- **Extension** — Preact + @preact/signals, Vite, custom CSS with dark mode
- **Backend** — Supabase (Postgres + Auth + RLS + Edge Functions)
- **Hierarchy** — Country → City → Neighborhood → Block
- **Two entry points** — New tab dashboard + browser action popup

See [CLAUDE.md](./CLAUDE.md) for detailed architecture notes.

## Coverage

111 countries with capital cities seeded. Major cities added for US, UK, EU, India, Japan, South Korea, Australia, New Zealand, South Africa, Brazil, Argentina, Chile, and Mexico. Neighborhoods seeded for Novi Sad and Krasnodar — more added as communities grow.

## License

Private — Citizen Infrastructure / NSRT
