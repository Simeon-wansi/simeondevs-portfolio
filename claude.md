**TASK: Implement Modern 2025 Hero Section with Rotating Titles and CSS 3D Sphere**

## CRITICAL INSTRUCTIONS

⚠️ **DO NOT TOUCH THESE SECTIONS:**
- Navigation bar
- Projects page and project cards
- Blog page and blog cards
- Contact form
- Footer
- Any JavaScript files related to Supabase (blog-supabase.js, projects-supabase.js)
- Database integration code
- Analytics tracking

✅ **ONLY MODIFY:**
- Hero section HTML in `index.html`
- Hero section CSS (create new `css/hero-2025.css`)
- Add new JavaScript file `js/title-rotator.js`
- Update CSS imports in `index.html` head section

## Project Context

This is a professional portfolio for SimeonDev (Simeon Wansi), a Full-Stack Developer and AI Solutions Architect based in Dubai. The site currently has:
- Working navigation
- Functional projects page with Supabase integration
- Functional blog page with Supabase integration
- Working contact form
- Tech Purple color theme (#8B5CF6 primary, #F59E0B accent)

**We are ONLY updating the hero section to be more modern and dynamic.**

---

## IMPLEMENTATION PLAN

### Step 1: Backup and Analysis

**Before making changes:**
1. Identify the current hero section in `index.html`
2. Note any existing classes or IDs used by JavaScript
3. Check if any other files reference the hero section
4. Preserve any existing functionality

### Step 2: Create New Hero CSS File

**File: `css/hero-2025.css` (CREATE NEW FILE)**

```css
/* ============================================
   MODERN 2025 HERO SECTION
   Animated gradient background, rotating titles, CSS 3D sphere
   ============================================ */

/* === HERO CONTAINER === */
.hero-2025 {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: 6rem 0 4rem;
    isolation: isolate;
}

/* === ANIMATED GRADIENT BACKGROUND === */
.hero-bg {
    position: absolute;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    opacity: 0.6;
}

.gradient-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.4;
    will-change: transform;
}

.orb-1 {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, transparent 70%);
    top: -15%;
    left: -10%;
    animation: floatOrb 25s ease-in-out infinite;
    animation-delay: 0s;
}

.orb-2 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(245, 158, 11, 0.5) 0%, transparent 70%);
    bottom: -10%;
    right: -5%;
    animation: floatOrb 20s ease-in-out infinite;
    animation-delay: 8s;
}

.orb-3 {
    width: 450px;
    height: 450px;
    background: radial-gradient(circle, rgba(167, 139, 250, 0.5) 0%, transparent 70%);
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: floatOrb 30s ease-in-out infinite;
    animation-delay: 16s;
}

@keyframes floatOrb {
    0%, 100% {
        transform: translate(0, 0) scale(1);
    }
    33% {
        transform: translate(40px, -40px) scale(1.15);
    }
    66% {
        transform: translate(-30px, 30px) scale(0.9);
    }
}

/* === PARTICLE NETWORK === */
.particle-network {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    opacity: 0.4;
}

.particle {
    position: absolute;
    width: 6px;
    height: 6px;
    background: var(--color-primary-light);
    border-radius: 50%;
    left: var(--x);
    top: var(--y);
    animation: particlePulse 4s ease-in-out infinite;
    animation-delay: calc(var(--x) * 0.02s);
    box-shadow: 0 0 10px rgba(139, 92, 246, 0.6);
}

.particle::after {
    content: '';
    position: absolute;
    width: 1px;
    height: 80px;
    background: linear-gradient(
        to bottom, 
        transparent, 
        rgba(139, 92, 246, 0.3), 
        transparent
    );
    top: 0;
    left: 50%;
    transform: translateX(-50%) rotate(var(--angle, 45deg));
}

@keyframes particlePulse {
    0%, 100% {
        opacity: 0.4;
        transform: scale(1);
    }
    50% {
        opacity: 1;
        transform: scale(1.8);
    }
}

/* === MAIN CONTENT CONTAINER === */
.hero-container {
    position: relative;
    z-index: 1;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    width: 100%;
}

.hero-content {
    display: grid;
    grid-template-columns: 1.3fr 0.7fr;
    gap: 4rem;
    align-items: center;
}

/* === LEFT SIDE: CONTENT === */
.hero-left {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
}

/* === PROFILE IMAGE === */
.profile-card {
    flex-shrink: 0;
    position: relative;
}

.profile-image-wrapper {
    position: relative;
    width: 180px;
    height: 180px;
}

.profile-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid var(--color-primary);
    box-shadow: 
        0 10px 40px rgba(139, 92, 246, 0.5),
        inset 0 2px 4px rgba(255, 255, 255, 0.1);
    position: relative;
    z-index: 2;
    transition: transform 0.3s ease;
}

.profile-img:hover {
    transform: scale(1.05);
}

.profile-ring {
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    border: 3px solid var(--color-accent);
    opacity: 0.6;
    animation: ringPulse 3s ease-in-out infinite;
}

@keyframes ringPulse {
    0%, 100% {
        transform: scale(1);
        opacity: 0.4;
    }
    50% {
        transform: scale(1.12);
        opacity: 0.8;
    }
}

/* === TEXT CONTENT === */
.hero-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.hero-name {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 900;
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    line-height: 1.1;
    letter-spacing: -0.02em;
}

/* === ROTATING TITLES === */
.title-rotator {
    font-size: clamp(1.5rem, 3vw, 2.25rem);
    font-weight: 700;
    color: var(--text-primary);
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    min-height: 3rem;
    flex-wrap: wrap;
}

.title-prefix {
    color: var(--text-secondary);
    font-weight: 600;
}

.rotating-text {
    position: relative;
    display: inline-block;
    min-width: 280px;
    height: 3rem;
    overflow: hidden;
}

.title-item {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    transform: translateY(30px) rotateX(90deg);
    transform-origin: center top;
    color: var(--color-primary-light);
    white-space: nowrap;
    transition: all 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    perspective: 1000px;
}

.title-item.active {
    opacity: 1;
    transform: translateY(0) rotateX(0deg);
}

.title-item.exit {
    opacity: 0;
    transform: translateY(-30px) rotateX(-90deg);
    transition: all 0.5s cubic-bezier(0.6, -0.28, 0.735, 0.045);
}

/* Animated cursor */
.rotating-text::after {
    content: '';
    position: absolute;
    right: -8px;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 70%;
    background: var(--color-accent);
    animation: blink 1.2s step-end infinite;
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
}

/* === BIO TEXT === */
.hero-bio {
    font-size: 1.125rem;
    line-height: 1.8;
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0;
}

/* === META INFO === */
.hero-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.9375rem;
    color: var(--text-muted);
    flex-wrap: wrap;
}

.meta-item {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
}

.meta-divider {
    color: var(--color-primary);
    font-weight: 700;
}

/* === CTA BUTTONS === */
.hero-ctas {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
    flex-wrap: wrap;
}

.cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
    color: white;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1rem;
    text-decoration: none;
    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    border: none;
}

.cta-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.cta-primary:hover::before {
    opacity: 1;
}

.cta-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(139, 92, 246, 0.6);
}

.cta-primary:active {
    transform: translateY(-1px);
}

.cta-primary span,
.cta-primary svg {
    position: relative;
    z-index: 1;
}

.arrow-icon {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
    stroke: currentColor;
    stroke-width: 2;
    fill: none;
}

.cta-primary:hover .arrow-icon {
    transform: translateX(5px);
}

.cta-secondary {
    display: inline-flex;
    align-items: center;
    padding: 1rem 2rem;
    background: rgba(139, 92, 246, 0.05);
    color: var(--color-primary-light);
    border: 2px solid var(--border-primary);
    border-radius: 12px;
    font-weight: 600;
    font-size: 1rem;
    text-decoration: none;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.cta-secondary:hover {
    background: rgba(139, 92, 246, 0.15);
    border-color: var(--color-primary);
    color: var(--color-primary);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.2);
}

/* === TAGS === */
.hero-tags {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.hero-tag {
    padding: 0.5rem 1.125rem;
    background: rgba(139, 92, 246, 0.12);
    border: 1px solid var(--border-primary);
    border-radius: 9999px;
    color: var(--color-primary-light);
    font-size: 0.875rem;
    font-weight: 500;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.hero-tag:hover {
    background: rgba(139, 92, 246, 0.2);
    border-color: var(--color-primary);
    transform: translateY(-2px);
}

/* === RIGHT SIDE: CSS 3D SPHERE === */
.hero-right {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    min-height: 400px;
}

.sphere-container {
    width: 350px;
    height: 350px;
    perspective: 1200px;
    perspective-origin: center;
}

.sphere {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    animation: rotateSphere 30s linear infinite;
}

@keyframes rotateSphere {
    from {
        transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
    }
    to {
        transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
    }
}

.sphere-ring {
    position: absolute;
    inset: 0;
    border: 2px solid rgba(139, 92, 246, 0.4);
    border-radius: 50%;
    animation: ringGlow 4s ease-in-out infinite;
}

.ring-1 {
    transform: rotateX(0deg) rotateY(0deg);
    animation-delay: 0s;
    border-color: rgba(139, 92, 246, 0.5);
}

.ring-2 {
    transform: rotateX(60deg) rotateY(0deg);
    animation-delay: 1.3s;
    border-color: rgba(167, 139, 250, 0.4);
}

.ring-3 {
    transform: rotateX(120deg) rotateY(0deg);
    animation-delay: 2.6s;
    border-color: rgba(196, 181, 253, 0.3);
}

@keyframes ringGlow {
    0%, 100% {
        border-color: rgba(139, 92, 246, 0.4);
        box-shadow: 
            0 0 20px rgba(139, 92, 246, 0.3),
            inset 0 0 20px rgba(139, 92, 246, 0.1);
    }
    50% {
        border-color: rgba(245, 158, 11, 0.6);
        box-shadow: 
            0 0 40px rgba(245, 158, 11, 0.5),
            inset 0 0 30px rgba(245, 158, 11, 0.2);
    }
}

.sphere-core {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle at 30% 30%, 
        rgba(245, 158, 11, 0.9), 
        rgba(139, 92, 246, 0.8)
    );
    border-radius: 50%;
    box-shadow: 
        0 0 60px rgba(139, 92, 246, 0.8),
        0 0 100px rgba(245, 158, 11, 0.4),
        inset 0 0 30px rgba(255, 255, 255, 0.3);
    animation: corePulse 3s ease-in-out infinite;
}

@keyframes corePulse {
    0%, 100% {
        transform: translate(-50%, -50%) scale(1);
        box-shadow: 
            0 0 60px rgba(139, 92, 246, 0.8),
            0 0 100px rgba(245, 158, 11, 0.4);
    }
    50% {
        transform: translate(-50%, -50%) scale(1.15);
        box-shadow: 
            0 0 80px rgba(139, 92, 246, 1),
            0 0 120px rgba(245, 158, 11, 0.6);
    }
}

/* === RESPONSIVE DESIGN === */

/* Tablet landscape (1024px - 1279px) */
@media (max-width: 1279px) {
    .hero-content {
        grid-template-columns: 1.5fr 1fr;
        gap: 3rem;
    }
    
    .sphere-container {
        width: 300px;
        height: 300px;
    }
}

/* Tablet portrait (768px - 1023px) */
@media (max-width: 1023px) {
    .hero-content {
        grid-template-columns: 1fr;
        gap: 3rem;
        text-align: center;
    }
    
    .hero-left {
        flex-direction: column;
        align-items: center;
    }
    
    .hero-text {
        align-items: center;
    }
    
    .hero-bio,
    .title-rotator {
        text-align: center;
    }
    
    .title-rotator {
        justify-content: center;
    }
    
    .hero-ctas {
        justify-content: center;
    }
    
    .hero-meta {
        justify-content: center;
    }
    
    .hero-tags {
        justify-content: center;
    }
    
    .sphere-container {
        width: 280px;
        height: 280px;
    }
}

/* Mobile (up to 767px) */
@media (max-width: 767px) {
    .hero-2025 {
        padding: 5rem 0 3rem;
        min-height: auto;
    }
    
    .hero-container {
        padding: 0 1.25rem;
    }
    
    .hero-left {
        gap: 1.5rem;
    }
    
    .profile-image-wrapper {
        width: 140px;
        height: 140px;
    }
    
    .hero-name {
        font-size: 2rem;
    }
    
    .title-rotator {
        font-size: 1.25rem;
        flex-direction: column;
        gap: 0.5rem;
        min-height: 4rem;
    }
    
    .rotating-text {
        min-width: 200px;
        height: 2rem;
    }
    
    .hero-bio {
        font-size: 1rem;
    }
    
    .hero-ctas {
        flex-direction: column;
        width: 100%;
        gap: 0.75rem;
    }
    
    .cta-primary,
    .cta-secondary {
        width: 100%;
        justify-content: center;
    }
    
    /* Hide sphere on mobile for performance */
    .hero-right {
        display: none;
    }
    
    /* Reduce orb sizes */
    .orb-1 {
        width: 400px;
        height: 400px;
    }
    
    .orb-2 {
        width: 350px;
        height: 350px;
    }
    
    .orb-3 {
        width: 300px;
        height: 300px;
    }
}

/* Small mobile (up to 480px) */
@media (max-width: 480px) {
    .hero-2025 {
        padding: 4rem 0 2rem;
    }
    
    .hero-text {
        gap: 1.25rem;
    }
    
    .profile-image-wrapper {
        width: 120px;
        height: 120px;
    }
    
    .hero-name {
        font-size: 1.75rem;
    }
    
    .title-rotator {
        font-size: 1.125rem;
    }
    
    .rotating-text {
        min-width: 180px;
    }
    
    .cta-primary,
    .cta-secondary {
        padding: 0.875rem 1.5rem;
        font-size: 0.9375rem;
    }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
    .hero-2025 *,
    .hero-2025 *::before,
    .hero-2025 *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

### Step 3: Create Title Rotator JavaScript

**File: `js/title-rotator.js` (CREATE NEW FILE)**

```javascript
/**
 * TITLE ROTATOR - 2025 Modern Hero Section
 * Smoothly rotates through job titles with 3D flip animation
 */

class TitleRotator {
    constructor(selector, options = {}) {
        this.container = document.querySelector(selector);
        
        if (!this.container) {
            console.warn(`TitleRotator: Container "${selector}" not found`);
            return;
        }
        
        this.items = this.container.querySelectorAll('.title-item');
        
        if (this.items.length === 0) {
            console.warn('TitleRotator: No .title-item elements found');
            return;
        }
        
        this.currentIndex = 0;
        this.interval = options.interval || 3000;
        this.isRunning = false;
        this.intervalId = null;
        
        this.init();
    }
    
    init() {
        // Set first item as active
        if (this.items.length > 0) {
            this.items[0].classList.add('active');
        }
        
        // Start rotation if more than one item
        if (this.items.length > 1) {
            this.start();
        }
        
        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.pause());
        this.container.addEventListener('mouseleave', () => this.start());
        
        // Pause when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.start();
            }
        });
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.intervalId = setInterval(() => this.rotate(), this.interval);
    }
    
    pause() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    rotate() {
        // Get current and next items
        const currentItem = this.items[this.currentIndex];
        const nextIndex = (this.currentIndex + 1) % this.items.length;
        const nextItem = this.items[nextIndex];
        
        // Add exit animation to current
        currentItem.classList.remove('active');
        currentItem.classList.add('exit');
        
        // After exit animation completes, show next item
        setTimeout(() => {
            // Remove all classes
            this.items.forEach(item => {
                item.classList.remove('active', 'exit');
            });
            
            // Activate next item
            nextItem.classList.add('active');
            
            // Update index
            this.currentIndex = nextIndex;
        }, 500); // Match CSS transition duration
    }
    
    destroy() {
        this.pause();
        this.container.removeEventListener('mouseenter', () => this.pause());
        this.container.removeEventListener('mouseleave', () => this.start());
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTitleRotator);
} else {
    initTitleRotator();
}

function initTitleRotator() {
    // Initialize rotator with 3.5 second interval
    window.titleRotator = new TitleRotator('.rotating-text', {
        interval: 3500
    });
    
    console.log('✅ Title Rotator initialized');
}

// Export for potential future use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TitleRotator;
}
```

---

### Step 4: Update Hero HTML in index.html

**File: `index.html`**

**Find the existing hero section (probably looks like this):**

```html
<section class="hero">
    <!-- Old hero content -->
</section>
```

**REPLACE with:**

```html
<!-- ============================================
     MODERN 2025 HERO SECTION
     Animated gradient background, rotating titles, CSS 3D sphere
     ============================================ -->
<section class="hero-2025" id="home">
    <!-- Animated Gradient Background -->
    <div class="hero-bg" aria-hidden="true">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
    </div>
    
    <!-- Particle Network Overlay -->
    <div class="particle-network" aria-hidden="true">
        <div class="particle" style="--x: 15%; --y: 25%; --angle: 30deg;"></div>
        <div class="particle" style="--x: 35%; --y: 45%; --angle: 60deg;"></div>
        <div class="particle" style="--x: 65%; --y: 20%; --angle: 120deg;"></div>
        <div class="particle" style="--x: 85%; --y: 65%; --angle: 150deg;"></div>
        <div class="particle" style="--x: 25%; --y: 75%; --angle: -45deg;"></div>
        <div class="particle" style="--x: 55%; --y: 85%; --angle: -30deg;"></div>
    </div>
    
    <!-- Main Content Container -->
    <div class="hero-container">
        <div class="hero-content">
            <!-- Left Side: Profile & Text Content -->
            <div class="hero-left">
                <!-- Profile Image -->
                <div class="profile-card">
                    <div class="profile-image-wrapper">
                        <img src="assets/images/profile.jpg" 
                             alt="Simeon Wansi - Full-Stack Developer" 
                             class="profile-img"
                             loading="eager">
                        <div class="profile-ring" aria-hidden="true"></div>
                    </div>
                </div>
                
                <!-- Text Content -->
                <div class="hero-text">
                    <!-- Name -->
                    <h1 class="hero-name">Simeon Wansi</h1>
                    
                    <!-- Rotating Job Titles -->
                    <div class="title-rotator" role="text" aria-live="polite">
                        <span class="title-prefix">I build</span>
                        <span class="rotating-text">
                            <span class="title-item active">AI Solutions</span>
                            <span class="title-item">Secure Systems</span>
                            <span class="title-item">Scalable Applications</span>
                        </span>
                    </div>
                    
                    <!-- Bio -->
                    <p class="hero-bio">
                        Building intelligent applications that solve real business problems 
                        through AI integration, cybersecurity, and modern web technologies. 
                        Helping UAE and international clients gain competitive advantages.
                    </p>
                    
                    <!-- Meta Info -->
                    <div class="hero-meta">
                        <span class="meta-item">📍 Dubai, UAE</span>
                        <span class="meta-divider">•</span>
                        <span class="meta-item">💼 Available for Projects</span>
                    </div>
                    
                    <!-- CTA Buttons -->
                    <div class="hero-ctas">
                        <a href="#projects" 
                           onclick="showPage('projects'); return false;" 
                           class="cta-primary">
                            <span>View My Work</span>
                            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M5 12h14M12 5l7 7-7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </a>
                        <a href="#contact" 
                           onclick="showPage('contact'); return false;" 
                           class="cta-secondary">
                            Let's Talk
                        </a>
                    </div>
                    
```html
                    <!-- Skill Tags -->
                    <div class="hero-tags">
                        <span class="hero-tag">Full Stack</span>
                        <span class="hero-tag">AI/ML</span>
                        <span class="hero-tag">Cybersecurity</span>
                    </div>
                </div>
            </div>
            
            <!-- Right Side: CSS 3D Sphere -->
            <div class="hero-right" aria-hidden="true">
                <div class="sphere-container">
                    <div class="sphere">
                        <div class="sphere-ring ring-1"></div>
                        <div class="sphere-ring ring-2"></div>
                        <div class="sphere-ring ring-3"></div>
                        <div class="sphere-core"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
```

---

### Step 5: Update CSS Imports in index.html

**File: `index.html` - In the `<head>` section**

**Find the CSS imports section and ADD this new line:**

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SimeonDev | Full-Stack Developer & AI Solutions Architect</title>
    
    <!-- Existing CSS files -->
    <link rel="stylesheet" href="css/theme.css">
    <link rel="stylesheet" href="css/typography.css">
    <link rel="stylesheet" href="css/layouts.css">
    <link rel="stylesheet" href="css/components.css">
    <link rel="stylesheet" href="css/navigation.css">
    
    <!-- ADD THIS NEW LINE -->
    <link rel="stylesheet" href="css/hero-2025.css">
    
    <!-- Rest of existing CSS -->
    <link rel="stylesheet" href="css/footer.css">
    <link rel="stylesheet" href="css/animations.css">
    <link rel="stylesheet" href="css/utilities.css">
    <link rel="stylesheet" href="css/responsive.css">
</head>
```

---

### Step 6: Add JavaScript Import

**File: `index.html` - Before closing `</body>` tag**

**Find the JavaScript imports section and ADD:**

```html
    <!-- Existing JavaScript files -->
    <script src="js/supabase-client.js"></script>
    <script src="js/projects-supabase.js"></script>
    <script src="js/blog-supabase.js"></script>
    <script src="js/main.js"></script>
    
    <!-- ADD THIS NEW LINE -->
    <script src="js/title-rotator.js"></script>
    
</body>
```

---

### Step 7: Add Profile Image (If Missing)

**Create folder structure if it doesn't exist:**

```
assets/
└── images/
    └── profile.jpg  ← Your professional photo
```

**If you don't have a profile image yet, add a temporary placeholder:**

In `index.html`, replace the img src with:

```html
<img src="https://ui-avatars.com/api/?name=Simeon+Wansi&size=400&background=8B5CF6&color=fff&bold=true" 
     alt="Simeon Wansi - Full-Stack Developer" 
     class="profile-img"
     loading="eager">
```

**Note:** Replace with your actual professional photo as soon as possible.

---

### Step 8: Remove or Hide Old Hero CSS

**File: `css/hero.css` (if it exists)**

**Option A: Rename the old file (safest)**
```
css/hero.css → css/hero-old.css
```

**Option B: Comment out old hero styles**

Add this at the top of the old `css/hero.css`:

```css
/* ============================================
   OLD HERO SECTION - DEPRECATED
   Replaced by hero-2025.css
   Keeping for reference only
   ============================================ */

/* Comment out or remove all old hero styles */
```

**Option C: Add namespace to old styles**

If the old hero section is still being used elsewhere, wrap all old hero styles:

```css
/* Only apply old styles if old hero exists */
.hero-old {
    /* ... old hero styles ... */
}
```

---

## TESTING CHECKLIST

After implementation, verify:

### Visual Tests:
- [ ] Hero section displays correctly at 100% zoom
- [ ] Profile image shows with purple border and pulsing ring
- [ ] Name displays with purple-to-gold gradient
- [ ] Job titles rotate smoothly every 3.5 seconds
- [ ] "I build [rotating text]" animation works
- [ ] Blinking cursor appears after rotating text
- [ ] Bio text is readable and properly formatted
- [ ] CTAs (View My Work, Let's Talk) are visible and styled
- [ ] Buttons have hover effects (lift up, change shadow)
- [ ] Arrow icon animates on hover
- [ ] Tags (Full Stack, AI/ML, Cybersecurity) display correctly
- [ ] CSS 3D sphere is visible and rotating
- [ ] Sphere has pulsing core and rotating rings
- [ ] Gradient orbs animate in background
- [ ] Particle network is visible and pulsing
- [ ] Overall design looks modern and professional

### Functional Tests:
- [ ] "View My Work" button navigates to projects page
- [ ] "Let's Talk" button navigates to contact page
- [ ] Navigation still works (other pages accessible)
- [ ] No JavaScript errors in console
- [ ] Page loads quickly (< 2 seconds)
- [ ] Rotation pauses when hovering over titles
- [ ] Rotation pauses when tab is not visible
- [ ] All animations are smooth (no jank)

### Responsive Tests:
- [ ] Desktop (1920px): Two-column layout, sphere visible
- [ ] Laptop (1440px): Layout still comfortable
- [ ] Tablet landscape (1024px): Slightly adjusted spacing
- [ ] Tablet portrait (768px): Single column, centered content
- [ ] Mobile (375px): Single column, sphere hidden, full-width buttons
- [ ] No horizontal scroll at any width
- [ ] All text remains readable on small screens
- [ ] Buttons stack vertically on mobile
- [ ] Profile image scales appropriately

### Cross-Browser Tests:
- [ ] Chrome: All features work
- [ ] Firefox: All features work
- [ ] Safari: All features work
- [ ] Edge: All features work
- [ ] Mobile Safari: Works on iPhone
- [ ] Mobile Chrome: Works on Android

### Performance Tests:
- [ ] Lighthouse Performance Score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] No layout shifts (CLS score 0)
- [ ] Animations don't cause dropped frames
- [ ] Mobile performance acceptable (no battery drain)

### Accessibility Tests:
- [ ] Title rotator has aria-live="polite"
- [ ] Decorative elements have aria-hidden="true"
- [ ] Images have proper alt text
- [ ] Focus indicators visible on keyboard navigation
- [ ] Color contrast meets WCAG AA standards
- [ ] Reduced motion preference respected
- [ ] Screen reader can read all content

---

## DEBUGGING GUIDE

### If titles don't rotate:

1. **Check console for errors:**
   ```javascript
   // Open DevTools (F12), look for errors
   ```

2. **Verify script loaded:**
   ```javascript
   // In console, type:
   console.log(window.titleRotator);
   // Should show TitleRotator object
   ```

3. **Check HTML structure:**
   - Verify `.rotating-text` class exists
   - Verify `.title-item` elements exist
   - Check that first item has `active` class

### If sphere doesn't appear:

1. **Check CSS file loaded:**
   ```javascript
   // In console:
   console.log(getComputedStyle(document.querySelector('.sphere')));
   ```

2. **Verify 3D transforms supported:**
   - Check browser supports `transform-style: preserve-3d`
   - Try different browser if issue persists

3. **Check for CSS conflicts:**
   - Look for `display: none` on `.hero-right`
   - Verify no `overflow: hidden` on parent elements

### If animations are laggy:

1. **Reduce animation complexity:**
   - Remove some particles
   - Increase animation durations
   - Disable sphere on lower-end devices

2. **Check hardware acceleration:**
   - Ensure `will-change` property is working
   - Verify GPU is being used for animations

### If layout breaks on mobile:

1. **Check viewport meta tag:**
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

2. **Verify media queries:**
   - Ensure responsive CSS is loading
   - Check breakpoints match screen sizes

3. **Test with browser DevTools:**
   - Use device emulation
   - Test various screen sizes

---

## ROLLBACK PLAN

If something goes wrong, you can quickly rollback:

### Emergency Rollback Steps:

1. **Remove new CSS import:**
   ```html
   <!-- Comment out this line in index.html -->
   <!-- <link rel="stylesheet" href="css/hero-2025.css"> -->
   ```

2. **Remove new JS import:**
   ```html
   <!-- Comment out this line in index.html -->
   <!-- <script src="js/title-rotator.js"></script> -->
   ```

3. **Restore old hero HTML:**
   - Keep a backup of the old hero section
   - Replace new hero with old HTML

4. **Restore old hero CSS:**
   ```
   css/hero-old.css → css/hero.css
   ```

5. **Hard refresh browser:**
   ```
   Ctrl + Shift + R (Windows/Linux)
   Cmd + Shift + R (Mac)
   ```

---

## POST-IMPLEMENTATION OPTIMIZATION

Once everything works, consider these optimizations:

### Performance Enhancements:

1. **Lazy load sphere on mobile:**
   ```javascript
   // Only initialize sphere if screen width > 768px
   if (window.innerWidth > 768) {
       initSphere();
   }
   ```

2. **Reduce particle count on low-end devices:**
   ```javascript
   // Detect device capabilities
   const isLowEndDevice = navigator.hardwareConcurrency < 4;
   if (isLowEndDevice) {
       // Show fewer particles
   }
   ```

3. **Optimize images:**
   - Compress profile image (WebP format recommended)
   - Use responsive images with `srcset`
   - Lazy load below-the-fold images

### SEO Enhancements:

1. **Add structured data:**
   ```html
   <script type="application/ld+json">
   {
       "@context": "https://schema.org",
       "@type": "Person",
       "name": "Simeon Wansi",
       "jobTitle": "Full-Stack Developer & AI Solutions Architect",
       "url": "https://simeondev.com",
       "sameAs": [
           "https://linkedin.com/in/simeondevs",
           "https://github.com/simeon-wansi"
       ]
   }
   </script>
   ```

2. **Optimize meta tags:**
   ```html
   <meta name="description" content="Simeon Wansi - Full-Stack Developer & AI Solutions Architect based in Dubai. Building intelligent applications for businesses.">
   <meta property="og:title" content="SimeonDev | Full-Stack Developer & AI Architect">
   <meta property="og:description" content="Building intelligent applications that solve real business problems.">
   <meta property="og:image" content="https://simeondev.com/assets/images/og-image.jpg">
   ```

---

## FINAL VERIFICATION

Before considering this complete, verify:

1. ✅ **Old hero section completely replaced**
2. ✅ **New hero section displays correctly**
3. ✅ **All animations work smoothly**
4. ✅ **Navigation to other pages still works**
5. ✅ **Projects page unaffected**
6. ✅ **Blog page unaffected**
7. ✅ **Contact form unaffected**
8. ✅ **Footer unchanged**
9. ✅ **Mobile responsive**
10. ✅ **No console errors**
11. ✅ **Performance acceptable**
12. ✅ **Looks modern and professional**

---

## SUCCESS CRITERIA

The implementation is successful when:

- ✅ Hero section looks modern and cutting-edge (2025 style)
- ✅ Job titles rotate smoothly with 3D flip animation
- ✅ CSS 3D sphere rotates continuously with pulsing core
- ✅ Gradient orbs float in background creating atmosphere
- ✅ Particle network adds subtle depth
- ✅ Profile image has elegant purple border with pulse effect
- ✅ CTAs are prominent and have smooth hover effects
- ✅ Page loads fast (< 2 seconds)
- ✅ Works perfectly on mobile devices
- ✅ No JavaScript errors
- ✅ No broken functionality on other pages
- ✅ Client looks at it and thinks "I want to hire this developer"

---

## SUPPORT & MAINTENANCE

### Common Issues and Solutions:

**Issue:** Titles rotate too fast/slow
**Solution:** Change `interval` in `js/title-rotator.js` line 14

**Issue:** Sphere too big/small
**Solution:** Adjust width/height of `.sphere-container` in CSS

**Issue:** Background too busy
**Solution:** Reduce `opacity` of `.hero-bg` in CSS

**Issue:** Animations causing performance issues
**Solution:** Add `@media (prefers-reduced-motion: reduce)` handling

---

## EXPECTED RESULT

**Before:** Glitchy text "BBuuiilldd.. HHaacckk..", spinning profile picture, chaotic design

**After:** 
- Clean, modern hero section
- Professional profile photo with elegant border
- Smoothly rotating job titles with 3D animation
- Stunning CSS 3D sphere with pulsing core
- Animated gradient background creating depth
- Fast-loading, performant, mobile-friendly
- Professional design that converts visitors to clients

---

**IMPLEMENTATION ESTIMATE:**
- File creation: 10 minutes
- Testing: 15 minutes
- Debugging: 10 minutes
- **Total: ~35 minutes**

Please implement these changes carefully, test thoroughly, and report any issues. The design will transform from amateur to professional-grade while maintaining all existing functionality.
