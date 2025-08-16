'use client';

import { useState } from 'react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'ru', name: 'Russian' },
  { code: 'sk', name: 'Slovakian' },
];

const emptyMultilingual = { en: '', de: '', hu: '', ru: '', sk: '' };

export default function TripForm({ initialData, onSubmit, isSaving }) {
  const [trip, setTrip] = useState(initialData || {
    title: { ...emptyMultilingual },
    description: { ...emptyMultilingual },
    price: 0,
    startDate: '',
    endDate: '',
    imageUrl: '',
  });
  const [currentLang, setCurrentLang] = useState('en');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['title', 'description'].includes(name)) {
      setTrip(prev => ({
        ...prev,
        [name]: { ...prev[name], [currentLang]: value }
      }));
    } else {
      setTrip(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    // The browser returns date as YYYY-MM-DD, which is what we need.
    setTrip(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(trip);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-md">
      {/* Language Switcher */}
      <div className="flex items-center border-b border-gray-200 pb-4">
        <label className="mr-4 font-medium">Language:</label>
        <div className="flex gap-2">
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

      {/* Multilingual Fields */}
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Trip Title ({languages.find(l => l.code === currentLang).name})
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={trip.title[currentLang]}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description ({languages.find(l => l.code === currentLang).name})
          </label>
          <textarea
            name="description"
            id="description"
            rows="6"
            value={trip.description[currentLang]}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
            required
          />
        </div>
      </div>

      {/* General Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
          <input type="number" name="price" id="price" value={trip.price} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
        </div>
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
          <input type="text" name="imageUrl" id="imageUrl" value={trip.imageUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
          <input type="date" name="startDate" id="startDate" value={trip.startDate?.split('T')[0] || ''} onChange={handleDateChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
          <input type="date" name="endDate" id="endDate" value={trip.endDate?.split('T')[0] || ''} onChange={handleDateChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 text-white bg-cyan-600 rounded-md hover:bg-cyan-700 disabled:bg-gray-400"
        >
          {isSaving ? 'Saving...' : 'Save Trip'}
        </button>
      </div>
    </form>
  );
}
