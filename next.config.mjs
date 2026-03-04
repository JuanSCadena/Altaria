/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // Enable modern formats
        formats: ['image/avif', 'image/webp'],
        // Define responsive breakpoints
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        // Minimize quality — our source images are already JPG
        minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache
    },
    // Optimize bundle
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
    },
};

export default nextConfig;
