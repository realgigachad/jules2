'use client';

import { useState, useEffect } from 'react';
import { useAppearance } from '@/components/admin/AppearanceSettings';

// Helper function to create a base64 encoded SVG placeholder
const createSvgPlaceholder = (text, bgColor, textColor) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="${bgColor}"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="30" dy=".3em" fill="${textColor}" text-anchor="middle">${text}</text></svg>`;
  const base64 = btoa(svg);
  return `data:image/svg+xml;base64,${base64}`;
};

const themes = [
  {
    id: 'default',
    name: 'Default',
    publicPreview: createSvgPlaceholder('Default Public', '#EEE', '#31343C'),
    adminPreview: createSvgPlaceholder('Default Admin', '#31343C', '#EEE'),
  },
  {
    id: 'single-page',
    name: 'Single Page',
    publicPreview: createSvgPlaceholder('Single Page Public', '#EEE', '#31343C'),
    adminPreview: createSvgPlaceholder('Single Page Admin', '#31343C', '#EEE'),
  },
  {
    id: 'playful',
    name: 'Playful',
    publicPreview: createSvgPlaceholder('Playful Public', '#fffef5', '#4f46e5'),
    adminPreview: createSvgPlaceholder('Playful Admin', '#4f46e5', '#fff'),
  },
];

export default function AdminAppearanceEditor() {
  const { adminAppearance, publicAppearance, setAppearance, isLoading } = useAppearance();
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSelectedTheme(publicAppearance || 'default');
  }, [publicAppearance]);

  if (isLoading) {
    return <p>Loading appearance settings...</p>;
  }

  const handleSetTheme = async (target) => {
    setIsSaving(true);
    setMessage('');
    const success = await setAppearance(selectedTheme, target);
    if (success) {
      const themeName = themes.find(t => t.id === selectedTheme)?.name || selectedTheme;
      setMessage(`Theme set to '${themeName}' for '${target}' target.`);
    } else {
      setMessage(`Error: Failed to set theme. Please check server logs or browser console.`);
    }
    setIsSaving(false);
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Themes</h2>
      <div className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`border-4 rounded-lg cursor-pointer transition-all ${selectedTheme === theme.id ? 'border-primary' : 'border-transparent hover:border-gray-300'}`}
            >
              <div className="bg-gray-200 p-4 rounded-t-md">
                <h3 className="font-bold text-lg text-center">{theme.name}</h3>
              </div>
              <div className="p-2 bg-gray-100 rounded-b-md space-y-2">
                <p className="text-xs text-center">Public Site Preview</p>
                <img src={theme.publicPreview} alt={`${theme.name} Public Preview`} className="w-full rounded shadow" />
                <p className="text-xs text-center mt-2">Admin Panel Preview</p>
                <img src={theme.adminPreview} alt={`${theme.name} Admin Preview`} className="w-full rounded shadow" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-gray-600 p-4 bg-blue-50 rounded-lg">
          <p>Current Public Theme: <span className="font-bold">{themes.find(t => t.id === publicAppearance)?.name || 'N/A'}</span></p>
          <p>Current Admin Theme: <span className="font-bold">{themes.find(t => t.id === adminAppearance)?.name || 'N/A'}</span></p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t">
            <p className="font-semibold">Set '<span className="text-primary">{themes.find(t => t.id === selectedTheme)?.name}</span>' as the theme for:</p>
            <button onClick={() => handleSetTheme('public')} disabled={isSaving} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50">Public Site</button>
            <button onClick={() => handleSetTheme('admin')} disabled={isSaving} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50">Admin Panel</button>
            <button onClick={() => handleSetTheme('both')} disabled={isSaving} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50">Both</button>
        </div>

        {message && <p className={`mt-4 text-sm text-center ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
      </div>
    </div>
  );
}
