import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from './translations';

export const defaultNS = 'translation';
export const resources = {
  en: {
    translation: en,
  },
} as const;

i18n.use(initReactI18next).init({
  defaultNS,
  resources,
  ns: [defaultNS],
  // Use localize library to get the device language
  // lng: RNLocalize.getLocales()[0].languageTag,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export { default as i18n } from 'i18next';
