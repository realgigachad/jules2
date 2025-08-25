'use client';

import Link from 'next/link';
import { useAdminTranslations } from '@/components/admin/AdminTranslationsProvider';
import { useAppearance } from '@/components/admin/AppearanceSettings';
import { TripsSection } from '../trips/page.js';
import { ArticlesSection } from '../articles/page.js';
import { SettingsSection } from '../settings/page.js';
import { StylingSection } from '../styling/page.js';

function DashboardWelcome() {
  const { t } = useAdminTranslations();
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.dashboard.title}</h1>
      <p className="text-lg text-gray-600 mb-8">{t.dashboard.welcome}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="#trips" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-xl mb-2">{t.dashboard.manageTrips}</h3>
          <p className="text-sm text-gray-600">{t.dashboard.manageTripsDesc}</p>
        </Link>
        <Link href="#articles" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-xl mb-2">{t.dashboard.manageArticles}</h3>
          <p className="text-sm text-gray-600">{t.dashboard.manageArticlesDesc}</p>
        </Link>
        <Link href="#settings" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-xl mb-2">{t.dashboard.updateSettings}</h3>
          <p className="text-sm text-gray-600">{t.dashboard.updateSettingsDesc}</p>
        </Link>
        <Link href="#styling" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-xl mb-2">{t.dashboard.updateStyling}</h3>
          <p className="text-sm text-gray-600">{t.dashboard.updateStylingDesc}</p>
        </Link>
      </div>
    </div>
  );
}


export default function DashboardPage() {
  const { adminAppearance } = useAppearance();

  if (adminAppearance !== 'single-page') {
    return <DashboardWelcome />;
  }

  // Render all sections for the single-page theme
  return (
    <div className="space-y-12">
      <section id="dashboard">
        <DashboardWelcome />
      </section>
      <hr />
      <section id="trips">
        <TripsSection />
      </section>
      <hr />
      <section id="articles">
        <ArticlesSection />
      </section>
      <hr />
      <section id="settings">
        <SettingsSection />
      </section>
      <hr />
      <section id="styling">
        <StylingSection />
      </section>
    </div>
  );
}
