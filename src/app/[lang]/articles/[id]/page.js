async function getArticle(id) {
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/public/articles/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

export default async function ArticleDetailPage({ params: { lang, id } }) {
  const article = await getArticle(id);

  if (!article) {
    return <div className="text-center">Article not found.</div>;
  }

  return (
    <div className="bg-white p-8 sm:p-12 rounded-lg shadow-lg">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 text-center">
          {article.title[lang] || article.title.en}
        </h1>
        <p className="mt-4 text-center text-gray-500">
          Published on {new Date(article.createdAt).toLocaleDateString()} by {article.author}
        </p>
        <div
          className="prose lg:prose-xl mt-12 mx-auto"
          dangerouslySetInnerHTML={{ __html: article.content[lang] || article.content.en }}
        />
      </div>
    </div>
  );
}
