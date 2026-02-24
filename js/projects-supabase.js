/**
 * PROJECTS SUPABASE INTEGRATION
 * Fetches projects with all new fields and renders minimalist cards
 */

// Import supabase client
// Assumes supabase client is already initialized in supabase-client.js

/**
 * Check if image URL is valid and accessible
 * @param {string} url - Image URL to check
 * @returns {boolean} - True if image exists
 */
function isValidImageUrl(url) {
    if (!url || typeof url !== 'string' || url.trim() === '') {
        return false;
    }
    
    // Check if it's a valid URL format
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// ============================================
// FETCH PROJECTS FROM SUPABASE
// ============================================

async function fetchProjects(featured = null) {
    try {
        let query = supabaseClient
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

        return data;

    } catch (error) {
        console.error('Unexpected error fetching projects:', error);
        return [];
    }
}

// ============================================
// BADGE SVG ICONS
// ============================================

const BADGE_ICONS = {
    featured:   `<svg class="badge-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
    completed:  `<svg class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    inProgress: `<svg class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
};

// ============================================
// HELPER - BUILD BADGES HTML
// ============================================

function buildBadgesHTML(project) {
    const badges = [];
    if (project.featured) {
        badges.push(`<span class="project-badge badge-featured">${BADGE_ICONS.featured} Featured</span>`);
    }
    const statusBadge = project.status === 'completed'
        ? `<span class="project-badge badge-completed">${BADGE_ICONS.completed} Completed</span>`
        : `<span class="project-badge badge-in-progress">${BADGE_ICONS.inProgress} In Progress</span>`;
    badges.push(statusBadge);
    return badges.join('');
}

// ============================================
// HELPER - BUILD METRICS STRIP HTML
// ============================================

function buildMetricsHTML(project) {
    const scores = [
        { label: 'Complexity', value: project.complexity_score,       color: '#c084fc' },
        { label: 'Innovation', value: project.innovation_score,       color: '#e8a920' },
        { label: 'Impact',     value: project.business_impact_score,  color: '#34d399' },
    ].filter(s => s.value != null && s.value > 0);

    if (scores.length === 0) return '';

    return `
        <div class="project-metrics">
            ${scores.map(s => `
                <div class="metric-item">
                    <span class="metric-label">${s.label}</span>
                    <div class="metric-track">
                        <div class="metric-fill" style="--metric-val: ${Math.round((s.value / 10) * 100)}%; --metric-color: ${s.color};"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ============================================
// HELPER - BUILD IMAGE HTML
// ============================================

function buildImageHTML(project) {
    const imageUrl = project.thumbnail_url || project.image_url;
    const hasImage = isValidImageUrl(imageUrl);
    const firstLetter = (project.title || 'P').charAt(0).toUpperCase();

    const imageHTML = hasImage ? `
        <img src="${imageUrl}"
             alt="${project.title}"
             class="project-image"
             loading="lazy"
             onerror="this.style.display='none'; this.parentElement.classList.add('no-image')">
    ` : `
        <div class="project-image-placeholder">
            <div class="placeholder-letter">${firstLetter}</div>
        </div>
    `;

    return { hasImage, imageHTML };
}

// ============================================
// CREATE PROJECT CARD
// ============================================

function createProjectCard(project, index = 0) {
    const card = document.createElement('div');
    card.className = `project-card-minimal${project.featured ? ' is-featured' : ''}`;
    card.setAttribute('data-project-id', project.id);
    card.setAttribute('data-project-slug', project.slug || '');
    card.style.setProperty('--i', index);
    card.onclick = () => openProjectModal(project);

    const { hasImage, imageHTML } = buildImageHTML(project);
    const allTechs = project.technologies || [];
    const visibleTechs = allTechs.slice(0, 4);
    const extraCount = allTechs.length - visibleTechs.length;
    const techTags = visibleTechs.map(tech =>
        `<span class="tech-tag-minimal">${tech}</span>`
    ).join('') + (extraCount > 0 ? `<span class="tech-tag-minimal tech-tag-more">+${extraCount}</span>` : '');

    const date = new Date(project.completed_date || project.created_at);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

    const roleText = project.role
        ? `<div class="project-role">${project.role}${project.project_duration ? ' · ' + project.project_duration : ''}</div>`
        : '';

    card.innerHTML = `
        <div class="project-image-wrapper ${!hasImage ? 'no-image' : ''}">
            ${imageHTML}
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
                ${buildBadgesHTML(project)}
            </div>
        </div>

        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            ${roleText}
            <div class="project-techs">${techTags}</div>
            <p class="project-tagline">${project.tagline || project.description || ''}</p>
            ${buildMetricsHTML(project)}
            <div class="project-footer">
                <span class="project-category">${project.category || ''}</span>
                <span class="project-date">${formattedDate}</span>
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
    projects.forEach((project, i) => {
        const card = createProjectCard(project, i);
        grid.appendChild(card);
    });

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

    const projects = await fetchProjects(null); // All published projects

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
    projects.forEach((project, i) => {
        const card = createProjectCard(project, i);
        grid.appendChild(card);
    });

}

// ============================================
// INCREMENT VIEW COUNT
// ============================================

async function incrementProjectViews(projectId) {
    try {
        const { error } = await supabaseClient.rpc('increment_project_details_views', {
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
// INITIALIZE ON PAGE LOAD
// ============================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjects);
} else {
    initProjects();
}

async function initProjects() {

    await renderFeaturedProjects();
    await renderAllProjects();

}

// ============================================
// FILTER FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', () => {
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
});

async function filterProjects(category) {
    const grid = document.getElementById('allProjectsGrid');
    if (!grid) return;

    grid.innerHTML = '<div class="loading-skeleton"><div class="skeleton-card"></div></div>';

    let projects = await fetchProjects(null); // All published projects

    if (category !== 'all') {
        projects = projects.filter(p => p.category === category);
    }

    grid.innerHTML = '';
    projects.forEach((project, i) => {
        const card = createProjectCard(project, i);
        grid.appendChild(card);
    });
}

// ============================================
// EXPORT FUNCTIONS FOR GLOBAL ACCESS
// ============================================

// Called by main.js initializePageData('home')
window.loadFeaturedProjects = renderFeaturedProjects;
// Called by main.js initializePageData('projects') and triggerPageAnimations('projects')
window.initializeProjects = initProjects;
// Called from filter button click handlers
window.filterProjects = filterProjects;
