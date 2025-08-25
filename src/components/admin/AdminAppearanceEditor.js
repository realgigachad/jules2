/**
 * @fileoverview This file defines the AdminAppearanceEditor component, which allows
 * administrators to change the visual theme for both the public-facing site and
 * the admin panel itself.
 */
'use client';

import { useState, useEffect } from 'react';
import { useAppearance } from '@/components/admin/AppearanceSettings';
import { useAdminTranslations } from './AdminTranslationsProvider';

// --- SVG Illustration Generators ---
// These functions create simplified SVG representations of the site layouts
// to provide a visual preview of each theme.

/**
 * Creates a data URI for an SVG preview of the admin panel layout.
 * @param {string} theme - The theme ID ('playful' or 'default').
 * @returns {string} A base64-encoded data URI for the SVG image.
 */
const createAdminSvg = (theme, t) => {
  const bgColor = '#1f2937';
  const primaryColor = '#4f46e5';
  const contentBg = '#E5E7EB';
  const text = '#FFFFFF';

  let sidebar;
  switch (theme) {
    case 'playful':
      sidebar = `<g transform="rotate(-2 50 185)"><rect x="10" y="15" width="90" height="370" fill="${primaryColor}" rx="8" /><rect x="25" y="35" width="60" height="10" fill="${text}" rx="3"/><path d="M25 70 h60 M25 90 h60 M25 110 h60" stroke="${text}" stroke-width="4" stroke-linecap="round"/></g>`;
      break;
    default:
      sidebar = `<g><rect x="15" y="15" width="120" height="370" fill="${bgColor}" rx="8" /><rect x="30" y="35" width="90" height="12" fill="${primaryColor}" rx="4"/><path d="M30 80 h90 M30 105 h90 M30 130 h90" stroke="${text}" stroke-width="5" stroke-linecap="round"/></g>`;
      break;
  }
  const mainContent = `<g><rect x="150" y="15" width="435" height="370" fill="${contentBg}" rx="8" /><rect x="170" y="35" width="150" height="15" fill="#9CA3AF" rx="5" /><path d="M170 80 h395 M170 100 h395 M170 120 h250" stroke="#CBD5E1" stroke-width="8" stroke-linecap="round"/></g>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#F9FAFB"/><g>${sidebar}${mainContent}</g><text x="50%" y="95%" font-family="Arial" font-size="16" fill="#6B7280" text-anchor="middle">${t.appearance.adminPanel}</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

/**
 * Creates a data URI for an SVG preview of the public site layout.
 * @param {string} theme - The theme ID ('playful', 'single-page', or 'default').
 * @returns {string} A base64-encoded data URI for the SVG image.
 */
const createPublicSvg = (theme, t) => {
  const headerColor = '#FFFFFF';
  const contentBg = '#F3F4F6';
  const primaryColor = '#0891b2';
  const footerColor = '#1f2937';

  let header, mainContent;
  switch (theme) {
    case 'playful':
      header = `<g transform="rotate(-2 50 185)"><rect x="10" y="15" width="90" height="370" fill="${primaryColor}" rx="8" /><rect x="25" y="35" width="60" height="10" fill="white" rx="3"/><path d="M25 80 h60 M25 100 h60 M25 120 h60" stroke="white" stroke-width="4" stroke-linecap="round"/></g>`;
      mainContent = `<rect x="115" y="15" width="470" height="370" fill="${headerColor}" rx="8" />`;
      break;
    case 'single-page':
      header = `<rect x="15" y="15" width="570" height="40" fill="${headerColor}" rx="8" /><rect x="30" y="25" width="80" height="10" fill="${primaryColor}" rx="3" /><path d="M400 30 h150" stroke="#9CA3AF" stroke-width="6" stroke-linecap="round"/>`;
      mainContent = `<g><rect x="15" y="70" width="570" height="315" fill="${contentBg}" rx="8" /><rect x="40" y="90" width="520" height="15" fill="#E5E7EB" rx="4" /><rect x="40" y="120" width="480" height="15" fill="#E5E7EB" rx="4" /><rect x="40" y="150" width="500" height="15" fill="#E5E7EB" rx="4" /></g>`;
      break;
    default:
      header = `<rect x="15" y="15" width="570" height="50" fill="${headerColor}" rx="8" /><rect x="30" y="28" width="80" height="15" fill="${primaryColor}" rx="4" /><path d="M400 35 h30 M450 35 h30 M500 35 h30" stroke="#6B7280" stroke-width="5" stroke-linecap="round"/>`;
      mainContent = `<rect x="15" y="80" width="570" height="255" fill="${contentBg}" rx="8" />`;
      break;
  }
  const footer = `<rect x="15" y="350" width="570" height="35" fill="${footerColor}" rx="8" />`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#E5E7EB"/><g>${header}${mainContent}${footer}</g><text x="50%" y="95%" font-family="Arial" font-size="16" fill="#6B7280" text-anchor="middle">${t.appearance.publicSite}</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

// Available themes for selection.
const themes = [
  { id: 'default', name: 'Default' },
  { id: 'single-page', name: 'Single Page' },
  { id: 'playful', name: 'Playful' },
];

/**
 * The main component for the appearance editor.
 * It allows selecting a theme and applying it to the public site, admin panel, or both.
 */
export default function AdminAppearanceEditor() {
  const { adminAppearance, publicAppearance, setAppearance, isLoading } = useAppearance();
  const { t } = useAdminTranslations();
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // When the component loads or the public appearance changes, update the selected theme.
  useEffect(() => {
    setSelectedTheme(publicAppearance || 'default');
  }, [publicAppearance]);

  if (isLoading) {
    return <p>Loading appearance settings...</p>;
  }

  /**
   * Handles the click event for setting a new theme.
   * It calls the `setAppearance` function from the context and displays a success or error message.
   * @param {'public' | 'admin' | 'both'} target - The target area to apply the theme to.
   */
  const handleSetTheme = async (target) => {
    setIsSaving(true);
    setMessage('');
    const success = await setAppearance(selectedTheme, target);
    const themeName = themes.find(t => t.id === selectedTheme)?.name || selectedTheme;
    if (success) {
      const successMsg = t.appearance.success.replace('{themeName}', themeName).replace('{target}', target);
      setMessage(successMsg);

      // If the admin theme was changed to single-page, reload to the dashboard
      if ((target === 'admin' || target === 'both') && selectedTheme === 'single-page') {
        setTimeout(() => {
            window.location.href = '/fonok/dashboard';
        }, 1000);
      } else {
        // Clear the message after 5 seconds if not redirecting
        setTimeout(() => setMessage(''), 5000);
      }
    } else {
      setMessage(t.appearance.error);
      setIsSaving(false);
    }
    // We only set isSaving to false here for the success case if we are not redirecting
    if (!((target === 'admin' || target === 'both') && selectedTheme === 'single-page')) {
      setIsSaving(false);
    }
  };

  const themeName = themes.find(t => t.id === selectedTheme)?.name || 'N/A';
  const setThemeForText = t.appearance.setThemeFor.replace('{themeName}', themeName);

  return (
    <div className="mt-8">
      <h1 className="text-2xl font-bold mb-6">{t.appearance.title}</h1>
      <h2 className="text-xl font-semibold mb-4">{t.appearance.globalThemes}</h2>
      <div className="space-y-6">

        {/* Theme selection grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`border-4 rounded-lg cursor-pointer transition-all ${selectedTheme === theme.id ? 'border-primary' : 'border-transparent hover:border-gray-300'}`}
            >
              <div className="bg-gray-200 p-4 rounded-t-md">
                <h3 className="font-bold text-lg text-center">{theme.name}</h3>
              </div>
              <div className="p-4 bg-gray-100 rounded-b-md space-y-4">
                <img src={createPublicSvg(theme.id, t)} alt={`${theme.name} Public Preview`} className="w-full rounded shadow-inner" />
                <img src={createAdminSvg(theme.id, t)} alt={`${theme.name} Admin Preview`} className="w-full rounded shadow-inner" />
              </div>
            </div>
          ))}
        </div>

        {/* Display the currently active themes */}
        <div className="text-center text-sm text-gray-600 p-4 bg-blue-50 rounded-lg">
          <p>{t.appearance.currentPublicTheme} <span className="font-bold">{themes.find(t => t.id === publicAppearance)?.name || 'N/A'}</span></p>
          <p>{t.appearance.currentAdminTheme} <span className="font-bold">{themes.find(t => t.id === adminAppearance)?.name || 'N/A'}</span></p>
        </div>

        {/* Action buttons to apply the selected theme */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t">
            <p className="font-semibold">{setThemeForText}</p>
            <button onClick={() => handleSetTheme('public')} disabled={isSaving} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50">{t.appearance.publicSite}</button>
            <button onClick={() => handleSetTheme('admin')} disabled={isSaving} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50">{t.appearance.adminPanel}</button>
            <button onClick={() => handleSetTheme('both')} disabled={isSaving} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50">{t.appearance.both}</button>
        </div>

        {/* Display success or error messages */}
        {message && <p className={`mt-4 text-sm text-center ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
      </div>
    </div>
  );
}
