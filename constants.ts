
import { Lesson, Badge, User, DiaryEntry, Product } from './types';

export const MOCK_USER: User = {
  id: 'meta-master-01',
  name: 'Алексей (Супер Администратор)',
  email: 'super@admin.ru',
  role: 'super_admin',
  xp: 32000,
  level: 10,
  streak: 88,
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aleksei',
  status: 'active',
  joinedAt: '2023-01-01',
  diagnosticsStatus: 'completed',
  crmStage: 'student',
  source: 'direct',
  paymentStatus: 'paid',
  purchasedProductIds: ['prod_course_full', 'prod_meta_scan']
};

export const ADMIN_USER: User = {
  id: 'admin-01',
  name: 'Александр (Администратор)',
  email: 'admin@admin.ru',
  role: 'admin',
  xp: 25000,
  level: 8,
  streak: 41,
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  status: 'active',
  joinedAt: '2023-01-10',
  diagnosticsStatus: 'completed',
  crmStage: 'student',
  source: 'direct',
  paymentStatus: 'paid',
  purchasedProductIds: ['prod_meta_scan']
};

export const MOCK_USERS_LIST: User[] = [
  MOCK_USER,
  ADMIN_USER,
  {
    id: 'curator-01',
    name: 'Елена (Куратор)',
    email: 'curator@admin.ru',
    role: 'support',
    xp: 15000,
    level: 6,
    streak: 20,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ElenaCurator',
    status: 'active',
    joinedAt: '2023-03-15',
    diagnosticsStatus: 'completed',
    crmStage: 'student',
    source: 'recommendation',
    paymentStatus: 'paid'
  },
  {
    id: 'user-va',
    name: 'Владимир Аллергин',
    email: 'va@example.com',
    role: 'participant',
    subRole: 'ВА',
    xp: 4500,
    level: 3,
    streak: 5,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vladimir',
    status: 'active',
    joinedAt: '2023-11-20',
    diagnosticsStatus: 'completed',
    crmStage: 'student',
    source: 'bot_lead',
    paymentStatus: 'paid',
    purchasedProductIds: ['prod_meta_scan']
  },
  {
    id: 'user-vas',
    name: 'Валерия Астмина',
    email: 'vas@example.com',
    role: 'participant',
    subRole: 'ВАс',
    xp: 8900,
    level: 5,
    streak: 12,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Valeria',
    status: 'active',
    joinedAt: '2023-10-15',
    diagnosticsStatus: 'completed',
    crmStage: 'student',
    source: 'webinar',
    paymentStatus: 'paid',
    purchasedProductIds: ['prod_course_full']
  },
  {
    id: 'user-vad',
    name: 'Василий Дерматитов',
    email: 'vad@example.com',
    role: 'participant',
    subRole: 'ВАд',
    xp: 2200,
    level: 2,
    streak: 8,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vasily',
    status: 'active',
    joinedAt: '2023-11-05',
    diagnosticsStatus: 'completed',
    crmStage: 'student',
    source: 'ad',
    paymentStatus: 'paid',
    purchasedProductIds: ['prod_course_full', 'prod_meta_scan']
  },
  {
    id: 'user-ma',
    name: 'Мария Семенова (мама)',
    email: 'ma@example.com',
    role: 'participant',
    subRole: 'Ма',
    xp: 1300,
    level: 1,
    streak: 4,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mariya',
    status: 'active',
    joinedAt: '2023-11-18',
    diagnosticsStatus: 'completed',
    crmStage: 'student',
    source: 'direct',
    paymentStatus: 'paid',
    purchasedProductIds: ['prod_meta_scan']
  },
  {
    id: 'user-mas',
    name: 'Маргарита Павлова (мама)',
    email: 'mas@example.com',
    role: 'participant',
    subRole: 'МАс',
    xp: 14200,
    level: 7,
    streak: 29,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rita',
    status: 'active',
    joinedAt: '2023-09-01',
    diagnosticsStatus: 'completed',
    crmStage: 'student',
    source: 'bot_lead',
    paymentStatus: 'paid',
    purchasedProductIds: ['prod_course_full', 'prod_meta_scan']
  },
  {
    id: 'user-mad',
    name: 'Милана Коткова (мама)',
    email: 'mad@example.com',
    role: 'participant',
    subRole: 'Мад',
    xp: 3400,
    level: 2,
    streak: 7,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Milana',
    status: 'active',
    joinedAt: '2023-11-10',
    diagnosticsStatus: 'completed',
    crmStage: 'student',
    source: 'webinar',
    paymentStatus: 'paid',
    purchasedProductIds: ['prod_course_full']
  },
  {
    id: 'user-newbie',
    name: 'Иван Новиков',
    email: 'user@admin.ru',
    role: 'user',
    subRole: 'none',
    xp: 50,
    level: 1,
    streak: 0,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan',
    status: 'active',
    joinedAt: '2023-12-01',
    diagnosticsStatus: 'none',
    crmStage: 'lead',
    source: 'ad',
    paymentStatus: 'unpaid',
    purchasedProductIds: []
  },
  {
    id: 'user-diag-only',
    name: 'Ольга Соколова',
    email: 'olga_d@example.com',
    role: 'user',
    subRole: 'none',
    xp: 200,
    level: 1,
    streak: 1,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olga',
    status: 'active',
    joinedAt: '2023-11-28',
    diagnosticsStatus: 'in_progress',
    crmStage: 'diagnostics',
    source: 'bot_lead',
    paymentStatus: 'unpaid',
    purchasedProductIds: []
  },
  {
    id: 'user-interested',
    name: 'Дмитрий Шевченко',
    email: 'interested@example.com',
    role: 'user',
    subRole: 'none',
    xp: 800,
    level: 1,
    streak: 2,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry',
    status: 'active',
    joinedAt: '2023-11-25',
    diagnosticsStatus: 'completed',
    crmStage: 'pre_sale',
    source: 'webinar',
    paymentStatus: 'unpaid',
    purchasedProductIds: []
  }
];

export const LEVEL_THRESHOLDS = [0, 2000, 5000, 10000, 20000, 50000];

export const BADGES: Badge[] = [
  { id: 'b1', name: 'Инициация', icon: '✨', description: 'Первый контакт с полем', unlocked: true },
  { id: 'b2', name: 'Проводник', icon: '👁️', description: '7 дней осознанного мониторинга', unlocked: false },
  { id: 'b3', name: 'Алхимик', icon: '⚗️', description: 'Трансформация 5 триггеров', unlocked: false },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod_meta_scan',
    type: 'interactive_test',
    title: 'Мета-Сканирование',
    description: 'Глубинный замер частоты поля и психосоматических блоков.',
    price: 1500,
    features: ['Биометрический анализ', 'Карта нейро-блоков', 'PDF протокол'],
    imageUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2070',
    fullDescription: "Полная диагностика вашей энергосистемы и поиск корневых конфликтов, вызывающих аллергическую реакцию.",
    benefits: ["Определение вектора терапии", "Замер уровня стресса", "Личный план эволюции"]
  },
  {
    id: 'prod_course_full',
    type: 'course_standard',
    title: 'Трансформация: Свобода Тела',
    description: 'Полный протокол освобождения от аллергии через работу с сознанием.',
    price: 25000,
    features: ['12 Этапов Эволюции', 'Нейро-практики', 'Доступ в Meta-Community'],
    imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1974',
    fullDescription: "Фундаментальный курс по психосоматике. Вы научитесь управлять реакциями своего тела и перепрошьете нейронные связи."
  }
];

export const LESSONS: Lesson[] = [
  {
    id: 0,
    blockId: 0,
    title: "Инициация & Диагностика",
    description: "Вход в пространство проекта НетАллергии, сбор анамнеза и выявление психосоматических триггеров.",
    durationMinutes: 15,
    isLocked: false,
    isCompleted: false,
    completedBlockIds: [],
    weekNumber: 1,
    blocks: [
      {
        id: 'l0-b1',
        type: 'video',
        title: 'Код Свободы: Механизм НетАллергии',
        content: 'Добро пожаловать в проект НетАллергии (AllergyNet). Это инновационная экосистема немедикаментозной психосоматической регенерации. Ваше тело способно восстановить полноценную иммунную толерантность к внешним аллергенам при устранении очагов сверхчувствительности в структурах головного мозга.',
        mediaUrl: 'https://vimeo.com/meta',
        coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072',
        hasAssignment: false
      },
      {
        id: 'l0-b2',
        type: 'text',
        title: 'Биология психосоматического конфликта',
        content: 'В основе аллергий, бронхиальной астмы и атопического дерматита лежит древний биологический трек (сенсорный якорь). В момент сильного стресса мозг связывает эмоциональное переживание с сопутствующими факторами внешней среды (пыльца, шерсть, пища). При повторении этих внешних стимулов организм запускает локальную защиту слизистых оболочек или эпидермиса.',
        hasAssignment: false
      },
      {
        id: 'l0-b3',
        type: 'text',
        title: 'Интерактивная диагностика',
        content: 'Для построения вашей карты психосоматического здоровья и определения точечного плана терапии пройдите глубинную диагностику на 120 вопросов.',
        hasAssignment: false
      }
    ]
  },
  {
    id: 1,
    blockId: 1,
    title: "Архитектура Симптома и Нейробиология",
    description: "Раскрытие кода аллергии через нейрофизиологию органов дыхания и кожи.",
    durationMinutes: 45,
    isLocked: true, 
    isCompleted: false,
    completedBlockIds: [],
    requiredProductId: 'prod_course_full',
    weekNumber: 1,
    blocks: [
      {
        id: 'l1-b1',
        type: 'video',
        title: 'Эмоциональный Резонанс и Гистаминовый Выброс',
        content: 'Как мысль и страх становятся физиологической реакцией посредством активации тучных клеток.',
        mediaUrl: 'https://vimeo.com/meta',
        coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=2070',
        hasAssignment: true,
        assignmentDescription: 'Опишите ваше состояние при контакте с триггером. Какая эмоция предшествовала самому первому приступу?'
      }
    ]
  },
  {
    id: 2,
    blockId: 2,
    title: "Энергетический баланс и Вегетатика",
    description: "Регуляция симпатической и парасимпатической систем. Устранение спазмов гладкой мускулатуры бронхов.",
    durationMinutes: 30,
    isLocked: true,
    isCompleted: false,
    completedBlockIds: [],
    requiredProductId: 'prod_course_full',
    weekNumber: 1,
    blocks: [
      {
        id: 'l2-b1',
        type: 'video',
        title: 'Управление тонусом блуждающего нерва',
        content: 'Дыхательные паттерны и вокально-телесные практики для быстрой перегрузки вегетативной нервной системы при астматическом удушье.',
        mediaUrl: 'https://vimeo.com/meta',
        coverUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=2070',
        hasAssignment: true,
        assignmentDescription: 'Какое упражнение из видео вызвало у вас наибольший телесный отклик? Опишите пульс после практики.'
      }
    ]
  },
  {
    id: 3,
    blockId: 3,
    title: "Психотехника «Стирание триггера»",
    description: "Пошаговая терапия по методу НЛП и реверс-сенсибилизации. Работа с глубинными психотравмами.",
    durationMinutes: 50,
    isLocked: true,
    isCompleted: false,
    completedBlockIds: [],
    requiredProductId: 'prod_course_full',
    weekNumber: 2,
    blocks: [
      {
        id: 'l3-b1',
        type: 'video',
        title: 'Стирание сенсорного трека в памяти',
        content: 'Перенастройка ассоциативного центра коры головного мозга. Обучение разделению аллергена (например, шерсть кошки) и эмоциональной травмы (разрыв отношений/страх одиночества).',
        mediaUrl: 'https://vimeo.com/meta',
        coverUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=2070',
        hasAssignment: true,
        assignmentDescription: 'Удалось ли вам мысленно диссоциироваться от картинки стресса из прошлого?'
      }
    ]
  },
  {
    id: 4,
    blockId: 4,
    title: "Восстановление барьерной функции кожи",
    description: "Работа с конфликтами разделения и изоляции при атопическом дерматите.",
    durationMinutes: 40,
    isLocked: true,
    isCompleted: false,
    completedBlockIds: [],
    requiredProductId: 'prod_course_full',
    weekNumber: 3,
    blocks: [
      {
        id: 'l4-b1',
        type: 'video',
        title: 'Принятие контакта и эмоциональные границы',
        content: 'Исцеление кожного зуда и экземы. Эмоциональный детокс: убираем страх быть отвергнутым, учимся обозначать личные границы.',
        mediaUrl: 'https://vimeo.com/meta',
        coverUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=2070',
        hasAssignment: true,
        assignmentDescription: 'Опишите ваше отношение к прикосновениям людей во время обострений.'
      }
    ]
  },
  {
    id: 5,
    blockId: 5,
    title: "Интеграция ремиссии и Новый Иммунитет",
    description: "Финальная интеграция всех уровней экосистемы AllergyNet. Кристаллизация вегетативной стабильности.",
    durationMinutes: 60,
    isLocked: true,
    isCompleted: false,
    completedBlockIds: [],
    requiredProductId: 'prod_course_full',
    weekNumber: 4,
    blocks: [
      {
        id: 'l5-b1',
        type: 'video',
        title: 'Выход на стойкую безмедикаментозную ремиссию',
        content: 'Сочетание новых поведенческих паттернов, очищенного противовоспалительного кишечного микробиома, и психологической устойчивости. Обретение стопроцентной внутренней физиологической свободы.',
        mediaUrl: 'https://vimeo.com/meta',
        coverUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070',
        hasAssignment: true,
        assignmentDescription: 'Сформулируйте ваше новое жизненное кредо без оглядки на аллергические ограничения.'
      }
    ]
  }
];

const getPastDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const MOCK_DIARY_ENTRIES: DiaryEntry[] = [
  {
    id: 'd1',
    date: getPastDate(9),
    symptomLevel: 3,
    emotionLevel: 4,
    triggers: 'Молочные продукты, Пыльца',
    emotions: 'Тревога, раздражение',
    notes: 'Сильный насморк с утра, зуд кожи. Трудно концентрироваться.',
    diet: 'Овсянка на обычном молоке, бутерброд с сыром, паста',
    hasAttacks: true,
    attackSeverity: 8
  },
  {
    id: 'd2',
    date: getPastDate(8),
    symptomLevel: 4,
    emotionLevel: 4,
    triggers: 'Цитрусовые',
    emotions: 'Бессилие, напряжение',
    notes: 'Покраснения на локтевых сгибах стали ярче. Начинаю первый урок.',
    diet: 'Яичница, апельсиновый сок, рис с курицей, салат',
    hasAttacks: true,
    attackSeverity: 7
  },
  {
    id: 'd3',
    date: getPastDate(7),
    symptomLevel: 5,
    emotionLevel: 5,
    triggers: 'Холодный воздух',
    emotions: 'Спокойствие, надежда',
    notes: 'Кашель уменьшился. Упражнение из урока помогло.',
    diet: 'Гречка, запеченная индейка, огурцы, чай на травах',
    hasAttacks: false
  },
  {
    id: 'd4',
    date: getPastDate(6),
    symptomLevel: 5,
    emotionLevel: 6,
    triggers: 'Пыль',
    emotions: 'Интерес, принятие',
    notes: 'Была легкая одышка после уборки, но купировал ее за 3 минуты.',
    diet: 'Рис, тушеная индейка, кабачки, зеленое яблоко',
    hasAttacks: true,
    attackSeverity: 5
  },
  {
    id: 'd5',
    date: getPastDate(5),
    symptomLevel: 6,
    emotionLevel: 6,
    triggers: 'Нет явных',
    emotions: 'Уверенность',
    notes: 'Кожа стала чище, зуд почти не беспокоит. Спокойный день.',
    diet: 'Киноа, запеченная рыба, брокколи, стакан воды с лимоном',
    hasAttacks: false
  },
  {
    id: 'd6',
    date: getPastDate(4),
    symptomLevel: 7,
    emotionLevel: 7,
    triggers: 'Стресс на работе',
    emotions: 'Легкое волнение',
    notes: 'Несмотря на напряженный звонок, дыхание осталось ровным.',
    diet: 'Овсянка на воде с бананом, индейка су-вид, шпинат',
    hasAttacks: true,
    attackSeverity: 3
  },
  {
    id: 'd7',
    date: getPastDate(3),
    symptomLevel: 8,
    emotionLevel: 7,
    triggers: 'Нет',
    emotions: 'Гармония',
    notes: 'Сон глубокий, проснулся свежим. Никаких проявлений астмы.',
    diet: 'Гречневые хлебцы, авокадо, яйцо пашот, отварная курица',
    hasAttacks: false
  },
  {
    id: 'd8',
    date: getPastDate(2),
    symptomLevel: 8,
    emotionLevel: 8,
    triggers: 'Нет',
    emotions: 'Ясность, радость',
    notes: 'Второй день без каких-либо приступов. Невероятная легкость!',
    diet: 'Запеченный судак, цветная капуста, киноа, чай из ромашки',
    hasAttacks: false
  },
  {
    id: 'd9',
    date: getPastDate(1),
    symptomLevel: 9,
    emotionLevel: 9,
    triggers: 'Нет',
    emotions: 'Глубокий покой',
    notes: 'Опробовал методику «Стирание триггера» на шерсти у друзей. Реакции нет!',
    diet: 'Пшенная каша на миндальном молоке, чай, тушеная индейка',
    hasAttacks: false
  }
];

export const ANAMNESIS_QUESTIONS = ["Когда был первый разрыв связи?", "Что тело хочет сказать этим симптомом?"];
export const TEST_QUESTIONS = ["Я чувствую единство с миром.", "Мое тело - мой союзник."];
