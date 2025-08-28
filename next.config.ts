import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    CUSTOM_KEY: 'klientti',
  },
  images: {
    domains: ['klientti.com', 'localhost'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ['firebase', 'react', 'next'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Otimizações de performance
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Headers de segurança e performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/(.*\\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // Redirects para SEO
  async redirects() {
    return [
      {
        source: '/pesquisou',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
