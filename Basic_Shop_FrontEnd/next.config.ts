import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Cho phép load ảnh từ các domain bên ngoài nếu cần */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
