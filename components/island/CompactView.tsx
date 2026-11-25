"use client";

import { MessageCircle } from "lucide-react";
import { config } from "@/lib/config";
import { Visualizer } from "@/components/island/Visualizer";

type Props = {
  split: boolean;
  paused: boolean;
  idle: boolean;
};

export function CompactView({ split, paused, idle }: Props) {
  if (idle) {
    return (
      <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <span className="absolute right-[13px] top-1/2 h-[9px] w-[9px] -translate-y-1/2 rounded-full bg-[#070707] shadow-[inset_0_0_2px_rgba(255,255,255,0.07),0_0_0_0.5px_rgba(255,255,255,0.025)]" />
      </span>
    );
  }

  if (split) {
    return (
      <span className="flex h-full items-center gap-[9px] pl-[7px] pr-[11px]">
        <span className="flex h-[25px] w-[25px] items-center justify-center rounded-[7px] bg-gradient-to-b from-[#3DDC66] to-[#21B84A] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.35)]">
          <MessageCircle size={14} strokeWidth={2.4} className="text-white" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1 truncate text-[10.5px] font-medium tracking-[-0.01em] text-white/80">
          Ugazee
        </span>
        <Visualizer variant="split" />
      </span>
    );
  }

  return (
    <span className="flex h-full items-center gap-[8px] pl-[6px] pr-[11px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={config.track.cover}
        alt=""
        className="island-cover h-[26px] w-[26px] rounded-[7px] object-cover"
        style={{ opacity: paused ? 0.5 : 1, transition: "opacity 300ms ease" }}
        draggable={false}
      />
      <span
        className="min-w-0 flex-1 truncate text-[10.5px] font-medium leading-none tracking-[-0.015em] text-white/90"
        style={{ opacity: paused ? 0.58 : 1, transition: "opacity 300ms ease" }}
      >
        {config.track.title}
      </span>
      <Visualizer variant="compact" />
    </span>
  );
}
