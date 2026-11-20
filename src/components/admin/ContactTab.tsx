import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PhoneCall } from 'lucide-react';
import { FullSiteContent, ContactContent } from '../../context/SiteContentContext';
import {
  SectionCard,
  SectionHeader,
  FieldLabel,
  CharacterCounter,
  HelperText,
  inputBaseClasses,
  textareaBaseClasses,
} from './SectionCard';

interface ContactTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
  onDirtyChange?: (dirty: boolean) => void;
  onSavingChange?: (saving: boolean) => void;
  onSaveToast?: (msg: string) => void;
}

export const ContactTab: React.FC<ContactTabProps> = ({
  content,
  updateSection,
  onDirtyChange,
  onSavingChange,
  onSaveToast,
}) => {
  const [formData, setFormData] = useState<ContactContent>({ ...content.contact });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialRef = useRef<string>(JSON.stringify(content.contact));
  const contactJson = JSON.stringify(content.contact);

  useEffect(() => {
    setFormData({ ...content.contact });
    initialRef.current = contactJson;
  }, [contactJson]);

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
      await updateSection('contact', formData);
      initialRef.current = JSON.stringify(formData);
      onDirtyChange?.(false);
      setSaveSuccess(true);
      onSaveToast?.('Contact & office details saved successfully.');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving Contact section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form id="cms-active-section-form" onSubmit={handleSave} className="space-y-6">
      <SectionHeader
        title="Contact & Offices"
        description="Manage primary hotlines, official emails, WhatsApp dispatch numbers, and regional office addresses."
        icon={<PhoneCall className="w-5 h-5" />}
        saving={saving}
        saveLabel="Save Contact Details"
        isDirty={isDirty}
        saveSuccess={saveSuccess ? 'Contact information updated and synced live.' : null}
        errorMsg={errorMsg}
      />

      <SectionCard
        title="Hotlines & digital dispatch"
        description="Phone numbers, email addresses, and operating hours displayed in the header, footer, and contact pages."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <FieldLabel htmlFor="contact-phone-primary" label="Primary hotline phone" required />
            <input
              id="contact-phone-primary"
              type="text"
              value={formData.phonePrimary}
              onChange={(e) => setFormData({ ...formData, phonePrimary: e.target.value })}
              className={`${inputBaseClasses} tabular-nums`}
              placeholder="+91 94433 00000"
            />
          </div>

          <div>
            <FieldLabel htmlFor="contact-phone-secondary" label="Secondary hotline phone" />
            <input
              id="contact-phone-secondary"
              type="text"
              value={formData.phoneSecondary}
              onChange={(e) => setFormData({ ...formData, phoneSecondary: e.target.value })}
              className={`${inputBaseClasses} tabular-nums`}
              placeholder="+91 94433 00001"
            />
          </div>

          <div>
            <FieldLabel htmlFor="contact-email-primary" label="Primary email address" required />
            <input
              id="contact-email-primary"
              type="email"
              value={formData.emailPrimary}
              onChange={(e) => setFormData({ ...formData, emailPrimary: e.target.value })}
              className={`${inputBaseClasses} font-mono`}
              placeholder="info@srivelanco.com"
            />
          </div>

          <div>
            <FieldLabel htmlFor="contact-email-secondary" label="Secondary email address" />
            <input
              id="contact-email-secondary"
              type="email"
              value={formData.emailSecondary}
              onChange={(e) => setFormData({ ...formData, emailSecondary: e.target.value })}
              className={`${inputBaseClasses} font-mono`}
              placeholder="tenders@srivelanco.com"
            />
          </div>

          <div>
            <FieldLabel htmlFor="contact-whatsapp" label="WhatsApp contact number" />
            <input
              id="contact-whatsapp"
              type="text"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              className={`${inputBaseClasses} font-mono tabular-nums`}
              placeholder="919443300000"
            />
            <HelperText>Include country code without spaces or plus sign for direct WhatsApp links (e.g. 919443300000).</HelperText>
          </div>

          <div>
            <FieldLabel htmlFor="contact-hours" label="Working hours" />
            <input
              id="contact-hours"
              type="text"
              value={formData.workingHours}
              onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
              className={inputBaseClasses}
              placeholder="e.g. Mon – Sat: 9:00 AM – 6:30 PM (24/7 Emergency)"
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Office locations"
        description="Full postal addresses for the Villupuram headquarters and Chennai regional operations desk."
      >
        <div className="space-y-5">
          <div>
            <FieldLabel
              htmlFor="contact-addr-villupuram"
              label="Villupuram headquarters address"
              rightSlot={<CharacterCounter value={formData.addressVillupuram || ''} recommendedMax={220} />}
            />
            <textarea
              id="contact-addr-villupuram"
              rows={2}
              value={formData.addressVillupuram}
              onChange={(e) => setFormData({ ...formData, addressVillupuram: e.target.value })}
              className={textareaBaseClasses}
              placeholder="Registered head office address in Villupuram..."
            />
          </div>

          <div>
            <FieldLabel
              htmlFor="contact-addr-chennai"
              label="Chennai regional office address"
              rightSlot={<CharacterCounter value={formData.addressChennai || ''} recommendedMax={220} />}
            />
            <textarea
              id="contact-addr-chennai"
              rows={2}
              value={formData.addressChennai}
              onChange={(e) => setFormData({ ...formData, addressChennai: e.target.value })}
              className={textareaBaseClasses}
              placeholder="Chennai operations & metro dewatering branch address..."
            />
          </div>
        </div>
      </SectionCard>
    </form>
  );
};
