async function getSettings() {
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/public/settings`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    if (!res.ok) throw new Error('Failed to fetch settings');
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {};
  }
}

export default async function ContactPage({ params: { lang } }) {
  const settings = await getSettings();

  return (
    <div>
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">Contact Us</h1>
        <p className="mt-2 text-lg text-gray-600">We'd love to hear from you. Reach out with any questions.</p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" id="name" name="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" id="email" name="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea id="message" name="message" rows="5" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
            </div>
            <div>
              <button type="submit" className="w-full px-6 py-3 text-white bg-cyan-600 rounded-md hover:bg-cyan-700">
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Our Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-cyan-400">{settings.contactEmail || 'info@train.travel'}</p>
            </div>
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p className="text-cyan-400">{settings.contactPhone || '+1 (234) 567-890'}</p>
            </div>
            <div>
              <h3 className="font-semibold">Address</h3>
              <p className="text-cyan-400 whitespace-pre-line">
                {settings.address ? (settings.address[lang] || settings.address.en) : '123 Railway St, Adventure City'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
