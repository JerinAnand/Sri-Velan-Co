import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { FullSiteContent, BoardMemberItem } from '../../context/SiteContentContext';
import { EditableItemList } from './EditableItemList';
import { ImageField } from './ImageField';
import { getRoleIcon } from '../AboutView';

interface GoverningBoardTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
}

export const GoverningBoardTab: React.FC<GoverningBoardTabProps> = ({ content, updateSection }) => {
  const [boardMembers, setBoardMembers] = useState<BoardMemberItem[]>([...content.governingBoard.boardMembers]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg(null);

    try {
      await updateSection('governingBoard', { boardMembers });
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
          <p className="text-xs text-neutral-400">Manage leadership photos, names, designations, and bios.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Save Governing Board' : 'Save Governing Board'}
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
