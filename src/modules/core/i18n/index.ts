import { getLocales } from 'expo-localization';
import { I18n, type TranslateOptions } from 'i18n-js';

import en from '../../../../assets/i18n/en.json';

// All user-facing text goes through t() (RULES §2). English ships in v1;
// other languages only need a new JSON file here.
const i18n = new I18n({ en });
i18n.defaultLocale = 'en';
i18n.enableFallback = true;
i18n.locale = getLocales()[0]?.languageCode ?? 'en';

export function t(scope: string, options?: TranslateOptions): string {
  return i18n.t(scope, options);
}

export { i18n };
