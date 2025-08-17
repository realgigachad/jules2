'use client';

import { useState } from 'react';
import RichTextEditor from './RichTextEditor';

const languages = [
  { code: 'en', name: 'English (British/International)' },
  { code: 'de', name: 'Deutsch' },
  { code: 'hu', name: 'Magyar' },
  { code: 'ru', name: 'Русский' },
  { code: 'sk', name: 'Slovenčina' },
  { code: 'cs', name: 'Čeština' },
  { code: 'uk', name: 'Українська' },
];

const currencies = ['eur', 'gbp', 'huf', 'rub', 'czk', 'uah'];
const emptyMultilingual = { en: '', de: '', hu: '', ru: '', sk: '', cs: '', uk: '' };
const emptyPrices = { eur: 0, gbp: 0, huf: 0, rub: 0, czk: 0, uah: 0 };

const conversionRates = { eur: 1, gbp: 0.85, huf: 400, rub: 90, czk: 25, uah: 42 };

const priceFormatRules = {
  huf: (p) => Math.round(p / 1000) * 1000 - 10,
  eur: (p) => Math.floor(p) + 0.99,
  gbp: (p) => Math.floor(p) + 0.99,
  rub: (p) => Math.floor(p) + 9.99,
  czk: (p) => Math.floor(p) + 0.99,
  uah: (p) => Math.floor(p) + 9.99,
};

export default function TripForm({ initialData, onSubmit, isSaving }) {
  // Defensive state initialization to handle legacy data without a 'prices' object
  const [trip, setTrip] = useState({
    title: { ...emptyMultilingual },
    description: { ...emptyMultilingual },
    prices: { ...emptyPrices },
    startDate: '', endDate: '', imageUrl: '',
    ...initialData,
    prices: initialData?.prices || { ...emptyPrices },
  });

  const [currentLang, setCurrentLang] = useState('en');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrip(prev => ({ ...prev, [name]: value }));
  };

  const handleMultilingualChange = (e) => {
    const { name, value } = e.target;
    setTrip(prev => ({ ...prev, [name]: { ...prev[name], [currentLang]: value } }));
  };

  const handleDescriptionChange = (content) => {
    setTrip(prev => ({ ...prev, description: { ...prev.description, [currentLang]: content } }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setTrip(prev => ({ ...prev, prices: { ...prev.prices, [name]: parseFloat(value) || 0 } }));
  };

  const handlePriceBlur = (e) => {
    const { name, value } = e.target;
    const rule = priceFormatRules[name];
    const numericValue = parseFloat(value);
    if (rule && rule(numericValue) !== numericValue && numericValue > 0) {
      alert(`Reminder: For marketing, it's best for ${name.toUpperCase()} prices to follow the local convention (e.g., end in .99).`);
    }
  };

  const handleConvertPrices = (sourceCurrency) => {
    const baseValue = trip.prices[sourceCurrency];
    if (baseValue <= 0) {
      alert('Please enter a valid price in the source currency first.');
      return;
    }
    const baseInEur = baseValue / conversionRates[sourceCurrency];
    const newPrices = { ...trip.prices };
    for (const currency of currencies) {
      const converted = baseInEur * conversionRates[currency];
      if (currency !== sourceCurrency) {
        newPrices[currency] = priceFormatRules[currency](converted);
      }
    }
    setTrip(prev => ({ ...prev, prices: newPrices }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(trip);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-md">
      <div className="flex items-center border-b border-gray-200 pb-4">
        <label className="mr-4 font-medium">Language:</label>
        <div className="flex gap-2 flex-wrap">
          {languages.map(lang => (
            <button key={lang.code} type="button" onClick={() => setCurrentLang(lang.code)} className={`px-4 py-2 text-sm rounded-md ${currentLang === lang.code ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              {lang.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Trip Title ({languages.find(l => l.code === currentLang).name})</label>
          <input type="text" name="title" id="title" value={trip.title[currentLang]} onChange={handleMultilingualChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description ({languages.find(l => l.code === currentLang).name})</label>
          <div className="mt-1 h-64 bg-white">
            <RichTextEditor
              content={trip.description[currentLang]}
              onChange={handleDescriptionChange}
            />
          </div>
        </div>
      </div>

      <div className="pt-8"></div>

      <div className="border-t pt-8">
        <h3 className="text-xl font-bold mb-4">Pricing</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {currencies.map(currency => (
            <div key={currency}>
              <label htmlFor={currency} className="block text-sm font-medium text-gray-700">{currency.toUpperCase()}</label>
              <div className="flex items-center gap-1">
                <input type="number" step="0.01" name={currency} id={currency} value={trip.prices[currency]} onChange={handlePriceChange} onBlur={handlePriceBlur} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                <button type="button" onClick={() => handleConvertPrices(currency)} className="px-2 py-2 text-xs text-white bg-gray-500 rounded hover:bg-gray-600" title={`Convert from ${currency.toUpperCase()}`}>Conv.</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-8">
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
          <input type="text" name="imageUrl" id="imageUrl" value={trip.imageUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div></div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
          <input type="date" name="startDate" id="startDate" value={trip.startDate?.split('T')[0] || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
          <input type="date" name="endDate" id="endDate" value={trip.endDate?.split('T')[0] || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={isSaving} className="px-6 py-2 text-white bg-cyan-600 rounded-md hover:bg-cyan-700 disabled:bg-gray-400">
          {isSaving ? 'Saving...' : 'Save Trip'}
        </button>
      </div>
    </form>
  );
}
