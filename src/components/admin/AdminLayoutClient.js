/**
 * @fileoverview This file defines the AdminLayoutClient component, which serves as the
 * main layout for the administrative ("fonok") section of the site. It uses contexts
 * for translations and appearance settings to dynamically render the UI.
 */
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAdminTranslations } from './AdminTranslationsProvider';
import { useAppearance } from './AppearanceSettings';

/**
 * The main layout component for the admin panel.
 * It wraps the page content with a sidebar or topbar depending on the chosen appearance theme.
 * @param {{children: React.ReactNode}} props - The component props.
 * @returns {JSX.Element} The rendered admin layout.
 */
export default function AdminLayoutClient({ children }) {
  const pathname = usePathname();
  const { t, setLang, lang } = useAdminTranslations();
  const { adminAppearance, isLoading } = useAppearance();
  const appearance = adminAppearance;

  /**
   * Handles user logout by calling the logout API endpoint and redirecting to the login page.
   */
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/fonok';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // On the login and change-password pages, we don't want to show the admin layout,
  // so we just render the children directly.
  if (pathname === '/fonok' || pathname.startsWith('/fonok/change-password')) {
    return <>{children}</>;
  }

  // Show a loading indicator while translations or appearance settings are being fetched.
  if (isLoading || !t) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading Admin Interface...</p>
      </div>
    );
  }

  // Define the navigation links for the admin panel.
  const navLinks = [
    { href: "/fonok/dashboard", label: t.layout.dashboard, id: "dashboard" },
    { href: "/fonok/trips", label: t.layout.trips, id: "trips" },
    { href: "/fonok/articles", label: t.layout.articles, id: "articles" },
    { href: "/fonok/settings", label: t.layout.settings, id: "settings" },
    { href: "/fonok/styling", label: t.layout.styling, id: "styling" },
    { href: "/fonok/password", label: t.layout.changePassword, id: "password" },
  ];

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  // The main content area where the page-specific content will be rendered.
  const mainContent = <main className="flex-1 p-8 overflow-y-auto">{children}</main>;

  // CSS classes for different layout themes.
  const layoutClasses = {
    default: "flex h-screen bg-gray-100 text-black",
    compact: "flex flex-col h-screen bg-gray-50 text-black",
    playful: "flex h-screen bg-yellow-50 text-black overflow-hidden",
  };

  // CSS classes for the sidebar in different themes.
  const asideClasses = {
    default: "w-64 bg-gray-800 text-white flex flex-col",
    compact: "hidden", // Sidebar is hidden in compact view
    playful: "w-72 bg-indigo-800 text-white flex flex-col transform -rotate-6 -ml-56 origin-top-left transition-all duration-300 ease-in-out group-hover:rotate-0 group-hover:ml-0",
  };

  // Helper function to determine the CSS classes for a navigation link.
  const navLinkClasses = (href) => {
    const base = "block px-4 py-2 rounded";
    const hover = "hover:bg-gray-700";
    const active = pathname.startsWith(href) ? "bg-primary" : "";
    return `${base} ${hover} ${active}`;
  };

  // Centralized language configuration for the admin panel UI.
  const adminLanguages = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'hu', name: 'Magyar' },
    { code: 'ru', name: 'Русский' },
    { code: 'sk', name: 'Slovenčina' },
    { code: 'cs', name: 'Čeština' },
    { code: 'uk', name: 'Українська' },
    { code: 'pl', name: 'Polski' },
    { code: 'sr', name: 'Srpski' },
  ];

  /**
   * A dropdown component for changing the admin UI language.
   */
  const AdminLangSelector = () => (
    <div className={appearance === 'playful' ? "text-white" : "text-white"}>
      <label htmlFor="admin-lang" className="text-xs">UI Language</label>
      <select
        id="admin-lang"
        onChange={(e) => setLang(e.target.value)}
        value={lang}
        className="bg-gray-700 text-white p-1 rounded w-full mt-1 text-sm"
      >
        {adminLanguages.map(langInfo => (
          <option key={langInfo.code} value={langInfo.code}>{langInfo.name}</option>
        ))}
      </select>
    </div>
  );

  /**
   * The sidebar component, used in 'default' and 'playful' themes.
   */
  const Sidebar = () => {
    // This is the navigation for the 'single-page' theme.
    // It renders `<a>` tags with a scroll handler.
    const SinglePageNav = () => (
      <nav className="flex-grow p-4 space-y-2">
        {navLinks.map(link => {
          // The "Change Password" link is a normal link, not a scroll link.
          if (link.id === 'password') {
            return <Link key={link.id} href={link.href} className={navLinkClasses(link.href)}>{link.label}</Link>;
          }
          // All other links scroll to sections on the dashboard page.
          return (
            <a key={link.id} href={`/fonok/dashboard#${link.id}`} onClick={(e) => handleScrollTo(e, link.id)} className={navLinkClasses(link.href)}>
              {link.label}
            </a>
          );
        })}
      </nav>
    );

    // This is the navigation for all other themes ('default', 'playful').
    // It renders standard Next.js <Link> components for page navigation.
    const MultiPageNav = () => {
        const playfulLinkClasses = "block px-4 py-2 rounded hover:bg-indigo-700 transition-all duration-200 hover:translate-x-2";
        return (
            <nav className="flex-grow p-4 space-y-2">
                {navLinks.map(link => (
                    <Link key={link.href} href={link.href} className={appearance === 'playful' ? playfulLinkClasses : navLinkClasses(link.href)}>{link.label}</Link>
                ))}
            </nav>
        );
    };

    return (
      <aside className={asideClasses[appearance]}>
        <div className={`p-4 text-xl font-bold border-b ${appearance === 'playful' ? 'border-indigo-700' : 'border-gray-700'}`}>{t.layout.title}</div>

        {appearance === 'single-page' ? <SinglePageNav /> : <MultiPageNav />}

        <div className={`p-4 border-t ${appearance === 'playful' ? 'border-indigo-700' : 'border-gray-700'}`}>
          <AdminLangSelector />
        </div>
        <div className={`p-4 border-t ${appearance === 'playful' ? 'border-indigo-700' : 'border-gray-700'}`}>
          <button onClick={handleLogout} className="w-full px-4 py-2 text-left rounded hover:bg-gray-700">{t.layout.logout}</button>
        </div>
      </aside>
    );
  };

  /**
   * The topbar component, used in the 'compact' theme.
   */
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

  // Render the appropriate layout based on the appearance setting.
  return (
    <div className={layoutClasses[appearance]}>
      {appearance !== 'compact' && <div className="group"><Sidebar /></div>}
      {appearance === 'compact' && <Topbar />}
      {mainContent}
    </div>
  );
}
