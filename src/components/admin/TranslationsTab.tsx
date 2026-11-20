import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Globe, CheckCircle2, AlertCircle } from 'lucide-react';
import { FullSiteContent } from '../../context/SiteContentContext';
import {
  SectionCard,
  SectionHeader,
  FieldLabel,
  HelperText,
  textareaBaseClasses,
} from './SectionCard';
import { LanguageTabs, EditorLanguage } from './LanguageTabs';

interface TranslationsTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
  onDirtyChange?: (dirty: boolean) => void;
  onSavingChange?: (saving: boolean) => void;
  onSaveToast?: (msg: string) => void;
}

export const TranslationsTab: React.FC<TranslationsTabProps> = ({
  content,
  updateSection,
  onDirtyChange,
  onSavingChange,
  onSaveToast,
}) => {
  const [activeLang, setActiveLang] = useState<EditorLanguage>('en');
  const [enJsonText, setEnJsonText] = useState<string>(() =>
    JSON.stringify(content.translations?.en || {}, null, 2)
  );
  const [taJsonText, setTaJsonText] = useState<string>(() =>
    JSON.stringify(content.translations?.ta || {}, null, 2)
  );
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialRef = useRef<string>(
    JSON.stringify({
      en: JSON.stringify(content.translations?.en || {}, null, 2),
      ta: JSON.stringify(content.translations?.ta || {}, null, 2),
    })
  );
  const translationsJson = JSON.stringify(content.translations);

  useEffect(() => {
    const nextEn = JSON.stringify(content.translations?.en || {}, null, 2);
    const nextTa = JSON.stringify(content.translations?.ta || {}, null, 2);
    setEnJsonText(nextEn);
    setTaJsonText(nextTa);
    initialRef.current = JSON.stringify({ en: nextEn, ta: nextTa });
  }, [translationsJson]);

  const isDirty = useMemo(
    () => JSON.stringify({ en: enJsonText, ta: taJsonText }) !== initialRef.current,
    [enJsonText, taJsonText]
  );

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    onSavingChange?.(saving);
  }, [saving, onSavingChange]);

  const currentText = activeLang === 'en' ? enJsonText : taJsonText;
  const setCurrentText = (val: string) => {
    if (activeLang === 'en') {
      setEnJsonText(val);
    } else {
      setTaJsonText(val);
    }
  };

  const validation = useMemo(() => {
    try {
      const parsed = JSON.parse(currentText);
      const keyCount =
        parsed && typeof parsed === 'object' ? Object.keys(parsed).length : 0;
      return { valid: true, keyCount, error: null as string | null };
    } catch (err: any) {
      return { valid: false, keyCount: 0, error: err.message as string };
    }
  }, [currentText]);

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(currentText);
      setCurrentText(JSON.stringify(parsed, null, 2));
      setErrorMsg(null);
    } catch (err: any) {
      setErrorMsg(`Cannot format ${activeLang.toUpperCase()} JSON: ${err.message}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg(null);

    try {
      let parsedEn: any;
      let parsedTa: any;
      try {
        parsedEn = JSON.parse(enJsonText);
      } catch (err: any) {
        throw new Error(`Invalid English (EN) JSON: ${err.message}`);
      }
      try {
        parsedTa = JSON.parse(taJsonText);
      } catch (err: any) {
        throw new Error(`Invalid Tamil (TA) JSON: ${err.message}`);
      }

      const updatedTranslations = {
        ...content.translations,
        en: parsedEn,
        ta: parsedTa,
      };

      await updateSection('translations', updatedTranslations);
      const formattedEn = JSON.stringify(parsedEn, null, 2);
      const formattedTa = JSON.stringify(parsedTa, null, 2);
      setEnJsonText(formattedEn);
      setTaJsonText(formattedTa);
      initialRef.current = JSON.stringify({ en: formattedEn, ta: formattedTa });
      onDirtyChange?.(false);
      setSaveSuccess(true);
      onSaveToast?.('Translation dictionaries saved successfully.');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving Translations section:', err);
      setErrorMsg(err.message || 'Invalid JSON format or update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form id="cms-active-section-form" onSubmit={handleSave} className="space-y-6">
      <SectionHeader
        title="Translations (EN/TA)"
        description="Edit English and Tamil UI translation dictionaries in structured JSON format."
        icon={<Globe className="w-5 h-5" />}
        saving={saving}
        saveLabel="Save Dictionaries"
        isDirty={isDirty}
        saveSuccess={saveSuccess ? 'Translation dictionaries updated and synced live.' : null}
        errorMsg={errorMsg}
      />

      <SectionCard
        title="Dictionary JSON editor"
        description="Switch between English and Tamil JSON payloads. Both dictionaries are validated before saving."
        headerAction={
          <button
            type="button"
            onClick={handleFormatJson}
            className="h-9 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 text-xs font-medium transition-colors cursor-pointer"
          >
            Format JSON
          </button>
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <LanguageTabs activeLang={activeLang} onChange={setActiveLang} />

          <div className="flex items-center gap-2 text-xs font-mono">
            {validation.valid ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Valid JSON ({validation.keyCount} root keys)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-red-300">
                <AlertCircle className="w-3.5 h-3.5" />
                Syntax error
              </span>
            )}
          </div>
        </div>

        <div>
          <FieldLabel
            htmlFor="translations-json-editor"
            label={`${activeLang === 'en' ? 'English (EN)' : 'Tamil (தமிழ்)'} translation JSON`}
          />
          <textarea
            id="translations-json-editor"
            rows={18}
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            className={`${textareaBaseClasses} font-mono text-xs text-emerald-300 leading-relaxed`}
            spellCheck={false}
          />
          {!validation.valid && validation.error ? (
            <p className="mt-1.5 text-xs font-mono text-red-400">{validation.error}</p>
          ) : (
            <HelperText>
              Preserve existing JSON keys when editing values so public site labels resolve accurately.
            </HelperText>
          )}
        </div>
      </SectionCard>
    </form>
  );
};
