"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CloudSun,
  MapPin,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";
import {
  brandApps,
  config,
  iosApps,
  pageTwoApps,
  type IosApp,
} from "@/lib/config";
import { AppIcon, type OpenApp } from "@/components/AppIcon";
import { Dock } from "@/components/Dock";
import { NowPlayingWidget } from "@/components/NowPlayingWidget";
import { Countdown } from "@/components/Countdown";
import { useAudio } from "@/components/AudioProvider";
import { useClock } from "@/hooks/useClock";
import { formatShortDate } from "@/lib/format";

type Props = {
  onOpen: OpenApp;
  unread?: number;
  locked?: boolean;
};

export function HomeScreen({ onOpen, unread = 0, locked = false }: Props) {
  const [page, setPage] = useState(0);
  const now = useClock();
  const { isPlaying, currentTime, duration, toggle } = useAudio();
  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const weather = useMemo(
    () => iosApps.find((app) => app.id === "weather") as IosApp,
    [],
  );
  const appleMusic = useMemo(
    () => brandApps.find((app) => app.id === "appleMusic") as IosApp,
    [],
  );
  const photos = useMemo(
    () => iosApps.find((app) => app.id === "photos") as IosApp,
    [],
  );

  return (
    <div
      className="absolute inset-0 z-20 flex h-full flex-col"
      style={{
        pointerEvents: locked ? "none" : "auto",
        opacity: locked ? 0 : 1,
        // Snap out of view on lock, then fade in gently once the lock screen
        // has slid away.
        transition: locked ? "none" : "opacity 460ms ease 140ms",
      }}
      aria-hidden={locked || undefined}
    >
      <div className="relative flex-1 overflow-hidden pt-[54px]">
        <motion.div
          className="flex h-full w-[786px] shrink-0"
          drag={locked ? false : "x"}
          dragDirectionLock
          dragConstraints={{ left: -393, right: 0 }}
          dragElastic={0.075}
          dragMomentum={false}
          animate={{ x: -page * 393 }}
          transition={{ type: "spring", stiffness: 320, damping: 34 }}
          onDragEnd={(_, info) => {
            const power = info.offset.x + info.velocity.x * 0.12;
            if (power < -80) setPage(1);
            else if (power > 80) setPage(0);
          }}
        >
          {/* ── Page one ─────────────────────────────────────────────── */}
          <section
            className="h-full w-[393px] shrink-0 px-[18px] pt-[11px]"
            aria-label="Home screen page one"
          >
            <div className="grid grid-cols-2 gap-[12px]">
              <button
                type="button"
                onClick={() => onOpen(weather)}
                className="glass group relative h-[112px] overflow-hidden rounded-[22px] p-[13px] text-left"
                aria-label="Open Weather — Lagos, 29 degrees, harmattan haze"
              >
                <div className="pointer-events-none absolute -right-7 -top-8 h-24 w-24 rounded-full bg-[#FFB45E]/25 blur-2xl transition-transform duration-700 group-hover:scale-110" />
                <div className="relative flex items-center justify-between text-[8px] font-semibold uppercase tracking-[0.16em] text-white/55">
                  <span className="flex items-center gap-1">
                    <MapPin size={8} aria-hidden="true" /> Lagos
                  </span>
                  <ArrowUpRight size={11} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div className="relative mt-[6px] flex items-start justify-between">
                  <div>
                    <p className="text-[37px] font-extralight leading-none tracking-[-0.055em] text-white">
                      29°
                    </p>
                    <p className="mt-[5px] text-[9px] font-medium text-white/55">
                      H:32° L:24°
                    </p>
                  </div>
                  <CloudSun
                    size={31}
                    strokeWidth={1.3}
                    className="mt-[2px] text-[#FFD79A]"
                    aria-hidden="true"
                  />
                </div>
                <p className="absolute bottom-[11px] left-[13px] text-[9px] font-medium text-white/60">
                  Harmattan haze
                </p>
              </button>

              <div className="glass relative h-[112px] overflow-hidden rounded-[22px] p-[12px]">
                <button
                  type="button"
                  onClick={() => onOpen(appleMusic)}
                  className="absolute inset-0 z-[1]"
                  aria-label="Open Now Playing in Apple Music"
                />
                <div className="pointer-events-none relative z-[2] flex items-center justify-between">
                  <span className="flex items-center gap-[4px] text-[7.5px] font-semibold uppercase tracking-[0.16em] text-white/50">
                    <span
                      className={`h-[4px] w-[4px] rounded-full bg-[#EFC178] ${
                        isPlaying ? "animate-pulse" : "opacity-40"
                      }`}
                    />
                    Now playing
                  </span>
                  <span className="text-[7.5px] font-medium text-white/30">03:06</span>
                </div>
                <div className="pointer-events-none relative z-[2] mt-[8px] flex items-center gap-[9px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={config.track.cover}
                    alt=""
                    className="h-[38px] w-[38px] rounded-[8px] object-cover shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
                    draggable={false}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-semibold leading-tight text-white">
                      {config.track.title}
                    </p>
                    <p className="truncate text-[9.5px] leading-tight text-white/50">
                      {config.track.artist}
                    </p>
                  </div>
                </div>
                <div className="pointer-events-none absolute bottom-[13px] left-[12px] right-[46px] z-[2] h-[2px] overflow-hidden rounded-full bg-white/20">
                  <span
                    className="block h-full rounded-full bg-[#EFC178]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => void toggle()}
                  className="absolute bottom-[8px] right-[10px] z-[3] flex h-[27px] w-[27px] items-center justify-center rounded-full bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.45)] transition-transform hover:scale-105 active:scale-90"
                  aria-label={isPlaying ? "Pause Detty December" : "Play Detty December"}
                >
                  {isPlaying ? (
                    <Pause size={12} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                  ) : (
                    <Play
                      size={12}
                      fill="currentColor"
                      strokeWidth={0}
                      className="ml-[1px]"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-[17px] grid grid-cols-4 gap-x-[5px] gap-y-[14px]">
              {iosApps.map((app) => (
                <AppIcon key={app.id} app={app} onOpen={onOpen} />
              ))}
            </div>

            <div className="glass mt-[16px] rounded-[24px] px-[12px] pb-[9px] pt-[9px]">
              <div className="flex items-center justify-between px-[4px]">
                <span className="flex items-center gap-[5px] text-[7.5px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  <Sparkles size={9} strokeWidth={2} aria-hidden="true" />
                  Ugazee essentials
                </span>
                <span className="text-[7px] font-medium uppercase tracking-[0.14em] text-white/30">
                  The sound
                </span>
              </div>
              <div className="mt-[3px] flex items-start justify-around">
                {brandApps.map((app) => (
                  <AppIcon
                    key={app.id}
                    app={app}
                    size="brand"
                    onOpen={onOpen}
                    className="min-w-[86px]"
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ── Page two ─────────────────────────────────────────────── */}
          <section
            className="h-full w-[393px] shrink-0 px-[18px] pt-[11px]"
            aria-label="Home screen page two"
          >
            <NowPlayingWidget onOpenMusic={() => onOpen(appleMusic)} />

            <div className="glass mt-[12px] rounded-[24px] p-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-[7.5px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  The album · {config.album.dropLabel}
                </span>
                <a
                  href={config.album.preSaveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-[3px] text-[7.5px] font-semibold uppercase tracking-[0.12em] text-[#EFC178]/80 hover:text-[#EFC178]"
                  aria-label="Pre-save the Detty December album on Spotify"
                >
                  Pre-save <ArrowUpRight size={9} aria-hidden="true" />
                </a>
              </div>
              <div className="mt-[7px] flex items-end justify-between">
                <div>
                  <p className="text-[19px] font-semibold leading-none tracking-[-0.035em] text-white">
                    {config.album.title}
                  </p>
                  <p className="mt-[4px] text-[9px] font-medium text-white/45">
                    Ugazee · Out {config.album.dropLabel}
                  </p>
                </div>
                <Countdown />
              </div>
            </div>

            <div className="mt-[13px] grid grid-cols-4 gap-x-[5px] gap-y-[9px] px-[8px]">
              {pageTwoApps.map((app, index) => (
                <AppIcon
                  key={`${app.id}-${index}`}
                  app={app}
                  size="page2"
                  onOpen={onOpen}
                />
              ))}
            </div>

            <div className="glass mt-[14px] flex items-center gap-[11px] rounded-[24px] p-[12px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={config.artist.poster}
                alt="Ugazee"
                className="h-[46px] w-[46px] rounded-[12px] object-cover object-top"
                draggable={false}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold leading-tight text-white">
                  Ugazee
                </p>
                <p className="mt-[2px] line-clamp-2 text-[9px] leading-[1.35] text-white/50">
                  {config.artist.tagline} Lagos, NG.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpen(photos)}
                className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/60 hover:bg-white/15 hover:text-white"
                aria-label={`Open Photos — ${formatShortDate(now)}`}
              >
                <ArrowUpRight size={13} strokeWidth={1.8} aria-hidden="true" />
              </button>
            </div>
          </section>
        </motion.div>
      </div>

      <div className="relative z-10 shrink-0 px-[16px] pb-[22px]">
        <div className="mb-[11px] flex items-center justify-center gap-[6px]">
          {[0, 1].map((index) => (
            <button
              key={index}
              type="button"
              onClick={() => setPage(index)}
              className="home-dots"
              data-active={page === index}
              aria-label={`Go to home screen page ${index + 1}`}
              aria-current={page === index}
            />
          ))}
        </div>
        <Dock onOpen={onOpen} unread={unread} />
      </div>
    </div>
  );
}
