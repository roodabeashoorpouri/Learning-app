import type { NativeLanguage } from '../context/AuthContext';
import type { TrilingualText } from '../data/types';

type Translatable = TrilingualText | { en: string; fa: string; hy?: string };

/** Return the English or Persian string based on the user's native language. */
export function t(text: Translatable, lang: NativeLanguage): string {
  return lang === 'fa' ? text.fa : text.en;
}

/** Return the Armenian script from a trilingual text. */
export function hy(text: TrilingualText): string {
  return text.hy;
}

/** Return the Armenian phonetic from a trilingual text. */
export function hyPhonetic(text: TrilingualText): string {
  return text.hyPhonetic;
}
