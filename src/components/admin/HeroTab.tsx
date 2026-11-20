import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Layout,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { FullSiteContent, HeroContent, HeroSlide } from '../../context/SiteContentContext';
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

interface HeroTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
  onDirtyChange?: (dirty: boolean) => void;
  onSavingChange?: (saving: boolean) => void;
  onSaveToast?: (msg: string) => void;
}

const getInitialSlides = (heroContent?: HeroContent): HeroSlide[] => {
  const existingSlides = heroContent?.slides;
  const defaults: HeroSlide[] = [
    {
      badge: existingSlides?.[0]?.badge || heroContent?.badge || 'State PWD & WRD Empaneled',
      badgeTa: existingSlides?.[0]?.badgeTa || 'மாநில PWD & WRD சான்றளிக்கப்பட்டவை',
      title: existingSlides?.[0]?.title || heroContent?.title || 'Precision Civil Engineering & Heavy Dewatering Solutions',
      titleTa: existingSlides?.[0]?.titleTa || 'அரசு கட்டிடங்கள் மற்றும்\nபொது உள்கட்டமைப்பு',
      subtitle: existingSlides?.[0]?.subtitle || heroContent?.subtitle || 'Government Accredited Contractor',
      subtitleTa: existingSlides?.[0]?.subtitleTa || 'அங்கீகரிக்கப்பட்ட சிவில் கட்டுமானம்',
      tagline:
        existingSlides?.[0]?.tagline ||
        heroContent?.tagline ||
        'Delivering reliable dewatering, flood control, excavation drainage, lake desilting, and emergency pumping solutions for construction and CMRL projects, with expertise in dewatering for metro construction works, including column pit excavations.',
      taglineTa:
        existingSlides?.[0]?.taglineTa ||
        'பள்ளிகள், கல்லூரிகள், ஆய்வகங்கள், விடுதிகள் போன்ற கல்வி மற்றும் பொது வசதிகளை பொறியியல் சிறப்பம்சங்கள், தரமான வேலைப்பாடு மற்றும் சரியான நேரத்தில் செயல்படுத்துதல் ஆகியவற்றுடன் உருவாக்குதல் மற்றும் புதுப்பித்தல்.',
    },
    {
      badge: existingSlides?.[1]?.badge || 'WRD Irrigation',
      badgeTa: existingSlides?.[1]?.badgeTa || 'நீர்வளத் துறை பாசனம்',
      title: existingSlides?.[1]?.title || 'Roads, Water Resources &\nRural Development',
      titleTa: existingSlides?.[1]?.titleTa || 'சாலைகள், நீர் வளங்கள் மற்றும்\nஊரக வளர்ச்சி',
      subtitle: existingSlides?.[1]?.subtitle || 'Hydraulic Flow Management',
      subtitleTa: existingSlides?.[1]?.subtitleTa || 'ஹைட்ராலிக் ஓட்ட மேலாண்மை',
      tagline:
        existingSlides?.[1]?.tagline ||
        'Executing roads, culverts, dredging works, retaining walls, under-sluices, and water resource projects that strengthen communities and support sustainable growth.',
      taglineTa:
        existingSlides?.[1]?.taglineTa ||
        'சமூகங்களை வலுப்படுத்தும் மற்றும் நிலையான வளர்ச்சியை ஆதரிக்கும் சாலைகள், பாலங்கள், தூர்வாருதல் பணிகள், தடுப்புச் சுவர்கள், மதகுகள் மற்றும் நீர் வளத் திட்டங்களை செயல்படுத்துதல்.',
    },
    {
      badge: existingSlides?.[2]?.badge || 'Emergency Ready',
      badgeTa: existingSlides?.[2]?.badgeTa || 'அவசரகால தயார் நிலை',
      title: existingSlides?.[2]?.title || 'Tractor-Driven Dewatering Pumps &\nHigh-Capacity 100 HP Pumping Solutions',
      titleTa: existingSlides?.[2]?.titleTa || 'டிராக்டர் மூலம் இயக்கப்படும் நீர் வெளியேற்றும் பம்புகள் மற்றும்\nஅதிவேக 100 HP நீர் வெளியேற்றும் தீர்வுகள்',
      subtitle: existingSlides?.[2]?.subtitle || 'Disaster Relief Management',
      subtitleTa: existingSlides?.[2]?.subtitleTa || 'பேரிடர் நிவாரண மேலாண்மை',
      tagline:
        existingSlides?.[2]?.tagline ||
        'Delivering reliable dewatering, flood control, excavation drainage, lake desilting, and emergency pumping solutions for construction and CMRL projects, with expertise in dewatering for metro construction works, including column pit excavations.',
      taglineTa:
        existingSlides?.[2]?.taglineTa ||
        'கட்டுமானம் மற்றும் CMRL திட்டங்களுக்கு நம்பகமான நீர் வெளியேற்றம், வெள்ளக் கட்டுப்பாடு, அகழ்வாராய்ச்சி வடிகால், ஏரி தூர்வாருதல் மற்றும் அவசர பம்பிங் தீர்வுகளை வழங்குதல், தூண் குழி அகழ்வாராய்ச்சி உட்பட மெட்ரோ கட்டுமானப் பணிகளுக்கான நீர் வெளியேற்ற நிபுணத்துவத்துடன்.',
    },
  ];

  if (existingSlides && existingSlides.length > 3) {
    return [...defaults, ...existingSlides.slice(3)];
  }
  return defaults;
};

export const HeroTab: React.FC<HeroTabProps> = ({
  content,
  updateSection,
  onDirtyChange,
  onSavingChange,
  onSaveToast,
}) => {
  const [slides, setSlides] = useState<HeroSlide[]>(() => getInitialSlides(content?.hero));
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeLang, setActiveLang] = useState<EditorLanguage>('en');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialRef = useRef<string>(JSON.stringify(getInitialSlides(content?.hero)));
  const heroContentJson = JSON.stringify(content?.hero);

  useEffect(() => {
    if (content?.hero) {
      const next = getInitialSlides(content.hero);
      setSlides(next);
      initialRef.current = JSON.stringify(next);
    }
  }, [heroContentJson]);

  const isDirty = useMemo(() => JSON.stringify(slides) !== initialRef.current, [slides]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    onSavingChange?.(saving);
  }, [saving, onSavingChange]);

  const safeIndex = Math.min(activeSlideIndex, Math.max(0, slides.length - 1));
  const activeSlide = slides[safeIndex];

  const handleSlideChange = (index: number, field: keyof HeroSlide, value: string) => {
    setSlides((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const handleCopyEnToTa = () => {
    if (!activeSlide) return;
    setSlides((prev) => {
      const updated = [...prev];
      updated[safeIndex] = {
        ...updated[safeIndex],
        badgeTa: updated[safeIndex].badgeTa?.trim() ? updated[safeIndex].badgeTa : updated[safeIndex].badge,
        subtitleTa: updated[safeIndex].subtitleTa?.trim() ? updated[safeIndex].subtitleTa : updated[safeIndex].subtitle,
        titleTa: updated[safeIndex].titleTa?.trim() ? updated[safeIndex].titleTa : updated[safeIndex].title,
        taglineTa: updated[safeIndex].taglineTa?.trim() ? updated[safeIndex].taglineTa : updated[safeIndex].tagline,
      };
      return updated;
    });
  };

  const handleAddSlide = () => {
    const nextSlide: HeroSlide = {
      badge: 'Accredited Contractor',
      badgeTa: 'அங்கீகரிக்கப்பட்ட ஒப்பந்ததாரர்',
      title: 'New Hero Slide Headline',
      titleTa: 'புதிய முகப்பு தலைப்பு',
      subtitle: 'Civil & Dewatering Division',
      subtitleTa: 'சிவில் மற்றும் நீர் வெளியேற்றப் பிரிவு',
      tagline: 'Describe the core capability or service highlighted on this slide.',
      taglineTa: 'இந்த ஸ்லைடில் சிறப்பிக்கப்படும் முக்கிய சேவையை விவரிக்கவும்.',
    };
    setSlides((prev) => [...prev, nextSlide]);
    setActiveSlideIndex(slides.length);
  };

  const handleRemoveSlide = (index: number) => {
    if (slides.length <= 1) return;
    setSlides((prev) => prev.filter((_, i) => i !== index));
    setActiveSlideIndex((prev) => (prev >= index ? Math.max(0, prev - 1) : prev));
  };

  const handleMoveSlide = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;
    setSlides((prev) => {
      const next = [...prev];
      const temp = next[target];
      next[target] = next[index];
      next[index] = temp;
      return next;
    });
    setActiveSlideIndex(target);
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
      initialRef.current = JSON.stringify(slides);
      onDirtyChange?.(false);
      setSaveSuccess(true);
      onSaveToast?.('Hero section saved successfully.');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving Hero section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form id="cms-active-section-form" onSubmit={handleSave} className="space-y-6">
      <SectionHeader
        title="Hero Section"
        description="Configure homepage hero carousel slides in English and Tamil."
        icon={<Layout className="w-5 h-5" />}
        saving={saving}
        saveLabel="Save Hero Content"
        isDirty={isDirty}
        saveSuccess={saveSuccess ? 'Hero slides updated and synced live.' : null}
        errorMsg={errorMsg}
      />

      <SectionCard
        title="Hero carousel slides"
        description="Select a slide tab below to edit its headline, badge, subtitle, and tagline. Slide 1 also populates fallback summary metadata."
        headerAction={
          <button
            type="button"
            onClick={handleAddSlide}
            className="h-9 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-brand-gold-300 border border-brand-gold-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors duration-150 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Slide</span>
          </button>
        }
      >
        {/* Slide Switcher Tabs + Reorder/Delete */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-1.5 p-1 bg-[#050d1a] border border-white/10 rounded-xl overflow-x-auto max-w-full">
            {slides.map((_, idx) => {
              const isCurrent = idx === safeIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`h-8 px-3.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                    isCurrent
                      ? 'bg-brand-gold-500 text-brand-blue-950 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Slide {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleMoveSlide(safeIndex, -1)}
              disabled={safeIndex === 0}
              className="h-8 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 disabled:opacity-35 disabled:pointer-events-none flex items-center gap-1 cursor-pointer transition-colors"
              title="Move slide earlier"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Earlier</span>
            </button>
            <button
              type="button"
              onClick={() => handleMoveSlide(safeIndex, 1)}
              disabled={safeIndex === slides.length - 1}
              className="h-8 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 disabled:opacity-35 disabled:pointer-events-none flex items-center gap-1 cursor-pointer transition-colors"
              title="Move slide later"
            >
              <span className="hidden sm:inline">Later</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {slides.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveSlide(safeIndex)}
                className="h-8 px-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-xs text-red-400 flex items-center gap-1 cursor-pointer transition-colors"
                title="Remove this slide"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Remove</span>
              </button>
            )}
          </div>
        </div>

        {/* Language Toggle */}
        <LanguageTabs
          activeLang={activeLang}
          onChange={setActiveLang}
          onCopyEnToTa={handleCopyEnToTa}
          copyLabel="Copy EN to empty TA fields"
        />

        {activeSlide && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            {activeLang === 'en' ? (
              <>
                <div>
                  <FieldLabel htmlFor={`hero-badge-en-${safeIndex}`} label="Hero badge" />
                  <input
                    id={`hero-badge-en-${safeIndex}`}
                    type="text"
                    value={activeSlide.badge}
                    onChange={(e) => handleSlideChange(safeIndex, 'badge', e.target.value)}
                    className={inputBaseClasses}
                    placeholder="e.g. State PWD & WRD Empaneled"
                  />
                  <HelperText>Short accreditation pill shown above the slide headline.</HelperText>
                </div>

                <div>
                  <FieldLabel htmlFor={`hero-subtitle-en-${safeIndex}`} label="Subtitle" />
                  <input
                    id={`hero-subtitle-en-${safeIndex}`}
                    type="text"
                    value={activeSlide.subtitle}
                    onChange={(e) => handleSlideChange(safeIndex, 'subtitle', e.target.value)}
                    className={inputBaseClasses}
                    placeholder="e.g. Government Accredited Contractor"
                  />
                  <HelperText>Secondary discipline label displayed below the title.</HelperText>
                </div>

                <div className="md:col-span-2">
                  <FieldLabel htmlFor={`hero-title-en-${safeIndex}`} label="Primary title" required />
                  <input
                    id={`hero-title-en-${safeIndex}`}
                    type="text"
                    value={activeSlide.title}
                    onChange={(e) => handleSlideChange(safeIndex, 'title', e.target.value)}
                    className={inputBaseClasses}
                    placeholder="e.g. Precision Civil Engineering & Heavy Dewatering Solutions"
                  />
                </div>

                <div className="md:col-span-2">
                  <FieldLabel
                    htmlFor={`hero-tagline-en-${safeIndex}`}
                    label="Tagline / description"
                    rightSlot={<CharacterCounter value={activeSlide.tagline} recommendedMax={240} />}
                  />
                  <textarea
                    id={`hero-tagline-en-${safeIndex}`}
                    rows={3}
                    value={activeSlide.tagline}
                    onChange={(e) => handleSlideChange(safeIndex, 'tagline', e.target.value)}
                    className={textareaBaseClasses}
                    placeholder="e.g. Delivering reliable dewatering, flood control, and emergency pumping solutions..."
                  />
                  <HelperText>Keep concise (around 160–240 characters) so hero CTAs remain above the fold.</HelperText>
                </div>
              </>
            ) : (
              <>
                <div>
                  <FieldLabel htmlFor={`hero-badge-ta-${safeIndex}`} label="Hero badge (Tamil)" />
                  <input
                    id={`hero-badge-ta-${safeIndex}`}
                    type="text"
                    value={activeSlide.badgeTa || ''}
                    onChange={(e) => handleSlideChange(safeIndex, 'badgeTa', e.target.value)}
                    className={inputBaseClasses}
                    placeholder="எ.கா. மாநில PWD & WRD சான்றளிக்கப்பட்டவை"
                  />
                </div>

                <div>
                  <FieldLabel htmlFor={`hero-subtitle-ta-${safeIndex}`} label="Subtitle (Tamil)" />
                  <input
                    id={`hero-subtitle-ta-${safeIndex}`}
                    type="text"
                    value={activeSlide.subtitleTa || ''}
                    onChange={(e) => handleSlideChange(safeIndex, 'subtitleTa', e.target.value)}
                    className={inputBaseClasses}
                    placeholder="எ.கா. அங்கீகரிக்கப்பட்ட சிவில் கட்டுமானம்"
                  />
                </div>

                <div className="md:col-span-2">
                  <FieldLabel htmlFor={`hero-title-ta-${safeIndex}`} label="Primary title (Tamil)" />
                  <input
                    id={`hero-title-ta-${safeIndex}`}
                    type="text"
                    value={activeSlide.titleTa || ''}
                    onChange={(e) => handleSlideChange(safeIndex, 'titleTa', e.target.value)}
                    className={inputBaseClasses}
                    placeholder="எ.கா. துல்லியமான சிவில் பொறியியல் மற்றும் கனரக நீர் வெளியேற்றும் தீர்வுகள்"
                  />
                </div>

                <div className="md:col-span-2">
                  <FieldLabel
                    htmlFor={`hero-tagline-ta-${safeIndex}`}
                    label="Tagline / description (Tamil)"
                    rightSlot={<CharacterCounter value={activeSlide.taglineTa || ''} recommendedMax={260} />}
                  />
                  <textarea
                    id={`hero-tagline-ta-${safeIndex}`}
                    rows={3}
                    value={activeSlide.taglineTa || ''}
                    onChange={(e) => handleSlideChange(safeIndex, 'taglineTa', e.target.value)}
                    className={textareaBaseClasses}
                    placeholder="தமிழில் விரிவான விளக்கம்..."
                  />
                </div>
              </>
            )}
          </div>
        )}
      </SectionCard>
    </form>
  );
};
