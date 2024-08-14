const { merge } = require('webpack-merge');
const webpackCommon = require('./webpack.common.config');
const path = require("path");
const srcDir = path.join(__dirname, "..", "src");
const fs = require('fs');
module.exports = merge(webpackCommon, {
    devtool: 'inline-source-map',
    mode: 'development',
    entry: {
      ...fs.readdirSync('./src/scripts').reduce((acc, file) => {
        const name = path.basename(file, '.js');
        acc[`scripts/${name}`] = `./src/scripts/${file}`;
        return acc;
      }, {}),
      ...fs.readdirSync('./src/utils').reduce((acc, file) => {
        const name = path.basename(file, '.js');
        acc[`utils/${name}`] = `./src/utils/${file}`;
        return acc;
      }, {}),
    },
    output: {
      path: path.join(__dirname, "../.dev-build"),
      filename: "[name].js",
    },
});

