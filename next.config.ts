import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimisations pour Turbopack
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Optimisation des images
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Bundle analyzer pour voir la taille
  webpack: (config) => {
    // Désactiver certains plugins lourds en dev
    if (process.env.NODE_ENV === 'development') {
      config.optimization.splitChunks = false;
    }
    return config;
  },
};

export default nextConfig;
