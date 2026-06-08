/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LoadingContextType {
  isBootLoading: boolean;
  isActionLoading: boolean;
  loadingProgress: number;
  loadingMessage: string;
  setBootFinished: () => void;
  startActionLoading: (message: string) => void;
  stopActionLoading: () => void;
  setLoadingProgress: (progress: number) => void;
  setLoadingMessage: (message: string) => void;
  // Dynamic wrapper to run an asynchronous function inside our beautiful loading screen
  runWithLoader: <T>(message: string, task: () => Promise<T>) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBootLoading, setIsBootLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [loadingProgress, setLoadingProgressState] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Initializing Sri Velan & Co systems...');

  const setLoadingProgress = (progress: number) => {
    setLoadingProgressState(Math.min(100, Math.max(0, progress)));
  };

  const setBootFinished = () => {
    setIsBootLoading(false);
  };

  const startActionLoading = (message: string) => {
    setLoadingProgressState(0);
    setLoadingMessage(message);
    setIsActionLoading(true);
  };

  const stopActionLoading = () => {
    setIsActionLoading(false);
  };

  // Helper function to auto-increment progress smoothly over a duration
  const runWithLoader = async <T,>(message: string, task: () => Promise<T>): Promise<T> => {
    setLoadingProgressState(0);
    setLoadingMessage(message);
    setIsActionLoading(true);

    // Dynamic fake progress loop running alongside the real task to keep the user engaged
    let progressTimer: NodeJS.Timeout;
    let progressVal = 0;
    
    const incrementProgress = () => {
      progressTimer = setTimeout(() => {
        // Slow down as it approaches 95% to allow the actual request to complete
        const inc = progressVal < 50 ? 8 : progressVal < 80 ? 4 : progressVal < 95 ? 1 : 0;
        progressVal = Math.min(98, progressVal + inc);
        setLoadingProgressState(progressVal);
        
        if (progressVal < 98) {
          incrementProgress();
        }
      }, 70);
    };

    incrementProgress();

    try {
      const result = await task();
      // Fast forward to 100 on absolute success
      clearTimeout(progressTimer);
      setLoadingProgressState(100);
      // Wait for a brief moment for the animation to hit 100% and feel completed
      await new Promise((resolve) => setTimeout(resolve, 600));
      return result;
    } catch (err) {
      clearTimeout(progressTimer);
      throw err;
    } finally {
      // Small cooldown delay before hiding the loading frame
      setTimeout(() => {
        setIsActionLoading(false);
      }, 400);
    }
  };

  // Initial App Simulation Loader sequence
  useEffect(() => {
    if (!isBootLoading) return;

    let currentProgress = 0;
    const phrases = [
      'Establishing geometric coordinate blueprint grids...',
      'Erecting high-security corporate network portals...',
      'Loading construction blueprints and PWD indices...',
      'Pre-vetting emergency dewatering machinery stats...',
      'Mobilizing dockets and heavy machinery logs...',
      'Connecting secure server pipeline links...',
      'Systems ready. Securing digital platform portals...'
    ];

    const interval = setInterval(() => {
      // Increment progress randomly
      currentProgress += Math.floor(Math.random() * 8) + 4;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        setLoadingProgressState(100);
        setLoadingMessage(phrases[phrases.length - 1]);
        clearInterval(interval);
        
        // Wait 800ms before finishing boot sequence to let the user enjoy the 100% state
        setTimeout(() => {
          setIsBootLoading(false);
        }, 800);
      } else {
        setLoadingProgressState(currentProgress);
        // Swap tagline/phrases depending on progress ranges
        const phraseIdx = Math.min(
          phrases.length - 2,
          Math.floor((currentProgress / 100) * (phrases.length - 1))
        );
        setLoadingMessage(phrases[phraseIdx]);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [isBootLoading]);

  return (
    <LoadingContext.Provider
      value={{
        isBootLoading,
        isActionLoading,
        loadingProgress,
        loadingMessage,
        setBootFinished,
        startActionLoading,
        stopActionLoading,
        setLoadingProgress,
        setLoadingMessage,
        runWithLoader,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
