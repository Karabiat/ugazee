"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  ChevronLeft,
  Heart,
  Library,
  MoreHorizontal,
  Pause,
  Play,
  Search,
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

const ACCENT = "#1ED760";

const playCounts = [
  "67,511",
  "18,530",
  "12,033",
  "8,368",
  "4,641",
];

export function Spotify({ onClose }: { onClose: () => void }) {
  const [detail, setDetail] = useState<Release | null>(null);
  const { isPlaying, toggle } = useAudio();

  const popular = useMemo(() => {
    const order = ["iskaba-lol-remix", "no-fi-whine", "cancun-mexico", "backup", "ugazee-nigeria"];
    return order
      .map((id) => config.discography.find((release) => release.id === id))
      .filter((release): release is NonNullable<typeof release> => Boolean(release))
      .map((release, index) => ({
        release: release as Release,
        track: release.tracklist[0],
        plays: playCounts[index],
      }));
  }, []);

  const albums = config.discography.filter((release) => release.type !== "Single");
  const singles = config.discography.filter((release) => release.type === "Single");

  return (
    <div className="absolute inset-0 z-50 overflow-hidden bg-[#050505] text-white">
      <div className="no-scrollbar absolute inset-0 overflow-y-auto">
        {/* Artist banner */}
        <div className="relative h-[318px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={config.artist.poster}
            alt=""
            className="absolute inset-0 h-full w-full scale-[1.03] object-cover object-[50%_22%]"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-[#050505]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.55),transparent_75%)]" />
          <div className="absolute inset-x-0 top-0 h-[110px] bg-gradient-to-b from-black/70 to-transparent" />

          <div className="absolute inset-x-0 top-[58px] flex items-center justify-between px-[14px]">
            <button
              type="button"
              onClick={onClose}
              className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-lg transition hover:bg-black/50 active:scale-90"
              aria-label="Back to Home Screen"
            >
              <ChevronLeft size={22} strokeWidth={2.2} aria-hidden="true" />
            </button>
            <span className="flex items-center gap-[6px] text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
              <BrandMark id="spotify" className="h-[18px] w-[18px]" />
              Spotify
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-black/30 text-white/85 backdrop-blur-lg hover:bg-black/50"
                aria-label="Search Spotify"
              >
                <Search size={17} strokeWidth={1.9} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-black/30 text-white/85 backdrop-blur-lg hover:bg-black/50"
                aria-label="Your Library"
              >
                <Library size={17} strokeWidth={1.9} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 px-[20px] pb-[15px]">
            <div className="flex items-center gap-[5px] text-[9px] font-semibold uppercase tracking-[0.13em] text-white/75">
              <BadgeCheck size={13} className="text-[#1ED760]" fill={ACCENT} strokeWidth={1.2} aria-hidden="true" />
              Verified artist
            </div>
            <h1 className="mt-[3px] text-[58px] font-extrabold leading-[0.85] tracking-[-0.055em] text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.55)]">
              Ugazee
            </h1>
            <p className="mt-[9px] text-[10.5px] font-medium text-white/65">
              4,981 monthly listeners
            </p>
          </div>
        </div>

        <div className="relative -mt-[1px] bg-gradient-to-b from-[#0c1a10] to-[#050505] pb-[122px]">
          <div className="flex items-center gap-[14px] px-[20px] pt-[13px]">
            <button
              type="button"
              onClick={() => void toggle()}
              className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#1ED760] text-black shadow-[0_8px_24px_rgba(30,215,96,0.25)] transition-transform hover:scale-105 active:scale-95"
              aria-label={isPlaying ? "Pause Detty December" : "Play Detty December"}
            >
              {isPlaying ? (
                <Pause size={20} fill="currentColor" strokeWidth={0} aria-hidden="true" />
              ) : (
                <Play
                  size={20}
                  fill="currentColor"
                  strokeWidth={0}
                  className="ml-[2px]"
                  aria-hidden="true"
                />
              )}
            </button>
            <button
              type="button"
              className="flex h-[38px] w-[38px] items-center justify-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white"
              aria-label="Shuffle Ugazee's music"
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 7h3.2c4 0 4.4 10 8.6 10H21M18 3l3 4-3 4M3 17h3.2c1.3 0 2.3-1.1 3.2-2.7M14.8 9.7C15.8 8.2 16.8 7 18.8 7H21M18 13l3 4-3 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              className="flex h-[38px] w-[38px] items-center justify-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white"
              aria-label="Save Ugazee"
            >
              <Heart size={21} strokeWidth={1.7} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="flex h-[38px] w-[38px] items-center justify-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white"
              aria-label="More options"
            >
              <MoreHorizontal size={23} aria-hidden="true" />
            </button>
          </div>

          <section className="mt-[22px] px-[18px]" aria-labelledby="spotify-popular">
            <SectionHeading
              title="Popular"
              className="px-[4px]"
              action={
                <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-white/35">
                  Lagos · 2026
                </span>
              }
            />
            <div className="mt-[5px]">
              {popular.map(({ release, track, plays }, index) => {
                const current = track.title === config.track.title;
                return (
                  <button
                    key={`${release.id}-${track.title}`}
                    type="button"
                    onClick={() => {
                      if (current) void toggle();
                      else setDetail(release);
                    }}
                    className="group flex w-full items-center gap-[11px] rounded-[8px] px-[4px] py-[7px] text-left transition-colors hover:bg-white/[0.055] active:bg-white/[0.09]"
                    aria-label={
                      current
                        ? `${isPlaying ? "Pause" : "Play"} Detty December`
                        : `Open ${release.title} by Ugazee`
                    }
                  >
                    <span className="w-[13px] text-[10px] tabular-nums text-white/30">
                      {index + 1}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={release.cover}
                      alt=""
                      className="h-[41px] w-[41px] rounded-[5px] object-cover"
                      draggable={false}
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-[12.5px] font-semibold leading-tight"
                        style={{ color: current ? ACCENT : "rgba(255,255,255,0.94)" }}
                      >
                        {track.title}
                      </p>
                      <p className="truncate text-[9px] leading-tight text-white/40">
                        Ugazee · {release.title}
                      </p>
                    </div>
                    <span className="hidden text-[9px] tabular-nums text-white/30 min-[360px]:block">
                      {plays}
                    </span>
                    {current && <TrackEqualizer playing={isPlaying} color={ACCENT} />}
                    <span className="w-[28px] text-right text-[9.5px] tabular-nums text-white/35">
                      {track.duration}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-[24px]" aria-labelledby="spotify-albums">
            <SectionHeading
              title="Albums & EPs"
              className="px-[22px]"
              action={
                <span className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/35">
                  Show all
                </span>
              }
            />
            <div className="no-scrollbar mt-[10px] flex gap-[12px] overflow-x-auto px-[18px] pb-1">
              {albums.map((release) => (
                <button
                  key={release.id}
                  type="button"
                  onClick={() => setDetail(release)}
                  className="w-[134px] shrink-0 text-left"
                  aria-label={`Open ${release.title}, ${release.type}, ${release.year}`}
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-[6px] bg-white/5 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.8)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={release.cover}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
                      draggable={false}
                    />
                    <span className="absolute bottom-[7px] right-[7px] flex h-[22px] w-[22px] items-center justify-center rounded-full bg-black/55 backdrop-blur-sm">
                      <Play size={10} fill="white" strokeWidth={0} aria-hidden="true" />
                    </span>
                  </div>
                  <p className="mt-[7px] truncate text-[11.5px] font-semibold leading-tight text-white/92">
                    {release.title}
                  </p>
                  <p className="mt-[2px] truncate text-[9px] text-white/38">
                    {release.type} · {release.year}
                  </p>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-[22px]" aria-labelledby="spotify-singles">
            <SectionHeading title="Singles" className="px-[22px]" />
            <div className="no-scrollbar mt-[10px] flex gap-[12px] overflow-x-auto px-[18px] pb-1">
              {singles.map((release) => (
                <button
                  key={release.id}
                  type="button"
                  onClick={() => setDetail(release)}
                  className="w-[120px] shrink-0 text-left"
                  aria-label={`Open ${release.title}, single, ${release.year}`}
                >
                  <div className="aspect-square w-full overflow-hidden rounded-[6px] bg-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={release.cover}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
                      draggable={false}
                    />
                  </div>
                  <p className="mt-[7px] truncate text-[11px] font-semibold text-white/90">
                    {release.title}
                  </p>
                  <p className="mt-[2px] text-[9px] text-white/38">{release.year}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-[26px] px-[22px]">
            <SectionHeading title="About the artist" />
            <div className="mt-[9px] rounded-[12px] bg-white/[0.035] p-[12px]">
              <p className="text-[10px] leading-[1.55] text-white/50">
                {config.artist.bio}
              </p>
              <p className="mt-[8px] text-[9px] font-semibold uppercase tracking-[0.13em] text-[#1ED760]/80">
                4,981 monthly listeners
              </p>
            </div>
          </section>

          <footer className="mt-6 px-[22px] text-[8px] text-white/25">
            <p>© 2026 Ugazee · Spotify concept experience</p>
          </footer>
        </div>
      </div>

      <AppMiniPlayer platform="spotify" accent={ACCENT} />

      <AnimatePresence>
        {detail && (
          <ReleaseDetail
            key={detail.id}
            release={detail}
            platform="spotify"
            accent={ACCENT}
            background="linear-gradient(180deg,#0d2013 0%,#050505 58%)"
            onBack={() => setDetail(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
