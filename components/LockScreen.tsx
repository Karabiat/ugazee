"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronUp, Lock, Music2, Play, CloudSun } from "lucide-react";
import { config } from "@/lib/config";
import { useClock } from "@/hooks/useClock";
import { formatClock, formatDate } from "@/lib/format";

type Props = {
  onUnlock: () => void;
  onTestNotification: () => void;
};

export function LockScreen({ onUnlock, onTestNotification }: Props) {
  const now = useClock();
  const clockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragged = useRef(false);
  const dragReset = useRef<ReturnType<typeof setTimeout> | null>(null);

  const time = now ? formatClock(now) : "9:41";
  const date = now ? formatDate(now) : "Wednesday, November 25";

  const handleClockClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (clockTimer.current) {
      clearTimeout(clockTimer.current);
      clockTimer.current = null;
      onTestNotification();
      return;
    }
    clockTimer.current = setTimeout(() => {
      clockTimer.current = null;
      onUnlock();
    }, 270);
  };

  return (
    <motion.div
      className="absolute inset-0 z-40 flex h-full w-full cursor-pointer select-none flex-col"
      role="button"
      tabIndex={0}
      aria-label="Lock screen. Swipe up, click, or press Enter to open Ugazee's iPhone and play Detty December."
      drag="y"
      dragConstraints={{ top: -260, bottom: 0 }}
      dragElastic={0.22}
      dragMomentum={false}
      onDragStart={() => {
        dragged.current = true;
      }}
      onDragEnd={(_, info) => {
        const shouldUnlock = info.offset.y < -96 || info.velocity.y < -520;
        setTimeout(() => {
          dragged.current = false;
        }, 260);
        if (shouldUnlock) onUnlock();
      }}
      onClick={() => {
        if (!dragged.current) onUnlock();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onUnlock();
        }
      }}
      initial={{ opacity: 1 }}
      exit={{
        y: "-108%",
        opacity: 0,
        filter: "blur(10px)",
        transition: { type: "spring", stiffness: 250, damping: 31 },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 34 }}
    >
      <div className="flex h-full flex-col px-[26px] pb-[18px] pt-[62px]">
        <div className="flex flex-col items-center text-white">
          <div className="flex items-center gap-[6px] text-white/70">
            <Lock size={11} strokeWidth={2.4} aria-hidden="true" />
            <span
              className="text-[13px] font-medium tracking-[0.01em]"
              suppressHydrationWarning
            >
              {date}
            </span>
          </div>

          <button
            type="button"
            onClick={handleClockClick}
            onKeyDown={(event) => event.stopPropagation()}
            className="mt-[2px] rounded-2xl px-4 pb-2 pt-1 text-center outline-none transition-colors hover:bg-white/[0.04]"
            aria-label={`${time}. Double-click to test the iMessage notification.`}
          >
            <span
              className="block text-[88px] font-[275] leading-[0.92] tracking-[-0.06em] text-white"
              suppressHydrationWarning
            >
              {time}
            </span>
          </button>

          <div className="mt-2 flex items-center gap-[7px] text-[13px] font-medium text-white/72">
            <CloudSun size={15} strokeWidth={1.8} aria-hidden="true" />
            <span>Lagos · 29°</span>
            <span className="h-[3px] w-[3px] rounded-full bg-white/40" />
            <span>Harmattan haze</span>
          </div>
        </div>

        <div className="mt-auto">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="glass-deep flex items-center gap-3 rounded-[20px] p-[10px] pr-[13px]"
            onClick={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.track.cover}
              alt=""
              className="h-[46px] w-[46px] rounded-[10px] object-cover shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
              draggable={false}
            />
            <div className="min-w-0 flex-1">
              <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#EFC178]/90">
                On repeat
              </p>
              <p className="truncate text-[13.5px] font-semibold leading-tight text-white">
                {config.track.title}
              </p>
              <p className="truncate text-[11px] leading-tight text-white/55">
                {config.track.artist} · {config.track.bpm} BPM
              </p>
            </div>
            <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white text-black">
              <Play size={15} strokeWidth={2.6} fill="currentColor" aria-hidden="true" />
            </span>
          </motion.div>

          <div className="mt-5 flex flex-col items-center">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onUnlock();
              }}
              className="lock-hint flex flex-col items-center gap-[3px] rounded-xl px-4 py-1 text-white/80 outline-none"
              aria-label="Swipe up to open"
            >
              <ChevronUp size={18} strokeWidth={2.2} aria-hidden="true" />
              <span className="text-[12px] font-medium tracking-[0.01em]">
                Swipe up to open
              </span>
            </button>
            <div className="mt-4 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45">
              <Music2 size={11} aria-hidden="true" />
              <span>Sound on</span>
            </div>
          </div>

          <div className="mt-[18px] flex justify-center">
            <span className="h-[5px] w-[134px] rounded-full bg-white/90" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
