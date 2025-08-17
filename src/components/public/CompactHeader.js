'use client';

import Link from 'next/link';
import TrainLogo from './TrainLogo';
import LanguageSelector from './LanguageSelector';

export default function CompactHeader({ lang, t }) {
  return (
    <header className="bg-white shadow-lg w-64 p-4 flex flex-col h-screen fixed top-0 left-0">
      <div className="mb-8">
        <TrainLogo lang={lang} />
      </div>

      <nav className="flex flex-col space-y-4 text-lg mb-8">
        <Link href={`/${lang}`} className="text-gray-600 hover:text-primary">{t.home}</Link>
        <Link href={`/${lang}/pricing`} className="text-gray-600 hover:text-primary">{t.pricing}</Link>
        <Link href={`/${lang}/trips`} className="text-gray-600 hover:text-primary">{t.trips}</Link>
        <Link href={`/${lang}/articles`} className="text-gray-600 hover:text-primary">{t.articles}</Link>
        <Link href={`/${lang}/about`} className="text-gray-600 hover:text-primary">{t.about}</Link>
        <Link href={`/${lang}/contact`} className="text-gray-600 hover:text-primary">{t.contact}</Link>
      </nav>

      <div className="mt-auto">
        <LanguageSelector />
      </div>
    </header>
  );
}
