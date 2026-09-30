// ===== EVOLT MOTORS — Sound Effects =====
// Sound only ever plays after a user click. Missing files never throw.

const SoundFX = (() => {
  let muted = localStorage.getItem('evolt_muted') === 'true';

  function play(src) {
    if (muted || !src) return;
    try {
      const audio = new Audio(src);
      audio.volume = 0.6;
      audio.play().catch(() => { /* file missing or blocked — ignore silently */ });
    } catch (e) { /* ignore */ }
  }

  function toggleMute() {
    muted = !muted;
    localStorage.setItem('evolt_muted', muted);
    return muted;
  }

  function isMuted() { return muted; }

  return { play, toggleMute, isMuted };
})();
