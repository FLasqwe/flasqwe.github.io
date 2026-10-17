// OBSID — paint protection lab. EN/RU, configurator with SVG zone map, before/after, booking.
(() => {
  'use strict';

  document.documentElement.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const IMG = (id, w, h, q = 75) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? '&h=' + h : ''}&q=${q}`;

  // ── Данные: пакеты и цены (вымышленные) ───────────────
  const CLASSES = ['sedan', 'suv', 'sport'];
  const TIME_K = { sedan: 1, suv: 1.2, sport: 1.15 };
  const PACKS = [
    { id: 'ppf_full', zone: 'ppf', price: { sedan: 290000, suv: 360000, sport: 340000 }, h: 32, excl: 'ppf_front' },
    { id: 'ppf_front', zone: 'ppf', price: { sedan: 95000, suv: 115000, sport: 110000 }, h: 14, excl: 'ppf_full' },
    { id: 'ceramic', zone: 'ceramic', price: { sedan: 65000, suv: 80000, sport: 75000 }, h: 12 },
    { id: 'polish', zone: 'polish', price: { sedan: 45000, suv: 58000, sport: 52000 }, h: 10 },
    { id: 'tint', zone: 'tint', price: { sedan: 22000, suv: 28000, sport: 20000 }, h: 4, parallel: true },
    { id: 'interior', zone: 'interior', price: { sedan: 30000, suv: 38000, sport: 32000 }, h: 8, parallel: true },
  ];
  const BUNDLE_MIN = 3;
  const BUNDLE_OFF = 0.1;

  // ── Геометрия силуэтов (вид сбоку, нос справа, viewBox 1000×430) ──
  const seat = (x, top, belt) => `M ${x} ${belt} L ${x + 14} ${top + 22} Q ${x + 17} ${top + 15} ${x + 25} ${top + 15} L ${x + 34} ${top + 15} Q ${x + 40} ${top + 16} ${x + 38} ${top + 23} L ${x + 30} ${belt} Z M ${x + 21} ${top} h 16 a 4 4 0 0 1 4 4 v 5 a 3 3 0 0 1 -3 3 h -18 a 3 3 0 0 1 -3 -3 v -5 a 4 4 0 0 1 4 -4 Z`;
  const CARS = {
    sedan: {
      body: 'M 70 300 C 62 280 62 255 72 240 L 82 222 C 120 212 190 206 262 200 C 300 175 340 140 395 128 C 470 114 560 114 610 124 C 650 140 690 170 720 192 C 800 204 880 212 925 228 C 945 236 952 260 948 285 C 946 298 935 304 915 306 L 858 306 A 64 64 0 0 0 732 306 L 298 306 A 64 64 0 0 0 172 306 L 110 306 C 88 306 74 304 70 300 Z',
      glass: 'M 290 198 C 325 172 360 146 400 136 C 470 124 555 124 600 132 C 635 148 668 172 690 190 Z',
      pillars: ['M 492 128 L 506 128 L 512 196 L 496 196 Z', 'M 688 182 L 712 176 L 716 188 L 694 194 Z'],
      lines: ['M 300 200 L 306 302', 'M 504 197 L 508 304', 'M 696 192 C 706 230 708 270 702 302', 'M 100 240 C 360 234 640 230 932 240', 'M 420 216 h 26', 'M 612 214 h 26', 'M 86 224 C 140 214 200 208 262 202'],
      lamp: 'M 892 222 L 938 237 L 936 247 L 890 236 Z',
      tail: 'M 73 238 L 104 230 L 106 242 L 76 250 Z',
      seats: [seat(548, 146, 196), seat(380, 150, 198)],
      wheels: [[235, 316, 57], [795, 316, 57]],
      front: 712,
      anchors: { ppf_full: [160, 232], ppf_front: [830, 210], ceramic: [540, 118], tint: [430, 168], polish: [420, 262], interior: [575, 178] },
      dims: 'L 4 920 · H 1 450 MM',
    },
    suv: {
      body: 'M 62 300 C 56 270 56 222 64 192 L 74 150 C 78 128 90 112 120 108 L 600 104 C 640 108 680 140 712 176 C 790 186 870 194 920 206 C 945 214 952 240 950 268 C 950 292 944 300 920 302 L 862 302 A 72 72 0 0 0 718 302 L 302 302 A 72 72 0 0 0 158 302 L 90 302 C 72 302 64 301 62 300 Z',
      glass: 'M 90 180 L 98 132 C 102 122 112 118 128 118 L 590 114 C 620 118 655 146 686 178 Z',
      pillars: ['M 196 118 L 222 117 L 226 180 L 196 180 Z', 'M 452 115 L 466 115 L 470 179 L 456 179 Z', 'M 684 170 L 708 164 L 712 176 L 690 182 Z'],
      lines: ['M 300 182 L 302 300', 'M 464 180 L 466 302', 'M 692 178 C 704 220 708 262 716 300', 'M 66 232 C 360 226 640 222 944 228', 'M 140 102 L 586 98', 'M 380 200 h 26', 'M 572 198 h 26', 'M 64 192 L 92 186'],
      lamp: 'M 902 208 L 946 222 L 945 236 L 900 224 Z',
      tail: 'M 63 198 L 82 194 L 80 234 L 62 238 Z',
      seats: [seat(518, 128, 180), seat(320, 130, 180)],
      wheels: [[230, 310, 64], [790, 310, 64]],
      front: 704,
      anchors: { ppf_full: [130, 228], ppf_front: [840, 196], ceramic: [430, 106], tint: [330, 150], polish: [395, 252], interior: [545, 160] },
      dims: 'L 4 960 · H 1 760 MM',
    },
    sport: {
      body: 'M 60 290 C 56 268 60 250 70 240 L 78 226 C 120 222 170 214 230 196 C 300 160 380 140 450 136 C 520 132 560 136 600 150 C 640 168 670 186 700 198 C 790 206 880 216 930 236 C 950 244 956 266 950 288 C 946 300 930 304 910 304 L 855 304 A 66 66 0 0 0 725 304 L 290 304 A 66 66 0 0 0 160 304 L 96 304 C 74 304 62 298 60 290 Z',
      glass: 'M 300 196 C 350 168 400 150 452 146 C 515 142 555 146 590 158 C 620 172 648 186 670 198 Z',
      pillars: ['M 420 150 L 436 147 L 454 197 L 436 197 Z', 'M 672 190 L 696 184 L 700 196 L 678 202 Z'],
      lines: ['M 446 199 L 452 304', 'M 692 200 C 702 240 702 275 714 302', 'M 96 252 C 300 242 600 240 942 248', 'M 560 222 h 26', 'M 80 226 C 120 224 160 220 196 212'],
      intake: 'M 330 254 C 370 240 420 236 438 236 L 440 264 C 400 264 362 270 330 272 Z',
      lamp: 'M 900 230 L 944 245 L 944 255 L 898 242 Z',
      tail: 'M 66 246 L 104 238 L 106 248 L 68 256 Z',
      seats: [seat(486, 156, 198)],
      wheels: [[225, 318, 57], [790, 318, 57]],
      front: 700,
      anchors: { ppf_full: [150, 246], ppf_front: [830, 224], ceramic: [520, 138], tint: [400, 172], polish: [560, 268], interior: [510, 182] },
      dims: 'L 4 520 · H 1 300 MM',
    },
  };
  const CALL_SLOTS = { ppf_full: [120, 'top'], tint: [370, 'top'], ceramic: [620, 'top'], ppf_front: [872, 'top'], polish: [330, 'bot'], interior: [640, 'bot'] };
  const CLASS_ICON = {
    sedan: '<path d="M2 15h48M4 15c0-3 1-4 4-4.5l6-1 6-5h14l7 5c5 .5 8 2 8 5.5"/><circle cx="13" cy="16" r="3"/><circle cx="39" cy="16" r="3"/>',
    suv: '<path d="M2 16h48M3 16V8l3-5h28l8 6c5 .5 7 2 7 7"/><circle cx="12" cy="16" r="3.4"/><circle cx="40" cy="16" r="3.4"/>',
    sport: '<path d="M2 16h48M3 15c0-2 2-3 5-4l9-5c6-2 12-2 16 1l5 3c6 .3 10 2 11 5"/><circle cx="12" cy="16" r="3"/><circle cx="40" cy="16" r="3"/>',
  };

  // ── Тексты ─────────────────────────────────────────────
  const T = {
    en: {
      skip: 'Skip to content', logoSub: 'paint protection lab',
      'nav.config': 'Configurator', 'nav.results': 'Results', 'nav.process': 'Process', 'nav.materials': 'Materials', 'nav.studio': 'Studio', 'nav.faq': 'FAQ', 'nav.contacts': 'Contacts', 'nav.book': 'Book a bay',
      'hero.tag': 'Paint protection lab · Bays 01–04', 'hero.t1': 'Invisible', 'hero.t2': 'armour.',
      'hero.lead': 'Paint protection film, ceramic coatings and paint correction for cars that deserve a lab, not a car wash.', 'hero.lead2': 'Climate-controlled bays, inspection under 5000 K light, written warranty up to 10 years.',
      'wire.front': 'PPF · FRONT', 'wire.um': '200 µm film', 'wire.cer': 'CERAMIC 9H', 'wire.depth': 'paint 118 µm',
      'hero.cta1': 'Configure your car', 'hero.cta2': 'See the gloss',
      'hud.live': 'LIVE', 'hud.bay': 'Bay 02', 'hud.job': 'Sport coupe · full-body PPF', 'hud.stage': 'Stage 4/6 · edge wrapping',
      'spec.aria': 'Key figures', 'spec.1s': 'TPU film', 'spec.3s': 'warranty', 'spec.um': 'µm', 'spec.1': 'self-healing TPU film', 'spec.2': 'ceramic coating hardness', 'spec.yrs': 'yrs', 'spec.3': 'written warranty', 'spec.4': 'sealed dust-free bays',
      ticker: ['Paint protection film', 'Ceramic coating 9H', 'Paint correction', 'Window tint', 'Interior detailing', 'Wheel & caliper coating', 'Headlight PPF'],
      'cfg.kicker': 'Configurator', 'cfg.title': 'Build your protection. <em>See the price live.</em>',
      'cfg.lead': 'Pick the body type and packages — the zones light up on the car, the price and time in the bay update instantly. Fixed price, agreed before we start.',
      'cfg.scan': 'zone map', 'cfg.class': 'Body type', 'cfg.packs': 'Packages', 'cfg.total': 'Total', 'cfg.book': 'Book a slot with this setup',
      classes: { sedan: ['Sedan', 'D/E class'], suv: ['SUV', 'crossover'], sport: ['Sport', 'coupe / GT'] },
      packs: {
        ppf_full: ['Full-body PPF', 'Every painted panel, edges wrapped. Gloss or satin.', 'PPF · FULL'],
        ppf_front: ['Front-end PPF', 'Bumper, hood, fenders, mirrors and headlights.', 'PPF · FRONT'],
        ceramic: ['Ceramic coating 9H', 'Two layers, hydrophobic, deep gloss. IR-cured.', 'CERAMIC 9H'],
        polish: ['Paint correction', 'Two-stage machine polish, up to 95% of swirls out.', 'CORRECTION'],
        tint: ['Window tint', 'Ceramic film on rear and side glass, 99% UV block.', 'TINT'],
        interior: ['Interior detail', 'Deep clean plus leather and fabric protection.', 'INTERIOR'],
      },
      excl: 'replaces', hrs: 'h', 'ro.cov': 'PPF coverage', 'ro.gloss': 'Top layer', 'ro.polished': 'Polish', 'ro.war': 'Warranty', 'ro.bay': 'Bay time', inBay: (h, d) => `≈ ${h} h in the bay · ${d} ${d === 1 ? 'day' : 'days'} of 12-h shifts`, noPacks: 'Pick at least one package', bundle: (p) => `Bundle −${p}% applied`, bundleHint: (n) => `Add ${n} more for −10%`, save: (m) => `You save ${m}`, packsN: (n) => `${n} ${n === 1 ? 'package' : 'packages'}`,
      'res.kicker': 'Paint correction', 'res.title': 'Swirls out. <em>Depth in.</em>',
      'res.lead': 'Two-stage machine correction removes up to 95% of swirl marks and light scratches, then the surface is locked under ceramic. Drag the divider to compare.',
      'res.m1': 'gloss, before → after', 'res.m2': 'clear coat removed', 'res.m3': 'paint depth points', 'res.pts': 'pts',
      'res.note': 'Illustrative figures; the “before” side is a simulation for demonstration.', 'res.before': 'Before', 'res.after': 'After', 'res.range': 'Before / after divider',
      'res.altAfter': 'Black bonnet under a machine polisher: crisp, undistorted strip-light reflections after correction',
      'proc.prev': 'Previous stage', 'proc.next': 'Next stage', 'proc.rail': 'Process stages, scroll horizontally',
      'proc.kicker': 'Process', 'proc.title': 'Six stages. <em>Zero shortcuts.</em>', 'proc.lead': 'Every car follows the same protocol, logged in a job card you receive with photos at each stage.',
      steps: [
        ['Intake & scan', 'Paint depth measured at 40+ points, every chip and scratch photographed into your job card.', '30 min'],
        ['Decontamination', 'Snow foam, iron fallout remover, tar and clay. The surface leaves bare and clinically clean.', '2–3 h'],
        ['Correction', 'One- to three-stage machine polishing under 5000 K light, checked with a paint gauge.', '6–14 h'],
        ['Protection', 'Plotter-cut PPF patterns for your exact model, edges wrapped by hand — no knife on paint.', '1–4 days'],
        ['Coating & curing', 'Ceramic layers applied panel by panel and cured under infrared lamps.', '12 h'],
        ['QC & handover', 'Final inspection, care briefing and a free 48-hour check. Warranty registered to your VIN.', '1 h'],
      ],
      'mat.kicker': 'Materials & warranty', 'mat.title': 'What sits <em>between your paint and the road.</em>', 'mat.svgTitle': 'Cross-section of the protection layers',
      layers: [
        ['Self-healing topcoat', '~10 µm', 'Light scratches disappear with warmth from the sun or warm water.'],
        ['TPU film', '150 µm', 'Optically clear polyurethane that absorbs stone chips and road grit.'],
        ['Adhesive', '~40 µm', 'Pressure-sensitive acrylic, removable without damaging factory paint.'],
        ['Factory clear coat', '~40 µm', 'Corrected and decontaminated before anything touches it.'],
        ['Base paint', '~20 µm', 'Your colour — untouched and preserved.'],
      ],
      'mat.wTitle': 'Written warranty', 'mat.wNote': 'Warranty is registered to the car’s VIN and transfers with a sale. The annual inspection is free.', yrs: 'yrs',
      warranty: [['Paint protection film', 'no yellowing, peeling or cracking', 10], ['Ceramic coating 9H', 'with a free annual check-up', 5], ['Window tint', 'no bubbles or fading', 7], ['Interior protection', 'leather and fabric', 2]],
      'st.kicker': 'The studio', 'st.title': 'A lab, <em>not a garage.</em>', 'st.lead': 'Four sealed bays with filtered positive-pressure air, 22 °C year-round and 5000 K inspection lighting that hides nothing.',
      gallery: [['Bay 02 · finishing', '5000 K', 'Detailer hand-finishing the glossy black panel of a car'], ['PPF fitting', 'Edge wrap', 'Gloved hands laying clear protection film onto a dark glossy bonnet'], ['Machine correction', 'Stage 2', 'Orbital polisher working on a car hood'], ['Light tunnel · QC', '5000 K', 'A car in a bright white light tunnel with linear ceiling lights for final inspection'], ['Interior', 'Leather', 'Black quilted leather seats after interior detailing'], ['Decon wash', 'Foam', 'Headlight and bonnet covered in thick snow foam during the decontamination wash']],
      'book.kicker': 'Booking', 'book.title': 'Reserve <em>a bay.</em>', 'book.lead': 'Choose a drop-off day and time. A studio manager confirms within 30 minutes and sends the job card.',
      'book.prevDays': 'Earlier days', 'book.nextDays': 'Later days',
      'book.day': 'Drop-off day', 'book.time': 'Time', 'book.name': 'Your name', 'book.phone': 'Phone', 'book.car': 'Car make & model', 'book.carPh': 'e.g. 2023 coupe, black',
      'book.consent': 'I agree to the processing of my personal data', 'book.submit': 'Reserve the slot', 'book.demo': 'Concept demo — the form doesn’t send data anywhere.',
      'book.okTitle': 'Bay reserved', 'book.again': 'Configure another car',
      'book.errSlot': 'Please choose a time slot.', 'book.errName': 'Please enter your name.', 'book.errPhone': 'Enter a valid phone, 10+ digits.', 'book.errCar': 'Tell us the car so we can prepare the bay.', 'book.errConsent': 'Please confirm the consent to continue.',
      today: 'Today', tomorrow: 'Tmrw', full: 'Full', slotsLeft: (n) => `${n} left`,
      ticketK: 'Your setup', ticketEmpty: 'No packages yet — we’ll start with a free inspection.', ticketEdit: 'Edit setup', inspection: 'Free inspection',
      done: (d) => `${d.name}, ${d.when} is yours. Bring the ${d.car} to Bay ${d.bay}: ${d.setup}. A manager will call ${d.phone} within 30 minutes. (Demo — nothing was sent.)`,
      'faq.kicker': 'FAQ', 'faq.title': 'Straight answers.',
      faq: [
        ['How long does paint protection film last?', 'Quality TPU film lasts 7–10 years. We give a written 10-year warranty against yellowing, peeling and cracking when the car comes in for the free annual check.'],
        ['Can the film be removed later?', 'Yes. The adhesive is designed to release cleanly from factory paint. Removal takes a few hours and leaves the paint underneath as it was the day we covered it.'],
        ['Do I need paint correction before PPF or ceramic?', 'Usually yes. Film and coatings lock in whatever is underneath — including swirls. After the paint-depth scan we tell you honestly if a light one-stage polish is enough.'],
        ['How do I wash the car after a ceramic coating?', 'Wait 7 days, then use a pH-neutral shampoo and the two-bucket method. No automatic brush washes. You get a printed care guide and a starter kit at handover.'],
        ['Can you collect the car?', 'Within the city we collect and return in an enclosed trailer, free for full-body PPF and paid for other packages.'],
        ['Is the price really fixed?', 'Yes. The configurator shows the list price for your body type; after the inspection we confirm it in writing. If we find something that changes the job, you decide before we touch it.'],
      ],
      'ct.kicker': 'Contacts', 'ct.title': 'Drop by <em>the lab.</em>', 'ct.addrL': 'Address', 'ct.addr': '7 Graphite Lane, unit 4 · Moscow (fictional address)', 'ct.hoursL': 'Hours', 'ct.hours': 'Daily 09:00–21:00 · car pick-up until 23:00', 'ct.phoneL': 'Phone',
      'fin.kicker': 'Your setup, ready', 'fin.setup': 'Setup', 'fin.total': 'Total', 'fin.ready': 'Ready by', 'fin.cta': 'Book the bay', 'fin.note': 'Live from the configurator · bays open daily 09:00–21:00',
      finLine: (wd, rel) => rel === 0 ? 'Armoured by tonight.' : rel === 1 ? 'Armoured by tomorrow.' : `Armoured by ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][wd]}.`,
      readyFmt: (d) => `${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]}, ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()]} ${d.getDate()} · 21:00`,
      'foot.tag': 'Invisible armour. Visible gloss.', 'foot.concept': 'Concept website · portfolio project. Brand, prices, address and data are fictional. Photos: Unsplash.', 'foot.navAria': 'Footer', 'foot.hours': 'Daily 09:00–21:00', 'foot.top': 'Back to top',
      title: 'OBSID — paint protection lab', months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], wd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    },
    ru: {
      skip: 'Перейти к содержанию', logoSub: 'студия защиты кузова',
      'nav.config': 'Конфигуратор', 'nav.results': 'Результат', 'nav.process': 'Процесс', 'nav.materials': 'Материалы', 'nav.studio': 'Студия', 'nav.faq': 'Вопросы', 'nav.contacts': 'Контакты', 'nav.book': 'Записаться',
      'hero.tag': 'Студия защиты кузова · боксы 01–04', 'hero.t1': 'Невидимая', 'hero.t2': 'броня.',
      'hero.lead': 'Защитная плёнка, керамика и полировка для машин, которым нужна лаборатория, а не мойка.', 'hero.lead2': 'Боксы с климат-контролем, контроль под светом 5000 K, письменная гарантия до 10 лет.',
      'wire.front': 'ПЛЁНКА · ПЕРЕД', 'wire.um': 'плёнка 200 мкм', 'wire.cer': 'КЕРАМИКА 9H', 'wire.depth': 'ЛКП 118 мкм',
      'hero.cta1': 'Собрать защиту', 'hero.cta2': 'Смотреть блеск',
      'hud.live': 'В РАБОТЕ', 'hud.bay': 'Бокс 02', 'hud.job': 'Спорткупе · плёнка на весь кузов', 'hud.stage': 'Этап 4/6 · завороты кромок',
      'spec.aria': 'Ключевые цифры', 'spec.1s': 'плёнка TPU', 'spec.3s': 'гарантия', 'spec.um': 'мкм', 'spec.1': 'самовосстанавливающаяся плёнка', 'spec.2': 'твёрдость керамики', 'spec.yrs': 'лет', 'spec.3': 'письменная гарантия', 'spec.4': 'герметичных бокса без пыли',
      ticker: ['Антигравийная плёнка', 'Керамика 9H', 'Восстановительная полировка', 'Тонировка', 'Химчистка салона', 'Керамика дисков и суппортов', 'Плёнка на фары'],
      'cfg.kicker': 'Конфигуратор', 'cfg.title': 'Соберите защиту. <em>Цена — сразу.</em>',
      'cfg.lead': 'Выберите тип кузова и пакеты — зоны подсветятся на машине, цена и срок в боксе пересчитаются мгновенно. Цена фиксируется до начала работ.',
      'cfg.scan': 'карта зон', 'cfg.class': 'Тип кузова', 'cfg.packs': 'Пакеты', 'cfg.total': 'Итого', 'cfg.book': 'Записаться с этим набором',
      classes: { sedan: ['Седан', 'класс D/E'], suv: ['SUV', 'кроссовер'], sport: ['Спорт', 'купе / GT'] },
      packs: {
        ppf_full: ['Плёнка на весь кузов', 'Все окрашенные детали, с заворотом кромок. Глянец или сатин.', 'ПЛЁНКА · ВСЯ'],
        ppf_front: ['Плёнка на перед', 'Бампер, капот, крылья, зеркала и фары.', 'ПЛЁНКА · ПЕРЕД'],
        ceramic: ['Керамика 9H', 'Два слоя, гидрофоб, глубокий блеск. ИК-сушка.', 'КЕРАМИКА 9H'],
        polish: ['Полировка', 'Двухэтапная машинная, до 95% голограмм и царапин.', 'ПОЛИРОВКА'],
        tint: ['Тонировка', 'Керамическая плёнка на задние и боковые, 99% УФ.', 'ТОНИРОВКА'],
        interior: ['Салон', 'Глубокая химчистка и защита кожи и ткани.', 'САЛОН'],
      },
      excl: 'заменяет', hrs: 'ч', 'ro.cov': 'Покрытие плёнкой', 'ro.gloss': 'Верхний слой', 'ro.polished': 'Полировка', 'ro.war': 'Гарантия', 'ro.bay': 'Время в боксе', inBay: (h, d) => `≈ ${h} ч в боксе · ${d} ${plural(d, ['смена', 'смены', 'смен'])} по 12 ч`, noPacks: 'Выберите хотя бы один пакет', bundle: (p) => `Скидка за комплекс −${p}%`, bundleHint: (n) => `Ещё ${n} — и скидка −10%`, save: (m) => `Экономия ${m}`, packsN: (n) => `${n} ${plural(n, ['пакет', 'пакета', 'пакетов'])}`,
      'res.kicker': 'Полировка', 'res.title': 'Минус голограммы. <em>Плюс глубина.</em>',
      'res.lead': 'Двухэтапная машинная полировка убирает до 95% голограмм и мелких царапин, а затем поверхность закрывается керамикой. Двигайте разделитель, чтобы сравнить.',
      'res.m1': 'блеск, до → после', 'res.m2': 'снято лака', 'res.m3': 'точек замера ЛКП', 'res.pts': 'тчк',
      'res.note': 'Цифры иллюстративные; сторона «до» — симуляция для демонстрации.', 'res.before': 'До', 'res.after': 'После', 'res.range': 'Разделитель «до / после»',
      'res.altAfter': 'Чёрный капот под полировальной машинкой: чёткие, неискажённые отражения ламп после полировки',
      'proc.prev': 'Предыдущий этап', 'proc.next': 'Следующий этап', 'proc.rail': 'Этапы работ, прокрутка по горизонтали',
      'proc.kicker': 'Процесс', 'proc.title': 'Шесть этапов. <em>Без срезанных углов.</em>', 'proc.lead': 'Каждая машина проходит один протокол — он ведётся в карте работ, которую вы получаете с фото на каждом этапе.',
      steps: [
        ['Приёмка и замер', 'Толщина ЛКП в 40+ точках, каждый скол и царапина — на фото в вашей карте работ.', '30 мин'],
        ['Деконтаминация', 'Пена, очиститель металлических вкраплений, битум и глина. Поверхность — стерильно чистая.', '2–3 ч'],
        ['Полировка', 'Одно-, двух- или трёхэтапная полировка под светом 5000 K с контролем толщиномером.', '6–14 ч'],
        ['Защита', 'Лекала плёнки под вашу модель режет плоттер, кромки заворачиваются вручную — без ножа по краске.', '1–4 дня'],
        ['Керамика и сушка', 'Слои наносятся деталь за деталью и сушатся инфракрасными лампами.', '12 ч'],
        ['Контроль и выдача', 'Финальная проверка, инструктаж по уходу и бесплатный осмотр через 48 часов. Гарантия — на VIN.', '1 ч'],
      ],
      'mat.kicker': 'Материалы и гарантия', 'mat.title': 'Что стоит <em>между краской и дорогой.</em>', 'mat.svgTitle': 'Разрез защитных слоёв',
      layers: [
        ['Самовосстанавливающийся слой', '~10 мкм', 'Мелкие царапины исчезают от солнца или тёплой воды.'],
        ['Полиуретан (TPU)', '150 мкм', 'Прозрачная плёнка гасит удары камней и песка.'],
        ['Клеевой слой', '~40 мкм', 'Акриловый клей, снимается без вреда заводской краске.'],
        ['Заводской лак', '~40 мкм', 'Отполирован и очищен до того, как к нему что-то прикоснётся.'],
        ['Базовая краска', '~20 мкм', 'Ваш цвет — нетронутый и сохранённый.'],
      ],
      'mat.wTitle': 'Письменная гарантия', 'mat.wNote': 'Гарантия привязана к VIN и переходит новому владельцу при продаже. Ежегодный осмотр — бесплатно.', yrs: 'лет',
      warranty: [['Защитная плёнка', 'без пожелтения, отслоения и трещин', 10], ['Керамика 9H', 'с бесплатным ежегодным осмотром', 5], ['Тонировка', 'без пузырей и выцветания', 7], ['Защита салона', 'кожа и ткань', 2]],
      'st.kicker': 'Студия', 'st.title': 'Лаборатория, <em>а не гараж.</em>', 'st.lead': 'Четыре герметичных бокса с фильтрованным воздухом под избыточным давлением, 22 °C круглый год и свет 5000 K, который ничего не скрывает.',
      gallery: [['Бокс 02 · финиш', '5000 K', 'Детейлер вручную доводит глянцевую чёрную панель автомобиля'], ['Оклейка плёнкой', 'Кромка', 'Руки в перчатках укладывают прозрачную плёнку на тёмный глянцевый капот'], ['Полировка', 'Этап 2', 'Эксцентриковая машинка полирует капот'], ['Световой тоннель · ОТК', '5000 K', 'Автомобиль в ярком белом световом тоннеле с линейными лампами для финального контроля'], ['Салон', 'Кожа', 'Чёрные стёганые кожаные сиденья после химчистки'], ['Мойка', 'Пена', 'Фара и капот в густой пене на этапе деконтаминации']],
      'book.kicker': 'Запись', 'book.title': 'Забронируйте <em>бокс.</em>', 'book.lead': 'Выберите день и время, когда привезёте машину. Менеджер студии подтвердит запись в течение 30 минут и пришлёт карту работ.',
      'book.prevDays': 'Ранние дни', 'book.nextDays': 'Поздние дни',
      'book.day': 'День приёмки', 'book.time': 'Время', 'book.name': 'Ваше имя', 'book.phone': 'Телефон', 'book.car': 'Марка и модель', 'book.carPh': 'например, купе 2023, чёрное',
      'book.consent': 'Я согласен на обработку персональных данных', 'book.submit': 'Забронировать', 'book.demo': 'Концепт-демо — форма никуда не отправляет данные.',
      'book.okTitle': 'Бокс забронирован', 'book.again': 'Собрать другую машину',
      'book.errSlot': 'Выберите время.', 'book.errName': 'Введите имя.', 'book.errPhone': 'Телефон: от 10 цифр.', 'book.errCar': 'Укажите машину, чтобы мы подготовили бокс.', 'book.errConsent': 'Подтвердите согласие, чтобы продолжить.',
      today: 'Сегодня', tomorrow: 'Завтра', full: 'Занято', slotsLeft: (n) => `ещё ${n}`,
      ticketK: 'Ваш набор', ticketEmpty: 'Пакеты не выбраны — начнём с бесплатного осмотра.', ticketEdit: 'Изменить набор', inspection: 'Бесплатный осмотр',
      done: (d) => `${d.name}, ${d.when} — за вами. Привозите ${d.car} в бокс ${d.bay}: ${d.setup}. Менеджер позвонит на ${d.phone} в течение 30 минут. (Демо — ничего не отправлено.)`,
      'faq.kicker': 'Вопросы', 'faq.title': 'Прямые ответы.',
      faq: [
        ['Сколько служит защитная плёнка?', 'Качественный полиуретан служит 7–10 лет. Мы даём письменную гарантию 10 лет от пожелтения, отслоения и трещин — при бесплатном ежегодном осмотре.'],
        ['Плёнку потом можно снять?', 'Да. Клей рассчитан на чистое снятие с заводской краски. Демонтаж занимает несколько часов, а краска под плёнкой остаётся такой же, как в день оклейки.'],
        ['Нужна ли полировка перед плёнкой или керамикой?', 'Обычно да. Плёнка и керамика консервируют то, что под ними, — включая голограммы. После замера ЛКП честно скажем, хватит ли лёгкой одноэтапной полировки.'],
        ['Как мыть машину после керамики?', 'Подождите 7 дней, затем — pH-нейтральный шампунь и метод двух вёдер. Без щёточных автомоек. При выдаче — памятка по уходу и стартовый набор.'],
        ['Можете забрать машину?', 'По городу забираем и возвращаем в закрытом автовозе: бесплатно при оклейке всего кузова, для остальных пакетов — за доплату.'],
        ['Цена правда фиксированная?', 'Да. Конфигуратор показывает прайс для вашего типа кузова; после осмотра фиксируем его письменно. Если найдём что-то, что меняет работу, решение — за вами, до начала.'],
      ],
      'ct.kicker': 'Контакты', 'ct.title': 'Заезжайте <em>в лабораторию.</em>', 'ct.addrL': 'Адрес', 'ct.addr': 'Графитовый пер., 7, бокс 4 · Москва (вымышленный адрес)', 'ct.hoursL': 'Часы', 'ct.hours': 'Ежедневно 09:00–21:00 · выдача машин до 23:00', 'ct.phoneL': 'Телефон',
      'fin.kicker': 'Ваш набор — готов', 'fin.setup': 'Набор', 'fin.total': 'Итого', 'fin.ready': 'Готово к', 'fin.cta': 'Забронировать бокс', 'fin.note': 'Данные из конфигуратора · боксы открыты ежедневно 09:00–21:00',
      finLine: (wd, rel) => rel === 0 ? 'Под бронёй уже вечером.' : rel === 1 ? 'Под бронёй уже завтра.' : `Под бронёй ${['к воскресенью', 'к понедельнику', 'ко вторнику', 'к среде', 'к четвергу', 'к пятнице', 'к субботе'][wd]}.`,
      readyFmt: (d) => `${['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'][d.getDay()]}, ${d.getDate()} ${['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'][d.getMonth()]} · 21:00`,
      'foot.tag': 'Невидимая броня. Видимый блеск.', 'foot.concept': 'Концепт-сайт · проект для портфолио. Бренд, цены, адрес и данные вымышлены. Фото: Unsplash.', 'foot.navAria': 'Подвал', 'foot.hours': 'Ежедневно 09:00–21:00', 'foot.top': 'Наверх',
      title: 'OBSID — студия защиты кузова', months: ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'], wd: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    },
  };
  function plural(n, f) { const a = n % 10, b = n % 100; return a === 1 && b !== 11 ? f[0] : a >= 2 && a <= 4 && (b < 10 || b >= 20) ? f[1] : f[2]; }

  const GALLERY = ['1708805282706-f44730b7e527', '1632605166776-7128669886e7', '1780558852670-3f49298ecc1f', '1692260122105-28c26fc3c882', '1605437241278-c1806d14a4d9', '1633014041037-f5446fb4ce99'];
  const GAL_SIZE = [[1100, 800], [900, 760], [760, 640], [1300, 600], [900, 640], [1100, 560]];
  // Кадрирование, чтобы в кадр не попадали логотипы марок (интерьер и мойка)
  const GAL_RECT = [null, null, null, null, '360,3050,3460,2460', '300,2450,2400,1225'];

  // ── Состояние ──────────────────────────────────────────
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* приватный режим */ } },
  };
  let lang = store.get('obsid-lang') || ((navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'en');
  if (!T[lang]) lang = 'en';
  const state = { cls: 'sport', sel: new Set(['ppf_front', 'ceramic']), day: null, time: null };
  const t = (k) => T[lang][k];
  const fmt = (n) => new Intl.NumberFormat(lang === 'ru' ? 'ru-RU' : 'en-US').format(Math.round(n)).replace(/ | /g, ' ');
  const money = (n) => `${fmt(n)} ₽`;

  const narrow = window.matchMedia('(max-width: 599px)');
  const onNarrow = () => { const svg = $('#carStage svg'); if (svg) svg.setAttribute('viewBox', narrow.matches ? '40 84 930 310' : '0 0 1000 430'); };
  if (narrow.addEventListener) narrow.addEventListener('change', onNarrow); else if (narrow.addListener) narrow.addListener(onNarrow);

  // ── Отрисовка машины ───────────────────────────────────
  function carSVG() {
    const P = t('packs');
    const defs = `<defs>
      <linearGradient id="gBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#30353c"/><stop offset=".45" stop-color="#181b1f"/><stop offset="1" stop-color="#0b0c0e"/></linearGradient>
      <linearGradient id="gGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#262c33"/><stop offset=".55" stop-color="#0c0e11"/><stop offset="1" stop-color="#15191d"/></linearGradient>
      <radialGradient id="gShadow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".8"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <linearGradient id="gSweep" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".34"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <pattern id="pDots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="1.25" fill="#d4ff3a" fill-opacity=".62"/></pattern>
      <pattern id="pLines" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><path d="M0 0V9" stroke="#d4ff3a" stroke-opacity=".6" stroke-width="1.2"/></pattern>
      ${CLASSES.map((c) => `<clipPath id="cf-${c}"><rect x="${CARS[c].front}" y="0" width="${1000 - CARS[c].front}" height="430"/></clipPath><clipPath id="cb-${c}"><path d="${CARS[c].body}"/></clipPath>`).join('')}
    </defs>`;
    const groups = CLASSES.map((c) => {
      const g = CARS[c];
      const wheels = g.wheels.map(([x, y, r]) => {
        const spokes = [0, 72, 144, 216, 288].map((a) => { const rad = (a - 90) * Math.PI / 180; return `<line class="car__spoke" x1="${x + Math.cos(rad) * r * 0.16}" y1="${y + Math.sin(rad) * r * 0.16}" x2="${(x + Math.cos(rad) * r * 0.6).toFixed(1)}" y2="${(y + Math.sin(rad) * r * 0.6).toFixed(1)}"/>`; }).join('');
        return `<circle class="car__tyre" cx="${x}" cy="${y}" r="${r}"/><circle class="car__rim" cx="${x}" cy="${y}" r="${(r * 0.68).toFixed(1)}"/>${spokes}<circle class="car__hub" cx="${x}" cy="${y}" r="${(r * 0.14).toFixed(1)}"/>`;
      }).join('');
      const calls = Object.entries(CALL_SLOTS).map(([z, [lx, pos]]) => {
        const [ax, ay] = g.anchors[z];
        const label = P[z][2];
        const w = Math.round(label.length * 9.4 + 24);
        const top = pos === 'top';
        const ry = top ? 18 : 388;
        const ly = top ? ry + 28 : ry;
        return `<g class="call" data-z="${z}"><line x1="${lx}" y1="${ly}" x2="${ax}" y2="${ay}"/><circle cx="${ax}" cy="${ay}" r="4.5"/><rect x="${lx - w / 2}" y="${ry}" width="${w}" height="28" rx="6"/><text x="${lx}" y="${ry + 19}" text-anchor="middle">${esc(label)}</text></g>`;
      }).join('');
      return `<g class="car${c === state.cls ? ' on' : ''}" data-car="${c}">
        <ellipse class="car__shadow" cx="510" cy="${g.wheels[0][1] + g.wheels[0][2] - 2}" rx="470" ry="22"/>
        <path class="car__body" d="${g.body}"/>
        <path class="zone zone--polish" data-z="polish" d="${g.body}"/>
        <path class="zone zone--ceramic" data-z="ceramic" d="${g.body}"/>
        <path class="zone zone--ppf" data-z="ppf_full" d="${g.body}"/>
        <path class="zone zone--ppf" data-z="ppf_front" d="${g.body}" clip-path="url(#cf-${c})"/>
        <path class="car__glass" d="${g.glass}"/>
        <path class="zone zone--tint" data-z="tint" d="${g.glass}"/>
        ${g.seats.map((s) => `<path class="car__pillar" d="${s}"/><path class="zone zone--interior" data-z="interior" d="${s}"/>`).join('')}
        ${g.pillars.map((p) => `<path class="car__pillar" d="${p}"/>`).join('')}
        ${g.intake ? `<path class="car__pillar" d="${g.intake}"/>` : ''}
        ${g.lines.map((l) => `<path class="car__line" d="${l}"/>`).join('')}
        <path class="car__lamp" d="${g.lamp}"/><path class="car__tail" d="${g.tail}"/>
        <g clip-path="url(#cb-${c})"><g transform="skewX(-22)"><rect class="sw-anim" x="0" y="-40" width="170" height="520" fill="url(#gSweep)"/></g></g>
        ${wheels}
        ${calls}
      </g>`;
    }).join('');
    return `<svg viewBox="${narrow.matches ? '40 84 930 310' : '0 0 1000 430'}" role="presentation" focusable="false">${defs}${groups}</svg>`;
  }

  function syncCar(pulseId) {
    const stage = $('#carStage');
    $$('.car', stage).forEach((g) => g.classList.toggle('on', g.dataset.car === state.cls));
    const active = $(`.car[data-car="${state.cls}"]`, stage);
    if (!active) return;
    $$('[data-z]', active).forEach((el) => {
      const on = state.sel.has(el.dataset.z);
      el.classList.toggle('on', on);
      if (on && pulseId === el.dataset.z && el.classList.contains('zone') && !reduceMotion) {
        el.classList.remove('pulse'); void el.getBBox(); el.classList.add('pulse');
      }
    });
    stageLabel();
    $$('#legend li').forEach((li) => li.classList.toggle('on', li.dataset.k.split(',').some((k) => state.sel.has(k))));
  }

  // ── Конфигуратор: UI ───────────────────────────────────
  const SW = { ppf_full: 'ppf', ppf_front: 'ppf', ceramic: 'ceramic', polish: 'polish', tint: 'tint', interior: 'interior' };
  function renderConfig() {
    $('#carStage').innerHTML = carSVG();
    const C = t('classes');
    $('#classSeg').innerHTML = CLASSES.map((c) => `<button type="button" role="radio" aria-checked="${c === state.cls}" data-cls="${c}" tabindex="${c === state.cls ? 0 : -1}"><svg viewBox="0 0 52 20" aria-hidden="true">${CLASS_ICON[c]}</svg>${esc(C[c][0])}<small>${esc(C[c][1])}</small></button>`).join('');
    const P = t('packs');
    $('#packs').innerHTML = PACKS.map((p) => `<label class="pack" data-pack="${p.id}">
        <input type="checkbox" value="${p.id}"${state.sel.has(p.id) ? ' checked' : ''}>
        <span class="pack__box" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m5 12 5 5 9-10"/></svg></span>
        <span class="pack__name"><span class="sw sw--${SW[p.id]}" aria-hidden="true"></span>${esc(P[p.id][0])}</span>
        <span class="pack__price" data-price></span>
        <span class="pack__desc">${esc(P[p.id][1])}</span>
        <span class="pack__time" data-time></span>
        ${p.excl ? `<span class="pack__chip">${esc(t('excl'))} ${esc(P[p.excl][0])}</span>` : ''}
      </label>`).join('');
    const legend = [['ppf', 'ppf_full,ppf_front', 'PPF'], ['ceramic', 'ceramic', P.ceramic[2]], ['polish', 'polish', P.polish[2]], ['tint', 'tint', P.tint[2]], ['interior', 'interior', P.interior[2]]];
    $('#legend').innerHTML = legend.map(([s, k, l]) => `<li data-k="${k}"><span class="sw sw--${s}"></span>${esc(l)}</li>`).join('');
    updateTotals();
    syncCar();
  }

  function calc() {
    const k = TIME_K[state.cls];
    let sum = 0, ext = 0, par = 0;
    PACKS.forEach((p) => {
      if (!state.sel.has(p.id)) return;
      sum += p.price[state.cls];
      if (p.parallel) par += p.h * k; else ext += p.h * k;
    });
    const n = state.sel.size;
    const disc = n >= BUNDLE_MIN ? Math.round(sum * BUNDLE_OFF) : 0;
    const hours = Math.round(Math.max(ext, par));
    return { sum, disc, total: sum - disc, hours, days: Math.max(1, Math.ceil(hours / 12)), n };
  }

  let shownTotal = 0, rafTotal = 0;
  const paintTotal = (v) => { const m = money(v); $('#sumPrice').textContent = m; const sp = $('#stagePrice'); if (sp) sp.textContent = m; };
  function animateTotal(to) {
    cancelAnimationFrame(rafTotal);
    if (reduceMotion) { shownTotal = to; paintTotal(to); return; }
    const from = shownTotal, t0 = performance.now(), dur = 520;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      shownTotal = from + (to - from) * e;
      paintTotal(Math.round(shownTotal / 100) * 100);
      if (p < 1) rafTotal = requestAnimationFrame(step); else { shownTotal = to; paintTotal(to); }
    };
    rafTotal = requestAnimationFrame(step);
  }

  // Подпись над машиной: габариты, а в «прилипшем» режиме на узких экранах — цена и часы
  let stagePinned = false;
  const stacked = window.matchMedia('(max-width: 899px)');
  function stageLabel(animate) {
    const el = $('#stageClass');
    const name = t('classes')[state.cls][0];
    const r = calc();
    const html = stagePinned && stacked.matches
      ? `${esc(name)} · <b id="stagePrice">${money(shownTotal || r.total)}</b> · ${r.n ? r.hours : 0} ${esc(t('hrs'))}`
      : `${esc(name)} · ${esc(CARS[state.cls].dims)}`;
    if (animate && !reduceMotion) {
      el.classList.add('is-swap');
      setTimeout(() => { el.innerHTML = html; el.classList.remove('is-swap'); }, 200);
    } else el.innerHTML = html;
  }

  function updateTotals() {
    const k = TIME_K[state.cls];
    $$('.pack').forEach((el) => {
      const p = PACKS.find((x) => x.id === el.dataset.pack);
      $('[data-price]', el).textContent = money(p.price[state.cls]);
      $('[data-time]', el).textContent = `${Math.round(p.h * k)} ${t('hrs')}`;
      el.classList.toggle('pack--off', !!p.excl && state.sel.has(p.excl));
    });
    const r = calc();
    animateTotal(r.total);
    const old = $('#sumOld');
    old.hidden = !r.disc; old.textContent = r.disc ? money(r.sum) : '';
    $('#sumTime').textContent = r.n ? t('inBay')(r.hours, r.days) : t('noPacks');
    $('#sumDisc').textContent = r.disc ? `${t('bundle')(BUNDLE_OFF * 100)} · ${t('save')(money(r.disc))}` : (r.n ? t('bundleHint')(BUNDLE_MIN - r.n) : '');
    renderTicket();
    renderReadout(r);
    renderFinal(r);
    stageLabel();
  }

  $('#classSeg').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cls]');
    if (b) setClass(b.dataset.cls, false);
  });
  $('#classSeg').addEventListener('keydown', (e) => {
    const i = CLASSES.indexOf(state.cls);
    let n = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % 3;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i + 2) % 3;
    if (n !== null) { e.preventDefault(); setClass(CLASSES[n], true); }
  });
  function setClass(c, focus) {
    state.cls = c;
    $$('#classSeg button').forEach((b) => { const on = b.dataset.cls === c; b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
    updateTotals();
    syncCar();
  }
  $('#packs').addEventListener('change', (e) => {
    const inp = e.target;
    if (!inp.matches('input[type="checkbox"]')) return;
    const p = PACKS.find((x) => x.id === inp.value);
    if (inp.checked) {
      state.sel.add(p.id);
      if (p.excl && state.sel.has(p.excl)) { state.sel.delete(p.excl); const o = $(`.pack[data-pack="${p.excl}"] input`); if (o) o.checked = false; }
    } else state.sel.delete(p.id);
    updateTotals();
    syncCar(inp.checked ? p.id : null);
  });

  const WARRANTY_Y = { ppf_full: 10, ppf_front: 10, ceramic: 5, tint: 7, interior: 2, polish: 0 };
  function renderReadout(r) {
    const cov = state.sel.has('ppf_full') ? 100 : state.sel.has('ppf_front') ? 34 : 0;
    const war = Math.max(0, ...[...state.sel].map((k) => WARRANTY_Y[k]));
    const gloss = state.sel.has('ceramic') ? '9H' : state.sel.has('polish') ? t('ro.polished') : '—';
    $('#readout').innerHTML = `<div><dt>${esc(t('ro.cov'))}</dt><dd class="${cov ? 'is-acc' : ''}">${cov}<small>%</small><span class="ro-bar"><i style="transform:scaleX(${cov / 100})"></i></span></dd></div>
      <div><dt>${esc(t('ro.gloss'))}</dt><dd>${esc(gloss)}</dd></div>
      <div><dt>${esc(t('ro.war'))}</dt><dd>${war ? war + `<small>${esc(t('yrs'))}</small>` : '—'}</dd></div>
      <div><dt>${esc(t('ro.bay'))}</dt><dd>${r.n ? r.hours + `<small>${esc(t('hrs'))}</small>` : '—'}</dd></div>`;
  }

  // ── Билет-сводка в блоке записи ────────────────────────
  function renderTicket() {
    const r = calc();
    const P = t('packs');
    const list = PACKS.filter((p) => state.sel.has(p.id));
    $('#ticket').innerHTML = `<div class="ticket__top"><span class="ticket__k">${esc(t('ticketK'))}</span>
      <div class="ticket__class"><span>${esc(t('classes')[state.cls][0])}</span><b>${money(r.total)}</b></div></div>
      <div class="ticket__cut" aria-hidden="true"></div>
      <ul class="ticket__list">${list.length ? list.map((p) => `<li><span>${esc(P[p.id][0])}</span><span>${money(p.price[state.cls])}</span></li>`).join('') + (r.disc ? `<li><span>${esc(t('bundle')(BUNDLE_OFF * 100))}</span><span>−${money(r.disc)}</span></li>` : '') : `<li class="ticket__empty">${esc(t('ticketEmpty'))}</li>`}</ul>
      <div class="ticket__foot"><span>${list.length ? esc(t('inBay')(r.hours, r.days)) : ''}</span><a href="#config">${esc(t('ticketEdit'))}</a></div>`;
  }

  // ── Финальный блок: живой итог и дата готовности ──────
  function renderFinal(r = calc()) {
    if (!$('#finTotal')) return;
    const base = state.day ? new Date(state.day + 'T00:00:00') : new Date();
    const ready = new Date(base.getFullYear(), base.getMonth(), base.getDate() + (r.n ? r.days - 1 : 0));
    const now = new Date(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const rel = Math.round((ready - today) / 864e5);
    $('#finalLine').textContent = t('finLine')(ready.getDay(), rel);
    $('#finSetup').textContent = `${t('classes')[state.cls][0]} · ${r.n ? t('packsN')(r.n) : t('inspection')}`;
    $('#finTotal').textContent = money(r.total);
    $('#finReady').textContent = t('readyFmt')(ready);
  }

  // ── Даты и время ───────────────────────────────────────
  const SLOTS = ['09:00', '10:30', '12:00', '14:00', '16:00', '18:00'];
  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  function dayList() {
    const now = new Date(), out = [];
    for (let i = 0; i < 14; i++) { const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i); out.push(d); }
    return out;
  }
  function slotState(d) {
    const now = new Date(), isToday = iso(d) === iso(now);
    return SLOTS.map((s) => {
      const [hh, mm] = s.split(':').map(Number);
      const past = isToday && (hh * 60 + mm) <= now.getHours() * 60 + now.getMinutes() + 60;
      const taken = hash(iso(d) + s) % 5 < 2;
      return { s, free: !past && !taken };
    });
  }
  function renderDays() {
    const days = dayList();
    if (!state.day || !days.some((d) => iso(d) === state.day)) {
      const first = days.find((d) => slotState(d).some((x) => x.free));
      state.day = first ? iso(first) : iso(days[0]);
    }
    $('#days').innerHTML = days.map((d, i) => {
      const left = slotState(d).filter((x) => x.free).length;
      const top = i === 0 ? t('today') : i === 1 ? t('tomorrow') : t('wd')[d.getDay()];
      const on = iso(d) === state.day;
      return `<button type="button" class="day" role="radio" data-day="${iso(d)}" aria-checked="${on}" tabindex="${on ? 0 : -1}" ${left ? '' : 'disabled'} aria-label="${d.getDate()} ${esc(t('months')[d.getMonth()])}, ${esc(top)}"><small>${esc(top)}</small><b>${d.getDate()}</b><i>${left ? esc(t('slotsLeft')(left)) : esc(t('full'))}</i></button>`;
    }).join('');
    renderTimes();
    syncDayFades();
    renderFinal();
  }
  function renderTimes() {
    const d = new Date(state.day + 'T00:00:00');
    const slots = slotState(d);
    if (state.time && !slots.find((x) => x.s === state.time && x.free)) state.time = null;
    const firstFocus = state.time || (slots.find((x) => x.free) || {}).s;
    $('#times').innerHTML = slots.map((x) => `<button type="button" class="time" role="radio" data-time="${x.s}" aria-checked="${x.s === state.time}" tabindex="${x.s === firstFocus ? 0 : -1}" ${x.free ? '' : 'disabled'}>${x.s}</button>`).join('');
  }
  function radioKeys(container, sel, onPick) {
    container.addEventListener('keydown', (e) => {
      if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
      const items = $$(sel, container).filter((b) => !b.disabled);
      const i = items.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      const n = items[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length];
      onPick(n); n.focus();
    });
  }
  const pickDay = (b) => {
    state.day = b.dataset.day;
    $$('.day').forEach((x) => { const on = x === b; x.setAttribute('aria-checked', String(on)); x.tabIndex = on ? 0 : -1; });
    renderTimes();
    renderFinal();
    if (b.scrollIntoView && narrow.matches) b.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  // Лента дней на телефоне: стрелки, затухание краёв
  const daysEl = $('#days'), daysWrap = $('#daysWrap');
  function syncDayFades() {
    const max = daysEl.scrollWidth - daysEl.clientWidth - 2;
    const scrollable = narrow.matches && max > 0;
    daysWrap.classList.toggle('fade-l', scrollable && daysEl.scrollLeft > 2);
    daysWrap.classList.toggle('fade-r', scrollable && daysEl.scrollLeft < max);
    $('#dayPrev').disabled = !scrollable || daysEl.scrollLeft <= 2;
    $('#dayNext').disabled = !scrollable || daysEl.scrollLeft >= max;
  }
  let dayTick = false;
  daysEl.addEventListener('scroll', () => { if (dayTick) return; dayTick = true; requestAnimationFrame(() => { syncDayFades(); dayTick = false; }); }, { passive: true });
  const chipW = () => { const c = $('.day', daysEl); return c ? c.getBoundingClientRect().width + 6 : 72; };
  $('#dayPrev').addEventListener('click', () => daysEl.scrollBy({ left: -chipW(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  $('#dayNext').addEventListener('click', () => daysEl.scrollBy({ left: chipW(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  const pickTime = (b) => {
    state.time = b.dataset.time;
    $$('.time').forEach((x) => { const on = x === b; x.setAttribute('aria-checked', String(on)); x.tabIndex = on ? 0 : -1; });
    showErr($('#errSlot'), '');
  };
  $('#days').addEventListener('click', (e) => { const b = e.target.closest('.day'); if (b && !b.disabled) pickDay(b); });
  $('#times').addEventListener('click', (e) => { const b = e.target.closest('.time'); if (b && !b.disabled) pickTime(b); });
  radioKeys($('#days'), '.day', pickDay);
  radioKeys($('#times'), '.time', pickTime);

  // ── Форма ──────────────────────────────────────────────
  const form = $('#bookForm');
  function showErr(el, msg) { if (!el) return; el.textContent = msg; el.hidden = !msg; }
  function fieldErr(input, msg) {
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    const p = document.getElementById('err-' + input.name);
    if (p) showErr(p, msg);
  }
  form.phone.addEventListener('input', () => { form.phone.value = form.phone.value.replace(/[^\d+()\-\s]/g, ''); });
  ['name', 'phone', 'car'].forEach((n) => form[n].addEventListener('input', () => { if (form[n].getAttribute('aria-invalid') === 'true') validate(n); }));
  form.consent.addEventListener('change', () => { if (form.consent.checked) { form.consent.setAttribute('aria-invalid', 'false'); showErr($('#errConsent'), ''); } });
  function validate(only) {
    const res = {};
    if (!only || only === 'name') { const ok = form.name.value.trim().length >= 2; fieldErr(form.name, ok ? '' : t('book.errName')); res.name = ok; }
    if (!only || only === 'phone') { const d = form.phone.value.replace(/\D/g, ''); const ok = d.length >= 10 && d.length <= 15; fieldErr(form.phone, ok ? '' : t('book.errPhone')); res.phone = ok; }
    if (!only || only === 'car') { const ok = form.car.value.trim().length >= 2; fieldErr(form.car, ok ? '' : t('book.errCar')); res.car = ok; }
    return res;
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const slotOk = !!state.time;
    showErr($('#errSlot'), slotOk ? '' : t('book.errSlot'));
    const v = validate();
    const consentOk = form.consent.checked;
    form.consent.setAttribute('aria-invalid', consentOk ? 'false' : 'true');
    showErr($('#errConsent'), consentOk ? '' : t('book.errConsent'));
    if (!slotOk) { ($('.time:not(:disabled)') || $('#times')).focus(); return; }
    const bad = ['name', 'phone', 'car'].find((n) => !v[n]);
    if (bad) { form[bad].focus(); return; }
    if (!consentOk) { form.consent.focus(); return; }

    const d = new Date(state.day + 'T00:00:00');
    const when = lang === 'ru' ? `${d.getDate()} ${t('months')[d.getMonth()]}, ${state.time}` : `${t('wd')[d.getDay()]}, ${t('months')[d.getMonth()]} ${d.getDate()} at ${state.time}`;
    const P = t('packs');
    const list = PACKS.filter((p) => state.sel.has(p.id)).map((p) => P[p.id][0]);
    const r = calc();
    const setup = list.length ? `${list.join(' + ')} — ${money(r.total)}` : t('inspection');
    const bay = String((hash(state.day + state.time) % 4) + 1).padStart(2, '0');
    $('#doneCode').textContent = `OB-${state.day.slice(5).replace('-', '')}-${state.time.replace(':', '')} · BAY ${bay}`;
    $('#doneText').textContent = t('done')({ name: form.name.value.trim(), when, car: form.car.value.trim(), bay, setup, phone: form.phone.value.trim() });
    form.hidden = true;
    const done = $('#done');
    done.hidden = false;
    done.focus({ preventScroll: true });
    const card = done.closest('.book__card');
    const top = card.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight * 0.6) card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
  $('#again').addEventListener('click', () => {
    form.reset();
    state.time = null;
    $$('[aria-invalid]', form).forEach((x) => x.setAttribute('aria-invalid', 'false'));
    $$('.err', form).forEach((x) => showErr(x, ''));
    renderDays();
    $('#done').hidden = true;
    form.hidden = false;
    syncDayFades();
    const cfg = $('#config');
    cfg.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  // ── Прочие блоки ───────────────────────────────────────
  function renderStatic() {
    const tick = t('ticker').map((s) => `<span>${esc(s)}<i></i></span>`).join('');
    $('#ticker').innerHTML = tick + tick.replace(/<span>/g, '<span aria-hidden="true">');
    $('#steps').innerHTML = '<span class="steps__fill" aria-hidden="true"></span>' + t('steps').map(([h, p, time], i) => `<li class="stepc"><div class="stepc__n"><b>0${i + 1}</b><span>${esc(time)}</span></div><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`).join('');
    observeSteps();
    $('#layerList').innerHTML = t('layers').map(([h, th, p], i) => `<li tabindex="0" data-l="${i}"><span class="mono">L${i + 1}</span><b>${esc(h)}</b><i>${esc(th)}</i><span>${esc(p)}</span></li>`).join('');
    $('#wtable').innerHTML = t('warranty').map(([h, s, y]) => `<tr><th scope="row">${esc(h)}<small>${esc(s)}</small></th><td>${y}<small>${esc(t('yrs'))}</small></td></tr>`).join('');
    $('#gallery').innerHTML = t('gallery').map(([cap, tag, alt], i) => `<figure class="gal reveal"><img loading="lazy" decoding="async" src="${IMG(GALLERY[i], GAL_SIZE[i][0], GAL_SIZE[i][1]).replace('fit=crop', 'fit=crop' + (GAL_RECT[i] ? '&rect=' + GAL_RECT[i] : ''))}" alt="${esc(alt)}"><figcaption><span>${esc(cap)}</span><b>${esc(tag)}</b></figcaption></figure>`).join('');
    $('#faqList').innerHTML = t('faq').map(([q, a], i) => `<details class="qa reveal"${i === 0 ? ' open' : ''}><summary>${esc(q)}<i aria-hidden="true"></i></summary><p>${esc(a)}</p></details>`).join('');
  }

  // Слои плёнки — подсветка при наведении
  const layers = $('#layers');
  const wideMQ = window.matchMedia('(min-width: 900px)');
  const setLayer = (i) => {
    if (i === null && wideMQ.matches) i = 0; // на десктопе по умолчанию раскрыт L1
    if (i === null) layers.removeAttribute('data-active'); else layers.dataset.active = i;
    $$('#layerList li').forEach((li) => li.classList.toggle('act', li.dataset.l === String(i)));
    $$('.layer', layers).forEach((g) => g.classList.toggle('is-act', g.dataset.l === String(i)));
  };
  $('#layerList').addEventListener('mouseover', (e) => { const li = e.target.closest('li'); if (li) setLayer(li.dataset.l); });
  $('#layerList').addEventListener('mouseleave', () => setLayer(null));
  $('#layerList').addEventListener('focusin', (e) => { const li = e.target.closest('li'); if (li) setLayer(li.dataset.l); });
  $('#layerList').addEventListener('focusout', () => setLayer(null));

  // ── Процесс: горизонтальная лента с линией прогресса ──
  const rail = $('#rail'), stepsEl = $('#steps');
  let stepIO = null;
  function updateFill() {
    const on = $$('.stepc.on', stepsEl);
    const fill = $('.steps__fill', stepsEl);
    if (!fill) return;
    const last = on[on.length - 1];
    const w = stepsEl.offsetWidth || 1;
    fill.style.setProperty('--fill', last ? Math.min(1, (last.offsetLeft + 28) / w).toFixed(4) : 0);
  }
  function observeSteps() {
    if (stepIO) stepIO.disconnect();
    const items = $$('.stepc', stepsEl);
    if (reduceMotion || !('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('on')); requestAnimationFrame(updateFill); return; }
    stepIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('on'); stepIO.unobserve(e.target); } });
      updateFill();
    }, { threshold: 0.7 });
    items.forEach((el) => stepIO.observe(el));
  }
  const stepW = () => { const c = $('.stepc', stepsEl); return c ? c.getBoundingClientRect().width + 12 : 320; };
  function syncRail() {
    const max = rail.scrollWidth - rail.clientWidth - 2;
    const n = $$('.stepc', stepsEl).length;
    const i = Math.min(n, Math.round(rail.scrollLeft / stepW()) + 1);
    $('#stepCount').textContent = `${String(i).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
    $('#stepPrev').disabled = rail.scrollLeft <= 2;
    $('#stepNext').disabled = rail.scrollLeft >= max;
  }
  let railTick = false;
  rail.addEventListener('scroll', () => { if (railTick) return; railTick = true; requestAnimationFrame(() => { syncRail(); railTick = false; }); }, { passive: true });
  $('#stepPrev').addEventListener('click', () => rail.scrollBy({ left: -stepW(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  $('#stepNext').addEventListener('click', () => rail.scrollBy({ left: stepW(), behavior: reduceMotion ? 'auto' : 'smooth' }));

  // ── Галерея на телефоне: счётчик и прогресс ───────────
  const gal = $('#gallery');
  let galTick = false;
  function syncGal() {
    const tiles = $$('.gal', gal);
    if (!tiles.length) return;
    const w = tiles[0].getBoundingClientRect().width + 10;
    const i = Math.min(tiles.length, Math.round(gal.scrollLeft / w) + 1);
    $('#galCount').textContent = `${String(i).padStart(2, '0')} / ${String(tiles.length).padStart(2, '0')}`;
    const p = gal.scrollWidth > gal.clientWidth ? (gal.scrollLeft + gal.clientWidth) / gal.scrollWidth : 1;
    $('#galBar').style.transform = `scaleX(${Math.min(1, p).toFixed(4)})`;
  }
  gal.addEventListener('scroll', () => { if (galTick) return; galTick = true; requestAnimationFrame(() => { syncGal(); galTick = false; }); }, { passive: true });

  // ── Язык ───────────────────────────────────────────────
  function applyLang(next) {
    lang = T[next] ? next : 'en';
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach((el) => { const v = t(el.dataset.i18n); if (typeof v === 'string') el.textContent = v; });
    $$('[data-i18n-html]').forEach((el) => { const v = t(el.dataset.i18nHtml); if (typeof v === 'string') el.innerHTML = v; });
    $$('[data-i18n-alt]').forEach((el) => { el.alt = t(el.dataset.i18nAlt); });
    $$('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    $$('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    document.title = t('title');
    renderStatic();
    renderConfig();
    renderDays();
    // если форма уже отправлена — сообщение остаётся на прежнем языке до новой записи
    observeReveals();
    setLayer(null);
    requestAnimationFrame(() => { syncRail(); syncGal(); syncDayFades(); });
    store.set('obsid-lang', lang);
  }
  let rsT = 0;
  window.addEventListener('resize', () => { clearTimeout(rsT); rsT = setTimeout(() => { syncRail(); syncGal(); syncDayFades(); updateFill(); stageLabel(); }, 150); });
  $$('.lang button').forEach((b) => b.addEventListener('click', () => { if (b.dataset.lang !== lang) applyLang(b.dataset.lang); }));

  // ── Навигация ──────────────────────────────────────────
  const nav = $('#nav'), burger = $('.burger'), drawer = $('#drawer');
  const setDrawer = (open) => { burger.setAttribute('aria-expanded', String(open)); drawer.hidden = !open; };
  burger.addEventListener('click', () => setDrawer(drawer.hidden));
  drawer.addEventListener('click', (e) => { if (e.target.closest('a')) setDrawer(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !drawer.hidden) { setDrawer(false); burger.focus(); } });
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { nav.classList.toggle('is-scrolled', window.scrollY > 20); ticking = false; });
  }, { passive: true });

  // ── До / после ─────────────────────────────────────────
  const ba = $('#ba'), range = $('.ba__range', ba);
  let baIntro = 0;
  range.addEventListener('input', () => { cancelAnimationFrame(baIntro); ba.style.setProperty('--pos', range.value + '%'); });
  range.addEventListener('pointerdown', () => cancelAnimationFrame(baIntro));
  // Голограммы концентрируются вокруг бликов ламп — там их видно в реальности
  (function swirls() {
    let out = '';
    let seed = 11;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const lights = [[300, 104, 70], [246, 196, 62], [340, 232, 58], [112, 146, 44], [338, 54, 40], [80, 34, 34]];
    lights.forEach(([cx, cy, R]) => {
      for (let r = 4; r < R; r += 2.2 + rnd() * 2.4) out += `<circle cx="${cx}" cy="${cy}" r="${r.toFixed(1)}" stroke-opacity="${(0.18 + rnd() * 0.4).toFixed(2)}" stroke-dasharray="${(6 + rnd() * 22).toFixed(0)} ${(4 + rnd() * 14).toFixed(0)}" transform="rotate(${(rnd() * 360).toFixed(0)} ${cx} ${cy})"/>`;
    });
    for (let i = 0; i < 22; i++) { const x = rnd() * 400, y = rnd() * 300, a = rnd() * 3.14, l = 8 + rnd() * 30; out += `<path d="M${x.toFixed(1)} ${y.toFixed(1)} l${(Math.cos(a) * l).toFixed(1)} ${(Math.sin(a) * l).toFixed(1)}" stroke="#fff" stroke-width=".35" stroke-opacity=".45"/>`; }
    $('#swirls').innerHTML = out;
  })();
  // Подсказка: ручка один раз «показывает», что её можно тянуть
  function baHint() {
    if (reduceMotion) return;
    const keys = [50, 28, 70, 50], seg = 600, t0 = performance.now();
    const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    const step = (now) => {
      const k = (now - t0) / seg, i = Math.min(2, Math.floor(k)), f = Math.min(1, k - i);
      const v = keys[i] + (keys[i + 1] - keys[i]) * ease(f);
      ba.style.setProperty('--pos', v.toFixed(2) + '%');
      if (k < 3) baIntro = requestAnimationFrame(step); else ba.style.setProperty('--pos', range.value + '%');
    };
    baIntro = requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    const baIO = new IntersectionObserver((en) => { if (en[0].isIntersecting) { baIO.disconnect(); setTimeout(baHint, 500); } }, { threshold: 0.55 });
    baIO.observe(ba);
  }

  // ── Появление, счётчики, пауза анимаций вне экрана ─────
  let io = null;
  function observeReveals() {
    const els = $$('.reveal:not(.in)');
    if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('in')); layers.classList.add('in'); return; }
    if (!io) io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach((el) => io.observe(el));
  }
  if ('IntersectionObserver' in window) {
    const vis = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle('is-off', !e.isIntersecting)), { threshold: 0 });
    [$('.hero'), $('.ticker'), $('.cfg__stage')].forEach((el) => el && vis.observe(el));
  }

  // HUD «в работе»: разгон до 72%, потом +1% каждые ~5 с, пока герой на экране (до 74%)
  function hud() {
    let pct = 72;
    const bar = $('#hudBar'), out = $('#hudPct'), heroEl = $('.hero');
    const set = () => { bar.style.transform = `scaleX(${pct / 100})`; out.textContent = pct + '%'; };
    if (reduceMotion) { set(); return; }
    setTimeout(() => {
      bar.classList.add('is-first');
      bar.style.transform = `scaleX(${pct / 100})`;
      const t0 = performance.now();
      const step = (now) => { const p = Math.min(1, (now - t0) / 2200), e = 1 - Math.pow(1 - p, 3); out.textContent = Math.round(pct * e) + '%'; if (p < 1) requestAnimationFrame(step); else bar.classList.remove('is-first'); };
      requestAnimationFrame(step);
      const iv = setInterval(() => {
        if (heroEl.classList.contains('is-off') || document.hidden) return;
        pct += 1; set();
        if (pct >= 74) clearInterval(iv);
      }, 5000);
    }, 900);
  }

  // Прилипшая сцена конфигуратора: на узких экранах показываем цену вместо габаритов
  if ('IntersectionObserver' in window) {
    const navH = () => $('#nav').offsetHeight || 64;
    let pinIO = null;
    const makePinIO = () => {
      if (pinIO) pinIO.disconnect();
      pinIO = new IntersectionObserver(([e]) => {
        const pinned = !e.isIntersecting && e.boundingClientRect.top < (e.rootBounds ? e.rootBounds.top : navH());
        if (pinned !== stagePinned) { stagePinned = pinned; $('#cfgStage').classList.toggle('is-pinned', pinned); stageLabel(true); }
      }, { rootMargin: `-${navH() + 7}px 0px 0px 0px`, threshold: 0 });
      pinIO.observe($('#cfgPin'));
    };
    makePinIO();
    const onStack = () => stageLabel(false);
    if (stacked.addEventListener) stacked.addEventListener('change', onStack);
  }

  // ── Герой: инспекционный свет сканирует машину и проявляет каркас ──
  function heroScan() {
    const frame = $('#heroFrame'), scan = $('#scan'), heroEl = $('.hero');
    if (!frame || !scan || reduceMotion) return;
    let W = 0, left = 0, x = -400, target = 0, mode = 'idle', raf = 0, visible = true, t0 = 0, next = 0;
    const SWEEP = 2600;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const measure = () => { const r = frame.getBoundingClientRect(); W = r.width; left = r.left; scan.style.setProperty('--fw', W.toFixed(1) + 'px'); };
    const setX = (v) => { x = v; scan.style.setProperty('--x', v.toFixed(1) + 'px'); };
    const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
    const tick = (now) => {
      raf = 0;
      if (!visible) return;
      if (mode === 'sweep') {
        const p = Math.min(1, (now - t0) / SWEEP);
        setX(W * (-0.04 + 1.08 * ease(p)));
        if (p >= 1) { mode = 'idle'; scan.classList.remove('is-on'); scheduleNext(); return; }
      } else if (mode === 'follow') {
        const d = target - x;
        if (Math.abs(d) < 0.4) { setX(target); return; }
        setX(x + d * 0.14);
      } else return;
      raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf && visible) raf = requestAnimationFrame(tick); };
    const sweep = () => { clearTimeout(next); measure(); mode = 'sweep'; t0 = performance.now(); setX(-0.04 * W); scan.classList.add('is-on'); kick(); };
    const scheduleNext = () => { clearTimeout(next); if (!canHover) next = setTimeout(() => { if (visible && mode === 'idle') sweep(); else scheduleNext(); }, 9000); };
    measure();
    if ('ResizeObserver' in window) new ResizeObserver(measure).observe(frame); else window.addEventListener('resize', measure);
    if (canHover) {
      heroEl.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse' || mode === 'sweep') return;
        target = Math.max(-0.05 * W, Math.min(1.05 * W, e.clientX - left));
        if (mode !== 'follow') { mode = 'follow'; if (x < -0.04 * W || x > 1.04 * W) setX(target); scan.classList.add('is-on'); }
        kick();
      });
      heroEl.addEventListener('pointerleave', () => { if (mode === 'follow') { mode = 'idle'; scan.classList.remove('is-on'); } });
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); else if (raf) { cancelAnimationFrame(raf); raf = 0; } }, { threshold: 0.05 }).observe(heroEl);
    }
    const img = $('img', frame);
    const start = () => setTimeout(sweep, 700);
    if (img.complete && img.naturalWidth) start(); else { img.addEventListener('load', start, { once: true }); img.addEventListener('error', start, { once: true }); }
  }

  applyLang(lang);
  hud();
  heroScan();
})();
