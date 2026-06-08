/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLoading } from '../context/LoadingContext';
import { COMPANY_DETAILS } from '../data';
import { ShieldCheck, HardHat, Hammer, PenTool, Settings, Building2, Lightbulb } from 'lucide-react';

export const BrandedLoader: React.FC = () => {
  const { isBootLoading, isActionLoading, loadingProgress, loadingMessage } = useLoading();
  const [shouldRender, setShouldRender] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check user accessibility preference for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Sync rendering with the active state of loading
  useEffect(() => {
    if (isBootLoading || isActionLoading) {
      setShouldRender(true);
    } else {
      // Small delay matching the transition out to prevent premature unmounting
      const timer = setTimeout(() => setShouldRender(false), 900);
      return () => clearTimeout(timer);
    }
  }, [isBootLoading, isActionLoading]);

  if (!shouldRender) return null;

  // Render upward-drifting amber hot sparks representing industrial steel-works & heavy-duty engineering
  const renderParticles = () => {
    if (reducedMotion) return null;
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(18)].map((_, i) => {
          const delay = i * 0.4;
          const duration = 3 + Math.random() * 4;
          const left = 5 + Math.random() * 90;
          const size = 1 + Math.random() * 3.5;
          return (
            <div
              key={i}
              className="absolute bg-brand-gold-400/60 rounded-full animate-bubble"
              style={{
                left: `${left}%`,
                bottom: `-20px`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                filter: 'blur(0.5px)',
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {(isBootLoading || isActionLoading) && (
        <motion.div
          id="branded-full-screen-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeInOut' }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-[#030c1b] select-none overflow-hidden"
        >
          {/* Moving Architectural Blueprint Grid Lines Pattern */}
          <div className="absolute inset-0 grid-overlay opacity-35 pointer-events-none z-0 bg-radial-[at_50%_40%] from-[#0d2a54] via-[#030a17] to-[#02050b]" />

          {/* Golden Ambient Slow Shifting Light Halo Backgrounds */}
          <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] bg-brand-blue-700/20 rounded-full blur-[140px] pointer-events-none animate-pulse duration-[8s]" />
          <div className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] bg-brand-gold-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[10s]" />

          {/* Construction Blueprint Geometric Outlines Drawing Background */}
          {!reducedMotion && (
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none z-0 flex items-end justify-center">
              <svg className="w-full max-w-7xl h-[45vh] stroke-brand-blue-100 fill-none stroke-[0.5]" viewBox="0 0 1200 400" xmlns="http://www.w3.org/2000/svg">
                {/* Horizontal blueprint ground axes */}
                <line x1="0" y1="380" x2="1200" y2="380" />
                <line x1="0" y1="320" x2="1200" y2="320" strokeDasharray="5,5" />
                {/* Vertical grid lines */}
                {[...Array(13)].map((_, i) => (
                  <line key={i} x1={i * 100} y1="0" x2={i * 100} y2="400" />
                ))}
                {/* Simulated tower crane outlines */}
                <path d="M 150,380 L 150,80 L 450,80 M 150,95 L 350,95 M 150,130 L 190,80 M 110,380 L 190,380" strokeDasharray="3,3" />
                {/* Structural rising scaffold outlines */}
                <rect x="850" y="120" width="220" height="260" strokeDasharray="4,4" />
                <line x1="850" y1="380" x2="1070" y2="120" />
                <line x1="1070" y1="380" x2="850" y2="120" />
                <line x1="850" y1="250" x2="1070" y2="250" />
              </svg>
            </div>
          )}

          {/* Spark Particles */}
          {renderParticles()}

          {/* Main Visual Frosted Glass Container Card */}
          <div className="relative z-10 w-full max-w-[540px] px-6 sm:px-8 mx-auto text-center space-y-8">
            <motion.div
              initial={reducedMotion ? { opacity: 1 } : { scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { scale: 0.95, y: -15 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="bg-brand-blue-950/75 border border-white/10 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-3xl flex flex-col items-center space-y-6 relative overflow-hidden group"
            >
              {/* Card Golden Light Sweep Glow */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent opacity-80" />
              
              {/* Cinematic Company Logo - SVG Animated Vector Symbol */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* SVG Animated Blueprints Circle Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="44"
                    stroke="#e6b325"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: '0 280' }}
                    animate={{ strokeDasharray: `${(loadingProgress / 100) * 276} 280` }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  />
                </svg>

                {/* Concentric subtle rotating gear compass */}
                <div className={`absolute w-[74px] h-[74px] border border-dashed border-brand-gold-500/20 rounded-full ${reducedMotion ? '' : 'animate-spin-slow'}`} />

                {/* Main Logo Symbol: Interlocking "SV" Gold Monogram styled as pre-stressed architectural beams */}
                <motion.div
                  initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="relative z-10 w-20 h-20 flex items-center justify-center p-2 bg-gradient-to-b from-[#0e2954] to-[#041228] border border-brand-gold-500/50 rounded-2xl shadow-lg shadow-black/40 group-hover:border-brand-gold-400 transition-all duration-300 overflow-hidden"
                >
                  <motion.img
                    src="/sri-velan-logo.png"
                    alt="Sri Velan Company Logo"
                    className="w-14 h-14 object-contain filter drop-shadow-[0_0_8px_rgba(230,179,37,0.4)]"
                    referrerPolicy="no-referrer"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ 
                      opacity: loadingProgress > 25 ? Math.min(1, (loadingProgress - 25) / 50) : 0, 
                      scale: loadingProgress > 25 ? 0.7 + (Math.min(1, (loadingProgress - 25) / 50) * 0.3) : 0.7 
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />

                  {/* SVG Tracing Overlay paths - drawing live during loading sequence */}
                  <svg className="absolute inset-0 w-full h-full p-2 pointer-events-none" viewBox="0 0 100 100" fill="none">
                    {/* Tracing Outer Symmetrical Chevron Wings */}
                    <motion.path
                      d="M 18,44 L 32,44 L 50,78 L 68,44 L 82,44 L 64,58 L 50,86 L 36,58 Z"
                      stroke="#e6b325"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0.85 }}
                      animate={{ 
                        pathLength: loadingProgress / 100, 
                        opacity: loadingProgress < 100 ? 0.85 : 0 
                      }}
                      transition={{ ease: "easeOut", duration: 0.1 }}
                    />
                    {/* Tracing Central Flowing Elegancy S-Curve */}
                    <motion.path
                      d="M 50,15 C 64,15 62,32 50,42 C 38,52 38,68 50,68 C 62,68 64,52 50,42"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0.95 }}
                      animate={{ 
                        pathLength: loadingProgress / 100, 
                        opacity: loadingProgress < 100 ? 0.95 : 0 
                      }}
                      transition={{ ease: "easeOut", duration: 0.1 }}
                    />
                  </svg>
                </motion.div>

                {/* Floating micro indicators (Small nodes blinking in corners of grid) */}
                {!reducedMotion && (
                  <>
                    <span className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
                    <span className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-brand-gold-500 animate-ping opacity-60" style={{ animationDelay: '0.5s' }} />
                  </>
                )}
              </div>

              {/* Title & Tagline Branding Header Block */}
              <div className="space-y-2">
                <motion.h1
                  initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-display font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-wider leading-none"
                >
                  {COMPANY_DETAILS.name}
                </motion.h1>
                <motion.p
                  initial={reducedMotion ? {} : { opacity: 0 }}
                  animate={{ opacity: 0.8, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-brand-gold-400 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-medium leading-none"
                >
                  {COMPANY_DETAILS.tagline}
                </motion.p>
              </div>

              {/* Blueprint Information Grid Stats - Showing Year, Class, Scope */}
              <motion.div
                initial={reducedMotion ? {} : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 gap-2 w-full border-y border-white/5 py-4 my-2 text-left"
              >
                <div>
                  <p className="text-[9px] font-mono text-[#737373] uppercase tracking-wider leading-none">Estb Date</p>
                  <p className="font-display text-sm font-bold text-neutral-200 mt-1.5">2006 (IND)</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-mono text-[#737373] uppercase tracking-wider leading-none">Accreditation</p>
                  <p className="font-display text-sm font-bold text-neutral-200 mt-1.5">PWD & WRD</p>
                </div>
              </motion.div>

              {/* Progress HUD with interactive progress tracker & ticker message */}
              <div className="w-full space-y-3.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  {/* Status blinking dot indicator */}
                  <span className="text-neutral-400 uppercase tracking-wide inline-flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold-500"></span>
                    </span>
                    <span>System Boot Sequence</span>
                  </span>
                  
                  {/* Percentage Counter Indicator */}
                  <motion.span
                    key={loadingProgress}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    className="text-brand-gold-400 font-bold tabular-nums"
                  >
                    {loadingProgress}%
                  </motion.span>
                </div>

                {/* Progress bar tracks with sleek inner shimmer gradients */}
                <div className="w-full h-2 bg-neutral-900/80 rounded-full overflow-hidden border border-white/5 relative p-[1px]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ ease: 'easeOut', duration: 0.15 }}
                    className="h-full rounded-full bg-gradient-to-r from-brand-blue-600 via-brand-gold-500 to-brand-gold-400 shadow-md relative"
                  >
                    {/* Inner high-speed light sweep gradient */}
                    {!reducedMotion && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                    )}
                  </motion.div>
                </div>

                {/* Typing status loader terminal texts */}
                <div className="min-h-[30px] flex items-center justify-center px-2">
                  <motion.p
                    key={loadingMessage}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 0.85, y: 0 }}
                    className="text-neutral-300 font-mono text-[9.5px] uppercase tracking-wider text-center leading-relaxed"
                  >
                    {loadingMessage}
                  </motion.p>
                </div>
              </div>
            </motion.div>

            {/* Subtle Security Footnote Display */}
            <motion.p
              initial={reducedMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 0.45 }}
              transition={{ delay: 0.6 }}
              className="text-[10px] text-neutral-400 font-mono uppercase tracking-[0.16em] leading-normal"
            >
              Sri Velan & Co · Engineering Integrity & Secure Logistics Vetted
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
