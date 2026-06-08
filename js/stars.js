/* js/stars.js — Animated star field generator */
(function () {
  function generateStars() {
    const starsEl = document.getElementById('stars');
    if (!starsEl) return;
    const count = window.innerWidth < 600 ? 60 : 110;
    for (let i = 0; i < count; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      const sz = 1 + Math.random() * 2.2;
      s.style.cssText = [
        `left:${Math.random() * 100}%`,
        `top:${Math.random() * 100}%`,
        `width:${sz}px`,
        `height:${sz}px`,
        `--d:${2 + Math.random() * 4}s`,
        `--dl:${Math.random() * 5}s`,
        `opacity:${0.1 + Math.random() * 0.55}`,
      ].join(';');
      starsEl.appendChild(s);
    }
  }
  document.addEventListener('DOMContentLoaded', generateStars);
})();
