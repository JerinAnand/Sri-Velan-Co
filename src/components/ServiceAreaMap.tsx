/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Flame, MapPin, CheckCircle, Droplet, User, Settings, Info } from 'lucide-react';

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
    coordinateLabel: { x: 255, y: 52 }
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
    coordinateLabel: { x: 175, y: 50 }
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
    coordinateLabel: { x: 155, y: 110 }
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
    coordinateLabel: { x: 257, y: 115 }
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
    coordinateLabel: { x: 252, y: 170 }
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
    coordinateLabel: { x: 180, y: 167 }
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
    coordinateLabel: { x: 82, y: 147 }
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
    coordinateLabel: { x: 125, y: 217 }
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
    coordinateLabel: { x: 202, y: 225 }
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
    coordinateLabel: { x: 120, y: 275 }
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
    coordinateLabel: { x: 50, y: 245 }
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
    coordinateLabel: { x: 92, y: 337 }
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
    coordinateLabel: { x: 200, y: 342 }
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
    coordinateLabel: { x: 155, y: 407 }
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
    coordinateLabel: { x: 165, y: 475 }
  }
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.015
    }
  }
};

const districtVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
    transformOrigin: '50% 50%'
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transformOrigin: '50% 50%',
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 14
    }
  }
};

export const ServiceAreaMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 350, height: 460 });
  const [selectedDistrict, setSelectedDistrict] = useState<string>('zone9');
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zonalRecords, setZonalRecords] = useState<Record<string, DistrictData>>(DISTRICT_RECORDS);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (!entries || !entries[0]) return;
      const { width, height } = entries[0].contentRect;
      setDimensions({
        width: width || 350,
        height: height || 460
      });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const activeRegions = (Object.values(zonalRecords) as DistrictData[]).filter(d => d.isActive);
  const currentRecord = zonalRecords[selectedDistrict];

  // SVG Render paths representing stylized Chennai City zones
  const districtPaths = [
    { id: 'zone1', name: 'Zone 1: Thiruvottiyur', d: 'M 210 15 L 290 20 L 295 90 L 220 85 Z' },
    { id: 'zone2', name: 'Zone 2: Manali', d: 'M 130 20 L 210 15 L 220 85 L 140 80 Z' },
    { id: 'zone3', name: 'Zone 3: Madhavaram', d: 'M 120 80 L 195 85 L 190 140 L 115 135 Z' },
    { id: 'zone4', name: 'Zone 4: Tondiarpet', d: 'M 220 85 L 295 90 L 285 145 L 220 140 Z' },
    { id: 'zone5', name: 'Zone 5: Royapuram', d: 'M 220 140 L 285 145 L 280 200 L 220 195 Z' },
    { id: 'zone6', name: 'Zone 6: Thiru-Vi-Ka-Nagar', d: 'M 140 140 L 220 140 L 215 195 L 140 195 Z' },
    { id: 'zone7', name: 'Zone 7: Ambattur', d: 'M 50 110 L 120 110 L 110 185 L 45 175 Z' },
    { id: 'zone8', name: 'Zone 8: Anna Nagar', d: 'M 90 185 L 165 195 L 160 250 L 85 240 Z' },
    { id: 'zone9', name: 'Zone 9: Teynampet', d: 'M 165 195 L 240 195 L 235 255 L 160 250 Z' },
    { id: 'zone10', name: 'Zone 10: Kodambakkam', d: 'M 85 240 L 160 250 L 155 310 L 80 300 Z' },
    { id: 'zone11', name: 'Zone 11: Valasaravakkam', d: 'M 20 190 L 85 240 L 80 300 L 15 250 Z' },
    { id: 'zone12', name: 'Zone 12: Alandur', d: 'M 60 300 L 135 310 L 125 375 L 50 365 Z' },
    { id: 'zone13', name: 'Zone 13: Adyar', d: 'M 155 310 L 255 310 L 245 375 L 145 375 Z' },
    { id: 'zone14', name: 'Zone 14: Perungudi', d: 'M 110 375 L 210 375 L 200 440 L 100 440 Z' },
    { id: 'zone15', name: 'Zone 15: Sholinganallur', d: 'M 120 440 L 220 440 L 210 510 L 110 510 Z' }
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
              viewBox="0 0 350 500" 
              className="w-full select-none filter drop-shadow-md duration-350 transition-all overflow-visible"
              style={{ 
                maxWidth: `${Math.min(dimensions.width - 48, 350)}px`,
                aspectRatio: '350/500',
                height: 'auto'
              }}
            >
              {/* Regional outlines */}
              <motion.g 
                id="state-districts"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
              >
                {districtPaths.map((path) => {
                  const data = zonalRecords[path.id];
                  const hasData = !!data;
                  const isActive = data?.isActive;
                  const isSelected = selectedDistrict === path.id;
                  const isHovered = hoveredDistrict === path.id;

                  // Dynamic color fills based on state
                  let fill = '#f5f5f5'; // Neutral non-operational gray
                  let stroke = '#e5e5e5';
                  let strokeWidth = '1';

                  if (hasData) {
                    if (data.activeStaff > 45 && data.isActive) {
                      fill = isSelected ? '#991b1b' : (isHovered ? '#dc2626' : '#f87171');
                      stroke = '#991b1b';
                      strokeWidth = isSelected ? '2.5' : '2';
                    } else if (data.status === 'active-hq') {
                      fill = isSelected ? '#1e3a8a' : (isHovered ? '#1d4ed8' : '#3b82f6');
                      stroke = '#1e3a8a';
                      strokeWidth = isSelected ? '2' : '1.5';
                    } else if (data.status === 'active-node') {
                      fill = isSelected ? '#1e40af' : (isHovered ? '#3b82f6' : '#93c5fd');
                      stroke = '#1e40af';
                      strokeWidth = isSelected ? '2' : '1.5';
                    } else if (data.status === 'standby') {
                      fill = isSelected ? '#ca8a04' : (isHovered ? '#eab308' : '#fef08a');
                      stroke = '#ca8a04';
                      strokeWidth = isSelected ? '1.5' : '1';
                    }
                  } else {
                    // Normal rest state
                    fill = isHovered ? '#eaeaea' : '#f3f4f6';
                    stroke = '#d1d5db';
                    strokeWidth = '0.5';
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

              {/* Major District Labels */}
              <g id="district-labels" className="pointer-events-none">
                {(Object.values(zonalRecords) as DistrictData[]).map((dist) => {
                  const isSelected = selectedDistrict === dist.id;
                  const isOverLimit = dist.activeStaff > 45 && dist.isActive;
                  
                  return (
                    <g key={dist.id} className="transition-all duration-300">
                      {/* Compact dot locating the district center */}
                      <circle 
                        cx={dist.coordinateLabel.x} 
                        cy={dist.coordinateLabel.y} 
                        r={isSelected ? '3.5' : '2'} 
                        fill={isOverLimit ? '#dc2626' : dist.status === 'active-hq' ? '#ca8a04' : '#1d4ed8'}
                        className="transition-transform duration-300"
                      />
                      {/* Label Text */}
                      <text
                        x={dist.coordinateLabel.x + 6}
                        y={dist.coordinateLabel.y + 3}
                        className={`font-mono text-[8px] font-bold ${
                          isSelected 
                            ? isOverLimit 
                              ? 'fill-red-600 font-black' 
                              : 'fill-neutral-900 font-black' 
                            : isOverLimit 
                              ? 'fill-red-500 font-bold' 
                              : 'fill-neutral-500'
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

          <div className="w-full flex justify-between items-center bg-neutral-50 p-3.5 border border-neutral-100 rounded-xl mt-4">
            <span className="text-[10px] font-mono text-neutral-450 uppercase">Chennai Municipal Zonal Coverage Map</span>
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-blue-700 block" title="Active Core District" />
              <span className="w-2.5 h-2.5 rounded-full bg-brand-blue-300 block" title="Support Command Area" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-200 block" title="Reserve/Standby Unit" />
            </div>
          </div>

          {/* Floating Hover Tooltip */}
          <AnimatePresence>
            {hoveredDistrict && (() => {
              const hoveredData = DISTRICT_RECORDS[hoveredDistrict];
              const name = hoveredData ? hoveredData.name : (districtPaths.find(p => p.id === hoveredDistrict)?.name || hoveredDistrict);
              const projectCount = hoveredData ? hoveredData.floodsManaged : 0;
              
              // Smart quadrant positioning to prevent tooltip from clipping or hiding outside the parent container
              const showBelow = tooltipPos.y < 165;
              const showLeft = tooltipPos.x > 175;
              
              const xOffset = showLeft ? -236 : 12;
              const yOffset = showBelow ? 12 : -12;
              const transformValue = showBelow ? 'none' : 'translateY(-100%)';

              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                  className="absolute bg-neutral-900 border border-neutral-800 text-white p-3.5 rounded-xl shadow-2xl pointer-events-none z-[100] w-56 text-left overflow-visible"
                  style={{
                    left: `${tooltipPos.x + xOffset}px`,
                    top: `${tooltipPos.y + yOffset}px`,
                    transform: transformValue
                  }}
                >
                  <div className="flex items-center justify-between gap-2 border-b border-neutral-800 pb-2 mb-2">
                    <span className="font-display font-extrabold text-xs text-neutral-100">
                      {name}
                    </span>
                    <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                      hoveredData?.status === 'active-hq' 
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                        : hoveredData?.isActive 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                          : 'bg-neutral-800 text-neutral-400 border border-neutral-700/50'
                    }`}>
                      {hoveredData?.status === 'active-hq' ? 'Command HQ' : hoveredData?.isActive ? 'Active Sector' : 'Standby / Outer'}
                    </span>
                  </div>
                  <div className="space-y-1.5 font-sans text-[11px]">
                    <div className="flex justify-between items-center text-neutral-350">
                      <span>Relief Projects:</span>
                      <span className="font-mono font-bold text-brand-gold-400">{projectCount} Completed</span>
                    </div>
                    {hoveredData && hoveredData.isActive && (
                      <>
                        <div className="flex justify-between items-center text-neutral-400">
                          <span>Active Pumps:</span>
                          <span className="font-mono font-semibold text-neutral-200">{hoveredData.pumpsDeployed} Deployed</span>
                        </div>
                        <div className="flex justify-between items-center text-neutral-400">
                          <span>De-watering Staff:</span>
                          <span className="font-mono font-semibold text-neutral-200">{hoveredData.activeStaff} On-Field</span>
                        </div>
                      </>
                    )}
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

                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-100">
                      <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-150/70">
                        <div className="flex items-center gap-1.5 text-brand-blue-700">
                          <Droplet className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-mono text-neutral-450 uppercase font-semibold">Active Pumps</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-neutral-900 mt-1 font-mono leading-none">
                          {currentRecord.pumpsDeployed}
                        </p>
                      </div>

                      <div className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                        currentRecord.activeStaff > 45 
                          ? 'bg-red-50/50 border-red-200 ring-1 ring-red-100' 
                          : 'bg-neutral-50 border-neutral-150/70'
                      }`}>
                        <div className="flex items-center gap-1.5 text-brand-blue-700">
                          <User className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-[9px] font-mono text-neutral-450 uppercase font-semibold">On-field Staff</span>
                        </div>
                        <div className="flex items-center justify-between mt-1 gap-1">
                          <p className={`text-lg sm:text-xl font-black font-mono leading-none ${
                            currentRecord.activeStaff > 45 ? 'text-red-600' : 'text-neutral-900'
                          }`}>
                            {currentRecord.activeStaff}
                          </p>
                          <div className="flex gap-0.5">
                            <button
                              onClick={() => {
                                setZonalRecords(prev => ({
                                  ...prev,
                                  [selectedDistrict]: {
                                    ...prev[selectedDistrict],
                                    activeStaff: Math.max(0, prev[selectedDistrict].activeStaff - 1)
                                  }
                                }));
                              }}
                              className="w-4 h-4 bg-neutral-200 hover:bg-neutral-300 rounded text-neutral-800 text-[9px] font-extrabold flex items-center justify-center transition-colors cursor-pointer"
                              title="Decrease staff"
                            >
                              -
                            </button>
                            <button
                              onClick={() => {
                                setZonalRecords(prev => ({
                                  ...prev,
                                  [selectedDistrict]: {
                                    ...prev[selectedDistrict],
                                    activeStaff: prev[selectedDistrict].activeStaff + 1
                                  }
                                }));
                              }}
                              className="w-4 h-4 bg-neutral-200 hover:bg-neutral-300 rounded text-neutral-800 text-[9px] font-extrabold flex items-center justify-center transition-colors cursor-pointer"
                              title="Increase staff"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-150/70">
                        <div className="flex items-center gap-1.5 text-brand-blue-700">
                          <Settings className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-mono text-neutral-450 uppercase font-semibold">Incidents Met</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-neutral-900 mt-1 font-mono leading-none">
                          {currentRecord.floodsManaged}
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
