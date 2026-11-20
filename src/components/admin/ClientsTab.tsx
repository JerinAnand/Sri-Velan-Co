import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Building2 } from 'lucide-react';
import { FullSiteContent, ClientItem } from '../../context/SiteContentContext';
import { EditableItemList } from './EditableItemList';
import { ImageField } from './ImageField';
import {
  SectionCard,
  SectionHeader,
  FieldLabel,
  HelperText,
  inputBaseClasses,
} from './SectionCard';

interface ClientsTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
  onDirtyChange?: (dirty: boolean) => void;
  onSavingChange?: (saving: boolean) => void;
  onSaveToast?: (msg: string) => void;
}

export const ClientsTab: React.FC<ClientsTabProps> = ({
  content,
  updateSection,
  onDirtyChange,
  onSavingChange,
  onSaveToast,
}) => {
  const [clients, setClients] = useState<ClientItem[]>([...content.clients.clients]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialRef = useRef<string>(JSON.stringify(content.clients.clients));
  const clientsJson = JSON.stringify(content.clients.clients);

  useEffect(() => {
    setClients([...content.clients.clients]);
    initialRef.current = clientsJson;
  }, [clientsJson]);

  const isDirty = useMemo(() => JSON.stringify(clients) !== initialRef.current, [clients]);

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
      await updateSection('clients', { clients });
      initialRef.current = JSON.stringify(clients);
      onDirtyChange?.(false);
      setSaveSuccess(true);
      onSaveToast?.('Clients & departments saved successfully.');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving Clients section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  const createNewClient = (): ClientItem => ({
    id: `client_${Date.now()}`,
    name: 'New Government Department / Organization',
    category: 'State Infrastructure',
    logoUrl: '',
  });

  return (
    <form id="cms-active-section-form" onSubmit={handleSave} className="space-y-6">
      <SectionHeader
        title="Clients & Depts"
        description="Manage government departments, public sector authorities, client titles, and optional emblem logos."
        icon={<Building2 className="w-5 h-5" />}
        saving={saving}
        saveLabel="Save Clients"
        isDirty={isDirty}
        saveSuccess={saveSuccess ? 'Clients updated successfully.' : null}
        errorMsg={errorMsg}
      />

      <SectionCard>
        <EditableItemList<ClientItem>
          title="Client organizations"
          description="Expand a row to edit organization details or upload a department crest."
          items={clients}
          onUpdateItems={setClients}
          createNewItem={createNewClient}
          getItemTitle={(item) => item.name || 'Untitled client'}
          getItemSubtitle={(item) => item.category || 'Uncategorized'}
          addButtonText="Add New Client"
          renderItemFields={(item, idx, updateItem) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <FieldLabel htmlFor={`client-name-${idx}`} label="Client / department name" required />
                <input
                  id={`client-name-${idx}`}
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem({ ...item, name: e.target.value })}
                  className={inputBaseClasses}
                  placeholder="e.g. Greater Chennai Corporation (GCC)"
                />
              </div>

              <div>
                <FieldLabel htmlFor={`client-cat-${idx}`} label="Category / sector" />
                <input
                  id={`client-cat-${idx}`}
                  type="text"
                  value={item.category || ''}
                  onChange={(e) => updateItem({ ...item, category: e.target.value })}
                  className={inputBaseClasses}
                  placeholder="e.g. Municipal Corporation"
                />
                <HelperText>Used for grouping and display subtitles.</HelperText>
              </div>

              <div className="md:col-span-2">
                <ImageField
                  label="Department logo (optional)"
                  value={item.logoUrl || ''}
                  onChange={(url) => updateItem({ ...item, logoUrl: url })}
                  section="clients"
                  helperText="Transparent PNG or SVG logo recommended."
                />
              </div>
            </div>
          )}
        />
      </SectionCard>
    </form>
  );
};
