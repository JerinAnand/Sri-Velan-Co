import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Wrench } from 'lucide-react';
import { FullSiteContent, HydraulicBroomerContent, HydraulicBroomerSpec } from '../../context/SiteContentContext';
import { EditableItemList } from './EditableItemList';
import { ImageField } from './ImageField';

interface HydraulicBroomerTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
}

export const HydraulicBroomerTab: React.FC<HydraulicBroomerTabProps> = ({ content, updateSection }) => {
  const [formData, setFormData] = useState<HydraulicBroomerContent>({
    ...content.hydraulicBroomer,
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg(null);

    try {
      await updateSection('hydraulicBroomer', formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving Hydraulic Broomer section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  const createNewSpec = (): HydraulicBroomerSpec & { id: string } => ({
    id: `spec_${Date.now()}`,
    label: 'Specification Label',
    value: 'Specification Value',
  });

  // Wrap specs with temporary id if needed for EditableItemList
  const specsWithId = (formData.specs || []).map((s, idx) => ({
    id: (s as any).id || `spec_${idx}`,
    label: s.label,
    value: s.value,
  }));

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-brand-gold-400" />
            Hydraulic Broomer Machine Page
          </h2>
          <p className="text-xs text-neutral-400">Manage title, description, technical specification table, product photo, and video demo URL.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Hydraulic Broomer'}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Hydraulic Broomer section updated successfully in Firestore real-time!
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
            Page Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
            Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
          />
        </div>

        <ImageField
          label="Broomer Machine Main Image"
          value={formData.imageUrl}
          onChange={(url) => setFormData({ ...formData, imageUrl: url })}
          section="broomer"
        />

        <div>
          <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
            Product Video Demo Link (YouTube / MP4 URL)
          </label>
          <input
            type="text"
            value={formData.videoUrl || ''}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
            placeholder="https://www.youtube.com/embed/..."
          />
        </div>
      </div>

      <EditableItemList<HydraulicBroomerSpec & { id: string }>
        title="Technical Specifications Matrix"
        items={specsWithId}
        onUpdateItems={(updated) =>
          setFormData({
            ...formData,
            specs: updated.map(({ label, value }) => ({ label, value })),
          })
        }
        createNewItem={createNewSpec}
        getItemTitle={(item) => `${item.label}: ${item.value}`}
        addButtonText="Add Specification Row"
        renderItemFields={(item, idx, updateItem) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                Specification Name
              </label>
              <input
                type="text"
                value={item.label}
                onChange={(e) => updateItem({ ...item, label: e.target.value })}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                Specification Value
              </label>
              <input
                type="text"
                value={item.value}
                onChange={(e) => updateItem({ ...item, value: e.target.value })}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono text-brand-gold-400 font-bold"
              />
            </div>
          </div>
        )}
      />
    </form>
  );
};
