/**
 * @fileoverview This file defines the AppearanceProvider and useAppearance hook,
 * which together manage the visual theme settings for the entire application
 * (both public and admin areas) using React's Context API.
 */
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Create a context to hold appearance settings.
const AppearanceContext = createContext();

/**
 * A custom hook to easily access the appearance context.
 * @returns {{adminAppearance: string, publicAppearance: string, setAppearance: Function, isLoading: boolean}} The context value.
 */
export function useAppearance() {
  return useContext(AppearanceContext);
}

/**
 * The provider component for appearance settings. It handles fetching, storing,
 * and updating the themes for the admin and public parts of the site.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the provider.
 * @param {string} [props.initialPublicAppearance] - The initial public appearance, passed as a prop from a server component to avoid a client-side fetch on the public site.
 * @returns {JSX.Element} The provider component.
 */
export function AppearanceProvider({ children, initialPublicAppearance }) {
  const [adminAppearance, setAdminAppearance] = useState('default');
  // Initialize public appearance from the server-side prop if available, otherwise use a default.
  const [publicAppearance, setPublicAppearance] = useState(initialPublicAppearance || 'default');

  // The loading state is primarily for the admin panel's initial fetch.
  // The public site gets its data from props, so it should not be in a loading state.
  const [isLoading, setIsLoading] = useState(!initialPublicAppearance);

  useEffect(() => {
    // This effect only runs in the admin panel context (where `initialPublicAppearance` is not passed)
    // to fetch the initial state for both the admin and public themes from the database.
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

  /**
   * Saves the selected theme for a specific target (public, admin, or both) to the database.
   * On success, it updates the local state to match the newly persisted state.
   * @param {string} theme - The ID of the theme to set (e.g., 'default', 'playful').
   * @param {'public' | 'admin' | 'both'} target - The area to apply the theme to.
   * @returns {Promise<boolean>} A promise that resolves to true on success, false on failure.
   */
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
          // Update local state to match the new persisted state from the API response.
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

  // The value provided to consuming components.
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
