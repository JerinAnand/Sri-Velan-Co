import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Menu } from 'lucide-react';
import { FullSiteContent, NavigationContent, MenuItem } from '../../context/SiteContentContext';
import { EditableItemList } from './EditableItemList';
import { ImageField } from './ImageField';

interface NavigationTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
}

export const NavigationTab: React.FC<NavigationTabProps> = ({ content, updateSection }) => {
  const [formData, setFormData] = useState<NavigationContent>({
    ...content.navigation,
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
      await updateSection('navigation', formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving Navigation section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  const createNewMenuItem = (): MenuItem => ({
    id: `nav_${Date.now()}`,
    labelEn: 'New Page Link',
    labelTa: 'புதிய பக்கம்',
    path: '/new-page',
    order: (formData.menuItems || []).length + 1,
  });

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <Menu className="w-5 h-5 text-brand-gold-400" />
            Navigation Bar & Header Logo
          </h2>
          <p className="text-xs text-neutral-400">Manage header logo image, menu items, English/Tamil labels, and target routing paths.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Navigation Menu'}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Navigation menu updated successfully in Firestore real-time!
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <ImageField
        label="Header Company Logo Image (Optional custom logo)"
        value={formData.logoUrl || ''}
        onChange={(url) => setFormData({ ...formData, logoUrl: url })}
        section="navigation"
      />

      <EditableItemList<MenuItem>
        title="Navigation Menu Bar Links"
        items={formData.menuItems || []}
        onUpdateItems={(items) =>
          setFormData({
            ...formData,
            menuItems: items.map((item, idx) => ({ ...item, order: idx + 1 })),
          })
        }
        createNewItem={createNewMenuItem}
        getItemTitle={(item) => `${item.labelEn} (${item.labelTa}) -> ${item.path}`}
        addButtonText="Add Navigation Link"
        renderItemFields={(item, idx, updateItem) => (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                English Label
              </label>
              <input
                type="text"
                value={item.labelEn}
                onChange={(e) => updateItem({ ...item, labelEn: e.target.value })}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                Tamil Label (தமிழ்)
              </label>
              <input
                type="text"
                value={item.labelTa}
                onChange={(e) => updateItem({ ...item, labelTa: e.target.value })}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                Route Path
              </label>
              <input
                type="text"
                value={item.path}
                onChange={(e) => updateItem({ ...item, path: e.target.value })}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono text-emerald-400"
                placeholder="/services, /about, etc."
              />
            </div>
          </div>
        )}
      />
    </form>
  );
};
