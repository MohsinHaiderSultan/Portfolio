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
            strings: [
                        "Computer Science Student",
                        "Cybersecurity Analyst",
                        "AI & ML Developer",
                        "Web Developer",
                        "Ethical Hacker",
                        "UI/UX Designer"
                        ],
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
                const categories = card.getAttribute('data-category');
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
        // Reset AI content on close
        const aiContainer = modal.querySelector('.gemini-response-container');
        const aiContent = modal.querySelector('.gemini-response-content');
        if (aiContainer && aiContent) {
            aiContainer.style.display = 'none';
            aiContent.innerHTML = '';
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
        const apiKey = ""; // API key is handled by the environment
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
            if(btnText && btnLoader) {
                btnText.classList.add('hidden');
                btnLoader.classList.remove('hidden');
            }

            const systemInstruction = "You are a helpful portfolio assistant. Your goal is to explain technical concepts simply for a non-technical recruiter or professor. Keep your explanation to one short paragraph.";
            const prompt = `Explain my project "${title}" to a recruiter. Here's my description: "${desc}". What are the key technical concepts (like OpenMP, Scikit-learn, or OOP) in one short paragraph?`;

            const response = await callGeminiAPI(prompt, systemInstruction);

            // Display result
            aiContent.innerHTML = response.text.replace(/\n/g, '<br>'); // Format line breaks
            button.disabled = false;
            if(btnText && btnLoader) {
                btnText.classList.remove('hidden');
                btnLoader.classList.add('hidden');
            }
        });
    });

    // --- 2. NEW: AI Contact Form Assistant ---
    const generateMessageBtn = document.getElementById('generate-message-btn');
    const aiPromptInput = document.getElementById('ai-prompt');
    const messageTextarea = document.getElementById('message');
    const geminiStatus = document.getElementById('gemini-status');
    const contactNameInput = document.getElementById('name');

   if (generateMessageBtn && aiPromptInput && messageTextarea && geminiStatus) {
        generateMessageBtn.addEventListener('click', async () => {
            const prompt = aiPromptInput.value.trim();
            const name = contactNameInput.value.trim() || 'Sender'; // Use 'Sender' if name is empty
            if (!prompt) {
                geminiStatus.textContent = "Please enter a few keywords first.";
                geminiStatus.className = "form-status show error";
                setTimeout(() => geminiStatus.classList.remove('show'), 3000);
                return;
            }

            // Start loading state
            const btnText = generateMessageBtn.querySelector('.button-text');
            const btnLoader = generateMessageBtn.querySelector('.button-loader');
            generateMessageBtn.disabled = true;
            btnText.classList.add('hidden');
            btnLoader.classList.remove('hidden');
            initFeather();

            // *** UPDATED: Show immediate feedback ***
            geminiStatus.textContent = "✨ Drafting message... Please wait.";
            geminiStatus.className = "form-status show success"; // Use 'success' for cyan text

            const systemInstruction = `You are an AI assistant helping a visitor on Mohsin Haider's portfolio. Write a professional, concise, and friendly message (max 3-4 sentences) from the visitor to Mohsin. The visitor's name is ${name}. Base the message on these keywords: "${prompt}".`;
            const finalPrompt = `Keywords: "${prompt}". My Name: ${name}. Write the message to Mohsin.`;
            
            const response = await callGeminiAPI(finalPrompt, systemInstruction);

            if (response.success) {
                messageTextarea.value = response.text.replace(/\*/g, ''); // Clear formatting
                geminiStatus.textContent = "Message drafted!";
                geminiStatus.className = "form-status show success";
            } else {
                geminiStatus.textContent = "Error drafting message. Please try again.";
                geminiStatus.className = "form-status show error";
            }

            // Stop loading state
            generateMessageBtn.disabled = false;
            btnText.classList.remove('hidden');
            btnLoader.classList.add('hidden');
            // Shorten the timeout so the new status message (e.g., "Message drafted!") is visible
            setTimeout(() => geminiStatus.classList.remove('show'), 4000);
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
});
