import React, { useState, useCallback } from 'react';
import { Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { FullSiteContent, ProjectItem } from '../../context/SiteContentContext';
import { EditableItemList } from './EditableItemList';
import { ImageField } from './ImageField';

interface ProjectsTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
}

export const ProjectsTabComponent: React.FC<ProjectsTabProps> = ({ content, updateSection }) => {
  const [projects, setProjects] = useState<ProjectItem[]>([...(content.projects?.projects || [])]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(null);
    setErrorMsg(null);

    // Schema Validation for Projects
    if (!projects || projects.length === 0) {
      setErrorMsg('At least one project entry is required.');
      setSaving(false);
      return;
    }

    const invalidIndex = projects.findIndex(
      (p) => !p.title || !p.title.trim() || !p.description || !p.description.trim()
    );

    if (invalidIndex !== -1) {
      setErrorMsg(`Project Item #${invalidIndex + 1} requires both a Title and Description.`);
      setSaving(false);
      return;
    }

    // Cleaned payload compliant with Firestore schema
    const cleanedProjects: ProjectItem[] = projects.map((proj) => ({
      id: proj.id || `project_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: proj.title.trim(),
      description: proj.description.trim(),
      imageUrl: proj.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&q=80',
      year: proj.year ? String(proj.year).trim() : '2025',
      status: proj.status ? String(proj.status).trim() : 'Completed',
      location: proj.location ? String(proj.location).trim() : 'Tamil Nadu Region',
    }));

    try {
      await updateSection('projects', { projects: cleanedProjects });
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSaveSuccess(`Projects showcase portfolio updated successfully at ${now}!`);
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err: any) {
      console.error('Error saving Projects section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  const createNewProject = useCallback(
    (): ProjectItem => ({
      id: `project_${Date.now()}`,
      title: 'New Infrastructure Works Project',
      description: 'Detailed description of execution and equipment deployed...',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&q=80',
      year: '2025',
      status: 'Completed',
      location: 'Tamil Nadu Region',
    }),
    []
  );

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-display font-bold text-white">Projects Showcase</h2>
          <p className="text-xs text-neutral-400">
            Manage featured projects, descriptions, execution photos, locations, and completion status.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin text-brand-blue-950" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Projects'}
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
                Project Title *
              </label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem({ ...item, title: e.target.value })}
                placeholder="e.g. Major Highway Dewatering Work"
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
                placeholder="2025"
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
                placeholder="Completed"
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
                placeholder="Chennai / Tamil Nadu"
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
                Full Description & Engineering Specs *
              </label>
              <textarea
                rows={3}
                value={item.description}
                onChange={(e) => updateItem({ ...item, description: e.target.value })}
                placeholder="Details of machinery, execution timeline, and volume handled..."
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500/80 font-mono"
              />
            </div>
          </div>
        )}
      />
    </form>
  );
};

export const ProjectsTab = React.memo(ProjectsTabComponent);

