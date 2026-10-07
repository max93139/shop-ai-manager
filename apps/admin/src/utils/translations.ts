export type Language = 'uk' | 'en';

export const translations = {
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
  },
} as const;

export type TranslationKey = keyof typeof translations.uk;
