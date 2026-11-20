import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Truck } from 'lucide-react';
import { FullSiteContent, EquipmentCategoryItem } from '../../context/SiteContentContext';
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

interface EquipmentTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
  onDirtyChange?: (dirty: boolean) => void;
  onSavingChange?: (saving: boolean) => void;
  onSaveToast?: (msg: string) => void;
}

export const EquipmentTabComponent: React.FC<EquipmentTabProps> = ({
  content,
  updateSection,
  onDirtyChange,
  onSavingChange,
  onSaveToast,
}) => {
  const [fleetIntro, setFleetIntro] = useState<string>(content.equipment?.fleetIntro || '');
  const [categories, setCategories] = useState<EquipmentCategoryItem[]>([
    ...(content.equipment?.categories || []),
  ]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialRef = useRef<string>(
    JSON.stringify({
      fleetIntro: content.equipment?.fleetIntro || '',
      categories: content.equipment?.categories || [],
    })
  );
  const equipmentJson = JSON.stringify(content.equipment);

  useEffect(() => {
    setFleetIntro(content.equipment?.fleetIntro || '');
    setCategories([...(content.equipment?.categories || [])]);
    initialRef.current = JSON.stringify({
      fleetIntro: content.equipment?.fleetIntro || '',
      categories: content.equipment?.categories || [],
    });
  }, [equipmentJson]);

  const isDirty = useMemo(
    () => JSON.stringify({ fleetIntro, categories }) !== initialRef.current,
    [fleetIntro, categories]
  );

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
      const payload = { fleetIntro: fleetIntro.trim(), categories: cleanedCategories };
      await updateSection('equipment', payload);
      initialRef.current = JSON.stringify(payload);
      onDirtyChange?.(false);
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSaveSuccess(`Equipment fleet specifications updated at ${now}.`);
      onSaveToast?.('Equipment fleet saved successfully.');
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
    <form id="cms-active-section-form" onSubmit={handleSave} className="space-y-6">
      <SectionHeader
        title="Equipment Fleet"
        description="Manage the equipment fleet introduction, machinery categories, unit counts, photos, and technical specifications."
        icon={<Truck className="w-5 h-5" />}
        saving={saving}
        saveLabel="Save Fleet Content"
        isDirty={isDirty}
        saveSuccess={saveSuccess}
        errorMsg={errorMsg}
      />

      <SectionCard
        title="Fleet overview"
        description="Introductory paragraph shown at the top of the Equipment Fleet page."
      >
        <div>
          <FieldLabel
            htmlFor="fleet-intro"
            label="Fleet introduction paragraph"
            rightSlot={<CharacterCounter value={fleetIntro} recommendedMax={360} />}
          />
          <textarea
            id="fleet-intro"
            rows={3}
            value={fleetIntro}
            onChange={(e) => setFleetIntro(e.target.value)}
            className={textareaBaseClasses}
            placeholder="Describe Sri Velan & Co's heavy dewatering pumps, earthmovers, and emergency dispatch fleet..."
          />
        </div>
      </SectionCard>

      <SectionCard>
        <EditableItemList<EquipmentCategoryItem>
          title="Equipment fleet categories"
          description="Expand a category to edit unit counts, photography, and comma-separated specs."
          items={categories}
          onUpdateItems={setCategories}
          createNewItem={createNewCategory}
          getItemTitle={(item) => item.name || 'Untitled category'}
          getItemSubtitle={(item) => `${item.count ?? 0} units`}
          addButtonText="Add Machinery Category"
          renderItemFields={(item, idx, updateItem) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <FieldLabel htmlFor={`eq-name-${idx}`} label="Category name" required />
                <input
                  id={`eq-name-${idx}`}
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem({ ...item, name: e.target.value })}
                  className={inputBaseClasses}
                  placeholder="e.g. Tractor-Driven Dewatering Pumps"
                />
              </div>

              <div>
                <FieldLabel htmlFor={`eq-count-${idx}`} label="Fleet unit count" />
                <input
                  id={`eq-count-${idx}`}
                  type="number"
                  min={0}
                  value={item.count}
                  onChange={(e) => updateItem({ ...item, count: parseInt(e.target.value, 10) || 0 })}
                  className={`${inputBaseClasses} tabular-nums text-brand-gold-300 font-semibold`}
                  placeholder="10"
                />
              </div>

              <div className="md:col-span-2">
                <ImageField
                  label="Category photo"
                  value={item.imageUrl}
                  onChange={(url) => updateItem({ ...item, imageUrl: url })}
                  section="equipment"
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel
                  htmlFor={`eq-desc-${idx}`}
                  label="Description"
                  rightSlot={<CharacterCounter value={item.description || ''} recommendedMax={280} />}
                />
                <textarea
                  id={`eq-desc-${idx}`}
                  rows={2}
                  value={item.description}
                  onChange={(e) => updateItem({ ...item, description: e.target.value })}
                  className={textareaBaseClasses}
                  placeholder="Operational applications and deployment capacity..."
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel htmlFor={`eq-specs-${idx}`} label="Technical specifications" />
                <input
                  id={`eq-specs-${idx}`}
                  type="text"
                  value={(item.specs || []).join(', ')}
                  onChange={(e) =>
                    updateItem({
                      ...item,
                      specs: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className={inputBaseClasses}
                  placeholder="Head: 45m, Flow: 5000 LPM, Engine: Kirloskar Diesel"
                />
                <HelperText>Separate each specification with a comma (e.g. Head: 45m, Flow: 5000 LPM).</HelperText>
              </div>
            </div>
          )}
        />
      </SectionCard>
    </form>
  );
};

export const EquipmentTab = React.memo(EquipmentTabComponent);
