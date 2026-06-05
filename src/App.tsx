/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveView } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { AboutView } from './components/AboutView';
import { ServicesView } from './components/ServicesView';
import { EquipmentsView } from './components/EquipmentsView';
import { ProjectsView } from './components/ProjectsView';
import { HydraulicBroomer } from './components/HydraulicBroomer';
import { ContactView } from './components/ContactView';
import { AIChatBot } from './components/AIChatBot';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { ArrowUp, Phone, MessageCircle } from 'lucide-react';
import { COMPANY_DETAILS, OFFICES } from './data';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const pathMap: Record<string, ActiveView> = {
    '/': 'home',
    '/about': 'about',
    '/services': 'services',
    '/equipments': 'equipments',
    '/projects': 'projects',
    '/hydraulic-broomer': 'hydraulic-broomer',
    '/contact': 'contact'
  };

  const activeView = pathMap[location.pathname] || 'home';

  const setActiveView = (view: ActiveView) => {
    navigate(view === 'home' ? '/' : '/' + view);
  };

  // Synchronize SEO Meta Details & Document Titles Dynamically
  useEffect(() => {
    let title = `${COMPANY_DETAILS.name} | ${COMPANY_DETAILS.tagline}`;
    switch (activeView) {
      case 'about':
        title = `About Us | ${COMPANY_DETAILS.name} Class I Contractor`;
        break;
      case 'services':
        title = `Our Services | State PWD & WRD Contracts`;
        break;
      case 'equipments':
        title = `Machinery Fleet | Suction Pumps & Earthmovers`;
        break;
      case 'projects':
        title = `Project Portfolio | Cyclone Relief Timelines`;
        break;
      case 'hydraulic-broomer':
        title = `Tractor-Mounted Hydraulic Broomer Specs | Sweeper Catalog`;
        break;
      case 'contact':
        title = `Contact Our Estimators | Office Locations Chennai & Villupuram`;
        break;
      default:
        break;
    }
    document.title = title;

    // Scroll to absolute top safely on view change
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeView]);

  // Monitor scroll height to show floating shortcuts
  useEffect(() => {
    const monitorScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', monitorScroll);
    return () => window.removeEventListener('scroll', monitorScroll);
  }, []);

  // Inject Structured Institutional JSON-LD Schema Data on startup
  useEffect(() => {
    const existingSchema = document.getElementById('company-structured-data');
    if (existingSchema) existingSchema.remove();

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ConstructionBusiness',
      'name': COMPANY_DETAILS.name,
      'legalName': COMPANY_DETAILS.legalName,
      'foundingDate': COMPANY_DETAILS.yearEstablished.toString(),
      'founder': {
        '@type': 'Person',
        'name': COMPANY_DETAILS.leadership.governingPartner.name
      },
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': OFFICES[0].addressLines.join(' '),
        'addressLocality': 'Viluppuram',
        'addressRegion': 'Tamilnadu',
        'postalCode': '605103',
        'addressCountry': 'IN'
      },
      'contactPoint': [
        {
          '@type': 'ContactPoint',
          'telephone': COMPANY_DETAILS.phones[0],
          'contactType': 'customer support',
          'areaServed': 'IN'
        }
      ],
      'taxID': COMPANY_DETAILS.gstin,
      'url': window.location.origin
    };

    const scriptElement = document.createElement('script');
    scriptElement.id = 'company-structured-data';
    scriptElement.type = 'application/ld+json';
    scriptElement.innerHTML = JSON.stringify(schema);
    document.head.appendChild(scriptElement);
  }, []);

  return (
    <div id="application-layout-root" className="min-h-screen bg-neutral-50 flex flex-col justify-between overflow-x-hidden font-sans relative">
      
      {/* Sticky High Density Header */}
      <Header />

      {/* Main Structural Frame with beautiful fade transitions on view swap */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full"
          >
            <Routes location={location}>
              <Route path="/" element={<HomeView setActiveView={setActiveView} />} />
              <Route path="/about" element={<AboutView />} />
              <Route path="/services" element={<ServicesView />} />
              <Route path="/equipments" element={<EquipmentsView />} />
              <Route path="/projects" element={<ProjectsView />} />
              <Route path="/hydraulic-broomer" element={<HydraulicBroomer />} />
              <Route path="/contact" element={<ContactView />} />
              <Route path="*" element={<HomeView setActiveView={setActiveView} />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Corporate Multi-Tier Footer */}
      <Footer />

      {/* Floating Action Utilities: Instant Call Trigger + Back-To-Top Button */}
      <div className="fixed bottom-24 right-6 z-40 flex flex-col gap-3">
        
        {/* Floating Quick Emergency Dial Button */}
        <a
          href="tel:+919894218243"
          className="bg-brand-blue-700 hover:bg-brand-blue-900 border border-brand-blue-700 text-white p-3.5 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all group flex items-center gap-2"
          id="floating-emergency-dial"
          title="Call Duty Officer"
        >
          <Phone className="w-5 h-5 shrink-0" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-display text-xs font-bold uppercase tracking-wider whitespace-nowrap pl-0 group-hover:pl-1">
            Call Duty Desk
          </span>
        </a>

        {/* Floating WhatsApp Quick Contact Button */}
        <a
          href="https://wa.me/919894218243?text=Hello%20Sri%20Velan%20%26%20Co%2C%20I%20would%20like%20to%20enquire%20about%20your%20services."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-500 text-white p-3.5 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all group flex items-center gap-2"
          id="floating-whatsapp-button"
          aria-label="Contact on WhatsApp"
          title="WhatsApp Us"
        >
          <MessageCircle className="w-5 h-5 shrink-0" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-display text-xs font-bold uppercase tracking-wider whitespace-nowrap pl-0 group-hover:pl-1">
            WhatsApp Us
          </span>
        </a>

        {/* Dynamic Back to top key */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 p-3.5 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all text-shadow-sm flex items-center justify-center border border-brand-gold-600/20"
              id="back-to-top-button"
              aria-label="Back to Top Coordinates"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive AI Coaching & Helpdesk Chatbot */}
      <AIChatBot />

    </div>
  );
}
