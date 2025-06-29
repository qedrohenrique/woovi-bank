import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@woovi-playground/ui'],
  compiler: {
    relay: require('./relay.config'),
  },
};

export default nextConfig;
