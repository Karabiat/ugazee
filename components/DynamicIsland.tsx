"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useAudio } from "@/components/AudioProvider";
import { CompactView } from "@/components/island/CompactView";
import { ExpandedView } from "@/components/island/ExpandedView";

type Props = {
  split: boolean;
  onOpenMessages: () => void;
  onIdleActivate?: () => void;
};

const COLLAPSE_AFTER = 6000;

export function DynamicIsland({ split, onOpenMessages, onIdleActivate }: Props) {
  const { isPlaying, currentTime, beat } = useAudio();
  const reduceMotion = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [pulse, setPulse] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const idle = !hasStarted && !split;
  const paused = !isPlaying;

  useEffect(() => {
    if (isPlaying || currentTime > 0.2) setHasStarted(true);
  }, [isPlaying, currentTime]);

  const bumpActivity = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setExpanded(false), COLLAPSE_AFTER);
  }, []);

  useEffect(() => {
    if (!expanded) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }
    bumpActivity();
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setExpanded(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };
    document.addEventListener("pointerdown", onPointer, true);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer, true);
      window.removeEventListener("keydown", onKey);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [expanded, bumpActivity]);

  useEffect(() => {
    if (split) setExpanded(false);
  }, [split]);

  useEffect(() => {
    if (!isPlaying || reduceMotion) return;
    setPulse(true);
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    pulseTimer.current = setTimeout(() => setPulse(false), 130);
    return () => {
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
    };
  }, [beat, isPlaying, reduceMotion]);

  const activate = () => {
    if (split) {
      onOpenMessages();
      return;
    }
    if (idle) {
      onIdleActivate?.();
      return;
    }
    setExpanded((value) => {
      const next = !value;
      if (!next && timeoutRef.current) clearTimeout(timeoutRef.current);
      return next;
    });
  };

  const label = split
    ? "New message from Ugazee. Open Messages."
    : idle
      ? "Dynamic Island. Open Ugazee's iPhone and start Detty December."
      : `Detty December by Ugazee. ${paused ? "Paused" : "Playing"}. ${
          expanded ? "Collapse" : "Expand"
        } Live Activity.`;

  return (
    <div
      className="island-wrap"
      onClick={(event) => event.stopPropagation()}
      onDoubleClick={(event) => event.stopPropagation()}
    >
      <motion.div
        animate={{ scale: pulse && !expanded && !reduceMotion ? 1.016 : 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 24 }}
        style={{ transformOrigin: "center top" }}
      >
        <motion.div
          ref={rootRef}
          role={expanded ? "group" : "button"}
          tabIndex={0}
          aria-expanded={expanded}
          aria-label={label}
          onClick={(event) => {
            event.stopPropagation();
            activate();
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape" && expanded) {
              setExpanded(false);
              return;
            }
            if (event.target !== event.currentTarget) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              activate();
            }
          }}
          onPointerDown={() => {
            if (expanded) bumpActivity();
          }}
          initial={false}
          animate={{
            width: expanded ? 350 : idle ? 120 : 190,
            height: expanded ? 160 : idle ? 34 : 36,
            borderRadius: expanded ? 38 : 22,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.75 }}
          className={`island relative ${expanded ? "island-expanded" : ""}`}
          style={{ cursor: "pointer" }}
        >
          <AnimatePresence initial={false}>
            {expanded ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <ExpandedView onInteract={bumpActivity} />
              </motion.div>
            ) : (
              <motion.div
                key={idle ? "idle" : split ? "split" : "compact"}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <CompactView split={split} paused={paused} idle={idle} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <span className="sr-only" aria-live="polite">
        {!idle && !split
          ? `${isPlaying ? "Playing" : "Paused"} Detty December by Ugazee`
          : ""}
      </span>
    </div>
  );
}
