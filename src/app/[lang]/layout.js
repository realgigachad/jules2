import "../globals.css";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { getTranslations } from "@/lib/getTranslations";
import dbConnect from "@/lib/dbConnect";
import SiteSettings from "@/models/SiteSettings";

export const metadata = {
  title: "Train.Travel - Your Journey Begins Here",
  description: "Modern travel agency specializing in scenic train journeys.",
};

async function getStyleSettings() {
  try {
    await dbConnect();
    const settings = await SiteSettings.findOne({}).lean();
    // Provide a default style object if none is found
    return settings?.style || {
      themeName: 'Default',
      primaryColor: '#00FFFF',
      backgroundColor: '#FFFFFF',
      textColor: '#000000',
      headerFont: 'Georgia, serif',
      bodyFont: 'Arial, sans-serif',
    };
  } catch (error) {
    console.error("Failed to fetch style settings:", error);
    // Return default styles on error
    return {
      themeName: 'Default',
      primaryColor: '#00FFFF',
      backgroundColor: '#FFFFFF',
      textColor: '#000000',
      headerFont: 'Georgia, serif',
      bodyFont: 'Arial, sans-serif',
    };
  }
}

export default async function RootLayout({ children, params }) {
  const t = await getTranslations(params.lang);
  const style = await getStyleSettings();

  const headerFontUrl = `https://fonts.googleapis.com/css2?family=${style.headerFont.split(',')[0].replace(/"/g, '').replace(/ /g, '+')}:wght@700&display=swap`;
  const bodyFontUrl = `https://fonts.googleapis.com/css2?family=${style.bodyFont.split(',')[0].replace(/"/g, '').replace(/ /g, '+')}&display=swap`;

  return (
    <html lang={params.lang}>
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
      <body className={`flex flex-col min-h-screen bg-background text-text font-body theme-${style.themeName.toLowerCase()}`}>
        <Header lang={params.lang} t={t.header} />
        <main className="flex-grow container mx-auto px-6 py-12">
          {children}
        </main>
        <Footer t={t.footer} />
      </body>
    </html>
  );
}
