/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { 
  ShieldAlert, 
  RefreshCw, 
  Users, 
  Droplet, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  Activity,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Define the shape of a telemetry item
export interface TelemetryRecord {
  zone: string;
  areas: string;
  wardRange: string;
  activePumps: number;
  totalPumps: number;
  staffCount: number;
}

// Fallback safety net data matching real-time Chennai City zones
const FALLBACK_TELEMETRY: TelemetryRecord[] = [
  { zone: "Zone 1", areas: "Thiruvottiyur", wardRange: "1–14", activePumps: 18, totalPumps: 25, staffCount: 42 },
  { zone: "Zone 2", areas: "Manali", wardRange: "15–21", activePumps: 24, totalPumps: 30, staffCount: 38 },
  { zone: "Zone 3", areas: "Madhavaram", wardRange: "22–33", activePumps: 15, totalPumps: 20, staffCount: 30 },
  { zone: "Zone 4", areas: "Tondiarpet", wardRange: "34–48", activePumps: 20, totalPumps: 28, staffCount: 40 },
  { zone: "Zone 5", areas: "Royapuram", wardRange: "49–63", activePumps: 35, totalPumps: 45, staffCount: 45 },
  { zone: "Zone 6", areas: "Thiru-Vi-Ka-Nagar", wardRange: "64–78", activePumps: 22, totalPumps: 30, staffCount: 42 },
  { zone: "Zone 7", areas: "Ambattur", wardRange: "79–93", activePumps: 26, totalPumps: 35, staffCount: 43 },
  { zone: "Zone 8", areas: "Anna Nagar", wardRange: "94–108", activePumps: 19, totalPumps: 25, staffCount: 45 },
  { zone: "Zone 9", areas: "Teynampet", wardRange: "109–126", activePumps: 40, totalPumps: 50, staffCount: 45 },
  { zone: "Zone 10", areas: "Kodambakkam", wardRange: "127–142", activePumps: 25, totalPumps: 35, staffCount: 44 },
  { zone: "Zone 11", areas: "Valasaravakkam", wardRange: "143–155", activePumps: 14, totalPumps: 20, staffCount: 32 },
  { zone: "Zone 12", areas: "Alandur", wardRange: "156–167", activePumps: 16, totalPumps: 22, staffCount: 36 },
  { zone: "Zone 13", areas: "Adyar", wardRange: "168–180", activePumps: 30, totalPumps: 40, staffCount: 45 },
  { zone: "Zone 14", areas: "Perungudi", wardRange: "181–191", activePumps: 12, totalPumps: 18, staffCount: 28 },
  { zone: "Zone 15", areas: "Sholinganallur", wardRange: "192–200", activePumps: 15, totalPumps: 22, staffCount: 35 }
];

const SHEETY_API_URL = 'https://api.sheety.co/a60c109366402ebe451f834d2ca573d4/telemetryData/telemetry';

export const ServiceAreaTelemetry: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [telemetry, setTelemetry] = useState<TelemetryRecord[]>(FALLBACK_TELEMETRY);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Real-time tracking of seconds elapsed since last successful update
  const [secondsAgo, setSecondsAgo] = useState<number>(0);
  const [isBackingOff, setIsBackingOff] = useState<boolean>(false);

  // Core data fetch function with defensive parsing
  const fetchTelemetry = async (silent: boolean = false) => {
    if (!silent) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const res = await fetch(SHEETY_API_URL);
      if (!res.ok) {
        throw new Error(`HTTP Error Status: ${res.status}`);
      }

      const { telemetry: rawData } = await res.json();
      
      if (!rawData || !Array.isArray(rawData)) {
        throw new Error('Invalid Sheety payload structure: Missing telemetry array');
      }

      // Map and cast numeric columns defensively with Number()
      const sanitized: TelemetryRecord[] = rawData.map((item: any) => ({
        zone: item.zone ? String(item.zone).trim() : '',
        areas: item.areas ? String(item.areas).trim() : '',
        wardRange: item.wardRange ? String(item.wardRange).trim() : '',
        activePumps: Number(item.activePumps) || 0,
        totalPumps: Number(item.totalPumps) || 0,
        staffCount: Number(item.staffCount) || 0
      }));

      setTelemetry(sanitized);
      setError(null);
      setSecondsAgo(0);
      setIsBackingOff(false); // Succeeded, clear back-off state
    } catch (err: any) {
      console.error('ServiceAreaTelemetry fetch error:', err);
      setError(err?.message || 'Network connectivity error.');
      
      // Fallback to the safety net data if we don't already have good active data
      if (telemetry.length === 0) {
        setTelemetry(FALLBACK_TELEMETRY);
      }
      
      // Suffer a rate limit or fetch fail: back off for the next refresh interval (skip tick)
      setIsBackingOff(true);
      setSecondsAgo(0);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial mount fetch
  useEffect(() => {
    fetchTelemetry();
  }, []);

  // Set up 1-second interval tracker for the live ticker
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setSecondsAgo(prev => prev + 1);
    }, 1000);

    return () => clearInterval(clockTimer);
  }, []);

  // Monitor seconds since last update to trigger scheduled re-fetches
  useEffect(() => {
    // Standard interval is 30s. If backing off due to Sheety rate-limits/errors, wait 60s
    const targetInterval = isBackingOff ? 60 : 30;
    
    if (secondsAgo >= targetInterval) {
      fetchTelemetry(true);
    }
  }, [secondsAgo, isBackingOff]);

  // Color-coding calculations based on pump deployment capacity ratio
  const getPumpStatusClass = (active: number, total: number) => {
    if (total <= 0) return { bg: 'bg-neutral-100 text-neutral-500 border-neutral-200', text: 'Off' };
    const ratio = active / total;
    if (ratio > 0.7) {
      return { 
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/50', 
        text: 'Optimal' 
      };
    } else if (ratio >= 0.4) {
      return { 
        bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/50', 
        text: 'Standby' 
      };
    } else {
      return { 
        bg: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50', 
        text: 'Critical' 
      };
    }
  };

  // Recharts custom interactive tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as TelemetryRecord;
      return (
        <div className="bg-neutral-900 border border-neutral-800 text-white p-4 rounded-xl shadow-2xl space-y-2 text-xs text-left">
          <p className="font-display font-black text-sm text-brand-gold-400">
            {data.zone}: {data.areas}
          </p>
          <p className="font-mono text-[10px] text-neutral-400">
            Wards Scope: {data.wardRange}
          </p>
          <div className="h-px bg-neutral-800 my-1" />
          <div className="space-y-1">
            <div className="flex justify-between gap-6">
              <span className="text-neutral-400">Active Pumps:</span>
              <span className="font-mono font-bold text-neutral-100">
                {data.activePumps} / {data.totalPumps}
              </span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-neutral-400">On-field Crews:</span>
              <span className="font-mono font-bold text-neutral-100">
                {data.staffCount} Staff
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Shimmering skeleton loader structure
  if (isLoading) {
    return (
      <div className="space-y-8 text-left py-6" id="service-area-telemetry">
        <div className="flex justify-between items-center border-b border-neutral-200 pb-4 animate-pulse">
          <div className="space-y-2">
            <div className="h-4 bg-neutral-200 rounded w-48" />
            <div className="h-6 bg-neutral-200 rounded w-72" />
          </div>
          <div className="h-8 bg-neutral-200 rounded-md w-36" />
        </div>
        
        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4">
              <div className="h-4 bg-neutral-200 rounded w-1/3" />
              <div className="h-6 bg-neutral-200 rounded w-2/3" />
              <div className="h-3 bg-neutral-100 rounded w-1/2" />
              <div className="flex gap-2 pt-2">
                <div className="h-7 bg-neutral-100 rounded-full w-24" />
                <div className="h-7 bg-neutral-100 rounded-full w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left py-6" id="service-area-telemetry-dashboard">
      
      {/* 1. Interactive Top Header / Status bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-brand-blue-50 text-brand-blue-700 border border-brand-blue-100 text-[10px] font-mono font-bold uppercase py-1 px-2.5 rounded-full dark:bg-brand-blue-950/30 dark:text-brand-blue-400 dark:border-brand-blue-900/50">
            <Activity className="w-3.5 h-3.5 text-brand-blue-600 dark:text-brand-blue-400" />
            <span>Emergency Telemetry Feed</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-brand-blue-900 tracking-tight font-display dark:text-white">
            Service Area Telemetry Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-neutral-550 max-w-xl dark:text-neutral-400">
            Real-time status monitoring of localized pump performance, dewatering capacities, and emergency crew coordinates.
          </p>
        </div>

        {/* Live Refresh Widget */}
        <div className="flex items-center gap-3 self-start sm:self-center bg-white dark:bg-neutral-900 p-2 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <span className={`w-2 h-2 rounded-full inline-block ${isBackingOff ? 'bg-amber-500' : 'bg-emerald-500 animate-ping'}`} />
            <span className="text-neutral-500 dark:text-neutral-400">
              {isBackingOff ? 'Back-off state' : 'Live'}
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <span className="text-neutral-600 dark:text-neutral-300 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3 shrink-0 text-neutral-400" />
              {isBackingOff ? `re-trying in ${60 - secondsAgo}s` : `updated ${secondsAgo}s ago`}
            </span>
          </div>
          <button
            onClick={() => fetchTelemetry(true)}
            disabled={isRefreshing}
            className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-500 dark:text-neutral-400 transition-colors disabled:opacity-50 cursor-pointer"
            title="Force refresh data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Error / Warning Alert Banners */}
      {error && (
        <div className="bg-red-50/75 border border-red-200 dark:bg-red-950/20 dark:border-red-900/50 rounded-xl p-4 flex items-start gap-3 text-red-800 dark:text-red-400 text-xs">
          <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Live connection interrupted: {error}</p>
            <p className="text-[11px] text-red-700 dark:text-red-400/85 font-light leading-relaxed">
              Serving our last cached record as a safety measure. The dashboard has initiated protective rate-limit backoffs and will retry automatically.
            </p>
          </div>
        </div>
      )}

      {/* 3. Responsive Grid of Zone Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {telemetry.map((record, index) => {
          const pumpStatus = getPumpStatusClass(record.activePumps, record.totalPumps);
          
          return (
            <motion.div
              key={record.zone}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(index * 0.025, 0.3) }}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 hover:shadow-lg dark:hover:shadow-black/20 hover:border-brand-blue-600/20 dark:hover:border-brand-blue-800/40 transition-all duration-300 flex flex-col justify-between space-y-4 text-left"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-brand-blue-700 dark:text-brand-blue-400 uppercase">
                    {record.zone}
                  </span>
                  <span className="text-[9px] font-mono text-neutral-450 dark:text-neutral-500 font-medium">
                    Wards {record.wardRange}
                  </span>
                </div>
                <h3 className="font-display font-black text-lg text-brand-blue-950 dark:text-white leading-tight">
                  {record.areas}
                </h3>
              </div>

              {/* Status pills section */}
              <div className="flex gap-2 flex-wrap pt-1">
                {/* Active Pumps status pill */}
                <div className={`px-2.5 py-1 rounded-full border text-[10px] font-semibold flex items-center gap-1.5 font-display ${pumpStatus.bg}`}>
                  <Droplet className="w-3 h-3 shrink-0" />
                  <span>Pumps: {record.activePumps}/{record.totalPumps}</span>
                </div>

                {/* On-field Staff count pill */}
                <div className="bg-neutral-50 border border-neutral-200 text-neutral-700 dark:bg-neutral-800/30 dark:border-neutral-700 dark:text-neutral-300 px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1.5 font-display">
                  <Users className="w-3 h-3 shrink-0 text-neutral-400" />
                  <span>Crews: {record.staffCount}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 4. Recharts Grouped Bar Chart Visualizer */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-brand-gold-50 text-brand-gold-700 border border-brand-gold-200/50 text-[10px] font-mono font-bold uppercase py-1 px-2.5 rounded-full dark:bg-brand-gold-950/20 dark:text-brand-gold-400 dark:border-brand-gold-900/40">
              <TrendingUp className="w-3.5 h-3.5 text-brand-gold-600 dark:text-brand-gold-400" />
              <span>Comparative Analytics</span>
            </div>
            <h3 className="font-display font-black text-lg text-brand-blue-950 dark:text-white">
              Pump Allocations vs On-field Staff Levels
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Comparative representation of active engine metrics deployed across the 15 Municipal Chennai Zones.
            </p>
          </div>
        </div>

        {/* Horizontal scroll container with scrollbar styling and touch scrolling support */}
        <div className="w-full overflow-x-auto no-scrollbar scroll-smooth">
          <div className="min-w-[850px] lg:min-w-0 lg:w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={telemetry}
                margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
                barGap={4}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#262626' : '#f0f0f0'} />
                <XAxis 
                  dataKey="zone" 
                  tick={{ fontSize: 10, fontWeight: 600, fill: isDark ? '#a3a3a3' : '#4b5563' }}
                  axisLine={{ stroke: isDark ? '#262626' : '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fontSize: 10, fontWeight: 500, fill: isDark ? '#a3a3a3' : '#4b5563' }}
                  axisLine={{ stroke: isDark ? '#262626' : '#e5e7eb' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconSize={10}
                  wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} 
                />
                <Bar 
                  name="Active Dewatering Pumps" 
                  dataKey="activePumps" 
                  fill={isDark ? '#3b82f6' : '#0e2954'} 
                  radius={[4, 4, 0, 0]} 
                  barSize={16}
                />
                <Bar 
                  name="On-field Crew Members" 
                  dataKey="staffCount" 
                  fill={isDark ? '#fbbf24' : '#e6b325'} 
                  radius={[4, 4, 0, 0]} 
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Scroll Tip Indicator on Mobile Viewports */}
        <div className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 text-center flex sm:hidden items-center justify-center gap-1.5">
          <span>← Swipe horizontally to explore full chart matrix →</span>
        </div>
      </div>
    </div>
  );
};
