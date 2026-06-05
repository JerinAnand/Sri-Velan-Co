/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, Award, Clock, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { COMPANY_DETAILS } from '../data';
import { ActiveView } from '../types';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const activeViewMap: Record<string, ActiveView> = {
    '/': 'home',
    '/about': 'about',
    '/services': 'services',
    '/equipments': 'equipments',
    '/projects': 'projects',
    '/hydraulic-broomer': 'hydraulic-broomer',
    '/contact': 'contact'
  };
  const activeView = activeViewMap[location.pathname] || 'home';

  // Scroll visibility indicator
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', view: 'home' as ActiveView },
    { label: 'About Us', view: 'about' as ActiveView },
    { label: 'Services', view: 'services' as ActiveView },
    { label: 'Equipments', view: 'equipments' as ActiveView },
    { label: 'Projects', view: 'projects' as ActiveView },
    { label: 'Hydraulic Broomer', view: 'hydraulic-broomer' as ActiveView },
    { label: 'Contact Us', view: 'contact' as ActiveView },
  ];

  const handleNavClick = (view: ActiveView) => {
    navigate(view === 'home' ? '/' : '/' + view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="w-full fixed top-0 z-50 transition-all duration-350 ease-in-out">
      {/* Top Banner Info Bar - Hidden on small viewports or on scroll */}
      <div className={`bg-brand-blue-900 border-b border-brand-blue-800/60 text-white py-2.5 px-4 sm:px-6 lg:px-8 text-xs transition-all duration-350 ${
        isScrolled ? 'h-0 py-0 overflow-hidden border-none' : 'h-auto'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-2">
          {/* Quality Tag */}
          <div className="flex items-center gap-2 text-brand-gold-400 font-medium text-center">
            <Award className="w-3.5 h-3.5" />
            <span>Govt. Registered Class I Contractor & ISO Standard Service</span>
          </div>
        </div>
      </div>

      {/* Primary Navigation Shell */}
      <nav 
        aria-label="Main navigation"
        className={`w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-brand-blue-900/95 backdrop-blur-md py-3 shadow-lg border-b border-brand-blue-800/40' 
            : 'bg-brand-blue-800/90 backdrop-blur-sm py-4 border-b border-brand-blue-700/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Elegant Corporate Title Logo */}
            <div 
              onClick={() => handleNavClick('home')} 
              className="flex items-center gap-3 cursor-pointer group"
              id="header-logo-container"
            >
              {/* Symbolic Monogram */}
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg overflow-hidden shadow-md group-hover:scale-110 transition-transform duration-300 shrink-0 bg-black">
               <img
                  src="/sri-velan-logo.png"
                  alt="Sri Velan & Co"
                  className="h-full w-full object-contain"
                  loading="lazy"
                  width="48"
                  height="48"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-white font-display font-bold text-base sm:text-lg lg:text-xl tracking-wide group-hover:text-brand-gold-400 transition-colors">
                  {COMPANY_DETAILS.name}
                </h1>
                <p className="text-[10px] text-brand-gold-400 font-mono tracking-widest uppercase">
                  Powered by Trust, Proven by Provision
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 py-1" role="menubar">
              {navItems.map((item) => {
                const isActive = activeView === item.view;
                return (
                  <button
                    key={item.view}
                    id={`nav-item-${item.view}`}
                    onClick={() => handleNavClick(item.view)}
                    aria-current={isActive ? 'page' : undefined}
                    role="menuitem"
                    className={`px-4 py-2 rounded-md font-display text-sm font-medium transition-all duration-300 relative overflow-hidden group ${
                      isActive 
                        ? 'text-brand-gold-400' 
                        : 'text-neutral-200 hover:text-white'
                    }`}
                  >
                    <span className="relative z-10">{item.label}</span>
                    {/* Hover slider indicator */}
                    <span className={`absolute bottom-0 left-0 w-full h-[3px] bg-brand-gold-500 transform origin-left transition-transform duration-350 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`} />
                  </button>
                );
              })}
            </div>

            {/* Quick Consultation CTA - Desktop */}
            <div className="hidden lg:block">
              <button 
                onClick={() => handleNavClick('contact')}
                className="bg-gradient-to-r from-brand-gold-500 to-brand-gold-600 text-brand-blue-950 font-display font-semibold text-sm px-5 py-2.5 rounded-lg shadow-md hover:from-brand-gold-400 hover:to-brand-gold-500 hover:shadow-lg active:scale-95 transition-all duration-200"
              >
                Get Quote
              </button>
            </div>

            {/* Mobile Hamburger Trigger */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                id="mobile-menu-toggle"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                className="p-2 rounded-lg text-neutral-200 hover:text-white hover:bg-brand-blue-700/40 transition-colors focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Animated Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black z-40"
            />
            
            {/* Full-screen Slide-out side drawer from right */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 right-0 h-full w-full sm:max-w-md bg-brand-blue-950 shadow-2xl z-50 flex flex-col justify-between border-l border-brand-blue-800/60 overflow-y-auto"
              id="mobile-menu"
            >
              <div className="p-6 space-y-6">
                
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-brand-blue-900 pb-4">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0" id="drawer-logo-block">
                    <div className="h-9 w-9 rounded overflow-hidden shrink-0 bg-black">
                      <img
                        src="/sri-velan-logo.png"
                        alt="Sri Velan & Co"
                        className="h-full w-full object-contain"
                        loading="lazy"
                        width="36"
                        height="36"
                      />
                    </div>
                    <div className="truncate">
                      <h3 className="font-display font-bold text-sm text-white tracking-wide uppercase truncate">{COMPANY_DETAILS.name}</h3>
                      <span className="text-[9px] text-brand-gold-400 font-mono block tracking-widest leading-none">ESTD 2006</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-brand-blue-900/60 transition-colors focus:outline-none shrink-0"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Nav Links List */}
                <div className="space-y-1">
                  <p className="text-[9px] text-brand-gold-400 uppercase font-mono tracking-widest mb-3 pl-2">Navigation Deck</p>
                  {navItems.map((item) => {
                    const isActive = activeView === item.view;
                    return (
                      <button
                        key={item.view}
                        id={`mobile-nav-item-${item.view}`}
                        onClick={() => handleNavClick(item.view)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left font-display text-base font-bold transition-all ${
                          isActive 
                            ? 'bg-brand-blue-900 text-brand-gold-400 border-l-4 border-brand-gold-500 pl-3' 
                            : 'text-neutral-300 hover:bg-brand-blue-900/60 hover:text-white'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-brand-gold-400' : 'text-neutral-500'}`} />
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* Drawer Footer info details */}
              <div className="p-6 bg-brand-blue-900/40 border-t border-brand-blue-900/80 space-y-4">
                <div className="space-y-1 text-xs text-neutral-400">
                  <p className="font-semibold text-white uppercase font-mono text-[9px] tracking-wider text-brand-gold-400">EMERGENCY DEWATERING DIVISION</p>
                  <p className="font-sans font-light">Class I registered state partners maintaining localized vertical pump networks 24/7 during seasonal warning events.</p>
                </div>
                
                <div className="flex flex-col gap-2.5">
                  <a 
                    href="tel:+919894218243" 
                    className="flex justify-center items-center gap-2 bg-gradient-to-r from-brand-gold-500 to-brand-gold-600 hover:from-brand-gold-400 hover:to-brand-gold-500 text-brand-blue-950 font-display font-extrabold text-xs tracking-wider uppercase py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-95"
                  >
                    <Phone className="w-4 h-4 text-brand-blue-950" />
                    <span>Call Duty Desk</span>
                  </a>
                  <a 
                    href="mailto:srivelan2004@gmail.com" 
                    className="flex justify-center items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-display font-bold text-xs py-3.5 px-4 rounded-xl transition-colors"
                  >
                    <Mail className="w-4 h-4 text-brand-gold-400" />
                    <span>Email Headquarters</span>
                  </a>
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
