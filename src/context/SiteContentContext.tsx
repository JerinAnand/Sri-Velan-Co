import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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
  imageUrl?: string;
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
  category?: 'government' | 'water-resource' | 'infrastructure' | 'emergency-relief';
  description: string;
  imageUrl: string;
  image?: string;
  year: string;
  status: string;
  location?: string;
  details?: string[];
  fallbackImage?: string;
}

export interface ProjectsContent {
  projects: ProjectItem[];
}

export interface ChennaiContent {
  bannerTagEn: string;
  bannerTagTa: string;
  bannerTitleEn: string;
  bannerTitleTa: string;
  bannerSubtitleEn: string;
  bannerSubtitleTa: string;
  bannerImageUrl: string;
  gccCardTitleEn: string;
  gccCardTitleTa: string;
  gccCardDescriptionEn: string;
  gccCardDescriptionTa: string;
  gccPortalUrl: string;
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
  chennai: ChennaiContent;
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

import { DEFAULT_SITE_CONTENT } from '../data/defaultContent';
export { DEFAULT_SITE_CONTENT };

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
      'chennai',
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
  const addHistoryRecord = useCallback(async (action: string, snapshot: FullSiteContent, sectionKey?: string) => {
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
  }, []);

  // Helper to fetch the entire current state of 'siteContent' collection using an onSnapshot listener
  const fetchFullCollectionViaOnSnapshot = useCallback((): Promise<FullSiteContent> => {
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
  }, []);

  // Backup Content: Uses an onSnapshot listener to fetch full state and triggers a downloadable JSON file
  const backupContent = useCallback(async (): Promise<FullSiteContent> => {
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
  }, [fetchFullCollectionViaOnSnapshot, addHistoryRecord]);

  // Restore to Default: Restores all documents in 'siteContent' to default values
  const restoreToDefault = useCallback(async () => {
    // Save current state as safety backup first
    await addHistoryRecord('Pre-Restore State Backup', siteContent);

    const keys = Object.keys(DEFAULT_SITE_CONTENT) as (keyof FullSiteContent)[];
    for (const key of keys) {
      const docRef = doc(db, 'siteContent', key);
      await setDoc(docRef, DEFAULT_SITE_CONTENT[key], { merge: false });
    }

    await addHistoryRecord('Restored to Default Settings', DEFAULT_SITE_CONTENT);
  }, [addHistoryRecord, siteContent]);

  // Restore from a historical snapshot
  const restoreFromSnapshot = useCallback(async (snapshot: FullSiteContent, actionLabel?: string) => {
    await addHistoryRecord('Pre-Rollback State Backup', siteContent);

    const keys = Object.keys(snapshot) as (keyof FullSiteContent)[];
    for (const key of keys) {
      if (snapshot[key]) {
        const docRef = doc(db, 'siteContent', key);
        await setDoc(docRef, snapshot[key], { merge: false });
      }
    }

    await addHistoryRecord(actionLabel || 'Restored From Historical Snapshot', snapshot);
  }, [addHistoryRecord, siteContent]);

  // Update a single section in Firestore
  const updateSection = useCallback(async <K extends keyof FullSiteContent>(sectionKey: K, data: FullSiteContent[K]) => {
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
  }, [addHistoryRecord, siteContent]);

  // Populate Firestore with default values if empty
  const seedInitialData = useCallback(async () => {
    const keys = Object.keys(DEFAULT_SITE_CONTENT) as (keyof FullSiteContent)[];
    for (const key of keys) {
      const docRef = doc(db, 'siteContent', key);
      await setDoc(docRef, DEFAULT_SITE_CONTENT[key], { merge: true });
    }
    await addHistoryRecord('Seeded Default Data to Firestore', DEFAULT_SITE_CONTENT);
  }, [addHistoryRecord]);

  const contextValue = useMemo(
    () => ({
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
    }),
    [
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
    ]
  );

  return (
    <SiteContentContext.Provider value={contextValue}>
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
