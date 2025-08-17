import "../globals.css";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { getTranslations } from "@/lib/getTranslations";

export const metadata = {
  title: "Train.Travel - Your Journey Begins Here",
  description: "Modern travel agency specializing in scenic train journeys.",
};

export default async function RootLayout({ children, params }) {
  const t = await getTranslations(params.lang);

  return (
    <html lang={params.lang}>
      <body className="flex flex-col min-h-screen bg-gray-50">
        <Header lang={params.lang} t={t.header} />
        <main className="flex-grow container mx-auto px-6 py-12">
          {children}
        </main>
        <Footer t={t.footer} />
      </body>
    </html>
  );
}
