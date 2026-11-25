"use client";

import { useEffect, useState } from "react";

/** Returns the current time, updating on the minute boundary. */
export function useClock() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    setNow(new Date());
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      setNow(new Date());
      const ms = 60000 - (Date.now() % 60000);
      timeout = setTimeout(tick, ms + 25);
    };
    const ms = 60000 - (Date.now() % 60000);
    timeout = setTimeout(tick, ms + 25);
    return () => clearTimeout(timeout);
  }, []);

  return now;
}

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
}
