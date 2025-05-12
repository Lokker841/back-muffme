/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: {
      rules: {
        // Disable server-side rendering for API routes
        '/(api|trpc)(.*)': { ssr: false }
      }
    }
  }
}

module.exports = nextConfig 