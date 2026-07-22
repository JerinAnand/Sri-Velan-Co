import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { FullSiteContent, StatsContent } from '../../context/SiteContentContext';

interface StatsTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
}

export const StatsTab: React.FC<StatsTabProps> = ({ content, updateSection }) => {
  const [formData, setFormData] = useState<StatsContent>({ ...content.stats });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg(null);

    try {
      await updateSection('stats', formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving Stats section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-display font-bold text-white">Stats & Metrics</h2>
          <p className="text-xs text-neutral-400">Update key performance indicators, machinery count, and experience stats.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Key Metrics'}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Stats updated successfully in Firestore real-time!
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
            Years of Experience
          </label>
          <input
            type="number"
            value={formData.yearsExperience}
            onChange={(e) => setFormData({ ...formData, yearsExperience: parseInt(e.target.value) || 0 })}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
            Projects Completed
          </label>
          <input
            type="number"
            value={formData.projectsCompleted}
            onChange={(e) => setFormData({ ...formData, projectsCompleted: parseInt(e.target.value) || 0 })}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
            Government / Enterprise Clients
          </label>
          <input
            type="number"
            value={formData.clientsServed}
            onChange={(e) => setFormData({ ...formData, clientsServed: parseInt(e.target.value) || 0 })}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
            Team Size
          </label>
          <input
            type="number"
            value={formData.teamSize}
            onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) || 0 })}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
            Dewatering Machinery Fleet Count (400+)
          </label>
          <input
            type="number"
            value={formData.dewateringFleet}
            onChange={(e) => setFormData({ ...formData, dewateringFleet: parseInt(e.target.value) || 0 })}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono text-brand-gold-400 font-bold"
          />
        </div>
      </div>
    </form>
  );
};
