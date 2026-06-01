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
  ChevronRight
} from 'lucide-react';
import { COMPANY_DETAILS, OFFICES } from '../data';

export const AboutView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'credentials' | 'milestones'>('profile');

  // Strategic milestones structured from the incorporation history
  const corporateMilestones = [
    {
      year: '2004',
      title: 'Company Inception & Initial Works',
      desc: 'Formed in Villupuram by Mr. G. Selva Kumar, specializing in localized micro-conduit paving, stormwater drains, and rural brick masonry.',
      tag: 'FOUNDATION'
    },
    {
      year: '2012',
      title: 'Water Resource Board Accreditation',
      desc: 'Formally elevated to Water Resources Department (WRD) contractor, delivering major stonepitched canals, retaining barriers, and block works.',
      tag: 'EXPANSION'
    },
    {
      year: '2018',
      title: 'State Class I Contractor Licensing',
      desc: 'Attained high-status Class I licensing permitting unlimited tender bounds under Tamil Nadu Public Works and Irrigation departments.',
      tag: 'LEADERSHIP'
    },
    {
      year: '2024 - 2026',
      title: 'Dewatering Fleet Dominance',
      desc: 'Established South India’s premier localized mobilization dewatering arm, successfully countering Cyclone Fengal logging with high-volume diesel pumps.',
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
            ESTABLISHED 2004
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display text-white">
            {COMPANY_DETAILS.name} Corporate Profile
          </h1>
          <p className="max-w-3xl text-sm sm:text-base text-neutral-300 font-sans font-light leading-relaxed">
            Pistons of the civic engineering wheel in Tamil Nadu. Government Registered Class I Contractors driven by quality, operational readiness, and community public service.
          </p>
        </div>
      </section>

      {/* 2. Interactive Navigation Subbar */}
      <section className="bg-white border-b border-neutral-200 sticky top-[72px] sm:top-[76px] z-30 shadow-xs" id="about-subbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto no-scrollbar py-3">
            {[
              { id: 'profile', label: 'Corporate Overview' },
              { id: 'credentials', label: 'Compliance & Registration ID' },
              { id: 'milestones', label: 'Our Historical Journey' }
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
                  <span>Established in {COMPANY_DETAILS.yearEstablished}</span>
                </div>
                
                <h2 className="text-2xl sm:text-3.5xl font-black text-brand-blue-900 tracking-tight leading-tight">
                  Two Decades of Solid Structural Foundations & Community Operations
                </h2>

                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-sans first-letter:text-4xl first-letter:font-bold first-letter:text-brand-blue-800 first-letter:mr-1">
                  {COMPANY_DETAILS.incorporationHistory}
                </p>

                <p className="text-sm text-neutral-500 leading-relaxed font-sans">
                  By leveraging strong relationships with public entities and utilizing proprietary machinery assets, we deliver Class I building plans, complex flood channels, retaining structures, and asphalt corridors that withstand decades of structural loads.
                </p>

                {/* Grid checklist of values */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-neutral-100">
                  <div className="flex gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-brand-gold-500 shrink-0" />
                    <p className="text-xs sm:text-sm text-neutral-700 font-semibold font-display">PWD Accredited Performance</p>
                  </div>
                  <div className="flex gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-brand-gold-500 shrink-0" />
                    <p className="text-xs sm:text-sm text-neutral-700 font-semibold font-display">Tractor Sweeping proprietary fleet</p>
                  </div>
                  <div className="flex gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-brand-gold-500 shrink-0" />
                    <p className="text-xs sm:text-sm text-neutral-700 font-semibold font-display">ISO Quality Audited Standard</p>
                  </div>
                  <div className="flex gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-brand-gold-500 shrink-0" />
                    <p className="text-xs sm:text-sm text-neutral-700 font-semibold font-display">Emergency Storm Pump Fleet Ready</p>
                  </div>
                </div>
              </div>

              {/* Right Col: Design Grid for Highlight stats */}
              <div className="lg:col-span-5 bg-neutral-50 p-8 border border-neutral-200/80 rounded-3xl space-y-6">
                <h3 className="font-display font-black text-sm uppercase tracking-wider text-brand-blue-950 pb-3 border-b border-neutral-200">
                  Registrar Credentials
                </h3>

                <div className="space-y-4">
                  
                  {/* Class I Accreditation Card */}
                  <div className="bg-white p-5 border border-neutral-200 rounded-2xl flex items-start gap-4">
                    <div className="p-3 bg-brand-gold-500/10 rounded-xl text-brand-gold-600">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">Classification Status</p>
                      <h4 className="font-display font-bold text-base text-brand-blue-950">Registered Class I Contractors</h4>
                      <p className="text-xs text-neutral-500 mt-0.5 font-light">Accredited to pitch unrestricted water, land development, and administrative tenders state-wide.</p>
                    </div>
                  </div>

                  {/* Safety standard card */}
                  <div className="bg-white p-5 border border-neutral-200 rounded-2xl flex items-start gap-4">
                    <div className="p-3 bg-brand-blue-50 rounded-xl text-brand-blue-700">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">Quality Management</p>
                      <h4 className="font-display font-bold text-base text-brand-blue-950">ISO Certified Blueprints</h4>
                      <p className="text-xs text-neutral-500 mt-0.5 font-light">Our execution checklists follow ISO 9001:2015 specifications covering dual pavement and dewatering blocks.</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {activeTab === 'credentials' && (
            <div className="space-y-10 text-left">
              <div className="max-w-2xl">
                <h2 className="text-2xl sm:text-3xl font-black text-brand-blue-900 tracking-tight">Official Government Registry Credentials</h2>
                <p className="text-neutral-500 text-sm mt-1">Our physical registrations are audited under official ministries, assuring compliance with industrial and tax systems.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* GST Card */}
                <div className="bg-neutral-900 text-white rounded-2xl p-8 border border-neutral-800 relative overflow-hidden flex flex-col justify-between h-72">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/3 rounded-bl-full pointer-events-none" />
                  <div className="space-y-4">
                    <div className="inline-flex bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono text-[10px] uppercase px-2.5 py-0.5 rounded-full font-bold">GST registered</div>
                    <h3 className="font-display font-bold text-xl text-brand-gold-400">Goods & Service Tax Identification</h3>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans font-light">Officially certified GSTIN mapping active state and federal commercial tax structures.</p>
                  </div>
                  
                  <div className="pt-6 border-t border-neutral-800 flex justify-between items-end">
                    <div>
                      <span className="block text-[9px] font-mono text-neutral-450 uppercase tracking-wider">TAX REGISTER INDEX NUMBER</span>
                      <span className="font-mono text-sm sm:text-base font-bold text-white tracking-wider select-all">{COMPANY_DETAILS.gstin}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">● ACTIVE VERIFIED</span>
                  </div>
                </div>

                {/* MSME Card */}
                <div className="bg-brand-blue-950 text-white rounded-2xl p-8 border border-brand-blue-900 relative overflow-hidden flex flex-col justify-between h-72">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/3 rounded-bl-full pointer-events-none" />
                  <div className="space-y-4">
                    <div className="inline-flex bg-brand-gold-500/20 text-brand-gold-400 border border-brand-gold-400/30 font-mono text-[10px] uppercase px-2.5 py-0.5 rounded-full font-bold">MSME registered</div>
                    <h3 className="font-display font-bold text-xl text-brand-gold-400">Micro, Small and Medium Enterprises Registry</h3>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans font-light">Classified under the Ministry of MSME, Govt of India, enabling high institutional backing and tender leverage.</p>
                  </div>
                  
                  <div className="pt-6 border-t border-brand-blue-900/60 flex justify-between items-end">
                    <div>
                      <span className="block text-[9px] font-mono text-neutral-400 uppercase tracking-wider">UDYAM ID REGISTER</span>
                      <span className="font-mono text-sm sm:text-base font-bold text-white tracking-wider select-all">{COMPANY_DETAILS.msme}</span>
                    </div>
                    <span className="text-[10px] text-brand-gold-400 font-mono">UDYAM REGISTERED</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'milestones' && (
            <div className="space-y-12 text-left">
              <div className="max-w-xl">
                <span className="text-xs font-mono font-bold tracking-widest text-brand-blue-700 uppercase">OUR EVOLUTION</span>
                <h2 className="text-2xl sm:text-3.5xl font-black text-brand-blue-900 tracking-tight mt-1">22-Year Infrastructure Trajectory</h2>
                <p className="text-neutral-550 text-xs sm:text-sm font-sans font-light">Centralizing our progress from rural sub-pavement blocks to major regional civic contracts.</p>
              </div>

              {/* Milestones Vertical Stack */}
              <div className="relative border-l border-neutral-200 pl-6 sm:pl-8 ml-4 sm:ml-6 space-y-10 py-2">
                {corporateMilestones.map((ms) => (
                  <div key={ms.year} className="relative group">
                    {/* Node Dot indicator */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-4 w-4 rounded-full bg-brand-gold-500 border-4 border-white shadow-md group-hover:bg-brand-blue-800 transition-colors" />
                    
                    <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-250/70 hover:border-brand-blue-700/30 hover:bg-white hover:shadow-lg transition-all max-w-3xl">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <span className="font-mono text-xl sm:text-2xl font-black text-brand-blue-900 tracking-tight">{ms.year}</span>
                        <span className="text-[9px] font-mono tracking-widest bg-brand-blue-900/5 text-brand-blue-850 px-2 py-0.5 rounded border border-brand-blue-800/10 uppercase font-semibold">{ms.tag}</span>
                      </div>
                      
                      <h4 className="font-display font-bold text-sm sm:text-base text-neutral-900 mb-1">{ms.title}</h4>
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans font-light">{ms.desc}</p>
                    </div>
                  </div>
                ))}
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
                <h3 className="font-display font-black text-xl text-white tracking-tight uppercase">Our Strategic Vision</h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans font-light">
                  To remain the premier, most reliable civil engineering provider in South India by continuously expanding our rapid mobilization pumping fleets, implementing progressive environmental standards, and delivering resilient municipal systems that stand the test of seasonal storm shifts and heavy water movements.
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
                <h3 className="font-display font-black text-xl text-white tracking-tight uppercase">Our Core Mission</h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans font-light">
                  To serve community utilities with absolute operational integrity. We achieve this by procuring high-grade engineered concrete mix matrices, maintaining fully functional hydraulic and suction pumps on constant status alert, and deploying seasoned technical crews capable of sealing broken embankments and draining waterlogged populations safely in minimum time frames.
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
            <span className="text-xs font-mono font-bold tracking-widest text-brand-blue-700 uppercase block">ADMINISTRATION</span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-blue-900 tracking-tight font-display">Governing Board</h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-sans">Represented by a legacy of dedicated civil contractors leading water and land development networks in Tamil Nadu.</p>
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
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent md:hidden" />
            </div>

            {/* Right Col: Leadership bio copy panel */}
            <div className="md:col-span-7 p-8 sm:p-14 flex flex-col justify-center space-y-6 relative z-10 bg-brand-blue-950 border-t md:border-t-0 md:border-l border-brand-blue-900/60">
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1.5 bg-brand-gold-500/10 text-brand-gold-400 border border-brand-gold-400/20 rounded-full py-1 px-3 text-xs leading-none font-mono">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Governing Partner</span>
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
                "{COMPANY_DETAILS.leadership.governingPartner.bio}"
              </p>

              <div className="pt-2 flex items-center gap-3">
                <span className="text-[10px] text-neutral-400 uppercase font-mono">Sign of Authority</span>
                <span className="text-brand-gold-500 font-serif italic text-base block sm:text-lg tracking-wide">G. Selva Kumar</span>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
