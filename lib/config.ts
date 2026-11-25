/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  UGAZEE — single source of truth.
 *  Everything a non-developer needs to change lives in this file.
 *
 *  ASSET DROP-IN NOTES
 *  • Song:        /public/audio/detty-december.mp3  (+ .m4a fallback)
 *  • Wallpaper:   /public/video/ugazee-wallpaper.mp4 (576×848, muted, 32s)
 *  • Poster:      /public/img/poster.jpg (still frame from the video)
 *  • Covers:      /public/img/covers/*.jpg (1:1, 900×900 or larger)
 *  • Platform URLs: Spotify is wired to the real artist page and releases.
 *    SoundCloud points at the real profile (ugazee, 78 tracks, 587 followers).
 *    Apple Music still points at an Ugazee search — swap it when the official
 *    artist link is ready.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type PlatformKey = "spotify" | "appleMusic" | "soundcloud";

export type Track = {
  title: string;
  duration: string;
  featured?: boolean;
};

export type Release = {
  id: string;
  title: string;
  type: "Single" | "EP" | "Album";
  year: number;
  cover: string;
  blurb: string;
  tracklist: readonly Track[];
  links: Readonly<Record<PlatformKey, string>>;
  accent: string;
};

export type SoundCloudTrack = {
  title: string;
  duration: string;
  artwork: string;
  url: string;
};

export const config = {
  artist: {
    name: "Ugazee",
    handle: "@ugazee",
    location: "Lagos, NG",
    tagline: "Afrobeats from the other side of midnight.",
    bio: "Ugazee makes records for the taxi ride home — sun-warmed drums, midnight melodies, and a December that never really ends.",
    poster: "/img/poster.jpg",
    wallpaper: "/video/ugazee-wallpaper.mp4",
    email: "hello@ugazee.com",
  },

  track: {
    title: "Detty December",
    artist: "Ugazee",
    bpm: 135,
    duration: 186.68, // 3:06 — verified against the delivered master
    cover: "/img/covers/detty-december.jpg",
    album: "Detty December",
    year: 2026,
    audio: {
      mp3: "/audio/detty-december.mp3",
      m4a: "/audio/detty-december.m4a", // fallback for Safari/iOS edge cases
    },
  },

  album: {
    title: "Detty December",
    dropISO: "2026-12-25T00:00:00+01:00",
    dropLabel: "12.25.26",
    preSaveUrl: "https://open.spotify.com/artist/7kfEng4OspTrDhaVjucde6",
  },

  notification: {
    sender: "Ugazee",
    text: "its almost december. album otw",
    timeLabel: "now",
    minDelayMs: 8000,
    maxDelayMs: 20000,
    autoDismissMs: 7000,
  },

  messages: {
    openingMessage: "its almost december. album otw",
    replies: [
      { prompt: "let's go", reply: "we outside. i'll send the addy 🤎" },
      { prompt: "when?!", reply: "12.25. set a reminder. it's a movie." },
    ],
  },

  platforms: {
    spotify: {
      name: "Spotify",
      url: "https://open.spotify.com/artist/7kfEng4OspTrDhaVjucde6",
      color: "#1ED760",
      deep: "#0B2B18",
      label: "Listen on Spotify",
    },
    appleMusic: {
      name: "Apple Music",
      url: "https://music.apple.com/us/search?term=Ugazee",
      color: "#FA2D48",
      deep: "#2B0B12",
      label: "Listen on Apple Music",
    },
    soundcloud: {
      name: "SoundCloud",
      url: "https://soundcloud.com/ugazee",
      color: "#FF5500",
      deep: "#2B1307",
      label: "Listen on SoundCloud",
    },
  } satisfies Record<
    PlatformKey,
    { name: string; url: string; color: string; deep: string; label: string }
  >,

  // Real profile scraped from soundcloud.com/ugazee (25 Nov 2026):
  // 78 tracks, 587 followers, ARTIST PRO, city "ypsi".
  soundcloud: {
    handle: "soundcloud.com/ugazee",
    tier: "ARTIST PRO",
    trackCount: 78,
    followers: 587,
    city: "ypsi",
    description: "🧞® · 🇳🇬 · #DrumsOfLiberation · #GBDJ",
    avatar: "/img/soundcloud/avatar.jpg",
    tracks: [
      {
        title: "lucidity prod me",
        duration: "2:57",
        artwork: "/img/soundcloud/lucidity.jpg",
        url: "https://soundcloud.com/ugazee/lucidity-prod-me",
      },
      {
        title: "eyes foward, straight path prod me & jdolla",
        duration: "2:43",
        artwork: "/img/soundcloud/eyes-foward.jpg",
        url: "https://soundcloud.com/ugazee/eyes-foward-straight-path-prod-me-jdolla",
      },
      {
        title: "chill, faro prod me, tayga, the6ers",
        duration: "2:27",
        artwork: "/img/soundcloud/chill-faro.jpg",
        url: "https://soundcloud.com/ugazee/w-farogun-prod-me-tayga",
      },
      {
        title: "bankroll, bankroll prod me & 97",
        duration: "2:36",
        artwork: "/img/soundcloud/dol.jpg",
        url: "https://soundcloud.com/ugazee/bankroll-thoughts-prod-me-97",
      },
      {
        title: "hitstick prod me & 97",
        duration: "2:43",
        artwork: "/img/soundcloud/dol.jpg",
        url: "https://soundcloud.com/ugazee/hitstick-prod-me-97",
      },
      {
        title: "temp prod me & jayysoul",
        duration: "2:41",
        artwork: "/img/soundcloud/temp.jpg",
        url: "https://soundcloud.com/ugazee/temp-prod-me-jayysoul",
      },
      {
        title: "oshe, flyest prod me & 97",
        duration: "2:37",
        artwork: "/img/soundcloud/dol.jpg",
        url: "https://soundcloud.com/ugazee/oshe-flyest-prod-me-97-v2",
      },
      {
        title: "no styler prod me",
        duration: "2:53",
        artwork: "/img/soundcloud/dol.jpg",
        url: "https://soundcloud.com/ugazee/me-nostyler-prod-me",
      },
      {
        title: "cancun, mexico w/ mofe prod me",
        duration: "2:49",
        artwork: "/img/soundcloud/cancun.jpg",
        url: "https://soundcloud.com/ugazee/cancun-mexico-prod-me",
      },
      {
        title: "backup prod me",
        duration: "2:31",
        artwork: "/img/soundcloud/backup.jpg",
        url: "https://soundcloud.com/ugazee/backup-prod-me",
      },
      {
        title: "paranoia prod me",
        duration: "2:54",
        artwork: "/img/soundcloud/paranoia.jpg",
        url: "https://soundcloud.com/ugazee/paranoia-prod-me",
      },
      {
        title: "b cool prod me",
        duration: "2:36",
        artwork: "/img/soundcloud/b-cool.jpg",
        url: "https://soundcloud.com/ugazee/bcool-prod-me",
      },
    ] satisfies SoundCloudTrack[],
  },

  socials: [
    { label: "Instagram", url: "https://www.instagram.com/explore/tags/ugazee/" },
    { label: "YouTube", url: "https://www.youtube.com/results?search_query=Ugazee" },
    { label: "TikTok", url: "https://www.tiktok.com/search?q=Ugazee" },
  ],

  videos: [
    {
      title: "Detty December",
      subtitle: "Official visualizer",
      meta: "2026 · 3:06",
      thumbnail: "/img/covers/detty-december.jpg",
      url: "https://www.youtube.com/results?search_query=Ugazee+Detty+December",
    },
    {
      title: "Live from Lagos",
      subtitle: "One take, no edits",
      meta: "2026 · shot on iPhone",
      thumbnail: "/img/poster.jpg",
      url: "https://www.youtube.com/results?search_query=Ugazee+Live+from+Lagos",
    },
  ],

  // Real catalogue, copied from open.spotify.com/artist/7kfEng4OspTrDhaVjucde6.
  // Covers live in /public/img/covers. Newest first.
  discography: [
    {
      id: "detty-december",
      title: "Detty December",
      type: "Single",
      year: 2026,
      cover: "/img/covers/detty-december.jpg",
      blurb: "The title track. Out 12.25.26 — the reason the phone won't stop ringing.",
      accent: "#F0A94B",
      tracklist: [{ title: "Detty December", duration: "3:06", featured: true }],
      links: {
        spotify: "https://open.spotify.com/artist/7kfEng4OspTrDhaVjucde6",
        appleMusic: "https://music.apple.com/us/search?term=Ugazee",
        soundcloud: "https://soundcloud.com/ugazee",
      },
    },
    {
      id: "no-fi-whine",
      title: "no fi whine",
      type: "Single",
      year: 2026,
      cover: "/img/covers/no-fi-whine.jpg",
      blurb: "A Juneofive record produced by Ugazee — low-slung and unhurried.",
      accent: "#D96B4A",
      tracklist: [{ title: "no fi whine (with Juneofive)", duration: "2:31" }],
      links: {
        spotify: "https://open.spotify.com/album/6018uoHnW6sVD6g03GVB37",
        appleMusic: "https://music.apple.com/us/search?term=Ugazee",
        soundcloud: "https://soundcloud.com/ugazee",
      },
    },
    {
      id: "cancun-mexico",
      title: "cancun, mexico",
      type: "Single",
      year: 2026,
      cover: "/img/covers/cancun-mexico.jpg",
      blurb: "Sun-drunk and homesick at the same time. Ugazee links with Mofe.",
      accent: "#7FC8C0",
      tracklist: [{ title: "cancun, mexico (with Mofe.)", duration: "2:49" }],
      links: {
        spotify: "https://open.spotify.com/album/7ijA6mZ0mkJUbxLp8UBA8V",
        appleMusic: "https://music.apple.com/us/search?term=Ugazee",
        soundcloud: "https://soundcloud.com/ugazee",
      },
    },
    {
      id: "backup",
      title: "backup",
      type: "Single",
      year: 2026,
      cover: "/img/covers/backup.jpg",
      blurb: "A short, sharp check-in from the 2026 run.",
      accent: "#A9B4D0",
      tracklist: [{ title: "backup", duration: "2:31" }],
      links: {
        spotify: "https://open.spotify.com/album/3Ehuifp0IxiCVOyiMebnBJ",
        appleMusic: "https://music.apple.com/us/search?term=Ugazee",
        soundcloud: "https://soundcloud.com/ugazee",
      },
    },
    {
      id: "ugazee-nigeria",
      title: "Ugazee, Nigeria",
      type: "Album",
      year: 2025,
      cover: "/img/covers/ugazee-nigeria.jpg",
      blurb: "The debut album. Eleven self-produced tracks with Lagos in the bloodstream.",
      accent: "#3FA34D",
      tracklist: [
        { title: "ja Celebrity!", duration: "2:08" },
        { title: "Gazelardo", duration: "2:29" },
        { title: "hellcat, racks on?", duration: "2:26" },
        { title: "yahoo?!", duration: "2:46" },
        { title: "time up!", duration: "2:03" },
        { title: "kashi", duration: "2:22" },
        { title: "ask twin, ask jr!", duration: "2:16" },
        { title: "year 2025", duration: "2:18" },
        { title: "no drugs :/", duration: "2:13" },
        { title: "da rain", duration: "2:25" },
        { title: "foreign guys", duration: "2:28" },
      ],
      links: {
        spotify: "https://open.spotify.com/album/15YQw7CDdulrrORbkKsiRT",
        appleMusic: "https://music.apple.com/us/search?term=Ugazee",
        soundcloud: "https://soundcloud.com/ugazee",
      },
    },
    {
      id: "genieboys-christmas-carol",
      title: "a genieboy's christmas carol",
      type: "EP",
      year: 2025,
      cover: "/img/covers/genieboys-christmas-carol.jpg",
      blurb: "Five songs for the Genieboys, delivered on Christmas Day.",
      accent: "#D9483B",
      tracklist: [
        { title: "stone cold (feat. jayybeenrich)", duration: "2:43" },
        { title: "elf shelf", duration: "2:39" },
        { title: "wakeupgetracks #dol", duration: "2:37" },
        { title: "rip imole", duration: "2:38" },
        { title: "can't stop, don't stop", duration: "2:56" },
      ],
      links: {
        spotify: "https://open.spotify.com/album/23XJJjW6gJiOB2q4Kq5HiZ",
        appleMusic: "https://music.apple.com/us/search?term=Ugazee",
        soundcloud: "https://soundcloud.com/ugazee",
      },
    },
    {
      id: "iskaba-lol-remix",
      title: "Iskaba! LOL (Remix)",
      type: "Single",
      year: 2022,
      cover: "/img/covers/iskaba-lol-remix.jpg",
      blurb: "The 2022 remix that put the Genieboys on the map.",
      accent: "#8B5CF6",
      tracklist: [{ title: "Iskaba! LOL - Remix", duration: "2:34" }],
      links: {
        spotify: "https://open.spotify.com/album/6XZqvyEu1NVEbSq9ipyIKD",
        appleMusic: "https://music.apple.com/us/search?term=Ugazee",
        soundcloud: "https://soundcloud.com/ugazee",
      },
    },
  ] satisfies Release[],

  story: {
    eyebrow: "The December roll-out",
    sections: [
      {
        index: "01",
        kicker: "The catalogue",
        title: "Discography",
        copy: "From the first upload to the record everyone is waiting for. Every sleeve below is a chapter.",
      },
      {
        index: "02",
        kicker: "Shot in Lagos",
        title: "Videos",
        copy: "Golden hour on the Third Mainland, handheld, one take. The visuals stay warm even when the harmattan doesn't.",
      },
      {
        index: "03",
        kicker: "Everywhere at once",
        title: "Listen everywhere",
        copy: "One record, every platform. Pick your poison — the music sounds the same with your eyes closed.",
      },
      {
        index: "04",
        kicker: "The album",
        title: "12.25.26",
        copy: "Detty December, the album. The countdown is real. Save the date, then save the link.",
      },
    ],
  },
} as const;

export type AppId =
  | "spotify"
  | "appleMusic"
  | "soundcloud"
  | "messages"
  | "phone"
  | "safari"
  | "camera"
  | "photos"
  | "clock"
  | "weather"
  | "maps"
  | "notes"
  | "calendar"
  | "settings"
  | "mail"
  | "wallet"
  | "health"
  | "files"
  | "music";

export type IosApp = {
  id: AppId;
  label: string;
  color: string;
  color2?: string;
  kind?: "brand" | "system" | "utility";
};

export const iosApps: IosApp[] = [
  { id: "camera", label: "Camera", color: "#8E8E93", color2: "#3A3A3C" },
  { id: "photos", label: "Photos", color: "#FFD60A", color2: "#FF9F0A" },
  { id: "clock", label: "Clock", color: "#1C1C1E", color2: "#000000" },
  { id: "weather", label: "Weather", color: "#1E88E5", color2: "#4FC3F7" },
  { id: "maps", label: "Maps", color: "#5DBA6B", color2: "#2E8B57" },
  { id: "notes", label: "Notes", color: "#FFD60A", color2: "#E0B800" },
  { id: "calendar", label: "Calendar", color: "#FFFFFF", color2: "#F2F2F7" },
  { id: "settings", label: "Settings", color: "#8E8E93", color2: "#636366" },
  { id: "mail", label: "Mail", color: "#1C8CFF", color2: "#0A6BD6" },
  { id: "wallet", label: "Wallet", color: "#1C1C1E", color2: "#000000" },
  { id: "health", label: "Health", color: "#FF375F", color2: "#FF6482" },
  { id: "files", label: "Files", color: "#2D9CDB", color2: "#1D6FA5" },
];

export const dockApps: IosApp[] = [
  { id: "phone", label: "Phone", color: "#4CD964", color2: "#2CB84A" },
  { id: "safari", label: "Safari", color: "#0A84FF", color2: "#0066CC" },
  { id: "messages", label: "Messages", color: "#34C759", color2: "#28A745" },
  { id: "music", label: "Music", color: "#FC3C44", color2: "#D91E2C" },
];

export const brandApps: IosApp[] = [
  { id: "spotify", label: "Spotify", color: "#1ED760", kind: "brand" },
  { id: "appleMusic", label: "Apple Music", color: "#FA2D48", kind: "brand" },
  { id: "soundcloud", label: "SoundCloud", color: "#FF5500", kind: "brand" },
];

export const pageTwoApps: IosApp[] = [
  { id: "photos", label: "Recents", color: "#FFD60A", color2: "#FF9F0A" },
  { id: "calendar", label: "December", color: "#FFFFFF", color2: "#F2F2F7" },
  { id: "notes", label: "Ideas", color: "#FFD60A", color2: "#E0B800" },
  { id: "health", label: "Health", color: "#FF375F", color2: "#FF6482" },
];

export const featuredRelease = config.discography[0];
