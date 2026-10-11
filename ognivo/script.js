// OGNIVO — поведение страницы: язык EN/RU, меню, искры, анимации, бронь.
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // ── Тексты ──────────────────────────────────────────────
  const T = {
    en: {
      'nav.story': 'Story', 'nav.menu': 'Menu', 'nav.chef': 'Chef', 'nav.gallery': 'Gallery', 'nav.visit': 'Visit', 'nav.book': 'Book a table',
      'hero.eyebrow': 'Wood-fired kitchen · Est. 2019', 'hero.t1': 'Cooked over', 'hero.t2': 'open fire.',
      'hero.lead': 'No gas, no electricity at the pass — only oak, birch and cherry wood. Nine courses that taste of smoke, season and patience.',
      'hero.cta1': 'Reserve a table', 'hero.cta2': 'See the menu',
      'hero.hoursLabel': 'Tonight', 'hero.hours': '18:00 — 00:00', 'hero.seatsLabel': 'Seats left', 'hero.seats': '6 at the counter',
      marquee: 'Wood ✦ Fire ✦ Smoke ✦ Season ✦ Ember ✦ Patience ✦ Wood ✦ Fire ✦ Smoke ✦ Season ✦ Ember ✦ Patience ✦',
      'story.eyebrow': 'Our story', 'story.title': 'One fire. <em>Every dish.</em>',
      'story.p1': 'OGNIVO began with a single question: what if a kitchen gave up every modern shortcut? Our hearth is lit at 4 pm and never goes out during service. Each dish is built around its own heat — embers for fish, open flame for meat, the cooling oven for bread and dessert.',
      'story.p2': 'We work with twelve small farms within 200 km. The menu changes with what they bring, sometimes twice a week.',
      'story.s1': 'kinds of wood', 'story.hUnit': 'h', 'story.s2': 'the hearth burns daily', 'story.s3': 'partner farms', 'story.s4': 'seats, no more',
      'sig.eyebrow': 'Signature', 'sig.title': "Four dishes <em>we're known for</em>",
      'sig.d1': 'Ember-aged ribeye', 'sig.d1d': '45-day dry-aged beef, finished in birch embers, smoked bone-marrow jus.',
      'sig.d2': 'Char-kissed sea bass', 'sig.d2d': 'Cooked whole on oak coals, charred leek, brown-butter beurre blanc.',
      'sig.d3': 'Smoked oyster', 'sig.d3d': 'Kissed by cherry smoke for 40 seconds, pickled shallot, sea buckthorn.',
      'sig.d4': 'Burnt chocolate', 'sig.d4d': '70% chocolate baked in the dying oven, smoked salt, hay ice cream.',
      'menu.eyebrow': 'Menu', 'menu.title': 'What the fire <em>gives today</em>',
      'menu.tab1': 'Tasting', 'menu.tab2': 'À la carte', 'menu.tab3': 'Wine & Bar',
      'menu.note': 'Menu changes weekly. Tell us about allergies when booking — every course can be adapted.',
      'chef.eyebrow': 'The chef', 'chef.name': 'Mark Vetrov',
      'chef.quote': "“Fire doesn't forgive shortcuts. You can't rush embers or fake smoke — and guests feel that honesty on the plate.”",
      'chef.bio': 'Eleven years in kitchens from Copenhagen to San Sebastián. Mark learned live-fire cooking in the Basque Country and opened OGNIVO to bring that discipline home.',
      'gal.eyebrow': 'Inside OGNIVO', 'gal.title': 'An evening <em>by the hearth</em>',
      'rev.1': "“The best meal I've had this year. You can taste the wood in every course — and the bread alone is worth the trip.”", 'rev.1a': 'Anna K., guest',
      'rev.2': '“Sat at the counter and watched the chef work the embers for three hours. Theatre and dinner in one.”', 'rev.2a': 'David L., guest',
      'rev.3': '“Quiet, warm, unhurried. Nine courses flew by. The burnt chocolate will haunt me.”', 'rev.3a': 'Maria S., guest',
      'res.eyebrow': 'Reservations', 'res.title': 'Save your place <em>by the fire</em>',
      'res.lead': 'We hold tables for 15 minutes. For groups of 9 or more, please call us.',
      'res.date': 'Date', 'res.time': 'Time', 'res.guests': 'Guests', 'res.name': 'Name', 'res.phone': 'Phone',
      'res.notes': 'Allergies or occasion (optional)', 'res.submit': 'Request a table',
      'res.okTitle': 'See you by the fire', 'res.again': 'Make another booking',
      'res.errDate': 'Please choose a date from today onwards.', 'res.errName': 'Please enter your name.', 'res.errPhone': 'Please enter a phone number we can call.',
      'res.summary': (d) => `${d.name}, we've noted a table for ${d.guests} on ${d.date} at ${d.time}. We'll call ${d.phone} to confirm. (This is a demo — no booking was sent.)`,
      'visit.eyebrow': 'Visit', 'visit.title': 'Find the <em>smoke</em>', 'visit.addr': '7 Ognevaya Street, Moscow', 'visit.metro': '5 min walk from Chistye Prudy',
      'visit.hoursTitle': 'Hours', 'visit.d1': 'Tue — Thu', 'visit.d2': 'Fri — Sat', 'visit.d3': 'Sunday', 'visit.d4': 'Monday', 'visit.closed': 'Closed — we rest the hearth',
      'foot.tag': 'Wood-fired kitchen. Lit daily at 4 pm.', 'foot.concept': 'Concept website · portfolio project',
    },
    ru: {
      'nav.story': 'История', 'nav.menu': 'Меню', 'nav.chef': 'Шеф', 'nav.gallery': 'Галерея', 'nav.visit': 'Контакты', 'nav.book': 'Забронировать',
      'hero.eyebrow': 'Кухня на живом огне · с 2019', 'hero.t1': 'Готовим', 'hero.t2': 'на живом огне.',
      'hero.lead': 'Ни газа, ни электричества на раздаче — только дуб, берёза и вишня. Девять подач со вкусом дыма, сезона и терпения.',
      'hero.cta1': 'Забронировать стол', 'hero.cta2': 'Смотреть меню',
      'hero.hoursLabel': 'Сегодня', 'hero.hours': '18:00 — 00:00', 'hero.seatsLabel': 'Свободно', 'hero.seats': '6 мест у стойки',
      marquee: 'Дерево ✦ Огонь ✦ Дым ✦ Сезон ✦ Угли ✦ Терпение ✦ Дерево ✦ Огонь ✦ Дым ✦ Сезон ✦ Угли ✦ Терпение ✦',
      'story.eyebrow': 'Наша история', 'story.title': 'Один огонь. <em>Каждое блюдо.</em>',
      'story.p1': 'OGNIVO началось с вопроса: что если кухня откажется от всех современных упрощений? Наш очаг разжигают в 16:00, и он не гаснет до конца вечера. У каждого блюда свой жар — угли для рыбы, открытое пламя для мяса, остывающая печь для хлеба и десертов.',
      'story.p2': 'Мы работаем с двенадцатью небольшими фермами в радиусе 200 км. Меню меняется вместе с тем, что они привозят, — иногда дважды в неделю.',
      'story.s1': 'вида древесины', 'story.hUnit': 'ч', 'story.s2': 'горит очаг каждый день', 'story.s3': 'фермы-партнёра', 'story.s4': 'мест, не больше',
      'sig.eyebrow': 'Фирменное', 'sig.title': 'Четыре блюда, <em>за которыми приходят</em>',
      'sig.d1': 'Рибай на углях', 'sig.d1d': 'Говядина 45-дневной сухой выдержки, доведённая на берёзовых углях, копчёный жюс с костным мозгом.',
      'sig.d2': 'Сибас с огня', 'sig.d2d': 'Целиком на дубовых углях, обожжённый лук-порей, бёр-блан на коричневом масле.',
      'sig.d3': 'Копчёная устрица', 'sig.d3d': '40 секунд в вишнёвом дыму, маринованный шалот, облепиха.',
      'sig.d4': 'Жжёный шоколад', 'sig.d4d': 'Шоколад 70%, запечённый в остывающей печи, копчёная соль, мороженое из сена.',
      'menu.eyebrow': 'Меню', 'menu.title': 'Что огонь <em>даёт сегодня</em>',
      'menu.tab1': 'Дегустация', 'menu.tab2': 'Основное меню', 'menu.tab3': 'Вино и бар',
      'menu.note': 'Меню обновляется каждую неделю. Расскажите об аллергиях при бронировании — любую подачу можно адаптировать.',
      'chef.eyebrow': 'Шеф', 'chef.name': 'Марк Ветров',
      'chef.quote': '«Огонь не прощает спешки. Угли не поторопишь, дым не подделаешь — и гости чувствуют эту честность на тарелке».',
      'chef.bio': 'Одиннадцать лет на кухнях от Копенгагена до Сан-Себастьяна. Марк учился готовить на живом огне в Стране Басков и открыл OGNIVO, чтобы привезти эту дисциплину домой.',
      'gal.eyebrow': 'Внутри OGNIVO', 'gal.title': 'Вечер <em>у очага</em>',
      'rev.1': '«Лучший ужин за этот год. В каждой подаче чувствуется дерево — а ради одного хлеба стоит приехать».', 'rev.1a': 'Анна К., гость',
      'rev.2': '«Сидели у стойки и три часа смотрели, как шеф работает с углями. Театр и ужин в одном».', 'rev.2a': 'Давид Л., гость',
      'rev.3': '«Тихо, тепло, без суеты. Девять подач пролетели незаметно. Жжёный шоколад теперь снится».', 'rev.3a': 'Мария С., гость',
      'res.eyebrow': 'Бронирование', 'res.title': 'Займите место <em>у огня</em>',
      'res.lead': 'Держим стол 15 минут. Для компаний от 9 человек — позвоните нам.',
      'res.date': 'Дата', 'res.time': 'Время', 'res.guests': 'Гостей', 'res.name': 'Имя', 'res.phone': 'Телефон',
      'res.notes': 'Аллергии или повод (необязательно)', 'res.submit': 'Отправить заявку',
      'res.okTitle': 'Ждём вас у огня', 'res.again': 'Новая бронь',
      'res.errDate': 'Выберите дату не раньше сегодняшней.', 'res.errName': 'Укажите имя.', 'res.errPhone': 'Укажите телефон, по которому можно позвонить.',
      'res.summary': (d) => `${d.name}, отметили стол на ${d.guests} ${plural(d.guests, ['гостя', 'гостей', 'гостей'])} — ${d.date} в ${d.time}. Перезвоним на ${d.phone} для подтверждения. (Это демо — заявка никуда не отправлена.)`,
      'visit.eyebrow': 'Контакты', 'visit.title': 'Идите <em>на дым</em>', 'visit.addr': 'Москва, ул. Огневая, 7', 'visit.metro': '5 минут пешком от «Чистых прудов»',
      'visit.hoursTitle': 'Часы работы', 'visit.d1': 'Вт — Чт', 'visit.d2': 'Пт — Сб', 'visit.d3': 'Воскресенье', 'visit.d4': 'Понедельник', 'visit.closed': 'Выходной — очаг отдыхает',
      'foot.tag': 'Кухня на живом огне. Разжигаем каждый день в 16:00.', 'foot.concept': 'Концепт-сайт · проект для портфолио',
    },
  };

  // Меню: цены отдельно для каждой валюты, чтобы не пересчитывать курсом.
  const MENU = {
    en: {
      tasting: {
        courses: [
          ['Embers & butter', 'Hearth-baked sourdough, cultured butter, smoked salt'],
          ['Smoked oyster', 'Cherry smoke, pickled shallot, sea buckthorn'],
          ['Beetroot from the ashes', 'Baked 6 hours in embers, goat curd, rye crumb'],
          ['Char-kissed sea bass', 'Oak coals, charred leek, brown-butter beurre blanc'],
          ['Fire-roasted mushrooms', 'Forest mushrooms, egg yolk, burnt onion broth'],
          ['Ember-aged ribeye', 'Birch embers, smoked marrow jus, potato in hay'],
          ['Cheese from the cellar', 'Three farm cheeses, fermented honey'],
          ['Burnt chocolate', 'Dying-oven bake, smoked salt, hay ice cream'],
          ['Last ember', 'Petit fours, birch-sap tea'],
        ],
        price: '$145', per: 'per guest · 9 courses · around 3 hours',
        pairings: [['Wine pairing', '$85'], ['Non-alcoholic pairing', '$45'], ['Counter seat with the chef', '+ $20']],
        cta: 'Book the tasting',
      },
      carte: [
        ['Starters', [['Hearth bread & butter', 'Sourdough, cultured butter, smoked salt', '$9'], ['Smoked oysters, 3 pcs', 'Cherry smoke, sea buckthorn', '$21'], ['Ash-baked beetroot', 'Goat curd, rye crumb', '$16'], ['Beef tartare on embers', 'Seared bone marrow, pickled mustard seed', '$22']]],
        ['From the fire', [['Ember-aged ribeye, 350 g', '45-day dry age, smoked marrow jus', '$68'], ['Whole sea bass', 'Charred leek, brown-butter beurre blanc', '$46'], ['Half chicken on oak', 'Garlic confit, grilled lemon', '$34'], ['Fire-roasted cauliflower', 'Tahini, brown butter, hazelnut', '$24']]],
        ['Sweet', [['Burnt chocolate', 'Smoked salt, hay ice cream', '$15'], ['Grilled stone fruit', 'Honey, sour cream, thyme', '$13']]],
      ],
      bar: [
        ['By the glass', [['Orange, Georgia', 'Rkatsiteli, amber, 6 months in qvevri', '$16'], ['Pinot Noir, Burgundy', 'Light, red fruit, a hint of smoke', '$19'], ['Champagne, Brut Nature', 'Grower champagne, zero dosage', '$24']]],
        ['Signature cocktails', [['Smoked Old Fashioned', 'Rye, cherry-wood smoke, bitters', '$17'], ['Birch & Pine', 'Gin, birch sap, pine syrup, tonic', '$15'], ['Ember Negroni', 'Fire-roasted orange, vermouth, bitter', '$16']]],
        ['Zero proof', [['Smoked lemonade', 'Grilled lemon, honey, rosemary', '$8'], ['Fermented sea buckthorn', 'House kombucha', '$9']]],
      ],
    },
    ru: {
      tasting: {
        courses: [
          ['Угли и масло', 'Хлеб на закваске из печи, культивированное масло, копчёная соль'],
          ['Копчёная устрица', 'Вишнёвый дым, маринованный шалот, облепиха'],
          ['Свёкла из золы', '6 часов в углях, козий творог, ржаная крошка'],
          ['Сибас с огня', 'Дубовые угли, обожжённый порей, бёр-блан'],
          ['Грибы на огне', 'Лесные грибы, желток, бульон из жжёного лука'],
          ['Рибай на углях', 'Берёзовые угли, жюс с костным мозгом, картофель в сене'],
          ['Сыры из погреба', 'Три фермерских сыра, ферментированный мёд'],
          ['Жжёный шоколад', 'Остывающая печь, копчёная соль, мороженое из сена'],
          ['Последний уголёк', 'Пти-фур, чай на берёзовом соке'],
        ],
        price: '12 500 ₽', per: 'на гостя · 9 подач · около 3 часов',
        pairings: [['Винное сопровождение', '7 500 ₽'], ['Безалкогольное сопровождение', '3 900 ₽'], ['Место у стойки с шефом', '+ 1 500 ₽']],
        cta: 'Забронировать дегустацию',
      },
      carte: [
        ['Закуски', [['Хлеб из печи и масло', 'Закваска, культивированное масло, копчёная соль', '790 ₽'], ['Копчёные устрицы, 3 шт.', 'Вишнёвый дым, облепиха', '1 900 ₽'], ['Свёкла из золы', 'Козий творог, ржаная крошка', '1 300 ₽'], ['Тартар на углях', 'Костный мозг, маринованная горчица', '1 850 ₽']]],
        ['С огня', [['Рибай на углях, 350 г', '45 дней сухой выдержки, копчёный жюс', '5 900 ₽'], ['Сибас целиком', 'Обожжённый порей, бёр-блан', '3 900 ₽'], ['Полцыплёнка на дубе', 'Конфи из чеснока, лимон-гриль', '2 700 ₽'], ['Цветная капуста с огня', 'Тахини, коричневое масло, фундук', '1 900 ₽']]],
        ['Десерты', [['Жжёный шоколад', 'Копчёная соль, мороженое из сена', '1 200 ₽'], ['Косточковые на гриле', 'Мёд, сметана, тимьян', '1 050 ₽']]],
      ],
      bar: [
        ['Вино по бокалам', [['Оранжевое, Грузия', 'Ркацители, 6 месяцев в квеври', '1 300 ₽'], ['Пино нуар, Бургундия', 'Лёгкое, красные ягоды, нотка дыма', '1 600 ₽'], ['Шампанское Brut Nature', 'Фермерское, без дозажа', '2 100 ₽']]],
        ['Авторские коктейли', [['Копчёный Олд Фэшн', 'Рай, дым вишни, биттеры', '1 400 ₽'], ['Берёза и сосна', 'Джин, берёзовый сок, сосновый сироп, тоник', '1 250 ₽'], ['Негрони с углей', 'Печёный апельсин, вермут, биттер', '1 350 ₽']]],
        ['Без алкоголя', [['Копчёный лимонад', 'Лимон-гриль, мёд, розмарин', '650 ₽'], ['Облепиховый ферментат', 'Домашняя комбуча', '700 ₽']]],
      ],
    },
  };

  function plural(n, forms) {
    const a = Math.abs(n) % 100, b = a % 10;
    if (a > 10 && a < 20) return forms[2];
    if (b > 1 && b < 5) return forms[1];
    if (b === 1) return forms[0];
    return forms[2];
  }
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ── Язык ────────────────────────────────────────────────
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* приватный режим — просто не запоминаем */ } },
  };
  let lang = store.get('ognivo-lang') || ((navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'en');
  let tab = 'tasting';

  function applyLang(next) {
    lang = T[next] ? next : 'en';
    document.documentElement.lang = lang;
    const dict = T[lang];
    $$('[data-i18n]').forEach((el) => { const v = dict[el.dataset.i18n]; if (typeof v === 'string') el.textContent = v; });
    $$('[data-i18n-html]').forEach((el) => { const v = dict[el.dataset.i18nHtml]; if (typeof v === 'string') el.innerHTML = v; });
    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    document.title = lang === 'ru' ? 'OGNIVO — кухня на живом огне' : 'OGNIVO — Wood-Fired Kitchen';
    renderMenu(false);
    store.set('ognivo-lang', lang);
  }

  // ── Меню ────────────────────────────────────────────────
  const panel = $('.menu__panel');
  function renderMenu(animate = true) {
    const m = MENU[lang];
    let html = '';
    if (tab === 'tasting') {
      const t = m.tasting;
      html = `<div class="menu__tasting">
        <ol class="menu__courses">${t.courses.map(([n, d]) => `<li><div><strong>${esc(n)}</strong><span>${esc(d)}</span></div></li>`).join('')}</ol>
        <aside class="menu__price-card"><div class="big">${esc(t.price)}</div><p>${esc(t.per)}</p>
          <ul>${t.pairings.map(([n, p]) => `<li><span>${esc(n)}</span><span>${esc(p)}</span></li>`).join('')}</ul>
          <a class="btn btn--full" href="#reserve">${esc(t.cta)}</a></aside></div>`;
    } else {
      html = m[tab].map(([group, items]) => `<h3 class="menu__group">${esc(group)}</h3>` + items.map(([n, d, p]) =>
        `<div class="menu__item"><h4>${esc(n)}</h4><span class="menu__dots"></span><span class="menu__price">${esc(p)}</span><p>${esc(d)}</p></div>`).join('')).join('');
    }
    // Держим высоту, пока меняется содержимое: иначе страница «прыгает» при смене вкладки
    const y = window.scrollY;
    panel.style.minHeight = panel.offsetHeight + 'px';
    panel.innerHTML = html;
    window.scrollTo(0, y);
    requestAnimationFrame(() => { panel.style.minHeight = ''; });
    if (animate && !reduceMotion) { panel.classList.remove('is-switching'); void panel.offsetWidth; panel.classList.add('is-switching'); }
  }
  $$('.tabs [role="tab"]').forEach((b) => b.addEventListener('click', () => {
    tab = b.dataset.tab;
    $$('.tabs [role="tab"]').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    renderMenu(true);
  }));

  $$('.lang button').forEach((b) => b.addEventListener('click', () => applyLang(b.dataset.lang)));
  applyLang(lang);

  // ── Прелоадер ───────────────────────────────────────────
  const heroImg = $('.hero__media img');
  const finishLoading = () => document.body.classList.add('is-loaded');
  document.body.classList.add('is-loading');
  const done = () => { document.body.classList.remove('is-loading'); setTimeout(finishLoading, 150); };
  if (heroImg.complete) setTimeout(done, 500);
  else { heroImg.addEventListener('load', () => setTimeout(done, 300), { once: true }); heroImg.addEventListener('error', done, { once: true }); }
  setTimeout(done, 3500); // медленная сеть — не держим пользователя за прелоадером

  // ── Навигация, прогресс, активный пункт ─────────────────
  const nav = $('.nav');
  const progress = $('.progress');
  const sections = $$('main section[id]');
  const links = $$('.nav__links a');
  const reserveBg = $('.reserve__bg img');
  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    let current = null;
    for (const s of sections) if (s.getBoundingClientRect().top < innerHeight * 0.4) current = s.id;
    links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + current));
    if (reserveBg && !reduceMotion) {
      const r = reserveBg.parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) reserveBg.style.transform = `translateY(${(r.top / innerHeight) * -12}%)`;
    }
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // ── Мобильное меню ──────────────────────────────────────
  const burger = $('.burger');
  const mobile = $('.mobile-menu');
  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    mobile.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('.mobile-menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // ── Появление при скролле и счётчики ───────────────────
  const countUp = (el) => {
    const to = Number(el.dataset.to);
    if (reduceMotion) { el.textContent = to; return; }
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / 1600);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target;
      // Соседние элементы появляются лесенкой
      const siblings = el.parentElement ? $$(':scope > .reveal', el.parentElement) : [];
      el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 90}ms`;
      el.classList.add('is-in');
      $$('.count', el).forEach(countUp);
      io.unobserve(el);
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el) => io.observe(el));

  // ── Искры над очагом ───────────────────────────────────
  const canvas = $('.hero__sparks');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = 1, sparks = [], running = true;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(90, w / 14));
      sparks = Array.from({ length: n }, () => spawn(true));
    };
    const spawn = (anywhere) => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 10,
      r: Math.random() * 1.8 + 0.4,
      vy: Math.random() * 0.9 + 0.35,
      vx: (Math.random() - 0.5) * 0.3,
      wobble: Math.random() * Math.PI * 2,
      life: Math.random() * 0.6 + 0.4,
      hue: 18 + Math.random() * 22,
    });
    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        s.wobble += 0.03;
        s.x += s.vx + Math.sin(s.wobble) * 0.35;
        s.y -= s.vy;
        const fade = Math.max(0, Math.min(1, s.y / h)) * s.life;
        if (s.y < -10 || fade <= 0.01) { sparks[i] = spawn(false); continue; }
        const flick = 0.6 + Math.random() * 0.4;
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 6);
        g.addColorStop(0, `hsla(${s.hue}, 100%, 70%, ${fade * flick})`);
        g.addColorStop(1, `hsla(${s.hue}, 100%, 50%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 6, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(tick);
    };
    resize();
    window.addEventListener('resize', resize);
    // Hero за пределами экрана — не тратим батарею на анимацию
    new IntersectionObserver(([e]) => { const was = running; running = e.isIntersecting; if (running && !was) requestAnimationFrame(tick); }).observe(canvas);
    requestAnimationFrame(tick);
  }

  // ── Курсор-ореол (только мышь) ──────────────────────────
  const cursor = $('.cursor');
  if (cursor && window.matchMedia('(hover: hover)').matches && !reduceMotion) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; cursor.classList.add('is-on'); }, { passive: true });
    document.addEventListener('mouseleave', () => cursor.classList.remove('is-on'));
    const follow = () => { cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18; cursor.style.transform = `translate(${cx}px, ${cy}px)`; requestAnimationFrame(follow); };
    follow();
    document.addEventListener('mouseover', (e) => cursor.classList.toggle('is-hover', !!e.target.closest('a, button, .dish, .g')));
  }

  // ── Отзывы ──────────────────────────────────────────────
  const reviews = $$('.review');
  const dots = $('.reviews__dots');
  let ri = 0, rTimer;
  reviews.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-label', String(i + 1));
    b.addEventListener('click', () => { showReview(i); restart(); });
    dots.appendChild(b);
  });
  function showReview(i) {
    ri = (i + reviews.length) % reviews.length;
    reviews.forEach((r, k) => r.classList.toggle('is-active', k === ri));
    $$('button', dots).forEach((d, k) => d.setAttribute('aria-selected', String(k === ri)));
  }
  const restart = () => { clearInterval(rTimer); if (!reduceMotion) rTimer = setInterval(() => showReview(ri + 1), 6500); };
  showReview(0); restart();

  // ── Бронь ───────────────────────────────────────────────
  const form = $('.form');
  const success = $('.form__success');
  const err = $('.form__error');
  const dateInput = form.elements.date;
  const todayISO = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
  dateInput.min = todayISO();
  dateInput.value = todayISO();

  $$('.stepper button').forEach((b) => b.addEventListener('click', () => {
    const inp = form.elements.guests;
    inp.value = Math.max(1, Math.min(8, (Number(inp.value) || 1) + Number(b.dataset.step)));
  }));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    $$('.is-invalid', form).forEach((x) => x.classList.remove('is-invalid'));
    const fail = (name, key) => { form.elements[name].classList.add('is-invalid'); form.elements[name].focus(); err.textContent = T[lang][key]; };
    if (!d.date || d.date < todayISO()) return fail('date', 'res.errDate');
    if (!d.name || d.name.trim().length < 2) return fail('name', 'res.errName');
    if (!/^[0-9+()\-\s]{7,}$/.test(d.phone || '') || (d.phone.match(/\d/g) || []).length < 7) return fail('phone', 'res.errPhone');
    err.textContent = '';
    const date = new Date(d.date + 'T12:00:00').toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    $('.form__summary').textContent = T[lang]['res.summary']({ ...d, name: d.name.trim(), guests: Number(d.guests), date });
    form.hidden = true;
    success.hidden = false;
  });
  $('[data-reset]').addEventListener('click', () => { form.reset(); dateInput.value = todayISO(); success.hidden = true; form.hidden = false; });
})();
