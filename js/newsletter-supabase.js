// ============================================
// NEWSLETTER - SUPABASE INTEGRATION
// Store subscribers in database
// ============================================

// ============================================
// INITIALIZE NEWSLETTER FORM
// ============================================
function initializeNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (!newsletterForm) {
        console.warn('⚠️  Newsletter form not found');
        return;
    }
    
    newsletterForm.addEventListener('submit', handleNewsletterSubmission);
}

// ============================================
// HANDLE NEWSLETTER SUBSCRIPTION
// ============================================
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
        // Check if email already exists
        const { data: existingSubscriber, error: checkError } = await supabaseClient
            .from('subscribers')
            .select('id, status')
            .eq('email', email)
            .single();
        
        if (existingSubscriber) {
            if (existingSubscriber.status === 'active') {
                showNewsletterMessage('You\'re already subscribed! 🎉', 'info');
                emailInput.value = '';
                return;
            } else {
                // Reactivate subscription
                const { error: updateError } = await supabaseClient
                    .from('subscribers')
                    .update({ 
                        status: 'active',
                        subscribed_at: new Date().toISOString(),
                        unsubscribed_at: null
                    })
                    .eq('id', existingSubscriber.id);
                
                if (updateError) throw updateError;
                
                showNewsletterMessage('🎉 Welcome back! You\'re subscribed again.', 'success');
                emailInput.value = '';
                return;
            }
        }
        
        // Insert new subscriber
        const { error: insertError } = await supabaseClient
            .from('subscribers')
            .insert({
                email: email,
                status: 'active',
                source: 'footer' // Can be 'footer', 'popup', etc.
            });
        
        if (insertError) {
            // Check if it's a unique constraint error
            if (insertError.code === '23505') {
                showNewsletterMessage('You\'re already subscribed! 🎉', 'info');
            } else {
                throw insertError;
            }
        } else {
            showNewsletterMessage('🎉 Successfully subscribed! Welcome to the SimeonDev newsletter.', 'success');
            emailInput.value = '';
            
            // Track subscription
        }
        
    } catch (error) {
        console.error('Newsletter subscription failed:', error);
        showNewsletterMessage('Subscription failed. Please try again later.', 'error');
    } finally {
        // Reset button
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
    }
}

// ============================================
// EMAIL VALIDATION
// ============================================
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ============================================
// SHOW NEWSLETTER MESSAGE
// ============================================
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
    
    const colors = {
        success: 'background: rgba(0, 255, 65, 0.1); border: 1px solid rgba(0, 255, 65, 0.3); color: #00ff41;',
        error: 'background: rgba(255, 0, 110, 0.1); border: 1px solid rgba(255, 0, 110, 0.3); color: #ff006e;',
        info: 'background: rgba(0, 245, 255, 0.1); border: 1px solid rgba(0, 245, 255, 0.3); color: #00f5ff;'
    };
    
    messageDiv.style.cssText = `
        padding: 0.75rem;
        border-radius: 8px;
        margin-top: 0.5rem;
        font-size: 0.9rem;
        text-align: center;
        animation: slideIn 0.3s ease;
        ${colors[type] || colors.info}
    `;
    
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

// ============================================
// INITIALIZE ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeNewsletterForm();
});

// newsletter-supabase.js self-initializes via DOMContentLoaded above, no external exports needed