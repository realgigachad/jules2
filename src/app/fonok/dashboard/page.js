'use client';

import { useAdminTranslations } from '@/components/admin/AdminTranslationsProvider';

export default function DashboardPage() {
  const { t } = useAdminTranslations();

  // The provider shows a loading state, so t should not be null here.
  if (!t) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{t.dashboard.title}</h1>
      <p className="mt-4 text-lg text-gray-600">{t.dashboard.welcome}</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">{t.dashboard.manageTrips}</h2>
          <p className="mt-2 text-gray-600">{t.dashboard.manageTripsDesc}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">{t.dashboard.manageArticles}</h2>
          <p className="mt-2 text-gray-600">{t.dashboard.manageArticlesDesc}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">{t.dashboard.updateSettings}</h2>
          <p className="mt-2 text-gray-600">{t.dashboard.updateSettingsDesc}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">{t.dashboard.updateStyling}</h2>
          <p className="mt-2 text-gray-600">{t.dashboard.updateStylingDesc}</p>
        </div>
      </div>
    </div>
  );
}
