// main.js - Amoneph Botanicals
document.addEventListener('DOMContentLoaded', function() {
    console.log('Amoneph Botanicals website loaded successfully!');
    
    // ===== MOBILE NAVIGATION TOGGLE =====
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    // For hamburger menu (if exists)
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target) && 
                navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
    
    // For mobile menu button (if exists)
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !navLinks.contains(event.target) && 
                navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
    
    // ===== WHATSAPP BUTTON FUNCTIONALITY =====
    // WhatsApp order function
    window.orderViaWhatsApp = function(productName, size, quantity, totalPrice) {
        const message = `Hello Amoneph Botanicals! I'd like to order:\n\n` +
                       `*Product:* ${productName}\n` +
                       `*Size:* ${size}\n` +
                       `*Quantity:* ${quantity}\n` +
                       `*Total:* KSh ${totalPrice}\n\n` +
                       `Please let me know the next steps!`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/254768427602?text=${encodedMessage}`;
        
        // Open in new tab on desktop, same tab on mobile
        if (window.innerWidth > 768) {
            window.open(whatsappUrl, '_blank');
        } else {
            window.location.href = whatsappUrl;
        }
    };
    
    // Call to order function
    window.callToOrder = function() {
        window.location.href = 'tel:+254768427602';
    };
    
    // WhatsApp float button
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (whatsappFloat) {
        whatsappFloat.addEventListener('mouseenter', () => {
            whatsappFloat.style.transform = 'scale(1.1)';
        });
        
        whatsappFloat.addEventListener('mouseleave', () => {
            whatsappFloat.style.transform = 'scale(1)';
        });
        
        // Touch events for mobile
        whatsappFloat.addEventListener('touchstart', () => {
            whatsappFloat.style.transform = 'scale(1.1)';
        });
        
        whatsappFloat.addEventListener('touchend', () => {
            setTimeout(() => {
                whatsappFloat.style.transform = 'scale(1)';
            }, 300);
        });
    }
    
    // ===== SMOOTH SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal links
            if (href === '#' || href.startsWith('http')) return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                const headerHeight = document.querySelector('.header') ? 
                    document.querySelector('.header').offsetHeight : 80;
                
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (hamburger && navMenu && navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
                
                if (mobileMenuBtn && navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }
        });
    });
    
    // ===== SET CURRENT YEAR IN FOOTER =====
    const yearElements = document.querySelectorAll('#current-year');
    yearElements.forEach(element => {
        element.textContent = new Date().getFullYear();
    });
    
    // ===== PRODUCT HOVER EFFECTS (Desktop only) =====
    const productCards = document.querySelectorAll('.product-card, .category-card, .overview-card');
    productCards.forEach(card => {
        // Only add hover effects for non-touch devices
        if (!('ontouchstart' in window || navigator.maxTouchPoints)) {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        }
        
        // Add touch feedback for mobile
        card.addEventListener('touchstart', () => {
            card.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('touchend', () => {
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 300);
        });
    });
    
    // ===== ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-menu a, .nav-links a');
    
    if (sections.length > 0 && navLinksAll.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollY = window.pageYOffset;
            const headerHeight = document.querySelector('.header') ? 
                document.querySelector('.header').offsetHeight : 80;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 100;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    current = sectionId;
                }
            });
            
            navLinksAll.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href && href.includes(current)) {
                    link.classList.add('active');
                }
            });
        });
    }
    
    // ===== STICKY HEADER =====
    const header = document.querySelector('.header');
    if (header) {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add shadow when scrolled
            if (scrollTop > 50) {
                header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = 'none';
            }
            
            // Optional: Hide/show on scroll (uncomment if needed)
            /*
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                // Scroll down - hide header
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scroll up - show header
                header.style.transform = 'translateY(0)';
            }
            */
            
            lastScrollTop = scrollTop;
        });
    }
    
    // ===== BACK TO TOP BUTTON =====
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.visibility = 'visible';
            } else {
                backToTopBtn.classList.remove('visible');
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.visibility = 'hidden';
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Touch feedback for mobile
        backToTopBtn.addEventListener('touchstart', () => {
            backToTopBtn.style.transform = 'scale(0.95)';
        });
        
        backToTopBtn.addEventListener('touchend', () => {
            setTimeout(() => {
                backToTopBtn.style.transform = 'scale(1)';
            }, 300);
        });
    }
    
    // ===== FORM VALIDATION (for future forms) =====
    window.validateForm = function(formId) {
        const form = document.getElementById(formId);
        if (!form) return true;
        
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            const errorElement = input.nextElementSibling?.classList.contains('error-message') ? 
                input.nextElementSibling : null;
            
            if (!input.value.trim()) {
                input.style.borderColor = '#e74c3c';
                if (errorElement) {
                    errorElement.textContent = 'This field is required';
                    errorElement.style.display = 'block';
                }
                isValid = false;
            } else {
                input.style.borderColor = '#e9ecef';
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            }
        });
        
        return isValid;
    };
    
    // ===== PAGE LOAD ANIMATION =====
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Remove any preloader if exists
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }, 500);
        }
    });
    
    // ===== TOUCH DEVICE DETECTION =====
    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    // Add touch-device class to body if needed
    if (isTouchDevice()) {
        document.body.classList.add('touch-device');
    }
    
    // ===== RESIZE HANDLER =====
    let resizeTimer;
    window.addEventListener('resize', () => {
        document.body.classList.add('resizing');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove('resizing');
        }, 250);
        
        // Close mobile menu on large screens
        if (window.innerWidth > 992) {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
            if (mobileMenuBtn && navLinks) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    });
    
    // ===== PRODUCT QUANTITY CONTROLS =====
    document.querySelectorAll('.qty-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const input = this.parentNode.querySelector('.qty-input');
            if (!input) return;
            
            let value = parseInt(input.value) || 0;
            
            if (this.classList.contains('minus') && value > parseInt(input.min || 1)) {
                value--;
            } else if (this.classList.contains('plus') && value < parseInt(input.max || 20)) {
                value++;
            }
            
            input.value = value;
            
            // Trigger change event for any calculations
            const event = new Event('change', { bubbles: true });
            input.dispatchEvent(event);
        });
        
        // Touch feedback
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.9)';
        });
        
        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 300);
        });
    });
    
    // ===== DROPDOWN SELECT STYLING =====
    document.querySelectorAll('.size-select, .size-dropdown').forEach(select => {
        // Add custom styling if needed
        select.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        select.addEventListener('blur', function() {
            this.parentNode.classList.remove('focused');
        });
        
        // Mobile touch optimization
        select.addEventListener('touchstart', function() {
            this.style.backgroundColor = 'rgba(212, 160, 23, 0.05)';
        });
        
        select.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.backgroundColor = '';
            }, 300);
        });
    });
});