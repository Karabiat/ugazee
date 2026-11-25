"use client";

import type { CSSProperties } from "react";
import {
  ArrowUpRight,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { config } from "@/lib/config";
import { formatTime } from "@/lib/format";
import { useAudio } from "@/components/AudioProvider";
import { useAudioAnalyser } from "@/hooks/useAudioAnalyser";

type Props = {
  onOpenMusic: () => void;
};

export function NowPlayingWidget({ onOpenMusic }: Props) {
  const {
    isPlaying,
    currentTime,
    duration,
    seek,
    toggle,
    previous,
    next,
    beat,
  } = useAudio();
  const { bands } = useAudioAnalyser(24);
  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="glass relative overflow-hidden rounded-[26px] p-[14px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={config.track.cover}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 h-[calc(100%+48px)] w-[calc(100%+48px)] scale-110 object-cover opacity-[0.16] blur-2xl"
        draggable={false}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/25 via-black/40 to-black/70" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[5px]">
            <span
              className="h-[5px] w-[5px] rounded-full bg-[#EFC178]"
              style={{
                opacity: isPlaying ? 1 : 0.35,
                boxShadow: isPlaying ? "0 0 8px rgba(239,193,120,0.7)" : "none",
                transform: isPlaying ? `scale(${1 + (beat % 2) * 0.15})` : "scale(1)",
              }}
            />
            <span className="text-[8px] font-semibold uppercase tracking-[0.16em] text-white/50">
              Now playing
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenMusic}
            className="flex h-[24px] w-[24px] items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/60 transition-colors hover:bg-white/15 hover:text-white"
            aria-label="Open Detty December in Apple Music"
          >
            <ArrowUpRight size={12} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-[11px] flex gap-[13px]">
          <div className={`relative shrink-0 ${isPlaying ? "beat-icon" : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.track.cover}
              alt={`${config.track.title} cover art`}
              className="h-[105px] w-[105px] rounded-[16px] object-cover shadow-[0_12px_30px_-10px_rgba(0,0,0,0.8)]"
              style={{ opacity: isPlaying ? 1 : 0.62, transition: "opacity 300ms ease" }}
              draggable={false}
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <p className="truncate text-[18px] font-semibold leading-tight tracking-[-0.03em] text-white">
              {config.track.title}
            </p>
            <p className="truncate text-[12px] font-medium leading-tight text-white/60">
              {config.track.artist}
            </p>
            <p className="mt-[3px] truncate text-[8px] font-semibold uppercase tracking-[0.13em] text-[#EFC178]/70">
              Single · {config.track.year} · {config.track.bpm} bpm
            </p>

            <div className="mt-auto flex items-center gap-[5px] pt-2">
              <button
                type="button"
                onClick={previous}
                aria-label="Previous track — restart Detty December"
                className="flex h-[27px] w-[27px] items-center justify-center rounded-full text-white/65 transition hover:bg-white/10 hover:text-white active:scale-90"
              >
                <SkipBack size={14} fill="currentColor" strokeWidth={1.6} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => void toggle()}
                aria-label={isPlaying ? "Pause Detty December" : "Play Detty December"}
                className="flex h-[33px] w-[33px] items-center justify-center rounded-full bg-white text-black shadow-[0_3px_10px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 active:scale-90"
              >
                {isPlaying ? (
                  <Pause size={14} strokeWidth={0} fill="currentColor" aria-hidden="true" />
                ) : (
                  <Play
                    size={14}
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
                aria-label="Next track — Detty December loops"
                className="flex h-[27px] w-[27px] items-center justify-center rounded-full text-white/65 transition hover:bg-white/10 hover:text-white active:scale-90"
              >
                <SkipForward size={14} fill="currentColor" strokeWidth={1.6} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-[9px] flex h-[18px] items-end gap-[2px]" aria-hidden="true">
          {bands.map((band, index) => (
            <span
              key={index}
              className="flex-1 rounded-full"
              style={{
                height: isPlaying ? `${4 + Math.max(0.08, band) * 14}px` : "3px",
                background:
                  index % 5 === 0
                    ? "rgba(239,193,120,0.8)"
                    : `rgba(255,255,255,${0.16 + band * 0.5})`,
                opacity: isPlaying ? 1 : 0.5,
              }}
            />
          ))}
        </div>

        <input
          type="range"
          min={0}
          max={Math.max(duration, 1)}
          step={0.1}
          value={Math.min(currentTime, duration)}
          onChange={(event) => seek(Number(event.target.value))}
          onPointerDown={(event) => event.stopPropagation()}
          className="island-range mt-[2px]"
          style={{ "--progress": `${progress}%` } as CSSProperties}
          aria-label="Seek through Detty December"
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
        />
        <div className="flex justify-between text-[9px] font-medium leading-none text-white/40 tabular-nums">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
