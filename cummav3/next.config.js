/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cummaimages.s3.eu-north-1.amazonaws.com'],
  },
  eslint: {
        ignoreDuringBuilds: true,
    },
  typescript: {
        ignoreBuildErrors: true,
  }
}

module.exports = nextConfig