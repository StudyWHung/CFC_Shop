import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Tắt biểu tượng chữ N tròn (Dev Indicator) ở góc màn hình */
  devIndicators: false,

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
