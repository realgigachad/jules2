'use client';

import { useState, useEffect } from 'react';
import { useAppearance } from '@/components/admin/AppearanceSettings';

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
    // When the active public theme changes, update the selected theme to match
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
      setMessage(`Theme set to '${themes.find(t => t.id === selectedTheme)?.name}' for '${target}' target.`);
    } else {
      setMessage(`Error: Failed to set theme for '${target}' target.`);
    }
    setIsSaving(false);
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Themes</h2>
      <div className="space-y-6">

        {/* Theme Preview Gallery */}
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
              <div className="p-2 bg-gray-100 rounded-b-md">
                <p className="text-xs text-center mb-2">Public Site</p>
                <img src={`/img/theme-previews/public-${theme.id}.png`} alt={`${theme.name} Public Preview`} className="w-full rounded shadow" />
                <p className="text-xs text-center mt-4 mb-2">Admin Panel</p>
                <img src={`/img/theme-previews/admin-${theme.id}.png`} alt={`${theme.name} Admin Preview`} className="w-full rounded shadow" />
              </div>
            </div>
          ))}
        </div>

        {/* Active Theme Info */}
        <div className="text-center text-sm text-gray-600 p-4 bg-blue-50 rounded-lg">
          <p>Current Public Theme: <span className="font-bold">{themes.find(t => t.id === publicAppearance)?.name || 'N/A'}</span></p>
          <p>Current Admin Theme: <span className="font-bold">{themes.find(t => t.id === adminAppearance)?.name || 'N/A'}</span></p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t">
            <p className="font-semibold">Set '<span className="text-primary">{themes.find(t => t.id === selectedTheme)?.name}</span>' as the theme for:</p>
            <button onClick={() => handleSetTheme('public')} disabled={isSaving} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50">Public Site</button>
            <button onClick={() => handleSetTheme('admin')} disabled={isSaving} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50">Admin Panel</button>
            <button onClick={() => handleSetTheme('both')} disabled={isSaving} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50">Both</button>
        </div>

        {/* Feedback Message */}
        {message && <p className={`mt-4 text-sm text-center ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
      </div>
    </div>
  );
}
