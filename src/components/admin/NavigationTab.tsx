import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Menu } from 'lucide-react';
import { FullSiteContent, NavigationContent, MenuItem } from '../../context/SiteContentContext';
import { EditableItemList } from './EditableItemList';
import { ImageField } from './ImageField';
import {
  SectionCard,
  SectionHeader,
  FieldLabel,
  HelperText,
  inputBaseClasses,
} from './SectionCard';

interface NavigationTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
  onDirtyChange?: (dirty: boolean) => void;
  onSavingChange?: (saving: boolean) => void;
  onSaveToast?: (msg: string) => void;
}

export const NavigationTab: React.FC<NavigationTabProps> = ({
  content,
  updateSection,
  onDirtyChange,
  onSavingChange,
  onSaveToast,
}) => {
  const [formData, setFormData] = useState<NavigationContent>({
    ...content.navigation,
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialRef = useRef<string>(JSON.stringify(content.navigation));
  const navJson = JSON.stringify(content.navigation);

  useEffect(() => {
    setFormData({ ...content.navigation });
    initialRef.current = navJson;
  }, [navJson]);

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
      await updateSection('navigation', formData);
      initialRef.current = JSON.stringify(formData);
      onDirtyChange?.(false);
      setSaveSuccess(true);
      onSaveToast?.('Navigation bar updated successfully.');
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
    <form id="cms-active-section-form" onSubmit={handleSave} className="space-y-6">
      <SectionHeader
        title="Navigation Bar"
        description="Manage header logo image, menu items, English/Tamil labels, and target routing paths."
        icon={<Menu className="w-5 h-5" />}
        saving={saving}
        saveLabel="Save Navigation"
        isDirty={isDirty}
        saveSuccess={saveSuccess ? 'Navigation menu updated and synced live.' : null}
        errorMsg={errorMsg}
      />

      <SectionCard
        title="Header branding"
        description="Customize the brand logo shown on the top-left of the public navigation bar."
      >
        <ImageField
          label="Header company logo image (optional)"
          value={formData.logoUrl || ''}
          onChange={(url) => setFormData({ ...formData, logoUrl: url })}
          section="navigation"
          helperText="Upload a crisp PNG or SVG logo. Leave empty to display the default company emblem."
        />
      </SectionCard>

      <SectionCard
        title="Navigation menu links"
        description="Reorder, add, or edit top-level navigation links across English and Tamil views."
      >
        <EditableItemList<MenuItem>
          title="Menu items"
          items={formData.menuItems || []}
          onUpdateItems={(items) =>
            setFormData({
              ...formData,
              menuItems: items.map((item, idx) => ({ ...item, order: idx + 1 })),
            })
          }
          createNewItem={createNewMenuItem}
          getItemTitle={(item) => item.labelEn || 'Untitled Link'}
          getItemSubtitle={(item) => `${item.labelTa || '—'} · ${item.path || '/'}`}
          addButtonText="Add navigation link"
          emptyStateText="Add links so visitors can navigate between public pages."
          renderItemFields={(item, idx, updateItem) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor={`nav-en-${idx}`} label="English label" required />
                <input
                  id={`nav-en-${idx}`}
                  type="text"
                  value={item.labelEn}
                  onChange={(e) => updateItem({ ...item, labelEn: e.target.value })}
                  className={inputBaseClasses}
                  placeholder="e.g. Services"
                />
              </div>

              <div>
                <FieldLabel htmlFor={`nav-ta-${idx}`} label="Tamil label (தமிழ்)" required />
                <input
                  id={`nav-ta-${idx}`}
                  type="text"
                  value={item.labelTa}
                  onChange={(e) => updateItem({ ...item, labelTa: e.target.value })}
                  className={inputBaseClasses}
                  placeholder="எ.கா. சேவைகள்"
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel htmlFor={`nav-path-${idx}`} label="Route path" required />
                <input
                  id={`nav-path-${idx}`}
                  type="text"
                  value={item.path}
                  onChange={(e) => updateItem({ ...item, path: e.target.value })}
                  className={`${inputBaseClasses} font-mono text-emerald-300`}
                  placeholder="/services, /about, /projects, /contact"
                />
                <HelperText>
                  Internal route path starting with a slash (for example: <code className="font-mono text-slate-300">/services</code> or <code className="font-mono text-slate-300">/hydraulic-broomer</code>).
                </HelperText>
              </div>
            </div>
          )}
        />
      </SectionCard>
    </form>
  );
};
