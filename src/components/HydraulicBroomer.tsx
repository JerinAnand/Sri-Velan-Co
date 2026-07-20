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
import { useTranslation } from '../context/TranslationContext';

export const HydraulicBroomer: React.FC = () => {
  const { t, language } = useTranslation();
  const [tractorHp, setTractorHp] = useState<string>('45-60');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [clientSpecs, setClientSpecs] = useState({
    name: '',
    phone: '',
    tractorModel: '',
    customNotes: '',
    width: '1.8m'
  });

  const broomSpecs = [
    { label: t('hydraulicBroomer.specs.width.label'), value: t('hydraulicBroomer.specs.width.value') },
    { label: t('hydraulicBroomer.specs.hp.label'), value: t('hydraulicBroomer.specs.hp.value') },
    { label: t('hydraulicBroomer.specs.bristle.label'), value: t('hydraulicBroomer.specs.bristle.value') },
    { label: t('hydraulicBroomer.specs.lifespan.label'), value: t('hydraulicBroomer.specs.lifespan.value') },
    { label: t('hydraulicBroomer.specs.speed.label'), value: t('hydraulicBroomer.specs.speed.value') },
    { label: t('hydraulicBroomer.specs.grade.label'), value: t('hydraulicBroomer.specs.grade.value') },
    { label: t('hydraulicBroomer.specs.volume.label'), value: t('hydraulicBroomer.specs.volume.value') },
    { label: t('hydraulicBroomer.specs.levers.label'), value: t('hydraulicBroomer.specs.levers.value') }
  ];

  /* Dynamic hydraulic recommendation matrix from chosen tractor size */
  const getHydroRecommendation = (hp: string) => {
    switch (hp) {
      case '35-45':
        return {
          flowRate: t('hydraulicBroomer.advisorData.hp35.flowRate'),
          bristleRpm: t('hydraulicBroomer.advisorData.hp35.bristleRpm'),
          coupling: t('hydraulicBroomer.advisorData.hp35.coupling'),
          customNote: t('hydraulicBroomer.advisorData.hp35.customNote')
        };
      case '45-60':
        return {
          flowRate: t('hydraulicBroomer.advisorData.hp45.flowRate'),
          bristleRpm: t('hydraulicBroomer.advisorData.hp45.bristleRpm'),
          coupling: t('hydraulicBroomer.advisorData.hp45.coupling'),
          customNote: t('hydraulicBroomer.advisorData.hp45.customNote')
        };
      case '60-75':
      default:
        return {
          flowRate: t('hydraulicBroomer.advisorData.hp60.flowRate'),
          bristleRpm: t('hydraulicBroomer.advisorData.hp60.bristleRpm'),
          coupling: t('hydraulicBroomer.advisorData.hp60.coupling'),
          customNote: t('hydraulicBroomer.advisorData.hp60.customNote')
        };
    }
  };

  const currentRec = getHydroRecommendation(tractorHp);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientSpecs.name || !clientSpecs.phone) {
      const errMsg = language === 'en' 
        ? 'Please provide your name and contact phone.' 
        : 'தயவுசெய்து உங்கள் பெயர் மற்றும் தொடர்பு தொலைபேசி எண்ணை வழங்கவும்.';
      alert(errMsg);
      return;
    }
    
    // Construct WhatsApp message details
    const waText = `Hello Sri Velan & Co,

*New Custom Broom Quotation Request:*
*Name/Contractor:* ${clientSpecs.name}
*Phone:* ${clientSpecs.phone}
*Tractor Model/HP:* ${clientSpecs.tractorModel || 'N/A'}
*Sweeping Surface Width Choice:* ${clientSpecs.width || '1.8m'}
*Custom Notes:* ${clientSpecs.customNotes || 'N/A'}`;

    const encodedText = encodeURIComponent(waText);
    window.open(`https://wa.me/919894218243?text=${encodedText}`, '_blank');
    
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
            loading="lazy"
            width="1920"
            height="500"
          />
          <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-r from-brand-blue-950 via-brand-blue-900/60 to-transparent" />
        </div>
        
        {/* Grid line patterns */}
        <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 text-left">
          <div className="inline-flex items-center gap-1.5 bg-brand-gold-500/15 border border-brand-gold-400/30 text-brand-gold-400 px-3.5 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold text-left">
            <Sparkle className="w-3 h-3 animate-pulse" />
            <span>{t('hydraulicBroomer.badge')}</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-brand-gold-500 text-left">
            {t('hydraulicBroomer.title')}
          </h1>
          <p className="max-w-2xl text-sm sm:text-base text-neutral-300 leading-relaxed font-sans font-light text-left">
            {t('hydraulicBroomer.subtitle')}
          </p>
        </div>
      </section>

      {/* Product Feature Bento list */}
      <section className="py-20 bg-white" id="broom-features-bento">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16 text-left sm:text-center">
            <span className="text-xs font-mono font-bold tracking-widest text-brand-blue-700 uppercase block">
              {t('hydraulicBroomer.featuresHeader')}
            </span>
            <h2 className="text-3xl font-black text-brand-blue-900 tracking-tight">
              {t('hydraulicBroomer.featuresTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              {t('hydraulicBroomer.featuresSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200/60 hover:border-brand-blue-700 hover:bg-white transition-all space-y-4 text-left">
              <div className="h-10 w-10 bg-brand-gold-500/10 text-brand-gold-600 rounded-lg flex items-center justify-center border border-brand-gold-500/20">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-brand-blue-950">
                {t('hydraulicBroomer.f1.title')}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-sans font-light">
                {t('hydraulicBroomer.f1.desc')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200/60 hover:border-brand-blue-700 hover:bg-white transition-all space-y-4 text-left">
              <div className="h-10 w-10 bg-brand-gold-500/10 text-brand-gold-600 rounded-lg flex items-center justify-center border border-brand-gold-500/20">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-brand-blue-950">
                {t('hydraulicBroomer.f2.title')}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-sans font-light">
                {t('hydraulicBroomer.f2.desc')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200/60 hover:border-brand-blue-700 hover:bg-white transition-all space-y-4 text-left">
              <div className="h-10 w-10 bg-brand-gold-500/10 text-brand-gold-600 rounded-lg flex items-center justify-center border border-brand-gold-500/20">
                <Maximize2 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-brand-blue-950">
                {t('hydraulicBroomer.f3.title')}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-sans font-light">
                {t('hydraulicBroomer.f3.desc')}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200/60 hover:border-brand-blue-700 hover:bg-white transition-all space-y-4 text-left">
              <div className="h-10 w-10 bg-brand-gold-500/10 text-brand-gold-600 rounded-lg flex items-center justify-center border border-brand-gold-500/20">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-brand-blue-950">
                {t('hydraulicBroomer.f4.title')}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-sans font-light">
                {t('hydraulicBroomer.f4.desc')}
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
            <div className="lg:col-span-7 space-y-6 text-left">
              <h3 className="font-display font-bold text-lg sm:text-xl text-brand-blue-900 uppercase tracking-tight">
                {t('hydraulicBroomer.specsHeader')}
              </h3>
              
              <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs text-left">
                {broomSpecs.map((spec, idx) => (
                  <div 
                    key={idx}
                    className={`flex flex-col sm:flex-row justify-between p-4.5 gap-1.5 sm:gap-4 text-xs sm:text-sm font-sans text-left ${
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
            <div className="lg:col-span-5 bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6 text-left" id="broom-hydraulic-calculator">
              <div className="space-y-1 text-left">
                <h3 className="font-display font-bold text-lg text-brand-blue-900">
                  {t('hydraulicBroomer.advisorHeader')}
                </h3>
                <p className="text-xs text-neutral-400">
                  {t('hydraulicBroomer.advisorDesc')}
                </p>
              </div>

              {/* Range Toggle Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '35-45', label: t('hydraulicBroomer.advisorLabel35') },
                  { id: '45-60', label: t('hydraulicBroomer.advisorLabel45') },
                  { id: '60-75', label: t('hydraulicBroomer.advisorLabel60') }
                ].map((hpRange) => (
                  <button
                    key={hpRange.id}
                    onClick={() => setTractorHp(hpRange.id)}
                    aria-label={`Select tractor power category ${hpRange.label} to filter compatible broom parameters`}
                    title={`Select ${hpRange.label}`}
                    className={`p-3 rounded-lg text-xs font-display font-semibold transition-all cursor-pointer ${
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
              <div className="bg-brand-blue-900/5 border border-brand-blue-800/10 p-5 rounded-xl space-y-4 text-sm font-sans text-left">
                <div className="space-y-1 text-left">
                  <span className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase block">
                    {t('hydraulicBroomer.flowRate')}
                  </span>
                  <p className="text-brand-blue-900 font-bold font-mono">{currentRec.flowRate}</p>
                </div>
                
                <div className="space-y-1 text-left">
                  <span className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase block">
                    {t('hydraulicBroomer.bristleRpm')}
                  </span>
                  <p className="text-brand-blue-900 font-bold font-mono">{currentRec.bristleRpm}</p>
                </div>

                <div className="space-y-1 text-left">
                  <span className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase block">
                    {t('hydraulicBroomer.coupling')}
                  </span>
                  <p className="text-brand-blue-900 font-bold">{currentRec.coupling}</p>
                </div>

                <div className="h-px bg-neutral-200 w-full" />

                <p className="text-xs text-neutral-600 leading-relaxed italic pr-2 text-left">
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
          <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-12 border border-neutral-800 relative overflow-hidden shadow-xl text-left">
            <div className="absolute inset-0 grid-overlay opacity-5 pointer-events-none" />

            <div className="max-w-2xl mx-auto space-y-8 relative z-10 text-left">
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
                  {t('hydraulicBroomer.formHeader')}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans font-light">
                  {t('hydraulicBroomer.formDesc')}
                </p>
              </div>

              {formSubmitted ? (
                <div className="bg-emerald-950/40 border border-emerald-500/30 p-6 sm:p-8 rounded-2xl text-center space-y-3">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h3 className="font-display font-semibold text-lg text-white">
                    {t('hydraulicBroomer.successHeader')}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                    {t('hydraulicBroomer.successMsg1')}<strong>{clientSpecs.name}</strong>{t('hydraulicBroomer.successMsg2')}<strong>{clientSpecs.tractorModel || 'Standard'}</strong>{t('hydraulicBroomer.successMsg3')}<strong>{clientSpecs.phone}</strong>{t('hydraulicBroomer.successMsg4')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
                    
                    <div className="space-y-1 text-xs text-left">
                      <label className="text-neutral-300 font-semibold font-display text-left">
                        {t('hydraulicBroomer.formLabels.name')}
                      </label>
                      <input 
                        type="text" 
                        required
                        value={clientSpecs.name}
                        onChange={(e) => setClientSpecs({...clientSpecs, name: e.target.value})}
                        className="w-full bg-neutral-800 border border-neutral-700 hover:border-neutral-600 focus:border-brand-gold-500 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-gold-500 transition-colors font-sans text-left"
                        placeholder={t('hydraulicBroomer.formPlaceholders.name')}
                      />
                    </div>

                    <div className="space-y-1 text-xs text-left">
                      <label className="text-neutral-300 font-semibold font-display text-left">
                        {t('hydraulicBroomer.formLabels.phone')}
                      </label>
                      <input 
                        type="tel" 
                        required
                        value={clientSpecs.phone}
                        onChange={(e) => setClientSpecs({...clientSpecs, phone: e.target.value})}
                        className="w-full bg-neutral-800 border border-neutral-700 hover:border-neutral-600 focus:border-brand-gold-500 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-gold-500 transition-colors font-sans text-left"
                        placeholder={t('hydraulicBroomer.formPlaceholders.phone')}
                      />
                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
                    
                    <div className="space-y-1 text-xs text-left">
                      <label className="text-neutral-300 font-semibold font-display text-left">
                        {t('hydraulicBroomer.formLabels.tractor')}
                      </label>
                      <input 
                        type="text" 
                        value={clientSpecs.tractorModel}
                        onChange={(e) => setClientSpecs({...clientSpecs, tractorModel: e.target.value})}
                        className="w-full bg-neutral-800 border border-neutral-700 hover:border-neutral-600 focus:border-brand-gold-500 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-gold-500 transition-colors font-sans text-left"
                        placeholder={t('hydraulicBroomer.formPlaceholders.tractor')}
                      />
                    </div>

                    <div className="space-y-1 text-xs text-left">
                      <label className="text-neutral-300 font-semibold font-display text-left">
                        {t('hydraulicBroomer.formLabels.width')}
                      </label>
                      <select 
                        className="w-full bg-neutral-800 border border-neutral-700 hover:border-neutral-600 focus:border-brand-gold-500 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-gold-500 transition-colors font-sans cursor-pointer text-left"
                        value={clientSpecs.width}
                        onChange={(e) => setClientSpecs({...clientSpecs, width: e.target.value})}
                      >
                        <option value="1.8m">{t('hydraulicBroomer.widthOptions.w18')}</option>
                        <option value="2.0m">{t('hydraulicBroomer.widthOptions.w20')}</option>
                        <option value="2.2m">{t('hydraulicBroomer.widthOptions.w22')}</option>
                      </select>
                    </div>

                  </div>

                  <div className="space-y-1 text-xs text-left">
                    <label className="text-neutral-300 font-semibold font-display text-left">
                      {t('hydraulicBroomer.formLabels.notes')}
                    </label>
                    <textarea 
                      rows={3}
                      value={clientSpecs.customNotes}
                      onChange={(e) => setClientSpecs({...clientSpecs, customNotes: e.target.value})}
                      className="w-full bg-neutral-800 border border-neutral-700 hover:border-neutral-600 focus:border-brand-gold-500 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-gold-500 transition-colors font-sans text-left"
                      placeholder={t('hydraulicBroomer.formPlaceholders.notes')}
                    />
                  </div>

                  <div className="pt-4 text-center">
                    <button
                      type="submit"
                      disabled={formLoading}
                      aria-label="Submit client specs form for an official commercial broom quotation proposal from Sri Velan & Co"
                      title={t('hydraulicBroomer.submitButton')}
                      className="inline-flex items-center gap-2 bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-display font-extrabold text-sm uppercase py-3.5 px-10 rounded-lg shadow-md active:scale-95 transition-all w-full sm:w-auto cursor-pointer"
                      id="sweep-spec-submit"
                    >
                      {formLoading ? (
                        <Loader className="w-5 h-5 animate-spin mr-1" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>{t('hydraulicBroomer.submitButton')}</span>
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
