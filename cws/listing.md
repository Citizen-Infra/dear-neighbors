# Chrome Web Store Listing — Dear Neighbors

## Store Name
Dear Neighbors

## Short Description (132 chars max)
Replace your new tab with a neighborhood dashboard — community-curated local news, links, and participation opportunities.

## Detailed Description

Dear Neighbors replaces your new tab page with a neighborhood dashboard where residents share and discover local news, useful links, and opportunities to participate in community decisions.

**How it works:**
- Pick your country, city, and neighborhood — the dashboard shows content relevant to your area
- Browse links shared by your neighbors, sorted by Hot, Top, or New
- Vote on the most useful links so the best ones rise to the top
- Share links yourself from any page using the browser popup (click the extension icon)
- See live participation opportunities — deliberation sessions, polls, and community discussions
- Check local air quality (AQI) and UV index right in the top bar

**Features:**
- Hierarchical location: 111 countries, 340+ cities, with neighborhood-level granularity
- Topic filtering: focus on what matters to you (infrastructure, culture, environment, education, and more)
- Light, dark, and system theme support
- English and Serbian language support
- Quick sharing via the browser action popup — one click from any page
- Magic link sign-in — no passwords to remember

**Privacy-first:**
- Anonymous browsing — sign in only when you want to share or vote
- No tracking, no ads, no data sold to third parties
- Your email is used only for authentication
- All data stored on Supabase with row-level security

Built as part of the Citizen Infrastructure project — open-source tools for neighborhood-level civic engagement.

## Single Purpose Description
Replaces the new tab page with a neighborhood-specific community dashboard for sharing and discovering local news and participation opportunities.

## Category
Social & Communication

## Language
English

---

## Privacy Practices Declaration

### Data collected

**Email address**
- Used for: authentication (magic link sign-in)
- Not shared with third parties
- Stored in Supabase Auth (hosted on AWS)

**Website content (URLs, page titles)**
- Used for: link submissions — when you share a link, the URL and its title/description are stored
- Voluntarily submitted by the user
- Visible to other users in the same neighborhood

**Location preference (country/city/neighborhood)**
- Used for: filtering dashboard content to your area
- Stored locally in browser storage and optionally in user preferences (Supabase)
- Not precise geolocation — selected from a predefined list

### Data NOT collected
- Browsing history
- Precise geolocation
- Personal information beyond email
- Financial or payment information

### Permissions justification

**tabs**: Read the title of the current tab when sharing a link via the browser popup
**storage**: Persist user preferences (theme, language, location) in Chrome local storage
**host_permissions** (Supabase, Open-Meteo): Communicate with the backend API for data storage and fetch air quality/UV data

### Data retention
Users can delete their submitted links at any time. Account deletion removes all associated data.

### Remote code
This extension does not use remotely hosted code.
