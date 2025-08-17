'use client';

import { useState, useEffect } from 'react';

const fontOptions = [
  'Arial, sans-serif',
  'Verdana, sans-serif',
  'Georgia, serif',
  '"Times New Roman", serif',
  '"Courier New", monospace',
];

const defaultSchemes = {
  "Default": { primaryColor: '#00FFFF', backgroundColor: '#FFFFFF', textColor: '#000000' },
  "Dark": { primaryColor: '#00FFFF', backgroundColor: '#1a202c', textColor: '#FFFFFF' },
  "Mint": { primaryColor: '#34D399', backgroundColor: '#F0FFF4', textColor: '#1a202c' },
  "Plum": { primaryColor: '#8B5CF6', backgroundColor: '#F5F3FF', textColor: '#1a202c' },
};

const emptyStyle = {
  themeName: 'Default',
  primaryColor: '#00FFFF',
  backgroundColor: '#FFFFFF',
  textColor: '#000000',
  headerFont: 'Arial, sans-serif',
  bodyFont: 'Arial, sans-serif',
};

export default function StylingPage() {
  const [styleSettings, setStyleSettings] = useState(emptyStyle);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/cms/settings');
        const data = await res.json();
        if (data.success && data.data.style) {
          setStyleSettings(prev => ({ ...prev, ...data.data.style }));
        }
      } catch (err) {
        setError('Failed to load settings.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/cms/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ style: styleSettings }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save settings');
      setSuccess('Styles saved successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const applyScheme = (schemeName) => {
    const scheme = defaultSchemes[schemeName];
    if (scheme) {
      setStyleSettings(prev => ({ ...prev, ...scheme, themeName: schemeName }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStyleSettings(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) return <p>Loading styles...</p>;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Site Styling</h1>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Color Schemes</h3>
          <div className="flex gap-4 flex-wrap">
            {Object.keys(defaultSchemes).map(name => (
              <button key={name} onClick={() => applyScheme(name)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">{name}</button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Custom Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2"><label htmlFor="primaryColor">Primary:</label><input type="color" id="primaryColor" name="primaryColor" value={styleSettings.primaryColor} onChange={handleChange} /></div>
            <div className="flex items-center gap-2"><label htmlFor="backgroundColor">Background:</label><input type="color" id="backgroundColor" name="backgroundColor" value={styleSettings.backgroundColor} onChange={handleChange} /></div>
            <div className="flex items-center gap-2"><label htmlFor="textColor">Text:</label><input type="color" id="textColor" name="textColor" value={styleSettings.textColor} onChange={handleChange} /></div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Background Presets</h3>
          <select name="backgroundColor" value={styleSettings.backgroundColor} onChange={handleChange} className="p-2 border rounded-md bg-white">
            <option value="#FFFFFF">White</option><option value="#F7FAFC">Light Gray</option><option value="#4A5568">Dark Gray</option><option value="#1A202C">Black</option>
          </select>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Fonts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="headerFont">Header Font:</label>
              <select id="headerFont" name="headerFont" value={styleSettings.headerFont} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md bg-white">
                {fontOptions.map(font => <option key={font} value={font}>{font.split(',')[0]}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="bodyFont">Body Font:</label>
              <select id="bodyFont" name="bodyFont" value={styleSettings.bodyFont} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md bg-white">
                {fontOptions.map(font => <option key={font} value={font}>{font.split(',')[0]}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end items-center gap-4">
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}
        <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 text-white bg-cyan-600 rounded-md hover:bg-cyan-700 disabled:bg-gray-400">
          {isSaving ? 'Saving...' : 'Save Styles'}
        </button>
      </div>
    </div>
  );
}
