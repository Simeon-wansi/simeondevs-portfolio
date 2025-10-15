// SimeonDev Portfolio - Project Data & Filtering
// Dynamic Project Management & GitHub Integration

// Project data structure
const projectsData = [
    {
        id: 1,
        title: "Cephalopods AI Solver",
        description: "Explores all possible game board states in a simulation-heavy environment and calculates hash values efficiently. Solved a major performance bottleneck using memory-safe Rust to bring runtime below 200ms.",
        technologies: ["Rust", "C++", "Hashing", "Simulation"],
        category: "AI/ML",
        status: "completed",
        githubUrl: "https://github.com/SimeonDev/cephalopods-ai-solver",
        demoUrl: "#",
        imageUrl: "https://via.placeholder.com/400x250/9d4edd/ffffff?text=AI+Solver",
        featured: true,
        completedDate: "2024-12-15"
    },
    {
        id: 2,
        title: "AI-Powered Vehicle Maintenance Assistant",
        description: "Intelligent vehicle maintenance system using LangChain and OpenAI API for predictive maintenance recommendations and automated scheduling.",
        technologies: ["Python", "LangChain", "Streamlit", "OpenAI API"],
        category: "AI/ML",
        status: "completed",
        githubUrl: "https://github.com/SimeonDev/vehicle-maintenance-ai",
        demoUrl: "#",
        imageUrl: "https://via.placeholder.com/400x250/ffd60a/000000?text=Vehicle+AI",
        featured: true,
        completedDate: "2024-11-20"
    },
    {
        id: 3,
        title: "Cybersecurity CTF Platform",
        description: "Interactive cybersecurity challenges platform with real-time scoring, hint system, and progress tracking for penetration testing education.",
        technologies: ["JavaScript", "Node.js", "Docker", "PostgreSQL"],
        category: "Cybersecurity",
        status: "in-progress",
        githubUrl: "https://github.com/SimeonDev/ctf-platform",
        demoUrl: "#",
        imageUrl: "images/project-ctf.jpg",
        featured: false,
        completedDate: null
    },
    {
        id: 4,
        title: "Real-time Code Collaboration Tool",
        description: "WebSocket-based collaborative coding environment with syntax highlighting, real-time cursor tracking, and integrated chat system.",
        technologies: ["React", "WebSocket", "Node.js", "MongoDB"],
        category: "Web Development",
        status: "completed",
        githubUrl: "https://github.com/SimeonDev/code-collab",
        demoUrl: "#",
        imageUrl: "https://via.placeholder.com/400x250/9d4edd/ffffff?text=Code+Collab",
        featured: true,
        completedDate: "2024-10-05"
    },
    {
        id: 5,
        title: "Blockchain Voting System",
        description: "Decentralized voting application using smart contracts for transparent and secure election processes with real-time result tracking.",
        technologies: ["Solidity", "Web3.js", "React", "IPFS"],
        category: "Blockchain",
        status: "completed",
        githubUrl: "https://github.com/SimeonDev/blockchain-voting",
        demoUrl: "#",
        imageUrl: "images/project-blockchain.jpg",
        featured: false,
        completedDate: "2024-09-12"
    },
    {
        id: 6,
        title: "Machine Learning Stock Predictor",
        description: "Advanced ML model using LSTM networks and technical indicators for stock price prediction with 85% accuracy rate.",
        technologies: ["Python", "TensorFlow", "Pandas", "NumPy"],
        category: "AI/ML",
        status: "completed",
        githubUrl: "https://github.com/SimeonDev/ml-stock-predictor",
        demoUrl: "#",
        imageUrl: "https://via.placeholder.com/400x250/ffd60a/000000?text=Stock+ML",
        featured: true,
        completedDate: "2024-08-30"
    },
    {
        id: 7,
        title: "Network Security Scanner",
        description: "Comprehensive network vulnerability assessment tool with automated scanning and detailed reporting capabilities.",
        technologies: ["Python", "Nmap", "Scapy", "Flask"],
        category: "Cybersecurity",
        status: "completed",
        githubUrl: "https://github.com/SimeonDev/network-security-scanner",
        demoUrl: "#",
        imageUrl: "images/project-security.jpg",
        featured: false,
        completedDate: "2024-07-15"
    },
    {
        id: 8,
        title: "Smart Home IoT Hub",
        description: "Centralized IoT device management system with real-time monitoring and automated control features.",
        technologies: ["Node.js", "MQTT", "React", "PostgreSQL"],
        category: "Web Development",
        status: "in-progress",
        githubUrl: "https://github.com/SimeonDev/smart-home-hub",
        demoUrl: "#",
        imageUrl: "images/project-iot.jpg",
        featured: false,
        completedDate: null
    }
];

// Initialize projects functionality
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeProjects, 100); // Small delay to ensure DOM is ready
    setupProjectFilters();
    setupProjectModals();
    initializeGitHubIntegration();
});

// Also try to initialize immediately when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initializeProjects, 100);
    });
} else {
    // DOM is already loaded
    setTimeout(initializeProjects, 100);
}

// Initialize projects display
function initializeProjects() {
    // renderFeaturedProjects(); // Disabled to keep static content on home page
    renderAllProjects();
    updateProjectStats();
}

// Render featured projects for home page (only 3 completed featured projects)
function renderFeaturedProjects() {
    const featuredContainer = document.getElementById('featuredProjectsGrid');
    if (!featuredContainer) {
        console.log('Featured container not found!');
        return;
    }
    
    // Store the original static content as backup
    const originalContent = featuredContainer.innerHTML;
    
    const featuredProjects = projectsData
        .filter(project => project.featured && project.status === 'completed')
        .slice(0, 3); // Limit to 3 projects
    
    console.log('Featured projects found:', featuredProjects.length);
    
    // Only clear content if we have projects to render
    if (featuredProjects.length > 0) {
        try {
            featuredContainer.innerHTML = '';
            
            featuredProjects.forEach(project => {
                const projectCard = createProjectCard(project);
                featuredContainer.appendChild(projectCard);
            });
            console.log('Featured projects rendered successfully');
        } catch (error) {
            console.error('Error rendering featured projects:', error);
            // Restore original content if there's an error
            featuredContainer.innerHTML = originalContent;
        }
    } else {
        console.log('No featured projects found, keeping static content');
    }
}

// Render all projects for projects page
function renderAllProjects() {
    const allProjectsContainer = document.getElementById('allProjectsGrid');
    if (!allProjectsContainer) return;
    
    renderProjects(projectsData, allProjectsContainer);
}

// Render projects to specified container
function renderProjects(projects, container = null) {
    const projectsContainer = container || document.getElementById('allProjectsGrid');
    if (!projectsContainer) return;
    
    projectsContainer.innerHTML = '';
    
    projects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsContainer.appendChild(projectCard);
    });
}

// Create project card element
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
    
    card.innerHTML = `
        <div class="project-header">
            <div class="project-badges">
                ${statusBadge}
                ${featuredBadge}
            </div>
            <h3>${project.title}</h3>
            <p class="project-tech">${project.technologies.join(' • ')}</p>
        </div>
        <div class="project-content">
            <p class="project-description">${project.description}</p>
            <div class="project-meta">
                <span class="project-category">${project.category}</span>
                ${project.completedDate ? `<span class="project-date">${formatDate(project.completedDate)}</span>` : ''}
            </div>
            <div class="project-links">
                <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link">
                    <span class="link-icon">🔗</span> GitHub
                </a>
                <a href="${project.demoUrl}" class="project-link">
                    <span class="link-icon">📺</span> Demo
                </a>
                <button class="project-link details-btn" onclick="showProjectDetails(${project.id})">
                    <span class="link-icon">📖</span> Details
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Setup project filters
function setupProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons.length) return;
    
    // Add filter event listeners
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterProjects(filter);
            
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Filter projects based on category or status
function filterProjects(filter) {
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
    renderProjects(filteredProjects, allProjectsContainer);
    animateFilteredProjects();
    updateFilteredStats(filteredProjects);
}

// Update stats for filtered projects
function updateFilteredStats(projects) {
    const totalElement = document.getElementById('totalProjects');
    const completedElement = document.getElementById('completedProjects');
    const inProgressElement = document.getElementById('inProgressProjects');
    
    if (totalElement) totalElement.textContent = projects.length;
    if (completedElement) completedElement.textContent = projects.filter(p => p.status === 'completed').length;
    if (inProgressElement) inProgressElement.textContent = projects.filter(p => p.status === 'in-progress').length;
}

// Animate filtered projects
function animateFilteredProjects() {
    const cards = document.querySelectorAll('#allProjectsGrid .project-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Setup project modals
function setupProjectModals() {
    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'project-modal';
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeProjectModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeProjectModal()">×</button>
            <div class="modal-body">
                <!-- Project details will be inserted here -->
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Show project details
function showProjectDetails(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;
    
    const modal = document.getElementById('project-modal');
    const modalBody = modal.querySelector('.modal-body');
    
    modalBody.innerHTML = `
        <div class="project-detail-header">
            <h2>${project.title}</h2>
            <div class="project-badges">
                ${project.status === 'completed' ? 
                    '<span class="status-badge completed">✅ Completed</span>' : 
                    '<span class="status-badge in-progress">🚧 In Progress</span>'
                }
                ${project.featured ? '<span class="featured-badge">⭐ Featured</span>' : ''}
            </div>
        </div>
        
        <div class="project-detail-content">
            <div class="project-info">
                <h3>📋 Overview</h3>
                <p>${project.description}</p>
                
                <h3>🛠️ Technologies</h3>
                <div class="tech-tags">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                
                <h3>📂 Category</h3>
                <p>${project.category}</p>
                
                ${project.completedDate ? `
                    <h3>📅 Completed</h3>
                    <p>${formatDate(project.completedDate)}</p>
                ` : ''}
            </div>
            
            <div class="project-actions">
                <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="modal-link">
                    <span class="link-icon">🔗</span> View on GitHub
                </a>
                <a href="${project.demoUrl}" class="modal-link">
                    <span class="link-icon">📺</span> Live Demo
                </a>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Show demo message when demo is not available
function showDemoMessage(projectTitle, githubUrl) {
    const message = `🚀 ${projectTitle} Demo\n\nThis project demo is currently being prepared. You can explore the source code on GitHub in the meantime!\n\nWould you like to visit the GitHub repository?`;
    
    if (confirm(message)) {
        // Open GitHub repository in new tab
        window.open(githubUrl, '_blank', 'noopener,noreferrer');
    }
}

// Close project modal
function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Initialize GitHub integration
function initializeGitHubIntegration() {
    // This would integrate with GitHub API to fetch real project data
    console.log('🐙 GitHub integration initialized');
    
    // Uncomment to enable real GitHub integration:
    // fetchGitHubProjects();
}

// Fetch projects from GitHub API
async function fetchGitHubProjects() {
    try {
        const response = await fetch('https://api.github.com/users/SimeonDev/repos?sort=updated&per_page=10');
        const repos = await response.json();
        
        // Process and merge with existing project data
        const githubProjects = repos.map(repo => ({
            id: `gh-${repo.id}`,
            title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: repo.description || 'No description available',
            technologies: repo.language ? [repo.language] : [],
            category: detectCategory(repo.name, repo.description),
            status: 'completed',
            githubUrl: repo.html_url,
            demoUrl: repo.homepage || '#',
            featured: repo.stargazers_count > 5,
            completedDate: repo.updated_at
        }));
        
        // Update projects display
        renderProjects([...projectsData, ...githubProjects]);
        
    } catch (error) {
        console.error('Failed to fetch GitHub projects:', error);
    }
}

// Detect project category from repository data
function detectCategory(name, description) {
    const keywords = {
        'AI/ML': ['ai', 'ml', 'machine', 'learning', 'neural', 'model', 'prediction'],
        'Cybersecurity': ['security', 'ctf', 'hack', 'crypto', 'pentest', 'vuln'],
        'Web Development': ['web', 'react', 'vue', 'angular', 'frontend', 'backend'],
        'Blockchain': ['blockchain', 'crypto', 'smart', 'contract', 'web3', 'defi']
    };
    
    const text = `${name} ${description}`.toLowerCase();
    
    for (const [category, words] of Object.entries(keywords)) {
        if (words.some(word => text.includes(word))) {
            return category;
        }
    }
    
    return 'Other';
}

// Update project statistics
function updateProjectStats() {
    const stats = {
        total: projectsData.length,
        completed: projectsData.filter(p => p.status === 'completed').length,
        inProgress: projectsData.filter(p => p.status === 'in-progress').length,
        featured: projectsData.filter(p => p.featured).length,
        categories: [...new Set(projectsData.map(p => p.category))].length
    };
    
    // Update stats display if elements exist
    updateStatElement('total-projects', stats.total);
    updateStatElement('completed-projects', stats.completed);
    updateStatElement('totalProjects', stats.total);
    updateStatElement('completedProjects', stats.completed);
    updateStatElement('inProgressProjects', stats.inProgress);
    updateStatElement('featured-projects', stats.featured);
}

// Update stat element
function updateStatElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Add required CSS for projects
const projectStyle = document.createElement('style');
projectStyle.textContent = `
    .project-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 2rem;
        justify-content: center;
    }
    
    .filter-btn {
        background: rgba(26, 10, 46, 0.5);
        color: #ffffff;
        border: 1px solid rgba(157, 78, 221, 0.3);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
    }
    
    .filter-btn:hover,
    .filter-btn.active {
        background: linear-gradient(45deg, #9d4edd, #ffd60a);
        color: #000;
        transform: translateY(-2px);
    }
    
    .project-badges {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
    }
    
    .status-badge,
    .featured-badge {
        font-size: 0.8rem;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-weight: 500;
    }
    
    .status-badge.completed {
        background: rgba(0, 255, 65, 0.2);
        color: #00ff41;
        border: 1px solid rgba(0, 255, 65, 0.3);
    }
    
    .status-badge.in-progress {
        background: rgba(255, 214, 10, 0.2);
        color: #ffd60a;
        border: 1px solid rgba(255, 214, 10, 0.3);
    }
    
    .featured-badge {
        background: rgba(157, 78, 221, 0.2);
        color: #9d4edd;
        border: 1px solid rgba(157, 78, 221, 0.3);
    }
    
    .project-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 1rem 0;
        font-size: 0.9rem;
    }
    
    .project-category {
        background: rgba(0, 245, 255, 0.2);
        color: #00f5ff;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.8rem;
    }
    
    .project-date {
        color: #cccccc;
        font-size: 0.8rem;
    }
    
    .project-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2000;
        display: none;
        align-items: center;
        justify-content: center;
    }
    
    .project-modal.active {
        display: flex;
    }
    
    .modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
    }
    
    .modal-content {
        position: relative;
        background: rgba(26, 10, 46, 0.95);
        border: 1px solid rgba(157, 78, 221, 0.3);
        border-radius: 15px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        animation: modalSlideIn 0.3s ease-out;
    }
    
    @keyframes modalSlideIn {
        from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        color: #ffffff;
        font-size: 1.5rem;
        cursor: pointer;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }
    
    .modal-close:hover {
        background: rgba(255, 0, 110, 0.2);
        color: #ff006e;
    }
    
    .modal-body {
        padding: 2rem;
    }
    
    .project-detail-header h2 {
        color: #ffd60a;
        margin-bottom: 1rem;
    }
    
    .project-detail-content h3 {
        color: #9d4edd;
        margin: 1.5rem 0 0.5rem 0;
    }
    
    .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin: 0.5rem 0;
    }
    
    .tech-tag {
        background: rgba(255, 214, 10, 0.2);
        color: #ffd60a;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.8rem;
        border: 1px solid rgba(255, 214, 10, 0.3);
    }
    
    .project-actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }
    
    .modal-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: linear-gradient(45deg, #9d4edd, #ffd60a);
        color: #000;
        text-decoration: none;
        border-radius: 25px;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    
    .modal-link:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(157, 78, 221, 0.3);
    }
    
    .link-icon {
        font-size: 1rem;
    }
    
    .details-btn {
        background: rgba(0, 245, 255, 0.2) !important;
        color: #00f5ff !important;
        border: 1px solid rgba(0, 245, 255, 0.3) !important;
    }
    
    .details-btn:hover {
        background: rgba(0, 245, 255, 0.3) !important;
        transform: translateY(-2px) !important;
    }
    
    /* Override all project-link buttons to match Details button style */
    .project-link {
        background: rgba(0, 245, 255, 0.2) !important;
        color: #00f5ff !important;
        border: 1px solid rgba(0, 245, 255, 0.3) !important;
        padding: 0.5rem 1rem;
        text-decoration: none;
        border-radius: 20px;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .project-link:hover {
        background: rgba(0, 245, 255, 0.3) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 12px rgba(0, 245, 255, 0.3) !important;
    }
`;
document.head.appendChild(projectStyle);

// Initialize GitHub integration
function initializeGitHubIntegration() {
    // This would integrate with GitHub API to fetch real project data
    console.log('🐙 GitHub integration initialized');
    
    // Uncomment to enable real GitHub integration:
    // fetchGitHubProjects();
}

// Fetch projects from GitHub API
async function fetchGitHubProjects() {
    try {
        const response = await fetch('https://api.github.com/users/SimeonDev/repos?sort=updated&per_page=10');
        const repos = await response.json();
        
        // Process and merge with existing project data
        const githubProjects = repos.map(repo => ({
            id: `gh-${repo.id}`,
            title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: repo.description || 'No description available',
            technologies: repo.language ? [repo.language] : [],
            category: detectCategory(repo.name, repo.description),
            status: 'completed',
            githubUrl: repo.html_url,
            demoUrl: repo.homepage || '#',
            featured: repo.stargazers_count > 5,
            completedDate: repo.updated_at
        }));
        
        // Update projects display
        renderProjects([...projectsData, ...githubProjects]);
        
    } catch (error) {
        console.error('Failed to fetch GitHub projects:', error);
    }
}

// Detect project category from repository data
function detectCategory(name, description) {
    const keywords = {
        'AI/ML': ['ai', 'ml', 'machine', 'learning', 'neural', 'model', 'prediction'],
        'Cybersecurity': ['security', 'ctf', 'hack', 'crypto', 'pentest', 'vuln'],
        'Web Development': ['web', 'react', 'vue', 'angular', 'frontend', 'backend'],
        'Blockchain': ['blockchain', 'crypto', 'smart', 'contract', 'web3', 'defi']
    };
    
    const text = `${name} ${description}`.toLowerCase();
    
    for (const [category, words] of Object.entries(keywords)) {
        if (words.some(word => text.includes(word))) {
            return category;
        }
    }
    
    return 'Other';
}

// Update project statistics
function updateProjectStats() {
    const stats = {
        total: projectsData.length,
        completed: projectsData.filter(p => p.status === 'completed').length,
        inProgress: projectsData.filter(p => p.status === 'in-progress').length,
        featured: projectsData.filter(p => p.featured).length,
        categories: [...new Set(projectsData.map(p => p.category))].length
    };
    
    // Update stats display if elements exist
    updateStatElement('total-projects', stats.total);
    updateStatElement('completed-projects', stats.completed);
    updateStatElement('totalProjects', stats.total);
    updateStatElement('completedProjects', stats.completed);
    updateStatElement('inProgressProjects', stats.inProgress);
    updateStatElement('featured-projects', stats.featured);
}

// Update stat element
function updateStatElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Add required CSS for projects
const projectStyle = document.createElement('style');
projectStyle.textContent = `
    .project-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 2rem;
        justify-content: center;
    }
    
    .filter-btn {
        background: rgba(26, 10, 46, 0.5);
        color: #ffffff;
        border: 1px solid rgba(157, 78, 221, 0.3);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
    }
    
    .filter-btn:hover,
    .filter-btn.active {
        background: linear-gradient(45deg, #9d4edd, #ffd60a);
        color: #000;
        transform: translateY(-2px);
    }
    
    .project-badges {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
    }
    
    .status-badge,
    .featured-badge {
        font-size: 0.8rem;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-weight: 500;
    }
    
    .status-badge.completed {
        background: rgba(0, 255, 65, 0.2);
        color: #00ff41;
        border: 1px solid rgba(0, 255, 65, 0.3);
    }
    
    .status-badge.in-progress {
        background: rgba(255, 214, 10, 0.2);
        color: #ffd60a;
        border: 1px solid rgba(255, 214, 10, 0.3);
    }
    
    .featured-badge {
        background: rgba(157, 78, 221, 0.2);
        color: #9d4edd;
        border: 1px solid rgba(157, 78, 221, 0.3);
    }
    
    .project-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 1rem 0;
        font-size: 0.9rem;
    }
    
    .project-category {
        background: rgba(0, 245, 255, 0.2);
        color: #00f5ff;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.8rem;
    }
    
    .project-date {
        color: #cccccc;
        font-size: 0.8rem;
    }
    
    .project-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2000;
        display: none;
        align-items: center;
        justify-content: center;
    }
    
    .project-modal.active {
        display: flex;
    }
    
    .modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
    }
    
    .modal-content {
        position: relative;
        background: rgba(26, 10, 46, 0.95);
        border: 1px solid rgba(157, 78, 221, 0.3);
        border-radius: 15px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        animation: modalSlideIn 0.3s ease-out;
    }
    
    @keyframes modalSlideIn {
        from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        color: #ffffff;
        font-size: 1.5rem;
        cursor: pointer;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }
    
    .modal-close:hover {
        background: rgba(255, 0, 110, 0.2);
        color: #ff006e;
    }
    
    .modal-body {
        padding: 2rem;
    }
    
    .project-detail-header h2 {
        color: #ffd60a;
        margin-bottom: 1rem;
    }
    
    .project-detail-content h3 {
        color: #9d4edd;
        margin: 1.5rem 0 0.5rem 0;
    }
    
    .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin: 0.5rem 0;
    }
    
    .tech-tag {
        background: rgba(255, 214, 10, 0.2);
        color: #ffd60a;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.8rem;
        border: 1px solid rgba(255, 214, 10, 0.3);
    }
    
    .project-actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }
    
    .modal-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: linear-gradient(45deg, #9d4edd, #ffd60a);
        color: #000;
        text-decoration: none;
        border-radius: 25px;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    
    .modal-link:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(157, 78, 221, 0.3);
    }
    
    .link-icon {
        font-size: 1rem;
    }
    
    .details-btn {
        background: rgba(0, 245, 255, 0.2) !important;
        color: #00f5ff !important;
        border: 1px solid rgba(0, 245, 255, 0.3) !important;
    }
    
    .details-btn:hover {
        background: rgba(0, 245, 255, 0.3) !important;
        transform: translateY(-2px) !important;
    }
    
    /* Override all project-link buttons to match Details button style */
    .project-link {
        background: rgba(0, 245, 255, 0.2) !important;
        color: #00f5ff !important;
        border: 1px solid rgba(0, 245, 255, 0.3) !important;
        padding: 0.5rem 1rem;
        text-decoration: none;
        border-radius: 20px;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .project-link:hover {
        background: rgba(0, 245, 255, 0.3) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 12px rgba(0, 245, 255, 0.3) !important;
    }
`;
document.head.appendChild(projectStyle);

// Export functions for global use
window.showProjectDetails = showProjectDetails;
window.closeProjectModal = closeProjectModal;
window.showDemoMessage = showDemoMessage;
window.initializeProjects = initializeProjects;
window.SimeonDevProjects = {
    filterProjects,
    showProjectDetails,
    closeProjectModal,
    showDemoMessage,
    renderProjects,
    projectsData,
    initializeProjects
};
