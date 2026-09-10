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
  const [isFocused, setIsFocused] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 800
  );

  const animationFrameRef = useRef<number | null>(null);
  const isDrivingRef = useRef(false);

  // Engine start interaction is active on hover or keyboard focus (when not already driving)
  const isEngaged = (isHovered || isFocused) && !isDriving;

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
   * Realistic Heavy Machinery Vertical Acceleration Curve:
   * 1. Low-gear torque engagement (0 -> 0.18): engine spools up, tires bite.
   * 2. Powerful vertical climb momentum (0.18 -> 0.88): steady, controlled ascent.
   * 3. Summit deceleration (0.88 -> 1.0): smooth ease-out at the crest.
   */
  const realisticTractorEase = (t: number): number => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return t < 0.22
      ? 1.8 * Math.pow(t, 2)
      : 1 - Math.pow(1 - t, 2.3) * 0.92;
  };

  // Upward Driving Sequence with Gradual, Controlled Pacing (~2.2s to 3.2s)
  const handleDriveToTop = useCallback(() => {
    if (isDrivingRef.current) return;

    isDrivingRef.current = true;
    setIsDriving(true);

    const startScrollY = window.scrollY || document.documentElement.scrollTop;
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
   * Strictly 90-Degree Vertical Orientation:
   * Body axis stays locked at exactly 90 degrees (pointing straight up)
   * in both idle and climbing states with zero diagonal lean.
   */
  const currentRotation = 90;

  return (
    <>
      {/* Scoped CSS Keyframes: Slower mechanical cadence + subtle idle engine vibration */}
      <style>{`
        /* Full Driving Differential Wheel Spin (Climbing Speed) */
        @keyframes tractor-rear-spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes tractor-front-spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(490deg); }
        }

        /* Gentle Idle Wheel Creep (Hover/Focus - ~4x slower than driving) */
        @keyframes tractor-rear-spin-idle {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes tractor-front-spin-idle {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(490deg); }
        }

        /* Heavy Diesel Incline Suspension Rumble (Climbing under heavy load) */
        @keyframes tractor-suspension-climb {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(1.3px); }
        }

        /* Subtle Engine Start Chassis Jitter (Hover/Focus - Fast, Low-Amplitude Diesel Vibration) */
        @keyframes tractor-engine-idle-jitter {
          0%, 100% { transform: translate(0px, 0px); }
          20% { transform: translate(0.35px, -0.25px); }
          40% { transform: translate(-0.3px, 0.25px); }
          60% { transform: translate(0.25px, 0.2px); }
          80% { transform: translate(-0.25px, -0.3px); }
        }

        /* Exhaust Flap (Rain Cap) - Fluttering Open Under Full Power */
        @keyframes exhaust-flap-flutter-climb {
          0%, 100% { transform: rotate(-24deg); }
          50% { transform: rotate(-40deg); }
        }

        /* Exhaust Flap (Rain Cap) - Delicate Engine Idle Chatter */
        @keyframes exhaust-flap-flutter-idle {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(-16deg); }
        }

        /* Heavy Diesel Exhaust Smoke Puffs (Full Climb) */
        @keyframes diesel-smoke-climb-1 {
          0% { transform: translate(0, 0) scale(0.35); opacity: 0.95; }
          50% { opacity: 0.8; }
          100% { transform: translate(32px, 0px) scale(2.6); opacity: 0; }
        }

        @keyframes diesel-smoke-climb-2 {
          0% { transform: translate(0, 0) scale(0.28); opacity: 0.9; }
          60% { opacity: 0.7; }
          100% { transform: translate(38px, 1px) scale(3.2); opacity: 0; }
        }

        @keyframes diesel-smoke-climb-3 {
          0% { transform: translate(0, 0) scale(0.22); opacity: 0.85; }
          70% { opacity: 0.6; }
          100% { transform: translate(44px, -1px) scale(3.6); opacity: 0; }
        }

        /* Faint Engine Idle Exhaust Puff (Hover/Focus - Subtle Wisps Drifting Backward) */
        @keyframes diesel-smoke-idle-wisp-1 {
          0% { transform: translate(0, 0) scale(0.3); opacity: 0.7; }
          50% { opacity: 0.45; }
          100% { transform: translate(16px, 0px) scale(1.5); opacity: 0; }
        }

        @keyframes diesel-smoke-idle-wisp-2 {
          0% { transform: translate(0, 0) scale(0.25); opacity: 0.65; }
          60% { opacity: 0.35; }
          100% { transform: translate(22px, 0.5px) scale(1.8); opacity: 0; }
        }

        /* Tire Soil / Dust Spray straight down from the bottom rear drive tire */
        @keyframes tire-dirt-vertical {
          0% { transform: translate(0, 0) scale(0.4); opacity: 0.9; }
          100% { transform: translate(24px, 0px) scale(1.6); opacity: 0; }
        }

        /* Gentle Resting Float */
        @keyframes tractor-resting-thrum {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1.5px); }
        }

        /* Animation classes */
        .animate-wheel-drive-rear {
          animation: tractor-rear-spin-slow 0.92s linear infinite;
        }

        .animate-wheel-drive-front {
          animation: tractor-front-spin-slow 0.70s linear infinite;
        }

        .animate-wheel-idle-rear {
          animation: tractor-rear-spin-idle 3.8s linear infinite;
        }

        .animate-wheel-idle-front {
          animation: tractor-front-spin-idle 2.8s linear infinite;
        }

        .animate-chassis-climb {
          animation: tractor-suspension-climb 0.42s ease-in-out infinite;
        }

        .animate-chassis-idle {
          animation: tractor-engine-idle-jitter 0.09s ease-in-out infinite;
        }

        .animate-flap-climb {
          animation: exhaust-flap-flutter-climb 0.30s ease-in-out infinite;
          transform-origin: 30px 14.5px;
        }

        .animate-flap-idle {
          animation: exhaust-flap-flutter-idle 0.16s ease-in-out infinite;
          transform-origin: 30px 14.5px;
        }

        .animate-diesel-1 {
          animation: diesel-smoke-climb-1 1.15s ease-out infinite;
        }

        .animate-diesel-2 {
          animation: diesel-smoke-climb-2 1.15s ease-out 0.38s infinite;
        }

        .animate-diesel-3 {
          animation: diesel-smoke-climb-3 1.15s ease-out 0.76s infinite;
        }

        .animate-idle-wisp-1 {
          animation: diesel-smoke-idle-wisp-1 1.5s ease-out infinite;
        }

        .animate-idle-wisp-2 {
          animation: diesel-smoke-idle-wisp-2 1.5s ease-out 0.75s infinite;
        }

        .animate-dirt {
          animation: tire-dirt-vertical 0.75s ease-out infinite;
        }

        .animate-resting-thrum {
          animation: tractor-resting-thrum 2.2s ease-in-out infinite;
        }
      `}</style>

      {/* Floating Container: Perfectly Vertical Tractor with Zero Box Borders / Rails */}
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
              {/* Tooltip on Hover / Focus */}
              <div
                role="tooltip"
                id="tractor-scroll-tooltip"
                className={`absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200 ease-out whitespace-nowrap bg-brand-blue-950/95 backdrop-blur-md text-brand-gold-400 border border-brand-gold-500/30 text-xs font-display font-semibold px-3 py-1.5 rounded-xl shadow-2xl flex items-center gap-2 ${
                  isEngaged
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-2'
                }`}
              >
                <span>Drive to top</span>
                <ArrowUp className="w-3.5 h-3.5 text-brand-gold-300 animate-bounce" />
              </div>

              {/*
                Pure Transparent Tractor Button:
                - Accessible via Mouse (hover) and Keyboard (focus)
                - Perfectly parallel to the vertical edge of the screen (90° body axis)
                - Triggers realistic diesel engine start on hover/focus
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
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onTouchStart={() => setIsHovered(true)}
                onTouchEnd={() => setIsHovered(false)}
                onTouchCancel={() => setIsHovered(false)}
                disabled={isDriving}
                className="relative bg-transparent border-none p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-blue-950 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
                style={{
                  transform: `translateY(${currentTranslateY}px)`,
                  transition: isDriving ? 'none' : 'transform 0.25s ease-out',
                }}
              >
                {/* Clean Horizontal Contact Shadow directly beneath vertical tractor (no tilt) */}
                <div
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-2.5 bg-black/45 rounded-full blur-[2.5px] pointer-events-none transition-all duration-300 ${
                    isDriving
                      ? 'opacity-15 scale-75'
                      : isEngaged
                      ? 'opacity-85 scale-100'
                      : 'opacity-65 group-hover:opacity-85'
                  }`}
                />

                {/* SVG Contractor Tractor Graphic (Strictly Vertical at 90°) */}
                <svg
                  viewBox="0 0 68 68"
                  className={`w-15 h-15 sm:w-17 sm:h-17 relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] overflow-visible ${
                    !isDriving && !isEngaged ? 'animate-resting-thrum' : ''
                  }`}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Exactly 90-degree body axis: Perfectly parallel to vertical edge */}
                  <g
                    transform={`rotate(${currentRotation} 34 34)`}
                    className="transition-transform duration-200"
                  >
                    {/* Headlight Beam: Full high-power projection while climbing */}
                    {isDriving && (
                      <polygon
                        points="18,30 -6,18 -6,44 18,32"
                        fill="url(#headlight-beam-gradient)"
                        opacity="0.85"
                      />
                    )}

                    {/* Headlight Idle Spill: Gentle warm forward glow cone when engine starts (Hover/Focus) */}
                    <polygon
                      points="17.2,30.5 4,24 4,38.5 17.2,32"
                      fill="url(#headlight-idle-spill)"
                      className="transition-opacity duration-300 pointer-events-none"
                      opacity={isEngaged ? 0.6 : 0}
                    />

                    {/* Gradient Definitions */}
                    <defs>
                      {/* Full Driving Beam Gradient */}
                      <linearGradient id="headlight-beam-gradient" x1="18" y1="31" x2="-6" y2="31" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#fef08a" stopOpacity="0.88" />
                        <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                      </linearGradient>

                      {/* Engine Start Idle Light Spill Gradient */}
                      <linearGradient id="headlight-idle-spill" x1="17.2" y1="31.25" x2="4" y2="31.25" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#fef08a" stopOpacity="0.75" />
                        <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                      </linearGradient>

                      {/* Soft Radial Glow Halo around the Headlight Lens */}
                      <radialGradient id="headlight-lens-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                        <stop offset="45%" stopColor="#fef08a" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                      </radialGradient>

                      {/* Tractor Gold Body Paint */}
                      <linearGradient id="tractor-hood-gold" x1="38" y1="26" x2="18" y2="36" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="55%" stopColor="#e6b325" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                    </defs>

                    {/* Diesel Exhaust Smoke Puffs (Full Heavy Smoke Under Load while Climbing) */}
                    {isDriving && (
                      <g className="smoke-cluster">
                        <circle cx="30" cy="12" r="2.8" fill="#f1f5f9" fillOpacity="0.88" className="animate-diesel-1" />
                        <circle cx="32" cy="11" r="3.6" fill="#e2e8f0" fillOpacity="0.78" className="animate-diesel-2" />
                        <circle cx="34" cy="10" r="4.2" fill="#cbd5e1" fillOpacity="0.68" className="animate-diesel-3" />
                      </g>
                    )}

                    {/* Faint Diesel Exhaust Idle Puffs (Subtle Wisps while Hovered/Focused) */}
                    {isEngaged && (
                      <g className="idle-smoke-cluster transition-opacity duration-300">
                        <circle cx="30" cy="13" r="1.6" fill="#f8fafc" fillOpacity="0.75" className="animate-idle-wisp-1" />
                        <circle cx="31" cy="12.5" r="2.2" fill="#e2e8f0" fillOpacity="0.6" className="animate-idle-wisp-2" />
                      </g>
                    )}

                    {/* Soil & Dust Particles Spraying Straight Down from Bottom Rear Drive Tire */}
                    {isDriving && (
                      <g className="dirt-spray">
                        <circle cx="55" cy="43" r="1.6" fill="#78350f" fillOpacity="0.9" className="animate-dirt" />
                        <circle cx="58" cy="45" r="1.9" fill="#92400e" fillOpacity="0.8" className="animate-dirt" style={{ animationDelay: '0.35s' }} />
                      </g>
                    )}

                    {/*
                      Tractor Chassis, Cabin, Hood & Stack:
                      - Climbing under load: .animate-chassis-climb (heavy vertical suspension rumble)
                      - Hovered/Focused: .animate-chassis-idle (rapid, low-amplitude engine jitter)
                      - Resting: clean steady rest
                    */}
                    <g
                      className={
                        isDriving
                          ? 'animate-chassis-climb'
                          : isEngaged
                          ? 'animate-chassis-idle'
                          : ''
                      }
                    >
                      {/* Rear Heavy Lugged Fender / Mudguard (Mirrored to right side) */}
                      <path
                        d="M 56 37 A 12 12 0 0 0 34.5 36 L 34.5 38.5 A 10 10 0 0 1 54 38.5 Z"
                        fill="url(#tractor-hood-gold)"
                        stroke="#92400e"
                        strokeWidth="0.8"
                      />

                      {/* ROPS Cabin Heavy Roll-Cage Pillars */}
                      <line x1="52" y1="29" x2="50" y2="15" stroke="#0e2954" strokeWidth="2" strokeLinecap="round" />
                      <line x1="38" y1="29" x2="40" y2="15" stroke="#0e2954" strokeWidth="2" strokeLinecap="round" />
                      <line x1="51" y1="21.5" x2="39" y2="21.5" stroke="#0e2954" strokeWidth="1.3" />

                      {/* Cabin Protective Canopy Roof */}
                      <path
                        d="M 54 15 L 37 15 L 38 13 L 53 13 Z"
                        fill="#0e2954"
                        stroke="#e6b325"
                        strokeWidth="0.7"
                      />

                      {/* Tinted Safety Glass Windshield */}
                      <polygon
                        points="49.5,16 40.5,16 38.5,27.5 51.5,27.5"
                        fill="#38bdf8"
                        fillOpacity="0.45"
                        stroke="#bae6fd"
                        strokeWidth="0.5"
                      />
                      {/* Specular White Glare on Windshield */}
                      <line
                        x1="48"
                        y1="17"
                        x2="42"
                        y2="26.5"
                        stroke="#ffffff"
                        strokeWidth="1.1"
                        strokeOpacity="0.85"
                        strokeLinecap="round"
                      />

                      {/* Operator Seat Backrest */}
                      <rect x="45.4" y="23" width="3.6" height="7.8" rx="1.3" fill="#0f172a" />

                      {/* Steering Column & Wheel */}
                      <line x1="40" y1="23" x2="38" y2="25.5" stroke="#020617" strokeWidth="1.7" strokeLinecap="round" />
                      <line x1="39" y1="24.5" x2="37" y2="29" stroke="#334155" strokeWidth="1.2" />

                      {/* Main Engine Hood (Golden Chassis, mirrored facing left) */}
                      <path
                        d="M 38 27 L 19 29 L 19 36.5 L 38 36.5 Z"
                        fill="url(#tractor-hood-gold)"
                        stroke="#92400e"
                        strokeWidth="0.8"
                      />
                      {/* Hood Upper Highlight */}
                      <path d="M 38 27 L 19 29 L 19.5 30.5 L 38 28.5 Z" fill="#fde68a" />
                      {/* Sri Velan Corporate Navy Accent Stripe */}
                      <rect x="22.5" y="31" width="12.5" height="1.8" rx="0.5" fill="#0e2954" />

                      {/* Front Radiator Grille Cooling Slats */}
                      <line x1="21" y1="31" x2="21" y2="35.5" stroke="#78350f" strokeWidth="1.1" />
                      <line x1="23" y1="31" x2="23" y2="35.5" stroke="#78350f" strokeWidth="1.1" />

                      {/* Engine Transmission & Differential Lower Casting */}
                      <rect x="23" y="36.5" width="14" height="4.5" fill="#334155" stroke="#1e293b" strokeWidth="0.6" />

                      {/* Vertical Exhaust Stack with Muffler */}
                      <path
                        d="M 30 27 L 30 14.5"
                        fill="none"
                        stroke="#475569"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      {/* Muffler Expansion Canister */}
                      <rect x="28.7" y="18.5" width="2.3" height="5.2" rx="0.8" fill="#1e293b" />

                      {/*
                        Hinged Rain Cap Flap:
                        - Full climb: .animate-flap-climb (flutters open under high diesel boost)
                        - Hovered/Focused: .animate-flap-idle (gentle idle chatter)
                        - Rest: resting closed
                      */}
                      <line
                        x1="30"
                        y1="14.5"
                        x2={isDriving ? '27.2' : isEngaged ? '28.0' : '26.8'}
                        y2={isDriving ? '11.8' : isEngaged ? '13.2' : '14'}
                        stroke="#94a3b8"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        className={
                          isDriving
                            ? 'animate-flap-climb'
                            : isEngaged
                            ? 'animate-flap-idle'
                            : ''
                        }
                      />

                      {/*
                        Interactive Headlight:
                        - Idle/Rest: Dim off-amber (#a16207 at 45% opacity)
                        - Hover/Focus (Engine Start) & Climbing: Bright luminous yellow (#ffffff / #fef08a)
                          with glowing halo transition
                      */}
                      {/* Soft radial glow halo around lens on hover/focus/climb */}
                      <circle
                        cx="18"
                        cy="31.25"
                        r="3.8"
                        fill="url(#headlight-lens-glow)"
                        className="transition-opacity duration-300 pointer-events-none"
                        opacity={isDriving ? 1 : isEngaged ? 0.9 : 0}
                      />

                      {/* Headlight Lens */}
                      <path
                        d="M 19 29.5 L 17.2 30 L 17.2 32.5 L 19 33 Z"
                        fill={isDriving || isEngaged ? '#ffffff' : '#a16207'}
                        fillOpacity={isDriving || isEngaged ? 1 : 0.45}
                        stroke={isDriving || isEngaged ? '#fef08a' : '#78350f'}
                        strokeWidth={isDriving || isEngaged ? '0.8' : '0.5'}
                        className="transition-all duration-300 ease-out"
                        style={{
                          filter:
                            isDriving || isEngaged
                              ? 'drop-shadow(0 0 3px #fef08a)'
                              : 'none',
                        }}
                      />
                    </g>

                    {/*
                      Rear Heavy Drive Tire (Centered at x=46, y=37, Bottom of vehicle):
                      - Driving: .animate-wheel-drive-rear (0.92s)
                      - Hover/Focus: .animate-wheel-idle-rear (3.8s slow idle roll)
                    */}
                    <g transform="translate(46, 37)">
                      <g
                        className={
                          isDriving
                            ? 'animate-wheel-drive-rear'
                            : isEngaged
                            ? 'animate-wheel-idle-rear'
                            : ''
                        }
                        style={{ transformOrigin: '0 0' }}
                      >
                        {/* Outer Heavy Pneumatic Rubber Tire */}
                        <circle cx="0" cy="0" r="10.5" fill="#1e293b" stroke="#0f172a" strokeWidth="1.2" />
                        {/* Deep Chevron Tread Lugs */}
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

                    {/*
                      Front Steer Wheel (Smaller, Centered at x=22, y=40, Top of vehicle):
                      - Driving: .animate-wheel-drive-front (0.70s)
                      - Hover/Focus: .animate-wheel-idle-front (2.8s slow idle roll)
                    */}
                    <g transform="translate(22, 40)">
                      <g
                        className={
                          isDriving
                            ? 'animate-wheel-drive-front'
                            : isEngaged
                            ? 'animate-wheel-idle-front'
                            : ''
                        }
                        style={{ transformOrigin: '0 0' }}
                      >
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
