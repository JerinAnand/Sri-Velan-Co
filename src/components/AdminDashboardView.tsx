import React, { useState, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { EQUIPMENTS } from '../data';
import { 
  ShieldCheck, 
  RotateCcw, 
  Search, 
  Filter, 
  Sliders, 
  HardDrive, 
  MapPin, 
  Calendar,
  Layers, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  LogOut,
  Pencil,
  Check,
  X
} from 'lucide-react';

interface EditableFieldDef {
  id: string;
  label: string;
  category: 'Stats' | 'Equipment Specs' | 'Project Counters' | 'Milestones';
  defaultValue: string | number;
  description: string;
}

const EDITABLE_FIELDS_REGISTRY: EditableFieldDef[] = [
  // Stats
  { id: 'home_years_of_legacy', label: 'Years of Structural Legacy', category: 'Stats', defaultValue: 20, description: 'Years of legacy shown on the hero section of the home page.' },
  { id: 'company_year_established', label: 'Year Established', category: 'Stats', defaultValue: 2006, description: 'Founding year of the enterprise.' },
  { id: 'home_gov_registrations', label: 'Government Registrations Count', category: 'Stats', defaultValue: 5, description: 'Number of official department registrations displayed.' },
  { id: 'home_heavy_machineries', label: 'Heavy Machineries Fleet', category: 'Stats', defaultValue: 400, description: 'Total quantity of mechanical assets in fleet.' },
  { id: 'home_dispatch_hours', label: 'Disaster Dispatch Hours', category: 'Stats', defaultValue: '24/7', description: 'Emergency desk active hours description.' },
  { id: 'trajectory_22_year', label: 'Infrastructure Trajectory Title Accent', category: 'Stats', defaultValue: '22-Year', description: 'Highlight duration in the About Us section header.' },

  // Milestones
  { id: 'milestone_year_0', label: 'Milestone 1 Year', category: 'Milestones', defaultValue: '2006', description: 'Year of inception milestone.' },
  { id: 'milestone_tag_0', label: 'Milestone 1 Tag', category: 'Milestones', defaultValue: 'FOUNDATION', description: 'Tag label of inception milestone.' },
  { id: 'milestone_title_0', label: 'Milestone 1 Title', category: 'Milestones', defaultValue: 'Company Inception & Initial Works', description: 'Title of inception milestone.' },
  { id: 'milestone_desc_0', label: 'Milestone 1 Description', category: 'Milestones', defaultValue: 'Formed in Villupuram by Mr. G. Selva Kumar, specializing in localized micro-conduit paving, stormwater drains, and rural brick masonry.', description: 'Description text of inception milestone.' },

  { id: 'milestone_year_1', label: 'Milestone 2 Year', category: 'Milestones', defaultValue: '2012', description: 'Year of accreditation milestone.' },
  { id: 'milestone_tag_1', label: 'Milestone 2 Tag', category: 'Milestones', defaultValue: 'EXPANSION', description: 'Tag label of accreditation milestone.' },
  { id: 'milestone_title_1', label: 'Milestone 2 Title', category: 'Milestones', defaultValue: 'Water Resource Board Accreditation', description: 'Title of accreditation milestone.' },
  { id: 'milestone_desc_1', label: 'Milestone 2 Description', category: 'Milestones', defaultValue: 'Formally elevated to Water Resources Department (WRD) contractor, delivering major stonepitched canals, retaining barriers, and block works.', description: 'Description text of accreditation milestone.' },

  { id: 'milestone_year_2', label: 'Milestone 3 Year', category: 'Milestones', defaultValue: '2018', description: 'Year of licensing milestone.' },
  { id: 'milestone_tag_2', label: 'Milestone 3 Tag', category: 'Milestones', defaultValue: 'LEADERSHIP', description: 'Tag label of licensing milestone.' },
  { id: 'milestone_title_2', label: 'Milestone 3 Title', category: 'Milestones', defaultValue: 'State Contractor Licensing Registration', description: 'Title of licensing milestone.' },
  { id: 'milestone_desc_2', label: 'Milestone 3 Description', category: 'Milestones', defaultValue: 'Attained high-status contracting licensing permitting tender bounds under Tamil Nadu Public Works and Irrigation departments.', description: 'Description text of licensing milestone.' },

  { id: 'milestone_year_3', label: 'Milestone 4 Year', category: 'Milestones', defaultValue: '2024 - 2026', description: 'Year of dominance milestone.' },
  { id: 'milestone_tag_3', label: 'Milestone 4 Tag', category: 'Milestones', defaultValue: 'INNOVATION', description: 'Tag label of dominance milestone.' },
  { id: 'milestone_title_3', label: 'Milestone 4 Title', category: 'Milestones', defaultValue: 'Dewatering Fleet Dominance', description: 'Title of dominance milestone.' },
  { id: 'milestone_desc_3', label: 'Milestone 4 Description', category: 'Milestones', defaultValue: 'Established South India’s premier localized mobilization dewatering arm, successfully countering Cyclone Fengal logging with high-volume diesel pumps.', description: 'Description text of dominance milestone.' }
];

// Zone static details helper
const ZONE_NAMES: Record<string, string> = {
  zone1: 'Zone 1: Thiruvottiyur',
  zone2: 'Zone 2: Manali',
  zone3: 'Zone 3: Madhavaram',
  zone4: 'Zone 4: Tondiarpet',
  zone5: 'Zone 5: Royapuram',
  zone6: 'Zone 6: Thiru-Vi-Ka-Nagar',
  zone7: 'Zone 7: Ambattur',
  zone8: 'Zone 8: Anna Nagar',
  zone9: 'Zone 9: Teynampet',
  zone10: 'Zone 10: Kodambakkam',
  zone11: 'Zone 11: Mylapore',
  zone12: 'Zone 12: Alandur',
  zone13: 'Zone 13: Adyar',
  zone14: 'Zone 14: Perungudi',
  zone15: 'Zone 15: Sholinganallur',
};

const ZONE_DEFAULTS: Record<string, { pumpsDeployed: number; activeStaff: number; floodsManaged: number }> = {
  zone1: { pumpsDeployed: 18, activeStaff: 42, floodsManaged: 9 },
  zone2: { pumpsDeployed: 24, activeStaff: 38, floodsManaged: 11 },
  zone3: { pumpsDeployed: 15, activeStaff: 30, floodsManaged: 6 },
  zone4: { pumpsDeployed: 20, activeStaff: 40, floodsManaged: 13 },
  zone5: { pumpsDeployed: 35, activeStaff: 45, floodsManaged: 22 },
  zone6: { pumpsDeployed: 22, activeStaff: 42, floodsManaged: 15 },
  zone7: { pumpsDeployed: 26, activeStaff: 43, floodsManaged: 12 },
  zone8: { pumpsDeployed: 19, activeStaff: 45, floodsManaged: 10 },
  zone9: { pumpsDeployed: 40, activeStaff: 45, floodsManaged: 26 },
  zone10: { pumpsDeployed: 25, activeStaff: 44, floodsManaged: 19 },
  zone11: { pumpsDeployed: 30, activeStaff: 45, floodsManaged: 24 },
  zone12: { pumpsDeployed: 12, activeStaff: 28, floodsManaged: 5 },
  zone13: { pumpsDeployed: 28, activeStaff: 42, floodsManaged: 17 },
  zone14: { pumpsDeployed: 16, activeStaff: 35, floodsManaged: 8 },
  zone15: { pumpsDeployed: 32, activeStaff: 45, floodsManaged: 21 },
};

// Generate comprehensive master list
const getMasterRegistry = (): EditableFieldDef[] => {
  const list = [...EDITABLE_FIELDS_REGISTRY];

  // Dynamic Equipments specifications
  EQUIPMENTS.forEach(eq => {
    Object.entries(eq.specs).forEach(([label, val]) => {
      list.push({
        id: `eq_spec_${eq.id}_${label}`,
        label: `${eq.name} - ${label}`,
        category: 'Equipment Specs',
        defaultValue: val,
        description: `Technical asset specification for the ${eq.name}.`
      });
    });
  });

  // Dynamic Zone project counters
  Object.entries(ZONE_NAMES).forEach(([id, name]) => {
    const defaults = ZONE_DEFAULTS[id] || { pumpsDeployed: 0, activeStaff: 0, floodsManaged: 0 };
    list.push({
      id: `zone_pumpsDeployed_${id}`,
      label: `${name} - Active Pumps`,
      category: 'Project Counters',
      defaultValue: defaults.pumpsDeployed,
      description: `Active heavy dewatering pump fleet inside the ${name} sector.`
    });
    list.push({
      id: `zone_activeStaff_${id}`,
      label: `${name} - On-field Staff`,
      category: 'Project Counters',
      defaultValue: defaults.activeStaff,
      description: `Dispatched municipal liaison workforce personnel inside ${name}.`
    });
    list.push({
      id: `zone_floodsManaged_${id}`,
      label: `${name} - Completed Relief Projects`,
      category: 'Project Counters',
      defaultValue: defaults.floodsManaged,
      description: `Water logging emergency operations successfully managed in ${name}.`
    });
  });

  return list;
};

// Main Dashboard Controller
export function AdminDashboardView() {
  const { isAdmin } = useAdmin();

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] bg-neutral-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-500/10 border border-red-500/25 p-5 rounded-2xl max-w-md space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="font-display font-black text-2xl uppercase tracking-tight text-white">Access Denied</h2>
          <p className="text-sm text-neutral-400 font-sans leading-relaxed">
            The administrative override console is locked. Please enter your authorization credentials using the Admin login panel first.
          </p>
          <div className="pt-2 font-mono text-[10px] text-neutral-500 uppercase">
            Shortcut: Press <kbd className="bg-neutral-900 border border-neutral-700 px-1.5 py-0.5 rounded text-neutral-300 font-bold">Ctrl + Shift + A</kbd> anywhere on the site to sign in.
          </div>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <AdminDashboardContent />
    </HashRouter>
  );
}

// Sub-component containing actual router structure
function AdminDashboardContent() {
  const location = useLocation();
  const { logout, editableData, getValue, updateValue, revertValue, resetCategories } = useAdmin();

  const registry = useMemo(() => getMasterRegistry(), []);

  // Compute override metrics
  const stats = useMemo(() => {
    const totalEditable = registry.length;
    const activeOverrides = Object.keys(editableData).length;
    const statsCount = Object.keys(editableData).filter(k => !k.startsWith('eq_spec_') && !k.startsWith('zone_') && !k.startsWith('milestone_')).length;
    const equipCount = Object.keys(editableData).filter(k => k.startsWith('eq_spec_')).length;
    const countersCount = Object.keys(editableData).filter(k => k.startsWith('zone_')).length;
    const milestonesCount = Object.keys(editableData).filter(k => k.startsWith('milestone_')).length;

    return {
      totalEditable,
      activeOverrides,
      overridePercentage: totalEditable > 0 ? Math.round((activeOverrides / totalEditable) * 100) : 0,
      statsCount,
      equipCount,
      countersCount,
      milestonesCount
    };
  }, [editableData, registry]);

  return (
    <div className="bg-neutral-900 min-h-screen text-neutral-100 border-t border-white/5">
      {/* Upper Dashboard Ribbon */}
      <div className="bg-neutral-950 border-b border-white/5 py-5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-gold-500/15 rounded-xl border border-brand-gold-500/30 text-brand-gold-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-lg sm:text-2xl text-white tracking-tight uppercase leading-none">
                  Municipal Override Console
                </h1>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full font-bold">
                  SANDBOX OVERRIDE LIVE
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1 leading-none font-sans">
                Real-time regional dispatch stats & equipment specifications supervisor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link 
              to="/" 
              className={`text-xs font-mono uppercase px-4 py-2 rounded-lg border tracking-wider transition-all flex items-center gap-1.5 ${
                location.pathname === '/' 
                  ? 'bg-brand-gold-500 text-brand-blue-950 font-bold border-brand-gold-500 shadow-md' 
                  : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/10'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Overrides Table
            </Link>
            <Link 
              to="/overview" 
              className={`text-xs font-mono uppercase px-4 py-2 rounded-lg border tracking-wider transition-all flex items-center gap-1.5 ${
                location.pathname === '/overview' 
                  ? 'bg-brand-gold-500 text-brand-blue-950 font-bold border-brand-gold-500 shadow-md' 
                  : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Summary Overview
            </Link>
            <button
              onClick={() => {
                window.location.href = '/';
              }}
              className="ml-auto md:ml-0 text-xs font-mono uppercase bg-neutral-850 hover:bg-neutral-800 text-neutral-200 hover:text-white px-4 py-2 rounded-lg border border-neutral-700 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Return to public view"
            >
              Exit to Main Site
            </button>
            <button
              onClick={() => logout()}
              className="text-xs font-mono uppercase bg-red-950/40 hover:bg-red-900/30 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg border border-red-900/20 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Logout from Admin Mode"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-neutral-950/70 border border-white/5 p-4.5 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Active Overrides</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-mono font-black text-brand-gold-400">{stats.activeOverrides}</span>
              <span className="text-xs text-neutral-500">/ {stats.totalEditable} field IDs</span>
            </div>
            <p className="text-[10px] text-neutral-400 font-sans mt-1.5">Currently customized values</p>
          </div>

          <div className="bg-neutral-950/70 border border-white/5 p-4.5 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Override Ratio</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-mono font-black text-white">{stats.overridePercentage}%</span>
            </div>
            <div className="w-full bg-neutral-900 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-brand-gold-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${stats.overridePercentage}%` }}
              />
            </div>
          </div>

          <div className="bg-neutral-950/70 border border-white/5 p-4.5 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Field Classification</span>
            <div className="grid grid-cols-2 gap-1.5 mt-2 text-[10px] font-mono">
              <div className="text-neutral-400 flex justify-between"><span>Stats:</span><strong className="text-white">{stats.statsCount}</strong></div>
              <div className="text-neutral-400 flex justify-between"><span>Specs:</span><strong className="text-white">{stats.equipCount}</strong></div>
              <div className="text-neutral-400 flex justify-between"><span>Zones:</span><strong className="text-white">{stats.countersCount}</strong></div>
              <div className="text-neutral-400 flex justify-between"><span>Milestones:</span><strong className="text-white">{stats.milestonesCount}</strong></div>
            </div>
          </div>

          <div className="bg-neutral-950/70 border border-white/5 p-4.5 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Global Restorative Controls</span>
            <div className="mt-2.5 flex gap-2">
              <button 
                onClick={() => {
                  if (confirm('Revert all municipal data to official blueprints? This will clear all active sandbox overrides.')) {
                    resetCategories(['Stats', 'Equipment Specs', 'Project Counters', 'Milestones']);
                  }
                }}
                disabled={stats.activeOverrides === 0}
                className="w-full bg-neutral-900 hover:bg-neutral-800 disabled:opacity-45 disabled:pointer-events-none text-brand-gold-400 border border-brand-gold-500/10 hover:border-brand-gold-500/30 text-[10px] font-mono font-bold uppercase py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-brand-gold-400 shrink-0" />
                Reset Sandbox
              </button>
            </div>
          </div>
        </div>

        {/* Nested Hash Routing views */}
        <Routes>
          <Route path="/" element={<OverridesTableView registry={registry} stats={stats} />} />
          <Route path="/overview" element={<DashboardSummaryView stats={stats} />} />
          <Route path="*" element={<OverridesTableView registry={registry} stats={stats} />} />
        </Routes>

      </div>
    </div>
  );
}

// View 1: Consolidated overrides management table
interface OverridesTableViewProps {
  registry: EditableFieldDef[];
  stats: any;
}

function OverridesTableView({ registry, stats }: OverridesTableViewProps) {
  const { editableData, getValue, updateValue, revertValue } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Stats' | 'Equipment Specs' | 'Project Counters' | 'Milestones'>('All');
  const [onlyOverridden, setOnlyOverridden] = useState(false);

  // Editing state
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlineValue, setInlineValue] = useState<string>('');

  // Process and Filter fields
  const filteredFields = useMemo(() => {
    return registry.filter(f => {
      const matchesSearch = f.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            f.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            f.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'All' || f.category === categoryFilter;
      
      const isOverridden = editableData[f.id] !== undefined;
      const matchesOverridden = !onlyOverridden || isOverridden;

      return matchesSearch && matchesCategory && matchesOverridden;
    });
  }, [registry, searchTerm, categoryFilter, onlyOverridden, editableData]);

  const handleStartInlineEdit = (f: EditableFieldDef, currentValue: string | number) => {
    setInlineEditingId(f.id);
    setInlineValue(currentValue.toString());
  };

  const handleSaveInlineEdit = (f: EditableFieldDef) => {
    let finalVal: string | number = inlineValue;
    if (typeof f.defaultValue === 'number') {
      const parsed = Number(inlineValue);
      finalVal = isNaN(parsed) ? f.defaultValue : parsed;
    }
    updateValue(f.id, finalVal);
    setInlineEditingId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Controls: Search, filter categories, toggle overrides */}
      <div className="bg-neutral-950 p-5 rounded-2xl border border-white/5 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
        
        {/* Search input */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-450" />
          <input
            type="text"
            placeholder="Search field ID, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-100 placeholder-neutral-450 focus:outline-none focus:ring-1 focus:ring-brand-gold-500 focus:border-brand-gold-500 font-sans"
          />
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-neutral-900 border border-white/5 rounded-xl p-1">
            {(['All', 'Stats', 'Equipment Specs', 'Project Counters', 'Milestones'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-[10px] font-mono uppercase px-3 py-1.5 rounded-lg transition-all ${
                  categoryFilter === cat
                    ? 'bg-brand-gold-500 text-brand-blue-950 font-extrabold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat === 'Equipment Specs' ? 'Specs' : cat === 'Project Counters' ? 'Zones' : cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => setOnlyOverridden(!onlyOverridden)}
            className={`text-[10px] font-mono uppercase px-4.5 py-2.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
              onlyOverridden
                ? 'bg-amber-950/40 text-brand-gold-400 border-brand-gold-500/40 shadow-inner'
                : 'bg-neutral-900 text-neutral-400 border-white/5 hover:text-white'
            }`}
          >
            <Filter className="w-3.5 h-3.5 shrink-0" />
            {onlyOverridden ? 'Showing Overridden' : 'Filter Overrides'}
          </button>
        </div>
      </div>

      {/* Main registry table card */}
      <div className="bg-neutral-950 rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-900/60 border-b border-white/5 text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                <th className="py-4 px-5">Field Identification & Category</th>
                <th className="py-4 px-5">Administrative Parameter Scope</th>
                <th className="py-4 px-5 text-center">Standard Default</th>
                <th className="py-4 px-5">Live Runtime State</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-sans">
              {filteredFields.length > 0 ? (
                filteredFields.map((field) => {
                  const isOverridden = editableData[field.id] !== undefined;
                  const liveValue = getValue(field.id, field.defaultValue);
                  const isEditing = inlineEditingId === field.id;

                  // Category Icon helper
                  let catIcon = <HardDrive className="w-3.5 h-3.5 text-blue-400" />;
                  if (field.category === 'Stats') catIcon = <Sliders className="w-3.5 h-3.5 text-emerald-400" />;
                  if (field.category === 'Project Counters') catIcon = <MapPin className="w-3.5 h-3.5 text-amber-400" />;
                  if (field.category === 'Milestones') catIcon = <Calendar className="w-3.5 h-3.5 text-purple-400" />;

                  return (
                    <tr 
                      key={field.id} 
                      className={`hover:bg-white/[0.015] transition-colors ${
                        isOverridden ? 'bg-brand-gold-500/[0.01]' : ''
                      }`}
                    >
                      <td className="py-4 px-5 max-w-[260px]">
                        <div className="space-y-1">
                          <code className="text-[10px] font-mono text-brand-gold-400 font-semibold block break-all">
                            {field.id}
                          </code>
                          <div className="flex items-center gap-1.5">
                            {catIcon}
                            <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
                              {field.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5 max-w-sm">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-neutral-200">{field.label}</p>
                          <p className="text-[10px] text-neutral-400 font-light leading-relaxed">
                            {field.description}
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-center font-mono text-[11px] text-neutral-400">
                        {field.defaultValue}
                      </td>

                      <td className="py-4 px-5 font-mono text-[11px]">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={inlineValue}
                              onChange={(e) => setInlineValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveInlineEdit(field);
                                if (e.key === 'Escape') setInlineEditingId(null);
                              }}
                              className="bg-neutral-900 border border-brand-gold-500 rounded px-2 py-1 text-xs text-white max-w-[140px] focus:outline-none focus:ring-1 focus:ring-brand-gold-500 font-mono"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveInlineEdit(field)}
                              className="p-1 bg-brand-gold-500 text-brand-blue-950 rounded hover:bg-brand-gold-400 cursor-pointer"
                              title="Commit override"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setInlineEditingId(null)}
                              className="p-1 bg-white/5 hover:bg-white/10 rounded text-neutral-400 cursor-pointer"
                              title="Cancel editing"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className={isOverridden ? 'text-brand-gold-400 font-bold' : 'text-neutral-300'}>
                              {liveValue}
                            </span>
                            {isOverridden ? (
                              <span className="inline-flex items-center gap-0.5 bg-brand-gold-500/10 text-brand-gold-400 border border-brand-gold-500/25 text-[8px] font-mono uppercase px-1.5 py-0.5 rounded-md leading-none">
                                <AlertCircle className="w-2 h-2" /> Custom
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 bg-neutral-900 text-neutral-500 border border-white/5 text-[8px] font-mono uppercase px-1.5 py-0.5 rounded-md leading-none">
                                <CheckCircle2 className="w-2 h-2" /> Default
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {!isEditing && (
                            <button
                              onClick={() => handleStartInlineEdit(field, liveValue)}
                              className="bg-white/5 hover:bg-white/10 text-neutral-300 p-1.5 rounded-lg border border-white/5 transition-all cursor-pointer inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider hover:text-white"
                              title="Override value inline"
                            >
                              <Pencil className="w-3 h-3 text-neutral-400" />
                              Edit
                            </button>
                          )}
                          {isOverridden && (
                            <button
                              onClick={() => revertValue(field.id)}
                              className="bg-amber-950/20 hover:bg-amber-900/30 text-brand-gold-400 p-1.5 rounded-lg border border-brand-gold-500/15 transition-all cursor-pointer inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider"
                              title="Revert to standard default"
                            >
                              <RotateCcw className="w-3 h-3 text-brand-gold-400 shrink-0" />
                              Revert
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-500 font-mono">
                    <AlertCircle className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                    No parameters found matching current search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footnotes */}
        <div className="bg-neutral-900/40 border-t border-white/5 p-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-neutral-500 font-mono uppercase tracking-wider">
          <span>Showing {filteredFields.length} of {registry.length} configurable fields</span>
          <span className="mt-1 sm:mt-0">All customizations synchronize automatically across the client</span>
        </div>
      </div>
    </div>
  );
}

// View 2: High-level Dashboard Summary overview
interface DashboardSummaryViewProps {
  stats: any;
}

function DashboardSummaryView({ stats }: DashboardSummaryViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Overview stats panel */}
      <div className="bg-neutral-950 border border-white/5 p-6 rounded-2xl md:col-span-2 space-y-6">
        <div>
          <h2 className="font-display font-black text-xl uppercase tracking-tight text-white">Consolidated Sandbox Status</h2>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            Comprehensive audit metrics on customized parameters active across regional dockets.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Total Custom Field Adjustments</span>
            <p className="text-2xl font-mono font-black text-brand-gold-400 mt-1">{stats.activeOverrides}</p>
            <p className="text-[9px] text-neutral-500 mt-1 font-sans">Active in current sandbox session.</p>
          </div>
          <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Original Untouched Defaults</span>
            <p className="text-2xl font-mono font-black text-emerald-400 mt-1">{stats.totalEditable - stats.activeOverrides}</p>
            <p className="text-[9px] text-neutral-500 mt-1 font-sans">Adhering to system standards.</p>
          </div>
        </div>

        <div className="space-y-3.5">
          <h3 className="font-display font-bold text-sm text-neutral-200">Sandbox Distribution Profile</h3>
          <div className="space-y-2 font-mono text-xs">
            
            <div className="space-y-1">
              <div className="flex justify-between text-neutral-400">
                <span>Statistical Highlights & Corporate Identity:</span>
                <span className="text-white">{stats.statsCount} customized</span>
              </div>
              <div className="h-2 bg-neutral-900 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${stats.activeOverrides > 0 ? (stats.statsCount / stats.activeOverrides) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-neutral-400">
                <span>Machinery Fleet & Specifications:</span>
                <span className="text-white">{stats.equipCount} customized</span>
              </div>
              <div className="h-2 bg-neutral-900 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${stats.activeOverrides > 0 ? (stats.equipCount / stats.activeOverrides) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-neutral-400">
                <span>Active Regional Disaster Counters:</span>
                <span className="text-white">{stats.countersCount} customized</span>
              </div>
              <div className="h-2 bg-neutral-900 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${stats.activeOverrides > 0 ? (stats.countersCount / stats.activeOverrides) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-neutral-400">
                <span>Milestones & Timeline Nodes:</span>
                <span className="text-white">{stats.milestonesCount} customized</span>
              </div>
              <div className="h-2 bg-neutral-900 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${stats.activeOverrides > 0 ? (stats.milestonesCount / stats.activeOverrides) * 100 : 0}%` }} />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Guide/Information panel */}
      <div className="bg-neutral-950 border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
        <div className="space-y-4">
          <h2 className="font-display font-black text-sm uppercase tracking-wider text-brand-gold-400 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 shrink-0" />
            Sandbox Supervision
          </h2>
          <div className="space-y-3 text-xs text-neutral-400 font-sans leading-relaxed">
            <p>
              This municipal override interface permits testing site layouts with customizable dockets and assets.
            </p>
            <p>
              When a value is customized here, a dynamic border pulse highlight activates across the public site, making it obvious which values are non-default.
            </p>
            <p>
              To return any page block to standard values, click the <strong className="text-brand-gold-400 font-semibold">Revert</strong> action in the dockets list or trigger a group reset.
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-4 mt-6">
          <Link 
            to="/" 
            className="text-xs font-mono uppercase bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-bold px-4 py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Manage Override Records
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}
