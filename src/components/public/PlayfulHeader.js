/**
 * @fileoverview This file defines the PlayfulHeader component, a creative,
 * sidebar-style header with a slight rotation for a more dynamic feel.
 */
'use client';

import Link from 'next/link';
import TrainLogo from './TrainLogo';
import LanguageSelector from './LanguageSelector';

/**
 * A "playful" sidebar header component with a unique, rotated design.
 * It contains the site logo, navigation links, and a language selector.
 *
 * @param {object} props - The component props.
 * @param {string} props.lang - The current language locale.
 * @param {object} props.t - The translation object for UI strings.
 * @returns {JSX.Element} The rendered header component.
 */
export default function PlayfulHeader({ lang, t }) {
  // An array of navigation link objects to be mapped over.
  const navLinks = [
    { href: `/${lang}`, label: t.home },
    { href: `/${lang}/pricing`, label: t.pricing },
    { href: `/${lang}/trips`, label: t.trips },
    { href: `/${lang}/articles`, label: t.articles },
    { href: `/${lang}/about`, label: t.about },
    { href: `/${lang}/contact`, label: t.contact },
  ];

  return (
    // The `aside` element is used for the sidebar, which is fixed and rotated.
    // We wrap it in a div with the `group` class to control hover effects on children.
    <div className="group fixed top-0 left-0 h-full z-50">
      <aside className="bg-indigo-800 text-white w-64 h-full p-6 flex flex-col transform -rotate-6 -ml-16 origin-top-left transition-all duration-300 ease-in-out group-hover:rotate-0 group-hover:ml-0">
        <div className="flex-shrink-0 mb-8">
          <TrainLogo lang={lang} />
        </div>

      <nav className="flex-grow space-y-3">
        {navLinks.map(link => (
          <Link key={link.href} href={link.href} className="block text-lg py-2 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-200 hover:translate-x-2">
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex-shrink-0 mt-8 w-full">
        <LanguageSelector />
      </div>
    </aside>
    </div>
  );
}
