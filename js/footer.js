// SimeonDev Portfolio - Footer & Newsletter System
// Newsletter subscription and footer functionality

// Initialize footer functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeFooter();
    setupNewsletterForm();
    setupFooterAnimations();
});

// Initialize footer system
function initializeFooter() {
    console.log('📧 Footer and newsletter system initialized');
    
    // Add footer scroll animations
    observeFooterElements();
    
    // Setup social link tracking
    setupSocialTracking();
}

// Newsletter form handling
function setupNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', handleNewsletterSubmission);
}

// Handle newsletter subscription
async function handleNewsletterSubmission(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('newsletter-email');
    const email = emailInput.value.trim();
    
    if (!validateEmail(email)) {
        showNewsletterMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('.newsletter-btn');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="spinner"></div>';
    submitBtn.disabled = true;
    
    try {
        // Simulate newsletter subscription (replace with actual API call)
        await subscribeToNewsletter(email);
        
        // Success state
        showNewsletterMessage('🎉 Successfully subscribed! Welcome to the SimeonDev newsletter.', 'success');
        emailInput.value = '';
        
        // Track subscription
        trackNewsletterSubscription(email);
        
    } catch (error) {
        console.error('Newsletter subscription failed:', error);
        showNewsletterMessage('Subscription failed. Please try again later.', 'error');
    } finally {
        // Reset button
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
    }
}

// Newsletter subscription API (mock implementation)
async function subscribeToNewsletter(email) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate API call
            if (email.includes('test@')) {
                reject(new Error('Test email rejected'));
            } else {
                resolve({ success: true, message: 'Subscribed successfully' });
            }
        }, 1500);
    });
}

// Show newsletter message
function showNewsletterMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.newsletter-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `newsletter-message ${type}`;
    messageDiv.textContent = message;
    
    // Add to form
    const form = document.getElementById('newsletter-form');
    form.appendChild(messageDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Setup footer animations
function setupFooterAnimations() {
    // Add hover effects to social links
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', animateSocialLink);
        link.addEventListener('mouseleave', resetSocialLink);
    });
}

// Animate social link on hover
function animateSocialLink(e) {
    const link = e.currentTarget;
    const svg = link.querySelector('svg');
    
    if (svg) {
        svg.style.transform = 'scale(1.2) rotate(5deg)';
        svg.style.transition = 'transform 0.3s ease';
    }
}

// Reset social link animation
function resetSocialLink(e) {
    const link = e.currentTarget;
    const svg = link.querySelector('svg');
    
    if (svg) {
        svg.style.transform = 'scale(1) rotate(0deg)';
    }
}

// Observe footer elements for scroll animations
function observeFooterElements() {
    const footerElements = document.querySelectorAll('.footer-brand, .footer-social, .footer-newsletter, .footer-links');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    footerElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        observer.observe(element);
    });
}

// Setup social link tracking
function setupSocialTracking() {
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const platform = this.classList[1]; // Get platform class
            trackSocialClick(platform);
        });
    });
}

// Track social media clicks
function trackSocialClick(platform) {
    console.log(`📊 Social click tracked: ${platform}`);
    
    // Store in localStorage for analytics
    const socialClicks = JSON.parse(localStorage.getItem('socialClicks') || '{}');
    socialClicks[platform] = (socialClicks[platform] || 0) + 1;
    localStorage.setItem('socialClicks', JSON.stringify(socialClicks));
}

// Track newsletter subscription
function trackNewsletterSubscription(email) {
    console.log('📈 Newsletter subscription tracked');
    
    // Store subscription data (anonymized)
    const subscriptionData = {
        timestamp: new Date().toISOString(),
        domain: email.split('@')[1],
        success: true
    };
    
    // Store in localStorage
    const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
    subscriptions.push(subscriptionData);
    localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
}

// Privacy Policy modal
function showPrivacyPolicy() {
    const modal = createModal('Privacy Policy', `
        <div class="privacy-content">
            <p><strong>Last updated:</strong> January 2025</p>
            
            <h3>🔒 Your Privacy Matters</h3>
            <p>This Privacy Policy explains how SimeonDev portfolio website collects, uses, and protects your information when you visit our site.</p>
            
            <h3>📊 Information We Collect</h3>
            <p><strong>Contact Information:</strong> When you use the contact form, we collect your name, email, and message content.</p>
            <p><strong>Newsletter:</strong> If you subscribe to our newsletter, we collect your email address.</p>
            <p><strong>Analytics:</strong> We may collect basic website usage data (pages visited, time spent) to improve our site experience.</p>
            
            <h3>🎯 How We Use Your Information</h3>
            <p><strong>Communication:</strong> To respond to your inquiries and project requests.</p>
            <p><strong>Updates:</strong> To send you tech insights and project updates (only if you subscribe).</p>
            <p><strong>Improvement:</strong> To enhance the website experience and content quality.</p>
            
            <h3>🛡️ Your Data Protection</h3>
            <p><strong>No Sales:</strong> We never sell, trade, or rent your personal information to third parties.</p>
            <p><strong>Security:</strong> We use industry-standard security measures to protect your data.</p>
            <p><strong>Retention:</strong> We only keep your data as long as necessary for the stated purposes.</p>
            
            <h3>🍪 Cookies & Tracking</h3>
            <p>We use minimal cookies for basic functionality (theme preferences, form data). No invasive tracking or advertising cookies.</p>
            
            <h3>📝 Your Rights</h3>
            <p>You can request to access, update, or delete your personal information at any time.</p>
            
            <h3>📧 Contact</h3>
            <p>Questions about this policy? Email: <strong>hello@SimeonDev.dev</strong></p>
        </div>
    `);
    
    document.body.appendChild(modal);
}

// Terms of Service modal
function showTermsOfService() {
    const modal = createModal('Terms of Service', `
        <div class="terms-content">
            <p><strong>Last updated:</strong> January 2025</p>
            
            <h3>🤝 Welcome to SimeonDev Portfolio</h3>
            <p>By using this website, you agree to these simple and fair terms. This is my personal portfolio showcasing my work and expertise.</p>
            
            <h3>🌐 Website Usage</h3>
            <p><strong>Personal Use:</strong> You're welcome to browse, share, and reference my portfolio for legitimate purposes.</p>
            <p><strong>Respect:</strong> Please don't copy content, scrape data, or use automated tools without permission.</p>
            <p><strong>Feedback:</strong> Feel free to reach out with questions or collaboration opportunities.</p>
            
            <h3>💼 Project Information</h3>
            <p><strong>Showcase Purpose:</strong> Projects displayed are for portfolio demonstration and may contain simplified descriptions.</p>
            <p><strong>Availability:</strong> Not all projects may be publicly accessible due to client confidentiality or licensing.</p>
            <p><strong>Updates:</strong> Project information and portfolio content may be updated without notice.</p>
            
            <h3>🔗 External Links</h3>
            <p><strong>Third-party Sites:</strong> Links to GitHub, LinkedIn, and other platforms are provided for convenience.</p>
            <p><strong>No Responsibility:</strong> I'm not responsible for content or practices of external websites.</p>
            
            <h3>📧 Contact & Communication</h3>
            <p><strong>Professional Inquiries:</strong> Contact form is for legitimate business or collaboration inquiries.</p>
            <p><strong>Response:</strong> I'll do my best to respond promptly, but response times may vary.</p>
            <p><strong>Spam Policy:</strong> Please don't use contact methods for spam or unsolicited marketing.</p>
            
            <h3>⚖️ Fair Use</h3>
            <p><strong>Educational Use:</strong> Content may be referenced for educational purposes with proper attribution.</p>
            <p><strong>Commercial Use:</strong> Please ask permission before using any content for commercial purposes.</p>
            
            <h3>📝 Changes</h3>
            <p>These terms may be updated occasionally. Continued use means acceptance of any changes.</p>
            
            <h3>📬 Questions?</h3>
            <p>Have questions about these terms? Reach out: <strong>hello@SimeonDev.dev</strong></p>
        </div>
    `);
    
    document.body.appendChild(modal);
}

// Create modal for legal pages
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'legal-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="this.parentElement.remove()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close" onclick="this.closest('.legal-modal').remove()">×</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    return modal;
}

// Add CSS for modals and animations
const additionalCSS = `
    .legal-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }
    
    .legal-modal .modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
    }
    
    .legal-modal .modal-content {
        position: relative;
        background: rgba(26, 10, 46, 0.95);
        border: 1px solid rgba(157, 78, 221, 0.3);
        border-radius: 15px;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        animation: modalSlideIn 0.3s ease-out;
    }
    
    .legal-modal .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid rgba(157, 78, 221, 0.3);
    }
    
    .legal-modal .modal-header h2 {
        color: #ffd60a;
        margin: 0;
    }
    
    .legal-modal .modal-close {
        background: none;
        border: none;
        color: #ffffff;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 4px;
        transition: all 0.3s ease;
    }
    
    .legal-modal .modal-close:hover {
        background: rgba(255, 0, 110, 0.2);
        color: #ff006e;
    }
    
    .legal-modal .modal-body {
        padding: 1.5rem;
        color: #cccccc;
        line-height: 1.6;
    }
    
    .legal-modal .modal-body h3 {
        color: #9d4edd;
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
    }
    
    .legal-modal .modal-body p {
        margin-bottom: 1rem;
    }
    
    .spinner {
        width: 20px;
        height: 20px;
        border: 2px solid #ffffff;
        border-top: 2px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Add the additional CSS to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);

// Make functions globally available
window.showPrivacyPolicy = showPrivacyPolicy;
window.showTermsOfService = showTermsOfService;
