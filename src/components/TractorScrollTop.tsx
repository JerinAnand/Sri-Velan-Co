import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

interface TractorScrollTopProps {
  /** Scroll distance in pixels after which the button becomes visible */
  threshold?: number;
  /** Optional custom CSS class for positioning or styling overrides */
  className?: string;
}

export const TractorScrollTop: React.FC<TractorScrollTopProps> = ({
  threshold = 300,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDriving, setIsDriving] = useState(false);

  // Monitor scroll position with high-performance passive listener
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY || document.documentElement.scrollTop;
          setIsVisible(currentY > threshold);

          // If reached near top, cancel driving state
          if (currentY <= 15) {
            setIsDriving(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  // Safety fallback for driving animation: cancel when scroll reaches top or after timeout
  useEffect(() => {
    if (!isDriving) return;

    const checkScrollEnd = () => {
      const currentY = window.scrollY || document.documentElement.scrollTop;
      if (currentY <= 15) {
        setIsDriving(false);
      }
    };

    window.addEventListener('scroll', checkScrollEnd, { passive: true });
    const safetyTimer = setTimeout(() => {
      setIsDriving(false);
    }, 1600);

    return () => {
      window.removeEventListener('scroll', checkScrollEnd);
      clearTimeout(safetyTimer);
    };
  }, [isDriving]);

  // Smooth scroll trigger
  const handleScrollToTop = useCallback(() => {
    if (isDriving) return;
    setIsDriving(true);

    try {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } catch {
      // Fallback for older browsers
      window.scrollTo(0, 0);
      setIsDriving(false);
    }
  }, [isDriving]);

  // Keyboard accessibility: Enter or Space
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleScrollToTop();
    }
  };

  return (
    <>
      {/* Scoped CSS Keyframe Animations for Tractor Movement */}
      <style>{`
        @keyframes tractor-wheel-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes tractor-wheel-spin-fast {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(540deg); }
        }

        @keyframes tractor-chassis-rumble {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-1.4px) rotate(-1deg); }
          50% { transform: translateY(0.7px) rotate(0.8deg); }
          75% { transform: translateY(-0.9px) rotate(-0.5deg); }
        }

        @keyframes tractor-exhaust-smoke-1 {
          0% { transform: translate(0, 0) scale(0.3); opacity: 0.95; }
          40% { opacity: 0.8; }
          100% { transform: translate(-12px, 10px) scale(1.6); opacity: 0; }
        }

        @keyframes tractor-exhaust-smoke-2 {
          0% { transform: translate(0, 0) scale(0.25); opacity: 0.9; }
          50% { opacity: 0.75; }
          100% { transform: translate(-15px, 13px) scale(1.8); opacity: 0; }
        }

        @keyframes tractor-exhaust-smoke-3 {
          0% { transform: translate(0, 0) scale(0.2); opacity: 0.85; }
          60% { opacity: 0.65; }
          100% { transform: translate(-18px, 15px) scale(2); opacity: 0; }
        }

        @keyframes tractor-dust-puff {
          0% { transform: translate(0, 0) scale(0.3); opacity: 0.9; }
          100% { transform: translate(-9px, 5px) scale(1.4); opacity: 0; }
        }

        @keyframes tractor-road-track {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -24; }
        }

        .animate-tractor-wheel {
          animation: tractor-wheel-spin 0.5s linear infinite;
        }

        .animate-tractor-wheel-fast {
          animation: tractor-wheel-spin-fast 0.5s linear infinite;
        }

        .animate-tractor-rumble {
          animation: tractor-chassis-rumble 0.22s ease-in-out infinite;
        }

        .animate-smoke-1 {
          animation: tractor-exhaust-smoke-1 0.7s ease-out infinite;
        }

        .animate-smoke-2 {
          animation: tractor-exhaust-smoke-2 0.7s ease-out 0.22s infinite;
        }

        .animate-smoke-3 {
          animation: tractor-exhaust-smoke-3 0.7s ease-out 0.44s infinite;
        }

        .animate-dust {
          animation: tractor-dust-puff 0.45s ease-out infinite;
        }

        .animate-road {
          animation: tractor-road-track 0.4s linear infinite;
        }
      `}</style>

      {/* Fixed Positioning: Situated gracefully at the bottom-left corner across all pages */}
      <div
        id="tractor-scroll-top-container"
        className={`fixed bottom-6 left-6 z-40 ${className}`}
      >
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 15 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="relative group"
            >
              {/* Tooltip on Hover / Focus - positioned to the right of the button */}
              <div
                role="tooltip"
                id="tractor-scroll-tooltip"
                className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none transition-all duration-200 ease-out whitespace-nowrap bg-brand-blue-950/95 backdrop-blur-md text-brand-gold-400 border border-brand-gold-500/30 text-xs font-display font-semibold px-3 py-1.5 rounded-xl shadow-2xl flex items-center gap-2"
              >
                <span>{isDriving ? 'Climbing to top...' : 'Scroll to top'}</span>
                <ArrowUp className={`w-3.5 h-3.5 ${isDriving ? 'animate-bounce text-brand-gold-300' : ''}`} />
              </div>

              {/* Main Circular/Squircle Interactive Button */}
              <button
                type="button"
                id="back-to-top-button"
                aria-label="Scroll to top"
                aria-describedby="tractor-scroll-tooltip"
                onClick={handleScrollToTop}
                onKeyDown={handleKeyDown}
                className={`relative w-14 h-14 sm:w-15 sm:h-15 rounded-2xl flex items-center justify-center cursor-pointer select-none transition-all duration-300 overflow-hidden shadow-2xl focus:outline-none focus:ring-2 focus:ring-brand-gold-400 focus:ring-offset-2 focus:ring-offset-brand-blue-950 ${
                  isDriving
                    ? 'bg-gradient-to-br from-brand-blue-900 via-brand-blue-950 to-neutral-950 border-2 border-brand-gold-400 shadow-brand-gold-500/30 scale-105 ring-2 ring-brand-gold-500/50'
                    : 'bg-gradient-to-br from-brand-blue-900 via-brand-blue-950 to-neutral-950 border-2 border-brand-gold-500/40 hover:border-brand-gold-400 hover:scale-110 active:scale-95 text-brand-gold-400 hover:shadow-brand-gold-500/20'
                }`}
              >
                {/* Subtle Radial Glow in background */}
                <div
                  className={`absolute inset-0 bg-radial from-brand-gold-500/15 via-transparent to-transparent pointer-events-none transition-opacity duration-300 ${
                    isDriving ? 'opacity-100' : 'opacity-40 group-hover:opacity-80'
                  }`}
                />

                {/* Driving Speed Light Glow Streak */}
                {isDriving && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                    <div className="w-full h-full bg-gradient-to-t from-transparent via-brand-gold-400/10 to-transparent animate-pulse" />
                  </div>
                )}

                {/* SVG Tractor Illustration (Facing forward & tilted upward towards page top) */}
                <svg
                  viewBox="0 0 60 60"
                  className="w-11 h-11 sm:w-12 sm:h-12 relative z-10 drop-shadow-md"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Rotate entire tractor system by -26° so it drives up toward the top-right */}
                  <g transform="rotate(-26 30 30)">
                    
                    {/* Road / Ground Track Line underneath wheels */}
                    <line
                      x1="6"
                      y1="46.5"
                      x2="54"
                      y2="46.5"
                      stroke="#e6b325"
                      strokeOpacity="0.45"
                      strokeWidth="1.4"
                      strokeDasharray="4 3"
                      className={isDriving ? 'animate-road' : ''}
                    />

                    {/* Smoke Puffs billowing from Exhaust Pipe */}
                    {isDriving && (
                      <g className="smoke-cluster">
                        <circle cx="38" cy="14" r="2.2" fill="#ffffff" fillOpacity="0.85" className="animate-smoke-1" />
                        <circle cx="36" cy="13" r="3" fill="#fef08a" fillOpacity="0.8" className="animate-smoke-2" />
                        <circle cx="34" cy="12" r="3.6" fill="#cbd5e1" fillOpacity="0.7" className="animate-smoke-3" />
                      </g>
                    )}

                    {/* Dust Motes kicked backward by the big rear tire */}
                    {isDriving && (
                      <g className="dust-cluster">
                        <circle cx="11" cy="43.5" r="1.6" fill="#d97706" fillOpacity="0.85" className="animate-dust" />
                        <circle cx="8" cy="44.5" r="2.2" fill="#b45309" fillOpacity="0.75" className="animate-dust" style={{ animationDelay: '0.2s' }} />
                      </g>
                    )}

                    {/* Tractor Chassis, Body, Cabin & Exhaust (Bounces/wobbles while driving) */}
                    <g className={isDriving ? 'animate-tractor-rumble' : 'transition-transform duration-200 group-hover:-translate-y-0.5'}>
                      
                      {/* Rear Fender (Arched protective casing over big wheel) */}
                      <path
                        d="M 10 36 A 11 11 0 0 1 31 35 L 31 37 A 9 9 0 0 0 12 37 Z"
                        fill="#e6b325"
                        stroke="#b45309"
                        strokeWidth="0.8"
                      />

                      {/* ROPS Cabin Pillars & Roll Cage Frame */}
                      {/* Rear vertical post */}
                      <line x1="14" y1="28" x2="16" y2="15" stroke="#0e2954" strokeWidth="1.8" strokeLinecap="round" />
                      {/* Front windshield pillar */}
                      <line x1="28" y1="28" x2="26" y2="15" stroke="#0e2954" strokeWidth="1.8" strokeLinecap="round" />
                      {/* Structural cross member */}
                      <line x1="15" y1="21" x2="27" y2="21" stroke="#0e2954" strokeWidth="1.2" />

                      {/* Cabin Roof Canopy */}
                      <path
                        d="M 12 15 L 29 15 L 28 13 L 13 13 Z"
                        fill="#0e2954"
                        stroke="#e6b325"
                        strokeWidth="0.7"
                      />

                      {/* Cab Tinted Window Glass */}
                      <polygon
                        points="16.5,16 25.5,16 27.5,27 14.5,27"
                        fill="#38bdf8"
                        fillOpacity="0.45"
                        stroke="#bae6fd"
                        strokeWidth="0.5"
                      />
                      {/* Specular White Glare on Windshield */}
                      <line
                        x1="18"
                        y1="17"
                        x2="24"
                        y2="26"
                        stroke="#ffffff"
                        strokeWidth="1.1"
                        strokeOpacity="0.8"
                        strokeLinecap="round"
                      />

                      {/* Operator Seat Backrest */}
                      <rect x="17" y="23" width="3.2" height="7" rx="1.2" fill="#0f172a" />

                      {/* Steering Column & Steering Wheel */}
                      <line x1="26" y1="23" x2="28" y2="25.5" stroke="#020617" strokeWidth="1.6" strokeLinecap="round" />
                      <line x1="27" y1="24.5" x2="29" y2="28.5" stroke="#334155" strokeWidth="1.2" />

                      {/* Main Engine Hood (Industrial Gold body) */}
                      <path
                        d="M 28 27 L 46 29 L 46 36 L 28 36 Z"
                        fill="#e6b325"
                        stroke="#b45309"
                        strokeWidth="0.8"
                      />
                      {/* Hood Highlight Bevel Line */}
                      <path
                        d="M 28 27 L 46 29 L 45.5 30.5 L 28 28.5 Z"
                        fill="#f3ce6b"
                      />
                      {/* Corporate Striping / Badge on Hood */}
                      <rect x="31" y="31" width="11" height="1.8" rx="0.5" fill="#0e2954" />

                      {/* Front Engine Grille Slats */}
                      <line x1="44" y1="31" x2="44" y2="35" stroke="#78350f" strokeWidth="1" />
                      <line x1="42" y1="31" x2="42" y2="35" stroke="#78350f" strokeWidth="1" />

                      {/* Mechanical Engine Block Lower Section */}
                      <rect x="29" y="36" width="13" height="4" fill="#334155" stroke="#1e293b" strokeWidth="0.6" />

                      {/* Heavy Duty Exhaust Stack with Top Bend & Rain Cap */}
                      <path
                        d="M 36 27 L 36 15.5 L 38 14"
                        fill="none"
                        stroke="#475569"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      {/* Muffler Expansion Chamber */}
                      <rect x="35" y="19" width="2" height="5" rx="0.7" fill="#1e293b" />
                      {/* Rain cap hinged flap */}
                      <line x1="37" y1="13.8" x2="39.5" y2="12.8" stroke="#94a3b8" strokeWidth="0.9" strokeLinecap="round" />

                      {/* Front Headlight & Radiant Beam */}
                      <path
                        d="M 46 29.5 L 47.5 30 L 47.5 32 L 46 32.5 Z"
                        fill="#fef08a"
                        stroke="#ca8a04"
                        strokeWidth="0.5"
                      />
                      <polygon
                        points="47.5,30 55,27.5 55,34.5 47.5,32"
                        fill="#fef08a"
                        fillOpacity={isDriving ? 0.35 : 0.15}
                      />
                    </g>

                    {/* Rear Heavy-Duty Wheel (Centred at x=20, y=36) */}
                    <g transform="translate(20, 36)">
                      <g className={isDriving ? 'animate-tractor-wheel' : ''} style={{ transformOrigin: '0 0' }}>
                        {/* Outer Rugged Rubber Tire */}
                        <circle cx="0" cy="0" r="9.5" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
                        {/* Deep Tread Lugs (Dashed ring) */}
                        <circle cx="0" cy="0" r="8.2" fill="none" stroke="#0f172a" strokeWidth="2.6" strokeDasharray="3 3.5" />
                        {/* Industrial Golden Rim */}
                        <circle cx="0" cy="0" r="6" fill="#e6b325" stroke="#b45309" strokeWidth="0.8" />
                        {/* Wheel Rim Spoke Cleats */}
                        <line x1="-5.2" y1="0" x2="5.2" y2="0" stroke="#92400e" strokeWidth="1.2" strokeLinecap="round" />
                        <line x1="0" y1="-5.2" x2="0" y2="5.2" stroke="#92400e" strokeWidth="1.2" strokeLinecap="round" />
                        <line x1="-3.6" y1="-3.6" x2="3.6" y2="3.6" stroke="#92400e" strokeWidth="1" strokeLinecap="round" />
                        <line x1="-3.6" y1="3.6" x2="3.6" y2="-3.6" stroke="#92400e" strokeWidth="1" strokeLinecap="round" />
                        {/* Navy Center Hub with Central Bolt */}
                        <circle cx="0" cy="0" r="2.6" fill="#0e2954" stroke="#e6b325" strokeWidth="0.8" />
                        <circle cx="0" cy="0" r="1" fill="#ffffff" />
                      </g>
                    </g>

                    {/* Front Smaller Wheel (Centred at x=43, y=39) */}
                    <g transform="translate(43, 39)">
                      <g className={isDriving ? 'animate-tractor-wheel-fast' : ''} style={{ transformOrigin: '0 0' }}>
                        {/* Front Rubber Tire */}
                        <circle cx="0" cy="0" r="6" fill="#1e293b" stroke="#0f172a" strokeWidth="0.8" />
                        {/* Front Tread Notch Ring */}
                        <circle cx="0" cy="0" r="5.2" fill="none" stroke="#0f172a" strokeWidth="1.8" strokeDasharray="2.5 2.5" />
                        {/* Front Rim */}
                        <circle cx="0" cy="0" r="3.8" fill="#e6b325" stroke="#b45309" strokeWidth="0.7" />
                        {/* Front Spokes */}
                        <line x1="-3.2" y1="0" x2="3.2" y2="0" stroke="#92400e" strokeWidth="1" strokeLinecap="round" />
                        <line x1="0" y1="-3.2" x2="0" y2="3.2" stroke="#92400e" strokeWidth="1" strokeLinecap="round" />
                        {/* Hub */}
                        <circle cx="0" cy="0" r="1.6" fill="#0e2954" />
                        <circle cx="0" cy="0" r="0.6" fill="#ffffff" />
                      </g>
                    </g>

                  </g>
                </svg>

                {/* Sleek Upward Indicator Pill at Bottom of Button */}
                <div className="absolute bottom-1 flex items-center justify-center pointer-events-none">
                  <span className="font-mono text-[9px] tracking-wider uppercase font-bold text-brand-gold-400/90 leading-none">
                    TOP
                  </span>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
