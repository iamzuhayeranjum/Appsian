import { useState, useEffect, useLayoutEffect } from 'react';

// Shared singleton state to guarantee instantaneous sync across all listeners
let sharedPastHero = false;
let isInitialized = false;
const listeners = new Set<(past: boolean) => void>();

function setGlobalPastHero(nextVal: boolean) {
  if (sharedPastHero !== nextVal) {
    sharedPastHero = nextVal;
    listeners.forEach((listener) => listener(nextVal));
  }
}

/**
 * Computes whether the hero is currently past using hysteresis:
 * - Becomes TRUE when the hero's bottom edge is within 80px of viewport top or above it (rectTop <= 80).
 * - Becomes FALSE again only when the hero's bottom edge is more than 160px below viewport top (rectTop > 160).
 * - Between 80px and 160px, retains current state to prevent flicker.
 */
function computeWithHysteresis(rectTop: number, currentState: boolean): boolean {
  if (rectTop <= 80) {
    return true;
  }
  if (rectTop > 160) {
    return false;
  }
  return currentState;
}

function getSentinelRectTop(sentinelId: string): number {
  if (typeof window === 'undefined') return 1000;
  const sentinel = document.getElementById(sentinelId);
  if (sentinel) {
    return sentinel.getBoundingClientRect().top;
  }
  // Fallback if sentinel not mounted yet
  return 1095 - window.scrollY;
}

/**
 * Initial value computation without animation:
 * True if rectTop <= 80, false otherwise.
 */
function computeInitialPastHero(sentinelId: string): boolean {
  if (typeof window === 'undefined') return false;
  const rectTop = getSentinelRectTop(sentinelId);
  return rectTop <= 80;
}

/**
 * Hook to detect when the hero section has been scrolled past.
 * Implements hysteresis:
 * - pastHero becomes TRUE when hero's bottom edge <= 80px from viewport top.
 * - pastHero becomes FALSE only when hero's bottom edge > 160px below viewport top.
 * Uses passive rAF-throttled scroll & resize listeners for buttery 60/120fps performance.
 */
export function useHeroPast(sentinelId: string = 'hero-sentinel'): boolean {
  const [pastHero, setPastHero] = useState<boolean>(() => {
    if (!isInitialized) {
      sharedPastHero = computeInitialPastHero(sentinelId);
      isInitialized = true;
    }
    return sharedPastHero;
  });

  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    // Immediate sync on mount
    const initialVal = computeInitialPastHero(sentinelId);
    sharedPastHero = initialVal;
    setPastHero(initialVal);

    const handleChange = (val: boolean) => {
      setPastHero(val);
    };
    listeners.add(handleChange);

    let rafId: number | null = null;

    const checkScroll = () => {
      const rectTop = getSentinelRectTop(sentinelId);
      const nextVal = computeWithHysteresis(rectTop, sharedPastHero);
      if (nextVal !== sharedPastHero) {
        setGlobalPastHero(nextVal);
      }
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        checkScroll();
      });
    };

    const handleResize = () => {
      checkScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      listeners.delete(handleChange);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [sentinelId]);

  return pastHero;
}
