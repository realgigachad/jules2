'use client';

import Link from 'next/link';
import TrainLogo from './TrainLogo';
import LanguageSelector from './LanguageSelector';

export default function PlayfulHeader({ lang, t }) {
  const navLinks = [
    { href: `/${lang}`, label: t.home },
    { href: `/${lang}/pricing`, label: t.pricing },
    { href: `/${lang}/trips`, label: t.trips },
    { href: `/${lang}/articles`, label: t.articles },
    { href: `/${lang}/about`, label: t.about },
    { href: `/${lang}/contact`, label: t.contact },
  ];

  return (
    <aside className="bg-indigo-800 text-white w-64 h-full fixed top-0 left-0 overflow-y-auto z-50 p-6 flex flex-col transform -rotate-2 -ml-2">
      <div className="flex-shrink-0 mb-8">
        <TrainLogo lang={lang} />
      </div>

      <nav className="flex-grow space-y-3">
        {navLinks.map(link => (
          <Link key={link.href} href={link.href} className="block text-lg py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex-shrink-0 mt-8">
        <LanguageSelector />
      </div>
    </aside>
  );
}
