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
        ${project.image_url && project.image_url.trim() !== '' ? `
            <img src="${project.image_url}" 
                 alt="${project.title}" 
                 class="modal-hero-image"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="modal-hero-placeholder" style="display: none;">
                <div class="placeholder-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                    </svg>
                </div>
                <h2 class="placeholder-title">${project.title}</h2>
            </div>
        ` : `
            <div class="modal-hero-placeholder">
                <div class="placeholder-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                    </svg>
                </div>
                <h2 class="placeholder-title">${project.title}</h2>
            </div>
        `}

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

// ============================================
// TRACK CLICKS
// ============================================

function trackProjectClick(projectId, type) {
    // Track click in database
    const field = `${type}_clicks`;

    supabaseClient
        .from('projects')
        .update({ [field]: supabaseClient.raw(`${field} + 1`) })
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
