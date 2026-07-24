import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, collection, addDoc, query, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { COMPANY_DETAILS, OFFICES, SERVICE_CATEGORIES } from '../data';
import { INITIAL_CONSTRUCTION_EXPERIENCE } from '../data/constructionExperience';
import { ConstructionExperienceContent } from '../types';
import { translations as DEFAULT_TRANSLATIONS } from '../translations';

// Interfaces for structured site content sections
export interface HeroContent {
  title: string;
  subtitle: string;
  tagline: string;
  badge: string;
}

export interface AboutContent {
  companyDescription: string;
  yearEstablished: number;
  founderName: string;
  civilContractorText: string;
  missionText: string;
  visionText: string;
}

export interface StatsContent {
  yearsExperience: number;
  projectsCompleted: number;
  clientsServed: number;
  teamSize: number;
  dewateringFleet: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  badge?: string;
  highlights?: string[];
  image?: string;
}

export interface ServicesContent {
  services: ServiceItem[];
}

export interface ClientItem {
  id: string;
  name: string;
  logoUrl?: string;
  category?: string;
}

export interface ClientsContent {
  clients: ClientItem[];
}

export interface BoardMemberItem {
  id: string;
  name: string;
  designation: string;
  photoUrl: string;
  bio: string;
}

export interface GoverningBoardContent {
  boardMembers: BoardMemberItem[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  year: string;
  status: string;
  location?: string;
}

export interface ProjectsContent {
  projects: ProjectItem[];
}

export interface ContactContent {
  phonePrimary: string;
  phoneSecondary: string;
  emailPrimary: string;
  emailSecondary: string;
  addressVillupuram: string;
  addressChennai: string;
  workingHours: string;
  whatsappNumber: string;
}

export interface FooterContent {
  description: string;
  copyright: string;
  instagramUrl: string;
  brochureUrl: string;
}

export interface EquipmentCategoryItem {
  id: string;
  name: string;
  description: string;
  count: number;
  imageUrl: string;
  specs: string[];
}

export interface EquipmentContent {
  fleetIntro: string;
  categories: EquipmentCategoryItem[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface CapabilityStatementContent {
  headline: string;
  summary: string;
  certifications: CertificationItem[];
  downloadUrl: string;
}

export interface HydraulicBroomerSpec {
  label: string;
  value: string;
}

export interface HydraulicBroomerContent {
  title: string;
  description: string;
  specs: HydraulicBroomerSpec[];
  imageUrl: string;
  videoUrl?: string;
}

export interface WeatherAlertBannerContent {
  enabled: boolean;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  dismissible: boolean;
}

export interface ChatbotContent {
  greetingMessage: string;
  systemPromptOverride: string;
  enabled: boolean;
  avatarUrl: string;
}

export interface MenuItem {
  id: string;
  labelEn: string;
  labelTa: string;
  path: string;
  order: number;
}

export interface NavigationContent {
  logoUrl: string;
  menuItems: MenuItem[];
}

export interface FullSiteContent {
  hero: HeroContent;
  about: AboutContent;
  stats: StatsContent;
  services: ServicesContent;
  clients: ClientsContent;
  governingBoard: GoverningBoardContent;
  projects: ProjectsContent;
  contact: ContactContent;
  footer: FooterContent;
  translations: Record<string, any>;
  equipment: EquipmentContent;
  capabilityStatement: CapabilityStatementContent;
  hydraulicBroomer: HydraulicBroomerContent;
  weatherAlertBanner: WeatherAlertBannerContent;
  chatbot: ChatbotContent;
  navigation: NavigationContent;
  constructionExperience: ConstructionExperienceContent;
}

// Default Fallbacks from data.ts
export const DEFAULT_SITE_CONTENT: FullSiteContent = {
  hero: {
    title: 'Precision Civil Engineering & Heavy Dewatering Solutions',
    subtitle: 'Government Accredited Class-I Contractor',
    tagline: 'Delivering reliable dewatering, flood control, excavation drainage, lake desilting, and emergency pumping solutions for construction and CMRL projects, with expertise in dewatering for metro construction works, including column pit excavations.',
    badge: 'State PWD & WRD Empaneled',
  },
  about: {
    companyDescription: COMPANY_DETAILS.incorporationHistory,
    yearEstablished: COMPANY_DETAILS.yearEstablished,
    founderName: COMPANY_DETAILS.leadership.governingPartner.name,
    civilContractorText: 'Class I Registered Government Civil Contractor',
    missionText: 'Deliver resilient public infrastructure, emergency flood relief, and robust civil works across Tamil Nadu with uncompromised engineering precision.',
    visionText: 'To be South India’s most dependable infrastructure partner for municipal disaster management, rapid dewatering, and state public works.',
  },
  stats: {
    yearsExperience: 20,
    projectsCompleted: 150,
    clientsServed: 25,
    teamSize: 45,
    dewateringFleet: 400,
  },
  services: {
    services: SERVICE_CATEGORIES.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.fullDescription,
      badge: 'Certified Capability',
      highlights: s.highlights,
      image: s.image,
    })),
  },
  clients: {
    clients: [
      { id: 'gcc', name: 'Greater Chennai Corporation (GCC)', category: 'Municipal Government' },
      { id: 'cmrl', name: 'Chennai Metro Rail Limited (CMRL)', category: 'Metropolitan Rail Transit' },
      { id: 'pwd', name: 'Public Works Department (PWD)', category: 'State Infrastructure' },
      { id: 'wrd', name: 'Water Resources Department (WRD)', category: 'Irrigation & Water Networks' },
      { id: 'rvnl', name: 'Rail Vikas Nigam Limited (RVNL)', category: 'Railway Infrastructure' },
    ],
  },
  governingBoard: {
    boardMembers: [
      {
        id: 'selva_kumar',
        name: 'Mr. G. Selva Kumar',
        designation: 'Founder',
        photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtJTJScjD1s9E1gXlzJfWddGbDvVSX1Eh7cDvjCoMr81sYw4pZArZnM0ZZ5oUtaoYur4V-yYXukv1kqHT3iECpg-9uMT3_3nK--tX8irTP9bA1AqCrBte1YO4Y6B6N4nWLywI4REBwFYf3jWP06osetab2iwqHgbxlAtMw28gMhwsSOAPOYu6PUop4hoFmfDsOOKpzbR2ap4Vddzy_0StLNZTEukavQNu0eoyvd2lzSCIIPGj-1VOMPHDnK5ZNDb3ZvNYdJARXSVjN',
        bio: 'Directs strategic multi-district rescue logistics and civil contracts in Tamil Nadu.',
      },
      {
        id: 'vetrivel_s',
        name: 'Mr. S. Vetrivel',
        designation: 'Managing Director',
        photoUrl: '',
        bio: 'Oversees active fleet engineering, team mobilizations, and regional yards management.',
      },
      {
        id: 'dhinakaravel',
        name: 'Mr. S. Dhinakaravel',
        designation: 'Financial Consultant',
        photoUrl: new URL('../assets/images/regenerated_image_1784682133184.png', import.meta.url).href,
        bio: 'Manages regulatory financial audits, GST submissions compliance, and budget planning.',
      },
      {
        id: 'jerin_anand',
        name: 'Mr. Jerin Anand',
        designation: 'Admin & Developer',
        photoUrl: new URL('../assets/images/regenerated_image_1784683266108.jpg', import.meta.url).href,
        bio: 'Maintains enterprise tech portals, secure digital records, and digital identity.',
      },
    ],
  },
  projects: {
    projects: [
      {
        id: 'proj_1',
        title: 'Cyclone Fengal Subway Dewatering Operations',
        description: 'Deployed high-head diesel pumps and continuous shift emergency crews across Chennai subways during historic rainfall.',
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&q=80',
        year: '2024',
        status: 'Completed',
        location: 'Chennai Suburbs',
      },
      {
        id: 'proj_2',
        title: 'WRD Canal Bank Stone Pitching & Drainage Corridor',
        description: 'Constructed reinforced concrete spillways and stone-pitched retaining barriers along agricultural canal distribution routes.',
        imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
        year: '2023',
        status: 'Completed',
        location: 'Villupuram Region',
      },
      {
        id: 'proj_3',
        title: 'CMRL Metro Excavation Pit Dewatering',
        description: 'Provided specialized high-volume deep foundation dewatering and wellpoint systems for underground subway stations.',
        imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',
        year: '2025',
        status: 'In Progress',
        location: 'Chennai Metro Phase II',
      },
    ],
  },
  contact: {
    phonePrimary: COMPANY_DETAILS.phones[0],
    phoneSecondary: COMPANY_DETAILS.phones[1],
    emailPrimary: COMPANY_DETAILS.emails[0],
    emailSecondary: COMPANY_DETAILS.emails[1],
    addressVillupuram: OFFICES[0].addressLines.join(' '),
    addressChennai: OFFICES[1].addressLines.join(' '),
    workingHours: '24/7 Emergency Dispatch Center',
    whatsappNumber: '+91 98942 18243',
  },
  footer: {
    description: 'Empaneled Class I Civil Contracting Enterprise delivering state public works, heavy dewatering systems, and disaster relief solutions across South India.',
    copyright: `© ${new Date().getFullYear()} ${COMPANY_DETAILS.name}. All Rights Reserved.`,
    instagramUrl: COMPANY_DETAILS.instagramUrl,
    brochureUrl: COMPANY_DETAILS.brochureLink,
  },
  translations: DEFAULT_TRANSLATIONS,
  equipment: {
    fleetIntro: 'Heavy-duty dewatering pumps, earthmoving machinery, tractor-mounted broomers, and emergency flood mitigation assets ready for rapid deployment across South India.',
    categories: [
      {
        id: 'eq_pumps',
        name: 'High-Head Diesel Dewatering Pumps',
        description: 'Heavy duty 4" & 6" diesel engine pumps with vacuum priming systems designed for continuous 24/7 subway and pit dewatering.',
        count: 400,
        imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',
        specs: ['Head: up to 45m', 'Discharge: 2500-5000 LPM', 'Engine: Kirloskar Diesel'],
      },
      {
        id: 'eq_broomers',
        name: 'Tractor-Mounted Hydraulic Broomers',
        description: 'MoRTH compliant highway sweeping broomer attachments featuring dual nylon/steel bristles and 180 Bar hydraulic drive.',
        count: 25,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeQt_VRg-Pnvzi83b3kFBXkzvQwauzvPl3BR7b4V5oqXN65xsotHAR8F_J1Cr-ngjTmrsoOZwh5FdVT3Zl2TQdue2Wcd1_ulcn_09y7urzhBo0D1KmgZRjeebjb1XoS7MLrQY1rDu7vusZvj8gxX6MmMm7Y6ahsbChKhEPeKaWr--5Di4PTSUyriXPWgmsdZ1M_J-R4e7yADQG8TSSdoNbot-7Z_BtQhC13Rvz2AqlQI9L_fKhXuf8kddWYkMMsA3Gl_2Q358cGg',
        specs: ['Sweeping Width: 2.2m', 'Pressure: 180 Bar', 'Tractor Compat: 35-75 HP'],
      },
      {
        id: 'eq_earthmovers',
        name: 'Excavators & Hydraulic Earthmovers',
        description: 'Tracked excavators and backhoe loaders equipped for channel desilting, emergency canal breach bunding, and site clearing.',
        count: 18,
        imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80',
        specs: ['Bucket: 0.9 - 1.2 cu.m', 'Brands: JCB, CAT, Hyundai'],
      },
    ],
  },
  capabilityStatement: {
    headline: 'Sri Velan & Co - Corporate Capability Statement',
    summary: 'Class I Registered Government Civil Contractor & Dewatering Enterprise specializing in municipal flood rescue, metro deep pit dewatering, canal stone pitching, and public infrastructure construction.',
    certifications: [
      { id: 'cert_1', name: 'Class I Civil Contractor Registration', issuer: 'State PWD & WRD', year: '2006' },
      { id: 'cert_2', name: 'Greater Chennai Corporation Empaneled Partner', issuer: 'GCC Disaster Cell', year: '2020' },
      { id: 'cert_3', name: 'CMRL Approved Underground Dewatering Vendor', issuer: 'Chennai Metro Rail Ltd', year: '2022' },
    ],
    downloadUrl: '',
  },
  hydraulicBroomer: {
    title: 'Tractor-Mounted Hydraulic Highway Sweeper Broomer',
    description: 'Engineered for heavy-duty highway sweeping, asphalt dust clearing, and municipal road maintenance with universal 3-point tractor linkage.',
    specs: [
      { label: 'Sweeping Width', value: '1.8m to 2.2m Adjustable' },
      { label: 'Compatible Tractor HP', value: '35 HP to 75 HP' },
      { label: 'Bristle Composition', value: 'High-Density Polypropylene & Steel Wire' },
      { label: 'Hydraulic Operating Pressure', value: '160 to 180 Bar' },
      { label: 'Clearing Speed Capacity', value: 'Up to 10,000 sq.m / hr' },
    ],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeQt_VRg-Pnvzi83b3kFBXkzvQwauzvPl3BR7b4V5oqXN65xsotHAR8F_J1Cr-ngjTmrsoOZwh5FdVT3Zl2TQdue2Wcd1_ulcn_09y7urzhBo0D1KmgZRjeebjb1XoS7MLrQY1rDu7vusZvj8gxX6MmMm7Y6ahsbChKhEPeKaWr--5Di4PTSUyriXPWgmsdZ1M_J-R4e7yADQG8TSSdoNbot-7Z_BtQhC13Rvz2AqlQI9L_fKhXuf8kddWYkMMsA3Gl_2Q358cGg',
    videoUrl: '',
  },
  weatherAlertBanner: {
    enabled: true,
    message: 'Monsoon Dewatering Fleet Active: 24/7 Emergency Mobilization Units On Standby Across Chennai, Villupuram & Cuddalore Districts.',
    severity: 'warning',
    dismissible: true,
  },
  chatbot: {
    greetingMessage: 'Welcome to Sri Velan & Co! I am VELAN AI, your 24/7 assistant for dewatering fleet dispatch, broomer quotes, and civil contract queries.',
    systemPromptOverride: '',
    enabled: true,
    avatarUrl: '',
  },
  navigation: {
    logoUrl: '',
    menuItems: [
      { id: 'home', labelEn: 'Home', labelTa: 'முகப்பு', path: '/', order: 1 },
      { id: 'about', labelEn: 'About Us', labelTa: 'எங்களைப் பற்றி', path: '/about', order: 2 },
      { id: 'chennai', labelEn: 'Chennai', labelTa: 'சென்னை', path: '/chennai', order: 3 },
      { id: 'equipments', labelEn: 'Equipment Fleet', labelTa: 'இயந்திரங்கள்', path: '/equipments', order: 4 },
      { id: 'projects', labelEn: 'Projects', labelTa: 'திட்டங்கள்', path: '/projects', order: 5 },
      { id: 'hydraulic-broomer', labelEn: 'Hydraulic Broomer', labelTa: 'ஹைட்ராலிக் தூரிகை', path: '/hydraulic-broomer', order: 6 },
      { id: 'contact', labelEn: 'Contact Us', labelTa: 'தொடர்பு கொள்ள', path: '/contact', order: 7 },
    ],
  },
  constructionExperience: {
    categories: INITIAL_CONSTRUCTION_EXPERIENCE,
  },
};

export interface HistoryEntry {
  id: string;
  timestamp: string;
  action: string;
  sectionKey?: string;
  userEmail?: string;
  snapshot: FullSiteContent;
}

interface SiteContentContextType {
  siteContent: FullSiteContent;
  loading: boolean;
  historyEntries: HistoryEntry[];
  historyLoading: boolean;
  updateSection: <K extends keyof FullSiteContent>(sectionKey: K, data: FullSiteContent[K]) => Promise<void>;
  seedInitialData: () => Promise<void>;
  restoreToDefault: () => Promise<void>;
  backupContent: () => Promise<FullSiteContent>;
  restoreFromSnapshot: (snapshot: FullSiteContent, actionLabel?: string) => Promise<void>;
  addHistoryRecord: (action: string, snapshot: FullSiteContent, sectionKey?: string) => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteContent, setSiteContent] = useState<FullSiteContent>(DEFAULT_SITE_CONTENT);
  const [loading, setLoading] = useState<boolean>(true);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(true);

  // Set up Firestore real-time snapshot listeners for all sections
  useEffect(() => {
    const sectionKeys: (keyof FullSiteContent)[] = [
      'hero',
      'about',
      'stats',
      'services',
      'clients',
      'governingBoard',
      'projects',
      'contact',
      'footer',
      'translations',
      'equipment',
      'capabilityStatement',
      'hydraulicBroomer',
      'weatherAlertBanner',
      'chatbot',
      'navigation',
      'constructionExperience',
    ];

    const loadedKeys = new Set<string>();

    const unsubscribes = sectionKeys.map((sectionKey) => {
      const docRef = doc(db, 'siteContent', sectionKey);
      return onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            setSiteContent((prev) => ({
              ...prev,
              [sectionKey]: {
                ...DEFAULT_SITE_CONTENT[sectionKey],
                ...data,
              },
            }));
          }
          loadedKeys.add(sectionKey);
          if (loadedKeys.size >= sectionKeys.length) {
            setLoading(false);
          }
        },
        (error) => {
          console.warn(`Firestore read warning for siteContent/${sectionKey}:`, error);
          loadedKeys.add(sectionKey);
          if (loadedKeys.size >= sectionKeys.length) {
            setLoading(false);
          }
        }
      );
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, []);

  // Listen to siteContentHistory in real-time via onSnapshot
  useEffect(() => {
    try {
      const historyCol = collection(db, 'siteContentHistory');
      const q = query(historyCol, orderBy('timestamp', 'desc'), limit(50));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items: HistoryEntry[] = [];
          snapshot.forEach((docSnap) => {
            items.push({
              id: docSnap.id,
              ...docSnap.data(),
            } as HistoryEntry);
          });
          setHistoryEntries(items);
          setHistoryLoading(false);
        },
        (err) => {
          console.warn('Firestore siteContentHistory onSnapshot warning:', err);
          // LocalStorage fallback
          try {
            const local = JSON.parse(localStorage.getItem('siteContentHistory') || '[]');
            setHistoryEntries(local);
          } catch (e) {
            console.warn('LocalStorage fallback parse error:', e);
          }
          setHistoryLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn('Error attaching history listener:', e);
      setHistoryLoading(false);
    }
  }, []);

  // Helper to record history log entries
  const addHistoryRecord = async (action: string, snapshot: FullSiteContent, sectionKey?: string) => {
    const entryData = {
      timestamp: new Date().toISOString(),
      action,
      sectionKey: sectionKey || 'all',
      userEmail: auth.currentUser?.email || 'admin@srivelan.com',
      snapshot,
    };

    try {
      const historyCol = collection(db, 'siteContentHistory');
      await addDoc(historyCol, entryData);
    } catch (err) {
      console.warn('Could not write history to Firestore, using LocalStorage fallback:', err);
    }

    try {
      const existing = JSON.parse(localStorage.getItem('siteContentHistory') || '[]');
      const localEntry = { id: `local_${Date.now()}`, ...entryData };
      const updated = [localEntry, ...existing].slice(0, 50);
      localStorage.setItem('siteContentHistory', JSON.stringify(updated));
      setHistoryEntries(updated);
    } catch (e) {
      console.warn('LocalStorage write failed:', e);
    }
  };

  // Helper to fetch the entire current state of 'siteContent' collection using an onSnapshot listener
  const fetchFullCollectionViaOnSnapshot = (): Promise<FullSiteContent> => {
    return new Promise((resolve, reject) => {
      const colRef = collection(db, 'siteContent');
      const unsubscribe = onSnapshot(
        colRef,
        (querySnapshot) => {
          const fullContent: Partial<FullSiteContent> = {};
          querySnapshot.forEach((docSnap) => {
            const key = docSnap.id as keyof FullSiteContent;
            fullContent[key] = docSnap.data() as any;
          });
          const merged: FullSiteContent = {
            ...DEFAULT_SITE_CONTENT,
            ...fullContent,
          };
          unsubscribe(); // Clean up onSnapshot listener after resolving
          resolve(merged);
        },
        (error) => {
          unsubscribe();
          reject(error);
        }
      );
    });
  };

  // Backup Content: Uses an onSnapshot listener to fetch full state and triggers a downloadable JSON file
  const backupContent = async (): Promise<FullSiteContent> => {
    const fullSnapshot = await fetchFullCollectionViaOnSnapshot();

    const backupPayload = {
      app: 'Sri Velan & Co Infrastructure Portal',
      collection: 'siteContent',
      backupDate: new Date().toISOString(),
      timestamp: Date.now(),
      author: auth.currentUser?.email || 'admin@srivelan.com',
      data: fullSnapshot,
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(backupPayload, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `srivelan_siteContent_backup_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    await addHistoryRecord('Offline Backup Downloaded', fullSnapshot);
    return fullSnapshot;
  };

  // Restore to Default: Restores all documents in 'siteContent' to default values
  const restoreToDefault = async () => {
    // Save current state as safety backup first
    await addHistoryRecord('Pre-Restore State Backup', siteContent);

    const keys = Object.keys(DEFAULT_SITE_CONTENT) as (keyof FullSiteContent)[];
    for (const key of keys) {
      const docRef = doc(db, 'siteContent', key);
      await setDoc(docRef, DEFAULT_SITE_CONTENT[key], { merge: false });
    }

    await addHistoryRecord('Restored to Default Settings', DEFAULT_SITE_CONTENT);
  };

  // Restore from a historical snapshot
  const restoreFromSnapshot = async (snapshot: FullSiteContent, actionLabel?: string) => {
    await addHistoryRecord('Pre-Rollback State Backup', siteContent);

    const keys = Object.keys(snapshot) as (keyof FullSiteContent)[];
    for (const key of keys) {
      if (snapshot[key]) {
        const docRef = doc(db, 'siteContent', key);
        await setDoc(docRef, snapshot[key], { merge: false });
      }
    }

    await addHistoryRecord(actionLabel || 'Restored From Historical Snapshot', snapshot);
  };

  // Update a single section in Firestore
  const updateSection = async <K extends keyof FullSiteContent>(sectionKey: K, data: FullSiteContent[K]) => {
    try {
      const docRef = doc(db, 'siteContent', sectionKey);
      await setDoc(docRef, data, { merge: true });

      const updated = {
        ...siteContent,
        [sectionKey]: data,
      };
      await addHistoryRecord(`Updated ${String(sectionKey).toUpperCase()} section`, updated, String(sectionKey));
    } catch (error) {
      console.error(`Error saving siteContent/${sectionKey} to Firestore:`, error);
      throw error;
    }
  };

  // Populate Firestore with default values if empty
  const seedInitialData = async () => {
    const keys = Object.keys(DEFAULT_SITE_CONTENT) as (keyof FullSiteContent)[];
    for (const key of keys) {
      const docRef = doc(db, 'siteContent', key);
      await setDoc(docRef, DEFAULT_SITE_CONTENT[key], { merge: true });
    }
    await addHistoryRecord('Seeded Default Data to Firestore', DEFAULT_SITE_CONTENT);
  };

  return (
    <SiteContentContext.Provider
      value={{
        siteContent,
        loading,
        historyEntries,
        historyLoading,
        updateSection,
        seedInitialData,
        restoreToDefault,
        backupContent,
        restoreFromSnapshot,
        addHistoryRecord,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};
