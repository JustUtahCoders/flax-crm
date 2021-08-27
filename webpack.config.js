import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { WebpackManifestPlugin } from "webpack-manifest-plugin";
import TerserPlugin from "terser-webpack-plugin";
import vanillaPostCssConfig from "./postcss-vanilla.config.js";
import modulesPostCssConfig, {
  generateScopedName,
} from "./postcss-module.config.js";

console.log("generateScopedName", generateScopedName);

export default async (webpackConfigEnv, argv) => {
  const isProd = webpackConfigEnv.prod;

  return {
    entry: path.resolve(process.cwd(), "frontend/entry.tsx"),
    output: {
      path: path.resolve(process.cwd(), "dist"),
      filename: isProd ? "flax.[contenthash].js" : "flax.js",
      assetModuleFilename: "media/[name].[hash:8][ext]",
    },
    mode: "development",
    devtool: "source-map",
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              // lodash'es deburrLetter function has unicode chars that don't work in all browsers yet
              // https://github.com/terser/terser/issues/1005#issuecomment-904213337
              ascii_only: true,
            },
          },
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
        },
        {
          test: /\.css$/i,
          exclude: /\.module\.css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: vanillaPostCssConfig,
              },
            },
          ],
          include: [path.join(process.cwd(), "frontend"), /node_modules/],
        },
        {
          test: /\.module\.css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: true,
                importLoaders: 1,
              },
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: modulesPostCssConfig,
              },
            },
          ],
          include: [path.join(process.cwd(), "frontend"), /node_modules/],
        },
        {
          test: [
            /\.bmp$/,
            /\.gif$/,
            /\.jpe?g$/,
            /\.png$/,
            /\.eot$/,
            /\.ttf$/,
            /\.svg$/,
            /\.woff$/,
            /\.woff2$/,
          ],
          type: "asset",
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
