// SEREIN Residences — язык EN/RU, карта, материалы, выбор квартиры, ипотека, ход строительства, галерея, запись на просмотр.
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const IMG = (id, w = 1000) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
  const SVGNS = 'http://www.w3.org/2000/svg';
  const smooth = reduceMotion ? 'auto' : 'smooth';

  // ── Тексты интерфейса ──────────────────────────────────
  const T = {
    en: {
      title: 'SEREIN Residences — quiet living by the river',
      skip: 'Skip to content', 'logo.sub': 'Residences',
      'nav.concept': 'Concept', 'nav.location': 'Location', 'nav.arch': 'Architecture', 'nav.res': 'Residences', 'nav.mortgage': 'Mortgage', 'nav.progress': 'Progress', 'nav.gallery': 'Gallery', 'nav.book': 'Book a viewing',
      'hero.kicker': 'Tikhaya Embankment · Keys Q4 2027', 'hero.aria': 'A quieter way to live by the river',
      'hero.l1': 'A quieter way', 'hero.l2': 'to live <em>by the river</em>',
      'hero.lead': 'Seventy-five residences in limestone and bronze, a private courtyard garden and a rooftop pool above the water. Fifteen floors, no rush.',
      'hero.cta1': 'Choose a residence', 'hero.cta2': 'Book a private viewing',
      'hero.alt': 'Pale limestone facade of a modern residential building against a soft blue sky',
      'hero.avail': 'Available now', 'hero.from': (p) => `from ${p}`, 'hero.f1': 'floors', 'hero.f2': 'ceilings', 'hero.f3': 'car-free courtyard', 'hero.scroll': 'Scroll to concept',
      'concept.kicker': 'Concept',
      'concept.statement': 'We designed SEREIN around one idea: the city should feel far away the moment you step inside. Thick limestone walls, acoustic glazing, a garden in place of a car park, and windows that frame the river instead of the neighbours.',
      'concept.s1': 'residences, from 41 to 312 m²', 'concept.s2': 'homes per floor on average — no long corridors', 'concept.s3': '% of the site given to the garden', 'concept.s4': 'keys handed over in Q4',
      'loc.kicker': 'Location', 'loc.title': 'On the water, <em>ten minutes</em> from everything',
      'loc.lead': 'A quiet stretch of embankment between a 14-hectare linden park and the old town. Walk to school, cycle to the theatre, drive to the centre in fifteen minutes.',
      'loc.mapAria': 'Stylised map of the neighbourhood with places of interest', 'loc.river': 'River', 'loc.park': 'Linden Park', 'loc.garden': 'Botanic Garden', 'loc.town': 'Old Town',
      'loc.note': 'Stylised map · fictional neighbourhood', 'loc.filterAria': 'Filter places', 'loc.all': 'All',
      'arch.credit': 'Reference imagery · illustrative', 'arch.kicker': 'Architecture & materials', 'arch.title': 'Built to age <em>beautifully</em>',
      'arch.lead': 'A calm volume of stacked limestone boxes, each one shifted to give every residence a deep terrace and a corner view. Materials were chosen for how they will look in thirty years, not in the brochure.',
      'arch.matsAria': 'Materials', 'arch.d1': 'Facade', 'arch.v1': 'Jura limestone, ventilated', 'arch.d2': 'Windows', 'arch.v2': 'Floor-to-ceiling, triple glazing', 'arch.d3': 'Ceilings', 'arch.v3': '3.2 m, penthouses 4.1 m', 'arch.d4': 'Structure', 'arch.v4': 'Monolithic concrete frame',
      'amen.kicker': 'Amenities', 'amen.title': 'A private club, <em>downstairs</em>', 'amen.lead': 'Every service is for residents only, run by an in-house team and included in the maintenance fee.',
      'pick.kicker': 'Residences', 'pick.title': 'Find <em>your</em> residence',
      'pick.lead': 'Choose a floor on the facade, then a home on the plan. Live availability, fixed prices — no “price on request”.',
      'pick.filtersAria': 'Residence filters', 'pick.rooms': 'Bedrooms', 'pick.any': 'Any', 'pick.area': 'Area, m²', 'pick.areaMin': 'Minimum area', 'pick.areaMax': 'Maximum area',
      'pick.price': 'Price', 'pick.priceMin': 'Minimum price', 'pick.priceMax': 'Maximum price', 'pick.floor': 'Floor', 'pick.floorMin': 'Lowest floor', 'pick.floorMax': 'Highest floor',
      'pick.only': 'Available only', 'pick.reset': 'Reset filters',
      'pick.count': (n) => n ? `<b>${n}</b> ${n === 1 ? 'residence matches' : 'residences match'}` : 'Nothing matches — try widening the filters',
      'pick.facade': 'Facade · south', 'pick.lgMatch': 'has matches', 'pick.facadeAria': 'Building facade — choose a floor', 'pick.down': 'Floor below', 'pick.up': 'Floor above', 'pick.floorWord': 'Floor',
      'pick.planAria': 'Floor plan — choose a residence', 'pick.listAria': 'Residences on this floor', 'pick.riverSide': 'River side', 'pick.yard': 'Courtyard', 'pick.lobby': 'Lobby',
      'pick.floorAria': (f, n) => `Floor ${f}, ${n} matching ${n === 1 ? 'residence' : 'residences'}`,
      'pick.tip': (f, n, total, from) => `<b>Floor ${f}</b>${n ? `${n} of ${total} match · from ${from}` : 'No matches on this floor'}`,
      'pick.unitAria': (u, st) => `Residence ${u}, ${st}`,
      'st.available': 'Available', 'st.reserved': 'Reserved', 'st.sold': 'Sold',
      'u.k': (f, v) => `Floor ${f} · ${v}`, 'u.title': (n) => `Residence ${n}`,
      'u.rooms': 'Bedrooms', 'u.area': 'Area', 'u.ceil': 'Ceiling', 'u.floor': 'Floor', 'u.view': 'View', 'u.outdoor': 'Outdoor',
      'u.balcony': 'Balcony', 'u.ppm': (p) => `${p} per m²`, 'u.book': 'Book a viewing', 'u.mort': 'Mortgage',
      'u.sold': 'This residence has found its owner. A similar one is available:', 'u.similar': (n, p) => `Residence ${n} · ${p}`, 'u.noSimilar': 'Leave a request and we will tell you when a similar home appears.',
      'u.reserved': 'Reserved for 7 days. Book a viewing to join the waitlist.',
      'u.empty': 'Select a residence', 'u.emptySub': 'Pick a floor on the facade, then a home on the plan.',
      view_river: 'River', view_riverPark: 'River & park', view_courtyard: 'Courtyard', view_parkCity: 'Park & city', view_panorama: 'Panoramic',
      'mort.kicker': 'Mortgage', 'mort.title': 'Your monthly payment, <em>honestly</em>',
      'mort.lead': 'Pick a programme, move the sliders — numbers update instantly. Select a residence above and its price will appear here.',
      'mort.progAria': 'Mortgage programme', 'mort.price': 'Residence price', 'mort.down': 'Down payment', 'mort.term': 'Term', 'mort.rate': 'Interest rate',
      'mort.monthly': 'Monthly payment', 'mort.loan': 'Loan amount', 'mort.interest': 'Total interest', 'mort.income': 'Suggested income',
      'mort.donutAria': (p) => `Principal is ${p}% of total repayments`, 'mort.principal': 'principal',
      'mort.p1': 'Down payment', 'mort.p1v': 'from 20%', 'mort.p2': 'Term', 'mort.p2v': 'up to 30 years', 'mort.p3': 'Developer instalments', 'mort.p3v': '0% until keys',
      'pick.br': (n) => `${n} ${n === 1 ? 'bedroom' : 'bedrooms'}`,
      'mort.cta': 'Discuss terms at a viewing', 'mort.note': 'Illustrative calculation, not a credit offer. Programmes and rates are fictional.',
      'mort.unit': (n, p) => `Calculating for Residence ${n} · ${p}`,
      years: (n) => `${n} ${n === 1 ? 'year' : 'years'}`, perMonth: '/ mo',
      'prog.kicker': 'Construction progress', 'prog.title': 'On schedule, <em>floor by floor</em>',
      'prog.total': 'complete · frame up to floor 11 of 15 · updated October 2026',
      'prog.alt1': 'Concrete and steel frame of a residential building under construction', 'prog.cap1': 'Frame, floors 9–11 · October 2026',
      'prog.alt2': 'Builders in hard hats on a construction site foundation', 'prog.cap2': 'Foundation slab · September 2025',
      'prog.done': 'Completed', 'prog.now': (p) => `In progress · ${p}%`, 'prog.next': 'Planned',
      'gal.kicker': 'Gallery', 'gal.title': 'Inside the <em>show residences</em>', 'gal.lead': 'Interior references for the turnkey finish. Tap any image to open it full screen.',
      'gal.dialogAria': 'Gallery viewer', 'gal.close': 'Close', 'gal.prev': 'Previous image', 'gal.next': 'Next image', 'gal.open': (c) => `Open image: ${c}`,
      'view.kicker': 'Private viewing', 'view.title': 'Come and <em>feel the quiet</em>',
      'view.lead': 'Visit the sales gallery with a full-size show residence, or join a video tour from home. A personal manager will confirm within one hour.',
      'view.addrK': 'Sales gallery', 'view.addr': '7 Tikhaya Embankment, Moscow (fictional)', 'view.hoursK': 'Hours', 'view.hours': 'Daily 10:00–21:00, by appointment', 'view.phoneK': 'Phone', 'view.mailK': 'Email',
      'view.fmtAria': 'Viewing format', 'view.f1': 'At the sales gallery', 'view.f2': 'Video tour', 'view.day': 'Day', 'view.time': 'Time',
      'view.name': 'Your name', 'view.phone': 'Phone', 'view.consent': 'I agree to the processing of my personal data', 'view.submit': 'Request a viewing',
      'view.unit': (n) => `Residence ${n}`, 'view.unitRemove': 'Remove residence from request',
      'view.errSlot': 'Please choose a day and time.', 'view.errName': 'Please enter your name.', 'view.errPhone': 'Please enter a full phone number.', 'view.errConsent': 'Please confirm consent to continue.',
      'view.okTitle': 'Your viewing is requested', 'view.again': 'Request another time',
      'view.done': (d) => `${d.name}, we have held ${d.when} for a ${d.fmt}${d.unit ? ` of Residence ${d.unit}` : ''}. Your manager will call ${d.phone} within an hour to confirm. (Demo — nothing was sent.)`,
      'view.fmtGallery': 'viewing at the sales gallery', 'view.fmtVideo': 'video tour',
      today: 'Today', tomorrow: 'Tomorrow',
      'foot.tag': 'Quiet living by the river.', 'foot.concept': 'Concept website · portfolio project. SEREIN is a fictional residential complex; all prices, plans and data are illustrative.', 'foot.photos': 'Photos: Unsplash',
      lp: { livkit: 'Kitchen-living', bed: 'Bedroom', mbed: 'Master bedroom', hall: 'Hall', bath: 'Bath', wic: 'Wardrobe', terr: 'Terrace', gallery: 'Gallery', spa: 'Spa bath' },
    },
    ru: {
      title: 'SEREIN Residences — тихая жизнь у реки',
      skip: 'К содержимому', 'logo.sub': 'Residences',
      'nav.concept': 'Концепция', 'nav.location': 'Локация', 'nav.arch': 'Архитектура', 'nav.res': 'Квартиры', 'nav.mortgage': 'Ипотека', 'nav.progress': 'Ход стройки', 'nav.gallery': 'Галерея', 'nav.book': 'Записаться на показ',
      'hero.kicker': 'Тихая набережная · Ключи в IV кв. 2027', 'hero.aria': 'Тихая жизнь у самой воды',
      'hero.l1': 'Тихая жизнь', 'hero.l2': '<em>у самой воды</em>',
      'hero.lead': 'Семьдесят пять резиденций из известняка и бронзы, закрытый сад во дворе и бассейн на крыше над рекой. Пятнадцать этажей — без суеты.',
      'hero.cta1': 'Выбрать квартиру', 'hero.cta2': 'Записаться на приватный показ',
      'hero.alt': 'Светлый известняковый фасад современного жилого дома на фоне нежно-голубого неба',
      'hero.avail': 'Сейчас в продаже', 'hero.from': (p) => `от ${p}`, 'hero.f1': 'этажей', 'hero.f2': 'потолки', 'hero.f3': 'двор без машин', 'hero.scroll': 'Прокрутить к концепции',
      'concept.kicker': 'Концепция',
      'concept.statement': 'Мы строили SEREIN вокруг одной идеи: город должен оставаться далеко, как только вы переступаете порог. Толстые известняковые стены, акустическое остекление, сад вместо парковки и окна, в которых — река, а не соседи.',
      'concept.s1': 'резиденций площадью от 41 до 312 м²', 'concept.s2': 'квартиры на этаже в среднем — никаких длинных коридоров', 'concept.s3': '% участка отдано под сад', 'concept.s4': 'год — ключи в IV квартале',
      'loc.kicker': 'Локация', 'loc.title': 'У воды и в <em>десяти минутах</em> от всего',
      'loc.lead': 'Тихий участок набережной между 14-гектарным липовым парком и старым городом. Пешком до школы, на велосипеде до театра, на машине до центра — пятнадцать минут.',
      'loc.mapAria': 'Стилизованная карта района с важными местами', 'loc.river': 'Река', 'loc.park': 'Липовый парк', 'loc.garden': 'Ботанический сад', 'loc.town': 'Старый город',
      'loc.note': 'Стилизованная карта · вымышленный район', 'loc.filterAria': 'Фильтр мест', 'loc.all': 'Все',
      'arch.credit': 'Референсные изображения · иллюстрация', 'arch.kicker': 'Архитектура и материалы', 'arch.title': 'Дом, который <em>красиво стареет</em>',
      'arch.lead': 'Спокойный объём из сдвинутых друг относительно друга известняковых «коробок»: так у каждой резиденции появляется глубокая терраса и угловой вид. Материалы выбраны по тому, как они будут выглядеть через тридцать лет, а не в буклете.',
      'arch.matsAria': 'Материалы', 'arch.d1': 'Фасад', 'arch.v1': 'Юрский известняк, вентфасад', 'arch.d2': 'Окна', 'arch.v2': 'В пол, тройное остекление', 'arch.d3': 'Потолки', 'arch.v3': '3,2 м, в пентхаусах 4,1 м', 'arch.d4': 'Конструктив', 'arch.v4': 'Монолитный железобетонный каркас',
      'amen.kicker': 'Инфраструктура', 'amen.title': 'Приватный клуб — <em>этажом ниже</em>', 'amen.lead': 'Все сервисы — только для жителей. Ими управляет собственная команда, всё включено в эксплуатационный платёж.',
      'pick.kicker': 'Квартиры', 'pick.title': 'Найдите <em>свою</em> резиденцию',
      'pick.lead': 'Выберите этаж на фасаде, затем квартиру на плане. Актуальное наличие и фиксированные цены — никаких «цена по запросу».',
      'pick.filtersAria': 'Фильтры квартир', 'pick.rooms': 'Спальни', 'pick.any': 'Все', 'pick.area': 'Площадь, м²', 'pick.areaMin': 'Минимальная площадь', 'pick.areaMax': 'Максимальная площадь',
      'pick.price': 'Цена', 'pick.priceMin': 'Минимальная цена', 'pick.priceMax': 'Максимальная цена', 'pick.floor': 'Этаж', 'pick.floorMin': 'Нижний этаж', 'pick.floorMax': 'Верхний этаж',
      'pick.only': 'Только свободные', 'pick.reset': 'Сбросить фильтры',
      'pick.count': (n) => n ? `Подходит: <b>${n}</b> ${plural(n, 'резиденция', 'резиденции', 'резиденций')}` : 'Ничего не нашлось — расширьте фильтры',
      'pick.facade': 'Фасад · юг', 'pick.lgMatch': 'есть подходящие', 'pick.facadeAria': 'Фасад дома — выберите этаж', 'pick.down': 'Этажом ниже', 'pick.up': 'Этажом выше', 'pick.floorWord': 'Этаж',
      'pick.planAria': 'План этажа — выберите квартиру', 'pick.listAria': 'Квартиры на этаже', 'pick.riverSide': 'Сторона реки', 'pick.yard': 'Двор', 'pick.lobby': 'Лобби',
      'pick.floorAria': (f, n) => `Этаж ${f}, подходит ${n}`,
      'pick.tip': (f, n, total, from) => `<b>Этаж ${f}</b>${n ? `подходит ${n} из ${total} · от ${from}` : 'На этом этаже нет подходящих'}`,
      'pick.unitAria': (u, st) => `Резиденция ${u}, ${st}`,
      'st.available': 'Свободна', 'st.reserved': 'Бронь', 'st.sold': 'Продана',
      'u.k': (f, v) => `Этаж ${f} · ${v}`, 'u.title': (n) => `Резиденция ${n}`,
      'u.rooms': 'Спальни', 'u.area': 'Площадь', 'u.ceil': 'Потолки', 'u.floor': 'Этаж', 'u.view': 'Вид', 'u.outdoor': 'Улица',
      'u.balcony': 'Балкон', 'u.ppm': (p) => `${p} за м²`, 'u.book': 'На показ', 'u.mort': 'Ипотека',
      'u.sold': 'У этой резиденции уже есть владелец. Похожая свободна:', 'u.similar': (n, p) => `Резиденция ${n} · ${p}`, 'u.noSimilar': 'Оставьте заявку — сообщим, когда появится похожая.',
      'u.reserved': 'Забронирована на 7 дней. Запишитесь на показ, чтобы встать в лист ожидания.',
      'u.empty': 'Выберите резиденцию', 'u.emptySub': 'Этаж — на фасаде, квартиру — на плане.',
      view_river: 'Река', view_riverPark: 'Река и парк', view_courtyard: 'Двор', view_parkCity: 'Парк и город', view_panorama: 'Панорамный',
      'mort.kicker': 'Ипотека', 'mort.title': 'Ежемесячный платёж — <em>честно</em>',
      'mort.lead': 'Выберите программу и двигайте ползунки — цифры меняются сразу. Выберите квартиру выше, и её цена появится здесь.',
      'mort.progAria': 'Ипотечная программа', 'mort.price': 'Стоимость квартиры', 'mort.down': 'Первоначальный взнос', 'mort.term': 'Срок', 'mort.rate': 'Ставка',
      'mort.monthly': 'Платёж в месяц', 'mort.loan': 'Сумма кредита', 'mort.interest': 'Переплата', 'mort.income': 'Рекомендуемый доход',
      'mort.donutAria': (p) => `Основной долг — ${p}% от всех выплат`, 'mort.principal': 'основной долг',
      'mort.p1': 'Первоначальный взнос', 'mort.p1v': 'от 20%', 'mort.p2': 'Срок', 'mort.p2v': 'до 30 лет', 'mort.p3': 'Рассрочка от застройщика', 'mort.p3v': '0% до ключей',
      'pick.br': (n) => `${n} ${plural(n, 'спальня', 'спальни', 'спален')}`,
      'mort.cta': 'Обсудить условия на показе', 'mort.note': 'Расчёт носит иллюстративный характер и не является офертой. Программы и ставки вымышлены.',
      'mort.unit': (n, p) => `Расчёт для резиденции ${n} · ${p}`,
      years: (n) => `${n} ${plural(n, 'год', 'года', 'лет')}`, perMonth: '/ мес',
      'prog.kicker': 'Ход строительства', 'prog.title': 'Точно по графику, <em>этаж за этажом</em>',
      'prog.total': 'готовности · каркас возведён до 11-го этажа из 15 · обновлено в октябре 2026',
      'prog.alt1': 'Бетонный каркас строящегося жилого дома', 'prog.cap1': 'Каркас, 9–11 этажи · октябрь 2026',
      'prog.alt2': 'Строители в касках на фундаментной плите', 'prog.cap2': 'Фундаментная плита · сентябрь 2025',
      'prog.done': 'Завершено', 'prog.now': (p) => `В работе · ${p}%`, 'prog.next': 'Запланировано',
      'gal.kicker': 'Галерея', 'gal.title': 'Внутри <em>шоу-резиденций</em>', 'gal.lead': 'Интерьерные референсы для отделки «под ключ». Нажмите на изображение, чтобы открыть его на весь экран.',
      'gal.dialogAria': 'Просмотр галереи', 'gal.close': 'Закрыть', 'gal.prev': 'Предыдущее изображение', 'gal.next': 'Следующее изображение', 'gal.open': (c) => `Открыть изображение: ${c}`,
      'view.kicker': 'Приватный показ', 'view.title': 'Приезжайте <em>почувствовать тишину</em>',
      'view.lead': 'Приезжайте в офис продаж с полноразмерной шоу-резиденцией или подключитесь к видеоэкскурсии из дома. Персональный менеджер подтвердит запись в течение часа.',
      'view.addrK': 'Офис продаж', 'view.addr': 'Москва, Тихая набережная, 7 (вымышленный адрес)', 'view.hoursK': 'Часы работы', 'view.hours': 'Ежедневно 10:00–21:00, по записи', 'view.phoneK': 'Телефон', 'view.mailK': 'Почта',
      'view.fmtAria': 'Формат показа', 'view.f1': 'В офисе продаж', 'view.f2': 'Видеоэкскурсия', 'view.day': 'День', 'view.time': 'Время',
      'view.name': 'Ваше имя', 'view.phone': 'Телефон', 'view.consent': 'Согласен на обработку персональных данных', 'view.submit': 'Записаться на показ',
      'view.unit': (n) => `Резиденция ${n}`, 'view.unitRemove': 'Убрать квартиру из заявки',
      'view.errSlot': 'Выберите день и время.', 'view.errName': 'Укажите имя.', 'view.errPhone': 'Укажите телефон полностью.', 'view.errConsent': 'Подтвердите согласие, чтобы продолжить.',
      'view.okTitle': 'Заявка на показ принята', 'view.again': 'Выбрать другое время',
      'view.done': (d) => `${d.name}, мы забронировали ${d.when} — ${d.fmt}${d.unit ? `, резиденция ${d.unit}` : ''}. Менеджер позвонит на ${d.phone} в течение часа и подтвердит. (Демо — заявка никуда не отправлена.)`,
      'view.fmtGallery': 'показ в офисе продаж', 'view.fmtVideo': 'видеоэкскурсия',
      today: 'Сегодня', tomorrow: 'Завтра',
      'foot.tag': 'Тихая жизнь у реки.', 'foot.concept': 'Концепт-сайт · проект для портфолио. SEREIN — вымышленный жилой комплекс; все цены, планировки и данные условны.', 'foot.photos': 'Фото: Unsplash',
      lp: { livkit: 'Кухня-гостиная', bed: 'Спальня', mbed: 'Мастер-спальня', hall: 'Холл', bath: 'С/у', wic: 'Гардероб', terr: 'Терраса', gallery: 'Галерея', spa: 'Спа-зона' },
    },
  };
  function plural(n, one, few, many) {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }

  // ── Дополнительные и обновлённые тексты (EN/RU) ────────
  const T2 = {
    en: {
      'nav.menu': 'Menu', 'hero.f2v': '3.2 m', 'hero.f3v': '1.2 ha',
      'hero.alt': 'Pale stone building with a rounded corner on a river embankment in warm late-afternoon light, reflected in the water', 'hero.credit': 'Reference imagery · illustrative',
      'concept.s2': 'homes on a standard floor, two lifts — no long corridors',
      'dusk.kicker': 'A day at SEREIN', 'dusk.title': 'From morning light <em>to the quiet hour</em>',
      'dusk.s1': 'Limestone warms in the first sun. Coffee on the terrace, the river still asleep.',
      'dusk.s2': 'The garden fills with neighbours. The city stays on the other bank.',
      'dusk.s3': 'Windows glow over the water. Forty-two decibels of quiet.',
      'dusk.credit': 'Reference imagery · illustrative',
      'pick.facadeHint': 'Tap a floor · lit windows show matching homes', 'pick.stripAria': 'Choose a floor',
      'pick.bd': (n) => `${n} bd`, 'pick.soldWord': 'Sold',
      'tray.title': 'Saved residences', 'tray.close': 'Close saved residences',
      'tray.hint': (s, c) => `${s} saved · ${c} of 3 in comparison`, 'tray.empty': 'Tap the heart on any residence to keep it here.',
      'tray.go': (n) => `Open residence ${n}`, 'tray.cmp': 'Compare', 'tray.remove': (n) => `Remove residence ${n}`,
      'cmp.price': 'Price', 'cmp.area': 'Area', 'cmp.rooms': 'Bedrooms', 'cmp.floor': 'Floor', 'cmp.view': 'View', 'cmp.out': 'Outdoor', 'cmp.ppm': 'Per m²', 'cmp.status': 'Status',
      'cmp.need': 'Add one more residence to compare side by side.',
      'u.save': 'Save', 'u.saved': 'Saved', 'u.compare': 'Compare', 'u.pdf': 'Floor plan (PDF)',
      'saved.chip': (n) => `Saved (${n})`, 'saved.aria': (n) => `Saved residences: ${n}. Open list`,
      'toast.pdf': 'Concept demo — PDF floor plans aren’t generated here', 'toast.cmpMax': 'You can compare up to 3 residences',
      'toast.saved': (n) => `Residence ${n} saved`, 'toast.unsaved': (n) => `Residence ${n} removed from saved`,
      'mini.book': 'Book', 'mini.unit': (n, p) => `<b>Residence ${n}</b> <span>· ${p}</span>`, 'mini.none': '<span>Select a residence on the plan</span>',
      'mini.save': (n) => `Save residence ${n}`, 'mini.bookAria': (n) => `Book a viewing of residence ${n}`,
      'mort.lead': 'Pick a programme, move the sliders — numbers update instantly. The residence you selected above is already filled in.',
      'mort.unit': (n, p) => `For <b>Residence ${n}</b> · ${p}`, 'mort.unitRemove': 'Stop calculating for this residence',
      'mort.chart': 'What you repay, year by year', 'mort.principalK': 'Principal', 'mort.interestK': 'Interest',
      'mort.chartAria': (y) => `Stacked chart of principal and interest by year. Principal overtakes interest in year ${y}.`,
      'mort.cross': (y) => `principal overtakes interest in year ${y}`, 'mort.year': (y) => `Year ${y}`,
      'mort.progMonthly': 'per month',
      'prog.overallK': 'Overall', 'prog.frameK': 'Frame',
      'prog.total': 'Frame up to floor 11 of 15 · updated October 2026',
      'prog.alt1': 'Silhouette of a concrete frame and tower crane against an amber evening sky', 'prog.cap1': 'Frame, floors 9–11 · October 2026',
      'prog.alt2': 'Bare concrete columns and slabs of a building frame under a pale sky', 'prog.cap2': 'Frame, floors 2–5 · March 2026',
      'view.namePh': 'e.g. Anna Petrova', 'view.prevWeek': 'Previous week', 'view.nextWeek': 'Next week', 'view.unitK': 'Viewing for',
      'foot.kicker': 'Private viewings', 'foot.title': 'Daily, <em>10:00–21:00</em>', 'foot.lead': 'Come at golden hour — the river does most of the talking.',
      'foot.alt': 'Still water and a curved stone promenade glowing amber at dusk', 'foot.top': 'Back to top', 'foot.navAria': 'Footer',
      lpShort: { livkit: 'Living', bed: 'Bed', mbed: 'Master', hall: 'Hall', bath: 'Bath', wic: 'WIC', terr: 'Terrace', gallery: 'Gallery', spa: 'Spa' },
    },
    ru: {
      'nav.menu': 'Меню', 'hero.f2v': '3,2 м', 'hero.f3v': '1,2 га',
      'hero.alt': 'Светлое каменное здание со скруглённым углом на речной набережной в тёплом свете позднего дня, отражение в воде', 'hero.credit': 'Референсное изображение · иллюстрация',
      'concept.s2': 'квартир на типовом этаже, два лифта — никаких длинных коридоров',
      'dusk.kicker': 'Один день в SEREIN', 'dusk.title': 'От утреннего света <em>до тихого часа</em>',
      'dusk.s1': 'Известняк теплеет под первым солнцем. Кофе на террасе, река ещё спит.',
      'dusk.s2': 'Сад наполняется соседями. Город остаётся на другом берегу.',
      'dusk.s3': 'Окна светятся над водой. Сорок два децибела тишины.',
      'dusk.credit': 'Референсные изображения · иллюстрация',
      'pick.facadeHint': 'Нажмите на этаж · светятся окна подходящих квартир', 'pick.stripAria': 'Выбор этажа',
      'pick.bd': (n) => `${n} сп.`, 'pick.soldWord': 'Продана',
      'tray.title': 'Сохранённые резиденции', 'tray.close': 'Закрыть сохранённые',
      'tray.hint': (s, c) => `Сохранено: ${s} · в сравнении ${c} из 3`, 'tray.empty': 'Нажмите на сердечко у квартиры, чтобы сохранить её здесь.',
      'tray.go': (n) => `Открыть резиденцию ${n}`, 'tray.cmp': 'Сравнить', 'tray.remove': (n) => `Убрать резиденцию ${n}`,
      'cmp.price': 'Цена', 'cmp.area': 'Площадь', 'cmp.rooms': 'Спальни', 'cmp.floor': 'Этаж', 'cmp.view': 'Вид', 'cmp.out': 'Улица', 'cmp.ppm': 'За м²', 'cmp.status': 'Статус',
      'cmp.need': 'Добавьте ещё одну квартиру, чтобы сравнить их рядом.',
      'u.save': 'Сохранить', 'u.saved': 'Сохранена', 'u.compare': 'Сравнить', 'u.pdf': 'Планировка (PDF)',
      'saved.chip': (n) => `Сохранено (${n})`, 'saved.aria': (n) => `Сохранённые резиденции: ${n}. Открыть список`,
      'toast.pdf': 'Концепт-демо — PDF-планировки здесь не создаются', 'toast.cmpMax': 'Сравнить можно не больше 3 квартир',
      'toast.saved': (n) => `Резиденция ${n} сохранена`, 'toast.unsaved': (n) => `Резиденция ${n} убрана из сохранённых`,
      'mini.book': 'На показ', 'mini.unit': (n, p) => `<b>Резиденция ${n}</b> <span>· ${p}</span>`, 'mini.none': '<span>Выберите квартиру на плане</span>',
      'mini.save': (n) => `Сохранить резиденцию ${n}`, 'mini.bookAria': (n) => `Записаться на показ резиденции ${n}`,
      'mort.lead': 'Выберите программу и двигайте ползунки — цифры меняются сразу. Квартира, выбранная выше, уже подставлена.',
      'mort.unit': (n, p) => `Для <b>резиденции ${n}</b> · ${p}`, 'mort.unitRemove': 'Не считать для этой квартиры',
      'mort.chart': 'Что вы выплачиваете по годам', 'mort.principalK': 'Основной долг', 'mort.interestK': 'Проценты',
      'mort.chartAria': (y) => `Диаграмма основного долга и процентов по годам. Основной долг превышает проценты с ${y}-го года.`,
      'mort.cross': (y) => `основной долг больше процентов с ${y}-го года`, 'mort.year': (y) => `${y}-й год`,
      'mort.progMonthly': 'в месяц',
      'prog.overallK': 'Всего', 'prog.frameK': 'Каркас',
      'prog.total': 'Каркас возведён до 11-го этажа из 15 · обновлено в октябре 2026',
      'prog.alt1': 'Силуэт бетонного каркаса и башенного крана на фоне янтарного вечернего неба', 'prog.cap1': 'Каркас, 9–11 этажи · октябрь 2026',
      'prog.alt2': 'Бетонные колонны и перекрытия каркаса на фоне светлого неба', 'prog.cap2': 'Каркас, 2–5 этажи · март 2026',
      'view.namePh': 'Например, Анна Петрова', 'view.prevWeek': 'Предыдущая неделя', 'view.nextWeek': 'Следующая неделя', 'view.unitK': 'Показ квартиры',
      'foot.kicker': 'Приватные показы', 'foot.title': 'Ежедневно, <em>10:00–21:00</em>', 'foot.lead': 'Приезжайте в золотой час — река расскажет остальное.',
      'foot.alt': 'Тихая вода и изогнутая каменная набережная в янтарном свете сумерек', 'foot.top': 'Наверх', 'foot.navAria': 'Навигация в подвале',
      lpShort: { livkit: 'Гостиная', bed: 'Сп.', mbed: 'Мастер', hall: 'Холл', bath: 'С/у', wic: 'Гард.', terr: 'Терраса', gallery: 'Галерея', spa: 'Спа' },
    },
  };
  Object.assign(T.en, T2.en);
  Object.assign(T.ru, T2.ru);

  // ── Данные: места на карте ─────────────────────────────
  const MODES = {
    walk: '<circle cx="13" cy="4" r="2"/><path d="m9 21 2.5-7L14 16v5M7 12l3-4 4 1 2 4 3 1"/>',
    bike: '<circle cx="6" cy="16" r="4"/><circle cx="18" cy="16" r="4"/><path d="m6 16 4-8h5l3 8M10 8 8 5H6M12 16l3-8"/>',
    car: '<path d="M4 16v-4l2-5h12l2 5v4zM4 16v3M20 16v3M4 12h16"/><circle cx="8" cy="14" r=".5"/><circle cx="16" cy="14" r=".5"/>',
  };
  const POI_CATS = ['all', 'nature', 'edu', 'culture', 'transport', 'daily'];
  const CAT_LABEL = {
    en: { all: 'All', nature: 'Nature', edu: 'Schools', culture: 'Culture', transport: 'Transport', daily: 'Everyday' },
    ru: { all: 'Все', nature: 'Природа', edu: 'Школы', culture: 'Культура', transport: 'Транспорт', daily: 'Быт' },
  };
  const SITE = [316, 340];
  const POIS = [
    { cat: 'nature', x: 430, y: 286, min: 2, mode: 'walk', en: ['Riverside promenade', '3 km of embankment'], ru: ['Набережная', '3 км прогулочной зоны'] },
    { cat: 'daily', x: 226, y: 366, min: 4, mode: 'walk', en: ['Farmers’ market', 'Daily, from 8:00'], ru: ['Фермерский рынок', 'Ежедневно с 8:00'] },
    { cat: 'edu', x: 220, y: 148, min: 5, mode: 'walk', en: ['Montessori kindergarten', 'Ages 2–6'], ru: ['Монтессори-сад', 'От 2 до 6 лет'] },
    { cat: 'nature', x: 540, y: 150, min: 6, mode: 'walk', en: ['Linden Park', '14 ha, lake and tennis'], ru: ['Липовый парк', '14 га, пруд и теннис'] },
    { cat: 'transport', x: 336, y: 172, min: 6, mode: 'walk', en: ['Tikhaya metro', 'Line 3 (fictional) · 4 stops to centre'], ru: ['Метро «Тихая»', 'Линия 3 (вымышленная) · 4 станции до центра'] },
    { cat: 'edu', x: 350, y: 478, min: 8, mode: 'walk', en: ['Embankment Gymnasium', 'Grades 1–11'], ru: ['Гимназия на набережной', '1–11 классы'] },
    { cat: 'daily', x: 540, y: 398, min: 8, mode: 'walk', en: ['Family clinic', 'Open 24/7'], ru: ['Семейная клиника', 'Круглосуточно'] },
    { cat: 'culture', x: 590, y: 316, min: 7, mode: 'bike', en: ['Coda concert hall', 'Chamber music & jazz'], ru: ['Концертный зал «Кода»', 'Камерная музыка и джаз'] },
    { cat: 'culture', x: 84, y: 80, min: 9, mode: 'bike', en: ['Museum of Modern Art', 'Exhibitions & cinema'], ru: ['Музей современного искусства', 'Выставки и кино'] },
    { cat: 'nature', x: 120, y: 480, min: 11, mode: 'bike', en: ['Botanic Garden', 'Glasshouses, open all year'], ru: ['Ботанический сад', 'Оранжереи круглый год'] },
    { cat: 'transport', x: 606, y: 40, min: 15, mode: 'car', en: ['City centre', 'Via the embankment road'], ru: ['Центр города', 'По набережной'] },
  ];

  // ── Материалы ──────────────────────────────────────────
  const MATS = [
    { k: 'stone', img: '1761115715567-4af4db5dae2a', en: ['Jura limestone', 'Warm, honed limestone panels from a single quarry. It weathers to a soft patina instead of staining, and keeps the facade cool in summer.'], ru: ['Юрский известняк', 'Тёплые шлифованные панели из одного карьера. Со временем камень покрывается мягкой патиной, а не пятнами, и сохраняет фасад прохладным летом.'] },
    { k: 'bronze', img: '1789657354122-52579dbd1f25', en: ['Anodised bronze', 'Vertical fins, window frames and railings in bronze-anodised aluminium — a colour that deepens at dusk and never needs repainting.'], ru: ['Анодированная бронза', 'Вертикальные ламели, оконные рамы и ограждения — из алюминия с бронзовым анодированием. Цвет глубже в сумерках и не требует покраски.'] },
    { k: 'oak', img: '1765371515325-b6611765dfad', en: ['Smoked oak', 'Thermally treated oak in the lobby, kitchens and terrace soffits: warm to the touch, stable in frost and rain.'], ru: ['Морёный дуб', 'Термообработанный дуб в лобби, на кухнях и потолках террас: тёплый на ощупь, стабильный в мороз и дождь.'] },
    { k: 'terrazzo', img: '1753605788101-04d1e653e74a', en: ['Terrazzo & travertine', 'Hand-poured terrazzo floors in common areas and travertine in the turnkey bathrooms — quiet underfoot, lasting for generations.'], ru: ['Терраццо и травертин', 'Терраццо ручной заливки в общих зонах и травертин в ванных с отделкой «под ключ» — тихо под ногами и на поколения.'] },
  ];

  // ── Инфраструктура ─────────────────────────────────────
  const AMEN = [
    { img: '1776763255373-80346a458ed6', en: ['Residents’ pool', '25-metre pool under an oak ceiling, open year-round, with a heated lounge.'], ru: ['Бассейн для жителей', '25-метровый бассейн под дубовым потолком, круглый год, с тёплым лаунжем.'] },
    { img: '1761470575018-135c213340eb', en: ['Spa & hammam', 'Stone steam room, sauna and treatment rooms.'], ru: ['Спа и хаммам', 'Каменная парная, сауна и кабинеты процедур.'] },
    { img: '1758957646695-ec8bce3df462', en: ['Fitness studio', 'Open 24/7, with garden views and a trainer on call.'], ru: ['Фитнес-студия', 'Круглосуточно, с видом на сад, тренер по записи.'] },
    { img: '1768144092684-c1a5dd6c7aad', en: ['Residents’ lounge', 'Library, co-working and a private dining room.'], ru: ['Лаунж для жителей', 'Библиотека, коворкинг и приватная столовая.'] },
    { img: '1602128110234-2d11c0aaadfe', en: ['Courtyard garden', '1.2 hectares of pines, lavender and pale stone.'], ru: ['Сад во дворе', '1,2 гектара сосен, лаванды и светлого камня.'] },
  ];
  const AMEN_ICONS = {
    concierge: '<path d="M4 18h16M6 18a6 6 0 0 1 12 0M12 9V7M10 7h4"/>',
    parking: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M10 17V7h3a3 3 0 0 1 0 6h-3"/>',
    storage: '<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 12h16M10 8h4M10 16h4"/>',
    kids: '<circle cx="12" cy="7" r="3"/><path d="M6 21v-2a6 6 0 0 1 12 0v2M9 14l-3-2M15 14l3-2"/>',
    pet: '<circle cx="7" cy="9" r="1.6"/><circle cx="17" cy="9" r="1.6"/><circle cx="10" cy="5.5" r="1.6"/><circle cx="14" cy="5.5" r="1.6"/><path d="M8 17c0-3 2-5 4-5s4 2 4 5c0 2-2 2-4 2s-4 0-4-2z"/>',
    ev: '<path d="M13 3 6 13h5l-1 8 7-10h-5z"/>',
    sound: '<path d="M4 9v6M8 6v12M12 3v18M16 6v12M20 9v6"/>',
    bike: MODES.bike,
  };
  const AMEN_LIST = [
    ['concierge', 'Concierge & security 24/7', 'Консьерж и охрана 24/7'],
    ['parking', 'Underground parking, 1.5 spaces per home', 'Подземный паркинг, 1,5 места на квартиру'],
    ['storage', 'Private storage rooms', 'Личные кладовые'],
    ['kids', 'Kids’ club & playground', 'Детский клуб и площадка'],
    ['pet', 'Pet wash & grooming', 'Мойка и груминг для питомцев'],
    ['ev', 'EV charging for every space', 'Зарядка электромобилей на каждом месте'],
    ['sound', 'Acoustic glazing, 42 dB', 'Акустическое остекление, 42 дБ'],
    ['bike', 'Bike room & workshop', 'Велокомната и мастерская'],
  ];

  // ── Ход строительства ──────────────────────────────────
  const TIMELINE = [
    { q: 'Q1 2025', st: 'done', en: ['Permits', 'Planning approval and site preparation.'], ru: ['Разрешения', 'Согласование проекта и подготовка участка.'] },
    { q: 'Q3 2025', st: 'done', en: ['Foundation', 'Two-level underground car park and foundation slab.'], ru: ['Фундамент', 'Двухуровневый подземный паркинг и плита.'] },
    { q: 'Q4 2026', st: 'now', p: 72, en: ['Frame', 'Monolithic frame — floor 11 of 15 is complete.'], ru: ['Каркас', 'Монолитный каркас — готов 11-й этаж из 15.'] },
    { q: 'Q2 2027', st: 'next', en: ['Facade & glazing', 'Limestone panels and bronze window systems.'], ru: ['Фасад и окна', 'Известняковые панели и бронзовые оконные системы.'] },
    { q: 'Q3 2027', st: 'next', en: ['Interiors & garden', 'Common areas, turnkey finishes, landscaping.'], ru: ['Интерьеры и сад', 'Общие зоны, отделка «под ключ», благоустройство.'] },
    { q: 'Q4 2027', st: 'next', en: ['Keys', 'Commissioning and handover to residents.'], ru: ['Ключи', 'Ввод в эксплуатацию и передача квартир.'] },
  ];
  const QRU = { Q1: 'I кв.', Q2: 'II кв.', Q3: 'III кв.', Q4: 'IV кв.' };

  // ── Галерея ────────────────────────────────────────────
  const GALLERY = [
    { img: '1772797583328-f83bc3f94f80', en: 'Living room in oak and linen', ru: 'Гостиная: дуб и лён' },
    { img: '1782392440011-b0bb69d31a26', en: 'Kitchen with a stone island', ru: 'Кухня с каменным островом' },
    { img: '1723713296730-c0ca274a222a', pos: '50% 88%', en: 'Master bedroom at sunrise', ru: 'Мастер-спальня на рассвете' },
    { img: '1661107259637-4e1c55462428', en: 'Travertine bathroom', ru: 'Ванная из травертина' },
    { img: '1604578762246-41134e37f9cc', en: 'Dining room facing the garden', ru: 'Столовая с видом на сад' },
    { img: '1683735779537-80cc2d52ce29', en: 'Reading corner', ru: 'Уголок для чтения' },
    { img: '1646572961739-58557003b037', en: 'Guest bedroom', ru: 'Гостевая спальня' },
    { img: '1683735669803-2cf67a3edda5', en: 'Breakfast room', ru: 'Зона для завтраков' },
  ];

  // ── Ипотечные программы ────────────────────────────────
  const PROGRAMS = [
    { k: 'family', rate: 6, en: 'Family 6%', ru: 'Семейная 6%', short: { en: 'Family', ru: 'Семейная' } },
    { k: 'partner', rate: 9.9, en: 'Partner bank 9.9%', ru: 'Банк-партнёр 9,9%', short: { en: 'Partner bank', ru: 'Банк-партнёр' } },
    { k: 'market', rate: 18.5, en: 'Market 18.5%', ru: 'Рыночная 18,5%', short: { en: 'Market', ru: 'Рыночная' } },
  ];

  // ── Квартиры ───────────────────────────────────────────
  // Планировочные решения: комнаты [x, y, w, h, тип, площадь, мокрая зона]
  const TYPES = {
    A: { rooms: 1, area: 44.6, view: 'river', ppm: 365000, out: 4.2, plan: [[20, 20, 170, 110, 'livkit', 21.8], [190, 20, 110, 110, 'bed', 12.4], [20, 130, 110, 60, 'hall', 5.2], [130, 130, 80, 60, 'bath', 3.9, 1], [210, 130, 90, 60, 'wic', 1.3]] },
    B: { rooms: 2, area: 68.2, view: 'river', ppm: 395000, out: 5.6, plan: [[20, 20, 150, 110, 'livkit', 29.4], [170, 20, 130, 90, 'mbed', 14.8], [170, 110, 130, 80, 'bed', 12.6], [20, 130, 90, 60, 'hall', 6.4], [110, 130, 60, 60, 'bath', 5.0, 1]] },
    C: { rooms: 3, area: 96.4, view: 'riverPark', ppm: 430000, out: 8.4, plan: [[20, 20, 140, 100, 'livkit', 36.0], [160, 20, 140, 80, 'mbed', 18.6], [20, 120, 90, 70, 'bed', 12.8], [200, 100, 100, 90, 'bed', 13.6], [110, 120, 50, 70, 'hall', 7.0], [160, 100, 40, 45, 'bath', 4.6, 1], [160, 145, 40, 45, 'bath', 3.8, 1]] },
    D: { rooms: 3, area: 92.8, view: 'courtyard', ppm: 360000, out: 6.0, plan: [[20, 20, 150, 95, 'livkit', 33.6], [170, 20, 130, 95, 'mbed', 18.2], [20, 115, 100, 75, 'bed', 13.2], [210, 115, 90, 75, 'bed', 12.4], [120, 115, 50, 75, 'hall', 7.6], [170, 115, 40, 75, 'bath', 7.8, 1]] },
    E: { rooms: 1, area: 41.3, view: 'courtyard', ppm: 350000, out: 3.8, plan: [[20, 20, 160, 105, 'livkit', 19.2], [180, 20, 120, 105, 'bed', 12.4], [20, 125, 120, 65, 'hall', 5.0], [140, 125, 90, 65, 'bath', 3.6, 1], [230, 125, 70, 65, 'wic', 1.1]] },
    F: { rooms: 2, area: 72.4, view: 'parkCity', ppm: 385000, out: 6.2, plan: [[20, 20, 170, 100, 'livkit', 30.2], [190, 20, 110, 100, 'mbed', 14.8], [20, 120, 100, 70, 'bed', 12.6], [120, 120, 80, 70, 'hall', 7.4], [200, 120, 50, 70, 'bath', 4.4, 1], [250, 120, 50, 70, 'bath', 3.0, 1]] },
    P1: { rooms: 4, area: 168.5, view: 'river', ppm: 610000, out: 42, terrace: true, plan: [[20, 20, 280, 30, 'terr', 42], [20, 50, 120, 80, 'livkit', 58.2], [140, 50, 90, 80, 'mbed', 26.4], [230, 50, 70, 80, 'bed', 16.0], [20, 130, 70, 60, 'bed', 17.2], [90, 130, 60, 60, 'bed', 15.8], [150, 130, 50, 60, 'hall', 15.3], [200, 130, 45, 60, 'bath', 9.4, 1], [245, 130, 55, 60, 'bath', 10.2, 1]] },
    P2: { rooms: 4, area: 181.0, view: 'riverPark', ppm: 640000, out: 56, terrace: true, plan: [[20, 20, 40, 170, 'terr', 56], [60, 20, 130, 95, 'livkit', 70.2], [190, 20, 110, 95, 'mbed', 31.4], [60, 115, 60, 75, 'bed', 18.6], [120, 115, 60, 75, 'bed', 17.8], [180, 115, 40, 75, 'hall', 16.2], [220, 115, 40, 75, 'bath', 11.0, 1], [260, 115, 40, 75, 'bed', 15.8]] },
    SKY: { rooms: 5, area: 312.0, view: 'panorama', ppm: 720000, out: 140, terrace: true, ceil: 4.1, plan: [[20, 20, 280, 28, 'terr', 140], [20, 48, 100, 82, 'livkit', 100.0], [120, 48, 40, 82, 'bed', 18.0], [160, 48, 112, 82, 'mbed', 42.0], [272, 48, 28, 142, 'terr', 0], [20, 130, 55, 60, 'bed', 22.4], [75, 130, 55, 60, 'bed', 21.6], [130, 130, 50, 60, 'bed', 20.8], [180, 130, 45, 60, 'gallery', 52.4], [225, 130, 47, 60, 'spa', 34.8, 1]] },
  };
  // Геометрия плана этажа (viewBox 640×440): ширина ячеек пропорциональна площади
  const PL = { x0: 30, x1: 610, top: 72, mid: 218, corr: 258, bot: 388 };
  function stdGeometry() {
    const W = PL.x1 - PL.x0;
    const top = ['A', 'B', 'C']; const sumT = top.reduce((s, k) => s + TYPES[k].area, 0);
    let x = PL.x0; const g = {};
    top.forEach((k) => { const w = Math.round((W * TYPES[k].area) / sumT); g[k] = [x, PL.top, w, PL.mid - PL.top]; x += w; });
    g.C[2] = PL.x1 - g.C[0];
    const core = 100; const avail = W - core; const bot = ['D', 'E', 'F']; const sumB = bot.reduce((s, k) => s + TYPES[k].area, 0);
    const wD = Math.round((avail * TYPES.D.area) / sumB); const wE = Math.round((avail * TYPES.E.area) / sumB);
    g.D = [PL.x0, PL.corr, wD, PL.bot - PL.corr];
    g.core = [PL.x0 + wD, PL.corr, core, PL.bot - PL.corr];
    g.E = [PL.x0 + wD + core, PL.corr, wE, PL.bot - PL.corr];
    g.F = [PL.x0 + wD + core + wE, PL.corr, PL.x1 - (PL.x0 + wD + core + wE), PL.bot - PL.corr];
    return g;
  }
  const GEO = stdGeometry();
  const W14 = Math.round(((PL.x1 - PL.x0 - 60) * TYPES.P1.area) / (TYPES.P1.area + TYPES.P2.area));
  const LAYOUT_STD = ['A', 'B', 'C', 'D', 'E', 'F'].map((t) => ({ t, r: GEO[t], side: ['A', 'B', 'C'].includes(t) ? 'top' : 'bot' }));
  const LAYOUT_14 = [{ t: 'P1', r: [PL.x0, PL.top, W14, PL.bot - PL.top], side: 'top' }, { t: 'P2', r: [PL.x0 + W14 + 60, PL.top, PL.x1 - PL.x0 - W14 - 60, PL.bot - PL.top], side: 'top' }];
  const LAYOUT_15 = [{ t: 'SKY', path: `M${PL.x0} ${PL.top}H${PL.x1}V${PL.bot}H350V${PL.corr}H290V${PL.bot}H${PL.x0}Z`, r: [PL.x0, PL.top, 260, PL.bot - PL.top], side: 'top' }];
  const FLOORS = Array.from({ length: 14 }, (_, i) => i + 2); // 2..15
  const layoutFor = (f) => (f === 15 ? LAYOUT_15 : f === 14 ? LAYOUT_14 : LAYOUT_STD);
  const coreFor = (f) => (f === 15 ? [290, PL.corr, 60, PL.bot - PL.corr] : f === 14 ? [PL.x0 + W14, PL.corr, 60, PL.bot - PL.corr] : GEO.core);

  // Детерминированный генератор — одинаковое «наличие» при каждой загрузке
  function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const rand = rng(20271);
  const UNITS = [];
  FLOORS.forEach((f) => {
    layoutFor(f).forEach((slot, i) => {
      const ty = TYPES[slot.t];
      const price = Math.round((ty.area * ty.ppm * (1 + 0.014 * (f - 2))) / 10000) * 10000;
      const r = rand();
      let status = r < 0.3 + (f < 6 ? 0.12 : 0) ? 'sold' : r < 0.44 + (f < 6 ? 0.1 : 0) ? 'reserved' : 'available';
      if (f === 9 && i < 3) status = 'available';
      if (slot.t === 'SKY' || slot.t === 'P2') status = 'available';
      if (slot.t === 'P1') status = 'reserved';
      UNITS.push({ id: `${f}.${String(i + 1).padStart(2, '0')}`, floor: f, idx: i, type: slot.t, ...ty, price, status, slot });
    });
  });
  const byId = (id) => UNITS.find((u) => u.id === id);
  const LIMITS = {
    area: [Math.floor(Math.min(...UNITS.map((u) => u.area))), Math.ceil(Math.max(...UNITS.map((u) => u.area)))],
    price: [Math.floor(Math.min(...UNITS.map((u) => u.price)) / 1e6) * 1e6, Math.ceil(Math.max(...UNITS.map((u) => u.price)) / 1e6) * 1e6],
    floor: [2, 15],
  };
  const STEPS = { area: 1, price: 500000, floor: 1 };

  // ── Состояние ──────────────────────────────────────────
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* приватный режим */ } },
  };
  const loadSet = (k) => { try { const a = JSON.parse(store.get(k) || '[]'); return new Set(Array.isArray(a) ? a.filter((id) => byId(id)) : []); } catch { return new Set(); } };
  let lang = store.get('serein-lang') || ((navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'en');
  if (!T[lang]) lang = 'en';
  const t = (k) => T[lang][k];
  const L = (o) => o[lang];

  const F = { rooms: new Set(), area: [...LIMITS.area], price: [...LIMITS.price], floor: [...LIMITS.floor], onlyFree: true };
  const sel = { floor: 9, unit: null };
  const saved = loadSet('serein-saved');
  const compare = new Set([...loadSet('serein-compare')].filter((id) => saved.has(id)).slice(0, 3));
  let poiCat = 'all';
  let matIdx = 0;
  let viewUnit = null;
  let mortUnit = null;
  let userPicked = false;
  const narrow = () => window.matchMedia('(max-width: 1080px)').matches;

  // ── Форматирование ─────────────────────────────────────
  const loc = () => (lang === 'ru' ? 'ru-RU' : 'en-US');
  const nf = () => new Intl.NumberFormat(loc());
  const fmtFull = (n) => nf().format(Math.round(n)) + ' ₽';
  const fmtM = (n) => {
    const v = n / 1e6;
    const s = new Intl.NumberFormat(loc(), { maximumFractionDigits: v >= 100 ? 0 : 1, minimumFractionDigits: v >= 100 ? 0 : 1 }).format(v);
    return lang === 'ru' ? `${s} млн ₽` : `${s}M ₽`;
  };
  const fmtM2 = (n) => {
    const v = n / 1e6;
    const s = new Intl.NumberFormat(loc(), { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(v);
    return lang === 'ru' ? `${s} млн ₽` : `${s}M ₽`;
  };
  const fmtNum = (n, d = 1) => new Intl.NumberFormat(loc(), { maximumFractionDigits: d, minimumFractionDigits: d }).format(n);
  const m2u = () => (lang === 'ru' ? 'м²' : 'm²');
  const m2 = (n) => `${fmtNum(n)} ${m2u()}`;
  const textW = (s, fs, k = 0.57) => String(s).length * fs * k;

  // ── Язык ───────────────────────────────────────────────
  function applyLang(next) {
    lang = T[next] ? next : 'en';
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach((el) => { const v = t(el.dataset.i18n); if (typeof v === 'string') el.textContent = v; });
    $$('[data-i18n-html]').forEach((el) => { const v = t(el.dataset.i18nHtml); if (typeof v === 'string') el.innerHTML = v; });
    $$('[data-aria]').forEach((el) => { const v = t(el.dataset.aria); if (typeof v === 'string') el.setAttribute('aria-label', v); });
    $$('[data-i18n-alt]').forEach((el) => { const v = t(el.dataset.i18nAlt); if (typeof v === 'string') el.alt = v; });
    $$('[data-i18n-ph]').forEach((el) => { const v = t(el.dataset.i18nPh); if (typeof v === 'string') el.placeholder = v; });
    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    document.title = t('title');
    splitWords();
    renderAll();
    store.set('serein-lang', lang);
  }
  $$('.lang button').forEach((b) => b.addEventListener('click', () => applyLang(b.dataset.lang)));

  function renderAll() {
    renderHeroStats();
    renderPois();
    renderMats();
    renderAmen();
    renderTimeline();
    renderGallery();
    renderRoomChips();
    initRanges();
    updatePicker(false);
    renderPrograms();
    calcMortgage();
    renderDays();
    renderUnitChip();
    renderSaved();
    if (doneData) showDone(doneData);
  }

  // ── Hero ───────────────────────────────────────────────
  function renderHeroStats() {
    const free = UNITS.filter((u) => u.status === 'available');
    $('[data-stat="available"]').textContent = free.length;
    $('[data-stat="from"]').textContent = t('hero.from')(fmtM(Math.min(...free.map((u) => u.price))));
  }
  const heroImg = $('.hero__img');
  const hero = $('.hero');

  // ── Навигация ──────────────────────────────────────────
  const nav = $('.nav');
  const burger = $('.burger');
  const drawer = $('#drawer');
  const setDrawer = (open) => { burger.setAttribute('aria-expanded', String(open)); drawer.hidden = !open; paintNav(); };
  burger.addEventListener('click', () => setDrawer(drawer.hidden));
  drawer.addEventListener('click', (e) => { if (e.target.closest('a')) setDrawer(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !drawer.hidden) { setDrawer(false); burger.focus(); } });
  const darkEls = $$('[data-dark]');
  function paintNav() {
    const probe = nav.offsetHeight / 2;
    let over = null;
    for (const el of darkEls) { const r = el.getBoundingClientRect(); if (r.top <= probe && r.bottom > probe) { over = el.dataset.dark; break; } }
    const open = !drawer.hidden;
    nav.classList.toggle('is-over', over === 'hero' && !open);
    nav.classList.toggle('is-dark', !!over && over !== 'hero' && !open);
  }
  const navLinks = $$('.nav__links a');
  const secIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${e.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => secIo.observe(s));

  // ── Прокрутка: один rAF на кадр для всех эффектов ─────
  let ticking = false;
  function onFrame() {
    ticking = false;
    const y = window.scrollY;
    if (!reduceMotion && heroLive && y < window.innerHeight * 1.2) {
      heroImg.style.setProperty('--hy', `${(y * 0.14).toFixed(1)}px`);
      heroImg.style.setProperty('--hs', (1.02 + Math.min(y, 900) * 0.00012).toFixed(4));
    }
    paintNav();
    updateWords();
    if (duskOn) paintDusk();
  }
  const requestFrame = () => { if (!ticking) { ticking = true; requestAnimationFrame(onFrame); } };
  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', requestFrame, { passive: true });
  let heroLive = false;
  if (!reduceMotion) setTimeout(() => { heroLive = true; heroImg.classList.add('is-live'); requestFrame(); }, 2800);

  // ── Концепция: слова проявляются при прокрутке ─────────
  const statement = $('[data-words]');
  let words = [];
  function splitWords() {
    const text = statement.textContent.trim();
    statement.setAttribute('aria-label', text);
    statement.innerHTML = text.split(/\s+/).map((w) => `<span class="w" aria-hidden="true">${esc(w)}</span>`).join(' ');
    words = $$('.w', statement);
    lastWordN = -1;
    updateWords();
  }
  let lastWordN = -1;
  function updateWords() {
    if (!words.length) return;
    if (reduceMotion) { if (lastWordN !== words.length) { words.forEach((w) => w.classList.add('on')); lastWordN = words.length; } return; }
    const r = statement.getBoundingClientRect();
    const vh = window.innerHeight;
    if (r.bottom < -vh || r.top > vh * 2) return;
    const p = clamp((vh * 0.88 - r.top) / (r.height + vh * 0.3), 0, 1);
    const n = Math.round(p * words.length);
    if (n === lastWordN) return;
    lastWordN = n;
    words.forEach((w, i) => w.classList.toggle('on', i < n));
  }

  // ── Сигнатура: от утра к сумеркам (только opacity/transform) ──
  const dusk = $('.dusk');
  const duskDay = $('.dusk__day');
  const duskSteps = $$('.dusk__steps li');
  const duskTrack = $('.dusk__track i');
  let duskOn = false;
  let duskStep = -1;
  function paintDusk() {
    const r = dusk.getBoundingClientRect();
    const span = r.height - window.innerHeight;
    const p = span > 0 ? clamp(-r.top / span, 0, 1) : 1;
    const k = clamp((p - 0.12) / 0.7, 0, 1);
    duskDay.style.opacity = (1 - k * k * (3 - 2 * k)).toFixed(3);
    duskTrack.style.transform = `scaleX(${p.toFixed(3)})`;
    const s = p < 0.34 ? 0 : p < 0.67 ? 1 : 2;
    if (s !== duskStep) { duskStep = s; duskSteps.forEach((li, i) => li.classList.toggle('is-on', i === s)); }
  }
  if (reduceMotion) { duskSteps.forEach((li) => li.classList.add('is-on')); }
  else {
    new IntersectionObserver(([e]) => { duskOn = e.isIntersecting; if (duskOn) requestFrame(); }, { rootMargin: '100px 0px' }).observe(dusk);
  }

  // ── Reveal + счётчики ──────────────────────────────────
  const revealIo = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); obs.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach((el) => revealIo.observe(el));
  const countIo = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);
      const el = e.target; const end = +el.dataset.count; const start = end > 1000 ? end - 27 : 0;
      if (reduceMotion) { el.textContent = end; return; }
      const t0 = performance.now(); const dur = 1600;
      const tick = (now) => { const k = clamp((now - t0) / dur, 0, 1); const ease = 1 - Math.pow(1 - k, 4); el.textContent = Math.round(start + (end - start) * ease); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => countIo.observe(el));

  // ── Карта ──────────────────────────────────────────────
  const poiG = $('.map__pois');
  const routeG = $('.map__routes');
  const routePath = (p) => {
    const [sx, sy] = SITE; const mx = (sx + p.x) / 2, my = (sy + p.y) / 2;
    const dx = p.x - sx, dy = p.y - sy; const len = Math.hypot(dx, dy) || 1;
    const bend = Math.min(60, len * 0.22);
    return `M${sx} ${sy}Q${(mx - (dy / len) * bend).toFixed(1)} ${(my + (dx / len) * bend).toFixed(1)} ${p.x} ${p.y}`;
  };
  function renderPois() {
    $('[data-render="poiFilters"]').innerHTML = POI_CATS.map((c) => `<button type="button" class="chip" data-cat="${c}" aria-pressed="${c === poiCat}">${c === 'all' ? '' : `<i style="--c:var(--c-${c})"></i>`}${CAT_LABEL[lang][c]}</button>`).join('');
    const list = POIS.map((p, i) => ({ ...p, n: i + 1 })).filter((p) => poiCat === 'all' || p.cat === poiCat);
    const unit = lang === 'ru' ? 'мин' : 'min';
    $('[data-render="poiList"]').innerHTML = list.map((p) => {
      const [name, sub] = L(p);
      return `<li class="poi__item" data-poi="${p.n}" tabindex="0" style="--c:var(--c-${p.cat})"><span class="poi__n">${p.n}</span><span class="poi__name">${esc(name)}<small>${esc(CAT_LABEL[lang][p.cat])} · ${esc(sub)}</small></span><span class="poi__time"><svg viewBox="0 0 24 24" aria-hidden="true">${MODES[p.mode]}</svg>${p.min}<small>${unit}</small></span></li>`;
    }).join('');
    routeG.innerHTML = '<defs>' + POIS.map((p, i) => `<mask id="rm${i + 1}" maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="540"><path class="route-mask" data-rm="${i + 1}" d="${routePath(p)}" pathLength="1"/></mask>`).join('') + '</defs>' +
      POIS.map((p, i) => `<path class="route" data-route="${i + 1}" d="${routePath(p)}" mask="url(#rm${i + 1})"/>`).join('');
    poiG.innerHTML = POIS.map((p, i) => {
      const dim = poiCat !== 'all' && p.cat !== poiCat;
      return `<g class="poi-dot${dim ? ' is-dim' : ''}" data-poi="${i + 1}" transform="translate(${p.x} ${p.y})" style="--c:var(--c-${p.cat})"><circle r="12"/><text text-anchor="middle" dy="4">${i + 1}</text></g>`;
    }).join('');
  }
  let hotN = '0';
  function hotPoi(n) {
    n = String(n);
    if (n === hotN) return;
    hotN = n;
    $$('[data-poi]').forEach((el) => el.classList.toggle('is-hot', el.dataset.poi === n));
    $$('.route', routeG).forEach((el) => el.classList.toggle('is-hot', el.dataset.route === n));
    $$('.route-mask', routeG).forEach((el) => {
      const on = el.dataset.rm === n;
      el.classList.remove('is-hot');
      if (on) { void el.getBoundingClientRect(); el.classList.add('is-hot'); if (reduceMotion) el.style.strokeDashoffset = '0'; }
    });
  }
  $('.location').addEventListener('click', (e) => {
    const c = e.target.closest('[data-cat]');
    if (c) { poiCat = c.dataset.cat; hotN = '0'; renderPois(); }
  });
  ['mouseover', 'focusin'].forEach((ev) => $('.location').addEventListener(ev, (e) => { const p = e.target.closest('[data-poi]'); if (p) hotPoi(p.dataset.poi); }));
  $('.location').addEventListener('mouseleave', () => hotPoi(0));
  $('.location').addEventListener('focusout', (e) => { if (!e.relatedTarget || !e.relatedTarget.closest('[data-poi]')) hotPoi(0); });
  $('.location').addEventListener('click', (e) => { const p = e.target.closest('[data-poi]'); if (p) hotPoi(p.dataset.poi); });

  // ── Материалы ──────────────────────────────────────────
  const matStage = $('[data-render="matStage"]');
  const matImg = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1100&h=1375&q=78`;
  function renderMats() {
    $('[data-render="matTabs"]').innerHTML = MATS.map((m, i) => `<button type="button" role="tab" class="swatch" id="mat-${m.k}" aria-selected="${i === matIdx}" tabindex="${i === matIdx ? 0 : -1}" aria-controls="mat-panel"><i class="sw--${m.k}"></i>${esc(L(m)[0])}</button>`).join('');
    const p = $('[data-render="matPanel"]');
    p.id = 'mat-panel';
    p.setAttribute('aria-labelledby', `mat-${MATS[matIdx].k}`);
    p.innerHTML = `<div class="fade"><h3>${esc(L(MATS[matIdx])[0])}</h3><p>${esc(L(MATS[matIdx])[1])}</p></div>`;
    const img = $('img:last-child', matStage);
    if (img) img.alt = L(MATS[matIdx])[0];
  }
  function setMat(i, focus) {
    if (i === matIdx) return;
    matIdx = i;
    const old = $$('img', matStage);
    const img = new Image();
    img.src = matImg(MATS[i].img);
    img.alt = L(MATS[i])[0];
    img.className = 'is-out';
    img.decoding = 'async';
    matStage.appendChild(img);
    const show = () => requestAnimationFrame(() => requestAnimationFrame(() => { img.classList.remove('is-out'); setTimeout(() => old.forEach((o) => o.remove()), 1000); }));
    if (img.complete) show(); else { img.onload = show; img.onerror = show; }
    renderMats();
    if (focus) $$('.swatch')[i].focus();
  }
  $('[data-render="matTabs"]').addEventListener('click', (e) => { const b = e.target.closest('.swatch'); if (b) setMat($$('.swatch').indexOf(b)); });
  $('[data-render="matTabs"]').addEventListener('keydown', (e) => {
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (d) { e.preventDefault(); setMat((matIdx + d + MATS.length) % MATS.length, true); }
  });

  // ── Инфраструктура ─────────────────────────────────────
  function renderAmen() {
    $('[data-render="amenCards"]').innerHTML = AMEN.map((a, i) => `<article class="acard"><img src="${IMG(a.img, i === 0 ? 1200 : 800)}" alt="" loading="lazy" decoding="async"><div class="acard__body"><span class="acard__n">0${i + 1}</span><h3>${esc(L(a)[0])}</h3><p>${esc(L(a)[1])}</p></div></article>`).join('');
    $('[data-render="amenList"]').innerHTML = AMEN_LIST.map(([ic, en, ru]) => `<li><svg viewBox="0 0 24 24" aria-hidden="true">${AMEN_ICONS[ic]}</svg>${esc(lang === 'ru' ? ru : en)}</li>`).join('');
  }

  // ── Ход строительства ──────────────────────────────────
  function renderTimeline() {
    $('[data-render="timeline"]').innerHTML = TIMELINE.map((s) => {
      const q = lang === 'ru' ? s.q.replace(/Q\d/, (m) => QRU[m]) : s.q;
      const state = s.st === 'done' ? t('prog.done') : s.st === 'now' ? t('prog.now')(s.p) : t('prog.next');
      return `<li class="tl is-${s.st}"><span class="tl__q">${q}</span><h3>${esc(L(s)[0])}</h3><p>${esc(L(s)[1])}</p><span class="tl__state">${state}</span></li>`;
    }).join('');
    // Линия доходит до точки «сейчас» плюс доля текущего этапа — не до глобального процента
    const ni = TIMELINE.findIndex((s) => s.st === 'now');
    const fill = ((ni + TIMELINE[ni].p / 100) / TIMELINE.length) * 100;
    $('.prog__bar span').style.setProperty('--p', `${fill.toFixed(2)}%`);
  }

  // ── Галерея + lightbox ─────────────────────────────────
  const lb = $('.lightbox');
  let lbIdx = 0;
  function renderGallery() {
    $('[data-render="gallery"]').innerHTML = GALLERY.map((g, i) => `<button type="button" class="gal__item reveal" data-gal="${i}" aria-label="${esc(t('gal.open')(L(g)))}"><img src="${IMG(g.img, i === 0 || i === 7 ? 1200 : 800)}" alt="${esc(L(g))}" loading="lazy" decoding="async"${g.pos ? ` style="object-position:${g.pos}"` : ''}><span>${esc(L(g))}</span></button>`).join('');
    $$('.gal__item').forEach((el) => revealIo.observe(el));
  }
  function openLb(i) {
    lbIdx = (i + GALLERY.length) % GALLERY.length;
    const g = GALLERY[lbIdx];
    $('img', lb).src = IMG(g.img, 1800);
    $('img', lb).alt = L(g);
    $('figcaption', lb).textContent = `${lbIdx + 1} / ${GALLERY.length} — ${L(g)}`;
    if (!lb.open) { if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', ''); }
  }
  const closeLb = () => { if (typeof lb.close === 'function') lb.close(); else lb.removeAttribute('open'); };
  $('[data-render="gallery"]').addEventListener('click', (e) => { const b = e.target.closest('[data-gal]'); if (b) openLb(+b.dataset.gal); });
  $('.lightbox__close').addEventListener('click', closeLb);
  $('.lightbox__prev').addEventListener('click', () => openLb(lbIdx - 1));
  $('.lightbox__next').addEventListener('click', () => openLb(lbIdx + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') openLb(lbIdx - 1); if (e.key === 'ArrowRight') openLb(lbIdx + 1); });
  lb.addEventListener('close', () => { const b = $(`[data-gal="${lbIdx}"]`); if (b) b.focus({ preventScroll: true }); });

  // ── Подбор: фильтры ────────────────────────────────────
  const ROOM_OPTS = [1, 2, 3, 4];
  function renderRoomChips() {
    const box = $('[data-render="roomChips"]');
    box.innerHTML = `<button type="button" class="chip" data-room="any" aria-pressed="${F.rooms.size === 0}">${t('pick.any')}</button>` +
      ROOM_OPTS.map((r) => `<button type="button" class="chip" data-room="${r}" aria-pressed="${F.rooms.has(r)}">${r === 4 ? '4+' : r}</button>`).join('');
  }
  $('[data-render="roomChips"]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-room]'); if (!b) return;
    if (b.dataset.room === 'any') F.rooms.clear();
    else { const r = +b.dataset.room; F.rooms.has(r) ? F.rooms.delete(r) : F.rooms.add(r); if (F.rooms.size === ROOM_OPTS.length) F.rooms.clear(); }
    renderRoomChips();
    updatePicker(true);
  });
  const rangeFmt = {
    area: (a, b) => `${a}–${b} ${m2u()}`,
    price: (a, b) => `${fmtM(a).replace(/\s?(M ₽|млн ₽)$/, '')}–${fmtM(b)}`,
    floor: (a, b) => (a === b ? `${a}` : `${a}–${b}`),
  };
  function initRanges() {
    $$('[data-range]').forEach((box) => {
      const k = box.dataset.range;
      const [lo, hi] = LIMITS[k];
      $$('input', box).forEach((inp) => {
        inp.min = lo; inp.max = hi; inp.step = STEPS[k];
        inp.value = inp.dataset.thumb === 'min' ? F[k][0] : F[k][1];
        inp.setAttribute('aria-label', t(`pick.${k}${inp.dataset.thumb === 'min' ? 'Min' : 'Max'}`));
      });
      paintRange(box);
    });
  }
  function paintRange(box) {
    const k = box.dataset.range; const [lo, hi] = LIMITS[k];
    const [a, b] = F[k];
    box.style.setProperty('--a', `${((a - lo) / (hi - lo)) * 100}%`);
    box.style.setProperty('--b', `${((b - lo) / (hi - lo)) * 100}%`);
    $('output', box).textContent = rangeFmt[k](a, b);
    $$('input', box).forEach((inp) => {
      const v = +inp.value;
      inp.setAttribute('aria-valuetext', k === 'price' ? fmtM(v) : k === 'area' ? m2(v) : String(v));
    });
    $('[data-thumb="min"]', box).style.zIndex = a > lo + (hi - lo) * 0.9 ? 3 : 1;
  }
  $$('[data-range]').forEach((box) => {
    box.addEventListener('input', (e) => {
      const k = box.dataset.range; const inp = e.target;
      const minI = $('[data-thumb="min"]', box), maxI = $('[data-thumb="max"]', box);
      let a = +minI.value, b = +maxI.value;
      if (a > b) { if (inp === minI) { a = b; minI.value = a; } else { b = a; maxI.value = b; } }
      F[k] = [a, b];
      paintRange(box);
      updatePicker(true);
    });
  });
  const onlyFree = $('[name="onlyFree"]');
  onlyFree.addEventListener('change', () => { F.onlyFree = onlyFree.checked; updatePicker(true); });
  $('.filters').addEventListener('reset', (e) => {
    e.preventDefault();
    F.rooms.clear(); F.area = [...LIMITS.area]; F.price = [...LIMITS.price]; F.floor = [...LIMITS.floor]; F.onlyFree = true; onlyFree.checked = true;
    renderRoomChips(); initRanges(); updatePicker(true);
  });

  const matchSpec = (u) => (F.rooms.size === 0 || F.rooms.has(Math.min(u.rooms, 4))) && u.area >= F.area[0] && u.area <= F.area[1] && u.price >= F.price[0] && u.price <= F.price[1] && u.floor >= F.floor[0] && u.floor <= F.floor[1];
  const match = (u) => matchSpec(u) && (!F.onlyFree || u.status === 'available');

  // ── Подбор: фасад (известняк, бронза, свет в окнах) ────
  const facadeSvg = $('.facade__svg');
  const FH = 34, BASE = 566;
  const fy = (f) => BASE - f * FH;
  const fx = (f) => (f === 15 ? [138, 282] : f === 14 ? [104, 316] : [74, 346]);
  const SHIFT = [0, 0, 0, 7, -5, 6, -7, 4, -4, 7, -6, 5, -3, 6, 0, 0];
  const WIN_N = (f) => (f === 15 ? 6 : f === 14 ? 8 : 12);
  function el(tag, attrs, parent) {
    const n = document.createElementNS(SVGNS, tag);
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    if (parent) parent.appendChild(n);
    return n;
  }
  function buildFacade() {
    facadeSvg.innerHTML = `<defs>
      <linearGradient id="fcSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe5d4"/><stop offset="1" stop-color="#f7f2ea"/></linearGradient>
      <linearGradient id="fcStone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#efe6d7"/><stop offset=".55" stop-color="#e8dcc8"/><stop offset="1" stop-color="#dccdb4"/></linearGradient>
      <linearGradient id="fcRiver" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9c6c4"/><stop offset="1" stop-color="#9fb0ae"/></linearGradient>
    </defs>`;
    el('rect', { x: 0, y: 0, width: 420, height: 600, class: 'fc-sky' }, facadeSvg);
    el('circle', { cx: 330, cy: 92, r: 46, fill: '#f3d9a8', opacity: 0.55 }, facadeSvg);
    // земля и река
    el('rect', { x: 0, y: BASE, width: 420, height: 30, class: 'fc-ground' }, facadeSvg);
    el('rect', { x: 0, y: BASE + 30, width: 420, height: 44, class: 'fc-river' }, facadeSvg);
    [[30, 608, 60], [140, 620, 90], [270, 610, 70], [330, 628, 60], [60, 632, 50]].forEach(([x, y, w]) => el('path', { d: `M${x} ${y}h${w}`, class: 'fc-ripple' }, facadeSvg));
    // лобби
    const [lx0, lx1] = fx(1);
    el('rect', { x: lx0, y: fy(1), width: lx1 - lx0, height: FH, class: 'fc-body' }, facadeSvg);
    for (let i = 0; i < 6; i++) el('rect', { x: lx0 + 10 + i * 43, y: fy(1) + 6, width: 36, height: FH - 6, class: 'fc-lobby' }, facadeSvg);
    el('rect', { x: 170, y: fy(1) - 4, width: 80, height: 4, class: 'fc-roof' }, facadeSvg);
    const lobbyLbl = el('text', { x: 396, y: fy(1) + 21, class: 'fl-num', 'text-anchor': 'middle', 'font-family': 'Manrope, sans-serif', 'font-size': 11, fill: '#6c675f' }, facadeSvg);
    lobbyLbl.textContent = '1';
    // этажи: тени под сдвинутыми объёмами, затем сами объёмы
    FLOORS.forEach((f) => {
      const [x0, x1] = fx(f); const y = fy(f); const s = SHIFT[f] || 0;
      const g = el('g', { class: 'floor', 'data-floor': f, tabindex: 0, role: 'button' }, facadeSvg);
      el('rect', { x: 14, y, width: 392, height: FH, fill: 'transparent', class: 'fl-hit' }, g);
      // мягкая тень на нижний этаж
      el('rect', { x: x0 + s + 4, y: y + FH, width: x1 - x0 - 2, height: 5, class: 'fc-shadow' }, g);
      const lift = el('g', { class: 'fl-lift' }, g);
      el('rect', { x: x0 + s, y: y + FH + 2, width: x1 - x0, height: 6, rx: 3, fill: 'rgba(60,46,30,.22)', class: 'fl-shadow' }, lift);
      el('rect', { x: x0 + s, y, width: x1 - x0, height: FH, class: 'fc-body' }, lift);
      for (let fxp = x0 + s + 7; fxp < x1 + s - 4; fxp += 9) el('path', { d: `M${fxp} ${y + 2}V${y + FH - 4}`, class: 'fc-fin' }, lift);
      const n = WIN_N(f); const pad = 10; const gap = 6;
      const w = (x1 - x0 - pad * 2 - gap * (n - 1)) / n;
      for (let i = 0; i < n; i++) {
        const wx = x0 + s + pad + i * (w + gap);
        el('rect', { x: wx.toFixed(1), y: y + 6, width: w.toFixed(1), height: FH - 12, class: 'fc-win', 'data-w': i }, lift);
        el('path', { d: `M${(wx + w / 2).toFixed(1)} ${y + 6}V${y + FH - 6}`, class: 'fc-mull' }, lift);
      }
      el('rect', { x: x0 + s - 3, y: y + FH - 4, width: x1 - x0 + 6, height: 4, class: 'fc-slab' }, lift);
      el('rect', { x: x0 + s - 1, y: y - 1, width: x1 - x0 + 2, height: FH + 2, class: 'fl-ring' }, lift);
      const num = el('text', { x: 396, y: y + 21, class: 'fl-num', 'text-anchor': 'middle' }, g); num.textContent = f;
      el('circle', { cx: 34, cy: y + FH / 2, r: 10, class: 'fl-badge' }, g);
      el('text', { x: 34, y: y + FH / 2 + 3.5, 'text-anchor': 'middle', class: 'fl-count' }, g);
    });
    // крыша и террасы с бронзовыми ограждениями
    const rail = (xa, xb, yy) => el('path', { d: `M${xa} ${yy}H${xb}`, stroke: 'var(--bronze)', 'stroke-width': 1.4, fill: 'none' }, facadeSvg);
    rail(fx(13)[0], fx(14)[0], fy(13) - 6); rail(fx(14)[1], fx(13)[1], fy(13) - 6);
    rail(fx(14)[0], fx(15)[0], fy(14) - 6); rail(fx(15)[1], fx(14)[1], fy(14) - 6);
    el('rect', { x: fx(15)[0] - 6, y: fy(15) - 5, width: fx(15)[1] - fx(15)[0] + 12, height: 5, class: 'fc-roof' }, facadeSvg);
    // деревья вдоль набережной
    [[48, 548, 20, 'd'], [76, 556, 14, ''], [356, 546, 22, 'd'], [384, 556, 13, ''], [210, 560, 9, ''], [120, 562, 8, 'd'], [300, 562, 8, '']].forEach(([cx, cy, r, d]) => {
      el('path', { d: `M${cx} ${cy + r * 0.6}V${BASE + 4}`, stroke: '#8a7a62', 'stroke-width': 1.4 }, facadeSvg);
      el('circle', { cx, cy, r, class: `fc-tree${d ? ' fc-tree--d' : ''}`, 'pointer-events': 'none' }, facadeSvg);
    });
  }
  buildFacade();
  const facade = $('.facade');
  const tip = $('.tip');
  function showTip(g) {
    const f = +g.dataset.floor;
    const units = UNITS.filter((u) => u.floor === f);
    const m = units.filter(match);
    tip.innerHTML = t('pick.tip')(f, m.length, units.length, m.length ? fmtM(Math.min(...m.map((u) => u.price))) : '');
    const hr = $('.fc-body', g).getBoundingClientRect(); const fr = facade.getBoundingClientRect();
    tip.style.left = `${clamp(hr.left + hr.width / 2 - fr.left, 90, fr.width - 90)}px`;
    tip.style.top = `${hr.top - fr.top}px`;
    tip.hidden = false;
  }
  const scrollToPlan = () => {
    if (!narrow()) return;
    const target = $('.stage__plan');
    const top = target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - 8;
    window.scrollTo({ top, behavior: smooth });
  };
  facadeSvg.addEventListener('mouseover', (e) => { const g = e.target.closest('.floor'); if (g && !window.matchMedia('(hover: none)').matches) showTip(g); });
  facadeSvg.addEventListener('mouseleave', () => { tip.hidden = true; });
  facadeSvg.addEventListener('focusin', (e) => { const g = e.target.closest('.floor'); if (g) showTip(g); });
  facadeSvg.addEventListener('focusout', () => { tip.hidden = true; });
  facadeSvg.addEventListener('click', (e) => { const g = e.target.closest('.floor'); if (g) { userPicked = true; selectFloor(+g.dataset.floor); tip.hidden = true; scrollToPlan(); } });
  facadeSvg.addEventListener('keydown', (e) => {
    const g = e.target.closest('.floor'); if (!g) return;
    const f = +g.dataset.floor;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); userPicked = true; selectFloor(f); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nf2 = clamp(f + (e.key === 'ArrowUp' ? 1 : -1), 2, 15);
      $(`.floor[data-floor="${nf2}"]`, facadeSvg).focus();
    }
  });

  function paintFacade() {
    $$('.floor', facadeSvg).forEach((g) => {
      const f = +g.dataset.floor;
      const units = UNITS.filter((u) => u.floor === f);
      const per = WIN_N(f) / units.length;
      const lit = new Set();
      units.forEach((u, i) => { if (match(u)) for (let k = 0; k < per; k++) lit.add(Math.round(i * per + k)); });
      $$('.fc-win', g).forEach((w) => w.classList.toggle('is-lit', lit.has(+w.dataset.w)));
      const n = units.filter(match).length;
      g.classList.toggle('has-match', n > 0);
      g.classList.toggle('no-match', n === 0);
      g.classList.toggle('is-sel', f === sel.floor);
      g.setAttribute('aria-pressed', String(f === sel.floor));
      g.setAttribute('aria-label', t('pick.floorAria')(f, n));
      $('.fl-count', g).textContent = n || '';
    });
    // компактная лента этажей (телефон / планшет)
    const strip = $('.floorstrip');
    strip.innerHTML = FLOORS.map((f) => {
      const n = UNITS.filter((u) => u.floor === f && match(u)).length;
      return `<button type="button" class="fs${n ? '' : ' no-match'}" data-fs="${f}" aria-pressed="${f === sel.floor}" aria-label="${esc(t('pick.floorAria')(f, n))}">${f}${n ? `<i aria-hidden="true">${n}</i>` : ''}</button>`;
    }).join('');
    const cur = $(`[data-fs="${sel.floor}"]`, strip);
    if (cur && strip.offsetParent) strip.scrollLeft = clamp(cur.offsetLeft - strip.clientWidth / 2 + 23, 0, strip.scrollWidth);
  }
  $('.floorstrip').addEventListener('click', (e) => { const b = e.target.closest('[data-fs]'); if (b) { userPicked = true; selectFloor(+b.dataset.fs); const again = $(`[data-fs="${b.dataset.fs}"]`); if (again) again.focus({ preventScroll: true }); } });

  // ── Подбор: план этажа (ячейки по площади, стены, двери, окна, балконы) ──
  const planSvg = $('.plan__svg');
  function planScale() { const w = planSvg.getBoundingClientRect().width; return 640 / Math.max(260, w || 640); }
  function renderPlan(animate) {
    const f = sel.floor;
    const k = planScale();
    const defs = `<defs><pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="var(--free)"/><rect width="3" height="7" fill="var(--res)"/></pattern><pattern id="pdeck" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#efe6d6"/><path d="M0 3h6" stroke="#d8c8ad" stroke-width="1"/></pattern></defs>`;
    const fsRiver = Math.max(16, 12 * k);
    const river = `<path d="M30 12c40-8 80 8 120 0s80-8 120 0 80 8 120 0 80-8 120 0 60 6 100 0" fill="none" stroke="var(--water)" stroke-width="6" stroke-linecap="round"/><text class="pl-river" x="320" y="${12 + fsRiver + 2}" text-anchor="middle" style="font-size:${fsRiver.toFixed(1)}px">${esc(t('pick.riverSide'))}</text>`;
    let inner = '';
    const core = coreFor(f);
    if (f === 15) inner += `<rect class="pl-balc" x="${PL.x0 + 20}" y="${PL.top - 16}" width="${PL.x1 - PL.x0 - 40}" height="16"/>`;
    else if (f === 14) inner += `<rect class="pl-corr" x="${core[0]}" y="${PL.top}" width="60" height="${PL.corr - PL.top}"/><rect class="pl-balc" x="${PL.x0 + 16}" y="${PL.top - 16}" width="${W14 - 32}" height="16"/><rect class="pl-balc" x="${PL.x0 + W14 + 76}" y="${PL.top - 16}" width="${PL.x1 - PL.x0 - W14 - 92}" height="16"/>`;
    else inner += `<rect class="pl-corr" x="${PL.x0}" y="${PL.mid}" width="${PL.x1 - PL.x0}" height="${PL.corr - PL.mid}"/>`;
    inner += `<rect class="pl-core" x="${core[0]}" y="${core[1]}" width="${core[2]}" height="${core[3]}"/>`;
    const units = UNITS.filter((u) => u.floor === f);
    const fNo = Math.max(13, 12 * k), fSub = Math.max(12.5, 12 * k);
    units.forEach((u) => {
      const [x, y, w, h] = u.slot.r;
      const top = u.slot.side === 'top';
      // балконы (кроме пентхаусов — у них террасы)
      if (f < 14) {
        const bw = Math.min(w - 30, Math.max(60, w * 0.5));
        inner += top ? `<rect class="pl-balc" x="${x + 14}" y="${PL.top - 14}" width="${bw}" height="14"/>` : `<rect class="pl-balc" x="${x + w - 14 - bw}" y="${PL.bot}" width="${bw}" height="14"/>`;
      }
      const shape = u.slot.path ? `<path class="u-shape" d="${u.slot.path}"/>` : `<rect class="u-shape" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
      const isSel = !!(sel.unit && sel.unit.id === u.id);
      const cls = `u st-${u.status}${match(u) ? '' : ' is-off'}${isSel ? ' is-sel' : ''}`;
      const cw = u.slot.path ? 560 : w;
      const fBig = Math.min(Math.max(u.slot.path ? 40 : 26, 17 * k), (cw - 22) / 3.4);
      const subOpts = u.status === 'sold'
        ? [t('pick.soldWord')]
        : [`${t('pick.br')(u.rooms)} · ${fmtM(u.price)}`, `${t('pick.bd')(u.rooms)} · ${fmtM(u.price)}`, t('pick.bd')(u.rooms)];
      const sub = subOpts.find((s) => textW(s, fSub, 0.56) <= cw - 26) || '';
      const heart = saved.has(u.id) ? `<path class="u-heart" transform="translate(${x + cw - 26} ${y + 12}) scale(.75)" d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>` : '';
      inner += `<g class="${cls}" data-unit="${u.id}" tabindex="0" role="button" aria-pressed="${isSel}" aria-label="${esc(t('pick.unitAria')(u.id, `${t('pick.br')(u.rooms)}, ${m2(u.area)}, ${u.status === 'sold' ? '' : fmtM(u.price) + ', '}${t('st.' + u.status)}`))}">${shape}${heart}
        <text class="u-no" x="${x + 12}" y="${(y + fNo + 8).toFixed(1)}" style="font-size:${fNo.toFixed(1)}px">${u.id}</text>
        <text class="u-big" x="${x + 12}" y="${(y + h - (sub ? fSub + 18 : 14)).toFixed(1)}" style="font-size:${fBig.toFixed(1)}px">${fmtNum(u.area)}<tspan font-size="${(fBig * 0.55).toFixed(1)}"> ${m2u()}</tspan></text>
        ${sub ? `<text class="u-sub" x="${x + 12}" y="${y + h - 12}" style="font-size:${fSub.toFixed(1)}px">${esc(sub)}</text>` : ''}</g>`;
      // окна на фасадной стороне и дверь в коридор
      if (!u.slot.path) {
        const wy = top ? PL.top : PL.bot;
        inner += `<path class="pl-win" d="M${x + 10} ${wy}H${x + w * 0.42}M${x + w * 0.55} ${wy}H${x + w - 10}" pointer-events="none"/>`;
        const dx = x + w - 34; const dy = top ? PL.mid : PL.corr; const sgn = top ? -1 : 1;
        if (f < 14) inner += `<path class="pl-door" pointer-events="none" d="M${dx} ${dy}v${sgn * 14}M${dx} ${dy + sgn * 14}A14 14 0 0 ${top ? 1 : 0} ${dx + 14} ${dy}"/>`;
      } else {
        inner += `<path class="pl-win" d="M50 ${PL.top}H300M340 ${PL.top}H590" pointer-events="none"/>`;
      }
    });
    if (f === 14) inner += `<path class="pl-win" d="M${PL.x0 + 14} ${PL.top}H${PL.x0 + W14 - 14}M${PL.x0 + W14 + 74} ${PL.top}H${PL.x1 - 14}" pointer-events="none"/>`;
    // лифты и лестница
    const cx = core[0] + core[2] / 2;
    const cy = core[1] + 14;
    inner += `<g pointer-events="none" stroke="var(--ink)" stroke-width="1" fill="none" opacity=".6"><rect x="${cx - 22}" y="${cy}" width="18" height="18"/><path d="M${cx - 22} ${cy}l18 18M${cx - 4} ${cy}l-18 18"/><rect x="${cx + 4}" y="${cy}" width="18" height="18"/><path d="M${cx + 4} ${cy}l18 18M${cx + 22} ${cy}l-18 18"/>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${cx - 22} ${cy + 40 + i * 9}h44"/>`).join('')}</g>`;
    inner += `<rect class="pl-outline" x="${PL.x0}" y="${PL.top}" width="${PL.x1 - PL.x0}" height="${PL.bot - PL.top}" pointer-events="none"/>`;
    // окна поверх наружной стены
    inner += inner.match(/<path class="pl-win"[^>]*\/>/g).join('').replace(/class="pl-win"/g, 'class="pl-win" style="stroke:#9fb3b4"');
    const fsTxt = Math.max(12, 10.5 * k);
    inner += `<text class="pl-text" x="320" y="${PL.bot + 22 + fsTxt}" text-anchor="middle" style="font-size:${fsTxt.toFixed(1)}px">${esc(t('pick.yard'))}</text>`;
    inner += `<g transform="translate(606 ${PL.bot + 34})" pointer-events="none"><circle r="10" fill="none" stroke="var(--ink)" stroke-width=".8"/><path d="M0-7l3 7h-6z" fill="var(--ink)"/></g>`;
    planSvg.innerHTML = defs + river + inner;
    $('.ulist').innerHTML = units.map((u) => `<button type="button" data-unit="${u.id}" aria-pressed="${!!(sel.unit && sel.unit.id === u.id)}" class="${match(u) ? '' : 'is-off'}"><b>${u.id}</b><span class="ul-br">${t('pick.br')(u.rooms)}</span><span>${m2(u.area)}</span><span>${u.status === 'sold' ? '—' : fmtM(u.price)}</span><span class="badge badge--${u.status}">${t('st.' + u.status)}</span></button>`).join('');
    $('.floorstep__n').textContent = f;
    $('[data-step="-1"]').disabled = f <= 2;
    $('[data-step="1"]').disabled = f >= 15;
    if (animate && !reduceMotion) { planSvg.classList.remove('swap'); void planSvg.getBoundingClientRect(); planSvg.classList.add('swap'); }
  }
  planSvg.addEventListener('click', (e) => { const g = e.target.closest('[data-unit]'); if (g) { userPicked = true; selectUnit(g.dataset.unit, true); } });
  planSvg.addEventListener('keydown', (e) => {
    const g = e.target.closest('[data-unit]'); if (!g) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); userPicked = true; selectUnit(g.dataset.unit, true); $(`[data-unit="${g.dataset.unit}"]`, planSvg).focus(); }
  });
  $('.ulist').addEventListener('click', (e) => { const b = e.target.closest('[data-unit]'); if (b) { userPicked = true; selectUnit(b.dataset.unit, true); const again = $(`.ulist [data-unit="${b.dataset.unit}"]`); if (again) again.focus(); } });
  $$('.floorstep__btn').forEach((b) => b.addEventListener('click', () => { userPicked = true; selectFloor(clamp(sel.floor + +b.dataset.step, 2, 15)); }));

  function selectFloor(f) {
    sel.floor = f;
    const units = UNITS.filter((u) => u.floor === f);
    if (!sel.unit || sel.unit.floor !== f) sel.unit = units.find(match) || units.find((u) => u.status !== 'sold') || units[0];
    paintFacade();
    renderPlan(true);
    renderUnit(true);
    syncFromUnit();
  }
  function selectUnit(id, animate) {
    sel.unit = byId(id);
    if (sel.unit.floor !== sel.floor) { selectFloor(sel.unit.floor); return; }
    renderPlan(false);
    renderUnit(animate);
    syncFromUnit();
  }
  function syncFromUnit() {
    renderMini();
    if (sel.unit && sel.unit.status !== 'sold') setMortUnit(sel.unit);
  }

  // ── Подбор: карточка квартиры + поэтажная планировка ───
  const unitEl = $('.unit');
  const rectPath = (x, y, w, h) => `M${x} ${y}H${x + w}V${y + h}H${x}Z`;
  function furniture(r) {
    const [x, y, w, h, k] = r;
    const top = y + 42, bottom = y + h - 5, avail = bottom - top;
    let s = '';
    if (k === 'livkit' && w >= 90 && avail >= 24) {
      const sw = Math.min(w * 0.42, 66);
      const sx = x + w / 2 - sw / 2 + 8;
      s += `<rect class="lp-furn-f" x="${sx}" y="${bottom - 13}" width="${sw}" height="13" rx="2"/><path class="lp-furn" d="M${sx + 3} ${bottom - 9}H${sx + sw - 3}"/>`;
      if (avail >= 40) s += `<rect class="lp-furn" x="${sx + sw * 0.28}" y="${bottom - 30}" width="${sw * 0.44}" height="9" rx="2"/>`;
      s += `<rect class="lp-furn-f" x="${x + 4}" y="${y + 8}" width="10" height="${Math.min(h * 0.6, h - 16)}"/><circle class="lp-furn" cx="${x + 9}" cy="${y + 18}" r="2.5"/><circle class="lp-furn" cx="${x + 9}" cy="${y + 27}" r="2.5"/>`;
    }
    if ((k === 'bed' || k === 'mbed') && w >= 48 && avail >= 30) {
      const bw = Math.min(k === 'mbed' ? 42 : 32, w - 16); const bl = Math.min(46, avail);
      const bx = x + w / 2 - bw / 2;
      s += `<rect class="lp-furn-f" x="${bx}" y="${bottom - bl}" width="${bw}" height="${bl}" rx="2"/><path class="lp-furn" d="M${bx} ${bottom - bl * 0.6}H${bx + bw}"/><rect class="lp-furn" x="${bx + 3}" y="${bottom - 9}" width="${bw / 2 - 5}" height="6" rx="1.5"/><rect class="lp-furn" x="${bx + bw / 2 + 2}" y="${bottom - 9}" width="${bw / 2 - 5}" height="6" rx="1.5"/>`;
      if (w >= bw + 34) s += `<rect class="lp-furn" x="${bx - 12}" y="${bottom - 10}" width="9" height="9"/><rect class="lp-furn" x="${bx + bw + 3}" y="${bottom - 10}" width="9" height="9"/>`;
    }
    if (k === 'bath' && w >= 38 && avail >= 13) s += `<rect class="lp-furn-f" x="${x + 5}" y="${bottom - 14}" width="${w - 10}" height="13" rx="6"/>`;
    if (k === 'spa' && w >= 38 && avail >= 18) s += `<circle class="lp-furn-f" cx="${x + w / 2}" cy="${bottom - avail / 2}" r="${Math.min(w / 2 - 6, avail / 2 - 2)}"/>`;
    if (k === 'wic' && w >= 40 && avail >= 10) {
      s += `<path class="lp-furn" d="M${x + 6} ${bottom - 6}H${x + w - 6}${Array.from({ length: Math.floor((w - 16) / 8) }, (_, i) => `M${x + 10 + i * 8} ${bottom - 10}v8`).join('')}"/>`;
    }
    if (k === 'terr' && w >= 80) s += `<circle class="lp-furn-f" cx="${x + w - 18}" cy="${y + h / 2}" r="6"/><circle class="lp-furn-f" cx="${x + w - 36}" cy="${y + h / 2}" r="4"/>`;
    return s;
  }
  function doors(rooms) {
    const hall = rooms.find((r) => r[4] === 'hall');
    if (!hall) return '';
    const [hx, hy, hw, hh] = hall;
    let s = '';
    const d = 13;
    rooms.forEach((r) => {
      if (r === hall || r[4] === 'terr') return;
      const [x, y, w, h] = r;
      // вертикальная общая стена
      const oy0 = Math.max(y, hy), oy1 = Math.min(y + h, hy + hh);
      const ox0 = Math.max(x, hx), ox1 = Math.min(x + w, hx + hw);
      if ((x + w === hx || x === hx + hw) && oy1 - oy0 > d + 8) {
        const ex = x + w === hx ? hx : x; const sg = x + w === hx ? -1 : 1; const y0 = (oy0 + oy1) / 2 - d / 2;
        s += `<path class="lp-dgap" d="M${ex} ${y0}V${y0 + d}"/><path class="lp-door" d="M${ex} ${y0}h${sg * d}A${d} ${d} 0 0 ${sg > 0 ? 1 : 0} ${ex} ${y0 + d}"/>`;
      } else if ((y + h === hy || y === hy + hh) && ox1 - ox0 > d + 8) {
        const ey = y + h === hy ? hy : y; const sg = y + h === hy ? -1 : 1; const x0 = (ox0 + ox1) / 2 - d / 2;
        s += `<path class="lp-dgap" d="M${x0} ${ey}H${x0 + d}"/><path class="lp-door" d="M${x0} ${ey}v${sg * d}A${d} ${d} 0 0 ${sg > 0 ? 0 : 1} ${x0 + d} ${ey}"/>`;
      }
    });
    // входная дверь
    const ex0 = hx + hw / 2 - 7;
    s += `<path class="lp-dgap" d="M${ex0} ${hy + hh}H${ex0 + 14}" style="stroke-width:6"/><path class="lp-door" d="M${ex0} ${hy + hh}v-14A14 14 0 0 1 ${ex0 + 14} ${hy + hh}"/>`;
    s += `<path d="M${hx + hw / 2 - 6} ${hy + hh + 12}l6-6 6 6" fill="none" stroke="var(--bronze)" stroke-width="1.6"/>`;
    return s;
  }
  function layoutSvg(u, renderedW) {
    const lp = T[lang].lp; const lps = T[lang].lpShort;
    const kk = 320 / Math.max(220, renderedW || 320);
    const fL = Math.max(10.5, 12.5 * kk), fA = Math.max(10, 12 * kk);
    const rooms = u.plan;
    const inside = rooms.filter((r) => r[4] !== 'terr');
    const minY = Math.min(...inside.map((r) => r[1]));
    const xs = inside.map((r) => r[0]), xe = inside.map((r) => r[0] + r[2]), ye = inside.map((r) => r[1] + r[3]);
    const box = [Math.min(...xs), minY, Math.max(...xe), Math.max(...ye)];
    let s = `<svg viewBox="0 0 320 212" role="img" aria-label="${esc(t('u.title')(u.id))}"><defs><pattern id="deck" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#efe6d6"/><path d="M0 3h6" stroke="#d8c8ad" stroke-width="1"/></pattern></defs>`;
    // балкон над гостиной (если нет террасы)
    if (!u.terrace) {
      const lk = rooms.find((r) => r[4] === 'livkit');
      const bw = Math.min(lk[2] - 24, 124);
      s += `<path class="lp-balc lp-draw" pathLength="1" d="${rectPath(lk[0] + 12, minY - 17, bw, 17)}"/>`;
      const bl = `${t('u.balcony')} ${fmtNum(u.out)}`;
      const fb = Math.min(fA, 13);
      if (textW(bl, fb) < bw - 8) s += `<text class="lp-area lp-fade" x="${lk[0] + 12 + bw / 2}" y="${minY - 17 / 2 + fb * 0.36}" text-anchor="middle" style="font-size:${fb.toFixed(1)}px">${esc(bl)}</text>`;
    }
    rooms.forEach(([x, y, w, h, k, a, wet]) => {
      const cls = k === 'terr' ? 'lp-terr' : `lp-room${wet ? ' lp-wet' : ''}`;
      s += `<path class="${cls} lp-draw" pathLength="1" d="${rectPath(x, y, w, h)}"/>`;
    });
    s += `<g class="lp-fade">${rooms.map(furniture).join('')}</g>`;
    // окна на фасадной стороне
    inside.filter((r) => r[1] === minY && !r[6] && r[4] !== 'hall').forEach(([x, , w]) => {
      s += `<path class="lp-win" d="M${x + w * 0.18} ${minY}H${x + w * 0.82}"/><path class="lp-winl" d="M${x + w * 0.18} ${minY}H${x + w * 0.82}"/>`;
    });
    s += `<path class="lp-wall lp-draw" pathLength="1" d="${rectPath(box[0], box[1], box[2] - box[0], box[3] - box[1])}"/>`;
    s += `<g class="lp-fade">${doors(rooms)}`;
    rooms.forEach(([x, y, w, h, k, a]) => {
      if (!a) return;
      const cx = x + w / 2;
      const areaS = fmtNum(a);
      if (w < 46 && h > 60) {
        const lab = textW(`${lp[k]} ${areaS}`, fL) < h - 10 ? `${lp[k]} ${areaS}` : textW(`${lps[k]} ${areaS}`, fL) < h - 10 ? `${lps[k]} ${areaS}` : areaS;
        s += `<text class="lp-lbl" transform="translate(${cx + fL * 0.35} ${y + h / 2}) rotate(-90)" text-anchor="middle" style="font-size:${fL.toFixed(1)}px">${esc(lab)}</text>`;
        return;
      }
      const label = [lp[k], lps[k]].find((v) => textW(v, fL) <= w - 8);
      const ly = y + Math.max(fL + 6, Math.min(h / 2 - 4, 22));
      if (label && h >= fL + fA + 10) {
        s += `<text class="lp-lbl" x="${cx}" y="${ly.toFixed(1)}" text-anchor="middle" style="font-size:${fL.toFixed(1)}px">${esc(label)}</text>`;
        s += `<text class="lp-area" x="${cx}" y="${(ly + fA + 2).toFixed(1)}" text-anchor="middle" style="font-size:${fA.toFixed(1)}px">${areaS}</text>`;
      } else if (textW(areaS, fA) <= w - 4) {
        s += `<text class="lp-area" x="${cx}" y="${(y + h / 2 + fA * 0.35).toFixed(1)}" text-anchor="middle" style="font-size:${fA.toFixed(1)}px">${areaS}</text>`;
      }
    });
    return s + '</g></svg>';
  }
  const heartSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';
  const cmpSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h7v12H4zM13 6h7v12h-7z"/></svg>';
  const pdfSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>';
  function renderUnit(animate) {
    const u = sel.unit;
    if (!u) {
      unitEl.innerHTML = `<p class="unit__empty"><b>${t('u.empty')}</b>${t('u.emptySub')}</p>`;
      return;
    }
    const view = t(`view_${u.view}`);
    let actions = '';
    if (u.status === 'sold') {
      const alt = UNITS.filter((x) => x.status === 'available' && x.type === u.type).sort((a, b) => Math.abs(a.floor - u.floor) - Math.abs(b.floor - u.floor))[0]
        || UNITS.filter((x) => x.status === 'available' && x.rooms === u.rooms).sort((a, b) => Math.abs(a.area - u.area) - Math.abs(b.area - u.area))[0];
      actions = `<div><p class="unit__sold">${t('u.sold')}</p>` + (alt ? `<button type="button" class="btn btn--ghost btn--full" data-goto="${alt.id}">${esc(t('u.similar')(alt.id, fmtM(alt.price)))}</button>` : `<p class="unit__sold">${t('u.noSimilar')}</p>`) + '</div>';
    } else {
      actions = (u.status === 'reserved' ? `<p class="unit__sold">${t('u.reserved')}</p>` : '') +
        `<div class="unit__actions"><button type="button" class="btn" data-act="book">${t('u.book')}</button><button type="button" class="btn btn--ghost" data-act="mort">${t('u.mort')}</button></div>
        <button type="button" class="ibtn unit__pdf" data-act="pdf">${pdfSvg}${t('u.pdf')}</button>`;
    }
    const isSaved = saved.has(u.id); const isCmp = compare.has(u.id);
    unitEl.innerHTML = `
      <div class="unit__top"><div><span class="unit__k">${esc(t('u.k')(u.floor, view))}</span><h3 class="unit__title">${esc(t('u.title')(u.id))}</h3></div>
        <div class="unit__tools"><span class="badge badge--${u.status}">${t('st.' + u.status)}</span>
          <button type="button" class="ibtn" data-act="save" aria-pressed="${isSaved}">${heartSvg}<span>${isSaved ? t('u.saved') : t('u.save')}</span></button>
          <button type="button" class="ibtn" data-act="cmp" aria-pressed="${isCmp}">${cmpSvg}<span>${t('u.compare')}</span></button></div></div>
      <div class="unit__plan" data-lp></div>
      <dl class="unit__specs">
        <div><dt>${t('u.area')}</dt><dd>${m2(u.area)}</dd></div>
        <div><dt>${t('u.rooms')}</dt><dd>${u.rooms}</dd></div>
        <div><dt>${t('u.floor')}</dt><dd>${u.floor} / 15</dd></div>
        <div><dt>${t('u.ceil')}</dt><dd>${fmtNum(u.ceil || (u.floor === 14 ? 3.6 : 3.2))} ${lang === 'ru' ? 'м' : 'm'}</dd></div>
        <div><dt>${t('u.view')}</dt><dd>${esc(view)}</dd></div>
        <div><dt>${u.terrace ? t('lp').terr : t('u.balcony')}</dt><dd>${m2(u.out)}</dd></div>
      </dl>
      <div class="unit__price"><b>${u.status === 'sold' ? '—' : fmtFull(u.price)}</b>${u.status === 'sold' ? '' : `<small>${t('u.ppm')(fmtFull(Math.round(u.price / u.area / 1000) * 1000))}</small>`}</div>
      ${actions}`;
    const lpBox = $('[data-lp]', unitEl);
    lpBox.innerHTML = layoutSvg(u, lpBox.clientWidth - 24);
    lpBox.dataset.w = lpBox.clientWidth;
    if (animate && !reduceMotion) {
      unitEl.classList.remove('swap'); void unitEl.offsetWidth; unitEl.classList.add('swap');
      lpBox.classList.add('is-draw');
    }
  }
  unitEl.addEventListener('click', (e) => {
    const g = e.target.closest('[data-goto]');
    if (g) { selectUnit(g.dataset.goto, true); return; }
    const a = e.target.closest('[data-act]'); if (!a || !sel.unit) return;
    const act = a.dataset.act;
    if (act === 'book') bookUnit(sel.unit);
    if (act === 'mort') { setMortUnit(sel.unit); $('#mortgage').scrollIntoView({ behavior: smooth }); }
    if (act === 'pdf') toast(t('toast.pdf'));
    if (act === 'save') { toggleSave(sel.unit.id); refocus('[data-act="save"]'); }
    if (act === 'cmp') { toggleCompare(sel.unit.id); refocus('[data-act="cmp"]'); }
  });
  const refocus = (q) => { const b = $(q, unitEl); if (b) b.focus({ preventScroll: true }); };
  function bookUnit(u) {
    viewUnit = u; renderUnitChip();
    $('#viewing').scrollIntoView({ behavior: smooth });
  }

  // ── Сохранённые / сравнение ────────────────────────────
  const persist = () => { store.set('serein-saved', JSON.stringify([...saved])); store.set('serein-compare', JSON.stringify([...compare])); };
  function toggleSave(id) {
    if (saved.has(id)) { saved.delete(id); compare.delete(id); toast(t('toast.unsaved')(id)); }
    else { saved.add(id); toast(t('toast.saved')(id)); const c = $('[data-saved-chip]'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); }
    persist(); afterCollect();
  }
  function toggleCompare(id) {
    if (compare.has(id)) compare.delete(id);
    else {
      if (compare.size >= 3) { toast(t('toast.cmpMax')); return; }
      compare.add(id); saved.add(id);
      if (compare.size >= 2) $('#tray').hidden = false;
    }
    persist(); afterCollect();
  }
  function afterCollect() { renderSaved(); renderPlan(false); renderUnit(false); renderMini(); }
  function renderSaved() {
    const chip = $('[data-saved-chip]');
    chip.hidden = saved.size === 0;
    chip.dataset.n = saved.size;
    $('[data-saved-label]').textContent = t('saved.chip')(saved.size);
    chip.setAttribute('aria-label', t('saved.aria')(saved.size));
    const tray = $('#tray');
    if (saved.size === 0 && !tray.hidden) tray.hidden = true;
    $('[data-tray-hint]').textContent = t('tray.hint')(saved.size, compare.size);
    const list = [...saved].map(byId).sort((a, b) => a.floor - b.floor || a.idx - b.idx);
    let html = list.length ? `<ul class="tray__list">${list.map((u) => `<li class="tray__item"><button type="button" class="tray__go" data-tgo="${u.id}" aria-label="${esc(t('tray.go')(u.id))}">${u.id}</button><span>${m2(u.area)} · ${u.status === 'sold' ? t('st.sold') : fmtM(u.price)}</span><button type="button" data-tcmp="${u.id}" aria-pressed="${compare.has(u.id)}">${t('tray.cmp')}</button><button type="button" data-tdel="${u.id}" aria-label="${esc(t('tray.remove')(u.id))}">×</button></li>`).join('')}</ul>` : `<p class="tray__empty">${t('tray.empty')}</p>`;
    const cm = [...compare].map(byId);
    if (cm.length >= 2) {
      const best = (arr, fn, dir) => { const v = arr.map(fn); const b = dir > 0 ? Math.max(...v) : Math.min(...v); return v.map((x) => x === b); };
      const live = (u) => u.status !== 'sold';
      const rows = [
        ['cmp.price', (u) => (live(u) ? fmtM2(u.price) : '—'), best(cm, (u) => (live(u) ? u.price : Infinity), -1)],
        ['cmp.area', (u) => m2(u.area), best(cm, (u) => u.area, 1)],
        ['cmp.rooms', (u) => u.rooms, best(cm, (u) => u.rooms, 1)],
        ['cmp.floor', (u) => `${u.floor} / 15`, best(cm, (u) => u.floor, 1)],
        ['cmp.view', (u) => t(`view_${u.view}`), cm.map(() => false)],
        ['cmp.out', (u) => m2(u.out), best(cm, (u) => u.out, 1)],
        ['cmp.ppm', (u) => (live(u) ? fmtFull(Math.round(u.price / u.area / 1000) * 1000) : '—'), best(cm, (u) => (live(u) ? u.price / u.area : Infinity), -1)],
        ['cmp.status', (u) => t('st.' + u.status), cm.map(() => false)],
      ];
      html += `<div class="cmp__wrap"><table class="cmp"><thead><tr><td></td>${cm.map((u) => `<th scope="col">${esc(t('u.title')(u.id))}</th>`).join('')}</tr></thead><tbody>${rows.map(([k, fn, b]) => `<tr><th scope="row">${t(k)}</th>${cm.map((u, i) => `<td class="${b[i] && cm.length > 1 ? 'is-best' : ''}">${esc(fn(u))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    } else if (cm.length === 1) html += `<p class="tray__empty">${t('cmp.need')}</p>`;
    $('[data-tray-body]').innerHTML = html;
  }
  $('[data-saved-chip]').addEventListener('click', () => {
    const tray = $('#tray'); tray.hidden = false;
    const top = tray.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - 16;
    window.scrollTo({ top, behavior: smooth });
    setTimeout(() => { const f = $('button', tray); if (f) f.focus({ preventScroll: true }); }, reduceMotion ? 0 : 600);
  });
  $('[data-tray-close]').addEventListener('click', () => { $('#tray').hidden = true; $('[data-saved-chip]').focus({ preventScroll: true }); });
  $('#tray').addEventListener('click', (e) => {
    const go = e.target.closest('[data-tgo]'); const c = e.target.closest('[data-tcmp]'); const d = e.target.closest('[data-tdel]');
    if (go) { userPicked = true; selectUnit(go.dataset.tgo, true); unitEl.scrollIntoView({ behavior: smooth, block: 'start' }); }
    if (c) { toggleCompare(c.dataset.tcmp); const b = $(`[data-tcmp="${c.dataset.tcmp}"]`); if (b) b.focus(); }
    if (d) { toggleSave(d.dataset.tdel); const f = $('#tray button'); if (f) f.focus(); }
  });

  // ── Мини-панель и уведомления ──────────────────────────
  const mini = $('[data-minibar]');
  function renderMini() {
    const u = sel.unit;
    $('[data-minibar-info]').innerHTML = u ? t('mini.unit')(u.id, u.status === 'sold' ? t('st.sold') : fmtM2(u.price)) : t('mini.none');
    const sv = $('[data-mini="save"]', mini); const bk = $('[data-mini="book"]', mini);
    sv.disabled = !u; bk.disabled = !u || u.status === 'sold';
    if (u) { sv.setAttribute('aria-pressed', String(saved.has(u.id))); sv.setAttribute('aria-label', t('mini.save')(u.id)); bk.setAttribute('aria-label', t('mini.bookAria')(u.id)); }
  }
  mini.addEventListener('click', (e) => {
    const b = e.target.closest('[data-mini]'); if (!b || !sel.unit) return;
    if (b.dataset.mini === 'save') toggleSave(sel.unit.id);
    if (b.dataset.mini === 'book') bookUnit(sel.unit);
  });
  let toastT = 0;
  function toast(msg) {
    const el2 = $('.minibar__toast');
    el2.textContent = msg; el2.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(() => { el2.hidden = true; }, 2800);
  }

  function updatePicker(animate) {
    const n = UNITS.filter(match).length;
    $('.filters__count').innerHTML = t('pick.count')(n);
    if (animate && n && !UNITS.some((u) => u.floor === sel.floor && match(u))) {
      const floors = [...new Set(UNITS.filter(match).map((u) => u.floor))].sort((a, b) => Math.abs(a - sel.floor) - Math.abs(b - sel.floor));
      sel.floor = floors[0]; sel.unit = null;
    }
    if (animate && sel.unit && !match(sel.unit)) {
      const better = UNITS.find((u) => u.floor === sel.floor && match(u));
      if (better) sel.unit = better;
    }
    if (!sel.unit) sel.unit = UNITS.find((u) => u.floor === sel.floor && match(u)) || UNITS.find((u) => u.floor === sel.floor);
    paintFacade();
    renderPlan(false);
    renderUnit(false);
    renderMini();
  }
  // перерисовка размеров текста в SVG при смене ширины
  let rzT = 0; let lastPW = 0;
  window.addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(() => { const w = Math.round(planSvg.getBoundingClientRect().width); if (Math.abs(w - lastPW) > 30) { lastPW = w; renderPlan(false); renderUnit(false); } }, 200); });

  // ── Ипотека ────────────────────────────────────────────
  const mi = { price: $('#m-price'), down: $('#m-down'), term: $('#m-term'), rate: $('#m-rate') };
  mi.price.max = Math.ceil(LIMITS.price[1] / 1e7) * 1e7;
  mi.price.min = 10000000;
  let prog = 'family';
  const payment = (loan, rate, years) => { const n = years * 12, r = rate / 1200; return r ? (loan * r) / (1 - Math.pow(1 + r, -n)) : loan / n; };
  function renderPrograms() {
    $('[data-render="progChips"]').innerHTML = PROGRAMS.map((p) => `<button type="button" class="chip" role="radio" data-prog="${p.k}" aria-checked="${p.k === prog}" tabindex="${p.k === prog || (!prog && p.k === 'family') ? 0 : -1}">${L(p)}</button>`).join('');
  }
  const setProg = (k) => { prog = k; mi.rate.value = PROGRAMS.find((p) => p.k === k).rate; renderPrograms(); calcMortgage(); };
  $('[data-render="progChips"]').addEventListener('click', (e) => { const b = e.target.closest('[data-prog]'); if (b) setProg(b.dataset.prog); });
  $('[data-render="progChips"]').addEventListener('keydown', (e) => {
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!d) return;
    e.preventDefault();
    const i = Math.max(0, PROGRAMS.findIndex((p) => p.k === prog));
    setProg(PROGRAMS[(i + d + PROGRAMS.length) % PROGRAMS.length].k); $(`[data-prog="${prog}"]`).focus();
  });
  $('[data-render="progCompare"]').addEventListener('click', (e) => { const b = e.target.closest('[data-pc]'); if (b) { setProg(b.dataset.pc); const again = $(`[data-pc="${b.dataset.pc}"]`); if (again) again.focus(); } });
  Object.values(mi).forEach((inp) => inp.addEventListener('input', () => {
    if (inp === mi.rate) { const p = PROGRAMS.find((x) => Math.abs(x.rate - +mi.rate.value) < 0.05); prog = p ? p.k : null; renderPrograms(); }
    if (inp === mi.price && mortUnit && +mi.price.value !== clamp(mortUnit.price, +mi.price.min, +mi.price.max)) { mortUnit = null; }
    calcMortgage();
  }));
  function setMortUnit(u) { mortUnit = u; mi.price.value = clamp(u.price, +mi.price.min, +mi.price.max); calcMortgage(); }
  $('[data-mort-unit]').addEventListener('click', (e) => { if (e.target.closest('button')) { mortUnit = null; calcMortgage(); $('#m-price').focus(); } });
  function paintSlider(inp) { inp.style.setProperty('--p', `${((inp.value - inp.min) / (inp.max - inp.min)) * 100}%`); }
  // Прокручивающиеся цифры (только transform)
  function roll(el2, text) {
    el2.setAttribute('aria-label', text);
    const chars = [...text];
    const sig = chars.map((c) => (/\d/.test(c) ? 'd' : c)).join('');
    let fresh = false;
    if (el2.dataset.sig !== sig) {
      el2.innerHTML = chars.map((c) => (/\d/.test(c) ? `<span class="rd" aria-hidden="true"><span class="rd__s">${'0123456789'.split('').map((d) => `<span>${d}</span>`).join('')}</span></span>` : `<span class="rc" aria-hidden="true">${esc(c)}</span>`)).join('');
      el2.dataset.sig = sig; fresh = true;
    }
    const strips = $$('.rd__s', el2); let j = 0;
    if (fresh && !reduceMotion) void el2.offsetWidth;
    chars.forEach((c) => { if (/\d/.test(c)) strips[j++].style.transform = `translateY(${-c * 10}%)`; });
  }
  function calcMortgage() {
    const price = +mi.price.value, dp = +mi.down.value, years = +mi.term.value, rate = +mi.rate.value;
    const loan = price * (1 - dp / 100);
    const n = years * 12;
    const pay = payment(loan, rate, years);
    const total = pay * n; const interest = total - loan;
    const out = (k) => $(`[data-out="${k}"]`);
    out('price').textContent = fmtM(price);
    out('down').innerHTML = `${dp}%<small>${fmtM(price * dp / 100)}</small>`;
    out('term').textContent = t('years')(years);
    out('rate').textContent = `${fmtNum(rate)}%`;
    roll(out('monthly'), fmtFull(Math.round(pay / 100) * 100));
    out('loan').textContent = fmtFull(Math.round(loan / 1000) * 1000);
    out('interest').textContent = fmtFull(Math.round(interest / 1000) * 1000);
    out('income').textContent = `${fmtFull(Math.round(pay / 0.5 / 1000) * 1000)} ${t('perMonth')}`;
    const share = Math.round((loan / total) * 100) || 0;
    out('share').textContent = `${share}%`;
    $('.donut__fg').style.strokeDasharray = `${share} 100`;
    $('.donut').setAttribute('aria-label', t('mort.donutAria')(share));
    Object.values(mi).forEach(paintSlider);
    mi.price.setAttribute('aria-valuetext', fmtM(price));
    mi.down.setAttribute('aria-valuetext', `${dp}%, ${fmtM(price * dp / 100)}`);
    mi.term.setAttribute('aria-valuetext', t('years')(years));
    mi.rate.setAttribute('aria-valuetext', `${fmtNum(rate)}%`);
    const mu = $('[data-mort-unit]');
    mu.hidden = !mortUnit;
    if (mortUnit) mu.innerHTML = `<span>${t('mort.unit')(mortUnit.id, fmtM2(mortUnit.price))}</span><button type="button" aria-label="${esc(t('mort.unitRemove'))}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>`;
    renderAmort(loan, rate, years, pay);
    $('[data-render="progCompare"]').innerHTML = PROGRAMS.map((p) => `<button type="button" class="prog-c" data-pc="${p.k}" aria-pressed="${p.k === prog}"><small>${esc(p.short[lang])} · ${fmtNum(p.rate)}%</small><b>${fmtFull(Math.round(payment(loan, p.rate, years) / 100) * 100)}</b><span>${t('mort.progMonthly')}</span></button>`).join('');
  }
  function renderAmort(loan, rate, years, pay) {
    const r = rate / 1200; let bal = loan; const P = []; const I = [];
    for (let y = 0; y < years; y++) {
      let p = 0, i = 0;
      for (let m = 0; m < 12; m++) { const im = bal * r; const pm = pay - im; i += im; p += pm; bal -= pm; }
      P.push(p); I.push(i);
    }
    const W = 480, H = 170, top = 8;
    const ymax = pay * 12;
    const X = (i) => (years === 1 ? W / 2 : (i / (years - 1)) * W);
    const Y = (v) => H - (v / ymax) * (H - top);
    const pts = P.map((v, i) => `${X(i).toFixed(1)} ${Y(v).toFixed(1)}`);
    const pPath = `M0 ${H}L${pts.join('L')}L${W} ${H}Z`;
    const iPath = `M0 ${H}L0 ${Y(ymax).toFixed(1)}L${W} ${Y(ymax).toFixed(1)}L${W} ${H}Z`;
    const cross = (P.findIndex((p, i) => p >= I[i]) + 1) || years;
    const cx = X(cross - 1);
    $('.amort__svg').innerHTML = `<path class="a-i" d="${iPath}"/><path class="a-p" d="${pPath}"/>${[0.25, 0.5, 0.75].map((g) => `<path class="a-grid" d="M0 ${(H - g * (H - top)).toFixed(1)}H${W}"/>`).join('')}<path d="M${cx.toFixed(1)} ${top}V${H}" stroke="var(--paper)" stroke-width="1" stroke-dasharray="3 4" vector-effect="non-scaling-stroke" opacity=".7"/>`;
    $('.amort__svg').setAttribute('aria-label', t('mort.chartAria')(cross));
    $('[data-amort-axis]').innerHTML = `<span>${t('mort.year')(1)}</span><span>${t('mort.cross')(cross)}</span><span>${t('mort.year')(years)}</span>`;
  }

  // ── Запись на просмотр ─────────────────────────────────
  const form = $('.vform');
  const done = $('.vdone');
  let pick = { day: null, time: null };
  let week = 0;
  let doneData = null;
  const SLOTS = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
  function dayList() {
    const out = []; const base = new Date(); base.setHours(12, 0, 0, 0);
    for (let i = 1; i <= 14; i++) { const d = new Date(base); d.setDate(base.getDate() + i); out.push(d); }
    return out;
  }
  const dayKey = (d) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  function renderDays() {
    const all = dayList();
    if (!pick.day) pick.day = dayKey(all[0]);
    const days = all.slice(week * 7, week * 7 + 7);
    const wd = new Intl.DateTimeFormat(lang === 'ru' ? 'ru-RU' : 'en-GB', { weekday: 'short' });
    const long = new Intl.DateTimeFormat(lang === 'ru' ? 'ru-RU' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    const inWeek = days.some((d) => dayKey(d) === pick.day);
    $('.days').innerHTML = days.map((d, i) => {
      const k = dayKey(d); const on = k === pick.day;
      const label = wd.format(d).replace('.', '');
      return `<button type="button" class="day" role="radio" data-day="${k}" aria-checked="${on}" tabindex="${on || (!inWeek && i === 0) ? 0 : -1}" aria-label="${esc(long.format(d))}"><small>${esc(label)}</small><b>${d.getDate()}</b></button>`;
    }).join('');
    const mf = new Intl.DateTimeFormat(lang === 'ru' ? 'ru-RU' : 'en-GB', { month: 'long' });
    const m0 = mf.format(days[0]), m1 = mf.format(days[days.length - 1]);
    $('[data-month]').textContent = m0 === m1 ? m0 : `${m0} – ${m1}`;
    $('[data-week="-1"]').disabled = week === 0;
    $('[data-week="1"]').disabled = week === 1;
    renderSlots();
  }
  $$('[data-week]').forEach((b) => b.addEventListener('click', () => {
    week = clamp(week + +b.dataset.week, 0, 1);
    renderDays();
    const other = $(`[data-week="${-b.dataset.week}"]`);
    if (b.disabled && other) other.focus();
  }));
  function renderSlots() {
    const seed = pick.day.split('-').reduce((a, b) => a + +b, 0);
    const busy = (i) => ((seed * 7 + i * 13) % 5) === 0;
    if (pick.time && busy(SLOTS.indexOf(pick.time))) pick.time = null;
    $('.slots').innerHTML = SLOTS.map((s, i) => `<button type="button" class="slot" role="radio" data-time="${s}" aria-checked="${s === pick.time}" tabindex="${s === pick.time || (!pick.time && i === SLOTS.findIndex((_, j) => !busy(j))) ? 0 : -1}"${busy(i) ? ' disabled' : ''}>${s}</button>`).join('');
  }
  function radioKeys(container, attr, onPick) {
    container.addEventListener('keydown', (e) => {
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!d) return;
      const items = $$(`[${attr}]:not([disabled])`, container);
      const i = items.indexOf(document.activeElement); if (i < 0) return;
      e.preventDefault();
      const next = items[(i + d + items.length) % items.length];
      onPick(next); const again = $(`[${attr}="${next.getAttribute(attr)}"]`, container); if (again) again.focus();
    });
  }
  const pickDay = (b) => { pick.day = b.dataset.day; renderDays(); };
  const pickTime = (b) => { pick.time = b.dataset.time; renderSlots(); clearErr('slot'); };
  $('.days').addEventListener('click', (e) => { const b = e.target.closest('[data-day]'); if (b) pickDay(b); });
  $('.slots').addEventListener('click', (e) => { const b = e.target.closest('[data-time]'); if (b) pickTime(b); });
  radioKeys($('.days'), 'data-day', pickDay);
  radioKeys($('.slots'), 'data-time', pickTime);

  function renderUnitChip() {
    const chip = $('[data-unit-chip]');
    chip.hidden = !viewUnit;
    if (viewUnit) chip.innerHTML = `<span><small>${esc(t('view.unitK'))}</small><b>${esc(t('view.unit')(viewUnit.id))}</b> · ${m2(viewUnit.area)} · ${fmtM2(viewUnit.price)}</span><button type="button" aria-label="${esc(t('view.unitRemove'))}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>`;
  }
  $('[data-unit-chip]').addEventListener('click', (e) => { if (e.target.closest('button')) { viewUnit = null; renderUnitChip(); form.elements.format[0].focus(); } });
  // Любая ссылка «Записаться» подставляет квартиру, если её уже выбрали в подборе
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href="#viewing"]');
    if (a && userPicked && sel.unit && sel.unit.status !== 'sold' && !viewUnit) { viewUnit = sel.unit; renderUnitChip(); }
    if (a && a.hasAttribute('data-mort-book') && mortUnit) { viewUnit = mortUnit; renderUnitChip(); }
  });

  const phone = form.elements.phone;
  phone.addEventListener('input', () => {
    let d = phone.value.replace(/\D/g, '');
    if (!d) { phone.value = ''; return; }
    if (d[0] === '8') d = '7' + d.slice(1);
    if (d[0] !== '7') d = '7' + d;
    d = d.slice(0, 11);
    const p = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)];
    let s = '+7';
    if (p[0]) s += ` (${p[0]}`;
    if (p[0].length === 3) s += ')';
    if (p[1]) s += ` ${p[1]}`;
    if (p[2]) s += `-${p[2]}`;
    if (p[3]) s += `-${p[3]}`;
    phone.value = s;
    clearErr('phone');
  });
  form.elements.name.addEventListener('input', () => clearErr('name'));
  form.elements.consent.addEventListener('change', () => { form.elements.consent.closest('.check').classList.remove('is-bad'); form.elements.consent.removeAttribute('aria-invalid'); });
  function setErr(k, msg) {
    const e = $(`[data-err="${k}"]`, form); if (e) e.textContent = msg;
    const field = e && e.closest('.field'); if (field) field.classList.add('is-bad');
    const inp = form.elements[k]; if (inp && inp.setAttribute) inp.setAttribute('aria-invalid', 'true');
  }
  function clearErr(k) {
    const e = $(`[data-err="${k}"]`, form); if (e) e.textContent = '';
    const field = e && e.closest('.field'); if (field) field.classList.remove('is-bad');
    const inp = form.elements[k]; if (inp && inp.removeAttribute) inp.removeAttribute('aria-invalid');
  }
  form.elements.name.setAttribute('aria-describedby', 'err-name');
  $('[data-err="name"]').id = 'err-name';
  phone.setAttribute('aria-describedby', 'err-phone');
  $('[data-err="phone"]').id = 'err-phone';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    ['slot', 'name', 'phone'].forEach(clearErr);
    let first = null;
    const name = form.elements.name.value.trim();
    const digits = phone.value.replace(/\D/g, '');
    if (!pick.day || !pick.time) { setErr('slot', t('view.errSlot')); first = first || $('.slot:not([disabled])'); }
    if (name.length < 2) { setErr('name', t('view.errName')); first = first || form.elements.name; }
    if (digits.length < 11) { setErr('phone', t('view.errPhone')); first = first || phone; }
    if (!form.elements.consent.checked) {
      form.elements.consent.closest('.check').classList.add('is-bad');
      form.elements.consent.setAttribute('aria-invalid', 'true');
      if (!first) setErr('slot', t('view.errConsent'));
      first = first || form.elements.consent;
    }
    if (first) { first.focus(); return; }
    doneData = { name, phone: phone.value, day: pick.day, time: pick.time, fmt: form.elements.format.value, unit: viewUnit ? viewUnit.id : null };
    showDone(doneData);
    form.hidden = true; done.hidden = false; done.focus();
  });
  function showDone(d) {
    const [y, m, dd] = d.day.split('-').map(Number);
    const date = new Date(y, m - 1, dd);
    const when = `${new Intl.DateTimeFormat(lang === 'ru' ? 'ru-RU' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(date)}, ${d.time}`;
    $('.vdone__text').textContent = t('view.done')({ name: d.name, phone: d.phone, when, unit: d.unit, fmt: d.fmt === 'video' ? t('view.fmtVideo') : t('view.fmtGallery') });
  }
  $('[data-again]').addEventListener('click', () => {
    doneData = null; pick.time = null; form.reset(); renderDays(); done.hidden = true; form.hidden = false;
    const first = $('.day[aria-checked="true"]') || $('.day'); if (first) first.focus();
  });

  // ── Старт ──────────────────────────────────────────────
  sel.unit = UNITS.find((u) => u.floor === sel.floor && match(u));
  mortUnit = sel.unit;
  if (sel.unit) mi.price.value = clamp(sel.unit.price, +mi.price.min, +mi.price.max);
  applyLang(lang);
  lastPW = Math.round(planSvg.getBoundingClientRect().width);
  paintNav();
})();
