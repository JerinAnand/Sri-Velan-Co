import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>(() => {
    try {
      const stored = localStorage.getItem('srivelan_theme');
      if (stored === 'dark') return 'dark';
      if (stored === 'light') return 'light';
      
      // Check system-level prefers-color-scheme as default
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // Safe fallback
    }
    return 'light';
  });

  useEffect(() => {
    try {
      localStorage.setItem('srivelan_theme', theme);
    } catch {
      // Safe fallback
    }

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.add('dark-high-contrast');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.remove('dark-high-contrast');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
