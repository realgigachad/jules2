'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ArticleForm from '@/components/admin/ArticleForm';

export default function NewArticlePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (articleData) => {
    setIsSaving(true);
    setError('');
    try {
      const res = await fetch('/api/cms/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }, // No auth header
        body: JSON.stringify(articleData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create article');
      }

      router.push('/fonok/articles');
    } catch (err) {
      setError(err.message);
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Write New Article</h1>
      {error && <p className="text-red-500 bg-red-100 p-4 rounded-md mb-4">Error: {error}</p>}
      <ArticleForm onSubmit={handleSubmit} isSaving={isSaving} />
    </div>
  );
}
