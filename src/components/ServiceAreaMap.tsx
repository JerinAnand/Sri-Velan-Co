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
  villupuram: {
    id: 'villupuram',
    name: 'Villupuram',
    isActive: true,
    status: 'active-hq',
    pumpsDeployed: 45,
    activeStaff: 150,
    floodsManaged: 18,
    description: 'Corporate Headquarters and central maintenance yard. Houses the largest collection of high-horsepower tractor-driven dewatering machinery and immediate emergency relief armadas.',
    facilities: ['Main Maintenance Yard', 'Central Staff Quarters', '24/7 Dispatch Desk', 'Heavy Machinery Fleet A'],
    coordinateLabel: { x: 205, y: 135 }
  },
  cuddalore: {
    id: 'cuddalore',
    name: 'Cuddalore',
    isActive: true,
    status: 'active-node',
    pumpsDeployed: 28,
    activeStaff: 75,
    floodsManaged: 12,
    description: 'A major storm-vulnerable coastal hub. Historically significant region for flood control, specialized in canal dredging support and high-inflow storm pumping.',
    facilities: ['Coastal Response Base', 'Wetlands Pumping Array', 'Suction Trailer Storage'],
    coordinateLabel: { x: 260, y: 165 }
  },
  chennai: {
    id: 'chennai',
    name: 'Chennai',
    isActive: true,
    status: 'active-hq',
    pumpsDeployed: 32,
    activeStaff: 90,
    floodsManaged: 14,
    description: 'Capital corporate municipal support division and Primary Yard Command. Heavily engaged with the Greater Chennai Corporation (GCC) for subway clearance and neighborhood drainage logs during severe storm cycles.',
    facilities: ['Metro Liaison Office', 'Basement Extraction Division', 'High-HP Submersibles Base', 'North-Eastern Express Maintenance Hub'],
    coordinateLabel: { x: 295, y: 55 }
  },
  chengalpattu: {
    id: 'chengalpattu',
    name: 'Chengalpattu',
    isActive: true,
    status: 'active-node',
    pumpsDeployed: 18,
    activeStaff: 45,
    floodsManaged: 8,
    description: 'Vital expressway and bypass drainage management sector. Protects key transport channels from severe runoffs and delivers lake-inflow balance assistance.',
    facilities: ['Highway De-clogging Unit', 'Canal Gate Liaison Post'],
    coordinateLabel: { x: 265, y: 95 }
  },
  kanchipuram: {
    id: 'kanchipuram',
    name: 'Kanchipuram',
    isActive: true,
    status: 'active-node',
    pumpsDeployed: 16,
    activeStaff: 38,
    floodsManaged: 6,
    description: 'Industrial tech zone protection division. Partners with PWD to manage large lake overflows and prevent waterlogging around industrial complexes.',
    facilities: ['Industrial Cluster Unit', 'Reservoir Outflow Control Station'],
    coordinateLabel: { x: 232, y: 82 }
  },
  tiruvallur: {
    id: 'tiruvallur',
    name: 'Tiruvallur',
    isActive: true,
    status: 'active-node',
    pumpsDeployed: 12,
    activeStaff: 32,
    floodsManaged: 5,
    description: 'Northern catchment zone team. Monitors active reservoirs and offers rapid-action flood response deployment to surrounding villages and public offices.',
    facilities: ['Northern Catchment Base', 'Agriculture Drainage Fleet'],
    coordinateLabel: { x: 255, y: 35 }
  },
  tiruvannamalai: {
    id: 'tiruvannamalai',
    name: 'Tiruvannamalai',
    isActive: false,
    status: 'standby',
    pumpsDeployed: 0,
    activeStaff: 0,
    floodsManaged: 2,
    description: 'Standby support district. Mobilized as needed from the adjacent Villupuram central yard.',
    facilities: ['Emergency Depot Connection'],
    coordinateLabel: { x: 190, y: 90 }
  },
  kallakurichi: {
    id: 'kallakurichi',
    name: 'Kallakurichi',
    isActive: false,
    status: 'standby',
    pumpsDeployed: 0,
    activeStaff: 0,
    floodsManaged: 3,
    description: 'Standby support district. Frequently assisted during seasonal lake-breach operations.',
    facilities: ['Regional Mobile Service Unit'],
    coordinateLabel: { x: 155, y: 135 }
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
  const [selectedDistrict, setSelectedDistrict] = useState<string>('villupuram');
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

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

  const activeRegions = Object.values(DISTRICT_RECORDS).filter(d => d.isActive);
  const currentRecord = DISTRICT_RECORDS[selectedDistrict];

  // SVG Render paths representing stylized Tamil Nadu district polygons
  const districtPaths = [
    { id: 'chennai', name: 'Chennai', d: 'M 285 45 L 305 45 L 305 65 L 285 65 Z' },
    { id: 'tiruvallur', name: 'Tiruvallur', d: 'M 230 40 L 280 20 L 295 50 L 250 65 Z' },
    { id: 'kanchipuram', name: 'Kanchipuram', d: 'M 220 65 L 260 65 L 250 100 L 210 95 Z' },
    { id: 'chengalpattu', name: 'Chengalpattu', d: 'M 260 65 L 295 65 L 280 120 L 250 100 Z' },
    { id: 'villupuram', name: 'Villupuram', d: 'M 175 110 L 240 105 L 255 160 L 190 170 Z' },
    { id: 'cuddalore', name: 'Cuddalore', d: 'M 235 160 L 275 130 L 280 190 L 225 190 Z' },
    { id: 'tiruvannamalai', name: 'Tiruvannamalai', d: 'M 160 70 L 220 65 L 210 110 L 175 115 Z' },
    { id: 'kallakurichi', name: 'Kallakurichi', d: 'M 130 115 L 180 110 L 185 165 L 135 155 Z' },
    
    // Ambient surrounding non-active districts to compose the full outline of Tamil Nadu
    { id: 'salem', name: 'Salem / Western Belt', d: 'M 100 130 L 140 120 L 145 180 L 95 180 Z' },
    { id: 'dharmapuri', name: 'Dharmapuri', d: 'M 115 50 L 165 65 L 150 115 L 110 105 Z' },
    { id: 'krishnagiri', name: 'Krishnagiri', d: 'M 100 10 L 150 15 L 145 65 L 95 55 Z' },
    { id: 'nilgiris', name: 'Nilgiris / Coimbatore', d: 'M 5 150 L 45 150 L 35 190 L 5 190' },
    { id: 'coimbatore', name: 'Coimbatore', d: 'M 5 195 L 45 195 L 55 260 L 15 260 Z' },
    { id: 'erode', name: 'Erode', d: 'M 50 130 L 95 135 L 90 190 L 45 190 Z' },
    { id: 'trichy', name: 'Trichy Central', d: 'M 135 180 L 185 175 L 180 230 L 125 230 Z' },
    { id: 'thanjavur', name: 'Thanjavur Delta', d: 'M 190 195 L 235 195 L 230 250 L 180 240 Z' },
    { id: 'tiruvarur', name: 'Tiruvarur', d: 'M 235 195 L 260 195 L 255 240 L 230 240 Z' },
    { id: 'nagapattinam', name: 'Nagapattinam', d: 'M 260 190 L 280 190 L 270 260 L 255 240 Z' },
    { id: 'pudukkottai', name: 'Pudukkottai', d: 'M 175 245 L 225 245 L 215 300 L 165 290 Z' },
    { id: 'madurai', name: 'Madurai Region', d: 'M 100 255 L 150 250 L 145 310 L 95 310 Z' },
    { id: 'sivagangai', name: 'Sivagangai', d: 'M 150 250 L 195 245 L 185 305 L 145 310 Z' },
    { id: 'dindigul', name: 'Dindigul', d: 'M 75 210 L 125 220 L 115 270 L 65 260 Z' },
    { id: 'ramanthapuram', name: 'Ramanathapuram', d: 'M 145 315 L 230 310 L 225 350 L 135 345 Z' },
    { id: 'virudhunagar', name: 'Virudhunagar', d: 'M 75 315 L 130 315 L 120 370 L 65 370 Z' },
    { id: 'tuticorin', name: 'Tuticorin', d: 'M 105 375 L 155 370 L 145 440 L 95 440 Z' },
    { id: 'tirunelveli', name: 'Tirunelveli', d: 'M 50 375 L 100 375 L 95 445 L 45 445 Z' },
    { id: 'kanyakumari', name: 'Kanyakumari', d: 'M 45 450 L 85 450 L 75 490 L 35 490 Z' }
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
                  const data = DISTRICT_RECORDS[path.id];
                  const hasData = !!data;
                  const isActive = data?.isActive;
                  const isSelected = selectedDistrict === path.id;
                  const isHovered = hoveredDistrict === path.id;

                  // Dynamic color fills based on state
                  let fill = '#f5f5f5'; // Neutral non-operational gray
                  let stroke = '#e5e5e5';
                  let strokeWidth = '1';

                  if (hasData) {
                    if (data.status === 'active-hq') {
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
                {Object.values(DISTRICT_RECORDS).map((dist) => {
                  const isSelected = selectedDistrict === dist.id;
                  
                  return (
                    <g key={dist.id} className="transition-all duration-300">
                      {/* Compact dot locating the district center */}
                      <circle 
                        cx={dist.coordinateLabel.x} 
                        cy={dist.coordinateLabel.y} 
                        r={isSelected ? '3.5' : '2'} 
                        fill={dist.status === 'active-hq' ? '#ca8a04' : '#1d4ed8'}
                        className="transition-transform duration-300"
                      />
                      {/* Label Text */}
                      <text
                        x={dist.coordinateLabel.x + 6}
                        y={dist.coordinateLabel.y + 3}
                        className={`font-mono text-[8px] font-bold ${
                          isSelected ? 'fill-neutral-900 font-black' : 'fill-neutral-500'
                        }`}
                      >
                        {dist.name}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          <div className="w-full flex justify-between items-center bg-neutral-50 p-3.5 border border-neutral-100 rounded-xl mt-4">
            <span className="text-[10px] font-mono text-neutral-450 uppercase">Tamil Nadu Coastal Coverage Zone</span>
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
              {Object.values(DISTRICT_RECORDS).map((dist) => {
                const isSelected = selectedDistrict === dist.id;
                
                return (
                  <button
                    key={dist.id}
                    onClick={() => setSelectedDistrict(dist.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-display font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected 
                        ? 'bg-brand-blue-900 text-white border-brand-blue-950 shadow-sm' 
                        : dist.isActive 
                          ? 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50' 
                          : 'bg-neutral-100 text-neutral-400 border-neutral-200/50 opacity-60'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      dist.status === 'active-hq' 
                        ? 'bg-brand-gold-500' 
                        : dist.isActive 
                          ? 'bg-brand-blue-500' 
                          : 'bg-neutral-400'
                    }`} />
                    <span>{dist.name}</span>
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
                  ★ REGIONAL GENERAL COMMAND HQ
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
                      District of {currentRecord.name}
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

                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-150/70">
                      <div className="flex items-center gap-1.5 text-brand-blue-700">
                        <User className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-mono text-neutral-450 uppercase font-semibold">On-field Staff</span>
                      </div>
                      <p className="text-xl sm:text-2xl font-black text-neutral-900 mt-1 font-mono leading-none">
                        {currentRecord.activeStaff}
                      </p>
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
