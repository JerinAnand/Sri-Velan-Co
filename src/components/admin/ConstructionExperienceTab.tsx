import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Layers, Plus } from 'lucide-react';
import { FullSiteContent } from '../../context/SiteContentContext';
import { ConstructionCategory } from '../../types';
import { ImageField } from './ImageField';
import {
  SectionCard,
  SectionHeader,
  FieldLabel,
  CharacterCounter,
  EmptyState,
  inputBaseClasses,
  textareaBaseClasses,
} from './SectionCard';
import { LanguageTabs, EditorLanguage } from './LanguageTabs';
import { RepeaterItem } from './RepeaterItem';

interface ConstructionExperienceTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
  onDirtyChange?: (dirty: boolean) => void;
  onSavingChange?: (saving: boolean) => void;
  onSaveToast?: (msg: string) => void;
}

export const ConstructionExperienceTab: React.FC<ConstructionExperienceTabProps> = ({
  content,
  updateSection,
  onDirtyChange,
  onSavingChange,
  onSaveToast,
}) => {
  const [categories, setCategories] = useState<ConstructionCategory[]>(
    content.constructionExperience?.categories || []
  );
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const [expandedEntryIdx, setExpandedEntryIdx] = useState<number | null>(0);
  const [activeLang, setActiveLang] = useState<EditorLanguage>('en');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialRef = useRef<string>(
    JSON.stringify(content.constructionExperience?.categories || [])
  );
  const expJson = JSON.stringify(content.constructionExperience?.categories);

  useEffect(() => {
    const next = content.constructionExperience?.categories || [];
    setCategories(next);
    initialRef.current = JSON.stringify(next);
  }, [expJson]);

  const isDirty = useMemo(() => JSON.stringify(categories) !== initialRef.current, [categories]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    onSavingChange?.(saving);
  }, [saving, onSavingChange]);

  const safeCatIdx = Math.min(activeCategoryIdx, Math.max(0, categories.length - 1));
  const activeCategory = categories[safeCatIdx];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg(null);

    try {
      await updateSection('constructionExperience', { categories });
      initialRef.current = JSON.stringify(categories);
      onDirtyChange?.(false);
      setSaveSuccess(true);
      onSaveToast?.('Construction experience saved successfully.');
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
    const newLength = (categories[catIdx]?.projects.length || 0) + 1;
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
    setExpandedEntryIdx(newLength - 1);
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
    setExpandedEntryIdx((prev) => (prev === projIdx ? null : prev));
  };

  const moveProjectEntry = (catIdx: number, projIdx: number, dir: -1 | 1) => {
    const list = categories[catIdx]?.projects || [];
    const target = projIdx + dir;
    if (target < 0 || target >= list.length) return;
    setCategories((prev) => {
      const next = [...prev];
      const updated = [...next[catIdx].projects];
      const temp = updated[target];
      updated[target] = updated[projIdx];
      updated[projIdx] = temp;
      next[catIdx] = { ...next[catIdx], projects: updated };
      return next;
    });
    setExpandedEntryIdx(target);
  };

  const handleCopyEnToTa = () => {
    if (!activeCategory) return;
    setCategories((prev) => {
      const next = [...prev];
      const cat = next[safeCatIdx];
      next[safeCatIdx] = {
        ...cat,
        title: {
          ...cat.title,
          ta: cat.title?.ta?.trim() ? cat.title.ta : cat.title?.en || '',
        },
        projects: cat.projects.map((p) => ({
          ...p,
          ta: p.ta?.trim() ? p.ta : p.en || '',
        })),
      };
      return next;
    });
  };

  return (
    <form id="cms-active-section-form" onSubmit={handleSave} className="space-y-6">
      <SectionHeader
        title="Construction Experience"
        description="Edit department brochure categories, bilingual titles, cover photos, and project records shown on the Projects page."
        icon={<Layers className="w-5 h-5" />}
        saving={saving}
        saveLabel="Save Construction Experience"
        isDirty={isDirty}
        saveSuccess={saveSuccess ? 'Construction experience updated successfully.' : null}
        errorMsg={errorMsg}
      />

      {categories.length === 0 ? (
        <SectionCard>
          <EmptyState
            title="No construction categories configured"
            description="Brochure experience categories will appear here once loaded."
            icon={<Layers className="w-5 h-5" />}
          />
        </SectionCard>
      ) : (
        <>
          {/* Category Tabs + Language Toggle */}
          <SectionCard
            title="Department categories"
            description="Select a department category to edit its cover photo and bilingual project records."
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#050d1a] border border-white/10 rounded-xl">
                {categories.map((cat, idx) => {
                  const isCurrent = idx === safeCatIdx;
                  return (
                    <button
                      key={cat.id || idx}
                      type="button"
                      onClick={() => {
                        setActiveCategoryIdx(idx);
                        setExpandedEntryIdx(0);
                      }}
                      className={`h-8 px-3 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                        isCurrent
                          ? 'bg-brand-gold-500 text-brand-blue-950 font-semibold shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="truncate max-w-[180px]">
                        {cat.title?.en || `Category ${idx + 1}`}
                      </span>
                      <span
                        className={`text-[11px] font-mono tabular-nums ${
                          isCurrent ? 'text-brand-blue-950/80' : 'text-slate-500'
                        }`}
                      >
                        {cat.projects.length}
                      </span>
                    </button>
                  );
                })}
              </div>

              <LanguageTabs
                activeLang={activeLang}
                onChange={setActiveLang}
                onCopyEnToTa={handleCopyEnToTa}
                copyLabel="Copy EN to empty TA"
              />
            </div>

            {activeCategory && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-white/10">
                <div className="md:col-span-2">
                  {activeLang === 'en' ? (
                    <div>
                      <FieldLabel htmlFor={`exp-title-en-${safeCatIdx}`} label="Category title (English)" required />
                      <input
                        id={`exp-title-en-${safeCatIdx}`}
                        type="text"
                        value={activeCategory.title?.en || ''}
                        onChange={(e) => updateCategoryTitle(safeCatIdx, 'en', e.target.value)}
                        className={inputBaseClasses}
                        required
                      />
                    </div>
                  ) : (
                    <div>
                      <FieldLabel htmlFor={`exp-title-ta-${safeCatIdx}`} label="Category title (Tamil)" required />
                      <input
                        id={`exp-title-ta-${safeCatIdx}`}
                        type="text"
                        value={activeCategory.title?.ta || ''}
                        onChange={(e) => updateCategoryTitle(safeCatIdx, 'ta', e.target.value)}
                        className={inputBaseClasses}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <ImageField
                    label="Category cover image"
                    value={activeCategory.image || ''}
                    onChange={(url) => updateCategoryImage(safeCatIdx, url)}
                    section="construction"
                  />
                </div>
              </div>
            )}
          </SectionCard>

          {activeCategory && (
            <SectionCard
              title="Project bullet entries"
              description={`Recorded civil & dewatering works under "${activeCategory.title?.en || activeCategory.id}".`}
              headerAction={
                <button
                  type="button"
                  onClick={() => addProjectEntry(safeCatIdx)}
                  className="h-9 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-brand-gold-300 border border-brand-gold-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project Entry</span>
                </button>
              }
            >
              {activeCategory.projects.length === 0 ? (
                <EmptyState
                  title="No project entries in this category"
                  description="Add a record to display under this construction experience category."
                  actionLabel="Add Project Entry"
                  onAction={() => addProjectEntry(safeCatIdx)}
                  icon={<Layers className="w-5 h-5" />}
                />
              ) : (
                <div className="space-y-2.5">
                  {activeCategory.projects.map((proj, projIdx) => {
                    const isExpanded = expandedEntryIdx === projIdx;
                    const displayTitle =
                      (activeLang === 'en' ? proj.en : proj.ta) ||
                      proj.en ||
                      `Entry #${projIdx + 1}`;
                    return (
                      <RepeaterItem
                        key={projIdx}
                        index={projIdx}
                        total={activeCategory.projects.length}
                        title={displayTitle}
                        isExpanded={isExpanded}
                        onToggle={() =>
                          setExpandedEntryIdx((prev) => (prev === projIdx ? null : projIdx))
                        }
                        onMoveUp={() => moveProjectEntry(safeCatIdx, projIdx, -1)}
                        onMoveDown={() => moveProjectEntry(safeCatIdx, projIdx, 1)}
                        onRemove={() => deleteProjectEntry(safeCatIdx, projIdx)}
                      >
                        {activeLang === 'en' ? (
                          <div>
                            <FieldLabel
                              htmlFor={`exp-entry-en-${safeCatIdx}-${projIdx}`}
                              label="Project entry description (English)"
                              required
                              rightSlot={<CharacterCounter value={proj.en || ''} recommendedMax={260} />}
                            />
                            <textarea
                              id={`exp-entry-en-${safeCatIdx}-${projIdx}`}
                              rows={3}
                              value={proj.en || ''}
                              onChange={(e) =>
                                updateProjectEntry(safeCatIdx, projIdx, 'en', e.target.value)
                              }
                              className={textareaBaseClasses}
                              required
                            />
                          </div>
                        ) : (
                          <div>
                            <FieldLabel
                              htmlFor={`exp-entry-ta-${safeCatIdx}-${projIdx}`}
                              label="Project entry description (Tamil)"
                              required
                              rightSlot={<CharacterCounter value={proj.ta || ''} recommendedMax={280} />}
                            />
                            <textarea
                              id={`exp-entry-ta-${safeCatIdx}-${projIdx}`}
                              rows={3}
                              value={proj.ta || ''}
                              onChange={(e) =>
                                updateProjectEntry(safeCatIdx, projIdx, 'ta', e.target.value)
                              }
                              className={textareaBaseClasses}
                              required
                            />
                          </div>
                        )}
                      </RepeaterItem>
                    );
                  })}
                </div>
              )}
            </SectionCard>
          )}
        </>
      )}
    </form>
  );
};
