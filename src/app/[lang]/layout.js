import "../globals.css";
import { getTranslations } from "@/lib/getTranslations";
import dbConnect from "@/lib/dbConnect";
import SiteSettings from "@/models/SiteSettings";
import Trip from "@/models/Trip";
import Article from "@/models/Article";
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

async function getTrips() {
  noStore();
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/public/trips`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch trips');
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching trips in root layout:", error);
    return [];
  }
}

async function getArticles() {
  noStore();
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/public/articles`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch articles');
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching articles in root layout:", error);
    return [];
  }
}

export default async function RootLayout({ children, params }) {
  const t = await getTranslations(params.lang);
  const settings = await getStyleSettings();
  const trips = await getTrips();
  const articles = await getArticles();

  return (
    <PublicLayoutClient
      lang={params.lang}
      t={t}
      style={settings.style}
      initialAppearance={settings.appearance}
      trips={trips}
      articles={articles}
    >
      {children}
    </PublicLayoutClient>
  );
}
