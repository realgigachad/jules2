import { getTranslations } from '@/lib/getTranslations';
import DOMPurify from 'isomorphic-dompurify';

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
  const t = await getTranslations(lang);
  const article = await getArticle(id);

  if (!article) {
    return <div className="text-center">Article not found.</div>;
  }

  return (
    <div className="bg-white p-8 sm:p-12 rounded-lg shadow-lg">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-center font-header">
          {article.title[lang] || article.title.en}
        </h1>
        <p className="mt-4 text-center text-text/80">
          {t.articleDetailPage.publishedOn} {new Date(article.createdAt).toLocaleDateString()} {t.articleDetailPage.by} {article.author}
        </p>
        <div
          className="prose lg:prose-xl mt-12 mx-auto"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content[lang] || article.content.en) }}
        />
      </div>
    </div>
  );
}
