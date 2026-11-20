import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import {
  ActiveTab,
  NAV_DOMAINS,
  NAV_GROUPS,
  getBreadcrumbForTab,
} from './adminNavigation';
import { SidebarGroup } from './SidebarGroup';

interface AdminLayoutProps {
  header: React.ReactNode;
  activeTab: ActiveTab;
  onSelectTab: (tabId: ActiveTab) => void;
  mobileSidebarOpen: boolean;
  onCloseMobileSidebar: () => void;
  isDirty?: boolean;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  header,
  activeTab,
  onSelectTab,
  mobileSidebarOpen,
  onCloseMobileSidebar,
  isDirty = false,
  children,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const activeBreadcrumb = useMemo(() => getBreadcrumbForTab(activeTab), [activeTab]);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(
    activeBreadcrumb.groupId
  );

  // Auto-expand only the group containing the active section; collapse others
  useEffect(() => {
    setExpandedGroupId(activeBreadcrumb.groupId);
  }, [activeBreadcrumb.groupId]);

  const handleToggleGroup = (groupId: string) => {
    setExpandedGroupId((prev) => (prev === groupId ? null : groupId));
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredByDomain = useMemo(() => {
    return NAV_DOMAINS.map((domain) => {
      const groups = NAV_GROUPS.filter((g) => g.domain === domain.id).map((group) => {
        const matchingItems = normalizedQuery
          ? group.items.filter(
              (item) =>
                item.label.toLowerCase().includes(normalizedQuery) ||
                group.label.toLowerCase().includes(normalizedQuery) ||
                item.id.toLowerCase().includes(normalizedQuery) ||
                item.keywords?.some((kw) => kw.includes(normalizedQuery))
            )
          : group.items;
        return { group, matchingItems };
      }).filter((entry) => entry.matchingItems.length > 0);

      return { domain, groups };
    }).filter((entry) => entry.groups.length > 0);
  }, [normalizedQuery]);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Search box */}
      <div className="p-3 border-b border-white/10">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sections..."
            aria-label="Search CMS sections"
            className="w-full h-10 bg-[#050d1a] border border-white/15 hover:border-white/25 rounded-xl pl-9 pr-8 text-sm font-sans text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-gold-500/40 focus:border-brand-gold-500 transition-all duration-150"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grouped navigation */}
      <nav
        aria-label="CMS sections"
        className="flex-1 overflow-y-auto p-3 space-y-5"
      >
        {filteredByDomain.length === 0 ? (
          <div className="py-10 px-4 text-center space-y-2">
            <p className="text-sm font-medium text-slate-300">No matching sections</p>
            <p className="text-xs text-slate-500">
              Try searching for hero, projects, footer, or Tamil.
            </p>
          </div>
        ) : (
          filteredByDomain.map(({ domain, groups }) => (
            <div key={domain.id} className="space-y-1.5">
              <div className="px-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 tracking-wide">
                  {domain.label}
                </span>
                <span className="text-[11px] text-slate-500">{domain.subtitle}</span>
              </div>

              <div className="space-y-1">
                {groups.map(({ group, matchingItems }) => {
                  const isStandalone =
                    group.id === 'global-translations' ||
                    group.id === 'tools-chatbot';

                  if (isStandalone) {
                    const item = matchingItems[0];
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectTab(item.id);
                          onCloseMobileSidebar();
                        }}
                        aria-current={isActive ? 'page' : undefined}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors duration-150 text-left cursor-pointer ${
                          isActive
                            ? 'bg-brand-gold-500 text-brand-blue-950 font-semibold shadow-sm'
                            : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-brand-blue-950' : 'text-slate-400'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  }

                  const isExpanded = normalizedQuery
                    ? true
                    : expandedGroupId === group.id;

                  return (
                    <SidebarGroup
                      key={group.id}
                      group={group}
                      activeTab={activeTab}
                      isExpanded={isExpanded}
                      onToggleExpand={handleToggleGroup}
                      onSelectTab={(tabId) => {
                        onSelectTab(tabId);
                        onCloseMobileSidebar();
                      }}
                      visibleItems={matchingItems}
                    />
                  );
                })}
              </div>
            </div>
          ))
        )}
      </nav>

      {/* Footer helper inside sidebar */}
      <div className="p-3 border-t border-white/10 text-xs text-slate-500 flex items-center justify-between">
        <span>18 CMS sections</span>
        <span className="font-mono text-[11px] text-slate-400">Ctrl+S to save</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#040b16] text-slate-100 flex flex-col font-sans selection:bg-brand-gold-500 selection:text-brand-blue-950">
      {header}

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Desktop Persistent Sidebar */}
        <aside className="hidden md:flex md:w-[272px] shrink-0 flex-col bg-[#071121] border-r border-white/10 sticky top-16 h-[calc(100vh-4rem)]">
          {sidebarContent}
        </aside>

        {/* Mobile Slide-in Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
              onClick={onCloseMobileSidebar}
              aria-hidden="true"
            />
            <aside
              role="dialog"
              aria-modal="true"
              aria-label="CMS navigation drawer"
              className="relative w-80 max-w-[85vw] h-full bg-[#071121] border-r border-white/15 shadow-2xl flex flex-col z-10"
            >
              <div className="h-14 px-4 border-b border-white/10 flex items-center justify-between">
                <span className="text-sm font-display font-bold text-white">
                  CMS Navigation
                </span>
                <button
                  type="button"
                  onClick={onCloseMobileSidebar}
                  aria-label="Close navigation drawer"
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 min-h-0">{sidebarContent}</div>
            </aside>
          </div>
        )}

        {/* Main Workspace */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-5">
          {/* Breadcrumbs + mobile unsaved indicator */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400 flex-wrap">
              <span>{activeBreadcrumb.domainLabel}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
              {!activeBreadcrumb.isStandaloneGroup && (
                <>
                  <span>{activeBreadcrumb.groupLabel}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
                </>
              )}
              <span className="text-brand-gold-400 font-medium">
                {activeBreadcrumb.sectionLabel}
              </span>
            </nav>

            {isDirty && (
              <span className="lg:hidden inline-flex items-center gap-1.5 text-xs font-medium text-amber-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" aria-hidden="true" />
                Unsaved changes
              </span>
            )}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
};
