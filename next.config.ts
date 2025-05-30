import type { NextConfig } from "next";
import { createMDX } from 'fumadocs-mdx/next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['bsv-bap', '@bsv/sdk'],
  transpilePackages: ['bitcoin-auth', 'bitcoin-backup', 'bitcoin-image'],
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  webpack: (config, { isServer }) => {
    // Fix for bitcoin-auth and related packages
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
