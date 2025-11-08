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

    // Handle missing images with gradient fallback
    const imageUrl = project.thumbnail_url || project.image_url;
    const hasImage = isValidImageUrl(imageUrl);

    // Create image HTML or gradient fallback
    const imageHTML = hasImage ? `
        <img src="${imageUrl}" 
             alt="${project.title}" 
             class="project-image"
             loading="lazy"
             onerror="this.style.display='none'; this.parentElement.classList.add('no-image')">
    ` : `
        <div class="project-image-placeholder">
            <div class="placeholder-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                </svg>
            </div>
            <div class="placeholder-text">${project.title}</div>
        </div>
    `;

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
// TRACK LINK CLICKS
// ============================================

async function trackProjectClick(projectId, clickType) {
    try {
        const field = `${clickType}_clicks`; // github_clicks, demo_clicks, blog_clicks

        const { error } = await supabaseClient.rpc('increment_project_clicks', {
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

// ============================================
// EXPORT FUNCTIONS FOR GLOBAL ACCESS
// ============================================

window.fetchProjects = fetchProjects;
window.renderFeaturedProjects = renderFeaturedProjects;
window.renderAllProjects = renderAllProjects;
window.filterProjects = filterProjects;
