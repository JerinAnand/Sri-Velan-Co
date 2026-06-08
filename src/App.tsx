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
import { VelanChatBot } from './components/VelanChatBot';
import { BrandedLoader } from './components/BrandedLoader';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { ArrowUp, Phone, MessageCircle, ShieldCheck, Award } from 'lucide-react';
import { COMPANY_DETAILS, OFFICES } from './data';
import { useEasterEgg } from './context/EasterEggContext';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { showEasterEgg, registerClick, closeEasterEgg } = useEasterEgg();
  const [stamped, setStamped] = useState(false);

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
        title = `About Us | ${COMPANY_DETAILS.name} Contractor`;
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
      
      {/* Premium Cinematic Branded Loader Overlay */}
      <BrandedLoader />
      
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

      {/* Floating Action Utilities: Instant Call Trigger & WhatsApp Buttons */}
      <div className="fixed bottom-[88px] right-6 z-40 flex flex-col items-end gap-3 transition-all duration-300">
        
         {/* Floating Quick Emergency Dial Button */}
         <a
           href="tel:+919894218243"
           onClick={() => registerClick('emergency-dial')}
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
           onClick={() => registerClick('whatsapp')}
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
       </div>
 
       {/* Dynamic Back to top key isolated at left bottom corner to balance layout of the application */}
       <div className="fixed bottom-6 left-6 z-40">
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

       {/* Offline Intelligent AI Assistant */}
       
        {/* Easter Egg Overlay Module for Government Procurement Officers */}
        <AnimatePresence>
          {showEasterEgg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 30, opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                className="bg-gradient-to-br from-[#0a1420] via-neutral-900 to-[#1e1704] border-2 border-brand-gold-500/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-center relative shadow-2xl space-y-6 my-8"
              >
                {/* Visual Glow Ornament Header */}
                <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-brand-gold-950 border border-brand-gold-500/50 font-mono text-[9px] text-brand-gold-400 py-1 px-4.5 rounded-full uppercase tracking-widest shadow-lg animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-500 animate-ping shrink-0" />
                  Special Command Authorized
                </div>

                <div className="pt-4 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-brand-gold-500/20 rounded-full animate-ping scale-110" />
                    <div className="relative p-5 bg-gradient-to-b from-brand-gold-400 to-brand-gold-600 rounded-full border border-brand-gold-300 shadow-md">
                      <ShieldCheck className="w-12 h-12 text-brand-blue-950" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1 font-sans">
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-brand-gold-400 uppercase tracking-tight text-shadow-sm leading-none pt-2">
                    Procurement Portal Unlocked
                  </h3>
                  <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                    Emergency State Tender Bypass Mode Active
                  </p>
                </div>

                <div className="bg-neutral-900/80 border border-white/5 rounded-2xl p-5 text-left space-y-4 text-sm leading-relaxed text-neutral-200 shadow-inner">
                  <p className="text-xs sm:text-sm">
                    Greetings, <strong className="text-brand-gold-400">Government Procurement Officer</strong>! Having registered 5 interactive click signals on Sri Velan & Co's emergency dockets, you have authorized our encrypted priority defense protocols.
                  </p>
                  <p className="text-neutral-300 text-xs sm:text-sm">
                    Our dynamic diesel dewatering pump configurations, tractor-mounted mechanical hydraulic sweepers, and mobilization fleets are pre-vetted and cleared for seasonal cyclone dikes (authorized under State PWD, WRD, and PWD emergency contingency provisions).
                  </p>

                  {/* Interactive Cert Stamping Action */}
                  <div className="border border-brand-gold-500/20 bg-brand-gold-950/10 p-5 rounded-xl flex flex-col justify-center items-center text-center space-y-3 min-h-[145px] mt-4 transition-all relative overflow-hidden">
                    {stamped ? (
                      <motion.div
                        initial={{ scale: 3, rotate: -40, opacity: 0 }}
                        animate={{ scale: 1, rotate: -6, opacity: 1 }}
                        transition={{ type: 'spring', damping: 10, stiffness: 220 }}
                        className="flex flex-col items-center justify-center p-3.5 border-4 border-dashed border-emerald-500 bg-emerald-950/30 text-emerald-400 rounded-xl max-w-[320px] shadow-lg"
                      >
                        <Award className="w-8 h-8 mb-1.5 animate-bounce text-emerald-400" />
                        <span className="font-display font-black text-lg tracking-wider uppercase leading-none">PRE-COMPLIANT CERTIFIED</span>
                        <span className="font-mono text-[8px] uppercase tracking-widest mt-1">HR&CE & PWD RECOVERY DIV</span>
                        <span className="font-mono text-[7px] text-emerald-400/85 mt-0.5 font-light">REVISION CLEARANCE: APPROVED</span>
                      </motion.div>
                    ) : (
                      <div className="space-y-4 flex flex-col items-center">
                        <p className="font-sans text-xs text-neutral-400 max-w-sm">
                          Sri Velan & Co's aria integrations are optimized for procurement standards. Apply official validation stamp to pre-qualify mock bidding rosters:
                        </p>
                        <button
                          onClick={() => setStamped(true)}
                          className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-display font-extrabold text-xs uppercase py-2.5 px-6 rounded-lg active:scale-95 transition-all cursor-pointer shadow-md inline-flex items-center gap-1.5"
                          aria-label="Validation Stamp Clearance Button"
                        >
                          Stamp Clearance
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-1">
                  <button
                    onClick={() => {
                      closeEasterEgg();
                      setStamped(false);
                    }}
                    className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white font-display font-bold text-xs uppercase px-8 py-3.5 rounded-xl cursor-pointer transition-colors border border-white/10"
                    aria-label="Dismiss Easter Egg Interface"
                  >
                    Dismiss Session
                  </button>
                  <a
                    href="tel:+919894218243"
                    className="w-full sm:w-auto bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-display font-extrabold text-xs uppercase px-8 py-3.5 rounded-xl cursor-pointer transition-all shadow-lg active:scale-95 text-center inline-flex items-center justify-center gap-2"
                    aria-label="Direct Dispatch Phone Connect"
                  >
                    <Phone className="w-3.5 h-3.5 text-brand-blue-950" />
                    Initiate Direct Call
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <VelanChatBot showScrollTop={showScrollTop} />

    </div>
  );
}
