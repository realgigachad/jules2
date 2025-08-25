/**
 * @fileoverview This file defines the ArticleForm component, a form used for creating
 * and editing articles. It supports multilingual input for title and content fields.
 */
'use client';

import { useState } from 'react';
import RichTextEditor from './RichTextEditor';

// Configuration for the languages supported by the form.
const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'ru', name: 'Русский' },
  { code: 'sk', name: 'Slovenčina' },
  { code: 'cs', name: 'Čeština' },
  { code: 'uk', name: 'Українська' },
  { code: 'pl', name: 'Polski' },
  { code: 'sr', name: 'Srpski' },
];

// An object representing an empty set of multilingual fields.
const emptyMultilingual = { en: '', de: '', hu: '', ru: '', sk: '', cs: '', uk: '', pl: '', sr: '' };

/**
 * A form for creating or updating an article.
 * It features a language switcher to edit the title and content in multiple languages.
 *
 * @param {object} props - The component props.
 * @param {object} [props.initialData] - The initial data for the article, used when editing.
 * @param {Function} props.onSubmit - The function to call when the form is submitted.
 * @param {boolean} props.isSaving - A flag to indicate if the form is currently being saved.
 * @returns {JSX.Element} The rendered form component.
 */
export default function ArticleForm({ initialData, onSubmit, isSaving }) {
  // State for the article data. Initializes with initialData or a new empty article.
  const [article, setArticle] = useState(initialData || {
    title: { ...emptyMultilingual },
    content: { ...emptyMultilingual },
  });
  // State for the currently selected language tab.
  const [currentLang, setCurrentLang] = useState('en');

  /**
   * Handles changes from the RichTextEditor component.
   * @param {string} content - The new content from the editor (as a JSON string).
   */
  const handleContentChange = (content) => {
    setArticle(prev => ({
      ...prev,
      content: { ...prev.content, [currentLang]: content }
    }));
  };

  /**
   * Handles changes to the title input field.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleTitleChange = (e) => {
    const { value } = e.target;
    setArticle(prev => ({
      ...prev,
      title: { ...prev.title, [currentLang]: value }
    }));
  };

  /**
   * Handles the form submission.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(article);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-md">
      {/* Language switcher tabs */}
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

      {/* Form fields for the currently selected language */}
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

      {/* Submit button */}
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
