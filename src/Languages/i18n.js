import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import home2_en from './en/home2.json';
import home2_fr from './fr/home2.json';

i18n.use(initReactI18next).init({
  debug: true,
  fallbackLng: 'en',

  resources: {
    en: {
      home2 : home2_en
    },

    fr: {
      home2 : home2_fr
    },
  },
});

export default i18n;
