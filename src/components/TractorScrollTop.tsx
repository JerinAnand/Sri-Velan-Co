import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

interface TractorScrollTopProps {
  /** Scroll threshold in px to reveal the tractor */
  threshold?: number;
  /** Optional custom CSS class */
  className?: string;
}

export const TractorScrollTop: React.FC<TractorScrollTopProps> = ({
  threshold = 260,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDriving, setIsDriving] = useState(false);
  const [driveProgress, setDriveProgress] = useState(0); // 0 (bottom) -> 1 (top of screen)
  const [isHovered, setIsHovered] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 800
  );

  const animationFrameRef = useRef<number | null>(null);
  const isDrivingRef = useRef(false);

  // Keep window height updated for dynamic upward travel
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Monitor scroll position with high-performance passive listener
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY || document.documentElement.scrollTop;

          // Only update visibility if not currently driving up
          if (!isDrivingRef.current) {
            setIsVisible(currentY > threshold);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [threshold]);

  /**
   * Realistic Heavy Machinery Incline Acceleration Curve:
   * 1. Steady low-gear torque engagement (0 -> 0.20): engine engages, front lifts slightly into the grade.
   * 2. Powerful sustained uphill momentum (0.20 -> 0.85): steady, gradual diesel pull up the slope.
   * 3. Gentle summit cresting (0.85 -> 1.0): controlled deceleration as it reaches the peak.
   */
  const realisticTractorEase = (t: number): number => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    // Smoother, more gradual quadratic-cubic curve suited for the extended climb duration
    return t < 0.25
      ? 1.6 * Math.pow(t, 2)
      : 1 - Math.pow(1 - t, 2.2) * 0.9;
  };

  // Upward Driving Sequence with Gradual, Controlled Pacing
  const handleDriveToTop = useCallback(() => {
    if (isDrivingRef.current) return;

    isDrivingRef.current = true;
    setIsDriving(true);

    const startScrollY = window.scrollY || document.documentElement.scrollTop;
    // Noticeably relaxed, gradual duration (~2.2s to 3.2s) - roughly double the previous speed
    const duration = Math.min(3200, Math.max(2200, Math.sqrt(startScrollY) * 58));
    const startTime = performance.now();

    const animateClimb = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const linearRatio = Math.min(1, elapsed / duration);
      const eased = realisticTractorEase(linearRatio);

      // Synchronize vehicle climb & page scroll
      setDriveProgress(eased);

      const targetScroll = startScrollY * (1 - eased);
      window.scrollTo(0, targetScroll);

      if (linearRatio < 1) {
        animationFrameRef.current = requestAnimationFrame(animateClimb);
      } else {
        // Summit reached: drive cleanly past the top of the viewport
        window.scrollTo(0, 0);
        setDriveProgress(1.15);

        // Gentle pause before resetting back to rest position
        setTimeout(() => {
          setIsVisible(false);
          setIsDriving(false);
          isDrivingRef.current = false;
          setDriveProgress(0);
        }, 500);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animateClimb);
  }, []);

  // Keyboard activation (Enter / Space)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDriveToTop();
    }
  };

  // Distance to top edge + driving offscreen (travel distance)
  const travelDistance = viewportHeight + 50;
  const currentTranslateY = -driveProgress * travelDistance;

  /**
   * Distinct Incline Orientation:
   * - Idle at rest: -48° (clearly tilted upward facing the top-right / top of screen, perched on an uphill slope).
   * - Hovered: -53° (nose lifts slightly higher in anticipation, ready to climb).
   * - Climbing: smoothly tilts to a steep -78° grade climb, pointing directly toward the summit.
   * - Summit cresting: gently levels to -68° as it reaches the top edge.
   */
  let currentRotation = isHovered ? -53 : -48;
  if (isDriving) {
    if (driveProgress < 0.2) {
      const t = driveProgress / 0.2;
      currentRotation = -48 + t * (-78 - -48);
    } else if (driveProgress < 0.85) {
      currentRotation = -78;
    } else {
      const t = (driveProgress - 0.85) / 0.15;
      currentRotation = -78 + t * 10; // gentle cresting angle toward level at summit
    }
  }

  return (
    <>
      {/* Scoped CSS Keyframes: Proportionally slowed down to match the gradual climb speed */}
      <style>{`
        /* Realistic Heavy Wheel Spin (Cadenced to the slower, gradual scroll pace) */
        @keyframes tractor-rear-spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes tractor-front-spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(490deg); }
        }

        /* Heavy Diesel Incline Suspension Rumble */
        @keyframes tractor-suspension-climb {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-1.5px) rotate(-1deg); }
          50% { transform: translateY(0.7px) rotate(0.8deg); }
          75% { transform: translateY(-0.9px) rotate(-0.5deg); }
        }

        /* Exhaust Flap (Rain Cap) Fluttering with Steady Diesel Pulses */
        @keyframes exhaust-flap-flutter-slow {
          0%, 100% { transform: rotate(36deg); }
          50% { transform: rotate(48deg); }
        }

        /* Diesel Exhaust Smoke Puffs (Paced for gradual, majestic climb) */
        @keyframes diesel-smoke-slow-1 {
          0% { transform: translate(0, 0) scale(0.35); opacity: 0.95; }
          50% { opacity: 0.8; }
          100% { transform: translate(-4px, 32px) scale(2.6); opacity: 0; }
        }

        @keyframes diesel-smoke-slow-2 {
          0% { transform: translate(0, 0) scale(0.28); opacity: 0.9; }
          60% { opacity: 0.7; }
          100% { transform: translate(-8px, 38px) scale(3.2); opacity: 0; }
        }

        @keyframes diesel-smoke-slow-3 {
          0% { transform: translate(0, 0) scale(0.22); opacity: 0.85; }
          70% { opacity: 0.6; }
          100% { transform: translate(-2px, 44px) scale(3.6); opacity: 0; }
        }

        /* Tire Soil / Dust Spray behind the rear drive tire */
        @keyframes tire-dirt-spray-slow {
          0% { transform: translate(0, 0) scale(0.4); opacity: 0.9; }
          100% { transform: translate(-6px, 24px) scale(1.6); opacity: 0; }
        }

        /* Steady Incline Idle Hover Vibration */
        @keyframes tractor-idle-thrum {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1.5px); }
        }

        .animate-tractor-rear {
          animation: tractor-rear-spin-slow 0.92s linear infinite;
        }

        .animate-tractor-front {
          animation: tractor-front-spin-slow 0.70s linear infinite;
        }

        .animate-tractor-suspension {
          animation: tractor-suspension-climb 0.42s ease-in-out infinite;
        }

        .animate-flap-open {
          animation: exhaust-flap-flutter-slow 0.30s ease-in-out infinite;
          transform-origin: 36px 14px;
        }

        .animate-diesel-1 {
          animation: diesel-smoke-slow-1 1.15s ease-out infinite;
        }

        .animate-diesel-2 {
          animation: diesel-smoke-slow-2 1.15s ease-out 0.38s infinite;
        }

        .animate-diesel-3 {
          animation: diesel-smoke-slow-3 1.15s ease-out 0.76s infinite;
        }

        .animate-dirt {
          animation: tire-dirt-spray-slow 0.75s ease-out infinite;
        }

        .animate-idle-thrum {
          animation: tractor-idle-thrum 2.2s ease-in-out infinite;
        }
      `}</style>

      {/* Floating Container: Pure Uphill Tractor Graphic with Zero Box Borders / Rails */}
      <div
        id="tractor-scroll-top-container"
        className={`fixed left-4 sm:left-6 bottom-6 z-40 select-none ${className}`}
      >
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 25 }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
              className="relative group"
            >
              {/* Tooltip on Hover: Sits to the right of the inclined tractor */}
              <div
                role="tooltip"
                id="tractor-scroll-tooltip"
                className={`absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200 ease-out whitespace-nowrap bg-brand-blue-950/95 backdrop-blur-md text-brand-gold-400 border border-brand-gold-500/30 text-xs font-display font-semibold px-3 py-1.5 rounded-xl shadow-2xl flex items-center gap-2 ${
                  isHovered && !isDriving
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-2'
                }`}
              >
                <span>Drive to top</span>
                <ArrowUp className="w-3.5 h-3.5 text-brand-gold-300 animate-bounce" />
              </div>

              {/*
                Pure Transparent Tractor Button:
                - No container box / border / background card
                - No floating "TOP" text badge
                - Tilted purposefully uphill at rest and steep climb when activated
              */}
              <button
                type="button"
                id="back-to-top-button"
                aria-label="Scroll to top of page"
                aria-describedby="tractor-scroll-tooltip"
                onClick={handleDriveToTop}
                onKeyDown={handleKeyDown}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                disabled={isDriving}
                className="relative bg-transparent border-none p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-blue-950 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
                style={{
                  transform: `translateY(${currentTranslateY}px)`,
                  transition: isDriving ? 'none' : 'transform 0.25s ease-out',
                }}
              >
                {/* Slanted Ground Shadow beneath the incline stance */}
                <div
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-14 h-3 bg-black/45 rounded-full blur-[3px] pointer-events-none transition-all duration-300 ${
                    isDriving
                      ? 'opacity-15 scale-75 rotate-[-25deg]'
                      : 'opacity-70 group-hover:opacity-90 rotate-[-18deg]'
                  }`}
                />

                {/* SVG Contractor Tractor Graphic */}
                <svg
                  viewBox="0 0 68 68"
                  className={`w-15 h-15 sm:w-17 sm:h-17 relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] overflow-visible ${
                    !isDriving ? 'animate-idle-thrum' : ''
                  }`}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Dynamic Orientation: Distinct uphill angle (-48° idle, -78° steep climb) */}
                  <g
                    transform={`rotate(${currentRotation} 34 34)`}
                    className="transition-transform duration-200"
                  >
                    {/* Headlight Beam Projecting Forward/Upward along Incline */}
                    {isDriving && (
                      <polygon
                        points="50,30 72,18 72,42 50,32"
                        fill="url(#headlight-beam-gradient)"
                        opacity="0.75"
                      />
                    )}

                    {/* Gradient Definitions */}
                    <defs>
                      <linearGradient id="headlight-beam-gradient" x1="50" y1="31" x2="72" y2="31" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="tractor-hood-gold" x1="30" y1="26" x2="50" y2="36" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="55%" stopColor="#e6b325" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                    </defs>

                    {/* Diesel Exhaust Smoke Puffs (Billowing behind stack downward along incline) */}
                    {isDriving && (
                      <g className="smoke-cluster">
                        <circle cx="38" cy="12" r="2.8" fill="#f1f5f9" fillOpacity="0.88" className="animate-diesel-1" />
                        <circle cx="36" cy="11" r="3.6" fill="#e2e8f0" fillOpacity="0.78" className="animate-diesel-2" />
                        <circle cx="34" cy="10" r="4.2" fill="#cbd5e1" fillOpacity="0.68" className="animate-diesel-3" />
                      </g>
                    )}

                    {/* Soil & Dust Particles Spraying Backward from Drive Tire */}
                    {isDriving && (
                      <g className="dirt-spray">
                        <circle cx="13" cy="43" r="1.6" fill="#78350f" fillOpacity="0.9" className="animate-dirt" />
                        <circle cx="10" cy="45" r="1.9" fill="#92400e" fillOpacity="0.8" className="animate-dirt" style={{ animationDelay: '0.35s' }} />
                      </g>
                    )}

                    {/* Tractor Chassis, Cabin, Hood & Exhaust Stack (Suspension bounce under power) */}
                    <g className={isDriving ? 'animate-tractor-suspension' : ''}>
                      {/* Rear Heavy Lugged Mudguard / Protective Fender */}
                      <path
                        d="M 12 37 A 12 12 0 0 1 33.5 36 L 33.5 38.5 A 10 10 0 0 0 14 38.5 Z"
                        fill="url(#tractor-hood-gold)"
                        stroke="#92400e"
                        strokeWidth="0.8"
                      />

                      {/* ROPS Cabin Heavy Roll-Cage Pillars */}
                      <line x1="16" y1="29" x2="18" y2="15" stroke="#0e2954" strokeWidth="2" strokeLinecap="round" />
                      <line x1="30" y1="29" x2="28" y2="15" stroke="#0e2954" strokeWidth="2" strokeLinecap="round" />
                      <line x1="17" y1="21.5" x2="29" y2="21.5" stroke="#0e2954" strokeWidth="1.3" />

                      {/* Cabin Protective Canopy Roof */}
                      <path
                        d="M 14 15 L 31 15 L 30 13 L 15 13 Z"
                        fill="#0e2954"
                        stroke="#e6b325"
                        strokeWidth="0.7"
                      />

                      {/* Tinted Safety Glass Windshield */}
                      <polygon
                        points="18.5,16 27.5,16 29.5,27.5 16.5,27.5"
                        fill="#38bdf8"
                        fillOpacity="0.45"
                        stroke="#bae6fd"
                        strokeWidth="0.5"
                      />
                      {/* Specular White Glare on Windshield */}
                      <line
                        x1="20"
                        y1="17"
                        x2="26"
                        y2="26.5"
                        stroke="#ffffff"
                        strokeWidth="1.1"
                        strokeOpacity="0.85"
                        strokeLinecap="round"
                      />

                      {/* Operator Seat Backrest */}
                      <rect x="19" y="23" width="3.6" height="7.8" rx="1.3" fill="#0f172a" />

                      {/* Steering Column & Wheel */}
                      <line x1="28" y1="23" x2="30" y2="25.5" stroke="#020617" strokeWidth="1.7" strokeLinecap="round" />
                      <line x1="29" y1="24.5" x2="31" y2="29" stroke="#334155" strokeWidth="1.2" />

                      {/* Main Engine Hood (Golden Chassis) */}
                      <path
                        d="M 30 27 L 49 29 L 49 36.5 L 30 36.5 Z"
                        fill="url(#tractor-hood-gold)"
                        stroke="#92400e"
                        strokeWidth="0.8"
                      />
                      {/* Hood Upper Highlight */}
                      <path d="M 30 27 L 49 29 L 48.5 30.5 L 30 28.5 Z" fill="#fde68a" />
                      {/* Sri Velan Corporate Navy Accent Stripe */}
                      <rect x="33" y="31" width="12.5" height="1.8" rx="0.5" fill="#0e2954" />

                      {/* Front Radiator Grille Cooling Slats */}
                      <line x1="47" y1="31" x2="47" y2="35.5" stroke="#78350f" strokeWidth="1.1" />
                      <line x1="45" y1="31" x2="45" y2="35.5" stroke="#78350f" strokeWidth="1.1" />

                      {/* Engine Transmission & Differential Lower Casting */}
                      <rect x="31" y="36.5" width="14" height="4.5" fill="#334155" stroke="#1e293b" strokeWidth="0.6" />

                      {/* Vertical Exhaust Stack with Muffler */}
                      <path
                        d="M 38 27 L 38 14.5"
                        fill="none"
                        stroke="#475569"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      {/* Muffler Expansion Canister */}
                      <rect x="37" y="18.5" width="2.3" height="5.2" rx="0.8" fill="#1e293b" />

                      {/* Hinged Rain Cap Flap (Flutters open under power) */}
                      <line
                        x1="38"
                        y1="14.5"
                        x2={isDriving ? '40.8' : '41.2'}
                        y2={isDriving ? '11.8' : '14'}
                        stroke="#94a3b8"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        className={isDriving ? 'animate-flap-open' : ''}
                      />

                      {/* High-Intensity Halogen Front Headlight */}
                      <path
                        d="M 49 29.5 L 50.8 30 L 50.8 32.5 L 49 33 Z"
                        fill="#fef08a"
                        stroke="#ca8a04"
                        strokeWidth="0.5"
                      />
                    </g>

                    {/* Rear Heavy Drive Tire (Centered at x=22, y=37) */}
                    <g transform="translate(22, 37)">
                      <g className={isDriving ? 'animate-tractor-rear' : ''} style={{ transformOrigin: '0 0' }}>
                        {/* Outer Heavy Pneumatic Rubber Tire */}
                        <circle cx="0" cy="0" r="10.5" fill="#1e293b" stroke="#0f172a" strokeWidth="1.2" />
                        {/* Deep Chevron Tread Lugs for Incline Grip */}
                        <circle cx="0" cy="0" r="9" fill="none" stroke="#0f172a" strokeWidth="3" strokeDasharray="3.2 3.8" />
                        {/* Steel Wheel Rim */}
                        <circle cx="0" cy="0" r="6.4" fill="#e6b325" stroke="#b45309" strokeWidth="0.8" />
                        {/* Heavy-Duty Rim Spokes */}
                        <line x1="-5.6" y1="0" x2="5.6" y2="0" stroke="#92400e" strokeWidth="1.3" strokeLinecap="round" />
                        <line x1="0" y1="-5.6" x2="0" y2="5.6" stroke="#92400e" strokeWidth="1.3" strokeLinecap="round" />
                        <line x1="-4" y1="-4" x2="4" y2="4" stroke="#92400e" strokeWidth="1.3" strokeLinecap="round" />
                        <line x1="-4" y1="4" x2="4" y2="-4" stroke="#92400e" strokeWidth="1.3" strokeLinecap="round" />
                        {/* Center Hub Cap */}
                        <circle cx="0" cy="0" r="2.8" fill="#0e2954" stroke="#e6b325" strokeWidth="0.8" />
                        <circle cx="0" cy="0" r="1.1" fill="#ffffff" />
                      </g>
                    </g>

                    {/* Front Steer Wheel (Smaller, Centered at x=46, y=40) */}
                    <g transform="translate(46, 40)">
                      <g className={isDriving ? 'animate-tractor-front' : ''} style={{ transformOrigin: '0 0' }}>
                        {/* Outer Tire */}
                        <circle cx="0" cy="0" r="6.4" fill="#1e293b" stroke="#0f172a" strokeWidth="0.9" />
                        {/* Tread Ribs */}
                        <circle cx="0" cy="0" r="5.5" fill="none" stroke="#0f172a" strokeWidth="2" strokeDasharray="2.5 2.5" />
                        {/* Steel Rim */}
                        <circle cx="0" cy="0" r="4.1" fill="#e6b325" stroke="#b45309" strokeWidth="0.7" />
                        {/* Rim Lugs */}
                        <line x1="-3.4" y1="0" x2="3.4" y2="0" stroke="#92400e" strokeWidth="1" strokeLinecap="round" />
                        <line x1="0" y1="-3.4" x2="0" y2="3.4" stroke="#92400e" strokeWidth="1" strokeLinecap="round" />
                        {/* Center Hub */}
                        <circle cx="0" cy="0" r="1.8" fill="#0e2954" />
                        <circle cx="0" cy="0" r="0.7" fill="#ffffff" />
                      </g>
                    </g>
                  </g>
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
