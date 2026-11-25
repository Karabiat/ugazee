import type { Metadata, Viewport } from "next";
import "./globals.css";
import { config } from "@/lib/config";

const title = `${config.artist.name} — ${config.track.title}`;
const description = `${config.artist.tagline} ${config.track.title} by ${config.artist.name} — an interactive iPhone home screen, a live Dynamic Island, and the December roll-out.`;

export const metadata: Metadata = {
  metadataBase: new URL("https://ugazee.com"),
  title,
  description,
  applicationName: `${config.artist.name} OS`,
  authors: [{ name: config.artist.name }],
  keywords: [
    "Ugazee",
    "Detty December",
    "Afrobeats",
    "Lagos",
    "interactive",
    "music",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    siteName: config.artist.name,
    images: [
      {
        url: config.artist.poster,
        width: 576,
        height: 848,
        alt: `${config.artist.name} — ${config.track.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [config.artist.poster],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050403",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
