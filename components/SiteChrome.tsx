"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { config } from "@/lib/config";
import { useAudio } from "@/components/AudioProvider";
import { formatTime } from "@/lib/format";

export function Masthead() {
  const { isMuted, toggleMute, isPlaying } = useAudio();

  return (
    <header className="masthead">
      <a
        href="#hero"
        className="wordmark"
        aria-label="Ugazee — back to the top"
      >
        UGAZEE
        <span className="hidden text-[9px] font-semibold uppercase tracking-[0.2em] text-white/35 sm:inline">
          Detty December
        </span>
      </a>

      <div className="flex items-center gap-[clamp(14px,2vw,26px)]">
        <nav className="hidden items-center gap-[clamp(16px,2vw,26px)] sm:flex" aria-label="Sections">
          <a href="#story" className="site-link">
            The roll-out
          </a>
          <a href="#listen" className="site-link">
            Listen
          </a>
        </nav>

        <button
          type="button"
          onClick={toggleMute}
          aria-pressed={isMuted}
          aria-label={isMuted ? "Unmute the record" : "Mute the record"}
          className="flex h-[32px] items-center gap-[7px] rounded-full border border-white/15 bg-white/[0.04] px-[11px] text-[9px] font-semibold uppercase tracking-[0.14em] text-white/55 backdrop-blur-md transition-colors hover:border-white/30 hover:text-white"
        >
          {isMuted ? (
            <VolumeX size={13} aria-hidden="true" />
          ) : (
            <Volume2 size={13} aria-hidden="true" />
          )}
          <span className="hidden sm:inline">{isMuted ? "Muted" : "Sound"}</span>
          {isPlaying && !isMuted && (
            <span
              className="hidden h-[4px] w-[4px] rounded-full bg-[#EFC178] sm:block"
              aria-hidden="true"
            />
          )}
        </button>
      </div>
    </header>
  );
}

export function Hero() {
  const { isPlaying, toggle, currentTime, duration } = useAudio();

  return (
    <section
      id="hero"
      className="hero-section relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
      aria-label="Ugazee — Detty December"
    >
      <div className="hero-glow" aria-hidden="true" />

      <div className="hero-copy relative z-10 mx-auto w-full max-w-[1600px] px-[clamp(20px,3.2vw,52px)] pb-[clamp(26px,5vh,68px)]">
        <div className="hidden items-end justify-between gap-10 lg:flex">
          <div className="max-w-[400px]">
            <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-[#EFC178]/80">
              Lagos, NG · {config.track.year} · {config.track.bpm} BPM
            </p>
            <h1 className="display-outline mt-[8px] text-[clamp(70px,8.6vw,140px)]">UGAZEE</h1>
            <p className="mt-[14px] max-w-[320px] text-[12.5px] leading-[1.6] text-white/45">
              {config.artist.tagline} The new single lives inside the phone —
              swipe up, press play, and let the island do the rest.
            </p>

            <div className="mt-[22px] flex flex-wrap items-center gap-[10px]">
              <button
                type="button"
                onClick={() => void toggle()}
                className="inline-flex h-[40px] items-center gap-[8px] rounded-full bg-[#EFC178] px-[18px] text-[9.5px] font-bold uppercase tracking-[0.12em] text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
                aria-label={isPlaying ? "Pause Detty December" : "Play Detty December"}
              >
                {isPlaying ? (
                  <Pause size={13} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                ) : (
                  <Play size={13} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                )}
                {isPlaying ? "Pause the record" : "Play Detty December"}
              </button>
              <a
                href="#story"
                className="inline-flex h-[40px] items-center gap-[7px] rounded-full border border-white/15 px-[16px] text-[9.5px] font-semibold uppercase tracking-[0.12em] text-white/60 transition-colors hover:border-white/30 hover:text-white"
              >
                The roll-out
                <ArrowDown size={13} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="w-[286px] shrink-0">
            <div className="glass-deep rounded-[18px] p-[12px]">
              <div className="flex items-center gap-[10px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={config.track.cover}
                  alt={`${config.track.title} cover art`}
                  className="h-[46px] w-[46px] rounded-[9px] object-cover"
                  draggable={false}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[7.5px] font-semibold uppercase tracking-[0.18em] text-[#EFC178]/80">
                    Now on repeat
                  </p>
                  <p className="truncate text-[12.5px] font-semibold leading-tight text-white">
                    {config.track.title}
                  </p>
                  <p className="truncate text-[10px] text-white/45">
                    {config.track.artist} · {formatTime(duration)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void toggle()}
                  className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105 active:scale-90"
                  aria-label={isPlaying ? "Pause Detty December" : "Play Detty December"}
                >
                  {isPlaying ? (
                    <Pause size={11} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                  ) : (
                    <Play size={11} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                  )}
                </button>
              </div>
              <div className="mt-[10px] h-[2px] w-full overflow-hidden rounded-full bg-white/10">
                <span
                  className="block h-full rounded-full bg-[#EFC178] transition-[width] duration-300"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <p className="mt-[9px] flex items-center gap-[6px] text-[8px] uppercase tracking-[0.16em] text-white/30">
                <span className="h-[4px] w-[4px] rounded-full bg-[#EFC178]/70" aria-hidden="true" />
                Live in the Dynamic Island
              </p>
            </div>

            <p className="mt-[12px] flex items-center justify-end gap-[6px] text-[8.5px] uppercase tracking-[0.18em] text-white/25">
              Swipe up on the phone to start
              <ArrowUp size={11} aria-hidden="true" />
            </p>
          </div>
        </div>
      </div>

      <div
        className="hero-copy pointer-events-none absolute inset-x-0 top-[calc(50%+250px)] z-10 hidden justify-center lg:flex"
        aria-hidden="true"
      >
        <span className="flex flex-col items-center gap-[6px] text-[8px] font-semibold uppercase tracking-[0.24em] text-white/22">
          Scroll
          <span className="h-[38px] w-px bg-gradient-to-b from-white/30 to-transparent" />
        </span>
      </div>
    </section>
  );
}

export function SiteFooter() {
  const { isMuted, toggleMute, isPlaying } = useAudio();

  return (
    <footer
      id="listen"
      className="site-footer relative z-[40] border-t border-white/10 bg-[#050403] px-[clamp(20px,3.2vw,52px)] pb-[38px] pt-[clamp(54px,8vw,110px)]"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-[#EFC178]/75">
              Detty December · out {config.album.dropLabel}
            </p>
            <p className="display-outline mt-[6px] text-[clamp(52px,7vw,104px)]">UGAZEE</p>
          </div>
          <a
            href={config.album.preSaveUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex h-[44px] items-center gap-[8px] rounded-full bg-[#EFC178] px-[22px] text-[10px] font-bold uppercase tracking-[0.1em] text-black transition-transform hover:scale-[1.02]"
          >
            Pre-save the album
            <ArrowUpRight size={14} strokeWidth={2.6} aria-hidden="true" />
          </a>
        </div>

        <div className="mt-[clamp(40px,6vw,84px)] grid gap-[28px] border-t border-white/10 pt-[clamp(26px,4vw,48px)] sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-white/30">
              Listen
            </p>
            <ul className="mt-[12px] space-y-[8px]">
              {(["spotify", "appleMusic", "soundcloud"] as const).map((key) => {
                const platform = config.platforms[key];
                return (
                  <li key={key}>
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group inline-flex items-center gap-[6px] text-[12px] text-white/60 transition-colors hover:text-white"
                    >
                      {platform.name}
                      <ArrowUpRight
                        size={11}
                        className="text-white/25 transition-transform group-hover:-translate-y-[1px] group-hover:translate-x-[1px]"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-white/30">
              Follow
            </p>
            <ul className="mt-[12px] space-y-[8px]">
              {config.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group inline-flex items-center gap-[6px] text-[12px] text-white/60 transition-colors hover:text-white"
                  >
                    {social.label}
                    <ArrowUpRight
                      size={11}
                      className="text-white/25 transition-transform group-hover:-translate-y-[1px] group-hover:translate-x-[1px]"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-white/30">
              Contact
            </p>
            <ul className="mt-[12px] space-y-[8px] text-[12px] text-white/60">
              <li>
                <a
                  href={`mailto:${config.artist.email}`}
                  className="transition-colors hover:text-white"
                >
                  {config.artist.email}
                </a>
              </li>
              <li>{config.artist.location}</li>
              <li>
                <a href="#hero" className="inline-flex items-center gap-[5px] transition-colors hover:text-white">
                  Back to the phone
                  <ArrowUp size={11} aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-white/30">
              The record
            </p>
            <div className="mt-[12px] flex items-center gap-[10px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={config.track.cover}
                alt=""
                className="h-[44px] w-[44px] rounded-[8px] object-cover"
                draggable={false}
              />
              <div>
                <p className="text-[12px] font-medium text-white/80">{config.track.title}</p>
                <p className="text-[10px] text-white/40">
                  {config.track.artist} · {config.track.bpm} BPM
                </p>
              </div>
            </div>
            <p className="mt-[12px] max-w-[230px] text-[9px] leading-[1.6] text-white/25">
              A concept experience. Every app, notification and lock screen is a
              simulation built around one song.
            </p>
          </div>
        </div>

        <div className="mt-[clamp(34px,5vw,64px)] flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-[18px] text-[8px] uppercase tracking-[0.16em] text-white/22">
          <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[8px]">
            <p>© 2026 Ugazee. All rights reserved.</p>
            <button
              type="button"
              onClick={toggleMute}
              aria-pressed={isMuted}
              aria-label={isMuted ? "Unmute the record" : "Mute the record"}
              className="inline-flex items-center gap-[5px] uppercase tracking-[0.16em] transition-colors hover:text-white/60 min-[820px]:hidden"
            >
              {isMuted ? (
                <VolumeX size={12} aria-hidden="true" />
              ) : (
                <Volume2 size={12} aria-hidden="true" />
              )}
              {isMuted ? "Sound off" : isPlaying ? "Sound on" : "Sound"}
            </button>
          </div>
          <p>Built with sound on · Best with headphones</p>
        </div>
      </div>
    </footer>
  );
}
