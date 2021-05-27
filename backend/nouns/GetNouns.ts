import { sequelize } from "../DB.js";
import { router } from "../Router.js";

router.get("/api/nouns", async (req, res) => {
  const nouns = await sequelize.models.Noun.findAll();
  res.send({
    nouns,
  });
});

router.get("/api/nouns/:nounId", async (req, res) => {
  const noun = await sequelize.models.Noun.findByPk(req.params.nounId);
  if (noun === null) {
    res.sendStatus(404);
  } else {
    res.send(noun);
  }
});
