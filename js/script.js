// --- Order of functionalities
// 1. loader
// 2. theme (Dark Mode) toggle
// 3. navigation (hamburger, Active page highlight)
// 4. booking count (header notification)
// 5. search overlay
// 6. quick view modal
// 7. booking list management 
// 8. product details page
// 9. promotional carousel
// 10. 404 page search trigger
// 11. form validation


document.addEventListener('DOMContentLoaded', () => {
    // --- Loader Hide (always first for UX) ---
    window.addEventListener('load', function() {
        const loader = document.getElementById('siteLoader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 400);
        }
    });

    // --- Global DOM References ---
    const darkModeToggle = document.getElementById('darkModeToggle');
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    const bookingCountSpan = document.getElementById('bookingCount');

    // --- Search Functionality References ---
    const searchToggle = document.getElementById('searchToggleFloat');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const closeSearchBtn = document.getElementById('closeSearch');
    const searchResultsDiv = document.getElementById('searchResults');
    const noSearchResultsMessage = searchResultsDiv ? searchResultsDiv.querySelector('.empty-message') : null;

    // --- Quick View Modal References ---
    const quickViewModal = document.getElementById('quickViewModal');
    const quickViewContent = document.getElementById('quickViewContent');
    const closeQuickView = document.getElementById('closeQuickView');

    // --- Booking Page References ---
    const bookingList = document.getElementById('bookingList');
    const emptyBookingsMessage = document.getElementById('emptyBookingsMessage');
    const bookingSummary = document.getElementById('bookingSummary');
    const totalItemsSpan = document.getElementById('totalItems');
    const overallTotalSpan = document.getElementById('overallTotal');
    const clearBookingsBtn = document.getElementById('clearBookingsBtn');
    const consolidatedBookingForm = document.getElementById('consolidatedBookingForm');
    const bookedItemsDataInput = document.getElementById('bookedItemsData');
    const overallTotalDataInput = document.getElementById('overallTotalData');
    const thankYouMessage = document.getElementById('thankYouMessage');

    // --- Product Details Page References ---
    const productDetailContainer = document.getElementById('productDetailContainer');
    const noProductMessage = document.getElementById('noProductMessage');
    const similarProductsGrid = document.getElementById('similarProductsGrid');
    const noSimilarProductsMessage = document.getElementById('noSimilarProductsMessage');
    let currentProduct = null;

    // --- Promotional Carousel References ---
    const promoCarousel = document.getElementById('promoCarousel');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let slides = [];
    let dots = [];
    let currentSlideIndex = 0;
    let autoSlideInterval;
    const slideIntervalTime = 5000;

    // --- 1. Theme (Dark Mode) Toggle ---
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.body.classList.add(currentTheme);
        if (darkModeToggle) {
            const icon = darkModeToggle.querySelector('i');
            icon.classList.replace(
                currentTheme === 'dark-mode' ? 'fa-moon' : 'fa-sun',
                currentTheme === 'dark-mode' ? 'fa-sun' : 'fa-moon'
            );
        }
    }
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            let theme = 'light-mode';
            const icon = darkModeToggle.querySelector('i');
            if (document.body.classList.contains('dark-mode')) {
                theme = 'dark-mode';
                icon.classList.replace('fa-moon', 'fa-sun');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
            }
            localStorage.setItem('theme', theme);
        });
    }

    // --- 2. Navigation (Hamburger, Active Link Highlight) ---
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Close search overlay if open
            if (navLinks.classList.contains('active') && searchOverlay && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
                if (searchInput) searchInput.value = '';
                if (searchResultsDiv) searchResultsDiv.innerHTML = '<p class="empty-message" style="display:none;">No results found.</p>';
            }
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
    // Highlight active nav link
    const navLink = document.querySelectorAll('.nav-links a');
    const currentPage = window.location.pathname.split('/').pop();
    navLink.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // --- 3. Booking Count (for header/cart icon) ---
    function getBookings() {
        const bookings = localStorage.getItem('mumuFashionsBookings');
        return bookings ? JSON.parse(bookings) : [];
    }
    function updateBookingCount() {
        const bookings = getBookings();
        if (bookingCountSpan) {
            bookingCountSpan.textContent = bookings.length;
        }
    }
    updateBookingCount();

    // --- 4. Search Overlay (site-wide) ---
    function initializeSearch() {
        if (!searchToggle || !searchOverlay || !searchInput || !closeSearchBtn || !searchResultsDiv || !noSearchResultsMessage) return;
        searchToggle.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            searchInput.focus();
            if (navLinks && navLinks.classList.contains('active')) navLinks.classList.remove('active');
        });
        closeSearchBtn.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
            searchInput.value = '';
            searchResultsDiv.innerHTML = '<p class="empty-message" style="display:none;">No results found.</p>';
        });
        searchOverlay.addEventListener('click', (event) => {
            if (event.target === searchOverlay) {
                searchOverlay.classList.remove('active');
                searchInput.value = '';
                searchResultsDiv.innerHTML = '<p class="empty-message" style="display:none;">No results found.</p>';
            }
        });
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();
            displaySearchResults(query);
        });
    }
    function displaySearchResults(query) {
        searchResultsDiv.innerHTML = '';
        if (query.length < 2) {
            noSearchResultsMessage.style.display = 'none';
            return;
        }
        const filteredProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );
        if (filteredProducts.length === 0) {
            noSearchResultsMessage.style.display = 'block';
            searchResultsDiv.appendChild(noSearchResultsMessage);
            return;
        } else {
            noSearchResultsMessage.style.display = 'none';
        }
        filteredProducts.forEach(product => {
            const resultItem = document.createElement('a');
            resultItem.href = `product-details.html?id=${product.id}`;
            resultItem.classList.add('search-result-item');
            resultItem.innerHTML = `
                <img src="${product.images[0]}" alt="${product.name}">
                <div class="search-result-item-info">
                    <h4>${product.name}</h4>
                    <p>${product.category.charAt(0).toUpperCase() + product.category.slice(1)} - $${product.price.toFixed(2)}</p>
                </div>
                <button class="btn">View</button>
            `;
            searchResultsDiv.appendChild(resultItem);
        });
    }
    initializeSearch();

    // --- 5. Quick View Modal (for product grids) ---
    function getProductDataById(productId) {
        if (typeof allProducts !== "undefined") {
            return allProducts.find(p => p.id === productId);
        }
        const productDiv = document.querySelector(`.product-item[data-product-id="${productId}"]`);
        if (!productDiv) return null;
        return {
            id: productId,
            name: productDiv.querySelector('h3').textContent,
            price: productDiv.querySelector('.price').textContent,
            images: [productDiv.querySelector('img').src],
            description: "No description available."
        };
    }
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productDiv = btn.closest('.product-item');
            const productId = productDiv.getAttribute('data-product-id');
            const product = getProductDataById(productId);
            if (!product) return;
            quickViewContent.innerHTML = `
                <span class="close-button" id="closeQuickView">&times;</span>
                <div class="quick-view-gallery">
                    <img src="${product.images[0]}" alt="${product.name}" class="quick-view-main-img" id="quickViewMainImg">
                </div>
                <h3>${product.name}</h3>
                <p class="price">${product.price} BIF</p>
                <p>${product.description || ''}</p>
            `;
            quickViewModal.style.display = 'flex';
            document.getElementById('closeQuickView').onclick = function() {
                quickViewModal.style.display = 'none';
            };
            const mainImg = document.getElementById('quickViewMainImg');
            mainImg.onclick = function() {
                if (mainImg.style.transform === "scale(2)") {
                    mainImg.style.transform = "scale(1)";
                    mainImg.style.cursor = "zoom-in";
                } else {
                    mainImg.style.transform = "scale(2)";
                    mainImg.style.cursor = "zoom-out";
                }
            };
            mainImg.style.transition = "transform 0.3s";
            mainImg.style.cursor = "zoom-in";
        });
    });
    if (quickViewModal) {
        quickViewModal.onclick = function(e) {
            if (e.target === quickViewModal) {
                quickViewModal.style.display = 'none';
            }
        };
    }

    // --- 6. Booking List Management (for booking page) ---
    function saveBookings(bookings) {
        localStorage.setItem('mumuFashionsBookings', JSON.stringify(bookings));
        updateBookingCount();
    }
    function addToBooking(productName, productPrice, productId, selectedSize, quantity) {
        const bookings = getBookings();
        const itemIdentifier = `${productId}-${selectedSize}`;
        const existingItemIndex = bookings.findIndex(item => item.identifier === itemIdentifier);
        if (existingItemIndex > -1) {
            const existingItem = bookings[existingItemIndex];
            existingItem.quantity += quantity;
            existingItem.price = (parseFloat(existingItem.originalPrice) * existingItem.quantity).toFixed(2);
        } else {
            bookings.push({
                identifier: itemIdentifier,
                id: productId,
                name: productName,
                originalPrice: parseFloat(productPrice).toFixed(2),
                price: (parseFloat(productPrice) * quantity).toFixed(2),
                quantity: quantity,
                size: selectedSize
            });
        }
        saveBookings(bookings);
        alert(`${quantity} x ${productName} (Size: ${selectedSize}) added to your booking list!`);
    }
    function removeBookingItem(itemIdentifier) {
        let bookings = getBookings();
        bookings = bookings.filter(item => item.identifier !== itemIdentifier);
        saveBookings(bookings);
        displayBookings();
    }
    function clearAllBookings() {
        if (confirm('Are you sure you want to clear all your booked items?')) {
            localStorage.removeItem('mumuFashionsBookings');
            updateBookingCount();
            displayBookings();
            alert('All bookings cleared!');
        }
    }
    function displayBookings() {
        if (!bookingList || !emptyBookingsMessage || !totalItemsSpan || !overallTotalSpan || !bookingSummary || !consolidatedBookingForm) return;
        const bookings = getBookings();
        bookingList.innerHTML = '';
        let totalItems = 0;
        let overallTotalPrice = 0;
        if (bookings.length === 0) {
            emptyBookingsMessage.style.display = 'block';
            bookingSummary.style.display = 'none';
            consolidatedBookingForm.style.display = 'none';
        } else {
            emptyBookingsMessage.style.display = 'none';
            bookingSummary.style.display = 'block';
            consolidatedBookingForm.style.display = 'flex';
            bookings.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('booking-item');
                itemDiv.innerHTML = `
                    <div class="booking-item-details">
                        <h4>${item.name} (Size: ${item.size})</h4>
                        <p>Quantity: ${item.quantity} | Price: ${item.price} BIF</p>
                    </div>
                    <button class="remove-btn" data-identifier="${item.identifier}">Remove</button>
                `;
                bookingList.appendChild(itemDiv);
                totalItems += item.quantity;
                overallTotalPrice += parseFloat(item.price);
            });
            bookingList.querySelectorAll('.remove-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const itemIdentifier = event.target.dataset.identifier;
                    removeBookingItem(itemIdentifier);
                });
            });
        }
        totalItemsSpan.textContent = totalItems;
        overallTotalSpan.textContent = `${overallTotalPrice.toFixed(2)} BIF`;
        if (bookedItemsDataInput) {
            bookedItemsDataInput.value = JSON.stringify(bookings.map(item => ({
                productName: item.name,
                productId: item.id,
                size: item.size,
                quantity: item.quantity,
                pricePerUnit: item.originalPrice,
                totalPrice: item.price
            })));
        }
        if (overallTotalDataInput) {
            overallTotalDataInput.value = overallTotalPrice.toFixed(2);
        }
    }
    if (bookingList) {
        displayBookings();
        if (clearBookingsBtn) clearBookingsBtn.addEventListener('click', clearAllBookings);
        if (consolidatedBookingForm) {
            consolidatedBookingForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const bookings = getBookings();
                if (bookings.length === 0) {
                    alert('Your booking list is empty. Please add items before confirming.');
                    return;
                }
                if (bookedItemsDataInput) {
                    bookedItemsDataInput.value = bookings.map(item =>
                        `${item.name} (Size: ${item.size}) - Qty: ${item.quantity}, Price per unit: ${item.originalPrice} BIF, Total: ${item.price} BIF`
                    ).join('\n');
                }
                if (overallTotalDataInput) {
                    const overallTotal = bookings.reduce((sum, item) => sum + parseFloat(item.price), 0);
                    overallTotalDataInput.value = `${overallTotal.toFixed(2)} BIF`;
                }
                const form = event.target;
                const formData = new FormData(form);
                try {
                    const response = await fetch(form.action, {
                        method: form.method,
                        body: formData,
                        headers: { 'Accept': 'application/json' }
                    });
                    if (response.ok) {
                        if (consolidatedBookingForm) consolidatedBookingForm.style.display = 'none';
                        if (thankYouMessage) {
                            thankYouMessage.textContent = 'Your consolidated booking has been sent! We will confirm availability and payment details shortly.';
                            thankYouMessage.style.color = '#28a745';
                            thankYouMessage.style.display = 'block';
                        }
                        localStorage.removeItem('mumuFashionsBookings');
                        updateBookingCount();
                        displayBookings();
                        setTimeout(() => {
                            if (thankYouMessage) thankYouMessage.style.display = 'none';
                            if (consolidatedBookingForm) consolidatedBookingForm.style.display = 'flex';
                        }, 8000);
                    } else {
                        const data = await response.json();
                        if (data.errors) {
                            alert('Booking failed: ' + data.errors.map(error => error.message).join(', '));
                        } else {
                            alert('An error occurred during booking. Please try again.');
                        }
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Could not submit booking. Please check your internet connection.');
                }
            });
        }
    }

    // --- 7. Product Details Page (for product-details.html) ---
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
    function loadProductDetails() {
        if (!productDetailContainer || !noProductMessage || !similarProductsGrid || !noSimilarProductsMessage) return;
        const productId = getUrlParameter('id');
        const product = allProducts.find(p => p.id === productId);
        if (product) {
            currentProduct = product;
            productDetailContainer.style.display = 'flex';
            noProductMessage.style.display = 'none';
            productDetailContainer.innerHTML = `
                <div class="product-image-gallery">
                    <img src="${product.images[0]}" alt="${product.name}" class="main-product-image" id="mainProductImage">
                    <div class="thumbnail-gallery" id="thumbnailGallery">
                        ${product.images.map((imgSrc, index) => `
                            <img src="${imgSrc}" alt="${product.name} thumbnail ${index + 1}"
                                 class="thumbnail ${index === 0 ? 'active-thumbnail' : ''}" data-full-img="${imgSrc}">
                        `).join('')}
                    </div>
                </div>
                <div class="product-info">
                    <h1>${product.name}</h1>
                    <p class="price">${product.price.toFixed(2)} BIF</p>
                    <h4>Description</h4>
                    <p>${product.description}</p>
                    <h4>Details</h4>
                    <p><strong>Fabric:</strong> ${product.fabric}</p>
                    <p><strong>Care Instructions:</strong> ${product.care}</p>
                    <div class="product-options">
                        <div class="product-option-group">
                            <label for="productSize">Select Size:</label>
                            <select id="productSize">
                                ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                            </select>
                        </div>
                        <div class="product-option-group">
                            <label for="productQuantity">Quantity:</label>
                            <input type="number" id="productQuantity" value="1" min="1" max="10">
                        </div>
                    </div>
                    <button class="add-to-booking-btn" id="addToBookingBtn">Add to Booking</button>
                </div>
            `;
            const mainProductImage = document.getElementById('mainProductImage');
            const thumbnails = document.querySelectorAll('.thumbnail');
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', () => {
                    mainProductImage.src = thumb.dataset.fullImg;
                    thumbnails.forEach(t => t.classList.remove('active-thumbnail'));
                    thumb.classList.add('active-thumbnail');
                });
            });
            mainProductImage.onclick = function() {
                if (mainProductImage.style.transform === "scale(2)") {
                    mainProductImage.style.transform = "scale(1)";
                    mainProductImage.style.cursor = "zoom-in";
                } else {
                    mainProductImage.style.transform = "scale(2)";
                    mainProductImage.style.cursor = "zoom-out";
                }
            };
            mainProductImage.style.transition = "transform 0.3s";
            mainProductImage.style.cursor = "zoom-in";
            const addToBookingBtn = document.getElementById('addToBookingBtn');
            if (addToBookingBtn) {
                addToBookingBtn.addEventListener('click', () => {
                    const selectedSize = document.getElementById('productSize').value;
                    const quantity = parseInt(document.getElementById('productQuantity').value, 10);
                    if (!selectedSize || quantity < 1) {
                        alert('Please select a size and valid quantity.');
                        return;
                    }
                    addToBooking(product.name, product.price, product.id, selectedSize, quantity);
                });
            }
            loadSimilarProducts(product.similarProducts);
        } else {
            productDetailContainer.style.display = 'none';
            noProductMessage.style.display = 'block';
            similarProductsGrid.innerHTML = '';
            noSimilarProductsMessage.style.display = 'none';
        }
    }
    function loadSimilarProducts(similarProductIds) {
        if (!similarProductsGrid || !noSimilarProductsMessage) return;
        similarProductsGrid.innerHTML = '';
        const actualSimilarProducts = allProducts.filter(p => similarProductIds.includes(p.id));
        if (actualSimilarProducts.length === 0) {
            noSimilarProductsMessage.style.display = 'block';
            return;
        } else {
            noSimilarProductsMessage.style.display = 'none';
        }
        actualSimilarProducts.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <img src="${product.images[0]}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">${product.price.toFixed(2)} BIF</p>
                <a href="product-details.html?id=${product.id}" class="btn view-details-btn">View Details</a>
            `;
            similarProductsGrid.appendChild(productItem);
        });
    }
    if (productDetailContainer) loadProductDetails();

    // --- 8. Promotional Carousel (for homepage) ---
    function initializeCarousel() {
        if (!promoCarousel || !prevBtn || !nextBtn || !dotsContainer) return;
        slides = Array.from(promoCarousel.querySelectorAll('.carousel-slide'));
        dots = Array.from(document.querySelectorAll('.carousel-dots .dot'));
        if (slides.length === 0) return;
        function showSlide(index) {
            if (index >= slides.length) currentSlideIndex = 0;
            else if (index < 0) currentSlideIndex = slides.length - 1;
            else currentSlideIndex = index;
            const offset = -currentSlideIndex * 100;
            promoCarousel.style.transform = `translateX(${offset}%)`;
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlideIndex);
            });
        }
        function nextSlide() { showSlide(currentSlideIndex + 1); }
        function prevSlide() { showSlide(currentSlideIndex - 1); }
        prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
        nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => { showSlide(index); resetAutoSlide(); });
        });
        function startAutoSlide() {
            stopAutoSlide();
            autoSlideInterval = setInterval(nextSlide, slideIntervalTime);
        }
        function stopAutoSlide() { clearInterval(autoSlideInterval); }
        function resetAutoSlide() { stopAutoSlide(); startAutoSlide(); }
        showSlide(currentSlideIndex);
        startAutoSlide();
    }
    initializeCarousel();

    // --- 9. 404 Page Search Trigger ---
    const triggerSearchBtn = document.getElementById('triggerSearch');
    if (triggerSearchBtn && searchOverlay && searchInput) {
        triggerSearchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            searchInput.focus();
            if (navLinks && navLinks.classList.contains('active')) navLinks.classList.remove('active');
        });
    }

    // --- 10. Form Validation (for booking form) ---
    if (consolidatedBookingForm) {
        const nameInput = document.getElementById('customerName');
        const emailInput = document.getElementById('customerEmail');
        const phoneInput = document.getElementById('customerPhone');
        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const phoneError = document.getElementById('phoneError');
        function validateName() {
            if (!nameInput.value.trim()) {
                nameError.textContent = "Name is required.";
                return false;
            }
            nameError.textContent = "";
            return true;
        }
        function validateEmail() {
            const email = emailInput.value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email) {
                emailError.textContent = "Email is required.";
                return false;
            }
            if (!emailPattern.test(email)) {
                emailError.textContent = "Please enter a valid email address.";
                return false;
            }
            emailError.textContent = "";
            return true;
        }
        function validatePhone() {
            const phone = phoneInput.value.trim();
            if (phone && !/^\+?\d{7,15}$/.test(phone)) {
                phoneError.textContent = "Please enter a valid phone number.";
                return false;
            }
            phoneError.textContent = "";
            return true;
        }
        nameInput.addEventListener('input', validateName);
        emailInput.addEventListener('input', validateEmail);
        phoneInput.addEventListener('input', validatePhone);
        consolidatedBookingForm.addEventListener('submit', function(event) {
            let valid = true;
            if (!validateName()) valid = false;
            if (!validateEmail()) valid = false;
            if (!validatePhone()) valid = false;
            if (!valid) event.preventDefault();
        });
    }
});