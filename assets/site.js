// Портфолио Ekimov Gregory — «Swiss editorial».
// Язык EN/RU, тема (светлая по умолчанию / тёмная), витрина работ на вкладках (живые iframe демо),
// чат-бот и терминал парсера, email.
(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Адрес собираем в браузере, а не храним целиком в HTML — меньше спама от сборщиков адресов
  const MAIL = ['ekimovgregory9', 'gmail.com'].join('@');
  const DEMO_KEYS = ['ognivo-lang', 'luma-lang', 'monolit-lang'];

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* приватный режим */ } },
  };

  // ── Словарь интерфейса ─────────────────────────────────
  const T = {
    en: {
      skip: 'Skip to work',
      'nav.work': 'Work', 'nav.bots': 'Bots & parsers', 'nav.services': 'Services', 'nav.process': 'Process', 'nav.contact': 'Contact', 'nav.cta': 'Start a project', 'nav.menu': 'Menu',
      'a.home': 'Ekimov Gregory — home', 'a.main': 'Main', 'a.lang': 'Language', 'a.mobile': 'Menu',
      'theme.dark': 'Dark theme', 'theme.light': 'Light theme', 'theme.toDark': 'Switch to dark theme', 'theme.toLight': 'Switch to light theme',
      'hero.role': 'Design & development', 'hero.what': 'Websites · Bots · Apps · Parsers', 'hero.langs': 'Working in English & Russian',
      'hero.status': 'Available for new projects',
      'hero.title': 'Websites, bots &amp; apps that <em>bring clients</em>.',
      'hero.lead': 'I’m Gregory — I build websites, Telegram bots, web apps and parsers for business: booking, calculators, lead forms, automation and data collection.',
      'hero.cta1': 'See the work', 'hero.cta2': 'Discuss your project',
      'hero.index': 'Index of work', 'hero.indexHint': 'Click — opens below',
      'hero.for': '<b>For any business</b> — restaurants, clinics, construction, beauty, real estate, retail and\u00a0services',
      ticker: ['Websites', 'Multi-page sites', 'Landing pages', 'Telegram bots', 'Web apps & PWA', 'Parsers', 'CRM & admin panels', 'Online booking', 'Calculators', 'Integrations'],
      'work.kicker': 'Selected work', 'work.meta': '3 live demos · 1 real product · bots & parsers',
      'work.title': 'Click a tab. <em>See it live.</em>',
      'work.lead': 'Three concept websites run right inside the frame — scroll them, open the menu, try the calculators and booking. Next to them: a real CRM I built and the bots and parsers I make.',
      'work.keys': '← → to switch', 'work.tabs': 'Work',
      'kind.concept': 'Concept', 'kind.product': 'Product', 'kind.cap': 'Capabilities',
      'stage.live': 'Live demo', 'stage.conceptLive': 'Concept · live demo', 'stage.desktop': 'Desktop', 'stage.mobile': 'Mobile', 'stage.size': 'Preview size',
      'stage.open': 'Open full site ↗', 'stage.openLabel': 'Open the full site in a new tab',
      'stage.hint': 'Interactive — click the frame, then scroll and tap around', 'stage.hintTouch': 'Interactive — tap the frame, then scroll it', 'stage.real': 'This is the real site, not a video',
      'stage.interact': 'Click to interact', 'stage.tap': 'Tap to interact', 'stage.loading': 'Loading live demo…',
      'stage.shots': 'Private tool · screenshots with demo data', 'stage.shotsNarrow': 'Real product · screenshots', 'stage.shotsNote': 'Interface in Russian · names and numbers are demo data',
      'stage.bots': 'Animated example · booking bot & lead parser', 'stage.botsNarrow': 'Animated example', 'stage.botsNote': 'Scripted demo of a typical scenario · company names are fictional',
      'case.concept': 'Concept project', 'case.real': 'Real product', 'case.cap': 'Capabilities',
      'case.feats': 'What’s inside', 'case.stack': 'Built with', 'case.similar': 'I want a site like this',
      'case.ask': 'Request a demo', 'case.private': 'Private tool — demo on request', 'case.discuss': 'Discuss your bot or parser',
      'bots.tg': 'Telegram bots', 'bots.parse': 'Parsers & data collection', 'bots.status': 'bot', 'bots.name': 'LUMA Booking Bot',
      'svc.kicker': 'Services', 'svc.meta': 'From one page to a working tool', 'svc.title': 'What I can <em>build for you</em>',
      'svc.lead': 'From a single landing page to a full multi-page website, a bot or an internal tool — designed, built and launched by one person, start to finish.',
      'proc.kicker': 'Process', 'proc.meta': '4 steps', 'proc.title': 'Clear steps, <em>no surprises</em>',
      'proc.lead': 'You always know what happens next — and you watch the project grow on a live\u00a0link.', 'proc.principles': 'Principles',
      'ct.kicker': 'Contact', 'ct.title': 'Have a project<br> in mind? <em>Let’s&nbsp;talk.</em>',
      'ct.lead': 'Tell me about your business and what the site, bot or app should do.',
      facts: ['I reply with ideas, a plan and a price', 'English / <span lang="ru">Русский</span>', 'Files and domain stay yours'],
      'ct.copy': 'Copy email', 'ct.copied': 'Copied ✓', 'ct.selected': 'Selected — copy manually', 'ct.write': 'Write an email', 'ct.subject': 'Project inquiry',
      'foot.note': 'Hand-built, hosted on GitHub Pages. Demo projects are concepts — names, people and data are fictional.', 'foot.top': 'Back to top ↑',
      title: 'Ekimov Gregory — Websites, bots & web apps',
    },
    ru: {
      skip: 'Перейти к работам',
      'nav.work': 'Работы', 'nav.bots': 'Боты и парсеры', 'nav.services': 'Услуги', 'nav.process': 'Процесс', 'nav.contact': 'Контакты', 'nav.cta': 'Обсудить проект', 'nav.menu': 'Меню',
      'a.home': 'Ekimov Gregory — на главную', 'a.main': 'Основное меню', 'a.lang': 'Язык', 'a.mobile': 'Меню',
      'theme.dark': 'Тёмная тема', 'theme.light': 'Светлая тема', 'theme.toDark': 'Включить тёмную тему', 'theme.toLight': 'Включить светлую тему',
      'hero.role': 'Дизайн и разработка', 'hero.what': 'Сайты · Боты · Приложения · Парсеры', 'hero.langs': 'Работаю на русском и английском',
      'hero.status': 'Беру новые проекты',
      'hero.title': 'Сайты, боты и приложения, которые <em>приводят клиентов</em>.',
      'hero.lead': 'Я Григорий — делаю сайты, Telegram-ботов, веб-приложения и парсеры для бизнеса: онлайн-запись, калькуляторы, заявки, автоматизация и сбор данных.',
      'hero.cta1': 'Смотреть работы', 'hero.cta2': 'Обсудить проект',
      'hero.index': 'Указатель работ', 'hero.indexHint': 'Нажмите — откроется ниже',
      'hero.for': '<b>Для любого бизнеса</b> — рестораны, клиники, стройка, салоны красоты, недвижимость, торговля и\u00a0услуги',
      ticker: ['Сайты', 'Многостраничные сайты', 'Лендинги', 'Telegram-боты', 'Веб-приложения и PWA', 'Парсеры', 'CRM и админ-панели', 'Онлайн-запись', 'Калькуляторы', 'Интеграции'],
      'work.kicker': 'Избранные работы', 'work.meta': '3 живых демо · 1 реальный продукт · боты и парсеры',
      'work.title': 'Нажмите на вкладку. <em>Смотрите вживую.</em>',
      'work.lead': 'Три концепт-сайта работают прямо внутри рамки — прокручивайте, открывайте меню, пробуйте калькуляторы и запись. Рядом — реальная CRM, которую я сделал, и боты с парсерами.',
      'work.keys': '← → переключение', 'work.tabs': 'Работы',
      'kind.concept': 'Концепт', 'kind.product': 'Продукт', 'kind.cap': 'Возможности',
      'stage.live': 'Живое демо', 'stage.conceptLive': 'Концепт · живое демо', 'stage.desktop': 'Компьютер', 'stage.mobile': 'Телефон', 'stage.size': 'Размер превью',
      'stage.open': 'Открыть сайт ↗', 'stage.openLabel': 'Открыть сайт целиком в новой вкладке',
      'stage.hint': 'Интерактивно — нажмите на рамку, затем листайте и нажимайте', 'stage.hintTouch': 'Интерактивно — коснитесь рамки и листайте сайт', 'stage.real': 'Это настоящий сайт, а не видео',
      'stage.interact': 'Нажмите, чтобы управлять', 'stage.tap': 'Нажмите, чтобы листать', 'stage.loading': 'Загружаем живое демо…',
      'stage.shots': 'Внутренний инструмент · скриншоты с демо-данными', 'stage.shotsNarrow': 'Реальный продукт · скриншоты', 'stage.shotsNote': 'Названия и цифры — демо-данные',
      'stage.bots': 'Анимированный пример · бот записи и парсер лидов', 'stage.botsNarrow': 'Анимированный пример', 'stage.botsNote': 'Демо по сценарию: диалог с ботом и запуск парсера · компании вымышлены',
      'case.concept': 'Концепт-проект', 'case.real': 'Реальный продукт', 'case.cap': 'Возможности',
      'case.feats': 'Что внутри', 'case.stack': 'Технологии', 'case.similar': 'Хочу такой же',
      'case.ask': 'Запросить демо', 'case.private': 'Внутренний инструмент — демо по запросу', 'case.discuss': 'Обсудить бота или парсер',
      'bots.tg': 'Telegram-боты', 'bots.parse': 'Парсеры и сбор данных', 'bots.status': 'бот', 'bots.name': 'LUMA · бот записи',
      'svc.kicker': 'Услуги', 'svc.meta': 'От одной страницы до рабочего инструмента', 'svc.title': 'Что я могу <em>сделать для вас</em>',
      'svc.lead': 'От одного лендинга до полного многостраничного сайта, бота или внутреннего инструмента — проектирую, делаю и запускаю сам, от начала до конца.',
      'proc.kicker': 'Процесс', 'proc.meta': '4 шага', 'proc.title': 'Понятные шаги, <em>без сюрпризов</em>',
      'proc.lead': 'Вы всегда знаете, что будет дальше, — и видите, как растёт проект, по живой\u00a0ссылке.', 'proc.principles': 'Принципы',
      'ct.kicker': 'Контакты', 'ct.title': 'Есть задача?<br> <em>Давайте обсудим.</em>',
      'ct.lead': 'Расскажите о бизнесе и о том, что должен делать сайт, бот или приложение.',
      facts: ['Отвечу идеями, планом и ценой', '<span lang="en">English</span> / Русский', 'Файлы и домен остаются у вас'],
      'ct.copy': 'Скопировать', 'ct.copied': 'Скопировано ✓', 'ct.selected': 'Выделено — скопируйте вручную', 'ct.write': 'Написать письмо', 'ct.subject': 'Запрос по проекту',
      'foot.note': 'Сделано вручную, размещено на GitHub Pages. Демо-проекты — концепты: названия, люди и данные вымышлены.', 'foot.top': 'Наверх ↑',
      title: 'Ekimov Gregory — сайты, боты и веб-приложения',
    },
  };

  // ── Работы: 3 концепт-сайта, реальный продукт, боты и парсеры ──
  // pa — фирменный цвет проекта (метка вкладки, полоска, лёгкий оттенок подиума); sb — фон/текст статус-бара телефона
  const WORK = [
    {
      id: 'ognivo', kind: 'site', url: 'ognivo/', host: 'flasqwe.github.io/<b>ognivo</b>/', pa: '#e3743b', pt: '#a84a18', sb: ['#0b0a08', '#ffffff'],
      chips: ['HTML', 'CSS', 'JavaScript', 'Canvas', 'EN / RU'],
      en: { name: 'OGNIVO', tab: 'OGNIVO', idx: 'OGNIVO', sub: 'Restaurant', short: 'Restaurant', tag: 'Restaurant · wood-fired kitchen',
        desc: 'A dark, atmospheric site for a fine-dining restaurant where everything is cooked over open fire. The mood sells the table before the menu does.',
        feats: ['Live sparks over the hero photo, cinematic intro', 'Tabbed menu: tasting set, à la carte, wine & bar', 'Table booking with validation and confirmation', 'Chef story, gallery, rotating reviews'] },
      ru: { name: 'OGNIVO', tab: 'OGNIVO', idx: 'OGNIVO', sub: 'Ресторан', short: 'Ресторан', tag: 'Ресторан · кухня на живом огне',
        desc: 'Тёмный атмосферный сайт для ресторана высокой кухни, где всё готовят на открытом огне. Настроение продаёт столик раньше, чем меню.',
        feats: ['Живые искры поверх фото, кинематографичное появление', 'Меню на вкладках: дегустация, основное, вино и бар', 'Бронь столика с проверкой полей и подтверждением', 'История шефа, галерея, отзывы'] },
    },
    {
      id: 'luma', kind: 'site', url: 'luma/', host: 'flasqwe.github.io/<b>luma</b>/', pa: '#14706a', pt: '#14706a', sb: ['#f6f5f1', '#111111'],
      chips: ['HTML', 'CSS', 'JavaScript', 'Accessibility', 'EN / RU'],
      en: { name: 'LUMA Dental', tab: 'LUMA Dental', idx: 'LUMA Dental', sub: 'Dental clinic', short: 'Dental clinic', tag: 'Dental clinic · premium',
        desc: 'A calm, trustworthy site for a dental clinic that turns nervous visitors into booked patients — prices and free time slots are visible upfront.',
        feats: ['Treatment cost calculator with 0% instalments', 'Drag-to-compare whitening before / after slider', 'Booking with doctor choice and live free slots', 'Open / closed status calculated from opening hours'] },
      ru: { name: 'LUMA Dental', tab: 'LUMA Dental', idx: 'LUMA Dental', sub: 'Стоматология', short: 'Стоматология', tag: 'Стоматология · премиум',
        desc: 'Спокойный, вызывающий доверие сайт клиники, который превращает тревожных посетителей в записанных пациентов: цены и свободное время видны сразу.',
        feats: ['Калькулятор стоимости лечения с рассрочкой 0%', 'Слайдер «до / после» отбеливания', 'Запись с выбором врача и свободных окон', 'Статус «открыто / закрыто» по часам работы'] },
    },
    {
      id: 'monolit', kind: 'site', url: 'monolit/', host: 'flasqwe.github.io/<b>monolit</b>/', pa: '#f5c400', pt: '#806500', sb: ['#131419', '#ffffff'],
      chips: ['HTML', 'CSS', 'JavaScript', 'SVG', 'EN / RU'],
      en: { name: 'MONOLIT', tab: 'MONOLIT', idx: 'MONOLIT', sub: 'Construction', short: 'Construction', tag: 'Construction · design & build',
        desc: 'A bold industrial site for a construction company. Big numbers, a project portfolio and an instant cost estimate do the selling for B2B and private clients.',
        feats: ['Blueprint lines drawing over the hero photo', 'Filterable portfolio with project details', 'Cost & timeline estimator with a stage-by-stage breakdown', 'Lead form with drawings upload'] },
      ru: { name: 'MONOLIT', tab: 'MONOLIT', idx: 'MONOLIT', sub: 'Строительство', short: 'Строительство', tag: 'Строительство · проектирование',
        desc: 'Смелый индустриальный сайт строительной компании. Крупные цифры, портфолио объектов и мгновенная смета продают и B2B-, и частным клиентам.',
        feats: ['Чертёжные линии, прорисовывающиеся поверх фото', 'Портфолио с фильтрами и карточкой объекта', 'Калькулятор стоимости и сроков с разбивкой по этапам', 'Заявка с прикреплением чертежей'] },
    },
    {
      // Скриншоты сняты на локальной копии с вымышленными демо-данными; название бренда на скриншоте заменено на «Lead CRM»
      id: 'crm', kind: 'product', host: 'crm · lead generation', pa: '#6c8bff', pt: '#3a55e0',
      chips: ['Node.js', 'PostgreSQL', 'Playwright', 'Email API', 'Open data'],
      en: { name: 'Lead CRM & parser', tab: 'Lead CRM', idx: 'Lead CRM & parser', sub: 'B2B · private', short: 'Real product', tag: 'B2B · CRM + parser',
        desc: 'An internal tool for cold outreach: finds companies by niche and city, collects contacts and decision makers, scores leads and runs email campaigns — all in one panel.',
        feats: ['Company search in 120 countries from open map data', 'Contacts and decision makers from company sites and official registries', 'Lead scoring 0–100 with “ready to buy” signals', 'Email campaigns with domain warm-up, auto follow-ups and inbox', 'Kanban pipeline, analytics dashboard, team access'] },
      ru: { name: 'CRM и парсер лидов', tab: 'CRM лидов', idx: 'CRM и парсер лидов', sub: 'B2B · закрытая', short: 'Реальный продукт', tag: 'B2B · CRM + парсер',
        desc: 'Внутренний инструмент для холодных продаж: находит компании по нише и городу, собирает контакты и ЛПР, оценивает лиды и запускает email-рассылки — всё в одной панели.',
        feats: ['Поиск компаний в 120 странах по открытым картам', 'Контакты и ЛПР с сайтов компаний и из гос. реестров', 'Скоринг лидов 0–100 с сигналами «готов покупать»', 'Рассылки с прогревом домена, автонапоминаниями и инбоксом', 'Канбан-воронка, дашборд аналитики, доступ для команды'] },
    },
    {
      id: 'bots', kind: 'bots', pa: '#2aabee', pt: '#086b9e',
      chips: ['Telegram Bot API', 'Node.js', 'Playwright', 'PostgreSQL', 'CSV / Sheets'],
      en: { name: 'Telegram bots &\u00a0parsers', tab: 'Bots &\u00a0parsers', idx: 'Telegram bots &\u00a0parsers', sub: 'Automation', short: 'Automation', tag: 'Automation · beyond websites',
        desc: 'A website brings people in. Automation keeps them: bots that book and remind, apps that run the business, parsers that find new clients.' },
      ru: { name: 'Telegram-боты и\u00a0парсеры', tab: 'Боты и\u00a0парсеры', idx: 'Telegram-боты и\u00a0парсеры', sub: 'Автоматизация', short: 'Автоматизация', tag: 'Автоматизация · не только сайты',
        desc: 'Сайт приводит людей. Автоматизация их удерживает: боты записывают и напоминают, приложения ведут бизнес, парсеры находят новых клиентов.' },
    },
  ];
  const byId = (id) => WORK.find((w) => w.id === id);
  const KIND = { site: 'kind.concept', product: 'kind.product', bots: 'kind.cap' };
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
  const BOTS_THUMB = '<svg viewBox="0 0 64 40" aria-hidden="true"><rect width="64" height="40" style="fill:var(--tg-body)"/><rect x="6" y="6" width="32" height="9" rx="4.5" style="fill:var(--tg-bubble)"/><rect x="26" y="18" width="32" height="8" rx="4" style="fill:var(--tg-me)"/><rect x="6" y="30" width="16" height="5" rx="2" style="fill:var(--tg-bubble)"/><rect x="24" y="30" width="16" height="5" rx="2" style="fill:var(--tg-bubble)"/><rect x="42" y="30" width="16" height="5" rx="2" style="fill:var(--tg-bubble)"/></svg>';

  // ── Состояние ──────────────────────────────────────────
  let lang = store.get('eg-lang') || ((navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'en');
  if (!T[lang]) lang = 'en';
  const t = (k) => T[lang][k] ?? T.en[k] ?? k;
  const fromHash = () => {
    const m = location.hash.match(/^#work-([a-z]+)$/);
    return m && byId(m[1]) ? m[1] : null;
  };
  const initial = fromHash();
  let active = initial || 'ognivo';
  let previewMode = window.innerWidth < 700 ? 'mobile' : 'desktop';
  let workNear = false; // витрина близко к экрану — можно грузить iframe
  let frameTimer = 0;
  const stages = {}; // id → { el, screen, frame }

  const shot = (id, mode) => `assets/shots/${id}-${mode}-${lang}.jpg`;
  const thumbSrc = (w) => (w.kind === 'site' ? `assets/thumbs/${w.id}-${lang}.jpg` : 'assets/thumbs/crm.jpg');
  const syncDemoLang = () => DEMO_KEYS.forEach((k) => store.set(k, lang));

  const hdr = $('[data-hdr]');
  const tabsWrap = $('[data-tabs-wrap]');
  const tabsEl = $('[data-tabs]');
  const panelsEl = $('[data-panels]');
  const live = $('[data-live]');

  // ── Сборка вкладок и панелей (один раз) ────────────────
  function buildShowcase() {
    tabsEl.innerHTML = WORK.map((w, i) => `
      <button class="tab" type="button" role="tab" id="tab-${w.id}" aria-controls="panel-${w.id}" aria-selected="false" tabindex="-1" data-tab="${w.id}" style="--pa:${w.pa};--pt:${w.pt}">
        <span class="tab__top"><span class="tab__no">0${i + 1}</span><span class="tab__kind"></span></span><span class="tab__name"></span><span class="tab__sub"></span>
      </button>`).join('') + '<span class="tabs__bar" aria-hidden="true"></span>';

    panelsEl.innerHTML = WORK.map((w) => `
      <section class="panel" role="tabpanel" id="panel-${w.id}" aria-labelledby="tab-${w.id}" tabindex="0" data-panel="${w.id}" style="--pa:${w.pa};--pt:${w.pt}" hidden>
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
              <img class="device__poster" alt="" decoding="async">
              <span class="device__load" aria-hidden="true"></span>
              <span class="device__pill" aria-hidden="true"><i></i><span data-t="stage.loading"></span></span>
              <button class="device__shield" type="button"><span class="device__hint">${ICON.tap}<span data-t="${coarse ? 'stage.tap' : 'stage.interact'}"></span></span></button>
              <span class="device__veil" aria-hidden="true"></span>
            </div>
          </div>
        </div>
        <p class="stage__hint"><span data-t="${coarse ? 'stage.hintTouch' : 'stage.hint'}"></span><span data-t="stage.real"></span></p>
      </div>`;
    }
    if (w.kind === 'product') {
      return `<div class="stage stage--shots">
        <div class="stage__bar"><span class="stage__live">${ICON.lock}<span class="stage__wide" data-t="stage.shots"></span>${narrow('stage.shotsNarrow')}</span></div>
        <div class="floor">${crops}
          <div class="comp">
            <figure class="device">
              <div class="device__chrome" aria-hidden="true"><i></i><i></i><i></i><span class="device__url">${w.host}</span></div>
              <img src="assets/shots/crm-desktop.jpg" width="1280" height="800" loading="lazy" decoding="async" data-alt="desktop">
            </figure>
            <figure class="comp__phone"><img src="assets/shots/crm-mobile.jpg" width="780" height="1688" loading="lazy" decoding="async" data-alt="mobile"></figure>
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
      $('.tab__sub', tab).textContent = d.sub;
      $('.tab__kind', tab).textContent = t(KIND[w.kind]);
      tab.title = `${d.name} — ${d.sub}`;

      const panel = $(`#panel-${w.id}`);
      const badge = w.kind === 'site' ? ['', t('case.concept')] : w.kind === 'product' ? ['badge--real', t('case.real')] : ['badge--cap', t('case.cap')];
      const count = `0${i + 1} / 0${WORK.length}`;
      let body = '';
      if (w.kind === 'bots') {
        const A = APPS[lang];
        body = `<p class="info__label">${esc(t('bots.tg'))}</p><ul class="feats">${A.tgList.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
          <p class="info__label">${esc(t('bots.parse'))}</p><ul class="feats">${A.parseList.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
          <div class="info__actions"><a class="btn btn--ink" href="#contact"><span>${esc(t('case.discuss'))}</span><span class="arr" aria-hidden="true">→</span></a></div>`;
      } else {
        const actions = w.kind === 'site'
          ? `<a class="btn btn--ink" href="${w.url}" target="_blank" rel="noopener">${esc(t('stage.open'))}</a><a class="btn btn--line" href="#contact">${esc(t('case.similar'))}</a>`
          : `<a class="btn btn--ink" href="#contact"><span>${esc(t('case.ask'))}</span><span class="arr" aria-hidden="true">→</span></a>`;
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
      prefetchPosters();
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
      layoutStage(active);
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

  // ── Вкладки ────────────────────────────────────────────
  function moveBar() {
    const bar = $('.tabs__bar', tabsEl);
    const tab = $(`#tab-${active}`);
    if (!bar || !tab) return;
    tabsEl.style.setProperty('--bar', byId(active).pa);
    bar.style.width = `${tab.offsetWidth}px`;
    bar.style.transform = `translateX(${tab.offsetLeft}px)`;
  }
  function centerChip(smooth) {
    const tab = $(`#tab-${active}`);
    if (!tab || tabsEl.scrollWidth <= tabsEl.clientWidth) return;
    const left = tab.offsetLeft - (tabsEl.clientWidth - tab.offsetWidth) / 2;
    tabsEl.scrollTo({ left: Math.max(0, left), behavior: smooth && !reduceMotion ? 'smooth' : 'auto' });
  }
  // «Смотреть работы», «Работы» в меню и ссылка-пропуск ведут к ряду вкладок (якорь активной вкладки)
  const syncWorkLinks = () => $$('[data-to-work]').forEach((a) => a.setAttribute('href', `#work-${active}`));

  function activate(id, { focus = false, push = true, animate = true, user = false } = {}) {
    if (!byId(id)) id = 'ognivo';
    const prev = active;
    active = id;
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
    if (prev !== id) unloadFrame(prev);
    const w = byId(id);
    if (w.kind === 'site') setPoster(w, workNear);
    layoutStage(id);
    queueFrame(id);
    moveBar();
    centerChip(animate);
    if (id === 'bots') sizeBots();
    updateBotsVisibility();
    syncWorkLinks();
    if (push && location.hash !== `#work-${id}`) history.replaceState(null, '', `#work-${id}`);
    if (focus) $(`#tab-${id}`).focus({ preventScroll: true });
    if (prev !== id) live.textContent = w[lang].name;
    if (user && prev !== id) keepTabsInView(id);
  }
  // Переключение пользователем из глубины длинной панели: новая панель короче — без этого
  // страница «уезжает» в «Услуги»/«Процесс». Возвращаем ряд вкладок и верх новой панели на экран.
  function keepTabsInView(id) {
    const sticky = getComputedStyle(tabsWrap).position === 'sticky';
    const hdrH = hdr.offsetHeight;
    const panelTop = $(`#panel-${id}`).getBoundingClientRect().top;
    const lost = sticky ? panelTop < hdrH + tabsWrap.offsetHeight - 2 : tabsWrap.getBoundingClientRect().top < hdrH - 2;
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

  // ── Указатель работ на первом экране: превью в строках + крупное превью у курсора ──
  function renderIndex() {
    $('[data-render="index"]').innerHTML = WORK.map((w, i) => {
      const d = w[lang];
      const thumb = w.kind === 'bots' ? BOTS_THUMB : `<img src="${thumbSrc(w)}" width="320" height="200" alt="" decoding="async">`;
      return `<li><a href="#work-${w.id}" data-peek-id="${w.id}" style="--pa:${w.pa};--pt:${w.pt}"><span class="index__no">0${i + 1}</span><span class="index__thumb" aria-hidden="true">${thumb}</span><span class="index__name">${esc(d.idx)}</span><span class="index__tag">${esc(d.short)}</span><span class="index__arrow" aria-hidden="true">→</span></a></li>`;
    }).join('');
  }
  const peek = $('[data-peek]');
  const peekImg = $('[data-peek-img]');
  const peekSrc = (id) => (id === 'crm' ? 'assets/shots/crm-desktop.jpg' : id === 'bots' ? null : shot(id, 'desktop'));
  if (finePointer) {
    const pos = { x: 0, y: 0, tx: 0, ty: 0, on: false, raf: 0 };
    const tick = () => {
      pos.x += (pos.tx - pos.x) * (reduceMotion ? 1 : 0.18);
      pos.y += (pos.ty - pos.y) * (reduceMotion ? 1 : 0.18);
      peek.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      pos.raf = (pos.on || Math.abs(pos.tx - pos.x) > 0.5 || Math.abs(pos.ty - pos.y) > 0.5) ? requestAnimationFrame(tick) : 0;
    };
    const list = $('[data-render="index"]');
    // Карточка остаётся в колонке указателя: под строкой (или над ней, если внизу нет места) —
    // текст и кнопки слева никогда не закрываются
    const place = (e, row) => {
      const L = list.getBoundingClientRect();
      const R = row.getBoundingClientRect();
      const w = peek.offsetWidth, h = peek.offsetHeight;
      pos.tx = Math.min(Math.max(e.clientX - w / 2, L.left), L.right - w);
      let y = R.bottom + 10;
      if (y + h > window.innerHeight - 10) y = R.top - 10 - h;
      pos.ty = Math.max(y, hdr.getBoundingClientRect().bottom + 8);
    };
    let row = null;
    list.addEventListener('mouseover', (e) => {
      const a = e.target.closest('a[data-peek-id]');
      if (!a) return;
      row = a;
      const src = peekSrc(a.dataset.peekId);
      if (!src) { peek.classList.remove('is-on'); pos.on = false; return; }
      if (!peekImg.src.endsWith(src)) peekImg.src = src;
      const wasOn = pos.on;
      place(e, a);
      if (!wasOn) { pos.x = pos.tx; pos.y = pos.ty + 14; }
      pos.on = true;
      peek.classList.add('is-on');
      if (!pos.raf) pos.raf = requestAnimationFrame(tick);
    });
    list.addEventListener('mousemove', (e) => { if (pos.on && row) place(e, row); });
    list.addEventListener('mouseleave', () => { pos.on = false; row = null; peek.classList.remove('is-on'); });
    window.addEventListener('scroll', () => { if (pos.on) { pos.on = false; peek.classList.remove('is-on'); } }, { passive: true });
  }

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

  // ── Остальные секции ───────────────────────────────────
  function renderSections() {
    const items = t('ticker');
    $('[data-render="ticker"]').innerHTML = [...items, ...items].map((x) => `<span>${esc(x)}</span>`).join('');
    $('[data-render="services"]').innerHTML = SERVICES[lang].map(([h, p, list], i) => `
      <li data-rv><span class="svc__no">0${i + 1}</span><h3 class="svc__name">${esc(h)}</h3><p class="svc__desc">${esc(p)}</p>
      <ul class="svc__list">${list.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      <span class="svc__ill" aria-hidden="true"><svg viewBox="0 0 120 80">${SVC_ILL[i]}</svg></span></li>`).join('');
    $('[data-render="steps"]').innerHTML = STEPS[lang].map(([h, p], i) => `
      <li class="step" data-rv><span class="step__no">0${i + 1}</span><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`).join('');
    $('[data-render="principles"]').innerHTML = PRINCIPLES[lang].map(([b, s]) => `<li><b>${esc(b)}</b><span>${esc(s)}</span></li>`).join('');
    $('[data-render="facts"]').innerHTML = t('facts').map((x) => `<li>${ICON.check}<span>${x}</span></li>`).join('');
  }

  // Заголовок первого экрана: слова появляются по очереди (только при первой загрузке)
  function splitWords(el) {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(part); return; }
            const s = document.createElement('span');
            s.className = 'wd'; s.style.setProperty('--i', i++); s.textContent = part;
            frag.append(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
  }

  // ── Тема: тёмная по умолчанию, светлая — по кнопке (запоминается) ──
  const themeMeta = $('meta[name="theme-color"]');
  const isDark = () => root.getAttribute('data-theme') !== 'light';
  function syncThemeUI() {
    const dark = isDark();
    themeMeta.setAttribute('content', dark ? '#0a0a0f' : '#f4f2ec');
    $$('[data-theme-toggle]').forEach((b) => {
      if (!$('[data-theme-label]', b)) b.setAttribute('aria-label', t(dark ? 'theme.toLight' : 'theme.toDark'));
    });
    $$('[data-theme-label]').forEach((el) => { el.textContent = t(dark ? 'theme.light' : 'theme.dark'); });
  }
  function toggleTheme() {
    const next = isDark() ? 'light' : 'dark';
    const apply = () => {
      root.setAttribute('data-theme', next);
      store.set('eg-theme', next);
      syncThemeUI();
    };
    if (reduceMotion) { apply(); return; }
    root.classList.add('theme-anim');
    apply();
    setTimeout(() => root.classList.remove('theme-anim'), 520);
  }
  $$('[data-theme-toggle]').forEach((b) => b.addEventListener('click', toggleTheme));

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
    renderIndex();
    renderSections();
    fillShowcase();
    syncThemeUI();
    sizeBots();
    startAnimations();
    observeReveals();
    store.set('eg-lang', lang);
    syncDemoLang();
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
    for (const e of entries) if (!e.isIntersecting) setInteractive(e.target, false);
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
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => { copyBtn.classList.remove('is-done'); label.textContent = t('ct.copy'); }, ok ? 2000 : 3500);
  });

  // ── Шапка, мобильное меню, активный пункт ──────────────
  const menuBtn = $('[data-menu]');
  const mnav = $('#mnav');
  const mnavBd = $('[data-mnav-bd]');
  const setMenu = (open) => { menuBtn.setAttribute('aria-expanded', String(open)); mnav.hidden = !open; mnavBd.hidden = !open; };
  menuBtn.addEventListener('click', () => setMenu(mnav.hidden));
  mnav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  // Касание мимо меню попадает в подложку: меню закрывается, а ссылка под пальцем не срабатывает
  mnavBd.addEventListener('click', () => setMenu(false));
  document.addEventListener('click', (e) => { if (!mnav.hidden && !mnav.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false); });
  // Фокус ушёл из меню (Tab после последнего пункта) — закрываем, чтобы он не оказался под меню
  mnav.addEventListener('focusout', (e) => { if (e.relatedTarget && !mnav.contains(e.relatedTarget) && e.relatedTarget !== menuBtn) setMenu(false); });
  // Окно стало шире 960 px — кнопки меню больше нет, закрываем
  window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !mnav.hidden) { setMenu(false); menuBtn.focus(); } });
  const navLinks = $$('.hdr__nav a');
  const navSection = (a) => (a.hasAttribute('data-to-work') ? 'work' : a.getAttribute('href').slice(1));
  const sections = ['work', 'services', 'process', 'contact'].map((id) => document.getElementById(id));
  let ticking = false;
  let lastCur, lastScrolled;
  const onScroll = () => {
    // сначала все чтения, потом записи — без принудительного пересчёта раскладки на каждом кадре
    const y = window.scrollY, lim = window.innerHeight * 0.4;
    let cur = null;
    for (const s of sections) if (s.getBoundingClientRect().top < lim) cur = s.id;
    const scrolled = y > 8;
    if (scrolled !== lastScrolled) { lastScrolled = scrolled; hdr.classList.toggle('is-scrolled', scrolled); }
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
  }).observe(panelsEl);
  let rz = 0;
  window.addEventListener('resize', () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(() => { layoutStage(active); moveBar(); centerChip(false); }); }, { passive: true });

  // ── Старт ──────────────────────────────────────────────
  $('[data-year]').textContent = new Date().getFullYear();
  $$('.lang button').forEach((b) => b.addEventListener('click', () => { if (b.dataset.lang !== lang) applyLang(b.dataset.lang); }));
  buildShowcase();
  applyLang(lang, true);
  $$('.tg, .term').forEach((el) => visIo.observe(el));
  $$('.stage--site').forEach((el) => { stageIo.observe(el); nearIo.observe(el); });

  // Первый экран показываем, когда загружены шрифты заголовка (не дольше ~1.1 с): иначе заголовок
  // в 146 px успевает перестроиться 2 → 3 → 2 строки и сдвигает всё под ним (CLS)
  const hero = $('.hero');
  const reveal = () => {
    if (hero.classList.contains('is-ready')) return;
    if (!reduceMotion) {
      const title = $('.hero__title');
      splitWords(title);
      // Градиентная фраза: каждому слову — свой кусок одного общего градиента (как у цельного <em>)
      const em = $('em', title);
      if (em) {
        const total = [...em.getClientRects()].reduce((a, r) => a + r.width, 0);
        let acc = 0, prevRight = null, prevTop = null;
        $$('.wd', em).forEach((w) => {
          const r = w.getBoundingClientRect();
          if (prevRight !== null) acc += Math.abs(r.top - prevTop) < 2 ? r.left - prevRight : 0;
          w.style.setProperty('--gw', `${total.toFixed(1)}px`);
          w.style.setProperty('--gx', `${(-acc).toFixed(1)}px`);
          acc += r.width; prevRight = r.right; prevTop = r.top;
        });
      }
      hero.classList.add('is-animating');
      // После появления слова снова становятся обычным текстом — градиент рисует сам <em>, цельно
      setTimeout(() => {
        hero.classList.remove('is-animating');
        $$('.wd', title).forEach((w) => w.replaceWith(w.textContent));
        title.normalize();
      }, 2600);
    }
    hero.classList.add('is-ready');
  };
  if (document.fonts && document.fonts.load) {
    Promise.race([
      Promise.all([document.fonts.load('500 100px Geist'), document.fonts.load('italic 400 100px "Noto Serif Display"')]),
      sleep(1100),
    ]).then(reveal, reveal);
  } else reveal();

  activate(active, { push: false, animate: false });
  // Перезагрузка и «назад/вперёд»: браузер сам вернёт место чтения — к вкладкам не прыгаем
  const navType = performance.getEntriesByType?.('navigation')[0]?.type;
  const restoring = navType === 'reload' || navType === 'back_forward';
  let autoY = -1;
  const toInitial = () => {
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

// ── «Neon ink»: полоса прогресса чтения и «магнитные» главные кнопки ──
(() => {
  const bar = document.querySelector('[data-progress]');
  if (bar) {
    let raf = 0;
    // на телефонах полоса скрыта — не трогаем стили при прокрутке вовсе
    const off = window.matchMedia('(pointer: coarse), (max-width: 860px)');
    let max = 0, last = '';
    const measure = () => { max = document.documentElement.scrollHeight - window.innerHeight; };
    const upd = () => {
      raf = 0;
      if (off.matches) return;
      const v = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)).toFixed(3) : '0';
      if (v !== last) { last = v; bar.style.setProperty('--p', v); }
    };
    measure();
    if ('ResizeObserver' in window) new ResizeObserver(() => { measure(); upd(); }).observe(document.body);
    window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
    window.addEventListener('resize', () => { measure(); if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
    upd();
  }
  // Только мышь и без «уменьшения движения»: кнопка слегка тянется за курсором
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');
  const MAX = 8;
  document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || !fine.matches || still.matches) return;
    const b = e.target.closest && e.target.closest('.btn--accent, .btn--white, .hdr__cta');
    document.querySelectorAll('.btn.is-mag').forEach((x) => { if (x !== b) { x.classList.remove('is-mag'); x.style.translate = ''; } });
    if (!b) return;
    const r = b.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    b.classList.add('is-mag');
    b.style.translate = `${(dx * MAX).toFixed(1)}px ${(dy * MAX * 0.6).toFixed(1)}px`;
  }, { passive: true });
  document.addEventListener('pointerleave', () => document.querySelectorAll('.btn.is-mag').forEach((x) => { x.classList.remove('is-mag'); x.style.translate = ''; }));
})();

// ── Анимации «Neon ink» работают только пока секция на экране (иначе — пауза, без перерисовок) ──
(() => {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => e.target.classList.toggle('is-off', !e.isIntersecting));
  }, { rootMargin: '80px 0px' });
  document.querySelectorAll('.hero, .floor, [data-tabs], .contact').forEach((el) => { el.classList.add('is-off'); io.observe(el); });
})();
