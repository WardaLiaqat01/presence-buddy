/* js/main.js — Nav, scroll reveal, FAQ, contact form, ticker */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initScrollReveal();
    initFAQ();
    initContact();
    initTicker();
  });

  /* ── Navigation ─────────────────────────────────────────── */
  function initNav() {
    const nav       = document.getElementById('mainNav');
    const hamburger = document.getElementById('navHamburger');
    const mobile    = document.getElementById('navMobile');
    const navLinks  = document.querySelectorAll('.nav-links a, .nav-mobile a');

    // Scroll: add .scrolled class and active link
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      if (!nav) return;
      nav.classList.toggle('scrolled', window.scrollY > 30);
      highlightNav(sections, navLinks);
    }, { passive: true });

    // Mobile hamburger
    if (hamburger && mobile) {
      hamburger.addEventListener('click', () => {
        mobile.classList.toggle('open');
        hamburger.textContent = mobile.classList.contains('open') ? '✕' : '☰';
      });
    }

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        if (mobile) { mobile.classList.remove('open'); if (hamburger) hamburger.textContent = '☰'; }
        const offset = (nav ? nav.offsetHeight : 70) + 8;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      });
    });
  }

  function highlightNav(sections, links) {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }

  /* ── Scroll Reveal ──────────────────────────────────────── */
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ── FAQ Accordion ──────────────────────────────────────── */
  function initFAQ() {
    document.querySelectorAll('.faq-item').forEach(item => {
      const btn = item.querySelector('.faq-q');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all first
        document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ── Contact Form ───────────────────────────────────────── */
  function initContact() {
    const form    = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    const resetBtn = document.getElementById('formReset');

    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const submitBtn = form.querySelector('.submit-btn');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '✨ Sending...'; }

      // Simulate async submission
      setTimeout(() => {
        form.style.display = 'none';
        if (success) success.classList.add('show');
      }, 1500);
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (success) success.classList.remove('show');
        form.style.display = '';
        form.reset();
        const submitBtn = form.querySelector('.submit-btn');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = '💌 Send Message'; }
      });
    }
  }

  /* ── Use-Case Ticker ────────────────────────────────────── */
  function initTicker() {
    const track = document.getElementById('tickerTrack');
    if (!track) return;
    // Clone children for seamless infinite loop
    const items = Array.from(track.children);
    items.forEach(item => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });
  }

})();
