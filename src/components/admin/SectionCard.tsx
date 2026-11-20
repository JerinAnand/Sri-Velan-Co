import React from 'react';
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Plus,
  X,
} from 'lucide-react';

interface SectionCardProps {
  title?: string;
  description?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  description,
  headerAction,
  children,
  className = '',
}) => {
  return (
    <section
      className={`bg-[#091529] border border-white/10 rounded-2xl p-6 space-y-5 hover:transform-none hover:shadow-none ${className}`}
      style={{ transform: 'none' }}
    >
      {(title || description || headerAction) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="space-y-1">
            {title && (
              <h3 className="text-base font-display font-semibold text-white">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-slate-400 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}
      {children}
    </section>
  );
};

interface SectionHeaderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  saving?: boolean;
  saveLabel?: string;
  isDirty?: boolean;
  saveSuccess?: string | boolean | null;
  errorMsg?: string | null;
  extraActions?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  icon,
  saving = false,
  saveLabel = 'Save changes',
  isDirty = false,
  saveSuccess,
  errorMsg,
  extraActions,
}) => {
  return (
    <div className="space-y-4">
      <div className="sticky top-[65px] z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3.5 bg-[#060f1e]/95 backdrop-blur-md border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            {icon && <span className="text-brand-gold-400 shrink-0">{icon}</span>}
            <h2 className="text-xl font-display font-bold text-white tracking-tight">
              {title}
            </h2>
            {isDirty && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" aria-hidden="true" />
                Unsaved edits
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {extraActions}
          <button
            type="submit"
            disabled={saving}
            className="h-10 px-4 rounded-xl bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-semibold text-sm flex items-center gap-2 transition-colors duration-150 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060f1e]"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Saving...' : saveLabel}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div
          role="status"
          className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-sm text-emerald-300 flex items-center gap-2.5"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>
            {typeof saveSuccess === 'string'
              ? saveSuccess
              : 'Changes saved and synced live.'}
          </span>
        </div>
      )}

      {errorMsg && (
        <div
          role="alert"
          className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-300 flex items-center gap-2.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};

interface FieldLabelProps {
  htmlFor?: string;
  label: string;
  required?: boolean;
  rightSlot?: React.ReactNode;
}

export const FieldLabel: React.FC<FieldLabelProps> = ({
  htmlFor,
  label,
  required,
  rightSlot,
}) => {
  return (
    <div className="flex items-center justify-between gap-2 mb-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-[13px] font-medium text-slate-300"
      >
        {label}
        {required && <span className="text-brand-gold-400 ml-1">*</span>}
      </label>
      {rightSlot}
    </div>
  );
};

interface CharacterCounterProps {
  value: string;
  recommendedMax?: number;
}

export const CharacterCounter: React.FC<CharacterCounterProps> = ({
  value,
  recommendedMax,
}) => {
  const len = value?.length || 0;
  const isOver = recommendedMax ? len > recommendedMax : false;
  return (
    <span
      className={`text-xs font-mono tabular-nums ${
        isOver ? 'text-amber-400' : 'text-slate-500'
      }`}
    >
      {len}
      {recommendedMax ? ` / ${recommendedMax}` : ' chars'}
    </span>
  );
};

interface HelperTextProps {
  children: React.ReactNode;
}

export const HelperText: React.FC<HelperTextProps> = ({ children }) => (
  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{children}</p>
);

export const inputBaseClasses =
  'w-full h-11 bg-[#050d1a] border border-white/15 hover:border-white/25 rounded-xl px-3.5 text-sm font-sans text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-gold-500/40 focus:border-brand-gold-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150';

export const textareaBaseClasses =
  'w-full bg-[#050d1a] border border-white/15 hover:border-white/25 rounded-xl px-3.5 py-2.5 text-sm font-sans text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-gold-500/40 focus:border-brand-gold-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 leading-relaxed';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => (
  <div className="py-10 px-6 text-center bg-[#060f1e]/60 border border-dashed border-white/15 rounded-2xl flex flex-col items-center justify-center gap-3">
    {icon && (
      <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
        {icon}
      </div>
    )}
    <div className="space-y-1 max-w-md">
      <p className="text-sm font-semibold text-slate-200">{title}</p>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </div>
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="mt-1 h-9 px-4 rounded-xl bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-semibold text-xs flex items-center gap-1.5 transition-colors duration-150 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>{actionLabel}</span>
      </button>
    )}
  </div>
);

export const SectionSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading section content">
    <div className="flex items-center justify-between border-b border-white/10 pb-4">
      <div className="space-y-2">
        <div className="h-6 w-48 bg-white/10 rounded-lg" />
        <div className="h-4 w-80 bg-white/5 rounded-lg" />
      </div>
      <div className="h-10 w-32 bg-white/10 rounded-xl" />
    </div>
    <div className="bg-[#091529] border border-white/10 rounded-2xl p-6 space-y-5">
      <div className="h-5 w-40 bg-white/10 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-white/10 rounded" />
          <div className="h-11 w-full bg-white/5 rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-28 bg-white/10 rounded" />
          <div className="h-11 w-full bg-white/5 rounded-xl" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-36 bg-white/10 rounded" />
        <div className="h-24 w-full bg-white/5 rounded-xl" />
      </div>
    </div>
  </div>
);

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  variant?: 'danger' | 'warning' | 'primary';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  secondaryActionLabel,
  onSecondaryAction,
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  const confirmClasses =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-500 text-white border border-red-500/50'
      : variant === 'warning'
      ? 'bg-amber-500 hover:bg-amber-400 text-brand-blue-950 font-semibold'
      : 'bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-semibold';

  const iconBg =
    variant === 'danger'
      ? 'bg-red-500/10 border-red-500/25 text-red-400'
      : 'bg-amber-500/10 border-amber-500/25 text-amber-400';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-[#091529] border border-white/15 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${iconBg}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 id="confirm-modal-title" className="text-base font-display font-bold text-white">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">{description}</p>

        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="h-10 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-sm font-medium transition-colors duration-150 cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          {secondaryActionLabel && onSecondaryAction && (
            <button
              type="button"
              onClick={onSecondaryAction}
              disabled={loading}
              className="h-10 px-4 rounded-xl bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-semibold text-sm transition-colors duration-150 cursor-pointer disabled:opacity-50"
            >
              {secondaryActionLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`h-10 px-4 rounded-xl text-sm font-semibold transition-colors duration-150 flex items-center gap-2 cursor-pointer disabled:opacity-50 ${confirmClasses}`}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
