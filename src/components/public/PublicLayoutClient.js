'use client';

import { AppearanceProvider, useAppearance } from '@/components/admin/AppearanceSettings';
import Header from "@/components/public/Header";
import PlayfulHeader from "@/components/public/PlayfulHeader";
import Footer from "@/components/public/Footer";
import SinglePage from "@/components/public/SinglePage";

// This new component will be the consumer of the context
// and can safely call the useAppearance hook.
function AppBody({ lang, t, trips, articles, children }) {
  const { appearance, isLoading } = useAppearance();

  // We can show a loading state or a default state while the theme is being determined client-side
  if (isLoading) {
    // Render a default, non-themed layout to prevent layout shifts
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

  if (appearance === 'single-page') {
    return (
      <body className={`bg-background text-text font-body theme-single-page`}>
        <SinglePage lang={lang} t={t} trips={trips} articles={articles} />
      </body>
    );
  }

  const mainContentClass = appearance === 'playful' ? 'ml-64' : '';

  const renderHeader = () => {
    if (appearance === 'playful') {
      return <PlayfulHeader lang={lang} t={t.header} />;
    }
    // The default header is no longer theme-aware
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


export default function PublicLayoutClient({ lang, t, style, initialAppearance, trips, articles, children }) {
  const headerFontUrl = `https://fonts.googleapis.com/css2?family=${style.headerFont.split(',')[0].replace(/"/g, '').replace(/ /g, '+')}:wght@700&display=swap`;
  const bodyFontUrl = `https://fonts.googleapis.com/css2?family=${style.bodyFont.split(',')[0].replace(/"/g, '').replace(/ /g, '+')}&display=swap`;

  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href={headerFontUrl} rel="stylesheet" />
        <link href={bodyFontUrl} rel="stylesheet" />
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
      <AppearanceProvider initialAppearance={initialAppearance}>
        <AppBody lang={lang} t={t} trips={trips} articles={articles}>
          {children}
        </AppBody>
      </AppearanceProvider>
    </html>
  );
}
