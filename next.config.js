/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  output: 'standalone',
  // assetPrefix: '/dashboard',
  
  images: {
    domains: [
      "via.placeholder.com",
      "images.pexels.com",
      "placehold.co",
      "www.pexels.com",
      "maintains-usb-bell-with.trycloudflare.com",
      "ui-avatars.com",
      "api.hrlynx.ai",
      "hrlynx.ai",
      "www.hrlynx.ai"
    ],
  },
};

module.exports = nextConfig;
