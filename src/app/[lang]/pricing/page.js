import Link from 'next/link';
import { getTranslations } from '@/lib/getTranslations';

export default async function PricingPage({ params: { lang } }) {
  const t = await getTranslations(lang);

  return (
    <div className="bg-white p-12 rounded-lg shadow-lg">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 font-header">{t.pricingPage.title}</h1>

      <div className="max-w-4xl mx-auto mt-8 space-y-8 text-lg text-text/90">
        <p>{t.pricingPage.body1}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="playful-card p-6 border rounded-lg">
            <h3 className="text-2xl font-bold text-primary font-header">{t.pricingPage.standardClass}</h3>
            <p className="mt-2 text-text/80">{t.pricingPage.standardDesc}</p>
          </div>
          <div className="playful-card p-6 border rounded-lg">
            <h3 className="text-2xl font-bold text-primary font-header">{t.pricingPage.firstClass}</h3>
            <p className="mt-2 text-text/80">{t.pricingPage.firstDesc}</p>
          </div>
          <div className="playful-card p-6 border rounded-lg">
            <h3 className="text-2xl font-bold text-primary font-header">{t.pricingPage.sleeperCabin}</h3>
            <p className="mt-2 text-text/80">{t.pricingPage.sleeperDesc}</p>
          </div>
        </div>

        <p>{t.pricingPage.body2}</p>

        <div className="text-center mt-12">
          <Link href={`/${lang}/trips`} className="playful-button inline-block px-8 py-4 text-lg font-semibold text-white bg-primary rounded-lg hover:opacity-90 transition-opacity">
            {t.pricingPage.button}
          </Link>
        </div>
      </div>
    </div>
  );
}
