/**
 * @fileoverview Defines the LanguageSelector component, a dropdown menu for switching
 * the site's language. It detects the current language from the URL and provides
 * links to the same page in other available languages.
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// Configuration for supported languages, including their codes, names, and associated flags.
const languages = [
  { code: 'en', name: 'English', native: 'British/International', flags: ['gb', 'un'] },
  { code: 'de', name: 'German', native: 'Deutsch', flags: ['de'] },
  { code: 'hu', name: 'Hungarian', native: 'Magyar', flags: ['hu'] },
  { code: 'ru', name: 'Russian', native: 'Русский', flags: ['ru'] },
  { code: 'sk', name: 'Slovakian', native: 'Slovenčina', flags: ['sk'] },
  { code: 'cs', name: 'Czech', native: 'Čeština', flags: ['cz'] },
  { code: 'uk', name: 'Ukrainian', native: 'Українська', flags: ['ua'] },
];

/**
 * A small component to display a single flag image.
 * It uses a special URL for the UN flag.
 * @param {{code: string}} props - The component props.
 */
const Flag = ({ code }) => {
  const flagUrl = code === 'un'
    ? 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Flag_of_the_United_Nations.svg'
    : `https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/7.2.1/flags/4x3/${code}.svg`;
  return <img src={flagUrl} alt={`${code} flag`} className="w-5 h-5 rounded-sm object-cover" />;
};

/**
 * A component to display one or two flags, separated by a slash.
 * @param {{codes: string[]}} props - The component props.
 */
const FlagGroup = ({ codes }) => (
  <div className="flex items-center gap-1">
    <Flag code={codes[0]} />
    {codes.length > 1 && (
      <>
        <span className="text-gray-400">/</span>
        <Flag code={codes[1]} />
      </>
    )}
  </div>
);

/**
 * The main LanguageSelector component. It's a dropdown that shows the current language
 * and allows the user to select a different one.
 */
export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const wrapperRef = useRef(null);

  // Determines the current language from the first segment of the URL path.
  const currentLangCode = pathname.split('/')[1] || 'en';
  const currentLang = languages.find(l => l.code === currentLangCode) || languages[0];

  /**
   * Generates a new URL path for a given language code, preserving the rest of the path.
   * @param {string} langCode - The target language code.
   * @returns {string} The new, localized URL path.
   */
  const getLocalizedPath = (langCode) => {
    const pathSegments = pathname.split('/');
    pathSegments[1] = langCode;
    return pathSegments.join('/') || `/${langCode}`;
  };

  // This effect adds a click-outside listener to close the dropdown when the user clicks away.
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);


  return (
    <div className="relative" ref={wrapperRef}>
      {/* The button that shows the current language and toggles the dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-64 px-3 py-2 text-gray-700 bg-white border rounded-md shadow-sm"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <FlagGroup codes={currentLang.flags} />
          <span className="text-sm font-medium truncate">{currentLang.native}</span>
        </div>
        <svg className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* The dropdown menu with the list of available languages */}
      {isOpen && (
        <div className="absolute right-0 w-full mt-2 origin-top-right bg-white rounded-md shadow-lg z-50">
          <div className="py-1">
            {languages.map(lang => (
              <Link
                key={lang.code}
                href={getLocalizedPath(lang.code)}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FlagGroup codes={lang.flags} />
                <span>{lang.native}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
