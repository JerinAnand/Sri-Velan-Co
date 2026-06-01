/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Phone, Mail, MapPin, Award, ArrowUpRight, Instagram, FileText } from 'lucide-react';
import { COMPANY_DETAILS, OFFICES } from '../data';
import { ActiveView } from '../types';

interface FooterProps {
  setActiveView: (view: ActiveView) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveView }) => {
  const currentYear = 2026;

  const quickLinks = [
    { label: 'Home Page', view: 'home' as ActiveView },
    { label: 'About Company', view: 'about' as ActiveView },
    { label: 'Our Services', view: 'services' as ActiveView },
    { label: 'Machinery & Fleet', view: 'equipments' as ActiveView },
    { label: 'Project Portfolio', view: 'projects' as ActiveView },
    { label: 'Hydraulic Broomer spec', view: 'hydraulic-broomer' as ActiveView },
    { label: 'Contact Us', view: 'contact' as ActiveView },
  ];

  const handleLinkClick = (view: ActiveView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-blue-950 text-white pt-16 pb-8 border-t border-brand-blue-900 overflow-hidden relative">
      {/* Decorative Blueprint Background Accent */}
      <div className="absolute inset-0 grid-overlay opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-brand-blue-800/60">
          
          {/* Column 1: Core Company and Regulatory Registry */}
          <div className="space-y-5" id="footer-col-company">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 bg-brand-gold-500 rounded flex items-center justify-center p-2 shadow-inner">
                <span className="text-brand-blue-900 font-display font-extrabold text-sm tracking-tighter">SVC</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg tracking-wide uppercase">{COMPANY_DETAILS.name}</h3>
                <span className="text-[10px] text-brand-gold-400 font-mono block tracking-widest leading-none">ESTD 2004</span>
              </div>
            </div>
            
            <p className="text-sm text-neutral-300 leading-relaxed font-sans">
              State-Registered Civil Engineering Contractors specializing in PWD Buildings, Water Resources, and rapid Disaster Response Pumping Operations.
            </p>

            {/* Registration Tags Bento Box */}
            <div className="space-y-2.5 bg-brand-blue-900/60 border border-brand-blue-800/40 p-4 rounded-lg">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">GSTIN Registry</span>
                <span className="text-brand-gold-400 font-mono font-medium select-all">{COMPANY_DETAILS.gstin}</span>
              </div>
              <div className="h-px bg-brand-blue-800/40 w-full" />
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">MSME Udyam</span>
                <span className="text-brand-gold-400 font-mono font-medium select-all">{COMPANY_DETAILS.msme}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Structured Service Sitemap links */}
          <div className="space-y-5" id="footer-col-links">
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-brand-gold-400">
              Corporate Directory
            </h4>
            
            <ul className="grid grid-cols-1 gap-2.5 text-sm" id="footer-directory-ul">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleLinkClick(link.view)}
                    className="flex items-center gap-1.5 text-neutral-300 hover:text-brand-gold-400 transition-colors text-left group"
                  >
                    <span className="h-1.5 w-1.5 bg-brand-gold-500 rounded-full group-hover:scale-150 transition-transform" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Channels */}
          <div className="space-y-5" id="footer-col-contacts">
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-brand-gold-400">
              Operational Contacts
            </h4>

            <div className="space-y-3.5 text-sm text-neutral-300">
              <div className="space-y-2">
                <p className="text-xs font-mono tracking-wider text-neutral-400 uppercase">Emergency Hotlines (24/7)</p>
                {COMPANY_DETAILS.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-2 hover:text-brand-gold-400 transition-colors font-medium text-white"
                  >
                    <Phone className="w-4 h-4 text-brand-gold-500 shrink-0" />
                    <span>{phone}</span>
                  </a>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-xs font-mono tracking-wider text-neutral-400 uppercase">Administration Email</p>
                <div className="space-y-1">
                  {COMPANY_DETAILS.emails.slice(0, 2).map((email) => (
                    <a
                      key={email}
                      href={`mailto:${email}`}
                      className="flex items-center gap-2 hover:text-brand-gold-400 transition-colors truncate"
                      title={email}
                    >
                      <Mail className="w-4 h-4 text-brand-gold-500 shrink-0" />
                      <span className="truncate">{email}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Physical Office Addresses & Assets */}
          <div className="space-y-5" id="footer-col-offices">
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-brand-gold-400">
              Company Assets
            </h4>

            <div className="space-y-4">
              <div className="flex gap-3 text-sm text-neutral-300">
                <MapPin className="w-5 h-5 text-brand-gold-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white text-xs uppercase font-mono">Head Office (Villupuram)</p>
                  <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                    {OFFICES[0].addressLines.join(' ')}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {/* PDF Brochure Trigger */}
                <a
                  href={COMPANY_DETAILS.brochureLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full bg-brand-blue-900 hover:bg-brand-blue-800 text-white font-medium text-xs py-2.5 px-3.5 border border-brand-blue-800 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-gold-500" />
                    <span>Download Company Brochure</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-brand-gold-500 transition-colors" />
                </a>

                {/* Instagram Handle */}
                <a
                  href={COMPANY_DETAILS.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-xs text-neutral-300 hover:text-brand-gold-400 transition-colors pl-1"
                >
                  <Instagram className="w-4 h-4 text-brand-gold-500" />
                  <span>@sri_velan_co on Instagram</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Corporate Legal & Compliance Footer Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-1.5 flex-wrap justify-center text-center">
            <span>© {currentYear}</span>
            <span className="font-semibold text-white">{COMPANY_DETAILS.legalName}.</span>
            <span>All Corporate Rights Reserved.</span>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap justify-center text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-brand-gold-500" />
              <span>Registered Class I PWD Contractor</span>
            </span>
            <span>•</span>
            <button onClick={() => handleLinkClick('contact')} className="hover:text-brand-gold-400 transition-colors">
              Contract Intake Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
