"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlarmClock,
  ArrowLeft,
  ArrowUpRight,
  BatteryCharging,
  Bell,
  Bluetooth,
  Bookmark,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Cloud,
  CloudRain,
  CloudSun,
  Compass,
  CreditCard,
  FileAudio,
  Folder,
  Globe2,
  Heart,
  Image as ImageIcon,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Mic,
  Navigation,
  Pause,
  Phone,
  Play,
  Plus,
  Search,
  Share2,
  Shield,
  Signal,
  Smartphone,
  Star,
  Timer,
  Users,
  Wallet,
  Wifi,
  X,
  Zap,
  Camera as CameraIcon,
  SwitchCamera,
  MoreHorizontal,
} from "lucide-react";
import { config, type IosApp } from "@/lib/config";
import { useAudio } from "@/components/AudioProvider";
import { useClock } from "@/hooks/useClock";
import { formatClock, formatDate, formatShortDate } from "@/lib/format";
import { Countdown } from "@/components/Countdown";
import { TrackEqualizer, Waveform } from "@/components/apps/Shared";

type AppProps = { onClose: () => void };

function Header({
  title,
  onClose,
  trailing,
  subtitle,
}: {
  title: string;
  onClose: () => void;
  trailing?: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="relative flex h-[50px] shrink-0 items-center border-b border-white/[0.08] px-[10px]">
      <button
        type="button"
        onClick={onClose}
        className="flex h-[32px] w-[32px] items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 active:scale-90"
        aria-label="Back to Home Screen"
      >
        <ChevronLeft size={23} strokeWidth={2.1} aria-hidden="true" />
      </button>
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="text-[13px] font-semibold leading-tight text-white">{title}</p>
        {subtitle && (
          <p className="text-[7px] uppercase tracking-[0.14em] text-white/35">{subtitle}</p>
        )}
      </div>
      <div className="ml-auto flex items-center gap-1">{trailing}</div>
    </div>
  );
}

function Scaffold({
  app,
  onClose,
  title,
  trailing,
  background,
  children,
  scroll = true,
}: {
  app: IosApp;
  onClose: () => void;
  title: string;
  trailing?: React.ReactNode;
  background: string;
  children: React.ReactNode;
  scroll?: boolean;
}) {
  return (
    <div
      className="absolute inset-0 z-50 flex flex-col pt-[54px] text-white"
      style={{ background }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[54px]" aria-hidden="true" />
      <Header title={title} onClose={onClose} trailing={trailing} subtitle={app.label} />
      <div className={`flex-1 ${scroll ? "no-scrollbar overflow-y-auto pb-[46px]" : "overflow-hidden"}`}>
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────── Phone ─────────────────────────────── */

function PhoneApp({ onClose, app }: AppProps & { app: IosApp }) {
  const [calling, setCalling] = useState<string | null>(null);
  const recent = [
    { name: "Ugazee", detail: "Mobile · outgoing · 9:41", missed: false },
    { name: "Detty December Team", detail: "Group · incoming · Yesterday", missed: false },
    { name: "Tola (Manager)", detail: "Mobile · missed · Yesterday", missed: true },
    { name: "Mum", detail: "Mobile · incoming · Tuesday", missed: false },
  ];

  if (calling) {
    return (
      <div className="absolute inset-0 z-50 flex flex-col items-center bg-gradient-to-b from-[#101a12] via-[#081009] to-black pt-[80px] text-white">
        <p className="text-[10px] font-medium text-white/40">calling mobile…</p>
        <p className="mt-2 text-[30px] font-semibold tracking-[-0.03em]">{calling}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={config.artist.poster}
          alt=""
          className="mt-8 h-[104px] w-[104px] rounded-full object-cover object-top ring-2 ring-white/10"
          draggable={false}
        />
        <div className="mt-5 flex gap-3">
          {[Mic, Users, Zap].map((Icon, index) => (
            <span
              key={index}
              className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-white/10 text-white/75"
            >
              <Icon size={18} aria-hidden="true" />
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setCalling(null)}
          className="mt-auto mb-[90px] flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#FF3B30] shadow-[0_10px_30px_rgba(255,59,48,0.35)] active:scale-95"
          aria-label="End call"
        >
          <Phone size={26} className="rotate-[135deg]" fill="white" strokeWidth={0} aria-hidden="true" />
        </button>
        <div className="absolute bottom-[28px] h-[5px] w-[134px] rounded-full bg-white/80" />
      </div>
    );
  }

  return (
    <Scaffold
      app={app}
      onClose={onClose}
      title="Recents"
      background="#0b0b0c"
      trailing={
        <button
          type="button"
          className="flex h-[28px] items-center rounded-full bg-white/10 px-2.5 text-[9px] font-semibold text-[#4CD964]"
          aria-label="Edit recent calls"
        >
          Edit
        </button>
      }
    >
      <div className="flex gap-2 border-b border-white/[0.07] px-[14px] py-[10px]">
        {["All", "Missed"].map((tab, i) => (
          <span
            key={tab}
            className={`rounded-full px-[10px] py-[4px] text-[9px] font-semibold ${
              i === 0 ? "bg-white text-black" : "bg-white/[0.08] text-white/60"
            }`}
          >
            {tab}
          </span>
        ))}
      </div>
      {recent.map((call) => (
        <div
          key={call.name}
          className="flex items-center gap-[10px] border-b border-white/[0.055] px-[15px] py-[11px]"
        >
          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/[0.07] text-white/45">
            <Phone size={14} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p
              className={`truncate text-[12px] font-medium ${
                call.missed ? "text-[#FF453A]" : "text-white"
              }`}
            >
              {call.name}
            </p>
            <p className="truncate text-[8.5px] text-white/35">{call.detail}</p>
          </div>
          <button
            type="button"
            onClick={() => setCalling(call.name)}
            className="flex h-[29px] w-[29px] items-center justify-center rounded-full bg-[#4CD964]/15 text-[#4CD964]"
            aria-label={`Call ${call.name}`}
          >
            <Phone size={13} fill="currentColor" strokeWidth={0} aria-hidden="true" />
          </button>
        </div>
      ))}
      <div className="px-[15px] pt-[14px]">
        <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-white/30">
          Favourites
        </p>
        <div className="mt-[8px] flex gap-[13px]">
          {["Ugazee", "Tola", "Mum"].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setCalling(name)}
              className="flex flex-col items-center gap-[4px]"
              aria-label={`Call favourite ${name}`}
            >
              <span className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-white/[0.07] text-[13px] font-medium text-white/60">
                {name[0]}
              </span>
              <span className="text-[8px] text-white/45">{name}</span>
            </button>
          ))}
        </div>
      </div>
    </Scaffold>
  );
}

/* ─────────────────────────────── Safari ─────────────────────────────── */

function SafariApp({ onClose, app }: AppProps & { app: IosApp }) {
  const [query, setQuery] = useState("");
  const bookmarks = [
    { label: "Spotify", url: config.platforms.spotify.url },
    { label: "Apple Music", url: config.platforms.appleMusic.url },
    { label: "SoundCloud", url: config.platforms.soundcloud.url },
    { label: "YouTube", url: config.socials[1].url },
  ];
  return (
    <Scaffold
      app={app}
      onClose={onClose}
      title="Start Page"
      background="linear-gradient(180deg,#15171c,#08090b)"
      trailing={<span className="pr-2 text-[9px] text-white/30">Private</span>}
    >
      <div className="px-[14px] pt-[12px]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!query.trim()) return;
            window.open(
              `https://www.google.com/search?q=${encodeURIComponent(query.trim())}`,
              "_blank",
              "noopener,noreferrer",
            );
          }}
          className="flex h-[34px] items-center gap-[7px] rounded-[10px] border border-white/10 bg-white/[0.08] px-[10px]"
        >
          <Search size={14} className="text-white/35" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search or enter website"
            className="h-full flex-1 bg-transparent text-[11px] text-white outline-none placeholder:text-white/30"
            aria-label="Search the web"
          />
          <Mic size={13} className="text-white/30" aria-hidden="true" />
        </form>

        <div className="mt-[22px] flex items-center justify-between">
          <p className="text-[15px] font-semibold tracking-[-0.02em]">Favourites</p>
          <span className="text-[9px] text-white/30">Edit</span>
        </div>
        <div className="mt-[10px] grid grid-cols-4 gap-[10px]">
          {bookmarks.map((bookmark) => (
            <a
              key={bookmark.label}
              href={bookmark.url}
              target="_blank"
              rel="noreferrer noopener"
              className="flex flex-col items-center gap-[5px]"
              aria-label={`Open ${bookmark.label} in a new tab`}
            >
              <span className="flex h-[50px] w-[50px] items-center justify-center rounded-[12px] border border-white/10 bg-white/[0.07] text-white/70">
                {bookmark.label === "YouTube" ? (
                  <Compass size={20} aria-hidden="true" />
                ) : (
                  <Globe2 size={20} aria-hidden="true" />
                )}
              </span>
              <span className="text-[8px] text-white/45">{bookmark.label}</span>
            </a>
          ))}
        </div>

        <div className="mt-[26px]">
          <p className="text-[15px] font-semibold tracking-[-0.02em]">Privacy Report</p>
          <div className="mt-[9px] rounded-[14px] border border-white/[0.08] bg-white/[0.04] p-[13px]">
            <div className="flex items-center gap-[8px]">
              <Shield size={18} className="text-[#30D158]" aria-hidden="true" />
              <p className="text-[10px] font-medium text-white/80">
                37 trackers prevented from profiling you
              </p>
            </div>
            <p className="mt-[5px] text-[8px] leading-relaxed text-white/35">
              In the last seven days, Safari prevented 37 trackers. This is a concept
              experience, so the number is decorative — like most numbers on the internet.
            </p>
          </div>
        </div>

        <div className="mt-[20px] rounded-[14px] border border-white/[0.07] bg-white/[0.025] p-[13px]">
          <p className="flex items-center gap-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#EFC178]/80">
            <Star size={10} aria-hidden="true" /> Reading List
          </p>
          <p className="mt-[5px] text-[11px] font-medium text-white/75">
            The Ugazee interview: “December is a mindset.”
          </p>
          <p className="mt-[2px] text-[8px] text-white/30">The Native · 8 min read</p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[36px] border-t border-white/10 bg-black/50 px-[22px] py-[8px] backdrop-blur-xl">
        <div className="flex items-center justify-between text-white/30">
          <ChevronLeft size={19} aria-hidden="true" />
          <ChevronRight size={19} aria-hidden="true" />
          <Share2 size={16} aria-hidden="true" />
          <Bookmark size={16} aria-hidden="true" />
          <span className="flex h-[16px] w-[16px] items-center justify-center rounded-[3px] border border-current text-[8px]">
            1
          </span>
        </div>
      </div>
    </Scaffold>
  );
}

/* ─────────────────────────────── Camera ─────────────────────────────── */

function CameraApp({ onClose }: AppProps) {
  const [flash, setFlash] = useState(false);
  const [mode, setMode] = useState("PHOTO");

  const shoot = () => {
    setFlash(true);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(18);
    setTimeout(() => setFlash(false), 180);
  };

  return (
    <div className="absolute inset-0 z-50 overflow-hidden bg-black text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={config.artist.poster}
        alt="Camera viewfinder"
        className="absolute inset-0 h-full w-full scale-[1.04] object-cover"
        draggable={false}
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20">
        {Array.from({ length: 9 }).map((_, index) => (
          <span key={index} className="border border-white/30" />
        ))}
      </div>

      <div className="absolute inset-x-0 top-[54px] flex items-center justify-between px-[20px]">
        <button
          type="button"
          onClick={onClose}
          className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-lg active:scale-90"
          aria-label="Close Camera"
        >
          <X size={18} strokeWidth={2.2} aria-hidden="true" />
        </button>
        <span className="flex items-center gap-[5px] rounded-full bg-black/35 px-[10px] py-[4px] text-[8px] font-semibold uppercase tracking-[0.16em] text-white/75 backdrop-blur-lg">
          <Lock size={9} aria-hidden="true" /> Ugazee's iPhone
        </span>
        <button
          type="button"
          onClick={() => setFlash((value) => !value)}
          className={`flex h-[32px] w-[32px] items-center justify-center rounded-full backdrop-blur-lg ${
            flash ? "bg-white text-black" : "bg-black/35 text-white"
          }`}
          aria-label={flash ? "Turn flash off" : "Turn flash on"}
          aria-pressed={flash}
        >
          <Zap size={15} fill={flash ? "currentColor" : "none"} aria-hidden="true" />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 pb-[36px]">
        <div className="mb-[16px] flex justify-center gap-[18px] text-[9px] font-semibold uppercase tracking-[0.12em]">
          {["VIDEO", "PHOTO", "PORTRAIT"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              className={mode === option ? "text-[#FFD60A]" : "text-white/55"}
              aria-label={`${option} mode`}
              aria-pressed={mode === option}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between px-[28px]">
          <button
            type="button"
            className="h-[44px] w-[44px] overflow-hidden rounded-[9px] border border-white/30"
            aria-label="Open photo library"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.track.cover}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          </button>
          <button
            type="button"
            onClick={shoot}
            className="relative flex h-[66px] w-[66px] items-center justify-center rounded-full border-[3px] border-white/90 active:scale-95"
            aria-label="Take photo"
          >
            <span className="h-[53px] w-[53px] rounded-full bg-white" />
          </button>
          <button
            type="button"
            className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-lg"
            aria-label="Switch camera"
          >
            <SwitchCamera size={20} strokeWidth={1.7} aria-hidden="true" />
          </button>
        </div>
        <div className="mx-auto mt-[15px] h-[5px] w-[134px] rounded-full bg-white/90" />
      </div>

      <AnimatePresence>
        {flash && (
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute inset-0 z-20 bg-white"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────── Photos ─────────────────────────────── */

function PhotosApp({ onClose, app }: AppProps & { app: IosApp }) {
  const [selected, setSelected] = useState<number | null>(null);
  const covers = config.discography.map((release) => release.cover);

  return (
    <Scaffold
      app={app}
      onClose={onClose}
      title="Library"
      background="linear-gradient(180deg,#121212,#050505)"
      trailing={<span className="px-2 text-[10px] font-medium text-[#0A84FF]">Select</span>}
    >
      <div className="flex items-center justify-between px-[16px] pt-[12px]">
        <p className="text-[16px] font-semibold">Recents</p>
        <span className="text-[9px] text-white/30">December 2026</span>
      </div>
      <div className="mt-[10px] grid grid-cols-3 gap-[2px] px-[2px]">
        {[...covers, ...covers.slice(0, 4)].map((cover, index) => (
          <button
            key={`${cover}-${index}`}
            type="button"
            onClick={() => setSelected(index)}
            className="relative aspect-square overflow-hidden"
            aria-label={`Open photo ${index + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              draggable={false}
            />
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between px-[16px] pb-[8px] pt-[20px]">
        <p className="text-[14px] font-semibold">Albums</p>
        <span className="text-[9px] text-white/30">See All</span>
      </div>
      <div className="flex gap-[10px] px-[16px]">
        {["Detty December", "Lagos, 2026", "On set"].map((album, index) => (
          <div key={album} className="w-[88px]">
            <div className="aspect-square overflow-hidden rounded-[5px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={covers[index]}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
            <p className="mt-[4px] truncate text-[9px] font-medium text-white/80">{album}</p>
            <p className="text-[7px] text-white/30">{[42, 18, 96][index]} items</p>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            key="photo-viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] flex flex-col bg-black pt-[54px]"
          >
            <div className="flex items-center justify-between px-[14px] py-[8px]">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white/10"
                aria-label="Close photo"
              >
                <X size={18} aria-hidden="true" />
              </button>
              <span className="text-[9px] text-white/40">December 2026</span>
              <button
                type="button"
                className="flex h-[32px] w-[32px] items-center justify-center rounded-full text-white/60"
                aria-label="Share photo"
              >
                <Share2 size={16} aria-hidden="true" />
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center overflow-hidden p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={covers[selected % covers.length]}
                alt="Ugazee photo"
                className="max-h-full w-full rounded-[4px] object-contain"
                draggable={false}
              />
            </div>
            <div className="pb-[42px] text-center text-[8px] text-white/30">
              Ugazee · Lagos · 2026
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Scaffold>
  );
}

/* ─────────────────────────────── Clock ─────────────────────────────── */

function ClockApp({ onClose, app }: AppProps & { app: IosApp }) {
  const now = useClock();
  const zones = [
    { city: "Lagos", zone: "Africa/Lagos", offset: "Today" },
    { city: "London", zone: "Europe/London", offset: "Today" },
    { city: "New York", zone: "America/New_York", offset: "Today" },
    { city: "Tokyo", zone: "Asia/Tokyo", offset: "Tomorrow" },
  ];
  const [tab, setTab] = useState("World Clock");
  const tabs = [
    { label: "World Clock", icon: Globe2 },
    { label: "Alarms", icon: AlarmClock },
    { label: "Stopwatch", icon: Timer },
    { label: "Timers", icon: Timer },
  ];
  return (
    <Scaffold
      app={app}
      onClose={onClose}
      title={tab}
      background="linear-gradient(180deg,#101012,#050505)"
      trailing={
        <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#FF9F0A]/15 text-[#FF9F0A]">
          <Plus size={15} aria-hidden="true" />
        </span>
      }
    >
      <div className="px-[18px] pt-[10px]">
        <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-white/30">
          {now ? formatDate(now) : "Today"}
        </p>
        <p className="mt-[2px] text-[52px] font-extralight leading-none tracking-[-0.05em] text-white tabular-nums" suppressHydrationWarning>
          {now ? formatClock(now) : "9:41"}
        </p>
        <p className="mt-[3px] text-[9px] text-white/35">Lagos, Nigeria</p>
      </div>

      <div className="mt-[18px] border-t border-white/[0.07]">
        {tab === "World Clock" ? (
          zones.map((zone, index) => {
            const time = now
              ? new Intl.DateTimeFormat("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                  timeZone: zone.zone,
                }).format(now)
              : "--:--";
            return (
              <div
                key={zone.city}
                className="flex items-center border-b border-white/[0.055] px-[18px] py-[12px]"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] text-white/35">{zone.offset}</p>
                  <p className="text-[16px] font-light tracking-[-0.02em] text-white">
                    {zone.city}
                  </p>
                </div>
                <p className="text-[27px] font-extralight tabular-nums text-white/85" suppressHydrationWarning>
                  {time}
                </p>
                {index === 0 && (
                  <span className="ml-2 h-[3px] w-[3px] rounded-full bg-[#FF9F0A]" />
                )}
              </div>
            );
          })
        ) : tab === "Alarms" ? (
          <div className="px-[18px] pt-[16px]">
            <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-white/30">
              Alarm
            </p>
            <div className="mt-[7px] flex items-baseline justify-between">
              <p className="text-[44px] font-extralight tracking-[-0.04em] text-white">
                06:30
              </p>
              <span className="rounded-full bg-[#FF9F0A]/15 px-2 py-[3px] text-[8px] font-semibold text-[#FF9F0A]">
                Album day
              </span>
            </div>
            <p className="text-[9px] text-white/35">December 12 · Detty December</p>
          </div>
        ) : (
          <div className="px-[18px] pt-[20px] text-center">
            <p className="text-[54px] font-extralight tabular-nums tracking-[-0.04em] text-white">
              00:00.00
            </p>
            <div className="mt-[22px] flex justify-center gap-4">
              <span className="flex h-[62px] w-[62px] items-center justify-center rounded-full bg-white/10 text-[11px] font-medium">
                Reset
              </span>
              <span className="flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#30D158]/20 text-[11px] font-medium text-[#30D158]">
                Start
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-[20px] flex items-end justify-around px-[12px]">
        {tabs.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => setTab(label)}
            className={`flex w-[70px] flex-col items-center gap-[3px] text-[7px] font-medium ${
              tab === label ? "text-[#FF9F0A]" : "text-white/35"
            }`}
            aria-label={label}
            aria-pressed={tab === label}
          >
            <Icon size={17} strokeWidth={1.7} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
    </Scaffold>
  );
}

/* ─────────────────────────────── Weather ─────────────────────────────── */

function WeatherApp({ onClose, app }: AppProps & { app: IosApp }) {
  const hours = [
    { time: "Now", temp: "29°", Icon: CloudSun },
    { time: "18", temp: "28°", Icon: CloudSun },
    { time: "19", temp: "27°", Icon: Cloud },
    { time: "20", temp: "26°", Icon: Cloud },
    { time: "21", temp: "25°", Icon: CloudRain },
    { time: "22", temp: "25°", Icon: Cloud },
  ];
  const days = [
    ["Today", "29°", "24°", CloudSun],
    ["Thu", "30°", "24°", CloudSun],
    ["Fri", "31°", "25°", CloudSun],
    ["Sat", "29°", "24°", Cloud],
    ["Sun", "28°", "23°", CloudRain],
  ] as const;
  return (
    <div className="absolute inset-0 z-50 flex flex-col overflow-hidden bg-gradient-to-b from-[#243f57] via-[#141f2b] to-[#050608] pt-[54px] text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={config.artist.poster}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.12] blur-sm"
      />
      <div className="relative flex h-[46px] items-center justify-between px-[14px]">
        <button
          type="button"
          onClick={onClose}
          className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white/10 backdrop-blur-md active:scale-90"
          aria-label="Back to Home Screen"
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </button>
        <div className="flex gap-1 rounded-full bg-black/25 p-[2px] backdrop-blur-md">
          {["°C", "°F"].map((unit, index) => (
            <span
              key={unit}
              className={`rounded-full px-[8px] py-[2px] text-[8px] font-semibold ${
                index === 0 ? "bg-white/15" : "text-white/40"
              }`}
            >
              {unit}
            </span>
          ))}
        </div>
        <button
          type="button"
          className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white/10 backdrop-blur-md"
          aria-label="Weather locations"
        >
          <MapPin size={16} aria-hidden="true" />
        </button>
      </div>

      <div className="no-scrollbar relative flex-1 overflow-y-auto pb-[40px]">
        <div className="pt-[18px] text-center">
          <p className="text-[12px] font-medium text-white/70">Lagos</p>
          <p className="text-[76px] font-extralight leading-none tracking-[-0.07em] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            29°
          </p>
          <p className="mt-[1px] text-[12px] font-medium text-white/65">Harmattan haze</p>
          <p className="text-[10px] text-white/45">H:32° L:24°</p>
        </div>

        <div className="mx-[12px] mt-[18px] rounded-[16px] border border-white/10 bg-black/20 p-[12px] backdrop-blur-xl">
          <p className="border-b border-white/10 pb-[6px] text-[8px] font-semibold uppercase tracking-[0.14em] text-white/45">
            Hourly forecast
          </p>
          <div className="no-scrollbar mt-[8px] flex justify-between overflow-x-auto">
            {hours.map(({ time, temp, Icon }) => (
              <div key={time} className="flex min-w-[40px] flex-col items-center gap-[7px]">
                <span className="text-[8px] font-medium text-white/55">{time}</span>
                <Icon size={16} strokeWidth={1.6} className="text-[#FFD79A]" aria-hidden="true" />
                <span className="text-[11px] font-semibold">{temp}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-[12px] mt-[10px] rounded-[16px] border border-white/10 bg-black/20 p-[12px] backdrop-blur-xl">
          <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/45">
            5-day forecast
          </p>
          {days.map(([day, high, low, Icon]) => (
            <div
              key={day}
              className="flex items-center gap-3 border-b border-white/[0.07] py-[7px] last:border-0"
            >
              <span className="w-[40px] text-[9.5px] font-medium text-white/75">{day}</span>
              <Icon size={15} strokeWidth={1.6} className="text-[#FFD79A]" aria-hidden="true" />
              <span className="ml-auto w-[24px] text-right text-[9px] text-white/40">{low}</span>
              <span className="h-[2px] w-[63px] rounded-full bg-gradient-to-r from-[#FFD79A] to-[#FF9F0A]" />
              <span className="w-[24px] text-right text-[9.5px] font-medium">{high}</span>
            </div>
          ))}
        </div>

        <div className="mx-[12px] mt-[10px] rounded-[16px] border border-white/10 bg-black/20 p-[12px] backdrop-blur-xl">
          <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/45">
            December in Lagos
          </p>
          <p className="mt-[4px] text-[10px] leading-[1.5] text-white/65">
            Warm nights, low humidity and a city that refuses to sleep. Perfect weather
            for one more song.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Maps ─────────────────────────────── */

function MapsApp({ onClose, app }: AppProps & { app: IosApp }) {
  return (
    <div className="absolute inset-0 z-50 overflow-hidden bg-[#111a16] pt-[54px] text-white">
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(circle at 62% 42%, rgba(44,90,65,0.5), transparent 46%), linear-gradient(180deg,#101b17,#0b100e)",
        }}
      >
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "repeating-linear-gradient(23deg, transparent 0 42px, rgba(255,255,255,0.05) 42px 43px), repeating-linear-gradient(112deg, transparent 0 64px, rgba(255,255,255,0.04) 64px 65px), repeating-linear-gradient(0deg, transparent 0 88px, rgba(255,255,255,0.035) 88px 89px)",
          }}
        />
        <div className="absolute left-1/2 top-[38%] h-[120px] w-[2px] -translate-x-1/2 rotate-[28deg] bg-[#2C6F4A]/40" />
        <div className="absolute left-[20%] top-[38%] h-[3px] w-[60%] -rotate-[12deg] bg-[#B98A53]/20" />
      </div>

      <div className="relative flex h-[45px] items-center gap-[9px] px-[14px]">
        <button
          type="button"
          onClick={onClose}
          className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-black/50 backdrop-blur-lg active:scale-90"
          aria-label="Back to Home Screen"
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </button>
        <div className="flex h-[32px] flex-1 items-center gap-[7px] rounded-[10px] border border-white/10 bg-black/45 px-[10px] backdrop-blur-xl">
          <Search size={13} className="text-white/35" aria-hidden="true" />
          <span className="text-[10px] text-white/35">Search Maps</span>
        </div>
        <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-black/50 text-[#5DBA6B] backdrop-blur-lg">
          <Navigation size={15} fill="currentColor" aria-hidden="true" />
        </span>
      </div>

      <div className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2">
        <span className="absolute -inset-6 animate-ping rounded-full bg-[#5DBA6B]/10" />
        <span className="relative flex h-[42px] w-[42px] items-center justify-center rounded-full border-[3px] border-white bg-[#2E8B57] shadow-[0_8px_20px_rgba(0,0,0,0.5)]">
          <MapPin size={19} fill="white" strokeWidth={0} aria-hidden="true" />
        </span>
      </div>
      <span className="absolute left-[28%] top-[27%] h-[5px] w-[5px] rounded-full bg-[#EFC178]" />
      <span className="absolute left-[68%] top-[31%] h-[4px] w-[4px] rounded-full bg-white/30" />
      <span className="absolute left-[46%] top-[55%] h-[4px] w-[4px] rounded-full bg-[#5DBA6B]/60" />

      <div className="absolute inset-x-[10px] bottom-[38px] rounded-[20px] border border-white/10 bg-[#121815]/95 p-[14px] shadow-[0_-12px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#5DBA6B]">
              Detty December listening party
            </p>
            <p className="mt-[3px] text-[15px] font-semibold tracking-[-0.02em]">
              Eko Hotel · Lagos
            </p>
            <p className="mt-[2px] text-[9px] text-white/40">
              12.12.26 · 9:00 PM · 1.2 km away
            </p>
          </div>
          <button
            type="button"
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white/10 text-white/60"
            aria-label="Share location"
          >
            <Share2 size={14} aria-hidden="true" />
          </button>
        </div>
        <div className="mt-[10px] flex gap-[7px]">
          <button
            type="button"
            className="flex h-[32px] flex-1 items-center justify-center gap-[4px] rounded-full bg-[#5DBA6B] text-[9px] font-semibold uppercase tracking-[0.06em] text-black"
            aria-label="Get directions to Eko Hotel"
          >
            <Navigation size={11} fill="currentColor" aria-hidden="true" /> Directions
          </button>
          <button
            type="button"
            className="flex h-[32px] items-center justify-center rounded-full border border-white/10 px-[12px] text-[9px] font-medium text-white/60"
            aria-label="Call venue"
          >
            <Phone size={11} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Notes ─────────────────────────────── */

function NotesApp({ onClose, app }: AppProps & { app: IosApp }) {
  const [checks, setChecks] = useState([true, true, false, false]);
  const tasks = [
    "Master delivered ✓",
    "Visualizer exported ✓",
    "Album drops 12.12",
    "Send Ugazee the addy",
  ];
  return (
    <Scaffold
      app={app}
      onClose={onClose}
      title="Notes"
      background="#121110"
      trailing={<span className="pr-2 text-[9px] text-white/30">Done</span>}
    >
      <div className="px-[20px] pt-[16px]">
        <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#FFD60A]/70">
          December 2026 · Pinned
        </p>
        <h2 className="mt-[3px] text-[24px] font-bold leading-tight tracking-[-0.035em]">
          DECEMBER ROLL-OUT
        </h2>
        <div className="mt-[4px] flex items-center gap-2 text-[8.5px] text-white/30">
          <span>Today</span>
          <span>·</span>
          <span>2:14 AM</span>
        </div>

        <div className="mt-[16px] space-y-[8px] rounded-[14px] border border-white/[0.08] bg-white/[0.035] p-[14px]">
          {tasks.map((task, index) => (
            <button
              key={task}
              type="button"
              onClick={() =>
                setChecks((prev) => prev.map((value, i) => (i === index ? !value : value)))
              }
              className="flex w-full items-center gap-[9px] text-left"
              aria-label={`${checks[index] ? "Uncheck" : "Check"} ${task}`}
              aria-pressed={checks[index]}
            >
              <span
                className={`flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full border ${
                  checks[index]
                    ? "border-[#FFD60A] bg-[#FFD60A] text-black"
                    : "border-white/25 text-transparent"
                }`}
              >
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 6.5 4.5 9 10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span
                className={`text-[11px] leading-snug ${
                  checks[index] ? "text-white/30 line-through" : "text-white/85"
                }`}
              >
                {task}
              </span>
            </button>
          ))}
        </div>

        <textarea
          defaultValue={`Notes for the 12th:\n\n• Keep the vinyl warm\n• No phones during the first chorus\n• When the beat drops, we outside\n\n— U`}
          aria-label="December roll-out note"
          className="mt-[14px] h-[220px] w-full resize-none rounded-[14px] border border-white/[0.06] bg-white/[0.025] p-[14px] text-[11px] leading-[1.65] text-white/70 outline-none placeholder:text-white/25"
        />

        <div className="mt-[12px] flex items-center gap-2">
          <button type="button" className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-white/[0.07] text-white/45" aria-label="Add checklist">
            <Plus size={15} aria-hidden="true" />
          </button>
          <button type="button" className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-white/[0.07] text-white/45" aria-label="Add photo">
            <ImageIcon size={14} aria-hidden="true" />
          </button>
          <span className="ml-auto text-[8px] text-white/25">Edited just now</span>
        </div>
      </div>
    </Scaffold>
  );
}

/* ─────────────────────────────── Calendar ─────────────────────────────── */

function CalendarApp({ onClose, app }: AppProps & { app: IosApp }) {
  const target = new Date(config.album.dropISO);
  const year = target.getFullYear();
  const month = target.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(target);
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  return (
    <Scaffold
      app={app}
      onClose={onClose}
      title="Calendar"
      background="linear-gradient(180deg,#101010,#050505)"
      trailing={<span className="pr-2 text-[9px] font-medium text-[#FF3B30]">Today</span>}
    >
      <div className="px-[16px] pt-[12px]">
        <div className="flex items-baseline justify-between">
          <h1 className="text-[26px] font-bold tracking-[-0.04em]">{monthName}</h1>
          <span className="text-[13px] font-medium text-white/35">{year}</span>
        </div>
        <div className="mt-[15px] grid grid-cols-7 text-center">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <span key={`${day}-${index}`} className="pb-[6px] text-[8px] font-semibold text-white/28">
              {day}
            </span>
          ))}
          {cells.map((day, index) => {
            const isDrop = day === target.getDate();
            return (
              <div key={index} className="flex h-[38px] items-center justify-center">
                {day ? (
                  <button
                    type="button"
                    onClick={() => undefined}
                    className={`relative flex h-[29px] w-[29px] items-center justify-center rounded-full text-[11px] ${
                      isDrop ? "bg-[#FF3B30] font-bold text-white" : "text-white/65 hover:bg-white/10"
                    }`}
                    aria-label={
                      isDrop
                        ? `${monthName} ${day} — Detty December album release`
                        : `${monthName} ${day}`
                    }
                  >
                    {day}
                    {isDrop && (
                      <span className="absolute -bottom-[2px] h-[3px] w-[3px] rounded-full bg-white" />
                    )}
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-[18px] rounded-[15px] border border-[#FF3B30]/20 bg-[#FF3B30]/[0.08] p-[13px]">
          <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#FF6B61]">
            All day · {config.album.dropLabel}
          </p>
          <p className="mt-[3px] text-[16px] font-semibold">Detty December — the album</p>
          <p className="mt-[2px] text-[9px] text-white/40">
            Ugazee · everywhere · 12:00 AM WAT
          </p>
          <div className="mt-[10px]">
            <Countdown variant="story" />
          </div>
        </div>

        <div className="mt-[18px]">
          <p className="text-[11px] font-semibold text-white/65">Upcoming</p>
          <div className="mt-[7px] border-t border-white/[0.07]">
            {[
              ["Tonight", "Listening party · Eko Hotel"],
              ["Dec 05", "Visualizer shoot · Lekki"],
              ["Dec 12", "DETTY DECEMBER · OUT NOW"],
            ].map(([day, event]) => (
              <div key={event} className="flex gap-4 border-b border-white/[0.055] py-[9px]">
                <span className="w-[42px] shrink-0 text-[8px] font-medium text-white/35">{day}</span>
                <span className="text-[10px] text-white/75">{event}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Scaffold>
  );
}

/* ─────────────────────────────── Settings ─────────────────────────────── */

function SettingsApp({ onClose, app }: AppProps & { app: IosApp }) {
  const [airplane, setAirplane] = useState(false);
  const [wifi, setWifi] = useState(true);
  const { isPlaying, toggle } = useAudio();
  const groups = [
    [
      { label: "Airplane Mode", icon: Smartphone, value: airplane, set: setAirplane },
      { label: "Wi-Fi", icon: Wifi, value: wifi, set: setWifi, detail: "UG-Studio-5G" },
      { label: "Bluetooth", icon: Bluetooth, value: true },
      { label: "Cellular", icon: Signal, detail: "MTN NG" },
    ],
    [
      { label: "Notifications", icon: Bell, detail: "3" },
      { label: "Sounds & Haptics", icon: Zap, detail: "" },
      { label: "Focus", icon: Lock, detail: "Off" },
      { label: "Battery", icon: BatteryCharging, detail: "82%" },
    ],
  ];
  return (
    <Scaffold
      app={app}
      onClose={onClose}
      title="Settings"
      background="#0b0b0c"
      trailing={<span className="pr-2 text-[9px] text-white/30">Done</span>}
    >
      <div className="px-[14px] pt-[10px]">
        <div className="flex items-center gap-[10px] rounded-[12px] bg-white/[0.055] p-[10px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={config.artist.poster}
            alt=""
            className="h-[44px] w-[44px] rounded-full object-cover object-top"
            draggable={false}
          />
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold">Ugazee</p>
            <p className="text-[8px] text-white/35">Apple ID · iCloud · Media & Purchases</p>
          </div>
          <ChevronRight size={14} className="text-white/25" aria-hidden="true" />
        </div>

        {groups.map((group, groupIndex) => (
          <div key={groupIndex} className="mt-[14px] overflow-hidden rounded-[12px] bg-white/[0.055]">
            {group.map((row) => (
              <div
                key={row.label}
                className="flex items-center gap-[9px] border-b border-white/[0.055] px-[11px] py-[8px] last:border-0"
              >
                <span className="flex h-[22px] w-[22px] items-center justify-center rounded-[5px] bg-white/10">
                  <row.icon size={12} className="text-white/70" aria-hidden="true" />
                </span>
                <span className="text-[10.5px] text-white/85">{row.label}</span>
                {row.detail && (
                  <span className="ml-auto text-[8.5px] text-white/25">{row.detail}</span>
                )}
                {"value" in row && typeof row.value === "boolean" && row.set ? (
                  <button
                    type="button"
                    onClick={() => row.set!((value) => !value)}
                    className={`relative ml-auto h-[19px] w-[32px] rounded-full transition-colors ${
                      row.value ? "bg-[#30D158]" : "bg-white/20"
                    }`}
                    role="switch"
                    aria-checked={row.value}
                    aria-label={row.label}
                  >
                    <span
                      className={`absolute top-[2px] h-[15px] w-[15px] rounded-full bg-white shadow transition-all ${
                        row.value ? "left-[15px]" : "left-[2px]"
                      }`}
                    />
                  </button>
                ) : (
                  <ChevronRight size={13} className="ml-auto text-white/20" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        ))}

        <div className="mt-[14px] flex items-center gap-[9px] rounded-[12px] bg-white/[0.055] px-[11px] py-[9px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={config.track.cover}
            alt=""
            className="h-[34px] w-[34px] rounded-[5px] object-cover"
            draggable={false}
          />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium">Detty December</p>
            <p className="text-[8px] text-white/35">Ugazee · Music</p>
          </div>
          <button
            type="button"
            onClick={() => void toggle()}
            className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white text-black"
            aria-label={isPlaying ? "Pause Detty December" : "Play Detty December"}
          >
            {isPlaying ? (
              <Pause size={10} fill="currentColor" strokeWidth={0} aria-hidden="true" />
            ) : (
              <Play size={10} fill="currentColor" strokeWidth={0} aria-hidden="true" />
            )}
          </button>
        </div>

        <p className="mt-[16px] text-center text-[7.5px] text-white/20">
          Concept device · iOS 26 · Build 12A12
        </p>
      </div>
    </Scaffold>
  );
}

/* ─────────────────────────────── Mail ─────────────────────────────── */

function MailApp({ onClose, app }: AppProps & { app: IosApp }) {
  const [open, setOpen] = useState<number | null>(null);
  const mails = [
    {
      from: "Detty December Team",
      subject: "FINAL MASTER — 192k / 44.1",
      preview: "The bounce is attached. 135 stays. Do not touch the low end.",
      time: "2:14 AM",
      unread: true,
    },
    {
      from: "Tola (Manager)",
      subject: "Roll-out schedule v4 (FINAL FINAL)",
      preview: "12.12 at midnight. Pre-save link is live. I need the artwork by Friday.",
      time: "Yesterday",
      unread: true,
    },
    {
      from: "Eko Hotel",
      subject: "Listening party — confirmation",
      preview: "You're confirmed for the Sky Lounge on 12 December. Guest list attached.",
      time: "Yesterday",
      unread: false,
    },
    {
      from: "Spotify for Artists",
      subject: "Your December editorial pitch",
      preview: "Submit Detty December for Detty December by 5 December for consideration.",
      time: "Mon",
      unread: false,
    },
  ];
  return (
    <Scaffold
      app={app}
      onClose={onClose}
      title="Inbox"
      background="linear-gradient(180deg,#101418,#050505)"
      trailing={<span className="pr-2 text-[9px] font-medium text-[#1C8CFF]">Edit</span>}
    >
      <div className="flex items-center justify-between px-[16px] pt-[10px]">
        <span className="text-[8px] font-semibold uppercase tracking-[0.16em] text-white/30">
          4 messages · 2 unread
        </span>
        <button
          type="button"
          className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#1C8CFF]/15 text-[#1C8CFF]"
          aria-label="Compose new message"
        >
          <Plus size={15} aria-hidden="true" />
        </button>
      </div>
      <div className="mt-[8px]">
        {mails.map((mail, index) => (
          <div key={mail.subject}>
            <button
              type="button"
              onClick={() => setOpen(open === index ? null : index)}
              className="flex w-full items-start gap-[9px] border-b border-white/[0.06] px-[16px] py-[11px] text-left transition-colors hover:bg-white/[0.035]"
              aria-expanded={open === index}
            >
              <span
                className={`mt-[5px] h-[6px] w-[6px] shrink-0 rounded-full ${
                  mail.unread ? "bg-[#1C8CFF]" : "bg-transparent"
                }`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <p className="truncate text-[11px] font-semibold text-white/90">{mail.from}</p>
                  <span className="ml-auto shrink-0 text-[7.5px] text-white/30">{mail.time}</span>
                </div>
                <p className="truncate text-[9.5px] font-medium text-white/65">{mail.subject}</p>
                <p className={`mt-[1px] text-[8.5px] leading-[1.4] text-white/32 ${open === index ? "" : "line-clamp-1"}`}>
                  {mail.preview}
                </p>
                {open === index && (
                  <div className="mt-[8px] flex gap-[6px]">
                    <a
                      href={config.platforms.appleMusic.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="rounded-full bg-[#1C8CFF]/15 px-[10px] py-[4px] text-[8px] font-semibold text-[#5FB2FF]"
                    >
                      Open link <ArrowUpRight size={8} className="inline" aria-hidden="true" />
                    </a>
                    <span className="rounded-full bg-white/[0.06] px-[10px] py-[4px] text-[8px] text-white/45">
                      Reply
                    </span>
                  </div>
                )}
              </div>
            </button>
          </div>
        ))}
      </div>
      <div className="mt-[18px] px-[16px] text-center text-[8px] text-white/25">
        Updated just now · Ugazee's iPhone
      </div>
    </Scaffold>
  );
}

/* ─────────────────────────────── Wallet ─────────────────────────────── */

function WalletApp({ onClose, app }: AppProps & { app: IosApp }) {
  return (
    <Scaffold
      app={app}
      onClose={onClose}
      title="Wallet"
      background="linear-gradient(180deg,#101010,#050505)"
      trailing={<span className="text-[16px] text-white/40"><Plus size={16} aria-hidden="true" /></span>}
    >
      <div className="space-y-[10px] px-[16px] pt-[14px]">
        <div className="relative overflow-hidden rounded-[16px] p-[15px] shadow-[0_18px_40px_-16px_rgba(0,0,0,0.9)]" style={{ background: "linear-gradient(135deg,#EFC178,#B4642C 52%,#3B1D10)" }}>
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-start justify-between">
            <span className="flex items-center gap-[5px] text-[8px] font-semibold uppercase tracking-[0.14em] text-black/60">
              <Wallet size={12} aria-hidden="true" /> Ugazee
            </span>
            <span className="text-[9px] font-light italic text-black/55">DEBIT</span>
          </div>
          <p className="relative mt-[22px] font-mono text-[12px] tracking-[0.12em] text-black/75">
            •••• 1212
          </p>
          <div className="relative mt-[12px] flex items-end justify-between">
            <div>
              <p className="text-[7px] uppercase tracking-[0.12em] text-black/45">Card holder</p>
              <p className="text-[9px] font-medium uppercase tracking-[0.06em] text-black/75">UGAZEE</p>
            </div>
            <span className="text-[18px] font-semibold tracking-[-0.04em] text-black/70">12.12</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[16px] border border-white/10 bg-gradient-to-br from-[#1b1b1b] to-[#080808] p-[15px]">
          <div className="flex items-start justify-between">
            <span className="flex items-center gap-[5px] text-[8px] font-semibold uppercase tracking-[0.14em] text-[#EFC178]">
              <Star size={11} aria-hidden="true" /> Detty December Pass
            </span>
            <ChevronRight size={14} className="text-white/25" aria-hidden="true" />
          </div>
          <p className="mt-[14px] text-[22px] font-semibold tracking-[-0.04em]">Eko Hotel · Sky Lounge</p>
          <p className="mt-[2px] text-[9px] text-white/35">12.12.26 · 9 PM · Guest +1</p>
          <div className="mt-[12px] flex items-end justify-between">
            <div className="h-[34px] w-[34px] rounded-[6px] bg-white/90 p-[3px]">
              <div className="grid h-full w-full grid-cols-5 grid-rows-5 gap-[1px]">
                {Array.from({ length: 25 }).map((_, i) => (
                  <span
                    key={i}
                    className="rounded-[0.5px]"
                    style={{ background: [2, 3, 5, 7, 8, 11, 13, 14, 17, 19, 21, 23].includes(i) ? "#111" : "transparent" }}
                  />
                ))}
              </div>
            </div>
            <span className="text-[8px] text-white/25">TAP TO OPEN</span>
          </div>
        </div>

        <div className="rounded-[14px] border border-white/[0.07] bg-white/[0.035] p-[12px]">
          <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/35">Recent transactions</p>
          {[
            ["Apple Music", "- ₦4,500", "Today"],
            ["Eko Hotel & Suites", "- ₦180,000", "Yesterday"],
            ["Royalty · Spotify", "+ ₦1,248,920", "Dec 01"],
          ].map(([title, amount, date], index) => (
            <div key={title} className="flex items-center gap-2 border-b border-white/[0.055] py-[8px] last:border-0">
              <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white/[0.06]">
                {index === 2 ? <ArrowUpRight size={12} className="text-[#30D158]" aria-hidden="true" /> : <CreditCard size={12} className="text-white/40" aria-hidden="true" />}
              </span>
              <div className="flex-1">
                <p className="text-[9.5px] text-white/75">{title}</p>
                <p className="text-[7.5px] text-white/25">{date}</p>
              </div>
              <span className={`text-[9px] tabular-nums ${index === 2 ? "text-[#30D158]" : "text-white/55"}`}>
                {amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Scaffold>
  );
}

/* ─────────────────────────────── Health ─────────────────────────────── */

function ActivityRing({
  value,
  color,
  radius,
  offset,
}: {
  value: number;
  color: string;
  radius: number;
  offset: number;
}) {
  const circumference = 2 * Math.PI * radius;
  return (
    <circle
      cx="60"
      cy="60"
      r={radius}
      fill="none"
      stroke={color}
      strokeWidth="8"
      strokeLinecap="round"
      strokeDasharray={`${circumference * value} ${circumference}`}
      transform={`rotate(${-90 + offset} 60 60)`}
    />
  );
}

function HealthApp({ onClose, app }: AppProps & { app: IosApp }) {
  return (
    <Scaffold
      app={app}
      onClose={onClose}
      title="Summary"
      background="linear-gradient(180deg,#1b0a10,#080506)"
      trailing={<span className="pr-2 text-[9px] font-medium text-[#FF375F]">Profile</span>}
    >
      <div className="px-[16px] pt-[12px]">
        <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-white/35">Today</p>
        <h1 className="mt-[2px] text-[24px] font-bold tracking-[-0.04em]">Your rings</h1>

        <div className="mt-[12px] rounded-[16px] border border-white/[0.08] bg-white/[0.035] p-[13px]">
          <div className="flex items-center gap-[16px]">
            <svg viewBox="0 0 120 120" className="h-[120px] w-[120px] shrink-0" aria-label="Move 84 percent, Exercise 73 percent, Stand 75 percent">
              <ActivityRing value={0.84} color="#FF375F" radius={48} offset={0} />
              <ActivityRing value={0.73} color="#A2E84B" radius={36} offset={8} />
              <ActivityRing value={0.75} color="#32D6F5" radius={24} offset={16} />
              <circle cx="60" cy="60" r="14" fill="#1b0a10" />
            </svg>
            <div className="space-y-[7px]">
              {[
                ["Move", "420/500", "#FF375F"],
                ["Exercise", "22/30", "#A2E84B"],
                ["Stand", "9/12", "#32D6F5"],
              ].map(([label, value, color]) => (
                <div key={label}>
                  <p className="flex items-center gap-[4px] text-[7.5px] font-semibold uppercase tracking-[0.1em] text-white/35">
                    <span className="h-[4px] w-[4px] rounded-full" style={{ background: color }} /> {label}
                  </p>
                  <p className="text-[14px] font-semibold tabular-nums" style={{ color }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-[12px] grid grid-cols-2 gap-[8px]">
          <div className="rounded-[14px] border border-white/[0.07] bg-white/[0.035] p-[11px]">
            <p className="text-[7.5px] font-semibold uppercase tracking-[0.12em] text-white/35">Heart rate</p>
            <p className="mt-[3px] flex items-baseline gap-[3px] text-[27px] font-semibold text-[#FF6482]">
              68 <span className="text-[8px] font-medium text-white/35">BPM</span>
            </p>
            <div className="mt-[6px] h-[20px]">
              <Waveform seed={4} color="#FF6482" count={26} height={18} progress={0.65} />
            </div>
          </div>
          <div className="rounded-[14px] border border-white/[0.07] bg-white/[0.035] p-[11px]">
            <p className="text-[7.5px] font-semibold uppercase tracking-[0.12em] text-white/35">Sleep</p>
            <p className="mt-[3px] flex items-baseline gap-[3px] text-[27px] font-semibold text-[#5E5CE6]">
              7<span className="text-[10px] font-medium text-white/35">h</span> 12<span className="text-[10px] font-medium text-white/35">m</span>
            </p>
            <p className="mt-[3px] text-[8px] text-white/35">Last night · 92%</p>
          </div>
        </div>

        <div className="mt-[12px] rounded-[14px] border border-white/[0.07] bg-white/[0.035] p-[12px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold">Detty December Dance</p>
              <p className="mt-[1px] text-[8px] text-white/35">Workout · 135 BPM · 22 min</p>
            </div>
            <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#FF375F] text-white">
              <Heart size={13} fill="currentColor" strokeWidth={0} aria-hidden="true" />
            </span>
          </div>
          <div className="mt-[8px]">
            <Waveform seed={7} color="#FF375F" count={36} height={19} progress={0.55} />
          </div>
        </div>

        <p className="mt-[16px] text-center text-[7.5px] text-white/20">
          Health data is illustrative. Ugazee is definitely not awake right now.
        </p>
      </div>
    </Scaffold>
  );
}

/* ─────────────────────────────── Files ─────────────────────────────── */

function FilesApp({ onClose, app }: AppProps & { app: IosApp }) {
  const files = [
    { name: "Detty December — FINAL MASTER.wav", meta: "31.4 MB · Today", icon: FileAudio, color: "#FF5500" },
    { name: "Ugazee — Wallpaper.mp4", meta: "1.2 MB · Yesterday", icon: ImageIcon, color: "#0A84FF" },
    { name: "Cover Artwork 1:1", meta: "5 items · 900×900", icon: Folder, color: "#FFD60A" },
    { name: "Visualizer References", meta: "12 items", icon: Folder, color: "#FFD60A" },
    { name: "Roll-out.pdf", meta: "2.1 MB · Mon", icon: FileAudio, color: "#FF453A" },
  ];
  return (
    <Scaffold
      app={app}
      onClose={onClose}
      title="iCloud Drive"
      background="linear-gradient(180deg,#101418,#050505)"
      trailing={<span className="pr-2 text-[9px] font-medium text-[#2D9CDB]">Select</span>}
    >
      <div className="px-[16px] pt-[12px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[7.5px] font-semibold uppercase tracking-[0.16em] text-white/30">iCloud Drive</p>
            <p className="mt-[2px] text-[22px] font-bold tracking-[-0.03em]">Ugazee</p>
          </div>
          <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#2D9CDB]/15 text-[#2D9CDB]">
            <Plus size={16} aria-hidden="true" />
          </span>
        </div>

        <div className="mt-[14px] overflow-hidden rounded-[14px] border border-white/[0.07] bg-white/[0.025]">
          {files.map((file, index) => (
            <div
              key={file.name}
              className="flex items-center gap-[10px] border-b border-white/[0.055] px-[11px] py-[10px] last:border-0"
            >
              <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] bg-white/[0.045]">
                <file.icon size={15} style={{ color: file.color }} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-medium text-white/85">{file.name}</p>
                <p className="text-[7.5px] text-white/30">{file.meta}</p>
              </div>
              <button
                type="button"
                className="flex h-[24px] w-[24px] items-center justify-center rounded-full text-white/30 hover:bg-white/10 hover:text-white"
                aria-label={`More options for ${file.name}`}
              >
                <MoreHorizontal size={15} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-[14px] rounded-[14px] border border-white/[0.07] bg-white/[0.025] p-[12px]">
          <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/30">Storage</p>
          <div className="mt-[6px] flex items-baseline justify-between">
            <p className="text-[20px] font-light text-white/85">68.4 GB</p>
            <p className="text-[8px] text-white/30">of 200 GB</p>
          </div>
          <div className="mt-[7px] flex h-[5px] gap-[2px] overflow-hidden rounded-full">
            <span className="w-[38%] bg-[#FFD60A]" />
            <span className="w-[16%] bg-[#0A84FF]" />
            <span className="w-[9%] bg-[#FF375F]" />
            <span className="flex-1 bg-white/10" />
          </div>
        </div>

        <div className="mt-[14px] flex items-center gap-3 rounded-[14px] border border-white/[0.06] bg-white/[0.02] p-[11px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={config.artist.poster}
            alt=""
            className="h-[38px] w-[38px] rounded-[8px] object-cover"
            draggable={false}
          />
          <div>
            <p className="text-[9.5px] font-medium text-white/80">Shared with Ugazee</p>
            <p className="text-[7.5px] text-white/30">3 collaborators · updated today</p>
          </div>
        </div>
      </div>
    </Scaffold>
  );
}

/* ─────────────────────────────── Router ─────────────────────────────── */

export function UtilityApp({ app, onClose }: { app: IosApp; onClose: () => void }) {
  switch (app.id) {
    case "phone":
      return <PhoneApp app={app} onClose={onClose} />;
    case "safari":
      return <SafariApp app={app} onClose={onClose} />;
    case "camera":
      return <CameraApp onClose={onClose} />;
    case "photos":
      return <PhotosApp app={app} onClose={onClose} />;
    case "clock":
      return <ClockApp app={app} onClose={onClose} />;
    case "weather":
      return <WeatherApp app={app} onClose={onClose} />;
    case "maps":
      return <MapsApp app={app} onClose={onClose} />;
    case "notes":
      return <NotesApp app={app} onClose={onClose} />;
    case "calendar":
      return <CalendarApp app={app} onClose={onClose} />;
    case "settings":
      return <SettingsApp app={app} onClose={onClose} />;
    case "mail":
      return <MailApp app={app} onClose={onClose} />;
    case "wallet":
      return <WalletApp app={app} onClose={onClose} />;
    case "health":
      return <HealthApp app={app} onClose={onClose} />;
    case "files":
      return <FilesApp app={app} onClose={onClose} />;
    default:
      return null;
  }
}
