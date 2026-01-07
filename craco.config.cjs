const webpack = require("webpack");
/** @type {import('@craco/craco').CracoConfig} */

module.exports = {
  webpack: {
    configure: (config) => {
      config.devtool = false; // Disable source maps
      config.plugins.push(
        new webpack.DefinePlugin({
          "process.env.REACT_APP_EN_KEY": JSON.stringify(""), // Remove API key
          "process.env.REACT_APP_GOOGLE_API_KEY": JSON.stringify(""), // Remove API key
          "process.env.REACT_APP_BASE_URL_ASSET_TOKEN": JSON.stringify(""), // Remove API key
        })
      );
      return config;
    },
  },
};
