'use client';

import { useState } from 'react';
import RichTextEditor from './RichTextEditor';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'ru', name: 'Русский' },
  { code: 'sk', name: 'Slovenčina' },
  { code: 'cs', name: 'Čeština' },
  { code: 'uk', name: 'Українська' },
];

const emptyMultilingual = { en: '', de: '', hu: '', ru: '', sk: '', cs: '', uk: '' };

export default function ArticleForm({ initialData, onSubmit, isSaving }) {
  const [article, setArticle] = useState(initialData || {
    title: { ...emptyMultilingual },
    content: { ...emptyMultilingual },
  });
  const [currentLang, setCurrentLang] = useState('en');

  const handleContentChange = (content) => {
    setArticle(prev => ({
      ...prev,
      content: { ...prev.content, [currentLang]: content }
    }));
  };

  const handleTitleChange = (e) => {
    const { value } = e.target;
    setArticle(prev => ({
      ...prev,
      title: { ...prev.title, [currentLang]: value }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(article);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-md">
      <div className="flex items-center border-b border-gray-200 pb-4">
        <label className="mr-4 font-medium">Language:</label>
        <div className="flex gap-2 flex-wrap">
          {languages.map(lang => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setCurrentLang(lang.code)}
              className={`px-4 py-2 text-sm rounded-md ${currentLang === lang.code ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Article Title ({languages.find(l => l.code === currentLang).name})
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={article.title[currentLang]}
            onChange={handleTitleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content ({languages.find(l => l.code === currentLang).name})
          </label>
          <div className="mt-1 h-64 bg-white">
            <RichTextEditor
              content={article.content[currentLang]}
              onChange={handleContentChange}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-8">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 text-white bg-cyan-600 rounded-md hover:bg-cyan-700 disabled:bg-gray-400"
        >
          {isSaving ? 'Saving...' : 'Save Article'}
        </button>
      </div>
    </form>
  );
}
