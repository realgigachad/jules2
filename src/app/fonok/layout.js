'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import "../globals.css"; // Import global styles
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      // Force a full page reload to ensure all state is cleared
      window.location.href = '/fonok';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // For login/password change pages, render a simpler layout without the dashboard sidebar
  if (pathname === '/fonok' || pathname === '/fonok/change-password') {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
  }

  // For all other admin pages, render the full dashboard layout
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-gray-100">
          <aside className="w-64 bg-gray-800 text-white flex flex-col">
            <div className="p-4 text-xl font-bold border-b border-gray-700">Admin Panel</div>
            <nav className="flex-grow p-4 space-y-2">
              <Link href="/fonok/dashboard" className={`block px-4 py-2 rounded hover:bg-gray-700 ${pathname === '/fonok/dashboard' ? 'bg-cyan-600' : ''}`}>
                Dashboard
              </Link>
              <Link href="/fonok/trips" className={`block px-4 py-2 rounded hover:bg-gray-700 ${pathname.startsWith('/fonok/trips') ? 'bg-cyan-600' : ''}`}>
                Trips
              </Link>
              <Link href="/fonok/articles" className={`block px-4 py-2 rounded hover:bg-gray-700 ${pathname.startsWith('/fonok/articles') ? 'bg-cyan-600' : ''}`}>
                Articles
              </Link>
              <Link href="/fonok/settings" className={`block px-4 py-2 rounded hover:bg-gray-700 ${pathname === '/fonok/settings' ? 'bg-cyan-600' : ''}`}>
                Settings
              </Link>
            </nav>
            <div className="p-4 border-t border-gray-700">
              <button onClick={handleLogout} className="w-full px-4 py-2 text-left rounded hover:bg-gray-700">
                Logout
              </button>
            </div>
          </aside>
          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
