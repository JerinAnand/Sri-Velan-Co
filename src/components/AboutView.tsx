/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Target, 
  Compass, 
  Award, 
  Calendar, 
  Landmark, 
  ShieldAlert, 
  Sparkles, 
  UserCheck,
  CheckCircle2,
  FileCheck,
  MapPin,
  Flame,
  ChevronRight,
  ShieldCheck,
  FileText,
  CheckCircle,
  Quote,
  BookOpen,
  Code,
  Crown,
  Briefcase,
  Code2
} from 'lucide-react';
import { COMPANY_DETAILS, OFFICES } from '../data';
import { useSiteContent } from '../context/SiteContentContext';
import { useTranslation } from '../context/TranslationContext';

export const getRoleIcon = (designation: string) => {
  const lower = (designation || '').toLowerCase();
  if (lower.includes('founder') || lower.includes('governing partner') || lower.includes('நிறுவனர்')) {
    return <Crown className="w-3.5 h-3.5" />;
  }
  if (lower.includes('managing director') || lower.includes('இயக்குனர்')) {
    return <Briefcase className="w-3.5 h-3.5" />;
  }
  if (lower.includes('financial') || lower.includes('நிதி')) {
    return <Landmark className="w-3.5 h-3.5" />;
  }
  if (lower.includes('admin') || lower.includes('developer') || lower.includes('நிர்வாகி') || lower.includes('டெவலப்பர்')) {
    return <Code2 className="w-3.5 h-3.5" />;
  }
  return <Award className="w-3.5 h-3.5" />;
};

export const AboutView: React.FC = () => {
  const { t, language } = useTranslation();
  const { siteContent } = useSiteContent();
  const [activeTab, setActiveTab] = useState<'profile' | 'credentials' | 'milestones'>('profile');

  // Strategic milestones structured from the incorporation history
  const corporateMilestones = [
    {
      year: '2006',
      tag: 'FOUNDATION'
    },
    {
      year: '2012',
      tag: 'EXPANSION'
    },
    {
      year: '2018',
      tag: 'LEADERSHIP'
    },
    {
      year: '2024 - 2026',
      tag: 'INNOVATION'
    }
  ];

  return (
    <div className="w-full pt-20 bg-neutral-50 text-neutral-900" id="about-us-view">
      
      {/* 1. Page Title Header Banner */}
      <section className="relative overflow-hidden bg-brand-blue-950 py-20 sm:py-28 text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuIeoa8u8M0arVT7_o57XzxAh-Ku0PRuDLHn5MA8TaDCE-Umzskl7euYalDxrwoLnEl0hdkdqE1TQinF3MSCm6zHvssu8W0ipIj0yFT6sAOyTfj-UYBf2fOGar1QEJ7S_KzatJRYBaPbbCH8QfIYbMk_ON06EGNux3Kl-8l5eVDiuq6oIfD3RhIrpenEt-9gtgArczQdGo0Yq-MV0BGd8Hih3cE_M95If-3J7CvSvYY09nZ3fjRm9VAgFShARmAJx_uUBB19Z8V8xI"
            alt="About us structural background scaffolding"
            className="w-full h-full object-cover opacity-[0.14] filter grayscale mix-blend-luminosity"
            referrerPolicy="no-referrer"
            loading="lazy"
            width="1920"
            height="400"
          />
          {/* Circular drafting coordinates design overlay */}
          <div className="absolute top-1/2 left-1/3 w-96 h-96 border border-white/5 rounded-full pointer-events-none -translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] border border-white/3 rounded-full pointer-events-none -translate-y-1/2 -translate-x-1/2 border-dashed" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue-950 via-brand-blue-900/60 to-transparent" />
        </div>
        
        {/* Grid lines overlay */}
        <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 text-left">
          <span className="text-xs font-mono font-bold tracking-widest text-brand-gold-400 uppercase">
            {t('about.headerBadge')}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display text-white">
            {COMPANY_DETAILS.name} {t('about.title')}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl text-sm sm:text-base text-neutral-300 font-sans font-light leading-relaxed"
          >
            {t('about.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* 2. Interactive Navigation Subbar */}
      <section className="bg-white border-b border-neutral-200 sticky top-[72px] sm:top-[76px] z-30 shadow-xs" id="about-subbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto no-scrollbar py-3">
            {[
              { id: 'profile', label: t('about.tabs.profile') },
              { id: 'credentials', label: t('about.tabs.credentials') },
              { id: 'milestones', label: t('about.tabs.milestones') }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  const el = document.getElementById('about-interactive-cards');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`text-sm font-display font-semibold pb-1 border-b-2 whitespace-nowrap transition-all uppercase tracking-wider ${
                  activeTab === tab.id 
                    ? 'border-brand-blue-800 text-brand-blue-900 font-extrabold' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Deep Profile Narrative & Bento Layout */}
      <section className="py-20 sm:py-24 bg-white" id="about-interactive-cards">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
              
              {/* Left Col: Narrative Bio and stats checkline */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-1.5 bg-brand-blue-50 text-brand-blue-700 font-mono font-bold text-[10px] uppercase py-1.5 px-3.5 rounded-full border border-brand-blue-100">
                  <Calendar className="w-3.5 h-3.5 text-brand-blue-600" />
                  <span>{t('about.overview.badge')}</span>
                </div>
                
                <h2 className="text-2xl sm:text-3.5xl font-black text-brand-blue-900 tracking-tight leading-tight">
                  {t('about.overview.title')}
                </h2>

                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-sans first-letter:text-4xl first-letter:font-bold first-letter:text-brand-blue-800 first-letter:mr-1">
                  {siteContent.about?.companyDescription || siteContent.about?.description1 || t('about.overview.description1')}
                </p>

                <p className="text-sm text-neutral-550 leading-relaxed font-sans font-light">
                  {t('about.overview.description2')}
                </p>

                {/* Grid checklist of values */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-neutral-100">
                  <div className="flex gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-brand-gold-500 shrink-0" />
                    <p className="text-xs sm:text-sm text-neutral-700 font-semibold font-display">{t('about.overview.item1')}</p>
                  </div>
                  <div className="flex gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-brand-gold-500 shrink-0" />
                    <p className="text-xs sm:text-sm text-neutral-700 font-semibold font-display">{t('about.overview.item2')}</p>
                  </div>
                  <div className="flex gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-brand-gold-500 shrink-0" />
                    <p className="text-xs sm:text-sm text-neutral-700 font-semibold font-display">{t('about.overview.item3')}</p>
                  </div>
                  <div className="flex gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-brand-gold-500 shrink-0" />
                    <p className="text-xs sm:text-sm text-neutral-700 font-semibold font-display">{t('about.overview.item4')}</p>
                  </div>
                </div>
              </div>

              {/* Right Col: Design Grid for Highlight stats */}
              <div className="lg:col-span-5 bg-neutral-50 p-8 border border-neutral-200/80 rounded-3xl space-y-6">
                <h3 className="font-display font-black text-sm uppercase tracking-wider text-brand-blue-950 pb-3 border-b border-neutral-200">
                  {language === 'en' ? 'Registrar Credentials' : 'பதிவாளர் சான்றுகள்'}
                </h3>

                <div className="space-y-4">
                  
                  {/* Accreditation Card */}
                  <div className="bg-white p-5 border border-neutral-200 rounded-2xl flex items-start gap-4">
                    <div className="p-3 bg-brand-gold-500/10 rounded-xl text-brand-gold-600">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">{language === 'en' ? 'Classification Status' : 'வகைப்பாடு நிலை'}</p>
                      <h4 className="font-display font-bold text-base text-brand-blue-950">{language === 'en' ? 'Registered Civil Contractors' : 'பதிவு பெற்ற சிவில் ஒப்பந்தக்காரர்கள்'}</h4>
                      <p className="text-xs text-neutral-500 mt-0.5 font-light">{language === 'en' ? 'Accredited to pitch water, land development, and administrative tenders state-wide.' : 'மாநிலம் தழுவிய நீர்வள, நில மேம்பாடு மற்றும் நிர்வாக ஒப்பந்தப்புள்ளிகளில் பங்கேற்க அங்கீகரிக்கப்பட்டது.'}</p>
                    </div>
                  </div>

                  {/* Safety standard card */}
                  <div className="bg-white p-5 border border-neutral-200 rounded-2xl flex items-start gap-4">
                    <div className="p-3 bg-brand-blue-50 rounded-xl text-brand-blue-700">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">{language === 'en' ? 'Quality Management' : 'தர மேலாண்மை'}</p>
                      <h4 className="font-display font-bold text-base text-brand-blue-950">{language === 'en' ? 'Engineered Specifications' : 'பொறியியல் விவரக்குறிப்புகள்'}</h4>
                      <p className="text-xs text-neutral-500 mt-0.5 font-light">{language === 'en' ? 'Our execution checklists follow state department and MoRTH specifications covering dual pavement and dewatering blocks.' : 'எங்கள் செயல்பாடுகள் மாநிலத் துறை மற்றும் MoRTH விவரக்குறிப்புகளைப் பின்பற்றி இரட்டை நடைபாதை மற்றும் நீர் வெளியேற்றும் பணிகளை உள்ளடக்கியது.'}</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {activeTab === 'credentials' && (
            <div className="space-y-10 text-left">
              <div className="max-w-2xl">
                <h2 className="text-2xl sm:text-3xl font-black text-brand-blue-900 tracking-tight">{t('about.credentials.title')}</h2>
                <p className="text-neutral-500 text-sm mt-1">{t('about.credentials.subtitle')}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* GST Card */}
                <div className="bg-neutral-900 text-white rounded-2xl p-8 border border-neutral-800 relative overflow-hidden flex flex-col justify-between min-h-72">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/3 rounded-bl-full pointer-events-none" />
                  <div className="space-y-4">
                    <div className="inline-flex bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono text-[10px] uppercase px-2.5 py-0.5 rounded-full font-bold">{t('about.credentials.gst.tag')}</div>
                    <h3 className="font-display font-bold text-xl text-brand-gold-400">{t('about.credentials.gst.title')}</h3>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans font-light">{t('about.credentials.gst.desc')}</p>
                  </div>
                  
                  <div className="pt-6 border-t border-neutral-800 flex justify-between items-end">
                    <div>
                      <span className="block text-[9px] font-mono text-neutral-400 uppercase tracking-wider">{t('about.credentials.gst.indexLabel')}</span>
                      <span className="font-mono text-sm sm:text-base font-bold text-white tracking-wider select-all">{COMPANY_DETAILS.gstin}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">{t('about.credentials.statusActive')}</span>
                  </div>
                </div>

                {/* MSME Card */}
                <div className="bg-brand-blue-950 text-white rounded-2xl p-8 border border-brand-blue-900 relative overflow-hidden flex flex-col justify-between min-h-72">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/3 rounded-bl-full pointer-events-none" />
                  <div className="space-y-4">
                    <div className="inline-flex bg-brand-gold-500/20 text-brand-gold-400 border border-brand-gold-400/30 font-mono text-[10px] uppercase px-2.5 py-0.5 rounded-full font-bold">{t('about.credentials.msme.tag')}</div>
                    <h3 className="font-display font-bold text-xl text-brand-gold-400">{t('about.credentials.msme.title')}</h3>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans font-light">{t('about.credentials.msme.desc')}</p>
                  </div>
                  
                  <div className="pt-6 border-t border-brand-blue-900/60 flex justify-between items-end">
                    <div>
                      <span className="block text-[9px] font-mono text-neutral-400 uppercase tracking-wider">{t('about.credentials.msme.udyamLabel')}</span>
                      <span className="font-mono text-sm sm:text-base font-bold text-white tracking-wider select-all">{COMPANY_DETAILS.msme}</span>
                    </div>
                    <span className="text-[10px] text-brand-gold-400 font-mono">{t('about.credentials.statusRegistered')}</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'milestones' && (
            <div className="space-y-12 text-left">
              <div className="max-w-xl">
                <span className="text-xs font-mono font-bold tracking-widest text-brand-blue-700 uppercase">{t('about.milestones.evolution')}</span>
                <h2 className="text-2xl sm:text-3.5xl font-black text-brand-blue-900 tracking-tight mt-1">
                  {language === 'en' ? '20-Year Infrastructure Trajectory' : '20-ஆண்டு உள்கட்டமைப்பு வளர்ச்சிப் பாதை'}
                </h2>
                <p className="text-neutral-550 text-xs sm:text-sm font-sans font-light">{t('about.milestones.desc')}</p>
              </div>

              {/* Milestones Vertical Stack */}
              <div className="relative border-l border-neutral-200 pl-6 sm:pl-8 ml-4 sm:ml-6 space-y-10 py-2">
                {corporateMilestones.map((ms, idx) => {
                  const milTitle = t(`about.milestones.items.${idx}.title`);
                  const milDesc = t(`about.milestones.items.${idx}.desc`);
                  const milTag = t(`about.milestones.items.${idx}.tag`);

                  return (
                    <div key={idx} className="relative group">
                      {/* Node Dot indicator */}
                      <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-4 w-4 rounded-full bg-brand-gold-500 border-4 border-white shadow-md group-hover:bg-brand-blue-800 transition-colors" />
                      
                      <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-250/70 hover:border-brand-blue-700/30 hover:bg-white hover:shadow-lg transition-all max-w-3xl">
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <span className="font-mono text-xl sm:text-2xl font-black text-brand-blue-900 tracking-tight">
                            {ms.year}
                          </span>
                          <span className="text-[9px] font-mono tracking-widest bg-brand-blue-900/5 text-brand-blue-850 px-2 py-0.5 rounded border border-brand-blue-800/10 uppercase font-semibold">
                            {milTag}
                          </span>
                        </div>
                        
                        <h4 className="font-display font-bold text-sm sm:text-base text-neutral-900 mb-1">
                          {milTitle}
                        </h4>
                        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans font-light">
                          {milDesc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 4. Strategic Vision & Mission Cards */}
      <section className="py-24 bg-neutral-900 text-white border-y border-neutral-850 relative" id="about-vision-mission">
        <div className="absolute inset-0 grid-overlay opacity-5 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Vision Card */}
            <div className="bg-neutral-950 p-8 sm:p-12 rounded-3xl border border-neutral-800 shadow-xl space-y-6 flex flex-col justify-between hover:border-brand-gold-500/20 transition-all text-left">
              <div className="space-y-4">
                <div className="h-12 w-12 bg-brand-gold-500/10 text-brand-gold-400 rounded-xl flex items-center justify-center border border-brand-gold-500/20 shadow-md">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-display font-black text-xl text-white tracking-tight uppercase">{t('about.visionMission.vision.title')}</h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans font-light">
                  {siteContent?.about?.visionText || t('about.visionMission.vision.desc')}
                </p>
              </div>
              <div className="h-1 w-20 bg-brand-gold-500 rounded mt-4" />
            </div>

            {/* Mission Card */}
            <div className="bg-neutral-950 p-8 sm:p-12 rounded-3xl border border-neutral-800 shadow-xl space-y-6 flex flex-col justify-between hover:border-brand-blue-700/20 transition-all text-left">
              <div className="space-y-4">
                <div className="h-12 w-12 bg-brand-blue-500/10 text-brand-blue-400 rounded-xl flex items-center justify-center border border-brand-blue-500/20 shadow-md">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-display font-black text-xl text-white tracking-tight uppercase">{t('about.visionMission.mission.title')}</h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans font-light">
                  {siteContent?.about?.missionText || t('about.visionMission.mission.desc')}
                </p>
              </div>
              <div className="h-1 w-20 bg-brand-blue-600 rounded mt-4" />
            </div>

          </div>
        </div>
      </section>

      {/* 5. Executive Governing Board Segment (Mr. G. Selva Kumar) */}
      <section className="py-24 bg-white text-neutral-900" id="about-corporate-leadership">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono font-bold tracking-widest text-brand-blue-700 uppercase block">{t('about.leadership.badge')}</span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-blue-900 tracking-tight font-display flex items-center justify-center gap-2.5">
              <Award className="w-8 h-8 sm:w-10 sm:h-10 text-brand-gold-500 shrink-0 filter drop-shadow-sm" />
              <span>{t('about.leadership.title')}</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-sans">{t('about.leadership.subtitle')}</p>
          </div>

          <div className="max-w-5xl mx-auto bg-neutral-950 rounded-3xl overflow-hidden shadow-2xl text-white grid grid-cols-1 md:grid-cols-12 gap-0 relative border border-neutral-800 text-left">
            <div className="absolute inset-x-0 bottom-0 top-0 grid-overlay opacity-5 pointer-events-none" />
            
            {/* Left Col: High Fidelity Image */}
            <div className="md:col-span-5 h-80 md:h-auto overflow-hidden relative">
              <img 
                src={COMPANY_DETAILS.leadership.governingPartner.image} 
                alt={COMPANY_DETAILS.leadership.governingPartner.name}
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500 filter brightness-95"
                referrerPolicy="no-referrer"
                loading="lazy"
                width="600"
                height="800"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent md:hidden" />
            </div>
            {/* Right Col: Leadership bio copy panel */}
            <div className="md:col-span-7 p-8 sm:p-14 flex flex-col justify-center space-y-6 relative z-10 bg-brand-blue-950 border-t md:border-t-0 md:border-l border-brand-blue-900/60">
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1.5 bg-brand-gold-500/10 text-brand-gold-400 border border-brand-gold-400/20 rounded-full py-1 px-3 text-xs leading-none font-mono">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{t('about.leadership.roleGP')}</span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
                  {COMPANY_DETAILS.leadership.governingPartner.name}
                </h3>
                <p className="text-xs sm:text-sm text-brand-gold-500 font-mono tracking-wider uppercase leading-none font-semibold">
                  {COMPANY_DETAILS.leadership.governingPartner.role}
                </p>
              </div>

              <div className="h-px bg-brand-blue-800/60 w-full" />

              <p className="text-xs sm:text-sm md:text-base text-neutral-300 leading-relaxed font-sans font-light italic">
                "{t('about.leadership.gpBio')}"
              </p>

              <div className="pt-2 flex items-center gap-3">
                <span className="text-[10px] text-neutral-400 uppercase font-mono">{t('about.leadership.signAuthority')}</span>
                <span className="text-brand-gold-500 font-serif italic text-base block sm:text-lg tracking-wide">
                  G. Selva Kumar
                </span>
              </div>
            </div>

          </div>

          {/* 5b. Managing Director Card (Mr. Vetrivel S) */}
          <div className="max-w-5xl mx-auto bg-neutral-950 rounded-3xl overflow-hidden shadow-2xl text-white grid grid-cols-1 md:grid-cols-12 gap-0 relative border border-neutral-800 text-left mt-10">
            <div className="absolute inset-x-0 bottom-0 top-0 grid-overlay opacity-5 pointer-events-none" />
            
            {/* Left Col: High Fidelity Image */}
            <div className="md:col-span-5 h-80 md:h-auto overflow-hidden relative">
              <img 
                src={COMPANY_DETAILS.leadership.managingDirector.image} 
                alt="Mr. Vetrivel S - Managing Director"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500 filter brightness-95"
                referrerPolicy="no-referrer"
                loading="lazy"
                width="600"
                height="800"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent md:hidden" />
            </div>

            {/* Right Col: Leadership bio copy panel */}
            <div className="md:col-span-7 p-8 sm:p-14 flex flex-col justify-center space-y-6 relative z-10 bg-brand-blue-950 border-t md:border-t-0 md:border-l border-brand-blue-900/60">
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1.5 bg-brand-gold-500/10 text-brand-gold-400 border border-brand-gold-400/20 rounded-full py-1 px-3 text-xs leading-none font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('about.leadership.roleMD')}</span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
                  {COMPANY_DETAILS.leadership.managingDirector.name}
                </h3>
                <p className="text-xs sm:text-sm text-brand-gold-500 font-mono tracking-wider uppercase leading-none font-semibold">
                  {COMPANY_DETAILS.leadership.managingDirector.role}
                </p>
              </div>

              <div className="h-px bg-brand-blue-800/60 w-full" />

              <p className="text-xs sm:text-sm md:text-base text-neutral-300 leading-relaxed font-sans font-light italic">
                "{t('about.leadership.mdBio')}"
              </p>

              <div className="pt-2 flex items-center gap-3">
                <span className="text-[10px] text-neutral-400 uppercase font-mono">{t('about.leadership.signAuthority')}</span>
                <span className="text-brand-gold-500 font-serif italic text-base block sm:text-lg tracking-wide">
                  Vetrivel S
                </span>
              </div>
            </div>

          </div>

          {/* Executive Board Roles Subsection */}
          <div className="mt-20 pt-16 border-t border-neutral-200">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
              <span className="text-[10px] font-mono font-bold tracking-widest text-brand-gold-600 uppercase block">{language === 'en' ? 'ADMINISTRATING OFFICERS' : 'நிர்வாக அதிகாரிகள்'}</span>
              <h3 className="text-2xl font-black font-display text-brand-blue-950 tracking-tight">{t('about.leadership.rolesTitle')}</h3>
              <p className="text-xs text-neutral-550 font-sans">
                {t('about.leadership.rolesSubtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="about-executive-board">
              {(siteContent?.governingBoard?.boardMembers && siteContent.governingBoard.boardMembers.length > 0) ? (
                siteContent.governingBoard.boardMembers.map((member) => {
                  let displayName = member.name;
                  let displayRole = member.designation || (member as any).role || 'Leadership';
                  let displayBio = member.bio;

                  if (language === 'ta') {
                    if ((member as any).taName) displayName = (member as any).taName;
                    else if (displayName.includes('Selva Kumar')) displayName = 'திரு. ஜி. செல்வ குமார்';
                    else if (displayName.includes('Vetrivel')) displayName = 'திரு. எஸ். வெற்றிவேல்';
                    else if (displayName.includes('Dhinakaravel')) displayName = 'திரு. எஸ். தினகரவேல்';
                    else if (displayName.includes('Jerin Anand')) displayName = 'திரு. ஜெரின் ஆனந்த்';

                    if ((member as any).taDesignation) displayRole = (member as any).taDesignation;
                    else if (displayRole.toLowerCase().includes('founder') || displayRole.toLowerCase().includes('governing partner')) displayRole = 'நிறுவனர்';
                    else if (displayRole.toLowerCase().includes('managing director')) displayRole = 'நிர்வாக இயக்குனர்';
                    else if (displayRole.toLowerCase().includes('financial consultant')) displayRole = 'நிதி ஆலோசகர்';
                    else if (displayRole.toLowerCase().includes('admin') || displayRole.toLowerCase().includes('developer')) displayRole = 'நிர்வாகி & டெவலப்பர்';

                    if ((member as any).taBio) displayBio = (member as any).taBio;
                    else if (member.id === 'selva_kumar' || displayName.includes('செல்வ')) displayBio = 'தமிழ்நாட்டில் உத்திகள் சார்ந்த பல மாவட்ட மீட்பு தளவாடங்கள் மற்றும் சிவில் ஒப்பந்தங்களை இயக்குகிறார்.';
                    else if (member.id === 'vetrivel_s' || displayName.includes('வெற்றிவேல்')) displayBio = 'செயலில் உள்ள கடற்படை பொறியியல், குழு அணிதிரட்டல்கள் மற்றும் பிராந்திய யார்டுகள் மேலாண்மை ஆகியவற்றை மேற்பார்வையிடுகிறார்.';
                    else if (member.id === 'dhinakaravel' || displayName.includes('தினகரவேல்')) displayBio = 'ஒழுங்குமுறை நிதி தணிக்கைகள், ஜிஎஸ்டி சமர்ப்பிப்புகளின் இணக்கம் மற்றும் வரவு செலவு திட்டமிடல் ஆகியவற்றை நிர்வகிக்கிறார்.';
                    else if (member.id === 'jerin_anand' || displayName.includes('ஜெரின்')) displayBio = 'நிறுவன தொழில்நுட்ப இணையதளங்கள், பாதுகாப்பான டிஜிட்டல் பதிவுகள் மற்றும் டிஜிட்டல் அடையாளத்தை பராமரிக்கிறார்.';
                  }

                  return (
                    <div key={member.id} className="bg-neutral-50 border border-neutral-200/85 rounded-2xl p-6 hover:shadow-xl hover:shadow-brand-gold-500/5 hover:-translate-y-1.5 hover:scale-[1.02] hover:border-brand-gold-500/20 transition-all duration-300 flex flex-col items-center text-center space-y-4 group">
                      {(member.photoUrl || (member as any).imageUrl) ? (
                        <img src={member.photoUrl || (member as any).imageUrl} alt={displayName} className="w-16 h-16 rounded-full object-cover border border-brand-blue-800 shadow-inner group-hover:scale-110 transition-all duration-300" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-brand-blue-900 text-brand-gold-400 flex items-center justify-center font-display font-extrabold tracking-wider text-lg border border-brand-blue-800 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                          {(member as any).initials || member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="space-y-1">
                        <h4 className="font-display font-black text-sm sm:text-base text-brand-blue-950">{displayName}</h4>
                        <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-brand-gold-600 font-mono uppercase tracking-wide font-bold bg-brand-gold-50 px-2.5 py-1 rounded-full border border-brand-gold-200/50">
                          {getRoleIcon(displayRole)}
                          <span>{displayRole}</span>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-550 leading-relaxed font-sans font-light">
                        {displayBio}
                      </p>
                    </div>
                  );
                })
              ) : (
                <>
                  {/* Default Fallback Cards */}
                  {/* Mr. G. Selva Kumar */}
                  <div className="bg-neutral-50 border border-neutral-200/85 rounded-2xl p-6 hover:shadow-xl hover:shadow-brand-gold-500/5 hover:-translate-y-1.5 hover:scale-[1.02] hover:border-brand-gold-500/20 transition-all duration-300 flex flex-col items-center text-center space-y-4 group">
                    <div className="w-16 h-16 rounded-full bg-brand-blue-900 text-brand-gold-400 flex items-center justify-center font-display font-extrabold tracking-wider text-lg border border-brand-blue-800 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      SK
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display font-black text-sm sm:text-base text-brand-blue-950">{language === 'en' ? 'Mr. G. Selva Kumar' : 'திரு. ஜி. செல்வ குமார்'}</h4>
                      <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-brand-gold-600 font-mono uppercase tracking-wide font-bold bg-brand-gold-50 px-2.5 py-1 rounded-full border border-brand-gold-200/50">
                        {getRoleIcon(language === 'en' ? 'Founder' : 'நிறுவனர்')}
                        <span>{language === 'en' ? 'Founder' : 'நிறுவனர்'}</span>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-550 leading-relaxed font-sans font-light">
                      {language === 'en' 
                        ? 'Directs strategic multi-district rescue logistics and civil contracts in Tamil Nadu.' 
                        : 'தமிழ்நாட்டில் உத்திகள் சார்ந்த பல மாவட்ட மீட்பு தளவாடங்கள் மற்றும் சிவில் ஒப்பந்தங்களை இயக்குகிறார்.'}
                    </p>
                  </div>

                  {/* Mr. S. Vetrivel */}
                  <div className="bg-neutral-50 border border-neutral-200/85 rounded-2xl p-6 hover:shadow-xl hover:shadow-brand-blue-900/5 hover:-translate-y-1.5 hover:scale-[1.02] hover:border-brand-blue-900/20 transition-all duration-300 flex flex-col items-center text-center space-y-4 group">
                    <div className="w-16 h-16 rounded-full bg-brand-blue-900 text-brand-gold-400 flex items-center justify-center font-display font-extrabold tracking-wider text-lg border border-brand-blue-800 shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                      VV
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display font-black text-sm sm:text-base text-brand-blue-950">{language === 'en' ? 'Mr. S. Vetrivel' : 'திரு. எஸ். வெற்றிவேல்'}</h4>
                      <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-brand-blue-700 font-mono uppercase tracking-wide font-bold bg-brand-blue-50 px-2.5 py-1 rounded-full border border-brand-blue-200/50">
                        {getRoleIcon(language === 'en' ? 'Managing Director' : 'நிர்வாக இயக்குனர்')}
                        <span>{language === 'en' ? 'Managing Director' : 'நிர்வாக இயக்குனர்'}</span>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-550 leading-relaxed font-sans font-light">
                      {language === 'en' 
                        ? 'Oversees active fleet engineering, team mobilizations, and regional yards management.' 
                        : 'செயலில் உள்ள கடற்படை பொறியியல், குழு அணிதிரட்டல்கள் மற்றும் பிராந்திய யார்டுகள் மேலாண்மை ஆகியவற்றை மேற்பார்வையிடுகிறார்.'}
                    </p>
                  </div>

                  {/* Mr. S. Dhinakaravel */}
                  <div className="bg-neutral-50 border border-neutral-200/85 rounded-2xl p-6 hover:shadow-xl hover:shadow-neutral-400/5 hover:-translate-y-1.5 hover:scale-[1.02] hover:border-neutral-300 transition-all duration-300 flex flex-col items-center text-center space-y-4 group">
                    <img src={new URL('../assets/images/regenerated_image_1784682133184.png', import.meta.url).href} alt="Mr. S. Dhinakaravel" className="w-16 h-16 rounded-full object-cover border border-brand-blue-800 shadow-inner group-hover:scale-110 transition-all duration-300" />
                    <div className="space-y-1">
                      <h4 className="font-display font-black text-sm sm:text-base text-brand-blue-950">{language === 'en' ? 'Mr. S. Dhinakaravel' : 'திரு. எஸ். தினகரவேல்'}</h4>
                      <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-emerald-700 font-mono uppercase tracking-wide font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/50">
                        {getRoleIcon(language === 'en' ? 'Financial Consultant' : 'நிதி ஆலோசகர்')}
                        <span>{language === 'en' ? 'Financial Consultant' : 'நிதி ஆலோசகர்'}</span>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-550 leading-relaxed font-sans font-light">
                      {language === 'en' 
                        ? 'Manages regulatory financial audits, GST submissions compliance, and budget planning.' 
                        : 'ஒழுங்குமுறை நிதி தணிக்கைகள், ஜிஎஸ்டி சமர்ப்பிப்புகளின் இணக்கம் மற்றும் வரவு செலவு திட்டமிடல் ஆகியவற்றை நிர்வகிக்கிறார்.'}
                    </p>
                  </div>

                  {/* Mr. Jerin Anand */}
                  <div className="bg-neutral-50 border border-neutral-200/85 rounded-2xl p-6 hover:shadow-xl hover:shadow-brand-blue-900/5 hover:-translate-y-1.5 hover:scale-[1.02] hover:border-brand-blue-900/20 transition-all duration-300 flex flex-col items-center text-center space-y-4 group">
                    <img src={new URL('../assets/images/regenerated_image_1784683266108.jpg', import.meta.url).href} alt="Mr. Jerin Anand" className="w-16 h-16 rounded-full object-cover border border-brand-blue-800 shadow-inner group-hover:scale-110 transition-all duration-300" />
                    <div className="space-y-1">
                      <h4 className="font-display font-black text-sm sm:text-base text-brand-blue-950">{language === 'en' ? 'Mr. Jerin Anand' : 'திரு. ஜெரின் ஆனந்த்'}</h4>
                      <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-brand-blue-600 font-mono uppercase tracking-wide font-bold bg-brand-blue-50 px-2.5 py-1 rounded-full border border-brand-blue-200/50">
                        {getRoleIcon(language === 'en' ? 'Admin & Developer' : 'நிர்வாகி & டெவலப்பர்')}
                        <span>{language === 'en' ? 'Admin & Developer' : 'நிர்வாகி & டெவலப்பர்'}</span>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-550 leading-relaxed font-sans font-light">
                      {language === 'en' 
                        ? 'Maintains enterprise tech portals, secure digital records, and digital identity.' 
                        : 'நிறுவன தொழில்நுட்ப இணையதளங்கள், பாதுகாப்பான டிஜிட்டல் பதிவுகள் மற்றும் டிஜிட்டல் அடையாளத்தை பராமரிக்கிறார்.'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION A — Government Certifications Strip */}
      <section className="py-16 bg-brand-blue-950 text-white relative border-t border-brand-blue-900" id="about-certs-strip">
        <div className="absolute inset-0 grid-overlay opacity-5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest text-brand-gold-400 uppercase block">{language === 'en' ? 'COMPLIANCE & AUDIT' : 'இணக்கம் மற்றும் தணிக்கை'}</span>
            <h2 className="text-2xl sm:text-3.5xl font-black text-white tracking-tight font-display">{language === 'en' ? 'Our Registrations & Credentials' : 'எங்கள் பதிவுகள் மற்றும் சான்றுகள்'}</h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto font-sans font-light">
              {language === 'en' 
                ? 'Sri Velan & Co maintains active contracting licenses, MSME declarations, and tax registrations audited directly by state ministries.'
                : 'ஸ்ரீ வேலன் & கோ மாநில அமைச்சகங்களால் நேரடியாக தணிக்கை செய்யப்பட்ட செயலில் உள்ள ஒப்பந்த உரிமங்கள், எம்எஸ்எம்இ அறிவிப்புகள் மற்றும் வரி பதிவுகளை பராமரிக்கிறது.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Cert 1 */}
            <div className="bg-brand-blue-900/60 border border-brand-blue-800/40 p-5 rounded-2xl flex items-start gap-4 hover:border-brand-gold-500/35 transition-all">
              <div className="p-3 bg-brand-gold-500/10 rounded-xl text-brand-gold-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-brand-gold-400 uppercase tracking-wider font-semibold">{language === 'en' ? 'TENDER CAPACITY' : 'ஒப்பந்தப்புள்ளி திறன்'}</p>
                <h4 className="font-display font-medium text-sm sm:text-base text-white">{language === 'en' ? 'Government Registered Contractor' : 'அரசு பதிவு பெற்ற ஒப்பந்தக்காரர்'}</h4>
                <p className="text-xs text-neutral-300/80 font-light">{language === 'en' ? 'Cleared for state public works.' : 'மாநில பொதுப்பணித் துறைகளுக்கு அனுமதி பெற்றது.'}</p>
              </div>
            </div>

            {/* Cert 2 */}
            <div className="bg-brand-blue-900/60 border border-brand-blue-800/40 p-5 rounded-2xl flex items-start gap-4 hover:border-brand-gold-500/35 transition-all">
              <div className="p-3 bg-brand-gold-500/10 rounded-xl text-brand-gold-400 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-brand-gold-400 uppercase tracking-wider font-semibold">{language === 'en' ? 'TAX COMPLIANCE' : 'வரி இணக்கம்'}</p>
                <h4 className="font-display font-medium text-sm sm:text-base text-white">GSTIN: 33ABFFS6298G1ZU</h4>
                <p className="text-xs text-neutral-300/80 font-light">{language === 'en' ? 'Verified commercial GST entity status.' : 'சரிபார்க்கப்பட்ட வணிக ஜிஎஸ்டி நிறுவன நிலை.'}</p>
              </div>
            </div>

            {/* Cert 3 */}
            <div className="bg-brand-blue-900/60 border border-brand-blue-800/40 p-5 rounded-2xl flex items-start gap-4 hover:border-brand-gold-500/35 transition-all">
              <div className="p-3 bg-brand-gold-500/10 rounded-xl text-brand-gold-400 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-brand-gold-400 uppercase tracking-wider font-semibold">MINISTRY OF MSME</p>
                <h4 className="font-display font-medium text-sm sm:text-base text-white">UDYAM-TN-31-0046742</h4>
                <p className="text-xs text-neutral-300/80 font-light">{language === 'en' ? 'Certified micro-industrial business unit.' : 'சான்றளிக்கப்பட்ட குறு-தொழில்துறை வணிக அலகு.'}</p>
              </div>
            </div>

            {/* Cert 4 */}
            <div className="bg-brand-blue-900/60 border border-brand-blue-800/40 p-5 rounded-2xl flex items-start gap-4 hover:border-brand-gold-500/35 transition-all">
              <div className="p-3 bg-brand-gold-500/10 rounded-xl text-brand-gold-400 shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-brand-gold-400 uppercase tracking-wider font-semibold">{language === 'en' ? 'QUALITY CONTROL' : 'தரக் கட்டுப்பாடு'}</p>
                <h4 className="font-display font-medium text-sm sm:text-base text-white">{language === 'en' ? 'Engineered Quality Services' : 'தரமான பொறியியல் சேவைகள்'}</h4>
                <p className="text-xs text-neutral-300/80 font-light">{language === 'en' ? 'Committed to code-compliant engineering.' : 'விதிமுறைகளுக்கு இணங்க பொறியியல் பணிகளை செய்ய அர்ப்பணிக்கப்பட்டுள்ளது.'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B — Client Testimonials Section */}
      <section className="py-20 bg-neutral-100 border-t border-neutral-200" id="about-testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-12">
          
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold tracking-widest text-brand-blue-700 uppercase block">{t('about.testimonials.tag')}</span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-blue-900 tracking-tight font-display">{t('about.testimonials.title')}</h2>
            <p className="text-xs sm:text-sm text-neutral-550 max-w-xl mx-auto font-sans font-light">
              {t('about.testimonials.desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-brand-blue-100/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-brand-blue-800/40">
                    <Quote className="w-8 h-8 rotate-180" />
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-brand-gold-500 text-sm">★</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 font-sans italic leading-relaxed">
                  {t('about.testimonials.t1.quote')}
                </p>
              </div>
              <div className="pt-4 border-t border-neutral-100">
                <h4 className="font-display font-bold text-xs sm:text-sm text-brand-blue-950 leading-tight">{t('about.testimonials.t1.author')}</h4>
                <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{t('about.testimonials.t1.dept')}</p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-brand-blue-100/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-brand-blue-800/40">
                    <Quote className="w-8 h-8 rotate-180" />
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-brand-gold-500 text-sm">★</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 font-sans italic leading-relaxed">
                  {t('about.testimonials.t2.quote')}
                </p>
              </div>
              <div className="pt-4 border-t border-neutral-100">
                <h4 className="font-display font-bold text-xs sm:text-sm text-brand-blue-950 leading-tight">{t('about.testimonials.t2.author')}</h4>
                <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{t('about.testimonials.t2.dept')}</p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-brand-blue-100/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-brand-blue-800/40">
                    <Quote className="w-8 h-8 rotate-180" />
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-brand-gold-500 text-sm">★</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 font-sans italic leading-relaxed">
                  {t('about.testimonials.t3.quote')}
                </p>
              </div>
              <div className="pt-4 border-t border-neutral-100">
                <h4 className="font-display font-bold text-xs sm:text-sm text-brand-blue-950 leading-tight">{t('about.testimonials.t3.author')}</h4>
                <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{t('about.testimonials.t3.dept')}</p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
