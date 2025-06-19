// NOTE: Ensure products.js is loaded BEFORE script.js in your HTML!
// Example:
// <script src="products.js"></script>
// <script src="script.js"></script>

document.addEventListener('DOMContentLoaded', () => {
    // --- Global DOM References ---
    const darkModeToggle = document.getElementById('darkModeToggle');
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    const bookingCountSpan = document.getElementById('bookingCount'); // Expected on all pages

    // --- References for Booking Page (conditionally available) ---
    const bookingList = document.getElementById('bookingList');
    const emptyBookingsMessage = document.getElementById('emptyBookingsMessage');
    const bookingSummary = document.getElementById('bookingSummary'); // Assuming you have this div
    const totalItemsSpan = document.getElementById('totalItems');
    const overallTotalSpan = document.getElementById('overallTotal');
    const clearBookingsBtn = document.getElementById('clearBookingsBtn');
    const consolidatedBookingForm = document.getElementById('consolidatedBookingForm');
    const bookedItemsDataInput = document.getElementById('bookedItemsData');
    const overallTotalDataInput = document.getElementById('overallTotalData');
    const thankYouMessage = document.getElementById('thankYouMessage');

    // --- Product Details Page References (conditionally available) ---
    const productDetailContainer = document.getElementById('productDetailContainer');
    const noProductMessage = document.getElementById('noProductMessage');
    const similarProductsGrid = document.getElementById('similarProductsGrid');
    const noSimilarProductsMessage = document.getElementById('noSimilarProductsMessage');
    let currentProduct = null;

    // --- Promotional Carousel References (conditionally available on index.html) ---
    const promoCarousel = document.getElementById('promoCarousel');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let slides = [];
    let dots = [];
    let currentSlideIndex = 0;
    let autoSlideInterval;
    const slideIntervalTime = 5000; // 5 seconds

    // --- Search Functionality References (MODIFIED - uses new floating button ID) ---
    const searchToggle = document.getElementById('searchToggleFloat'); // UPDATED ID
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const closeSearchBtn = document.getElementById('closeSearch');
    const searchResultsDiv = document.getElementById('searchResults');
    const noSearchResultsMessage = searchResultsDiv ? searchResultsDiv.querySelector('.empty-message') : null;


    // --- Dark Mode Toggle Functionality ---
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.body.classList.add(currentTheme);
        if (currentTheme === 'dark-mode') {
            if (darkModeToggle) {
                darkModeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
            }
        } else {
            if (darkModeToggle) {
                darkModeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
            }
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


    // --- Hamburger Menu Functionality ---
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // If hamburger is opened, ensure search overlay is closed
            if (navLinks.classList.contains('active')) {
                if (searchOverlay && searchOverlay.classList.contains('active')) {
                    searchOverlay.classList.remove('active'); // Use remove for opacity transition
                    if (searchInput) {
                        searchInput.value = '';
                    }
                    if (searchResultsDiv) {
                        searchResultsDiv.innerHTML = '<p class="empty-message" style="display:none;">No results found.</p>';
                    }
                }
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            });
        });
    }


    // --- Booking List Management Functions ---
    function getBookings() {
        const bookings = localStorage.getItem('mumuFashionsBookings');
        return bookings ? JSON.parse(bookings) : [];
    }

    function saveBookings(bookings) {
        localStorage.setItem('mumuFashionsBookings', JSON.stringify(bookings));
        updateBookingCount();
    }

    function updateBookingCount() {
        const bookings = getBookings();
        if (bookingCountSpan) {
            bookingCountSpan.textContent = bookings.length;
        }
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
        if (!bookingList || !emptyBookingsMessage || !totalItemsSpan || !overallTotalSpan || !bookingSummary || !consolidatedBookingForm) {
            return;
        }

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


    // --- Product Details Page Logic ---
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    function loadProductDetails() {
        if (!productDetailContainer || !noProductMessage || !similarProductsGrid || !noSimilarProductsMessage) {
            return;
        }

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


    // --- Promotional Carousel Logic ---
    function initializeCarousel() {
        if (!promoCarousel || !prevBtn || !nextBtn || !dotsContainer) return;

        slides = Array.from(promoCarousel.querySelectorAll('.carousel-slide'));
        dots = Array.from(document.querySelectorAll('.carousel-dots .dot'));

        if (slides.length === 0) return;

        function showSlide(index) {
            if (index >= slides.length) {
                currentSlideIndex = 0;
            } else if (index < 0) {
                currentSlideIndex = slides.length - 1;
            } else {
                currentSlideIndex = index;
            }

            const offset = -currentSlideIndex * 100;
            promoCarousel.style.transform = `translateX(${offset}%)`;

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlideIndex);
            });
        }

        function nextSlide() {
            showSlide(currentSlideIndex + 1);
        }

        function prevSlide() {
            showSlide(currentSlideIndex - 1);
        }

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetAutoSlide();
            });
        });

        function startAutoSlide() {
            stopAutoSlide();
            autoSlideInterval = setInterval(nextSlide, slideIntervalTime);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        function resetAutoSlide() {
            stopAutoSlide();
            startAutoSlide();
        }

        showSlide(currentSlideIndex);
        startAutoSlide();
    }


    // --- Search Functionality Logic (MODIFIED for floating button and overlay) ---
    function initializeSearch() {
        // Ensure all search elements are present for this logic to run
        if (!searchToggle || !searchOverlay || !searchInput || !closeSearchBtn || !searchResultsDiv || !noSearchResultsMessage) {
            return;
        }

        // Open search overlay
        searchToggle.addEventListener('click', () => {
            searchOverlay.classList.add('active'); // Add 'active' to trigger fade-in
            searchInput.focus(); // Focus input when opened

            // If search is opened, ensure hamburger menu is closed
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });

        // Close search overlay via close button
        closeSearchBtn.addEventListener('click', () => {
            searchOverlay.classList.remove('active'); // Remove 'active' to trigger fade-out
            searchInput.value = ''; // Clear search input
            searchResultsDiv.innerHTML = '<p class="empty-message" style="display:none;">No results found.</p>'; // Reset results
        });

        // Close search overlay when clicking outside the search content (on the overlay itself)
        searchOverlay.addEventListener('click', (event) => {
            // Check if the click occurred directly on the overlay, not on its children
            if (event.target === searchOverlay) {
                searchOverlay.classList.remove('active');
                searchInput.value = '';
                searchResultsDiv.innerHTML = '<p class="empty-message" style="display:none;">No results found.</p>';
            }
        });

        // Live search as user types
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();
            displaySearchResults(query);
        });
    }

    function displaySearchResults(query) {
        searchResultsDiv.innerHTML = ''; // Clear previous results

        if (query.length < 2) {
            noSearchResultsMessage.style.display = 'none';
            return;
        }

        const filteredProducts = allProducts.filter(product => {
            return product.name.toLowerCase().includes(query) ||
                   product.category.toLowerCase().includes(query) ||
                   product.description.toLowerCase().includes(query);
        });

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


    // --- Conditional Event Listeners and Initializers (RUN ON DOMContentLoaded) ---

    updateBookingCount();

    if (bookingList) {
        displayBookings();
        if (clearBookingsBtn) {
            clearBookingsBtn.addEventListener('click', clearAllBookings);
        }

        if (consolidatedBookingForm) {
            consolidatedBookingForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                if (getBookings().length === 0) {
                    alert('Your booking list is empty. Please add items before confirming.');
                    return;
                }

                const form = event.target;
                const formData = new FormData(form);

                try {
                    const response = await fetch(form.action, {
                        method: form.method,
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
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

    if (productDetailContainer) {
        loadProductDetails();
    }

    initializeCarousel();


    initializeSearch(); // Call search initializer

     // --- 404 Page Specific Logic: Trigger Search from Button ---
    const triggerSearchBtn = document.getElementById('triggerSearch');
    if (triggerSearchBtn && searchOverlay && searchInput) { // Ensure elements exist
        triggerSearchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active'); // Open the search overlay
            searchInput.focus(); // Focus the search input

            // Also, close the hamburger menu if it's open, to avoid overlap
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    }
});