export default function AboutUsPage() {
  return (
    <div className="bg-white p-12 rounded-lg shadow-lg">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900">About Train.Travel</h1>
        <p className="mt-4 text-center text-xl text-gray-600">
          Connecting people with places, one scenic route at a time.
        </p>

        <div className="mt-12 space-y-8 text-lg text-gray-700">
          <p>
            Train.Travel was founded on a simple premise: the journey is just as important as the destination. In a world that rushes from point A to point B, we offer a chance to slow down, to see the beauty of the landscape unfold, and to experience travel in a more meaningful and sustainable way.
          </p>
          <p>
            Our team is composed of passionate travelers, logistics experts, and railway enthusiasts who work tirelessly to curate unique train journeys across the globe. From the majestic mountains of Switzerland to the vast landscapes of the Trans-Siberian Railway, we handpick routes that offer breathtaking views and unforgettable experiences.
          </p>

          <div className="border-l-4 border-cyan-500 pl-6">
            <h3 className="text-2xl font-bold text-gray-800">Our Mission</h3>
            <p className="mt-2 text-gray-600">
              To provide comfortable, scenic, and environmentally-friendly travel experiences that create lasting memories and foster a deeper appreciation for the world around us.
            </p>
          </div>

          <p>
            We partner with the world's best rail operators to ensure the highest standards of comfort, safety, and service. Whether you're a solo adventurer, a couple seeking a romantic getaway, or a family looking for a unique vacation, we have a journey that's perfect for you.
          </p>
          <p>
            Thank you for considering Train.Travel. We look forward to welcoming you aboard.
          </p>
        </div>
      </div>
    </div>
  );
}
