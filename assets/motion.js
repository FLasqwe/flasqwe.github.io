// Слой движения в духе noth.in: маскированное появление заголовков по строкам, «перебор» моно-меток,
// шторка на картинках, параллакс и ускорение бегущей строки от скорости прокрутки (только мышь),
// точка-курсор. Только transform/opacity, всё запускает IntersectionObserver, без захвата прокрутки.
// Касание: только одноразовые появления. «Уменьшение движения» — слой не включается вовсе.
(() => {
  'use strict';
  const root = document.documentElement;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const wide = matchMedia('(min-width: 861px)');
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  root.classList.add('mo');

  // ── 1. Заголовки: слова в масках, задержка по номеру строки ──
  const HEADS = '.hero__title, .big, .contact__title';
  const splitWords = (el) => {
    if (el.querySelector('.sw')) return;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 1) { if (n.tagName !== 'BR') walk(n); return; }
        if (n.nodeType !== 3 || !n.nodeValue.trim()) return;
        const frag = document.createDocumentFragment();
        n.nodeValue.split(/( +)/).forEach((part) => {
          if (!part) return;
          if (/^ +$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const w = document.createElement('span'); w.className = 'sw';
          const i = document.createElement('span'); i.className = 'sw__i'; i.textContent = part;
          w.appendChild(i); frag.appendChild(w);
        });
        n.replaceWith(frag);
      });
    };
    walk(el);
    el.classList.add('is-split');
  };
  // Номер строки — по offsetTop слов; меряем один раз, когда заголовок подходит к экрану
  const stagger = (el) => {
    let line = -1, top = null, k = 0;
    $$('.sw', el).forEach((w) => {
      const t = w.offsetTop;
      if (top === null || t > top + 4) { line++; top = t; k = 0; }
      w.style.setProperty('--d', `${line * 110 + k * 22}ms`);
      k++;
    });
  };
  const headIo = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    stagger(e.target); headIo.unobserve(e.target);
  }), { rootMargin: '0px 0px 25% 0px' });
  // После подъёма слова-маски снимаем: заголовок снова простой текст — пересчёт стилей при прокрутке не растёт
  const unwrap = (el) => { $$('.sw', el).forEach((w) => w.replaceWith(w.textContent)); el.normalize(); };
  const watchDone = (el) => {
    const n = el.querySelectorAll('.sw__i').length;
    let k = 0;
    const on = (e) => {
      if (e.propertyName !== 'transform' || !e.target.classList.contains('sw__i')) return;
      if (++k >= n) { el.removeEventListener('transitionend', on); unwrap(el); }
    };
    el.addEventListener('transitionend', on);
  };
  // Заголовок, уже показанный (смена языка), не режем вовсе — анимацию он не повторяет
  const prepHeads = () => $$(HEADS).forEach((el) => {
    if (el.closest('.is-in, .hero.is-ready') || el.querySelector('.sw')) return;
    splitWords(el); watchDone(el); headIo.observe(el);
  });

  // ── 2. Гигантские слова-разделители: линия под словом прочерчивается при появлении
  //    (само слово сжимается/растягивается от прокрутки в assets/sig.js; на телефоне — одноразово по этому же классу)
  const oneShot = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in'); oneShot.unobserve(e.target);
  }), { threshold: 0.2, rootMargin: '0px 0px -30px 0px' });
  const prepWords = () => $$('.gw:not(.is-in)').forEach((el) => oneShot.observe(el));

  // ── 2b. Счётчики «01 / 07», (01)…(07), 01…04: цифры прокручиваются, как в счётчике-одометре (IBM Plex Mono).
  //    Читалке — настоящий текст (.fl__sr), анимация — aria-hidden. Только transform.
  const FLIP = '.info__count, .svc__no, .step__no, .work__count';
  const escH = (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] || c);
  const flipify = (el) => {
    if (el.dataset.fl) return;
    const txt = el.textContent;
    if (!/\d/.test(txt)) return;
    el.dataset.fl = '1';
    el.innerHTML = `<span class="fl__sr">${[...txt].map(escH).join('')}</span><span class="fl" aria-hidden="true">${[...txt].map((c) => (/\d/.test(c)
      ? `<span class="fd" data-d="${c}"><span class="fd__s"><i>0</i></span></span>` : `<span class="fc">${c === ' ' ? '\u00a0' : escH(c)}</span>`)).join('')}</span>`;
  };
  const roll = (el, delay = 0) => {
    $$('.fd', el).forEach((d, i) => {
      const s = d.firstChild;
      const to = +d.dataset.d;
      const from = +(s.lastChild ? s.lastChild.textContent : 0);
      // путь: от текущей цифры вперёд, 5–8 шагов, последний — нужная цифра
      const steps = 5 + ((i * 3 + to) % 4);
      const seq = [];
      for (let k = 0; k <= steps; k++) seq.push((from + k) % 10);
      seq[steps] = to;
      s.innerHTML = seq.map((x) => `<i>${x}</i>`).join('');
      if (s.__a) s.__a.cancel();
      // WAAPI: без принудительного пересчёта раскладки; 1,12em — высота окна цифры (--fh в CSS)
      const a = s.animate([{ transform: 'translate3d(0,0,0)' }, { transform: `translate3d(0,${(-steps * 1.12).toFixed(2)}em,0)` }],
        { duration: 750 + i * 120, delay: delay + i * 70, easing: 'cubic-bezier(.2,.95,.25,1.04)', fill: 'both' });
      s.__a = a;
      a.onfinish = () => { if (s.__a !== a) return; s.innerHTML = `<i>${to}</i>`; a.cancel(); s.__a = null; };
    });
  };
  const flipIo = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    flipIo.unobserve(e.target);
    roll(e.target, 120);
  }), { rootMargin: '0px 0px -8% 0px' });
  const prepFlips = () => $$(FLIP).forEach((el) => { if (!el.dataset.fl) { flipify(el); flipIo.observe(el); } });
  // Смена вкладки: счётчик новой панели прокручивается заново
  document.addEventListener('eg:tab', (e) => {
    const el = document.querySelector(`#panel-${e.detail.id} .info__count`);
    if (!el) return;
    flipify(el); flipIo.unobserve(el); roll(el, 160);
  });

  // ── 3. Моно-метки: короткий «перебор» символов при появлении (только мышь — на телефоне без лишней раскладки) ──
  const GLYPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#+*';
  const runs = new Set();
  const scramble = (el) => {
    const final = el.textContent;
    if (!final.trim()) return;
    const run = { raf: 0 };
    runs.add(run);
    let f = 0; const total = 16;
    const step = () => {
      f++;
      if (f % 2) { run.raf = requestAnimationFrame(step); return; } // ~30 кадров/с
      const p = f / total;
      el.textContent = [...final].map((c, i) => (c === ' ' || i / final.length < p ? c : GLYPH[(Math.random() * GLYPH.length) | 0])).join('');
      if (f < total) run.raf = requestAnimationFrame(step); else { el.textContent = final; runs.delete(run); }
    };
    run.raf = requestAnimationFrame(step);
  };
  const labelIo = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    labelIo.unobserve(e.target); scramble(e.target);
  }), { threshold: 1 });
  const prepLabels = () => { if (fine) $$('.label > span:last-child, .aside > .label, .prin > .label').forEach((el) => labelIo.observe(el)); };
  const stopScrambles = () => { runs.forEach((r) => cancelAnimationFrame(r.raf)); runs.clear(); };

  // ── 4. Картинки: шторка (transform) + лёгкое приближение кадра ──
  // (чёрная карточка с работами — своя белая шторка в CSS: .mo .reel::after)
  $$('.aside__fig').forEach((el) => el.classList.add('wipe'));

  // ── Язык: тексты переписаны — заново режем заголовки, гасим незаконченный перебор ──
  document.addEventListener('eg:lang', () => { stopScrambles(); prepHeads(); prepWords(); prepFlips(); prepLabels(); });
  // Первый eg:lang прозвучал раньше (site.js идёт до этого файла) — готовим вручную
  prepHeads(); prepWords(); prepFlips(); prepLabels();
  // Первый экран: строки заголовка — после загрузки шрифтов (перенос мог измениться)
  if (document.fonts) document.fonts.ready.then(() => $$('.hero__title').forEach(stagger));

  if (!fine) return; // всё ниже — только мышь

  // ── 5. Параллакс кадра «Подхода» (широкий экран). Знак первого экрана двигает assets/sig.js ──
  const par = [
    { el: document.querySelector('.aside__fig img'), box: document.querySelector('.aside__fig'), k: -0.05 },
  ].filter((p) => p.el && p.box).map((p) => ({ ...p, top: 0, h: 0, vis: false, off: 0 }));
  const measure = () => par.forEach((p) => { const r = p.box.getBoundingClientRect(); p.top = r.top + scrollY; p.h = r.height; });
  let praf = 0;
  const parUpd = () => {
    praf = 0;
    const y = scrollY, vh = innerHeight, on = wide.matches;
    par.forEach((p) => {
      if (!p.vis) return;
      if (!on) { p.el.style.translate = ''; p.off = 0; return; }
      const off = ((y + vh - p.top) / (vh + p.h) - 0.5) * p.h * p.k * 2;
      p.off = off;
      p.el.style.translate = `0 ${off.toFixed(1)}px`;
    });
  };
  const parReq = () => { if (!praf) praf = requestAnimationFrame(parUpd); };
  const parIo = new IntersectionObserver((es) => es.forEach((e) => {
    const p = par.find((x) => x.box === e.target);
    if (p) { p.vis = e.isIntersecting; if (p.vis) { measure(); parReq(); } }
  }));
  par.forEach((p) => parIo.observe(p.box));
  addEventListener('resize', () => { measure(); parReq(); }, { passive: true });

  // ── 6. Бегущая строка подвала: скорость растёт от скорости прокрутки ──
  const mq = document.querySelector('.marquee');
  const track = document.querySelector('.marquee__track');
  let mVis = false, mRaf = 0, mX = 0, mHalf = 0, mLast = 0, vel = 0, dir = 1, lastY = scrollY, lastT = performance.now();
  const BASE = 60; // px/с — примерно прежний темп
  const mMeasure = () => { mHalf = track.scrollWidth / 2; };
  const mLoop = (now) => {
    mRaf = 0;
    if (!mVis || !wide.matches) { track.style.transform = ''; root.classList.remove('mq-js'); return; }
    const dt = Math.min(0.05, (now - (mLast || now)) / 1000);
    mLast = now;
    vel *= 0.93;
    // Прокрутка вверх разворачивает ленту, вниз — снова вперёд
    mX -= dir * (BASE + Math.min(1400, Math.abs(vel)) * 0.6) * dt;
    if (mHalf) { if (-mX > mHalf) mX += mHalf; else if (mX > 0) mX -= mHalf; }
    track.style.transform = `translate3d(${mX.toFixed(1)}px,0,0)`;
    mRaf = requestAnimationFrame(mLoop);
  };
  if (mq && track) {
    new IntersectionObserver((es) => {
      mVis = es[0].isIntersecting;
      if (mVis && wide.matches) { root.classList.add('mq-js'); mMeasure(); mLast = 0; if (!mRaf) mRaf = requestAnimationFrame(mLoop); }
    }, { rootMargin: '80px 0px' }).observe(mq);
    document.addEventListener('eg:lang', () => { if (mVis) mMeasure(); });
  }

  // Одна подписка на прокрутку: только scrollY и время — без чтения раскладки
  addEventListener('scroll', () => {
    const now = performance.now(), y = scrollY;
    const dt = Math.max(8, now - lastT);
    vel = vel * 0.5 + ((y - lastY) / dt) * 500;
    if (Math.abs(y - lastY) > 0.5) dir = y < lastY ? -1 : 1;
    lastY = y; lastT = now;
    parReq();
  }, { passive: true });

  // ── 7. Точка-курсор: растёт над ссылками; над работами, демо, почтой и кольцом — круг с моно-подписью
  //    (только мышь и широкий экран; pointer-events: none — клики не перехватывает; клавиатура не затронута)
  const CUR = {
    en: { scroll: 'Scroll', interact: 'Click to interact', open: 'Open', copy: 'Copy', copied: 'Copied ✓', play: 'Play' },
    ru: { scroll: 'Листать', interact: 'Включить демо', open: 'Открыть', copy: 'Копировать', copied: 'Готово ✓', play: 'Играть' },
  };
  const KIND = [
    ['.device__shield', 'interact'],
    ['.stage--site .device', 'scroll'],
    ['.tab, .reel__item, .aside__img', 'open'],
    ['[data-mail], [data-copy]', 'copy'],
    ['.disc.is-poke, .brand__o.is-poke', 'play'],
  ];
  const dot = document.createElement('div');
  dot.className = 'cur'; dot.setAttribute('aria-hidden', 'true');
  dot.innerHTML = '<span class="cur__c"><span class="cur__l"></span></span>';
  const lab = dot.querySelector('.cur__l');
  document.body.appendChild(dot);
  let cx = -100, cy = -100, dx = -100, dy = -100, cRaf = 0, big = false, shown = false, kind = null, tone = '', copiedT = 0, lastEl = null;
  const cLoop = () => {
    cRaf = 0;
    dx += (cx - dx) * 0.24; dy += (cy - dy) * 0.24;
    dot.style.transform = `translate3d(${dx.toFixed(1)}px,${dy.toFixed(1)}px,0)`;
    if (Math.abs(cx - dx) + Math.abs(cy - dy) > 0.3) cRaf = requestAnimationFrame(cLoop);
  };
  const HOT = 'a, button, [role="tab"], label, summary, .disc.is-poke';
  const words = () => CUR[root.lang === 'ru' ? 'ru' : 'en'];
  const setKind = (k) => {
    if (k === kind && !(k === 'copy' && copiedT)) return;
    kind = k;
    dot.classList.toggle('is-label', !!k);
    if (k) { lab.textContent = words()[k === 'copy' && copiedT ? 'copied' : k]; dot.dataset.kind = k; }
  };
  let eggT = 0;
  const hide = () => { if (shown) { shown = false; dot.classList.remove('is-on'); root.classList.remove('cur-on'); } };
  document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || !wide.matches) { hide(); return; }
    cx = e.clientX; cy = e.clientY;
    if (!shown) { shown = true; dx = cx; dy = cy; dot.classList.add('is-on'); root.classList.add('cur-on'); }
    const t = e.target;
    if (t !== lastEl && t.closest) pick(t);
    if (!cRaf) cRaf = requestAnimationFrame(cLoop);
  }, { passive: true });
  // разбор цели — только когда элемент под курсором сменился (не на каждом движении)
  function pick(t) {
      lastEl = t;
      let k = null;
      for (const [sel, name] of KIND) if (t.closest(sel)) { k = name; break; }
      // уже открытая вкладка ничего не откроет — обычная точка; во время пасхалки над кольцом ничего не рисуем
      if (k === 'open' && t.closest('[role="tab"][aria-selected="true"]')) k = null;
      const eggRing = !!eggT && !!t.closest('.disc, .brand__o');
      if (eggRing) k = null;
      setKind(k);
      const hot = !k && !eggRing && !!t.closest(HOT);
      if (hot !== big) { big = hot; dot.classList.toggle('is-big', hot); }
      const b = t.closest('[data-tone]');
      const tn = b ? b.dataset.tone : 'dark';
      if (tn !== tone) { tone = tn; dot.dataset.tone = tn; }
  }
  // Курсор ушёл в живое демо (iframe) или за окно — прячем точку
  document.addEventListener('pointerout', (e) => { if (!e.relatedTarget) { hide(); lastEl = null; } }, { passive: true });
  document.addEventListener('pointerdown', () => dot.classList.add('is-press'), { passive: true });
  document.addEventListener('pointerup', () => dot.classList.remove('is-press'), { passive: true });
  // Почта скопирована — подпись на круге ненадолго меняется
  document.addEventListener('eg:copied', () => {
    clearTimeout(copiedT);
    copiedT = setTimeout(() => { copiedT = 0; if (kind === 'copy') lab.textContent = words().copy; }, 1500);
    if (kind === 'copy') lab.textContent = words().copied;
  });
  document.addEventListener('eg:lang', () => { if (kind) lab.textContent = words()[kind]; });
  // Пасхалка: кольцо празднует без подписи поверх — на время последовательности остаётся только точка
  document.addEventListener('eg:egg', () => {
    clearTimeout(eggT);
    if (kind === 'play') setKind(null);
    if (big) { big = false; dot.classList.remove('is-big'); }
    eggT = setTimeout(() => { eggT = 0; lastEl = null; }, 2000);
  });
  // Щит демо снят кликом — элемент под курсором тот же, но подпись должна смениться
  //  (и вкладка после клика стала выбранной — «Открыть» убираем сразу, не дожидаясь движения мыши)
  document.addEventListener('click', () => {
    lastEl = null;
    if (shown) setTimeout(() => { const t = lastEl === null && document.elementFromPoint(cx, cy); if (t && t.closest && t.tagName !== 'IFRAME') pick(t); }, 0);
  }, { passive: true });
})();