"use client";

import { useEffect, useMemo, useState } from "react";
import { config } from "@/lib/config";

type Parts = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

function getParts(target: number): Parts {
  const diff = Math.max(0, target - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    done: diff <= 0,
  };
}

type Props = {
  variant?: "compact" | "story";
  className?: string;
};

export function Countdown({ variant = "compact", className = "" }: Props) {
  const target = useMemo(() => new Date(config.album.dropISO).getTime(), []);
  // Render a stable placeholder on the server, then fill in real values on the
  // client. This keeps hydration byte-identical and avoids a stale countdown
  // in the prerendered HTML.
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    const tick = () => setParts(getParts(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (variant === "compact") {
    const hours = parts
      ? `${String(parts.hours).padStart(2, "0")}:${String(parts.minutes).padStart(
          2,
          "0",
        )}:${String(parts.seconds).padStart(2, "0")}`
      : "00:00:00";
    return (
      <div
        className={`flex items-end justify-between ${className}`}
        role="timer"
        aria-label={
          parts
            ? `Album drops in ${parts.days} days, ${parts.hours} hours, ${parts.minutes} minutes`
            : "Album countdown loading"
        }
      >
        <span className="text-[38px] font-extralight leading-none tracking-[-0.05em] text-white tabular-nums">
          {parts?.done ? "OUT" : parts ? parts.days.toString().padStart(2, "0") : "00"}
        </span>
        <div className="pb-[4px] text-left">
          <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-white/45">
            {parts?.done ? "Streaming now" : "Days to go"}
          </p>
          <p className="text-[11px] font-medium text-white/90 tabular-nums">
            {parts?.done ? "12.12.26" : hours}
          </p>
        </div>
      </div>
    );
  }

  const units = [
    { label: "Days", value: parts?.days ?? 0 },
    { label: "Hours", value: parts?.hours ?? 0 },
    { label: "Minutes", value: parts?.minutes ?? 0 },
    { label: "Seconds", value: parts?.seconds ?? 0 },
  ];

  return (
    <div
      className={`grid grid-cols-4 gap-[6px] sm:gap-2 ${className}`}
      role="timer"
      aria-label={
        parts
          ? `Countdown to ${config.album.title}: ${parts.days} days, ${parts.hours} hours, ${parts.minutes} minutes`
          : `Countdown to ${config.album.title} loading`
      }
    >
      {units.map((unit) => (
        <div
          key={unit.label}
          className="rounded-[10px] border border-white/10 bg-white/[0.035] px-1 py-2 text-center backdrop-blur-sm"
        >
          <p className="text-[clamp(24px,3.2vw,44px)] font-extralight leading-none tracking-[-0.04em] text-white tabular-nums">
            {parts?.done ? "00" : unit.value.toString().padStart(2, "0")}
          </p>
          <p className="mt-1 text-[7px] font-semibold uppercase tracking-[0.18em] text-white/35 sm:text-[8px]">
            {unit.label}
          </p>
        </div>
      ))}
    </div>
  );
}
