'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import "../app/globals.css";
import LanguageSelector from '@/components/public/LanguageSelector';
import { useAdminTranslations } from './AdminTranslationsProvider';

export default function AdminLayoutClient({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { t, setLang } = useAdminTranslations(); // Use the hook

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/fonok';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (pathname === '/fonok' || pathname.startsWith('/fonok/change-password')) {
    // This part of the UI doesn't need the full layout or translations
    return <>{children}</>;
  }

  // A simple language selector for the admin panel
  const AdminLangSelector = () => (
    <select onChange={(e) => setLang(e.target.value)} defaultValue="en" className="bg-gray-700 text-white p-1 rounded">
      <option value="en">English</option>
      <option value="de">Deutsch</option>
      <option value="hu">Magyar</option>
      <option value="ru">Русский</option>
      <option value="sk">Slovenčina</option>
      <option value="cs">Čeština</option>
      <option value="uk">Українська</option>
    </select>
  );

  return (
    <div className="flex h-screen bg-gray-100 text-black">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">{t.layout.title}</div>
        <nav className="flex-grow p-4 space-y-2">
          <Link href="/fonok/dashboard" className={`block px-4 py-2 rounded hover:bg-gray-700 ${pathname === '/fonok/dashboard' ? 'bg-cyan-600' : ''}`}>{t.layout.dashboard}</Link>
          <Link href="/fonok/trips" className={`block px-4 py-2 rounded hover:bg-gray-700 ${pathname.startsWith('/fonok/trips') ? 'bg-cyan-600' : ''}`}>{t.layout.trips}</Link>
          <Link href="/fonok/articles" className={`block px-4 py-2 rounded hover:bg-gray-700 ${pathname.startsWith('/fonok/articles') ? 'bg-cyan-600' : ''}`}>{t.layout.articles}</Link>
          <Link href="/fonok/settings" className={`block px-4 py-2 rounded hover:bg-gray-700 ${pathname === '/fonok/settings' ? 'bg-cyan-600' : ''}`}>{t.layout.settings}</Link>
          <Link href="/fonok/styling" className={`block px-4 py-2 rounded hover:bg-gray-700 ${pathname === '/fonok/styling' ? 'bg-cyan-600' : ''}`}>{t.layout.styling}</Link>
          <Link href="/fonok/password" className={`block px-4 py-2 rounded hover:bg-gray-700 ${pathname === '/fonok/password' ? 'bg-cyan-600' : ''}`}>{t.layout.changePassword}</Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <AdminLangSelector />
        </div>
        <div className="p-4 border-t border-gray-700">
          <button onClick={handleLogout} className="w-full px-4 py-2 text-left rounded hover:bg-gray-700">{t.layout.logout}</button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
