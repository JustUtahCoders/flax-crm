import { sequelize } from "../DB.js";
import { router } from "../Router.js";

router.post("/api/nouns", async (req, res) => {
  const { tableName, slug, friendlyName, parentId } = req.body;
  const newNoun = await sequelize.models.noun.create({
    tableName,
    slug,
    friendlyName,
    parentId,
  });
  if (newNoun) {
    res.status(201).send(newNoun);
  } else {
    res.status(500);
  }
});
