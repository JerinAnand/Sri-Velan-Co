import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSiteContent, FullSiteContent } from '../context/SiteContentContext';
import {
  ShieldCheck,
  LogOut,
  Layout,
  Info,
  BarChart3,
  Wrench,
  Users,
  Building2,
  FolderKanban,
  PhoneCall,
  FileText,
  Globe,
  Download,
  History,
  RotateCcw,
  Upload,
  X,
  Clock,
  Truck,
  CloudRain,
  Bot,
  Menu as MenuIcon,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowUpRight,
  Layers,
  MapPin,
  Search,
} from 'lucide-react';

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

export type ActiveTab =
  | 'hero'
  | 'about'
  | 'stats'
  | 'services'
  | 'clients'
  | 'governingBoard'
  | 'projects'
  | 'constructionExperience'
  | 'equipment'
  | 'capabilityStatement'
  | 'hydraulicBroomer'
  | 'weatherAlertBanner'
  | 'chatbot'
  | 'navigation'
  | 'contact'
  | 'footer'
  | 'translations';

export function AdminDashboardView() {
  const { user, logout } = useAuth();
  const {
    siteContent,
    loading,
    updateSection,
    seedInitialData,
    restoreToDefault,
    backupContent,
    historyEntries,
    historyLoading,
    restoreFromSnapshot,
  } = useSiteContent();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<ActiveTab>('hero');
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isBackingUp, setIsBackingUp] = useState<boolean>(false);
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [viewingSnapshot, setViewingSnapshot] = useState<FullSiteContent | null>(null);
  const [tabSearchQuery, setTabSearchQuery] = useState<string>('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const triggerToast = useCallback((msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 4000);
  }, []);

  const triggerError = useCallback((msg: string) => {
    setSaveError(msg);
    setTimeout(() => setSaveError(null), 5000);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/admin/login');
  }, [logout, navigate]);

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
      triggerToast('Site content backup JSON file downloaded successfully!');
    } catch (err: any) {
      console.error('Backup failed:', err);
      triggerError('Failed to trigger backup download: ' + err.message);
    } finally {
      setIsBackingUp(false);
    }
  }, [backupContent, triggerToast, triggerError]);

  // Restore Default
  const handleRestoreToDefault = useCallback(async () => {
    if (!window.confirm('Are you sure you want to restore ALL site content to factory default settings? This action creates an audit log snapshot before resetting.')) {
      return;
    }
    setIsRestoring(true);
    try {
      await restoreToDefault();
      triggerToast('Site content restored to factory defaults!');
    } catch (err: any) {
      console.error('Restore default failed:', err);
      triggerError('Failed to restore default content: ' + err.message);
    } finally {
      setIsRestoring(false);
    }
  }, [restoreToDefault, triggerToast, triggerError]);

  // Upload JSON backup file to restore
  const handleRestoreFromJSON = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid JSON file format.');
        }
        if (!window.confirm(`Restore site content from uploaded backup file "${file.name}"?`)) {
          return;
        }
        setIsRestoring(true);
        await restoreFromSnapshot(parsed, `Restored from uploaded JSON backup (${file.name})`);
        triggerToast('Site content successfully restored from uploaded JSON backup!');
      } catch (err: any) {
        console.error('JSON restore error:', err);
        triggerError('Failed to restore from JSON: ' + err.message);
      } finally {
        setIsRestoring(false);
      }
    };
    reader.readAsText(file);
  }, [restoreFromSnapshot, triggerToast, triggerError]);

  // Rollback to specific history snapshot
  const handleRollback = useCallback(async (entry: any) => {
    if (!window.confirm(`Roll back site content to snapshot from ${new Date(entry.timestamp).toLocaleString()}?`)) {
      return;
    }
    setIsRestoring(true);
    try {
      await restoreFromSnapshot(entry.snapshot, `Rollback to version from ${new Date(entry.timestamp).toLocaleString()}`);
      triggerToast('Site content successfully rolled back!');
      setIsHistoryOpen(false);
    } catch (err: any) {
      console.error('Rollback failed:', err);
      triggerError('Rollback failed: ' + err.message);
    } finally {
      setIsRestoring(false);
    }
  }, [restoreFromSnapshot, triggerToast, triggerError]);

  const navItems = useMemo(
    () => [
      { id: 'hero' as ActiveTab, label: 'Hero Section', icon: Layout },
      { id: 'about' as ActiveTab, label: 'About Us', icon: Info },
      { id: 'stats' as ActiveTab, label: 'Stats & Metrics', icon: BarChart3 },
      { id: 'services' as ActiveTab, label: 'Chennai Operations & Services', icon: MapPin },
      { id: 'clients' as ActiveTab, label: 'Clients & Depts', icon: Building2 },
      { id: 'governingBoard' as ActiveTab, label: 'Leadership', icon: Users },
      { id: 'projects' as ActiveTab, label: 'Projects', icon: FolderKanban },
      { id: 'constructionExperience' as ActiveTab, label: 'Construction Experience', icon: Layers },
      { id: 'equipment' as ActiveTab, label: 'Equipment Fleet', icon: Truck },
      { id: 'capabilityStatement' as ActiveTab, label: 'Capability Statement', icon: FileText },
      { id: 'hydraulicBroomer' as ActiveTab, label: 'Hydraulic Broomer', icon: Wrench },
      { id: 'weatherAlertBanner' as ActiveTab, label: 'Weather Alert Banner', icon: CloudRain },
      { id: 'chatbot' as ActiveTab, label: 'VELAN AI Chatbot', icon: Bot },
      { id: 'navigation' as ActiveTab, label: 'Navigation Bar', icon: MenuIcon },
      { id: 'contact' as ActiveTab, label: 'Contact & Offices', icon: PhoneCall },
      { id: 'footer' as ActiveTab, label: 'Footer Content', icon: FileText },
      { id: 'translations' as ActiveTab, label: 'Translations (EN/TA)', icon: Globe },
    ],
    []
  );

  const filteredNavItems = useMemo(
    () =>
      navItems.filter(
        (item) =>
          item.label.toLowerCase().includes(tabSearchQuery.toLowerCase()) ||
          item.id.toLowerCase().includes(tabSearchQuery.toLowerCase())
      ),
    [navItems, tabSearchQuery]
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-brand-gold-500 selection:text-neutral-950">
      {/* Top Admin Header */}
      <header className="bg-neutral-900 border-b border-white/10 px-6 py-4 sticky top-0 z-40 backdrop-blur-md bg-neutral-900/90 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-gold-500/10 border border-brand-gold-500/30 flex items-center justify-center text-brand-gold-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-display font-bold text-white tracking-wide flex items-center gap-2">
              Sri Velan & Co
              <span className="text-[10px] font-mono bg-brand-gold-500/20 text-brand-gold-400 border border-brand-gold-500/40 px-2 py-0.5 rounded-full uppercase font-bold">
                CMS Portal
              </span>
            </h1>
            <p className="text-xs text-neutral-400 font-mono">Logged in as {user?.email}</p>
          </div>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleBackupContent}
            disabled={isBackingUp}
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            title="Download full JSON snapshot backup of Firestore siteContent"
          >
            <Download className="w-3.5 h-3.5 text-brand-gold-400" />
            {isBackingUp ? 'Exporting...' : 'Backup Content'}
          </button>

          <label
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="Upload previously downloaded JSON backup file to restore"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span>Upload JSON</span>
            <input type="file" accept=".json" onChange={handleRestoreFromJSON} className="hidden" />
          </label>

          <button
            onClick={() => setIsHistoryOpen(true)}
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="View full history of changes and rollback to any prior snapshot"
          >
            <History className="w-3.5 h-3.5 text-purple-400" />
            History of Changes ({historyEntries.length})
          </button>

          <button
            onClick={handleRestoreToDefault}
            disabled={isRestoring}
            className="bg-neutral-800 hover:bg-red-900/40 text-neutral-300 hover:text-red-300 border border-white/10 hover:border-red-500/30 px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            title="Reset site content to factory default state"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            Restore to Default
          </button>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            Live Preview
          </a>

          <button
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Admin Portal Shell */}
      <div className="flex-1 flex flex-col md:flex-row max-w-[1600px] w-full mx-auto p-4 md:p-6 gap-6">
        {/* Sidebar Nav Tabs */}
        <aside className="w-full md:w-64 shrink-0 space-y-3 bg-neutral-900/60 border border-white/10 p-3 rounded-2xl h-fit">
          <div className="flex items-center justify-between px-2 pt-1">
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
              CMS Sections ({filteredNavItems.length})
            </p>
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="md:hidden p-1 text-neutral-400 hover:text-white rounded-lg bg-neutral-800 border border-white/10 text-xs font-mono flex items-center gap-1"
            >
              <MenuIcon className="w-3.5 h-3.5" />
              <span>{mobileSidebarOpen ? 'Hide' : 'Menu'}</span>
            </button>
          </div>

          {/* Quick Search Filter Input */}
          <div className="relative px-1">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={tabSearchQuery}
              onChange={(e) => setTabSearchQuery(e.target.value)}
              placeholder="Search section..."
              className="w-full bg-neutral-950 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-gold-500/80 font-mono"
            />
            {tabSearchQuery && (
              <button
                onClick={() => setTabSearchQuery('')}
                className="absolute right-3 top-2 text-neutral-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <nav className={`space-y-1 ${mobileSidebarOpen ? 'block' : 'hidden md:block'}`}>
            {filteredNavItems.length === 0 ? (
              <p className="text-xs font-mono text-neutral-500 px-3 py-4 text-center">No matching sections found.</p>
            ) : (
              filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium font-mono transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-brand-gold-500 text-brand-blue-950 font-bold shadow-md'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-blue-950' : 'text-neutral-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })
            )}
          </nav>
        </aside>

        {/* Content Tab Panel */}
        <main className="flex-1 bg-neutral-900/60 border border-white/10 p-6 rounded-2xl shadow-xl min-w-0">
          {/* Notifications / Toast Messages */}
          {saveSuccess && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              {saveSuccess}
            </div>
          )}

          {saveError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              {saveError}
            </div>
          )}

          {/* Tab Render Switch */}
          {activeTab === 'hero' && <HeroTab content={siteContent} updateSection={updateSection} />}
          {activeTab === 'about' && <AboutTab content={siteContent} updateSection={updateSection} />}
          {activeTab === 'stats' && <StatsTab content={siteContent} updateSection={updateSection} />}
          {activeTab === 'services' && <ServicesTab content={siteContent} updateSection={updateSection} />}
          {activeTab === 'clients' && <ClientsTab content={siteContent} updateSection={updateSection} />}
          {activeTab === 'governingBoard' && <GoverningBoardTab content={siteContent} updateSection={updateSection} />}
          {activeTab === 'projects' && <ProjectsTab content={siteContent} updateSection={updateSection} />}
          {activeTab === 'constructionExperience' && <ConstructionExperienceTab content={siteContent} updateSection={updateSection} />}
          {activeTab === 'equipment' && <EquipmentTab content={siteContent} updateSection={updateSection} />}
          {activeTab === 'capabilityStatement' && <CapabilityStatementTab content={siteContent} updateSection={updateSection} />}
          {activeTab === 'hydraulicBroomer' && <HydraulicBroomerTab content={siteContent} updateSection={updateSection} />}
          {activeTab === 'weatherAlertBanner' && <WeatherAlertBannerTab content={siteContent} updateSection={updateSection} />}
          {activeTab === 'chatbot' && <ChatbotTab content={siteContent} updateSection={updateSection} />}
          {activeTab === 'navigation' && <NavigationTab content={siteContent} updateSection={updateSection} />}
          {activeTab === 'contact' && <ContactTab content={siteContent} updateSection={updateSection} />}
          {activeTab === 'footer' && <FooterTab content={siteContent} updateSection={updateSection} />}
          {activeTab === 'translations' && <TranslationsTab content={siteContent} updateSection={updateSection} />}
        </main>
      </div>

      {/* History of Changes & Snapshot Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-purple-400" />
                <h3 className="font-display font-bold text-base text-white">History of Changes & Rollback Snapshots</h3>
              </div>
              <button
                onClick={() => {
                  setIsHistoryOpen(false);
                  setViewingSnapshot(null);
                }}
                className="p-1 text-neutral-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {historyLoading ? (
                <div className="text-center py-12 font-mono text-xs text-neutral-400">Loading change audit logs...</div>
              ) : historyEntries.length === 0 ? (
                <div className="text-center py-12 font-mono text-xs text-neutral-500">
                  No history logs recorded yet. Changes made in the Admin Portal will automatically generate audit snapshots here.
                </div>
              ) : (
                <div className="space-y-3">
                  {historyEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-neutral-950 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-purple-500/40 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-purple-400">{entry.action}</span>
                          {entry.sectionKey && (
                            <span className="text-[10px] font-mono bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-full">
                              {entry.sectionKey}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400 flex items-center gap-1.5 font-mono">
                          <Clock className="w-3.5 h-3.5 text-neutral-500" />
                          {new Date(entry.timestamp).toLocaleString()}
                          {entry.userEmail && <span className="text-neutral-500">by {entry.userEmail}</span>}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setViewingSnapshot(entry.snapshot)}
                          className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-mono transition-all"
                        >
                          View Snapshot
                        </button>
                        <button
                          onClick={() => handleRollback(entry)}
                          disabled={isRestoring}
                          className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Rollback
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
                    <p className="text-xs font-mono font-bold text-brand-gold-400">Snapshot JSON Payload Inspector</p>
                    <button
                      onClick={() => setViewingSnapshot(null)}
                      className="text-[11px] font-mono text-neutral-400 hover:text-white"
                    >
                      Close Inspector
                    </button>
                  </div>
                  <pre className="bg-neutral-950 border border-white/10 rounded-xl p-4 text-[11px] font-mono text-emerald-400 max-h-60 overflow-y-auto">
                    {JSON.stringify(viewingSnapshot, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
