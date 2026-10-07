'use client';

import { useAppSelector } from '../store';
import { translations, Language, TranslationDictionary } from '../utils/translations';

export function useTranslation(): { t: TranslationDictionary; language: Language } {
  const language = useAppSelector((state) => state.ui.language);
  const t = translations[language] || translations.uk;
  return { t, language };
}
