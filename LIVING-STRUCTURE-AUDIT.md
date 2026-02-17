# Living Structure Audit: dear-neighbors

Date: 2026-02-17
Focus: Full audit (all 15 properties)

## Summary

- Score: 51/89 (57%)
- Partial: 17
- Missing: 15
- N/A: 6

## Overall Impression

Dear Neighbors feels handmade in the best sense — a small, coherent system where every file has a clear reason to exist and nothing feels stamped out by a framework generator. The signals-based store layer is the project's beating heart: simple, consistent, and well-adapted to the Chrome extension context. The main weakness is a thin boundary layer — Supabase queries are spread throughout stores with no abstraction, and error states are largely invisible to users. For a ~4,100-line solo side project, the ratio of coherence to complexity is remarkably high.

## 1. Levels of Scale

**Alexander's principle:** Centers exist at many sizes, with smooth transitions between adjacent levels.

- [x] **Multiple levels of abstraction** — clear levels: expressions → functions → store modules/components → layers (store/components/styles/lib) → extension/api split
- [x] **Smooth size ratios** — functions are 5-30 lines, modules are 50-200 lines, layers have 8-12 modules each. No jarring jumps.
- [x] **No missing levels** — the "paragraph" level (blank-line-separated blocks within functions) is consistently used in larger components like SettingsModal and App
- [x] **Power-law distribution** — many small stores (theme 28 lines, language 9 lines, auth 49 lines) and few large ones (neighborhoods 126 lines). Same pattern in components.
- [x] **Small centers are present** — variable names are descriptive (`filterNeighborhoodIds`, `activeTopicIds`, `contentLanguageFilter`), expressions are clear
- [n/a] **Organizational levels of scale** — solo project

**Observation:** This is the project's strongest property. No file exceeds 350 lines. The 28 source files distribute smoothly from 8 lines (supabase.js) to 342 lines (PopupForm.jsx), with the median around 114 lines. The scaling feels natural, not imposed.

## 2. Strong Centers

**Alexander's principle:** The system has clear cores that everything else orbits.

- [x] **Identifiable core concept** — "The first thing to know: it's a new-tab Chrome extension backed by Supabase signals stores that feed Preact components"
- [x] **Domain model as center** — the store layer (`src/store/`) is clearly the center: neighborhoods, links, sessions, topics, auth. Everything else serves it.
- [x] **Centers support each other** — components read signals, stores manage data, CSS styles components. The dependency direction is clear.
- [~] **Rock-solid core** — stores are clean but have no tests; the BFS traversal in neighborhoods.js is correct but untested. Errors silently swallowed.
- [x] **Navigability from center** — you can always ask "which store does this data come from?" and find your way
- [~] **Centers at every scale** — stores and components each have strong centers, but PopupForm is a self-contained parallel world with its own state management, weakening the overall center
- [n/a] **Team has a center** — solo project

**Observation:** The store layer is a genuinely strong center. `App.jsx` (99 lines) is the highest-quality file — two clean useEffects, a `ready` gate, three render states. It orchestrates everything without trying to do everything.

## 3. Boundaries

**Alexander's principle:** Thick, well-defined boundaries protect centers.

- [ ] **Parsing at the boundary** — Supabase responses are used as-is; no type validation or parsing layer. External API responses (scenius-digest, Open-Meteo) consumed directly.
- [~] **Serialization at the boundary** — output is handled by Preact JSX (natural), but Supabase insert payloads are constructed inline in stores with no shared shape
- [~] **Error handling at the boundary** — auth errors are translated to user messages via i18n; data-fetching errors are `console.error` + silent. Inconsistent across stores.
- [ ] **Proportional thickness** — `lib/supabase.js` is 8 lines. The boundary between the extension and its backend is paper-thin. Every store knows Supabase query syntax.
- [~] **APIs as explicit boundaries** — stores are the implicit API layer, but they mix data access with signal management. No separation between "fetch data" and "store data"
- [ ] **Boundaries have their own centers** — there is no boundary layer to have a center; Supabase calls are embedded in store logic
- [n/a] **Team boundaries are clear** — solo project

**Observation:** The weakest property. Alexander's 25-50% rule is violated — the boundary code is ~0.5% the size of what it protects. If Supabase were replaced, every store would need rewriting. The auth boundary is the one exception: it's properly encapsulated in `auth.js` with user-facing error messages.

## 4. Alternating Repetition

**Alexander's principle:** Dual structures repeat and alternate, each strengthening the other.

- [x] **Data and code alternate coherently** — signals (data) and store functions (behavior) are equally well-designed. Neither is an afterthought.
- [ ] **Tests and production code alternate** — no tests exist. CLAUDE.md: "No linting or test framework configured."
- [~] **Structure and behavior co-evolve** — git history shows feature + polish commits interleaved, but no refactoring commits. Structure evolves only when new features demand it.
- [x] **Input and output cycles** — clear rhythm: load data → signals update → components re-render. User action → store mutation → signal update → re-render.
- [~] **Work-life rhythm** — burst-based development (feature sprints + publishing sprints), not continuous. Reasonable for a side project.

**Observation:** The signals ↔ components alternation is strong. The total absence of tests is the gap — there's no dual "verification" structure echoing the production code.

## 5. Positive Space

**Alexander's principle:** Every part is coherent and purposeful, not leftover scraps.

- [x] **Functions are self-contained** — `loadLinks()`, `loadSessions()`, `toggleTopic()` each make sense in isolation
- [~] **No idea fragments** — `getTimeAgo()` and `getDomain()` are embedded in LinksFeed.jsx rather than being their own module. They work but only in that context.
- [x] **Background code is positive** — `i18n.js`, `detect-language.js`, `supabase.js` are each a clean, single-purpose utility
- [~] **Interstitial code is shaped** — `App.jsx` is a beautifully shaped orchestrator. But `TopBar.jsx` pulls double duty as both a visual component and an auth-modal event bridge (via `showAuthModal` watcher), blurring its shape.
- [x] **Consistent abstraction levels** — store files deal with data, components deal with rendering. The separation is clean.
- [~] **Reusable by nature** — stores are Preact-signals-specific but conceptually portable. The `environment.js` stale-while-revalidate cache is genuinely reusable.
- [ ] **Easy to test in isolation** — no tests, but more importantly: stores that embed Supabase calls can't be tested without mocking the client

**Observation:** Most code is positively shaped. The main negative-space issue is the `showAuthModal` signal acting as an invisible event bus — LinksFeed sets it, TopBar watches it. It works, but the shape of "who owns this interaction" is blurry.

## 6. Good Shape

**Alexander's principle:** Simple parts compose into elegant wholes.

- [x] **Composed from simple parts** — the whole extension is built from just: signals, Preact components, CSS files, and Supabase calls. No abstractions beyond what Preact/signals provide.
- [x] **Recursive good shape** — `App` is well-shaped, composed from well-shaped stores, which are composed from well-named signals and focused functions
- [x] **Code reads like the problem** — `loadLinks({ sort, range, neighborhoodIds, topicIds })` reads like what it does. `filterNeighborhoodIds` computes exactly what the name says.
- [x] **Elegant composition** — the reactive chain (signal → computed → component) is natural and Preact-idiomatic
- [x] **Minimal machinery** — 6 runtime dependencies. 28 source files. ~4,100 lines total. Does a lot with very little.

**Observation:** Excellent. The project achieves a surprising amount of functionality with minimal code. The BFS neighborhood traversal in a computed signal is a good example — a 20-line function that elegantly solves a hard problem (querying all descendants in a flat table).

## 7. Local Symmetries

**Alexander's principle:** Similar things look similar; differences are meaningful.

- [x] **Similar behaviors have similar structure** — all store modules follow the same pattern: signals → computed → load functions → setter functions
- [~] **Symmetrical branching** — generally yes, but auth state in SettingsModal has 3 asymmetric branches (not-signed-in/email-sent/signed-in) that could be cleaner
- [~] **Meaningful asymmetry** — PopupForm's departure from the signals pattern is documented and intentional (separate entry point), but the *reason* is architectural constraint, not domain difference
- [x] **Templates and conventions** — CSS follows a consistent per-component organization. Store modules are recognizable at a glance.
- [x] **Differences stand out** — `environment.js` is visibly different from other stores (caching, external APIs, no Supabase) and that difference is meaningful

**Observation:** The store module symmetry is the project's signature pattern. You can learn the convention from one store file and read all others. The PopupForm asymmetry is the notable exception — documented but still surprising.

## 8. Deep Interlock and Ambiguity

**Alexander's principle:** Centers hook into each other; hierarchy is flexible.

- [x] **Inversion of control** — signal reactivity is pure inversion of control: stores produce signals, components consume them without stores knowing which components exist
- [x] **Shared interfaces** — signals are the shared interface between stores and components, belonging fully to neither
- [~] **Multiple valid perspectives** — the code can be read by-feature (links, sessions, neighborhoods) or by-layer (store, component, style), but the dual entry points (newtab vs. popup) create a confusing fork
- [n/a] **Cross-functional teams** — solo project
- [x] **Composable building blocks** — stores compose through import (`sessions.js` uses `neighborhoods.js` signals). Components compose through JSX nesting.

**Observation:** Signals are the perfect medium for interlock — they create ambiguity in the right way. A signal like `activeTopicIds` belongs to both the SettingsModal (which writes it) and the LinksFeed (which reads it), without either being "primary."

## 9. Contrast

**Alexander's principle:** Distinct parts are clearly differentiated.

- [x] **Concern separation is visible** — open any file and you immediately know if it's a store (signals), a component (JSX), or a style (CSS). The squint test passes.
- [x] **Clear architectural layers** — `store/`, `components/`, `styles/`, `lib/` are physically separated and visually distinct
- [x] **Contrast without violence** — no rigid framework. The separation emerged naturally from the signals model.
- [n/a] **Roles are distinct** — solo project
- [~] **Read vs. write paths differ** — read path (load functions → signals → components) is clear. Write path (user action → store function → Supabase → re-load) is similar but less visibly differentiated.

**Observation:** Strong contrast. The three file types (`.js` stores, `.jsx` components, `.css` styles) have fundamentally different textures. You always know where you are.

## 10. Gradients

**Alexander's principle:** Controlled transitions replace sharp jumps.

- [~] **Public-to-private gradient** — stores export everything (signals + functions) at module scope. No public/private distinction. Components are all exported.
- [~] **File reading gradient** — `App.jsx` reads well top-to-bottom: imports → effects → render. Stores vary — some put load functions first, some put signals first.
- [n/a] **Test case gradient** — no tests
- [x] **Complexity gradient** — outer layer (components) is simple JSX reading signals. Inner layer (stores) handles data fetching, caching, BFS. The complexity increases as you go "inward."
- [x] **Project lifecycle gradient** — git history shows natural progression: core features → polish → publishing → maintenance fixes

**Observation:** The complexity gradient from components (simple) to stores (complex) to database (SQL views, RLS policies) is well-calibrated. Each layer shields the next from its complexity.

## 11. Roughness

**Alexander's principle:** Precise adaptation to real forces, not artificial perfection.

- [x] **Pragmatic approximations** — `getTimeAgo()` is hand-rolled (no moment/date-fns), the EU country set for AQI is hardcoded, the 30-min stale-while-revalidate is a simple timestamp check
- [x] **Rules relaxed for readability** — no linter enforcing rules. Code is formatted for readability, not consistency metrics.
- [x] **No artificial perfection** — the code doesn't try to be a textbook example. It's adapted to real Chrome extension constraints (`base: ''`, magic link workaround, service worker auth bridge).
- [x] **Handmade quality** — every file feels hand-shaped. The existing-user migration in `neighborhoods.js` is a great example: commented, inline, pragmatic.
- [x] **Context-sensitive decisions** — `PopupForm` uses local state because it's a separate entry point. `environment.js` has its own cache because its data has different freshness needs. The decisions make sense.
- [x] **Imperfection is honest** — `// silent` error catch in SubmitLinkForm is at least visible. The CLAUDE.md documents known constraints honestly.

**Observation:** This is where the project truly shines. It feels like a hand-built thing made by someone solving real problems, not following a tutorial. The roughness is genuine adaptation, not sloppiness.

## 12. Echoes

**Alexander's principle:** Recurring structural themes across scales and parts.

- [x] **Consistent idioms** — the signal/load/setter pattern echoes across all 8 stores. The `import signal → export async function loadX` shape is the project's signature.
- [~] **Cross-scale echoes** — the "hierarchical filtering" theme echoes at multiple levels (country→city→neighborhood in UI, BFS in store, `.in()` in queries), but isn't explicitly modeled as a shared concept
- [x] **Familiar foundations** — reactive signals, REST-ish Supabase queries, CSS custom properties. All well-known patterns.
- [n/a] **Team echoes code** — solo project
- [~] **Design vocabulary** — the CLAUDE.md establishes vocabulary (cascading setters, BFS descendants, magic link bridge), but there's no glossary or architecture decision records

**Observation:** The store module pattern is a strong echo — once you've seen `topics.js`, you can read every other store. The CSS variable system echoes the same principle: define tokens once, use them everywhere.

## 13. The Void

**Alexander's principle:** Quiet, stable spaces allow life to bloom.

- [x] **Stable platforms** — Preact, Vite, Supabase, CSS custom properties. All stable, well-maintained foundations with minimal API churn.
- [x] **Breathing room in code** — files use blank lines to separate logical sections. JSX is not over-nested.
- [x] **Unopinionated core** — the signals model doesn't impose structure. Each store can be as simple or complex as needed.
- [x] **Quiet-to-busy ratio** — the 8-line `supabase.js`, the 28-line `theme.js`, the 9-line `language.js` are quiet voids that create space for the busy stores and components
- [~] **Slack in the schedule** — burst-based development suggests slack exists but isn't structured
- [x] **Empty extensibility** — adding a new data type (e.g., "events" or "polls") would mean adding one store file, one component, one CSS file. The pattern is clear and inviting.

**Observation:** The project has good voids. The small utility files are like quiet courtyards — they do almost nothing, but they create space for the busy files to exist without crowding each other. Adding a new neighborhood is explicitly documented as "data-only migration — no code changes needed."

## 14. Simplicity and Inner Calm

**Alexander's principle:** Complex but coherent; effortless-feeling precision.

- [x] **No unnecessary complexity** — 6 runtime deps. No state management library. No router. No test framework. Every dependency earns its place.
- [x] **Working with the grain** — Preact signals are the natural fit for a Chrome extension (reactive, lightweight, no virtual DOM overhead). Supabase is the natural fit for a small CRUD backend.
- [~] **No firefighting culture** — the silent error handling suggests bugs might be hard to diagnose in production. The AQI label duplication bug (`euAqiLabel` 80-100 returns 'poor' twice) went unnoticed.
- [x] **Obvious in retrospect** — the architecture feels inevitable. Of course you'd use signals for a new-tab dashboard. Of course you'd put styles in per-component CSS files.
- [x] **No contortions** — no forced patterns. The `showAuthModal` bridge is the closest thing to a contortion, and it's only there because Chrome extension popups can't share state with new-tab pages.
- [x] **Effortless reading** — `App.jsx` reads like a story: load neighborhoods and topics, wait until ready, then load everything else. Most files read top-to-bottom.

**Observation:** The project has genuine inner calm. Nothing is frantic. The dependency count (6) is almost shockingly low for a feature-rich extension. The architecture feels like it "found the joints in the meat."

## 15. Not-Separateness

**Alexander's principle:** Deeply adapted to context; doesn't call attention to itself.

- [x] **Adapted to users' real workflows** — replaces the new tab, which people open hundreds of times a day. Loads fast, shows relevant local info, doesn't demand attention.
- [x] **Adapted to developers' tools** — `base: ''` for Chrome, service worker auth bridge, `host_permissions` scoped to exactly what's needed. Every Chrome extension constraint is addressed.
- [x] **Adapted to the ecosystem** — consumes scenius-digest API, links to Harmonica sessions, uses Supabase (shared with the Citizen Infra ecosystem)
- [x] **Bridging across hard edges** — the service worker auth bridge is a textbook example: Chrome blocks external redirects to `chrome-extension://`, so the service worker watches tabs and redirects internally. A chain of intermediate structures crossing a hard boundary.
- [x] **Incremental adaptation** — git history shows real-world feedback driving features (existing-user migration, topic filter fix, participation feed)
- [x] **Invisible when working well** — as a new-tab replacement, it's literally invisible when working well. You just see your neighborhood.
- [x] **No showroom engineering** — no flashy features. It shows links, sessions, and air quality. Practical.

**Observation:** The strongest property alongside Roughness. The project is deeply adapted to its Chrome extension context, its Citizen Infra ecosystem, and its users' actual workflow. The service worker auth bridge is a beautiful example of Alexander's "chains of centers crossing a hard boundary."

## Strengths

1. **Roughness** (6/6) — Every decision is adapted to real forces. The hand-rolled `getTimeAgo`, the hardcoded EU country set, the inline existing-user migration — these are the work of someone solving actual problems, not following a pattern book.

2. **Not-Separateness** (7/7) — Deeply adapted to Chrome extension constraints, the Citizen Infra ecosystem, and user workflow. The service worker auth bridge is a masterclass in bridging a hard edge.

3. **Levels of Scale** (5/5 applicable) — No file is too large or too small. The distribution from 8-line utilities to 342-line forms feels natural, with smooth transitions at every level.

## Growth Areas (Transformations to Apply)

1. **Boundaries** (1/5 applicable) — **Apply:** Extract a `db.js` or per-entity query modules that wrap Supabase calls. This doesn't need to be a full repository pattern — even grouping the query shapes (`linksQueries.load()`, `linksQueries.submit()`) would give the boundary enough thickness to have its own center, and would make the Supabase dependency swappable.

2. **Alternating Repetition** — **Apply:** Add a minimal test layer for the two highest-risk areas: the BFS neighborhood traversal (a pure function, trivially testable) and the link submission flow (currently duplicated between PopupForm and SubmitLinkForm). Tests would create a verification structure that alternates with and strengthens the production code.

3. **Positive Space** — **Apply:** Shape the `showAuthModal` interaction into a positive center. Currently it's a global signal set by LinksFeed and watched by TopBar — an invisible bus. Extracting it into a small `authGate.js` utility (or even just colocating the signal with a comment explaining the contract) would give this interstitial code its own recognizable form.

## Connections

The project's exceptional **Roughness** and **Not-Separateness** are deeply connected — both emerge from the same quality: adaptation to real forces rather than idealized patterns. The thin **Boundaries** are the price of this adaptation: when you're moving fast and adapting to real constraints, building thick boundary layers feels like unnecessary ceremony. But as the project grows (and it has already spawned a fork in `my-community`), the thin boundaries will make the other properties harder to maintain. The strong **Levels of Scale** and **Good Shape** create a codebase that's pleasant to read today, but without **Boundaries** and **Alternating Repetition** (tests), it may be hard to change safely tomorrow.

The **Strong Centers** ↔ **Echoes** connection is also notable: the store module pattern is so consistent that it serves as both a center (orienting newcomers) and an echo (making new stores trivial to create). This is exactly what Alexander meant by properties reinforcing each other.
