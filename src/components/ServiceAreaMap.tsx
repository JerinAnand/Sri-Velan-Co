/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Flame, MapPin, CheckCircle, Droplet, User, Settings, Info, Activity } from 'lucide-react';

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
    name: 'Zone 1: Thiruvottiyur',
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
    name: 'Zone 2: Manali',
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
    name: 'Zone 3: Madhavaram',
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
    name: 'Zone 4: Tondiarpet',
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
    name: 'Zone 5: Royapuram',
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
    name: 'Zone 6: Thiru-Vi-Ka-Nagar',
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
    name: 'Zone 7: Ambattur',
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
    name: 'Zone 8: Anna Nagar',
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
    name: 'Zone 9: Teynampet',
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
    name: 'Zone 10: Kodambakkam',
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
    name: 'Zone 11: Valasaravakkam',
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
    name: 'Zone 12: Alandur',
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
    name: 'Zone 13: Adyar',
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
    name: 'Zone 14: Perungudi',
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
    name: 'Zone 15: Sholinganallur',
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

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04
    }
  }
};

const districtVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    transformOrigin: '50% 50%'
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transformOrigin: '50% 50%',
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 12
    }
  }
};

export const ServiceAreaMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 350, height: 460 });
  const [selectedDistrict, setSelectedDistrict] = useState<string>('zone9');
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });



  const [zonalRecords, setZonalRecords] = useState<Record<string, DistrictData>>(() => {
    const records = JSON.parse(JSON.stringify(DISTRICT_RECORDS)); // Deep copy to avoid mutating source constants
    try {
      // Add defaults
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

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (!entries || !entries[0]) return;
      const { width, height } = entries[0].contentRect;
      const newW = width || 350;
      const newH = height || 460;
      setDimensions((prev) => {
        if (prev.width === newW && prev.height === newH) return prev;
        return { width: newW, height: newH };
      });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Fetch real-time telemetry on mount and keep map metrics synchronized
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

  const activeRegions = (Object.values(zonalRecords) as DistrictData[]).filter(d => d.isActive);
  const currentRecord = zonalRecords[selectedDistrict];

  // Dynamic data-driven configuration of Chennai Greater Chennai Corporation (GCC) Zonal Geography paths
  const ZONE_CONFIGS = [
    { id: 'zone1', d: 'M 230 10 L 340 10 L 340 100 L 250 120 L 230 70 Z', color: '#0ea5e9', selectedColor: '#0369a1', hoverColor: '#38bdf8', inactiveColor: '#f0f9ff' },
    { id: 'zone2', d: 'M 120 20 L 230 10 L 230 70 L 140 85 Z', color: '#3b82f6', selectedColor: '#1d4ed8', hoverColor: '#60a5fa', inactiveColor: '#eff6ff' },
    { id: 'zone3', d: 'M 120 85 L 230 70 L 210 135 L 125 145 Z', color: '#14b8a6', selectedColor: '#0f766e', hoverColor: '#2dd4bf', inactiveColor: '#ccfbf1' },
    { id: 'zone4', d: 'M 250 120 L 340 100 L 350 170 L 260 175 Z', color: '#06b6d4', selectedColor: '#0e7490', hoverColor: '#22d3ee', inactiveColor: '#ecfeff' },
    { id: 'zone5', d: 'M 260 175 L 350 170 L 360 250 L 255 240 Z', color: '#2563eb', selectedColor: '#1e3a8a', hoverColor: '#3b82f6', inactiveColor: '#f0f4ff' },
    { id: 'zone6', d: 'M 125 145 L 210 135 L 220 200 L 145 210 Z', color: '#0d9488', selectedColor: '#115e59', hoverColor: '#14b8a6', inactiveColor: '#f0fdfa' },
    { id: 'zone7', d: 'M 20 100 L 120 85 L 125 145 L 145 210 L 95 240 L 30 190 Z', color: '#6366f1', selectedColor: '#4338ca', hoverColor: '#818cf8', inactiveColor: '#e0e7ff' },
    { id: 'zone8', d: 'M 95 240 L 180 230 L 170 300 L 80 295 Z', color: '#f59e0b', selectedColor: '#b45309', hoverColor: '#fbbf24', inactiveColor: '#fef3c7' },
    { id: 'zone9', d: 'M 220 200 L 255 240 L 360 250 L 330 330 L 240 320 L 230 260 Z', color: '#4f46e5', selectedColor: '#3730a3', hoverColor: '#6366f1', inactiveColor: '#f5f3ff' },
    { id: 'zone10', d: 'M 170 300 L 240 320 L 230 390 L 150 380 Z', color: '#8b5cf6', selectedColor: '#5b21b6', hoverColor: '#a78bfa', inactiveColor: '#f3e8ff' },
    { id: 'zone11', d: 'M 30 190 L 95 240 L 80 295 L 150 300 L 130 360 L 50 350 Z', color: '#ec4899', selectedColor: '#9d174d', hoverColor: '#f472b6', inactiveColor: '#fce7f3' },
    { id: 'zone12', d: 'M 50 350 L 130 360 L 150 380 L 140 450 L 60 440 Z', color: '#f43f5e', selectedColor: '#9f1239', hoverColor: '#fb7185', inactiveColor: '#ffe4e6' },
    { id: 'zone13', d: 'M 240 320 L 330 330 L 310 440 L 210 420 Z', color: '#10b981', selectedColor: '#047857', hoverColor: '#34d399', inactiveColor: '#d1fae5' },
    { id: 'zone14', d: 'M 140 450 L 210 420 L 310 440 L 280 510 L 170 520 Z', color: '#64748b', selectedColor: '#334155', hoverColor: '#94a3b8', inactiveColor: '#f1f5f9' },
    { id: 'zone15', d: 'M 170 520 L 280 510 L 260 590 L 150 580 Z', color: '#475569', selectedColor: '#1e293b', hoverColor: '#64748b', inactiveColor: '#f8fafc' }
  ];

  return (
    <div className="bg-neutral-50 rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-10 text-left space-y-8" id="disaster-relief-service-map">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-200 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 text-[10px] font-mono font-bold uppercase py-1 px-2.5 rounded-full">
            <ShieldAlert className="w-3.5 h-3.5 animate-pulse text-red-650" />
            <span>Emergency Operations Zone Map</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-brand-blue-900 tracking-tight font-display">
            Disaster Relief Service Areas
          </h2>
          <p className="text-xs sm:text-sm text-neutral-550 max-w-xl">
            Click on active colored sectors or use the sidebar directory to inspect on-field pump capacities, response hubs, and emergency staff metrics.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white px-4 py-2 border border-neutral-200 rounded-xl shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-neutral-600">
            <span className="w-2.5 h-2.5 bg-brand-blue-700 rounded-full inline-block animate-ping mr-0.5" />
            <span>Active Sector</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-neutral-400">
            <span className="w-2.5 h-2.5 bg-neutral-300 rounded-full inline-block mr-0.5" />
            <span>Standby/Reserve</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
        {/* Left Grid: SVG Scaled state map representation (lg:col-span-6) */}
        <div 
          ref={containerRef}
          className="lg:col-span-6 bg-white border border-neutral-200 rounded-2xl p-4 sm:p-6 flex flex-col justify-between items-center relative overflow-visible z-20 min-h-[380px] sm:min-h-[460px] w-full"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setTooltipPos({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top
            });
          }}
        >
          {/* Subtle blueprint coordinate background */}
          <div className="absolute inset-0 grid-overlay opacity-[0.03] pointer-events-none rounded-2xl" />
          
          <div className="w-full text-center py-2 absolute top-4 z-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-450 bg-neutral-100/80 px-2.5 py-1 rounded-md border border-neutral-200/50">
              {hoveredDistrict ? `Hovering: ${DISTRICT_RECORDS[hoveredDistrict]?.name || hoveredDistrict}` : 'Live Geographic Response Grid'}
            </span>
          </div>

          <div className="w-full h-full flex items-center justify-center pt-8 overflow-visible">
            <svg 
              viewBox="0 0 400 600" 
              className="w-full select-none filter drop-shadow-md duration-350 transition-all overflow-visible"
              style={{ 
                maxWidth: '100%',
                aspectRatio: '400/600',
                height: 'auto'
              }}
            >
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComponentTransfer in="blur" result="boost">
                    <feFuncA type="linear" slope="1.5"/>
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode in="boost" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Regional outlines */}
              <motion.g 
                id="state-districts"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
              >
                {ZONE_CONFIGS.map((path) => {
                  const data = zonalRecords[path.id];
                  const hasData = !!data;
                  const isActive = data?.isActive;
                  const isSelected = selectedDistrict === path.id;
                  const isHovered = hoveredDistrict === path.id;

                  // Dynamic color fills based on state from a distinct, cohesive palette
                  let fill = '#f1f5f9';
                  let stroke = isSelected ? '#ffffff' : '#ffffff';
                  let strokeWidth = isSelected ? '2.5' : '1';

                  if (hasData) {
                    if (!isActive) {
                      fill = path.inactiveColor;
                    } else if (isSelected) {
                      fill = path.selectedColor;
                    } else if (isHovered) {
                      fill = path.hoverColor;
                    } else {
                      fill = path.color;
                    }
                  }

                  return (
                    <motion.g 
                      key={path.id}
                      variants={districtVariants}
                      className="cursor-pointer transition-all duration-300"
                      onClick={() => {
                        if (hasData) {
                          setSelectedDistrict(path.id);
                        }
                      }}
                      onMouseEnter={() => setHoveredDistrict(path.id)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                    >
                      <motion.path 
                        d={path.d}
                        animate={{ 
                          fill, 
                          stroke, 
                          strokeWidth: Number(strokeWidth) 
                        }}
                        transition={{ 
                          duration: 0.35,
                          ease: "easeInOut"
                        }}
                        whileHover={{ 
                          scale: 1.018,
                          filter: hasData ? "brightness(1.06) drop-shadow(0px 4px 8px rgba(0,0,0,0.15))" : "brightness(1.02)",
                        }}
                        filter={isSelected ? "url(#glow)" : "none"}
                        style={{ transformOrigin: 'center' }}
                        className="transition-all cursor-pointer"
                      />
                      
                      {/* Active Hub Locator Ring Beacon */}
                      {isActive && data.status === 'active-hq' && (
                        <circle 
                          cx={data.coordinateLabel.x} 
                          cy={data.coordinateLabel.y} 
                          r="4" 
                          fill="#eab308"
                          className="animate-ping"
                          style={{ transformOrigin: `${data.coordinateLabel.x}px ${data.coordinateLabel.y}px` }}
                        />
                      )}
                    </motion.g>
                  );
                })}
              </motion.g>

              {/* Major District Labels & Response Hub Markers */}
              <g id="district-labels" className="pointer-events-none">
                {(Object.values(zonalRecords) as DistrictData[]).map((dist) => {
                  const isSelected = selectedDistrict === dist.id;
                  const isOverLimit = dist.activeStaff > 45 && dist.isActive;
                  
                  return (
                    <g key={dist.id} className="transition-all duration-350">
                      {/* Plotting Small Circles matching the Legend: Navy for Primary, Amber for Secondary */}
                      {dist.isActive && (
                        dist.status === 'active-hq' ? (
                          // Primary response hub (dark navy dot)
                          <circle 
                            cx={dist.coordinateLabel.x} 
                            cy={dist.coordinateLabel.y} 
                            r={isSelected ? '6.5' : '5'} 
                            fill="#0e2954"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                            className="transition-all duration-300 filter drop-shadow-sm"
                          />
                        ) : (
                          // Secondary response hub (amber/yellow dot)
                          <circle 
                            cx={dist.coordinateLabel.x} 
                            cy={dist.coordinateLabel.y} 
                            r={isSelected ? '5.5' : '4.5'} 
                            fill="#eab308"
                            stroke="#ffffff"
                            strokeWidth="1.2"
                            className="transition-all duration-300 filter drop-shadow-sm"
                          />
                        )
                      )}

                      {!dist.isActive && (
                        // Standby/Inactive Zone Muted Small Dot
                        <circle 
                          cx={dist.coordinateLabel.x} 
                          cy={dist.coordinateLabel.y} 
                          r="3" 
                          fill="#94a3b8"
                          stroke="#ffffff"
                          strokeWidth="1"
                          className="transition-all duration-300"
                        />
                      )}

                      {/* Responsive Label Text: hidden on mobile (<640px) to prevent layout clutter, tap-to-reveal tooltips are active */}
                      <text
                        x={dist.coordinateLabel.x}
                        y={dist.coordinateLabel.y + 15}
                        textAnchor="middle"
                        className={`hidden sm:block font-mono text-[8px] font-bold tracking-tight pointer-events-none transition-all duration-300 ${
                          isSelected 
                            ? isOverLimit 
                              ? 'fill-red-700 font-black scale-105' 
                              : 'fill-neutral-900 font-black' 
                            : isOverLimit 
                              ? 'fill-red-500 font-semibold' 
                              : 'fill-neutral-600'
                        }`}
                      >
                        {dist.name.split(': ')[1] || dist.name}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Map Legend: Responsive and fully matching markers & active state */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center bg-neutral-50 p-4 border border-neutral-150 rounded-xl mt-4 gap-2.5">
            <span className="text-[10px] font-mono text-neutral-450 uppercase font-bold">Chennai Zonal Coverage Map</span>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-600">
                <span className="w-3 h-3 rounded-full bg-[#0e2954] border border-white shadow-xs inline-block" />
                <span>Primary Hub (Navy)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-600">
                <span className="w-3 h-3 rounded-full bg-[#eab308] border border-white shadow-xs inline-block" />
                <span>Secondary Hub (Amber)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-450">
                <span className="w-3 h-3 rounded-full bg-neutral-250 border border-white inline-block" />
                <span>Standby / Inactive</span>
              </div>
            </div>
          </div>

          {/* Floating Hover Tooltip */}
          <AnimatePresence>
            {hoveredDistrict && (() => {
              const hoveredData = zonalRecords[hoveredDistrict];
              const name = hoveredData ? hoveredData.name : (zonalRecords[hoveredDistrict]?.name || hoveredDistrict);
              const projectCount = hoveredData ? hoveredData.floodsManaged : 0;
              const areaName = hoveredData?.areas || (hoveredData?.name?.split(': ')[1] || hoveredDistrict);
              const zoneName = hoveredData ? hoveredData.name.split(': ')[0] : hoveredDistrict;
              
              // Smart quadrant positioning to prevent tooltip from clipping or hiding outside the parent container
              const showBelow = tooltipPos.y < 165;
              const showLeft = tooltipPos.x > 175;
              
              const xOffset = showLeft ? -256 : 12;
              const yOffset = showBelow ? 12 : -12;
              const transformValue = showBelow ? 'none' : 'translateY(-100%)';

              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                  className="absolute bg-neutral-900 border border-neutral-800 text-white p-3.5 rounded-xl shadow-2xl pointer-events-none z-[100] w-60 text-left overflow-visible space-y-2"
                  style={{
                    left: `${tooltipPos.x + xOffset}px`,
                    top: `${tooltipPos.y + yOffset}px`,
                    transform: transformValue
                  }}
                >
                  <div className="flex items-center justify-between gap-2 border-b border-neutral-800 pb-2">
                    <div className="space-y-0.5">
                      <p className="font-display font-black text-xs text-brand-gold-400 leading-tight">
                        {zoneName}: {areaName}
                      </p>
                      {hoveredData?.wardRange && (
                        <p className="font-mono text-[9px] text-neutral-400">
                          Wards Scope: {hoveredData.wardRange}
                        </p>
                      )}
                    </div>
                    <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded shrink-0 self-start ${
                      hoveredData?.status === 'active-hq' 
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                        : hoveredData?.isActive 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                          : 'bg-neutral-800 text-neutral-400 border border-neutral-700/50'
                    }`}>
                      {hoveredData?.status === 'active-hq' ? 'Command HQ' : hoveredData?.isActive ? 'Active' : 'Standby'}
                    </span>
                  </div>
                  
                  <div className="space-y-1 font-sans text-xs">
                    <div className="flex justify-between gap-6">
                      <span className="text-neutral-400">Active Pumps:</span>
                      <span className="font-mono font-bold text-neutral-100">
                        {hoveredData?.pumpsDeployed} / {hoveredData?.totalPumps || 25}
                      </span>
                    </div>
                    <div className="flex justify-between gap-6">
                      <span className="text-neutral-400">On-field Crews:</span>
                      <span className="font-mono font-bold text-neutral-100">
                        {hoveredData?.activeStaff} Staff
                      </span>
                    </div>
                    <div className="flex justify-between gap-6 pt-1 border-t border-neutral-850/50 text-[10px]">
                      <span className="text-neutral-500">Relief Projects:</span>
                      <span className="font-mono text-neutral-400">{projectCount} Completed</span>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>

        {/* Right Grid: Detailed parameters card and list selection (lg:col-span-6) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">

          {/* Quick district selector buttons pile */}
          <div className="space-y-2">
            <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest pl-1">
              Command Center Fleet Index
            </p>
            <div className="flex gap-2 flex-wrap">
              {(Object.values(zonalRecords) as DistrictData[]).map((dist) => {
                const isSelected = selectedDistrict === dist.id;
                const isOverLimit = dist.activeStaff > 45 && dist.isActive;
                
                return (
                  <button
                    key={dist.id}
                    onClick={() => setSelectedDistrict(dist.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-display font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected 
                        ? isOverLimit
                          ? 'bg-red-600 text-white border-red-700 shadow-sm ring-2 ring-red-500/40'
                          : 'bg-brand-blue-900 text-white border-brand-blue-950 shadow-sm' 
                        : dist.isActive 
                          ? isOverLimit
                            ? 'bg-red-50/80 text-red-700 border-red-200 hover:bg-red-100/90'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50' 
                          : 'bg-neutral-100 text-neutral-400 border-neutral-200/50 opacity-60'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isOverLimit
                        ? 'bg-red-600 animate-ping'
                        : dist.status === 'active-hq' 
                          ? 'bg-brand-gold-500' 
                          : dist.isActive 
                            ? 'bg-brand-blue-500' 
                            : 'bg-neutral-400'
                    }`} />
                    <span>{dist.name.split(': ')[1] || dist.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Detail Display Sheet with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDistrict}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
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
                      : currentRecord.isActive 
                        ? 'bg-brand-blue-50 text-brand-blue-700' 
                        : 'bg-neutral-100 text-neutral-400'
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
                          : currentRecord.isActive 
                            ? 'bg-brand-blue-600/10 text-brand-blue-600' 
                            : 'bg-neutral-100 text-neutral-400'
                      }`}>
                        {currentRecord.status === 'active-hq' ? 'Primary Yard Command' : currentRecord.isActive ? 'Active Support Sector' : 'Standby / Reserve'}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans font-light">
                  {currentRecord.description}
                </p>

                {/* Quantitative statistics strip */}
                {currentRecord.isActive ? (
                  <div className="space-y-4">
                    {currentRecord.activeStaff > 45 && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-800 text-xs flex items-start gap-2.5 animate-pulse">
                        <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Staff Capacity Safety Ceiling Exceeded</p>
                          <p className="text-[11px] text-red-700 font-light mt-0.5 leading-relaxed">
                            Operational protocols strictly limit on-field dewatering staff to a maximum of 45 per zone to ensure field safety. Current deployment of {currentRecord.activeStaff} violates this ceiling. Please reduce the staffing immediately.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="bg-brand-blue-50/50 border border-brand-blue-100 rounded-xl p-4 text-brand-blue-800 text-xs flex items-start gap-2.5 mt-4">
                      <Activity className="w-4 h-4 text-brand-blue-600 shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <p className="font-bold">Real-time Telemetry Active</p>
                        <p className="text-[11px] text-brand-blue-700/95 font-medium mt-0.5 leading-relaxed">
                          Kindly check the Emergency Telemetry Feed for Real Time Data.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200/60 flex items-start gap-2.5 text-amber-800 text-xs">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Standby Command Area</p>
                      <p className="text-[11px] text-amber-700 font-light mt-0.5">
                        This sector is maintained on standby. Emergency pumps are ready to deploy within 180 minutes of callout notification from our core Villupuram Headquarters.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Stationed assets checklist */}
              {currentRecord.isActive && currentRecord.facilities.length > 0 && (
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
    </div>
  );
};
