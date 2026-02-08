# Dear Neighbors

![Dear Neighbors](docs/marquee.png)

A Chrome extension that turns your new tab into a neighborhood dashboard. Stay informed about what's happening locally without doomscrolling social media.

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/mofcajnlfddkgiibgodmdhghfiakgdab?label=Chrome%20Web%20Store)](https://chromewebstore.google.com/detail/dear-neighbors/mofcajnlfddkgiibgodmdhghfiakgdab)

## What you get

**Community Links** — News, events, and resources shared by your neighbors. Vote on what matters, submit what you find. Sorted by what's hot or newest.

**Participation** — Live and upcoming opportunities to have your voice heard: deliberation sessions, community conversations, local meetings.

**Your Location** — Pick your country, city, and neighborhood. See only what's relevant to where you live.

<img width="2520" height="1680" alt="Dear Neighbors screenshot" src="https://github.com/user-attachments/assets/a93cc4c4-77af-4606-ad1f-04651cbe37c9" />

## Install

**[Install from Chrome Web Store](https://chromewebstore.google.com/detail/dear-neighbors/mofcajnlfddkgiibgodmdhghfiakgdab)** — recommended, auto-updates

Works in Chrome, Brave, and Edge. Arc browser users may need to disable shields for sign-in to work.

<details>
<summary>Manual install (for development)</summary>

1. Download the latest `.zip` from [Releases](https://github.com/Citizen-Infra/dear-neighbors/releases)
2. Extract the folder
3. Open Chrome and go to `chrome://extensions`
4. Enable "Developer mode" (toggle in top-right)
5. Click "Load unpacked" and select the `extension` folder inside
6. Pin the extension (puzzle icon → pin Dear Neighbors) for quick sharing
</details>

## Getting started

Click the gear icon to:
- Pick your country, city, and neighborhood
- Choose topics you care about
- Sign in with email to vote and share links

## Changelog

### 0.1.9 — February 2026
- Participation feed now aggregates events from city-wide communities (Telegram event links, external APIs)
- Source badges and location display on event cards
- Refined card layout with better visual hierarchy

### 0.1.8 — February 2026
- Improved security and permissions
- About footer in Settings

### 0.1.7 — February 2026
- Auth moved into Settings modal
- New neighborhood icon
- Regional AQI scales (US vs European)

### 0.1.6 — February 2026
- Language support (English/Serbian)
- Onboarding for new users
- Live AQI and UV badges
- More neighborhoods: Belgrade, London, Auckland, Wellington, Toronto, New York, Los Angeles, Houston

### 0.1.5 — February 2026
- Better sign-in prompts when voting or sharing

### 0.1.4 — February 2026
- Simpler install (single ZIP for all platforms)

### 0.1.3 — February 2026
- Remove your votes with downvote arrow
- "Top" sort with time range picker

### 0.1.2 — February 2026
- Auto-fetch page title when sharing links

### 0.1.1 — February 2026
- Delete your own links
- Bug fixes

### 0.1.0 — January 2026
- Neighborhood dashboard replacing Chrome new tab
- Location picker (country → city → neighborhood)
- Community links with voting
- Participation opportunities panel
- Quick share popup
- Light/dark/system theme
- 111 countries, 340+ cities

---

Part of [Citizen Infrastructure](https://github.com/Citizen-Infra) — tools that teach collective action through use.

See also: [My Community](https://github.com/Citizen-Infra/my-community) (community dashboard with Bluesky integration)

[AGPL-3.0 License](LICENSE)
