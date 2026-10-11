const asset = (file: string) => `${import.meta.env.BASE_URL}assets/${file}`;
export type Media = { image: string; alt: string; layout: 'phone' | 'operator' | 'orders' };
export type Note = { number: string; title: string; text: string };
export type CaseBlock = { type: 'notes'; items: Note[] } | { type: 'images'; items: Media[] };
export type Project = Media & { slug: string; title: string; description: string; logo: string; logoWide?: boolean; metrics?: { value: string; label: string; mobileLabel?: string; tabletLabel?: string }[]; blocks: CaseBlock[]; next: string };
export type Company = { name: string; logo: string; role: string; period: string; projects: Project[] };
const phone = (image: string, alt: string): Media => ({ image: asset(image), alt, layout: 'phone' });
const note = (number: string, title: string, text: string): Note => ({ number, title, text });
const notes = (...items: Note[]): CaseBlock => ({ type: 'notes', items });
const images = (...items: Media[]): CaseBlock => ({ type: 'images', items });
export const projects: Project[] = [
  {
    slug: 'marketplacesvyazi', title: 'Маркетплейс связи',
    description: 'Спроектировал новый продукт для подключения тарифов разных операторов на в МегаФон. Отвечал за весь путь от выбора тарифа до заказа. Продукт запущен и работает год',
    ...phone('marketplace.png', 'Маркетплейс связи: выбор оператора и тарифа'), logo: asset('megafon-logo.svg'),
    metrics: [{ value: '+X%', label: 'АБПП' }, { value: '-27%', label: 'Время до оформления заказа, относительно стандартного подключения', tabletLabel: 'Время до оформления заказа, относительно каталога тарифов', mobileLabel: 'Время до оформления заказа, относительно каталога тарифов' }],
    blocks: [
      notes(note('01', 'Задача бизнеса', 'Создать новый канал привлечения абонентов в условиях ценовой конкуренции'), note('02', 'Дизайн-задача', 'Объяснить пользователям что МегаФон собрал тарифы всех операторов в одном месте. Показать тарифы конкурентов, не называя конкурентов. Спроектировать весь пользовательский путь с 0.'), note('03', 'Сложность', 'Размытые вводные и короткие сроки. От получения задачи до запуска ~1.5 месяца')),
      images(phone('marketplace-details.png', 'Карточка тарифа: услуги, минуты, интернет и подключение')),
      notes(note('04', 'Ключевое решение', 'Адаптировал привычную модель товарного маркетплейса к выбору услуг связи'), note('05', 'Результат', 'Запустили продукт в срок. Благодаря Маркетплейсу выросла метрика АБПП и снизилось время до оформления заказа засчет упрощения когнитивной нагрузки на карточках тарифов.')),
    ], next: 'copytarif',
  },
  {
    slug: 'copytarif', title: 'Копирование тарифа',
    description: 'Спроектировал и запустил новый продукт. Превратил стрессовый для пользователя сценарий перехода к другому оператору в простых 5 шагов на сайте и личном кабинете',
    ...phone('cloning.png', 'Копирование тарифа: условия тарифа и кнопка копирования'), logo: asset('megafon-logo.svg'),
    metrics: [{ value: '+X%', label: 'АБПП' }, { value: '+15%', label: 'Конверсия в заказ, относительно стандартных подключений' }],
    blocks: [
      notes(note('01', 'Проблема', 'Пользователям подходит текущий тариф, и они не хотят терять его условия при смене оператора'), note('02', 'Дизайн-задача', 'Создать простой и понятный для пользователя продукт копирования тарифа с 0'), note('03', 'Сложность', 'Размытые вводные и короткие сроки. От получения задачи до запуска ~1.5 месяца')),
      images(phone('cloning-number.png', 'Перенос тарифа: ввод номера телефона')),
      notes(note('04', 'Ключевое решение', 'Превратил стрессовый для пользователя сценарий перехода к другому оператору в простых 5 шагов на сайте и в 2 шага в личном кабинете')),
      images(phone('cloning-upload.png', 'Загрузка скриншотов с условиями текущего тарифа'), phone('cloning-success.png', 'Подтверждение: тариф скопирован')),
      notes(note('05', 'Результат', 'Запустили продукт в срок. Благодаря Копированию тарифа выросла метрика АБПП и увеличилась конверсия в заказа относительно стандартных подключений. Сервис лег в основу продукта Маркетплейс тарифов')),
    ], next: 'operators',
  },
  {
    slug: 'operators', title: 'Рабочее место операторов колл-центра',
    description: 'Проектировал платформу для операторов контакт-центра: обработку звонков и чатов, планирование рабочего времени и вспомогательные инструменты.',
    image: asset('operator.png'), alt: 'Рабочее место оператора: обращения, чат и карточка клиента', layout: 'operator', logo: asset('fintech-logo.svg'),
    blocks: [notes(note('01', 'Проблема', 'Операторы использовали несколько сервисов для обработки обращений'), note('02', 'Дизайн-задача', 'Проектировал заметки, таймеры, чаты, звонки и мини-панель обращения. Проводил исследования, внедрил CSI-опрос и заложил основы дизайн-системы'), note('03', 'Результат', 'Внедрил несколько фичей которые повлияли на удобство работы операторов. ЛПРы оценили CSI-опрос и приняли решение распространить фичу на смежные продукты.'))], next: 'citybrand',
  },
  {
    slug: 'citybrand', title: 'Маркетплейс Citybrand',
    description: 'Работал над маркетплейсом Citybrand и инструментами для сотрудников склада. Напрямую взаимодействовал с заказчиком.',
    ...phone('citybrand.png', 'Citybrand: каталог одежды и карточка товара'), logo: asset('citybrand-logo.png'), logoWide: true,
    blocks: [
      notes(note('01', 'Задача бизнеса #1', 'Помочь покупателю получить необходимую информацию о товаре и перейти к покупке'), note('02', 'Мой вклад', 'Структурировал каталог и карточку продукта, тем самым прозрачив для пользователя информацию о товарах')),
      images({ image: asset('citybrand-orders.png'), alt: 'Админ-панель Citybrand: список заказов для сотрудников склада', layout: 'orders' }),
      notes(note('01', 'Задача бизнеса #2', 'Обновить админ-панель для работников склада. Снизить время обработки заказов сотрудниками склада'), note('02', 'Мой вклад', 'Спроектировал и довёл до запуска новую админ-панель для склада, переработав представление наличия товаров и состава заказов.'), note('03', 'Результат обоих задач', 'Переработал детальную страницу товара. Обновил сценарии добавления и управления товарами. Оба решения дошли до запуска.')),
    ], next: 'marketplacesvyazi',
  },
];
export const content = {
  name: 'UNTONE KALINKIN', role: 'Product Designer',
  intro: 'Сейчас работаю в МегаФон, решаю сложные продуктовые задачи и превращаю неоднозначные вводные в понятные пользовательские решения — от идеи и UX до финального интерфейса',
  avatar: asset('avatar.png'), avatarAlt: 'Untone Kalinkin',
  links: { cv: 'https://drive.google.com/file/d/1rQFiMN7d6dvsmFGYel2Uje17F9bE_0-d/view?usp=sharing', email: 'iamuntone@gmail.com', telegram: 'https://t.me/unt0nee' }, contactLabel: 'СВЯЗАТЬСЯ В TELEGRAM',
  companies: [
    { name: 'MEGAFON', logo: asset('megafon-logo.svg'), role: 'Senior Product Designer', period: '2024 - СЕЙЧАС', projects: projects.slice(0,2) },
    { name: 'TOP-3 FINTECH', logo: asset('fintech-logo.svg'), role: 'Middle Product Designer', period: '2022 - 2024', projects: [projects[2]] },
    { name: 'HANDS APP', logo: asset('handsapp-logo.svg'), role: 'Junior Product Designer', period: '2021 - 2022', projects: [projects[3]] },
  ] satisfies Company[],
};
