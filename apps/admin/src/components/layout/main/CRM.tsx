'use client';

import React from 'react';
import { Target, TrendingUp, MessageSquare, RotateCcw } from 'lucide-react';
import ComingSoon from '@/components/common/ComingSoon';
import { useTranslation } from '@/hooks/useTranslation';

export default function CRM() {
  const { isUk } = useTranslation();

  return (
    <ComingSoon
      icon={<Target className="h-7 w-7" />}
      title={isUk ? 'CRM та Воронка продажів' : 'CRM & Sales Funnel'}
      description={
        isUk
          ? 'Інструмент відстеження лідів з Telegram-бота, етапів комунікації, повернення покинутих кошиків та автоматизації повторних продажів.'
          : 'Lead tracking pipeline from Telegram, customer lifecycle management, abandoned cart recoveries, and retention automation.'
      }
      features={[
        {
          icon: <TrendingUp className="h-4 w-4" />,
          title: isUk ? 'Воронка конверсій' : 'Conversion Funnel',
          description: isUk
            ? 'Аналітика переходів від перегляду вітрини до успішного отримання посилки.'
            : 'Track conversion velocity from catalog browsing to completed deliveries.',
        },
        {
          icon: <RotateCcw className="h-4 w-4" />,
          title: isUk ? 'Покинуті кошики' : 'Abandoned Carts',
          description: isUk
            ? 'Автоматичні делікатні нагадування клієнтам, які залишили товари в кошику.'
            : 'Automated reminders for customers with uncompleted checkout sessions.',
        },
        {
          icon: <MessageSquare className="h-4 w-4" />,
          title: isUk ? 'Діалоги з клієнтами' : 'Direct Messages',
          description: isUk
            ? 'Оперативна відповідь на запитання клієнтів бота прямо з інтерфейсу CRM.'
            : 'Quick response inbox to answer Telegram buyer inquiries directly.',
        },
      ]}
    />
  );
}
