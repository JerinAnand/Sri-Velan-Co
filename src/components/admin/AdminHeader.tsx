import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  ArrowUpRight,
  Save,
  Loader2,
  LogOut,
  ChevronDown,
  Menu as MenuIcon,
  User,
} from 'lucide-react';
import { ContentToolsMenu } from './ContentToolsMenu';

interface AdminHeaderProps {
  userEmail?: string | null;
  isDirty: boolean;
  isSaving: boolean;
  onSaveCurrentSection: () => void;
  onOpenMobileSidebar: () => void;
  onLogout: () => void;
  onBackupContent: () => void;
  isBackingUp: boolean;
  onUploadJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenHistory: () => void;
  historyCount: number;
  onSaveCurrentAsDefault: () => void;
  isSavingDefault: boolean;
  onRestoreToDefault: () => void;
  isRestoring: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  userEmail,
  isDirty,
  isSaving,
  onSaveCurrentSection,
  onOpenMobileSidebar,
  onLogout,
  onBackupContent,
  isBackingUp,
  onUploadJson,
  onOpenHistory,
  historyCount,
  onSaveCurrentAsDefault,
  isSavingDefault,
  onRestoreToDefault,
  isRestoring,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profileOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileOpen]);

  const userInitial = (userEmail?.trim()?.[0] || 'A').toUpperCase();

  return (
    <header className="sticky top-0 z-40 h-16 bg-[#060f1e]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 flex items-center justify-between gap-3">
      {/* Left: Mobile drawer button + Brand + Email */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation menu"
          className="md:hidden h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-200 transition-colors cursor-pointer shrink-0"
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        <div className="w-9 h-9 rounded-xl bg-brand-gold-500/15 border border-brand-gold-500/35 flex items-center justify-center text-brand-gold-400 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-display font-bold text-white tracking-tight whitespace-nowrap">
              Sri Velan & Co
            </h1>
            <span className="text-[11px] font-medium bg-brand-gold-500/15 text-brand-gold-300 border border-brand-gold-500/30 px-2 py-0.5 rounded-md whitespace-nowrap">
              CMS Portal
            </span>
          </div>
          {userEmail && (
            <p className="text-xs text-slate-400 font-mono truncate hidden sm:block max-w-[260px]">
              {userEmail}
            </p>
          )}
        </div>
      </div>

      {/* Right: Dirty indicator, Content Tools, Live Preview, Primary Save, Avatar Dropdown */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {isDirty && (
          <div
            role="status"
            className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-medium text-amber-300 whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" aria-hidden="true" />
            <span>Unsaved changes</span>
          </div>
        )}

        <ContentToolsMenu
          onBackupContent={onBackupContent}
          isBackingUp={isBackingUp}
          onUploadJson={onUploadJson}
          onOpenHistory={onOpenHistory}
          historyCount={historyCount}
          onSaveCurrentAsDefault={onSaveCurrentAsDefault}
          isSavingDefault={isSavingDefault}
          onRestoreToDefault={onRestoreToDefault}
          isRestoring={isRestoring}
        />

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="h-9 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors duration-150 whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-500/50"
        >
          <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Live Preview</span>
        </a>

        <button
          type="button"
          onClick={onSaveCurrentSection}
          disabled={isSaving}
          title="Save active section (Ctrl+S / Cmd+S)"
          className="h-9 px-3.5 sm:px-4 rounded-xl bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors duration-150 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-400"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? 'Saving...' : 'Save'}</span>
        </button>

        {/* Profile / Avatar Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            aria-label="Account menu"
            className="h-9 pl-1.5 pr-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 flex items-center gap-1.5 transition-colors duration-150 cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-500/50"
          >
            <span className="w-6 h-6 rounded-lg bg-brand-blue-700 text-brand-gold-300 border border-brand-gold-500/30 text-xs font-semibold flex items-center justify-center">
              {userInitial}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
                profileOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {profileOpen && (
            <div
              role="menu"
              aria-label="Account options"
              className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#091529] border border-white/15 shadow-2xl py-2 z-50"
            >
              <div className="px-3.5 py-2 border-b border-white/10 space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <User className="w-3.5 h-3.5" />
                  <span>Signed in as</span>
                </div>
                <p className="text-xs font-mono text-slate-200 truncate">
                  {userEmail || 'Admin User'}
                </p>
              </div>

              <div className="pt-1.5 px-1.5">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2 transition-colors duration-150 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
