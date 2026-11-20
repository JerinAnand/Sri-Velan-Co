import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Users, Crown, UserCheck, ShieldCheck } from 'lucide-react';
import {
  FullSiteContent,
  BoardMemberItem,
  FeaturedLeaderProfile,
  DEFAULT_SITE_CONTENT,
} from '../../context/SiteContentContext';
import { EditableItemList } from './EditableItemList';
import { ImageField } from './ImageField';
import { getRoleIcon } from '../AboutView';
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

interface GoverningBoardTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
  onDirtyChange?: (dirty: boolean) => void;
  onSavingChange?: (saving: boolean) => void;
  onSaveToast?: (msg: string) => void;
}

const defaultFeatured = DEFAULT_SITE_CONTENT.governingBoard.featuredProfiles || {
  governingPartner: {
    name: 'Mr. G. Selva Kumar',
    role: 'Founder & Governing Partner',
    photoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDtJTJScjD1s9E1gXlzJfWddGbDvVSX1Eh7cDvjCoMr81sYw4pZArZnM0ZZ5oUtaoYur4V-yYXukv1kqHT3iECpg-9uMT3_3nK--tX8irTP9bA1AqCrBte1YO4Y6B6N4nWLywI4REBwFYf3jWP06osetab2iwqHgbxlAtMw28gMhwsSOAPOYu6PUop4hoFmfDsOOKpzbR2ap4Vddzy_0StLNZTEukavQNu0eoyvd2lzSCIIPGj-1VOMPHDnK5ZNDb3ZvNYdJARXSVjN',
    bioEn:
      'With over two decades of robust experience in civil contracting and disaster dewatering services across Tamil Nadu, Mr. Selva Kumar leads the engineering team with a relentless commitment to execution precision, compliance, and rapid community rescue response during environmental emergencies.',
    bioTa:
      'தமிழ்நாடு முழுவதும் சிவில் ஒப்பந்தப் பணிகள் மற்றும் பேரிடர் கால நீர் வெளியேற்றும் சேவைகளில் இரண்டு தசாப்தங்களுக்கும் மேலான வலுவான அனுபவத்துடன், திரு. செல்வா குமார் அவர்கள் சுற்றுச்சூழல் அவசரநிலைகளின் போது துல்லியமான செயல்பாடுகள், இணக்கங்கள் மற்றும் விரைவான சமூக மீட்புப் பணிகளுக்கான அசைக்க முடியாத அர்ப்பணிப்புடன் பொறியியல் குழுவை வழிநடத்துகிறார்.',
  },
  managingDirector: {
    name: 'Mr. S. Vetrivel',
    role: 'Managing Director',
    photoUrl: '/src/assets/images/vetrivel-md.jpg',
    bioEn:
      "Mr. Vetrivel S serves as the Managing Director of Sri Velan & Co, overseeing the company's operations across both Chennai and Villupuram project locations. He plays a key role in managing GCC (Greater Chennai Corporation) tenders and CMRL (Chennai Metro Rail Limited) tenders, ensuring compliance, timely execution, and quality delivery across all government engineering projects. With a strong focus on operational efficiency and stakeholder coordination, he bridges strategic planning with on-ground execution across the company's multi-city presence.",
    bioTa:
      'ஸ்ரீ வேலன் & கோ நிறுவனத்தின் நிர்வாக இயக்குநராக திரு. வெற்றிவேல் எஸ் அவர்கள் பணியாற்றுகிறார், சென்னை மற்றும் விழுப்புரம் ஆகிய இரு திட்ட இடங்களிலும் நிறுவனத்தின் செயல்பாடுகளை மேற்பார்வையிடுகிறார். அனைத்து அரசு பொறியியல் திட்டங்களிலும் இணக்கம், சரியான நேரத்தில் செயல்படுத்துதல் மற்றும் தரமான விநியோகம் ஆகியவற்றை உறுதி செய்யும் வகையில், ஜிசிசி (பெருநகர சென்னை மாநகராட்சி) மற்றும் சிஎம்ஆர்எல் (சென்னை மெட்ரோ இரயில் நிறுவனம்) ஒப்பந்தப்புள்ளிகளை (டெண்டர்கள்) நிர்வகிப்பதில் அவர் முக்கிய பங்கு வகிக்கிறார். செயல்பாட்டுத் திறன் மற்றும் பங்குதாரர்களின் ஒருங்கிணைப்பில் வலுவான கவனத்துடன், நிறுவனத்தின் பல நகர உள்கட்டமைப்புகளில் மூலோபாய திட்டமிடலை கள செயல்பாட்டுடன் இணைக்கும் பாலமாக அவர் திகழ்கிறார்.',
  },
};

const getInitialFeatured = (content: FullSiteContent) => ({
  governingPartner: {
    name: content.governingBoard.featuredProfiles?.governingPartner?.name ?? defaultFeatured.governingPartner.name,
    role: content.governingBoard.featuredProfiles?.governingPartner?.role ?? defaultFeatured.governingPartner.role,
    photoUrl:
      content.governingBoard.featuredProfiles?.governingPartner?.photoUrl ?? defaultFeatured.governingPartner.photoUrl,
    bioEn: content.governingBoard.featuredProfiles?.governingPartner?.bioEn ?? defaultFeatured.governingPartner.bioEn,
    bioTa: content.governingBoard.featuredProfiles?.governingPartner?.bioTa ?? defaultFeatured.governingPartner.bioTa,
  },
  managingDirector: {
    name: content.governingBoard.featuredProfiles?.managingDirector?.name ?? defaultFeatured.managingDirector.name,
    role: content.governingBoard.featuredProfiles?.managingDirector?.role ?? defaultFeatured.managingDirector.role,
    photoUrl:
      content.governingBoard.featuredProfiles?.managingDirector?.photoUrl ?? defaultFeatured.managingDirector.photoUrl,
    bioEn: content.governingBoard.featuredProfiles?.managingDirector?.bioEn ?? defaultFeatured.managingDirector.bioEn,
    bioTa: content.governingBoard.featuredProfiles?.managingDirector?.bioTa ?? defaultFeatured.managingDirector.bioTa,
  },
});

export const GoverningBoardTab: React.FC<GoverningBoardTabProps> = ({
  content,
  updateSection,
  onDirtyChange,
  onSavingChange,
  onSaveToast,
}) => {
  const [boardMembers, setBoardMembers] = useState<BoardMemberItem[]>([...content.governingBoard.boardMembers]);
  const [featuredProfiles, setFeaturedProfiles] = useState(() => getInitialFeatured(content));
  const [activeLeader, setActiveLeader] = useState<'governingPartner' | 'managingDirector'>('governingPartner');
  const [activeLang, setActiveLang] = useState<EditorLanguage>('en');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialRef = useRef<string>(
    JSON.stringify({
      boardMembers: content.governingBoard.boardMembers,
      featuredProfiles: getInitialFeatured(content),
    })
  );
  const boardJson = JSON.stringify(content.governingBoard);

  useEffect(() => {
    const nextFeatured = getInitialFeatured(content);
    setBoardMembers([...content.governingBoard.boardMembers]);
    setFeaturedProfiles(nextFeatured);
    initialRef.current = JSON.stringify({
      boardMembers: content.governingBoard.boardMembers,
      featuredProfiles: nextFeatured,
    });
  }, [boardJson]);

  const isDirty = useMemo(
    () =>
      JSON.stringify({ boardMembers, featuredProfiles }) !== initialRef.current,
    [boardMembers, featuredProfiles]
  );

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    onSavingChange?.(saving);
  }, [saving, onSavingChange]);

  const updateFeatured = (
    person: 'governingPartner' | 'managingDirector',
    field: keyof FeaturedLeaderProfile,
    value: string
  ) => {
    setFeaturedProfiles((prev) => ({
      ...prev,
      [person]: {
        ...prev[person],
        [field]: value,
      },
    }));
  };

  const handleCopyEnToTa = () => {
    const current = featuredProfiles[activeLeader];
    if (!current.bioTa?.trim()) {
      updateFeatured(activeLeader, 'bioTa', current.bioEn);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg(null);

    try {
      await updateSection('governingBoard', {
        ...content.governingBoard,
        featuredProfiles,
        boardMembers,
      });
      initialRef.current = JSON.stringify({ boardMembers, featuredProfiles });
      onDirtyChange?.(false);
      setSaveSuccess(true);
      onSaveToast?.('Leadership & governing board saved successfully.');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving Governing Board section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  const createNewMember = (): BoardMemberItem => ({
    id: `member_${Date.now()}`,
    name: 'Executive Name',
    designation: 'Designation / Title',
    photoUrl: '',
    bio: 'Executive summary & responsibility details...',
  });

  const currentLeaderProfile = featuredProfiles[activeLeader];

  return (
    <form id="cms-active-section-form" onSubmit={handleSave} className="space-y-6">
      <SectionHeader
        title="Leadership"
        description="Manage featured executive profiles, team member photos, designations, and biographies."
        icon={<Users className="w-5 h-5" />}
        saving={saving}
        saveLabel="Save Leadership"
        isDirty={isDirty}
        saveSuccess={saveSuccess ? 'Governing board updated successfully.' : null}
        errorMsg={errorMsg}
      />

      {/* Featured Leadership Profiles Card */}
      <SectionCard
        title="Featured leadership profiles"
        description="Primary executive cards displayed prominently on the About Us page."
        headerAction={
          <div className="inline-flex items-center p-1 rounded-xl bg-[#050d1a] border border-white/10">
            <button
              type="button"
              onClick={() => setActiveLeader('governingPartner')}
              className={`h-8 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-150 cursor-pointer whitespace-nowrap ${
                activeLeader === 'governingPartner'
                  ? 'bg-brand-gold-500 text-brand-blue-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Governing Partner</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveLeader('managingDirector')}
              className={`h-8 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-150 cursor-pointer whitespace-nowrap ${
                activeLeader === 'managingDirector'
                  ? 'bg-brand-gold-500 text-brand-blue-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Managing Director</span>
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <FieldLabel htmlFor="leader-name" label="Full name" required />
            <input
              id="leader-name"
              type="text"
              value={currentLeaderProfile.name}
              onChange={(e) => updateFeatured(activeLeader, 'name', e.target.value)}
              className={inputBaseClasses}
              placeholder="e.g. Mr. G. Selva Kumar"
            />
          </div>

          <div>
            <FieldLabel htmlFor="leader-role" label="Role / title" required />
            <input
              id="leader-role"
              type="text"
              value={currentLeaderProfile.role}
              onChange={(e) => updateFeatured(activeLeader, 'role', e.target.value)}
              className={inputBaseClasses}
              placeholder="e.g. Founder & Governing Partner"
            />
          </div>

          <div className="md:col-span-2">
            <ImageField
              label="Profile photo"
              value={currentLeaderProfile.photoUrl}
              onChange={(url) => updateFeatured(activeLeader, 'photoUrl', url)}
              section="leadership"
              helperText="Portrait aspect ratio (3:4 or 1:1) works best."
            />
          </div>
        </div>

        <div className="pt-2 border-t border-white/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
              <Crown className="w-4 h-4 text-brand-gold-400" />
              <span>Executive biography</span>
            </div>
            <LanguageTabs
              activeLang={activeLang}
              onChange={setActiveLang}
              onCopyEnToTa={handleCopyEnToTa}
            />
          </div>

          {activeLang === 'en' ? (
            <div>
              <FieldLabel
                htmlFor="leader-bio-en"
                label="Biography (English)"
                rightSlot={<CharacterCounter value={currentLeaderProfile.bioEn || ''} recommendedMax={500} />}
              />
              <textarea
                id="leader-bio-en"
                rows={4}
                value={currentLeaderProfile.bioEn}
                onChange={(e) => updateFeatured(activeLeader, 'bioEn', e.target.value)}
                className={textareaBaseClasses}
                placeholder="Executive background, responsibilities, and credentials..."
              />
            </div>
          ) : (
            <div>
              <FieldLabel
                htmlFor="leader-bio-ta"
                label="Biography (Tamil)"
                rightSlot={<CharacterCounter value={currentLeaderProfile.bioTa || ''} recommendedMax={550} />}
              />
              <textarea
                id="leader-bio-ta"
                rows={4}
                value={currentLeaderProfile.bioTa}
                onChange={(e) => updateFeatured(activeLeader, 'bioTa', e.target.value)}
                className={textareaBaseClasses}
                placeholder="தமிழ் சுயவிவரம்..."
              />
            </div>
          )}
        </div>
      </SectionCard>

      {/* Governing Board Team Repeater */}
      <SectionCard>
        <EditableItemList<BoardMemberItem>
          title="Leadership team members"
          description="Additional leadership and technical governance roles displayed in the team grid."
          items={boardMembers}
          onUpdateItems={setBoardMembers}
          createNewItem={createNewMember}
          getItemTitle={(item) => item.name || 'Executive member'}
          getItemSubtitle={(item) => item.designation || 'Role not specified'}
          addButtonText="Add Board Member"
          renderItemFields={(item, idx, updateItem) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <FieldLabel htmlFor={`member-name-${idx}`} label="Full name" required />
                <input
                  id={`member-name-${idx}`}
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem({ ...item, name: e.target.value })}
                  className={inputBaseClasses}
                  placeholder="e.g. Er. R. Karthik"
                />
              </div>

              <div>
                <FieldLabel
                  htmlFor={`member-role-${idx}`}
                  label="Designation / role"
                  rightSlot={
                    <span className="inline-flex items-center gap-1 text-xs text-brand-gold-300">
                      {getRoleIcon(item.designation)}
                      <span>Preview</span>
                    </span>
                  }
                />
                <input
                  id={`member-role-${idx}`}
                  type="text"
                  value={item.designation}
                  onChange={(e) => updateItem({ ...item, designation: e.target.value })}
                  className={inputBaseClasses}
                  placeholder="e.g. Chief Operations Engineer"
                />
              </div>

              <div className="md:col-span-2">
                <ImageField
                  label="Profile photo"
                  value={item.photoUrl || ''}
                  onChange={(url) => updateItem({ ...item, photoUrl: url })}
                  section="leadership"
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel
                  htmlFor={`member-bio-${idx}`}
                  label="Biography / summary"
                  rightSlot={<CharacterCounter value={item.bio || ''} recommendedMax={300} />}
                />
                <textarea
                  id={`member-bio-${idx}`}
                  rows={3}
                  value={item.bio}
                  onChange={(e) => updateItem({ ...item, bio: e.target.value })}
                  className={textareaBaseClasses}
                  placeholder="Brief summary of responsibilities and civil engineering experience..."
                />
                <HelperText>Keep concise for balanced card heights on the About Us page.</HelperText>
              </div>
            </div>
          )}
        />
      </SectionCard>
    </form>
  );
};
