/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Settings, 
  Wrench, 
  Disc, 
  Grid,
  ChevronRight,
  Sparkle
} from 'lucide-react';
import { EQUIPMENTS } from '../data';
import { EquipmentItem } from '../types';

export const EquipmentsView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'tractor-mounted' | 'earth-moving'>('all');
  const [selectedEquip, setSelectedEquip] = useState<EquipmentItem | null>(EQUIPMENTS[0]);

  const filteredEquip = activeCategory === 'all' 
    ? EQUIPMENTS 
    : EQUIPMENTS.filter(e => e.category === activeCategory);

  const getCategoryTitle = (cat: string) => {
    return cat === 'tractor-mounted' ? 'Hydraulic Broomer & Sweeping' : 'Dewatering & Site Earthworks';
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BroomIcon':
        return <Disc className="w-5 h-5 animate-spin-slow text-brand-gold-500" />;
      case 'PumpIcon':
        return <Settings className="w-5 h-5 text-brand-gold-500" />;
      case 'ExcavatorIcon':
        return <Wrench className="w-5 h-5 text-brand-gold-500" />;
      default:
        return <Briefcase className="w-5 h-5 text-brand-gold-500" />;
    }
  };

  return (
    <div className="w-full pt-20" id="equipment-page-container">
      
      {/* Page Title banner */}
      <section className="relative overflow-hidden bg-brand-blue-950 py-16 sm:py-24 text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtohN8PJyeMCx0BLGKVd3-dsKJim2cGuE-Saypazx1nIhMBRaoA-RbOMWAcA_G1cd9hwEW5ljaBwe577WFfou6OKCeoAqh9Egp8OMNJG7uOTOA0sQH508LeJ21PbnEuRF9spP5qZNziwB2DEcyYv8GpMYNSpu-hDMMLxXjfBdmWOSY-xhH9oRgj4erjunOAqnai0ti5jmLDR3ntmUUu2t-HT5oj1cgsBdGAgarh6RFA5IjqTIRLLPIj4vjhF6kL-V34Uvi3SrYluZ1"
            alt="Heavy equipment blueprint machinery scaffolding"
            className="w-full h-full object-cover opacity-15 filter grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-y-0 right-0 left-0 bg-gradient-to-t from-brand-blue-950 via-brand-blue-900/60 to-transparent" />
        </div>
        
        {/* Grid lines overlay */}
        <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <span className="text-xs font-mono font-semibold tracking-widest text-brand-gold-400 uppercase">
            HEAVY MACHINERY FLEET
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Advanced Operational Machineries & Fleet
          </h1>
          <p className="max-w-3xl text-sm sm:text-base text-neutral-300 leading-relaxed font-sans font-light">
            We operate fully customized hydraulic units and non-clog self-priming vacuum assist diesel pumps to handle both routine paving and severe emergency storm dewatering.
          </p>
        </div>
      </section>

      {/* Main equipment showcase core */}
      <section className="py-20 bg-white" id="equipment-interactive-deck">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Filter Buttons bar */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14" id="equipment-filter-bar">
            {[
              { id: 'all', label: 'All Assets & Fleet' },
              { id: 'tractor-mounted', label: 'Tractor Mounted Heavy Broomers' },
              { id: 'earth-moving', label: 'Earthmovers & Heavy Pumping Systems' }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  setActiveCategory(btn.id as any);
                  const items = EQUIPMENTS.filter(e => btn.id === 'all' || e.category === btn.id);
                  setSelectedEquip(items[0] || null);
                }}
                className={`px-5 py-3 rounded-lg font-display text-sm font-semibold transition-all shadow-xs ${
                  activeCategory === btn.id 
                    ? 'bg-brand-blue-700 text-white border-brand-blue-800' 
                    : 'bg-neutral-50 text-neutral-600 border border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Equipment list card deck (5/12 width) */}
            <div className="lg:col-span-5 space-y-4" id="equipment-sidebar-list">
              <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest pl-3">Operational Fleet Index</p>
              
              {filteredEquip.map((item) => {
                const isSelected = selectedEquip?.id === item.id;
                return (
                  <div
                    key={item.id}
                    id={`equip-card-${item.id}`}
                    onClick={() => setSelectedEquip(item)}
                    className={`p-6 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-brand-blue-50/40 border-brand-blue-700 shadow-sm ring-1 ring-brand-blue-600/10' 
                        : 'bg-white border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${
                          isSelected ? 'bg-brand-blue-700 text-white' : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {getIcon(item.iconName)}
                        </div>
                        <div>
                          <h3 className="font-display font-semibold text-sm sm:text-base text-brand-blue-950">
                            {item.name}
                          </h3>
                          <span className="text-[10px] font-mono tracking-wider text-brand-blue-600 uppercase">
                            {getCategoryTitle(item.category)}
                          </span>
                        </div>
                      </div>
                      
                      <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-brand-blue-700 translate-x-1' : 'text-neutral-400'}`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Detailed Parameter sheet viewer (7/12 width) */}
            <div className="lg:col-span-7 bg-neutral-50 rounded-3xl border border-neutral-200/80 p-6 sm:p-10 shadow-xs relative overflow-hidden" id="equipment-detail-sheet">
              <div className="absolute inset-0 grid-overlay opacity-5 pointer-events-none" />

              <AnimatePresence mode="wait">
                {selectedEquip ? (
                  <motion.div
                    key={selectedEquip.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6 relative z-10"
                  >
                    {/* Header values */}
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 bg-brand-gold-500/15 border border-brand-gold-500/20 text-brand-gold-700 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wide">
                        <Sparkle className="w-3 h-3 text-brand-gold-600" />
                        <span>Fitted Spec Verified</span>
                      </div>
                      
                      <h2 className="text-2xl sm:text-3xl font-black font-display text-brand-blue-900 leading-tight">
                        {selectedEquip.name}
                      </h2>
                      <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-sans">
                        {selectedEquip.description}
                      </p>
                    </div>

                    <div className="h-px bg-neutral-200 w-full" />

                    {/* Table of Technical Parameters specs */}
                    <div className="space-y-3.5">
                      <h4 className="font-display font-bold text-xs uppercase tracking-wider text-brand-gold-700">
                        Technical Parameters Sheet
                      </h4>

                      <div className="bg-white rounded-2xl border border-neutral-200/70 overflow-hidden shadow-xs">
                        {Object.entries(selectedEquip.specs).map(([label, val], index) => (
                          <div 
                            key={label}
                            className={`flex flex-col sm:flex-row justify-between p-4 gap-1 sm:gap-4 text-xs font-sans ${
                              index % 2 === 0 ? 'bg-neutral-50/50' : 'bg-white'
                            } ${
                              index !== Object.entries(selectedEquip.specs).length - 1 ? 'border-b border-neutral-100' : ''
                            }`}
                          >
                            <span className="font-semibold text-neutral-500 tracking-tight sm:max-w-[40%] text-left shrink-0">
                              {label}
                            </span>
                            <span className="text-neutral-800 font-mono text-left sm:text-right font-medium">
                              {val}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </motion.div>
                ) : (
                  <div className="h-full flex items-center justify-center p-12 text-center text-neutral-400 text-sm">
                    Select a machine from the left index to inspect configurations
                  </div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* Emergency dispatch banner */}
      <section className="bg-brand-blue-900 text-white py-14" id="equip-dispatch-callout">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <p className="text-brand-gold-400 font-mono text-xs uppercase tracking-widest font-bold">24/7 Operations Duty</p>
          <h2 className="text-xl sm:text-2xl font-black font-display">Need Immediate Water Dewatering Pumps Dispatch?</h2>
          <p className="text-xs sm:text-sm text-neutral-300">Our diesel pump configurations and drivers are registered with emergency PWD panels and fully operational in any extreme cyclone environment.</p>
          <div className="pt-2">
            <a href="tel:+919894218243" className="inline-block bg-brand-gold-500 text-brand-blue-950 font-display font-extrabold text-sm py-3 px-6 rounded-lg uppercase tracking-wider hover:bg-brand-gold-400 shadow-lg active:scale-95 transition-all">
              Call Fleet Commander
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
