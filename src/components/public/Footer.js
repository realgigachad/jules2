/**
 * @fileoverview This file defines the Footer component for the public-facing site.
 * The appearance of the footer can be dynamically changed based on the site's appearance settings.
 */
'use client';

import { useAppearance } from '@/components/admin/AppearanceSettings';

/**
 * A footer component that displays the site name, slogan, and copyright information.
 * Its style changes based on the selected public appearance theme.
 *
 * @param {object} props - The component props.
 * @param {object} props.t - The translation object for UI strings.
 * @returns {JSX.Element} The rendered footer component.
 */
export default function Footer({ t }) {
  const { appearance } = useAppearance();

  // Defines the CSS classes for each footer appearance style.
  const footerClasses = {
    default: "bg-gray-800 text-white mt-auto",
    compact: "bg-gray-800 text-white mt-auto py-4",
    playful: "bg-indigo-800 text-white mt-auto border-t-8 border-indigo-500 rounded-t-3xl",
  };

  return (
    <footer className={`playful-card ${footerClasses[appearance] || footerClasses.default}`}>
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
