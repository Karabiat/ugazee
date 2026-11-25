"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { config } from "@/lib/config";

type Props = {
  visible: boolean;
  onOpen: () => void;
  onDismiss: () => void;
};

export function Notification({ visible, onOpen, onDismiss }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="imessage-banner"
          className="absolute inset-x-[8px] top-[58px] z-[86]"
          initial={
            reduceMotion
              ? { opacity: 0 }
              : { y: -96, opacity: 0, scale: 0.94, filter: "blur(6px)" }
          }
          animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { y: -102, opacity: 0, scale: 0.96, filter: "blur(4px)" }
          }
          transition={{ type: "spring", stiffness: 390, damping: 30, mass: 0.8 }}
          drag="y"
          dragConstraints={{ top: -120, bottom: 0 }}
          dragElastic={{ top: 0.4, bottom: 0 }}
          dragMomentum={false}
          onDragEnd={(_, info) => {
            if (info.offset.y < -34 || info.velocity.y < -380) onDismiss();
          }}
          role="button"
          tabIndex={0}
          aria-label={`Message from ${config.notification.sender}: ${config.notification.text}. Open conversation.`}
          onClick={onOpen}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onOpen();
            }
            if (event.key === "Escape") onDismiss();
          }}
          whileTap={{ scale: 0.985 }}
        >
          <div className="rounded-[24px] border border-white/10 bg-[#1c1c1e]/92 px-[13px] py-[11px] shadow-[0_18px_50px_-10px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-[36px] backdrop-saturate-[180%]">
            <div className="flex items-start gap-[10px]">
              <span className="mt-[1px] flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-b from-[#42E070] to-[#21B84A] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_3px_8px_rgba(0,0,0,0.3)]">
                <MessageCircle
                  size={21}
                  strokeWidth={2.2}
                  className="text-white"
                  aria-hidden="true"
                />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[8.5px] font-semibold uppercase tracking-[0.14em] text-white/45">
                    Messages
                  </span>
                  <span className="text-[9px] font-medium text-white/40">
                    {config.notification.timeLabel}
                  </span>
                </div>
                <p className="mt-[1px] text-[12px] font-semibold leading-tight text-white">
                  {config.notification.sender}
                </p>
                <p className="mt-[2px] line-clamp-2 text-[11.5px] leading-[1.3] text-white/78">
                  {config.notification.text}
                </p>
              </div>
            </div>
          </div>
          <span className="mx-auto mt-[3px] block h-[3px] w-[68px] rounded-full bg-white/15" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
