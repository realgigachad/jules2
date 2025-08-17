async function getTrips() {
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    // Removed the revalidate option to make it fully dynamic
    const res = await fetch(`${baseUrl}/api/public/trips`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch trips');
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching trips:", error);
    return [];
  }
}

export default async function TripsPage({ params: { lang } }) {
  const trips = await getTrips();

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">Upcoming Trips</h1>
        <p className="mt-2 text-lg text-gray-600">Embark on your next great adventure.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trips.map(trip => (
          <div key={trip._id} className="bg-white rounded-lg shadow-lg overflow-hidden group">
            <div className="relative">
              <img src={trip.imageUrl || 'https://images.unsplash.com/photo-1505923984062-552e3a4734d5?q=80&w=2070&auto=format&fit=crop'} alt={trip.title[lang] || trip.title.en} className="w-full h-56 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-2xl font-bold text-white shadow-lg">{trip.title[lang] || trip.title.en}</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 line-clamp-4">
                {trip.description[lang] || trip.description.en}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-2xl font-bold text-cyan-600">${trip.price}</p>
                <span className="text-gray-600 text-sm">
                  {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
        {trips.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">There are no upcoming trips at the moment. Please check back soon!</p>
        )}
      </div>
    </div>
  );
}
