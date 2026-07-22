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
  Sparkles
} from 'lucide-react';

import { PROJECTS, CYCLONE_RELIEF_TIMELINE } from '../data';
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

  // Helper to fetch translated arrays safely
  const getTranslatedArray = (path: string, fallback: string[]): string[] => {
    const value = getValueByPath(translations[language], path) ?? getValueByPath(translations.en, path);
    return Array.isArray(value) ? value : fallback;
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

      {/* 2. Main Project Case-Studies Grid */}
      <section className="py-20 bg-white" id="projects-cases-grid-group">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16 border-b border-neutral-150 pb-8 text-left">
            <div className="space-y-1.5 text-left">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest leading-none">
                {language === 'en' ? 'Portfolio Directory' : 'போர்ட்ஃபோலியோ அடைவு'}
              </span>
              <h2 className="text-3xl font-black font-display text-brand-blue-900">
                {language === 'en' ? 'Executed State Tenders' : 'நிறைவேற்றப்பட்ட அரசு ஒப்பந்தங்கள்'}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 font-sans font-light">
                {language === 'en' 
                  ? 'Select a category below to filter works. Click on any project card to read the complete executive case study.'
                  : 'பணிகளை வடிகட்ட கீழே உள்ள ஒரு பிரிவைத் தேர்ந்தெடுக்கவும். முழுமையான ஆய்வு விவரங்களைப் படிக்க ஏதேனும் ஒரு திட்ட அட்டையை கிளிக் செய்யவும்.'}
              </p>
            </div>

            {/* Filter buttons line */}
            <div className="flex flex-wrap items-center gap-2" id="portfolio-filters">
              {[
                { id: 'all', label: language === 'en' ? 'All Projects' : 'அனைத்து திட்டங்கள்' },
                { id: 'government', label: language === 'en' ? 'HR&CE Temple' : 'இந்து சமய அறநிலையத் துறை கோயில்' },
                { id: 'infrastructure', label: language === 'en' ? 'Public Buildings' : 'பொதுக் கட்டிடங்கள்' },
                { id: 'water-resource', label: language === 'en' ? 'WRD Canals' : 'WRD கால்வாய்கள்' },
                { id: 'emergency-relief', label: language === 'en' ? 'Dewatering Logs' : 'நீர் வெளியேற்றப் பதிவுகள்' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as any)}
                  className={`px-4 py-2.5 rounded-lg font-display text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    selectedCategory === tab.id 
                      ? 'bg-brand-blue-700 text-white border border-brand-blue-800 shadow-md scale-[1.02]' 
                      : 'bg-neutral-50 text-neutral-600 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-100/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((p) => {
                const imgUrl = p.id === 'proj-pwd' ? p.fallbackImage || p.image : p.image;
                const projTitle = t(`projects.${p.id}.title`, p.title);
                const projDesc = t(`projects.${p.id}.description`, p.description);
                const projDetails = getTranslatedArray(`projects.${p.id}.details`, p.details);

                return (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.35 }}
                    onClick={() => setActiveCaseStudy(p)}
                    className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-xl group transition-all duration-300 flex flex-col justify-between cursor-pointer text-left relative"
                    id={`project-card-${p.id}`}
                  >
                    <div className="flex flex-col">
                      {/* Project Header Image */}
                      <div className="h-64 overflow-hidden relative border-b border-neutral-200 shrink-0">
                        <img 
                          src={imgUrl} 
                          alt={projTitle}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 filter brightness-95"
                          referrerPolicy="no-referrer"
                          onError={(e) => { (e.target as HTMLImageElement).src = companyLogo; }}
                          loading="lazy"
                          width="600"
                          height="400"
                        />
                        {/* Dynamic category label */}
                        <div className="absolute top-4 left-4 bg-brand-blue-900/90 text-brand-gold-400 font-mono text-[9px] font-bold py-1.5 px-3.5 rounded-full uppercase border border-brand-blue-800/40 backdrop-blur-md">
                          {getCategoryLabel(p.category)}
                        </div>

                        {/* Slide-in View Case Study prompt */}
                        <div className="absolute inset-0 bg-brand-blue-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                          <span className="font-display font-bold text-sm tracking-wider uppercase text-brand-gold-400">
                            {language === 'en' ? 'View Detailed Case Study' : 'முழு விவரங்களை ஆராய்க'}
                          </span>
                          <ArrowUpRight className="w-4 h-4 text-brand-gold-400" />
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6 sm:p-8 space-y-4">
                        <h3 className="font-display font-bold text-lg sm:text-xl text-brand-blue-950 group-hover:text-brand-blue-800 transition-colors">
                          {projTitle}
                        </h3>

                        <p className="text-neutral-600 font-sans text-xs sm:text-sm leading-relaxed font-light">
                          {projDesc}
                        </p>

                        <div className="h-px bg-neutral-200 w-full" />

                        {/* List of specifics checkpoints info */}
                        <div className="space-y-2.5 text-left">
                          <p className="text-[9px] font-mono uppercase tracking-widest text-brand-gold-700 font-bold">
                            {language === 'en' ? 'Execution Highlights' : 'செயல்படுத்தப்பட்ட சிறப்பம்சங்கள்'}
                          </p>
                          <div className="grid grid-cols-1 gap-2">
                            {projDetails.slice(0, 3).map((dtl, idx) => (
                              <div key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm text-left">
                                <CheckCircle className="w-4 h-4 text-brand-blue-700 mt-0.5 shrink-0" />
                                <span className="text-neutral-700 font-sans text-left">{dtl}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom visual anchor bar */}
                    <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-between items-center">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">
                        {language === 'en' ? 'TENDER REFERENCE LOGGED' : 'அரசு டெண்டர் குறிப்புப் பதிவு'}
                      </span>
                      <span className="text-brand-blue-800 hover:text-brand-blue-900 font-display font-semibold text-xs flex items-center gap-1">
                        <span>{language === 'en' ? 'Read full specs' : 'முழு விவரங்களைக் காண்க'}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-brand-gold-500" />
                      </span>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
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
