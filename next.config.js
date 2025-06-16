require("dotenv").config();

const nextConfig = {
  images: {
    domains: [
      'api.zephyraeroleather.com',
      'zephyraeroleather.com',
      'zephyraeroleather.com'
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.zephyraeroleather.com",
      },
      {
        protocol: "https",
        hostname: "zephyraeroleather.com",
      },
      {
        protocol: "https",
        hostname: "*.zephyraeroleather.com",
      }
    ],
  },
};

// Enable only for local development
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

module.exports = nextConfig;
