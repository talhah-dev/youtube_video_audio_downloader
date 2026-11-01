import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@distube/ytdl-core", "ffmpeg-static"],
  outputFileTracingIncludes: {
    "/api/**/*": ["./node_modules/@distube/ytdl-core/**/*", "./node_modules/ffmpeg-static/**/*"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
