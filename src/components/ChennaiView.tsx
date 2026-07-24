/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  MapPin, 
  ExternalLink
} from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';
import { ServiceAreaMap } from './ServiceAreaMap';
import { ServiceAreaTelemetry } from './ServiceAreaTelemetry';
import { WeatherAlertBanner } from './WeatherAlertBanner';
import chennaiBannerImg from '../assets/images/regenerated_image_1784867041914.jpg';

export const ChennaiView: React.FC = () => {
  const { language } = useTranslation();

  return (
    <div className="w-full pt-20" id="chennai-page-container">
      
      {/* a. Page Header banner section */}
      <section className="relative overflow-hidden bg-brand-blue-950 py-16 sm:py-24 text-white" id="chennai-header-banner">
        <div className="absolute inset-0 z-0">
          <img 
            src={chennaiBannerImg}
            alt="Chennai Zonal Grid background"
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
            {language === 'ta' ? 'சென்னை மண்டலம் & பேரிடர் ஆயத்த மையம்' : 'Chennai Zone & Disaster Readiness Hub'}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-brand-gold-500">
            {language === 'ta' ? 'சென்னை மண்டல செயல்பாடுகள் & பருவமழை தகவல்' : 'Chennai Zone & Monsoon Info'}
          </h1>
          <p className="max-w-3xl text-sm sm:text-base text-neutral-300 leading-relaxed font-sans font-light">
            {language === 'ta'
              ? 'நிகழ்நேர பருவமழை கண்காணிப்பு, பெருநகர சென்னை மாநகராட்சி (GCC) மண்டல வரைபடம், நீர் வெளியேற்றும் பம்ப் ஒதுக்கீடுகள் மற்றும் 24/7 அவசரகால பேரிடர் நிவாரண தகவல்கள்.'
              : 'Real-time monsoon tracking, Greater Chennai Corporation (GCC) zonal mapping, dewatering pump allocations, and 24/7 emergency disaster response readiness across Chennai.'}
          </p>
        </div>
      </section>

      {/* b. Real-Time Monsoon & Flood Risk Monitor */}
      <WeatherAlertBanner />

      {/* c. Check Your Zone & Division (GCC) */}
      <section className="py-12 bg-neutral-900 text-white border-t border-neutral-800" id="gcc-citizen-utility-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-brand-blue-950 via-neutral-900 to-brand-blue-950 rounded-3xl border border-brand-gold-500/30 p-6 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-start gap-5 text-left max-w-3xl">
              <div className="p-3.5 rounded-2xl bg-brand-gold-500/20 text-brand-gold-400 border border-brand-gold-500/30 shrink-0 mt-1">
                <MapPin className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-semibold tracking-widest text-brand-gold-400 uppercase">
                  {language === 'ta' ? 'பெருநகர சென்னை மாநகராட்சி (GCC) போர்டல்' : 'Greater Chennai Corporation (GCC) Portal'}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {language === 'ta' ? 'உங்கள் மண்டலம் & பிரிவை அறியவும் (GCC)' : 'Check Your Zone & Division (GCC)'}
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                  {language === 'ta'
                    ? 'உங்கள் சொத்து எந்த பெருநகர சென்னை மாநகராட்சி மண்டலம் மற்றும் பிரிவின் கீழ் வருகிறது என்பதை அறியவும்.'
                    : 'Find which Greater Chennai Corporation zone and division your property falls under.'}
                </p>
              </div>
            </div>

            <a
              href="https://chennaicorporation.gov.in/gcc/citizen-details/location-service/find_zone.jsp"
              target="_blank"
              rel="noopener noreferrer"
              id="gcc-zone-finder-btn-section"
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-display font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg shrink-0 cursor-pointer group"
            >
              <span>{language === 'ta' ? 'போர்ட்டலை திறக்கவும்' : 'Find Your Zone & Division'}</span>
              <ExternalLink className="w-4 h-4 text-brand-blue-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

          </div>
        </div>
      </section>

      {/* d. Chennai Zonal Coverage Map */}
      <section className="py-12 bg-white border-t border-neutral-200" id="service-area-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServiceAreaMap />
        </div>
      </section>

      {/* e. Service Area Telemetry Dashboard and Pump Allocations vs On-field Staff Levels */}
      <section className="py-12 bg-neutral-50 border-t border-neutral-200" id="service-area-telemetry-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServiceAreaTelemetry />
        </div>
      </section>

    </div>
  );
};
