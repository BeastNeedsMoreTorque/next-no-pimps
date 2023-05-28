/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    // domains: ['127.0.0.1'],
    remotePatterns: [
        {
        protocol: 'https',
        hostname: 'crests.football-data.org',
        //port: '',
        //pathname: '/account123/**',
        },
    ],
},
};

module.exports = nextConfig
