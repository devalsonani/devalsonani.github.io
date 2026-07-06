/* ========================================
   DEVAL SONANI — PREMIUM PORTFOLIO ENGINE
   Interactive animations, particles, typing,
   counters, tabs, skill bars, scroll reveals.
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // 1. PARTICLE CONSTELLATION BACKGROUND
    // =============================================
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0, mouseY = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.8 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(100, 255, 218, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(100, 255, 218, ${0.06 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
            // Mouse connection
            const dxM = particles[i].x - mouseX;
            const dyM = particles[i].y - mouseY;
            const distM = Math.sqrt(dxM * dxM + dyM * dyM);
            if (distM < 200) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouseX, mouseY);
                ctx.strokeStyle = `rgba(100, 255, 218, ${0.12 * (1 - distM / 200)})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // =============================================
    // 2. CURSOR GLOW FOLLOW
    // =============================================
    const cursorGlow = document.getElementById('cursorGlow');
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursorGlow) {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        }
    });

    // =============================================
    // 3. TYPING EFFECT
    // =============================================
    const typedEl = document.getElementById('typedText');
    const phrases = [
        'distributed systems.',
        'scalable microservices.',
        'high-throughput backends.',
        'real-time data pipelines.',
        'AI-powered solutions.',
    ];
    let phraseIndex = 0, charIndex = 0, isDeleting = false;

    function typeEffect() {
        const current = phrases[phraseIndex];
        if (isDeleting) {
            typedEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 35 : 65;

        if (!isDeleting && charIndex === current.length) {
            speed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 400;
        }
        setTimeout(typeEffect, speed);
    }
    typeEffect();

    // =============================================
    // 4. SCROLL REVEAL (IntersectionObserver)
    // =============================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));

    // =============================================
    // 5. ANIMATED COUNTERS (Stats)
    // =============================================
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.dataset.target);
                const isDecimal = target % 1 !== 0;
                const duration = 2000;
                const start = performance.now();

                function updateCounter(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                    const current = eased * target;

                    el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);

                    if (progress < 1) requestAnimationFrame(updateCounter);
                }
                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

    // =============================================
    // 6. SKILL BAR ANIMATIONS
    // =============================================
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = entry.target.querySelectorAll('.skill-fill');
                fills.forEach((fill, i) => {
                    setTimeout(() => {
                        fill.style.width = fill.dataset.level + '%';
                    }, i * 100);
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.skill-category').forEach(cat => skillObserver.observe(cat));

    // =============================================
    // 7. EXPERIENCE TABS
    // =============================================
    const tabs = document.querySelectorAll('.exp-tab');
    const panels = document.querySelectorAll('.exp-panel');
    const indicator = document.querySelector('.tab-indicator');

    function setActiveTab(tab) {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');

        const targetPanel = document.getElementById('panel-' + tab.dataset.tab);
        if (targetPanel) targetPanel.classList.add('active');

        // Move indicator
        if (indicator) {
            const tabList = tab.parentElement;
            const isVertical = window.innerWidth > 900;
            if (isVertical) {
                indicator.style.top = tab.offsetTop + 'px';
                indicator.style.height = tab.offsetHeight + 'px';
                indicator.style.left = '-2px';
                indicator.style.width = '2px';
            } else {
                indicator.style.left = tab.offsetLeft + 'px';
                indicator.style.width = tab.offsetWidth + 'px';
                indicator.style.top = 'unset';
                indicator.style.height = '2px';
            }
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => setActiveTab(tab));
    });

    // Init indicator position
    const firstActiveTab = document.querySelector('.exp-tab.active');
    if (firstActiveTab) setTimeout(() => setActiveTab(firstActiveTab), 100);

    // =============================================
    // 8. NAVBAR SCROLL EFFECTS
    // =============================================
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        // Glass effect
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section tracking
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });

    // =============================================
    // 9. SMOOTH SCROLLING (with navbar offset)
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const navHeight = navbar.offsetHeight;
                const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });

                // Close mobile menu
                navLinks.classList.remove('open');
                hamburger.classList.remove('active');
            }
        });
    });

    // =============================================
    // 10. MOBILE HAMBURGER MENU
    // =============================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

});
