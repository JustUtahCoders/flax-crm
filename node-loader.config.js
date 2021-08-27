import * as tsLoader from "ts-node/esm";
import * as cssLoader from "@node-loader/postcss";

export default {
  loaders: [tsLoader, cssLoader],
  options: {
    postcss: {
      async resolveConfig(filePath) {
        if (filePath.endsWith(".module.css")) {
          return await import("./postcss-module.config.js");
        } else {
          return await import("./postcss-vanilla.config.js");
        }
      },
    },
  },
};
