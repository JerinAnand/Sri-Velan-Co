/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Droplet, 
  Award, 
  Clock, 
  PhoneCall, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Hammer,
  Sparkles,
  Database,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Compass,
  ArrowUpRight,
  Activity,
  Play,
  Pause
} from 'lucide-react';
import { COMPANY_DETAILS, SERVICE_CATEGORIES, PROJECTS } from '../data';
import { ActiveView } from '../types';

interface HomeViewProps {
  setActiveView: (view: ActiveView) => void;
}

// Custom Counter Hook to animate statistics beautifully
const useCountUp = (target: number, duration: number = 2000, trigger: boolean = true) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const end = target;
    const totalMiliseconds = duration;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 15);
    
    const timer = setInterval(() => {
      start += 1;
      if (start > end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target, duration, trigger]);

  return count;
};

export const HomeView: React.FC<HomeViewProps> = ({ setActiveView }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [activeCompetency, setActiveCompetency] = useState(0);
  const [simVolume, setSimVolume] = useState<number>(30); // 30 million liters default

  // Hero slideshow content using high-quality authenticated links
  const heroSlides = [
    {
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCK_bu3E2eTRWLjgafWhf9bOZLuHqdot7H5WSM93CAJX7nMvM9Fty8GZDgrMx6eNWZKenj6QIipjw1oA4zaOBskKBz7WcaoTKBg1s1RTXIKFr8K84CxNSjpD4Lu2IZ_Xi61jCzNWNfbBvcLQ55aFy8L8hgkylmQxFTfd-5Gle-M9pgdYML2f4flRzPefmGt-I7EqcosyMkqeX5zhdoVLmhiIHmAIfrCWoeDiK0g6dybplX21LQwD16s9fOIr8Sz5RO7lSXKTMDGFQ',
      title: 'State PWD Administrative Complexes & Residential Infrastructure',
      subtitle: 'Accredited Class I Construction',
      tagline: 'Meticulous engineering layouts, earthquake-resistant RCC frameworks, and certified governmental finishing codes.',
      badge: 'Infrastructure'
    },
    {
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtF7lQsjygWGM_wckM4HW-z2nj4oRbJglwvqyPrBOopVct0FaNayNZmcV2KclNO_D91euKAKDATiy4EK6o8y08eifUUdU9GA78MFSpP7NkllTKFnMKwV2APckmltuCrXUOQ2QX-mPrSukG22c432b0rw_ra7cIVWQ5YMRbkiKoaxjYQSkKOA0fHzRDt2xaNGGRmo0bxs0IfA74U3H4Ui_SKCTZsfqfa5zC0T4xCPuTqFNiP7LpEsi5NCEKk8KnMbTz7GUcXkKOd5t1',
      title: 'Water Resources Department Irrigation Networks',
      subtitle: 'Hydraulic Flow Management',
      tagline: 'Erecting precise brick masonry weirs, retaining canal channel linings, and concrete stonepitched flow controllers.',
      badge: 'WRD Irrigation'
    },
    {
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYKfiwAnr8tSFNjZj_XSzajQQvnAVzDU79fw73VK9DcbcAJAz2le3lr5e6XhpkbK0bStuz2LU6hPoCoBytCVOO1Id0NA5xI_ye_kSutkyrbLNS86LKr68hdy6Z5EW5Chlp5Y4BhprAchhgtOexFV6eWL5-WSI7RYWV96iLGl5czosEa5AlEQR6Cro_id1zSO760qRM0awrOHnTn5aGlACqvBLkccoIBSTozM-SoG1s7yG5I_T_T7KbRDPh8-Tl0xs_QPlVrXdxEq8w',
      title: 'High-Volume Vacuum Dewatering Response Armadas',
      subtitle: 'Disaster Relief Leader',
      tagline: 'Deploying robust 100 HP submersibles and multi-node diesel vacuum assist pumps during critical storm cycles.',
      badge: 'Emergency Ready'
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    if (isCarouselPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isCarouselPaused, heroSlides.length]);

  // Triggering hooks for numbers
  const yoeAnim = useCountUp(20, 1800);
  const pumpCount = useCountUp(100, 1500);

  // Dewatering Speed Telemetry Simulator calculations
  // Max discharge is roughly 80 million liters/day (80 MLD) with full fleet of 34 major diesel pumps.
  // 1 MLD = approx 41.6 thousand liters per hour. Let's calculate the hours to clear
  const calcClearanceDuration = (vol: number) => {
    const dailyCapacity = 80; // 80 Million Liters
    const hours = (vol / dailyCapacity) * 24;
    return hours.toFixed(1);
  };

  const calcPumpsNeeded = (vol: number) => {
    if (vol < 20) return 8;
    if (vol < 50) return 18;
    if (vol < 80) return 28;
    return 34; // Maximum major units
  };

  return (
    <div className="w-full bg-neutral-900 text-neutral-100" id="home-view-container">
      
      {/* 1. Cinematic Slideshow Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-brand-blue-950">
        
        {/* Animated Slide Frame */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0"
          >
            <img 
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              className="w-full h-full object-cover filter brightness-[0.22] saturate-[0.65]"
              referrerPolicy="no-referrer"
              onError={(e) => { (e.target as HTMLImageElement).src = '/sri-velan-logo.png'; }}
            />
            {/* Dark elegant blue radial gradient to give a cinematic corporate fade */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-blue-950/90 via-brand-blue-900/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Blueprint lines layout background overlay */}
        <div className="absolute inset-0 grid-overlay opacity-5 pointer-events-none z-0" />

        {/* Tech decorative coordinates bar in margins */}
        <div className="absolute left-8 bottom-32 hidden xl:flex flex-col gap-2 font-mono text-[10px] text-neutral-500 tracking-widest uppercase origin-left select-none pointer-events-none">
          <p className="flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-brand-gold-500" /> REGISTERED OFFICE OUTLINE: PILLUR HQ GRID</p>
          <p>GEO LATITUDE: 11° 56' 31.9" N | GEO LONGITUDE: 79° 29' 46.1" E</p>
          <p>INFRASTRUCTURE LICENSE STATUS: LEVEL-A CLASS I CERTIFIED</p>
        </div>

        {/* Content Box */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-32 sm:pt-40 lg:pt-44 text-left">
          <div className="max-w-4xl space-y-6 overflow-visible">

            {/* Floating division header */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentSlide}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 bg-brand-gold-500/15 border border-brand-gold-400/35 text-brand-gold-400 px-4 py-1.5 rounded-full text-xs font-mono font-medium tracking-widest uppercase backdrop-blur-md shadow-lg"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold-500"></span>
                </span>
                <span>{heroSlides[currentSlide].badge}</span>
                <span className="text-neutral-500">|</span>
                <span className="text-[10px] tracking-normal font-semibold">SRI VELAN & CO GROUP</span>
              </motion.div>
            </AnimatePresence>

            {/* Slider Title lines */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="space-y-4"
              >
                <p className="text-brand-gold-400 font-mono text-sm uppercase tracking-widest font-semibold">{heroSlides[currentSlide].subtitle}</p>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.08] tracking-tight font-display">
                  {heroSlides[currentSlide].title}
                </h1>
                <p className="max-w-2xl text-neutral-300 font-sans font-light text-sm sm:text-base lg:text-lg leading-relaxed">
                  {heroSlides[currentSlide].tagline}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* CTAs with beautiful glass effects */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={() => setActiveView('about')}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold-500 to-brand-gold-600 text-brand-blue-950 hover:from-brand-gold-400 hover:to-brand-gold-500 font-display font-bold px-8 py-4 rounded-lg shadow-xl hover:shadow-brand-gold-500/10 hover:scale-[1.02] active:scale-98 transition-all text-sm uppercase tracking-wider"
                id="hero-lnk-about"
              >
                <span>Enterprise Credentials</span>
                <ArrowRight className="w-4 h-4 text-brand-blue-950 font-bold" />
              </button>

              <button
                onClick={() => setActiveView('contact')}
                className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/20 hover:border-white/40 text-white font-display font-semibold px-8 py-4 rounded-lg backdrop-blur-md hover:bg-white/10 active:scale-98 transition-all text-sm uppercase tracking-wider"
                id="hero-lnk-contact"
              >
                <span>Tender Submissions Bureau</span>
                <ArrowUpRight className="w-4 h-4 text-brand-gold-400" />
              </button>
            </div>

          </div>
        </div>

        {/* Carousel slide navigation dots */}
        <div className="absolute right-8 bottom-12 z-20 flex items-center gap-4">
          <div className="flex gap-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1 rounded-full transition-all duration-350 ${
                  currentSlide === idx ? 'w-10 bg-brand-gold-500' : 'w-2 bg-neutral-600 hover:bg-neutral-500'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <span className="font-mono text-xs text-neutral-400">0{currentSlide + 1} / 0{heroSlides.length}</span>
        </div>

        {/* Direct Arrow triggers */}
        <div className="absolute left-8 bottom-12 z-20 flex items-center gap-2.5">
          <button 
            onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="p-2 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-white"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            className="p-2 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-white"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Play/Pause slideshow toggle */}
        <button
          onClick={() => setIsCarouselPaused((prev) => !prev)}
          className="absolute bottom-4 left-4 z-20 p-2 text-white bg-black/40 hover:bg-black/60 transition-all rounded-lg flex items-center justify-center border border-white/10 hover:border-white/20 active:scale-95 shadow-md"
          aria-label={isCarouselPaused ? "Play slideshow" : "Pause slideshow"}
          title={isCarouselPaused ? "Play slideshow" : "Pause slideshow"}
        >
          {isCarouselPaused ? (
            <Play className="w-4 h-4 fill-white" />
          ) : (
            <Pause className="w-4 h-4" />
          )}
        </button>

      </section>

      {/* 2. Structured Trust Stats Strip (Counter Widgets) */}
      <section className="bg-neutral-900 border-y border-neutral-800/80 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            
            {/* Stat 1 */}
            <div className="p-6 bg-neutral-950/80 border border-neutral-800/60 rounded-2xl flex flex-col items-center md:items-start text-center md:text-left gap-4 hover:border-brand-gold-500/30 transition-colors">
              <div className="p-3 bg-brand-gold-500/10 border border-brand-gold-500/15 rounded-xl text-brand-gold-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl sm:text-4xl font-display font-black text-white leading-none font-mono">
                  {yoeAnim}+
                </h3>
                <p className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest">
                  Years of Structural Legacy
                </p>
                <p className="text-xs text-neutral-500 leading-tight">Founded 2006 in Villupuram</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="p-6 bg-neutral-950/80 border border-neutral-800/60 rounded-2xl flex flex-col items-center md:items-start text-center md:text-left gap-4 hover:border-brand-gold-500/30 transition-colors">
              <div className="p-3 bg-brand-gold-500/10 border border-brand-gold-500/15 rounded-xl text-brand-gold-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl sm:text-4xl font-display font-black text-white leading-none font-mono">
                  Class I
                </h3>
                <p className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest">
                  Govt Registration Code
                </p>
                <p className="text-xs text-neutral-500 leading-tight">State WRD & PWD Accredited</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="p-6 bg-neutral-950/80 border border-neutral-800/60 rounded-2xl flex flex-col items-center md:items-start text-center md:text-left gap-4 hover:border-brand-gold-500/30 transition-colors">
              <div className="p-3 bg-brand-gold-500/10 border border-brand-gold-500/15 rounded-xl text-brand-gold-400">
                <Hammer className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl sm:text-4xl font-display font-black text-white leading-none font-mono">
                  {pumpCount}+
                </h3>
                <p className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest">
                  Heavy Machineries & Fleet
                </p>
                <p className="text-xs text-neutral-500 leading-tight">High volume dewatering & movers</p>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="p-6 bg-neutral-950/80 border border-neutral-800/60 rounded-2xl flex flex-col items-center md:items-start text-center md:text-left gap-4 hover:border-brand-gold-500/30 transition-colors">
              <div className="p-3 bg-brand-gold-500/10 border border-brand-gold-500/15 rounded-xl text-brand-gold-400">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl sm:text-4xl font-display font-black text-white leading-none font-mono">
                  24/7
                </h3>
                <p className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest">
                  Disaster Dispatch Desk
                </p>
                <p className="text-xs text-neutral-500 leading-tight">Under cyclone warning panels</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. L&T Inspired Corporate Competency Panels (Bento Layout) */}
      <section className="py-24 bg-white text-neutral-900" id="home-competency-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side text and trust descriptors */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-1.5 bg-brand-blue-50 text-brand-blue-700 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                <span>Excellence in Execution</span>
              </div>
              
              <h2 className="text-3xl sm:text-4.5xl font-black text-brand-blue-900 leading-none tracking-tight">
                Engineering Discipline That Moves Civil Assets.
              </h2>
              
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-sans font-light">
                Our approach as a **Class I contracting group** is guided by precision raw material procurement, structural concrete verification standard PWD aggregates, and complete mechanical command over dual dewatering operations to assure state networks have continuous security.
              </p>

              <div className="h-px bg-neutral-200 w-full" />

              <div className="space-y-3.5">
                {[
                  'Strict compliance with IS-code grade parameters (M30/M40 concrete matrix validation)',
                  'Extensive direct relationships with leading steel and heavy aggregate quarries',
                  'ISO 9001:2015 compliant execution checklists on block masonry works'
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm text-neutral-600">
                    <span className="h-4.5 w-4.5 rounded-full bg-brand-blue-50 text-brand-blue-700 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side interactive toggles with spec views */}
            <div className="lg:col-span-7 space-y-4">
              {[
                {
                  title: 'Water Resource & Hydraulic Engineering',
                  desc: 'Forming concrete structural weirs, distributing state feeder channel canals, stonepitched embankment pitching, and heavy irrigation conduits.',
                  metric: '50+ KM',
                  label: 'Canals lined',
                  details: ['Custom concrete masonry alignments', 'Stonepitching bank protection', 'Distribution sluices']
                },
                {
                  title: 'Disaster Dewatering & Emergency Rescue Operations',
                  desc: 'Deploying robust air-assist vacuum pumps (up to 100 HP) and experienced operators under official state directive desks on a 24-hr status loop during Cyclone warning events.',
                  metric: '100% SUCC',
                  label: 'Emergency Recoveries',
                  details: ['Vacuum-assist quick sediment passage', 'Tractor-coupled auxiliary pumps', 'Sandbag breach plugging']
                },
                {
                  title: 'Municipal Administrative Complex Structures',
                  desc: 'Constructing robust multi-story building blocks and quarters with state PWD vetting, certified premium plaster finishes, rainwater harvesting, and grid corridors.',
                  metric: '120k+ SQ',
                  label: 'Sq Ft Concrete Frame',
                  details: ['Accredited high-finish RCC frames', 'Premium department vetting', 'Compliance to municipal codes']
                }
              ].map((comp, idx) => {
                const isActive = activeCompetency === idx;
                return (
                  <div 
                    key={idx}
                    onClick={() => setActiveCompetency(idx)}
                    className={`p-6 sm:p-8 rounded-2xl border text-left cursor-pointer transition-all duration-350 select-none ${
                      isActive 
                        ? 'border-brand-blue-700 bg-brand-blue-50/20 shadow-lg ring-1 ring-brand-blue-500/10' 
                        : 'border-neutral-200 bg-white hover:bg-neutral-50/40 hover:border-neutral-300'
                    }`}
                    id={`competency-pane-${idx}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-4">
                      <div className="space-y-2 flex-1">
                        <h4 className="font-display font-black text-sm sm:text-base text-brand-blue-950 uppercase tracking-tight">
                          {comp.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-sans font-light">
                          {comp.desc}
                        </p>
                        
                        {isActive && (
                          <div className="flex flex-wrap gap-2 pt-3">
                            {comp.details.map((dtl) => (
                              <span key={dtl} className="text-[10px] bg-brand-blue-700/5 text-brand-blue-800 font-mono font-medium py-0.5 px-2.5 rounded-full border border-brand-blue-700/10">
                                {dtl}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Side Highlight counter */}
                      <div className="text-left sm:text-right shrink-0">
                        <span className="block font-display font-black text-brand-blue-800 text-lg sm:text-2xl font-mono leading-none">
                          {comp.metric}
                        </span>
                        <span className="block text-[9px] text-neutral-400 font-mono tracking-widest uppercase mt-1">
                          {comp.label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* 4. Elegant Services Grid (L&T Architectural Look) */}
      <section className="py-24 bg-neutral-950 text-white relative border-y border-neutral-800/80" id="home-services-bento">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 grid-overlay opacity-5 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-3 max-w-2xl text-left">
              <span className="text-xs font-mono font-bold tracking-widest text-brand-gold-400 uppercase block">OPERATIONAL CAPACITY</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Corporate Infrastructure Services</h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed">
                As licensed Class I construction partners, our division operations are vetted for extreme load capacities and public safety clearances across Tamil Nadu.
              </p>
            </div>
            
            <button
              onClick={() => setActiveView('services')}
              className="inline-flex items-center gap-1.5 text-brand-gold-400 hover:text-white text-xs font-semibold uppercase tracking-wider shrink-0 transition-colors"
            >
              <span>View All 6 Specialized Sectors</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICE_CATEGORIES.slice(0, 3).map((svc) => (
              <div 
                key={svc.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-md group hover:border-brand-gold-500/30 hover:shadow-brand-gold-500/5 transition-all duration-350 flex flex-col justify-between"
                id={`home-service-card-${svc.id}`}
              >
                <div className="h-56 relative overflow-hidden bg-neutral-950">
                  <img 
                    src={svc.image} 
                    alt={svc.title} 
                    className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/sri-velan-logo.png'; }}
                  />
                  {/* Subtle technical ribbon indicator */}
                  <div className="absolute top-4 right-4 bg-brand-gold-500 text-brand-blue-950 font-mono text-[9px] font-bold py-1 px-2.5 rounded-full uppercase tracking-wider">
                    SPEC COMPLIANT
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between text-left">
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-lg text-white group-hover:text-brand-gold-400 transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans font-light">
                      {svc.shortDescription}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                    <button 
                      onClick={() => setActiveView('services')}
                      className="text-brand-gold-400 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      <span>Explore Technical Standards</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. INTERACTIVE Dewatering Pumping Speed Simulation Dashboard (High Craftsmanship addition) */}
      <section className="py-24 bg-white text-neutral-900 overflow-hidden relative" id="dewatering-telemetry-simulator">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side dynamic telemetry controller */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="inline-flex items-center gap-1.5 bg-brand-gold-500/10 text-brand-gold-700 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border border-brand-gold-500/20">
                <Sliders className="w-3.5 h-3.5" />
                <span>Equipment Capability Interactive Simulator</span>
              </div>
              
              <h2 className="text-3xl sm:text-4.5xl font-black text-brand-blue-900 leading-none tracking-tight">
                Disaster Pumping Telemetry Calculator
              </h2>
              
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-sans font-light">
                Sri Velan & Co maintains South India's largest localized mobilization dewatering network. Dynamic relief setups operate at a maximum collective discharge flow of **80 Million Liters Per Day (MLD)**. Adjust the calculator slider to test our discharge clearing parameters:
              </p>

              {/* Slider Input */}
              <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200/80 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold">Flood Fluid Volume</span>
                  <span className="font-display font-extrabold text-brand-blue-900 text-lg font-mono">
                    {simVolume} Million Liters
                  </span>
                </div>

                <input 
                  type="range" 
                  min="5" 
                  max="120" 
                  value={simVolume} 
                  onChange={(e) => setSimVolume(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-brand-blue-700"
                />

                <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                  <span>5 ML (Minor Street)</span>
                  <span>120 ML (Severe Subway/Basin Grid)</span>
                </div>
              </div>
            </div>

            {/* Right side dynamic dashboard output display */}
            <div className="lg:col-span-7 bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-800 relative overflow-hidden" id="simulator-output-card">
              <div className="absolute inset-0 grid-overlay opacity-5 pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-brand-gold-400 animate-pulse" />
                  <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">PUMP DISPATCH EST-TELEMETRY</span>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-800">SIMULATIVE MATRIX V2.5</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Duration spec */}
                <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800/80 space-y-1 text-left">
                  <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">Calculated Clearance Time</span>
                  <p className="text-3xl font-display font-extrabold text-brand-gold-400 font-mono leading-none">
                    {calcClearanceDuration(simVolume)} Hours
                  </p>
                  <p className="text-xs text-neutral-400 mt-1 leading-tight">Continuous flow matching pressure outputs with direct PTO power plants</p>
                </div>

                {/* Pumps Required spec */}
                <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800/80 space-y-1 text-left">
                  <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">Recommended Diesel Pumps</span>
                  <p className="text-3xl font-display font-extrabold text-brand-gold-400 font-mono leading-none">
                    {calcPumpsNeeded(simVolume)} Units
                  </p>
                  <p className="text-xs text-neutral-400 mt-1 leading-tight">From our 6-Inch air-assist self-priming fleet</p>
                </div>

              </div>

              {/* Comparison details banner inside output */}
              <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800/80 mt-6 text-left space-y-3">
                <span className="text-[10px] text-brand-gold-400 font-mono uppercase tracking-widest block font-bold leading-none">Cyclone Response Deployment Layout</span>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans font-light">
                  During emergency storm peaks (Cyclone Fengal/Michaung), dewatering fleets are split into continuous **8-hour shift teams** utilizing multi-cylinder heavy diesel motors capable of handling up to **75mm compressible mud solids** with no downtime.
                </p>
                
                <div className="h-px bg-neutral-800 w-full" />
                
                <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                  <span className="text-[10px] text-neutral-400 font-mono">Tender Status: READY</span>
                  <button 
                    onClick={() => setActiveView('equipments')}
                    className="text-[10px] text-brand-gold-400 hover:text-white font-mono uppercase tracking-wider flex items-center gap-1 transition-colors"
                  >
                    <span>View Pump Spec Sheet</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 6. Corporate Action Call-to-Consultation Section (L&T Theme Ribbon) */}
      <section className="bg-neutral-900 py-20 text-white relative border-t border-neutral-800/80" id="home-cta-quote">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-br from-brand-blue-950 to-neutral-950 border border-brand-blue-800/35 p-10 sm:p-14 rounded-3xl relative overflow-hidden shadow-xl text-left">
            {/* Blueprint Overlay lines */}
            <div className="absolute inset-0 grid-overlay opacity-5 pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-mono font-bold tracking-widest text-brand-gold-400 uppercase">OFFICIAL INTAKE PROCESS</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none leading-none font-display text-shadow">
                  Ready to partner on municipal tenders?
                </h2>
                <p className="text-sm text-neutral-300 max-w-3xl leading-relaxed">
                  Connect with Mr. G. Selva Kumar’s regional estimating desk to gain verified ISO/class-status credentials, request specialized equipment hiring blocks, or organize rapid storm relief backups.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3.5 w-full">
                <button
                  onClick={() => setActiveView('contact')}
                  className="w-full bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-display font-bold py-3.5 px-6 rounded-lg shadow-lg active:scale-95 transition-all text-sm uppercase text-center tracking-wider"
                  id="btn-bot-contact"
                >
                  Request Commercial Proposal
                </button>
                
                <a
                  href={COMPANY_DETAILS.brochureLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800 text-white font-display font-semibold py-3.5 px-6 rounded-lg transition-colors text-sm"
                >
                  <span>Download Catalog PDF</span>
                  <ArrowUpRight className="w-4 h-4 text-brand-gold-400" />
                </a>
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
