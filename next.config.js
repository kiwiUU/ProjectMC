/** @type {import('next').NextConfig} */

const { i18n } = require("./next-i18next.config.js");

const nextConfig = {
  reactStrictMode: false,
  i18n,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      http: false,
      https: false,
      crypto: false,
      stream: false,
      querystring: false,
    };

    return config;
  },
};

module.exports = nextConfig;
