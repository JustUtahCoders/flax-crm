import { router } from "./Router.js";

router.use("/api", (req, res, next) => {
  res.status(404).send("No such api");
});
