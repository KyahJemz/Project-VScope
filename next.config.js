// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["images.pexels.com", "i.imgur.com", "lh3.googleusercontent.com", "mobilenetrix.com"],
    },
    eslint: {
        ignoreDuringBuilds: true, // eslints
    },
};


module.exports = nextConfig;
