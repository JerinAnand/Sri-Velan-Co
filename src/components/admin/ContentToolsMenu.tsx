import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Download,
  Upload,
  History,
  BookmarkPlus,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

interface ContentToolsMenuProps {
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

export const ContentToolsMenu: React.FC<ContentToolsMenuProps> = ({
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
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="h-9 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-500/50"
      >
        <SlidersHorizontal className="w-4 h-4 text-brand-gold-400" />
        <span className="hidden sm:inline">Content Tools</span>
        <span className="sm:hidden">Tools</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={(e) => {
          onUploadJson(e);
          e.target.value = '';
          setOpen(false);
        }}
        className="hidden"
        aria-hidden="true"
      />

      {open && (
        <div
          role="menu"
          aria-label="Content management tools"
          className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#091529] border border-white/15 shadow-2xl py-2 z-50"
        >
          <div className="px-3 py-1.5 text-xs font-medium text-slate-400">
            Snapshots & Backups
          </div>

          <button
            type="button"
            role="menuitem"
            disabled={isBackingUp}
            onClick={() => {
              setOpen(false);
              onBackupContent();
            }}
            className="w-full px-3.5 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5 hover:text-white flex items-center gap-2.5 transition-colors duration-150 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-brand-gold-400 shrink-0" />
            <span>{isBackingUp ? 'Exporting JSON...' : 'Backup Content'}</span>
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-3.5 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5 hover:text-white flex items-center gap-2.5 transition-colors duration-150 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Upload JSON</span>
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onOpenHistory();
            }}
            className="w-full px-3.5 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5 hover:text-white flex items-center justify-between gap-2 transition-colors duration-150 cursor-pointer"
          >
            <span className="flex items-center gap-2.5">
              <History className="w-4 h-4 text-purple-400 shrink-0" />
              <span>History of Changes</span>
            </span>
            <span className="text-xs font-mono tabular-nums bg-white/10 text-slate-300 px-2 py-0.5 rounded-md">
              {historyCount}
            </span>
          </button>

          <button
            type="button"
            role="menuitem"
            disabled={isSavingDefault}
            onClick={() => {
              setOpen(false);
              onSaveCurrentAsDefault();
            }}
            className="w-full px-3.5 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5 hover:text-white flex items-center gap-2.5 transition-colors duration-150 cursor-pointer disabled:opacity-50"
          >
            <BookmarkPlus className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{isSavingDefault ? 'Saving Default...' : 'Save Current as Default'}</span>
          </button>

          <div className="my-1.5 border-t border-white/10" />

          <button
            type="button"
            role="menuitem"
            disabled={isRestoring}
            onClick={() => {
              setOpen(false);
              onRestoreToDefault();
            }}
            className="w-full px-3.5 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2.5 transition-colors duration-150 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4 text-red-400 shrink-0" />
            <span>Restore to Default</span>
          </button>
        </div>
      )}
    </div>
  );
};
