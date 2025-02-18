import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import home2_en from './en/home2.json';
import home2_fr from './fr/home2.json';
import navbar_en from './en/navbar.json';
import navbar_fr from './fr/navbar.json';

i18n.use(initReactI18next).init({
  debug: true,
  fallbackLng: 'en',  // Ensures it falls back to English if French key is missing
  resources: {
    en: {
      navbar: navbar_en,
      home2 : home2_en
    },
    fr: {
      navbar: navbar_fr,
      home2 : home2_fr
    },
  }
});

export default i18n;