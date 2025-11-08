// SimeonDev Portfolio - Blog System
// Blog Data & Detail View Management

// Blog posts data structure
const blogPosts = [
    {
        id: 1,
        title: "Optimizing Rust Performance for Game AI",
        excerpt: "Deep dive into memory-safe optimization techniques that reduced our AI solver runtime by 95%...",
        date: "December 20, 2024",
        readTime: "8 min read",
        category: "AI/ML",
        tags: ["Rust", "AI", "Optimization", "Performance"],
        author: "SimeonDev",
        content: `
            <h2>The Challenge: Performance Bottlenecks in AI Game Solvers</h2>
            <p>When building the Cephalopods AI Solver, we faced a critical performance bottleneck. Our initial implementation in Python was taking over 4 seconds to analyze complex game states, making it unusable for real-time applications.</p>
            
            <h2>Why Rust? Memory Safety Meets Performance</h2>
            <p>Rust's ownership system provides memory safety without garbage collection overhead, making it ideal for performance-critical applications. Here's how we approached the optimization:</p>
            
            <h3>1. Memory Layout Optimization</h3>
            <pre><code>// Before: Using Vec&lt;Box&lt;GameState&gt;&gt;
let states: Vec&lt;Box&lt;GameState&gt;&gt; = vec![];

// After: Using arena allocation
struct GameArena {
    states: Vec&lt;GameState&gt;,
    indices: Vec&lt;usize&gt;,
}

impl GameArena {
    fn allocate_state(&mut self, state: GameState) -> usize {
        let index = self.states.len();
        self.states.push(state);
        self.indices.push(index);
        index
    }
}</code></pre>
            
            <h3>2. Hash Function Optimization</h3>
            <p>We implemented a custom hash function using FNV-1a algorithm, optimized for our game state structure:</p>
            <pre><code>use std::hash::{Hash, Hasher};

impl Hash for GameState {
    fn hash&lt;H: Hasher&gt;(&self, state: &mut H) {
        // Custom hashing optimized for our data structure
        for &piece in self.board.iter() {
            piece.hash(state);
        }
        self.current_player.hash(state);
    }
}</code></pre>
            
            <h3>3. Parallel Processing with Rayon</h3>
            <p>Leveraging Rust's rayon crate for data parallelism:</p>
            <pre><code>use rayon::prelude::*;

fn analyze_states_parallel(states: &[GameState]) -> Vec&lt;AnalysisResult&gt; {
    states.par_iter()
        .map(|state| analyze_single_state(state))
        .collect()
}</code></pre>
            
            <h2>Results: From 4 Seconds to 200ms</h2>
            <p>Our optimizations resulted in a 95% performance improvement:</p>
            <ul>
                <li><strong>Memory usage</strong>: Reduced by 60% through arena allocation</li>
                <li><strong>CPU utilization</strong>: Improved by 80% with parallel processing</li>
                <li><strong>Cache efficiency</strong>: 40% improvement in cache hit rates</li>
                <li><strong>Overall runtime</strong>: From 4000ms to 200ms average</li>
            </ul>
            
            <h2>Key Takeaways</h2>
            <p>Memory-safe doesn't mean slow. Rust's zero-cost abstractions and ownership system enable both safety and performance. Key strategies that worked:</p>
            <ol>
                <li>Profile first, optimize based on data</li>
                <li>Use arena allocation for frequent allocations</li>
                <li>Leverage Rust's trait system for custom optimizations</li>
                <li>Parallelize where possible with rayon</li>
            </ol>
            
            <p>The full source code is available on <a href="https://github.com/SimeonDev/cephalopods-ai-solver" target="_blank">GitHub</a>.</p>
        `,
        featured: true,
        published: true
    },
    {
        id: 2,
        title: "Building Secure AI Applications",
        excerpt: "Security considerations when integrating AI models into production applications...",
        date: "November 15, 2024",
        readTime: "6 min read",
        category: "Cybersecurity",
        tags: ["AI", "Security", "Production", "Best Practices"],
        author: "SimeonDev",
        content: `
            <h2>The Security Challenge in AI Applications</h2>
            <p>As AI models become more prevalent in production systems, securing these applications becomes increasingly critical. Traditional security practices often fall short when dealing with AI-specific vulnerabilities.</p>
            
            <h2>Common AI Security Vulnerabilities</h2>
            
            <h3>1. Model Poisoning Attacks</h3>
            <p>Attackers can manipulate training data to introduce backdoors or bias into AI models:</p>
            <pre><code># Example: Detecting potential data poisoning
def detect_data_anomalies(training_data):
    # Statistical analysis for outliers
    z_scores = np.abs(stats.zscore(training_data))
    outliers = np.where(z_scores > 3)
    
    # Log suspicious patterns
    if len(outliers[0]) > threshold:
        log_security_event("Potential data poisoning detected")
        return False
    return True</code></pre>
            
            <h3>2. Adversarial Attacks</h3>
            <p>Small perturbations to input data can cause models to misclassify:</p>
            <pre><code># Adversarial input detection
def detect_adversarial_input(input_data, model, threshold=0.1):
    # Generate slight variations
    variations = [add_noise(input_data, epsilon) for epsilon in [0.01, 0.05, 0.1]]
    
    # Check prediction consistency
    base_prediction = model.predict(input_data)
    var_predictions = [model.predict(var) for var in variations]
    
    # Flag if predictions are inconsistent
    inconsistency = max([abs(pred - base_prediction) for pred in var_predictions])
    return inconsistency > threshold</code></pre>
            
            <h3>3. Model Extraction Attacks</h3>
            <p>Attackers can reverse-engineer models through API queries:</p>
            <pre><code># Rate limiting and query monitoring
from collections import defaultdict
import time

class APISecurityMonitor:
    def __init__(self):
        self.query_counts = defaultdict(list)
        self.rate_limit = 100  # queries per hour
    
    def check_rate_limit(self, user_id):
        now = time.time()
        hour_ago = now - 3600
        
        # Clean old queries
        self.query_counts[user_id] = [
            t for t in self.query_counts[user_id] if t > hour_ago
        ]
        
        # Check if limit exceeded
        if len(self.query_counts[user_id]) >= self.rate_limit:
            return False
        
        self.query_counts[user_id].append(now)
        return True</code></pre>
            
            <h2>Best Practices for Secure AI Applications</h2>
            
            <h3>1. Input Validation and Sanitization</h3>
            <ul>
                <li>Validate all inputs against expected schemas</li>
                <li>Implement robust data preprocessing pipelines</li>
                <li>Use anomaly detection to flag suspicious inputs</li>
            </ul>
            
            <h3>2. Model Access Controls</h3>
            <pre><code># Example: Implementing model access controls
class SecureModelWrapper:
    def __init__(self, model, access_policy):
        self.model = model
        self.access_policy = access_policy
    
    def predict(self, input_data, user_context):
        # Validate user permissions
        if not self.access_policy.can_access(user_context):
            raise PermissionError("Insufficient privileges")
        
        # Validate input
        if not self.validate_input(input_data):
            raise ValueError("Invalid input detected")
        
        # Execute prediction with monitoring
        return self.monitored_predict(input_data, user_context)</code></pre>
            
            <h3>3. Model Versioning and Rollback</h3>
            <p>Implement version control for models to enable quick rollback:</p>
            <pre><code># Model versioning system
class ModelVersionManager:
    def __init__(self):
        self.versions = {}
        self.current_version = None
    
    def deploy_model(self, model, version_id):
        self.versions[version_id] = {
            'model': model,
            'deployed_at': time.time(),
            'performance_metrics': {}
        }
        self.current_version = version_id
    
    def rollback_to_version(self, version_id):
        if version_id in self.versions:
            self.current_version = version_id
            return self.versions[version_id]['model']
        raise ValueError(f"Version {version_id} not found")</code></pre>
            
            <h2>Monitoring and Incident Response</h2>
            <p>Implement comprehensive monitoring for AI applications:</p>
            <ul>
                <li>Real-time performance monitoring</li>
                <li>Anomaly detection in predictions</li>
                <li>Security event logging and alerting</li>
                <li>Automated incident response procedures</li>
            </ul>
            
            <h2>Conclusion</h2>
            <p>Securing AI applications requires a multi-layered approach combining traditional security practices with AI-specific considerations. Regular security audits, continuous monitoring, and staying updated with emerging threats are essential for maintaining secure AI systems.</p>
        `,
        featured: true,
        published: true
    },
    {
        id: 3,
        title: "Blockchain in Cybersecurity",
        excerpt: "Exploring how blockchain technology can enhance cybersecurity frameworks...",
        date: "October 30, 2024",
        readTime: "7 min read",
        category: "Blockchain",
        tags: ["Blockchain", "Cybersecurity", "Decentralization", "Security"],
        author: "SimeonDev",
        content: `
            <h2>The Intersection of Blockchain and Cybersecurity</h2>
            <p>Blockchain technology offers unique properties that can significantly enhance cybersecurity frameworks. Its immutable ledger, decentralized nature, and cryptographic foundations provide new approaches to solving traditional security challenges.</p>
            
            <h2>Key Blockchain Properties for Security</h2>
            
            <h3>1. Immutability</h3>
            <p>Once data is recorded on a blockchain, it becomes extremely difficult to alter, providing an auditable trail of all activities:</p>
            <pre><code>// Example: Immutable audit logging
contract AuditLog {
    struct LogEntry {
        uint256 timestamp;
        address user;
        string action;
        bytes32 dataHash;
        uint256 blockNumber;
    }
    
    LogEntry[] public auditTrail;
    
    function logAction(string memory action, bytes32 dataHash) public {
        auditTrail.push(LogEntry({
            timestamp: block.timestamp,
            user: msg.sender,
            action: action,
            dataHash: dataHash,
            blockNumber: block.number
        }));
    }
    
    function verifyEntry(uint256 index) public view returns (bool) {
        require(index < auditTrail.length, "Invalid index");
        LogEntry memory entry = auditTrail[index];
        return entry.blockNumber <= block.number;
    }
}</code></pre>
            
            <h3>2. Decentralization</h3>
            <p>Eliminates single points of failure and reduces the risk of centralized attacks:</p>
            <pre><code>// Decentralized identity verification
contract DecentralizedIdentity {
    mapping(address => bool) public verifiedIdentities;
    mapping(address => uint256) public reputationScores;
    
    uint256 public constant REQUIRED_CONFIRMATIONS = 3;
    
    struct IdentityVerification {
        address candidate;
        uint256 confirmations;
        mapping(address => bool) hasConfirmed;
    }
    
    mapping(bytes32 => IdentityVerification) public verifications;
    
    function initiateVerification(address candidate) public {
        bytes32 verificationId = keccak256(abi.encodePacked(candidate, block.timestamp));
        verifications[verificationId].candidate = candidate;
    }
    
    function confirmIdentity(bytes32 verificationId) public {
        require(verifiedIdentities[msg.sender], "Only verified users can confirm");
        require(!verifications[verificationId].hasConfirmed[msg.sender], "Already confirmed");
        
        verifications[verificationId].hasConfirmed[msg.sender] = true;
        verifications[verificationId].confirmations++;
        
        if (verifications[verificationId].confirmations >= REQUIRED_CONFIRMATIONS) {
            verifiedIdentities[verifications[verificationId].candidate] = true;
        }
    }
}</code></pre>
            
            <h2>Blockchain Applications in Cybersecurity</h2>
            
            <h3>1. Secure Digital Identity Management</h3>
            <p>Blockchain can provide self-sovereign identity solutions:</p>
            <ul>
                <li>Users control their own identity data</li>
                <li>Reduced risk of identity theft</li>
                <li>Cryptographic proof of identity without revealing sensitive information</li>
            </ul>
            
            <h3>2. Supply Chain Security</h3>
            <p>Track and verify the integrity of software and hardware components:</p>
            <pre><code>// Supply chain verification
contract SupplyChainSecurity {
    struct Component {
        bytes32 id;
        string name;
        address manufacturer;
        bytes32 checksumHash;
        uint256 timestamp;
        bool isVerified;
    }
    
    mapping(bytes32 => Component) public components;
    mapping(address => bool) public trustedManufacturers;
    
    function addComponent(
        bytes32 id,
        string memory name,
        bytes32 checksumHash
    ) public {
        require(trustedManufacturers[msg.sender], "Untrusted manufacturer");
        
        components[id] = Component({
            id: id,
            name: name,
            manufacturer: msg.sender,
            checksumHash: checksumHash,
            timestamp: block.timestamp,
            isVerified: true
        });
    }
    
    function verifyComponent(bytes32 id, bytes32 providedHash) public view returns (bool) {
        return components[id].isVerified && components[id].checksumHash == providedHash;
    }
}</code></pre>
            
            <h3>3. Decentralized Access Control</h3>
            <p>Implement distributed access control systems:</p>
            <pre><code>// Multi-signature access control
contract MultiSigAccessControl {
    mapping(address => bool) public authorizedUsers;
    mapping(bytes32 => uint256) public approvals;
    mapping(bytes32 => mapping(address => bool)) public hasApproved;
    
    uint256 public requiredApprovals = 3;
    
    function requestAccess(bytes32 resourceId) public {
        require(authorizedUsers[msg.sender], "Unauthorized user");
        bytes32 requestId = keccak256(abi.encodePacked(resourceId, msg.sender, block.timestamp));
        
        if (!hasApproved[requestId][msg.sender]) {
            hasApproved[requestId][msg.sender] = true;
            approvals[requestId]++;
        }
    }
    
    function checkAccess(bytes32 requestId) public view returns (bool) {
        return approvals[requestId] >= requiredApprovals;
    }
}</code></pre>
            
            <h2>Challenges and Considerations</h2>
            
            <h3>1. Scalability</h3>
            <p>Traditional blockchains face scalability challenges for high-throughput security applications:</p>
            <ul>
                <li>Transaction throughput limitations</li>
                <li>High gas fees for frequent operations</li>
                <li>Network congestion during peak usage</li>
            </ul>
            
            <h3>2. Privacy vs. Transparency</h3>
            <p>Balancing the need for transparency with privacy requirements:</p>
            <ul>
                <li>Use zero-knowledge proofs for privacy-preserving verification</li>
                <li>Implement off-chain storage for sensitive data</li>
                <li>Use encryption for confidential information</li>
            </ul>
            
            <h3>3. Integration Complexity</h3>
            <p>Integrating blockchain with existing security infrastructure:</p>
            <pre><code>// Blockchain-traditional system bridge
class BlockchainSecurityBridge {
    constructor(contractAddress, privateKey) {
        this.contract = new ethers.Contract(contractAddress, abi, wallet);
        this.traditionalSystem = new TraditionalSecuritySystem();
    }
    
    async logSecurityEvent(event) {
        try {
            // Log to blockchain for immutability
            const tx = await this.contract.logSecurityEvent(
                event.type,
                event.hash,
                event.timestamp
            );
            await tx.wait();
            
            // Also log to traditional system for immediate processing
            await this.traditionalSystem.logEvent(event);
            
        } catch (error) {
            console.error('Failed to log security event:', error);
            // Fallback to traditional system only
            await this.traditionalSystem.logEvent(event);
        }
    }
}</code></pre>
            
            <h2>Future Directions</h2>
            <p>The intersection of blockchain and cybersecurity continues to evolve:</p>
            <ul>
                <li><strong>Quantum-resistant cryptography</strong>: Preparing for post-quantum security</li>
                <li><strong>Layer 2 solutions</strong>: Improving scalability for security applications</li>
                <li><strong>Interoperability</strong>: Connecting multiple blockchain networks for comprehensive security</li>
                <li><strong>AI integration</strong>: Combining blockchain with AI for automated threat detection</li>
            </ul>
            
            <h2>Conclusion</h2>
            <p>Blockchain technology offers powerful tools for enhancing cybersecurity, but successful implementation requires careful consideration of scalability, privacy, and integration challenges. As the technology matures, we can expect to see more sophisticated blockchain-based security solutions emerge.</p>
            
            <p>The key is to understand where blockchain adds real value to security frameworks and implement it strategically rather than as a replacement for all existing security measures.</p>
        `,
        featured: true,
        published: true
    }
];

// Initialize blog system
document.addEventListener('DOMContentLoaded', function() {
    initializeBlogSystem();
});

// Initialize blog functionality
function initializeBlogSystem() {
    setupBlogNavigation();
    console.log('📝 Blog system initialized');
}

// Setup blog navigation and detail views
function setupBlogNavigation() {
    // Update existing blog links to use showBlogPost function
    const blogLinks = document.querySelectorAll('.blog-link');
    blogLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showBlogPost(index + 1); // Blog IDs start from 1
        });
    });
}

// Show blog post detail
function showBlogPost(blogId) {
    const blog = blogPosts.find(b => b.id === blogId);
    if (!blog) {
        console.error('Blog post not found:', blogId);
        return;
    }
    
    // Create or update blog detail view
    createBlogDetailView(blog);
    
    // Hide all other pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
        page.style.opacity = '0';
    });
    
    // Show blog detail page
    setTimeout(() => {
        const blogDetailPage = document.getElementById('blog-detail');
        if (blogDetailPage) {
            blogDetailPage.classList.add('active');
            blogDetailPage.style.opacity = '1';
            
            // Update navigation state
            updateNavigationState('blog');
            
            // Scroll to top
            window.scrollTo(0, 0);
        }
    }, 150);
}

// Create blog detail view
function createBlogDetailView(blog) {
    // Remove existing blog detail page if it exists
    const existingPage = document.getElementById('blog-detail');
    if (existingPage) {
        existingPage.remove();
    }
    
    // Create new blog detail page
    const blogDetailPage = document.createElement('div');
    blogDetailPage.id = 'blog-detail';
    blogDetailPage.className = 'page';
    
    blogDetailPage.innerHTML = `
        <div class="container">
            <div class="blog-detail-header">
                <button class="back-button" onclick="showPage('blog')">
                    ← Back to Blog
                </button>
                <div class="blog-meta">
                    <span class="blog-category">${blog.category}</span>
                    <span class="blog-date">${blog.date}</span>
                    <span class="blog-read-time">${blog.readTime}</span>
                </div>
                <h1 class="blog-title">${blog.title}</h1>
                <div class="blog-tags">
                    ${blog.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                </div>
                <div class="blog-author">
                    <span>By ${blog.author}</span>
                </div>
            </div>
            
            <article class="blog-content">
                ${blog.content}
            </article>
            
            <div class="blog-footer">
                <div class="blog-share">
                    <h3>Share this article</h3>
                    <div class="share-buttons">
                        <button class="share-btn" onclick="shareOnTwitter('${blog.title}', '${blog.excerpt}')">
                            🐦 Twitter
                        </button>
                        <button class="share-btn" onclick="shareOnLinkedIn('${blog.title}', '${blog.excerpt}')">
                            💼 LinkedIn
                        </button>
                        <button class="share-btn" onclick="copyToClipboard()">
                            📋 Copy Link
                        </button>
                    </div>
                </div>
                
                <div class="blog-navigation">
                    <button class="nav-btn" onclick="showPreviousBlog(${blog.id})">
                        ← Previous Post
                    </button>
                    <button class="nav-btn" onclick="showNextBlog(${blog.id})">
                        Next Post →
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add to DOM
    document.querySelector('main').appendChild(blogDetailPage);
    
    // Add syntax highlighting for code blocks
    highlightCodeBlocks();
}

// Navigation between blog posts
function showPreviousBlog(currentId) {
    const currentIndex = blogPosts.findIndex(b => b.id === currentId);
    if (currentIndex > 0) {
        showBlogPost(blogPosts[currentIndex - 1].id);
    }
}

function showNextBlog(currentId) {
    const currentIndex = blogPosts.findIndex(b => b.id === currentId);
    if (currentIndex < blogPosts.length - 1) {
        showBlogPost(blogPosts[currentIndex + 1].id);
    }
}

// Social sharing functions
function shareOnTwitter(title, excerpt) {
    const text = encodeURIComponent(`${title} - ${excerpt}`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function shareOnLinkedIn(title, excerpt) {
    const url = encodeURIComponent(window.location.href);
    const title_encoded = encodeURIComponent(title);
    const summary = encodeURIComponent(excerpt);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title_encoded}&summary=${summary}`, '_blank');
}

function copyToClipboard() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy link:', err);
    });
}

// Highlight code blocks (simple implementation)
function highlightCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        block.classList.add('highlighted');
    });
}

// Update navigation state for blog detail
function updateNavigationState(activePageId) {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick')?.includes(activePageId)) {
            link.classList.add('active');
        }
    });
}
