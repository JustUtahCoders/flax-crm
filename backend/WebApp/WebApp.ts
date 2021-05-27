import { router } from "../Router.js";
import { createElement } from "react";
import ReactDOMServer from "react-dom/server.js";
import { App } from "../../frontend/App.js";

router.use(async (req, res) => {
  let stream;
  try {
    stream = ReactDOMServer.renderToNodeStream(createElement(App));
  } catch (err) {
    console.log("ERROR", err);
  }

  stream.on("error", (err) => {
    console.log("ERROR", err);
  });

  stream.pipe(res);
});
