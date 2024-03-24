/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["oslo"]
  },
  images: {
    remotePatterns: [{ hostname: "lh3.googleusercontent.com" }, { hostname: "reference-gallery-images.s3.eu-north-1.amazonaws.com" }]
  },
};

export default nextConfig;
