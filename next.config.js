/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tắt Turbopack để sử dụng webpack cũ (tương thích tốt hơn)
  experimental: {},
  
  webpack: (config, { isServer }) => {
    // Fallback for Node.js modules in client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        module: false,
        perf_hooks: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig;
