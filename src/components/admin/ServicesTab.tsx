import React, { useState, useCallback } from 'react';
import { Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { FullSiteContent, ServiceItem } from '../../context/SiteContentContext';
import { EditableItemList } from './EditableItemList';
import { ImageField } from './ImageField';

interface ServicesTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
}

export const ServicesTabComponent: React.FC<ServicesTabProps> = ({ content, updateSection }) => {
  const [services, setServices] = useState<ServiceItem[]>([...(content.services?.services || [])]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(null);
    setErrorMsg(null);

    // Schema Validation for Chennai Services Section
    if (!services || services.length === 0) {
      setErrorMsg('At least one service card must be present.');
      setSaving(false);
      return;
    }

    const invalidIndex = services.findIndex(
      (svc) => !svc.title || !svc.title.trim() || !svc.description || !svc.description.trim()
    );

    if (invalidIndex !== -1) {
      setErrorMsg(`Service Item #${invalidIndex + 1} requires both a Title and a Description.`);
      setSaving(false);
      return;
    }

    // Cleaned payload compliant with Firestore schema
    const cleanedServices: ServiceItem[] = services.map((svc) => ({
      id: svc.id || `service_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: svc.title.trim(),
      description: svc.description.trim(),
      badge: svc.badge ? svc.badge.trim() : 'Certified Capability',
      highlights: (svc.highlights || []).map((h) => h.trim()).filter(Boolean),
      image: svc.image || svc.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&q=80',
      imageUrl: svc.image || svc.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&q=80',
    }));

    try {
      await updateSection('services', { services: cleanedServices });
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSaveSuccess(`Chennai Operations & Services updated successfully at ${now}!`);
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err: any) {
      console.error('Error saving Services section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  const createNewService = useCallback(
    (): ServiceItem => ({
      id: `service_${Date.now()}`,
      title: 'New Dewatering Service',
      description: 'High discharge emergency dewatering service details...',
      badge: 'Certified Capability',
      highlights: ['High capacity output', '24/7 technical crew'],
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&q=80',
    }),
    []
  );

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-display font-bold text-white">Chennai Operations & Services Section</h2>
          <p className="text-xs text-neutral-400">
            Manage Chennai region dewatering services, emergency response cards, titles, descriptions, highlights, and execution photos.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin text-brand-blue-950" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Services'}
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

      <EditableItemList<ServiceItem>
        title="Services List"
        items={services}
        onUpdateItems={setServices}
        createNewItem={createNewService}
        getItemTitle={(item) => item.title || 'Untitled Service'}
        addButtonText="Add New Service"
        renderItemFields={(item, idx, updateItem) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                Service Title *
              </label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem({ ...item, title: e.target.value })}
                placeholder="e.g. Submersible Dewatering & Flood Drainage"
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                Badge / Accreditation
              </label>
              <input
                type="text"
                value={item.badge || ''}
                onChange={(e) => updateItem({ ...item, badge: e.target.value })}
                placeholder="e.g. Certified Capability"
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <ImageField
                label="Service Photo"
                value={item.image || item.imageUrl || ''}
                onChange={(url) => updateItem({ ...item, image: url, imageUrl: url })}
                section="services"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                Full Description *
              </label>
              <textarea
                rows={3}
                value={item.description}
                onChange={(e) => updateItem({ ...item, description: e.target.value })}
                placeholder="Comprehensive description of dewatering service..."
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                Key Highlights (comma separated)
              </label>
              <input
                type="text"
                value={(item.highlights || []).join(', ')}
                onChange={(e) =>
                  updateItem({
                    ...item,
                    highlights: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
                placeholder="Feature 1, Feature 2, Feature 3"
              />
            </div>
          </div>
        )}
      />
    </form>
  );
};

export const ServicesTab = React.memo(ServicesTabComponent);

