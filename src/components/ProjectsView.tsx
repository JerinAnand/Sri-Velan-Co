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

export const ProjectsView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'government' | 'water-resource' | 'infrastructure' | 'emergency-relief'>('all');
  const [activeCaseStudy, setActiveCaseStudy] = useState<ProjectItem | null>(null);

  // Filter projects based on categories
  const filteredProjects = selectedCategory === 'all' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === selectedCategory);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'government': return 'HR&CE Government Contract';
      case 'water-resource': return 'Water Management (WRD)';
      case 'infrastructure': return 'Public Civil Complexes';
      case 'emergency-relief': return 'Disaster Flood Relief';
      default: return 'General Civil Contract';
    }
  };

  // Pre-configured structured case-study content to populate dynamically based on clicked project id
  const getExtendedCaseStudyDetails = (id: string) => {
    switch (id) {
      case 'proj-temple':
        return {
          challenge: 'Preserving age-old heritage lime plaster coordinates while reinforcing standard load-bearing brickwork pillars. Required specialized historical artisans and non-reactive bonding agents.',
          execution: 'A mixture of high-lime structural grouting combined with traditional stone masonry. Vetted continuously by HR&CE engineers to assure religious architectural compliance.',
          outcome: 'Successfully established long-term stability for the temple tower, receiving official certificates of safety clearance from the Ministry of Religious Endowments.'
        };
      case 'proj-pwd':
        return {
          challenge: 'Constructing multi-tier administrative blocks under tight governmental budget ceilings with aggressive timelines preceding seasonal monsoons.',
          execution: 'Deployed premium reinforced cement concrete grids (M25 mix), integrating rainwater conduit pipes and double-walled plaster facades to withstand extreme sea breezes.',
          outcome: 'Delivered ahead of schedule. The buildings now serve key regional administrative desks, certified with certified structural sound layouts.'
        };
      case 'proj-wrd':
        return {
          challenge: 'Preventing river channel siltation and embankment breakouts across low-laying farming blocks during monsoons. Direct water vectors made excavation highly fluid.',
          execution: 'Implemented robust stonepitched revetment blankets and concrete weirs using rapid-dry hydraulic aggregate layers to lock the channel beds.',
          outcome: 'Zero channel breaches recorded since execution. Improved reservoir water distribution for over 2,500 local agrarian families.'
        };
      case 'proj-relief-fengal':
        return {
          challenge: 'Operational paralysis across multiple subways and roads in Villupuram and Chennai due to sudden cyclone downpours leading to over 80 million liters of waterlogging in key traffic grids.',
          execution: 'Mobilized a dedicated task-force of 34 diesel vacuum assist pumps within 2 hours of cyclone warning flags. Maintained continuous 24-hr driver rotas throughout peak storm logging.',
          outcome: 'Over 12 major public avenues and basements completely drained in less than 24 hours. Received multiple official commendations for emergency civic relief response.'
        };
      default:
        return {
          challenge: 'Standardizing execution timelines while managing shifting subsoil pressures.',
          execution: 'Applying PWD and WRD recommended IS-code configurations.',
          outcome: 'Impeccable structural verification and state clearance compliance.'
        };
    }
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
          />
          <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-r from-brand-blue-950 via-brand-blue-900/60 to-transparent" />
        </div>
        
        {/* Grid overlay lines */}
        <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 text-left">
          <span className="text-xs font-mono font-bold tracking-widest text-brand-gold-400 uppercase">
            CERTIFIED WORKS
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display text-white">
            Our Structural Heritage & Civic Projects
          </h1>
          <p className="max-w-3xl text-sm sm:text-base text-neutral-300 font-sans font-light leading-relaxed">
            We deliver state compliance parameters on religious heritage restoration contracts, administrative complex structures, public works canals, and heavy regional stormwater dewatering layouts.
          </p>
        </div>
      </section>

      {/* 2. Main Project Case-Studies Grid */}
      <section className="py-20 bg-white" id="projects-cases-grid-group">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16 border-b border-neutral-150 pb-8">
            <div className="space-y-1.5 text-left">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest leading-none">Portfolio Directory</span>
              <h2 className="text-3xl font-black font-display text-brand-blue-900">Executed State Tenders</h2>
              <p className="text-xs sm:text-sm text-neutral-500 font-sans font-light">Select a category below to filter works. Click on any project card to read the complete executive case study.</p>
            </div>

            {/* Filter buttons line */}
            <div className="flex flex-wrap items-center gap-2" id="portfolio-filters">
              {[
                { id: 'all', label: 'All Projects' },
                { id: 'government', label: 'HR&CE Temple' },
                { id: 'infrastructure', label: 'Public Buildings' },
                { id: 'water-resource', label: 'WRD Canals' },
                { id: 'emergency-relief', label: 'Dewatering Logs' }
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
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 filter brightness-95"
                          referrerPolicy="no-referrer"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/sri-velan-logo.png'; }}
                        />
                        {/* Dynamic category label */}
                        <div className="absolute top-4 left-4 bg-brand-blue-900/90 text-brand-gold-400 font-mono text-[9px] font-bold py-1.5 px-3.5 rounded-full uppercase border border-brand-blue-800/40 backdrop-blur-md">
                          {getCategoryLabel(p.category)}
                        </div>

                        {/* Slide-in View Case Study prompt */}
                        <div className="absolute inset-0 bg-brand-blue-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                          <span className="font-display font-bold text-sm tracking-wider uppercase text-brand-gold-400">View Detailed Case Study</span>
                          <ArrowUpRight className="w-4 h-4 text-brand-gold-400" />
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6 sm:p-8 space-y-4">
                        <h3 className="font-display font-bold text-lg sm:text-xl text-brand-blue-950 group-hover:text-brand-blue-800 transition-colors">
                          {p.title}
                        </h3>

                        <p className="text-neutral-600 font-sans text-xs sm:text-sm leading-relaxed font-light">
                          {p.description}
                        </p>

                        <div className="h-px bg-neutral-200 w-full" />

                        {/* List of specifics checkpoints info */}
                        <div className="space-y-2.5">
                          <p className="text-[9px] font-mono uppercase tracking-widest text-brand-gold-700 font-bold">Execution Highlights</p>
                          <div className="grid grid-cols-1 gap-2">
                            {p.details.slice(0, 3).map((dtl, idx) => (
                              <div key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm">
                                <CheckCircle className="w-4 h-4 text-brand-blue-700 mt-0.5 shrink-0" />
                                <span className="text-neutral-700 font-sans">{dtl}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom visual anchor bar */}
                    <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-between items-center">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">TENDER REFERENCE LOGGED</span>
                      <span className="text-brand-blue-800 hover:text-brand-blue-900 font-display font-semibold text-xs flex items-center gap-1">
                        <span>Read full specs</span>
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
                  alt={activeCaseStudy.title}
                  className="w-full h-full object-cover filter brightness-[0.72]"
                  referrerPolicy="no-referrer"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/sri-velan-logo.png'; }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                
                {/* Back button */}
                <button
                  onClick={() => setActiveCaseStudy(null)}
                  className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors"
                  aria-label="Close Case Study"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Category & Title Overlays */}
                <div className="absolute bottom-6 left-6 right-6 space-y-1">
                  <span className="text-[10px] bg-brand-gold-500 text-brand-blue-950 px-3 py-1 rounded-full font-mono font-bold uppercase tracking-wider">
                    {getCategoryLabel(activeCaseStudy.category)}
                  </span>
                  <h3 className="text-xl sm:text-2xl lg:text-3.5xl font-black font-display text-white tracking-tight">
                    {activeCaseStudy.title}
                  </h3>
                </div>
              </div>

              {/* Scrollable specs panels split column */}
              <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6">
                
                {/* Split grid: Challenge vs Execution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-neutral-100">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-brand-blue-900">
                      <Target className="w-5 h-5 text-brand-gold-500 shrink-0" />
                      <h4 className="font-display font-black text-xs uppercase tracking-wider">The Engineering Challenge</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans font-light">
                      {getExtendedCaseStudyDetails(activeCaseStudy.id).challenge}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-brand-blue-900">
                      <FileCheck className="w-5 h-5 text-brand-gold-500 shrink-0" />
                      <h4 className="font-display font-black text-xs uppercase tracking-wider">The Operations Execution</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans font-light">
                      {getExtendedCaseStudyDetails(activeCaseStudy.id).execution}
                    </p>
                  </div>
                </div>

                {/* Scope Outcome and Check list details combined */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-brand-blue-930">
                    <ShieldCheck className="w-5 h-5 text-brand-gold-500 shrink-0" />
                    <h4 className="font-display font-black text-xs uppercase tracking-wider">Verified Audited Outcome & Technical Compliance</h4>
                  </div>
                  
                  <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 leading-relaxed text-xs sm:text-sm text-neutral-700">
                    <p className="font-medium text-brand-blue-950 font-sans">{getExtendedCaseStudyDetails(activeCaseStudy.id).outcome}</p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block pb-1">CONTRACT WORK REGISTER CHECKPOINTS</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeCaseStudy.details.map((chk, index) => (
                        <div key={index} className="flex gap-2 bg-neutral-50/50 p-3 rounded-xl border border-neutral-150 text-xs text-neutral-600 font-sans leading-snug">
                          <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{chk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
              
              {/* Institutional footer */}
              <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-between items-center shrink-0">
                <span className="text-[9px] font-mono text-neutral-400 uppercase">SRI VELAN & CO • CONTRACT REGISTER METRIC SHIELD</span>
                <button
                  onClick={() => setActiveCaseStudy(null)}
                  className="bg-brand-blue-900 hover:bg-brand-blue-950 text-white font-display font-bold text-xs py-2 px-4 rounded-lg tracking-wider"
                >
                  Close Case Study
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
            <span className="text-xs font-mono font-bold tracking-widest text-brand-blue-700 uppercase block">DISASTER RESISTANCE DATA</span>
            <h2 className="text-3xl font-black text-brand-blue-900 tracking-tight font-display">Historic Cyclone Dewatering Operations</h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-sans font-light">We respond to storm declarations instantly, supplying and maintaining massive vertical vacuum pump fleets across major public sectors.</p>
          </div>

          <div className="space-y-12">
            {CYCLONE_RELIEF_TIMELINE.map((evt) => (
              <div 
                key={evt.year} 
                id={`timeline-event-${evt.year}`}
                className="bg-white border border-neutral-200 p-6 sm:p-10 rounded-2xl shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 hover:scale-[1.01] hover:border-brand-blue-300 transition-all text-left"
              >
                {/* Year tag & metric block (4/12 width) */}
                <div className="md:col-span-4 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start md:border-r border-neutral-200 md:pr-8 gap-4 border-b border-neutral-100 pb-4 md:border-b-0 md:pb-0 shrink-0">
                  <div className="space-y-1 text-left">
                    <span className="font-mono text-4xl font-extrabold text-brand-blue-700 leading-none">{evt.year}</span>
                    <h3 className="font-display font-black text-sm sm:text-base text-neutral-900 uppercase tracking-tight">{evt.title}</h3>
                  </div>

                  <div className="bg-brand-blue-900/5 hover:bg-brand-blue-900/10 transition-colors p-4 rounded-xl border border-brand-blue-800/10 text-left w-full max-w-[200px] md:max-w-none">
                    <span className="block font-display font-extrabold text-brand-blue-900 text-lg sm:text-xl font-mono leading-none">{evt.stats}</span>
                    <span className="block text-[9px] text-neutral-400 font-mono tracking-wider uppercase mt-1.5 leading-none">{evt.statLabel}</span>
                  </div>
                </div>

                {/* Narrative & Quote block (8/12 width) */}
                <div className="md:col-span-8 flex flex-col justify-center space-y-4">
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans font-light">
                    {evt.description}
                  </p>

                  <div className="bg-neutral-50/70 p-4 border border-neutral-200/40 rounded-xl relative">
                    <Quote className="w-8 h-8 text-neutral-200 absolute -top-2 -left-1 pointer-events-none" />
                    <p className="text-xs italic text-neutral-500 pl-6 leading-relaxed relative z-10 font-sans font-light">
                      "{evt.quote}"
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
