"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";
import { useHydrated } from "@/hooks/useClock";
import {
  ArrowUpRight,
  CalendarDays,
  Disc3,
  Play,
} from "lucide-react";
import { config, type PlatformKey } from "@/lib/config";
import { storyScroll } from "@/lib/scrollStore";
import { Countdown } from "@/components/Countdown";
import { BrandMark } from "@/components/apps/BrandIcons";
import { RecordRing } from "@/components/RecordRing";

const PLATFORMS: PlatformKey[] = ["spotify", "appleMusic", "soundcloud"];

function PanelHeader({
  index,
  kicker,
  title,
  copy,
}: {
  index: string;
  kicker: string;
  title: string;
  copy: string;
}) {
  return (
    <header className="max-w-[640px]">
      <div className="flex items-center gap-[10px] text-[9px] font-semibold uppercase tracking-[0.24em] sm:text-[10px]">
        <span className="h-px w-7 bg-[#EFC178]/60" aria-hidden="true" />
        <span className="text-[#EFC178]">{index}</span>
        <span className="text-white/40">{kicker}</span>
      </div>
      <h2 className="mt-[10px] text-[clamp(34px,4.6vw,62px)] font-semibold leading-[0.92] tracking-[-0.045em] text-[#f7f0e4]">
        {title}
      </h2>
      <p className="mt-[12px] max-w-[520px] text-[12px] leading-[1.65] text-white/50 sm:text-[13px]">
        {copy}
      </p>
    </header>
  );
}

function DiscographyPanel() {
  const section = config.story.sections[0];
  return (
    <article className="story-panel">
      <div className="w-full">
        <PanelHeader {...section} />
        <div className="mt-[22px] w-full border-t border-white/10">
          {config.discography.map((release, index) => (
            <a
              key={release.id}
              href={release.links.spotify}
              target="_blank"
              rel="noreferrer noopener"
              className="release-row group flex items-center gap-[12px] border-b border-white/10 py-[11px] sm:py-[12px]"
              aria-label={`Listen to ${release.title} on Spotify (opens in a new tab)`}
            >
              <span className="w-[22px] shrink-0 text-[9px] tabular-nums text-white/25">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="cover-art h-[42px] w-[42px] shrink-0 rounded-[5px] sm:h-[46px] sm:w-[46px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={release.cover} alt="" draggable={false} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium tracking-[-0.01em] text-white/90 sm:text-[14px]">
                  {release.title}
                </span>
                <span className="mt-[2px] block truncate text-[9px] uppercase tracking-[0.14em] text-white/30">
                  {release.type} · {release.year} · {release.tracklist.length} track
                  {release.tracklist.length === 1 ? "" : "s"}
                </span>
              </span>
              <span
                className="hidden shrink-0 items-center gap-[6px] text-[9px] font-semibold uppercase tracking-[0.14em] transition-opacity sm:flex"
                style={{ color: release.accent }}
              >
                <span className="h-[5px] w-[5px] rounded-full" style={{ background: release.accent }} />
                Play
              </span>
              <ArrowUpRight
                size={14}
                className="shrink-0 text-white/25 transition-all duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px] group-hover:text-white/70"
                aria-hidden="true"
              />
            </a>
          ))}
        </div>
        <a
          href={config.platforms.spotify.url}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-[14px] inline-flex items-center gap-[6px] text-[9px] font-semibold uppercase tracking-[0.16em] text-[#EFC178] transition-colors hover:text-white"
        >
          Full discography on Spotify
          <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

function VideosPanel() {
  const section = config.story.sections[1];
  return (
    <article className="story-panel">
      <div className="w-full">
        <PanelHeader {...section} />
        <div className="mt-[24px] grid gap-[14px] sm:grid-cols-2">
          {config.videos.map((video) => (
            <a
              key={video.title}
              href={video.url}
              target="_blank"
              rel="noreferrer noopener"
              className="video-card group block"
              aria-label={`Watch ${video.title} — ${video.subtitle} (opens in a new tab)`}
            >
              <span className="relative block aspect-[16/10] overflow-hidden rounded-[10px] border border-white/10 bg-white/[0.03]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={video.thumbnail}
                  alt=""
                  className="video-thumb h-full w-full object-cover"
                  draggable={false}
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                <span className="absolute left-1/2 top-1/2 flex h-[46px] w-[46px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
                  <Play size={16} fill="white" strokeWidth={0} className="ml-[2px]" aria-hidden="true" />
                </span>
                <span className="absolute bottom-[9px] left-[10px] rounded-full bg-black/45 px-[8px] py-[3px] text-[8px] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-md">
                  {video.meta}
                </span>
              </span>
              <span className="mt-[10px] flex items-start justify-between gap-3">
                <span>
                  <span className="block text-[13px] font-medium text-white/90">{video.title}</span>
                  <span className="mt-[2px] block text-[10px] text-white/40">{video.subtitle}</span>
                </span>
                <ArrowUpRight
                  size={14}
                  className="mt-[2px] shrink-0 text-white/25 transition-colors group-hover:text-white/70"
                  aria-hidden="true"
                />
              </span>
            </a>
          ))}
        </div>
        <p className="mt-[18px] flex items-center gap-[7px] text-[9px] uppercase tracking-[0.18em] text-white/25">
          <Disc3 size={12} className="text-[#EFC178]/70" aria-hidden="true" />
          Shot in Lagos · 2026
        </p>
      </div>
    </article>
  );
}

function PlatformsPanel() {
  const section = config.story.sections[2];
  return (
    <article className="story-panel">
      <div className="w-full">
        <PanelHeader {...section} />
        <div className="mt-[24px] grid gap-[10px]">
          {PLATFORMS.map((key) => {
            const platform = config.platforms[key];
            return (
              <a
                key={key}
                href={platform.url}
                target="_blank"
                rel="noreferrer noopener"
                className="platform-card group flex items-center gap-[13px] rounded-[14px] border border-white/10 bg-white/[0.03] px-[14px] py-[13px]"
                style={{ "--platform-color": platform.color } as React.CSSProperties}
                aria-label={`${platform.label} — opens in a new tab`}
              >
                <BrandMark id={key} className="h-[36px] w-[36px] shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-white/92">
                    {platform.name}
                  </span>
                  <span className="mt-[1px] block text-[10px] text-white/40">
                    {platform.label}
                  </span>
                </span>
                <span
                  className="flex items-center gap-[5px] rounded-full px-[10px] py-[5px] text-[8.5px] font-bold uppercase tracking-[0.1em]"
                  style={{ background: `${platform.color}18`, color: platform.color }}
                >
                  Play
                </span>
                <ArrowUpRight
                  size={15}
                  className="shrink-0 text-white/25 transition-all duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px] group-hover:text-white/70"
                  aria-hidden="true"
                />
              </a>
            );
          })}
        </div>
        <div className="mt-[18px] flex flex-wrap items-center gap-x-[18px] gap-y-[8px] text-[9px] uppercase tracking-[0.16em] text-white/25">
          {config.socials.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors hover:text-[#EFC178]"
            >
              {social.label} <ArrowUpRight size={9} className="inline" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

function CountdownPanel() {
  const section = config.story.sections[3];
  return (
    <article className="story-panel">
      <div className="w-full">
        <PanelHeader {...section} />
        <div className="mt-[24px] rounded-[16px] border border-white/10 bg-gradient-to-br from-white/[0.055] to-transparent p-[16px] sm:p-[20px]">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="flex items-center gap-[6px] text-[9px] font-semibold uppercase tracking-[0.2em] text-[#EFC178]">
                <CalendarDays size={11} aria-hidden="true" /> Album · {config.album.dropLabel}
              </p>
              <p className="mt-[5px] text-[24px] font-semibold leading-none tracking-[-0.035em] text-white sm:text-[30px]">
                {config.album.title}
              </p>
            </div>
            <p className="text-[9px] uppercase tracking-[0.16em] text-white/30">
              Ugazee · 2026
            </p>
          </div>
          <Countdown variant="story" className="mt-[18px]" />
          <div className="mt-[18px] flex flex-wrap items-center gap-[10px]">
            <a
              href={config.album.preSaveUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-[38px] items-center gap-[7px] rounded-full bg-[#EFC178] px-[18px] text-[9.5px] font-bold uppercase tracking-[0.1em] text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Pre-save the album
              <ArrowUpRight size={13} strokeWidth={2.6} aria-hidden="true" />
            </a>
            <Link
              href="#hero"
              className="inline-flex h-[38px] items-center gap-[7px] rounded-full border border-white/15 px-[16px] text-[9.5px] font-semibold uppercase tracking-[0.1em] text-white/65 transition-colors hover:border-white/30 hover:text-white"
            >
              Back to the phone
            </Link>
          </div>
        </div>
        <p className="mt-[14px] text-[9px] leading-relaxed text-white/25">
          Mastered at 135 BPM. The countdown is real — the rest is a simulation.
        </p>
      </div>
    </article>
  );
}

export function ScrollStory() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const hydrated = useHydrated();
  const reduced = hydrated && Boolean(prefersReducedMotion);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.105,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.35,
    });

    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onLenisScroll);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const panels = gsap.utils.toArray<HTMLElement>(
        ".story-panel",
        viewport,
      );
      if (!panels.length) return;

      gsap.set(panels, { transformOrigin: "50% 40%" });
      gsap.set(panels.slice(1), { autoAlpha: 0, y: 52 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: viewport,
          start: "top top",
          end: () => `+=${window.innerHeight * 4.2}`,
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            storyScroll.progress = self.progress;
            storyScroll.scrollY = self.scroll();
            storyScroll.active = true;
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleY(${Math.max(
                0.02,
                self.progress,
              )})`;
            }
            const next = Math.min(
              panels.length - 1,
              Math.round(self.progress * (panels.length - 1)),
            );
            setActiveIndex((prev) => (prev === next ? prev : next));
          },
          onLeave: () => {
            storyScroll.active = false;
            storyScroll.progress = 1;
          },
          onLeaveBack: () => {
            storyScroll.active = false;
            storyScroll.progress = 0;
          },
        },
      });

      panels.forEach((panel, index) => {
        if (index === 0) return;
        // Quick dissolves with long holds so a visitor who stops scrolling
        // always lands on one readable panel rather than a half-faded pair.
        const at = 0.85 + (index - 1) * 1.05;
        tl.to(panels[index - 1], { autoAlpha: 0, y: -40, duration: 0.2 }, at)
          .to(panel, { autoAlpha: 1, y: 0, duration: 0.2 }, at);
      });
      // Hold the final panel for the last stretch of the pinned scroll.
      tl.to({}, { duration: 0.5 }, 2.95 + 0.2);

      const phone = document.querySelector<HTMLElement>(".phone-tilt");
      if (phone) {
        gsap.fromTo(
          phone,
          { x: 0, y: 0, scale: 1 },
          {
            x: () => -window.innerWidth * 0.205,
            y: 0,
            scale: 0.8,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: viewport,
              start: "top bottom",
              end: "top top",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      gsap.to(".hero-copy", {
        autoAlpha: 0,
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: viewport,
          start: "top bottom",
          end: "top 55%",
          scrub: true,
        },
      });
    });

    mm.add("(max-width: 1023px)", () => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      // Small screens are full-bleed: the phone steps out of the way as the
      // roll-out cards arrive instead of shrinking into a cramped corner.
      gsap.to(".phone-stage", {
        autoAlpha: 0,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: viewport,
          start: "top 70%",
          end: "top 25%",
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      });
      gsap.to(".hero-copy", {
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: viewport,
          start: "top bottom",
          end: "top 70%",
          scrub: true,
        },
      });
    });

    ScrollTrigger.refresh();

    return () => {
      mm.revert();
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
      gsap.ticker.remove(tick);
      storyScroll.active = false;
      storyScroll.progress = 0;
    };
  }, [prefersReducedMotion]);

  const sections = config.story.sections;

  return (
    <section
      id="story"
      ref={sectionRef}
      className="story-section"
      data-reduced={reduced ? "true" : undefined}
      aria-label="Ugazee — the December roll-out"
    >
      <div ref={viewportRef} className="story-viewport">
        <div className="story-copy">
          <div className="relative h-full w-full">
            <DiscographyPanel />
            <VideosPanel />
            <PlatformsPanel />
            <CountdownPanel />
          </div>
        </div>

        <div className="ring-stage">
          <RecordRing />
        </div>

        <div
          className="pointer-events-none absolute right-[26px] top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-[10px] lg:flex"
          aria-hidden="true"
        >
          <span className="text-[10px] font-semibold tabular-nums text-[#EFC178]">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span className="relative block h-[170px] w-px overflow-hidden bg-white/12">
            <span
              ref={progressRef}
              className="story-progress-fill absolute inset-x-0 top-0 block h-full bg-[#EFC178]"
              style={{ transform: "scaleY(0.02)" }}
            />
          </span>
          <span className="text-[10px] font-semibold tabular-nums text-white/30">
            {String(sections.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
