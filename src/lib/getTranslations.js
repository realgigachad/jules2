const translations = {
  en: () => import('@/translations/en.json').then((module) => module.default),
  de: () => import('@/translations/de.json').then((module) => module.default),
  hu: () => import('@/translations/hu.json').then((module) => module.default),
  ru: () => import('@/translations/ru.json').then((module) => module.default),
  sk: () => import('@/translations/sk.json').then((module) => module.default),
  cs: () => import('@/translations/cs.json').then((module) => module.default),
  uk: () => import('@/translations/uk.json').then((module) => module.default),
};

export const getTranslations = async (locale) => {
  const lang = translations[locale] ? locale : 'en';
  return translations[lang]();
};
