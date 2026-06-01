/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle, 
  Send,
  Loader,
  ExternalLink,
  MessageSquare,
  Award,
  BookOpen
} from 'lucide-react';
import { COMPANY_DETAILS, OFFICES } from '../data';

export const ContactView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [msgDetails, setMsgDetails] = useState({
    name: '',
    phone: '',
    email: '',
    serviceInterest: 'general',
    message: ''
  });

  const sendWhatsApp = () => {
    const defaultText = `Hello Sri Velan & Co, I would like to discuss a civil contract/dewatering project.`;
    const encodedText = encodeURIComponent(defaultText);
    window.open(`https://wa.me/919894218243?text=${encodedText}`, '_blank');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!msgDetails.name || !msgDetails.phone) {
      setErrorMsg('Please specify both your Name and Contact Phone Number to login.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setComplete(true);
    }, 1400);
  };

  return (
    <div className="w-full pt-20" id="contact-us-view">
      
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden bg-brand-blue-950 py-16 sm:py-24 text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwB6bgyI-JHoy5GqWhlXoso_qOWtqq39tB4WWdWKvM4yj5XzBYnXMGyT75TNscikaowcYCg-yzLPnLLseeT6Chm1YXuwug1nTGnQ0TSLSTsj_ouDfMU_rauFj2-uP4WatBsBm0zydg8Pj9EaRIKy3wvv06iUmDQSvrrEBZ0zIG_o7-TngT29qUysnuYvqq8NVSLVo6ifoO7pFru94OTSYC9yvh3FlFA9gNm3jyB9h52jDLKunp05jGlgVonLbt_7O3t8wRESbE9Q"
            alt="Contact blueprint structural coordinates"
            className="w-full h-full object-cover opacity-15 filter grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-y-0 right-0 left-0 bg-gradient-to-t from-brand-blue-950 via-brand-blue-900/60 to-transparent" />
        </div>
        
        {/* Grid patterns */}
        <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <span className="text-xs font-mono font-semibold tracking-widest text-brand-gold-400 uppercase">
            CONNECT WITH US
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Our Regional Offices & Intakes
          </h1>
          <p className="max-w-3xl text-sm sm:text-base text-neutral-300 leading-relaxed font-sans font-light">
            Contact Mr. Selva Kumar’s operational office today regarding infrastructure tenders, high-flow pump hiring, hydraulic brooming contracts, or emergency cyclone rescue assistance.
          </p>
        </div>
      </section>

      {/* 2. Primary Layout: Channels and Submission cards */}
      <section className="py-20 bg-white" id="contact-channels-panels">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Direct Call, WhastApp nodes (5/12 width) */}
            <div className="lg:col-span-5 space-y-8" id="contact-quick-touch">
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold tracking-widest text-brand-blue-700 uppercase">DIRECT DISPATCH</span>
                <h2 className="text-2xl sm:text-3xl font-black text-brand-blue-900 tracking-tight leading-none">Reach Out to our Executives</h2>
                <p className="text-neutral-500 text-sm leading-relaxed font-sans font-light">
                  Our team maintains redundant communications to monitor high-volume flood relief networks and municipal developments across Tamil Nadu boundaries.
                </p>
              </div>

              {/* Instant Call CTA Cards */}
              <div className="grid grid-cols-1 gap-4" id="contact-tel-whatsapp">
                
                {/* Click-To-Call */}
                <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200/80 hover:border-brand-blue-700 transition-all flex items-start gap-4 shadow-xs">
                  <div className="p-3 bg-brand-blue-900 text-white rounded-xl">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 text-left">
                    <p className="text-[10px] text-neutral-400 uppercase font-mono tracking-widest">General Inquiries & Operations</p>
                    {COMPANY_DETAILS.phones.map(p => (
                      <a 
                        key={p}
                        href={`tel:${p.replace(/\s+/g, '')}`} 
                        className="block font-display font-semibold text-lg text-brand-blue-900 hover:text-brand-gold-600 transition-colors"
                      >
                        {p}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Instant WhatsApp */}
                <button
                  onClick={sendWhatsApp}
                  className="w-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 p-6 rounded-2xl transition-all flex items-start gap-4 text-left shadow-xs group"
                >
                  <div className="p-3 bg-emerald-600 text-white rounded-xl">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-emerald-600 uppercase font-mono tracking-widest font-semibold flex items-center gap-1">
                      <span>WhatsApp Portal</span>
                      <ExternalLink className="w-3 h-3 text-emerald-500" />
                    </p>
                    <p className="font-display font-bold text-lg text-emerald-950 group-hover:text-emerald-700 transition-colors">
                      Inquire on WhatsApp Chat
                    </p>
                    <p className="text-xs text-emerald-600/80 font-sans leading-relaxed">
                      Tap to open an instant secure messaging chat directly with our Estimating Officer.
                    </p>
                  </div>
                </button>

              </div>

              {/* Admin emails list */}
              <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200/80 space-y-4 shadow-xs">
                <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
                  <Mail className="w-5 h-5 text-brand-gold-500 shrink-0" />
                  <h4 className="font-display font-bold text-sm tracking-wide text-brand-blue-900">Email Correspondence</h4>
                </div>
                
                <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm font-sans" id="contact-emails-list">
                  {COMPANY_DETAILS.emails.map(email => (
                    <a 
                      key={email}
                      href={`mailto:${email}`} 
                      className="block text-neutral-600 hover:text-brand-blue-700 hover:underline py-1 truncate"
                      title={email}
                    >
                      {email}
                    </a>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Contact Inquiry Form (7/12 width) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200 p-6 sm:p-10 shadow-md relative overflow-hidden" id="contact-form-card">
              <div className="absolute inset-0 grid-overlay opacity-5 pointer-events-none" />

              <div className="space-y-6 relative z-10">
                <div className="space-y-1">
                  <h3 className="font-display font-black text-xl text-brand-blue-900 leading-tight">
                    Civil Intake & Tender Inquiry Portal
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Submit your parameters below and our board officers will respond with certified blueprints or quotes.
                  </p>
                </div>

                {errorMsg && (
                  <div className="bg-red-50 border border-red-200/60 p-4 rounded-xl text-xs font-semibold text-red-800 flex items-center gap-2 font-mono">
                    <span className="text-sm shrink-0">⚠</span>
                    <span>{errorMsg}</span>
                  </div>
                )}

                {complete ? (
                  <div className="bg-indigo-50 border border-brand-blue-600/30 p-8 rounded-2xl text-center space-y-3">
                    <CheckCircle className="w-12 h-12 text-brand-blue-700 mx-auto" />
                    <h3 className="font-display font-semibold text-lg text-brand-blue-950">Inquiry Logged</h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                      Thank you, <strong>{msgDetails.name}</strong>. Your civil tender interest was logged in Mr. G. Selva Kumar's Estimating Bureau. One of our operational representatives will link with you at <strong>{msgDetails.phone}</strong> soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      
                      <div className="space-y-1 text-xs">
                        <label className="text-neutral-500 font-semibold font-display">Contractor / Client Name *</label>
                        <input 
                          type="text" 
                          required
                          value={msgDetails.name}
                          onChange={(e) => setMsgDetails({...msgDetails, name: e.target.value})}
                          className="w-full bg-neutral-50 border border-neutral-200 hover:border-neutral-300 focus:border-brand-blue-700 rounded-lg p-3 text-sm text-neutral-800 focus:outline-none focus:ring-1 focus:ring-brand-blue-700 transition-colors font-sans"
                          placeholder="e.g. Selvam Builders"
                        />
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="text-neutral-500 font-semibold font-display">Contact Phone Number *</label>
                        <input 
                          type="tel" 
                          required
                          value={msgDetails.phone}
                          onChange={(e) => setMsgDetails({...msgDetails, phone: e.target.value})}
                          className="w-full bg-neutral-50 border border-neutral-200 hover:border-neutral-300 focus:border-brand-blue-700 rounded-lg p-3 text-sm text-neutral-800 focus:outline-none focus:ring-1 focus:ring-brand-blue-700 transition-colors font-sans"
                          placeholder="e.g. +91 98420 XXXXX"
                        />
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                      <div className="space-y-1 text-xs">
                        <label className="text-neutral-500 font-semibold font-display">Corporate Email Address</label>
                        <input 
                          type="email" 
                          value={msgDetails.email}
                          onChange={(e) => setMsgDetails({...msgDetails, email: e.target.value})}
                          className="w-full bg-neutral-50 border border-neutral-200 hover:border-neutral-300 focus:border-brand-blue-700 rounded-lg p-3 text-sm text-neutral-800 focus:outline-none focus:ring-1 focus:ring-brand-blue-700 transition-colors font-sans"
                          placeholder="e.g. tender@builder.com"
                        />
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="text-neutral-500 font-semibold font-display">Primary Area of Interest</label>
                        <select 
                          className="w-full bg-neutral-50 border border-neutral-200 hover:border-neutral-300 focus:border-brand-blue-700 rounded-lg p-3 text-sm text-neutral-800 focus:outline-none focus:ring-1 focus:ring-brand-blue-700 transition-colors font-sans"
                          value={msgDetails.serviceInterest}
                          onChange={(e) => setMsgDetails({...msgDetails, serviceInterest: e.target.value})}
                        >
                          <option value="general">General Civil Inquiry</option>
                          <option value="pwd-road">PWD Paving / Civil Construction</option>
                          <option value="wrd-canal">WRD Irrigation / Canals</option>
                          <option value="dewatering">Emergency Dewatering Pump Hire</option>
                          <option value="sweeper">Hydraulic Sweeping Broomer Spec</option>
                        </select>
                      </div>

                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="text-neutral-500 font-semibold font-display">Tender Scope Summary / Detailed Request Description</label>
                      <textarea 
                        rows={4}
                        value={msgDetails.message}
                        onChange={(e) => setMsgDetails({...msgDetails, message: e.target.value})}
                        className="w-full bg-neutral-50 border border-neutral-200 hover:border-neutral-300 focus:border-brand-blue-700 rounded-lg p-3 text-sm text-neutral-800 focus:outline-none focus:ring-1 focus:ring-brand-blue-700 transition-colors font-sans"
                        placeholder="Detail site elevation specs, discharge pipe lengths, or tractor PTO parameters..."
                      />
                    </div>

                    <div className="pt-2 text-center">
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 bg-brand-blue-700 hover:bg-brand-blue-900 text-white font-display font-semibold text-sm py-3.5 px-8 rounded-lg shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
                        id="contact-form-submit"
                      >
                        {loading ? (
                          <Loader className="w-5 h-5 animate-spin mr-1 shrink-0" />
                        ) : (
                          <Send className="w-4 h-4 shrink-0" />
                        )}
                        <span>Log Inquiry and Connect</span>
                      </button>
                    </div>

                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Operational Coordinates & Static Maps Section */}
      <section className="py-20 sm:py-24 bg-neutral-50 border-t border-neutral-200/60" id="contact-office-coordinates">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono font-bold tracking-widest text-brand-blue-700 uppercase block">GEOGRAPHICAL NETWORK</span>
            <h2 className="text-3xl font-black text-brand-blue-900 tracking-tight">Registered Hubs & Maps</h2>
            <p className="text-xs sm:text-sm text-neutral-500">Coordinate mapping for our corporate offices in Villupuram and metro Chennai transit sectors.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {OFFICES.map((office, idx) => (
              <div 
                key={office.name} 
                className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden hover:shadow-lg transition-all flex flex-col group h-full"
                id={`office-loc-card-${idx}`}
              >
                {/* Simulated map frame matching physical screenshots from ZIP assets */}
                <div className="h-64 sm:h-72 w-full bg-neutral-200 relative border-b border-neutral-200">
                  <img 
                    src={office.mapImage}
                    alt={`${office.name} satellite grid coordinate outline`}
                    className="w-full h-full object-cover filter brightness-[0.97]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-neutral-900/15 pointer-events-none" />
                  
                  {/* Dynamic location PIN float label */}
                  <div className="absolute top-4 right-4 bg-brand-blue-900/90 text-white font-mono text-[10px] font-bold py-1 px-3 rounded-full uppercase tracking-wider border border-brand-blue-800">
                    {office.type}
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-between flex-1 space-y-6">
                  <div className="space-y-2.5">
                    <h3 className="font-display font-bold text-lg text-brand-blue-950 group-hover:text-brand-blue-700 transition-colors">
                      {office.name}
                    </h3>
                    <div className="flex gap-2.5 items-start text-xs sm:text-sm text-neutral-600 font-sans leading-relaxed">
                      <MapPin className="w-5 h-5 text-brand-gold-500 mt-0.5 shrink-0" />
                      <div>
                        {office.addressLines.map(line => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <a
                      href={office.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-brand-blue-700 text-xs font-semibold group/link"
                    >
                      <span>Show Driving Coordinates</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
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
