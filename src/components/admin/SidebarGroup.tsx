import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { ActiveTab, NavGroup } from './adminNavigation';

interface SidebarGroupProps {
  group: NavGroup;
  activeTab: ActiveTab;
  isExpanded: boolean;
  onToggleExpand: (groupId: string) => void;
  onSelectTab: (tabId: ActiveTab) => void;
  visibleItems?: NavGroup['items'];
}

export const SidebarGroup: React.FC<SidebarGroupProps> = ({
  group,
  activeTab,
  isExpanded,
  onToggleExpand,
  onSelectTab,
  visibleItems,
}) => {
  const items = visibleItems ?? group.items;
  if (items.length === 0) return null;

  const GroupIcon = group.icon;
  const hasActiveChild = items.some((item) => item.id === activeTab);

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => onToggleExpand(group.id)}
        aria-expanded={isExpanded}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-150 cursor-pointer ${
          hasActiveChild
            ? 'text-brand-gold-300 bg-brand-gold-500/10'
            : 'text-slate-300 hover:text-white hover:bg-white/5'
        }`}
      >
        <span className="flex items-center gap-2.5 min-w-0">
          <GroupIcon
            className={`w-4 h-4 shrink-0 ${
              hasActiveChild ? 'text-brand-gold-400' : 'text-slate-400'
            }`}
          />
          <span className="truncate">{group.label}</span>
        </span>

        <span className="flex items-center gap-1.5 shrink-0">
          <span
            className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded-md ${
              hasActiveChild
                ? 'bg-brand-gold-500/20 text-brand-gold-300'
                : 'bg-white/5 text-slate-400'
            }`}
          >
            {items.length}
          </span>
          <ChevronRight
            className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-150 ${
              isExpanded ? 'rotate-90 text-slate-300' : ''
            }`}
          />
        </span>
      </button>

      {isExpanded && (
        <div className="pl-4 ml-3 border-l border-white/10 space-y-0.5 py-0.5">
          {items.map((item) => {
            const ItemIcon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] transition-colors duration-150 text-left cursor-pointer ${
                  isActive
                    ? 'bg-brand-gold-500 text-brand-blue-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 font-normal'
                }`}
              >
                <ItemIcon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive ? 'text-brand-blue-950' : 'text-slate-500'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
