import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CloudRain, 
  AlertTriangle, 
  Wind, 
  Thermometer, 
  Droplets, 
  RefreshCw, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronUp, 
  ChevronDown, 
  Activity, 
  FileText,
  Clock,
  Compass,
  ArrowRight,
  Sun,
  CloudLightning
} from 'lucide-react';

interface WeatherAlert {
  name: string;
  lat: number;
  lon: number;
  temp: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  forecast24hPrecipitation: number;
  riskLevel: 'Normal' | 'Watch' | 'Severe' | 'Extreme';
  alertMessage: string;
}

interface AlertData {
  timestamp: string;
  weatherData: WeatherAlert[];
  aiBriefing: string;
  hasAiWarning: boolean;
}

export const WeatherAlertBanner: React.FC = () => {
  const [data, setData] = useState<AlertData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(300); // 5 minutes in seconds

  const fetchAlerts = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      let res;
      try {
        res = await fetch('/api/weather-alerts');
        if (res.status === 404) {
          throw new Error('Not Found - Triggering Netlify fallback');
        }
      } catch (err) {
        console.warn('Primary /api/weather-alerts failed, attempting Netlify fallback...');
        res = await fetch('/.netlify/functions/weather-alerts');
      }

      if (!res.ok) {
        throw new Error(`Failed to retrieve weather alerts: HTTP ${res.status}`);
      }

      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.error('Error fetching alerts:', err);
      setError(err.message || 'Unable to connect to telemetry networks.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchAlerts();
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleManualRefresh = () => {
    fetchAlerts();
    setCountdown(300);
  };

  const getWeatherIcon = (code: number, precipitation: number) => {
    if ([95, 96, 99].includes(code)) {
      return <CloudLightning className="w-5 h-5 text-amber-400 animate-pulse shrink-0" />;
    }
    if (precipitation > 0 || [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
      return <CloudRain className="w-5 h-5 text-blue-400 animate-bounce shrink-0" />;
    }
    return <Sun className="w-5 h-5 text-amber-300 animate-pulse shrink-0" />;
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getRiskColor = (level: 'Normal' | 'Watch' | 'Severe' | 'Extreme') => {
    switch (level) {
      case 'Extreme':
        return 'from-red-600 to-rose-700 text-white border-red-500';
      case 'Severe':
        return 'from-amber-600 to-orange-600 text-white border-amber-500';
      case 'Watch':
        return 'from-blue-600 to-cyan-600 text-white border-blue-500';
      default:
        return 'from-neutral-900 to-neutral-950 text-neutral-300 border-neutral-800';
    }
  };

  const getRiskBadge = (level: 'Normal' | 'Watch' | 'Severe' | 'Extreme') => {
    switch (level) {
      case 'Extreme':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Severe':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Watch':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <section 
      className="bg-neutral-950 border-t border-neutral-800 text-white relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8" 
      id="disaster-weather-panel"
    >
      <div className="absolute inset-0 grid-overlay opacity-5 pointer-events-none" />
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Panel Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div className="space-y-1.5 text-left">
            <div className="inline-flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-xs font-mono font-bold tracking-widest text-brand-gold-400 uppercase">
                SOUTH INDIA DISASTER DEWATERING INTEL
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white leading-none">
              Real-Time Monsoon & Flood Risk Monitor
            </h2>
            <p className="text-xs text-neutral-400 font-sans max-w-2xl">
              Vetted hourly telemetry coupled with live Google Grounded meteorological updates to prepare critical suction installations and trailer pump readiness for state PWD and corporate clients.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
            {data && (
              <span className="font-mono text-[10px] text-neutral-500 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded">
                Telemetry Sync: {formatTime(data.timestamp)}
              </span>
            )}
            
            {/* Auto-Refresh Toggle and Countdown */}
            <button
              onClick={() => {
                setAutoRefresh(!autoRefresh);
                if (!autoRefresh) {
                  setCountdown(300);
                }
              }}
              className={`px-3 py-1.5 border rounded-lg text-xs font-mono flex items-center gap-2 transition-all ${
                autoRefresh 
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400' 
                  : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300'
              }`}
              title={autoRefresh ? "Click to pause automatic sync" : "Click to resume automatic sync"}
            >
              <span className={`relative flex h-2 w-2 ${autoRefresh ? 'block' : 'hidden'}`}>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{autoRefresh ? `Auto-Sync: ${formatCountdown(countdown)}` : 'Auto-Sync: Off'}</span>
            </button>

            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="p-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-all disabled:opacity-50 flex items-center gap-1.5 text-xs font-mono"
              aria-label="Refresh telemetry feeds"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Feeds'}</span>
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-all flex items-center justify-center"
              aria-label={isExpanded ? "Collapse dashboard details" : "Expand dashboard details"}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-neutral-900/60 border border-neutral-800/60 p-6 rounded-2xl space-y-4 animate-pulse">
                <div className="h-4 bg-neutral-800 rounded w-1/3" />
                <div className="space-y-2">
                  <div className="h-8 bg-neutral-800 rounded w-3/4" />
                  <div className="h-4 bg-neutral-800 rounded w-5/6" />
                </div>
                <div className="pt-4 border-t border-neutral-800/80 flex justify-between">
                  <div className="h-3 bg-neutral-800 rounded w-1/4" />
                  <div className="h-3 bg-neutral-800 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Network Error Fallback Panel */}
        {error && !loading && (
          <div className="bg-red-950/15 border border-red-900/40 p-6 rounded-2xl text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-red-400 text-sm font-semibold">
                <ShieldAlert className="w-4 h-4" />
                <span>Sensor Networks Temporarily Unreachable</span>
              </div>
              <p className="text-xs text-neutral-400">
                {error} Continuous civil works and regional standby teams continue on manual VHF status watch.
              </p>
            </div>
            <button 
              onClick={fetchAlerts}
              className="text-xs font-mono uppercase tracking-wider text-brand-gold-400 hover:text-white bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-lg transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Expandable Dashboard Content */}
        <AnimatePresence>
          {isExpanded && data && !loading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="space-y-8 overflow-hidden"
            >
              
              {/* Region-wise Hydrology Risk Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {data.weatherData.map((loc) => {
                  const isRiskAlert = loc.riskLevel === 'Severe' || loc.riskLevel === 'Extreme';
                  return (
                    <div 
                      key={loc.name}
                      className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 text-left flex flex-col justify-between hover:border-neutral-700/60 transition-all shadow-md group relative overflow-hidden"
                    >
                      {/* Live status bar */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {getWeatherIcon(loc.weatherCode, loc.precipitation)}
                          <span className="text-xs font-mono font-bold text-neutral-400 tracking-wide">
                            {loc.name}
                          </span>
                        </div>
                        <span className={`text-[10px] font-mono font-black py-0.5 px-2.5 rounded-full border ${getRiskBadge(loc.riskLevel)}`}>
                          RISK: {loc.riskLevel.toUpperCase()}
                        </span>
                      </div>

                      {/* Meteorological details */}
                      <div className="space-y-4">
                        <div className="flex items-end gap-3.5">
                          <div className="space-y-1">
                            <span className="text-[10px] text-neutral-500 font-mono uppercase block">Real-time Rain</span>
                            <div className="flex items-center gap-1.5">
                              {getWeatherIcon(loc.weatherCode, loc.precipitation)}
                              <span className="text-2xl font-mono font-extrabold text-white">
                                {loc.precipitation.toFixed(1)} <span className="text-xs font-light text-neutral-400 font-sans">mm/h</span>
                              </span>
                            </div>
                          </div>

                          <div className="h-8 w-px bg-neutral-800 shrink-0 self-center" />

                          <div className="space-y-1">
                            <span className="text-[10px] text-neutral-500 font-mono uppercase block">24h Forecast Rain</span>
                            <span className="text-2xl font-mono font-extrabold text-brand-gold-400">
                              {loc.forecast24hPrecipitation.toFixed(1)} <span className="text-xs font-light text-neutral-400 font-sans">mm</span>
                            </span>
                          </div>
                        </div>

                        {/* Additional Telemetry Accents */}
                        <div className="grid grid-cols-2 gap-2 bg-neutral-950/80 p-3 rounded-xl border border-neutral-800/40">
                          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                            <Wind className="w-3.5 h-3.5 text-neutral-500" />
                            <span>Wind: <strong className="text-neutral-300 font-mono">{loc.windSpeed.toFixed(0)} km/h</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                            <Thermometer className="w-3.5 h-3.5 text-neutral-500" />
                            <span>Temp: <strong className="text-neutral-300 font-mono">{loc.temp.toFixed(0)}°C</strong></span>
                          </div>
                        </div>

                        {/* Critical Warning Announcement block */}
                        <div className={`p-4 rounded-xl text-xs leading-relaxed font-sans border-l-4 ${
                          loc.riskLevel === 'Extreme' ? 'bg-red-950/15 border-red-500 text-red-300' :
                          loc.riskLevel === 'Severe' ? 'bg-amber-950/15 border-amber-500 text-amber-300' :
                          loc.riskLevel === 'Watch' ? 'bg-blue-950/15 border-blue-500 text-blue-300' :
                          'bg-neutral-950 border-neutral-600 text-neutral-400'
                        }`}>
                          <div className="flex gap-2 items-start">
                            {isRiskAlert ? (
                              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-inherit" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                            )}
                            <p>{loc.alertMessage}</p>
                          </div>
                        </div>
                      </div>

                      {/* Standby operational routing trigger link */}
                      <div className="pt-4 border-t border-neutral-800/80 mt-4 flex justify-between items-center text-[10px] text-neutral-500 font-mono">
                        <span>COORDINATES: {loc.lat}, {loc.lon}</span>
                        {isRiskAlert && (
                          <span className="text-brand-gold-400 flex items-center gap-0.5 font-bold uppercase animate-pulse">
                            ACTIVE WATCH
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Server Grounded AI Weather Advisory Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-neutral-900/20 border border-neutral-800 rounded-3xl p-6 sm:p-8">
                
                {/* Left side briefing text */}
                <div className="lg:col-span-8 text-left space-y-4">
                  <div className="inline-flex items-center gap-1.5 bg-brand-gold-500/10 text-brand-gold-400 border border-brand-gold-500/20 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider">
                    <Compass className="w-3.5 h-3.5 text-brand-gold-400 animate-spin" />
                    <span>Gemini AI Grounded Cyclone Analysis</span>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                    Seasonal Flood Prevention & Dewatering Protocol
                  </h3>

                  <div className="bg-neutral-950/80 border border-neutral-800/80 p-5 rounded-2xl text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed whitespace-pre-wrap">
                    {data.aiBriefing}
                  </div>

                  <p className="text-[10px] text-neutral-500 font-mono">
                    *Grounded analysis utilizes continuous web searches linking current Indian Meteorological Department (IMD) bulletins to ensure optimal tractor pump deployment layouts.
                  </p>
                </div>

                {/* Right side operational standby checklists */}
                <div className="lg:col-span-4 bg-neutral-950 border border-neutral-800/80 rounded-2xl p-5 sm:p-6 text-left space-y-4">
                  <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
                    <Activity className="w-4 h-4 text-brand-gold-400" />
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">
                      Standby Mobilization checklist
                    </span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "Prime trailer-mounted 400HP dewatering pumps", status: "Ready" },
                      { label: "Lubricating PTO shafts for agricultural tractors", status: "Verified" },
                      { label: "Double-braided PVC layout layflat hoses status check", status: "Completed" },
                      { label: "Emergency operators shift rotation docket setup", status: "On-Call" },
                      { label: "Liaison desks connected for quick WRD permits", status: "Active" }
                    ].map((chk, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b border-neutral-900 pb-2 last:border-0 last:pb-0">
                        <span className="text-neutral-400 flex items-center gap-2">
                          <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full shrink-0" />
                          {chk.label}
                        </span>
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900 px-1.5 py-0.5 rounded uppercase">
                          {chk.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-neutral-900 w-full" />

                  <div className="pt-2 text-center">
                    <p className="text-[10px] text-neutral-500 leading-tight">
                      Under severe flood warning, call regional dispatch hotline on VHF channels or standard emergency landlines directly.
                    </p>
                  </div>
                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
