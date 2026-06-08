/* js/canvas.js — Activity zone canvas animation (PBCanvas namespace) */
window.PBCanvas = (function () {
  let canvas, ctx, animFrame;
  let hue = 0;
  const ball  = { x: 250, y: 53, vx: 2.4, vy: 1.6 };
  const trail = [];

  function star5(cx, cy, r, color) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5 - Math.PI / 2;
      const d = i % 2 === 0 ? r : r * 0.42;
      i === 0
        ? ctx.moveTo(Math.cos(a) * d, Math.sin(a) * d)
        : ctx.lineTo(Math.cos(a) * d, Math.sin(a) * d);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function init() {
    canvas = document.getElementById('theCanvas');
    if (!canvas) return false;
    ctx = canvas.getContext('2d');
    return true;
  }

  function start() {
    if (!ctx && !init()) return;
    trail.length = 0;

    (function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hue = (hue + 1.4) % 360;

      ball.x += ball.vx;
      ball.y += ball.vy;
      if (ball.x <= 12 || ball.x >= canvas.width  - 12) { ball.vx *= -1; ball.x = Math.max(12, Math.min(canvas.width  - 12, ball.x)); }
      if (ball.y <= 12 || ball.y >= canvas.height - 12) { ball.vy *= -1; ball.y = Math.max(12, Math.min(canvas.height - 12, ball.y)); }

      trail.push({ x: ball.x, y: ball.y });
      if (trail.length > 38) trail.shift();

      trail.forEach((p, i) => {
        const t = i / trail.length;
        const h = (hue + i * 8) % 360;
        ctx.beginPath();
        ctx.arc(p.x, p.y, t * 5.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${h},100%,68%,${(t * 0.7).toFixed(2)})`;
        ctx.fill();
      });

      ctx.shadowBlur  = 22;
      ctx.shadowColor = `hsl(${hue},100%,65%)`;
      star5(ball.x, ball.y, 9, `hsl(${hue},100%,75%)`);
      ctx.shadowBlur  = 0;

      animFrame = requestAnimationFrame(tick);
    })();
  }

  function stop() {
    cancelAnimationFrame(animFrame);
    animFrame = null;
    if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball.x = 250; ball.y = 53; ball.vx = 2.4; ball.vy = 1.6;
  }

  return { start, stop, init };
})();
