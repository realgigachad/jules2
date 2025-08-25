import Link from 'next/link';
import { getTranslations } from '@/lib/getTranslations';

async function getTrips() {
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/public/trips`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch trips');
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching trips:", error);
    return [];
  }
}

export default async function TripsPage({ params: { lang } }) {
  const t = await getTranslations(lang);
  const trips = await getTrips();

  const getPriceDisplay = (prices) => {
    if (!prices) return 'Price not set';
    if (lang === 'en') {
      return `€${(prices.eur || 0).toFixed(2)} / £${(prices.gbp || 0).toFixed(2)}`;
    }
    const currencyCodeMap = { de: 'eur', sk: 'eur', cs: 'czk', hu: 'huf', ru: 'rub', uk: 'uah' };
    const currencyCode = currencyCodeMap[lang];
    if (!currencyCode) return `€${(prices.eur || 0).toFixed(2)}`;
    const price = prices[currencyCode] || 0;
    return price.toLocaleString(lang, { style: 'currency', currency: currencyCode.toUpperCase(), minimumFractionDigits: 2 });
  };

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 font-header">{t.tripsPage.title}</h1>
        <p className="mt-2 text-lg text-text/80">{t.tripsPage.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trips.map(trip => (
            <Link key={trip._id} href={`/${lang}/trips/${trip._id}`} className="playful-card block bg-white rounded-lg shadow-lg overflow-hidden group">
            <div className="relative">
              <img src={trip.imageUrl || 'https://images.unsplash.com/photo-1505923984062-552e3a4734d5?q=80&w=2070&auto=format&fit=crop'} alt={trip.title[lang] || trip.title.en} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <span className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity">{t.tripsPage.viewDetails}</span>
              </div>
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-2xl font-bold text-white shadow-lg font-header">{trip.title[lang] || trip.title.en}</h3>
              </div>
            </div>
            <div className="p-6 flex flex-col">
              <div
                className="prose text-text/80 line-clamp-4 flex-grow"
                dangerouslySetInnerHTML={{ __html: trip.description[lang] || trip.description.en }}
              />
              <div className="mt-4 flex justify-between items-center pt-4 border-t">
                <p className="text-lg font-bold text-primary">{getPriceDisplay(trip.prices)}</p>
                <span className="text-text/70 text-sm">
                  {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : ''}
                </span>
              </div>
            </div>
          </Link>
        ))}
        {trips.length === 0 && (
          <p className="text-center text-text/70 col-span-full">{t.tripsPage.noTrips}</p>
        )}
      </div>
    </div>
  );
}
