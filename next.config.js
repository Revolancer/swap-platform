const gitCommitInfo = require("git-commit-info");
const {
  BugsnagBuildReporterPlugin,
  BugsnagSourceMapUploaderPlugin,
} = require("webpack-bugsnag-plugins");

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
    remotePatterns: 
    process.env.NODE_ENV == 'development' ?
    [
      {
        protocol: "https",
        hostname: "uploads.revolancer.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "app.revolancer.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "uploads.rvdevel.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
        port: "",
        pathname: "/**",
      },
    ]
    :
    [
      {
        protocol: "https",
        hostname: "uploads.revolancer.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "app.revolancer.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  generateBuildId: () => gitCommitInfo().shortHash,
  env: {
    BUILD_ID_ENV: gitCommitInfo().shortHash,
  },
  webpack: (
    /** @type { import('webpack').Configuration } */
    config,
    { buildId, dev, isServer, nextRuntime }
  ) => {
    // Important: return the modified config
    if (!dev && isServer) {
      config.plugins.push(
        new BugsnagBuildReporterPlugin({
          apiKey: process.env.NEXT_PUBLIC_BUGSNAG_KEY,
          appVersion: gitCommitInfo().shortHash,
          releaseStage: process.env.NODE_ENV,
        })
      );
      new BugsnagSourceMapUploaderPlugin({
        apiKey: process.env.NEXT_PUBLIC_BUGSNAG_KEY,
        appVersion: gitCommitInfo().shortHash,
        releaseStage: process.env.NODE_ENV,
        metadata: {
          buildId: buildId,
          dev: dev,
          isServer: isServer,
          nextRuntime: nextRuntime,
        },
      });
    }
    return config;
  },
};

module.exports = nextConfig;
