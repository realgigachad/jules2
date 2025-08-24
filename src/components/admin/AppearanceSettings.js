'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AppearanceContext = createContext();

export function useAppearance() {
  return useContext(AppearanceContext);
}

export function AppearanceProvider({ children, initialPublicAppearance }) {
  const [adminAppearance, setAdminAppearance] = useState('default');
  // Initialize public appearance from server prop if available, otherwise use default
  const [publicAppearance, setPublicAppearance] = useState(initialPublicAppearance || 'default');

  // Loading is only for the admin panel's initial fetch. Public site gets data from server.
  const [isLoading, setIsLoading] = useState(!initialPublicAppearance);

  useEffect(() => {
    // This effect now only runs in the admin panel context (where initialPublicAppearance is not passed)
    // to fetch the initial state for both themes.
    if (!initialPublicAppearance) {
      const fetchAllAppearances = async () => {
        setIsLoading(true);
        try {
          const res = await fetch('/api/cms/appearance');
          const data = await res.json();
          if (data.success && data.data) {
            setAdminAppearance(data.data.adminAppearance || 'default');
            setPublicAppearance(data.data.publicAppearance || 'default');
          }
        } catch (error) {
          console.error('Failed to load appearance settings:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAllAppearances();
    }
  }, [initialPublicAppearance]);

  // The save function now takes theme and target, and updates state based on API response
  const saveAppearance = async (theme, target) => {
    try {
      const res = await fetch('/api/cms/appearance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme, target }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          // Update local state to match the new persisted state
          setAdminAppearance(data.data.adminAppearance);
          setPublicAppearance(data.data.publicAppearance);
        }
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
    adminAppearance,
    publicAppearance,
    setAppearance: saveAppearance,
    isLoading,
  };

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}
