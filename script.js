/* ===========================
   LUMIÈRE BEAUTY — script.js
   =========================== */

'use strict';

/* ========== Loader ========== */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    // Kick off hero animations after loader
    document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('revealed'), i * 150);
    });
  }, 1800);
});

/* ========== Navbar Scroll ========== */
const navbar = document.getElementById('navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  navbar.classList.toggle('scrolled', s > 60);
  lastScroll = s;
}, { passive: true });

/* ========== Hamburger Menu ========== */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('mobile-open');
});
navLinks?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('mobile-open');
  });
});

/* ========== Mouse Glow ========== */
const mouseGlow = document.getElementById('mouseGlow');
let mx = 0, my = 0, glowX = 0, glowY = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
function animateGlow() {
  glowX += (mx - glowX) * 0.08;
  glowY += (my - glowY) * 0.08;
  if (mouseGlow) mouseGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
  requestAnimationFrame(animateGlow);
}
animateGlow();

/* ========== Hero Particles ========== */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 30;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 1;
    const x    = Math.random() * 100;
    const y    = Math.random() * 100;
    const dur  = (Math.random() * 6 + 4) + 's';
    const del  = (Math.random() * 8)     + 's';
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${x}%; top:${y}%;
      --dur:${dur}; --delay:${del};
    `;
    container.appendChild(p);
  }
}
initParticles();

/* ========== Intersection Observer Reveals ========== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  // Hero items handled separately above
  if (!el.closest('.hero')) revealObserver.observe(el);
});

/* ========== Animated Counters ========== */
function animateCounter(el) {
  const target  = parseFloat(el.dataset.target);
  const decimal = el.dataset.decimal === 'true';
  const duration = 2000;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = eased * target;
    el.textContent = decimal ? value.toFixed(0) : Math.floor(value).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = decimal ? target.toFixed(0) : target.toLocaleString();
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter-num, .stat-num').forEach(el => counterObserver.observe(el));

/* ========== Before/After Slider ========== */
(function initBeforeAfter() {
  const container = document.getElementById('baContainer');
  const divider   = document.getElementById('baDivider');
  if (!container || !divider) return;

  const after = container.querySelector('.ba-after');
  let isDragging = false;

  function setPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let pct = (clientX - rect.left) / rect.width;
    pct = Math.min(Math.max(pct, 0.05), 0.95);
    const pcStr = (pct * 100).toFixed(2) + '%';
    divider.style.left = pcStr;
    after.style.clipPath = `inset(0 ${(100 - pct * 100).toFixed(2)}% 0 0)`;
  }

  // Set initial
  after.style.clipPath = 'inset(0 50% 0 0)';

  container.addEventListener('mousedown', e => { isDragging = true; setPosition(e.clientX); });
  window.addEventListener('mouseup', () => isDragging = false);
  window.addEventListener('mousemove', e => { if (isDragging) setPosition(e.clientX); });

  container.addEventListener('touchstart', e => { isDragging = true; setPosition(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend', () => isDragging = false);
  window.addEventListener('touchmove', e => { if (isDragging) setPosition(e.touches[0].clientX); }, { passive: true });
})();

/* ========== Bridal Testimonials Slider ========== */
(function initBridalSlider() {
  const quotes = document.querySelectorAll('.bridal-quote');
  const dots   = document.querySelectorAll('.bq-dot');
  let current = 0;
  let timer;

  function goTo(idx) {
    quotes[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = idx;
    quotes[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() {
    goTo((current + 1) % quotes.length);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      goTo(parseInt(dot.dataset.idx));
      timer = setInterval(next, 4000);
    });
  });

  timer = setInterval(next, 4000);
})();

/* ========== Gallery ========== */
(function initGallery() {
  const gallery = document.getElementById('masonryGallery');
  if (!gallery) return;

  const categories = ['bridal', 'hair', 'makeup', 'nails', 'spa'];
  const colors = [
    ['#2a1a08','#D4AF3720'],
    ['#1a0d0d','#c4796620'],
    ['#0d1a0d','#4a7a5020'],
    ['#0d0d1a','#5a5a9a20'],
    ['#1a0d1a','#9a5a9a20'],
  ];

  const heights = [160, 220, 180, 260, 200, 240, 170, 210, 190, 250, 230, 170];
  const items = [];

  for (let i = 0; i < 12; i++) {
    const cat   = categories[i % categories.length];
    const colI  = i % colors.length;
    const h     = heights[i % heights.length];
    const label = cat.charAt(0).toUpperCase() + cat.slice(1);
    items.push({ cat, colI, h, label, idx: i });
  }

  function renderItems(filter) {
    gallery.innerHTML = '';
    items.forEach(item => {
      if (filter !== 'all' && item.cat !== filter) return;
      const el = document.createElement('div');
      el.className = 'gallery-item';
      el.dataset.cat = item.cat;
      el.dataset.idx = item.idx;
      el.innerHTML = `
        <svg viewBox="0 0 280 ${item.h}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gGrad${item.idx}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${colors[item.colI][0]}"/>
              <stop offset="100%" stop-color="#0F0F0F"/>
            </linearGradient>
          </defs>
          <rect width="280" height="${item.h}" fill="url(#gGrad${item.idx})" rx="0"/>
          <circle cx="140" cy="${item.h/2}" r="${item.h * 0.25}" fill="${colors[item.colI][1]}"/>
          <text x="140" y="${item.h/2 + 5}" text-anchor="middle" fill="${item.colI % 2 === 0 ? '#D4AF37' : '#c47966'}"
            font-family="Cormorant Garamond" font-size="12" opacity="0.5">${label}</text>
        </svg>
        <div class="gallery-item-overlay"><span>+</span></div>
      `;
      el.addEventListener('click', () => openLightbox(item.idx));
      gallery.appendChild(el);
    });
  }

  renderItems('all');

  // Filters
  document.querySelectorAll('.gf-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gf-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderItems(btn.dataset.filter);
    });
  });

  // Lightbox
  let currentLbIdx = 0;
  function openLightbox(idx) {
    currentLbIdx = idx;
    const lb = document.getElementById('lightbox');
    const wrap = document.getElementById('lbImgWrap');
    const item = items[idx];
    if (!item) return;
    wrap.innerHTML = `
      <svg viewBox="0 0 560 ${item.h * 2}" xmlns="http://www.w3.org/2000/svg" style="width:min(80vw,560px)">
        <rect width="560" height="${item.h * 2}" fill="${colors[item.colI][0]}" rx="12"/>
        <circle cx="280" cy="${item.h}" r="${item.h * 0.5}" fill="${colors[item.colI][1]}"/>
        <text x="280" y="${item.h + 6}" text-anchor="middle" fill="${item.colI % 2 === 0 ? '#D4AF37' : '#c47966'}"
          font-family="Cormorant Garamond" font-size="16" opacity="0.6">${item.label}</text>
      </svg>
    `;
    lb.classList.add('open');
  }

  document.getElementById('lbClose')?.addEventListener('click', () => {
    document.getElementById('lightbox').classList.remove('open');
  });
  document.getElementById('lbPrev')?.addEventListener('click', () => {
    openLightbox((currentLbIdx - 1 + items.length) % items.length);
  });
  document.getElementById('lbNext')?.addEventListener('click', () => {
    openLightbox((currentLbIdx + 1) % items.length);
  });
  document.getElementById('lightbox')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) e.currentTarget.classList.remove('open');
  });
  document.addEventListener('keydown', e => {
    const lb = document.getElementById('lightbox');
    if (!lb?.classList.contains('open')) return;
    if (e.key === 'Escape') lb.classList.remove('open');
    if (e.key === 'ArrowLeft') openLightbox((currentLbIdx - 1 + items.length) % items.length);
    if (e.key === 'ArrowRight') openLightbox((currentLbIdx + 1) % items.length);
  });
})();

/* ========== Instagram Grid ========== */
(function initInsta() {
  const grid = document.getElementById('instaGrid');
  if (!grid) return;
  const palettes = [
    ['#1a0d0d','#D4AF3720'],['#0d1a0d','#c4796620'],['#1a1208','#D4AF3730'],
    ['#0d0d1a','#6a5a9020'],['#1a0d1a','#9a5a9a20'],['#1a1008','#c4796615'],
  ];
  for (let i = 0; i < 6; i++) {
    const div = document.createElement('div');
    div.className = 'insta-item';
    const [bg, accent] = palettes[i % palettes.length];
    div.innerHTML = `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="${bg}"/>
        <circle cx="100" cy="100" r="60" fill="${accent}"/>
        <text x="100" y="105" text-anchor="middle" fill="${i % 2 === 0 ? '#D4AF37' : '#c47966'}"
          font-family="Cormorant Garamond" font-size="11" opacity="0.5">✦</text>
      </svg>
      <div class="insta-item-overlay"></div>
    `;
    grid.appendChild(div);
  }
})();

/* ========== Testimonial Slider ========== */
(function initTestimonials() {
  const track = document.getElementById('tsTrack');
  const dotsContainer = document.getElementById('tsDots');
  const prevBtn = document.getElementById('tsPrev');
  const nextBtn = document.getElementById('tsNext');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const count = cards.length;
  let current = 0;
  let timer;

  // Create dots
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('button');
    dot.className = 'ts-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  function getVisible() {
    const w = window.innerWidth;
    if (w < 640) return 1;
    if (w < 960) return 2;
    return 3;
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, count - getVisible()));
    const cardW = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${current * cardW}px)`;
    dotsContainer.querySelectorAll('.ts-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function next() { goTo((current + 1) % (count - getVisible() + 1)); }

  prevBtn?.addEventListener('click', () => { clearInterval(timer); goTo(current - 1); timer = setInterval(next, 4500); });
  nextBtn?.addEventListener('click', () => { clearInterval(timer); next(); timer = setInterval(next, 4500); });

  timer = setInterval(next, 4500);
  window.addEventListener('resize', () => goTo(Math.min(current, count - getVisible())));
})();

/* ========== Booking Form ========== */
(function initBookingForm() {
  const form   = document.getElementById('bookingForm');
  const popup  = document.getElementById('successPopup');
  const closeP = document.getElementById('popupClose');

  // Set min date to today
  const dateInput = document.getElementById('fdate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  form?.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('[required]').forEach(field => {
      const group = field.closest('.form-group');
      if (!field.value.trim()) {
        group?.classList.add('error');
        valid = false;
      } else {
        group?.classList.remove('error');
      }
    });

    // Email validation
    const email = document.getElementById('femail');
    if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.closest('.form-group')?.classList.add('error');
      valid = false;
    }

    if (valid) {
      popup?.classList.add('open');
      form.reset();
    }
  });

  // Clear error on input
  form?.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => field.closest('.form-group')?.classList.remove('error'));
  });

  closeP?.addEventListener('click', () => popup?.classList.remove('open'));
  popup?.addEventListener('click', e => { if (e.target === popup) popup.classList.remove('open'); });
})();

/* ========== FAQ Accordion ========== */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ========== Smooth Scroll ========== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth'
    });
  });
});

/* ========== 3D Tilt on Service Cards ========== */
document.querySelectorAll('.service-card, .package-card, .why-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-8px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ========== Newsletter ========== */
document.querySelector('.nl-btn')?.addEventListener('click', () => {
  const input = document.querySelector('.nl-input');
  if (input && input.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
    input.value = '';
    input.placeholder = 'Thank you for subscribing!';
    setTimeout(() => { input.placeholder = 'your@email.com'; }, 3000);
  } else if (input) {
    input.style.borderColor = 'var(--rose)';
    setTimeout(() => { input.style.borderColor = ''; }, 1500);
  }
});

/* ========== Parallax on Hero ========== */
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const scrolled = window.scrollY;
  const heroContent = hero.querySelector('.hero-content');
  if (heroContent && scrolled < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
  }
}, { passive: true });

console.log('✦ Lumière Beauty — Loaded');