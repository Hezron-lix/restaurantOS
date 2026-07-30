import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Long-lived cache for animation frame assets.
        // IMPORTANT: if frame content ever changes, rename the files
        // (e.g., add a version suffix like ezgif-frame-001.v2.webp) to
        // force clients to re-fetch. The header alone cannot bust same-name files.
        source: "/sequence/frames/:path*",
        headers: [
          {
            key: "Cache-Control",
            // max-age=86400: frames are fresh for 1 day.
            // stale-while-revalidate=31536000: after that day, browsers serve
            // the cached version instantly while revalidating in the background,
            // for up to 1 year. stale-while-revalidate only activates after
            // max-age expires, so the values must be read in that order.
            value: "public, max-age=86400, stale-while-revalidate=31536000",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
