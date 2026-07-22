import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  useSiteContent,
  HeroContent,
  AboutContent,
  StatsContent,
  ServiceItem,
  ClientItem,
  BoardMemberItem,
  ProjectItem,
  ContactContent,
  FooterContent,
} from '../context/SiteContentContext';
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
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Image as ImageIcon,
  ArrowUpRight,
  Database,
} from 'lucide-react';
import { COMPANY_DETAILS } from '../data';

type ActiveTab =
  | 'hero'
  | 'about'
  | 'stats'
  | 'services'
  | 'clients'
  | 'governingBoard'
  | 'projects'
  | 'contact'
  | 'footer';

export function AdminDashboardView() {
  const { user, logout } = useAuth();
  const { siteContent, loading, updateSection, seedInitialData } = useSiteContent();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<ActiveTab>('hero');
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);

  // Form states for each section
  const [heroForm, setHeroForm] = useState<HeroContent>(siteContent.hero);
  const [aboutForm, setAboutForm] = useState<AboutContent>(siteContent.about);
  const [statsForm, setStatsForm] = useState<StatsContent>(siteContent.stats);
  const [servicesForm, setServicesForm] = useState<ServiceItem[]>(siteContent.services.services);
  const [clientsForm, setClientsForm] = useState<ClientItem[]>(siteContent.clients.clients);
  const [boardForm, setBoardForm] = useState<BoardMemberItem[]>(siteContent.governingBoard.boardMembers);
  const [projectsForm, setProjectsForm] = useState<ProjectItem[]>(siteContent.projects.projects);
  const [contactForm, setContactForm] = useState<ContactContent>(siteContent.contact);
  const [footerForm, setFooterForm] = useState<FooterContent>(siteContent.footer);

  // Sync state when Firestore siteContent changes
  React.useEffect(() => {
    setHeroForm(siteContent.hero);
    setAboutForm(siteContent.about);
    setStatsForm(siteContent.stats);
    setServicesForm(siteContent.services.services);
    setClientsForm(siteContent.clients.clients);
    setBoardForm(siteContent.governingBoard.boardMembers);
    setProjectsForm(siteContent.projects.projects);
    setContactForm(siteContent.contact);
    setFooterForm(siteContent.footer);
  }, [siteContent]);

  const triggerToast = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 4000);
  };

  const handleSaveSection = async (sectionKey: ActiveTab, data: any) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      await updateSection(sectionKey as any, data);
      triggerToast(`Successfully saved changes for ${sectionKey.toUpperCase()} section to Firestore!`);
    } catch (err: any) {
      console.error('Error saving section:', err);
      setSaveError(err.message || 'Failed to save changes to Firestore.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSeedDefaults = async () => {
    if (window.confirm('Populate Firestore with default site data? This will overwrite existing empty documents with default values.')) {
      setIsSeeding(true);
      try {
        await seedInitialData();
        triggerToast('Firestore initialized with default site content!');
      } catch (err: any) {
        console.error('Seeding failed:', err);
        setSaveError('Failed to seed default data.');
      } finally {
        setIsSeeding(false);
      }
    }
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'hero', label: 'Hero Section', icon: <Layout className="w-4 h-4" /> },
    { id: 'about', label: 'About Us', icon: <Info className="w-4 h-4" /> },
    { id: 'stats', label: 'Key Statistics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'services', label: 'Services Array', icon: <Wrench className="w-4 h-4" /> },
    { id: 'clients', label: 'Client Logos', icon: <Building2 className="w-4 h-4" /> },
    { id: 'governingBoard', label: 'Governing Board', icon: <Users className="w-4 h-4" /> },
    { id: 'projects', label: 'Project Entries', icon: <FolderKanban className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact Info', icon: <PhoneCall className="w-4 h-4" /> },
    { id: 'footer', label: 'Footer & Links', icon: <FileText className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-brand-gold-500 border-t-transparent rounded-full animate-spin" />
          <span>Connecting to Firestore Live Database...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans border-t border-white/5">
      {/* Upper Navigation Ribbon */}
      <header className="bg-neutral-900 border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-gold-500/15 border border-brand-gold-500/30 rounded-xl text-brand-gold-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-tight">
                  Sri Velan & Co — Firestore Admin Portal
                </h1>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-bold">
                  Firestore Connected
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-light mt-0.5">
                Logged in as: <strong className="text-neutral-200 font-mono">{user?.email}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={handleSeedDefaults}
              disabled={isSeeding}
              className="text-xs font-mono uppercase bg-neutral-800 hover:bg-neutral-700 text-brand-gold-400 px-3.5 py-2 rounded-xl border border-brand-gold-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Seed default content into Firestore"
            >
              <Database className="w-3.5 h-3.5 text-brand-gold-400" />
              {isSeeding ? 'Seeding...' : 'Seed Default Data'}
            </button>

            <button
              onClick={() => navigate('/')}
              className="text-xs font-mono uppercase bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3.5 py-2 rounded-xl border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              Live Site
            </button>

            <button
              onClick={logout}
              className="text-xs font-mono uppercase bg-red-950/40 hover:bg-red-900/40 text-red-400 border border-red-900/30 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Global Toast Alert */}
      {saveSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-950 border border-emerald-500/50 text-emerald-300 p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-medium font-sans">{saveSuccess}</p>
        </div>
      )}

      {saveError && (
        <div className="fixed top-20 right-6 z-50 bg-red-950 border border-red-500/50 text-red-300 p-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-md">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-xs font-medium font-sans">{saveError}</p>
        </div>
      )}

      {/* Main Admin Workspace Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="space-y-2">
          <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest px-2 mb-2">
            Firestore Content Collections
          </p>
          <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-2 space-y-1">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-brand-gold-500 to-amber-500 text-brand-blue-950 font-bold shadow-md'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Form Panel */}
        <div className="md:col-span-3 bg-neutral-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* TAB 1: HERO */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-display font-bold text-lg text-white">Hero Section</h2>
                  <p className="text-xs text-neutral-400 font-light">
                    Firestore Path: <code className="text-brand-gold-400 font-mono">siteContent/hero</code>
                  </p>
                </div>
                <button
                  onClick={() => handleSaveSection('hero', heroForm)}
                  disabled={isSaving}
                  className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-display font-extrabold text-xs uppercase px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase">Badge Tagline</label>
                  <input
                    type="text"
                    value={heroForm.badge}
                    onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-brand-gold-500 font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase">Main Title Heading</label>
                  <input
                    type="text"
                    value={heroForm.title}
                    onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-brand-gold-500 font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase">Subheading / Classification</label>
                  <input
                    type="text"
                    value={heroForm.subtitle}
                    onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-brand-gold-500 font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase">Detailed Tagline Paragraph</label>
                  <textarea
                    rows={4}
                    value={heroForm.tagline}
                    onChange={(e) => setHeroForm({ ...heroForm, tagline: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-brand-gold-500 font-sans leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-display font-bold text-lg text-white">About Us Details</h2>
                  <p className="text-xs text-neutral-400 font-light">
                    Firestore Path: <code className="text-brand-gold-400 font-mono">siteContent/about</code>
                  </p>
                </div>
                <button
                  onClick={() => handleSaveSection('about', aboutForm)}
                  disabled={isSaving}
                  className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-display font-extrabold text-xs uppercase px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase">Year Established</label>
                  <input
                    type="number"
                    value={aboutForm.yearEstablished}
                    onChange={(e) => setAboutForm({ ...aboutForm, yearEstablished: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-brand-gold-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase">Founder / Governing Partner Name</label>
                  <input
                    type="text"
                    value={aboutForm.founderName}
                    onChange={(e) => setAboutForm({ ...aboutForm, founderName: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-brand-gold-500 font-sans"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase">Contractor Accreditation Designation</label>
                  <input
                    type="text"
                    value={aboutForm.civilContractorText}
                    onChange={(e) => setAboutForm({ ...aboutForm, civilContractorText: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-brand-gold-500 font-sans"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase">Company Overview / History</label>
                  <textarea
                    rows={4}
                    value={aboutForm.companyDescription}
                    onChange={(e) => setAboutForm({ ...aboutForm, companyDescription: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-brand-gold-500 font-sans leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase">Mission Statement</label>
                  <textarea
                    rows={3}
                    value={aboutForm.missionText}
                    onChange={(e) => setAboutForm({ ...aboutForm, missionText: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-brand-gold-500 font-sans leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase">Vision Statement</label>
                  <textarea
                    rows={3}
                    value={aboutForm.visionText}
                    onChange={(e) => setAboutForm({ ...aboutForm, visionText: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-brand-gold-500 font-sans leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-display font-bold text-lg text-white">Numeric Key Statistics</h2>
                  <p className="text-xs text-neutral-400 font-light">
                    Firestore Path: <code className="text-brand-gold-400 font-mono">siteContent/stats</code>
                  </p>
                </div>
                <button
                  onClick={() => handleSaveSection('stats', statsForm)}
                  disabled={isSaving}
                  className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-display font-extrabold text-xs uppercase px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-neutral-950 border border-white/10 p-4 rounded-2xl space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase text-[10px]">Years of Industry Legacy</label>
                  <input
                    type="number"
                    value={statsForm.yearsExperience}
                    onChange={(e) => setStatsForm({ ...statsForm, yearsExperience: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-base focus:border-brand-gold-500"
                  />
                </div>

                <div className="bg-neutral-950 border border-white/10 p-4 rounded-2xl space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase text-[10px]">Projects Completed</label>
                  <input
                    type="number"
                    value={statsForm.projectsCompleted}
                    onChange={(e) => setStatsForm({ ...statsForm, projectsCompleted: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-base focus:border-brand-gold-500"
                  />
                </div>

                <div className="bg-neutral-950 border border-white/10 p-4 rounded-2xl space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase text-[10px]">Clients & Departments Served</label>
                  <input
                    type="number"
                    value={statsForm.clientsServed}
                    onChange={(e) => setStatsForm({ ...statsForm, clientsServed: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-base focus:border-brand-gold-500"
                  />
                </div>

                <div className="bg-neutral-950 border border-white/10 p-4 rounded-2xl space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase text-[10px]">Active Team Size</label>
                  <input
                    type="number"
                    value={statsForm.teamSize}
                    onChange={(e) => setStatsForm({ ...statsForm, teamSize: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-base focus:border-brand-gold-500"
                  />
                </div>

                <div className="bg-neutral-950 border border-white/10 p-4 rounded-2xl space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase text-[10px]">Dewatering Fleet Pump Count</label>
                  <input
                    type="number"
                    value={statsForm.dewateringFleet}
                    onChange={(e) => setStatsForm({ ...statsForm, dewateringFleet: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-base focus:border-brand-gold-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SERVICES ARRAY */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-display font-bold text-lg text-white">Services Offerings Array</h2>
                  <p className="text-xs text-neutral-400 font-light">
                    Firestore Path: <code className="text-brand-gold-400 font-mono">siteContent/services</code>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setServicesForm([
                        ...servicesForm,
                        {
                          id: `service_${Date.now()}`,
                          title: 'New Service Item',
                          description: 'Description of the new engineering service.',
                          badge: 'Service Spec',
                        },
                      ])
                    }
                    className="bg-neutral-800 hover:bg-neutral-700 text-brand-gold-400 border border-brand-gold-500/30 text-xs font-mono uppercase px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Service
                  </button>

                  <button
                    onClick={() => handleSaveSection('services', { services: servicesForm })}
                    disabled={isSaving}
                    className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-display font-extrabold text-xs uppercase px-5 py-2 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Services'}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {servicesForm.map((s, idx) => (
                  <div key={s.id || idx} className="bg-neutral-950 border border-white/10 rounded-2xl p-4 space-y-3 relative group">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-brand-gold-400 uppercase tracking-widest">
                        Service #{idx + 1}
                      </span>
                      <button
                        onClick={() => setServicesForm(servicesForm.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-900/50 p-1.5 rounded-lg border border-red-900/30 transition-all cursor-pointer"
                        title="Remove service entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="block text-neutral-400 font-mono">Title</label>
                        <input
                          type="text"
                          value={s.title}
                          onChange={(e) => {
                            const copy = [...servicesForm];
                            copy[idx].title = e.target.value;
                            setServicesForm(copy);
                          }}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-neutral-400 font-mono">Badge Tag</label>
                        <input
                          type="text"
                          value={s.badge || ''}
                          onChange={(e) => {
                            const copy = [...servicesForm];
                            copy[idx].badge = e.target.value;
                            setServicesForm(copy);
                          }}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <label className="block text-neutral-400 font-mono">Description</label>
                        <textarea
                          rows={2}
                          value={s.description}
                          onChange={(e) => {
                            const copy = [...servicesForm];
                            copy[idx].description = e.target.value;
                            setServicesForm(copy);
                          }}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white font-sans"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CLIENTS */}
          {activeTab === 'clients' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-display font-bold text-lg text-white">Client Organizations & Logos</h2>
                  <p className="text-xs text-neutral-400 font-light">
                    Firestore Path: <code className="text-brand-gold-400 font-mono">siteContent/clients</code>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setClientsForm([
                        ...clientsForm,
                        {
                          id: `client_${Date.now()}`,
                          name: 'New Client Partner',
                          category: 'Government Department',
                        },
                      ])
                    }
                    className="bg-neutral-800 hover:bg-neutral-700 text-brand-gold-400 border border-brand-gold-500/30 text-xs font-mono uppercase px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Client
                  </button>

                  <button
                    onClick={() => handleSaveSection('clients', { clients: clientsForm })}
                    disabled={isSaving}
                    className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-display font-extrabold text-xs uppercase px-5 py-2 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Clients'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clientsForm.map((c, idx) => (
                  <div key={c.id || idx} className="bg-neutral-950 border border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-brand-gold-400 uppercase">Client #{idx + 1}</span>
                      <button
                        onClick={() => setClientsForm(clientsForm.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:text-red-300 bg-red-950/30 p-1.5 rounded-lg border border-red-900/30 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="block text-neutral-400 font-mono text-[10px]">Client Name</label>
                        <input
                          type="text"
                          value={c.name}
                          onChange={(e) => {
                            const copy = [...clientsForm];
                            copy[idx].name = e.target.value;
                            setClientsForm(copy);
                          }}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-1.5 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-400 font-mono text-[10px]">Category</label>
                        <input
                          type="text"
                          value={c.category || ''}
                          onChange={(e) => {
                            const copy = [...clientsForm];
                            copy[idx].category = e.target.value;
                            setClientsForm(copy);
                          }}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-1.5 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-400 font-mono text-[10px]">Logo Image URL</label>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={c.logoUrl || ''}
                          onChange={(e) => {
                            const copy = [...clientsForm];
                            copy[idx].logoUrl = e.target.value;
                            setClientsForm(copy);
                          }}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-1.5 text-white font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: GOVERNING BOARD */}
          {activeTab === 'governingBoard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-display font-bold text-lg text-white">Governing Board & Leadership</h2>
                  <p className="text-xs text-neutral-400 font-light">
                    Firestore Path: <code className="text-brand-gold-400 font-mono">siteContent/governingBoard</code>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setBoardForm([
                        ...boardForm,
                        {
                          id: `board_${Date.now()}`,
                          name: 'New Board Member',
                          designation: 'Executive Officer',
                          photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
                          bio: 'Executive leader bio text.',
                        },
                      ])
                    }
                    className="bg-neutral-800 hover:bg-neutral-700 text-brand-gold-400 border border-brand-gold-500/30 text-xs font-mono uppercase px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Member
                  </button>

                  <button
                    onClick={() => handleSaveSection('governingBoard', { boardMembers: boardForm })}
                    disabled={isSaving}
                    className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-display font-extrabold text-xs uppercase px-5 py-2 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Board'}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {boardForm.map((m, idx) => (
                  <div key={m.id || idx} className="bg-neutral-950 border border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {m.photoUrl && (
                          <img
                            src={m.photoUrl}
                            alt={m.name}
                            className="w-10 h-10 rounded-full object-cover border border-brand-gold-500/40"
                          />
                        )}
                        <span className="font-mono text-[10px] text-brand-gold-400 uppercase">
                          Board Member #{idx + 1}
                        </span>
                      </div>
                      <button
                        onClick={() => setBoardForm(boardForm.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:text-red-300 bg-red-950/30 p-1.5 rounded-lg border border-red-900/30 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-neutral-400 font-mono">Full Name</label>
                        <input
                          type="text"
                          value={m.name}
                          onChange={(e) => {
                            const copy = [...boardForm];
                            copy[idx].name = e.target.value;
                            setBoardForm(copy);
                          }}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-400 font-mono">Designation / Role</label>
                        <input
                          type="text"
                          value={m.designation}
                          onChange={(e) => {
                            const copy = [...boardForm];
                            copy[idx].designation = e.target.value;
                            setBoardForm(copy);
                          }}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-neutral-400 font-mono">Photo URL</label>
                        <input
                          type="text"
                          value={m.photoUrl}
                          onChange={(e) => {
                            const copy = [...boardForm];
                            copy[idx].photoUrl = e.target.value;
                            setBoardForm(copy);
                          }}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-[11px]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-neutral-400 font-mono">Biography / Track Record</label>
                        <textarea
                          rows={3}
                          value={m.bio}
                          onChange={(e) => {
                            const copy = [...boardForm];
                            copy[idx].bio = e.target.value;
                            setBoardForm(copy);
                          }}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white font-sans leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-display font-bold text-lg text-white">Project Entries Portfolio</h2>
                  <p className="text-xs text-neutral-400 font-light">
                    Firestore Path: <code className="text-brand-gold-400 font-mono">siteContent/projects</code>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setProjectsForm([
                        ...projectsForm,
                        {
                          id: `proj_${Date.now()}`,
                          title: 'New Engineering Project',
                          description: 'Scope details of the construction or dewatering project.',
                          imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&q=80',
                          year: new Date().getFullYear().toString(),
                          status: 'In Progress',
                          location: 'Tamil Nadu',
                        },
                      ])
                    }
                    className="bg-neutral-800 hover:bg-neutral-700 text-brand-gold-400 border border-brand-gold-500/30 text-xs font-mono uppercase px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Project
                  </button>

                  <button
                    onClick={() => handleSaveSection('projects', { projects: projectsForm })}
                    disabled={isSaving}
                    className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-display font-extrabold text-xs uppercase px-5 py-2 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Projects'}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {projectsForm.map((p, idx) => (
                  <div key={p.id || idx} className="bg-neutral-950 border border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-brand-gold-400 uppercase">
                        Project #{idx + 1}
                      </span>
                      <button
                        onClick={() => setProjectsForm(projectsForm.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:text-red-300 bg-red-950/30 p-1.5 rounded-lg border border-red-900/30 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="md:col-span-2">
                        <label className="block text-neutral-400 font-mono">Project Title</label>
                        <input
                          type="text"
                          value={p.title}
                          onChange={(e) => {
                            const copy = [...projectsForm];
                            copy[idx].title = e.target.value;
                            setProjectsForm(copy);
                          }}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-400 font-mono">Status</label>
                        <select
                          value={p.status}
                          onChange={(e) => {
                            const copy = [...projectsForm];
                            copy[idx].status = e.target.value;
                            setProjectsForm(copy);
                          }}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                        >
                          <option value="Completed">Completed</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Mobilizing">Mobilizing</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-neutral-400 font-mono">Execution Year</label>
                        <input
                          type="text"
                          value={p.year}
                          onChange={(e) => {
                            const copy = [...projectsForm];
                            copy[idx].year = e.target.value;
                            setProjectsForm(copy);
                          }}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-neutral-400 font-mono">Location Coordinates</label>
                        <input
                          type="text"
                          value={p.location || ''}
                          onChange={(e) => {
                            const copy = [...projectsForm];
                            copy[idx].location = e.target.value;
                            setProjectsForm(copy);
                          }}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-neutral-400 font-mono">Image URL</label>
                        <input
                          type="text"
                          value={p.imageUrl}
                          onChange={(e) => {
                            const copy = [...projectsForm];
                            copy[idx].imageUrl = e.target.value;
                            setProjectsForm(copy);
                          }}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-[11px]"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-neutral-400 font-mono">Description</label>
                        <textarea
                          rows={2}
                          value={p.description}
                          onChange={(e) => {
                            const copy = [...projectsForm];
                            copy[idx].description = e.target.value;
                            setProjectsForm(copy);
                          }}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white font-sans leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: CONTACT */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-display font-bold text-lg text-white">Contact & Office Addresses</h2>
                  <p className="text-xs text-neutral-400 font-light">
                    Firestore Path: <code className="text-brand-gold-400 font-mono">siteContent/contact</code>
                  </p>
                </div>
                <button
                  onClick={() => handleSaveSection('contact', contactForm)}
                  disabled={isSaving}
                  className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-display font-extrabold text-xs uppercase px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Contact'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase">Primary Phone</label>
                  <input
                    type="text"
                    value={contactForm.phonePrimary}
                    onChange={(e) => setContactForm({ ...contactForm, phonePrimary: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase">Secondary Phone</label>
                  <input
                    type="text"
                    value={contactForm.phoneSecondary}
                    onChange={(e) => setContactForm({ ...contactForm, phoneSecondary: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase">Primary Email</label>
                  <input
                    type="email"
                    value={contactForm.emailPrimary}
                    onChange={(e) => setContactForm({ ...contactForm, emailPrimary: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase">Secondary Email</label>
                  <input
                    type="email"
                    value={contactForm.emailSecondary}
                    onChange={(e) => setContactForm({ ...contactForm, emailSecondary: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase">WhatsApp Number</label>
                  <input
                    type="text"
                    value={contactForm.whatsappNumber}
                    onChange={(e) => setContactForm({ ...contactForm, whatsappNumber: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase">Working Hours</label>
                  <input
                    type="text"
                    value={contactForm.workingHours}
                    onChange={(e) => setContactForm({ ...contactForm, workingHours: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-white font-sans"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase">Villupuram HQ Address</label>
                  <textarea
                    rows={2}
                    value={contactForm.addressVillupuram}
                    onChange={(e) => setContactForm({ ...contactForm, addressVillupuram: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-white font-sans leading-relaxed"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase">Chennai Regional Office Address</label>
                  <textarea
                    rows={2}
                    value={contactForm.addressChennai}
                    onChange={(e) => setContactForm({ ...contactForm, addressChennai: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-white font-sans leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: FOOTER */}
          {activeTab === 'footer' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-display font-bold text-lg text-white">Footer Content & Links</h2>
                  <p className="text-xs text-neutral-400 font-light">
                    Firestore Path: <code className="text-brand-gold-400 font-mono">siteContent/footer</code>
                  </p>
                </div>
                <button
                  onClick={() => handleSaveSection('footer', footerForm)}
                  disabled={isSaving}
                  className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-display font-extrabold text-xs uppercase px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Footer'}
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase">Footer Tagline Description</label>
                  <textarea
                    rows={3}
                    value={footerForm.description}
                    onChange={(e) => setFooterForm({ ...footerForm, description: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-white font-sans leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase">Copyright Notice</label>
                  <input
                    type="text"
                    value={footerForm.copyright}
                    onChange={(e) => setFooterForm({ ...footerForm, copyright: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-white font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase">Instagram URL</label>
                  <input
                    type="text"
                    value={footerForm.instagramUrl}
                    onChange={(e) => setFooterForm({ ...footerForm, instagramUrl: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono text-[11px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-300 font-mono uppercase">Company Brochure Drive URL</label>
                  <input
                    type="text"
                    value={footerForm.brochureUrl}
                    onChange={(e) => setFooterForm({ ...footerForm, brochureUrl: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
