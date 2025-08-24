'use client';

import { useAppearance } from '@/components/admin/AppearanceSettings';

export default function AdminAppearanceEditor() {
  const { appearance, setAppearance, isLoading } = useAppearance();

  if (isLoading) {
    return <p>Loading appearance settings...</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Admin Panel Appearance</h2>
      <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
        <p className="text-gray-600">Select a theme for the admin panel.</p>
        <div className="flex gap-4">
          <button
            onClick={() => setAppearance('default')}
            className={`px-4 py-2 border rounded-lg ${appearance === 'default' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
          >
            Default
          </button>
          <button
            onClick={() => setAppearance('compact')}
            className={`px-4 py-2 border rounded-lg ${appearance === 'compact' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
          >
            Compact
          </button>
          <button
            onClick={() => setAppearance('playful')}
            className={`px-4 py-2 border rounded-lg ${appearance === 'playful' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
          >
            Playful
          </button>
        </div>
      </div>
    </div>
  );
}
