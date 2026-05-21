import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Load env from repo root (.env) and frontend (.env.local) so Clerk keys work in either place.
loadEnvConfig(path.join(dirname, ".."));
loadEnvConfig(dirname);

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(dirname, ".."),
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  }
};

export default nextConfig;
