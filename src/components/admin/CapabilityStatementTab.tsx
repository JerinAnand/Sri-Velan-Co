import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FileText } from 'lucide-react';
import {
  FullSiteContent,
  CapabilityStatementContent,
  CertificationItem,
} from '../../context/SiteContentContext';
import { EditableItemList } from './EditableItemList';
import {
  SectionCard,
  SectionHeader,
  FieldLabel,
  CharacterCounter,
  HelperText,
  inputBaseClasses,
  textareaBaseClasses,
} from './SectionCard';

interface CapabilityStatementTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
  onDirtyChange?: (dirty: boolean) => void;
  onSavingChange?: (saving: boolean) => void;
  onSaveToast?: (msg: string) => void;
}

export const CapabilityStatementTab: React.FC<CapabilityStatementTabProps> = ({
  content,
  updateSection,
  onDirtyChange,
  onSavingChange,
  onSaveToast,
}) => {
  const [formData, setFormData] = useState<CapabilityStatementContent>({
    ...content.capabilityStatement,
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialRef = useRef<string>(JSON.stringify(content.capabilityStatement));
  const capJson = JSON.stringify(content.capabilityStatement);

  useEffect(() => {
    setFormData({ ...content.capabilityStatement });
    initialRef.current = capJson;
  }, [capJson]);

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
      await updateSection('capabilityStatement', formData);
      initialRef.current = JSON.stringify(formData);
      onDirtyChange?.(false);
      setSaveSuccess(true);
      onSaveToast?.('Capability statement saved successfully.');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving Capability Statement section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  const createNewCert = (): CertificationItem => ({
    id: `cert_${Date.now()}`,
    name: 'Government Accreditation Certificate',
    issuer: 'Public Works Department (PWD)',
    year: '2024',
  });

  return (
    <form id="cms-active-section-form" onSubmit={handleSave} className="space-y-6">
      <SectionHeader
        title="Capability Statement"
        description="Manage capability document headline, executive summary, certifications, and optional PDF download link."
        icon={<FileText className="w-5 h-5" />}
        saving={saving}
        saveLabel="Save Capability Statement"
        isDirty={isDirty}
        saveSuccess={saveSuccess ? 'Capability statement updated successfully.' : null}
        errorMsg={errorMsg}
      />

      <SectionCard
        title="Document overview"
        description="Headline, summary text, and optional direct PDF override URL."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <FieldLabel htmlFor="cap-headline" label="Document headline" />
            <input
              id="cap-headline"
              type="text"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              className={inputBaseClasses}
              placeholder="e.g. Corporate Civil Engineering & Dewatering Capability"
            />
          </div>

          <div>
            <FieldLabel htmlFor="cap-download" label="Direct download PDF link (optional)" />
            <input
              id="cap-download"
              type="text"
              value={formData.downloadUrl}
              onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
              className={`${inputBaseClasses} font-mono text-xs`}
              placeholder="https://example.com/capability-statement.pdf"
            />
            <HelperText>Leave empty to use the built-in printable capability statement view.</HelperText>
          </div>

          <div className="md:col-span-2">
            <FieldLabel
              htmlFor="cap-summary"
              label="Executive summary"
              rightSlot={<CharacterCounter value={formData.summary || ''} recommendedMax={450} />}
            />
            <textarea
              id="cap-summary"
              rows={3}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className={textareaBaseClasses}
              placeholder="Concise overview of engineering qualifications, fleet capacity, and government compliance..."
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <EditableItemList<CertificationItem>
          title="Accreditations & certifications"
          description="Official registrations, licenses, and empaneled contractor credentials."
          items={formData.certifications || []}
          onUpdateItems={(certs) => setFormData({ ...formData, certifications: certs })}
          createNewItem={createNewCert}
          getItemTitle={(item) => item.name || 'Untitled certification'}
          getItemSubtitle={(item) => `${item.issuer} · ${item.year}`}
          addButtonText="Add Certification"
          renderItemFields={(item, idx, updateItem) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <FieldLabel htmlFor={`cert-name-${idx}`} label="Certificate name" required />
                <input
                  id={`cert-name-${idx}`}
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem({ ...item, name: e.target.value })}
                  className={inputBaseClasses}
                  placeholder="e.g. Class-I Civil Contractor Registration"
                />
              </div>

              <div>
                <FieldLabel htmlFor={`cert-year-${idx}`} label="Year issued" />
                <input
                  id={`cert-year-${idx}`}
                  type="text"
                  value={item.year}
                  onChange={(e) => updateItem({ ...item, year: e.target.value })}
                  className={`${inputBaseClasses} tabular-nums`}
                  placeholder="2024"
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel htmlFor={`cert-issuer-${idx}`} label="Issuing department / agency" />
                <input
                  id={`cert-issuer-${idx}`}
                  type="text"
                  value={item.issuer}
                  onChange={(e) => updateItem({ ...item, issuer: e.target.value })}
                  className={inputBaseClasses}
                  placeholder="e.g. Public Works Department (PWD), Tamil Nadu"
                />
              </div>
            </div>
          )}
        />
      </SectionCard>
    </form>
  );
};
