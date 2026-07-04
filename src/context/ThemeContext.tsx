import React, { createContext, useContext, useState, useEffect } from 'react';

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
      document.documentElement.classList.add('dark-high-contrast');
    } else {
      document.documentElement.classList.remove('dark-high-contrast');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
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
