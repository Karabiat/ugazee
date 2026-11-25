/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emits .next/standalone for the slim runtime image (see Dockerfile).
  output: "standalone",
  devIndicators: false,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    // Static media in /public is served with `Cache-Control: max-age=0` by
    // default, which forces a full re-download on every visit. These are
    // content-addressed by filename, so bump the filename (e.g. -v2.mp4)
    // when replacing an asset.
    const immutable = [
      { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
    ];
    return [
      { source: "/video/:path*", headers: immutable },
      { source: "/audio/:path*", headers: immutable },
      { source: "/img/:path*", headers: immutable },
    ];
  },
};

export default nextConfig;
