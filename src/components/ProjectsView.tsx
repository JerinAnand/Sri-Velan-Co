/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Let's import lucide-react icons carefully as standard named imports:
import {
  Building2, 
  Droplet, 
  Hammer, 
  MapPin, 
  ListFilter,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  Quote,
  X,
  Target,
  FileCheck,
  Zap,
  Lock,
  ChevronRight,
  Sparkles,
  Award,
  FileText,
  CalendarCheck,
  CheckCircle2,
  ExternalLink,
  Navigation
} from 'lucide-react';

import { INITIAL_CONSTRUCTION_EXPERIENCE } from '../data/constructionExperience';
import { ConstructionCategory } from '../types';
import { PROJECTS, CYCLONE_RELIEF_TIMELINE, SERVICE_CATEGORIES } from '../data';
import { ProjectItem } from '../types';
import companyLogo from '../assets/images/sri-velan-logo.png';
import { useTranslation } from '../context/TranslationContext';
import { useSiteContent } from '../context/SiteContentContext';
import { translations, getValueByPath } from '../translations';

export const ProjectsView: React.FC = () => {
  const { t, language } = useTranslation();
  const { siteContent } = useSiteContent();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'government' | 'water-resource' | 'infrastructure' | 'emergency-relief'>('all');
  const [activeCaseStudy, setActiveCaseStudy] = useState<ProjectItem | null>(null);

  const servicesList = (siteContent?.services?.services && siteContent.services.services.length > 0)
    ? siteContent.services.services
    : SERVICE_CATEGORIES;

  const [selectedService, setSelectedService] = useState<string | null>(servicesList[0]?.id || SERVICE_CATEGORIES[0].id);

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

  // Helper to fetch translated arrays safely
  const getTranslatedArray = (path: string, fallback: string[]): string[] => {
    const value = getValueByPath(translations[language], path) ?? getValueByPath(translations.en, path);
    return Array.isArray(value) ? value : fallback;
  };

  const activeSvc = servicesList.find(s => s.id === selectedService) || servicesList[0] || SERVICE_CATEGORIES[0];
  const activeTitle = activeSvc.title ? t(`services.${activeSvc.id}.title`, activeSvc.title) : 'Service';
  const activeFullDesc = activeSvc.fullDescription ? t(`services.${activeSvc.id}.fullDescription`, activeSvc.fullDescription) : activeSvc.description;
  const activeHighlights = activeSvc.highlights && activeSvc.highlights.length > 0
    ? activeSvc.highlights
    : getTranslatedArray(`services.${activeSvc.id}.highlights`, []);

  const projectsList: ProjectItem[] = (siteContent?.projects?.projects && siteContent.projects.projects.length > 0)
    ? siteContent.projects.projects.map((p: any) => ({
        id: p.id || `proj-${p.title?.replace(/\s+/g, '-').toLowerCase()}`,
        title: p.title || '',
        category: (p.category as any) || 'infrastructure',
        description: p.description || '',
        image: p.imageUrl || p.image || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&q=80',
        details: Array.isArray(p.details) && p.details.length > 0 
          ? p.details 
          : [
              p.year ? `Year: ${p.year}` : 'Completed', 
              p.location ? `Location: ${p.location}` : 'Tamil Nadu', 
              p.status ? `Status: ${p.status}` : 'Verified'
            ]
      }))
    : PROJECTS;

  const constructionCategories: ConstructionCategory[] = siteContent?.constructionExperience?.categories?.length
    ? siteContent.constructionExperience.categories
    : INITIAL_CONSTRUCTION_EXPERIENCE;

  // Filter projects based on categories
  const filteredProjects = selectedCategory === 'all' 
    ? projectsList 
    : projectsList.filter(p => p.category === selectedCategory);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'government': return language === 'en' ? 'HR&CE Government Contract' : 'இந்து சமய அறநிலையத் துறை ஒப்பந்தம்';
      case 'water-resource': return language === 'en' ? 'Water Management (WRD)' : 'நீர்வள மேலாண்மை (WRD)';
      case 'infrastructure': return language === 'en' ? 'Public Civil Complexes' : 'பொதுக் கட்டிட வளாகங்கள்';
      case 'emergency-relief': return language === 'en' ? 'Disaster Flood Relief' : 'பேரிடர் வெள்ள நிவாரணம்';
      default: return language === 'en' ? 'General Civil Contract' : 'பொது சிவில் ஒப்பந்தம்';
    }
  };

  // Pre-configured structured case-study content to populate dynamically based on clicked project id
  const getExtendedCaseStudyDetails = (id: string) => {
    const data: Record<string, { challenge: { en: string, ta: string }, execution: { en: string, ta: string }, outcome: { en: string, ta: string } }> = {
      'proj-temple': {
        challenge: {
          en: 'Preserving age-old heritage lime plaster coordinates while reinforcing standard load-bearing brickwork pillars. Required specialized historical artisans and non-reactive bonding agents.',
          ta: 'பாரம்பரியமிக்க சுண்ணாம்பு சாந்து பூச்சுகளை சேதப்படுத்தாமல் செங்கல் தூண்களை பலப்படுத்துதல். இதற்கு அனுபவம் வாய்ந்த பாரம்பரிய கைவினைஞர்கள் மற்றும் பிரத்யேக கலவைகள் தேவைப்பட்டன.'
        },
        execution: {
          en: 'A mixture of high-lime structural grouting combined with traditional stone masonry. Vetted continuously by HR&CE engineers to assure religious architectural compliance.',
          ta: 'உயர்தர சாந்து அடிப்படையிலான பலப்படுத்தும் கலவைகள் மற்றும் பாரம்பரிய கல் வேலைப்பாடு. சமய கட்டிடக்கலை விதிகளை பூர்த்தி செய்ய HR&CE பொறியாளர்களால் தொடர்ந்து கண்காணிக்கப்பட்டது.'
        },
        outcome: {
          en: 'Successfully established long-term stability for the temple tower, receiving official certificates of safety clearance from the Ministry of Religious Endowments.',
          ta: 'கோயில் கோபுரத்தின் நீண்ட கால ஸ்திரத்தன்மையை வெற்றிகரமாக உறுதி செய்து, அறநிலையத்துறையிடமிருந்து பாதுகாப்புக்கான அதிகாரப்பூர்வ சான்றிதழைப் பெற்றது.'
        }
      },
      'proj-pwd': {
        challenge: {
          en: 'Constructing multi-tier administrative blocks under tight governmental budget ceilings with aggressive timelines preceding seasonal monsoons.',
          ta: 'பருவமழை தொடங்குவதற்கு முன்னதாக கடுமையான பட்ஜெட் மற்றும் இறுக்கமான காலக்கெடுவுக்குள் பல அடுக்கு நிர்வாக அலுவலகங்களை உருவாக்குவது ஒரு சவாலாக இருந்தது.'
        },
        execution: {
          en: 'Deployed premium reinforced cement concrete grids (M25 mix), integrating rainwater conduit pipes and double-walled plaster facades to withstand extreme sea breezes.',
          ta: 'கடல் காற்று மற்றும் உப்புத்தன்மையைத் தாங்கும் வகையில் M25 ரக கான்கிரீட் கட்டமைப்புகள், வடிகால் குழாய்கள் மற்றும் இரட்டை சுவர் முகப்புகளை அமைத்தல்.'
        },
        outcome: {
          en: 'Delivered ahead of schedule. The buildings now serve key regional administrative desks, certified with certified structural sound layouts.',
          ta: 'நிர்ணயிக்கப்பட்ட காலத்திற்கு முன்பே முடிக்கப்பட்டது. இந்த கட்டிடங்கள் இப்போது முக்கிய பிராந்திய நிர்வாக அலுவலகங்களாகச் செயல்படுகின்றன.'
        }
      },
      'proj-wrd': {
        challenge: {
          en: 'Preventing river channel siltation and embankment breakouts across low-laying farming blocks during monsoons. Direct water vectors made excavation highly fluid.',
          ta: 'பருவமழையின் போது தாழ்வான விவசாய நிலங்களில் ஆற்றுக் கால்வாய் அரிப்பு மற்றும் கரைகள் உடைவதைத் தடுப்பது. தொடர்ந்து ஓடும் நீர் காரணமாக பணிகள் கடினமாக இருந்தன.'
        },
        execution: {
          en: 'Implemented robust stonepitched revetment blankets and concrete weirs using rapid-dry hydraulic aggregate layers to lock the channel beds.',
          ta: 'விரைவாகக் காயக்கூடிய கான்கிரீட் கலவைகளைப் பயன்படுத்தி ஆற்றின் அடிப்பகுதியை பலப்படுத்தி கல் பதிக்கும் கரைகள் மற்றும் மதகுகளை அமைத்தல்.'
        },
        outcome: {
          en: 'Zero channel breaches recorded since execution. Improved reservoir water distribution for over 2,500 local agrarian families.',
          ta: 'பணிகள் முடிந்த பிறகு கால்வாயில் எந்த உடைப்பும் ஏற்படவில்லை. 2,500க்கும் மேற்பட்ட விவசாயக் குடும்பங்களின் நீர்ப்பாசன வசதி மேம்பட்டுள்ளது.'
        }
      },
      'proj-relief-fengal': {
        challenge: {
          en: 'Operational paralysis across multiple subways and roads in Villupuram and Chennai due to sudden cyclone downpours leading to over 80 million liters of waterlogging in key traffic grids.',
          ta: 'திடீர் புயல் மழை காரணமாக விழுப்புரம் மற்றும் சென்னையில் உள்ள முக்கிய சுரங்கப்பாதைகள் மற்றும் சாலைகளில் 80 மில்லியன் லிட்டருக்கும் மேல் தண்ணீர் தேங்கி போக்குவரத்து முடங்கியது.'
        },
        execution: {
          en: 'Mobilized a dedicated task-force of 34 diesel vacuum assist pumps within 2 hours of cyclone warning flags. Maintained continuous 24-hr driver rotas throughout peak storm logging.',
          ta: 'புயல் எச்சரிக்கை வந்த 2 மணி நேரத்திற்குள் 34 டீசல் பம்புகளுடன் கூடிய மீட்புக் குழுக்கள் அனுப்பப்பட்டன. 24 மணி நேரமும் தொடர்ச்சியாக இயக்கப்பட்டது.'
        },
        outcome: {
          en: 'Over 12 major public avenues and basements completely drained in less than 24 hours. Received multiple official commendations for emergency civic relief response.',
          ta: '12க்கும் மேற்பட்ட முக்கிய பொது வழிகள் மற்றும் சுரங்கப்பாதைகள் 24 மணி நேரத்திற்குள் முழுமையாக மீட்டெடுக்கப்பட்டன. அவசரகால மீட்புப் பணிக்கான அரசு பாராட்டுகளைப் பெற்றது.'
        }
      }
    };

    const item = data[id] || {
      challenge: {
        en: 'Standardizing execution timelines while managing shifting subsoil pressures.',
        ta: 'மாறிவரும் மண் அழுத்தங்களை நிர்வகிக்கும் அதே வேளையில் செயல்பாட்டு காலக்கெடுவை தரப்படுத்துதல்.'
      },
      execution: {
        en: 'Applying PWD and WRD recommended IS-code configurations.',
        ta: 'PWD மற்றும் WRD பரிந்துரைக்கப்பட்ட IS-குறியீடு அமைப்புகளைப் பயன்படுத்துதல்.'
      },
      outcome: {
        en: 'Impeccable structural verification and state clearance compliance.',
        ta: 'குறைபாடற்ற கட்டமைப்பு சரிபார்ப்பு மற்றும் மாநில ஒப்புதல் இணக்கம்.'
      }
    };

    return {
      challenge: item.challenge[language],
      execution: item.execution[language],
      outcome: item.outcome[language]
    };
  };

  return (
    <div className="w-full pt-20 bg-neutral-50 text-neutral-905" id="projects-page-container">
      
      {/* 1. Page Header banner block */}
      <section className="relative overflow-hidden bg-brand-blue-950 py-20 sm:py-28 text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgfYw-GDmnkdsG6j8xsIh_8LqmYPlQ6H1UHb8UO2lh7yLZQbMuOVMofYnSt-E-GHpIGdmRIeZW0wVqZYbTYVHS8sqNAluO1g5fL6-DRtgSIQQVZimQeGPph6XtciBV189eP1U-ehKABl31mUB6Up85mmoW3kltZYUJYb9LmdrEB77wZgbu7hTGx63NuW5PFMdgJ4eUsG7lBsnfy7wS5QBzhWhDCM8qaKVGzo4ZC_rutv7STviPBxiSjGyLhH6rOhOR82QU5CXc7gD_"
            alt="Executed Projects portfolio background engineering"
            className="w-full h-full object-cover opacity-[0.14] filter grayscale mix-blend-color-burn"
            referrerPolicy="no-referrer"
            loading="lazy"
            width="1920"
            height="400"
          />
          <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-r from-brand-blue-950 via-brand-blue-900/60 to-transparent" />
        </div>
        
        {/* Grid overlay lines */}
        <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 text-left">
          <span className="text-xs font-mono font-bold tracking-widest text-brand-gold-400 uppercase">
            {t('projects.badge')}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display text-white">
            {t('projects.title')}
          </h1>
          <p className="max-w-3xl text-sm sm:text-base text-neutral-300 font-sans font-light leading-relaxed">
            {t('projects.subtitle')}
          </p>
        </div>
      </section>

      {/* Specialized Infrastructure Verticals Dashboard */}
      <section className="py-20 bg-white" id="services-interactive-dashboard">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-10 space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest text-brand-gold-500 uppercase">
              {t('services.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-brand-blue-900">
              {t('services.sidebarTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Nav menu Column (1/3 width) */}
            <div className="lg:col-span-4 space-y-3" id="services-sidebar-nav">
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

      {/* 3. Deep Case-Study Detail Modal overlay using Framer Motion */}
      <AnimatePresence>
        {activeCaseStudy && (
          <>
            {/* Dark glass backdrop layout */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCaseStudy(null)}
              className="fixed inset-0 bg-neutral-950 z-50 pointer-events-auto cursor-zoom-out"
            />

            {/* Modal Panel block */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 25 }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed inset-y-4 right-4 left-4 sm:inset-y-12 sm:right-6 sm:left-6 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-4xl md:w-full bg-white rounded-3xl shadow-2xl z-50 overflow-hidden text-neutral-900 border border-neutral-200 flex flex-col max-h-[92vh] text-left"
              id="case-study-modal-card"
            >
              
              {/* Header Image showcase with details banner */}
              <div className="h-56 sm:h-72 w-full relative overflow-hidden bg-brand-blue-950 shrink-0">
                <img 
                  src={activeCaseStudy.id === 'proj-pwd' ? activeCaseStudy.fallbackImage || activeCaseStudy.image : activeCaseStudy.image} 
                  alt={t(`projects.${activeCaseStudy.id}.title`, activeCaseStudy.title)}
                  className="w-full h-full object-cover filter brightness-[0.72]"
                  referrerPolicy="no-referrer"
                  onError={(e) => { (e.target as HTMLImageElement).src = companyLogo; }}
                  loading="lazy"
                  width="1000"
                  height="600"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                
                {/* Back button */}
                <button
                  onClick={() => setActiveCaseStudy(null)}
                  className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
                  aria-label="Close Case Study"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Category & Title Overlays */}
                <div className="absolute bottom-6 left-6 right-6 space-y-1 text-left">
                  <span className="text-[10px] bg-brand-gold-500 text-brand-blue-950 px-3 py-1 rounded-full font-mono font-bold uppercase tracking-wider">
                    {getCategoryLabel(activeCaseStudy.category)}
                  </span>
                  <h3 className="text-xl sm:text-2xl lg:text-3.5xl font-black font-display text-white tracking-tight">
                    {t(`projects.${activeCaseStudy.id}.title`, activeCaseStudy.title)}
                  </h3>
                </div>
              </div>

              {/* Scrollable specs panels split column */}
              <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6 text-left">
                
                {/* Split grid: Challenge vs Execution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-neutral-100 text-left">
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2 text-brand-blue-900">
                      <Target className="w-5 h-5 text-brand-gold-500 shrink-0" />
                      <h4 className="font-display font-black text-xs uppercase tracking-wider">
                        {language === 'en' ? 'The Engineering Challenge' : 'பொறியியல் சவால்'}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans font-light">
                      {getExtendedCaseStudyDetails(activeCaseStudy.id).challenge}
                    </p>
                  </div>

                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2 text-brand-blue-900">
                      <FileCheck className="w-5 h-5 text-brand-gold-500 shrink-0" />
                      <h4 className="font-display font-black text-xs uppercase tracking-wider">
                        {language === 'en' ? 'The Operations Execution' : 'செயல்பாட்டு முறை'}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans font-light">
                      {getExtendedCaseStudyDetails(activeCaseStudy.id).execution}
                    </p>
                  </div>
                </div>

                {/* Scope Outcome and Check list details combined */}
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-2 text-brand-blue-930">
                    <ShieldCheck className="w-5 h-5 text-brand-gold-500 shrink-0" />
                    <h4 className="font-display font-black text-xs uppercase tracking-wider">
                      {language === 'en' ? 'Verified Audited Outcome & Technical Compliance' : 'சரிபார்க்கப்பட்ட தணிக்கை முடிவு மற்றும் தொழில்நுட்ப இணக்கம்'}
                    </h4>
                  </div>
                  
                  <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 leading-relaxed text-xs sm:text-sm text-neutral-700 text-left">
                    <p className="font-medium text-brand-blue-950 font-sans">{getExtendedCaseStudyDetails(activeCaseStudy.id).outcome}</p>
                  </div>

                  <div className="space-y-2 pt-2 text-left">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block pb-1">
                      {language === 'en' ? 'CONTRACT WORK REGISTER CHECKPOINTS' : 'ஒப்பந்தப் பணிப் பதிவுச் சரிபார்ப்புப் புள்ளிகள்'}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {getTranslatedArray(`projects.${activeCaseStudy.id}.details`, activeCaseStudy.details).map((chk, index) => (
                        <div key={index} className="flex gap-2 bg-neutral-50/50 p-3 rounded-xl border border-neutral-150 text-xs text-neutral-600 font-sans leading-snug text-left">
                          <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <span className="text-left">{chk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
              
              {/* Institutional footer */}
              <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-between items-center shrink-0">
                <span className="text-[9px] font-mono text-neutral-400 uppercase">
                  {language === 'en' ? 'SRI VELAN & CO • CONTRACT REGISTER METRIC SHIELD' : 'ஸ்ரீ வேலன் & கோ • ஒப்பந்தப் பதிவு தொழில்நுட்பக் கேடயம்'}
                </span>
                <button
                  onClick={() => setActiveCaseStudy(null)}
                  className="bg-brand-blue-900 hover:bg-brand-blue-950 text-white font-display font-bold text-xs py-2 px-4 rounded-lg tracking-wider cursor-pointer"
                >
                  {language === 'en' ? 'Close Case Study' : 'மூடவும்'}
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3. Construction Experience Section (from Company Brochure) */}
      <section className="py-20 bg-neutral-950 text-white relative overflow-hidden" id="construction-experience-section">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/10 pb-8 text-left">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-brand-gold-400 uppercase bg-brand-gold-500/10 px-3 py-1 rounded-full border border-brand-gold-500/20">
                <Building2 className="w-3.5 h-3.5" />
                {language === 'en' ? 'COMPANY BROCHURE ARCHIVES' : 'நிறுவனக் கையேடு காப்பகம்'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-display text-white">
                {language === 'en' ? 'Construction Experience' : 'கட்டுமான அனுபவம்'}
              </h2>
              <p className="text-sm text-neutral-400 font-sans max-w-2xl leading-relaxed">
                {language === 'en'
                  ? 'Key engineering, department building, water resources, rural road, and special election infrastructure projects executed by Sri Velan & Co.'
                  : 'ஸ்ரீ வேலன் & கோவால் நிறைவேற்றப்பட்ட முக்கிய பொறியியல், அரசு கட்டிடங்கள், நீர்வளம், கிராமப்புற சாலை மற்றும் சிறப்புத் திட்டங்கள்.'}
              </p>
            </div>
            <div className="shrink-0">
              <span className="text-xs font-mono text-neutral-300 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                {language === 'en' ? 'Verified Brochure Record' : 'சரிபார்க்கப்பட்ட நிறுவனப் பதிவு'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {constructionCategories.map((cat: ConstructionCategory) => {
              const catTitle = cat.title?.[language] || cat.title?.en || cat.id;
              const projectList = cat.projects || [];

              return (
                <div
                  key={cat.id}
                  className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden hover:border-brand-gold-500/50 transition-all duration-300 flex flex-col shadow-xl group"
                >
                  {/* Category Card Header Image */}
                  <div className="relative h-48 overflow-hidden bg-neutral-950 shrink-0">
                    <img
                      src={cat.image}
                      alt={catTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold-400 bg-neutral-950/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-brand-gold-500/30">
                        {cat.id.replace('-', ' ')}
                      </span>
                      <span className="text-xs text-neutral-300 font-mono">
                        {projectList.length} {language === 'en' ? 'Projects' : 'திட்டங்கள்'}
                      </span>
                    </div>
                  </div>

                  {/* Category Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
                    <div>
                      <h3 className="text-xl font-bold font-display text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-gold-500"></span>
                        {catTitle}
                      </h3>

                      <ul className="space-y-3 font-sans">
                        {projectList.map((proj, pIdx) => {
                          const projText = typeof proj === 'string' ? proj : (proj[language] || proj.en || '');
                          return (
                            <li key={pIdx} className="flex items-start gap-2.5 text-xs text-neutral-300 leading-relaxed">
                              <span className="mt-1 shrink-0 text-brand-gold-400 font-bold">•</span>
                              <span>{projText}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                      <span>SRI VELAN & CO • BROCHURE LOG</span>
                      <span className="text-emerald-400 font-semibold">100% EXECUTED</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Extreme Dewatering Storm history logs timeline */}
      <section className="py-20 sm:py-28 bg-neutral-50 border-t border-neutral-200" id="project-timeline-relief">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 max-w-xl mx-auto mb-16 text-left sm:text-center">
            <span className="text-xs font-mono font-bold tracking-widest text-brand-blue-700 uppercase block">
              {language === 'en' ? 'DISASTER RESISTANCE DATA' : 'பேரிடர் தடுப்புத் தரவு'}
            </span>
            <h2 className="text-3xl font-black text-brand-blue-900 tracking-tight font-display">
              {t('projects.timelineTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-sans font-light">
              {t('projects.timelineSubtitle')}
            </p>
          </div>

          <div className="space-y-12">
            {CYCLONE_RELIEF_TIMELINE.map((evt) => {
              const timelineTitle = t(`projects.timeline.t${evt.year}.title`, evt.title);
              const timelineDesc = t(`projects.timeline.t${evt.year}.desc`, evt.description);
              const timelineStatLabel = t(`projects.timeline.t${evt.year}.statLabel`, evt.statLabel);
              const timelineQuote = t(`projects.timeline.t${evt.year}.quote`, evt.quote);

              return (
                <div 
                  key={evt.year} 
                  id={`timeline-event-${evt.year}`}
                  className="bg-white border border-neutral-200 p-6 sm:p-10 rounded-2xl shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 hover:scale-[1.01] hover:border-brand-blue-300 transition-all text-left"
                >
                  {/* Year tag & metric block (4/12 width) */}
                  <div className="md:col-span-4 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start md:border-r border-neutral-200 md:pr-8 gap-4 border-b border-neutral-100 pb-4 md:border-b-0 md:pb-0 shrink-0">
                    <div className="space-y-1 text-left">
                      <span className="font-mono text-4xl font-extrabold text-brand-blue-700 leading-none">{evt.year}</span>
                      <h3 className="font-display font-black text-sm sm:text-base text-neutral-900 uppercase tracking-tight">{timelineTitle}</h3>
                    </div>

                    <div className="bg-brand-blue-900/5 hover:bg-brand-blue-900/10 transition-colors p-4 rounded-xl border border-brand-blue-800/10 text-left w-full max-w-[200px] md:max-w-none">
                      <span className="block font-display font-extrabold text-brand-blue-900 text-lg sm:text-xl font-mono leading-none">{evt.stats}</span>
                      <span className="block text-[9px] text-neutral-400 font-mono tracking-wider uppercase mt-1.5 leading-none">{timelineStatLabel}</span>
                    </div>
                  </div>

                  {/* Narrative & Quote block (8/12 width) */}
                  <div className="md:col-span-8 flex flex-col justify-center space-y-4 text-left">
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans font-light">
                      {timelineDesc}
                    </p>

                    <div className="bg-neutral-50/70 p-4 border border-neutral-200/40 rounded-xl relative text-left">
                      <Quote className="w-8 h-8 text-neutral-200 absolute -top-2 -left-1 pointer-events-none" />
                      <p className="text-xs italic text-neutral-500 pl-6 leading-relaxed relative z-10 font-sans font-light text-left">
                        "{timelineQuote}"
                      </p>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
};
