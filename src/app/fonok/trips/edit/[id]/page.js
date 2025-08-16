'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import TripForm from '@/components/admin/TripForm';

export default function EditTripPage() {
  const [initialData, setInitialData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchTrip = async () => {
        try {
          const res = await fetch(`/api/cms/trips/${id}`); // No headers
          if (!res.ok) throw new Error('Failed to fetch trip data');
          const data = await res.json();
          setInitialData(data.data);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchTrip();
    }
  }, [id]);

  const handleSubmit = async (tripData) => {
    setIsSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/cms/trips/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }, // No auth header
        body: JSON.stringify(tripData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update trip');
      }

      router.push('/fonok/trips');
    } catch (err) {
      setError(err.message);
      setIsSaving(false);
    }
  };

  if (error && !initialData) return <p className="text-red-500">Error: {error}</p>;
  if (!initialData) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Trip</h1>
      {error && <p className="text-red-500 bg-red-100 p-4 rounded-md mb-4">Error: {error}</p>}
      <TripForm initialData={initialData} onSubmit={handleSubmit} isSaving={isSaving} />
    </div>
  );
}
