import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Compass } from 'lucide-react';
import { FullSiteContent, ServiceItem } from '../../context/SiteContentContext';
import { EditableItemList } from './EditableItemList';
import { ImageField } from './ImageField';
import {
  SectionCard,
  SectionHeader,
  FieldLabel,
  CharacterCounter,
  HelperText,
  inputBaseClasses,
  textareaBaseClasses,
} from './SectionCard';

interface ServicesTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
  onDirtyChange?: (dirty: boolean) => void;
  onSavingChange?: (saving: boolean) => void;
  onSaveToast?: (msg: string) => void;
}

export const ServicesTabComponent: React.FC<ServicesTabProps> = ({
  content,
  updateSection,
  onDirtyChange,
  onSavingChange,
  onSaveToast,
}) => {
  const [services, setServices] = useState<ServiceItem[]>([...(content.services?.services || [])]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialRef = useRef<string>(JSON.stringify(content.services?.services || []));
  const servicesJson = JSON.stringify(content.services?.services);

  useEffect(() => {
    const next = [...(content.services?.services || [])];
    setServices(next);
    initialRef.current = JSON.stringify(next);
  }, [servicesJson]);

  const isDirty = useMemo(() => JSON.stringify(services) !== initialRef.current, [services]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    onSavingChange?.(saving);
  }, [saving, onSavingChange]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(null);
    setErrorMsg(null);

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
      initialRef.current = JSON.stringify(cleanedServices);
      onDirtyChange?.(false);
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSaveSuccess(`Projects Page – Services Dashboard updated at ${now}.`);
      onSaveToast?.('Services dashboard saved successfully.');
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
    <form id="cms-active-section-form" onSubmit={handleSave} className="space-y-6">
      <SectionHeader
        title="Projects Page – Services Dashboard"
        description="Manage dewatering service cards, accreditation badges, highlights, and execution photography."
        icon={<Compass className="w-5 h-5" />}
        saving={saving}
        saveLabel="Save Services"
        isDirty={isDirty}
        saveSuccess={saveSuccess}
        errorMsg={errorMsg}
      />

      <SectionCard>
        <EditableItemList<ServiceItem>
          title="Services list"
          description="Only one service card is expanded at a time. Drag-free reorder buttons move cards up or down."
          items={services}
          onUpdateItems={setServices}
          createNewItem={createNewService}
          getItemTitle={(item) => item.title || 'Untitled service'}
          getItemSubtitle={(item) => item.badge || 'Certified Capability'}
          addButtonText="Add New Service"
          renderItemFields={(item, idx, updateItem) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <FieldLabel htmlFor={`svc-title-${idx}`} label="Service title" required />
                <input
                  id={`svc-title-${idx}`}
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem({ ...item, title: e.target.value })}
                  placeholder="e.g. Submersible Dewatering & Flood Drainage"
                  className={inputBaseClasses}
                />
              </div>

              <div>
                <FieldLabel htmlFor={`svc-badge-${idx}`} label="Badge / accreditation" />
                <input
                  id={`svc-badge-${idx}`}
                  type="text"
                  value={item.badge || ''}
                  onChange={(e) => updateItem({ ...item, badge: e.target.value })}
                  placeholder="e.g. Certified Capability"
                  className={inputBaseClasses}
                />
              </div>

              <div className="md:col-span-2">
                <ImageField
                  label="Service photo"
                  value={item.image || item.imageUrl || ''}
                  onChange={(url) => updateItem({ ...item, image: url, imageUrl: url })}
                  section="services"
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel
                  htmlFor={`svc-desc-${idx}`}
                  label="Full description"
                  required
                  rightSlot={<CharacterCounter value={item.description || ''} recommendedMax={320} />}
                />
                <textarea
                  id={`svc-desc-${idx}`}
                  rows={3}
                  value={item.description}
                  onChange={(e) => updateItem({ ...item, description: e.target.value })}
                  placeholder="Comprehensive description of dewatering service..."
                  className={textareaBaseClasses}
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel htmlFor={`svc-highlights-${idx}`} label="Key highlights" />
                <input
                  id={`svc-highlights-${idx}`}
                  type="text"
                  value={(item.highlights || []).join(', ')}
                  onChange={(e) =>
                    updateItem({
                      ...item,
                      highlights: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className={inputBaseClasses}
                  placeholder="High capacity output, 24/7 technical crew, Rapid deployment"
                />
                <HelperText>Separate bullet highlights with commas (e.g. High capacity output, 24/7 technical crew).</HelperText>
              </div>
            </div>
          )}
        />
      </SectionCard>
    </form>
  );
};

export const ServicesTab = React.memo(ServicesTabComponent);
