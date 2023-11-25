import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from '../translations';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
  },
  // Use localize library to get the device language
  // lng: RNLocalize.getLocales()[0].languageTag,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
