import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { FullSiteContent, ChennaiContent } from '../../context/SiteContentContext';
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
import { ImageField } from './ImageField';

interface ChennaiTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
  onDirtyChange?: (dirty: boolean) => void;
  onSavingChange?: (saving: boolean) => void;
  onSaveToast?: (msg: string) => void;
}

const getInitialChennai = (content: FullSiteContent): ChennaiContent => ({
  bannerTagEn: content.chennai?.bannerTagEn || 'Chennai Zone & Disaster Readiness Hub',
  bannerTagTa: content.chennai?.bannerTagTa || 'சென்னை மண்டலம் & பேரிடர் ஆயத்த மையம்',
  bannerTitleEn: content.chennai?.bannerTitleEn || 'Chennai Zone & Monsoon Info',
  bannerTitleTa: content.chennai?.bannerTitleTa || 'சென்னை மண்டல செயல்பாடுகள் & பருவமழை தகவல்',
  bannerSubtitleEn:
    content.chennai?.bannerSubtitleEn ||
    'Real-time monsoon tracking, Greater Chennai Corporation (GCC) zonal mapping, dewatering pump allocations, and 24/7 emergency disaster response readiness across Chennai.',
  bannerSubtitleTa:
    content.chennai?.bannerSubtitleTa ||
    'நிகழ்நேர பருவமழை கண்காணிப்பு, பெருநகர சென்னை மாநகராட்சி (GCC) மண்டல வரைபடம், நீர் வெளியேற்றும் பம்ப் ஒதுக்கீடுகள் மற்றும் 24/7 அவசரகால பேரிடர் நிவாரண தகவல்கள்.',
  bannerImageUrl:
    content.chennai?.bannerImageUrl ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAeQt_VRg-Pnvzi83b3kFBXkzvQwauzvPl3BR7b4V5oqXN65xsotHAR8F_J1Cr-ngjTmrsoOZwh5FdVT3Zl2TQdue2Wcd1_ulcn_09y7urzhBo0D1KmgZRjeebjb1XoS7MLrQY1rDu7vusZvj8gxX6MmMm7Y6ahsbChKhEPeKaWr--5Di4PTSUyriXPWgmsdZ1M_J-R4e7yADQG8TSSdoNbot-7Z_BtQhC13Rvz2AqlQI9L_fKhXuf8kddWYkMMsA3Gl_2Q358cGg',
  gccCardTitleEn: content.chennai?.gccCardTitleEn || 'Check Your Zone & Division (GCC)',
  gccCardTitleTa: content.chennai?.gccCardTitleTa || 'உங்கள் மண்டலம் & பிரிவை அறியவும் (GCC)',
  gccCardDescriptionEn:
    content.chennai?.gccCardDescriptionEn ||
    'Find which Greater Chennai Corporation zone and division your property falls under.',
  gccCardDescriptionTa:
    content.chennai?.gccCardDescriptionTa ||
    'உங்கள் சொத்து எந்த பெருநகர சென்னை மாநகராட்சி மண்டலம் மற்றும் பிரிவின் கீழ் வருகிறது என்பதை அறியவும்.',
  gccPortalUrl:
    content.chennai?.gccPortalUrl ||
    'https://chennaicorporation.gov.in/gcc/citizen-details/location-service/find_zone.jsp',
});

export const ChennaiTabComponent: React.FC<ChennaiTabProps> = ({
  content,
  updateSection,
  onDirtyChange,
  onSavingChange,
  onSaveToast,
}) => {
  const [formData, setFormData] = useState<ChennaiContent>(() => getInitialChennai(content));
  const [activeLang, setActiveLang] = useState<EditorLanguage>('en');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialRef = useRef<string>(JSON.stringify(getInitialChennai(content)));
  const chennaiJson = JSON.stringify(content.chennai);

  useEffect(() => {
    const next = getInitialChennai(content);
    setFormData(next);
    initialRef.current = JSON.stringify(next);
  }, [chennaiJson]);

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
      bannerTagTa: prev.bannerTagTa?.trim() ? prev.bannerTagTa : prev.bannerTagEn,
      bannerTitleTa: prev.bannerTitleTa?.trim() ? prev.bannerTitleTa : prev.bannerTitleEn,
      bannerSubtitleTa: prev.bannerSubtitleTa?.trim() ? prev.bannerSubtitleTa : prev.bannerSubtitleEn,
      gccCardTitleTa: prev.gccCardTitleTa?.trim() ? prev.gccCardTitleTa : prev.gccCardTitleEn,
      gccCardDescriptionTa: prev.gccCardDescriptionTa?.trim()
        ? prev.gccCardDescriptionTa
        : prev.gccCardDescriptionEn,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(null);
    setErrorMsg(null);

    if (!formData.bannerTitleEn.trim() || !formData.bannerSubtitleEn.trim()) {
      setErrorMsg('Banner English Title and Subtitle are required.');
      setSaving(false);
      return;
    }

    const cleanedPayload: ChennaiContent = {
      bannerTagEn: formData.bannerTagEn.trim(),
      bannerTagTa: formData.bannerTagTa.trim(),
      bannerTitleEn: formData.bannerTitleEn.trim(),
      bannerTitleTa: formData.bannerTitleTa.trim(),
      bannerSubtitleEn: formData.bannerSubtitleEn.trim(),
      bannerSubtitleTa: formData.bannerSubtitleTa.trim(),
      bannerImageUrl: formData.bannerImageUrl.trim(),
      gccCardTitleEn: formData.gccCardTitleEn.trim(),
      gccCardTitleTa: formData.gccCardTitleTa.trim(),
      gccCardDescriptionEn: formData.gccCardDescriptionEn.trim(),
      gccCardDescriptionTa: formData.gccCardDescriptionTa.trim(),
      gccPortalUrl: formData.gccPortalUrl.trim(),
    };

    try {
      await updateSection('chennai', cleanedPayload);
      initialRef.current = JSON.stringify(cleanedPayload);
      onDirtyChange?.(false);
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSaveSuccess(`Chennai Page Content updated successfully at ${now}.`);
      onSaveToast?.('Chennai page content saved successfully.');
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err: any) {
      console.error('Error saving Chennai section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form id="cms-active-section-form" onSubmit={handleSave} className="space-y-6">
      <SectionHeader
        title="Chennai Page CMS"
        description="Edit the Chennai zone header banner, bilingual titles and subtitles, backdrop image, and GCC portal card."
        icon={<MapPin className="w-5 h-5" />}
        saving={saving}
        saveLabel="Save Chennai Content"
        isDirty={isDirty}
        saveSuccess={saveSuccess}
        errorMsg={errorMsg}
      />

      <LanguageTabs
        activeLang={activeLang}
        onChange={setActiveLang}
        onCopyEnToTa={handleCopyEnToTa}
        copyLabel="Copy EN to empty TA fields"
      />

      <SectionCard
        title="Header banner & background"
        description="Top hero banner shown on the Chennai Zone & Monsoon Info page."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activeLang === 'en' ? (
            <>
              <div>
                <FieldLabel htmlFor="chennai-tag-en" label="Banner tag (English)" />
                <input
                  id="chennai-tag-en"
                  type="text"
                  value={formData.bannerTagEn}
                  onChange={(e) => setFormData({ ...formData, bannerTagEn: e.target.value })}
                  className={inputBaseClasses}
                  placeholder="e.g. Chennai Zone & Disaster Readiness Hub"
                />
              </div>

              <div>
                <FieldLabel htmlFor="chennai-title-en" label="Banner main title (English)" required />
                <input
                  id="chennai-title-en"
                  type="text"
                  value={formData.bannerTitleEn}
                  onChange={(e) => setFormData({ ...formData, bannerTitleEn: e.target.value })}
                  className={inputBaseClasses}
                  placeholder="e.g. Chennai Zone & Monsoon Info"
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel
                  htmlFor="chennai-sub-en"
                  label="Banner subtitle / description (English)"
                  required
                  rightSlot={<CharacterCounter value={formData.bannerSubtitleEn} recommendedMax={220} />}
                />
                <textarea
                  id="chennai-sub-en"
                  rows={2}
                  value={formData.bannerSubtitleEn}
                  onChange={(e) => setFormData({ ...formData, bannerSubtitleEn: e.target.value })}
                  className={textareaBaseClasses}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <FieldLabel htmlFor="chennai-tag-ta" label="Banner tag (Tamil)" />
                <input
                  id="chennai-tag-ta"
                  type="text"
                  value={formData.bannerTagTa}
                  onChange={(e) => setFormData({ ...formData, bannerTagTa: e.target.value })}
                  className={inputBaseClasses}
                  placeholder="சென்னை மண்டலம் & பேரிடர் ஆயத்த மையம்"
                />
              </div>

              <div>
                <FieldLabel htmlFor="chennai-title-ta" label="Banner main title (Tamil)" required />
                <input
                  id="chennai-title-ta"
                  type="text"
                  value={formData.bannerTitleTa}
                  onChange={(e) => setFormData({ ...formData, bannerTitleTa: e.target.value })}
                  className={inputBaseClasses}
                  placeholder="சென்னை மண்டல செயல்பாடுகள் & பருவமழை தகவல்"
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel
                  htmlFor="chennai-sub-ta"
                  label="Banner subtitle / description (Tamil)"
                  required
                  rightSlot={<CharacterCounter value={formData.bannerSubtitleTa} recommendedMax={250} />}
                />
                <textarea
                  id="chennai-sub-ta"
                  rows={2}
                  value={formData.bannerSubtitleTa}
                  onChange={(e) => setFormData({ ...formData, bannerSubtitleTa: e.target.value })}
                  className={textareaBaseClasses}
                />
              </div>
            </>
          )}

          <div className="md:col-span-2">
            <ImageField
              label="Banner background image"
              value={formData.bannerImageUrl}
              onChange={(url) => setFormData({ ...formData, bannerImageUrl: url })}
              section="chennai"
              helperText="Wide landscape image (16:9) used behind the dark navy overlay."
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="GCC citizen utility portal card"
        description="External link card directing residents to look up their Greater Chennai Corporation zone and division."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activeLang === 'en' ? (
            <>
              <div>
                <FieldLabel htmlFor="gcc-title-en" label="GCC card title (English)" />
                <input
                  id="gcc-title-en"
                  type="text"
                  value={formData.gccCardTitleEn}
                  onChange={(e) => setFormData({ ...formData, gccCardTitleEn: e.target.value })}
                  className={inputBaseClasses}
                  placeholder="e.g. Check Your Zone & Division (GCC)"
                />
              </div>

              <div>
                <FieldLabel htmlFor="gcc-portal-url" label="GCC citizen portal URL" />
                <input
                  id="gcc-portal-url"
                  type="url"
                  value={formData.gccPortalUrl}
                  onChange={(e) => setFormData({ ...formData, gccPortalUrl: e.target.value })}
                  className={`${inputBaseClasses} font-mono text-xs`}
                  placeholder="https://chennaicorporation.gov.in/..."
                />
                <HelperText>Opens in a new browser tab for citizens.</HelperText>
              </div>

              <div className="md:col-span-2">
                <FieldLabel
                  htmlFor="gcc-desc-en"
                  label="GCC card description (English)"
                  rightSlot={<CharacterCounter value={formData.gccCardDescriptionEn} recommendedMax={160} />}
                />
                <textarea
                  id="gcc-desc-en"
                  rows={2}
                  value={formData.gccCardDescriptionEn}
                  onChange={(e) => setFormData({ ...formData, gccCardDescriptionEn: e.target.value })}
                  className={textareaBaseClasses}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <FieldLabel htmlFor="gcc-title-ta" label="GCC card title (Tamil)" />
                <input
                  id="gcc-title-ta"
                  type="text"
                  value={formData.gccCardTitleTa}
                  onChange={(e) => setFormData({ ...formData, gccCardTitleTa: e.target.value })}
                  className={inputBaseClasses}
                />
              </div>

              <div>
                <FieldLabel htmlFor="gcc-portal-url-ta" label="GCC citizen portal URL" />
                <input
                  id="gcc-portal-url-ta"
                  type="url"
                  value={formData.gccPortalUrl}
                  onChange={(e) => setFormData({ ...formData, gccPortalUrl: e.target.value })}
                  className={`${inputBaseClasses} font-mono text-xs`}
                  placeholder="https://chennaicorporation.gov.in/..."
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel
                  htmlFor="gcc-desc-ta"
                  label="GCC card description (Tamil)"
                  rightSlot={<CharacterCounter value={formData.gccCardDescriptionTa} recommendedMax={180} />}
                />
                <textarea
                  id="gcc-desc-ta"
                  rows={2}
                  value={formData.gccCardDescriptionTa}
                  onChange={(e) => setFormData({ ...formData, gccCardDescriptionTa: e.target.value })}
                  className={textareaBaseClasses}
                />
              </div>
            </>
          )}
        </div>
      </SectionCard>
    </form>
  );
};

export const ChennaiTab = React.memo(ChennaiTabComponent);
