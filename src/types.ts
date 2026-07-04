/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActiveView = 
  | 'home' 
  | 'about' 
  | 'services' 
  | 'equipments' 
  | 'projects' 
  | 'hydraulic-broomer' 
  | 'contact';

export interface ProjectItem {
  id: string;
  title: string;
  category: 'government' | 'water-resource' | 'infrastructure' | 'emergency-relief';
  description: string;
  image: string;
  details: string[];
  fallbackImage?: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: 'tractor-mounted' | 'earth-moving';
  iconName: string;
  description: string;
  specs: { [key: string]: string };
}

export interface ReliefEvent {
  year: string;
  title: string;
  description: string;
  stats: string;
  statLabel: string;
  quote: string;
}

export interface OfficeLocation {
  name: string;
  addressLines: string[];
  mapsUrl: string;
  mapImage: string;
  type: 'Head Office' | 'Chennai Office';
}
