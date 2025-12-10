// contact.js - Contact Page Specific Functionality
document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const toggle = item.querySelector('.faq-toggle');
        
        question.addEventListener('click', function() {
            // Close other open FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-toggle').textContent = '+';
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            toggle.textContent = item.classList.contains('active') ? '−' : '+';
        });
    });
    
    // Form Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = Object.fromEntries(formData);
            
            // Basic validation
            if (!validateForm(formObject)) {
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                alert('Thank you! Your message has been sent. We will respond within 24 hours.');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // Schedule button functionality
    const scheduleBtn = document.querySelector('.schedule-btn');
    if (scheduleBtn) {
        scheduleBtn.addEventListener('click', function() {
            const message = encodeURIComponent("Hello! I'd like to schedule a call to discuss:");
            window.open(`https://wa.me/254768427602?text=${message}`, '_blank');
        });
    }
});

function validateForm(formData) {
    // Check required fields
    const requiredFields = ['name', 'phone', 'email', 'subject', 'message'];
    
    for (const field of requiredFields) {
        if (!formData[field] || formData[field].trim() === '') {
            alert(`Please fill in the ${field.replace('-', ' ')} field.`);
            return false;
        }
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    return true;
}

function openGoogleMaps() {
    const address = encodeURIComponent('Nairobi, Kenya');
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
}

function openAppleMaps() {
    const address = encodeURIComponent('Nairobi, Kenya');
    window.open(`http://maps.apple.com/?q=${address}`, '_blank');
}