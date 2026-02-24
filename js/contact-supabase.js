// ============================================
// CONTACT FORM - SUPABASE INTEGRATION
// Enhanced with spam protection and validation
// ============================================

// Track form load time for spam detection
let formLoadTime = 0;

// ============================================
// INITIALIZE CONTACT FORM
// ============================================
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) {
        return;
    }
    
    // Record form load time for spam detection
    formLoadTime = Date.now();
    
    form.addEventListener('submit', handleContactFormSubmission);
    
    // Add character counter for message field
    const messageField = form.querySelector('#message');
    if (messageField) {
        messageField.addEventListener('input', updateCharCounter);
    }
    
    // Add FAQ toggle functionality
    setupFAQToggles();
    
}

// ============================================
// HANDLE CONTACT FORM SUBMISSION
// ============================================
async function handleContactFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const data = {
        name: formData.get('name')?.trim(),
        email: formData.get('email')?.trim(),
        subject: formData.get('subject') || 'General Inquiry',
        message: formData.get('message')?.trim(),
        honeypot: formData.get('website') // Spam trap
    };
    
    // Show loading state
    showLoadingState();
    
    try {
        // === SPAM PROTECTION CHECKS ===
        
        // 1. Honeypot check (bots fill hidden field)
        if (data.honeypot) {
            hideLoadingState();
            // Silent rejection - don't tell spammers
            showSuccessMessage(); // Fake success
            form.reset();
            return;
        }
        
        // 2. Time-based check (bots submit too fast)
        const submissionTime = Date.now();
        const timeDifference = submissionTime - formLoadTime;
        if (timeDifference < 3000) {
            showErrorMessage('Please take a moment to review your message before sending.');
            hideLoadingState();
            return;
        }
        
        // 3. Rate limiting (prevent multiple submissions)
        const lastSubmission = localStorage.getItem('lastContactSubmit');
        if (lastSubmission && (submissionTime - parseInt(lastSubmission)) < 60000) {
            showErrorMessage('Please wait 1 minute between submissions.');
            hideLoadingState();
            return;
        }
        
        // 4. Disposable email detection
        if (isDisposableEmail(data.email)) {
            showErrorMessage('Please use a permanent email address.');
            hideLoadingState();
            return;
        }
        
        // 5. Message quality check
        if (data.message.length < 20) {
            showErrorMessage('Please provide more details (minimum 20 characters).');
            hideLoadingState();
            return;
        }
        
        // 6. Spam keyword detection
        if (containsSpamKeywords(data.message)) {
            hideLoadingState();
            showSuccessMessage(); // Fake success
            form.reset();
            return;
        }
        
        // === FORM VALIDATION ===
        if (!validateContactForm(data)) {
            hideLoadingState();
            return;
        }
        
        // === INSERT INTO SUPABASE ===
        const { error } = await supabaseClient
            .from('contact_submissions')
            .insert({
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message,
                status: 'new',
                created_at: new Date().toISOString()
            });
        
        if (error) {
            throw error;
        }
        
        // Store submission time for rate limiting
        localStorage.setItem('lastContactSubmit', submissionTime.toString());
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        form.reset();
        const messageField = form.querySelector('#message');
        if (messageField) updateCharCounter({ target: messageField });
        
        // Track submission
        
        // Optional: Send email notification (configure in Supabase triggers)
        
    } catch (error) {
        console.error('Contact form submission error:', error);
        showErrorMessage('Failed to send message. Please try emailing directly at simeondevs1@gmail.com');
    } finally {
        hideLoadingState();
    }
}

// ============================================
// SPAM PROTECTION FUNCTIONS
// ============================================

// Check for disposable/temporary email addresses
function isDisposableEmail(email) {
    const disposableDomains = [
        'tempmail', 'guerrillamail', '10minutemail', 'throwaway', 
        'mailinator', 'yopmail', 'temp-mail', 'fakeinbox',
        'trashmail', 'getnada', 'maildrop', 'sharklasers'
    ];
    
    const emailDomain = email.toLowerCase().split('@')[1];
    if (!emailDomain) return true;
    
    return disposableDomains.some(domain => emailDomain.includes(domain));
}

// Check for common spam keywords
function containsSpamKeywords(message) {
    const spamKeywords = [
        'viagra', 'casino', 'lottery', 'winner', 'congratulations',
        'click here', 'buy now', 'limited time', 'act now', 'free money',
        'nigerian prince', 'inheritance', 'bitcoin wallet', 'trading signals',
        'make money fast', 'work from home', 'crypto investment'
    ];
    
    const lowerMessage = message.toLowerCase();
    return spamKeywords.some(keyword => lowerMessage.includes(keyword));
}

// ============================================
// FORM VALIDATION
// ============================================
function validateContactForm(data) {
    // Name validation
    if (!data.name || data.name.length < 2) {
        showErrorMessage('Please enter your name (minimum 2 characters).');
        return false;
    }
    
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailPattern.test(data.email)) {
        showErrorMessage('Please enter a valid email address.');
        return false;
    }
    
    // Message validation
    if (!data.message || data.message.length < 20) {
        showErrorMessage('Please provide more details in your message (minimum 20 characters).');
        return false;
    }
    
    // Check for excessive URLs (spam indicator)
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const urlCount = (data.message.match(urlPattern) || []).length;
    if (urlCount > 2) {
        showErrorMessage('Please limit URLs in your message.');
        return false;
    }
    
    return true;
}

// ============================================
// UI FUNCTIONS
// ============================================

// Update character counter for message field
function updateCharCounter(e) {
    const messageField = e.target;
    const charCount = messageField.value.length;
    const counter = document.querySelector('.char-counter');
    
    if (counter) {
        if (charCount === 0) {
            counter.textContent = 'Minimum 20 characters';
            counter.style.color = 'var(--text-muted)';
        } else if (charCount < 20) {
            counter.textContent = `${20 - charCount} characters remaining`;
            counter.style.color = '#F59E0B';
        } else {
            counter.textContent = `✓ ${charCount} characters`;
            counter.style.color = '#10B981';
        }
    }
}

// Show loading state
function showLoadingState() {
    const submitBtn = document.querySelector('.form-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    if (submitBtn) {
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
    }
}

// Hide loading state
function hideLoadingState() {
    const submitBtn = document.querySelector('.form-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    if (submitBtn) {
        submitBtn.disabled = false;
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
    }
}

// Show success message
function showSuccessMessage() {
    const messageDiv = document.getElementById('form-message');
    if (messageDiv) {
        messageDiv.className = 'form-message success';
        messageDiv.innerHTML = `
            <strong>✅ Message sent successfully!</strong><br>
            Thank you for reaching out. I'll get back to you within 24 hours.<br>
            <small>Check your email for a confirmation.</small>
        `;
        messageDiv.style.display = 'block';
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide after 8 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 8000);
    }
}

// Show error message
function showErrorMessage(errorText) {
    const messageDiv = document.getElementById('form-message');
    if (messageDiv) {
        messageDiv.className = 'form-message error';
        messageDiv.innerHTML = `
            <strong>❌ ${errorText}</strong><br>
            <small>Need immediate help? Email me directly at <a href="mailto:simeondevs1@gmail.com">simeondevs1@gmail.com</a></small>
        `;
        messageDiv.style.display = 'block';
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide after 10 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 10000);
    }
}

// ============================================
// FAQ TOGGLE FUNCTIONALITY
// ============================================
function setupFAQToggles() {
    // Make toggleFAQ function globally available
    window.toggleFAQ = function(button) {
        const faqItem = button.closest('.faq-item');
        const isActive = faqItem.classList.contains('active');
        
        // Close all other FAQs
        document.querySelectorAll('.faq-item.active').forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
            }
        });
        
        // Toggle current FAQ
        faqItem.classList.toggle('active');
    };
}

// ============================================
// INITIALIZE ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
});

// contact-supabase.js self-initializes via DOMContentLoaded above, no external exports needed