/**
 * @fileoverview This file defines the default Header component for the public-facing site.
 * It features a sticky navigation bar that shrinks on scroll, a logo, desktop navigation links,
 * a language selector, and a placeholder for a mobile menu.
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TrainLogo from './TrainLogo';
import LanguageSelector from './LanguageSelector';

/**
 * A responsive, sticky header component.
 *
 * @param {object} props - The component props.
 * @param {string} props.lang - The current language locale.
 * @param {object} props.t - The translation object for UI strings.
 * @returns {JSX.Element} The rendered header component.
 */
export default function Header({ lang, t }) {
  const [isScrolled, setIsScrolled] = useState(false);

  // This effect adds a scroll event listener to shrink the header when the user scrolls down.
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    // Cleanup function to remove the event listener when the component unmounts.
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`bg-white shadow-md sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <TrainLogo lang={lang} />

        {/* Desktop Navigation: visible on medium screens and up */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href={`/${lang}`} className="text-gray-600 hover:text-primary">{t.home}</Link>
          <Link href={`/${lang}/pricing`} className="text-gray-600 hover:text-primary">{t.pricing}</Link>
          <Link href={`/${lang}/trips`} className="text-gray-600 hover:text-primary">{t.trips}</Link>
          <Link href={`/${lang}/articles`} className="text-gray-600 hover:text-primary">{t.articles}</Link>
          <Link href={`/${lang}/about`} className="text-gray-600 hover:text-primary">{t.about}</Link>
          <Link href={`/${lang}/contact`} className="text-gray-600 hover:text-primary">{t.contact}</Link>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelector />
          {/* Mobile menu button: visible on screens smaller than medium. Currently not functional. */}
          <button className="md:hidden text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
