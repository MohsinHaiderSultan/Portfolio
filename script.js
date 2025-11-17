// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================================
       Feather Icons
    ========================================================== */
    const initFeather = () => {
        try { feather.replace(); }
        catch (e) { console.error("Feather icons failed to load.", e); }
    };
    initFeather();

    /* ==========================================================
       Dark Mode
    ========================================================== */
    const themeToggleBtns = [
        document.getElementById("theme-toggle"),
        document.getElementById("theme-toggle-mobile")
    ];

    const setTheme = (mode) => {
        document.documentElement.classList.toggle("dark", mode === "dark");
        localStorage.theme = mode;
    };

    if (!localStorage.theme) localStorage.theme = "dark";
    setTheme(localStorage.theme);

    const toggleDarkMode = () => {
        const isDark = document.documentElement.classList.toggle("dark");
        localStorage.theme = isDark ? "dark" : "light";
        initFeather();
    };

    themeToggleBtns.forEach(btn =>
        btn?.addEventListener("click", toggleDarkMode)
    );

    /* ==========================================================
       Dynamic Navbar Shadow
    ========================================================== */
    const navbar = document.getElementById("navbar");
    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                navbar.classList.add("shadow-lg", "dark:bg-navy/95");
            } else {
                navbar.classList.remove("shadow-lg", "dark:bg-navy/95");
            }
        });
    }

    /* ==========================================================
       Mobile Menu
    ========================================================== */
    const menuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", () =>
            mobileMenu.classList.toggle("hidden")
        );
        mobileMenu.addEventListener("click", (e) => {
            if (e.target.tagName === "A") mobileMenu.classList.add("hidden");
        });
    }

    /* ==========================================================
       Smooth Scrolling
    ========================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", (e) => {
            if (anchor.getAttribute("href") !== "#") {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute("href"));
                target?.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    /* ==========================================================
       Hero Typing Animation
    ========================================================== */
    if (typeof Typed !== "undefined") {
        new Typed("#typed-text", {
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
            loop: true
        });
    }

    /* ==========================================================
       3D Profile Tilt
    ========================================================== */
    const tiltWrapper = document.getElementById("profile-3d-wrap");
    const tiltCard = document.getElementById("profile-card");

    const handleTilt = (wrapper, card, e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const maxTilt = 10;
        card.style.transform = `
            perspective(1000px)
            rotateX(${-y * maxTilt}deg)
            rotateY(${x * maxTilt}deg)
        `;
    };

    tiltWrapper?.addEventListener("mousemove", (e) =>
        handleTilt(tiltWrapper, tiltCard, e)
    );
    tiltWrapper?.addEventListener("mouseleave", () =>
        tiltCard.style.transform = "perspective(1000px) rotateX(0) rotateY(0)"
    );

    /* ==========================================================
       Project Filtering
    ========================================================== */
    const filterButtons = document.querySelectorAll("#filter-buttons .filter-btn");
    const projectGrid = document.getElementById("project-grid");
    const projectCards = projectGrid?.querySelectorAll(".project-card") || [];

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filter = button.dataset.filter;

            projectCards.forEach(card => {
                const categories = card.getAttribute("data-category") || "";

                const matches = filter === "all" || categories.includes(filter);
                card.classList.toggle("hidden", !matches);
            });
        });
    });

    /* ==========================================================
       Show More / Show Less Projects
    ========================================================== */
    const showMoreBtn = document.getElementById("show-more-btn");
    const extraProjects = document.querySelectorAll(".extra-project");

    if (showMoreBtn) {
        showMoreBtn.addEventListener("click", () => {
            const showMoreText = showMoreBtn.querySelector(".show-more-text");
            const showLessText = showMoreBtn.querySelector(".show-less-text");

            const isShowingMore = showMoreText.classList.contains("hidden");
            const activeFilter = document.querySelector("#filter-buttons .active")?.dataset.filter || "all";

            if (isShowingMore) {
                extraProjects.forEach(card => card.classList.add("hidden"));
                showMoreText.classList.remove("hidden");
                showLessText.classList.add("hidden");
            } else {
                extraProjects.forEach(card => {
                    const categories = card.getAttribute("data-category") || "";
                    if (activeFilter === "all" || categories.includes(activeFilter)) {
                        card.classList.remove("hidden");
                    }
                });
                showMoreText.classList.add("hidden");
                showLessText.classList.remove("hidden");
            }
        });
    }

    /* ==========================================================
       Modals
    ========================================================== */
    const modalTriggers = document.querySelectorAll("[data-modal-target]");

    const openModal = (modal) => {
        modal.classList.add("is-visible");
        document.body.style.overflow = "hidden";
        initFeather();
    };

    const closeModal = (modal) => {
        modal.classList.remove("is-visible");
        document.body.style.overflow = "auto";

        const aiContainer = modal.querySelector(".gemini-response-container");
        const aiContent = modal.querySelector(".gemini-response-content");

        if (aiContainer && aiContent) {
            aiContainer.style.display = "none";
            aiContent.innerHTML = "";
        }
    };

    modalTriggers.forEach(trigger => {
        trigger.addEventListener("click", () => {
            const target = document.getElementById(trigger.dataset.modalTarget);
            if (target) openModal(target);
        });
    });

    document.querySelectorAll(".modal-close-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const modal = btn.closest(".modal");
            closeModal(modal);
        });
    });

    /* ==========================================================
       Accordion
    ========================================================== */
    document.querySelectorAll(".accordion-header").forEach(header => {
        header.addEventListener("click", () => {
            header.classList.toggle("is-open");
            header.nextElementSibling.classList.toggle("is-open");
        });
    });

    /* ==========================================================
       Scroll Fade Animation
    ========================================================== */
    const scrollFadeElements = document.querySelectorAll(".scroll-fade");

    if (scrollFadeElements.length > 0) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        scrollFadeElements.forEach(el => observer.observe(el));
    }

    /* ==========================================================
       Gemini API Core Function
    ========================================================== */
    const callGeminiAPI = async (prompt, systemInstruction, retries = 3, delay = 1000) => {
        const apiKey = "AIzaSyDi7nyy5VeTLBGgf7ntjtVUKSR3l5bzO8I";
        const apiUrl =
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            tools: [{ google_search: {} }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
        };

        for (let i = 0; i < retries; i++) {
            try {
                const res = await fetch(apiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

                const data = await res.json();
                const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

                if (text) return { success: true, text };
                throw new Error("Invalid Gemini response.");
            }
            catch (e) {
                if (i === retries - 1) {
                    console.error("Gemini Error:", e);
                    return { success: false, text: "Error: Could not generate response." };
                }
                await new Promise(res => setTimeout(res, delay * (2 ** i)));
            }
        }
    };

    /* ==========================================================
       AI Project Explainer
    ========================================================== */
    document.querySelectorAll(".btn-ask-ai").forEach(button => {
        button.addEventListener("click", async () => {
            const modal = button.closest(".modal-content");
            if (!modal) return;

            const aiContainer = modal.querySelector(".gemini-response-container");
            const aiContent = modal.querySelector(".gemini-response-content");
            const btnText = button.querySelector(".button-text");
            const btnLoader = button.querySelector(".button-loader");

            aiContainer.style.display = "block";
            aiContent.innerHTML = `<i data-feather="loader" class="animate-spin"></i>`;
            initFeather();

            button.disabled = true;
            btnText.classList.add("hidden");
            btnLoader.classList.remove("hidden");

            const prompt = `
                Explain my project "${button.dataset.projectTitle}"
                to a recruiter. Description:
                "${button.dataset.projectDesc}"
            `;

            const systemInstruction =
                "Explain technical concepts in simple language for recruiter understanding.";

            const response = await callGeminiAPI(prompt, systemInstruction);

            aiContent.innerHTML = response.text?.replace(/\n/g, "<br>");
            button.disabled = false;

            btnText.classList.remove("hidden");
            btnLoader.classList.add("hidden");
        });
    });

    /* ==========================================================
       AI Contact Message Generator
    ========================================================== */
   // --- AI Contact Form Assistant (Premium Updated Version) ---
const generateMessageBtn = document.getElementById("gemini-pro-btn");
const aiPromptInput = document.getElementById("ai-prompt");
const messageTextarea = document.getElementById("message");
const geminiStatus = document.getElementById("gemini-status");
const contactNameInput = document.getElementById("name");

if (generateMessageBtn) {
    generateMessageBtn.addEventListener("click", async () => {

        const prompt = aiPromptInput.value.trim();
        const name = contactNameInput.value.trim() || "Sender";

        if (!prompt) {
            showGeminiStatus("Please enter a few keywords.", "error");
            return;
        }

        // Button elements
        const iconElement = generateMessageBtn.querySelector(".gemini-glass-icon");
        const loaderElement = generateMessageBtn.querySelector(".button-loader");

        toggleGeminiLoading(true, iconElement, loaderElement);
        showGeminiStatus("✨ Drafting message... please wait.", "success");

        // Gemini instructions
        const systemInstruction = `
            You are an AI assistant helping a visitor on Mohsin Haider Sultan's portfolio.
            Write a professional, friendly 3–4 sentence message from ${name}.
        `;

        const finalPrompt = `Keywords: "${prompt}". Sender Name: ${name}. Draft the message.`;

        // Call Gemini API
        const response = await callGeminiAPI(finalPrompt, systemInstruction);

        if (response.success) {
            messageTextarea.value = response.text.replace(/\*/g, "");
            showGeminiStatus("✨ Message drafted!", "success");
        } else {
            showGeminiStatus("❌ Error creating message. Try again.", "error");
        }

        toggleGeminiLoading(false, iconElement, loaderElement);
    });
}

/* -------------------------
   Helpers
--------------------------*/

// Status message animation + style
function showGeminiStatus(msg, type = "success") {
    geminiStatus.textContent = msg;
    geminiStatus.className = `form-status show ${type}`;

    setTimeout(() => geminiStatus.classList.remove("show"), 3500);
}

// Button loading animation switch
function toggleGeminiLoading(isLoading, icon, loader) {
    generateMessageBtn.disabled = isLoading;

    if (icon) icon.classList.toggle("hidden", isLoading);
    if (loader) loader.classList.toggle("hidden", !isLoading);

    // Re-render Feather icons safely
    if (typeof feather !== "undefined") {
        feather.replace();
    }
}



    /* ==========================================================
       Contact Form Handler
    ========================================================== */
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");

    if (contactForm) {

        const showStatus = (msg, type = "success") => {
            formStatus.textContent = msg;
            formStatus.className = `form-status show ${type}`;
            setTimeout(() => formStatus.classList.remove("show"), 4000);
        };

        const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

        const submitForm = async (name, email, msg) => {
            const data = new FormData();
            data.append("name", name);
            data.append("email", email);
            data.append("message", msg);

            try {
                const res = await fetch(contactForm.action, {
                    method: "POST",
                    headers: { Accept: "application/json" },
                    body: data
                });

                if (res.ok) {
                    localStorage.removeItem("offlineMessage");
                    showStatus("✅ Message sent!", "success");
                    return true;
                }

                const json = await res.json();
                const err = json.errors?.map(e => e.message).join(", ") || "Error sending message";
                showStatus(`❌ ${err}`, "error");
                return false;
            }
            catch (e) {
                if (!navigator.onLine) {
                    localStorage.setItem("offlineMessage", JSON.stringify({ name, email, msg }));
                    showStatus("⚠️ Offline — message saved.", "error");
                } else {
                    showStatus("❌ Network error.", "error");
                }
                return false;
            }
        };

        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector("button[type='submit']");
            const btnText = btn.querySelector(".button-text");
            const btnLoader = btn.querySelector(".button-loader");

            btn.disabled = true;
            btnText.classList.add("hidden");
            btnLoader.classList.remove("hidden");

            const name = contactForm.name.value.trim();
            const email = contactForm.email.value.trim();
            const msg = contactForm.message.value.trim();

            if (!name || !email || !msg) {
                showStatus("Please fill all fields.", "error");
                btn.disabled = false;
                btnText.classList.remove("hidden");
                btnLoader.classList.add("hidden");
                return;
            }

            if (!validEmail(email)) {
                showStatus("Invalid email format.", "error");
                btn.disabled = false;
                btnText.classList.remove("hidden");
                btnLoader.classList.add("hidden");
                return;
            }

            const ok = await submitForm(name, email, msg);
            if (ok) contactForm.reset();

            btn.disabled = false;
            btnText.classList.remove("hidden");
            btnLoader.classList.add("hidden");
        });

        // Offline auto-send
        window.addEventListener("online", async () => {
            const saved = localStorage.getItem("offlineMessage");
            if (saved) {
                const { name, email, msg } = JSON.parse(saved);
                showStatus("📤 Sending saved message...", "success");
                await submitForm(name, email, msg);
            }
        });
    }

    /* ==========================================================
       Scroll To Top Button
    ========================================================== */
    const scrollBtn = document.getElementById("scrollTopBtn");

    window.addEventListener("scroll", () => {
        scrollBtn.classList.toggle("show", window.scrollY > 400);
    });

    scrollBtn?.addEventListener("click", () =>
        window.scrollTo({ top: 0, behavior: "smooth" })
    );
});
