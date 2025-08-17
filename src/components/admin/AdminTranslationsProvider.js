'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getAdminTranslations } from '@/lib/getAdminTranslations';

const TranslationsContext = createContext(null);

export const useAdminTranslations = () => useContext(TranslationsContext);

export default function AdminTranslationsProvider({ children }) {
  const [translations, setTranslations] = useState(null);
  const [lang, setLang] = useState('en'); // Default language

  useEffect(() => {
    getAdminTranslations(lang).then(setTranslations);
  }, [lang]);

  if (!translations) {
    return <p>Loading Admin UI...</p>;
  }

  // The value will also include a function to change the language later
  const value = { t: translations, setLang };

  return (
    <TranslationsContext.Provider value={value}>
      {children}
    </TranslationsContext.Provider>
  );
}
