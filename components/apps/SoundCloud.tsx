"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Library,
  MoreHorizontal,
  Pause,
  Play,
  Radio,
  Search,
  UserPlus,
} from "lucide-react";
import { config, type Release } from "@/lib/config";
import { useAudio } from "@/components/AudioProvider";
import { BrandMark } from "@/components/apps/BrandIcons";
import {
  AppMiniPlayer,
  ReleaseDetail,
  SectionHeading,
} from "@/components/apps/Shared";

const ACCENT = "#FF5500";

export function SoundCloud({ onClose }: { onClose: () => void }) {
  const [detail, setDetail] = useState<Release | null>(null);
  const { isPlaying, toggle } = useAudio();
  const sc = config.soundcloud;

  return (
    <div className="absolute inset-0 z-50 overflow-hidden bg-[#0b0806] text-white">
      <div className="no-scrollbar absolute inset-0 overflow-y-auto pb-[120px]">
        {/* ── Profile header ─────────────────────────────────────────────── */}
        <div className="relative overflow-hidden px-[18px] pb-[4px] pt-[104px]">
          <div className="pointer-events-none absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sc.avatar}
              alt=""
              className="h-full w-full scale-[1.25] object-cover object-[50%_22%] opacity-25 blur-[26px]"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#160c06]/70 via-[#0d0906]/90 to-[#0b0806]" />
          </div>

          <div className="relative flex items-start gap-[13px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sc.avatar}
              alt="Ugazee"
              className="h-[92px] w-[92px] shrink-0 rounded-[14px] object-cover shadow-[0_14px_34px_-12px_rgba(0,0,0,0.9)] ring-1 ring-white/15"
              draggable={false}
            />
            <div className="min-w-0 flex-1 pt-[2px]">
              <div className="flex items-center gap-[5px]">
                <h1 className="truncate text-[28px] font-black leading-none tracking-[-0.045em] text-white">
                  Ugazee
                </h1>
                <BadgeCheck
                  size={15}
                  className="shrink-0 text-[#FF8A4C]"
                  strokeWidth={2.4}
                  aria-hidden="true"
                />
              </div>
              <div className="mt-[7px] inline-flex items-center gap-[4px] rounded-[4px] bg-[#FF5500]/15 px-[5px] py-[2px]">
                <span className="flex h-[10px] w-[10px] items-center justify-center rounded-full bg-[#FF5500]">
                  <Headphones size={6} className="text-white" aria-hidden="true" />
                </span>
                <span className="text-[7.5px] font-bold uppercase tracking-[0.13em] text-[#FF8A4C]">
                  {sc.tier}
                </span>
              </div>
              <p className="mt-[7px] text-[9.5px] font-medium text-white/50">
                <span className="text-white/75">{sc.trackCount} Tracks</span>
                <span className="mx-[5px] text-white/25">·</span>
                <span className="text-white/75">{sc.followers} followers</span>
              </p>
              <p className="mt-[2px] text-[8px] uppercase tracking-[0.1em] text-white/30">
                {sc.city} · Drums of Liberation
              </p>
            </div>
          </div>

          <div className="relative mt-[13px] flex items-center gap-[7px]">
            <a
              href={config.platforms.soundcloud.url}
              target="_blank"
              rel="noreferrer noopener"
              className="flex h-[32px] items-center gap-[5px] rounded-full bg-[#FF5500] px-[15px] text-[9.5px] font-bold uppercase tracking-[0.04em] text-white shadow-[0_8px_22px_rgba(255,85,0,0.28)] active:scale-95"
              aria-label="Follow Ugazee on SoundCloud"
            >
              <UserPlus size={12} strokeWidth={2.2} aria-hidden="true" />
              Follow
            </a>
            <a
              href={config.platforms.soundcloud.url}
              target="_blank"
              rel="noreferrer noopener"
              className="flex h-[32px] items-center gap-[5px] rounded-full border border-white/15 bg-white/[0.06] px-[12px] text-[9px] font-semibold text-white/80 backdrop-blur-md hover:bg-white/[0.12] hover:text-white"
              aria-label="Open Ugazee Station on SoundCloud"
            >
              <Radio size={13} strokeWidth={1.9} aria-hidden="true" />
              Station
            </a>
            <button
              type="button"
              className="ml-auto flex h-[32px] w-[32px] items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/65 backdrop-blur-md hover:bg-white/[0.12] hover:text-white"
              aria-label="More options"
            >
              <MoreHorizontal size={17} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* ── Tabs ───────────────────────────────────────────────────────── */}
        <div className="relative mt-[12px] px-[18px]">
          <div className="flex gap-[6px] rounded-[10px] bg-white/[0.05] p-[3px]">
            {["Tracks", "Albums", "Playlists"].map((tab, index) => (
              <span
                key={tab}
                className={`flex-1 rounded-[8px] py-[7px] text-center text-[9px] font-bold uppercase tracking-[0.09em] ${
                  index === 0
                    ? "bg-white text-black shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
                    : "text-white/45"
                }`}
              >
                {tab}
              </span>
            ))}
          </div>
        </div>

        {/* ── Featured single ────────────────────────────────────────────── */}
        <section className="mt-[14px] px-[18px]" aria-labelledby="sc-featured">
          <div className="relative overflow-hidden rounded-[13px] border border-[#FF5500]/25 bg-[linear-gradient(100deg,rgba(255,85,0,0.16),rgba(255,85,0,0.03))] p-[10px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.track.cover}
              alt=""
              className="absolute -right-4 -top-6 h-[110px] w-[110px] rotate-[8deg] rounded-[10px] object-cover opacity-25 blur-[1px]"
              draggable={false}
            />
            <div className="relative flex items-center gap-[10px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={config.track.cover}
                alt="Detty December cover"
                className="h-[52px] w-[52px] rounded-[7px] object-cover shadow-[0_8px_20px_-6px_rgba(0,0,0,0.8)]"
                draggable={false}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[7.5px] font-bold uppercase tracking-[0.15em] text-[#FF8A4C]">
                  New single · {config.album.dropLabel}
                </p>
                <p className="mt-[2px] truncate text-[15px] font-bold tracking-[-0.02em] text-white">
                  Detty December
                </p>
                <p className="truncate text-[8.5px] text-white/45">Ugazee · out 25 December</p>
              </div>
              <button
                type="button"
                onClick={() => void toggle()}
                className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#FF5500] text-white shadow-[0_6px_18px_rgba(255,85,0,0.35)] transition-transform hover:scale-105 active:scale-90"
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
        </section>

        {/* ── Real track list ────────────────────────────────────────────── */}
        <section className="mt-[15px] px-[18px]" aria-labelledby="sc-tracks">
          <SectionHeading
            title="Tracks"
            action={
              <span className="flex items-center gap-[2px] text-[8px] font-semibold uppercase tracking-[0.1em] text-white/30">
                {sc.trackCount} tracks <ChevronRight size={11} aria-hidden="true" />
              </span>
            }
          />
          <div className="mt-[6px] space-y-[1px]">
            {sc.tracks.map((track) => (
              <a
                key={track.url}
                href={track.url}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-center gap-[10px] rounded-[9px] px-[4px] py-[7px] transition-colors hover:bg-white/[0.045]"
                aria-label={`Play ${track.title} on SoundCloud`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={track.artwork}
                  alt=""
                  className="h-[43px] w-[43px] shrink-0 rounded-[5px] object-cover ring-1 ring-white/[0.06]"
                  draggable={false}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-semibold leading-tight text-white/90">
                    {track.title}
                  </p>
                  <p className="mt-[2px] truncate text-[8.5px] leading-tight text-white/35">
                    Ugazee
                  </p>
                </div>
                <span className="shrink-0 text-[8.5px] tabular-nums text-white/25">
                  {track.duration}
                </span>
                <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border border-white/10 text-white/45 transition-colors group-hover:border-[#FF5500]/60 group-hover:bg-[#FF5500] group-hover:text-white">
                  <Play
                    size={9}
                    fill="currentColor"
                    strokeWidth={0}
                    className="ml-[1px]"
                    aria-hidden="true"
                  />
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ── Albums & EPs from the real catalogue ───────────────────────── */}
        <section className="mt-[19px] px-[18px]" aria-labelledby="sc-releases">
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

        {/* ── About ──────────────────────────────────────────────────────── */}
        <section className="mt-[21px] px-[18px]">
          <SectionHeading title="About" />
          <div className="mt-[8px] flex gap-[11px] rounded-[12px] border border-white/[0.06] bg-white/[0.02] p-[12px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sc.avatar}
              alt=""
              className="h-[48px] w-[48px] shrink-0 rounded-full object-cover"
              draggable={false}
            />
            <div className="min-w-0">
              <p className="flex items-center gap-[4px] text-[10.5px] font-semibold text-white/90">
                Ugazee
                <BadgeCheck size={11} className="text-[#FF8A4C]" aria-hidden="true" />
              </p>
              <p className="mt-[2px] text-[8px] leading-[1.5] text-white/35">
                {sc.description}
              </p>
              <p className="mt-[3px] text-[8px] leading-[1.5] text-white/30">
                {sc.trackCount} tracks · {sc.followers} followers · {sc.city}
              </p>
              <a
                href={config.platforms.soundcloud.url}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-[5px] inline-flex items-center gap-[2px] text-[8px] font-semibold uppercase tracking-[0.1em] text-[#FF8A4C]"
              >
                {sc.handle} <ChevronRight size={9} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <footer className="mt-6 px-[20px] text-[8px] text-white/20">
          © 2026 Ugazee · SoundCloud concept experience
        </footer>
      </div>

      {/* Solid scrim so scrolled rows never collide with the status bar/chrome. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[106px] bg-gradient-to-b from-[#0b0806] via-[#0b0806]/95 to-transparent" />

      {/* ── App chrome ─────────────────────────────────────────────────── */}
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
