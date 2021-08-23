import { router } from "../Router.js";

router.get("/api/health", async (req, res) => {
  res.status(200).json({
    message: "Server is running",
  });
});
