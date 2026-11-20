import React from 'react';
import { Copy, Globe } from 'lucide-react';

export type EditorLanguage = 'en' | 'ta';

interface LanguageTabsProps {
  activeLang: EditorLanguage;
  onChange: (lang: EditorLanguage) => void;
  onCopyEnToTa?: () => void;
  copyLabel?: string;
  className?: string;
}

export const LanguageTabs: React.FC<LanguageTabsProps> = ({
  activeLang,
  onChange,
  onCopyEnToTa,
  copyLabel = 'Copy EN to TA',
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 ${className}`}>
      <div
        role="tablist"
        aria-label="Content language"
        className="inline-flex items-center p-1 rounded-xl bg-[#050d1a] border border-white/10"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeLang === 'en'}
          onClick={() => onChange('en')}
          className={`h-8 px-3.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
            activeLang === 'en'
              ? 'bg-brand-gold-500 text-brand-blue-950 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>EN · English</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeLang === 'ta'}
          onClick={() => onChange('ta')}
          className={`h-8 px-3.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
            activeLang === 'ta'
              ? 'bg-brand-gold-500 text-brand-blue-950 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>தமிழ் · Tamil</span>
        </button>
      </div>

      {onCopyEnToTa && activeLang === 'ta' && (
        <button
          type="button"
          onClick={onCopyEnToTa}
          className="h-8 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-brand-gold-300 flex items-center gap-1.5 transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0"
          title="Copy English field values into empty or existing Tamil fields as a starting template"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>{copyLabel}</span>
        </button>
      )}
    </div>
  );
};
