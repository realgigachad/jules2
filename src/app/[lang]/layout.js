import "../globals.css";
import { getTranslations } from "@/lib/getTranslations";
import dbConnect from "@/lib/dbConnect";
import SiteSettings from "@/models/SiteSettings";
import PublicLayoutClient from "@/components/public/PublicLayoutClient";
import { unstable_noStore as noStore } from 'next/cache';

export const metadata = {
  title: "Train.Travel - Your Journey Begins Here",
  description: "Modern travel agency specializing in scenic train journeys.",
};

async function getStyleSettings() {
  noStore();
  try {
    await dbConnect();
    const settings = await SiteSettings.findOne({}).lean();
    // Return a combination of saved style and appearance
    return {
      style: settings?.style || {
        themeName: 'Default',
        primaryColor: '#0891b2',
        backgroundColor: '#FFFFFF',
        textColor: '#1f2937',
        headerFont: 'Georgia, serif',
        bodyFont: 'Arial, sans-serif',
      },
      appearance: settings?.appearance || 'default'
    };
  } catch (error) {
    console.error("Failed to fetch style settings:", error);
    // Return default values for both
    return {
      style: {
        themeName: 'Default',
        primaryColor: '#0891b2',
        backgroundColor: '#FFFFFF',
        textColor: '#1f2937',
        headerFont: 'Georgia, serif',
        bodyFont: 'Arial, sans-serif',
      },
      appearance: 'default'
    };
  }
}

export default async function RootLayout({ children, params }) {
  const t = await getTranslations(params.lang);
  const settings = await getStyleSettings();

  return (
    <PublicLayoutClient
      lang={params.lang}
      t={t}
      style={settings.style}
      initialAppearance={settings.appearance}
    >
      {children}
    </PublicLayoutClient>
  );
}
