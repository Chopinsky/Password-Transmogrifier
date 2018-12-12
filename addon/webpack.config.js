var path = require("path");

module.exports = {
  mode: "production",
  entry: "./popup.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "popup.bundle.js"
  },
  module: {
    rules: [{ test: /\.js$/, use: "babel-loader" }]
  },
  devtool: "source-map"
};
