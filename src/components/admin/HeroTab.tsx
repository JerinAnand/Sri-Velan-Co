import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { FullSiteContent, HeroContent } from '../../context/SiteContentContext';

interface HeroTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
}

export const HeroTab: React.FC<HeroTabProps> = ({ content, updateSection }) => {
  const [formData, setFormData] = useState<HeroContent>({ ...content.hero });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg(null);

    try {
      await updateSection('hero', formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving Hero section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-display font-bold text-white">Hero Section</h2>
          <p className="text-xs text-neutral-400">Configure homepage primary hero title, subtitle, tagline, and badge.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Hero Content'}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Hero section updated successfully in Firestore real-time!
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
            Hero Badge / Accreditation Tag
          </label>
          <input
            type="text"
            value={formData.badge}
            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
            placeholder="e.g. State PWD & WRD Empaneled"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
            Primary Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
            placeholder="e.g. Precision Civil Engineering & Heavy Dewatering Solutions"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
            Subtitle
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
            placeholder="e.g. Government Accredited Class-I Contractor"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
            Tagline / Full Description
          </label>
          <textarea
            rows={4}
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
            placeholder="Detailed hero description paragraph..."
          />
        </div>
      </div>
    </form>
  );
};
