'use client';

import React from 'react';
import { Users, UserCheck, PhoneCall, ShieldCheck } from 'lucide-react';
import ComingSoon from '@/components/common/ComingSoon';
import { useTranslation } from '@/hooks/useTranslation';

export default function Customers() {
  const { isUk } = useTranslation();

  return (
    <ComingSoon
      icon={<Users className="h-7 w-7" />}
      title={isUk ? 'Клієнтська база та профілі покупців' : 'Customer Directory & Profiles'}
      description={
        isUk
          ? 'Централізована база контактів клієнтів з історією замовлень, відділеннями Нової Пошти, середнім чеком та статистикою викупу.'
          : 'Unified customer database with order histories, Nova Poshta delivery locations, average order value, and repeat purchase analytics.'
      }
      features={[
        {
          icon: <UserCheck className="h-4 w-4" />,
          title: isUk ? 'Історія та LTV клієнта' : 'Order History & LTV',
          description: isUk
            ? 'Повна історія успішних, активних та скасованих покупок кожного покупця.'
            : 'Detailed log of completed, active, and returned orders for each buyer.',
        },
        {
          icon: <PhoneCall className="h-4 w-4" />,
          title: isUk ? "Зв'язок з Telegram" : 'Telegram Identification',
          description: isUk
            ? 'Автоматична прив’язка Telegram ID, номера телефону та імені одержувача.'
            : 'Seamless mapping of Telegram IDs, phone numbers, and recipient details.',
        },
        {
          icon: <ShieldCheck className="h-4 w-4" />,
          title: isUk ? 'Сегментація та лояльність' : 'Segmentation & Loyalty',
          description: isUk
            ? 'Виділення постійних клієнтів, облік знижок та запобігання фейковим замовленням.'
            : 'VIP cohort segmentation, personal discounts, and anti-fraud safeguards.',
        },
      ]}
    />
  );
}
