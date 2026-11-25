"use client";

import type { ReactElement } from "react";

/**
 * Custom, hand-drawn brand marks.
 *
 * TO SWAP IN OFFICIAL ASSETS:
 *   1. Drop square transparent PNG/SVG files into /public/brand/
 *   2. Add the paths below.
 * When a path is present it is rendered instead of the SVG. The surrounding
 * squircle / mask stays identical, so sizing will not change.
 */
export const OFFICIAL_BRAND_ASSETS: Partial<Record<BrandId, string>> = {
  // spotify: "/brand/spotify.svg",
  // appleMusic: "/brand/apple-music.svg",
  // soundcloud: "/brand/soundcloud.svg",
};

export type BrandId = "spotify" | "appleMusic" | "soundcloud";

export function SpotifyGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="32" fill="#1ED760" />
      <g fill="none" stroke="#07240F" strokeLinecap="round">
        <path d="M16.5 23.6c11.2-3.8 23.9-2.6 32.9 2.7" strokeWidth="4.6" />
        <path d="M19 32.9c8.9-2.9 18.7-2 26.2 2.5" strokeWidth="3.8" />
        <path d="M21.8 41.4c6.7-2.1 14-1.4 20.4 2" strokeWidth="3.1" />
      </g>
    </svg>
  );
}

export function AppleMusicGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="am-bg" x1="10" y1="0" x2="54" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF5C77" />
          <stop offset="0.55" stopColor="#FA2D48" />
          <stop offset="1" stopColor="#D91334" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill="url(#am-bg)" />
      <path
        d="M43.9 13.6v23.9c0 5.2-3.9 9.1-9.1 9.1-4.2 0-7.2-2.4-7.2-5.8 0-3.7 3.2-6.5 8-6.5 1.6 0 3.1.25 4.3.8V20.9l-17 3.65v18.9c0 5.2-3.9 9.1-9.1 9.1-4.2 0-7.2-2.4-7.2-5.8 0-3.7 3.2-6.5 8-6.5 1.6 0 3.1.25 4.3.8V18.2c0-.95.65-1.75 1.6-1.95l21-4.5c1.3-.3 2.4.7 2.4 1.95z"
        fill="#fff"
      />
    </svg>
  );
}

export function SoundCloudGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="sc-bg" x1="8" y1="2" x2="58" y2="62" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF8A3D" />
          <stop offset="1" stopColor="#FF4C00" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill="url(#sc-bg)" />
      <g fill="#fff">
        <rect x="12.5" y="34" width="2.6" height="11" rx="1.3" />
        <rect x="18" y="30" width="2.6" height="15" rx="1.3" />
        <rect x="23.5" y="26.5" width="2.6" height="18.5" rx="1.3" />
        <rect x="29" y="23.5" width="2.6" height="21.5" rx="1.3" />
        <path d="M35.8 45.1h14.6c4.3 0 7.7-3.4 7.7-7.7 0-4.1-3.2-7.5-7.3-7.7h-.6c-.6 0-1.2.08-1.8.24-1.4-3.8-5.1-6.5-9.4-6.5-2.3 0-4.4.8-6.1 2.1a2 2 0 0 0-.7 1.5v16.7c0 .9.7 1.6 1.6 1.6z" />
      </g>
    </svg>
  );
}

const GLYPHS: Record<BrandId, (props: { className?: string }) => ReactElement> = {
  spotify: SpotifyGlyph,
  appleMusic: AppleMusicGlyph,
  soundcloud: SoundCloudGlyph,
};

export function BrandMark({ id, className = "" }: { id: BrandId; className?: string }) {
  const official = OFFICIAL_BRAND_ASSETS[id];
  if (official) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={official} alt="" className={className} draggable={false} />
    );
  }
  const Glyph = GLYPHS[id];
  return <Glyph className={className} />;
}
