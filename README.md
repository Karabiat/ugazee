# Ugazee — Detty December

An interactive artist site built around a single idea: **the record lives inside an iPhone**. Visitors land on a lock screen, swipe up, and the song starts playing inside a live Dynamic Island Live Activity. Scroll past the phone and the December roll-out unfolds — discography, videos, every streaming platform, and a real countdown to the album.

Built with Next.js (App Router) + TypeScript, Tailwind CSS v4, React Three Fiber, GSAP ScrollTrigger + Lenis, and Framer Motion.

---

## Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
```

Node 18.18+ is recommended (Node 20+ works best).

---

## What's on the page

**The phone**

- Lock screen with live clock/date, drag-to-unlock, and a double-click notification test.
- Home screen with real widgets, a 4-column icon grid, page dots, a swipeable second page, and a Now Playing widget.
- Dynamic Island that morphs between four states:
  - idle `120 × 34`
  - compact `190 × 36` — cover art, title, 5 analyser bars
  - expanded `350 × 160` — cover, title, artist, waveform, draggable scrubber, times, prev/play/next
  - split (notification) state with the Messages icon and 4 bars
- Paused playback flattens the analyser bars to resting dots, just like iOS.
- A synthesized iMessage banner arrives 8–20 seconds after unlocking: chime, audio ducking, haptic buzz, and the split island. Tap it to open a working Messages conversation.
- Every app icon opens a purpose-built mock screen: Spotify, Apple Music and SoundCloud artist pages with release details and real external links; plus Phone, Safari, Camera, Photos, Clock, Weather, Maps, Notes, Calendar, Settings, Mail, Wallet, Health and Files.
- Swipe up on the home indicator to close an app.

**The site**

- Lazy-loaded, beat/bass-reactive React Three Fiber record field with mouse parallax.
- A GSAP + Lenis pinned roll-out story: discography, videos, listen everywhere, countdown.
- The phone shrinks and moves left as the story begins; a scroll-rotated 3D vinyl sits behind it.
- Fully responsive: on small screens the phone is full-bleed and the story becomes a normal scrolling sequence.
- Respects `prefers-reduced-motion`: no pinning, no 3D canvases, no autoplay animation; the layout falls back to static CSS atmosphere.
- Keyboard and screen-reader support: the island, lock screen, notification and every control are labelled and operable. The video wallpaper is decorative and muted.

---

## Editing content

**Everything a non-developer needs is in one file:**

```
lib/config.ts
```

It contains the artist name, bio, tagline, track metadata, BPM, platform links, socials, release/tracklist data, video links, notification copy, and the Messages script.

### Replace the song

The delivered WAV is intentionally **not** shipped. The site uses the converted deliverables:

```
public/audio/detty-december.mp3   ← primary (192 kbps MP3)
public/audio/detty-december.m4a   ← fallback (AAC)
```

To swap in a new master:

1. Export two files with the same names (MP3 and M4A/AAC).
2. Drop them into `public/audio/`.
3. If the new master has a different length, update `config.track.duration` (seconds).
4. If the BPM changes, update `config.track.bpm`. The beat clock, island pulse and icon beat all follow it automatically.

If the audio files are missing or unreadable, the site enters a **silent preview mode**: the beat clock and synthetic visualiser keep running instead of breaking.

### Replace the wallpaper video

```
public/video/ugazee-wallpaper.mp4   ← 576×848 portrait, muted, ~32 s
public/img/poster.jpg               ← still frame used as poster + fallback
```

Keep the video muted with no audio track, H.264, `yuv420p`, and `faststart`. The code mutes it regardless, and pauses it when the tab is hidden or reduced motion is requested.

### Replace artwork

```
public/img/covers/detty-december.jpg
public/img/covers/no-fi-whine.jpg
public/img/covers/cancun-mexico.jpg
public/img/covers/backup.jpg
public/img/covers/ugazee-nigeria.jpg
public/img/covers/genieboys-christmas-carol.jpg
public/img/covers/iskaba-lol-remix.jpg
```

Use 1:1 JPG/PNG files at 900×900 or larger. The six catalogue covers are the official Spotify artwork; `detty-december.jpg` is the local single art. Update the filenames in `lib/config.ts` if they change.

### Replace platform links

Spotify is wired to the real artist page and each release (`open.spotify.com/artist/7kfEng4OspTrDhaVjucde6`). Apple Music and SoundCloud still use search fallbacks so the site never links to the wrong profile. Before launch, replace them with the official artist/release URLs:

```ts
// lib/config.ts
platforms: {
  spotify:     { url: "https://open.spotify.com/artist/…" },
  appleMusic:  { url: "https://music.apple.com/artist/…" },
  soundcloud:  { url: "https://soundcloud.com/…" },
}
```

The same applies to each release's `links` block, `config.album.preSaveUrl`, `config.socials`, and `config.videos[].url`.

### Official brand marks

`components/apps/BrandIcons.tsx` ships hand-drawn SVG marks. To use official assets:

1. Add square, transparent SVG/PNG files under `public/brand/`.
2. Fill in the `OFFICIAL_BRAND_ASSETS` map at the top of that file.

Sizing, masks and squircle behaviour stay identical.

### Dates and copy

- Album release date: `config.album.dropISO` (currently `2026-12-12T00:00:00+01:00`).
- Notification delay: `config.notification.minDelayMs` / `maxDelayMs`.
- Banner auto-dismiss: `config.notification.autoDismissMs`.
- Messages replies: `config.messages.replies` (prompt → scripted reply).

---

## Project structure

```
app/
  layout.tsx            metadata, viewport, theme colour, icon
  page.tsx              server entry
  icon.svg              favicon
  globals.css           design system, phone hardware, island, story, motion
components/
  AudioProvider.tsx     Web Audio graph, analyser, beat clock, ducking, chime
  Phone.tsx             unlock, app launch origin animation, notifications, layering
  DynamicIsland.tsx     idle/compact/expanded/split orchestration
  island/               compact, expanded, analyser bar renderer
  LockScreen.tsx        drag/click unlock, live clock, notification test
  HomeScreen.tsx        widgets, icon grid, page 2, page dots
  AppIcon.tsx           squircle icons + computed launch origin
  Dock.tsx / StatusBar.tsx / Wallpaper.tsx / Countdown.tsx
  Notification.tsx      iMessage banner
  Messages.tsx          typing, scripted replies, Delivered
  UtilityApp.tsx        all system app mock screens
  apps/                 Spotify, Apple Music, SoundCloud + shared release UI
  Scene3D.tsx           R3F floating vinyl field (lazy)
  Scene3DLazy.tsx       WebGL + reduced-motion guard
  RecordRing.tsx        in-view lazy 3D vinyl for the story
  RecordRingScene.tsx   scroll-rotated vinyl canvas
  ScrollStory.tsx       Lenis + GSAP pin, panels, progress rail
  SiteChrome.tsx        masthead, hero, footer
  Experience.tsx        client root
lib/
  config.ts             ← edit me
  beat.ts               135 BPM clock helpers
  format.ts             time/date/clamp helpers
  scrollStore.ts        mutable bridge for 60fps scroll → canvas
  webgl.ts              capability check
hooks/
  useAudioAnalyser.ts   30fps smoothed bands + bass/mid/high
  useClock.ts           minute clock, hydration, media query
public/
  audio/  video/  img/  brand (optional)
```

---

## Audio & performance notes

- Audio only starts after a user gesture (unlocking the phone or pressing play), which satisfies browser autoplay policies.
- A single `<audio>` element is routed through `AudioContext → AnalyserNode → GainNode → destination`.
- The analyser runs on `requestAnimationFrame`; bars are smoothed and capped at ~30 fps.
- The background 3D scene stops rendering when the tab is hidden (`frameloop="never"`).
- The story’s vinyl canvas only mounts when it is near the viewport.
- On devices without WebGL, or with reduced motion enabled, the site uses a pure CSS atmosphere instead.

## Deployment

Any platform that supports Next.js works (Vercel, Netlify, Cloudflare, a Node server). No environment variables are required. The audio and video are served from `/public`, so use a host with sane range-request support for media.

## Credits

Site concept, design and build for Ugazee. “Detty December” master supplied by the artist. All platform names and icons belong to their respective owners; the mock apps are an affectionate fan-concept, not affiliated interfaces.
