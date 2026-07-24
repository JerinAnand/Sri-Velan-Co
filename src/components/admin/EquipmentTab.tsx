import React, { useState, useCallback } from 'react';
import { Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { FullSiteContent, EquipmentCategoryItem } from '../../context/SiteContentContext';
import { EditableItemList } from './EditableItemList';
import { ImageField } from './ImageField';

interface EquipmentTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
}

export const EquipmentTabComponent: React.FC<EquipmentTabProps> = ({ content, updateSection }) => {
  const [fleetIntro, setFleetIntro] = useState<string>(content.equipment?.fleetIntro || '');
  const [categories, setCategories] = useState<EquipmentCategoryItem[]>([
    ...(content.equipment?.categories || []),
  ]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(null);
    setErrorMsg(null);

    if (!categories || categories.length === 0) {
      setErrorMsg('At least one equipment category must be present.');
      setSaving(false);
      return;
    }

    const invalidIndex = categories.findIndex((cat) => !cat.name || !cat.name.trim());
    if (invalidIndex !== -1) {
      setErrorMsg(`Equipment Category #${invalidIndex + 1} requires a valid Category Name.`);
      setSaving(false);
      return;
    }

    const cleanedCategories: EquipmentCategoryItem[] = categories.map((cat) => ({
      id: cat.id || `eq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: cat.name.trim(),
      description: cat.description ? cat.description.trim() : '',
      count: Math.max(0, Number(cat.count) || 0),
      imageUrl: cat.imageUrl || '',
      specs: (cat.specs || []).map((s) => s.trim()).filter(Boolean),
    }));

    try {
      await updateSection('equipment', { fleetIntro: fleetIntro.trim(), categories: cleanedCategories });
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSaveSuccess(`Equipment fleet specifications updated successfully at ${now}!`);
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err: any) {
      console.error('Error saving Equipment section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  const createNewCategory = useCallback(
    (): EquipmentCategoryItem => ({
      id: `eq_${Date.now()}`,
      name: 'New Equipment Asset Line',
      description: 'Detailed machinery asset description...',
      count: 10,
      imageUrl: '',
      specs: ['Spec 1', 'Spec 2'],
    }),
    []
  );

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-display font-bold text-white">Equipment Fleet</h2>
          <p className="text-xs text-neutral-400">
            Manage equipment fleet intro, machinery categories, quantities, images, and technical specifications.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin text-brand-blue-950" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Fleet Content'}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          {saveSuccess}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
          Fleet Introduction Paragraph
        </label>
        <textarea
          rows={3}
          value={fleetIntro}
          onChange={(e) => setFleetIntro(e.target.value)}
          className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-xs font-mono text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all"
        />
      </div>

      <EditableItemList<EquipmentCategoryItem>
        title="Equipment Fleet Categories"
        items={categories}
        onUpdateItems={setCategories}
        createNewItem={createNewCategory}
        getItemTitle={(item) => `${item.name} (${item.count} Units)`}
        addButtonText="Add Machinery Category"
        renderItemFields={(item, idx, updateItem) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                Category Name *
              </label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem({ ...item, name: e.target.value })}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                Fleet Unit Count
              </label>
              <input
                type="number"
                value={item.count}
                onChange={(e) => updateItem({ ...item, count: parseInt(e.target.value) || 0 })}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono font-bold text-brand-gold-400"
              />
            </div>

            <div className="md:col-span-2">
              <ImageField
                label="Category Photo"
                value={item.imageUrl}
                onChange={(url) => updateItem({ ...item, imageUrl: url })}
                section="equipment"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={item.description}
                onChange={(e) => updateItem({ ...item, description: e.target.value })}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                Technical Specifications (comma separated)
              </label>
              <input
                type="text"
                value={(item.specs || []).join(', ')}
                onChange={(e) =>
                  updateItem({
                    ...item,
                    specs: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
                placeholder="Head: 45m, Flow: 5000 LPM, Engine: Kirloskar Diesel"
              />
            </div>
          </div>
        )}
      />
    </form>
  );
};

export const EquipmentTab = React.memo(EquipmentTabComponent);

