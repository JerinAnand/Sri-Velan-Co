import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { FullSiteContent, AboutContent } from '../../context/SiteContentContext';

interface AboutTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
}

export const AboutTab: React.FC<AboutTabProps> = ({ content, updateSection }) => {
  const [formData, setFormData] = useState<AboutContent>({ ...content.about });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg(null);

    try {
      await updateSection('about', formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving About section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-display font-bold text-white">About Section</h2>
          <p className="text-xs text-neutral-400">Manage company history, founder details, mission, and vision statements.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save About Content'}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          About section updated successfully in Firestore real-time!
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
            Year Established
          </label>
          <input
            type="number"
            value={formData.yearEstablished}
            onChange={(e) => setFormData({ ...formData, yearEstablished: parseInt(e.target.value) || 2006 })}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
            Founder Name
          </label>
          <input
            type="text"
            value={formData.founderName}
            onChange={(e) => setFormData({ ...formData, founderName: e.target.value })}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
            Civil Contractor Tag / Badge Text
          </label>
          <input
            type="text"
            value={formData.civilContractorText}
            onChange={(e) => setFormData({ ...formData, civilContractorText: e.target.value })}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
            Company Incorporation & History Text
          </label>
          <textarea
            rows={4}
            value={formData.companyDescription}
            onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
          />
        </div>

        <div className="md:col-span-2 space-y-4 pt-2 border-t border-white/10">
          <h3 className="text-xs font-mono font-bold text-brand-gold-400 uppercase tracking-wider">Mission Statement</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
                English Mission Statement
              </label>
              <textarea
                rows={3}
                value={formData.missionText || ''}
                onChange={(e) => setFormData({ ...formData, missionText: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
                Tamil Mission Statement (தமிழ் நோக்கம்)
              </label>
              <textarea
                rows={3}
                value={formData.missionTextTa || ''}
                onChange={(e) => setFormData({ ...formData, missionTextTa: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
                placeholder="தமிழ் நோக்கம்..."
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4 pt-2 border-t border-white/10">
          <h3 className="text-xs font-mono font-bold text-brand-gold-400 uppercase tracking-wider">Vision Statement</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
                English Vision Statement
              </label>
              <textarea
                rows={3}
                value={formData.visionText || ''}
                onChange={(e) => setFormData({ ...formData, visionText: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
                Tamil Vision Statement (தமிழ் தொலைநோக்கு பார்வை)
              </label>
              <textarea
                rows={3}
                value={formData.visionTextTa || ''}
                onChange={(e) => setFormData({ ...formData, visionTextTa: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
                placeholder="தமிழ் தொலைநோக்கு பார்வை..."
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
