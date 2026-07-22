import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { FullSiteContent, ProjectItem } from '../../context/SiteContentContext';
import { EditableItemList } from './EditableItemList';
import { ImageField } from './ImageField';

interface ProjectsTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({ content, updateSection }) => {
  const [projects, setProjects] = useState<ProjectItem[]>([...content.projects.projects]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg(null);

    try {
      await updateSection('projects', { projects });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving Projects section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  const createNewProject = (): ProjectItem => ({
    id: `project_${Date.now()}`,
    title: 'New Infrastructure Works Project',
    description: 'Detailed description of execution and equipment deployed...',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&q=80',
    year: '2025',
    status: 'Completed',
    location: 'Tamil Nadu Region',
  });

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-display font-bold text-white">Projects Showcase</h2>
          <p className="text-xs text-neutral-400">Manage featured projects, descriptions, execution photos, locations, and completion status.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Projects'}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Projects updated successfully in Firestore real-time!
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <EditableItemList<ProjectItem>
        title="Project Showcase Portfolio"
        items={projects}
        onUpdateItems={setProjects}
        createNewItem={createNewProject}
        getItemTitle={(item) => item.title || 'Untitled Project'}
        addButtonText="Add New Project"
        renderItemFields={(item, idx, updateItem) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                Project Title
              </label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem({ ...item, title: e.target.value })}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                Execution Year
              </label>
              <input
                type="text"
                value={item.year}
                onChange={(e) => updateItem({ ...item, year: e.target.value })}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                Status (e.g. Completed, In Progress)
              </label>
              <input
                type="text"
                value={item.status}
                onChange={(e) => updateItem({ ...item, status: e.target.value })}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                Location
              </label>
              <input
                type="text"
                value={item.location}
                onChange={(e) => updateItem({ ...item, location: e.target.value })}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <ImageField
                label="Project Execution Image"
                value={item.imageUrl}
                onChange={(url) => updateItem({ ...item, imageUrl: url })}
                section="projects"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-1">
                Full Description & Engineering Specs
              </label>
              <textarea
                rows={3}
                value={item.description}
                onChange={(e) => updateItem({ ...item, description: e.target.value })}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
              />
            </div>
          </div>
        )}
      />
    </form>
  );
};
