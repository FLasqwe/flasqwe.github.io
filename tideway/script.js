/* TIDEWAY — concept site · script */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const store = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const fine = matchMedia('(pointer: fine)').matches;

  /* ───────────── i18n ───────────── */
  const T = {
    en: {
      skip: 'Skip to content',
      'nav.services': 'Services', 'nav.work': 'Work', 'nav.process': 'Process', 'nav.estimate': 'Estimate', 'nav.studio': 'Studio', 'nav.journal': 'Journal', 'nav.contact': 'Contact', 'nav.cta': 'Start a project',
      'hero.eyebrow': 'Strategy · Brand · Digital · Growth', 'hero.t1': 'Brands that move', 'hero.t2': 'with the tide.',
      'hero.lead': 'TIDEWAY is a strategy-led creative agency. We build identities, products and growth engines for companies that read the market early and move before everyone else notices the water rising.',
      'hero.cta1': 'Start a project', 'hero.cta2': 'See the work',
      'hero.s1': 'projects shipped', 'hero.s2': 'years on the water', 'hero.s3': 'awards & shortlists', 'hero.s4': 'average client rating',
      'tide.label': 'Thames · Tideway reach', 'tide.live': 'live model', 'tide.height': 'height', 'tide.state': 'state', 'tide.next': 'next high', 'tide.nextLow': 'next low',
      'tide.rising': 'Rising', 'tide.falling': 'Falling',
      'tide.note': 'Harmonic model, illustrative. Our rhythm: launch on the flood, review on the ebb.',
      'clients.label': 'Trusted by teams who ship',
      manifesto: 'Most agencies sell noise. We sell timing. Markets move in cycles, attention moves in waves, and the brands that win are the ones that read the current and position themselves before it turns. Strategy first, craft always, vanity never.',
      'services.title': 'What we do', 'services.lead': 'Five disciplines, one team. Pick one, or let us run the whole current from research to revenue.',
      'srv.1.name': 'Research & Strategy', 'srv.1.tag': 'positioning · audience · roadmap', 'srv.1.text': 'We start where the money is: customer interviews, category mapping, pricing and the one promise your brand can actually keep. Output is a positioning and a 12-month roadmap your whole company can quote.', 'srv.1.l1': 'Customer & market research', 'srv.1.l2': 'Positioning & messaging', 'srv.1.l3': 'Go-to-market roadmap', 'srv.1.l4': 'Naming & architecture',
      'srv.2.name': 'Brand & Identity', 'srv.2.tag': 'identity · systems · guidelines', 'srv.2.text': 'Logos are the smallest part. We design living systems: type, colour, motion, voice and packaging that stay coherent from the app icon to the trade-show wall.', 'srv.2.l1': 'Visual identity & logo', 'srv.2.l2': 'Design systems & guidelines', 'srv.2.l3': 'Motion & sound identity', 'srv.2.l4': 'Packaging & print',
      'srv.3.name': 'Web & Product', 'srv.3.tag': 'sites · apps · design systems', 'srv.3.text': 'Marketing sites that load in under a second and products people actually finish onboarding into. Designed and built in-house, measured from day one.', 'srv.3.l1': 'Marketing & e-commerce sites', 'srv.3.l2': 'Web & mobile product design', 'srv.3.l3': 'Front-end & headless CMS', 'srv.3.l4': 'Accessibility & performance',
      'srv.4.name': 'Growth & Performance', 'srv.4.tag': 'paid · SEO · CRO · lifecycle', 'srv.4.text': 'Acquisition that pays for itself. We run paid, search and lifecycle as one funnel with one dashboard, and we report on contribution margin, not impressions.', 'srv.4.l1': 'Paid social & search', 'srv.4.l2': 'SEO & content engine', 'srv.4.l3': 'Conversion optimisation', 'srv.4.l4': 'Email & lifecycle',
      'srv.5.name': 'Content & Social', 'srv.5.tag': 'film · editorial · community', 'srv.5.text': 'Always-on content with a point of view. Film, editorial and social formats designed around what your audience saves and shares, not what the algorithm rewarded last month.', 'srv.5.l1': 'Brand film & campaign', 'srv.5.l2': 'Social strategy & production', 'srv.5.l3': 'Editorial & thought leadership', 'srv.5.l4': 'Community & creators',
      'work.title': 'Selected work', 'work.all': 'All', 'work.brand': 'Brand', 'work.web': 'Web & Product', 'work.growth': 'Growth',
      'process.title': 'Four tides', 'process.lead': 'Every engagement runs the same four phases. Fixed scope per phase, a decision at every turn, no surprises on the invoice.',
      'process.1.name': 'Ebb', 'process.1.sub': 'Research · 2–3 weeks', 'process.1.text': 'The water pulls back and shows the bottom. Interviews, data, competitors, the uncomfortable truths. We leave with a brief everyone has signed.',
      'process.2.name': 'Turn', 'process.2.sub': 'Strategy · 2 weeks', 'process.2.text': 'Positioning, message, creative territory and the roadmap. One deck, one decision meeting, one direction.',
      'process.3.name': 'Flood', 'process.3.sub': 'Build · 4–10 weeks', 'process.3.text': 'Identity, site, product, campaign. Weekly demos of real work, not mood boards. You see it move before it ships.',
      'process.4.name': 'High water', 'process.4.sub': 'Launch & grow · ongoing', 'process.4.text': 'Launch, measure, iterate. Growth retainers start here and pay for themselves or they stop.',
      'est.title': 'Size your project', 'est.lead': 'Honest ballpark in 20 seconds. Pick what you need, we show a range and a timeline. The real number comes after the Ebb phase, never before.',
      'est.fine': 'Ranges are indicative and exclude media budget, VAT and third-party licences.',
      'est.q1': 'What do you need?', 'est.o.strategy': 'Strategy', 'est.o.brand': 'Brand identity', 'est.o.web': 'Website', 'est.o.product': 'Product / app', 'est.o.growth': 'Growth retainer', 'est.o.content': 'Content & film',
      'est.q2': 'Company stage', 'est.st1': 'Early', 'est.st2': 'Scaling', 'est.st3': 'Enterprise',
      'est.q3': 'Urgency', 'est.sp0': 'relaxed', 'est.sp1': 'normal', 'est.sp2': 'yesterday',
      'est.budget': 'Budget', 'est.time': 'Timeline', 'est.team': 'Team', 'est.send': 'Send this brief',
      'est.weeks': 'weeks', 'est.people': 'people', 'est.retainer': '+ retainer', 'est.none': 'Pick at least one service',
      'studio.title': 'The studio', 'studio.lead': 'Twenty-six people in London and Lisbon. Strategists, designers, engineers and producers who sit in the same room and argue in the same channel.',
      'team.1': 'Founder, strategy', 'team.2': 'Creative director', 'team.3': 'Head of engineering', 'team.4': 'Growth lead',
      'studio.open': 'open now', 'studio.closed': 'opens 9:00', 'studio.f3': 'B Corp', 'studio.f3s': 'certified 2024', 'studio.f4': '3 roles', 'studio.f4s': 'open right now →',
      'q.1.text': '“TIDEWAY told us what not to build. That advice alone was worth the whole engagement. Then they built the rest in eight weeks.”', 'q.1.role': 'CEO, Fathom Bank',
      'q.2.text': '“The only agency that reports on margin instead of impressions. Our CAC fell by a third and the brand finally looks like the product.”', 'q.2.role': 'CMO, Kestrel Mobility',
      'q.3.text': '“Weekly demos of real work, no mood boards, no surprises on the invoice. We have rebooked them three times.”', 'q.3.role': 'Founder, Orla Skincare',
      'journal.title': 'Journal', 'journal.all': 'All notes →',
      'j.1.cat': 'Strategy', 'j.1.read': '6 min', 'j.1.title': 'Why most rebrands launch at low tide', 'j.1.text': 'Timing beats craft. The same identity shipped two quarters earlier would have been a different company.',
      'j.2.cat': 'Growth', 'j.2.read': '4 min', 'j.2.title': 'Contribution margin is the only dashboard', 'j.2.text': 'Impressions, CTR and ROAS are weather. Margin is the tide. Here is how we rebuilt our reporting around it.',
      'j.3.cat': 'Craft', 'j.3.read': '8 min', 'j.3.title': 'A one-second website is a design decision', 'j.3.text': 'Performance is not an engineering afterthought. It starts with the typeface and ends with the CMS.',
      'contact.title': "Let's catch the next tide.", 'contact.lead': 'Tell us what is moving in your market. We reply within one working day with a point of view, not a sales deck.',
      'contact.new': 'New business', 'contact.phone': 'Phone', 'contact.ldn': '12 Bankside Wharf, SE1 9JE', 'contact.lis': 'Rua do Alecrim 28, 1200-018',
      'form.name': 'Name', 'form.email': 'Work email', 'form.company': 'Company', 'form.about': 'What is moving?', 'form.aboutPh': 'Goals, timing, what you have tried already…',
      'form.budget': 'Budget', 'form.b0': 'Not sure yet', 'form.b1': '£25–50k', 'form.b2': '£50–120k', 'form.b3': '£120–300k', 'form.b4': '£300k+',
      'form.when': 'Start', 'form.w1': 'As soon as possible', 'form.w2': 'Next quarter', 'form.w3': 'Just exploring',
      'form.send': 'Send', 'form.note': 'Demo form: nothing is sent. In production this posts to the studio CRM.', 'form.okT': 'Received. The tide is turning.', 'form.okS': 'We will reply within one working day.',
      'form.bad': 'Please fill in name, a valid email and a few words about the project.', 'form.prefilled': 'Brief added to the form. Add your details below.',
      'foot.tag': 'Brand, digital & growth agency. London · Lisbon.', 'foot.concept': 'concept · portfolio project',
      'case.challenge': 'Challenge', 'case.approach': 'Approach', 'case.result': 'Result', 'case.prev': '← Previous', 'case.next': 'Next →', 'case.open': 'Open case',
      cat: { brand: 'Brand', web: 'Web & Product', growth: 'Growth', strategy: 'Strategy', content: 'Content' },
    },
    ru: {
      skip: 'К содержимому',
      'nav.services': 'Услуги', 'nav.work': 'Проекты', 'nav.process': 'Процесс', 'nav.estimate': 'Оценка', 'nav.studio': 'Студия', 'nav.journal': 'Журнал', 'nav.contact': 'Контакты', 'nav.cta': 'Начать проект',
      'hero.eyebrow': 'Стратегия · Бренд · Digital · Рост', 'hero.t1': 'Бренды, которые идут', 'hero.t2': 'вместе с приливом.',
      'hero.lead': 'TIDEWAY — креативное агентство, которое начинает со стратегии. Мы строим айдентику, продукты и механики роста для компаний, которые читают рынок раньше других и двигаются до того, как все заметят, что вода поднимается.',
      'hero.cta1': 'Начать проект', 'hero.cta2': 'Смотреть работы',
      'hero.s1': 'проектов запущено', 'hero.s2': 'лет на воде', 'hero.s3': 'наград и шорт-листов', 'hero.s4': 'средняя оценка клиентов',
      'tide.label': 'Темза · участок Tideway', 'tide.live': 'живая модель', 'tide.height': 'уровень', 'tide.state': 'фаза', 'tide.next': 'полная вода', 'tide.nextLow': 'малая вода',
      'tide.rising': 'Прилив', 'tide.falling': 'Отлив',
      'tide.note': 'Гармоническая модель, иллюстрация. Наш ритм: запускаем на приливе, разбираем на отливе.',
      'clients.label': 'Нам доверяют команды, которые выпускают продукт',
      manifesto: 'Большинство агентств продают шум. Мы продаём тайминг. Рынки ходят циклами, внимание — волнами, а побеждают бренды, которые читают течение и занимают позицию до того, как оно повернёт. Сначала стратегия, всегда ремесло, никогда — тщеславие.',
      'services.title': 'Что мы делаем', 'services.lead': 'Пять дисциплин, одна команда. Возьмите одну или отдайте нам всё течение — от исследования до выручки.',
      'srv.1.name': 'Исследования и стратегия', 'srv.1.tag': 'позиционирование · аудитория · роадмап', 'srv.1.text': 'Начинаем там, где деньги: интервью с клиентами, карта категории, цены и то единственное обещание, которое бренд правда может сдержать. На выходе — позиционирование и роадмап на 12 месяцев, который сможет процитировать вся компания.', 'srv.1.l1': 'Исследования клиентов и рынка', 'srv.1.l2': 'Позиционирование и сообщения', 'srv.1.l3': 'Go-to-market роадмап', 'srv.1.l4': 'Нейминг и архитектура бренда',
      'srv.2.name': 'Бренд и айдентика', 'srv.2.tag': 'айдентика · системы · гайдлайны', 'srv.2.text': 'Логотип — самая маленькая часть. Мы проектируем живые системы: шрифт, цвет, движение, голос и упаковку, которые остаются цельными от иконки приложения до стены на выставке.', 'srv.2.l1': 'Визуальная айдентика и логотип', 'srv.2.l2': 'Дизайн-системы и гайдлайны', 'srv.2.l3': 'Motion и звуковая айдентика', 'srv.2.l4': 'Упаковка и печать',
      'srv.3.name': 'Сайты и продукты', 'srv.3.tag': 'сайты · приложения · дизайн-системы', 'srv.3.text': 'Маркетинговые сайты, которые открываются меньше чем за секунду, и продукты, онбординг которых люди реально проходят до конца. Проектируем и собираем внутри студии, измеряем с первого дня.', 'srv.3.l1': 'Маркетинговые и e-commerce сайты', 'srv.3.l2': 'Дизайн веб- и мобильных продуктов', 'srv.3.l3': 'Front-end и headless CMS', 'srv.3.l4': 'Доступность и производительность',
      'srv.4.name': 'Рост и перформанс', 'srv.4.tag': 'paid · SEO · CRO · lifecycle', 'srv.4.text': 'Привлечение, которое окупает само себя. Платный трафик, поиск и lifecycle — одна воронка и один дашборд. Отчитываемся по маржинальному вкладу, а не по показам.', 'srv.4.l1': 'Paid social и контекст', 'srv.4.l2': 'SEO и контентный движок', 'srv.4.l3': 'Оптимизация конверсии', 'srv.4.l4': 'Email и lifecycle',
      'srv.5.name': 'Контент и соцсети', 'srv.5.tag': 'видео · редакция · комьюнити', 'srv.5.text': 'Постоянный контент с позицией. Видео, редакционные и социальные форматы, построенные вокруг того, что аудитория сохраняет и пересылает, а не того, что алгоритм поощрял в прошлом месяце.', 'srv.5.l1': 'Бренд-фильм и кампании', 'srv.5.l2': 'Стратегия и продакшн для соцсетей', 'srv.5.l3': 'Редакция и thought leadership', 'srv.5.l4': 'Комьюнити и креаторы',
      'work.title': 'Избранные проекты', 'work.all': 'Все', 'work.brand': 'Бренд', 'work.web': 'Сайты и продукты', 'work.growth': 'Рост',
      'process.title': 'Четыре прилива', 'process.lead': 'Каждый проект проходит одни и те же четыре фазы. Фиксированный объём на фазу, решение на каждом повороте, никаких сюрпризов в счёте.',
      'process.1.name': 'Отлив', 'process.1.sub': 'Исследование · 2–3 недели', 'process.1.text': 'Вода отступает и показывает дно. Интервью, данные, конкуренты, неудобная правда. Уходим с брифом, который подписали все.',
      'process.2.name': 'Поворот', 'process.2.sub': 'Стратегия · 2 недели', 'process.2.text': 'Позиционирование, сообщение, креативная территория и роадмап. Одна презентация, одна встреча с решением, одно направление.',
      'process.3.name': 'Прилив', 'process.3.sub': 'Производство · 4–10 недель', 'process.3.text': 'Айдентика, сайт, продукт, кампания. Еженедельные демо настоящей работы, а не мудбордов. Вы видите, как это движется, до релиза.',
      'process.4.name': 'Полная вода', 'process.4.sub': 'Запуск и рост · постоянно', 'process.4.text': 'Запуск, измерение, итерации. Здесь начинаются ретейнеры роста — они окупаются или останавливаются.',
      'est.title': 'Оцените проект', 'est.lead': 'Честная вилка за 20 секунд. Выберите, что нужно, — покажем диапазон и сроки. Настоящая цифра появляется после фазы «Отлив», никогда раньше.',
      'est.fine': 'Диапазоны ориентировочные, без медиабюджета, НДС и сторонних лицензий.',
      'est.q1': 'Что нужно?', 'est.o.strategy': 'Стратегия', 'est.o.brand': 'Айдентика', 'est.o.web': 'Сайт', 'est.o.product': 'Продукт / приложение', 'est.o.growth': 'Ретейнер роста', 'est.o.content': 'Контент и видео',
      'est.q2': 'Стадия компании', 'est.st1': 'Ранняя', 'est.st2': 'Масштабирование', 'est.st3': 'Корпорация',
      'est.q3': 'Срочность', 'est.sp0': 'спокойно', 'est.sp1': 'обычно', 'est.sp2': 'вчера',
      'est.budget': 'Бюджет', 'est.time': 'Сроки', 'est.team': 'Команда', 'est.send': 'Отправить этот бриф',
      'est.weeks': 'нед.', 'est.people': 'чел.', 'est.retainer': '+ ретейнер', 'est.none': 'Выберите хотя бы одну услугу',
      'studio.title': 'Студия', 'studio.lead': 'Двадцать шесть человек в Лондоне и Лиссабоне. Стратеги, дизайнеры, инженеры и продюсеры, которые сидят в одной комнате и спорят в одном канале.',
      'team.1': 'Основатель, стратегия', 'team.2': 'Креативный директор', 'team.3': 'Руководитель разработки', 'team.4': 'Лид по росту',
      'studio.open': 'сейчас открыто', 'studio.closed': 'откроется в 9:00', 'studio.f3': 'B Corp', 'studio.f3s': 'сертификат 2024', 'studio.f4': '3 вакансии', 'studio.f4s': 'открыты сейчас →',
      'q.1.text': '«TIDEWAY сказали нам, чего не строить. Один этот совет стоил всего проекта. А потом они собрали остальное за восемь недель».', 'q.1.role': 'CEO, Fathom Bank',
      'q.2.text': '«Единственное агентство, которое отчитывается по марже, а не по показам. CAC упал на треть, а бренд наконец выглядит как продукт».', 'q.2.role': 'CMO, Kestrel Mobility',
      'q.3.text': '«Еженедельные демо настоящей работы, никаких мудбордов, никаких сюрпризов в счёте. Мы возвращались к ним трижды».', 'q.3.role': 'Основатель, Orla Skincare',
      'journal.title': 'Журнал', 'journal.all': 'Все заметки →',
      'j.1.cat': 'Стратегия', 'j.1.read': '6 мин', 'j.1.title': 'Почему большинство ребрендингов выходят на отливе', 'j.1.text': 'Тайминг бьёт ремесло. Та же айдентика, выпущенная на два квартала раньше, сделала бы другую компанию.',
      'j.2.cat': 'Рост', 'j.2.read': '4 мин', 'j.2.title': 'Маржинальный вклад — единственный дашборд', 'j.2.text': 'Показы, CTR и ROAS — это погода. Маржа — это прилив. Рассказываем, как перестроили отчётность вокруг неё.',
      'j.3.cat': 'Ремесло', 'j.3.read': '8 мин', 'j.3.title': 'Сайт за одну секунду — это дизайн-решение', 'j.3.text': 'Производительность — не инженерная доработка в конце. Она начинается со шрифта и заканчивается CMS.',
      'contact.title': 'Поймаем следующий прилив.', 'contact.lead': 'Расскажите, что движется на вашем рынке. Ответим в течение одного рабочего дня — с позицией, а не с продающей презентацией.',
      'contact.new': 'Новые проекты', 'contact.phone': 'Телефон', 'contact.ldn': '12 Bankside Wharf, SE1 9JE', 'contact.lis': 'Rua do Alecrim 28, 1200-018',
      'form.name': 'Имя', 'form.email': 'Рабочая почта', 'form.company': 'Компания', 'form.about': 'Что движется?', 'form.aboutPh': 'Цели, сроки, что уже пробовали…',
      'form.budget': 'Бюджет', 'form.b0': 'Пока не знаю', 'form.b1': '£25–50k', 'form.b2': '£50–120k', 'form.b3': '£120–300k', 'form.b4': '£300k+',
      'form.when': 'Старт', 'form.w1': 'Как можно скорее', 'form.w2': 'В следующем квартале', 'form.w3': 'Пока изучаю',
      'form.send': 'Отправить', 'form.note': 'Демо-форма: ничего не отправляется. В продакшене уходит в CRM студии.', 'form.okT': 'Получили. Прилив начинается.', 'form.okS': 'Ответим в течение одного рабочего дня.',
      'form.bad': 'Заполните имя, корректную почту и пару слов о проекте.', 'form.prefilled': 'Бриф добавлен в форму. Укажите контакты ниже.',
      'foot.tag': 'Агентство бренда, digital и роста. Лондон · Лиссабон.', 'foot.concept': 'концепт · портфолио',
      'case.challenge': 'Задача', 'case.approach': 'Подход', 'case.result': 'Результат', 'case.prev': '← Предыдущий', 'case.next': 'Следующий →', 'case.open': 'Открыть кейс',
      cat: { brand: 'Бренд', web: 'Сайты и продукты', growth: 'Рост', strategy: 'Стратегия', content: 'Контент' },
    },
  };

  let lang = store.get('tideway-lang') || ((navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'en');
  if (!T[lang]) lang = 'en';
  const t = (k) => { const v = T[lang][k]; return v === undefined ? (T.en[k] ?? k) : v; };

  /* ───────────── Cases ───────────── */
  const CASES = [
    { id: 'fathom', cats: ['brand', 'web'], img: 'photo-1556742049-0cfed4f6a45d', kpi: { v: '+38%', en: 'account opens', ru: 'открытий счетов' },
      en: { client: 'Fathom Bank', title: 'A challenger bank that stopped looking like a startup', lead: 'Fathom had the product of a bank and the brand of a crypto wallet. We rebuilt both the identity and the acquisition site in twelve weeks, without pausing growth.',
        ch: 'Trust was the blocker: 61% of drop-offs happened on the first screen of onboarding, and interviews kept using the word “flimsy”.',
        ap: 'A calmer, heavier identity system built on a single typeface and a navy that reads like a vault. A new marketing site with a one-second LCP and an onboarding flow cut from nine screens to four.',
        re: 'Account opens rose 38% in the first quarter, support tickets about “is this legit” fell by half, and the brand survived a Series C deck untouched.',
        kpis: [['+38%', 'account opens'], ['0.9s', 'largest paint'], ['4', 'onboarding screens, was 9']] },
      ru: { client: 'Fathom Bank', title: 'Банк-челленджер, который перестал выглядеть как стартап', lead: 'У Fathom был продукт банка и бренд криптокошелька. Мы пересобрали айдентику и сайт привлечения за двенадцать недель, не останавливая рост.',
        ch: 'Блокером было доверие: 61% отвалов случались на первом экране онбординга, а в интервью постоянно звучало слово «хлипко».',
        ap: 'Более спокойная и тяжёлая система айдентики на одном шрифте и тёмно-синем, который читается как сейф. Новый маркетинговый сайт с LCP в одну секунду и онбординг, сокращённый с девяти экранов до четырёх.',
        re: 'Открытия счетов выросли на 38% в первый квартал, обращения в поддержку «а это вообще легально?» упали вдвое, а бренд без правок пережил раунд Series C.',
        kpis: [['+38%', 'открытий счетов'], ['0,9с', 'largest paint'], ['4', 'экрана онбординга, было 9']] } },
    { id: 'kestrel', cats: ['growth'], img: 'photo-1551288049-bebda4e38f71', kpi: { v: '−34%', en: 'CAC', ru: 'CAC' },
      en: { client: 'Kestrel Mobility', title: 'CAC down a third across three markets', lead: 'An e-bike subscription scaling into Germany and the Netherlands with a funnel that only worked in London.',
        ch: 'Paid was carrying 80% of acquisition at a CAC that made the unit economics negative outside the UK. Attribution was a spreadsheet.',
        ap: 'Rebuilt reporting around contribution margin per city, moved 40% of budget into search and lifecycle, and rewrote the landing pages per market with local proof.',
        re: 'Blended CAC fell 34% in five months, organic share of sign-ups doubled, and the retainer paid for itself in month two.',
        kpis: [['−34%', 'blended CAC'], ['2×', 'organic share'], ['3', 'markets profitable']] },
      ru: { client: 'Kestrel Mobility', title: 'CAC ниже на треть в трёх странах', lead: 'Подписка на электровелосипеды выходила в Германию и Нидерланды с воронкой, которая работала только в Лондоне.',
        ch: 'Платный трафик давал 80% привлечения при CAC, из-за которого юнит-экономика вне Великобритании была отрицательной. Атрибуция жила в таблице.',
        ap: 'Пересобрали отчётность вокруг маржинального вклада по городам, перевели 40% бюджета в поиск и lifecycle, переписали лендинги для каждого рынка с локальными доказательствами.',
        re: 'Смешанный CAC упал на 34% за пять месяцев, доля органических регистраций удвоилась, ретейнер окупился на второй месяц.',
        kpis: [['−34%', 'смешанный CAC'], ['2×', 'доля органики'], ['3', 'прибыльных рынка']] } },
    { id: 'orla', cats: ['brand'], img: 'photo-1556228453-efd6c1ff04f6', kpi: { v: '+120%', en: 'retail doors', ru: 'точек продаж' },
      en: { client: 'Orla Skincare', title: 'From DTC side-project to the shelf at Liberty', lead: 'A founder-led skincare brand with a loyal Instagram following and packaging that disappeared next to anything else.',
        ch: 'Retail buyers loved the formulas and rejected the look. Every product used a different label, and nothing read from two metres away.',
        ap: 'A new identity built on a single wordmark and a colour system by skin concern. Packaging designed for the shelf first and the feed second, plus a brand film shot in the founder’s kitchen.',
        re: 'Listed in Liberty and 40 independent stores within a year. Retail doors up 120%, average order value on the site up 22%.',
        kpis: [['+120%', 'retail doors'], ['+22%', 'AOV online'], ['1', 'wordmark, 14 SKUs']] },
      ru: { client: 'Orla Skincare', title: 'От DTC-хобби до полки в Liberty', lead: 'Уходовая косметика от основательницы с лояльной аудиторией в Instagram и упаковкой, которая терялась рядом с чем угодно.',
        ch: 'Байеры ретейла любили формулы и отвергали внешний вид. У каждого продукта была своя этикетка, и ничего не читалось с двух метров.',
        ap: 'Новая айдентика на одном словесном знаке и цветовой системе по задачам кожи. Упаковка — сначала для полки, потом для ленты, плюс бренд-фильм, снятый на кухне основательницы.',
        re: 'За год — Liberty и 40 независимых магазинов. Точек продаж на 120% больше, средний чек на сайте вырос на 22%.',
        kpis: [['+120%', 'точек продаж'], ['+22%', 'средний чек онлайн'], ['1', 'знак, 14 SKU']] } },
    { id: 'pelago', cats: ['web'], img: 'photo-1520250497591-112f2f40a3f4', kpi: { v: '+52%', en: 'direct bookings', ru: 'прямых броней' },
      en: { client: 'Pelago Hotels', title: 'Direct bookings up 52% once the site stopped fighting the guest', lead: 'Seven boutique hotels, one booking engine from 2014, and 70% of revenue going through OTAs with their commission.',
        ch: 'Guests researched on the site and booked on Booking.com because the site’s own flow took eleven steps and hid the price.',
        ap: 'Redesigned the site around rooms, not the brand. Live availability and price on every room card, three-step checkout, and a loyalty rate only visible when booking direct.',
        re: 'Direct bookings rose 52% year on year, OTA share fell below half, and the site paid for itself in saved commission within four months.',
        kpis: [['+52%', 'direct bookings'], ['3', 'steps to book'], ['<50%', 'OTA share']] },
      ru: { client: 'Pelago Hotels', title: 'Прямых броней на 52% больше, когда сайт перестал мешать гостю', lead: 'Семь бутик-отелей, один движок бронирования 2014 года и 70% выручки через OTA с их комиссией.',
        ch: 'Гости изучали сайт и бронировали на Booking.com, потому что собственный поток занимал одиннадцать шагов и прятал цену.',
        ap: 'Перепроектировали сайт вокруг номеров, а не бренда. Живая доступность и цена на каждой карточке, оформление в три шага и тариф лояльности, видимый только при прямой брони.',
        re: 'Прямые брони выросли на 52% год к году, доля OTA упала ниже половины, сайт окупился сэкономленной комиссией за четыре месяца.',
        kpis: [['+52%', 'прямых броней'], ['3', 'шага до брони'], ['<50%', 'доля OTA']] } },
    { id: 'lumen', cats: ['brand', 'strategy'], img: 'photo-1509391366360-2e959784a276', kpi: { v: '+41', en: 'NPS points', ru: 'пунктов NPS' },
      en: { client: 'Lumen Energy', title: 'Repositioning a utility as a climate company', lead: 'A regional energy supplier losing customers to green challengers while quietly running one of the cleanest grids in the country.',
        ch: 'The product was green; the brand was beige. Nobody knew, and the sales team had no story beyond price.',
        ap: 'Six weeks of research turned one fact — 92% renewable supply — into the entire positioning. New identity, a plain-English tariff page and a campaign built on the actual numbers.',
        re: 'NPS up 41 points in a year, churn down 18%, and the brand now appears in the climate section of the press, not the complaints section.',
        kpis: [['+41', 'NPS points'], ['−18%', 'churn'], ['92%', 'the fact we built on']] },
      ru: { client: 'Lumen Energy', title: 'Переупаковали поставщика энергии в климатическую компанию', lead: 'Региональный поставщик терял клиентов из-за «зелёных» челленджеров, тихо управляя одной из самых чистых сетей в стране.',
        ch: 'Продукт был зелёным, бренд — бежевым. Никто не знал об этом, а у продаж не было истории кроме цены.',
        ap: 'Шесть недель исследований превратили один факт — 92% возобновляемой энергии — в позиционирование целиком. Новая айдентика, тарифная страница простым языком и кампания на реальных цифрах.',
        re: 'NPS вырос на 41 пункт за год, отток упал на 18%, а бренд теперь появляется в климатических рубриках, а не в разделе жалоб.',
        kpis: [['+41', 'пунктов NPS'], ['−18%', 'отток'], ['92%', 'факт, на котором всё построено']] } },
    { id: 'juno', cats: ['growth', 'content'], img: 'photo-1447933601403-0c6688de566e', kpi: { v: '+64%', en: 'retention m6', ru: 'удержание m6' },
      en: { client: 'Juno Coffee', title: 'A subscription that people actually keep', lead: 'A specialty roaster with great first orders and a sixth-month retention curve that looked like a cliff.',
        ch: 'Customers loved the coffee and forgot the subscription existed. Every email was a receipt, and the pause button was the most-used feature.',
        ap: 'A lifecycle programme written like a magazine: origin stories per bag, brewing films, and a “next roast” vote. Growth and content run as one team with one calendar.',
        re: 'Month-six retention up 64%, email revenue up 3×, and the content now sells more than the ads it replaced.',
        kpis: [['+64%', 'retention m6'], ['3×', 'email revenue'], ['−40%', 'paid budget']] },
      ru: { client: 'Juno Coffee', title: 'Подписка, которую люди правда не отменяют', lead: 'Спешелти-обжарщик с отличными первыми заказами и кривой удержания к шестому месяцу, похожей на обрыв.',
        ch: 'Клиенты любили кофе и забывали, что подписка существует. Каждое письмо было чеком, а кнопка «пауза» — самой популярной функцией.',
        ap: 'Lifecycle-программа, написанная как журнал: история происхождения для каждого пакета, видео о заваривании и голосование за «следующую обжарку». Рост и контент — одна команда и один календарь.',
        re: 'Удержание на шестом месяце выросло на 64%, выручка из email — в три раза, а контент теперь продаёт больше, чем реклама, которую он заменил.',
        kpis: [['+64%', 'удержание m6'], ['3×', 'выручка email'], ['−40%', 'платный бюджет']] } },
  ];
  const img = (id, w, h, q = 72) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=${q}`;

  const casesEl = $('#cases');
  let filter = 'all';
  function renderCases() {
    casesEl.innerHTML = CASES.map((c, i) => {
      const L = c[lang];
      return `<button class="case reveal" type="button" data-i="${i}" data-cats="${c.cats.join(' ')}" aria-label="${L.client} — ${t('case.open')}">
        <div class="case__img"><img src="${img(c.img, 1200, 750)}" alt="" loading="lazy" width="1200" height="750"></div>
        <span class="case__arrow" aria-hidden="true">↗</span>
        <div class="case__body">
          <div><span class="case__cat">${L.client} · ${c.cats.map((k) => t('cat')[k]).join(' · ')}</span><h3 class="case__title">${L.title}</h3></div>
          <div class="case__kpi"><b>${c.kpi.v}</b><span>${c.kpi[lang]}</span></div>
        </div></button>`;
    }).join('');
    applyFilter();
    observeReveals();
  }
  function applyFilter() {
    $$('.case', casesEl).forEach((el) => {
      const on = filter === 'all' || el.dataset.cats.split(' ').includes(filter);
      el.classList.toggle('is-off', !on);
    });
  }
  $$('.chip').forEach((b) => b.addEventListener('click', () => {
    filter = b.dataset.f;
    $$('.chip').forEach((x) => x.classList.toggle('is-on', x === b));
    applyFilter();
  }));

  /* modal */
  const modal = $('#modal');
  let cur = 0;
  function openCase(i) {
    cur = (i + CASES.length) % CASES.length;
    const c = CASES[cur], L = c[lang];
    $('#mImg').src = img(c.img, 1400, 580, 75);
    $('#mCat').textContent = `${L.client} · ${c.cats.map((k) => t('cat')[k]).join(' · ')}`;
    $('#mTitle').textContent = L.title; $('#mLead').textContent = L.lead;
    $('#mCh').textContent = L.ch; $('#mAp').textContent = L.ap; $('#mRe').textContent = L.re;
    $('#mKpis').innerHTML = L.kpis.map(([v, l]) => `<li><b>${v}</b><span>${l}</span></li>`).join('');
    modal.hidden = false; document.body.classList.add('modal-open');
    $('.modal__box').scrollTop = 0;
    $('.modal__x').focus();
  }
  function closeCase() { modal.hidden = true; document.body.classList.remove('modal-open'); }
  casesEl.addEventListener('click', (e) => { const b = e.target.closest('.case'); if (b) openCase(+b.dataset.i); });
  $$('[data-close]', modal).forEach((el) => el.addEventListener('click', closeCase));
  $('#mPrev').addEventListener('click', () => openCase(cur - 1));
  $('#mNext').addEventListener('click', () => openCase(cur + 1));
  document.addEventListener('keydown', (e) => {
    if (modal.hidden) return;
    if (e.key === 'Escape') closeCase();
    if (e.key === 'ArrowRight') openCase(cur + 1);
    if (e.key === 'ArrowLeft') openCase(cur - 1);
  });

  /* ───────────── Language ───────────── */
  function applyLang(next) {
    lang = T[next] ? next : 'en';
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach((el) => { const v = t(el.dataset.i18n); if (typeof v === 'string') el.textContent = v; });
    $$('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    document.title = lang === 'ru' ? 'TIDEWAY — агентство бренда, digital и роста' : 'TIDEWAY — brand, digital & growth agency';
    store.set('tideway-lang', lang);
    renderCases(); splitManifesto(); estimate(); tideTick(); clocks();
    if (!modal.hidden) openCase(cur);
    heroTitle.classList.add('in');
  }
  $$('.lang button').forEach((b) => b.addEventListener('click', () => { if (b.dataset.lang !== lang) applyLang(b.dataset.lang); }));

  /* ───────────── Nav ───────────── */
  const nav = $('#nav'), burger = $('.burger'), drawer = $('#drawer');
  let lastY = 0;
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(open)); drawer.hidden = !open; document.body.classList.toggle('menu-open', open);
  });
  $$('a', drawer).forEach((a) => a.addEventListener('click', () => { burger.setAttribute('aria-expanded', 'false'); drawer.hidden = true; document.body.classList.remove('menu-open'); }));
  const navLinks = $$('.nav__links a');
  const secObs = new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id)); });
  }, { rootMargin: '-40% 0px -55% 0px' });
  ['services', 'work', 'process', 'estimate', 'studio', 'journal'].forEach((id) => { const s = document.getElementById(id); if (s) secObs.observe(s); });

  /* ───────────── Reveal ───────────── */
  const revObs = new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target); } }); }, { threshold: .12 });
  function observeReveals() { $$('.reveal:not(.in)').forEach((el) => revObs.observe(el)); }
  const heroTitle = $('.hero__title');
  requestAnimationFrame(() => setTimeout(() => heroTitle.classList.add('in'), 80));

  /* counters */
  const cntObs = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (!e.isIntersecting) return; cntObs.unobserve(e.target);
      const el = e.target, to = parseFloat(el.dataset.count), dec = String(el.dataset.count).includes('.') ? 1 : 0, t0 = performance.now(), dur = reduced ? 1 : 1600;
      const step = (now) => { const p = Math.min(1, (now - t0) / dur), k = 1 - Math.pow(1 - p, 3); el.textContent = (to * k).toFixed(dec); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  }, { threshold: .5 });
  $$('[data-count]').forEach((el) => cntObs.observe(el));

  /* ───────────── Sea canvas ───────────── */
  const sea = $('#sea'), ctx = sea.getContext('2d');
  let W = 0, H = 0, dpr = 1, seaVisible = true, mx = 0, raf = 0, lastFrame = 0;
  function resize() {
    dpr = Math.min(coarse ? 1.5 : 2, devicePixelRatio || 1);
    W = sea.clientWidth; H = sea.clientHeight; sea.width = W * dpr; sea.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const LAYERS = [
    { amp: 22, len: 1.1, speed: .18, y: .66, a: .10, c: '34,224,200' },
    { amp: 30, len: .8, speed: .26, y: .72, a: .13, c: '34,224,200' },
    { amp: 26, len: 1.5, speed: .12, y: .78, a: .18, c: '18,160,150' },
    { amp: 40, len: .6, speed: .34, y: .86, a: .32, c: '9,60,78' },
    { amp: 34, len: .9, speed: .22, y: .93, a: .55, c: '6,30,48' },
  ];
  function drawSea(now) {
    raf = 0;
    if (!seaVisible) return;
    const fps = coarse ? 30 : 60;
    if (now - lastFrame < 1000 / fps - 1) { raf = requestAnimationFrame(drawSea); return; }
    lastFrame = now;
    const tt = now / 1000;
    ctx.clearRect(0, 0, W, H);
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#06101c'); g.addColorStop(1, '#071a2a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const px = (mx - .5) * 30;
    LAYERS.forEach((L, i) => {
      const baseY = H * L.y + (i - 2) * px * .25;
      ctx.beginPath(); ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 6) {
        const k = x / W * Math.PI * 2 * L.len;
        const y = baseY + Math.sin(k + tt * L.speed * 2) * L.amp + Math.sin(k * 2.3 - tt * L.speed * 1.3) * L.amp * .35;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H); ctx.closePath();
      ctx.fillStyle = `rgba(${L.c},${L.a})`; ctx.fill();
      if (i < 3) { ctx.strokeStyle = `rgba(34,224,200,${.18 - i * .04})`; ctx.lineWidth = 1; ctx.stroke(); }
    });
    if (!reduced) raf = requestAnimationFrame(drawSea);
  }
  function startSea() { if (!raf) raf = requestAnimationFrame(drawSea); }
  resize(); addEventListener('resize', () => { resize(); if (reduced) drawSea(performance.now()); });
  new IntersectionObserver((es) => { seaVisible = es[0].isIntersecting; if (seaVisible) startSea(); }).observe(sea);
  if (fine && !reduced) addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth; }, { passive: true });
  startSea();

  /* ───────────── Tide model ───────────── */
  const PERIOD = 44712; // 12h25m12s semi-diurnal
  const tideH = (ts) => 3.6 + 3.1 * Math.sin(2 * Math.PI * (ts / 1000) / PERIOD);
  function tideTick() {
    const now = Date.now();
    const h = tideH(now), dh = tideH(now + 60000) - h, rising = dh > 0;
    let pts = '';
    const span = 6 * 3600 * 1000;
    for (let i = 0; i <= 60; i++) {
      const x = i * 4, y = 86 - (tideH(now - span + i * (2 * span / 60)) / 7.2) * 80;
      pts += (i ? ' L' : 'M') + x + ' ' + y.toFixed(1);
    }
    $('#tideLine').setAttribute('d', pts);
    $('#tideArea').setAttribute('d', pts + ' L240 90 L0 90 Z');
    $('#tideH').textContent = (lang === 'ru' ? h.toFixed(1).replace('.', ',') : h.toFixed(1)) + ' m';
    $('#tideDir').textContent = rising ? t('tide.rising') : t('tide.falling');
    const phase = ((now / 1000) / PERIOD) % 1;
    const nextHigh = ((0.25 - phase + 1) % 1) * PERIOD, nextLow = ((0.75 - phase + 1) % 1) * PERIOD;
    const nxt = rising ? nextHigh : nextLow;
    $('#tideNextL').textContent = rising ? t('tide.next') : t('tide.nextLow');
    const hh = Math.floor(nxt / 3600), mm = Math.floor((nxt % 3600) / 60);
    $('#tideNext').textContent = (lang === 'ru' ? `${hh}ч ${mm}м` : `${hh}h ${mm}m`);
  }
  tideTick(); setInterval(tideTick, 30000);

  /* ───────────── Manifesto ───────────── */
  const man = $('#manifesto');
  function splitManifesto() {
    man.innerHTML = t('manifesto').split(' ').map((w) => `<span class="w">${w}</span>`).join(' ');
  }
  function manifestoScroll() {
    const r = man.getBoundingClientRect(), vh = innerHeight;
    const p = Math.min(1, Math.max(0, (vh * .8 - r.top) / (r.height + vh * .3)));
    const ws = $$('.w', man), n = Math.round(p * ws.length);
    ws.forEach((w, i) => w.classList.toggle('on', i < n));
  }

  /* ───────────── Services accordion + floating image ───────────── */
  const srv = $('#srv'), float = $('#srvFloat'), floatImg = $('img', float);
  $$('.srv__btn', srv).forEach((btn) => btn.addEventListener('click', () => {
    const item = btn.closest('.srv__item'), open = !item.classList.contains('is-open');
    $$('.srv__item', srv).forEach((it) => { it.classList.remove('is-open'); $('.srv__btn', it).setAttribute('aria-expanded', 'false'); });
    if (open) { item.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); }
  }));
  if (fine) {
    let fx = 0, fy = 0, cx = 0, cy = 0, floatRaf = 0;
    const tick = () => { cx += (fx - cx) * .14; cy += (fy - cy) * .14; float.style.transform = ''; float.style.left = cx + 'px'; float.style.top = cy + 'px'; floatRaf = (Math.abs(fx - cx) > .5 || Math.abs(fy - cy) > .5) ? requestAnimationFrame(tick) : 0; };
    srv.addEventListener('pointermove', (e) => { fx = e.clientX + 40; fy = e.clientY; if (!floatRaf) floatRaf = requestAnimationFrame(tick); });
    $$('.srv__item', srv).forEach((it) => {
      it.addEventListener('pointerenter', () => { if (it.classList.contains('is-open')) return; floatImg.src = it.dataset.img; float.classList.add('is-on'); });
      it.addEventListener('pointerleave', () => float.classList.remove('is-on'));
      $('.srv__btn', it).addEventListener('click', () => float.classList.remove('is-on'));
    });
  }

  /* ───────────── Process progress ───────────── */
  const tides = $('#tides'), steps = $$('.tides__step', tides);
  function processScroll() {
    const r = tides.getBoundingClientRect(), vh = innerHeight;
    const p = Math.min(1, Math.max(0, (vh * .75 - r.top) / Math.max(r.height, vh * .5)));
    tides.style.setProperty('--p', (p * 100).toFixed(1) + '%');
    steps.forEach((s, i) => s.classList.toggle('lit', p >= (i + .3) / steps.length));
  }

  /* ───────────── Estimator ───────────── */
  const EST = { strategy: { k: 18, w: 3, p: 2 }, brand: { k: 32, w: 6, p: 3 }, web: { k: 36, w: 7, p: 4 }, product: { k: 60, w: 12, p: 5 }, growth: { k: 36, w: 0, p: 3 }, content: { k: 24, w: 5, p: 3 } };
  const estForm = $('#estForm'), speed = $('#speed');
  const money = (n) => '£' + (n >= 1000 ? (n / 1000).toFixed(n % 1000 ? 1 : 0) + 'm' : Math.round(n) + 'k');
  function estimate() {
    const svcs = $$('input[name=svc]:checked', estForm).map((i) => i.value);
    const stage = parseFloat($('input[name=stage]:checked', estForm).value);
    const sp = +speed.value; $('#speedOut').textContent = t('est.sp' + sp);
    const bEl = $('#estBudget'), tEl = $('#estTime'), pEl = $('#estTeam');
    if (!svcs.length) { bEl.textContent = '—'; tEl.textContent = '—'; pEl.textContent = t('est.none'); return; }
    const priceMul = [0.95, 1, 1.25][sp], timeMul = [1.3, 1, 0.7][sp];
    let k = 0, w = 0, p = 1, retainer = false;
    svcs.forEach((s) => { k += EST[s].k; w += EST[s].w; p = Math.max(p, EST[s].p); if (s === 'growth') retainer = true; });
    k *= stage * priceMul;
    const overlap = svcs.length > 1 ? .72 : 1;
    const weeks = Math.max(3, Math.round(w * overlap * timeMul));
    const people = Math.min(12, p + Math.max(0, svcs.length - 1) + (stage >= 2 ? 1 : 0));
    const lo = money(k * .85), hi = money(k * 1.15);
    const tw = weeks ? `${weeks}–${Math.round(weeks * 1.3)} ${t('est.weeks')}` : '';
    [[bEl, `${lo} – ${hi}`], [tEl, (tw || '') + (retainer ? (tw ? ' ' : '') + t('est.retainer') : '')], [pEl, `${people} ${t('est.people')}`]].forEach(([el, v]) => {
      if (el.textContent !== v) { el.textContent = v; el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick'); }
    });
    estForm.dataset.summary = `${svcs.map((s) => t('est.o.' + s)).join(', ')} · ${$('#estBudget').textContent} · ${$('#estTime').textContent}`;
  }
  estForm.addEventListener('input', estimate);
  $('#estSend').addEventListener('click', () => {
    const ta = $('#form textarea');
    const summary = estForm.dataset.summary || '';
    ta.value = (lang === 'ru' ? 'Бриф из калькулятора: ' : 'Brief from the estimator: ') + summary + '\n';
    document.getElementById('contact').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    toast(t('form.prefilled'));
    setTimeout(() => $('#form input[name=name]').focus({ preventScroll: true }), 700);
  });

  /* ───────────── Clocks ───────────── */
  function clocks() {
    [['LDN', 'Europe/London'], ['LIS', 'Europe/Lisbon']].forEach(([k, tz]) => {
      const d = new Date();
      const time = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
      const parts = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: 'numeric', weekday: 'short', hour12: false }).formatToParts(d);
      const hour = +parts.find((p) => p.type === 'hour').value, wd = parts.find((p) => p.type === 'weekday').value;
      const open = !['Sat', 'Sun'].includes(wd) && hour >= 9 && hour < 18;
      $('#clock' + k).textContent = time;
      const o = $('#open' + k); o.textContent = open ? t('studio.open') : t('studio.closed'); o.classList.toggle('closed', !open);
    });
  }
  clocks(); setInterval(clocks, 15000);

  /* ───────────── Quotes ───────────── */
  const quotes = $$('.quote'), dots = $('#qDots');
  let qi = 0, qTimer = 0;
  quotes.forEach((_, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Quote ' + (i + 1)); b.addEventListener('click', () => showQ(i, true)); dots.appendChild(b); });
  function showQ(i, user) {
    qi = (i + quotes.length) % quotes.length;
    quotes.forEach((q, j) => q.classList.toggle('is-on', j === qi));
    $$('button', dots).forEach((b, j) => b.classList.toggle('is-on', j === qi));
    if (user) restartQ();
  }
  function restartQ() { clearInterval(qTimer); if (!reduced) qTimer = setInterval(() => showQ(qi + 1), 7000); }
  $('#qPrev').addEventListener('click', () => showQ(qi - 1, true));
  $('#qNext').addEventListener('click', () => showQ(qi + 1, true));
  showQ(0); restartQ();

  /* ───────────── Contact form (demo) ───────────── */
  const form = $('#form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name, email = form.email, about = form.about;
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
    [name, email, about].forEach((f) => f.classList.remove('is-bad'));
    const bad = [];
    if (!name.value.trim()) bad.push(name);
    if (!okEmail) bad.push(email);
    if (about.value.trim().length < 5) bad.push(about);
    if (bad.length) { bad.forEach((f) => f.classList.add('is-bad')); bad[0].focus(); toast(t('form.bad')); return; }
    $('#formOk').hidden = false;
    setTimeout(() => { $('#formOk').hidden = true; form.reset(); }, 6000);
  });

  /* ───────────── Toast ───────────── */
  const toastEl = $('#toast'); let toastT = 0;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('is-on'), 3200); }

  /* ───────────── Magnetic buttons (desktop) ───────────── */
  if (fine && !reduced) {
    $$('.magnet').forEach((b) => {
      b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); const x = (e.clientX - r.left - r.width / 2) * .25, y = (e.clientY - r.top - r.height / 2) * .35; b.style.transform = `translate(${x}px,${y}px)`; });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }

  /* ───────────── Scroll loop ───────────── */
  const progress = $('#progress');
  let ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
      nav.classList.toggle('is-scrolled', y > 20);
      nav.classList.toggle('is-hidden', y > lastY && y > 300 && drawer.hidden);
      lastY = y;
      if (!coarse) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      manifestoScroll(); processScroll();
      ticking = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true });

  /* ───────────── Init ───────────── */
  applyLang(lang);
  observeReveals();
  onScroll();
  history.scrollRestoration = 'manual';
})();
