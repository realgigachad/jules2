import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import AdminTranslationsProvider from "@/components/admin/AdminTranslationsProvider";
import { AppearanceProvider } from "@/components/admin/AppearanceSettings";
import "../globals.css";

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
       <head>
        <title>Admin Panel</title>
      </head>
      <body>
        <AppearanceProvider>
          <AdminTranslationsProvider>
            <AdminLayoutClient>
              {children}
            </AdminLayoutClient>
          </AdminTranslationsProvider>
        </AppearanceProvider>
      </body>
    </html>
  );
}
