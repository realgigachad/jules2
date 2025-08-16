'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

// This function can be expanded to actually verify the token against an endpoint
const isTokenValid = (token) => {
  // For now, just check if the token exists.
  // In a real app, you'd decode it and check expiration.
  return !!token;
};

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Allow access to login and change-password pages without a valid token
    if (pathname === '/fonok' || pathname === '/fonok/change-password') {
      return;
    }
    // For all other admin pages, require a valid token
    if (!isTokenValid(token)) {
      router.push('/fonok');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/fonok');
  };

  // Don't render layout for login/password change pages
  if (pathname === '/fonok' || pathname === '/fonok/change-password') {
    return <>{children}</>;
  }

  return (
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
  );
}
