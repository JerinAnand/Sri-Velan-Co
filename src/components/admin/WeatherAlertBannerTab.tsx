import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CloudRain } from 'lucide-react';
import { FullSiteContent, WeatherAlertBannerContent } from '../../context/SiteContentContext';
import {
  SectionCard,
  SectionHeader,
  FieldLabel,
  CharacterCounter,
  HelperText,
  inputBaseClasses,
  textareaBaseClasses,
} from './SectionCard';

interface WeatherAlertBannerTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
  onDirtyChange?: (dirty: boolean) => void;
  onSavingChange?: (saving: boolean) => void;
  onSaveToast?: (msg: string) => void;
}

export const WeatherAlertBannerTab: React.FC<WeatherAlertBannerTabProps> = ({
  content,
  updateSection,
  onDirtyChange,
  onSavingChange,
  onSaveToast,
}) => {
  const [formData, setFormData] = useState<WeatherAlertBannerContent>({
    ...content.weatherAlertBanner,
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialRef = useRef<string>(JSON.stringify(content.weatherAlertBanner));
  const bannerJson = JSON.stringify(content.weatherAlertBanner);

  useEffect(() => {
    setFormData({ ...content.weatherAlertBanner });
    initialRef.current = bannerJson;
  }, [bannerJson]);

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
      await updateSection('weatherAlertBanner', formData);
      initialRef.current = JSON.stringify(formData);
      onDirtyChange?.(false);
      setSaveSuccess(true);
      onSaveToast?.('Weather alert banner settings saved.');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving Weather Alert Banner section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form id="cms-active-section-form" onSubmit={handleSave} className="space-y-6">
      <SectionHeader
        title="Weather Alert Banner"
        description="Configure the global top alert strip, emergency severity level, and visitor dismissal controls."
        icon={<CloudRain className="w-5 h-5" />}
        saving={saving}
        saveLabel="Save Banner Settings"
        isDirty={isDirty}
        saveSuccess={saveSuccess ? 'Weather alert banner updated and synced live.' : null}
        errorMsg={errorMsg}
      />

      <SectionCard
        title="Display & severity settings"
        description="Control whether the alert strip is visible across all public pages and how urgent it appears."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <label
            htmlFor="banner-enabled"
            className="flex items-start gap-3 p-4 rounded-xl bg-[#050d1a] border border-white/15 hover:border-white/25 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              id="banner-enabled"
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="mt-0.5 w-4 h-4 accent-brand-gold-500 rounded cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="block text-sm font-medium text-white">
                Enable global weather & monsoon banner
              </span>
              <span className="block text-xs text-slate-400">
                Displays the announcement bar above the header on all public routes.
              </span>
            </div>
          </label>

          <label
            htmlFor="banner-dismissible"
            className="flex items-start gap-3 p-4 rounded-xl bg-[#050d1a] border border-white/15 hover:border-white/25 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              id="banner-dismissible"
              checked={formData.dismissible}
              onChange={(e) => setFormData({ ...formData, dismissible: e.target.checked })}
              className="mt-0.5 w-4 h-4 accent-brand-gold-500 rounded cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="block text-sm font-medium text-white">
                Allow visitors to dismiss banner
              </span>
              <span className="block text-xs text-slate-400">
                Adds a close button so visitors can hide the notice during their session.
              </span>
            </div>
          </label>

          <div className="md:col-span-2">
            <FieldLabel htmlFor="banner-severity" label="Severity level" />
            <select
              id="banner-severity"
              value={formData.severity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  severity: e.target.value as 'info' | 'warning' | 'critical',
                })
              }
              className={inputBaseClasses}
            >
              <option value="info">Info (Blue advisory theme)</option>
              <option value="warning">Warning / Standby (Amber standby theme)</option>
              <option value="critical">Critical Emergency (Red alert theme)</option>
            </select>
            <HelperText>
              Sets the banner background color and urgency styling on the public site.
            </HelperText>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Announcement message"
        description="Write a concise alert notice for monsoon preparedness or emergency dewatering dispatch."
      >
        <div>
          <FieldLabel
            htmlFor="banner-message"
            label="Alert announcement text"
            required
            rightSlot={<CharacterCounter value={formData.message || ''} recommendedMax={180} />}
          />
          <textarea
            id="banner-message"
            rows={3}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className={textareaBaseClasses}
            placeholder="e.g. Northeast Monsoon Readiness: 24/7 emergency dewatering & flood-control fleet active across Chennai & Villupuram."
          />
          <HelperText>
            Keep under 180 characters so the alert fits cleanly on mobile and desktop screens.
          </HelperText>
        </div>
      </SectionCard>
    </form>
  );
};
