// ============================================
// PROJECTS - SUPABASE INTEGRATION
// Real-time project management with analytics
// ============================================

let projectsData = []; // Will be populated from Supabase
let realtimeSubscription = null; // Store subscription for cleanup

// ============================================
// FETCH PROJECTS FROM SUPABASE
// ============================================
async function fetchProjects() {
    console.log('🔄 Fetching projects from Supabase...');
    
    try {
        const { data, error } = await supabaseClient
            .from('projects')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('❌ Error fetching projects:', error);
            showProjectsError();
            return [];
        }
        
        console.log(`✅ Fetched ${data.length} projects from Supabase`);
        projectsData = data;
        return data;
        
    } catch (err) {
        console.error('❌ Projects fetch exception:', err);
        showProjectsError();
        return [];
    }
}

// ============================================
// SETUP REAL-TIME SUBSCRIPTION
// ============================================
function setupRealtimeSubscription() {
    console.log('⚡ Setting up real-time subscription for projects...');
    
    // Subscribe to INSERT, UPDATE, DELETE events
    realtimeSubscription = supabaseClient
        .channel('projects-changes')
        .on(
            'postgres_changes',
            {
                event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
                schema: 'public',
                table: 'projects',
                filter: 'published=eq.true' // Only listen to published projects
            },
            (payload) => {
                console.log('⚡ Real-time update received:', payload);
                handleRealtimeUpdate(payload);
            }
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                console.log('✅ Real-time subscription active');
            }
        });
}

// ============================================
// HANDLE REAL-TIME UPDATES
// ============================================
async function handleRealtimeUpdate(payload) {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    switch (eventType) {
        case 'INSERT':
            console.log('➕ New project added:', newRecord);
            projectsData.push(newRecord);
            renderAllProjects(); // Re-render to show new project
            showNotification('New project added!', 'success');
            break;
            
        case 'UPDATE':
            console.log('🔄 Project updated:', newRecord);
            const updateIndex = projectsData.findIndex(p => p.id === newRecord.id);
            if (updateIndex !== -1) {
                projectsData[updateIndex] = newRecord;
                renderAllProjects(); // Re-render with updated data
                showNotification('Project updated!', 'info');
            }
            break;
            
        case 'DELETE':
            console.log('🗑️ Project deleted:', oldRecord);
            projectsData = projectsData.filter(p => p.id !== oldRecord.id);
            renderAllProjects(); // Re-render without deleted project
            showNotification('Project removed!', 'warning');
            break;
    }
    
    updateProjectStats(); // Update statistics
}

// ============================================
// INITIALIZE PROJECTS (Called on page load)
// ============================================
async function initializeProjects() {
    console.log('🚀 Initializing projects module...');
    
    // Check if projects page is active
    const projectsPage = document.getElementById('projects');
    if (!projectsPage || !projectsPage.classList.contains('active')) {
        console.log('⚠️  Projects page not active, skipping render');
        return;
    }
    
    // Fetch projects from Supabase
    await fetchProjects();
    
    // Render projects
    renderAllProjects();
    updateProjectStats();
    
    // Setup real-time subscription
    setupRealtimeSubscription();
    
    console.log('✅ Projects module initialized');
}

// ============================================
// RENDER ALL PROJECTS
// ============================================
function renderAllProjects() {
    console.log('🔄 Rendering all projects...');
    
    const projectsPage = document.getElementById('projects');
    if (!projectsPage || !projectsPage.classList.contains('active')) {
        console.log('⚠️  Projects page not active, cannot render');
        return;
    }
    
    const allProjectsContainer = document.getElementById('allProjectsGrid');
    if (!allProjectsContainer) {
        console.error('❌ allProjectsGrid container not found!');
        return;
    }
    
    renderProjects(projectsData, allProjectsContainer);
    console.log(`✅ Rendered ${projectsData.length} projects`);
}

// ============================================
// RENDER PROJECTS TO CONTAINER
// ============================================
function renderProjects(projects, container) {
    if (!container) {
        console.error('❌ No container provided for rendering projects');
        return;
    }
    
    if (!projects || projects.length === 0) {
        container.innerHTML = `
            <div class="no-projects-message">
                <h3>🚀 No projects yet!</h3>
                <p>Check back soon for exciting new projects.</p>
            </div>
        `;
        return;
    }
    
    console.log(`🔄 Rendering ${projects.length} projects to container`);
    
    // Clear container
    container.innerHTML = '';
    
    // Render projects
    projects.forEach((project, index) => {
        try {
            const projectCard = createProjectCard(project);
            container.appendChild(projectCard);
        } catch (error) {
            console.error(`❌ Error rendering project ${index + 1}:`, error);
        }
    });
    
    console.log(`✅ Projects rendered successfully - ${container.children.length} cards`);
}

// ============================================
// CREATE PROJECT CARD ELEMENT
// ============================================
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-category', project.category);
    card.setAttribute('data-status', project.status);
    card.setAttribute('data-id', project.id);
    
    const statusBadge = project.status === 'completed' ? 
        '<span class="status-badge completed">✅ Completed</span>' : 
        '<span class="status-badge in-progress">🚧 In Progress</span>';
    
    const featuredBadge = project.featured ? 
        '<span class="featured-badge">⭐ Featured</span>' : '';
    
    // Format technologies array
    const techString = Array.isArray(project.technologies) ? 
        project.technologies.join(' • ') : 
        (project.technologies || '');
    
    card.innerHTML = `
        <div class="project-header">
            <div class="project-badges">
                ${statusBadge}
                ${featuredBadge}
            </div>
            <h3>${escapeHtml(project.title)}</h3>
            <p class="project-tech">${escapeHtml(techString)}</p>
        </div>
        <div class="project-content">
            <p class="project-description">${escapeHtml(project.description)}</p>
            <div class="project-meta">
                <span class="project-category">${escapeHtml(project.category)}</span>
                ${project.completed_date ? `<span class="project-date">${formatDate(project.completed_date)}</span>` : ''}
            </div>
            <div class="project-stats-inline">
                <span class="stat-item">👁️ ${project.view_count || 0} views</span>
                <span class="stat-item">🔗 ${project.github_clicks || 0} clicks</span>
            </div>
            <div class="project-links">
                <a href="${project.github_url}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="project-link"
                   onclick="trackProjectClick('${project.id}', 'github'); return true;">
                    <span class="link-icon">🔗</span> GitHub
                </a>
                <a href="${project.demo_url}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="project-link"
                   onclick="trackProjectClick('${project.id}', 'demo'); return true;">
                    <span class="link-icon">📺</span> Demo
                </a>
                <button class="project-link details-btn" 
                        onclick="showProjectDetails('${project.id}')">
                    <span class="link-icon">📖</span> Details
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// ============================================
// UTILITY: ESCAPE HTML (Prevent XSS)
// ============================================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// SETUP PROJECT FILTERS
// ============================================
function setupProjectFilters() {
    console.log('🔄 Setting up project filters...');
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons.length) {
        console.warn('⚠️  No filter buttons found');
        return;
    }
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterProjects(filter);
            
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    console.log(`✅ Set up ${filterButtons.length} filter buttons`);
}

// ============================================
// FILTER PROJECTS
// ============================================
function filterProjects(filter) {
    console.log(`🔄 Filtering projects by: ${filter}`);
    let filteredProjects = projectsData;
    
    if (filter === 'featured') {
        filteredProjects = projectsData.filter(p => p.featured);
    } else if (filter === 'completed') {
        filteredProjects = projectsData.filter(p => p.status === 'completed');
    } else if (filter === 'in-progress') {
        filteredProjects = projectsData.filter(p => p.status === 'in-progress');
    } else if (filter !== 'all') {
        filteredProjects = projectsData.filter(p => p.category === filter);
    }
    
    const allProjectsContainer = document.getElementById('allProjectsGrid');
    if (allProjectsContainer) {
        renderProjects(filteredProjects, allProjectsContainer);
        updateFilteredStats(filteredProjects);
        console.log(`✅ Filtered to ${filteredProjects.length} projects`);
    } else {
        console.error('❌ Could not find allProjectsGrid container for filtering');
    }
}

// ============================================
// UPDATE FILTERED STATS
// ============================================
function updateFilteredStats(projects) {
    const totalElement = document.getElementById('totalProjects');
    const completedElement = document.getElementById('completedProjects');
    const inProgressElement = document.getElementById('inProgressProjects');
    
    if (totalElement) totalElement.textContent = projects.length;
    if (completedElement) completedElement.textContent = projects.filter(p => p.status === 'completed').length;
    if (inProgressElement) inProgressElement.textContent = projects.filter(p => p.status === 'in-progress').length;
}

// ============================================
// UPDATE PROJECT STATISTICS
// ============================================
function updateProjectStats() {
    console.log('🔄 Updating project statistics...');
    const stats = {
        total: projectsData.length,
        completed: projectsData.filter(p => p.status === 'completed').length,
        inProgress: projectsData.filter(p => p.status === 'in-progress').length,
        featured: projectsData.filter(p => p.featured).length
    };
    
    console.log('📊 Project Stats:', stats);
    
    // Update stats display
    updateStatElement('total-projects', stats.total);
    updateStatElement('completed-projects', stats.completed);
    updateStatElement('totalProjects', stats.total);
    updateStatElement('completedProjects', stats.completed);
    updateStatElement('inProgressProjects', stats.inProgress);
    updateStatElement('featured-projects', stats.featured);
    
    console.log('✅ Project statistics updated');
}

// ============================================
// UPDATE STAT ELEMENT
// ============================================
function updateStatElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
        console.log(`📊 Updated ${id}: ${value}`);
    }
}

// ============================================
// FORMAT DATE
// ============================================
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// ============================================
// SHOW PROJECT DETAILS MODAL
// ============================================
async function showProjectDetails(projectId) {
    console.log(`🔄 Showing details for project ${projectId}`);
    
    // Track click
    await trackProjectClick(projectId, 'details');
    
    const project = projectsData.find(p => p.id === projectId);
    if (!project) {
        console.error(`❌ Project with ID ${projectId} not found`);
        return;
    }
    
    // Increment view count in database
    try {
        await supabaseClient
            .from('projects')
            .update({ view_count: supabaseClient.raw('view_count + 1') })
            .eq('id', projectId);
    } catch (err) {
        console.warn('View count update failed:', err);
    }
    
    // Format technologies
    const techString = Array.isArray(project.technologies) ? 
        project.technologies.join(', ') : 
        (project.technologies || '');
    
    // Create modal content
    const modalContent = `
        <div class="project-modal-overlay" onclick="closeProjectModal()">
            <div class="project-modal" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2>${escapeHtml(project.title)}</h2>
                    <button class="modal-close" onclick="closeProjectModal()">×</button>
                </div>
                <div class="modal-content">
                    <div class="project-tech-list">
                        ${project.technologies && project.technologies.map ? 
                            project.technologies.map(tech => `<span class="tech-tag">${escapeHtml(tech)}</span>`).join('') :
                            `<span class="tech-tag">${escapeHtml(techString)}</span>`
                        }
                    </div>
                    <p class="project-full-description">${escapeHtml(project.description)}</p>
                    <div class="project-meta-info">
                        <p><strong>Category:</strong> ${escapeHtml(project.category)}</p>
                        <p><strong>Status:</strong> ${escapeHtml(project.status)}</p>
                        ${project.completed_date ? `<p><strong>Completed:</strong> ${formatDate(project.completed_date)}</p>` : ''}
                        <p><strong>Views:</strong> ${project.view_count || 0}</p>
                    </div>
                    <div class="modal-links">
                        <a href="${project.github_url}" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           class="modal-link"
                           onclick="trackProjectClick('${project.id}', 'github'); return true;">
                            🔗 View on GitHub
                        </a>
                        <a href="${project.demo_url}" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           class="modal-link"
                           onclick="trackProjectClick('${project.id}', 'demo'); return true;">
                            📺 Live Demo
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalContent;
    document.body.appendChild(modalContainer);
    
    console.log(`✅ Project details modal shown for ${project.title}`);
}

// ============================================
// CLOSE PROJECT MODAL
// ============================================
function closeProjectModal() {
    const modal = document.querySelector('.project-modal-overlay');
    if (modal) {
        modal.remove();
        console.log('✅ Project modal closed');
    }
}

// ============================================
// SHOW ERROR MESSAGE
// ============================================
function showProjectsError() {
    const container = document.getElementById('allProjectsGrid');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <h3>⚠️ Unable to load projects</h3>
                <p>Please check your internet connection and try again.</p>
                <button class="cta-button" onclick="initializeProjects()">Retry</button>
            </div>
        `;
    }
}

// ============================================
// SHOW NOTIFICATION
// ============================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: rgba(157, 78, 221, 0.9);
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// CLEANUP ON PAGE UNLOAD
// ============================================
window.addEventListener('beforeunload', () => {
    if (realtimeSubscription) {
        supabaseClient.removeChannel(realtimeSubscription);
        console.log('🔌 Real-time subscription cleaned up');
    }
});

// ============================================
// INITIALIZE ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Projects Supabase module loaded');
    setupProjectFilters();
});

// ============================================
// FETCH AND RENDER FEATURED PROJECTS (Homepage)
// ============================================
async function loadFeaturedProjects() {
    console.log('🌟 Loading featured projects for homepage...');

    try {
        const { data, error } = await supabaseClient
            .from('projects')
            .select('*')
            .eq('published', true)
            .eq('featured', true)  // Only featured projects
            .order('created_at', { ascending: false })
            .limit(3);  // Show max 3 featured projects on homepage

        if (error) {
            console.error('❌ Error loading featured projects:', error);
            showFeaturedProjectsError();
            return;
        }

        console.log(`✅ Loaded ${data.length} featured projects`);
        renderFeaturedProjects(data);

    } catch (err) {
        console.error('❌ Featured projects fetch exception:', err);
        showFeaturedProjectsError();
    }
}

// ============================================
// RENDER FEATURED PROJECTS TO HOMEPAGE
// ============================================
function renderFeaturedProjects(projects) {
    const container = document.getElementById('featuredProjectsGrid');

    if (!container) {
        console.error('❌ featuredProjectsGrid container not found!');
        return;
    }

    if (!projects || projects.length === 0) {
        container.innerHTML = `
            <div class="no-featured-message">
                <p>🚀 No featured projects yet. Check back soon!</p>
            </div>
        `;
        return;
    }

    // Clear container
    container.innerHTML = '';

    // Render each featured project
    projects.forEach(project => {
        try {
            const card = createProjectCard(project);
            card.classList.add('featured-project-card');
            container.appendChild(card);
        } catch (error) {
            console.error(`❌ Error rendering featured project:`, error);
        }
    });

    console.log(`✅ Rendered ${projects.length} featured projects on homepage`);
}

// ============================================
// SHOW FEATURED PROJECTS ERROR
// ============================================
function showFeaturedProjectsError() {
    const container = document.getElementById('featuredProjectsGrid');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <h3>⚠️ Unable to load featured projects</h3>
                <p>Please check your internet connection and try again.</p>
                <button class="cta-button" onclick="loadFeaturedProjects()">Retry</button>
            </div>
        `;
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================
window.initializeProjects = initializeProjects;
window.showProjectDetails = showProjectDetails;
window.closeProjectModal = closeProjectModal;
window.filterProjects = filterProjects;
window.fetchProjects = fetchProjects;
window.loadFeaturedProjects = loadFeaturedProjects;