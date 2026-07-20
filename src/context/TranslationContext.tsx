import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, Language, getValueByPath } from '../translations';

interface TranslationContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get initial language from localStorage or default to 'en'
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('srivelan_lang');
    return (saved === 'ta' || saved === 'en') ? saved as Language : 'en';
  });

  // Sync html lang attribute and store selection
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('srivelan_lang', language);
  }, [language]);

  const changeLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const value = getValueByPath(translations[language], key) ?? getValueByPath(translations.en, key);
    if (value === undefined) {
      return key;
    }
    if (typeof value !== 'string') {
      return key;
    }

    if (params) {
      let result = value;
      for (const [pKey, pValue] of Object.entries(params)) {
        result = result.replaceAll(`{${pKey}}`, String(pValue));
      }
      return result;
    }
    return value;
  }, [language]);

  return (
    <TranslationContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
