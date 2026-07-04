import React, { createContext, useContext, useState } from 'react';

export type EasterEggButtonType = 'emergency-dial' | 'whatsapp' | 'ai-assistant';

interface EasterEggContextType {
  clickCount: number;
  lastClickedButton: EasterEggButtonType | null;
  showEasterEgg: boolean;
  registerClick: (button: EasterEggButtonType) => void;
  closeEasterEgg: () => void;
  resetClicks: () => void;
}

const EasterEggContext = createContext<EasterEggContextType | undefined>(undefined);

export function EasterEggProvider({ children }: { children: React.ReactNode }) {
  const [clickCount, setClickCount] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('srivelan_easter_clicks_new');
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [lastClickedButton, setLastClickedButton] = useState<EasterEggButtonType | null>(null);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const registerClick = (button: EasterEggButtonType) => {
    setLastClickedButton(button);
    setClickCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem('srivelan_easter_clicks_new', next.toString());
      } catch {
        // Safe fallback if localStorage is disabled
      }
      
      if (next >= 5) {
        setShowEasterEgg(true);
        return 0; // Reset counter for next cycle upon activation
      }
      return next;
    });
  };

  const closeEasterEgg = () => {
    setShowEasterEgg(false);
  };

  const resetClicks = () => {
    setClickCount(0);
    try {
      localStorage.setItem('srivelan_easter_clicks_new', '0');
    } catch {
      // Safe fallback
    }
  };

  return (
    <EasterEggContext.Provider
      value={{
        clickCount,
        lastClickedButton,
        showEasterEgg,
        registerClick,
        closeEasterEgg,
        resetClicks,
      }}
    >
      {children}
    </EasterEggContext.Provider>
  );
}

export function useEasterEgg() {
  const context = useContext(EasterEggContext);
  if (!context) {
    throw new Error('useEasterEgg must be used within an EasterEggProvider');
  }
  return context;
}
