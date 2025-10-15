// ============================================
// CONTACT FORM - SUPABASE INTEGRATION
// Store contact messages in database
// ============================================

// ============================================
// INITIALIZE CONTACT FORM
// ============================================
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) {
        console.log('ℹ️ Contact form not found');
        return;
    }
    
    form.addEventListener('submit', handleContactFormSubmission);
    
    // Add real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
    
    console.log('✅ Contact form initialized');
}

// ============================================
// HANDLE CONTACT FORM SUBMISSION
// ============================================
async function handleContactFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Show loading state
    showLoadingState(form);
    
    try {
        // Validate form
        if (!validateForm(form)) {
            hideLoadingState(form);
            return;
        }
        
        // Insert into Supabase
        const { error } = await supabaseClient
            .from('contact_messages')
            .insert({
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message,
                status: 'new'
            });
        
        if (error) {
            throw error;
        }
        
        // Show success message
        showSuccessMessage(form);
        
        // Reset form
        form.reset();
        
        // Track submission
        console.log('✅ Contact form submitted successfully');
        showNotification('Message sent successfully! 📧', 'success');
        
    } catch (error) {
        console.error('Contact form submission error:', error);
        showErrorMessage(form, 'Failed to send message. Please try again or email directly.');
    } finally {
        hideLoadingState(form);
    }
}

// ============================================
// FORM VALIDATION
// ============================================
const validationRules = {
    name: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-Z\s]+$/,
        message: 'Please enter a valid name (letters only, minimum 2 characters)'
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
    },
    subject: {
        required: true,
        minLength: 5,
        message: 'Subject must be at least 5 characters long'
    },
    message: {
        required: true,
        minLength: 10,
        message: 'Message must be at least 10 characters long'
    }
};

function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    const rules = validationRules[fieldName];
    
    if (!rules) return true;
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (rules.required && !fieldValue) {
        showFieldError(field, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
        return false;
    }
    
    // Minimum length validation
    if (rules.minLength && fieldValue.length < rules.minLength) {
        showFieldError(field, rules.message);
        return false;
    }
    
    // Pattern validation
    if (rules.pattern && !rules.pattern.test(fieldValue)) {
        showFieldError(field, rules.message);
        return false;
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ff006e;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        animation: slideIn 0.3s ease-out;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// ============================================
// UI STATE MANAGEMENT
// ============================================
function showLoadingState(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
                <div class="spinner"></div>
                Sending...
            </span>
        `;
    }
}

function hideLoadingState(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message';
    }
}

function showSuccessMessage(form) {
    const message = createStatusMessage('success', '✅ Message sent successfully! I\'ll get back to you soon.');
    form.parentNode.insertBefore(message, form);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        message.remove();
    }, 5000);
}

function showErrorMessage(form, errorText) {
    const message = createStatusMessage('error', '❌ ' + errorText);
    form.parentNode.insertBefore(message, form);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        message.remove();
    }, 5000);
}

function createStatusMessage(type, text) {
    const message = document.createElement('div');
    message.className = `status-message ${type}`;
    message.textContent = text;
    message.style.cssText = `
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
        ${type === 'success' ? 
            'background: rgba(0, 255, 65, 0.1); border: 1px solid #00ff41; color: #00ff41;' : 
            'background: rgba(255, 0, 110, 0.1); border: 1px solid #ff006e; color: #ff006e;'
        }
    `;
    
    return message;
}

// ============================================
// INITIALIZE ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    console.log('✅ Contact Supabase module loaded');
});

// ============================================
// EXPORT FUNCTIONS
// ============================================
window.initializeContactForm = initializeContactForm;