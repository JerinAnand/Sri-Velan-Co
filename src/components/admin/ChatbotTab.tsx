import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Bot } from 'lucide-react';
import { FullSiteContent, ChatbotContent } from '../../context/SiteContentContext';
import { ImageField } from './ImageField';

interface ChatbotTabProps {
  content: FullSiteContent;
  updateSection: <K extends keyof FullSiteContent>(key: K, data: FullSiteContent[K]) => Promise<void>;
}

export const ChatbotTab: React.FC<ChatbotTabProps> = ({ content, updateSection }) => {
  const [formData, setFormData] = useState<ChatbotContent>({
    ...content.chatbot,
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg(null);

    try {
      await updateSection('chatbot', formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving Chatbot section:', err);
      setErrorMsg(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-brand-gold-400" />
            VELAN AI Assistant Settings
          </h2>
          <p className="text-xs text-neutral-400">Manage floating chatbot greeting message, custom system prompt overrides, avatar image, and widget visibility.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Chatbot Configuration'}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          VELAN AI chatbot settings updated successfully in Firestore real-time!
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-3 bg-neutral-950 p-4 border border-white/10 rounded-2xl">
          <input
            type="checkbox"
            id="chatbot-enabled"
            checked={formData.enabled}
            onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
            className="w-4 h-4 accent-brand-gold-500 rounded cursor-pointer"
          />
          <label htmlFor="chatbot-enabled" className="text-xs font-mono font-medium text-white cursor-pointer select-none">
            Enable Floating VELAN AI Chat Widget
          </label>
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
            Initial Welcome Greeting Message
          </label>
          <textarea
            rows={3}
            value={formData.greetingMessage}
            onChange={(e) => setFormData({ ...formData, greetingMessage: e.target.value })}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-xs font-mono text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all"
          />
        </div>

        <ImageField
          label="Chatbot Avatar / Icon Image (Optional)"
          value={formData.avatarUrl || ''}
          onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
          section="chatbot"
        />

        <div>
          <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
            System Prompt / Knowledge Override (Optional)
          </label>
          <textarea
            rows={4}
            value={formData.systemPromptOverride || ''}
            onChange={(e) => setFormData({ ...formData, systemPromptOverride: e.target.value })}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-xs font-mono text-neutral-100 focus:outline-none focus:border-brand-gold-500/80 transition-all"
            placeholder="Custom operational guidelines or additional company instructions for VELAN AI..."
          />
        </div>
      </div>
    </form>
  );
};
