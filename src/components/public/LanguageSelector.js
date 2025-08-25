/**
 * @fileoverview Defines the LanguageSelector component, a dropdown menu for switching
 * the site's language. It detects the current language from the URL and provides
 * links to the same page in other available languages.
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  { code: 'pl', name: 'Polish', native: 'Polski', flags: ['pl'] },
  { code: 'sr', name: 'Serbian', native: 'Srpski', flags: ['rs'] },
];

/**
 * A small component to display a single flag image.
 */
const Flag = ({ code }) => {
  const flagUrl = code === 'un'
    ? 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Flag_of_the_United_Nations.svg'
    : `https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/7.2.1/flags/4x3/${code}.svg`;
  return <img src={flagUrl} alt={`${code} flag`} className="w-5 h-5 rounded-sm object-cover" />;
};

/**
 * A component to display one or two flags, separated by a slash.
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
 * The dropdown menu component. It's rendered inside a portal.
 */
function DropdownMenu({ targetRef, onclose, getLocalizedPath }) {
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

    useEffect(() => {
        if (targetRef.current) {
            const rect = targetRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
    }, [targetRef]);

    return (
        <div
            style={{
                position: 'absolute',
                top: `${position.top + 5}px`,
                left: `${position.left}px`,
                width: `${position.width}px`,
            }}
            className="origin-top-left bg-white rounded-md shadow-lg z-50">
            <div className="py-1">
                {languages.map(lang => (
                    <Link
                        key={lang.code}
                        href={getLocalizedPath(lang.code)}
                        onClick={onclose}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        <FlagGroup codes={lang.flags} />
                        <span>{lang.native}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}


/**
 * The main LanguageSelector component. It's a dropdown that shows the current language
 * and allows the user to select a different one.
 */
export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef(null);

  // Determines the current language from the first segment of the URL path.
  const currentLangCode = pathname.split('/')[1] || 'en';
  const currentLang = languages.find(l => l.code === currentLangCode) || languages[0];

  // We need to ensure the component is mounted on the client before rendering the portal.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  /**
   * Generates a new URL path for a given language code, preserving the rest of the path.
   */
  const getLocalizedPath = (langCode) => {
    const pathSegments = pathname.split('/');
    pathSegments[1] = langCode;
    return pathSegments.join('/') || `/${langCode}`;
  };

  // This effect adds a click-outside listener to close the dropdown when the user clicks away.
  useEffect(() => {
    function handleClickOutside(event) {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);


  return (
    <div className="relative">
      {/* The button that shows the current language and toggles the dropdown */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-gray-700 bg-white border rounded-md shadow-sm"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <FlagGroup codes={currentLang.flags} />
          <span className="text-sm font-medium truncate">{currentLang.native}</span>
        </div>
        <svg className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* The dropdown menu is rendered into a portal to escape the parent's transform context. */}
      {isMounted && isOpen && createPortal(
        <DropdownMenu
            targetRef={buttonRef}
            onclose={() => setIsOpen(false)}
            getLocalizedPath={getLocalizedPath}
        />,
        document.body
      )}
    </div>
  );
}
