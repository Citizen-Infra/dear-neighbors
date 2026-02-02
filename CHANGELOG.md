# Changelog

## [0.1.6] - 2026-02-02

### Added
- Language support: UI i18n (English/Serbian), content language filter, auto-detect from browser locale
- Onboarding modal for new users to pick city and language on first visit
- Live AQI and UV index badges in the top bar
- Neighborhoods for Belgrade, London, Auckland, Wellington, Toronto, New York, Los Angeles, and Houston (10 each, 90 total)
- Toronto added as a city under Canada

### Changed
- New tab page title changed to "New Tab"

## [0.1.5] - 2026-02-01

### Fixed
- Share/vote buttons now open sign-in modal instead of silently doing nothing
- Show "Too many attempts" error when Supabase email rate limit is hit (was silent failure)
- Add "check your spam folder" hint after magic link is sent (both new tab and popup)

## [0.1.4] - 2026-02-01

### Changed
- Replace DMG packaging with single ZIP for all platforms (simpler install on macOS)
- Single CI job instead of two parallel jobs (fixes release race condition)

### Added
- CHANGELOG.md
- Dependabot for weekly npm security updates
- CI badge in README

### Fixed
- Sync package.json version with manifest.json (was drifting)

## [0.1.3] - 2026-02-01

### Added
- Downvote arrow to remove your own votes (upvote disables when voted, downvote appears below count)
- "Top" sort tab ordered by vote count, with Week/Year/All time range picker

## [0.1.2] - 2026-02-01

### Added
- Auto-fetch page title and description when pasting a URL in the submit form
- Topic chip pill styles in the submit form
- `host_permissions` for cross-origin URL metadata fetch
- `user_voted` flag in `links_with_votes` view (migration 011)

### Fixed
- Vote toggle now scoped to current user (was missing `user_id` filter)

## [0.1.1] - 2026-02-01

### Added
- Link deletion for submitters and admins
- Pin-the-extension instructions in README and install guides

### Fixed
- Link submission now defaults `submitted_by` to `auth.uid()` (migration 010)

### Changed
- Renamed `mesna_zajednica` neighborhood type to `neighborhood`

## [0.1.0] - 2026-01-31

Initial release.

- Neighborhood dashboard replacing Chrome new tab page
- Hierarchical location selection (country / city / neighborhood)
- Community links feed with hot-ranking and voting
- Participation opportunities panel (live/upcoming/completed sessions)
- Browser popup for quick link sharing from any page
- Magic link authentication via Supabase
- Light/dark/system theme support
- 111 countries, 340+ cities seeded
- Packaging as .dmg (macOS) and .zip (Windows/Linux) via GitHub Actions
