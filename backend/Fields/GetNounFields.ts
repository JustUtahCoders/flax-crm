import { router } from "../Router.js";
import { param, validationResult } from "express-validator";
import { Field, FieldModel } from "../../models/field.js";
import { invalidRequest, notFound } from "../Utils/EndpointResponses.js";
import { sequelize } from "../DB.js";

router.get<Params, ResponseBody, RequestBody>(
  "/api/nouns/:nounId/fields",
  param("nounId").isInt().toInt(),

  async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return invalidRequest(res, validationErrors);
    }

    const { nounId } = req.params;

    let fields: FieldModel | null;

    try {
      fields = await sequelize.models.Field.findAll<FieldModel>({
        where: {
          nounId,
        },
      });
    } catch (err) {
      console.error(err);
      notFound(res, `No such noun with id '${nounId}'`);
      return;
    }

    res.status(200).json({ fields });
  }
);

interface Params {
  nounId: number;
}

interface ResponseBody {
  fields: Field[];
}

type RequestBody = void;
