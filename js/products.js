// Product Order Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all order forms
    initOrderForms();
    
    // Smooth scroll to product sections
    initSmoothScroll();
    
    // Add animation to product sections when they come into view
    initScrollAnimations();
});

function initOrderForms() {
    // Find all product sections
    const productSections = document.querySelectorAll('.product-category-section');
    
    productSections.forEach(section => {
        // Size selection
        const sizeBtns = section.querySelectorAll('.size-btn');
        const qtyInput = section.querySelector('.qty-input');
        const minusBtn = section.querySelector('.qty-btn.minus');
        const plusBtn = section.querySelector('.qty-btn.plus');
        const totalAmount = section.querySelector('.total-amount');
        const selectedSize = section.querySelector('.selected-size');
        
        let currentPrice = 0;
        let currentSize = '';
        
        // Initialize first size as active
        const firstSizeBtn = sizeBtns[0];
        if (firstSizeBtn) {
            currentPrice = parseInt(firstSizeBtn.dataset.price);
            currentSize = firstSizeBtn.dataset.size;
            updateTotal();
        }
        
        // Size button click handler
        sizeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                sizeBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Update price and size
                currentPrice = parseInt(this.dataset.price);
                currentSize = this.dataset.size;
                
                updateTotal();
            });
        });
        
        // Quantity controls
        if (minusBtn && plusBtn && qtyInput) {
            minusBtn.addEventListener('click', function() {
                let currentVal = parseInt(qtyInput.value);
                if (currentVal > 1) {
                    qtyInput.value = currentVal - 1;
                    updateTotal();
                }
            });
            
            plusBtn.addEventListener('click', function() {
                let currentVal = parseInt(qtyInput.value);
                if (currentVal < parseInt(qtyInput.max)) {
                    qtyInput.value = currentVal + 1;
                    updateTotal();
                }
            });
            
            qtyInput.addEventListener('input', function() {
                let val = parseInt(this.value);
                if (val < 1) this.value = 1;
                if (val > parseInt(this.max)) this.value = this.max;
                updateTotal();
            });
            
            qtyInput.addEventListener('change', function() {
                if (!this.value || parseInt(this.value) < 1) {
                    this.value = 1;
                }
                updateTotal();
            });
        }
        
        // Update total price function
        function updateTotal() {
            if (!qtyInput || !totalAmount || !selectedSize) return;
            
            const quantity = parseInt(qtyInput.value);
            const total = currentPrice * quantity;
            
            // Format price with commas
            totalAmount.textContent = `KSh ${total.toLocaleString()}`;
            selectedSize.textContent = `(${currentSize} × ${quantity})`;
        }
        
        // WhatsApp order button
        const whatsappBtn = section.querySelector('.btn-whatsapp-order');
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', function() {
                const productName = this.dataset.product || 'Product';
                const size = currentSize;
                const quantity = qtyInput ? qtyInput.value : '1';
                const price = currentPrice * parseInt(quantity);
                
                const message = `Hello Amoneph Botanicals! I'd like to order:\n\n` +
                               `*Product:* ${productName}\n` +
                               `*Size:* ${size}\n` +
                               `*Quantity:* ${quantity}\n` +
                               `*Total:* KSh ${price.toLocaleString()}\n\n` +
                               `Please let me know the next steps!`;
                
                const encodedMessage = encodeURIComponent(message);
                const whatsappUrl = `https://wa.me/254768427602?text=${encodedMessage}`;
                
                window.open(whatsappUrl, '_blank');
            });
        }
        
        // Call to order button
        const callBtn = section.querySelector('.btn-call-order');
        if (callBtn) {
            callBtn.addEventListener('click', function() {
                window.location.href = 'tel:+254768427602';
            });
        }
        
        // Initialize total on load
        updateTotal();
    });
}

function initSmoothScroll() {
    // Smooth scroll for "View Details" buttons
    const viewDetailButtons = document.querySelectorAll('.btn-view-details');
    
    viewDetailButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                    
                    // Add highlight animation
                    targetElement.style.transition = 'box-shadow 0.5s ease';
                    targetElement.style.boxShadow = '0 0 0 3px rgba(212, 160, 23, 0.3)';
                    
                    setTimeout(() => {
                        targetElement.style.boxShadow = '';
                    }, 1500);
                }
            }
        });
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all alternating product sections
    const productSections = document.querySelectorAll('.alternating-product-section');
    productSections.forEach(section => {
        observer.observe(section);
    });
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .alternating-product-section {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .alternating-product-section.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .circular-image-frame img {
        transition: transform 0.5s ease;
    }
    
    .circular-image-container img {
        transition: transform 0.5s ease;
    }
`;
document.head.appendChild(style);