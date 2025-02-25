import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import home_en from './en/home.json'
import home_fr from './fr/home.json'
import home2_en from './en/home2.json';
import home2_fr from './fr/home2.json';
import typewriter_en from './en/type.json';
import typewriter_fr from './fr/type.json';

import aboutus_en from './en/about.json';
import aboutus_fr from './fr/about.json';
import aboutcard_en from './en/aboutcard.json';
import aboutcard_fr from './fr/aboutcard.json';

import navbar_en from './en/navbar.json';
import navbar_fr from './fr/navbar.json';

import blog_en from './en/blog.json';
import blog_fr from './fr/blog.json';

import project_en from './en/project.json';
import project_fr from './fr/project.json';


i18n.use(initReactI18next).init({
  debug: true,
  fallbackLng: 'en',  // Ensures it falls back to English if French key is missing
  resources: {
    en: {
      navbar: navbar_en,
      home2 : home2_en,
      home: home_en,
      typewriter: typewriter_en,
      about:aboutus_en,
      aboutcard:aboutcard_en,
      blog:blog_en,
      project:project_en
    },
    fr: {
      navbar: navbar_fr,
      home2 : home2_fr,
      home: home_fr,
      typewriter: typewriter_fr,
      about: aboutus_fr,
      aboutcard:aboutcard_fr,
      blog:blog_fr,
      project:project_fr
    },
  }
});

export default i18n;