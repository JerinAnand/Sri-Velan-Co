import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { FullSiteContent, StatsContent } from '../../context/SiteContentContext';
import {
  SectionCard,
  SectionHeader,
  FieldLabel,
  HelperText,
  inputBaseClasses,
} from './SectionCard';

interface StatsTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
  onDirtyChange?: (dirty: boolean) => void;
  onSavingChange?: (saving: boolean) => void;
  onSaveToast?: (msg: string) => void;
}

export const StatsTab: React.FC<StatsTabProps> = ({
  content,
  updateSection,
  onDirtyChange,
  onSavingChange,
  onSaveToast,
}) => {
  const [formData, setFormData] = useState<StatsContent>({ ...content.stats });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialRef = useRef<string>(JSON.stringify(content.stats));
  const statsJson = JSON.stringify(content.stats);

  useEffect(() => {
    setFormData({ ...content.stats });
    initialRef.current = statsJson;
  }, [statsJson]);

  const isDirty = useMemo(() => JSON.stringify(formData) !== initialRef.current, [formData]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    onSavingChange?.(saving);
  }, [saving, onSavingChange]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg(null);

    try {
      await updateSection('stats', formData);
      initialRef.current = JSON.stringify(formData);
      onDirtyChange?.(false);
      setSaveSuccess(true);
      onSaveToast?.('Stats & metrics saved successfully.');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving Stats section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form id="cms-active-section-form" onSubmit={handleSave} className="space-y-6">
      <SectionHeader
        title="Stats & Metrics"
        description="Update headline key performance counters, machinery fleet totals, and experience metrics."
        icon={<BarChart3 className="w-5 h-5" />}
        saving={saving}
        saveLabel="Save Key Metrics"
        isDirty={isDirty}
        saveSuccess={saveSuccess ? 'Stats updated successfully.' : null}
        errorMsg={errorMsg}
      />

      <SectionCard
        title="Homepage metric counters"
        description="Numeric counters displayed across the homepage hero and capability highlights."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <FieldLabel htmlFor="stats-years" label="Years of experience" />
            <input
              id="stats-years"
              type="number"
              min={0}
              value={formData.yearsExperience}
              onChange={(e) =>
                setFormData({ ...formData, yearsExperience: parseInt(e.target.value, 10) || 0 })
              }
              className={`${inputBaseClasses} tabular-nums`}
              placeholder="20"
            />
            <HelperText>Displayed with a “+” suffix on the homepage counter.</HelperText>
          </div>

          <div>
            <FieldLabel htmlFor="stats-projects" label="Projects completed" />
            <input
              id="stats-projects"
              type="number"
              min={0}
              value={formData.projectsCompleted}
              onChange={(e) =>
                setFormData({ ...formData, projectsCompleted: parseInt(e.target.value, 10) || 0 })
              }
              className={`${inputBaseClasses} tabular-nums`}
              placeholder="150"
            />
          </div>

          <div>
            <FieldLabel htmlFor="stats-clients" label="Government & enterprise clients" />
            <input
              id="stats-clients"
              type="number"
              min={0}
              value={formData.clientsServed}
              onChange={(e) =>
                setFormData({ ...formData, clientsServed: parseInt(e.target.value, 10) || 0 })
              }
              className={`${inputBaseClasses} tabular-nums`}
              placeholder="25"
            />
          </div>

          <div>
            <FieldLabel htmlFor="stats-team" label="Team size" />
            <input
              id="stats-team"
              type="number"
              min={0}
              value={formData.teamSize}
              onChange={(e) =>
                setFormData({ ...formData, teamSize: parseInt(e.target.value, 10) || 0 })
              }
              className={`${inputBaseClasses} tabular-nums`}
              placeholder="120"
            />
          </div>

          <div className="md:col-span-2">
            <FieldLabel htmlFor="stats-fleet" label="Dewatering machinery fleet count" />
            <input
              id="stats-fleet"
              type="number"
              min={0}
              value={formData.dewateringFleet}
              onChange={(e) =>
                setFormData({ ...formData, dewateringFleet: parseInt(e.target.value, 10) || 0 })
              }
              className={`${inputBaseClasses} tabular-nums text-brand-gold-300 font-semibold`}
              placeholder="400"
            />
            <HelperText>Total deployable tractor-driven and submersible pump units (e.g. 400+).</HelperText>
          </div>
        </div>
      </SectionCard>
    </form>
  );
};
