/* js/buddy.js — Buddy character state manager (PBBuddy namespace) */
window.PBBuddy = (function () {

  function setAwake(awake) {
    const asleepEl  = document.getElementById('stateAsleep');
    const awakeEl   = document.getElementById('stateAwake');
    const zzzWrap   = document.getElementById('zzzWrap');
    const sparkle   = document.getElementById('sparkleWrap');
    const svg       = document.getElementById('buddySvg');
    const glow      = document.getElementById('buddyGlow');

    if (asleepEl) asleepEl.style.display  = awake ? 'none' : '';
    if (awakeEl)  awakeEl.style.display   = awake ? ''     : 'none';
    if (zzzWrap)  zzzWrap.style.display   = awake ? 'none' : '';
    if (sparkle)  sparkle.style.display   = awake ? ''     : 'none';
    if (svg)      svg.classList.toggle('awake', awake);
    if (glow)     glow.classList.toggle('awake', awake);
  }

  return { setAwake };
})();
