/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SERVICE_CATEGORIES, PROJECTS, EQUIPMENTS, CYCLONE_RELIEF_TIMELINE, COMPANY_DETAILS } from '../data';
import { INITIAL_CONSTRUCTION_EXPERIENCE } from '../data/constructionExperience';

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  title?: string;
  description?: string;
  images?: { loc: string; title?: string; caption?: string }[];
}

/**
 * Escapes XML special characters safely for sitemap inclusion
 */
export function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Returns the formatted current or specified ISO date string (YYYY-MM-DD)
 */
export function getFormattedDate(d: Date = new Date()): string {
  return d.toISOString().split('T')[0];
}

/**
 * Generates the complete list of sitemap entries based on Sri Velan & Co's
 * site architecture, municipal & industrial service offerings, equipment fleet, and project case studies.
 */
export function getSitemapEntries(baseUrl: string = 'https://srivelan.co', customContent?: any): SitemapEntry[] {
  const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
  const today = getFormattedDate();

  // 1. Core Primary View Architecture
  const primaryPages: SitemapEntry[] = [
    {
      loc: `${cleanBaseUrl}/`,
      lastmod: today,
      changefreq: 'daily',
      priority: 1.0,
      title: `${COMPANY_DETAILS.name} - Government Engineering Contractors`,
      description: 'Certified PWD Class 1 civil contracting, water resource networks, municipal infrastructure, and disaster emergency dewatering services across Tamil Nadu.',
      images: [
        {
          loc: `${cleanBaseUrl}/assets/images/sri-velan-logo.png`,
          title: 'Sri Velan & Co Corporate Seal',
          caption: 'Government Engineering Contractors Logo'
        }
      ]
    },
    {
      loc: `${cleanBaseUrl}/about`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8,
      title: `About ${COMPANY_DETAILS.name} - Leadership & Accreditation History`,
      description: 'Founded in 2006, Sri Velan & Co leads Tamil Nadu in Class 1 PWD/WRD civil works under Founder G. Selva Kumar & MD S. Vetrivel.'
    },
    {
      loc: `${cleanBaseUrl}/chennai`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.9,
      title: 'Chennai Greater Corporation (GCC) Zones & Monsoon Telemetry',
      description: 'Real-time 15 municipal zone tracking, IMD precipitation alerts, and active flood dewatering fleet deployments across Greater Chennai.'
    },
    {
      loc: `${cleanBaseUrl}/equipments`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.9,
      title: 'Heavy Machinery & Dewatering Fleet Catalog - Sri Velan & Co',
      description: 'Air-assisted diesel vacuum pumps (4", 6", 10"), 100 HP submersible units, earth movers, and tractor-mounted hydraulic broomers.'
    },
    {
      loc: `${cleanBaseUrl}/projects`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.9,
      title: 'Contract Projects Portfolio & Relief Case Studies',
      description: 'HR&CE heritage temple restoration, PWD administrative complexes, WRD river revetments, and Cyclone Fengal dewatering.'
    },
    {
      loc: `${cleanBaseUrl}/hydraulic-broomer`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.9,
      title: 'Tractor-Mounted Hydraulic Broomer Specs & Highway Cleansing',
      description: 'Proprietary tractor-attached road sweeper attachment engineered for high-tensile dust clearance on highways and construction sites.'
    },
    {
      loc: `${cleanBaseUrl}/contact`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.7,
      title: 'Contact Engineering Estimators - Villupuram & Chennai Offices',
      description: 'Get in touch with Sri Velan & Co project estimators for PWD tenders, municipal dewatering, or equipment hire.'
    },
    {
      loc: `${cleanBaseUrl}/capability-statement`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.8,
      title: 'Corporate Procurement Capability Statement - Sri Velan & Co',
      description: 'Official capability statement detailing MSME, GSTIN, PWD Class 1 registration, equipment list, and financial execution history.'
    }
  ];

  // 2. Municipal & Industrial Service Verticals
  const serviceCategories = customContent?.services?.services || SERVICE_CATEGORIES;
  const serviceEntries: SitemapEntry[] = serviceCategories.map((svc: any) => ({
    loc: `${cleanBaseUrl}/services/${svc.id}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: 0.85,
    title: `${svc.title} - Sri Velan & Co`,
    description: svc.shortDescription || svc.fullDescription || svc.description,
    images: svc.image || svc.imageUrl ? [{
      loc: svc.image || svc.imageUrl,
      title: svc.title,
      caption: svc.shortDescription || svc.title
    }] : []
  }));

  // 3. Heavy Machinery & Dewatering Fleet Specifications
  const equipmentEntries: SitemapEntry[] = EQUIPMENTS.map((eq) => ({
    loc: `${cleanBaseUrl}/equipments/${eq.id}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: 0.85,
    title: `${eq.name} Specifications & Hire`,
    description: eq.description,
    images: []
  }));

  // 4. Case Studies & Major Project Contracts
  const projectEntries: SitemapEntry[] = PROJECTS.map((proj) => ({
    loc: `${cleanBaseUrl}/projects/${proj.id}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: 0.85,
    title: `${proj.title} - Case Study`,
    description: proj.description,
    images: proj.image || proj.imageUrl ? [{
      loc: proj.image || proj.imageUrl,
      title: proj.title,
      caption: proj.description
    }] : []
  }));

  // 5. Company Brochure Construction Experience Categories
  const constructionCategories = customContent?.constructionExperience?.categories || INITIAL_CONSTRUCTION_EXPERIENCE;
  const constructionEntries: SitemapEntry[] = constructionCategories.map((cat: any) => ({
    loc: `${cleanBaseUrl}/construction-experience/${cat.id}`,
    lastmod: today,
    changefreq: 'monthly',
    priority: 0.8,
    title: `${cat.title?.en || cat.title || cat.id} - Sri Velan & Co Brochure Record`,
    description: `Official executed construction archive for ${cat.title?.en || cat.title || cat.id}.`,
    images: cat.image ? [{
      loc: cat.image,
      title: cat.title?.en || cat.title || cat.id
    }] : []
  }));

  // 6. Disaster Relief Timeline Milestones
  const timelineEntries: SitemapEntry[] = CYCLONE_RELIEF_TIMELINE.map((evt) => ({
    loc: `${cleanBaseUrl}/relief-operations/${evt.year}`,
    lastmod: today,
    changefreq: 'monthly',
    priority: 0.8,
    title: `${evt.title} (${evt.year}) - Disaster Relief Record`,
    description: `${evt.description} Total Discharged Fluid: ${evt.stats}.`
  }));

  return [
    ...primaryPages,
    ...serviceEntries,
    ...equipmentEntries,
    ...projectEntries,
    ...constructionEntries,
    ...timelineEntries
  ];
}

/**
 * Converts a list of sitemap entries into valid, compliant XML text.
 */
export function generateSitemapXml(baseUrl: string = 'https://srivelan.co', customContent?: any): string {
  const entries = getSitemapEntries(baseUrl, customContent);

  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">`;

  const xmlUrls = entries.map((entry) => {
    let urlBlock = `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>\n`;
    
    if (entry.lastmod) {
      urlBlock += `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>\n`;
    }
    if (entry.changefreq) {
      urlBlock += `    <changefreq>${escapeXml(entry.changefreq)}</changefreq>\n`;
    }
    if (typeof entry.priority === 'number') {
      urlBlock += `    <priority>${entry.priority.toFixed(2)}</priority>\n`;
    }

    if (entry.images && entry.images.length > 0) {
      entry.images.forEach((img) => {
        urlBlock += `    <image:image>\n`;
        urlBlock += `      <image:loc>${escapeXml(img.loc)}</image:loc>\n`;
        if (img.title) {
          urlBlock += `      <image:title>${escapeXml(img.title)}</image:title>\n`;
        }
        if (img.caption) {
          urlBlock += `      <image:caption>${escapeXml(img.caption)}</image:caption>\n`;
        }
        urlBlock += `    </image:image>\n`;
      });
    }

    urlBlock += `  </url>`;
    return urlBlock;
  }).join('\n');

  const xmlFooter = `\n</urlset>`;

  return `${xmlHeader}\n${xmlUrls}${xmlFooter}`;
}
