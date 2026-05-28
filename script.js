/* ═══════════════════════════════════════════
   script.js · BloomingTales × Umeed for Animals
   Handles: watermark grid, floral SVGs,
            navbar scroll, scroll-reveal,
            file input label, form UX
════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   1. WATERMARK — fill grid with "Zahrah"
───────────────────────────────────────── */
(function buildWatermark() {
  const grid = document.querySelector('.watermark-grid');
  if (!grid) return;

  // fill ~300 words for dense coverage at any screen size
  const count = 300;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.className = 'wm-word';
    span.textContent = 'Zahrah';
    fragment.appendChild(span);
  }

  grid.appendChild(fragment);
})();


/* ─────────────────────────────────────────
   2. FLORAL SVGs — inject into bg-flowers
   (Minimalist peony / magnolia line art)
───────────────────────────────────────── */
(function buildFlowers() {
  const bg = document.querySelector('.bg-flowers');
  if (!bg) return;

  /* Single reusable peony path set (line art style) */
  const flowerSVG = (cls) => {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 340 340');
    svg.setAttribute('xmlns', ns);
    svg.classList.add(cls);

    // Peony petals — large outer ring
    const paths = [
      /* Centre circle */
      'M170 170 m-18 0 a18 18 0 1 0 36 0 a18 18 0 1 0 -36 0',
      /* Petal ring 1 */
      'M170 152 C155 130 125 125 120 148 C115 170 135 185 152 178',
      'M188 152 C203 130 233 125 238 148 C243 170 223 185 206 178',
      'M152 188 C130 203 125 233 148 238 C170 243 185 223 178 206',
      'M188 188 C203 203 233 233 238 238 C243 243 223 223 206 206', // intentional: bottom-right group
      'M188 188 C210 203 238 195 236 172 C234 150 212 145 200 162',
      'M152 152 C130 137 102 145 104 168 C106 190 128 195 140 178',
      'M152 188 C137 210 145 238 168 236 C190 234 195 212 178 200',
      /* Petal ring 2 (outer) */
      'M170 135 C160 105 130 90 115 115 C100 140 118 162 142 160',
      'M170 135 C180 105 210 90 225 115 C240 140 222 162 198 160',
      'M170 205 C160 235 130 250 115 225 C100 200 118 178 142 180',
      'M170 205 C180 235 210 250 225 225 C240 200 222 178 198 180',
      'M135 155 C105 148 86 118 108 100 C130 82 155 98 155 125',
      'M205 155 C235 148 254 118 232 100 C210 82 185 98 185 125',
      'M135 185 C105 192 86 222 108 240 C130 258 155 242 155 215',
      'M205 185 C235 192 254 222 232 240 C210 258 185 242 185 215',
      /* Leaf stems */
      'M170 80 C170 50 155 30 140 20',
      'M170 80 C175 50 190 28 210 22',
      'M80 170 C50 170 30 155 20 140',
      'M80 170 C50 175 28 190 22 210',
      /* Leaf shapes */
      'M155 40 C140 50 125 45 120 35 C115 25 130 18 145 28 Z',
      'M188 36 C200 48 215 44 218 34 C221 24 208 17 196 28 Z',
      'M36 155 C48 140 44 125 34 120 C24 115 17 130 28 145 Z',
      'M32 188 C44 200 40 215 30 218 C20 221 13 208 24 196 Z',
    ];

    paths.forEach(d => {
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', d);
      svg.appendChild(path);
    });

    return svg;
  };

  ['flower-tl', 'flower-tr', 'flower-bl', 'flower-br'].forEach(cls => {
    bg.appendChild(flowerSVG(cls));
  });
})();


/* ─────────────────────────────────────────
   3. NAVBAR — add 'scrolled' class on scroll
───────────────────────────────────────── */
(function navScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const toggle = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  };

  window.addEventListener('scroll', toggle, { passive: true });
  toggle(); // run on init
})();


/* ─────────────────────────────────────────
   4. SCROLL REVEAL — IntersectionObserver
───────────────────────────────────────── */
(function scrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // Stagger siblings within same parent
          const siblings = Array.from(
            entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
          );
          const delay = siblings.indexOf(entry.target) * 120;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  els.forEach(el => observer.observe(el));
})();


/* ─────────────────────────────────────────
   5. FILE INPUT — update label with filename
───────────────────────────────────────── */
(function fileLabel() {
  const input   = document.getElementById('donorScreenshot');
  const display = document.getElementById('fileDisplay');
  const label   = document.getElementById('fileLabel');
  if (!input || !display || !label) return;

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (file) {
      label.textContent = file.name;
      display.classList.add('has-file');
    } else {
      label.textContent = 'Upload payment screenshot';
      display.classList.remove('has-file');
    }
  });
})();


/* ─────────────────────────────────────────
   6. DONATION FORM — submit UX feedback
───────────────────────────────────────── */
(function formSubmit() {
  const form   = document.getElementById('donationForm');
  const btn    = document.getElementById('submitBtn');
  const btnTxt = btn ? btn.querySelector('.btn-text') : null;
  const btnArr = btn ? btn.querySelector('.btn-arrow') : null;
  if (!form || !btn) return;

  form.addEventListener('submit', (e) => {
    // ── If you have a real backend endpoint set in form's action,
    //    remove the e.preventDefault() below and let the form post.
    //    For now we show visual feedback and prevent default so the
    //    demo doesn't navigate away.
    // ──────────────────────────────────────────────
    // e.preventDefault(); // REMOVE this line when backend is ready

    btn.disabled = true;
    btn.style.opacity = '0.75';
    btn.style.transform = 'scale(0.98)';
    if (btnTxt) btnTxt.textContent = 'Sending…';
    if (btnArr) btnArr.textContent = '…';

    // Simulated success state (remove when using real backend)
    // ──────────────────────────────────────────────
    e.preventDefault(); // remove with real backend
    setTimeout(() => {
      btn.style.opacity   = '1';
      btn.style.transform = 'scale(1)';
      if (btnTxt) btnTxt.textContent = 'Thank You! ♥';
      if (btnArr) btnArr.textContent = '✓';
      btn.style.background = 'rgba(255,255,255,0.95)';
      btn.style.color      = '#be123c';

      // Reset after 4 seconds
      setTimeout(() => {
        btn.disabled = false;
        if (btnTxt) btnTxt.textContent = 'Confirm My Donation';
        if (btnArr) btnArr.textContent = '→';
        btn.style.background = '';
        btn.style.color = '';
      }, 4000);
    }, 1200);
  });
})();


/* ─────────────────────────────────────────
   7. SMOOTH ANCHOR SCROLLING (offset for nav)
───────────────────────────────────────── */
(function smoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
        10
      ) || 72;

      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
