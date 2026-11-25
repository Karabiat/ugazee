/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emits .next/standalone for the slim runtime image (see Dockerfile).
  output: "standalone",
  devIndicators: false,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
