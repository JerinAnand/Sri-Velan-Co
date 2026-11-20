import type { LucideIcon } from 'lucide-react';
import {
  Layout,
  Info,
  BarChart3,
  Building2,
  Users,
  FolderKanban,
  PhoneCall,
  FileText,
  Globe,
  Truck,
  CloudRain,
  Bot,
  Menu as MenuIcon,
  Layers,
  MapPin,
  Wrench,
  PanelTop,
  PanelBottom,
  Home,
  Briefcase,
  Compass,
} from 'lucide-react';

export type ActiveTab =
  | 'hero'
  | 'about'
  | 'stats'
  | 'services'
  | 'chennai'
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

export type NavDomainId = 'global' | 'pages' | 'tools';

export interface NavSectionItem {
  id: ActiveTab;
  label: string;
  icon: LucideIcon;
  description: string;
  keywords?: string[];
}

export interface NavGroup {
  id: string;
  label: string;
  domain: NavDomainId;
  icon: LucideIcon;
  items: NavSectionItem[];
}

export interface NavDomain {
  id: NavDomainId;
  label: string;
  subtitle: string;
}

export const NAV_DOMAINS: NavDomain[] = [
  { id: 'global', label: 'Global', subtitle: 'Site-wide settings' },
  { id: 'pages', label: 'Pages', subtitle: 'Public page content' },
  { id: 'tools', label: 'Tools', subtitle: 'Interactive utilities' },
];

export const NAV_GROUPS: NavGroup[] = [
  // GLOBAL
  {
    id: 'global-header',
    label: 'Header',
    domain: 'global',
    icon: PanelTop,
    items: [
      {
        id: 'navigation',
        label: 'Navigation Bar',
        icon: MenuIcon,
        description: 'Top bar logo, bilingual menu labels, and route links.',
        keywords: ['menu', 'logo', 'header', 'routes'],
      },
      {
        id: 'weatherAlertBanner',
        label: 'Weather Alert Banner',
        icon: CloudRain,
        description: 'Site-wide monsoon dispatch alert banner and severity.',
        keywords: ['monsoon', 'alert', 'banner', 'warning'],
      },
    ],
  },
  {
    id: 'global-footer',
    label: 'Footer',
    domain: 'global',
    icon: PanelBottom,
    items: [
      {
        id: 'footer',
        label: 'Footer Content',
        icon: FileText,
        description: 'Company summary, copyright line, Instagram, and brochure URL.',
        keywords: ['copyright', 'social', 'brochure', 'footer'],
      },
      {
        id: 'contact',
        label: 'Contact & Offices',
        icon: PhoneCall,
        description: 'Hotlines, emails, WhatsApp dispatch, and office addresses.',
        keywords: ['phone', 'email', 'address', 'villupuram', 'chennai', 'whatsapp'],
      },
    ],
  },
  {
    id: 'global-translations',
    label: 'Translations (EN/TA)',
    domain: 'global',
    icon: Globe,
    items: [
      {
        id: 'translations',
        label: 'Translations (EN/TA)',
        icon: Globe,
        description: 'Site-wide English and Tamil interface dictionary JSON.',
        keywords: ['tamil', 'english', 'i18n', 'json', 'language'],
      },
    ],
  },

  // PAGES
  {
    id: 'page-home',
    label: 'Home Page',
    domain: 'pages',
    icon: Home,
    items: [
      {
        id: 'hero',
        label: 'Hero Section',
        icon: Layout,
        description: 'Homepage primary hero carousel slides in English and Tamil.',
        keywords: ['slides', 'banner', 'headline', 'home'],
      },
      {
        id: 'stats',
        label: 'Stats & Metrics',
        icon: BarChart3,
        description: 'Years of experience, completed projects, clients, and fleet counts.',
        keywords: ['numbers', 'kpi', 'metrics', 'experience'],
      },
      {
        id: 'clients',
        label: 'Clients & Depts',
        icon: Building2,
        description: 'Government departments, client organizations, and logos.',
        keywords: ['departments', 'pwd', 'cmrl', 'gcc', 'logos'],
      },
    ],
  },
  {
    id: 'page-about',
    label: 'About Us Page',
    domain: 'pages',
    icon: Info,
    items: [
      {
        id: 'about',
        label: 'About Us',
        icon: Info,
        description: 'Company incorporation history, founder, mission, and vision.',
        keywords: ['history', 'mission', 'vision', 'founder'],
      },
      {
        id: 'governingBoard',
        label: 'Leadership',
        icon: Users,
        description: 'Featured leadership profiles and governing board team members.',
        keywords: ['board', 'director', 'partner', 'team', 'leadership'],
      },
    ],
  },
  {
    id: 'page-chennai',
    label: 'Chennai Page',
    domain: 'pages',
    icon: MapPin,
    items: [
      {
        id: 'chennai',
        label: 'Chennai Page CMS',
        icon: MapPin,
        description: 'Chennai monsoon banner, bilingual titles, and GCC portal card.',
        keywords: ['gcc', 'monsoon', 'zone', 'chennai'],
      },
    ],
  },
  {
    id: 'page-equipment',
    label: 'Equipment Fleet Page',
    domain: 'pages',
    icon: Truck,
    items: [
      {
        id: 'equipment',
        label: 'Equipment Fleet',
        icon: Truck,
        description: 'Fleet introduction, machinery categories, unit counts, and specs.',
        keywords: ['machinery', 'pumps', 'tractors', 'fleet'],
      },
      {
        id: 'capabilityStatement',
        label: 'Capability Statement',
        icon: FileText,
        description: 'Capability document headline, summary, certifications, and PDF link.',
        keywords: ['certifications', 'pdf', 'accreditation', 'capability'],
      },
    ],
  },
  {
    id: 'page-projects',
    label: 'Projects Page',
    domain: 'pages',
    icon: Briefcase,
    items: [
      {
        id: 'services',
        label: 'Projects Page – Services Dashboard',
        icon: Compass,
        description: 'Dewatering service cards, highlights, and execution photography.',
        keywords: ['services', 'dewatering', 'flood', 'drainage'],
      },
      {
        id: 'projects',
        label: 'Projects',
        icon: FolderKanban,
        description: 'Featured infrastructure projects, status, location, and highlights.',
        keywords: ['portfolio', 'case studies', 'work'],
      },
      {
        id: 'constructionExperience',
        label: 'Construction Experience',
        icon: Layers,
        description: 'Brochure records by department category in English and Tamil.',
        keywords: ['brochure', 'records', 'experience', 'categories'],
      },
    ],
  },
  {
    id: 'page-broomer',
    label: 'Hydraulic Broomer Page',
    domain: 'pages',
    icon: Wrench,
    items: [
      {
        id: 'hydraulicBroomer',
        label: 'Hydraulic Broomer',
        icon: Wrench,
        description: 'Machine overview, specification matrix, product photo, and demo video.',
        keywords: ['sweeper', 'machine', 'specs', 'video'],
      },
    ],
  },

  // TOOLS
  {
    id: 'tools-chatbot',
    label: 'VELAN AI Chatbot',
    domain: 'tools',
    icon: Bot,
    items: [
      {
        id: 'chatbot',
        label: 'VELAN AI Chatbot',
        icon: Bot,
        description: 'Floating AI assistant visibility, greeting, avatar, and guidelines.',
        keywords: ['ai', 'assistant', 'chat', 'bot'],
      },
    ],
  },
];

export interface BreadcrumbTrail {
  domainLabel: string;
  groupLabel: string;
  sectionLabel: string;
  isStandaloneGroup: boolean;
  groupId: string;
}

export function getBreadcrumbForTab(tabId: ActiveTab): BreadcrumbTrail {
  for (const group of NAV_GROUPS) {
    const item = group.items.find((i) => i.id === tabId);
    if (item) {
      const domain = NAV_DOMAINS.find((d) => d.id === group.domain);
      const isStandalone =
        group.id === 'global-translations' || group.id === 'tools-chatbot';
      return {
        domainLabel: domain?.label || 'CMS',
        groupLabel: group.label,
        sectionLabel: item.label,
        isStandaloneGroup: isStandalone,
        groupId: group.id,
      };
    }
  }
  return {
    domainLabel: 'Pages',
    groupLabel: 'Home Page',
    sectionLabel: 'Hero Section',
    isStandaloneGroup: false,
    groupId: 'page-home',
  };
}

export function getSectionMeta(tabId: ActiveTab): NavSectionItem | undefined {
  for (const group of NAV_GROUPS) {
    const found = group.items.find((i) => i.id === tabId);
    if (found) return found;
  }
  return undefined;
}
