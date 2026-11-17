'use client';

import { useAppSelector } from '../store';
import {
  translations,
  Language,
  TranslationDictionary,
  formatProductVariantsCount,
  formatStorageSubtitle,
  formatVariantsCreated,
  translateCategory,
  translateColor,
  translateDay,
  translatePeakInfo,
} from '../utils/translations';

export function useTranslation() {
  const language = useAppSelector((state) => state.ui.language);
  const t = translations[language] || translations.uk;
  const isUk = language === 'uk';

  return {
    t,
    language,
    isUk,
    formatProductVariantsCount: (count: number) => formatProductVariantsCount(count, language),
    formatStorageSubtitle: (items: number, categories: number) => formatStorageSubtitle(items, categories, language),
    formatVariantsCreated: (count: number) => formatVariantsCreated(count, language),
    translateCategory: (cat: string) => translateCategory(cat, language),
    translateColor: (color: string) => translateColor(color, language),
    translateDay: (day: string) => translateDay(day, language),
    translatePeakInfo: (peakInfo: string | undefined) => translatePeakInfo(peakInfo, language),
  };
}
