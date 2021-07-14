import { sequelize } from "../DB.js";
import { router } from "../Router.js";
import { param, validationResult } from "express-validator";
import { invalidRequest, notFound } from "../Utils/EndpointResponses.js";

router.get("/api/nouns", async (req, res) => {
  const nouns = await sequelize.models.Noun.findAll();
  res.send({
    nouns,
  });
});

router.get<Params>(
  "/api/nouns/:nounId",
  param("nounId").isInt().toInt(),
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return invalidRequest(res, validationErrors);
    }

    const { nounId } = req.params;
    const noun = await sequelize.models.Noun.findByPk(nounId);
    if (noun === null) {
      notFound(res, `No such noun with id '${nounId}'`);
    } else {
      res.send(noun);
    }
  }
);

interface Params {
  nounId: number;
}
