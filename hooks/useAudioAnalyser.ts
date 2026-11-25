"use client";

import { useEffect, useRef, useState } from "react";
import { useAudio, type Levels } from "@/components/AudioProvider";

const ZERO: Levels = { bass: 0, mid: 0, high: 0, energy: 0 };

/**
 * Samples the Web Audio AnalyserNode on a requestAnimationFrame loop.
 * Returns `barCount` smoothed 0→1 values plus bass/mid/high levels.
 * When the track is paused the values collapse to zero, which the island
 * renders as resting dots (iOS paused-state behaviour).
 */
export function useAudioAnalyser(barCount = 5) {
  const { isPlaying, getBins, getLevels } = useAudio();
  const [bands, setBands] = useState<number[]>(() => Array(barCount).fill(0));
  const [levels, setLevels] = useState<Levels>(ZERO);
  const smoothRef = useRef<number[]>(Array(barCount).fill(0));
  const lastPaintRef = useRef(0);

  useEffect(() => {
    if (!isPlaying) {
      smoothRef.current = Array(barCount).fill(0);
      setBands(Array(barCount).fill(0));
      setLevels(ZERO);
      return;
    }

    let raf = 0;
    const loop = (now: number) => {
      // 30fps is plenty for thin bars and keeps the main thread quiet.
      if (now - lastPaintRef.current > 33) {
        lastPaintRef.current = now;
        const next = getBins(barCount);
        smoothRef.current = next.map((v, i) => {
          const prev = smoothRef.current[i] ?? 0;
          const target = Math.max(v, prev * 0.72);
          return prev + (target - prev) * 0.55;
        });
        setBands(smoothRef.current);
        setLevels(getLevels());
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying, barCount, getBins, getLevels]);

  return { bands, levels, isPlaying };
}
