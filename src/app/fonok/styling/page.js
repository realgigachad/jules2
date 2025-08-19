'use client';

import { useAppearance } from '@/components/admin/AppearanceSettings';

export default function StylingPage() {
  const { appearance, setAppearance, isLoading } = useAppearance();

  if (isLoading) {
    return <p>Loading appearance settings...</p>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Admin Panel Appearance</h1>
      <div className="space-y-4">
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
