/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reduce logging in development
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*'
      },
    ];
  },
};

export default nextConfig;


