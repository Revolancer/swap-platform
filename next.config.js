/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "react-tag-input",
    "react-dnd",
    "dnd-core",
    "@react-dnd/invariant",
    "@react-dnd/asap",
    "@react-dnd/shallowequal",
  ],
};

module.exports = nextConfig;
