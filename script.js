// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // ===========================
    // Initialize Feather Icons
    // ===========================
    const initFeather = () => {
        try { feather.replace(); } 
        catch (e) { console.error('Feather icons failed to load.', e); }
    };
    initFeather();

    // ===========================
    // Dark Mode Initialization
    // ===========================
    const themeToggleBtns = [
        document.getElementById('theme-toggle'),
        document.getElementById('theme-toggle-mobile')
    ];

    const setTheme = (mode) => {
        if (mode === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        localStorage.theme = mode;
    };

    // Initialize theme on page load
    // Default to 'dark' for this theme
    if (!localStorage.theme) {
        localStorage.theme = 'dark';
    }
    setTheme(localStorage.theme);

    const toggleDarkMode = () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.theme = isDark ? 'dark' : 'light';
        initFeather();
    };

    themeToggleBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', toggleDarkMode);
    });

    // ===========================
    // Mobile Menu Toggle
    // ===========================
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
        mobileMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') mobileMenu.classList.add('hidden');
        });
    }

    // ===========================
    // Smooth Scrolling
    // ===========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href').length > 1) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                target?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===========================
    // Hero Typing Animation
    // ===========================
    if (typeof Typed !== 'undefined') {
        new Typed('#typed-text', {
            strings: ['Ethical Hacker', 'AI and ML Developer', 'CyberSecurity Expert', 'Full-Stack Developer', 'UX/UI Designer'],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            smartBackspace: true
        });
    } else {
        console.error('Typed.js library not loaded.');
    }

    // ===========================
    // Project Filtering
    // ===========================
    const filterButtons = document.querySelectorAll('#filter-buttons .filter-btn');
    const projectGrid = document.getElementById('project-grid');
    const projectCards = projectGrid ? projectGrid.querySelectorAll('.project-card') : [];

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                // Using toggle with a boolean force
                card.classList.toggle('hidden', filter !== 'all' && !categories.includes(filter));
            });
        });
    });

    // ===========================
    // Project Modals
    // ===========================
    const modalTriggers = document.querySelectorAll('[data-modal-target]');

    const openModal = (modal) => {
        modal.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
        initFeather();

        const closeBtns = modal.querySelectorAll('.modal-close-btn');
        closeBtns.forEach(btn => btn.addEventListener('click', () => closeModal(modal), { once: true }));

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    };

    const closeModal = (modal) => {
        modal.classList.remove('is-visible');
        document.body.style.overflow = 'auto';
    };

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modal = document.getElementById(trigger.getAttribute('data-modal-target'));
            if (modal) openModal(modal);
        });
    });

    // ===========================
    // Accordion
    // ===========================
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const body = header.nextElementSibling;
            header.classList.toggle('is-open');
            body.classList.toggle('is-open');
        });
    });

    // ===========================
    // Back to Top Button
    // ===========================
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.classList.toggle('is-visible', window.scrollY > 300);
        });
    }

    // ===========================
    // Scroll Fade Animations
    // ===========================
    const scrollFadeElements = document.querySelectorAll('.scroll-fade');

    if (scrollFadeElements.length > 0) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '0px', threshold: 0.1 });

        scrollFadeElements.forEach(el => observer.observe(el));
    }

    
    // ===========================
    // Contact Form Handling
    // ===========================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        const showStatus = (message, type = 'success') => {
            formStatus.textContent = message;
            formStatus.className = `form-status show ${type}`;
            setTimeout(() => formStatus.classList.remove('show'), 4000);
        };

        const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        // ** UPDATED submitForm function to return a boolean for success/failure **
        const submitForm = async (name, email, message) => {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('message', message);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showStatus('✅ Message sent successfully!', 'success');
                    localStorage.removeItem('offlineMessage');
                    return true; // <-- Return true on success
                } else {
                    const data = await response.json();
                    const errorMsg = data.errors ? data.errors.map(err => err.message).join(", ") : "Something went wrong!";
                    showStatus(`❌ ${errorMsg}`, 'error');
                    return false; // <-- Return false on error
                }
            } catch (error) {
                if (!navigator.onLine) {
                    localStorage.setItem('offlineMessage', JSON.stringify({ name, email, message }));
                    showStatus('⚠️ You are offline. Message saved locally.', 'error');
                } else {
                    showStatus('❌ Network error. Please try again.', 'error');
                }
                return false; // <-- Return false on catch
            }
        };

        // ** UPDATED Event Listener with loader logic **
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            // ** NEW: Get loader elements from index.html **
            const btnText = submitBtn.querySelector('.button-text');
            const btnLoader = submitBtn.querySelector('.button-loader');

            // ** NEW: Start loading state **
            submitBtn.disabled = true;
            btnText.classList.add('hidden');
            btnLoader.classList.remove('hidden');
            initFeather(); // Re-render the new loader icon

            const name = contactForm.name.value.trim();
            const email = contactForm.email.value.trim();
            const message = contactForm.message.value.trim();

            const stopLoading = () => {
                submitBtn.disabled = false;
                btnText.classList.remove('hidden');
                btnLoader.classList.add('hidden');
            };

            if (!name || !email || !message) {
                showStatus('Please fill in all fields.', 'error');
                stopLoading();
                return;
            }

            if (!validateEmail(email)) {
                showStatus('Please enter a valid email address.', 'error');
                stopLoading();
                return;
            }

            // Await submission and check for success
            const success = await submitForm(name, email, message);
            
            if (success) {
                contactForm.reset(); // Only reset form on success
            }
            
            stopLoading(); // Stop loading regardless of success/failure
        });

        // --- Check for offline saved message on page load ---
        const offlineMsg = localStorage.getItem('offlineMessage');
        if (offlineMsg) {
            const { name, email, message } = JSON.parse(offlineMsg);
            showStatus('⚠️ You have a saved message from offline. It will be sent automatically when online.', 'error');
        }

        // --- Automatically submit offline messages when back online ---
        window.addEventListener('online', async () => {
            const saved = localStorage.getItem('offlineMessage');
            if (saved) {
                const { name, email, message } = JSON.parse(saved);
                showStatus('📤 Sending saved offline message...', 'success');
                await submitForm(name, email, message);
            }
        });
    }
});

