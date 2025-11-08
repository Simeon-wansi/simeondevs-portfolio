# 🚀 **COMPLETE UI IMPLEMENTATION PROMPT FOR CLAUDE CODE**

Copy this ENTIRE prompt and send it to Claude Code:

---

**TASK: Implement Minimalist Project Cards with Rich Details Modal**

## 🎯 OVERVIEW

We're upgrading the projects section to use a modern, scalable design:
- **Grid View:** Minimalist cards optimized for 50+ projects
- **Details View:** Rich modal with comprehensive project information
- **Database:** Already updated with new fields and 4 sample projects

## ⚠️ CRITICAL RULES

### **DO NOT TOUCH:**
- ❌ Navigation system
- ❌ Blog page and blog cards
- ❌ Contact form
- ❌ Footer
- ❌ Hero section (we just updated it)
- ❌ Other pages (About, Services)
- ❌ `js/main.js` navigation functions
- ❌ Database connection files (`js/supabase-client.js`)

### **ONLY MODIFY:**
- ✅ Projects page HTML structure
- ✅ Project card design
- ✅ Create new modal for project details
- ✅ Update `js/projects-supabase.js` for new database fields
- ✅ Create new `css/project-cards-minimal.css`
- ✅ Create new `css/project-modal.css`
- ✅ Create new `js/project-modal.js`

---

## 📊 DATABASE STRUCTURE

### **New Fields Added to `projects` Table:**

```javascript
// Fields we NOW have in database (use these):
{
    // Existing fields
    id,
    title,
    slug,
    description,          // Short description
    image_url,            // Hero image
    demo_url,
    github_url,
    technologies,         // Array
    category,
    status,
    featured,
    published,
    completed_date,
    view_count,
    github_clicks,
    demo_clicks,
    created_at,
    updated_at,
    
    // NEW fields for minimalist cards
    tagline,              // One-liner for cards
    primary_tech,         // Main technology
    
    // NEW fields for rich modal
    full_description,     // Detailed description
    thumbnail_url,        // Smaller image
    preview_gif_url,      // Animated preview
    video_url,            // Demo video
    gallery_urls,         // Array of images
    key_metrics,          // JSONB object
    highlights,           // Array of strings
    challenges,           // Text
    solutions,            // Text
    results,              // Text
    lessons_learned,      // Array
    
    // NEW metadata
    tags,                 // Array
    blog_post_url,
    case_study_url,
    start_date,
    project_duration,
    team_size,
    role,
    collaborators,        // Array
    
    // NEW AI scores
    complexity_score,     // 0-100
    innovation_score,     // 0-100
    business_impact_score,// 0-100
    
    // NEW analytics
    blog_clicks,
    details_views
}
```

---

## 🎨 DESIGN SPECIFICATION

### **Minimalist Project Card (Grid View)**

```
Visual Structure:
┌─────────────────────────────┐
│ ⭐ Featured    ✅ Completed │  ← Small badges (top-right)
├─────────────────────────────┤
│                             │
│   [Project Image]           │  ← 280px height, 16:9
│   Hover: slight zoom        │     Full-bleed
│                             │
├─────────────────────────────┤
│ GulfValidate                │  ← Title (18px, bold)
│                             │
│ Python · LangChain · AI     │  ← Tech tags (12px, muted)
│                             │
│ AI-powered startup          │  ← Tagline (14px)
│ validation for GCC...       │     One line, ellipsis
│                             │
│ 🎯 AI/ML  •  Oct 2024       │  ← Footer (12px, muted)
└─────────────────────────────┘
      Click anywhere → Opens modal
```

**Card Specifications:**
- **Width:** 100% (grid handles sizing)
- **Image height:** 280px (16:9 aspect ratio)
- **Padding:** 0 on image (full-bleed), 1.5rem on content
- **Border:** 1px solid rgba(139, 92, 246, 0.2)
- **Border radius:** 16px
- **Hover effect:** 
  - Lift up 8px
  - Glow shadow
  - Image zooms to 1.05
  - Border color intensifies
- **Entire card is clickable** (cursor: pointer)

### **Grid Layout:**

```css
/* Desktop: 3 columns */
.projects-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
}

/* Tablet: 2 columns */
@media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
}

/* Mobile: 1 column */
@media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
}
```

---

## 💎 DETAILED MODAL DESIGN

When user clicks any card, open full-screen modal:

```
Modal Structure:
╔═══════════════════════════════════════════════════╗
║  [×] Close                                        ║
║ ══════════════════════════════════════════════════║
║                                                   ║
║  ┌────────────────────────────────────────────┐  ║
║  │  [Hero Image - Large 600px height]        │  ║
║  └────────────────────────────────────────────┘  ║
║                                                   ║
║  ⭐ Featured  ✅ Completed  🎯 AI/ML              ║
║                                                   ║
║  GulfValidate                                     ║
║  ═══════════════                                  ║
║  AI-powered startup validation for GCC markets    ║
║                                                   ║
║  Python · LangChain · OpenAI API · Next.js       ║
║                                                   ║
║  📊 Key Metrics                                   ║
║  ┌──────────────────────────────────────────┐   ║
║  │ AI Agents: 11 specialized agents          │   ║
║  │ Analysis Time: 60 seconds                 │   ║
║  │ Markets Covered: All 6 GCC countries      │   ║
║  │ Startups Validated: 500+                  │   ║
║  └──────────────────────────────────────────┘   ║
║                                                   ║
║  🎯 Highlights                                    ║
║  • 11 specialized AI agents                      ║
║  • 60-second investment-grade reports            ║
║  • 6-dimension validation framework              ║
║  • 500+ startups validated                       ║
║                                                   ║
║  🤖 AI Analysis                                  ║
║  ┌──────────────────────────────────────────┐   ║
║  │ Technical Complexity:  ████████░░  92%    │   ║
║  │ Innovation Score:      █████████░  95%    │   ║
║  │ Business Impact:       ██████████  98%    │   ║
║  └──────────────────────────────────────────┘   ║
║                                                   ║
║  📝 Full Description                             ║
║  [Full detailed description from database]       ║
║                                                   ║
║  💪 Challenges                                    ║
║  [Challenges text from database]                 ║
║                                                   ║
║  ✨ Solutions                                     ║
║  [Solutions text from database]                  ║
║                                                   ║
║  🎉 Results                                       ║
║  [Results text from database]                    ║
║                                                   ║
║  📚 Lessons Learned                              ║
║  • [Lesson 1]                                    ║
║  • [Lesson 2]                                    ║
║                                                   ║
║  👥 Project Info                                 ║
║  Duration: 4.5 months                            ║
║  Team Size: Solo Developer                       ║
║  Completed: Oct 15, 2024                         ║
║                                                   ║
║  ┌──────────────┐ ┌──────────────┐ ┌──────────┐║
║  │ 🚀 Live Demo │ │ 💻 GitHub    │ │ 📖 Blog  │║
║  └──────────────┘ └──────────────┘ └──────────┘║
║                                                   ║
║  📈 Stats: 👁️ 1,247 views • 🔗 89 clicks        ║
╚═══════════════════════════════════════════════════╝
```

**Modal Specifications:**
- **Display:** Full-screen overlay with backdrop
- **Background:** Semi-transparent dark backdrop (rgba(0,0,0,0.8))
- **Content:** White/dark card (depending on theme) centered
- **Width:** Max 900px
- **Height:** Max 90vh with scroll
- **Animation:** Fade in + slide up
- **Close:** Click backdrop, [×] button, or ESC key
- **Scroll:** Smooth scroll within modal

---

## 📁 FILE STRUCTURE

```
portfolio-platform/
├── index.html                          (UPDATE projects section)
├── css/
│   ├── theme.css                      (existing - don't touch)
│   ├── project-cards-minimal.css      (CREATE NEW)
│   └── project-modal.css              (CREATE NEW)
├── js/
│   ├── supabase-client.js             (existing - don't touch)
│   ├── projects-supabase.js           (UPDATE for new fields)
│   ├── project-modal.js               (CREATE NEW)
│   └── main.js                        (existing - don't touch)
```

---

## 🔧 IMPLEMENTATION STEPS

### **STEP 1: Update HTML Structure**

**File: `index.html`**

Find the projects page section (probably `<div id="projects" class="page">`) and REPLACE with:

```html
<!-- ============================================
     PROJECTS PAGE - MINIMALIST CARDS
     ============================================ -->
<div id="projects" class="page">
    <div class="container">
        <!-- Page Header -->
        <div class="section-header">
            <h1 class="section-title">Projects</h1>
            <p class="section-subtitle">
                Building intelligent applications that solve real-world problems
            </p>
        </div>
        
        <!-- Filter Tabs (Optional - can add later) -->
        <div class="projects-filters">
            <button class="filter-btn active" data-filter="all">All Projects</button>
            <button class="filter-btn" data-filter="AI/ML">AI/ML</button>
            <button class="filter-btn" data-filter="Web Development">Web Development</button>
            <button class="filter-btn" data-filter="Cybersecurity">Cybersecurity</button>
        </div>
        
        <!-- Featured Projects Section -->
        <div class="featured-section">
            <h2 class="subsection-title">Featured Projects</h2>
            <div class="projects-grid" id="featuredProjectsGrid">
                <!-- Featured project cards loaded here by JS -->
                <div class="loading-skeleton">
                    <div class="skeleton-card"></div>
                    <div class="skeleton-card"></div>
                </div>
            </div>
        </div>
        
        <!-- All Projects Section -->
        <div class="all-projects-section">
            <h2 class="subsection-title">All Projects</h2>
            <div class="projects-grid" id="allProjectsGrid">
                <!-- All project cards loaded here by JS -->
                <div class="loading-skeleton">
                    <div class="skeleton-card"></div>
                    <div class="skeleton-card"></div>
                    <div class="skeleton-card"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- ============================================
     PROJECT DETAILS MODAL
     ============================================ -->
<div id="projectModal" class="project-modal" style="display: none;">
    <div class="modal-backdrop" onclick="closeProjectModal()"></div>
    <div class="modal-content">
        <button class="modal-close" onclick="closeProjectModal()" aria-label="Close modal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
        </button>
        
        <div class="modal-scroll" id="modalScrollContent">
            <!-- Content dynamically loaded by JS -->
        </div>
    </div>
</div>
```

---

### **STEP 2: Create Minimalist Card CSS**

**File: `css/project-cards-minimal.css` (CREATE NEW)**

```css
/* ============================================
   MINIMALIST PROJECT CARDS - 2026 STYLE
   Grid view optimized for 50+ projects
   ============================================ */

/* === SECTION LAYOUT === */
.section-header {
    text-align: center;
    margin-bottom: 3rem;
}

.section-title {
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    font-weight: 900;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.section-subtitle {
    font-size: 1.125rem;
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
}

/* === FILTERS === */
.projects-filters {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 3rem;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 0.75rem 1.5rem;
    background: transparent;
    border: 2px solid var(--border-primary);
    border-radius: 9999px;
    color: var(--text-secondary);
    font-weight: 600;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.filter-btn:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background: rgba(139, 92, 246, 0.1);
}

.filter-btn.active {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: white;
}

/* === SECTION SPACING === */
.featured-section {
    margin-bottom: 4rem;
}

.subsection-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 2rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid var(--border-primary);
}

/* === GRID LAYOUT === */
.projects-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-bottom: 2rem;
}

@media (max-width: 1200px) {
    .projects-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
    }
}

@media (max-width: 768px) {
    .projects-grid {
        grid-template-columns: 1fr;
        gap: 1.25rem;
    }
}

/* === MINIMALIST PROJECT CARD === */
.project-card-minimal {
    background: var(--bg-secondary);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    position: relative;
    display: flex;
    flex-direction: column;
}

.project-card-minimal:hover {
    transform: translateY(-8px);
    border-color: rgba(139, 92, 246, 0.6);
    box-shadow: 0 20px 40px rgba(139, 92, 246, 0.3);
}

/* === CARD IMAGE === */
.project-image-wrapper {
    position: relative;
    width: 100%;
    height: 280px;
    overflow: hidden;
    background: var(--bg-tertiary);
}

.project-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.project-card-minimal:hover .project-image {
    transform: scale(1.05);
}

/* Image overlay on hover */
.project-image-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 2rem;
}

.project-card-minimal:hover .project-image-overlay {
    opacity: 1;
}

.overlay-text {
    color: white;
    font-weight: 600;
    font-size: 0.9375rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.overlay-text svg {
    width: 20px;
    height: 20px;
}

/* === STATUS BADGES === */
.project-badges {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    gap: 0.5rem;
    z-index: 10;
}

.project-badge {
    padding: 0.375rem 0.75rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.badge-featured {
    background: rgba(245, 158, 11, 0.9);
    color: white;
}

.badge-completed {
    background: rgba(34, 197, 94, 0.9);
    color: white;
}

.badge-in-progress {
    background: rgba(139, 92, 246, 0.9);
    color: white;
}

/* === CARD CONTENT === */
.project-content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    flex: 1;
}

.project-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* === TECH TAGS === */
.project-techs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tech-tag-minimal {
    font-size: 0.75rem;
    color: var(--color-primary-light);
    opacity: 0.9;
    white-space: nowrap;
}

.tech-tag-minimal::after {
    content: '·';
    margin-left: 0.5rem;
    opacity: 0.5;
}

.tech-tag-minimal:last-child::after {
    content: '';
}

/* === TAGLINE === */
.project-tagline {
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* === FOOTER === */
.project-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--text-muted);
    padding-top: 0.75rem;
    border-top: 1px solid var(--border-secondary);
    margin-top: auto;
}

.project-category {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-weight: 500;
}

.project-date {
    opacity: 0.8;
}

/* === LOADING SKELETON === */
.loading-skeleton {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
}

@media (max-width: 1200px) {
    .loading-skeleton {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .loading-skeleton {
        grid-template-columns: 1fr;
    }
}

.skeleton-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    overflow: hidden;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.skeleton-card::before {
    content: '';
    display: block;
    padding-top: 140%; /* Approximate card aspect ratio */
    background: linear-gradient(
        90deg,
        transparent,
        rgba(139, 92, 246, 0.1),
        transparent
    );
    animation: shimmer 2s infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

@keyframes shimmer {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(100%);
    }
}

/* === EMPTY STATE === */
.projects-empty {
    text-align: center;
    padding: 4rem 2rem;
}

.projects-empty h3 {
    font-size: 1.5rem;
    color: var(--text-secondary);
    margin-bottom: 1rem;
}

.projects-empty p {
    color: var(--text-muted);
}
```

---

### **STEP 3: Create Modal CSS**

**File: `css/project-modal.css` (CREATE NEW)**

```css
/* ============================================
   PROJECT DETAILS MODAL - RICH CONTENT
   ============================================ */

/* === MODAL OVERLAY === */
.project-modal {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.modal-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(4px);
    cursor: pointer;
}

/* === MODAL CONTENT === */
.modal-content {
    position: relative;
    width: 100%;
    max-width: 900px;
    max-height: 90vh;
    background: var(--bg-primary);
    border-radius: 24px;
    border: 1px solid var(--border-primary);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* === CLOSE BUTTON === */
.modal-close {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: all 0.3s ease;
}

.modal-close:hover {
    background: var(--color-primary);
    border-color: var(--color-primary);
    transform: rotate(90deg);
}

.modal-close svg {
    width: 20px;
    height: 20px;
    stroke: var(--text-primary);
}

.modal-close:hover svg {
    stroke: white;
}

/* === SCROLLABLE CONTENT === */
.modal-scroll {
    overflow-y: auto;
    padding: 2rem;
    flex: 1;
}

.modal-scroll::-webkit-scrollbar {
    width: 8px;
}

.modal-scroll::-webkit-scrollbar-track {
    background: var(--bg-secondary);
}

.modal-scroll::-webkit-scrollbar-thumb {
    background: var(--color-primary);
    border-radius: 4px;
}

.modal-scroll::-webkit-scrollbar-thumb:hover {
    background: var(--color-primary-dark);
}

/* === MODAL HERO IMAGE === */
.modal-hero-image {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 2rem;
}

@media (max-width: 768px) {
    .modal-hero-image {
        height: 250px;
    }
}

/* === MODAL HEADER === */
.modal-header {
    margin-bottom: 2rem;
}

.modal-badges {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.modal-badge {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.modal-title {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 900;
    color: var(--text-primary);
    margin-bottom: 1rem;
    line-height: 1.2;
}

.modal-tagline {
    font-size: 1.25rem;
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
}

.modal-techs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.modal-tech-tag {
    padding: 0.5rem 1rem;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid var(--border-primary);
    border-radius: 8px;
    color: var(--color-primary-light);
    font-size: 0.875rem;
    font-weight: 500;
}

/* === KEY METRICS === */
.modal-section {
    margin-bottom: 2.5rem;
}

.modal-section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.modal-section-title::before {
    content: '';
    width: 4px;
    height: 1.5rem;
    background: var(--color-accent);
    border-radius: 2px;
}

.key-metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    padding: 1.5rem;
    background: var(--bg-secondary);
    border-radius: 12px;
    border: 1px solid var(--border-primary);
}

.metric-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.metric-label {
    font-size: 0.875rem;
    color: var(--text-muted);
    font-weight: 500;
}

.metric-value {
    font-size: 1.125rem;
    color: var(--color-primary-light);
    font-weight: 700;
}

/* === HIGHLIGHTS === */
.highlights-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.highlight-item {
    padding: 1rem 1.25rem;
    background: var(--bg-secondary);
    border-left: 3px solid var(--color-primary);
    border-radius: 8px;
    font-size: 0.9375rem;
    line-height: 1.6;
    color: var(--text-secondary);
}

.highlight-item::before {
    content: '✓';
    color: var(--color-accent);
    font-weight: 700;
    margin-right: 0.75rem;
}

/* === AI SCORES === */
.ai-scores {
    padding: 1.5rem;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(245, 158, 11, 0.1));
    border-radius: 12px;
    border: 1px solid var(--border-primary);
}

.score-item {
    margin-bottom: 1.25rem;
}

.score-item:last-child {
    margin-bottom: 0;
}

.score-header {
    display: flex;
    justify-content: space-between;
    ```css
    align-items: center;
    margin-bottom: 0.5rem;
}

.score-label {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--text-primary);
}

.score-value {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-accent);
}

.score-bar {
    width: 100%;
    height: 8px;
    background: var(--bg-tertiary);
    border-radius: 4px;
    overflow: hidden;
}

.score-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
    border-radius: 4px;
    transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

/* === TEXT CONTENT === */
.modal-text-content {
    font-size: 1rem;
    line-height: 1.8;
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
}

.modal-text-content p {
    margin-bottom: 1rem;
}

.modal-text-content p:last-child {
    margin-bottom: 0;
}

/* === LESSONS LEARNED === */
.lessons-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.lesson-item {
    padding: 1rem 1.25rem;
    background: var(--bg-secondary);
    border-left: 3px solid var(--color-accent);
    border-radius: 8px;
    font-size: 0.9375rem;
    line-height: 1.6;
    color: var(--text-secondary);
    font-style: italic;
}

.lesson-item::before {
    content: '💡';
    margin-right: 0.75rem;
}

/* === PROJECT INFO === */
.project-info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    padding: 1.5rem;
    background: var(--bg-secondary);
    border-radius: 12px;
    border: 1px solid var(--border-primary);
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.info-label {
    font-size: 0.875rem;
    color: var(--text-muted);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.info-value {
    font-size: 1rem;
    color: var(--text-primary);
    font-weight: 600;
}

/* === ACTION BUTTONS === */
.modal-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border-primary);
    flex-wrap: wrap;
}

.modal-btn {
    flex: 1;
    min-width: 200px;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
}

.modal-btn-primary {
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
    color: white;
    border: none;
}

.modal-btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
}

.modal-btn-secondary {
    background: transparent;
    color: var(--color-primary-light);
    border: 2px solid var(--border-primary);
}

.modal-btn-secondary:hover {
    background: rgba(139, 92, 246, 0.1);
    border-color: var(--color-primary);
}

.modal-btn svg {
    width: 20px;
    height: 20px;
}

/* === MODAL FOOTER === */
.modal-footer {
    padding: 1.5rem;
    background: var(--bg-secondary);
    border-top: 1px solid var(--border-primary);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.875rem;
    color: var(--text-muted);
    flex-wrap: wrap;
    gap: 1rem;
}

.footer-stats {
    display: flex;
    gap: 2rem;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
    .project-modal {
        padding: 0;
    }
    
    .modal-content {
        max-height: 100vh;
        border-radius: 0;
        max-width: 100%;
    }
    
    .modal-scroll {
        padding: 1.5rem;
    }
    
    .modal-close {
        top: 1rem;
        right: 1rem;
    }
    
    .modal-title {
        font-size: 1.75rem;
    }
    
    .modal-tagline {
        font-size: 1rem;
    }
    
    .key-metrics-grid {
        grid-template-columns: 1fr;
    }
    
    .project-info-grid {
        grid-template-columns: 1fr;
    }
    
    .modal-actions {
        flex-direction: column;
    }
    
    .modal-btn {
        width: 100%;
    }
}

/* === ANIMATIONS === */
.modal-scroll > * {
    animation: fadeInUp 0.6s ease forwards;
    opacity: 0;
}

.modal-scroll > *:nth-child(1) { animation-delay: 0.1s; }
.modal-scroll > *:nth-child(2) { animation-delay: 0.2s; }
.modal-scroll > *:nth-child(3) { animation-delay: 0.3s; }
.modal-scroll > *:nth-child(4) { animation-delay: 0.4s; }
.modal-scroll > *:nth-child(5) { animation-delay: 0.5s; }

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

---

### **STEP 4: Update Projects JavaScript**

**File: `js/projects-supabase.js` (UPDATE EXISTING)**

Replace the entire file with:

```javascript
/**
 * PROJECTS SUPABASE INTEGRATION
 * Fetches projects with all new fields and renders minimalist cards
 */

// Import supabase client
// Assumes supabase client is already initialized in supabase-client.js

// ============================================
// FETCH PROJECTS FROM SUPABASE
// ============================================

async function fetchProjects(featured = null) {
    try {
        let query = supabase
            .from('projects')
            .select(`
                id,
                slug,
                title,
                tagline,
                description,
                full_description,
                image_url,
                thumbnail_url,
                preview_gif_url,
                video_url,
                gallery_urls,
                technologies,
                primary_tech,
                category,
                tags,
                status,
                featured,
                published,
                github_url,
                demo_url,
                blog_post_url,
                case_study_url,
                key_metrics,
                highlights,
                challenges,
                solutions,
                results,
                lessons_learned,
                start_date,
                completed_date,
                project_duration,
                team_size,
                role,
                collaborators,
                complexity_score,
                innovation_score,
                business_impact_score,
                view_count,
                github_clicks,
                demo_clicks,
                blog_clicks,
                details_views,
                created_at,
                updated_at
            `)
            .eq('published', true)
            .order('created_at', { ascending: false });
        
        // Filter by featured status if specified
        if (featured !== null) {
            query = query.eq('featured', featured);
        }
        
        const { data, error } = await query;
        
        if (error) {
            console.error('Error fetching projects:', error);
            return [];
        }
        
        console.log(`✅ Fetched ${data.length} projects`);
        return data;
        
    } catch (error) {
        console.error('Unexpected error fetching projects:', error);
        return [];
    }
}

// ============================================
// RENDER MINIMALIST PROJECT CARD
// ============================================

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card-minimal';
    card.setAttribute('data-project-id', project.id);
    card.setAttribute('data-project-slug', project.slug);
    card.onclick = () => openProjectModal(project);
    
    // Status badges
    const badges = [];
    if (project.featured) {
        badges.push(`
            <span class="project-badge badge-featured">
                ⭐ Featured
            </span>
        `);
    }
    
    const statusBadge = project.status === 'completed' 
        ? '<span class="project-badge badge-completed">✅ Completed</span>'
        : '<span class="project-badge badge-in-progress">🔨 In Progress</span>';
    badges.push(statusBadge);
    
    // Tech tags (show first 3)
    const techTags = project.technologies.slice(0, 3).map(tech => 
        `<span class="tech-tag-minimal">${tech}</span>`
    ).join('');
    
    // Format date
    const date = new Date(project.completed_date || project.created_at);
    const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
    });
    
    // Use thumbnail if available, otherwise use main image
    const imageUrl = project.thumbnail_url || project.image_url;
    
    card.innerHTML = `
        <div class="project-image-wrapper">
            <img src="${imageUrl}" 
                 alt="${project.title}" 
                 class="project-image"
                 loading="lazy">
            <div class="project-image-overlay">
                <span class="overlay-text">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    View Details
                </span>
            </div>
            <div class="project-badges">
                ${badges.join('')}
            </div>
        </div>
        
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            
            <div class="project-techs">
                ${techTags}
            </div>
            
            <p class="project-tagline">
                ${project.tagline || project.description}
            </p>
            
            <div class="project-footer">
                <span class="project-category">
                    🎯 ${project.category}
                </span>
                <span class="project-date">
                    ${formattedDate}
                </span>
            </div>
        </div>
    `;
    
    return card;
}

// ============================================
// RENDER PROJECTS GRID
// ============================================

async function renderFeaturedProjects() {
    const grid = document.getElementById('featuredProjectsGrid');
    if (!grid) return;
    
    // Show loading
    grid.innerHTML = `
        <div class="loading-skeleton">
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
        </div>
    `;
    
    const projects = await fetchProjects(true); // Only featured
    
    if (projects.length === 0) {
        grid.innerHTML = `
            <div class="projects-empty">
                <h3>No featured projects yet</h3>
                <p>Check back soon for featured projects!</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = '';
    projects.forEach(project => {
        const card = createProjectCard(project);
        grid.appendChild(card);
    });
    
    console.log(`✅ Rendered ${projects.length} featured projects`);
}

async function renderAllProjects() {
    const grid = document.getElementById('allProjectsGrid');
    if (!grid) return;
    
    // Show loading
    grid.innerHTML = `
        <div class="loading-skeleton">
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
        </div>
    `;
    
    const projects = await fetchProjects(false); // Non-featured only
    
    if (projects.length === 0) {
        grid.innerHTML = `
            <div class="projects-empty">
                <h3>No projects yet</h3>
                <p>Projects coming soon!</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = '';
    projects.forEach(project => {
        const card = createProjectCard(project);
        grid.appendChild(card);
    });
    
    console.log(`✅ Rendered ${projects.length} projects`);
}

// ============================================
// INCREMENT VIEW COUNT
// ============================================

async function incrementProjectViews(projectId) {
    try {
        const { error } = await supabase.rpc('increment_project_details_views', {
            project_id: projectId
        });
        
        if (error) {
            console.error('Error incrementing views:', error);
        }
    } catch (error) {
        console.error('Unexpected error incrementing views:', error);
    }
}

// ============================================
// TRACK LINK CLICKS
// ============================================

async function trackProjectClick(projectId, clickType) {
    try {
        const field = `${clickType}_clicks`; // github_clicks, demo_clicks, blog_clicks
        
        const { error } = await supabase.rpc('increment_project_clicks', {
            project_id: projectId,
            click_field: field
        });
        
        if (error) {
            console.error(`Error tracking ${clickType} click:`, error);
        }
    } catch (error) {
        console.error('Unexpected error tracking click:', error);
    }
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjects);
} else {
    initProjects();
}

async function initProjects() {
    console.log('🚀 Initializing projects...');
    
    await renderFeaturedProjects();
    await renderAllProjects();
    
    console.log('✅ Projects initialized');
}

// ============================================
// FILTER FUNCTIONALITY (Optional)
// ============================================

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active from all buttons
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('active');
        });
        
        // Add active to clicked button
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        filterProjects(filter);
    });
});

async function filterProjects(category) {
    const grid = document.getElementById('allProjectsGrid');
    if (!grid) return;
    
    grid.innerHTML = '<div class="loading-skeleton"><div class="skeleton-card"></div></div>';
    
    let projects = await fetchProjects(false);
    
    if (category !== 'all') {
        projects = projects.filter(p => p.category === category);
    }
    
    grid.innerHTML = '';
    projects.forEach(project => {
        const card = createProjectCard(project);
        grid.appendChild(card);
    });
}
```

---

### **STEP 5: Create Modal JavaScript**

**File: `js/project-modal.js` (CREATE NEW)**

```javascript
/**
 * PROJECT DETAILS MODAL
 * Handles opening, closing, and rendering rich project details
 */

// ============================================
// OPEN MODAL WITH PROJECT DATA
// ============================================

function openProjectModal(project) {
    const modal = document.getElementById('projectModal');
    const content = document.getElementById('modalScrollContent');
    
    if (!modal || !content) {
        console.error('Modal elements not found');
        return;
    }
    
    // Increment views
    if (project.id) {
        incrementProjectDetailsViews(project.id);
    }
    
    // Render modal content
    content.innerHTML = renderModalContent(project);
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Animate score bars
    setTimeout(() => {
        animateScoreBars();
    }, 300);
    
    // Add ESC key listener
    document.addEventListener('keydown', handleEscapeKey);
    
    console.log('📖 Opened modal for:', project.title);
}

// ============================================
// CLOSE MODAL
// ============================================

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    
    if (!modal) return;
    
    modal.style.display = 'none';
    document.body.style.overflow = '';
    
    // Remove ESC key listener
    document.removeEventListener('keydown', handleEscapeKey);
    
    console.log('✖️ Closed modal');
}

function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
}

// ============================================
// RENDER MODAL CONTENT
// ============================================

function renderModalContent(project) {
    // Status badges
    const badges = [];
    if (project.featured) {
        badges.push('<span class="modal-badge badge-featured">⭐ Featured</span>');
    }
    
    const statusBadge = project.status === 'completed'
        ? '<span class="modal-badge badge-completed">✅ Completed</span>'
        : '<span class="modal-badge badge-in-progress">🔨 In Progress</span>';
    badges.push(statusBadge);
    badges.push(`<span class="modal-badge">${project.category}</span>`);
    
    // Technologies
    const techTags = project.technologies.map(tech => 
        `<span class="modal-tech-tag">${tech}</span>`
    ).join('');
    
    // Key metrics
    const keyMetricsHTML = project.key_metrics 
        ? renderKeyMetrics(project.key_metrics)
        : '';
    
    // Highlights
    const highlightsHTML = project.highlights && project.highlights.length > 0
        ? `
        <div class="modal-section">
            <h2 class="modal-section-title">🎯 Highlights</h2>
            <ul class="highlights-list">
                ${project.highlights.map(h => `<li class="highlight-item">${h}</li>`).join('')}
            </ul>
        </div>
        ` : '';
    
    // AI Scores
    const aiScoresHTML = (project.complexity_score || project.innovation_score || project.business_impact_score)
        ? `
        <div class="modal-section">
            <h2 class="modal-section-title">🤖 AI Analysis</h2>
            <div class="ai-scores">
                ${project.complexity_score ? renderScoreBar('Technical Complexity', project.complexity_score) : ''}
                ${project.innovation_score ? renderScoreBar('Innovation Score', project.innovation_score) : ''}
                ${project.business_impact_score ? renderScoreBar('Business Impact', project.business_impact_score) : ''}
            </div>
        </div>
        ` : '';
    
    // Challenges, Solutions, Results
    const challengesHTML = project.challenges ? `
        <div class="modal-section">
            <h2 class="modal-section-title">💪 Challenges</h2>
            <div class="modal-text-content">
                <p>${project.challenges}</p>
            </div>
        </div>
    ` : '';
    
    const solutionsHTML = project.solutions ? `
        <div class="modal-section">
            <h2 class="modal-section-title">✨ Solutions</h2>
            <div class="modal-text-content">
                <p>${project.solutions}</p>
            </div>
        </div>
    ` : '';
    
    const resultsHTML = project.results ? `
        <div class="modal-section">
            <h2 class="modal-section-title">🎉 Results</h2>
            <div class="modal-text-content">
                <p>${project.results}</p>
            </div>
        </div>
    ` : '';
    
    // Lessons Learned
    const lessonsHTML = project.lessons_learned && project.lessons_learned.length > 0
        ? `
        <div class="modal-section">
            <h2 class="modal-section-title">📚 Lessons Learned</h2>
            <ul class="lessons-list">
                ${project.lessons_learned.map(l => `<li class="lesson-item">${l}</li>`).join('')}
            </ul>
        </div>
        ` : '';
    
    // Project Info
    const projectInfoHTML = `
        <div class="modal-section">
            <h2 class="modal-section-title">👥 Project Info</h2>
            <div class="project-info-grid">
                ${project.project_duration ? `
                    <div class="info-item">
                        <span class="info-label">Duration</span>
                        <span class="info-value">${project.project_duration}</span>
                    </div>
                ` : ''}
                ${project.team_size ? `
                    <div class="info-item">
                        <span class="info-label">Team Size</span>
                        <span class="info-value">${project.team_size === 1 ? 'Solo Developer' : `${project.team_size} Developers`}</span>
                    </div>
                ` : ''}
                ${project.role ? `
                    <div class="info-item">
                        <span class="info-label">Role</span>
                        <span class="info-value">${project.role}</span>
                    </div>
                ` : ''}
                ${project.completed_date ? `
                    <div class="info-item">
                        <span class="info-label">Completed</span>
                        <span class="info-value">${new Date(project.completed_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    // Action Buttons
    const actionsHTML = `
        <div class="modal-actions">
            ${project.demo_url ? `
                <a href="${project.demo_url}" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="modal-btn modal-btn-primary"
                   onclick="trackProjectClick('${project.id}', 'demo')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                    Live Demo
                </a>
            ` : ''}
            ${project.github_url ? `
                <a href="${project.github_url}" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="modal-btn modal-btn-secondary"
                   onclick="trackProjectClick('${project.id}', 'github')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
                    </svg>
                    GitHub
                </a>
            ` : ''}
            ${project.blog_post_url ? `
                <a href="${project.blog_post_url}" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="modal-btn modal-btn-secondary"
                   onclick="trackProjectClick('${project.id}', 'blog')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    Read Blog Post
                </a>
            ` : ''}
        </div>
    `;
    
    // Footer Stats
    const footerHTML = `
        <div class="modal-footer">
            <div class="footer-stats">
                <span class="stat-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    ${project.view_count || 0} views
                </span>
                ${project.github_clicks !== undefined ? `
                    <span class="stat-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                        </svg>
                        ${project.github_clicks} GitHub clicks
                    </span>
                ` : ''}
            </div>
        </div>
    `;
    
    return `
        <img src="${project.image_url}" alt="${project.title}" class="modal-hero-image">
        
        <div class="modal-header">
            <div class="modal-badges">
                ${badges.join('')}
            </div>
            
            <h1 class="modal-title">${project.title}</h1>
            
            <p class="modal-tagline">${project.tagline || project.description}</p>
            
            <div class="modal-techs">
                ${techTags}
            </div>
        </div>
        
        ${keyMetricsHTML}
        ${highlightsHTML}
        ${aiScoresHTML}
        
        ${project.full_description ? `
            <div class="modal-section">
                <h2 class="modal-section-title">📝 Overview</h2>
                <div class="modal-text-content">
                    <p>${project.full_description}</p>
                </div>
            </div>
        ` : ''}
        
        ${challengesHTML}
        ${solutionsHTML}
        ${resultsHTML}
        ${lessonsHTML}
        ${projectInfoHTML}
        ${actionsHTML}
        ${footerHTML}
    `;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function renderKeyMetrics(metrics) {
    const items = Object.entries(metrics).map(([key, value]) => {
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return `
            <div class="metric-item">
                <span class="metric-label">${label}</span>
                <span class="metric-value">${value}</span>
            </div>
        `;
    }).join('');
    
    return `
        <div class="modal-section">
            <h2 class="modal-section-title">📊 Key Metrics</h2>
            <div class="key-metrics-grid">
                ${items}
            </div>
        </div>
    `;
}

function renderScoreBar(label, score) {
    return `
        <div class="score-item">
            <div class="score-header">
                <span class="score-label">${label}</span>
                <span class="score-value">${score}%</span>
            </div>
            <div class="score-bar">
                <div class="score-fill" data-score="${score}" style="width: 0%"></div>
```javascript
            </div>
        </div>
    `;
}

function animateScoreBars() {
    const scoreFills = document.querySelectorAll('.score-fill');
    scoreFills.forEach((fill, index) => {
        const score = fill.getAttribute('data-score');
        setTimeout(() => {
            fill.style.width = score + '%';
        }, index * 150); // Stagger animation
    });
}

// ============================================
// INCREMENT DETAILS VIEWS
// ============================================

async function incrementProjectDetailsViews(projectId) {
    try {
        const { data, error } = await supabase
            .from('projects')
            .update({ details_views: supabase.raw('details_views + 1') })
            .eq('id', projectId);
        
        if (error) {
            console.error('Error incrementing details views:', error);
        }
    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

// ============================================
// TRACK CLICKS
// ============================================

function trackProjectClick(projectId, type) {
    // Track click in database
    const field = `${type}_clicks`;
    
    supabase
        .from('projects')
        .update({ [field]: supabase.raw(`${field} + 1`) })
        .eq('id', projectId)
        .then(({ error }) => {
            if (error) {
                console.error(`Error tracking ${type} click:`, error);
            } else {
                console.log(`✅ Tracked ${type} click`);
            }
        });
}

// Make functions globally available
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.trackProjectClick = trackProjectClick;
```

---

### **STEP 6: Update CSS Imports in index.html**

**File: `index.html` - In the `<head>` section**

Add the new CSS files:

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SimeonDev | Full-Stack Developer & AI Solutions Architect</title>
    
    <!-- Existing CSS -->
    <link rel="stylesheet" href="css/theme.css">
    <link rel="stylesheet" href="css/typography.css">
    <link rel="stylesheet" href="css/layouts.css">
    <link rel="stylesheet" href="css/components.css">
    <link rel="stylesheet" href="css/navigation.css">
    <link rel="stylesheet" href="css/hero-2025.css">
    
    <!-- ADD THESE NEW LINES -->
    <link rel="stylesheet" href="css/project-cards-minimal.css">
    <link rel="stylesheet" href="css/project-modal.css">
    
    <!-- Existing CSS -->
    <link rel="stylesheet" href="css/footer.css">
    <link rel="stylesheet" href="css/animations.css">
    <link rel="stylesheet" href="css/utilities.css">
    <link rel="stylesheet" href="css/responsive.css">
</head>
```

---

### **STEP 7: Update JavaScript Imports**

**File: `index.html` - Before closing `</body>` tag**

Add the new JS file:

```html
    <!-- Existing JavaScript -->
    <script src="js/supabase-client.js"></script>
    <script src="js/projects-supabase.js"></script>
    <script src="js/blog-supabase.js"></script>
    <script src="js/title-rotator.js"></script>
    <script src="js/main.js"></script>
    
    <!-- ADD THIS NEW LINE -->
    <script src="js/project-modal.js"></script>
    
</body>
```

---

### **STEP 8: Create Database Functions for Analytics**

**Run this in Supabase SQL Editor:**

```sql
-- ============================================
-- DATABASE FUNCTIONS FOR ANALYTICS
-- ============================================

-- Function to increment details views
CREATE OR REPLACE FUNCTION increment_project_details_views(project_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE projects 
    SET details_views = COALESCE(details_views, 0) + 1
    WHERE id = project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment various click counts
CREATE OR REPLACE FUNCTION increment_project_clicks(
    project_id UUID,
    click_field TEXT
)
RETURNS void AS $$
BEGIN
    EXECUTE format(
        'UPDATE projects SET %I = COALESCE(%I, 0) + 1 WHERE id = $1',
        click_field,
        click_field
    ) USING project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_project_details_views(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_project_clicks(UUID, TEXT) TO anon, authenticated;
```

---

## 📊 TESTING CHECKLIST

After implementation, verify these items:

### **Visual Tests:**
- [ ] Projects page loads without errors
- [ ] Featured projects section displays correctly
- [ ] All projects section displays correctly
- [ ] Project cards show images properly
- [ ] Cards display title, tagline, tech tags, and footer
- [ ] Featured and status badges visible
- [ ] Hover effects work (lift, glow, image zoom)
- [ ] Grid is responsive (3 cols → 2 cols → 1 col)
- [ ] Loading skeletons appear during data fetch
- [ ] Empty states show if no projects

### **Modal Tests:**
- [ ] Click card opens modal
- [ ] Modal displays hero image
- [ ] All sections render (metrics, highlights, AI scores, etc.)
- [ ] AI score bars animate on open
- [ ] Close button works
- [ ] Click backdrop closes modal
- [ ] ESC key closes modal
- [ ] Modal is scrollable
- [ ] Action buttons (Demo, GitHub, Blog) work
- [ ] Stats display in footer

### **Functional Tests:**
- [ ] All 4 sample projects load from database
- [ ] Featured projects separated from all projects
- [ ] Filter buttons work (if implemented)
- [ ] Links open in new tabs
- [ ] Analytics increment (check database)
- [ ] No console errors
- [ ] Images load properly
- [ ] Placeholders display if no data

### **Responsive Tests:**
- [ ] Desktop (1920px): 3 columns, modal centered
- [ ] Laptop (1440px): 3 columns, comfortable spacing
- [ ] Tablet (1024px): 2 columns, adjusted spacing
- [ ] Tablet portrait (768px): 2 columns or 1 column
- [ ] Mobile (375px): 1 column, full-width cards
- [ ] Modal adapts to mobile (full-screen)
- [ ] All text remains readable
- [ ] Buttons stack on mobile
- [ ] No horizontal scroll

### **Performance Tests:**
- [ ] Page loads in < 2 seconds
- [ ] Images lazy load
- [ ] Smooth animations (no jank)
- [ ] Modal opens smoothly
- [ ] No memory leaks (open/close modal multiple times)
- [ ] Supabase queries optimized