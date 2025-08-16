'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ArticlesListPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/cms/articles', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch articles');
        const data = await res.json();
        setArticles(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/cms/articles/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to delete article');
        setArticles(articles.filter(article => article._id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <p>Loading articles...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Articles</h1>
        <Link href="/fonok/articles/new" className="px-4 py-2 text-white bg-cyan-600 rounded-md hover:bg-cyan-700">
          + Write New Article
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-md">
        <ul className="divide-y divide-gray-200">
          {articles.length > 0 ? articles.map(article => (
            <li key={article._id} className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{article.title.en || 'Untitled Article'}</h3>
                <p className="text-sm text-gray-500">
                  Published on: {new Date(article.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/fonok/articles/edit/${article._id}`} className="text-sm text-cyan-600 hover:underline">
                  Edit
                </Link>
                <button onClick={() => handleDelete(article._id)} className="text-sm text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </li>
          )) : (
            <li className="p-4 text-center text-gray-500">No articles found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
