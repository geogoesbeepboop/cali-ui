/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configure CORS for development
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // For now allowing all origins, but you should replace with specific domains in production
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
          },
        ],
      },
    ];
  },
  // Allow images from any domain (adjust as needed)
  images: {
    domains: ['*'],
  },
  // Enable CORS for development
  experimental: {
    allowedDevOrigins: ['george-andrade.com', 'localhost:3001'], // Add other origins as needed
    serverActions: {
      allowedOrigins: ['*'], // Replace with your domain in production
    },
  },
};

module.exports = nextConfig;
