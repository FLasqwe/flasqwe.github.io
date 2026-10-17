// Портфолио Ekimov Gregory — «Monochrome».
// Язык EN/RU, заставка и словесный знак, витрина работ на вкладках (живые iframe демо),
// чат-бот и терминал парсера, email. Тема одна: чёрные и белые секции чередуются.
(() => {
  'use strict';
  let holdHdr = () => {}; // шапка не прячется при переходе по якорю (задаётся ниже)

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Адрес собираем в браузере, а не храним целиком в HTML — меньше спама от сборщиков адресов
  const MAIL = ['ekimovgregory9', 'gmail.com'].join('@');
  const DEMO_KEYS = ['tideway-lang', 'serein-lang', 'obsid-lang', 'ognivo-lang', 'luma-lang', 'monolit-lang'];

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* приватный режим */ } },
  };

  // ── Словарь интерфейса ─────────────────────────────────
  const T = {
    en: {
      skip: 'Skip to work',
      'nav.work': 'Work', 'nav.bots': 'Bots & parsers', 'nav.services': 'Services', 'nav.process': 'Process', 'nav.contact': 'Contact', 'nav.cta': 'Start a project', 'nav.menu': 'Menu', 'nav.close': 'Close', 'nav.index': 'Index', 'nav.open': 'Open menu', 'nav.shut': 'Close menu',
      'a.home': 'Ekimov Gregory — home', 'a.main': 'Main', 'a.lang': 'Language', 'a.mobile': 'Menu',
      'hero.role': 'Design & development', 'hero.what': 'Websites · Bots · Apps · Parsers', 'hero.langs': 'Working in English & Russian',
      'hero.status': 'Available for new projects',
      'hero.title': 'Websites, bots &amp; apps<br>that bring clients.',
      'hero.lead': 'I’m Gregory — I build websites, Telegram bots, web apps and parsers for business: booking, calculators, lead forms, automation and data collection.',
      'hero.cta': 'Discuss a project',
      'about.label': 'The approach', 'about.title': 'A website isn’t a business card.<br>It’s a tool that brings clients.',
      'hero.index': 'Index of work', 'hero.indexHint': 'Click — opens below',
      'hero.for': '<b>For any business</b> — restaurants, clinics, construction, beauty, real estate, retail and\u00a0services',
      'gw.work': 'WORKS', 'gw.svc': 'SERVICES', 'gw.proc': 'PROCESS', 'gw.ct': 'LET’S TALK',
      'a.sound': 'Interface sounds', 'snd.off': 'Sound off', 'snd.on': 'Sound on', egg: 'you found it ◯', 'ct.copiedShort': 'Email copied',
      'work.end': 'Want one like this', marquee: 'let’s talk', fab: 'Write',
      'work.kicker': 'Selected work', 'work.meta': '6 live demos · 1 real product · bots & parsers',
      'work.title': 'Click a tab. See it live.',
      'work.lead': 'Six concept sites run live in the frame — next to them, a real CRM and\u00a0bots.',
      'about.cap': 'Real product', 'marquee.static': 'let’s talk —',
      'work.keys': '← → to switch', 'work.tabs': 'Work',
      'kind.concept': 'Concept', 'kind.product': 'Product', 'kind.cap': 'Capabilities',
      'stage.live': 'Live demo', 'stage.conceptLive': 'Concept · live demo', 'stage.desktop': 'Desktop', 'stage.mobile': 'Mobile', 'stage.size': 'Preview size',
      'stage.open': 'Open full site ↗', 'stage.openLabel': 'Open the full site in a new tab',
      'stage.hint': 'Interactive — click the frame, then scroll and tap around', 'stage.hintTouch': 'Interactive — tap the frame, then scroll it', 'stage.real': 'This is the real site, not a video',
      'stage.interact': 'Click to interact', 'stage.tap': 'Tap to interact', 'stage.loading': 'Loading live demo…',
      'bd.show': 'Show details', 'bd.short': 'Details', 'bd.tag': 'Adaptive 360–1920 px · EN / RU', 'bd.tagShort': '360–1920 · EN/RU', 'bd.tagCrm': 'Real product · demo data',
      'stage.shots': 'Private tool · screenshots with demo data', 'stage.shotsNarrow': 'Real product · screenshots', 'stage.shotsNote': 'Interface in Russian · names and numbers are demo data',
      'stage.bots': 'Animated example · booking bot & lead parser', 'stage.botsNarrow': 'Animated example', 'stage.botsNote': 'Scripted demo of a typical scenario · company names are fictional',
      'case.concept': 'Concept project', 'case.real': 'Real product', 'case.cap': 'Capabilities',
      'case.feats': 'What’s inside', 'case.stack': 'Built with', 'case.similar': 'I want a site like this',
      'case.ask': 'Request a demo', 'case.private': 'Private tool — demo on request', 'case.discuss': 'Discuss your bot or parser',
      'bots.tg': 'Telegram bots', 'bots.parse': 'Parsers & data collection', 'bots.status': 'bot', 'bots.name': 'LUMA Booking Bot',
      'svc.kicker': 'Services', 'svc.meta': '7 services', 'svc.title': 'What I can<br>build for you.',
      'svc.lead': 'From a single landing page to a full multi-page website, a bot or an internal tool — designed, built and launched by one person, start to finish.',
      'proc.kicker': 'Process', 'proc.meta': '4 steps', 'proc.title': 'Clear steps,<br>no surprises.',
      'proc.lead': 'You always know what happens next — and you watch the project grow on a live\u00a0link.', 'proc.principles': 'Principles',
      'ct.kicker': 'Contact', 'ct.title': 'Have a&nbsp;project in&nbsp;mind?',
      'ct.lead': 'Tell me about your business and what the site, bot or app should do.',
      'fm.kicker': 'Project brief', 'fm.hint': 'Two minutes — I reply within a day with ideas, a plan and a price.',
      'fm.name': 'Your name', 'fm.contact': 'Email or Telegram', 'fm.contactPh': 'you@mail.com or @username',
      'fm.type': 'What do you need?', 'fm.budget': 'Budget <span class="fld__opt">(optional)</span>',
      'fm.msg': 'About the project', 'fm.msgPh': 'Business, goal, deadline, links to sites you like',
      'fm.send': 'Send brief', 'fm.sending': 'Sending…', 'fm.note': 'Or message me on <a href="https://t.me/Makeways" target="_blank" rel="noopener">Telegram</a>.',
      'fm.ok': 'Thank you! The brief is sent — I’ll reply within a day.', 'fm.fail': 'Couldn’t send. Please write to Telegram @Makeways or by email — the text is copied into the letter.',
      'fm.eName': 'Please enter your name', 'fm.eContact': 'Enter an email or @telegram', 'fm.eMsg': 'A few words about the project', 'fm.subject': 'New brief from the portfolio',
      fmTypes: ['Landing page', 'Full website', 'Telegram bot', 'Web app / CRM', 'Parser', 'Redesign', 'Other'],
      fmBudgets: ['up to 50k ₽', '50–150k ₽', '150–300k ₽', '300k ₽+', 'Not sure yet'],
      facts: ['I reply with ideas, a plan and a price', 'English / <span lang="ru">Русский</span>', 'Files and domain stay yours'],
      'ct.copy': 'Copy email', 'ct.copied': 'Copied ✓', 'ct.selected': 'Selected — copy manually', 'ct.write': 'Write an email', 'ct.subject': 'Project inquiry',
      'foot.note': 'Hand-built, hosted on GitHub Pages. Demo projects are concepts — names, people and data are fictional.', 'foot.top': 'Back to top ↑',
      title: 'Ekimov Gregory — Websites, bots & web apps',
    },
    ru: {
      skip: 'Перейти к работам',
      'nav.work': 'Работы', 'nav.bots': 'Боты и парсеры', 'nav.services': 'Услуги', 'nav.process': 'Процесс', 'nav.contact': 'Контакты', 'nav.cta': 'Обсудить проект', 'nav.menu': 'Меню', 'nav.close': 'Закрыть', 'nav.index': 'Разделы', 'nav.open': 'Открыть меню', 'nav.shut': 'Закрыть меню',
      'a.home': 'Ekimov Gregory — на главную', 'a.main': 'Основное меню', 'a.lang': 'Язык', 'a.mobile': 'Меню',
      'hero.role': 'Дизайн и разработка', 'hero.what': 'Сайты · Боты · Приложения · Парсеры', 'hero.langs': 'Работаю на русском и английском',
      'hero.status': 'Беру новые проекты',
      'hero.title': 'Сайты, боты и приложения,<br>которые приводят клиентов.',
      'hero.lead': 'Я Григорий — делаю сайты, Telegram-ботов, веб-приложения и парсеры для бизнеса: онлайн-запись, калькуляторы, заявки, автоматизация и сбор данных.',
      'hero.cta': 'Обсудить проект',
      'about.label': 'Подход', 'about.title': 'Сайт — не визитка.<br>Это инструмент, который приводит клиентов.',
      'hero.index': 'Указатель работ', 'hero.indexHint': 'Нажмите — откроется ниже',
      'hero.for': '<b>Для любого бизнеса</b> — рестораны, клиники, стройка, салоны красоты, недвижимость, торговля и\u00a0услуги',
      'gw.work': 'РАБОТЫ', 'gw.svc': 'УСЛУГИ', 'gw.proc': 'ПРОЦЕСС', 'gw.ct': 'НА СВЯЗИ',
      'a.sound': 'Звуки интерфейса', 'snd.off': 'Звук выкл', 'snd.on': 'Звук вкл', egg: 'нашли пасхалку ◯', 'ct.copiedShort': 'Почта скопирована',
      'work.end': 'Хочу так же', marquee: 'давайте обсудим', fab: 'Написать',
      'work.kicker': 'Избранные работы', 'work.meta': '6 живых демо · 1 реальный продукт · боты и парсеры',
      'work.title': 'Нажмите на вкладку. Смотрите вживую.',
      'work.lead': 'Шесть концепт-сайтов работают вживую в рамке, рядом — реальная CRM и\u00a0боты.',
      'about.cap': 'Реальный продукт', 'marquee.static': 'давайте обсудим',
      'work.keys': '← → переключение', 'work.tabs': 'Работы',
      'kind.concept': 'Концепт', 'kind.product': 'Продукт', 'kind.cap': 'Возможности',
      'stage.live': 'Живое демо', 'stage.conceptLive': 'Концепт · живое демо', 'stage.desktop': 'Компьютер', 'stage.mobile': 'Телефон', 'stage.size': 'Размер превью',
      'stage.open': 'Открыть сайт ↗', 'stage.openLabel': 'Открыть сайт целиком в новой вкладке',
      'stage.hint': 'Интерактивно — нажмите на рамку, затем листайте и нажимайте', 'stage.hintTouch': 'Интерактивно — коснитесь рамки и листайте сайт', 'stage.real': 'Это настоящий сайт, а не видео',
      'stage.interact': 'Нажмите, чтобы управлять', 'stage.tap': 'Нажмите, чтобы листать', 'stage.loading': 'Загружаем живое демо…',
      'bd.show': 'Показать детали', 'bd.short': 'Детали', 'bd.tag': 'Адаптив 360–1920 px · EN / RU', 'bd.tagShort': '360–1920 · EN/RU', 'bd.tagCrm': 'Реальный продукт · демо-данные',
      'stage.shots': 'Внутренний инструмент · скриншоты с демо-данными', 'stage.shotsNarrow': 'Реальный продукт · скриншоты', 'stage.shotsNote': 'Названия и цифры — демо-данные',
      'stage.bots': 'Анимированный пример · бот записи и парсер лидов', 'stage.botsNarrow': 'Анимированный пример', 'stage.botsNote': 'Демо по сценарию: диалог с ботом и запуск парсера · компании вымышлены',
      'case.concept': 'Концепт-проект', 'case.real': 'Реальный продукт', 'case.cap': 'Возможности',
      'case.feats': 'Что внутри', 'case.stack': 'Технологии', 'case.similar': 'Хочу такой же',
      'case.ask': 'Запросить демо', 'case.private': 'Внутренний инструмент — демо по запросу', 'case.discuss': 'Обсудить бота или парсер',
      'bots.tg': 'Telegram-боты', 'bots.parse': 'Парсеры и сбор данных', 'bots.status': 'бот', 'bots.name': 'LUMA · бот записи',
      'svc.kicker': 'Услуги', 'svc.meta': '7 услуг', 'svc.title': 'Что я могу<br>сделать для вас.',
      'svc.lead': 'От одного лендинга до полного многостраничного сайта, бота или внутреннего инструмента — проектирую, делаю и запускаю сам, от начала до конца.',
      'proc.kicker': 'Процесс', 'proc.meta': '4 шага', 'proc.title': 'Понятные шаги,<br>без сюрпризов.',
      'proc.lead': 'Вы всегда знаете, что будет дальше, — и видите, как растёт проект, по живой\u00a0ссылке.', 'proc.principles': 'Принципы',
      'ct.kicker': 'Контакты', 'ct.title': 'Есть задача?<br>Давайте обсудим.',
      'ct.lead': 'Расскажите о бизнесе и о том, что должен делать сайт, бот или приложение.',
      'fm.kicker': 'Бриф проекта', 'fm.hint': 'Пара минут — отвечу в течение дня идеями, планом и ценой.',
      'fm.name': 'Ваше имя', 'fm.contact': 'Почта или Telegram', 'fm.contactPh': 'you@mail.ru или @username',
      'fm.type': 'Что нужно?', 'fm.budget': 'Бюджет <span class="fld__opt">(необязательно)</span>',
      'fm.msg': 'О проекте', 'fm.msgPh': 'Бизнес, задача, сроки, ссылки на сайты, которые нравятся',
      'fm.send': 'Отправить бриф', 'fm.sending': 'Отправляю…', 'fm.note': 'Или напишите в <a href="https://t.me/Makeways" target="_blank" rel="noopener">Telegram</a>.',
      'fm.ok': 'Спасибо! Бриф отправлен — отвечу в течение дня.', 'fm.fail': 'Не получилось отправить. Напишите в Telegram @Makeways или на почту — текст уже подставлен в письмо.',
      'fm.eName': 'Укажите имя', 'fm.eContact': 'Укажите почту или @telegram', 'fm.eMsg': 'Пара слов о проекте', 'fm.subject': 'Новый бриф с портфолио',
      fmTypes: ['Лендинг', 'Сайт под ключ', 'Telegram-бот', 'Веб-приложение / CRM', 'Парсер', 'Редизайн', 'Другое'],
      fmBudgets: ['до 50 тыс. ₽', '50–150 тыс. ₽', '150–300 тыс. ₽', 'от 300 тыс. ₽', 'Пока не знаю'],
      facts: ['Отвечу идеями, планом и ценой', '<span lang="en">English</span> / Русский', 'Файлы и домен остаются у вас'],
      'ct.copy': 'Скопировать', 'ct.copied': 'Скопировано ✓', 'ct.selected': 'Выделено — скопируйте вручную', 'ct.write': 'Написать письмо', 'ct.subject': 'Запрос по проекту',
      'foot.note': 'Сделано вручную, размещено на GitHub Pages. Демо-проекты — концепты: названия, люди и данные вымышлены.', 'foot.top': 'Наверх ↑',
      title: 'Ekimov Gregory — сайты, боты и веб-приложения',
    },
  };

  // ── Работы: 6 концепт-сайтов (новые — первыми), реальный продукт, боты и парсеры ──
  // pa — фирменный цвет проекта (метка вкладки, полоска, лёгкий оттенок подиума); sb — фон/текст статус-бара телефона
  const WORK = [
    {
      id: 'tideway', kind: 'site', url: 'tideway/', host: 'flasqwe.github.io/<b>tideway</b>/', pa: '#22e0c8', pt: '#0c8f82', sb: ['#06101c', '#ffffff'],
      chips: ['HTML', 'CSS', 'JavaScript', 'Canvas', 'Accessibility', 'EN / RU'],
      en: { line: 'An agency that sells timing.', name: 'TIDEWAY', tab: 'TIDEWAY', idx: 'TIDEWAY', sub: 'Creative agency', short: 'Brand & growth agency', tag: 'Brand, digital & growth agency',
        desc: 'A concept site for a fictional strategy-led creative agency. Layered waves drawn on canvas, a live tide model in the hero, six case studies with a filter and a modal, and a project estimator that turns into a brief.',
        feats: ['Hero: layered waves on canvas and a live tide gauge computed from the clock', 'Six case studies: filter by discipline, modal with challenge / approach / result and KPIs', 'Project estimator: services, stage and urgency give a budget range, timeline and team, then prefill the brief', 'Services accordion with a cursor-following image, scroll-highlighted manifesto, London / Lisbon clocks'] },
      ru: { line: 'Агентство, которое продаёт тайминг.', name: 'TIDEWAY', tab: 'TIDEWAY', idx: 'TIDEWAY', sub: 'Креативное агентство', short: 'Агентство бренда и роста', tag: 'Агентство бренда, digital и роста',
        desc: 'Концепт-сайт вымышленного креативного агентства, которое начинает со стратегии. Слоистые волны на canvas, живая модель прилива на первом экране, шесть кейсов с фильтром и модальным окном и калькулятор проекта, который превращается в бриф.',
        feats: ['Первый экран: волны на canvas и живой график прилива, посчитанный от текущего времени', 'Шесть кейсов: фильтр по дисциплине, модальное окно с задачей / подходом / результатом и KPI', 'Калькулятор проекта: услуги, стадия и срочность дают вилку бюджета, сроки и команду, затем заполняют бриф', 'Аккордеон услуг с картинкой за курсором, манифест с подсветкой при прокрутке, часы Лондона и Лиссабона'] },
    },
    {
      id: 'serein', kind: 'site', url: 'serein/', host: 'flasqwe.github.io/<b>serein</b>/', pa: '#b08a5a', pt: '#7a5a32', sb: ['#f3eee6', '#111111'],
      chips: ['HTML', 'CSS', 'JavaScript', 'SVG', 'EN / RU'],
      en: { line: 'Pick a flat by its window.', name: 'SEREIN Residences', tab: 'SEREIN', idx: 'SEREIN', sub: 'Real estate', short: 'Riverside residences', tag: 'Premium residential real estate · riverside',
        desc: 'A concept sales site for a fictional riverside residential complex in limestone and bronze: interactive apartment picker (facade, floor plan, flat plan), live mortgage calculator and a scroll-driven day-to-dusk sequence.',
        feats: ['Apartment picker: SVG facade with lit windows for matching flats, floor plan to scale, flat plan that draws itself in', 'Save and compare up to 3 flats side by side', 'Mortgage calculator with principal-vs-interest chart and three programmes', 'Viewing booking: 7-day grid, time slots, phone mask, inline validation'] },
      ru: { line: 'Квартира — по окнам фасада.', name: 'SEREIN Residences', tab: 'SEREIN', idx: 'SEREIN', sub: 'Недвижимость', short: 'Резиденции у реки', tag: 'Премиальная жилая недвижимость · у реки',
        desc: 'Концепт продающего сайта вымышленного жилого комплекса из известняка и бронзы на набережной: интерактивный выбор квартиры (фасад, план этажа, план квартиры), живой ипотечный калькулятор и сцена «от утра до сумерек» при прокрутке.',
        feats: ['Выбор квартиры: SVG-фасад с подсветкой окон под фильтры, план этажа в масштабе, план квартиры с анимацией прорисовки', 'Избранное и сравнение до 3 квартир', 'Ипотечный калькулятор с графиком «тело и проценты» и тремя программами', 'Запись на показ: сетка на 7 дней, слоты, маска телефона, проверка полей'] },
    },
    {
      id: 'obsid', kind: 'site', url: 'obsid/', host: 'flasqwe.github.io/<b>obsid</b>/', pa: '#d4ff3a', pt: '#5f7a00', sb: ['#0a0b0d', '#ffffff'],
      chips: ['HTML', 'CSS', 'JavaScript', 'SVG', 'Accessibility', 'EN / RU'],
      en: { line: 'A detailing lab with a live price.', name: 'OBSID', tab: 'OBSID', idx: 'OBSID', sub: 'Paint protection', short: 'Paint protection & detailing', tag: 'Paint protection film & detailing studio',
        desc: 'A dark, technical concept site for a paint-protection lab. A light bar scans the hero car to reveal a wireframe zone map, and a live configurator shows price, time and protected zones.',
        feats: ['Hero scan: a light bar sweeps the car to reveal a wireframe PPF zone map', 'Live configurator: body type and packs light up zones and update price, bay hours and bundle discount', 'Booking flow: 14-day picker, time slots, a ticket with your setup, accessible validation', 'Before/after correction slider, exploded film-layer diagram, process timeline'] },
      ru: { line: 'Защита кузова с живой ценой.', name: 'OBSID', tab: 'OBSID', idx: 'OBSID', sub: 'Защита кузова', short: 'Защита кузова и детейлинг', tag: 'Студия защиты кузова и детейлинга',
        desc: 'Тёмный технологичный концепт-сайт студии защиты кузова. Световая полоса сканирует машину и открывает каркасную схему зон, а живой конфигуратор сразу показывает цену, срок и защищённые зоны.',
        feats: ['Скан на первом экране: световая полоса проходит по машине и открывает карту зон плёнки', 'Живой конфигуратор: кузов и пакеты подсвечивают зоны, пересчитывают цену, часы в боксе и скидку', 'Запись: 14 дней, слоты времени, «билет» с набором, доступная валидация', 'Слайдер до/после, разнесённая схема слоёв плёнки, лента этапов'] },
    },
    {
      id: 'ognivo', kind: 'site', url: 'ognivo/', host: 'flasqwe.github.io/<b>ognivo</b>/', pa: '#e3743b', pt: '#a84a18', sb: ['#0b0a08', '#ffffff'],
      chips: ['HTML', 'CSS', 'JavaScript', 'Canvas', 'EN / RU'],
      en: { line: 'A restaurant that cooks over open fire.', name: 'OGNIVO', tab: 'OGNIVO', idx: 'OGNIVO', sub: 'Restaurant', short: 'Restaurant', tag: 'Restaurant · wood-fired kitchen',
        desc: 'A dark, atmospheric site for a fine-dining restaurant where everything is cooked over open fire. The mood sells the table before the menu does.',
        feats: ['Live sparks over the hero photo, cinematic intro', 'Tabbed menu: tasting set, à la carte, wine & bar', 'Table booking with validation and confirmation', 'Chef story, gallery, rotating reviews'] },
      ru: { line: 'Ресторан, где готовят на живом огне.', name: 'OGNIVO', tab: 'OGNIVO', idx: 'OGNIVO', sub: 'Ресторан', short: 'Ресторан', tag: 'Ресторан · кухня на живом огне',
        desc: 'Тёмный атмосферный сайт для ресторана высокой кухни, где всё готовят на открытом огне. Настроение продаёт столик раньше, чем меню.',
        feats: ['Живые искры поверх фото, кинематографичное появление', 'Меню на вкладках: дегустация, основное, вино и бар', 'Бронь столика с проверкой полей и подтверждением', 'История шефа, галерея, отзывы'] },
    },
    {
      id: 'luma', kind: 'site', url: 'luma/', host: 'flasqwe.github.io/<b>luma</b>/', pa: '#14706a', pt: '#14706a', sb: ['#f6f5f1', '#111111'],
      chips: ['HTML', 'CSS', 'JavaScript', 'Accessibility', 'EN / RU'],
      en: { line: 'A calm clinic with prices upfront.', name: 'LUMA Dental', tab: 'LUMA Dental', idx: 'LUMA Dental', sub: 'Dental clinic', short: 'Dental clinic', tag: 'Dental clinic · premium',
        desc: 'A calm, trustworthy site for a dental clinic that turns nervous visitors into booked patients — prices and free time slots are visible upfront.',
        feats: ['Treatment cost calculator with 0% instalments', 'Drag-to-compare whitening before / after slider', 'Booking with doctor choice and live free slots', 'Open / closed status calculated from opening hours'] },
      ru: { line: 'Спокойная клиника с ценами сразу.', name: 'LUMA Dental', tab: 'LUMA Dental', idx: 'LUMA Dental', sub: 'Стоматология', short: 'Стоматология', tag: 'Стоматология · премиум',
        desc: 'Спокойный, вызывающий доверие сайт клиники, который превращает тревожных посетителей в записанных пациентов: цены и свободное время видны сразу.',
        feats: ['Калькулятор стоимости лечения с рассрочкой 0%', 'Слайдер «до / после» отбеливания', 'Запись с выбором врача и свободных окон', 'Статус «открыто / закрыто» по часам работы'] },
    },
    {
      id: 'monolit', kind: 'site', url: 'monolit/', host: 'flasqwe.github.io/<b>monolit</b>/', pa: '#f5c400', pt: '#806500', sb: ['#131419', '#ffffff'],
      chips: ['HTML', 'CSS', 'JavaScript', 'SVG', 'EN / RU'],
      en: { line: 'A builder with an instant estimate.', name: 'MONOLIT', tab: 'MONOLIT', idx: 'MONOLIT', sub: 'Construction', short: 'Construction', tag: 'Construction · design & build',
        desc: 'A bold industrial site for a construction company. Big numbers, a project portfolio and an instant cost estimate do the selling for B2B and private clients.',
        feats: ['Blueprint lines drawing over the hero photo', 'Filterable portfolio with project details', 'Cost & timeline estimator with a stage-by-stage breakdown', 'Lead form with drawings upload'] },
      ru: { line: 'Стройка с мгновенной сметой.', name: 'MONOLIT', tab: 'MONOLIT', idx: 'MONOLIT', sub: 'Строительство', short: 'Строительство', tag: 'Строительство · проектирование',
        desc: 'Смелый индустриальный сайт строительной компании. Крупные цифры, портфолио объектов и мгновенная смета продают и B2B-, и частным клиентам.',
        feats: ['Чертёжные линии, прорисовывающиеся поверх фото', 'Портфолио с фильтрами и карточкой объекта', 'Калькулятор стоимости и сроков с разбивкой по этапам', 'Заявка с прикреплением чертежей'] },
    },
    {
      // Скриншоты сняты на локальной копии с вымышленными демо-данными; название бренда на скриншоте заменено на «Lead CRM»
      id: 'crm', kind: 'product', host: 'crm · lead generation', pa: '#6c8bff', pt: '#3a55e0',
      chips: ['Node.js', 'PostgreSQL', 'Playwright', 'Email API', 'Open data'],
      en: { line: 'A real CRM I built for outreach.', name: 'Lead CRM & parser', tab: 'Lead CRM', idx: 'Lead CRM & parser', sub: 'B2B · private', short: 'Real product', tag: 'B2B · CRM + parser',
        desc: 'An internal tool for cold outreach: finds companies by niche and city, collects contacts and decision makers, scores leads and runs email campaigns — all in one panel.',
        feats: ['Company search in 120 countries from open map data', 'Contacts and decision makers from company sites and official registries', 'Lead scoring 0–100 with “ready to buy” signals', 'Email campaigns with domain warm-up, auto follow-ups and inbox', 'Kanban pipeline, analytics dashboard, team access'] },
      ru: { line: 'Реальная CRM для холодных продаж.', name: 'CRM и парсер лидов', tab: 'CRM лидов', idx: 'CRM и парсер лидов', sub: 'B2B · закрытая', short: 'Реальный продукт', tag: 'B2B · CRM + парсер',
        desc: 'Внутренний инструмент для холодных продаж: находит компании по нише и городу, собирает контакты и ЛПР, оценивает лиды и запускает email-рассылки — всё в одной панели.',
        feats: ['Поиск компаний в 120 странах по открытым картам', 'Контакты и ЛПР с сайтов компаний и из гос. реестров', 'Скоринг лидов 0–100 с сигналами «готов покупать»', 'Рассылки с прогревом домена, автонапоминаниями и инбоксом', 'Канбан-воронка, дашборд аналитики, доступ для команды'] },
    },
    {
      id: 'bots', kind: 'bots', pa: '#2aabee', pt: '#086b9e',
      chips: ['Telegram Bot API', 'Node.js', 'Playwright', 'PostgreSQL', 'CSV / Sheets'],
      en: { line: 'Bots that book, parsers that find.', name: 'Telegram bots &\u00a0parsers', tab: 'Bots &\u00a0parsers', idx: 'Telegram bots &\u00a0parsers', sub: 'Automation', short: 'Automation', tag: 'Automation · beyond websites',
        desc: 'A website brings people in. Automation keeps them: bots that book and remind, apps that run the business, parsers that find new clients.' },
      ru: { line: 'Боты записывают, парсеры ищут клиентов.', name: 'Telegram-боты и\u00a0парсеры', tab: 'Боты и\u00a0парсеры', idx: 'Telegram-боты и\u00a0парсеры', sub: 'Автоматизация', short: 'Автоматизация', tag: 'Автоматизация · не только сайты',
        desc: 'Сайт приводит людей. Автоматизация их удерживает: боты записывают и напоминают, приложения ведут бизнес, парсеры находят новых клиентов.' },
    },
  ];
  const byId = (id) => WORK.find((w) => w.id === id);

  // ── «Детали»: чертёжные выноски поверх живого демо ──
  // sel — элемент внутри демо (или картинки CRM), at — точка на нём (доли), d — смещение подписи (доли рамки):
  // d[0] < 0 — подпись слева от точки излома, иначе справа. Подписи — только то, что в демо есть на самом деле.
  const A = (sel, at, d, en, ru) => ({ sel, at, d, en, ru });
  const ANN = {
    tideway: {
      desktop: [
        A('#tide', [0, 0.5], [-0.06, 0.1], 'Tide gauge — computed from the clock, not a feed', 'График прилива — считается от времени, не из API'),
        A('.nav__links a[href="#estimate"]', [0.5, 1], [0.03, 0.12], 'Estimator: budget, timeline, team → brief', 'Калькулятор: бюджет, сроки, команда → бриф'),
        A('.hero__cta .btn--ghost', [1, 0.5], [0.05, 0.1], 'Six cases: filter + modal', 'Шесть кейсов: фильтр + модалка'),
        A('.lang', [0.5, 1], [-0.1, 0.08], 'EN / RU', 'EN / RU'),
      ],
      mobile: [
        A('.lang', [0.5, 1], [-0.14, 0.07], 'EN / RU', 'EN / RU'),
        A('.hero__cta .btn--ghost', [1, 0.5], [0.06, -0.08], 'Six cases: filter + modal', 'Шесть кейсов: фильтр + модалка'),
        A('.hero__stats', [0.5, 0], [0.08, 0.14], 'Counters animate on scroll', 'Счётчики оживают при прокрутке'),
      ],
    },
    serein: {
      desktop: [
        A('.hero__card', [0.08, 1], [-0.02, 0.17], 'Free flats — counted from the plan data', 'Свободные — из данных шахматки'),
        A('.hero a.btn[href="#residences"]', [1, 0.15], [0.04, -0.09], 'Flat picker: facade → floor → plan', 'Выбор квартиры: фасад → этаж → план'),
        A('a[href="#mortgage"]', [0.5, 0.82], [-0.04, 0.26], 'Mortgage calculator · live chart', 'Ипотека · живой график платежей'),
        A('.lang', [0.5, 1], [-0.1, 0.07], 'EN / RU', 'EN / RU'),
      ],
      mobile: [
        A('.lang', [0.5, 1], [-0.14, 0.07], 'EN / RU', 'EN / RU'),
        A('.hero a.btn[href="#residences"]', [0.12, 0], [0.04, -0.09], 'Flat picker: facade → plan', 'Выбор: фасад → план'),
        A('.hero a[href="#viewing"]:not(.btn)', [1, 0.5], [0.07, 0.05], 'Viewing booking', 'Запись на показ'),
      ],
    },
    obsid: {
      desktop: [
        A('#scan', [0.56, 0.62], [-0.08, 0.13], 'Light-bar scan reveals the zone map', 'Скан открывает карту зон плёнки'),
        A('a[href="#config"]', [0.5, 0.85], [-0.04, 0.24], 'Configurator — price recalculates live', 'Конфигуратор — цена пересчитывается сразу'),
        A('a.btn[href="#book"]', [0.5, 1], [-0.04, 0.42], 'Booking · 14 days, slots, ticket', 'Запись · 14 дней, слоты, «билет»'),
        A('.lang', [0.5, 1], [-0.1, 0.08], 'EN / RU', 'EN / RU'),
      ],
      mobile: [
        A('.lang', [0.5, 1], [-0.12, 0.07], 'EN / RU', 'EN / RU'),
        A('#scan', [0.56, 0.62], [0.05, 0.08], 'Light-bar scan', 'Скан кузова'),
        A('.hero a.btn[href="#config"]', [0.85, 0], [-0.06, -0.08], 'Live configurator', 'Живой конфигуратор'),
      ],
    },
    ognivo: {
      desktop: [
        A('canvas.hero__sparks', [0.66, 0.3], [0.06, 0.06], 'Live sparks — canvas, not a video', 'Живые искры — canvas, не видео'),
        A('a[href="#menu"]', [0.5, 1], [-0.04, 0.16], 'Menu tabs: tasting · à la carte · wine', 'Меню на вкладках: сет · основное · вино'),
        A('.hero a.btn[href="#reserve"]', [1, 0.5], [0.05, 0.08], 'Table booking with validation', 'Бронь столика с проверкой полей'),
        A('.lang', [0.5, 1], [-0.1, 0.08], 'EN / RU', 'EN / RU'),
      ],
      mobile: [
        A('.lang', [0.5, 1], [-0.12, 0.07], 'EN / RU', 'EN / RU'),
        A('canvas.hero__sparks', [0.7, 0.24], [-0.06, 0.06], 'Live sparks · canvas', 'Живые искры · canvas'),
        A('.hero a.btn[href="#reserve"]', [1, 0.5], [0.06, 0.07], 'Table booking', 'Бронь столика'),
      ],
    },
    luma: {
      desktop: [
        A('.hero .pill', [1, 0.5], [0.05, 0], 'Open / closed — from opening hours', '«Открыто» — по часам работы'),
        A('.slot-time', [1, 0.5], [0.05, -0.03], 'Next free slot — from the booking grid', 'Ближайшее окно — из сетки записи'),
        A('.hero a[href="#calculator"]', [1, 0.5], [0.05, 0.08], 'Cost calculator · 0% instalments', 'Калькулятор · рассрочка 0%'),
        A('a[href="#results"]', [0.5, 0.9], [0.04, 0.07], 'Before / after slider', 'Слайдер «до / после»'),
      ],
      mobile: [
        A('.hero .pill', [1, 0.5], [0.06, 0], 'From opening hours', 'По часам работы'),
        A('.hero a.btn[href="#book"]', [1, 0.5], [0.05, -0.06], 'Doctor + free slots', 'Врач и свободные окна'),
        A('.hero a[href="#calculator"]', [1, 0.5], [0.06, 0.05], 'Cost calculator', 'Калькулятор'),
      ],
    },
    monolit: {
      desktop: [
        A('svg.hero__blueprint', [0.764, 0.555], [-0.08, 0.2], 'Blueprint lines draw themselves', 'Чертёж прорисовывается сам'),
        A('a[href="#estimate"]', [0.5, 1], [-0.04, 0.16], 'Estimate: cost & timeline by stage', 'Смета: цена и сроки по этапам'),
        A('a[href="#projects"]', [0.5, 1], [-0.04, 0.34], 'Portfolio with filters', 'Портфолио с фильтрами'),
        A('.lang', [0.5, 1], [-0.08, 0.08], 'EN / RU', 'EN / RU'),
      ],
      mobile: [
        A('.lang', [0.5, 1], [-0.12, 0.07], 'EN / RU', 'EN / RU'),
        A('.hero a.btn[href="#estimate"]', [1, 0.5], [0.05, -0.06], 'Cost & timeline estimate', 'Смета: цена и сроки'),
        A('.hero a[href="#projects"]', [1, 0.5], [0.06, 0.06], 'Portfolio · filters', 'Портфолио · фильтры'),
      ],
    },
    crm: {
      desktop: [
        A('.device img', [0.205, 0.11], [0.04, -0.05], 'Domain warm-up · daily send limit', 'Прогрев домена · лимит писем в день'),
        A('.device img', [0.085, 0.26], [0.1, 0.14], 'Inbox with replies', 'Инбокс с ответами'),
        A('.device img', [0.27, 0.52], [0.12, 0.2], 'Pipeline: new → written → replied → won', 'Воронка: новые → написали → ответили → выиграно'),
        A('.comp__phone img', [0.3, 0.06], [-0.05, -0.1], 'Same CRM on a phone', 'Та же CRM на телефоне'),
      ],
    },
  };
  // Карточка «Подхода»: светлый, тёмный и яркий кадр — разные по тону, читаются на чёрном
  const REEL = ['serein', 'obsid', 'monolit'];
  const CHIP_RU = { Accessibility: 'Доступность' };
  const chipT = (x) => (lang === 'ru' && CHIP_RU[x]) || x;

  const SERVICES = {
    en: [
      ['Landing page', 'One page that explains the offer and collects leads — for a launch, a service or an ad campaign.', ['Copy structure & design', 'Lead form', 'Analytics setup']],
      ['Full website, end\u00a0to\u00a0end', 'A deep multi-page site built around a real structure: sitemap, navigation, a page for every service or product, catalog, blog or case studies — designed as one system.', ['Sitemap & page structure', 'Catalog / blog / case studies', 'SEO basics & easy content updates']],
      ['Business website', 'A full site for a restaurant, clinic, studio or company: services, prices, team, reviews, contacts.', ['Up to ~10 sections', 'Bilingual on request', 'Mobile-first']],
      ['Booking & calculators', 'Interactive parts that sell: online booking, price calculators, quizzes and estimates.', ['Booking flow', 'Price / cost calculator', 'Forms to email / CRM']],
      ['Redesign', 'Your current site looks dated or loses visitors on mobile — I rebuild it fast and modern.', ['Audit of the old site', 'New design', 'Same domain, no downtime']],
      ['Telegram bots', 'Bookings, orders, payments and reminders right in the chat your clients already use — no app to install.', ['Booking & reminders', 'Orders & payments', 'Telegram Mini Apps']],
      ['Web apps & parsers', 'Dashboards, CRM and admin panels — plus parsers that collect companies, contacts and prices from open sources.', ['Web apps & PWA', 'CRM & admin panels', 'Export to CSV / Sheets / CRM']],
    ],
    ru: [
      ['Лендинг', 'Одна страница, которая объясняет предложение и собирает заявки, — для запуска, услуги или рекламы.', ['Структура текста и дизайн', 'Форма заявки', 'Подключение аналитики']],
      ['Полный сайт под\u00a0ключ', 'Глубокий многостраничный сайт с продуманной структурой: карта сайта, навигация, отдельная страница под каждую услугу или товар, каталог, блог или кейсы — единая система.', ['Карта сайта и структура страниц', 'Каталог / блог / кейсы', 'SEO-основа и удобное обновление']],
      ['Сайт для бизнеса', 'Полноценный сайт ресторана, клиники, студии или компании: услуги, цены, команда, отзывы, контакты.', ['До ~10 разделов', 'Два языка по запросу', 'Сначала мобильная версия']],
      ['Запись и калькуляторы', 'Интерактив, который продаёт: онлайн-запись, калькуляторы цены, квизы и сметы.', ['Сценарий записи', 'Калькулятор стоимости', 'Заявки на почту / в CRM']],
      ['Редизайн', 'Текущий сайт устарел или теряет посетителей на телефоне — переделаю быстро и современно.', ['Аудит старого сайта', 'Новый дизайн', 'Тот же домен, без простоя']],
      ['Telegram-боты', 'Запись, заказы, оплата и напоминания прямо в чате, которым клиенты уже пользуются, — ничего не нужно устанавливать.', ['Запись и напоминания', 'Заказы и оплата', 'Telegram Mini Apps']],
      ['Веб-приложения и парсеры', 'Дашборды, CRM и админ-панели — а также парсеры, которые собирают компании, контакты и цены из открытых источников.', ['Веб-приложения и PWA', 'CRM и админ-панели', 'Выгрузка в CSV / Таблицы / CRM']],
    ],
  };
  // Линейные мини-иллюстрации к услугам (чернила + один акцент)
  const SVC_ILL = [
    // лендинг: заголовок, кнопка, форма заявки
    '<rect x="4" y="6" width="112" height="68" rx="4"/><path d="M4 16h112"/><circle class="soft" cx="10" cy="11" r="1.3"/><circle class="soft" cx="15" cy="11" r="1.3"/><circle class="soft" cx="20" cy="11" r="1.3"/><path d="M13 29h44M13 36h32"/><path class="soft" d="M13 45h40M13 50h30"/><rect class="af" x="13" y="57" width="24" height="8" rx="4"/><rect x="69" y="25" width="38" height="41" rx="2.5"/><path class="soft" d="M75 33h26M75 41h26M75 49h26"/><rect class="a" x="75" y="56" width="26" height="5" rx="2.5"/>',
    // полный сайт: дерево страниц — главная, разделы, вложенные страницы
    '<rect class="af" x="46" y="5" width="28" height="13" rx="3"/><path d="M60 18v8M20 26h80M20 26v7M60 26v7M100 26v7"/><rect x="6" y="33" width="28" height="12" rx="2.5"/><rect x="46" y="33" width="28" height="12" rx="2.5"/><rect x="86" y="33" width="28" height="12" rx="2.5"/><path class="soft" d="M14 45v24M14 55h6M14 63h6M54 45v16M54 55h6M94 45v24M94 55h6M94 63h6"/><rect x="20" y="51" width="16" height="8" rx="2"/><rect x="20" y="59" width="16" height="8" rx="2" class="soft"/><rect x="60" y="51" width="16" height="8" rx="2"/><rect class="a" x="100" y="51" width="16" height="8" rx="2"/><rect x="100" y="59" width="16" height="8" rx="2" class="soft"/>',
    // сайт: меню, большое фото, три карточки
    '<rect x="4" y="6" width="112" height="68" rx="4"/><path d="M4 16h112"/><path d="M11 11h12"/><path class="soft" d="M84 11h6M94 11h6M104 11h6"/><rect x="11" y="21" width="98" height="24" rx="2"/><path class="soft" d="M11 44l20-13 12 8 11-7 22 12"/><circle class="a" cx="94" cy="30" r="4"/><rect x="11" y="51" width="30" height="16" rx="2"/><rect x="45" y="51" width="30" height="16" rx="2"/><rect x="79" y="51" width="30" height="16" rx="2"/>',
    // запись и калькулятор: свободные окна + ползунки и итог
    '<rect x="4" y="9" width="58" height="64" rx="4"/><path d="M4 21h58"/><path d="M17 5v8M49 5v8"/><rect class="soft" x="10" y="28" width="14" height="9" rx="2"/><rect class="soft" x="26" y="28" width="14" height="9" rx="2"/><rect class="soft" x="42" y="28" width="14" height="9" rx="2"/><rect class="soft" x="10" y="42" width="14" height="9" rx="2"/><rect class="af" x="26" y="42" width="14" height="9" rx="2"/><rect class="soft" x="42" y="42" width="14" height="9" rx="2"/><rect class="soft" x="10" y="56" width="14" height="9" rx="2"/><rect class="soft" x="26" y="56" width="14" height="9" rx="2"/><rect class="soft" x="42" y="56" width="14" height="9" rx="2"/><rect x="70" y="9" width="46" height="64" rx="4"/><path class="soft" d="M77 24h32"/><path class="a" d="M77 24h19"/><circle class="af" cx="96" cy="24" r="3"/><path class="soft" d="M77 38h32"/><path d="M77 38h10"/><circle cx="87" cy="38" r="3"/><path class="soft" d="M77 52h32"/><path d="M77 61h12"/><path class="a" d="M97 61h12" stroke-width="2.2"/>',
    // редизайн: «до» пунктиром и «после» чисто, ручка-разделитель
    '<rect x="4" y="6" width="112" height="68" rx="4"/><g class="soft" stroke-dasharray="2 3"><path d="M12 18h30M12 26h38M12 34h22"/><rect x="12" y="43" width="18" height="12"/><path d="M36 45h16M36 51h12M12 64h34"/></g><path d="M68 19h28"/><path class="soft" d="M68 27h38M68 33h28"/><rect x="68" y="42" width="40" height="15" rx="2"/><rect class="af" x="68" y="62" width="18" height="6" rx="3"/><path class="a" d="M60 6v68"/><circle class="af" cx="60" cy="40" r="5.5"/>',
    // Telegram-бот: сообщение бота, ответ клиента, кнопки
    '<path d="M16 7h48a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6V13a6 6 0 0 1 6-6z"/><path d="M10 23l-4 7 9-3"/><path class="soft" d="M17 15h40M17 21h26"/><rect class="af" x="56" y="37" width="56" height="13" rx="6.5"/><rect x="10" y="59" width="31" height="11" rx="3"/><rect class="a" x="45" y="59" width="31" height="11" rx="3"/><rect x="80" y="59" width="32" height="11" rx="3"/>',
    // веб-приложение и парсер: меню, график, таблица
    '<rect x="4" y="6" width="112" height="68" rx="4"/><path d="M30 6v68"/><path class="soft" d="M11 17h12M11 25h12M11 33h12M11 41h9"/><path class="soft" d="M38 65h38"/><path d="M43 64V52M51 64V44M59 64V48" stroke-width="3.2"/><path class="a" d="M67 64V34" stroke-width="3.2"/><path d="M84 19h24"/><path class="soft" d="M84 28h24M84 36h24M84 44h24M84 52h24"/><circle class="af" cx="86" cy="63" r="2"/><circle class="af" cx="93" cy="63" r="2" opacity=".55"/><circle class="af" cx="100" cy="63" r="2" opacity=".25"/>',
  ];
  const STEPS = {
    en: [['Brief', 'A short call or chat about your business, clients and goals.'], ['Design', 'I show the design of key screens — you comment, I adjust.'], ['Build', 'Responsive, fast, bilingual if needed. You see progress on a live\u00a0link.'], ['Launch', 'Domain, hosting, analytics — and a short guide on how to update the site.']],
    ru: [['Бриф', 'Короткий созвон или переписка о бизнесе, клиентах и целях.'], ['Дизайн', 'Показываю дизайн ключевых экранов — вы комментируете, я правлю.'], ['Разработка', 'Адаптивно, быстро, на двух языках при необходимости. Прогресс — по живой\u00a0ссылке.'], ['Запуск', 'Домен, хостинг, аналитика — и короткая инструкция, как обновлять сайт.']],
  };
  const PRINCIPLES = {
    en: [['Mobile-first', 'most visitors come from\u00a0phones'], ['Fast', 'no heavy site builders or\u00a0bloat'], ['Bilingual', 'EN / RU or any pair'], ['SEO-ready', 'meta, speed, clean markup'], ['Yours', 'files and domain stay with\u00a0you']],
    ru: [['Сначала телефон', 'большинство заходит с телефона'], ['Быстро', 'без тяжёлых конструкторов'], ['Два языка', 'EN / RU или любая пара'], ['Готов к SEO', 'мета-теги, скорость, чистая вёрстка'], ['Всё ваше', 'файлы и домен остаются у\u00a0вас']],
  };

  // ── Боты и парсеры: списки, чат, терминал, карточки возможностей ──
  const APPS = {
    en: {
      tgList: ['Booking with free slots and reminders', 'Orders and payments in the chat', 'Notifications for staff and an admin panel', 'Telegram Mini Apps'],
      parseList: ['Companies and contacts from maps and registries', 'Price and listing monitoring on a schedule', 'Export to CSV, Google Sheets or your CRM', 'Only open data, respecting site rules'],
      caps: [
        ['Web apps & PWA', 'Client portals, dashboards and tools that install on a phone like a real app.', ['JavaScript', 'Node.js', 'PostgreSQL', 'PWA']],
        ['CRM & admin panels', 'Leads, pipelines, roles and analytics — built around how your team actually works.', ['Node.js', 'PostgreSQL', 'Charts', 'Roles']],
        ['Integrations', 'Payments, Google Sheets, email and SMS, amoCRM / Bitrix24 — your services connected and working together.', ['APIs', 'Webhooks', 'Payments', 'Email']],
      ],
      chat: [
        ['me', '/start'],
        ['bot', 'Hi! I’m the LUMA booking bot. What would you like to do?'],
        ['kb', ['Book a visit', 'Prices', 'Address'], 0],
        ['me', 'Book a visit'],
        ['bot', 'Free slots tomorrow:'],
        ['kb', ['9:00', '11:30', '15:00'], 1],
        ['me', '11:30'],
        ['bot', 'Done ✅ Tomorrow at 11:30 with Dr.\u00a0Lebedeva. I’ll remind you 2\u00a0hours\u00a0before.'],
      ],
      stats: [['267', 'companies found', 1], ['143', 'emails collected', 3], ['47', 'A–B leads', 8]],
      term: [
        ['cmd', 'parser run --niche "dentist" --city "Manchester, UK"'],
        ['out', '<span class="dim">→</span> OpenStreetMap + Overture … <span class="hl">267</span> companies found'],
        ['out', '<span class="dim">→</span> Visiting company websites (robots.txt respected) …'],
        ['out', '<span class="ok">✓</span> emails <span class="hl">143</span> · phones <span class="hl">231</span> · socials <span class="hl">188</span>'],
        ['out', '<span class="ok">✓</span> decision makers <span class="hl">41</span> (Companies House\u00a0+\u00a0websites)'],
        ['out', '<span class="ok">✓</span> duplicates removed: <span class="hl">26</span>'],
        ['out', '<span class="dim">→</span> lead score: A <span class="hl">9</span> · B <span class="hl">38</span> · C <span class="hl">112</span> · D <span class="hl">82</span>'],
        ['cmd', 'parser export --format csv --min-grade B'],
        ['out', '<span class="ok">✓</span> leads.csv · <span class="hl">47</span> rows · ready for\u00a0CRM'],
        ['cmd', 'head -n 4 leads.csv'],
        ['out', '<span class="dim">grade,company,city,email</span>'],
        ['out', '<span class="ga">A</span>,Brightwell Dental Co,Manchester,hello@…'],
        ['out', '<span class="ga">A</span>,Northquay Dental,Salford,office@…'],
        ['out', '<span class="gb">B</span>,Juniper Lane Smiles,Stockport,care@…'],
      ],
    },
    ru: {
      tgList: ['Запись со свободными окнами и напоминаниями', 'Заказы и оплата прямо в чате', 'Уведомления сотрудникам и админ-панель', 'Telegram Mini Apps'],
      parseList: ['Компании и контакты из карт и реестров', 'Мониторинг цен и объявлений по расписанию', 'Выгрузка в CSV, Google Таблицы или вашу CRM', 'Только открытые данные, с соблюдением правил сайтов'],
      caps: [
        ['Веб-приложения и PWA', 'Личные кабинеты, дашборды и инструменты, которые ставятся на телефон как настоящее приложение.', ['JavaScript', 'Node.js', 'PostgreSQL', 'PWA']],
        ['CRM и админ-панели', 'Заявки, воронки, роли и аналитика — под то, как реально работает ваша команда.', ['Node.js', 'PostgreSQL', 'Графики', 'Роли']],
        ['Интеграции', 'Оплата, Google Таблицы, email и SMS, amoCRM / Битрикс24 — ваши сервисы связаны и работают вместе.', ['API', 'Вебхуки', 'Оплата', 'Email']],
      ],
      chat: [
        ['me', '/start'],
        ['bot', 'Здравствуйте! Я бот записи LUMA. Что хотите сделать?'],
        ['kb', ['Записаться', 'Цены', 'Адрес'], 0],
        ['me', 'Записаться'],
        ['bot', 'Свободные окна на завтра:'],
        ['kb', ['9:00', '11:30', '15:00'], 1],
        ['me', '11:30'],
        ['bot', 'Готово ✅ Завтра в 11:30, врач Мария Лебедева. Напомню за\u00a02\u00a0часа.'],
      ],
      stats: [['312', 'компаний найдено', 1], ['158', 'email собрано', 3], ['66', 'лидов A–B', 8]],
      term: [
        ['cmd', 'parser run --niche "стоматология" --city "Казань"'],
        ['out', '<span class="dim">→</span> OpenStreetMap + Overture … найдено <span class="hl">312</span> компаний'],
        ['out', '<span class="dim">→</span> Обходим сайты компаний (с учётом robots.txt) …'],
        ['out', '<span class="ok">✓</span> email <span class="hl">158</span> · телефоны <span class="hl">279</span> · соцсети <span class="hl">201</span>'],
        ['out', '<span class="ok">✓</span> ЛПР <span class="hl">117</span> (ЕГРЮЛ\u00a0+\u00a0сайты)'],
        ['out', '<span class="ok">✓</span> удалено дублей: <span class="hl">31</span>'],
        ['out', '<span class="dim">→</span> скоринг: A <span class="hl">14</span> · B <span class="hl">52</span> · C <span class="hl">130</span> · D <span class="hl">85</span>'],
        ['cmd', 'parser export --format csv --min-grade B'],
        ['out', '<span class="ok">✓</span> leads.csv · <span class="hl">66</span> строк · готово для\u00a0CRM'],
        ['cmd', 'head -n 4 leads.csv'],
        ['out', '<span class="dim">grade,company,city,email</span>'],
        ['out', '<span class="ga">A</span>,«Дента Профи»,Казань,info@…'],
        ['out', '<span class="ga">A</span>,«Новая улыбка»,Казань,clinic@…'],
        ['out', '<span class="gb">B</span>,«Стома Центр»,Казань,mail@…'],
      ],
    },
  };
  const CAP_ICONS = [
    '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 18h4"/>',
    '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    '<path d="M8 12h8M12 8v8"/><circle cx="12" cy="12" r="9"/>',
  ];
  const ICON = {
    desktop: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/></svg>',
    mobile: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/></svg>',
    open: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    tap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-.5a1.5 1.5 0 0 1 3 0v1.5m0-1a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-.6a6 6 0 0 1-4.6-2.2l-2.7-3.3a1.6 1.6 0 0 1 2.4-2.1L9 14"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.6 2.6L16 9.7"/></svg>',
    // статус-бар телефона: сеть, Wi-Fi, батарея
    sbar: '<svg viewBox="0 0 18 12" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx=".8"/><rect x="5" y="5.5" width="3" height="6.5" rx=".8"/><rect x="10" y="3" width="3" height="9" rx=".8"/><rect x="15" y="0" width="3" height="12" rx=".8"/></svg>'
      + '<svg viewBox="0 0 16 12" aria-hidden="true"><path d="M8 12 5.5 9.4a3.5 3.5 0 0 1 5 0z"/><path d="M8 4.6c2.2 0 4.2.9 5.6 2.3L12 8.5a5.7 5.7 0 0 0-8 0L2.4 6.9A7.9 7.9 0 0 1 8 4.6z"/><path d="M8 0c3.2 0 6.1 1.2 8 3.2l-1.6 1.6A9.9 9.9 0 0 0 8 2.3a9.9 9.9 0 0 0-6.4 2.5L0 3.2C1.9 1.2 4.8 0 8 0z"/></svg>'
      + '<svg viewBox="0 0 27 12" aria-hidden="true"><rect x=".6" y=".6" width="22.8" height="10.8" rx="3.2" fill="none" stroke="currentColor" stroke-width="1.1" opacity=".45"/><rect x="2.3" y="2.3" width="17.5" height="7.4" rx="1.8"/><rect x="24.6" y="4" width="1.8" height="4" rx=".9" opacity=".45"/></svg>',
  };

  // ── Состояние ──────────────────────────────────────────
  let lang = store.get('eg-lang') || ((navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'en');
  if (!T[lang]) lang = 'en';
  const t = (k) => T[lang][k] ?? T.en[k] ?? k;
  const fromHash = () => {
    const m = location.hash.match(/^#work-([a-z]+)$/);
    return m && byId(m[1]) ? m[1] : null;
  };
  const initial = fromHash();
  let active = initial || WORK[0].id;
  let previewMode = window.innerWidth < 700 ? 'mobile' : 'desktop';
  let workNear = false; // витрина близко к экрану — можно грузить iframe
  let frameTimer = 0;
  const stages = {}; // id → { el, screen, frame }

  const shot = (id, mode) => `assets/shots/${id}-${mode}-${lang}.jpg`;
  // Видео-превью (WebM VP8, 5 с, бесшовная петля): только если браузер их играет (Safari 17.4+, Chrome, Firefox),
  // без «уменьшения движения» и без экономии трафика — иначе остаётся JPG-постер
  const vidOk = (() => {
    if (reduceMotion) return false;
    const c = navigator.connection;
    if (c && c.saveData) return false;
    try { const v = document.createElement('video'); return !!(v.canPlayType && v.canPlayType('video/webm; codecs="vp8"')); } catch { return false; }
  })();
  const vidSrc = (id, mode) => `assets/video/${id}-${mode}${lang === 'ru' ? '-ru' : ''}.webm`;
  const VID_ATTR = 'muted playsinline loop preload="none" disablepictureinpicture disableremoteplayback aria-hidden="true" tabindex="-1"';
  const syncDemoLang = () => DEMO_KEYS.forEach((k) => store.set(k, lang));

  const hdr = $('[data-hdr]');
  const tabsWrap = $('[data-tabs-wrap]');
  const tabsEl = $('[data-tabs]');
  const panelsEl = $('[data-panels]');
  const live = $('[data-live]');

  // ── Сборка вкладок и панелей (один раз) ────────────────
  function buildShowcase() {
    tabsEl.innerHTML = WORK.map((w) => `
      <button class="tab" type="button" role="tab" id="tab-${w.id}" aria-controls="panel-${w.id}" aria-selected="false" tabindex="-1" data-tab="${w.id}">
        <span class="tab__name"></span><span class="tab__sub"></span>
      </button>`).join('') + '<span class="tabs__bar" aria-hidden="true"></span>';

    panelsEl.innerHTML = WORK.map((w) => `
      <section class="panel" role="tabpanel" id="panel-${w.id}" aria-labelledby="tab-${w.id}" tabindex="0" data-panel="${w.id}" hidden>
        <div class="info" data-info></div>
        ${stageMarkup(w)}
        ${w.kind === 'bots' ? '<div class="caps" data-caps></div>' : ''}
      </section>`).join('');

    WORK.forEach((w) => {
      const el = $(`#panel-${w.id} .stage`);
      stages[w.id] = { el, screen: $('.device__screen', el), frame: null };
    });
    // Мышь: подсказка «Нажмите, чтобы управлять» возвращается, когда курсор уходит с рамки
    $$('.stage--site .device', panelsEl).forEach((d) => d.addEventListener('pointerleave', (e) => {
      if (e.pointerType === 'mouse') setInteractive(d.closest('.stage'), false);
    }));
    placeInfo();
  }
  // Демо в рамке недоступно с клавиатуры (inert), пока не нажата «Нажмите, чтобы управлять»:
  // иначе Tab уходит в iframe и проходит десятки ссылок уменьшенного сайта
  // Клавиатура: фокус вернулся на страницу вне демо (Shift+Tab / Tab из iframe) — снова закрываем демо щитом
  document.addEventListener('focusin', (e) => {
    $$('.stage--site.is-interactive').forEach((stEl) => { if (!$('.device', stEl).contains(e.target)) setInteractive(stEl, false); });
  });
  function setInteractive(stEl, on) {
    stEl.classList.toggle('is-interactive', on);
    const f = $('iframe', stEl);
    if (f) f.inert = !on;
  }
  // ≤ 1180 сцена стоит над описанием — переносим описание после сцены, чтобы порядок Tab совпадал с экраном.
  // Двигаем именно описание: перенос самой сцены перезагрузил бы iframe.
  const stackedMq = window.matchMedia('(max-width: 1180px)');
  function placeInfo() {
    $$('.panel', panelsEl).forEach((p) => {
      const info = $('[data-info]', p);
      const stage = $('.stage', p);
      if (stackedMq.matches) { if (info.previousElementSibling !== stage) stage.after(info); }
      else if (stage.previousElementSibling !== info) stage.before(info);
    });
  }
  stackedMq.addEventListener('change', placeInfo);

  function stageMarkup(w) {
    const crops = '<i class="crop crop--tl"></i><i class="crop crop--tr"></i><i class="crop crop--bl"></i><i class="crop crop--br"></i><i class="ring" aria-hidden="true"></i>';
    const narrow = (key) => `<span class="stage__narrow"><b data-name></b> · <span data-t="${key}"></span></span>`;
    if (w.kind === 'site') {
      return `<div class="stage stage--site" data-mode="${previewMode}" style="--sbg:${w.sb[0]};--sfg:${w.sb[1]}">
        <div class="stage__bar">
          <span class="stage__live"><i aria-hidden="true"></i><span class="stage__wide" data-t="stage.live"></span>${narrow('stage.conceptLive')}</span>
          <button class="bd-btn" type="button" aria-pressed="false" data-bd><i aria-hidden="true"></i><span class="bd-btn__l" data-t="bd.show"></span><span class="bd-btn__s" aria-hidden="true" data-t="bd.short"></span></button>
          <div class="seg" role="group" data-t-label="stage.size">
            <button type="button" data-mode="desktop" aria-pressed="${previewMode === 'desktop'}">${ICON.desktop}<span data-t="stage.desktop"></span></button>
            <button type="button" data-mode="mobile" aria-pressed="${previewMode === 'mobile'}">${ICON.mobile}<span data-t="stage.mobile"></span></button>
          </div>
          <a class="stage__open" href="${w.url}" target="_blank" rel="noopener" data-t-label="stage.openLabel">${ICON.open}</a>
        </div>
        <div class="floor">${crops}
          <div class="device">
            <div class="device__chrome" aria-hidden="true"><i></i><i></i><i></i><span class="device__url">${w.host}</span></div>
            <div class="device__screen">
              <div class="device__sbar" aria-hidden="true"><span>9:41</span><span>${ICON.sbar}</span></div>
              <img class="device__poster" alt="" decoding="async">${vidOk ? `<video class="device__vid" ${VID_ATTR}></video>` : ''}
              <span class="device__load" aria-hidden="true"></span>
              <span class="device__pill" aria-hidden="true"><i></i><span data-t="stage.loading"></span></span>
              <button class="device__shield" type="button"><span class="device__hint">${ICON.tap}<span data-t="${coarse ? 'stage.tap' : 'stage.interact'}"></span></span></button>
              <span class="device__veil" aria-hidden="true"></span>
              <div class="bd" aria-hidden="true" data-bd-host></div>
            </div>
          </div>
        </div>
        <p class="stage__hint"><span data-t="${coarse ? 'stage.hintTouch' : 'stage.hint'}"></span><span data-t="stage.real"></span></p>
      </div>`;
    }
    if (w.kind === 'product') {
      return `<div class="stage stage--shots">
        <div class="stage__bar"><span class="stage__live">${ICON.lock}<span class="stage__wide" data-t="stage.shots"></span>${narrow('stage.shotsNarrow')}</span>
          <button class="bd-btn" type="button" aria-pressed="false" data-bd><i aria-hidden="true"></i><span class="bd-btn__l" data-t="bd.show"></span><span class="bd-btn__s" aria-hidden="true" data-t="bd.short"></span></button></div>
        <div class="floor">${crops}
          <div class="comp">
            <figure class="device">
              <div class="device__chrome" aria-hidden="true"><i></i><i></i><i></i><span class="device__url">${w.host}</span></div>
              <img src="assets/shots/crm-desktop.jpg" width="1280" height="800" loading="lazy" decoding="async" data-alt="desktop">
            </figure>
            <figure class="comp__phone"><img src="assets/shots/crm-mobile.jpg" width="780" height="1688" loading="lazy" decoding="async" data-alt="mobile"></figure>
            <div class="bd" aria-hidden="true" data-bd-host></div>
          </div>
        </div>
        <p class="stage__hint"><span data-t="stage.shotsNote"></span></p>
      </div>`;
    }
    return `<div class="stage stage--bots">
      <div class="stage__bar"><span class="stage__live"><i aria-hidden="true"></i><span class="stage__wide" data-t="stage.bots"></span>${narrow('stage.botsNarrow')}</span></div>
      <div class="floor">${crops}
        <div class="bots" aria-hidden="true">
          <div class="tg">
            <div class="tg__head"><span class="tg__ava">L</span><div><b data-t="bots.name"></b><small data-t="bots.status"></small></div></div>
            <div class="tg__body" data-chat></div>
          </div>
          <div class="bots__right">
            <div class="term">
              <div class="term__bar"><i></i><i></i><i></i><span>leads — parser</span></div>
              <pre class="term__body" data-term></pre>
            </div>
            <div class="stats" data-stats></div>
          </div>
        </div>
      </div>
      <p class="stage__hint"><span data-t="stage.botsNote"></span></p>
    </div>`;
  }

  // Постер-скриншот грузим только у активной вкладки; остальные — в простое (requestIdleCallback)
  function setPoster(w, force) {
    const st = stages[w.id];
    const poster = $('.device__poster', st.el);
    const mode = st.el.dataset.mode;
    const src = shot(w.id, mode);
    poster.dataset.src = src;
    poster.alt = `${w[lang].name} — ${t(mode === 'mobile' ? 'stage.mobile' : 'stage.desktop')}`;
    if (force || poster.getAttribute('src')) { if (poster.getAttribute('src') !== src) poster.src = src; }
  }

  // Тексты панелей — перерисовываются при смене языка; сцена (и iframe) остаются на месте
  function fillShowcase() {
    WORK.forEach((w, i) => {
      const d = w[lang];
      const tab = $(`#tab-${w.id}`);
      $('.tab__name', tab).textContent = d.tab;
      $('.tab__sub', tab).textContent = d.line;

      const panel = $(`#panel-${w.id}`);
      const badge = w.kind === 'site' ? ['', t('case.concept')] : w.kind === 'product' ? ['badge--real', t('case.real')] : ['badge--cap', t('case.cap')];
      const count = `0${i + 1} / 0${WORK.length}`;
      let body = '';
      if (w.kind === 'bots') {
        const A = APPS[lang];
        body = `<p class="info__label">${esc(t('bots.tg'))}</p><ul class="feats">${A.tgList.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
          <p class="info__label">${esc(t('bots.parse'))}</p><ul class="feats">${A.parseList.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
          <div class="info__actions"><a class="pill" href="#contact"><span>${esc(t('case.discuss'))}</span><span class="arr" aria-hidden="true">→</span></a></div>`;
      } else {
        const actions = w.kind === 'site'
          ? `<a class="pill" href="${w.url}" target="_blank" rel="noopener">${esc(t('stage.open'))}</a><a class="pill pill--line" href="#contact">${esc(t('case.similar'))}</a>`
          : `<a class="pill" href="#contact"><span>${esc(t('case.ask'))}</span><span class="arr" aria-hidden="true">→</span></a>`;
        body = `<p class="info__label">${esc(t('case.feats'))}</p>
          <ul class="feats">${d.feats.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
          <p class="info__label">${esc(t('case.stack'))}</p>
          <div class="chips">${w.chips.map((x) => `<span>${esc(chipT(x))}</span>`).join('')}</div>
          <div class="info__actions">${actions}</div>
          ${w.kind === 'product' ? `<p class="info__note">${esc(t('case.private'))}</p>` : ''}`;
      }
      $('[data-info]', panel).innerHTML = `
        <div class="info__head" style="--i:0">
          <div class="info__top"><span class="badge ${badge[0]}"><i aria-hidden="true"></i>${esc(badge[1])}</span><span class="info__count">${count}</span></div>
          <h3 class="info__name">${esc(d.name)}</h3>
          <p class="info__tag">${esc(d.tag)}</p>
          <p class="info__desc">${esc(d.desc)}</p>
        </div>
        <div class="info__body" style="--i:2">${body}</div>`;

            $$('[data-t]', panel).forEach((el) => { el.textContent = t(el.dataset.t); });
      $$('[data-t-label]', panel).forEach((el) => { el.setAttribute('aria-label', t(el.dataset.tLabel)); });
      $$('[data-name]', panel).forEach((el) => { el.textContent = d.tab; });
      $$('[data-alt]', panel).forEach((img) => { img.alt = `${d.name} — ${img.dataset.alt === 'desktop' ? (lang === 'ru' ? 'дашборд на компьютере' : 'dashboard, desktop') : (lang === 'ru' ? 'канбан на телефоне' : 'kanban, mobile')} (${lang === 'ru' ? 'демо-данные' : 'demo data'})`; });

      if (w.kind === 'site') {
        setPoster(w, w.id === active && workNear);
        const st = stages[w.id];
        if (st.frame) st.frame.title = `${d.name} — ${t('stage.live')}`;
      }
      if (w.kind === 'bots') {
        $('[data-stats]', panel).innerHTML = APPS[lang].stats.map(([n, l]) => `<div><b>${esc(n)}</b><span>${esc(l)}</span></div>`).join('');
        $('[data-caps]', panel).innerHTML = APPS[lang].caps.map(([h, p, chips], k) => `
          <article class="cap"><div class="cap__top"><span>0${k + 1}</span><svg viewBox="0 0 24 24" aria-hidden="true">${CAP_ICONS[k]}</svg></div>
          <h3>${esc(h)}</h3><p>${esc(p)}</p><div class="chips">${chips.map((x) => `<span>${esc(x)}</span>`).join('')}</div></article>`).join('');
      }
    });
    tabsEl.setAttribute('aria-label', t('work.tabs'));
  }

  // ── Размер превью: iframe 1440×900 или 390×844 (+ статус-бар), масштабированный под рамку ──
  const SB = 44; // высота статус-бара телефона в «виртуальных» пикселях
  const docTop = (el) => { let y = 0; while (el) { y += el.offsetTop; el = el.offsetParent; } return y; };
  const cssNum = (name) => parseFloat(getComputedStyle(root).getPropertyValue(name)) || 0;
  // Какая высота экрана устройства помещается в окно:
  //  > 1180 — вкладки + вся рамка в одном экране (после перехода по ссылке ряд вкладок прямо под шапкой);
  //  861–1180 — сцена во всю ширину над описанием, в окно помещается сама сцена;
  //  ≤ 860 — телефон целиком под липкой лентой вкладок, «компьютер» — по ширине.
  function maxScreenH(st) {
    const vw = window.innerWidth;
    const mobile = st.el.dataset.mode === 'mobile';
    const floor = $('.floor', st.el);
    const cs = getComputedStyle(floor);
    const padT = parseFloat(cs.paddingTop), padB = parseFloat(cs.paddingBottom);
    const hdrH = hdr.offsetHeight;
    let refTop, inset;
    if (vw > 1180) { refTop = docTop(tabsWrap); inset = hdrH + cssNum('--tab-gap'); }
    else if (vw > 860) { refTop = docTop(st.el); inset = hdrH + 12; }
    else {
      if (!mobile) return Infinity;
      refTop = docTop(floor); inset = hdrH + tabsWrap.offsetHeight + 10;
    }
    const above = docTop(floor) - refTop + padT + (mobile ? 9 : 34);
    return window.innerHeight - inset - above - padB - (mobile ? 9 : 0) - 10;
  }
  function layoutStage(id) {
    const w = byId(id);
    if (!w || w.kind !== 'site') return;
    const st = stages[id];
    const floor = $('.floor', st.el);
    const cs = getComputedStyle(floor);
    const availW = floor.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    if (availW <= 0) return;
    const device = $('.device', st.el);
    const maxH = maxScreenH(st);
    let W = 1440, H = 900, sb = 0, s;
    if (st.el.dataset.mode === 'desktop') {
      s = Math.min((availW - 0.5) / W, Math.max(maxH, 260) / H);
    } else {
      W = 390; H = 844; sb = SB;
      s = Math.min((availW - 18) / W, Math.max(maxH, 380) / (H + sb), 0.82);
    }
    device.style.setProperty('--w', W);
    device.style.setProperty('--h', H);
    device.style.setProperty('--sb', sb);
    device.style.setProperty('--s', s.toFixed(4));
  }

  // ── Живой iframe: только у активной вкладки, только когда витрина рядом ──
  // Скрываем полосы прокрутки внутри уменьшенного демо (тот же origin — можно добавить стиль)
  function hideScrollbars(f) {
    try {
      const d = f.contentDocument;
      if (!d || d.getElementById('eg-noscroll')) return;
      const s = d.createElement('style');
      s.id = 'eg-noscroll';
      s.textContent = 'html{scrollbar-width:none}html::-webkit-scrollbar,body::-webkit-scrollbar{display:none;width:0;height:0}';
      (d.head || d.documentElement).appendChild(s);
    } catch { /* другой origin — пропускаем */ }
  }
  // Видео в рамке: показываем, только если живой сайт грузится дольше ~0,45 с (быстрая сеть — видео не качаем вовсе)
  let vidTimer = 0;
  function stageVid(id, on) {
    const st = stages[id];
    const v = st && $('.device__vid', st.el);
    if (!v) return;
    if (on) {
      const mode = st.el.dataset.mode;
      const src = vidSrc(id, mode);
      if (v.getAttribute('src') !== src) {
        st.el.classList.remove('has-vid');
        v.src = src;
        v.onplaying = () => { if (v.getAttribute('src') === src && !st.el.classList.contains('is-loaded')) st.el.classList.add('has-vid'); };
      }
      v.muted = true;
      if (st.vis !== false) { const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); }
    } else {
      st.el.classList.remove('has-vid');
      if (v.getAttribute('src')) { v.pause(); v.removeAttribute('src'); try { v.load(); } catch { /* ignore */ } }
    }
  }
  function armStageVid(id) {
    clearTimeout(vidTimer);
    if (!vidOk) return;
    vidTimer = setTimeout(() => {
      const st = stages[id];
      if (id === active && st && !st.el.classList.contains('is-loaded')) stageVid(id, true);
    }, 450);
  }
  // Небольшая задержка: при быстром листании вкладок стрелками не грузим каждое демо
  function queueFrame(id) {
    clearTimeout(frameTimer);
    const w = byId(id);
    if (!w || w.kind !== 'site' || !workNear) return;
    const st = stages[id];
    if (st.frame) return;
    st.el.classList.remove('is-loaded');
    st.el.classList.add('is-loading');
    frameTimer = setTimeout(() => loadFrame(id), 140);
    armStageVid(id);
  }
  function loadFrame(id) {
    const w = byId(id);
    if (id !== active || !w || w.kind !== 'site') return;
    const st = stages[id];
    if (st.frame) return;
    syncDemoLang(); // демо откроется на языке портфолио
    const f = document.createElement('iframe');
    f.title = `${w[lang].name} — ${t('stage.live')}`;
    f.setAttribute('loading', 'eager');
    f.setAttribute('allow', 'clipboard-write');
    f.inert = !st.el.classList.contains('is-interactive');
    const done = () => {
      if (st.frame !== f || st.el.classList.contains('is-loaded')) return;
      hideScrollbars(f);
      keepHashInFrame(f);
      st.el.classList.add('is-loaded');
      st.el.classList.remove('is-loading');
      setTimeout(() => { if (st.el.classList.contains('is-loaded')) stageVid(id, false); }, 700); // после растворения
      prefetchPosters();
      // «Детали»: выноски следуют за прокруткой демо; после загрузки — первая отрисовка (шрифты демо успевают встать)
      try { f.contentWindow.addEventListener('scroll', () => { if (active === id) bdQueue(id); }, { passive: true }); } catch { /* другой origin */ }
      if (bdOn && active === id) { bdRender(id, true); bdSettle(id); }
      // переходы и анимации внутри демо (появление, раскрытие) — тоже повод переложить выноски; не чаще раза в 250 мс
      try {
        let tt = 0;
        const re = () => { if (!bdOn || active !== id) return; clearTimeout(tt); tt = setTimeout(() => bdQueue(id), 250); };
        f.contentDocument.addEventListener('transitionend', re, { passive: true });
        f.contentDocument.addEventListener('animationend', re, { passive: true });
      } catch { /* другой origin */ }
    };
    f.addEventListener('load', done);
    // Если внешние картинки демо грузятся долго и load не приходит — всё равно показываем живой сайт
    setTimeout(done, 9000);
    st.el.classList.remove('is-loaded');
    st.el.classList.add('is-loading');
    f.src = w.url;
    st.screen.appendChild(f); // после «щита» в порядке Tab; слой задаёт z-index, а не порядок
    st.frame = f;
  }
  function unloadFrame(id) {
    const st = stages[id];
    if (!st) return;
    if (st.frame) { st.frame.remove(); st.frame = null; }
    stageVid(id, false);
    const bh = st.el && $('[data-bd-host]', st.el);
    if (bh) { bh.innerHTML = ''; bh.classList.remove('is-in'); }
    st.el?.classList.remove('is-loaded', 'is-loading', 'is-interactive');
  }
  // Ссылки «#раздел» внутри демо: прокручиваем только сам iframe — без прокрутки портфолио и без записей в истории
  function keepHashInFrame(f) {
    try {
      const w = f.contentWindow;
      const d = f.contentDocument;
      if (!d || d.documentElement.dataset.egHash) return;
      d.documentElement.dataset.egHash = '1';
      d.addEventListener('click', (e) => {
        const a = e.target.closest?.('a[href^="#"]');
        if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
        const id = decodeURIComponent(a.getAttribute('href').slice(1));
        const el = id ? d.getElementById(id) : null;
        if (id && !el) return;
        e.preventDefault();
        const pad = parseFloat(w.getComputedStyle(d.documentElement).scrollPaddingTop) || 0;
        const top = el ? el.getBoundingClientRect().top + w.scrollY - pad - (parseFloat(w.getComputedStyle(el).scrollMarginTop) || 0) : 0;
        w.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    } catch { /* другой origin — пропускаем */ }
  }
  let prefetched = false;
  function prefetchPosters() {
    if (prefetched) return;
    const c = navigator.connection;
    if (c && (c.saveData || (c.effectiveType && c.effectiveType !== '4g'))) return; // экономия трафика — постеры грузим по наведению
    prefetched = true;
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1200));
    idle(() => WORK.filter((w) => w.kind === 'site').forEach((w) => setPoster(w, true)));
  }

  function setMode(mode) {
    if (mode === previewMode) return;
    previewMode = mode;
    const apply = () => {
      WORK.filter((w) => w.kind === 'site').forEach((w) => {
        const st = stages[w.id];
        st.el.dataset.mode = mode;
        $$('.seg button', st.el).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
        setPoster(w, w.id === active && workNear);
      });
      if (stages[active] && $('.device__vid', stages[active].el)?.getAttribute('src')) stageVid(active, true);
      layoutStage(active);
      if (bdOn) setTimeout(() => bdRender(active, true), 720); // рамка доехала до нового размера (transition .6s), демо перестроилось
    };
    const cur = stages[active];
    if (reduceMotion || !cur || byId(active).kind !== 'site') { apply(); return; }
    // Короткая «вуаль»: прячем содержимое, меняем рамку, плавно показываем
    cur.el.classList.add('is-switching');
    setTimeout(() => {
      apply();
      setTimeout(() => cur.el.classList.remove('is-switching'), 420);
    }, 200);
  }

  // ── «Детали»: выноски над демо (точка → линия с изломом → подпись на плашке) ──
  // Точки ищем в самом демо (тот же origin): выноска всегда указывает на настоящий элемент — на любом языке,
  // в обоих режимах и после прокрутки демо. Слой не перехватывает мышь (pointer-events: none).
  let bdOn = false;
  let bdRafId = 0;
  const bdPick = (doc, sel, vw, vh) => {
    for (const el of doc.querySelectorAll(sel)) {
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1 || r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) continue;
      if (el.ownerDocument.defaultView.getComputedStyle(el).visibility === 'hidden') continue; // opacity не смотрим: у появляющихся блоков демо она ещё анимируется
      return r;
    }
    return null;
  };
  const bdNarrow = window.matchMedia('(max-width: 520px)');
  const hitR = (a, b, m) => a.x1 < b.x2 + m && a.x2 > b.x1 - m && a.y1 < b.y2 + m && a.y2 > b.y1 - m;
  function bdRender(id, animate) {
    const w = byId(id), st = stages[id];
    const host = st && $('[data-bd-host]', st.el);
    if (!host) return;
    const floor = $('.floor', st.el);
    if (!bdOn || !ANN[id]) { host.classList.remove('is-on', 'is-in'); host.innerHTML = ''; st.el.classList.remove('is-bd'); return; }
    st.el.classList.add('is-bd');
    const mode = w.kind === 'site' ? st.el.dataset.mode : 'desktop';
    // «Телефон» на широкой сцене: подписи выносим на поля сцены по бокам (классический чертёж),
    // на экране телефона остаются только точки и линии. Узкая сцена — подписи внутри экрана.
    const screen = w.kind === 'site' ? $('.device__screen', st.el) : null;
    let offX = 0, offY = 0, Ws = 0, Hs = 0, gut = false;
    if (screen) {
      Ws = screen.clientWidth; Hs = screen.clientHeight;
      if (mode === 'mobile') {
        const dev = screen.parentElement;
        offX = dev.offsetLeft + screen.offsetLeft; offY = dev.offsetTop + screen.offsetTop;
        gut = Math.min(offX, floor.clientWidth - offX - Ws) >= 200;
        if (!gut) offX = offY = 0; // подписи внутри экрана — координаты экрана
      }
    }
    const want = gut ? floor : (screen || host.parentElement);
    if (host.parentElement !== want) want.appendChild(host);
    host.classList.toggle('is-gut', gut);
    const box = host.parentElement; // .device__screen, .floor (поля) или .comp
    const W = box.clientWidth, H = box.clientHeight;
    if (!W || !H) return;
    const Wd = screen ? Ws : W, Hd = screen ? Hs : H; // масштаб смещений подписи — по экрану демо
    let list = ANN[id][mode] || ANN[id].desktop;
    if (w.kind === 'product' && W < 560) list = list.filter((_, i) => i !== 1);
    // маленькая рамка (телефон, режим «Компьютер»): не больше трёх выносок, мельче шрифт
    const small = !gut && W < 520;
    if (small && list.length > 3) list = list.slice(0, 3);
    host.classList.toggle('is-small', small);
    const pts = [];
    if (w.kind === 'site') {
      const f = st.frame;
      let doc = null, win = null;
      try { doc = f && st.el.classList.contains('is-loaded') ? f.contentDocument : null; win = f && f.contentWindow; } catch { doc = null; }
      if (doc && win) {
        const dev = $('.device', st.el);
        const sc = parseFloat(dev.style.getPropertyValue('--s')) || 0.5, sb = parseFloat(dev.style.getPropertyValue('--sb')) || 0;
        list.forEach((a, i) => {
          const r = bdPick(doc, a.sel, win.innerWidth, win.innerHeight);
          if (r) pts.push({ a, i, x: offX + (r.left + r.width * a.at[0]) * sc, y: offY + (sb + r.top + r.height * a.at[1]) * sc });
        });
      }
    } else {
      const hr = box.getBoundingClientRect();
      list.forEach((a, i) => {
        const el = $(a.sel, box);
        if (!el) return;
        const r = el.getBoundingClientRect();
        pts.push({ a, i, x: r.left - hr.left + r.width * a.at[0], y: r.top - hr.top + r.height * a.at[1] });
      });
    }
    // Штамп «адаптив · EN/RU»: на телефоне — под рамкой, в строке подсказки (на рамке он закрывал адрес)
    let tg = $('.bd-tag', st.el);
    if (!tg) { tg = document.createElement('span'); tg.className = 'bd-tag'; tg.setAttribute('aria-hidden', 'true'); }
    const tgHome = bdNarrow.matches ? $('.stage__hint', st.el) : floor;
    if (tg.parentElement !== tgHome) tgHome.appendChild(tg);
    tg.classList.toggle('bd-tag--hint', bdNarrow.matches);
    tg.textContent = t(w.kind === 'site' ? (bdNarrow.matches ? 'bd.tagShort' : 'bd.tag') : 'bd.tagCrm');
    host.classList.add('is-on'); // до замеров: скрытый слой (display: none) дал бы нулевые размеры плашек
    const gw = gut ? Math.min(300, Math.min(offX, W - offX - Ws) - 30) : 0;
    host.style.setProperty('--gw', gut ? `${gw}px` : '');
    const veil = gut ? ` style="left:${offX}px;top:${offY}px;width:${Ws}px;height:${Hs}px;right:auto;bottom:auto;border-radius:37px"` : '';
    host.innerHTML = `<i class="bd__veil"${veil}></i>${pts.map((p, k) => `<div class="bd__it" style="--k:${k}"><i class="bd__v"></i><i class="bd__h"></i><b class="bd__dot"></b><span class="bd__chip"><em>${String(p.i + 1).padStart(2, '0')}</em>${esc(p.a[lang])}</span></div>`).join('')}`;
    const its = $$('.bd__it', host);
    // размер плашки — по блоку раскладки (offset*): transform предка (въезд, смена режима) не сужает замер
    const sizes = its.map((it) => { const c = $('.bd__chip', it); return [c.offsetWidth + 1, c.offsetHeight]; });
    // Раскладка: подпись не ложится ни на другую подпись, ни на чужую (и свою) точку, ни на уже проведённые линии.
    // Порядок попыток: как задумано → зеркально по горизонтали → зеркально по вертикали → обе → сдвиг вниз.
    const dots = pts.map((p) => ({ x1: p.x - 7, x2: p.x + 7, y1: p.y - 7, y2: p.y + 7 }));
    const chips = [], lines = [];
    const gL = offX - 16, gR = offX + Ws + 16;
    const order = pts.map((p, k) => k).sort((a, b) => (pts[a].y + pts[a].a.d[1] * Hd) - (pts[b].y + pts[b].a.d[1] * Hd));
    const css = (el, o) => Object.assign(el.style, o);
    let shown = 0;
    order.forEach((k) => {
      const p = pts[k], it = its[k], [cw, ch] = sizes[k];
      const try1 = (sx, sy, push, strict) => {
        const left = sx < 0;
        let lx = gut ? (left ? gL : gR) : p.x + sx * Wd;
        let cx = left ? lx - cw : lx;
        cx = Math.max(6, Math.min(W - cw - 6, cx));
        let ly = p.y + sy * Hd + push;
        if (ly - ch / 2 < 6) { if (strict) return null; ly = ch / 2 + 6; } // зеркальный вариант не прижимаем к краю
        if (ly + ch / 2 > H - 4 || cw > W - 12) return null;
        lx = left ? cx + cw : cx;
        if (left ? lx > p.x : lx < p.x) lx = p.x; // плашку прижало к краю — линия не уходит за точку
        const c = { x1: cx, x2: cx + cw, y1: ly - ch / 2, y2: ly + ch / 2 };
        const v = { x1: p.x - 1, x2: p.x + 1, y1: Math.min(p.y, ly), y2: Math.max(p.y, ly) };
        const h = { x1: Math.min(p.x, lx), x2: Math.max(p.x, lx), y1: ly - 1, y2: ly + 1 };
        if (chips.some((r) => hitR(c, r, 5))) return null;
        if (dots.some((r) => hitR(c, r, 2))) return null; // включая свою точку
        if (lines.some((r) => hitR(c, r, 2))) return null;
        if (chips.some((r) => hitR(v, r, 2) || hitR(h, r, 2))) return null;
        if (dots.some((r, j) => j !== k && (hitR(v, r, 0) || hitR(h, r, 0)))) return null;
        return { c, v, h, lx, ly, cx };
      };
      const [d0, d1] = p.a.d;
      // длина выноски: как задумано, короче, длиннее (линия не должна пересекать уже стоящую подпись)
      let q = null;
      for (const m of [1, 0.55, 1.5, 0.3, 2]) { q = try1(d0, d1 * m, 0) || try1(-d0, d1 * m, 0); if (q || !d1) break; }
      if (!q && d1) q = try1(d0, -d1, 0, true) || try1(-d0, -d1, 0, true);
      for (let n = 1; !q && n <= 8; n++) q = try1(d0, d1, n * (ch + 6));
      if (!q) { it.hidden = true; return; } // места нет — выноску не показываем, но и не накладываем
      chips.push(q.c); lines.push(q.v, q.h); shown++;
      const { lx, ly, cx } = q;
      css($('.bd__dot', it), { left: `${p.x}px`, top: `${p.y}px` });
      css($('.bd__v', it), { left: `${p.x}px`, top: `${Math.min(p.y, ly)}px`, height: `${Math.abs(ly - p.y)}px`, transformOrigin: ly >= p.y ? '50% 0' : '50% 100%' });
      css($('.bd__h', it), { top: `${ly}px`, left: `${Math.min(p.x, lx)}px`, width: `${Math.abs(lx - p.x)}px`, transformOrigin: lx >= p.x ? '0 50%' : '100% 50%' });
      css($('.bd__chip', it), { left: `${cx}px`, top: `${ly - ch / 2}px`, width: `${cw}px` }); // ширина фиксирована: у края плашка не переносится заново
    });
    host.classList.add('is-on');
    host.classList.toggle('no-anim', !animate || reduceMotion);
    if (animate && !reduceMotion) { host.classList.remove('is-in'); void host.offsetWidth; }
    host.classList.add('is-in');
    // Для чтения с экрана: что показано (слой выносок — aria-hidden, текст тот же)
    st.bdText = order.filter((k) => !its[k].hidden).map((k) => `${String(pts[k].i + 1).padStart(2, '0')} ${pts[k].a[lang]}`).join('; ');
  }
  const bdQueue = (id = active) => {
    if (!bdOn) return;
    cancelAnimationFrame(bdRafId);
    bdRafId = requestAnimationFrame(() => bdRender(id, false));
  };
  // Демо ещё доигрывает своё появление (заголовки и кнопки въезжают) — перекладываем выноски, когда оно встанет
  let bdSettleT = [];
  const bdSettle = (id) => { bdSettleT.forEach(clearTimeout); bdSettleT = [700, 1800].map((ms) => setTimeout(() => bdQueue(id), ms)); };
  function bdSet(on) {
    bdOn = on;
    $$('[data-bd]').forEach((b) => b.setAttribute('aria-pressed', String(on)));
    WORK.forEach((w) => { if (w.id !== active) bdRender(w.id, false); });
    bdRender(active, true);
    if (on) bdSettle(active);
    const st = stages[active];
    live.textContent = on ? (st && st.bdText ? `${t('bd.short')}: ${st.bdText}` : t('bd.short')) : '';
  }

  // ── Вкладки ────────────────────────────────────────────
  function moveBar() {
    const bar = $('.tabs__bar', tabsEl);
    const tab = $(`#tab-${active}`);
    if (!bar || !tab) return;
    bar.style.width = `${tab.offsetWidth}px`;
    bar.style.transform = `translate(${tab.offsetLeft}px, ${tab.offsetTop}px)`; // вкладки бывают в две строки
  }
  function centerChip(smooth) {
    const tab = $(`#tab-${active}`);
    if (!tab || tabsEl.scrollWidth <= tabsEl.clientWidth) return;
    const left = tab.offsetLeft - (tabsEl.clientWidth - tab.offsetWidth) / 2;
    tabsEl.scrollTo({ left: Math.max(0, left), behavior: smooth && !reduceMotion ? 'smooth' : 'auto' });
  }
  // «Смотреть работы», «Работы» в меню и ссылка-пропуск ведут к ряду вкладок (якорь активной вкладки)
  const syncWorkLinks = () => $$('[data-to-work]').forEach((a) => a.setAttribute('href', `#work-${active}`));

  // ── Открытие кейса: превью раскрывается из тонкой щели (clip-path на подиуме, CSS), имя проекта —
  //    огромными буквами поперёк панели, затем садится в заголовок (FLIP: только transform/opacity).
  //    Быстрое переключение — всё прерывается и возвращается в покой. Телефон: только щель.
  const cineLite = window.matchMedia('(pointer: coarse), (max-width: 860px)');
  let cineS = null;
  function cineStop() {
    if (!cineS) return;
    cineS.timers.forEach(clearTimeout);
    cineS.anims.forEach((a) => { try { a.cancel(); } catch { /* ignore */ } });
    cineS.ov.remove();
    cineS = null;
  }
  function cine(id) {
    cineStop();
    if (reduceMotion || cineLite.matches || !Element.prototype.animate) return;
    const panel = $(`#panel-${id}`);
    const floor = panel && $('.floor', panel);
    const name = panel && $('.info__name', panel);
    if (!floor || !name) return;
    const fr = floor.getBoundingClientRect();
    if (fr.bottom < 80 || fr.top > window.innerHeight - 80) return; // панель не на экране — без постановки
    const pr = panel.getBoundingClientRect();
    const ov = document.createElement('div');
    ov.className = 'cine';
    ov.setAttribute('aria-hidden', 'true');
    ov.innerHTML = [...name.textContent].map((c, i) => `<span class="cine__c"><span style="--i:${i}">${c === ' ' ? '\u00a0' : esc(c)}</span></span>`).join('');
    panel.appendChild(ov);
    const nr = name.getBoundingClientRect();
    const w0 = ov.offsetWidth || 1, h0 = ov.offsetHeight || 1;
    // титр ставится по подиуму (сцене), а не по всей панели — не наезжает на колонку описания
    const S = Math.max(1, Math.min((fr.width * 0.9) / w0, (fr.height * 0.42) / h0, 7));
    const bx = (fr.left - pr.left) + (fr.width - w0 * S) / 2, by = fr.top - pr.top + (fr.height - h0 * S) / 2;
    const big = `translate3d(${bx.toFixed(1)}px,${by.toFixed(1)}px,0) scale(${S.toFixed(3)})`;
    ov.style.transform = big;
    const wide = !stackedMq.matches;
    const st = { ov, name, timers: [], anims: [] };
    cineS = st;
    void ov.offsetWidth;
    ov.classList.add('is-in');
    // Вся постановка — сразу одной партитурой WAAPI (с задержкой), а не таймерами: если поток занят
    // загрузкой демо, перелёт и проявление заголовка всё равно идут вовремя (на композиторе)
    const n = name.textContent.length;
    const delay = 520 + n * 26, D = wide ? 720 : 480;
    const end = wide
      ? `translate3d(${(nr.left - pr.left).toFixed(1)}px,${(nr.top - pr.top).toFixed(1)}px,0) scale(1)`
      : `${big} translate3d(0,-8%,0) scale(1.06,.86)`;
    const a = ov.animate(wide
      ? [{ transform: big, opacity: 1 }, { transform: end, opacity: 1, offset: 0.92 }, { transform: end, opacity: 0 }]
      : [{ transform: big, opacity: 1 }, { transform: end, opacity: 0 }],
    { duration: D, delay, easing: wide ? 'cubic-bezier(.75,0,.2,1)' : 'cubic-bezier(.6,0,.4,1)', fill: 'both' });
    st.anims.push(a);
    if (wide) st.anims.push(name.animate([{ opacity: 0 }, { opacity: 0, offset: (delay + D * 0.9) / (delay + D) }, { opacity: 1 }], { duration: delay + D }));
    a.onfinish = () => { if (cineS === st) cineStop(); };
    st.timers.push(setTimeout(() => { if (cineS === st) cineStop(); }, delay + D + 1200)); // страховка
  }

  function activate(id, { focus = false, push = true, animate = true, user = false } = {}) {
    if (!byId(id)) id = WORK[0].id;
    const prev = active;
    active = id;
    cineStop();
    $$('.tab', tabsEl).forEach((b) => {
      const on = b.dataset.tab === id;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    $$('.panel', panelsEl).forEach((p) => {
      const on = p.dataset.panel === id;
      p.hidden = !on;
      p.classList.remove('is-entering');
      if (on && animate && !reduceMotion) { void p.offsetWidth; p.classList.add('is-entering'); }
    });
    if (prev !== id) { unloadFrame(prev); if (stages[prev]) bdRender(prev, false); }
    const w = byId(id);
    if (w.kind === 'site') setPoster(w, workNear);
    layoutStage(id);
    queueFrame(id);
    moveBar();
    centerChip(animate);
    if (id === 'bots') sizeBots();
    updateBotsVisibility();
    if (bdOn) bdRender(id, true);
    syncWorkLinks();
    // Адрес не меняем: иначе при обновлении / повторном заходе страница открывалась бы на вкладках, а не на первом экране
    if (push && location.hash) history.replaceState(null, '', location.pathname + location.search);
    if (focus) $(`#tab-${id}`).focus({ preventScroll: true });
    if (prev !== id) live.textContent = w[lang].name;
    if (user && prev !== id) keepTabsInView(id);
    if (prev !== id) {
      document.dispatchEvent(new CustomEvent('eg:tab', { detail: { id } }));
      if (animate) cine(id);
    }
  }
  // Переключение пользователем из глубины длинной панели: новая панель короче — без этого
  // страница «уезжает» в «Услуги»/«Процесс». Возвращаем ряд вкладок и верх новой панели на экран.
  function keepTabsInView(id) {
    const sticky = getComputedStyle(tabsWrap).position === 'sticky';
    const hdrH = hdr.offsetHeight;
    const panelTop = $(`#panel-${id}`).getBoundingClientRect().top;
    const lost = sticky ? panelTop < hdrH + tabsWrap.offsetHeight - 2 : tabsWrap.getBoundingClientRect().top < hdrH - 2;
    if (lost) holdHdr();
    if (lost) document.getElementById(`work-${id}`).scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  tabsEl.addEventListener('click', (e) => {
    const b = e.target.closest('.tab');
    if (b) activate(b.dataset.tab, { user: true });
  });
  // Постер вкладки подгружаем заранее, когда на неё наводят или фокусируют
  tabsEl.addEventListener('pointerover', (e) => { const w = byId(e.target.closest('.tab')?.dataset.tab); if (w?.kind === 'site') setPoster(w, true); });
  // Стрелки ← →, Home и End — от вкладки в фокусе (а не от выбранной). ↑ ↓ оставляем прокрутке страницы.
  tabsEl.addEventListener('keydown', (e) => {
    const ids = WORK.map((w) => w.id);
    const cur = e.target.closest('.tab');
    let i = ids.indexOf(cur ? cur.dataset.tab : active);
    if (e.key === 'ArrowRight') i = (i + 1) % ids.length;
    else if (e.key === 'ArrowLeft') i = (i - 1 + ids.length) % ids.length;
    else if (e.key === 'Home') i = 0;
    else if (e.key === 'End') i = ids.length - 1;
    else return;
    e.preventDefault();
    activate(ids[i], { focus: true, user: true });
  });

  panelsEl.addEventListener('click', (e) => {
    const m = e.target.closest('.seg button');
    if (m) { setMode(m.dataset.mode); return; }
    if (e.target.closest('[data-bd]')) { bdSet(!bdOn); return; }
    const shield = e.target.closest('.device__shield');
    if (shield) {
      const stEl = shield.closest('.stage');
      setInteractive(stEl, true);
      const f = $('iframe', stEl);
      if (f && e.detail === 0) { try { f.focus(); } catch { /* ignore */ } } // с клавиатуры — фокус в демо
    }
  });

  // Ссылки вида #work-luma (из шапки, указателя на первом экране или извне)
  window.addEventListener('hashchange', () => { const id = fromHash(); if (id && id !== active) activate(id, { push: false }); });
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#work-"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(6);
    if (byId(id) && id !== active) activate(id, { push: false });
  });

  // ── Чат-бот и терминал: крутятся по кругу, только пока видны ──
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let animRun = 0;
  const visible = { chat: false, term: false };
  const inView = { chat: false, term: false };
  function updateBotsVisibility() {
    const on = active === 'bots';
    visible.chat = on && inView.chat;
    visible.term = on && inView.term;
  }
  const stamp = (n) => `<small>12:${String(n).padStart(2, '0')}</small>`;
  const chatFinal = () => APPS[lang].chat.map(([k, a, p], n) => (k === 'kb'
    ? `<div class="msg__kb">${a.map((x, i) => `<span class="${i === p ? 'is-picked' : ''}">${esc(x)}</span>`).join('')}</div>`
    : `<div class="msg msg--${k}">${esc(a)}${stamp(n + 1)}</div>`)).join('');
  // Команды — по словам в nowrap: перенос только между словами, а не на дефисах «--city»;
  // в выводе число держится вместе со своей подписью
  // Флаг держится вместе со значением: «--city "Manchester, UK"», «--min-grade B»
  const cmdWords = (x) => x.match(/--\S+ (?:"[^"]*"|[^\s-]\S*)|"[^"]*"|\S+/g) || [];
  const cmdHtml = (x) => cmdWords(x).map((w) => `<span class="nw">${esc(w)}</span>`).join(' ');
  const outHtml = (x) => x.replace(/ <span class="hl">/g, '\u00a0<span class="hl">').replace(/ ([^ <>]+)$/, '\u00a0$1');
  const termLine = ([k, x]) => (k === 'cmd' ? `<span class="p">$</span> ${cmdHtml(x)}` : outHtml(x));
  const termFinal = () => `${APPS[lang].term.map(termLine).join('\n')}\n<span class="cursor"></span>`;

  // Высота чата и терминала = итоговое содержимое: ничего не обрезается сверху, нет пустых половин
  function sizeBots() {
    const panel = $('#panel-bots');
    if (!panel || panel.hidden) return;
    const fit = (el, html) => {
      el.style.minHeight = '';
      const c = el.cloneNode(false);
      c.removeAttribute('data-chat'); c.removeAttribute('data-term');
      c.classList.add('measure');
      c.style.width = `${el.offsetWidth}px`;
      c.innerHTML = html;
      el.parentNode.appendChild(c);
      const h = Math.ceil(c.scrollHeight);
      c.remove();
      el.style.minHeight = `${h}px`;
    };
    fit($('[data-chat]'), chatFinal());
    fit($('[data-term]'), termFinal());
  }

  // Сценарий проигрывается дважды и останавливается на итоговом кадре (без бесконечного движения).
  // Первые реплики и строки уже на месте — при переходе к вкладке не видно пустых окон.
  const CYCLES = 2;
  const PRE_CHAT = 2;
  const PRE_TERM = 2;
  const chatItem = (kind, a, pick, n) => {
    const el = document.createElement('div');
    if (kind === 'kb') {
      el.className = 'msg__kb';
      el.innerHTML = a.map((x, i) => `<span class="${i === pick ? 'is-picked' : ''}">${esc(x)}</span>`).join('');
    } else {
      el.className = 'msg msg--' + kind;
      el.innerHTML = esc(a) + stamp(n);
    }
    return el;
  };
  async function playChat(run) {
    const body = $('[data-chat]');
    for (let cycle = 0; cycle < CYCLES && run === animRun; cycle += 1) {
      if (cycle > 0) { await sleep(4500); if (run !== animRun) return; }
      body.innerHTML = '';
      let n = 0;
      for (const [kind, a, pick] of APPS[lang].chat) {
        n += 1;
        if (run !== animRun) return;
        if (cycle === 0 && n <= PRE_CHAT) { body.appendChild(chatItem(kind, a, pick, n)); continue; }
        while (!visible.chat && run === animRun) await sleep(300);
        if (kind === 'bot') {
          const typing = document.createElement('div');
          typing.className = 'typing'; typing.innerHTML = '<i></i><i></i><i></i>';
          body.appendChild(typing);
          await sleep(900);
          typing.remove();
        }
        if (run !== animRun) return;
        const el = chatItem(kind, a, -1, n);
        body.appendChild(el);
        if (kind === 'kb') {
          await sleep(900);
          if (run !== animRun) return;
          el.children[pick].classList.add('is-picked');
          await sleep(500);
          continue;
        }
        await sleep(kind === 'me' ? 700 : 1100);
      }
    }
  }
  async function playTerm(run) {
    const body = $('[data-term]');
    const stats = () => $$('[data-stats] > div');
    for (let cycle = 0; cycle < CYCLES && run === animRun; cycle += 1) {
      if (cycle > 0) { await sleep(5000); if (run !== animRun) return; }
      body.classList.remove('is-done');
      body.innerHTML = '<span class="cursor"></span>';
      stats().forEach((el) => el.classList.remove('is-on'));
      let k = -1;
      for (const [kind, text] of APPS[lang].term) {
        k += 1;
        const pre = cycle === 0 && k < PRE_TERM;
        if (!pre) while (!visible.term && run === animRun) await sleep(300);
        if (run !== animRun) return;
        const cursor = $('.cursor', body);
        const line = document.createElement('span');
        body.insertBefore(line, cursor);
        if (pre) line.innerHTML = termLine([kind, text]);
        else if (kind === 'cmd') {
          line.innerHTML = '<span class="p">$</span> ';
          const words = cmdWords(text);
          for (let wi = 0; wi < words.length; wi += 1) {
            if (wi) line.append(' ');
            const nw = document.createElement('span');
            nw.className = 'nw';
            line.append(nw);
            for (const ch of words[wi]) { if (run !== animRun) return; nw.append(ch); await sleep(26); }
          }
          await sleep(350);
        } else {
          line.innerHTML = outHtml(text);
          await sleep(420);
        }
        // Пока ждали, язык могли переключить и блок перерисовать — тогда этот цикл устарел
        if (run !== animRun || cursor.parentNode !== body) return;
        body.insertBefore(document.createTextNode('\n'), cursor);
        APPS[lang].stats.forEach(([, , at], j) => { if (at === k) stats()[j]?.classList.add('is-on'); });
      }
    }
    if (run === animRun) body.classList.add('is-done');
  }
  function startAnimations() {
    const run = ++animRun;
    if (reduceMotion) {
      // Без анимации — сразу итоговое состояние
      $('[data-chat]').innerHTML = chatFinal();
      $('[data-term]').innerHTML = termFinal();
      $('[data-term]').classList.add('is-done');
      $$('[data-stats] > div').forEach((el) => el.classList.add('is-on'));
      return;
    }
    playChat(run);
    playTerm(run);
  }
  const visIo = new IntersectionObserver((entries) => {
    for (const e of entries) inView[e.target.classList.contains('tg') ? 'chat' : 'term'] = e.isIntersecting;
    updateBotsVisibility();
  }, { threshold: 0.3 });

  // Неподвижная фраза подвала: размер = ширина контейнера × k (cqw); k меряем один раз на язык/ширину
  const staticMq = window.matchMedia('(pointer: coarse), (max-width: 860px)');
  function fitStatic() {
    const el = $('[data-marquee-static]');
    if (!el || !staticMq.matches) return;
    el.style.removeProperty('--mk');
    const cs = getComputedStyle(el);
    const pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const avail = el.parentElement.clientWidth - pad;
    const w = el.offsetWidth - pad; // ширина по тексту (width: max-content)
    if (avail > 0 && w > 0) el.style.setProperty('--mk', (0.1 * (avail / w) * 0.97).toFixed(5));
  }
  staticMq.addEventListener('change', fitStatic);

  // ── Остальные секции ───────────────────────────────────
  function renderSections() {
    // Гигантские слова-разделители (WORKS / SERVICES / …) — шрифт знака, ширина подгоняется под контейнер (fitWords)
    $$('[data-gw]').forEach((el) => { el.textContent = t(el.dataset.gw); });
    // Бегущая фраза в подвале: две одинаковые половины — сдвиг на −50% бесшовный
    const m = esc(t('marquee'));
    $('[data-render="marquee"]').innerHTML = Array.from({ length: 8 }, () => `<span>${m}</span>`).join('');
    // Телефон: бегущая строка неподвижна — вместо обрезанного куска одна фраза во всю ширину
    $('[data-marquee-static]').textContent = t('marquee.static');
    fitStatic();
    const asideImg = $('[data-aside-img]');
    if (asideImg) asideImg.alt = `${byId('crm')[lang].name} — ${lang === 'ru' ? 'дашборд (демо-данные)' : 'dashboard (demo data)'}`;
    // Чёрная карточка: три концепт-сайта из пяти (ведут к вкладкам); номер — как у вкладки
    $('[data-render="reel"]').innerHTML = REEL.map(byId).map((w) => `
      <a class="reel__item" href="#work-${w.id}"><div class="reel__fig"><img src="${shot(w.id, 'desktop')}" width="1440" height="900" alt="${esc(w[lang].name)} — ${esc(w[lang].short)}" loading="lazy" decoding="async">${vidOk ? `<video class="reel__vid" ${VID_ATTR} data-vid="${w.id}"></video>` : ''}
      <span class="reel__tag" aria-hidden="true">(0${WORK.indexOf(w) + 1}) ${esc(w[lang].idx)}</span></div></a>`).join('');
    $('[data-render="services"]').innerHTML = SERVICES[lang].map(([h, p, list], i) => `
      <li data-rv><span class="svc__no">${String(i + 1).padStart(2, '0')}</span><h3 class="svc__name">${esc(h)}</h3><p class="svc__desc">${esc(p)}</p>
      <ul class="svc__list">${list.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      <span class="svc__ill" aria-hidden="true"><svg viewBox="0 0 120 80">${SVC_ILL[i]}</svg></span></li>`).join('');
    $('[data-render="steps"]').innerHTML = STEPS[lang].map(([h, p], i) => `
      <li class="step" data-rv><span class="step__no">0${i + 1}</span><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`).join('');
    $('[data-render="principles"]').innerHTML = PRINCIPLES[lang].map(([b, s]) => `<li><b>${esc(b)}</b><span>${esc(s)}</span></li>`).join('');
    $('[data-render="facts"]').innerHTML = t('facts').map((x) => `<li>${ICON.check}<span>${x}</span></li>`).join('');
    // Бриф: варианты «что нужно» (несколько) и «бюджет» (один); выбор сохраняется при смене языка
    const keep = (sel) => $$(`${sel} input:checked`).map((i) => +i.value);
    const types = keep('[data-render="fm-types"]'), budget = keep('[data-render="fm-budgets"]');
    $('[data-render="fm-types"]').innerHTML = t('fmTypes').map((x, i) => `<label class="opt"><input type="checkbox" name="type" value="${i}"${types.includes(i) ? ' checked' : ''}><span>${esc(x)}</span></label>`).join('');
    $('[data-render="fm-budgets"]').innerHTML = t('fmBudgets').map((x, i) => `<label class="opt"><input type="radio" name="budget" value="${i}"${budget.includes(i) ? ' checked' : ''}><span>${esc(x)}</span></label>`).join('');
    $$('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    reelVids();
    fitWords();
  }

  // Гигантские слова: размер = ширина контейнера × k (cqw), подгонка по «чернилам» первой и последней буквы
  let gwCtx = null;
  function fitWords() {
    const ws = $$('.gw__w');
    if (!ws.length) return;
    if (!gwCtx) gwCtx = document.createElement('canvas').getContext('2d');
    ws.forEach((w) => {
      const avail = w.parentElement.clientWidth;
      const txt = w.textContent;
      if (!avail || !txt) return;
      w.style.setProperty('--gk', '.2'); w.style.setProperty('--gi', '0');
      const cs = getComputedStyle(w);
      const fs = parseFloat(cs.fontSize);
      const ls = parseFloat(cs.letterSpacing) || 0;
      let lb = 0, rb = 0;
      if (gwCtx) {
        gwCtx.font = `400 ${fs}px "Archivo Black"`;
        const a = gwCtx.measureText(txt[0]), b = gwCtx.measureText(txt[txt.length - 1]);
        if (Number.isFinite(a.actualBoundingBoxLeft)) lb = -a.actualBoundingBoxLeft;
        if (Number.isFinite(b.actualBoundingBoxRight)) rb = b.width - b.actualBoundingBoxRight;
      }
      const inkW = w.offsetWidth - lb - (rb + ls);
      if (inkW <= 0) return;
      w.style.setProperty('--gk', (0.2 * (avail / inkW) * 0.997).toFixed(5));
      w.style.setProperty('--gi', (lb / fs).toFixed(4));
    });
  }

  // Видео в карточке работ: играют, только пока карточка на экране; телефон — одно (центральное) видео
  const reelLite = window.matchMedia('(pointer: coarse), (max-width: 860px)');
  let reelVis = false;
  function reelVids() {
    $$('.reel__vid').forEach((v, i) => {
      const want = reelVis && !document.hidden && (!reelLite.matches || i === 1);
      if (want) {
        if (!v.getAttribute('src')) {
          v.src = vidSrc(v.dataset.vid, 'desktop');
          v.onplaying = () => v.classList.add('is-playing');
        }
        v.muted = true;
        const pr = v.play(); if (pr && pr.catch) pr.catch(() => {});
      } else if (v.getAttribute('src') && !v.paused) v.pause();
    });
  }
  if (vidOk && 'IntersectionObserver' in window) {
    const reelEl = $('[data-reel]');
    // телефон: видео стартует, когда карточка задержалась на экране, — не посреди быстрого пролистывания
    //  (запуск декодера на слабом телефоне даёт заметную паузу кадра)
    //  — ждём паузу в прокрутке (~450 мс без scroll), пока карточка видна
    let reelT = 0, reelWait = false;
    const reelArm = () => { clearTimeout(reelT); reelT = setTimeout(() => { reelWait = false; removeEventListener('scroll', reelArm); reelVids(); }, 450); };
    if (reelEl) new IntersectionObserver((es) => {
      reelVis = es[0].isIntersecting;
      const first = reelVis && reelLite.matches && !$('.reel__vid[src]');
      if (first) { if (!reelWait) { reelWait = true; addEventListener('scroll', reelArm, { passive: true }); } reelArm(); return; }
      if (reelWait) { reelWait = false; clearTimeout(reelT); removeEventListener('scroll', reelArm); }
      reelVids();
    }, { threshold: 0.15 }).observe(reelEl);
    document.addEventListener('visibilitychange', reelVids);
    reelLite.addEventListener('change', reelVids);
  }

  // ── Язык ───────────────────────────────────────────────
  function applyLang(next, first = false) {
    lang = T[next] ? next : 'en';
    root.lang = lang;
    $$('[data-i18n]').forEach((el) => { const v = t(el.dataset.i18n); if (typeof v === 'string') el.textContent = v; });
    $$('[data-i18n-html]').forEach((el) => { const v = t(el.dataset.i18nHtml); if (typeof v === 'string') el.innerHTML = v; });
    $$('[data-i18n-label]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nLabel)); });
    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    document.title = t('title');
    const href = `mailto:${MAIL}?subject=${encodeURIComponent(t('ct.subject'))}`;
    $$('[data-mail], [data-mail-btn]').forEach((a) => { a.href = href; });
    renderSections();
    fillShowcase();
    if (!first) bdQueue();
    menuBtn.setAttribute('aria-label', t(mnav.hidden ? 'nav.open' : 'nav.shut'));
    $('[data-menu-label]').textContent = t(mnav.hidden ? 'nav.menu' : 'nav.close');
    sizeBots();
    startAnimations();
    observeReveals();
    store.set('eg-lang', lang);
    syncDemoLang();
    document.dispatchEvent(new CustomEvent('eg:lang', { detail: { first } }));
    if (!first) {
      // Демо в рамке перезагружаем на новом языке
      if (stages[active]?.frame) { unloadFrame(active); queueFrame(active); }
      layoutStage(active);
      moveBar();
      $$('[data-rv]').forEach((el) => el.classList.add('is-in'));
    }
  }

  // ── Появление при скролле ──────────────────────────────
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const sib = [...e.target.parentElement.children].filter((x) => x.hasAttribute('data-rv'));
      e.target.style.transitionDelay = `${Math.min(Math.max(sib.indexOf(e.target), 0), 5) * 70}ms`;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  function observeReveals() { $$('[data-rv]:not(.is-in)').forEach((el) => io.observe(el)); }

  // Сцена активной вкладки подошла к экрану — грузим постер и живой сайт (не раньше: на первом экране это лишние сотни КБ)
  const nearIo = new IntersectionObserver((entries) => {
    if (workNear || !entries.some((e) => e.isIntersecting)) return;
    workNear = true;
    nearIo.disconnect();
    const w = byId(active);
    if (w.kind === 'site') setPoster(w, true);
    queueFrame(active);
  }, { rootMargin: '200px 0px' });

  // Касание: когда сцена уходит с экрана, «Нажмите, чтобы листать» возвращается — страница снова прокручивается
  const stageIo = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) setInteractive(e.target, false);
      const id = e.target.closest('.panel')?.dataset.panel;
      const st = id && stages[id];
      if (!st) continue;
      st.vis = e.isIntersecting;
      const v = $('.device__vid', st.el);
      if (v && v.getAttribute('src')) { if (e.isIntersecting && !st.el.classList.contains('is-loaded')) v.play().catch(() => {}); else v.pause(); }
    }
  }, { threshold: 0 });

  // ── Копирование email ──────────────────────────────────
  const copyBtn = $('[data-copy]');
  let copyTimer = 0;
  copyBtn.addEventListener('click', async () => {
    let ok = true;
    try { await navigator.clipboard.writeText(MAIL); }
    catch {
      // Нет доступа к буферу — выделяем адрес и пробуем старый способ; не вышло — просим скопировать вручную
      const r = document.createRange(); r.selectNodeContents($('[data-mail]'));
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
      try { ok = document.execCommand('copy'); } catch { ok = false; }
    }
    const msg = t(ok ? 'ct.copied' : 'ct.selected');
    const label = $('[data-i18n]', copyBtn);
    copyBtn.classList.toggle('is-done', ok);
    label.textContent = msg;
    live.textContent = msg;
    if (ok) document.dispatchEvent(new CustomEvent('eg:copied'));
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => { copyBtn.classList.remove('is-done'); label.textContent = t('ct.copy'); }, ok ? 2000 : 3500);
  });

  // Мышь: клик по крупному адресу копирует его (подпись курсора «Копировать»); клавиатура и касание — письмо, как раньше
  $('[data-mail]').addEventListener('click', (e) => {
    if (!finePointer || e.detail === 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    copyBtn.click();
  });

  // ── Бриф: отправка через FormSubmit (AJAX) на почту; при ошибке — письмо с готовым текстом ──
  const brief = $('[data-brief]');
  if (brief) {
    const status = $('[data-brief-status]', brief);
    const sendBtn = $('[data-brief-send]', brief);
    const err = (k, msg) => {
      const box = $(`[data-err="${k}"]`, brief); const inp = brief.elements[k];
      box.textContent = msg || ''; inp.setAttribute('aria-invalid', String(!!msg));
      if (msg) inp.setAttribute('aria-describedby', box.id || (box.id = `e-${k}`)); else inp.removeAttribute('aria-describedby');
      return !msg;
    };
    const contactOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || /^@?[a-zA-Z][\w]{4,31}$/.test(v) || /^\+?[\d\s()-]{7,20}$/.test(v);
    const validate = () => {
      const f = brief.elements;
      const a = err('name', f.name.value.trim().length >= 2 ? '' : t('fm.eName'));
      const b = err('contact', contactOk(f.contact.value.trim()) ? '' : t('fm.eContact'));
      const c = err('message', f.message.value.trim().length >= 5 ? '' : t('fm.eMsg'));
      return a && b && c;
    };
    ['name', 'contact', 'message'].forEach((k) => brief.elements[k].addEventListener('input', () => {
      if (brief.elements[k].getAttribute('aria-invalid') === 'true') validate();
    }));
    const summary = () => {
      const f = brief.elements;
      const types = $$('[name="type"]:checked', brief).map((i) => T.ru.fmTypes[+i.value]).join(', ') || '—';
      const b = $('[name="budget"]:checked', brief);
      return { name: f.name.value.trim(), contact: f.contact.value.trim(), type: types,
        budget: b ? T.ru.fmBudgets[+b.value] : '—', message: f.message.value.trim(), lang };
    };
    brief.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (brief.elements._honey.value) return; // бот заполнил скрытое поле
      if (!validate()) { $('[aria-invalid="true"]', brief)?.focus(); return; }
      const data = summary();
      const label = $('[data-i18n]', sendBtn);
      sendBtn.disabled = true; label.textContent = t('fm.sending'); status.textContent = ''; brief.classList.remove('is-error');
      try {
        const r = await fetch(`https://formsubmit.co/ajax/${MAIL}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...data, _subject: `${t('fm.subject')}: ${data.name}`, _template: 'table', _captcha: 'false' }),
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || String(j.success) === 'false') throw new Error(j.message || r.status);
        brief.classList.add('is-sent'); status.textContent = t('fm.ok'); brief.reset();
      } catch {
        brief.classList.add('is-error'); status.textContent = t('fm.fail');
        const body = `${data.name}\n${data.contact}\n${data.type}\n${data.budget}\n\n${data.message}`;
        location.href = `mailto:${MAIL}?subject=${encodeURIComponent(t('fm.subject'))}&body=${encodeURIComponent(body)}`;
      } finally {
        sendBtn.disabled = false; label.textContent = t('fm.send');
      }
    });
  }

  // ── Шапка и полноэкранное меню ─────────────────────
  const menuBtn = $('[data-menu]');
  const mnav = $('#mnav');
  const fab = $('[data-fab]');
  const outside = () => [$('main'), $('.ftr'), fab];
  let menuTimer = 0;
  const setMenu = (open, { restore = true } = {}) => {
    if (open === !mnav.hidden && !mnav.classList.contains('is-closing')) return;
    clearTimeout(menuTimer);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', t(open ? 'nav.shut' : 'nav.open'));
    $('[data-menu-label]').textContent = t(open ? 'nav.close' : 'nav.menu');
    hdr.classList.toggle('is-menu', open);
    if (open) setHidden(false);
    root.classList.toggle('menu-open', open);
    // Всё, что под меню, — недоступно с клавиатуры и для экранного диктора
    outside().forEach((el) => { if (el) el.inert = open; });
    if (open) {
      mnav.classList.remove('is-closing');
      mnav.hidden = false;
      mnav.classList.add('is-open');
      $('a', mnav).focus({ preventScroll: true });
    } else {
      mnav.classList.remove('is-open');
      const done = () => { mnav.hidden = true; mnav.classList.remove('is-closing'); };
      if (reduceMotion) done();
      else { mnav.classList.add('is-closing'); menuTimer = setTimeout(done, 480); }
      if (restore) menuBtn.focus({ preventScroll: true });
    }
  };
  menuBtn.addEventListener('click', () => setMenu(mnav.hidden || mnav.classList.contains('is-closing')));
  $('.brand').addEventListener('click', () => { if (!mnav.hidden) setMenu(false, { restore: false }); });
  mnav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false, { restore: false }); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !mnav.hidden) setMenu(false); });
  // Tab из последнего элемента меню — обратно на кнопку «Закрыть» (ловушка фокуса)
  mnav.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const items = $$('a, button', mnav);
    if (!e.shiftKey && document.activeElement === items[items.length - 1]) { e.preventDefault(); menuBtn.focus(); }
  });
  menuBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && !mnav.hidden && !e.shiftKey) { e.preventDefault(); $('a', mnav).focus(); }
  });
  const navLinks = $$('.mnav__list a');
  const navSection = (a) => (a.hasAttribute('data-to-work') ? 'work' : a.getAttribute('href').slice(1));
  const sections = ['work', 'services', 'process', 'contact'].map((id) => document.getElementById(id));
  let ticking = false;
  let lastCur, lastScrolled, lastY = window.scrollY, hidden = false;
  // Пока виден первый экран, шапка не прячется: кольцо из «O» садится в неё знаком «E◯’»
  let heroBottom = $('.hero').offsetHeight;
  // Шапка прячется при прокрутке вниз и возвращается при прокрутке вверх — не лежит поверх текста
  const setHidden = (on) => { if (on === hidden) return; hidden = on; hdr.classList.toggle('is-hidden', on); root.classList.toggle('hdr-up', on); };
  hdr.addEventListener('focusin', () => setHidden(false));
  // Переходы по якорям и программная прокрутка не прячут шапку: секция встаёт ровно под ней,
  // без полосы соседней секции противоположного тона над заголовком
  let holdUntil = 0;
  holdHdr = () => {
    holdUntil = performance.now() + 1600;
    setHidden(false);
    const release = () => { holdUntil = 0; lastY = window.scrollY; };
    if ('onscrollend' in window) window.addEventListener('scrollend', release, { once: true });
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (a && a.getAttribute('href').length > 1) holdHdr();
  });
  window.addEventListener('hashchange', () => holdHdr());
  const onScroll = () => {
    // сначала все чтения, потом записи — без принудительного пересчёта раскладки на каждом кадре
    const y = window.scrollY, lim = window.innerHeight * 0.4;
    let cur = null;
    for (const s of sections) if (s.getBoundingClientRect().top < lim) cur = s.id;
    const scrolled = y > 40;
    if (scrolled !== lastScrolled) { lastScrolled = scrolled; hdr.classList.toggle('is-scrolled', scrolled); }
    const dy = y - lastY;
    if (holdUntil && performance.now() < holdUntil) lastY = y;
    else if (Math.abs(dy) > 4) {
      holdUntil = 0;
      setHidden(dy > 0 && y > Math.max(120, heroBottom) && mnav.hidden);
      lastY = y;
    }
    if (cur !== lastCur) { lastCur = cur; navLinks.forEach((a) => a.classList.toggle('is-active', navSection(a) === cur)); }
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  // Пересчёт масштаба превью и высоты чата при изменении размеров
  let lastW = 0;
  new ResizeObserver(() => {
    const w = panelsEl.clientWidth;
    if (Math.abs(w - lastW) < 1) return;
    lastW = w;
    layoutStage(active);
    moveBar();
    if (active === 'bots') sizeBots();
    bdQueue();
  }).observe(panelsEl);
  let rz = 0;
  let lastStaticW = window.innerWidth;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(rz);
    rz = requestAnimationFrame(() => {
      layoutStage(active); moveBar(); centerChip(false);
      heroBottom = $('.hero').offsetHeight;
      if (window.innerWidth !== lastStaticW) { lastStaticW = window.innerWidth; fitStatic(); }
    });
  }, { passive: true });

  // ── Старт ──────────────────────────────────────────────
  $('[data-year]').textContent = new Date().getFullYear();
  $$('.lang button').forEach((b) => b.addEventListener('click', () => { if (b.dataset.lang !== lang) applyLang(b.dataset.lang); }));
  buildShowcase();
  applyLang(lang, true);
  $$('.tg, .term').forEach((el) => visIo.observe(el));
  $$('.stage--site').forEach((el) => { stageIo.observe(el); nearIo.observe(el); });

  // ── Первый экран: словесный знак по буквам, подгонка под ширину, заставка ──
  const hero = $('.hero');
  const mark = $('[data-mark]');
  // «O» знака — надувное кольцо из фольги (assets/orb.js): тот же предмет, что в заставке
  mark.innerHTML = [...mark.textContent.trim()].map((c, i) => (c === 'O'
    ? `<span class="ml ml--o" style="--i:${i}"><i class="disc" data-disc></i></span>`
    : `<span class="ml" style="--i:${i}"><span class="ml__i">${c}</span></span>`)).join('');
  const disc = $('[data-disc]');
  // Один canvas на страницу: в заставке он в «E◯’», после перелёта — в «O» знака
  const orb = window.EGOrb ? window.EGOrb() : null;
  // Дом кольца после заставки: путешествие по странице (assets/sig.js) или, если оно выключено
  // («уменьшение движения», нет WebGL), — неподвижно в «O» знака, в шапке «EG’»
  let ringHomed = false;
  const ringHome = (intro) => {
    if (!orb || ringHomed) return;
    ringHomed = true;
    if (!(window.EGSig && window.EGSig.travel(orb, { disc, intro }))) orb.attach(disc);
  };
  if (orb) {
    disc.classList.add('has-orb');
    // Клик/касание по «O» — короткий «вдох» кольца с толчком вращения (и на телефоне)
    if (orb.ok && !reduceMotion) { disc.classList.add('is-poke'); disc.addEventListener('click', () => orb.poke()); }
  }
  // ── Пасхалка: 5 быстрых нажатий на кольцо (в знаке или в шапке) — кольцо крутится и подпрыгивает,
  //    буквы «EKIMOV’» прыгают волной, внизу — короткая моно-плашка. Облик кольца не меняется.
  const toast = $('[data-toast]');
  let hits = [], toastT = 0;
  const egg = () => {
    const moved = !reduceMotion && window.EGSig && window.EGSig.egg ? window.EGSig.egg() : false;
    if (!reduceMotion) {
      if (!moved) { disc.classList.remove('is-egg'); void disc.offsetWidth; disc.classList.add('is-egg'); setTimeout(() => disc.classList.remove('is-egg'), 1700); }
      hdr.classList.remove('is-egg'); void hdr.offsetWidth; hdr.classList.add('is-egg'); setTimeout(() => hdr.classList.remove('is-egg'), 1300);
    }
    if (toast) {
      toast.textContent = t('egg');
      toast.classList.add('is-on');
      clearTimeout(toastT);
      toastT = setTimeout(() => toast.classList.remove('is-on'), 2000);
    }
    live.textContent = t('egg');
    document.dispatchEvent(new CustomEvent('eg:egg'));
  };
  const ringHit = () => {
    document.dispatchEvent(new CustomEvent('eg:poke'));
    const now = performance.now();
    hits = hits.filter((x) => now - x < 1800);
    hits.push(now);
    if (hits.length >= 5) { hits = []; egg(); }
  };
  disc.addEventListener('click', ringHit);
  // Кольцо в шапке: нажатие — тот же отклик, что в знаке (а не переход наверх); «E» и «’» по-прежнему ведут домой
  const brandO = $('[data-brand-o]');
  if (brandO && orb && orb.ok && !reduceMotion) {
    brandO.classList.add('is-poke');
    brandO.addEventListener('click', (e) => {
      if (!root.classList.contains('orb-travel') || !hdr.classList.contains('is-docked') || e.detail === 0) return;
      e.preventDefault();
      e.stopPropagation();
      orb.poke();
      ringHit();
    });
  }
  // Размер знака = ширина контейнера × k (единицы cqw); k зависит только от шрифта — меряем один раз
  // Подгонка по «чернилам», а не по коробке: левый край «E» встаёт на линию заголовка,
  // кончик апострофа — на правое поле. Боковые отступы глифов берём из canvas.measureText.
  const inkCtx = document.createElement('canvas').getContext('2d');
  const fitMark = () => {
    const box = mark.parentElement;
    const cs = getComputedStyle(box);
    const avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const ls = $$('.ml', mark);
    if (!ls.length || avail <= 0) return;
    mark.style.setProperty('--ink', '0');
    const fs = parseFloat(getComputedStyle(mark).fontSize);
    const first = ls[0], last = ls[ls.length - 1];
    let lb = 0, rb = 0;
    if (inkCtx) {
      inkCtx.font = `400 ${fs}px "Archivo Black"`;
      const mf = inkCtx.measureText(first.textContent), ml = inkCtx.measureText(last.textContent);
      if (Number.isFinite(mf.actualBoundingBoxLeft)) lb = -mf.actualBoundingBoxLeft;
      rb = Number.isFinite(ml.actualBoundingBoxRight) ? ml.actualBoundingBoxRight : ml.width;
    }
    const boxLeft = box.getBoundingClientRect().left + parseFloat(cs.paddingLeft);
    const fr = first.getBoundingClientRect(), lr = last.getBoundingClientRect();
    const inkL = fr.left + lb, inkR = (rb ? lr.left + rb : lr.right);
    const inkW = inkR - inkL;
    if (inkW <= 0) return;
    const k = parseFloat(getComputedStyle(mark).getPropertyValue('--k')) || 0.1855;
    const offEm = (inkL - boxLeft) / fs; // всё в em — при смене ширины пересчёт не нужен (cqw)
    mark.style.setProperty('--k', (k * (avail / inkW) * 0.998).toFixed(5));
    mark.style.setProperty('--ink', offEm.toFixed(4));
  };
  // Archivo Black — крошечный набор (&text=…); ждём не дольше 1,2 с
  const fontReady = document.fonts && document.fonts.load
    ? Promise.race([document.fonts.load('400 100px "Archivo Black"', 'EKIMOV’'), sleep(1200)]).catch(() => {})
    : Promise.resolve();

  // Заставка: «E◯’», в круге — кольцо из фольги, счётчик 000 → 100.
  // Дальше шторка уходит вверх, а круг перелетает в «O» большого знака (один элемент, только transform).
  const intro = $('[data-intro]');
  const introOn = root.classList.contains('intro-on');
  const runIntro = () => new Promise((resolve) => {
    if (!introOn || !intro) { resolve(); return; }
    try { sessionStorage.setItem('eg-intro', '1'); } catch { /* приватный режим */ }
    const o = $('[data-intro-o]');
    if (orb) { o.classList.add('has-orb'); orb.attach(o); }
    const count = $('[data-intro-count]');
    let raf = 0, done = false;
    const SKIP = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
    const CURTAIN = 700;
    const finish = (e) => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      SKIP.forEach((ev) => window.removeEventListener(ev, finish));
      count.textContent = '100';
      intro.classList.add('is-done'); // счётчик гаснет сразу — не уезжает вместе со шторкой
      // Перелёт круга — только если зритель не начал прокрутку/ввод (иначе цель сместится)
      const fly = !e && window.scrollY < 2;
      if (fly) {
        // is-flown: буквы знака поднимаются чуть позже — кольцо успевает сесть в «O», не проходя поверх «M» и «V»
        hero.classList.add('is-flip', 'is-flown');
        const A = o.getBoundingClientRect();
        // Пустышка того же размера держит место — «E» и «’» не съезжают под круг
        const ph = document.createElement('span');
        ph.style.cssText = `display:block;flex:none;width:${A.width}px;height:${A.height}px;margin:0 .04em 0 .05em`;
        o.replaceWith(ph);
        const B = disc.getBoundingClientRect(); // с .is-flip буква «O» уже стоит на месте (без подъёма)
        o.style.cssText = `position:fixed;left:${A.left}px;top:${A.top}px;width:${A.width}px;height:${A.height}px;margin:0;z-index:201;transform:none;animation:none`;
        document.body.appendChild(o);
        void o.offsetWidth;
        const sc = B.width / A.width;
        o.classList.add('is-fly');
        o.style.transform = `translate3d(${B.left - A.left}px, ${B.top - A.top}px, 0) scale(${sc})`;
        const land = () => {
          if (!o.isConnected) return;
          hero.classList.remove('is-flip');
          ringHome(true); // тот же canvas переезжает в «O» знака (и дальше путешествует по странице)
          o.remove();
        };
        o.addEventListener('transitionend', (ev) => { if (ev.propertyName === 'transform') land(); });
        setTimeout(land, 1200);
      }
      intro.classList.add('is-out');
      // Буквы знака начинают подниматься вместе со шторкой — к её уходу знак уже на месте
      resolve();
      setTimeout(() => {
        // Без перелёта кольцо остаётся в заставке до ухода шторки, затем переезжает в знак
        if (!fly) ringHome(false);
        intro.remove(); root.classList.remove('intro-on');
      }, CURTAIN + 50);
    };
    SKIP.forEach((ev) => window.addEventListener(ev, finish, { passive: true }));
    // Старт — когда шрифт знака готов (не дольше 0,35 с), чтобы буквы не перестраивались на глазах
    Promise.race([fontReady, sleep(350)]).then(() => {
      if (done) return;
      intro.classList.add('is-go');
      const t0 = performance.now(), DUR = 900;
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / DUR);
        count.textContent = String(Math.round(p * 100)).padStart(3, '0');
        if (p < 1) raf = requestAnimationFrame(tick); else setTimeout(() => finish(), 80);
      };
      raf = requestAnimationFrame(tick);
    });
  });
  if (!introOn && intro) intro.remove();
  if (!introOn) ringHome(false);
  fontReady.then(() => { fitMark(); fitWords(); });
  Promise.all([fontReady, runIntro()]).then(() => hero.classList.add('is-ready'));

  activate(active, { push: false, animate: false });
  // Перезагрузка и «назад/вперёд»: браузер сам вернёт место чтения — к вкладкам не прыгаем
  const navType = performance.getEntriesByType?.('navigation')[0]?.type;
  const restoring = navType === 'reload' || navType === 'back_forward';
  let autoY = -1;
  const toInitial = () => {
    holdHdr();
    document.getElementById(`work-${initial}`).scrollIntoView({ block: 'start', behavior: 'instant' });
    autoY = window.scrollY;
  };
  if (initial && !restoring) {
    // После сборки панелей ещё раз докручиваем к вкладкам (высота страницы могла измениться)
    requestAnimationFrame(toInitial);
  }
  onScroll();
  if (document.fonts) {
    document.fonts.ready.then(() => {
      fitMark();
      fitWords();
      fitStatic();
      moveBar();
      layoutStage(active);
      if (active === 'bots') sizeBots();
      if (initial && !restoring && Math.abs(window.scrollY - autoY) < 2) toInitial();
    });
  }
  // Плавная прокрутка — только после первой отрисовки: ссылка вида /#contact открывается сразу на месте
  const smoothOn = () => setTimeout(() => root.classList.add('is-smooth'), 400);
  if (document.readyState === 'complete') smoothOn(); else window.addEventListener('load', smoothOn, { once: true });
})();

// ── Цвет шапки и круглой кнопки — по тону секции под ними (IntersectionObserver, без чтений при прокрутке) ──
(() => {
  const hdr = document.querySelector('[data-hdr]');
  const fab = document.querySelector('[data-fab]');
  const bands = [...document.querySelectorAll('.band[data-tone]')];
  if (!('IntersectionObserver' in window) || !hdr || !fab) return;
  let ioTop, ioBot, ioPan;
  // Телефон: над витриной (кнопки «Хочу такой же», списки) круглая кнопка не нужна — прячем
  const narrow = window.matchMedia('(max-width: 860px)');
  const panels = document.querySelector('[data-panels]');
  let bandHide = true, panHide = false;
  const syncFab = () => fab.classList.toggle('is-hidden', bandHide || (panHide && narrow.matches));
  narrow.addEventListener('change', syncFab);
  const build = () => {
    [ioTop, ioBot, ioPan].forEach((o) => o && o.disconnect());
    const h = window.innerHeight;
    const y1 = Math.round(hdr.offsetHeight / 2);
    const y2 = Math.max(y1 + 2, h - 56);
    ioTop = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) hdr.dataset.tone = e.target.dataset.tone; }),
      { rootMargin: `-${y1}px 0px -${h - y1 - 1}px 0px` });
    ioBot = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      fab.dataset.tone = e.target.dataset.tone;
      bandHide = e.target.id === 'contact' || e.target.id === 'top' || e.target.classList.contains('ftr'); // на первом экране, в контактах и подвале кнопка не нужна
      syncFab();
    }), { rootMargin: `-${y2}px 0px -${h - y2 - 1}px 0px` });
    // Полоса внизу экрана высотой с кнопку: пересекает витрину — прячем
    const y3 = Math.max(0, h - 110);
    ioPan = new IntersectionObserver((es) => { panHide = es[0].isIntersecting; syncFab(); }, { rootMargin: `-${y3}px 0px 0px 0px` });
    bands.forEach((b) => { ioTop.observe(b); ioBot.observe(b); });
    if (panels) ioPan.observe(panels);
  };
  build();
  let rw = window.innerWidth, rh = window.innerHeight;
  window.addEventListener('resize', () => {
    // Полоса адреса на телефоне меняет высоту на ~60–100 px — из-за неё не пересобираем
    if (window.innerWidth !== rw || Math.abs(window.innerHeight - rh) > 120) { rw = window.innerWidth; rh = window.innerHeight; build(); }
  }, { passive: true });
})();

// ── Параллакс карточки с работами — только мышь, широкий экран и без «уменьшения движения» ──
(() => {
  const reel = document.querySelector('[data-reel]');
  const mq = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 861px)');
  if (!reel || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const SPEED = [-70, 56, -30];
  let top = 0, hgt = 0, vis = false, raf = 0;
  // Положение карточки меряем только при изменении размеров — при прокрутке читаем лишь scrollY
  const measure = () => { const r = reel.getBoundingClientRect(); top = r.top + window.scrollY; hgt = r.height; };
  const upd = () => {
    raf = 0;
    if (!vis || !mq.matches) return;
    const p = (window.scrollY + window.innerHeight - top) / (window.innerHeight + hgt) - 0.5;
    reel.querySelectorAll('.reel__item').forEach((el, i) => el.style.setProperty('--py', `${(p * SPEED[i % 3] * 2).toFixed(1)}px`));
  };
  const req = () => { if (!raf) raf = requestAnimationFrame(upd); };
  new IntersectionObserver((es) => { vis = es[0].isIntersecting; if (vis) { measure(); req(); } }).observe(reel);
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', () => { measure(); req(); }, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.querySelector('.hero'));
})();

// ── «Магнитные» главные кнопки: слегка тянутся за курсором (только мышь) ──
(() => {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');
  const MAX = 8;
  const clear = (x) => { x.classList.remove('is-mag'); x.style.translate = ''; };
  document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || !fine.matches || still.matches) return;
    const b = e.target.closest && e.target.closest('.hero .pill, .mail__actions .pill, .fab');
    document.querySelectorAll('.is-mag').forEach((x) => { if (x !== b) clear(x); });
    if (!b) return;
    const r = b.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    b.classList.add('is-mag');
    b.style.translate = `${(dx * MAX).toFixed(1)}px ${(dy * MAX * 0.6).toFixed(1)}px`;
  }, { passive: true });
  document.addEventListener('pointerleave', () => document.querySelectorAll('.is-mag').forEach(clear));
})();

// ── Бесконечные анимации работают, только пока блок на экране ──
(() => {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => e.target.classList.toggle('is-off', !e.isIntersecting));
  }, { rootMargin: '80px 0px' });
  document.querySelectorAll('.floor, .marquee').forEach((el) => { el.classList.add('is-off'); io.observe(el); });
})();
