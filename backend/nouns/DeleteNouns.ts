import { sequelize } from "../DB.js";
import { router } from "../Router.js";

router.delete("/api/nouns/:nounId", async (req, res) => {
  const numDeleted = await sequelize.models.Noun.destroy({
    where: {
      id: req.params.nounId,
    },
  });
  if (numDeleted === 0) {
    res.sendStatus(404);
  } else {
    res.sendStatus(200);
  }
});
