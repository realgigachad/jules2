'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import "../../app/globals.css"; // Corrected path relative to root
// import LanguageSelector from '@/components/public/LanguageSelector';

export default function AdminLayoutClient({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/fonok';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // This logic is flawed because it tries to render a full HTML document.
  // The root layout should be in layout.js, and this should just be the client wrapper.
  // For now, I'll simplify this to just render the children for the login page.
  if (pathname === '/fonok' || pathname.startsWith('/fonok/change-password')) { // Use startsWith for the old forced-change page
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">Admin Panel</div>
        <nav className="flex-grow p-4 space-y-2">
          <Link href="/fonok/dashboard" className={`block px-4 py-2 rounded hover:bg-gray-700 ${pathname === '/fonok/dashboard' ? 'bg-cyan-600' : ''}`}>Dashboard</Link>
          <Link href="/fonok/trips" className={`block px-4 py-2 rounded hover:bg-gray-700 ${pathname.startsWith('/fonok/trips') ? 'bg-cyan-600' : ''}`}>Trips</Link>
          <Link href="/fonok/articles" className={`block px-4 py-2 rounded hover:bg-gray-700 ${pathname.startsWith('/fonok/articles') ? 'bg-cyan-600' : ''}`}>Articles</Link>
          <Link href="/fonok/settings" className={`block px-4 py-2 rounded hover:bg-gray-700 ${pathname === '/fonok/settings' ? 'bg-cyan-600' : ''}`}>Settings</Link>
          <Link href="/fonok/styling" className={`block px-4 py-2 rounded hover:bg-gray-700 ${pathname === '/fonok/styling' ? 'bg-cyan-600' : ''}`}>Styling</Link>
          <Link href="/fonok/password" className={`block px-4 py-2 rounded hover:bg-gray-700 ${pathname === '/fonok/password' ? 'bg-cyan-600' : ''}`}>Change Password</Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={handleLogout} className="w-full px-4 py-2 text-left rounded hover:bg-gray-700">Logout</button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
