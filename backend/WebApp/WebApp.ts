import { Response } from "express";
import { router } from "../Router.js";
import { createElement } from "react";
import ReactDOMServer from "react-dom/server.js";
import { App, RouterContext } from "../../frontend/App.js";

router.use(async (req, res: Response) => {
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

  stream.pipe(res);
});
