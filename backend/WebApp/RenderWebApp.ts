import { Response } from "express";
import { createElement } from "react";
import ReactDOMServer from "react-dom/server.js";
import { App, RouterContext } from "../../frontend/App.js";

export const renderWebApp = async (req, res: Response) => {
  let stream,
    routerContext: RouterContext = {};
  try {
    stream = ReactDOMServer.renderToNodeStream(
      createElement(App, {
        routerContext,
        reqUrl: req.url,
      })
    );
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

  res.write("<!DOCTYPE html>");

  stream.pipe(res);
};
