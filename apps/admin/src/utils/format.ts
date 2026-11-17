import type { Language } from './translations';

const localeOf = (language: Language) => (language === 'uk' ? 'uk-UA' : 'en-US');

/**
 * Formats a hryvnia amount the same way everywhere in the admin: grouped digits,
 * the sign after the number, and kopecks only when the amount actually has them.
 */
export function formatMoney(value: number | null | undefined, language: Language = 'uk'): string {
  const amount = Number.isFinite(value) ? (value as number) : 0;
  const hasFraction = Math.round(amount * 100) % 100 !== 0;
  const digits = amount.toLocaleString(localeOf(language), {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return `${digits} ₴`;
}

/** Day and short month in the interface language, without the trailing dot some locales append. */
export function formatShortDate(date: Date | string, language: Language = 'uk'): string {
  const parsed = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed
    .toLocaleDateString(localeOf(language), { day: 'numeric', month: 'short' })
    .replace(/\.$/, '');
}

/** "5 хв тому" / "5 minutes ago"; older than a week falls back to the short date. */
export function formatRelativeTime(date: Date | string, language: Language = 'uk', now: Date = new Date()): string {
  const parsed = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(parsed.getTime())) return '';
  const seconds = Math.round((parsed.getTime() - now.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(localeOf(language), { numeric: 'auto', style: 'short' });
  const abs = Math.abs(seconds);
  if (abs < 60) return rtf.format(0, 'minute');
  if (abs < 3600) return rtf.format(Math.round(seconds / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(seconds / 3600), 'hour');
  if (abs < 7 * 86400) return rtf.format(Math.round(seconds / 86400), 'day');
  return formatShortDate(parsed, language);
}
