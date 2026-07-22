import * as common from './common';
import * as navigation from './navigation';
import * as home from './home';
import * as about from './about';
import * as services from './services';
import * as projects from './projects';
import * as equipment from './equipment';
import * as hydraulicBroomer from './hydraulicBroomer';
import * as contact from './contact';
import * as footer from './footer';
import * as ai from './ai';
import * as capability from './capability';

export const translations = {
  en: {
    common: common.en,
    navigation: navigation.en,
    home: home.en,
    about: about.en,
    services: services.en,
    projects: projects.en,
    equipment: equipment.en,
    hydraulicBroomer: hydraulicBroomer.en,
    contact: contact.en,
    footer: footer.en,
    ai: ai.en,
    capability: capability.en
  },
  ta: {
    common: common.ta,
    navigation: navigation.ta,
    home: home.ta,
    about: about.ta,
    services: services.ta,
    projects: projects.ta,
    equipment: equipment.ta,
    hydraulicBroomer: hydraulicBroomer.ta,
    contact: contact.ta,
    footer: footer.ta,
    ai: ai.ta,
    capability: capability.ta
  }
};

export type Language = 'en' | 'ta';

export type TranslationKey = string;

/**
 * Access nested keys safely using dot notation: e.g. getValueByPath(translations.en, "home.hero.title")
 */
export function getValueByPath(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  
  // Check if flat key exists directly on object
  if (typeof obj === 'object' && path in obj && obj[path] !== undefined) {
    return obj[path];
  }

  // Otherwise traverse nested keys
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return current;
}
