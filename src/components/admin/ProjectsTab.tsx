import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { FolderKanban } from 'lucide-react';
import { FullSiteContent, ProjectItem } from '../../context/SiteContentContext';
import { EditableItemList } from './EditableItemList';
import { ImageField } from './ImageField';
import {
  SectionCard,
  SectionHeader,
  FieldLabel,
  CharacterCounter,
  HelperText,
  inputBaseClasses,
  textareaBaseClasses,
} from './SectionCard';

interface ProjectsTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
  onDirtyChange?: (dirty: boolean) => void;
  onSavingChange?: (saving: boolean) => void;
  onSaveToast?: (msg: string) => void;
}

export const ProjectsTabComponent: React.FC<ProjectsTabProps> = ({
  content,
  updateSection,
  onDirtyChange,
  onSavingChange,
  onSaveToast,
}) => {
  const [projects, setProjects] = useState<ProjectItem[]>([...(content.projects?.projects || [])]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialRef = useRef<string>(JSON.stringify(content.projects?.projects || []));
  const projectsJson = JSON.stringify(content.projects?.projects);

  useEffect(() => {
    const next = [...(content.projects?.projects || [])];
    setProjects(next);
    initialRef.current = JSON.stringify(next);
  }, [projectsJson]);

  const isDirty = useMemo(() => JSON.stringify(projects) !== initialRef.current, [projects]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    onSavingChange?.(saving);
  }, [saving, onSavingChange]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(null);
    setErrorMsg(null);

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

    const cleanedProjects: ProjectItem[] = projects.map((proj) => ({
      id: proj.id || `project_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: proj.title.trim(),
      category: proj.category || 'infrastructure',
      description: proj.description.trim(),
      imageUrl: proj.imageUrl || proj.image || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&q=80',
      image: proj.imageUrl || proj.image || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&q=80',
      year: proj.year ? String(proj.year).trim() : '2025',
      status: proj.status ? String(proj.status).trim() : 'Completed',
      location: proj.location ? String(proj.location).trim() : 'Tamil Nadu Region',
      details:
        Array.isArray(proj.details) && proj.details.length > 0
          ? proj.details.map((d) => d.trim()).filter(Boolean)
          : ['Verified engineering execution'],
    }));

    try {
      await updateSection('projects', { projects: cleanedProjects });
      initialRef.current = JSON.stringify(cleanedProjects);
      onDirtyChange?.(false);
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSaveSuccess(`Projects showcase portfolio updated at ${now}.`);
      onSaveToast?.('Projects portfolio saved successfully.');
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
      category: 'infrastructure',
      description: 'Detailed description of execution and equipment deployed...',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&q=80',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&q=80',
      year: '2025',
      status: 'Completed',
      location: 'Tamil Nadu Region',
      details: ['Verified engineering execution', 'State PWD/WRD compliant'],
    }),
    []
  );

  return (
    <form id="cms-active-section-form" onSubmit={handleSave} className="space-y-6">
      <SectionHeader
        title="Projects"
        description="Manage featured infrastructure projects, categories, execution photography, locations, and highlight details."
        icon={<FolderKanban className="w-5 h-5" />}
        saving={saving}
        saveLabel="Save Projects"
        isDirty={isDirty}
        saveSuccess={saveSuccess}
        errorMsg={errorMsg}
      />

      <SectionCard>
        <EditableItemList<ProjectItem>
          title="Project showcase portfolio"
          description="Click any project row to expand and edit its details."
          items={projects}
          onUpdateItems={setProjects}
          createNewItem={createNewProject}
          getItemTitle={(item) => item.title || 'Untitled project'}
          getItemSubtitle={(item) => `${item.location || 'Tamil Nadu'} · ${item.year || '2025'} · ${item.status || 'Completed'}`}
          addButtonText="Add New Project"
          renderItemFields={(item, idx, updateItem) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <FieldLabel htmlFor={`proj-title-${idx}`} label="Project title" required />
                <input
                  id={`proj-title-${idx}`}
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem({ ...item, title: e.target.value })}
                  placeholder="e.g. Major Highway Dewatering Work"
                  className={inputBaseClasses}
                />
              </div>

              <div>
                <FieldLabel htmlFor={`proj-cat-${idx}`} label="Project category" required />
                <select
                  id={`proj-cat-${idx}`}
                  value={item.category || 'infrastructure'}
                  onChange={(e) => updateItem({ ...item, category: e.target.value as ProjectItem['category'] })}
                  className={inputBaseClasses}
                >
                  <option value="government">Government & Public Sector</option>
                  <option value="water-resource">Water Resource Department (WRD)</option>
                  <option value="infrastructure">Infrastructure & Metro Rail</option>
                  <option value="emergency-relief">Emergency Disaster Relief</option>
                </select>
              </div>

              <div>
                <FieldLabel htmlFor={`proj-year-${idx}`} label="Execution year" />
                <input
                  id={`proj-year-${idx}`}
                  type="text"
                  value={item.year || ''}
                  onChange={(e) => updateItem({ ...item, year: e.target.value })}
                  placeholder="2025"
                  className={`${inputBaseClasses} tabular-nums`}
                />
              </div>

              <div>
                <FieldLabel htmlFor={`proj-status-${idx}`} label="Status" />
                <input
                  id={`proj-status-${idx}`}
                  type="text"
                  value={item.status || ''}
                  onChange={(e) => updateItem({ ...item, status: e.target.value })}
                  placeholder="e.g. Completed, In Progress"
                  className={inputBaseClasses}
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel htmlFor={`proj-loc-${idx}`} label="Location" />
                <input
                  id={`proj-loc-${idx}`}
                  type="text"
                  value={item.location || ''}
                  onChange={(e) => updateItem({ ...item, location: e.target.value })}
                  placeholder="e.g. Chennai / Tamil Nadu"
                  className={inputBaseClasses}
                />
              </div>

              <div className="md:col-span-2">
                <ImageField
                  label="Project execution image"
                  value={item.imageUrl || item.image || ''}
                  onChange={(url) => updateItem({ ...item, imageUrl: url, image: url })}
                  section="projects"
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel
                  htmlFor={`proj-desc-${idx}`}
                  label="Description & engineering scope"
                  required
                  rightSlot={<CharacterCounter value={item.description || ''} recommendedMax={360} />}
                />
                <textarea
                  id={`proj-desc-${idx}`}
                  rows={3}
                  value={item.description}
                  onChange={(e) => updateItem({ ...item, description: e.target.value })}
                  placeholder="Details of machinery, execution timeline, and dewatering volume handled..."
                  className={textareaBaseClasses}
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel htmlFor={`proj-details-${idx}`} label="Project highlights (one per line)" />
                <textarea
                  id={`proj-details-${idx}`}
                  rows={3}
                  value={(item.details || []).join('\n')}
                  onChange={(e) =>
                    updateItem({
                      ...item,
                      details: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="24/7 continuous pump operation&#10;State PWD/WRD compliant"
                  className={textareaBaseClasses}
                />
                <HelperText>Enter each bullet point on a separate line.</HelperText>
              </div>
            </div>
          )}
        />
      </SectionCard>
    </form>
  );
};

export const ProjectsTab = React.memo(ProjectsTabComponent);
