import { sequelize } from "../DB.js";
import { router } from "../Router.js";
import { param, validationResult } from "express-validator";
import { invalidRequest } from "../Utils/EndpointResponses.js";

router.patch<Params>(
  "/api/nouns/:nounId",
  param("nounId").isInt().toInt(),
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return invalidRequest(res, validationErrors);
    }

    const { slug, friendlyName, parentId } = req.body;
    const toUpdate = {
      ...(slug !== undefined && { slug }),
      ...(friendlyName !== undefined && { friendlyName }),
      ...(parentId !== undefined && { parentId }),
    };

    const [numUpdated] = await sequelize.models.Noun.update(toUpdate, {
      where: {
        id: req.params.nounId,
      },
    });

    if (numUpdated === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  }
);

interface Params {
  nounId: number;
}
