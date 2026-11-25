"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Library,
  MessageCircle,
  MoreHorizontal,
  Pause,
  Play,
  Search,
  Shuffle,
  UserPlus,
  Headphones,
} from "lucide-react";
import { config, type Release } from "@/lib/config";
import { useAudio } from "@/components/AudioProvider";
import { BrandMark } from "@/components/apps/BrandIcons";
import {
  AppMiniPlayer,
  ReleaseDetail,
  SectionHeading,
  TrackEqualizer,
  Waveform,
} from "@/components/apps/Shared";

const ACCENT = "#FF5500";

const plays = ["1.2M", "486K", "312K", "188K", "94K"];

export function SoundCloud({ onClose }: { onClose: () => void }) {
  const [detail, setDetail] = useState<Release | null>(null);
  const { isPlaying, currentTime, duration, toggle, seek } = useAudio();

  const tracks = useMemo(
    () =>
      config.discography.map((release, index) => ({
        release,
        track: release.tracklist[0],
        plays: plays[index] ?? "12K",
        comments: [4821, 1290, 873, 511, 208][index] ?? 12,
      })),
    [],
  );

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <div className="absolute inset-0 z-50 overflow-hidden bg-[#0b0806] text-white">
      <div className="no-scrollbar absolute inset-0 overflow-y-auto">
        <div className="relative h-[290px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={config.artist.poster}
            alt=""
            className="absolute inset-0 h-full w-full scale-[1.03] object-cover object-[52%_15%]"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-[#2b1205]/30 to-[#0b0806]" />
          <div className="absolute inset-0 bg-[linear-gradient(95deg,rgba(15,7,2,0.75),transparent_72%)]" />

          <div className="absolute inset-x-0 bottom-0 px-[20px] pb-[17px]">
            <div className="flex items-center gap-[6px] text-[8px] font-bold uppercase tracking-[0.18em] text-[#FF8A4C]">
              <span className="flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[#FF5500]">
                <Headphones size={9} className="text-white" aria-hidden="true" />
              </span>
              Artist · Lagos
            </div>
            <h1 className="mt-[4px] text-[50px] font-black leading-[0.84] tracking-[-0.055em] text-white drop-shadow-[0_8px_26px_rgba(0,0,0,0.55)]">
              Ugazee
            </h1>
            <div className="mt-[9px] flex items-center gap-[13px] text-[9.5px] font-medium text-white/55">
              <span>803 followers</span>
              <span className="h-[2.5px] w-[2.5px] rounded-full bg-white/35" />
              <span>27 tracks</span>
            </div>
            <div className="mt-[12px] flex items-center gap-[7px]">
              <button
                type="button"
                className="flex h-[32px] items-center gap-[5px] rounded-full bg-[#FF5500] px-[14px] text-[9.5px] font-bold uppercase tracking-[0.04em] text-white shadow-[0_8px_22px_rgba(255,85,0,0.25)] active:scale-95"
                aria-label="Follow Ugazee on SoundCloud"
              >
                <UserPlus size={12} strokeWidth={2.2} aria-hidden="true" />
                Follow
              </button>
              <button
                type="button"
                className="flex h-[32px] w-[32px] items-center justify-center rounded-full border border-white/20 bg-black/25 text-white/70 backdrop-blur-md hover:bg-black/40 hover:text-white"
                aria-label="Message Ugazee"
              >
                <MessageCircle size={14} strokeWidth={1.9} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="flex h-[32px] w-[32px] items-center justify-center rounded-full border border-white/20 bg-black/25 text-white/70 backdrop-blur-md hover:bg-black/40 hover:text-white"
                aria-label="Like Ugazee"
              >
                <Heart size={14} strokeWidth={1.9} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="ml-auto flex h-[30px] w-[30px] items-center justify-center rounded-full bg-black/20 text-white/60 backdrop-blur-md hover:bg-black/35 hover:text-white"
                aria-label="More options"
              >
                <MoreHorizontal size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative pb-[120px]">
          <div className="flex items-center gap-[16px] border-b border-white/[0.07] px-[20px]">
            {["All", "Popular", "Albums", "Playlists"].map((tab, index) => (
              <span
                key={tab}
                className={`relative py-[10px] text-[9.5px] font-semibold uppercase tracking-[0.08em] ${
                  index === 1 ? "text-[#FF8A4C]" : "text-white/35"
                }`}
              >
                {tab}
                {index === 1 && (
                  <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-[#FF5500]" />
                )}
              </span>
            ))}
          </div>

          <section className="px-[18px] pt-[16px]" aria-labelledby="sc-popular">
            <SectionHeading
              title="Popular tracks"
              action={
                <button
                  type="button"
                  className="flex items-center gap-[3px] text-[8px] font-semibold uppercase tracking-[0.12em] text-white/35"
                  aria-label="Shuffle popular tracks"
                >
                  <Shuffle size={11} aria-hidden="true" /> Shuffle
                </button>
              }
            />
            <div className="mt-[7px] space-y-[2px]">
              {tracks.map(({ release, track, plays: count, comments }, index) => {
                const current = track.title === config.track.title;
                const rowProgress = current ? progress : 0.34 + index * 0.02;
                return (
                  <div
                    key={release.id}
                    className="group flex items-center gap-[10px] rounded-[9px] px-[4px] py-[8px] transition-colors hover:bg-white/[0.04]"
                  >
                    <button
                      type="button"
                      onClick={() => setDetail(release)}
                      className="flex min-w-0 flex-1 items-center gap-[10px] text-left"
                      aria-label={`Open ${release.title} by Ugazee`}
                    >
                      <div className="relative h-[47px] w-[47px] shrink-0 overflow-hidden rounded-[5px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={release.cover}
                          alt=""
                          className="h-full w-full object-cover"
                          draggable={false}
                        />
                        {current && (
                          <span className="absolute inset-0 flex items-center justify-center bg-black/35">
                            <TrackEqualizer playing={isPlaying} color="#FF8A4C" size="md" />
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-[6px]">
                          <p
                            className="min-w-0 truncate text-[11.5px] font-semibold leading-tight"
                            style={{ color: current ? "#FF8A4C" : "rgba(255,255,255,0.92)" }}
                          >
                            {track.title}
                          </p>
                          <span className="text-[8px] text-white/30">·</span>
                          <p className="truncate text-[9px] text-white/40">
                            {release.type}
                          </p>
                        </div>
                        <p className="truncate text-[8px] text-white/30">
                          Ugazee · {count} plays
                        </p>
                        <div className="mt-[4px]">
                          <Waveform
                            seed={index + 1}
                            color={current ? "#FF8A4C" : "#FF5500"}
                            count={46}
                            height={17}
                            progress={rowProgress}
                          />
                        </div>
                      </div>
                    </button>
                    <div className="flex shrink-0 flex-col items-center gap-[4px]">
                      <button
                        type="button"
                        onClick={() => {
                          if (current) {
                            if (!isPlaying) seek(0);
                            void toggle();
                          } else setDetail(release);
                        }}
                        className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#FF5500] text-white shadow-[0_4px_14px_rgba(255,85,0,0.3)] transition-transform hover:scale-105 active:scale-90"
                        aria-label={
                          current && isPlaying ? "Pause Detty December" : `Play ${track.title}`
                        }
                      >
                        {current && isPlaying ? (
                          <Pause size={11} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                        ) : (
                          <Play
                            size={11}
                            fill="currentColor"
                            strokeWidth={0}
                            className="ml-[1px]"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                      <span className="flex items-center gap-[2px] text-[7.5px] text-white/25">
                        <MessageCircle size={7} aria-hidden="true" />
                        {comments}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-[15px] px-[18px]" aria-labelledby="sc-releases">
            <SectionHeading
              title="Albums & EPs"
              action={
                <span className="flex items-center gap-[2px] text-[8px] font-semibold uppercase tracking-[0.1em] text-white/30">
                  All <ChevronRight size={11} aria-hidden="true" />
                </span>
              }
            />
            <div className="mt-[9px] grid grid-cols-2 gap-[9px]">
              {config.discography.slice(0, 4).map((release) => (
                <button
                  key={release.id}
                  type="button"
                  onClick={() => setDetail(release)}
                  className="group overflow-hidden rounded-[10px] border border-white/[0.07] bg-white/[0.025] text-left transition-colors hover:border-[#FF5500]/30"
                  aria-label={`Open ${release.title}`}
                >
                  <div className="relative aspect-[1.6/1] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={release.cover}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                    <div className="absolute bottom-[6px] left-[8px]">
                      <p className="text-[9.5px] font-bold leading-tight text-white">
                        {release.title}
                      </p>
                      <p className="text-[7px] text-white/50">
                        {release.type} · {release.year}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-[21px] px-[18px]">
            <SectionHeading title="About" />
            <div className="mt-[8px] flex gap-[11px] rounded-[12px] border border-white/[0.06] bg-white/[0.02] p-[12px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={config.artist.poster}
                alt=""
                className="h-[48px] w-[48px] rounded-full object-cover object-top"
                draggable={false}
              />
              <div>
                <p className="text-[10.5px] font-semibold text-white/90">Ugazee</p>
                <p className="mt-[2px] text-[8px] leading-[1.5] text-white/35">
                  {config.artist.bio}
                </p>
                <a
                  href={config.platforms.soundcloud.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-[5px] inline-flex items-center gap-[2px] text-[8px] font-semibold uppercase tracking-[0.1em] text-[#FF8A4C]"
                >
                  soundcloud.com/ugazee <ChevronRight size={9} aria-hidden="true" />
                </a>
              </div>
            </div>
          </section>

          <footer className="mt-6 px-[20px] text-[8px] text-white/20">
            © 2026 Ugazee · SoundCloud concept experience
          </footer>
        </div>
      </div>

      <div className="absolute inset-x-0 top-[54px] z-30 flex h-[44px] items-center justify-between px-[14px]">
        <button
          type="button"
          onClick={onClose}
          className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-lg transition hover:bg-black/50 active:scale-90"
          aria-label="Back to Home Screen"
        >
          <ChevronLeft size={22} strokeWidth={2.2} aria-hidden="true" />
        </button>
        <span className="flex items-center gap-[5px] text-[9.5px] font-bold tracking-[-0.01em] text-white/90">
          <BrandMark id="soundcloud" className="h-[17px] w-[17px]" />
          SoundCloud
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex h-[31px] w-[31px] items-center justify-center rounded-full bg-black/30 text-white/75 backdrop-blur-lg hover:bg-black/50 hover:text-white"
            aria-label="Search SoundCloud"
          >
            <Search size={16} strokeWidth={1.9} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="flex h-[31px] w-[31px] items-center justify-center rounded-full bg-black/30 text-white/75 backdrop-blur-lg hover:bg-black/50 hover:text-white"
            aria-label="Your SoundCloud library"
          >
            <Library size={16} strokeWidth={1.9} aria-hidden="true" />
          </button>
        </div>
      </div>

      <AppMiniPlayer platform="soundcloud" accent={ACCENT} />

      <AnimatePresence>
        {detail && (
          <ReleaseDetail
            key={detail.id}
            release={detail}
            platform="soundcloud"
            accent={ACCENT}
            background="linear-gradient(180deg,#2a1206 0%,#0b0806 58%)"
            onBack={() => setDetail(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
