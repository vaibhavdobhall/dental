/* ===== COMPLETE DENTAL SOLUTIONS - MAIN JAVASCRIPT ===== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ===== CONFIGURATION =====
    const CONFIG = {
        clinicName: 'Complete Dental Solutions',
        phone: '+918368008170',
        phoneDisplay: '083680 08170',
        address: 'B 26, Sector 41, Noida, Opp-HDFC Bank, Noida, Uttar Pradesh 201303, India',
        mapCoords: { lat: 28.5689744, lng: 77.3572017 },
        hours: {
            Monday: '11:00 AM – 8:30 PM',
            Tuesday: '11:00 AM – 8:30 PM',
            Wednesday: '11:00 AM – 8:30 PM',
            Thursday: '11:00 AM – 8:30 PM',
            Friday: '11:00 AM – 8:30 PM',
            Saturday: '11:00 AM – 8:30 PM',
            Sunday: 'Closed'
        },
        // Web3Forms API Key
        formApiKey: '2d1d1add-4b87-4cd7-b6fd-958d99e03a79',
        formEndpoint: 'https://api.web3forms.com/submit'
    };

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // ===== MOBILE MENU TOGGLE =====
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Close menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ===== ACTIVE NAV LINK =====
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });

    // ===== SCROLL ANIMATIONS (Intersection Observer) =====
    const animateElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .stagger-item');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // If it's a stagger container, animate children
                if (entry.target.classList.contains('stagger-container')) {
                    const items = entry.target.querySelectorAll('.stagger-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));

    // ===== BACK TO TOP BUTTON =====
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 400) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
    }

    // ===== HOURS STATUS DISPLAY =====
    function updateHoursStatus() {
        const statusElements = document.querySelectorAll('.open-status');
        const now = new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[now.getDay()];
        
        statusElements.forEach(el => {
            const status = el.dataset.status;
            if (status === 'open') {
                el.textContent = 'Open now';
                el.className = 'open-status open';
            } else if (status === 'closed') {
                el.textContent = 'Closed';
                el.className = 'open-status closed';
            }
        });

        // Dynamic status based on current time
        const todayHours = CONFIG.hours[dayName];
        if (todayHours && todayHours !== 'Closed') {
            const [_, openTime, closeTime] = todayHours.match(/(\d+):(\d+)\s*(AM|PM)\s*[–-]\s*(\d+):(\d+)\s*(AM|PM)/) || [];
            if (openTime) {
                const openHour = parseInt(openTime) + (closeTime ? 12 : 0);
                const currentHour = now.getHours();
                const currentMin = now.getMinutes();
                const isOpen = currentHour >= 11 && currentHour < 20 && currentHour !== 20 && dayName !== 'Sunday';
                statusElements.forEach(el => {
                    if (el.closest('.hero-badge') || el.closest('.hours-status')) {
                        el.textContent = isOpen ? '● Open now' : '● Closed';
                        el.className = isOpen ? 'open-status open' : 'open-status closed';
                    }
                });
            }
        } else {
            statusElements.forEach(el => {
                if (el.closest('.hero-badge') || el.closest('.hours-status')) {
                    el.textContent = '● Closed today';
                    el.className = 'open-status closed';
                }
            });
        }
    }
    updateHoursStatus();

    // ===== CONTACT FORM HANDLING (Web3Forms) =====
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Sending...';

            // Clear previous messages
            formMessage.className = 'form-message';
            formMessage.style.display = 'none';

            // Gather form data
            const formData = new FormData(this);
            const data = {
                access_key: CONFIG.formApiKey,
                subject: 'New Appointment Inquiry - Complete Dental Solutions',
                from_name: formData.get('name') || 'Website Visitor',
                name: formData.get('name') || '',
                phone: formData.get('phone') || '',
                email: formData.get('email') || '',
                service: formData.get('service') || 'Not specified',
                message: formData.get('message') || '',
                date: formData.get('date') || '',
                time: formData.get('time') || '',
                botcheck: ''
            };

            try {
                const response = await fetch(CONFIG.formEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    formMessage.className = 'form-message success';
                    formMessage.textContent = '✓ Thank you! Your inquiry has been sent successfully. We will contact you shortly at ' + data.phone + '.';
                    formMessage.style.display = 'block';
                    contactForm.reset();
                } else {
                    formMessage.className = 'form-message error';
                    formMessage.textContent = '✗ ' + (result.message || 'Something went wrong. Please try again or call us directly.');
                    formMessage.style.display = 'block';
                }
            } catch (error) {
                formMessage.className = 'form-message error';
                formMessage.textContent = '✗ Network error. Please check your connection or call us at ' + CONFIG.phoneDisplay;
                formMessage.style.display = 'block';
            }

            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message →';
        });
    }

    // ===== SERVICES FORM (on index.html) =====
    const quickForm = document.getElementById('quickForm');
    if (quickForm) {
        quickForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const btn = this.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner"></span> Sending...';

            const formData = new FormData(this);
            const data = {
                access_key: CONFIG.formApiKey,
                subject: 'Quick Appointment Request - Complete Dental Solutions',
                from_name: formData.get('name') || 'Website Visitor',
                name: formData.get('name') || '',
                phone: formData.get('phone') || '',
                email: formData.get('email') || '',
                message: 'Quick appointment request from: ' + formData.get('name') + ' (Phone: ' + formData.get('phone') + ')',
                botcheck: ''
            };

            try {
                const response = await fetch(CONFIG.formEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                
                const msgEl = document.getElementById('quickFormMessage');
                if (result.success) {
                    msgEl.className = 'form-message success';
                    msgEl.textContent = '✓ Thank you! We\'ll call you back at ' + data.phone + ' shortly.';
                    msgEl.style.display = 'block';
                    quickForm.reset();
                } else {
                    msgEl.className = 'form-message error';
                    msgEl.textContent = '✗ Error sending. Please call ' + CONFIG.phoneDisplay;
                    msgEl.style.display = 'block';
                }
            } catch (error) {
                const msgEl = document.getElementById('quickFormMessage');
                msgEl.className = 'form-message error';
                msgEl.textContent = '✗ Network error. Please call ' + CONFIG.phoneDisplay;
                msgEl.style.display = 'block';
            }

            btn.disabled = false;
            btn.innerHTML = 'Book Appointment';
        });
    }

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== COUNTER ANIMATION =====
    function animateCounter(el) {
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const step = Math.ceil(target / (duration / 16));
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = current + (el.dataset.suffix || '');
        }, 16);
    }

    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // ===== LOAD MAP (Google Maps iframe) =====
    const mapContainers = document.querySelectorAll('.map-container');
    mapContainers.forEach(container => {
        if (!container.querySelector('iframe')) {
            const iframe = document.createElement('iframe');
            iframe.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.1!2d' + CONFIG.mapCoords.lng + '!3d' + CONFIG.mapCoords.lat + '!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce546f365b2cb%3A0xdb975f8ed39ac915!2sComplete%20Dental%20Solutions-%20Best%20Dental%20Clinic%20in%20Noida%20Sector%2041!5e0!3m2!1sen!2sin!4v1';
            iframe.loading = 'lazy';
            iframe.allowFullscreen = true;
            container.innerHTML = '';
            container.appendChild(iframe);
        }
    });

    // ===== REVIEWS CAROUSEL (if on index page) =====
    const reviewCarousel = document.querySelector('.reviews-carousel');
    if (reviewCarousel) {
        let isDown = false;
        let startX;
        let scrollLeft;

        reviewCarousel.addEventListener('mousedown', (e) => {
            isDown = true;
            reviewCarousel.style.cursor = 'grabbing';
            startX = e.pageX - reviewCarousel.offsetLeft;
            scrollLeft = reviewCarousel.scrollLeft;
        });

        reviewCarousel.addEventListener('mouseleave', () => {
            isDown = false;
            reviewCarousel.style.cursor = 'grab';
        });

        reviewCarousel.addEventListener('mouseup', () => {
            isDown = false;
            reviewCarousel.style.cursor = 'grab';
        });

        reviewCarousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - reviewCarousel.offsetLeft;
            const walk = (x - startX) * 2;
            reviewCarousel.scrollLeft = scrollLeft - walk;
        });
    }

    // ===== SERVICE FILTER (services page) =====
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;
                
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                serviceCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => card.style.opacity = '1', 10);
                    } else {
                        card.style.opacity = '0';
                        setTimeout(() => card.style.display = 'none', 300);
                    }
                });
            });
        });
    }

    // ===== CLINIC NAME DYNAMIC UPDATE =====
    const clinicNameElements = document.querySelectorAll('.clinic-name');
    clinicNameElements.forEach(el => {
        el.textContent = CONFIG.clinicName;
    });

    console.log('✓ ' + CONFIG.clinicName + ' website initialized successfully');
    console.log('📞 Phone: ' + CONFIG.phoneDisplay);
    console.log('📍 Address: ' + CONFIG.address);
    console.log('📧 Form API: Web3Forms configured');
});
