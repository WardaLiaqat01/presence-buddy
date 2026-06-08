/* js/app.js — Core Presence Buddy logic */
(function () {
  // ── State ─────────────────────────────────────────────────
  let isActive  = false;
  let wakeLock  = null;
  const wlOK    = 'wakeLock' in navigator;
  let actTimer  = null;
  let uptTimer  = null;
  let uptime    = 0;
  let pingCount = 0;
  let interval  = 30;
  let msgIdx    = 0;

  // ── Message banks ─────────────────────────────────────────
  const sleepMsgs = [
    '💤 Catching up on some well-deserved sleep...',
    '😴 Dreaming of green Teams status...',
    '🌙 Resting up, ready when you need me!',
    '💤 zzzz... poke me to get started 👉',
    '🛌 Napping peacefully in the corner...',
  ];
  const activeMsgs = [
    '🐾 On duty! Your status stays green!',
    '💪 Teams will not catch you slipping, boss!',
    '🚀 Working hard so you look busy!',
    '💚 Status? Still green. You\'re welcome! 😎',
    '👀 Eyes open, cursor secretly moving...',
    '✨ Totally inconspicuous mouse movements!',
    '🕵️ Stealthily simulating productivity...',
    '🎯 Another ping sent — you\'re still \'active\'!',
    '🌟 I got you! Go grab a coffee ☕',
    '🔥 Keeping the dream alive, one ping at a time!',
  ];

  // ── Wake Lock helpers ─────────────────────────────────────
  async function getWakeLock() {
    if (!wlOK) return;
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => {
        wakeLock = null;
        pillOff('wakePill', 'OFF');
      });
      pillOn('wakePill', 'ACTIVE');
    } catch (_) {
      pillOff('wakePill', 'FAILED');
    }
  }

  async function dropWakeLock() {
    if (wakeLock) { try { await wakeLock.release(); } catch (_) {} wakeLock = null; }
    pillOff('wakePill', 'OFF');
  }

  function pillOn(id, label) {
    const p = document.getElementById(id);
    if (!p) return;
    p.textContent = label; p.classList.add('on');
  }
  function pillOff(id, label) {
    const p = document.getElementById(id);
    if (!p) return;
    p.textContent = label; p.classList.remove('on');
  }

  // Re-acquire on tab focus
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible' && isActive && !wakeLock) {
      await getWakeLock();
    }
  });

  // ── Ping ──────────────────────────────────────────────────
  function ping() {
    const x = 60 + Math.random() * (window.innerWidth  - 120) | 0;
    const y = 60 + Math.random() * (window.innerHeight - 120) | 0;
    ['mousemove', 'pointermove'].forEach(t =>
      document.dispatchEvent(new MouseEvent(t, {
        clientX: x, clientY: y, bubbles: true,
        movementX: (Math.random() - .5) * 12,
        movementY: (Math.random() - .5) * 12,
      }))
    );
    pingCount++;
    const el = document.getElementById('pingEl');
    if (el) {
      el.textContent = pingCount;
      el.classList.remove('pop');
      void el.offsetWidth;
      el.classList.add('pop');
    }
    ripple();
    if (pingCount % 4 === 0) nextMsg();
  }

  // ── Ripple ────────────────────────────────────────────────
  const rippleColors = ['#ec4899','#8b5cf6','#22d3ee','#fbbf24','#34d399'];
  function ripple() {
    const r = document.createElement('div');
    r.className = 'ripple';
    const c = rippleColors[Math.floor(Math.random() * rippleColors.length)];
    r.style.cssText = `left:${Math.random()*80+10}%;top:${Math.random()*70+10}%;border-color:${c};animation-duration:.6s;`;
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 700);
  }

  // ── Confetti ──────────────────────────────────────────────
  const confColors = ['#ec4899','#8b5cf6','#22d3ee','#fcd34d','#34d399','#fb7185','#a78bfa'];
  function confetti() {
    const btn = document.getElementById('toggleBtn');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    for (let i = 0; i < 55; i++) {
      setTimeout(() => {
        const c  = document.createElement('div');
        c.className = 'confetti';
        const sz = 6 + Math.random() * 6;
        c.style.cssText = [
          `background:${confColors[Math.floor(Math.random()*confColors.length)]}`,
          `left:${rect.left + rect.width/2 + (Math.random()-.5)*240}px`,
          `top:${rect.top + 10}px`,
          `width:${sz}px`,
          `height:${sz}px`,
          `border-radius:${Math.random()>.5?'50%':'3px'}`,
          `--dur:${.9+Math.random()*.8}s`,
        ].join(';');
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 1800);
      }, Math.random() * 220);
    }
  }

  // ── Messages ──────────────────────────────────────────────
  function nextMsg() {
    const el = document.getElementById('statusMsg');
    if (!el) return;
    el.classList.add('fade');
    setTimeout(() => {
      const msgs = isActive ? activeMsgs : sleepMsgs;
      msgIdx = (msgIdx + 1) % msgs.length;
      el.textContent = msgs[msgIdx];
      el.classList.remove('fade');
    }, 350);
  }
  setInterval(() => { if (!isActive) nextMsg(); }, 4500);

  // ── Progress bar ──────────────────────────────────────────
  function refreshProgress() {
    if (!isActive) return;
    const elapsed  = uptime % interval;
    const fillEl   = document.getElementById('progressFill');
    const countEl  = document.getElementById('countdownEl');
    if (fillEl)  fillEl.style.width  = ((elapsed / interval) * 100) + '%';
    if (countEl) countEl.textContent = (interval - elapsed) + 's';
  }

  // ── Activate ──────────────────────────────────────────────
  async function activate() {
    isActive = true;
    await getWakeLock();
    if (window.PBBuddy) PBBuddy.setAwake(true);
    confetti();

    const msgEl = document.getElementById('statusMsg');
    if (msgEl) { msgEl.textContent = activeMsgs[0]; msgIdx = 0; }
    pillOn('simPill', 'ACTIVE');
    ping();

    actTimer = setInterval(ping, interval * 1000);
    uptTimer = setInterval(() => {
      uptime++;
      const h = String(Math.floor(uptime / 3600)).padStart(2, '0');
      const m = String(Math.floor((uptime % 3600) / 60)).padStart(2, '0');
      const s = String(uptime % 60).padStart(2, '0');
      const el = document.getElementById('uptimeEl');
      if (el) el.textContent = `${h}:${m}:${s}`;
      refreshProgress();
    }, 1000);

    if (window.PBCanvas) PBCanvas.start();

    const playOff = document.getElementById('playOff');
    const progress = document.getElementById('progressWrap');
    const slider   = document.getElementById('sliderEl');
    const btn      = document.getElementById('toggleBtn');
    if (playOff) playOff.style.display = 'none';
    if (progress) progress.classList.add('show');
    if (slider)  slider.disabled = true;
    if (btn)     { btn.textContent = '😴 Let Buddy Rest'; btn.classList.add('sleep-mode'); }
  }

  // ── Deactivate ────────────────────────────────────────────
  async function deactivate() {
    isActive = false;
    await dropWakeLock();
    if (window.PBBuddy) PBBuddy.setAwake(false);
    clearInterval(actTimer); clearInterval(uptTimer);
    actTimer = uptTimer = null;
    uptime = pingCount = 0;

    const uptEl  = document.getElementById('uptimeEl');
    const pingEl = document.getElementById('pingEl');
    if (uptEl)  uptEl.textContent  = '00:00:00';
    if (pingEl) pingEl.textContent = '0';

    pillOff('simPill', 'IDLE');
    if (window.PBCanvas) PBCanvas.stop();

    const playOff  = document.getElementById('playOff');
    const progress = document.getElementById('progressWrap');
    const fill     = document.getElementById('progressFill');
    const slider   = document.getElementById('sliderEl');
    const msgEl    = document.getElementById('statusMsg');
    const btn      = document.getElementById('toggleBtn');

    if (playOff)  playOff.style.display = 'flex';
    if (progress) progress.classList.remove('show');
    if (fill)     fill.style.width = '0%';
    if (slider)   slider.disabled = false;
    if (msgEl)    { msgEl.textContent = sleepMsgs[0]; msgIdx = 0; }
    if (btn)      { btn.textContent = '🌙 Wake Up Buddy!'; btn.classList.remove('sleep-mode'); }
  }

  // ── Events ────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const btn    = document.getElementById('toggleBtn');
    const slider = document.getElementById('sliderEl');

    if (btn) btn.addEventListener('click', () => { isActive ? deactivate() : activate(); });

    if (slider) slider.addEventListener('input', e => {
      interval = Number(e.target.value);
      const label = interval >= 60
        ? `${(interval / 60).toFixed(1).replace('.0', '')}m`
        : interval + 's';
      const valEl = document.getElementById('sliderVal');
      if (valEl) valEl.textContent = label;

      // Restart ping timer with new interval if active
      if (isActive) {
        clearInterval(actTimer);
        actTimer = setInterval(ping, interval * 1000);
      }
    });

    // Init pill states
    pillOff('wakePill', wlOK ? 'OFF' : 'N/A');
    pillOff('simPill', 'IDLE');
  });
})();
