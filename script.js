/* ════════════════════════════════════════════════
   MAHASAGAR SERVICES — script.js
   ════════════════════════════════════════════════ */

/* ──────────────────────
   1. LOADER
────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = 'auto';
    triggerHeroAnimations();
  }, 1600);
});
document.body.style.overflow = 'hidden';

function triggerHeroAnimations() {
  document.querySelectorAll('.hero-section .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 150);
  });
}

/* ──────────────────────
   2. CUSTOM CURSOR
────────────────────── */
const outer = document.getElementById('cursorOuter');
const dot   = document.getElementById('cursorDot');
let mx = 0, my = 0, ox = 0, oy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

function animateCursor() {
  ox += (mx - ox) * 0.1;
  oy += (my - oy) * 0.1;
  outer.style.left = ox + 'px';
  outer.style.top  = oy + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .scard, .cinfo-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    outer.style.transform = 'translate(-50%,-50%) scale(1.6)';
    outer.style.borderColor = 'rgba(201,168,76,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    outer.style.transform = 'translate(-50%,-50%) scale(1)';
    outer.style.borderColor = '';
  });
});

/* Hide cursor when leaving window */
document.addEventListener('mouseleave', () => {
  outer.style.opacity = '0'; dot.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  outer.style.opacity = '1'; dot.style.opacity = '1';
});

/* ──────────────────────
   3. PARTICLE CANVAS
────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const GOLD = 'rgba(201,168,76,';

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x   = Math.random() * W;
      this.y   = Math.random() * H;
      this.vx  = (Math.random() - 0.5) * 0.3;
      this.vy  = (Math.random() - 0.5) * 0.3 - 0.1;
      this.r   = Math.random() * 1.4 + 0.3;
      this.a   = Math.random() * 0.5 + 0.1;
      this.da  = (Math.random() * 0.004 + 0.001) * (Math.random() < 0.5 ? 1 : -1);
      this.life = 0;
      this.maxLife = Math.random() * 200 + 100;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      this.a += this.da;
      if (this.a < 0.05 || this.a > 0.6) this.da *= -1;
      if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = GOLD + this.a + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  // connections
  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < maxDist) {
          const a = (1 - d / maxDist) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = GOLD + a + ')';
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ──────────────────────
   4. NAVBAR
────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveLink();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function updateActiveLink() {
  const sections = ['home', 'services', 'about', 'contact'];
  const scrollY  = window.scrollY + 120;
  let current = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && scrollY >= el.offsetTop) current = id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}

/* ──────────────────────
   5. SMOOTH SCROLL
────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

/* ──────────────────────
   6. SCROLL REVEAL
────────────────────── */
const revealEls = document.querySelectorAll('.reveal, .reveal-card');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // animate skill bars
      entry.target.querySelectorAll('.bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
      // Don't unobserve so stagger works
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObs.observe(el));

// Also trigger skill bars when parent section visible
const barObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('#about').forEach(el => barObs.observe(el));

/* ──────────────────────
   7. COUNTER ANIMATION
────────────────────── */
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-n').forEach(el => {
        const target = +el.dataset.target;
        let count = 0;
        const step = target / 60;
        const interval = setInterval(() => {
          count += step;
          if (count >= target) { el.textContent = target; clearInterval(interval); }
          else el.textContent = Math.floor(count);
        }, 25);
      });
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
const heroContent = document.querySelector('.hero-content');
if (heroContent) counterObs.observe(heroContent);

/* ──────────────────────
   8. 3D CARD TILT
────────────────────── */
const heroCard = document.getElementById('heroCard');
const card3d   = document.getElementById('card3d');
if (card3d) {
  card3d.addEventListener('mousemove', e => {
    const rect = card3d.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const rx = (e.clientY - cy) / (rect.height / 2) * -15;
    const ry = (e.clientX - cx) / (rect.width  / 2) *  15;
    heroCard.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card3d.addEventListener('mouseleave', () => {
    heroCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

/* ──────────────────────
   9. SERVICES CARD TILT
────────────────────── */
document.querySelectorAll('.scard').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) scale(1.01) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ──────────────────────
   10. CONTACT FORM
────────────────────── */
const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnLabel  = document.getElementById('btnLabel');
const formSucc  = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const fname    = document.getElementById('fname');
    const femail   = document.getElementById('femail');
    const fmessage = document.getElementById('fmessage');
    const errName  = document.getElementById('errName');
    const errEmail = document.getElementById('errEmail');
    const errMsg   = document.getElementById('errMsg');

    errName.textContent  = '';
    errEmail.textContent = '';
    errMsg.textContent   = '';

    if (!fname.value.trim()) { errName.textContent  = 'Please enter your name.'; valid = false; }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(femail.value.trim())) { errEmail.textContent = 'Please enter a valid email.'; valid = false; }
    if (!fmessage.value.trim()) { errMsg.textContent = 'Please enter a message.'; valid = false; }

    if (!valid) return;

    // Simulate send
    btnLabel.textContent = 'Sending…';
    submitBtn.disabled   = true;
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
      form.reset();
      btnLabel.textContent = 'Send Message';
      submitBtn.disabled   = false;
      submitBtn.style.opacity = '';
      formSucc.style.display  = 'block';
      setTimeout(() => { formSucc.style.display = 'none'; }, 5000);
    }, 1800);
  });
}

/* ──────────────────────
   11. PARALLAX ORBS
────────────────────── */
window.addEventListener('mousemove', e => {
  const px = (e.clientX / window.innerWidth  - 0.5) * 30;
  const py = (e.clientY / window.innerHeight - 0.5) * 30;
  document.querySelectorAll('.hero-bg-orb').forEach((orb, i) => {
    const factor = (i + 1) * 0.3;
    orb.style.transform = `translate(${px * factor}px, ${py * factor}px)`;
  });
});

/* ──────────────────────
   12. PAGE INIT
────────────────────── */
navbar.classList.add('scrolled'); // start with glass always on
