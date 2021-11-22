import { router } from "./Router.js";
import { notFound } from "./Utils/EndpointResponses.js";

router.use("/api", (req, res, next) => {
  return notFound(res, `No API implemented for ${req.method} ${req.path}`);
});
