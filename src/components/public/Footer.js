export default function Footer({ t }) {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold">TRAIN.TRAVEL</h2>
          <p className="mt-2 text-gray-400">{t.slogan}</p>
          <div className="mt-4">
            <p>&copy; {new Date().getFullYear()} Train.Travel. {t.rights}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
