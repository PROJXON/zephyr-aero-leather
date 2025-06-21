import "dotenv/config";

const nextConfig = {
  output: "standalone",
  images: {
    domains: [
      new URL(process.env.WOOCOMMERCE_API_URL).hostname,
      new URL(process.env.NEXT_PUBLIC_CDN_URL).hostname,
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: new URL(process.env.WOOCOMMERCE_API_URL).hostname,
      },
      {
        protocol: "https",
        hostname: new URL(process.env.NEXT_PUBLIC_CDN_URL).hostname,
      },
    ],
  },
};

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export default nextConfig;