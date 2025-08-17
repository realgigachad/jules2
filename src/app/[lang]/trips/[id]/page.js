async function getTrip(id) {
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/public/trips/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching trip:", error);
    return null;
  }
}

export default async function TripDetailPage({ params: { lang, id } }) {
  const trip = await getTrip(id);

  if (!trip) {
    return <div className="text-center">Trip not found.</div>;
  }

  // Helper to display price based on language
  const renderPrice = () => {
    if (lang === 'en') {
      return (
        <>
          <span className="block text-3xl font-bold text-cyan-600">€{trip.prices.eur.toFixed(2)}</span>
          <span className="block text-xl font-bold text-cyan-700">£{trip.prices.gbp.toFixed(2)}</span>
        </>
      );
    }
    const currencyCode = { de: 'eur', sk: 'eur', cs: 'czk', hu: 'huf', ru: 'rub', uk: 'uah' }[lang];
    const price = trip.prices[currencyCode];
    return <span className="text-3xl font-bold text-cyan-600">{price.toLocaleString(lang, { style: 'currency', currency: currencyCode.toUpperCase(), minimumFractionDigits: 2 })}</span>;
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-4xl font-extrabold text-gray-900">{trip.title[lang] || trip.title.en}</h1>
          <div
            className="prose lg:prose-xl mt-6 max-w-none"
            dangerouslySetInnerHTML={{ __html: trip.description[lang] || trip.description.en }}
          />
        </div>
        <div className="md:col-span-1">
          <div className="sticky top-24 bg-gray-50 p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-bold text-center mb-4">Book Your Journey</h2>
            <div className="text-center mb-4">
              {renderPrice()}
            </div>
            <div className="text-sm text-center text-gray-600">
              <p>From: {new Date(trip.startDate).toLocaleDateString()}</p>
              <p>To: {new Date(trip.endDate).toLocaleDateString()}</p>
            </div>
            <button className="w-full mt-6 px-6 py-3 text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 font-bold">
              Inquire Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
