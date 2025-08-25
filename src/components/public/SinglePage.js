/**
 * @fileoverview This file defines the SinglePage component, which renders the entire
 * public site as a single, scrollable page. It is composed of multiple sub-components,
 * each representing a section of the site (e.g., Hero, Pricing, Trips).
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

/**
 * A reusable component that wraps its children in a motion.div to animate them
 * as they scroll into view.
 * @param {{children: React.ReactNode}} props - The component props.
 * @returns {JSX.Element} The animated section.
 */
function AnimatedSection({ children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/**
 * The full-screen hero section at the top of the single-page layout.
 */
function HeroSection() {
  return (
    <section id="home" className="h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold">Train.Travel</h1>
        <p className="mt-4 text-xl text-gray-600">Your Journey Begins Here. Scroll down to explore.</p>
      </div>
    </section>
  );
}

/**
 * The pricing section, displaying translated content about pricing.
 * @param {{t: object}} props - The component props, containing translations.
 */
function PricingSection({ t }) {
  return (
    <section id="pricing" className="min-h-screen py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">{t.pricingPage.title}</h2>
        <div className="prose lg:prose-xl mx-auto text-center">
          <p>{t.pricingPage.body1}</p>
          <p>{t.pricingPage.body2}</p>
        </div>
      </div>
    </section>
  );
}

/**
 * The trips section, displaying a grid of available trips.
 * @param {{trips: Array, lang: string, t: object}} props - The component props.
 */
function TripsSection({ trips, lang, t }) {
  // Helper function to format the price based on the current language.
  const getPriceDisplay = (prices) => {
    if (!prices) return 'Price not set';
    if (lang === 'en') {
      return `€${(prices.eur || 0).toFixed(2)} / £${(prices.gbp || 0).toFixed(2)}`;
    }
    const currencyCodeMap = { de: 'eur', sk: 'eur', cs: 'czk', hu: 'huf', ru: 'rub', uk: 'uah' };
    const currencyCode = currencyCodeMap[lang];
    if (!currencyCode) return `€${(prices.eur || 0).toFixed(2)}`;
    const price = prices[currencyCode] || 0;
    return price.toLocaleString(lang, { style: 'currency', currency: currencyCode.toUpperCase(), minimumFractionDigits: 2 });
  };

  return (
    <section id="trips" className="min-h-screen py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">{t.tripsPage.title}</h2>
        {(trips && trips.length > 0) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map(trip => (
              <div key={trip._id} className="block bg-white rounded-lg shadow-lg overflow-hidden group">
                <div className="relative">
                  <img src={trip.imageUrl || 'https://images.unsplash.com/photo-1505923984062-552e3a4734d5?q=80&w=2070&auto=format&fit=crop'} alt={trip.title[lang] || trip.title.en} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="p-6 flex flex-col">
                  <h3 className="text-2xl font-bold text-gray-900 font-header">{trip.title[lang] || trip.title.en}</h3>
                  <div
                    className="prose text-text/80 line-clamp-4 flex-grow mt-2"
                    dangerouslySetInnerHTML={{ __html: trip.description[lang] || trip.description.en }}
                  />
                  <div className="mt-4 flex justify-between items-center pt-4 border-t">
                    <p className="text-lg font-bold text-primary">{getPriceDisplay(trip.prices)}</p>
                    <span className="text-text/70 text-sm">
                      {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-text/70 col-span-full">{t.tripsPage.noTrips}</p>
        )}
      </div>
    </section>
  );
}

/**
 * The articles section, displaying a grid of recent articles.
 * @param {{articles: Array, lang: string, t: object}} props - The component props.
 */
function ArticlesSection({ articles, lang, t }) {
  return (
    <section id="articles" className="min-h-screen py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">{t.articlesPage.title}</h2>
        {(articles && articles.length > 0) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <div key={article._id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
                <div className="p-6 flex-grow flex flex-col">
                  <p className="text-sm text-gray-500">{new Date(article.createdAt).toLocaleDateString()}</p>
                  <h3 className="text-xl font-semibold my-2">{article.title[lang] || article.title.en}</h3>
                  <div
                    className="prose text-gray-600 line-clamp-4 flex-grow"
                    dangerouslySetInnerHTML={{ __html: article.content[lang] || article.content.en }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 col-span-full">{t.homePage.noArticles}</p>
        )}
      </div>
    </section>
  );
}

/**
 * The about section, displaying translated content about the company.
 * @param {{t: object}} props - The component props.
 */
function AboutSection({ t }) {
  return (
    <section id="about" className="min-h-screen py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">{t.aboutPage.title}</h2>
        <div className="prose lg:prose-xl mx-auto text-center">
          <p>{t.aboutPage.subtitle}</p>
          <p>{t.aboutPage.body1}</p>
          <p>{t.aboutPage.body2}</p>
          <h3 className="text-3xl font-bold mt-8">{t.aboutPage.missionTitle}</h3>
          <p>{t.aboutPage.missionText}</p>
        </div>
      </div>
    </section>
  );
}

/**
 * The contact section, displaying contact information.
 * @param {{t: object}} props - The component props.
 */
function ContactSection({ t }) {
  // NOTE: The original page has a contact form. This is a simplified version for the single-page view.
  return (
    <section id="contact" className="min-h-screen py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">{t.contactPage.title}</h2>
        <div className="max-w-lg mx-auto text-center">
          <p className="text-lg">{t.contactPage.subtitle}</p>
          <div className="mt-8 text-xl">
            <p><span className="font-semibold">{t.contactPage.emailHeader}:</span> <a href={`mailto:contact@train.travel`} className="text-primary hover:underline">contact@train.travel</a></p>
            <p className="mt-2"><span className="font-semibold">{t.contactPage.phoneHeader}:</span> +1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The sticky header for the single-page layout. It appears after scrolling past the hero section
 * and provides smooth-scrolling navigation links to other sections.
 * @param {{t: object}} props - The component props.
 */
function SinglePageHeader({ t }) {
  const [isVisible, setIsVisible] = useState(false);

  // Effect to show/hide the header based on scroll position.
  useEffect(() => {
    const toggleVisibility = () => {
      // Show header after scrolling 80% of the viewport height.
      if (window.pageYOffset > window.innerHeight * 0.8) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Handler for smooth scrolling to a section.
  const handleScrollTo = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const navLinks = [
    { id: 'pricing', label: t.header.pricing },
    { id: 'trips', label: t.header.trips },
    { id: 'articles', label: t.header.articles },
    { id: 'about', label: t.header.about },
    { id: 'contact', label: t.header.contact },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50"
    >
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Train.Travel</h2>
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map(link => (
            <a key={link.id} href={`#${link.id}`} onClick={(e) => handleScrollTo(e, link.id)} className="text-gray-600 hover:text-primary transition-colors">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}

/**
 * The main component that assembles the entire single-page layout.
 * @param {{lang: string, t: object, trips: Array, articles: Array}} props - The component props.
 * @returns {JSX.Element} The complete single-page layout.
 */
export default function SinglePage({ lang, t, trips, articles }) {
  return (
    <div className="bg-white">
      <SinglePageHeader t={t} />
      <HeroSection />
      <AnimatedSection><PricingSection t={t} /></AnimatedSection>
      <AnimatedSection><TripsSection trips={trips} lang={lang} t={t} /></AnimatedSection>
      <AnimatedSection><ArticlesSection articles={articles} lang={lang} t={t} /></AnimatedSection>
      <AnimatedSection><AboutSection t={t} /></AnimatedSection>
      <AnimatedSection><ContactSection t={t} /></AnimatedSection>
    </div>
  );
}
