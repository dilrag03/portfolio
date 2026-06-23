(() => {
    "use strict";

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    /* Typed text effect */
    function initTypedText() {
        const el = $("#typed-text");
        if (!el) return;

        const roles = (el.dataset.phrases || "Developer").split("|").filter(Boolean);
        if (!roles.length) return;

        let roleIndex = 0;
        let charIndex = 0;
        let deleting = false;

        const type = () => {
            const current = roles[roleIndex];
            const displayed = deleting
                ? current.substring(0, charIndex - 1)
                : current.substring(0, charIndex + 1);

            el.textContent = displayed;

            if (!deleting) {
                charIndex++;
                if (charIndex === current.length) {
                    deleting = true;
                    setTimeout(type, 1800);
                    return;
                }
            } else {
                charIndex--;
                if (charIndex === 0) {
                    deleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                }
            }

            const speed = deleting ? 45 : 85;
            setTimeout(type, speed);
        };

        type();
    }

    /* Scroll reveal via IntersectionObserver */
    function initScrollReveal() {
        const elements = $$(".reveal");
        if (!elements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );

        elements.forEach((el, index) => {
            el.style.transitionDelay = `${Math.min(index * 35, 280)}ms`;
            observer.observe(el);
        });
    }

    /* Navbar scroll state + active section */
    function initNavbar() {
        const nav = $("#main-nav");
        const links = $$(".nav-link");
        const sections = $$("section[id]");

        const onScroll = () => {
            nav?.classList.toggle("scrolled", window.scrollY > 40);

            let current = "";
            sections.forEach((section) => {
                const top = section.offsetTop - 100;
                if (window.scrollY >= top) {
                    current = section.id;
                }
            });

            links.forEach((link) => {
                const href = link.getAttribute("href")?.slice(1);
                link.classList.toggle("active", href === current);
            });
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        links.forEach((link) => {
            link.addEventListener("click", (e) => {
                const href = link.getAttribute("href");
                if (href?.startsWith("#")) {
                    e.preventDefault();
                    const target = $(href);
                    if (target) {
                        target.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                    const collapse = $("#navMenu");
                    if (collapse?.classList.contains("show")) {
                        bootstrap.Collapse.getOrCreateInstance(collapse).hide();
                    }
                }
            });
        });
    }

    /* Project modals */
    function initProjectModals() {
        const modalEl = $("#projectModal");
        if (!modalEl) return;

        const modal = new bootstrap.Modal(modalEl);
        const title = $("#projectModalTitle");
        const description = $("#projectModalDescription");
        const details = $("#projectModalDetails");
        const tags = $("#projectModalTags");
        const imageWrap = $("#projectModalImageWrap");
        const githubBtn = $("#projectModalGithub");
        const demoBtn = $("#projectModalDemo");

        const openModal = (card) => {
            const data = card.dataset;
            if (title) title.textContent = data.title || "";
            if (description) description.textContent = data.description || "";
            if (details) details.textContent = data.details || "";

            if (tags) {
                tags.innerHTML = (data.tags || "")
                    .split(",")
                    .filter(Boolean)
                    .map((t) => `<span class="tag">${t.trim()}</span>`)
                    .join("");
            }

            if (imageWrap) {
                imageWrap.innerHTML = data.image
                    ? `<img src="/${data.image}" alt="${data.title || "Project"}" />`
                    : "";
            }

            if (githubBtn) {
                const url = data.github || "";
                githubBtn.style.display = url ? "inline-flex" : "none";
                githubBtn.href = url;
            }

            if (demoBtn) {
                const url = data.demo || "";
                demoBtn.style.display = url ? "inline-flex" : "none";
                demoBtn.href = url;
            }

            modal.show();
        };

        $$(".btn-project-details").forEach((btn) => {
            btn.addEventListener("click", () => {
                const card = btn.closest(".project-card");
                if (card) openModal(card);
            });
        });

        $$(".project-card").forEach((card) => {
            card.addEventListener("click", (e) => {
                if (e.target.closest("button")) return;
                openModal(card);
            });
        });
    }

    /* Contact form - FormSubmit email delivery + clipboard copy */
    function initContactForm() {
        const form = $("#contact-form");
        const pageData = $("#profile-data");
        const portfolioEmail = pageData?.dataset.email || "";
        const feedback = $("#contact-feedback");

        form?.addEventListener("submit", async (e) => {
            e.preventDefault();

            const submitButton = form.querySelector('button[type="submit"]');
            const name = $("#contact-name")?.value.trim() || "";
            const email = $("#contact-email")?.value.trim() || "";
            const subject = $("#contact-subject")?.value.trim() || "Portfolio Contact";
            const message = $("#contact-message")?.value.trim() || "";

            if (!name || !email || !subject || !message) {
                form.classList.add("was-validated");
                return;
            }

            if (!/^[^@\s]+@gmail\.com$/i.test(email)) {
                if (feedback) feedback.textContent = "Please use a Gmail address to connect.";
                $("#contact-email")?.focus();
                return;
            }

            const endpoint = form.dataset.endpoint;
            if (!endpoint) {
                if (feedback) feedback.textContent = `Email me at ${portfolioEmail}.`;
                return;
            }

            const payload = new FormData(form);
            payload.set("_subject", `Portfolio contact: ${subject}`);
            payload.set("message", `${message}\n\nSender Gmail: ${email}`);

            try {
                if (submitButton) submitButton.disabled = true;
                if (feedback) feedback.textContent = "Sending your message...";

                const response = await fetch(endpoint, {
                    method: "POST",
                    body: payload,
                    headers: { Accept: "application/json" }
                });

                if (!response.ok) throw new Error("Form submission failed");

                form.reset();
                if (feedback) {
                    feedback.textContent = "Message sent. I will receive it in Gmail.";
                }
            } catch {
                if (feedback) {
                    feedback.textContent = `Message could not be sent here. Email me at ${portfolioEmail}.`;
                }
            } finally {
                if (submitButton) submitButton.disabled = false;
            }
        });

        const copyButtons = [$("#btn-copy-email"), $("#btn-copy-contact-email")].filter(Boolean);

        copyButtons.forEach((copyBtn) => copyBtn.addEventListener("click", async () => {
            const email = copyBtn.dataset.email || portfolioEmail;
            if (!email) return;

            try {
                await navigator.clipboard.writeText(email);
                if (feedback) {
                    feedback.textContent = "Email copied to clipboard.";
                }
            } catch {
                if (feedback) {
                    feedback.textContent = `Email: ${email}`;
                }
            }
        }));
    }

    document.addEventListener("DOMContentLoaded", () => {
        initTypedText();
        initScrollReveal();
        initNavbar();
        initProjectModals();
        initContactForm();
    });
})();
