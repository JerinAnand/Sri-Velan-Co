import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageType = 'en' | 'ta';

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageType>(() => {
    try {
      const stored = localStorage.getItem('srivelan_language');
      if (stored === 'ta') return 'ta';
      if (stored === 'en') return 'en';
    } catch {
      // Safe fallback
    }
    return 'en';
  });

  useEffect(() => {
    try {
      localStorage.setItem('srivelan_language', language);
    } catch {
      // Safe fallback
    }
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: LanguageType) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'ta' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
