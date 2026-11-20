import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Info } from 'lucide-react';
import { FullSiteContent, AboutContent } from '../../context/SiteContentContext';
import {
  SectionCard,
  SectionHeader,
  FieldLabel,
  CharacterCounter,
  HelperText,
  inputBaseClasses,
  textareaBaseClasses,
} from './SectionCard';
import { LanguageTabs, EditorLanguage } from './LanguageTabs';

interface AboutTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
  onDirtyChange?: (dirty: boolean) => void;
  onSavingChange?: (saving: boolean) => void;
  onSaveToast?: (msg: string) => void;
}

export const AboutTab: React.FC<AboutTabProps> = ({
  content,
  updateSection,
  onDirtyChange,
  onSavingChange,
  onSaveToast,
}) => {
  const [formData, setFormData] = useState<AboutContent>({ ...content.about });
  const [activeLang, setActiveLang] = useState<EditorLanguage>('en');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialRef = useRef<string>(JSON.stringify(content.about));
  const aboutJson = JSON.stringify(content.about);

  useEffect(() => {
    setFormData({ ...content.about });
    initialRef.current = aboutJson;
  }, [aboutJson]);

  const isDirty = useMemo(() => JSON.stringify(formData) !== initialRef.current, [formData]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    onSavingChange?.(saving);
  }, [saving, onSavingChange]);

  const handleCopyEnToTa = () => {
    setFormData((prev) => ({
      ...prev,
      missionTextTa: prev.missionTextTa?.trim() ? prev.missionTextTa : prev.missionText,
      visionTextTa: prev.visionTextTa?.trim() ? prev.visionTextTa : prev.visionText,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg(null);

    try {
      await updateSection('about', formData);
      initialRef.current = JSON.stringify(formData);
      onDirtyChange?.(false);
      setSaveSuccess(true);
      onSaveToast?.('About Us section saved successfully.');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving About section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form id="cms-active-section-form" onSubmit={handleSave} className="space-y-6">
      <SectionHeader
        title="About Us"
        description="Manage company history, founder details, accreditation tagline, mission, and vision statements."
        icon={<Info className="w-5 h-5" />}
        saving={saving}
        saveLabel="Save About Content"
        isDirty={isDirty}
        saveSuccess={saveSuccess ? 'About section updated successfully.' : null}
        errorMsg={errorMsg}
      />

      <SectionCard
        title="Company profile & history"
        description="Core corporate facts displayed in the About Us overview."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <FieldLabel htmlFor="about-year" label="Year established" />
            <input
              id="about-year"
              type="number"
              value={formData.yearEstablished}
              onChange={(e) =>
                setFormData({ ...formData, yearEstablished: parseInt(e.target.value, 10) || 2006 })
              }
              className={`${inputBaseClasses} tabular-nums`}
              placeholder="2006"
            />
          </div>

          <div>
            <FieldLabel htmlFor="about-founder" label="Founder name" />
            <input
              id="about-founder"
              type="text"
              value={formData.founderName}
              onChange={(e) => setFormData({ ...formData, founderName: e.target.value })}
              className={inputBaseClasses}
              placeholder="e.g. Mr. G. Selva Kumar"
            />
          </div>

          <div className="md:col-span-2">
            <FieldLabel htmlFor="about-badge" label="Civil contractor badge text" />
            <input
              id="about-badge"
              type="text"
              value={formData.civilContractorText}
              onChange={(e) => setFormData({ ...formData, civilContractorText: e.target.value })}
              className={inputBaseClasses}
              placeholder="e.g. Class-I Civil & Dewatering Contractor"
            />
          </div>

          <div className="md:col-span-2">
            <FieldLabel
              htmlFor="about-history"
              label="Company incorporation & history"
              rightSlot={<CharacterCounter value={formData.companyDescription || ''} recommendedMax={600} />}
            />
            <textarea
              id="about-history"
              rows={4}
              value={formData.companyDescription}
              onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
              className={textareaBaseClasses}
              placeholder="Summarize company incorporation, engineering heritage, and Tamil Nadu public sector track record..."
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Mission & vision statements"
        description="Switch between English and Tamil to edit bilingual corporate statements."
      >
        <LanguageTabs
          activeLang={activeLang}
          onChange={setActiveLang}
          onCopyEnToTa={handleCopyEnToTa}
          copyLabel="Copy EN to empty TA fields"
        />

        {activeLang === 'en' ? (
          <div className="space-y-5">
            <div>
              <FieldLabel
                htmlFor="about-mission-en"
                label="Mission statement (English)"
                rightSlot={<CharacterCounter value={formData.missionText || ''} recommendedMax={320} />}
              />
              <textarea
                id="about-mission-en"
                rows={3}
                value={formData.missionText || ''}
                onChange={(e) => setFormData({ ...formData, missionText: e.target.value })}
                className={textareaBaseClasses}
                placeholder="Our mission is to execute resilient public infrastructure and dewatering projects..."
              />
            </div>

            <div>
              <FieldLabel
                htmlFor="about-vision-en"
                label="Vision statement (English)"
                rightSlot={<CharacterCounter value={formData.visionText || ''} recommendedMax={320} />}
              />
              <textarea
                id="about-vision-en"
                rows={3}
                value={formData.visionText || ''}
                onChange={(e) => setFormData({ ...formData, visionText: e.target.value })}
                className={textareaBaseClasses}
                placeholder="To be Tamil Nadu's most dependable civil and flood-response partner..."
              />
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <FieldLabel
                htmlFor="about-mission-ta"
                label="Mission statement (Tamil)"
                rightSlot={<CharacterCounter value={formData.missionTextTa || ''} recommendedMax={360} />}
              />
              <textarea
                id="about-mission-ta"
                rows={3}
                value={formData.missionTextTa || ''}
                onChange={(e) => setFormData({ ...formData, missionTextTa: e.target.value })}
                className={textareaBaseClasses}
                placeholder="தமிழ் நோக்கம்..."
              />
              <HelperText>Displayed when visitors select Tamil (தமிழ்) on the About Us page.</HelperText>
            </div>

            <div>
              <FieldLabel
                htmlFor="about-vision-ta"
                label="Vision statement (Tamil)"
                rightSlot={<CharacterCounter value={formData.visionTextTa || ''} recommendedMax={360} />}
              />
              <textarea
                id="about-vision-ta"
                rows={3}
                value={formData.visionTextTa || ''}
                onChange={(e) => setFormData({ ...formData, visionTextTa: e.target.value })}
                className={textareaBaseClasses}
                placeholder="தமிழ் தொலைநோக்கு பார்வை..."
              />
            </div>
          </div>
        )}
      </SectionCard>
    </form>
  );
};
