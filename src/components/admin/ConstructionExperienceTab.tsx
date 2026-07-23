import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Plus, Trash2, Layers } from 'lucide-react';
import { FullSiteContent } from '../../context/SiteContentContext';
import { ConstructionCategory, ConstructionProjectEntry } from '../../types';
import { ImageField } from './ImageField';

interface ConstructionExperienceTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
}

export const ConstructionExperienceTab: React.FC<ConstructionExperienceTabProps> = ({ content, updateSection }) => {
  const [categories, setCategories] = useState<ConstructionCategory[]>(
    content.constructionExperience?.categories || []
  );
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg(null);

    try {
      await updateSection('constructionExperience', { categories });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving Construction Experience section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  const updateCategoryTitle = (catIdx: number, lang: 'en' | 'ta', value: string) => {
    setCategories((prev) => {
      const next = [...prev];
      next[catIdx] = {
        ...next[catIdx],
        title: {
          ...next[catIdx].title,
          [lang]: value,
        },
      };
      return next;
    });
  };

  const updateCategoryImage = (catIdx: number, imageUrl: string) => {
    setCategories((prev) => {
      const next = [...prev];
      next[catIdx] = {
        ...next[catIdx],
        image: imageUrl,
      };
      return next;
    });
  };

  const updateProjectEntry = (catIdx: number, projIdx: number, lang: 'en' | 'ta', value: string) => {
    setCategories((prev) => {
      const next = [...prev];
      const updatedProjects = [...next[catIdx].projects];
      updatedProjects[projIdx] = {
        ...updatedProjects[projIdx],
        [lang]: value,
      };
      next[catIdx] = {
        ...next[catIdx],
        projects: updatedProjects,
      };
      return next;
    });
  };

  const addProjectEntry = (catIdx: number) => {
    setCategories((prev) => {
      const next = [...prev];
      const updatedProjects = [
        ...next[catIdx].projects,
        { en: 'New project entry description...', ta: 'புதிய திட்ட விவரம்...' },
      ];
      next[catIdx] = {
        ...next[catIdx],
        projects: updatedProjects,
      };
      return next;
    });
  };

  const deleteProjectEntry = (catIdx: number, projIdx: number) => {
    setCategories((prev) => {
      const next = [...prev];
      const updatedProjects = next[catIdx].projects.filter((_, idx) => idx !== projIdx);
      next[catIdx] = {
        ...next[catIdx],
        projects: updatedProjects,
      };
      return next;
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-gold-400" />
            Construction Experience (Brochure Records)
          </h2>
          <p className="text-xs text-neutral-400">
            Edit department categories, bilingual titles (English & Tamil), brochure photos, and project bullet entries displayed on the /projects page.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Construction Experience'}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Construction Experience updated successfully in Firestore real-time!
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="space-y-8">
        {categories.map((cat, catIdx) => (
          <div key={cat.id || catIdx} className="bg-neutral-900 border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono font-bold text-brand-gold-400 uppercase tracking-widest">
                Category #{catIdx + 1}: {cat.id}
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                {cat.projects.length} Project Entries
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                  Category Title (English)
                </label>
                <input
                  type="text"
                  value={cat.title?.en || ''}
                  onChange={(e) => updateCategoryTitle(catIdx, 'en', e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                  Category Title (Tamil) / தலைப்பு (தமிழ்)
                </label>
                <input
                  type="text"
                  value={cat.title?.ta || ''}
                  onChange={(e) => updateCategoryTitle(catIdx, 'ta', e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <ImageField
                  label="Category Cover Image Path / URL"
                  value={cat.image || ''}
                  onChange={(url) => updateCategoryImage(catIdx, url)}
                  section="construction"
                />
              </div>
            </div>

            {/* Project entries list for this category */}
            <div className="space-y-4 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Project Bullet Entries ({cat.projects.length})
                </h4>
                <button
                  type="button"
                  onClick={() => addProjectEntry(catIdx)}
                  className="bg-white/10 hover:bg-white/20 text-brand-gold-300 hover:text-brand-gold-200 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer font-mono"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Project Entry
                </button>
              </div>

              <div className="space-y-4">
                {cat.projects.map((proj, projIdx) => (
                  <div key={projIdx} className="bg-neutral-950 border border-white/5 p-4 rounded-xl space-y-3 relative group">
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 border-b border-white/5 pb-2">
                      <span>Entry #{projIdx + 1}</span>
                      <button
                        type="button"
                        onClick={() => deleteProjectEntry(catIdx, projIdx)}
                        className="text-red-400 hover:text-red-300 transition-colors p-1 flex items-center gap-1 cursor-pointer"
                        title="Delete project entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">
                          Description (English)
                        </label>
                        <textarea
                          rows={2}
                          value={proj.en || ''}
                          onChange={(e) => updateProjectEntry(catIdx, projIdx, 'en', e.target.value)}
                          className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">
                          Description (Tamil / தமிழ்)
                        </label>
                        <textarea
                          rows={2}
                          value={proj.ta || ''}
                          onChange={(e) => updateProjectEntry(catIdx, projIdx, 'ta', e.target.value)}
                          className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
};
