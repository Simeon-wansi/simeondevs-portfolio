// SimeonDev Portfolio - Advanced Animations & Matrix Effects
// Particle System & Visual Effects

// Initialize animations when DOM is ready - with delay for better performance
document.addEventListener('DOMContentLoaded', function() {
    // Delay heavy animations to allow page to load first
    setTimeout(() => {
        initializeParticleSystem();
        initializeMatrixBackground();
        setupMouseInteractions();
        initializeColorEngine();
    }, 1000); // 1 second delay
});

// Particle system configuration - Optimized for better performance
const particleConfig = {
    colors: ['#9d4edd', '#ffd60a', '#00f5ff', '#ff006e', '#00ff41', '#0077ff'],
    maxParticles: 15, // Reduced from 50 to 15
    speed: 0.3, // Reduced speed
    size: { min: 1, max: 2 }, // Smaller particles
    opacity: { min: 0.2, max: 0.6 } // Lower opacity
};

let particles = [];
let mouseX = 0;
let mouseY = 0;
let isMouseMoving = false;

// Initialize particle system
function initializeParticleSystem() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        opacity: 0.6;
    `;
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    resizeCanvas(canvas);
    
    // Create initial particles
    createParticles(canvas);
    
    // Start animation loop
    animateParticles(canvas, ctx);
    
    // Handle resize
    window.addEventListener('resize', () => resizeCanvas(canvas));
}

// Resize canvas to fit window
function resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Create particles
function createParticles(canvas) {
    particles = [];
    
    for (let i = 0; i < particleConfig.maxParticles; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * particleConfig.speed,
            vy: (Math.random() - 0.5) * particleConfig.speed,
            color: particleConfig.colors[Math.floor(Math.random() * particleConfig.colors.length)],
            size: Math.random() * (particleConfig.size.max - particleConfig.size.min) + particleConfig.size.min,
            opacity: Math.random() * (particleConfig.opacity.max - particleConfig.opacity.min) + particleConfig.opacity.min,
            life: Math.random() * 100,
            decay: Math.random() * 0.02 + 0.005
        });
    }
}

// Animate particles
function animateParticles(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Mouse interaction
        if (isMouseMoving) {
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx += dx * force * 0.01;
                particle.vy += dy * force * 0.01;
            }
        }
        
        // Boundary collision
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Update life
        particle.life -= particle.decay;
        if (particle.life <= 0) {
            // Reset particle
            particle.x = Math.random() * canvas.width;
            particle.y = Math.random() * canvas.height;
            particle.life = 100;
            particle.color = particleConfig.colors[Math.floor(Math.random() * particleConfig.colors.length)];
        }
        
        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity * (particle.life / 100);
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.fill();
        
        ctx.restore();
        
        // Connect nearby particles
        particles.slice(index + 1).forEach(otherParticle => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                ctx.save();
                ctx.globalAlpha = 0.2 * (1 - distance / 100);
                ctx.strokeStyle = particle.color;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.stroke();
                ctx.restore();
            }
        });
    });
    
    requestAnimationFrame(() => animateParticles(canvas, ctx));
}

// Initialize matrix background
function initializeMatrixBackground() {
    const matrixBg = document.createElement('div');
    matrixBg.className = 'matrix-bg';
    matrixBg.innerHTML = '<div class="matrix-stars"></div>';
    document.body.appendChild(matrixBg);
    
    // Create additional matrix layers
    createMatrixLayers();
}

// Create matrix layers
function createMatrixLayers() {
    for (let i = 0; i < 3; i++) {
        const layer = document.createElement('div');
        layer.className = 'matrix-layer';
        layer.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            background-image: 
                radial-gradient(1px 1px at ${Math.random() * 100}px ${Math.random() * 100}px, ${getRandomMatrixColor()}, transparent),
                radial-gradient(2px 2px at ${Math.random() * 200}px ${Math.random() * 200}px, ${getRandomMatrixColor()}, transparent);
            background-size: ${200 + i * 50}px ${100 + i * 25}px;
            animation: matrixFall ${20 + i * 5}s linear infinite;
            animation-delay: ${i * 2}s;
            opacity: ${0.3 - i * 0.1};
        `;
        
        document.querySelector('.matrix-bg').appendChild(layer);
    }
}

// Get random matrix color
function getRandomMatrixColor() {
    const colors = ['rgba(157, 78, 221, 0.4)', 'rgba(255, 214, 10, 0.3)', 'rgba(0, 255, 65, 0.5)', 'rgba(0, 245, 255, 0.3)'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Setup mouse interactions
function setupMouseInteractions() {
    let mouseTimeout;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMouseMoving = true;
        
        // Create mouse trail effect
        createMouseTrail(e.clientX, e.clientY);
        
        // Clear mouse moving flag after delay
        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => {
            isMouseMoving = false;
        }, 100);
    });
    
    // Add click effects
    document.addEventListener('click', (e) => {
        createClickEffect(e.clientX, e.clientY);
    });
}

// Create mouse trail effect
function createMouseTrail(x, y) {
    const trail = document.createElement('div');
    trail.className = 'mouse-trail';
    trail.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 8px;
        height: 8px;
        background: radial-gradient(circle, #ffd60a, transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: trailFade 0.5s ease-out forwards;
    `;
    
    document.body.appendChild(trail);
    
    // Remove trail after animation
    setTimeout(() => {
        trail.remove();
    }, 500);
}

// Create click effect
function createClickEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.style.cssText = `
        position: fixed;
        left: ${x - 25}px;
        top: ${y - 25}px;
        width: 50px;
        height: 50px;
        border: 2px solid #9d4edd;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: clickRipple 0.6s ease-out forwards;
    `;
    
    document.body.appendChild(effect);
    
    // Remove effect after animation
    setTimeout(() => {
        effect.remove();
    }, 600);
}

// Initialize color engine
function initializeColorEngine() {
    // Dynamic color variations for different sections
    const sections = document.querySelectorAll('.page');
    
    sections.forEach(section => {
        const sectionId = section.id;
        const colorScheme = getSectionColorScheme(sectionId);
        
        // Apply color scheme variables
        section.style.setProperty('--section-primary', colorScheme.primary);
        section.style.setProperty('--section-secondary', colorScheme.secondary);
        section.style.setProperty('--section-accent', colorScheme.accent);
    });
}

// Get color scheme for section
function getSectionColorScheme(sectionId) {
    const schemes = {
        home: {
            primary: '#9d4edd',
            secondary: '#ffd60a',
            accent: '#00f5ff'
        },
        projects: {
            primary: '#ff006e',
            secondary: '#00ff41',
            accent: '#ffd60a'
        },
        blog: {
            primary: '#0077ff',
            secondary: '#9d4edd',
            accent: '#ffd60a'
        },
        about: {
            primary: '#00f5ff',
            secondary: '#ff006e',
            accent: '#9d4edd'
        },
        services: {
            primary: '#00ff41',
            secondary: '#0077ff',
            accent: '#ffd60a'
        },
        contact: {
            primary: '#ffd60a',
            secondary: '#9d4edd',
            accent: '#00f5ff'
        }
    };
    
    return schemes[sectionId] || schemes.home;
}

// Add required CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes trailFade {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.5); }
    }
    
    @keyframes clickRipple {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
    }
    
    @keyframes matrixFall {
        0% { transform: translateY(-100vh) rotate(0deg); }
        100% { transform: translateY(100vh) rotate(360deg); }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .skill-card, .project-card, .blog-card, .service-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
    }
    
    .nav-links.mobile-open {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: rgba(26, 10, 46, 0.95);
        backdrop-filter: blur(10px);
        padding: 1rem;
        border-radius: 0 0 10px 10px;
    }
    
    @media (max-width: 768px) {
        .mobile-toggle {
            display: block !important;
        }
        .nav-links {
            display: none;
        }
    }
`;
document.head.appendChild(style);

// Export functions for global use
window.SimeonDevAnimations = {
    createParticles,
    createMouseTrail,
    createClickEffect,
    initializeColorEngine
};
