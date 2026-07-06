/* ============================================================
   DEVAL SONANI — PORTFOLIO JS ENGINE
   Particles, typing, counters, tabs, skill bars, scroll reveals
   ============================================================ */

(function () {
    'use strict';

    // ---- PARTICLES ----
    var canvas = document.getElementById('particles');
    var ctx = canvas.getContext('2d');
    var particles = [];
    var mx = 0, my = 0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function Particle() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.sz = Math.random() * 1.6 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.op = Math.random() * 0.4 + 0.1;
    }
    Particle.prototype.update = function () {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    };
    Particle.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(100,255,218,' + this.op + ')';
        ctx.fill();
    };

    var count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 14000), 100);
    for (var i = 0; i < count; i++) particles.push(new Particle());

    function animLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var d = Math.sqrt(dx * dx + dy * dy);
                if (d < 140) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(100,255,218,' + (0.055 * (1 - d / 140)) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
            // mouse lines
            var dmx = particles[i].x - mx;
            var dmy = particles[i].y - my;
            var dm = Math.sqrt(dmx * dmx + dmy * dmy);
            if (dm < 180) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mx, my);
                ctx.strokeStyle = 'rgba(100,255,218,' + (0.1 * (1 - dm / 180)) + ')';
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
        requestAnimationFrame(animLoop);
    }
    animLoop();

    // ---- CURSOR GLOW ----
    var glow = document.getElementById('cursorGlow');
    document.addEventListener('mousemove', function (e) {
        mx = e.clientX;
        my = e.clientY;
        if (glow) {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        }
    });

    // ---- TYPING EFFECT ----
    var typedEl = document.getElementById('typedText');
    var phrases = [
        "distributed systems.",
        "scalable architectures.",
        "high-throughput APIs.",
        "great user experiences.",
        "clean code & best practices."
    ];
    var pi = 0, ci = 0, deleting = false;

    function typeLoop() {
        var cur = phrases[pi];
        if (deleting) {
            ci--;
            typedEl.textContent = cur.substring(0, ci);
        } else {
            ci++;
            typedEl.textContent = cur.substring(0, ci);
        }
        var speed = deleting ? 30 : 60;
        if (!deleting && ci === cur.length) {
            speed = 2000;
            deleting = true;
        } else if (deleting && ci === 0) {
            deleting = false;
            pi = (pi + 1) % phrases.length;
            speed = 400;
        }
        setTimeout(typeLoop, speed);
    }
    typeLoop();

    // ---- SCROLL REVEALS ----
    var reveals = document.querySelectorAll('.anim-reveal');
    var revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) e.target.classList.add('visible');
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    reveals.forEach(function (el) { revealObs.observe(el); });

    // ---- COUNTER ANIMATION ----
    var counters = document.querySelectorAll('.stat-num');
    var countObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                var el = e.target;
                var target = parseFloat(el.getAttribute('data-target'));
                var dec = target % 1 !== 0;
                var start = performance.now();
                var dur = 2000;
                function tick(now) {
                    var p = Math.min((now - start) / dur, 1);
                    var ease = 1 - Math.pow(1 - p, 3);
                    el.textContent = dec ? (ease * target).toFixed(1) : Math.floor(ease * target);
                    if (p < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
                countObs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { countObs.observe(el); });

    // ---- SKILL BARS ----
    var skillCards = document.querySelectorAll('.skill-card');
    var skillObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                var fills = e.target.querySelectorAll('.fill');
                fills.forEach(function (f, idx) {
                    setTimeout(function () {
                        f.style.width = f.getAttribute('data-w') + '%';
                    }, idx * 100);
                });
                skillObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.2 });
    skillCards.forEach(function (c) { skillObs.observe(c); });

    // ---- EXPERIENCE TABS ----
    var tabs = document.querySelectorAll('.exp-tab');
    var panels = document.querySelectorAll('.exp-panel');
    var slider = document.getElementById('tabSlider');

    function activateTab(tab) {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        var panel = document.getElementById('panel-' + tab.getAttribute('data-tab'));
        if (panel) panel.classList.add('active');
        // Move slider
        if (slider) {
            var isVert = window.innerWidth > 900;
            if (isVert) {
                slider.style.top = tab.offsetTop + 'px';
                slider.style.height = tab.offsetHeight + 'px';
                slider.style.left = '-2px';
                slider.style.width = '2px';
            } else {
                slider.style.left = tab.offsetLeft + 'px';
                slider.style.width = tab.offsetWidth + 'px';
                slider.style.top = '';
                slider.style.height = '2px';
                slider.style.bottom = '-2px';
            }
        }
    }

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () { activateTab(tab); });
    });
    // Init slider position
    var firstTab = document.querySelector('.exp-tab.active');
    if (firstTab) setTimeout(function () { activateTab(firstTab); }, 150);

    // ---- NAVBAR SCROLL ----
    var navbar = document.getElementById('navbar');
    var sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        var cur = '';
        sections.forEach(function (sec) {
            if (window.scrollY >= sec.offsetTop - 120) {
                cur = sec.getAttribute('id');
            }
        });
        document.querySelectorAll('.nav-link').forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === cur) link.classList.add('active');
        });
    });

    // ---- SMOOTH SCROLL ----
    var navLinks = document.getElementById('navLinks');
    var hamburger = document.getElementById('hamburger');

    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            var id = this.getAttribute('href');
            if (id === '#') return;
            var el = document.querySelector(id);
            if (el) {
                var nh = navbar.offsetHeight;
                window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - nh, behavior: 'smooth' });
                if (navLinks) navLinks.classList.remove('open');
                if (hamburger) hamburger.classList.remove('active');
            }
        });
    });

    // ---- HAMBURGER ----
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });
        document.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

})();
