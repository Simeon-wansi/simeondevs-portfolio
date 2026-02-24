// Simeondevs Portfolio - Main JavaScript File
// Navigation & Core Functionality

// Block right-click save and drag on images
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') e.preventDefault();
});
document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') e.preventDefault();
});

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupNavigation();
    setupMobileMenu();
    initializeScrollAnimations();
    initializeNavScroll();
});

// Nav scroll state - adds .scrolled to <nav> after 50px
function initializeNavScroll() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // apply immediately on load in case page restores a scroll position
}

// Initialize core application features
function initializeApp() {
    
    // Load user preferences from localStorage
    loadUserPreferences();
    
    // Set initial page
    const currentPage = localStorage.getItem('currentPage') || 'home';
    showPage(currentPage);
    
    // Initialize background animations
    initializeBackgroundAnimations();
}

// Main page switching functionality (UPDATED)
function showPage(pageId) {
    
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
        page.style.opacity = '0';
    });
    
    // Show selected page with fade-in animation
    setTimeout(() => {
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.style.opacity = '1';
            
            // Update navigation active state
            updateNavigationState(pageId);
            
            // Save current page
            localStorage.setItem('currentPage', pageId);
            
            
            // Initialize page-specific Supabase data
            initializePageData(pageId);
            
            // Trigger page-specific animations
            triggerPageAnimations(pageId);
        }
    }, 50);
}
// ============================================
// INITIALIZE PAGE-SPECIFIC DATA FROM SUPABASE
// ============================================
function initializePageData(pageId) {

    switch(pageId) {
        case 'home':

            // Load featured projects
            if (typeof loadFeaturedProjects === 'function') {
                loadFeaturedProjects();
            } else {
                console.error('❌ loadFeaturedProjects function not found!');
            }

            // Load latest blog posts
            if (typeof loadLatestBlogPosts === 'function') {
                loadLatestBlogPosts();
            } else {
                console.error('❌ loadLatestBlogPosts function not found!');
            }
            break;
            
        case 'projects':
            if (typeof initializeProjects === 'function') {
                initializeProjects();
            } else {
                console.error('❌ initializeProjects function not found!');
            }
            break;
            
        case 'blog':
            if (typeof initializeBlog === 'function') {
                initializeBlog();
            } else {
                console.error('❌ initializeBlog function not found!');
            }
            break;
            
        case 'about':
            break;
            
        case 'services':
            // Future: Load from Supabase if needed
            break;
            
        case 'contact':
            break;
            
        default:
    }
}

// Update navigation active state
function updateNavigationState(activePageId) {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick')?.includes(activePageId)) {
            link.classList.add('active');
        }
    });
}

// Setup navigation event listeners
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const onclick = this.getAttribute('onclick');
            if (onclick) {
                const pageId = onclick.match(/showPage\('([^']+)'\)/)[1];
                showPage(pageId);
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// Mobile menu setup - simplified since HTML already has the button
function setupMobileMenu() {
}

// Mobile Menu Toggle Functionality
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const mobileToggle = document.getElementById('mobileMenuToggle');

    const isOpen = navLinks.classList.toggle('active');
    mobileToggle.classList.toggle('active');
    mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    // Attach close-on-click to links when opening
    if (isOpen) {
        navLinks.querySelectorAll('a').forEach(item => {
            item.addEventListener('click', closeMobileMenu, { once: true });
        });
    }
}

function closeMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const mobileToggle = document.getElementById('mobileMenuToggle');

    navLinks.classList.remove('active');
    mobileToggle.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const nav = document.querySelector('nav');
    const navLinks = document.getElementById('navLinks');
    const mobileToggle = document.getElementById('mobileMenuToggle');
    
    if (!nav.contains(event.target) && navLinks.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Initialize scroll-triggered animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    document.querySelectorAll('.skill-card, .project-card, .blog-card, .service-card').forEach(el => {
        observer.observe(el);
    });
}

// Trigger page-specific animations
function triggerPageAnimations(pageId) {
    switch(pageId) {
        case 'home':
            animateHeroText();
            animateSkillCards();
            break;
        case 'projects':
            
            // Initialize projects first, then animate
            setTimeout(() => {
                if (typeof window.initializeProjects === 'function') {
                    window.initializeProjects();
                    // Animate project cards after they're created
                    setTimeout(() => {
                        animateProjectCards();
                    }, 100);
                } else {
                    console.error('❌ initializeProjects function not found');
                }
            }, 100);
            
            break;
        case 'about':
            animateStats();
            break;
        default:
            // Generic page animation
            animatePageContent();
    }
}

// Hero text typing animation
function animateHeroText() {
    const heroTitle = document.querySelector('.hero h1');
    const heroTagline = document.querySelector('.hero .tagline');
    
    if (heroTitle && !heroTitle.classList.contains('typed')) {
        heroTitle.classList.add('typed');
        typeWriter(heroTitle, 'SimeonDev', 100);
    }
    
    if (heroTagline && !heroTagline.classList.contains('typed')) {
        setTimeout(() => {
            heroTagline.classList.add('typed');
            typeWriter(heroTagline, '🔧 Build. Hack. Learn.', 50);
        }, 1000);
    }
}

// Typewriter effect
function typeWriter(element, text, speed) {
    element.innerHTML = '';
    element.style.borderRight = '2px solid #ffd60a';
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 500);
        }
    }, speed);
}

// Animate skill cards
function animateSkillCards() {
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'translateY(0)';
            card.style.opacity = '1';
        }, index * 150);
    });
}

// Animate project cards
function animateProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'translateY(0)';
            card.style.opacity = '1';
        }, index * 200);
    });
}

// Animate statistics
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        animateCounter(stat, 0, finalValue, 2000);
    });
}

// Counter animation
function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = Math.floor(start + (end - start) * progress);
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Generic page content animation
function animatePageContent() {
    const elements = document.querySelectorAll('.page.active .container > *');
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.style.transform = 'translateY(0)';
            el.style.opacity = '1';
        }, index * 100);
    });
}

// Initialize background animations
function initializeBackgroundAnimations() {
    // This will be enhanced by animations.js
}

// Load user preferences
function loadUserPreferences() {
    const preferences = localStorage.getItem('userPreferences');
    if (preferences) {
        const prefs = JSON.parse(preferences);
        // Apply saved preferences
    }
}

// Save user preferences
function saveUserPreferences(preferences) {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
}

// Smooth scrolling utility
function smoothScrollTo(element, duration = 1000) {
    const targetPosition = element.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// ============================================
// GLOBAL NOTIFICATION UTILITY
// Used by blog-supabase.js and other modules
// ============================================
function showNotification(message, type = 'info') {
    const existing = document.getElementById('global-notification');
    if (existing) existing.remove();

    const colors = {
        success: 'background:rgba(0,255,65,0.12);border:1px solid rgba(0,255,65,0.35);color:#00ff41;',
        error:   'background:rgba(255,0,110,0.12);border:1px solid rgba(255,0,110,0.35);color:#ff006e;',
        warning: 'background:rgba(255,214,10,0.12);border:1px solid rgba(255,214,10,0.35);color:#ffd60a;',
        info:    'background:rgba(0,245,255,0.12);border:1px solid rgba(0,245,255,0.35);color:#00f5ff;'
    };

    const note = document.createElement('div');
    note.id = 'global-notification';
    note.textContent = message;
    note.style.cssText = `
        position:fixed;top:80px;right:1.5rem;z-index:99999;
        padding:0.75rem 1.25rem;border-radius:8px;
        font-size:0.9rem;max-width:320px;
        animation:slideIn 0.3s ease;
        ${colors[type] || colors.info}
    `;

    document.body.appendChild(note);
    setTimeout(() => { if (note.parentNode) note.remove(); }, 4000);
}

// Export functions for global use
window.showPage = showPage;             // called from nav link onclick attributes in HTML
window.showNotification = showNotification; // called by blog-supabase.js and other modules
