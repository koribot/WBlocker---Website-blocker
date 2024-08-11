const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");
const fs = require('fs');
 
module.exports = {
    // Uncomment if you do not want background scrpt to be --watch
    // optimization: {
    //     splitChunks: {
    //         name: "vendor",
    //         chunks(chunk) {
    //           return chunk.name !== 'background';
    //         }
    //     },
    // },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".ts", ".js"],
    },
    plugins: [
      fs.existsSync("src/html") && fs.readdirSync("src/html").length > 0 && new CopyPlugin({
        patterns: [
          {
            from: "src/html",
            to: "html",
          },
        ],
      }),
      fs.existsSync("src/css/") && fs.readdirSync("src/css/").length > 0 && new CopyPlugin({
        patterns: [
          {
            from: "src/css/",
            to: "css",
          },
        ],
      }),
      fs.existsSync("src/icons") && fs.readdirSync("src/icons").length > 0 && new CopyPlugin({
        patterns: [
          {
            from: "src/icons",
            to: "icons",
          },
        ],
      }),
      fs.existsSync("src/lib-js") && fs.readdirSync("src/lib-js").length > 0 && new CopyPlugin({
        patterns: [
          {
            from: "src/lib-js",
            to: "lib-js",
          },
        ],
      }),
      new CopyPlugin({
        patterns: [
          {
            from: "src/manifest.json",
            to: "./manifest.json",
          },
        ],
      }),
    ],
};