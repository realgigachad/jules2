'use client';

import { useState, useEffect } from 'react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'ru', name: 'Russian' },
  { code: 'sk', name: 'Slovakian' },
];

const emptyMultilingual = { en: '', de: '', hu: '', ru: '', sk: '' };

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    contactEmail: '',
    contactPhone: '',
    address: { ...emptyMultilingual },
  });
  const [currentLang, setCurrentLang] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/cms/settings'); // No headers
        if (!res.ok) throw new Error('Failed to fetch settings');
        const data = await res.json();
        const address = { ...emptyMultilingual, ...(data.data.address || {}) };
        setSettings({ ...data.data, address });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'address') {
      setSettings(prev => ({
        ...prev,
        address: { ...prev.address, [currentLang]: value }
      }));
    } else {
      setSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/cms/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }, // No auth header
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to save settings');
      }
      setSuccess('Settings saved successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p>Loading settings...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Site Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input type="email" name="contactEmail" id="contactEmail" value={settings.contactEmail} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">Contact Phone</label>
            <input type="tel" name="contactPhone" id="contactPhone" value={settings.contactPhone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
        </div>

        <div>
          <div className="flex items-center border-b border-gray-200 pb-4 mb-4">
            <label className="mr-4 font-medium">Address Language:</label>
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
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address ({languages.find(l => l.code === currentLang).name})</label>
            <textarea
              name="address"
              id="address"
              rows="3"
              value={settings.address[currentLang]}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

        <div className="flex justify-end items-center gap-4">
          {error && <p className="text-sm text-red-500">Error: {error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 text-white bg-cyan-600 rounded-md hover:bg-cyan-700 disabled:bg-gray-400"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
