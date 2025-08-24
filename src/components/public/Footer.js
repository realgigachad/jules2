'use client';

import { useAppearance } from '@/components/admin/AppearanceSettings';

export default function Footer({ t }) {
  const { appearance } = useAppearance();

  const footerClasses = {
    default: "bg-gray-800 text-white mt-auto",
    compact: "bg-gray-800 text-white mt-auto py-4",
    playful: "bg-indigo-800 text-white mt-auto border-t-8 border-indigo-500 rounded-t-3xl",
  };

  return (
    <footer className={footerClasses[appearance] || footerClasses.default}>
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
