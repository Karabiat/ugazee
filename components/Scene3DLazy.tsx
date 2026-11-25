"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { supportsWebGL } from "@/lib/webgl";

const Scene3D = dynamic(() => import("@/components/Scene3D"), {
  ssr: false,
  loading: () => <div className="scene-fallback" aria-hidden="true" />,
});

/**
 * Lazy-loads the R3F scene and keeps a pure-CSS atmosphere for reduced motion
 * or browsers without WebGL. The canvas is decorative, so it is hidden from
 * assistive tech in both branches.
 */
export function Scene3DLazy() {
  const reduceMotion = useReducedMotion();
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(supportsWebGL());
  }, []);

  if (reduceMotion || supported === false) {
    return <div className="scene-fallback" aria-hidden="true" />;
  }

  if (supported === null) {
    return <div className="scene-fallback" aria-hidden="true" />;
  }

  return <Scene3D />;
}
