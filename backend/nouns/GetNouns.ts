import { sequelize } from "../DB.js";
import { router } from "../Router.js";

router.get("/api/nouns", async (req, res) => {
  const nouns = await sequelize.models.noun.findAll();
  res.send({
    nouns,
  });
});
