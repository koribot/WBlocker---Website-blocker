const { merge } = require("webpack-merge");
const path = require("path");
const webpackCommon = require("./webpack.common.config.js");
const srcDir = path.join(__dirname, "..", "src");
const fs = require('fs');

module.exports = merge(webpackCommon, {
  mode: "production",
  entry: {
    ...fs.readdirSync('./src/scripts').reduce((acc, file) => {
      const name = path.basename(file, '.js');
      acc[`scripts/${name}`] = `./src/scripts/${file}`;
      return acc;
    }, {}),
    ...fs.readdirSync('./src/utils').reduce((acc, file) => {
      const name = path.basename(file, '.js');
      if (name !== 'socket.script') {
        acc[`utils/${name}`] = `./src/utils/${file}`;
      }
      return acc;
    }, {}),
  },
  output: {
    path: path.join(__dirname, "../.production-build"),
    filename: "[name].js",
  },
});
