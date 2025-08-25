/**
 * @fileoverview This file defines the root layout for the admin ("fonok") panel.
 * Its primary role is to set up the necessary context providers for the admin interface.
 */
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import AdminTranslationsProvider from "@/components/admin/AdminTranslationsProvider";
import { AppearanceProvider } from "@/components/admin/AppearanceSettings";
import "../globals.css";

/**
 * The root layout component for all admin pages.
 * It wraps the page content (`children`) with context providers for appearance
 * settings and translations, then passes everything to the client-side layout component.
 * @param {{children: React.ReactNode}} props - The component props.
 * @returns {JSX.Element} The rendered admin layout structure.
 */
export default function AdminLayout({ children }) {
  return (
    <html lang="en">
       <head>
        <title>Admin Panel</title>
      </head>
      <body>
        {/* The AppearanceProvider manages the theme (e.g., default, playful) for the admin panel. */}
        <AppearanceProvider>
          {/* The AdminTranslationsProvider manages the UI language for the admin panel. */}
          <AdminTranslationsProvider>
            {/* The AdminLayoutClient handles the actual rendering of the layout (sidebar, etc.). */}
            <AdminLayoutClient>
              {children}
            </AdminLayoutClient>
          </AdminTranslationsProvider>
        </AppearanceProvider>
      </body>
    </html>
  );
}
