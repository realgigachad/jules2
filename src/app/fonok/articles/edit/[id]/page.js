'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ArticleForm from '@/components/admin/ArticleForm';

export default function EditArticlePage() {
  const [initialData, setInitialData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        try {
          const res = await fetch(`/api/cms/articles/${id}`); // No headers
          if (!res.ok) throw new Error('Failed to fetch article data');
          const data = await res.json();
          setInitialData(data.data);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchArticle();
    }
  }, [id]);

  const handleSubmit = async (articleData) => {
    setIsSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/cms/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }, // No auth header
        body: JSON.stringify(articleData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update article');
      }

      router.push('/fonok/articles');
    } catch (err) {
      setError(err.message);
      setIsSaving(false);
    }
  };

  if (error && !initialData) return <p className="text-red-500">Error: {error}</p>;
  if (!initialData) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Article</h1>
      {error && <p className="text-red-500 bg-red-100 p-4 rounded-md mb-4">Error: {error}</p>}
      <ArticleForm initialData={initialData} onSubmit={handleSubmit} isSaving={isSaving} />
    </div>
  );
}
