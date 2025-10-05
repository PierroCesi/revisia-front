import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Configuration pour les fichiers statiques
  trailingSlash: false,
  // Configuration pour la production
  output: 'standalone',
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

export default withBundleAnalyzer(nextConfig);
