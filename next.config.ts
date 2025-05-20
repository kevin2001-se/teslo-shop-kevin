import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://res.cloudinary.com/dllf6mjje/image/upload/**')],
  },
};

export default nextConfig;
