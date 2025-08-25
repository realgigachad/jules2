/**
 * @fileoverview This file defines the server component for the homepage.
 * It fetches recent articles and displays a hero section along with the articles.
 */
import Link from 'next/link';
import { getTranslations } from '@/lib/getTranslations';
import AnimatedSection from '@/components/public/AnimatedSection';

/**
 * Fetches the 3 most recent articles from the public API.
 * Uses `cache: 'no-store'` to ensure the data is always fresh.
 * @returns {Promise<Array>} A promise that resolves to an array of recent articles.
 */
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

/**
 * The main component for the homepage.
 * @param {object} props - The component props.
 * @param {{lang: string}} props.params - The route parameters, containing the current language.
 * @returns {Promise<JSX.Element>} The rendered homepage.
 */
export default async function HomePage({ params: { lang } }) {
  const t = await getTranslations(lang);
  const recentArticles = await getRecentArticles();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <AnimatedSection>
        <section className="text-center bg-white p-12 rounded-lg shadow-lg">
          <h1 className="text-5xl font-extrabold text-gray-900 font-header">{t.homePage.heroTitle}</h1>
          <p className="mt-4 text-xl text-text/80 max-w-2xl mx-auto">{t.homePage.heroSubtitle}</p>
          <div className="mt-8">
            <Link href={`/${lang}/trips`} className="px-8 py-4 text-lg font-semibold text-white bg-primary rounded-lg hover:opacity-90 transition-opacity">
              {t.homePage.heroButton}
            </Link>
          </div>
        </section>
      </AnimatedSection>

      {/* Recent Articles Section */}
      <AnimatedSection>
        <section>
          <h2 className="text-3xl font-bold text-center mb-8 font-header">{t.homePage.journalTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentArticles.map(article => (
              <div key={article._id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col group">
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-semibold my-2 font-header">{article.title[lang] || article.title.en}</h3>
                  {/* The article content is rendered using dangerouslySetInnerHTML because it comes from a rich text editor. */}
                  <div
                    className="text-text/80 line-clamp-4 flex-grow prose"
                    dangerouslySetInnerHTML={{ __html: article.content[lang] || article.content.en }}
                  />
                  <div className="mt-4">
                    <Link href={`/${lang}/articles/${article._id}`} className="text-primary hover:underline font-semibold">
                      {t.homePage.readMore} &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {/* Display a message if there are no articles to show. */}
            {recentArticles.length === 0 && (
              <p className="text-center text-text/70 col-span-3">{t.homePage.noArticles}</p>
            )}
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
