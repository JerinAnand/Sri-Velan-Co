/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Settings, 
  TrendingUp, 
  Sparkle, 
  CheckCircle, 
  HelpCircle,
  Cpu,
  Sliders,
  Maximize2,
  Trash2,
  Send,
  Loader
} from 'lucide-react';
import { COMPANY_DETAILS } from '../data';

export const HydraulicBroomer: React.FC = () => {
  const [tractorHp, setTractorHp] = useState<string>('45-60');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [clientSpecs, setClientSpecs] = useState({
    name: '',
    phone: '',
    tractorModel: '',
    customNotes: ''
  });

  const broomSpecs = [
    { label: 'Overall Sweeping Width', value: '1,800 mm to 2,200 mm' },
    { label: 'Compatible Tractor HP', value: '35 HP to 75 HP (Dual PTO or single engine options)' },
    { label: 'Abrasive Bristle Combines', value: '70% High-Tensile Steel Wire + 30% Polyamide Resin Nylon' },
    { label: 'Bristle Lifespan Matrix', value: 'Up to 240 running hours before standard replacements' },
    { label: 'Operating Sweeping Speed', value: '4 km/h to 8 km/h optimal transit pacing' },
    { label: 'Sweeping Efficiency Grade', value: 'Greater than 96.4% mud-dust extraction single transit' },
    { label: 'Bucket Collector Volume', value: '0.4 cubic meters optional high-rear mounting hopper' },
    { label: 'Driving Control Levers', value: 'Dual-Spool Directional Control Valves fitted in cabin' }
  ];

  /* Dynamic hydraulic recommendation matrix from chosen tractor size */
  const getHydroRecommendation = (hp: string) => {
    switch (hp) {
      case '35-45':
        return {
          flowRate: '35 - 45 LPM optimal flow',
          bristleRpm: '110 RPM maximum brush rotation',
          coupling: 'Direct Spline PTO Coupling (Category 1 Hitch)',
          customNote: 'Recommended for light asphalt cleaning and parking lots. Operates seamlessly with lower hydraulic backpressure.'
        };
      case '45-60':
        return {
          flowRate: '45 - 60 LPM optimal flow',
          bristleRpm: '135 RPM high brush rotation',
          coupling: 'Primary Hydraulic Shaft system (Category 2 Hitch)',
          customNote: 'Our most popular, highly stable spec. Engineered for extensive national and state highway bituminous sweepings.'
        };
      case '60-75':
        default:
        return {
          flowRate: '60 - 80 LPM optimal flow',
          bristleRpm: '160 RPM maximum power speed',
          coupling: 'Independent Hydraulic Auxiliary Power Plant (Category 2 Hitch)',
          customNote: 'High-torque heavy cleanup version. Designed to sweep heavy clay, highway stone runoffs, and airport concrete grids.'
        };
    }
  };

  const currentRec = getHydroRecommendation(tractorHp);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientSpecs.name || !clientSpecs.phone) {
      alert('Please provide your name and contact phone.');
      return;
    }
    
    setFormLoading(true);
    setTimeout(() => {
      setFormLoading(false);
      setFormSubmitted(true);
    }, 1200);
  };

  return (
    <div className="w-full pt-20" id="hydraulic-broomer-spec-page">
      
      {/* Product Hero Banner */}
      <section className="relative overflow-hidden bg-brand-blue-950 py-16 sm:py-24 text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeQt_VRg-Pnvzi83b3kFBXkzvQwauzvPl3BR7b4V5oqXN65xsotHAR8F_J1Cr-ngjTmrsoOZwh5FdVT3Zl2TQdue2Wcd1_ulcn_09y7urzhBo0D1KmgZRjeebjb1XoS7MLrQY1rDu7vusZvj8gxX6MmMm7Y6ahsbChKhEPeKaWr--5Di4PTSUyriXPWgmsdZ1M_J-R4e7yADQG8TSSdoNbot-7Z_BtQhC13Rvz2AqlQI9L_fKhXuf8kddWYkMMsA3Gl_2Q358cGg"
            alt="Hydraulic Broomer close detail"
            className="w-full h-full object-cover opacity-15 filter saturate-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-r from-brand-blue-950 via-brand-blue-900/60 to-transparent" />
        </div>
        
        {/* Grid line patterns */}
        <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-brand-gold-500/15 border border-brand-gold-400/30 text-brand-gold-400 px-3.5 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold">
            <Sparkle className="w-3 h-3 animate-pulse" />
            <span>Proprietary Sweeping Innovation</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight" style={{ color: '#bea937' }}>
            Tractor-Mounted Hydraulic Broomer
          </h1>
          <p className="max-w-2xl text-sm sm:text-base text-neutral-300 leading-relaxed font-sans font-light">
            Engineered internally by {COMPANY_DETAILS.name} to deliver swift, dust-free sweeps on high-grade asphalt paving and urban arterial roads prior to final bitumen overlays.
          </p>
        </div>
      </section>

      {/* Product Feature Bento list */}
      <section className="py-20 bg-white" id="broom-features-bento">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono font-bold tracking-widest text-brand-blue-700 uppercase block">CORE COMPETENCIES</span>
            <h2 className="text-3xl font-black text-brand-blue-900 tracking-tight">Advanced Sweeping Mechanics</h2>
            <p className="text-xs sm:text-sm text-neutral-500">How our custom sweeping technology outperforms standard mechanical setups.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200/60 hover:border-brand-blue-700 hover:bg-white transition-all space-y-4">
              <div className="h-10 w-10 bg-brand-gold-500/10 text-brand-gold-600 rounded-lg flex items-center justify-center border border-brand-gold-500/20">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-brand-blue-950">Multi-Angle Adjustment</h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-sans font-light">
                Sweep angled up to 30 degrees to either side of the vehicle, allowing quick accumulation of road gravel towards outer safety gutters.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200/60 hover:border-brand-blue-700 hover:bg-white transition-all space-y-4">
              <div className="h-10 w-10 bg-brand-gold-500/10 text-brand-gold-600 rounded-lg flex items-center justify-center border border-brand-gold-500/20">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-brand-blue-950">Heavy Flow Regulators</h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-sans font-light">
                Dual hydraulic isolation valves protect the internal dynamic motor seals from high pressure spikes and sudden tractor PTO stops.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200/60 hover:border-brand-blue-700 hover:bg-white transition-all space-y-4">
              <div className="h-10 w-10 bg-brand-gold-500/10 text-brand-gold-600 rounded-lg flex items-center justify-center border border-brand-gold-500/20">
                <Maximize2 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-brand-blue-950">High-Wear Bristles</h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-sans font-light">
                Blending steel braids and industrial high-molecular nylon cords ensures consistent sweeping traction without structural brush breaks.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200/60 hover:border-brand-blue-700 hover:bg-white transition-all space-y-4">
              <div className="h-10 w-10 bg-brand-gold-500/10 text-brand-gold-600 rounded-lg flex items-center justify-center border border-brand-gold-500/20">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-brand-blue-950">Optional Debris Hopper</h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-sans font-light">
                Features an optional heavy steel debris-containment bucket bucket with hydraulic elevator levers for simple, direct cabin discharges.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* High-fidelity Technical table and HP advisor */}
      <section className="py-20 sm:py-28 bg-neutral-50 border-y border-neutral-200/60" id="broomer-specs-dashboard">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left spec table (7/12 width) */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="font-display font-bold text-lg sm:text-xl text-brand-blue-900 uppercase tracking-tight">
                Full Technical Specifications Sheet
              </h3>
              
              <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
                {broomSpecs.map((spec, idx) => (
                  <div 
                    key={spec.label}
                    className={`flex flex-col sm:flex-row justify-between p-4.5 gap-1.5 sm:gap-4 text-xs sm:text-sm font-sans ${
                      idx % 2 === 0 ? 'bg-neutral-50/40' : 'bg-white'
                    } ${
                      idx !== broomSpecs.length - 1 ? 'border-b border-neutral-100' : ''
                    }`}
                  >
                    <span className="font-semibold text-neutral-500 sm:max-w-[45%] text-left shrink-0">
                      {spec.label}
                    </span>
                    <span className="text-neutral-800 font-mono font-medium text-left sm:text-right">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Horsepower dynamic calculator (5/12 width) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6" id="broom-hydraulic-calculator">
              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-brand-blue-900">
                  Tractor Hydraulic Flow Advisor
                </h3>
                <p className="text-xs text-neutral-400">
                  Select your available tractor horsepower size to view recommended sweeping parameters:
                </p>
              </div>

              {/* Range Toggle Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '35-45', label: '35 to 45 HP' },
                  { id: '45-60', label: '45 to 60 HP' },
                  { id: '60-75', label: '60+ HP' }
                ].map((hpRange) => (
                  <button
                    key={hpRange.id}
                    onClick={() => setTractorHp(hpRange.id)}
                    className={`p-3 rounded-lg text-xs font-display font-semibold transition-all ${
                      tractorHp === hpRange.id 
                        ? 'bg-brand-blue-700 text-white shadow-xs' 
                        : 'bg-neutral-50 text-neutral-500 border border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    {hpRange.label}
                  </button>
                ))}
              </div>

              {/* Dynamic recommendation box */}
              <div className="bg-brand-blue-900/5 border border-brand-blue-800/10 p-5 rounded-xl space-y-4 text-sm font-sans">
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">Target Flow Rate</span>
                  <p className="text-brand-blue-900 font-bold font-mono">{currentRec.flowRate}</p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">Target Rotational RPM</span>
                  <p className="text-brand-blue-900 font-bold font-mono">{currentRec.bristleRpm}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">PTO Coupling System</span>
                  <p className="text-brand-blue-900 font-bold">{currentRec.coupling}</p>
                </div>

                <div className="h-px bg-neutral-200 w-full" />

                <p className="text-xs text-neutral-600 leading-relaxed italic pr-2">
                  *{currentRec.customNote}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Quotation Form for Broomer */}
      <section className="py-20 bg-white" id="broom-quotation-form-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-12 border border-neutral-800 relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 grid-overlay opacity-5 pointer-events-none" />

            <div className="max-w-2xl mx-auto space-y-8 relative z-10">
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
                  Request custom broom quotation
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans font-light">
                  Submit your technical tractor configurations and receiving address to obtain a full commercial quotation within 24 working hours.
                </p>
              </div>

              {formSubmitted ? (
                <div className="bg-emerald-950/40 border border-emerald-500/30 p-6 sm:p-8 rounded-2xl text-center space-y-3">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h3 className="font-display font-semibold text-lg text-white">Quotation Request Received</h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                    Thank you, <strong>{clientSpecs.name}</strong>. Mr. Selva Kumar's estimating office has logged your request for tractor model <strong>{clientSpecs.tractorModel || 'Standard'}</strong>. Our duty representative will connect at <strong>{clientSpecs.phone}</strong> shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    <div className="space-y-1 text-xs">
                      <label className="text-neutral-300 font-semibold font-display">Contractor / Client Name *</label>
                      <input 
                        type="text" 
                        required
                        value={clientSpecs.name}
                        onChange={(e) => setClientSpecs({...clientSpecs, name: e.target.value})}
                        className="w-full bg-neutral-800 border border-neutral-700 hover:border-neutral-600 focus:border-brand-gold-500 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-gold-500 transition-colors font-sans"
                        placeholder="e.g. Ram Infrastructure Ltd"
                      />
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="text-neutral-300 font-semibold font-display">Target Phone Contact *</label>
                      <input 
                        type="tel" 
                        required
                        value={clientSpecs.phone}
                        onChange={(e) => setClientSpecs({...clientSpecs, phone: e.target.value})}
                        className="w-full bg-neutral-800 border border-neutral-700 hover:border-neutral-600 focus:border-brand-gold-500 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-gold-500 transition-colors font-sans"
                        placeholder="e.g. +91 94430 XXXXX"
                      />
                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    <div className="space-y-1 text-xs">
                      <label className="text-neutral-300 font-semibold font-display">Available Tractor Model / HP</label>
                      <input 
                        type="text" 
                        value={clientSpecs.tractorModel}
                        onChange={(e) => setClientSpecs({...clientSpecs, tractorModel: e.target.value})}
                        className="w-full bg-neutral-800 border border-neutral-700 hover:border-neutral-600 focus:border-brand-gold-500 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-gold-500 transition-colors font-sans"
                        placeholder="e.g. Mahindra Arjun 555 / 50 HP"
                      />
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="text-neutral-300 font-semibold font-display">Sweeping Surface Width Choice</label>
                      <select 
                        className="w-full bg-neutral-800 border border-neutral-700 hover:border-neutral-600 focus:border-brand-gold-500 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-gold-500 transition-colors font-sans"
                        defaultValue="1.8m"
                      >
                        <option value="1.8m">1.8 Meter Standard Broomer</option>
                        <option value="2.0m">2.0 Meter Heavy Duty Broomer</option>
                        <option value="2.2m">2.2 Meter Widened Airport scale</option>
                      </select>
                    </div>

                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="text-neutral-300 font-semibold font-display">Custom Mounting / Hydraulic Specifications Notes</label>
                    <textarea 
                      rows={3}
                      value={clientSpecs.customNotes}
                      onChange={(e) => setClientSpecs({...clientSpecs, customNotes: e.target.value})}
                      className="w-full bg-neutral-800 border border-neutral-700 hover:border-neutral-600 focus:border-brand-gold-500 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-gold-500 transition-colors font-sans"
                      placeholder="e.g. Mention dual-LPM aux pump preference if any..."
                    />
                  </div>

                  <div className="pt-4 text-center">
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="inline-flex items-center gap-2 bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-display font-extrabold text-sm uppercase py-3.5 px-10 rounded-lg shadow-md active:scale-95 transition-all w-full sm:w-auto"
                      id="sweep-spec-submit"
                    >
                      {formLoading ? (
                        <Loader className="w-5 h-5 animate-spin mr-1" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>Submit Spec Form for Quote</span>
                    </button>
                  </div>

                </form>
              )}

            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
