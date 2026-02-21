import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "cdn.prod.website-files.com",
      // you can add more, e.g. "res.cloudinary.com", "images.unsplash.com"
    ],
  },

  async rewrites() {
    return [
      // {
      //   source: "/ingest/static/:path*",
      //   destination: "https://us-assets.i.posthog.com/static/:path*",
      // },
      // {
      //   source: "/ingest/:path*",
      //   destination: "https://us.i.posthog.com/:path*",
      // },
      // {
      //   source: "/ingest/flags",
      //   destination: "https://us.i.posthog.com/flags",
      // },
    ];
  },

  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
