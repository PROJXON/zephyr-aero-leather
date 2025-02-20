const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zephyr.local",
      },
    ],
  },
};

// Enable only for local development
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

module.exports = nextConfig;
