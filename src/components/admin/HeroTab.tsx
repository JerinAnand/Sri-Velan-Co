import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle, Layers, Globe } from 'lucide-react';
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
      badgeTa: existingSlides?.[0]?.badgeTa || 'மாநில PWD & WRD சான்றளிக்கப்பட்டவை',
      title: existingSlides?.[0]?.title || heroContent?.title || 'Precision Civil Engineering & Heavy Dewatering Solutions',
      titleTa: existingSlides?.[0]?.titleTa || 'அரசு கட்டிடங்கள் மற்றும்\nபொது உள்கட்டமைப்பு',
      subtitle: existingSlides?.[0]?.subtitle || heroContent?.subtitle || 'Government Accredited Contractor',
      subtitleTa: existingSlides?.[0]?.subtitleTa || 'அங்கீகரிக்கப்பட்ட சிவில் கட்டுமானம்',
      tagline: existingSlides?.[0]?.tagline || heroContent?.tagline || 'Delivering reliable dewatering, flood control, excavation drainage, lake desilting, and emergency pumping solutions for construction and CMRL projects, with expertise in dewatering for metro construction works, including column pit excavations.',
      taglineTa: existingSlides?.[0]?.taglineTa || 'பள்ளிகள், கல்லூரிகள், ஆய்வகங்கள், விடுதிகள் போன்ற கல்வி மற்றும் பொது வசதிகளை பொறியியல் சிறப்பம்சங்கள், தரமான வேலைப்பாடு மற்றும் சரியான நேரத்தில் செயல்படுத்துதல் ஆகியவற்றுடன் உருவாக்குதல் மற்றும் புதுப்பித்தல்.',
    },
    {
      badge: existingSlides?.[1]?.badge || 'WRD Irrigation',
      badgeTa: existingSlides?.[1]?.badgeTa || 'நீர்வளத் துறை பாசனம்',
      title: existingSlides?.[1]?.title || 'Roads, Water Resources &\nRural Development',
      titleTa: existingSlides?.[1]?.titleTa || 'சாலைகள், நீர் வளங்கள் மற்றும்\nஊரக வளர்ச்சி',
      subtitle: existingSlides?.[1]?.subtitle || 'Hydraulic Flow Management',
      subtitleTa: existingSlides?.[1]?.subtitleTa || 'ஹைட்ராலிக் ஓட்ட மேலாண்மை',
      tagline: existingSlides?.[1]?.tagline || 'Executing roads, culverts, dredging works, retaining walls, under-sluices, and water resource projects that strengthen communities and support sustainable growth.',
      taglineTa: existingSlides?.[1]?.taglineTa || 'சமூகங்களை வலுப்படுத்தும் மற்றும் நிலையான வளர்ச்சியை ஆதரிக்கும் சாலைகள், பாலங்கள், தூர்வாருதல் பணிகள், தடுப்புச் சுவர்கள், மதகுகள் மற்றும் நீர் வளத் திட்டங்களை செயல்படுத்துதல்.',
    },
    {
      badge: existingSlides?.[2]?.badge || 'Emergency Ready',
      badgeTa: existingSlides?.[2]?.badgeTa || 'அவசரகால தயார் நிலை',
      title: existingSlides?.[2]?.title || 'Tractor-Driven Dewatering Pumps &\nHigh-Capacity 100 HP Pumping Solutions',
      titleTa: existingSlides?.[2]?.titleTa || 'டிராக்டர் மூலம் இயக்கப்படும் நீர் வெளியேற்றும் பம்புகள் மற்றும்\nஅதிவேக 100 HP நீர் வெளியேற்றும் தீர்வுகள்',
      subtitle: existingSlides?.[2]?.subtitle || 'Disaster Relief Management',
      subtitleTa: existingSlides?.[2]?.subtitleTa || 'பேரிடர் நிவாரண மேலாண்மை',
      tagline: existingSlides?.[2]?.tagline || 'Delivering reliable dewatering, flood control, excavation drainage, lake desilting, and emergency pumping solutions for construction and CMRL projects, with expertise in dewatering for metro construction works, including column pit excavations.',
      taglineTa: existingSlides?.[2]?.taglineTa || 'கட்டுமானம் மற்றும் CMRL திட்டங்களுக்கு நம்பகமான நீர் வெளியேற்றம், வெள்ளக் கட்டுப்பாடு, அகழ்வாராய்ச்சி வடிகால், ஏரி தூர்வாருதல் மற்றும் அவசர பம்பிங் தீர்வுகளை வழங்குதல், தூண் குழி அகழ்வாராய்ச்சி உட்பட மெட்ரோ கட்டுமானப் பணிகளுக்கான நீர் வெளியேற்ற நிபுணத்துவத்துடன்.',
    },
  ];
};

export const HeroTab: React.FC<HeroTabProps> = ({ content, updateSection }) => {
  const [slides, setSlides] = useState<HeroSlide[]>(() => getInitialSlides(content?.hero));
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const heroContentJson = JSON.stringify(content?.hero);

  useEffect(() => {
    if (content?.hero) {
      setSlides(getInitialSlides(content.hero));
    }
  }, [heroContentJson]);

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
          <p className="text-xs text-neutral-400">Configure homepage primary hero slides in English and Tamil (badge, title, subtitle, tagline for all 3 slides).</p>
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
          <div key={index} className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-gold-400" />
                <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">
                  Slide {index + 1}
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-brand-blue-900/50 text-brand-gold-400 border border-brand-gold-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Globe className="w-3 h-3" /> Bilingual English / Tamil
              </span>
            </div>

            {/* English Section */}
            <div className="space-y-4 bg-neutral-950/50 p-4 rounded-xl border border-white/5">
              <span className="text-[11px] font-mono font-bold text-brand-gold-400 uppercase tracking-widest block">
                English Content
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
                    Hero Badge / Accreditation Tag (EN)
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
                    Subtitle (EN)
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
                  Primary Title (EN)
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
                  Tagline / Full Description (EN)
                </label>
                <textarea
                  rows={2}
                  value={slide.tagline}
                  onChange={(e) => handleSlideChange(index, 'tagline', e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
                  placeholder="Detailed hero description paragraph in English..."
                />
              </div>
            </div>

            {/* Tamil Section */}
            <div className="space-y-4 bg-brand-blue-950/30 p-4 rounded-xl border border-brand-gold-500/20">
              <span className="text-[11px] font-mono font-bold text-brand-gold-400 uppercase tracking-widest block">
                Tamil Content (தமிழ் உள்ளடக்கம்)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
                    Hero Badge / Accreditation Tag (தமிழ்)
                  </label>
                  <input
                    type="text"
                    value={slide.badgeTa || ''}
                    onChange={(e) => handleSlideChange(index, 'badgeTa', e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
                    placeholder="எ.கா. மாநில PWD & WRD சான்றளிக்கப்பட்டவை"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
                    Subtitle (தமிழ்)
                  </label>
                  <input
                    type="text"
                    value={slide.subtitleTa || ''}
                    onChange={(e) => handleSlideChange(index, 'subtitleTa', e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
                    placeholder="எ.கா. அங்கீகரிக்கப்பட்ட சிவில் கட்டுமானம்"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
                  Primary Title (தமிழ்)
                </label>
                <input
                  type="text"
                  value={slide.titleTa || ''}
                  onChange={(e) => handleSlideChange(index, 'titleTa', e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
                  placeholder="எ.கா. துல்லியமான சிவில் பொறியியல் மற்றும் கனரக நீர் வெளியேற்றும் தீர்வுகள்"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
                  Tagline / Full Description (தமிழ்)
                </label>
                <textarea
                  rows={2}
                  value={slide.taglineTa || ''}
                  onChange={(e) => handleSlideChange(index, 'taglineTa', e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
                  placeholder="தமிழில் விரிவான விளக்கம்..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
};
