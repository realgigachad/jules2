import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import "../globals.css";

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
       <head>
        <title>Admin Panel</title>
      </head>
      <body>
        <AdminLayoutClient>
          {children}
        </AdminLayoutClient>
      </body>
    </html>
  );
}
