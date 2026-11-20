import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Bot } from 'lucide-react';
import { FullSiteContent, ChatbotContent } from '../../context/SiteContentContext';
import { ImageField } from './ImageField';
import {
  SectionCard,
  SectionHeader,
  FieldLabel,
  CharacterCounter,
  HelperText,
  textareaBaseClasses,
} from './SectionCard';

interface ChatbotTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
  onDirtyChange?: (dirty: boolean) => void;
  onSavingChange?: (saving: boolean) => void;
  onSaveToast?: (msg: string) => void;
}

export const ChatbotTab: React.FC<ChatbotTabProps> = ({
  content,
  updateSection,
  onDirtyChange,
  onSavingChange,
  onSaveToast,
}) => {
  const [formData, setFormData] = useState<ChatbotContent>({
    ...content.chatbot,
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialRef = useRef<string>(JSON.stringify(content.chatbot));
  const chatbotJson = JSON.stringify(content.chatbot);

  useEffect(() => {
    setFormData({ ...content.chatbot });
    initialRef.current = chatbotJson;
  }, [chatbotJson]);

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
      await updateSection('chatbot', formData);
      initialRef.current = JSON.stringify(formData);
      onDirtyChange?.(false);
      setSaveSuccess(true);
      onSaveToast?.('VELAN AI Chatbot settings saved.');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving Chatbot section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form id="cms-active-section-form" onSubmit={handleSave} className="space-y-6">
      <SectionHeader
        title="VELAN AI Chatbot"
        description="Manage floating assistant visibility, welcome greeting, avatar image, and custom operational instructions."
        icon={<Bot className="w-5 h-5" />}
        saving={saving}
        saveLabel="Save Chatbot Settings"
        isDirty={isDirty}
        saveSuccess={saveSuccess ? 'VELAN AI chatbot settings updated and synced live.' : null}
        errorMsg={errorMsg}
      />

      <SectionCard
        title="Widget visibility & avatar"
        description="Control whether the floating VELAN AI assistant appears for public visitors."
      >
        <div className="space-y-5">
          <label
            htmlFor="chatbot-enabled"
            className="flex items-start gap-3 p-4 rounded-xl bg-[#050d1a] border border-white/15 hover:border-white/25 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              id="chatbot-enabled"
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="mt-0.5 w-4 h-4 accent-brand-gold-500 rounded cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="block text-sm font-medium text-white">
                Enable floating VELAN AI chat widget
              </span>
              <span className="block text-xs text-slate-400">
                Shows the interactive engineering & inquiry assistant in the bottom corner of the site.
              </span>
            </div>
          </label>

          <ImageField
            label="Chatbot avatar / icon image (optional)"
            value={formData.avatarUrl || ''}
            onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
            section="chatbot"
            helperText="Square image recommended (at least 128×128px). Leave blank for the default VELAN icon."
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Greeting & prompt behavior"
        description="Customize the opening message and optional instructions passed to the assistant."
      >
        <div className="space-y-5">
          <div>
            <FieldLabel
              htmlFor="chatbot-greeting"
              label="Initial welcome greeting message"
              rightSlot={<CharacterCounter value={formData.greetingMessage || ''} recommendedMax={220} />}
            />
            <textarea
              id="chatbot-greeting"
              rows={3}
              value={formData.greetingMessage}
              onChange={(e) => setFormData({ ...formData, greetingMessage: e.target.value })}
              className={textareaBaseClasses}
              placeholder="e.g. Vanakkam! I am VELAN AI. Ask me about our 100 HP dewatering fleet, CMRL experience, or tender capabilities."
            />
          </div>

          <div>
            <FieldLabel
              htmlFor="chatbot-prompt-override"
              label="System prompt / knowledge override (optional)"
              rightSlot={<CharacterCounter value={formData.systemPromptOverride || ''} />}
            />
            <textarea
              id="chatbot-prompt-override"
              rows={4}
              value={formData.systemPromptOverride || ''}
              onChange={(e) =>
                setFormData({ ...formData, systemPromptOverride: e.target.value })
              }
              className={textareaBaseClasses}
              placeholder="Custom operational guidelines, emergency contact reminders, or fleet updates for VELAN AI..."
            />
            <HelperText>
              Optional text appended to the assistant's guidance to reflect seasonal dispatches or newly awarded contracts.
            </HelperText>
          </div>
        </div>
      </SectionCard>
    </form>
  );
};
