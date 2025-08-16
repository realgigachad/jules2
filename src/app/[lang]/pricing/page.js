import Link from 'next/link';

export default function PricingPage({ params: { lang } }) {
  return (
    <div className="bg-white p-12 rounded-lg shadow-lg">
      <h1 className="text-4xl font-extrabold text-center text-gray-900">Our Pricing Philosophy</h1>

      <div className="max-w-4xl mx-auto mt-8 space-y-8 text-lg text-gray-700">
        <p>
          At Train.Travel, we believe in transparent and straightforward pricing. The cost of each journey is all-inclusive, covering your travel, accommodation on board, and curated experiences. We strive to provide exceptional value, combining luxury and adventure in every package.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 border rounded-lg">
            <h3 className="text-2xl font-bold text-cyan-600">Standard Class</h3>
            <p className="mt-2 text-gray-600">Comfortable seating and panoramic windows to enjoy the view.</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-2xl font-bold text-cyan-600">First Class</h3>
            <p className="mt-2 text-gray-600">Extra legroom, complimentary refreshments, and priority service.</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-2xl font-bold text-cyan-600">Sleeper Cabin</h3>
            <p className="mt-2 text-gray-600">Private cabins for overnight journeys, ensuring a restful night's sleep.</p>
          </div>
        </div>

        <p>
          Prices vary depending on the destination, duration, and class of travel. For detailed pricing on our curated journeys, please visit our Upcoming Trips page.
        </p>

        <div className="text-center mt-12">
          <Link href={`/${lang}/trips`} className="px-8 py-4 text-lg font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors">
            View Upcoming Trips & Prices
          </Link>
        </div>
      </div>
    </div>
  );
}
