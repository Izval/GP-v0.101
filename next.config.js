/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    // Add a rule to handle the undici package
    config.module.rules.push({
      test: /[\\/]node_modules[\\/]undici[\\/].*\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-proposal-private-methods', '@babel/plugin-proposal-class-properties'],
        },
      },
    });

    return config;
  },
  experimental: {
    esmExternals: false,
  },
  // Add this new configuration to ignore the Bitwarden warning
  reactStrictMode: true,
  compiler: {
    reactRemoveProperties: { properties: ['^data-bitwarden-watching$'] },
  },
};

module.exports = nextConfig;