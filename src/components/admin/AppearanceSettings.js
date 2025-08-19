'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AppearanceContext = createContext();

export function useAppearance() {
  return useContext(AppearanceContext);
}

export function AppearanceProvider({ children }) {
  const [appearance, setAppearance] = useState('default');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppearance = async () => {
      try {
        const res = await fetch('/api/cms/appearance');
        const data = await res.json();
        if (data.success && data.data && data.data.appearance) {
          setAppearance(data.data.appearance);
        }
      } catch (error) {
        console.error('Failed to load appearance settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppearance();
  }, []);

  const saveAppearance = async (newAppearance) => {
    try {
      await fetch('/api/cms/appearance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appearance: newAppearance }),
      });
      setAppearance(newAppearance);
    } catch (error) {
      console.error('Failed to save appearance settings:', error);
    }
  };

  const value = {
    appearance,
    setAppearance: saveAppearance,
    isLoading,
  };

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}
