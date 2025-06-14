/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  generateEtags: false,
  poweredByHeader: false,

  images: {
    unoptimized: true,
    domains: [
      'img.shields.io',
      'raw.githubusercontent.com',
      'github.com'
    ]
  },

  swcMinify: true,
  compress: true
}

module.exports = nextConfig
