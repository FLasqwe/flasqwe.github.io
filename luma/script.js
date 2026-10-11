// LUMA Dental Studio — язык EN/RU, услуги, калькулятор, «до/после», запись.
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Иконки услуг — линейные, в одном стиле
  const ICONS = {
    tooth: '<path d="M7 3c2.5-1 4 .5 5 .5S14.5 2 17 3c3 1.2 2.6 6 1.6 9.5C17.4 17 17 21 15.3 21c-2 0-1.4-5.5-3.3-5.5S10.7 21 8.7 21C7 21 6.6 17 5.4 12.5 4.4 9 4 4.2 7 3z"/>',
    implant: '<path d="M7 3h10l-1.2 5H8.2zM9 8h6M9.5 11h5M10 14h4M10.5 17h3M12 17v4"/>',
    aligner: '<path d="M3 12c0-4 4-6 9-6s9 2 9 6-4 6-9 6-9-2-9-6z"/><path d="M7 10.5v3M10 10v4M14 10v4M17 10.5v3"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>',
    kid: '<circle cx="12" cy="8" r="4"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7"/><path d="M10 7.5h.01M14 7.5h.01M10.5 9.5c.8.6 2.2.6 3 0"/>',
  };
  const svg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k]}</svg>`;

  // ── Тексты интерфейса ──────────────────────────────────
  const T = {
    en: {
      skip: 'Skip to content',
      'nav.services': 'Services', 'nav.prices': 'Prices', 'nav.results': 'Results', 'nav.doctors': 'Doctors', 'nav.faq': 'FAQ', 'nav.book': 'Book a visit',
      'hero.pill': 'Open today until 21:00',
      'hero.title': 'Calm dentistry.<br><span class="hl">Confident</span> smiles.',
      'hero.lead': 'Painless treatment with computer-controlled anaesthesia, a fixed price agreed before we start, and doctors who explain every step. No pressure, no surprises.',
      'hero.cta1': 'Book a free consultation', 'hero.cta2': 'Estimate the cost',
      'hero.t1': 'rating, 1,200+ reviews', 'hero.t2': 'years of practice', 'hero.t3': 'installments up to 12 months',
      'hero.slot': 'Next free slot', 'hero.slotTime': 'Today, 16:30', 'hero.pain': 'Painless', 'hero.painSub': 'computer anaesthesia', 'hero.rating': 'Loved by 38,000 patients',
      'bar.1': 'years caring for smiles', 'bar.2': 'doctors, 4 specialities', 'bar.3': 'happy patients', 'bar.yrs': 'yrs', 'bar.4': 'warranty on implants',
      'svc.kicker': 'Services', 'svc.title': 'Everything your smile needs, <span class="hl">under one roof</span>',
      'care.kicker': 'How we work', 'care.title': 'Afraid of the dentist? <span class="hl">We built this clinic for you.</span>',
      'care.badgeT': '97%', 'care.badge': 'of patients felt no pain during treatment',
      'care.s1': 'Free first consultation', 'care.s1d': '3D scan, photos and an honest talk. You leave with a written plan — and no obligation.',
      'care.s2': 'Fixed price before we start', 'care.s2d': 'The number in your plan is the number you pay. If we change anything, you decide first.',
      'care.s3': 'Treatment without pain', 'care.s3d': 'Computer-controlled anaesthesia, noise-cancelling headphones, a blanket and breaks whenever you want.',
      'care.s4': 'Care after the visit', 'care.s4d': 'Your doctor checks in the next day and you get a personal reminder for hygiene every 6 months.',
      'calc.kicker': 'Price estimate', 'calc.title': 'Know the price <span class="hl">before you come</span>',
      'calc.lead': 'Pick a treatment and see a realistic range in seconds. The final price is fixed after a free consultation.',
      'calc.what': 'Treatment', 'calc.ct': '3D CT scan included', 'calc.sed': 'Sleep sedation', 'calc.range': 'Estimated range',
      'calc.or': 'or from', 'calc.per': '/ month, 0% for 12 months', 'calc.cta': 'Lock this price — book a consultation',
      'res.kicker': 'Results', 'res.title': 'Up to 8 shades whiter <span class="hl">in one visit</span>',
      'res.lead': 'Professional whitening with a cold LED lamp — no sensitivity, 60 minutes, results that last up to two years with proper care.',
      'res.l1': 'Enamel stays protected — gel with fluoride and potassium nitrate', 'res.l2': 'Shade measured before and after with a digital spectrometer', 'res.l3': 'Home care kit included',
      'res.note': 'Drag the slider. Visual simulation for illustration.', 'res.before': 'Before', 'res.after': 'After',
      'tech.kicker': 'Technology', 'tech.title': 'Precision you can <span class="hl">see on screen</span>',
      'doc.kicker': 'Doctors', 'doc.title': "People you'll <span class=\"hl\">trust with your smile</span>", 'doc.lead': 'Every doctor has at least 8 years of practice and trains abroad every year.',
      'doc.book': 'Book with this doctor', 'doc.yrs': 'years',
      'rev.kicker': 'Reviews', 'rev.title': 'What patients <span class="hl">say after</span>',
      'faq.kicker': 'FAQ', 'faq.title': 'Questions we hear <span class="hl">every day</span>',
      'book.kicker': 'Online booking', 'book.title': 'Book in <span class="hl">30 seconds</span>',
      'book.lead': 'Choose a time that suits you — the administrator will call within 15 minutes to confirm.',
      'book.addr': '12 Svetlaya St., Moscow · 3 min from the metro', 'book.hours': 'Mon–Sat 9:00–21:00 · Sun 10:00–18:00',
      'book.service': 'Service', 'book.doctor': 'Doctor', 'book.any': 'Any available doctor', 'book.day': 'Day', 'book.time': 'Time',
      'book.name': 'Your name', 'book.phone': 'Phone', 'book.consent': 'I agree to the processing of my personal data', 'book.submit': 'Book a visit',
      'book.okTitle': "You're booked in", 'book.again': 'Book another visit', 'book.noSlots': 'No free slots this day — please pick another.',
      'book.errSlot': 'Please choose a time.', 'book.errName': 'Please enter your name.', 'book.errPhone': 'Please enter a phone number we can call.', 'book.errConsent': 'Please confirm the consent to continue.',
      'book.done': (d) => `${d.name}, we've reserved ${d.when} for “${d.service}”${d.doctor ? ' with ' + d.doctor : ''}. The administrator will call ${d.phone} within 15 minutes. (Demo — nothing was sent.)`,
      'foot.tag': 'Calm dentistry. Confident smiles.', 'foot.license': 'Medical licence № 00-00-000000 (demo)', 'foot.concept': 'Concept website · portfolio project',
      'foot.warn': 'There are contraindications — a specialist consultation is required.',
      today: 'Today', tomorrow: 'Tomorrow',
      openNow: (h) => `Open now until ${h}:00`, opensAt: (d, h) => `Closed now · opens ${d} at ${h}:00`,
    },
    ru: {
      skip: 'К содержимому',
      'nav.services': 'Услуги', 'nav.prices': 'Цены', 'nav.results': 'Результаты', 'nav.doctors': 'Врачи', 'nav.faq': 'Вопросы', 'nav.book': 'Записаться',
      'hero.pill': 'Сегодня открыты до 21:00',
      'hero.title': 'Спокойная стоматология.<br><span class="hl">Уверенная</span> улыбка.',
      'hero.lead': 'Лечение без боли с компьютерной анестезией, фиксированная цена до начала работ и врачи, которые объясняют каждый шаг. Без давления и сюрпризов.',
      'hero.cta1': 'Бесплатная консультация', 'hero.cta2': 'Рассчитать стоимость',
      'hero.t1': 'рейтинг, 1 200+ отзывов', 'hero.t2': 'лет практики', 'hero.t3': 'рассрочка до 12 месяцев',
      'hero.slot': 'Ближайшее окно', 'hero.slotTime': 'Сегодня, 16:30', 'hero.pain': 'Без боли', 'hero.painSub': 'компьютерная анестезия', 'hero.rating': 'Нам доверяют 38 000 пациентов',
      'bar.1': 'лет заботимся об улыбках', 'bar.2': 'врачей, 4 направления', 'bar.3': 'довольных пациентов', 'bar.yrs': 'лет', 'bar.4': 'гарантия на импланты',
      'svc.kicker': 'Услуги', 'svc.title': 'Всё для вашей улыбки — <span class="hl">в одной клинике</span>',
      'care.kicker': 'Как мы работаем', 'care.title': 'Боитесь стоматолога? <span class="hl">Мы сделали клинику для вас.</span>',
      'care.badgeT': '97%', 'care.badge': 'пациентов не почувствовали боли во время лечения',
      'care.s1': 'Бесплатная первая консультация', 'care.s1d': '3D-снимок, фото и честный разговор. Вы уходите с письменным планом — и без обязательств.',
      'care.s2': 'Фиксированная цена до начала', 'care.s2d': 'Сумма в плане — это сумма, которую вы платите. Если что-то меняется, сначала решаете вы.',
      'care.s3': 'Лечение без боли', 'care.s3d': 'Компьютерная анестезия, наушники с шумоподавлением, плед и паузы, когда попросите.',
      'care.s4': 'Забота после визита', 'care.s4d': 'Врач позвонит на следующий день, а раз в полгода придёт напоминание о гигиене.',
      'calc.kicker': 'Расчёт стоимости', 'calc.title': 'Узнайте цену <span class="hl">ещё до визита</span>',
      'calc.lead': 'Выберите лечение — и за секунды увидите реальный диапазон. Итоговая цена фиксируется после бесплатной консультации.',
      'calc.what': 'Лечение', 'calc.ct': '3D-снимок (КТ) включён', 'calc.sed': 'Лечение во сне', 'calc.range': 'Примерная стоимость',
      'calc.or': 'или от', 'calc.per': '/ мес, рассрочка 0% на 12 месяцев', 'calc.cta': 'Зафиксировать цену — записаться',
      'res.kicker': 'Результаты', 'res.title': 'До 8 тонов белее <span class="hl">за один визит</span>',
      'res.lead': 'Профессиональное отбеливание холодной LED-лампой — без чувствительности, 60 минут, эффект до двух лет при правильном уходе.',
      'res.l1': 'Эмаль под защитой — гель со фтором и нитратом калия', 'res.l2': 'Оттенок измеряем до и после цифровым спектрометром', 'res.l3': 'Набор для домашнего ухода в подарок',
      'res.note': 'Потяните ползунок. Визуальная симуляция для иллюстрации.', 'res.before': 'До', 'res.after': 'После',
      'tech.kicker': 'Технологии', 'tech.title': 'Точность, которую <span class="hl">видно на экране</span>',
      'doc.kicker': 'Врачи', 'doc.title': 'Люди, которым <span class="hl">доверяют улыбку</span>', 'doc.lead': 'У каждого врача не меньше 8 лет практики и ежегодное обучение за рубежом.',
      'doc.book': 'Записаться к врачу', 'doc.yrs': 'лет',
      'rev.kicker': 'Отзывы', 'rev.title': 'Что говорят <span class="hl">после приёма</span>',
      'faq.kicker': 'Вопросы', 'faq.title': 'Вопросы, которые <span class="hl">задают каждый день</span>',
      'book.kicker': 'Онлайн-запись', 'book.title': 'Запись <span class="hl">за 30 секунд</span>',
      'book.lead': 'Выберите удобное время — администратор перезвонит в течение 15 минут и подтвердит запись.',
      'book.addr': 'Москва, ул. Светлая, 12 · 3 минуты от метро', 'book.hours': 'Пн–Сб 9:00–21:00 · Вс 10:00–18:00',
      'book.service': 'Услуга', 'book.doctor': 'Врач', 'book.any': 'Любой свободный врач', 'book.day': 'День', 'book.time': 'Время',
      'book.name': 'Ваше имя', 'book.phone': 'Телефон', 'book.consent': 'Согласен на обработку персональных данных', 'book.submit': 'Записаться',
      'book.okTitle': 'Вы записаны', 'book.again': 'Записаться ещё раз', 'book.noSlots': 'В этот день свободных окон нет — выберите другой.',
      'book.errSlot': 'Выберите время.', 'book.errName': 'Укажите имя.', 'book.errPhone': 'Укажите телефон, по которому можно позвонить.', 'book.errConsent': 'Подтвердите согласие, чтобы продолжить.',
      'book.done': (d) => `${d.name}, забронировали ${d.when} — «${d.service}»${d.doctor ? ', врач: ' + d.doctor : ''}. Администратор перезвонит на ${d.phone} в течение 15 минут. (Демо — заявка никуда не отправлена.)`,
      'foot.tag': 'Спокойная стоматология. Уверенная улыбка.', 'foot.license': 'Лицензия № 00-00-000000 (демо)', 'foot.concept': 'Концепт-сайт · проект для портфолио',
      'foot.warn': 'Имеются противопоказания, необходима консультация специалиста.',
      today: 'Сегодня', tomorrow: 'Завтра',
      openNow: (h) => `Сейчас открыто до ${h}:00`, opensAt: (d, h) => `Сейчас закрыто · откроемся ${d} в ${h}:00`,
    },
  };

  // Часы работы: Пн–Сб 9–21, Вс 10–18 — те же, что в контактах
  const HOURS = (d) => (d.getDay() === 0 ? [10, 18] : [9, 21]);
  function updateOpenPill() {
    const now = new Date();
    const [o, c] = HOURS(now);
    const h = now.getHours() + now.getMinutes() / 60;
    const pill = $('.pill');
    if (h >= o && h < c) { pill.querySelector('span:last-child').textContent = T[lang].openNow(c); pill.classList.remove('is-closed'); return; }
    const next = new Date(now); if (h >= c) next.setDate(next.getDate() + 1);
    const when = next.getDate() === now.getDate() ? T[lang].today.toLowerCase() : T[lang].tomorrow.toLowerCase();
    pill.querySelector('span:last-child').textContent = T[lang].opensAt(when, HOURS(next)[0]);
    pill.classList.add('is-closed');
  }

  // ── Данные ─────────────────────────────────────────────
  const SERVICES = [
    { id: 'treat', icon: 'tooth', en: ['Treatment & fillings', 'Caries treated under a microscope, invisible composite fillings, root canals in one visit.', 'from $90'], ru: ['Лечение и пломбы', 'Кариес под микроскопом, незаметные композитные пломбы, каналы за один визит.', 'от 6 500 ₽'] },
    { id: 'implant', icon: 'implant', en: ['Dental implants', 'Swiss and Korean systems, guided surgery from a 3D plan, temporary tooth the same day.', 'from $1,200'], ru: ['Имплантация', 'Швейцарские и корейские системы, навигационная хирургия по 3D-плану, временный зуб в день операции.', 'от 95 000 ₽'] },
    { id: 'align', icon: 'aligner', en: ['Aligners & braces', 'Clear aligners or ceramic braces. See your future smile in a 3D simulation first.', 'from $3,500'], ru: ['Элайнеры и брекеты', 'Прозрачные элайнеры или керамические брекеты. Сначала — 3D-симуляция будущей улыбки.', 'от 260 000 ₽'] },
    { id: 'white', icon: 'spark', en: ['Whitening & veneers', 'Cold-light whitening up to 8 shades, ultra-thin ceramic veneers designed digitally.', 'from $290'], ru: ['Отбеливание и виниры', 'Холодное отбеливание до 8 тонов, ультратонкие керамические виниры по цифровому дизайну.', 'от 22 000 ₽'] },
    { id: 'hygiene', icon: 'drop', en: ['Professional hygiene', 'Air Flow and ultrasound, polishing and fluoride — 60 minutes, gentle on gums.', 'from $110'], ru: ['Профгигиена', 'Air Flow и ультразвук, полировка и фторирование — 60 минут, бережно к дёснам.', 'от 7 900 ₽'] },
    { id: 'kids', icon: 'kid', en: ['Kids dentistry', 'A separate playroom, cartoons on the ceiling and doctors who know how to make friends.', 'from $60'], ru: ['Детская стоматология', 'Отдельная игровая, мультики на потолке и врачи, которые умеют дружить с детьми.', 'от 4 500 ₽'] },
  ];

  // Калькулятор: диапазон цены за единицу в каждой валюте
  const CALC = [
    { id: 'implant', unit: true, max: 8, usd: [1200, 1800], rub: [95000, 140000],
      en: ['Implant', 'Implants'], ru: ['Имплант', 'Имплантов'],
      incl: { en: ['Implant + abutment + crown', 'Guided surgery from a 3D plan', '10-year warranty'], ru: ['Имплант + абатмент + коронка', 'Навигационная хирургия по 3D-плану', 'Гарантия 10 лет'] } },
    { id: 'veneers', unit: true, max: 10, usd: [650, 950], rub: [48000, 75000],
      en: ['Veneers', 'Veneers'], ru: ['Виниры', 'Виниров'],
      incl: { en: ['Digital smile design', 'Trial smile before final', 'E.max ceramics'], ru: ['Цифровой дизайн улыбки', 'Примерка до финала', 'Керамика E.max'] } },
    { id: 'aligners', unit: false, usd: [3500, 5200], rub: [260000, 390000],
      en: ['Aligners', ''], ru: ['Элайнеры', ''],
      incl: { en: ['3D simulation of your result', 'All aligner sets', 'Retainers after treatment'], ru: ['3D-симуляция результата', 'Все комплекты капп', 'Ретейнеры после лечения'] } },
    { id: 'whitening', unit: true, max: 3, usd: [290, 390], rub: [22000, 29000],
      en: ['Whitening', 'Sessions'], ru: ['Отбеливание', 'Сеансов'],
      incl: { en: ['Hygiene before whitening', 'Cold LED lamp', 'Home care kit'], ru: ['Гигиена перед отбеливанием', 'Холодная LED-лампа', 'Набор для домашнего ухода'] } },
    { id: 'fillings', unit: true, max: 8, usd: [90, 160], rub: [6500, 12000],
      en: ['Fillings', 'Teeth'], ru: ['Пломбы', 'Зубов'],
      incl: { en: ['Treatment under a microscope', 'Computer anaesthesia', '2-year warranty'], ru: ['Лечение под микроскопом', 'Компьютерная анестезия', 'Гарантия 2 года'] } },
  ];
  const EXTRAS = { ct: { usd: 70, rub: 5000 }, sed: { usd: 250, rub: 18000 } };

  const TECH = {
    en: [['3D CT & intraoral scanning', 'No messy impressions — a precise 3D model of your mouth in 2 minutes.'], ['Dental microscope', '25× magnification so we save healthy tissue and treat canals precisely.'], ['Computer anaesthesia', 'The Wand system delivers anaesthetic slowly and painlessly, even for the palate.'], ['Digital smile design', 'See and approve your new smile on screen before any treatment starts.']],
    ru: [['3D КТ и интраоральный сканер', 'Никаких слепков — точная 3D-модель зубов за 2 минуты.'], ['Дентальный микроскоп', 'Увеличение в 25 раз: сохраняем здоровые ткани и точно лечим каналы.'], ['Компьютерная анестезия', 'Система The Wand вводит анестетик медленно и безболезненно — даже в нёбо.'], ['Цифровой дизайн улыбки', 'Вы видите и утверждаете новую улыбку на экране до начала лечения.']],
  };

  const DOCTORS = [
    { id: 'sokolova', img: '1706565029539-d09af5896340', yrs: 18, en: ['Dr. Elena Sokolova', 'Chief doctor · Implantologist', ['Implants', 'Bone grafting', 'All-on-4']], ru: ['Елена Соколова', 'Главный врач · имплантолог', ['Импланты', 'Костная пластика', 'All-on-4']] },
    { id: 'volkov', img: '1642541724244-83d49288a86b', yrs: 12, en: ['Dr. Artem Volkov', 'Orthodontist', ['Aligners', 'Ceramic braces', 'Kids']], ru: ['Артём Волков', 'Ортодонт', ['Элайнеры', 'Керамические брекеты', 'Дети']] },
    { id: 'lebedeva', img: '1678695972687-033fa0bdbac9', yrs: 10, en: ['Dr. Maria Lebedeva', 'Aesthetic dentist', ['Veneers', 'Whitening', 'Smile design']], ru: ['Мария Лебедева', 'Стоматолог-эстетист', ['Виниры', 'Отбеливание', 'Дизайн улыбки']] },
    { id: 'orlov', img: '1756699279298-c89cdef354ab', yrs: 9, en: ['Dr. Ivan Orlov', 'Therapist · Endodontist', ['Microscope', 'Root canals', 'Fillings']], ru: ['Иван Орлов', 'Терапевт · эндодонтист', ['Микроскоп', 'Каналы', 'Пломбы']] },
  ];

  const REVIEWS = {
    en: [['I hadn’t been to a dentist in 7 years out of fear. Here I literally felt nothing — and they explained everything on the screen.', 'Kate M.', 'Treatment & fillings'], ['Two implants in one day with a temporary crown. The price in the plan was exactly the price I paid. No surprises.', 'Paul R.', 'Implants'], ['My son now asks when we’re going back. The kids room and Dr. Volkov are magic.', 'Olga T.', 'Kids dentistry']],
    ru: [['7 лет не ходила к стоматологу из-за страха. Здесь не почувствовала вообще ничего — и всё объяснили на экране.', 'Екатерина М.', 'Лечение и пломбы'], ['Два импланта за один день с временной коронкой. Цена в плане совпала с итоговой до рубля. Никаких сюрпризов.', 'Павел Р.', 'Имплантация'], ['Сын теперь сам спрашивает, когда мы снова пойдём. Детская комната и Артём Волков творят чудеса.', 'Ольга Т.', 'Детская стоматология']],
  };

  const FAQ = {
    en: [['Will it hurt?', 'Almost certainly not. We use computer-controlled anaesthesia and apply a numbing gel first, so you don’t feel the injection either. For very anxious patients we offer sleep sedation with an anaesthesiologist.'], ['Is the first consultation really free?', 'Yes. It includes an examination, intraoral scan and a written treatment plan with fixed prices. You are under no obligation to continue.'], ['Can I pay in instalments?', 'Yes — 0% for up to 12 months with no overpayment, arranged in 10 minutes at the clinic with your passport.'], ['What warranty do you give?', '10 years on implants, 5 years on crowns and veneers, 2 years on fillings — provided you attend check-ups every 6 months.'], ['From what age do you see children?', 'From the first tooth. The first visit is a play-based meeting with the doctor so the child gets used to the clinic.']],
    ru: [['Будет больно?', 'Почти наверняка нет. Мы используем компьютерную анестезию и сначала наносим обезболивающий гель — укол вы тоже не почувствуете. Для очень тревожных пациентов есть лечение во сне с анестезиологом.'], ['Консультация правда бесплатная?', 'Да. В неё входит осмотр, сканирование и письменный план лечения с фиксированными ценами. Продолжать лечение вы не обязаны.'], ['Можно в рассрочку?', 'Да — 0% до 12 месяцев без переплаты, оформление за 10 минут в клинике по паспорту.'], ['Какая гарантия?', '10 лет на импланты, 5 лет на коронки и виниры, 2 года на пломбы — при условии осмотров раз в полгода.'], ['С какого возраста принимаете детей?', 'С первого зуба. Первый визит — знакомство с врачом в игровой форме, чтобы ребёнок привык к клинике.']],
  };

  // ── Язык ───────────────────────────────────────────────
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* приватный режим */ } },
  };
  let lang = store.get('luma-lang') || ((navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'en');
  const t = (k) => T[lang][k];
  const money = (n) => lang === 'ru'
    ? new Intl.NumberFormat('ru-RU').format(Math.round(n / 100) * 100) + ' ₽'
    : '$' + new Intl.NumberFormat('en-US').format(Math.round(n / 10) * 10);

  function applyLang(next) {
    lang = T[next] ? next : 'en';
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach((el) => { const v = t(el.dataset.i18n); if (typeof v === 'string') el.textContent = v; });
    $$('[data-i18n-html]').forEach((el) => { const v = t(el.dataset.i18nHtml); if (typeof v === 'string') el.innerHTML = v; });
    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    document.title = lang === 'ru' ? 'LUMA Dental Studio — спокойная стоматология без боли' : 'LUMA Dental Studio — calm, painless dentistry';
    renderAll();
    updateOpenPill();
    store.set('luma-lang', lang);
  }

  // ── Отрисовка блоков из данных ─────────────────────────
  const arrow = '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  function renderAll() {
    $('[data-render="services"]').innerHTML = SERVICES.map((s) => {
      const [name, desc, price] = s[lang];
      return `<a class="svc reveal" href="#book" data-service="${s.id}"><span class="svc__icon">${svg(s.icon)}</span><h3>${esc(name)}</h3><p>${esc(desc)}</p><div class="svc__foot"><span class="svc__price">${esc(price)}</span><span class="svc__arrow">${arrow}</span></div></a>`;
    }).join('');

    $('[data-render="tech"]').innerHTML = TECH[lang].map(([h, p]) => `<div class="tech__item reveal"><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('');

    $('[data-render="doctors"]').innerHTML = DOCTORS.map((d) => {
      const [name, role, tags] = d[lang];
      return `<article class="doc reveal"><div class="doc__photo"><img loading="lazy" src="https://images.unsplash.com/photo-${d.img}?auto=format&fit=crop&w=700&h=800&q=75" alt="${esc(name)}"><span class="doc__exp">${d.yrs} ${esc(t('doc.yrs'))}</span></div>
        <div class="doc__body"><h3>${esc(name)}</h3><p class="doc__role">${esc(role)}</p><div class="doc__tags">${tags.map((x) => `<span>${esc(x)}</span>`).join('')}</div><a class="doc__book" href="#book" data-doctor="${d.id}">${esc(t('doc.book'))}</a></div></article>`;
    }).join('');

    $('[data-render="reviews"]').innerHTML = REVIEWS[lang].map(([q, n, s]) => `<figure class="rev reveal"><span class="rev__stars" aria-label="5/5">★★★★★</span><blockquote>${esc(q)}</blockquote><figcaption><span class="rev__ava">${esc(n[0])}</span><div><b>${esc(n)}</b><small>${esc(s)}</small></div></figcaption></figure>`).join('');

    $('[data-render="faq"]').innerHTML = FAQ[lang].map(([q, a], i) => `<details class="qa reveal"${i === 0 ? ' open' : ''}><summary>${esc(q)}<i aria-hidden="true"></i></summary><div class="qa__a"><div><p>${esc(a)}</p></div></div></details>`).join('');

    // Опции формы — сохраняем выбранное при смене языка
    const svcSel = $('[data-render="serviceOptions"]');
    const docSel = $('[data-render="doctorOptions"]');
    const prevSvc = svcSel.value || 'consult';
    const prevDoc = docSel.value || 'any';
    svcSel.innerHTML = `<option value="consult">${lang === 'ru' ? 'Бесплатная консультация' : 'Free consultation'}</option>` + SERVICES.map((s) => `<option value="${s.id}">${esc(s[lang][0])}</option>`).join('');
    docSel.innerHTML = `<option value="any">${esc(t('book.any'))}</option>` + DOCTORS.map((d) => `<option value="${d.id}">${esc(d[lang][0])}</option>`).join('');
    svcSel.value = prevSvc; docSel.value = prevDoc;

    renderCalc();
    renderDays();
    observeReveals();
  }

  // ── Калькулятор ────────────────────────────────────────
  let calcId = 'implant';
  const qty = $('#qty');
  const qtyOut = $('#qtyOut');
  function renderCalc() {
    $('[data-render="calcChips"]').innerHTML = CALC.map((c) => `<button type="button" class="chip" role="radio" aria-checked="${c.id === calcId}" data-calc="${c.id}">${esc(c[lang][0])}</button>`).join('');
    const c = CALC.find((x) => x.id === calcId);
    const qtyGroup = qty.closest('.calc__group');
    qtyGroup.hidden = !c.unit;
    if (c.unit) {
      qty.max = c.max;
      if (+qty.value > c.max) qty.value = c.max;
      $('[data-render="qtyLabel"]').textContent = c[lang][1];
    }
    $('[data-render="calcIncl"]').innerHTML = c.incl[lang].map((x) => `<li>${esc(x)}</li>`).join('');
    updatePrice(false);
  }
  function updatePrice(bump = true) {
    const c = CALC.find((x) => x.id === calcId);
    const cur = lang === 'ru' ? 'rub' : 'usd';
    const n = c.unit ? +qty.value : 1;
    const extra = ($('#optCt').checked ? EXTRAS.ct[cur] : 0) + ($('#optSedation').checked ? EXTRAS.sed[cur] : 0);
    const from = c[cur][0] * n + extra;
    const to = c[cur][1] * n + extra;
    $('#priceFrom').textContent = money(from);
    $('#priceTo').textContent = money(to);
    $('#monthly').textContent = money(from / 12);
    qtyOut.textContent = qty.value;
    qty.style.setProperty('--fill', ((qty.value - qty.min) / (qty.max - qty.min || 1)) * 100 + '%');
    if (bump && !reduceMotion) { const el = $('.calc__price'); el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
  }
  $('[data-render="calcChips"]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-calc]');
    if (!b) return;
    calcId = b.dataset.calc;
    renderCalc();
    updatePrice(true);
  });
  qty.addEventListener('input', () => updatePrice(true));
  $('#optCt').addEventListener('change', () => updatePrice(true));
  $('#optSedation').addEventListener('change', () => updatePrice(true));

  // ── До / после ─────────────────────────────────────────
  const ba = $('.ba');
  const baRange = $('.ba__range');
  baRange.addEventListener('input', () => ba.style.setProperty('--pos', baRange.value + '%'));
  // Подсказка движением, когда блок впервые попадает в кадр
  new IntersectionObserver(([e], obs) => {
    if (!e.isIntersecting || reduceMotion) return;
    obs.disconnect();
    const keys = [50, 22, 78, 50];
    let i = 0;
    const step = () => {
      if (i >= keys.length) return;
      const from = i ? keys[i - 1] : 50, to = keys[i], t0 = performance.now();
      const anim = (now) => {
        const p = Math.min(1, (now - t0) / 700), v = from + (to - from) * (0.5 - Math.cos(p * Math.PI) / 2);
        ba.style.setProperty('--pos', v + '%'); baRange.value = v;
        if (p < 1) requestAnimationFrame(anim); else { i++; step(); }
      };
      requestAnimationFrame(anim);
    };
    setTimeout(step, 500);
  }, { threshold: 0.6 }).observe(ba);

  // ── Запись: дни и свободные окна ───────────────────────
  const daysEl = $('.days');
  const slotsEl = $('.slots');
  let day = 0;
  let slot = null;
  const dateAt = (i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i); return d; };
  // Детерминированная «занятость»: одни и те же окна заняты при каждом заходе
  const busy = (seed) => { let x = Math.sin(seed) * 10000; return x - Math.floor(x) < 0.32; };
  function hoursFor(d) { return d.getDay() === 0 ? [10, 11, 12, 13, 14, 15, 16, 17] : [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]; }
  function renderDays() {
    const loc = lang === 'ru' ? 'ru-RU' : 'en-GB';
    daysEl.innerHTML = Array.from({ length: 7 }, (_, i) => {
      const d = dateAt(i);
      const label = i === 0 ? t('today') : i === 1 ? t('tomorrow') : d.toLocaleDateString(loc, { weekday: 'short' });
      return `<button type="button" class="day" role="radio" aria-checked="${i === day}" data-day="${i}"><small>${esc(label)}</small><b>${d.getDate()}</b></button>`;
    }).join('');
    renderSlots();
  }
  function renderSlots() {
    const list = slotsFor(day, $('[name="doctor"]').value); // не раньше чем через час, часть окон занята
    if (slot && list.find((s) => s.label === slot)?.off) slot = null;
    slotsEl.innerHTML = list.some((s) => !s.off)
      ? list.map((s) => `<button type="button" class="slot" role="radio" aria-checked="${s.label === slot}" ${s.off ? 'disabled' : ''} data-slot="${s.label}">${s.label}</button>`).join('')
      : `<p class="form__error" style="margin:0">${esc(t('book.noSlots'))}</p>`;
    updateHeroSlot();
  }
  // Ближайшее свободное окно в карточке первого экрана — из тех же данных, что и запись
  function slotsFor(i, doc) {
    const d = dateAt(i), out = [], soon = new Date(Date.now() + 60 * 60 * 1000);
    for (const h of hoursFor(d)) for (const m of [0, 30]) {
      const at = new Date(d); at.setHours(h, m);
      out.push({ label: `${h}:${m ? '30' : '00'}`, off: at <= soon || busy(d.getDate() * 97 + h * 7 + m + doc.length * 13) });
    }
    return out;
  }
  function updateHeroSlot() {
    for (let i = 0; i < 7; i++) {
      const free = slotsFor(i, 'any').find((s) => !s.off);
      if (!free) continue;
      const when = i === 0 ? t('today') : i === 1 ? t('tomorrow') : dateAt(i).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-GB', { weekday: 'long' });
      $('.slot-time').textContent = `${when}, ${free.label}`;
      return;
    }
  }
  // На сегодня все окна могут быть в прошлом — тогда сразу показываем завтра
  (() => { const d = dateAt(0); const lastH = hoursFor(d).at(-1); const end = new Date(d); end.setHours(lastH, 30); if (end <= new Date(Date.now() + 3600e3)) day = 1; })();
  daysEl.addEventListener('click', (e) => { const b = e.target.closest('[data-day]'); if (!b) return; day = +b.dataset.day; slot = null; renderDays(); });
  slotsEl.addEventListener('click', (e) => { const b = e.target.closest('[data-slot]'); if (!b || b.disabled) return; slot = b.dataset.slot; $$('.slot', slotsEl).forEach((x) => x.setAttribute('aria-checked', String(x === b))); });
  $('[name="doctor"]').addEventListener('change', renderSlots);

  // Клик по услуге или врачу — сразу подставляем в форму
  document.addEventListener('click', (e) => {
    const s = e.target.closest('[data-service]');
    if (s) { $('[name="service"]').value = s.dataset.service; }
    const d = e.target.closest('[data-doctor]');
    if (d) { $('[name="doctor"]').value = d.dataset.doctor; renderSlots(); }
  });

  const form = $('.form');
  const done = $('.form__done');
  const err = $('.form__error');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    $$('.is-invalid', form).forEach((x) => x.classList.remove('is-invalid'));
    const fd = Object.fromEntries(new FormData(form));
    const fail = (key, field) => { err.textContent = t(key); if (field) { form.elements[field].classList.add('is-invalid'); form.elements[field].focus(); } };
    if (!slot) return fail('book.errSlot');
    if (!fd.name || fd.name.trim().length < 2) return fail('book.errName', 'name');
    if ((fd.phone || '').replace(/\D/g, '').length < 7) return fail('book.errPhone', 'phone');
    if (!fd.consent) return fail('book.errConsent');
    err.textContent = '';
    const d = dateAt(day);
    const when = `${d.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}, ${slot}`;
    const svcSel = form.elements.service; const docSel = form.elements.doctor;
    $('.done__text').textContent = t('book.done')({
      name: fd.name.trim(), phone: fd.phone.trim(), when,
      service: svcSel.options[svcSel.selectedIndex].text,
      doctor: docSel.value === 'any' ? '' : docSel.options[docSel.selectedIndex].text,
    });
    form.hidden = true; done.hidden = false;
  });
  $('[data-again]').addEventListener('click', () => { form.reset(); slot = null; renderDays(); done.hidden = true; form.hidden = false; });

  // ── Появление при скролле, счётчики ────────────────────
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target;
      const sib = $$(':scope > .reveal', el.parentElement);
      el.style.transitionDelay = `${Math.min(Math.max(sib.indexOf(el), 0), 5) * 70}ms`;
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
      const t0 = performance.now();
      const step = (now) => { const p = Math.min(1, (now - t0) / 1400); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }
  }, { threshold: 0.5 });
  $$('.count').forEach((el) => countIo.observe(el));

  // ── Навигация ──────────────────────────────────────────
  const nav = $('.nav');
  const fab = $('.fab');
  const links = $$('.nav__links a');
  const sections = $$('main section[id]');
  let ticking = false;
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', scrollY > 8);
    const bookTop = $('#book').getBoundingClientRect().top;
    fab.classList.toggle('is-on', scrollY > innerHeight * 0.8 && bookTop > innerHeight);
    let cur = null;
    for (const s of sections) if (s.getBoundingClientRect().top < innerHeight * 0.35) cur = s.id;
    links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + cur));
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  const burger = $('.burger');
  const drawer = $('.drawer');
  const setMenu = (open) => { document.body.classList.toggle('menu-open', open); burger.setAttribute('aria-expanded', String(open)); drawer.setAttribute('aria-hidden', String(!open)); };
  burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('a', drawer).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', (e) => { if (document.body.classList.contains('menu-open') && !e.target.closest('.drawer, .burger')) setMenu(false); });

  $$('.lang button').forEach((b) => b.addEventListener('click', () => applyLang(b.dataset.lang)));
  applyLang(lang);
  onScroll();
})();
