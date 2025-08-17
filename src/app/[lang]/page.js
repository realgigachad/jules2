import Link from 'next/link';

// This function fetches data on the server side.
async function getRecentArticles() {
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    // Removed the revalidate option to make it fully dynamic
    const res = await fetch(`${baseUrl}/api/public/articles?limit=3`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch articles');
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return []; // Return empty array on error
  }
}

export default async function HomePage({ params: { lang } }) {
  const recentArticles = await getRecentArticles();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center bg-white p-12 rounded-lg shadow-lg">
        <h1 className="text-5xl font-extrabold text-gray-900">Your Next Journey, by Rail</h1>
        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
          Discover the world from a different perspective. Unforgettable landscapes, comfortable journeys, and timeless memories await.
        </p>
        <div className="mt-8">
          <Link href={`/${lang}/trips`} className="px-8 py-4 text-lg font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors">
            Explore Upcoming Trips
          </Link>
        </div>
      </section>

      {/* Recent Articles Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">From Our Travel Journal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentArticles.map(article => (
            <div key={article._id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{article.title[lang] || article.title.en}</h3>
                <p className="text-gray-600 line-clamp-3">
                  {article.content[lang] || article.content.en}
                </p>
                <div className="mt-4">
                  {/* The user might want to click to a full article page, which doesn't exist yet. For now, this link does nothing. */}
                  <span className="text-cyan-600 hover:underline cursor-pointer">Read more &rarr;</span>
                </div>
              </div>
            </div>
          ))}
          {recentArticles.length === 0 && (
            <p className="text-center text-gray-500 col-span-3">No articles to display yet. Create one in the admin panel!</p>
          )}
        </div>
      </section>
    </div>
  );
}
