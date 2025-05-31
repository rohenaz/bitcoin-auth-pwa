import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['bsv-bap', '@bsv/sdk'],
  transpilePackages: ['bitcoin-auth', 'bitcoin-backup', 'bitcoin-image'],
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

export default nextConfig;
