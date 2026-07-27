import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Crown, UserCheck, ShieldCheck } from 'lucide-react';
import { FullSiteContent, BoardMemberItem, FeaturedLeaderProfile, DEFAULT_SITE_CONTENT } from '../../context/SiteContentContext';
import { EditableItemList } from './EditableItemList';
import { ImageField } from './ImageField';
import { getRoleIcon } from '../AboutView';

interface GoverningBoardTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
}

export const GoverningBoardTab: React.FC<GoverningBoardTabProps> = ({ content, updateSection }) => {
  const [boardMembers, setBoardMembers] = useState<BoardMemberItem[]>([...content.governingBoard.boardMembers]);

  const defaultFeatured = DEFAULT_SITE_CONTENT.governingBoard.featuredProfiles || {
    governingPartner: {
      name: 'Mr. G. Selva Kumar',
      role: 'Founder & Governing Partner',
      photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtJTJScjD1s9E1gXlzJfWddGbDvVSX1Eh7cDvjCoMr81sYw4pZArZnM0ZZ5oUtaoYur4V-yYXukv1kqHT3iECpg-9uMT3_3nK--tX8irTP9bA1AqCrBte1YO4Y6B6N4nWLywI4REBwFYf3jWP06osetab2iwqHgbxlAtMw28gMhwsSOAPOYu6PUop4hoFmfDsOOKpzbR2ap4Vddzy_0StLNZTEukavQNu0eoyvd2lzSCIIPGj-1VOMPHDnK5ZNDb3ZvNYdJARXSVjN',
      bioEn: 'With over two decades of robust experience in civil contracting and disaster dewatering services across Tamil Nadu, Mr. Selva Kumar leads the engineering team with a relentless commitment to execution precision, compliance, and rapid community rescue response during environmental emergencies.',
      bioTa: 'தமிழ்நாடு முழுவதும் சிவில் ஒப்பந்தப் பணிகள் மற்றும் பேரிடர் கால நீர் வெளியேற்றும் சேவைகளில் இரண்டு தசாப்தங்களுக்கும் மேலான வலுவான அனுபவத்துடன், திரு. செல்வா குமார் அவர்கள் சுற்றுச்சூழல் அவசரநிலைகளின் போது துல்லியமான செயல்பாடுகள், இணக்கங்கள் மற்றும் விரைவான சமூக மீட்புப் பணிகளுக்கான அசைக்க முடியாத அர்ப்பணிப்புடன் பொறியியல் குழுவை வழிநடத்துகிறார்.',
    },
    managingDirector: {
      name: 'Mr. S. Vetrivel',
      role: 'Managing Director',
      photoUrl: '/src/assets/images/vetrivel-md.jpg',
      bioEn: "Mr. Vetrivel S serves as the Managing Director of Sri Velan & Co, overseeing the company's operations across both Chennai and Villupuram project locations. He plays a key role in managing GCC (Greater Chennai Corporation) tenders and CMRL (Chennai Metro Rail Limited) tenders, ensuring compliance, timely execution, and quality delivery across all government engineering projects. With a strong focus on operational efficiency and stakeholder coordination, he bridges strategic planning with on-ground execution across the company's multi-city presence.",
      bioTa: 'ஸ்ரீ வேலன் & கோ நிறுவனத்தின் நிர்வாக இயக்குநராக திரு. வெற்றிவேல் எஸ் அவர்கள் பணியாற்றுகிறார், சென்னை மற்றும் விழுப்புரம் ஆகிய இரு திட்ட இடங்களிலும் நிறுவனத்தின் செயல்பாடுகளை மேற்பார்வையிடுகிறார். அனைத்து அரசு பொறியியல் திட்டங்களிலும் இணக்கம், சரியான நேரத்தில் செயல்படுத்துதல் மற்றும் தரமான விநியோகம் ஆகியவற்றை உறுதி செய்யும் வகையில், ஜிசிசி (பெருநகர சென்னை மாநகராட்சி) மற்றும் சிஎம்ஆர்எல் (சென்னை மெட்ரோ இரயில் நிறுவனம்) ஒப்பந்தப்புள்ளிகளை (டெண்டர்கள்) நிர்வகிப்பதில் அவர் முக்கிய பங்கு வகிக்கிறார். செயல்பாட்டுத் திறன் மற்றும் பங்குதாரர்களின் ஒருங்கிணைப்பில் வலுவான கவனத்துடன், நிறுவனத்தின் பல நகர உள்கட்டமைப்புகளில் மூலோபாய திட்டமிடலை கள செயல்பாட்டுடன் இணைக்கும் பாலமாக அவர் திகழ்கிறார்.',
    }
  };

  const [featuredProfiles, setFeaturedProfiles] = useState({
    governingPartner: {
      name: content.governingBoard.featuredProfiles?.governingPartner?.name ?? defaultFeatured.governingPartner.name,
      role: content.governingBoard.featuredProfiles?.governingPartner?.role ?? defaultFeatured.governingPartner.role,
      photoUrl: content.governingBoard.featuredProfiles?.governingPartner?.photoUrl ?? defaultFeatured.governingPartner.photoUrl,
      bioEn: content.governingBoard.featuredProfiles?.governingPartner?.bioEn ?? defaultFeatured.governingPartner.bioEn,
      bioTa: content.governingBoard.featuredProfiles?.governingPartner?.bioTa ?? defaultFeatured.governingPartner.bioTa,
    },
    managingDirector: {
      name: content.governingBoard.featuredProfiles?.managingDirector?.name ?? defaultFeatured.managingDirector.name,
      role: content.governingBoard.featuredProfiles?.managingDirector?.role ?? defaultFeatured.managingDirector.role,
      photoUrl: content.governingBoard.featuredProfiles?.managingDirector?.photoUrl ?? defaultFeatured.managingDirector.photoUrl,
      bioEn: content.governingBoard.featuredProfiles?.managingDirector?.bioEn ?? defaultFeatured.managingDirector.bioEn,
      bioTa: content.governingBoard.featuredProfiles?.managingDirector?.bioTa ?? defaultFeatured.managingDirector.bioTa,
    }
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
      setSaveSuccess(true);
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

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-display font-bold text-white">Governing Board & Leadership</h2>
          <p className="text-xs text-neutral-400">Manage featured leadership profiles, team member photos, names, designations, and bios.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Governing Board'}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Governing Board updated successfully in Firestore real-time!
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Featured Leadership Profiles Section */}
      <div className="bg-neutral-900 border border-white/10 rounded-2xl p-5 space-y-6">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Crown className="w-5 h-5 text-brand-gold-400" />
          <div>
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">
              Featured Leadership Profiles
            </h3>
            <p className="text-[11px] text-neutral-400">
              Configure the primary Governing Partner and Managing Director cards featured on the About page.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Governing Partner Card */}
          <div className="bg-neutral-950 border border-white/10 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-brand-gold-400" />
                <h4 className="text-xs font-mono font-bold text-brand-gold-400 uppercase tracking-wider">
                  Governing Partner
                </h4>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={featuredProfiles.governingPartner.name}
                  onChange={(e) => updateFeatured('governingPartner', 'name', e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                  Role / Title
                </label>
                <input
                  type="text"
                  value={featuredProfiles.governingPartner.role}
                  onChange={(e) => updateFeatured('governingPartner', 'role', e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
                />
              </div>

              <ImageField
                label="Profile Photo URL"
                value={featuredProfiles.governingPartner.photoUrl}
                onChange={(url) => updateFeatured('governingPartner', 'photoUrl', url)}
                section="leadership"
              />

              <div>
                <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                  Biography (English)
                </label>
                <textarea
                  rows={4}
                  value={featuredProfiles.governingPartner.bioEn}
                  onChange={(e) => updateFeatured('governingPartner', 'bioEn', e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                  Biography (Tamil)
                </label>
                <textarea
                  rows={4}
                  value={featuredProfiles.governingPartner.bioTa}
                  onChange={(e) => updateFeatured('governingPartner', 'bioTa', e.target.value)}
                  placeholder="தமிழ் சுயவிவரம்..."
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Managing Director Card */}
          <div className="bg-neutral-950 border border-white/10 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-gold-400" />
                <h4 className="text-xs font-mono font-bold text-brand-gold-400 uppercase tracking-wider">
                  Managing Director
                </h4>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={featuredProfiles.managingDirector.name}
                  onChange={(e) => updateFeatured('managingDirector', 'name', e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                  Role / Title
                </label>
                <input
                  type="text"
                  value={featuredProfiles.managingDirector.role}
                  onChange={(e) => updateFeatured('managingDirector', 'role', e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
                />
              </div>

              <ImageField
                label="Profile Photo URL"
                value={featuredProfiles.managingDirector.photoUrl}
                onChange={(url) => updateFeatured('managingDirector', 'photoUrl', url)}
                section="leadership"
              />

              <div>
                <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                  Biography (English)
                </label>
                <textarea
                  rows={4}
                  value={featuredProfiles.managingDirector.bioEn}
                  onChange={(e) => updateFeatured('managingDirector', 'bioEn', e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                  Biography (Tamil)
                </label>
                <textarea
                  rows={4}
                  value={featuredProfiles.managingDirector.bioTa}
                  onChange={(e) => updateFeatured('managingDirector', 'bioTa', e.target.value)}
                  placeholder="தமிழ் சுயவிவரம்..."
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditableItemList<BoardMemberItem>
        title="Leadership Team"
        items={boardMembers}
        onUpdateItems={setBoardMembers}
        createNewItem={createNewMember}
        getItemTitle={(item) => `${item.name} (${item.designation})`}
        addButtonText="Add Board Member"
        renderItemFields={(item, idx, updateItem) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem({ ...item, name: e.target.value })}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider">
                  Designation / Role
                </label>
                <span className="inline-flex items-center gap-1.5 text-[10px] text-brand-gold-400 font-mono uppercase tracking-wide font-bold bg-brand-gold-500/10 px-2 py-0.5 rounded-full border border-brand-gold-500/20">
                  {getRoleIcon(item.designation)}
                  <span>{item.designation || 'Badge Preview'}</span>
                </span>
              </div>
              <input
                type="text"
                value={item.designation}
                onChange={(e) => updateItem({ ...item, designation: e.target.value })}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <ImageField
                label="Profile Photo URL"
                value={item.photoUrl || ''}
                onChange={(url) => updateItem({ ...item, photoUrl: url })}
                section="leadership"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                Biography / Summary
              </label>
              <textarea
                rows={3}
                value={item.bio}
                onChange={(e) => updateItem({ ...item, bio: e.target.value })}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
              />
            </div>
          </div>
        )}
      />
    </form>
  );
};
