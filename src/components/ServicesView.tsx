/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Droplet, 
  Hammer, 
  MapPin, 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  CalendarCheck,
  Award
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data';
import { useTranslation } from '../context/TranslationContext';
import { useSiteContent } from '../context/SiteContentContext';
import { translations, getValueByPath } from '../translations';
import { ServiceAreaMap } from './ServiceAreaMap';
import { ServiceAreaTelemetry } from './ServiceAreaTelemetry';

export const ServicesView: React.FC = () => {
  const { t, language } = useTranslation();
  const { siteContent } = useSiteContent();

  const servicesList = (siteContent?.services?.services && siteContent.services.services.length > 0)
    ? siteContent.services.services
    : SERVICE_CATEGORIES;

  const [selectedService, setSelectedService] = useState<string | null>(servicesList[0]?.id || SERVICE_CATEGORIES[0].id);

  // Map icon comp to specific service id
  const getIcon = (id: string) => {
    switch(id) {
      case 'pwd-buildings':
        return <Building2 className="w-6 h-6" />;
      case 'wrd-projects':
        return <Droplet className="w-6 h-6" />;
      case 'rural-development':
        return <MapPin className="w-6 h-6" />;
      case 'urban-development':
        return <Award className="w-6 h-6" />;
      case 'flood-relief':
        return <Hammer className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  const activeSvc = servicesList.find(s => s.id === selectedService) || servicesList[0] || SERVICE_CATEGORIES[0];

  // Helper to fetch translated arrays safely
  const getTranslatedArray = (path: string, fallback: string[]): string[] => {
    const value = getValueByPath(translations[language], path) ?? getValueByPath(translations.en, path);
    return Array.isArray(value) ? value : fallback;
  };

  const activeTitle = activeSvc.title ? t(`services.${activeSvc.id}.title`, activeSvc.title) : 'Service';
  const activeFullDesc = activeSvc.fullDescription ? t(`services.${activeSvc.id}.fullDescription`, activeSvc.fullDescription) : activeSvc.description;
  const activeHighlights = activeSvc.highlights && activeSvc.highlights.length > 0
    ? activeSvc.highlights
    : getTranslatedArray(`services.${activeSvc.id}.highlights`, []);

  return (
    <div className="w-full pt-20" id="services-page-container">
      
      {/* Page Header banner */}
      <section className="relative overflow-hidden bg-brand-blue-950 py-16 sm:py-24 text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK_bu3E2eTRWLjgafWhf9bOZLuHqdot7H5WSM93CAJX7nMvM9Fty8GZDgrMx6eNWZKenj6QIipjw1oA4zaOBskKBz7WcaoTKBg1s1RTXIKFr8K84CxNSjpD4Lu2IZ_Xi61jCzNWNfbBvcLQ55aFy8L8hgkylmQxFTfd-5Gle-M9pgdYML2f4flRzPefmGt-I7EqcosyMkqeX5zhdoVLmhiIHmAIfrCWoeDiK0g6dybplX21LQwD16s9fOIr8Sz5RO7lSXKTMDGFQ"
            alt="Services background structural grid"
            className="w-full h-full object-cover opacity-15 filter saturate-50"
            referrerPolicy="no-referrer"
            loading="lazy"
            width="1920"
            height="400"
          />
          <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-r from-brand-blue-950 via-brand-blue-900/60 to-transparent" />
        </div>
        
        {/* Grid lines overlay */}
        <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 text-left">
          <span className="text-xs font-mono font-semibold tracking-widest text-brand-gold-400 uppercase">
            {t('services.badge')}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-brand-gold-500">
            {t('services.title')}
          </h1>
          <p className="max-w-3xl text-sm sm:text-base text-neutral-300 leading-relaxed font-sans font-light">
            {t('services.subtitle')}
          </p>
        </div>
      </section>

      {/* Main interactive segment */}
      <section className="py-20 bg-white" id="services-interactive-dashboard">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Nav menu Column (1/3 width) */}
            <div className="lg:col-span-4 space-y-3" id="services-sidebar-nav">
              <p className="text-xs font-mono text-neutral-400 tracking-wider uppercase mb-5 text-left">{t('services.sidebarTitle')}</p>
              
              {servicesList.map((svc) => {
                const isSelected = selectedService === svc.id;
                const svcTitle = t(`services.${svc.id}.title`, svc.title);

                return (
                  <button
                    key={svc.id}
                    id={`services-tab-${svc.id}`}
                    onClick={() => setSelectedService(svc.id)}
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-brand-blue-700 border-brand-blue-800 text-white shadow-md font-bold' 
                        : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-100/50'
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg shrink-0 ${
                      isSelected ? 'bg-white/20 text-brand-gold-400' : 'bg-white text-brand-blue-700 border border-neutral-200'
                    }`}>
                      {getIcon(svc.id)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-medium text-sm sm:text-base tracking-tight leading-snug group-hover:text-brand-gold-500">
                        {svcTitle}
                      </h3>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Detailed Panel Column (2/3 width) */}
            <div className="lg:col-span-8 bg-neutral-50 rounded-3xl border border-neutral-200/80 p-6 sm:p-10 shadow-xs relative overflow-hidden" id="services-details-pane">
              <div className="absolute inset-0 grid-overlay opacity-5 pointer-events-none" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSvc.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8 relative z-10"
                >
                  {/* Service Photo with accent card */}
                  <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-neutral-200 relative">
                    <img 
                      src={activeSvc.image} 
                      alt={activeTitle}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      width="800"
                      height="530"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent" />
                  </div>

                  <div className="space-y-4 text-left">
                    <h2 className="text-2xl sm:text-3xl font-black font-display text-brand-blue-900">
                      {activeTitle}
                    </h2>
                    <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-sans first-letter:text-2xl first-letter:font-bold first-letter:text-brand-blue-800">
                      {activeFullDesc}
                    </p>
                  </div>

                  {/* Highlights list checkmark bento */}
                  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 space-y-4 text-left">
                    <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                      <CalendarCheck className="w-5 h-5 text-brand-gold-500 shrink-0" />
                      <h4 className="font-display font-bold text-sm tracking-wide text-brand-blue-900 uppercase">
                        {t('services.highlightsHeader')}
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activeHighlights.map((hlt, index) => (
                        <div key={index} className="flex gap-2.5 items-start">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <p className="text-xs sm:text-sm text-neutral-700 leading-snug">{hlt}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* Disaster Relief Service Areas Section */}
      <section className="py-12 bg-white border-t border-neutral-200" id="service-area-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServiceAreaMap />
        </div>
      </section>

      {/* Service Area Telemetry Section & Pump Allocations vs On-field Staff Levels */}
      <section className="py-12 bg-neutral-50 border-t border-neutral-200" id="service-area-telemetry-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServiceAreaTelemetry />
        </div>
      </section>

      {/* Corporate Capability Section */}
      <section className="bg-brand-blue-950 text-white py-16" id="services-guarantee">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-brand-gold-400">
            {language === 'en' ? 'Tender Compliance & Vetted Resource Pools' : 'ஒப்பந்தப்புள்ளி இணக்கம் மற்றும் சரிபார்க்கப்பட்ட வளக் குழுக்கள்'}
          </h2>
          <p className="text-sm text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            {language === 'en' 
              ? 'All our operational segments are fully insured/licensed, compliant with the Hindu Religious Charitable Endowments (HR&CE), Water Resources Department (WRD), and Public Works Department (PWD) specifications.'
              : 'எங்கள் செயல்பாட்டுப் பிரிவுகள் அனைத்தும் முழுமையாகக் காப்பீடு/உரிமம் பெற்றுள்ளதோடு, இந்து சமய அறநிலையத் துறை (HR&CE), நீர்வளத் துறை (WRD) மற்றும் பொதுப்பணித்துறை (PWD) விதிமுறைகளுக்கு இணங்குபவை.'}
          </p>
        </div>
      </section>

    </div>
  );
};
