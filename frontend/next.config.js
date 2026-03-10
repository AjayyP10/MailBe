/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_AUTHENTIK_URL: process.env.NEXT_PUBLIC_AUTHENTIK_URL || 'http://localhost:9000',
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
