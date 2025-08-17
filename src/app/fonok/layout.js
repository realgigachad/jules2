import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import AdminTranslationsProvider from "@/components/admin/AdminTranslationsProvider";
import "../globals.css";

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
       <head>
        <title>Admin Panel</title>
      </head>
      <body>
        <AdminTranslationsProvider>
          <AdminLayoutClient>
            {children}
          </AdminLayoutClient>
        </AdminTranslationsProvider>
      </body>
    </html>
  );
}
