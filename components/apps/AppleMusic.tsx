"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Heart,
  Library,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Search,
  Shuffle,
} from "lucide-react";
import { config, type Release } from "@/lib/config";
import { useAudio } from "@/components/AudioProvider";
import { BrandMark } from "@/components/apps/BrandIcons";
import {
  AppMiniPlayer,
  ReleaseDetail,
  SectionHeading,
  TrackEqualizer,
} from "@/components/apps/Shared";

const ACCENT = "#FA2D48";

export function AppleMusic({ onClose }: { onClose: () => void }) {
  const [detail, setDetail] = useState<Release | null>(null);
  const { isPlaying, toggle, seek } = useAudio();

  const latest: Release = config.discography[0];
  const albums = useMemo(
    () => config.discography.filter((release) => release.type !== "Single"),
    [],
  );
  const singles = useMemo(
    () => config.discography.filter((release) => release.type === "Single"),
    [],
  );
  const essentials = useMemo(
    () => [config.discography[1], config.discography[2], config.discography[3]],
    [],
  );

  return (
    <div className="absolute inset-0 z-50 overflow-hidden bg-[#080506] text-white">
      <div className="no-scrollbar absolute inset-0 overflow-y-auto">
        <div className="relative h-[354px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={config.artist.poster}
            alt=""
            className="absolute inset-0 h-full w-full scale-[1.02] object-cover object-[50%_18%]"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-[#2a0a10]/25 to-[#080506]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,4,8,0.75),transparent_78%)]" />
          <div className="absolute inset-x-0 top-0 h-[150px] bg-gradient-to-b from-[#2a0a10]/70 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 px-[20px] pb-[18px]">
            <span className="text-[8.5px] font-bold uppercase tracking-[0.2em] text-[#FA2D48]">
              Artist
            </span>
            <div className="mt-[3px] flex items-center gap-[7px]">
              <h1 className="text-[54px] font-bold leading-[0.85] tracking-[-0.055em] text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
                Ugazee
              </h1>
              <BadgeCheck
                size={19}
                className="mt-1 text-white"
                fill="#FA2D48"
                strokeWidth={1.2}
                aria-hidden="true"
              />
            </div>
            <p className="mt-[7px] text-[10px] font-medium text-white/60">
              4,981 monthly listeners · Lagos, NG
            </p>
            <div className="mt-[13px] flex items-center gap-[9px]">
              <button
                type="button"
                onClick={() => void toggle()}
                className="flex h-[36px] items-center gap-[6px] rounded-full bg-[#FA2D48] px-[15px] text-[10.5px] font-bold uppercase tracking-[0.05em] text-white shadow-[0_8px_24px_rgba(250,45,72,0.28)] transition hover:scale-[1.02] active:scale-95"
                aria-label={isPlaying ? "Pause Detty December" : "Play Detty December"}
              >
                {isPlaying ? (
                  <Pause size={13} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                ) : (
                  <Play size={13} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                )}
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                className="flex h-[36px] items-center gap-[6px] rounded-full border border-white/20 bg-black/20 px-[14px] text-[10.5px] font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
                aria-label="Follow Ugazee"
              >
                <Plus size={13} strokeWidth={2.2} aria-hidden="true" />
                Follow
              </button>
              <button
                type="button"
                className="ml-auto flex h-[32px] w-[32px] items-center justify-center rounded-full bg-black/25 text-white/70 backdrop-blur-md hover:bg-black/40 hover:text-white"
                aria-label="More options"
              >
                <MoreHorizontal size={19} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative pb-[120px]">
          <div className="absolute inset-x-0 top-0 h-[120px] bg-gradient-to-b from-[#2a0a10]/70 to-transparent" />

          <section className="relative px-[18px] pt-[8px]" aria-labelledby="am-latest">
            <SectionHeading
              title="Latest Release"
              action={
                <button
                  type="button"
                  onClick={() => setDetail(latest)}
                  className="flex items-center gap-[2px] text-[9px] font-semibold uppercase tracking-[0.1em] text-[#FA2D48]"
                  aria-label="See all releases"
                >
                  See All <ChevronRight size={12} aria-hidden="true" />
                </button>
              }
            />
            <div className="mt-[10px] rounded-[18px] border border-white/[0.08] bg-gradient-to-br from-white/[0.075] to-white/[0.025] p-[11px] shadow-[0_22px_50px_-20px_rgba(0,0,0,0.9)]">
              <div className="flex gap-[12px]">
                <button
                  type="button"
                  onClick={() => setDetail(latest)}
                  className="relative h-[132px] w-[132px] shrink-0 overflow-hidden rounded-[11px] shadow-[0_10px_25px_-8px_rgba(0,0,0,0.8)]"
                  aria-label="Open Detty December"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={latest.cover}
                    alt="Detty December cover art"
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </button>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-[7.5px] font-bold uppercase tracking-[0.16em] text-[#FA2D48]">
                    New single
                  </span>
                  <button
                    type="button"
                    onClick={() => setDetail(latest)}
                    className="mt-[2px] text-left"
                  >
                    <p className="text-[19px] font-bold leading-[1.05] tracking-[-0.035em] text-white">
                      {latest.title}
                    </p>
                    <p className="mt-[2px] text-[10px] font-medium text-white/50">
                      Ugazee · {latest.type} · {latest.year}
                    </p>
                  </button>
                  <p className="mt-[5px] line-clamp-2 text-[8.5px] leading-[1.4] text-white/35">
                    {latest.blurb}
                  </p>
                  <div className="mt-auto flex items-center gap-[6px]">
                    <button
                      type="button"
                      onClick={() => {
                        if (isPlaying) void toggle();
                        else {
                          seek(0);
                          void toggle();
                        }
                      }}
                      className="flex h-[30px] items-center gap-[4px] rounded-full bg-[#FA2D48] px-[12px] text-[9px] font-bold uppercase tracking-[0.04em] text-white active:scale-95"
                      aria-label={isPlaying ? "Pause Detty December" : "Play Detty December"}
                    >
                      {isPlaying ? (
                        <Pause size={10} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                      ) : (
                        <Play size={10} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                      )}
                      {isPlaying ? "Pause" : "Listen"}
                    </button>
                    <button
                      type="button"
                      className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-white/15 text-white/60 hover:bg-white/10 hover:text-white"
                      aria-label="Add Detty December to your library"
                    >
                      <Plus size={13} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-[9px] border-t border-white/[0.07] pt-[5px]">
                {latest.tracklist.slice(0, 2).map((track) => {
                  const current = track.featured;
                  return (
                    <div
                      key={track.title}
                      className="flex items-center gap-[8px] px-[2px] py-[5px]"
                    >
                      <span className="w-[10px] text-[8px] tabular-nums text-white/28">
                        {current ? "1" : "2"}
                      </span>
                      <p
                        className="min-w-0 flex-1 truncate text-[10px] font-medium"
                        style={{ color: current ? ACCENT : "rgba(255,255,255,0.8)" }}
                      >
                        {track.title}
                      </p>
                      {current && <TrackEqualizer playing={isPlaying} color={ACCENT} />}
                      <span className="text-[8.5px] tabular-nums text-white/35">
                        {track.duration}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="mt-[23px]" aria-labelledby="am-albums">
            <SectionHeading
              title="Albums & EPs"
              className="px-[22px]"
              action={<ChevronRight size={16} className="text-white/30" aria-hidden="true" />}
            />
            <div className="no-scrollbar mt-[10px] flex gap-[12px] overflow-x-auto px-[18px]">
              {albums.map((release) => (
                <button
                  key={release.id}
                  type="button"
                  onClick={() => setDetail(release)}
                  className="w-[138px] shrink-0 text-left"
                  aria-label={`Open ${release.title}`}
                >
                  <div className="relative overflow-hidden rounded-[9px] bg-white/5 shadow-[0_12px_28px_-12px_rgba(0,0,0,0.8)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={release.cover}
                      alt=""
                      className="aspect-square w-full object-cover"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  </div>
                  <p className="mt-[7px] truncate text-[11px] font-semibold text-white/92">
                    {release.title}
                  </p>
                  <p className="mt-[1px] text-[9px] text-white/35">
                    Ugazee · {release.year}
                  </p>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-[22px]" aria-labelledby="am-essentials">
            <SectionHeading title="Essentials" className="px-[22px]" />
            <div className="mt-[9px] px-[18px]">
              <div className="relative overflow-hidden rounded-[16px] border border-white/10 bg-gradient-to-br from-[#41131b] via-[#220b10] to-[#0d0709] p-[14px]">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#FA2D48]/20 blur-3xl" />
                <p className="text-[7.5px] font-bold uppercase tracking-[0.18em] text-[#FA2D48]">
                  Playlist · Updated weekly
                </p>
                <p className="mt-[3px] text-[24px] font-bold leading-tight tracking-[-0.04em] text-white">
                  Ugazee: The Hits
                </p>
                <p className="mt-[2px] text-[9px] text-white/45">
                  24 songs · 1 hr 27 min
                </p>
                <div className="mt-[12px] flex gap-[6px]">
                  {essentials.map((release) => (
                    <button
                      key={release.id}
                      type="button"
                      onClick={() => setDetail(release)}
                      className="h-[48px] w-[48px] overflow-hidden rounded-[6px] border border-white/10"
                      aria-label={`Open ${release.title}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={release.cover}
                        alt=""
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setDetail(singles[0] ?? latest)}
                    className="flex h-[48px] w-[48px] items-center justify-center rounded-[6px] border border-white/15 bg-white/[0.06] text-white/70"
                    aria-label="See all essentials"
                  >
                    <ChevronRight size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-[22px]" aria-labelledby="am-singles">
            <SectionHeading title="Singles & EPs" className="px-[22px]" />
            <div className="mt-[8px] px-[18px]">
              {singles.map((release, index) => (
                <button
                  key={release.id}
                  type="button"
                  onClick={() => setDetail(release)}
                  className="flex w-full items-center gap-[10px] border-b border-white/[0.06] py-[8px] text-left last:border-0"
                  aria-label={`Open ${release.title}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={release.cover}
                    alt=""
                    className="h-[42px] w-[42px] rounded-[5px] object-cover"
                    draggable={false}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-semibold text-white/90">
                      {release.title}
                    </p>
                    <p className="text-[9px] text-white/35">
                      Ugazee · {release.type} · {release.year}
                    </p>
                  </div>
                  <span className="text-[8.5px] text-white/25">
                    {release.tracklist.length} track{release.tracklist.length === 1 ? "" : "s"}
                  </span>
                  <ChevronRight size={13} className="text-white/25" aria-hidden="true" />
                  <span className="sr-only">{index + 1}</span>
                </button>
              ))}
            </div>
          </section>

          <footer className="mt-6 px-[22px] text-[8px] leading-relaxed text-white/22">
            <p>© 2026 Ugazee. Apple Music concept experience.</p>
          </footer>
        </div>
      </div>

      {/* Persistent top nav */}
      <div className="pointer-events-none absolute inset-x-0 top-[54px] z-30 flex h-[44px] items-center justify-between px-[14px]">
        <button
          type="button"
          onClick={onClose}
          className="pointer-events-auto flex h-[32px] w-[32px] items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-lg transition hover:bg-black/50 active:scale-90"
          aria-label="Back to Home Screen"
        >
          <ChevronLeft size={22} strokeWidth={2.2} aria-hidden="true" />
        </button>
        <span className="flex items-center gap-[5px] text-[10px] font-semibold text-white/85">
          <BrandMark id="appleMusic" className="h-[17px] w-[17px]" />
          <span className="tracking-[-0.02em]">Listen Now</span>
        </span>
        <div className="pointer-events-auto flex items-center gap-1">
          <button
            type="button"
            className="flex h-[31px] w-[31px] items-center justify-center rounded-full bg-black/30 text-white/75 backdrop-blur-lg hover:bg-black/50 hover:text-white"
            aria-label="Search Apple Music"
          >
            <Search size={16} strokeWidth={1.9} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="flex h-[31px] w-[31px] items-center justify-center rounded-full bg-black/30 text-white/75 backdrop-blur-lg hover:bg-black/50 hover:text-white"
            aria-label="Your Library"
          >
            <Library size={16} strokeWidth={1.9} aria-hidden="true" />
          </button>
        </div>
      </div>

      <AppMiniPlayer platform="appleMusic" accent={ACCENT} />

      <AnimatePresence>
        {detail && (
          <ReleaseDetail
            key={detail.id}
            release={detail}
            platform="appleMusic"
            accent={ACCENT}
            background="linear-gradient(180deg,#2a0a10 0%,#080506 60%)"
            onBack={() => setDetail(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
