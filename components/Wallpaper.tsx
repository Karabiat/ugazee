"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { config } from "@/lib/config";

type Props = {
  variant?: "lock" | "home";
};

/**
 * One wallpaper instance shared by the lock screen and home screen.
 * Video is muted and only used visually. If it fails, the poster takes over.
 */
export function Wallpaper({ variant = "lock" }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const [failed, setFailed] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      video.play().catch(() => {
        /* poster remains */
      });
    };
    if (reduceMotion) {
      video.pause();
      return;
    }
    play();
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) video.pause();
      else play();
    });
    return () => {
      video.pause();
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    const layer = layerRef.current;
    if (!layer) return;

    let raf = 0;
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      target.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      target.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    const onTilt = (event: DeviceOrientationEvent) => {
      if (event.gamma == null || event.beta == null) return;
      target.current.x = Math.max(-1, Math.min(1, event.gamma / 35));
      target.current.y = Math.max(-1, Math.min(1, (event.beta - 45) / 35));
    };

    const loop = () => {
      current.current.x += (target.current.x - current.current.x) * 0.045;
      current.current.y += (target.current.y - current.current.y) * 0.045;
      layer.style.transform = `translate3d(${current.current.x * -9}px, ${
        current.current.y * -11
      }px, 0) scale(1.08)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("deviceorientation", onTilt);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, [reduceMotion]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#0b0806]" aria-hidden="true">
      <div ref={layerRef} className="absolute inset-[-4%] will-change-transform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={config.artist.poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        {!failed && (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={config.artist.wallpaper}
            poster={config.artist.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setFailed(true)}
            aria-hidden="true"
            tabIndex={-1}
          />
        )}
      </div>

      {variant === "lock" ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/5 to-black/85" />
          <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_10%,transparent_30%,rgba(0,0,0,0.32)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/55" />
          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_45%,transparent_35%,rgba(0,0,0,0.45)_100%)]" />
        </>
      )}
    </div>
  );
}
