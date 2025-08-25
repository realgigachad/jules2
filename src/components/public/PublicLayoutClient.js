/**
 * @fileoverview This file defines the main layout structure for the public-facing site.
 * It's a client component that wraps the page content with the appropriate header, footer,
 * and dynamic styling based on site settings.
 */
'use client';

import { AppearanceProvider, useAppearance } from '@/components/admin/AppearanceSettings';
import Header from "@/components/public/Header";
import PlayfulHeader from "@/components/public/PlayfulHeader";
import Footer from "@/components/public/Footer";
import SinglePage from "@/components/public/SinglePage";

/**
 * The core body component that consumes the Appearance context.
 * It dynamically renders the correct layout (e.g., default, playful, single-page)
 * based on the `publicAppearance` setting.
 * @param {object} props - The component props.
 * @param {string} props.lang - The current language.
 * @param {object} props.t - The translations object.
 * @param {Array} props.trips - The list of trips for the single-page layout.
 * @param {Array} props.articles - The list of articles for the single-page layout.
 * @param {React.ReactNode} props.children - The page content to render.
 * @returns {JSX.Element} The rendered body of the application.
 */
function AppBody({ lang, t, trips, articles, children }) {
  const { publicAppearance, isLoading } = useAppearance();
  const appearance = publicAppearance; // Use public appearance for the public site

  // A fallback loading state. Since appearance is passed as a prop to the provider,
  // this should ideally not be visible to the user.
  if (isLoading) {
    return (
      <body className="bg-background text-text font-body theme-default">
        <Header lang={lang} t={t.header} />
        <main className="flex-grow container mx-auto px-6 py-12">
          {children}
        </main>
        <Footer t={t.footer} />
      </body>
    );
  }

  // If the appearance is 'single-page', render a completely different layout.
  if (appearance === 'single-page') {
    return (
      <body className={`bg-background text-text font-body theme-single-page`}>
        <SinglePage lang={lang} t={t} trips={trips} articles={articles} />
      </body>
    );
  }

  // Adjust main content margin if using a sidebar-style header.
  const mainContentClass = appearance === 'playful' ? 'ml-64' : '';

  // Render the appropriate header based on the appearance setting.
  const renderHeader = () => {
    if (appearance === 'playful') {
      return <PlayfulHeader lang={lang} t={t.header} />;
    }
    // Add other header types here if needed, e.g., 'compact'.
    // For now, 'default' and any other value fall back to the standard Header.
    return <Header lang={lang} t={t.header} />;
  };

  return (
    <body className={`bg-background text-text font-body theme-${appearance}`}>
      {renderHeader()}
      <div className={mainContentClass}>
        <main className="flex-grow container mx-auto px-6 py-12">
          {children}
        </main>
        <Footer t={t.footer} />
      </div>
    </body>
  );
}

/**
 * The main client-side layout component for the public site.
 * It sets up the HTML structure, injects dynamic styles (colors and fonts) into the head,
 * and wraps the content in the AppearanceProvider.
 *
 * @param {object} props - The component props.
 * @param {string} props.lang - The current language.
 * @param {object} props.t - The translations object.
 * @param {object} props.style - The dynamic style settings from the database.
 * @param {string} props.initialAppearance - The initial public appearance setting.
 * @param {Array} props.trips - The list of trips.
 * @param {Array} props.articles - The list of articles.
 * @param {React.ReactNode} props.children - The page content.
 * @returns {JSX.Element} The complete HTML document structure.
 */
export default function PublicLayoutClient({ lang, t, style, initialAppearance, trips, articles, children }) {
  // Construct Google Fonts URLs from the font names in the style settings.
  const headerFontUrl = `https://fonts.googleapis.com/css2?family=${style.headerFont.split(',')[0].replace(/"/g, '').replace(/ /g, '+')}:wght@700&display=swap`;
  const bodyFontUrl = `https://fonts.googleapis.com/css2?family=${style.bodyFont.split(',')[0].replace(/"/g, '').replace(/ /g, '+')}&display=swap`;

  return (
    <html lang={lang}>
      <head>
        {/* Preconnect to Google Fonts for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        {/* Load the selected header and body fonts */}
        <link href={headerFontUrl} rel="stylesheet" />
        <link href={bodyFontUrl} rel="stylesheet" />
        {/* Inject dynamic styles as CSS custom properties (variables) */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --color-primary: ${style.primaryColor};
            --color-background: ${style.backgroundColor};
            --color-text: ${style.textColor};
            --font-header: "${style.headerFont.split(',')[0]}", ${style.headerFont.split(',').slice(1).join(',')};
            --font-body: "${style.bodyFont.split(',')[0]}", ${style.bodyFont.split(',').slice(1).join(',')};
          }
        `}} />
      </head>
      {/* The AppearanceProvider makes the appearance settings available to all child components. */}
      <AppearanceProvider initialPublicAppearance={initialAppearance}>
        {/* The AppBody component contains the main layout logic and consumes the context. */}
        <AppBody lang={lang} t={t} trips={trips} articles={articles}>
          {children}
        </AppBody>
      </AppearanceProvider>
    </html>
  );
}
