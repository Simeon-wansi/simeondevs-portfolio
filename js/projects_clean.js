// SimeonDev Portfolio - Project Data & Filtering
// Clean version - resolves loading issues

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
        demoUrl: "https://github.com/SimeonDev/cephalopods-ai-solver",
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
        githubUrl: "https://github.com/Simeon-wansi/Vehicle_maintenance_assistant.git",
        demoUrl: "https://github.com/Simeon-wansi/Vehicle_maintenance_assistant.git",
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

// Initialize projects functionality when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Projects module initializing...');
    setTimeout(initializeProjects, 100);
    setupProjectFilters();
    console.log('✅ Projects module initialized');
});

// Initialize projects display
function initializeProjects() {
    console.log('🔄 Initializing projects display...');
    renderAllProjects();
    updateProjectStats();
    console.log('✅ Projects display initialized');
}

// Render all projects for projects page
function renderAllProjects() {
    console.log('🔄 Rendering all projects...');
    const allProjectsContainer = document.getElementById('allProjectsGrid');
    if (!allProjectsContainer) {
        console.warn('⚠️  allProjectsGrid container not found!');
        return;
    }
    
    renderProjects(projectsData, allProjectsContainer);
    console.log(`✅ Rendered ${projectsData.length} projects`);
}

// Render projects to specified container
function renderProjects(projects, container) {
    if (!container) {
        console.error('❌ No container provided for rendering projects');
        return;
    }
    
    console.log(`🔄 Rendering ${projects.length} projects to container`);
    container.innerHTML = '';
    
    projects.forEach(project => {
        const projectCard = createProjectCard(project);
        container.appendChild(projectCard);
    });
    
    console.log('✅ Projects rendered successfully');
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
                <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="project-link">
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

// Filter projects based on category or status
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

// Update stats for filtered projects
function updateFilteredStats(projects) {
    const totalElement = document.getElementById('totalProjects');
    const completedElement = document.getElementById('completedProjects');
    const inProgressElement = document.getElementById('inProgressProjects');
    
    if (totalElement) totalElement.textContent = projects.length;
    if (completedElement) completedElement.textContent = projects.filter(p => p.status === 'completed').length;
    if (inProgressElement) inProgressElement.textContent = projects.filter(p => p.status === 'in-progress').length;
}

// Update project statistics
function updateProjectStats() {
    console.log('🔄 Updating project statistics...');
    const stats = {
        total: projectsData.length,
        completed: projectsData.filter(p => p.status === 'completed').length,
        inProgress: projectsData.filter(p => p.status === 'in-progress').length,
        featured: projectsData.filter(p => p.featured).length
    };
    
    console.log('📊 Project Stats:', stats);
    
    // Update stats display if elements exist
    updateStatElement('total-projects', stats.total);
    updateStatElement('completed-projects', stats.completed);
    updateStatElement('totalProjects', stats.total);
    updateStatElement('completedProjects', stats.completed);
    updateStatElement('inProgressProjects', stats.inProgress);
    updateStatElement('featured-projects', stats.featured);
    
    console.log('✅ Project statistics updated');
}

// Update stat element
function updateStatElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
        console.log(`📊 Updated ${id}: ${value}`);
    } else {
        console.warn(`⚠️  Element with id '${id}' not found`);
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

// Show project details modal
function showProjectDetails(projectId) {
    console.log(`🔄 Showing details for project ${projectId}`);
    const project = projectsData.find(p => p.id === projectId);
    if (!project) {
        console.error(`❌ Project with ID ${projectId} not found`);
        return;
    }
    
    // Create modal content
    const modalContent = `
        <div class="project-modal-overlay" onclick="closeProjectModal()">
            <div class="project-modal" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2>${project.title}</h2>
                    <button class="modal-close" onclick="closeProjectModal()">×</button>
                </div>
                <div class="modal-content">
                    <div class="project-tech-list">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <p class="project-full-description">${project.description}</p>
                    <div class="project-meta-info">
                        <p><strong>Category:</strong> ${project.category}</p>
                        <p><strong>Status:</strong> ${project.status}</p>
                        ${project.completedDate ? `<p><strong>Completed:</strong> ${formatDate(project.completedDate)}</p>` : ''}
                    </div>
                    <div class="modal-links">
                        <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="modal-link">
                            🔗 View on GitHub
                        </a>
                        <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="modal-link">
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

// Close project modal
function closeProjectModal() {
    const modal = document.querySelector('.project-modal-overlay');
    if (modal) {
        modal.remove();
        console.log('✅ Project modal closed');
    }
}

// Demo message for projects without live demos
function showDemoMessage(projectTitle, githubUrl) {
    alert(`Demo for "${projectTitle}" is not available online. Please check the GitHub repository for setup instructions: ${githubUrl}`);
}

// Add required CSS for projects
const projectStyles = `
    .project-card {
        background: rgba(26, 10, 46, 0.8);
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        border: 1px solid rgba(157, 78, 221, 0.3);
        transition: all 0.3s ease;
    }
    
    .project-card:hover {
        transform: translateY(-5px);
        border-color: rgba(157, 78, 221, 0.6);
        box-shadow: 0 10px 30px rgba(157, 78, 221, 0.2);
    }
    
    .project-header h3 {
        color: #00f5ff;
        margin-bottom: 0.5rem;
    }
    
    .project-tech {
        color: #9d4edd;
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }
    
    .project-badges {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    
    .status-badge, .featured-badge {
        font-size: 0.8rem;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        background: rgba(157, 78, 221, 0.2);
        color: #fff;
    }
    
    .project-meta {
        display: flex;
        justify-content: space-between;
        margin: 1rem 0;
        font-size: 0.9rem;
        color: #ccc;
    }
    
    .project-links {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    
    .project-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: rgba(157, 78, 221, 0.1);
        border: 1px solid rgba(157, 78, 221, 0.3);
        border-radius: 6px;
        color: #00f5ff;
        text-decoration: none;
        font-size: 0.9rem;
        transition: all 0.2s ease;
    }
    
    .project-link:hover {
        background: rgba(157, 78, 221, 0.2);
        border-color: rgba(157, 78, 221, 0.5);
        transform: translateY(-2px);
    }
    
    .project-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 2rem;
        justify-content: center;
    }
    
    .filter-btn {
        padding: 0.5rem 1rem;
        background: rgba(26, 10, 46, 0.8);
        border: 1px solid rgba(157, 78, 221, 0.3);
        border-radius: 6px;
        color: #fff;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .filter-btn:hover, .filter-btn.active {
        background: rgba(157, 78, 221, 0.2);
        border-color: rgba(157, 78, 221, 0.5);
        color: #00f5ff;
    }
    
    .project-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .project-modal {
        background: #1a0a2e;
        border-radius: 12px;
        padding: 2rem;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        border: 1px solid rgba(157, 78, 221, 0.3);
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .modal-close {
        background: none;
        border: none;
        color: #fff;
        font-size: 1.5rem;
        cursor: pointer;
    }
    
    .tech-tag {
        display: inline-block;
        background: rgba(157, 78, 221, 0.2);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        margin: 0.25rem;
        color: #00f5ff;
    }
    
    @media (max-width: 768px) {
        .project-filters {
            justify-content: flex-start;
        }
        
        .project-links {
            flex-direction: column;
        }
        
        .project-modal {
            padding: 1rem;
            width: 95%;
        }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = projectStyles;
document.head.appendChild(styleSheet);

// Export functions for global access
window.showProjectDetails = showProjectDetails;
window.closeProjectModal = closeProjectModal;
window.showDemoMessage = showDemoMessage;
window.initializeProjects = initializeProjects;
window.filterProjects = filterProjects;
window.projectsData = projectsData;

console.log('🚀 Projects module loaded successfully');
