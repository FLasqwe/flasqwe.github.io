// MONOLIT — язык EN/RU, услуги, портфолио с фильтрами, смета, этапы, заявка.
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const img = (id, w, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? '&h=' + h : ''}&q=78`;

  // ── Тексты интерфейса ──────────────────────────────────
  const T = {
    en: {
      'nav.services': 'Services', 'nav.projects': 'Projects', 'nav.process': 'Process', 'nav.estimate': 'Estimate', 'nav.contact': 'Contact', 'nav.cta': 'Get an estimate',
      'hero.tag': 'Design · Build · Turnkey since 2007', 'hero.t1': 'We build', 'hero.t2': 'what lasts',
      'hero.lead': 'Private houses, commercial buildings and turnkey interiors — with a fixed price in the contract, live cameras on site and a 5-year warranty on everything we build.',
      'hero.cta1': 'Calculate your project', 'hero.cta2': 'See our projects',
      'hero.s1': 'years on the market', 'hero.s2': 'objects delivered', 'hero.s3': 'handed over on schedule', 'hero.live': '12 sites under construction now',
      ticker: 'Residential ■ Commercial ■ Turnkey interiors ■ Renovation ■ Design & build ■ Engineering ■ Residential ■ Commercial ■ Turnkey interiors ■ Renovation ■ Design & build ■ Engineering ■',
      'intro.text': "We don't sell square metres. We take responsibility for <mark>the whole result</mark> — from soil survey to the key in your hand — and put <mark>the price and deadline in the contract</mark>.",
      'intro.f1': 'Own team, no subcontractor chains', 'intro.f1d': '180 specialists on staff: engineers, foremen, finishers. One contract, one responsible party.',
      'intro.f2': 'Fixed price, fixed deadline', 'intro.f2d': "The estimate is locked in the contract. Every day of delay is compensated — it's written in clause 7.3.",
      'intro.f3': 'You see the site 24/7', 'intro.f3d': 'Online cameras, a weekly photo report and a personal dashboard with every payment and document.',
      'svc.tag': 'What we do', 'svc.title': 'Services',
      'proj.tag': 'Portfolio', 'proj.title': 'Selected projects',
      'proc.tag': 'How it works', 'proc.title': 'From idea to keys in 5 steps',
      'est.tag': 'Estimate', 'est.title': 'Cost & timeline in one minute', 'est.lead': 'A realistic range based on our last 40 projects. An engineer will refine it for free after a site visit.',
      'est.type': 'Object type', 'est.area': 'Area', 'est.floors': 'Floors', 'est.level': 'Finish level', 'est.total': 'Estimated cost', 'est.time': 'Timeline', 'est.cta': 'Get a detailed estimate',
      'est.perM': (v) => `≈ ${v} per m²`, 'est.months': (a, b) => `${a}–${b} months`,
      'why.big': 'years<br>warranty',
      'quote.text': '“We moved in exactly on the date written in the contract. During the whole year I opened the camera app more often than Instagram — and never once had to call to find out what was going on.”',
      'quote.name': 'Andrey Morozov', 'quote.role': 'House in Pine Hills, 320 m²',
      'ct.tag': 'Contact', 'ct.title': "Let's discuss<br><span class=\"yellow\">your project</span>", 'ct.lead': 'Send drawings or just describe the idea. An engineer will call you back within 2 working hours.',
      'ct.phone': 'Phone', 'ct.office': 'Office', 'ct.addr': 'Moscow, 5 Stroiteley Ave., Business Centre “Kvadrat”', 'ct.hoursT': 'Hours', 'ct.hours': 'Mon–Fri 9:00–19:00',
      'ct.name': 'Name', 'ct.contact': 'Phone or email', 'ct.type': 'Project type', 'ct.budget': 'Budget', 'ct.msg': 'Tell us about the project (optional)',
      'ct.file': 'Attach drawings or photos (PDF, DWG, JPG)', 'ct.files': (n) => `${n} file${n > 1 ? 's' : ''} attached`,
      'ct.consent': 'I agree to the processing of personal data', 'ct.submit': 'Send request', 'ct.okTitle': 'Request received', 'ct.again': 'Send another request',
      'ct.errName': 'Please enter your name.', 'ct.errContact': 'Please enter a phone number or email.', 'ct.errConsent': 'Please confirm the consent to continue.',
      'ct.ok': (d) => `${d.name}, thank you! An engineer will contact you at ${d.contact} within 2 working hours to discuss “${d.type}”. (Demo — nothing was sent.)`,
      'modal.prev': '← Previous', 'modal.next': 'Next →',
      'spec.area': 'Area', 'spec.year': 'Completed', 'spec.term': 'Construction', 'spec.loc': 'Location',
      'foot.copy': '© MONOLIT. Construction & design-build.', 'foot.sro': 'SRO membership № 0000-00 (demo)', 'foot.concept': 'Concept website · portfolio project',
      all: 'All',
    },
    ru: {
      'nav.services': 'Услуги', 'nav.projects': 'Проекты', 'nav.process': 'Этапы', 'nav.estimate': 'Смета', 'nav.contact': 'Контакты', 'nav.cta': 'Рассчитать смету',
      'hero.tag': 'Проектирование · строительство · под ключ с 2007', 'hero.t1': 'Строим', 'hero.t2': 'на века',
      'hero.lead': 'Частные дома, коммерческие здания и интерьеры под ключ — с фиксированной ценой в договоре, онлайн-камерами на объекте и гарантией 5 лет на всё, что мы строим.',
      'hero.cta1': 'Рассчитать проект', 'hero.cta2': 'Смотреть проекты',
      'hero.s1': 'лет на рынке', 'hero.s2': 'сданных объектов', 'hero.s3': 'объектов сданы в срок', 'hero.live': 'Сейчас строим 12 объектов',
      ticker: 'Частные дома ■ Коммерческие здания ■ Интерьеры под ключ ■ Реконструкция ■ Проектирование ■ Инженерия ■ Частные дома ■ Коммерческие здания ■ Интерьеры под ключ ■ Реконструкция ■ Проектирование ■ Инженерия ■',
      'intro.text': 'Мы не продаём квадратные метры. Мы отвечаем за <mark>весь результат</mark> — от геологии участка до ключей в вашей руке — и прописываем <mark>цену и срок в договоре</mark>.',
      'intro.f1': 'Своя команда, без цепочек субподряда', 'intro.f1d': '180 специалистов в штате: инженеры, прорабы, отделочники. Один договор — один ответственный.',
      'intro.f2': 'Фиксированная цена и срок', 'intro.f2d': 'Смета закреплена в договоре. Каждый день просрочки компенсируем — это пункт 7.3.',
      'intro.f3': 'Объект виден 24/7', 'intro.f3d': 'Онлайн-камеры, еженедельный фотоотчёт и личный кабинет со всеми платежами и документами.',
      'svc.tag': 'Что мы делаем', 'svc.title': 'Услуги',
      'proj.tag': 'Портфолио', 'proj.title': 'Избранные проекты',
      'proc.tag': 'Как мы работаем', 'proc.title': 'От идеи до ключей — 5 шагов',
      'est.tag': 'Смета', 'est.title': 'Стоимость и срок за минуту', 'est.lead': 'Реальный диапазон по нашим последним 40 объектам. Инженер бесплатно уточнит его после выезда на участок.',
      'est.type': 'Тип объекта', 'est.area': 'Площадь', 'est.floors': 'Этажей', 'est.level': 'Уровень отделки', 'est.total': 'Примерная стоимость', 'est.time': 'Срок', 'est.cta': 'Получить подробную смету',
      'est.perM': (v) => `≈ ${v} за м²`, 'est.months': (a, b) => `${a}–${b} мес.`,
      'why.big': 'лет<br>гарантии',
      'quote.text': '«Мы въехали ровно в дату из договора. Весь год я открывал приложение с камерами чаще, чем Instagram, — и ни разу не пришлось звонить, чтобы узнать, что происходит».',
      'quote.name': 'Андрей Морозов', 'quote.role': 'Дом в «Сосновых холмах», 320 м²',
      'ct.tag': 'Контакты', 'ct.title': 'Обсудим<br><span class="yellow">ваш проект</span>', 'ct.lead': 'Пришлите чертежи или просто опишите идею. Инженер перезвонит в течение 2 рабочих часов.',
      'ct.phone': 'Телефон', 'ct.office': 'Офис', 'ct.addr': 'Москва, пр-т Строителей, 5, БЦ «Квадрат»', 'ct.hoursT': 'Часы', 'ct.hours': 'Пн–Пт 9:00–19:00',
      'ct.name': 'Имя', 'ct.contact': 'Телефон или email', 'ct.type': 'Тип проекта', 'ct.budget': 'Бюджет', 'ct.msg': 'Расскажите о проекте (необязательно)',
      'ct.file': 'Прикрепить чертежи или фото (PDF, DWG, JPG)', 'ct.files': (n) => `Прикреплено файлов: ${n}`,
      'ct.consent': 'Согласен на обработку персональных данных', 'ct.submit': 'Отправить заявку', 'ct.okTitle': 'Заявка принята', 'ct.again': 'Отправить ещё одну',
      'ct.errName': 'Укажите имя.', 'ct.errContact': 'Укажите телефон или email.', 'ct.errConsent': 'Подтвердите согласие, чтобы продолжить.',
      'ct.ok': (d) => `${d.name}, спасибо! Инженер свяжется с вами (${d.contact}) в течение 2 рабочих часов, чтобы обсудить «${d.type}». (Демо — заявка никуда не отправлена.)`,
      'modal.prev': '← Назад', 'modal.next': 'Далее →',
      'spec.area': 'Площадь', 'spec.year': 'Сдан', 'spec.term': 'Срок стройки', 'spec.loc': 'Локация',
      'foot.copy': '© MONOLIT. Строительство и проектирование.', 'foot.sro': 'Член СРО № 0000-00 (демо)', 'foot.concept': 'Концепт-сайт · проект для портфолио',
      all: 'Все',
    },
  };

  // ── Данные ─────────────────────────────────────────────
  const SERVICES = [
    { img: '1721815693498-cc28507c0ba2', en: ['Private houses', 'Monolithic, brick and timber-frame houses from 120 m² — with design, engineering and landscaping.'], ru: ['Частные дома', 'Монолит, кирпич и каркас от 120 м² — с проектом, инженерией и благоустройством.'] },
    { img: '1621831337128-35676ca30868', en: ['Commercial buildings', 'Offices, retail and warehouses. General contracting with a single schedule and budget.'], ru: ['Коммерческие здания', 'Офисы, ритейл, склады. Генподряд с единым графиком и бюджетом.'] },
    { img: '1724582586529-62622e50c0b3', en: ['Turnkey interiors', 'From a bare concrete box to a home you can move into — with furniture and lighting.'], ru: ['Интерьеры под ключ', 'От бетонной коробки до дома, в который можно въехать, — с мебелью и светом.'] },
    { img: '1608303588026-884930af2559', en: ['Architecture & design', 'Concept, working drawings and permits. You see the house in 3D before the first brick.'], ru: ['Архитектура и проект', 'Концепция, рабочая документация, согласования. Дом в 3D — до первого кирпича.'] },
    { img: '1587582423116-ec07293f0395', en: ['Reconstruction', 'Extensions, new floors and structural reinforcement of existing buildings.'], ru: ['Реконструкция', 'Пристройки, надстройка этажей и усиление конструкций существующих зданий.'] },
  ];

  const CATS = { house: { en: 'Houses', ru: 'Дома' }, commercial: { en: 'Commercial', ru: 'Коммерция' }, interior: { en: 'Interiors', ru: 'Интерьеры' } };
  const PROJECTS = [
    { cat: 'house', img: '1750271329214-a7dbce880e85', area: 420, year: 2025, term: 14, en: ['Villa Aurora', 'Pine Hills, Moscow region', 'A two-level monolithic villa with a 16-metre pool, panoramic glazing and a green roof. Built while the family lived abroad — controlled entirely through cameras and weekly reports.'], ru: ['Вилла «Аврора»', 'Сосновые холмы, Подмосковье', 'Двухуровневая монолитная вилла с 16-метровым бассейном, панорамным остеклением и зелёной кровлей. Строили, пока семья жила за границей, — весь контроль через камеры и еженедельные отчёты.'] },
    { cat: 'commercial', img: '1709497197725-2e97c76b31d0', area: 6800, year: 2024, term: 22, en: ['Quadrat Business Centre', 'Moscow', 'A seven-storey class B+ office building with an underground car park. Handed over two weeks ahead of schedule.'], ru: ['БЦ «Квадрат»', 'Москва', 'Семиэтажный офисный центр класса B+ с подземным паркингом. Сдан на две недели раньше срока.'] },
    { cat: 'house', img: '1698994705178-d244d73ea573', area: 310, year: 2024, term: 11, en: ['House on the Slope', 'Istra', 'A cantilevered house on a 12° slope: piled foundation, timber and glass, all rooms facing the forest.'], ru: ['Дом на склоне', 'Истра', 'Консольный дом на склоне 12°: свайный фундамент, дерево и стекло, все комнаты смотрят на лес.'] },
    { cat: 'interior', img: '1724582586495-d050726cf354', area: 145, year: 2025, term: 5, en: ['Apartment “Graphite”', 'Moscow, Khamovniki', 'A turnkey interior in a new building: hidden doors, built-in furniture, smart lighting.'], ru: ['Квартира «Графит»', 'Москва, Хамовники', 'Интерьер под ключ в новостройке: скрытые двери, встроенная мебель, умный свет.'] },
    { cat: 'house', img: '1628012209120-d9db7abf7eab', area: 260, year: 2023, term: 9, en: ['White Cube', 'Zvenigorod', 'A minimalist monolithic house with flat roofs and a courtyard. Facade — architectural concrete.'], ru: ['Белый куб', 'Звенигород', 'Минималистичный монолитный дом с плоскими кровлями и внутренним двором. Фасад — архитектурный бетон.'] },
    { cat: 'commercial', img: '1583338850703-bc602b103674', area: 9200, year: 2023, term: 26, en: ['Residential complex “Terrace”', 'Kazan', 'A 12-storey residential building with stepped terraces — general contracting from the pit to landscaping.'], ru: ['ЖК «Терраса»', 'Казань', '12-этажный жилой дом со ступенчатыми террасами — генподряд от котлована до благоустройства.'] },
    { cat: 'interior', img: '1724582586529-62622e50c0b3', area: 210, year: 2024, term: 6, en: ['Penthouse “Horizon”', 'Moscow City', 'A penthouse with 5-metre ceilings: steel staircase, natural stone, floor-to-ceiling windows.'], ru: ['Пентхаус «Горизонт»', 'Москва-Сити', 'Пентхаус с 5-метровыми потолками: стальная лестница, натуральный камень, окна в пол.'] },
    { cat: 'house', img: '1635006459494-c9b9665a666e', area: 190, year: 2025, term: 8, en: ['Forest Lodge', 'Ruza', 'A compact house for a family of four: timber frame, energy-efficient envelope, heat pump.'], ru: ['Лесной дом', 'Руза', 'Компактный дом для семьи из четырёх: каркас, энергоэффективный контур, тепловой насос.'] },
  ];

  const STEPS = {
    en: [['Brief & site visit', 'We study the site, soil and your wishes. Free.', '1–2 weeks'], ['Design', 'Architecture, structure, engineering — and a 3D tour.', '4–8 weeks'], ['Contract & estimate', 'Fixed price, schedule and penalties for delay.', '1 week'], ['Construction', 'Weekly reports, cameras, technical supervision.', '4–14 months'], ['Handover & warranty', 'Keys, documents and 5-year service.', '1 day']],
    ru: [['Бриф и выезд', 'Изучаем участок, грунт и ваши пожелания. Бесплатно.', '1–2 недели'], ['Проектирование', 'Архитектура, конструктив, инженерия — и 3D-тур.', '4–8 недель'], ['Договор и смета', 'Фиксированная цена, график и штрафы за просрочку.', '1 неделя'], ['Строительство', 'Еженедельные отчёты, камеры, технадзор.', '4–14 месяцев'], ['Сдача и гарантия', 'Ключи, документы и 5 лет сервиса.', '1 день']],
  };

  const WHY_ICONS = [
    '<rect x="6" y="4" width="28" height="32"/><path d="M12 12h16M12 18h16M12 24h10"/><path d="m24 30 3 3 6-6"/>',
    '<rect x="4" y="10" width="24" height="18"/><path d="m28 16 8-5v16l-8-5"/><circle cx="12" cy="19" r="2"/>',
    '<circle cx="20" cy="20" r="15"/><path d="M20 10v10l7 4"/>',
    '<path d="M20 4 34 10v10c0 8-6 14-14 16C12 34 6 28 6 20V10z"/><path d="m14 20 4 4 8-8"/>',
  ];
  const WHY = {
    en: [['Fixed estimate', 'The price in the contract does not change — materials risk is ours.'], ['Live cameras', '24/7 access from your phone, plus a weekly photo and video report.'], ['Deadline in the contract', '96% of objects handed over on time. Penalty for every day of delay.'], ['Technical supervision', 'An independent engineer checks every hidden work stage.']],
    ru: [['Фиксированная смета', 'Цена в договоре не меняется — риск подорожания материалов на нас.'], ['Онлайн-камеры', 'Доступ 24/7 с телефона и еженедельный фото- и видеоотчёт.'], ['Срок в договоре', '96% объектов сданы вовремя. Неустойка за каждый день просрочки.'], ['Технадзор', 'Независимый инженер принимает каждый этап скрытых работ.']],
  };

  // Смета: цена за м² по типу объекта и уровню отделки, в каждой валюте
  const TYPES = [
    { id: 'house', en: ['House', 'private, cottage'], ru: ['Дом', 'частный, коттедж'] },
    { id: 'town', en: ['Townhouse', 'block or duplex'], ru: ['Таунхаус', 'блокированный, дуплекс'] },
    { id: 'commercial', en: ['Commercial', 'office, retail'], ru: ['Коммерция', 'офис, ритейл'] },
    { id: 'reno', en: ['Renovation', 'existing building'], ru: ['Ремонт', 'существующее здание'] },
  ];
  const LEVELS = [
    { id: 'shell', en: ['Shell', 'frame, roof, windows'], ru: ['Коробка', 'каркас, кровля, окна'] },
    { id: 'white', en: ['White box', 'ready for finishing'], ru: ['White box', 'под чистовую'] },
    { id: 'turnkey', en: ['Turnkey', 'move in and live'], ru: ['Под ключ', 'заехать и жить'] },
  ];
  const PRICE = {
    usd: { house: [420, 640, 980], town: [380, 590, 900], commercial: [520, 760, 1150], reno: [120, 260, 480] },
    rub: { house: [34000, 52000, 80000], town: [31000, 48000, 74000], commercial: [42000, 62000, 95000], reno: [10000, 21000, 39000] },
  };
  // Доли этапов в стоимости (сумма = 100)
  const SHARES = {
    build: { shell: [22, 40, 18, 14, 6], white: [17, 31, 14, 22, 16], turnkey: [12, 22, 10, 21, 35] },
    reno: { shell: [0, 40, 0, 45, 15], white: [0, 28, 0, 40, 32], turnkey: [0, 18, 0, 32, 50] },
  };
  const BAR_NAMES = { en: ['Foundation', 'Walls & frame', 'Roof', 'Engineering', 'Finishing'], ru: ['Фундамент', 'Стены и каркас', 'Кровля', 'Инженерия', 'Отделка'] };
  const BUDGETS = { en: ['Up to $150k', '$150–400k', '$400k–1M', 'Over $1M'], ru: ['До 15 млн ₽', '15–40 млн ₽', '40–100 млн ₽', 'Более 100 млн ₽'] };

  // ── Язык ───────────────────────────────────────────────
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* приватный режим */ } },
  };
  let lang = store.get('monolit-lang') || ((navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'en');
  const t = (k) => T[lang][k];
  const nf = (n) => new Intl.NumberFormat(lang === 'ru' ? 'ru-RU' : 'en-US').format(n);
  const money = (n) => {
    if (lang === 'ru') return n >= 1e6 ? `${(n / 1e6).toFixed(1).replace('.', ',').replace(',0', '')} млн ₽` : `${nf(Math.round(n / 1000) * 1000)} ₽`;
    return n >= 1e6 ? `$${(n / 1e6).toFixed(2).replace(/\.?0+$/, '')}M` : `$${nf(Math.round(n / 1000))}k`;
  };

  // «11,5–13,5 млн ₽» / «$141–166k» — единица один раз, если у обеих границ она общая
  function moneyRange(lo, hi) {
    const a = money(lo), b = money(hi);
    const unit = (x) => x.replace(/^\$?[\d\s.,\u00a0]+/, '');
    if (unit(a) !== unit(b)) return `${a} – ${b}`;
    return lang === 'ru' ? `${a.slice(0, -unit(a).length).trim()}–${b}` : `${a.slice(0, -unit(a).length || undefined)}–${b.replace('$', '')}`;
  }

  function applyLang(next) {
    lang = T[next] ? next : 'en';
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach((el) => { const v = t(el.dataset.i18n); if (typeof v === 'string') el.textContent = v; });
    $$('[data-i18n-html]').forEach((el) => { const v = t(el.dataset.i18nHtml); if (typeof v === 'string') el.innerHTML = v; });
    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    document.title = lang === 'ru' ? 'MONOLIT — строительство и проектирование' : 'MONOLIT — Construction & Design-Build';
    renderAll();
    store.set('monolit-lang', lang);
  }

  // ── Отрисовка ──────────────────────────────────────────
  const arrowSvg = '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  let filter = 'all';
  // Рисуем только подходящие под фильтр проекты: раскладка «крупная + средняя»
  // считается через :nth-child и сбивалась бы из-за скрытых карточек
  function renderProjects(immediate = false) {
    $('[data-render="projects"]').innerHTML = PROJECTS.map((p, i) => ({ p, i })).filter(({ p }) => filter === 'all' || p.cat === filter).map(({ p, i }) => {
      const [name, loc] = p[lang];
      return `<article class="proj reveal" data-i="${i}" role="button" tabindex="0" aria-label="${esc(name)}">
        <div class="proj__img"><img loading="lazy" src="${img(p.img, 1100, 800)}" alt=""></div>
        <span class="proj__open" aria-hidden="true">+</span>
        <div class="proj__body"><span class="proj__cat">${esc(CATS[p.cat][lang])}</span><h3>${esc(name)}</h3>
        <div class="proj__meta"><span>${esc(loc)}</span><span>${nf(p.area)} m²</span><span>${p.year}</span></div></div></article>`;
    }).join('');
    if (!immediate) { observeReveals(); return; }
    // После смены фильтра секция уже на экране — показываем карточки сразу, лесенкой
    requestAnimationFrame(() => $$('.proj').forEach((c, k) => { c.style.transitionDelay = `${k * 70}ms`; c.classList.add('is-in'); }));
  }
  function renderAll() {
    $('[data-render="services"]').innerHTML = SERVICES.map((s, i) => {
      const [h, p] = s[lang];
      return `<li class="svc reveal" data-img="${img(s.img, 700, 490)}"><span class="svc__no">0${i + 1}</span><h3>${esc(h)}</h3><p>${esc(p)}</p><span class="svc__arrow">${arrowSvg}</span><span class="svc__img"><img loading="lazy" src="${img(s.img, 900, 450)}" alt=""></span></li>`;
    }).join('');

    $('[data-render="filters"]').innerHTML = [['all', t('all')], ...Object.entries(CATS).map(([k, v]) => [k, v[lang]])]
      .map(([k, label]) => `<button type="button" role="tab" aria-selected="${k === filter}" data-filter="${k}">${esc(label)}</button>`).join('');

    renderProjects();

    $('[data-render="steps"]').innerHTML = STEPS[lang].map(([h, p, d], i) => `<li class="step reveal" data-n="0${i + 1}"><h3>${esc(h)}</h3><p>${esc(p)}</p><small>${esc(d)}</small></li>`).join('');

    $('[data-render="why"]').innerHTML = WHY[lang].map(([h, p], i) => `<div class="why__item reveal"><svg viewBox="0 0 40 40" aria-hidden="true">${WHY_ICONS[i]}</svg><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('');

    const typeSel = $('[data-render="typeOptions"]');
    const prevType = typeSel.selectedIndex;
    typeSel.innerHTML = SERVICES.map((s) => `<option>${esc(s[lang][0])}</option>`).join('');
    if (prevType > 0) typeSel.selectedIndex = prevType;

    $('[data-render="budgets"]').innerHTML = BUDGETS[lang].map((b, i) => `<button type="button" role="radio" aria-checked="${i === budget}" data-budget="${i}">${esc(b)}</button>`).join('');

    renderEstimate();
    observeReveals();
  }

  // ── Смета ──────────────────────────────────────────────
  let type = 'house', level = 'white', floors = 2, budget = 1;
  const area = $('#area');
  function renderEstimate() {
    const seg = (list, cur, key) => list.map((x) => `<button type="button" role="radio" aria-checked="${x.id === cur}" data-${key}="${x.id}">${esc(x[lang][0])}<small>${esc(x[lang][1])}</small></button>`).join('');
    $('[data-render="types"]').innerHTML = seg(TYPES, type, 'type');
    $('[data-render="levels"]').innerHTML = seg(LEVELS, level, 'level');
    calc();
  }
  function calc() {
    const cur = lang === 'ru' ? 'rub' : 'usd';
    const a = +area.value;
    const li = LEVELS.findIndex((x) => x.id === level);
    // Одноэтажный дом дороже за м² (больше фундамента и кровли), трёхэтажный — сложнее каркас
    const floorK = type === 'reno' ? 1 : { 1: 1.06, 2: 1, 3: 1.04 }[floors];
    const total = PRICE[cur][type][li] * a * floorK;
    const lo = total * 0.92, hi = total * 1.08;
    $('#estTotal').textContent = moneyRange(lo, hi);
    $('#estPerM').textContent = t('est.perM')(cur === 'rub' ? `${nf(Math.round(total / a / 100) * 100)} ₽` : `$${nf(Math.round(total / a))}`);
    const typeK = { house: 1, town: 0.95, commercial: 1, reno: 0.45 }[type];
    // Срок растёт медленнее площади: на большом объекте бригады работают параллельно.
    // База 3 месяца — проект и согласования.
    const months = (3 + 0.9 * Math.sqrt(a / 10)) * [0.7, 1, 1.35][li] * typeK;
    $('#estTime').textContent = t('est.months')(Math.max(1, Math.round(months * 0.9)), Math.max(2, Math.round(months * 1.15)));
    $('#areaOut').textContent = `${nf(a)} m²`;
    area.style.setProperty('--fill', ((a - area.min) / (area.max - area.min)) * 100 + '%');
    $('#floors').textContent = floors;
    const shares = SHARES[type === 'reno' ? 'reno' : 'build'][level];
    $('[data-render="bars"]').innerHTML = shares.map((s, i) => s ? `<div class="bar"><div class="bar__head"><span>${esc(BAR_NAMES[lang][i])}</span><b>${money(total * s / 100)}</b></div><div class="bar__track"><div class="bar__fill" style="--w:0%" data-w="${s / Math.max(...shares) * 100}"></div></div></div>` : '').join('');
    requestAnimationFrame(() => $$('.bar__fill').forEach((b) => b.style.setProperty('--w', b.dataset.w + '%')));
    $('.stepper [data-floors="-1"]').disabled = floors <= 1 || type === 'reno';
    $('.stepper [data-floors="1"]').disabled = floors >= 3 || type === 'reno';
  }
  document.addEventListener('click', (e) => {
    const tb = e.target.closest('[data-type]'); if (tb) { type = tb.dataset.type; renderEstimate(); }
    const lb = e.target.closest('[data-level]'); if (lb) { level = lb.dataset.level; renderEstimate(); }
    const fb = e.target.closest('[data-floors]'); if (fb && !fb.disabled) { floors = Math.max(1, Math.min(3, floors + +fb.dataset.floors)); calc(); }
    const bb = e.target.closest('[data-budget]'); if (bb) { budget = +bb.dataset.budget; $$('[data-budget]').forEach((x) => x.setAttribute('aria-checked', String(x === bb))); }
    const flt = e.target.closest('[data-filter]');
    if (flt) {
      filter = flt.dataset.filter;
      $$('[data-filter]').forEach((x) => x.setAttribute('aria-selected', String(x === flt)));
      renderProjects(true);
    }
    const pr = e.target.closest('.proj'); if (pr) openModal(+pr.dataset.i);
  });
  area.addEventListener('input', calc);

  // ── Модальное окно проекта ─────────────────────────────
  const modal = $('.modal');
  let mi = 0, lastFocus = null;
  function visibleProjects() { return PROJECTS.map((p, i) => i).filter((i) => filter === 'all' || PROJECTS[i].cat === filter); }
  function fillModal() {
    const p = PROJECTS[mi];
    const [name, loc, desc] = p[lang];
    $('.modal__img img').src = img(p.img, 1400, 1100);
    $('.modal__img img').alt = name;
    $('.modal__cat').textContent = CATS[p.cat][lang];
    $('#mTitle').textContent = name;
    $('.modal__desc').textContent = desc;
    const months = lang === 'ru' ? `${p.term} мес.` : `${p.term} months`;
    $('.modal__specs').innerHTML = [['spec.area', `${nf(p.area)} m²`], ['spec.year', p.year], ['spec.term', months], ['spec.loc', loc]]
      .map(([k, v]) => `<div><dt>${esc(t(k))}</dt><dd>${esc(v)}</dd></div>`).join('');
  }
  function openModal(i) {
    mi = i; lastFocus = document.activeElement;
    fillModal();
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    $('.modal__close').focus();
  }
  function closeModal() { modal.hidden = true; document.body.classList.remove('no-scroll'); lastFocus?.focus(); }
  function stepModal(d) { const v = visibleProjects(); mi = v[(v.indexOf(mi) + d + v.length) % v.length]; fillModal(); }
  modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); const s = e.target.closest('[data-step]'); if (s) stepModal(+s.dataset.step); });
  document.addEventListener('keydown', (e) => {
    if (modal.hidden) {
      if (e.key === 'Escape') setMenu(false);
      const pr = e.target.closest && e.target.closest('.proj');
      if (pr && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openModal(+pr.dataset.i); }
      return;
    }
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') stepModal(1);
    if (e.key === 'ArrowLeft') stepModal(-1);
    // Фокус не уходит из открытого окна
    if (e.key === 'Tab') {
      const f = $$('button, a[href]', modal).filter((x) => !x.disabled && x.offsetParent);
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
      else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
    }
  });

  // ── Картинка за курсором над услугами ──────────────────
  const float = $('.svc-float');
  const floatImg = $('img', float);
  if (window.matchMedia('(hover: hover)').matches && !reduceMotion) {
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0;
    const loop = () => { cx += (x - cx) * 0.16; cy += (y - cy) * 0.16; float.style.left = cx + 'px'; float.style.top = cy + 'px'; raf = float.classList.contains('is-on') ? requestAnimationFrame(loop) : 0; };
    const list = $('[data-render="services"]');
    list.addEventListener('mousemove', (e) => { x = e.clientX + 170; y = e.clientY; if (!raf) { cx = x; cy = y; raf = requestAnimationFrame(loop); } });
    list.addEventListener('mouseover', (e) => { const s = e.target.closest('.svc'); if (!s) return; if (floatImg.getAttribute('src') !== s.dataset.img) floatImg.src = s.dataset.img; float.classList.add('is-on'); });
    list.addEventListener('mouseleave', () => float.classList.remove('is-on'));
  }

  // ── Заявка ─────────────────────────────────────────────
  const form = $('.form');
  const ok = $('.form__ok');
  const err = $('.form__error');
  const fileInput = form.elements.files;
  fileInput.addEventListener('change', () => {
    const n = fileInput.files.length;
    $('.file__text').textContent = n ? `${t('ct.files')(n)}: ${[...fileInput.files].map((f) => f.name).join(', ').slice(0, 80)}` : t('ct.file');
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    $$('.is-invalid', form).forEach((x) => x.classList.remove('is-invalid'));
    const d = Object.fromEntries(new FormData(form));
    const fail = (key, field) => { err.textContent = t(key); if (field) { form.elements[field].classList.add('is-invalid'); form.elements[field].focus(); } };
    if (!d.name || d.name.trim().length < 2) return fail('ct.errName', 'name');
    const c = (d.contact || '').trim();
    if (!(/^\S+@\S+\.\S+$/.test(c) || c.replace(/\D/g, '').length >= 7)) return fail('ct.errContact', 'contact');
    if (!d.consent) return fail('ct.errConsent');
    err.textContent = '';
    $('.ok__text').textContent = t('ct.ok')({ name: d.name.trim(), contact: c, type: form.elements.type.value });
    form.hidden = true; ok.hidden = false;
  });
  $('[data-again]').addEventListener('click', () => { form.reset(); $('.file__text').textContent = t('ct.file'); ok.hidden = true; form.hidden = false; });

  // ── Появление, счётчики, линия этапов ──────────────────
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target;
      const sib = $$(':scope > .reveal', el.parentElement);
      el.style.transitionDelay = `${Math.min(Math.max(sib.indexOf(el), 0), 5) * 80}ms`;
      el.classList.add('is-in');
      io.unobserve(el);
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  function observeReveals() { $$('.reveal:not(.is-in)').forEach((el) => io.observe(el)); }

  const countIo = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target, to = +el.dataset.to;
      countIo.unobserve(el);
      if (reduceMotion) { el.textContent = to; continue; }
      const t0 = performance.now() + 900; // после анимации заголовка
      const step = (now) => { const p = Math.max(0, Math.min(1, (now - t0) / 1500)); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }
  }, { threshold: 0.4 });
  $$('.count').forEach((el) => countIo.observe(el));

  const nav = $('.nav');
  const hero = $('.hero');
  const track = $('.process__track');
  const links = $$('.nav__links a');
  const sections = $$('main section[id]');
  let ticking = false;
  function onScroll() {
    nav.classList.toggle('is-solid', hero.getBoundingClientRect().bottom < 80);
    // Линия этапов заполняется по мере прокрутки секции
    const r = track.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (innerHeight * 0.75 - r.top) / (r.height + innerHeight * 0.25)));
    track.style.setProperty('--p', p);
    $$('.step', track).forEach((s, i, all) => s.classList.toggle('is-done', p >= (i + 0.5) / all.length));
    let cur = null;
    for (const s of sections) if (s.getBoundingClientRect().top < innerHeight * 0.35) cur = s.id;
    links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + cur));
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  // ── Мобильное меню ─────────────────────────────────────
  const burger = $('.burger');
  const sheet = $('.sheet');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    document.body.classList.toggle('no-scroll', open);
    burger.setAttribute('aria-expanded', String(open));
    sheet.setAttribute('aria-hidden', String(!open));
  }
  burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('a', sheet).forEach((a) => a.addEventListener('click', () => setMenu(false)));

  $$('.lang button').forEach((b) => b.addEventListener('click', () => applyLang(b.dataset.lang)));
  applyLang(lang);
  onScroll();
})();
