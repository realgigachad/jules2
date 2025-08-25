'use client';

import { useState, useEffect } from 'react';
import AdminAppearanceEditor from '@/components/admin/AdminAppearanceEditor';

const fontOptions = [
  'Arial, sans-serif',
  'Verdana, sans-serif',
  'Georgia, serif',
  '"Times New Roman", serif',
  '"Courier New", monospace',
  '"Roboto", sans-serif',
  '"Open Sans", sans-serif',
];

const newDefaultStyle = {
  themeName: 'Default',
  primaryColor: '#0891b2',
  backgroundColor: '#FFFFFF',
  textColor: '#1f2937',
  headerFont: 'Georgia, serif',
  bodyFont: 'Arial, sans-serif',
};

const defaultSchemes = {
  "Default": { primaryColor: '#0891b2', backgroundColor: '#FFFFFF', textColor: '#1f2937' },
  "Dark": { primaryColor: '#22d3ee', backgroundColor: '#1f2937', textColor: '#e5e7eb' },
  "Mint": { primaryColor: '#10b981', backgroundColor: '#f0fdf4', textColor: '#1f2937' },
  "Plum": { primaryColor: '#a78bfa', backgroundColor: '#f5f3ff', textColor: '#1f2937' },
};

// Live Preview Component
function LivePreview({ styleSettings }) {
  const { primaryColor, backgroundColor, textColor, headerFont, bodyFont } = styleSettings;

  const previewStyle = {
    backgroundColor: backgroundColor,
    color: textColor,
    fontFamily: bodyFont,
    borderColor: primaryColor,
  };

  const headerStyle = {
    fontFamily: headerFont,
    color: primaryColor,
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
      <div className="border-4 rounded-lg p-6" style={previewStyle}>
        <h4 className="text-2xl font-bold mb-2" style={headerStyle}>A Sample Header</h4>
        <p className="text-sm">This is some sample body text to demonstrate the selected fonts and colors. The quick brown fox jumps over the lazy dog.</p>
        <button className="mt-4 px-4 py-2 rounded-md text-white" style={{ backgroundColor: primaryColor }}>
          A Button
        </button>
      </div>
    </div>
  );
}


export function StylingSection() {
  const [styleSettings, setStyleSettings] = useState(newDefaultStyle);
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
          setStyleSettings({ ...newDefaultStyle, ...data.data.style });
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Color scheme presets</h3>
            <div className="flex gap-4 flex-wrap">
              {Object.keys(defaultSchemes).map(name => (
                <button key={name} onClick={() => applyScheme(name)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">{name}</button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Background Presets</h3>
            <select name="backgroundColor" value={styleSettings.backgroundColor} onChange={handleChange} className="p-2 border rounded-md bg-white w-full">
              <option value="#FFFFFF">White</option><option value="#f3f4f6">Light Gray</option><option value="#4b5563">Dark Gray</option><option value="#111827">Black</option>
            </select>
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

        <LivePreview styleSettings={styleSettings} />

        <div>
          <h3 className="text-lg font-semibold mb-2">Fonts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="headerFont">Header Font:</label>
              <select id="headerFont" name="headerFont" value={styleSettings.headerFont} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md bg-white">
                {fontOptions.map(font => <option key={font} value={font}>{font.split(',')[0].replace(/"/g, '')}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="bodyFont">Body Font:</label>
              <select id="bodyFont" name="bodyFont" value={styleSettings.bodyFont} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md bg-white">
                {fontOptions.map(font => <option key={font} value={font}>{font.split(',')[0].replace(/"/g, '')}</option>)}
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

      <hr className="my-12 border-t-2 border-gray-200" />

      <AdminAppearanceEditor />
    </div>
  );
}

export default StylingSection;
