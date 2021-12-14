module.exports = {
  // development or production
  mode: "development",

  devServer: {
    contentBase: "dist",
    open: true,
  },

  entry: `./src/assets/js/main.js`,
  // babel
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
              ],
            },
          },
        ],
      },
    ],
  },

  output: {
    filename: "bundle.js",
  },
};
