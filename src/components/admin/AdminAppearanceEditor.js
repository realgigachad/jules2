'use client';

import { useState, useEffect } from 'react';
import { useAppearance } from '@/components/admin/AppearanceSettings';

// --- SVG Illustration Generators ---

const createAdminSvg = (theme) => {
  let header, mainContent;
  const bgColor = '#1f2937'; // Admin background
  const primaryColor = '#4f46e5'; // A generic primary for previews
  const textColor = '#FFFFFF';

  switch (theme) {
    case 'playful':
      header = `<rect x="5" y="15" width="90" height="370" fill="${primaryColor}" rx="8" transform="rotate(-2 50 185)" />`;
      mainContent = `<rect x="110" y="15" width="475" height="370" fill="#E5E7EB" rx="8" />`;
      break;
    case 'single-page': // In admin, single-page (formerly compact) has no sidebar
    default: // Default also has a sidebar
      header = `<rect x="15" y="15" width="120" height="370" fill="${bgColor}" rx="8" />`;
      mainContent = `<rect x="150" y="15" width="435" height="370" fill="#E5E7EB" rx="8" />`;
      break;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#F3F4F6"/><g>${header}${mainContent}</g><text x="50%" y="90%" font-family="Arial" font-size="20" fill="#6B7280" text-anchor="middle">Admin Panel</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

const createPublicSvg = (theme) => {
  let header, mainContent;
  const bgColor = '#FFFFFF';
  const primaryColor = '#0891b2';
  const textColor = '#374151';

  switch (theme) {
    case 'playful':
       header = `<rect x="5" y="15" width="90" height="370" fill="${primaryColor}" rx="8" transform="rotate(-2 50 185)" />`;
       mainContent = `<rect x="110" y="15" width="475" height="370" fill="${bgColor}" rx="8" />`;
       break;
    case 'single-page':
      header = `<rect x="15" y="15" width="570" height="50" fill="${bgColor}" rx="8" />`;
      mainContent = `<g><rect x="15" y="80" width="570" height="80" fill="#F3F4F6" rx="8" /><rect x="15" y="175" width="570" height="80" fill="#F3F4F6" rx="8" /><rect x="15" y="270" width="570" height="80" fill="#F3F4F6" rx="8" /></g>`;
      break;
    default:
      header = `<rect x="15" y="15" width="570" height="50" fill="${bgColor}" rx="8" />`;
      mainContent = `<rect x="15" y="80" width="570" height="305" fill="#F3F4F6" rx="8" />`;
      break;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#E5E7EB"/><g>${header}${mainContent}</g><text x="50%" y="90%" font-family="Arial" font-size="20" fill="#6B7280" text-anchor="middle">Public Site</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};


const themes = [
  { id: 'default', name: 'Default' },
  { id: 'single-page', name: 'Single Page' },
  { id: 'playful', name: 'Playful' },
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
      setMessage(`Error: Failed to save theme. Please check server logs or browser console.`);
    }
    setIsSaving(false);
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <div className="mt-8">
      <h1 className="text-2xl font-bold mb-6">Appearance</h1>
      <h2 className="text-xl font-semibold mb-4">Global Themes</h2>
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
              <div className="p-4 bg-gray-100 rounded-b-md space-y-4">
                <img src={createPublicSvg(theme.id)} alt={`${theme.name} Public Preview`} className="w-full rounded shadow-inner" />
                <img src={createAdminSvg(theme.id)} alt={`${theme.name} Admin Preview`} className="w-full rounded shadow-inner" />
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
