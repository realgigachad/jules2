'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdminTranslations } from '@/components/admin/AdminTranslationsProvider';

export function TripsSection() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useAdminTranslations();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch('/api/cms/trips');
        if (!res.ok) throw new Error('Failed to fetch trips');
        const data = await res.json();
        setTrips(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm(t.trips.deleteConfirm)) {
      try {
        const res = await fetch(`/api/cms/trips/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete trip');
        setTrips(trips.filter(trip => trip._id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <p>{t.trips.loading}</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t.trips.manageTitle}</h1>
        <Link href="/fonok/trips/new" className="px-4 py-2 text-white bg-cyan-600 rounded-md hover:bg-cyan-700">
          + {t.trips.createButton}
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-md">
        <ul className="divide-y divide-gray-200">
          {trips.length > 0 ? trips.map(trip => (
            <li key={trip._id} className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{trip.title.en || t.trips.untitled}</h3>
                <p className="text-sm text-gray-500">{t.trips.priceLabel} ${trip.price}</p>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/fonok/trips/edit/${trip._id}`} className="text-sm text-cyan-600 hover:underline">
                  {t.trips.edit}
                </Link>
                <button onClick={() => handleDelete(trip._id)} className="text-sm text-red-600 hover:underline">
                  {t.trips.delete}
                </button>
              </div>
            </li>
          )) : (
            <li className="p-4 text-center text-gray-500">{t.trips.noTrips}</li>
          )}
        </ul>
      </div>
    </div>
  );
}
