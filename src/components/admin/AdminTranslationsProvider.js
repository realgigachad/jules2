/**
 * @fileoverview This file defines the AdminTranslationsProvider, a React context provider
 * that manages and distributes the administrative UI's translations.
 */
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getAdminTranslations } from '@/lib/getAdminTranslations';

// Create a context for the translations.
const TranslationsContext = createContext(null);

/**
 * A custom hook to easily access the admin translations and the language setter function.
 * @returns {{t: object, setLang: Function, lang: string}} The translation object, a function to set the language, and the current language.
 */
export const useAdminTranslations = () => useContext(TranslationsContext);

/**
 * The provider component that fetches and provides the admin translations.
 * It allows child components to access the translations and change the UI language.
 * @param {{children: React.ReactNode}} props - The component props.
 * @returns {JSX.Element} The provider component.
 */
export default function AdminTranslationsProvider({ children }) {
  const [translations, setTranslations] = useState(null);
  const [lang, setLang] = useState('en'); // Default language is English.

  // This effect re-fetches the translations whenever the `lang` state changes.
  useEffect(() => {
    getAdminTranslations(lang).then(setTranslations);
  }, [lang]);

  // Display a loading message until the initial translations are loaded.
  if (!translations) {
    return <p>Loading Admin UI...</p>;
  }

  // The value provided to the context includes the translations object (`t`),
  // the function to change the language (`setLang`), and the current language (`lang`).
  const value = { t: translations, setLang, lang };

  return (
    <TranslationsContext.Provider value={value}>
      {children}
    </TranslationsContext.Provider>
  );
}
