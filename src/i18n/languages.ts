// From solveig-site (https://github.com/icebit-no/solveig-site, MIT), src/i18n/languages.ts.

export const languages = ['nn', 'nb'] as const;

export type Lang = (typeof languages)[number];

export const defaultLang: Lang = 'nn';

export const languageNames: Record<Lang, string> = { nn: 'Nynorsk', nb: 'Bokmål' };

/**
 * A page's address in a language, from its address without a language: nynorsk at the root, bokmål under /nb.
 * `pageUrl('nb', '/')` is `/nb`, `pageUrl('nb', '/#sagaen')` is `/nb#sagaen`.
 */
export function pageUrl(lang: Lang, path: string): string {
  const hashAt = path.indexOf('#');
  const pathname = hashAt === -1 ? path : path.slice(0, hashAt);
  const hash = hashAt === -1 ? '' : path.slice(hashAt);
  if (lang === defaultLang) {
    return (pathname || '/') + hash;
  }

  return (pathname === '/' || pathname === '' ? `/${lang}` : `/${lang}${pathname}`) + hash;
}

const months = [
  'januar', 'februar', 'mars', 'april', 'mai', 'juni',
  'juli', 'august', 'september', 'oktober', 'november', 'desember',
];

/** "27. november 2026": the month names are the same in nynorsk and bokmål. Read in UTC. */
export function formatDate(date: Date): string {
  return `${date.getUTCDate()}. ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** "6,6": Norwegian writes a decimal comma. */
export function formatDecimal(value: number): string {
  return value.toFixed(1).replace('.', ',');
}
