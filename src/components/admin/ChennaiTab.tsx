import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { FullSiteContent, ChennaiContent } from '../../context/SiteContentContext';
import { ImageField } from './ImageField';

interface ChennaiTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
}

export const ChennaiTabComponent: React.FC<ChennaiTabProps> = ({ content, updateSection }) => {
  const [formData, setFormData] = useState<ChennaiContent>({
    bannerTagEn: content.chennai?.bannerTagEn || 'Chennai Zone & Disaster Readiness Hub',
    bannerTagTa: content.chennai?.bannerTagTa || 'சென்னை மண்டலம் & பேரிடர் ஆயத்த மையம்',
    bannerTitleEn: content.chennai?.bannerTitleEn || 'Chennai Zone & Monsoon Info',
    bannerTitleTa: content.chennai?.bannerTitleTa || 'சென்னை மண்டல செயல்பாடுகள் & பருவமழை தகவல்',
    bannerSubtitleEn: content.chennai?.bannerSubtitleEn || 'Real-time monsoon tracking, Greater Chennai Corporation (GCC) zonal mapping, dewatering pump allocations, and 24/7 emergency disaster response readiness across Chennai.',
    bannerSubtitleTa: content.chennai?.bannerSubtitleTa || 'நிகழ்நேர பருவமழை கண்காணிப்பு, பெருநகர சென்னை மாநகராட்சி (GCC) மண்டல வரைபடம், நீர் வெளியேற்றும் பம்ப் ஒதுக்கீடுகள் மற்றும் 24/7 அவசரகால பேரிடர் நிவாரண தகவல்கள்.',
    bannerImageUrl: content.chennai?.bannerImageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeQt_VRg-Pnvzi83b3kFBXkzvQwauzvPl3BR7b4V5oqXN65xsotHAR8F_J1Cr-ngjTmrsoOZwh5FdVT3Zl2TQdue2Wcd1_ulcn_09y7urzhBo0D1KmgZRjeebjb1XoS7MLrQY1rDu7vusZvj8gxX6MmMm7Y6ahsbChKhEPeKaWr--5Di4PTSUyriXPWgmsdZ1M_J-R4e7yADQG8TSSdoNbot-7Z_BtQhC13Rvz2AqlQI9L_fKhXuf8kddWYkMMsA3Gl_2Q358cGg',
    gccCardTitleEn: content.chennai?.gccCardTitleEn || 'Check Your Zone & Division (GCC)',
    gccCardTitleTa: content.chennai?.gccCardTitleTa || 'உங்கள் மண்டலம் & பிரிவை அறியவும் (GCC)',
    gccCardDescriptionEn: content.chennai?.gccCardDescriptionEn || 'Find which Greater Chennai Corporation zone and division your property falls under.',
    gccCardDescriptionTa: content.chennai?.gccCardDescriptionTa || 'உங்கள் சொத்து எந்த பெருநகர சென்னை மாநகராட்சி மண்டலம் மற்றும் பிரிவின் கீழ் வருகிறது என்பதை அறியவும்.',
    gccPortalUrl: content.chennai?.gccPortalUrl || 'https://chennaicorporation.gov.in/gcc/citizen-details/location-service/find_zone.jsp',
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSaveSuccess(`Chennai Page Content updated successfully at ${now}!`);
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err: any) {
      console.error('Error saving Chennai section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-display font-bold text-white">Chennai Page CMS Content</h2>
          <p className="text-xs text-neutral-400">
            Edit Chennai zone page header banner, bilingual titles/subtitles, background image, and GCC portal card details.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin text-brand-blue-950" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Chennai Content'}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          {saveSuccess}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          {errorMsg}
        </div>
      )}

      {/* Header Banner Content Block */}
      <div className="bg-neutral-950/60 p-5 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-sm font-display font-bold text-brand-gold-400 uppercase tracking-wider">
          Header Banner Text & Background
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
              Banner Tag (English)
            </label>
            <input
              type="text"
              value={formData.bannerTagEn}
              onChange={(e) => setFormData({ ...formData, bannerTagEn: e.target.value })}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
              Banner Tag (Tamil / தமிழ்)
            </label>
            <input
              type="text"
              value={formData.bannerTagTa}
              onChange={(e) => setFormData({ ...formData, bannerTagTa: e.target.value })}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
              Banner Main Title (English) *
            </label>
            <input
              type="text"
              value={formData.bannerTitleEn}
              onChange={(e) => setFormData({ ...formData, bannerTitleEn: e.target.value })}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
              Banner Main Title (Tamil / தமிழ்) *
            </label>
            <input
              type="text"
              value={formData.bannerTitleTa}
              onChange={(e) => setFormData({ ...formData, bannerTitleTa: e.target.value })}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
              Banner Subtitle / Description (English) *
            </label>
            <textarea
              rows={2}
              value={formData.bannerSubtitleEn}
              onChange={(e) => setFormData({ ...formData, bannerSubtitleEn: e.target.value })}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
              Banner Subtitle / Description (Tamil / தமிழ்) *
            </label>
            <textarea
              rows={2}
              value={formData.bannerSubtitleTa}
              onChange={(e) => setFormData({ ...formData, bannerSubtitleTa: e.target.value })}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <ImageField
              label="Banner Background Image"
              value={formData.bannerImageUrl}
              onChange={(url) => setFormData({ ...formData, bannerImageUrl: url })}
              section="chennai"
            />
          </div>
        </div>
      </div>

      {/* GCC Citizen Utility Portal Card Block */}
      <div className="bg-neutral-950/60 p-5 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-sm font-display font-bold text-brand-gold-400 uppercase tracking-wider">
          GCC Citizen Utility Portal Card
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
              GCC Card Title (English)
            </label>
            <input
              type="text"
              value={formData.gccCardTitleEn}
              onChange={(e) => setFormData({ ...formData, gccCardTitleEn: e.target.value })}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
              GCC Card Title (Tamil / தமிழ்)
            </label>
            <input
              type="text"
              value={formData.gccCardTitleTa}
              onChange={(e) => setFormData({ ...formData, gccCardTitleTa: e.target.value })}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
              GCC Description (English)
            </label>
            <textarea
              rows={2}
              value={formData.gccCardDescriptionEn}
              onChange={(e) => setFormData({ ...formData, gccCardDescriptionEn: e.target.value })}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
              GCC Description (Tamil / தமிழ்)
            </label>
            <textarea
              rows={2}
              value={formData.gccCardDescriptionTa}
              onChange={(e) => setFormData({ ...formData, gccCardDescriptionTa: e.target.value })}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
              GCC Citizen Portal URL
            </label>
            <input
              type="text"
              value={formData.gccPortalUrl}
              onChange={(e) => setFormData({ ...formData, gccPortalUrl: e.target.value })}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export const ChennaiTab = React.memo(ChennaiTabComponent);
