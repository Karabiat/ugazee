"use client";

import { SkipBack, SkipForward, Play, Pause } from "lucide-react";
import type { CSSProperties, ChangeEvent } from "react";
import { config } from "@/lib/config";
import { formatTime } from "@/lib/format";
import { useAudio } from "@/components/AudioProvider";
import { Visualizer } from "@/components/island/Visualizer";

type Props = {
  onInteract: () => void;
};

export function ExpandedView({ onInteract }: Props) {
  const { isPlaying, currentTime, duration, seek, toggle, previous, next } = useAudio();
  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    onInteract();
    seek(Number(event.target.value));
  };

  return (
    <div
      className="flex h-full flex-col px-[14px] pb-[10px] pt-[11px]"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={onInteract}
    >
      <div className="flex items-center gap-[10px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={config.track.cover}
          alt={`${config.track.title} cover art`}
          className="h-[42px] w-[42px] rounded-[10px] object-cover shadow-[0_3px_10px_rgba(0,0,0,0.45)]"
          style={{
            opacity: isPlaying ? 1 : 0.55,
            transition: "opacity 300ms ease",
          }}
          draggable={false}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-[5px]">
            <span
              className="h-[4px] w-[4px] rounded-full"
              style={{
                background: isPlaying ? "#F0BE79" : "rgba(255,255,255,0.32)",
                boxShadow: isPlaying ? "0 0 6px rgba(240,190,121,0.7)" : "none",
              }}
              aria-hidden="true"
            />
            <span className="text-[7.5px] font-semibold uppercase tracking-[0.16em] text-[#EFC178]/90">
              {isPlaying ? "Now playing" : "Paused"} · On repeat
            </span>
          </div>
          <p className="mt-[1px] truncate text-[13.5px] font-semibold leading-[1.15] tracking-[-0.015em] text-white">
            {config.track.title}
          </p>
          <p className="truncate text-[11px] leading-[1.15] text-white/55">
            {config.track.artist}
          </p>
        </div>

        <div className="flex items-center gap-[1px]">
          <button
            type="button"
            onClick={() => {
              previous();
              onInteract();
            }}
            aria-label="Previous track — restart Detty December"
            className="flex h-[27px] w-[27px] items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white active:scale-90"
          >
            <SkipBack size={14} fill="currentColor" strokeWidth={1.6} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => {
              void toggle();
              onInteract();
            }}
            aria-label={isPlaying ? "Pause Detty December" : "Play Detty December"}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.45)] transition-transform hover:scale-105 active:scale-90"
          >
            {isPlaying ? (
              <Pause size={13} strokeWidth={0} fill="currentColor" aria-hidden="true" />
            ) : (
              <Play
                size={13}
                strokeWidth={0}
                fill="currentColor"
                className="ml-[1px]"
                aria-hidden="true"
              />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              next();
              onInteract();
            }}
            aria-label="Next track — Detty December loops"
            className="flex h-[27px] w-[27px] items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white active:scale-90"
          >
            <SkipForward size={14} fill="currentColor" strokeWidth={1.6} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-[6px] flex h-[26px] items-center">
        <Visualizer variant="expanded" />
      </div>

      <div className="mt-auto">
        <input
          type="range"
          min={0}
          max={Math.max(duration, 1)}
          step={0.1}
          value={Math.min(currentTime, duration)}
          onChange={handleSeek}
          onPointerDown={onInteract}
          onKeyDown={onInteract}
          className="island-range block"
          style={{ "--progress": `${progress}%` } as CSSProperties}
          aria-label="Seek through Detty December"
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
        />
        <div className="mt-[1px] flex items-center justify-between text-[9px] font-medium leading-none tabular-nums text-white/45">
          <span>{formatTime(currentTime)}</span>
          <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
        </div>
      </div>
    </div>
  );
}
