import { Response } from "express";
import { createElement } from "react";
import ReactDOMServer from "react-dom/server.js";
import { App, AppProps, RouterContext } from "../../frontend/App.js";

export const renderWebApp = async (req, res: Response) => {
  const routerContext: RouterContext = {};

  const isProd = process.env.NODE_ENV === "production";

  let webpackManifest = {};

  if (isProd) {
    // @ts-ignore
    webpackManifest = (await import("../webpack-manifest.json")).default;
  }

  console.log("manifest", webpackManifest);

  const props: AppProps = {
    routerContext,
    reqUrl: req.url,
    assetBase: isProd
      ? "https://storage.googleapis.com/flax-crm-frontend/dist"
      : "http://localhost:7700",
    cssFiles: [isProd ? webpackManifest["main.js"] : "main.css"],
    jsFiles: [isProd ? webpackManifest["main.css"] : "flax.js"],
  };

  let stream;
  try {
    stream = ReactDOMServer.renderToNodeStream(createElement(App, props));
  } catch (err) {
    console.log("ERROR", err);
    return res.status(500).json({
      errors: `Failed to generate HTML`,
    });
  }

  if (routerContext.url) {
    return res.redirect(routerContext.url);
  }

  stream.on("error", (err) => {
    console.log("ERROR", err);
  });

  stream.pipe(res);
};
