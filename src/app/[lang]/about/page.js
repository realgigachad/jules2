import { getTranslations } from '@/lib/getTranslations';

export default async function AboutUsPage({ params: { lang } }) {
  const t = await getTranslations(lang);

  return (
    <div className="bg-white p-12 rounded-lg shadow-lg">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900">{t.aboutPage.title}</h1>
        <p className="mt-4 text-center text-xl text-gray-600">{t.aboutPage.subtitle}</p>

        <div className="mt-12 space-y-8 text-lg text-gray-700">
          <p>{t.aboutPage.body1}</p>
          <p>{t.aboutPage.body2}</p>

          <div className="border-l-4 border-cyan-500 pl-6">
            <h3 className="text-2xl font-bold text-gray-800">{t.aboutPage.missionTitle}</h3>
            <p className="mt-2 text-gray-600">{t.aboutPage.missionText}</p>
          </div>

          <p>{t.aboutPage.body3}</p>
          <p>{t.aboutPage.body4}</p>
        </div>
      </div>
    </div>
  );
}
