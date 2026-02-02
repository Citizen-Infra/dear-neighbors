# Privacy Policy — Dear Neighbors

**Last updated:** February 2, 2026

Dear Neighbors is a Chrome extension built by [Citizen Infra](https://github.com/Citizen-Infra). This policy explains what data the extension collects, how it is used, and your rights.

## Data we collect

### Email address
- Used solely for authentication (magic link sign-in)
- Not shared with third parties
- Stored in Supabase Auth (hosted on AWS)

### Website content (URLs, page titles)
- Collected only when you voluntarily submit a link
- The URL and its title/description are stored and visible to other users in the same neighborhood

### Location preference (country/city/neighborhood)
- Used to filter dashboard content to your area
- Stored locally in browser storage and optionally in your user preferences on our server
- Not precise geolocation — selected from a predefined list

## Data we do NOT collect

- Browsing history
- Precise geolocation
- Personal information beyond email
- Financial or payment information

## Browser permissions

- **tabs**: Read the title of the current tab when sharing a link via the browser popup
- **storage**: Persist user preferences (theme, language, location) in Chrome local storage
- **host_permissions** (Supabase, Open-Meteo): Communicate with the backend API for data storage and fetch air quality/UV data

## Third-party services

- **Supabase** (database, authentication, edge functions) — [supabase.com/privacy](https://supabase.com/privacy)
- **Open-Meteo** (air quality and UV index data) — [open-meteo.com/en/terms](https://open-meteo.com/en/terms)

## Data retention

You can delete your submitted links at any time. Account deletion removes all associated data.

## Remote code

This extension does not use remotely hosted code.

## Contact

For questions about this privacy policy, open an issue at [github.com/Citizen-Infra/dear-neighbors](https://github.com/Citizen-Infra/dear-neighbors/issues).
