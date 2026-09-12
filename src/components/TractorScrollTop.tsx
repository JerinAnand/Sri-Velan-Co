import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, Wrench } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface TractorScrollTopProps {
  /** Scroll threshold in px to reveal the tractor (default: 400px) */
  threshold?: number;
  /** Optional custom CSS class */
  className?: string;
  /** Explicit maintenance / in-service mode (defaults to checking admin routes) */
  isMaintenance?: boolean;
}

/**
 * High-Performance Preloaded Audio Engine for Tractor Acoustics:
 * - Preloads and caches starter, rhythmic diesel idle, and climbing audio buffers in RAM.
 * - Warm AudioContext queue eliminates any first-interaction stutter/latency.
 * - Authentic multi-layer heavy machinery sound design: starter crank, 4-stroke diesel idle, and turbo spool.
 */
class TractorAudioPreloadEngine {
  private ctx: AudioContext | null = null;
  private isPreloaded = false;
  private isPreloading = false;

  // Cached AudioBuffers in memory
  private starterBuffer: AudioBuffer | null = null;
  private idleBuffer: AudioBuffer | null = null;
  private driveBuffer: AudioBuffer | null = null;

  // Active playing nodes
  private starterSource: AudioBufferSourceNode | null = null;
  private idleSource: AudioBufferSourceNode | null = null;
  private idleGain: GainNode | null = null;
  private driveSource: AudioBufferSourceNode | null = null;
  private driveGain: GainNode | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  /**
   * Preload Queue: Wakes AudioContext and pre-synthesizes high-fidelity diesel audio buffers.
   * Called on early page interaction or when tractor becomes visible.
   */
  preload() {
    if (this.isPreloaded || this.isPreloading) return;
    this.isPreloading = true;

    try {
      const ctx = this.getContext();
      if (!ctx) {
        this.isPreloading = false;
        return;
      }

      // Warm up the hardware audio thread with a silent 1-sample buffer
      const silentBuffer = ctx.createBuffer(1, 1, 22050);
      const silentSource = ctx.createBufferSource();
      silentSource.buffer = silentBuffer;
      silentSource.connect(ctx.destination);
      silentSource.start(0);

      const sampleRate = ctx.sampleRate || 44100;

      // 1. Synthesize Starter Crank Buffer (~0.52s)
      // Two mechanical compression strokes followed by diesel ignition catch
      const starterLength = Math.floor(sampleRate * 0.52);
      const starterBuf = ctx.createBuffer(1, starterLength, sampleRate);
      const sData = starterBuf.getChannelData(0);

      for (let i = 0; i < starterLength; i++) {
        const t = i / sampleRate;
        let val = 0;

        // Stroke 1 (0.02s - 0.12s) - Starter motor compression pulse
        if (t >= 0.02 && t < 0.14) {
          const env = Math.sin(((t - 0.02) / 0.12) * Math.PI);
          val += Math.sin(2 * Math.PI * 62 * (t - 0.02)) * env * 0.7;
          val += (Math.random() * 2 - 1) * 0.12 * env; // Starter gear tooth rasp
        }

        // Stroke 2 (0.16s - 0.28s) - Second compression pulse
        if (t >= 0.16 && t < 0.28) {
          const env = Math.sin(((t - 0.16) / 0.12) * Math.PI);
          val += Math.sin(2 * Math.PI * 66 * (t - 0.16)) * env * 0.85;
          val += (Math.random() * 2 - 1) * 0.15 * env;
        }

        // Ignition Catch (0.30s - 0.52s) - Diesel cylinders fire and spool to idle
        if (t >= 0.30) {
          const env = Math.exp(-(t - 0.30) * 5.2);
          const freq = 78 - (t - 0.30) * 45;
          val += Math.sin(2 * Math.PI * freq * (t - 0.30)) * env * 0.9;
          val += Math.sin(2 * Math.PI * (freq * 2) * (t - 0.30)) * env * 0.45;
        }

        sData[i] = val * 0.45; // Soft mastered level
      }
      this.starterBuffer = starterBuf;

      // 2. Synthesize Seamless Looping 4-Stroke Diesel Idle Buffer (1.0s exact period)
      // Exactly 46.0 fundamental cycles ensures 0 click on loop seam
      const idleLength = Math.floor(sampleRate * 1.0);
      const idleBuf = ctx.createBuffer(1, idleLength, sampleRate);
      const iData = idleBuf.getChannelData(0);

      for (let i = 0; i < idleLength; i++) {
        const t = i / sampleRate;
        // Fundamental heavy cylinder thump (46Hz)
        const fundamental = Math.sin(2 * Math.PI * 46 * t);
        // Rich warm harmonics
        const h2 = Math.sin(2 * Math.PI * 92 * t) * 0.45;
        const h3 = Math.sin(2 * Math.PI * 138 * t) * 0.22;
        // 4-Stroke firing cadence (11.5Hz = 4 pulses per 1.0s)
        const strokeCadence = 0.75 + 0.25 * Math.sin(2 * Math.PI * 11.5 * t);
        // Subtle mechanical diesel chuff flutter
        const flutter = (Math.sin(2 * Math.PI * 23 * t) > 0.4 ? 0.08 : -0.05) * 0.3;

        iData[i] = (fundamental + h2 + h3 + flutter) * strokeCadence * 0.35;
      }
      this.idleBuffer = idleBuf;

      // 3. Synthesize Climbing Turbo-Diesel Buffer (4.8s duration)
      // Accelerating diesel torque swell + faint turbocharger spool whistle
      const driveLength = Math.floor(sampleRate * 4.8);
      const driveBuf = ctx.createBuffer(1, driveLength, sampleRate);
      const dData = driveBuf.getChannelData(0);

      for (let i = 0; i < driveLength; i++) {
        const t = i / sampleRate;
        const progress = Math.min(1, t / 4.2);

        // Accelerating cylinder firing frequency: 48Hz -> 78Hz
        const baseFreq = 48 + progress * 30;
        const cylinder = Math.sin(2 * Math.PI * baseFreq * t);
        const subHarmonic = Math.sin(2 * Math.PI * (baseFreq * 2) * t) * 0.4;

        // Faint high-register turbocharger spool (360Hz -> 520Hz)
        const turboFreq = 360 + progress * 160;
        const turboWhistle = Math.sin(2 * Math.PI * turboFreq * t) * 0.045 * progress;

        // Mechanical transmission gear-mesh texture
        const gearMesh = (Math.random() * 2 - 1) * 0.035 * (0.5 + progress * 0.5);

        // Smooth envelope: gentle entry, strong climb, soft summit fade
        let env = 1;
        if (t < 0.25) env = t / 0.25;
        else if (t > 4.2) env = Math.max(0, (4.8 - t) / 0.6);

        dData[i] = (cylinder + subHarmonic + turboWhistle + gearMesh) * env * 0.42;
      }
      this.driveBuffer = driveBuf;

      this.isPreloaded = true;
      this.isPreloading = false;
    } catch {
      this.isPreloading = false;
    }
  }

  /**
   * Start Engine: Instantly plays the pre-synthesized starter crank,
   * then rolls smoothly into the seamless rhythmic diesel idle loop.
   */
  startIdle(volume = 0.038) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      this.stopAll();

      // Ensure preloaded buffers exist
      if (!this.isPreloaded) {
        this.preload();
      }

      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), now + 0.12);

      // Lowpass filter for smooth, deep diesel resonance
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(210, now);

      master.connect(filter);
      filter.connect(ctx.destination);

      // 1. Play starter sequence if buffered
      if (this.starterBuffer) {
        const starter = ctx.createBufferSource();
        starter.buffer = this.starterBuffer;
        starter.connect(master);
        starter.start(now);
        this.starterSource = starter;
      }

      // 2. Play continuous rhythmic idle loop
      if (this.idleBuffer) {
        const idle = ctx.createBufferSource();
        idle.buffer = this.idleBuffer;
        idle.loop = true;
        idle.connect(master);
        // Start idle immediately, with starter layered on top
        idle.start(now);
        this.idleSource = idle;
      }

      this.idleGain = master;
    } catch {
      // Gracefully silent if blocked by browser
    }
  }

  stopIdle() {
    try {
      if (this.idleGain && this.ctx) {
        const now = this.ctx.currentTime;
        this.idleGain.gain.setValueAtTime(this.idleGain.gain.value, now);
        this.idleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

        const idle = this.idleSource;
        const starter = this.starterSource;
        setTimeout(() => {
          try {
            idle?.stop();
            starter?.stop();
            idle?.disconnect();
            starter?.disconnect();
          } catch {}
        }, 200);

        this.idleGain = null;
        this.idleSource = null;
        this.starterSource = null;
      }
    } catch {}
  }

  /**
   * Start Climbing Sound: Plays the preloaded accelerating turbo-diesel audio buffer
   */
  startDriving(durationMs: number, volume = 0.052) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      this.stopAll();

      if (!this.isPreloaded) {
        this.preload();
      }

      const now = ctx.currentTime;
      const durationSec = durationMs / 1000;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), now + 0.25);
      master.gain.setValueAtTime(volume, now + Math.max(0.1, durationSec - 0.5));
      master.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, now);
      filter.frequency.linearRampToValueAtTime(420, now + durationSec * 0.75);

      master.connect(filter);
      filter.connect(ctx.destination);

      if (this.driveBuffer) {
        const drive = ctx.createBufferSource();
        drive.buffer = this.driveBuffer;
        drive.connect(master);
        // Playback rate scaled gently to match dynamic duration
        const normalDuration = this.driveBuffer.duration;
        drive.playbackRate.value = Math.max(0.85, Math.min(1.25, normalDuration / durationSec));
        drive.start(now);
        drive.stop(now + durationSec + 0.1);
        this.driveSource = drive;
      }

      this.driveGain = master;
    } catch {}
  }

  stopAll() {
    this.stopIdle();
    try {
      if (this.driveGain && this.ctx) {
        const now = this.ctx.currentTime;
        this.driveGain.gain.setValueAtTime(this.driveGain.gain.value, now);
        this.driveGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
        const drive = this.driveSource;
        setTimeout(() => {
          try {
            drive?.stop();
            drive?.disconnect();
          } catch {}
        }, 110);
        this.driveGain = null;
        this.driveSource = null;
      }
    } catch {}
  }

  /**
   * Play realistic pneumatic parking brake release hiss and mechanical latch click
   */
  playParkingBrake(volume = 0.04) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 1. Short air-brake pneumatic hiss
      const sampleRate = ctx.sampleRate;
      const bufferSize = Math.floor(sampleRate * 0.22);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.065));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600, now);
      filter.Q.setValueAtTime(2.2, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);

      // 2. Mechanical handbrake ratchet / latch click
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.035);
      oscGain.gain.setValueAtTime(volume * 0.7, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }
}

export const TractorScrollTop: React.FC<TractorScrollTopProps> = ({
  threshold = 400, // Default 400px entrance threshold
  className = '',
  isMaintenance,
}) => {
  const location = useLocation();

  // Maintenance / In-Service Mode: explicitly passed or detected on admin dashboard
  const isServiceMode = isMaintenance ?? location.pathname.startsWith('/admin');

  const [isVisible, setIsVisible] = useState(false);
  const [isDriving, setIsDriving] = useState(false);
  const [driveProgress, setDriveProgress] = useState(0); // 0 (bottom) -> 1 (top of screen)
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isParked, setIsParked] = useState(false); // Auto-park state when inactive > 10s
  const [isBrakeSettling, setIsBrakeSettling] = useState(false); // Brief settling suspension animation
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 800
  );

  // Sound preference: Respect system preferences (prefers-reduced-motion) & user localStorage
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('tractor_sound_enabled');
    if (saved !== null) {
      return saved === 'true';
    }
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !prefersReducedMotion;
  });

  const soundEngineRef = useRef<TractorAudioPreloadEngine | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isDrivingRef = useRef(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const brakeSettlingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Listen to system prefers-reduced-motion changes if user hasn't explicitly set a preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handlePrefChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem('tractor_sound_enabled');
      if (saved === null) {
        setSoundEnabled(!e.matches);
      }
    };
    mediaQuery.addEventListener?.('change', handlePrefChange);
    return () => mediaQuery.removeEventListener?.('change', handlePrefChange);
  }, []);

  // Initialize and preload audio queue on mount
  useEffect(() => {
    const engine = new TractorAudioPreloadEngine();
    soundEngineRef.current = engine;

    // Early interaction warmup to eliminate first-interaction audio lag
    const handleEarlyWarmup = () => {
      engine.preload();
      window.removeEventListener('pointerdown', handleEarlyWarmup);
      window.removeEventListener('mousemove', handleEarlyWarmup);
      window.removeEventListener('scroll', handleEarlyWarmup);
      window.removeEventListener('keydown', handleEarlyWarmup);
    };

    window.addEventListener('pointerdown', handleEarlyWarmup, { passive: true, once: true });
    window.addEventListener('mousemove', handleEarlyWarmup, { passive: true, once: true });
    window.addEventListener('scroll', handleEarlyWarmup, { passive: true, once: true });
    window.addEventListener('keydown', handleEarlyWarmup, { passive: true, once: true });

    return () => {
      engine.stopAll();
      window.removeEventListener('pointerdown', handleEarlyWarmup);
      window.removeEventListener('mousemove', handleEarlyWarmup);
      window.removeEventListener('scroll', handleEarlyWarmup);
      window.removeEventListener('keydown', handleEarlyWarmup);
    };
  }, []);

  // Preload immediately when tractor becomes visible
  useEffect(() => {
    if (isVisible) {
      soundEngineRef.current?.preload();
    }
  }, [isVisible]);

  // Persist sound toggle preference
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('tractor_sound_enabled', String(next));
      } catch {}
      if (!next) {
        soundEngineRef.current?.stopAll();
      }
      return next;
    });
  }, []);

  // Auto-Park Feature: 10-Second Inactivity Detector
  // Engages parking brake animation and powers engine off in place if user is inactive > 10s
  useEffect(() => {
    // If not visible or actively driving up, don't trigger auto-park
    if (!isVisible || isDriving) {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      if (brakeSettlingTimeoutRef.current) {
        clearTimeout(brakeSettlingTimeoutRef.current);
        brakeSettlingTimeoutRef.current = null;
      }
      return;
    }

    const resetInactivity = () => {
      // Wake up from parked state on any user activity
      setIsParked(false);
      setIsBrakeSettling(false);
      if (brakeSettlingTimeoutRef.current) {
        clearTimeout(brakeSettlingTimeoutRef.current);
        brakeSettlingTimeoutRef.current = null;
      }

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      // Start 10-second inactivity countdown
      inactivityTimerRef.current = setTimeout(() => {
        setIsParked(true);
        setIsBrakeSettling(true);
        soundEngineRef.current?.stopAll();
        // Play subtle pneumatic parking brake hiss & click if sound is enabled
        soundEngineRef.current?.playParkingBrake();

        // Let the brief parking brake settling animation play (subtle dip into suspension)
        if (brakeSettlingTimeoutRef.current) {
          clearTimeout(brakeSettlingTimeoutRef.current);
        }
        brakeSettlingTimeoutRef.current = setTimeout(() => {
          setIsBrakeSettling(false);
        }, 680);
      }, 10000);
    };

    // Initialize the countdown
    resetInactivity();

    const userActivityEvents: Array<keyof WindowEventMap> = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
      'wheel',
    ];

    const handleActivity = () => {
      resetInactivity();
    };

    userActivityEvents.forEach((ev) => {
      window.addEventListener(ev, handleActivity, { passive: true });
    });

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      if (brakeSettlingTimeoutRef.current) {
        clearTimeout(brakeSettlingTimeoutRef.current);
        brakeSettlingTimeoutRef.current = null;
      }
      userActivityEvents.forEach((ev) => {
        window.removeEventListener(ev, handleActivity);
      });
    };
  }, [isVisible, isDriving]);

  // Engine start interaction is active on hover or keyboard focus (when not already driving and not parked)
  const isEngaged = (isHovered || isFocused) && !isDriving && !isParked;

  // Trigger soft preloaded engine start sound when tractor is hovered/focused
  useEffect(() => {
    if (isEngaged && soundEnabled && !isParked) {
      soundEngineRef.current?.startIdle();
    } else {
      soundEngineRef.current?.stopIdle();
    }
  }, [isEngaged, soundEnabled, isParked]);

  // Keep window height updated for dynamic upward travel
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Monitor scroll position with high-performance passive listener (threshold: 400px)
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
   * 1. Low-gear torque engagement (0 -> 0.20): engine spools up, tires bite.
   * 2. Powerful vertical climb momentum (0.20 -> 0.88): steady, controlled ascent.
   * 3. Summit deceleration (0.88 -> 1.0): smooth ease-out at the crest.
   */
  const realisticTractorEase = (t: number): number => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return t < 0.22
      ? 1.8 * Math.pow(t, 2)
      : 1 - Math.pow(1 - t, 2.3) * 0.92;
  };

  /**
   * Slower, More Gradual & Controlled Scroll Duration:
   * Paced comfortably (~3.8s to 5.4s) so the mechanical animations and soft sounds
   * can be fully appreciated without rushing.
   */
  const handleDriveToTop = useCallback(() => {
    if (isDrivingRef.current) return;

    setIsParked(false);
    isDrivingRef.current = true;
    setIsDriving(true);

    const startScrollY = window.scrollY || document.documentElement.scrollTop;
    const duration = Math.min(5400, Math.max(3800, Math.sqrt(startScrollY) * 95));
    const startTime = performance.now();

    // Trigger preloaded climbing sound if sound is enabled (instant 0ms playback)
    if (soundEnabled) {
      soundEngineRef.current?.startDriving(duration);
    }

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
          soundEngineRef.current?.stopAll();
        }, 500);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animateClimb);
  }, [soundEnabled]);

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
      {/* Scoped CSS Keyframes */}
      <style>{`
        /* Slower Driving Differential Wheel Spin (Climbing Speed) */
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

        /* Maintenance Wrench Glow Pulse */
        @keyframes wrench-badge-glow {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(245, 158, 11, 0.5)); }
          50% { transform: scale(1.08); filter: drop-shadow(0 0 5px rgba(245, 158, 11, 0.9)); }
        }

        /* Synchronized animation classes */
        .animate-wheel-drive-rear {
          animation: tractor-rear-spin-slow 1.42s linear infinite;
        }

        .animate-wheel-drive-front {
          animation: tractor-front-spin-slow 1.08s linear infinite;
        }

        .animate-wheel-idle-rear {
          animation: tractor-rear-spin-idle 3.8s linear infinite;
        }

        .animate-wheel-idle-front {
          animation: tractor-front-spin-idle 2.8s linear infinite;
        }

        .animate-chassis-climb {
          animation: tractor-suspension-climb 0.62s ease-in-out infinite;
        }

        .animate-chassis-idle {
          animation: tractor-engine-idle-jitter 0.09s ease-in-out infinite;
        }

        .animate-flap-climb {
          animation: exhaust-flap-flutter-climb 0.42s ease-in-out infinite;
          transform-origin: 30px 14.5px;
        }

        .animate-flap-idle {
          animation: exhaust-flap-flutter-idle 0.16s ease-in-out infinite;
          transform-origin: 30px 14.5px;
        }

        .animate-diesel-1 {
          animation: diesel-smoke-climb-1 1.75s ease-out infinite;
        }

        .animate-diesel-2 {
          animation: diesel-smoke-climb-2 1.75s ease-out 0.58s infinite;
        }

        .animate-diesel-3 {
          animation: diesel-smoke-climb-3 1.75s ease-out 1.16s infinite;
        }

        .animate-idle-wisp-1 {
          animation: diesel-smoke-idle-wisp-1 1.5s ease-out infinite;
        }

        .animate-idle-wisp-2 {
          animation: diesel-smoke-idle-wisp-2 1.5s ease-out 0.75s infinite;
        }

        .animate-dirt {
          animation: tire-dirt-vertical 1.15s ease-out infinite;
        }

        .animate-resting-thrum {
          animation: tractor-resting-thrum 2.2s ease-in-out infinite;
        }

        .animate-service-wrench {
          animation: wrench-badge-glow 2.5s ease-in-out infinite;
        }

        /* Parking Brake Settling Movement (Subtle Dip into Suspension & Recoil when Auto-Park Triggers) */
        @keyframes parking-brake-settle {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          20% {
            transform: translateY(-2px) rotate(-1.2deg);
          }
          50% {
            transform: translateY(3.5px) rotate(0.8deg);
          }
          75% {
            transform: translateY(1.5px) rotate(-0.3deg);
          }
          100% {
            transform: translateY(2px) rotate(0deg);
          }
        }

        .animate-parking-brake {
          animation: parking-brake-settle 0.68s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>

      {/* Floating Container: Fixed at bottom-left in the exact same place (avoids AI chatbot on bottom-right) */}
      <div
        id="tractor-scroll-top-container"
        className={`fixed left-4 sm:left-6 bottom-6 z-40 select-none ${className}`}
      >
        <AnimatePresence>
          {isVisible && (
            <motion.div
              /* Gentle pop-in & fade-in spring animation when appearing after 400px scroll */
              initial={{ opacity: 0, scale: 0.68, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.75, y: 22 }}
              transition={{
                type: 'spring',
                stiffness: 220,
                damping: 19,
                mass: 0.85,
              }}
              className="relative group"
            >
              {/* Tooltip on Hover / Focus directly above the Tractor button */}
              <div
                role="tooltip"
                id="tractor-scroll-tooltip"
                className={`absolute -top-10 left-0 transition-all duration-200 ease-out whitespace-nowrap bg-brand-blue-950/95 backdrop-blur-md text-brand-gold-400 border border-brand-gold-500/30 text-xs font-display font-semibold px-3 py-1.5 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 ${
                  isEngaged || isHovered || isFocused
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-2 pointer-events-none'
                }`}
              >
                {isParked ? (
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-800 text-[10px] font-bold text-amber-300 border border-amber-400/40">
                      P
                    </span>
                    <span>Auto-Parked • Brake Set</span>
                    <ArrowUp className="w-3.5 h-3.5 text-slate-400" />
                  </span>
                ) : isServiceMode ? (
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <Wrench className="w-3.5 h-3.5 text-amber-400" />
                    <span>In Service • Top</span>
                    <ArrowUp className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <span>Drive to top</span>
                    <ArrowUp className="w-3.5 h-3.5 text-brand-gold-300 animate-bounce" />
                  </span>
                )}
              </div>

              {/*
                Pure Transparent Tractor Button:
                - Accessible via Mouse (hover) and Keyboard (focus)
                - Displays 'In Service' / 'Maintenance' wrench icon on Admin Dashboard
                - Perfectly parallel to the vertical edge of the screen (90° body axis)
                - Auto-parks in-place with brief settling suspension animation after 10s inactivity
                - Triggers zero-lag preloaded diesel engine start on hover/focus
              */}
              <button
                type="button"
                id="back-to-top-button"
                aria-label={
                  isParked
                    ? 'Auto-Parked: Click to wake and drive to top'
                    : isServiceMode
                    ? 'In Service: Scroll to top of page'
                    : 'Scroll to top of page'
                }
                aria-describedby="tractor-scroll-tooltip"
                onClick={handleDriveToTop}
                onKeyDown={handleKeyDown}
                onMouseEnter={() => {
                  setIsHovered(true);
                  setIsParked(false);
                }}
                onMouseLeave={() => setIsHovered(false)}
                onFocus={() => {
                  setIsFocused(true);
                  setIsParked(false);
                }}
                onBlur={() => setIsFocused(false)}
                onTouchStart={() => {
                  setIsHovered(true);
                  setIsParked(false);
                }}
                onTouchEnd={() => setIsHovered(false)}
                onTouchCancel={() => setIsHovered(false)}
                disabled={isDriving}
                className={`relative bg-transparent border-none p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-blue-950 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 ${
                  isBrakeSettling ? 'animate-parking-brake' : ''
                }`}
                style={{
                  transform: isDriving
                    ? `translateY(${currentTranslateY}px)`
                    : isParked && !isBrakeSettling
                    ? 'translateY(2px)'
                    : 'translateY(0px)',
                  transition: isDriving || isBrakeSettling ? 'none' : 'transform 0.25s ease-out',
                }}
              >
                {/* Tiny Dashboard LED: Glows green when Active, dims/turns off when Auto-Parked */}
                <div
                  id="tractor-dashboard-led"
                  className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-950/90 border border-slate-700/60 shadow-md backdrop-blur-xs pointer-events-none transition-all duration-300"
                  title={!isParked ? 'Tractor Status: Active (Engine Ready)' : 'Tractor Status: Auto-Parked (Engine Off)'}
                  aria-label={!isParked ? 'Status: Active' : 'Status: Auto-Parked'}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      !isParked
                        ? 'bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse'
                        : 'bg-slate-600 opacity-40 shadow-none'
                    }`}
                  />
                  <span
                    className={`text-[8px] font-mono tracking-wider font-bold transition-colors duration-300 ${
                      !isParked ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {!isParked ? 'ACT' : 'OFF'}
                  </span>
                </div>

                {/* Visual State: 'In Service' / 'Maintenance' Wrench Badge on Admin Dashboard */}
                {isServiceMode && (
                  <div
                    id="tractor-service-wrench-badge"
                    className="absolute -top-1.5 -right-1 z-30 flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 border-2 border-brand-blue-950 shadow-md shadow-amber-500/40 animate-service-wrench transition-transform duration-200 group-hover:scale-110"
                    title="In Service / Fleet Maintenance Mode"
                    aria-label="In Service / Maintenance Mode"
                  >
                    <Wrench className="w-3.5 h-3.5 stroke-[2.6]" />
                  </div>
                )}

                {/* Visual State: Auto-Parked (Engine Off) 'P' Badge */}
                {isParked && (
                  <div
                    id="tractor-auto-parked-badge"
                    className="absolute -top-1.5 -left-1.5 z-30 flex items-center justify-center w-5 h-5 rounded-full bg-slate-900/90 text-amber-300 border border-amber-500/50 shadow-md font-bold text-[10px] tracking-tight transition-transform duration-200"
                    title="Auto-Parked: Parking Brake Set • Engine Off (Inactive > 10s)"
                    aria-label="Auto-Parked: Parking Brake Set"
                  >
                    P
                  </div>
                )}

                {/* Clean Horizontal Contact Shadow directly beneath vertical tractor (no tilt) */}
                <div
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-2.5 bg-black/45 rounded-full blur-[2.5px] pointer-events-none transition-all duration-300 ${
                    isDriving
                      ? 'opacity-15 scale-75'
                      : isParked
                      ? 'opacity-35 scale-95'
                      : isEngaged
                      ? 'opacity-85 scale-100'
                      : 'opacity-65 group-hover:opacity-85'
                  }`}
                />

                {/* SVG Contractor Tractor Graphic (Strictly Vertical at 90°) */}
                <svg
                  viewBox="0 0 68 68"
                  className={`w-15 h-15 sm:w-17 sm:h-17 relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] overflow-visible ${
                    !isDriving && !isEngaged && !isParked ? 'animate-resting-thrum' : ''
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

                      {/* In-Service Fleet Flashing Beacon on Canopy in Maintenance Mode */}
                      {isServiceMode && (
                        <g className="service-beacon-indicator">
                          <circle cx="45.5" cy="11.5" r="2.2" fill="#f59e0b" className="animate-pulse" />
                          <circle cx="45.5" cy="11.5" r="1.2" fill="#fef08a" />
                          <rect x="44.2" y="12.7" width="2.6" height="1.2" fill="#0e2954" rx="0.3" />
                        </g>
                      )}

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

                      {/* Tiny Dashboard Instrument LED: Glows green when Active, dims/turns off when Auto-Parked */}
                      <circle
                        cx="38.5"
                        cy="26.8"
                        r="1.2"
                        fill={!isParked ? '#22c55e' : '#334155'}
                        className="transition-colors duration-300"
                      />
                      {!isParked && (
                        <circle
                          cx="38.5"
                          cy="26.8"
                          r="2.6"
                          fill="#4ade80"
                          fillOpacity="0.6"
                          className="animate-pulse pointer-events-none"
                        />
                      )}

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
                      - Driving: .animate-wheel-drive-rear (1.42s synchronized slower)
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
                      - Driving: .animate-wheel-drive-front (1.08s synchronized slower)
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
