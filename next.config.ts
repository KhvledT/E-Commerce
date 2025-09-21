import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "ecommerce.routemisr.com",
        protocol: "https",
        pathname: "/Route-Academy-products/**",
      },
      {
        hostname: "ecommerce.routemisr.com",
        protocol: "https",
        pathname: "/Route-Academy-brands/**",
      },
      {
        hostname: "ecommerce.routemisr.com",
        protocol: "https",
        pathname: "/Route-Academy-categories/**",
      },
    ],
  },
};

export default nextConfig;
