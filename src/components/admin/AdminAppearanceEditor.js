'use client';

import { useState } from 'react';
import { useAppearance } from '@/components/admin/AppearanceSettings';

export default function AdminAppearanceEditor() {
  const { appearance, setAppearance, isLoading } = useAppearance();
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading) {
    return <p>Loading appearance settings...</p>;
  }

  const handleThemeChange = async (newTheme) => {
    setIsSaving(true);
    setMessage('');
    const success = await setAppearance(newTheme);
    if (success) {
      setMessage('Theme saved successfully!');
    } else {
      setMessage('Error: Failed to save theme. Please check server logs.');
    }
    setIsSaving(false);
    setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Admin Panel Appearance</h2>
      <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
        <p className="text-gray-600">Select a theme for the admin panel.</p>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => handleThemeChange('default')}
            disabled={isSaving}
            className={`px-4 py-2 border rounded-lg ${appearance === 'default' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
          >
            Default
          </button>
          <button
            onClick={() => handleThemeChange('compact')}
            disabled={isSaving}
            className={`px-4 py-2 border rounded-lg ${appearance === 'compact' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
          >
            Compact
          </button>
          <button
            onClick={() => handleThemeChange('playful')}
            disabled={isSaving}
            className={`px-4 py-2 border rounded-lg ${appearance === 'playful' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
          >
            Playful
          </button>
          {isSaving && <p className="text-sm text-gray-500">Saving...</p>}
        </div>
        {message && <p className={`mt-4 text-sm ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
      </div>
    </div>
  );
}
