import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COMPANY_DETAILS, OFFICES, SERVICE_CATEGORIES } from '../data';

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
    dewateringFleet: 35,
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
        name: COMPANY_DETAILS.leadership.governingPartner.name,
        designation: COMPANY_DETAILS.leadership.governingPartner.role,
        photoUrl: COMPANY_DETAILS.leadership.governingPartner.image,
        bio: COMPANY_DETAILS.leadership.governingPartner.bio,
      },
      {
        id: 'vetrivel_s',
        name: COMPANY_DETAILS.leadership.managingDirector.name,
        designation: COMPANY_DETAILS.leadership.managingDirector.role,
        photoUrl: COMPANY_DETAILS.leadership.managingDirector.image,
        bio: COMPANY_DETAILS.leadership.managingDirector.bio,
      },
      {
        id: 'dhinakaravel',
        name: 'Mr. Dhinakaravel',
        designation: 'Financial Consultant',
        photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
        bio: 'Oversees financial auditing, tender compliance, budget allocations, and state contract invoicing.',
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
};

interface SiteContentContextType {
  siteContent: FullSiteContent;
  loading: boolean;
  updateSection: <K extends keyof FullSiteContent>(sectionKey: K, data: FullSiteContent[K]) => Promise<void>;
  seedInitialData: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteContent, setSiteContent] = useState<FullSiteContent>(DEFAULT_SITE_CONTENT);
  const [loading, setLoading] = useState<boolean>(true);

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
    ];

    let pendingReads = sectionKeys.length;

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
          pendingReads--;
          if (pendingReads <= 0) {
            setLoading(false);
          }
        },
        (error) => {
          console.warn(`Firestore read warning for siteContent/${sectionKey}:`, error);
          pendingReads--;
          if (pendingReads <= 0) {
            setLoading(false);
          }
        }
      );
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, []);

  // Update a single section in Firestore
  const updateSection = async <K extends keyof FullSiteContent>(sectionKey: K, data: FullSiteContent[K]) => {
    try {
      const docRef = doc(db, 'siteContent', sectionKey);
      await setDoc(docRef, data, { merge: true });
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
  };

  return (
    <SiteContentContext.Provider value={{ siteContent, loading, updateSection, seedInitialData }}>
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
