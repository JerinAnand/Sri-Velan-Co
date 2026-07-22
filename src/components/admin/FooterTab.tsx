import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { FullSiteContent, FooterContent } from '../../context/SiteContentContext';

interface FooterTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
}

export const FooterTab: React.FC<FooterTabProps> = ({ content, updateSection }) => {
  const [formData, setFormData] = useState<FooterContent>({ ...content.footer });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg(null);

    try {
      await updateSection('footer', formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving Footer section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-display font-bold text-white">Footer Content</h2>
          <p className="text-xs text-neutral-400">Manage footer description, copyright line, social media links, and brochure download URLs.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Footer'}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Footer content updated successfully in Firestore real-time!
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
            Footer Summary Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
            Copyright Notice Line
          </label>
          <input
            type="text"
            value={formData.copyright}
            onChange={(e) => setFormData({ ...formData, copyright: e.target.value })}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
            Instagram URL
          </label>
          <input
            type="text"
            value={formData.instagramUrl}
            onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
            Corporate Brochure Link / PDF URL
          </label>
          <input
            type="text"
            value={formData.brochureUrl}
            onChange={(e) => setFormData({ ...formData, brochureUrl: e.target.value })}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
          />
        </div>
      </div>
    </form>
  );
};
