/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
    // Enable styled-components
    styledComponents: true,
  },
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig 