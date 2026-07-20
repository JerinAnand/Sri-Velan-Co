/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Loader2, FileText, CheckCircle } from 'lucide-react';
// @ts-ignore
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import companyLogo from '../assets/images/sri-velan-logo.png';
import { COMPANY_DETAILS, OFFICES } from '../data';
import { useTranslation } from '../context/TranslationContext';

export const CapabilityStatement: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorLog, setErrorLog] = useState<string | null>(null);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  const shouldTriggerDownload = searchParams.get('download') === 'true';

  // Check if logo is already loaded or wait for onload event
  useEffect(() => {
    if (logoRef.current) {
      if (logoRef.current.complete) {
        setLogoLoaded(true);
      } else {
        logoRef.current.onload = () => setLogoLoaded(true);
        logoRef.current.onerror = () => {
          console.error("Failed to load company logo image");
          setLogoLoaded(true); // Proceed anyway so we don't block forever
        };
      }
    } else {
      setLogoLoaded(true);
    }
  }, []);

  const handleDownloadPDF = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setErrorLog(null);

    try {
      // 1. Await document fonts to be fully loaded and parsed
      if (document.fonts) {
        await document.fonts.ready;
      }

      // 2. Await the logo image to be fully loaded
      if (logoRef.current && !logoRef.current.complete) {
        await new Promise((resolve) => {
          if (logoRef.current) {
            logoRef.current.onload = resolve;
            logoRef.current.onerror = resolve;
          } else {
            resolve(true);
          }
        });
      }

      const element = documentRef.current;
      if (!element) {
        throw new Error('Target element for PDF generation was not found on the DOM');
      }

      // Render via html2canvas-pro to support oklch/color-mix/modern css features seamlessly
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Create PDF in A4 format (210mm x 297mm)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();

      // Set dimensions to align with web layout padding (12mm top/bottom, 15mm left/right)
      const marginLeft = 15;
      const marginTop = 12;
      const printableWidth = pdfWidth - (2 * marginLeft); // 180mm
      const imgHeight = (canvas.height * printableWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', marginLeft, marginTop, printableWidth, imgHeight);
      pdf.save('Sri-Velan-Co-Capability-Statement.pdf');
      
      // Clean up search query param after successful download
      if (shouldTriggerDownload) {
        setSearchParams({}, { replace: true });
      }
    } catch (err: any) {
      console.error('CRITICAL ERROR DURING PDF GENERATION (Full details):', err);
      if (err && typeof err === 'object') {
        console.dir(err);
        try {
          console.error('Stringified PDF Generation Error:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
        } catch (_) {}
      }
      setErrorLog(err.message || String(err));
    } finally {
      setIsGenerating(false);
    }
  };

  // Automatically trigger PDF download if URL parameter ?download=true is detected
  useEffect(() => {
    if (shouldTriggerDownload && logoLoaded) {
      // Small timeout to allow render paint cycles to settle
      const timeout = setTimeout(() => {
        handleDownloadPDF();
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [shouldTriggerDownload, logoLoaded]);

  const todayDateStr = new Date().toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Scoped style block to purge and override oklch() color definitions for html2canvas */}
      <style>{`
        #capability-statement-canvas,
        #capability-statement-canvas * {
          transition: none !important;
          animation: none !important;
          box-shadow: none !important;
          text-shadow: none !important;
          border-color: #e5e7eb !important;
          outline-color: #e5e7eb !important;
          --border-color: #e5e7eb !important;
          --outline-color: #e5e7eb !important;
        }
        
        /* Reset common Tailwind v4 CSS variables that might resolve to oklch */
        #capability-statement-canvas {
          --color-neutral-50: #fafafa !important;
          --color-neutral-100: #f5f5f5 !important;
          --color-neutral-200: #e5e5e5 !important;
          --color-neutral-300: #d4d4d4 !important;
          --color-neutral-400: #a3a3a3 !important;
          --color-neutral-500: #737373 !important;
          --color-neutral-600: #525252 !important;
          --color-neutral-700: #404040 !important;
          --color-neutral-800: #262626 !important;
          --color-neutral-900: #171717 !important;
          
          --color-brand-blue-50: #f0f5fa !important;
          --color-brand-blue-100: #e0ecf5 !important;
          --color-brand-blue-600: #1b4975 !important;
          --color-brand-blue-700: #0e2954 !important;
          --color-brand-blue-800: #0a1f40 !important;
          --color-brand-blue-900: #051329 !important;
          --color-brand-blue-950: #020a17 !important;
        
          --color-brand-gold-50: #fdfaf2 !important;
          --color-brand-gold-400: #f3ce6b !important;
          --color-brand-gold-500: #e6b325 !important;
          --color-brand-gold-600: #c9931b !important;
          --color-brand-gold-700: #a17014 !important;
          
          --background: #ffffff !important;
          --foreground: #000000 !important;
          --border: #e5e7eb !important;
        }

        #capability-statement-canvas h1,
        #capability-statement-canvas h2,
        #capability-statement-canvas h3,
        #capability-statement-canvas h4,
        #capability-statement-canvas h5,
        #capability-statement-canvas h6 {
          color: #0e2954 !important;
          font-family: Arial, sans-serif !important;
        }

        #capability-statement-canvas p,
        #capability-statement-canvas span,
        #capability-statement-canvas td,
        #capability-statement-canvas th,
        #capability-statement-canvas strong,
        #capability-statement-canvas li {
          font-family: Arial, sans-serif !important;
        }

        #capability-statement-canvas table {
          border-collapse: collapse !important;
          border: 1px solid #d1d5db !important;
        }

        #capability-statement-canvas th {
          border: 1px solid #d1d5db !important;
          background-color: #f3f4f6 !important;
          color: #111827 !important;
        }

        #capability-statement-canvas td {
          border: 1px solid #e5e7eb !important;
          color: #111827 !important;
        }
      `}</style>
      
      {/* Upper Control Panel: Visible only on screen, hidden during printing */}
      <div className="max-w-[820px] mx-auto mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 no-print">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300 hover:text-brand-blue-700 dark:hover:text-brand-gold-400 transition-colors cursor-pointer"
          aria-label="Back to website"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('capability.backToWebsite')}</span>
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all cursor-pointer"
            aria-label="Print capability statement document"
          >
            <Printer className="w-4 h-4" />
            <span>{t('capability.printSheet')}</span>
          </button>
          
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-gold-500 to-brand-gold-600 text-brand-blue-950 font-semibold rounded-lg text-sm hover:from-brand-gold-400 hover:to-brand-gold-500 hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
            aria-label="Download capability statement PDF document"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-brand-blue-950" />
                <span>{t('capability.generatingPdf')}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-brand-blue-950" />
                <span>{t('capability.downloadPdf')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading & Status Overlay (For background compilation of the document) */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col justify-center items-center text-white no-print">
          <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-2xl">
            <Loader2 className="w-12 h-12 animate-spin text-brand-gold-500 mx-auto" />
            <h3 className="font-display font-bold text-lg">{t('capability.compilingPdf')}</h3>
            <p className="text-sm text-neutral-400 font-light leading-relaxed">
              {t('capability.compilingDesc')}
            </p>
          </div>
        </div>
      )}

      {/* Printable Area Shell: Configured to fit exactly one single A4 sheet */}
      {/* 210mm x 297mm standard dimensions (A4). We force light theme background and text colors to prevent dark mode taint. */}
      {/* Uses standard, clean serif/sans-serif fonts (Helvetica/Arial system font stack) */}
      <div 
        id="capability-statement-canvas"
        className="mx-auto rounded overflow-hidden shadow-2xl"
        style={{
          width: '210mm',
          minHeight: '297mm',
          maxWidth: '100%',
          boxSizing: 'border-box',
          padding: '12mm 15mm',
          backgroundColor: '#ffffff',
          color: '#000000',
          border: '1px solid #d1d5db',
          fontFamily: 'Helvetica, Arial, sans-serif'
        }}
      >
        <div 
          ref={documentRef} 
          className="w-full flex flex-col justify-between h-full" 
          style={{ 
            minHeight: '273mm',
            backgroundColor: '#ffffff',
            color: '#000000'
          }}
        >
          
          {/* A. Formal Corporate Header / Company Letterhead */}
          <div className="pb-3 mb-4 flex justify-between items-center" style={{ borderBottom: '2px solid #0e2954' }}>
            <div className="flex items-center gap-4">
              <div className="rounded overflow-hidden shrink-0 flex items-center justify-center" style={{ width: '56px', height: '56px', backgroundColor: '#000000', padding: '2px' }}>
                <img
                  ref={logoRef}
                  src={companyLogo}
                  alt="Sri Velan & Co Corporate Monogram"
                  className="h-full w-full object-contain"
                  style={{ maxHeight: '100%', maxWidth: '100%' }}
                  crossOrigin="anonymous"
                />
              </div>
              <div className="text-left">
                <h1 className="font-bold tracking-tight uppercase leading-none" style={{ fontSize: '24px', color: '#0e2954', fontFamily: 'Arial, sans-serif' }}>
                  {t('capability.letterhead.title')}
                </h1>
                <p className="font-bold tracking-wider uppercase mt-1" style={{ fontSize: '11px', color: '#4b5563', fontFamily: 'Arial, sans-serif' }}>
                  {t('capability.letterhead.sub')}
                </p>
                <p className="mt-1 leading-normal" style={{ fontSize: '9px', color: '#6b7280' }}>
                  {t('capability.letterhead.address')}
                </p>
              </div>
            </div>

            <div className="text-right flex flex-col justify-end" style={{ fontSize: '9.5px', color: '#1f2937' }}>
              <p><strong style={{ color: '#0e2954' }}>{t('capability.letterhead.phone')}:</strong> +91 98942 18243 | +91 98427 18243</p>
              <p className="mt-0.5"><strong style={{ color: '#0e2954' }}>{t('capability.letterhead.email')}:</strong> srivelan2004@gmail.com</p>
              <p className="mt-0.5"><strong style={{ color: '#0e2954' }}>{t('capability.letterhead.website')}:</strong> srivelan.co</p>
            </div>
          </div>

          {/* B. Core Content Sections Block */}
          <div className="space-y-4 flex-grow">
            
            {/* 1. Company Overview Section */}
            <div className="text-left">
              <h2 className="font-bold uppercase tracking-wide pb-0.5 mb-1.5" style={{ fontSize: '12px', color: '#0e2954', borderBottom: '1px solid #0e2954' }}>
                {t('capability.overview.title')}
              </h2>
              <p className="leading-relaxed text-justify" style={{ fontSize: '10px', color: '#1f2937' }}>
                {t('capability.overview.text')}
              </p>
            </div>

            {/* 2. Registration & Compliance Section */}
            <div className="text-left">
              <h2 className="font-bold uppercase tracking-wide pb-0.5 mb-1.5" style={{ fontSize: '12px', color: '#0e2954', borderBottom: '1px solid #0e2954' }}>
                {t('capability.compliance.title')}
              </h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-left" style={{ fontSize: '10px', color: '#1f2937' }}>
                <p className="flex items-center gap-1.5">
                  <span style={{ color: '#ca8a04', fontWeight: 'bold' }}>•</span>
                  <span>{t('capability.compliance.pwd')}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <span style={{ color: '#ca8a04', fontWeight: 'bold' }}>•</span>
                  <span>{t('capability.compliance.gst')}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <span style={{ color: '#ca8a04', fontWeight: 'bold' }}>•</span>
                  <span>{t('capability.compliance.pan')}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <span style={{ color: '#ca8a04', fontWeight: 'bold' }}>•</span>
                  <span>{t('capability.compliance.msme')}</span>
                </p>
              </div>
            </div>

            {/* 3. Core Competencies Section */}
            <div className="text-left">
              <h2 className="font-bold uppercase tracking-wide pb-0.5 mb-1.5" style={{ fontSize: '12px', color: '#0e2954', borderBottom: '1px solid #0e2954' }}>
                {t('capability.competencies.title')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-left" style={{ fontSize: '9.5px', color: '#1f2937' }}>
                <p className="flex items-start gap-1.5">
                  <span style={{ color: '#ca8a04', fontWeight: 'bold', marginTop: '2px' }}>✔</span>
                  <span>{t('capability.competencies.item1')}</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span style={{ color: '#ca8a04', fontWeight: 'bold', marginTop: '2px' }}>✔</span>
                  <span>{t('capability.competencies.item2')}</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span style={{ color: '#ca8a04', fontWeight: 'bold', marginTop: '2px' }}>✔</span>
                  <span>{t('capability.competencies.item3')}</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span style={{ color: '#ca8a04', fontWeight: 'bold', marginTop: '2px' }}>✔</span>
                  <span>{t('capability.competencies.item4')}</span>
                </p>
              </div>
            </div>

            {/* 4. Key Clients / Empanelments Section */}
            <div className="text-left">
              <h2 className="font-bold uppercase tracking-wide pb-0.5 mb-1.5" style={{ fontSize: '12px', color: '#0e2954', borderBottom: '1px solid #0e2954' }}>
                {t('capability.clients.title')}
              </h2>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-left" style={{ fontSize: '10px', color: '#1f2937' }}>
                <span className="flex items-center gap-1"><span style={{ color: '#0e2954', fontWeight: 'bold' }}>•</span> {t('capability.clients.gcc')}</span>
                <span className="flex items-center gap-1"><span style={{ color: '#0e2954', fontWeight: 'bold' }}>•</span> {t('capability.clients.cmrl')}</span>
                <span className="flex items-center gap-1"><span style={{ color: '#0e2954', fontWeight: 'bold' }}>•</span> {t('capability.clients.pwd')}</span>
                <span className="flex items-center gap-1"><span style={{ color: '#0e2954', fontWeight: 'bold' }}>•</span> {t('capability.clients.wrd')}</span>
                <span className="flex items-center gap-1"><span style={{ color: '#0e2954', fontWeight: 'bold' }}>•</span> {t('capability.clients.hrce')}</span>
              </div>
            </div>

            {/* 5. Representative Projects Section */}
            <div className="text-left">
              <h2 className="font-bold uppercase tracking-wide pb-0.5 mb-1.5" style={{ fontSize: '12px', color: '#0e2954', borderBottom: '1px solid #0e2954' }}>
                {t('capability.projects.title')}
              </h2>
              <table className="w-full border-collapse" style={{ fontSize: '9.5px', color: '#111827' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6' }}>
                    <th className="text-left p-1.5 font-bold uppercase" style={{ border: '1px solid #d1d5db', width: '65%' }}>{t('capability.projects.headerProject')}</th>
                    <th className="text-left p-1.5 font-bold uppercase" style={{ border: '1px solid #d1d5db', width: '35%' }}>{t('capability.projects.headerClient')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-1.5 font-medium" style={{ border: '1px solid #e5e7eb' }}>{t('capability.projects.p1')}</td>
                    <td className="p-1.5" style={{ border: '1px solid #e5e7eb' }}>{t('capability.projects.p1Client')}</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 font-medium" style={{ border: '1px solid #e5e7eb' }}>{t('capability.projects.p2')}</td>
                    <td className="p-1.5" style={{ border: '1px solid #e5e7eb' }}>{t('capability.projects.p2Client')}</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 font-medium" style={{ border: '1px solid #e5e7eb' }}>{t('capability.projects.p3')}</td>
                    <td className="p-1.5" style={{ border: '1px solid #e5e7eb' }}>{t('capability.projects.p3Client')}</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 font-medium" style={{ border: '1px solid #e5e7eb' }}>{t('capability.projects.p4')}</td>
                    <td className="p-1.5" style={{ border: '1px solid #e5e7eb' }}>{t('capability.projects.p4Client')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 6. Equipment & Machinery Owned Section */}
            <div className="text-left">
              <h2 className="font-bold uppercase tracking-wide pb-0.5 mb-1.5" style={{ fontSize: '12px', color: '#0e2954', borderBottom: '1px solid #0e2954' }}>
                {t('capability.equipment.title')}
              </h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-left" style={{ fontSize: '9.5px', color: '#1f2937' }}>
                <p>• {t('capability.equipment.item1')}</p>
                <p>• {t('capability.equipment.item2')}</p>
                <p>• {t('capability.equipment.item3')}</p>
                <p>• {t('capability.equipment.item4')}</p>
              </div>
            </div>

          </div>

          {/* C. Formal Office Footer & Authority Stamp */}
          <div className="mt-4 pt-3 flex justify-between items-end" style={{ borderTop: '1px solid #e5e7eb' }}>
            <div className="text-left" style={{ fontSize: '8.5px', color: '#6b7280' }}>
              <p><strong>{t('capability.footer.contactDesk')}</strong></p>
              <p className="mt-0.5">{t('capability.footer.cell')}: +91 98942 18243 | srivelan2004@gmail.com</p>
              <p className="mt-0.5">{t('capability.footer.corporateOffices')}</p>
            </div>
            
            <div className="text-right font-mono flex flex-col justify-end items-end" style={{ fontSize: '8px', color: '#9ca3af' }}>
              <div className="p-1 px-2.5 rounded mb-1" style={{ border: '1px dashed #d1d5db', backgroundColor: '#f9fafb', color: '#4b5563', fontSize: '7.5px' }}>
                <span style={{ fontWeight: 'bold', color: '#0e2954' }}>✓</span> {t('capability.footer.verifiedContractor')}
              </div>
              <p>{t('capability.footer.generatedOn')} {todayDateStr}</p>
              <p className="mt-0.5">{t('capability.footer.ref')}: SVC-CS-2026-A4</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
