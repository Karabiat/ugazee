"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { supportsWebGL } from "@/lib/webgl";
import { useHydrated } from "@/hooks/useClock";

const RecordRingScene = dynamic(
  () => import("@/components/RecordRingScene"),
  {
    ssr: false,
    loading: () => <div className="ring-fallback" aria-hidden="true" />,
  },
);

/**
 * The ring only mounts once the pinned story is near the viewport, and only
 * when WebGL is available. Reduced-motion users get a static CSS vinyl.
 */
export function RecordRing() {
  const wrap = useRef<HTMLDivElement | null>(null);
  const [near, setNear] = useState(false);
  const [supported, setSupported] = useState<boolean | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const hydrated = useHydrated();

  useEffect(() => {
    setSupported(supportsWebGL());
    const node = wrap.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const disabled = supported === false || (hydrated && Boolean(prefersReducedMotion));

  return (
    <div ref={wrap} className="ring-canvas absolute inset-0" aria-hidden="true">
      {disabled ? (
        <div className="ring-fallback" />
      ) : supported && near ? (
        <RecordRingScene />
      ) : (
        <div className="ring-fallback ring-fallback--soft" />
      )}
    </div>
  );
}
