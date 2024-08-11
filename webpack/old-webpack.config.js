const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const fs = require('fs');

module.exports = {
  entry:{
     // "scripts/content.script": "./src/dist/scripts/content.script.js",
    // "scripts/background.script": "./src/dist/scripts/content.script.js",

    ...fs.readdirSync('./src/dist/scripts').reduce((acc, file) => {
      const name = path.basename(file, '.js');
      acc[`scripts/${name}`] = `./src/dist/scripts/${file}`;
      return acc;
    }, {}),
  }, 
  output: {
    filename: "dist/[name].js",
    path: path.resolve(__dirname, ".build-release"),
  },
  mode: "production",
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "src/html",
          to: "html",
        },
      ],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "src/css/",
          to: "css",
        },
      ],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "src/icons",
          to: "icons",
        },
      ],
    }),
    new CopyPlugin({
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
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          // Add the variable names you want to exclude from renaming here
          mangle: {
            reserved: [
              "ebexIdentifier",
              "ePvercel",
              "bv",
              "cv",
              "dv",
              "ePpython",
              "bpy",
              "cpy",
              "dpy",
              "showModal"
            ]
          },
          keep_fnames: [
            "ebexIdentifier",
            "ePvercel",
            "bv",
            "cv",
            "dv",
            "ePpython",
            "bpy",
            "cpy",
            "dpy",
            /showModal/
          ]
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/,
        use: "html-loader",
      },
      // Add loaders for images, etc.
    ],
  },
};

//build command = npx webpack --config webpack.config.js
