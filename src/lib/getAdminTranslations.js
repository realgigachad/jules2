const translations = {
  en: () => import('@/translations/admin_en.json').then((module) => module.default),
  de: () => import('@/translations/admin_de.json').then((module) => module.default),
  hu: () => import('@/translations/admin_hu.json').then((module) => module.default),
  ru: () => import('@/translations/admin_ru.json').then((module) => module.default),
  sk: () => import('@/translations/admin_sk.json').then((module) => module.default),
  cs: () => import('@/translations/admin_cs.json').then((module) => module.default),
  uk: () => import('@/translations/admin_uk.json').then((module) => module.default),
};

export const getAdminTranslations = async (locale) => {
  const lang = translations[locale] ? locale : 'en';
  return translations[lang]();
};
