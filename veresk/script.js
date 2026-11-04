// VERESK — конструктор дома с живой сметой, сборка дома при прокрутке и RU/EN.
// Всё работает без сборки; 3D подгружается отдельно (house.js) и только рядом с блоком.
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lowPower = matchMedia('(pointer: coarse), (max-width: 860px)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* приватный режим */ } },
  };
  const IMG = (id, w, h, extra = '') => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=74${extra}`;

  // ── Смета: единая формула для конструктора и карточек проектов ──
  const RATE = { timber: 78000, frame: 62000, aerated: 84000, brick: 99000 };
  const FINISH = { shell: { k: 0.52, m: -2 }, prefinish: { k: 0.74, m: -1 }, turnkey: { k: 1, m: 0 } };
  const ROOF = { gable: 1, barn: 1.06, flat: 1.09 };
  const FLOORS = { 1: 1.06, 1.5: 1, 2: 0.98 };
  const TERM = { timber: 6.5, frame: 5, aerated: 7, brick: 8 };
  const EXTRA = { terrace: 420000, carport: 560000, fireplace: 380000 };
  const PARTS = [['foundation', 0.12, 0], ['box', 0.33, 0], ['roof', 0.13, 0], ['windows', 0.11, 0], ['eng', 0.15, 1], ['finish', 0.16, 2]];
  const LEVEL = { shell: 0, prefinish: 1, turnkey: 2 };

  function calc(p) {
    const f = FINISH[p.finish];
    const perM2 = RATE[p.material] * f.k * ROOF[p.roof] * FLOORS[p.floors] * Math.pow(120 / p.area, 0.08) * (p.panoramic ? 1.06 : 1);
    const base = perM2 * p.area;
    const extras = (p.terrace ? EXTRA.terrace : 0) + (p.carport ? EXTRA.carport : 0) + (p.fireplace ? EXTRA.fireplace : 0);
    const total = Math.round((base + extras) / 10000) * 10000;
    const term = Math.max(3, Math.round((TERM[p.material] + (p.area / 100) * 1.2 + f.m) * 2) / 2);
    const credit = total * 0.8;
    const r = 0.06 / 12;
    const month = Math.round((credit * r) / (1 - Math.pow(1 + r, -240)) / 100) * 100;
    const active = PARTS.filter((x) => x[2] <= LEVEL[p.finish]);
    const share = active.reduce((a, x) => a + x[1], 0);
    const rows = PARTS.map(([key, s, lv]) => ({ key, on: lv <= LEVEL[p.finish], sum: lv <= LEVEL[p.finish] ? (base * s) / share : 0, pct: lv <= LEVEL[p.finish] ? (s / share) * 100 : 0 }));
    if (extras) rows.push({ key: 'extras', on: true, sum: extras, pct: (extras / total) * 100 });
    return { total, term, month, perM2: Math.round(total / p.area / 100) * 100, rows };
  }

  // Шесть проектов — вымышленные, параметры сразу открываются в конструкторе
  const PROJECTS = [
    { id: 'opushka', ru: 'Опушка', en: 'Opushka', img: IMG('1636680463293-7d7a81e24799', 880, 1100), p: { area: 124, floors: 1.5, material: 'timber', roof: 'gable', terrace: true, carport: false, panoramic: false, fireplace: true, finish: 'turnkey' } },
    { id: 'proseka', ru: 'Просека', en: 'Proseka', img: IMG('1780232581508-55b904f17ffc', 880, 1100), p: { area: 96, floors: 1, material: 'frame', roof: 'barn', terrace: false, carport: false, panoramic: false, fireplace: false, finish: 'turnkey' } },
    { id: 'mezha', ru: 'Межа', en: 'Mezha', img: IMG('1684514570577-35f958b52870', 880, 1100), p: { area: 148, floors: 2, material: 'frame', roof: 'barn', terrace: false, carport: true, panoramic: false, fireplace: false, finish: 'turnkey' } },
    { id: 'pervy-sneg', ru: 'Первый снег', en: 'First Snow', img: IMG('1771680968896-cfd9b8f7244e', 880, 1100), p: { area: 118, floors: 1, material: 'timber', roof: 'gable', terrace: true, carport: false, panoramic: true, fireplace: true, finish: 'turnkey' } },
    { id: 'plato', ru: 'Плато', en: 'Plato', img: IMG('1748063578185-3d68121b11ff', 880, 1100), p: { area: 212, floors: 2, material: 'aerated', roof: 'flat', terrace: true, carport: true, panoramic: true, fireplace: false, finish: 'turnkey' } },
    { id: 'sloboda', ru: 'Слобода', en: 'Sloboda', img: IMG('1785746730462-74049651fa26', 880, 1100, '&crop=focalpoint&fp-x=.62&fp-y=.36&fp-z=1.5'), p: { area: 186, floors: 2, material: 'brick', roof: 'gable', terrace: false, carport: true, panoramic: false, fireplace: true, finish: 'turnkey' } },
  ];

  const SWATCH = {
    timber: 'repeating-linear-gradient(0deg,#b98a5e 0 9px,#7d5636 9px 10px)',
    frame: 'repeating-linear-gradient(90deg,#3a403b 0 8px,#1f2421 8px 9px)',
    aerated: 'linear-gradient(135deg,#efe9dd,#dfd8ca)',
    brick: 'repeating-linear-gradient(0deg,#a5563f 0 7px,#cbbcaa 7px 8.5px)',
  };

  // ── Тексты: русский берём из разметки, здесь английский и динамические строки ──
  const EN = {
    skip: 'Skip to content', 'nav.aria': 'Main', 'nav.projects': 'Homes', 'nav.config': 'Configurator', 'nav.process': 'How we build', 'nav.escrow': 'Escrow', 'nav.faq': 'Questions',
    'nav.cta': 'Build a home', 'nav.menu': 'Menu', 'nav.request': 'Get an estimate', 'lang.aria': 'Language',
    'hero.alt': 'Timber house with panoramic windows glowing at dusk among pines', 'hero.kicker': 'Turnkey homes · Moscow region and Central Russia',
    'hero.title': 'A quiet home.<br><em>An honest estimate.</em>',
    'hero.lead': 'Build your home in the configurator and see the price, timeline and a section-by-section estimate at once. Your money stays in escrow until the house is handed over.',
    'hero.cta': 'Build your home', 'hero.cta2': 'See the homes',
    'fact.from': 'Turnkey home', 'fact.term': 'Build time', 'fact.pay': 'Payment', 'fact.payV': 'after handover, via escrow', 'fact.warr': 'Warranty', 'fact.warrV': '10 years on the structure',
    'man.kicker': 'How we think',
    'man.text': 'We don’t sell square metres. We price a house down to the last screw, show you the estimate before the contract and never change it after. All we need from you is to decide where the armchair goes.',
    'win.aria': 'What matters in a home', 'win.alt1': 'Living room with panoramic windows onto a winter forest', 'win.alt2': 'Bright living room with a fireplace and tall windows', 'win.alt3': 'Forest seen through a large window from a dark room',
    'win.t1': 'Light', 'win.d1': 'Windows are planned by the sun. The living room faces south, bedrooms wake with the sunrise.',
    'win.t2': 'Warmth', 'win.d2': 'Walls, floor and roof work as one envelope: minus thirty outside, plus twenty-two inside, and a heating bill that doesn’t scare you.',
    'win.t3': 'Quiet', 'win.d3': 'We place the house so the window frames the forest, not the neighbours.',
    'pr.kicker': 'Homes', 'pr.title': 'Six homes<br>to start from', 'pr.lead': 'Every home opens in the configurator: change the size, material and roof and the price updates instantly.', 'pr.filter': 'Material', 'pr.aria': 'Home designs',
    'cf.load': 'Loading the 3D model…', 'cf.kicker': 'Configurator', 'cf.title': 'Build your home,<br>the estimate writes itself', 'cf.hint': 'Drag to rotate', 'cf.area': 'Floor area', 'cf.floors': 'Storeys', 'cf.material': 'Walls', 'cf.roof': 'Roof',
    'cf.roofNote': 'A flat roof can’t have an attic floor, so we switched to two storeys.', 'cf.extra': 'Extras', 'cf.finish': 'Fit-out', 'cf.total': 'Estimated cost', 'cf.term': 'Timeline', 'cf.m2': 'Per m²', 'cf.month': 'Mortgage',
    'cf.cta': 'Get the detailed estimate', 'cf.note': 'Mortgage example: 20% down, 20 years, 6% a year. Prices are illustrative, this is a concept.',
    'st.kicker': 'How we build', 'st.payL': 'Bank has paid us',
    'es.kicker': 'Escrow', 'es.title': 'The money waits in the bank<br>while we build',
    'es.t1': 'You fund the account', 'es.d1': 'You deposit the contract sum into a bank escrow account. We can’t touch it.',
    'es.t2': 'We build with our own money', 'es.d2': 'We pay for materials and crews ourselves. You get site photos every week.',
    'es.t3': 'House accepted, bank pays', 'es.d3': 'You sign the acceptance, the house is registered, and only then does the bank pay us.',
    'es.s1': '₽ received before handover', 'es.s2': '% of the price fixed in the contract', 'es.s3': 'year warranty on foundation and walls',
    'fq.kicker': 'Questions', 'fq.title': 'What people<br>ask most',
    'fq.q1': 'What does “turnkey” include?', 'fq.a1': 'Foundation, structure, roof, windows, utilities and full interior finish: you can move in with your furniture. The exact scope is in the estimate, section by section.',
    'fq.q2': 'Can the price go up during the build?', 'fq.a2': 'No. The estimate is fixed in the contract. The price changes only if you change the design, and every change is agreed in writing.',
    'fq.q3': 'I don’t have a plot yet. Where do I start?', 'fq.a3': 'We’ll help you choose: we check access, utilities and soil before you buy, so the foundation holds no surprises.',
    'fq.q4': 'Do you build in winter?', 'fq.a4': 'Yes. Frame and timber go up all year. For aerated concrete and brick we schedule wet work away from hard frost.',
    'fq.q5': 'Can I get a mortgage?', 'fq.a5': 'Yes. A construction contract with escrow works for building mortgages. We’ll suggest banks and help with the documents.',
    'rq.alt': 'House with a timber deck on a snowy plot among trees', 'rq.kicker': 'Estimate', 'rq.title': 'We’ll send the estimate<br>for your home', 'rq.name': 'Your name', 'rq.phone': 'Phone', 'rq.plot': 'Plot',
    'rq.p1': 'I have one', 'rq.p2': 'Still choosing', 'rq.p3': 'Need help choosing', 'rq.cta': 'Get the estimate', 'rq.note': 'Demo form: nothing is sent anywhere.',
    'ft.tag': 'A quiet home. An honest estimate.', 'ft.aria': 'Footer', 'ft.top': 'Back to top',
    'ft.concept': 'Concept website, portfolio project. VERESK is a fictional company: prices, homes, timelines and warranties are illustrative.', 'ft.photos': 'Photos: Unsplash',
  };

  const D = {
    ru: {
      title: 'VERESK — дома под ключ с честной сметой', from: 'от', mln: 'млн ₽', mo: 'мес', moFrom: 'от', perMo: '₽/мес', sq: 'м²',
      floors: { 1: '1 этаж', 1.5: 'С мансардой', 2: '2 этажа' },
      mat: { timber: 'Брус', frame: 'Каркас', aerated: 'Газобетон', brick: 'Кирпич' },
      roof: { gable: 'Двускатная', barn: 'Барнхаус', flat: 'Плоская' },
      extra: { terrace: 'Терраса', carport: 'Навес для авто', panoramic: 'Окна в пол', fireplace: 'Камин' },
      finish: { shell: ['Тёплый контур', 'Коробка, кровля, окна'], prefinish: ['Предчистовая', 'Плюс инженерия'], turnkey: ['Под ключ', 'Можно въезжать'] },
      parts: { foundation: 'Фундамент', box: 'Стены и перекрытия', roof: 'Кровля', windows: 'Окна и двери', eng: 'Инженерия', finish: 'Отделка', extras: 'Дополнительно' },
      all: 'Все', open: 'Открыть в конструкторе', notIncl: 'не входит',
      steps: [
        ['Недели 1–3', 'Фундамент', 'Смету подписали, деньги легли на эскроу. Геология, разметка и монолитная плита.'],
        ['Недели 4–7', 'Каркас', 'Силовой каркас из сухой строганой доски. Собираем на участке, без мокрых процессов.'],
        ['Недели 8–10', 'Кровля', 'Стропила и фальцевая кровля. Дом закрыт от дождя, дальше работаем в любую погоду.'],
        ['Недели 11–14', 'Контур и окна', 'Утепление, мембраны, обшивка и окна. Тепловизор подтверждает, что щелей нет.'],
        ['Недели 15–18', 'Инженерия', 'Вода, электричество, отопление. В окнах загорается свет: дом становится домом.'],
        ['Недели 19–24', 'Отделка и ключи', 'Фасад, терраса, дорожки. Вы принимаете дом, и только теперь банк платит нам.'],
      ],
      paid: 'вся сумма', yourHome: 'Ваш дом', ok: (n) => `Спасибо, ${n}! Это концепт, поэтому заявка никуда не ушла. На настоящем сайте смета уже летела бы вам на почту.`,
    },
    en: {
      title: 'VERESK — turnkey homes with an honest estimate', from: 'from', mln: 'M ₽', mo: 'mo', moFrom: 'from', perMo: '₽/mo', sq: 'm²',
      floors: { 1: '1 storey', 1.5: 'With attic', 2: '2 storeys' },
      mat: { timber: 'Timber', frame: 'Frame', aerated: 'Aerated block', brick: 'Brick' },
      roof: { gable: 'Gable', barn: 'Barn', flat: 'Flat' },
      extra: { terrace: 'Terrace', carport: 'Carport', panoramic: 'Full-height windows', fireplace: 'Fireplace' },
      finish: { shell: ['Weather-tight shell', 'Structure, roof, windows'], prefinish: ['Pre-finish', 'Plus utilities'], turnkey: ['Turnkey', 'Ready to move in'] },
      parts: { foundation: 'Foundation', box: 'Walls and floors', roof: 'Roof', windows: 'Windows and doors', eng: 'Utilities', finish: 'Interior finish', extras: 'Extras' },
      all: 'All', open: 'Open in configurator', notIncl: 'not included',
      steps: [
        ['Weeks 1–3', 'Foundation', 'Estimate signed, money in escrow. Soil survey, setting out and a monolithic slab.'],
        ['Weeks 4–7', 'Frame', 'A structural frame of dry planed timber, assembled on site with no wet work.'],
        ['Weeks 8–10', 'Roof', 'Rafters and a standing-seam roof. The house is rainproof, so work goes on in any weather.'],
        ['Weeks 11–14', 'Envelope and windows', 'Insulation, membranes, sheathing and windows. A thermal camera confirms there are no gaps.'],
        ['Weeks 15–18', 'Utilities', 'Water, power, heating. The lights come on and the house becomes a home.'],
        ['Weeks 19–24', 'Finish and keys', 'Facade, terrace, paths. You accept the house, and only now does the bank pay us.'],
      ],
      paid: 'the full sum', yourHome: 'Your home', ok: (n) => `Thank you, ${n}! This is a concept, so nothing was sent. On a real site your estimate would be on its way.`,
    },
  };

  // Русский текст снимаем со страницы, чтобы не держать его дважды
  const RU = {};
  $$('[data-i18n]').forEach((el) => { RU[el.dataset.i18n] ??= el.innerHTML; });
  $$('[data-i18n-alt]').forEach((el) => { RU[el.dataset.i18nAlt] ??= el.alt; });
  $$('[data-i18n-aria]').forEach((el) => { RU[el.dataset.i18nAria] ??= el.getAttribute('aria-label'); });

  let lang = store.get('veresk-lang') || ((navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'en');
  const t = () => D[lang];
  const num = (v) => new Intl.NumberFormat(lang === 'ru' ? 'ru-RU' : 'en-US').format(v);
  const money = (v) => `${num(v)} ₽`;
  const mln = (v) => `${new Intl.NumberFormat(lang === 'ru' ? 'ru-RU' : 'en-US', { maximumFractionDigits: 1 }).format(v / 1e6)} ${t().mln}`;
  const moLabel = (m) => `${String(m).replace('.', lang === 'ru' ? ',' : '.')} ${t().mo}`;

  function applyLang(next) {
    lang = next;
    const dict = lang === 'en' ? EN : RU;
    document.documentElement.lang = lang;
    document.title = t().title;
    $$('[data-i18n]').forEach((el) => { const v = dict[el.dataset.i18n]; if (v != null) el.innerHTML = v; });
    $$('[data-i18n-alt]').forEach((el) => { const v = dict[el.dataset.i18nAlt]; if (v != null) el.alt = v; });
    $$('[data-i18n-aria]').forEach((el) => { const v = dict[el.dataset.i18nAria]; if (v != null) el.setAttribute('aria-label', v); });
    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    store.set('veresk-lang', lang);
    splitWords();
    renderOptions();
    renderProjects();
    renderSteps();
    renderHeroFacts();
    renderSummary();
    onScroll();
  }

  // ── Манифест: слово за словом ──
  let words = [];
  function splitWords() {
    const el = $('[data-words]');
    if (!el) return;
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');
    words = $$('.w', el);
  }

  // ── Конструктор ──
  const P = { area: 128, floors: 1.5, material: 'timber', roof: 'gable', terrace: true, carport: false, panoramic: true, fireplace: false, finish: 'turnkey' };
  let viewer = null;
  let viewerReq = 0;

  function pushToViewer() {
    if (!viewer || viewerReq) return;
    viewerReq = requestAnimationFrame(() => { viewerReq = 0; viewer.update({ ...P }); });
  }

  function radio(host, values, current, label, onPick, cls = 'opt', disabled = () => false) {
    host.innerHTML = '';
    for (const v of values) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = cls;
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', String(v === current));
      b.innerHTML = label(v);
      b.disabled = disabled(v);
      b.addEventListener('click', () => onPick(v));
      host.appendChild(b);
    }
  }

  function renderOptions() {
    const T = t();
    radio($('#floors'), [1, 1.5, 2], P.floors, (v) => T.floors[v], (v) => setP({ floors: v }), 'opt', (v) => v === 1.5 && P.roof === 'flat');
    radio($('#material'), ['timber', 'frame', 'aerated', 'brick'], P.material, (v) => `<i style="background:${SWATCH[v]}"></i>${T.mat[v]}`, (v) => setP({ material: v }), 'sw');
    radio($('#roof'), ['gable', 'barn', 'flat'], P.roof, (v) => T.roof[v], (v) => {
      const patch = { roof: v };
      const switched = v === 'flat' && P.floors === 1.5;
      if (switched) patch.floors = 2;
      $('#roofNote').hidden = !switched;
      setP(patch);
    });
    radio($('#finish'), ['shell', 'prefinish', 'turnkey'], P.finish, (v) => `<span>${T.finish[v][0]}</span><small>${T.finish[v][1]}</small>`, (v) => setP({ finish: v }));
    const ex = $('#extras');
    ex.innerHTML = '';
    for (const k of ['terrace', 'carport', 'panoramic', 'fireplace']) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'tog';
      b.setAttribute('aria-pressed', String(!!P[k]));
      b.textContent = T.extra[k];
      b.addEventListener('click', () => setP({ [k]: !P[k] }));
      ex.appendChild(b);
    }
  }

  function setP(patch, { skipViewer = false } = {}) {
    Object.assign(P, patch);
    renderOptions();
    renderSummary();
    if (!skipViewer) pushToViewer();
  }

  function fillRange() {
    const a = $('#area');
    a.value = P.area;
    a.style.setProperty('--fill', `${((P.area - 60) / 200) * 100}%`);
    $('#areaOut').textContent = `${P.area} ${t().sq}`;
  }

  function renderSummary() {
    const T = t();
    const c = calc(P);
    fillRange();
    $('#sumPrice').textContent = money(c.total);
    $('#sumTerm').textContent = moLabel(c.term);
    $('#sumM2').textContent = money(c.perM2);
    $('#sumMonth').textContent = `${num(c.month)} ${T.perMo}`;
    $('#sumBars').innerHTML = c.rows.map((r) => `<li class="${r.on ? '' : 'off'}"><span>${T.parts[r.key]}</span><span>${r.on ? mln(r.sum) : T.notIncl}</span><i style="--w:${r.pct.toFixed(1)}%"></i></li>`).join('');
    const spec = [`${P.area} ${T.sq}`, T.floors[P.floors], T.mat[P.material], T.roof[P.roof], T.finish[P.finish][0]];
    $('#cfgSpec').innerHTML = `<b class="stage__price">${money(c.total)}</b>${spec.map((s) => `<span>${s}</span>`).join('')}`;
    const extras = ['terrace', 'carport', 'panoramic', 'fireplace'].filter((k) => P[k]).map((k) => T.extra[k]);
    $('#reqSum').innerHTML = `<b>${T.yourHome}:</b> ${spec.join(' · ')}${extras.length ? `<br>${extras.join(' · ')}` : ''}<br><b>${money(c.total)}</b> · ${moLabel(c.term)}`;
  }

  // ── Проекты ──
  let filter = 'all';
  function renderProjects() {
    const T = t();
    const chips = $('#prFilter');
    chips.innerHTML = '';
    for (const f of ['all', 'timber', 'frame', 'aerated', 'brick']) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.textContent = f === 'all' ? T.all : T.mat[f];
      b.setAttribute('aria-pressed', String(f === filter));
      b.addEventListener('click', () => { filter = f; renderProjects(); });
      chips.appendChild(b);
    }
    const rail = $('#prRail');
    rail.innerHTML = PROJECTS.filter((x) => filter === 'all' || x.p.material === filter).map((x) => {
      const c = calc(x.p);
      return `<article class="pcard">
        <div class="pcard__img"><img src="${x.img}" alt="${lang === 'ru' ? 'Проект дома' : 'Home design'} ${x[lang]}" loading="lazy" decoding="async">
          <button type="button" class="btn btn--paper pcard__go" data-project="${x.id}">${T.open}</button></div>
        <div class="pcard__row"><h3>${x[lang]}</h3><span class="pcard__price">${T.from} ${mln(c.total)}</span></div>
        <p class="pcard__spec">${x.p.area} ${T.sq} · ${T.floors[x.p.floors]} · ${T.mat[x.p.material]} · ${moLabel(c.term)}</p>
      </article>`;
    }).join('');
  }
  $('#prRail').addEventListener('click', (e) => {
    const b = e.target.closest('[data-project]');
    if (!b) return;
    const pr = PROJECTS.find((x) => x.id === b.dataset.project);
    $('#roofNote').hidden = true;
    setP({ ...pr.p });
    $('#config').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  function renderHeroFacts() {
    const list = PROJECTS.map((x) => calc(x.p));
    const min = Math.min(...list.map((c) => c.total));
    const term = Math.min(...list.map((c) => c.term));
    $('#factPrice').textContent = `${t().from} ${mln(min)}`;
    $('#factTerm').textContent = `${t().moFrom} ${moLabel(term)}`;
  }

  // ── Шаги стройки ──
  let stepNow = -1;
  function renderSteps() {
    $('#steps').innerHTML = t().steps.map(([w, h, d], i) => `<li class="step${i === stepNow ? ' on' : ''}"><b>${w}</b><h3>${h}</h3><p>${d}</p></li>`).join('');
  }

  // ── Прокрутка: один обработчик на всё ──
  const nav = $('#nav');
  const heroImg = $('.hero__img');
  const winSec = $('#window');
  const winFrame = $('#winFrame');
  const winImgs = $$('#winFrame img');
  const winCaps = $$('.win__caps li');
  const procSec = $('#process');
  const procBar = $('#procBar');
  let procViewer = null;
  let ticking = false;

  function onScroll() {
    ticking = false;
    const vh = innerHeight;
    const y = scrollY;
    nav.classList.toggle('is-over', y < vh * 0.82);
    if (!reduceMotion && !lowPower && y < vh * 1.2) heroImg.style.transform = `translate3d(0, ${y * -0.08}px, 0)`;

    // Манифест
    if (words.length) {
      const r = words[0].parentElement.getBoundingClientRect();
      if (r.top < vh && r.bottom > -100) {
        const n = Math.round(clamp((vh * 0.82 - r.top) / (r.height + vh * 0.22)) * words.length);
        words.forEach((w, i) => w.classList.toggle('on', i < n));
      }
    }

    // Окно
    const wr = winSec.getBoundingClientRect();
    if (wr.top < vh && wr.bottom > 0) {
      const p = clamp(-wr.top / (wr.height - vh));
      const g = ease(clamp(p / 0.3));
      const small = innerWidth < 761;
      const [tp, sd, bt] = small ? [26, 12, 34] : [24, 30, 24];
      winFrame.style.clipPath = `inset(${tp * (1 - g)}% ${sd * (1 - g)}% ${bt * (1 - g)}% ${sd * (1 - g)}% round ${16 * (1 - g)}px)`;
      const a = clamp((p - 0.5) / 0.07);
      const b = clamp((p - 0.76) / 0.07);
      winImgs[0].style.transform = `scale(${1.14 - 0.14 * g})`;
      winImgs[1].style.opacity = a;
      winImgs[1].style.transform = `scale(${1.08 - 0.08 * clamp((p - 0.5) / 0.26)})`;
      winImgs[2].style.opacity = b;
      winImgs[2].style.transform = `scale(${1.08 - 0.08 * clamp((p - 0.76) / 0.24)})`;
      const idx = g < 0.72 ? -1 : p < 0.53 ? 0 : p < 0.79 ? 1 : 2;
      winCaps.forEach((c, i) => c.classList.toggle('on', i === idx));
    }

    // Стройка
    const pr = procSec.getBoundingClientRect();
    if (pr.top < vh && pr.bottom > 0) {
      const p = clamp(-pr.top / (pr.height - vh));
      procBar.style.transform = `scaleX(${p})`;
      const st = Math.min(5, Math.floor(p * 6));
      if (st !== stepNow) {
        stepNow = st;
        $$('.step').forEach((el, i) => el.classList.toggle('on', i === st));
      }
      $('#payOut').textContent = p > 0.97 ? t().paid : '0 ₽';
      if (procViewer) procViewer.setProgress(p * 6.05);
    }
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);

  // ── 3D подгружается, когда блок близко; без WebGL конструктор и смета работают и так ──
  function lazy3D(section, init) {
    const io = new IntersectionObserver((es) => {
      if (!es.some((e) => e.isIntersecting)) return;
      io.disconnect();
      import('./house.js').then(init).catch((err) => {
        console.warn('3D недоступно:', err);
        section.classList.add('no3d');
      });
    }, { rootMargin: '500px' });
    io.observe(section);
  }
  lazy3D($('#cfgView'), (m) => {
    viewer = m.createViewer($('#cfgView'), { params: { ...P }, lowPower });
    viewer.setLit(0.0);
  });
  lazy3D($('#procView'), (m) => {
    procViewer = m.createViewer($('#procView'), {
      params: { area: 140, floors: 1.5, material: 'frame', roof: 'gable', terrace: true, carport: false, panoramic: true, fireplace: true },
      detail: true, yaw: -0.7, lowPower,
    });
    onScroll();
  });

  // ── Мелочи: диапазон, меню, язык, счётчики, появление, форма ──
  $('#area').addEventListener('input', (e) => setP({ area: Number(e.target.value) }));

  const burger = $('.burger');
  const menu = $('#menu');
  menu.appendChild($('.nav__end .lang').cloneNode(true));
  const setMenu = (open) => {
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    nav.classList.toggle('menu-open', open);
  };
  burger.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', (e) => { const b = e.target.closest('.lang button'); if (b) applyLang(b.dataset.lang); });

  const inView = new IntersectionObserver((es) => {
    for (const e of es) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('in');
      inView.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -8% 0px' });
  $$('.head, .flow li, .faq details, .req__box').forEach((el) => { el.classList.add('reveal'); inView.observe(el); });

  const countIO = new IntersectionObserver((es) => {
    for (const e of es) {
      if (!e.isIntersecting) continue;
      countIO.unobserve(e.target);
      const end = Number(e.target.dataset.count);
      if (!end || reduceMotion) { e.target.textContent = end; continue; }
      const t0 = performance.now();
      const step = (now) => {
        const k = clamp((now - t0) / 1300);
        e.target.textContent = Math.round(end * ease(k));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => countIO.observe(el));

  const phone = $('#reqForm [name="phone"]');
  phone.addEventListener('input', () => {
    let d = phone.value.replace(/\D/g, '');
    if (d.startsWith('8')) d = '7' + d.slice(1);
    if (d && !d.startsWith('7')) d = '7' + d;
    d = d.slice(0, 11);
    const a = d.slice(1, 4); const b = d.slice(4, 7); const c = d.slice(7, 9); const e = d.slice(9, 11);
    phone.value = d ? `+7${a ? ` (${a}` : ''}${b ? `) ${b}` : ''}${c ? `-${c}` : ''}${e ? `-${e}` : ''}` : '';
  });
  $('#reqForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    const { name, phone: tel } = f.elements;
    const nameOk = name.value.trim().length > 1;
    const phoneOk = tel.value.replace(/\D/g, '').length === 11;
    name.classList.toggle('bad', !nameOk);
    tel.classList.toggle('bad', !phoneOk);
    if (!nameOk || !phoneOk) { (nameOk ? tel : name).focus(); return; }
    const ok = $('#reqOk');
    ok.textContent = t().ok(name.value.trim());
    ok.hidden = false;
    f.reset();
  });

  applyLang(lang);
})();
