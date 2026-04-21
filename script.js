/* ════════════════════════════════════════════
   SNEHAL MAHASAGAR PORTFOLIO — script.js
   All animations, form, security, SEO helpers
════════════════════════════════════════════ */
'use strict';

/* ── Helpers ── */
const $  = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

/* ══════════════════════════════
   1. LOADER
══════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = $('loader');
    if (loader) {
      loader.classList.add('done');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }
    // Trigger hero stat counter after load
    initCounters();
  }, 1600);
});

/* ══════════════════════════════
   2. PARTICLE CANVAS
══════════════════════════════ */
(function initCanvas() {
  const canvas = $('bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: -999, y: -999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });

  const rand = (a, b) => Math.random() * (b - a) + a;

  function mkParticle() {
    return {
      x: rand(0, W), y: rand(0, H),
      r: rand(0.6, 2.2),
      vx: rand(-0.25, 0.25), vy: rand(-0.5, -0.08),
      a: rand(0.12, 0.55), da: rand(.001, .003),
      gold: Math.random() > .4
    };
  }

  for (let i = 0; i < 110; i++) particles.push(mkParticle());

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      // mouse repel
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        const force = (80 - dist) / 80;
        p.x += dx / dist * force * 1.5;
        p.y += dy / dist * force * 1.5;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? `rgba(201,168,76,${p.a})`
        : `rgba(255,255,255,${p.a * 0.35})`;
      ctx.fill();

      p.x += p.vx; p.y += p.vy; p.a -= p.da * .15;
      if (p.y < -10 || p.a <= 0) {
        Object.assign(p, mkParticle(), { y: H + 5, a: rand(.12, .55) });
      }
    });

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = dx * dx + dy * dy;
        if (d < 9000) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(201,168,76,${0.045 * (1 - d / 9000)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ══════════════════════════════
   3. CUSTOM CURSOR
══════════════════════════════ */
(function initCursor() {
  const cursor = $('cursor');
  const trail  = $('cursorTrail');
  if (!cursor || !trail) return;
  if (window.matchMedia('(hover:none)').matches) return;

  let tx = -200, ty = -200;
  document.addEventListener('mousemove', e => {
    cursor.style.cssText = `left:${e.clientX}px;top:${e.clientY}px`;
    tx = e.clientX; ty = e.clientY;
  }, { passive: true });

  (function lerpTrail() {
    trail.style.cssText = `left:${tx}px;top:${ty}px`;
    requestAnimationFrame(lerpTrail);
  })();

  $$('a, button, .scard, .skill-group, .tl-card, .ac-cta, .sc-btn').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
  });
})();

/* ══════════════════════════════
   4. NAVBAR — scroll & active
══════════════════════════════ */
(function initNav() {
  const nav = $('nav') || document.querySelector('.nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    const btt = $('btt');
    if (btt) btt.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  // Active link on scroll
  const sections = $$('section[id]');
  const navH = () => nav.offsetHeight;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        $$('.nl, .ml').forEach(l => l.classList.remove('active'));
        const id = e.target.id;
        document.querySelectorAll(`[data-section="${id}"]`).forEach(l => l.classList.add('active'));
      }
    });
  }, { threshold: .45 });

  sections.forEach(s => io.observe(s));
})();

/* ══════════════════════════════
   5. MOBILE MENU
══════════════════════════════ */
(function initMobileMenu() {
  const btn   = $('hamburger');
  const menu  = $('mobileMenu');
  const close = $('mobileClose');
  if (!btn || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () =>
    menu.classList.contains('open') ? closeMenu() : openMenu()
  );
  if (close) close.addEventListener('click', closeMenu);

  // Close on link click
  $$('.ml').forEach(l => l.addEventListener('click', closeMenu));

  // Close on backdrop click
  menu.addEventListener('click', e => {
    if (e.target === menu) closeMenu();
  });

  // ESC key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });
})();

/* ══════════════════════════════
   6. SMOOTH SCROLL
══════════════════════════════ */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = document.querySelector('.nav')?.offsetHeight || 68;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - navH,
      behavior: 'smooth'
    });
  });
});

/* ══════════════════════════════
   7. REVEAL ON SCROLL
══════════════════════════════ */
(function initReveal() {
  const els = $$('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('vis'), i * 55);
        io.unobserve(e.target);
      }
    });
  }, { threshold: .1 });

  els.forEach(el => io.observe(el));
})();

/* ══════════════════════════════
   8. STAT COUNTERS
══════════════════════════════ */
function initCounters() {
  $$('.hstat-n[data-count]').forEach(el => {
    const end  = parseInt(el.dataset.count, 10);
    const dur  = 2200;
    const step = end / (dur / 16);
    let cur = 0;
    const timer = setInterval(() => {
      cur = Math.min(cur + step, end);
      el.textContent = Math.floor(cur);
      if (cur >= end) clearInterval(timer);
    }, 16);
  });
}

/* ══════════════════════════════
   9. SKILL BARS
══════════════════════════════ */
(function initSkillBars() {
  const fills = $$('.sbar-fill[data-w]');
  if (!fills.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w + '%';
        io.unobserve(e.target);
      }
    });
  }, { threshold: .3 });

  fills.forEach(f => io.observe(f));
})();

/* ══════════════════════════════
   10. 3D CARD TILT — Hero
══════════════════════════════ */
(function initHeroTilt() {
  const card = $('hcard');
  if (!card) return;

  let rafId, t = 0;

  // Idle float
  (function idle() {
    t += .01;
    if (!card.matches(':hover')) {
      card.style.transform = `rotateY(${Math.sin(t) * 5}deg) rotateX(${Math.cos(t * .7) * 3}deg) translateY(${Math.sin(t * .5) * 6}px)`;
    }
    rafId = requestAnimationFrame(idle);
  })();

  card.addEventListener('mousemove', e => {
    const r   = card.getBoundingClientRect();
    const cx  = r.left + r.width  / 2;
    const cy  = r.top  + r.height / 2;
    const rx  = ((e.clientY - cy) / (r.height / 2)) * -14;
    const ry  = ((e.clientX - cx) / (r.width  / 2)) * 18;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
})();

/* ══════════════════════════════
   11. 3D CARD TILT — About
══════════════════════════════ */
(function initAboutTilt() {
  const card = document.querySelector('.about-card');
  if (!card) return;

  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const rx = ((e.clientY - cy) / (r.height / 2)) * -15;
    const ry = ((e.clientX - cx) / (r.width  / 2)) * 20;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
})();

/* ══════════════════════════════
   12. PARALLAX — hero bg text
══════════════════════════════ */
(function initParallax() {
  const bgLetters = document.querySelector('.hero-bg-letters');
  const orbs      = $$('.orb');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (bgLetters) {
      bgLetters.style.transform = `translate(-50%,calc(-50% + ${y * 0.22}px))`;
    }
  }, { passive: true });

  // Mouse parallax on orbs
  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    orbs.forEach((orb, i) => {
      const d = (i + 1) * 9;
      orb.style.transform = `translate(${dx * d}px,${dy * d}px)`;
    });
  }, { passive: true });
})();

/* ══════════════════════════════
   13. SERVICE CARD STAGGER
══════════════════════════════ */
(function initCardStagger() {
  const cards = $$('.scard, .tl-card, .skill-group');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }, i * 75);
        io.unobserve(e.target);
      }
    });
  }, { threshold: .08 });

  cards.forEach(c => {
    c.style.opacity   = '0';
    c.style.transform = 'translateY(24px)';
    c.style.transition = 'opacity .65s ease, transform .65s ease';
    io.observe(c);
  });
})();

/* ══════════════════════════════
   14. BACK TO TOP
══════════════════════════════ */
const btt = $('btt');
if (btt) {
  btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ══════════════════════════════
   15. CONTACT FORM
   — Client-side validation
   — EmailJS integration (free)
   — Honeypot anti-spam
   — Rate-limit (1 per 30s)
══════════════════════════════ */
(function initForm() {
  const form    = $('contactForm');
  if (!form) return;

  const cfName  = $('cfName');
  const cfEmail = $('cfEmail');
  const cfMsg   = $('cfMsg');
  const cfPhone = $('cfPhone');
  const submit  = $('cfSubmit');
  const success = $('cfSuccess');
  const errGlob = $('cfErrorGlobal');

  let lastSent  = 0;
  const COOLDOWN = 30000; // 30s

  /* ── Sanitise input ── */
  function sanitise(str) {
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#x27;');
  }

  /* ── Validate ── */
  function validate() {
    let ok = true;

    // Name
    const name = cfName.value.trim();
    if (!name || name.length < 2) {
      $('errName').textContent = 'Please enter your name (min 2 chars).';
      cfName.setAttribute('aria-invalid','true');
      ok = false;
    } else {
      $('errName').textContent = '';
      cfName.removeAttribute('aria-invalid');
    }

    // Email
    const email = cfEmail.value.trim();
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRx.test(email)) {
      $('errEmail').textContent = 'Please enter a valid email address.';
      cfEmail.setAttribute('aria-invalid','true');
      ok = false;
    } else {
      $('errEmail').textContent = '';
      cfEmail.removeAttribute('aria-invalid');
    }

    // Message
    const msg = cfMsg.value.trim();
    if (!msg || msg.length < 10) {
      $('errMsg').textContent = 'Please write a message (min 10 chars).';
      cfMsg.setAttribute('aria-invalid','true');
      ok = false;
    } else {
      $('errMsg').textContent = '';
      cfMsg.removeAttribute('aria-invalid');
    }

    return ok;
  }

  /* ── Build mailto fallback ── */
  function buildMailto(data) {
    const subject = encodeURIComponent(`[Portfolio Inquiry] ${data.service || 'General'} — ${data.name}`);
    const body    = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nService: ${data.service || 'N/A'}\n\nMessage:\n${data.message}`
    );
    return `mailto:snehalmahasagar@gmail.com?subject=${subject}&body=${body}`;
  }

  /* ── Submit handler ── */
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    errGlob.textContent = '';

    // Honeypot check
    const honey = form.querySelector('[name="_honey"]');
    if (honey && honey.value) return; // bot detected — silently ignore

    // Rate limit
    const now = Date.now();
    if (now - lastSent < COOLDOWN) {
      errGlob.textContent = `Please wait ${Math.ceil((COOLDOWN - (now - lastSent)) / 1000)}s before sending again.`;
      return;
    }

    if (!validate()) return;

    const data = {
      name:    sanitise(cfName.value.trim()),
      email:   sanitise(cfEmail.value.trim()),
      phone:   sanitise(($('cfPhone') || {}).value || ''),
      service: sanitise(($('cfService') || {}).value || ''),
      message: sanitise(cfMsg.value.trim()),
    };

    // Loading state
    submit.disabled = true;
    submit.querySelector('.cf-btn-text').textContent = 'Sending…';

    try {
      /* ── EmailJS Integration ──────────────────────────
         TO ENABLE REAL EMAIL DELIVERY:
         1. Go to https://www.emailjs.com (free plan: 200 emails/month)
         2. Create account → Add Email Service (Gmail recommended)
         3. Create Template with these variables:
            {{from_name}}, {{from_email}}, {{phone}}, {{service}}, {{message}}
            Set "To Email" as: snehalmahasagar@gmail.com
         4. Copy your Public Key, Service ID, Template ID
         5. Replace the placeholder values below and uncomment the block.

         ─── UNCOMMENT & FILL IN BELOW ───────────────── */

      /*
      await emailjs.init('YOUR_PUBLIC_KEY');
      await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        from_name:    data.name,
        from_email:   data.email,
        phone:        data.phone,
        service:      data.service,
        message:      data.message,
        reply_to:     data.email,
        to_email:     'snehalmahasagar@gmail.com',
      });
      */

      /* ── Formspree fallback (free, no signup needed for testing) ──
         Replace YOUR_FORM_ID after signing up at formspree.io ────── */

      const fspreeId = 'YOUR_FORM_ID'; // e.g. 'xdoqabcd'
      if (fspreeId !== 'YOUR_FORM_ID') {
        const res = await fetch(`https://formspree.io/f/${fspreeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            name:    data.name,
            email:   data.email,
            phone:   data.phone,
            service: data.service,
            message: data.message,
          })
        });
        if (!res.ok) throw new Error('Formspree error');
      }

      /* ── SUCCESS ── */
      lastSent = Date.now();
      form.reset();
      if (success) {
        success.style.display = 'flex';
        setTimeout(() => { success.style.display = 'none'; }, 7000);
      }

    } catch (err) {
      /* ── Fallback: open mailto ── */
      errGlob.textContent = 'Auto-send failed. Opening your email client…';
      setTimeout(() => {
        window.location.href = buildMailto(data);
        errGlob.textContent = '';
      }, 1500);
    } finally {
      submit.disabled = false;
      submit.querySelector('.cf-btn-text').textContent = 'Send Message';
    }
  });

  /* ── Live validation feedback ── */
  [cfName, cfEmail, cfMsg].forEach(el => {
    el.addEventListener('blur', validate);
    el.addEventListener('input', () => {
      if (el.getAttribute('aria-invalid') === 'true') validate();
    });
  });
})();

/* ══════════════════════════════
   16. FOOTER YEAR
══════════════════════════════ */
const yr = $('yr');
if (yr) yr.textContent = new Date().getFullYear();

/* ══════════════════════════════
   17. SECURITY — prevent tab-nabbing
══════════════════════════════ */
$$('a[target="_blank"]').forEach(a => {
  if (!a.rel.includes('noopener')) a.rel = 'noopener noreferrer';
});

/* ══════════════════════════════
   18. PERF — lazy load iframes
══════════════════════════════ */
(function lazyIframes() {
  const frames = $$('iframe[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const src = e.target.getAttribute('src');
          if (src) e.target.setAttribute('src', src);
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '200px' });
    frames.forEach(f => io.observe(f));
  }
})();

/* ══════════════════════════════
   19. TECH CLOUD — random float
══════════════════════════════ */
(function animateTechCloud() {
  const chips = $$('.tech-cloud span');
  chips.forEach((chip, i) => {
    chip.style.animation = `techFloat ${3 + Math.random() * 2}s ${i * .12}s ease-in-out infinite alternate`;
  });

  // Inject keyframes once
  if (!document.querySelector('#techFloatKF')) {
    const style = document.createElement('style');
    style.id = 'techFloatKF';
    style.textContent = `
      @keyframes techFloat {
        from { transform: translateY(0); }
        to   { transform: translateY(-6px); }
      }
    `;
    document.head.appendChild(style);
  }
})();

/* ══════════════════════════════
   20. TIMELINE — draw line anim
══════════════════════════════ */
(function initTimeline() {
  const items = $$('.tl-item');
  if (!items.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          e.target.style.opacity   = '1';
          e.target.style.transform = 'translateX(0)';
        }, i * 100);
        io.unobserve(e.target);
      }
    });
  }, { threshold: .15 });

  items.forEach(it => {
    it.style.opacity   = '0';
    it.style.transform = 'translateX(-20px)';
    it.style.transition = 'opacity .65s ease, transform .65s ease';
    io.observe(it);
  });
})();
