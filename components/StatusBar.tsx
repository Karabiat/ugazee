"use client";

import { useClock } from "@/hooks/useClock";
import { formatClock } from "@/lib/format";
import { Wifi } from "lucide-react";

type Props = {
  onTestNotification?: () => void;
  tone?: "light" | "dark";
};

export function StatusBar({ onTestNotification, tone = "light" }: Props) {
  const now = useClock();
  const time = now ? formatClock(now) : "9:41";
  const color = tone === "dark" ? "text-black" : "text-white";

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 z-[60] flex h-[54px] items-center justify-between px-[24px] ${color}`}
    >
      <button
        type="button"
        onClick={(event) => event.stopPropagation()}
        onDoubleClick={(event) => {
          event.stopPropagation();
          onTestNotification?.();
        }}
        className="pointer-events-auto status-text -ml-[2px] tabular outline-none"
        aria-label={`${time}. Double-click for a notification test.`}
        title="Double-click for notification test"
      >
        <span suppressHydrationWarning>{time}</span>
      </button>

      <div
        className="flex items-center gap-[6px]"
        role="img"
        aria-label="Cellular signal strong, Wi-Fi connected, battery 82 percent"
      >
        <span className="flex items-end gap-[1.5px]" aria-hidden="true">
          {[4, 6, 8, 10].map((h, i) => (
            <span
              key={h}
              className="w-[3px] rounded-[1px] bg-current"
              style={{ height: h, opacity: i === 0 ? 0.55 : 1 }}
            />
          ))}
        </span>
        <Wifi size={15} strokeWidth={2.4} aria-hidden="true" />
        <span className="flex items-center gap-[2px]" aria-hidden="true">
          <span className="relative flex h-[12px] w-[24px] items-center rounded-[3.5px] border border-current/40 p-[1.5px]">
            <span className="h-full w-[78%] rounded-[2px] bg-current" />
          </span>
          <span className="h-[4px] w-[1.5px] rounded-r-sm bg-current/50" />
        </span>
      </div>
    </div>
  );
}
