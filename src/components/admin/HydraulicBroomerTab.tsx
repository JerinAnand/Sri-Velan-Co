import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Wrench } from 'lucide-react';
import {
  FullSiteContent,
  HydraulicBroomerContent,
  HydraulicBroomerSpec,
} from '../../context/SiteContentContext';
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

interface HydraulicBroomerTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
  onDirtyChange?: (dirty: boolean) => void;
  onSavingChange?: (saving: boolean) => void;
  onSaveToast?: (msg: string) => void;
}

export const HydraulicBroomerTab: React.FC<HydraulicBroomerTabProps> = ({
  content,
  updateSection,
  onDirtyChange,
  onSavingChange,
  onSaveToast,
}) => {
  const [formData, setFormData] = useState<HydraulicBroomerContent>({
    ...content.hydraulicBroomer,
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialRef = useRef<string>(JSON.stringify(content.hydraulicBroomer));
  const broomerJson = JSON.stringify(content.hydraulicBroomer);

  useEffect(() => {
    setFormData({ ...content.hydraulicBroomer });
    initialRef.current = broomerJson;
  }, [broomerJson]);

  const isDirty = useMemo(() => JSON.stringify(formData) !== initialRef.current, [formData]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    onSavingChange?.(saving);
  }, [saving, onSavingChange]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg(null);

    try {
      await updateSection('hydraulicBroomer', formData);
      initialRef.current = JSON.stringify(formData);
      onDirtyChange?.(false);
      setSaveSuccess(true);
      onSaveToast?.('Hydraulic broomer page saved successfully.');
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

  const specsWithId = useMemo(
    () =>
      (formData.specs || []).map((s, idx) => ({
        id: (s as any).id || `spec_${idx}`,
        label: s.label,
        value: s.value,
      })),
    [formData.specs]
  );

  return (
    <form id="cms-active-section-form" onSubmit={handleSave} className="space-y-6">
      <SectionHeader
        title="Hydraulic Broomer"
        description="Manage machine overview, technical specification table, product photography, and video demo URL."
        icon={<Wrench className="w-5 h-5" />}
        saving={saving}
        saveLabel="Save Hydraulic Broomer"
        isDirty={isDirty}
        saveSuccess={saveSuccess ? 'Hydraulic broomer updated successfully.' : null}
        errorMsg={errorMsg}
      />

      <SectionCard
        title="Machine overview & media"
        description="Headline, catalog summary, product photograph, and optional video demo."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <FieldLabel htmlFor="broomer-title" label="Page title" />
            <input
              id="broomer-title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={inputBaseClasses}
              placeholder="e.g. Tractor-Mounted Hydraulic Road Broomer"
            />
          </div>

          <div>
            <FieldLabel htmlFor="broomer-video" label="Product video demo URL" />
            <input
              id="broomer-video"
              type="text"
              value={formData.videoUrl || ''}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className={`${inputBaseClasses} font-mono text-xs`}
              placeholder="https://www.youtube.com/embed/..."
            />
            <HelperText>Accepts a YouTube embed URL or direct MP4 stream link.</HelperText>
          </div>

          <div className="md:col-span-2">
            <FieldLabel
              htmlFor="broomer-desc"
              label="Description"
              rightSlot={<CharacterCounter value={formData.description || ''} recommendedMax={380} />}
            />
            <textarea
              id="broomer-desc"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={textareaBaseClasses}
              placeholder="Describe sweeping width, hydraulic drive assembly, and road maintenance applications..."
            />
          </div>

          <div className="md:col-span-2">
            <ImageField
              label="Broomer machine main image"
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              section="broomer"
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <EditableItemList<HydraulicBroomerSpec & { id: string }>
          title="Technical specifications matrix"
          description="Key-value rows rendered in the specification table."
          items={specsWithId}
          onUpdateItems={(updated) =>
            setFormData({
              ...formData,
              specs: updated.map(({ label, value }) => ({ label, value })),
            })
          }
          createNewItem={createNewSpec}
          getItemTitle={(item) => item.label || 'Specification'}
          getItemSubtitle={(item) => item.value}
          addButtonText="Add Specification Row"
          renderItemFields={(item, idx, updateItem) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <FieldLabel htmlFor={`spec-name-${idx}`} label="Specification name" />
                <input
                  id={`spec-name-${idx}`}
                  type="text"
                  value={item.label}
                  onChange={(e) => updateItem({ ...item, label: e.target.value })}
                  className={inputBaseClasses}
                  placeholder="e.g. Sweeping Width"
                />
              </div>

              <div>
                <FieldLabel htmlFor={`spec-val-${idx}`} label="Specification value" />
                <input
                  id={`spec-val-${idx}`}
                  type="text"
                  value={item.value}
                  onChange={(e) => updateItem({ ...item, value: e.target.value })}
                  className={`${inputBaseClasses} text-brand-gold-300 font-semibold`}
                  placeholder="e.g. 2100 mm (7 Feet)"
                />
              </div>
            </div>
          )}
        />
      </SectionCard>
    </form>
  );
};
