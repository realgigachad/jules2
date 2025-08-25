/**
 * @fileoverview This file provides a function to dynamically load public-facing translations based on the given locale.
 * It defaults to English if the specified locale is not available.
 */

// A map of available locales to their corresponding translation file.
// The translations are loaded dynamically using import() to support code splitting.
const translations = {
  en: () => import('@/translations/en.json').then((module) => module.default),
  de: () => import('@/translations/de.json').then((module) => module.default),
  hu: () => import('@/translations/hu.json').then((module) => module.default),
  ru: () => import('@/translations/ru.json').then((module) => module.default),
  sk: () => import('@/translations/sk.json').then((module) => module.default),
  cs: () => import('@/translations/cs.json').then((module) => module.default),
  uk: () => import('@/translations/uk.json').then((module) => module.default),
};

/**
 * Asynchronously loads the public translations for a given locale.
 * If the locale is not found, it falls back to English ('en').
 * @param {string} locale - The desired locale (e.g., 'en', 'de').
 * @returns {Promise<object>} A promise that resolves to the translations object for the specified locale.
 */
export const getTranslations = async (locale) => {
  const lang = translations[locale] ? locale : 'en';
  return translations[lang]();
};
