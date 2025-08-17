import Link from 'next/link';
import { getTranslations } from '@/lib/getTranslations';

async function getRecentArticles() {
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/public/articles?limit=3`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch articles');
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export default async function HomePage({ params: { lang } }) {
  const t = await getTranslations(lang);
  const recentArticles = await getRecentArticles();

  return (
    <div className="space-y-16">
      <section className="text-center bg-white p-12 rounded-lg shadow-lg">
        <h1 className="text-5xl font-extrabold text-gray-900">{t.homePage.heroTitle}</h1>
        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">{t.homePage.heroSubtitle}</p>
        <div className="mt-8">
          <Link href={`/${lang}/trips`} className="px-8 py-4 text-lg font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors">
            {t.homePage.heroButton}
          </Link>
        </div>
      </section>
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">{t.homePage.journalTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentArticles.map(article => (
            <div key={article._id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold my-2">{article.title[lang] || article.title.en}</h3>
                <div
                  className="text-gray-600 line-clamp-4 flex-grow"
                  dangerouslySetInnerHTML={{ __html: article.content[lang] || article.content.en }}
                />
                <div className="mt-4">
                  <Link href={`/${lang}/articles/${article._id}`} className="text-cyan-600 hover:underline font-semibold">
                    {t.homePage.readMore} &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {recentArticles.length === 0 && (
            <p className="text-center text-gray-500 col-span-3">{t.homePage.noArticles}</p>
          )}
        </div>
      </section>
    </div>
  );
}
