"use client";

import { useAudioAnalyser } from "@/hooks/useAudioAnalyser";
import { useAudio } from "@/components/AudioProvider";

type Props = {
  variant?: "compact" | "expanded" | "split";
};

export function Visualizer({ variant = "compact" }: Props) {
  const expanded = variant === "expanded";
  const count = expanded ? 30 : variant === "split" ? 4 : 5;
  const { bands } = useAudioAnalyser(count);
  const { isPlaying } = useAudio();
  const barHeight = expanded ? 22 : 15;

  if (!isPlaying) {
    return (
      <span
        className={`flex items-center ${
          expanded ? "w-full justify-between px-1" : "gap-[3px]"
        }`}
        aria-hidden="true"
      >
        {Array.from({ length: expanded ? 20 : 4 }).map((_, i) => (
          <span
            key={i}
            className="island-dot"
            style={{
              width: expanded ? 3 : 3,
              height: expanded ? 3 : 3,
              opacity: 0.55,
              background: "rgba(239,193,120,0.5)",
            }}
          />
        ))}
      </span>
    );
  }

  return (
    <span
      className={`flex items-center ${
        expanded ? "w-full justify-between px-[2px]" : "gap-[2.5px]"
      }`}
      style={{ height: barHeight }}
      aria-hidden="true"
    >
      {bands.map((band, index) => {
        const v = Math.max(0.09, Math.min(1, band));
        return (
          <span
            key={index}
            className="island-bar"
            style={{
              height: expanded ? 22 : 14,
              width: expanded ? 2 : 2.5,
              opacity: 0.42 + v * 0.58,
              transform: `scaleY(${v})`,
              background:
                expanded && index % 6 === 0
                  ? "linear-gradient(180deg,#FFE9C8,#F0A94B)"
                  : undefined,
            }}
          />
        );
      })}
    </span>
  );
}
