/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Settings, 
  Wrench, 
  Disc, 
  Grid,
  ChevronRight,
  Sparkle,
  ArrowRightLeft,
  RotateCcw,
  Info
} from 'lucide-react';
import { EQUIPMENTS } from '../data';
import { EquipmentItem } from '../types';

const METRIC_HELP_TEXTS: Record<string, string> = {
  'Maximum Discharge Capacity': 'The volume of liquid or dynamic fluid handled by the pump per hour/minute, indicating speed of dewatering under standard load.',
  'Priming Speed': 'The duration required for the dry vacuum assist mechanism to automatically expel line air and draw rising liquid to full flow from a dry start.',
  'Solid Handling Diameter': 'The maximum spherical or compressible solid diameter size that can pass cleanly through the impeller casing without clogging.',
  'Prime Mover Engine': 'The rated power (HP), cooling source, and cylinder architecture driving the pump dynamic shaft rotation.',
  'Fuel Autonomy': 'Estimated continuous operational runtime offered by a single fuel reservoir fill under rated peak power demands.',
  'Total Dynamic Head (TDH)': 'The aggregate equivalent height including actual elevation rise, system friction loss, and terminal velocity required.'
};

export const EquipmentsView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'tractor-mounted' | 'earth-moving'>('all');
  const [selectedEquip, setSelectedEquip] = useState<EquipmentItem | null>(EQUIPMENTS[0]);

  // Loading States for smoother transition animations
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isSelectingLoading, setIsSelectingLoading] = useState<boolean>(false);
  const [isComparingLoading, setIsComparingLoading] = useState<boolean>(false);

  // Initialize data-fetching simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 850);
    return () => clearTimeout(timer);
  }, []);

  // Dewatering pump selection state for side-by-side comparison
  const pumpModels = EQUIPMENTS.filter(
    e => e.id.toLowerCase().includes('pump') || e.name.toLowerCase().includes('pump')
  );
  const [pumpAId, setPumpAId] = useState<string>('eq-pump-6');
  const [pumpBId, setPumpBId] = useState<string>('eq-pump-10');

  const pumpA = EQUIPMENTS.find(e => e.id === pumpAId);
  const pumpB = EQUIPMENTS.find(e => e.id === pumpBId);

  const combinedSpecKeys = Array.from(new Set([
    ...Object.keys(pumpA?.specs || {}),
    ...Object.keys(pumpB?.specs || {})
  ]));

  const handleClearSelection = () => {
    setIsComparingLoading(true);
    setPumpAId('');
    setPumpBId('');
    setTimeout(() => {
      setIsComparingLoading(false);
    }, 400);
  };

  const handlePumpASelection = (val: string) => {
    setPumpAId(val);
    setIsComparingLoading(true);
    setTimeout(() => {
      setIsComparingLoading(false);
    }, 450);
  };

  const handlePumpBSelection = (val: string) => {
    setPumpBId(val);
    setIsComparingLoading(true);
    setTimeout(() => {
      setIsComparingLoading(false);
    }, 450);
  };

  const handleCategorySelection = (cat: 'all' | 'tractor-mounted' | 'earth-moving') => {
    if (activeCategory === cat) return;
    setActiveCategory(cat);
    setIsInitialLoading(true);
    const items = EQUIPMENTS.filter(e => cat === 'all' || e.category === cat);
    setTimeout(() => {
      setSelectedEquip(items[0] || null);
      setIsInitialLoading(false);
    }, 750);
  };

  const handleEquipSelection = (item: EquipmentItem) => {
    if (selectedEquip?.id === item.id) return;
    setIsSelectingLoading(true);
    setTimeout(() => {
      setSelectedEquip(item);
      setIsSelectingLoading(false);
    }, 400);
  };

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
            loading="lazy"
            width="1920"
            height="500"
          />
          <div className="absolute inset-y-0 right-0 left-0 bg-gradient-to-t from-brand-blue-950 via-brand-blue-900/60 to-transparent" />
        </div>
        
        {/* Grid lines overlay */}
        <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <span className="text-xs font-mono font-semibold tracking-widest text-brand-gold-400 uppercase">
            HEAVY MACHINERY FLEET
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight" style={{ color: '#bea937' }}>
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
                onClick={() => handleCategorySelection(btn.id as any)}
                className={`px-5 py-3 rounded-lg font-display text-sm font-semibold transition-all shadow-xs cursor-pointer ${
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
              
              {isInitialLoading ? (
                // Pulse loading list skeletons
                Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="p-6 rounded-2xl border border-neutral-100 bg-white space-y-3 animate-pulse">
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-10 h-10 bg-neutral-200 rounded-lg shrink-0" />
                        <div className="space-y-2 w-full">
                          <div className="h-4 bg-neutral-200 rounded-md w-3/4" />
                          <div className="h-3 bg-neutral-100 rounded-md w-1/2" />
                        </div>
                      </div>
                      <div className="w-4 h-4 bg-neutral-200 rounded-full" />
                    </div>
                  </div>
                ))
              ) : (
                filteredEquip.map((item) => {
                  const isSelected = selectedEquip?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      id={`equip-card-${item.id}`}
                      onClick={() => handleEquipSelection(item)}
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
                })
              )}
            </div>

            {/* Right Column: Detailed Parameter sheet viewer (7/12 width) */}
            <div className="lg:col-span-7 bg-neutral-50 rounded-3xl border border-neutral-200/80 p-6 sm:p-10 shadow-xs relative overflow-hidden" id="equipment-detail-sheet">
              <div className="absolute inset-0 grid-overlay opacity-5 pointer-events-none" />

              <AnimatePresence mode="wait">
                {isInitialLoading || isSelectingLoading ? (
                  <motion.div
                    key="detail-skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6 relative z-10 animate-pulse"
                  >
                    {/* Header values Skeleton */}
                    <div className="space-y-3">
                      <div className="w-32 h-6 bg-neutral-200 rounded-full" />
                      <div className="h-8 bg-neutral-200 rounded-lg w-2/3" />
                      <div className="space-y-2">
                        <div className="h-4 bg-neutral-200 rounded-md w-full" />
                        <div className="h-4 bg-neutral-200 rounded-md w-11/12" />
                      </div>
                    </div>

                    <div className="h-px bg-neutral-200 w-full" />

                    {/* Specifications Skeleton */}
                    <div className="space-y-4">
                      <div className="w-48 h-5 bg-neutral-200 rounded-md" />
                      <div className="bg-white rounded-2xl border border-neutral-200/70 p-2 space-y-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="flex justify-between items-center p-4 border-b border-white last:border-b-0">
                            <div className="h-4 bg-neutral-200 rounded-md w-1/3" />
                            <div className="h-4 bg-neutral-200 rounded-md w-1/2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : selectedEquip ? (
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

      {/* Side-by-Side Dewatering Pump Comparison Matrix Section */}
      <section className="py-20 bg-neutral-50 border-t border-b border-neutral-100" id="pump-comparison-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue-50 text-brand-blue-800 border border-brand-blue-200/50 rounded-full text-xs font-mono font-semibold uppercase">
              <ArrowRightLeft className="w-3.5 h-3.5 text-brand-blue-700 animate-pulse" />
              <span>Dewatering Specs Analyzer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-brand-blue-950 tracking-tight">
              Pump Model Comparison Matrix
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base font-sans font-light">
              Select any two operational dewatering pump models below to analyze discharge rates, priming times, solid handling thresholds, engines, and lift capacity side-by-side.
            </p>
          </div>

          {/* Clear Selection / Reset Action Button - Visible when either selector has a value */}
          {(pumpAId || pumpBId) && (
            <div className="flex justify-end mb-6 animate-fade-in">
              <button
                onClick={handleClearSelection}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-neutral-100 text-neutral-600 hover:text-brand-blue-900 border border-neutral-300 hover:border-brand-blue-300 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs hover:shadow-xs active:scale-95"
                id="clear-pump-comparison-btn"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Selection</span>
              </button>
            </div>
          )}

          {/* Selectors cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-10">
            
            {/* Pump A Dropdown Selection */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4 text-left">
              <label htmlFor="pump-select-a" className="block text-xs font-mono font-bold text-brand-gold-600 uppercase tracking-widest">
                Pump Model A
              </label>
              <div className="relative">
                <select
                  id="pump-select-a"
                  value={pumpAId}
                  onChange={(e) => handlePumpASelection(e.target.value)}
                  className="w-full bg-neutral-50/50 border border-neutral-300 rounded-xl px-4 py-3.5 pr-10 text-sm sm:text-base font-display font-semibold text-brand-blue-950 focus:ring-2 focus:ring-brand-blue-500 focus:border-brand-blue-500 outline-hidden transition-all appearance-none cursor-pointer"
                >
                  <option value="">-- Choose Pump Model A --</option>
                  {pumpModels.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-neutral-500">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed font-sans min-h-[40px]">
                {pumpA ? pumpA.description : 'Select pump A from the dropdown above to load its operational history and capacity characteristics.'}
              </p>
            </div>

            {/* Pump B Dropdown Selection */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4 text-left">
              <label htmlFor="pump-select-b" className="block text-xs font-mono font-bold text-brand-gold-600 uppercase tracking-widest">
                Pump Model B
              </label>
              <div className="relative">
                <select
                  id="pump-select-b"
                  value={pumpBId}
                  onChange={(e) => handlePumpBSelection(e.target.value)}
                  className="w-full bg-neutral-50/50 border border-neutral-300 rounded-xl px-4 py-3.5 pr-10 text-sm sm:text-base font-display font-semibold text-brand-blue-950 focus:ring-2 focus:ring-brand-blue-500 focus:border-brand-blue-500 outline-hidden transition-all appearance-none cursor-pointer"
                >
                  <option value="">-- Choose Pump Model B --</option>
                  {pumpModels.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-neutral-500">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed font-sans min-h-[40px]">
                {pumpB ? pumpB.description : 'Select pump B from the dropdown above to load its operational history and capacity characteristics.'}
              </p>
            </div>

          </div>

          {/* Side-by-side spec comparison table */}
          {pumpA || pumpB ? (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden" id="pump-compare-table-container">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm min-w-[700px]">
                  <thead>
                    <tr className="bg-brand-blue-950 text-white font-display border-b border-brand-blue-900">
                      <th className="px-6 py-5 font-bold tracking-wider text-xs uppercase" style={{ width: '30%' }}>Technical Specification</th>
                      <th className="px-6 py-5 font-bold tracking-wider text-xs uppercase bg-brand-blue-900/40" style={{ width: '35%' }}>
                        {pumpA ? pumpA.name : 'Choose Pump Model A'}
                      </th>
                      <th className="px-6 py-5 font-bold tracking-wider text-xs uppercase bg-brand-blue-900/60" style={{ width: '35%' }}>
                        {pumpB ? pumpB.name : 'Choose Pump Model B'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-sans">
                    {isComparingLoading ? (
                      Array.from({ length: 6 }).map((_, idx) => (
                        <tr key={idx} className="animate-pulse bg-white">
                          <td className="px-6 py-5 font-semibold text-neutral-400 border-r border-neutral-100/60" style={{ width: '30%' }}>
                            <div className="h-4 bg-neutral-200 rounded-md w-2/3" />
                          </td>
                          <td className="px-6 py-5" style={{ width: '35%' }}>
                            <div className="h-4 bg-neutral-100 rounded-md w-3/4 animate-pulse" />
                          </td>
                          <td className="px-6 py-5" style={{ width: '35%' }}>
                            <div className="h-4 bg-neutral-100 rounded-md w-3/4 animate-pulse" />
                          </td>
                        </tr>
                      ))
                    ) : (
                      combinedSpecKeys.map((key, idx) => {
                        const valA = pumpA?.specs[key] || '—';
                        const valB = pumpB?.specs[key] || '—';

                        return (
                          <tr 
                            key={key} 
                            className={`hover:bg-neutral-50/50 transition-colors ${
                              idx % 2 === 0 ? 'bg-neutral-50/20' : 'bg-white'
                            }`}
                          >
                            <td className="px-6 py-4 font-semibold text-neutral-600 border-r border-neutral-100/60 relative group/tooltip">
                              <div className="flex items-center justify-between gap-1.5">
                                <span>{key}</span>
                                {METRIC_HELP_TEXTS[key] && (
                                  <Info className="w-3.5 h-3.5 text-neutral-400 hover:text-brand-blue-700 lg:group-hover/tooltip:text-brand-blue-700 transition-colors cursor-help shrink-0" />
                                )}
                              </div>
                              {METRIC_HELP_TEXTS[key] && (
                                <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 w-64 p-3 bg-neutral-900 border border-neutral-800 text-white text-xs font-normal rounded-xl shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-50 pointer-events-none leading-relaxed font-sans normal-case tracking-normal text-left">
                                  <div className="font-bold mb-1 text-brand-gold-400 text-[10px] uppercase font-mono tracking-widest">Metric Definition</div>
                                  {METRIC_HELP_TEXTS[key]}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900"></div>
                                </div>
                              )}
                            </td>
                            <td className={`px-6 py-4 font-medium text-neutral-800 ${!pumpA ? 'text-neutral-400 italic' : ''}`}>
                              {pumpA ? valA : <span className="text-neutral-400/80 italic text-xs">No Model Selected</span>}
                            </td>
                            <td className={`px-6 py-4 font-medium text-neutral-800 ${!pumpB ? 'text-neutral-400 italic' : ''}`}>
                              {pumpB ? valB : <span className="text-neutral-400/80 italic text-xs">No Model Selected</span>}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Swipe / print hint */}
              <div className="bg-neutral-50 px-6 py-3.5 border-t border-neutral-100 text-center text-[10px] text-neutral-400 font-mono tracking-widest uppercase">
                <span>* Swipe horizontally to scroll parameters table on smaller screens *</span>
              </div>
            </div>
          ) : (
            <div className="bg-white p-16 text-center rounded-2xl border border-neutral-200 text-neutral-500 text-sm flex flex-col items-center justify-center space-y-4" id="pump-compare-empty-state">
              <div className="p-4 bg-neutral-100 rounded-full">
                <ArrowRightLeft className="w-8 h-8 text-neutral-400" />
              </div>
              <div className="space-y-1">
                <p className="font-extrabold text-neutral-800 font-display text-base">No Pumps Selected for Side-by-Side Comparison</p>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  Please select at least one dewatering pump model from the dropdown lists above to display and compare technical specifications side-by-side.
                </p>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Emergency dispatch banner */}
      <section className="bg-brand-blue-900 text-white py-14" id="equip-dispatch-callout">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <p className="text-brand-gold-400 font-mono text-xs uppercase tracking-widest font-bold">24/7 Operations Duty</p>
          <h2 className="text-xl sm:text-2xl font-black font-display" style={{ color: '#bda72d' }}>Need Immediate Water Dewatering Pumps Dispatch?</h2>
          <p className="text-xs sm:text-sm text-neutral-300">Our diesel pump configurations and drivers are registered with emergency PWD panels and fully operational in any extreme cyclone environment.</p>
          <div className="pt-2">
            <a 
              href="tel:+919894218243" 
              aria-label="Call emergency dewatering fleet commander at +919894218243 for rapid pump dispatch mobilization"
              title="Call Dewatering Fleet Commander"
              className="inline-block bg-brand-gold-500 text-brand-blue-950 font-display font-extrabold text-sm py-3 px-6 rounded-lg uppercase tracking-wider hover:bg-brand-gold-400 shadow-lg active:scale-95 transition-all"
            >
              Call Fleet Commander
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
