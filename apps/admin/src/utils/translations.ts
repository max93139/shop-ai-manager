export type Language = 'uk' | 'en';

export interface TranslationDictionary {
  // Brand & Sidebar Groups
  adminPanel: string;
  storeOperations: string;
  overview: string;
  catalog: string;
  sales: string;
  automation: string;
  system: string;

  // Nav Items
  dashboard: string;
  analytics: string;
  storage: string;
  inventory: string;
  orders: string;
  customers: string;
  crm: string;
  telegramBot: string;
  channelPublisher: string;
  smartAssistant: string;
  notifications: string;
  settings: string;

  // Header
  searchPlaceholder: string;
  logout: string;
  adminBreadcrumb: string;

  // Settings Page
  storeSettingsTitle: string;
  storeSettingsSubtitle: string;
  saveChanges: string;
  saving: string;
  savedSuccess: string;

  // Settings Tabs
  tabProfile: string;
  tabTelegram: string;
  tabInventory: string;
  tabSecurity: string;

  // Profile Settings Form
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

  // Telegram Settings Form
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

  // Inventory Settings Form
  inventoryTitle: string;
  inventoryDesc: string;
  lowStockThresholdLabel: string;
  lowStockDesc: string;
  soundAlertsLabel: string;
  soundAlertsDesc: string;
  autoArchiveLabel: string;
  autoArchiveDesc: string;
  saveInventoryBtn: string;

  // Security Tab
  securityTitle: string;
  securityDesc: string;
  currentPasswordLabel: string;
  newPasswordLabel: string;
  confirmPasswordLabel: string;
  updatePasswordBtn: string;
  passwordUpdatedSuccess: string;
  passwordMinLength: string;
  passwordsMismatch: string;

  // Inventory / Products Page
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

  // Products Table Columns
  thProduct: string;
  thCategory: string;
  thBrand: string;
  thColor: string;
  thSize: string;
  thStock: string;
  thPrice: string;
  thStatus: string;
  thActions: string;

  // Products Table Actions & Tooltips
  actionDelete: string;
  actionCancel: string;
  deleteTooltip: string;
  decreaseStock: string;
  increaseStock: string;
  clickToEditStock: string;
  clickToEditPrice: string;
  noProductsFound: string;
  noProductsFoundSub: string;

  // Pagination
  showingPrefix: string;
  showingOf: string;

  // Orders Page
  ordersTitle: string;
  ordersSubtitle: string;
  totalOrdersBadge: string;
  refreshBtn: string;
  exportCsvBtn: string;

  // Orders Stats
  totalRevenueTitle: string;
  fromAllRecordedSales: string;
  activeOrdersTitle: string;
  inFulfillmentSuffix: string;
  pendingActionTitle: string;
  awaitingConfirmationSubtitle: string;
  archivedTitle: string;
  deliveredSuffix: string;
  cancelledSuffix: string;

  // Orders Filter Tabs
  tabActiveOrders: string;
  tabPending: string;
  tabPaid: string;
  tabProcessing: string;
  tabShipped: string;
  tabArchive: string;
  tabAllOrders: string;
  searchOrdersPlaceholder: string;

  // Orders Table Columns & Statuses
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

  // Order Details Modal
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

  // Storage Page
  storageTitle: string;
  storageSubtitleItems: string;
  storageSubtitleCategories: string;
  addProductBtn: string;

  // Dashboard Page
  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;
  dashboardSubtitlePrefix: string;
  dashboardSubtitleToday: string;
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

  // Notifications Page
  notificationsTitle: string;
  notificationsSubtitle: string;
  markAllAsReadBtn: string;
  clearReadBtn: string;
  filterAll: string;
  filterUnread: string;
  filterOrders: string;
  filterInventory: string;
  filterSystem: string;
  noNotificationsTitle: string;
  noNotificationsDesc: string;

  // Analytics Page
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
}

export const translations: Record<Language, TranslationDictionary> = {
  uk: {
    // Brand & Sidebar Groups
    adminPanel: 'Панель керування',
    storeOperations: 'Керування магазином',
    overview: 'Огляд',
    catalog: 'Каталог',
    sales: 'Продажі',
    automation: 'Автоматизація',
    system: 'Система',

    // Nav Items
    dashboard: 'Дашборд',
    analytics: 'Аналітика',
    storage: 'Склад',
    inventory: 'Товари та залишки',
    orders: 'Замовлення',
    customers: 'Клієнти',
    crm: 'CRM',
    telegramBot: 'Telegram-бот',
    channelPublisher: 'Публікація в канал',
    smartAssistant: 'Розумний асистент',
    notifications: 'Сповіщення',
    settings: 'Налаштування',

    // Header
    searchPlaceholder: 'Пошук товарів, замовлень...',
    logout: 'Вийти',
    adminBreadcrumb: 'Адмін',

    // Settings Page
    storeSettingsTitle: 'Налаштування магазину',
    storeSettingsSubtitle: 'Конфігурація магазину, автоматизація Telegram, мова інтерфейсу та безпека',
    saveChanges: 'Зберегти зміни',
    saving: 'Збереження...',
    savedSuccess: 'Налаштування успішно збережено!',

    // Settings Tabs
    tabProfile: 'Профіль магазину',
    tabTelegram: 'Telegram та канали',
    tabInventory: 'Залишки та сповіщення',
    tabSecurity: 'Безпека та пароль',

    // Profile Settings Form
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

    // Telegram Settings Form
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

    // Inventory Settings Form
    inventoryTitle: 'Залишки та пороги сповіщень',
    inventoryDesc: 'Керування тригерами закінчення товару та звуковими сповіщеннями',
    lowStockThresholdLabel: 'Поріг низького залишку (од.)',
    lowStockDesc: 'Товари з такою або меншою кількістю позначатимуться як "Низький залишок"',
    soundAlertsLabel: 'Звукові сповіщення в браузері',
    soundAlertsDesc: 'Відтворювати звук при появі нового замовлення',
    autoArchiveLabel: 'Автоархівація виконаних замовлень',
    autoArchiveDesc: 'Автоматично приховувати замовлення зі статусом "Доставлено" через 30 днів',
    saveInventoryBtn: 'Зберегти налаштування складу',

    // Security Tab
    securityTitle: 'Безпека облікового запису',
    securityDesc: 'Зміна пароля доступу до адміністративної панелі',
    currentPasswordLabel: 'Поточний пароль',
    newPasswordLabel: 'Новий пароль',
    confirmPasswordLabel: 'Підтвердження нового пароля',
    updatePasswordBtn: 'Оновити пароль адміністратора',
    passwordUpdatedSuccess: 'Пароль адміністратора успішно оновлено',
    passwordMinLength: 'Новий пароль має містити щонайменше 8 символів',
    passwordsMismatch: 'Паролі не співпадають',

    // Inventory / Products Page
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

    // Products Table Columns
    thProduct: 'ТОВАР',
    thCategory: 'КАТЕГОРІЯ',
    thBrand: 'БРЕНД',
    thColor: 'КОЛІР',
    thSize: 'РОЗМІР',
    thStock: 'КІЛЬКІСТЬ',
    thPrice: 'ЦІНА',
    thStatus: 'СТАТУС',
    thActions: 'ДІЇ',

    // Products Table Actions & Tooltips
    actionDelete: 'Видалити',
    actionCancel: 'Скасувати',
    deleteTooltip: 'Видалити',
    decreaseStock: 'Зменшити залишок',
    increaseStock: 'Збільшити залишок',
    clickToEditStock: 'Натисніть для зміни залишку',
    clickToEditPrice: 'Натисніть для зміни ціни',
    noProductsFound: 'Товарів не знайдено за заданими фільтрами',
    noProductsFoundSub: 'Спробуйте змінити фільтри або пошуковий запит.',

    // Pagination
    showingPrefix: 'Показано',
    showingOf: 'з',

    // Orders Page
    ordersTitle: 'Замовлення',
    ordersSubtitle: 'Керування замовленнями клієнтів, адресами доставки та статусами виконання.',
    totalOrdersBadge: 'всього',
    refreshBtn: 'Оновити',
    exportCsvBtn: 'Експорт CSV',

    // Orders Stats
    totalRevenueTitle: 'Загальний виторг',
    fromAllRecordedSales: 'З усіх оформлених продажів',
    activeOrdersTitle: 'Активні замовлення',
    inFulfillmentSuffix: 'у виконанні',
    pendingActionTitle: 'Очікують підтвердження',
    awaitingConfirmationSubtitle: 'Очікують обробки',
    archivedTitle: 'Архів',
    deliveredSuffix: 'доставлено',
    cancelledSuffix: 'скасовано',

    // Orders Filter Tabs
    tabActiveOrders: 'Активні замовлення',
    tabPending: 'Очікують',
    tabPaid: 'Оплачені',
    tabProcessing: 'В обробці',
    tabShipped: 'Відправлені',
    tabArchive: 'Архів',
    tabAllOrders: 'Всі замовлення',
    searchOrdersPlaceholder: 'Пошук замовлень за клієнтом, телефоном або ТТН...',

    // Orders Table Columns & Statuses
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
    thTrackingTtn: 'ТТН',

    viewDetailsBtn: 'Деталі',
    noOrdersFound: 'Замовлень не знайдено',
    noOrdersFoundSub: 'Спробуйте вибрати інший статус або змінити пошуковий запит.',

    // Order Details Modal
    orderDetailsTitle: 'Деталі замовлення',
    customerInfoSection: 'Інформація про клієнта',
    deliverySection: 'Доставка Нова Пошта',
    orderedItemsSection: 'Замовлені товари',
    orderStatusLabel: 'Статус замовлення',
    ttnLabel: 'Номер ТТН (Експрес-накладна)',
    saveTtnBtn: 'Зберегти ТТН',
    savingTtn: 'Збереження ТТН...',
    trackOnNovaPoshta: 'Відстежити на сайті Нової Пошти',
    generateTtnBtn: 'Згенерувати ТТН',
    deleteOrderBtn: 'Видалити замовлення',
    confirmDeleteOrder: 'Ви впевнені, що хочете видалити це замовлення?',
    closeBtn: 'Закрити',
    totalAmountLabel: 'Загальна сума',
    itemsCountSuffix: 'шт.',
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
    customerDetailsTitle: 'Дані клієнта',
    nameLabel: 'ПІБ:',
    deliveryTitle: 'Доставка та логістика',
    colorLabel: 'Колір',
    sizeLabel: 'Розмір',
    quantityLabel: 'Кількість',
    uniqueVariantsSuffix: 'унікальних позицій',
    deletingText: 'Видалення…',
    enterTtnPlaceholder: 'Введіть ТТН або натисніть Створити',
    createBtn: 'Створити',
    saveBtn: 'Зберегти',

    // Storage Page
    storageTitle: 'Склад',
    storageSubtitleItems: 'товарів у',
    storageSubtitleCategories: 'категоріях',
    addProductBtn: 'Додати товар',

    // Dashboard Page
    goodMorning: 'Доброго ранку',
    goodAfternoon: 'Доброго дня',
    goodEvening: 'Доброго вечора',
    dashboardSubtitlePrefix: 'Ось що відбувається в магазині',
    dashboardSubtitleToday: 'сьогодні',
    statTodaySales: 'Сьогоднішні продажі',
    statRevenue30d: 'Виторг за 30 днів',
    statOrders: 'Замовлення',
    statNewCustomers: 'Нові клієнти',
    statVsYesterday: 'порівняно з вчора',
    statVsLastMonth: 'порівняно з минулим місяцем',
    latestOrdersTitle: 'Останні замовлення',
    viewAllBtn: 'Переглянути всі',
    noOrdersYet: 'Замовлень ще немає',
    noOrdersYetSub: 'Оформлені в магазині замовлення відображатимуться тут.',
    thPayment: 'ОПЛАТА',
    thFulfillment: 'ВИКОНАННЯ',
    revenueLast7Days: 'Виторг за останні 7 днів',

    // Notifications Page
    notificationsTitle: 'Сповіщення',
    notificationsSubtitle: 'Системні події, зміни статусів замовлень та попередження про залишки',
    markAllAsReadBtn: 'Позначити всі як прочитані',
    clearReadBtn: 'Очистити прочитані',
    filterAll: 'Всі',
    filterUnread: 'Непрочитані',
    filterOrders: 'Замовлення',
    filterInventory: 'Склад',
    filterSystem: 'Система',
    noNotificationsTitle: 'Немає сповіщень',
    noNotificationsDesc: 'Усі нові системні події зʼявлятимуться тут.',

    // Analytics Page
    analyticsTitle: 'Аналітика та показники',
    analyticsSubtitle: 'Детальна фінансова аналітика, ефективність категорій та географія замовлень',
    timeframe7d: '7 днів',
    timeframe30d: '30 днів',
    timeframe90d: '90 днів',
    timeframeYear: 'Рік',
    kpiTotalRevenue: 'Загальний виторг',
    kpiTotalOrders: 'Кількість замовлень',
    kpiAov: 'Середній чек (AOV)',
    kpiConversion: 'Конверсія виконання',
    revenueTrendTitle: 'Динаміка виторгу',
    salesByCategoryTitle: 'Продажі за категоріями',
    topProductsHeading: 'Топ товарів за виторгом',
    deliveryGeographyTitle: 'Географія замовлень',
    unitsSoldSuffix: 'продано',
  },
  en: {
    // Brand & Sidebar Groups
    adminPanel: 'Admin Panel',
    storeOperations: 'Store Operations',
    overview: 'Overview',
    catalog: 'Catalog',
    sales: 'Sales',
    automation: 'Automation',
    system: 'System',

    // Nav Items
    dashboard: 'Dashboard',
    analytics: 'Analytics',
    storage: 'Storage',
    inventory: 'Inventory',
    orders: 'Orders',
    customers: 'Customers',
    crm: 'CRM',
    telegramBot: 'Telegram Bot',
    channelPublisher: 'Channel Publisher',
    smartAssistant: 'Smart Assistant',
    notifications: 'Notifications',
    settings: 'Settings',

    // Header
    searchPlaceholder: 'Search products, orders...',
    logout: 'Log out',
    adminBreadcrumb: 'Admin',

    // Settings Page
    storeSettingsTitle: 'Store Settings',
    storeSettingsSubtitle: 'Store configuration, Telegram channel automation, interface language, and security',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    savedSuccess: 'Settings saved successfully!',

    // Settings Tabs
    tabProfile: 'Store Profile',
    tabTelegram: 'Telegram & Channels',
    tabInventory: 'Inventory & Alerts',
    tabSecurity: 'Security & Profile',

    // Profile Settings Form
    generalInfoTitle: 'General Store Information',
    generalInfoDesc: 'Brand details visible to customers in Telegram receipts and notifications',
    storeNameLabel: 'Store Name',
    supportPhoneLabel: 'Support Phone',
    supportEmailLabel: 'Support Email',
    currencyLabel: 'Default Store Currency',
    timezoneLabel: 'Store Timezone',
    languageLabel: 'Interface Language',
    langUk: 'Українська (UK)',
    langEn: 'English (EN)',
    saveProfileBtn: 'Save Profile Settings',

    // Telegram Settings Form
    telegramTitle: 'Telegram Channel & Bot Automation',
    telegramDesc: 'Configure automated publishing and manager alert notifications',
    telegramChannelLabel: 'Telegram Channel Username',
    autoPublishLabel: 'Auto-publish new products',
    autoPublishDesc: 'Broadcast new products to channel with photo upon creation',
    adminIdLabel: 'Telegram Admin ID',
    adminIdDesc: 'Receive instant notifications on order status changes directly',
    botTokenStatusLabel: 'Bot Token Status',
    botTokenConfigured: 'Configured via .env (Active)',
    saveTelegramBtn: 'Save Telegram Settings',

    // Inventory Settings Form
    inventoryTitle: 'Inventory Triggers & Alerts',
    inventoryDesc: 'Set inventory stock thresholds and operational preferences',
    lowStockThresholdLabel: 'Low Stock Threshold (Units)',
    lowStockDesc: 'Items at or below this count will show the "Low Stock" badge',
    soundAlertsLabel: 'Browser Sound Alerts',
    soundAlertsDesc: 'Play sound when high-priority notifications arrive',
    autoArchiveLabel: 'Auto-archive Completed Orders',
    autoArchiveDesc: 'Automatically archive orders marked "Delivered" after 30 days',
    saveInventoryBtn: 'Save Inventory Settings',

    // Security Tab
    securityTitle: 'Security & Access Credentials',
    securityDesc: 'Update your administrator password for this dashboard',
    currentPasswordLabel: 'Current Password',
    newPasswordLabel: 'New Password',
    confirmPasswordLabel: 'Confirm New Password',
    updatePasswordBtn: 'Update Admin Password',
    passwordUpdatedSuccess: 'Admin password updated successfully',
    passwordMinLength: 'New password must be at least 8 characters long',
    passwordsMismatch: 'Passwords do not match',

    // Inventory / Products Page
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

    // Products Table Columns
    thProduct: 'PRODUCT',
    thCategory: 'CATEGORY',
    thBrand: 'BRAND',
    thColor: 'COLOR',
    thSize: 'SIZE',
    thStock: 'STOCK',
    thPrice: 'PRICE',
    thStatus: 'STATUS',
    thActions: 'ACTIONS',

    // Products Table Actions & Tooltips
    actionDelete: 'Delete',
    actionCancel: 'Cancel',
    deleteTooltip: 'Delete',
    decreaseStock: 'Decrease stock',
    increaseStock: 'Increase stock',
    clickToEditStock: 'Click to edit stock',
    clickToEditPrice: 'Click to edit price',
    noProductsFound: 'No products found matching filters',
    noProductsFoundSub: 'Try adjusting your filters or search query.',

    // Pagination
    showingPrefix: 'Showing',
    showingOf: 'of',

    // Orders Page
    ordersTitle: 'Orders',
    ordersSubtitle: 'Manage all incoming customer orders, delivery addresses, and fulfillment status.',
    totalOrdersBadge: 'total',
    refreshBtn: 'Refresh',
    exportCsvBtn: 'Export CSV',

    // Orders Stats
    totalRevenueTitle: 'Total Revenue',
    fromAllRecordedSales: 'From all recorded sales',
    activeOrdersTitle: 'Active Orders',
    inFulfillmentSuffix: 'in fulfillment',
    pendingActionTitle: 'Pending Action',
    awaitingConfirmationSubtitle: 'Awaiting confirmation',
    archivedTitle: 'Archived',
    deliveredSuffix: 'delivered',
    cancelledSuffix: 'cancelled',

    // Orders Filter Tabs
    tabActiveOrders: 'Active orders',
    tabPending: 'Pending',
    tabPaid: 'Paid',
    tabProcessing: 'Processing',
    tabShipped: 'Shipped',
    tabArchive: 'Archive',
    tabAllOrders: 'All orders',
    searchOrdersPlaceholder: 'Search orders by customer, phone, or TTN...',

    // Orders Table Columns & Statuses
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

    // Order Details Modal
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

    // Storage Page
    storageTitle: 'Storage',
    storageSubtitleItems: 'items across',
    storageSubtitleCategories: 'categories',
    addProductBtn: 'Add product',

    // Dashboard Page
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    dashboardSubtitlePrefix: "Here's what's happening at",
    dashboardSubtitleToday: 'today',
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

    // Notifications Page
    notificationsTitle: 'Notifications',
    notificationsSubtitle: 'System events, order status updates, and inventory warnings',
    markAllAsReadBtn: 'Mark all as read',
    clearReadBtn: 'Clear read',
    filterAll: 'All',
    filterUnread: 'Unread',
    filterOrders: 'Orders',
    filterInventory: 'Inventory',
    filterSystem: 'System',
    noNotificationsTitle: 'No notifications',
    noNotificationsDesc: 'All new system events will appear here.',

    // Analytics Page
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
  },
};

export type TranslationKey = keyof TranslationDictionary;
