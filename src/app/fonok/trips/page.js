'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TripsListPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/cms/trips', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
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
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/cms/trips/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to delete trip');
        setTrips(trips.filter(trip => trip._id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <p>Loading trips...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Trips</h1>
        <Link href="/fonok/trips/new" className="px-4 py-2 text-white bg-cyan-600 rounded-md hover:bg-cyan-700">
          + Create New Trip
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-md">
        <ul className="divide-y divide-gray-200">
          {trips.length > 0 ? trips.map(trip => (
            <li key={trip._id} className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{trip.title.en || 'Untitled Trip'}</h3>
                <p className="text-sm text-gray-500">Price: ${trip.price}</p>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/fonok/trips/edit/${trip._id}`} className="text-sm text-cyan-600 hover:underline">
                  Edit
                </Link>
                <button onClick={() => handleDelete(trip._id)} className="text-sm text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </li>
          )) : (
            <li className="p-4 text-center text-gray-500">No trips found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
