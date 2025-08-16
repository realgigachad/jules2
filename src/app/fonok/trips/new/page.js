'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TripForm from '@/components/admin/TripForm';

export default function NewTripPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (tripData) => {
    setIsSaving(true);
    setError('');
    try {
      const res = await fetch('/api/cms/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }, // No auth header
        body: JSON.stringify(tripData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create trip');
      }

      router.push('/fonok/trips');
    } catch (err) {
      setError(err.message);
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Trip</h1>
      {error && <p className="text-red-500 bg-red-100 p-4 rounded-md mb-4">Error: {error}</p>}
      <TripForm onSubmit={handleSubmit} isSaving={isSaving} />
    </div>
  );
}
