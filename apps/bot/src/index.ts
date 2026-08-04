import { Bot, session, Context, SessionFlavor, Keyboard, InlineKeyboard } from 'grammy';
import dotenv from 'dotenv';
import { prisma } from '@shop-ai/database';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN || '';

if (!token) {
  console.warn('Warning: TELEGRAM_BOT_TOKEN is not configured in .env');
}

export interface CartItem {
  variantId: string;
  productName: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

export interface CheckoutData {
  fullName?: string;
  phone?: string;
  city?: string;
  postOffice?: string;
}

export type CheckoutStep =
  | 'IDLE'
  | 'AWAITING_FULL_NAME'
  | 'AWAITING_PHONE'
  | 'AWAITING_CITY'
  | 'AWAITING_POST_OFFICE'
  | 'AWAITING_CONFIRMATION';

export interface SessionData {
  cart: CartItem[];
  checkoutStep: CheckoutStep;
  checkoutData: CheckoutData;
  quickOrderVariantId?: string;
}

export type MyContext = Context & SessionFlavor<SessionData>;

const bot = new Bot<MyContext>(token);

// ─── Session Middleware ───
bot.use(
  session({
    initial: (): SessionData => ({
      cart: [],
      checkoutStep: 'IDLE',
      checkoutData: {},
    }),
  }),
);

// ─── Helper: Main Menu Keyboard ───
function getMainMenuKeyboard() {
  return new Keyboard()
    .text('🛍 Каталог товарів')
    .text('🛒 Моій кошик')
    .row()
    .text('📦 Мої замовлення')
    .text('ℹ️ Допомога')
    .resized();
}

// ─── Helper: Ensure User Exists in DB ───
async function ensureDbUser(ctx: MyContext) {
  if (!ctx.from) return null;
  const telegramId = BigInt(ctx.from.id);
  const name = [ctx.from.first_name, ctx.from.last_name].filter(Boolean).join(' ') || 'Telegram User';

  return prisma.user.upsert({
    where: { telegramId },
    update: { name },
    create: {
      telegramId,
      name,
      role: 'CUSTOMER',
    },
  });
}

// ─── /start Command ───
bot.command('start', async (ctx) => {
  await ensureDbUser(ctx);
  ctx.session.checkoutStep = 'IDLE';

  await ctx.reply(
    `👋 **Вітаємо в нашому магазині!**\n\n` +
      `Тут ви можете переглянути доступні товари та оформити замовлення прямо у Telegram.\n\n` +
      `Оберіть необхідний розділ у меню нижче:`,
    {
      parse_mode: 'Markdown',
      reply_markup: getMainMenuKeyboard(),
    },
  );
});

// ─── 🛍 Catalog Command / Button ───
bot.hears(['🛍 Каталог товарів', '/catalog'], async (ctx) => {
  try {
    const products = await prisma.product.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        variants: true,
      },
    });

    if (products.length === 0) {
      return ctx.reply('Наразі товари відсутні у каталозі.');
    }

    await ctx.reply(`📦 **Каталог товарів** (знайдено ${products.length}):\nОберіть товар для замовлення:`, {
      parse_mode: 'Markdown',
    });

    for (const product of products) {
      const firstVariant = product.variants[0];
      if (!firstVariant) continue;

      const price = Number(firstVariant.price);
      const sizes = Array.from(new Set(product.variants.map((v) => v.size))).join(', ');
      const colors = Array.from(new Set(product.variants.map((v) => v.color))).join(', ');
      const image = product.images?.[0];

      let caption = `🛍 **${product.name}**\n`;
      caption += `📂 Категорія: ${product.category?.name || 'Одяг'}\n`;
      if (sizes) caption += `📏 Розміри: ${sizes}\n`;
      if (colors) caption += `🎨 Кольори: ${colors}\n`;
      caption += `💰 Ціна: **$${price}**\n`;

      const keyboard = new InlineKeyboard();
      product.variants.forEach((v) => {
        if (v.stock > 0) {
          keyboard.text(`🛒 Купити (${v.color} / ${v.size})`, `buy_variant_${v.id}`).row();
        }
      });

      if (image && (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:'))) {
        try {
          if (image.startsWith('data:')) {
            await ctx.reply(caption, { parse_mode: 'Markdown', reply_markup: keyboard });
          } else {
            await ctx.replyWithPhoto(image, { caption, parse_mode: 'Markdown', reply_markup: keyboard });
          }
        } catch {
          await ctx.reply(caption, { parse_mode: 'Markdown', reply_markup: keyboard });
        }
      } else {
        await ctx.reply(caption, { parse_mode: 'Markdown', reply_markup: keyboard });
      }
    }
  } catch (err) {
    console.error('Catalog error:', err);
    await ctx.reply('Помилка завантаження каталогу. Спробуйте пізніше.');
  }
});

// ─── Inline Button: Buy Variant ───
bot.callbackQuery(/^buy_variant_(.+)$/, async (ctx) => {
  const variantId = ctx.match[1];
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: { product: true },
  });

  if (!variant || variant.stock <= 0) {
    return ctx.answerCallbackQuery({ text: 'На жаль, цей варіант товару закінчився.' });
  }

  // Add to cart
  const existing = ctx.session.cart.find((c) => c.variantId === variantId);
  if (existing) {
    existing.quantity += 1;
  } else {
    ctx.session.cart.push({
      variantId,
      productName: variant.product.name,
      size: variant.size,
      color: variant.color,
      price: Number(variant.price),
      quantity: 1,
    });
  }

  await ctx.answerCallbackQuery({ text: `Додано в кошик: ${variant.product.name} (${variant.color}/${variant.size})` });

  const keyboard = new InlineKeyboard()
    .text('📝 Оформити замовлення зараз', 'checkout_start')
    .row()
    .text('🛍 Продовжити покупки', 'continue_shopping');

  await ctx.reply(
    `✅ **Товар додано у ваш кошик!**\n\n` +
      `📦 **${variant.product.name}**\n` +
      `🎨 Колір: ${variant.color} | 📏 Розмір: ${variant.size}\n` +
      `💰 Ціна: $${variant.price}`,
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  );
});

bot.callbackQuery('continue_shopping', async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply('Оберіть новий товар з каталогу:', { reply_markup: getMainMenuKeyboard() });
});

// ─── 🛒 Cart View ───
bot.hears(['🛒 Моій кошик', '/cart'], async (ctx) => {
  await showCart(ctx);
});

async function showCart(ctx: MyContext) {
  const cart = ctx.session.cart;
  if (cart.length === 0) {
    return ctx.reply('🛒 Ваш кошик порожній.\n\nСкористайтеся кнопкою 🛍 **Каталог товарів**, щоб обрати товари.', {
      reply_markup: getMainMenuKeyboard(),
    });
  }

  let text = `🛒 **Ваш кошик:**\n\n`;
  let total = 0;

  cart.forEach((item, idx) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    text += `${idx + 1}. **${item.productName}** (${item.color} / ${item.size})\n`;
    text += `   Кількість: ${item.quantity} шт × $${item.price} = **$${itemTotal}**\n\n`;
  });

  text += `💰 **Разом до сплати: $${total.toFixed(2)}**`;

  const keyboard = new InlineKeyboard()
    .text('📝 Оформити замовлення', 'checkout_start')
    .row()
    .text('🗑 Очистити кошик', 'clear_cart');

  await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
}

bot.callbackQuery('clear_cart', async (ctx) => {
  ctx.session.cart = [];
  await ctx.answerCallbackQuery({ text: 'Кошик очищено' });
  await ctx.reply('Ваш кошик порожній.', { reply_markup: getMainMenuKeyboard() });
});

// ─── 📝 Step-by-Step Checkout Wizard ───
bot.callbackQuery('checkout_start', async (ctx) => {
  await ctx.answerCallbackQuery();
  if (ctx.session.cart.length === 0) {
    return ctx.reply('Ваш кошик порожній. Спочатку додайте товари з каталогу.');
  }

  ctx.session.checkoutStep = 'AWAITING_FULL_NAME';
  ctx.session.checkoutData = {};

  await ctx.reply(
    `📝 **Оформлення замовлення (Крок 1/4)**\n\n` +
      `Будь ласка, введіть ваше **ПІБ** (Прізвище, Ім'я, По батькові):\n` +
      `_Приклад: Іванов Іван Іванович_`,
    { parse_mode: 'Markdown' },
  );
});

// ─── Text Handler for Checkout Wizard ───
bot.on('message:text', async (ctx) => {
  const step = ctx.session.checkoutStep;
  const text = ctx.message.text.trim();

  // If selecting main menu buttons
  if (['🛍 Каталог товарів', '🛒 Моій кошик', '📦 Мої замовлення', 'ℹ️ Допомога'].includes(text)) {
    ctx.session.checkoutStep = 'IDLE';
  }

  if (step === 'AWAITING_FULL_NAME') {
    if (text.length < 3) {
      return ctx.reply('Будь ласка, введіть повне ПІБ (щонайменше 3 символи):');
    }
    ctx.session.checkoutData.fullName = text;
    ctx.session.checkoutStep = 'AWAITING_PHONE';

    const phoneKeyboard = new Keyboard()
      .requestContact('📱 Надіслати мій номер телефону')
      .resized()
      .oneTime();

    return ctx.reply(
      `📱 **Оформлення замовлення (Крок 2/4)**\n\n` +
        `Надішліть ваш **номер телефону** (натисніть кнопку нижче або введіть вручну у форматі +380...):`,
      {
        parse_mode: 'Markdown',
        reply_markup: phoneKeyboard,
      },
    );
  }

  if (step === 'AWAITING_PHONE') {
    ctx.session.checkoutData.phone = text;
    ctx.session.checkoutStep = 'AWAITING_CITY';

    return ctx.reply(
      `🏙 **Оформлення замовлення (Крок 3/4)**\n\n` +
        `Введіть ваше **Місто** для доставки:\n` +
        `_Приклад: Київ, Львів, Одеса_`,
      {
        parse_mode: 'Markdown',
        reply_markup: getMainMenuKeyboard(),
      },
    );
  }

  if (step === 'AWAITING_CITY') {
    ctx.session.checkoutData.city = text;
    ctx.session.checkoutStep = 'AWAITING_POST_OFFICE';

    return ctx.reply(
      `🚚 **Оформлення замовлення (Крок 4/4)**\n\n` +
        `Введіть **номер або адресу відділення Нової Пошти**:\n` +
        `_Приклад: Відділення №15 (вул. Хрещатик, 22)_`,
      { parse_mode: 'Markdown' },
    );
  }

  if (step === 'AWAITING_POST_OFFICE') {
    ctx.session.checkoutData.postOffice = text;
    ctx.session.checkoutStep = 'AWAITING_CONFIRMATION';

    await sendOrderConfirmation(ctx);
    return;
  }

  if (text === '📦 Мої замовлення') {
    await showMyOrders(ctx);
    return;
  }

  if (text === 'ℹ️ Допомога') {
    await ctx.reply(
      `ℹ️ **Допомога та підтримка**\n\n` +
        `• Для перегляду товарів виберіть 🛍 **Каталог товарів**\n` +
        `• Для оформлення замовлення додайте товар у кошик та дотримуйтесь інструкцій бота\n` +
        `• Якщо у вас виникли запитання, напишіть менеджеру сайту.`,
      { parse_mode: 'Markdown', reply_markup: getMainMenuKeyboard() },
    );
    return;
  }
});

// ─── Contact Handler for Phone Share ───
bot.on('message:contact', async (ctx) => {
  if (ctx.session.checkoutStep === 'AWAITING_PHONE') {
    const contact = ctx.message.contact;
    ctx.session.checkoutData.phone = contact.phone_number.startsWith('+')
      ? contact.phone_number
      : `+${contact.phone_number}`;

    ctx.session.checkoutStep = 'AWAITING_CITY';

    await ctx.reply(
      `🏙 **Оформлення замовлення (Крок 3/4)**\n\n` +
        `Введіть ваше **Місто** для доставки:\n` +
        `_Приклад: Київ, Львів, Одеса_`,
      {
        parse_mode: 'Markdown',
        reply_markup: getMainMenuKeyboard(),
      },
    );
  }
});

// ─── Helper: Send Order Confirmation Summary ───
async function sendOrderConfirmation(ctx: MyContext) {
  const { cart, checkoutData } = ctx.session;
  let total = 0;

  let itemsSummary = '';
  cart.forEach((item, idx) => {
    const sum = item.price * item.quantity;
    total += sum;
    itemsSummary += `${idx + 1}. ${item.productName} (${item.color} / ${item.size}) x${item.quantity} — $${sum}\n`;
  });

  const text =
    `📋 **ПЕРЕВІРКА ЗАМОВЛЕННЯ**\n\n` +
    `🛍 **Замовлені товари**:\n${itemsSummary}\n` +
    `👤 **ПІБ замовника**: ${checkoutData.fullName || '—'}\n` +
    `📱 **Номер телефону**: ${checkoutData.phone || '—'}\n` +
    `🏙 **Місто**: ${checkoutData.city || '—'}\n` +
    `🚚 **Відділення пошти**: ${checkoutData.postOffice || '—'}\n\n` +
    `💰 **Загальна сума**: **$${total.toFixed(2)}**\n\n` +
    `Все вірно? Натисніть **Підтвердити** для оформлення:`;

  const keyboard = new InlineKeyboard()
    .text('✅ Підтвердити замовлення', 'confirm_order_final')
    .row()
    .text('❌ Скасувати', 'cancel_order_final');

  await ctx.reply(text, {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  });
}

// ─── Callback: Final Order Confirmation ───
bot.callbackQuery('confirm_order_final', async (ctx) => {
  await ctx.answerCallbackQuery();

  const { cart, checkoutData } = ctx.session;
  if (cart.length === 0) {
    return ctx.reply('Кошик порожній.');
  }

  try {
    const user = await ensureDbUser(ctx);
    if (!user) return ctx.reply('Помилка авторизації.');

    let totalAmount = 0;
    cart.forEach((i) => (totalAmount += i.price * i.quantity));

    // 1. Create Order in Database
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: 'PENDING',
        totalAmount,
        fullName: checkoutData.fullName,
        phone: checkoutData.phone,
        city: checkoutData.city,
        postOffice: checkoutData.postOffice,
        items: {
          create: cart.map((i) => ({
            variantId: i.variantId,
            quantity: i.quantity,
            price: i.price,
          })),
        },
      },
    });

    // 2. Decrement variant stock
    for (const item of cart) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      }).catch(() => null);
    }

    // Reset session
    ctx.session.cart = [];
    ctx.session.checkoutStep = 'IDLE';
    ctx.session.checkoutData = {};

    const shortOrderNum = order.id.slice(0, 8).toUpperCase();

    await ctx.reply(
      `🎉 **Дякуємо! Ваше замовлення #${shortOrderNum} успішно створено!**\n\n` +
        `👤 **Отримувач**: ${checkoutData.fullName}\n` +
        `📱 **Телефон**: ${checkoutData.phone}\n` +
        `🏙 **Місто**: ${checkoutData.city}\n` +
        `🚚 **Доставка**: ${checkoutData.postOffice}\n` +
        `💰 **Сума**: $${totalAmount.toFixed(2)}\n\n` +
        `Наш менеджер зв'яжеться з вами найближчим часом для підтвердження.`,
      {
        parse_mode: 'Markdown',
        reply_markup: getMainMenuKeyboard(),
      },
    );
  } catch (err) {
    console.error('Error creating order from Telegram Bot:', err);
    await ctx.reply('Помилка під час оформлення замовлення. Спробуйте пізніше.');
  }
});

bot.callbackQuery('cancel_order_final', async (ctx) => {
  ctx.session.checkoutStep = 'IDLE';
  await ctx.answerCallbackQuery({ text: 'Замовлення скасовано' });
  await ctx.reply('Замовлення скасовано.', { reply_markup: getMainMenuKeyboard() });
});

// ─── 📦 My Orders View ───
async function showMyOrders(ctx: MyContext) {
  if (!ctx.from) return;
  const user = await prisma.user.findUnique({
    where: { telegramId: BigInt(ctx.from.id) },
  });

  if (!user) {
    return ctx.reply('У вас ще немає створених замовлень.');
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      items: {
        include: {
          variant: {
            include: { product: true },
          },
        },
      },
    },
  });

  if (orders.length === 0) {
    return ctx.reply('У вас ще немає замовлень.');
  }

  let text = `📦 **Ваші останні замовлення:**\n\n`;

  orders.forEach((ord) => {
    const shortNum = ord.id.slice(0, 8).toUpperCase();
    const dateStr = new Date(ord.createdAt).toLocaleDateString('uk-UA');
    text += `🔹 **Замовлення #${shortNum}** від ${dateStr}\n`;
    text += `   Статус: ${ord.status}\n`;
    text += `   Сума: **$${ord.totalAmount}**\n`;
    if (ord.city && ord.postOffice) {
      text += `   Доставка: ${ord.city}, ${ord.postOffice}\n`;
    }
    text += `   Товари:\n`;
    ord.items.forEach((it) => {
      text += `   • ${it.variant?.product?.name || 'Товар'} (${it.variant?.color}/${it.variant?.size}) x${it.quantity}\n`;
    });
    text += `\n`;
  });

  await ctx.reply(text, { parse_mode: 'Markdown' });
}

// ─── Launch Bot ───
if (token) {
  console.log('🤖 Telegram Store Bot process started...');
  bot.start().catch((err) => {
    console.error('Failed to start Telegram Bot:', err);
  });
}
