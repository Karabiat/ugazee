"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronLeft,
  MoreHorizontal,
  Pause,
  Play,
  Share2,
} from "lucide-react";
import { config, type PlatformKey, type Release } from "@/lib/config";
import { useAudio } from "@/components/AudioProvider";
import { formatTime } from "@/lib/format";

export function TrackEqualizer({
  playing,
  color,
  size = "sm",
}: {
  playing: boolean;
  color: string;
  size?: "sm" | "md";
}) {
  const heights = size === "md" ? [9, 14, 11, 16] : [5, 9, 7, 11];
  return (
    <span
      className={`inline-flex items-end ${size === "md" ? "gap-[2.5px]" : "gap-[2px]"}`}
      aria-label={playing ? "Currently playing" : "Paused"}
      role="img"
    >
      {heights.map((height, index) => (
        <span
          key={index}
          className={playing ? "eq-bar" : ""}
          style={
            {
              width: size === "md" ? 3 : 2,
              height,
              borderRadius: 99,
              background: color,
              transformOrigin: "bottom",
              animationDelay: `${index * 0.12}s`,
              animationDuration: "0.8s",
              animationPlayState: playing ? "running" : "paused",
              transform: playing ? undefined : "scaleY(0.36)",
              opacity: playing ? 1 : 0.65,
            } as CSSProperties
          }
        />
      ))}
    </span>
  );
}

export function Waveform({
  seed = 1,
  color = "#FF5500",
  count = 54,
  progress = 0.38,
  height = 28,
}: {
  seed?: number;
  color?: string;
  count?: number;
  progress?: number;
  height?: number;
}) {
  return (
    <div
      className="flex w-full items-center gap-[2px]"
      style={{ height }}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, index) => {
        const amount = 0.16 + Math.abs(Math.sin(index * 0.73 + seed * 2.1)) * 0.84;
        const active = index / count < progress;
        return (
          <span
            key={index}
            className="flex-1 rounded-full"
            style={{
              height: Math.max(2, amount * height),
              background: active ? color : "rgba(255,255,255,0.18)",
              opacity: active ? 0.9 : 0.55,
            }}
          />
        );
      })}
    </div>
  );
}

export function SectionHeading({
  title,
  action,
  className = "",
}: {
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <h2 className="text-[16px] font-bold tracking-[-0.025em] text-white">{title}</h2>
      {action}
    </div>
  );
}

type DetailProps = {
  release: Release;
  platform: PlatformKey;
  accent: string;
  onBack: () => void;
  background?: string;
};

export function ReleaseDetail({
  release,
  platform,
  accent,
  onBack,
  background = "#050505",
}: DetailProps) {
  const { isPlaying, currentTime } = useAudio();
  const platformInfo = config.platforms[platform];
  const currentTrack =
    release.tracklist.find((track) => track.featured)?.title === config.track.title &&
    currentTime > 0;
  const active = currentTrack || release.tracklist.some((t) => t.featured);

  return (
    <motion.div
      initial={{ opacity: 0, x: 34 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 34 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className="no-scrollbar absolute inset-0 z-10 overflow-y-auto"
      style={{ background }}
    >
      <div className="sticky top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent px-[14px] pb-2 pt-[58px] backdrop-blur-md">
        <button
          type="button"
          onClick={onBack}
          className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 active:scale-90"
          aria-label="Back"
        >
          <ChevronLeft size={20} strokeWidth={2.2} aria-hidden="true" />
        </button>
        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/55">
          {release.type}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
            aria-label={`Share ${release.title}`}
          >
            <Share2 size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
            aria-label="More options"
          >
            <MoreHorizontal size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="px-[18px] pb-[112px]">
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.08, type: "spring", stiffness: 260, damping: 26 }}
          className="relative mx-auto aspect-square w-[220px] overflow-hidden rounded-[16px] shadow-[0_28px_60px_-18px_rgba(0,0,0,0.9)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={release.cover}
            alt={`${release.title} cover art`}
            className="h-full w-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        </motion.div>

        <div className="mt-5">
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-[8px] py-[3px] text-[8px] font-bold uppercase tracking-[0.12em]"
              style={{ background: `${accent}22`, color: accent }}
            >
              {release.type}
            </span>
            <span className="text-[10px] font-medium text-white/45">{release.year}</span>
          </div>
          <h1 className="mt-2 text-[34px] font-bold leading-[0.95] tracking-[-0.045em] text-white">
            {release.title}
          </h1>
          <p className="mt-2 text-[11px] leading-[1.5] text-white/50">{release.blurb}</p>
          <p className="mt-2 text-[10px] font-medium text-white/35">
            Ugazee · {release.tracklist.length} track
            {release.tracklist.length === 1 ? "" : "s"} · {release.year}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <a
            href={release.links[platform]}
            target="_blank"
            rel="noreferrer noopener"
            className="flex h-[40px] flex-1 items-center justify-center gap-2 rounded-full text-[11px] font-bold uppercase tracking-[0.06em] text-black transition-transform hover:scale-[1.01] active:scale-[0.98]"
            style={{ background: accent }}
            aria-label={`${platformInfo.label} — opens in a new tab`}
          >
            {platformInfo.label} <ArrowUpRight size={14} strokeWidth={2.6} aria-hidden="true" />
          </a>
          <button
            type="button"
            className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-white/15 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label={`Save ${release.title}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 20s-7-4.35-7-9.5A3.9 3.9 0 0 1 12 7a3.9 3.9 0 0 1 7 3.5C19 15.65 12 20 12 20Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[12px] font-bold uppercase tracking-[0.1em] text-white/70">
              Tracklist
            </h2>
            <span className="text-[9px] font-medium text-white/30">
              {release.year} · Ugazee
            </span>
          </div>
          <div className="overflow-hidden rounded-[14px] border border-white/[0.07] bg-white/[0.025]">
            {release.tracklist.map((track, index) => {
              const isCurrent = track.featured && active;
              return (
                <div
                  key={track.title}
                  className="flex items-center gap-[10px] border-b border-white/[0.055] px-[12px] py-[11px] last:border-b-0"
                >
                  <span className="w-[14px] text-[10px] tabular-nums text-white/28">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className="truncate text-[11.5px] font-medium"
                      style={{ color: isCurrent ? accent : "rgba(255,255,255,0.9)" }}
                    >
                      {track.title}
                    </p>
                    <p className="text-[8.5px] text-white/35">Ugazee</p>
                  </div>
                  {isCurrent && (
                    <TrackEqualizer playing={isPlaying} color={accent} />
                  )}
                  <span className="text-[9px] tabular-nums text-white/35">
                    {track.duration}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-5 text-[8.5px] leading-relaxed text-white/25">
          © {release.year} Ugazee. All rights reserved. ℗ {release.year} Ugazee.
        </p>
      </div>

      <AppMiniPlayer platform={platform} accent={accent} />
    </motion.div>
  );
}

export function AppMiniPlayer({
  platform,
  accent,
}: {
  platform: PlatformKey;
  accent: string;
}) {
  const { isPlaying, currentTime, duration, toggle, previous, next } = useAudio();
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="pointer-events-none absolute inset-x-[10px] bottom-[40px] z-[60] flex justify-center">
      <div
        className="pointer-events-auto flex w-full items-center gap-[9px] overflow-hidden rounded-[14px] border border-white/10 bg-[#1a1a1a]/95 px-[8px] py-[7px] shadow-[0_18px_40px_-10px_rgba(0,0,0,0.9)] backdrop-blur-xl"
        style={{ boxShadow: `0 18px 40px -10px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={config.track.cover}
          alt=""
          className="h-[34px] w-[34px] rounded-[7px] object-cover"
          draggable={false}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10.5px] font-semibold leading-tight text-white">
            {config.track.title}
          </p>
          <p className="truncate text-[8.5px] leading-tight text-white/45">
            {config.track.artist} · {platform === "appleMusic" ? "Apple Music" : config.platforms[platform].name}
          </p>
          <div className="mt-[3px] h-[1.5px] w-full overflow-hidden rounded-full bg-white/15">
            <span
              className="block h-full rounded-full"
              style={{ width: `${progress}%`, background: accent }}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={previous}
          className="flex h-[24px] w-[24px] items-center justify-center text-white/55 hover:text-white"
          aria-label="Restart Detty December"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 6v12M5 6l9 6-9 6V6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => void toggle()}
          className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full bg-white text-black"
          aria-label={isPlaying ? "Pause Detty December" : "Play Detty December"}
        >
          {isPlaying ? (
            <Pause size={12} strokeWidth={0} fill="currentColor" aria-hidden="true" />
          ) : (
            <Play
              size={12}
              strokeWidth={0}
              fill="currentColor"
              className="ml-[1px]"
              aria-hidden="true"
            />
          )}
        </button>
        <button
          type="button"
          onClick={next}
          className="flex h-[24px] w-[24px] items-center justify-center text-white/55 hover:text-white"
          aria-label="Next track — Detty December loops"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 6v12M19 6l-9 6 9 6V6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function TrackRow({
  index,
  title,
  subtitle,
  playing,
  paused,
  color,
  cover,
  onPlay,
  trailing,
}: {
  index: number;
  title: string;
  subtitle?: string;
  playing: boolean;
  paused?: boolean;
  color: string;
  cover: string;
  onPlay?: () => void;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-[9px] rounded-[10px] px-[3px] py-[7px] transition-colors hover:bg-white/[0.045]">
      <span className="w-[12px] text-[9px] tabular-nums text-white/28">{index}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cover}
        alt=""
        className="h-[36px] w-[36px] rounded-[5px] object-cover"
        draggable={false}
      />
      <div className="min-w-0 flex-1">
        <p
          className="truncate text-[11.5px] font-medium leading-tight"
          style={{ color: playing ? color : "rgba(255,255,255,0.92)" }}
        >
          {title}
        </p>
        <p className="truncate text-[8.5px] leading-tight text-white/35">{subtitle}</p>
      </div>
      {playing && <TrackEqualizer playing={!paused} color={color} />}
      <button
        type="button"
        onClick={onPlay}
        className="flex h-[25px] w-[25px] items-center justify-center rounded-full text-white/40 hover:bg-white/10 hover:text-white"
        aria-label={playing && !paused ? `Pause ${title}` : `Play ${title}`}
      >
        {playing && !paused ? (
          <Pause size={11} fill="currentColor" strokeWidth={0} aria-hidden="true" />
        ) : (
          <Play size={11} fill="currentColor" strokeWidth={0} aria-hidden="true" />
        )}
      </button>
      {trailing}
    </div>
  );
}

export function formatDuration(duration: number) {
  return formatTime(duration);
}
