import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  getValue: <T extends string | number>(id: string, defaultValue: T) => T;
  updateValue: (id: string, value: string | number) => void;
  revertValue: (id: string) => void;
  resetToDefaults: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  editableData: Record<string, string | number>;
  resetCategories: (categories: string[]) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('admin_session') === 'true';
    } catch {
      return false;
    }
  });

  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [editableData, setEditableData] = useState<Record<string, string | number>>(() => {
    try {
      const stored = localStorage.getItem('editable_data');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Keep localStorage in sync with editableData state
  useEffect(() => {
    try {
      localStorage.setItem('editable_data', JSON.stringify(editableData));
    } catch {
      // Safe fallback
    }
  }, [editableData]);

  // Handle keybindings (Ctrl + Shift + A) to toggle the admin login modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setShowLoginModal((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const login = (password: string): boolean => {
    // Password constant: SriVelan@2026 as required
    if (password === 'SriVelan@2026') {
      setIsAdmin(true);
      try {
        localStorage.setItem('admin_session', 'true');
      } catch {
        // Safe fallback
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem('admin_session');
    } catch {
      // Safe fallback
    }
  };

  const getValue = <T extends string | number>(id: string, defaultValue: T): T => {
    if (editableData[id] !== undefined) {
      const val = editableData[id];
      // Keep type safe conversion
      if (typeof defaultValue === 'number') {
        const parsed = Number(val);
        return (isNaN(parsed) ? defaultValue : parsed) as T;
      }
      return val as T;
    }
    return defaultValue;
  };

  const updateValue = (id: string, value: string | number) => {
    setEditableData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const revertValue = (id: string) => {
    setEditableData((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const resetCategories = (categories: string[]) => {
    setEditableData((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        let cat = '';
        if (key.startsWith('eq_spec_')) {
          cat = 'Equipment Specs';
        } else if (key.startsWith('zone_')) {
          cat = 'Project Counters';
        } else if (key.startsWith('milestone_')) {
          cat = 'Milestones';
        } else {
          cat = 'Stats';
        }
        if (categories.includes(cat)) {
          delete next[key];
        }
      });
      return next;
    });
  };

  const resetToDefaults = () => {
    setEditableData({});
    try {
      localStorage.removeItem('editable_data');
    } catch {
      // Safe fallback
    }
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        login,
        logout,
        getValue,
        updateValue,
        revertValue,
        resetToDefaults,
        showLoginModal,
        setShowLoginModal,
        editableData,
        resetCategories,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
