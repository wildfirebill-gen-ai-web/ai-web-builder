import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@awb/core', '@awb/ui', '@awb/config'],
  experimental: {
    turbo: {},
  },
}

export default nextConfig
