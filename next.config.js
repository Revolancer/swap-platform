/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "react-tag-input",
    "react-dnd",
    "dnd-core",
    "@react-dnd/invariant",
    "@react-dnd/asap",
    "@react-dnd/shallowequal",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploads.revolancer.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
