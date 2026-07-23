/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, MapPin, CheckCircle, Info, Activity, Navigation, Maximize2 } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface DistrictData {
  id: string;
  name: string;
  isActive: boolean;
  status: 'active-hq' | 'active-node' | 'standby' | 'none';
  pumpsDeployed: number;
  activeStaff: number;
  floodsManaged: number;
  description: string;
  facilities: string[];
  coordinateLabel: { x: number; y: number };
  totalPumps?: number;
  wardRange?: string;
  areas?: string;
}

const DISTRICT_RECORDS: Record<string, DistrictData> = {
  zone1: {
    id: 'zone1',
    name: 'Zone I: Thiruvottiyur',
    isActive: true,
    status: 'active-node',
    pumpsDeployed: 18,
    activeStaff: 42,
    floodsManaged: 9,
    description: 'Northern coastal industrial and residential corridor. Key focus is on Buckingham Canal drainage blocks, beach-front storm outlets, and low-lying residential clusters adjacent to Ennore Expressway.',
    facilities: ['Thiruvottiyur High-HP Pumping Station', 'Coastal Suction Fleet B', 'Ennore Storm Gate Monitor'],
    coordinateLabel: { x: 285, y: 55 }
  },
  zone2: {
    id: 'zone2',
    name: 'Zone II: Manali',
    isActive: true,
    status: 'active-node',
    pumpsDeployed: 24,
    activeStaff: 38,
    floodsManaged: 11,
    description: 'Petrochemical industrial complex zone. Specializes in managing refinery surface runoff and deploying heavy-duty chemical-resistant bypass pumping rigs for rapid stormwater transfer.',
    facilities: ['Manali Industrial Bypass Yard', 'High-Inflow Submersibles Unit', 'Heavy De-clogging Fleet C'],
    coordinateLabel: { x: 175, y: 52 }
  },
  zone3: {
    id: 'zone3',
    name: 'Zone III: Madhavaram',
    isActive: true,
    status: 'active-node',
    pumpsDeployed: 15,
    activeStaff: 30,
    floodsManaged: 6,
    description: 'Semi-residential catchment region containing multiple large holding ponds. Actively monitors Retteri lake outflow channels and assists in residential basement extractions.',
    facilities: ['Retteri Outlet Liaison Post', 'Madhavaram Mobile Suction Depot'],
    coordinateLabel: { x: 175, y: 107 }
  },
  zone4: {
    id: 'zone4',
    name: 'Zone IV: Tondiarpet',
    isActive: true,
    status: 'active-node',
    pumpsDeployed: 20,
    activeStaff: 40,
    floodsManaged: 13,
    description: 'Densely populated historic North Chennai area. Characterized by narrow alleys and complex drainage lines; heavily relies on high-capacity truck-mounted vacuum pumps and manual desilt actions.',
    facilities: ['Tondiarpet Vacuum Pump Station', 'North Chennai Response Base'],
    coordinateLabel: { x: 300, y: 135 }
  },
  zone5: {
    id: 'zone5',
    name: 'Zone V: Royapuram',
    isActive: true,
    status: 'active-hq',
    pumpsDeployed: 35,
    activeStaff: 45,
    floodsManaged: 22,
    description: 'Command center for North-Eastern Chennai. Direct liaison for harbor operations, Central railway station underpasses, and major subway dewatering tasks during high storm-surge scenarios.',
    facilities: ['Royapuram Deep-Well Command Base', 'Central Underpass Pump Array', 'Expressway Response Unit'],
    coordinateLabel: { x: 305, y: 212 }
  },
  zone6: {
    id: 'zone6',
    name: 'Zone VI: Thiru-Vi-Ka-Nagar',
    isActive: true,
    status: 'active-node',
    pumpsDeployed: 22,
    activeStaff: 42,
    floodsManaged: 15,
    description: 'Vulnerable basin containing the Otteri Nullah canal feed. Demands continuous suction coverage to prevent storm overflow into nearby low-elevation housing colonies.',
    facilities: ['Otteri Nullah Channel Pumping Station', 'Standby Diesel Pump Fleet F'],
    coordinateLabel: { x: 172, y: 172 }
  },
  zone7: {
    id: 'zone7',
    name: 'Zone VII: Ambattur',
    isActive: true,
    status: 'active-node',
    pumpsDeployed: 26,
    activeStaff: 43,
    floodsManaged: 12,
    description: 'Industrial estate zone with large lake inflows. Partners with state PWD to run high-capacity tractor-driven pumps to relieve water accumulation on major industrial roadways and subways.',
    facilities: ['Ambattur Industrial Pump Reserve', 'Lake Outflow Control Hub'],
    coordinateLabel: { x: 75, y: 155 }
  },
  zone8: {
    id: 'zone8',
    name: 'Zone VIII: Anna Nagar',
    isActive: true,
    status: 'active-node',
    pumpsDeployed: 19,
    activeStaff: 45,
    floodsManaged: 10,
    description: 'Centrally located high-density area bounded by the Cooum River. Closely monitors river bund stability and deploys high-volume trailer pumps to clear local water logging.',
    facilities: ['Cooum Bund Emergency Base', 'Anna Nagar Rapid Relief Fleet'],
    coordinateLabel: { x: 137, y: 265 }
  },
  zone9: {
    id: 'zone9',
    name: 'Zone IX: Teynampet',
    isActive: true,
    status: 'active-hq',
    pumpsDeployed: 40,
    activeStaff: 45,
    floodsManaged: 26,
    description: 'Corporate headquarters and central command yard for Chennai dewatering division. Operates 24/7 GCC liaison desks, supervising primary subway suction pumps and emergency power generators.',
    facilities: ['Central Teynampet HQ Base', 'VVIP Underpasses Suction Fleet', '24/7 GCC Emergency Liaison Desk', 'Standby Trailer Pump Hub A'],
    coordinateLabel: { x: 295, y: 265 }
  },
  zone10: {
    id: 'zone10',
    name: 'Zone X: Kodambakkam',
    isActive: true,
    status: 'active-node',
    pumpsDeployed: 25,
    activeStaff: 44,
    floodsManaged: 18,
    description: 'Legacy inundation zone carrying the crucial Mambalam Canal. Focused on maintaining smooth channel flow and preventing waterlogging in low-elevation central hubs.',
    facilities: ['Mambalam Canal Pumping Array', 'Subway Emergency Suction Team'],
    coordinateLabel: { x: 195, y: 345 }
  },
  zone11: {
    id: 'zone11',
    name: 'Zone XI: Valasaravakkam',
    isActive: true,
    status: 'active-node',
    pumpsDeployed: 14,
    activeStaff: 32,
    floodsManaged: 7,
    description: 'Primarily residential sector in Western Chennai. Actively manages local stormwater canal runoffs and delivers quick-response pumping support for street-level water collection.',
    facilities: ['Valasaravakkam Residential Suction Depot', 'Canal Gate Support Unit'],
    coordinateLabel: { x: 92, y: 310 }
  },
  zone12: {
    id: 'zone12',
    name: 'Zone XII: Alandur',
    isActive: true,
    status: 'active-node',
    pumpsDeployed: 16,
    activeStaff: 36,
    floodsManaged: 9,
    description: 'Key transit and airport corridor. Monitors active Adyar River floodplains, securing subways and highway underpasses to ensure uninterrupted transport flows.',
    facilities: ['Airport Perimeter Suction Base', 'Adyar River Liaison Station'],
    coordinateLabel: { x: 95, y: 400 }
  },
  zone13: {
    id: 'zone13',
    name: 'Zone XIII: Adyar',
    isActive: true,
    status: 'active-hq',
    pumpsDeployed: 30,
    activeStaff: 45,
    floodsManaged: 17,
    description: 'Command center for South Chennai. Safeguards the Adyar estuary, Buckingham Canal confluence, and high-density residential developments through automated high-volume marine-grade pumps.',
    facilities: ['Adyar Estuary High-Flow Station', 'South Chennai Response Hub', 'Buckingham Canal Suction Division'],
    coordinateLabel: { x: 275, y: 370 }
  },
  zone14: {
    id: 'zone14',
    name: 'Zone XIV: Perungudi',
    isActive: true,
    status: 'active-node',
    pumpsDeployed: 12,
    activeStaff: 28,
    floodsManaged: 4,
    description: 'IT Corridor and marshland border zone. Active division protecting critical IT parks and managing sensitive marsh runoff drainage limits.',
    facilities: ['Perungudi Active Depot', 'IT Expressway Suction Team'],
    coordinateLabel: { x: 225, y: 470 }
  },
  zone15: {
    id: 'zone15',
    name: 'Zone XV: Sholinganallur',
    isActive: true,
    status: 'active-node',
    pumpsDeployed: 15,
    activeStaff: 35,
    floodsManaged: 5,
    description: 'Deep southern coastal IT sector. Low-lying catchment area with multiple lake margins. Deploys high-capacity bypass rigs to handle massive seasonal monsoon water log risks.',
    facilities: ['Sholinganallur Emergency Response Base', 'Monsoon Bypass Pump Station'],
    coordinateLabel: { x: 225, y: 550 }
  }
};

const ZONE_METRIC_DEFAULTS: Record<string, { totalPumps: number; wardRange: string }> = {
  zone1: { totalPumps: 25, wardRange: '1–14' },
  zone2: { totalPumps: 30, wardRange: '15–21' },
  zone3: { totalPumps: 20, wardRange: '22–33' },
  zone4: { totalPumps: 28, wardRange: '34–48' },
  zone5: { totalPumps: 45, wardRange: '49–63' },
  zone6: { totalPumps: 30, wardRange: '64–78' },
  zone7: { totalPumps: 35, wardRange: '79–93' },
  zone8: { totalPumps: 25, wardRange: '94–108' },
  zone9: { totalPumps: 50, wardRange: '109–126' },
  zone10: { totalPumps: 35, wardRange: '127–142' },
  zone11: { totalPumps: 20, wardRange: '143–155' },
  zone12: { totalPumps: 22, wardRange: '156–167' },
  zone13: { totalPumps: 40, wardRange: '168–180' },
  zone14: { totalPumps: 18, wardRange: '181–191' },
  zone15: { totalPumps: 22, wardRange: '192–200' }
};

const ROMAN_MAP: Record<string, number> = {
  'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5,
  'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10,
  'XI': 11, 'XII': 12, 'XIII': 13, 'XIV': 14, 'XV': 15
};

function getZoneKeyFromGeoJSON(zoneNoStr: string): string {
  if (!zoneNoStr) return 'zone1';
  const clean = String(zoneNoStr).trim().toUpperCase();
  const num = ROMAN_MAP[clean] || parseInt(clean, 10);
  return num ? `zone${num}` : 'zone1';
}

const ZONE_PALETTE: Record<string, { fill: string; stroke: string; label: string }> = {
  zone1:  { fill: '#0ea5e9', stroke: '#0284c7', label: 'Sky Blue' },
  zone2:  { fill: '#3b82f6', stroke: '#1d4ed8', label: 'Royal Blue' },
  zone3:  { fill: '#14b8a6', stroke: '#0f766e', label: 'Teal' },
  zone4:  { fill: '#06b6d4', stroke: '#0891b2', label: 'Cyan' },
  zone5:  { fill: '#2563eb', stroke: '#1e3a8a', label: 'Cobalt' },
  zone6:  { fill: '#0d9488', stroke: '#115e59', label: 'Emerald' },
  zone7:  { fill: '#6366f1', stroke: '#4338ca', label: 'Indigo' },
  zone8:  { fill: '#f59e0b', stroke: '#b45309', label: 'Amber' },
  zone9:  { fill: '#4f46e5', stroke: '#312e81', label: 'Deep Indigo' },
  zone10: { fill: '#8b5cf6', stroke: '#5b21b6', label: 'Purple' },
  zone11: { fill: '#ec4899', stroke: '#9d174d', label: 'Pink' },
  zone12: { fill: '#f43f5e', stroke: '#9f1239', label: 'Rose' },
  zone13: { fill: '#10b981', stroke: '#047857', label: 'Mint' },
  zone14: { fill: '#64748b', stroke: '#334155', label: 'Slate' },
  zone15: { fill: '#84cc16', stroke: '#3f6212', label: 'Lime' },
};

function renderTelemetryTooltipHTML(record: DistrictData, zoneNo: string, zoneName: string): string {
  const activePumps = record?.pumpsDeployed ?? 0;
  const totalPumps = record?.totalPumps || 25;
  const pumpRatio = Math.round((activePumps / Math.max(totalPumps, 1)) * 100);
  const staff = record?.activeStaff ?? 0;
  const wardRange = record?.wardRange || '';
  const areaName = record?.areas || (record?.name ? record.name.split(': ')[1] : zoneName);
  const isHq = record?.status === 'active-hq';

  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; padding: 4px; min-width: 200px; color: #0f172a;">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
        <div>
          <span style="font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">GCC ZONE ${zoneNo}</span>
          <div style="font-size: 13px; font-weight: 800; color: #0f172a; line-height: 1.2;">${areaName}</div>
        </div>
        <span style="background: ${isHq ? '#0e2954' : '#0284c7'}; color: #ffffff; font-size: 8px; font-weight: 800; padding: 2px 5px; border-radius: 4px; text-transform: uppercase;">
          ${isHq ? 'Command HQ' : 'Active'}
        </span>
      </div>

      ${wardRange ? `<div style="font-size: 10px; color: #475569; margin-bottom: 6px;">Ward Scope: <strong style="color: #0f172a;">${wardRange}</strong></div>` : ''}

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px; margin-bottom: 6px;">
        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
          <span style="color: #64748b; font-weight: 500;">Active Pumps:</span>
          <strong style="color: #0284c7; font-family: monospace;">${activePumps} / ${totalPumps} (${pumpRatio}%)</strong>
        </div>
        <div style="width: 100%; background: #e2e8f0; height: 5px; border-radius: 3px; overflow: hidden; margin-bottom: 4px;">
          <div style="width: ${Math.min(pumpRatio, 100)}%; background: ${pumpRatio > 70 ? '#0284c7' : '#0d9488'}; height: 100%;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px;">
          <span style="color: #64748b; font-weight: 500;">On-Field Crew:</span>
          <strong style="color: ${staff > 45 ? '#dc2626' : '#0f172a'}; font-family: monospace;">${staff} Staff ${staff > 45 ? '⚠️' : ''}</strong>
        </div>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 9px; color: #059669; font-weight: 700; padding-top: 2px;">
        <span style="display: inline-flex; align-items: center; gap: 4px;">
          <span style="width: 6px; height: 6px; background: #10b981; border-radius: 50%; display: inline-block;"></span>
          Live Telemetry
        </span>
        <span style="color: #64748b; font-weight: 500;">Click to select</span>
      </div>
    </div>
  `;
}

function renderTelemetryPopupHTML(record: DistrictData, zoneNo: string, zoneName: string): string {
  const activePumps = record?.pumpsDeployed ?? 0;
  const totalPumps = record?.totalPumps || 25;
  const pumpRatio = Math.round((activePumps / Math.max(totalPumps, 1)) * 100);
  const staff = record?.activeStaff ?? 0;
  const wardRange = record?.wardRange || '';
  const areaName = record?.areas || (record?.name ? record.name.split(': ')[1] : zoneName);
  const isHq = record?.status === 'active-hq';

  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; padding: 6px; min-width: 220px; color: #0f172a;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 6px;">
        <div>
          <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #0284c7; letter-spacing: 0.5px;">GCC Zone ${zoneNo}</div>
          <div style="font-size: 15px; font-weight: 900; color: #0f172a; margin-top: 1px;">${areaName}</div>
        </div>
        <span style="background: ${isHq ? '#0e2954' : '#0284c7'}; color: #ffffff; font-size: 9px; font-weight: 800; padding: 2.5px 6px; border-radius: 4px; text-transform: uppercase;">
          ${isHq ? 'Command HQ' : 'Active Sector'}
        </span>
      </div>

      ${wardRange ? `<div style="font-size: 11px; color: #334155; margin-bottom: 8px; background: #f1f5f9; padding: 4px 8px; border-radius: 6px; display: inline-block; font-weight: 600;">Ward Scope: <strong style="color: #0f172a;">${wardRange}</strong></div>` : ''}

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px; margin-bottom: 8px;">
        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
          <span style="color: #64748b; font-weight: 600;">Pumps Deployed:</span>
          <strong style="color: #0284c7; font-family: monospace;">${activePumps} / ${totalPumps} (${pumpRatio}%)</strong>
        </div>
        <div style="width: 100%; background: #e2e8f0; height: 6px; border-radius: 3px; overflow: hidden; margin-bottom: 6px;">
          <div style="width: ${Math.min(pumpRatio, 100)}%; background: ${pumpRatio > 70 ? '#0284c7' : '#0d9488'}; height: 100%;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px;">
          <span style="color: #64748b; font-weight: 600;">On-Field Staff:</span>
          <strong style="color: ${staff > 45 ? '#dc2626' : '#0f172a'}; font-family: monospace;">${staff} Staff</strong>
        </div>
      </div>

      ${staff > 45 ? `
        <div style="background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; font-size: 10px; padding: 6px; border-radius: 6px; margin-bottom: 8px; font-weight: 500;">
          ⚠️ <strong>Staff Safety Threshold Exceeded:</strong> Current staff (${staff}) exceeds maximum 45 capacity.
        </div>
      ` : ''}

      <div style="font-size: 10px; color: #059669; font-weight: 700; display: flex; align-items: center; gap: 4px; border-top: 1px solid #f1f5f9; padding-top: 4px;">
        <span style="width: 6px; height: 6px; background: #10b981; border-radius: 50%; display: inline-block;"></span>
        Synchronized with Service Area Telemetry Dashboard
      </div>
    </div>
  `;
}

export const ServiceAreaMap: React.FC = () => {
  const { language } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const layersByZoneRef = useRef<Record<string, L.Layer>>({});

  const [selectedDistrict, setSelectedDistrict] = useState<string>('zone9');
  const selectedDistrictRef = useRef<string>('zone9');
  selectedDistrictRef.current = selectedDistrict;

  const [zonalRecords, setZonalRecords] = useState<Record<string, DistrictData>>(() => {
    const records = JSON.parse(JSON.stringify(DISTRICT_RECORDS));
    try {
      Object.keys(records).forEach(zoneId => {
        const defaults = ZONE_METRIC_DEFAULTS[zoneId] || { totalPumps: 25, wardRange: '' };
        records[zoneId].totalPumps = defaults.totalPumps;
        records[zoneId].wardRange = defaults.wardRange;
        records[zoneId].areas = records[zoneId].name.split(': ')[1] || '';
      });

      const stored = localStorage.getItem('editable_data');
      if (stored) {
        const data = JSON.parse(stored);
        Object.keys(records).forEach(zoneId => {
          if (data[`zone_pumpsDeployed_${zoneId}`] !== undefined) {
            records[zoneId].pumpsDeployed = Number(data[`zone_pumpsDeployed_${zoneId}`]);
          }
          if (data[`zone_activeStaff_${zoneId}`] !== undefined) {
            records[zoneId].activeStaff = Number(data[`zone_activeStaff_${zoneId}`]);
          }
          if (data[`zone_floodsManaged_${zoneId}`] !== undefined) {
            records[zoneId].floodsManaged = Number(data[`zone_floodsManaged_${zoneId}`]);
          }
        });
      }
    } catch (e) {
      // Safe fallback
    }
    return records;
  });

  const zonalRecordsRef = useRef(zonalRecords);
  zonalRecordsRef.current = zonalRecords;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Chennai
    const map = L.map(mapContainerRef.current, {
      center: [13.0827, 80.2707],
      zoom: 11,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Fetch GeoJSON boundary data
    fetch('/chennai_gcc_zones.json')
      .then((res) => res.json())
      .then((geoJsonData) => {
        if (!mapInstanceRef.current) return;

        const layersMap: Record<string, L.Layer> = {};

        const geoJsonLayer = L.geoJSON(geoJsonData, {
          style: (feature) => {
            if (!feature) return {};
            const zoneKey = getZoneKeyFromGeoJSON(feature.properties.zone_no);
            const palette = ZONE_PALETTE[zoneKey] || { fill: '#3b82f6', stroke: '#1d4ed8' };
            const isSelected = selectedDistrictRef.current === zoneKey;

            return {
              fillColor: palette.fill,
              fillOpacity: isSelected ? 0.8 : 0.45,
              color: isSelected ? '#ffffff' : palette.stroke,
              weight: isSelected ? 3.5 : 1.5,
              dashArray: isSelected ? '' : '2',
            };
          },
          onEachFeature: (feature, layer) => {
            const zoneNo = feature.properties.zone_no;
            const zoneName = feature.properties.zone_name;
            const zoneKey = getZoneKeyFromGeoJSON(zoneNo);

            layersMap[zoneKey] = layer;

            const record = zonalRecordsRef.current[zoneKey];
            const tooltipHTML = renderTelemetryTooltipHTML(record || DISTRICT_RECORDS[zoneKey], zoneNo, zoneName);
            const popupHTML = renderTelemetryPopupHTML(record || DISTRICT_RECORDS[zoneKey], zoneNo, zoneName);

            layer.bindTooltip(tooltipHTML, {
              sticky: true,
              direction: 'auto',
              opacity: 0.98
            });

            layer.bindPopup(popupHTML);

            layer.on({
              click: () => {
                setSelectedDistrict(zoneKey);
              },
              mouseover: (e) => {
                const l = e.target;
                if (selectedDistrictRef.current !== zoneKey) {
                  l.setStyle({
                    fillOpacity: 0.75,
                    weight: 2.5
                  });
                }
              },
              mouseout: (e) => {
                const l = e.target;
                if (selectedDistrictRef.current !== zoneKey) {
                  const palette = ZONE_PALETTE[zoneKey] || { fill: '#3b82f6', stroke: '#1d4ed8' };
                  l.setStyle({
                    fillColor: palette.fill,
                    fillOpacity: 0.45,
                    color: palette.stroke,
                    weight: 1.5,
                    dashArray: '2'
                  });
                }
              }
            });

            // Add centroid marker
            if ('getBounds' in layer && typeof (layer as any).getBounds === 'function') {
              const bounds = (layer as any).getBounds();
              const center = bounds.getCenter();
              const isHq = record?.status === 'active-hq';

              const marker = L.circleMarker(center, {
                radius: isHq ? 7 : 5,
                fillColor: isHq ? '#0e2954' : '#eab308',
                color: '#ffffff',
                weight: 2,
                fillOpacity: 0.95
              });

              marker.bindTooltip(tooltipHTML, {
                direction: 'top',
                offset: [0, -6],
                opacity: 0.98
              });

              marker.bindPopup(popupHTML);

              marker.on('click', () => {
                setSelectedDistrict(zoneKey);
              });

              markersGroup.addLayer(marker);
            }
          }
        }).addTo(map);

        geoJsonLayerRef.current = geoJsonLayer;
        layersByZoneRef.current = layersMap;

        // Auto-fit bounds of all zones
        const bounds = geoJsonLayer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [20, 20] });
        }
      })
      .catch((err) => {
        console.warn('Failed to load chennai_gcc_zones.json:', err);
      });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      geoJsonLayerRef.current = null;
      markersGroupRef.current = null;
    };
  }, []);

  // Sync layer tooltips and popups with live zonal telemetry data
  useEffect(() => {
    if (!geoJsonLayerRef.current) return;

    geoJsonLayerRef.current.eachLayer((layer: any) => {
      if (!layer.feature) return;
      const zoneNo = layer.feature.properties.zone_no;
      const zoneName = layer.feature.properties.zone_name;
      const zoneKey = getZoneKeyFromGeoJSON(zoneNo);
      const record = zonalRecords[zoneKey];

      if (record) {
        const tooltipHTML = renderTelemetryTooltipHTML(record, zoneNo, zoneName);
        const popupHTML = renderTelemetryPopupHTML(record, zoneNo, zoneName);

        if (typeof layer.setTooltipContent === 'function' && layer.getTooltip()) {
          layer.setTooltipContent(tooltipHTML);
        }
        if (typeof layer.setPopupContent === 'function' && layer.getPopup()) {
          layer.setPopupContent(popupHTML);
        }
      }
    });
  }, [zonalRecords]);

  // Sync highlighting when selectedDistrict changes
  useEffect(() => {
    selectedDistrictRef.current = selectedDistrict;

    if (!geoJsonLayerRef.current) return;

    geoJsonLayerRef.current.eachLayer((layer: any) => {
      if (!layer.feature) return;
      const zoneKey = getZoneKeyFromGeoJSON(layer.feature.properties.zone_no);
      const palette = ZONE_PALETTE[zoneKey] || { fill: '#3b82f6', stroke: '#1d4ed8' };
      const isSelected = zoneKey === selectedDistrict;

      layer.setStyle({
        fillColor: palette.fill,
        fillOpacity: isSelected ? 0.8 : 0.45,
        color: isSelected ? '#ffffff' : palette.stroke,
        weight: isSelected ? 3.5 : 1.5,
        dashArray: isSelected ? '' : '2'
      });

      if (isSelected && typeof layer.bringToFront === 'function') {
        layer.bringToFront();
      }
    });
  }, [selectedDistrict]);

  // Fetch real-time telemetry on mount
  useEffect(() => {
    const fetchLiveTelemetry = async () => {
      try {
        const res = await fetch('https://opensheet.elk.sh/1sieBEWWOANHTRj23dRI6Fd_bCLgAoP0XeCPB7dc0Txw/1');
        if (!res.ok) return;
        const telemetry = await res.json();
        if (telemetry && Array.isArray(telemetry)) {
          setZonalRecords(prev => {
            const next = { ...prev };
            telemetry.forEach((item: any) => {
              const zoneNumStr = item.zone?.match(/\d+/)?.[0];
              if (zoneNumStr) {
                const zoneKey = `zone${zoneNumStr}`;
                if (next[zoneKey]) {
                  const activeVal = item.ActivePumps !== undefined ? item.ActivePumps : item.activePumps;
                  const staffVal = item.StaffCount !== undefined ? item.StaffCount : item.staffCount;
                  const totalVal = item.TotalPumps !== undefined ? item.TotalPumps : item.totalPumps;
                  const wardVal = item.WardRange !== undefined ? item.WardRange : item.wardRange;
                  const areasVal = item.Areas !== undefined ? item.Areas : item.areas;

                  const activePumps = activeVal !== undefined ? Number(activeVal) : next[zoneKey].pumpsDeployed;
                  const rawStaff = staffVal !== undefined ? Number(staffVal) : next[zoneKey].activeStaff;
                  const staffCount = rawStaff > 0 ? rawStaff : (activePumps * 2 + 8);
                  const totalPumps = totalVal !== undefined ? Number(totalVal) : (ZONE_METRIC_DEFAULTS[zoneKey]?.totalPumps || 25);
                  const wardRange = wardVal !== undefined ? String(wardVal).trim() : (ZONE_METRIC_DEFAULTS[zoneKey]?.wardRange || '');
                  const areas = areasVal !== undefined ? String(areasVal).trim() : (next[zoneKey].name.split(': ')[1] || '');

                  next[zoneKey] = {
                    ...next[zoneKey],
                    pumpsDeployed: activePumps,
                    activeStaff: staffCount,
                    totalPumps,
                    wardRange,
                    areas
                  };
                }
              }
            });
            return next;
          });
        }
      } catch (err) {
        console.warn('Live map telemetry sync failed:', err);
      }
    };

    fetchLiveTelemetry();
    const interval = setInterval(fetchLiveTelemetry, 30000);
    return () => clearInterval(interval);
  }, []);

  const currentRecord = zonalRecords[selectedDistrict] || DISTRICT_RECORDS['zone9'];

  const resetMapView = () => {
    if (mapInstanceRef.current && geoJsonLayerRef.current) {
      const bounds = geoJsonLayerRef.current.getBounds();
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  };

  return (
    <div className="bg-neutral-50 rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-10 text-left space-y-8" id="disaster-relief-service-map">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-200 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 text-[10px] font-mono font-bold uppercase py-1 px-2.5 rounded-full">
            <ShieldAlert className="w-3.5 h-3.5 animate-pulse text-red-600" />
            <span>{language === 'ta' ? 'அவசரக்கால செயல்பாட்டு வரைபடம்' : 'Emergency Operations Map'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-brand-blue-900 tracking-tight font-display">
            {language === 'ta' ? 'சென்னை மண்டல பாதுகாப்பு வரைபடம்' : 'Chennai Zonal Coverage Map'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-xl">
            {language === 'ta'
              ? 'பெருநகர சென்னை மாநகராட்சி (GCC) மண்டலங்களின் ஊடாடும் GIS வரைபடம். கள உந்தி திறன்கள் மற்றும் அதிகாரப் பிரிவுகளை ஆராய மண்டல எல்லைகளில் கிளிக் செய்யவும்.'
              : 'Interactive GIS view of Greater Chennai Corporation (GCC) administrative zones. Click on any zone boundary to inspect on-field pump capacities, response hubs, and emergency staff metrics.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetMapView}
            id="reset-map-view-btn"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 hover:border-neutral-300 rounded-xl text-xs font-mono font-semibold text-neutral-700 shadow-xs hover:bg-neutral-50 transition-all cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5 text-neutral-500" />
            <span>{language === 'ta' ? 'வரைபடத்தை மீட்டமைக்க' : 'Fit Whole Map'}</span>
          </button>
          
          <div className="hidden sm:flex items-center gap-4 bg-white px-3.5 py-1.5 border border-neutral-200 rounded-xl shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-neutral-600">
              <span className="w-2.5 h-2.5 bg-brand-blue-700 rounded-full inline-block animate-ping mr-0.5" />
              <span>{language === 'ta' ? 'செயலில் உள்ள பிரிவு' : 'Active Sector'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
        {/* Left Column: Leaflet GIS Interactive Map Container (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="relative w-full rounded-2xl overflow-hidden border border-neutral-300 bg-white shadow-xs">
            {/* Leaflet Map Div */}
            <div 
              ref={mapContainerRef} 
              id="leaflet-gcc-map"
              className="w-full h-[420px] sm:h-[480px] z-0"
            />

            {/* Overlaid Zone Indicator Badge */}
            <div className="absolute top-3 left-3 z-[1000] pointer-events-none bg-neutral-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-neutral-700/80 shadow-md flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5 text-brand-gold-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-brand-gold-400">
                {zonalRecords[selectedDistrict]?.name || 'GCC Chennai'}
              </span>
            </div>
          </div>

          {/* Map Attribution & Reference Note */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-neutral-600 bg-neutral-100/90 p-3 rounded-xl border border-neutral-200/80 gap-2 font-sans">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              <span>
                {language === 'ta' ? 'மண்டல எல்லைகள்:' : 'Zone boundaries:'} <strong>DataMeet India community</strong> (CC BY 4.0)
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 italic leading-snug">
              {language === 'ta'
                ? '*குறிப்பு: பொதுவான பார்வைக்காக. எல்லைகள் GCC 15-மண்டல அமைப்பை சித்தரிக்கின்றன.'
                : '*Note: For general reference. Boundaries depict GCC 15-zone system and may not reflect recent 20-zone expansion.'}
            </p>
          </div>
        </div>

        {/* Right Column: Fleet Index & Selected Zone Details Panel (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          {/* Quick zone selector buttons */}
          <div className="space-y-2">
            <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest pl-1">
              {language === 'ta' ? 'மண்டல பட்டியல்' : 'GCC Zone Command Fleet Index'}
            </p>
            <div className="flex gap-1.5 flex-wrap max-h-48 overflow-y-auto p-1 bg-white border border-neutral-200/80 rounded-xl">
              {(Object.values(zonalRecords) as DistrictData[]).map((dist) => {
                const isSelected = selectedDistrict === dist.id;
                const isOverLimit = dist.activeStaff > 45 && dist.isActive;
                const zoneNoLabel = dist.name.split(':')[0] || dist.id;
                const areaName = dist.name.split(': ')[1] || dist.name;
                
                return (
                  <button
                    key={dist.id}
                    onClick={() => setSelectedDistrict(dist.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-display font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected 
                        ? isOverLimit
                          ? 'bg-red-600 text-white border-red-700 shadow-sm ring-2 ring-red-500/40'
                          : 'bg-brand-blue-900 text-white border-brand-blue-950 shadow-sm' 
                        : dist.isActive 
                          ? 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-100' 
                          : 'bg-neutral-100 text-neutral-400 border-neutral-200/50 opacity-60'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isOverLimit
                        ? 'bg-red-600 animate-ping'
                        : dist.status === 'active-hq' 
                          ? 'bg-brand-gold-500' 
                          : 'bg-brand-blue-500'
                    }`} />
                    <span>{zoneNoLabel}: {areaName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Zone Detail Display Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDistrict}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-neutral-200/80 rounded-2xl p-6 flex-1 flex flex-col justify-between space-y-6 shadow-xs relative"
            >
              {currentRecord.status === 'active-hq' && (
                <div className="absolute top-4 right-4 bg-yellow-50 text-yellow-800 border border-yellow-250 text-[9px] font-mono font-black tracking-widest uppercase px-2 py-0.5 rounded">
                  ★ CHENNAI ZONE COMMAND HQ
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    currentRecord.status === 'active-hq' 
                      ? 'bg-brand-gold-500/10 text-brand-gold-600' 
                      : 'bg-brand-blue-50 text-brand-blue-700'
                  }`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-xl text-brand-blue-950">
                      {currentRecord.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Coverage Class:</span>
                      <span className={`text-[10px] font-mono font-bold uppercase rounded px-1.5 ${
                        currentRecord.status === 'active-hq' 
                          ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/25' 
                          : 'bg-brand-blue-600/10 text-brand-blue-600'
                      }`}>
                        {currentRecord.status === 'active-hq' ? 'Primary Yard Command' : 'Active Support Sector'}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans font-light">
                  {currentRecord.description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  <div className="bg-neutral-50 border border-neutral-200/80 p-3 rounded-xl space-y-0.5">
                    <p className="text-[10px] font-mono text-neutral-400 uppercase">Active Pumps</p>
                    <p className="text-base sm:text-lg font-bold font-display text-brand-blue-950">
                      {currentRecord.pumpsDeployed} <span className="text-xs text-neutral-400 font-normal">/ {currentRecord.totalPumps || 25}</span>
                    </p>
                    <p className="text-[10px] text-brand-blue-600 font-mono font-semibold">
                      {Math.round((currentRecord.pumpsDeployed / (currentRecord.totalPumps || 25)) * 100)}% Deployed
                    </p>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200/80 p-3 rounded-xl space-y-0.5">
                    <p className="text-[10px] font-mono text-neutral-400 uppercase">Field Crew</p>
                    <p className="text-base sm:text-lg font-bold font-display text-brand-blue-950">
                      {currentRecord.activeStaff} <span className="text-xs text-neutral-400 font-normal">Staff</span>
                    </p>
                    <p className={`text-[10px] font-mono font-semibold ${currentRecord.activeStaff > 45 ? 'text-red-600 font-bold' : 'text-emerald-600'}`}>
                      {currentRecord.activeStaff > 45 ? '⚠️ High Load' : 'Optimal'}
                    </p>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200/80 p-3 rounded-xl space-y-0.5">
                    <p className="text-[10px] font-mono text-neutral-400 uppercase">Ward Scope</p>
                    <p className="text-base sm:text-lg font-bold font-display text-brand-blue-950">
                      {currentRecord.wardRange || '1–14'}
                    </p>
                    <p className="text-[10px] text-neutral-500 font-mono">GCC Wards</p>
                  </div>
                </div>

                {/* Quantitative statistics strip */}
                <div className="space-y-4">
                  {currentRecord.activeStaff > 45 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-800 text-xs flex items-start gap-2.5 animate-pulse">
                      <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Staff Capacity Safety Ceiling Exceeded</p>
                        <p className="text-[11px] text-red-700 font-light mt-0.5 leading-relaxed">
                          Operational protocols strictly limit on-field dewatering staff to a maximum of 45 per zone to ensure field safety.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="bg-brand-blue-50/50 border border-brand-blue-100 rounded-xl p-3.5 text-brand-blue-800 text-xs flex items-start gap-2.5">
                    <Activity className="w-4 h-4 text-brand-blue-600 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <p className="font-bold">Real-time Telemetry Active</p>
                      <p className="text-[11px] text-brand-blue-700/95 font-medium mt-0.5 leading-relaxed">
                        Telemetry synchronized with Emergency Operations Feed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stationed assets checklist */}
              {currentRecord.facilities.length > 0 && (
                <div className="border-t border-neutral-150/80 pt-4 space-y-2">
                  <h4 className="text-[10px] font-mono tracking-widest text-neutral-450 uppercase font-bold">
                    Stationed Response Assets & Facilities
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentRecord.facilities.map((fac, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-neutral-700">
                        <CheckCircle className="w-3.5 h-3.5 text-brand-gold-500 shrink-0" />
                        <span className="font-medium font-display leading-none">{fac}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Map Legend & Color Palette Key */}
      <div className="w-full bg-white p-4 border border-neutral-200/90 rounded-2xl space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-neutral-150 pb-2.5">
          <span className="text-[11px] font-mono font-bold text-neutral-500 uppercase tracking-wider">
            {language === 'ta' ? 'வரைபட குறியீடு & மண்டல வண்ண விவரிப்பு' : 'GCC Map Legend & Zonal Color Palette'}
          </span>
          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-neutral-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#0e2954] border border-white shadow-xs inline-block" />
              <span>Primary Command HQ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#eab308] border border-white shadow-xs inline-block" />
              <span>Support Node</span>
            </div>
          </div>
        </div>

        {/* Color Palette Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-15 gap-2 pt-1">
          {Object.entries(ZONE_PALETTE).map(([key, val]) => {
            const numStr = key.replace('zone', '');
            const isSelected = selectedDistrict === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedDistrict(key)}
                className={`flex flex-col items-center justify-center p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                  isSelected ? 'ring-2 ring-brand-blue-600 border-white shadow-sm scale-105' : 'border-neutral-200/80 hover:bg-neutral-50'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-black/10 shadow-xs mb-1"
                  style={{ backgroundColor: val.fill }}
                />
                <span className="text-[9px] font-mono font-bold text-neutral-700">Zone {numStr}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
