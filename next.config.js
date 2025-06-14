/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
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
