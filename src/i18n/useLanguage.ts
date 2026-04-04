import { useAuth } from '../context/AuthContext';
import strings, { type StringKey } from './strings';

export function useLanguage() {
  const { nativeLanguage } = useAuth();
  const lang = nativeLanguage || 'en';

  const s = (key: StringKey): string => {
    return strings[lang]?.[key] ?? strings.en[key] ?? key;
  };

  const isRTL = lang === 'fa';

  return { s, lang, isRTL };
}
