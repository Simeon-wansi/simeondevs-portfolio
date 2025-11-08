// SimeonDev Portfolio - Contact Form Handler
// Form Validation & Email Integration

// Initialize form handling
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    setupFormValidation();
    initializeEmailJS();
});

// Initialize EmailJS (you'll need to replace with your actual keys)
function initializeEmailJS() {
    // Initialize EmailJS with your public key
    // emailjs.init("YOUR_PUBLIC_KEY");
    console.log('📧 EmailJS initialized (configure with your keys)');
}

// Initialize contact form
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) {
        console.log('ℹ️ Contact form not found, creating form structure');
        return;
    }
    
    form.addEventListener('submit', handleFormSubmission);
    
    // Add real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

// Setup form validation rules
function setupFormValidation() {
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
    
    window.formValidationRules = validationRules;
}

// Handle form submission
async function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    showLoadingState(form);
    
    try {
        // Validate form
        if (!validateForm(form)) {
            hideLoadingState(form);
            return;
        }
        
        // Send email
        await sendEmail(data);
        
        // Show success message
        showSuccessMessage(form);
        
        // Reset form
        form.reset();
        
    } catch (error) {
        console.error('Form submission error:', error);
        showErrorMessage(form, 'Failed to send message. Please try again.');
    } finally {
        hideLoadingState(form);
    }
}

// Validate entire form
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

// Validate individual field
function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    const rules = window.formValidationRules[fieldName];
    
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

// Show field error
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

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Send email using EmailJS
async function sendEmail(data) {
    // Mock email sending for now
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success/failure
            if (Math.random() > 0.1) { // 90% success rate
                resolve();
            } else {
                reject(new Error('Email service temporarily unavailable'));
            }
        }, 2000);
    });
    
    // Uncomment and configure for real EmailJS integration:
    /*
    try {
        const response = await emailjs.send(
            'YOUR_SERVICE_ID',
            'YOUR_TEMPLATE_ID',
            {
                from_name: data.name,
                from_email: data.email,
                subject: data.subject,
                message: data.message,
                to_name: 'SimeonDev'
            }
        );
        return response;
    } catch (error) {
        throw new Error('Failed to send email: ' + error.message);
    }
    */
}

// Show loading state
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

// Hide loading state
function hideLoadingState(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message';
    }
}

// Show success message
function showSuccessMessage(form) {
    const message = createStatusMessage('success', '✅ Message sent successfully! I\'ll get back to you soon.');
    form.parentNode.insertBefore(message, form);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        message.remove();
    }, 5000);
}

// Show error message
function showErrorMessage(form, errorText) {
    const message = createStatusMessage('error', '❌ ' + errorText);
    form.parentNode.insertBefore(message, form);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        message.remove();
    }, 5000);
}

// Create status message element
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

// Add required CSS for form styling
const formStyle = document.createElement('style');
formStyle.textContent = `
    .form-group input.error,
    .form-group textarea.error {
        border-color: #ff006e;
        box-shadow: 0 0 0 2px rgba(255, 0, 110, 0.2);
    }
    
    .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid #ffffff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .form-group {
        position: relative;
    }
    
    .form-group input:focus,
    .form-group textarea:focus {
        border-color: #ffd60a;
        box-shadow: 0 0 0 2px rgba(255, 214, 10, 0.2);
        outline: none;
    }
    
    .form-group input:valid,
    .form-group textarea:valid {
        border-color: #00ff41;
    }
    
    .status-message {
        position: relative;
        overflow: hidden;
    }
    
    .status-message::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        animation: shimmer 2s infinite;
    }
    
    @keyframes shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
    }
`;
document.head.appendChild(formStyle);

// Export functions for global use
window.SimeonDevForms = {
    validateForm,
    validateField,
    sendEmail,
    showSuccessMessage,
    showErrorMessage
};
