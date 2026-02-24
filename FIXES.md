# Codebase Audit & Fixes — February 2026

This document records every issue found during the full codebase audit and exactly what was changed to fix it.

---

## Fix 1 — Missing `loadFeaturedProjects` & `initializeProjects` (CRITICAL)

**Problem:**
`main.js` calls two functions that did not exist under those names:
- `loadFeaturedProjects()` — called at `main.js:74` when home page loads
- `initializeProjects()` — called at `main.js:90` and `main.js:227` when projects page loads

`projects-supabase.js` had the real implementations but under different names:
- `renderFeaturedProjects()` — loaded featured projects for home page
- `initProjects()` — initialized the full projects page

**Impact:** Home page never loaded featured projects. Projects page never loaded.

**Fix:** `js/projects-supabase.js` — replaced the export block at the bottom:
```js
// Before
window.fetchProjects = fetchProjects;
window.renderFeaturedProjects = renderFeaturedProjects;
window.renderAllProjects = renderAllProjects;
window.filterProjects = filterProjects;

// After
window.loadFeaturedProjects = renderFeaturedProjects; // name main.js expects
window.initializeProjects = initProjects;             // name main.js expects
window.filterProjects = filterProjects;               // used by filter buttons
```

---

## Fix 2 — Missing `showNotification()` (HIGH)

**Problem:**
`blog-supabase.js` calls `showNotification()` in 8 places (real-time update handlers, blog post navigation, clipboard copy) but the function was never defined anywhere. This caused silent runtime errors every time a blog update occurred or a user navigated between posts.

**Impact:** All blog notifications silently failed. `copyToClipboard()` would throw an uncaught error.

**Fix:** `js/main.js` — added a global `showNotification(message, type)` function before the window exports:
- Displays a styled toast in the top-right corner
- Supports types: `success`, `error`, `warning`, `info`
- Auto-removes after 4 seconds
- Exported as `window.showNotification`

---

## Fix 3 — Duplicate / Mock Newsletter Handler (MEDIUM)

**Problem:**
Two files both attached a submit handler to `#newsletter-form`:

| File | Function | What it did |
|---|---|---|
| `newsletter-supabase.js` | `handleNewsletterSubmission` | Real: inserts into Supabase `subscribers` table |
| `footer.js` | `handleNewsletterSubmission` | **Mock**: faked success after 1.5s timeout, saved nothing |

Both files called `document.addEventListener('DOMContentLoaded', ...)`, so both handlers fired when the form was submitted. Since `footer.js` loaded after `newsletter-supabase.js`, the mock ran second — overriding any visual feedback from the real handler.

Also duplicated between the two files: `validateEmail()`, `showNewsletterMessage()`.

**Impact:** Newsletter subscriptions appeared to succeed but were never saved to the database.

**Fix:** `js/footer.js`:
- Removed `setupNewsletterForm()` and its `DOMContentLoaded` call
- Removed `handleNewsletterSubmission()` (mock)
- Removed `subscribeToNewsletter()` (mock API)
- Removed `showNewsletterMessage()` (duplicate)
- Removed `validateEmail()` (duplicate)
- Removed `trackNewsletterSubscription()` (only wrote to localStorage)

`newsletter-supabase.js` now owns the newsletter form exclusively.

---

## Fix 4 — Triple-Defined `trackProjectClick()` (HIGH)

**Problem:**
Three different implementations existed:

| File | Load order | Implementation | Bug |
|---|---|---|---|
| `supabase-client.js` | 3rd | Inserts into `project_clicks` table + tries to increment counter | Used `supabaseClient.raw()` which does not exist in Supabase JS v2 |
| `projects-supabase.js` | 4th | Calls `.rpc('increment_project_clicks')` | RPC function never defined in DB |
| `project-modal.js` | 9th (last) | Direct `projects` table update | Used `supabaseClient.raw()` — same broken pattern; **overwrote** the others because it loaded last |

**Impact:** `project-modal.js` silently won the race every time. Its `.raw()` calls created invalid queries that likely threw Supabase client errors.

**Fix:**
- `js/supabase-client.js` — kept as the single canonical version, removed the broken `.raw()` counter-increment block. Now only inserts a clean row into `project_clicks`.
- `js/projects-supabase.js` — removed entire `trackProjectClick` function and its block.
- `js/project-modal.js` — removed the `trackProjectClick` function and its `window.trackProjectClick` export. Added a comment pointing to `supabase-client.js`.

---

## Fix 5 — Dead CSS Class Names in `animations.js` (LOW)

**Problem:**
`js/animations.js` injects a `<style>` block into `<head>` at runtime. Two selectors in that block used wrong class names:

| Selector used | Actual HTML class | Effect |
|---|---|---|
| `.nav-links.mobile-open` | `.nav-links.active` | Mobile nav never styled when open |
| `.mobile-toggle` | `.mobile-menu-toggle` | Hamburger button never forced visible on mobile |

**Impact:** Mobile navigation menu may not have displayed correctly on small screens.

**Fix:** `js/animations.js` lines 265 and 279 — corrected both selectors to match the actual HTML:
```js
// Before
.nav-links.mobile-open { ... }
.mobile-toggle { ... }

// After
.nav-links.active { ... }
.mobile-menu-toggle { ... }
```

---

## Fix 6 — Deleted Unused Root-Level Files (MEDIUM)

**Files deleted:**

| File | Reason |
|---|---|
| `nul` | Empty 0-byte file, artifact of a Windows `> nul` shell redirect |
| `vite.config.js` | No build pipeline — project is pure static HTML/CSS/JS |
| `tailwind.config.js` | Tailwind not used anywhere in the codebase |
| `postcss.config.js` | PostCSS not used |
| `test-portfolio.js` | Old test file, not referenced by anything |
| `inject-env.js` | Designed to replace placeholders in `env.js`, but `env.js` uses hardcoded values — script was non-functional |
| `sql/reset-analytics.sql` | Entirely commented out — empty in effect |

**`package.json` cleaned:** Removed `react`, `react-dom`, `three`, `@react-three/fiber`, `@react-three/drei`, `@vitejs/plugin-react`, `tailwindcss`, `postcss`, `vite`, `autoprefixer`. None are used. The file now reflects reality (plain static site, no build step).

---

## Fix 7 — Duplicate `updateNavigationState` & Unnecessary Globals (LOW)

**Problem:**
`updateNavigationState()` was defined identically in both `main.js:125` and `blog-supabase.js:410`. The one in `main.js` is canonical.

Also, several functions were exported to `window` that nothing ever called externally:
- `window.fetchProjects` (`projects-supabase.js`)
- `window.renderFeaturedProjects` (`projects-supabase.js`)
- `window.renderAllProjects` (`projects-supabase.js`)
- `window.initializeNewsletterForm` (`newsletter-supabase.js`)
- `window.SimeonDev` namespace object (`main.js`)
- `window.fetchBlogPosts` (`blog-supabase.js`)

**Fix:**
- `js/blog-supabase.js` — removed the duplicate `updateNavigationState()` definition entirely.
- `js/projects-supabase.js` — trimmed exports to only what `main.js` needs (`loadFeaturedProjects`, `initializeProjects`, `filterProjects`).
- `js/newsletter-supabase.js` — removed `window.initializeNewsletterForm` export.
- `js/main.js` — removed `window.SimeonDev` namespace object.
- `js/blog-supabase.js` — removed `window.fetchBlogPosts`; added missing exports for `showPreviousBlog` and `showNextBlog` which are called from HTML onclick attributes in the blog detail view.

---

## Summary Table

| # | File(s) Changed | Issue | Severity |
|---|---|---|---|
| 1 | `projects-supabase.js` | `loadFeaturedProjects` / `initializeProjects` never exported | Critical |
| 2 | `main.js` | `showNotification` never defined | High |
| 3 | `footer.js` | Mock newsletter handler competing with real Supabase one | High |
| 4 | `supabase-client.js`, `projects-supabase.js`, `project-modal.js` | `trackProjectClick` defined 3× with broken `.raw()` calls | High |
| 5 | `animations.js` | `.mobile-open` / `.mobile-toggle` CSS selectors matched nothing | Low |
| 6 | `nul`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `test-portfolio.js`, `inject-env.js`, `sql/reset-analytics.sql`, `package.json` | Unused/garbage files and phantom dependencies | Medium |
| 7 | `blog-supabase.js`, `projects-supabase.js`, `newsletter-supabase.js`, `main.js` | Duplicate function + unnecessary global exports | Low |

---

# Audit 2 — February 2026 (Second Pass)

## Fix 8 — Deleted src/ React Folder (CRITICAL)

**Problem:** A `src/` folder containing 4 React files existed from an abandoned React + Three.js migration attempt:
- `src/App.jsx` — React app shell
- `src/HeroSection.jsx` — Three.js 3D sphere hero (using `@react-three/fiber`, `@react-three/drei`, `three`)
- `src/main.jsx` — React DOM entry point
- `src/index.css` — React styles

None of these were referenced in `index.html`. The project is pure vanilla HTML/CSS/JS.
**Files deleted:** `src/App.jsx`, `src/HeroSection.jsx`, `src/main.jsx`, `src/index.css` (~48K total)

## Fix 9 — Deleted More Garbage Files

| File | Reason |
|---|---|
| `claude.md` (lowercase) | Duplicate of `CLAUDE.md` — Claude Code only reads the uppercase version |
| `package-lock.json` | 132K lock file with no packages to lock |
| `PROJECT_STRUCTURE.md` | Outdated documentation (12K) — superseded by CLAUDE.md |
| `un_use_files/` (entire folder) | Archive of superseded files — nothing in the active codebase references any of it. Included: old JS, old CSS, old HTML, test files, broken-filename artifacts (`docs && mv ...`), docs |

**Total space recovered:** ~420K of dead files removed across both audits.

## Fix 10 — `messageField` ReferenceError in `contact-supabase.js` (HIGH)

**Problem:** `messageField` was declared as `const` inside `initializeContactForm()` (local scope). But `handleContactFormSubmission()` at line 140 referenced it — outside that scope. Every successful contact form submission threw `ReferenceError: messageField is not defined`, breaking the char counter reset.

**Fix:** `js/contact-supabase.js:140` — re-query the element inline:
```js
// Before
updateCharCounter({ target: messageField }); // ReferenceError

// After
const messageField = form.querySelector('#message');
if (messageField) updateCharCounter({ target: messageField }); // safe
```

## Fix 11 — Removed Dead Code from JS Files

| File | What was removed | Reason |
|---|---|---|
| `animations.js` | `window.SimeonDevAnimations = { ... }` | Never called from anywhere |
| `title-rotator.js` | `if (typeof module !== 'undefined' && module.exports) { ... }` | Node.js pattern in a browser-only file — dead code |
| `contact-supabase.js` | `window.initializeContactForm = initializeContactForm` | Self-initializes on DOMContentLoaded — never called externally |

## Fix 12 — Removed Duplicate CSS Definitions (MEDIUM)

**Problem:** Three CSS definitions appeared in multiple files:

| Selector | Defined in | Issue |
|---|---|---|
| `.container` | `layouts.css:121` AND `main.css:73` | `main.css` (loads last) overwrote `layouts.css`'s better responsive version |
| `.section-header` | `main.css:96`, `layouts.css:186`, `utilities.css:88` | Triple definition, main.css version (with h2/p children) was most complete |

**Fix:**
- Removed `.container` from `main.css` — `layouts.css` version now applies (has responsive padding breakpoints)
- Removed bare `.section-header` from `layouts.css` and `utilities.css` — `main.css` version is canonical (includes `.section-header h2` and `.section-header p` children)

---

## Known Remaining Issues (Not Fixed — Require DB Changes)

- `incrementProjectViews()` in `projects-supabase.js` calls `.rpc('increment_project_details_views')` — this RPC function needs to be created in the Supabase database, or the call should be replaced with a direct table update.
- `supabase-client.js` `trackBlogPostView()` uses `supabaseClient.raw('view_count + 1')` on line 163 — same broken `.raw()` pattern. Requires a DB-side fix (RPC or trigger) to increment atomically.
