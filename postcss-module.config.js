import cssModules from "postcss-modules";
import autoprefixer from "autoprefixer";

export const generateScopedName = "[local]-[md5:contenthash:base64:10]";

export default {
  plugins: [
    autoprefixer(),
    cssModules({
      getJSON(cssFilename, json, outputFilename) {
        // Do not write the JSON to disk
      },
      generateScopedName,
    }),
  ],
};
