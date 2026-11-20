import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  RotateCcw,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSiteContent, FullSiteContent } from '../context/SiteContentContext';

import { ActiveTab } from './admin/adminNavigation';
import { AdminHeader } from './admin/AdminHeader';
import { AdminLayout } from './admin/AdminLayout';
import { SectionSkeleton, ConfirmModal } from './admin/SectionCard';

import { HeroTab } from './admin/HeroTab';
import { AboutTab } from './admin/AboutTab';
import { StatsTab } from './admin/StatsTab';
import { ServicesTab } from './admin/ServicesTab';
import { ClientsTab } from './admin/ClientsTab';
import { GoverningBoardTab } from './admin/GoverningBoardTab';
import { ProjectsTab } from './admin/ProjectsTab';
import { ContactTab } from './admin/ContactTab';
import { FooterTab } from './admin/FooterTab';
import { TranslationsTab } from './admin/TranslationsTab';
import { EquipmentTab } from './admin/EquipmentTab';
import { CapabilityStatementTab } from './admin/CapabilityStatementTab';
import { HydraulicBroomerTab } from './admin/HydraulicBroomerTab';
import { WeatherAlertBannerTab } from './admin/WeatherAlertBannerTab';
import { ChatbotTab } from './admin/ChatbotTab';
import { NavigationTab } from './admin/NavigationTab';
import { ConstructionExperienceTab } from './admin/ConstructionExperienceTab';
import { ChennaiTab } from './admin/ChennaiTab';

export type { ActiveTab };

export function AdminDashboardView() {
  const { user, logout } = useAuth();
  const {
    siteContent,
    loading,
    updateSection,
    restoreToDefault,
    setCurrentAsDefault,
    clearHistory,
    backupContent,
    historyEntries,
    historyLoading,
    restoreFromSnapshot,
  } = useSiteContent();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<ActiveTab>('hero');
  const [pendingTab, setPendingTab] = useState<ActiveTab | null>(null);
  const pendingSwitchAfterSaveRef = useRef<ActiveTab | null>(null);

  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [contentVersion, setContentVersion] = useState<number>(0);

  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isBackingUp, setIsBackingUp] = useState<boolean>(false);
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [isSavingDefault, setIsSavingDefault] = useState<boolean>(false);

  const [confirmModalType, setConfirmModalType] = useState<'restoreDefault' | 'saveDefault' | null>(null);
  const [pendingJsonUpload, setPendingJsonUpload] = useState<{ fileName: string; data: any } | null>(null);
  const [pendingRollbackEntry, setPendingRollbackEntry] = useState<any | null>(null);

  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isClearHistoryConfirmOpen, setIsClearHistoryConfirmOpen] = useState<boolean>(false);
  const [clearConfirmationText, setClearConfirmationText] = useState<string>('');
  const [isClearingHistory, setIsClearingHistory] = useState<boolean>(false);
  const [viewingSnapshot, setViewingSnapshot] = useState<FullSiteContent | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const toastTimerRef = useRef<number | null>(null);
  const errorTimerRef = useRef<number | null>(null);

  const triggerToast = useCallback((msg: string) => {
    setSaveSuccess(msg);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setSaveSuccess(null), 4000);

    if (pendingSwitchAfterSaveRef.current) {
      const targetTab = pendingSwitchAfterSaveRef.current;
      pendingSwitchAfterSaveRef.current = null;
      setPendingTab(null);
      setIsDirty(false);
      setActiveTab(targetTab);
    }
  }, []);

  const triggerError = useCallback((msg: string) => {
    pendingSwitchAfterSaveRef.current = null;
    setSaveError(msg);
    if (errorTimerRef.current) window.clearTimeout(errorTimerRef.current);
    errorTimerRef.current = window.setTimeout(() => setSaveError(null), 5000);
  }, []);

  const handleSaveCurrentSection = useCallback(() => {
    const form = document.getElementById('cms-active-section-form') as HTMLFormElement | null;
    if (form) {
      form.requestSubmit();
    }
  }, []);

  // Keyboard shortcut Ctrl+S / Cmd+S to save current section
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (!loading && !isSaving) {
          handleSaveCurrentSection();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSaveCurrentSection, loading, isSaving]);

  // Warn before closing or reloading browser tab when unsaved changes exist
  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleSelectTab = useCallback(
    (nextTab: ActiveTab) => {
      if (nextTab === activeTab) return;
      if (isDirty) {
        setPendingTab(nextTab);
        return;
      }
      setIsDirty(false);
      setActiveTab(nextTab);
    },
    [activeTab, isDirty]
  );

  const handleDiscardAndSwitch = useCallback(() => {
    if (!pendingTab) return;
    setIsDirty(false);
    setActiveTab(pendingTab);
    setPendingTab(null);
  }, [pendingTab]);

  const handleSaveAndSwitch = useCallback(() => {
    if (!pendingTab) return;
    pendingSwitchAfterSaveRef.current = pendingTab;
    setPendingTab(null);
    handleSaveCurrentSection();
  }, [pendingTab, handleSaveCurrentSection]);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/admin/login');
  }, [logout, navigate]);

  // Save Current as Default (confirmed via modal)
  const executeSetCurrentAsDefault = useCallback(async () => {
    setIsSavingDefault(true);
    try {
      await setCurrentAsDefault();
      setConfirmModalType(null);
      triggerToast('Current live content saved as the new default.');
    } catch (err: any) {
      console.error('Save current as default failed:', err);
      triggerError('Failed to save current content as default: ' + err.message);
    } finally {
      setIsSavingDefault(false);
    }
  }, [setCurrentAsDefault, triggerToast, triggerError]);

  // Restore Default (destructive, confirmed via modal)
  const executeRestoreToDefault = useCallback(async () => {
    setIsRestoring(true);
    try {
      await restoreToDefault();
      setConfirmModalType(null);
      setIsDirty(false);
      setContentVersion((v) => v + 1);
      triggerToast('Site content restored to default settings.');
    } catch (err: any) {
      console.error('Restore default failed:', err);
      triggerError('Failed to restore default content: ' + err.message);
    } finally {
      setIsRestoring(false);
    }
  }, [restoreToDefault, triggerToast, triggerError]);

  // Clear History
  const handleClearHistoryConfirm = useCallback(async () => {
    if (clearConfirmationText.trim() !== 'CLEAR') {
      return;
    }
    setIsClearingHistory(true);
    try {
      await clearHistory();
      setIsClearHistoryConfirmOpen(false);
      setClearConfirmationText('');
      triggerToast('History logs cleared and a fresh checkpoint was created.');
    } catch (err: any) {
      console.error('Clear history failed:', err);
      triggerError('Failed to clear history: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsClearingHistory(false);
    }
  }, [clearConfirmationText, clearHistory, triggerToast, triggerError]);

  // Backup Content -> JSON File Download
  const handleBackupContent = useCallback(async () => {
    setIsBackingUp(true);
    try {
      const currentData = await backupContent();
      const blob = new Blob([JSON.stringify(currentData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `srivelan_siteContent_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      triggerToast('Site content backup JSON downloaded.');
    } catch (err: any) {
      console.error('Backup failed:', err);
      triggerError('Failed to trigger backup download: ' + err.message);
    } finally {
      setIsBackingUp(false);
    }
  }, [backupContent, triggerToast, triggerError]);

  // Upload JSON backup file to restore (opens confirmation modal)
  const handleRestoreFromJSON = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (!parsed || typeof parsed !== 'object') {
            throw new Error('Invalid JSON file format.');
          }
          setPendingJsonUpload({ fileName: file.name, data: parsed });
        } catch (err: any) {
          console.error('JSON parse error:', err);
          triggerError('Failed to read JSON backup: ' + err.message);
        }
      };
      reader.readAsText(file);
    },
    [triggerError]
  );

  const executeUploadJsonRestore = useCallback(async () => {
    if (!pendingJsonUpload) return;
    setIsRestoring(true);
    try {
      await restoreFromSnapshot(
        pendingJsonUpload.data,
        `Restored from uploaded JSON backup (${pendingJsonUpload.fileName})`
      );
      setPendingJsonUpload(null);
      setIsDirty(false);
      setContentVersion((v) => v + 1);
      triggerToast('Site content restored from uploaded JSON backup.');
    } catch (err: any) {
      console.error('JSON restore error:', err);
      triggerError('Failed to restore from JSON: ' + err.message);
    } finally {
      setIsRestoring(false);
    }
  }, [pendingJsonUpload, restoreFromSnapshot, triggerToast, triggerError]);

  // Rollback to specific history snapshot (confirmed via modal)
  const executeRollback = useCallback(async () => {
    if (!pendingRollbackEntry) return;
    setIsRestoring(true);
    try {
      await restoreFromSnapshot(
        pendingRollbackEntry.snapshot,
        `Rollback to version from ${new Date(pendingRollbackEntry.timestamp).toLocaleString()}`
      );
      setPendingRollbackEntry(null);
      setIsHistoryOpen(false);
      setIsDirty(false);
      setContentVersion((v) => v + 1);
      triggerToast('Site content rolled back to selected snapshot.');
    } catch (err: any) {
      console.error('Rollback failed:', err);
      triggerError('Rollback failed: ' + err.message);
    } finally {
      setIsRestoring(false);
    }
  }, [pendingRollbackEntry, restoreFromSnapshot, triggerToast, triggerError]);

  const tabSharedProps = {
    content: siteContent,
    updateSection,
    onDirtyChange: setIsDirty,
    onSavingChange: setIsSaving,
    onSaveToast: triggerToast,
  };

  const tabKey = `${activeTab}-${contentVersion}`;

  return (
    <>
      <AdminLayout
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        mobileSidebarOpen={mobileSidebarOpen}
        onCloseMobileSidebar={() => setMobileSidebarOpen(false)}
        isDirty={isDirty}
        header={
          <AdminHeader
            userEmail={user?.email}
            isDirty={isDirty}
            isSaving={isSaving}
            onSaveCurrentSection={handleSaveCurrentSection}
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            onLogout={handleLogout}
            onBackupContent={handleBackupContent}
            isBackingUp={isBackingUp}
            onUploadJson={handleRestoreFromJSON}
            onOpenHistory={() => setIsHistoryOpen(true)}
            historyCount={historyEntries.length}
            onSaveCurrentAsDefault={() => setConfirmModalType('saveDefault')}
            isSavingDefault={isSavingDefault}
            onRestoreToDefault={() => setConfirmModalType('restoreDefault')}
            isRestoring={isRestoring}
          />
        }
      >
        {loading ? (
          <SectionSkeleton />
        ) : (
          <div key={tabKey}>
            {activeTab === 'hero' && <HeroTab {...tabSharedProps} />}
            {activeTab === 'about' && <AboutTab {...tabSharedProps} />}
            {activeTab === 'stats' && <StatsTab {...tabSharedProps} />}
            {activeTab === 'services' && <ServicesTab {...tabSharedProps} />}
            {activeTab === 'chennai' && <ChennaiTab {...tabSharedProps} />}
            {activeTab === 'clients' && <ClientsTab {...tabSharedProps} />}
            {activeTab === 'governingBoard' && <GoverningBoardTab {...tabSharedProps} />}
            {activeTab === 'projects' && <ProjectsTab {...tabSharedProps} />}
            {activeTab === 'constructionExperience' && (
              <ConstructionExperienceTab {...tabSharedProps} />
            )}
            {activeTab === 'equipment' && <EquipmentTab {...tabSharedProps} />}
            {activeTab === 'capabilityStatement' && (
              <CapabilityStatementTab {...tabSharedProps} />
            )}
            {activeTab === 'hydraulicBroomer' && <HydraulicBroomerTab {...tabSharedProps} />}
            {activeTab === 'weatherAlertBanner' && (
              <WeatherAlertBannerTab {...tabSharedProps} />
            )}
            {activeTab === 'chatbot' && <ChatbotTab {...tabSharedProps} />}
            {activeTab === 'navigation' && <NavigationTab {...tabSharedProps} />}
            {activeTab === 'contact' && <ContactTab {...tabSharedProps} />}
            {activeTab === 'footer' && <FooterTab {...tabSharedProps} />}
            {activeTab === 'translations' && <TranslationsTab {...tabSharedProps} />}
          </div>
        )}
      </AdminLayout>

      {/* Floating Saved / Error Toast Notifications */}
      {(saveSuccess || saveError) && (
        <div className="fixed bottom-5 right-5 z-[80] flex flex-col gap-2 max-w-sm w-[calc(100vw-2.5rem)] pointer-events-none">
          {saveSuccess && (
            <div
              role="status"
              className="pointer-events-auto bg-[#091529] border border-emerald-500/40 rounded-2xl px-4 py-3 shadow-2xl flex items-center justify-between gap-3 text-sm text-emerald-200"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <span className="font-semibold text-emerald-300 mr-1.5">Saved</span>
                  <span className="text-slate-300 text-xs">{saveSuccess}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSaveSuccess(null)}
                aria-label="Dismiss notification"
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {saveError && (
            <div
              role="alert"
              className="pointer-events-auto bg-[#091529] border border-red-500/40 rounded-2xl px-4 py-3 shadow-2xl flex items-center justify-between gap-3 text-sm text-red-200"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="text-xs text-red-200">{saveError}</span>
              </div>
              <button
                type="button"
                onClick={() => setSaveError(null)}
                aria-label="Dismiss error"
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Unsaved Changes Navigation Warning Modal */}
      <ConfirmModal
        open={pendingTab !== null}
        title="Unsaved changes in this section"
        description="You have edited fields that have not been saved yet. Save your changes before switching sections, or discard them to continue."
        cancelLabel="Stay here"
        secondaryActionLabel="Save & switch"
        onSecondaryAction={handleSaveAndSwitch}
        confirmLabel="Discard & switch"
        variant="warning"
        loading={isSaving}
        onConfirm={handleDiscardAndSwitch}
        onCancel={() => setPendingTab(null)}
      />

      {/* Restore to Default Destructive Confirmation Modal */}
      <ConfirmModal
        open={confirmModalType === 'restoreDefault'}
        title="Restore all content to default?"
        description="This resets all 18 CMS sections back to the saved default configuration. An audit snapshot of your current live content is recorded automatically before resetting."
        confirmLabel="Restore to Default"
        variant="danger"
        loading={isRestoring}
        onConfirm={executeRestoreToDefault}
        onCancel={() => setConfirmModalType(null)}
      />

      {/* Save Current as Default Confirmation Modal */}
      <ConfirmModal
        open={confirmModalType === 'saveDefault'}
        title="Save current live content as default?"
        description="This overwrites the stored baseline default with your current live content. Future 'Restore to Default' actions will revert to this version."
        confirmLabel="Save as Default"
        variant="warning"
        loading={isSavingDefault}
        onConfirm={executeSetCurrentAsDefault}
        onCancel={() => setConfirmModalType(null)}
      />

      {/* Upload JSON Confirmation Modal */}
      <ConfirmModal
        open={pendingJsonUpload !== null}
        title="Restore from uploaded JSON?"
        description={`This will overwrite live site content with the contents of "${pendingJsonUpload?.fileName || ''}". A rollback snapshot of your current content will be saved in history.`}
        confirmLabel="Restore JSON Backup"
        variant="primary"
        loading={isRestoring}
        onConfirm={executeUploadJsonRestore}
        onCancel={() => setPendingJsonUpload(null)}
      />

      {/* History Snapshot Rollback Confirmation Modal */}
      <ConfirmModal
        open={pendingRollbackEntry !== null}
        title="Roll back to historical snapshot?"
        description={`Restore all site content to the snapshot recorded on ${
          pendingRollbackEntry ? new Date(pendingRollbackEntry.timestamp).toLocaleString() : ''
        }? Your current state will be preserved in the audit log.`}
        confirmLabel="Confirm Rollback"
        variant="warning"
        loading={isRestoring}
        onConfirm={executeRollback}
        onCancel={() => setPendingRollbackEntry(null)}
      />

      {/* History of Changes & Snapshot Modal */}
      {isHistoryOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="history-modal-title"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-[#091529] border border-white/15 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <History className="w-5 h-5 text-brand-gold-400" />
                <h3 id="history-modal-title" className="font-display font-bold text-base text-white">
                  History of Changes & Rollback Snapshots
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {historyEntries.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setClearConfirmationText('');
                      setIsClearHistoryConfirmOpen(true);
                    }}
                    className="h-9 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/25 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Clear all history entries"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear History</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsHistoryOpen(false);
                    setViewingSnapshot(null);
                  }}
                  aria-label="Close history modal"
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {historyLoading ? (
                <div className="text-center py-12 text-sm text-slate-400">
                  Loading change audit logs...
                </div>
              ) : historyEntries.length === 0 ? (
                <div className="text-center py-12 text-sm text-slate-400">
                  No history logs recorded yet. Changes saved in the CMS Portal automatically generate rollback snapshots here.
                </div>
              ) : (
                <div className="space-y-3">
                  {historyEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-[#050d1a] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-white/25 transition-colors"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-white">{entry.action}</span>
                          {entry.sectionKey && (
                            <span className="text-[11px] font-mono bg-white/10 text-brand-gold-300 px-2 py-0.5 rounded-md">
                              {entry.sectionKey}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
                          <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="font-mono tabular-nums">
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                          {entry.userEmail && (
                            <span className="font-mono text-slate-500">by {entry.userEmail}</span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setViewingSnapshot(entry.snapshot)}
                          className="h-9 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 text-xs font-medium transition-colors cursor-pointer"
                        >
                          View Snapshot
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingRollbackEntry(entry)}
                          disabled={isRestoring}
                          className="h-9 px-3 rounded-xl bg-brand-gold-500/15 hover:bg-brand-gold-500/25 text-brand-gold-300 border border-brand-gold-500/35 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Rollback</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Snapshot Inspector Preview */}
              {viewingSnapshot && (
                <div className="mt-6 border-t border-white/10 pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-brand-gold-400">
                      Snapshot JSON Payload Inspector
                    </p>
                    <button
                      type="button"
                      onClick={() => setViewingSnapshot(null)}
                      className="text-xs text-slate-400 hover:text-white cursor-pointer"
                    >
                      Close Inspector
                    </button>
                  </div>
                  <pre className="bg-[#050d1a] border border-white/10 rounded-xl p-4 text-[11px] font-mono text-emerald-300 max-h-60 overflow-y-auto">
                    {JSON.stringify(viewingSnapshot, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Clear History Safety Confirmation Modal */}
      {isClearHistoryConfirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-history-title"
          className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-[#091529] border border-red-500/35 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl border border-red-500/25 flex items-center justify-center text-red-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 id="clear-history-title" className="font-display font-bold text-base text-white">
                  Clear History Log
                </h4>
                <p className="text-xs text-slate-400">Irreversible action</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed bg-[#050d1a] p-4 rounded-xl border border-white/10">
              This will permanently delete all{' '}
              <strong className="text-white font-mono">{historyEntries.length}</strong> history
              entries. Past rollback points will be removed, while live content and saved defaults
              remain untouched.
            </p>

            <div className="space-y-1.5">
              <label htmlFor="clear-history-confirm-input" className="text-xs text-slate-300 block">
                Type <span className="font-mono text-red-400 font-bold">CLEAR</span> to confirm:
              </label>
              <input
                id="clear-history-confirm-input"
                type="text"
                value={clearConfirmationText}
                onChange={(e) => setClearConfirmationText(e.target.value)}
                placeholder="Type CLEAR here"
                className="w-full h-11 bg-[#050d1a] border border-white/15 rounded-xl px-3.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsClearHistoryConfirmOpen(false);
                  setClearConfirmationText('');
                }}
                className="h-10 px-4 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-sm font-medium rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearHistoryConfirm}
                disabled={clearConfirmationText.trim() !== 'CLEAR' || isClearingHistory}
                className="h-10 px-4 bg-red-600 hover:bg-red-500 disabled:bg-white/5 disabled:text-slate-600 disabled:border-transparent text-white text-sm font-semibold rounded-xl border border-red-500/50 transition-colors flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isClearingHistory ? 'Clearing...' : 'Permanently Clear History'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
