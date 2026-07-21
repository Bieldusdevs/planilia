/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
  // Vercel optimizations
  output: 'standalone',
  // Trailing slash for better routing
  trailingSlash: false,
  // Remove console.log in production
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.plugins.push(
        new (require('webpack')).DefinePlugin({
          'console.log': 'function(){}',
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig;
