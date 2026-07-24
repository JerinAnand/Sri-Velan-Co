/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Phone, Mail, MapPin, Award, ArrowUpRight, Instagram, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { COMPANY_DETAILS, OFFICES } from '../data';
import { ActiveView } from '../types';
import { useTranslation } from '../context/TranslationContext';
import { useSiteContent } from '../context/SiteContentContext';
import companyLogo from '../assets/images/sri-velan-logo.png';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();
  const { siteContent } = useSiteContent();
  const footerData = siteContent.footer;
  const contactData = siteContent.contact;

  const quickLinks = [
    { label: t('footer.links.home'), view: 'home' as ActiveView },
    { label: t('footer.links.about'), view: 'about' as ActiveView },
    { label: t('footer.links.services'), view: 'chennai' as ActiveView },
    { label: t('footer.links.equipments'), view: 'equipments' as ActiveView },
    { label: t('footer.links.projects'), view: 'projects' as ActiveView },
    { label: t('footer.links.hydraulicBroomer'), view: 'hydraulic-broomer' as ActiveView },
    { label: t('footer.links.contact'), view: 'contact' as ActiveView },
  ];

  const handleLinkClick = (view: ActiveView) => {
    navigate(view === 'home' ? '/' : '/' + view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-blue-950 text-white pt-16 pb-20 sm:pb-24 border-t border-brand-blue-900 overflow-hidden relative">
      {/* Decorative Blueprint Background Accent */}
      <div className="absolute inset-0 grid-overlay opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-brand-blue-800/60">
          
          {/* Column 1: Core Company and Regulatory Registry */}
          <div className="space-y-5" id="footer-col-company">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded overflow-hidden shrink-0 bg-black shadow-inner">
                <img
                  src={companyLogo}
                  alt="Sri Velan & Co"
                  className="h-full w-full object-contain"
                  loading="lazy"
                  width="36"
                  height="36"
                />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg tracking-wide uppercase text-brand-gold-500">
                  {COMPANY_DETAILS.name}
                </h3>
                <span className="text-[10px] text-brand-gold-400 font-mono block tracking-widest leading-none">
                  {t('navigation.establishedIn')} {COMPANY_DETAILS.yearEstablished}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-neutral-300 leading-relaxed font-sans">
              {footerData?.description || t('footer.companyDesc')}
            </p>

            {/* Registration Tags Bento Box */}
            <div className="space-y-2.5 bg-brand-blue-900/60 border border-brand-blue-800/40 p-4 rounded-lg">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">{t('footer.gstRegistry')}</span>
                <span className="text-brand-gold-400 font-mono font-medium select-all">
                  {COMPANY_DETAILS.gstin}
                </span>
              </div>
              <div className="h-px bg-brand-blue-800/40 w-full" />
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">{t('footer.msmeUdyam')}</span>
                <span className="text-brand-gold-400 font-mono font-medium select-all">
                  {COMPANY_DETAILS.msme}
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Structured Service Sitemap links */}
          <div className="space-y-5" id="footer-col-links">
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-brand-gold-400">
              {t('footer.corporateDirectory')}
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
              {t('footer.operationalContacts')}
            </h4>

            <div className="space-y-3.5 text-sm text-neutral-300">
              <div className="space-y-2">
                <p className="text-xs font-mono tracking-wider text-neutral-400 uppercase">{t('footer.emergencyHotlines')}</p>
                <a
                  href={`tel:${(contactData?.phonePrimary || COMPANY_DETAILS.phones[0]).replace(/\s+/g, '')}`}
                  className="flex items-center gap-2 hover:text-brand-gold-400 transition-colors font-medium text-white"
                >
                  <Phone className="w-4 h-4 text-brand-gold-500 shrink-0" />
                  <span>{contactData?.phonePrimary || COMPANY_DETAILS.phones[0]}</span>
                </a>
                {contactData?.phoneSecondary && (
                  <a
                    href={`tel:${contactData.phoneSecondary.replace(/\s+/g, '')}`}
                    className="flex items-center gap-2 hover:text-brand-gold-400 transition-colors font-medium text-white"
                  >
                    <Phone className="w-4 h-4 text-brand-gold-500 shrink-0" />
                    <span>{contactData.phoneSecondary}</span>
                  </a>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-xs font-mono tracking-wider text-neutral-400 uppercase">{t('footer.adminEmail')}</p>
                <a
                  href={`mailto:${contactData?.emailPrimary || COMPANY_DETAILS.emails[0]}`}
                  className="flex items-center gap-2 hover:text-brand-gold-400 transition-colors truncate"
                >
                  <Mail className="w-4 h-4 text-brand-gold-500 shrink-0" />
                  <span className="truncate">{contactData?.emailPrimary || COMPANY_DETAILS.emails[0]}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Physical Office Addresses & Assets */}
          <div className="space-y-5" id="footer-col-offices">
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-brand-gold-400">
              {t('footer.regionalHQ')}
            </h4>

            <div className="space-y-4">
              <div className="flex gap-3 text-sm text-neutral-300">
                <MapPin className="w-5 h-5 text-brand-gold-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white text-xs uppercase font-mono">Villupuram HQ</p>
                  <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                    {OFFICES[0].addressLines.join(' ')}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 text-sm text-neutral-300 pt-1">
                <MapPin className="w-5 h-5 text-brand-gold-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white text-xs uppercase font-mono">Chennai HQ</p>
                  <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                    S2, Second Floor, A Block, 8th Cross Street, Ram Nagar South, Madipakkam, Chennai, Tamil Nadu - 600091.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {/* PDF Capability Statement Trigger */}
                <button
                  onClick={() => {
                    navigate('/capability-statement?download=true');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  title="Download Corporate Capability Statement Document"
                  className="flex items-center justify-between w-full bg-brand-blue-900 hover:bg-brand-blue-800 text-white font-medium text-xs py-2.5 px-3.5 border border-brand-blue-800 rounded-lg transition-colors group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-gold-500" />
                    <span>{t('footer.downloadCapability')}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-brand-gold-500 transition-colors" />
                </button>

                {/* PDF Brochure Trigger */}
                <a
                  href={COMPANY_DETAILS.brochureLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download corporate credentials presentation brochure document in PDF format"
                  title="Download Corporate Credentials PDF Brochure"
                  className="flex items-center justify-between w-full bg-brand-blue-900 hover:bg-brand-blue-800 text-white font-medium text-xs py-2.5 px-3.5 border border-brand-blue-800 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-gold-500" />
                    <span>{t('footer.downloadBrochure')}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-brand-gold-500 transition-colors" />
                </a>

                {/* Instagram Handle */}
                <a
                  href={COMPANY_DETAILS.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Sri Velan and Co administrative Instagram page profile"
                  title="Visit Instagram Page Profile"
                  className="flex items-center gap-2.5 text-xs text-neutral-300 hover:text-brand-gold-400 transition-colors pl-1"
                >
                  <Instagram className="w-4 h-4 text-brand-gold-500" />
                  <span>{t('footer.instagramHandle')}</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Corporate Legal & Compliance Footer Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-1.5 flex-wrap justify-center text-center">
            <span>© {currentYear}</span>
            <span className="font-semibold text-white">
              {COMPANY_DETAILS.legalName}.
            </span>
            <span>{t('footer.allRightsReserved')}</span>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap justify-center text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-brand-gold-500" />
              <span>{t('footer.registeredPWD')}</span>
            </span>
            <span>•</span>
            <button onClick={() => handleLinkClick('contact')} className="hover:text-brand-gold-400 transition-colors">
              {t('footer.contractIntakePortal')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
