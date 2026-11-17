import { Bot, session, Context, SessionFlavor, Keyboard, InlineKeyboard, InputFile } from 'grammy';
import dotenv from 'dotenv';
import path from 'path';
import { getStoreSettings, prisma } from '@shop-ai/database';
import { searchNpSettlements, getNpWarehouses } from './nova-poshta';
import { createPrismaSessionStorage } from './session-storage';
import { createMonobankInvoice } from './monobank';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

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
  cityRef?: string;
  postOffice?: string;
  warehouseRef?: string;
  candidateCities?: { ref: string; present: string; mainDescription: string; area: string; deliveryCityRef: string }[];
  candidateWarehouses?: { ref: string; number: string; description: string; shortAddress: string }[];
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

// Session Middleware (PostgreSQL / Prisma Persistent Storage)
bot.use(
  session({
    initial: (): SessionData => ({
      cart: [],
      checkoutStep: 'IDLE',
      checkoutData: {},
    }),
    storage: createPrismaSessionStorage<SessionData>(),
  }),
);

// Helper: Main Menu Keyboard
function getMainMenuKeyboard() {
  return new Keyboard()
    .text('🛍 Каталог товарів')
    .text('🛒 Мій кошик')
    .row()
    .text('📦 Мої замовлення')
    .text('ℹ️ Допомога')
    .resized();
}

// Helper: Color & Category Emojis
function getColorEmoji(colorName: string): string {
  const lower = colorName.toLowerCase();
  if (lower.includes('white') || lower.includes('білий') || lower.includes('wite')) return '⚪';
  if (lower.includes('black') || lower.includes('чорний')) return '⚫';
  if (lower.includes('red') || lower.includes('червоний')) return '🔴';
  if (lower.includes('blue') || lower.includes('синій') || lower.includes('блакитний')) return '🔵';
  if (lower.includes('green') || lower.includes('зелений')) return '🟢';
  if (lower.includes('yellow') || lower.includes('жовтий')) return '🟡';
  if (lower.includes('orange') || lower.includes('помаранчевий')) return '🟠';
  if (lower.includes('purple') || lower.includes('фіолетовий')) return '🟣';
  if (lower.includes('brown') || lower.includes('camel') || lower.includes('коричневий')) return '🟤';
  if (lower.includes('grey') || lower.includes('gray') || lower.includes('charcoal') || lower.includes('сірий')) return '🔘';
  return '🎨';
}

function getCategoryEmoji(catName: string): string {
  const lower = catName.toLowerCase();
  if (lower.includes('footwear') || lower.includes('взуття') || lower.includes('shoes') || lower.includes('sneakers')) return '👟';
  if (lower.includes('outerwear') || lower.includes('куртки') || lower.includes('верхній')) return '🧥';
  if (lower.includes('knitwear') || lower.includes('светри')) return '🧶';
  if (lower.includes('trousers') || lower.includes('штани') || lower.includes('pants') || lower.includes('джинси')) return '👖';
  if (lower.includes('shirt') || lower.includes('сорочки') || lower.includes('футболки')) return '👕';
  if (lower.includes('dress') || lower.includes('сукні')) return '👗';
  if (lower.includes('headwear') || lower.includes('шапки') || lower.includes('caps')) return '🧢';
  if (lower.includes('bag') || lower.includes('сумки')) return '👜';
  if (lower.includes('belt') || lower.includes('ремені')) return '🥋';
  if (lower.includes('access') || lower.includes('аксесуари')) return '🕶️';
  return '📦';
}

// Helper: Ensure User Exists in DB
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

// /start Command
bot.command('start', async (ctx) => {
  await ensureDbUser(ctx);
  ctx.session.checkoutStep = 'IDLE';

  const match = ctx.match?.trim();
  if (match) {
    let targetProductId = '';
    if (match.startsWith('prod_')) {
      targetProductId = match.slice(5).trim();
    } else if (match.startsWith('prod-')) {
      targetProductId = match.slice(5).trim();
    } else {
      targetProductId = match;
    }

    if (targetProductId) {
      const product = await prisma.product.findUnique({
        where: { id: targetProductId },
      });

      if (product) {
        await ctx.reply(
          `👋 **${await greetingTitle()}**\n\n` +
            `Відкриваємо обраний товар зі списку:`,
          {
            parse_mode: 'Markdown',
            reply_markup: getMainMenuKeyboard(),
          },
        );
        await showProductDetails(ctx, product.id);
        return;
      }
    }
  }

  await ctx.reply(
    `👋 **${await greetingTitle()}**\n\n` +
      `Тут ви можете переглянути доступні товари та оформити замовлення прямо у Telegram.\n\n` +
      `Оберіть необхідний розділ у меню нижче:`,
    {
      parse_mode: 'Markdown',
      reply_markup: getMainMenuKeyboard(),
    },
  );
});

// /cancel Command
bot.command('cancel', async (ctx) => {
  ctx.session.checkoutStep = 'IDLE';
  ctx.session.checkoutData = {};
  await ctx.reply('Оформлення замовлення скасовано.', {
    reply_markup: getMainMenuKeyboard(),
  });
});

// 1. STEP 1: Categories View (Каталог -> Категорії)
async function showCategoryList(ctx: MyContext) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    // Filter categories that have at least 1 product
    const activeCategories = categories.filter((c) => c._count.products > 0);

    if (activeCategories.length === 0) {
      return ctx.reply('📭 Наразі в каталозі немає доступних товарів.', {
        reply_markup: getMainMenuKeyboard(),
      });
    }

    const keyboard = new InlineKeyboard();
    activeCategories.forEach((cat, idx) => {
      const emoji = getCategoryEmoji(cat.name);
      keyboard.text(`${emoji} ${cat.name} (${cat._count.products})`, `cat_sel_${cat.id}`);
      if ((idx + 1) % 2 === 0) keyboard.row();
    });

    if (activeCategories.length % 2 !== 0) keyboard.row();
    keyboard.text('🛒 Мій кошик', 'view_cart');

    const text =
      `📂 **Каталог товарів**\n\n` +
      `Оберіть категорію для перегляду доступних моделей:`;

    if (ctx.callbackQuery) {
      try {
        await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: keyboard });
      } catch {
        await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
      }
    } else {
      await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
    }
  } catch (err) {
    console.error('Catalog categories error:', err);
    await ctx.reply('Помилка завантаження каталогу. Спробуйте пізніше.');
  }
}

bot.hears(['🛍 Каталог товарів', '/catalog'], async (ctx) => {
  ctx.session.checkoutStep = 'IDLE';
  await showCategoryList(ctx);
});

bot.hears(['📦 Мої замовлення', '/orders'], async (ctx) => {
  ctx.session.checkoutStep = 'IDLE';
  await showMyOrders(ctx);
});

bot.hears(['ℹ️ Допомога', '/help'], async (ctx) => {
  ctx.session.checkoutStep = 'IDLE';
  await ctx.reply(
    await helpText(),
    { parse_mode: 'Markdown', reply_markup: getMainMenuKeyboard() },
  );
});

bot.callbackQuery('cat_list', async (ctx) => {
  await ctx.answerCallbackQuery();
  await showCategoryList(ctx);
});

// 2. STEP 2: Products within Category (Категорія -> Моделі)
bot.callbackQuery(/^cat_sel_(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const categoryId = ctx.match[1];

  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        products: {
          orderBy: { createdAt: 'desc' },
          include: {
            variants: true,
          },
        },
      },
    });

    if (!category || category.products.length === 0) {
      return ctx.reply('У цій категорії поки немає товарів.', {
        reply_markup: new InlineKeyboard().text('🔙 Назад до категорій', 'cat_list'),
      });
    }

    const emoji = getCategoryEmoji(category.name);
    let text = `${emoji} **Категорія: ${category.name}**\n\nОберіть модель товару:`;

    const keyboard = new InlineKeyboard();

    category.products.forEach((prod) => {
      const activeVariants = prod.variants.filter((v) => v.stock > 0);
      const minPrice = prod.variants.length > 0
        ? Math.min(...prod.variants.map((v) => Number(v.price)))
        : 0;

      const brandMatch = prod.description?.match(/Brand:\s*(.+)/i);
      const brandStr = brandMatch ? `${brandMatch[1].trim()} ` : '';
      const stockBadge = activeVariants.length > 0 ? '' : ' (немає)';

      keyboard
        .text(`🛍 ${brandStr}${prod.name} — від ${minPrice} ₴${stockBadge}`, `prod_sel_${prod.id}`)
        .row();
    });

    keyboard.text('🔙 Назад до категорій', 'cat_list');

    if (ctx.callbackQuery?.message?.photo) {
      // If previous message was a photo, reply with new text message
      await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
    } else {
      try {
        await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: keyboard });
      } catch {
        await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
      }
    }
  } catch (err) {
    console.error('Error fetching products for category:', err);
    await ctx.reply('Помилка завантаження товарів.');
  }
});

// 3. STEP 3: Product View + Photos + Color Selection (Модель -> Фото + Кольори)
async function showProductDetails(ctx: MyContext, productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        variants: true,
      },
    });

    if (!product) {
      return ctx.reply('Товар не знайдено.', {
        reply_markup: new InlineKeyboard().text('🔙 До каталогу', 'cat_list'),
      });
    }

    const brandMatch = product.description?.match(/Brand:\s*(.+)/i);
    const brand = brandMatch ? brandMatch[1].trim() : '';

    const minPrice = product.variants.length > 0
      ? Math.min(...product.variants.map((v) => Number(v.price)))
      : 0;

    // Get unique colors that have at least one variant with stock (or all colors)
    const uniqueColors = Array.from(new Set(product.variants.map((v) => v.color)));
    const allSizes = Array.from(new Set(product.variants.map((v) => v.size))).join(', ');

    let caption = `🛍 **${product.name}**\n`;
    if (brand) caption += `🏷️ Бренд: **${brand}**\n`;
    caption += `📂 Категорія: **${product.category?.name || 'Загальне'}**\n`;
    caption += `📏 Доступні розміри: **${allSizes || 'One size'}**\n`;
    caption += `💰 Ціна: **${minPrice} ₴**\n\n`;
    caption += `🎨 **Оберіть колір для замовлення:**`;

    const keyboard = new InlineKeyboard();

    uniqueColors.forEach((colorName, idx) => {
      const colorEmoji = getColorEmoji(colorName);
      const variantsForColor = product.variants.filter((v) => v.color === colorName);
      const hasStock = variantsForColor.some((v) => v.stock > 0);
      const stockNote = hasStock ? '' : ' (немає)';

      keyboard.text(
        `${colorEmoji} ${colorName}${stockNote}`,
        `prod_col_${product.id}:::${colorName}`,
      );
      if ((idx + 1) % 2 === 0) keyboard.row();
    });

    if (uniqueColors.length % 2 !== 0) keyboard.row();
    if (product.categoryId) {
      keyboard.text('🔙 Назад до списку товарів', `cat_sel_${product.categoryId}`);
    } else {
      keyboard.text('🔙 До каталогу', 'cat_list');
    }

    // Send with Photo if product has an image
    const firstImage = product.images?.[0];

    if (firstImage) {
      if (firstImage.startsWith('data:image/')) {
        const base64Data = firstImage.split(',')[1];
        if (base64Data) {
          const buffer = Buffer.from(base64Data, 'base64');
          return ctx.replyWithPhoto(new InputFile(buffer, 'product.jpg'), {
            caption,
            parse_mode: 'Markdown',
            reply_markup: keyboard,
          });
        }
      } else if (firstImage.startsWith('http://') || firstImage.startsWith('https://')) {
        return ctx.replyWithPhoto(firstImage, {
          caption,
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        });
      }
    }

    // Fallback text if no image
    if (ctx.callbackQuery?.message?.photo) {
      await ctx.reply(caption, { parse_mode: 'Markdown', reply_markup: keyboard });
    } else if (ctx.callbackQuery) {
      try {
        await ctx.editMessageText(caption, { parse_mode: 'Markdown', reply_markup: keyboard });
      } catch {
        await ctx.reply(caption, { parse_mode: 'Markdown', reply_markup: keyboard });
      }
    } else {
      await ctx.reply(caption, { parse_mode: 'Markdown', reply_markup: keyboard });
    }
  } catch (err) {
    console.error('Error showing product details:', err);
    await ctx.reply('Помилка відображення товару.');
  }
}

bot.callbackQuery(/^prod_sel_(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery().catch(() => {});
  const productId = ctx.match[1];
  await showProductDetails(ctx, productId);
});

// 4. STEP 4: Size Selection for Chosen Color (Колір -> Розміри)
bot.callbackQuery(/^prod_col_(.+)[:]{3}(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const productId = ctx.match[1];
  const colorName = ctx.match[2];

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        variants: {
          where: { color: colorName },
          orderBy: { size: 'asc' },
        },
      },
    });

    if (!product || product.variants.length === 0) {
      return ctx.reply(`Для кольору "${colorName}" розміри не знайдені.`, {
        reply_markup: new InlineKeyboard().text('🔙 Назад до кольорів', `prod_sel_${productId}`),
      });
    }

    const colorEmoji = getColorEmoji(colorName);
    const price = product.variants[0]?.price ? Number(product.variants[0].price) : 0;

    let text =
      `🛍 **${product.name}**\n` +
      `🎨 Колір: ${colorEmoji} **${colorName}**\n` +
      `💰 Ціна: **${price} ₴**\n\n` +
      `📏 **Оберіть потрібний розмір:**`;

    const keyboard = new InlineKeyboard();

    // Sort variants logically (numerically if possible, e.g. 39, 40, 41 or standard S, M, L)
    const sortedVariants = [...product.variants].sort((a, b) => {
      const numA = parseFloat(a.size);
      const numB = parseFloat(b.size);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.size.localeCompare(b.size);
    });

    sortedVariants.forEach((variant) => {
      if (variant.stock > 0) {
        keyboard
          .text(`👟 Розмір ${variant.size} (в наявності: ${variant.stock} шт)`, `var_card_${variant.id}`)
          .row();
      } else {
        keyboard
          .text(`❌ Розмір ${variant.size} (немає в наявності)`, `outofstock_${variant.id}`)
          .row();
      }
    });

    keyboard.text('🔙 Назад до вибору кольору', `prod_sel_${productId}`);

    if (ctx.callbackQuery?.message?.photo) {
      await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
    } else {
      try {
        await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: keyboard });
      } catch {
        await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
      }
    }
  } catch (err) {
    console.error('Error showing size options:', err);
    await ctx.reply('Помилка вибору розміру.');
  }
});

// Out of stock alert
bot.callbackQuery(/^outofstock_(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery({
    text: 'На жаль, цей розмір зараз відсутній на складі.',
    show_alert: true,
  });
});

// 5. STEP 5: Product Card View (Картка обраного товару/розміру)
bot.callbackQuery(/^var_card_(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const variantId = ctx.match[1];

  try {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        product: {
          include: { category: true },
        },
      },
    });

    if (!variant) {
      return ctx.reply('Варіант товару не знайдено.', {
        reply_markup: new InlineKeyboard().text('🛍 До каталогу', 'cat_list'),
      });
    }

    const { product } = variant;
    const brandMatch = product.description?.match(/Brand:\s*(.+)/i);
    const brand = brandMatch ? brandMatch[1].trim() : '';
    const colorEmoji = getColorEmoji(variant.color);

    let caption = `🏷 **КАРТКА ТОВАРУ**\n\n`;
    caption += `📦 **Модель**: ${product.name}\n`;
    if (brand) caption += `🏢 **Бренд**: ${brand}\n`;
    caption += `📂 **Категорія**: ${product.category?.name || 'Загальне'}\n`;
    caption += `🎨 **Колір**: ${colorEmoji} ${variant.color}\n`;
    caption += `📏 **Розмір**: **${variant.size}**\n`;
    caption += `🔢 **В наявності**: **${variant.stock} шт**\n`;
    caption += `💰 Ціна: **${variant.price} ₴**\n\n`;
    caption += `👇 _Оберіть дію нижче для замовлення:_`;

    const keyboard = new InlineKeyboard();
    if (variant.stock > 0) {
      keyboard
        .text('🛒 Додати в кошик', `add_cart_${variant.id}`)
        .text('⚡ Купити відразу', `buy_now_${variant.id}`);
    } else {
      keyboard.text('❌ Немає в наявності', `outofstock_${variant.id}`);
    }
    keyboard
      .row()
      .text('🔙 Назад до вибору розміру', `prod_col_${product.id}:::${variant.color}`)
      .row()
      .text('🛍 Каталог', 'cat_list');

    const firstImage = product.images?.[0];

    if (firstImage) {
      if (firstImage.startsWith('data:image/')) {
        const base64Data = firstImage.split(',')[1];
        if (base64Data) {
          const buffer = Buffer.from(base64Data, 'base64');
          return ctx.replyWithPhoto(new InputFile(buffer, 'product_card.jpg'), {
            caption,
            parse_mode: 'Markdown',
            reply_markup: keyboard,
          });
        }
      } else if (firstImage.startsWith('http://') || firstImage.startsWith('https://')) {
        return ctx.replyWithPhoto(firstImage, {
          caption,
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        });
      }
    }

    if (ctx.callbackQuery?.message?.photo) {
      await ctx.reply(caption, { parse_mode: 'Markdown', reply_markup: keyboard });
    } else {
      try {
        await ctx.editMessageText(caption, { parse_mode: 'Markdown', reply_markup: keyboard });
      } catch {
        await ctx.reply(caption, { parse_mode: 'Markdown', reply_markup: keyboard });
      }
    }
  } catch (err) {
    console.error('Error showing variant card:', err);
    await ctx.reply('Помилка відкриття картки товару.');
  }
});

// 6. STEP 6: Add to Cart from Product Card
bot.callbackQuery(/^add_cart_(.+)$/, async (ctx) => {
  const variantId = ctx.match[1];
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: { product: true },
  });

  if (!variant || variant.stock <= 0) {
    return ctx.answerCallbackQuery({
      text: 'На жаль, цей розмір товару закінчився.',
      show_alert: true,
    });
  }

  // Overselling protection: check total quantity in cart against available stock
  const existing = ctx.session.cart.find((c) => c.variantId === variantId);
  const currentQty = existing ? existing.quantity : 0;

  if (currentQty + 1 > variant.stock) {
    return ctx.answerCallbackQuery({
      text: `❌ У наявності лише ${variant.stock} шт. Більше додати не можна.`,
      show_alert: true,
    });
  }

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

  await ctx.answerCallbackQuery({
    text: `✅ Додано в кошик: ${variant.product.name} (${variant.color} / ${variant.size})`,
  });

  const keyboard = new InlineKeyboard()
    .text('📝 Оформити замовлення зараз', 'checkout_start')
    .row()
    .text('🛒 Переглянути кошик', 'view_cart')
    .row()
    .text('🛍 Продовжити покупки', 'cat_list');

  await ctx.reply(
    `✅ **Товар успішно додано у ваш кошик!**\n\n` +
      `📦 **${variant.product.name}**\n` +
      `🎨 Колір: **${variant.color}**\n` +
      `📏 Розмір: **${variant.size}**\n` +
      `💰 Ціна: **${variant.price} ₴**\n\n` +
      `Що бажаєте зробити далі?`,
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  );
});

// Quick Buy Now Handler
bot.callbackQuery(/^buy_now_(.+)$/, async (ctx) => {
  const variantId = ctx.match[1];
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: { product: true },
  });

  if (!variant || variant.stock <= 0) {
    return ctx.answerCallbackQuery({
      text: 'На жаль, цей розмір товару закінчився.',
      show_alert: true,
    });
  }

  // Isolate cart to this specific item for single-click checkout
  ctx.session.cart = [
    {
      variantId,
      productName: variant.product.name,
      size: variant.size,
      color: variant.color,
      price: Number(variant.price),
      quantity: 1,
    },
  ];

  await ctx.answerCallbackQuery();

  ctx.session.checkoutStep = 'AWAITING_FULL_NAME';
  ctx.session.checkoutData = {};

  await ctx.reply(
    `⚡ **Швидке оформлення замовлення (Крок 1/4)**\n\n` +
      `📦 Товар: **${variant.product.name}** (${variant.color} / ${variant.size}) — **${variant.price} ₴**\n\n` +
      `Будь ласка, введіть ваше **ПІБ** (Прізвище, Ім'я, По батькові):\n` +
      `_Приклад: Шевченко Тарас Григорович_`,
    { parse_mode: 'Markdown' },
  );
});

bot.callbackQuery('continue_shopping', async (ctx) => {
  await ctx.answerCallbackQuery();
  await showCategoryList(ctx);
});

// 🛒 Cart View
bot.hears(['🛒 Мій кошик', '🛒 Моій кошик', '/cart'], async (ctx) => {
  ctx.session.checkoutStep = 'IDLE';
  await showCart(ctx);
});

bot.callbackQuery('view_cart', async (ctx) => {
  await ctx.answerCallbackQuery();
  await showCart(ctx);
});

async function showCart(ctx: MyContext) {
  const cart = ctx.session.cart;
  if (cart.length === 0) {
    return ctx.reply('🛒 **Ваш кошик порожній.**\n\nСкористайтеся кнопкою 🛍 **Каталог товарів**, щоб обрати товари.', {
      reply_markup: new InlineKeyboard().text('🛍 Відкрити каталог', 'cat_list'),
      parse_mode: 'Markdown',
    });
  }

  let text = `🛒 **Ваш кошик:**\n\n`;
  let total = 0;

  cart.forEach((item, idx) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    text += `${idx + 1}. **${item.productName}** (${item.color} / ${item.size})\n`;
    text += `   Кількість: ${item.quantity} шт × ${item.price} ₴ = **${itemTotal.toFixed(2)} ₴**\n\n`;
  });

  text += `💰 **Разом до сплати: ${total.toFixed(2)} ₴**`;

  const keyboard = new InlineKeyboard()
    .text('📝 Оформити замовлення', 'checkout_start')
    .row()
    .text('🛍 Продовжити покупки', 'cat_list')
    .row()
    .text('🗑 Очистити кошик', 'clear_cart');

  await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
}

bot.callbackQuery('clear_cart', async (ctx) => {
  ctx.session.cart = [];
  await ctx.answerCallbackQuery({ text: 'Кошик очищено' });
  await ctx.reply('🛒 Ваш кошик порожній.', {
    reply_markup: new InlineKeyboard().text('🛍 Відкрити каталог', 'cat_list'),
  });
});

// 📝 Step-by-Step Checkout Wizard
bot.callbackQuery('checkout_start', async (ctx) => {
  await ctx.answerCallbackQuery();
  if (ctx.session.cart.length === 0) {
    return ctx.reply('Ваш кошик порожній. Спочатку додайте товари з каталогу.', {
      reply_markup: new InlineKeyboard().text('🛍 Відкрити каталог', 'cat_list'),
    });
  }

  ctx.session.checkoutStep = 'AWAITING_FULL_NAME';
  ctx.session.checkoutData = {};

  await ctx.reply(
    `📝 **Оформлення замовлення (Крок 1/4)**\n\n` +
      `Будь ласка, введіть ваше **ПІБ** (Прізвище, Ім'я, По батькові):\n` +
      `_Приклад: Шевченко Тарас Григорович_`,
    { parse_mode: 'Markdown' },
  );
});

// Text Handler for Checkout Wizard
bot.on('message:text', async (ctx) => {
  const text = ctx.message.text.trim();

  // If user requests cancellation
  if (['/cancel', 'скасувати', 'відміна', 'отмена'].includes(text.toLowerCase())) {
    ctx.session.checkoutStep = 'IDLE';
    ctx.session.checkoutData = {};
    return ctx.reply('Оформлення замовлення скасовано.', {
      reply_markup: getMainMenuKeyboard(),
    });
  }

  // If user taps main menu buttons or commands, reset step immediately and dispatch
  if (
    [
      '🛍 Каталог товарів',
      '/catalog',
      '🛒 Мій кошик',
      '🛒 Моій кошик',
      '/cart',
      '📦 Мої замовлення',
      '/orders',
      'ℹ️ Допомога',
      '/help',
    ].includes(text)
  ) {
    ctx.session.checkoutStep = 'IDLE';
    if (['🛍 Каталог товарів', '/catalog'].includes(text)) {
      return showCategoryList(ctx);
    }
    if (['🛒 Мій кошик', '🛒 Моій кошик', '/cart'].includes(text)) {
      return showCart(ctx);
    }
    if (['📦 Мої замовлення', '/orders'].includes(text)) {
      return showMyOrders(ctx);
    }
    if (['ℹ️ Допомога', '/help'].includes(text)) {
      return ctx.reply(
        await helpText(),
        { parse_mode: 'Markdown', reply_markup: getMainMenuKeyboard() },
      );
    }
    return;
  }

  const step = ctx.session.checkoutStep;

  if (step === 'AWAITING_FULL_NAME') {
    // Nova Poshta needs at least a last and a first name to issue a TTN.
    if (text.trim().split(/\s+/).length < 2) {
      return ctx.reply('Будь ласка, введіть прізвище та ім\'я (по батькові за бажанням), наприклад: Шевченко Тарас:');
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
    const cleaned = text.replace(/[\s\-()]/g, '');
    const uaPattern = /^(\+?380|0)\d{9}$/;
    const generalPattern = /^\+?\d{9,15}$/;

    if (!uaPattern.test(cleaned) && !generalPattern.test(cleaned)) {
      const phoneKeyboard = new Keyboard()
        .requestContact('📱 Надіслати мій номер телефону')
        .resized()
        .oneTime();

      return ctx.reply(
        `⚠️ **Невірний формат номера телефону.**\n\n` +
          `Будь ласка, введіть коректний номер (наприклад: \`+380XXXXXXXXX\` або \`0XXXXXXXXX\`) або натисніть кнопку відправки контакту нижче:`,
        {
          parse_mode: 'Markdown',
          reply_markup: phoneKeyboard,
        },
      );
    }

    const formattedPhone = cleaned.startsWith('0') && cleaned.length === 10
      ? `+38${cleaned}`
      : cleaned.startsWith('380') && cleaned.length === 12
        ? `+${cleaned}`
        : cleaned.startsWith('+')
          ? cleaned
          : `+${cleaned}`;

    ctx.session.checkoutData.phone = formattedPhone;
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
    if (text.length < 2) {
      return ctx.reply('Будь ласка, введіть коректну назву міста (щонайменше 2 символи):');
    }

    try {
      const settlements = await searchNpSettlements(text, 5);
      if (settlements.length > 0) {
        ctx.session.checkoutData.candidateCities = settlements;
        const keyboard = new InlineKeyboard();
        settlements.forEach((s, idx) => {
          const regionSuffix = s.area ? ` (${s.area} обл.)` : '';
          keyboard.text(`📍 ${s.mainDescription}${regionSuffix}`.slice(0, 36), `np_c_${idx}`).row();
        });
        keyboard.text(`✍️ Залишити "${text}" як є`, 'np_c_manual').row();
        keyboard.text('❌ Скасувати', 'cancel_order_final');

        return ctx.reply(
          `🏙 **Знайдено населені пункти Нової Пошти:**\n\n` +
            `Оберіть ваше місто або підтвердіть введений текст:`,
          {
            parse_mode: 'Markdown',
            reply_markup: keyboard,
          },
        );
      }
    } catch (err) {
      console.error('Error querying Nova Poshta settlements:', err);
    }

    ctx.session.checkoutData.city = text;
    ctx.session.checkoutStep = 'AWAITING_POST_OFFICE';

    return ctx.reply(
      `🚚 **Оформлення замовлення (Крок 4/4)**\n\n` +
        `Введіть **номер відділення або поштомату Нової Пошти**:\n` +
        `_Приклад: 12 (або номер поштомату чи адресу)_`,
      { parse_mode: 'Markdown' },
    );
  }

  if (step === 'AWAITING_POST_OFFICE') {
    if (text.length < 1) {
      return ctx.reply('Будь ласка, введіть номер або адресу відділення:');
    }

    const cityRefOrName = ctx.session.checkoutData.cityRef || ctx.session.checkoutData.city;
    if (cityRefOrName) {
      try {
        const warehouses = await getNpWarehouses(cityRefOrName, text, 5);
        if (warehouses.length > 0) {
          ctx.session.checkoutData.candidateWarehouses = warehouses;
          const keyboard = new InlineKeyboard();
          warehouses.forEach((w, idx) => {
            const label = `🏢 №${w.number}: ${w.shortAddress || w.description}`;
            keyboard.text(label.slice(0, 36), `np_w_${idx}`).row();
          });
          keyboard.text(`✍️ Залишити "${text}" як є`, 'np_w_manual').row();
          keyboard.text('❌ Скасувати', 'cancel_order_final');

          return ctx.reply(
            `📦 **Знайдено відділення Нової Пошти:**\n\n` +
              `Оберіть відповідне відділення зі списку:`,
            {
              parse_mode: 'Markdown',
              reply_markup: keyboard,
            },
          );
        }
      } catch (err) {
        console.error('Error querying Nova Poshta warehouses:', err);
      }
    }

    ctx.session.checkoutData.postOffice = text;
    ctx.session.checkoutStep = 'AWAITING_CONFIRMATION';

    await sendOrderConfirmation(ctx);
    return;
  }
});

bot.callbackQuery(/^np_c_(\d+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const idx = parseInt(ctx.match[1], 10);
  const candidate = ctx.session.checkoutData.candidateCities?.[idx];

  if (candidate) {
    ctx.session.checkoutData.city = candidate.present || candidate.mainDescription;
    ctx.session.checkoutData.cityRef = candidate.deliveryCityRef || candidate.ref;
  }

  ctx.session.checkoutStep = 'AWAITING_POST_OFFICE';

  const cityName = candidate?.mainDescription || ctx.session.checkoutData.city || '';
  await ctx.reply(
    `✅ Обрано місто: **${cityName}**\n\n` +
      `🚚 **Оформлення замовлення (Крок 4/4)**\n\n` +
      `Введіть **номер відділення або поштомату** у м. ${cityName}:\n` +
      `_Приклад: 12 (або номер поштомату чи вулицю)_`,
    { parse_mode: 'Markdown' },
  );
});

bot.callbackQuery('np_c_manual', async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.checkoutStep = 'AWAITING_POST_OFFICE';

  await ctx.reply(
    `🚚 **Оформлення замовлення (Крок 4/4)**\n\n` +
      `Введіть **номер або адресу відділення Нової Пошти**:\n` +
      `_Приклад: Відділення №12_`,
    { parse_mode: 'Markdown' },
  );
});

bot.callbackQuery(/^np_w_(\d+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const idx = parseInt(ctx.match[1], 10);
  const candidate = ctx.session.checkoutData.candidateWarehouses?.[idx];

  if (candidate) {
    ctx.session.checkoutData.postOffice = candidate.description;
    ctx.session.checkoutData.warehouseRef = candidate.ref;
  }

  ctx.session.checkoutStep = 'AWAITING_CONFIRMATION';
  await sendOrderConfirmation(ctx);
});

bot.callbackQuery('np_w_manual', async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.checkoutStep = 'AWAITING_CONFIRMATION';
  await sendOrderConfirmation(ctx);
});

// Contact Handler for Phone Share
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

// Helper: Send Order Confirmation Summary
async function sendOrderConfirmation(ctx: MyContext) {
  const { cart, checkoutData } = ctx.session;
  let total = 0;

  let itemsSummary = '';
  cart.forEach((item, idx) => {
    const sum = item.price * item.quantity;
    total += sum;
    itemsSummary += `${idx + 1}. ${item.productName} (${item.color} / ${item.size}) x${item.quantity} — ${sum.toFixed(2)} ₴\n`;
  });

  const text =
    `📋 **ПЕРЕВІРКА ЗАМОВЛЕННЯ**\n\n` +
    `🛍 **Замовлені товари**:\n${itemsSummary}\n` +
    `👤 **ПІБ замовника**: ${checkoutData.fullName || '—'}\n` +
    `📱 **Номер телефону**: ${checkoutData.phone || '—'}\n` +
    `🏙 **Місто**: ${checkoutData.city || '—'}\n` +
    `🚚 **Відділення пошти**: ${checkoutData.postOffice || '—'}\n\n` +
    `💰 **Загальна сума**: **${total.toFixed(2)} ₴**\n\n` +
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

// Callback: Final Order Confirmation
bot.callbackQuery('confirm_order_final', async (ctx) => {
  await ctx.answerCallbackQuery();

  const { cart, checkoutData } = ctx.session;
  if (cart.length === 0) {
    return ctx.reply('Кошик порожній.', { reply_markup: getMainMenuKeyboard() });
  }

  try {
    const user = await ensureDbUser(ctx);
    if (!user) return ctx.reply('Помилка авторизації.');

    let totalAmount = 0;
    cart.forEach((i) => (totalAmount += i.price * i.quantity));

    const { lowStockThreshold } = await getStoreSettings();

    // Atomic transaction: verify stock, decrement inventory, and create order
    let order;
    try {
      order = await prisma.$transaction(async (tx) => {
        const snapshots = new Map<string, { productName: string; sku: string; size: string; color: string; image: string | null }>();
        const stockAlerts: Array<{ variantId: string; productName: string; size: string; color: string; stock: number }> = [];

        // 1. Atomically verify stock and decrement inventory using row-level locking
        for (const item of cart) {
          const updateRes = await tx.productVariant.updateMany({
            where: {
              id: item.variantId,
              stock: { gte: item.quantity },
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });

          if (updateRes.count === 0) {
            const variant = await tx.productVariant.findUnique({
              where: { id: item.variantId },
              include: { product: true },
            });

            if (!variant) {
              throw new Error(`NOT_FOUND:${item.productName}`);
            }

            const prodName = variant.product?.name || item.productName;
            throw new Error(
              `INSUFFICIENT_STOCK:${prodName} (${item.color} / ${item.size}) — в наявності лише ${variant.stock} шт., а у вашому кошику ${item.quantity} шт.`
            );
          }

          const reserved = await tx.productVariant.findUnique({
            where: { id: item.variantId },
            include: { product: true },
          });
          snapshots.set(item.variantId, {
            productName: reserved?.product.name ?? item.productName,
            sku: reserved?.sku ?? '',
            size: reserved?.size ?? item.size,
            color: reserved?.color ?? item.color,
            image: reserved?.product.images[0] ?? null,
          });
          if (reserved && reserved.stock <= lowStockThreshold) {
            stockAlerts.push({
              variantId: reserved.id,
              productName: reserved.product.name,
              size: reserved.size,
              color: reserved.color,
              stock: reserved.stock,
            });
          }
        }

        // 3. Create the Order
        const created = await tx.order.create({
          data: {
            userId: user.id,
            status: 'PENDING',
            totalAmount,
            fullName: checkoutData.fullName,
            phone: checkoutData.phone,
            city: checkoutData.city,
            postOffice: checkoutData.postOffice,
            deliveryCityRef: checkoutData.cityRef,
            deliveryWarehouseRef: checkoutData.warehouseRef,
            items: {
              create: cart.map((i) => ({
                variantId: i.variantId,
                ...snapshots.get(i.variantId),
                quantity: i.quantity,
                price: i.price,
              })),
            },
          },
        });

        await tx.notification.createMany({
          data: [
            {
              kind: 'NEW_ORDER' as const,
              orderId: created.id,
              data: {
                orderNumber: `#${created.id.slice(0, 8).toUpperCase()}`,
                customerName: checkoutData.fullName ?? '',
                total: totalAmount,
                itemsCount: cart.reduce((acc, i) => acc + i.quantity, 0),
                city: checkoutData.city,
              },
            },
            ...stockAlerts.map((alert) => ({
              kind: alert.stock === 0 ? ('OUT_OF_STOCK' as const) : ('LOW_STOCK' as const),
              orderId: created.id,
              data: alert,
            })),
          ],
        });

        return created;
      });
    } catch (txErr: any) {
      if (txErr.message?.startsWith('INSUFFICIENT_STOCK:')) {
        const errorDetail = txErr.message.replace('INSUFFICIENT_STOCK:', '');
        return ctx.reply(
          `⚠️ **Вибачте, товар закінчився або недостатньо на складі:**\n\n` +
            `${errorDetail}\n\n` +
            `Замовлення не створено. Будь ласка, змініть кількість у кошику або оберіть інший розмір/колір.`,
          {
            parse_mode: 'Markdown',
            reply_markup: new InlineKeyboard()
              .text('🛒 Переглянути кошик', 'view_cart')
              .row()
              .text('🛍 Каталог товарів', 'cat_list'),
          },
        );
      }
      if (txErr.message?.startsWith('NOT_FOUND:')) {
        return ctx.reply(
          `⚠️ **Один із товарів у вашому замовленні більше недоступний.**\n\nБудь ласка, оновіть кошик.`,
          {
            parse_mode: 'Markdown',
            reply_markup: new InlineKeyboard().text('🛒 До кошика', 'view_cart'),
          },
        );
      }
      throw txErr;
    }

    // Reset session
    ctx.session.cart = [];
    ctx.session.checkoutStep = 'IDLE';
    ctx.session.checkoutData = {};

    const shortOrderNum = order.id.slice(0, 8).toUpperCase();

    await notifyManagers(
      [
        `🛒 Нове замовлення #${shortOrderNum}`,
        `Сума: ${totalAmount.toFixed(2)} ₴`,
        `Отримувач: ${checkoutData.fullName ?? '—'}, ${checkoutData.phone ?? '—'}`,
        `Доставка: ${checkoutData.city ?? '—'}, ${checkoutData.postOffice ?? '—'}`,
        ...cart.map((i) => `• ${i.productName} (${i.color} / ${i.size}) × ${i.quantity}`),
      ].join('\n'),
    );

    await ctx.reply(
      `🎉 **Дякуємо! Ваше замовлення #${shortOrderNum} успішно створено!**\n\n` +
        `👤 **Отримувач**: ${checkoutData.fullName}\n` +
        `📱 **Телефон**: ${checkoutData.phone}\n` +
        `🏙 **Місто**: ${checkoutData.city}\n` +
        `🚚 **Доставка**: ${checkoutData.postOffice}\n` +
        `💰 **Сума**: ${totalAmount.toFixed(2)} ₴\n\n` +
        `Наш менеджер зв'яжеться з вами найближчим часом для підтвердження.`,
      {
        parse_mode: 'Markdown',
        reply_markup: getMainMenuKeyboard(),
      },
    );

    const payment = await createMonobankInvoice({
      orderId: order.id,
      orderNumber: `#${shortOrderNum}`,
      total: totalAmount,
      redirectUrl: `https://t.me/${ctx.me.username}`,
    });
    if (payment) {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentInvoiceId: payment.invoiceId, paymentUrl: payment.pageUrl },
      });
      await ctx.reply(
        `💳 Можна оплатити замовлення #${shortOrderNum} карткою зараз або готівкою при отриманні на пошті. Посилання дійсне 24 години.`,
        { reply_markup: new InlineKeyboard().url(`Оплатити ${totalAmount.toFixed(2)} ₴`, payment.pageUrl) },
      );
    }
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

/** Escapes Markdown control characters in text an admin typed, so it cannot break a formatted message. */
const plainMarkdown = (value: string) => value.replace(/([*_`\[])/g, '\\$1');

async function greetingTitle() {
  const settings = await getStoreSettings().catch(() => null);
  return settings?.storeName ? `Вітаємо в магазині ${plainMarkdown(settings.storeName)}!` : 'Вітаємо в нашому магазині!';
}

async function helpText() {
  const settings = await getStoreSettings().catch(() => null);
  const contacts = [
    settings?.supportPhone ? `📞 ${plainMarkdown(settings.supportPhone)}` : null,
    settings?.supportEmail ? `✉️ ${plainMarkdown(settings.supportEmail)}` : null,
  ].filter(Boolean);
  return (
    `ℹ️ **Допомога та підтримка**\n\n` +
    `• Для перегляду товарів виберіть 🛍 **Каталог товарів**\n` +
    `• Оберіть категорію ➡️ модель ➡️ колір ➡️ розмір\n` +
    `• Для оформлення замовлення перейдіть у 🛒 **Мій кошик** та заповніть контактні дані\n` +
    (contacts.length
      ? `• Якщо у вас виникли запитання, звертайтесь:\n${contacts.join('\n')}`
      : `• Якщо у вас виникли запитання, наш менеджер завжди на зв'язку.`)
  );
}

/** Sends a plain-text message to the staff chat; a failure is logged and never breaks checkout. */
async function notifyManagers(text: string) {
  const settings = await getStoreSettings().catch(() => null);
  const chatId = settings?.managerChatId || process.env.TELEGRAM_MANAGER_CHAT_ID?.trim();
  if (!chatId) return;
  try {
    await bot.api.sendMessage(chatId, text);
  } catch (err) {
    console.error('Failed to notify the manager chat:', err);
  }
}

// 📦 My Orders View
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
    text += `   Сума: **${ord.totalAmount} ₴**\n`;
    if (ord.city && ord.postOffice) {
      text += `   Доставка: ${ord.city}, ${ord.postOffice}\n`;
    }
    text += `   Товари:\n`;
    ord.items.forEach((it) => {
      const name = it.productName ?? it.variant?.product?.name ?? 'Товар';
      const color = it.color ?? it.variant?.color ?? '—';
      const size = it.size ?? it.variant?.size ?? '—';
      text += `   • ${name} (${color}/${size}) x${it.quantity}\n`;
    });
    text += `\n`;
  });

  await ctx.reply(text, { parse_mode: 'Markdown' });
}

// Launch Bot
if (token) {
  console.log('🤖 Telegram Store Bot process started...');
  bot.start().catch((err) => {
    console.error('Failed to start Telegram Bot:', err);
  });
}
