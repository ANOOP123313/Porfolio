/* ═══════════════════════════════════════════
   ANOOP S R PORTFOLIO — SCRIPT.JS
═══════════════════════════════════════════ */

"use strict";

/* ── Loader ─────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  const fill = document.getElementById('loaderFill');
  const text = document.getElementById('loaderText');
  if (!loader || !fill || !text) return;

  const steps = [
    { pct: 20, msg: 'Loading assets…' },
    { pct: 55, msg: 'Building interface…' },
    { pct: 80, msg: 'Applying effects…' },
    { pct: 100, msg: 'Almost ready…' },
  ];

  let i = 0;
  const tick = setInterval(() => {
    if (i >= steps.length) {
      clearInterval(tick);
      setTimeout(() => {
        loader.classList.add('hidden');
        revealHero();
      }, 400);
      return;
    }
    fill.style.width = steps[i].pct + '%';
    text.textContent = steps[i].msg;
    i++;
  }, 420);
})();

/* ── Custom Cursor ──────────────────────── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursorTrail');
  if (!cursor || !trail) return;
  let tx = 0, ty = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    cursor.style.left = tx + 'px';
    cursor.style.top = ty + 'px';
  });

  (function loop() {
    cx += (tx - cx) * 0.14;
    cy += (ty - cy) * 0.14;
    trail.style.left = cx + 'px';
    trail.style.top = cy + 'px';
    requestAnimationFrame(loop);
  })();
})();

/* ── Theme Toggle ───────────────────────── */
(function initTheme() {
  const btn = document.getElementById('themeToggle');
  const body = document.body;
  if (!btn) return;
  const saved = localStorage.getItem('asr-theme') || 'dark';
  if (saved === 'light') body.classList.replace('dark-theme', 'light-theme');

  btn.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
      body.classList.replace('dark-theme', 'light-theme');
      localStorage.setItem('asr-theme', 'light');
    } else {
      body.classList.replace('light-theme', 'dark-theme');
      localStorage.setItem('asr-theme', 'dark');
    }
  });
})();

/* ── Nav scroll + hamburger ─────────────── */
(function initNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('navHamburger');
  const mMenu = document.getElementById('mobileMenu');
  const mobLinks = document.querySelectorAll('.mob-link');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  if (hamburger && mMenu) {
    hamburger.addEventListener('click', () => mMenu.classList.toggle('open'));
    mobLinks.forEach(l => l.addEventListener('click', () => mMenu.classList.remove('open')));
  }
})();

/* ── Hero Canvas — Particle field ───────── */
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); createParticles(); }, { passive: true });

  function createParticles() {
    particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.1 + 0.3,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      alpha: Math.random() * 0.45 + 0.1,
    }));
  }
  createParticles();

  let mouseX = W / 2, mouseY = H / 2;
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    mouseY = e.clientY - r.top;
  }, { passive: true });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.vx += (mouseX - p.x) * 0.00004;
      p.vy += (mouseY - p.y) * 0.00004;
      p.vx *= 0.99; p.vy *= 0.99;
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(10,255,157,${p.alpha})`;
      ctx.fill();
    });
    particles.forEach((a, i) => {
      particles.slice(i + 1).forEach(b => {
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(10,255,157,${0.1 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      });
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── Hero Card parallax ─────────────────── */
(function initHeroCard() {
  const card = document.getElementById('heroCard');
  if (!card) return;
  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx, dy = (e.clientY - cy) / cy;
    card.style.transform = `translateY(-50%) rotateY(${dx * 7}deg) rotateX(${-dy * 7}deg) translateZ(18px)`;
  }, { passive: true });
})();

/* ── Hero stagger reveal ────────────────── */
function revealHero() {
  document.querySelectorAll('.hero .reveal-stagger').forEach((el, i) => {
    setTimeout(() => el.classList.add('revealed'), 100 + i * 160);
  });
}

/* ── Intersection Observer — scroll reveals ─ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('revealed'), delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
})();

/* ── Skill bars animation ───────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.width = entry.target.dataset.width + '%';
        }, 200);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(el => obs.observe(el));
})();

/* ── 3D Tilt on project cards ───────────── */
(function initTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      card.style.transform = `perspective(800px) rotateX(${-y * 9}deg) rotateY(${x * 9}deg) translateZ(18px)`;
      card.style.boxShadow = `${-x * 18}px ${-y * 18}px 50px rgba(0,0,0,0.35)`;
      const glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.setProperty('--mouse-x', ((e.clientX - rect.left) / rect.width * 100).toFixed(2) + '%');
        glow.style.setProperty('--mouse-y', ((e.clientY - rect.top) / rect.height * 100).toFixed(2) + '%');
      }
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
})();

/* ---------- CONTACT FORM (EMAILJS) ---------- */
(function () {
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js";
  script.onload = () => {
    emailjs.init("vqfWlRQpc7Z57eu4a");   // ✔ CHANGE THIS
  };
  document.body.appendChild(script);
})();

const form = document.getElementById("contactForm");
const statusMsg = document.getElementById("formStatus");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    statusMsg.textContent = "Sending...";

    emailjs.sendForm(
      "service_f9kcwge",      // ✔ CHANGE THIS
      "template_5gyd4cj",     // ✔ CHANGE THIS
      form
    ).then(() => {
      statusMsg.textContent = "Message sent successfully!";
      form.reset();
    }).catch(() => {
      statusMsg.textContent = "Sending failed. Try again.";
    });
  });
}

/* ── Parallax orbs on scroll ────────────── */
(function initParallax() {
  const orbs = document.querySelectorAll('.floating-orb');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    orbs.forEach((orb, i) => {
      orb.style.transform = `translateY(${y * [0.07, 0.05, 0.11][i]}px)`;
    });
  }, { passive: true });
})();

/* ── Scroll progress bar ────────────────── */
(function initProgressBar() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position:fixed;top:0;left:0;height:2px;width:0%;
    background:linear-gradient(90deg,var(--accent),var(--accent2));
    z-index:9999;transition:width 0.1s linear;pointer-events:none;
  `;
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
})();

/* ── Active nav link on scroll ──────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(l => {
      l.style.color = l.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
    });
  }, { passive: true });
})();

/* ═══════════════════════════════════════════
   PROJECT DATA — For Dynamic Details Page
═══════════════════════════════════════════ */
const projectData = {
  mpact: {
    title: "Mpact",
    description: "Full-stack e-commerce app with parallax scrolling, product listing, cart management, user authentication, and secure checkout. Focused on responsive design and performance optimization.",
    role: "Full-Stack Developer",
    duration: "3 months",
    previewImage: "images/Mpact.png",
    images: [
      "images/Mpact/gallery1.png",
      "images/Mpact/gallery2.png",
      "images/Mpact/gallery3.png"
    ],
    tech: ["MongoDB", "Express.js", "React.js", "Node.js", "Tailwind CSS", "Stripe API"],
    fullDescription: "Mpact is a modern e-commerce platform designed to provide users with a seamless shopping experience. The application features a product browsing interface with parallax scrolling effects, a fully functional shopping cart system, user authentication, and secure payment processing. Built with React for the frontend and Node.js with Express for the backend, the platform demonstrates clean code practices and responsive design principles.",
    highlights: [
      "Parallax scrolling effects for enhanced UX",
      "Shopping cart with persistent state management",
      "Secure user authentication system",
      "Stripe payment integration",
      "Mobile-responsive design",
      "Performance optimization"
    ],
    liveLink: "#",
    githubLink: "#"
  },
  denstack: {
    title: "DENSTACK",
    description: "Hospital management system for patient records, appointment scheduling, sub-clinic management, sales tracking, and comprehensive reporting with secure data handling.",
    role: "Full-Stack Developer",
    duration: "4 months",
    previewImage: "images/Denstack.png",
    images: [
      "images/Denstack/gallery1.png",
      "images/Denstack/gallery2.png",
      "images/Denstack/gallery3.png",
      "images/Denstack/gallery4.png"
    ],
    tech: ["MongoDB", "Express.js", "React.js", "Node.js", "Chart.js", "JWT Auth"],
    fullDescription: "DENSTACK is a comprehensive hospital management system designed to streamline operations and improve patient care. The platform manages patient records, schedules appointments across multiple sub-clinics, tracks sales and inventory, and provides detailed reporting and analytics. Built with enterprise-level security practices including JWT authentication and encrypted data storage.",
    highlights: [
      "Patient record management system",
      "Appointment scheduling across clinics",
      "Sales and inventory tracking",
      "Comprehensive analytics dashboards",
      "Multi-user role-based access control",
      "Secure data handling and encryption"
    ],
    liveLink: "#",
    githubLink: "#"
  },
  restaurant: {
    title: "Restaurant Billing System",
    description: "Team-built billing system with menu management, customer orders, and transaction handling using RESTful APIs. Improves billing accuracy and speed for restaurant staff.",
    role: "Full-Stack Developer (Team Project)",
    duration: "2 months",
    previewImage: "images/Restaurant.png",
    images: [
      "images/Restaurant.png",
      "images/Restaurant.png",
      "images/Restaurant.png"
    ],
    tech: ["MongoDB", "Express.js", "React.js", "Node.js", "Receipt Printer API"],
    fullDescription: "A robust billing system designed specifically for restaurant operations. The system features menu management capabilities, real-time order processing, and automated bill generation with receipt printing. Developed as a team project, it demonstrates collaborative development practices and API integration expertise.",
    highlights: [
      "Menu management interface",
      "Real-time order processing",
      "Automatic bill calculation",
      "Receipt printing integration",
      "Transaction history tracking",
      "Staff management features"
    ],
    liveLink: "#",
    githubLink: "#"
  },
  cinematch: {
    title: "CineMatch",
    description: "Movie recommendation interface with dynamic content rendering and personalized suggestions. Clean, responsive layout using modern CSS techniques for enhanced UX.",
    role: "Frontend Developer",
    duration: "3 weeks",
    previewImage: "images/CineMatch.png",
    images: [
      "images/Movie/gallery1.png",
      "images/Movie/gallery2.png",
      "images/Movie/gallery3.png",
      // "images/Movie/gallery4.png"
    ],
    tech: ["HTML5", "CSS3", "JavaScript", "Movie API", "Responsive Design"],
    fullDescription: "CineMatch is an interactive movie recommendation engine that provides personalized movie suggestions based on user preferences. The interface features dynamic content loading, smooth animations, and a modern responsive design. Built to showcase frontend excellence with a focus on user experience and performance.",
    highlights: [
      "Dynamic content rendering",
      "Personalized recommendations engine",
      "Smooth animations and transitions",
      "Mobile-first responsive design",
      "API integration for movie data",
      "Local storage for preferences"
    ],
    liveLink: "#",
    githubLink: "#"
  },
  kerala: {
    title: "Kerala Tourism",
    description: "Responsive tourism website showcasing Kerala's destinations and attractions with interactive image galleries, mobile-friendly UI and smooth navigation effects.",
    role: "Frontend Developer",
    duration: "2 weeks",
    previewImage: "images/KeralaTour.png",
    images: [
      "images/KT/gallery1.png",
      "images/KT/gallery2.png",
      "images/KT/gallery3.png",
      "images/KT/gallery4.png"
    ],
    tech: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "Image Gallery"],
    fullDescription: "A beautiful tourism website dedicated to showcasing the natural beauty and attractions of Kerala. The site features interactive image galleries, destination showcases, and informative content about various tourist attractions. Designed with mobile-first approach and smooth navigation experiences.",
    highlights: [
      "Interactive image galleries",
      "Destination showcase pages",
      "Mobile-friendly UI",
      "Smooth navigation effects",
      "Responsive grid layouts",
      "Performance optimized"
    ],
    liveLink: "#",
    githubLink: "#"
  },
  carzone: {
    title: "Parallax Website",
    description: "Car showcase website with engaging parallax scrolling effects and smooth animations. Optimized for performance and cross-device compatibility.",
    role: "Frontend Developer",
    duration: "2 weeks",
    previewImage: "images/Carzone.png",
    images: [
      "images/Carzone/gallery1.png ",
      "images/Carzone/gallery2.png",
      "images/Carzone/gallery3.png",
      "images/Carzone/gallery4.png"
    ],
    tech: ["HTML5", "CSS3", "JavaScript", "Parallax Effects", "Modern Design"],
    fullDescription: "A stunning car showcase website featuring advanced parallax scrolling effects and smooth animations. The site demonstrates cutting-edge frontend techniques with emphasis on visual appeal and performance. Built to showcase multiple car models with interactive sections and engaging user experience.",
    highlights: [
      "Advanced parallax scrolling",
      "Smooth scroll animations",
      "Car model showcases",
      "Interactive sections",
      "Cross-browser compatible",
      "Performance optimized"
    ],
    liveLink: "#",
    githubLink: "#"
  }
};