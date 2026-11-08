import { useEffect, useState } from 'react';

/**
 * Tiny client-side router (no extra dependency).
 * navigate('/book') changes the URL without reloading the page.
 * usePathname() returns the current path so App can show the right page.
 */
const NAVIGATE_EVENT = 'appsian:navigate';

export function navigate(to: string): void {
  if (typeof window === 'undefined') return;
  window.history.pushState({}, '', to);
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
  window.scrollTo(0, 0);
}

function readPathname(): string {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname.replace(/\/+$/, '') || '/';
}

export function usePathname(): string {
  const [pathname, setPathname] = useState<string>(readPathname);

  useEffect(() => {
    const update = () => setPathname(readPathname());
    window.addEventListener('popstate', update);
    window.addEventListener(NAVIGATE_EVENT, update);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener(NAVIGATE_EVENT, update);
    };
  }, []);

  return pathname;
}
