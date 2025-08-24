'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AppearanceContext = createContext();

export function useAppearance() {
  return useContext(AppearanceContext);
}

export function AppearanceProvider({ children, initialAppearance }) {
  const [appearance, setAppearance] = useState(initialAppearance || 'default');
  // If we have an initial appearance, we are not loading. Otherwise, we are.
  const [isLoading, setIsLoading] = useState(!initialAppearance);

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

    // Only fetch if we didn't get an initial value (i.e., in the admin panel)
    if (!initialAppearance) {
      fetchAppearance();
    }
  }, [initialAppearance]);

  const saveAppearance = async (newAppearance) => {
    try {
      const res = await fetch('/api/cms/appearance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appearance: newAppearance }),
      });

      if (res.ok) {
        setAppearance(newAppearance);
        return true;
      } else {
        console.error('Failed to save appearance settings:', await res.text());
        return false;
      }
    } catch (error) {
      console.error('Failed to save appearance settings:', error);
      return false;
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
