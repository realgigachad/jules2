import { getTranslations } from '@/lib/getTranslations';
import DOMPurify from 'isomorphic-dompurify';

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
  const t = await getTranslations(lang);
  const trip = await getTrip(id);

  if (!trip) {
    return <div className="text-center">Trip not found.</div>;
  }

  const renderPrice = () => {
    if (!trip.prices) return 'Price not set';
    if (lang === 'en') {
      return (
        <>
          <span className="block text-3xl font-bold text-primary">€{(trip.prices.eur || 0).toFixed(2)}</span>
          <span className="block text-xl font-bold text-primary/80">£{(trip.prices.gbp || 0).toFixed(2)}</span>
        </>
      );
    }
    const currencyCodeMap = { de: 'eur', sk: 'eur', cs: 'czk', hu: 'huf', ru: 'rub', uk: 'uah' };
    const currencyCode = currencyCodeMap[lang];
    if (!currencyCode) return `€${(trip.prices.eur || 0).toFixed(2)}`;
    const price = trip.prices[currencyCode] || 0;
    return <span className="text-3xl font-bold text-primary">{price.toLocaleString(lang, { style: 'currency', currency: currencyCode.toUpperCase(), minimumFractionDigits: 2 })}</span>;
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-4xl font-extrabold font-header">{trip.title[lang] || trip.title.en}</h1>
          <div
            className="prose lg:prose-xl mt-6 max-w-none"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(trip.description[lang] || trip.description.en) }}
          />
        </div>
        <div className="md:col-span-1">
          <div className="sticky top-24 bg-background/5 p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-bold text-center mb-4 font-header">{t.tripDetailPage.bookingTitle}</h2>
            <div className="text-center mb-4">
              {renderPrice()}
            </div>
            <div className="text-sm text-center text-text/80">
              <p>{t.tripDetailPage.from}: {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'N/A'}</p>
              <p>{t.tripDetailPage.to}: {trip.endDate ? new Date(trip.endDate).toLocaleDateString() : 'N/A'}</p>
            </div>
            <button className="w-full mt-6 px-6 py-3 text-white bg-primary rounded-lg hover:opacity-90 font-bold">
              {t.tripDetailPage.inquireButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
