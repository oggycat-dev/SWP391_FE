/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tắt React Strict Mode để tránh double render
  reactStrictMode: false,
  
  // Tắt hoàn toàn dev indicators
  devIndicators: false,

  // Tắt error overlay trong development
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  // Cấu hình Turbopack (Next.js 16+)
  turbopack: {},

  // Tinh chỉnh webpack logging khi dev (nếu không dùng Turbopack)
  webpack: (config, { dev }) => {
    if (dev) {
      config.infrastructureLogging = { level: 'error' };
      config.stats = 'errors-warnings';
    }
    return config;
  },

  // Loại bỏ console trong production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },

  // Tắt các logging không cần thiết
  logging: {
    fetches: {
      fullUrl: false,
    },
  },

  // Cấu hình images để render trực tiếp từ backend (không optimize)
  images: {
    // Bật unoptimized để render trực tiếp URL từ backend
    unoptimized: true,
    // Vẫn giữ remotePatterns để Next.js cho phép load từ các domain này
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '5001',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;