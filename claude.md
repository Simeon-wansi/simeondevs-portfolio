**TASK: Fix Responsive Layout Issues - Scaling and Alignment Problems**

## Critical Issues Identified

### 1. **Overall Page Scale Too Large (80% zoom needed)**
The entire site is scaled too large, forcing users to zoom out to 80% to see content properly. This suggests viewport units or base font sizes are too big.

### 2. **Project Card Button Alignment Broken**
The "Details" button text is cut off - only "De" is visible. The three buttons (GitHub, Demo, Details) are not aligned properly or have overflow issues.

### 3. **Contact Form Horizontal Scroll**
The contact form section requires horizontal scrolling instead of stacking vertically on smaller screens. The layout is not responsive.

---

## FIXES REQUIRED

### Fix 1: Reduce Overall Page Scale

**File: `css/theme.css` or `css/typography.css`**

**Problem:** Base font size is too large, causing everything to scale up.

**Find and CHANGE:**
```css
/* Current (probably) */
html {
    font-size: 16px; /* or 18px, or 100% */
}

body {
    font-size: 1rem; /* 16px */
}
```

**Change to:**
```css
/* Reduce base scale */
html {
    font-size: 14px; /* Reduces everything by ~12% */
}

/* OR use percentage */
html {
    font-size: 87.5%; /* 14px (87.5% of 16px) */
}

body {
    font-size: 1rem; /* Now equals 14px */
    max-width: 100vw;
    overflow-x: hidden;
}
```

**Also add:**
```css
* {
    box-sizing: border-box;
}

html, body {
    max-width: 100%;
    overflow-x: hidden;
}
```

---

### Fix 2: Project Card Button Layout

**File: `css/components.css`**

**Problem:** Buttons are overflowing or not sized correctly. Text is truncated.

**Find the `.project-links` section and REPLACE:**

```css
/* ============================================
   PROJECT CARD BUTTONS - FIXED LAYOUT
   ============================================ */

.project-links {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* Equal width columns */
    gap: 0.75rem;
    margin-top: auto;
    padding-top: var(--space-md);
    width: 100%;
}

.project-link {
    padding: 0.75rem 0.5rem; /* Adjust padding */
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: 0.875rem; /* 14px */
    text-align: center;
    transition: all var(--transition-fast);
    border: 2px solid transparent;
    cursor: pointer !important;
    pointer-events: auto !important;
    position: relative !important;
    z-index: 10 !important;
    text-decoration: none !important;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    white-space: nowrap; /* Prevent text wrapping */
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0; /* Allow flex shrinking */
}

/* Icon sizing */
.project-link .link-icon {
    font-size: 0.875rem;
    flex-shrink: 0; /* Icons don't shrink */
}

/* Mobile: Stack buttons vertically */
@media (max-width: 768px) {
    .project-links {
        grid-template-columns: 1fr; /* Stack on mobile */
        gap: 0.5rem;
    }
    
    .project-link {
        width: 100%;
        padding: 0.875rem 1rem;
    }
}

/* Tablet: 2 columns, Details full width */
@media (min-width: 769px) and (max-width: 1024px) {
    .project-links {
        grid-template-columns: 1fr 1fr;
    }
    
    .details-btn {
        grid-column: 1 / -1; /* Span both columns */
    }
}
```

---

### Fix 3: Contact Form Responsive Layout

**File: `index.html`**

**Find the contact section and ensure proper structure:**

```html
<div id="contact" class="page">
    <div class="container">
        <div class="contact-wrapper">
            <!-- Contact Info - Left/Top -->
            <div class="contact-info">
                <h1>Get In Touch</h1>
                <p>Have a project in mind? Let's discuss how I can help.</p>
                
                <!-- Contact details -->
                <div class="contact-details">
                    <!-- Email, location, etc -->
                </div>
            </div>
            
            <!-- Contact Form - Right/Bottom -->
            <div class="contact-form-container">
                <form class="contact-form">
                    <!-- Form fields -->
                </form>
            </div>
        </div>
    </div>
</div>
```

**File: `css/sections.css` or create `css/contact.css`**

**Add responsive contact layout:**

```css
/* ============================================
   CONTACT PAGE - RESPONSIVE LAYOUT
   ============================================ */

.contact-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr; /* Two columns on desktop */
    gap: var(--space-2xl);
    align-items: start;
    max-width: 1200px;
    margin: 0 auto;
}

.contact-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
}

.contact-form-container {
    width: 100%;
    max-width: 100%;
}

.contact-form {
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-lg);
    padding: var(--space-xl);
    width: 100%;
}

/* Form fields */
.form-group {
    margin-bottom: var(--space-lg);
    width: 100%;
}

.form-input,
.form-textarea {
    width: 100%;
    max-width: 100%; /* Prevent overflow */
    box-sizing: border-box;
}

/* RESPONSIVE: Stack vertically on tablets and mobile */
@media (max-width: 1024px) {
    .contact-wrapper {
        grid-template-columns: 1fr; /* Single column */
        gap: var(--space-xl);
    }
    
    .contact-info {
        text-align: center;
    }
}

@media (max-width: 768px) {
    .contact-form {
        padding: var(--space-lg);
    }
    
    .contact-wrapper {
        gap: var(--space-lg);
    }
}

/* Prevent horizontal scroll */
.contact-wrapper,
.contact-form-container,
.contact-form {
    overflow-x: visible;
    max-width: 100%;
}
```

---

### Fix 4: Global Overflow Prevention

**File: `css/main.css` or `css/theme.css`**

**Add at the top:**

```css
/* ============================================
   PREVENT HORIZONTAL SCROLL - GLOBAL
   ============================================ */

* {
    box-sizing: border-box;
}

html {
    font-size: 87.5%; /* 14px base - reduces overall scale */
    overflow-x: hidden;
    max-width: 100vw;
}

body {
    overflow-x: hidden;
    max-width: 100vw;
    margin: 0;
    padding: 0;
}

/* Prevent any element from causing horizontal scroll */
.container,
.section,
.page {
    max-width: 100%;
    overflow-x: hidden;
}

/* Ensure grids don't overflow */
.projects-grid,
.blog-grid,
.featured-projects-grid {
    max-width: 100%;
    overflow-x: visible;
}

/* Ensure all containers respect viewport width */
#home,
#projects,
#blog,
#about,
#services,
#contact {
    max-width: 100vw;
    overflow-x: hidden;
}
```

---

### Fix 5: Better Responsive Breakpoints

**File: `css/responsive.css`**

**Add specific fixes:**

```css
/* ============================================
   RESPONSIVE FIXES - PREVENT OVERFLOW
   ============================================ */

/* Large screens (1400px+) */
@media (min-width: 1400px) {
    html {
        font-size: 100%; /* 16px on very large screens */
    }
}

/* Desktop (1024px - 1399px) */
@media (min-width: 1024px) and (max-width: 1399px) {
    html {
        font-size: 93.75%; /* 15px */
    }
    
    .container {
        max-width: 1200px;
        padding: 0 var(--space-lg);
    }
}

/* Tablet (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
    html {
        font-size: 87.5%; /* 14px */
    }
    
    .container {
        padding: 0 var(--space-md);
    }
    
    /* Stack contact form */
    .contact-wrapper {
        grid-template-columns: 1fr !important;
    }
    
    /* Adjust project cards */
    .projects-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: var(--space-md);
    }
}

/* Mobile (up to 767px) */
@media (max-width: 767px) {
    html {
        font-size: 87.5%; /* 14px */
    }
    
    .container {
        padding: 0 var(--space-sm);
        max-width: 100%;
    }
    
    /* Single column layouts */
    .projects-grid,
    .blog-grid,
    .contact-wrapper {
        grid-template-columns: 1fr !important;
    }
    
    /* Stack project buttons */
    .project-links {
        grid-template-columns: 1fr !important;
    }
    
    /* Reduce spacing */
    .section {
        padding: var(--space-xl) 0;
    }
    
    /* Smaller hero */
    .hero-section {
        min-height: auto;
        padding: var(--space-xl) 0;
    }
}

/* Small mobile (up to 480px) */
@media (max-width: 480px) {
    html {
        font-size: 85%; /* 13.6px - even smaller */
    }
    
    .container {
        padding: 0 1rem;
    }
    
    /* Reduce all spacing */
    :root {
        --space-lg: 1.5rem;
        --space-xl: 2rem;
        --space-2xl: 2.5rem;
    }
}
```

---

## TESTING CHECKLIST

After implementing fixes:

### Scale Test:
- [ ] Page looks good at 100% zoom (not 80%)
- [ ] Text is readable but not oversized
- [ ] No horizontal scrolling on any page

### Project Cards Test:
- [ ] All three buttons visible: "GitHub", "Demo", "Details"
- [ ] Button text not cut off
- [ ] Buttons aligned in a row (desktop) or stacked (mobile)
- [ ] Equal width buttons

### Contact Form Test:
- [ ] Desktop: Form beside contact info (two columns)
- [ ] Tablet: Form below contact info (stacked)
- [ ] Mobile: Everything stacked vertically
- [ ] No horizontal scroll on contact page
- [ ] Form inputs don't overflow

### Responsive Test:
- [ ] Test at 1920px, 1440px, 1024px, 768px, 480px, 375px
- [ ] No horizontal scroll at any width
- [ ] Content readable at all sizes
- [ ] No cut-off text or buttons

---

## PRIORITY ORDER

1. **Fix 4 first** - Prevent horizontal scroll globally
2. **Fix 1** - Reduce base font size
3. **Fix 2** - Fix project card buttons
4. **Fix 3** - Fix contact form layout
5. **Fix 5** - Refine responsive breakpoints

---

## EXPECTED RESULT

**Before:**
- Need 80% zoom to see page
- "Details" button shows "De"
- Horizontal scroll on contact page

**After:**
- Perfect at 100% zoom
- All button text visible and aligned
- No horizontal scroll anywhere
- Proper responsive stacking on mobile

Please implement these fixes in order. The base font size reduction will have the biggest immediate impact.