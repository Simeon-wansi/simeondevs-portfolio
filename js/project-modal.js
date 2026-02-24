/**
 * PROJECT DETAILS MODAL
 * Handles opening, closing, and rendering rich project details
 */

// ============================================
// MODAL BADGE ICONS (SVG - consistent with card badges)
// ============================================

const MODAL_BADGE_ICONS = {
    featured:   `<svg class="badge-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
    completed:  `<svg class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    inProgress: `<svg class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
};

// ============================================
// GLOBAL NAVIGATION STATE
// ============================================

let allProjects = [];
let currentProjectIndex = 0;

// ============================================
// CREATE LOADING MODAL
// ============================================

function createLoadingModal() {
    return `
        <div class="skeleton skeleton-image"></div>

        <div class="modal-body">
            <div class="modal-header loading-state">
                <div class="modal-badges skeleton-badges">
                    <span class="skeleton skeleton-badge"></span>
                    <span class="skeleton skeleton-badge"></span>
                </div>
                <div class="skeleton skeleton-header"></div>
                <div class="skeleton skeleton-text long" style="margin-bottom: 1.5rem;"></div>
                <div class="modal-techs skeleton-tech">
                    <span class="skeleton skeleton-tech-tag"></span>
                    <span class="skeleton skeleton-tech-tag"></span>
                    <span class="skeleton skeleton-tech-tag"></span>
                </div>
            </div>

            <div class="modal-section loading-state">
                <div class="skeleton skeleton-header" style="width: 38%; margin-bottom: 1rem;"></div>
                <div class="skeleton skeleton-text long"></div>
                <div class="skeleton skeleton-text medium"></div>
                <div class="skeleton skeleton-text long"></div>
                <div class="skeleton skeleton-text short"></div>
            </div>

            <div class="modal-section loading-state">
                <div class="skeleton skeleton-header" style="width: 28%; margin-bottom: 1rem;"></div>
                <div class="skeleton skeleton-text long"></div>
                <div class="skeleton skeleton-text medium"></div>
            </div>

            <div class="loading-state skeleton-buttons">
                <div class="skeleton skeleton-button"></div>
                <div class="skeleton skeleton-button"></div>
            </div>
        </div>
    `;
}

// ============================================
// OPEN MODAL WITH PROJECT DATA
// ============================================

function openProjectModal(project, projectList = null, index = null) {
    const modal = document.getElementById('projectModal');
    const content = document.getElementById('modalScrollContent');

    if (!modal || !content) {
        console.error('Modal elements not found');
        return;
    }

    // Set navigation state
    if (projectList && index !== null) {
        allProjects = projectList;
        currentProjectIndex = index;
    } else {
        allProjects = [project];
        currentProjectIndex = 0;
    }

    // Show loading skeleton
    content.innerHTML = createLoadingModal();

    // Show modal immediately with loading state
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Render actual content (data already in memory, no artificial delay)
    if (project.id) {
        incrementProjectDetailsViews(project.id);
    }

    content.innerHTML = renderModalContent(project);
    addNavigationButtons(modal);

    setTimeout(() => { initializeGallery(); }, 50);
    setTimeout(() => { animateScoreBars(); }, 100);

    // Add keyboard listeners
    document.addEventListener('keydown', handleModalKeyboard);

}

// ============================================
// ADD NAVIGATION BUTTONS
// ============================================

function addNavigationButtons(modal) {
    // Remove existing navigation if any
    const existingNav = modal.querySelectorAll('.modal-nav, .modal-nav-counter');
    existingNav.forEach(el => el.remove());

    // Only add navigation if there are multiple projects
    if (allProjects.length <= 1) return;

    const hasPrev = currentProjectIndex > 0;
    const hasNext = currentProjectIndex < allProjects.length - 1;

    // Create Previous button
    const prevNav = document.createElement('div');
    prevNav.className = 'modal-nav nav-left';
    prevNav.innerHTML = `
        <button class="modal-nav-btn" id="modalPrevBtn" ${!hasPrev ? 'disabled' : ''}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 18l-6-6 6-6"/>
            </svg>
        </button>
    `;
    modal.appendChild(prevNav);

    // Create Next button
    const nextNav = document.createElement('div');
    nextNav.className = 'modal-nav nav-right';
    nextNav.innerHTML = `
        <button class="modal-nav-btn" id="modalNextBtn" ${!hasNext ? 'disabled' : ''}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 18l6-6-6-6"/>
            </svg>
        </button>
    `;
    modal.appendChild(nextNav);

    // Create counter
    const counter = document.createElement('div');
    counter.className = 'modal-nav-counter';
    counter.textContent = `${currentProjectIndex + 1} / ${allProjects.length}`;
    modal.appendChild(counter);

    // Add event listeners
    if (hasPrev) {
        document.getElementById('modalPrevBtn').addEventListener('click', navigateToPrevProject);
    }
    if (hasNext) {
        document.getElementById('modalNextBtn').addEventListener('click', navigateToNextProject);
    }
}

// ============================================
// NAVIGATION FUNCTIONS
// ============================================

function navigateToPrevProject() {
    if (currentProjectIndex > 0) {
        currentProjectIndex--;
        const prevProject = allProjects[currentProjectIndex];
        updateModalContent(prevProject);
    }
}

function navigateToNextProject() {
    if (currentProjectIndex < allProjects.length - 1) {
        currentProjectIndex++;
        const nextProject = allProjects[currentProjectIndex];
        updateModalContent(nextProject);
    }
}

function updateModalContent(project) {
    const content = document.getElementById('modalScrollContent');
    const modal = document.getElementById('projectModal');

    if (!content || !modal) return;

    // Show loading skeleton
    content.innerHTML = createLoadingModal();

    // Scroll to top
    content.scrollTop = 0;

    if (project.id) {
        incrementProjectDetailsViews(project.id);
    }

    content.innerHTML = renderModalContent(project);
    addNavigationButtons(modal);

    setTimeout(() => { initializeGallery(); }, 50);
    setTimeout(() => { animateScoreBars(); }, 100);
}

// ============================================
// CLOSE MODAL
// ============================================

function closeProjectModal() {
    const modal = document.getElementById('projectModal');

    if (!modal) return;

    modal.style.display = 'none';
    document.body.style.overflow = '';

    // Remove keyboard listeners
    document.removeEventListener('keydown', handleModalKeyboard);

    // Stop gallery auto-play
    stopGalleryAutoPlay();

    // Reset navigation state
    allProjects = [];
    currentProjectIndex = 0;
    currentGalleryIndex = 0;

}

function handleModalKeyboard(e) {
    if (e.key === 'Escape') {
        closeProjectModal();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateToPrevProject();
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateToNextProject();
    }
}

// For backward compatibility
function handleEscapeKey(e) {
    handleModalKeyboard(e);
}

// ============================================
// RENDER MODAL CONTENT
// ============================================

function renderModalContent(project) {
    // Badges (SVG icons, consistent with card badges)
    const badges = [];
    if (project.featured) {
        badges.push(`<span class="modal-badge badge-featured">${MODAL_BADGE_ICONS.featured} Featured</span>`);
    }
    const statusBadge = project.status === 'completed'
        ? `<span class="modal-badge badge-completed">${MODAL_BADGE_ICONS.completed} Completed</span>`
        : `<span class="modal-badge badge-in-progress">${MODAL_BADGE_ICONS.inProgress} In Progress</span>`;
    badges.push(statusBadge);
    if (project.category) {
        badges.push(`<span class="modal-badge badge-category">${project.category}</span>`);
    }

    // Technologies (all of them in the modal)
    const techTags = (project.technologies || []).map(tech =>
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
            <h2 class="modal-section-title">Highlights</h2>
            <ul class="highlights-list">
                ${project.highlights.map(h => `<li class="highlight-item">${h}</li>`).join('')}
            </ul>
        </div>
        ` : '';

    // AI Scores
    const aiScoresHTML = (project.complexity_score || project.innovation_score || project.business_impact_score)
        ? `
        <div class="modal-section">
            <h2 class="modal-section-title">AI Analysis</h2>
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
            <h2 class="modal-section-title">Challenges</h2>
            <div class="modal-text-content"><p>${project.challenges}</p></div>
        </div>
    ` : '';

    const solutionsHTML = project.solutions ? `
        <div class="modal-section">
            <h2 class="modal-section-title">Solutions</h2>
            <div class="modal-text-content"><p>${project.solutions}</p></div>
        </div>
    ` : '';

    const resultsHTML = project.results ? `
        <div class="modal-section">
            <h2 class="modal-section-title">Results</h2>
            <div class="modal-text-content"><p>${project.results}</p></div>
        </div>
    ` : '';

    // Lessons Learned
    const lessonsHTML = project.lessons_learned && project.lessons_learned.length > 0
        ? `
        <div class="modal-section">
            <h2 class="modal-section-title">Lessons Learned</h2>
            <ul class="lessons-list">
                ${project.lessons_learned.map(l => `<li class="lesson-item">${l}</li>`).join('')}
            </ul>
        </div>
        ` : '';

    // Project Info
    const hasInfoItems = project.project_duration || project.team_size || project.role || project.completed_date;
    const projectInfoHTML = hasInfoItems ? `
        <div class="modal-section">
            <h2 class="modal-section-title">Project Info</h2>
            <div class="project-info-grid">
                ${project.role ? `
                    <div class="info-item">
                        <span class="info-label">Role</span>
                        <span class="info-value">${project.role}</span>
                    </div>
                ` : ''}
                ${project.project_duration ? `
                    <div class="info-item">
                        <span class="info-label">Duration</span>
                        <span class="info-value">${project.project_duration}</span>
                    </div>
                ` : ''}
                ${project.team_size ? `
                    <div class="info-item">
                        <span class="info-label">Team Size</span>
                        <span class="info-value">${project.team_size === 1 ? 'Solo' : `${project.team_size} people`}</span>
                    </div>
                ` : ''}
                ${project.completed_date ? `
                    <div class="info-item">
                        <span class="info-label">Completed</span>
                        <span class="info-value">${new Date(project.completed_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                    </div>
                ` : ''}
            </div>
        </div>
    ` : '';

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
                    Blog Post
                </a>
            ` : ''}
        </div>
    `;

    // Footer Stats
    const footerHTML = `
        <div class="modal-footer">
            <div class="footer-stats">
                <span class="stat-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    ${project.view_count || 0} views
                </span>
                ${project.github_clicks ? `
                    <span class="stat-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                        </svg>
                        ${project.github_clicks} GitHub clicks
                    </span>
                ` : ''}
            </div>
        </div>
    `;

    // Hero image / gallery
    const galleryImages = [];
    if (project.image_url && project.image_url.trim() !== '') {
        galleryImages.push(project.image_url);
    }
    if (project.gallery_images && Array.isArray(project.gallery_images)) {
        galleryImages.push(...project.gallery_images.filter(img => img && img.trim() !== ''));
    }

    const imageGalleryHTML = galleryImages.length > 0
        ? renderImageGallery(galleryImages, project.title)
        : `
            <div class="modal-hero-placeholder">
                <div class="placeholder-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                    </svg>
                </div>
                <h2 class="placeholder-title">${project.title}</h2>
            </div>
        `;

    return `
        ${imageGalleryHTML}

        <div class="modal-body">
            <div class="modal-header">
                <div class="modal-badges">${badges.join('')}</div>
                <h1 class="modal-title">${project.title}</h1>
                <p class="modal-tagline">${project.tagline || project.description || ''}</p>
                <div class="modal-techs">${techTags}</div>
            </div>

            ${keyMetricsHTML}
            ${highlightsHTML}
            ${aiScoresHTML}

            ${project.full_description ? `
                <div class="modal-section">
                    <h2 class="modal-section-title">Overview</h2>
                    <div class="modal-text-content"><p>${project.full_description}</p></div>
                </div>
            ` : ''}

            ${challengesHTML}
            ${solutionsHTML}
            ${resultsHTML}
            ${lessonsHTML}
            ${projectInfoHTML}
            ${actionsHTML}
            ${footerHTML}
        </div>
    `;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function renderKeyMetrics(metrics) {
    const items = Object.entries(metrics).map(([key, value]) => {
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return `
            <div class="metric-tile">
                <span class="metric-tile-value">${value}</span>
                <span class="metric-tile-label">${label}</span>
            </div>
        `;
    }).join('');

    return `
        <div class="modal-section">
            <h2 class="modal-section-title">Key Metrics</h2>
            <div class="key-metrics-grid">
                ${items}
            </div>
        </div>
    `;
}

function renderScoreBar(label, score) {
    // Scores are on a 0–10 scale; convert to percentage for bar width
    const pct = Math.round(Math.min(score, 10) * 10);
    return `
        <div class="score-item">
            <div class="score-header">
                <span class="score-label">${label}</span>
                <span class="score-value">${score}/10</span>
            </div>
            <div class="score-bar">
                <div class="score-fill" data-score="${pct}" style="width: 0%"></div>
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
// IMAGE GALLERY
// ============================================

let currentGalleryIndex = 0;
let galleryAutoPlayInterval = null;

function renderImageGallery(images, projectTitle) {
    if (images.length === 1) {
        // Single image - no gallery controls
        return `
            <img src="${images[0]}" 
                 alt="${projectTitle}" 
                 class="modal-hero-image"
                 onerror="this.style.display='none';">
        `;
    }

    // Multiple images - full gallery
    const imagesHTML = images.map((img, index) => `
        <img src="${img}" 
             alt="${projectTitle} - Image ${index + 1}" 
             class="gallery-image"
             data-index="${index}"
             onerror="this.style.display='none';">
    `).join('');

    const dotsHTML = images.map((_, index) => `
        <span class="gallery-dot ${index === 0 ? 'active' : ''}" 
              data-index="${index}"
              onclick="goToGalleryImage(${index})"></span>
    `).join('');

    return `
        <div class="modal-gallery" id="modalGallery">
            <div class="gallery-main">
                <div class="gallery-images" id="galleryImages">
                    ${imagesHTML}
                </div>
                
                <button class="gallery-arrow prev" onclick="previousGalleryImage()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                </button>
                
                <button class="gallery-arrow next" onclick="nextGalleryImage()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 18l6-6-6-6"/>
                    </svg>
                </button>
                
                <div class="gallery-counter">
                    <span id="galleryCounter">1 / ${images.length}</span>
                </div>
            </div>
            
            <div class="gallery-dots" id="galleryDots">
                ${dotsHTML}
            </div>
        </div>
    `;
}

function initializeGallery() {
    const gallery = document.getElementById('modalGallery');
    if (!gallery) return;

    currentGalleryIndex = 0;

    // Start auto-play (optional - 4 seconds per image)
    startGalleryAutoPlay();

    // Pause auto-play on hover
    gallery.addEventListener('mouseenter', stopGalleryAutoPlay);
    gallery.addEventListener('mouseleave', startGalleryAutoPlay);
}

function goToGalleryImage(index) {
    const imagesContainer = document.getElementById('galleryImages');
    const dots = document.querySelectorAll('.gallery-dot');
    const counter = document.getElementById('galleryCounter');
    const images = document.querySelectorAll('.gallery-image');

    if (!imagesContainer || !images.length) return;

    // Ensure index is within bounds
    currentGalleryIndex = Math.max(0, Math.min(index, images.length - 1));

    // Update transform
    const offset = -currentGalleryIndex * 100;
    imagesContainer.style.transform = `translateX(${offset}%)`;

    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentGalleryIndex);
    });

    // Update counter
    if (counter) {
        counter.textContent = `${currentGalleryIndex + 1} / ${images.length}`;
    }

    // Reset auto-play
    stopGalleryAutoPlay();
    startGalleryAutoPlay();
}

function previousGalleryImage() {
    const images = document.querySelectorAll('.gallery-image');
    if (currentGalleryIndex > 0) {
        goToGalleryImage(currentGalleryIndex - 1);
    }
}

function nextGalleryImage() {
    const images = document.querySelectorAll('.gallery-image');
    if (currentGalleryIndex < images.length - 1) {
        goToGalleryImage(currentGalleryIndex + 1);
    } else {
        // Loop back to first image
        goToGalleryImage(0);
    }
}

function startGalleryAutoPlay() {
    stopGalleryAutoPlay(); // Clear any existing interval
    
    const images = document.querySelectorAll('.gallery-image');
    if (images.length <= 1) return; // Don't auto-play single image

    galleryAutoPlayInterval = setInterval(() => {
        nextGalleryImage();
    }, 4000); // 4 seconds per image
}

function stopGalleryAutoPlay() {
    if (galleryAutoPlayInterval) {
        clearInterval(galleryAutoPlayInterval);
        galleryAutoPlayInterval = null;
    }
}

// ============================================
// INCREMENT DETAILS VIEWS
// ============================================

async function incrementProjectDetailsViews(projectId) {
    try {
        const { data, error } = await supabaseClient
            .from('projects')
            .update({ details_views: supabaseClient.raw('details_views + 1') })
            .eq('id', projectId);

        if (error) {
            console.error('Error incrementing details views:', error);
        }
    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

// Make functions globally available
// Note: trackProjectClick is defined and exported in supabase-client.js
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.goToGalleryImage = goToGalleryImage;
window.previousGalleryImage = previousGalleryImage;
window.nextGalleryImage = nextGalleryImage;
