// ===== PRODUCTS PAGE JAVASCRIPT =====

// Shopping Cart System
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('amoneph-cart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('amoneph-wishlist')) || [];
        this.init();
    }

    init() {
        this.updateCartCount();
        this.setupEventListeners();
        this.loadWishlist();
        this.setupFilters();
        this.setupComparison();
    }

    updateCartCount() {
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelector('.cart-count').textContent = totalItems;
    }

    addToCart(productId, size, price, quantity = 1) {
        const existingItem = this.items.find(item => 
            item.productId === productId && item.size === size
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            const product = this.getProductDetails(productId);
            this.items.push({
                productId,
                name: product.name,
                size,
                price: parseInt(price),
                quantity,
                image: product.image
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.showNotification(`${productId} added to cart!`, 'success');
    }

    removeFromCart(productId, size) {
        this.items = this.items.filter(item => 
            !(item.productId === productId && item.size === size)
        );
        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
    }

    updateQuantity(productId, size, newQuantity) {
        const item = this.items.find(item => 
            item.productId === productId && item.size === size
        );
        
        if (item) {
            item.quantity = newQuantity;
            if (item.quantity <= 0) {
                this.removeFromCart(productId, size);
            } else {
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    getProductDetails(productId) {
        const products = {
            'honey': { name: 'Raw Kenyan Forest Honey', image: 'images/products/Honey.jpeg' },
            'peanut-butter': { name: 'Natural Peanut Butter', image: 'images/products/Peanut butter.jpeg' },
            'hibiscus': { name: 'Hibiscus Wellness Powder', image: 'images/products/Hibiscus.jpeg' },
            'castor-oil': { name: 'Cold-Pressed Castor Oil', image: 'images/products/Castor oil.jpeg' }
        };
        return products[productId] || { name: 'Product', image: '' };
    }

    saveCart() {
        localStorage.setItem('amoneph-cart', JSON.stringify(this.items));
    }

    calculateTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    // Wishlist functionality
    toggleWishlist(productId) {
        const index = this.wishlist.indexOf(productId);
        if (index > -1) {
            this.wishlist.splice(index, 1);
            this.showNotification('Removed from wishlist', 'info');
        } else {
            this.wishlist.push(productId);
            this.showNotification('Added to wishlist!', 'success');
        }
        localStorage.setItem('amoneph-wishlist', JSON.stringify(this.wishlist));
        this.updateWishlistIcons();
    }

    loadWishlist() {
        this.wishlist.forEach(productId => {
            const btn = document.querySelector(`.wishlist-btn[data-product="${productId}"]`);
            if (btn) {
                btn.classList.add('active');
                btn.innerHTML = '<i class="fas fa-heart"></i>';
            }
        });
    }

    updateWishlistIcons() {
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const productId = btn.dataset.product;
            if (this.wishlist.includes(productId)) {
                btn.classList.add('active');
                btn.innerHTML = '<i class="fas fa-heart"></i>';
            } else {
                btn.classList.remove('active');
                btn.innerHTML = '<i class="far fa-heart"></i>';
            }
        });
    }

    // Cart display
    updateCartDisplay() {
        const cartItems = document.getElementById('cart-items');
        const emptyCart = cartItems.querySelector('.empty-cart');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartGrandTotal = document.getElementById('cart-grand-total');
        const cartDelivery = document.getElementById('cart-delivery');

        if (this.items.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="#products" class="btn-shop-now">Shop Now</a>
                </div>
            `;
            cartSubtotal.textContent = 'KSh 0';
            cartDelivery.textContent = 'KSh 0';
            cartGrandTotal.textContent = 'KSh 0';
            return;
        }

        // Calculate delivery (free for orders above 2000)
        const subtotal = this.calculateTotal();
        const delivery = subtotal >= 2000 ? 0 : 200;
        const grandTotal = subtotal + delivery;

        cartItems.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-meta">
                        <span>${item.size}</span>
                        <span class="cart-item-price">KSh ${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                </div>
                <button class="cart-item-remove" 
                        onclick="cart.removeFromCart('${item.productId}', '${item.size}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        cartSubtotal.textContent = `KSh ${subtotal.toLocaleString()}`;
        cartDelivery.textContent = delivery === 0 ? 'FREE' : `KSh ${delivery}`;
        cartGrandTotal.textContent = `KSh ${grandTotal.toLocaleString()}`;
    }

    // Checkout via WhatsApp
    checkoutViaWhatsApp() {
        if (this.items.length === 0) {
            this.showNotification('Your cart is empty!', 'error');
            return;
        }

        const subtotal = this.calculateTotal();
        const delivery = subtotal >= 2000 ? 0 : 200;
        const grandTotal = subtotal + delivery;

        let message = `Hello Amoneph Botanicals! I'd like to place an order:\n\n`;
        message += `*ORDER SUMMARY*\n`;
        message += `================\n\n`;

        this.items.forEach((item, index) => {
            message += `${index + 1}. ${item.name}\n`;
            message += `   Size: ${item.size}\n`;
            message += `   Qty: ${item.quantity}\n`;
            message += `   Price: KSh ${(item.price * item.quantity).toLocaleString()}\n\n`;
        });

        message += `================\n`;
        message += `Subtotal: KSh ${subtotal.toLocaleString()}\n`;
        message += `Delivery: ${delivery === 0 ? 'FREE' : 'KSh ' + delivery}\n`;
        message += `*TOTAL: KSh ${grandTotal.toLocaleString()}*\n\n`;
        message += `Please let me know the next steps!`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/254768427602?text=${encodedMessage}`, '_blank');
    }

    // Buy Now functionality
    buyNow(productId, size, price, quantity = 1) {
        this.addToCart(productId, size, price, quantity);
        this.openCart();
    }

    openCart() {
        document.getElementById('cart-sidebar').classList.add('active');
        document.getElementById('cart-overlay').classList.add('active');
        this.updateCartDisplay();
    }

    closeCart() {
        document.getElementById('cart-sidebar').classList.remove('active');
        document.getElementById('cart-overlay').classList.remove('active');
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Setup event listeners
    setupEventListeners() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-add-to-cart')) {
                const button = e.target.closest('.btn-add-to-cart');
                const productId = button.dataset.product;
                const productCard = button.closest('.product-card');
                const activeSize = productCard.querySelector('.size-option.active');
                
                if (!activeSize) {
                    this.showNotification('Please select a size first', 'error');
                    return;
                }
                
                const size = activeSize.dataset.size;
                const price = activeSize.dataset.price;
                const quantity = parseInt(productCard.querySelector('.qty-input').value) || 1;
                
                this.addToCart(productId, size, price, quantity);
            }

            // Buy Now buttons
            if (e.target.closest('.btn-buy-now')) {
                const button = e.target.closest('.btn-buy-now');
                const productId = button.dataset.product;
                const productCard = button.closest('.product-card');
                const activeSize = productCard.querySelector('.size-option.active');
                
                if (!activeSize) {
                    this.showNotification('Please select a size first', 'error');
                    return;
                }
                
                const size = activeSize.dataset.size;
                const price = activeSize.dataset.price;
                const quantity = parseInt(productCard.querySelector('.qty-input').value) || 1;
                
                this.buyNow(productId, size, price, quantity);
            }

            // Wishlist buttons
            if (e.target.closest('.wishlist-btn')) {
                const button = e.target.closest('.wishlist-btn');
                const productId = button.dataset.product;
                this.toggleWishlist(productId);
            }

            // Size selection
            if (e.target.closest('.size-option')) {
                const sizeOption = e.target.closest('.size-option');
                const sizeOptions = sizeOption.closest('.sizes').querySelectorAll('.size-option');
                sizeOptions.forEach(opt => opt.classList.remove('active'));
                sizeOption.classList.add('active');
                
                // Update price display
                const price = sizeOption.dataset.price;
                const productCard = sizeOption.closest('.product-card');
                const priceDisplay = productCard.querySelector('.current-price');
                priceDisplay.textContent = `From KSh ${parseInt(price).toLocaleString()}`;
            }

            // Quantity controls
            if (e.target.closest('.qty-btn')) {
                const button = e.target.closest('.qty-btn');
                const isMinus = button.classList.contains('minus');
                const qtyInput = button.closest('.quantity-selector').querySelector('.qty-input');
                let currentValue = parseInt(qtyInput.value) || 1;
                
                if (isMinus && currentValue > 1) {
                    qtyInput.value = currentValue - 1;
                } else if (!isMinus && currentValue < 20) {
                    qtyInput.value = currentValue + 1;
                }
            }

            // Cart toggle
            if (e.target.closest('#cart-toggle')) {
                e.preventDefault();
                this.openCart();
            }

            // Cart close
            if (e.target.closest('#cart-close') || e.target.closest('#cart-overlay')) {
                this.closeCart();
            }

            // WhatsApp checkout
            if (e.target.closest('#whatsapp-checkout')) {
                this.checkoutViaWhatsApp();
            }

            // Quick view
            if (e.target.closest('.quick-view-btn')) {
                const button = e.target.closest('.quick-view-btn');
                const productId = button.dataset.product;
                this.showQuickView(productId);
            }

            // Quick view close
            if (e.target.closest('#modal-close') || e.target.closest('#modal-overlay')) {
                this.closeQuickView();
            }
        });

        // Quantity input change
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('qty-input')) {
                let value = parseInt(e.target.value);
                if (isNaN(value) || value < 1) e.target.value = 1;
                if (value > 20) e.target.value = 20;
            }
        });
    }

    // Quick View Modal
    showQuickView(productId) {
        const productDetails = this.getProductDetails(productId);
        const modalBody = document.getElementById('modal-body');
        
        // In a real implementation, you would fetch detailed product info
        modalBody.innerHTML = `
            <div class="quick-view-content">
                <div class="quick-view-grid">
                    <div class="quick-view-image">
                        <img src="${productDetails.image}" alt="${productDetails.name}">
                    </div>
                    <div class="quick-view-info">
                        <h2>${productDetails.name}</h2>
                        <div class="product-rating">
                            <div class="stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half-alt"></i>
                            </div>
                            <span class="rating-text">4.7 (128 reviews)</span>
                        </div>
                        <p class="product-description">Detailed description of the product would go here with all specifications and detailed benefits.</p>
                        
                        <div class="quick-view-actions">
                            <div class="quantity-selector">
                                <button class="qty-btn minus">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <input type="number" class="qty-input" value="1" min="1" max="20">
                                <button class="qty-btn plus">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <button class="btn-add-to-cart" data-product="${productId}">
                                <i class="fas fa-cart-plus"></i> Add to Cart
                            </button>
                            <button class="btn-buy-now" data-product="${productId}">
                                <i class="fas fa-bolt"></i> Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('quick-view-modal').classList.add('active');
    }

    closeQuickView() {
        document.getElementById('quick-view-modal').classList.remove('active');
    }

    // Product filtering and sorting
    setupFilters() {
        const categoryFilters = document.querySelectorAll('.category-filter');
        const priceSlider = document.getElementById('price-slider');
        const benefitCheckboxes = document.querySelectorAll('.benefits-filter input');
        const sortSelect = document.getElementById('sort-products');
        const clearFiltersBtn = document.getElementById('clear-filters');

        // Category filter
        categoryFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                categoryFilters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
                this.filterProducts();
            });
        });

        // Price filter
        priceSlider.addEventListener('input', () => {
            document.getElementById('min-price').textContent = `KSh ${priceSlider.value}`;
            this.filterProducts();
        });

        // Benefit filter
        benefitCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.filterProducts());
        });

        // Sort
        sortSelect.addEventListener('change', () => this.sortProducts());

        // Clear filters
        clearFiltersBtn.addEventListener('click', () => this.clearFilters());
    }

    filterProducts() {
        const activeCategory = document.querySelector('.category-filter.active').dataset.category;
        const maxPrice = parseInt(document.getElementById('price-slider').value);
        const selectedBenefits = Array.from(document.querySelectorAll('.benefits-filter input:checked'))
                                     .map(cb => cb.value);

        document.querySelectorAll('.product-card').forEach(card => {
            const category = card.dataset.category;
            const price = parseInt(card.dataset.price);
            const benefits = card.dataset.benefits ? card.dataset.benefits.split(',') : [];

            let visible = true;

            // Category filter
            if (activeCategory !== 'all' && category !== activeCategory) {
                visible = false;
            }

            // Price filter
            if (price > maxPrice) {
                visible = false;
            }

            // Benefits filter
            if (selectedBenefits.length > 0) {
                const hasSelectedBenefit = selectedBenefits.some(benefit => 
                    benefits.includes(benefit)
                );
                if (!hasSelectedBenefit) visible = false;
            }

            card.style.display = visible ? 'block' : 'none';
        });

        this.updateProductsCount();
    }

    sortProducts() {
        const sortBy = document.getElementById('sort-products').value;
        const container = document.getElementById('products-container');
        const products = Array.from(container.children);

        products.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return parseInt(a.dataset.price) - parseInt(b.dataset.price);
                case 'price-high':
                    return parseInt(b.dataset.price) - parseInt(a.dataset.price);
                case 'rating':
                    return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
                case 'name':
                    return a.querySelector('.product-title').textContent.localeCompare(
                        b.querySelector('.product-title').textContent
                    );
                default:
                    return 0;
            }
        });

        products.forEach(product => container.appendChild(product));
    }

    clearFilters() {
        document.querySelectorAll('.category-filter').forEach(f => {
            f.classList.remove('active');
            if (f.dataset.category === 'all') f.classList.add('active');
        });
        
        document.getElementById('price-slider').value = 2000;
        document.getElementById('min-price').textContent = 'KSh 250';
        
        document.querySelectorAll('.benefits-filter input').forEach(cb => cb.checked = false);
        document.getElementById('sort-products').value = 'featured';
        
        this.filterProducts();
    }

    updateProductsCount() {
        const visibleCount = document.querySelectorAll('.product-card[style*="block"]').length;
        document.getElementById('products-count').textContent = `${visibleCount} Premium Products`;
    }

    // Product comparison tool
    setupComparison() {
        const comparisonSlots = document.querySelectorAll('.comparison-slot');
        const clearComparisonBtn = document.getElementById('clear-comparison');

        comparisonSlots.forEach(slot => {
            slot.addEventListener('click', () => {
                if (slot.querySelector('.product-comparison')) return;
                this.openProductSelector(slot);
            });
        });

        clearComparisonBtn.addEventListener('click', () => {
            document.querySelectorAll('.comparison-slot').forEach(slot => {
                slot.innerHTML = `
                    <div class="slot-placeholder">
                        <i class="fas fa-plus"></i>
                        <span>Add Product</span>
                    </div>
                `;
            });
            document.getElementById('comparison-results').classList.remove('active');
        });
    }

    openProductSelector(slot) {
        // In a real implementation, this would open a product selection modal
        const productSelector = document.createElement('div');
        productSelector.className = 'product-selector';
        productSelector.innerHTML = `
            <h4>Select a product to compare</h4>
            <div class="product-options">
                <button class="product-option" data-id="honey">
                    <img src="images/products/Honey.jpeg" alt="Honey">
                    <span>Honey</span>
                </button>
                <button class="product-option" data-id="peanut-butter">
                    <img src="images/products/Peanut butter.jpeg" alt="Peanut Butter">
                    <span>Peanut Butter</span>
                </button>
                <button class="product-option" data-id="hibiscus">
                    <img src="images/products/Hibiscus.jpeg" alt="Hibiscus">
                    <span>Hibiscus</span>
                </button>
                <button class="product-option" data-id="castor-oil">
                    <img src="images/products/Castor oil.jpeg" alt="Castor Oil">
                    <span>Castor Oil</span>
                </button>
            </div>
        `;
        
        slot.appendChild(productSelector);
        
        productSelector.querySelectorAll('.product-option').forEach(option => {
            option.addEventListener('click', () => {
                const productId = option.dataset.id;
                this.addToComparison(slot, productId);
                productSelector.remove();
            });
        });
    }

    addToComparison(slot, productId) {
        const productDetails = this.getProductDetails(productId);
        slot.innerHTML = `
            <div class="product-comparison" data-product="${productId}">
                <div class="comparison-product-image">
                    <img src="${productDetails.image}" alt="${productDetails.name}">
                    <button class="remove-comparison">&times;</button>
                </div>
                <h4>${productDetails.name}</h4>
                <div class="comparison-stats">
                    <div class="stat"><span>Price:</span> <strong>From KSh 450</strong></div>
                    <div class="stat"><span>Rating:</span> <strong>4.7 ★</strong></div>
                </div>
            </div>
        `;
        
        slot.querySelector('.remove-comparison').addEventListener('click', (e) => {
            e.stopPropagation();
            slot.innerHTML = `
                <div class="slot-placeholder">
                    <i class="fas fa-plus"></i>
                    <span>Add Product</span>
                </div>
            `;
            this.updateComparisonResults();
        });
        
        this.updateComparisonResults();
    }

    updateComparisonResults() {
        const comparisonProducts = document.querySelectorAll('.product-comparison');
        const resultsContainer = document.getElementById('comparison-results');
        
        if (comparisonProducts.length >= 2) {
            resultsContainer.innerHTML = `
                <h4>Comparison Results</h4>
                <div class="comparison-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Feature</th>
                                ${Array.from(comparisonProducts).map(p => 
                                    `<th>${p.querySelector('h4').textContent}</th>`
                                ).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Price Range</td>
                                ${Array.from(comparisonProducts).map(() => 
                                    `<td>KSh 450 - 1,600</td>`
                                ).join('')}
                            </tr>
                            <tr>
                                <td>Best For</td>
                                ${Array.from(comparisonProducts).map(() => 
                                    `<td>Immunity, Energy</td>`
                                ).join('')}
                            </tr>
                            <tr>
                                <td>Shelf Life</td>
                                ${Array.from(comparisonProducts).map(() => 
                                    `<td>12 months</td>`
                                ).join('')}
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
            resultsContainer.classList.add('active');
        } else {
            resultsContainer.classList.remove('active');
        }
    }

    // Bulk order discount calculator
    setupBulkDiscount() {
        const calculateBtn = document.getElementById('calculate-discount');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                const quantity = parseInt(document.getElementById('bulk-quantity').value) || 1;
                let discount = 0;
                let discountText = '';
                
                if (quantity >= 10) {
                    discount = 20;
                    discountText = `You get 20% off on ${quantity} items!`;
                } else if (quantity >= 5) {
                    discount = 10;
                    discountText = `You get 10% off on ${quantity} items!`;
                } else {
                    discountText = `Order 5+ items to get 10% discount, 10+ for 20%`;
                }
                
                document.getElementById('discount-result').innerHTML = `
                    <div class="discount-amount">${discountText}</div>
                    <div class="discount-savings">Save up to KSh ${(quantity * 450 * (discount/100)).toLocaleString()}</div>
                `;
            });
        }
    }

    // View toggle (grid/list)
    setupViewToggle() {
        const viewButtons = document.querySelectorAll('.view-btn');
        const productsGrid = document.getElementById('products-container');
        
        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                viewButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                if (button.dataset.view === 'list') {
                    productsGrid.classList.add('list-view');
                } else {
                    productsGrid.classList.remove('list-view');
                }
            });
        });
    }

    // FAQ toggle
    setupFAQ() {
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const item = question.closest('.faq-item');
                item.classList.toggle('active');
            });
        });
    }

    // Load more products (simulated)
    setupLoadMore() {
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                
                // Simulate API call
                setTimeout(() => {
                    // In a real implementation, this would load more products from an API
                    loadMoreBtn.innerHTML = '<i class="fas fa-check"></i> No more products';
                    loadMoreBtn.disabled = true;
                    this.showNotification('All products loaded!', 'info');
                }, 1500);
            });
        }
    }

    // Delivery calculator
    setupDeliveryCalculator() {
        // This would be integrated with a location API
        // For now, it's a simple implementation
        const deliveryOptions = {
            'nairobi': 0,
            'kiambu': 200,
            'nakuru': 300,
            'kakamega': 350
        };
        
        // You could add a delivery calculator form here
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize shopping cart
    window.cart = new ShoppingCart();
    
    // Update current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Setup remaining functionality
    cart.setupBulkDiscount();
    cart.setupViewToggle();
    cart.setupFAQ();
    cart.setupLoadMore();
    cart.setupDeliveryCalculator();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Initialize all product quantity inputs
    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) this.value = 1;
            if (value > 20) this.value = 20;
        });
    });
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border-left: 4px solid #3498db;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-success {
            border-left-color: #27ae60;
        }
        
        .notification-error {
            border-left-color: #e74c3c;
        }
        
        .notification-info {
            border-left-color: #3498db;
        }
        
        .notification i {
            font-size: 1.2rem;
        }
        
        .notification-success i { color: #27ae60; }
        .notification-error i { color: #e74c3c; }
        .notification-info i { color: #3498db; }
        
        .notification span {
            font-weight: 500;
            color: #333;
        }
    `;
    document.head.appendChild(style);
});