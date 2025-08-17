async function getArticles() {
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/public/articles`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch articles');
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export default async function ArticlesPage({ params: { lang } }) {
  const articles = await getArticles();

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">Travel Journal</h1>
        <p className="mt-2 text-lg text-gray-600">Stories and insights from our journeys.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map(article => (
          <div key={article._id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
            <div className="p-6">
              <p className="text-sm text-gray-500">{new Date(article.createdAt).toLocaleDateString()}</p>
              <h3 className="text-xl font-semibold my-2">{article.title[lang] || article.title.en}</h3>
              <p className="text-gray-600 line-clamp-4">
                {article.content[lang] || article.content.en}
              </p>
              <div className="mt-4">
                <Link href={`/${lang}/articles/${article._id}`} className="text-cyan-600 hover:underline font-semibold">
                  Read more &rarr;
                </Link>
              </div>
            </div>
          </div>
        ))}
        {articles.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">No articles to display yet.</p>
        )}
      </div>
    </div>
  );
}
