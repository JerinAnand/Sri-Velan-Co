import React from 'react';
import { ArrowUp, ArrowDown, Trash2, ChevronDown } from 'lucide-react';

interface RepeaterItemProps {
  index: number;
  total: number;
  title: string;
  subtitle?: string;
  isExpanded: boolean;
  onToggle: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove?: () => void;
  canRemove?: boolean;
  children: React.ReactNode;
}

export const RepeaterItem: React.FC<RepeaterItemProps> = ({
  index,
  total,
  title,
  subtitle,
  isExpanded,
  onToggle,
  onMoveUp,
  onMoveDown,
  onRemove,
  canRemove = true,
  children,
}) => {
  return (
    <div
      className={`rounded-2xl border transition-colors duration-150 ${
        isExpanded
          ? 'bg-[#071121] border-brand-gold-500/35'
          : 'bg-[#060f1e]/80 border-white/10 hover:border-white/20'
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-4 py-3.5">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isExpanded}
          className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-500/50 rounded-lg"
        >
          <ChevronDown
            className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-150 ${
              isExpanded ? 'rotate-180 text-brand-gold-400' : ''
            }`}
          />
          <span className="text-xs font-mono tabular-nums text-brand-gold-400/90 bg-brand-gold-500/10 border border-brand-gold-500/20 px-2 py-0.5 rounded-md shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-100 group-hover:text-brand-gold-300 transition-colors truncate">
              {title}
            </p>
            {subtitle && !isExpanded && (
              <p className="text-xs text-slate-500 truncate">{subtitle}</p>
            )}
          </div>
        </button>

        <div className="flex items-center gap-1 shrink-0">
          {onMoveUp && (
            <button
              type="button"
              onClick={onMoveUp}
              disabled={index === 0}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none rounded-lg transition-colors duration-150 cursor-pointer"
              title="Move up"
              aria-label={`Move item ${index + 1} up`}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          )}
          {onMoveDown && (
            <button
              type="button"
              onClick={onMoveDown}
              disabled={index === total - 1}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none rounded-lg transition-colors duration-150 cursor-pointer"
              title="Move down"
              aria-label={`Move item ${index + 1} down`}
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          )}
          {onRemove && canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-150 cursor-pointer ml-0.5"
              title="Remove item"
              aria-label={`Remove item ${index + 1}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-5 pt-3 border-t border-white/10 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};
