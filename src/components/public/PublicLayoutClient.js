'use client';

import { AppearanceProvider, useAppearance } from '@/components/admin/AppearanceSettings';
import Header from "@/components/public/Header";
import CompactHeader from "@/components/public/CompactHeader";
import Footer from "@/components/public/Footer";

// This new component will be the consumer of the context
// and can safely call the useAppearance hook.
function AppBody({ lang, t, children }) {
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

  const mainContentClass = appearance === 'compact' ? 'ml-64' : '';

  return (
    <body className={`bg-background text-text font-body theme-${appearance}`}>
      {appearance === 'compact'
        ? <CompactHeader lang={lang} t={t.header} />
        : <Header lang={lang} t={t.header} />
      }
      <div className={mainContentClass}>
        <main className="flex-grow container mx-auto px-6 py-12">
          {children}
        </main>
        <Footer t={t.footer} />
      </div>
    </body>
  );
}


export default function PublicLayoutClient({ lang, t, style, children }) {
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
      <AppearanceProvider>
        <AppBody lang={lang} t={t}>
          {children}
        </AppBody>
      </AppearanceProvider>
    </html>
  );
}
