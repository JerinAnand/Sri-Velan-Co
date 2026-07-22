import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, CloudRain, Bell } from 'lucide-react';
import { FullSiteContent, WeatherAlertBannerContent } from '../../context/SiteContentContext';

interface WeatherAlertBannerTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
}

export const WeatherAlertBannerTab: React.FC<WeatherAlertBannerTabProps> = ({ content, updateSection }) => {
  const [formData, setFormData] = useState<WeatherAlertBannerContent>({
    ...content.weatherAlertBanner,
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg(null);

    try {
      await updateSection('weatherAlertBanner', formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving Weather Alert Banner section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-sky-400" />
            Weather Alert & Monsoon Banner
          </h2>
          <p className="text-xs text-neutral-400">Configure global top alert message, emergency severity level, and visibility controls.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Banner Settings'}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Weather alert banner updated successfully in Firestore real-time!
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-3 bg-neutral-950 p-4 border border-white/10 rounded-2xl">
          <input
            type="checkbox"
            id="banner-enabled"
            checked={formData.enabled}
            onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
            className="w-4 h-4 accent-brand-gold-500 rounded cursor-pointer"
          />
          <label htmlFor="banner-enabled" className="text-xs font-mono font-medium text-white cursor-pointer select-none">
            Enable Top Global Weather & Monsoon Alert Banner
          </label>
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
            Alert Announcement Message
          </label>
          <textarea
            rows={3}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-xs font-mono text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all"
            placeholder="Emergency monsoon dispatch active..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
              Severity Level
            </label>
            <select
              value={formData.severity}
              onChange={(e) =>
                setFormData({ ...formData, severity: e.target.value as 'info' | 'warning' | 'critical' })
              }
              className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 font-mono"
            >
              <option value="info">Info (Blue Theme)</option>
              <option value="warning">Warning / Standby (Amber Theme)</option>
              <option value="critical">Critical Emergency (Red Alert Theme)</option>
            </select>
          </div>

          <div className="flex items-center gap-3 bg-neutral-950 p-4 border border-white/10 rounded-2xl">
            <input
              type="checkbox"
              id="banner-dismissible"
              checked={formData.dismissible}
              onChange={(e) => setFormData({ ...formData, dismissible: e.target.checked })}
              className="w-4 h-4 accent-brand-gold-500 rounded cursor-pointer"
            />
            <label htmlFor="banner-dismissible" className="text-xs font-mono font-medium text-white cursor-pointer select-none">
              Allow visitors to close/dismiss banner
            </label>
          </div>
        </div>
      </div>
    </form>
  );
};
