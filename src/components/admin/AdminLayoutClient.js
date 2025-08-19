'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAdminTranslations } from './AdminTranslationsProvider';
import { useAppearance } from './AppearanceSettings';

export default function AdminLayoutClient({ children }) {
  const pathname = usePathname();
  const { t, setLang, lang } = useAdminTranslations();
  const { appearance, isLoading } = useAppearance();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/fonok';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (pathname === '/fonok' || pathname.startsWith('/fonok/change-password')) {
    return <>{children}</>;
  }

  if (isLoading || !t) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading Admin Interface...</p>
      </div>
    );
  }

  const navLinks = [
    { href: "/fonok/dashboard", label: t.layout.dashboard },
    { href: "/fonok/trips", label: t.layout.trips },
    { href: "/fonok/articles", label: t.layout.articles },
    { href: "/fonok/settings", label: t.layout.settings },
    { href: "/fonok/styling", label: t.layout.styling },
    { href: "/fonok/password", label: t.layout.changePassword },
  ];

  const mainContent = <main className="flex-1 p-8 overflow-y-auto">{children}</main>;

  const layoutClasses = {
    default: "flex h-screen bg-gray-100 text-black",
    compact: "flex flex-col h-screen bg-gray-50 text-black",
    playful: "flex h-screen bg-yellow-50 text-black overflow-hidden",
  };

  const asideClasses = {
    default: "w-64 bg-gray-800 text-white flex flex-col",
    compact: "hidden", // Sidebar is hidden in compact view
    playful: "w-72 bg-indigo-800 text-white flex flex-col transform -rotate-3 -ml-4",
  };

  const navLinkClasses = (href) => {
    const base = "block px-4 py-2 rounded";
    const hover = "hover:bg-gray-700";
    const active = pathname.startsWith(href) ? "bg-primary" : "";
    return `${base} ${hover} ${active}`;
  };

  const AdminLangSelector = () => (
    <div className={appearance === 'playful' ? "text-white" : "text-white"}>
      <label htmlFor="admin-lang" className="text-xs">UI Language</label>
      <select
        id="admin-lang"
        onChange={(e) => setLang(e.target.value)}
        value={lang}
        className="bg-gray-700 text-white p-1 rounded w-full mt-1 text-sm"
      >
        <option value="en">English</option>
        <option value="de">Deutsch</option>
        <option value="hu">Magyar</option>
        <option value="ru">Русский</option>
        <option value="sk">Slovenčina</option>
        <option value="cs">Čeština</option>
        <option value="uk">Українська</option>
      </select>
    </div>
  );

  const Sidebar = () => (
    <aside className={asideClasses[appearance]}>
      <div className={`p-4 text-xl font-bold border-b ${appearance === 'playful' ? 'border-indigo-700' : 'border-gray-700'}`}>{t.layout.title}</div>
      <nav className="flex-grow p-4 space-y-2">
        {navLinks.map(link => (
          <Link key={link.href} href={link.href} className={navLinkClasses(link.href)}>{link.label}</Link>
        ))}
      </nav>
      <div className={`p-4 border-t ${appearance === 'playful' ? 'border-indigo-700' : 'border-gray-700'}`}>
        <AdminLangSelector />
      </div>
      <div className={`p-4 border-t ${appearance === 'playful' ? 'border-indigo-700' : 'border-gray-700'}`}>
        <button onClick={handleLogout} className="w-full px-4 py-2 text-left rounded hover:bg-gray-700">{t.layout.logout}</button>
      </div>
    </aside>
  );

  const Topbar = () => (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">{t.layout.title}</h1>
      <nav className="flex gap-4 items-center">
        {navLinks.map(link => (
          <Link key={link.href} href={link.href} className={`text-sm ${pathname.startsWith(link.href) ? 'text-primary font-bold' : 'text-gray-600'}`}>{link.label}</Link>
        ))}
        <AdminLangSelector />
        <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-primary">{t.layout.logout}</button>
      </nav>
    </header>
  );

  return (
    <div className={layoutClasses[appearance]}>
      {appearance !== 'compact' && <Sidebar />}
      {appearance === 'compact' && <Topbar />}
      {mainContent}
    </div>
  );
}
