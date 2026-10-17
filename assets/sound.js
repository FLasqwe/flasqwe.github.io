// Звук интерфейса: по умолчанию выключен, выбор — в localStorage 'eg-sound'.
// Без аудиофайлов: короткие звуки синтезирует WebAudio. AudioContext создаётся только после того, как зритель
// включил звук (политика автозапуска); если звук был включён раньше — на первом жесте (клик, клавиша, касание).
// Тихий «тик» при наведении на пункты меню, вкладки и кнопки; мягкий «вумп», когда кольцо трогают или оно садится в шапку.
(() => {
  'use strict';
  const btn = document.querySelector('[data-sound]');
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!btn || !AC) return;
  const root = document.documentElement;
  const label = btn.querySelector('[data-sound-label]');
  const W = { en: ['Sound off', 'Sound on'], ru: ['Звук выкл', 'Звук вкл'] };
  const get = () => { try { return localStorage.getItem('eg-sound') === '1'; } catch { return false; } };
  const put = (v) => { try { localStorage.setItem('eg-sound', v ? '1' : '0'); } catch { /* приватный режим */ } };
  let on = get();
  let ctx = null, out = null, noise = null;

  const ensure = () => {
    if (!on) return null;
    if (!ctx) {
      try { ctx = new AC(); } catch { ctx = null; return null; }
      out = ctx.createGain();
      out.gain.value = 0.55; // общий уровень: всё очень тихо
      out.connect(ctx.destination);
      // короткий буфер белого шума для щелчка
      noise = ctx.createBuffer(1, Math.round(ctx.sampleRate * 0.03), ctx.sampleRate);
      const d = noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** 3;
      window.__egAudio = true; // для проверок: контекст существует
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  };

  // «Тик»: щелчок шума через полосовой фильтр + едва слышный высокий тон, ~25 мс
  let lastTick = 0;
  const tick = () => {
    const c = ensure();
    if (!c || c.state !== 'running') return;
    const t = c.currentTime;
    if (t - lastTick < 0.045) return;
    lastTick = t;
    const src = c.createBufferSource(); src.buffer = noise;
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 3800; bp.Q.value = 1.4;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.06, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
    src.connect(bp).connect(g).connect(out);
    src.start(t); src.stop(t + 0.04);
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = 2400;
    const og = c.createGain();
    og.gain.setValueAtTime(0.0001, t);
    og.gain.exponentialRampToValueAtTime(0.012, t + 0.002);
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);
    o.connect(og).connect(out);
    o.start(t); o.stop(t + 0.03);
  };

  // «Вумп»: синус падает 170 → 55 Гц, мягкая атака, ~0,4 с — как будто тронули надувной предмет
  let lastWhoomp = 0;
  const whoomp = (k = 1, pitch = 1) => {
    const c = ensure();
    if (!c || c.state !== 'running') return;
    const t = c.currentTime;
    if (t - lastWhoomp < 0.12) return;
    lastWhoomp = t;
    const o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(170 * pitch, t);
    o.frequency.exponentialRampToValueAtTime(55 * pitch, t + 0.34);
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16 * k, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
    o.connect(lp).connect(g).connect(out);
    o.start(t); o.stop(t + 0.45);
  };

  const render = () => {
    const l = root.lang === 'ru' ? 'ru' : 'en';
    btn.setAttribute('aria-pressed', String(on));
    btn.classList.toggle('is-on', on);
    if (label) label.textContent = W[l][on ? 1 : 0];
  };
  btn.hidden = false;
  render();
  document.addEventListener('eg:lang', render);
  btn.addEventListener('click', () => {
    on = !on;
    put(on);
    render();
    if (on) { ensure(); setTimeout(() => whoomp(0.6, 1.3), 30); }
    else if (ctx) ctx.suspend().catch(() => {});
  });
  // Звук был включён в прошлый раз: контекст — на первом жесте зрителя
  if (on) {
    const first = () => { ['pointerdown', 'keydown'].forEach((ev) => window.removeEventListener(ev, first, true)); ensure(); };
    ['pointerdown', 'keydown'].forEach((ev) => window.addEventListener(ev, first, true));
  }

  // Наведение мышью (на касании — нажатие) на пункты меню, вкладки, «таблетки», переключатели
  const TICK = '.mnav__list a, .hero__links a, .menu-btn, .tab, .pill, .seg button, .lang button, .bd-btn, .opt, .snd, .stage__open, .work__all, .reel__item';
  let lastEl = null;
  document.addEventListener('pointerover', (e) => {
    if (!on || e.pointerType !== 'mouse') return;
    const el = e.target.closest && e.target.closest(TICK);
    if (el && el !== lastEl) tick();
    lastEl = el;
  }, { passive: true });
  document.addEventListener('pointerdown', (e) => {
    if (!on || e.pointerType === 'mouse') return;
    if (e.target.closest && e.target.closest(TICK)) tick();
  }, { passive: true });
  document.addEventListener('eg:poke', () => whoomp(1, 1));
  let lastDock = 0;
  document.addEventListener('eg:dock', () => { const n = performance.now(); if (n - lastDock > 1500) { lastDock = n; whoomp(0.55, 1.5); } });
  document.addEventListener('eg:egg', () => { [0, 110, 220].forEach((d, i) => setTimeout(() => { lastWhoomp = 0; whoomp(0.7, 1.2 + i * 0.35); }, d + 160)); });
})();
