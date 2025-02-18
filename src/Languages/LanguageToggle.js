import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    const savedLanguage = Cookies.get('language') || 'en';
    setLanguage(savedLanguage);
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);

  const handleLanguageToggle = () => {
    const newLanguage = language === 'en' ? 'fr' : 'en';
    Cookies.set('language', newLanguage, { expires: 365 });
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  return (
      <button className="btn btn-outline-light" onClick={handleLanguageToggle}>
        {language === 'en' ? 'FR' : 'EN'}
      </button>
  );
};


export default LanguageToggle;
