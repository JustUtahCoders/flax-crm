import { sequelize } from "../DB.js";
import { router } from "../Router.js";
import { param, validationResult } from "express-validator";
import { invalidRequest } from "../Utils/EndpointResponses.js";

router.delete<Params>(
  "/api/nouns/:nounId",
  param("nounId").isInt().toInt(),
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return invalidRequest(res, validationErrors);
    }

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
  }
);

interface Params {
  nounId: number;
}
