/**
 * @fileoverview This file defines the root layout for the public-facing part of the application.
 * As a Server Component, it is responsible for fetching all necessary data from the database
 * or API endpoints and passing it down to the client-side layout component.
 */
import "../globals.css";
import { getTranslations } from "@/lib/getTranslations";
import dbConnect from "@/lib/dbConnect";
import SiteSettings from "@/models/SiteSettings";
import Trip from "@/models/Trip";
import Article from "@/models/Article";
import PublicLayoutClient from "@/components/public/PublicLayoutClient";
import { unstable_noStore as noStore } from 'next/cache';

// Default metadata for the site.
export const metadata = {
  title: "Train.Travel - Your Journey Begins Here",
  description: "Modern travel agency specializing in scenic train journeys.",
};

/**
 * Fetches the site's style and appearance settings from the database.
 * `noStore()` is used to ensure this data is fetched dynamically on every request,
 * allowing theme changes to be reflected immediately.
 * @returns {Promise<object>} An object containing the style settings and public appearance theme.
 */
async function getStyleSettings() {
  noStore();
  try {
    await dbConnect();
    const settings = await SiteSettings.findOne({}).lean();
    // Return a combination of saved style and appearance, with defaults.
    return {
      style: settings?.style || {
        themeName: 'Default',
        primaryColor: '#0891b2',
        backgroundColor: '#FFFFFF',
        textColor: '#1f2937',
        headerFont: 'Georgia, serif',
        bodyFont: 'Arial, sans-serif',
      },
      publicAppearance: settings?.publicAppearance || 'default'
    };
  } catch (error) {
    console.error("Failed to fetch style settings:", error);
    // Return default values on error to prevent the site from crashing.
    return {
      style: {
        themeName: 'Default',
        primaryColor: '#0891b2',
        backgroundColor: '#FFFFFF',
        textColor: '#1f2937',
        headerFont: 'Georgia, serif',
        bodyFont: 'Arial, sans-serif',
      },
      publicAppearance: 'default'
    };
  }
}

/**
 * Fetches all trips. This is needed for the 'single-page' layout.
 * `noStore()` ensures the data is always fresh.
 * @returns {Promise<Array>} An array of trip objects.
 */
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

/**
 * Fetches all articles. This is needed for the 'single-page' layout.
 * `noStore()` ensures the data is always fresh.
 * @returns {Promise<Array>} An array of article objects.
 */
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

/**
 * The main RootLayout server component.
 * It fetches all data in parallel and passes it to the client layout component.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The page content to be rendered.
 * @param {{lang: string}} props.params - The route parameters, containing the current language.
 * @returns {Promise<JSX.Element>} The rendered client layout component with all necessary props.
 */
export default async function RootLayout({ children, params }) {
  // Fetch all required data concurrently.
  const t = await getTranslations(params.lang);
  const settings = await getStyleSettings();
  const trips = await getTrips();
  const articles = await getArticles();

  // Render the client-side layout component and pass all fetched data as props.
  return (
    <PublicLayoutClient
      lang={params.lang}
      t={t}
      style={settings.style}
      initialAppearance={settings.publicAppearance}
      trips={trips}
      articles={articles}
    >
      {children}
    </PublicLayoutClient>
  );
}
