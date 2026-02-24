# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SimeonDev Portfolio is a **vanilla HTML/CSS/JS single-page application** deployed on Vercel with Supabase as the backend. There is no build step, no framework, and no bundler — everything is plain files served statically.

## Running Locally

Open `index.html` directly in a browser, or use any static file server:

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .
```

For Supabase to work locally, copy `js/config.example.js` to `js/config.js` and fill in your credentials. `js/config.js` is gitignored.

## Architecture

### Single-Page Navigation
All pages live in `index.html` as `<div id="page-name" class="page">` elements. Navigation is handled by `showPage(pageId)` in `js/main.js`, which toggles the `active` class and calls `initializePageData(pageId)` to lazy-load Supabase data per page.

### CSS Loading Order (Critical)
CSS files are loaded in a specific order defined in `index.html` — **do not reorder them**. Later files override earlier ones:
1. `theme.css` — CSS custom properties / design tokens
2. `typography.css`, `layouts.css`, `components.css` — base styles
3. Per-section files: `navigation.css`, `hero-2025.css`, `project-cards-minimal.css`, `project-modal.css`, `skills-enhanced.css`, `about-enhanced.css`, `services-enhanced.css`, `contact-enhanced.css`, `footer.css`
4. `animations.css`, `utilities.css`, `responsive.css` — overrides
5. `main.css`, `sections.css` — last, highest specificity base styles

When adding CSS, put it in the most specific existing file for that section. All CSS files use `?v=YYYYMMDD` query params for cache busting — update the version when making changes.

### JavaScript Modules (Global Window Pattern)
There is no ES module system. Each JS file exposes functions via `window.*` globals:
- `js/supabase-client.js` — initializes `window.supabaseClient`, analytics helpers (`trackPageView`, `trackProjectClick`, etc.)
- `js/main.js` — `showPage()`, navigation, scroll animations, `showNotification()`
- `js/projects-supabase.js` — `loadFeaturedProjects()`, `initializeProjects()`, `filterProjects()`, card rendering
- `js/blog-supabase.js` — blog post fetching/rendering, `initializeBlog()`, `showBlogPost()`, social sharing
- `js/contact-supabase.js` — contact form submission, spam protection, FAQ toggles
- `js/newsletter-supabase.js` — newsletter subscription (sole owner of newsletter form)
- `js/photo-carousel.js` — profile photo rotation on About page
- `js/animations.js` — particle system, mouse trail effects
- `js/footer.js` — footer animations, Privacy Policy / Terms modals
- `js/title-rotator.js` — rotating job titles on home hero

Scripts must be loaded in dependency order in `index.html` (Supabase CDN → `supabase-client.js` → everything else).

### Supabase Backend
- **Tables**: `projects`, `blog_posts`, `contact_submissions`, `subscribers`, `page_views`, `project_clicks`, `blog_post_views`
- **Credentials**:
  - Local: `js/config.js` (gitignored) sets `window.SUPABASE_CONFIG`
  - Production: `js/env.js` contains the hardcoded public anon key (safe to commit)
  - `js/config.example.js` is the template — copy to `config.js` for local dev

### Deployment
Vercel serves the repo root as a static site. `vercel.json` rewrites all routes to `index.html` (SPA behavior). CSS files are served with `Cache-Control: no-cache` to avoid stale styles after deployment.

## Canonical Ownership (post-audit)
- **Newsletter form**: `newsletter-supabase.js` only — `footer.js` no longer competes
- **`trackProjectClick`**: `supabase-client.js` only — removed from `projects-supabase.js` and `project-modal.js`
- **`updateNavigationState`**: `main.js` only
- **`showNotification`**: `main.js` only
- **`.container`**: `layouts.css` only (removed from `main.css`)
- **`.section-header`**: `main.css` only (removed from `layouts.css`, `utilities.css`)

## Audit & Fix History

See `FIXES.md` for the full audit log (Feb 2026). Two full audits were completed. Key fixes:
- `loadFeaturedProjects` and `initializeProjects` now correctly exported from `projects-supabase.js`
- `showNotification(message, type)` defined globally in `main.js`
- Mock newsletter handler removed from `footer.js`
- `trackProjectClick` consolidated to one definition; broken `supabaseClient.raw()` calls removed
- Mobile nav CSS selectors corrected (`.active` / `.mobile-menu-toggle`)
- `messageField` ReferenceError fixed in `contact-supabase.js`
- All dead files deleted: `src/` React folder, `un_use_files/`, `claude.md` duplicate, `package-lock.json`, `PROJECT_STRUCTURE.md`, build config files

**Known remaining issues** (require Supabase DB changes, not JS):
- `incrementProjectViews()` calls `.rpc('increment_project_details_views')` — RPC not yet defined in DB
- `trackBlogPostView()` in `supabase-client.js` uses `supabaseClient.raw()` (invalid in Supabase JS v2)

## Key Conventions

- **Responsive breakpoints**: Desktop `>1024px`, Tablet `768–1023px`, Mobile `<768px`, Small mobile `<480px`
- **Design tokens**: All colors, spacing, and typography are CSS custom properties in `css/theme.css`
- **No build artifacts to commit**: `node_modules/` exists but is only from an old experimental phase — not used
