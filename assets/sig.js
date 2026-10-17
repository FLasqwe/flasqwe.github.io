// Подпись сайта: кольцо-путешественник, живые буквы «EKIMOV’», волна между чёрными и белыми полосами, часы.
// Один цикл requestAnimationFrame на всё: за кадр читаем только scrollY, остальное — из кэша
// (меряем при resize / ResizeObserver). Пишем только transform/opacity. Цикл стоит, когда нечего делать.
// Касание и узкий экран — легче: волна одноразовая (по IntersectionObserver), без реакции букв на курсор.
// «Уменьшение движения» — только часы: кольцо остаётся в «O», в шапке «EG’».
(() => {
  'use strict';
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const lite = matchMedia('(pointer: coarse), (max-width: 860px)');
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const mix = (a, b, t) => a + (b - a) * t;
  const sstep = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

  // ── Часы: Москва и честный статус ответа (10:00–22:00 — «отвечу сейчас», иначе — «утром») ──
  (() => {
    const els = $$('[data-clock]');
    if (!els.length) return;
    let fmt = null;
    try { fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Moscow', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }); } catch { fmt = null; }
    if (!fmt) { els.forEach((el) => { el.hidden = true; }); return; }
    const W = {
      en: { city: 'Moscow', on: 'replying now', off: 'will reply in the morning' },
      ru: { city: 'Москва', on: 'отвечу сейчас', off: 'отвечу утром' },
    };
    let timer = 0;
    const tick = () => {
      clearTimeout(timer);
      const d = new Date();
      let h = 0, m = 0;
      fmt.formatToParts(d).forEach((p) => { if (p.type === 'hour') h = +p.value % 24; if (p.type === 'minute') m = +p.value; });
      const w = W[root.lang === 'ru' ? 'ru' : 'en'];
      const on = h >= 10 && h < 22;
      const hm = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      els.forEach((el) => {
        el.classList.toggle('is-off', !on);
        const c = $('[data-clock-city]', el), t = $('[data-clock-time]', el), s = $('[data-clock-st]', el);
        if (c.textContent !== w.city) c.textContent = w.city;
        if (t.textContent !== hm) { t.textContent = hm; t.setAttribute('datetime', hm); }
        const st = on ? w.on : w.off;
        if (s.textContent !== st) s.textContent = st;
      });
      // следующий запуск — на границе минуты
      timer = setTimeout(tick, 60000 - (d.getSeconds() * 1000 + d.getMilliseconds()) + 40);
    };
    tick();
    document.addEventListener('eg:lang', tick);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
  })();

  if (reduce) { window.EGSig = { travel: () => false }; return; }

  // ── Общий цикл ─────────────────────────────────────────
  let raf = 0, y = window.scrollY, lastY = NaN, vw = window.innerWidth, vh = window.innerHeight, dirty = true;
  let pageOn = !document.hidden;
  const parts = []; // { upd(now, moved) → true, если нужен следующий кадр; measure() }
  const kick = () => { if (!raf && pageOn) raf = requestAnimationFrame(loop); };
  function loop(now) {
    raf = 0;
    if (!pageOn) return;
    y = window.scrollY; // единственное чтение за кадр
    const moved = dirty || y !== lastY;
    lastY = y; dirty = false;
    let more = false;
    for (const p of parts) if (p.upd(now, moved)) more = true;
    if (more) raf = requestAnimationFrame(loop);
  }
  const measureAll = () => { vw = window.innerWidth; vh = window.innerHeight; parts.forEach((p) => p.measure && p.measure()); dirty = true; kick(); };
  let rzT = 0;
  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', () => { cancelAnimationFrame(rzT); rzT = requestAnimationFrame(measureAll); }, { passive: true });
  document.addEventListener('visibilitychange', () => { pageOn = !document.hidden; if (pageOn) { dirty = true; kick(); } });
  // Положение элемента в документе по offset-цепочке: не зависит от transform (подъём букв, параллакс)
  const docXY = (el, stop) => {
    let x = 0, yy = 0, n = el;
    while (n && n !== stop) { x += n.offsetLeft; yy += n.offsetTop; n = n.offsetParent; }
    return [x, yy];
  };

  // ── Волна между полосами: нижний край полосы провисает мягкой дугой и выпрямляется при входе в кадр ──
  (() => {
    const bands = $$('main > .band, body > .band');
    const curves = [];
    bands.forEach((b, i) => {
      if (i === bands.length - 1) return; // у подвала дуги нет
      const c = document.createElement('div');
      c.className = 'curve';
      c.setAttribute('aria-hidden', 'true');
      c.innerHTML = '<svg viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false"><path d="M0 0C33.3 133.3 66.7 133.3 100 0Z"/></svg>';
      b.appendChild(c);
      curves.push({ el: c, band: b, bottom: 0, k: -1 });
    });
    if (!curves.length) return;
    root.classList.add('has-curves');
    // Касание / узкий экран: одна короткая анимация, когда дуга подходит к экрану; дальше — статично
    let io = null;
    const oneShot = () => {
      if (io) return;
      io = new IntersectionObserver((es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-flat');
        io.unobserve(e.target);
      }), { rootMargin: '0px 0px -22% 0px' });
      curves.forEach((c) => { c.el.style.transform = ''; c.k = -1; if (!c.el.classList.contains('is-flat')) io.observe(c.el); });
    };
    const measure = () => { curves.forEach((c) => { c.bottom = docXY(c.band)[1] + c.band.offsetHeight; }); };
    if (lite.matches) oneShot();
    lite.addEventListener('change', () => { if (lite.matches) oneShot(); else { if (io) { io.disconnect(); io = null; } curves.forEach((c) => c.el.classList.remove('is-flat')); measure(); dirty = true; kick(); } });
    if ('ResizeObserver' in window) { const ro = new ResizeObserver(() => { measure(); dirty = true; kick(); }); bands.forEach((b) => ro.observe(b)); }
    measure();
    parts.push({
      measure,
      upd(now, moved) {
        if (!moved || lite.matches) return false;
        for (const c of curves) {
          const s = c.bottom - y; // экранная Y границы
          // граница у нижнего края — дуга полная; к ~30 % высоты экрана — прямая
          const k = sstep(vh * 0.3, vh * 0.98, s);
          if (Math.abs(k - c.k) > 0.002) { c.k = k; c.el.style.transform = `scaleY(${k.toFixed(3)})`; }
        }
        return false;
      },
    });
  })();

  // ── Гигантские слова-разделители (WORKS / SERVICES / PROCESS / LET’S TALK): входят сжатыми по горизонтали
  //    и чуть ниже, распрямляются во всю ширину к ~40 % высоты экрана. Чистая функция от scrollY — обратимо.
  //    Касание / узкий экран — одноразовое появление (CSS по классу .is-in от motion.js).
  (() => {
    const G = $$('.gw__w').map((el) => ({ el, box: el.parentElement, top: 0, h: 0, s: '' }));
    if (!G.length) return;
    const setMode = () => {
      root.classList.toggle('gw-io', lite.matches);
      if (lite.matches) G.forEach((g) => { g.el.style.transform = ''; g.s = ''; });
    };
    const measure = () => G.forEach((g) => { g.top = docXY(g.box)[1]; g.h = g.box.offsetHeight; });
    setMode(); measure();
    lite.addEventListener('change', () => { setMode(); measure(); dirty = true; kick(); });
    if ('ResizeObserver' in window) { const ro = new ResizeObserver(() => { measure(); dirty = true; kick(); }); ro.observe(document.body); }
    document.addEventListener('eg:lang', () => { measure(); dirty = true; kick(); });
    parts.push({
      measure,
      upd(now, moved) {
        if (!moved || lite.matches) return false;
        for (const g of G) {
          const st = g.top - y; // экранная Y верха слова
          if (st > vh + 40 && g.s === 'out') continue;
          const e = sstep(vh * 1.02, vh * 0.4, st);
          let str;
          if (e > 0.998) str = '';
          else if (st > vh + 40) str = 'out';
          else {
            const sx = mix(0.56, 1, e), sy = mix(1.14, 1, e), ty = mix(0.24, 0, e) * g.h;
            str = `translate3d(0,${ty.toFixed(1)}px,0) scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
          }
          if (str !== g.s) {
            g.el.style.transform = str === 'out' ? 'translate3d(0,24%,0) scale(.56,1.14)' : str;
            g.s = str;
          }
        }
        return false;
      },
    });
  })();

  // ── Знак «EKIMOV’»: живые буквы, расход в стороны при уходе с первого экрана, кольцо-путешественник ──
  const hero = $('.hero');
  const mark = $('[data-mark]');
  const hdr = $('[data-hdr]');
  if (!hero || !mark) { window.EGSig = { travel: () => false }; return; }

  let heroH = hero.offsetHeight;
  let P = 0; // прогресс ухода с первого экрана 0…1 (scrollY / высота первого экрана)

  // Буквы: внутренний span каждой буквы (внешний поднимается при появлении — CSS)
  const L = { list: [], h: 100, px: -1e4, py: -1e4, vx: 0, on: false, settle: 0, cache: [] };
  const lettersInit = () => {
    const ls = $$('.ml', mark);
    if (!ls.length) return;
    const oi = ls.findIndex((el) => el.classList.contains('ml--o'));
    L.list = ls.map((el, i) => {
      let inner = el.querySelector('.ml__i');
      if (!inner && i !== oi) { inner = document.createElement('span'); inner.className = 'ml__i'; inner.textContent = el.textContent; el.textContent = ''; el.appendChild(inner); }
      return { el, inner, o: i === oi, side: i < oi ? -1 : 1, dist: Math.abs(i - oi), cx: 0, cy: 0,
        tx: 0, ty: 0, sx: 1, sy: 1, sk: 0, vtx: 0, vty: 0, vsx: 0, vsy: 0, vsk: 0, jump: 0, s: '' };
    });
  };
  const lettersMeasure = () => {
    heroH = hero.offsetHeight || 1;
    const fs = parseFloat(getComputedStyle(mark).fontSize) || 100;
    L.h = fs * 0.72;
    L.list.forEach((l) => { const [x, yy] = docXY(l.el); l.cx = x + l.el.offsetWidth / 2; l.cy = yy + l.el.offsetHeight * 0.58; });
  };
  // Буквы знака собирает site.js (идёт после этого файла) — подключаемся, когда разбор страницы закончен
  const lettersBoot = () => {
    lettersInit();
    lettersMeasure();
    if ('ResizeObserver' in window) new ResizeObserver(() => { lettersMeasure(); travelMeasure(); dirty = true; kick(); }).observe(mark);
    dirty = true; kick();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', lettersBoot, { once: true }); else lettersBoot();

  // Мышь: буквы — плотный упругий материал (сжатие, сдвиг, наклон рядом с курсором; пружины)
  if (fine) {
    let lastPX = 0, lastT = 0;
    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const t = e.timeStamp;
      if (lastT) L.vx = L.vx * 0.6 + ((e.clientX - lastPX) / Math.max(8, t - lastT)) * 16 * 0.4;
      lastPX = e.clientX; lastT = t;
      L.px = e.clientX; L.py = e.clientY;
      if (y < heroH) { L.on = true; kick(); }
    }, { passive: true });
    document.addEventListener('pointerout', (e) => { if (!e.relatedTarget) { L.px = L.py = -1e4; kick(); } }, { passive: true });
  }
  // Касание: одноразовая «усадка» букв после появления знака (без датчиков и разрешений)
  const settle = () => { if (!fine) { L.settle = performance.now() + 700; L.on = true; kick(); } };
  if (hero.classList.contains('is-ready')) settle();
  else new MutationObserver((ms, mo) => { if (hero.classList.contains('is-ready')) { mo.disconnect(); settle(); } }).observe(hero, { attributes: true, attributeFilter: ['class'] });

  const K = 230, C = 17; // пружина: жёсткость и затухание (лёгкий перехлёст — «плотный» материал)
  let lastNow = 0;
  parts.push({
    measure: lettersMeasure,
    upd(now, moved) {
      const dt = Math.min(0.034, Math.max(0.001, (now - (lastNow || now - 16)) / 1000));
      lastNow = now;
      if (y > heroH * 1.05 && !L.on) {
        // знак за кадром — ничего не пишем (последнее положение уже записано)
        if (!moved) return false;
      }
      P = clamp(y / heroH, 0, 1);
      // Расход: группы букв слева и справа от «O» расходятся, дальние — чуть сильнее
      // Расход — только когда сквозь зазор проваливается кольцо (без WebGL знак стоит целиком)
      const part = T.on ? sstep(0.03, 0.5, P) : 0;
      const spread = part * vw * 0.56;
      // Уходящие буквы гаснут, пока выходят за край: без одинокого обрезка штриха у кромки экрана
      const fade = T.on ? 1 - sstep(0.24, 0.46, P) : 1;
      const near = 1 - part; // живость гаснет, пока знак уходит
      const h = L.h;
      let active = false;
      L.vx *= 0.9;
      const sett = !fine && L.settle ? (now - L.settle) / 1000 : -1;
      for (let i = 0; i < L.list.length; i++) {
        const l = L.list[i];
        if (l.o) continue;
        let gtx = 0, gsx = 1, gsy = 1, gsk = 0;
        if (fine && near > 0.01) {
          const sx = l.cx + l.side * spread, sy = l.cy - y;
          const dx = (L.px - sx) / h, dy = (L.py - sy) / h;
          // соседи «O» откликаются мягче: их верх не должен заходить на кольцо
          const f = Math.exp(-(dx * dx + dy * dy) / 0.85) * near * (l.dist === 1 ? 0.6 : 1);
          if (f > 0.012) {
            gsy = 1 - 0.075 * f;
            gsx = 1 + 0.05 * f;
            gtx = -Math.sign(dx) * Math.min(1, Math.abs(dx)) * 0.05 * h * f;
            gsk = clamp(clamp(-L.vx * 0.3, -4.5, 4.5) * f - clamp(dx, -1, 1) * 2.4 * f, -4.5, 4.5);
            // наклон с опорой на базовую линию: у соседей «O» верх уходит только от кольца
            if (l.dist === 1) gsk = l.side < 0 ? Math.max(gsk, 0) : Math.min(gsk, 0);
          }
        }
        // Касание: один импульс по очереди, слева направо
        if (sett >= 0 && !l.kicked && sett >= i * 0.07) { l.vsy -= 1.1; l.vsx += 0.7; l.kicked = true; }
        // Пасхалка: буквы подпрыгивают волной, слева направо
        if (l.jump && now >= l.jump) { l.vty -= h * 7.2; l.vsy += 0.9; l.vsx -= 0.5; l.jump = 0; }
        // пружины
        l.vtx += (K * (gtx - l.tx) - C * l.vtx) * dt; l.tx += l.vtx * dt;
        l.vty += (K * (0 - l.ty) - C * l.vty) * dt; l.ty += l.vty * dt;
        l.vsx += (K * (gsx - l.sx) - C * l.vsx) * dt; l.sx += l.vsx * dt;
        l.vsy += (K * (gsy - l.sy) - C * l.vsy) * dt; l.sy += l.vsy * dt;
        l.vsk += (K * (gsk - l.sk) - C * l.vsk) * dt; l.sk += l.vsk * dt;
        if (l.jump || Math.abs(l.ty) > 0.05 || Math.abs(l.vty) > 0.05 || Math.abs(gtx - l.tx) > 0.05 || Math.abs(l.vtx) > 0.05 || Math.abs(gsx - l.sx) > 0.0004 || Math.abs(l.vsx) > 0.0004
          || Math.abs(gsy - l.sy) > 0.0004 || Math.abs(l.vsy) > 0.0004 || Math.abs(gsk - l.sk) > 0.02 || Math.abs(l.vsk) > 0.02) active = true;
        else { l.tx = gtx; l.ty = 0; l.sx = gsx; l.sy = gsy; l.sk = gsk; l.vtx = l.vty = l.vsx = l.vsy = l.vsk = 0; }
        const X = l.side * spread * (1 + 0.1 * l.dist) + l.tx;
        const s = (Math.abs(X) < 0.05 && Math.abs(l.ty) < 0.05 && Math.abs(l.sx - 1) < 0.0005 && Math.abs(l.sy - 1) < 0.0005 && Math.abs(l.sk) < 0.02)
          ? '' : `translate3d(${X.toFixed(1)}px,${l.ty.toFixed(1)}px,0) skewX(${l.sk.toFixed(2)}deg) scale(${l.sx.toFixed(4)},${l.sy.toFixed(4)})`;
        if (s !== l.s) { l.s = s; l.inner.style.transform = s; }
        const op = fade > 0.995 ? '' : fade.toFixed(3);
        if (op !== l.op) { l.op = op; l.inner.style.opacity = op; }
      }
      if (sett >= 0 && sett < L.list.length * 0.07 + 0.1) active = true;
      else if (sett < 0 && L.settle) active = true; // ждём старта импульса
      if (!active && sett > 1) { L.settle = 0; L.list.forEach((l) => { l.kicked = false; }); }
      L.on = active;
      return active;
    },
  });

  // ── Кольцо-путешественник: один canvas. Покой — в «O» знака; уход с первого экрана — проваливается
  //    сквозь разошедшиеся буквы на следующую полосу, сжимается и садится в шапку знаком «E◯’».
  //    Слой .orbfly: absolute в документе (скроллится вместе со страницей — без запаздывания на телефоне),
  //    во второй половине перелёта — fixed. Буфер canvas уменьшается вместе с кольцом.
  const T = { on: false, orb: null, fly: null, inner: null, disc: null, slot: null,
    S0: 100, pad: 120, cx: 0, cy: 0, dx: 0, dy: 0, Sd: 24, res: 0, mode: '', s: '', docked: false, hdrUp: false, menu: false, egg: 0 };
  // Пасхалка: быстрый оборот (две полные — облик тот же) и упругие подскоки; только поворот, сдвиг и масштаб
  const EGG = 1.7;
  const eggPose = (now) => {
    const t = (now - T.egg) / 1000;
    if (t >= EGG) { T.egg = 0; return { by: 0, bs: 1, spin: 0 }; }
    const hop = Math.abs(Math.sin(t * Math.PI * 2.6)) * Math.exp(-t * 2.4);
    const squash = Math.sin(t * Math.PI * 5.2) * Math.exp(-t * 3.2);
    const e = 1 - (1 - Math.min(1, t / 1.25)) ** 3;
    return { by: -hop, bs: 1 + 0.1 * squash, spin: e * Math.PI * 4 };
  };
  const dprQ = () => {
    const dpr = window.devicePixelRatio || 1;
    return matchMedia('(pointer: coarse)').matches ? 1.5 : Math.min(dpr, 1.5) * (T.orb && T.orb.soft ? 0.6 : 1);
  };
  const LEVELS = [24, 32, 40, 48, 64, 80, 96, 128, 160, 200, 256, 300, 340];
  function travelMeasure() {
    if (!T.on) return;
    heroH = hero.offsetHeight || 1;
    const d = T.disc;
    const [x, yy] = docXY(d);
    T.S0 = d.offsetWidth || 100;
    T.cx = x + T.S0 / 2; T.cy = yy + (d.offsetHeight || T.S0) / 2;
    // Гнездо в шапке: шапка fixed у верхнего края — offset-цепочка до неё = координаты на экране
    const [sx, sy] = docXY(T.slot, hdr);
    T.Sd = T.slot.offsetWidth || 24;
    T.dx = sx + hdr.offsetLeft + T.Sd / 2; T.dy = sy + hdr.offsetTop + T.Sd / 2;
    const nx = hero.nextElementSibling;
    T.pad = nx ? parseFloat(getComputedStyle(nx).paddingTop) || 120 : 120;
    T.inner.style.width = T.inner.style.height = `${T.S0}px`;
    T.s = ''; T.mode = '';
  }
  // Поза кольца по прогрессу P (чистая функция от scrollY — обратимо).
  // 1) 0…PA: держится в «O», затем отстаёт от уходящих букв и опускается сквозь зазор
  //    в верхнее поле следующей полосы (под провисшую кромку), уменьшаясь до 0,6;
  // 2) PA…1: сразу набирает высоту (ease-out) и смещается влево — садится в гнездо шапки.
  const PA = 0.44, S1 = 0.6;
  function pose() {
    const r1 = (T.S0 * S1) / 2;
    const d = Math.max(r1 + 6, (T.pad - 18) / 2); // центр кольца под границей полос: в пустом поле, выше заголовка
    const dropY = heroH * (1 - PA) + d;
    let x, sy, s, fixed = false, t2 = 0;
    if (P <= PA) {
      const e = inOut(P / PA);
      x = T.cx;
      sy = mix(T.cy - y, dropY, e);
      s = mix(1, S1, e);
    } else {
      t2 = (P - PA) / (1 - PA);
      const ex = inOut(t2), ey = 1 - (1 - t2) ** 1.7;
      x = mix(T.cx, T.dx, ex);
      sy = mix(dropY, T.dy, ey);
      s = mix(S1, T.Sd / T.S0, 1 - (1 - t2) ** 2);
      fixed = t2 > 0.5;
    }
    return { x, sy, s, fixed, t2 };
  }
  parts.push({
    measure: travelMeasure,
    upd(now, moved) {
      if (!T.on) return false;
      let forced = false;
      const egg = T.egg ? eggPose(now) : null;
      if (moved || !T.s || egg) {
        P = clamp(y / heroH, 0, 1);
        const q = pose();
        const docked = P >= 1;
        const fixed = docked || q.fixed;
        const size = T.S0 * q.s;
        const bs = egg ? egg.bs : 1, by = egg ? egg.by * size * 0.55 : 0;
        const left = q.x - (size * bs) / 2;
        const top = (fixed ? q.sy : q.sy + y) - (size * bs) / 2 + by;
        const mode = fixed ? 'fixed' : 'abs';
        if (mode !== T.mode) { T.mode = mode; T.fly.classList.toggle('is-fixed', fixed); }
        const str = `translate3d(${left.toFixed(1)}px,${top.toFixed(1)}px,0) scale(${(q.s * bs).toFixed(4)})`;
        if (str !== T.s) { T.s = str; T.inner.style.transform = str; }
        if (docked !== T.docked) {
          T.docked = docked; T.fly.classList.toggle('is-dock', docked); syncUp();
          if (docked) document.dispatchEvent(new CustomEvent('eg:dock'));
        }
        const arrived = docked || q.t2 > 0.86;
        if (hdr && arrived !== hdr.classList.contains('is-docked')) hdr.classList.toggle('is-docked', arrived);
        // Подвал первого экрана гаснет до того, как кольцо пойдёт вверх: оно не проезжает по мелкому тексту
        if (T.foot) {
          const fo = 1 - sstep(0.36, 0.54, P);
          const fs = fo > 0.995 ? '' : fo.toFixed(3);
          if (fs !== T.footS) { T.footS = fs; T.foot.style.opacity = fs; T.foot.style.visibility = fo < 0.005 ? 'hidden' : ''; }
        }
        T.orb.center(q.x, q.sy, size);
        T.orb.setSpin(P * 2.8 + (egg ? egg.spin : 0));
        // Буфер по видимому размеру: ступенями, чтобы не пересоздавать его каждый кадр
        const css = size;
        const need = css * (css < 64 ? Math.max(dprQ(), Math.min(window.devicePixelRatio || 1, 2)) : dprQ());
        const lv = LEVELS.find((v) => v >= need) || LEVELS[LEVELS.length - 1];
        if (lv !== T.res) { T.res = lv; if (T.orb.setRes(lv)) forced = true; }
      }
      const live = T.orb.ok && !(T.menu && !T.docked) && !(T.docked && T.hdrUp);
      if (live || forced || egg) T.orb.render(now, forced || !!egg);
      return live || !!T.egg;
    },
  });
  const syncUp = () => { T.fly.classList.toggle('is-up', T.docked && T.hdrUp); };

  window.EGSig = {
    // Подключить кольцо к путешествию. false — остаёмся в старом режиме (кольцо в «O», «EG’» в шапке)
    travel(orb, { disc, intro = false } = {}) {
      if (!orb || !orb.ok || !hdr) return false;
      const slot = $('[data-brand-o]', hdr);
      if (!slot) return false;
      const fly = document.createElement('div');
      fly.className = 'orbfly';
      fly.setAttribute('aria-hidden', 'true');
      fly.innerHTML = '<div class="orbfly__in"></div>';
      document.body.appendChild(fly);
      Object.assign(T, { on: true, orb, fly, inner: fly.firstChild, disc, slot, foot: $('.hero__foot', hero), footS: '' });
      root.classList.add('orb-travel');
      orb.mount(T.inner);
      orb.onpoke = kick;
      orb.onrestore = () => { T.res = 0; dirty = true; kick(); };
      travelMeasure();
      // Появление: после заставки кольцо уже на месте; без неё — проявляется вместе с подъёмом букв
      if (intro || hero.classList.contains('is-ready')) fly.classList.add('is-in', intro ? 'no-tr' : 'x');
      else new MutationObserver((ms, mo) => { if (hero.classList.contains('is-ready')) { mo.disconnect(); fly.classList.add('is-in'); } }).observe(hero, { attributes: true, attributeFilter: ['class'] });
      // Шапка уезжает — кольцо в шапке уезжает вместе с ней (и не рисуется)
      new MutationObserver(() => {
        const up = hdr.classList.contains('is-hidden');
        if (up !== T.hdrUp) { T.hdrUp = up; syncUp(); kick(); }
      }).observe(hdr, { attributes: true, attributeFilter: ['class'] });
      new MutationObserver(() => {
        const m = root.classList.contains('menu-open');
        if (m !== T.menu) { T.menu = m; if (!m) { travelMeasure(); dirty = true; } kick(); }
      }).observe(root, { attributes: true, attributeFilter: ['class'] });
      if (document.fonts) document.fonts.ready.then(() => { travelMeasure(); lettersMeasure(); dirty = true; kick(); });
      dirty = true; kick();
      return true;
    },
    heroH: () => heroH,
    // Пасхалка: кольцо крутится и подпрыгивает, буквы знака прыгают волной (если знак на экране)
    egg() {
      const now = performance.now();
      if (T.on) T.egg = now;
      if (y < heroH * 0.9) {
        let k = 0;
        L.list.forEach((l) => { if (!l.o) { l.jump = now + 60 + k * 65; k++; } });
        L.on = true;
      }
      dirty = true; kick();
      return T.on;
    },
  };
  kick();
})();
