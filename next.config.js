/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  webpack: (config, { isServer }) => {
    // Add a rule to handle JSON files
    config.module.rules.push({
      test: /\.json$/,
      loader: "json-loader",
    })

    // If your JSON file is used on the server-side, you might need to handle it differently
    if (isServer) {
      // For example, you might want to use 'ignore-loader' for server-side
      config.module.rules.push({
        test: /api_radio_id\.json$/,
        loader: "ignore-loader",
      })
    }

    return config
  },
}

module.exports = nextConfig
