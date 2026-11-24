/* ═══════════════════════════════════════════════════════════
   SHAMBHAVI KUMARI — PORTFOLIO SCRIPTS
   Scroll animations, velocity skew, smooth nav, reveals
   ═══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ── SMOOTH SCROLL FOR NAV LINKS ───────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Update active nav
            document.querySelectorAll('.nav-link').forEach(l => {
                l.classList.remove('active');
                l.removeAttribute('aria-current');
            });
            this.classList.add('active');
            this.setAttribute('aria-current', 'page');
        });
    });

    // ── SCROLL-VELOCITY SKEW ──────────────────────────────
    // Mimics Lenis scroll-velocity skew from the reference site
    let lastScroll = window.scrollY;
    let skewTarget = 0;
    let skewCurrent = 0;
    let ticking = false;

    function updateSkew() {
        const currentScroll = window.scrollY;
        const velocity = currentScroll - lastScroll;
        lastScroll = currentScroll;

        // Clamp velocity to a reasonable range
        skewTarget = Math.max(-3, Math.min(3, velocity * 0.04));

        ticking = false;
    }

    function animateSkew() {
        skewCurrent += (skewTarget - skewCurrent) * 0.1;

        // Apply to skew elements
        const skewElements = document.querySelectorAll('.intro-scroll-skew, .tech-marquee-skew');
        skewElements.forEach(el => {
            el.style.setProperty('--scroll-skew', `${skewCurrent}deg`);
        });

        // Decay target
        skewTarget *= 0.95;

        requestAnimationFrame(animateSkew);
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateSkew);
            ticking = true;
        }
    }, { passive: true });

    animateSkew();

    // ── SCROLL REVEAL (IntersectionObserver) ──────────────
    const revealElements = [];

    // Add reveal class to elements that should animate in
    const selectors = [
        '.section-eyebrow',
        '.section-display',
        '.personal-eyebrow',
        '.personal-heading',
        '.work-item',
        '.cta-heading',
        '.cta-body',
        '.cta-band .button',
        '.bento-card',
        '.block-header',
        '.resume-header-row',
        '.footer-intro',
        '.footer-contact',
        '.footer-copyright'
    ];

    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach((el, i) => {
            el.classList.add('reveal');
            // Stagger within groups
            const delay = Math.min(i, 4);
            if (delay > 0) {
                el.classList.add(`reveal-delay-${delay}`);
            }
            revealElements.push(el);
        });
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ── ACTIVE NAV ON SCROLL ──────────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                        link.setAttribute('aria-current', 'page');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
    });

    sections.forEach(section => navObserver.observe(section));

    // ── PROJECT DETAIL MODAL ──────────────────────────────
    const projectDetails = {
        chorus: {
            meta: 'Voice-of-Customer Copilot · Nov 2026',
            title: 'Chorus.AI',
            summary: 'AI copilot that turns scattered customer feedback into a revenue-ranked, source-cited roadmap.',
            bullets: [
                'Built a copilot that ranks 12 themes from 520 comments (5 channels, 69 accounts; synthetic data) by RICE and revenue at risk, lifting the lowest-volume theme (17 mentions) to 3rd with $67k at risk.',
                'Set quality targets before shipping: a 40-case test set (intent F1 0.87, theme F1 0.95) and a fixed two-level theme taxonomy that cut theme reassignment between runs from 38% to 6%.',
                'Verified 48 of 48 displayed customer quotes word-for-word against source data, so no evidence is invented; shipped a live React/TypeScript app with a dashboard, cited Q&A, daily digest and one-click PRD.'
            ],
            stack: ['React', 'TypeScript', 'AI Evals', 'RICE Prioritisation', 'LLM'],
            live: 'https://chorus-ai-voc.vercel.app/',
            github: 'https://github.com/shambhavi999/Chorus.ai'
        },
        meesho: {
            meta: 'Independent Audit · Sep 2026',
            title: 'Meesho Voice Search Audit',
            summary: 'Independent audit of Meesho’s voice shopping, the entry point for its vernacular first-time users.',
            bullets: [
                'Exposed that voice search returned unrelated products for 7 of 7 support and off-topic requests ("where is my order?" returned clotheslines), scoring 28 Hindi, Hinglish and English queries (10 Pass, 10 Partial, 8 Fail).',
                'Prototyped a fix (support routing, "cheapest" sorting, follow-up memory) that passed 26 of 28 audited queries versus 10 of 28 observed on Meesho, but only 11 of 20 unseen ones; recommended a trained intent classifier over rules.',
                'Ranked fixes with RICE, putting support routing above the more visible vernacular-spelling problem; published a live case study with a working demo and 29 screenshots.'
            ],
            stack: ['Product Audit', 'AI Evaluation', 'Voice-of-Customer', 'RICE'],
            live: 'https://meesho-voice-search-audit.vercel.app/',
            github: 'https://github.com/shambhavi999/meesho-voice-search-audit'
        },
        dec8: {
            meta: 'Beta Testing · 2026 – Present',
            title: 'Dec8 Rider App',
            summary: 'Real-time delivery dispatch & routing app for Dec8’s digital commerce platform.',
            bullets: [
                'Developed a rider delivery app for Dec8’s digital commerce platform, enabling riders to accept delivery requests, follow routes, and confirm handover, now in beta testing.',
                'Engineered real-time order dispatch using Supabase Realtime and Firebase Cloud Messaging push notifications, with scheduled background jobs and PostgreSQL Row-Level Security for role-based access.',
                'Implemented Google Maps Routes API in a dispatch optimizer that plans efficient multi-order delivery routes, validated through a staged rollout.'
            ],
            stack: ['TypeScript', 'React', 'Supabase', 'PostgreSQL', 'Firebase Cloud Messaging', 'Google Maps Routes API'],
            github: 'https://github.com/shambhavi999'
        },
        nyaai: {
            meta: 'AI Legal Justice Platform · May 2026',
            title: 'NYAAI',
            summary: 'Full-stack AI platform that detects legal violations and auto-generates court-ready notices.',
            bullets: [
                'Built a full-stack AI platform using RAG architecture and LangChain to detect legal violations and auto-generate court-ready notices from natural language input.',
                'Implemented Retrieval-Augmented Generation (RAG) pipeline with vector database integration for context-aware legal document retrieval and accurate information extraction.',
                'Integrated OCR pipeline with multilingual IndicNLP support to process scanned legal documents across multiple Indian languages, improving document accessibility.'
            ],
            stack: ['Python', 'Django', 'LangChain', 'RAG', 'PostgreSQL', 'Celery', 'REST APIs', 'OCR', 'IndicNLP'],
            live: 'https://nyaai.onrender.com/',
            github: 'https://github.com/shambhavi999/NYAAI'
        },
        interntrack: {
            meta: 'Full-Stack Productivity Web App · Mar 2026',
            title: 'InternTrack',
            summary: 'Full-stack web application for internship tracking, project management, and productivity monitoring.',
            bullets: [
                'Developed a full-stack web application for internship tracking, project management, and productivity monitoring with real-time analytics dashboard.',
                'Implemented secure authentication, role-based session handling, and optimized database queries using Django ORM for efficient data management.',
                'Integrated RESTful APIs with PostgreSQL backend for real-time data flow and performance tracking.'
            ],
            stack: ['Python', 'Django', 'HTML', 'CSS', 'JavaScript', 'PostgreSQL', 'Django ORM', 'REST APIs'],
            live: 'https://interntrack-uect.onrender.com/',
            github: 'https://github.com/shambhavi999/InternTrack'
        },
        serenova: {
            meta: 'HuggingFace Hub · Live Gradio Demo · 2026',
            title: 'Serenova AI',
            summary: 'Fine-tuned BERT-based machine learning model deployed on HuggingFace Hub.',
            bullets: [
                'Deployed Serenova AI on HuggingFace Hub with a live interactive Gradio demo.',
                'Achieved 83%+ accuracy using a fine-tuned BERT-based architecture.',
                'Built as part of applied NLP & Deep Learning work alongside Google Cloud Generative AI training.'
            ],
            stack: ['Python', 'BERT', 'PyTorch', 'HuggingFace', 'Gradio', 'NLP'],
            github: 'https://github.com/shambhavi999'
        },
        fruitripeness: {
            meta: 'Packhouse Quality Control · Live Streamlit App',
            title: 'Fruit Ripeness Grader (FruitScan.)',
            summary: 'Multi-crop fruit ripeness grading and packhouse quality control system using Ordinal Regression (CORN) and Grad-CAM explainability.',
            bullets: [
                'Grades biological ripeness across 4 crops (Banana 97.93% acc, Tomato 97.73% ordinal acc & 96.82% damage acc, Avocado 86.89% acc, Strawberry 76.19% acc) using MobileNetV2 and Conditional Ordinal Regression (CORN loss).',
                'Maps predictions to USDA / UNECE commercial packhouse grades (Class 1 / Extra, Class 1 Fresh Market, Class 2 / Processing, Cull / Reject) with shelf-life and storage protocols.',
                'Includes Single Specimen Diagnostic, Bulk Crate / Conveyor Batch QC with CSV audit export, and interactive Grad-CAM Explainability Studio.'
            ],
            stack: ['Python', 'PyTorch', 'MobileNetV2', 'CORN (coral-pytorch)', 'Grad-CAM', 'Streamlit'],
            live: 'https://fruit-ripeness-grader.streamlit.app/',
            github: 'https://github.com/shambhavi999/Fruit-Ripeness-Grader'
        },
        ingres: {
            meta: 'Neuro-Symbolic Policy Simulator · Live Streamlit App',
            title: 'INGRES-ai',
            summary: 'Neuro-symbolic groundwater policy simulator for India combining Google TimesFM 2.5, Structural Causal Inference, Groq, and Gemini.',
            bullets: [
                'Combines Google TimesFM 2.5 baseline groundwater-stage forecasts with a Structural Causal Inference intervention model to explore counterfactual policy scenarios across Indian administrative blocks.',
                'Supports Natural Language Chat (Groq parameter extraction + Gemini policy explanations) and a Direct Parameter Simulator for crop diversification & micro-irrigation, artificial recharge, and power subsidy rationalization.',
                'Built with FastAPI backend endpoints, Next.js frontend, and a live Streamlit application displaying GEC-2015 groundwater categories and year-by-year projections.'
            ],
            stack: ['Python', 'PyTorch', 'Google TimesFM 2.5', 'Causal Inference', 'Groq', 'Gemini', 'FastAPI', 'Next.js', 'Streamlit'],
            live: 'https://ingres-ai.streamlit.app/',
            github: 'https://github.com/shambhavi999/INGRES-ai'
        }
    };

    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const modalMeta = document.getElementById('modalMeta');
    const modalTitle = document.getElementById('modalTitle');
    const modalSummary = document.getElementById('modalSummary');
    const modalBullets = document.getElementById('modalBullets');
    const modalStack = document.getElementById('modalStack');
    const modalActions = document.getElementById('modalActions');

    function openProjectModal(key) {
        const data = projectDetails[key];
        if (!data || !modal) return;
        modalMeta.textContent = data.meta;
        modalTitle.textContent = data.title;
        modalSummary.textContent = data.summary;
        modalBullets.innerHTML = data.bullets.map(b => `<li>${b}</li>`).join('');
        modalStack.innerHTML = data.stack.map(s => `<span class="modal-stack-pill">${s}</span>`).join('');
        const liveButton = data.live ? `
            <a href="${data.live}" target="_blank" rel="noopener" class="button button-dark">
                View Live Site
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
        ` : '';
        const githubClass = data.live ? 'button button-outline' : 'button button-dark';
        modalActions.innerHTML = `
            ${liveButton}
            <a href="${data.github}" target="_blank" rel="noopener" class="${githubClass}">
                View on GitHub
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
        `;
        modal.showModal();
    }

    if (modal && modalClose) {
        modalClose.addEventListener('click', () => modal.close());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.close();
        });
    }

    document.querySelectorAll('.work-stage').forEach(stage => {
        stage.addEventListener('click', () => {
            const isDetail = stage.getAttribute('data-detail') === 'true';
            stage.setAttribute('data-detail', (!isDetail).toString());
            const projectKey = stage.getAttribute('data-project');
            if (projectKey) {
                openProjectModal(projectKey);
            }
        });
    });

    // ── MOBILE BENTO CAROUSEL GRAB SCROLL ─────────────────
    const bentoGrid = document.querySelector('.bento-grid');
    if (bentoGrid) {
        let isDown = false;
        let startX;
        let scrollLeft;

        bentoGrid.addEventListener('mousedown', (e) => {
            isDown = true;
            bentoGrid.style.cursor = 'grabbing';
            startX = e.pageX - bentoGrid.offsetLeft;
            scrollLeft = bentoGrid.scrollLeft;
        });

        bentoGrid.addEventListener('mouseleave', () => {
            isDown = false;
            bentoGrid.style.cursor = 'grab';
        });

        bentoGrid.addEventListener('mouseup', () => {
            isDown = false;
            bentoGrid.style.cursor = 'grab';
        });

        bentoGrid.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - bentoGrid.offsetLeft;
            const walk = (x - startX) * 2;
            bentoGrid.scrollLeft = scrollLeft - walk;
        });
    }

    // ── MARQUEE PAUSE ON VISIBILITY ───────────────────────
    const marqueeTrack = document.querySelector('.reviews-marquee-track');
    if (marqueeTrack) {
        const marqueeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    marqueeTrack.style.animationPlayState = 'running';
                } else {
                    marqueeTrack.style.animationPlayState = 'paused';
                }
            });
        }, { threshold: 0.1 });

        marqueeObserver.observe(marqueeTrack);
    }

    // ── DYNAMIC YEAR IN COPYRIGHT ─────────────────────────
    const copyrightEl = document.querySelector('.footer-copyright');
    if (copyrightEl) {
        const year = new Date().getFullYear();
        copyrightEl.textContent = `© ${year} Shambhavi Kumari. All rights reserved.`;
    }

    // ── PRELOAD INTERACTIVITY ─────────────────────────────
    // Add loaded class after page load for entrance animations
    window.addEventListener('load', () => {
        document.body.classList.add('is-loaded');
    });

})();
