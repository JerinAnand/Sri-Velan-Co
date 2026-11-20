import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FileText } from 'lucide-react';
import { FullSiteContent, FooterContent } from '../../context/SiteContentContext';
import {
  SectionCard,
  SectionHeader,
  FieldLabel,
  CharacterCounter,
  HelperText,
  inputBaseClasses,
  textareaBaseClasses,
} from './SectionCard';

interface FooterTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
  onDirtyChange?: (dirty: boolean) => void;
  onSavingChange?: (saving: boolean) => void;
  onSaveToast?: (msg: string) => void;
}

export const FooterTab: React.FC<FooterTabProps> = ({
  content,
  updateSection,
  onDirtyChange,
  onSavingChange,
  onSaveToast,
}) => {
  const [formData, setFormData] = useState<FooterContent>({ ...content.footer });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialRef = useRef<string>(JSON.stringify(content.footer));
  const footerJson = JSON.stringify(content.footer);

  useEffect(() => {
    setFormData({ ...content.footer });
    initialRef.current = footerJson;
  }, [footerJson]);

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
      await updateSection('footer', formData);
      initialRef.current = JSON.stringify(formData);
      onDirtyChange?.(false);
      setSaveSuccess(true);
      onSaveToast?.('Footer content saved successfully.');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving Footer section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form id="cms-active-section-form" onSubmit={handleSave} className="space-y-6">
      <SectionHeader
        title="Footer Content"
        description="Manage footer description, copyright notice, social links, and corporate brochure download URLs."
        icon={<FileText className="w-5 h-5" />}
        saving={saving}
        saveLabel="Save Footer"
        isDirty={isDirty}
        saveSuccess={saveSuccess ? 'Footer content updated and synced live.' : null}
        errorMsg={errorMsg}
      />

      <SectionCard
        title="Brand summary & legal notice"
        description="Displayed in the global site footer across every public route."
      >
        <div className="space-y-5">
          <div>
            <FieldLabel
              htmlFor="footer-description"
              label="Footer summary description"
              rightSlot={<CharacterCounter value={formData.description || ''} recommendedMax={240} />}
            />
            <textarea
              id="footer-description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={textareaBaseClasses}
              placeholder="e.g. Class-I civil engineering, heavy dewatering, and municipal infrastructure partner serving Tamil Nadu since 2006."
            />
          </div>

          <div>
            <FieldLabel htmlFor="footer-copyright" label="Copyright notice line" />
            <input
              id="footer-copyright"
              type="text"
              value={formData.copyright}
              onChange={(e) => setFormData({ ...formData, copyright: e.target.value })}
              className={inputBaseClasses}
              placeholder="e.g. © 2026 Sri Velan & Co. All rights reserved."
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="External links & downloads"
        description="Configure social profile and corporate capability brochure links."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <FieldLabel htmlFor="footer-instagram" label="Instagram URL" />
            <input
              id="footer-instagram"
              type="text"
              value={formData.instagramUrl}
              onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
              className={`${inputBaseClasses} font-mono`}
              placeholder="https://instagram.com/srivelanco"
            />
            <HelperText>Full URL including https:// for the social icon link.</HelperText>
          </div>

          <div>
            <FieldLabel htmlFor="footer-brochure" label="Corporate brochure link / PDF URL" />
            <input
              id="footer-brochure"
              type="text"
              value={formData.brochureUrl}
              onChange={(e) => setFormData({ ...formData, brochureUrl: e.target.value })}
              className={`${inputBaseClasses} font-mono`}
              placeholder="/brochure.pdf or https://..."
            />
            <HelperText>Relative path or external PDF link for brochure downloads.</HelperText>
          </div>
        </div>
      </SectionCard>
    </form>
  );
};
