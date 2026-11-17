'use client';

import React from 'react';
import { Megaphone, Calendar, Sparkles, Send } from 'lucide-react';
import ComingSoon from '@/components/common/ComingSoon';
import { useTranslation } from '@/hooks/useTranslation';

export default function ChannelPublisher() {
  const { isUk } = useTranslation();

  return (
    <ComingSoon
      icon={<Megaphone className="h-7 w-7" />}
      title={isUk ? 'Публікація в Telegram-канал' : 'Telegram Channel Publisher'}
      description={
        isUk
          ? 'Професійний планувальник постів для вашого Telegram-каналу, AI-генерація продаючих текстів, автоматичні вітрини та інтерактивні кнопки замовлення.'
          : 'Professional broadcast scheduler for your Telegram channel, AI copywriting, showcase templates, and one-tap purchase inline buttons.'
      }
      features={[
        {
          icon: <Calendar className="h-4 w-4" />,
          title: isUk ? 'Автоматичний розклад' : 'Scheduled Broadcasting',
          description: isUk
            ? 'Публікація новинок та ретроспективних добірок у пікові години активності.'
            : 'Queue product drops and spotlight posts during peak viewer engagement.',
        },
        {
          icon: <Sparkles className="h-4 w-4" />,
          title: isUk ? 'AI-генерація описів' : 'AI Copywriting',
          description: isUk
            ? 'Створення стильних описів товарів, хештегів та характеристик в один клік.'
            : 'Generate tailored descriptions, hashtags, and size specs with AI.',
        },
        {
          icon: <Send className="h-4 w-4" />,
          title: isUk ? 'Диплінки у бот' : 'Bot Deep-linking',
          description: isUk
            ? 'Автоматичне додавання кнопки «Купити в боті» з миттєвим відкриттям товару.'
            : 'Embed instant purchase buttons redirecting buyers straight into checkout.',
        },
      ]}
    />
  );
}
