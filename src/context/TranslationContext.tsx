import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { translations as staticTranslations, Language, getValueByPath } from '../translations';
import { useSiteContent } from './SiteContentContext';

interface TranslationContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  updateTranslationKey: (key: string, enVal: string, taVal: string) => Promise<void>;
  updateAllTranslations: (translationsMap: Record<string, any>) => Promise<void>;
  liveTranslations: Record<string, any>;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { siteContent, updateSection } = useSiteContent();

  // Get initial language from localStorage or default to 'en'
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('srivelan_lang');
    return (saved === 'ta' || saved === 'en') ? (saved as Language) : 'en';
  });

  // Sync html lang attribute and store selection
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('srivelan_lang', language);
  }, [language]);

  const changeLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
  }, []);

  const liveTranslations = siteContent?.translations || staticTranslations;

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    // 1. Look up in live translations from Firestore for active language
    let value = getValueByPath(liveTranslations[language], key);
    
    // 2. Fallback to static translations for active language
    if (value === undefined) {
      value = getValueByPath(staticTranslations[language], key);
    }

    // 3. Fallback to live translations for English
    if (value === undefined) {
      value = getValueByPath(liveTranslations.en, key);
    }

    // 4. Fallback to static translations for English
    if (value === undefined) {
      value = getValueByPath(staticTranslations.en, key);
    }

    if (value === undefined || typeof value !== 'string') {
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
  }, [language, liveTranslations]);

  const updateTranslationKey = useCallback(async (key: string, enVal: string, taVal: string) => {
    const currentEn = liveTranslations.en || staticTranslations.en;
    const currentTa = liveTranslations.ta || staticTranslations.ta;

    const updatedEn = { ...currentEn, [key]: enVal };
    const updatedTa = { ...currentTa, [key]: taVal };

    await updateSection('translations', {
      en: updatedEn,
      ta: updatedTa,
    });
  }, [liveTranslations, updateSection]);

  const updateAllTranslations = useCallback(async (translationsMap: Record<string, any>) => {
    await updateSection('translations', translationsMap);
  }, [updateSection]);

  const contextValue = useMemo(
    () => ({
      language,
      changeLanguage,
      t,
      updateTranslationKey,
      updateAllTranslations,
      liveTranslations,
    }),
    [language, changeLanguage, t, updateTranslationKey, updateAllTranslations, liveTranslations]
  );

  return (
    <TranslationContext.Provider value={contextValue}>
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
