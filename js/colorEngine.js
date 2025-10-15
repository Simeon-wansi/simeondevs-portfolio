// SimeonDev Portfolio - Dynamic Color Engine
// Advanced Color Management & Theme System

// Color engine configuration
const colorEngine = {
    themes: {
        matrix: {
            primary: '#00ff41',
            secondary: '#9d4edd',
            accent: '#ffd60a',
            background: '#0a0a0a'
        },
        cyber: {
            primary: '#00f5ff',
            secondary: '#ff006e',
            accent: '#ffd60a',
            background: '#0a0a0a'
        },
        neon: {
            primary: '#9d4edd',
            secondary: '#00f5ff',
            accent: '#ff006e',
            background: '#0a0a0a'
        }
    },
    currentTheme: 'matrix',
    isInitialized: false
};

// Initialize color engine - with delay for better performance
document.addEventListener('DOMContentLoaded', function() {
    // Delay color engine initialization to improve page load speed
    setTimeout(() => {
        initializeColorEngine();
        setupThemeControls();
        setupDynamicColors();
        loadSavedTheme();
    }, 500); // 0.5 second delay
});

// Initialize color engine
function initializeColorEngine() {
    if (colorEngine.isInitialized) return;
    
    console.log('🎨 Color Engine Initialized');
    
    // Apply initial theme
    applyTheme(colorEngine.currentTheme);
    
    // Set up color transitions
    setupColorTransitions();
    
    // Initialize dynamic color effects
    initializeDynamicEffects();
    
    colorEngine.isInitialized = true;
}

// Apply theme colors
function applyTheme(themeName) {
    const theme = colorEngine.themes[themeName];
    if (!theme) return;
    
    const root = document.documentElement;
    root.style.setProperty('--section-primary', theme.primary);
    root.style.setProperty('--section-secondary', theme.secondary);
    root.style.setProperty('--section-accent', theme.accent);
    root.style.setProperty('--primary-bg', theme.background);
    
    colorEngine.currentTheme = themeName;
    
    // Save theme preference
    localStorage.setItem('selectedTheme', themeName);
    
    // Trigger theme change event
    document.dispatchEvent(new CustomEvent('themeChanged', { 
        detail: { theme: themeName } 
    }));
}

// Setup theme controls
function setupThemeControls() {
    // Create theme switcher if it doesn't exist
    if (!document.querySelector('.theme-switcher')) {
        createThemeSwitcher();
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey) {
            switch(e.key) {
                case 'M':
                    applyTheme('matrix');
                    break;
                case 'C':
                    applyTheme('cyber');
                    break;
                case 'N':
                    applyTheme('neon');
                    break;
            }
        }
    });
}

// Create theme switcher UI
function createThemeSwitcher() {
    const switcher = document.createElement('div');
    switcher.className = 'theme-switcher';
    switcher.innerHTML = `
        <div class="theme-toggle" title="Change Theme">
            <span class="theme-icon">🎨</span>
            <div class="theme-options">
                <button class="theme-option" data-theme="matrix">Matrix</button>
                <button class="theme-option" data-theme="cyber">Cyber</button>
                <button class="theme-option" data-theme="neon">Neon</button>
            </div>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .theme-switcher {
            position: fixed;
            top: 50%;
            right: 20px;
            z-index: 1000;
            transform: translateY(-50%);
        }
        
        .theme-toggle {
            position: relative;
            background: rgba(26, 10, 46, 0.8);
            border: 1px solid rgba(157, 78, 221, 0.3);
            border-radius: 50px;
            padding: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .theme-toggle:hover {
            background: rgba(26, 10, 46, 0.9);
            transform: scale(1.1);
        }
        
        .theme-icon {
            font-size: 1.5rem;
            display: block;
        }
        
        .theme-options {
            position: absolute;
            top: 0;
            right: 100%;
            margin-right: 1rem;
            background: rgba(26, 10, 46, 0.95);
            border: 1px solid rgba(157, 78, 221, 0.3);
            border-radius: 10px;
            padding: 0.5rem;
            display: none;
            flex-direction: column;
            gap: 0.5rem;
            min-width: 100px;
        }
        
        .theme-toggle:hover .theme-options {
            display: flex;
        }
        
        .theme-option {
            background: none;
            border: none;
            color: #ffffff;
            padding: 0.5rem;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .theme-option:hover {
            background: rgba(157, 78, 221, 0.3);
        }
        
        @media (max-width: 768px) {
            .theme-switcher {
                right: 10px;
                top: auto;
                bottom: 20px;
            }
            
            .theme-options {
                top: auto;
                bottom: 100%;
                margin-bottom: 1rem;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(switcher);
    
    // Add event listeners
    switcher.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            applyTheme(this.dataset.theme);
        });
    });
}

// Setup dynamic colors based on page
function setupDynamicColors() {
    // Listen for page changes
    document.addEventListener('pageChanged', function(e) {
        const pageId = e.detail.pageId;
        updateColorsForPage(pageId);
    });
    
    // Listen for theme changes
    document.addEventListener('themeChanged', function(e) {
        updateAllPageColors();
    });
}

// Update colors for specific page
function updateColorsForPage(pageId) {
    const page = document.getElementById(pageId);
    if (!page) return;
    
    const colorScheme = getPageColorScheme(pageId);
    
    // Apply page-specific colors
    page.style.setProperty('--page-primary', colorScheme.primary);
    page.style.setProperty('--page-secondary', colorScheme.secondary);
    page.style.setProperty('--page-accent', colorScheme.accent);
    
    // Update cards and elements
    updatePageElements(page, colorScheme);
}

// Get color scheme for page
function getPageColorScheme(pageId) {
    const theme = colorEngine.themes[colorEngine.currentTheme];
    const schemes = {
        home: {
            primary: theme.primary,
            secondary: theme.secondary,
            accent: theme.accent
        },
        projects: {
            primary: theme.secondary,
            secondary: theme.accent,
            accent: theme.primary
        },
        blog: {
            primary: theme.accent,
            secondary: theme.primary,
            accent: theme.secondary
        },
        about: {
            primary: theme.primary,
            secondary: theme.accent,
            accent: theme.secondary
        },
        services: {
            primary: theme.secondary,
            secondary: theme.primary,
            accent: theme.accent
        },
        contact: {
            primary: theme.accent,
            secondary: theme.secondary,
            accent: theme.primary
        }
    };
    
    return schemes[pageId] || schemes.home;
}

// Update page elements with new colors
function updatePageElements(page, colorScheme) {
    // Update cards
    const cards = page.querySelectorAll('.skill-card, .project-card, .blog-card, .service-card');
    cards.forEach(card => {
        card.style.borderColor = colorScheme.primary + '50';
    });
    
    // Update headings
    const headings = page.querySelectorAll('h2, h3');
    headings.forEach(heading => {
        heading.style.color = colorScheme.secondary;
    });
    
    // Update accent elements
    const accents = page.querySelectorAll('.project-tech, .blog-date, .service-icon');
    accents.forEach(accent => {
        accent.style.color = colorScheme.accent;
    });
}

// Initialize dynamic effects
function initializeDynamicEffects() {
    // Mouse-based color changes
    setupMouseColorEffects();
    
    // Time-based color shifts
    setupTimeBasedColors();
    
    // Scroll-based color changes
    setupScrollColorEffects();
}

// Setup mouse-based color effects
function setupMouseColorEffects() {
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
        
        // Update CSS custom properties
        document.documentElement.style.setProperty('--mouse-x', mouseX);
        document.documentElement.style.setProperty('--mouse-y', mouseY);
        
        // Apply subtle color shifts
        applyMouseColorShift(mouseX, mouseY);
    });
}

// Apply mouse-based color shifts
function applyMouseColorShift(x, y) {
    const hueShift = Math.floor(x * 30); // 0-30 degree shift
    const saturation = 1 + (y * 0.2); // 100-120% saturation
    
    const elements = document.querySelectorAll('.interactive-color');
    elements.forEach(el => {
        el.style.filter = `hue-rotate(${hueShift}deg) saturate(${saturation})`;
    });
}

// Setup time-based color changes
function setupTimeBasedColors() {
    setInterval(() => {
        const hour = new Date().getHours();
        const seasonalHue = getSeasonalHue();
        const timeHue = (hour * 15) % 360; // 15 degrees per hour
        
        document.documentElement.style.setProperty('--time-hue', timeHue + 'deg');
        document.documentElement.style.setProperty('--seasonal-hue', seasonalHue + 'deg');
    }, 60000); // Update every minute
}

// Get seasonal hue adjustment
function getSeasonalHue() {
    const month = new Date().getMonth();
    const seasonalHues = {
        spring: 120, // Green
        summer: 60,  // Yellow
        autumn: 30,  // Orange
        winter: 240  // Blue
    };
    
    if (month >= 2 && month <= 4) return seasonalHues.spring;
    if (month >= 5 && month <= 7) return seasonalHues.summer;
    if (month >= 8 && month <= 10) return seasonalHues.autumn;
    return seasonalHues.winter;
}

// Setup scroll-based color effects
function setupScrollColorEffects() {
    window.addEventListener('scroll', function() {
        const scrollPercent = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
        const hueShift = Math.floor(scrollPercent * 360);
        
        document.documentElement.style.setProperty('--scroll-hue', hueShift + 'deg');
        
        // Apply to scroll-reactive elements
        const elements = document.querySelectorAll('.scroll-reactive');
        elements.forEach(el => {
            el.style.filter = `hue-rotate(${hueShift}deg)`;
        });
    });
}

// Setup color transitions
function setupColorTransitions() {
    const style = document.createElement('style');
    style.textContent = `
        * {
            transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
        }
        
        .color-transition {
            transition: all 0.3s ease;
        }
        
        .smooth-color-transition {
            transition: all 0.6s ease;
        }
        
        .fast-color-transition {
            transition: all 0.15s ease;
        }
    `;
    
    document.head.appendChild(style);
}

// Load saved theme
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme && colorEngine.themes[savedTheme]) {
        applyTheme(savedTheme);
    }
}

// Update all page colors
function updateAllPageColors() {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        updateColorsForPage(page.id);
    });
}

// Color utilities
const colorUtils = {
    // Convert hex to RGB
    hexToRgb: function(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
    
    // Convert RGB to hex
    rgbToHex: function(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    
    // Generate random color
    randomColor: function() {
        const colors = Object.values(colorEngine.themes[colorEngine.currentTheme]);
        return colors[Math.floor(Math.random() * colors.length)];
    },
    
    // Create gradient
    createGradient: function(color1, color2, direction = '45deg') {
        return `linear-gradient(${direction}, ${color1}, ${color2})`;
    }
};

// Export functions for global use
window.ColorEngine = {
    applyTheme,
    updateColorsForPage,
    getPageColorScheme,
    colorUtils,
    currentTheme: () => colorEngine.currentTheme,
    availableThemes: () => Object.keys(colorEngine.themes)
};
