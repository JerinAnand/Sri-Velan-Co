import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Globe } from 'lucide-react';
import { FullSiteContent } from '../../context/SiteContentContext';

interface TranslationsTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
}

export const TranslationsTab: React.FC<TranslationsTabProps> = ({ content, updateSection }) => {
  const [activeLang, setActiveLang] = useState<'en' | 'ta'>('en');
  const [translations, setTranslations] = useState<Record<string, any>>({ ...content.translations });
  const [jsonText, setJsonText] = useState<string>(
    JSON.stringify(content.translations[activeLang] || {}, null, 2)
  );
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSwitchLang = (lang: 'en' | 'ta') => {
    setActiveLang(lang);
    setJsonText(JSON.stringify(translations[lang] || {}, null, 2));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg(null);

    try {
      const parsed = JSON.parse(jsonText);
      const updatedTranslations = {
        ...translations,
        [activeLang]: parsed,
      };

      await updateSection('translations', updatedTranslations);
      setTranslations(updatedTranslations);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving Translations section:', err);
      setErrorMsg(err.message || 'Invalid JSON format or update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-gold-400" />
            Language Translations Editor
          </h2>
          <p className="text-xs text-neutral-400">Edit English & Tamil dictionaries in real-time JSON format.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-neutral-900 border border-white/10 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => handleSwitchLang('en')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                activeLang === 'en'
                  ? 'bg-brand-gold-500 text-brand-blue-950 font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              English (EN)
            </button>
            <button
              type="button"
              onClick={() => handleSwitchLang('ta')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                activeLang === 'ta'
                  ? 'bg-brand-gold-500 text-brand-blue-950 font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Tamil (தமிழ்)
            </button>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : `Save ${activeLang.toUpperCase()} Dictionary`}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Translation dictionary updated successfully in Firestore real-time!
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
          {activeLang === 'en' ? 'English (EN)' : 'Tamil (தமிழ்)'} Translation JSON Object
        </label>
        <textarea
          rows={18}
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          className="w-full bg-neutral-950 border border-white/10 rounded-xl p-4 text-xs font-mono text-emerald-400 focus:outline-none focus:border-brand-gold-500/80 transition-all leading-relaxed"
          spellCheck={false}
        />
      </div>
    </form>
  );
};
