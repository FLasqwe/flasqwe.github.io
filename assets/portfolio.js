// Портфолио Ekimov Gregory — язык EN/RU, кейсы, параллакс, email.
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Адрес собираем в браузере, а не храним целиком в HTML — меньше спама от сборщиков адресов
  const MAIL = ['ekimovgregory9', 'gmail.com'].join('@');

  const T = {
    en: {
      'nav.work': 'Work', 'nav.services': 'Services', 'nav.process': 'Process', 'nav.contact': 'Contact', 'nav.cta': 'Start a project',
      'hero.status': 'Available for new projects',
      'hero.title': 'Websites that <span class="accent">bring clients</span>, not just look nice.',
      'hero.lead': "I'm Gregory — I design and build fast, bilingual websites for restaurants, clinics, construction companies and local businesses. Booking, calculators and lead forms included.",
      'hero.cta1': 'See live demos', 'hero.cta2': 'Discuss your project',
      marquee: 'Restaurants ✦ Dental clinics ✦ Construction ✦ Beauty salons ✦ Real estate ✦ Fitness ✦ Restaurants ✦ Dental clinics ✦ Construction ✦ Beauty salons ✦ Real estate ✦ Fitness ✦',
      'work.kicker': 'Selected work', 'work.title': 'Three niches. <span class="accent">Three different worlds.</span>',
      'work.lead': 'Concept projects built to show what your business can get: each one is fully interactive — open the live demo and click through it.',
      'case.demo': 'Open live demo ↗', 'case.concept': 'Concept project',
      'svc.kicker': 'Services', 'svc.title': 'What I can <span class="accent">build for you</span>',
      'proc.kicker': 'Process', 'proc.title': 'Clear steps, <span class="accent">no surprises</span>',
      'ct.kicker': 'Contact', 'ct.title': "Let's make your<br><span class=\"accent\">next website</span>",
      'ct.lead': "Tell me about your business and what the site should do. I'll reply with ideas, a plan and a price.",
      'ct.copy': 'Copy', 'ct.copied': 'Copied ✓', 'ct.write': 'Write an email', 'ct.subject': 'Website project',
      'foot.note': 'Hand-built, hosted on GitHub Pages. Demo projects are concepts — names, people and data are fictional.', 'foot.top': 'Back to top ↑',
    },
    ru: {
      'nav.work': 'Работы', 'nav.services': 'Услуги', 'nav.process': 'Процесс', 'nav.contact': 'Контакты', 'nav.cta': 'Обсудить проект',
      'hero.status': 'Беру новые проекты',
      'hero.title': 'Сайты, которые <span class="accent">приводят клиентов</span>, а не просто красивые.',
      'hero.lead': 'Я Григорий — проектирую и делаю быстрые двуязычные сайты для ресторанов, клиник, строительных компаний и локального бизнеса. С онлайн-записью, калькуляторами и формами заявок.',
      'hero.cta1': 'Смотреть демо', 'hero.cta2': 'Обсудить проект',
      marquee: 'Рестораны ✦ Стоматологии ✦ Строительство ✦ Салоны красоты ✦ Недвижимость ✦ Фитнес ✦ Рестораны ✦ Стоматологии ✦ Строительство ✦ Салоны красоты ✦ Недвижимость ✦ Фитнес ✦',
      'work.kicker': 'Избранные работы', 'work.title': 'Три ниши. <span class="accent">Три разных мира.</span>',
      'work.lead': 'Концепт-проекты, которые показывают, что может получить ваш бизнес: каждый полностью интерактивный — откройте демо и покликайте.',
      'case.demo': 'Открыть живое демо ↗', 'case.concept': 'Концепт-проект',
      'svc.kicker': 'Услуги', 'svc.title': 'Что я могу <span class="accent">сделать для вас</span>',
      'proc.kicker': 'Процесс', 'proc.title': 'Понятные шаги, <span class="accent">без сюрпризов</span>',
      'ct.kicker': 'Контакты', 'ct.title': 'Сделаем ваш<br><span class="accent">новый сайт</span>',
      'ct.lead': 'Расскажите о бизнесе и о том, что должен делать сайт. Я отвечу идеями, планом и ценой.',
      'ct.copy': 'Скопировать', 'ct.copied': 'Скопировано ✓', 'ct.write': 'Написать письмо', 'ct.subject': 'Проект сайта',
      'foot.note': 'Сделано вручную, размещено на GitHub Pages. Демо-проекты — концепты: названия, люди и данные вымышлены.', 'foot.top': 'Наверх ↑',
    },
  };

  const CASES = [
    {
      id: 'ognivo', glow: '#e3743b', url: 'ognivo/',
      en: { name: 'OGNIVO', tag: 'Restaurant · wood-fired kitchen', desc: 'A dark, atmospheric site for a fine-dining restaurant where everything is cooked over open fire. The mood sells the table before the menu does.',
        feats: ['Live sparks over the hero photo, cinematic intro', 'Tabbed menu: tasting set, à la carte, wine & bar', 'Table booking with validation and confirmation', 'Chef story, gallery, rotating reviews'] },
      ru: { name: 'OGNIVO', tag: 'Ресторан · кухня на живом огне', desc: 'Тёмный атмосферный сайт для ресторана высокой кухни, где всё готовят на открытом огне. Настроение продаёт столик раньше, чем меню.',
        feats: ['Живые искры поверх фото, кинематографичное появление', 'Меню на вкладках: дегустация, основное, вино и бар', 'Бронь столика с проверкой полей и подтверждением', 'История шефа, галерея, отзывы'] },
      chips: ['HTML', 'CSS', 'JavaScript', 'Canvas', 'EN / RU'],
    },
    {
      id: 'luma', glow: '#2fbfa0', url: 'luma/',
      en: { name: 'LUMA Dental', tag: 'Dental clinic · premium', desc: 'A calm, trustworthy site for a dental clinic that turns nervous visitors into booked patients — prices and free time slots are visible upfront.',
        feats: ['Treatment cost calculator with 0% instalments', 'Drag-to-compare whitening before / after slider', 'Booking with doctor choice and live free slots', 'Open / closed status calculated from opening hours'] },
      ru: { name: 'LUMA Dental', tag: 'Стоматология · премиум', desc: 'Спокойный, вызывающий доверие сайт клиники, который превращает тревожных посетителей в записанных пациентов: цены и свободное время видны сразу.',
        feats: ['Калькулятор стоимости лечения с рассрочкой 0%', 'Слайдер «до / после» отбеливания', 'Запись с выбором врача и свободных окон', 'Статус «открыто / закрыто» по часам работы'] },
      chips: ['HTML', 'CSS', 'JavaScript', 'Accessibility', 'EN / RU'],
    },
    {
      id: 'monolit', glow: '#f5c400', url: 'monolit/',
      en: { name: 'MONOLIT', tag: 'Construction · design & build', desc: 'A bold industrial site for a construction company. Big numbers, real projects and an instant cost estimate do the selling for B2B and private clients.',
        feats: ['Blueprint lines drawing over the hero photo', 'Filterable portfolio with project details', 'Cost & timeline estimator with a stage-by-stage breakdown', 'Lead form with drawings upload'] },
      ru: { name: 'MONOLIT', tag: 'Строительство · проектирование', desc: 'Смелый индустриальный сайт строительной компании. Крупные цифры, реальные объекты и мгновенная смета продают и B2B-, и частным клиентам.',
        feats: ['Чертёжные линии, прорисовывающиеся поверх фото', 'Портфолио с фильтрами и карточкой объекта', 'Калькулятор стоимости и сроков с разбивкой по этапам', 'Заявка с прикреплением чертежей'] },
      chips: ['HTML', 'CSS', 'JavaScript', 'SVG', 'EN / RU'],
    },
  ];

  const SVC_ICONS = [
    '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 8h18M8 21h8"/>',
    '<path d="M4 20V9l8-5 8 5v11"/><path d="M9 20v-6h6v6"/>',
    '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h2M14 11h2M8 15h2M14 15h2"/>',
    '<path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path d="M18 3v4h-4M6 21v-4h4"/>',
  ];
  const SERVICES = {
    en: [
      ['Landing page', 'One page that explains the offer and collects leads — for a launch, a service or an ad campaign.', ['Copy structure & design', 'Lead form', 'Analytics setup']],
      ['Business website', 'A full site for a restaurant, clinic, studio or company: services, prices, team, reviews, contacts.', ['Up to ~10 sections', 'Bilingual on request', 'Mobile-first']],
      ['Booking & calculators', 'Interactive parts that sell: online booking, price calculators, quizzes and estimates.', ['Booking flow', 'Price / cost calculator', 'Forms to email / CRM']],
      ['Redesign', 'Your current site looks dated or loses visitors on mobile — I rebuild it fast and modern.', ['Audit of the old site', 'New design', 'Same domain, no downtime']],
    ],
    ru: [
      ['Лендинг', 'Одна страница, которая объясняет предложение и собирает заявки, — для запуска, услуги или рекламы.', ['Структура текста и дизайн', 'Форма заявки', 'Подключение аналитики']],
      ['Сайт для бизнеса', 'Полноценный сайт ресторана, клиники, студии или компании: услуги, цены, команда, отзывы, контакты.', ['До ~10 разделов', 'Два языка по запросу', 'Сначала мобильная версия']],
      ['Запись и калькуляторы', 'Интерактив, который продаёт: онлайн-запись, калькуляторы цены, квизы и сметы.', ['Сценарий записи', 'Калькулятор стоимости', 'Заявки на почту / в CRM']],
      ['Редизайн', 'Текущий сайт устарел или теряет посетителей на телефоне — переделаю быстро и современно.', ['Аудит старого сайта', 'Новый дизайн', 'Тот же домен, без простоя']],
    ],
  };
  const STEPS = {
    en: [['Brief', 'A short call or chat about your business, clients and goals.'], ['Design', 'I show the design of key screens — you comment, I adjust.'], ['Build', 'Responsive, fast, bilingual if needed. You see progress on a live link.'], ['Launch', 'Domain, hosting, analytics — and a short guide on how to update the site.']],
    ru: [['Бриф', 'Короткий созвон или переписка о бизнесе, клиентах и целях.'], ['Дизайн', 'Показываю дизайн ключевых экранов — вы комментируете, я правлю.'], ['Разработка', 'Адаптивно, быстро, на двух языках при необходимости. Прогресс — по живой ссылке.'], ['Запуск', 'Домен, хостинг, аналитика — и короткая инструкция, как обновлять сайт.']],
  };
  const PRINCIPLES = {
    en: [['Mobile-first', 'most visitors come from phones'], ['Fast', 'no heavy builders or bloat'], ['Bilingual', 'EN / RU or any pair'], ['SEO-ready', 'meta, speed, clean markup'], ['Yours', 'files and domain stay with you']],
    ru: [['Сначала мобильная', 'большинство заходит с телефона'], ['Быстро', 'без тяжёлых конструкторов'], ['Два языка', 'EN / RU или любая пара'], ['Готов к SEO', 'мета-теги, скорость, чистая вёрстка'], ['Ваше', 'файлы и домен остаются у вас']],
  };

  // ── Язык ───────────────────────────────────────────────
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* приватный режим */ } },
  };
  let lang = store.get('eg-lang') || ((navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'en');
  const t = (k) => T[lang][k];
  const shot = (name) => `assets/shots/${name}-${lang}.jpg`;

  function applyLang(next) {
    lang = T[next] ? next : 'en';
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach((el) => { const v = t(el.dataset.i18n); if (typeof v === 'string') el.textContent = v; });
    $$('[data-i18n-html]').forEach((el) => { const v = t(el.dataset.i18nHtml); if (typeof v === 'string') el.innerHTML = v; });
    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    document.title = lang === 'ru' ? 'Ekimov Gregory — дизайн и разработка сайтов' : 'Ekimov Gregory — Web design & development';
    $$('[data-shot]').forEach((img) => { img.src = shot(img.dataset.shot); });
    const href = `mailto:${MAIL}?subject=${encodeURIComponent(t('ct.subject'))}`;
    $$('[data-mail], [data-mail-btn]').forEach((a) => { a.href = href; });
    renderAll();
    store.set('eg-lang', lang);
  }

  function renderAll() {
    $('[data-render="cases"]').innerHTML = CASES.map((c, i) => {
      const d = c[lang];
      const host = `flasqwe.github.io/${c.url}`;
      return `<article class="case reveal" style="--glow:${c.glow}">
        <a class="case__visual" href="${c.url}" target="_blank" rel="noopener" aria-label="${esc(d.name)} — ${esc(t('case.demo'))}">
          <div class="browser"><div class="browser__bar"><i></i><i></i><i></i><span>${esc(host)}</span></div><img loading="lazy" src="${shot(c.id + '-desktop')}" alt="${esc(d.name)} — desktop"></div>
          <div class="phone"><img loading="lazy" src="${shot(c.id + '-mobile')}" alt="${esc(d.name)} — mobile"></div>
        </a>
        <div class="case__text">
          <span class="case__no">0${i + 1} / 0${CASES.length}</span><br>
          <span class="case__tag"><i></i>${esc(d.tag)}</span>
          <h3>${esc(d.name)}</h3>
          <p class="case__desc">${esc(d.desc)}</p>
          <ul class="case__feats">${d.feats.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
          <div class="case__chips">${c.chips.map((x) => `<span>${esc(x)}</span>`).join('')}</div>
          <div class="case__actions"><a class="btn" href="${c.url}" target="_blank" rel="noopener">${esc(t('case.demo'))}</a><span class="case__concept">${esc(t('case.concept'))}</span></div>
        </div></article>`;
    }).join('');

    $('[data-render="services"]').innerHTML = SERVICES[lang].map(([h, p, list], i) => `<div class="svc reveal"><span class="svc__icon"><svg viewBox="0 0 24 24" aria-hidden="true">${SVC_ICONS[i]}</svg></span><h3>${esc(h)}</h3><p>${esc(p)}</p><ul>${list.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('');
    $('[data-render="steps"]').innerHTML = STEPS[lang].map(([h, p]) => `<li class="reveal"><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`).join('');
    $('[data-render="principles"]').innerHTML = PRINCIPLES[lang].map(([b, s]) => `<li class="reveal"><b>${esc(b)}</b><span>${esc(s)}</span></li>`).join('');
    observeReveals();
  }

  // ── Появление при скролле ──────────────────────────────
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const sib = $$(':scope > .reveal', e.target.parentElement);
      e.target.style.transitionDelay = `${Math.min(Math.max(sib.indexOf(e.target), 0), 5) * 80}ms`;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  function observeReveals() { $$('.reveal:not(.is-in)').forEach((el) => io.observe(el)); }

  // ── Параллакс веера скриншотов ─────────────────────────
  const stack = $('.hero__stack');
  if (stack && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', (e) => {
      stack.style.setProperty('--mx', (e.clientX / innerWidth - 0.5) * 2);
      stack.style.setProperty('--my', (e.clientY / innerHeight - 0.5) * 2);
    }, { passive: true });
  }

  // ── Копирование email ──────────────────────────────────
  const copyBtn = $('[data-copy]');
  copyBtn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(MAIL); }
    catch {
      // Старые браузеры / нет доступа к буферу — выделяем адрес, чтобы скопировать вручную
      const r = document.createRange(); r.selectNodeContents($('[data-mail]'));
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
    }
    copyBtn.classList.add('is-done');
    copyBtn.firstElementChild.textContent = t('ct.copied');
    setTimeout(() => { copyBtn.classList.remove('is-done'); copyBtn.firstElementChild.textContent = t('ct.copy'); }, 2000);
  });

  // ── Навигация ──────────────────────────────────────────
  const nav = $('.nav');
  const links = $$('.nav__links a');
  const sections = $$('main section[id]');
  let ticking = false;
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', scrollY > 20);
    let cur = null;
    for (const s of sections) if (s.getBoundingClientRect().top < innerHeight * 0.35) cur = s.id;
    links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + cur));
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  $('[data-year]').textContent = new Date().getFullYear();
  $$('.lang button').forEach((b) => b.addEventListener('click', () => applyLang(b.dataset.lang)));
  applyLang(lang);
  onScroll();
})();
