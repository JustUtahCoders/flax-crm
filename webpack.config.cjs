const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");

module.exports = (webpackConfigEnv, argv) => {
  const isProd = webpackConfigEnv.prod;

  return {
    entry: path.resolve(process.cwd(), "frontend/entry.tsx"),
    output: {
      path: path.resolve(process.cwd(), "dist"),
      filename: isProd ? "flax.[contenthash].js" : "flax.js",
    },
    mode: "development",
    devtool: "source-map",
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
          include: [path.join(__dirname, "frontend"), /node_modules/],
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: require.resolve("url-loader"),
          options: {
            limit: 10000,
            name: "media/[name].[hash:8].[ext]",
          },
        },
        {
          test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
          loader: require.resolve("file-loader"),
          options: {
            name: "/media/[name].[hash:8].[ext]",
          },
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: isProd ? "[name].[contenthash].css" : "[name].css",
      }),
      new WebpackManifestPlugin({
        fileName: "webpack-manifest.json",
        publicPath: "",
      }),
    ],
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  };
};
