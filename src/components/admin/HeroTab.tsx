import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle, Layers } from 'lucide-react';
import { FullSiteContent, HeroContent, HeroSlide } from '../../context/SiteContentContext';

interface HeroTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
}

const getInitialSlides = (heroContent?: HeroContent): HeroSlide[] => {
  const existingSlides = heroContent?.slides;
  return [
    {
      badge: existingSlides?.[0]?.badge || heroContent?.badge || 'State PWD & WRD Empaneled',
      title: existingSlides?.[0]?.title || heroContent?.title || 'Precision Civil Engineering & Heavy Dewatering Solutions',
      subtitle: existingSlides?.[0]?.subtitle || heroContent?.subtitle || 'Government Accredited Contractor',
      tagline: existingSlides?.[0]?.tagline || heroContent?.tagline || 'Delivering reliable dewatering, flood control, excavation drainage, lake desilting, and emergency pumping solutions for construction and CMRL projects, with expertise in dewatering for metro construction works, including column pit excavations.',
    },
    {
      badge: existingSlides?.[1]?.badge || 'WRD Irrigation',
      title: existingSlides?.[1]?.title || 'Roads, Water Resources &\nRural Development',
      subtitle: existingSlides?.[1]?.subtitle || 'Hydraulic Flow Management',
      tagline: existingSlides?.[1]?.tagline || 'Executing roads, culverts, dredging works, retaining walls, under-sluices, and water resource projects that strengthen communities and support sustainable growth.',
    },
    {
      badge: existingSlides?.[2]?.badge || 'Emergency Ready',
      title: existingSlides?.[2]?.title || 'Tractor-Driven Dewatering Pumps &\nHigh-Capacity 100 HP Pumping Solutions',
      subtitle: existingSlides?.[2]?.subtitle || 'Disaster Relief Management',
      tagline: existingSlides?.[2]?.tagline || 'Delivering reliable dewatering, flood control, excavation drainage, lake desilting, and emergency pumping solutions for construction and CMRL projects, with expertise in dewatering for metro construction works, including column pit excavations.',
    },
  ];
};

export const HeroTab: React.FC<HeroTabProps> = ({ content, updateSection }) => {
  const [slides, setSlides] = useState<HeroSlide[]>(() => getInitialSlides(content?.hero));
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (content?.hero) {
      setSlides(getInitialSlides(content.hero));
    }
  }, [content?.hero]);

  const handleSlideChange = (index: number, field: keyof HeroSlide, value: string) => {
    setSlides(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg(null);

    try {
      const payload: HeroContent = {
        slides,
        badge: slides[0]?.badge,
        title: slides[0]?.title,
        subtitle: slides[0]?.subtitle,
        tagline: slides[0]?.tagline,
      };
      await updateSection('hero', payload);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving Hero section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-display font-bold text-white">Hero Section</h2>
          <p className="text-xs text-neutral-400">Configure homepage primary hero slides (badge, title, subtitle, tagline for all 3 slides).</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Hero Content'}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Hero slides updated successfully in Firestore real-time!
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="space-y-6">
        {slides.map((slide, index) => (
          <div key={index} className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Layers className="w-4 h-4 text-brand-gold-400" />
              <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">
                Slide {index + 1}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
                  Hero Badge / Accreditation Tag
                </label>
                <input
                  type="text"
                  value={slide.badge}
                  onChange={(e) => handleSlideChange(index, 'badge', e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
                  placeholder="e.g. State PWD & WRD Empaneled"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={slide.subtitle}
                  onChange={(e) => handleSlideChange(index, 'subtitle', e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
                  placeholder="e.g. Government Accredited Class-I Contractor"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
                Primary Title
              </label>
              <input
                type="text"
                value={slide.title}
                onChange={(e) => handleSlideChange(index, 'title', e.target.value)}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
                placeholder="e.g. Precision Civil Engineering & Heavy Dewatering Solutions"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
                Tagline / Full Description
              </label>
              <textarea
                rows={3}
                value={slide.tagline}
                onChange={(e) => handleSlideChange(index, 'tagline', e.target.value)}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
                placeholder="Detailed hero description paragraph..."
              />
            </div>
          </div>
        ))}
      </div>
    </form>
  );
};
