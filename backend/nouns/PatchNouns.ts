import { sequelize } from "../DB.js";
import { router } from "../Router.js";

router.patch("/api/nouns/:nounId", async (req, res) => {
  const { slug, friendlyName, parentId } = req.body;
  const toUpdate = {
    ...(slug !== undefined && { slug }),
    ...(friendlyName !== undefined && { friendlyName }),
    ...(parentId !== undefined && { parentId }),
  };

  const [numUpdated] = await sequelize.models.noun.update(toUpdate, {
    where: {
      id: req.params.nounId,
    },
  });

  if (numUpdated === 0) {
    res.sendStatus(404);
  } else {
    res.sendStatus(204);
  }
});
