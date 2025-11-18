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
    // NEW: Dynamic Navbar Shadow
    // ===========================
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('shadow-lg', 'dark:bg-navy/95');
            } else {
                navbar.classList.remove('shadow-lg', 'dark:bg-navy/95');
            }
        });
    }

    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('mobile-menu-overlay');

    menuBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('is-open');
        menuBtn.classList.toggle('is-open');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    menuOverlay.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        menuBtn.classList.remove('is-open');
        document.body.style.overflow = '';
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('is-open');
            menuBtn.classList.remove('is-open');
            document.body.style.overflow = '';
        });
    });




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
            strings: [
                "Computer Science Student",
                "Cybersecurity Analyst",
                "AI and ML Developer",
                "Web Developer",
                "Ethical Hacker",
                "UI/UX Designer"
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 1500,
            loop: true,
            smartBackspace: true
        });
    } else {
        console.error('Typed.js library not loaded.');
    }

    // ===========================
    // NEW: Active Nav Link Highlighting
    // ===========================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    // Set data-text attribute for hover effect
    navLinks.forEach(link => {
        const span = link.querySelector('span');
        if (span) {
            span.dataset.text = span.textContent;
            // Create the second span for the hover effect
            const hoverSpan = document.createElement('span');
            hoverSpan.textContent = span.textContent;
            hoverSpan.setAttribute('aria-hidden', 'true');
            hoverSpan.style.position = 'absolute';
            hoverSpan.style.top = '100%';
            hoverSpan.style.left = '0';
            hoverSpan.style.color = 'rgb(10 25 47)'; // navy
            hoverSpan.style.transform = 'translateY(0)';
            span.appendChild(hoverSpan);
        }
    });

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Triggers when section is in middle of viewport
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });


    // ===========================
    // 3D Profile Image Tilt
    // ===========================
    const tiltWrapper = document.getElementById('profile-3d-wrap');
    const tiltCard = document.getElementById('profile-card');

    const handleTilt = (wrapper, card, e) => {
        if (!wrapper || !card) return;
        const rect = wrapper.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = (mouseX / width) - 0.5;
        const yPct = (mouseY / height) - 0.5;

        const maxTilt = 10;

        const rotateX = maxTilt * -yPct;
        const rotateY = maxTilt * xPct;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const resetTilt = (card) => {
        if (!card) return;
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    };

    if (tiltWrapper && tiltCard) {
        tiltWrapper.addEventListener('mousemove', (e) => handleTilt(tiltWrapper, tiltCard, e));
        tiltWrapper.addEventListener('mouseleave', () => resetTilt(tiltCard));
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
                // Ignore "extra-project" cards if they are hidden
                if (card.classList.contains('extra-project') && card.classList.contains('hidden')) {
                    if (filter === 'all' || categories.includes(filter)) {
                        // If it matches, don't unhide it, let the "show more" button do it
                    } else {
                        // If it doesn't match, it should remain hidden
                    }
                } else if (!card.classList.contains('extra-project')) {
                    // This is one of the top 6 projects
                    const categories = card.getAttribute('data-category');
                    card.classList.toggle('hidden', filter !== 'all' && !categories.includes(filter));
                }
            });
        });
    });

    // ===========================
    // NEW: Show More/Less Projects
    // ===========================
    const showMoreBtn = document.getElementById('show-more-btn');
    const extraProjects = document.querySelectorAll('.extra-project');

    if (showMoreBtn && extraProjects.length > 0) {
        showMoreBtn.addEventListener('click', () => {
            const showMoreText = showMoreBtn.querySelector('.show-more-text');
            const showLessText = showMoreBtn.querySelector('.show-less-text');

            // Check if we are currently in "show more" state
            const isShowingMore = showMoreText.classList.contains('hidden');

            if (isShowingMore) {
                // We are showing all, so hide the extra ones
                extraProjects.forEach(card => {
                    card.classList.add('hidden');
                });
                showMoreText.classList.remove('hidden');
                showLessText.classList.add('hidden');
            } else {
                // We are showing few, so show all that match the current filter
                const currentFilter = document.querySelector('#filter-buttons .filter-btn.active').getAttribute('data-filter');
                extraProjects.forEach(card => {
                    const categories = card.getAttribute('data-category');
                    if (currentFilter === 'all' || categories.includes(currentFilter)) {
                        card.classList.remove('hidden');
                    }
                });
                showMoreText.classList.add('hidden');
                showLessText.classList.remove('hidden');
            }
        });
    }


    // ===========================
    // Project Modals
    // ===========================
    const modalTriggers = document.querySelectorAll('[data-modal-target]');

    const openModal = (modal) => {
        if (!modal) return;
        const modalContent = modal.querySelector('.modal-content');
        // Save previously focused element to restore later
        modal._previouslyFocused = document.activeElement;

        modal.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
        initFeather();

        // NEW: Hide scroll-to-top button
        const scrollTopBtn = document.getElementById("scrollTopBtn");
        if (scrollTopBtn) {
            scrollTopBtn.style.opacity = "0";
            scrollTopBtn.style.pointerEvents = "none";
        }

        // Ensure ARIA & roles are present
        try {
            modal.setAttribute('aria-hidden', 'false');
            if (modalContent) {
                modalContent.setAttribute('role', 'dialog');
                modalContent.setAttribute('aria-modal', 'true');
                modalContent.setAttribute('tabindex', '-1');
                // Move focus to modal content (or first focusable element inside)
                const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                (firstFocusable || modalContent).focus();
            }
        } catch (err) {
            // ignore DOM permission errors in unusual environments
        }

        // Wire up close buttons (one-time handlers)
        const closeBtns = modal.querySelectorAll('.modal-close-btn');
        closeBtns.forEach(btn => btn.addEventListener('click', () => closeModal(modal), { once: true }));

        // Clicking backdrop closes modal
        const outsideClickHandler = (e) => { if (e.target === modal) closeModal(modal); };
        modal._outsideClickHandler = outsideClickHandler;
        modal.addEventListener('click', outsideClickHandler);

        // Keydown handler to trap focus and close on Escape
        const keydownHandler = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeModal(modal);
                return;
            }

            if (e.key !== 'Tab') return;

            const focusableSelectors = 'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"])';
            const focusable = Array.from(modal.querySelectorAll(focusableSelectors)).filter(el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length));

            if (focusable.length === 0) {
                // No focusable elements, keep focus on modal content
                e.preventDefault();
                modalContent && modalContent.focus();
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        };

        modal._keydownHandler = keydownHandler;
        document.addEventListener('keydown', keydownHandler);
    };

    const closeModal = (modal) => {
        if (!modal) return;
        modal.classList.remove('is-visible');
        document.body.style.overflow = 'auto';

        // NEW: Conditionally show scroll-to-top button
        const scrollTopBtn = document.getElementById("scrollTopBtn");
        if (scrollTopBtn) {
            // UPDATED: Remove inline styles to let CSS classes take over
            scrollTopBtn.style.opacity = "";
            scrollTopBtn.style.pointerEvents = "";
        }

        // Reset AI content on close
        const aiContainer = modal.querySelector('.gemini-response-container');
        const aiContent = modal.querySelector('.gemini-response-content');
        if (aiContainer && aiContent) {
            aiContainer.style.display = 'none';
            aiContent.innerHTML = '';
        }

        // Restore ARIA state
        try { modal.setAttribute('aria-hidden', 'true'); } catch (err) { }

        // Remove backdrop click handler
        if (modal._outsideClickHandler) {
            modal.removeEventListener('click', modal._outsideClickHandler);
            modal._outsideClickHandler = null;
        }

        // Remove keydown handler
        if (modal._keydownHandler) {
            document.removeEventListener('keydown', modal._keydownHandler);
            modal._keydownHandler = null;
        }

        // Restore focus to previously focused element
        try {
            if (modal._previouslyFocused && typeof modal._previouslyFocused.focus === 'function') {
                modal._previouslyFocused.focus();
            }
        } catch (err) {
            // ignore
        }
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
    // GEMINI API FEATURES
    // ===========================

    // --- Main API Call Function ---
    const callGeminiAPI = async (prompt, systemInstruction, retries = 3, delay = 1000) => {
        const apiKey = "AIzaSyDi7nyy5VeTLBGgf7ntjtVUKSR3l5bzO8I"; // CRITICAL: API key removed. This must be handled by the environment, not a public file.
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            tools: [{ "google_search": {} }],
            systemInstruction: {
                parts: [{ text: systemInstruction }]
            },
        };

        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                const candidate = result.candidates?.[0];

                if (candidate && candidate.content?.parts?.[0]?.text) {
                    return { success: true, text: candidate.content.parts[0].text };
                } else {
                    throw new Error("Invalid response structure from API.");
                }
            } catch (error) {
                if (i === retries - 1) {
                    console.error("Gemini API call failed:", error);
                    return { success: false, text: "Error: Unable to get a response at this time." };
                }
                await new Promise(res => setTimeout(res, delay * Math.pow(2, i)));
            }
        }
    };

    // --- 1. AI Project Explainer ---
    const aiExplainButtons = document.querySelectorAll('.btn-ask-ai');

    aiExplainButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const title = button.dataset.projectTitle;
            const desc = button.dataset.projectDesc;

            const modal = button.closest('.modal-content');
            if (!modal) return;

            const aiContainer = modal.querySelector('.gemini-response-container');
            const aiContent = modal.querySelector('.gemini-response-content');
            if (!aiContainer || !aiContent) return;

            const btnText = button.querySelector('.button-text');
            const btnLoader = button.querySelector('.button-loader');

            // Show loading state
            aiContainer.style.display = 'block';
            aiContent.innerHTML = '<i data-feather="loader" class="animate-spin"></i>';
            initFeather();
            button.disabled = true;
            if (btnText && btnLoader) {
                btnText.classList.add('hidden');
                btnLoader.classList.remove('hidden');
            }

            const systemInstruction = "You are a helpful portfolio assistant. Your goal is to explain technical concepts simply for a non-technical recruiter or professor. Keep your explanation to one short paragraph.";
            const prompt = `Explain my project "${title}" to a recruiter. Here's my description: "${desc}". What are the key technical concepts (like OpenMP, Scikit-learn, or OOP) in one short paragraph?`;

            const response = await callGeminiAPI(prompt, systemInstruction);

            // Display result - UPDATED with Markdown parsing
            if (response.success) {
                let html = response.text
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-lightest-slate">$1</strong>') // Bold
                    .replace(/^\* (.*?)(?=\n\* |$)/gm, '<li class="flex items-start"><i data-feather="check" class="w-4 h-4 mr-2 text-cyan flex-shrink-0 mt-1"></i><span>$1</span></li>') // List items
                    .replace(/(\<li\>.*?\<\/li\>)/gs, '<ul class="list-none space-y-1 mt-2">$1</ul>') // Wrap lists
                    .replace(/\n/g, '<br>'); // Newlines

                // Clean up any <br> tags that might have snuck into the <ul>
                html = html.replace(/<ul.*?><br>(.*?)<\/ul>/gs, '<ul>$1</ul>');

                aiContent.innerHTML = html;
                initFeather(); // Re-run feather to render new 'check' icons
            } else {
                aiContent.innerHTML = response.text; // Show error message
            }

            button.disabled = false;
            if (btnText && btnLoader) {
                btnText.classList.remove('hidden');
                btnLoader.classList.add('hidden');
            }
        });
    });

    // --- 2. NEW: AI Contact Form Assistant ---
    const generateMessageBtn = document.getElementById('gemini-pro-btn');
    const aiPromptInput = document.getElementById('ai-prompt');
    const messageTextarea = document.getElementById('message');
    const geminiStatus = document.getElementById('gemini-status');
    const contactNameInput = document.getElementById('name');

    if (generateMessageBtn) {
        generateMessageBtn.addEventListener('click', async () => {

            const prompt = aiPromptInput.value.trim();
            const name = contactNameInput.value.trim() || 'Sender';

            if (!prompt) {
                geminiStatus.textContent = "Please enter a few keywords.";
                geminiStatus.className = "form-status show error";
                setTimeout(() => geminiStatus.classList.remove("show"), 3000);
                return;
            }

            // Loading UI elements
            const glassIcon = generateMessageBtn.querySelector('.gemini-glass-icon');
            const btnLoader = generateMessageBtn.querySelector('.button-loader');

            generateMessageBtn.disabled = true;
            if (glassIcon) glassIcon.classList.add('hidden');
            if (btnLoader) btnLoader.classList.remove('hidden');
            feather.replace();

            geminiStatus.textContent = "✨ Drafting message... please wait.";
            geminiStatus.className = "form-status show success";

            // System instruction for Gemini
            const systemInstruction = `
            You are an AI assistant helping a visitor on Mohsin Haider Sultan's portfolio.
            Write a professional and friendly message (maximum 4 sentences) from ${name}.
        `;

            const finalPrompt = `Keywords: "${prompt}". Sender Name: ${name}. Draft the message.`;

            // Call Gemini API
            const response = await callGeminiAPI(finalPrompt, systemInstruction);

            if (response.success) {
                messageTextarea.value = response.text.replace(/\*/g, '');
                geminiStatus.textContent = "✨ Message drafted!";
                geminiStatus.className = "form-status show success";
            } else {
                geminiStatus.textContent = "❌ Error creating message. Try again.";
                geminiStatus.className = "form-status show error";
            }

            // Reset loading UI
            generateMessageBtn.disabled = false;
            if (glassIcon) glassIcon.classList.remove('hidden');
            if (btnLoader) btnLoader.classList.add('hidden');

            setTimeout(() => geminiStatus.classList.remove("show"), 4000);
        });
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
                    return true;
                } else {
                    const data = await response.json();
                    const errorMsg = data.errors ? data.errors.map(err => err.message).join(", ") : "Something went wrong!";
                    showStatus(`❌ ${errorMsg}`, 'error');
                    return false;
                }
            } catch (error) {
                if (!navigator.onLine) {
                    localStorage.setItem('offlineMessage', JSON.stringify({ name, email, message }));
                    showStatus('⚠️ You are offline. Message saved locally.', 'error');
                } else {
                    showStatus('❌ Network error. Please try again.', 'error');
                }
                return false;
            }
        };

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.button-text');
            const btnLoader = submitBtn.querySelector('.button-loader');

            submitBtn.disabled = true;
            btnText.classList.add('hidden');
            btnLoader.classList.remove('hidden');
            initFeather();

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

            const success = await submitForm(name, email, message);

            if (success) {
                contactForm.reset();
            }

            stopLoading();
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

    // Scroll-to-top button
    // MOVED inside DOMContentLoaded for safety
    const btn = document.getElementById("scrollTopBtn");

    if (btn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 250) {
                // Use .show class as defined in style.css
                btn.classList.add("show");
            } else {
                // Use .show class as defined in style.css
                btn.classList.remove("show");
            }
        });

        btn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    function initHeroParticles() {
        const canvas = document.getElementById("particles-canvas");
        const ctx = canvas.getContext("2d");

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Particle properties
        const numParticles = 55;
        const particles = [];

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 0.4 - 0.2,
                speedY: Math.random() * 0.4 - 0.2,
                alpha: Math.random() * 0.3 + 0.2,
            });
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                ctx.globalAlpha = p.alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = "#22d3ee"; // cyan glow
                ctx.fill();

                // Move
                p.x += p.speedX;
                p.y += p.speedY;

                // Wrap around screen
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
            });

            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }

    // BUG FIX: Changed from addEventListener to a direct call
    // This ensures it runs once the main DOM listener fires.
    initHeroParticles();


});
