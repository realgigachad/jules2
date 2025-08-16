'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'ru', name: 'Russian' },
  { code: 'sk', name: 'Slovakian' },
];

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const currentLangCode = pathname.split('/')[1];
  const currentLang = languages.find(l => l.code === currentLangCode) || languages[0];
  const otherLanguages = languages.filter(l => l.code !== currentLangCode);

  const getLocalizedPath = (langCode) => {
    const pathSegments = pathname.split('/');
    pathSegments[1] = langCode;
    return pathSegments.join('/');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-32 px-4 py-2 text-gray-700 bg-white border rounded-md shadow-sm"
      >
        <span>{currentLang.name}</span>
        <svg className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 w-full mt-2 origin-top-right bg-white rounded-md shadow-lg z-50">
          <div className="py-1">
            {otherLanguages.map(lang => (
              <Link
                key={lang.code}
                href={getLocalizedPath(lang.code)}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {lang.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
