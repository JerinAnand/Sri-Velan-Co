/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, Award, Clock, ChevronRight, Sun, Moon, FileText, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { COMPANY_DETAILS } from '../data';
import { ActiveView } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';
import { useSiteContent } from '../context/SiteContentContext';
import { useAdmin } from '../context/AdminContext';
import companyLogo from '../assets/images/sri-velan-logo.png';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage, t } = useTranslation();
  const { siteContent } = useSiteContent();
  const { isAdmin } = useAdmin();
  const navData = siteContent.navigation;
  const logoImage = navData?.logoUrl || companyLogo;
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
    { label: t('navigation.home'), view: 'home' as ActiveView },
    { label: t('navigation.about'), view: 'about' as ActiveView },
    { label: t('navigation.services'), view: 'services' as ActiveView },
    { label: t('navigation.equipments'), view: 'equipments' as ActiveView },
    { label: t('navigation.projects'), view: 'projects' as ActiveView },
    { label: t('navigation.hydraulicBroomer'), view: 'hydraulic-broomer' as ActiveView },
    { label: t('navigation.contact'), view: 'contact' as ActiveView },
  ];

  const handleNavClick = (view: ActiveView) => {
    navigate(view === 'home' ? '/' : '/' + view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50 transition-all duration-350 ease-in-out">
      {/* Top Banner Info Bar - Stays pinned and visible with the navbar */}
      <div className="bg-brand-blue-900 border-b border-brand-blue-800/60 text-white py-2.5 px-4 sm:px-6 lg:px-8 text-xs transition-all duration-350 h-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-2">
          {/* Quality Tag */}
          <div className="flex items-center gap-2 text-brand-gold-400 font-medium text-center">
            <Award className="w-3.5 h-3.5" />
            <span>{t('navigation.governmentRegistered')}</span>
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
                  src={companyLogo}
                  alt="Sri Velan & Co"
                  className="h-full w-full object-contain"
                  loading="lazy"
                  width="48"
                  height="48"
                />
              </div>
              <div className="flex flex-col">
                <h1 
                  className="text-white font-display font-bold uppercase tracking-wider group-hover:text-brand-gold-400 transition-colors"
                  style={{ width: '189.359px', fontSize: '22px', lineHeight: '32px' }}
                >
                  {COMPANY_DETAILS.name}
                </h1>
                <p 
                  className="text-[7px] leading-[13.25px] h-[12.25px] text-brand-gold-400 font-mono tracking-widest uppercase truncate"
                  style={{ maxWidth: '189.359px' }}
                  title="Powered by Trust, Proven by Provision"
                >
                  Powered by Trust, Proven by Provision
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center justify-center gap-0.5 xl:gap-1.5 py-1 max-w-[34rem] xl:max-w-[48rem] 2xl:max-w-5xl flex-1 px-2" role="menubar">
              {navItems.map((item) => {
                const isActive = activeView === item.view;
                return (
                  <button
                    key={item.view}
                    id={`nav-item-${item.view}`}
                    onClick={() => handleNavClick(item.view)}
                    aria-current={isActive ? 'page' : undefined}
                    role="menuitem"
                    className={`px-2 py-1.5 xl:px-3 xl:py-2 rounded-md font-display lg:text-[11px] xl:text-xs 2xl:text-sm font-medium transition-all duration-300 relative overflow-hidden group max-w-[90px] xl:max-w-[130px] 2xl:max-w-none text-center shrink-0 ${
                      isActive 
                        ? 'text-brand-gold-400' 
                        : 'text-neutral-200 hover:text-white'
                    }`}
                  >
                    <span className="relative z-10 block truncate" title={item.label}>{item.label}</span>
                    {/* Hover slider indicator */}
                    <span className={`absolute bottom-0 left-0 w-full h-[3px] bg-brand-gold-500 transform origin-left transition-transform duration-350 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`} />
                  </button>
                );
              })}
            </div>

            {/* Quick Consultation CTA - Desktop */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                type="button"
                onClick={() => changeLanguage(language === 'en' ? 'ta' : 'en')}
                className="px-3 py-1.5 rounded-lg border border-neutral-300/20 text-neutral-300 hover:text-brand-gold-400 hover:bg-white/10 transition-all font-display text-xs font-semibold tracking-wider flex items-center gap-1 cursor-pointer shrink-0"
                aria-label={`Switch language to ${language === 'en' ? 'Tamil' : 'English'}`}
                title={`Switch language to ${language === 'en' ? 'Tamil' : 'English'}`}
                id="header-lang-toggle-desktop"
              >
                {language === 'en' ? 'தமிழ்' : 'English'}
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="p-2.5 rounded-lg text-neutral-300 hover:text-brand-gold-400 hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer"
                title={theme === 'light' ? 'Switch to High-Contrast Dark Mode' : 'Switch to Clean Light Theme'}
                aria-label="Theme toggle button"
                id="header-theme-toggle-desktop"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-brand-gold-400" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-300" />
                )}
              </button>

              {!isAdmin && (
                <button
                  type="button"
                  onClick={() => navigate('/admin/login')}
                  className="p-2.5 rounded-lg text-neutral-300 hover:text-brand-gold-400 hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer group"
                  title="Admin Portal"
                  aria-label="Admin Portal Access"
                  id="header-admin-toggle-desktop"
                >
                  <ShieldCheck className="w-5 h-5 text-neutral-400 group-hover:text-brand-gold-400 transition-colors" />
                </button>
              )}
            </div>

            {/* Mobile Actions: Theme Toggle & Hamburger Trigger */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={() => changeLanguage(language === 'en' ? 'ta' : 'en')}
                className="px-2.5 py-1.5 rounded border border-neutral-300/20 text-neutral-200 hover:text-brand-gold-400 transition-colors font-display text-xs font-semibold cursor-pointer shrink-0"
                aria-label={`Switch language to ${language === 'en' ? 'Tamil' : 'English'}`}
                title={`Switch language to ${language === 'en' ? 'Tamil' : 'English'}`}
                id="header-lang-toggle-mobile"
              >
                {language === 'en' ? 'தமிழ்' : 'EN'}
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-lg text-neutral-200 hover:text-brand-gold-400 hover:bg-white/10 transition-colors cursor-pointer"
                title={theme === 'light' ? 'Switch to High-Contrast Dark Mode' : 'Switch to Clean Light Theme'}
                aria-label="Theme toggle button"
                id="header-theme-toggle-mobile"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-brand-gold-400" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-300" />
                )}
              </button>
              {!isAdmin && (
                <button
                  type="button"
                  onClick={() => navigate('/admin/login')}
                  className="p-2 rounded-lg text-neutral-200 hover:text-brand-gold-400 hover:bg-white/10 transition-colors cursor-pointer group"
                  title="Admin Portal"
                  aria-label="Admin Portal Access"
                  id="header-admin-toggle-mobile"
                >
                  <ShieldCheck className="w-5 h-5 text-neutral-400 group-hover:text-brand-gold-400 transition-colors" />
                </button>
              )}
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
                        src={companyLogo}
                        alt="Sri Velan & Co"
                        className="h-full w-full object-contain"
                        loading="lazy"
                        width="36"
                        height="36"
                      />
                    </div>
                    <div className="truncate">
                      <h3 className="font-display font-bold text-sm text-white tracking-wide uppercase truncate">
                        {COMPANY_DETAILS.name}
                      </h3>
                      <span className="text-[9px] text-brand-gold-400 font-mono block tracking-widest leading-none">
                        {t('navigation.establishedIn')} {COMPANY_DETAILS.yearEstablished}
                      </span>
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
                  <p className="text-[9px] text-brand-gold-400 uppercase font-mono tracking-widest mb-3 pl-2">{t('navigation.navigationDeck')}</p>
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
                  <p className="font-semibold text-white uppercase font-mono text-[9px] tracking-wider text-brand-gold-400">{t('navigation.emergencyDewatering')}</p>
                  <p className="font-sans font-light">Registered state partners maintaining localized vertical pump networks 24/7 during seasonal warning events.</p>
                </div>
                
                <div className="flex flex-col gap-2.5">
                  <a 
                    href="tel:+919894218243" 
                    aria-label="Call Emergency Dewatering Duty Representative fast coordinate mobilization at +919894218243"
                    title="Call Emergency Dewatering Duty Representative"
                    className="flex justify-center items-center gap-2 bg-gradient-to-r from-brand-gold-500 to-brand-gold-600 hover:from-brand-gold-400 hover:to-brand-gold-500 text-brand-blue-950 font-display font-extrabold text-xs tracking-wider uppercase py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-95"
                  >
                    <Phone className="w-4 h-4 text-brand-blue-950" />
                    <span>{t('navigation.callDutyDesk')}</span>
                  </a>
                  <a 
                    href="mailto:srivelan2004@gmail.com" 
                    aria-label="Email Sri Velan and Co administrative headquarters at srivelan2004@gmail.com"
                    title="Email Headquarters Office"
                    className="flex justify-center items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-display font-bold text-xs py-3.5 px-4 rounded-xl transition-colors"
                  >
                    <Mail className="w-4 h-4 text-brand-gold-400" />
                    <span>{t('navigation.emailHeadquarters')}</span>
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
