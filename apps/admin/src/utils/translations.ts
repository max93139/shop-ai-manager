export type Language = 'uk' | 'en';

export interface TranslationDictionary {
  adminPanel: string;
  storeOperations: string;
  overview: string;
  catalog: string;
  sales: string;
  automation: string;
  system: string;

  dashboard: string;
  analytics: string;
  storage: string;
  inventory: string;
  catalogAndInventory: string;
  catalogAndInventoryTitle: string;
  orders: string;
  customers: string;
  crm: string;
  telegramBot: string;
  channelPublisher: string;
  smartAssistant: string;
  notifications: string;
  settings: string;

  searchPlaceholder: string;
  commandTriggerText: string;
  commandInputPlaceholder: string;
  commandSectionPages: string;
  commandSectionProducts: string;
  commandSectionOrders: string;
  commandSectionActions: string;
  commandNoResultsTitle: string;
  commandNoResultsDesc: string;
  commandFooterShortcuts: string;
  commandActionLowStock: string;
  commandActionOutOfStock: string;
  commandActionAddProduct: string;
  logout: string;
  adminBreadcrumb: string;

  storeSettingsTitle: string;
  storeSettingsSubtitle: string;
  saveChanges: string;
  saving: string;
  savedSuccess: string;

  tabProfile: string;
  tabTelegram: string;
  tabInventory: string;
  tabSecurity: string;

  generalInfoTitle: string;
  generalInfoDesc: string;
  storeNameLabel: string;
  supportPhoneLabel: string;
  supportEmailLabel: string;
  currencyLabel: string;
  timezoneLabel: string;
  languageLabel: string;
  langUk: string;
  langEn: string;
  saveProfileBtn: string;

  telegramTitle: string;
  telegramDesc: string;
  telegramChannelLabel: string;
  autoPublishLabel: string;
  autoPublishDesc: string;
  adminIdLabel: string;
  adminIdDesc: string;
  botTokenStatusLabel: string;
  botTokenConfigured: string;
  saveTelegramBtn: string;

  inventoryTitle: string;
  inventoryDesc: string;
  lowStockThresholdLabel: string;
  lowStockDesc: string;
  soundAlertsLabel: string;
  soundAlertsDesc: string;
  autoArchiveLabel: string;
  autoArchiveDesc: string;
  saveInventoryBtn: string;

  securityTitle: string;
  securityDesc: string;
  currentPasswordLabel: string;
  newPasswordLabel: string;
  confirmPasswordLabel: string;
  updatePasswordBtn: string;
  passwordUpdatedSuccess: string;
  passwordMinLength: string;
  passwordsMismatch: string;

  productsTitle: string;
  productVariantsInInventory: string;
  productVariantSingular: string;
  exportBtn: string;
  searchProductsPlaceholder: string;
  allCategories: string;
  allBrands: string;
  allSizes: string;
  allColors: string;
  statusAll: string;
  statusActive: string;
  statusLowStock: string;
  statusOutOfStock: string;
  resetFilters: string;
  viewModeGrid: string;
  viewModeTable: string;

  thProduct: string;
  thCategory: string;
  thBrand: string;
  thColor: string;
  thSize: string;
  thStock: string;
  thPrice: string;
  thStatus: string;
  thActions: string;

  actionDelete: string;
  actionCancel: string;
  deleteTooltip: string;
  decreaseStock: string;
  increaseStock: string;
  clickToEditStock: string;
  clickToEditPrice: string;
  noProductsFound: string;
  noProductsFoundSub: string;

  showingPrefix: string;
  showingOf: string;

  ordersTitle: string;
  ordersSubtitle: string;
  totalOrdersBadge: string;
  refreshBtn: string;
  exportCsvBtn: string;

  totalRevenueTitle: string;
  fromAllRecordedSales: string;
  activeOrdersTitle: string;
  inFulfillmentSuffix: string;
  pendingActionTitle: string;
  awaitingConfirmationSubtitle: string;
  archivedTitle: string;
  deliveredSuffix: string;
  cancelledSuffix: string;

  tabActiveOrders: string;
  tabPending: string;
  tabPaid: string;
  tabProcessing: string;
  tabShipped: string;
  tabArchive: string;
  tabAllOrders: string;
  searchOrdersPlaceholder: string;

  orderStatusPending: string;
  orderStatusPaid: string;
  orderStatusProcessing: string;
  orderStatusShipped: string;
  orderStatusDelivered: string;
  orderStatusCancelled: string;

  thOrder: string;
  thCustomer: string;
  thItems: string;
  thTotal: string;
  thTrackingTtn: string;

  viewDetailsBtn: string;
  noOrdersFound: string;
  noOrdersFoundSub: string;

  orderDetailsTitle: string;
  customerInfoSection: string;
  deliverySection: string;
  orderedItemsSection: string;
  orderStatusLabel: string;
  ttnLabel: string;
  saveTtnBtn: string;
  savingTtn: string;
  trackOnNovaPoshta: string;
  generateTtnBtn: string;
  ttnCreateFailed: string;
  paymentLabel: string;
  paymentPaidOnline: string;
  paymentLinkSent: string;
  paymentOnDelivery: string;
  paymentCheckBtn: string;
  paymentNotPaidYet: string;
  paymentCheckFailed: string;
  deleteOrderBtn: string;
  confirmDeleteOrder: string;
  closeBtn: string;
  totalAmountLabel: string;
  itemsCountSuffix: string;
  cityLabel: string;
  warehouseLabel: string;
  phoneLabel: string;
  thDate: string;
  thDelivery: string;
  btnPrevious: string;
  btnNext: string;
  pageLabel: string;
  pageOf: string;
  carrierLabel: string;
  notGeneratedText: string;
  currentStatusLabel: string;
  changeStatusLabel: string;
  customerDetailsTitle: string;
  nameLabel: string;
  deliveryTitle: string;
  colorLabel: string;
  sizeLabel: string;
  quantityLabel: string;
  uniqueVariantsSuffix: string;
  deletingText: string;
  enterTtnPlaceholder: string;
  createBtn: string;
  saveBtn: string;

  storageTitle: string;
  storageSubtitleItems: string;
  storageSubtitleCategories: string;
  addProductBtn: string;
  newProduct: string;
  draftStatus: string;
  publishToTelegramBtn: string;
  saveChangesBtn: string;
  detailsSection: string;
  productNameLabel: string;
  productNamePlaceholder: string;
  categoryLabel: string;
  brandLabel: string;
  searchOrAddBrand: string;
  addBrandOption: string;
  variantBuilderTitle: string;
  variantBuilderSubtitle: string;
  productTypeLabel: string;
  sizeModeLabel: string;
  sizesSectionTitle: string;
  colorsSectionTitle: string;
  stockPerSizeTitle: string;
  bulkStockPlaceholder: string;
  applyBtn: string;
  addCustomSizeBtn: string;
  addColorBtn: string;
  customColorModalTitle: string;
  customColorModalDesc: string;
  hexCodeLabel: string;
  colorNameLabel: string;
  colorNamePlaceholder: string;
  popularPresetsLabel: string;
  summaryTitle: string;
  summarySubtitle: string;
  noSizesSelected: string;
  noColorsSelected: string;

  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;
  dashboardSubtitlePrefix: string;
  dashboardSubtitleToday: string;
  dashboardSubtitleNoName: string;
  priceFieldLabel: string;
  uploadImages: string;
  uploadHint: string;
  uploadDropHere: string;
  uploadMoreImages: string;
  chartNoSalesTitle: string;
  chartNoSalesHint: string;
  loginNoAccess: string;
  loaderVerifying: string;
  comingSoonBadge: string;
  comingSoonPlanned: string;
  statTodaySales: string;
  statRevenue30d: string;
  statOrders: string;
  statNewCustomers: string;
  statVsYesterday: string;
  statVsLastMonth: string;
  latestOrdersTitle: string;
  viewAllBtn: string;
  noOrdersYet: string;
  noOrdersYetSub: string;
  thPayment: string;
  thFulfillment: string;
  revenueLast7Days: string;
  peakPrefix: string;
  paymentStatusPaid: string;
  paymentStatusPending: string;
  paymentStatusFailed: string;
  fulfillmentStatusProcessing: string;
  fulfillmentStatusShipped: string;
  fulfillmentStatusUnfulfilled: string;
  fulfillmentStatusDelivered: string;

  notificationsTitle: string;
  notificationsSubtitle: string;
  markAllAsReadBtn: string;
  clearReadBtn: string;
  filterAll: string;
  filterUnread: string;
  filterOrders: string;
  filterInventory: string;
  noNotificationsTitle: string;
  noNotificationsDesc: string;
  notifNewOrderTitle: string;
  notifNewOrderMessage: string;
  notifLowStockTitle: string;
  notifOutOfStockTitle: string;
  notifStockMessage: string;
  notifOpenOrder: string;
  notifOpenInventory: string;
  notifLoadFailed: string;
  notifDelete: string;
  notifNewCount: string;

  analyticsTitle: string;
  analyticsSubtitle: string;
  timeframe7d: string;
  timeframe30d: string;
  timeframe90d: string;
  timeframeYear: string;
  kpiTotalRevenue: string;
  kpiTotalOrders: string;
  kpiAov: string;
  kpiConversion: string;
  revenueTrendTitle: string;
  salesByCategoryTitle: string;
  topProductsHeading: string;
  deliveryGeographyTitle: string;
  unitsSoldSuffix: string;

  smartAssistantTitle: string;
  smartAssistantSubtitle: string;
  activeBadge: string;
  inventoryAuditTitle: string;
  inventoryAuditDesc: string;
  runAuditBtn: string;
  runningAuditStatus: string;
  auditSuccessMsg: string;

  channelSyncTitle: string;
  channelSyncDesc: string;
  syncChannelBtn: string;
  syncingChannelStatus: string;
  channelSyncSuccessMsg: string;

  healthCheckTitle: string;
  healthCheckDesc: string;
  checkHealthBtn: string;
  checkingHealthStatus: string;
  healthCheckSuccessMsg: string;

  workflowRulesTitle: string;
  rulesEnabledOf: string;

  ruleOrderNotificationName: string;
  ruleOrderNotificationDesc: string;
  ruleOrderNotificationTrigger: string;

  ruleLowStockName: string;
  ruleLowStockDesc: string;
  ruleLowStockTrigger: string;

  ruleChannelDraftName: string;
  ruleChannelDraftDesc: string;
  ruleChannelDraftTrigger: string;

  ruleRestockCancelName: string;
  ruleRestockCancelDesc: string;
  ruleRestockCancelTrigger: string;

  telegramBotTitle: string;
  telegramBotSubtitle: string;
  botSettingsBtn: string;
  botStatusTitle: string;
  botOnline: string;
  botOffline: string;
  botHandleLabel: string;
  botUptimeLabel: string;
  botMessagesTodayLabel: string;
  botActiveChatsLabel: string;
  connectedChannelTitle: string;
  subscribersSuffix: string;
  channelConnected: string;
  channelDisconnected: string;
  queueStatusTitle: string;
  queuePendingPosts: string;
  queueScheduledToday: string;
  queueFailedReview: string;
  recentOrderedTitle: string;
  recentOrderedSubtitle: string;
  recentOrderedViewAll: string;
  recentOrderedEmpty: string;
  recentOrderedTimePrefix: string;

  loginWelcomeTitle: string;
  loginSubtitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  signInBtn: string;
  signingInBtn: string;
  invalidCredentialsMsg: string;
  loginFailedMsg: string;
}

export const formatProductVariantsCount = (count: number, lang: Language): string => {
  if (lang === 'en') {
    return `${count} ${count === 1 ? 'product variant in inventory' : 'product variants in inventory'}`;
  }
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return `${count} варіант товару на складі`;
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return `${count} варіанти товарів на складі`;
  }
  return `${count} варіантів товарів на складі`;
};

export const formatStorageSubtitle = (items: number, categories: number, lang: Language): string => {
  if (lang === 'en') {
    return `${items} items across ${categories} categories`;
  }
  const mod10 = items % 10;
  const mod100 = items % 100;
  let itemsStr = 'товарів';
  if (mod10 === 1 && mod100 !== 11) {
    itemsStr = 'товар';
  } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    itemsStr = 'товари';
  }

  const catMod10 = categories % 10;
  const catMod100 = categories % 100;
  let catStr = 'категоріях';
  if (catMod10 === 1 && catMod100 !== 11) {
    catStr = 'категорії';
  }

  return `${items} ${itemsStr} у ${categories} ${catStr}`;
};

export const formatVariantsCreated = (count: number, lang: Language): string => {
  if (lang === 'en') {
    return `${count} variant${count === 1 ? '' : 's'} will be created`;
  }
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return `${count} варіант буде створено`;
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return `${count} варіанти буде створено`;
  }
  return `${count} варіантів буде створено`;
};

const categoryMapUk: Record<string, string> = {
  outerwear: 'Верхній одяг',
  knitwear: 'Трикотаж',
  footwear: 'Взуття',
  accessories: 'Аксесуари',
  headwear: 'Головні убори',
  apparel: 'Одяг',
  clothing: 'Одяг',
  dresses: 'Сукні',
  dress: 'Сукні',
  shirts: 'Сорочки',
  shirt: 'Сорочки',
  tshirts: 'Футболки',
  tshirt: 'Футболки',
  pants: 'Штани',
  trousers: 'Штани',
  trouser: 'Штани',
  jeans: 'Джинси',
  shorts: 'Шорти',
  hoodie: 'Худі',
  hoodies: 'Худі',
  sweatshirt: 'Світшоти',
  sweatshirts: 'Світшоти',
  jacket: 'Куртки',
  jackets: 'Куртки',
  coat: 'Пальта',
  coats: 'Пальта',
  suit: 'Костюми',
  suits: 'Костюми',
  shoes: 'Взуття',
  sneakers: 'Кросівки',
  boots: 'Черевики',
  bags: 'Сумки',
  bag: 'Сумки',
  general: 'Загальне',
  other: 'Інше',
};

export const translateCategory = (category: string, lang: Language): string => {
  if (!category) return '';
  if (lang === 'en') return category;
  const key = category.trim().toLowerCase();
  return categoryMapUk[key] || category;
};

const colorMapUk: Record<string, string> = {
  black: 'Чорний',
  white: 'Білий',
  red: 'Червоний',
  blue: 'Синій',
  green: 'Зелений',
  yellow: 'Жовтий',
  orange: 'Помаранчевий',
  purple: 'Фіолетовий',
  pink: 'Рожевий',
  brown: 'Коричневий',
  grey: 'Сірий',
  gray: 'Сірий',
  navy: 'Темно-синій',
  beige: 'Бежевий',
  cream: 'Кремовий',
  charcoal: 'Вугільний',
  camel: 'Кемел',
  khaki: 'Хакі',
  olive: 'Оливковий',
  teal: 'Бірюзовий',
  burgundy: 'Бордовий',
  coral: 'Кораловий',
  gold: 'Золотий',
  silver: 'Срібний',
  maroon: 'Темно-бордовий',
  cyan: 'Блакитний',
  mint: 'М’ятний',
  lavender: 'Лавандовий',
  tan: 'Пісочний',
  ivory: 'Слонова кістка',
  rust: 'Іржавий',
  sage: 'Шавлієвий',
  sand: 'Пісочний',
  wite: 'Білий',
};

export const translateColor = (color: string, lang: Language): string => {
  if (!color) return '';
  if (lang === 'en') return color;
  const key = color.trim().toLowerCase();
  return colorMapUk[key] || color;
};

const dayMapUk: Record<string, string> = {
  Sun: 'Нд',
  Mon: 'Пн',
  Tue: 'Вт',
  Wed: 'Ср',
  Thu: 'Чт',
  Fri: 'Пт',
  Sat: 'Сб',
};

export const translateDay = (day: string, lang: Language): string => {
  if (lang === 'en') return day;
  return dayMapUk[day] || day;
};

export const translatePeakInfo = (peakInfo: string | undefined, lang: Language): string => {
  if (!peakInfo) return '';
  if (lang === 'en') return peakInfo;
  return peakInfo
    .replace(/^Peak\s*/i, 'Пік: ')
    .replace(/\b(Sun|Mon|Tue|Wed|Thu|Fri|Sat)\b/g, (d) => dayMapUk[d] || d);
};

export const translations: Record<Language, TranslationDictionary> = {
  uk: {
    adminPanel: 'Панель керування',
    storeOperations: 'Керування магазином',
    overview: 'Огляд',
    catalog: 'Каталог',
    sales: 'Продажі',
    automation: 'Автоматизація',
    system: 'Система',

    dashboard: 'Дашборд',
    analytics: 'Аналітика',
    storage: 'Склад',
    inventory: 'Товари та залишки',
    catalogAndInventory: 'Каталог та Склад',
    catalogAndInventoryTitle: 'Каталог та Склад',
    orders: 'Замовлення',
    customers: 'Клієнти',
    crm: 'CRM',
    telegramBot: 'Telegram-бот',
    channelPublisher: 'Публікація в канал',
    smartAssistant: 'Розумний асистент',
    notifications: 'Сповіщення',
    settings: 'Налаштування',

    searchPlaceholder: 'Пошук товарів, замовлень...',
    commandTriggerText: 'Пошук або швидка команда...',
    commandInputPlaceholder: 'Пошук товарів, замовлень, сторінок або дій...',
    commandSectionPages: 'Розділи та навігація',
    commandSectionProducts: 'Товари на складі',
    commandSectionOrders: 'Замовлення',
    commandSectionActions: 'Швидкі дії',
    commandNoResultsTitle: 'Нічого не знайдено',
    commandNoResultsDesc: 'Перевірте правильність написання або спробуйте інший запит (наприклад, артикул SKU або ім’я покупця).',
    commandFooterShortcuts: '↑↓ Навігація • ↵ Вибрати • esc Закрити',
    commandActionLowStock: 'Переглянути критичні залишки (≤ 5 шт)',
    commandActionOutOfStock: 'Переглянути товари без наявності (0 шт)',
    commandActionAddProduct: 'Створити новий товар',
    logout: 'Вийти',
    adminBreadcrumb: 'Адмін',

    storeSettingsTitle: 'Налаштування магазину',
    storeSettingsSubtitle: 'Конфігурація магазину, автоматизація Telegram, мова інтерфейсу та безпека',
    saveChanges: 'Зберегти зміни',
    saving: 'Збереження...',
    savedSuccess: 'Налаштування успішно збережено!',

    tabProfile: 'Профіль магазину',
    tabTelegram: 'Telegram та канали',
    tabInventory: 'Залишки та сповіщення',
    tabSecurity: 'Безпека та пароль',

    generalInfoTitle: 'Загальна інформація про магазин',
    generalInfoDesc: 'Дані бренду, які бачать покупці у Telegram-чеках та сповіщеннях',
    storeNameLabel: 'Назва магазину',
    supportPhoneLabel: 'Телефон підтримки',
    supportEmailLabel: 'Email підтримки',
    currencyLabel: 'Валюта магазину',
    timezoneLabel: 'Часовий пояс',
    languageLabel: 'Мова панелі керування (Language)',
    langUk: 'Українська (UK)',
    langEn: 'English (EN)',
    saveProfileBtn: 'Зберегти налаштування профілю',

    telegramTitle: 'Інтеграція з Telegram',
    telegramDesc: 'Канал для автоматичної публікації товарів та ідентифікатор адміна',
    telegramChannelLabel: 'Telegram-канал (Username)',
    autoPublishLabel: 'Автоматична публікація нових товарів',
    autoPublishDesc: 'Товари з фото публікуватимуться в канал одразу після створення',
    adminIdLabel: 'Telegram ID адміністратора',
    adminIdDesc: 'Отримання сповіщень про нові замовлення у приватні повідомлення',
    botTokenStatusLabel: 'Статус токена бота',
    botTokenConfigured: 'Налаштовано в .env (Працює)',
    saveTelegramBtn: 'Зберегти налаштування Telegram',

    inventoryTitle: 'Залишки та пороги сповіщень',
    inventoryDesc: 'Керування тригерами закінчення товару та звуковими сповіщеннями',
    lowStockThresholdLabel: 'Поріг низького залишку (од.)',
    lowStockDesc: 'Товари з такою або меншою кількістю позначатимуться як "Низький залишок"',
    soundAlertsLabel: 'Звукові сповіщення в браузері',
    soundAlertsDesc: 'Відтворювати звук при появі нового замовлення',
    autoArchiveLabel: 'Автоархівація виконаних замовлень',
    autoArchiveDesc: 'Автоматично приховувати замовлення зі статусом "Доставлено" через 30 днів',
    saveInventoryBtn: 'Зберегти налаштування складу',

    securityTitle: 'Безпека облікового запису',
    securityDesc: 'Зміна пароля доступу до адміністративної панелі',
    currentPasswordLabel: 'Поточний пароль',
    newPasswordLabel: 'Новий пароль',
    confirmPasswordLabel: 'Підтвердження нового пароля',
    updatePasswordBtn: 'Оновити пароль адміністратора',
    passwordUpdatedSuccess: 'Пароль адміністратора успішно оновлено',
    passwordMinLength: 'Новий пароль має містити щонайменше 8 символів',
    passwordsMismatch: 'Паролі не співпадають',

    productsTitle: 'Товари',
    productVariantsInInventory: 'варіантів товарів на складі',
    productVariantSingular: 'варіант товару на складі',
    exportBtn: 'Експорт',
    searchProductsPlaceholder: 'Пошук товарів...',
    allCategories: 'Всі категорії',
    allBrands: 'Всі бренди',
    allSizes: 'Всі розміри',
    allColors: 'Всі кольори',
    statusAll: 'Всі',
    statusActive: 'В наявності',
    statusLowStock: 'Мало на складі',
    statusOutOfStock: 'Немає в наявності',
    resetFilters: 'Скинути',
    viewModeGrid: 'Сітка',
    viewModeTable: 'Таблиця',

    thProduct: 'ТОВАР',
    thCategory: 'КАТЕГОРІЯ',
    thBrand: 'БРЕНД',
    thColor: 'КОЛІР',
    thSize: 'РОЗМІР',
    thStock: 'КІЛЬКІСТЬ',
    thPrice: 'ЦІНА',
    thStatus: 'СТАТУС',
    thActions: 'ДІЇ',

    actionDelete: 'Видалити',
    actionCancel: 'Скасувати',
    deleteTooltip: 'Видалити',
    decreaseStock: 'Зменшити залишок',
    increaseStock: 'Збільшити залишок',
    clickToEditStock: 'Натисніть для зміни залишку',
    clickToEditPrice: 'Натисніть для зміни ціни',
    noProductsFound: 'Товарів не знайдено за заданими фільтрами',
    noProductsFoundSub: 'Спробуйте змінити фільтри або пошуковий запит.',

    showingPrefix: 'Показано',
    showingOf: 'з',

    ordersTitle: 'Замовлення',
    ordersSubtitle: 'Керування замовленнями клієнтів, адресами доставки та статусами виконання.',
    totalOrdersBadge: 'всього',
    refreshBtn: 'Оновити',
    exportCsvBtn: 'Експорт CSV',

    totalRevenueTitle: 'Загальний виторг',
    fromAllRecordedSales: 'За обраним фільтром, без скасованих',
    activeOrdersTitle: 'Активні замовлення',
    inFulfillmentSuffix: 'у виконанні',
    pendingActionTitle: 'Очікують підтвердження',
    awaitingConfirmationSubtitle: 'Очікують обробки',
    archivedTitle: 'Архів',
    deliveredSuffix: 'доставлено',
    cancelledSuffix: 'скасовано',

    tabActiveOrders: 'Активні замовлення',
    tabPending: 'Очікують',
    tabPaid: 'Оплачені',
    tabProcessing: 'В обробці',
    tabShipped: 'Відправлені',
    tabArchive: 'Архів',
    tabAllOrders: 'Всі замовлення',
    searchOrdersPlaceholder: 'Пошук замовлень за клієнтом, телефоном або ТТН...',

    orderStatusPending: 'Очікує',
    orderStatusPaid: 'Оплачено',
    orderStatusProcessing: 'В обробці',
    orderStatusShipped: 'Відправлено',
    orderStatusDelivered: 'Доставлено',
    orderStatusCancelled: 'Скасовано',

    thOrder: 'ЗАМОВЛЕННЯ',
    thCustomer: 'КЛІЄНТ',
    thItems: 'ТОВАРИ',
    thTotal: 'СУМА',
    thTrackingTtn: 'ТРЕКІНГ / ТТН',

    viewDetailsBtn: 'Деталі',
    noOrdersFound: 'Замовлень не знайдено',
    noOrdersFoundSub: 'Спробуйте обрати інший статус або змінити пошуковий запит.',

    orderDetailsTitle: 'Деталі замовлення',
    customerInfoSection: 'Дані клієнта',
    deliverySection: 'Доставка Нова Пошта',
    orderedItemsSection: 'Замовлені товари',
    orderStatusLabel: 'Статус замовлення',
    ttnLabel: 'Номер накладної (ТТН)',
    saveTtnBtn: 'Зберегти ТТН',
    savingTtn: 'Збереження ТТН...',
    trackOnNovaPoshta: 'Відстежити на Новій Пошті',
    generateTtnBtn: 'Створити ТТН',
    ttnCreateFailed: 'Не вдалося створити ТТН',
    paymentLabel: 'Оплата',
    paymentPaidOnline: 'Онлайн, {date}',
    paymentLinkSent: 'Посилання надіслано, не оплачено',
    paymentOnDelivery: 'При отриманні',
    paymentCheckBtn: 'Перевірити',
    paymentNotPaidYet: 'Monobank: оплати ще немає',
    paymentCheckFailed: 'Не вдалося перевірити оплату',
    deleteOrderBtn: 'Видалити замовлення',
    confirmDeleteOrder: 'Ви впевнені, що хочете видалити це замовлення?',
    closeBtn: 'Закрити',
    totalAmountLabel: 'Загальна сума',
    itemsCountSuffix: 'шт',
    cityLabel: 'Місто',
    warehouseLabel: 'Відділення',
    phoneLabel: 'Телефон',
    thDate: 'ДАТА',
    thDelivery: 'ДОСТАВКА',
    btnPrevious: 'Назад',
    btnNext: 'Далі',
    pageLabel: 'Сторінка',
    pageOf: 'з',
    carrierLabel: 'Перевізник',
    notGeneratedText: 'Не згенеровано',
    currentStatusLabel: 'Поточний статус:',
    changeStatusLabel: 'Змінити статус:',
    customerDetailsTitle: 'Інформація про покупця',
    nameLabel: 'Ім’я:',
    deliveryTitle: 'Доставка та логістика',
    colorLabel: 'Колір',
    sizeLabel: 'Розмір',
    quantityLabel: 'Кількість',
    uniqueVariantsSuffix: 'унікальних варіантів',
    deletingText: 'Видалення…',
    enterTtnPlaceholder: 'Номер ТТН',
    createBtn: 'Створити',
    saveBtn: 'Зберегти',

    storageTitle: 'Склад',
    storageSubtitleItems: 'товарів у',
    storageSubtitleCategories: 'категоріях',
    addProductBtn: 'Додати товар',
    newProduct: 'Новий товар',
    draftStatus: 'Чернетка',
    publishToTelegramBtn: 'Опублікувати в Telegram',
    saveChangesBtn: 'Зберегти зміни',
    detailsSection: 'Деталі товару',
    productNameLabel: 'Назва товару',
    productNamePlaceholder: 'напр. Вовняне пальто, Шкіряний ремінь',
    categoryLabel: 'Категорія',
    brandLabel: 'Бренд',
    searchOrAddBrand: 'Пошук або додавання бренду…',
    addBrandOption: 'Додати бренд',
    variantBuilderTitle: 'Генератор розмірів та кольорів',
    variantBuilderSubtitle: 'Оберіть комбінації та встановіть залишки',
    productTypeLabel: 'Тип товару',
    sizeModeLabel: 'Шкала розмірів',
    sizesSectionTitle: 'Розміри',
    colorsSectionTitle: 'Кольори',
    stockPerSizeTitle: 'Залишок на кожен розмір',
    bulkStockPlaceholder: 'Встановити всім...',
    applyBtn: 'Застосувати',
    addCustomSizeBtn: 'Додати свій розмір',
    addColorBtn: 'Додати колір',
    customColorModalTitle: 'Додати власний колір',
    customColorModalDesc: 'Оберіть відтінок на панелі або оберіть з популярних',
    hexCodeLabel: 'HEX-код',
    colorNameLabel: 'Назва кольору',
    colorNamePlaceholder: 'напр. Кемел, Лісовий зелений',
    popularPresetsLabel: 'Популярні палітри',
    summaryTitle: 'Підсумок матриці',
    summarySubtitle: 'Попередній перегляд сформованих варіантів товару.',
    noSizesSelected: '— розміри не обрано —',
    noColorsSelected: '— кольори не обрано —',

    goodMorning: 'Доброго ранку',
    goodAfternoon: 'Доброго дня',
    goodEvening: 'Доброго вечора',
    dashboardSubtitlePrefix: 'Ось що відбувається в магазині',
    dashboardSubtitleToday: 'сьогодні',
    dashboardSubtitleNoName: 'Ось що відбувається в магазині сьогодні, {date}.',
    priceFieldLabel: 'Ціна, ₴',
    uploadImages: 'Завантажити фото',
    uploadHint: 'Натисніть або перетягніть файли сюди',
    uploadDropHere: 'Відпустіть, щоб додати',
    uploadMoreImages: 'Натисніть або перетягніть, щоб додати ще фото',
    chartNoSalesTitle: "За цей період продажів не було",
    chartNoSalesHint: "Графік з’явиться після першого оплаченого замовлення.",
    loginNoAccess: "Немає доступу? Зверніться до адміністратора магазину.",
    loaderVerifying: "Завантаження…",
    comingSoonBadge: "У розробці",
    comingSoonPlanned: "Що заплановано",
    statTodaySales: 'Продажі за сьогодні',
    statRevenue30d: 'Виторг (30 днів)',
    statOrders: 'Замовлення',
    statNewCustomers: 'Нові клієнти',
    statVsYesterday: 'до вчора',
    statVsLastMonth: 'до минулого місяця',
    latestOrdersTitle: 'Останні замовлення',
    viewAllBtn: 'Переглянути всі',
    noOrdersYet: 'Замовлень ще немає',
    noOrdersYetSub: 'Оформлені в магазині замовлення відображатимуться тут.',
    thPayment: 'ОПЛАТА',
    thFulfillment: 'ВИКОНАННЯ',
    revenueLast7Days: 'Виторг за останні 7 днів',
    peakPrefix: 'Пік:',
    paymentStatusPaid: 'Оплачено',
    paymentStatusPending: 'Очікує',
    paymentStatusFailed: 'Помилка',
    fulfillmentStatusProcessing: 'В обробці',
    fulfillmentStatusShipped: 'Відправлено',
    fulfillmentStatusUnfulfilled: 'Не виконано',
    fulfillmentStatusDelivered: 'Доставлено',

    notificationsTitle: 'Сповіщення',
    notificationsSubtitle: 'Нові замовлення та попередження про залишки',
    markAllAsReadBtn: 'Позначити всі як прочитані',
    clearReadBtn: 'Очистити прочитані',
    filterAll: 'Всі',
    filterUnread: 'Непрочитані',
    filterOrders: 'Замовлення',
    filterInventory: 'Склад',
    noNotificationsTitle: 'Немає нових сповіщень',
    noNotificationsDesc: 'Тут з’являтимуться нові замовлення та попередження про залишки.',
    notifNewOrderTitle: 'Нове замовлення {number}',
    notifNewOrderMessage: '{customer} · {items} од. на {total}',
    notifLowStockTitle: 'Мало на складі: {product}',
    notifOutOfStockTitle: 'Закінчився: {product}',
    notifStockMessage: 'Варіант {color} / {size}: залишилось {stock} од.',
    notifOpenOrder: 'Відкрити замовлення',
    notifOpenInventory: 'Перейти до складу',
    notifLoadFailed: 'Не вдалося завантажити сповіщення',
    notifDelete: 'Видалити сповіщення',
    notifNewCount: 'нових',

    analyticsTitle: 'Аналітика та ефективність',
    analyticsSubtitle: 'Детальна фінансова статистика, категорії та географія замовлень',
    timeframe7d: '7 днів',
    timeframe30d: '30 днів',
    timeframe90d: '90 днів',
    timeframeYear: 'Рік',
    kpiTotalRevenue: 'Загальний виторг',
    kpiTotalOrders: 'Кількість замовлень',
    kpiAov: 'Середній чек (AOV)',
    kpiConversion: 'Відсоток виконання',
    revenueTrendTitle: 'Динаміка виторгу',
    salesByCategoryTitle: 'Продажі за категоріями',
    topProductsHeading: 'Топ товарів за продажами',
    deliveryGeographyTitle: 'Географія доставки',
    unitsSoldSuffix: 'продано',

    smartAssistantTitle: 'Розумний асистент та автоматизація',
    smartAssistantSubtitle: 'Автоматичні правила, синхронізація залишків та тригери процесів',
    activeBadge: 'Активно',
    inventoryAuditTitle: 'Аудит залишків',
    inventoryAuditDesc: 'Звірка залишків з підтвердженими замовленнями та оновлення статусів.',
    runAuditBtn: 'Запустити аудит',
    runningAuditStatus: 'Аудит виконується...',
    auditSuccessMsg: 'Аудит залишків успішно завершено.',

    channelSyncTitle: 'Синхронізація Telegram каналу',
    channelSyncDesc: 'Оновлення актуальної наявності товарів у підключеному Telegram-каналі.',
    syncChannelBtn: 'Синхронізувати',
    syncingChannelStatus: 'Синхронізація...',
    channelSyncSuccessMsg: 'Каталог каналу синхронізовано.',

    healthCheckTitle: 'Діагностика системи',
    healthCheckDesc: 'Перевірка затримки бази даних, черги BullMQ/Redis та зв’язку з ботом.',
    checkHealthBtn: 'Перевірити статус',
    checkingHealthStatus: 'Діагностика...',
    healthCheckSuccessMsg: 'Усі системи працюють стабільно: DB, Bot, API OK.',

    workflowRulesTitle: 'Правила автоматизації',
    rulesEnabledOf: 'активно з',

    ruleOrderNotificationName: 'Миттєве сповіщення про замовлення у Telegram',
    ruleOrderNotificationDesc: 'Надсилати сповіщення менеджеру в Telegram після оформлення покупки клієнтом.',
    ruleOrderNotificationTrigger: 'При створенні замовлення',

    ruleLowStockName: 'Авто-попередження про низький залишок',
    ruleLowStockDesc: 'Показувати попереджувальний бейдж та сповіщення, якщо залишок варіанту <= 5 од.',
    ruleLowStockTrigger: 'Залишок <= порогового значення',

    ruleChannelDraftName: 'Автоматична чернетка допису в канал',
    ruleChannelDraftDesc: 'Готувати готову публікацію для Telegram-каналу при збереженні нового товару на складі.',
    ruleChannelDraftTrigger: 'При створенні товару',

    ruleRestockCancelName: 'Повернення залишку при скасуванні замовлення',
    ruleRestockCancelDesc: 'Автоматично повертати кількість товару на склад, якщо замовлення скасовано.',
    ruleRestockCancelTrigger: 'Статус замовлення = СКАСОВАНО',

    telegramBotTitle: 'Telegram Бот',
    telegramBotSubtitle: 'Керування ботом-помічником вашого інтернет-магазину',
    botSettingsBtn: 'Налаштування бота',
    botStatusTitle: 'Статус бота',
    botOnline: 'В мережі',
    botOffline: 'Не в мережі',
    botHandleLabel: 'Юзернейм бота',
    botUptimeLabel: 'Час роботи',
    botMessagesTodayLabel: 'Повідомлень сьогодні',
    botActiveChatsLabel: 'Активних діалогів',
    connectedChannelTitle: 'Підключений канал',
    subscribersSuffix: 'підписників',
    channelConnected: 'Підключено',
    channelDisconnected: 'Відключено',
    queueStatusTitle: 'Черга публікацій',
    queuePendingPosts: 'В очікуванні',
    queueScheduledToday: 'Заплановано на сьогодні',
    queueFailedReview: 'Помилка (потребує перевірки)',
    recentOrderedTitle: 'Останні замовлені товари',
    recentOrderedSubtitle: 'Останні покупки клієнтів',
    recentOrderedViewAll: 'Всі замовлення',
    recentOrderedEmpty: 'Немає недавніх замовлень',
    recentOrderedTimePrefix: 'Замовлено',

    loginWelcomeTitle: 'Вхід до панелі керування',
    loginSubtitle: 'Увійдіть під обліковим записом адміністратора магазину',
    emailLabel: 'Робочий Email',
    emailPlaceholder: 'admin@atelier.ua',
    passwordLabel: 'Пароль',
    signInBtn: 'Увійти в кабінет',
    signingInBtn: 'Вхід...',
    invalidCredentialsMsg: 'Невірний логін або пароль',
    loginFailedMsg: 'Не вдалося увійти. Перевірте email та пароль.',
  },
  en: {
    adminPanel: 'Admin Panel',
    storeOperations: 'Store Operations',
    overview: 'Overview',
    catalog: 'Catalog',
    sales: 'Sales',
    automation: 'Automation',
    system: 'System',

    dashboard: 'Dashboard',
    analytics: 'Analytics',
    storage: 'Storage',
    inventory: 'Inventory & Stock',
    catalogAndInventory: 'Catalog & Inventory',
    catalogAndInventoryTitle: 'Catalog & Inventory',
    orders: 'Orders',
    customers: 'Customers',
    crm: 'CRM',
    telegramBot: 'Telegram Bot',
    channelPublisher: 'Channel Publisher',
    smartAssistant: 'Smart Assistant',
    notifications: 'Notifications',
    settings: 'Settings',

    searchPlaceholder: 'Search products, orders...',
    commandTriggerText: 'Search or type a command...',
    commandInputPlaceholder: 'Search products, orders, pages, or actions...',
    commandSectionPages: 'Navigation & Pages',
    commandSectionProducts: 'Warehouse Products',
    commandSectionOrders: 'Orders',
    commandSectionActions: 'Quick Actions',
    commandNoResultsTitle: 'No results found',
    commandNoResultsDesc: 'Check your spelling or try another keyword (e.g. SKU code or customer name).',
    commandFooterShortcuts: '↑↓ Navigate • ↵ Select • esc Close',
    commandActionLowStock: 'View critical low stock (≤ 5 units)',
    commandActionOutOfStock: 'View out-of-stock items (0 units)',
    commandActionAddProduct: 'Create a new product',
    logout: 'Log out',
    adminBreadcrumb: 'Admin',

    storeSettingsTitle: 'Store Settings',
    storeSettingsSubtitle: 'Configure store profile, Telegram integration, language, and credentials',
    saveChanges: 'Save changes',
    saving: 'Saving...',
    savedSuccess: 'Settings saved successfully!',

    tabProfile: 'Store Profile',
    tabTelegram: 'Telegram Channel',
    tabInventory: 'Stock & Alerts',
    tabSecurity: 'Security & Access',

    generalInfoTitle: 'General Store Profile',
    generalInfoDesc: 'Store branding visible on customer receipts and order confirmations',
    storeNameLabel: 'Store Name',
    supportPhoneLabel: 'Support Phone',
    supportEmailLabel: 'Support Email',
    currencyLabel: 'Default Currency',
    timezoneLabel: 'Timezone',
    languageLabel: 'Dashboard Language',
    langUk: 'Ukrainian (UK)',
    langEn: 'English (EN)',
    saveProfileBtn: 'Save Profile Settings',

    telegramTitle: 'Telegram Integration',
    telegramDesc: 'Connected broadcast channel and administrator recipient ID',
    telegramChannelLabel: 'Telegram Channel Username',
    autoPublishLabel: 'Auto-publish New Products',
    autoPublishDesc: 'Broadcast products to Telegram channel immediately upon creation',
    adminIdLabel: 'Admin Telegram ID',
    adminIdDesc: 'Receive order alerts in personal Telegram chat',
    botTokenStatusLabel: 'Bot Token Status',
    botTokenConfigured: 'Configured via .env (Active)',
    saveTelegramBtn: 'Save Telegram Settings',

    inventoryTitle: 'Inventory Triggers & Alerts',
    inventoryDesc: 'Set inventory stock thresholds and operational preferences',
    lowStockThresholdLabel: 'Low Stock Threshold (Units)',
    lowStockDesc: 'Items at or below this count will show the "Low Stock" badge',
    soundAlertsLabel: 'Browser Sound Alerts',
    soundAlertsDesc: 'Play sound when high-priority notifications arrive',
    autoArchiveLabel: 'Auto-archive Completed Orders',
    autoArchiveDesc: 'Automatically archive orders marked "Delivered" after 30 days',
    saveInventoryBtn: 'Save Inventory Settings',

    securityTitle: 'Security & Access Credentials',
    securityDesc: 'Update your administrator password for this dashboard',
    currentPasswordLabel: 'Current Password',
    newPasswordLabel: 'New Password',
    confirmPasswordLabel: 'Confirm New Password',
    updatePasswordBtn: 'Update Admin Password',
    passwordUpdatedSuccess: 'Admin password updated successfully',
    passwordMinLength: 'New password must be at least 8 characters long',
    passwordsMismatch: 'Passwords do not match',

    productsTitle: 'Products',
    productVariantsInInventory: 'product variants in inventory',
    productVariantSingular: 'product variant in inventory',
    exportBtn: 'Export',
    searchProductsPlaceholder: 'Search products...',
    allCategories: 'All categories',
    allBrands: 'All brands',
    allSizes: 'All sizes',
    allColors: 'All colors',
    statusAll: 'All',
    statusActive: 'Active',
    statusLowStock: 'Low stock',
    statusOutOfStock: 'Out of stock',
    resetFilters: 'Reset',
    viewModeGrid: 'Grid view',
    viewModeTable: 'Table view',

    thProduct: 'PRODUCT',
    thCategory: 'CATEGORY',
    thBrand: 'BRAND',
    thColor: 'COLOR',
    thSize: 'SIZE',
    thStock: 'STOCK',
    thPrice: 'PRICE',
    thStatus: 'STATUS',
    thActions: 'ACTIONS',

    actionDelete: 'Delete',
    actionCancel: 'Cancel',
    deleteTooltip: 'Delete',
    decreaseStock: 'Decrease stock',
    increaseStock: 'Increase stock',
    clickToEditStock: 'Click to edit stock',
    clickToEditPrice: 'Click to edit price',
    noProductsFound: 'No products found matching filters',
    noProductsFoundSub: 'Try adjusting your filters or search query.',

    showingPrefix: 'Showing',
    showingOf: 'of',

    ordersTitle: 'Orders',
    ordersSubtitle: 'Manage all incoming customer orders, delivery addresses, and fulfillment status.',
    totalOrdersBadge: 'total',
    refreshBtn: 'Refresh',
    exportCsvBtn: 'Export CSV',

    totalRevenueTitle: 'Total Revenue',
    fromAllRecordedSales: 'From all recorded sales',
    activeOrdersTitle: 'Active Orders',
    inFulfillmentSuffix: 'in fulfillment',
    pendingActionTitle: 'Pending Action',
    awaitingConfirmationSubtitle: 'Awaiting confirmation',
    archivedTitle: 'Archived',
    deliveredSuffix: 'delivered',
    cancelledSuffix: 'cancelled',

    tabActiveOrders: 'Active orders',
    tabPending: 'Pending',
    tabPaid: 'Paid',
    tabProcessing: 'Processing',
    tabShipped: 'Shipped',
    tabArchive: 'Archive',
    tabAllOrders: 'All orders',
    searchOrdersPlaceholder: 'Search orders by customer, phone, or TTN...',

    orderStatusPending: 'Pending',
    orderStatusPaid: 'Paid',
    orderStatusProcessing: 'Processing',
    orderStatusShipped: 'Shipped',
    orderStatusDelivered: 'Delivered',
    orderStatusCancelled: 'Cancelled',

    thOrder: 'ORDER',
    thCustomer: 'CUSTOMER',
    thItems: 'ITEMS',
    thTotal: 'TOTAL',
    thTrackingTtn: 'TRACKING / TTN',

    viewDetailsBtn: 'Details',
    noOrdersFound: 'No orders found',
    noOrdersFoundSub: 'Try selecting another status tab or modifying search query.',

    orderDetailsTitle: 'Order Details',
    customerInfoSection: 'Customer Information',
    deliverySection: 'Nova Poshta Delivery',
    orderedItemsSection: 'Ordered Items',
    orderStatusLabel: 'Order Status',
    ttnLabel: 'Tracking Number (TTN)',
    saveTtnBtn: 'Save TTN',
    savingTtn: 'Saving TTN...',
    trackOnNovaPoshta: 'Track on Nova Poshta',
    generateTtnBtn: 'Generate TTN',
    ttnCreateFailed: 'Could not create the TTN',
    paymentLabel: 'Payment',
    paymentPaidOnline: 'Online, {date}',
    paymentLinkSent: 'Link sent, not paid',
    paymentOnDelivery: 'On delivery',
    paymentCheckBtn: 'Check',
    paymentNotPaidYet: 'Monobank: not paid yet',
    paymentCheckFailed: 'Could not check the payment',
    deleteOrderBtn: 'Delete Order',
    confirmDeleteOrder: 'Are you sure you want to delete this order?',
    closeBtn: 'Close',
    totalAmountLabel: 'Total Amount',
    itemsCountSuffix: 'pcs',
    cityLabel: 'City',
    warehouseLabel: 'Warehouse',
    phoneLabel: 'Phone',
    thDate: 'DATE',
    thDelivery: 'DELIVERY',
    btnPrevious: 'Previous',
    btnNext: 'Next',
    pageLabel: 'Page',
    pageOf: 'of',
    carrierLabel: 'Carrier',
    notGeneratedText: 'Not generated',
    currentStatusLabel: 'Current Status:',
    changeStatusLabel: 'Change status:',
    customerDetailsTitle: 'Customer Details',
    nameLabel: 'Name:',
    deliveryTitle: 'Delivery & Shipping',
    colorLabel: 'Color',
    sizeLabel: 'Size',
    quantityLabel: 'Quantity',
    uniqueVariantsSuffix: 'unique variants',
    deletingText: 'Deleting…',
    enterTtnPlaceholder: 'Enter TTN or click Create',
    createBtn: 'Create',
    saveBtn: 'Save',

    storageTitle: 'Storage',
    storageSubtitleItems: 'items across',
    storageSubtitleCategories: 'categories',
    addProductBtn: 'Add product',
    newProduct: 'New product',
    draftStatus: 'Draft',
    publishToTelegramBtn: 'Publish to Telegram',
    saveChangesBtn: 'Save changes',
    detailsSection: 'Details',
    productNameLabel: 'Product name',
    productNamePlaceholder: 'e.g. Wool Overcoat, Leather Belt, Wool Beanie',
    categoryLabel: 'Category',
    brandLabel: 'Brand',
    searchOrAddBrand: 'Search or add a brand…',
    addBrandOption: 'Add brand',
    variantBuilderTitle: 'Size & Color Matrix',
    variantBuilderSubtitle: 'Choose variant options and set initial stocks',
    productTypeLabel: 'Product type',
    sizeModeLabel: 'Size scale',
    sizesSectionTitle: 'Sizes',
    colorsSectionTitle: 'Colors',
    stockPerSizeTitle: 'Stock per size',
    bulkStockPlaceholder: 'Set all...',
    applyBtn: 'Apply',
    addCustomSizeBtn: 'Add custom size',
    addColorBtn: 'Add color',
    customColorModalTitle: 'Add custom color',
    customColorModalDesc: 'Drag the color picker or select a preset color.',
    hexCodeLabel: 'Hex Code',
    colorNameLabel: 'Color name',
    colorNamePlaceholder: 'e.g. Camel, Forest Green, Oat',
    popularPresetsLabel: 'Popular presets',
    summaryTitle: 'Summary',
    summarySubtitle: 'Live preview of the variant matrix that will be generated.',
    noSizesSelected: '— no sizes selected —',
    noColorsSelected: '— no colors selected —',

    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    dashboardSubtitlePrefix: "Here's what's happening at",
    dashboardSubtitleToday: 'today',
    dashboardSubtitleNoName: "Here's what's happening in your store today, {date}.",
    priceFieldLabel: 'Price, ₴',
    uploadImages: 'Upload images',
    uploadHint: 'Click or drag and drop files here',
    uploadDropHere: 'Drop to add',
    uploadMoreImages: 'Click or drag to add more images',
    chartNoSalesTitle: "No sales in this period",
    chartNoSalesHint: "The chart fills in after the first paid order.",
    loginNoAccess: "No access yet? Contact your store admin.",
    loaderVerifying: "Loading…",
    comingSoonBadge: "In development",
    comingSoonPlanned: "What is planned",
    statTodaySales: "Today's Sales",
    statRevenue30d: '30-Day Revenue',
    statOrders: 'Orders',
    statNewCustomers: 'New Customers',
    statVsYesterday: 'vs yesterday',
    statVsLastMonth: 'vs last month',
    latestOrdersTitle: 'Latest orders',
    viewAllBtn: 'View all',
    noOrdersYet: 'No orders yet',
    noOrdersYetSub: 'Orders placed in store will appear here.',
    thPayment: 'PAYMENT',
    thFulfillment: 'FULFILLMENT',
    revenueLast7Days: 'Revenue, last 7 days',
    peakPrefix: 'Peak:',
    paymentStatusPaid: 'Paid',
    paymentStatusPending: 'Pending',
    paymentStatusFailed: 'Failed',
    fulfillmentStatusProcessing: 'Processing',
    fulfillmentStatusShipped: 'Shipped',
    fulfillmentStatusUnfulfilled: 'Unfulfilled',
    fulfillmentStatusDelivered: 'Delivered',

    notificationsTitle: 'Notifications',
    notificationsSubtitle: 'New orders and stock warnings',
    markAllAsReadBtn: 'Mark all as read',
    clearReadBtn: 'Clear read',
    filterAll: 'All',
    filterUnread: 'Unread',
    filterOrders: 'Orders',
    filterInventory: 'Inventory',
    noNotificationsTitle: 'No notifications',
    noNotificationsDesc: 'New orders and stock warnings will appear here.',
    notifNewOrderTitle: 'New order {number}',
    notifNewOrderMessage: '{customer} · {items} items, {total}',
    notifLowStockTitle: 'Low stock: {product}',
    notifOutOfStockTitle: 'Out of stock: {product}',
    notifStockMessage: 'Variant {color} / {size}: {stock} left',
    notifOpenOrder: 'View order',
    notifOpenInventory: 'Open inventory',
    notifLoadFailed: 'Could not load notifications',
    notifDelete: 'Delete notification',
    notifNewCount: 'new',

    analyticsTitle: 'Analytics & Performance',
    analyticsSubtitle: 'Detailed financial analytics, category performance, and delivery geography',
    timeframe7d: '7 days',
    timeframe30d: '30 days',
    timeframe90d: '90 days',
    timeframeYear: 'Year',
    kpiTotalRevenue: 'Total Revenue',
    kpiTotalOrders: 'Total Orders',
    kpiAov: 'Average Order Value (AOV)',
    kpiConversion: 'Fulfillment Rate',
    revenueTrendTitle: 'Revenue Trend',
    salesByCategoryTitle: 'Sales by Category',
    topProductsHeading: 'Top Performing Products',
    deliveryGeographyTitle: 'Delivery Geography',
    unitsSoldSuffix: 'sold',

    smartAssistantTitle: 'Smart Assistant & Automation',
    smartAssistantSubtitle: 'Automated rules, inventory sync jobs, and store workflow triggers',
    activeBadge: 'Active',
    inventoryAuditTitle: 'Inventory Audit',
    inventoryAuditDesc: 'Verify variant stocks against confirmed orders and update low-stock alerts.',
    runAuditBtn: 'Run Audit',
    runningAuditStatus: 'Auditing…',
    auditSuccessMsg: 'Inventory audit finished. Stocks verified.',

    channelSyncTitle: 'Telegram Channel Sync',
    channelSyncDesc: 'Sync latest product availability status to your linked Telegram channel.',
    syncChannelBtn: 'Sync Channel',
    syncingChannelStatus: 'Syncing…',
    channelSyncSuccessMsg: 'Channel catalog synchronized.',

    healthCheckTitle: 'Health Verification',
    healthCheckDesc: 'Test database latency, worker Redis queue, and bot webhook responsiveness.',
    checkHealthBtn: 'Check Health',
    checkingHealthStatus: 'Checking…',
    healthCheckSuccessMsg: 'All systems operational: DB, Bot, API OK.',

    workflowRulesTitle: 'Workflow Rules',
    rulesEnabledOf: 'of',

    ruleOrderNotificationName: 'Instant Order Telegram Notification',
    ruleOrderNotificationDesc: 'Send direct alert to manager Telegram chat when a customer completes checkout.',
    ruleOrderNotificationTrigger: 'On Order Created',

    ruleLowStockName: 'Low Stock Auto-Warning',
    ruleLowStockDesc: 'Trigger low stock warning badge and notification when any variant drops to <= 5 units.',
    ruleLowStockTrigger: 'On Stock <= Threshold',

    ruleChannelDraftName: 'Automatic Channel Post Drafting',
    ruleChannelDraftDesc: 'Prepare ready-to-publish Telegram channel draft whenever a new product is saved in Storage.',
    ruleChannelDraftTrigger: 'On Product Creation',

    ruleRestockCancelName: 'Automatic Inventory Restoration on Cancellation',
    ruleRestockCancelDesc: 'Restock product variant quantity if an order is marked as Cancelled.',
    ruleRestockCancelTrigger: 'On Order Status = CANCELLED',

    telegramBotTitle: 'Telegram Bot',
    telegramBotSubtitle: 'Manage the assistant connected to your store',
    botSettingsBtn: 'Bot settings',
    botStatusTitle: 'Bot status',
    botOnline: 'Online',
    botOffline: 'Offline',
    botHandleLabel: 'Bot handle',
    botUptimeLabel: 'Uptime',
    botMessagesTodayLabel: 'Messages today',
    botActiveChatsLabel: 'Active chats',
    connectedChannelTitle: 'Connected channel',
    subscribersSuffix: 'subscribers',
    channelConnected: 'Connected',
    channelDisconnected: 'Disconnected',
    queueStatusTitle: 'Queue status',
    queuePendingPosts: 'Pending posts',
    queueScheduledToday: 'Scheduled today',
    queueFailedReview: 'Failed (needs review)',
    recentOrderedTitle: 'Recent ordered products',
    recentOrderedSubtitle: 'Latest customer purchases',
    recentOrderedViewAll: 'View all',
    recentOrderedEmpty: 'No recent orders',
    recentOrderedTimePrefix: 'Ordered',

    loginWelcomeTitle: 'Welcome to Admin Panel',
    loginSubtitle: 'Sign in with the account issued by your store admin',
    emailLabel: 'Work email',
    emailPlaceholder: 'admin@atelier.ua',
    passwordLabel: 'Password',
    signInBtn: 'Sign in to Dashboard',
    signingInBtn: 'Signing in...',
    invalidCredentialsMsg: 'Invalid credentials',
    loginFailedMsg: 'Login failed. Please check your email and password.',
  },
};

export type TranslationKey = keyof TranslationDictionary;
