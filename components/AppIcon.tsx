"use client";

import { motion } from "framer-motion";
import {
  Camera,
  Clock,
  CloudSun,
  Compass,
  Folder,
  Heart,
  Image as ImageIcon,
  Mail,
  MapPin,
  MessageCircle,
  Music,
  Phone,
  Settings,
  StickyNote,
  Wallet,
} from "lucide-react";
import type { IosApp } from "@/lib/config";
import { brandApps } from "@/lib/config";
import { useAudio } from "@/components/AudioProvider";
import { BrandMark, type BrandId } from "@/components/apps/BrandIcons";
import { useHydrated } from "@/hooks/useClock";

export type OpenOrigin = { x: number; y: number; scale: number };

export type OpenApp = (app: IosApp, origin?: OpenOrigin) => void;

type Props = {
  app: IosApp;
  size?: "grid" | "dock" | "brand" | "page2";
  onOpen: OpenApp;
  badge?: number;
  showLabel?: boolean;
  className?: string;
};

const glyphClass =
  "relative z-[1] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.24)]";

function glyphFor(app: IosApp, glyphSize: number) {
  const common = { size: glyphSize, strokeWidth: 1.8, className: glyphClass };
  switch (app.id) {
    case "camera":
      return <Camera {...common} />;
    case "photos":
      return <ImageIcon {...common} />;
    case "clock":
      return <Clock {...common} />;
    case "weather":
      return <CloudSun {...common} />;
    case "maps":
      return <MapPin {...common} strokeWidth={2} />;
    case "notes":
      return <StickyNote {...common} className="relative z-[1] text-[#4A3A00]" />;
    case "settings":
      return <Settings {...common} />;
    case "mail":
      return <Mail {...common} />;
    case "wallet":
      return <Wallet {...common} />;
    case "health":
      return <Heart {...common} />;
    case "files":
      return <Folder {...common} />;
    case "phone":
      return <Phone {...common} strokeWidth={2} />;
    case "safari":
      return <Compass {...common} strokeWidth={1.7} />;
    case "messages":
      return <MessageCircle {...common} strokeWidth={2} />;
    case "music":
      return <Music {...common} strokeWidth={2} />;
    case "spotify":
    case "appleMusic":
    case "soundcloud":
      return null;
    default:
      return <Music {...common} />;
  }
}

function getOrigin(el: HTMLElement): OpenOrigin | undefined {
  const screen = el.closest(".phone-screen") as HTMLElement | null;
  if (!screen) return undefined;
  const rect = el.getBoundingClientRect();
  const sr = screen.getBoundingClientRect();
  const cx = ((rect.left + rect.width / 2 - sr.left) / sr.width) * 393;
  const cy = ((rect.top + rect.height / 2 - sr.top) / sr.height) * 852;
  return {
    x: cx - 393 / 2,
    y: cy - 852 / 2,
    scale: Math.max(0.12, (rect.width / sr.width) * (393 / 393)),
  };
}

export function AppIcon({
  app,
  size = "grid",
  onOpen,
  badge,
  showLabel = true,
  className = "",
}: Props) {
  const { isPlaying } = useAudio();
  const hydrated = useHydrated();
  const isBrand = brandApps.some((b) => b.id === app.id);

  const dims = {
    grid: 58,
    page2: 58,
    dock: 58,
    brand: 64,
  }[size];

  const glyphSize = size === "brand" ? 34 : 29;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const origin = getOrigin(event.currentTarget);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(7);
      } catch {
        /* noop */
      }
    }
    onOpen(app, origin);
  };

  const date = new Date();
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short" })
    .format(date)
    .toUpperCase();

  const squircle = (
    <span
      className={`icon-squircle relative flex items-center justify-center ${
        isBrand ? "bg-black/10" : ""
      }`}
      style={{
        width: dims,
        height: dims,
        background: isBrand
          ? "transparent"
          : app.id === "calendar"
            ? "#fff"
            : `linear-gradient(150deg, ${app.color} 0%, ${app.color2 ?? app.color} 100%)`,
      }}
    >
      {app.id === "calendar" ? (
        <span className="relative z-[1] flex h-full w-full flex-col items-center justify-center">
          <span className="mt-[3px] text-[7.5px] font-bold uppercase leading-none tracking-[0.14em] text-[#FF3B30]">
            {hydrated ? weekday : "WED"}
          </span>
          <span className="-mt-px text-[26px] font-light leading-[1.05] tracking-[-0.05em] text-[#1C1C1E]">
            {hydrated ? date.getDate() : 25}
          </span>
        </span>
      ) : isBrand ? (
        <span
          className={`relative z-[1] flex h-full w-full ${
            isPlaying ? "beat-icon" : ""
          }`}
          style={{ animationPlayState: isPlaying ? "running" : "paused" }}
        >
          <BrandMark id={app.id as BrandId} className="h-full w-full" />
        </span>
      ) : (
        glyphFor(app, glyphSize)
      )}

      {app.id === "wallet" && (
        <span className="absolute bottom-[9px] left-1/2 z-[1] flex -translate-x-1/2 gap-[2px]">
          <span className="h-[6px] w-[12px] rounded-[2px] bg-[#4CD964]" />
          <span className="h-[6px] w-[12px] rounded-[2px] bg-[#FF9F0A]" />
          <span className="h-[6px] w-[12px] rounded-[2px] bg-[#0A84FF]" />
        </span>
      )}
      {app.id === "messages" && badge ? (
        <span
          className="absolute -right-[3px] -top-[3px] z-20 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#FF3B30] px-[4px] text-[10px] font-semibold leading-none text-white shadow-[0_1px_4px_rgba(0,0,0,0.45)] ring-2 ring-[#050403]/30"
          aria-hidden="true"
        >
          {badge > 9 ? "9+" : badge}
        </span>
      ) : null}
    </span>
  );

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileTap={{ scale: 0.86 }}
      whileHover={{ scale: 1.035 }}
      transition={{ type: "spring", stiffness: 500, damping: 26 }}
      className={`group relative flex flex-col items-center outline-none ${className}`}
      aria-label={`Open ${app.label}`}
    >
      {squircle}
      {showLabel && (
        <span
          className={`icon-label mt-[6px] text-center ${
            size === "brand" ? "text-[10.5px] font-medium" : ""
          }`}
        >
          {app.label}
        </span>
      )}
    </motion.button>
  );
}
